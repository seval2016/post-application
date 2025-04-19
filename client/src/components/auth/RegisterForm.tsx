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
    <div className="w-full lg:w-1/2 min-h-screen bg-white flex flex-col justify-between py-8 lg:py-0">
      <div className="flex-1 flex flex-col justify-center px-4 sm:px-6 lg:px-12">
        <div className="w-full max-w-[400px] mx-auto">
          <div className="flex justify-center mb-6 lg:mb-8">
            <Logo />
          </div>

          <h2 className="text-xl sm:text-2xl font-bold text-gray-900 text-center">
            Hemen Kayıt Olun
          </h2>
          <p className="mt-2 sm:mt-3 text-sm text-gray-600 text-center">
            veya{" "}
            <Link
              to="/login"
              className="font-medium text-indigo-600 hover:text-indigo-500"
            >
              zaten hesabınız varsa giriş yapın
            </Link>
          </p>

          <div className="mt-6 sm:mt-8">
            <Form
              form={form}
              name="register"
              onFinish={onFinish}
              layout="vertical"
              size="large"
              className="space-y-4 sm:space-y-5"
            >
              <Form.Item
                name="businessName"
                rules={[
                  {
                    required: true,
                    message: "Lütfen işletme adını giriniz!",
                  },
                ]}
                className="mb-4 sm:mb-6"
              >
                <Input
                  prefix={<ShopOutlined className="text-gray-400" />}
                  placeholder="İşletme Adı"
                  className="rounded-lg h-11 sm:h-12 hover:border-indigo-400 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-colors"
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
                className="mb-4 sm:mb-6"
              >
                <Input
                  prefix={<UserOutlined className="text-gray-400" />}
                  placeholder="Ad Soyad"
                  className="rounded-lg h-11 sm:h-12 hover:border-indigo-400 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-colors"
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
                className="mb-4 sm:mb-6"
              >
                <Input
                  prefix={<PhoneOutlined className="text-gray-400" />}
                  placeholder="Telefon"
                  className="rounded-lg h-11 sm:h-12 hover:border-indigo-400 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-colors"
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
                className="mb-4 sm:mb-6"
              >
                <Input
                  prefix={<MailOutlined className="text-gray-400" />}
                  placeholder="Email"
                  className="rounded-lg h-11 sm:h-12 hover:border-indigo-400 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-colors"
                />
              </Form.Item>

              <Form.Item
                name="password"
                rules={[
                  { required: true, message: "Lütfen şifrenizi giriniz!" },
                  { min: 6, message: "Şifre en az 6 karakter olmalıdır!" },
                ]}
                className="mb-4 sm:mb-6"
              >
                <Input.Password
                  prefix={<LockOutlined className="text-gray-400" />}
                  placeholder="Şifre"
                  className="rounded-lg h-11 sm:h-12 hover:border-indigo-400 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-colors"
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
                      return Promise.reject(
                        new Error("Şifreler eşleşmiyor!")
                      );
                    },
                  }),
                ]}
                className="mb-4 sm:mb-6"
              >
                <Input.Password
                  prefix={<LockOutlined className="text-gray-400" />}
                  placeholder="Şifre Tekrar"
                  className="rounded-lg h-11 sm:h-12 hover:border-indigo-400 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-colors"
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
                            new Error(
                              "Kullanım koşullarını kabul etmelisiniz!"
                            )
                          ),
                  },
                ]}
                className="mb-6 sm:mb-8"
              >
                <Checkbox className="text-sm text-gray-600 hover:text-gray-900 transition-colors">
                  <Link
                    to="/terms"
                    className="text-indigo-600 hover:text-indigo-500 transition-colors"
                  >
                    Kullanım koşullarını
                  </Link>{" "}
                  okudum ve kabul ediyorum
                </Checkbox>
              </Form.Item>

              <Form.Item className="mb-0">
                <Button
                  type="primary"
                  htmlType="submit"
                  className="w-full bg-indigo-600 hover:bg-indigo-700 h-11 sm:h-12 text-base rounded-lg shadow-lg hover:shadow-xl transition-all duration-200"
                >
                  Kayıt Ol
                </Button>
              </Form.Item>
            </Form>
          </div>
        </div>
      </div>

      <div className="py-3 sm:py-4 px-4 bg-gray-50 text-center text-xs sm:text-sm text-gray-600">
        © 2023 - 2023 POS (Point Of Sales) v1.0.0
        <br />
        Designed & Developed by: MIRA IutaR-furaS
      </div>
    </div>
  );
};

export default RegisterForm; 