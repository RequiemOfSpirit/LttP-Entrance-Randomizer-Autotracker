import { ActionType } from "../ActionTypes";
import { Action } from "../actions";
import { Store } from "../store";
import { EntranceLink } from "../../common/types/locations.types";
import { BinaryItemState, InventoryStateUpdate } from "../../common/types/inventory.types";
import { EntranceLocationId } from "../../common/types/mapData.types";
import { Notes } from "../../common/types/notes.types";

import { getLocationById, TAGS } from "../../common/mapData";

// TODO (BACKLOG): Review after implementing change for not coupling single entrance caves
export default function(state: Notes, action: Action, root: Store): Notes {
  let newNotes: Notes = { ...state };

  switch (action.type) {
    case ActionType.ADD_ENTRANCE_LINK:
      let newEntranceLink: EntranceLink = (action.payload as EntranceLink);
      const startLocationId = newEntranceLink.source.id;
      const endLocationId = newEntranceLink.destination.id;

      /* Note already exists */
      if (
        newNotes.references.hasOwnProperty(startLocationId) &&
        newNotes.references.hasOwnProperty(endLocationId)
      ) {
        return newNotes;
      }

      /* Note needs to be updated (dark room after lamp) */
      if (
        (newNotes.references.hasOwnProperty(startLocationId) && !newNotes.references.hasOwnProperty(endLocationId)) ||
        (!newNotes.references.hasOwnProperty(startLocationId) && newNotes.references.hasOwnProperty(endLocationId))
      ) {
        let index: number;

        // Add the reference for the location that doesn't have one
        if (newNotes.references.hasOwnProperty(startLocationId)) {
          index = newNotes.references[startLocationId]!;
          newNotes.references[endLocationId] = index;
        } else {
          index = newNotes.references[endLocationId]!;
          newNotes.references[startLocationId] = index;
        }

        // Overwrite note
        let startLocationName = getLocationNameForNotes(startLocationId, root);
        let endLocationName = getLocationNameForNotes(endLocationId, root);
        newNotes.text[index] = `${startLocationName} --> ${endLocationName}`;

        return newNotes;
      }

      /* New note */
      let startLocationName = getLocationNameForNotes(startLocationId, root);
      let endLocationName = getLocationNameForNotes(endLocationId, root);

      // Set references to the index in the array that contains these locations
      newNotes.references[startLocationId] = newNotes.text.length;
      newNotes.references[endLocationId] = newNotes.text.length;

      // Add new note
      newNotes.text.push(`${startLocationName} --> ${endLocationName}`);

      return newNotes;

    case ActionType.UPDATE_INVENTORY:
      if ((action.payload as InventoryStateUpdate).lamp !== 1) {
        return state;
      }

      /*
       * Lamp has been obtained. Remove notes refs with dark rooms so that
       *   they get updated when the corresponding entrance link is received the next time.
       */
      Object.keys(TAGS.darkRooms.locations).forEach(key => {
        let darkRoomId = key as EntranceLocationId;
        if (!state.references.hasOwnProperty(darkRoomId)) {
          return;
        }

        delete newNotes.references[darkRoomId];
      });

      return newNotes;

    default:
      return state;
  }
}

// Utility method to get the location name to be stored in Notes
function getLocationNameForNotes(locationId: EntranceLocationId, root: Store): string {
  if (
    TAGS.darkRooms.locations.hasOwnProperty(locationId) &&
    root.inventory.lamp === BinaryItemState.ABSENT
  ) {
    return "(DARK CAVE)";
  }

  return getLocationById(locationId).name;
}
