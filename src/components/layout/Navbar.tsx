import { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import {
  ShoppingBag,
  ShoppingCart,
  Heart,
  Sun,
  Moon,
  LogOut,
  LayoutDashboard,
  Menu,
  X,
  User,
} from "lucide-react";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import { logout } from "../../features/auth/authSlice";
import { toggleDarkMode } from "../../features/ui/uiSlice";
import toast from "react-hot-toast";

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const { user } = useAppSelector((s) => s.auth);
  const { darkMode } = useAppSelector((s) => s.ui);
  const cartCount = useAppSelector((s) =>
    s.cart.items.reduce((acc, i) => acc + i.quantity, 0)
  );
  const wishlistCount = useAppSelector((s) => s.wishlist.items.length);

  const handleLogout = () => {
    dispatch(logout());
    toast.success("Logged out successfully");
    navigate("/login");
  };

  const isActive = (path: string) => location.pathname === path;

  const navLinks = [
    { label: "Home", path: "/" },
    { label: "Products", path: "/products" },
  ];

  return (
    <nav
      className="sticky top-0 z-50 backdrop-blur-md border-b"
      style={{
        backgroundColor: "color-mix(in srgb, var(--bg-primary) 95%, transparent)",
        borderColor: "var(--border)",
      }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">

          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 group">
            <div className="w-9 h-9 bg-[#c9a84c] group-hover:bg-[#9a7a2e] rounded-xl flex items-center justify-center transition-colors">
              <ShoppingBag size={18} className="text-white" />
            </div>
            <span className="font-bold text-lg" style={{ color: "var(--text-primary)" }}>
              Luxe<span className="text-[#c9a84c]">Store</span>
            </span>
          </Link>

          {/* Desktop Links */}
          <div className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className="px-4 py-2 rounded-lg text-sm font-medium transition-all"
                style={{
                  backgroundColor: isActive(link.path) ? "rgba(201,168,76,0.15)" : "transparent",
                  color: isActive(link.path) ? "#c9a84c" : "var(--text-secondary)",
                }}
              >
                {link.label}
              </Link>
            ))}
            {user?.role === "admin" && (
              <Link
                to="/dashboard"
                className="px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-1 transition-all"
                style={{
                  backgroundColor: isActive("/dashboard") ? "rgba(201,168,76,0.15)" : "transparent",
                  color: isActive("/dashboard") ? "#c9a84c" : "var(--text-secondary)",
                }}
              >
                <LayoutDashboard size={14} />
                Dashboard
              </Link>
            )}
          </div>

          {/* Right Icons */}
          <div className="flex items-center gap-1">

            {/* Dark Mode Toggle */}
            <button
              onClick={() => dispatch(toggleDarkMode())}
              className="w-9 h-9 flex items-center justify-center rounded-lg transition-all"
              style={{ color: "var(--text-muted)" }}
              title={darkMode ? "Light Mode" : "Dark Mode"}
            >
              {darkMode ? <Sun size={18} /> : <Moon size={18} />}
            </button>

            {/* Wishlist */}
            <Link
              to="/wishlist"
              className="relative w-9 h-9 flex items-center justify-center rounded-lg transition-all"
              style={{ color: "var(--text-muted)" }}
            >
              <Heart size={18} />
              {wishlistCount > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 bg-[#c9a84c] rounded-full text-white text-[10px] flex items-center justify-center font-bold">
                  {wishlistCount}
                </span>
              )}
            </Link>

            {/* Cart */}
            <Link
              to="/cart"
              className="relative w-9 h-9 flex items-center justify-center rounded-lg transition-all"
              style={{ color: "var(--text-muted)" }}
            >
              <ShoppingCart size={18} />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 bg-[#c9a84c] rounded-full text-white text-[10px] flex items-center justify-center font-bold">
                  {cartCount}
                </span>
              )}
            </Link>

            {/* User */}
            <div
              className="hidden md:flex items-center gap-2 ml-2 pl-2 border-l"
              style={{ borderColor: "var(--border)" }}
            >
              <div
                className="w-8 h-8 rounded-full flex items-center justify-center"
                style={{ backgroundColor: "rgba(201,168,76,0.2)" }}
              >
                <User size={14} className="text-[#c9a84c]" />
              </div>
              <span className="text-sm font-medium" style={{ color: "var(--text-primary)" }}>
                {user?.name.split(" ")[0]}
              </span>
              <button
                onClick={handleLogout}
                className="w-8 h-8 flex items-center justify-center rounded-lg transition-all hover:text-red-500"
                style={{ color: "var(--text-muted)" }}
              >
                <LogOut size={16} />
              </button>
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="md:hidden w-9 h-9 flex items-center justify-center rounded-lg transition-all"
              style={{ color: "var(--text-muted)" }}
            >
              {menuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {menuOpen && (
          <div
            className="md:hidden pb-4 space-y-1 border-t pt-3"
            style={{ borderColor: "var(--border)" }}
          >
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                onClick={() => setMenuOpen(false)}
                className="block px-4 py-2 rounded-lg text-sm font-medium transition-all"
                style={{
                  backgroundColor: isActive(link.path) ? "rgba(201,168,76,0.15)" : "transparent",
                  color: isActive(link.path) ? "#c9a84c" : "var(--text-secondary)",
                }}
              >
                {link.label}
              </Link>
            ))}
            {user?.role === "admin" && (
              <Link
                to="/dashboard"
                onClick={() => setMenuOpen(false)}
                className="block px-4 py-2 rounded-lg text-sm font-medium"
                style={{ color: "var(--text-secondary)" }}
              >
                Dashboard
              </Link>
            )}
            <div
              className="flex items-center justify-between px-4 py-2 border-t mt-2"
              style={{ borderColor: "var(--border)" }}
            >
              <span className="text-sm" style={{ color: "var(--text-muted)" }}>
                {user?.name}
              </span>
              <button onClick={handleLogout} className="text-red-500 text-sm">
                Logout
              </button>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}