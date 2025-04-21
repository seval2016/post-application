import { Form, Input, Button, Checkbox, message } from "antd";
import { Link } from "react-router-dom";
import Logo from "../Header/Logo";
import {
  UserOutlined,
  LockOutlined,
  MailOutlined,
  PhoneOutlined,
  ShopOutlined,
} from "@ant-design/icons";
import '../../styles/components/auth/RegisterForm.css';

interface RegisterFormData {
  businessName: string;
  fullName: string;
  phone: string;
  email: string;
  password: string;
  confirmPassword: string;
  agreement: boolean;
}

const RegisterForm = () => {
  const [form] = Form.useForm();

  const onFinish = async (values: RegisterFormData) => {
    try {
      // API call will be implemented here
      console.log("Success:", values);
      message.success("Kayıt başarılı!");
    } catch (error) {
      console.error("Error:", error);
      message.error("Kayıt sırasında bir hata oluştu.");
    }
  };

  return (
    <div className="register-container">
      <div className="register-content">
        <div className="register-form-wrapper">
          <div className="register-logo">
            <Logo />
          </div>

          <h2 className="register-title">Kayıt Ol</h2>
          <p className="register-subtitle">
            veya{" "}
            <Link to="/login" className="register-link">
              hesabınız varsa giriş yapın
            </Link>
          </p>

          <div className="register-form">
            <Form
              form={form}
              name="register"
              onFinish={onFinish}
              layout="vertical"
              size="large"
            >
              <Form.Item
                name="businessName"
                rules={[
                  {
                    required: true,
                    message: "Lütfen işletme adını giriniz!",
                  },
                ]}
                className="register-form-item"
              >
                <Input
                  prefix={<ShopOutlined className="register-icon" />}
                  placeholder="İşletme Adı"
                  className="register-input"
                />
              </Form.Item>

              <Form.Item
                name="fullName"
                rules={[
                  {
                    required: true,
                    message: "Lütfen ad soyadınızı giriniz!",
                  },
                ]}
                className="register-form-item"
              >
                <Input
                  prefix={<UserOutlined className="register-icon" />}
                  placeholder="Ad Soyad"
                  className="register-input"
                />
              </Form.Item>

              <Form.Item
                name="phone"
                rules={[
                  {
                    required: true,
                    message: "Lütfen telefon numaranızı giriniz!",
                  },
                ]}
                className="register-form-item"
              >
                <Input
                  prefix={<PhoneOutlined className="register-icon" />}
                  placeholder="Telefon"
                  className="register-input"
                />
              </Form.Item>

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
                className="register-form-item"
              >
                <Input
                  prefix={<MailOutlined className="register-icon" />}
                  placeholder="Email"
                  className="register-input"
                />
              </Form.Item>

              <Form.Item
                name="password"
                rules={[
                  { required: true, message: "Lütfen şifrenizi giriniz!" },
                  { min: 6, message: "Şifre en az 6 karakter olmalıdır!" },
                ]}
                className="register-form-item"
              >
                <Input.Password
                  prefix={<LockOutlined className="register-icon" />}
                  placeholder="Şifre"
                  className="register-input"
                />
              </Form.Item>

              <Form.Item
                name="confirmPassword"
                dependencies={["password"]}
                rules={[
                  {
                    required: true,
                    message: "Lütfen şifrenizi tekrar giriniz!",
                  },
                  ({ getFieldValue }) => ({
                    validator(_, value) {
                      if (!value || getFieldValue("password") === value) {
                        return Promise.resolve();
                      }
                      return Promise.reject(new Error("Şifreler eşleşmiyor!"));
                    },
                  }),
                ]}
                className="register-form-item"
              >
                <Input.Password
                  prefix={<LockOutlined className="register-icon" />}
                  placeholder="Şifreyi Tekrarla"
                  className="register-input"
                />
              </Form.Item>

              <Form.Item
                name="agreement"
                valuePropName="checked"
                rules={[
                  {
                    validator: (_, value) =>
                      value
                        ? Promise.resolve()
                        : Promise.reject(
                            new Error("Kullanım koşullarını kabul etmelisiniz!")
                          ),
                  },
                ]}
                className="register-form-item"
              >
                <Checkbox className="register-checkbox-text">
                  <Link to="/terms" className="register-link">
                    Kullanım Koşulları
                  </Link>
                  'nı okudum ve kabul ediyorum
                </Checkbox>
              </Form.Item>

              <Form.Item className="mb-0">
                <Button
                  type="primary"
                  htmlType="submit"
                  className="register-submit-button"
                >
                  Kayıt Ol
                </Button>
              </Form.Item>
            </Form>
          </div>
        </div>
      </div>

      <div className="register-footer">
        © 2023 - 2023 POS (Point Of Sales) v1.0.0
        <br />
        Designed & Developed by: MIRA IutaR-furaS
      </div>
    </div>
  );
};

export default RegisterForm; 