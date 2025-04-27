import { Category } from '../types/category';

const BASE_URL = 'http://localhost:5000/api/categories';

const getToken = () => localStorage.getItem('token');

export const categoryService = {
  async getCategories(): Promise<Category[]> {
    const response = await fetch(BASE_URL, {
      headers: { 'Authorization': `Bearer ${getToken()}` }
    });
    if (!response.ok) throw new Error('Kategoriler yüklenirken hata oluştu');
    return response.json();
  },

  async addCategory(category: Category): Promise<Category> {
    const response = await fetch(BASE_URL, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${getToken()}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(category)
    });
    if (!response.ok) throw new Error('Kategori eklenirken hata oluştu');
    return response.json();
  },

  async updateCategory(id: string, category: Partial<Category>): Promise<Category> {
    const response = await fetch(`${BASE_URL}/${id}`, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${getToken()}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(category)
    });
    if (!response.ok) throw new Error('Kategori güncellenirken hata oluştu');
    return response.json();
  },

  async deleteCategory(id: string): Promise<void> {
    const response = await fetch(`${BASE_URL}/${id}`, {
      method: 'DELETE',
      headers: { 'Authorization': `Bearer ${getToken()}` }
    });
    if (!response.ok) throw new Error('Kategori silinirken hata oluştu');
  }
}; 