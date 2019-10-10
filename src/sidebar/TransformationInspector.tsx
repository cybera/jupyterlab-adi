import React, { useState } from 'react'

import { makeStyles, Theme, createStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import Chip from '@material-ui/core/Chip';
import Grid from '@material-ui/core/Grid';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';

import { useMutation } from '@apollo/react-hooks';
import { gql } from 'apollo-boost';

interface State {
  name: string;
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

export interface PossibleTransformation {
  fullCode: string,
  inputs: string[],
  functionBody: string,
  functionName: string,
  uuid?: string
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
      marginBottom: theme.spacing(1)
    },
    textField: {
      width: '100%',
    },
    button: {
      margin: 0
    },
    inputs: {
      clear: 'both'
    },
    header: {
      marginLeft: theme.spacing(1),
      marginRight: theme.spacing(1),
      marginTop: theme.spacing(2),
    }
  }),
);

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
  const { inputs, functionBody, functionName, uuid } = possibleTransformation

  const [values, setValues] = useState<State>({
    name: functionName,
  });
  const classes = useStyles({});
  const [createTransformation] = useMutation<
    Transformation,
    CreateTransformationInput
  >(CREATE_TRANSFORMATION)

  const inputDeclaration = inputs.map(input => `${input} = dataset_input('${input}')`).join('\n')

  let transformationBody = functionBody;
  if (transformationBody.startsWith('\n')) {
    transformationBody = transformationBody.substring(1)
  }
  const transformationCode = `${inputDeclaration}\n\ndef transform():\n${transformationBody}`


  const handleChange = (name: keyof State) => (event: React.ChangeEvent<HTMLInputElement>) => {
    setValues({ ...values, [name]: event.target.value });
  }

  const handleCreateTransformation = (event: React.MouseEvent<HTMLButtonElement>) => {
    createTransformation({
      variables: {
        name: values.name,
        inputs: inputs,
        code: transformationCode,
        organization
      }
    }).then(result => {
      console.log(result.data)
    })
  }

  return (
    <Card className={classes.transformationContainer} raised>
      <CardContent>
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
            <Typography variant="h6" gutterBottom>
              Inputs
            </Typography>
          </Grid>
          <Grid item>
            <Grid container className={classes.inputs} direction="row" spacing={1}>
              { possibleTransformation.inputs.map(input => (
                <Grid item>
                  <Chip label={input} variant="outlined" size="small" key={input} />
                </Grid>
              ))}
            </Grid>
          </Grid>
          <Grid item>
            <pre>
              { transformationCode }
            </pre>
          </Grid>
        </Grid>
      </CardContent>
      <CardActions>
        <Button 
          variant="contained"
          color="primary"
          className={classes.button}
          onClick={handleCreateTransformation}
        >
          { uuid ? 'Update' : 'Create' } Transformation
        </Button>
      </CardActions>
    </Card>
  )
}

export default TransformationInspector
