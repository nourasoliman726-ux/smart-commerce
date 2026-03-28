

import { createSlice } from "@reduxjs/toolkit";  


import type { PayloadAction } from "@reduxjs/toolkit";  


import type { Product, ProductFilters } from "../../types";

interface ProductsState {
  items: Product[];
  recentlyViewed: Product[];
  filters: ProductFilters;
  loading: boolean;
  error: string | null;
}

const initialState: ProductsState = {
  items: [],
  recentlyViewed: JSON.parse(localStorage.getItem("recentlyViewed") || "[]"),
  filters: { category: "all", sortBy: "newest" },
  loading: false,
  error: null,
};

const productsSlice = createSlice({
  name: "products",
  initialState,
  reducers: {
    setProducts(state, action: PayloadAction<Product[]>) {
      state.items = action.payload;
    },
    setFilters(state, action: PayloadAction<Partial<ProductFilters>>) {
      state.filters = { ...state.filters, ...action.payload };
    },
    addToRecentlyViewed(state, action: PayloadAction<Product>) {
      const filtered = state.recentlyViewed.filter(
        (p) => p.id !== action.payload.id,
      );
      state.recentlyViewed = [action.payload, ...filtered].slice(0, 10);
      localStorage.setItem(
        "recentlyViewed",
        JSON.stringify(state.recentlyViewed),
      );
    },
    setLoading(state, action: PayloadAction<boolean>) {
      state.loading = action.payload;
    },
    setError(state, action: PayloadAction<string | null>) {
      state.error = action.payload;
    },
  },
});

export const {
  setProducts,
  setFilters,
  addToRecentlyViewed,
  setLoading,
  setError,
} = productsSlice.actions;
export default productsSlice.reducer;
