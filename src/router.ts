import express from "express";
import { Auth } from "./controller/authController";
import { JobRoles } from "./controller/jobRoleController";
import { requireLoggedIn, requireLoggedOut, requireRole, user } from "./middleware/authorisation";

const router = express.Router();

router.get("/", requireLoggedIn, (_, res) => res.render("index"));

// Auth
router.get("/login", requireLoggedOut, Auth.getLogin)
router.post("/login", requireLoggedOut, Auth.postLogin)
router.get("/logout", requireLoggedIn, Auth.getLogout)

// Job Roles
router.get("/job-roles", requireRole("Employee"), JobRoles.get)
router.get("/job-roles/matrix", requireRole("Employee"), JobRoles.getJobRoleMatrix)
router.get("/job-roles/edit/:id", requireRole("Admin"),JobRoles.getEdit)
router.post("/job-roles/edit/:id",requireRole("Admin"), JobRoles.postEdit)
export default router;