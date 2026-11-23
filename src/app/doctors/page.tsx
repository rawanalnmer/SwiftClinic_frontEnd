'use client'

import { useState, useMemo } from 'react'
import { useDoctors } from '@/src/hooks/doctors.hook' 
import { Doctor } from '@/src/types/doctors'

export default function DoctorsPage() {
  const { data: doctors, isLoading, error } = useDoctors()

  const [search, setSearch] = useState({
    id: '', name: '', email: '', phone: '', specialization: '',
  })

  const filtered = useMemo(() => {
    if (!doctors) return []
    return doctors.filter(d =>
      d._id.toLowerCase().includes(search.id.toLowerCase()) &&
      d.fullName.toLowerCase().includes(search.name.toLowerCase()) &&
      d.email.toLowerCase().includes(search.email.toLowerCase()) &&
      d.phone.toLowerCase().includes(search.phone.toLowerCase()) &&
      (d.specialization ?? '').toLowerCase().includes(search.specialization.toLowerCase())
    )
  }, [doctors, search])

  const inputClass = "w-full px-2 py-1.5 text-xs border border-border rounded-md bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring"

  if (isLoading) return (
    <div className="flex items-center justify-center h-64 text-muted-foreground text-sm">
      Loading doctors...
    </div>
  )

  if (error) return (
    <div className="flex items-center justify-center h-64 text-destructive text-sm">
      Failed to load doctors.
    </div>
  )

  return (
    <div className="p-6">

      {/* Header */}
      <div className="flex items-center gap-3 mb-5">
        <h1 className="text-lg font-medium text-foreground">Doctors</h1>
        <span className="text-xs px-2.5 py-1 rounded-full bg-secondary text-secondary-foreground">
          {filtered.length} total
        </span>
      </div>

      {/* Table */}
      <div className="bg-card border border-border rounded-xl overflow-auto">
        <table className="w-full border-collapse text-sm min-w-[800px]">
          <thead>
            {/* Column Labels */}
            <tr className="bg-muted ">

              <th className="px-3 py-2.5 text-left text-xs font-medium text-muted-foreground border-b border-border">
                Doctor ID
              </th>
              <th className="px-3 py-2.5 text-left text-xs font-medium text-muted-foreground border-b border-border">
                Full Name
              </th>
              <th className="px-3 py-2.5 text-left text-xs font-medium text-muted-foreground border-b border-border">
                Email
              </th>
              <th className="px-3 py-2.5 text-left text-xs font-medium text-muted-foreground border-b border-border">
                Phone
              </th>
              <th className="px-3 py-2.5 text-left text-xs font-medium text-muted-foreground border-b border-border">
                Actions
              </th>

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
                <input className={inputClass} placeholder="Search email..."
                  value={search.email} onChange={e => setSearch({ ...search, email: e.target.value })}/>
              </th>
              <th className="px-2 py-1.5 border-b border-border">
                <input className={inputClass} placeholder="Search phone..."
                  value={search.phone} onChange={e => setSearch({ ...search, phone: e.target.value })}/>
              </th>
              <th className="px-2 py-1.5 border-b border-border"/>

            </tr>
          </thead>

          <tbody>
            {filtered.length === 0 ? (
              <tr>
                <td colSpan={8} className="text-center py-10 text-muted-foreground text-sm">
                  No doctors found
                </td>
              </tr>
            ) : (
              filtered.map((doctor: Doctor) => (
                <tr key={doctor._id} className="hover:bg-muted/50 transition-colors">

                  {/* ID */}
                  <td className="px-3 py-2.5 border-b border-border">

                   
                    <span className="text-xs font-mono text-muted-foreground">
                      {doctor._id.slice(-5).toUpperCase()}
                    </span>
                  </td>

                  {/* Name */}
                  <td className="px-3 py-2.5 border-b border-border text-muted-foreground">
                    <div className='flex items-center  gap-4'> 
                     {doctor.profileImage ? (
                      <img 
                        src={`http://localhost:80/uploads/${doctor.profileImage}`}
                        alt={doctor.fullName}
                        className="w-8 h-8 rounded-full object-cover"
                      />
                    ) : (
                      <div className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center text-xs font-medium text-secondary-foreground border border-border">
                        {doctor.fullName.split(' ').map(n => n[0]).slice(0, 2).join('')}
                      </div>
                    )}

                    {doctor.fullName}
                    </div>
                  </td>

                  {/* Email */}
                  <td className="px-3 py-2.5 border-b border-border text-muted-foreground">
                    {doctor.email}
                  </td>

                  {/* Phone */}
                  <td className="px-3 py-2.5 border-b border-border text-muted-foreground">
                    {doctor.phone}
                  </td>



                  {/* Action */}
                  <td className="px-3 py-2.5 border-b border-border">
                    <a href={`/doctors/${doctor._id}`}
                      className="text-xs px-3 py-1.5 rounded-md border border-primary text-primary hover:bg-secondary transition">
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