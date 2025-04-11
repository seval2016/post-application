interface CartSummaryProps {
  subtotal: number;
  vat: number;
  total: number;
}

const CartSummary: React.FC<CartSummaryProps> = ({ subtotal, vat, total }) => {
  return (
    <div className="mt-4 pt-4 border-t border-gray-100">
      <div className="flex justify-between items-center mb-2">
        <span className="text-xs text-gray-600">Ara Toplam:</span>
        <span className="text-sm font-medium text-gray-700">{subtotal.toFixed(2)}₺</span>
      </div>
      <div className="flex justify-between items-center mb-4">
        <span className="text-xs text-gray-600">KDV (%8):</span>
        <span className="text-sm font-medium text-gray-700">{vat.toFixed(2)}₺</span>
      </div>
      <div className="flex justify-between items-center mb-4 pt-2 border-t border-gray-100">
        <span className="text-sm font-semibold text-gray-700">Toplam:</span>
        <span className="text-base font-semibold text-brand-color">{total.toFixed(2)}₺</span>
      </div>
      <button className="w-full py-3 bg-brand-color hover:bg-brand-color/90 text-white text-sm font-medium rounded-lg transition-colors">
        Siparişi Tamamla
      </button>
    </div>
  );
};

export default CartSummary; 