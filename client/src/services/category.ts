import axios from 'axios';

interface Category {
  id: string;
  name: string;
  image: string;
}

export const addCategory = async (data: { name: string; image: string }): Promise<Category> => {
  try {
    // Validate input
    if (!data.name || data.name.trim() === '') {
      throw new Error('Kategori adı zorunludur');
    }
    if (!data.image || data.image.trim() === '') {
      throw new Error('Kategori görseli zorunludur');
    }

    // Get token
    const token = localStorage.getItem('token');
    if (!token) {
      throw new Error('Oturum bulunamadı. Lütfen tekrar giriş yapın.');
    }

    // Clean data
    const cleanData = {
      name: data.name.trim(),
      image: data.image.trim()
    };

    console.log('Gönderilen kategori verisi:', cleanData);

    const response = await axios.post('http://localhost:5000/api/categories', cleanData, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });
    
    console.log('Backend yanıtı:', response.data);

    // Return the response data directly
    return {
      id: response.data.id,
      name: response.data.name,
      image: response.data.image
    };
  } catch (error) {
    console.error('Kategori ekleme hatası:', error);
    if (axios.isAxiosError(error)) {
      const errorMessage = error.response?.data?.error || 'Kategori eklenirken bir hata oluştu';
      console.error('Detaylı hata:', error.response?.data);
      throw new Error(errorMessage);
    }
    throw error;
  }
}; 