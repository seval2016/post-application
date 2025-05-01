import React from 'react';
import { Form, Input, Button, message } from 'antd';
import { UserOutlined, LockOutlined, PhoneOutlined, ShopOutlined } from '@ant-design/icons';
import { Link, useNavigate } from 'react-router-dom';
import '../../styles/auth/RegisterForm.css';
import Logo from "../Header/Logo";
import { authService } from '../../services/authService';
import { validationUtils } from '../../utils/validationUtils';
import { storageUtils } from '../../utils/storageUtils';

interface RegisterFormData {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  phone: string;
  businessName: string;
}

const RegisterForm: React.FC = () => {
  const navigate = useNavigate();
  const [form] = Form.useForm();

  const onFinish = async (values: RegisterFormData) => {
    try {
      console.log('Register form values:', values);
      const response = await authService.register(values);
      storageUtils.setToken(response.data.token);
      message.success('Kayıt başarılı!');
      navigate('/');
    } catch (error) {
      if (error instanceof Error) {
        message.error(error.message);
      } else {
        message.error('Kayıt başarısız. Lütfen bilgilerinizi kontrol edin.');
      }
    }
  };

  return (
    <div className="register-container">
      <div className="register-content">
        <div className="register-form-wrapper">
          <div className="register-logo">
            <Logo />
          </div>

          <h2 className="register-title">Hesap Oluştur</h2>
          <p className="register-subtitle">
            veya{" "}
            <Link to="/login" className="register-link">
              zaten hesabınız varsa giriş yapın
            </Link>
          </p>

          <div className="register-form">
            <Form
              form={form}
              name="register"
              onFinish={onFinish}
              layout="vertical"
              className="w-full max-w-md"
            >
              <Form.Item
                name="firstName"
                rules={[
                  { required: true, message: validationUtils.name.required },
                  { min: validationUtils.name.minLength.value, message: validationUtils.name.minLength.message },
                  { pattern: /^[a-zA-ZğüşıöçĞÜŞİÖÇ\s]+$/, message: 'Ad sadece harf içermelidir (Türkçe karakterler kabul edilir)' }
                ]}
              >
                <Input
                  prefix={<UserOutlined />}
                  placeholder="Ad"
                  size="large"
                />
              </Form.Item>

              <Form.Item
                name="lastName"
                rules={[
                  { required: true, message: validationUtils.name.required },
                  { min: validationUtils.name.minLength.value, message: validationUtils.name.minLength.message },
                  { pattern: /^[a-zA-ZğüşıöçĞÜŞİÖÇ\s]+$/, message: 'Soyad sadece harf içermelidir (Türkçe karakterler kabul edilir)' }
                ]}
              >
                <Input
                  prefix={<UserOutlined />}
                  placeholder="Soyad"
                  size="large"
                />
              </Form.Item>

              <Form.Item
                name="email"
                rules={[
                  { required: true, message: validationUtils.email.required },
                  { pattern: validationUtils.email.pattern.value, message: validationUtils.email.pattern.message }
                ]}
              >
                <Input
                  prefix={<UserOutlined />}
                  placeholder="E-posta"
                  size="large"
                />
              </Form.Item>

              <Form.Item
                name="password"
                rules={[
                  { required: true, message: validationUtils.password.required },
                  { min: validationUtils.password.minLength.value, message: validationUtils.password.minLength.message },
                  { pattern: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/, message: 'Şifre en az bir büyük harf, bir küçük harf ve bir rakam içermelidir (örn: Test123)' }
                ]}
              >
                <Input.Password
                  prefix={<LockOutlined />}
                  placeholder="Şifre"
                  size="large"
                />
              </Form.Item>

              <Form.Item
                name="phone"
                rules={[
                  { required: true, message: 'Telefon numarası gereklidir' },
                  { pattern: /^[0-9]{10}$/, message: 'Geçerli bir telefon numarası giriniz (10 haneli, örn: 05551234567)' }
                ]}
              >
                <Input
                  prefix={<PhoneOutlined />}
                  placeholder="Telefon"
                  size="large"
                />
              </Form.Item>

              <Form.Item
                name="businessName"
                rules={[
                  { required: true, message: 'İşletme adı gereklidir' },
                  { min: 2, message: 'İşletme adı en az 2 karakter olmalıdır' }
                ]}
              >
                <Input
                  prefix={<ShopOutlined />}
                  placeholder="İşletme Adı"
                  size="large"
                />
              </Form.Item>

              <Form.Item>
                <Button type="primary" htmlType="submit" className="w-full" size="large">
                  Kayıt Ol
                </Button>
              </Form.Item>
            </Form>
          </div>
        </div>
      </div>

      <div className="register-footer">
        © 2024 - 2025 POS (Point Of Sales) v1.0.0
        <br />
        Designed & Developed by: MIRA IutaR-furaS
      </div>
    </div>
  );
};

export default RegisterForm; 