import { createBrowserRouter, RouterProvider } from "react-router-dom";

// Layouts
import PublicLayout from "../components/layouts/PublicLayout";
import AdminLayout from "../components/layouts/AdminLayout";

// Guards
import ProtectedRoute from "../components/guards/ProtectedRoute";
import AdminRoute from "../components/guards/AdminRoute";

// Pages — Public
import HomePage from "../pages/public/HomePage";
import CatalogPage from "../pages/public/CatalogPage";
import ProductDetailPage from "../pages/public/ProducDetailPage";
import CartPage from "../pages/public/CartPage";
import CheckoutPage from "../pages/public/CheckoutPage";
import OrderDetailPage from "../pages/OrderDetailPage";

// Pages — Auth
import LoginPage from "../pages/auth/LoginPage";
import RegisterPage from "../pages/auth/RegisterPage";

// Pages — Authenticated
import MyOrdersPage from "../pages/MyOrdersPage";

// Pages — Admin
import AdminProductsPage from "../pages/admin/AdminProductsPage";
import AdminOrdersPage from "../pages/admin/AdminOrdersPage";

// Pages — Misc
import NotFoundPage from "../pages/NotFoundPage";
import AboutPage from "../pages/AboutPage";

const router = createBrowserRouter([
  {
    path: "/",
    element: <PublicLayout />,
    children: [
      { index: true, element: <HomePage /> },
      { path: "catalog", element: <CatalogPage /> },
      { path: "products/:id", element: <ProductDetailPage /> },
      { path: "cart", element: <CartPage /> },
      { path: "checkout", element: <CheckoutPage /> },
      { path: "orders/:id", element: <OrderDetailPage /> }, // pública — guest y logueado
      { path: "login", element: <LoginPage /> },
      { path: "register", element: <RegisterPage /> },
      { path: "/about", element: <AboutPage /> },

      // Rutas autenticadas
      {
        element: <ProtectedRoute />,
        children: [
          { path: "my-orders", element: <MyOrdersPage /> }, // historial — solo logueados
        ],
      },
    ],
  },

  // Rutas admin — layout separado
  {
    path: "/admin",
    element: <AdminRoute />,
    children: [
      {
        element: <AdminLayout />,
        children: [
          { path: "products", element: <AdminProductsPage /> },
          { path: "orders", element: <AdminOrdersPage /> },
        ],
      },
    ],
  },

  { path: "*", element: <NotFoundPage /> },
]);

export default function AppRouter() {
  return <RouterProvider router={router} />;
}
