import { User } from "../types/auth.types" 

export const useCurrentUser = (): User | null => {
  if (typeof window === 'undefined') return null
  const user = localStorage.getItem('user')
  return user ? JSON.parse(user) : null
}