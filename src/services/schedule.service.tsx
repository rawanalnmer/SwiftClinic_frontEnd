import api from '../lib/axios'
import {  Schedule } from '../types/doctors'
import { CreateScheduleDto } from '../types/schedule.types'
export const scheduleService = {
  getByDoctor: async (doctorId: string): Promise<Schedule> => {
    const res = await api.get<Schedule>(`/schedule/${doctorId}`)
    return res.data
  },

  upsert: async (doctorId: string, dto: CreateScheduleDto): Promise<Schedule> => {
    const res = await api.post<Schedule>(`/schedule/${doctorId}`, dto)
    return res.data
  },

  getAvailableSlots: async (doctorId: string, date: string): Promise<string[]> => {
    const res = await api.get<string[]>(`/schedule/${doctorId}/slots/${date}`)
    return res.data
  },
}