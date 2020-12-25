import { BinaryItemState, ItemName } from "./types/inventory.types";

export type RawInventoryState = {
  [key in ItemName]: number;
}

export class InventoryState {
  lamp: BinaryItemState = 0;

  constructor(rawInventoryState: RawInventoryState) {
    this.lamp = (rawInventoryState.lamp as BinaryItemState);
  }
}

export const BASE_INVENTORY: InventoryState = new InventoryState({
  lamp: BinaryItemState.ABSENT
});
