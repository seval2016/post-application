import { useSelector } from 'react-redux';
import { Button } from 'antd';
import { RootState } from '../../redux/store';
import { useState } from 'react';
import OrderModal from '../../common/modals/OrderModal';
import '../../styles/Cart/OrderSummary.css';

const OrderSummary = () => {
  const { items, total } = useSelector((state: RootState) => state.cart);
  const [isModalVisible, setIsModalVisible] = useState(false);

  // KDV oranı %8 olarak hesaplanıyor
  const VAT_RATE = 0.08;
  const subtotal = total;
  const shipping: number = 0; // Standart kargo ücretsiz
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
      <div className="order-summary-header">
        <h2 className="order-summary-title">Sipariş Özeti</h2>
        <span className="order-item-count">{items.length} Ürün</span>
        </div>

      <div className="order-summary-items">
        <div className="order-summary-item">
          <span>Ara Toplam</span>
          <span>₺{subtotal.toFixed(2)}</span>
        </div>
        <div className="order-summary-item">
          <span>Kargo</span>
          <span>{shipping === 0 ? 'Ücretsiz' : `₺${shipping.toFixed(2)}`}</span>
        </div>
        <div className="order-summary-item">
          <span>KDV (%8)</span>
          <span>₺{vat.toFixed(2)}</span>
          </div>
        </div>

      <div className="order-summary-total">
        <span>Toplam</span>
        <span>₺{grandTotal.toFixed(2)}</span>
        </div>

      <div className="order-summary-actions">
        <Button 
          type="primary" 
          className="order-summary-button order-summary-button-primary" 
          onClick={showModal}
        >
          Ödeme Yap
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