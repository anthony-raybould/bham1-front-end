import { JobRoleToCreate } from "../model/jobRole";

export class ValidationException extends Error {
    constructor(message: string) {
        super(message);
        this.name = 'ValidationException';
    }
}
const urlRegexPattern = "https?:\\/\\/(www\\.)?[-a-zA-Z0-9@:%._\\+~#=]{1,256}\\.[a-zA-Z0-9()]{1,6}\\b([-a-zA-Z0-9()@:%_\\+.~#?&//=]*)";

export function validateCreate(jobRole: JobRoleToCreate): void {
    if (!jobRole) {
        throw new ValidationException('Job role is null');
    }
    if (!jobRole.jobRoleName || jobRole.jobRoleName.length > 64) {
        throw new ValidationException('Job role name is null or length is greater than 64.');
    }
    if (!jobRole.jobSpecSummary) {
        throw new ValidationException('Job role spec summary is null.');
    }
    if (jobRole.band.bandID > 32767) {
        throw new ValidationException('Job role band exceeds size limit.');
    }
    if (jobRole.capability.capabilityID > 32767) {
        throw new ValidationException('Job role capability exceeds size limit.');
    }
    if (!jobRole.responsibilities) {
        throw new ValidationException('Job role responsibilities is null.');
    }
    if (
        !jobRole.sharePoint ||
        jobRole.sharePoint.length > 255 ||
        !patternMatches(jobRole.sharePoint, urlRegexPattern)
    ) {
        throw new ValidationException('Share point URL is invalid. Please supply a valid URL.');
    }
}

function patternMatches(value: string, pattern: string): boolean {
    const urlRegex = new RegExp(pattern);
    return urlRegex.test(value);
}
