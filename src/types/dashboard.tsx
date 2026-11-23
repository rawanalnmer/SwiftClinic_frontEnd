
export interface AdminStats {
  totalDoctors: number
  totalPatients: number
  todayAppointments: number
  pendingRequests: number
  weekData: { day: string; count: number }[]
  doctorsBySpec: { specialization: string; count: number }[]
}

export interface DoctorStats {
  totalPatients: number
  todayCount: number
  weekTotal: number
  todayAppointments: {
    _id: string
    time: string
    status: string
    patientId: { fullName: string; profileImage?: string }
  }[]
  weekData: { day: string; count: number }[]
  attendanceRate: number
  absenceRate: number
}

