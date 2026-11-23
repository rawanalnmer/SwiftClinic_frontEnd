'use client'

import { useParams, useRouter } from 'next/navigation'
import { useQuery } from '@tanstack/react-query'


import { useCurrentUser } from '@/src/hooks/useCurrentUser'
import api from '@/src/lib/axios'

const STATUS_STYLE: Record<string, { bg: string; color: string; label: string }> = {
  completed: { bg: '#E1F5EE', color: '#085041', label: 'Completed' },
  confirmed: { bg: '#FEF9C3', color: '#CA8A04', label: 'Upcoming' },
  pending:   { bg: '#F3F4F6', color: '#9CA3AF', label: 'Pending' },
  cancelled: { bg: '#FEE2E2', color: '#991B1B', label: 'Cancelled' },
}

export default function PatientDetailsPage() {
  const { id } = useParams<{ id: string }>()
  const router = useRouter()
  const user = useCurrentUser()

  const { data: patient, isLoading, error } = useQuery({
    queryKey: ['patient', id],
    queryFn: async () => {
      const res = await api.get(`/users/${id}`)
      return res.data
    },
    enabled: !!id,
  })

  const { data: appointments } = useQuery({
    queryKey: ['patient-appointments', id, user?._id],
    queryFn: async () => {
      const res = await api.get(`/appointments/doctor/${user?._id}`)
      return res.data.filter((a: any) => a.patientId?._id === id || a.patientId === id)
    },
    enabled: !!id && !!user?._id,
  })

  if (isLoading) return (
    <div className="flex items-center justify-center h-64 text-muted-foreground text-sm">
      Loading...
    </div>
  )

  if (error || !patient) return (
    <div className="flex items-center justify-center h-64 text-destructive text-sm">
      Patient not found.
    </div>
  )

  const initials = patient.fullName.split(' ').map((n: string) => n[0]).slice(0, 2).join('')
  const totalVisits = appointments?.filter((a: any) => a.status === 'completed').length ?? 0
  const nextAppointment = appointments?.find((a: any) => a.status === 'confirmed' || a.status === 'pending')

  return (
    <div className="p-6 bg-background min-h-screen">

      {/* Back */}
      <button
        onClick={() => router.back()}
        className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition mb-5"
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
          <path d="M19 12H5M12 5l-7 7 7 7"/>
        </svg>
        Back to Patients
      </button>

      <div className="flex flex-col gap-4">

        {/* Personal Info */}
        <div className="bg-card border border-border rounded-xl p-5">
          <p className="text-md font-bold text-primary tracking-wide mb-4">Personal Info</p>
          <div className="flex items-end">
            <div className="grid grid-cols-2">
              <div className="grid grid-cols-2 gap-4 items-center">
                {/* Avatar */}
                {patient.profileImage ? (
                  <img
                    src={`http://localhost:80/uploads/${patient.profileImage}`}
                    alt={patient.fullName}
                    className="w-50 h-50 rounded-full object-cover border-2 border-primary"
                  />
                ) : (
                  <div className="w-50 h-50 rounded-full bg-secondary flex items-center justify-center text-2xl font-medium text-secondary-foreground border-2 border-border">
                    {initials}
                  </div>
                )}

                {/* Col 1 */}
                <div className="gap-2 mb-5">
                  {[
                    { label: 'Full Name:', value: patient.fullName },
                    { label: 'Email:', value: patient.email },
                    { label: 'Phone:', value: patient.phone ?? '—' },
                  ].map((item, i) => (
                    <div className="flex items-end gap-2 mb-5" key={i}>
                      <p className="text-sm text-foreground font-semibold">{item.label}</p>
                      <p className="text-sm text-foreground">{item.value}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Col 2 */}
            <div className="mb-5">
              {[
                { label: 'Patient ID:', value: patient._id.slice(-6).toUpperCase(), mono: true },
                { label: 'Age:', value: patient.age ? `${patient.age} years` : patient.birthDate ? `${new Date().getFullYear() - new Date(patient.birthDate).getFullYear()} years` : '—' },
                { label: 'Gender:', value: patient.gender ?? '—' },
                { label: 'Total Visits:', value: String(totalVisits) },
              ].map((item, i) => (
                <div className="flex gap-2 mb-6" key={i}>
                  <p className="text-sm text-foreground font-semibold">{item.label}</p>
                  <p className={`text-sm text-foreground ${item.mono ? 'font-mono' : ''}`}>
                    {item.value}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Appointment History */}
        <div className="bg-card border border-border rounded-xl p-5">
          <p className="text-md font-bold text-primary tracking-wide mb-4">Appointment History</p>

          {!appointments?.length ? (
            <p className="text-sm text-muted-foreground">No appointments yet</p>
          ) : (
            <div className="flex flex-col gap-2">
              {appointments.map((apt: any) => {
                const s = STATUS_STYLE[apt.status] ?? STATUS_STYLE.pending
                return (
                  <div key={apt._id} className="flex items-center justify-between p-3 bg-muted rounded-lg">
                    <div>
                      <p className="text-sm font-medium text-foreground">{apt.date}</p>
                      <p className="text-xs text-muted-foreground mt-0.5">
                        {apt.time}{apt.reason ? ` · ${apt.reason}` : ''}
                      </p>
                    </div>
                    <span className="text-xs px-2.5 py-1 rounded-full" style={{ background: s.bg, color: s.color }}>
                      {s.label}
                    </span>
                  </div>
                )
              })}
            </div>
          )}
        </div>

      </div>
    </div>
  )
}