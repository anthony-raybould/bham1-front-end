import express from "express";
import { JobRoles } from "./controller/jobRoleController";
const router = express.Router();

router.get("/job-roles", JobRoles.get)
router.get("/job-roles/edit/:id", JobRoles.getEdit)
router.post("/job-roles/edit/:id", JobRoles.postEdit)
router.get("/create-job-role", JobRoles.getCreate)
router.post("/create-job-role", JobRoles.create)
export default router;