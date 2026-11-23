import { useMutation } from '@tanstack/react-query'
import { authService } from '../services/auth.service' 
import { LoginDto, RegisterDoctorDto, RegisterPatientDto } from '../types/auth.types'
import { useRouter } from 'next/navigation' 

export const useLogin = () => {
  const router = useRouter() 
  
  return useMutation({
    mutationFn: (dto: LoginDto) => authService.login(dto),
    onSuccess: (data) => {
      const user = data?.user ?? data
      // التوجيه للصفحة المطلوبة
      if (user?.role === 'admin') {
        router.push('/dashboard')
      } else if (user?.role === 'doctor') {
        router.push('/doctor-dashboard')
      } else if (user?.role === 'patient') {
        router.push('/doctors')
      } else {
        router.push('/dashboard')
      }
    },
  })
}

export const useRegisterPatient = () => useMutation({
  mutationFn: (dto: RegisterPatientDto) => authService.registerPatient(dto),
})

export const useRegisterDoctor = () => useMutation({
  mutationFn: (dto: RegisterDoctorDto) => authService.registerDoctor(dto),
})