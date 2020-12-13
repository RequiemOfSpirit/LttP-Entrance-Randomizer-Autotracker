import { Usb2SnesCallbackMethods, Usb2SnesClient } from "./Usb2SnesClient";
import { LttpClientConfig } from "../../common/config";
import { Location, WorldType } from "../../common/locations";
import { InventoryState, BASE_INVENTORY, RawInventoryState } from "../../common/inventory";

// Merge in methods of the Blob object type not present in the typescript Blob interface
declare global {
  interface Blob {
    arrayBuffer: () => Promise<ArrayBuffer>;
  }
}

interface LttpClientConstructorParams {
  callbackMethods: Usb2SnesCallbackMethods;
  config: LttpClientConfig;
}

export class LttPClient extends Usb2SnesClient {
  locationsQueue: Array<Location> = [];
  latestInventoryState: InventoryState = BASE_INVENTORY;
  config: LttpClientConfig;

  constructor(params: LttpClientConstructorParams) {
    super({ callbackMethods: params.callbackMethods });
    this.config = params.config;
  }

  readLocationSegment(): void {
    const segmentConfig = this.config.locationSegment;
    this.readAddress(segmentConfig.baseAddress, segmentConfig.readLength);
  }

  // Currently only reads the segment for lamp
  readInventorySegment(): void {
    const segmentConfig = this.config.inventorySegment;
    this.readAddress(segmentConfig.baseAddress, segmentConfig.readLength);
  }

  /**
   * Return all locations in the locationsQueue for processing
   * Remove all locations from the locationsQueue except the last two which
   *  are to be compared with the next incoming locations
   * Can cause some locations to be processed twice but this doesn't affect the store
   */
  popLocations(): Array<Location> {
    const withholdingCount = 2;
    let locations = this.locationsQueue.splice(0, this.locationsQueue.length - withholdingCount);
    let withheldLocations = this.locationsQueue.slice(this.locationsQueue.length - withholdingCount, this.locationsQueue.length)
    locations.push(...withheldLocations);

    return locations;
  }

  /**
   * Remove and return all InventoryStates in the InventoryStateQueue for processing
   */
  getLatestInventoryState(): InventoryState {
    return this.latestInventoryState;
  }

  protected async onMessage(event: MessageEvent): Promise<void> {
    if (!(event.data instanceof Blob)) {
      super.onMessage(event);
      return;
    }

    /*
     * Differenciate between inventory segment and location segment based on
     *  size of the blob fetched.
     */
    let dataArray = new Int8Array(await event.data.arrayBuffer());
    if (dataArray.length === this.config.locationSegment.bufferLength) {
      this.locationsQueue.push(this.createLocation(dataArray));
      return;
    }

    if (dataArray.length === this.config.inventorySegment.bufferLength) {
      this.latestInventoryState = this.createInventoryState(dataArray);
      return;
    }
  }

  protected resetData() {
    this.locationsQueue = [];
    super.resetData();
  }

  private createLocation(dataArray: Int8Array): Location {
    const indices = this.config.locationSegment.data;
    const unusedIndexValue = this.config.locationSegment.unusedWorldTypeIndex;

    let worldType = dataArray[indices.worldType];
    let owIndex: number, uwIndex: number;

    if (worldType === WorldType.OVERWORLD) {
      owIndex = new Int16Array(dataArray.slice(indices.overworld.start, indices.overworld.end).buffer)[0];
      uwIndex = unusedIndexValue;
    } else {
      // Underworld
      owIndex = unusedIndexValue;
      uwIndex = new Int16Array(dataArray.slice(indices.underworld.start, indices.underworld.end).buffer)[0];
    }

    let [y, x] = new Int16Array(dataArray.slice(indices.coordinates.start, indices.coordinates.end).buffer);
    return new Location(worldType, owIndex, uwIndex, x, y);
  }

  private createInventoryState(dataArray: Int8Array): InventoryState {
    let indices = this.config.inventorySegment.data;
    let newInventoryState: RawInventoryState = {
      lamp: dataArray[indices.lamp]
    };

    return new InventoryState(newInventoryState);
  }
}
