import { useQuery, UseQueryResult } from '@tanstack/react-query';
import { iosenseService } from '../services/iosenseService';

interface UseMachineDataProps {
  planningDeviceId: string;
  selectedMould: string;
  enabled?: boolean;
}

export const useMachineData = ({ 
  planningDeviceId, 
  selectedMould, 
  enabled = true 
}: UseMachineDataProps): UseQueryResult<any[], Error> => {
  return useQuery({
    queryKey: ['machineData', planningDeviceId, selectedMould],
    queryFn: () => iosenseService.getMachineData(planningDeviceId, selectedMould),
    enabled: enabled && !!planningDeviceId && !!selectedMould,
    staleTime: 2 * 60 * 1000, // 2 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
    retry: 2,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 5000),
  });
};

export default useMachineData; 