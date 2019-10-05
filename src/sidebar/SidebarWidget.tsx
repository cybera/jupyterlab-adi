import { INotebookTracker } from '@jupyterlab/notebook';
import { Widget } from '@phosphor/widgets';

export default class SidebarWidget extends Widget {
  constructor(notebookTracker: INotebookTracker) {
    super();
  }
}
