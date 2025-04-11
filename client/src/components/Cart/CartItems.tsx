import { useSelector, useDispatch } from 'react-redux';
import { Button } from 'antd';
import { RootState } from '../../redux/store';
import { updateQuantity, removeFromCart } from '../../redux/cartSlice';

const CartItems = () => {
  const { items } = useSelector((state: RootState) => state.cart);
  const dispatch = useDispatch();

  return (
    <div className="flex-1 bg-white rounded-lg shadow-sm p-6 h-[calc(100vh-180px)]">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-semibold text-gray-800">Alışveriş Sepeti</h1>
        <span className="text-gray-500">{items.length} Ürün</span>
      </div>

      <div className="space-y-6 overflow-y-auto h-[calc(100%-100px)] pr-2">
        {items.map((item) => (
          <div key={item.id} className="flex gap-6 pb-6 border-b border-gray-100">
            {/* Ürün Resmi */}
            <div className="w-24 h-24 flex-shrink-0">
              <img
                src={item.image}
                alt={item.title}
                className="w-full h-full object-cover rounded-lg"
              />
            </div>

            {/* Ürün Detayları */}
            <div className="flex-1">
              <h3 className="text-lg font-medium text-gray-800">{item.title}</h3>
              <button
                onClick={() => dispatch(removeFromCart(item.id))}
                className="text-sm text-red-500 hover:text-red-600 mt-1"
              >
                Kaldır
              </button>
            </div>

            {/* Miktar Kontrolü */}
            <div className="flex items-center gap-3">
              <Button
                onClick={() => dispatch(updateQuantity({ id: item.id, type: 'decrease' }))}
                className="border-gray-200 hover:border-gray-300"
              >
                -
              </Button>
              <span className="w-8 text-center">{item.quantity}</span>
              <Button
                onClick={() => dispatch(updateQuantity({ id: item.id, type: 'increase' }))}
                className="border-gray-200 hover:border-gray-300"
              >
                +
              </Button>
            </div>

            {/* Fiyat */}
            <div className="text-right">
              <div className="text-lg font-medium text-gray-800">
                ₺{(item.price * item.quantity).toFixed(2)}
              </div>
              <div className="text-sm text-gray-500">₺{item.price.toFixed(2)} / adet</div>
            </div>
          </div>
        ))}

        {items.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            Sepetinizde ürün bulunmamaktadır.
          </div>
        )}
      </div>
    </div>
  );
};

export default CartItems; 