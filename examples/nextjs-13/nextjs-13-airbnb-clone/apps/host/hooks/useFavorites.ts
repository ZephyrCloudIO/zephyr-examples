import fetcher from '../libs/fetcher';
import { SafeListing } from '../types';
import useSWR from 'swr';

const useFavorites = () => {
  const { data, ...rest } = useSWR<SafeListing[]>('/api/favorites', fetcher);

  return {
    favorites: data ?? [],
    ...rest,
  };
};

export default useFavorites;
