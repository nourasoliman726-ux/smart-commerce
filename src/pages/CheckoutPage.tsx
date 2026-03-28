import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  CreditCard,
  MapPin,
  CheckCircle,
  Loader2,
  ShieldCheck,
} from "lucide-react";
import Layout from "../components/layout/Layout";
import { useAppDispatch, useAppSelector } from "../store/hooks";
import { clearCart } from "../features/cart/cartSlice";
import { orderService } from "../services/orderService";
import toast from "react-hot-toast";

const checkoutSchema = z.object({
  fullName: z.string().min(2, "Full name is required"),
  email: z.string().email("Invalid email"),
  phone: z
    .string()
    .min(10, "Valid phone number required")
    .regex(/^[0-9+\s-]+$/, "Invalid phone number"),
  address: z.string().min(5, "Address is required"),
  city: z.string().min(2, "City is required"),
  cardName: z.string().min(2, "Cardholder name required"),
  cardNumber: z
    .string()
    .regex(/^\d{4}\s?\d{4}\s?\d{4}\s?\d{4}$/, "Invalid card number"),
  expiry: z
    .string()
    .regex(/^(0[1-9]|1[0-2])\/\d{2}$/, "Format: MM/YY"),
  cvv: z.string().regex(/^\d{3,4}$/, "Invalid CVV"),
});

type CheckoutFormData = z.infer<typeof checkoutSchema>;

