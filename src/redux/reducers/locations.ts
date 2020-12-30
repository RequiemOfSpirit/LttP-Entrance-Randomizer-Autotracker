import { ActionType } from "../ActionTypes";
import { Action } from "../actions";
import { TAGS } from "../../common/mapData";
import { EntranceLink, EntranceLinksById } from "../../common/types/locations.types";
import { InventoryStateUpdate } from "../../common/types/inventory.types";
import { EntranceLocationId } from "../../common/types/mapData.types";

export function entranceLinks(state: EntranceLinksById, action: Action): EntranceLinksById {
  // TODO (BACKLOG): This update assumes coupled entrances. Read from config instead.
  let coupledEntrances = true;

  switch (action.type) {
    case ActionType.ADD_ENTRANCE_LINK:
      let newLinks: EntranceLinksById = {};
      let payload = action.payload as EntranceLink;

      // TODO (BACKLOG): Do not do this double linking for single exit caves
      newLinks[payload.source.id] = payload.destination.id;
      if (coupledEntrances) {
        newLinks[payload.destination.id] = payload.source.id;
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
      Object.keys(TAGS.darkRooms.locations).forEach(key => {
        let darkRoomId = key as EntranceLocationId;
        if (coupledEntrances) {
          if (!state.hasOwnProperty(darkRoomId)) {
            return;
          }

          // '!' used to override typescript errors. If state did not have darkRoomId it would have exited above
          let connectedLocationId = state[darkRoomId]!;
          delete newState[darkRoomId];
          delete newState[connectedLocationId];
        }
      });

      return newState;
    default:
      return state;
  }
}
