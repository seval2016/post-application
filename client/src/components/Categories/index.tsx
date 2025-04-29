import React, { useState, useEffect } from 'react';
import { message, Popconfirm } from 'antd';
import { EditOutlined, DeleteOutlined } from '@ant-design/icons';
import { categoryService } from '../../services/categoryService';
import { Category } from '../../types/category';
import AddCategoryModal from './AddCategoryModal';
import { EditCategoryModal } from './EditCategoryModal';
import '../../styles/Categories/Categories.css';

interface CategoriesProps {
  selectedCategory?: string;
  setSelectedCategory?: (categoryId: string | undefined) => void;
  onCategoryClick?: (category: Category) => void;
}

const Categories: React.FC<CategoriesProps> = ({ 
  selectedCategory, 
  setSelectedCategory,
  onCategoryClick 
}) => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [isAddModalVisible, setIsAddModalVisible] = useState(false);
  const [isEditModalVisible, setIsEditModalVisible] = useState(false);
  const [selectedCategoryForEdit, setSelectedCategoryForEdit] = useState<Category | null>(null);

  const fetchCategories = async () => {
    try {
      const data = await categoryService.getCategories();
      setCategories(data);
    } catch (error) {
      console.error('Error fetching categories:', error);
      message.error('Kategoriler yüklenirken bir hata oluştu');
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleCategoryClick = (category: Category) => {
    if (setSelectedCategory) {
      setSelectedCategory(category.id);
    }
    if (onCategoryClick) {
      onCategoryClick(category);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await categoryService.deleteCategory(id);
      message.success('Kategori başarıyla silindi');
      fetchCategories();
    } catch (error) {
      console.error('Error deleting category:', error);
      message.error('Kategori silinirken bir hata oluştu');
    }
  };

  const handleEdit = (category: Category) => {
    setSelectedCategoryForEdit(category);
    setIsEditModalVisible(true);
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
          onClick={() => setSelectedCategory && setSelectedCategory(undefined)}
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
                onClick={() => handleCategoryClick(category)}
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
                      handleEdit(category);
                    }}
                  />
                  <Popconfirm
                    title="Kategoriyi silmek istediğinizden emin misiniz?"
                    onConfirm={() => handleDelete(category.id)}
                    okText="Evet"
                    cancelText="Hayır"
                  >
                    <DeleteOutlined
                      className="category-edit-icon"
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
          onClick={() => setIsAddModalVisible(true)}
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
        visible={isAddModalVisible}
        onCancel={() => setIsAddModalVisible(false)}
        onSuccess={() => {
          setIsAddModalVisible(false);
          fetchCategories();
        }}
      />

      {selectedCategoryForEdit && (
        <EditCategoryModal
          isOpen={isEditModalVisible}
          onClose={() => {
            setIsEditModalVisible(false);
            setSelectedCategoryForEdit(null);
          }}
          category={selectedCategoryForEdit}
          onSuccess={fetchCategories}
        />
      )}
    </div>
  );
};

export default Categories;