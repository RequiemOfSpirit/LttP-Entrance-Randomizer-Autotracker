import { Action } from "../actions";
import { EntranceLocationList, ScreenData } from "../../common/mapData";

export const entranceLocations = (state: EntranceLocationList, action: Action): EntranceLocationList => {
  switch (action.type) {
    default:
      return state;
  }
}

export const screenData = (state: ScreenData, action: Action): ScreenData => {
  switch (action.type) {
    default:
      return state;
  }
}
