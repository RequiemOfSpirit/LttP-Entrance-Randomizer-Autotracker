import { ActionType } from "./ActionTypes";
import { ConnectedDevice, DeviceList } from "../common/devices";
import { InventoryStateUpdate } from "../common/inventory";
import { EntranceLinks } from "../common/locations";
import { AppSettings } from "../common/settings";

export interface Action {
  type: ActionType,
  payload?: { [key in (string | number)]: any }
}

export function addEntranceLinks(newEntranceLinks: EntranceLinks): Action {
  return {
    type: ActionType.ADD_ENTRANCE_LINKS,
    payload: newEntranceLinks
  };
}

export function updateInventory(inventoryStateUpdate: InventoryStateUpdate): Action {
  return {
    type: ActionType.UPDATE_INVENTORY,
    payload: inventoryStateUpdate
  };
}

export function updateDeviceList(deviceList: DeviceList): Action {
  return {
    type: ActionType.UPDATE_DEVICE_LIST,
    payload: deviceList
  };
}

export function updateConnectedDevice(connectedDevice: ConnectedDevice): Action {
  return {
    type: ActionType.UPDATE_CONNECTED_DEVICE,
    payload: connectedDevice
  };
}

export function updateAppSettings(settings: AppSettings): Action {
  return {
    type: ActionType.UPDATE_APP_SETTINGS,
    payload: settings
  };
}
