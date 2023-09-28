export type JobCapability = {
    capabilityID: number
    capabilityName: string
}

export type JobBand = {
    bandID: number
    bandName: string
}

export type JobRole = {
    jobRoleID: number
    jobRoleName: string
    jobSpecSummary: string
    band: JobBand
    capability: JobCapability
    responsibilities: string
    sharePoint: string
}

export type JobRoleToUpdate = {
    jobRoleName: string
    jobSpecSummary: string
    band: JobBand
    capability: JobCapability
    responsibilities: string
    sharePoint: string
}

export type JobRoleToCreate = {
    jobRoleName: string
    jobSpecSummary: string
    band: JobBand
    capability: JobCapability
    responsibilities: string
    sharePoint: string
}