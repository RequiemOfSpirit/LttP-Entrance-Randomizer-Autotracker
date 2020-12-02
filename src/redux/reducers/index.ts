import inventory from "./inventory";
import entranceLinks from "./entranceLinks";
import notes from "./notes";
import { connectedDevice, deviceList, serverConnectionStatus } from "./devices";
import settings from "./settings";
import { entranceLocations, screenData } from "./mapData";
import { Store } from "../store";
import { Action } from "../actions";
import { BASE_INVENTORY } from "../../common/inventory";
import { ENTRANCE_LOCATIONS, SCREEN_DATA } from "../../common/mapData";
import { ConnectionStatus, NULL_DEVICE } from "../../common/devices";
import { BASE_SETTINGS } from "../../common/settings";

const INITIAL_STORE_STATE: Store = {
  inventory: BASE_INVENTORY,
  entranceLinks: {},
  mapData: {
    entranceLocations: ENTRANCE_LOCATIONS,
    screenData: SCREEN_DATA
  },
  notes: {
    text: [],
    references: {}
  },
  serverConnectionStatus: ConnectionStatus.INACTIVE,
  devices: {
    availableDevices: [],
    connectedDevice: NULL_DEVICE,
  },
  settings: BASE_SETTINGS
}

// TODO (BACKLOG): Restrict state access?
export default (state: Store = INITIAL_STORE_STATE, action: Action): Store => {
  return {
    inventory: inventory(state.inventory, action),
    mapData: {
      entranceLocations: entranceLocations(state.mapData.entranceLocations, action),
      screenData: screenData(state.mapData.screenData, action)
    },
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
