import React, { useEffect } from 'react';
import { Modal, Form, Input, InputNumber, Select, message } from 'antd';
import { Product, updateProduct } from '../../services/product';

interface EditProductModalProps {
  visible: boolean;
  product: Product | null;
  onClose: () => void;
  onSuccess: () => void;
}

const EditProductModal: React.FC<EditProductModalProps> = ({
  visible,
  product,
  onClose,
  onSuccess,
}) => {
  const [form] = Form.useForm();

  useEffect(() => {
    if (visible && product) {
      form.setFieldsValue({
        title: product.title,
        price: product.price,
        image: product.image,
        category: product.category,
      });
    }
  }, [visible, product, form]);

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      if (product) {
        await updateProduct(product._id, values);
        message.success('Ürün başarıyla güncellendi');
        onSuccess();
        onClose();
      }
    } catch (error) {
      console.error('Ürün güncellenirken hata:', error);
      message.error('Ürün güncellenirken bir hata oluştu');
    }
  };

  return (
    <Modal
      title="Ürün Düzenle"
      open={visible}
      onCancel={onClose}
      onOk={handleSubmit}
      okText="Güncelle"
      cancelText="İptal"
    >
      <Form form={form} layout="vertical">
        <Form.Item
          name="title"
          label="Ürün Adı"
          rules={[{ required: true, message: 'Lütfen ürün adını girin' }]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          name="price"
          label="Fiyat"
          rules={[{ required: true, message: 'Lütfen fiyatı girin' }]}
        >
          <InputNumber min={0} style={{ width: '100%' }} />
        </Form.Item>
        <Form.Item
          name="image"
          label="Resim URL"
          rules={[{ required: true, message: 'Lütfen resim URL\'ini girin' }]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          name="category"
          label="Kategori"
          rules={[{ required: true, message: 'Lütfen kategori seçin' }]}
        >
          <Select>
            <Select.Option value="pizza">Pizza</Select.Option>
            <Select.Option value="burger">Burger</Select.Option>
            <Select.Option value="drink">İçecek</Select.Option>
          </Select>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default EditProductModal; 