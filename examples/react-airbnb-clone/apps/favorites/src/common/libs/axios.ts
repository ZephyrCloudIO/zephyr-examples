import deleteFavorite from '../actions/deleteFavorite';
import getCurrentUser from '../actions/getCurrentUser';
import getFavoriteListings from '../actions/getFavoriteListings';
import getListings from '../actions/getListings';
import saveFavorite from '../actions/saveFavorite';
import saveUser from '../actions/saveUser';

export const CURRENT_USER = '/api/current-user';
export const REGISTER = '/api/register';
export const LISTINGS = '/api/listings';
export const FAVORITES = '/api/favorites';

const axios = {
  get: async (url: string): Promise<{ data: any }> => {
    if (url === CURRENT_USER) return { data: getCurrentUser() };
    if (url === FAVORITES) return { data: getFavoriteListings() };
    if (url.startsWith(LISTINGS)) {
      const query = new URLSearchParams(url.split('?').pop());
      return { data: getListings(Object.fromEntries(query.entries())) };
    }
    return { data: undefined };
  },
  post: async (url: string, data?: any) => {
    if (url === REGISTER) return { data: saveUser(data) };
    if (url.startsWith(FAVORITES)) return { data: saveFavorite(url.split('/').pop()) };
    return { data: undefined };
  },
  delete: async (url: string) => {
    const id = url.split('/').pop();
    if (!id) return { data: undefined };
    if (url.startsWith(FAVORITES)) return { data: deleteFavorite(id) };
    return { data: undefined };
  },
};

export default axios;
