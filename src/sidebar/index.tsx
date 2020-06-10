import React from 'react';

import { ReactWidget } from '@jupyterlab/apputils';

import Sidebar from './Sidebar';

import { NotebookTools, INotebookTracker } from '@jupyterlab/notebook';
import { PanelLayout } from '@phosphor/widgets';
import { JupyterFrontEnd } from '@jupyterlab/application';
import { ISettingRegistry } from '@jupyterlab/coreutils';

const SYNTHI_TOOL_CLASS = 'jp-adi-Tools';

export class SidebarTool extends NotebookTools.Tool {
  constructor(
    notebookTracker: INotebookTracker,
    app: JupyterFrontEnd,
    settingRegistry: ISettingRegistry
  ) {
    super();

    let layout = (this.layout = new PanelLayout());
    this.addClass(SYNTHI_TOOL_CLASS);
    const widget = new SidebarWidget(notebookTracker, settingRegistry)
    layout.addWidget(widget);
  }
}

class SidebarWidget extends ReactWidget {
  constructor(
    notebookTracker: INotebookTracker, 
    settingsRegistry: ISettingRegistry
  ) {
    super();
    this.notebookTracker = notebookTracker;
    this.settingsRegistry = settingsRegistry
  }

  render() {
    const { notebookTracker, settingsRegistry } = this

    return (
      <Sidebar
        notebookTracker={notebookTracker}
        settingsRegistry={settingsRegistry}
      />
    )
  }

  private settingsRegistry: ISettingRegistry;
  private notebookTracker: INotebookTracker;
}
