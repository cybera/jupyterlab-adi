import { JupyterFrontEnd, JupyterFrontEndPlugin } from '@jupyterlab/application';

import { INotebookTools, INotebookTracker } from '@jupyterlab/notebook';

import { Sidebar } from './sidebar'

import '../style/index.css';

function activate(
  app: JupyterFrontEnd,
  cellTools: INotebookTools,
  notebook_Tracker: INotebookTracker
) {
  const tagsTool = new Sidebar(notebook_Tracker, app);
  cellTools.addItem({ tool: tagsTool, rank: 1.7 });
}

const extension: JupyterFrontEndPlugin<void> = {
  id: 'jupyterlab-adi',
  autoStart: true,
  requires: [INotebookTools, INotebookTracker],
  activate: activate
};

export default extension;