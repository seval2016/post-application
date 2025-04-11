import { useSelector, useDispatch } from 'react-redux';
import { Button, Table, Image, Space, Typography } from 'antd';
import { MinusOutlined, PlusOutlined, DeleteOutlined } from '@ant-design/icons';
import { RootState } from '../../redux/store';
import { updateQuantity, removeFromCart } from '../../redux/cartSlice';

const { Text } = Typography;

interface CartItem {
  id: number;
  title: string;
  image: string;
  price: number;
  quantity: number;
}

const CartItems = () => {
  const { items } = useSelector((state: RootState) => state.cart);
  const dispatch = useDispatch();

  const columns = [
    {
      title: 'Ürün',
      dataIndex: 'image',
      key: 'image',
      width: 120,
      render: (image: string, record: CartItem) => (
        <Image
          src={image}
          alt={record.title}
          width={80}
          height={80}
          className="rounded-lg object-cover"
        />
      ),
    },
    {
      title: 'Ürün Adı',
      dataIndex: 'title',
      key: 'title',
      render: (text: string, record: CartItem) => (
        <Space direction="vertical" size={0}>
          <Text strong>{text}</Text>
          <Button
            type="link"
            danger
            icon={<DeleteOutlined />}
            onClick={() => dispatch(removeFromCart(record.id))}
            className="p-0 h-auto"
          >
            Kaldır
          </Button>
        </Space>
      ),
    },
    {
      title: 'Miktar',
      key: 'quantity',
      width: 150,
      render: (record: CartItem) => (
        <Space>
          <Button
            icon={<MinusOutlined />}
            onClick={() => dispatch(updateQuantity({ id: record.id, type: 'decrease' }))}
          />
          <Text>{record.quantity}</Text>
          <Button
            icon={<PlusOutlined />}
            onClick={() => dispatch(updateQuantity({ id: record.id, type: 'increase' }))}
          />
        </Space>
      ),
    },
    {
      title: 'Fiyat',
      key: 'price',
      width: 150,
      render: (record: CartItem) => (
        <Space direction="vertical" align="end" size={0}>
          <Text strong>₺{(record.price * record.quantity).toFixed(2)}</Text>
          <Text type="secondary" className="text-xs">₺{record.price.toFixed(2)} / adet</Text>
        </Space>
      ),
    },
  ];

  return (
    <div className="flex-1 bg-white rounded-lg shadow-sm p-6 h-[calc(100vh-180px)]">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-xl font-semibold text-gray-800">Alışveriş Sepeti</h1>
        <span className="text-gray-500">{items.length} Ürün</span>
      </div>

      <Table
        columns={columns}
        dataSource={items}
        rowKey="id"
        pagination={{
          pageSize: 5,
          showSizeChanger: false,
          showTotal: (total) => `Toplam ${total} ürün`,
          position: ['bottomCenter']
        }}
        locale={{
          emptyText: 'Sepetinizde ürün bulunmamaktadır.'
        }}
      />
    </div>
  );
};

export default CartItems; 