// Types
import { WorldType } from "../../common/types/locations.types";
import { LttpMemoryParserConfig } from "./LttpMemoryParserConfig";

// Constants
import { UNUSED_WORLD_TYPE_INDEX } from "../../common/locations";
import { MEMORY_PARSER_CONFIG } from "./LttpMemoryParserConfig";

// Classes
import { Location } from "../../common/locations";
import { InventoryState, RawInventoryState } from "../../common/inventory";

// Merge in methods of the Blob object type not present in the typescript Blob interface
declare global {
  interface Blob {
    arrayBuffer: () => Promise<ArrayBuffer>;
  }
}

export class LttpMemoryParser {
  config: LttpMemoryParserConfig;

  constructor(config: LttpMemoryParserConfig = MEMORY_PARSER_CONFIG) {
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
