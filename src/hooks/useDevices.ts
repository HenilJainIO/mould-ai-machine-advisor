import { useQuery, UseQueryResult } from '@tanstack/react-query';
import { iosenseService, DeviceOption } from '../services/iosenseService';

export const useDevices = (): UseQueryResult<DeviceOption[], Error> => {
  return useQuery({
    queryKey: ['devices'],
    queryFn: () => iosenseService.getDevices(),
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes (renamed from cacheTime in v5)
    retry: 3,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
  });
};

export default useDevices; 