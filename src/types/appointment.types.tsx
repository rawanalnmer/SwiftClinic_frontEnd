export interface CreateAppointmentDto {
  doctorId: string
  patientId: string
  date: string
  time: string
  reason?: string
}

export interface Appointment {
  _id: string
  doctorId: string
  patientId: string
  date: string
  time: string
  reason?: string
  status: 'pending' | 'confirmed' | 'cancelled' | 'completed'
  confirmationNumber: string
  createdAt: string
}