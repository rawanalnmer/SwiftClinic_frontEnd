'use client'

import { useState, useRef } from 'react'

interface Props {
  isOpen: boolean
  onClose: () => void
}

export default function SignUpDialog({ isOpen, onClose }: Props) {
  const [tab, setTab] = useState<'doctor' | 'patient'>('doctor')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [doctorForm, setDoctorForm] = useState({
    fullName: '', email: '', password:'',phone: '',
    age: '', yearsOfExperience: '',
    university: '', graduationYear: '',
    clinicLocationText: '', clinicLocationUrl: '',
  })

  const [patientForm, setPatientForm] = useState({
    fullName: '', email: '', phone: '',
    password: '', gender: 'male', birthDate: '',
  })

  const [doctorProfileImage, setDoctorProfileImage] = useState<File | null>(null)
  const [patientProfileImage, setPatientProfileImage] = useState<File | null>(null)
  const [certificateImage, setCertificateImage] = useState<File | null>(null)
  const profileRef = useRef<HTMLInputElement>(null)
  const certRef = useRef<HTMLInputElement>(null)

  if (!isOpen) return null

  const handleDoctorSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      const formData = new FormData()
      Object.entries(doctorForm).forEach(([k, v]) => formData.append(k, v))
      if (doctorProfileImage) formData.append('profileImage', doctorProfileImage)
      if (certificateImage) formData.append('certificateImage', certificateImage)

      const res = await fetch('http://localhost:80/auth/register/doctor', {
        method: 'POST',
        body: formData,
      })

      const data = await res.json()
      if (!res.ok) { setError(data.message || 'Registration failed'); return }

      setSuccess('Request submitted! Awaiting admin approval.')
    } catch {
      setError('Something went wrong. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const handlePatientSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      const formData = new FormData()
      Object.entries(patientForm).forEach(([k, v]) => formData.append(k, v))
      if (patientProfileImage) formData.append('profileImage', patientProfileImage)

      const res = await fetch('http://localhost:80/auth/register/patient', {
        method: 'POST',
        body: formData,
      })

      const data = await res.json()
      if (!res.ok) { setError(data.message || 'Registration failed'); return }

      setSuccess('Account created successfully!')
    } catch {
      setError('Something went wrong. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const inputClass = "w-full px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500"
  const labelClass = "text-xs text-gray-500 dark:text-gray-400 mb-1 block"

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm px-4"
      onClick={onClose}
    >
      <div
        className="w-full max-w-lg bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-2xl shadow-xl flex flex-col max-h-[550px]"
        onClick={e => e.stopPropagation()}
      >

        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 dark:border-gray-800 shrink-0">
          <div>
            <h2 className="text-base font-medium text-gray-900 dark:text-white">Create an account</h2>
            <p className="text-xs text-gray-500 dark:text-gray-400">Choose your account type</p>
          </div>
          <button
            onClick={onClose}
            className="w-7 h-7 flex items-center justify-center rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-400 text-sm transition"
          >✕</button>
        </div>

        {/* Tabs */}
        <div className="grid grid-cols-2 gap-3 px-6 pt-4 shrink-0">
          {(['doctor', 'patient'] as const).map(t => (
            <button
              key={t}
              onClick={() => { setTab(t); setError(''); setSuccess('') }}
              className={`flex flex-col items-center gap-2 p-3 rounded-xl border transition text-sm ${
                tab === t
                  ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 font-medium'
                  : 'border-gray-200 dark:border-gray-700 text-gray-500 hover:bg-gray-50 dark:hover:bg-gray-800'
              }`}
            >
              {t === 'doctor' ? (
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                  <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
                  <circle cx="9" cy="7" r="4"/>
                  <path d="M23 21v-2a4 4 0 0 0-3-3.87"/>
                  <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
                </svg>
              ) : (
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
                  <circle cx="12" cy="7" r="4"/>
                </svg>
              )}
              {t.charAt(0).toUpperCase() + t.slice(1)}
            </button>
          ))}
        </div>

        {/* Form */}
        <div className="overflow-y-auto max-h-[380px] scrollbar-thin scrollbar-thumb-primary/20 scrollbar-track-transparent hover:scrollbar-thumb-primary hover:scrollbar-track-muted/30 transition-all duration-200 px-6 py-4 flex-1">
          {/* Success */}
          {success && (
            <div className="mb-4 text-sm text-emerald-700 bg-emerald-50 dark:bg-emerald-950 dark:text-emerald-300 px-3 py-2 rounded-lg">
              {success}
            </div>
          )}

          {/* Error */}
          {error && (
            <div className="mb-4 text-sm text-red-500 bg-red-50 dark:bg-red-950 px-3 py-2 rounded-lg">
              {error}
            </div>
          )}

          {/* Doctor Form */}
          {tab === 'doctor' && (
            <form onSubmit={handleDoctorSubmit} className="flex flex-col gap-3">
              <p className="text-xs font-medium text-emerald-600 uppercase tracking-wide">Personal info</p>
              <div className="grid grid-cols-2 gap-3">

              <div className="flex flex-col gap-1">
                <label className={labelClass}>Full name (3 parts)</label>
                <input className={inputClass} placeholder="First Middle Last" value={doctorForm.fullName}
                  onChange={e => setDoctorForm({ ...doctorForm, fullName: e.target.value })} required />
              </div>
                  <div className="flex flex-col gap-1">
                  <label className={labelClass}>Phone</label>
                  <input className={inputClass} placeholder="+964 xxx xxx" value={doctorForm.phone}
                    onChange={e => setDoctorForm({ ...doctorForm, phone: e.target.value })} required />
                </div>
                </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="flex flex-col gap-1">
                  <label className={labelClass}>Email</label>
                  <input type="email" className={inputClass} placeholder="doctor@email.com" value={doctorForm.email}
                    onChange={e => setDoctorForm({ ...doctorForm, email: e.target.value })} required />
                </div>
                <div className="flex flex-col gap-1">
                <label className={labelClass}>Password</label>
                <input className={inputClass} placeholder="••••••••" value={doctorForm.password}
                  onChange={e => setDoctorForm({ ...doctorForm, password: e.target.value })} required />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="flex flex-col gap-1">
                  <label className={labelClass}>Age</label>
                  <input type="number" className={inputClass} placeholder="age" value={doctorForm.age}
                    onChange={e => setDoctorForm({ ...doctorForm, age: e.target.value })} required />
                </div>
                <div className="flex flex-col gap-1">
                  <label className={labelClass}>Years of experience</label>
                  <input type="number" className={inputClass} placeholder="Years" value={doctorForm.yearsOfExperience}
                    onChange={e => setDoctorForm({ ...doctorForm, yearsOfExperience: e.target.value })} required />
                </div>
              </div>

              <p className="text-xs font-medium text-emerald-600 uppercase tracking-wide pt-1">Education</p>

              <div className="grid grid-cols-2 gap-3">
                <div className="flex flex-col gap-1">
                  <label className={labelClass}>University</label>
                  <input className={inputClass} placeholder="University name" value={doctorForm.university}
                    onChange={e => setDoctorForm({ ...doctorForm, university: e.target.value })} required />
                </div>
                <div className="flex flex-col gap-1">
                  <label className={labelClass}>Graduation year</label>
                  <input type="number" className={inputClass} placeholder="2010" value={doctorForm.graduationYear}
                    onChange={e => setDoctorForm({ ...doctorForm, graduationYear: e.target.value })} required />
                </div>
              </div>

              <p className="text-xs font-medium text-emerald-600 uppercase tracking-wide pt-1">Clinic</p>

              <div className="flex flex-col gap-1">
                <label className={labelClass}>Clinic location</label>
                <input className={inputClass} placeholder="Street, City" value={doctorForm.clinicLocationText}
                  onChange={e => setDoctorForm({ ...doctorForm, clinicLocationText: e.target.value })} required />
              </div>

              <div className="flex flex-col gap-1">
                <label className={labelClass}>Clinic map link</label>
                <input type="url" className={inputClass} placeholder="https://maps.app.goo.gl/..." value={doctorForm.clinicLocationUrl}
                  onChange={e => setDoctorForm({ ...doctorForm, clinicLocationUrl: e.target.value })} />
              </div>

              <p className="text-xs font-medium text-emerald-600 uppercase tracking-wide pt-1">Documents</p>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className={labelClass}>Profile photo</label>
                  <div
                    onClick={() => profileRef.current?.click()}
                    className="border border-dashed border-gray-300 dark:border-gray-700 rounded-lg p-3 text-center text-xs text-gray-400 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800 transition"
                  >
                    {doctorProfileImage ? doctorProfileImage.name : '+ Upload photo'}
                  </div>
                  <input ref={profileRef} type="file" accept="image/*" className="hidden"
                    onChange={e => setDoctorProfileImage(e.target.files?.[0] || null)} />
                </div>
                <div>
                  <label className={labelClass}>Certificate</label>
                  <div
                    onClick={() => certRef.current?.click()}
                    className="border border-dashed border-gray-300 dark:border-gray-700 rounded-lg p-3 text-center text-xs text-gray-400 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800 transition"
                  >
                    {certificateImage ? certificateImage.name : '+ Upload certificate'}
                  </div>
                  <input ref={certRef} type="file" accept="image/*" className="hidden"
                    onChange={e => setCertificateImage(e.target.files?.[0] || null)} />
                </div>
              </div>

              <button type="submit" disabled={loading}
                className="mt-2 py-2.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 disabled:opacity-60 text-white text-sm font-medium transition">
                {loading ? 'Submitting...' : 'Submit request'}
              </button>
            </form>
          )}

          {/* Patient Form */}
          {tab === 'patient' && (
            <form onSubmit={handlePatientSubmit} className="flex flex-col gap-3">
              <div className="flex flex-col gap-1">
                <label className={labelClass}>Full name (3 parts)</label>
                <input className={inputClass} placeholder="First Middle Last" value={patientForm.fullName}
                  onChange={e => setPatientForm({ ...patientForm, fullName: e.target.value })} required />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="flex flex-col gap-1">
                  <label className={labelClass}>Email</label>
                  <input type="email" className={inputClass} placeholder="patient@email.com" value={patientForm.email}
                    onChange={e => setPatientForm({ ...patientForm, email: e.target.value })} required />
                </div>
                <div className="flex flex-col gap-1">
                  <label className={labelClass}>Phone</label>
                  <input className={inputClass} placeholder="+964 xxx xxx" value={patientForm.phone}
                    onChange={e => setPatientForm({ ...patientForm, phone: e.target.value })} required />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
              <div className="flex flex-col gap-1">
                <label className={labelClass}>Password</label>
                <input type="password" className={inputClass} placeholder="••••••••" value={patientForm.password}
                  onChange={e => setPatientForm({ ...patientForm, password: e.target.value })} required />
              </div>
                 <div className="flex flex-col gap-1">
                  <label className={labelClass}>Gender</label>
                  <select className={inputClass} value={patientForm.gender}
                    onChange={e => setPatientForm({ ...patientForm, gender: e.target.value })}>
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                  </select>
                </div>
                </div>

              <div className="grid grid-cols-2 gap-3">

                  <div>
                  <label className={labelClass}>Profile photo</label>
                  <div
                    onClick={() => profileRef.current?.click()}
                    className="border border-dashed border-gray-300 dark:border-gray-700 rounded-lg p-3 text-center text-xs text-gray-400 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800 transition"
                  >
                    {patientProfileImage ? patientProfileImage.name : '+ Upload photo'}
                  </div>
                  <input ref={profileRef} type="file" accept="image/*" className="hidden"
                    onChange={e => setPatientProfileImage(e.target.files?.[0] || null)} />
                </div>
                <div className="flex flex-col gap-1">
                  <label className={labelClass}>Date of birth</label>
                  <input type="date" className={inputClass} value={patientForm.birthDate}
                    onChange={e => setPatientForm({ ...patientForm, birthDate: e.target.value })} required />
                </div>
              </div>

              <button type="submit" disabled={loading}
                className="mt-2 py-2.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 disabled:opacity-60 text-white text-sm font-medium transition">
                {loading ? 'Creating account...' : 'Create account'}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  )
}