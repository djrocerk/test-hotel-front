import React from 'react';
import { MenuItem, Select, FormControl, InputLabel } from '@mui/material';

const RoomTypeForm = ({ value, onChange }) => {
  return (
    <FormControl fullWidth>
      <InputLabel>Tipo de Habitación</InputLabel>
      <Select
        label="Tipo de Habitación"
        name="tipo"
        value={value}
        onChange={onChange}
        fullWidth
        required
      >
        <MenuItem value="Estándar">Estándar</MenuItem>
        <MenuItem value="Junior">Junior</MenuItem>
        <MenuItem value="Suite">Suite</MenuItem>
      </Select>
    </FormControl>
  );
};

export default RoomTypeForm;
