import RegisterForm from "../../components/auth/RegisterForm";
import AuthCarousel from "../../components/auth/AuthCarousel";

const RegisterPage = () => {
  return (
    <div className="min-h-screen flex flex-col lg:flex-row">
      <RegisterForm />
      <AuthCarousel />
    </div>
  );
};

export default RegisterPage;
