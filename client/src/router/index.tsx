import { createBrowserRouter, Navigate } from "react-router-dom";
import HomePage from "../pages/HomePage";
import CartPage from "../pages/CartPage";
import BillsPage from "../pages/BillsPage"; 
import CustomerPage from "../pages/CustomerPage";
import StatisticsPage from "../pages/StatisticsPage";
import RegisterPage from "../pages/auth/RegisterPage";
import LoginPage from "../pages/auth/LoginPage";

const PrivateRoute = ({ children }: { children: React.ReactNode }) => {
  const token = localStorage.getItem('token');
  
  if (!token) {
    return <Navigate to="/login" />;
  }
  
  return <>{children}</>;
};

export const router = createBrowserRouter([
  {
    path: "/",
    element: <PrivateRoute><HomePage /></PrivateRoute>,
  },
  {
    path: "/cart",
    element: <PrivateRoute><CartPage /></PrivateRoute>,
  },
  {
    path: "/bills",
    element: <PrivateRoute><BillsPage /></PrivateRoute>,
  },
  {
    path: "/customers",
    element: <PrivateRoute><CustomerPage /></PrivateRoute>,
  },
  {
    path: "/statistics",
    element: <PrivateRoute><StatisticsPage /></PrivateRoute>,
  },
  {
    path: "/register",
    element: <RegisterPage />,
  },
  {
    path: "/login",
    element: <LoginPage />,
  }
]);

