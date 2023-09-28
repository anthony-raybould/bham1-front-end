import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';
import { expect } from 'chai';
import { validateCreate } from '../../../src/validator/capabilityValidator';

describe('capabilityValidator Tests', () => {
    let axiosMock: MockAdapter;

    beforeEach(() => {

        axiosMock = new MockAdapter(axios);
    });

    afterEach(() => {
        axiosMock.restore();
    });

    it('should throw ValidationException when null capability name', () => {

        const createCapabilityRequest = {};

        try {
            validateCreate(createCapabilityRequest);

        } catch(e){
            expect(e.message).to.contain("Invalid: capability name is null");
        }
    });

    it('should throw ValidationException when empty capability name', () => {

        const createCapabilityRequest = { 
            capabilityName: "     "
        };

        try {
            validateCreate(createCapabilityRequest);

        } catch(e){
            expect(e.message).to.contain("Invalid: capability name is empty");
        }
    });

    it('should throw ValidationException when too long capability name', () => {

        const createCapabilityRequest = { 
            capabilityName: "tooLongtooLongtooLongtooLongtooLongtooLongtooLongtooLongtooLongtooLongtooLong"
        };

        try {
            validateCreate(createCapabilityRequest);

        } catch(e){
            expect(e.message).to.contain("Invalid: capability name exceeds size limit (64 characters)");
        }
    });
});
