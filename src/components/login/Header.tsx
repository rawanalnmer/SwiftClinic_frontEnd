'use client'

import NotificationBell from './NotificationBell'
import ThemeToggle from './ThemeToggle'
import { usePathname } from 'next/navigation'

export default function Header() {
    const pathname = usePathname()
      if (pathname === '/') return null
  return (
    <header className="h-14 border-b border-border bg-card flex items-center justify-end px-6 gap-2">
      <NotificationBell />
      <ThemeToggle />
    </header>
  )
}