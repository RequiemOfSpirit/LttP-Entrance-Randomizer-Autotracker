import { MemorySegmentType } from "./devices.types";
import { Dimensions } from "./locations.types";

export type AppConfig = {
  [key in ("initialIntervalId" | "locationPollIntervalLength" | "inventoryPollIntervalLength")]: number
};

export type LocationTrackerConfig = {
  entranceTriggerSize: Dimensions;
};

export type MemorySegmentConfig = {
  baseAddress: string;
  readLength: string;
  type: MemorySegmentType;
};

type LttpMemorySegments = {
  locationSegment: MemorySegmentConfig;
  inventorySegment: MemorySegmentConfig;
};

export type GlobalConfig = {
  appConfig: AppConfig;
  locationTrackerConfig: LocationTrackerConfig;
  memorySegmentConfig: LttpMemorySegments;
};
