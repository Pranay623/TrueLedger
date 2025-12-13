import { z } from "zod";

export enum Role {
  STUDENT = "STUDENT",
  INSTITUTION = "INSTITUTION"
}

export interface User {
  id: string
  email: string
  username: string
  fullName?: string | null
  avatar?: string | null
  usertype?: Role | null
  institutionname?: string | null
  admin?: boolean
  createdAt?: Date
  updatedAt?: Date
}


export interface AuthResponse {
  message: string
  token: string 
  refreshToken: string
  user: {
    id: string
    email: string
    username: string
  }
}


export interface ApiError {
  message: string
  status: number
  errors?: Array<{
    field: string
    message: string 
  }>
}


export interface AuthState {
  user: User | null
  token: string | null
  refreshToken: string | null
  isLoading: boolean
  isAuthenticated: boolean
}


export const signinSchema = z.object({
  email: z
    .string()
    .min(1, "Email is required")
    .email("Invalid email address"),
  password: z
    .string()
    .min(1, "Password is required")
})



export const signupSchema = z.object({
  email: z
    .string()
    .min(1, "Email is required")
    .email("Invalid email address"),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters long")
    .regex(
      /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&*])/,
      "Password must include uppercase, lowercase, number and special character"
    ),
  username: z
    .string()
    .min(3, "Username must be at least 3 characters")
    .trim(),
  firstname: z
    .string()
    .min(1, "First name is required")
    .trim(),
  lastname: z
    .string()
    .min(1, "Last name is required")
    .trim(),
  usertype: z
    .enum([Role.STUDENT, Role.INSTITUTION]), // Using the imported Role enum values
  institutionname: z
    .string()
    .optional()
})
// Refine is used for cross-field validation
.refine((data) => {
  if (data.usertype === Role.INSTITUTION) {
    return data.institutionname && data.institutionname.trim().length > 0
  }
  return true
}, {
  message: "Institution name is required for institution accounts",
  path: ["institutionname"] 
})

export const googleAuthSchema = z.object({
  idToken: z.string().min(1, "Google ID token is required")
})

// --- Type Inference from Schemas (For form data) ---

export type SigninFormData = z.infer<typeof signinSchema>
export type SignupFormData = z.infer<typeof signupSchema>
export type GoogleAuthData = z.infer<typeof googleAuthSchema>