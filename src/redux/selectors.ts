import { Store } from "./store";
import { SCREEN_DATA } from "../common/mapData";
import { NamedLocation, WorldType, EntranceLinks } from "../common/locations";

/* Simple selectors returning objects */
export const getNotes = (store: Store) => store.notes;
export const getInventoryState = (store: Store) => store.inventory;
export const getDeviceList = (store: Store) => store.devices.availableDevices;
export const getConnectedDevice = (store: Store) => store.devices.connectedDevice;
export const getServerConnectionStatus = (store: Store) => store.serverConnectionStatus;
// Temporary settings selector. Needs replacement when location/tag based settings are added
export const getSettings = (store: Store) => store.settings;
const getEntranceLinks = (store: Store) => store.entranceLinks;
const getEntranceLocations = (store: Store) => store.entranceLocations;

/* Wrapper Function selectors that return methods that can be called later */
export function doesEntranceLinkExistWrapper(store: Store): Function {
  return (startLocationId: string, endLocationId: string, additionalEntranceLinks: EntranceLinks = {}): boolean => {
    const currentEntranceLinks = {
      ...getEntranceLinks(store),
      ...additionalEntranceLinks
    };

    if (
      currentEntranceLinks.hasOwnProperty(startLocationId) &&
      currentEntranceLinks[startLocationId] === endLocationId
    ) {
      return true;
    }

    if (
      currentEntranceLinks.hasOwnProperty(startLocationId) &&
      currentEntranceLinks[startLocationId] !== endLocationId
    ) {
      const errorMessage = "Invalid Entrance Link check received.";
      console.error(errorMessage);
      console.log(`${startLocationId}, ${endLocationId}`, "vs", `${startLocationId}, ${currentEntranceLinks[startLocationId]}`);
      throw new Error(errorMessage);
    }

    return false;
  }
}

export function getLocationByIdWrapper(store: Store): Function {
  return (locationId: string): NamedLocation => {
    return getEntranceLocations(store)[locationId];
  }
}

export function getLocationsOnScreenWrapper(store: Store): Function {
  return (worldType: WorldType, screenIndex: number): Array<string> => {
    return SCREEN_DATA[worldType][screenIndex];
  }
}
