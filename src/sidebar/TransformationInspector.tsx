import React, { useState } from 'react'

import { makeStyles, Theme, createStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import Typography from '@material-ui/core/Typography';
import Chip from '@material-ui/core/Chip';
import Grid from '@material-ui/core/Grid';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';

import { Cell } from '@jupyterlab/cells';

import { useMutation, useLazyQuery } from '@apollo/react-hooks';
import { gql } from 'apollo-boost';
import { JSONObject } from '@phosphor/coreutils';

import LongOpButton from '../common/LongOpButton'

interface EditableTransformationInfo {
  name: string;
}

interface CreateTransformationInput {
  name: string,
  inputs: string[],
  code: string,
  organization: string
}

interface UpdateTransformationInput {
  uuid: string,
  fields: {
    name?: string
    code?: string,
    inputs?: string[]
  }
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
  uuid?: string,
  index: number
}

interface TransformationInspectorProps {
  possibleTransformation: PossibleTransformation,
  organization: string,
  cell: Cell
}

export interface TransformationMapping extends JSONObject {
  uuid: string
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
    inputs: {
      clear: 'both'
    },
    header: {
      marginLeft: theme.spacing(1),
      marginRight: theme.spacing(1),
      marginTop: theme.spacing(2),
    },
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

const UPDATE_TRANSFORMATION = gql`
  mutation UpdateTransformation(
    $uuid: String!,
    $fields: TransformationUpdate!
  ) {
    updateTransformation(uuid: $uuid, fields: $fields) {
      name
      uuid
    }
  }
`

const TRANSFORMATION_INFO = gql`
  query TransformationInfo($uuid: String, $organization:String) {
    transformation(uuid: $uuid, org: { name: $organization }) {
      name
    }
  }
`

/*
  Hook for logic to check for an existing transformation and provide editable state for it.

  Will return a tuple:

  [ existingTransformation, transformationInfo, handleTransformationInfoChange ]

  existingTransformation: true if the transformation was found, false otherwise
  transformationInfo: stateful map (EditableTransformationInfo) of properties
  handleTransformationInfoChange: function factory that creates an event handler given an 
                                  EditableTransformationInfo property name

  Example of using handleTransformationInfoChange:

    handleTransformationInfoChange('name')

  This will handle a change to a 'name' property of EditableTransformationInfo
*/
function useExistingTransformation(uuid: string, organization: string, defaults:EditableTransformationInfo): [
  boolean,
  EditableTransformationInfo,
  (name: keyof EditableTransformationInfo) => (event: React.ChangeEvent<HTMLInputElement>) => void
] {
  const [checkForTransformation, setCheckForTransformation] = useState(true)
  const [existingTransformation, setExistingTransformation] = useState(false)

  const [transformationInfo, setTransformationInfo] = useState<EditableTransformationInfo>(defaults);

  const [getTransformation] = useLazyQuery<
    {transformation: EditableTransformationInfo},
    {uuid: string, organization: string}
  >(TRANSFORMATION_INFO, {
    onCompleted: (data) => {
      if (data.transformation) {
        setTransformationInfo(data.transformation)
        setExistingTransformation(true)
      }
    }
  })

  if (uuid && checkForTransformation) {
    setCheckForTransformation(false)
    getTransformation({ variables: { uuid, organization } })
  }

  const handleTransformationInfoChange = (name: keyof EditableTransformationInfo) => (event: React.ChangeEvent<HTMLInputElement>) => {
    setTransformationInfo({ ...transformationInfo, [name]: event.target.value });
  }

  return [existingTransformation, transformationInfo, handleTransformationInfoChange]
}

const TransformationInspector = ({ possibleTransformation, organization, cell }: TransformationInspectorProps) => {
  const { inputs, functionBody, functionName, uuid: initUuid } = possibleTransformation

  const classes = useStyles({});

  const [uuid, setUuid] = useState(initUuid)

  const [
    existingTransformation,
    transformationInfo,
    handleTransformationInfoChange
  ] = useExistingTransformation(uuid, organization, { name: functionName })

  const [createTransformation] = useMutation<
    { createTransformationTemplate: Transformation },
    CreateTransformationInput
  >(CREATE_TRANSFORMATION)

  const [updateTransformation] = useMutation<
    { updateTransformation: Transformation },
    UpdateTransformationInput
  >(UPDATE_TRANSFORMATION)

  const inputDeclaration = inputs.map(input => `${input} = dataset_input('${input}')`).join('\n')

  let transformationBody = functionBody;
  if (transformationBody.startsWith('\n')) {
    transformationBody = transformationBody.substring(1)
  }
  const transformationCode = `${inputDeclaration}\n\ndef transform():\n${transformationBody}`

  const handleCreateTransformation = async (event: React.MouseEvent<HTMLButtonElement>): Promise<any> => {
    return createTransformation({
      variables: {
        name: transformationInfo.name,
        inputs: inputs,
        code: transformationCode,
        organization
      }
    }).then(({ data }) => {
      let mappings = cell.model.metadata.get('adi_transformations') as unknown as TransformationMapping[]
      if (!mappings) { mappings = [] }
      const { uuid } = data.createTransformationTemplate
      mappings[possibleTransformation.index] = { uuid }
      cell.model.metadata.set('adi_transformations', mappings)
      setUuid(uuid)
    })    
  }

  const handleUpdateTransformation = async (event: React.MouseEvent<HTMLButtonElement>): Promise<any> => {
    return updateTransformation({
      variables: {
        uuid,
        fields: {
          name: transformationInfo.name,
          code: transformationCode,
          inputs
        }
      }
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
              value={transformationInfo.name}
              onChange={handleTransformationInfoChange('name')}
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
                <Grid item key={input}>
                  <Chip label={input} variant="outlined" size="small" />
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
        <LongOpButton 
          handler={existingTransformation ? handleUpdateTransformation : handleCreateTransformation }
        >
          { existingTransformation ? 'Update' : 'Create' } Transformation
        </LongOpButton>
      </CardActions>
    </Card>
  )
}

export default TransformationInspector
