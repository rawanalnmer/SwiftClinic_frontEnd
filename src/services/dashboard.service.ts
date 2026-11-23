import api from "../lib/axios"
import { AdminStats,DoctorStats } from "../types/dashboard"
export const dashboardService = {
  getAdminStats: async (): Promise<AdminStats> => {
    const res = await api.get<AdminStats>('/appointments/admin/stats')
    return res.data
  },
    getDoctorStats: async (doctorId: string): Promise<DoctorStats> => {
    const res = await api.get<DoctorStats>(`/appointments/doctor/${doctorId}/stats`)
    return res.data
  },
}
