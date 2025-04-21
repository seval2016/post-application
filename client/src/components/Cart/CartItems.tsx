import { useSelector, useDispatch } from 'react-redux';
import { Button, Table, Image,  Typography } from 'antd';
import { MinusOutlined, PlusOutlined, DeleteOutlined } from '@ant-design/icons';
import { RootState } from '../../redux/store';
import { updateQuantity, removeFromCart } from '../../redux/cartSlice';
import '../../styles/components/Cart/CartItems.css';

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
          className="cart-product-image"
        />
      ),
    },
    {
      title: 'Ürün Adı',
      dataIndex: 'title',
      key: 'title',
      render: (text: string, record: CartItem) => (
        <div className="cart-product-info">
          <Text strong className="cart-product-title">{text}</Text>
          <Button
            type="link"
            danger
            icon={<DeleteOutlined />}
            onClick={() => dispatch(removeFromCart(record.id))}
            className="cart-remove-button"
          >
            Kaldır
          </Button>
        </div>
      ),
    },
    {
      title: 'Miktar',
      key: 'quantity',
      width: 150,
      render: (record: CartItem) => (
        <div className="cart-quantity-controls">
          <Button
            icon={<MinusOutlined />}
            onClick={() => dispatch(updateQuantity({ id: record.id, type: 'decrease' }))}
            className="cart-quantity-button"
          />
          <Text className="cart-quantity-text">{record.quantity}</Text>
          <Button
            icon={<PlusOutlined />}
            onClick={() => dispatch(updateQuantity({ id: record.id, type: 'increase' }))}
            className="cart-quantity-button"
          />
        </div>
      ),
    },
    {
      title: 'Fiyat',
      key: 'price',
      width: 150,
      render: (record: CartItem) => (
        <div className="cart-price-container">
          <Text strong className="cart-total-price">₺{(record.price * record.quantity).toFixed(2)}</Text>
          <Text type="secondary" className="cart-unit-price">₺{record.price.toFixed(2)} / adet</Text>
        </div>
      ),
    },
  ];

  return (
    <div className="cart-items-container">
      <div className="cart-header">
        <h1 className="cart-title">Alışveriş Sepeti</h1>
        <span className="cart-count">{items.length} Ürün</span>
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