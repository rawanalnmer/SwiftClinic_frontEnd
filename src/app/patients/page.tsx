'use client'

import { useState, useMemo } from 'react'
import { useCurrentUser } from '@/src/hooks/useCurrentUser' 
import { useDoctorPatients

    
 } from '@/src/hooks/doctors.hook' 

export default function PatientsPage() {
  const user = useCurrentUser()
  const { data: patients, isLoading } = useDoctorPatients(user?._id ?? '')

  const [search, setSearch] = useState({
    name: '', id: '', phone: '', age: '',
  })

  const filtered = useMemo(() => {
    if (!patients) return []
    return patients.filter((p: any) =>
      p.fullName.toLowerCase().includes(search.name.toLowerCase()) &&
      p._id.toLowerCase().includes(search.id.toLowerCase()) &&
      (p.phone ?? '').toLowerCase().includes(search.phone.toLowerCase()) &&
      (p.age?.toString() ?? '').includes(search.age)
    )
  }, [patients, search])

  const inputClass = "w-full px-2 py-1.5 text-xs border border-border rounded-md bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring"

  if (isLoading) return (
    <div className="flex items-center justify-center h-64 text-muted-foreground text-sm">
      Loading patients...
    </div>
  )

  return (
    <div className="p-6">

      {/* Header */}
      <div className="flex items-center gap-3 mb-5">
        <h1 className="text-lg font-medium text-foreground">My Patients</h1>
        <span className="text-xs px-2.5 py-1 rounded-full bg-secondary text-secondary-foreground">
          {filtered.length} total
        </span>
      </div>

      {/* Table */}
      <div className="bg-card border border-border rounded-xl overflow-auto">
        <table className="w-full border-collapse text-sm min-w-[800px]">
          <thead>
            {/* Column Labels */}
            <tr className="bg-muted">
              {[, 'Patient ID', 'Full Name', 'Phone', 'Age', 'Last Appointment', 'Next Appointment', 'Actions'].map(h => (
                <th key={h} className="px-3 py-2.5 text-left text-xs font-medium text-muted-foreground border-b border-border whitespace-nowrap">
                  {h}
                </th>
              ))}
            </tr>

            {/* Search Row */}
            <tr className="bg-muted">
              <th className="px-2 py-1.5 border-b border-border">
                <input className={inputClass} placeholder="Search ID..."
                  value={search.id} onChange={e => setSearch({ ...search, id: e.target.value })}/>
              </th>
              <th className="px-2 py-1.5 border-b border-border">
                <input className={inputClass} placeholder="Search name..."
                  value={search.name} onChange={e => setSearch({ ...search, name: e.target.value })}/>
              </th>
              <th className="px-2 py-1.5 border-b border-border">
                <input className={inputClass} placeholder="Search phone..."
                  value={search.phone} onChange={e => setSearch({ ...search, phone: e.target.value })}/>
              </th>
              <th className="px-2 py-1.5 border-b border-border">
                <input className={inputClass} placeholder="Age..."
                  value={search.age} onChange={e => setSearch({ ...search, age: e.target.value })}/>
              </th>
              <th className="px-2 py-1.5 border-b border-border"/>
              <th className="px-2 py-1.5 border-b border-border"/>
              <th className="px-2 py-1.5 border-b border-border"/>
            </tr>
          </thead>

          <tbody>
            {filtered.length === 0 ? (
              <tr>
                <td colSpan={8} className="text-center py-10 text-muted-foreground text-sm">
                  No patients found
                </td>
              </tr>
            ) : (
              filtered.map((patient: any) => (
                <tr key={patient._id} className="hover:bg-muted/50 transition-colors">



                  {/* ID */}
                  <td className="px-3 py-2.5 border-b border-border">
                    <span className="text-xs font-mono text-muted-foreground">
                      {patient._id.slice(-5).toUpperCase()}
                    </span>
                  </td>

                  {/* Name */}
                  <td className="flex gap-2 items-center px-3 py-2.5 border-b border-border font-medium text-foreground">
                      {patient.profileImage ? (
                      <img
                        src={`http://localhost:80/uploads/${patient.profileImage}`}
                        className="w-8 h-8 rounded-full object-cover border border-border"
                      />
                    ) : (
                      <div className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center text-xs font-medium text-secondary-foreground border border-border">
                        {patient.fullName.split(' ').map((n: string) => n[0]).slice(0, 2).join('')}
                      </div>
                    )}
                    {patient.fullName}
                  </td>

                  {/* Phone */}
                  <td className="px-3 py-2.5 border-b border-border text-muted-foreground">
                    {patient.phone ?? '—'}
                  </td>

                  {/* Age */}
                  <td className="px-3 py-2.5 border-b border-border text-muted-foreground">
                    {patient.birthDate}
                  </td>

                  {/* Last Appointment */}
                  <td className="px-3 py-2.5 border-b border-border text-muted-foreground">
                    {patient.lastAppointment ? (
                      <span className="text-xs">{patient.lastAppointment}</span>
                    ) : (
                      <span className="text-xs text-muted-foreground">—</span>
                    )}
                  </td>

                  {/* Next Appointment */}
                  <td className="px-3 py-2.5 border-b border-border">
                    {patient.nextAppointment ? (
                      <span className="text-xs px-2 py-0.5 rounded-full bg-secondary text-secondary-foreground">
                        {patient.nextAppointment}
                      </span>
                    ) : (
                      <span className="text-xs text-muted-foreground">—</span>
                    )}
                  </td>

                  {/* Action */}
                  <td className="px-3 py-2.5 border-b border-border">
                    <a
                      href={`/patients/${patient._id}`}
                      className="text-xs px-3 py-1.5 rounded-md border border-primary text-primary hover:bg-secondary transition"
                    >
                      View
                    </a>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}