import React, { useState } from "react";
import HotelForm from "./components/HotelForm";
import HotelList from "./components/HotelList";
import axios from "axios";
import { Container, Paper, Typography, Box, Divider } from "@mui/material";
import { Toaster } from "react-hot-toast";
import { useEffect } from "react";
import "./App.css";

function App() {
  const [hotels, setHotels] = useState([]);

  const refreshHotels = async () => {
    const response = await axios.get("https://test-hotel-back-production.up.railway.app/api/hoteles");
    setHotels(response.data);
  };

  useEffect(() => {
    refreshHotels();
  }, []);

  return (
    <Container maxWidth="md" sx={{ mt: 4 }}>
      <Toaster
        position="top-center"
        toastOptions={{
          duration: 4000,
          className: "custom-toast",
          style: {
            background: "#333",
            color: "#fff",
            fontSize: "1rem",
            borderRadius: "8px",
            padding: "12px 16px",
          },
          success: {
            iconTheme: {
              primary: "#4caf50",
              secondary: "#fff",
            },
          },
          error: {
            iconTheme: {
              primary: "#f44336",
              secondary: "#fff",
            },
          },
        }}
      />
      <Paper elevation={4} sx={{ p: 4, borderRadius: 4 }}>
        <Typography
          variant="h4"
          gutterBottom
          align="center"
          sx={{ fontWeight: 600, color: "#333" }}
        >
          Sistema de Gestión de Hoteles
        </Typography>

        <Divider sx={{ my: 3, borderColor: "#ccc" }} />

        <Box sx={{ mb: 4 }}>
          <HotelForm refreshHotels={refreshHotels} />
        </Box>

        <Box>
          <HotelList hotels={hotels} refreshHotels={refreshHotels} />
        </Box>
      </Paper>
    </Container>
  );
}
export default App;
