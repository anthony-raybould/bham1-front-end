const validateEmail = (email: string): string | undefined => {
    if (!email) return "Email is required"
    if (!email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) return "Email must be valid"

    return undefined
}

const validatePassword = (password: string): string | undefined => {
    if (!password) return "Password is required"
    if (password.length < 8) return "Password must be at least 8 characters"
    if (!password.match(/^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])/)) return "Password must contain at least one lowercase letter, one uppercase letter, one number, and one special character"

    return undefined
};

export const registerValidator = {
    validateEmail,
    validatePassword
}