import {create} from 'zustand';

export type CartItem = {
  id: string;
  quantity: number;
  size: string;
  color: string;
};

type CartStore = {
  items: Array<CartItem>;
  addItem: (item: CartItem) => void;
  reset: () => void;
};

export const useCartStore = create<CartStore>(set => ({
  items: [],
  addItem: (item: CartItem) => set(state => ({items: [...state.items, item]})),
  reset: () => set({items: []}),
}));
