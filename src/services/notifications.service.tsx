import api from "../lib/axios"

export interface Notification {
  _id: string
  title: string
  message: string
  type: string
  isRead: boolean
  createdAt: string
}

export const notificationsService = {
  getByUser: async (userId: string): Promise<Notification[]> => {
    const res = await api.get<Notification[]>(`/notifications/${userId}`)
    return res.data
  },

  getUnreadCount: async (userId: string): Promise<{ count: number }> => {
    const res = await api.get<{ count: number }>(`/notifications/${userId}/unread-count`)
    return res.data
  },

  markAllRead: async (userId: string): Promise<void> => {
    await api.patch(`/notifications/${userId}/mark-read`)
  },
}