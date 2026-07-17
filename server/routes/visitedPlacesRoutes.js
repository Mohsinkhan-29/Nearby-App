import { Router } from "express";
import requireAuth from "../services/authMiddleware.js";
import {
  markVisited,
  getVisitedPlaces,
} from "../controllers/visitedPlacesController.js";

const router = Router();

router.use(requireAuth);

router.get("/", getVisitedPlaces);
router.post("/", markVisited);

export default router;
