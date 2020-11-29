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

interface Usb2SnesClientConstructorParams {
  updateDeviceList: Function;
  updateConnectedDevice: Function;
}

export class Usb2SnesClient {
  protected socketConnection: WebSocket;
  protected connectionStatus: ConnectionStatus = ConnectionStatus.DISCONNECTED;
  private serverURI: string;
  private commandHistory: Array<Command>;
  private updateDeviceList: Function;
  private updateConnectedDevice: Function;

  constructor(params: Usb2SnesClientConstructorParams) {
    this.serverURI = "ws://127.0.0.1:8080";
    this.updateDeviceList = params.updateDeviceList;
    this.updateConnectedDevice = params.updateConnectedDevice;
    this.newConnectionToServer();
  }

  get currentConnectionStatus(): ConnectionStatus {
    return this.connectionStatus;
  }

  // TODO (BACKLOG): add `connectionStatus` to store and send to ConnectivityPage
  connect(deviceName: string): void {
    this.connectionStatus = ConnectionStatus.CONNECTING;
    this.sendMessage({
      Opcode: "Attach",
      Space: "SNES",
      Operands: [deviceName]
    });

    this.dispatchUpdateEvent();
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
    this.connectionStatus = ConnectionStatus.IDLE;
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

        // TODO (Backlog): Notification here instead
        console.log("Connected");
        this.connectionStatus = ConnectionStatus.CONNECTED;
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
    this.updateDeviceList([]);
    this.updateConnectedDevice(NULL_DEVICE);
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
