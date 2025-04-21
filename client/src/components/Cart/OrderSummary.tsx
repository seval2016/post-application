import { useSelector } from 'react-redux';
import { Button, Input, Select, Typography } from 'antd';
import { RootState } from '../../redux/store';
import { useState } from 'react';
import OrderModal from '../../common/modals/OrderModal';
import '../../styles/components/Cart/OrderSummary.css';

const { Text } = Typography;

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
    <div className="order-summary-container">
      <div className="order-summary-card">
        <h2 className="order-summary-title">Sipariş Özeti</h2>
        
        {/* Ürün Sayısı */}
        <div className="order-item-count">
          ÜRÜN {items.length}
        </div>

        {/* Kargo Seçenekleri */}
        <div className="order-section">
          <label className="order-section-label">
            KARGO
          </label>
          <Select
            defaultValue="standard"
            className="order-shipping-select"
            options={[
              { value: 'standard', label: 'Standart Teslimat - Ücretsiz' },
              { value: 'express', label: 'Express Teslimat - ₺24.99' },
            ]}
          />
        </div>

        {/* Promosyon Kodu */}
        <div className="order-section">
          <label className="order-section-label">
            PROMOSYON KODU
          </label>
          <div className="order-promo-container">
            <Input placeholder="Kodunuzu girin" className="order-promo-input" />
            <Button type="primary" className="order-promo-button">
              UYGULA
            </Button>
          </div>
        </div>

        {/* Fiyat Detayları */}
        <div className="order-details">
          <div className="order-detail-row">
            <Text>Ara Toplam</Text>
            <Text>₺{subtotal.toFixed(2)}</Text>
          </div>
          <div className="order-detail-row">
            <Text>Kargo</Text>
            <Text>{shipping === 0 ? 'Ücretsiz' : `₺${shipping}`}</Text>
          </div>
          <div className="order-detail-row">
            <Text>KDV (%8)</Text>
            <Text>₺{vat.toFixed(2)}</Text>
          </div>
        </div>

        {/* Toplam */}
        <div className="order-total-container">
          <Text strong>Toplam</Text>
          <Text strong>₺{grandTotal.toFixed(2)}</Text>
        </div>

        {/* Ödeme Butonu */}
        <Button type="primary" size="large" className="order-submit-button" onClick={showModal}>
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