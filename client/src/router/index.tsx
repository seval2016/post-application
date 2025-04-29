import { createBrowserRouter, Navigate } from "react-router-dom";
import HomePage from "../pages/HomePage";
import CartPage from "../pages/CartPage";
import CustomerPage from "../pages/CustomerPage";
import StatisticsPage from "../pages/StatisticsPage";
import RegisterPage from "../pages/auth/RegisterPage";
import LoginPage from "../pages/auth/LoginPage";
import OrdersPage from "../pages/OrdersPage";
import ErrorBoundary from "../components/ErrorBoundary";
import ErrorPage from "../components/ErrorPage/ErrorPage";

const PrivateRoute = ({ children }: { children: React.ReactNode }) => {
  const token = localStorage.getItem('token');
  
  if (!token) {
    return <Navigate to="/login" />;
  }
  
  return <>{children}</>;
};

const router = createBrowserRouter([
  {
    path: "/",
    element: <PrivateRoute><HomePage /></PrivateRoute>,
    errorElement: <ErrorBoundary><ErrorPage /></ErrorBoundary>
  },
  {
    path: "/cart",
    element: <PrivateRoute><CartPage /></PrivateRoute>,
    errorElement: <ErrorBoundary><ErrorPage /></ErrorBoundary>
  },
  {
    path: "/customers",
    element: <PrivateRoute><CustomerPage /></PrivateRoute>,
    errorElement: <ErrorBoundary><ErrorPage /></ErrorBoundary>
  },
  {
    path: "/statistics",
    element: <PrivateRoute><StatisticsPage /></PrivateRoute>,
    errorElement: <ErrorBoundary><ErrorPage /></ErrorBoundary>
  },
  {
    path: "/register",
    element: <RegisterPage />,
    errorElement: <ErrorBoundary><ErrorPage /></ErrorBoundary>
  },
  {
    path: "/login",
    element: <LoginPage />,
    errorElement: <ErrorBoundary><ErrorPage /></ErrorBoundary>
  },
  {
    path: "/orders",
    element: <PrivateRoute><OrdersPage /></PrivateRoute>,
    errorElement: <ErrorBoundary><ErrorPage /></ErrorBoundary>
  },
  {
    path: "*",
    element: <ErrorPage status="404" />
  }
]);

export default router;

