import { InventoryState } from "../../../common/inventory";
import { InventoryStateUpdate, ItemName } from "../../../common/types/inventory.types";

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
