import {create} from 'zustand';
import {createJSONStorage, persist} from 'zustand/middleware';

import {MmkvStorage} from '../utils';
import {CartItem} from './cart';

export type Order = {
  id: string;
  user: string;
  items: Array<CartItem>;
  date: number;
};

type OrderStore = {
  orders: Array<Order>;
  addOrder: (user: string, items: Array<CartItem>) => void;
};

function generateId() {
  return `id${Math.random().toString(16).slice(2)}`;
}

export const useOrderStore = create<OrderStore>(
  // @ts-ignore
  persist(
    set => ({
      orders: [],
      addOrder: (user, items) =>
        set(state => ({
          orders: [
            ...state.orders,
            {id: generateId(), date: Date.now(), user, items},
          ],
        })),
    }),
    {
      name: 'order-store',
      storage: createJSONStorage(() => MmkvStorage),
    },
  ),
);
