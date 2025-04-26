import React, { useState, useEffect } from 'react';
import { AddCategoryModal } from './AddCategoryModal';
import { EditCategoryModal } from './EditCategoryModal';
import { message, Popconfirm, Card, Skeleton } from 'antd';
import { DeleteOutlined } from '@ant-design/icons';
import '../../styles/Categories/Categories.css';
import { getCategories } from '../../services/api';

interface Category {
  id: string;
  name: string;
  image: string;
}

interface BackendCategory {
  id: string;
  name: string;
  image: string;
}

interface CategoriesProps {
  onCategorySelect: (categoryId: string | null) => void;
  onCategoriesLoaded?: (categories: Category[]) => void;
}

const Categories = ({ onCategorySelect, onCategoriesLoaded }: CategoriesProps) => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  const fetchCategories = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:5000/api/categories', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (!response.ok) {
        if (response.status === 401) {
          throw new Error('Oturum süreniz dolmuş olabilir. Lütfen tekrar giriş yapın.');
        }
        throw new Error('Kategoriler yüklenirken bir hata oluştu');
      }
      
      const data = await response.json();
      console.log('Backend\'den gelen kategoriler:', data);
      setCategories(data.map((category: BackendCategory) => ({
        id: category.id,
        name: category.name,
        image: category.image
      })));
    } catch (error) {
      if (error instanceof Error) {
        message.error(error.message);
      } else {
        message.error('Kategoriler yüklenirken bir hata oluştu');
      }
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  useEffect(() => {
    if (categories.length > 0 && onCategoriesLoaded) {
      onCategoriesLoaded(categories);
    }
  }, [categories, onCategoriesLoaded]);

  const handleCategoryClick = (categoryId: string | null) => {
    setSelectedCategory(categoryId);
    onCategorySelect(categoryId);
  };

  const handleAddCategory = (newCategory: Category) => {
    setCategories(prevCategories => [...prevCategories, newCategory]);
    fetchCategories(); // Kategorileri yeniden yükle
  };

  const handleEditCategory = ({ name, imageUrl }: { name: string; imageUrl: string }) => {
    if (selectedCategory) {
      setCategories(prevCategories => 
        prevCategories.map(category => 
          category.id === selectedCategory
            ? { ...category, name, image: imageUrl }
            : category
        )
      );
    }
  };

  const handleDeleteCategory = async (categoryId: string) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('Oturum bulunamadı. Lütfen tekrar giriş yapın.');
      }

      const response = await fetch(`http://localhost:5000/api/categories/${categoryId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        if (response.status === 401) {
          throw new Error('Oturumunuz sona erdi. Lütfen tekrar giriş yapın.');
        }
        throw new Error('Kategori silinirken bir hata oluştu');
      }

      // Kategoriyi state'den kaldır
      setCategories(prevCategories => prevCategories.filter(category => category.id !== categoryId));
      
      // Eğer silinen kategori seçiliyse, seçimi temizle
      if (selectedCategory === categoryId) {
        setSelectedCategory(null);
        onCategorySelect(null);
      }
      
      message.success('Kategori başarıyla silindi');
    } catch (error) {
      if (error instanceof Error) {
        message.error(error.message);
      } else {
        message.error('Kategori silinirken bir hata oluştu');
      }
    }
  };

  return (
    <div className="categories-container">
      <div className="categories-header">
        <h2 className="categories-title">Kategoriler</h2>
        <span className="categories-count">{categories.length + 1}</span>
      </div>
      <div className="categories-list">
        <div className="categories-scroll-area">
          <div
            key="all-categories"
            className={`category-card ${
              selectedCategory === null ? 'category-card-selected' : 'category-card-default'
            }`}
            onClick={() => handleCategoryClick(null)}
          >
            <div className="category-icon-wrapper">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="category-icon">
                <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6A2.25 2.25 0 0 1 6 3.75h2.25A2.25 2.25 0 0 1 10.5 6v2.25a2.25 2.25 0 0 1-2.25 2.25H6a2.25 2.25 0 0 1-2.25-2.25V6ZM3.75 15.75A2.25 2.25 0 0 1 6 13.5h2.25a2.25 2.25 0 0 1 2.25 2.25V18a2.25 2.25 0 0 1-2.25 2.25H6A2.25 2.25 0 0 1 3.75 18v-2.25ZM13.5 6a2.25 2.25 0 0 1 2.25-2.25H18A2.25 2.25 0 0 1 20.25 6v2.25A2.25 2.25 0 0 1 18 10.5h-2.25a2.25 2.25 0 0 1-2.25-2.25V6ZM13.5 15.75a2.25 2.25 0 0 1 2.25-2.25H18a2.25 2.25 0 0 1 2.25 2.25V18A2.25 2.25 0 0 1 18 20.25h-2.25A2.25 2.25 0 0 1 13.5 18v-2.25Z" />
              </svg>
            </div>
            <span className="category-title">Tümü</span>
          </div>

          {categories.map((category) => (
            <div
              key={category.id}
              className={`category-card ${
                selectedCategory === category.id ? 'category-card-selected' : 'category-card-default'
              }`}
            >
              <div 
                className="category-content"
                onClick={() => handleCategoryClick(category.id)}
              >
                <div className="category-icon-wrapper">
                  <img src={category.image} alt={category.name} className="category-image" />
                </div>
                <span className="category-title">{category.name}</span>
              </div>
              <Popconfirm
                title="Kategoriyi silmek istediğinize emin misiniz?"
                onConfirm={() => handleDeleteCategory(category.id)}
                okText="Evet"
                cancelText="Hayır"
              >
                <DeleteOutlined className="category-delete-icon" />
              </Popconfirm>
            </div>
          ))}
        </div>
      </div>

      <div className="add-category-wrapper">
        <div key="add-category" className="category-card category-card-default" onClick={() => setIsAddModalOpen(true)}>
          <div className="category-icon-wrapper">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="category-icon">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
            </svg>
          </div>
          <span className="category-title">Kategori Ekle</span>
        </div>

        <div key="edit-category" className="category-card category-card-default mt-2" onClick={() => setIsEditModalOpen(true)}>
          <div className="category-icon-wrapper">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="category-icon">
              <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10" />
            </svg>
          </div>
          <span className="category-title">Kategori Düzenle</span>
        </div>
      </div>

      <AddCategoryModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onAdd={handleAddCategory}
      />

      <EditCategoryModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        onEdit={handleEditCategory}
        categories={categories}
        onRefresh={fetchCategories}
      />
    </div>
  );
};

export default Categories; 