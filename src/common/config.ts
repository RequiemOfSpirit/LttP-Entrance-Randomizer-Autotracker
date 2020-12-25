import { GlobalConfig } from "./types/config.types";
import { MemorySegmentType } from "./types/devices.types";

export const GLOBAL_CONFIG: GlobalConfig = {
  // Config needed for the App component to function
  appConfig: {
    initialIntervalId: -1,
    locationPollIntervalLength: 800,
    inventoryPollIntervalLength: 2000
  },

  // Config needed for the location tracker to function
  locationTrackerConfig: {
    entranceTriggerWidth: 20,
    entranceTriggerHeight: 60
  },

  // Config dictating the values to be used when reading memory using Usb2Snes servers
  memorySegmentConfig: {
    locationSegment: {
      baseAddress: "F5001B",
      readLength: "87",  // Read length from SNES ram
      type: MemorySegmentType.LOCATION
    },
    inventorySegment: {
      baseAddress: "F5F34A",
      readLength: "1",
      type: MemorySegmentType.INVENTORY
    }
  }
};
