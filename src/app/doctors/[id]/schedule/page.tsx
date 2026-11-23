'use client'

import { useEffect, useState } from 'react'
import { useDoctorSchedule, useUpsertSchedule } from '@/src/hooks/schedule.hook'
import { WorkingDay } from '@/src/types/doctors' 
import { useCurrentUser } from '@/src/hooks/useCurrentUser'
import { useParams } from 'next/navigation'
const DAYS: WorkingDay['day'][] = [
  'sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'
]

const DEFAULT_DAY = (day: WorkingDay['day']): WorkingDay => ({
  day,
  startTime: '09:00',
  endTime: '17:00',
  slotDuration: 30,
  maxAppointments: 16,
  isActive: false,
})



export default function SchedulePage() {
  const { id } = useParams<{ id: string }>();
  console.log("DOCTOR_ID ",id )
  const { data: schedule, isLoading } = useDoctorSchedule(id)
  const { mutate: save, isPending, isSuccess } = useUpsertSchedule(id)
    const user = useCurrentUser()

  const [workingDays, setWorkingDays] = useState<WorkingDay[]>(
    DAYS.map(day => DEFAULT_DAY(day))
  )

    if (!user || user.role !== 'doctor') return (
    <div className="flex items-center justify-center h-64 text-muted-foreground text-sm">
      Access denied. Doctors only.
    </div>
  )
  // لما تيجي البيانات من الـ API حطها بالـ state
  useEffect(() => {
    if (schedule?.workingDays) {
      setWorkingDays(
        DAYS.map(day => {
          const existing = schedule.workingDays.find(d => d.day === day)
          return existing ?? DEFAULT_DAY(day)
        })
      )
    }
  }, [schedule])

  const updateDay = (index: number, field: keyof WorkingDay, value: any) => {
    setWorkingDays(prev => prev.map((d, i) =>
      i === index ? { ...d, [field]: value } : d
    ))
  }

  const toggleDay = (index: number) => {
    setWorkingDays(prev => prev.map((d, i) =>
      i === index ? { ...d, isActive: !d.isActive } : d
    ))
  }

  const handleSave = () => {
    save({ workingDays })
  }

  const inputClass = "w-full px-2.5 py-1.5 border border-border rounded-lg text-sm bg-background text-foreground focus:outline-none focus:ring-1 focus:ring-ring disabled:opacity-40 disabled:cursor-not-allowed"

  if (isLoading) return (
    <div className="flex items-center justify-center h-64 text-muted-foreground text-sm">
      Loading schedule...
    </div>
  )

  return (
    <div className="p-6 bg-background min-h-screen">

      {/* Header */}
      <div className="mb-6">
        <h1 className="text-lg font-medium text-foreground">Manage Working Hours</h1>
        <p className="text-sm text-muted-foreground mt-1">Set your weekly schedule and appointment slots</p>
      </div>

      <div className="bg-card border border-border rounded-xl p-6">

        {/* Days Toggle */}
        <p className="text-xs font-semibold text-primary uppercase tracking-wide mb-4">
          Select Working Days
        </p>
        <div className="grid grid-cols-7 gap-2 mb-6">
          {workingDays.map((d, i) => (
            <button
              key={d.day}
              onClick={() => toggleDay(i)}
              className={`py-2 rounded-lg border text-xs font-medium capitalize transition ${
                d.isActive
                  ? 'border-primary bg-secondary text-primary'
                  : 'border-border bg-muted text-muted-foreground hover:border-border'
              }`}
            >
              {d.day.slice(0, 3)}
            </button>
          ))}
        </div>

        {/* Table Header */}
        <p className="text-xs font-semibold text-primary uppercase tracking-wide mb-3">
          Configure Hours
        </p>
        <div className="grid grid-cols-[120px_1fr_1fr_90px_90px_44px] gap-3 pb-2 border-b border-border mb-1">
          {['Day', 'Start Time', 'End Time', 'Slot (min)', 'Max Appts', 'Active'].map(h => (
            <p key={h} className="text-xs font-medium text-muted-foreground">{h}</p>
          ))}
        </div>

        {/* Rows */}
        {workingDays.map((d, i) => (
          <div
            key={d.day}
            className="grid grid-cols-[120px_1fr_1fr_90px_90px_44px] gap-3 items-center py-3 border-b border-border last:border-none"
          >
            {/* Day Name */}
            <div className="flex items-center gap-2">
              <div className={`w-1.5 h-1.5 rounded-full ${d.isActive ? 'bg-primary' : 'bg-border'}`}/>
              <span className="text-sm capitalize text-foreground">{d.day}</span>
            </div>

            {/* Start Time */}
            <input
              type="time"
              value={d.startTime}
              onChange={e => updateDay(i, 'startTime', e.target.value)}
              disabled={!d.isActive}
              className={inputClass}
            />

            {/* End Time */}
            <input
              type="time"
              value={d.endTime}
              onChange={e => updateDay(i, 'endTime', e.target.value)}
              disabled={!d.isActive}
              className={inputClass}
            />

            {/* Slot Duration */}
            <input
              type="number"
              value={d.slotDuration}
              onChange={e => updateDay(i, 'slotDuration', Number(e.target.value))}
              disabled={!d.isActive}
              min={10}
              max={120}
              className={inputClass}
            />

            {/* Max Appointments */}
            <input
              type="number"
              value={d.maxAppointments ?? ''}
              onChange={e => updateDay(i, 'maxAppointments', Number(e.target.value))}
              disabled={!d.isActive}
              min={1}
              className={inputClass}
            />

            {/* Toggle */}
            <button
              onClick={() => toggleDay(i)}
              className={`w-9 h-5 rounded-full transition-colors relative ${
                d.isActive ? 'bg-primary' : 'bg-border'
              }`}
            >
              <span className={`absolute top-0.5 w-4 h-4 rounded-full bg-white shadow transition-all ${
                d.isActive ? 'left-4' : 'left-0.5'
              }`}/>
            </button>
          </div>
        ))}
      </div>

      {/* Save */}
      <div className="flex items-center gap-4 mt-4">
        <button
          onClick={handleSave}
          disabled={isPending}
          className="px-6 py-2.5 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:opacity-90 disabled:opacity-60 transition"
        >
          {isPending ? 'Saving...' : 'Save Schedule'}
        </button>
        {isSuccess && (
          <span className="text-sm text-primary">✓ Schedule saved successfully!</span>
        )}
      </div>

    </div>
  )
}