// Fatura veri tipi
export interface Bill {
  id: string;
  date: string;
  customer: string;
  amount: number;
  status: 'Ödendi' | 'Beklemede' | 'İptal Edildi';
  items: number;
}

// Örnek fatura verileri
const mockBills: Bill[] = [
  {
    id: 'INV-2023-001',
    date: '2023-04-15',
    customer: 'Ahmet Yılmaz',
    amount: 1250.75,
    status: 'Ödendi',
    items: 5,
  },
  {
    id: 'INV-2023-002',
    date: '2023-04-10',
    customer: 'Mehmet Demir',
    amount: 850.50,
    status: 'Beklemede',
    items: 3,
  },
  {
    id: 'INV-2023-003',
    date: '2023-04-05',
    customer: 'Ayşe Kaya',
    amount: 2100.25,
    status: 'Ödendi',
    items: 7,
  },
  {
    id: 'INV-2023-004',
    date: '2023-03-28',
    customer: 'Fatma Şahin',
    amount: 1750.00,
    status: 'İptal Edildi',
    items: 4,
  },
  {
    id: 'INV-2023-005',
    date: '2023-03-20',
    customer: 'Ali Öztürk',
    amount: 950.75,
    status: 'Ödendi',
    items: 2,
  },
];

// Fatura servisi
export const billService = {
  // Tüm faturaları getir
  getAllBills: (): Promise<Bill[]> => {
    // Gerçek uygulamada burada API çağrısı yapılacak
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(mockBills);
      }, 500); // API çağrısını simüle etmek için gecikme
    });
  },

  // Fatura detayını getir
  getBillById: (id: string): Promise<Bill | undefined> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const bill = mockBills.find(bill => bill.id === id);
        resolve(bill);
      }, 300);
    });
  },

  // Yeni fatura oluştur
  createBill: (bill: Omit<Bill, 'id'>): Promise<Bill> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const newBill: Bill = {
          ...bill,
          id: `INV-${new Date().getFullYear()}-${String(mockBills.length + 1).padStart(3, '0')}`,
        };
        mockBills.push(newBill);
        resolve(newBill);
      }, 500);
    });
  },

  // Fatura durumunu güncelle
  updateBillStatus: (id: string, status: Bill['status']): Promise<Bill | undefined> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const billIndex = mockBills.findIndex(bill => bill.id === id);
        if (billIndex !== -1) {
          mockBills[billIndex] = { ...mockBills[billIndex], status };
          resolve(mockBills[billIndex]);
        } else {
          resolve(undefined);
        }
      }, 400);
    });
  }
}; 