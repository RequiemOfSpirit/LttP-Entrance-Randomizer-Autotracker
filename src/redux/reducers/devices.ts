import { ActionType } from "../ActionTypes";
import { Action } from "../actions";
import { ConnectedDevice, DeviceList } from "../../common/devices";

export const deviceList = (state: DeviceList, action: Action): DeviceList => {
  switch (action.type) {
    case ActionType.UPDATE_DEVICE_LIST:
      return (action.payload as DeviceList);
    default:
      return state;
  }
}

export const connectedDevice = (state: ConnectedDevice, action: Action): ConnectedDevice => {
  switch (action.type) {
    case ActionType.UPDATE_CONNECTED_DEVICE:
      return action.payload as ConnectedDevice;
    default:
      return state;
  }
}
