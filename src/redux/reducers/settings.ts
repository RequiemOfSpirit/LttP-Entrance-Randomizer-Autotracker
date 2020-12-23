import { ActionType } from "../ActionTypes";
import { Action } from "../actions";
import { SettingsType, AppSettingsType } from "../../common/settings";

export default function(state: SettingsType, action: Action): SettingsType {
  switch (action.type) {
    case ActionType.UPDATE_APP_SETTINGS:
      return {
        ...state,
        appSettings: (action.payload as AppSettingsType)
      };
    default:
      return state;
  }
}
