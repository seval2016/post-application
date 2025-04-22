import { useState, useEffect } from 'react';
import categoriesData from '../data/categories.json';

interface Category {
  id: string;
  title: string;
  image: string;
}

export const useCategories = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);

  useEffect(() => {
    // Convert numeric IDs to strings
    const categoriesWithStringIds = categoriesData.categories.map(category => ({
      ...category,
      id: String(category.id)
    }));
    setCategories(categoriesWithStringIds);
    setSelectedCategory(categoriesWithStringIds[0]); // Select first category by default
  }, []);

  const addCategory = (title: string, image: string) => {
    const newCategory: Category = {
      id: String(categories.length + 1),
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