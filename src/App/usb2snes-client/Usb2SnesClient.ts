import { DeviceName, ConnectionStatus, ConnectedDevice, NULL_DEVICE } from "../../common/devices";

enum CommandType {
  LIST = "DeviceList",
  INFO = "Info"
}

interface Command {
  type: CommandType;
  params: { [key: string]: string }
}

interface Usb2SnesMessage {
  Opcode: string;
  Space: string;
  Flags?: Array<string>;
  Operands?: Array<string>;
}

export interface Usb2SnesStoreAccessors {
  updateDeviceList: Function;
  updateConnectedDevice: Function;
  updateServerConnectionStatus: Function;
  resetDeviceData: Function;
}

interface Usb2SnesClientConstructorParams {
  storeAccessors: Usb2SnesStoreAccessors;
}

export class Usb2SnesClient {
  protected socketConnection: WebSocket;
  private serverURI: string;
  private commandHistory: Array<Command>;
  private updateDeviceList: Function;
  private updateConnectedDevice: Function;
  private updateConnectionStatus: Function;
  private resetDeviceData: Function;

  constructor(params: Usb2SnesClientConstructorParams) {
    this.serverURI = "ws://127.0.0.1:8080";
    this.updateDeviceList = params.storeAccessors.updateDeviceList;
    this.updateConnectedDevice = params.storeAccessors.updateConnectedDevice;
    this.updateConnectionStatus = params.storeAccessors.updateServerConnectionStatus;
    this.resetDeviceData = params.storeAccessors.resetDeviceData;
    this.newConnectionToServer();
  }

  connect(deviceName: string): void {
    this.sendMessage({
      Opcode: "Attach",
      Space: "SNES",
      Operands: [deviceName]
    });

    this.updateConnectionStatus(ConnectionStatus.CONNECTING);
    this.getInfo(deviceName);
  }

  reconnectToServer() {
    if (this.socketConnection) {
      this.socketConnection.close();
    }

    this.newConnectionToServer();
  }

  refreshDeviceList(): void {
    this.listDevices();
  }

  protected readAddress(address: string, bytes: string): void {
    this.sendMessage({
      Opcode: "GetAddress",
      Space: "SNES",
      Operands: [address, bytes]
    });
  }

  protected onConnectionOpen(event: Event): void {
    console.log("Open:", event);
    this.updateConnectionStatus(ConnectionStatus.IDLE);
    this.listDevices();
  }

  protected onMessage(event: MessageEvent): void {
    console.log("Message:", event);

    const request = this.commandHistory.shift();
    if (request === undefined) {
      console.error("No request issued corresponding to received message");
      return;
    }

    const data = JSON.parse(event.data);

    switch (request.type) {
      case CommandType.LIST:
        this.updateDeviceList(data.Results);
        break;
      case CommandType.INFO:
        let connectedDevice: ConnectedDevice = {
          name: request.params.deviceName,
          info: data.Results
        }
        this.updateConnectedDevice(connectedDevice);

        console.log("Connected");
        this.updateConnectionStatus(ConnectionStatus.CONNECTED);
        break;
    }
  }

  protected onError(event: Event): void {
    console.log("Error:", event);
  }

  protected onConnectionClose(event: CloseEvent): void {
    console.log("Close:", event);
    this.updateConnectionStatus(ConnectionStatus.INACTIVE);
  }

  protected sendMessage(message: Usb2SnesMessage): void {
    switch (this.socketConnection.readyState) {
      case 0:
        console.error(`Unable to send message "${message.Opcode}". Still connecting to the server.`);
        break;
      case 1:
        this.socketConnection.send(JSON.stringify(message));
        break;
      default:
        console.error(`Unable to send message "${message.Opcode}". Please reconnect to the server.`);
    }
  }

  // Initialize/Reset instance variable values
  protected resetData() {
    this.resetDeviceData();
    this.commandHistory = [];
  }

  private newConnectionToServer() {
    this.resetData();

    this.socketConnection = new WebSocket(this.serverURI);
    this.socketConnection.onopen = this.onConnectionOpen.bind(this);
    this.socketConnection.onmessage = this.onMessage.bind(this);
    this.socketConnection.onerror = this.onError.bind(this);
    this.socketConnection.onclose = this.onConnectionClose.bind(this);
  }

  private listDevices(): void {
    const command: Command = {
      type: CommandType.LIST,
      params: {}
    };
    this.commandHistory.push(command);

    this.sendMessage({
      Opcode: "DeviceList",
      Space: "SNES"
    });
  }

  private getInfo(deviceName: DeviceName): void {
    const command: Command = {
      type: CommandType.INFO,
      params: { deviceName }
    };
    this.commandHistory.push(command);

    this.sendMessage({
      Opcode: "Info",
      Space: "SNES"
    });
  }
}
