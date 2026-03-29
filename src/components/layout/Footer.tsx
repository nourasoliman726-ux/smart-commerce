import { Link } from "react-router-dom";

import {
  ShoppingBag,
  Mail,
  Phone,
  MapPin,
  Heart,
  X,
  GitBranch as GithubIcon,
  Play,
} from "lucide-react";

export default function Footer() {
  const year = new Date().getFullYear();

  const shopLinks = [
    { label: "Electronics", path: "/products?category=electronics" },
    { label: "Fashion", path: "/products?category=fashion" },
    { label: "Home & Living", path: "/products?category=home" },
    { label: "Beauty", path: "/products?category=beauty" },
    { label: "New Arrivals", path: "/products" },
  ];

  const helpLinks = [
    "FAQ",
    "Shipping Info",
    "Returns & Exchanges",
    "Order Tracking",
    "Privacy Policy",
  ];

  const socialIcons = [Mail, Mail, Mail];

  return (
    <footer
      className="mt-20"
      style={{ backgroundColor: "var(--brown, #3d2b1f)" }}
    >
      {/* Newsletter */}
      <div className="border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div>
              <h3 className="text-white text-xl font-bold mb-1">
                Join Our Newsletter
              </h3>
              <p className="text-white/50 text-sm">
                Get exclusive deals and new arrivals first.
              </p>
            </div>
            <div className="flex gap-3 w-full md:w-auto">
              <input
                type="email"
                placeholder="your@email.com"
                className="flex-1 md:w-72 bg-white/10 border border-white/20 rounded-xl px-4 py-2.5 text-white placeholder-white/30 focus:outline-none focus:border-[#c9a84c] transition-all text-sm"
              />
              <button className="bg-[#c9a84c] hover:bg-[#9a7a2e] text-white font-semibold px-5 py-2.5 rounded-xl transition-all text-sm whitespace-nowrap">
                Subscribe
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Brand */}
          <div>
            <Link to="/" className="flex items-center gap-2 mb-4">
              <div className="w-9 h-9 bg-[#c9a84c] rounded-xl flex items-center justify-center">
                <ShoppingBag size={18} className="text-white" />
              </div>
              <span className="text-white font-bold text-lg">
                Luxe<span className="text-[#c9a84c]">Store</span>
              </span>
            </Link>
            <p className="text-white/50 text-sm leading-relaxed mb-6">
              Your premier destination for luxury goods. Curated collections
              from the world's finest brands.
            </p>
            <div className="flex gap-3">
              {socialIcons.map((Icon, i) => (
                <a
                  key={i}
                  href="#"
                  className="w-9 h-9 bg-white/10 hover:bg-[#c9a84c] rounded-lg flex items-center justify-center transition-all"
                >
                  <Icon size={16} className="text-white" />
                </a>
              ))}
            </div>
          </div>

          {/* Shop */}
          <div>
            <h4 className="text-white font-semibold mb-5">Shop</h4>
            <ul className="space-y-3">
              {shopLinks.map((link) => (
                <li key={link.label}>
                  <Link
                    to={link.path}
                    className="text-white/50 hover:text-[#c9a84c] text-sm transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Help */}
          <div>
            <h4 className="text-white font-semibold mb-5">Help</h4>
            <ul className="space-y-3">
              {helpLinks.map((item) => (
                <li key={item}>
                  <a
                    href="#"
                    className="text-white/50 hover:text-[#c9a84c] text-sm transition-colors"
                  >
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-white font-semibold mb-5">Contact Us</h4>
            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <MapPin size={16} className="text-[#c9a84c] mt-0.5 shrink-0" />
                <span className="text-white/50 text-sm">
                  123 Luxury Ave, Suite 100
                  <br />
                  New York, NY 10001
                </span>
              </li>
              <li className="flex items-center gap-3">
                <Phone size={16} className="text-[#c9a84c] shrink-0" />
                <span className="text-white/50 text-sm">+1 (123) 456-7890</span>
              </li>
              <li className="flex items-center gap-3">
                <Mail size={16} className="text-[#c9a84c] shrink-0" />
                <span className="text-white/50 text-sm">
                  hello@luxestore.com
                </span>
              </li>
            </ul>
            <div className="mt-6 bg-white/5 border border-white/10 rounded-xl p-4">
              <p className="text-white/70 text-xs font-semibold mb-2">
                Working Hours
              </p>
              <p className="text-white/40 text-xs">Mon – Fri: 9AM – 6PM EST</p>
              <p className="text-white/40 text-xs mt-1">
                Sat – Sun: 10AM – 4PM EST
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom */}
      <div className="border-t border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
            <p className="text-white/30 text-sm">
              © {year} LuxeStore. All rights reserved.
            </p>
            <div className="flex items-center gap-2">
              {["VISA", "MC", "PAYPAL", "AMEX"].map((card) => (
                <div
                  key={card}
                  className="bg-white/10 rounded-lg px-2.5 py-1 text-white/50 text-xs font-mono"
                >
                  {card}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
