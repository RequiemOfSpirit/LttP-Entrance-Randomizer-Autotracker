import { ActionType } from "../ActionTypes";
import { Action } from "../actions";
import { Store } from "../store";
import { EntranceLinks } from "../../common/locations";
import { BinaryItemState, InventoryStateUpdate } from "../../common/inventory";
import { getLocationById, TAGS } from "../../common/mapData";
import { NotesType } from "../../common/notes";

export default function(state: NotesType, action: Action, root: Store): NotesType {
  let newNotes: NotesType = { ...state };

  switch (action.type) {
    case ActionType.ADD_ENTRANCE_LINKS:
      let newEntranceLinks: EntranceLinks = (action.payload as EntranceLinks);

      for (let entries of Object.entries(newEntranceLinks)) {
        const startLocationId = entries[0];
        const endLocationId = entries[1];

        /* Note already exists */
        if (
          newNotes.references.hasOwnProperty(startLocationId) &&
          newNotes.references.hasOwnProperty(endLocationId)
        ) {
          continue;
        }

        /* Note needs to be updated (dark room after lamp) */
        if (
          (newNotes.references.hasOwnProperty(startLocationId) && !newNotes.references.hasOwnProperty(endLocationId)) ||
          (!newNotes.references.hasOwnProperty(startLocationId) && newNotes.references.hasOwnProperty(endLocationId))
        ) {
          let index: number;

          // Add the reference for the location that doesn't have one
          if (newNotes.references.hasOwnProperty(startLocationId)) {
            index = newNotes.references[startLocationId];
            newNotes.references[endLocationId] = index;
          } else {
            index = newNotes.references[endLocationId];
            newNotes.references[startLocationId] = index;
          }

          // Overwrite note
          let startLocationName = getLocationNameForNotes(startLocationId, root);
          let endLocationName = getLocationNameForNotes(endLocationId, root);
          newNotes.text[index] = `${startLocationName} --> ${endLocationName}`;

          continue;
        }

        /* New note */
        let startLocationName = getLocationNameForNotes(startLocationId, root);
        let endLocationName = getLocationNameForNotes(endLocationId, root);

        // Set references to the index in the array that contains these locations
        newNotes.references[startLocationId] = newNotes.text.length;
        newNotes.references[endLocationId] = newNotes.text.length;

        // Add new note
        newNotes.text.push(`${startLocationName} --> ${endLocationName}`);
      }

      return newNotes;

    case ActionType.UPDATE_INVENTORY:
      if ((action.payload as InventoryStateUpdate).lamp !== 1) {
        return state;
      }

      /*
       * Lamp has been obtained. Remove notes refs with dark rooms so that
       *   they get updated when the corresponding entrance link is received the next time.
       */
      Object.keys(TAGS.darkRooms.locations).forEach(darkRoomId => {
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
function getLocationNameForNotes(locationId: string, root: Store): string {
  if (
    TAGS.darkRooms.locations.hasOwnProperty(locationId) &&
    root.inventory.lamp === BinaryItemState.ABSENT
  ) {
    return "(DARK CAVE)";
  }

  return getLocationById(locationId).name;
}
