import { useState, useEffect } from 'react';
import categoriesData from '../data/categories.json';

interface Category {
  id: number;
  title: string;
  image: string;
}

export const useCategories = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);

  useEffect(() => {
    setCategories(categoriesData.categories);
    setSelectedCategory(categoriesData.categories[0]); // Select first category by default
  }, []);

  const addCategory = (title: string, image: string) => {
    const newCategory: Category = {
      id: categories.length + 1,
      title,
      image
    };
    setCategories([...categories, newCategory]);
  };

  return {
    categories,
    selectedCategory,
    setSelectedCategory,
    addCategory
  };
}; 