import React, { Component, ReactNode } from 'react';
import { Result, Button } from 'antd';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: React.ErrorInfo | null;
}

class ErrorBoundaryClass extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null
    };
  }

  static getDerivedStateFromError(error: Error): State {
    return {
      hasError: true,
      error,
      errorInfo: null
    };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    this.setState({
      hasError: true,
      error: error,
      errorInfo: errorInfo
    });
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