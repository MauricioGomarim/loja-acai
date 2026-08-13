import { Routes, Route } from "react-router-dom";
import { AdminRoute } from "../components/AdminRoute";
import { AdminLayout } from "../components/layout/admin-layout";

// Customer pages
import { StoreSelect } from "../pages/store-select";
import { Home } from "../pages/home";
import { AddProduct } from "../pages/add-product";
import { Checkout } from "../pages/checkout";
import { Login } from "../pages/login";
import { Profile } from "../pages/profile";

// Platform admin pages
import { PlatformStores } from "../pages/platform/stores";
import { PlatformWithdrawals } from "../pages/platform/withdrawals";
import { PlatformOwners } from "../pages/platform/owners";

// Store admin pages
import { StoreDashboard } from "../pages/store-admin/index";
import { StoreOrders } from "../pages/store-admin/orders";
import { StoreProducts } from "../pages/store-admin/products";
import { StoreCategories } from "../pages/store-admin/categories";
import { StoreWithdrawals } from "../pages/store-admin/withdrawals";
import { StoreSettings } from "../pages/store-admin/settings";

export function AppRoutes() {
  return (
    <Routes>
      {/* Public routes */}
      <Route path="/" element={<StoreSelect />} />
      <Route path="/login" element={<Login />} />
      <Route path="/profile" element={<Profile />} />

      {/* Storefront */}
      <Route path="/:slug" element={<Home />} />
      <Route path="/:slug/product/:id" element={<AddProduct />} />
      <Route path="/:slug/checkout" element={<Checkout />} />

      {/* Platform admin - nested layout */}
      <Route
        path="/platform"
        element={
          <AdminRoute>
            <AdminLayout variant="platform" />
          </AdminRoute>
        }
      >
        <Route index element={<PlatformStores />} />
        <Route path="withdrawals" element={<PlatformWithdrawals />} />
        <Route path="owners" element={<PlatformOwners />} />
      </Route>

      {/* Store admin - nested layout */}
      <Route
        path="/:slug/admin"
        element={
          <AdminRoute>
            <AdminLayout variant="store" />
          </AdminRoute>
        }
      >
        <Route index element={<StoreDashboard />} />
        <Route path="orders" element={<StoreOrders />} />
        <Route path="products" element={<StoreProducts />} />
        <Route path="categories" element={<StoreCategories />} />
        <Route path="withdrawals" element={<StoreWithdrawals />} />
        <Route path="settings" element={<StoreSettings />} />
      </Route>
    </Routes>
  );
}
