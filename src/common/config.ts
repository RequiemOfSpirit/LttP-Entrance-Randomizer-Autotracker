import { Item } from "./inventory";

export type AppConfig = {
  [key in (
    "initialIntervalId" |
    "locationPollIntervalLength" |
    "locationProcessIntervalLength" |
    "inventoryPollIntervalLength" |
    "inventoryProcessIntervalLength"
  )]: number
}

export type LocationTrackerConfig = {
  [key in ("entranceTriggerWidth" | "entranceTriggerHeight")]: number
}

type ClientLocationSegment = {
  baseAddress: string;
  readLength: string;
  bufferLength: number;
  unusedWorldTypeIndex: number;
  data: {
    overworld: { start: number, end: number },
    underworld: { start: number, end: number },
    coordinates: { start: number, end: number },
    worldType: number
  }
}

type ClientInventorySegment = {
  baseAddress: string;
  readLength: string;
  bufferLength: number;
  data: {
    [key in Item]: number
  }
}

export type LttpClientConfig = {
  locationSegment: ClientLocationSegment;
  inventorySegment: ClientInventorySegment;
}

export type GlobalConfig = {
  appConfig: AppConfig;
  locationTrackerConfig: LocationTrackerConfig;
  lttpClientConfig: LttpClientConfig;
}

/* Actual Config */
export const GLOBAL_CONFIG: GlobalConfig = {
  appConfig: {
    initialIntervalId: -1,
    locationPollIntervalLength: 800,
    locationProcessIntervalLength: 2000,
    inventoryPollIntervalLength: 3000,
    inventoryProcessIntervalLength: 3000
  },

  locationTrackerConfig: {
    entranceTriggerWidth: 20,
    entranceTriggerHeight: 60
  },

  lttpClientConfig: {
    locationSegment: {
      baseAddress: "F5001B",
      readLength: "87",  // Read length from SNES ram
      bufferLength: 135,  // Actual length of buffer received
      data: {  // Location of components within the received segment
        worldType: 0,
        overworld: {
          start: 111,
          end: 113
        },
        underworld: {
          start: 133,
          end: 135
        },
        coordinates: {
          start: 5,
          end: 9
        }
      },
      unusedWorldTypeIndex: -1  // Value to be assigned to the unused screen type when creating a location
    },
    inventorySegment: {
      baseAddress: "F5F34A",
      readLength: "1",
      bufferLength: 1,
      data: {
        lamp: 0
      }
    }
  }

};
