import { ActionType } from "./ActionTypes";
import { DeviceList } from "../common/devices";
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
    type: ActionType.UPDATE_DEVICES,
    payload: deviceList
  };
}

export function updateAppSettings(settings: AppSettings): Action {
  return {
    type: ActionType.UPDATE_APP_SETTINGS,
    payload: settings
  };
}
