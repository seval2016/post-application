import React from 'react';
import { Form, Input, Button, Modal, Select } from 'antd';
import type { FormProps } from 'antd';

interface Category {
  id: number;
  title: string;
  image: string;
}

interface EditCategoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onEdit: (values: { title: string; imageUrl: string }) => void;
  categories: Category[];
}

export const EditCategoryModal: React.FC<EditCategoryModalProps> = ({ 
  isOpen, 
  onClose, 
  onEdit,
  categories 
}) => {
  const [form] = Form.useForm();

  const handleSubmit: FormProps<{ categoryId: number; title: string; imageUrl: string }>['onFinish'] = (values) => {
    const category = categories.find(c => c.id === values.categoryId);
    if (category) {
      onEdit({
        title: values.title || category.title,
        imageUrl: values.imageUrl || category.image
      });
      form.resetFields();
      onClose();
    }
  };

  return (
    <Modal
      title="Kategori Düzenle"
      open={isOpen}
      onCancel={onClose}
      footer={null}
      destroyOnClose
    >
      <Form
        form={form}
        layout="vertical"
        onFinish={handleSubmit}
        autoComplete="off"
      >
        <Form.Item
          name="categoryId"
          label="Düzenlenecek Kategori"
          rules={[{ required: true, message: 'Lütfen bir kategori seçin!' }]}
        >
          <Select
            placeholder="Kategori seçin"
            optionLabelProp="label"
          >
            {categories.map(category => (
              <Select.Option 
                key={category.id} 
                value={category.id}
                label={category.title}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <img 
                    src={category.image} 
                    alt={category.title} 
                    style={{ 
                      width: '24px', 
                      height: '24px', 
                      objectFit: 'cover',
                      borderRadius: '4px'
                    }} 
                  />
                  <span>{category.title}</span>
                </div>
              </Select.Option>
            ))}
          </Select>
        </Form.Item>

        <Form.Item
          label="Yeni Kategori Adı"
          name="title"
        >
          <Input placeholder="Yeni kategori adını girin" />
        </Form.Item>

        <Form.Item
          label="Yeni Görsel URL"
          name="imageUrl"
          rules={[{ type: 'url', message: 'Lütfen geçerli bir URL girin!' }]}
        >
          <Input placeholder="Yeni görsel URL'sini girin" />
        </Form.Item>

        <Form.Item className="mb-0 text-right">
          <Button onClick={onClose} className="mr-2">
            İptal
          </Button>
          <Button type="primary" htmlType="submit">
            Kaydet
          </Button>
        </Form.Item>
      </Form>
    </Modal>
  );
}; 