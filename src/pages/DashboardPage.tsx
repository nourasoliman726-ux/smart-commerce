import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  Package,
  ShoppingBag,
  TrendingUp,
  Plus,
  Pencil,
  Trash2,
  X,
  Loader2,
  BarChart3,
} from "lucide-react";
import Layout from "../components/layout/Layout";
import { useAppDispatch, useAppSelector } from "../store/hooks";
import { setProducts } from "../features/products/productsSlice";
import { productService } from "../services/productService";
import { orderService } from "../services/orderService";
import type { Product, Order, Category } from "../types";
import toast from "react-hot-toast";

const productSchema = z.object({
  name: z.string().min(2, "Name required"),
  description: z.string().min(10, "Description required"),
  price: z.coerce.number().min(1, "Price must be > 0"),
  originalPrice: z.coerce.number().optional(),
  category: z.enum(["electronics", "clothing", "books", "home", "sports"]),
  stock: z.coerce.number().min(0),
  rating: z.coerce.number().min(0).max(5),
  reviewsCount: z.coerce.number().min(0),
});

type ProductFormData = z.infer<typeof productSchema>;

export default function DashboardPage() {
  const dispatch = useAppDispatch();
  const products = useAppSelector((state) => state.products.items);
  const [orders, setOrders] = useState<Order[]>([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [editProduct, setEditProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<"products" | "orders">("products");

  useEffect(() => {
    orderService.getAll().then(setOrders).catch(console.error);
  }, []);

  const totalRevenue = orders.reduce((acc, o) => acc + o.total, 0);

  const stats = [
    {
      label: "Total Products",
      value: products.length,
      icon: Package,
      color: "purple",
    },
    {
      label: "Total Orders",
      value: orders.length,
      icon: ShoppingBag,
      color: "blue",
    },
    {
      label: "Revenue",
      value: `$${totalRevenue.toFixed(0)}`,
      icon: TrendingUp,
      color: "green",
    },
    {
      label: "Avg Order",
      value: orders.length
        ? `$${(totalRevenue / orders.length).toFixed(0)}`
        : "$0",
      icon: BarChart3,
      color: "orange",
    },
  ];

  const colorMap: Record<string, string> = {
    purple: "bg-purple-600/20 text-purple-400 border-purple-500/20",
    blue: "bg-blue-600/20 text-blue-400 border-blue-500/20",
    green: "bg-green-600/20 text-green-400 border-green-500/20",
    orange: "bg-orange-600/20 text-orange-400 border-orange-500/20",
  };

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ProductFormData>({ resolver: zodResolver(productSchema) });

  const openModal = (product?: Product) => {
    if (product) {
      setEditProduct(product);
      reset(product as any);
    } else {
      setEditProduct(null);
      reset({
        name: "",
        description: "",
        price: 0,
        category: "electronics",
        stock: 0,
        rating: 4.0,
        reviewsCount: 0,
      });
    }
    setModalOpen(true);
  };

  const onSubmit = async (data: ProductFormData) => {
    setLoading(true);
    try {
      if (editProduct) {
        const updated = await productService.update(editProduct.id, {
          ...data,
          images: editProduct.images,
        });
        dispatch(
          setProducts(products.map((p) => (p.id === updated.id ? updated : p)))
        );
        toast.success("Product updated ✓");
      } else {
        const created = await productService.create({
          ...data,
          images: [`https://picsum.photos/seed/${Date.now()}/400/400`],
          tags: [],
        });
        dispatch(setProducts([...products, created]));
        toast.success("Product created ✓");
      }
      setModalOpen(false);
    } catch {
      toast.error("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this product?")) return;
    try {
      await productService.delete(id);
      dispatch(setProducts(products.filter((p) => p.id !== id)));
      toast.success("Product deleted");
    } catch {
      toast.error("Failed to delete");
    }
  };

  return (
    <Layout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-white">Dashboard</h1>
            <p className="text-white/40 mt-1">Manage your store</p>
          </div>
          <button
            onClick={() => openModal()}
            className="flex items-center gap-2 bg-purple-600 hover:bg-purple-500 text-white font-semibold px-5 py-2.5 rounded-xl transition-all"
          >
            <Plus size={18} />
            Add Product
          </button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {stats.map(({ label, value, icon: Icon, color }) => (
            <div
              key={label}
              className="bg-white/5 border border-white/10 rounded-2xl p-5"
            >
              <div
                className={`w-10 h-10 rounded-xl border flex items-center justify-center mb-3 ${colorMap[color]}`}
              >
                <Icon size={20} />
              </div>
              <p className="text-2xl font-bold text-white">{value}</p>
              <p className="text-white/40 text-sm mt-1">{label}</p>
            </div>
          ))}
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-6">
          {(["products", "orders"] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-5 py-2 rounded-xl text-sm font-medium capitalize transition-all ${
                activeTab === tab
                  ? "bg-purple-600 text-white"
                  : "bg-white/5 text-white/60 hover:text-white hover:bg-white/10"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Products Table */}
        {activeTab === "products" && (
          <div className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-white/10">
                    {["Product", "Category", "Price", "Stock", "Rating", "Actions"].map(
                      (h) => (
                        <th
                          key={h}
                          className="text-left text-white/40 text-xs uppercase tracking-wider px-6 py-4 font-medium"
                        >
                          {h}
                        </th>
                      )
                    )}
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {products.map((product) => (
                    <tr
                      key={product.id}
                      className="hover:bg-white/5 transition-colors"
                    >
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <img
                            src={product.images[0]}
                            alt={product.name}
                            className="w-10 h-10 rounded-lg object-cover bg-white/5"
                          />
                          <span className="text-white text-sm font-medium line-clamp-1 max-w-[180px]">
                            {product.name}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="bg-white/10 text-white/60 text-xs px-2.5 py-1 rounded-lg capitalize">
                          {product.category}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-white font-medium text-sm">
                        ${product.price}
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={`text-sm font-medium ${
                            product.stock > 10
                              ? "text-green-400"
                              : product.stock > 0
                              ? "text-orange-400"
                              : "text-red-400"
                          }`}
                        >
                          {product.stock}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-yellow-400 text-sm">
                        ⭐ {product.rating}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => openModal(product)}
                            className="w-8 h-8 flex items-center justify-center bg-blue-600/20 hover:bg-blue-600/30 border border-blue-500/20 text-blue-400 rounded-lg transition-all"
                          >
                            <Pencil size={14} />
                          </button>
                          <button
                            onClick={() => handleDelete(product.id)}
                            className="w-8 h-8 flex items-center justify-center bg-red-600/20 hover:bg-red-600/30 border border-red-500/20 text-red-400 rounded-lg transition-all"
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Orders Table */}
        {activeTab === "orders" && (
          <div className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden">
            {orders.length === 0 ? (
              <div className="py-16 text-center">
                <ShoppingBag size={40} className="text-white/10 mx-auto mb-3" />
                <p className="text-white/40">No orders yet</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-white/10">
                      {["Order ID", "Customer", "Items", "Total", "Status", "Date"].map(
                        (h) => (
                          <th
                            key={h}
                            className="text-left text-white/40 text-xs uppercase tracking-wider px-6 py-4 font-medium"
                          >
                            {h}
                          </th>
                        )
                      )}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    {orders.map((order) => (
                      <tr key={order.id} className="hover:bg-white/5 transition-colors">
                        <td className="px-6 py-4 text-white/60 text-sm font-mono">
                          #{order.id.slice(-6)}
                        </td>
                        <td className="px-6 py-4 text-white text-sm">
                          {order.shippingAddress.fullName}
                        </td>
                        <td className="px-6 py-4 text-white/60 text-sm">
                          {order.items.length} items
                        </td>
                        <td className="px-6 py-4 text-white font-medium text-sm">
                          ${order.total.toFixed(2)}
                        </td>
                        <td className="px-6 py-4">
                          <span
                            className={`text-xs px-2.5 py-1 rounded-full font-medium ${
                              order.status === "delivered"
                                ? "bg-green-500/20 text-green-400"
                                : order.status === "shipped"
                                ? "bg-blue-500/20 text-blue-400"
                                : order.status === "processing"
                                ? "bg-yellow-500/20 text-yellow-400"
                                : "bg-white/10 text-white/60"
                            }`}
                          >
                            {order.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-white/40 text-sm">
                          {new Date(order.createdAt).toLocaleDateString()}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Product Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-black/70 backdrop-blur-sm"
            onClick={() => setModalOpen(false)}
          />
          <div className="relative bg-slate-900 border border-white/10 rounded-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-6 border-b border-white/10">
              <h2 className="text-white font-bold text-lg">
                {editProduct ? "Edit Product" : "Add New Product"}
              </h2>
              <button
                onClick={() => setModalOpen(false)}
                className="text-white/40 hover:text-white transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-4">
              <DashField label="Product Name" error={errors.name?.message}>
                <input
                  {...register("name")}
                  className="dash-input"
                  placeholder="iPhone 15 Pro"
                />
              </DashField>

              <DashField label="Description" error={errors.description?.message}>
                <textarea
                  {...register("description")}
                  rows={3}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-white/20 focus:outline-none focus:border-purple-500 transition-all text-sm resize-none"
                  placeholder="Product description..."
                />
              </DashField>

              <div className="grid grid-cols-2 gap-4">
                <DashField label="Price ($)" error={errors.price?.message}>
                  <input
                    {...register("price")}
                    type="number"
                    className="dash-input"
                    placeholder="99"
                  />
                </DashField>
                <DashField label="Original Price ($)">
                  <input
                    {...register("originalPrice")}
                    type="number"
                    className="dash-input"
                    placeholder="129"
                  />
                </DashField>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <DashField label="Category" error={errors.category?.message}>
                  <select
                    {...register("category")}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-purple-500 transition-all text-sm"
                  >
                    {(
                      [
                        "electronics",
                        "clothing",
                        "books",
                        "home",
                        "sports",
                      ] as Category[]
                    ).map((c) => (
                      <option key={c} value={c} className="bg-slate-800">
                        {c}
                      </option>
                    ))}
                  </select>
                </DashField>
                <DashField label="Stock" error={errors.stock?.message}>
                  <input
                    {...register("stock")}
                    type="number"
                    className="dash-input"
                    placeholder="50"
                  />
                </DashField>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <DashField label="Rating (0-5)" error={errors.rating?.message}>
                  <input
                    {...register("rating")}
                    type="number"
                    step="0.1"
                    className="dash-input"
                    placeholder="4.5"
                  />
                </DashField>
                <DashField label="Reviews Count">
                  <input
                    {...register("reviewsCount")}
                    type="number"
                    className="dash-input"
                    placeholder="100"
                  />
                </DashField>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full flex items-center justify-center gap-2 bg-purple-600 hover:bg-purple-500 disabled:opacity-50 text-white font-semibold py-3 rounded-xl transition-all mt-2"
              >
                {loading ? (
                  <>
                    <Loader2 size={18} className="animate-spin" />
                    Saving...
                  </>
                ) : editProduct ? (
                  "Update Product"
                ) : (
                  "Create Product"
                )}
              </button>
            </form>
          </div>
        </div>
      )}

      <style>{`
        .dash-input {
          width: 100%;
          background: rgba(255,255,255,0.05);
          border: 1px solid rgba(255,255,255,0.1);
          border-radius: 0.75rem;
          padding: 0.75rem 1rem;
          color: white;
          font-size: 0.875rem;
          outline: none;
          transition: border-color 0.2s;
        }
        .dash-input:focus {
          border-color: #9333ea;
        }
        .dash-input::placeholder {
          color: rgba(255,255,255,0.2);
        }
      `}</style>
    </Layout>
  );
}

function DashField({
  label,
  error,
  children,
}: {
  label: string;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label className="block text-white/60 text-sm mb-1.5">{label}</label>
      {children}
      {error && <p className="text-red-400 text-xs mt-1">⚠ {error}</p>}
    </div>
  );
}