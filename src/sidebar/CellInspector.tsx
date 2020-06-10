import React, { useContext } from 'react'

import { makeStyles, Theme, createStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';

import { Cell, CodeCell } from '@jupyterlab/cells';
import { parse, ASTNode } from 'filbert'

import { SettingsContext } from '../common/SettingsContext'
import TransformationInspector, { PossibleTransformation, TransformationMapping } from './TransformationInspector'

// type TransformationMap = Record<string, TransformationMapping>

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

  const possibleTransformations = Private.possibleTransformations(activeCell);

  let transformationsBlock;
  if (possibleTransformations instanceof Error)  {
    transformationsBlock = (
      <Typography variant="body1" color="textSecondary" gutterBottom className={classes.header}>
        Can't parse transformations...
      </Typography>
    )
  } else {
    transformationsBlock = possibleTransformations.map(possibleTransformation => (
      <TransformationInspector 
        key={possibleTransformation.uuid || possibleTransformation.functionName}
        possibleTransformation={possibleTransformation}
        organization={organization}
        cell={activeCell}
      />
    ))
  } 

  return (
    <div className={classes.container}>
      <Typography variant="h5" color="textSecondary" gutterBottom className={classes.header}>
        Transformations
      </Typography>
      <div>
        { transformationsBlock }
      </div>
    </div>
  )
}

namespace Private {
  export function possibleTransformations(cell: CodeCell): PossibleTransformation[] | Error;
  export function possibleTransformations(cell: Cell): PossibleTransformation[] | Error;

  export function possibleTransformations(cell: Cell): PossibleTransformation[] | Error {
    if (cell instanceof CodeCell) {
        const cellContent = cell.model.value.text;
        
        let functions:ASTNode[] = []

        try {
          const nodes = parse(cellContent, { ranges: true }).body as ASTNode[];
          functions = nodes.filter(node => node.type === 'FunctionDeclaration')
        } catch (error) {
          // We expect to get the odd syntax error (especially while the user is
          // typing!). We don't want to just break everything on those.
          if (error.name === 'SyntaxError') {
            return error
          }

          console.log(error)
        }

        const mappings = cell.model.metadata.get('synthi_transformations') as unknown as TransformationMapping[] | undefined

        return functions.map((f, index) => {
          const functionName = f.id.name
          let uuid
          if (mappings && index < mappings.length) {
            uuid = mappings[index].uuid
          }

          return {
            fullCode: cellContent.substring(...f.range),
            inputs: f.params.map(p => p.name),
            functionBody: cellContent.substring(...(f.body as ASTNode).range),
            functionName,
            uuid,
            index
          }
        })
      } else {
      return []
    }
  }
}

export default CellInspector
