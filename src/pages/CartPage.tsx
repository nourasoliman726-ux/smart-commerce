import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  ShoppingCart,
  Trash2,
  Minus,
  Plus,
  Tag,
  ArrowRight,
  ShoppingBag,
} from "lucide-react";
import Layout from "../components/layout/Layout";
import { useAppDispatch, useAppSelector } from "../store/hooks";
import {
  removeFromCart,
  updateQuantity,
  applyCoupon,
} from "../features/cart/cartSlice";
import toast from "react-hot-toast";

export default function CartPage() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { items, discount, couponCode } = useAppSelector((state) => state.cart);
  const [couponInput, setCouponInput] = useState("");

  // const subtotal = items.reduce(
  //   (acc, i) => acc + i.product.price * i.quantity,
  //   0
  // );

  const subtotal = items.reduce(
  (acc, i) => acc + (i.product?.price || 0) * i.quantity,
  0
);

  const discountAmount = (subtotal * discount) / 100;
  const total = subtotal - discountAmount;

  const handleApplyCoupon = () => {
    if (!couponInput.trim()) return;
    const valid: Record<string, number> = {
      SAVE10: 10,
      SAVE20: 20,
      WELCOME: 15,
    };
    if (valid[couponInput.toUpperCase()]) {
      dispatch(applyCoupon(couponInput));
      toast.success(`Coupon applied! ${valid[couponInput.toUpperCase()]}% off 🎉`);
    } else {
      toast.error("Invalid coupon code");
    }
  };

  if (items.length === 0) {
    return (
      <Layout>
        <div className="max-w-7xl mx-auto px-4 py-20 flex flex-col items-center justify-center text-center">
          <div className="w-24 h-24 bg-white/5 border border-white/10 rounded-3xl flex items-center justify-center mb-6">
            <ShoppingCart size={40} className="text-white/20" />
          </div>
          <h2 className="text-2xl font-bold text-white mb-3">
            Your cart is empty
          </h2>
          <p className="text-white/40 mb-8 max-w-sm">
            Looks like you haven't added anything yet. Start shopping!
          </p>
          <Link
            to="/products"
            className="flex items-center gap-2 bg-purple-600 hover:bg-purple-500 text-white font-semibold px-6 py-3 rounded-xl transition-all"
          >
            <ShoppingBag size={18} />
            Browse Products
          </Link>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-3xl font-bold text-white mb-8">
          Shopping Cart{" "}
          <span className="text-white/30 text-xl font-normal">
            ({items.length} items)
          </span>
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-4">
            {items.map((item) => (
              <div
                key={item.product.id}
                className="bg-white/5 border border-white/10 rounded-2xl p-4 flex gap-4 hover:border-white/20 transition-all"
              >
                {/* Image */}
                <Link to={`/products/${item.product.id}`}>
                  <img
                    src={item.product.images[0]}
                    alt={item.product.name}
                    className="w-24 h-24 object-cover rounded-xl bg-white/5"
                  />
                </Link>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <p className="text-white/40 text-xs uppercase tracking-wider mb-1">
                        {item.product.category}
                      </p>
                      <Link to={`/products/${item.product.id}`}>
                        <h3 className="text-white font-semibold text-sm hover:text-purple-300 transition-colors line-clamp-2">
                          {item.product.name}
                        </h3>
                      </Link>
                    </div>
                    <button
                      onClick={() => {
                        dispatch(removeFromCart(item.product.id));
                        toast.success("Removed from cart");
                      }}
                      className="text-white/30 hover:text-red-400 transition-colors shrink-0"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>

                  <div className="flex items-center justify-between mt-3">
                    {/* Quantity */}
                    <div className="flex items-center gap-2 bg-white/5 border border-white/10 rounded-lg p-1">
                      <button
                        onClick={() =>
                          item.quantity > 1
                            ? dispatch(
                                updateQuantity({
                                  productId: item.product.id,
                                  quantity: item.quantity - 1,
                                })
                              )
                            : dispatch(removeFromCart(item.product.id))
                        }
                        className="w-7 h-7 flex items-center justify-center rounded-md hover:bg-white/10 text-white/60 hover:text-white transition-all"
                      >
                        <Minus size={14} />
                      </button>
                      <span className="text-white font-medium w-6 text-center text-sm">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() =>
                          dispatch(
                            updateQuantity({
                              productId: item.product.id,
                              quantity: item.quantity + 1,
                            })
                          )
                        }
                        className="w-7 h-7 flex items-center justify-center rounded-md hover:bg-white/10 text-white/60 hover:text-white transition-all"
                      >
                        <Plus size={14} />
                      </button>
                    </div>

                    {/* Price */}
                    <div className="text-right">
                      <p className="text-white font-bold">
                        ${(item.product.price * item.quantity).toFixed(2)}
                      </p>
                      {item.quantity > 1 && (
                        <p className="text-white/30 text-xs">
                          ${item.product.price} each
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white/5 border border-white/10 rounded-2xl p-6 sticky top-24">
              <h2 className="text-white font-bold text-lg mb-6">
                Order Summary
              </h2>

              {/* Coupon */}
              <div className="mb-6">
                <label className="text-white/50 text-xs uppercase tracking-wider mb-2 block">
                  Coupon Code
                </label>
                <div className="flex gap-2">
                  <div className="relative flex-1">
                    <Tag
                      size={15}
                      className="absolute left-3 top-1/2 -translate-y-1/2 text-white/30"
                    />
                    <input
                      value={couponInput}
                      onChange={(e) => setCouponInput(e.target.value)}
                      placeholder="SAVE10, SAVE20..."
                      className="w-full bg-white/5 border border-white/10 rounded-xl pl-9 pr-3 py-2.5 text-white text-sm placeholder-white/20 focus:outline-none focus:border-purple-500 transition-all"
                    />
                  </div>
                  <button
                    onClick={handleApplyCoupon}
                    disabled={!!couponCode}
                    className="px-4 py-2.5 bg-purple-600/30 hover:bg-purple-600/50 disabled:opacity-40 border border-purple-500/30 text-purple-300 text-sm rounded-xl transition-all"
                  >
                    Apply
                  </button>
                </div>
                {couponCode && (
                  <p className="text-green-400 text-xs mt-2 flex items-center gap-1">
                    ✓ Coupon "{couponCode}" applied — {discount}% off
                  </p>
                )}
                <p className="text-white/20 text-xs mt-1">
                  Try: SAVE10, SAVE20, WELCOME
                </p>
              </div>

              {/* Breakdown */}
              <div className="space-y-3 mb-6">
                <div className="flex justify-between text-sm">
                  <span className="text-white/60">Subtotal</span>
                  <span className="text-white">${subtotal.toFixed(2)}</span>
                </div>
                {discount > 0 && (
                  <div className="flex justify-between text-sm">
                    <span className="text-green-400">
                      Discount ({discount}%)
                    </span>
                    <span className="text-green-400">
                      -${discountAmount.toFixed(2)}
                    </span>
                  </div>
                )}
                <div className="flex justify-between text-sm">
                  <span className="text-white/60">Shipping</span>
                  <span className="text-green-400">
                    {subtotal > 50 ? "Free" : "$9.99"}
                  </span>
                </div>
                <div className="border-t border-white/10 pt-3 flex justify-between">
                  <span className="text-white font-bold">Total</span>
                  <span className="text-white font-bold text-xl">
                    ${(total + (subtotal > 50 ? 0 : 9.99)).toFixed(2)}
                  </span>
                </div>
              </div>

              <button
                onClick={() => navigate("/checkout")}
                className="w-full flex items-center justify-center gap-2 bg-purple-600 hover:bg-purple-500 text-white font-semibold py-3.5 rounded-xl transition-all hover:shadow-lg hover:shadow-purple-900/50"
              >
                Proceed to Checkout
                <ArrowRight size={18} />
              </button>

              <Link
                to="/products"
                className="block text-center text-white/40 hover:text-white text-sm mt-4 transition-colors"
              >
                Continue Shopping
              </Link>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}