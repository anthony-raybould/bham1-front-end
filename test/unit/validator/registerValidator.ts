import { expect } from 'chai';
import { registerValidator } from '../../../src/validator/registerValidator';

describe('registerValidator', () => {
    
    describe('validateEmail', () => {
        it('should return undefined if email is valid', () => {
            const result = registerValidator.validateEmail('test@test.com');
            expect(result).to.be.undefined;
        });
        
        it('should return error if email is invalid', () => {
            const result = registerValidator.validateEmail('test');
            expect(result).to.equal('Email must be valid');  
        });
    });
    
    describe('validatePassword', () => {
        it('should return undefined if password is valid', () => {
            const result = registerValidator.validatePassword('Test123!');
            expect(result).to.be.undefined;
        });
        
        it('should return error if password is fewer than 8 characters', () => {
            const result = registerValidator.validatePassword('test');
            expect(result).to.equal('Password must be at least 8 characters');  
        });
        
        it('should return error if password does not contain lowercase letter', () => {
            const result = registerValidator.validatePassword('TEST123!');
            expect(result).to.equal('Password must contain at least one lowercase letter, one uppercase letter, one number, and one special character');  
        });

        it('should return error if password does not contain uppercase letter', () => {
            const result = registerValidator.validatePassword('test123!');
            expect(result).to.equal('Password must contain at least one lowercase letter, one uppercase letter, one number, and one special character');  
        });

        it('should return error if password does not contain number', () => {
            const result = registerValidator.validatePassword('Test!!!!');
            expect(result).to.equal('Password must contain at least one lowercase letter, one uppercase letter, one number, and one special character');  
        });

        it('should return error if password does not contain special character', () => {
            const result = registerValidator.validatePassword('Test1234');
            expect(result).to.equal('Password must contain at least one lowercase letter, one uppercase letter, one number, and one special character');  
        });
    });
});