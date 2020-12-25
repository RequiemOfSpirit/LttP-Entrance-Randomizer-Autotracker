export enum BinaryItemState {
  ABSENT = 0,
  PRESENT = 1
}

/*
 * If adding more items have separate types, such as a type for BinaryStateItems
 * Use those types to build the Item type below and use each type as necessary
 */
export type ItemName = "lamp";

export type InventoryStateUpdate = {
  [key in ItemName]?: BinaryItemState;
}
