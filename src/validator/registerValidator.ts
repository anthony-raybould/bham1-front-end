import type { Register } from "../model/auth";
import { authService } from "../service/authService";

const validateEmail = (email: string): string | undefined => {
    if (!email) return "Email is required"
    if (!email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) return "Email must be valid"

    return undefined
}

const validatePassword = (password: string): string | undefined => {
    if (!password) return "Password is required"
    if (password.length < 8) return "Password must be at least 8 characters"
    if (!password.match(/^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])/)) {
        return "Password must contain at least one lowercase letter, one uppercase letter, one number, and one special character"
    }

    return undefined
};

const validateRole = async (role: string): Promise<string | undefined> => {
    if (!role) return "Role is required"
    
    const roleID = parseInt(role);
    if (isNaN(roleID)) return "Role must be valid"

    const roles = await authService.getRoles();
    if (!roles.find(r => r.roleID === roleID)) return "Role must be valid"

    return undefined
}

const validateRequest = async (data: Register) => {
    const emailError = registerValidator.validateEmail(data.email);
    if (emailError) return emailError;

    const passwordError = registerValidator.validatePassword(data.password);
    if (passwordError) return passwordError;

    const roleError = await registerValidator.validateRole(data.role);
    if (roleError) return roleError;   
    
    return undefined;
};

export const registerValidator = {
    validateEmail,
    validatePassword,
    validateRole,
    validateRequest
}