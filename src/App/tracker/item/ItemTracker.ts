import { InventoryState, ItemName, InventoryStateUpdate } from "../../../common/inventory";

export class ItemTracker {
  getInventoryStateUpdates(previousInventoryState: InventoryState, currentInventoryState: InventoryState): InventoryStateUpdate {
    let inventoryUpdate: InventoryStateUpdate = {};

    for (let itemName in currentInventoryState) {
      let item = itemName as ItemName;
      if (previousInventoryState[item] === currentInventoryState[item]) {
        continue;
      }

      inventoryUpdate[item] = currentInventoryState[item];
    }

    return inventoryUpdate;
  }
}
