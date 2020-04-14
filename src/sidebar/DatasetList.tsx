import * as React from 'react';
import { useQuery } from '@apollo/react-hooks';
import { gql } from 'apollo-boost';
import List from '@material-ui/core/List'
import ListItem from '@material-ui/core/ListItem'
import ListItemText from '@material-ui/core/ListItemText'
import Typography from '@material-ui/core/Typography'
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles((theme) => ({
  title: {
    fontSize: 16,
    fontWeight: "bold",
    marginLeft: theme.spacing(2),
    marginRight: theme.spacing(2)
  }
}))

const DATASET_LIST = gql`
query DatasetList($organization: String) {
  dataset(org: { name: $organization }) {
    name
    uuid
  }
}
`;

interface Dataset {
  name: string,
  uuid: string
}

interface DatasetData {
  dataset: Dataset[]
}

interface DatasetListProps {
  organization: string
}

interface DatasetListVars {
  organization: string
}

const DatasetList = ({ organization }:DatasetListProps) => {
  const { loading, error, data } = useQuery<DatasetData, DatasetListVars>(
    DATASET_LIST,
    { variables: { organization } }
  )
  const classes = useStyles({})

  if (loading) return <p>Loading...</p>
  if (error) return <p>Error :(</p>

  return (
    <div>
      <Typography variant="subtitle1" gutterBottom className={classes.title}>
        Datasets
      </Typography>
      <List dense>
        { data && data.dataset.map(dataset => (
 	 <ListItem key={dataset.uuid}>
 	   <ListItemText
 	     primary={dataset.name}
 	     secondary={dataset.uuid}
 	   />
 	 </ListItem>
        ))}
      </List>
    </div>
  )
}

export default DatasetList
