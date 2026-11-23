import api from '../lib/axios'
import { Appointment, CreateAppointmentDto } from '../types/appointment.types'
export const appointmentService = {
  create: async (dto: CreateAppointmentDto): Promise<Appointment> => {
    const res = await api.post<Appointment>('/appointments', dto)
    return res.data
  },

  getByPatient: async (patientId: string): Promise<Appointment[]> => {
    const res = await api.get<Appointment[]>(`/appointments/patient/${patientId}`)
    return res.data
  },

  getByDoctor: async (doctorId: string): Promise<Appointment[]> => {
    const res = await api.get<Appointment[]>(`/appointments/doctor/${doctorId}`)
    return res.data
  },

  cancel: async (id: string): Promise<Appointment> => {
    const res = await api.patch<Appointment>(`/appointments/${id}/cancel`)
    return res.data
  },
}