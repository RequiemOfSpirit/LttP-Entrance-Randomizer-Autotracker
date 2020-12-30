import { Store } from "./store";
import { EntranceLinksById } from "../common/types/locations.types";
import { InventoryState } from "../common/inventory";
import { Notes } from "../common/types/notes.types";
import { ConnectedDevice, ConnectionStatus, DeviceList } from "../common/types/devices.types";
import { Settings } from "../common/types/settings.types";

/* Simple selectors returning objects */
export const getNotes = (store: Store): Notes => store.notes;
export const getInventoryState = (store: Store): InventoryState => store.inventory;
export const getDeviceList = (store: Store): DeviceList => store.devices.availableDevices;
export const getConnectedDevice = (store: Store): ConnectedDevice => store.devices.connectedDevice;
export const getServerConnectionStatus = (store: Store): ConnectionStatus => store.serverConnectionStatus;
// TODO (BACKLOG): Temporary settings selector. Needs replacement when location/tag based settings are added
export const getSettings = (store: Store): Settings => store.settings;
const getEntranceLinks = (store: Store): EntranceLinksById => store.entranceLinks;

/* Wrapper Functions that return methods that can be called later */
// TODO (BACKLOG): Return true if its a single entrance uw location? Or create a separate function for this
export type DoesEntranceLinkExistMethodSignature = (startLocationId: string, endLocationId: string) => boolean;
export function doesEntranceLinkExistWrapper(store: Store): DoesEntranceLinkExistMethodSignature {
  return (startLocationId: string, endLocationId: string): boolean => {
    const entranceLinks = getEntranceLinks(store);

    if (
      entranceLinks.hasOwnProperty(startLocationId) &&
      entranceLinks[startLocationId] === endLocationId
    ) {
      return true;
    }

    if (
      entranceLinks.hasOwnProperty(startLocationId) &&
      entranceLinks[startLocationId] !== endLocationId
    ) {
      const errorMessage = "Invalid Entrance Link check received.";
      console.error(errorMessage);
      console.log(`${startLocationId}, ${endLocationId}`, "vs", `${startLocationId}, ${entranceLinks[startLocationId]}`);
      throw new Error(errorMessage);
    }

    return false;
  }
}
