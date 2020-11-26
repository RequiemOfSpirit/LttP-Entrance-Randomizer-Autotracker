import { DeviceList, DeviceName, ConnectionStatus } from "../../common/devices";

enum Command {
  LIST = "DeviceList",
  INFO = "Info"
}

interface Usb2SnesMessage {
  Opcode: string;
  Space: string;
  Flags?: Array<string>;
  Operands?: Array<string>;
}

interface Usb2SnesClientConstructorParams {
  updateStoreDevices: Function;
}

export class Usb2SnesClient {
  protected connectionStatus: ConnectionStatus = ConnectionStatus.DISCONNECTED;
  protected deviceList: DeviceList = [];
  protected connectedDeviceName: DeviceName | null = null;
  protected socketConnection: WebSocket;
  private updateStore: Function;
  private commandHistory: Array<Command>;
  private serverURI: string;

  constructor(params: Usb2SnesClientConstructorParams) {
    this.serverURI = "ws://127.0.0.1:8080";
    this.updateStore = params.updateStoreDevices;
    this.newConnectionToServer();
  }

  get currentConnectionStatus(): ConnectionStatus {
    return this.connectionStatus;
  }

  get availableDevices(): DeviceList {
    return this.deviceList;
  }

  get connectedDevice(): DeviceName | null {
    return this.connectedDeviceName;
  }

  // TODO (BACKLOG): add `connectionStatus` to store and send to ConnectivityPage
  connect(deviceName: string): void {
    this.connectedDeviceName = deviceName;
    this.connectionStatus = ConnectionStatus.CONNECTING;
    this.sendMessage({
      Opcode: "Attach",
      Space: "SNES",
      Operands: [deviceName]
    });

    this.dispatchUpdateEvent();
    this.verifyConnection();
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
    this.connectionStatus = ConnectionStatus.IDLE;
    this.listDevices();
  }

  protected onMessage(event: MessageEvent): void {
    console.log("Message:", event);

    let requestType = this.commandHistory.shift();
    let data = event.data;
    switch (requestType) {
      case Command.LIST:
        this.deviceList = JSON.parse(data).Results;
        this.updateStore(this.deviceList);
        break;
      case Command.INFO:
        this.connectionStatus = ConnectionStatus.CONNECTED;
        console.log("Connected");
        break;
    }

    this.dispatchUpdateEvent();
  }

  protected onError(event: Event): void {
    console.log("Error:", event);
  }

  protected onConnectionClose(event: CloseEvent): void {
    console.log("Close:", event);
    if (this.connectionStatus === ConnectionStatus.DISCONNECTED) {
      console.error(`Failed to connect to the server`);
    }

    this.connectionStatus = ConnectionStatus.DISCONNECTED;
    this.dispatchUpdateEvent();
  }

  protected dispatchUpdateEvent() {
    // TODO (BACKLOG): Add more info? Like Ready State? And call this event again if nothing has changed?
    let event = new Event("ConnectionUpdate");
    window.dispatchEvent(event);
  }

  protected sendMessage(message: Usb2SnesMessage): void {
    if (this.socketConnection.readyState === 1) {
      this.socketConnection.send(JSON.stringify(message));
    } else {
      console.warn(`Unable to send message "${message.Opcode}". Still Connecting.`);
    }
  }

  // Initialize/Reset instance variable values
  protected resetData() {
    this.deviceList = [];
    this.connectedDeviceName = null;
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
    this.commandHistory.push(Command.LIST);
    this.sendMessage({
      Opcode: "DeviceList",
      Space: "SNES"
    });
  }

  private verifyConnection(): void {
    this.commandHistory.push(Command.INFO);
    this.sendMessage({
      Opcode: "Info",
      Space: "SNES"
    });
  }
}
