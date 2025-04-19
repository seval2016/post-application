import { Form, Input, Button, Checkbox, message } from "antd";
import { Link } from "react-router-dom";
import Logo from "../Header/Logo";
import { UserOutlined, LockOutlined } from "@ant-design/icons";

interface LoginFormData {
  email: string;
  password: string;
  rememberMe: boolean;
}

const LoginForm = () => {
  const [form] = Form.useForm();

  const onFinish = async (values: LoginFormData) => {
    try {
      // API call will be implemented here
      console.log("Success:", values);
      message.success("Giriş başarılı!");
    } catch (error) {
      console.error("Error:", error);
      message.error("Giriş sırasında bir hata oluştu.");
    }
  };

  return (
    <div className="w-full xl:w-1/2 min-h-screen bg-white flex flex-col justify-between py-8 lg:py-0">
      <div className="flex-1 flex flex-col justify-center px-4 sm:px-6 lg:px-12">
        <div className="w-full max-w-[400px] mx-auto">
          <div className="flex justify-center mb-6 lg:mb-8">
            <Logo />
          </div>

          <h2 className="text-xl sm:text-2xl font-bold text-gray-900 text-center">
            Hoş Geldiniz
          </h2>
          <p className="mt-2 sm:mt-3 text-sm text-gray-600 text-center">
            veya{" "}
            <Link
              to="/register"
              className="font-medium text-indigo-600 hover:text-indigo-500"
            >
              hesabınız yoksa kayıt olun
            </Link>
          </p>

          <div className="mt-6 sm:mt-8">
            <Form
              form={form}
              name="login"
              onFinish={onFinish}
              layout="vertical"
              size="large"
              className="space-y-4 sm:space-y-5"
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
                className="mb-4 sm:mb-6"
              >
                <Input
                  prefix={<UserOutlined className="text-gray-400" />}
                  placeholder="Email"
                  className="rounded-lg h-11 sm:h-12 hover:border-indigo-400 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-colors"
                />
              </Form.Item>

              <Form.Item
                name="password"
                rules={[
                  { required: true, message: "Lütfen şifrenizi giriniz!" },
                ]}
                className="mb-4 sm:mb-6"
              >
                <Input.Password
                  prefix={<LockOutlined className="text-gray-400" />}
                  placeholder="Şifre"
                  className="rounded-lg h-11 sm:h-12 hover:border-indigo-400 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-colors"
                />
              </Form.Item>

              <div className="flex items-center justify-between mb-4 sm:mb-6">
                <Form.Item
                  name="rememberMe"
                  valuePropName="checked"
                  className="mb-0"
                >
                  <Checkbox className="text-sm text-gray-600 hover:text-gray-900 transition-colors">
                    Beni hatırla
                  </Checkbox>
                </Form.Item>

                <Link
                  to="/forgot-password"
                  className="text-sm font-medium text-indigo-600 hover:text-indigo-500 transition-colors"
                >
                  Şifremi unuttum
                </Link>
              </div>

              <Form.Item className="mb-0">
                <Button
                  type="primary"
                  htmlType="submit"
                  className="w-full bg-indigo-600 hover:bg-indigo-700 h-11 sm:h-12 text-base rounded-lg shadow-lg hover:shadow-xl transition-all duration-200"
                >
                  Giriş Yap
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

export default LoginForm; 