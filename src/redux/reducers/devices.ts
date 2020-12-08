import { ActionType } from "../ActionTypes";
import { Action } from "../actions";
import {
  ConnectedDevice,
  ConnectionStatus,
  DeviceList,
  EMPTY_DEVICE_LIST,
  NULL_DEVICE
} from "../../common/devices";

export const deviceList = (state: DeviceList, action: Action): DeviceList => {
  switch (action.type) {
    case ActionType.UPDATE_DEVICE_LIST:
      return (action.payload as DeviceList);
    case ActionType.RESET_DEVICE_DATA:
      return EMPTY_DEVICE_LIST;
    default:
      return state;
  }
}

export const connectedDevice = (state: ConnectedDevice, action: Action): ConnectedDevice => {
  switch (action.type) {
    case ActionType.UPDATE_CONNECTED_DEVICE:
      return action.payload as ConnectedDevice;
    case ActionType.RESET_DEVICE_DATA:
      return NULL_DEVICE;
    default:
      return state;
  }
}

export const serverConnectionStatus = (state: ConnectionStatus, action: Action): ConnectionStatus => {
  switch (action.type) {
    case ActionType.UPDATE_SERVER_CONNECTION_STATUS:
      return action.payload as ConnectionStatus;
    default:
      return state;
  }
}
