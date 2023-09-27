import express from "express";
import { JobRoles } from "./controller/jobRoleController";
import { Auth } from "./controller/authController";
import { Index } from "./controller/indexController";
const router = express.Router();

router.get("/login", Auth.get)
router.post("/login", Auth.post)
router.get("/", Index.getIndex)

router.get("/job-roles", JobRoles.get)

export default router;