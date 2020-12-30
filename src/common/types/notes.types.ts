import { EntranceLocationId } from "./mapData.types";

export type Notes = {
  text: Array<string>,
  references: { [key in EntranceLocationId]?: number }
};
