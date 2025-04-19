import { createBrowserRouter } from "react-router-dom";
import HomePage from "../pages/HomePage";
import CartPage from "../pages/CartPage";
import BillsPage from "../pages/BillsPage"; 
import CustomerPage from "../pages/CustomerPage";
import StatisticsPage from "../pages/StatisticsPage";
import RegisterPage from "../pages/auth/RegisterPage";
import LoginPage from "../pages/auth/LoginPage";
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
  },
  {
    path: "/statistics",
    element: <StatisticsPage />,
  },
  {
    path: "/register",
    element: < RegisterPage/>,
  },
  {
    path: "/login",
    element: < LoginPage/>,
  }
]);

