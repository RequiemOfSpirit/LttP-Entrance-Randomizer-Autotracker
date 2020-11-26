import { ActionType } from "../ActionTypes";
import { Action } from "../actions";
import { InventoryState } from "../../common/inventory";

export default function(state: InventoryState, action: Action): InventoryState {
  switch (action.type) {
    case ActionType.UPDATE_INVENTORY:
      return {
        ...state,
        ...action.payload
      }
    default:
      return state;
  }
}
