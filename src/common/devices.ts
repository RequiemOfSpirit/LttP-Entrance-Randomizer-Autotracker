export type DeviceName = string;
export type DeviceList = Array<DeviceName>;

export enum ConnectionStatus {
  DISCONNECTED = "Disconnected",  // Not connected to a Usb2Snes Server
  CONNECTING = "Connecting",  // Connecting to a Usb2Snes Server
  IDLE = "Idle",  // Connected to a Usb2Snes Server, ready to connect to a device
  CONNECTED = "Connected"  // Connected to a Device
}
