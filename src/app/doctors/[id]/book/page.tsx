'use client'

import { useState, useMemo, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { useDoctor } from '@/src/hooks/doctors.hook'
import { useAvailableSlots } from '@/src/hooks/schedule.hook'
import { useCreateAppointment } from '@/src/hooks/appointment.hook'
import { useCurrentUser } from '@/src/hooks/useCurrentUser' 

const DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
const MONTHS = ['January','February','March','April','May','June','July','August','September','October','November','December']

export default function BookAppointmentPage() {
  const { id: doctorId } = useParams<{ id: string }>()
  const router = useRouter()
  const user = useCurrentUser()
const [mounted, setMounted] = useState(false)
useEffect(() => setMounted(true), [])
  const { data: doctor } = useDoctor(doctorId)
  const { mutate: createAppointment, isPending, isSuccess } = useCreateAppointment()

  const today = new Date()
  const [currentMonth, setCurrentMonth] = useState(today.getMonth())
  const [currentYear, setCurrentYear] = useState(today.getFullYear())
  const [selectedDate, setSelectedDate] = useState<string | null>(null)
  const [selectedTime, setSelectedTime] = useState<string | null>(null)
  const [reason, setReason] = useState('')

  const { data: slots } = useAvailableSlots(doctorId, selectedDate ?? '')

  // بناء الكالندر
  const calendarDays = useMemo(() => {
    const firstDay = new Date(currentYear, currentMonth, 1).getDay()
    const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate()
    const days: (number | null)[] = []
    for (let i = 0; i < firstDay; i++) days.push(null)
    for (let i = 1; i <= daysInMonth; i++) days.push(i)
    return days
  }, [currentMonth, currentYear])

  const prevMonth = () => {
    if (currentMonth === 0) { setCurrentMonth(11); setCurrentYear(y => y - 1) }
    else setCurrentMonth(m => m - 1)
  }

  const nextMonth = () => {
    if (currentMonth === 11) { setCurrentMonth(0); setCurrentYear(y => y + 1) }
    else setCurrentMonth(m => m + 1)
  }

  const isPast = (day: number) => {
    const date = new Date(currentYear, currentMonth, day)
    const t = new Date(); t.setHours(0,0,0,0)
    return date < t
  }

  const isToday = (day: number) =>
    day === today.getDate() &&
    currentMonth === today.getMonth() &&
    currentYear === today.getFullYear()

  const formatDate = (day: number) => {
    const d = String(day).padStart(2, '0')
    const m = String(currentMonth + 1).padStart(2, '0')
    return `${currentYear}-${m}-${d}`
  }

  const handleConfirm = () => {
    if (!selectedDate || !selectedTime || !user) return
    createAppointment({
      doctorId,
      patientId: user._id,
      date: selectedDate,
      time: selectedTime,
      reason: reason || undefined,
    }, {
      onSuccess: () => {
        setTimeout(() => router.push(`/doctors/${doctorId}`), 2000)
      }
    })
  }

  const initials = doctor?.fullName.split(' ').map(n => n[0]).slice(0, 2).join('') ?? ''

  if (isSuccess) return (
    <div className="flex flex-col items-center justify-center h-screen bg-background gap-4">
      <div className="w-16 h-16 rounded-full bg-secondary flex items-center justify-center">
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" className="text-primary">
          <polyline points="20 6 9 17 4 12"/>
        </svg>
      </div>
      <h2 className="text-lg font-medium text-foreground">Appointment Confirmed!</h2>
      <p className="text-sm text-muted-foreground">Redirecting to doctor profile...</p>
    </div>
  )

  return (
    <div className="p-6 bg-background min-h-screen">

      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <button
          onClick={() => router.back()}
          className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
            <path d="M19 12H5M12 5l-7 7 7 7"/>
          </svg>
          Back
        </button>
        <h1 className="text-lg font-medium text-foreground">Book Appointment</h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">

        {/* Left */}
        <div className="flex flex-col gap-4">

          {/* Doctor Info */}
          <div className="bg-card border border-border rounded-xl p-5">
            <p className="text-xs font-semibold text-primary uppercase tracking-wide mb-3">Doctor</p>
            <div className="flex items-center gap-3 p-3 bg-muted rounded-lg">
              {doctor?.profileImage ? (
                <img src={`http://localhost:80/uploads/${doctor.profileImage}`} className="w-11 h-11 rounded-full object-cover"/>
              ) : (
                <div className="w-11 h-11 rounded-full bg-secondary flex items-center justify-center text-sm font-medium text-secondary-foreground">
                  {initials}
                </div>
              )}
              <div>
                <p className="text-sm font-medium text-foreground">{doctor?.fullName}</p>
                <p className="text-xs text-muted-foreground mt-0.5">
                  {doctor?.specialization ?? 'General'} · {doctor?.clinicLocationText ?? ''}
                </p>
              </div>
            </div>
          </div>

          {/* Calendar */}
          <div className="bg-card border border-border rounded-xl p-5">
            <p className="text-xs font-semibold text-primary uppercase tracking-wide mb-4">Select Date</p>

            <div className="flex items-center justify-between mb-4">
              <button onClick={prevMonth} className="w-7 h-7 rounded-lg border border-border flex items-center justify-center text-muted-foreground hover:bg-muted transition">
                ‹
              </button>
              <span className="text-sm font-medium text-foreground">
                {MONTHS[currentMonth]} {currentYear}
              </span>
              <button onClick={nextMonth} className="w-7 h-7 rounded-lg border border-border flex items-center justify-center text-muted-foreground hover:bg-muted transition">
                ›
              </button>
            </div>

            <div className="grid grid-cols-7 gap-1 mb-2">
              {DAYS.map(d => (
                <div key={d} className="text-center text-xs text-muted-foreground py-1 font-medium">{d}</div>
              ))}
            </div>

            <div className="grid grid-cols-7 gap-1">
              {calendarDays.map((day, i) => (
                <div key={i}>
                  {day === null ? (
                    <div/>
                  ) : (
                    <button
                      disabled={isPast(day)}
                      onClick={() => {
                        setSelectedDate(formatDate(day))
                        setSelectedTime(null)
                      }}
                      className={`w-full h-8 rounded-lg text-xs transition ${
                        selectedDate === formatDate(day)
                          ? 'bg-primary text-primary-foreground font-medium'
                          : isToday(day)
                          ? 'border border-primary text-primary font-medium'
                          : isPast(day)
                          ? 'text-muted-foreground cursor-not-allowed opacity-40'
                          : 'hover:bg-secondary text-foreground'
                      }`}
                    >
                      {day}
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Time Slots */}
          {selectedDate && (
            <div className="bg-card border border-border rounded-xl p-5">
              <p className="text-xs font-semibold text-primary uppercase tracking-wide mb-4">
                Available Times
              </p>
              {!slots || slots.length === 0 ? (
                <p className="text-sm text-muted-foreground">No available slots for this day.</p>
              ) : (
                <div className="grid grid-cols-4 gap-2">
                  {slots.map(slot => (
                    <button
                      key={slot}
                      onClick={() => setSelectedTime(slot)}
                      className={`py-2 rounded-lg border text-xs transition ${
                        selectedTime === slot
                          ? 'bg-primary text-primary-foreground border-primary font-medium'
                          : 'border-border text-foreground hover:border-primary hover:bg-secondary'
                      }`}
                    >
                      {slot}
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Right - Summary */}
        <div className="bg-card border border-border rounded-xl p-5 h-fit">
          <p className="text-xs font-semibold text-primary uppercase tracking-wide mb-4">
            Appointment Summary
          </p>

          {[
            { label: 'Doctor', value: doctor?.fullName ?? '—' },
            { label: 'Specialization', value: doctor?.specialization ?? '—' },
            { label: 'Date', value: selectedDate ?? '—' },
            { label: 'Time', value: selectedTime ?? '—' },
            { label: 'Location', value: doctor?.clinicLocationText ?? '—' },
          ].map((item, i) => (
            <div key={i} className="flex justify-between py-2.5 border-b border-border last:border-none">
              <span className="text-xs text-muted-foreground">{item.label}</span>
              <span className="text-xs font-medium text-foreground">{item.value}</span>
            </div>
          ))}

          <div className="mt-4">
            <p className="text-xs font-semibold text-primary uppercase tracking-wide mb-2">
              Reason <span className="text-muted-foreground font-normal normal-case">(optional)</span>
            </p>
            <textarea
              value={reason}
              onChange={e => setReason(e.target.value)}
              rows={3}
              placeholder="Describe your symptoms..."
              className="w-full px-3 py-2 border border-border rounded-lg text-sm bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring resize-none"
            />
          </div>

          <button
            onClick={handleConfirm}
            disabled={!selectedDate || !selectedTime || isPending}
            className="w-full mt-4 py-2.5 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed transition"
          >
            {isPending ? 'Confirming...' : 'Confirm Appointment'}
          </button>

          {mounted && !user && (
            <p className="text-xs text-destructive text-center mt-2">
              Please login first to book an appointment
            </p>
          )}
        </div>
      </div>
    </div>)}