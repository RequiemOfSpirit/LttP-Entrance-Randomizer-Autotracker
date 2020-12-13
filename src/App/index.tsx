import React, { Component } from 'react';
import { connect } from "react-redux";

// Redux Store
import { Store } from '../redux/store';
import {
  addEntranceLinks,
  updateInventory,
  updateServerConnectionStatus,
  updateDeviceList,
  updateConnectedDevice,
  resetDeviceData,
  updateAppSettings
} from "../redux/actions";
import {
  doesEntranceLinkExistWrapper,
  getNotes,
  getInventoryState,
  getServerConnectionStatus,
  getDeviceList,
  getConnectedDevice,
  getSettings
} from '../redux/selectors';

// Helper Classes
import { LttPClient } from './usb2snes-client/LttPClient';
import { LocationTracker } from './tracker/LocationTracker';
import { ItemTracker } from './tracker/ItemTracker';

// Common Types, Classes
import { GlobalConfig, AppConfig } from '../common/config';
import { Location, EntranceLinks } from '../common/locations';
import { InventoryState, InventoryStateUpdate } from '../common/inventory';
import { DeviceList, DeviceName, ConnectionStatus, ConnectedDevice } from '../common/devices';
import { NotesType } from '../common/notes';
import { SettingsType, AppSettings } from '../common/settings';

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
  doesEntranceLinkExist: Function;
}

interface StoreReducerProps {
  addEntranceLinks: Function;
  updateInventory: Function;
  updateServerConnectionStatus: Function;
  updateDeviceList: Function;
  updateConnectedDevice: Function;
  resetDeviceData: Function;
  updateAppSettings: Function;
}

type AppProps = StoreStateProps & StoreReducerProps & {
  globalConfig: GlobalConfig;
};

interface AppState {
  config: AppConfig;
  client: LttPClient;
  locationTracker: LocationTracker;
  itemTracker: ItemTracker;
  locationPollIntervalId: number;
  locationProcessIntervalId: number;
  inventoryPollIntervalId: number;
  inventoryProcessIntervalId: number;
}

class App extends Component<AppProps, AppState> {
  state: AppState = {
    config: this.props.globalConfig.appConfig,
    client: new LttPClient({
      storeAccessors: {
        updateDeviceList: this.updateStoreDeviceList.bind(this),
        updateConnectedDevice: this.updateStoreConnectedDevice.bind(this),
        resetDeviceData: this.resetStoreDeviceData.bind(this),
        updateServerConnectionStatus: this.updateStoreServerConnectionStatus.bind(this),
      },
      config: this.props.globalConfig.lttpClientConfig
    }),
    locationTracker: new LocationTracker({
      utilityMethods: {
        getLocationById,
        getLocationsOnScreen,
        doesEntranceLinkExist: this.props.doesEntranceLinkExist
      },
      config: this.props.globalConfig.locationTrackerConfig
    }),
    itemTracker: new ItemTracker(this.props.inventoryState),
    locationPollIntervalId: this.props.globalConfig.appConfig.initialIntervalId,
    locationProcessIntervalId: this.props.globalConfig.appConfig.initialIntervalId,
    inventoryPollIntervalId: this.props.globalConfig.appConfig.initialIntervalId,
    inventoryProcessIntervalId: this.props.globalConfig.appConfig.initialIntervalId
  };

  componentDidUpdate(prevProps: AppProps) {
    this.state.locationTracker.updateUtilityFunctions({
      doesEntranceLinkExist: this.props.doesEntranceLinkExist
    });

    this.state.itemTracker.updateCurrentInventory(this.props.inventoryState);

    /**
     * Connection Status updated
     */
    if (prevProps.serverConnectionStatus !== this.props.serverConnectionStatus) {
      this.handleServerConnectionStatusChange(prevProps.serverConnectionStatus, this.props.serverConnectionStatus);
    }
  }

  componentWillUnmount() {
    this.clearIntervals();
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
          updateStoreAppSettings={this.updateAppSettings.bind(this)}
        />
        <Notes
          notes={this.props.notes}
        />
      </div>
    );
  }

  /**
   * Methods passed down to usb2snes client to update redux store
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

  private resetStoreDeviceData(): void {
    this.props.resetDeviceData();
  }

  /**
   * Methods passed to connections page
   */
  private refreshDeviceList(): void {
    this.state.client.refreshDeviceList();
  }

  private connectToDevice(deviceName: DeviceName): void {
    this.state.client.connect(deviceName);
  }

  private reconnectToServer(): void {
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
      // Connection to device disconnected. Stop any intervals that have been setup.
      this.stopPolling();
    }
  }

  private clearIntervals(): void {
    window.clearInterval(this.state.locationPollIntervalId);
    window.clearInterval(this.state.locationProcessIntervalId);
    window.clearInterval(this.state.inventoryPollIntervalId);
    window.clearInterval(this.state.inventoryProcessIntervalId);
  }

  private startPolling(): void {
    this.setState({
      locationPollIntervalId: window.setInterval(this.pollLocations.bind(this), this.state.config.locationPollIntervalLength),
      locationProcessIntervalId: window.setInterval(this.processLocations.bind(this), this.state.config.locationProcessIntervalLength),
      inventoryPollIntervalId: window.setInterval(this.pollInventoryState.bind(this), this.state.config.inventoryPollIntervalLength),
      inventoryProcessIntervalId: window.setInterval(this.processInventoryState.bind(this), this.state.config.inventoryProcessIntervalLength)
    });
  }

  private stopPolling(): void {
    this.clearIntervals();
    this.setState({
      locationPollIntervalId: this.state.config.initialIntervalId,
      locationProcessIntervalId: this.state.config.initialIntervalId,
      inventoryPollIntervalId: this.state.config.initialIntervalId,
      inventoryProcessIntervalId: this.state.config.initialIntervalId
    });
  }

  /* Location Processing */
  private pollLocations(): void {
    this.state.client.readLocationSegment();
  }

  private processLocations(): void {
    let newLocations: Array<Location> = this.state.client.popLocations();
    let newEntranceLinks: EntranceLinks;
    try {
      newEntranceLinks = this.state.locationTracker.getNewEntranceLinks(newLocations);
    } catch (e) {
      // TODO (BACKLOG): Failure is due to inconsistent entrance links possibly due to ROM change. Handle better.
      throw e;
    }

    if (Object.keys(newEntranceLinks).length > 0) {
      this.props.addEntranceLinks(newEntranceLinks);
    }
  }

  /* Inventory Processing */
  private pollInventoryState(): void {
    this.state.client.readInventorySegment();
  }

  private processInventoryState(): void {
    let latestInventoryState: InventoryState = this.state.client.getLatestInventoryState();
    let inventoryUpdate: InventoryStateUpdate = this.state.itemTracker.getInventoryStateUpdates(latestInventoryState);

    if (Object.keys(inventoryUpdate).length > 0) {
      this.props.updateInventory(inventoryUpdate);
    }
  }
}

function mapStoreStateToProps(store: Store): StoreStateProps {
  return {
    notes: getNotes(store),
    inventoryState: getInventoryState(store),
    deviceList: getDeviceList(store),
    connectedDevice: getConnectedDevice(store),
    serverConnectionStatus: getServerConnectionStatus(store),
    settings: getSettings(store),
    doesEntranceLinkExist: doesEntranceLinkExistWrapper(store)
  }
}

export default connect(
  mapStoreStateToProps,
  {
    addEntranceLinks,
    updateInventory,
    updateServerConnectionStatus,
    updateDeviceList,
    updateConnectedDevice,
    resetDeviceData,
    updateAppSettings
  }
)(App);
