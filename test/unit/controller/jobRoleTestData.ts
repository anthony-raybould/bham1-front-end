export const bands = { 
    associate: {
        bandID: 1, 
        bandName: 'Associate' 
    },
    trainee: {
        bandID: 2,
        bandName: 'Trainee'
    }
};
export const capabilities = {
    thinking: {
        capabilityID: 1,
        capabilityName: 'Thinking'
    },
    doing: {
        capabilityID: 2,
        capabilityName: 'Doing'
    }
}

// ID | Name             | Band      | Capability 
// ------------------------------------------
// 1  | Thinker          | Associate | Thinking
// 2  | Lead Thinker     | Associate | Thinking
// 3  | Trainee Thinker  | Trainee   | Thinking
// 4  | Doer             | Associate | Doing
// 5  | Lead Doer        | Associate | Doing
// 6  | Trainee Doer     | Trainee   | Doing
export const jobRoles = [
    {
        jobRoleID: 1,
        jobRoleName: 'Thinker',
        jobSpecSummary: 'Thinks about stuff',
        band: bands.associate,
        capability: capabilities.thinking,
        responsibilities: 'Responsible for thoughts',
        sharePoint: 'https://sharepoint.com/thinker'
    },
    {
        jobRoleID: 2,
        jobRoleName: 'Lead Thinker',        
        jobSpecSummary: 'Trains other people to do some thinking',
        band: bands.associate,
        capability: capabilities.thinking,
        responsibilities: 'Responsible for thoughts',        
        sharePoint: 'https://sharepoint.com/lead-thinker'
    },
    {
        jobRoleID: 3,
        jobRoleName: 'Trainee Thinker',
        jobSpecSummary: 'Thinks about stuff under supervision',
        band: bands.trainee,
        capability: capabilities.thinking,
        responsibilities: 'Responsible for thoughts',
        sharePoint: 'https://sharepoint.com/trainee-thinker'
    },
    {
        jobRoleID: 4,
        jobRoleName: 'Doer',        
        jobSpecSummary: 'Does stuff',
        band: bands.associate,
        capability: capabilities.doing,
        responsibilities: 'Responsible for doing stuff',
        sharePoint: 'https://sharepoint.com/doer'
    },
    {
        jobRoleID: 5,
        jobRoleName: 'Lead Doer',
        jobSpecSummary: 'Trains other people to do stuff',
        band: bands.associate,
        capability: capabilities.doing,
        responsibilities: 'Responsible for doing stuff',
        sharePoint: 'https://sharepoint.com/lead-doer'
    },
    {
        jobRoleID: 6,
        jobRoleName: 'Trainee Doer',
        jobSpecSummary: 'Does stuff under supervision',
        band: bands.trainee,
        capability: capabilities.doing,
        responsibilities: 'Responsible for doing stuff',
        sharePoint: 'https://sharepoint.com/trainee-doer'
    }
]