"use client"
import { useEffect, useState } from "react";
import { Product_Category_dto, Product_dto } from "../services/product";
import { User } from "../lib/definitions.";
import View_Product from "./view_product";
import { Filter, X } from "lucide-react";

interface Props {
  allproducts: Product_Category_dto[];
  user: User | null;
}

export default function ProductsOverview({ allproducts, user }: Props) {
  // Ensure that allproducts is not empty before accessing index 0
  const [selectedCategory, setSelected] = useState<string>(
    allproducts.length > 0 ? allproducts[0].category : ""
  );
  const [products, setProducts] = useState<Product_dto[]>([]);

  // Get unique categories
  const categories: string[] = Array.from(new Set(allproducts.map((v) => v.category)));

  // Filter products based on selected category
  useEffect(() => {
    const filteredProducts: Product_dto[] = selectedCategory
      ? allproducts.find((categoryGroup) => categoryGroup.category === selectedCategory)?.products ?? []
      : allproducts.flatMap((categoryGroup) => categoryGroup.products);

    setProducts(filteredProducts);
  }, [selectedCategory, allproducts]);

  return (
    <div className="col-span-2 w-full px-6 py-8 bg-white shadow-md rounded-lg h-fit">
      {/* Title */}
      <h2 className="text-3xl font-semibold text-gray-900 dark:text-white relative pb-3 border-b-2 border-blue-500">
        Products List
      </h2>

      {/* Filter Section */}
      <div className="mt-6 flex flex-col md:flex-row items-start md:items-center gap-4">
        <label className="text-gray-800 dark:text-white text-lg font-medium flex items-center gap-2">
          <Filter size={20} /> Filter by Category:
        </label>

        <div className="flex flex-wrap gap-3">
          <select
            value={selectedCategory}
            onChange={(e) => setSelected(e.target.value)}
            className="px-4 py-2 rounded-md text-sm font-medium border border-gray-300 bg-white text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white dark:border-gray-600"
          >
            <option value="">All</option>
            {categories.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>

          <button
            onClick={() => setSelected("")}
            className={`flex items-center gap-2 px-6 py-2 rounded-full text-sm font-medium transition-all duration-300 ease-in-out transform hover:scale-105 focus:outline-none ${
              selectedCategory === ""
                ? "bg-blue-600 text-white shadow-lg"
                : "bg-gray-200 text-gray-800 hover:bg-gray-300 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600"
            }`}
          >
            <X size={16} /> Clear Filter
          </button>
        </div>
      </div>

      {/* Product List */}
      <div className="flex flex-row gap-10">
        {products.length > 0 ? (
          products.map((product) => (
            <div key={product.id} className="transform transition duration-300 hover:scale-105">
              <View_Product product={product} userId={user?.id ?? ""} role={user?.role ?? ""} />
            </div>
          ))
        ) : (
          <p className="text-gray-500 text-center py-8 col-span-full">No products found</p>
        )}
      </div>
    </div>
  );
}
