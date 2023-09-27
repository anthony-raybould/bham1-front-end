import express from "express";
import { Auth } from "./controller/authController";
import { JobRoles } from "./controller/jobRoleController";
import { JobRolesFilter } from "./controller/jobRoleFilterController";
import { Index } from "./controller/indexController";
import { requireLoggedIn, requireLoggedOut, requireRole } from "./middleware/authorisation";

const router = express.Router();



// Auth
router.get("/login", requireLoggedOut, Auth.getLogin)
router.post("/login", requireLoggedOut, Auth.postLogin)
router.get("/register", requireLoggedOut, Auth.getRegister)
router.post("/register", requireLoggedOut, Auth.postRegister)
router.get("/logout", requireLoggedIn, Auth.getLogout)

// Job Roles
router.get("/job-roles", requireRole("Employee"), JobRoles.get)
// Job Roles -- View Single
router.get("/view-job-role/:id", requireRole("Employee"), JobRoles.getJobRoleById)
// Job Roles -- Filter
router.get("/job-roles/filter", requireRole("Employee"), JobRolesFilter.getFilter)
router.post("/job-roles/filter", requireRole("Employee"), JobRolesFilter.postFilter)
// Job Roles -- Matrix
router.get("/job-roles/matrix", requireRole("Employee"), JobRoles.getJobRoleMatrix)
// Job Roles -- Edit
router.get("/job-roles/edit/:id", requireRole("Admin"),JobRoles.getEdit)
router.post("/job-roles/edit/:id", requireRole("Admin"), JobRoles.postEdit)
// Job Roles -- Delete
router.get("/delete-job-role/:id", requireRole("Admin"), JobRoles.getJobRoleByIdForDelete)
router.post("/delete-job-role/:id", requireRole("Admin"), JobRoles.deleteJobRole)
// Job Roles -- Create
router.get("/create-job-role", requireRole("Admin"), JobRoles.getCreate)
router.post("/create-job-role", requireRole("Admin"), JobRoles.postCreate)

// Index
router.get("/", requireLoggedIn, Index.getIndex);

export default router; 
