import api from '../lib/axios'
import { PendingUser } from '../types/auth.types' 

export const adminService = {
  getPendingUsers: async (): Promise<PendingUser[]> => {
    const res = await api.get<PendingUser[]>('/users/pending')
    return res.data
  },

  approveUser: async (id: string): Promise<void> => {
    await api.patch(`/auth/approve/${id}`)
  },

  rejectUser: async (id: string): Promise<void> => {
    await api.patch(`/auth/reject/${id}`)
  },
}