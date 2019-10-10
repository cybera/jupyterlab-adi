import React, { useContext } from 'react';

import { INotebookTracker } from '@jupyterlab/notebook';
import { UseSignal } from '@jupyterlab/apputils';
import { Cell } from '@jupyterlab/cells';
import { SettingsContext } from '../common/SettingsContext'
import CellInspector from './CellInspector'

const ActiveCellInspector = (props:{cell:Cell}) => {
  const { cell } = props
  console.log('my cell')
  const settings = useContext(SettingsContext)
  console.log('settings:')
  console.log(settings)
  return (
    <UseSignal signal={cell.model.value.changed}>
      {
        (_, _value) => (
          <CellInspector activeCell={cell} />
        )
      }
    </UseSignal>
  )
}

const Inspector = (props:{notebookTracker:INotebookTracker}) => {
  const { notebookTracker } = props
  console.log('my component')

  return (
    <UseSignal signal={notebookTracker.activeCellChanged}>
      {
        (_, activeCell) => {
          if (activeCell) {
            const selection_change = (activeCell.model.metadata.get('adi_selection_change') as number | undefined) || 0
            activeCell.model.metadata.set('adi_selection_change', selection_change + 1)

            return <ActiveCellInspector cell={activeCell} key={activeCell.model.id} />
          }

          return <div>No active cell</div>
        }
      }
    </UseSignal>
  )
}

export default Inspector