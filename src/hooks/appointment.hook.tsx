import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { appointmentService } from '../services/appointment.service' 
import { CreateAppointmentDto } from '../types/appointment.types' 

export const useCreateAppointment = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (dto: CreateAppointmentDto) => appointmentService.create(dto),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['appointments'] })
    },
  })
}

export const usePatientAppointments = (patientId: string) => useQuery({
  queryKey: ['appointments', 'patient', patientId],
  queryFn: () => appointmentService.getByPatient(patientId),
  enabled: !!patientId,
})

export const useDoctorAppointments = (doctorId: string) => useQuery({
  queryKey: ['appointments', 'doctor', doctorId],
  queryFn: () => appointmentService.getByDoctor(doctorId),
  enabled: !!doctorId,
})