import React, { Component } from 'react';
import { connect } from "react-redux";

// Redux Store
import { Store } from '../redux/store';
import {
  Action,
  addEntranceLink,
  updateInventory,
  updateServerConnectionStatus,
  updateDeviceList,
  updateConnectedDevice,
  resetDeviceData,
  updateAppSettings
} from "../redux/actions";
import {
  // Selectors
  doesEntranceLinkExistWrapper,
  getNotes,
  getInventoryState,
  getServerConnectionStatus,
  getDeviceList,
  getConnectedDevice,
  getSettings,

  // Types
  DoesEntranceLinkExistMethodSignature
} from '../redux/selectors';

// Helper Classes
import { Usb2SnesClient } from './usb2snes-client/Usb2SnesClient';
import { LttpMemoryParser } from './parser/LttpMemoryParser';
import { LocationBuffer } from './tracker/location/LocationBuffer';
import { LocationTracker } from './tracker/location/LocationTracker';
import { ItemTracker } from './tracker/item/ItemTracker';

// Common Types
import { Location } from '../common/locations';  // Only used as a type in this file
import { InventoryState } from '../common/inventory';  // Only used as a type in this file
import { GlobalConfig, AppConfig, MemorySegmentConfig } from '../common/types/config.types';
import {
  DeviceName,
  DeviceList,
  ConnectedDevice,
  ConnectionStatus,
  MemorySegmentType
} from '../common/types/devices.types';
import { InventoryStateUpdate } from '../common/types/inventory.types';
import { LocationLink, EntranceLink } from '../common/types/locations.types';
import { EntranceLocationId } from '../common/types/mapData.types';
import { Notes as NotesType } from '../common/types/notes.types';
import { Settings as SettingsType, AppSettings } from '../common/types/settings.types';

// React Components
import Connections from './Connections';
import { Notes } from './Notes';
import { Settings } from './Settings';
import './index.css';

// Utility Methods
import { getLocationById, getLocationsOnScreen } from '../common/mapData';

interface StoreStateProps {
  notes: NotesType;
  inventoryState: InventoryState;
  deviceList: DeviceList;
  connectedDevice: ConnectedDevice;
  serverConnectionStatus: ConnectionStatus;
  settings: SettingsType;
  doesEntranceLinkExist: DoesEntranceLinkExistMethodSignature;
}

interface StoreReducerProps {
  addEntranceLink: (newEntranceLink: EntranceLink) => Action;
  updateInventory: (inventoryStateUpdate: InventoryStateUpdate) => Action;
  updateServerConnectionStatus: (connectionStatus: ConnectionStatus) => Action;
  updateDeviceList: (deviceList: DeviceList) => Action;
  updateConnectedDevice: (connectedDevice: ConnectedDevice) => Action;
  resetDeviceData: () => Action;
  updateAppSettings: (settings: AppSettings) => Action;
}

type AppProps = StoreStateProps & StoreReducerProps & {
  globalConfig: GlobalConfig;
};

interface AppState {
  config: AppConfig;

  // Helper classes
  client: Usb2SnesClient;
  parser: LttpMemoryParser;
  locationTracker: LocationTracker;
  itemTracker: ItemTracker;

  /**
   * An object which stores the 4 most recent locations received from the game.
   * When a new location appears, the oldest location is removed from the internal queue.
   * The middle 2 locations (location 2 and 3) are the ones compared to determine entrance links.
   * The locations at each end (location 1 and 4) serve as backups incase the above main locations
   *  contain incorrect information.
   * Locations can contain incorrect information due to a subroutine that runs in game that writes
   *  over the overworld index value during the load routine. This incorrect value can be seen for
   *  ~5 frames.
   * Therefore this incorrect value will not be seen for 2 continuous Locations (due to the duration
   *  of the poll interval) allowing the previous/next location to be used as a backup for any given
   *  location.
   */
  locationBuffer: LocationBuffer;

  // Interval tracking IDs
  locationPollIntervalId: number;
  inventoryPollIntervalId: number;
}

class App extends Component<AppProps, AppState> {
  state: AppState = {
    config: this.props.globalConfig.appConfig,
    client: new Usb2SnesClient({
      listDevicesCallback: this.updateStoreDeviceList.bind(this),
      getDeviceInfoCallback: this.updateStoreConnectedDevice.bind(this),
      readMemoryCallback: this.updateGameData.bind(this),
      connectionStatusUpdateCallback: this.updateStoreServerConnectionStatus.bind(this),
    }),
    parser: new LttpMemoryParser(),
    locationTracker: new LocationTracker({
      utilityMethods: {
        getLocationById,
        getLocationsOnScreen,
        doesEntranceLinkExist: this.doesEntranceLinkExist.bind(this)
      },
      config: this.props.globalConfig.locationTrackerConfig
    }),
    itemTracker: new ItemTracker(),
    locationBuffer: new LocationBuffer(),
    locationPollIntervalId: this.props.globalConfig.appConfig.initialIntervalId,
    inventoryPollIntervalId: this.props.globalConfig.appConfig.initialIntervalId
  };

  componentDidUpdate(prevProps: AppProps) {
    // Connection Status updated
    if (prevProps.serverConnectionStatus !== this.props.serverConnectionStatus) {
      this.handleServerConnectionStatusChange(prevProps.serverConnectionStatus, this.props.serverConnectionStatus);
    }
  }

  componentWillUnmount() {
    this.stopPolling();
  }

  render() {
    return (
      <div className="App">
        <Connections
          devices={this.props.deviceList}
          refreshDeviceList={this.refreshDeviceList.bind(this)}
          connectToDevice={this.connectToDevice.bind(this)}
          reconnectToServer={this.reconnectToServer.bind(this)}
        />
        <Settings
          settings={this.props.settings}
          updateAppSettings={this.updateAppSettings.bind(this)}
        />
        <Notes
          notes={this.props.notes}
        />
      </div>
    );
  }

