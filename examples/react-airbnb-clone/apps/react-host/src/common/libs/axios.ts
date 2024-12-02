import deleteFavorite from '../actions/deleteFavorite';
import deleteListing from '../actions/deleteListings';
import deleteReservation from '../actions/deleteReservation';
import getCurrentUser from '../actions/getCurrentUser';
import getFavoriteListings from '../actions/getFavoriteListings';
import getListingById from '../actions/getListingById';
import getListings from '../actions/getListings';
import getReservations from '../actions/getReservations';
import saveFavorite from '../actions/saveFavorite';
import saveListing from '../actions/saveListing';
import saveReservation from '../actions/saveReservation';
import saveUser from '../actions/saveUser';

export const CURRENT_USER = '/api/current-user';
export const REGISTER = '/api/register';
export const LISTINGS = '/api/listings';
export const FAVORITES = '/api/favorites';
export const RESERVATIONS = '/api/reservations';

const axios = {
  get: async (url: string): Promise<{ data: any }> => {
    if (url === CURRENT_USER) return { data: getCurrentUser() };
    if (url === FAVORITES) return { data: getFavoriteListings() };
    if (url.startsWith(LISTINGS + '/'))
      return { data: getListingById({ listingId: url.split('/').pop() }) };
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
    if (url === LISTINGS) return { data: saveListing(data) };
    if (url === REGISTER) return { data: saveUser(data) };
    if (url.startsWith(FAVORITES)) return { data: saveFavorite(url.split('/').pop()) };
    if (url === RESERVATIONS) return { data: saveReservation(data) };
    return { data: undefined };
  },
  delete: async (url: string) => {
    const id = url.split('/').pop();
    if (!id) return { data: undefined };
    if (url.startsWith(LISTINGS)) return { data: deleteListing(id) };
    if (url.startsWith(REGISTER)) return { data: deleteReservation(id) };
    if (url.startsWith(FAVORITES)) return { data: deleteFavorite(id) };
    if (url.startsWith(RESERVATIONS)) return { data: deleteReservation(id) };
    return { data: undefined };
  },
};

export default axios;
