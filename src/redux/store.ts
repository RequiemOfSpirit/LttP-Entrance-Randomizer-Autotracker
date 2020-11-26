import { createStore } from "redux";
import rootReducer from "./reducers";
import { EntranceLocationList } from "../common/mapData";
import { DeviceList } from "../common/devices";
import { SettingsType } from "../common/settings";
import { InventoryState } from "../common/inventory";
import { EntranceLinks } from "../common/locations";
import { NotesType } from "../common/notes";

export interface Store {
  inventory: InventoryState;
  entranceLinks: EntranceLinks;
  notes: NotesType;
  entranceLocations: EntranceLocationList;
  devices: DeviceList;
  settings: SettingsType;
}

export default createStore(rootReducer);
