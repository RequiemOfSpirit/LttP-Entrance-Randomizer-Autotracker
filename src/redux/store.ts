import { InventoryState } from "../common/inventory";
import { EntranceLinksById } from "../common/types/locations.types";
import { Notes } from "../common/types/notes.types";
import { ConnectionStatus, DeviceList, ConnectedDevice } from "../common/types/devices.types";
import { Settings } from "../common/types/settings.types";

import { createStore } from "redux";
import rootReducer from "./reducers";

export type Store = {
  inventory: InventoryState;
  entranceLinks: EntranceLinksById;
  notes: Notes;
  serverConnectionStatus: ConnectionStatus;
  devices: {
    availableDevices: DeviceList;
    connectedDevice: ConnectedDevice;
  };
  settings: Settings;
};

export default createStore(rootReducer);
