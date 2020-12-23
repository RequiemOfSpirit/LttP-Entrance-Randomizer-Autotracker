import { ItemName } from "../../common/inventory"

type LocationSegmentIndicesType = {
  overworld: { start: number, end: number },
  underworld: { start: number, end: number },
  coordinates: { start: number, end: number },
  worldType: number;
}

type InventorySegmentIndicesType = {
  [key in ItemName]: number
}

export type LttpMemoryParserConfigType = {
  locationSegmentIndices: LocationSegmentIndicesType;
  inventorySegmentIndices: InventorySegmentIndicesType;
}

// This config lists the indices of specific data fragments in the memory segment received
export const LttpMemoryParserConfig : LttpMemoryParserConfigType = {
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
