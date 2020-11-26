import { ActionType } from "../ActionTypes";
import { Action } from "../actions";
import { SettingsType, AppSettings } from "../../common/settings";

export default function(state: SettingsType, action: Action): SettingsType {
  switch (action.type) {
    case ActionType.UPDATE_APP_SETTINGS:
      return {
        ...state,
        appSettings: (action.payload as AppSettings)
      }
    default:
      return state;
  }
}
