import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { scheduleService } from '../services/schedule.service' 
import { CreateScheduleDto } from '../types/schedule.types' 

export const useDoctorSchedule = (doctorId: string) => useQuery({
  queryKey: ['schedule', doctorId],
  queryFn: () => scheduleService.getByDoctor(doctorId),
  enabled: !!doctorId,
  retry: false,
})

export const useUpsertSchedule = (doctorId: string) => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (dto: CreateScheduleDto) => scheduleService.upsert(doctorId, dto),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['schedule', doctorId] })
    },
  })
}

export const useAvailableSlots = (doctorId: string, date: string) => useQuery({
  queryKey: ['slots', doctorId, date],
  queryFn: () => scheduleService.getAvailableSlots(doctorId, date),
  enabled: !!doctorId && !!date,
})