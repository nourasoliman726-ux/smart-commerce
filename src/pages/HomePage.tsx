import { Link } from "react-router-dom";
import { ArrowRight, Zap, Shield, Truck, Star } from "lucide-react";
import Layout from "../components/layout/Layout";
import ProductCard from "../components/common/ProductCard";
import ProductSkeleton from "../components/common/ProductSkeleton";
import { useAppSelector } from "../store/hooks";
import { useProducts } from "../hooks/useProducts";

export default function HomePage() {
  const { user } = useAppSelector((state) => state.auth);
  const { products, recentlyViewed, loading } = useProducts();

  // Smart recommendations: based on user interests
  const recommended = products
    .filter((p) =>
      user?.interests?.includes(p.category)
    )
    .slice(0, 4);

  // Featured: top rated
  const featured = [...products]
    .sort((a, b) => b.rating - a.rating)
    .slice(0, 8);

  const categories = [
    { label: "Electronics", emoji: "📱", value: "electronics" },
    { label: "Clothing", emoji: "👕", value: "clothing" },
    { label: "Sports", emoji: "⚽", value: "sports" },
    { label: "Books", emoji: "📚", value: "books" },
    { label: "Home", emoji: "🏠", value: "home" },
  ];

  return (
    <Layout>
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-purple-900/50 via-slate-900 to-slate-900" />
        <div className="absolute top-0 right-0 w-96 h-96 bg-purple-600/20 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-blue-600/10 rounded-full blur-3xl" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-32">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 bg-purple-600/20 border border-purple-500/30 rounded-full px-4 py-1.5 mb-6">
              <Zap size={14} className="text-purple-400" />
              <span className="text-purple-300 text-sm font-medium">
                Smart Commerce Platform
              </span>
            </div>

            <h1 className="text-4xl md:text-6xl font-bold text-white leading-tight mb-6">
              Shop Smarter,{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-blue-400">
                Live Better
              </span>
            </h1>

            <p className="text-white/60 text-lg mb-8 leading-relaxed">
              Discover products tailored to your interests. Smart recommendations,
              seamless checkout, and unbeatable deals await.
            </p>

            <div className="flex flex-wrap gap-4">
              <Link
                to="/products"
                className="flex items-center gap-2 bg-purple-600 hover:bg-purple-500 text-white font-semibold px-6 py-3 rounded-xl transition-all hover:shadow-lg hover:shadow-purple-900/50 hover:-translate-y-0.5"
              >
                Shop Now <ArrowRight size={18} />
              </Link>
              {user?.role === "admin" && (
                <Link
                  to="/dashboard"
                  className="flex items-center gap-2 bg-white/10 hover:bg-white/15 border border-white/20 text-white font-semibold px-6 py-3 rounded-xl transition-all"
                >
                  Go to Dashboard
                </Link>
              )}
            </div>

            {/* Stats */}
            <div className="flex flex-wrap gap-8 mt-12">
              {[
                { label: "Products", value: "10K+" },
                { label: "Happy Customers", value: "50K+" },
                { label: "5-Star Reviews", value: "99%" },
              ].map((stat) => (
                <div key={stat.label}>
                  <p className="text-2xl font-bold text-white">{stat.value}</p>
                  <p className="text-white/40 text-sm">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Features Bar */}
      <section className="border-y border-white/10 bg-white/5">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {[
              { icon: Truck, label: "Free Shipping", desc: "On orders over $50" },
              { icon: Shield, label: "Secure Payment", desc: "100% protected" },
              { icon: Star, label: "Top Rated", desc: "Curated products" },
            ].map(({ icon: Icon, label, desc }) => (
              <div key={label} className="flex items-center gap-3">
                <div className="w-10 h-10 bg-purple-600/20 rounded-xl flex items-center justify-center">
                  <Icon size={20} className="text-purple-400" />
                </div>
                <div>
                  <p className="text-white font-medium text-sm">{label}</p>
                  <p className="text-white/40 text-xs">{desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h2 className="text-2xl font-bold text-white mb-6">Browse Categories</h2>
        <div className="flex flex-wrap gap-3">
          {categories.map((cat) => (
            <Link
              key={cat.value}
              to={`/products?category=${cat.value}`}
              className="flex items-center gap-2 bg-white/5 hover:bg-purple-600/20 border border-white/10 hover:border-purple-500/50 rounded-xl px-4 py-2.5 transition-all group"
            >
              <span className="text-xl">{cat.emoji}</span>
              <span className="text-white/70 group-hover:text-purple-300 font-medium text-sm transition-colors">
                {cat.label}
              </span>
            </Link>
          ))}
        </div>
      </section>

      {/* Personalized Recommendations */}
      {recommended.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-2xl font-bold text-white">
                🧠 Recommended for You
              </h2>
              <p className="text-white/40 text-sm mt-1">
                Based on your interests
              </p>
            </div>
            <Link
              to="/products"
              className="text-purple-400 hover:text-purple-300 text-sm flex items-center gap-1 transition-colors"
            >
              View all <ArrowRight size={14} />
            </Link>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {recommended.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </section>
      )}

      {/* Featured Products */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold text-white">🔥 Featured Products</h2>
            <p className="text-white/40 text-sm mt-1">Top rated picks</p>
          </div>
          <Link
            to="/products"
            className="text-purple-400 hover:text-purple-300 text-sm flex items-center gap-1 transition-colors"
          >
            View all <ArrowRight size={14} />
          </Link>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {loading
            ? Array(8).fill(0).map((_, i) => <ProductSkeleton key={i} />)
            : featured.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
        </div>
      </section>

      {/* Recently Viewed */}
      {recentlyViewed.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
          <h2 className="text-2xl font-bold text-white mb-6">
            🕐 Recently Viewed
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {recentlyViewed.slice(0, 4).map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </section>
      )}
    </Layout>
  );
}