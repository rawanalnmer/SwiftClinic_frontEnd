import { useQuery } from '@tanstack/react-query'
import { doctorsService } from '../services/doctors' 

export const useDoctors = () => useQuery({
  queryKey: ['doctors'],
  queryFn: doctorsService.getAll,
})

export const useDoctor = (id: string) => useQuery({
  queryKey: ['doctor', id],
  queryFn: () => doctorsService.getById(id),
  enabled: !!id,
})
export const useDoctorSchedule = (doctorId: string) => useQuery({
  queryKey: ['schedule', doctorId],
  queryFn: () => doctorsService.getSchedule(doctorId),
  enabled: !!doctorId,
})
export const useDoctorPatients = (doctorId: string) => useQuery({
  queryKey: ['doctor-patients', doctorId],
  queryFn: () => doctorsService.getDoctorPatients(doctorId),
  enabled: !!doctorId,
})