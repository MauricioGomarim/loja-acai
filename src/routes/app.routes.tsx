import { Routes, Route } from "react-router-dom";
import { Home } from "../pages/home";
import { AddProduct } from "../pages/add-product";
import { Checkout } from "../pages/checkout";
import { Login } from "../pages/login";
import { Profile } from "../pages/profile";
import { Admin } from "../pages/admin";
import { AdminProducts } from "../pages/admin-products";
import { AdminOrders } from "../pages/admin-orders";
import { AdminCategories } from "../pages/admin-categories";
import { StoreSelect } from "../pages/store-select";
import { PlatformAdmin } from "../pages/platform-admin";
import { StoreWithdrawals } from "../pages/store-withdrawals";
import { StoreSettings } from "../pages/store-settings";
import { AdminRoute } from "../components/AdminRoute";

export function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<StoreSelect />} />
      <Route path="/:slug" element={<Home />} />
      <Route path="/:slug/product/:id" element={<AddProduct />} />
      <Route path="/:slug/checkout" element={<Checkout />} />
      <Route path="/login" element={<Login />} />
      <Route path="/profile" element={<Profile />} />
      {/* Admin routes - with store slug */}
      <Route path="/:slug/admin" element={<AdminRoute><Admin /></AdminRoute>} />
      <Route path="/:slug/admin/products" element={<AdminRoute><AdminProducts /></AdminRoute>} />
      <Route path="/:slug/admin/orders" element={<AdminRoute><AdminOrders /></AdminRoute>} />
      <Route path="/:slug/admin/categories" element={<AdminRoute><AdminCategories /></AdminRoute>} />
      <Route path="/:slug/admin/withdrawals" element={<AdminRoute><StoreWithdrawals /></AdminRoute>} />
      <Route path="/:slug/admin/settings" element={<AdminRoute><StoreSettings /></AdminRoute>} />
      <Route path="/platform" element={<AdminRoute><PlatformAdmin /></AdminRoute>} />
    </Routes>
  );
}
