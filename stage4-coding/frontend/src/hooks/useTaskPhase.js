import { useQuery } from '@tanstack/react-query'
import {
  getTaskPhase,
  toApiStatus,
} from '../services/boardService.js'

export function useTaskPhase(taskId, status, enabled = true) {
  const apiStatus = toApiStatus(status)

  return useQuery({
    queryKey: ['taskPhase', taskId, apiStatus],

    queryFn: () => getTaskPhase(taskId, apiStatus),

    enabled: Boolean(taskId && apiStatus && enabled),

    staleTime: 5 * 60 * 1000,
  })
}