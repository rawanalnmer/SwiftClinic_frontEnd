'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useCurrentUser } from '@/src/hooks/useCurrentUser'
import { useState, useEffect } from 'react'

export default function Sidebar() {
  const pathname = usePathname()
  const user = useCurrentUser()
  const url=user?._id
  const [mounted, setMounted] = useState(false)

  useEffect(() => setMounted(true), [])

  const navItems = [
      {
    label: 'Dashboard',
    href: '/dashboard',
    roles: ['admin'],
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
        <rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/>
        <rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/>
      </svg>
    ),
  },
  {
  label: 'Dashboard',
  href: '/doctor-dashboard',
  roles: ['doctor'],
  icon: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
      <rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/>
      <rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/>
    </svg>
  ),
},
    {
      label: 'Doctors',
      href: '/doctors',
      roles: ['admin', 'patient', ],
      icon: (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
          <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
          <circle cx="9" cy="7" r="4"/>
          <path d="M23 21v-2a4 4 0 0 0-3-3.87"/>
          <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
        </svg>
      ),
    },
        {
      label: 'Patients',
      href: '/patients',
      roles: ['doctor'],
      icon: (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
          <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
          <circle cx="9" cy="7" r="4"/>
          <path d="M23 21v-2a4 4 0 0 0-3-3.87"/>
          <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
        </svg>
      ),
    },
    {
      label: 'Schedule',
      href: `/doctors/${url}/schedule`,
      roles: ['doctor'],
      icon: (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
          <rect x="3" y="4" width="18" height="18" rx="2"/>
          <line x1="16" y1="2" x2="16" y2="6"/>
          <line x1="8" y1="2" x2="8" y2="6"/>
          <line x1="3" y1="10" x2="21" y2="10"/>
        </svg>
      ),
    },
    {
  label: 'Requests',
  href: '/requests',
  roles: ['admin'],
  icon: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
      <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/>
      <circle cx="9" cy="7" r="4"/>
      <line x1="19" y1="8" x2="19" y2="14"/>
      <line x1="22" y1="11" x2="16" y2="11"/>
    </svg>
  ),
}
  ].filter(item => mounted && user && item.roles.includes(user.role))

  if (pathname === '/') return null

  return (
    <aside className="w-60 h-screen bg-card border-r border-border flex flex-col shrink-0">
      {/* Logo */}
      <div className="flex items-center gap-2.5 px-5 py-5 border-b border-border">
        <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center shrink-0">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round">
            <path d="M12 2l2 7h7l-5.5 4 2 7L12 16l-5.5 4 2-7L3 9h7z"/>
          </svg>
        </div>
        <span className="text-sm font-medium text-foreground">Swift Clinic</span>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-4 flex flex-col gap-1">
        {navItems.map(item => {
          const active = pathname.startsWith(item.href)
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-colors ${
                active
                  ? 'bg-primary text-primary-foreground font-medium'
                  : 'text-muted-foreground hover:bg-muted hover:text-foreground'
              }`}
            >
              {item.icon}
              {item.label}
            </Link>
          )
        })}
      </nav>
    </aside>
  )
}