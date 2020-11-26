import { Action } from "../actions";
import { EntranceLocationList } from "../../common/mapData";

export const entranceLocations = (state: EntranceLocationList, action: Action): EntranceLocationList => {
  switch (action.type) {
    default:
      return state;
  }
}
