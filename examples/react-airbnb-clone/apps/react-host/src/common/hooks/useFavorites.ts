import { FAVORITES } from '../libs/axios';
import fetcher from '../libs/fetcher';
import { Listing } from '../types';
import useSWR from 'swr';

const useFavorites = () => {
  const { data, ...rest } = useSWR<Listing[]>(FAVORITES, fetcher);

  return {
    favorites: data ?? [],
    ...rest,
  };
};

export default useFavorites;
