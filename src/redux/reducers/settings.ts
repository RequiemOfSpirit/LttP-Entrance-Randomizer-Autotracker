import { ActionType } from "../ActionTypes";
import { Action } from "../actions";
import { Settings, AppSettings } from "../../common/types/settings.types";

export default function(state: Settings, action: Action): Settings {
  switch (action.type) {
    case ActionType.UPDATE_APP_SETTINGS:
      return {
        ...state,
        appSettings: (action.payload as AppSettings)
      };
    default:
      return state;
  }
}
