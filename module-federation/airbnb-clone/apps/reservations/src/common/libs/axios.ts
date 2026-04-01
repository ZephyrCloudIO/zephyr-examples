import deleteListing from '../actions/deleteListings';
import getCurrentUser from '../actions/getCurrentUser';
import getListings from '../actions/getListings';
import getReservations from '../actions/getReservations';
import saveUser from '../actions/saveUser';

export const CURRENT_USER = '/api/current-user';
export const REGISTER = '/api/register';
export const LISTINGS = '/api/listings';
export const FAVORITES = '/api/favorites';
export const RESERVATIONS = '/api/reservations';

const axios = {
  get: async (url: string): Promise<{ data: any }> => {
    if (url === CURRENT_USER) return { data: getCurrentUser() };
    if (url.startsWith(LISTINGS)) {
      const query = new URLSearchParams(url.split('?').pop());
      return { data: getListings(Object.fromEntries(query.entries())) };
    }
    if (url.startsWith(RESERVATIONS)) {
      const query = new URLSearchParams(url.split('?').pop());
      return { data: getReservations(Object.fromEntries(query.entries())) };
    }
    return { data: undefined };
  },
  post: async (url: string, data?: any) => {
    if (url === REGISTER) return { data: saveUser(data) };
    return { data: undefined };
  },
  delete: async (url: string) => {
    const id = url.split('/').pop();
    if (!id) return { data: undefined };
    if (url.startsWith(LISTINGS)) return { data: deleteListing(id) };
    return { data: undefined };
  },
};

export default axios;
