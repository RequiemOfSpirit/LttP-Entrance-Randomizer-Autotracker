import { ItemName } from "../../common/types/inventory.types";

type LocationSegmentIndices = {
  overworld: { start: number, end: number },
  underworld: { start: number, end: number },
  coordinates: { start: number, end: number },
  worldType: number;
}

type InventorySegmentIndices = {
  [key in ItemName]: number
}

export type LttpMemoryParserConfig = {
  locationSegmentIndices: LocationSegmentIndices;
  inventorySegmentIndices: InventorySegmentIndices;
}

// This config lists the indices of specific data fragments in the memory segment received
export const MEMORY_PARSER_CONFIG : LttpMemoryParserConfig = {
  locationSegmentIndices: {
    worldType: 0,
    overworld: {
      start: 111,
      end: 113
    },
    underworld: {
      start: 133,
      end: 135
    },
    coordinates: {
      start: 5,
      end: 9
    }
  },
  inventorySegmentIndices: {
    lamp: 0
  }
};
