import { Form, Input, Button, Checkbox, message } from "antd";
import { Link, useNavigate } from "react-router-dom";
import Logo from "../Header/Logo";
import { UserOutlined, LockOutlined } from "@ant-design/icons";
import '../../styles/components/auth/LoginForm.css';

interface LoginFormData {
  email: string;
  password: string;
  rememberMe: boolean;
}

const LoginForm = () => {
  const [form] = Form.useForm();
  const navigate = useNavigate();

  const onFinish = async (values: LoginFormData) => {
    try {
      const response = await fetch('http://localhost:5000/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: values.email,
          password: values.password
        }),
      });

      if (!response.ok) {
        throw new Error('Giriş başarısız');
      }

      const data = await response.json();
      localStorage.setItem('token', data.token);
      
      if (values.rememberMe) {
        localStorage.setItem('rememberMe', 'true');
      }

      message.success("Giriş başarılı!");
      navigate('/');
    } catch (error) {
      console.error("Error:", error);
      message.error("Giriş sırasında bir hata oluştu.");
    }
  };

  return (
    <div className="login-container">
      <div className="login-content">
        <div className="login-form-wrapper">
          <div className="login-logo">
            <Logo />
          </div>

          <h2 className="login-title">Hoş Geldiniz</h2>
          <p className="login-subtitle">
            veya{" "}
            <Link to="/register" className="login-link">
              hesabınız yoksa kayıt olun
            </Link>
          </p>

          <div className="login-form">
            <Form
              form={form}
              name="login"
              onFinish={onFinish}
              layout="vertical"
              size="large"
            >
              <Form.Item
                name="email"
                rules={[
                  {
                    required: true,
                    message: "Lütfen email adresinizi giriniz!",
                  },
                  {
                    type: "email",
                    message: "Geçerli bir email adresi giriniz!",
                  },
                ]}
                className="login-form-item"
              >
                <Input
                  prefix={<UserOutlined className="login-icon" />}
                  placeholder="Email"
                  className="login-input"
                />
              </Form.Item>

              <Form.Item
                name="password"
                rules={[
                  { required: true, message: "Lütfen şifrenizi giriniz!" },
                ]}
                className="login-form-item"
              >
                <Input.Password
                  prefix={<LockOutlined className="login-icon" />}
                  placeholder="Şifre"
                  className="login-input"
                />
              </Form.Item>

              <div className="flex items-center justify-between login-form-item">
                <Form.Item
                  name="rememberMe"
                  valuePropName="checked"
                  className="mb-0"
                >
                  <Checkbox className="login-checkbox-text">
                    Beni hatırla
                  </Checkbox>
                </Form.Item>

                <Link to="/forgot-password" className="login-link">
                  Şifremi unuttum
                </Link>
              </div>

              <Form.Item className="mb-0">
                <Button
                  type="primary"
                  htmlType="submit"
                  className="login-submit-button"
                >
                  Giriş Yap
                </Button>
              </Form.Item>
            </Form>
          </div>
        </div>
      </div>

      <div className="login-footer">
        © 2023 - 2023 POS (Point Of Sales) v1.0.0
        <br />
        Designed & Developed by: MIRA IutaR-furaS
      </div>
    </div>
  );
};

export default LoginForm; 