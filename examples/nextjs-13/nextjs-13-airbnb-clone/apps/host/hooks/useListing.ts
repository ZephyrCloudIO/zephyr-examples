import fetcher from '@/libs/fetcher';
import { SafeListing, SafeUser } from '@/types';
import useSWR from 'swr';

const useListing = (id?: string) => {
  const { data, ...rest } = useSWR<SafeListing & { user: SafeUser }>(
    '/api/listings/' + id,
    fetcher
  );

  return {
    listing: data,
    ...rest,
  };
};

export default useListing;
