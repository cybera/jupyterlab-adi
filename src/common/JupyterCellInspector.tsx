import React, { ReactChild } from 'react';

import { INotebookTracker } from '@jupyterlab/notebook';
import { UseSignal } from '@jupyterlab/apputils';
import { Cell } from '@jupyterlab/cells';

const ActiveCellContext = React.createContext(null)

const ActiveCellInspector = (props:{cell:Cell, children:(cell:Cell)=>ReactChild}) => {
  const { cell, children } = props

  return (
    <UseSignal signal={cell.model.value.changed}>
      {
        (_, _value) => (
            <ActiveCellContext.Provider value={cell}>
              { children(cell) }
            </ActiveCellContext.Provider>
        )
      }
    </UseSignal>
  )
}

const Inspector = (props:{notebookTracker:INotebookTracker, children:(cell:Cell)=>ReactChild}) => {
  const { notebookTracker, children } = props

  return (
    <UseSignal signal={notebookTracker.activeCellChanged}>
      {
        (_, activeCell) => {
          if (activeCell) {
            return (
              <ActiveCellInspector cell={activeCell} key={activeCell.model.id}>
                { children }
              </ActiveCellInspector>
            )
          }

          return <div>No active cell</div>
        }
      }
    </UseSignal>
  )
}

export default Inspector