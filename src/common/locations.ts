import { Coordinates, WorldType } from "./types/locations.types";

export class Location {
  readonly worldType: WorldType;
  readonly screenIndex: number;
  readonly coordinates: Coordinates;

  // TODO: Accept only screenindex in constructor
  constructor(worldType: number, screenIndex: number, xPosition: number, yPosition: number) {
    this.worldType = (worldType as WorldType);
    this.screenIndex = screenIndex;
    this.coordinates = {
      x: xPosition,
      y: yPosition
    };
  }
}

export class EntranceLocation extends Location {
  readonly id: string;
  readonly name: string;

  constructor(
    id: string,
    name: string,
    worldType: number,
    screenIndex: number,
    xPosition: number,
    yPosition: number
  ) {
    super(worldType, screenIndex, xPosition, yPosition);
    this.id = id;
    this.name = name;
  }
}
