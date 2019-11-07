/* eslint-disable no-use-before-define */
import React from 'react';
import Autocomplete from '@material-ui/lab/Autocomplete';
import TextField from '@material-ui/core/TextField';

interface InputProps {
  onChange: (event: React.ChangeEvent<{}>, value: any) => void;
  options: any[],
  value: any
}


export default function AutocompleteChipInput({ onChange, options, value }:InputProps) {
  return (
    <Autocomplete
      multiple
      options={options}
      value={value}
      filterSelectedOptions
      onChange={onChange}
      renderInput={params => (
        <TextField
          {...params}
          variant="outlined"
          label="Tags"
          margin="normal"
          fullWidth
        />
      )}
    />
  );
}
