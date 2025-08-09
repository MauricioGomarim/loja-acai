import { Routes, Route } from "react-router-dom";
import { Home } from "../pages/home";
import { AddProduct } from "../pages/add-product";   

export function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/add-product" element={<AddProduct />} />
    </Routes>
  );
}
