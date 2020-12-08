export type DeviceName = string;
export type DeviceList = Array<DeviceName>;

export type ConnectedDevice = {
  name: DeviceName | null;
  info: Array<string>;
};

export enum ConnectionStatus {
  INACTIVE = "Inactive",  // Not connected to a Usb2Snes Server
  IDLE = "Idle",  // Connected to a Usb2Snes Server, ready to connect to a device
  CONNECTING = "Connecting",  // Connecting to a Device
  CONNECTED = "Connected"  // Connected to a Device
}

export const EMPTY_DEVICE_LIST: DeviceList = [];
export const NULL_DEVICE: ConnectedDevice = {
  name: null,
  info: []
};
