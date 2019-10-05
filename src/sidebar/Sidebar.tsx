import * as React from 'react';

import ApolloClient from 'apollo-boost';
import { ApolloProvider } from '@apollo/react-hooks';

import DatasetList from './DatasetList'

interface SidebarProps {
	client: ApolloClient<unknown>,
	organization: string
}

const Sidebar = ({ client, organization }: SidebarProps) => {
	return (
		<ApolloProvider client={client}>
			<DatasetList organization={organization} />
		</ApolloProvider>
	);
}

export default Sidebar
