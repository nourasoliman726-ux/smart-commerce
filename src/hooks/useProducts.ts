import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "../store/hooks";
import { setProducts, setLoading, setError } from "../features/products/productsSlice";
import { productService } from "../services/productService";

export const useProducts = () => {
  const dispatch = useAppDispatch();
  const { items, loading, error, filters, recentlyViewed } = useAppSelector(
    (state) => state.products
  );

  useEffect(() => {
    if (items.length > 0) return; // avoid refetch
    const fetch = async () => {
      dispatch(setLoading(true));
      try {
        const data = await productService.getAll();
        dispatch(setProducts(data));
      } catch {
        dispatch(setError("Failed to load products"));
      } finally {
        dispatch(setLoading(false));
      }
    };
    fetch();
  }, []);

  const filtered = productService.filterProducts(items, filters);

  return { products: items, filtered, loading, error, recentlyViewed };
};