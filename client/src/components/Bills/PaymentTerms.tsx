import React from 'react';
import { Card, Typography } from 'antd';
import '../../styles/Bills/PaymentTerms.css';

const { Text } = Typography;

const PaymentTerms: React.FC = () => {
  return (
    <Card className="payment-terms-card">
      <Text className="payment-terms-text">
        Ödeme koşulları 14 gündür. Paketlenmemiş Borçların Geç
        Ödenmesi Yasası 0000'e göre, serbest çalışanların bu süreden
        sonra borçların ödenmemesi durumunda 00.00 gecikme ücreti
        talep etme hakkına sahip olduklarını ve bu noktada bu ücrete
        ek olarak yeni bir fatura sunulacağını lütfen unutmayın.
        Revize faturanın 14 gün içinde ödenmemesi durumunda, vadesi
        geçmiş hesaba ek faiz ve %8 yasal oran artı %0,5 Bank of
        England tabanı olmak üzere toplam %8,5 uygulanacaktır.
        Taraflar Kanun hükümleri dışında sözleşme yapamazlar.
      </Text>
    </Card>
  );
};

export default PaymentTerms; 