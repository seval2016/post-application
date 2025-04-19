import { Input } from 'antd';
import { SearchOutlined } from '@ant-design/icons';

const Search = () => {
  return (
    <div className="search-wrapper flex-1 flex justify-center items-center px-4">
      <Input 
        size="large" 
        placeholder="Ürün Ara..." 
        prefix={<SearchOutlined className="text-gray-400" />}
        className="rounded-full w-full max-w-2xl"
      />
    </div>
  );
};

export default Search; 