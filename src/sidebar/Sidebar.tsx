import * as React from 'react';

import ApolloClient from 'apollo-boost';
import { ApolloProvider } from '@apollo/react-hooks';
import { makeStyles, createMuiTheme } from '@material-ui/core/styles';
import { ThemeProvider } from '@material-ui/styles';

import 'typeface-roboto';

import logo from '../../style/img/adi.png'

// import DatasetList from './DatasetList'
import CellInspector, { PossibleTransformation } from './CellInspector'

export {
	PossibleTransformation
}

export interface SidebarState {
  organization?: string,
  possibleTransformations?: PossibleTransformation[]
}

interface SidebarProps {
	client: ApolloClient<unknown>,
	jpState: SidebarState
}

const theme = createMuiTheme({
  palette: {
    primary: {
      main: '#26a69a',
    },
    secondary: {
      main: '#303f9f',
    },
  },
  typography: {
    fontSize: 12,
  },
});

const useStyles = makeStyles((theme) => ({
  logo: {
    marginLeft: theme.spacing(1),
    marginRight: theme.spacing(1)
	}
}))

const Sidebar = ({ client, jpState }: SidebarProps) => {
	const classes = useStyles({})
	return (
		<ThemeProvider theme={theme}>
			<ApolloProvider client={client}>
				<img src={logo} className={classes.logo} />
				<CellInspector 
					possibleTransformations={jpState.possibleTransformations}
					organization={jpState.organization}
				/>
				{/* <DatasetList organization={jpState.organization} /> */}
			</ApolloProvider>
		</ThemeProvider>
	);
}

export default Sidebar
