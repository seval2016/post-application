import LoginForm from "../../components/auth/LoginForm";
import AuthCarousel from "../../components/auth/AuthCarousel";

const LoginPage = () => {
  return (
    <div className="min-h-screen flex flex-col lg:flex-row">
      <LoginForm />
      <AuthCarousel />
    </div>
  );
};

export default LoginPage; 