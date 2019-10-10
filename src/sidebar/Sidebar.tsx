import * as React from 'react';

import { makeStyles, createMuiTheme } from '@material-ui/core/styles';
import { ThemeProvider } from '@material-ui/styles';

import { INotebookTracker } from '@jupyterlab/notebook';
import { ISettingRegistry } from '@jupyterlab/coreutils';

import 'typeface-roboto';

import logo from '../../style/img/adi.png'

import { JupyterSettings } from '../common/SettingsContext'
import ADIClient from '../common/ADIClient'
import Inspector from './Inspector'

// import DatasetList from './DatasetList'
import { PossibleTransformation } from './TransformationInspector'

export {
	PossibleTransformation
}

export interface SidebarState {
  organization?: string,
  possibleTransformations?: PossibleTransformation[]
}

interface SidebarProps {
	settingsRegistry: ISettingRegistry,
	notebookTracker: INotebookTracker
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

const Sidebar = ({ settingsRegistry, notebookTracker }: SidebarProps) => {
	const classes = useStyles({})
			// 		<CellInspector 
		// 			possibleTransformations={jpState.possibleTransformations}
		// 			organization={jpState.organization}
		// 		/>
		// 		{/* <DatasetList organization={jpState.organization} /> */}

	return (
		<ThemeProvider theme={theme}>
			<img src={logo} className={classes.logo} />
			<JupyterSettings settingRegistry={settingsRegistry}>
				<ADIClient>
					<Inspector notebookTracker={notebookTracker} />
				</ADIClient>
			</JupyterSettings>
		</ThemeProvider>
	);
}

export default Sidebar
