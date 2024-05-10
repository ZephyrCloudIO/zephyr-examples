import { User } from '../common/types';
import { CURRENT_USER_KEY } from './getCurrentUser';

export default function saveUser(user: User) {
  localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(user));
  return true;
}