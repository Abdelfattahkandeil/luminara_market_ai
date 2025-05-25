import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Filter, SlidersHorizontal, X, ChevronDown, Check } from 'lucide-react';
import { RootState } from '../store';
import { fetchProducts, setFilter, clearFilters } from '../store/slices/productsSlice';
import LoadingSpinner from '../components/ui/LoadingSpinner';
import { ProductCard } from '../components/product/ProductCard';

const ProductsPage: React.FC = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const location = useLocation();
  
  const { items, filteredItems, filters, isLoading, error } = useSelector((state: RootState) => state.products);
  
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [sortOption, setSortOption] = useState<string>('featured');
  const [sortMenuOpen, setSortMenuOpen] = useState(false);
  
  // Get available categories and brands from products
  const categories = Array.isArray(items) ? [...new Set(items.map(item => item.category))] : [];
  const brands = Array.isArray(items) ? [...new Set(items.map(item => item.brand))] : [];
  
  // Parse URL search params
  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    
    const urlFilters: any = {};
    
    if (searchParams.has('category')) {
      urlFilters.category = searchParams.get('category');
    }
    
    if (searchParams.has('brand')) {
      urlFilters.brand = searchParams.get('brand');
    }
    
    if (searchParams.has('min') && searchParams.has('max')) {
      urlFilters.priceRange = [
        parseInt(searchParams.get('min') || '0'),
        parseInt(searchParams.get('max') || '5000')
      ];
    }
    
    if (searchParams.has('inStock')) {
      urlFilters.availability = searchParams.get('inStock') === 'true';
    }
    
    if (searchParams.has('search')) {
      urlFilters.searchQuery = searchParams.get('search') || '';
    }
    
    if (Object.keys(urlFilters).length > 0) {
      dispatch(setFilter(urlFilters));
    }
    
    // Get sort option from URL
    if (searchParams.has('sort')) {
      setSortOption(searchParams.get('sort') || 'featured');
    }
    
  }, [location.search, dispatch]);
  
  // Fetch products
  useEffect(() => {
    dispatch(fetchProducts() as any);
  }, [dispatch]);
  
  // Handle filter changes
  const handleFilterChange = (filterType: string, value: any) => {
    let newFilter: any = {};
    
    switch (filterType) {
      case 'category':
        newFilter = { category: value === filters.category ? null : value };
        break;
      case 'brand':
        newFilter = { brand: value === filters.brand ? null : value };
        break;
      case 'price':
        newFilter = { priceRange: value };
        break;
      case 'availability':
        newFilter = { availability: value === filters.availability ? null : value };
        break;
      default:
        break;
    }
    
    dispatch(setFilter(newFilter));
  };
  
  // Handle sort change
  const handleSortChange = (option: string) => {
    setSortOption(option);
    setSortMenuOpen(false);
  };
  
  // Sort products
  const sortedProducts = Array.isArray(filteredItems) ? [...filteredItems].sort((a, b) => {
    switch (sortOption) {
      case 'price-low':
        return a.price - b.price;
      case 'price-high':
        return b.price - a.price;
      case 'rating':
        return b.rating - a.rating;
      case 'newest':
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      default:
        // Featured
        return b.featured ? 1 : -1;
    }
  }) : [];
  
  if (isLoading && (!Array.isArray(items) || items.length === 0)) {
    return <LoadingSpinner size="lg" />;
  }
  
  if (error && (!Array.isArray(items) || items.length === 0)) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold text-error mb-2">Oops, something went wrong!</h2>
        <p className="text-neutral-600 mb-6">{error}</p>
        <button
          onClick={() => dispatch(fetchProducts() as any)}
          className="btn-primary"
        >
          Try Again
        </button>
      </div>
    );
  }
  
  return (
    <div className="container mx-auto px-4">
      <div className="py-6">
        <h1 className="text-3xl font-bold mb-6">{t('nav.products')}</h1>
        
        {/* Filter and Sort Controls */}
        <div className="flex flex-wrap justify-between items-center mb-6 gap-4">
          <button
            onClick={() => setFiltersOpen(!filtersOpen)}
            className="btn-outline flex items-center"
          >
            <Filter size={16} className="mr-2" />
            {t('products.filter')}
          </button>
          
          <div className="relative">
            <button
              onClick={() => setSortMenuOpen(!sortMenuOpen)}
              className="btn-outline flex items-center"
            >
              <SlidersHorizontal size={16} className="mr-2" />
              {t('products.sort')}
              <ChevronDown size={16} className="ml-2" />
            </button>
            
            {sortMenuOpen && (
              <div className="absolute right-0 mt-1 w-48 bg-white rounded-md shadow-lg z-10 py-1">
                {[
                  { value: 'featured', label: 'Featured' },
                  { value: 'price-low', label: 'Price: Low to High' },
                  { value: 'price-high', label: 'Price: High to Low' },
                  { value: 'rating', label: 'Top Rated' },
                  { value: 'newest', label: 'Newest' },
                ].map(option => (
                  <button
                    key={option.value}
                    onClick={() => handleSortChange(option.value)}
                    className={`block w-full text-left px-4 py-2 text-sm ${
                      sortOption === option.value ? 'bg-primary/10 text-primary' : 'text-neutral-700 hover:bg-neutral-100'
                    }`}
                  >
                    <span className="flex items-center">
                      {sortOption === option.value && <Check size={14} className="mr-2" />}
                      {option.label}
                    </span>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
        
        <div className="flex flex-col md:flex-row gap-6">
          {/* Filters Sidebar */}
          <aside className={`md:w-64 flex-shrink-0 ${filtersOpen ? 'block' : 'hidden md:block'}`}>
            <div className="bg-white rounded-lg shadow-md p-4">
              <div className="flex justify-between items-center mb-4">
                <h3 className="font-medium">{t('products.filter')}</h3>
                <button
                  onClick={() => dispatch(clearFilters())}
                  className="text-primary text-sm hover:text-primary/80"
                >
                  Clear All
                </button>
              </div>
              
              {/* Price Range Filter */}
              <div className="mb-6">
                <h4 className="font-medium mb-3">{t('products.priceRange')}</h4>
                <div className="px-2">
                  <input
                    type="range"
                    min="0"
                    max="5000"
                    step="100"
                    value={filters.priceRange[1]}
                    onChange={(e) => handleFilterChange('price', [0, parseInt(e.target.value)])}
                    className="w-full"
                  />
                  <div className="flex justify-between mt-2 text-sm text-neutral-600">
                    <span>${filters.priceRange[0]}</span>
                    <span>${filters.priceRange[1]}</span>
                  </div>
                </div>
              </div>
              
              {/* Categories Filter */}
              <div className="mb-6">
                <h4 className="font-medium mb-3">{t('products.categories')}</h4>
                <div className="space-y-2">
                  {categories.map(category => (
                    <label key={category} className="flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={filters.category === category}
                        onChange={() => handleFilterChange('category', category)}
                        className="h-4 w-4 text-primary rounded border-neutral-300 focus:ring-primary"
                      />
                      <span className="ml-2 text-sm">{category}</span>
                    </label>
                  ))}
                </div>
              </div>
              
              {/* Brands Filter */}
              <div className="mb-6">
                <h4 className="font-medium mb-3">{t('products.brands')}</h4>
                <div className="space-y-2">
                  {brands.map(brand => (
                    <label key={brand} className="flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={filters.brand === brand}
                        onChange={() => handleFilterChange('brand', brand)}
                        className="h-4 w-4 text-primary rounded border-neutral-300 focus:ring-primary"
                      />
                      <span className="ml-2 text-sm">{brand}</span>
                    </label>
                  ))}
                </div>
              </div>
              
              {/* Availability Filter */}
              <div>
                <h4 className="font-medium mb-3">{t('products.availability')}</h4>
                <div className="space-y-2">
                  <label className="flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={filters.availability === true}
                      onChange={() => handleFilterChange('availability', true)}
                      className="h-4 w-4 text-primary rounded border-neutral-300 focus:ring-primary"
                    />
                    <span className="ml-2 text-sm">{t('products.inStock')}</span>
                  </label>
                </div>
              </div>
            </div>
          </aside>
          
          {/* Products Grid */}
          <div className="flex-grow">
            {/* Active Filters */}
            {(filters.category || filters.brand || filters.availability !== null || filters.searchQuery) && (
              <div className="mb-4 flex flex-wrap gap-2">
                {filters.category && (
                  <span className="inline-flex items-center bg-neutral-100 text-neutral-800 text-sm rounded-full px-3 py-1">
                    Category: {filters.category}
                    <button
                      onClick={() => handleFilterChange('category', null)}
                      className="ml-1 text-neutral-500 hover:text-neutral-700"
                    >
                      <X size={14} />
                    </button>
                  </span>
                )}
                
                {filters.brand && (
                  <span className="inline-flex items-center bg-neutral-100 text-neutral-800 text-sm rounded-full px-3 py-1">
                    Brand: {filters.brand}
                    <button
                      onClick={() => handleFilterChange('brand', null)}
                      className="ml-1 text-neutral-500 hover:text-neutral-700"
                    >
                      <X size={14} />
                    </button>
                  </span>
                )}
                
                {filters.availability !== null && (
                  <span className="inline-flex items-center bg-neutral-100 text-neutral-800 text-sm rounded-full px-3 py-1">
                    {filters.availability ? 'In Stock' : 'Out of Stock'}
                    <button
                      onClick={() => handleFilterChange('availability', null)}
                      className="ml-1 text-neutral-500 hover:text-neutral-700"
                    >
                      <X size={14} />
                    </button>
                  </span>
                )}
                
                {filters.searchQuery && (
                  <span className="inline-flex items-center bg-neutral-100 text-neutral-800 text-sm rounded-full px-3 py-1">
                    Search: {filters.searchQuery}
                    <button
                      onClick={() => dispatch(setFilter({ searchQuery: '' }))}
                      className="ml-1 text-neutral-500 hover:text-neutral-700"
                    >
                      <X size={14} />
                    </button>
                  </span>
                )}
              </div>
            )}
            
            {/* Results Count */}
            <p className="text-sm text-neutral-500 mb-4">
              Showing {sortedProducts.length} products
            </p>
            
            {/* Products Grid */}
            {sortedProducts.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {sortedProducts.map(product => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            ) : (
              <div className="text-center py-12 bg-white rounded-lg shadow-sm">
                <h3 className="text-xl font-semibold mb-2">No products found</h3>
                <p className="text-neutral-500 mb-6">
                  Try adjusting your filters or search criteria
                </p>
                <button
                  onClick={() => dispatch(clearFilters())}
                  className="btn-primary"
                >
                  Clear Filters
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductsPage;