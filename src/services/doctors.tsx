import api from '../lib/axios'
import { Doctor } from '../types/doctors' 
import { Schedule } from '../types/doctors'
export const doctorsService = {
  getAll: async (): Promise<Doctor[]> => {
    const res = await api.get<Doctor[]>('/users/doctors')
    return res.data
  },

  getById: async (id: string): Promise<Doctor> => {
    const res = await api.get<Doctor>(`/users/${id}`)
    return res.data
  },
  getSchedule: async (doctorId: string): Promise<Schedule> => {
  const res = await api.get<Schedule>(`/schedule/${doctorId}`)
  return res.data
},
getDoctorPatients: async (doctorId: string) => {
  const res = await api.get(`/users/doctor/${doctorId}/patients`)
  return res.data
},
}
