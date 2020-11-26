import inventory from "./inventory";
import entranceLinks from "./entranceLinks";
import notes from "./notes";
import devices from "./devices";
import settings from "./settings";
import { entranceLocations } from "./mapData";
import { Store } from "../store";
import { Action } from "../actions";
import { ENTRANCE_LOCATIONS } from "../../common/mapData";
import { BASE_SETTINGS } from "../../common/settings";
import { BASE_INVENTORY } from "../../common/inventory";

const INITIAL_STORE_STATE: Store = {
  inventory: BASE_INVENTORY,
  entranceLinks: {},
  notes: {
    text: [],
    references: {}
  },
  entranceLocations: ENTRANCE_LOCATIONS,
  devices: [],
  settings: BASE_SETTINGS
}

// TODO (BACKLOG): Restrict state access?
export default (state: Store = INITIAL_STORE_STATE, action: Action): Store => {
  return {
    inventory: inventory(state.inventory, action),
    entranceLinks: entranceLinks(state.entranceLinks, action), 
    notes: notes(state.notes, action, state),
    entranceLocations: entranceLocations(state.entranceLocations, action),
    devices: devices(state.devices, action),
    settings: settings(state.settings, action)
  }
}
