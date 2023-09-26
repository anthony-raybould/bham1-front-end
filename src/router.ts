import express from "express";
import { JobRoles } from "./controller/jobRoleController";
import { CapabilityController } from "./controller/capabilityController";
const router = express.Router();

router.get("/job-roles", JobRoles.get)
router.get("/job-roles/edit/:id", JobRoles.getEdit)
router.post("/job-roles/edit/:id", JobRoles.postEdit)

router.get("/capabilities/create", CapabilityController.getCreate)
router.post("/capabilities/create", CapabilityController.postCreate)
export default router;