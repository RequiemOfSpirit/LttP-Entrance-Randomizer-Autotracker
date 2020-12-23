import { Location, UNUSED_WORLD_TYPE_INDEX, WorldType } from "../../common/locations";
import { InventoryState, RawInventoryState } from "../../common/inventory";
import { LttpMemoryParserConfig, LttpMemoryParserConfigType } from "./LttpMemoryParserConfig";

// Merge in methods of the Blob object type not present in the typescript Blob interface
declare global {
  interface Blob {
    arrayBuffer: () => Promise<ArrayBuffer>;
  }
}

export class LttpMemoryParser {
  config: LttpMemoryParserConfigType;

  constructor(config: LttpMemoryParserConfigType = LttpMemoryParserConfig) {
    /**
     * This config is inherent to this parser and is hence not injected by the App.
     * This is also the reaason why this config is separated from the common global config.
     * A constructor is written here to allow for testing with a different segment structure if necessary.
     */
    this.config = config;
  }

  async parseLocationSegment(byteData: Blob): Promise<Location> {
    let dataArray = new Int8Array(await byteData.arrayBuffer());
    const indices = this.config.locationSegmentIndices;

    let worldType = dataArray[indices.worldType];
    let owIndex: number, uwIndex: number;

    if (worldType === WorldType.OVERWORLD) {
      owIndex = new Int16Array(dataArray.slice(indices.overworld.start, indices.overworld.end).buffer)[0];
      uwIndex = UNUSED_WORLD_TYPE_INDEX;
    } else {
      // Underworld
      owIndex = UNUSED_WORLD_TYPE_INDEX;
      uwIndex = new Int16Array(dataArray.slice(indices.underworld.start, indices.underworld.end).buffer)[0];
    }

    let [yPos, xPos] = new Int16Array(dataArray.slice(indices.coordinates.start, indices.coordinates.end).buffer);
    return new Location(worldType, owIndex, uwIndex, xPos, yPos);
  }

  async parseInventorySegment(byteData: Blob): Promise<InventoryState> {
    let dataArray = new Int8Array(await byteData.arrayBuffer());
    let indices = this.config.inventorySegmentIndices;
    let newInventoryState: RawInventoryState = {
      lamp: dataArray[indices.lamp]
    };

    return new InventoryState(newInventoryState);
  }
}
