import React, { Component } from "react";
import { DeviceList, DeviceName } from "../../common/devices";

interface ConnectionsProps {
  devices: DeviceList;
  refreshDeviceList: () => void;
  connectToDevice: (deviceName: DeviceName) => void;
  reconnectToServer: () => void;
}

interface ConnectionsState {}

export default class Connections extends Component<ConnectionsProps, ConnectionsState> {
  constructor(props: ConnectionsProps) {
    super(props);
    this.onDeviceClick = this.onDeviceClick.bind(this);
    this.refresh = this.refresh.bind(this);
    this.reconnect = this.reconnect.bind(this);
  }

  refresh(): void {
    this.props.refreshDeviceList();
    this.setState({});
  }

  reconnect(): void {
    this.props.reconnectToServer();
    this.setState({});
  }

  onDeviceClick(event: React.MouseEvent<HTMLLIElement, MouseEvent>) {
    let deviceName = (event.target as HTMLLIElement).innerHTML;  // TODO: extract to separate function?
    this.props.connectToDevice(deviceName);
  }

  render() {
    let deviceList = this.props.devices.map(deviceName => {
      return <li key={ deviceName } onClick={this.onDeviceClick}>{ deviceName }</li>
    });

    return (
      <React.Fragment>
        <h2>Connections</h2>
        <ul>
          { deviceList }
        </ul>
        <div className="connectivity-button" id="device-refresh-button" onClick={this.refresh}>
          Refresh
        </div>
        <div className="connectivity-button" id="reconnect-button" onClick={this.reconnect}>
          Reconnect
        </div>
      </React.Fragment>
    );
  }
}
