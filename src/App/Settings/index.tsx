import React, { Component } from "react";
import { SettingsType, ServerUrl } from "../../common/settings";

interface SettingsChanged {
  appSettings: {
    usb2SnesServerUrl: boolean;
  }
}

interface SettingsProps {
  settings: SettingsType;
  updateStoreAppSettings: Function;
}

interface SettingsState {
  hasChanged: SettingsChanged;
  newSettings: SettingsType;
}

export class Settings extends Component<SettingsProps, SettingsState> {
  state: SettingsState = {
    hasChanged: {
      appSettings: {
        usb2SnesServerUrl: false
      }
    },
    newSettings: {
      ...this.props.settings
    }
  }

  updateAppSettings() {
    
  }

  onUsb2SnesInputChange(usb2SnesServerUrl: ServerUrl) {
    
  }

  render() {
    const appSettings = this.props.settings.appSettings;

    return (
      <React.Fragment>
        <h2>Settings</h2>
        <div id="server-url-container">
          Usb2SNES Server URL: <input /* onChange={} */ defaultValue={appSettings.usb2SnesServerUrl} />
        </div>
        <div className="settings-button" id="save-button" onClick={this.updateAppSettings.bind(this)}>Save</div>
      </React.Fragment>
    );
  }
}
