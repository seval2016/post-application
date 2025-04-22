import { Modal, Form, Input, Select, Button, message } from 'antd';
import { useState } from 'react';

interface Category {
  id: string;
  name: string;
  image: string;
}

interface EditCategoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onEdit: (values: { name: string; imageUrl: string }) => void;
  categories: Category[];
}

export const EditCategoryModal = ({ isOpen, onClose, onEdit, categories }: EditCategoryModalProps) => {
  const [form] = Form.useForm();
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);

  const handleCategorySelect = (categoryId: string) => {
    const category = categories.find(c => c.id === categoryId);
    if (category) {
      setSelectedCategory(category);
      form.setFieldsValue({
        name: category.name,
        imageUrl: category.image
      });
    }
  };

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      if (!selectedCategory) {
        message.error('Lütfen düzenlenecek kategoriyi seçin');
        return;
      }

      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('Oturum bulunamadı. Lütfen tekrar giriş yapın.');
      }

      const response = await fetch(`http://localhost:5000/api/categories/${selectedCategory.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          name: values.name,
          image: values.imageUrl
        }),
      });

      if (!response.ok) {
        if (response.status === 401) {
          localStorage.removeItem('token');
          throw new Error('Oturumunuz sona erdi. Lütfen tekrar giriş yapın.');
        }
        throw new Error('Kategori güncellenirken bir hata oluştu');
      }

      onEdit(values);
      message.success('Kategori başarıyla güncellendi');
      handleClose();
    } catch (error) {
      if (error instanceof Error) {
        message.error(error.message);
      } else {
        message.error('Bir hata oluştu');
      }
    }
  };

  const handleClose = () => {
    form.resetFields();
    setSelectedCategory(null);
    onClose();
  };

  return (
    <Modal
      title="Kategori Düzenle"
      open={isOpen}
      onCancel={handleClose}
      footer={[
        <Button key="cancel" onClick={handleClose}>
          İptal
        </Button>,
        <Button key="submit" type="primary" onClick={handleSubmit}>
          Kaydet
        </Button>,
      ]}
    >
      <Form
        form={form}
        layout="vertical"
        name="editCategoryForm"
      >
        <Form.Item
          name="category"
          label="Düzenlenecek Kategori"
          rules={[{ required: true, message: 'Lütfen bir kategori seçin' }]}
        >
          <Select
            placeholder="Kategori seçin"
            onChange={handleCategorySelect}
          >
            {categories.map(category => (
              <Select.Option key={category.id} value={category.id}>
                {category.name}
              </Select.Option>
            ))}
          </Select>
        </Form.Item>

        <Form.Item
          name="name"
          label="Kategori Adı"
          rules={[
            { required: true, message: 'Lütfen kategori adını girin' },
            { min: 2, message: 'Kategori adı en az 2 karakter olmalıdır' }
          ]}
        >
          <Input placeholder="Yeni kategori adı" />
        </Form.Item>

        <Form.Item
          name="imageUrl"
          label="Resim URL"
          rules={[
            { required: true, message: 'Lütfen resim URL\'sini girin' },
            { type: 'url', message: 'Geçerli bir URL girin' }
          ]}
        >
          <Input placeholder="Yeni resim URL'si" />
        </Form.Item>
      </Form>
    </Modal>
  );
}; 