import express from "express";
import requireAuth from "../services/authMiddleware.js";
import {
  logLocation,
  getLatestLocation,
} from "../controllers/locationController.js";

const router = express.Router();

router.use(requireAuth);

router.post("/", logLocation);
router.get("/latest", getLatestLocation);

export default router;