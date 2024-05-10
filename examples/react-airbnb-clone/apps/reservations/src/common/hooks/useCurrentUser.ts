import { CURRENT_USER } from '../libs/axios';
import fetcher from '../libs/fetcher';
import { User } from '../types';
import useSWR from 'swr';

const useCurrentUser = () => {
  const { data, ...rest } = useSWR<User, any, string>(CURRENT_USER, fetcher);

  return {
    currentUser: data,
    ...rest,
  };
};

export default useCurrentUser;
