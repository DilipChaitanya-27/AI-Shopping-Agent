import { useState, useEffect } from 'react';
import { filterProducts } from '../lib/filter';

export default function FiltersPanel({ products, currentFilters, onFiltersChange }) {
  const [localFilters, setLocalFilters] = useState(currentFilters || {});
  const [priceRange, setPriceRange] = useState([0, 2000]);
  const [brands, setBrands] = useState([]);
  const [ratings, setRatings] = useState([]);

  useEffect(() => {
    if (products.length > 0) {
      const allBrands = [...new Set(products.map(p => p.brand || p.vendor || 'Unknown').filter(Boolean))];
      const allRatings = [5, 4, 3, 2, 1];
      setBrands(allBrands);
      setRatings(allRatings);
      // Auto set max price
      const maxPrice = Math.max(...products.map(p => p.price || 0));
      setPriceRange([0, Math.ceil(maxPrice / 100) * 100]);
    }
  }, [products]);

  const handleApply = () => {
    const newFilters = {
      ...localFilters,
      minPrice: priceRange[0],
      maxPrice: priceRange[1],
    };
    onFiltersChange(newFilters);
  };

  const toggleBrand = (brand) => {
    setLocalFilters(prev => ({
      ...prev,
      brands: prev.brands?.includes(brand) 
        ? prev.brands.filter(b => b !== brand)
        : [...(prev.brands || []), brand]
    }));
  };

  const toggleRating = (rating) => {
    setLocalFilters(prev => ({
      ...prev,
      minRating: prev.minRating === rating ? undefined : rating
    }));
  };

  return (
    <div className="bg-white/80 backdrop-blur-sm border border-gray-200 rounded-2xl p-6 shadow-xl sticky top-20 z-10">
      <div className="flex items-center justify-between mb-6">
        <h3 className="font-bold text-lg text-gray-900">Filters</h3>
        <button 
          className="text-indigo-600 hover:text-indigo-700 font-semibold text-sm"
          onClick={handleApply}
        >
          Apply
        </button>
      </div>

      {/* Price Slider */}
      <div className="mb-6">
        <label className="block text-sm font-semibold text-gray-700 mb-2">Price Range</label>
        <div className="relative">
          <input
            type="range"
            min={0}
            max={priceRange[1]}
            value={priceRange[1]}
            onChange={(e) => setPriceRange([priceRange[0], parseInt(e.target.value)])}
            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-indigo-500 hover:accent-indigo-600"
          />
        </div>
        <div className="flex justify-between text-xs text-gray-500 mt-1">
          <span>₹{priceRange[0]}</span>
          <span>₹{priceRange[1]}</span>
        </div>
      </div>

      {/* Brands */}
      <div className="mb-6">
        <label className="block text-sm font-semibold text-gray-700 mb-3">Brands</label>
        <div className="grid grid-cols-2 gap-2">
          {brands.map(brand => (
            <label key={brand} className="flex items-center gap-2 p-2 rounded-xl hover:bg-indigo-50 cursor-pointer transition-all">
              <input
                type="checkbox"
                checked={localFilters.brands?.includes(brand) || false}
                onChange={() => toggleBrand(brand)}
                className="w-4 h-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
              />
              <span className="text-sm text-gray-700">{brand}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Rating */}
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-3">Min Rating</label>
        <div className="grid grid-cols-5 gap-1">
          {[5,4,3,2,1].map(rating => (
            <button
              key={rating}
              className={`p-2 rounded-lg text-xs font-semibold transition-all flex items-center justify-center ${
                localFilters.minRating === rating
                  ? 'bg-indigo-500 text-white shadow-md'
                  : 'bg-gray-100 hover:bg-indigo-100 text-gray-700'
              }`}
              onClick={() => toggleRating(rating)}
            >
              {rating}.0 ★
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

