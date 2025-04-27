import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface CartItem {
  productId: string;
  title: string;
  image: string;
  price: number;
  quantity: number;
}

interface CartState {
  items: CartItem[];
  total: number;
}

// LocalStorage'dan mevcut sepet verilerini al
const loadCartState = (): CartState => {
  try {
    const serializedState = localStorage.getItem('cart');
    if (serializedState === null) {
      return {
        items: [],
        total: 0,
      };
    }
    return JSON.parse(serializedState);
  } catch {
    return {
      items: [],
      total: 0,
    };
  }
};

const initialState: CartState = loadCartState();

// Sepet verilerini LocalStorage'a kaydet
const saveCartState = (state: CartState) => {
  try {
    const serializedState = JSON.stringify(state);
    localStorage.setItem('cart', serializedState);
  } catch {
    // Hata durumunda işlem yapma
  }
};

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    increaseQuantity: (state, action: PayloadAction<string>) => {
      const item = state.items.find(item => item.productId === action.payload);
      if (item) {
        item.quantity += 1;
        state.total += item.price;
        saveCartState(state);
      }
    },
    decreaseQuantity: (state, action: PayloadAction<string>) => {
      const item = state.items.find(item => item.productId === action.payload);
      if (item && item.quantity > 1) {
        item.quantity -= 1;
        state.total -= item.price;
        saveCartState(state);
      }
    },
    removeFromCart: (state, action: PayloadAction<string>) => {
      state.items = state.items.filter(item => item.productId !== action.payload);
      state.total = state.items.reduce((acc, item) => acc + (item.price * item.quantity), 0);
      saveCartState(state);
    },
    addToCart: (state, action: PayloadAction<Omit<CartItem, 'quantity'>>) => {
      const existingItem = state.items.find(item => item.productId === action.payload.productId);
      if (existingItem) {
        existingItem.quantity += 1;
      } else {
        state.items.push({ ...action.payload, quantity: 1 });
      }
      state.total = state.items.reduce((acc, item) => acc + (item.price * item.quantity), 0);
      saveCartState(state);
    },
    updateQuantity: (state, action: PayloadAction<{ productId: string; type: 'increase' | 'decrease' }>) => {
      const item = state.items.find(item => item.productId === action.payload.productId);
      if (item) {
        if (action.payload.type === 'increase') {
          item.quantity += 1;
        } else if (action.payload.type === 'decrease' && item.quantity > 1) {
          item.quantity -= 1;
        }
        state.total = state.items.reduce((acc, item) => acc + (item.price * item.quantity), 0);
        saveCartState(state);
      }
    },
    clearCart: (state) => {
      state.items = [];
      state.total = 0;
      saveCartState(state);
    },
  },
});

export const { increaseQuantity, decreaseQuantity, removeFromCart, addToCart, updateQuantity, clearCart } = cartSlice.actions;
export default cartSlice.reducer;

// Selector'ı ekleyelim
export const selectCartItemsCount = (state: { cart: CartState }) => 
  state.cart.items.reduce((total, item) => total + item.quantity, 0); 