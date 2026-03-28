import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import {
  Search,
  SlidersHorizontal,
  X,
  ChevronDown,
} from "lucide-react";
import Layout from "../components/layout/Layout";
import ProductCard from "../components/common/ProductCard";
import ProductSkeleton from "../components/common/ProductSkeleton";
import { useProducts } from "../hooks/useProducts";
import { useAppDispatch, useAppSelector } from "../store/hooks";
import { setFilters } from "../features/products/productsSlice";
import type { Category, ProductFilters } from "../types";

const CATEGORIES = [
  { label: "All", value: "all" },
  { label: "Electronics", value: "electronics", emoji: "📱" },
  { label: "Clothing", value: "clothing", emoji: "👕" },
  { label: "Sports", value: "sports", emoji: "⚽" },
  { label: "Books", value: "books", emoji: "📚" },
  { label: "Home", value: "home", emoji: "🏠" },
];

const SORT_OPTIONS = [
  { label: "Newest", value: "newest" },
  { label: "Price: Low to High", value: "price_asc" },
  { label: "Price: High to Low", value: "price_desc" },
  { label: "Top Rated", value: "rating" },
];

const ITEMS_PER_PAGE = 6;

export default function ProductsPage() {
  const dispatch = useAppDispatch();
  const [searchParams] = useSearchParams();
  const { filtered, loading } = useProducts();
  const filters = useAppSelector((state) => state.products.filters);

  const [filtersOpen, setFiltersOpen] = useState(false);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [priceRange, setPriceRange] = useState([0, 2000]);

  // Read category from URL params
  useEffect(() => {
    const cat = searchParams.get("category");
    if (cat) {
      dispatch(setFilters({ category: cat as Category }));
    }
  }, [searchParams]);

  // Search debounce
  useEffect(() => {
    const timer = setTimeout(() => {
      dispatch(setFilters({ search }));
      setPage(1);
    }, 400);
    return () => clearTimeout(timer);
  }, [search]);

  const handleFilter = (update: Partial<ProductFilters>) => {
    dispatch(setFilters(update));
    setPage(1);
  };

  const handlePriceApply = () => {
    handleFilter({ minPrice: priceRange[0], maxPrice: priceRange[1] });
  };

  const handleClearFilters = () => {
    dispatch(
      setFilters({
        category: "all",
        search: "",
        minPrice: undefined,
        maxPrice: undefined,
        minRating: undefined,
        sortBy: "newest",
      })
    );
    setSearch("");
    setPriceRange([0, 2000]);
    setPage(1);
  };

  // Pagination
  const totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE);
  const paginated = filtered.slice(
    (page - 1) * ITEMS_PER_PAGE,
    page * ITEMS_PER_PAGE
  );

  const hasActiveFilters =
    filters.category !== "all" ||
    filters.search ||
    filters.minPrice !== undefined ||
    filters.maxPrice !== undefined ||
    filters.minRating !== undefined;

  return (
    <Layout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">All Products</h1>
          <p className="text-white/40">
            {filtered.length} products found
          </p>
        </div>

        {/* Search + Sort Bar */}
        <div className="flex flex-col sm:flex-row gap-3 mb-6">
          {/* Search */}
          <div className="relative flex-1">
            <Search
              size={18}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-white/30"
            />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search products..."
              className="w-full bg-white/5 border border-white/10 rounded-xl pl-10 pr-4 py-3 text-white placeholder-white/30 focus:outline-none focus:border-purple-500 transition-all"
            />
            {search && (
              <button
                onClick={() => setSearch("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-white/30 hover:text-white"
              >
                <X size={16} />
              </button>
            )}
          </div>

          {/* Sort */}
          <div className="relative">
            <select
              value={filters.sortBy || "newest"}
              onChange={(e) =>
                handleFilter({
                  sortBy: e.target.value as ProductFilters["sortBy"],
                })
              }
              className="appearance-none bg-white/5 border border-white/10 rounded-xl px-4 py-3 pr-10 text-white/80 focus:outline-none focus:border-purple-500 transition-all cursor-pointer"
            >
              {SORT_OPTIONS.map((opt) => (
                <option
                  key={opt.value}
                  value={opt.value}
                  className="bg-slate-800"
                >
                  {opt.label}
                </option>
              ))}
            </select>
            <ChevronDown
              size={16}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-white/40 pointer-events-none"
            />
          </div>

          {/* Filter Toggle (Mobile) */}
          <button
            onClick={() => setFiltersOpen(!filtersOpen)}
            className={`flex items-center gap-2 px-4 py-3 rounded-xl border transition-all sm:hidden ${
              filtersOpen || hasActiveFilters
                ? "bg-purple-600/20 border-purple-500/50 text-purple-300"
                : "bg-white/5 border-white/10 text-white/70"
            }`}
          >
            <SlidersHorizontal size={18} />
            Filters
            {hasActiveFilters && (
              <span className="w-2 h-2 bg-purple-400 rounded-full" />
            )}
          </button>
        </div>

        <div className="flex gap-6">
          {/* Sidebar Filters */}
          <aside
            className={`${
              filtersOpen ? "block" : "hidden"
            } sm:block w-full sm:w-64 shrink-0`}
          >
            <div className="bg-white/5 border border-white/10 rounded-2xl p-5 space-y-6 sticky top-24">
              {/* Header */}
              <div className="flex items-center justify-between">
                <h3 className="text-white font-semibold flex items-center gap-2">
                  <SlidersHorizontal size={16} className="text-purple-400" />
                  Filters
                </h3>
                {hasActiveFilters && (
                  <button
                    onClick={handleClearFilters}
                    className="text-xs text-red-400 hover:text-red-300 transition-colors"
                  >
                    Clear all
                  </button>
                )}
              </div>

              {/* Categories */}
              <div>
                <p className="text-white/50 text-xs uppercase tracking-wider mb-3">
                  Category
                </p>
                <div className="space-y-1">
                  {CATEGORIES.map((cat) => (
                    <button
                      key={cat.value}
                      onClick={() =>
                        handleFilter({
                          category: cat.value as Category | "all",
                        })
                      }
                      className={`w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-all ${
                        filters.category === cat.value
                          ? "bg-purple-600/30 text-purple-300 border border-purple-500/30"
                          : "text-white/60 hover:text-white hover:bg-white/5"
                      }`}
                    >
                      {cat.emoji && <span>{cat.emoji}</span>}
                      {cat.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Price Range */}
              <div>
                <p className="text-white/50 text-xs uppercase tracking-wider mb-3">
                  Price Range
                </p>
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <div className="flex-1">
                      <label className="text-white/40 text-xs mb-1 block">
                        Min
                      </label>
                      <input
                        type="number"
                        value={priceRange[0]}
                        onChange={(e) =>
                          setPriceRange([+e.target.value, priceRange[1]])
                        }
                        className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-purple-500"
                      />
                    </div>
                    <span className="text-white/30 mt-5">—</span>
                    <div className="flex-1">
                      <label className="text-white/40 text-xs mb-1 block">
                        Max
                      </label>
                      <input
                        type="number"
                        value={priceRange[1]}
                        onChange={(e) =>
                          setPriceRange([priceRange[0], +e.target.value])
                        }
                        className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-purple-500"
                      />
                    </div>
                  </div>
                  <button
                    onClick={handlePriceApply}
                    className="w-full bg-purple-600/20 hover:bg-purple-600/30 border border-purple-500/30 text-purple-300 text-sm py-2 rounded-lg transition-all"
                  >
                    Apply Price
                  </button>
                </div>
              </div>

              {/* Rating */}
              <div>
                <p className="text-white/50 text-xs uppercase tracking-wider mb-3">
                  Min Rating
                </p>
                <div className="space-y-1">
                  {[4.5, 4, 3.5, 3].map((rating) => (
                    <button
                      key={rating}
                      onClick={() =>
                        handleFilter({
                          minRating:
                            filters.minRating === rating ? undefined : rating,
                        })
                      }
                      className={`w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-all ${
                        filters.minRating === rating
                          ? "bg-yellow-500/20 text-yellow-300 border border-yellow-500/30"
                          : "text-white/60 hover:text-white hover:bg-white/5"
                      }`}
                    >
                      <span>{"⭐".repeat(Math.floor(rating))}</span>
                      <span>{rating}+</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </aside>

          {/* Products Grid */}
          <div className="flex-1">
            {/* Active Filters Pills */}
            {hasActiveFilters && (
              <div className="flex flex-wrap gap-2 mb-4">
                {filters.category && filters.category !== "all" && (
                  <span className="flex items-center gap-1 bg-purple-600/20 border border-purple-500/30 text-purple-300 text-xs px-3 py-1.5 rounded-full">
                    {filters.category}
                    <button
                      onClick={() => handleFilter({ category: "all" })}
                      className="hover:text-white ml-1"
                    >
                      <X size={12} />
                    </button>
                  </span>
                )}
                {filters.minRating && (
                  <span className="flex items-center gap-1 bg-yellow-600/20 border border-yellow-500/30 text-yellow-300 text-xs px-3 py-1.5 rounded-full">
                    ⭐ {filters.minRating}+
                    <button
                      onClick={() => handleFilter({ minRating: undefined })}
                      className="hover:text-white ml-1"
                    >
                      <X size={12} />
                    </button>
                  </span>
                )}
                {(filters.minPrice !== undefined ||
                  filters.maxPrice !== undefined) && (
                  <span className="flex items-center gap-1 bg-green-600/20 border border-green-500/30 text-green-300 text-xs px-3 py-1.5 rounded-full">
                    ${filters.minPrice || 0} - ${filters.maxPrice || 2000}
                    <button
                      onClick={() =>
                        handleFilter({
                          minPrice: undefined,
                          maxPrice: undefined,
                        })
                      }
                      className="hover:text-white ml-1"
                    >
                      <X size={12} />
                    </button>
                  </span>
                )}
              </div>
            )}

            {/* Grid */}
            {loading ? (
              <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
                {Array(6)
                  .fill(0)
                  .map((_, i) => (
                    <ProductSkeleton key={i} />
                  ))}
              </div>
            ) : paginated.length === 0 ? (
              <EmptyState onClear={handleClearFilters} />
            ) : (
              <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
                {paginated.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            )}

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex items-center justify-center gap-2 mt-8">
                <button
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={page === 1}
                  className="px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-white/60 hover:text-white hover:bg-white/10 disabled:opacity-30 disabled:cursor-not-allowed transition-all text-sm"
                >
                  Previous
                </button>

                {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                  (p) => (
                    <button
                      key={p}
                      onClick={() => setPage(p)}
                      className={`w-9 h-9 rounded-xl text-sm font-medium transition-all ${
                        page === p
                          ? "bg-purple-600 text-white"
                          : "bg-white/5 border border-white/10 text-white/60 hover:text-white hover:bg-white/10"
                      }`}
                    >
                      {p}
                    </button>
                  )
                )}

                <button
                  onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                  disabled={page === totalPages}
                  className="px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-white/60 hover:text-white hover:bg-white/10 disabled:opacity-30 disabled:cursor-not-allowed transition-all text-sm"
                >
                  Next
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
}

// Empty State Component
function EmptyState({ onClear }: { onClear: () => void }) {
  return (
    <div className="flex flex-col items-center justify-center py-20 text-center">
      <div className="text-6xl mb-4">🔍</div>
      <h3 className="text-white text-xl font-semibold mb-2">
        No products found
      </h3>
      <p className="text-white/40 mb-6 max-w-sm">
        Try adjusting your filters or search term to find what you're looking
        for.
      </p>
      <button
        onClick={onClear}
        className="bg-purple-600 hover:bg-purple-500 text-white px-6 py-2.5 rounded-xl transition-all text-sm font-medium"
      >
        Clear all filters
      </button>
    </div>
  );
}