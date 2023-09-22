import express from "express";
import { JobRoles } from "./controller/jobRoleController";
const router = express.Router();

router.get("/job-roles", JobRoles.get)
router.get("/job-roles/matrix", JobRoles.getJobRoleMatrix)
router.get("/job-roles/edit/:id", JobRoles.getEdit)
router.post("/job-roles/edit/:id", JobRoles.postEdit)
export default router;