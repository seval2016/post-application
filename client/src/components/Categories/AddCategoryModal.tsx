import React from 'react';
import { Form, Input, Button, Modal } from 'antd';
import type { FormProps } from 'antd';

interface CategoryFormData {
  title: string;
  imageUrl: string;
}

interface AddCategoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (values: CategoryFormData) => void;
}

export const AddCategoryModal: React.FC<AddCategoryModalProps> = ({ isOpen, onClose, onAdd }) => {
  const [form] = Form.useForm();

  const handleSubmit: FormProps<CategoryFormData>['onFinish'] = (values) => {
    onAdd(values);
    form.resetFields();
    onClose();
  };

  return (
    <Modal
      title="Yeni Kategori Ekle"
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
          label="Kategori Adı"
          name="title"
          rules={[{ required: true, message: 'Lütfen kategori adını girin!' }]}
        >
          <Input placeholder="Kategori adını girin" />
        </Form.Item>

        <Form.Item
          label="Görsel URL"
          name="imageUrl"
          rules={[{ type: 'url', message: 'Lütfen geçerli bir URL girin!' }]}
        >
          <Input placeholder="Görsel URL'sini girin" />
        </Form.Item>

        <Form.Item className="mb-0 text-right">
          <Button onClick={onClose} className="mr-2">
            İptal
          </Button>
          <Button type="primary" htmlType="submit">
            Ekle
          </Button>
        </Form.Item>
      </Form>
    </Modal>
  );
};
