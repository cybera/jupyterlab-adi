import React from 'react'

import { useQuery } from '@apollo/react-hooks';
import { gql } from 'apollo-boost';

import { AutocompleteChipInput, InputProps } from './AutocompleteChipInput'

type GQLInputProps = Omit<InputProps, 'options'>
type TagData = { tags: [{ name: string }]}

const VALID_TAGS_QUERY = gql`
  query {
    tags {
      name
    }
  }
`

const TagInput = ({ onChange, value }:GQLInputProps) => {
  const { loading, error, data } = useQuery<TagData, {}>(VALID_TAGS_QUERY)

  const options = loading || error ? [] : data.tags.map(tag => tag.name)

  return (
    <AutocompleteChipInput
      value={value}
      onChange={onChange}
      options={options}
      loading={loading}
    />
  )
}

export default TagInput
