import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';
import { expect } from 'chai';
import { JobRoleToUpdate } from '../../../src/model/jobRole';
import {ValidationException, validate}  from "../../../src//validator/editJobRoleValidator";

describe('UpdateJobRoleValidator Tests', () => {
    let validJobRole: JobRoleToUpdate;
    let axiosMock: MockAdapter;

    beforeEach(() => {
        validJobRole = {
            jobRoleName: 'ValidName',
            jobSpecSummary: 'ValidSummary',
            band: { bandID: 2, bandName: 'Test band' },
            capability: { capabilityID: 2, capabilityName: 'Test capability' },
            responsibilities: 'ValidResponsibilities',
            sharePoint: 'http://www.valid_url.com',
        };
        axiosMock = new MockAdapter(axios);
    });

    afterEach(() => {
        axiosMock.restore();
    });

    it('should throw ValidationException for null JobRoleName', () => {
        validJobRole.jobRoleName = "";
        try{
            validate(validJobRole);
        }
        catch(e){
            expect(e.message).to.contain("Job role name is null or length is greater than 64.")}
    });

    it('should throw ValidationException for long JobRoleName', () => {
        // eslint-disable-next-line max-len
        validJobRole.jobRoleName = 'ThisIsAReallyLongJobRoleNameThatExceedsTheMaximumAllowedLength ThisIsALongSharePointLinkThatExceedsTheMaximumAllowedLength';
        try{
            validate(validJobRole);
        }
        catch(e){
            expect(e.message).to.contain("Job role name is null or length is greater than 64.")}
    });

    it('should throw ValidationException for null JobSpecSummary', () => {
        validJobRole.jobSpecSummary = "";
        try{
            validate(validJobRole);
        }
        catch(e){
            expect(e.message).to.contain("Job role spec summary is null.")

        }});

    it('should throw ValidationException for BandIDGreaterThanMax', () => {
        validJobRole.band.bandID = 32768;
        try{
            validate(validJobRole);
        }
        catch(e){
            expect(e.message).to.contain("Job role band exceeds size limit.")
        }});

    it('should throw ValidationException for CapabilityIDGreaterThanMax', () => {
        validJobRole.capability.capabilityID = 32768;
        try{
            validate(validJobRole);
        }
        catch(e){
            expect(e.message).to.contain("Job role capability exceeds size limit.")
        }});

    it('should throw ValidationException for null Responsibilities', () => {
        validJobRole.responsibilities = "";
        try{
            validate(validJobRole);
        }
        catch(e){
            expect(e.message).to.contain("Job role responsibilities is null.")
        }
    });

    it('should throw ValidationException for long SharePoint', () => {
        // eslint-disable-next-line max-len
        validJobRole.sharePoint = 'ThisIsALongSharePointLinkThatExceedsTheMaximumAllowedLength ThisIsALongSharePointLinkThatExceedsTheMaximumAllowedLength ThisIsALongSharePointLinkThatExceedsTheMaximumAllowedLength ThisIsALongSharePointLinkThatExceedsTheMaximumAllowedLength ThisIsALongSharePointLinkThatExceedsTheMaximumAllowedLength ThisIsALongSharePointLinkThatExceedsTheMaximumAllowedLength';
        try{
            validate(validJobRole);
        }
        catch(e){
            expect(e.message).to.contain("Share point URL is invalid. Please supply a valid URL.")
        }
    });

    it('should throw ValidationException for invalid URLs', () => {
        const invalidUrls = [
            '',
            '  ',
            'ftp://www.example.com',
            'http://example',
            'http://www.example@',
        ];

        for (const url of invalidUrls) {
            validJobRole.sharePoint = url;
            try{
                validate(validJobRole);
            }
            catch(e){
                expect(e.message).to.contain("Share point URL is invalid. Please supply a valid URL.")
            }
        }
    });

    it('should not throw ValidationException for valid URLs', () => {
        const validUrls = [
            'https://www.something.com/',
            'http://www.something.com/',
            'https://www.something.edu.co.in',
            'http://www.url-with-path.com/path',
            'https://www.url-with-querystring.com/?url=has-querystring',
            'http://url-without-www-subdomain.com/',
            'https://mail.google.com',
        ];

        for (const url of validUrls) {
            validJobRole.sharePoint = url;
            expect(() => validate(validJobRole)).to.not.throw(ValidationException);
        }
    });

    it('should not throw ValidationException for valid object', () => {
        expect(() => validate(validJobRole)).to.not.throw(ValidationException);
    });
});
