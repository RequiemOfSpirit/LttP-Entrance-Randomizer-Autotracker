import { createStore } from "redux";
import rootReducer from "./reducers";
import { EntranceLocationList, ScreenData } from "../common/mapData";
import {
  ConnectedDevice,
  ConnectionStatus,
  DeviceList
} from "../common/devices";
import { SettingsType } from "../common/settings";
import { InventoryState } from "../common/inventory";
import { EntranceLinks } from "../common/locations";
import { NotesType } from "../common/notes";

export interface Store {
  inventory: InventoryState;
  mapData: {
    entranceLocations: EntranceLocationList;
    screenData: ScreenData;
  };
  entranceLinks: EntranceLinks;
  notes: NotesType;
  serverConnectionStatus: ConnectionStatus;
  devices: {
    availableDevices: DeviceList;
    connectedDevice: ConnectedDevice;
  };
  settings: SettingsType;
}

export default createStore(rootReducer);
