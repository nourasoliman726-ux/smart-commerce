import { Link } from "react-router-dom";
import { Heart, ShoppingCart, Star } from "lucide-react";
import type { Product } from "../../types";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import { addToCart } from "../../features/cart/cartSlice";
import { toggleWishlist } from "../../features/wishlist/wishlistSlice";
import toast from "react-hot-toast";

interface Props {
  product: Product;
}

export default function ProductCard({ product }: Props) {
  const dispatch = useAppDispatch();
  const wishlistItems = useAppSelector((state) => state.wishlist.items);
  const isWishlisted = wishlistItems.some((p) => p.id === product.id);

  const discount = product.originalPrice
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0;

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    dispatch(addToCart(product));
    toast.success(`${product.name} added to cart! 🛒`);
  };

  const handleWishlist = (e: React.MouseEvent) => {
    e.preventDefault();
    dispatch(toggleWishlist(product));
    toast.success(isWishlisted ? "Removed from wishlist" : "Added to wishlist ❤️");
  };

  return (
    <Link to={`/products/${product.id}`} className="group block">
      <div className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden hover:border-purple-500/50 hover:bg-white/8 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-purple-900/20">
        {/* Image */}
        <div className="relative overflow-hidden aspect-square">
          <img
            src={product.images[0]}
            alt={product.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
          {/* Badges */}
          <div className="absolute top-3 left-3 flex flex-col gap-1">
            {discount > 0 && (
              <span className="bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-lg">
                -{discount}%
              </span>
            )}
            {product.stock < 5 && (
              <span className="bg-orange-500 text-white text-xs font-bold px-2 py-1 rounded-lg">
                Only {product.stock} left!
              </span>
            )}
          </div>

          {/* Wishlist button */}
          <button
            onClick={handleWishlist}
            className={`absolute top-3 right-3 w-9 h-9 rounded-xl flex items-center justify-center transition-all ${
              isWishlisted
                ? "bg-red-500 text-white"
                : "bg-black/30 text-white/70 hover:bg-red-500 hover:text-white opacity-0 group-hover:opacity-100"
            }`}
          >
            <Heart size={16} fill={isWishlisted ? "currentColor" : "none"} />
          </button>
        </div>

        {/* Content */}
        <div className="p-4">
          <p className="text-white/40 text-xs uppercase tracking-wider mb-1">
            {product.category}
          </p>
          <h3 className="text-white font-semibold text-sm mb-2 line-clamp-2 group-hover:text-purple-300 transition-colors">
            {product.name}
          </h3>

          {/* Rating */}
          <div className="flex items-center gap-1 mb-3">
            <Star size={13} className="text-yellow-400" fill="currentColor" />
            <span className="text-white/80 text-xs font-medium">{product.rating}</span>
            <span className="text-white/30 text-xs">({product.reviewsCount})</span>
          </div>

          {/* Price + Cart */}
          <div className="flex items-center justify-between">
            <div>
              <span className="text-white font-bold text-lg">${product.price}</span>
              {product.originalPrice && (
                <span className="text-white/30 text-sm line-through ml-2">
                  ${product.originalPrice}
                </span>
              )}
            </div>
            <button
              onClick={handleAddToCart}
              className="w-9 h-9 bg-purple-600 hover:bg-purple-500 rounded-xl flex items-center justify-center transition-all hover:scale-110 active:scale-95"
            >
              <ShoppingCart size={16} className="text-white" />
            </button>
          </div>
        </div>
      </div>
    </Link>
  );
}