  /**
   * Callback methods passed down to usb2snes client
   */
  private updateStoreDeviceList(deviceList: DeviceList): void {
    this.props.updateDeviceList(deviceList);
  }

  private updateStoreServerConnectionStatus(connectionStatus: ConnectionStatus): void {
    this.props.updateServerConnectionStatus(connectionStatus);
  }

  private updateStoreConnectedDevice(connectedDevice: ConnectedDevice): void {
    this.props.updateConnectedDevice(connectedDevice);
  }

  private async updateGameData(byteData: Blob, segmentAlias: string): Promise<void> {
    switch (segmentAlias as MemorySegmentType) {
      case MemorySegmentType.LOCATION:
        const newLocation: Location = await this.state.parser.parseLocationSegment(byteData);
        this.state.locationBuffer.add(newLocation);

        let entranceLink: EntranceLink | null;
        let mainLocationLink: LocationLink, backupLocations: LocationLink;
        try {
          mainLocationLink = this.state.locationBuffer.getLocationLink();
          backupLocations = this.state.locationBuffer.getBackupLocations();
        } catch (error) {
          // Not enough locations to track entrance links
          console.debug(error.message);
          return;
        }

        try {
          entranceLink = this.state.locationTracker.processLocationLink(mainLocationLink, backupLocations);
        } catch (error) {
          // TODO (BACKLOG): Failure could be due to inconsistent entrance links possibly due to ROM change. Handle better.
          console.error(error.name, "-", error.message);
          return;
        }

        if (entranceLink !== null) {
          this.props.addEntranceLink(entranceLink);
        }
        return;

      case MemorySegmentType.INVENTORY:
        const currentInventoryState: InventoryState = await this.state.parser.parseInventorySegment(byteData);
        let inventoryUpdate: InventoryStateUpdate = this.state.itemTracker.getInventoryStateUpdates(
          this.props.inventoryState,
          currentInventoryState
        );

        if (Object.keys(inventoryUpdate).length > 0) {
          this.props.updateInventory(inventoryUpdate);
        }
        return;

      default:
        console.error("Unknown Memory Segment Type");
    }
  }

  /**
   * Methods passed to LocationTracker instance
   */
  private doesEntranceLinkExist(startLocationId: EntranceLocationId, endLocationId: EntranceLocationId): boolean {
    return this.props.doesEntranceLinkExist(startLocationId, endLocationId);
  }

  /**
   * Methods passed to connections page
   */
  private refreshDeviceList(): void {
    this.state.client.listDevices();
  }

  private connectToDevice(deviceName: DeviceName): void {
    this.state.client.connect(deviceName);
  }

  private reconnectToServer(): void {
    this.props.resetDeviceData();
    this.state.client.reconnectToServer();
  }

  /**
   * Methods passed down to Settings page
   */
  private updateAppSettings(settings: AppSettings): void {
    this.props.updateAppSettings(settings);
  }

  /* Interval handlers */
  private handleServerConnectionStatusChange(
    prevConnectionStatus: ConnectionStatus,
    currentConnectionStatus: ConnectionStatus
  ): void {
    if (currentConnectionStatus === ConnectionStatus.CONNECTED) {
      // Connection established to device. Start polling and return.
      this.startPolling();
      return;
    }

    if (prevConnectionStatus === ConnectionStatus.CONNECTED) {
      // Connection to device disconnected. Clear location queue. Stop any intervals that have been setup.
      this.state.locationBuffer.clear();
      this.stopPolling();
    }
  }

  private startPolling(): void {
    this.setState({
      locationPollIntervalId: window.setInterval(this.getCurrentLocation.bind(this), this.state.config.locationPollIntervalLength),
      inventoryPollIntervalId: window.setInterval(this.getCurrentInventoryState.bind(this), this.state.config.inventoryPollIntervalLength)
    });
  }

  private stopPolling(): void {
    window.clearInterval(this.state.locationPollIntervalId);
    window.clearInterval(this.state.inventoryPollIntervalId);

    this.setState({
      locationPollIntervalId: this.state.config.initialIntervalId,
      inventoryPollIntervalId: this.state.config.initialIntervalId
    });
  }

  // Read location memory segment using the Usb2Snes client
  private getCurrentLocation(): void {
    const segmentConfig: MemorySegmentConfig = this.props.globalConfig.memorySegmentConfig.locationSegment;
    this.state.client.readMemory(segmentConfig.baseAddress, segmentConfig.readLength, segmentConfig.type);
  }

  // Read inventory memory segment using the Usb2Snes client
  private getCurrentInventoryState(): void {
    const segmentConfig: MemorySegmentConfig = this.props.globalConfig.memorySegmentConfig.inventorySegment;
    this.state.client.readMemory(segmentConfig.baseAddress, segmentConfig.readLength, segmentConfig.type);
  }
}

function mapStoreStateToProps(store: Store): StoreStateProps {
  return {
    notes: getNotes(store),
    inventoryState: getInventoryState(store),
    deviceList: getDeviceList(store),
    connectedDevice: getConnectedDevice(store),serverConnectionStatus: getServerConnectionStatus(store),
    settings: getSettings(store),
    doesEntranceLinkExist: doesEntranceLinkExistWrapper(store)
  }
}

export default connect(
  mapStoreStateToProps,
  {
    addEntranceLink,
    updateInventory,
    updateServerConnectionStatus,
    updateDeviceList,
    updateConnectedDevice,
    resetDeviceData,
    updateAppSettings
  }
)(App);
