import React, { useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import {
  Card,
  CardContent,
  Typography,
  Grid,
  TextField,
  Button,
  InputAdornment,
  Box,
} from "@mui/material";

import LocationOnIcon from "@mui/icons-material/LocationOn";
import BusinessIcon from "@mui/icons-material/Business";
import LocationCityIcon from "@mui/icons-material/LocationCity";
import NumbersIcon from "@mui/icons-material/Numbers";
import HotelIcon from "@mui/icons-material/Hotel";
const HotelForm = ({ refreshHotels }) => {
  const [formData, setFormData] = useState({
    nombre: "",
    direccion: "",
    ciudad: "",
    nit: "",
    numero_de_habitaciones: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post("https://test-hotel-back-production.up.railway.app/api/hoteles", formData);
      setFormData({
        nombre: "",
        direccion: "",
        ciudad: "",
        nit: "",
        numero_de_habitaciones: "",
      });
      refreshHotels();
      toast.success("Hotel creado exitosamente!");
    } catch (error) {
      toast.error("Error al crear el hotel:", error);
    }
  };

  return (
    <Box sx={{ maxWidth: 800, mx: "auto", mt: 4 }}>
      <Card elevation={3} sx={{ borderRadius: 3 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Crear Nuevo Hotel
          </Typography>

          <form onSubmit={handleSubmit}>
            <Grid container spacing={3} sx={{ mt: 2 }}>
              <Grid item xs={12} md={6}>
                <TextField
                  label="Nombre del Hotel"
                  name="nombre"
                  value={formData.nombre}
                  onChange={handleChange}
                  fullWidth
                  required
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <BusinessIcon />
                      </InputAdornment>
                    ),
                  }}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  label="Dirección"
                  name="direccion"
                  value={formData.direccion}
                  onChange={handleChange}
                  fullWidth
                  required
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <LocationOnIcon />
                      </InputAdornment>
                    ),
                  }}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  label="Ciudad"
                  name="ciudad"
                  value={formData.ciudad}
                  onChange={handleChange}
                  fullWidth
                  required
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <LocationCityIcon />
                      </InputAdornment>
                    ),
                  }}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  label="NIT"
                  name="nit"
                  type="number"
                  value={formData.nit}
                  onChange={handleChange}
                  fullWidth
                  required
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <NumbersIcon />
                      </InputAdornment>
                    ),
                  }}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  label="Número de Habitaciones"
                  name="numero_de_habitaciones"
                  type="number"
                  value={formData.numero_de_habitaciones}
                  onChange={handleChange}
                  fullWidth
                  required
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <HotelIcon />
                      </InputAdornment>
                    ),
                  }}
                />
              </Grid>
            </Grid>

            <Box textAlign="right" sx={{ mt: 4 }}>
              <Button
                type="submit"
                variant="contained"
                color="primary"
                size="large"
                sx={{ px: 4, py: 1.5, borderRadius: 2 }}
              >
                Crear Hotel
              </Button>
            </Box>
          </form>
        </CardContent>
      </Card>
    </Box>
  );
};

export default HotelForm;
