// Types
import { Store } from "../store";
import { Action } from "../actions";
import { ConnectionStatus } from "../../common/types/devices.types";

// Constants
import { BASE_INVENTORY } from "../../common/inventory";
import { EMPTY_DEVICE_LIST, NULL_DEVICE } from "../../common/devices";
import { BASE_SETTINGS } from "../../common/settings";

// Reducer methods
import inventory from "./inventory";
import { entranceLinks } from "./locations";
import notes from "./notes";
import { connectedDevice, deviceList, serverConnectionStatus } from "./devices";
import settings from "./settings";

const INITIAL_STORE_STATE: Store = {
  inventory: BASE_INVENTORY,
  entranceLinks: {},
  notes: {
    text: [],
    references: {}
  },
  serverConnectionStatus: ConnectionStatus.INACTIVE,
  devices: {
    availableDevices: EMPTY_DEVICE_LIST,
    connectedDevice: NULL_DEVICE,
  },
  settings: BASE_SETTINGS
}

// TODO (BACKLOG): Restrict state access?
export default (state: Store = INITIAL_STORE_STATE, action: Action): Store => {
  return {
    inventory: inventory(state.inventory, action),
    entranceLinks: entranceLinks(state.entranceLinks, action), 
    notes: notes(state.notes, action, state),
    serverConnectionStatus: serverConnectionStatus(state.serverConnectionStatus, action),
    devices: {
      availableDevices: deviceList(state.devices.availableDevices, action),
      connectedDevice: connectedDevice(state.devices.connectedDevice, action),
    },
    settings: settings(state.settings, action)
  }
}
