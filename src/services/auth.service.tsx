import api from '../lib/axios'
import { AuthResponse, LoginDto, MessageResponse, RegisterDoctorDto, RegisterPatientDto } from '../types/auth.types'
export const authService = {

login: async (dto: LoginDto): Promise<AuthResponse> => {
  const res = await api.post<AuthResponse>('/auth/login', dto)
  localStorage.setItem('accessToken', res.data.accessToken)
  localStorage.setItem('refreshToken', res.data.refreshToken)
  localStorage.setItem('user', JSON.stringify(res.data.user))
  return res.data
},
  registerPatient: async (dto: RegisterPatientDto): Promise<MessageResponse> => {
    if (dto.profileImage instanceof File) {
      const formData = new FormData()
      Object.entries(dto).forEach(([k, v]) => {
        if (v !== undefined && v !== null) formData.append(k, v as string | File)
      })
      const res = await api.post<MessageResponse>('/auth/register/patient', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      })
      return res.data
    }

    const res = await api.post<MessageResponse>('/auth/register/patient', dto)
    return res.data
  },

  registerDoctor: async (dto: RegisterDoctorDto): Promise<MessageResponse> => {
    const formData = new FormData()
    Object.entries(dto).forEach(([k, v]) => {
      if (v !== undefined && v !== null) formData.append(k, v as string)
    })
    const res = await api.post<MessageResponse>('/auth/register/doctor', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    })
    return res.data
  },

  logout: async (userId: string): Promise<void> => {
    await api.post(`/auth/logout/${userId}`)
    localStorage.clear()
  },
  
}
