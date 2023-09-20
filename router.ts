import express from "express";
import { Auth } from "./src/controller/authController";
import { requireLoggedIn, requireLoggedOut, requireRole, user } from "./src/middleware/authorisation";

const router = express.Router();

router.use(user());

router.get("/", requireLoggedIn(), (_, res) => res.render("index"));

// Auth
router.get("/login", requireLoggedOut(), Auth.getLogin)
router.post("/login", requireLoggedOut(), Auth.postLogin)
router.get("/logout", requireLoggedIn(), Auth.getLogout)

export default router;