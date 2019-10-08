import React, { useState } from 'react'

import { makeStyles, Theme, createStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import Chip from '@material-ui/core/Chip';
import Grid from '@material-ui/core/Grid';

import { useMutation } from '@apollo/react-hooks';
import { gql } from 'apollo-boost';

interface State {
  name: string;
}

export interface PossibleTransformation {
  fullCode: string,
  inputs: string[],
  functionBody: string,
  functionName: string
}

interface CreateTransformationInput {
  name: string,
  inputs: string[],
  code: string,
  organization: string
}

interface Transformation {
  name: string,
  uuid: string
}

interface CellInspectorProps {
  possibleTransformations: PossibleTransformation[],
  organization: string
}

interface TransformationInspectorProps {
  possibleTransformation: PossibleTransformation,
  organization: string
}

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    container: {
      marginLeft: theme.spacing(1),
      marginRight: theme.spacing(1),
    },
    transformationContainer: {
      display: 'flex',
      flexWrap: 'wrap',
    },
    textField: {
      width: '100%',
    },
    button: {
      margin: 0
    },
    inputs: {
      clear: 'both'
    }
  }),
);

const CellInspector = ({ possibleTransformations, organization }:CellInspectorProps) => {
  const classes = useStyles({});

  return (
    <div className={classes.container}>
      <h1>TransformationInspector</h1>
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

const CREATE_TRANSFORMATION = gql`
	mutation CreateTransformation(
    $name: String!,
    $inputs: [String],
    $code: String,
    $organization: String!
  ) {
		createTransformationTemplate(
      name: $name, 
      inputs: $inputs,
      code: $code,
      owner: { name: $organization }
    ) {
			name
			uuid
		}
	}
`;

const TransformationInspector = ({ possibleTransformation, organization }: TransformationInspectorProps) => {
  const [values, setValues] = useState<State>({
    name: possibleTransformation.functionName,
  });
  const classes = useStyles({});
  const [createTransformation] = useMutation<
    Transformation,
    CreateTransformationInput
  >(CREATE_TRANSFORMATION)

  const handleChange = (name: keyof State) => (event: React.ChangeEvent<HTMLInputElement>) => {
    setValues({ ...values, [name]: event.target.value });
  }

  const handleCreateTransformation = (event: React.MouseEvent<HTMLButtonElement>) => {
    const { inputs, functionBody } = possibleTransformation
    const inputDeclaration = inputs.map(input => `${input} = dataset_input('${input}')\n`)

    const transformationCode = `${inputDeclaration}\ndef transform():\n${functionBody}`

    createTransformation({ variables: {
      name: values.name,
      inputs: inputs,
      code: transformationCode,
      organization
    }})
  }

  return (
    <div className={classes.transformationContainer}>
      <Grid container direction="column" spacing={1}>
        <Grid item>
          <TextField
            id="outlined-name"
            label="Name"
            className={classes.textField}
            value={values.name}
            onChange={handleChange('name')}
            margin="normal"
            variant="filled"
          />
        </Grid>
        <Grid item>
          <Typography variant="subtitle1" gutterBottom>
            Inputs:
          </Typography>
        </Grid>
        <Grid item>
          <div className={classes.inputs}>
            { possibleTransformation.inputs.map(input => (
              <Chip label={input} variant="outlined" size="small" key={input} />
            ))}
          </div>
        </Grid>
        <Grid item>
          <Button 
            variant="contained"
            color="primary"
            className={classes.button}
            onClick={handleCreateTransformation}
          >
            Create Transformation
          </Button>
        </Grid>
      </Grid>
    </div>
  )
}

export default CellInspector
