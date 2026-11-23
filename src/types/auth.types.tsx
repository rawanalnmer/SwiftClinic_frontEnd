export interface LoginDto {
  email: string
  password: string
}

export interface RegisterPatientDto {
  fullName: string
  email: string
  phone: string
  password: string
  gender: 'male' | 'female'
  birthDate: string
  profileImage?: File
}

export interface RegisterDoctorDto {
  fullName: string
  email: string
  phone: string
  password: string
  age: number
  yearsOfExperience: number
  university: string
  graduationYear: number
  clinicLocationText: string
  clinicLocationUrl?: string
  profileImage?: File
  certificateImage?: File
}

export interface AuthResponse {
  accessToken: string;
  refreshToken: string ;
  user: User;
}

export interface MessageResponse {
  message: string
}

export interface User {
  _id: string
  fullName: string
  email: string
  phone: string
  role: 'admin' | 'doctor' | 'patient'
  status: 'pending' | 'approved' | 'rejected'
}

export interface PendingUser {
  _id: string
  fullName: string
  email: string
  phone: string
  role: 'doctor' | 'patient'
  status: 'pending' | 'approved' | 'rejected'
  profileImage?: string
  specialization?: string
  university?: string
  graduationYear?: number
  yearsOfExperience?: number
  age?: number
  clinicLocationText?: string
  createdAt: string
}