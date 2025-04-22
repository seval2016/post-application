interface LoginCredentials {
  username: string;
  password: string;
}

interface LoginResponse {
  token: string;
}

export const login = async (credentials: LoginCredentials): Promise<LoginResponse> => {
  try {
    const response = await fetch('http://localhost:5000/api/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(credentials),
    });

    if (!response.ok) {
      throw new Error('Giriş başarısız');
    }

    const data = await response.json();
    localStorage.setItem('token', data.token);
    return data;
  } catch (error) {
    if (error instanceof Error) {
      throw new Error('Giriş yapılırken bir hata oluştu: ' + error.message);
    }
    throw new Error('Giriş yapılırken bir hata oluştu');
  }
};

export const logout = () => {
  localStorage.removeItem('token');
}; 