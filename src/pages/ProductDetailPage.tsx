import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Star,
  ShoppingCart,
  Heart,
  ArrowLeft,
  Minus,
  Plus,
  Shield,
  Truck,
  RefreshCw,
} from "lucide-react";
import Layout from "../components/layout/Layout";
import ProductCard from "../components/common/ProductCard";
import { useAppDispatch, useAppSelector } from "../store/hooks";
import { addToCart } from "../features/cart/cartSlice";
import { toggleWishlist } from "../features/wishlist/wishlistSlice";
import { addToRecentlyViewed } from "../features/products/productsSlice";
import { productService } from "../services/productService";
import type { Product } from "../types";
import toast from "react-hot-toast";

export default function ProductDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);

  const products = useAppSelector((state) => state.products.items);
  const wishlistItems = useAppSelector((state) => state.wishlist.items);
  const isWishlisted = wishlistItems.some((p) => p.id === product?.id);

  useEffect(() => {
    const fetch = async () => {
      if (!id) return;
      setLoading(true);
      try {
        const data = await productService.getById(id);
        setProduct(data);
        dispatch(addToRecentlyViewed(data));
      } catch {
        toast.error("Product not found");
        navigate("/products");
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, [id]);

  const related = products
    .filter((p) => p.category === product?.category && p.id !== product?.id)
    .slice(0, 4);

  const discount = product?.originalPrice
    ? Math.round(
        ((product.originalPrice - product.price) / product.originalPrice) * 100
      )
    : 0;

  if (loading) {
    return (
      <Layout>
        <div className="max-w-7xl mx-auto px-4 py-12">
          <div className="animate-pulse grid grid-cols-1 md:grid-cols-2 gap-10">
            <div className="aspect-square bg-white/10 rounded-2xl" />
            <div className="space-y-4">
              <div className="h-6 bg-white/10 rounded w-1/3" />
              <div className="h-8 bg-white/10 rounded w-2/3" />
              <div className="h-4 bg-white/10 rounded w-full" />
              <div className="h-4 bg-white/10 rounded w-4/5" />
              <div className="h-10 bg-white/10 rounded w-1/3 mt-6" />
              <div className="h-12 bg-white/10 rounded mt-4" />
            </div>
          </div>
        </div>
      </Layout>
    );
  }

  if (!product) return null;

  return (
    <Layout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Back */}
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-white/50 hover:text-white mb-8 transition-colors group"
        >
          <ArrowLeft
            size={18}
            className="group-hover:-translate-x-1 transition-transform"
          />
          Back
        </button>

        {/* Main */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 mb-16">
          {/* Image */}
          <div className="relative">
            <div className="aspect-square rounded-2xl overflow-hidden bg-white/5 border border-white/10">
              <img
                src={product.images[0]}
                alt={product.name}
                className="w-full h-full object-cover"
              />
            </div>
            {discount > 0 && (
              <div className="absolute top-4 left-4 bg-red-500 text-white font-bold px-3 py-1.5 rounded-xl text-sm">
                -{discount}% OFF
              </div>
            )}
          </div>

          {/* Info */}
          <div className="flex flex-col">
            <p className="text-purple-400 text-sm font-medium uppercase tracking-wider mb-2">
              {product.category}
            </p>

            <h1 className="text-3xl font-bold text-white mb-4">
              {product.name}
            </h1>

            {/* Rating */}
            <div className="flex items-center gap-3 mb-4">
              <div className="flex items-center gap-1">
                {Array(5)
                  .fill(0)
                  .map((_, i) => (
                    <Star
                      key={i}
                      size={16}
                      className={
                        i < Math.floor(product.rating)
                          ? "text-yellow-400"
                          : "text-white/20"
                      }
                      fill={
                        i < Math.floor(product.rating)
                          ? "currentColor"
                          : "none"
                      }
                    />
                  ))}
              </div>
              <span className="text-white/80 font-medium">{product.rating}</span>
              <span className="text-white/40 text-sm">
                ({product.reviewsCount} reviews)
              </span>
            </div>

            <p className="text-white/60 leading-relaxed mb-6">
              {product.description}
            </p>

            {/* Tags */}
            {product.tags && (
              <div className="flex flex-wrap gap-2 mb-6">
                {product.tags.map((tag) => (
                  <span
                    key={tag}
                    className="bg-white/5 border border-white/10 text-white/50 text-xs px-3 py-1 rounded-full"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            )}

            {/* Price */}
            <div className="flex items-baseline gap-3 mb-6">
              <span className="text-4xl font-bold text-white">
                ${product.price}
              </span>
              {product.originalPrice && (
                <span className="text-white/30 text-xl line-through">
                  ${product.originalPrice}
                </span>
              )}
              {discount > 0 && (
                <span className="text-green-400 text-sm font-medium">
                  You save ${product.originalPrice! - product.price}
                </span>
              )}
            </div>

            {/* Stock */}
            <p
              className={`text-sm mb-6 ${
                product.stock > 10
                  ? "text-green-400"
                  : product.stock > 0
                  ? "text-orange-400"
                  : "text-red-400"
              }`}
            >
              {product.stock > 10
                ? "✓ In Stock"
                : product.stock > 0
                ? `⚠ Only ${product.stock} left`
                : "✗ Out of Stock"}
            </p>

            {/* Quantity */}
            <div className="flex items-center gap-4 mb-6">
              <p className="text-white/60 text-sm">Quantity:</p>
              <div className="flex items-center gap-3 bg-white/5 border border-white/10 rounded-xl p-1">
                <button
                  onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                  className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-white/10 text-white/60 hover:text-white transition-all"
                >
                  <Minus size={16} />
                </button>
                <span className="text-white font-medium w-8 text-center">
                  {quantity}
                </span>
                <button
                  onClick={() =>
                    setQuantity((q) => Math.min(product.stock, q + 1))
                  }
                  className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-white/10 text-white/60 hover:text-white transition-all"
                >
                  <Plus size={16} />
                </button>
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-3 mb-8">
              <button
                onClick={() => {
                  for (let i = 0; i < quantity; i++) {
                    dispatch(addToCart(product));
                  }
                  toast.success(`${quantity}x ${product.name} added to cart! 🛒`);
                }}
                disabled={product.stock === 0}
                className="flex-1 flex items-center justify-center gap-2 bg-purple-600 hover:bg-purple-500 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold py-3 rounded-xl transition-all hover:shadow-lg hover:shadow-purple-900/50"
              >
                <ShoppingCart size={20} />
                Add to Cart
              </button>

              <button
                onClick={() => {
                  dispatch(toggleWishlist(product));
                  toast.success(
                    isWishlisted ? "Removed from wishlist" : "Added to wishlist ❤️"
                  );
                }}
                className={`w-12 h-12 flex items-center justify-center rounded-xl border transition-all ${
                  isWishlisted
                    ? "bg-red-500/20 border-red-500/50 text-red-400"
                    : "bg-white/5 border-white/10 text-white/60 hover:border-red-500/50 hover:text-red-400"
                }`}
              >
                <Heart
                  size={20}
                  fill={isWishlisted ? "currentColor" : "none"}
                />
              </button>
            </div>

            {/* Guarantees */}
            <div className="grid grid-cols-3 gap-3">
              {[
                { icon: Truck, label: "Free Delivery" },
                { icon: Shield, label: "2 Year Warranty" },
                { icon: RefreshCw, label: "30-Day Returns" },
              ].map(({ icon: Icon, label }) => (
                <div
                  key={label}
                  className="flex flex-col items-center gap-1.5 bg-white/5 border border-white/10 rounded-xl p-3 text-center"
                >
                  <Icon size={18} className="text-purple-400" />
                  <span className="text-white/60 text-xs">{label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Related Products */}
        {related.length > 0 && (
          <div>
            <h2 className="text-2xl font-bold text-white mb-6">
              Related Products
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
              {related.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
}