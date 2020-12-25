import { ActionType } from "./ActionTypes";
import { ConnectedDevice, ConnectionStatus, DeviceList } from "../common/types/devices.types";
import { InventoryStateUpdate } from "../common/types/inventory.types";
import { NewEntranceLink } from "../common/types/locations.types";
import { AppSettings } from "../common/types/settings.types";

export interface Action {
  type: ActionType;
  payload?: any;
}

export function addEntranceLink(newEntranceLink: NewEntranceLink): Action {
  return {
    type: ActionType.ADD_ENTRANCE_LINK,
    payload: newEntranceLink
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

export function resetDeviceData(): Action {
  return { type: ActionType.RESET_DEVICE_DATA };
}

export function updateServerConnectionStatus(connectionStatus: ConnectionStatus): Action {
  return {
    type: ActionType.UPDATE_SERVER_CONNECTION_STATUS,
    payload: connectionStatus
  };
}

export function updateAppSettings(settings: AppSettings): Action {
  return {
    type: ActionType.UPDATE_APP_SETTINGS,
    payload: settings
  };
}
