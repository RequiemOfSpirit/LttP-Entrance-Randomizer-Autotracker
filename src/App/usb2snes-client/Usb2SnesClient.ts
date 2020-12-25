import { DeviceName, ConnectionStatus, ConnectedDevice, DeviceList } from "../../common/types/devices.types";

enum CommandType {
  LIST = "DeviceList",
  INFO = "Info",
  READ_MEMORY = "GetAddress"
}

interface Command {
  type: CommandType;
  params: { [key: string]: string }
}

interface Usb2SnesRequestMessage {
  Opcode: string;
  Space: string;
  Flags?: Array<string>;
  Operands?: Array<string>;
}

/**
 * Params to support subcriptions on messages.
 * To support a more general pub-sub mechanism, these fields could be
 *  Arrays of methods instead.
 * A `register` method could be added to the class to allow new subscribers
 *  to be added for each method.
 * This is not necessary for this App and is hence not implemented.
 */
// TODO (BACKLOG): Put these callback methods in one object when settings get added to the constructor params
interface Usb2SnesClientConstructorParams {
  listDevicesCallback: (deviceList: DeviceList) => void;
  getDeviceInfoCallback: (deviceInfo: ConnectedDevice) => void;
  readMemoryCallback: (byteData: Blob, segmentAlias: string) => void;
  connectionStatusUpdateCallback: (connectionStatus: ConnectionStatus) => void;
}

export class Usb2SnesClient {
  protected socketConnection: WebSocket;
  private commandHistory: Array<Command>;

  // Config
  private serverURI: string;

  // Callback Methods
  private onNewDeviceList: (deviceList: DeviceList) => void;
  private onNewDeviceInfo: (deviceInfo: ConnectedDevice) => void;
  private onNewMemorySegment: (byteData: Blob, segmentAlias: string) => void;
  private onConnectionStatusChange: (connectionStatus: ConnectionStatus) => void;

  constructor(params: Usb2SnesClientConstructorParams) {
    // TODO (BACKLOG): Inject this URI from settings provided in the params
    this.serverURI = "ws://127.0.0.1:8080";
    this.onNewDeviceList = params.listDevicesCallback;
    this.onNewDeviceInfo = params.getDeviceInfoCallback;
    this.onNewMemorySegment = params.readMemoryCallback;
    this.onConnectionStatusChange = params.connectionStatusUpdateCallback;
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

  readMemory(address: string, bytes: string, segmentAlias: string = ""): void {
    const command: Command = {
      type: CommandType.READ_MEMORY,
      params: { segmentAlias }
    };
    this.commandHistory.push(command);

    this.sendMessage({
      Opcode: "GetAddress",
      Space: "SNES",
      Operands: [address, bytes]
    });
  }

  protected sendMessage(message: Usb2SnesRequestMessage): void {
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

  protected onConnectionOpen(event: Event): void {
    console.log("Open:", event);
    this.onConnectionStatusChange(ConnectionStatus.IDLE);
    this.listDevices();
  }

  protected onMessage(event: MessageEvent): void {
    const request = this.commandHistory.shift();
    if (request === undefined) {
      console.error("No request issued corresponding to received message");
      return;
    }

    const data = event.data;
    switch (request.type) {
      case CommandType.LIST:
        this.onNewDeviceList(JSON.parse(data).Results);
        break;

      case CommandType.INFO:
        let connectedDevice: ConnectedDevice = {
          name: request.params.deviceName,
          info: JSON.parse(data).Results
        };

        console.log("Connected");
        this.onNewDeviceInfo(connectedDevice);
        this.onConnectionStatusChange(ConnectionStatus.CONNECTED);
        break;

      case CommandType.READ_MEMORY:
        this.onNewMemorySegment(data, request.params.segmentAlias);
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
