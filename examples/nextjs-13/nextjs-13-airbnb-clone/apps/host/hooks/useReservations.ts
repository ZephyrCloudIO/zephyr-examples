import realFetch from '@/libs/fetcher';
import { SafeReservation } from '@/types';
import useSWR from 'swr';

type Params = {
  listingId?: string;
  userId?: string;
  authorId?: string;
};

const useReservations = (params: Params) => {
  const query = new URLSearchParams(params);
  const fetcher = Object.values(params).some(Boolean) ? realFetch : async () => undefined;

  const { data, ...rest } = useSWR<SafeReservation[]>('/api/reservations?' + query.toString(), fetcher);

  return {
    reservations: data ?? [],
    ...rest,
  };
};

export default useReservations;
