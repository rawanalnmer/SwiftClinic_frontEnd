'use client'

import { useCurrentUser } from '@/src/hooks/useCurrentUser'; 
import { useDoctorStats } from '@/src/hooks/useDashboard';

const STATUS_STYLE: Record<string, { bg: string; color: string; label: string }> = {
  completed: { bg: '#E1F5EE', color: '#085041', label: 'Done' },
  confirmed: { bg: '#FEF9C3', color: '#CA8A04', label: 'Next' },
  pending:   { bg: '#F3F4F6', color: '#9CA3AF', label: 'Pending' },
  cancelled: { bg: '#FEE2E2', color: '#EF4444', label: 'Cancelled' },
}

export default function DoctorDashboardPage() {
  const user = useCurrentUser()
  const { data: stats, isLoading } = useDoctorStats(user?._id ?? '')

  if (isLoading) return (
    <div className="flex items-center justify-center h-64 text-muted-foreground text-sm">
      Loading dashboard...
    </div>
  )

  const maxWeek = Math.max(...(stats?.weekData.map(d => d.count) ?? [1]), 1)

  const greeting = () => {
    const h = new Date().getHours()
    if (h < 12) return 'Good morning'
    if (h < 17) return 'Good afternoon'
    return 'Good evening'
  }

  return (
    <div className="p-6 bg-background min-h-screen">

      {/* Header */}
      <div className="mb-6">
        <h1 className="text-lg font-medium text-foreground">
          {greeting()}, Dr. {user?.fullName?.split(' ')[0]} 👋
        </h1>
        <p className="text-sm text-muted-foreground mt-1">
          {new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-3 mb-4">
        {[
          {
            label: 'My Patients', value: stats?.totalPatients ?? 0,
            color: '#1D9E75', bg: '#E1F5EE', sub: 'Total registered',
            icon: <><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></>
          },
          {
            label: "Today's Appointments", value: stats?.todayCount ?? 0,
            color: '#CA8A04', bg: '#FEF9C3', sub: 'Scheduled today',
            icon: <><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></>
          },
          {
            label: 'This Week', value: stats?.weekTotal ?? 0,
            color: '#6366F1', bg: '#EEF2FF', sub: 'Total appointments',
            icon: <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/>
          },
        ].map((s, i) => (
          <div key={i} className="bg-card border border-border rounded-xl p-5">
            <div className="w-9 h-9 rounded-lg flex items-center justify-center mb-3" style={{ background: s.bg }}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={s.color} strokeWidth="2" strokeLinecap="round">
                {s.icon}
              </svg>
            </div>
            <p className="text-xs text-muted-foreground mb-1">{s.label}</p>
            <p className="text-3xl font-semibold" style={{ color: s.color }}>{s.value}</p>
            <p className="text-xs mt-1" style={{ color: s.color }}>{s.sub}</p>
          </div>
        ))}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">

        {/* Today's Appointments List */}
        <div className="bg-card border border-border rounded-xl p-5">
          <p className="text-xs font-semibold text-primary uppercase tracking-wide mb-4">
            Today's Appointments
          </p>
          {!stats?.todayAppointments.length ? (
            <p className="text-sm text-muted-foreground">No appointments today</p>
          ) : (
            <div className="flex flex-col gap-2">
              {stats.todayAppointments.map((apt, i) => {
                const s = STATUS_STYLE[apt.status] ?? STATUS_STYLE.pending
                const name = apt.patientId?.fullName ?? 'Unknown'
                const initials = name.split(' ').map(n => n[0]).slice(0, 2).join('')
                return (
                  <div key={i} className="flex items-center gap-3 p-2.5 rounded-lg bg-muted">
                    <div className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center text-xs font-medium text-secondary-foreground shrink-0">
                      {initials}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-foreground truncate">{name}</p>
                      <p className="text-xs text-muted-foreground">{apt.time}</p>
                    </div>
                    <span className="text-xs px-2 py-0.5 rounded-full shrink-0" style={{ background: s.bg, color: s.color }}>
                      {s.label}
                    </span>
                  </div>
                )
              })}
            </div>
          )}
        </div>

        {/* Right Column */}
        <div className="flex flex-col gap-4">

          {/* Week Bar Chart */}
          <div className="bg-card border border-border rounded-xl p-5">
            <p className="text-xs font-semibold text-primary uppercase tracking-wide mb-4">
              Appointments This Week
            </p>
            <div className="flex items-end gap-2 h-62">
              {stats?.weekData.map((d, i) => (
                <div key={i} className="flex flex-col items-center flex-1 h-full justify-end">
                  <div
                    className="w-full rounded-t-md transition-all"
                    style={{
                      height: `${Math.max((d.count / maxWeek) * 100, d.count > 0 ? 8 : 3)}%`,
                      background: d.count > 0 ? '#1D9E75' : 'var(--color-border)',
                      opacity: d.count > 0 ? 0.85 : 0.3,
                    }}
                  />
                  <p className="text-xs text-muted-foreground mt-1.5">{d.day}</p>
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>
    </div>
  )
}