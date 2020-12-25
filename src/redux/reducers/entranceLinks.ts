import { ActionType } from "../ActionTypes";
import { Action } from "../actions";
import { TAGS } from "../../common/mapData";
import { EntranceLinks, NewEntranceLink } from "../../common/types/locations.types";
import { InventoryStateUpdate } from "../../common/types/inventory.types";

export default function(state: EntranceLinks, action: Action): EntranceLinks {
  // TODO (BACKLOG): This update assumes coupled entrances. Read from config instead.
  let coupledEntrances = true;

  switch (action.type) {
    case ActionType.ADD_ENTRANCE_LINK:
      let newLinks: EntranceLinks = {};
      let payload = action.payload as NewEntranceLink;

      // TODO (BACKLOG): Do not do this double linking for single exit caves
      newLinks[payload.source] = payload.destination;
      if (coupledEntrances) {
        newLinks[payload.destination] = payload.source;
      }

      return {
        ...state,
        ...newLinks
      };

    case ActionType.UPDATE_INVENTORY:
      if ((action.payload as InventoryStateUpdate).lamp !== 1) {
        return state;
      }

      /*
       * Lamp has been obtained. Remove entrance links with dark rooms so that
       *   they are treated as new entrances when visited the next time.
       */
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
