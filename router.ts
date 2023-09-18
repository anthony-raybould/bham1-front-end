import express from "express";
import { JobRoles } from "./src/controller/jobRoleController";
const router = express.Router();

router.get("/job-roles", JobRoles.get)

export default router;