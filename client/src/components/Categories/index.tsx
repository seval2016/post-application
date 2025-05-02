import React, { useState, useEffect } from 'react';
import { Button, Modal, Form, Input, message, Popconfirm } from 'antd';
import { EditOutlined, DeleteOutlined, PlusOutlined, AppstoreOutlined } from '@ant-design/icons';
import { Category } from '../../types/category';
import { categoryService } from '../../services/categoryService';
import '../../styles/Categories/Categories.css';

const Categories: React.FC = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [form] = Form.useForm();

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      setLoading(true);
      const data = await categoryService.getCategories();
      setCategories(data);
    } catch (error: unknown) {
      console.error('Kategoriler yüklenirken hata:', error);
      message.error('Kategoriler yüklenirken bir hata oluştu');
    } finally {
      setLoading(false);
    }
  };

  const handleAdd = async (values: { name: string; image: string }) => {
    try {
      await categoryService.addCategory(values);
      message.success('Kategori başarıyla eklendi');
      fetchCategories();
      setIsModalVisible(false);
      form.resetFields();
    } catch (error: unknown) {
      console.error('Kategori eklenirken hata:', error);
      message.error('Kategori eklenirken bir hata oluştu');
    }
  };

  const handleEdit = async (values: { name: string; image: string }) => {
    if (!editingCategory) return;
    
    try {
      await categoryService.updateCategory(editingCategory.id, values);
      message.success('Kategori başarıyla güncellendi');
      fetchCategories();
      setIsModalVisible(false);
      form.resetFields();
      setEditingCategory(null);
    } catch (error: unknown) {
      console.error('Kategori güncellenirken hata:', error);
      message.error('Kategori güncellenirken bir hata oluştu');
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await categoryService.deleteCategory(id);
      message.success('Kategori başarıyla silindi');
      fetchCategories();
    } catch (error: unknown) {
      console.error('Kategori silinirken hata:', error);
      message.error('Kategori silinirken bir hata oluştu');
    }
  };

  const showModal = (category?: Category) => {
    if (category) {
      setEditingCategory(category);
      form.setFieldsValue(category);
    } else {
      setEditingCategory(null);
      form.resetFields();
    }
    setIsModalVisible(true);
  };

  const handleModalOk = () => {
    form.submit();
  };

  const handleModalCancel = () => {
    setIsModalVisible(false);
    form.resetFields();
    setEditingCategory(null);
  };

  return (
    <div className="categories-container">
      <div className="categories-header">
        <div>
          <h2 className="categories-title">Kategoriler</h2>
          <p className="categories-count">{categories.length} kategori</p>
        </div>
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={() => showModal()}
        >
          Yeni Kategori
        </Button>
      </div>

      <div className="categories-list">
        <div className="categories-scroll-area">
          <div className="category-card">
            <div className="category-content">
              <div className="category-icon-wrapper">
                <div className="category-icon">
                  <AppstoreOutlined />
                </div>
              </div>
              <h3 className="category-title">Tümü</h3>
            </div>
          </div>
          {categories.map(category => (
            <div key={category.id} className="category-card">
              <div className="category-content">
                <div className="category-icon-wrapper">
                  {category.image ? (
                    <img
                      src={category.image}
                      alt={category.name}
                      className="category-image"
                    />
                  ) : (
                    <div className="category-icon">
                      <EditOutlined />
                    </div>
                  )}
                </div>
                <h3 className="category-title">{category.name.charAt(0).toUpperCase() + category.name.slice(1)}</h3>
                <div className="category-actions">
                  <Button
                    type="text"
                    icon={<EditOutlined />}
                    onClick={() => showModal(category)}
                  />
                  <Popconfirm
                    title="Kategoriyi silmek istediğinize emin misiniz?"
                    onConfirm={() => handleDelete(category.id)}
                    okText="Evet"
                    cancelText="Hayır"
                  >
                    <Button
                      type="text"
                      icon={<DeleteOutlined />}
                    />
                  </Popconfirm>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <Modal
        title={editingCategory ? 'Kategori Düzenle' : 'Yeni Kategori Ekle'}
        open={isModalVisible}
        onOk={handleModalOk}
        onCancel={handleModalCancel}
        confirmLoading={loading}
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={editingCategory ? handleEdit : handleAdd}
        >
          <Form.Item
            name="name"
            label="Kategori Adı"
            rules={[{ required: true, message: 'Lütfen kategori adını girin!' }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            name="image"
            label="Kategori Görseli"
            rules={[{ required: true, message: 'Lütfen kategori görseli yükleyin!' }]}
          >
            <Input />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default Categories;