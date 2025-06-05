import { useQuery, UseQueryResult } from '@tanstack/react-query';
import { iosenseService } from '../services/iosenseService';

interface UseMouldDataProps {
  masterDeviceId: string;
  sensorId: string;
  enabled?: boolean;
}

export const useMouldData = ({ 
  masterDeviceId, 
  sensorId, 
  enabled = true 
}: UseMouldDataProps): UseQueryResult<string[], Error> => {
  return useQuery({
    queryKey: ['mouldData', masterDeviceId, sensorId],
    queryFn: () => iosenseService.getMouldData(masterDeviceId, sensorId),
    enabled: enabled && !!masterDeviceId && !!sensorId,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 15 * 60 * 1000, // 15 minutes
    retry: 2,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 5000),
  });
};

export default useMouldData; 