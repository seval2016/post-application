import React, { Component, ErrorInfo, ReactNode } from 'react';
import { Result, Button } from 'antd';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

class ErrorBoundaryClass extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      hasError: false,
      error: null
    };
  }

  static getDerivedStateFromError(error: Error): State {
    return {
      hasError: true,
      error
    };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    console.error('Error caught by ErrorBoundary:', error, errorInfo);
  }

  render(): ReactNode {
    if (this.state.hasError) {
      return (
        <Result
          status="error"
          title="Bir hata oluştu"
          subTitle={this.state.error?.message || 'Beklenmeyen bir hata oluştu.'}
          extra={[
            <Button type="primary" key="reload" onClick={() => window.location.reload()}>
              Sayfayı Yenile
            </Button>,
            <Button key="home" onClick={() => window.location.href = '/'}>
              Ana Sayfaya Dön
            </Button>
          ]}
        />
      );
    }

    return this.props.children;
  }
}

// Wrap the class component with a function component to use hooks
const ErrorBoundary: React.FC<Props> = (props) => {
  return <ErrorBoundaryClass {...props} />;
};

export default ErrorBoundary; 