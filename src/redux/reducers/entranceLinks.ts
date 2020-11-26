import { ActionType } from "../ActionTypes";
import { Action } from "../actions";
import { TAGS } from "../../common/mapData";
import { EntranceLinks } from "../../common/locations";
import { InventoryStateUpdate } from "../../common/inventory";

export default function(state: EntranceLinks, action: Action): EntranceLinks {
  switch (action.type) {
    case ActionType.ADD_ENTRANCE_LINKS:
      return {
        ...state,
        ...action.payload
      };
    case ActionType.UPDATE_INVENTORY:
      if ((action.payload as InventoryStateUpdate).lamp !== 1) {
        return state;
      }

      /*
       * Lamp has been obtained. Remove entrance links with dark rooms so that
       *   they are treated as new entrances when visited the next time.
       */
      // TODO (BACKLOG): This removal assumes coupled entrances. Read from config.
      let coupledEntrances = true;
      let newState = { ...state };

      // TODO (BACKLOG): Handle decoupled entrances. Removing for decoupled entrance links may require you to 
      //    maintain a HashBiMap of entrance links
      Object.keys(TAGS.darkRooms.locations).forEach(darkRoomId => {
        if (coupledEntrances) {
          if (!state.hasOwnProperty(darkRoomId)) {
            return;
          }

          let connectedLocation = state[darkRoomId];
          delete newState[darkRoomId];
          delete newState[connectedLocation];
        }
      });

      return newState;
    default:
      return state;
  }
}
