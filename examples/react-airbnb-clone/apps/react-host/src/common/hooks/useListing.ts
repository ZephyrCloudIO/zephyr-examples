import { LISTINGS } from '../libs/axios';
import fetcher from '../libs/fetcher';
import { Listing, User } from '../common/types';
import useSWR from 'swr';

const useListing = (id?: string) => {
  const { data, ...rest } = useSWR<Listing & { user: User }>(
    LISTINGS + '/' + id,
    fetcher,
  );

  return {
    listing: data,
    ...rest,
  };
};

export default useListing;
