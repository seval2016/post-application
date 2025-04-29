import React from 'react';
import { Button, Result } from 'antd';
import { useNavigate } from 'react-router-dom';
import { HomeOutlined, ReloadOutlined } from '@ant-design/icons';

interface ErrorPageProps {
  status?: '403' | '404' | '500';
  title?: string;
  subTitle?: string;
}

const ErrorPage: React.FC<ErrorPageProps> = ({
  status = '404',
  title = 'Sayfa Bulunamadı',
  subTitle = 'Üzgünüz, aradığınız sayfa bulunamadı.'
}) => {
  const navigate = useNavigate();

  const getStatusConfig = () => {
    switch (status) {
      case '403':
        return {
          title: 'Erişim Reddedildi',
          subTitle: 'Üzgünüz, bu sayfaya erişim yetkiniz yok.'
        };
      case '404':
        return {
          title: 'Sayfa Bulunamadı',
          subTitle: 'Üzgünüz, aradığınız sayfa bulunamadı.'
        };
      case '500':
        return {
          title: 'Sunucu Hatası',
          subTitle: 'Üzgünüz, bir hata oluştu. Lütfen daha sonra tekrar deneyin.'
        };
      default:
        return {
          title,
          subTitle
        };
    }
  };

  const config = getStatusConfig();

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: '#f9fafb'
    }}>
      <Result
        status={status === '403' ? '403' : status === '404' ? '404' : '500'}
        title={config.title}
        subTitle={config.subTitle}
        extra={[
          <Button
            key="home"
            type="primary"
            icon={<HomeOutlined />}
            onClick={() => navigate('/')}
            style={{
              borderRadius: '8px',
              height: '40px',
              padding: '0 20px',
              fontSize: '14px',
              fontWeight: '500',
              backgroundColor: '#2563eb',
              borderColor: '#2563eb',
              boxShadow: 'none'
            }}
          >
            Ana Sayfaya Dön
          </Button>,
          <Button
            key="reload"
            icon={<ReloadOutlined />}
            onClick={() => window.location.reload()}
            style={{
              borderRadius: '8px',
              height: '40px',
              padding: '0 20px',
              fontSize: '14px',
              fontWeight: '500',
              borderColor: '#e5e7eb',
              color: '#374151'
            }}
          >
            Sayfayı Yenile
          </Button>
        ]}
        style={{
          padding: '40px',
          backgroundColor: '#ffffff',
          borderRadius: '16px',
          boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)'
        }}
      />
    </div>
  );
};

export default ErrorPage; 