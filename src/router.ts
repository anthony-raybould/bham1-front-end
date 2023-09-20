import express from "express";
import { JobRoles } from "./controller/jobRoleController";
const router = express.Router();

router.get("/job-roles", JobRoles.get)

export default router;