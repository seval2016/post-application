import { createBrowserRouter } from "react-router-dom";
import HomePage from "../pages/HomePage";
import CartPage from "../pages/CartPage";
import BillsPage from "../pages/BillsPage"; 
import CustomerPage from "../pages/CustomerPage";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <HomePage />,
  },
  {
    path: "/cart",
    element: <CartPage />,
  },
  {
    path: "/bills",
    element: <BillsPage />,
  },
  {
    path: "/customers",
    element: <CustomerPage />,
  }
]);

