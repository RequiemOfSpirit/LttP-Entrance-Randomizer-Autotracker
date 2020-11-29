import inventory from "./inventory";
import entranceLinks from "./entranceLinks";
import notes from "./notes";
import { connectedDevice, deviceList } from "./devices";
import settings from "./settings";
import { entranceLocations } from "./mapData";
import { Store } from "../store";
import { Action } from "../actions";
import { BASE_INVENTORY } from "../../common/inventory";
import { ENTRANCE_LOCATIONS } from "../../common/mapData";
import { NULL_DEVICE } from "../../common/devices";
import { BASE_SETTINGS } from "../../common/settings";

const INITIAL_STORE_STATE: Store = {
  inventory: BASE_INVENTORY,
  entranceLinks: {},
  notes: {
    text: [],
    references: {}
  },
  entranceLocations: ENTRANCE_LOCATIONS,
  deviceList: [],
  connectedDevice: NULL_DEVICE,
  settings: BASE_SETTINGS
}

// TODO (BACKLOG): Restrict state access?
export default (state: Store = INITIAL_STORE_STATE, action: Action): Store => {
  return {
    inventory: inventory(state.inventory, action),
    entranceLinks: entranceLinks(state.entranceLinks, action), 
    notes: notes(state.notes, action, state),
    entranceLocations: entranceLocations(state.entranceLocations, action),
    deviceList: deviceList(state.deviceList, action),
    connectedDevice: connectedDevice(state.connectedDevice, action),
    settings: settings(state.settings, action)
  }
}
