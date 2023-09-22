import { expect } from 'chai';
import { registerValidator } from '../../../src/validator/registerValidator';
import sinon from 'sinon';
import { authService } from '../../../src/service/authService';

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
    
    describe('validateRole', () => {
        beforeEach(() => {
            sinon.restore();
        });

        it('should return undefined if role is valid', async () => {
            sinon.stub(authService, 'getRoles').resolves([{ roleID: 1, roleName: 'Admin' }]);
            const result = await registerValidator.validateRole("1");
            expect(result).to.be.undefined;
        });  
        
        it('should return error if role is invalid', async () => {
            sinon.stub(authService, 'getRoles').resolves([{ roleID: 1, roleName: 'Admin' }]);
            const result = await registerValidator.validateRole("2");
            expect(result).to.equal('Role must be valid');
        });
        
        it('should return error if role is undefined', async () => {
            sinon.stub(authService, 'getRoles').resolves([{ roleID: 1, roleName: 'Admin' }]);
            const result = await registerValidator.validateRole(undefined as any);
            expect(result).to.equal('Role is required');
        });
        
        it('should return error if role is NaN', async () => {
            sinon.stub(authService, 'getRoles').resolves([{ roleID: 1, roleName: 'Admin' }]);
            const result = await registerValidator.validateRole("test");
            expect(result).to.equal('Role must be valid');
        });
    });
    
    describe('validateRequest', () => {
        beforeEach(() => {
            sinon.restore();
        });

        it('should call other validation functions', async () => {
            const validateEmailStub = sinon.stub(registerValidator, 'validateEmail').returns(undefined);
            const validatePasswordStub = sinon.stub(registerValidator, 'validatePassword').returns(undefined);
            const validateRoleStub = sinon.stub(registerValidator, 'validateRole').resolves(undefined);
            
            await registerValidator.validateRequest({ email: 'test@test.com', password: 'Test123!', role: '1' });

            expect(validateEmailStub.calledOnce).to.be.true;
            expect(validatePasswordStub.calledOnce).to.be.true;
            expect(validateRoleStub.calledOnce).to.be.true;
        });
    });
});