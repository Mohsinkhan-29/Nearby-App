import express from "express";
import cors from "cors";
import "dotenv/config";
import authRoutes from "./routes/authRoutes.js";
import placesRouter from "./routes/places.js";
import savedPlacesRoutes from "./routes/savedPlacesRoutes.js";
import visitedPlacesRoutes from "./routes/visitedPlacesRoutes.js";
import locationRoutes from "./routes/locationRoutes.js";

const app = express();

// Middleware
app.use(
  cors({
    origin: process.env.CLIENT_ORIGIN,
    credentials: true,
  })
);

app.use(express.json());

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/places", placesRouter); // public: nearby search + place details
app.use("/api/saved-places", savedPlacesRoutes); // auth required
app.use("/api/visited-places", visitedPlacesRoutes); // auth required
app.use("/api/locations", locationRoutes); // auth required

// Health check
app.get("/api/health", (req, res) => {
  res.json({
    status: "ok",
    message: "Server is running 🚀",
  });
});

// 404 handler (after all routes)
app.use((req, res) => {
  res.status(404).json({ error: "Not found" });
});

// Error handler (must be last)
app.use((err, req, res, next) => {
  console.error(err);

  res.status(err.status || 500).json({
    error: err.message || "Internal Server Error",
  });
});

// Start server
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
