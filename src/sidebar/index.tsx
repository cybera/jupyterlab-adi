import { NotebookTools, INotebookTracker } from '@jupyterlab/notebook';
import { PanelLayout } from '@phosphor/widgets';
import { JupyterFrontEnd } from '@jupyterlab/application';
import { Message } from '@phosphor/messaging';
import { ObservableJSON } from '@jupyterlab/observables';
import DatasetWidget from '../datasets';
import { Widget } from '@phosphor/widgets';

const ADI_TOOL_CLASS = 'jp-adi-Tools';

export class Sidebar extends NotebookTools.Tool {
  constructor(notebook_Tracker: INotebookTracker, app: JupyterFrontEnd) {
    super();
    this.notebookTracker = notebook_Tracker;
    let layout = (this.layout = new PanelLayout());
    this.addClass(ADI_TOOL_CLASS);
    this.widget = DatasetWidget
    layout.addWidget(this.widget);
  }

  protected onActiveCellChanged(msg: Message): void {
  }

  protected onAfterShow() {
  }

  protected onAfterAttach() {
  }

  protected onMetadataChanged(msg: ObservableJSON.ChangeMessage): void {
  }

  private widget: Widget = null;
  public notebookTracker: INotebookTracker = null;
}