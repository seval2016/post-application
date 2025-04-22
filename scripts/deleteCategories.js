const axios = require('axios');

const deleteCategories = async () => {
  try {
    // Token'ı localStorage'dan al
    const token = localStorage.getItem('token');
    if (!token) {
      console.error('Token bulunamadı. Lütfen giriş yapın.');
      return;
    }

    // Tüm kategorileri getir
    const response = await axios.get('http://localhost:5000/api/categories', {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });

    const categories = response.data;
    console.log(`${categories.length} kategori bulundu.`);

    // Her kategoriyi sil
    for (const category of categories) {
      try {
        await axios.delete(`http://localhost:5000/api/categories/${category.id}`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        console.log(`Kategori silindi: ${category.id}`);
      } catch (error) {
        console.error(`Kategori silinirken hata oluştu (${category.id}):`, error.message);
      }
    }

    console.log('Tüm kategoriler silindi.');
  } catch (error) {
    console.error('Hata oluştu:', error.message);
  }
};

deleteCategories(); 