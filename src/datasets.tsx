import * as React from 'react';
import { Widget } from '@phosphor/widgets';
import { ReactWidget } from '@jupyterlab/apputils';

import ApolloClient from 'apollo-boost';
import { ApolloProvider } from '@apollo/react-hooks';

import List from './list'

const client = new ApolloClient({
  uri: 'http://localhost:3000/graphql',
  headers: {
      'Authorization': 'Api-Key some key'
  }
});

// type Props = {
//   label: string;
//   count: number;
//   onIncrement: () => void;
// };

export const DatasetList: React.FC/*<>*/ = () => {
    return (
        <ApolloProvider client={client}>
            <div>My widget</div>
            <List />
        </ApolloProvider>
    );
}

const PhosphorDatasetList: Widget = ReactWidget.create(<DatasetList />);

export default PhosphorDatasetList
