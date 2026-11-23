'use client'

import { usePendingUsers, useApproveUser, useRejectUser }  from '@/src/hooks/useAdmin'
import { PendingUser } from '@/src/types/auth.types' 
export default function AdminRequestsPage() {
  const { data: users, isLoading } = usePendingUsers()
  const { mutate: approve, isPending: approving } = useApproveUser()
  const { mutate: reject, isPending: rejecting } = useRejectUser()

  if (isLoading) return (
    <div className="flex items-center justify-center h-64 text-muted-foreground text-sm">
      Loading requests...
    </div>
  )

  return (
    <div className="p-6">

      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <h1 className="text-lg font-medium text-foreground">Registration Requests</h1>
        <span className="text-xs px-2.5 py-1 rounded-full bg-secondary text-secondary-foreground">
          {users?.length ?? 0} pending
        </span>
      </div>

      {users?.length === 0 ? (
        <div className="bg-card border border-border rounded-xl p-12 text-center text-muted-foreground text-sm">
          No pending requests
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          {users?.map((user: PendingUser) => (
            <div key={user._id} className="bg-card border border-border rounded-xl p-5">
              <div className="flex items-start justify-between">

                {/* Info */}
                <div className="flex items-center gap-4">
                  {user.profileImage ? (
                    <img
                      src={`http://localhost:80/uploads/${user.profileImage}`}
                      className="w-12 h-12 rounded-full object-cover border border-border"
                    />
                  ) : (
                    <div className="w-12 h-12 rounded-full bg-secondary flex items-center justify-center text-sm font-medium text-secondary-foreground">
                      {user.fullName.split(' ').map(n => n[0]).slice(0, 2).join('')}
                    </div>
                  )}
                  <div>
                    <p className="text-sm font-medium text-foreground">{user.fullName}</p>
                    <p className="text-xs text-muted-foreground mt-0.5">{user.email}</p>
                    <div className="flex items-center gap-2 mt-1.5">
                      <span className={`text-xs px-2 py-0.5 rounded-full ${
                        user.role === 'doctor'
                          ? 'bg-secondary text-secondary-foreground'
                          : 'bg-muted text-muted-foreground'
                      }`}>
                        {user.role}
                      </span>
                      <span className="text-xs text-muted-foreground">
                        {new Date(user.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex gap-2">
                  <button
                    onClick={() => approve(user._id)}
                    disabled={approving}
                    className="px-4 py-2 rounded-lg bg-primary text-primary-foreground text-xs font-medium hover:opacity-90 disabled:opacity-60 transition"
                  >
                    Approve
                  </button>
                  <button
                    onClick={() => reject(user._id)}
                    disabled={rejecting}
                    className="px-4 py-2 rounded-lg border border-destructive text-destructive text-xs font-medium hover:bg-destructive hover:text-destructive-foreground disabled:opacity-60 transition"
                  >
                    Reject
                  </button>
                </div>
              </div>

              {/* Extra Info for Doctors */}
              {user.role === 'doctor' && (
                <div className="grid grid-cols-3 gap-3 mt-4 pt-4 border-t border-border">
                  <div>
                    <p className="text-xs text-muted-foreground">University</p>
                    <p className="text-xs font-medium text-foreground mt-0.5">{user.university ?? '—'}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Experience</p>
                    <p className="text-xs font-medium text-foreground mt-0.5">{user.yearsOfExperience ? `${user.yearsOfExperience} yrs` : '—'}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Clinic</p>
                    <p className="text-xs font-medium text-foreground mt-0.5">{user.clinicLocationText ?? '—'}</p>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}