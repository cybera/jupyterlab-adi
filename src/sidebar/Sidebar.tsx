import React from 'react';

import { makeStyles, createMuiTheme } from '@material-ui/core/styles';
import { ThemeProvider } from '@material-ui/styles';

import { INotebookTracker } from '@jupyterlab/notebook';
import { ISettingRegistry } from '@jupyterlab/coreutils';

import 'typeface-roboto';

import logo from '../../style/img/adi.png'

import { JupyterSettings } from '../common/SettingsContext'
import ADIClient from '../common/ADIClient'

import JupyterCellInspector from '../common/JupyterCellInspector'
import CellInspector from './CellInspector'

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

declare global {
	interface Window { extractTransformationUuidsExample: any }
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
type Transformation = {uuid:string}
const Sidebar = ({ settingsRegistry, notebookTracker }: SidebarProps) => {
	const classes = useStyles({});
	console.log('current notebook:');
	const notebookModel = notebookTracker.currentWidget.content.model;
  console.log(notebookModel);
	function extract(cells:any) {
		let metaList:string[] = [];
		const cellIter = cells.iter();
		let cell = cellIter.next();
		while(cell) {
			const transformations = cell.metadata.get("adi_transformations") as Transformation[];
			if (transformations) {
				const uuids = transformations.map(t => t.uuid);
				metaList = [...metaList, ...uuids];
			}
			cell = cellIter.next();
		}
		return metaList;
	}

	window.extractTransformationUuidsExample = () => extract(notebookModel.cells)

	return (
		<ThemeProvider theme={theme}>
			<img src={logo} className={classes.logo} />
			<JupyterSettings settingRegistry={settingsRegistry}>
				<ADIClient>
					<JupyterCellInspector notebookTracker={notebookTracker}>
						{ cell => <CellInspector activeCell={cell} />}
					</JupyterCellInspector>
				</ADIClient>
			</JupyterSettings>
		</ThemeProvider>
	);
}

export default Sidebar
