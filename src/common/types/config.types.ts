import { MemorySegmentType } from "./devices.types";

export type AppConfig = {
  [key in ("initialIntervalId" | "locationPollIntervalLength" | "inventoryPollIntervalLength")]: number
};

export type LocationTrackerConfig = {
  [key in ("entranceTriggerWidth" | "entranceTriggerHeight")]: number
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
