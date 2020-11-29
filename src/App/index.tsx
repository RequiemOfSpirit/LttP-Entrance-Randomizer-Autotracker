import React, { Component } from 'react';
import { connect } from "react-redux";
import { Store } from '../redux/store';
import {
  addEntranceLinks,
  updateInventory,
  updateDeviceList,
  updateConnectedDevice,
  updateAppSettings
} from "../redux/actions";
import {
  getLocationByIdWrapper,
  getLocationsOnScreenWrapper,
  doesEntranceLinkExistWrapper,
  getNotes,
  getInventoryState,
  getDeviceList,
  getConnectedDevice,
  getSettings
} from '../redux/selectors';
import { Notes } from './Notes';
import Connections from './Connections';
import { LttPClient } from './usb2snes-client/LttPClient';
import { LocationTracker } from './tracker/LocationTracker';
import { ItemTracker } from './tracker/ItemTracker';
import { GlobalConfig, AppConfig } from '../common/config';
import { Location, EntranceLinks } from '../common/locations';
import { InventoryState, InventoryStateUpdate } from '../common/inventory';
import { DeviceList, DeviceName, ConnectionStatus, ConnectedDevice } from '../common/devices';
import './index.css';
import { NotesType } from '../common/notes';
import { Settings } from './Settings';
import { SettingsType, AppSettings } from '../common/settings';

interface AppProps {
  globalConfig: GlobalConfig;
  notes: NotesType;
  inventoryState: InventoryState;
  deviceList: DeviceList;
  connectedDevice: ConnectedDevice;
  settings: SettingsType;
  getLocationById: Function;
  getLocationsOnScreen: Function;
  doesEntranceLinkExist: Function;
  addEntranceLinks: Function;
  updateInventory: Function;
  updateDeviceList: Function;
  updateConnectedDevice: Function;
  updateAppSettings: Function;
}

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
      updateDeviceList: this.updateDeviceList.bind(this),
      updateConnectedDevice: this.updateConnectedDevice.bind(this),
      config: this.props.globalConfig.lttpClientConfig
    }),
    locationTracker: new LocationTracker({
      storeAccessors: {
        getLocationById: this.props.getLocationById,
        getLocationsOnScreen: this.props.getLocationsOnScreen,
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

  constructor(props: AppProps) {
    super(props);

    // TODO (BACKLOG): Make updates more robust (maybe add an app state)
    window.addEventListener("ConnectionUpdate", () => {
      if (this.state.client.currentConnectionStatus === ConnectionStatus.CONNECTED) {
        this.setupIntervals();
        return;
      }

      // TODO: Fix this
      if (this.state.locationPollIntervalId !== this.state.config.initialIntervalId) {
        this.clearIntervals();
        return;
      }

      this.setState({});
    });
  }

  componentDidUpdate(prevProps: AppProps) {
    this.state.locationTracker.updateStoreAccessors({
      doesEntranceLinkExist: this.props.doesEntranceLinkExist
    });

    this.state.itemTracker.updateCurrentInventory(this.props.inventoryState);
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
  private updateDeviceList(deviceList: DeviceList): void {
    this.props.updateDeviceList(deviceList);
  }

  private updateConnectedDevice(connectedDevice: ConnectedDevice): void {
    this.props.updateConnectedDevice(connectedDevice);
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
  private setupIntervals(): void {
    this.setState({
      locationPollIntervalId: window.setInterval(this.pollLocations.bind(this), this.state.config.locationPollIntervalLength),
      locationProcessIntervalId: window.setInterval(this.processLocations.bind(this), this.state.config.locationProcessIntervalLength),
      inventoryPollIntervalId: window.setInterval(this.pollInventoryState.bind(this), this.state.config.inventoryPollIntervalLength),
      inventoryProcessIntervalId: window.setInterval(this.processInventoryState.bind(this), this.state.config.inventoryProcessIntervalLength)
    });
  }

  private clearIntervals(): void {
    window.clearInterval(this.state.locationPollIntervalId);
    window.clearInterval(this.state.locationProcessIntervalId);
    window.clearInterval(this.state.inventoryPollIntervalId);
    window.clearInterval(this.state.inventoryProcessIntervalId);
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

function mapStoreStateToProps(store: Store) {
  return {
    notes: getNotes(store),
    inventoryState: getInventoryState(store),
    deviceList: getDeviceList(store),
    connectedDevice: getConnectedDevice(store),
    settings: getSettings(store),
    getLocationById: getLocationByIdWrapper(store),
    getLocationsOnScreen: getLocationsOnScreenWrapper(store),
    doesEntranceLinkExist: doesEntranceLinkExistWrapper(store)
  }
}

export default connect(
  mapStoreStateToProps,
  { addEntranceLinks, updateInventory, updateDeviceList, updateConnectedDevice, updateAppSettings }
)(App);
