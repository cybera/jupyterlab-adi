import React from 'react';

import { createStyles, makeStyles, createMuiTheme, Theme } from '@material-ui/core/styles';
import { ThemeProvider } from '@material-ui/styles';
import Typography from '@material-ui/core/Typography';

import { INotebookTracker } from '@jupyterlab/notebook';
import { ISettingRegistry } from '@jupyterlab/coreutils';

import 'typeface-roboto';

import { JupyterSettings } from '../common/SettingsContext'

import SynthiClient from '../common/SynthiClient'

import JupyterCellInspector from '../common/JupyterCellInspector'
import CellInspector from './CellInspector'

import DatasetList from './DatasetList'
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

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    header: {
      marginLeft: theme.spacing(1),
      marginRight: theme.spacing(1),
      marginTop: theme.spacing(2),
    }
  }),
);

const Sidebar = ({ settingsRegistry, notebookTracker }: SidebarProps) => {
  const classes = useStyles({});

  return (
    <ThemeProvider theme={theme}>
      <Typography variant="h3" className={classes.header}>
	Synthi
      </Typography>
      <JupyterSettings settingRegistry={settingsRegistry}>
	<SynthiClient>
	  <JupyterCellInspector notebookTracker={notebookTracker}>
	    { cell => <CellInspector activeCell={cell} />}
	  </JupyterCellInspector>
	  <DatasetList />
	</SynthiClient>
      </JupyterSettings>
    </ThemeProvider>
  );
}

export default Sidebar
