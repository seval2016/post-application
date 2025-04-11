import { useState, useEffect } from 'react';
import categoriesData from '../../data/categories.json';

interface Category {
  id: number;
  title: string;
  image: string;
}

interface CategoriesProps {
  onCategorySelect: (categoryId: number | null) => void;
}

const Categories: React.FC<CategoriesProps> = ({ onCategorySelect }) => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<number | null>(null);

  useEffect(() => {
    setCategories(categoriesData.categories);
  }, []);

  const handleCategoryClick = (categoryId: number | null) => {
    setSelectedCategory(categoryId);
    onCategorySelect(categoryId);
  };

  return (
    <div className="categories bg-white p-4 rounded-lg shadow-sm md:h-[calc(100vh-100px)] md:sticky md:top-[84px]">
      <div className="flex items-center justify-between mb-4 pb-4 border-b border-gray-100">
        <h2 className="text-base font-medium text-gray-700">Kategoriler</h2>
        <span className="text-xs text-gray-500">{categories.length + 1}</span>
      </div>
      <div className="flex md:flex-col gap-3 overflow-x-auto md:overflow-y-auto md:h-[calc(100%-4rem)] md:pr-2 category-list [&::-webkit-scrollbar]:w-[6px] [&::-webkit-scrollbar-track]:bg-gray-100 [&::-webkit-scrollbar-track]:rounded-md [&::-webkit-scrollbar-thumb]:bg-gray-300 [&::-webkit-scrollbar-thumb]:rounded-md [&::-webkit-scrollbar-thumb:hover]:bg-gray-400">
        <div
          className={`category-card p-3 cursor-pointer transition-all select-none rounded-lg flex items-center gap-3 shadow-sm border border-gray-200 min-w-[150px] md:min-w-0
            ${selectedCategory === null 
              ? 'bg-blue-100 hover:bg-blue-200 border-blue-200' 
              : 'bg-gray-50 hover:bg-gray-100'
           }`}
          onClick={() => handleCategoryClick(null)}
        >
          <div className="w-8 h-8 min-w-[2rem] rounded-full bg-white p-1 shadow-sm flex items-center justify-center">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 text-gray-600">
              <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6A2.25 2.25 0 0 1 6 3.75h2.25A2.25 2.25 0 0 1 10.5 6v2.25a2.25 2.25 0 0 1-2.25 2.25H6a2.25 2.25 0 0 1-2.25-2.25V6ZM3.75 15.75A2.25 2.25 0 0 1 6 13.5h2.25a2.25 2.25 0 0 1 2.25 2.25V18a2.25 2.25 0 0 1-2.25 2.25H6A2.25 2.25 0 0 1 3.75 18v-2.25ZM13.5 6a2.25 2.25 0 0 1 2.25-2.25H18A2.25 2.25 0 0 1 20.25 6v2.25A2.25 2.25 0 0 1 18 10.5h-2.25a2.25 2.25 0 0 1-2.25-2.25V6ZM13.5 15.75a2.25 2.25 0 0 1 2.25-2.25H18a2.25 2.25 0 0 1 2.25 2.25V18A2.25 2.25 0 0 1 18 20.25h-2.25A2.25 2.25 0 0 1 13.5 18v-2.25Z" />
            </svg>
          </div>
          <span className="text-gray-700 text-sm font-medium whitespace-nowrap">Tümü</span>
        </div>

        {categories.map((category) => (
          <div
            key={category.id}
            className={`category-card p-3 cursor-pointer transition-all select-none rounded-lg flex items-center gap-3 shadow-sm border border-gray-200 min-w-[150px] md:min-w-0
              ${selectedCategory === category.id 
                ? 'bg-blue-100 hover:bg-blue-200 border-blue-200' 
                : 'bg-gray-50 hover:bg-gray-100'
              }`}
            onClick={() => handleCategoryClick(category.id)}
          >
            <div className="w-8 h-8 min-w-[2rem] rounded-full bg-white p-1 shadow-sm flex items-center justify-center">
              <img src={category.image} alt={category.title} className="w-6 h-6 object-contain" />
            </div>
            <span className="text-gray-700 text-sm font-medium whitespace-nowrap">{category.title}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Categories; 