import * as React from 'react';

import ApolloClient from 'apollo-boost';
import { ApolloProvider } from '@apollo/react-hooks';

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


const Sidebar = ({ client, jpState }: SidebarProps) => {
	return (
		<ApolloProvider client={client}>
			<CellInspector 
				possibleTransformations={jpState.possibleTransformations}
				organization={jpState.organization}
			/>
			{/* <DatasetList organization={jpState.organization} /> */}
		</ApolloProvider>
	);
}

export default Sidebar
