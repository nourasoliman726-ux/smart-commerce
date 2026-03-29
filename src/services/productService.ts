import type { Product, ProductFilters } from "../types";
import { PRODUCTS_DATA } from "../data/products";

const getProducts = (): Product[] => {
  const saved = localStorage.getItem("db_products");
  if (!saved) {
    localStorage.setItem("db_products", JSON.stringify(PRODUCTS_DATA));
    return PRODUCTS_DATA;
  }
  return JSON.parse(saved);
};

const saveProducts = (products: Product[]) => {
  localStorage.setItem("db_products", JSON.stringify(products));
};

export const productService = {
  async getAll(): Promise<Product[]> {
    await new Promise((res) => setTimeout(res, 300));
    return getProducts();
  },

  async getById(id: string): Promise<Product> {
    await new Promise((res) => setTimeout(res, 200));
    const products = getProducts();
    const product = products.find((p) => p.id === id);
    if (!product) throw new Error("Product not found");
    return product;
  },

  async create(product: Omit<Product, "id">): Promise<Product> {
    const products = getProducts();
    const newProduct = { ...product, id: Date.now().toString() };
    saveProducts([...products, newProduct]);
    return newProduct;
  },

  async update(id: string, data: Partial<Product>): Promise<Product> {
    const products = getProducts();
    const index = products.findIndex((p) => p.id === id);
    if (index === -1) throw new Error("Product not found");
    products[index] = { ...products[index], ...data };
    saveProducts(products);
    return products[index];
  },

  async delete(id: string): Promise<void> {
    const products = getProducts();
    saveProducts(products.filter((p) => p.id !== id));
  },

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
          p.tags?.some((t) => t.toLowerCase().includes(q)),
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
    }
    return result;
  },
};
