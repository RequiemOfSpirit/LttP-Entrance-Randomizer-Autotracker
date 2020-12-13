import { DeviceName, ConnectionStatus, ConnectedDevice, DeviceList } from "../../common/devices";

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

export interface Usb2SnesCallbackMethods {
  listDevicesCallback: (deviceList: DeviceList) => void;
  getDeviceInfoCallback: (deviceInfo: ConnectedDevice) => void;
  connectionStatusUpdateCallback: (connectionStatus: ConnectionStatus) => void;
}

interface Usb2SnesClientConstructorParams {
  callbackMethods: Usb2SnesCallbackMethods;
}

export class Usb2SnesClient {
  protected socketConnection: WebSocket;
  private commandHistory: Array<Command>;

  // Config
  private serverURI: string;

  // Callback Methods
  private onNewDeviceList: (deviceList: DeviceList) => void;
  private onNewDeviceInfo: (deviceInfo: ConnectedDevice) => void;
  private onConnectionStatusChange: (connectionStatus: ConnectionStatus) => void;

  constructor(params: Usb2SnesClientConstructorParams) {
    this.serverURI = "ws://127.0.0.1:8080";
    this.onNewDeviceList = params.callbackMethods.listDevicesCallback;
    this.onNewDeviceInfo = params.callbackMethods.getDeviceInfoCallback;
    this.onConnectionStatusChange = params.callbackMethods.connectionStatusUpdateCallback;
    this.newConnectionToServer();
  }

  connect(deviceName: string): void {
    this.sendMessage({
      Opcode: "Attach",
      Space: "SNES",
      Operands: [deviceName]
    });

    this.onConnectionStatusChange(ConnectionStatus.CONNECTING);
    this.getInfo(deviceName);
  }

  reconnectToServer() {
    if (this.socketConnection) {
      this.socketConnection.close();
    }

    this.newConnectionToServer();
  }

  listDevices(): void {
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

  getInfo(deviceName: DeviceName): void {
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

  protected readAddress(address: string, bytes: string): void {
    this.sendMessage({
      Opcode: "GetAddress",
      Space: "SNES",
      Operands: [address, bytes]
    });
  }

  protected onConnectionOpen(event: Event): void {
    console.log("Open:", event);
    this.onConnectionStatusChange(ConnectionStatus.IDLE);
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
        this.onNewDeviceList(data.Results);
        break;
      case CommandType.INFO:
        let connectedDevice: ConnectedDevice = {
          name: request.params.deviceName,
          info: data.Results
        }

        console.log("Connected");
        this.onNewDeviceInfo(connectedDevice);
        this.onConnectionStatusChange(ConnectionStatus.CONNECTED);
        break;
    }
  }

  protected onError(event: Event): void {
    console.log("Error:", event);
  }

  protected onConnectionClose(event: CloseEvent): void {
    console.log("Close:", event);
    this.onConnectionStatusChange(ConnectionStatus.INACTIVE);
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
}
