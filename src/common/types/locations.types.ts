import { Location, EntranceLocation } from "../locations";

export type LocationLink = {
  source: Location,
  destination: Location
};

export type EntranceLink = {
  source: EntranceLocation;
  destination: EntranceLocation;
};
export type EntranceLinksById = { [key: string]: string };

export enum WorldType {
  OVERWORLD = 0,
  UNDERWORLD = 1
}
