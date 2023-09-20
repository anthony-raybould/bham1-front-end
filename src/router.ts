import express from "express";
import { Auth } from "./controller/authController";
import { JobRoles } from "./controller/jobRoleController";
import { requireLoggedIn, requireLoggedOut, requireRole, user } from "./middleware/authorisation";

const router = express.Router();

router.use(user());

router.get("/", requireLoggedIn(), (_, res) => res.render("index"));

// Auth
router.get("/login", requireLoggedOut(), Auth.getLogin)
router.post("/login", requireLoggedOut(), Auth.postLogin)
router.get("/logout", requireLoggedIn(), Auth.getLogout)

// Job Roles
router.get("/job-roles", requireRole("Employee"), JobRoles.get)

export default router;