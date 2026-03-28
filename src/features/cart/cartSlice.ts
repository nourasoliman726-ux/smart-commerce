
import { createSlice } from "@reduxjs/toolkit"; 
import type { PayloadAction } from "@reduxjs/toolkit"; 

import type { CartItem, Product } from "../../types"; 

interface CartState {
  items: CartItem[];
  couponCode: string;
  discount: number;
}

const savedCart = localStorage.getItem("cart");

const initialState: CartState = {
  items: savedCart ? JSON.parse(savedCart) : [],
  couponCode: "",
  discount: 0,
};

const saveCart = (items: CartItem[]) => {
  localStorage.setItem("cart", JSON.stringify(items));
};

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    addToCart(state, action: PayloadAction<Product>) {
      const existing = state.items.find(
        (i) => i.product.id === action.payload.id,
      );
      if (existing) {
        existing.quantity += 1;
      } else {
        state.items.push({ product: action.payload, quantity: 1 });
      }
      saveCart(state.items);
    },
    removeFromCart(state, action: PayloadAction<string>) {
      state.items = state.items.filter((i) => i.product.id !== action.payload);
      saveCart(state.items);
    },
    updateQuantity(
      state,
      action: PayloadAction<{ productId: string; quantity: number }>,
    ) {
      const item = state.items.find(
        (i) => i.product.id === action.payload.productId,
      );
      if (item) {
        item.quantity = action.payload.quantity;
        saveCart(state.items);
      }
    },
    applyCoupon(state, action: PayloadAction<string>) {
      const validCoupons: Record<string, number> = {
        SAVE10: 10,
        SAVE20: 20,
        WELCOME: 15,
      };
      const discount = validCoupons[action.payload.toUpperCase()];
      if (discount) {
        state.couponCode = action.payload;
        state.discount = discount;
      }
    },
    clearCart(state) {
      state.items = [];
      state.couponCode = "";
      state.discount = 0;
      localStorage.removeItem("cart");
    },
  },
});

export const {
  addToCart,
  removeFromCart,
  updateQuantity,
  applyCoupon,
  clearCart,
} = cartSlice.actions;
export default cartSlice.reducer;
