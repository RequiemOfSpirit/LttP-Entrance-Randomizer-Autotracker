enum EntranceRandomizerType {
  SIMPLE = "simple",
  RESTRICTED = "restricted",
  FULL = "full",
  CROSSED = "crossed",
  INSANITY = "insanity"
}

export type ServerUrl = string;

// App related settings (settings that are non related to locations)
export interface AppSettings {
  usb2SnesServerUrl: ServerUrl;
  entranceRandomizerType: EntranceRandomizerType;
}

export interface SettingsType {
  appSettings: AppSettings;
}

export const BASE_SETTINGS: SettingsType = {
  appSettings: {
    usb2SnesServerUrl: "ws://127.0.0.1:8080",
    entranceRandomizerType: EntranceRandomizerType.CROSSED
  }
};
