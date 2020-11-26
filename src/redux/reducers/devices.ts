import { ActionType } from "../ActionTypes";
import { Action } from "../actions";
import { DeviceList } from "../../common/devices";

export default function(state: DeviceList, action: Action): DeviceList {
  switch (action.type) {
    case ActionType.UPDATE_DEVICES:
      return (action.payload as DeviceList);
    default:
      return state;
  }
}
