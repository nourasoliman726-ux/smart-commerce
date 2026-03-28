// import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
// import { Toaster } from "react-hot-toast";
// import { useAppSelector } from "./store/hooks";
// import ProtectedRoute from "./routes/ProtectedRoute";

// import ProductDetailPage from "./pages/ProductDetailPage";
// import LoginPage from "./pages/LoginPage";
// import RegisterPage from "./pages/RegisterPage";


// import { lazy, Suspense } from "react";
// const HomePage = lazy(() => import("./pages/HomePage"));
// const ProductsPage = lazy(() => import("./pages/ProductsPage"));
// const CartPage = lazy(() => import("./pages/CartPage"));
// const DashboardPage = lazy(() => import("./pages/DashboardPage"));

// function PageLoader() {
//   return (
//     <div className="min-h-screen bg-slate-900 flex items-center justify-center">
//       <div className="flex flex-col items-center gap-4">
//         <div className="w-12 h-12 border-4 border-purple-600 border-t-transparent rounded-full animate-spin" />
//         <p className="text-white/60">Loading...</p>
//       </div>
//     </div>
//   );
// }

// export default function App() {
//   const { isAuthenticated } = useAppSelector((state) => state.auth);
//   const { darkMode } = useAppSelector((state) => state.ui);

//   return (
//     <div className={darkMode ? "dark" : ""}>
//       <BrowserRouter>
//         <Suspense fallback={<PageLoader />}>
//           <Routes>
//             {/* Public */}
//             <Route
//               path="/login"
//               element={isAuthenticated ? <Navigate to="/" /> : <LoginPage />}
//             />
//             <Route
//               path="/register"
//               element={isAuthenticated ? <Navigate to="/" /> : <RegisterPage />}
//             />

//             // <Route
//                   path="/products/:id"
//                   element={
//                     <ProtectedRoute>
//                       <ProductDetailPage />
//                     </ProtectedRoute>
//                   }
//                 />                

//             {/* Protected */}
//             <Route
//               path="/"
//               element={
//                 <ProtectedRoute>
//                   <HomePage />
//                 </ProtectedRoute>
//               }
//             />
//             <Route
//               path="/products"
//               element={
//                 <ProtectedRoute>
//                   <ProductsPage />
//                 </ProtectedRoute>
//               }
//             />
//             <Route
//               path="/cart"
//               element={
//                 <ProtectedRoute>
//                   <CartPage />
//                 </ProtectedRoute>
//               }
//             />
//             <Route
//               path="/dashboard"
//               element={
//                 <ProtectedRoute adminOnly>
//                   <DashboardPage />
//                 </ProtectedRoute>
//               }
//             />

//             <Route path="*" element={<Navigate to="/" />} />
//           </Routes>
//         </Suspense>

//         <Toaster
//           position="top-right"
//           toastOptions={{
//             style: {
//               background: "#1e1b4b",
//               color: "#fff",
//               border: "1px solid rgba(255,255,255,0.1)",
//             },
//           }}
//         />
//       </BrowserRouter>
//     </div>
//   );
// }

import { lazy, Suspense } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { useAppSelector } from "./store/hooks";
import ProtectedRoute from "./routes/ProtectedRoute";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";

const HomePage = lazy(() => import("./pages/HomePage"));
const ProductsPage = lazy(() => import("./pages/ProductsPage"));
const ProductDetailPage = lazy(() => import("./pages/ProductDetailPage"));
const CartPage = lazy(() => import("./pages/CartPage"));
const CheckoutPage = lazy(() => import("./pages/CheckoutPage"));
const WishlistPage = lazy(() => import("./pages/WishlistPage"));
const DashboardPage = lazy(() => import("./pages/DashboardPage"));

function PageLoader() {
  return (
    <div className="min-h-screen bg-slate-900 flex items-center justify-center">
      <div className="w-12 h-12 border-4 border-purple-600 border-t-transparent rounded-full animate-spin" />
    </div>
  );
}

export default function App() {
  const { isAuthenticated } = useAppSelector((s) => s.auth);

  return (
    <BrowserRouter>
      <Suspense fallback={<PageLoader />}>
        <Routes>
          <Route
            path="/login"
            element={isAuthenticated ? <Navigate to="/" /> : <LoginPage />}
          />
          <Route
            path="/register"
            element={isAuthenticated ? <Navigate to="/" /> : <RegisterPage />}
          />
          <Route path="/" element={<ProtectedRoute><HomePage /></ProtectedRoute>} />
          <Route path="/products" element={<ProtectedRoute><ProductsPage /></ProtectedRoute>} />
          <Route path="/products/:id" element={<ProtectedRoute><ProductDetailPage /></ProtectedRoute>} />
          <Route path="/cart" element={<ProtectedRoute><CartPage /></ProtectedRoute>} />
          <Route path="/checkout" element={<ProtectedRoute><CheckoutPage /></ProtectedRoute>} />
          <Route path="/wishlist" element={<ProtectedRoute><WishlistPage /></ProtectedRoute>} />
          <Route path="/dashboard" element={<ProtectedRoute adminOnly><DashboardPage /></ProtectedRoute>} />
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </Suspense>

      <Toaster
        position="top-right"
        toastOptions={{
          style: {
            background: "#1e1b4b",
            color: "#fff",
            border: "1px solid rgba(255,255,255,0.1)",
          },
        }}
      />
    </BrowserRouter>
  );
}
