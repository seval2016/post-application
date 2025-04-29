import { Modal, Form, Input, Button, message } from 'antd';
import { useState, useEffect } from 'react';
import { categoryService } from '../../services/categoryService';
import { Category } from '../../types/category';

interface EditCategoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  category: Category;
  onSuccess: () => void;
}

export const EditCategoryModal = ({ 
  isOpen, 
  onClose, 
  category,
  onSuccess
}: EditCategoryModalProps) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isOpen && category) {
      form.setFieldsValue({
        name: category.name,
        image: category.image || '',
        description: category.description || ''
      });
    }
  }, [isOpen, category, form]);

  const handleSubmit = async () => {
    try {
      setLoading(true);
      const values = await form.validateFields();
      
      const updatedCategory: Partial<Category> = {
        name: values.name,
        image: values.image,
        description: values.description
      };

      await categoryService.updateCategory(category.id, updatedCategory);
      message.success('Kategori başarıyla güncellendi');
      onSuccess();
      handleClose();
    } catch (error) {
      console.error('Error updating category:', error);
      message.error('Kategori güncellenirken bir hata oluştu');
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    form.resetFields();
    onClose();
  };

  return (
    <Modal
      title="Kategori Düzenle"
      open={isOpen}
      onCancel={handleClose}
      footer={null}
      destroyOnClose
    >
      <Form
        form={form}
        layout="vertical"
        name="editCategoryForm"
        onFinish={handleSubmit}
      >
        <Form.Item
          name="name"
          label="Kategori Adı"
          rules={[
            { required: true, message: 'Lütfen kategori adını girin' },
            { min: 2, message: 'Kategori adı en az 2 karakter olmalıdır' }
          ]}
        >
          <Input placeholder="Kategori adı" />
        </Form.Item>

        <Form.Item
          name="description"
          label="Açıklama"
        >
          <Input.TextArea placeholder="Kategori açıklaması" />
        </Form.Item>

        <Form.Item
          name="image"
          label="Resim URL"
          rules={[
            { type: 'url', message: 'Geçerli bir URL girin' }
          ]}
        >
          <Input placeholder="Resim URL'si" />
        </Form.Item>

        <Form.Item className="mb-0 text-right">
          <Button 
            onClick={handleClose} 
            className="mr-2" 
            disabled={loading}
          >
            İptal
          </Button>
          <Button type="primary" htmlType="submit" loading={loading}>
            Kaydet
          </Button>
        </Form.Item>
      </Form>
    </Modal>
  );
}; 