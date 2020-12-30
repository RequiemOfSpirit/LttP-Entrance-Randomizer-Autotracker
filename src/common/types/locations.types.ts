import { Location, EntranceLocation } from "../locations";
import { EntranceLocationId } from "./mapData.types";

export type LocationLink = {
  source: Location,
  destination: Location
};

export type EntranceLink = {
  source: EntranceLocation;
  destination: EntranceLocation;
};
export type EntranceLinksById = { [key in EntranceLocationId]?: EntranceLocationId };

export enum WorldType {
  OVERWORLD = 0,
  UNDERWORLD = 1
}

export type Coordinates = {
  x: number;
  y: number;
};

export type Dimensions = {
  width: number;
  height: number;
}
