import express from "express";
import { Auth } from "./src/controller/authController";
const router = express.Router();

router.get("/login", Auth.get)
router.post("/login", Auth.post)

export default router;