import { WorldType } from "./types/locations.types";

export class Location {
  readonly worldType: WorldType;
  readonly screenIndex: number;
  readonly coordinates: { x: number, y: number };

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

export class NamedLocation extends Location {
  readonly name: string;

  constructor(
    name: string,
    worldType: number,
    screenIndex: number,
    xPosition: number,
    yPosition: number
  ) {
    super(worldType, screenIndex, xPosition, yPosition);
    this.name = name;
  }
}
