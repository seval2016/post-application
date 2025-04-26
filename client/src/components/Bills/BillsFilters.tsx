import React from 'react';
import { Input, Select, DatePicker, Button, Space } from 'antd';
import { SearchOutlined, FilterOutlined } from '@ant-design/icons';
import '../../styles/Bills/BillsFilters.css';

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
    <Space className="bills-filters-container">
      <Input
        placeholder="Fatura No veya Müşteri Ara"
        prefix={<SearchOutlined />}
        value={searchText}
        onChange={e => setSearchText(e.target.value)}
        className="bills-search-input"
      />
      <Select
        placeholder="Durum Filtrele"
        allowClear
        className="bills-status-select"
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
        className="bills-date-picker"
      />
      <Button icon={<FilterOutlined />} onClick={clearFilters} className="bills-clear-button">
        Filtreleri Temizle
      </Button>
    </Space>
  );
};

export default BillsFilters; 