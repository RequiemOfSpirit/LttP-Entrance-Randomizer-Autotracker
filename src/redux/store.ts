import { createStore } from "redux";
import rootReducer from "./reducers";
import {
  ConnectedDevice,
  ConnectionStatus,
  DeviceList
} from "../common/devices";
import { SettingsType } from "../common/settings";
import { InventoryState } from "../common/inventory";
import { EntranceLinksType } from "../common/locations";
import { NotesType } from "../common/notes";

export interface Store {
  inventory: InventoryState;
  entranceLinks: EntranceLinksType;
  notes: NotesType;
  serverConnectionStatus: ConnectionStatus;
  devices: {
    availableDevices: DeviceList;
    connectedDevice: ConnectedDevice;
  };
  settings: SettingsType;
}

export default createStore(rootReducer);
