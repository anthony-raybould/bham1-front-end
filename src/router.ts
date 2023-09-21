import express from "express";
import { JobRoles } from "./controller/jobRoleController";
const router = express.Router();

router.get("/job-roles", JobRoles.get)
router.get("/view-job-role/:id", JobRoles.getJobRoleById)
router.get("/delete-job-role/:id", JobRoles.getJobRoleByIdForDelete)
router.post("/delete-job-role/:id", JobRoles.deleteJobRole)

export default router;