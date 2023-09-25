import express from "express";
import { JobRoles } from "./controller/jobRoleController";
import { Auth } from "./controller/authController";
const router = express.Router();

router.get("/login", Auth.get)
router.post("/login", Auth.post)

router.get("/job-roles", JobRoles.get)
router.get("/job-roles/matrix", JobRoles.getJobRoleMatrix)
router.get("/job-roles/edit/:id", JobRoles.getEdit)
router.post("/job-roles/edit/:id", JobRoles.postEdit)
export default router;