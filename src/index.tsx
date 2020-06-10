import { JupyterFrontEnd, JupyterFrontEndPlugin } from '@jupyterlab/application';
import { ISettingRegistry } from '@jupyterlab/coreutils';

import { INotebookTools, INotebookTracker } from '@jupyterlab/notebook';

import { SidebarTool } from './sidebar'

import '../style/index.css';

function activate(
  app: JupyterFrontEnd,
  cellTools: INotebookTools,
  notebookTracker: INotebookTracker,
  settingRegistry: ISettingRegistry
) {
  const sidebar = new SidebarTool(notebookTracker, app, settingRegistry);
  cellTools.addItem({ tool: sidebar, rank: 1.7 });
}

const extension: JupyterFrontEndPlugin<void> = {
  id: 'jupyterlab-synthi',
  autoStart: true,
  requires: [INotebookTools, INotebookTracker, ISettingRegistry],
  activate: activate
};

export default extension;
