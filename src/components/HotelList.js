import React, { useState } from "react";
import {
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  Paper,
  Typography,
  Container,
  IconButton,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Button,
  TableContainer,
  TextField,
  Grid,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import HotelIcon from "@mui/icons-material/Hotel";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import LocationCityIcon from "@mui/icons-material/LocationCity";
import BedIcon from "@mui/icons-material/Bed";
import AddIcon from "@mui/icons-material/Add";
import CloseIcon from "@mui/icons-material/Close";
import VisibilityIcon from "@mui/icons-material/Visibility";
import SaveIcon from "@mui/icons-material/Save";
import axios from "axios";
import toast from "react-hot-toast";
import AccommodationForm from "./AccommodationForm";
import RoomTypeForm from "./RoomTypeForm";

const HotelList = ({ hotels, refreshHotels }) => {
  const [open, setOpen] = useState(false);
  const [hotelToDelete, setHotelToDelete] = useState(null);
  const [hotelDetails, setHotelDetails] = useState(null);
  const [error, setError] = useState(null);
  const [newRoom, setNewRoom] = useState({
    cantidad: "",
    tipo: "",
    acomodacion: "",
  });
  const [addedRooms, setAddedRooms] = useState([]);

  const handleDelete = async () => {
    try {
      await axios.delete(`https://test-hotel-back-production.up.railway.app/api/hoteles/${hotelToDelete}`);
      toast.success("Hotel eliminado exitosamente!");
      refreshHotels();
      setOpen(false);
      setHotelToDelete(null);
    } catch (error) {
      console.error("Error al eliminar el hotel:", error);
    }
  };

  const handleOpenDialog = (hotelId) => {
    setHotelToDelete(hotelId);
    setOpen(true);
  };

  const handleCloseDialog = () => {
    setOpen(false);
    setHotelToDelete(null);
  };

  const handleViewDetails = async (hotel) => {
    try {
      const response = await axios.get(
        `https://test-hotel-back-production.up.railway.app/api/hoteles/${hotel.id}`
      );
      setHotelDetails(response.data);
      setError(null);
    } catch (error) {
      console.error("Error al obtener los detalles del hotel:", error);
      toast.error("No se pudieron cargar los detalles del hotel.");
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    setNewRoom({
      ...newRoom,
      [name]: value,
    });
  };

  const handleSaveAllRooms = async () => {
    try {
      for (const room of addedRooms) {
        const tipoResponse = await axios.post(
          `https://test-hotel-back-production.up.railway.app/api/hoteles/${hotelDetails.id}/tipos-habitacion`,
          { tipo: room.tipo }
        );

        const roomTypeId = tipoResponse.data.id;

        await axios.post(
          `https://test-hotel-back-production.up.railway.app/api/hoteles/${roomTypeId}/tipos-habitacion/${hotelDetails.id}/acomodaciones`,
          {
            cantidad: room.cantidad,
            acomodacion: room.acomodacion,
          }
        );
      }

      const updatedHotel = await axios.get(
        `https://test-hotel-back-production.up.railway.app/api/hoteles/${hotelDetails.id}`
      );

      setHotelDetails(updatedHotel.data);
      toast.success("Cambios guardados exitosamente!");
      refreshHotels();
      setAddedRooms([]);
    } catch (error) {
      console.error("Error al guardar habitaciones:", error);
      toast.error("Error al guardar habitaciones");
    }
  };

  const handleAddRoom = () => {
    if (!newRoom.cantidad || !newRoom.tipo || !newRoom.acomodacion) {
      toast.error("Por favor, complete todos los campos.");
      return;
    }

    const validTypes = {
      Estándar: ["Sencilla", "Doble"],
      Junior: ["Triple", "Cuádruple"],
      Suite: ["Sencilla", "Doble", "Triple"],
    };

    if (!validTypes[newRoom.tipo]?.includes(newRoom.acomodacion)) {
      toast.error(
        `Acomodación no válida para el tipo de habitación ${newRoom.tipo}.`
      );
      return;
    }

    if (hotelDetails.numero_de_habitaciones < newRoom.cantidad) {
      toast.error(
        "La cantidad de habitaciones excede el número total permitido."
      );
      return;
    }

    setHotelDetails((prevDetails) => ({
      ...prevDetails,
      tipo_habitacions: [
        ...prevDetails.tipo_habitacions,
        {
          cantidad: parseInt(newRoom.cantidad),
          tipo: newRoom.tipo,
          acomodacion: newRoom.acomodacion,
        },
      ],
    }));

    setAddedRooms([...addedRooms, newRoom]);
    setNewRoom({ cantidad: "", tipo: "", acomodacion: "" });
    setError(null);
  };

  return (
    <Container sx={{ mt: 4 }}>
      <Typography variant="h6" gutterBottom>
        Listado de Hoteles
      </Typography>

      <Paper elevation={3} sx={{ p: 2, borderRadius: 2 }}>
        <Table>
          <TableHead>
            <TableRow sx={{ backgroundColor: "#f5f5f5" }}>
              <TableCell>
                <strong>Nombre</strong>
              </TableCell>
              <TableCell>
                <strong>Dirección</strong>
              </TableCell>
              <TableCell>
                <strong>Ciudad</strong>
              </TableCell>
              <TableCell align="center">
                <strong>Habitaciones</strong>
              </TableCell>
              <TableCell align="center">
                <strong>Tipo de Habitaciones</strong>
              </TableCell>

              <TableCell align="center">
                <strong>Acciones</strong>
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {hotels.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} align="center">
                  <Typography variant="body1" color="textSecondary">
                    No hay datos disponibles
                  </Typography>
                </TableCell>
              </TableRow>
            ) : (
              hotels.map((hotel) => (
                <TableRow key={hotel.id} hover>
                  <TableCell>{hotel.nombre}</TableCell>
                  <TableCell>{hotel.direccion}</TableCell>
                  <TableCell>{hotel.ciudad}</TableCell>
                  <TableCell align="center">
                    {hotel.numero_de_habitaciones}
                  </TableCell>
                  <TableCell align="center">
                    <Typography variant="body2">
                      {hotel.tipo_habitacions &&
                      hotel.tipo_habitacions.length > 0
                        ? hotel.tipo_habitacions[0].tipo
                        : "Sin asignar"}
                    </Typography>
                  </TableCell>
                  <TableCell align="center">
                    <IconButton
                      color="error"
                      onClick={() => handleOpenDialog(hotel.id)}
                      size="small"
                    >
                      <DeleteIcon fontSize="small" />
                    </IconButton>
                    <IconButton
                      color="primary"
                      onClick={() => handleViewDetails(hotel)}
                      size="small"
                    >
                      <VisibilityIcon fontSize="small" />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </Paper>

      <Dialog open={open} onClose={handleCloseDialog}>
        <DialogTitle>
          ¿Estás seguro de que deseas eliminar este hotel?
        </DialogTitle>
        <DialogActions>
          <Button onClick={handleCloseDialog} color="primary">
            Cancelar
          </Button>
          <Button onClick={handleDelete} color="error">
            Eliminar
          </Button>
        </DialogActions>
      </Dialog>

      {/* Modal de detalles */}
      <Dialog
        open={!!hotelDetails}
        onClose={() => setHotelDetails(null)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle
          sx={{
            fontWeight: "bold",
            display: "flex",
            alignItems: "center",
            gap: 1,
          }}
        >
          <HotelIcon color="primary" />
          Detalles del Hotel
        </DialogTitle>

        <DialogContent dividers>
          {hotelDetails && (
            <>
              <Typography
                variant="body1"
                sx={{ display: "flex", alignItems: "center", gap: 1 }}
              >
                <HotelIcon fontSize="small" /> <strong>Nombre:</strong>{" "}
                {hotelDetails.nombre}
              </Typography>
              <Typography
                variant="body1"
                sx={{ display: "flex", alignItems: "center", gap: 1 }}
              >
                <LocationOnIcon fontSize="small" /> <strong>Dirección:</strong>{" "}
                {hotelDetails.direccion}
              </Typography>
              <Typography
                variant="body1"
                sx={{ display: "flex", alignItems: "center", gap: 1 }}
              >
                <LocationCityIcon fontSize="small" /> <strong>Ciudad:</strong>{" "}
                {hotelDetails.ciudad}
              </Typography>
              <Typography
                variant="body1"
                sx={{ display: "flex", alignItems: "center", gap: 1 }}
              >
                <BedIcon fontSize="small" /> <strong>Habitaciones:</strong>{" "}
                {hotelDetails.numero_de_habitaciones}
              </Typography>

              <Typography variant="h6" sx={{ mt: 3, mb: 1 }}>
                Tipos de Habitaciones
              </Typography>
              <TableContainer>
                <Table size="small">
                  <TableHead>
                    <TableRow>
                      <TableCell>
                        <strong>Cantidad</strong>
                      </TableCell>
                      <TableCell>
                        <strong>Tipo</strong>
                      </TableCell>
                      <TableCell>
                        <strong>Acomodación</strong>
                      </TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {hotelDetails?.tipo_habitacions &&
                    hotelDetails.tipo_habitacions.length > 0 ? (
                      hotelDetails.tipo_habitacions.map((tipoHabitacion) =>
                        tipoHabitacion.acomodacions.map(
                          (acomodacion, index) => (
                            <TableRow key={index}>
                              <TableCell>{acomodacion.cantidad}</TableCell>
                              <TableCell>{tipoHabitacion.tipo}</TableCell>
                              <TableCell>{acomodacion.acomodacion}</TableCell>
                            </TableRow>
                          )
                        )
                      )
                    ) : (
                      <TableRow>
                        <TableCell colSpan={3} align="center">
                          <Typography variant="body2" color="textSecondary">
                            No hay datos disponibles
                          </Typography>
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </TableContainer>

              <Typography variant="h6" sx={{ mt: 3 }}>
                Agregar nueva habitación
              </Typography>
              <Grid container spacing={2} direction="column" sx={{ mt: 1 }}>
                <Grid item xs={12}>
                  <TextField
                    label="Cantidad"
                    name="cantidad"
                    type="number"
                    value={newRoom.cantidad}
                    onChange={handleChange}
                    fullWidth
                  />
                </Grid>
                <Grid item xs={12}>
                  <RoomTypeForm
                    value={newRoom.tipo}
                    onChange={handleChange}
                    fullWidth
                  />
                </Grid>
                <Grid item xs={12}>
                  <AccommodationForm
                    value={newRoom.acomodacion}
                    onChange={handleChange}
                    fullWidth
                  />
                </Grid>
              </Grid>

              {error && (
                <Typography color="error" sx={{ mt: 1 }}>
                  {error}
                </Typography>
              )}
            </>
          )}
        </DialogContent>

        <DialogActions sx={{ px: 3, py: 2 }}>
          <Button
            variant="outlined"
            color="secondary"
            startIcon={<CloseIcon />}
            onClick={() => setHotelDetails(null)}
          >
            Cerrar
          </Button>
          <Button
            variant="contained"
            color="secondary"
            startIcon={<AddIcon />}
            onClick={handleAddRoom}
          >
            Agregar
          </Button>
          <Button
            variant="contained"
            color="primary"
            startIcon={<SaveIcon />}
            onClick={handleSaveAllRooms}
            disabled={addedRooms.length === 0}
          >
            Guardar
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default HotelList;
