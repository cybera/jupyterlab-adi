import {
  ILayoutRestorer, JupyterFrontEnd, JupyterFrontEndPlugin
} from '@jupyterlab/application';

import {
  ICommandPalette, MainAreaWidget, WidgetTracker
} from '@jupyterlab/apputils';

import {
  Widget
} from '@phosphor/widgets';

// import {
//   Message
// } from '@phosphor/messaging';

import DatasetListWidget2 from './datasets'

// class DatasetListWidget extends Widget {
//   /**
//   * Construct a new APOD widget.
//   */
//   constructor() {
//     super();

//     this.addClass('my-apodWidget'); // new line

//     // Add an image element to the panel
//     this.img = document.createElement('img');
//     this.node.appendChild(this.img);

//     // Add a summary element to the panel
//     this.summary = document.createElement('p');
//     this.node.appendChild(this.summary);
//   }

//   /**
//   * The image element associated with the widget.
//   */
//   readonly img: HTMLImageElement;

//   /**
//   * The summary text element associated with the widget.
//   */
//   readonly summary: HTMLParagraphElement;

//   /**
//   * Handle update requests for the widget.
//   */
//   async onUpdateRequest(msg: Message): Promise<void> {
//     // re-rendering?
//   }
// }

/**
* Activate the DatasetListWidget widget extension.
*/
function activate(app: JupyterFrontEnd, palette: ICommandPalette, restorer: ILayoutRestorer) {
  console.log('JupyterLab extension jupyterlab_adi is activated!');

  // Declare a widget variable
  let widget: MainAreaWidget<Widget>;

  // Add an application command
  const command: string = 'adi:open';
  app.commands.addCommand(command, {
    label: 'ADI Datasets',
    execute: () => {
      if (!widget) {
        // Create a new widget if one does not exist
        // const content = new DatasetListWidget();
        widget = new MainAreaWidget({content: DatasetListWidget2});
        widget.id = 'adi-datasets-jupyterlab';
        widget.title.label = 'ADI Datasets';
        widget.title.closable = true;
      }
      if (!tracker.has(widget)) {
        // Track the state of the widget for later restoration
        tracker.add(widget);
      }
      if (!widget.isAttached) {
        // Attach the widget to the main work area if it's not there
        app.shell.add(widget, 'main');
      }
      widget.content.update();

      // Activate the widget
      app.shell.activateById(widget.id);
    }
  });

  // Add the command to the palette.
  palette.addItem({ command, category: 'Tutorial' });

  // Track and restore the widget state
  let tracker = new WidgetTracker<MainAreaWidget<Widget>>({
    namespace: 'adi'
  });
  restorer.restore(tracker, {
    command,
    name: () => 'adi'
  });
}

/**
 * Initialization data for the adi extension.
 */
const extension: JupyterFrontEndPlugin<void> = {
  id: 'adi',
  autoStart: true,
  requires: [ICommandPalette, ILayoutRestorer],
  activate: activate
};

export default extension;
