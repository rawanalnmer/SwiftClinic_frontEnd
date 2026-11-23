'use client'

import { useState } from 'react'
import { useNotifications } from '@/src/hooks/useNotifications' 

export default function NotificationBell() {
  const { notifications, unreadCount, markAllRead } = useNotifications()
  const [open, setOpen] = useState(false)

  const handleOpen = () => {
    setOpen(!open)
    if (!open && unreadCount > 0) markAllRead()
  }

  return (
    <div className="relative">

      {/* Bell Button */}
      <button
        onClick={handleOpen}
        className="relative w-9 h-9 flex items-center justify-center rounded-lg border border-border hover:bg-muted transition"
      >
        <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" className="text-foreground">
          <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/>
          <path d="M13.73 21a2 2 0 0 1-3.46 0"/>
        </svg>
        {unreadCount > 0 && (
        <div className="absolute right-7 -top-1 w-4 h-4 bg-destructive text-white text-[10px] flex items-center justify-center rounded-full z-50">
              {unreadCount > 9 ? '9+' : unreadCount}
          </div>
        )}
      </button>

      {/* Dropdown */}
      {open && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setOpen(false)}/>
          <div className="absolute right-0 top-11  w-80 bg-card border border-border rounded-xl shadow-lg z-50 overflow-hidden">

            {/* Header */}
            <div className="flex items-center justify-between px-4 py-3 border-b border-border">
              <p className="text-sm font-medium text-foreground">Notifications</p>
              {unreadCount > 0 && (
                <span className="text-xs text-muted-foreground">{unreadCount} unread</span>
              )}
            </div>

            {/* List */}
            <div className="max-h-80 overflow-y-auto">
              {notifications.length === 0 ? (
                <div className="py-8 text-center text-sm text-muted-foreground">
                  No notifications yet
                </div>
              ) : (
                notifications.map(n => (
                  <div
                    key={n._id}
                    className={`px-4 py-3 border-b border-border last:border-none hover:bg-muted transition ${
                      !n.isRead ? 'bg-secondary/50' : ''
                    }`}
                  >
                    <div className="flex items-start gap-2.5">
                      <div className={`w-2 h-2 rounded-full mt-1.5 shrink-0 ${
                        !n.isRead ? 'bg-primary' : 'bg-transparent'
                      }`}/>
                      <div>
                        <p className="text-sm font-medium text-foreground">{n.title}</p>
                        <p className="text-xs text-muted-foreground mt-0.5 leading-relaxed">{n.message}</p>
                        <p className="text-xs text-muted-foreground mt-1">
                          {new Date(n.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </>
      )}
    </div>
  )
}