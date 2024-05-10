import { currentUserMock, usersMock } from './mocks';
import { User } from '../types';

export const CURRENT_USER_KEY = 'airbnb-current-user';

export default function getCurrentUser(): User | undefined {
  try {
    const localUser = localStorage.getItem(CURRENT_USER_KEY)

    if (localUser) return JSON.parse(localUser);
  
    localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(currentUserMock))

    return {
      ...currentUserMock,
      createdAt: currentUserMock.createdAt.toISOString(),
      updatedAt: currentUserMock.updatedAt.toISOString(),
      emailVerified: currentUserMock.emailVerified?.toISOString(),
    };
  } catch (error: any) {
    return;
  }
}
