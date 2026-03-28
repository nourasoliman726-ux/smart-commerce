import api from "./axios";
import type { Product, ProductFilters } from "../types";

export const productService = {
  async getAll(): Promise<Product[]> {
    const { data } = await api.get<Product[]>("/products");
    return data;
  },

  async getById(id: string): Promise<Product> {
    const { data } = await api.get<Product>(`/products/${id}`);
    return data;
  },

  async getByCategory(category: string): Promise<Product[]> {
    const { data } = await api.get<Product[]>(`/products?category=${category}`);
    return data;
  },

  async create(product: Omit<Product, "id">): Promise<Product> {
    const newProduct = { ...product, id: Date.now().toString() };
    const { data } = await api.post<Product>("/products", newProduct);
    return data;
  },

  async update(id: string, product: Partial<Product>): Promise<Product> {
    const { data } = await api.patch<Product>(`/products/${id}`, product);
    return data;
  },

  async delete(id: string): Promise<void> {
    await api.delete(`/products/${id}`);
  },

  // Filter + Sort locally (json-server محدود في الفلترة المركبة)
  filterProducts(products: Product[], filters: ProductFilters): Product[] {
    let result = [...products];

    if (filters.category && filters.category !== "all") {
      result = result.filter((p) => p.category === filters.category);
    }

    if (filters.search) {
      const q = filters.search.toLowerCase();
      result = result.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.description.toLowerCase().includes(q) ||
          p.tags?.some((t) => t.toLowerCase().includes(q))
      );
    }

    if (filters.minPrice !== undefined) {
      result = result.filter((p) => p.price >= filters.minPrice!);
    }

    if (filters.maxPrice !== undefined) {
      result = result.filter((p) => p.price <= filters.maxPrice!);
    }

    if (filters.minRating !== undefined) {
      result = result.filter((p) => p.rating >= filters.minRating!);
    }

    switch (filters.sortBy) {
      case "price_asc":
        result.sort((a, b) => a.price - b.price);
        break;
      case "price_desc":
        result.sort((a, b) => b.price - a.price);
        break;
      case "rating":
        result.sort((a, b) => b.rating - a.rating);
        break;
      default:
        break;
    }

    return result;
  },
};