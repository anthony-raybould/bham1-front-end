import { JobBand, JobCapability, JobRole } from "./jobRole"

export type JobRoleMatrix = {
    bands : JobBand[]
    capabilities : JobCapability[]
    jobRoles : JobRole[][][] // The roles(s) for each cell in the matrix, by band, then capability.
}