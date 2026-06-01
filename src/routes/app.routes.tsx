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
import { AdminRoute } from "../components/AdminRoute";

export function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/product/:id" element={<AddProduct />} />
      <Route path="/checkout" element={<Checkout />} />
      <Route path="/login" element={<Login />} />
      <Route path="/profile" element={<Profile />} />
      <Route path="/admin" element={<AdminRoute><Admin /></AdminRoute>} />
      <Route path="/admin/products" element={<AdminRoute><AdminProducts /></AdminRoute>} />
      <Route path="/admin/orders" element={<AdminRoute><AdminOrders /></AdminRoute>} />
      <Route path="/admin/categories" element={<AdminRoute><AdminCategories /></AdminRoute>} />
    </Routes>
  );
}
