import { createBrowserRouter, Navigate } from "react-router-dom";
import HomePage from "../pages/HomePage";
import CartPage from "../pages/CartPage";
import CustomerPage from "../pages/CustomerPage";
import StatisticsPage from "../pages/StatisticsPage";
import RegisterPage from "../pages/auth/RegisterPage";
import LoginPage from "../pages/auth/LoginPage";
import OrdersPage from "../pages/OrdersPage";
import ErrorBoundary from "../components/ErrorBoundary";

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
    errorElement: <ErrorBoundary><div>Error</div></ErrorBoundary>
  },
  {
    path: "/cart",
    element: <PrivateRoute><CartPage /></PrivateRoute>,
    errorElement: <ErrorBoundary><div>Error</div></ErrorBoundary>
  },
  {
    path: "/customers",
    element: <PrivateRoute><CustomerPage /></PrivateRoute>,
    errorElement: <ErrorBoundary><div>Error</div></ErrorBoundary>
  },
  {
    path: "/statistics",
    element: <PrivateRoute><StatisticsPage /></PrivateRoute>,
    errorElement: <ErrorBoundary><div>Error</div></ErrorBoundary>
  },
  {
    path: "/register",
    element: <RegisterPage />,
    errorElement: <ErrorBoundary><div>Error</div></ErrorBoundary>
  },
  {
    path: "/login",
    element: <LoginPage />,
    errorElement: <ErrorBoundary><div>Error</div></ErrorBoundary>
  },
  {
    path: "/orders",
    element: <PrivateRoute><OrdersPage /></PrivateRoute>,
    errorElement: <ErrorBoundary><div>Error</div></ErrorBoundary>
  }
]);

export default router;

