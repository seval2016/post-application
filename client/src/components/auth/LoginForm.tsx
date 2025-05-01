import React, { useCallback } from 'react';
import { Form, Input, Button, Checkbox, message } from "antd";
import { Link, useNavigate } from "react-router-dom";
import Logo from "../Header/Logo";
import { UserOutlined, LockOutlined } from "@ant-design/icons";
import { authService } from "../../services/authService";
import { validationUtils } from '../../utils/validationUtils';
import { storageUtils } from '../../utils/storageUtils';
import '../../styles/auth/LoginForm.css';

interface LoginFormData {
    email: string;
    password: string;
    rememberMe: boolean;
}

const LoginForm: React.FC = React.memo(() => {
    const [form] = Form.useForm();
    const navigate = useNavigate();

    const onFinish = useCallback(async (values: LoginFormData) => {
        try {
            const { email, password } = values;
            const response = await authService.login({ email, password });
            if (response.success) {
                storageUtils.setToken(response.data.token);
                message.success("Giriş başarılı!");
                navigate('/');
            }
        } catch (error) {
            if (error instanceof Error) {
                message.error(error.message);
            } else {
                message.error('Giriş başarısız. Lütfen bilgilerinizi kontrol edin.');
            }
        }
    }, [navigate]);

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
                            className="w-full max-w-md"
                        >
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
                                    { min: validationUtils.password.minLength.value, message: validationUtils.password.minLength.message }
                                ]}
                            >
                                <Input.Password
                                    prefix={<LockOutlined />}
                                    placeholder="Şifre"
                                    size="large"
                                />
                            </Form.Item>

                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
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

                            <Form.Item>
                                <Button type="primary" htmlType="submit" className="w-full" size="large">
                                    Giriş Yap
                                </Button>
                            </Form.Item>
                        </Form>
                    </div>
                </div>
            </div>

            <div className="login-footer">
                © 2024 - 2025 POS (Point Of Sales) v1.0.0
                <br />
                Designed & Developed by: MIRA IutaR-furaS
            </div>
        </div>
    );
});

LoginForm.displayName = 'LoginForm';

export default LoginForm; 