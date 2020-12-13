import { Store } from "./store";
import { EntranceLinks } from "../common/locations";
import { InventoryState } from "../common/inventory";
import { NotesType } from "../common/notes";
import { ConnectedDevice, ConnectionStatus, DeviceList } from "../common/devices";
import { SettingsType } from "../common/settings";

/* Simple selectors returning objects */
export const getNotes = (store: Store): NotesType => store.notes;
export const getInventoryState = (store: Store): InventoryState => store.inventory;
export const getDeviceList = (store: Store): DeviceList => store.devices.availableDevices;
export const getConnectedDevice = (store: Store): ConnectedDevice => store.devices.connectedDevice;
export const getServerConnectionStatus = (store: Store): ConnectionStatus => store.serverConnectionStatus;
// TODO (Backlog): Temporary settings selector. Needs replacement when location/tag based settings are added
export const getSettings = (store: Store): SettingsType => store.settings;
const getEntranceLinks = (store: Store): EntranceLinks => store.entranceLinks;

/* Wrapper Functions that return methods that can be called later */
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
