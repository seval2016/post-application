import { createBrowserRouter, Navigate } from "react-router-dom";
import { lazy, Suspense } from "react";
import ErrorBoundary from "../components/ErrorBoundary";
import ErrorPage from "../components/ErrorPage/ErrorPage";
import LoadingSpinner from "../components/LoadingSpinner";

// Lazy load pages
const HomePage = lazy(() => import("../pages/HomePage"));
const CartPage = lazy(() => import("../pages/CartPage"));
const CustomerPage = lazy(() => import("../pages/CustomerPage"));
const StatisticsPage = lazy(() => import("../pages/StatisticsPage"));
const RegisterPage = lazy(() => import("../pages/auth/RegisterPage"));
const LoginPage = lazy(() => import("../pages/auth/LoginPage"));
const OrdersPage = lazy(() => import("../pages/OrdersPage"));

const PrivateRoute = ({ children }: { children: React.ReactNode }) => {
  const token = localStorage.getItem('token');
  
  if (!token) {
    return <Navigate to="/login" />;
  }
  
  return <>{children}</>;
};

const SuspenseWrapper = ({ children }: { children: React.ReactNode }) => (
  <Suspense fallback={<LoadingSpinner />}>
    {children}
  </Suspense>
);

const router = createBrowserRouter([
  {
    path: "/",
    element: (
      <PrivateRoute>
        <SuspenseWrapper>
          <HomePage />
        </SuspenseWrapper>
      </PrivateRoute>
    ),
    errorElement: <ErrorBoundary><ErrorPage /></ErrorBoundary>
  },
  {
    path: "/cart",
    element: (
      <PrivateRoute>
        <SuspenseWrapper>
          <CartPage />
        </SuspenseWrapper>
      </PrivateRoute>
    ),
    errorElement: <ErrorBoundary><ErrorPage /></ErrorBoundary>
  },
  {
    path: "/customers",
    element: (
      <PrivateRoute>
        <SuspenseWrapper>
          <CustomerPage />
        </SuspenseWrapper>
      </PrivateRoute>
    ),
    errorElement: <ErrorBoundary><ErrorPage /></ErrorBoundary>
  },
  {
    path: "/statistics",
    element: (
      <PrivateRoute>
        <SuspenseWrapper>
          <StatisticsPage />
        </SuspenseWrapper>
      </PrivateRoute>
    ),
    errorElement: <ErrorBoundary><ErrorPage /></ErrorBoundary>
  },
  {
    path: "/register",
    element: (
      <SuspenseWrapper>
        <RegisterPage />
      </SuspenseWrapper>
    ),
    errorElement: <ErrorBoundary><ErrorPage /></ErrorBoundary>
  },
  {
    path: "/login",
    element: (
      <SuspenseWrapper>
        <LoginPage />
      </SuspenseWrapper>
    ),
    errorElement: <ErrorBoundary><ErrorPage /></ErrorBoundary>
  },
  {
    path: "/orders",
    element: (
      <PrivateRoute>
        <SuspenseWrapper>
          <OrdersPage />
        </SuspenseWrapper>
      </PrivateRoute>
    ),
    errorElement: <ErrorBoundary><ErrorPage /></ErrorBoundary>
  },
  {
    path: "*",
    element: <ErrorPage status="404" />
  }
]);

export default router;

