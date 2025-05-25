import React, { useState, useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Search, X } from 'lucide-react';
import { RootState } from '../../store';
import { setFilter, addToSearchHistory } from '../../store/slices/productsSlice';
import debounce from 'lodash.debounce';

const SearchBar: React.FC = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { items: products } = useSelector((state: RootState) => state.products);
  const { searchHistory } = useSelector((state: RootState) => state.products);
  
  const [searchQuery, setSearchQuery] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [searchResults, setSearchResults] = useState<Array<{ id: string; name: string; thumbnail: string; price: number }>>([]);
  
  const searchRef = useRef<HTMLDivElement>(null);
  
  // Close search results when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);
  
  // Debounced search function
  const debouncedSearch = useRef(
    debounce((query: string) => {
      if (query.trim().length === 0) {
        setSearchResults([]);
        setIsOpen(false);
        return;
      }
      
      const results = products
        .filter(product => 
          product.name.toLowerCase().includes(query.toLowerCase()) ||
          product.description.toLowerCase().includes(query.toLowerCase())
        )
        .slice(0, 5)
        .map(product => ({
          id: product.id,
          name: product.name,
          thumbnail: product.thumbnail,
          price: product.price,
        }));
      
      setSearchResults(results);
      setIsOpen(true);
    }, 300)
  ).current;
  
  // Update search results when the query changes
  useEffect(() => {
    debouncedSearch(searchQuery);
    return () => debouncedSearch.cancel();
  }, [searchQuery, debouncedSearch, products]);
  
  // Handle search submission
  const handleSearch = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (searchQuery.trim()) {
      dispatch(addToSearchHistory(searchQuery));
      dispatch(setFilter({ searchQuery }));
      navigate(`/products?search=${encodeURIComponent(searchQuery)}`);
      setIsOpen(false);
    }
  };
  
  // Handle selection from search results
  const handleSelectResult = (id: string, name: string) => {
    dispatch(addToSearchHistory(name));
    navigate(`/products/${id}`);
    setIsOpen(false);
    setSearchQuery('');
  };
  
  return (
    <div className="relative w-full" ref={searchRef}>
      <form onSubmit={handleSearch} className="relative">
        <input
          type="text"
          placeholder={t('products.search')}
          value={searchQuery}
          onChange={e => setSearchQuery(e.target.value)}
          onFocus={() => searchQuery.trim() !== '' && setIsOpen(true)}
          className="w-full px-4 py-2 pr-10 border border-neutral-300 rounded-md focus:ring-2 focus:ring-primary focus:border-primary outline-none"
        />
        
        <button
          type="submit"
          className="absolute right-0 top-0 h-full px-3 text-neutral-500 hover:text-primary transition-colors"
        >
          <Search size={18} />
        </button>
        
        {searchQuery && (
          <button
            type="button"
            onClick={() => setSearchQuery('')}
            className="absolute right-8 top-0 h-full px-2 text-neutral-500 hover:text-primary transition-colors"
          >
            <X size={16} />
          </button>
        )}
      </form>
      
      {/* Search Results Dropdown */}
      {isOpen && (
        <div className="absolute z-20 top-full left-0 right-0 mt-1 bg-white border border-neutral-200 rounded-md shadow-lg max-h-96 overflow-y-auto">
          {searchResults.length > 0 ? (
            <div>
              <div className="p-2 border-b border-neutral-200 text-sm font-medium text-neutral-500">
                {t('products.search')} Results
              </div>
              <ul>
                {searchResults.map(result => (
                  <li
                    key={result.id}
                    onClick={() => handleSelectResult(result.id, result.name)}
                    className="p-2 hover:bg-neutral-100 cursor-pointer flex items-center"
                  >
                    <img
                      src={result.thumbnail}
                      alt={result.name}
                      className="w-10 h-10 object-cover rounded-md mr-3"
                    />
                    <div className="flex-grow">
                      <p className="text-sm font-medium text-neutral-800">{result.name}</p>
                      <p className="text-sm text-primary font-medium">${result.price.toFixed(2)}</p>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          ) : searchQuery.trim() !== '' ? (
            <div className="p-3 text-center text-neutral-500">
              No results found for "{searchQuery}"
            </div>
          ) : searchHistory.length > 0 ? (
            <div>
              <div className="p-2 border-b border-neutral-200 text-sm font-medium text-neutral-500">
                Recent Searches
              </div>
              <ul>
                {searchHistory.map((query, index) => (
                  <li
                    key={index}
                    onClick={() => {
                      setSearchQuery(query);
                      handleSearch();
                    }}
                    className="p-2 hover:bg-neutral-100 cursor-pointer flex items-center"
                  >
                    <Search size={14} className="text-neutral-400 mr-2" />
                    <span className="text-sm text-neutral-700">{query}</span>
                  </li>
                ))}
              </ul>
            </div>
          ) : null}
        </div>
      )}
    </div>
  );
};

export default SearchBar;