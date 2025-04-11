import { useSelector } from 'react-redux';
import { Button, Input, Select } from 'antd';
import { RootState } from '../../redux/store';
import { useState } from 'react';
import OrderModal from '../../common/modals/OrderModal';

const OrderSummary = () => {
  const { items, total } = useSelector((state: RootState) => state.cart);
  const [isModalVisible, setIsModalVisible] = useState(false);

  // KDV oranı %8 olarak hesaplanıyor
  const VAT_RATE = 0.08;
  const subtotal = total;
  const shipping = 0; // Ücretsiz kargo
  const vat = subtotal * VAT_RATE;
  const grandTotal = subtotal + vat + shipping;

  const showModal = () => {
    setIsModalVisible(true);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  const handleOrderSuccess = () => {
    // Sipariş başarılı olduğunda yapılacak işlemler
    console.log('Sipariş başarıyla tamamlandı');
  };

  return (
    <div className="lg:w-[400px]">
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h2 className="text-xl font-semibold text-gray-800 mb-6">Sipariş Özeti</h2>
        
        {/* Ürün Sayısı */}
        <div className="text-sm text-gray-600 mb-6">
          ÜRÜN {items.length}
        </div>

        {/* Kargo Seçenekleri */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-600 mb-2">
            KARGO
          </label>
          <Select
            defaultValue="standard"
            style={{ width: '100%' }}
            options={[
              { value: 'standard', label: 'Standart Teslimat - Ücretsiz' },
              { value: 'express', label: 'Express Teslimat - ₺24.99' },
            ]}
          />
        </div>

        {/* Promosyon Kodu */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-600 mb-2">
            PROMOSYON KODU
          </label>
          <div className="flex gap-2">
            <Input placeholder="Kodunuzu girin" />
            <Button type="primary" className="bg-blue-500">
              UYGULA
            </Button>
          </div>
        </div>

        {/* Fiyat Detayları */}
        <div className="space-y-3 mb-6">
          <div className="flex justify-between text-gray-600">
            <span>Ara Toplam</span>
            <span>₺{subtotal.toFixed(2)}</span>
          </div>
          <div className="flex justify-between text-gray-600">
            <span>Kargo</span>
            <span>{shipping === 0 ? 'Ücretsiz' : `₺${shipping}`}</span>
          </div>
          <div className="flex justify-between text-gray-600">
            <span>KDV (%8)</span>
            <span>₺{vat.toFixed(2)}</span>
          </div>
        </div>

        {/* Toplam */}
        <div className="flex justify-between items-center text-lg font-semibold border-t pt-4">
          <span>Toplam</span>
          <span>₺{grandTotal.toFixed(2)}</span>
        </div>

        {/* Ödeme Butonu */}
        <Button type="primary" size="large" block className="bg-indigo-600 mt-6" onClick={showModal}>
          ÖDEME YAP
        </Button>
      </div>

      {/* Sipariş Modalı */}
      <OrderModal 
        isVisible={isModalVisible}
        onCancel={handleCancel}
        onSuccess={handleOrderSuccess}
      />
    </div>
  );
};

export default OrderSummary;