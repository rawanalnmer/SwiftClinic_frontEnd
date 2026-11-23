import { useQuery } from '@tanstack/react-query'
import { dashboardService } from '../services/dashboard.service' 

export const useAdminStats = () => useQuery({
  queryKey: ['admin-stats'],
  queryFn: dashboardService.getAdminStats,
  refetchInterval: 30000,
})
export const useDoctorStats = (doctorId: string) => useQuery({
  queryKey: ['doctor-stats', doctorId],
  queryFn: () => dashboardService.getDoctorStats(doctorId),
  enabled: !!doctorId,
  refetchInterval: 30000,
})