export default function CheckoutPage() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const [step, setStep] = useState<"form" | "success">("form");
  const [loading, setLoading] = useState(false);

  const { items, discount } = useAppSelector((state) => state.cart);
  const { user } = useAppSelector((state) => state.auth);

  const subtotal = items.reduce(
    (acc, i) => acc + i.product.price * i.quantity,
    0
  );
  const discountAmount = (subtotal * discount) / 100;
  const shipping = subtotal > 50 ? 0 : 9.99;
  const total = subtotal - discountAmount + shipping;

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CheckoutFormData>({
    resolver: zodResolver(checkoutSchema),
    defaultValues: {
      fullName: user?.name || "",
      email: user?.email || "",
    },
  });

  const onSubmit = async (data: CheckoutFormData) => {
    if (!user) return;
    setLoading(true);
    try {
      await new Promise((res) => setTimeout(res, 1500)); // simulate payment
      await orderService.create(
        user.id,
        items,
        {
          fullName: data.fullName,
          email: data.email,
          phone: data.phone,
          address: data.address,
          city: data.city,
        },
        total
      );
      dispatch(clearCart());
      setStep("success");
    } catch {
      toast.error("Payment failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (step === "success") {
    return (
      <Layout>
        <div className="max-w-lg mx-auto px-4 py-20 text-center">
          <div className="w-24 h-24 bg-green-500/20 border border-green-500/30 rounded-3xl flex items-center justify-center mx-auto mb-6">
            <CheckCircle size={48} className="text-green-400" />
          </div>
          <h1 className="text-3xl font-bold text-white mb-3">
            Order Confirmed! 🎉
          </h1>
          <p className="text-white/50 mb-8">
            Thank you for your purchase! Your order has been placed successfully
            and will be delivered soon.
          </p>
          <div className="bg-white/5 border border-white/10 rounded-2xl p-6 mb-8 text-left space-y-3">
            <h3 className="text-white font-semibold mb-4">Order Summary</h3>
            {items.length === 0 ? (
              <p className="text-white/40 text-sm">Items processed ✓</p>
            ) : null}
            <div className="flex justify-between text-sm">
              <span className="text-white/60">Total Paid</span>
              <span className="text-white font-bold">${total.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-white/60">Estimated Delivery</span>
              <span className="text-green-400">3-5 Business Days</span>
            </div>
          </div>
          <button
            onClick={() => navigate("/")}
            className="w-full bg-purple-600 hover:bg-purple-500 text-white font-semibold py-3 rounded-xl transition-all"
          >
            Continue Shopping
          </button>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-3xl font-bold text-white mb-8">Checkout</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Form */}
          <div className="lg:col-span-2 space-y-6">
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              {/* Shipping Info */}
              <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
                <h2 className="text-white font-bold text-lg mb-5 flex items-center gap-2">
                  <MapPin size={20} className="text-purple-400" />
                  Shipping Information
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <FormField
                    label="Full Name"
                    error={errors.fullName?.message}
                    {...register("fullName")}
                    placeholder="John Doe"
                  />
                  <FormField
                    label="Email"
                    error={errors.email?.message}
                    {...register("email")}
                    placeholder="you@example.com"
                    type="email"
                  />
                  <FormField
                    label="Phone"
                    error={errors.phone?.message}
                    {...register("phone")}
                    placeholder="+1 234 567 8900"
                  />
                  <FormField
                    label="City"
                    error={errors.city?.message}
                    {...register("city")}
                    placeholder="New York"
                  />
                  <div className="sm:col-span-2">
                    <FormField
                      label="Address"
                      error={errors.address?.message}
                      {...register("address")}
                      placeholder="123 Main Street, Apt 4B"
                    />
                  </div>
                </div>
              </div>

              {/* Payment */}
              <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
                <h2 className="text-white font-bold text-lg mb-5 flex items-center gap-2">
                  <CreditCard size={20} className="text-purple-400" />
                  Payment Details
                </h2>

                <div className="bg-purple-600/10 border border-purple-500/20 rounded-xl p-3 mb-5 flex items-center gap-2">
                  <ShieldCheck size={16} className="text-purple-400" />
                  <p className="text-purple-300 text-xs">
                    Your payment info is encrypted and secure
                  </p>
                </div>

                <div className="space-y-4">
                  <FormField
                    label="Cardholder Name"
                    error={errors.cardName?.message}
                    {...register("cardName")}
                    placeholder="John Doe"
                  />
                  <FormField
                    label="Card Number"
                    error={errors.cardNumber?.message}
                    {...register("cardNumber")}
                    placeholder="1234 5678 9012 3456"
                    maxLength={19}
                  />
                  <div className="grid grid-cols-2 gap-4">
                    <FormField
                      label="Expiry Date"
                      error={errors.expiry?.message}
                      {...register("expiry")}
                      placeholder="MM/YY"
                      maxLength={5}
                    />
                    <FormField
                      label="CVV"
                      error={errors.cvv?.message}
                      {...register("cvv")}
                      placeholder="123"
                      maxLength={4}
                      type="password"
                    />
                  </div>
                </div>

                {/* Demo cards */}
                <div className="mt-4 bg-white/5 rounded-xl p-3">
                  <p className="text-white/40 text-xs mb-2">Demo card:</p>
                  <p className="text-white/60 text-xs font-mono">
                    4111 1111 1111 1111 | 12/26 | 123
                  </p>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading || items.length === 0}
                className="w-full flex items-center justify-center gap-2 bg-purple-600 hover:bg-purple-500 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold py-4 rounded-xl transition-all hover:shadow-lg hover:shadow-purple-900/50 text-lg"
              >
                {loading ? (
                  <>
                    <Loader2 size={22} className="animate-spin" />
                    Processing Payment...
                  </>
                ) : (
                  <>
                    <ShieldCheck size={22} />
                    Pay ${total.toFixed(2)}
                  </>
                )}
              </button>
            </form>
          </div>

          {/* Order Summary */}
          <div>
            <div className="bg-white/5 border border-white/10 rounded-2xl p-6 sticky top-24">
              <h2 className="text-white font-bold text-lg mb-5">
                Order Summary
              </h2>

              <div className="space-y-3 mb-5 max-h-64 overflow-y-auto pr-1">
                {items.map((item) => (
                  <div
                    key={item.product.id}
                    className="flex items-center gap-3"
                  >
                    <div className="relative">
                      <img
                        src={item.product.images[0]}
                        alt={item.product.name}
                        className="w-12 h-12 object-cover rounded-lg bg-white/5"
                      />
                      <span className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-purple-600 rounded-full text-white text-[10px] flex items-center justify-center font-bold">
                        {item.quantity}
                      </span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-white text-sm font-medium line-clamp-1">
                        {item.product.name}
                      </p>
                      <p className="text-white/40 text-xs">
                        ${item.product.price} × {item.quantity}
                      </p>
                    </div>
                    <p className="text-white text-sm font-medium">
                      ${(item.product.price * item.quantity).toFixed(2)}
                    </p>
                  </div>
                ))}
              </div>

              <div className="border-t border-white/10 pt-4 space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-white/60">Subtotal</span>
                  <span className="text-white">${subtotal.toFixed(2)}</span>
                </div>
                {discount > 0 && (
                  <div className="flex justify-between text-sm">
                    <span className="text-green-400">Discount</span>
                    <span className="text-green-400">
                      -${discountAmount.toFixed(2)}
                    </span>
                  </div>
                )}
                <div className="flex justify-between text-sm">
                  <span className="text-white/60">Shipping</span>
                  <span className={shipping === 0 ? "text-green-400" : "text-white"}>
                    {shipping === 0 ? "Free" : `$${shipping.toFixed(2)}`}
                  </span>
                </div>
                <div className="border-t border-white/10 pt-3 flex justify-between">
                  <span className="text-white font-bold">Total</span>
                  <span className="text-white font-bold text-xl">
                    ${total.toFixed(2)}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}

// Reusable Form Field
const FormField = ({
  label,
  error,
  ...props
}: {
  label: string;
  error?: string;
} & React.InputHTMLAttributes<HTMLInputElement>) => (
  <div>
    <label className="block text-white/60 text-sm mb-1.5">{label}</label>
    <input
      {...props}
      className={`w-full bg-white/5 border ${
        error ? "border-red-400/60" : "border-white/10"
      } rounded-xl px-4 py-3 text-white placeholder-white/20 focus:outline-none focus:border-purple-500 transition-all text-sm`}
    />
    {error && <p className="text-red-400 text-xs mt-1">⚠ {error}</p>}
  </div>
);