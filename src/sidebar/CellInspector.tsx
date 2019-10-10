import React, { useContext } from 'react'

import { makeStyles, Theme, createStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';

import { Cell, CodeCell } from '@jupyterlab/cells';
import { parse, ASTNode } from 'filbert'

import { SettingsContext } from '../common/SettingsContext'
import TransformationInspector, { PossibleTransformation } from './TransformationInspector'

interface TransformationMapping {
  uuid: string
}

type TransformationMap = Record<string, TransformationMapping>

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    container: {
      marginLeft: theme.spacing(1),
      marginRight: theme.spacing(1),
    },
    header: {
      marginLeft: theme.spacing(1),
      marginRight: theme.spacing(1),
      marginTop: theme.spacing(2),
    }
  }),
);

const CellInspector = (props: { activeCell: Cell }) => {
  const classes = useStyles({});
  const settings = useContext(SettingsContext)
  const { organization } = settings
  const { activeCell } = props

  const mapping = activeCell.model.metadata.get('adi_transformations') as unknown as TransformationMap | undefined
  const possibleTransformations = Private.possibleTransformations(activeCell, mapping);
  console.log(possibleTransformations)

  return (
    <div className={classes.container}>
      <Typography variant="h5" color="textSecondary" gutterBottom className={classes.header}>
        Transformations
      </Typography>
      <div>
        {
          possibleTransformations.map(possibleTransformation => (
            <TransformationInspector 
              key={possibleTransformation.functionName}
              possibleTransformation={possibleTransformation}
              organization={organization}
            />
          ))
        }
      </div>
    </div>
  )
}

namespace Private {
  export function possibleTransformations(cell: CodeCell, adiMapping:TransformationMap): PossibleTransformation[];
  export function possibleTransformations(cell: Cell, adiMapping:TransformationMap): PossibleTransformation[];

  export function possibleTransformations(cell: Cell, adiMapping:TransformationMap): PossibleTransformation[] {
    if (cell instanceof CodeCell) {
        const cellContent = cell.model.value.text;
        const nodes = parse(cellContent, { ranges: true }).body as ASTNode[];
        const functions = nodes.filter(node => node.type === 'FunctionDeclaration')
        
        return functions.map(f => {
          const functionName = f.id.name
          let uuid
          if (adiMapping && functionName in adiMapping) {
            uuid = adiMapping[functionName].uuid
          }

          return {
            fullCode: cellContent.substring(...f.range),
            inputs: f.params.map(p => p.name),
            functionBody: cellContent.substring(...(f.body as ASTNode).range),
            functionName,
            uuid
          }
        })
      } else {
      return []
    }
  }
}

export default CellInspector
