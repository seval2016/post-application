import { EditOutlined, DeleteOutlined, ShoppingCartOutlined } from '@ant-design/icons';
import { Card, Button, Popconfirm } from 'antd';
import { useDispatch } from 'react-redux';
import { addToCart } from '../../redux/cartSlice';
import { Product } from '../../services/product';

interface ProductCardProps {
  item: Product;
  onEdit: (item: Product) => void;
  onDelete: (id: string) => void;
}

const { Meta } = Card;

const ProductCard: React.FC<ProductCardProps> = ({ item, onEdit, onDelete }) => {
  const dispatch = useDispatch();

  const handleAdd = () => {
    dispatch(addToCart({
      productId: item.id,
      title: item.title,
      price: item.price,
      image: item.image
    }));
  };

  const CardTitle = (
    <div className="flex justify-between items-center -mb-1">
      <span className="text-base truncate flex-1 font-sans text-[#165DDB]">{item.title}</span>
    </div>
  );

  const CardDescription = (
    <div className="flex justify-between items-center">
      <span className="text-sm font-sans text-gray-600">{Math.floor(item.price).toLocaleString('tr-TR')} TL</span>
      <Button 
        type="default"
        icon={<ShoppingCartOutlined />}
        onClick={handleAdd}
        className="border-none bg-transparent hover:bg-gray-100 hover:text-[#165DDB] transition-all duration-300 text-base ml-2"
      />
    </div>
  );

  return (
    <Card
      hoverable
      cover={
        <img 
          alt={item.title} 
          src={item.image}
          className="object-cover h-44" 
        />
      }
      styles={{
        body: { padding: '12px 16px' }
      }}
      actions={[
        <Button 
          key="edit"
          type="link" 
          icon={<EditOutlined />} 
          onClick={() => onEdit(item)}
        />,
        <Popconfirm
          key="delete"
          title={`${item.title} ürününü silmek istediğinize emin misiniz?`}
          onConfirm={() => onDelete(item._id)}
          okText="Evet"
          cancelText="Hayır"
          okType="primary"
          placement="top"
        >
          <Button 
            type="link" 
            danger
            icon={<DeleteOutlined />}
          />
        </Popconfirm>
      ]}
    >
      <Meta
        title={CardTitle}
        description={CardDescription}
      />
    </Card>
  );
};

export default ProductCard; 