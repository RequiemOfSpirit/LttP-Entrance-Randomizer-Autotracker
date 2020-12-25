import { Location } from "../locations";

export type LocationWithBackup = {
  // The main location that is read from this object
  main: Location,

  // Backup location (previous/next location read) incase the main location contained incorrect data
  backup: Location
};

// Type used for storing and processing the stream of locations read from the game
export type LocationLinkWithBackups = {
  previous: LocationWithBackup,
  next: LocationWithBackup
};

export type NewEntranceLink = {
  source: string;
  destination: string;
  doesExist: boolean;
};
export type EntranceLinks = { [key: string]: string };

export enum WorldType {
  OVERWORLD = 0,
  UNDERWORLD = 1
}
