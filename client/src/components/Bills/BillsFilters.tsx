import React from 'react';
import { Input, Select, DatePicker, Button, Space } from 'antd';
import { SearchOutlined, FilterOutlined } from '@ant-design/icons';

const { RangePicker } = DatePicker;

interface BillsFiltersProps {
  searchText: string;
  setSearchText: (text: string) => void;
  filterStatus: string | null;
  setFilterStatus: (status: string | null) => void;
  /* eslint-disable-next-line no-unused-vars */
  dateRange: [string, string] | null;
  setDateRange: (range: [string, string] | null) => void;
  clearFilters: () => void;
}

const BillsFilters: React.FC<BillsFiltersProps> = ({
  searchText,
  setSearchText,
  filterStatus,
  setFilterStatus,
  setDateRange,
  clearFilters
}) => {
  return (
    <Space className="w-full flex flex-wrap gap-4 mb-4">
      <Input
        placeholder="Fatura No veya Müşteri Ara"
        prefix={<SearchOutlined />}
        value={searchText}
        onChange={e => setSearchText(e.target.value)}
        className="w-full md:w-64"
      />
      <Select
        placeholder="Durum Filtrele"
        allowClear
        style={{ width: '100%', maxWidth: '200px' }}
        value={filterStatus}
        onChange={value => setFilterStatus(value)}
      >
        <Select.Option value="Ödendi">Ödendi</Select.Option>
        <Select.Option value="Beklemede">Beklemede</Select.Option>
        <Select.Option value="İptal Edildi">İptal Edildi</Select.Option>
      </Select>
      <RangePicker 
        /* eslint-disable-next-line no-unused-vars */
        onChange={(dates) => {
          if (dates) {
            setDateRange([
              dates[0]?.format('YYYY-MM-DD') || '',
              dates[1]?.format('YYYY-MM-DD') || ''
            ]);
          } else {
            setDateRange(null);
          }
        }}
        className="w-full md:w-auto"
      />
      <Button icon={<FilterOutlined />} onClick={clearFilters}>
        Filtreleri Temizle
      </Button>
    </Space>
  );
};

export default BillsFilters; 