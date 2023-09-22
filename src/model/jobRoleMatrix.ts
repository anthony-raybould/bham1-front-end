import { JobBand, JobCapability, JobRole } from "./jobRole"

export type JobRoleMatrix = {
    bands : JobBand[]
    capabilities : JobCapability[]
    jobRolesGrid : JobRole[][][]
}