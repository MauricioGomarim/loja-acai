import { BrowserRouter } from "react-router-dom";
import { AppRoutes } from "./app.routes";
import { CartSidebar } from "../components/CartSidebar";

export function Routes() {
  return (
    <BrowserRouter>
      <AppRoutes />
      <CartSidebar />
    </BrowserRouter>
  );
}
