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

export type EntranceLinksType = { [key: string]: string };
export type NewEntranceLinkType = {
  source: string;
  destination: string;
  doesExist: boolean;
};

export enum WorldType {
  OVERWORLD = 0,
  UNDERWORLD = 1
};
export const UNUSED_WORLD_TYPE_INDEX = -1;

export class Location {
  readonly worldType: number;
  readonly overworldIndex: number;
  readonly underworldIndex: number;
  readonly coordinates: { x: number, y: number };

  // TODO: Accept only screenindex in constructor
  constructor(worldType: number, owIndex: number, uwIndex: number, xPosition: number, yPosition: number) {
    this.worldType = (worldType as WorldType);
    this.overworldIndex = owIndex;
    this.underworldIndex = uwIndex;
    this.coordinates = {
      x: xPosition,
      y: yPosition
    };
  }
}

export class NamedLocation extends Location {
  readonly name: string;

  constructor(
    name: string,
    worldType: number,
    owIndex: number,
    uwIndex: number,
    xPosition: number,
    yPosition: number
  ) {
    super(worldType, owIndex, uwIndex, xPosition, yPosition);
    this.name = name;
  }
}
