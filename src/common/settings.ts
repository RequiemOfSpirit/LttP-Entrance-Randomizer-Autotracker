import { Settings, EntranceRandomizerType } from "./types/settings.types";

export const BASE_SETTINGS: Settings = {
  appSettings: {
    usb2SnesServerUrl: "ws://127.0.0.1:8080",
    entranceRandomizerType: EntranceRandomizerType.CROSSED
  }
};
