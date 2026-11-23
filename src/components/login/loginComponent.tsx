"use client";

import { useState } from "react"
import { useLogin } from "@/src/hooks/auth.hook";
interface Props {
  isOpen: boolean
  onClose: () => void
}

export default function LoginDialog({ isOpen, onClose }: Props) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const { mutate: login, isPending, error } = useLogin()
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    login({ email, password })
  }
  const inputClass = "w-full px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500"
  const labelClass = "text-xs text-gray-500 dark:text-gray-400 mb-1 block"
  if (!isOpen) return null

  return (
    // Backdrop
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm px-4"
      onClick={onClose}
    >
      {/* Dialog */}
      <div
        className="w-full max-w-md bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-2xl p-8 shadow-xl"
        onClick={e => e.stopPropagation()}
      >

        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-lg font-medium text-gray-900 dark:text-white">Welcome back</h2>
            <p className="text-sm text-gray-500 dark:text-gray-400">Sign in to your account</p>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-500 transition"
          >
            ✕
          </button>
        </div>
        <form  onSubmit={handleSubmit} className="flex flex-col gap-4">

          {/* Email */}
          <div className="flex flex-col gap-1.5">
            <label className={labelClass}>Email</label>
            <input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="you@example.com"
              required
              className={inputClass}
            />
          </div>

          {/* Password */}
          <div className="flex flex-col gap-1.5">
            <label className={labelClass}>Password</label>
            <input
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              placeholder="••••••••"
              required
              className={inputClass}
            />
          </div>


          {/* Submit */}
          <button
            type="submit"
            disabled={isPending}
            className="mt-1 py-2.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 disabled:opacity-60 text-white text-sm font-medium transition"
          >
            {isPending ? 'Signing in...' : 'Sign in'}
          </button>

        </form>
      </div>
    </div>
  )
}