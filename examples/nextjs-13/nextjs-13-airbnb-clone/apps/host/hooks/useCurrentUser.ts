import fetcher from '../libs/fetcher';
import { SafeUser } from '../types';
import useSWR from 'swr';

const useCurrentUser = () => {
  const { data, ...rest } = useSWR<SafeUser>('/api/current-user', fetcher);

  return {
    currentUser: data,
    ...rest,
  };
};

export default useCurrentUser;
