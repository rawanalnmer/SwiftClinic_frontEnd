'use client'

import { useAdminStats } from "@/src/hooks/useDashboard" 


export default function AdminDashboardPage() {
  const { data: stats, isLoading } = useAdminStats()

  if (isLoading) return (
    <div className="flex items-center justify-center h-64 text-muted-foreground text-sm">
      Loading dashboard...
    </div>
  )

  const maxWeek = Math.max(...(stats?.weekData.map(d => d.count) ?? [1]))

  return (
    <div className="p-6 bg-background min-h-screen-[80px]">
      <h1 className="text-lg font-medium text-foreground mb-6">Admin Dashboard</h1>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-4">
        {[
          {
            label: 'Total Doctors', value: stats?.totalDoctors ?? 0,
            color: '#1D9E75', bg: '#E1F5EE',
            icon: <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>,
            sub: 'Approved doctors'
          },
          {
            label: 'Total Patients', value: stats?.totalPatients ?? 0,
            color: '#6366F1', bg: '#EEF2FF',
            icon: <><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></>,
            sub: 'Registered patients'
          },
          {
            label: "Today's Appointments", value: stats?.todayAppointments ?? 0,
            color: '#CA8A04', bg: '#FEF9C3',
            icon: <><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></>,
            sub: 'Scheduled today'
          },
          {
            label: 'Pending Requests', value: stats?.pendingRequests ?? 0,
            color: '#EF4444', bg: '#FEE2E2',
            icon: <><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></>,
            sub: 'Needs review'
          },
        ].map((s, i) => (
          <div key={i} className="bg-card border border-border rounded-xl p-5">
            <div className="w-9 h-9 rounded-lg flex items-center justify-center mb-3" style={{ background: s.bg }}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={s.color} strokeWidth="2" strokeLinecap="round">
                {s.icon}
              </svg>
            </div>
            <p className="text-xs text-muted-foreground mb-1">{s.label}</p>
            <p className="text-3xl font-semibold text-foreground" style={{ color: s.color }}>{s.value}</p>
            <p className="text-xs mt-1" style={{ color: s.color }}>{s.sub}</p>
          </div>
        ))}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1  gap-4">

        {/* Bar Chart */}
        <div className="bg-card border border-border rounded-xl p-5">
          <p className="text-md font-bold text-primary  tracking-wide mb-4">
            Appointments This Week
          </p>
          <div className="flex items-end gap-2 h-62">
            {stats?.weekData.map((d, i) => (
              <div key={i} className="flex flex-col items-center flex-1 h-full justify-end">
                <p className="text-xs text-primary mb-1">{d.count || ''}</p>
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
  )
}