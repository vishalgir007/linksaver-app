import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const validatePassword = (password: string): boolean => {
  const hasMinLength = password.length >= 6
  const hasNumber = /\d/.test(password)
  const hasSpecialChar = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)
  
  return hasMinLength && hasNumber && hasSpecialChar
}

export const getPasswordStrength = (password: string): 'weak' | 'medium' | 'strong' => {
  const hasMinLength = password.length >= 6
  const hasNumber = /\d/.test(password)
  const hasSpecialChar = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)
  const hasUpperCase = /[A-Z]/.test(password)
  const hasLowerCase = /[a-z]/.test(password)
  
  const score = [hasMinLength, hasNumber, hasSpecialChar, hasUpperCase, hasLowerCase].filter(Boolean).length
  
  if (score <= 2) return 'weak'
  if (score <= 4) return 'medium'
  return 'strong'
}
