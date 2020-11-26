import { InventoryState, Item, InventoryStateUpdate } from "../../common/inventory";

export class ItemTracker {
  currentInventoryState: InventoryState;

  constructor(inventoryState: InventoryState) {
    this.currentInventoryState = inventoryState;
  }

  getInventoryStateUpdates(latestInventoryState: InventoryState): InventoryStateUpdate {
    let inventoryUpdate: InventoryStateUpdate = {};

    for (let itemName in latestInventoryState) {
      let item = itemName as Item;
      if (this.currentInventoryState[item] === latestInventoryState[item]) {
        continue;
      }

      inventoryUpdate[item] = latestInventoryState[item];
    }

    return inventoryUpdate;
  }

  updateCurrentInventory(currentInventoryState: InventoryState) {
    this.currentInventoryState = currentInventoryState;
  }
}
