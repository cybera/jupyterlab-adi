import React, { useState } from 'react';

import { ISettingRegistry } from '@jupyterlab/coreutils';
import { UseSignal } from '@jupyterlab/apputils';

import { ConfigSettings } from '../settings'

const settingsDefaults = {
  endpoint: '',
  apiKey: '',
  organization: '',
}

const SettingsContext = React.createContext(settingsDefaults)

const JupyterSettings = (props:{
  settingRegistry:ISettingRegistry,
  children:React.ReactElement
}) => {
  const { settingRegistry, children } = props
  const [settings, setSettings] = useState(settingsDefaults)
  return (
    <UseSignal signal={settingRegistry.pluginChanged}>
      {
        (_, args) => {
          settingRegistry
            .load('adi:plugin')
            .then((iSettings: ISettingRegistry.ISettings) => {
              setSettings(iSettings.composite as ConfigSettings)
            })
    
          return (
            <SettingsContext.Provider value={settings}>
              { children }
            </SettingsContext.Provider>
          )
        }
      }
    </UseSignal>  
  )
}

export { JupyterSettings, SettingsContext }
