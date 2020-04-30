import React, { useContext } from 'react';
import { useQuery } from '@apollo/react-hooks';
import { gql } from 'apollo-boost';
import IconButton from '@material-ui/core/IconButton';
import LinkIcon from '@material-ui/icons/Link';
import List from '@material-ui/core/List'
import ListItem from '@material-ui/core/ListItem'
import ListItemText from '@material-ui/core/ListItemText'
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import Typography from '@material-ui/core/Typography'
import { makeStyles } from '@material-ui/core/styles';

import { SettingsContext } from '../common/SettingsContext'

import ExpansionPanel from '@material-ui/core/ExpansionPanel'
import ExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary'
import ExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails'
import ExpandMoreIcon from '@material-ui/icons/ExpandMore'
import FormLabel from '@material-ui/core/FormLabel';
import FormControl from '@material-ui/core/FormControl';
import FormGroup from '@material-ui/core/FormGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';
import TextField from '@material-ui/core/TextField';

const useStyles = makeStyles((theme) => ({
  title: {
    /* fontSize: 16, */
    /* fontWeight: "bold", */
    marginLeft: theme.spacing(1),
    marginRight: theme.spacing(1)
  },
  summary: {
    padding: "0px 0px",
    marginLeft: "8px",
    marginRight: "8px"
  }
}))

const DATASET_LIST = gql`
query ListDatasets($org: OrganizationRef!, $filter: DatasetFilter, $offset: Int, $limit: Int) {
  listDatasets(org: $org, filter: $filter, offset: $offset, limit: $limit) {
    datasets {
      name
      uuid
      dateCreated
      owner {
	name
      }
    }
  }
}
`

interface Dataset {
  name: string,
  uuid: string,
  dateCreated: number,
  owner: {
    name: string
  }
}

interface DatasetData {
  listDatasets: {
    datasets: Dataset[]
  }
}

interface DatasetListVars {
  org: {
    name: string
  },
  filter: {
    searchString?: string
    includeShared?: boolean
    publishedOnly?: boolean
  },
  offset?: number,
  limit?: number
}

const DatasetList = () => {
  const classes = useStyles({})
  const { organization: org, endpoint } = useContext(SettingsContext)
  const [state, setState] = React.useState({
    searchString: "",
    includeShared: false,
    publishedOnly: false,
    expanded: false
  })
  const { searchString, includeShared, publishedOnly, expanded } = state
  const { loading, error, data } = useQuery<DatasetData, DatasetListVars>(DATASET_LIST, { variables: { org: { name: org }, filter: { searchString, includeShared, publishedOnly } } })

  const handleChange = (event: any) => {
    setState({ ...state, [event.target.name]: event.target.checked })
  }

  let list

  if (error) {
    list = <div><List dense><ListItem><ListItemText>Error :(</ListItemText></ListItem></List></div>
  } else if (loading) {
    list = <div><List dense><ListItem><ListItemText>Loading...</ListItemText></ListItem></List></div>
  } else {
    list = (
      <List dense>
	{ data && data.listDatasets.datasets
	    .map(dataset => (
	      <ListItem key={dataset.uuid} alignItems="flex-start">
		<ListItemText
		  primary={dataset.name}
		  // TODO: Fix this so it's actually last 24 hours
		  secondary={Date.now() - dataset.dateCreated < 24*60*60*1000 ? "  ~New" : ""}
		/>
		<ListItemSecondaryAction>
		  <a href={`${endpoint.slice(0, endpoint.length-8)}/workbench/${dataset.uuid}`}>
		    <IconButton edge="end" aria-label="link">
		      <LinkIcon />
		    </IconButton>
		  </a>
		</ListItemSecondaryAction>
	      </ListItem>
	    ))}
      </List>
    )
  }

  return (
    <div>
      <ExpansionPanel expanded={expanded} onChange={(_, expanded: boolean) => {setState({ ...state, expanded: expanded})}}>
	<ExpansionPanelSummary expandIcon={<ExpandMoreIcon />} className={classes.summary}>
	  <Typography variant="h5" color="textSecondary" className={classes.title}>
	    Datasets
	  </Typography>
	</ExpansionPanelSummary>
	<ExpansionPanelDetails>
	  <div>
	    <FormControl component="fieldset">
	      <FormLabel component="legend">Filters</FormLabel>
	      <FormGroup>
		<TextField id="outlined-margin-dense" variant="outlined" margin="dense" label="Search" onChange={(e: any) => {setState({ ...state, searchString: e.target.value })}} />
		<FormControlLabel
		  control={<Checkbox checked={includeShared} onChange={handleChange} name="includeShared" />}
		  label="Include shared"
		/>
		<FormControlLabel
		  control={<Checkbox checked={publishedOnly} onChange={handleChange} name="publishedOnly" />}
		  label="Published only"
		/>
	      </FormGroup>
	    </FormControl>
	    <div>{list}</div>
	  </div>
	</ExpansionPanelDetails>
      </ExpansionPanel>
    </div>
  )
}

export default DatasetList
