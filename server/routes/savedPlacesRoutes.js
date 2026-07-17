import { Router } from "express";
import requireAuth from "../services/authMiddleware.js";
import {
  getSavedPlaces,
  savePlace,
  removeSavedPlace,
} from "../controllers/savedPlacesController.js";

const savedPlacesRoutes = Router();

savedPlacesRoutes.use(requireAuth);

savedPlacesRoutes.get("/", getSavedPlaces);
savedPlacesRoutes.post("/", savePlace);
savedPlacesRoutes.delete("/:placeId", removeSavedPlace);

export default savedPlacesRoutes;