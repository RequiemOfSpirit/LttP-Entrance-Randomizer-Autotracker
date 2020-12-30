export enum EntranceRandomizerType {
  SIMPLE = "simple",
  RESTRICTED = "restricted",
  FULL = "full",
  CROSSED = "crossed",
  INSANITY = "insanity"
}

export type ServerUrl = string;

// App related settings (settings that are non related to locations)
export type AppSettings = {
  usb2SnesServerUrl: ServerUrl;
  entranceRandomizerType: EntranceRandomizerType;
};

export type Settings = {
  appSettings: AppSettings;
};
