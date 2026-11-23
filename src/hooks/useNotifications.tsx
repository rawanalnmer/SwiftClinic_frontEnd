'use client'

import { useEffect, useState } from 'react'
import { io, Socket } from 'socket.io-client'
import { useCurrentUser } from './useCurrentUser'
import { notificationsService } from '../services/notifications.service'

interface Notification {
  _id: string
  title: string
  message: string
  type: string
  isRead: boolean
  createdAt: string
}

let socket: Socket | null = null

export const useNotifications = () => {
  const user = useCurrentUser()
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [unreadCount, setUnreadCount] = useState(0)

  useEffect(() => {
    if (!user) return

    // جلب الإشعارات الموجودة
    notificationsService.getByUser(user._id).then(data => {
      setNotifications(data)
      setUnreadCount(data.filter(n => !n.isRead).length)
    })

    // اتصال WebSocket
    socket = io('http://localhost:80')
    socket.on('connect', () => {
  socket?.emit('register', user._id)
  console.log('Registered with userId:', user._id)
})

    socket.on('notification', (data: Notification) => {
      setNotifications(prev => [data, ...prev])
      setUnreadCount(prev => prev + 1)
    })

    return () => { socket?.disconnect() }
  }, [user?._id])

  const markAllRead = async () => {
    if (!user) return
    await notificationsService.markAllRead(user._id)
    setNotifications(prev => prev.map(n => ({ ...n, isRead: true })))
    setUnreadCount(0)
  }

  return { notifications, unreadCount, markAllRead }
}