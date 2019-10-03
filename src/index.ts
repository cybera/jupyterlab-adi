import {
  JupyterFrontEnd, JupyterFrontEndPlugin
} from '@jupyterlab/application';


/**
 * Initialization data for the adi extension.
 */
const extension: JupyterFrontEndPlugin<void> = {
  id: 'adi',
  autoStart: true,
  activate: (app: JupyterFrontEnd) => {
    console.log('JupyterLab extension adi is activated!');
  }
};

export default extension;
