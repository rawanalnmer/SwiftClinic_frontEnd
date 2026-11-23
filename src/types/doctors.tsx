export interface Doctor {
  _id: string
  fullName: string
  email: string
  phone: string
  profileImage?: string
  specialization?: string
  patientsCount?: number
  age?: number
  certificateImage:string;
  yearsOfExperience?: number
  university?: string
  graduationYear?: number
  clinicLocationText?: string
  clinicLocationUrl?: string
  status: 'pending' | 'approved' | 'rejected'
  role: 'doctor'
  createdAt: string
}

export interface DoctorsResponse {
  data: Doctor[]
  total: number
}
export interface WorkingDay {
  day: string
  startTime: string
  endTime: string
  slotDuration: number
  maxAppointments?: number
  isActive: boolean
}

export interface Schedule {
  _id: string
  doctorId: string
  workingDays: WorkingDay[]
}