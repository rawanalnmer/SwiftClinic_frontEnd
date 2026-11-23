import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { adminService } from '../services/admin.service' 

export const usePendingUsers = () => useQuery({
  queryKey: ['pending-users'],
  queryFn: adminService.getPendingUsers,
})

export const useApproveUser = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => adminService.approveUser(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['pending-users'] }),
  })
}

export const useRejectUser = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => adminService.rejectUser(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['pending-users'] }),
  })
}