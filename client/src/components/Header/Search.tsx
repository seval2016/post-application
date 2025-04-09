import { Input } from 'antd';
import { SearchOutlined } from '@ant-design/icons';

const Search = () => {
  return (
    <div className="search-wrapper w-[300px] sm:w-[400px] md:w-[600px]">
      <Input 
        size="large" 
        placeholder="Ürün Ara..." 
        prefix={<SearchOutlined className="text-gray-400" />}
        className="rounded-full"
      />
    </div>
  );
};

export default Search; 