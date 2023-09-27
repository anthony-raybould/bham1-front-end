import express from "express";
import { Auth } from "./controller/authController";
import { JobRoles } from "./controller/jobRoleController";
import { Index } from "./controller/indexController";
import { requireLoggedIn, requireLoggedOut, requireRole, user } from "./middleware/authorisation";

const router = express.Router();



// Auth
router.get("/login", requireLoggedOut, Auth.getLogin)
router.post("/login", requireLoggedOut, Auth.postLogin)
router.get("/register", requireLoggedOut, Auth.getRegister)
router.post("/register", requireLoggedOut, Auth.postRegister)
router.get("/logout", requireLoggedIn, Auth.getLogout)

// Job Roles
router.get("/job-roles", requireRole("Employee"), JobRoles.get)
router.get("/job-roles/matrix", requireRole("Employee"), JobRoles.getJobRoleMatrix)
router.get("/job-roles/edit/:id", requireRole("Admin"),JobRoles.getEdit)
router.post("/job-roles/edit/:id", requireRole("Admin"), JobRoles.postEdit)
router.get("/view-job-role/:id", requireRole("Employee"), JobRoles.getJobRoleById)
router.get("/delete-job-role/:id", requireRole("Admin"), JobRoles.getJobRoleByIdForDelete)
router.post("/delete-job-role/:id", requireRole("Admin"), JobRoles.deleteJobRole)
router.get("/create-job-role", requireRole("Admin"), JobRoles.getCreate)
router.post("/create-job-role", requireRole("Admin"), JobRoles.postCreate)


// Index
router.get("/", requireLoggedIn, Index.getIndex);

export default router; 

