import { LISTINGS } from '../libs/axios';
import fetcher from '../libs/fetcher';
import useSWR from 'swr';

type Params = {
  userId?: string;
  guestCount?: number;
  roomCount?: number;
  bathroomCount?: number;
  locationValue?: string;
  category?: string;
};

const useListings = (params: Params = {}) => {
  const query = new URLSearchParams(castParams(params));

  const { data, ...rest } = useSWR(LISTINGS + '?' + query.toString(), fetcher);

  return {
    listings: data ?? [],
    ...rest,
  };
};

const castParams = ({ guestCount, roomCount, bathroomCount, ...rest }: Params) => ({
  ...rest,
  ...(guestCount && { guestCount: guestCount.toString() }),
  ...(roomCount && { roomCount: roomCount.toString() }),
  ...(bathroomCount && { bathroomCount: bathroomCount.toString() }),
});

export default useListings;
