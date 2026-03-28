import { Link } from "react-router-dom";
import { Heart, ShoppingCart, Trash2 } from "lucide-react";
import Layout from "../components/layout/Layout";
import { useAppDispatch, useAppSelector } from "../store/hooks";
import { toggleWishlist } from "../features/wishlist/wishlistSlice";
import { addToCart } from "../features/cart/cartSlice";
import toast from "react-hot-toast";

export default function WishlistPage() {
  const dispatch = useAppDispatch();
  const { items } = useAppSelector((state) => state.wishlist);

  if (items.length === 0) {
    return (
      <Layout>
        <div className="max-w-7xl mx-auto px-4 py-20 text-center">
          <div className="w-24 h-24 bg-white/5 border border-white/10 rounded-3xl flex items-center justify-center mx-auto mb-6">
            <Heart size={40} className="text-white/20" />
          </div>
          <h2 className="text-2xl font-bold text-white mb-3">
            Your wishlist is empty
          </h2>
          <p className="text-white/40 mb-8">
            Save items you love to your wishlist.
          </p>
          <Link
            to="/products"
            className="bg-purple-600 hover:bg-purple-500 text-white font-semibold px-6 py-3 rounded-xl transition-all"
          >
            Browse Products
          </Link>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-3xl font-bold text-white mb-2">My Wishlist</h1>
        <p className="text-white/40 mb-8">{items.length} saved items</p>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {items.map((product) => (
            <div
              key={product.id}
              className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden hover:border-purple-500/40 transition-all group"
            >
              <Link to={`/products/${product.id}`}>
                <div className="aspect-square overflow-hidden">
                  <img
                    src={product.images[0]}
                    alt={product.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                </div>
              </Link>
              <div className="p-4">
                <p className="text-white/40 text-xs uppercase mb-1">
                  {product.category}
                </p>
                <Link to={`/products/${product.id}`}>
                  <h3 className="text-white text-sm font-semibold mb-2 line-clamp-2 hover:text-purple-300 transition-colors">
                    {product.name}
                  </h3>
                </Link>
                <p className="text-white font-bold mb-3">${product.price}</p>
                <div className="flex gap-2">
                  <button
                    onClick={() => {
                      dispatch(addToCart(product));
                      toast.success("Added to cart! 🛒");
                    }}
                    className="flex-1 flex items-center justify-center gap-1 bg-purple-600 hover:bg-purple-500 text-white text-xs font-medium py-2 rounded-lg transition-all"
                  >
                    <ShoppingCart size={13} />
                    Add to Cart
                  </button>
                  <button
                    onClick={() => {
                      dispatch(toggleWishlist(product));
                      toast.success("Removed from wishlist");
                    }}
                    className="w-8 h-8 flex items-center justify-center bg-red-500/10 hover:bg-red-500/20 border border-red-500/20 text-red-400 rounded-lg transition-all"
                  >
                    <Trash2 size={13} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </Layout>
  );
}