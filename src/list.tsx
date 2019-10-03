import * as React from 'react';
import { useQuery } from '@apollo/react-hooks';
import { gql } from 'apollo-boost';

const DATASET_LIST = gql`
    query {
        dataset(org: { name: "someorg" }) {
            name
            uuid
        }
    }
`;

interface Dataset {
    name: string
}

interface DatasetData {
    dataset: Dataset[]
}

const List = () => {
    const { loading, error, data } = useQuery<DatasetData>(DATASET_LIST)

    if (loading) return <p>Loading...</p>
    if (error) return <p>Error :(</p>

    return (
        <ul>
            { data.dataset.map(dataset => <li>{dataset.name}</li>)}
        </ul>
    )
}

export default List