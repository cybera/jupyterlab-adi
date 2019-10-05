import { NotebookTools, INotebookTracker } from '@jupyterlab/notebook';
import { PanelLayout } from '@phosphor/widgets';
import { JupyterFrontEnd } from '@jupyterlab/application';
import { ISettingRegistry } from '@jupyterlab/coreutils';
import { Message } from '@phosphor/messaging';
import { ObservableJSON } from '@jupyterlab/observables';
import Sidebar from './Sidebar';
import SidebarWidget from './SidebarWidget'
import React from 'react'
import ReactDOM from 'react-dom';

import ApolloClient from 'apollo-boost';

import { ConfigSettings } from '../settings'

const ADI_TOOL_CLASS = 'jp-adi-Tools';

export class SidebarTool extends NotebookTools.Tool {
  constructor(
    notebookTracker: INotebookTracker,
    app: JupyterFrontEnd,
    settingRegistry: ISettingRegistry
  ) {
    super();
    this.notebookTracker = notebookTracker;
    let layout = (this.layout = new PanelLayout());
    this.addClass(ADI_TOOL_CLASS);
    this.widget = new SidebarWidget(notebookTracker)
    layout.addWidget(this.widget);

    Private.setWidget(this)
    Private.renderSidebar()

    settingRegistry
      .load('adi:plugin')
      .then((settings: ISettingRegistry.ISettings) => {
        settings.changed.connect(() => {
          this.onSettingsChanged(settings);
        })
        this.onSettingsChanged(settings);
      })
  }

  protected onActiveCellChanged(msg: Message): void {
  }

  protected onAfterShow() {
  }

  protected onAfterAttach() {
  }

  protected onMetadataChanged(msg: ObservableJSON.ChangeMessage): void {
  }

  private onSettingsChanged(settings: ISettingRegistry.ISettings) {
    const configSettings = settings.composite as ConfigSettings

    const client = new ApolloClient({
      uri: configSettings.endpoint,
      headers: {
        'Authorization': `Api-Key ${configSettings.apiKey}`
      }
    });
  
    Private.renderSidebar(client, configSettings.organization)
  }

  public notebookTracker!: INotebookTracker;
  private widget!: SidebarWidget;
}

namespace Private {
  let widget: SidebarWidget | undefined;

  export function setWidget(currentWidget?: SidebarWidget) {
    widget = currentWidget;
  }

  export function renderSidebar(client?: ApolloClient<unknown>, organization?: string) {
    if (client && organization && widget) {
      ReactDOM.render(
        <Sidebar client={client} organization={organization} />,
        widget.node
      );
    }
  }
}
