import { NotebookTools, INotebookTracker } from '@jupyterlab/notebook';
import { PanelLayout } from '@phosphor/widgets';
import { JupyterFrontEnd } from '@jupyterlab/application';
import { ISettingRegistry } from '@jupyterlab/coreutils';
import { Message } from '@phosphor/messaging';
import { ObservableJSON } from '@jupyterlab/observables';
import { Cell, CodeCell } from '@jupyterlab/cells';

import { parse, ASTNode } from 'filbert'

import Sidebar, { PossibleTransformation, SidebarState } from './Sidebar';
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
    const activeCell = this.notebookTracker.activeCell;
    const possibleTransformations = Private.possibleTransformations(activeCell);

    Private.renderSidebar(this.client, activeCell.id, {
      organization: this.organization,
      possibleTransformations
    })
  }

  protected onAfterShow() {
  }

  protected onAfterAttach() {
  }

  protected onMetadataChanged(msg: ObservableJSON.ChangeMessage): void {
    console.log('metadata changed')
  }

  private onSettingsChanged(settings: ISettingRegistry.ISettings) {
    const configSettings = settings.composite as ConfigSettings

    this.client = new ApolloClient({
      uri: configSettings.endpoint,
      headers: {
        'Authorization': `Api-Key ${configSettings.apiKey}`
      }
    });
    this.organization = configSettings.organization
  
    Private.renderSidebar(this.client, '', { organization: this.organization })
  }
  
  public notebookTracker!: INotebookTracker;
  private widget!: SidebarWidget;
  private client: ApolloClient<unknown>;
  private organization: string;
}

namespace Private {
  let widget: SidebarWidget | undefined;

  export function setWidget(currentWidget?: SidebarWidget) {
    widget = currentWidget;
  }

  export function renderSidebar(client?: ApolloClient<unknown>, id?: string, jpState?: SidebarState) {
    if (client && jpState && widget) {

      ReactDOM.render(
        <Sidebar
          client={client}
          jpState={jpState}
          key={id}
        />,
        widget.node
      );
    }
  }

  export function possibleTransformations(cell: CodeCell): PossibleTransformation[];
  export function possibleTransformations(cell: Cell): PossibleTransformation[];

  export function possibleTransformations(cell: Cell): PossibleTransformation[] {
    if (cell instanceof CodeCell) {
        const cellContent = cell.model.value.text;
        const nodes = parse(cellContent, { ranges: true }).body as ASTNode[];
        const functions = nodes.filter(node => node.type === 'FunctionDeclaration')
        return functions.map(f => ({
          fullCode: cellContent.substring(...f.range),
          inputs: f.params.map(p => p.name),
          functionBody: cellContent.substring(...(f.body as ASTNode).range),
          functionName: f.id.name
        }))
      } else {
      return []
    }
  }
}
