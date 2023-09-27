import express from "express";
import { JobRoles } from "./controller/jobRoleController";
import { JobRolesFilter } from "./controller/jobRoleFilterController";
const router = express.Router();

router.get("/job-roles", JobRoles.get)
router.get("/job-roles/filter", JobRolesFilter.getFilter)
router.post("/job-roles/filter", JobRolesFilter.postFilter)
router.get("/job-roles/edit/:id", JobRoles.getEdit)
router.post("/job-roles/edit/:id", JobRoles.postEdit)
export default router;