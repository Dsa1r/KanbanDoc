import { QueryClient } from '@tanstack/react-query'

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // البيانات تعتبر حديثة لمدة 5 دقائق
      gcTime: 24 * 60 * 60 * 1000, // الاحتفاظ بالكاش لمدة 24 ساعة
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
})