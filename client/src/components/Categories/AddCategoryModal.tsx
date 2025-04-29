import React from 'react';
import { Modal, Form, Input, message } from 'antd';
import { categoryService } from '../../services/categoryService';


interface AddCategoryModalProps {
  visible: boolean;
  onCancel: () => void;
  onSuccess: () => void;
}

const AddCategoryModal: React.FC<AddCategoryModalProps> = ({ visible, onCancel, onSuccess }) => {
  const [form] = Form.useForm();

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      
      // Boş alanları kontrol et
      if (!values.name) {
        message.error('Kategori adı boş olamaz');
        return;
      }
      
      // Category tipine uygun veri oluştur (id alanı olmadan)
      const newCategory = {
        name: values.name,
        image: values.image || '',
        description: values.description || ''
      };
      
      console.log('Eklenen kategori:', newCategory); // Debug için
      
      try {
        const addedCategory = await categoryService.addCategory(newCategory);
        console.log('Sunucu yanıtı:', addedCategory); // Debug için
        
        message.success('Kategori başarıyla eklendi');
        form.resetFields();
        onSuccess();
      } catch (error: unknown) {
        console.error('Sunucu hatası:', error);
        const errorMessage = error instanceof Error 
          ? error.message 
          : typeof error === 'object' && error !== null && 'response' in error
            ? ((error.response as { data?: { message?: string } })?.data?.message || 'Sunucu hatası')
            : 'Bilinmeyen hata';
        message.error(`Kategori eklenirken bir hata oluştu: ${errorMessage}`);
      }
    } catch (error) {
      console.error('Form doğrulama hatası:', error);
      message.error('Lütfen tüm gerekli alanları doldurun');
    }
  };

  return (
    <Modal
      title="Yeni Kategori Ekle"
      open={visible}
      onCancel={onCancel}
      onOk={handleSubmit}
      okText="Ekle"
      cancelText="İptal"
    >
      <Form form={form} layout="vertical">
        <Form.Item
          name="name"
          label="Kategori Adı"
          rules={[{ required: true, message: 'Lütfen kategori adını giriniz' }]}
        >
          <Input />
        </Form.Item>
        
        <Form.Item
          name="description"
          label="Açıklama"
        >
          <Input.TextArea />
        </Form.Item>

        <Form.Item
          name="image"
          label="Kategori Görsel URL"
        >
          <Input placeholder="Görsel URL'sini giriniz" />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default AddCategoryModal;
