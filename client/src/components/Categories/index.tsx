import React, { useState, useEffect } from 'react';
import { AddCategoryModal } from './AddCategoryModal';
import { EditCategoryModal } from './EditCategoryModal';
import { message, Popconfirm } from 'antd';
import { DeleteOutlined, EditOutlined } from '@ant-design/icons';
import { categoryService } from '../../services/categoryService';
import '../../styles/Categories/Categories.css';
import { Category } from '../../types/category'; 

interface CategoriesProps {
  selectedCategory: string | undefined;
  setSelectedCategory: (categoryId: string | undefined) => void;
}

const Categories: React.FC<CategoriesProps> = ({ selectedCategory, setSelectedCategory }) => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  const fetchCategories = async () => {
    try {
      const data = await categoryService.getCategories();
      setCategories(data);
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

  const handleCategoryClick = (categoryId: string) => {
    if (categoryId) {
      setSelectedCategory(categoryId);
    }
  };

  const handleAddCategory = async (newCategory: Category) => {
    try {
      await categoryService.addCategory(newCategory);
      await fetchCategories();
      message.success('Kategori başarıyla eklendi');
    } catch (error) {
      message.error(error instanceof Error ? error.message : 'Kategori eklenirken bir hata oluştu');
    }
  };

  const handleEditCategory = async ({ name, imageUrl }: { name: string; imageUrl: string }) => {
    if (selectedCategory) {
      try {
        await categoryService.updateCategory(selectedCategory, { name, image: imageUrl });
        await fetchCategories();
        message.success('Kategori başarıyla güncellendi');
      } catch (error) {
        message.error(error instanceof Error ? error.message : 'Kategori güncellenirken bir hata oluştu');
      }
    }
  };

  const handleDeleteCategory = async (categoryId: string) => {
    try {
      await categoryService.deleteCategory(categoryId);
      setCategories(prevCategories => prevCategories.filter(category => category.id !== categoryId));
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
        <span className="categories-count">{categories.length} kategori</span>
      </div>
      
      <div className="categories-list"> 
        {/* All Categories Card */}
        <div
          className={`category-card ${
            selectedCategory === undefined ? 'category-card-selected' : 'category-card-default'
          }`}
          onClick={() => setSelectedCategory(undefined)}
        >
          <div className="category-content">
            <div className="category-icon-wrapper">
              <span className="category-icon">🏠</span>
            </div>
            <span className="category-title">Tümü</span>
          </div>
        </div>
        
        <div className="categories-scroll-area">
          {categories.length === 0 ? (
            <div className="flex items-center justify-center w-full h-full">
              <p className="text-gray-500">Henüz kategori eklenmemiş</p>
            </div>
          ) : (
            categories.map(category => (
              <div
                key={category.id}
                className={`category-card ${
                  selectedCategory === category.id ? 'category-card-selected' : 'category-card-default'
                }`}
                onClick={() => handleCategoryClick(category.id)}
              >
                <div className="category-content">
                  <div className="category-icon-wrapper">
                    {category.image ? (
                      <img src={category.image} alt={category.name} className="category-image" />
                    ) : (
                      <span className="category-icon">📁</span>
                    )}
                  </div>
                  <span className="category-title">{category.name}</span>
                </div>
                <div className="category-actions">
                  <EditOutlined 
                    className="category-edit-icon" 
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedCategory(category.id);
                      setIsEditModalOpen(true);
                    }}
                  />
                  <Popconfirm
                    title="Kategoriyi silmek istediğinize emin misiniz?"
                    onConfirm={(e) => {
                      e?.stopPropagation();
                      handleDeleteCategory(category.id);
                    }}
                    okText="Evet"
                    cancelText="Hayır"
                  >
                    <DeleteOutlined 
                      className="category-delete-icon" 
                      onClick={(e) => e.stopPropagation()}
                    />
                  </Popconfirm>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
      
      <div className="add-category-wrapper">
        <div
          className="category-card category-card-default"
          onClick={() => setIsAddModalOpen(true)}
        >
          <div className="category-content">
            <div className="category-icon-wrapper">
              <span className="category-icon">+</span>
            </div>
            <span className="category-title">Yeni Kategori Ekle</span>
          </div>
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
        categoryName={categories.find(c => c.id === selectedCategory)?.name || ''}
        categoryImage={categories.find(c => c.id === selectedCategory)?.image || ''}
      />
    </div>
  );
};

export default Categories;