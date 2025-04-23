import React from 'react';
import {
  FormControl,
  InputLabel,
  MenuItem,
  Select,
} from '@mui/material';

const AccommodationForm = ({ value, onChange }) => {
  return (

      <FormControl fullWidth required>
        <InputLabel>Acomodación</InputLabel>
        <Select
          name="acomodacion"
          value={value}
          onChange={onChange}
          label="Acomodación"
        >
          <MenuItem value="Sencilla">Sencilla</MenuItem>
          <MenuItem value="Doble">Doble</MenuItem>
          <MenuItem value="Triple">Triple</MenuItem>
          <MenuItem value="Cuádruple">Cuádruple</MenuItem>
        </Select>
      </FormControl>  
  );
};

export default AccommodationForm;
