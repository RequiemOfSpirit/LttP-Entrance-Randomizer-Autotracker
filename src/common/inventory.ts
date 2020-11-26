export enum BinaryItemState {
  ABSENT = 0,
  PRESENT = 1
}

export type InventoryStateUpdate = {
  [key in Item]?: BinaryItemState;
}

/*
 * If adding more items have separate types, such as a type for BinaryStateItems
 * Use those types to build the Item type below and use each type as necessary
 */
export type Item = "lamp";

export type RawInventoryState = {
  [key in Item]: number;
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
