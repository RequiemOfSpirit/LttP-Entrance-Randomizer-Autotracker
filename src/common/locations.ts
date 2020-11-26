export type EntranceLinks = { [key: string]: string };

export enum WorldType {
  OVERWORLD = 0,
  UNDERWORLD = 1
}

export class Location {
  readonly worldType: number;
  readonly overworldIndex: number;
  readonly underworldIndex: number;
  readonly coordinates: { x: number, y: number };

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
