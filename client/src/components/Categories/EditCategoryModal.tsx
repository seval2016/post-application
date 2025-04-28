import { Modal, Form, Input, Button, message } from 'antd';
import { useState, useEffect } from 'react';

interface EditCategoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onEdit: (values: { name: string; imageUrl: string }) => void;
  categoryName: string;
  categoryImage: string;
}

export const EditCategoryModal = ({ 
  isOpen, 
  onClose, 
  onEdit, 
  categoryName, 
  categoryImage 
}: EditCategoryModalProps) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);

  // Form değerlerini prop'lardan güncelle
  useEffect(() => {
    if (isOpen) {
      form.setFieldsValue({
        name: categoryName,
        imageUrl: categoryImage
      });
    }
  }, [isOpen, categoryName, categoryImage, form]);

  const handleSubmit = async (values: { name: string; imageUrl: string }) => {
    try {
      setLoading(true);
      onEdit(values);
      message.success('Kategori başarıyla güncellendi');
      handleClose();
    } catch (error) {
      if (error instanceof Error) {
        message.error(error.message);
      } else {
        message.error('Bir hata oluştu');
      }
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
          name="imageUrl"
          label="Resim URL"
          rules={[
            { required: true, message: 'Lütfen resim URL\'sini girin' },
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