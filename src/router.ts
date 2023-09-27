import express from "express";
import { Auth } from "./controller/authController";
import { JobRoles } from "./controller/jobRoleController";
import { Index } from "./controller/indexController";
import { requireLoggedIn, requireLoggedOut, requireRole, user } from "./middleware/authorisation";

const router = express.Router();

router.get("/", requireLoggedIn, (_, res) => res.render("index"));

// Auth
router.get("/login", requireLoggedOut, Auth.getLogin)
router.post("/login", requireLoggedOut, Auth.postLogin)
router.get("/register", requireLoggedOut, Auth.getRegister)
router.post("/register", requireLoggedOut, Auth.postRegister)
router.get("/logout", requireLoggedIn, Auth.getLogout)

// Job Roles
router.get("/job-roles", requireRole("Employee"), JobRoles.get)
router.get("/view-job-role/:id", JobRoles.getJobRoleById)
router.get("/delete-job-role/:id", JobRoles.getJobRoleByIdForDelete)
router.post("/delete-job-role/:id", JobRoles.deleteJobRole)

// Index
router.get("/", Index.getIndex)

export default router; 