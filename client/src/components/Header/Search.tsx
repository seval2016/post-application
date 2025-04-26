import React from 'react';
import { Input } from 'antd';
import { SearchOutlined } from '@ant-design/icons';
import '../../styles/Header/Search.css';

const SearchComponent: React.FC = () => {
  const onSearch = (value: string) => {
    if (!value.trim()) return;
    console.log('Search value:', value);
  };

  return (
    <div className="search-wrapper">
      <Input
        placeholder="Ürün ara..."
        allowClear
        onChange={(e) => onSearch(e.target.value)}
        suffix={<SearchOutlined className="search-icon" />}
        className="search-input"
      />
    </div>
  );
};

export default SearchComponent; 