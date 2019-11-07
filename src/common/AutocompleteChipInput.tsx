/* eslint-disable no-use-before-define */
import React from 'react';
import Autocomplete from '@material-ui/lab/Autocomplete';
import TextField from '@material-ui/core/TextField';
import CircularProgress from '@material-ui/core/CircularProgress';

interface InputProps {
  onChange: (event: React.ChangeEvent<{}>, value: any) => void;
  options: any[],
  value: any,
  loading?: boolean
}


const AutocompleteChipInput = ({ onChange, options, value, loading }:InputProps) => {
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
          InputProps={{
            ...params.InputProps,
            endAdornment: (
              <>
                {loading ? <CircularProgress color="inherit" size={20} /> : null}
                {params.InputProps.endAdornment}
              </>
            ),
          }}
        />
      )}
    />
  );
}

export {
  AutocompleteChipInput,
  InputProps
}

export default AutocompleteChipInput
