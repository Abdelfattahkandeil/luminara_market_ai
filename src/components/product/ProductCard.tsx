import React from 'react';
import { useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { ShoppingCart, Heart, BarChart2, Star } from 'lucide-react';
import { Product } from '../../types/product';
import { addToCart } from '../../store/slices/cartSlice';
import { addToWishlist } from '../../store/slices/wishlistSlice';
import { addToComparisonList } from '../../store/slices/productsSlice';
import { showToast } from '../../store/slices/uiSlice';

interface ProductCardProps {
  product: Product;
  layout?: 'grid' | 'list';
}

export const ProductCard: React.FC<ProductCardProps> = ({ product, layout = 'grid' }) => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  
  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    dispatch(addToCart({ product, quantity: 1 }));
    dispatch(showToast({ 
      message: `${product.name} added to cart`, 
      type: 'success' 
    }));
  };
  
  const handleAddToWishlist = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    dispatch(addToWishlist(product));
    dispatch(showToast({ 
      message: `${product.name} added to wishlist`, 
      type: 'success' 
    }));
  };
  
  const handleAddToCompare = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    dispatch(addToComparisonList(product.id));
    dispatch(showToast({ 
      message: `${product.name} added to comparison`, 
      type: 'info' 
    }));
  };
  
  if (layout === 'list') {
    return (
      <div className="card group overflow-hidden flex flex-col sm:flex-row mb-4">
        <div className="relative w-full sm:w-1/3 h-60 overflow-hidden">
          <Link to={`/products/${product.id}`}>
            <img 
              src={product.thumbnail} 
              alt={product.name} 
              className="w-full h-full object-cover transition-transform group-hover:scale-105"
            />
          </Link>
          
          {/* Discount Badge */}
          {product.discount && (
            <div className="absolute top-2 left-2 bg-accent text-white text-xs font-medium px-2 py-1 rounded">
              {product.discount}% OFF
            </div>
          )}
          
          {/* New Badge */}
          {product.newArrival && !product.discount && (
            <div className="absolute top-2 left-2 bg-primary text-white text-xs font-medium px-2 py-1 rounded">
              NEW
            </div>
          )}
        </div>
        
        <div className="p-4 flex flex-col flex-grow">
          <Link to={`/products/${product.id}`}>
            <h3 className="font-medium text-lg text-neutral-800 mb-1 hover:text-primary transition-colors">
              {product.name}
            </h3>
          </Link>
          
          <div className="flex items-center mb-2">
            <div className="flex items-center text-accent">
              <Star size={16} className="fill-current" />
              <span className="ml-1 text-sm font-medium">{product.rating}</span>
            </div>
            <span className="mx-2 text-neutral-300">|</span>
            <span className="text-sm text-neutral-500">{product.reviewCount} reviews</span>
          </div>
          
          <p className="text-neutral-600 text-sm mb-3 line-clamp-2">
            {product.description}
          </p>
          
          <div className="flex items-baseline mb-4">
            <span className="text-lg font-semibold text-primary">${product.price.toFixed(2)}</span>
            {product.originalPrice && (
              <span className="ml-2 text-sm text-neutral-400 line-through">
                ${product.originalPrice.toFixed(2)}
              </span>
            )}
          </div>
          
          <div className="flex flex-wrap gap-2 mt-auto">
            <button 
              onClick={handleAddToCart}
              className="btn-primary flex-1 py-2"
            >
              <ShoppingCart size={16} className="mr-2" />
              {t('products.addToCart')}
            </button>
            
            <button 
              onClick={handleAddToWishlist}
              className="btn-outline p-2"
            >
              <Heart size={16} />
            </button>
            
            <button 
              onClick={handleAddToCompare}
              className="btn-outline p-2"
            >
              <BarChart2 size={16} />
            </button>
          </div>
        </div>
      </div>
    );
  }
  
  return (
    <div className="group card overflow-hidden transition-all hover:shadow-lg">
      <div className="relative overflow-hidden">
        <Link to={`/products/${product.id}`}>
          <img 
            src={product.thumbnail} 
            alt={product.name} 
            className="w-full h-56 object-cover transition-transform group-hover:scale-105"
          />
        </Link>
        
        {/* Discount Badge */}
        {product.discount && (
          <div className="absolute top-2 left-2 bg-accent text-white text-xs font-medium px-2 py-1 rounded">
            {product.discount}% OFF
          </div>
        )}
        
        {/* New Badge */}
        {product.newArrival && !product.discount && (
          <div className="absolute top-2 left-2 bg-primary text-white text-xs font-medium px-2 py-1 rounded">
            NEW
          </div>
        )}
        
        {/* Quick Actions */}
        <div className="absolute -bottom-10 group-hover:bottom-0 left-0 right-0 flex justify-center p-2 bg-white bg-opacity-90 transition-all">
          <button 
            onClick={handleAddToWishlist}
            className="p-2 rounded-full bg-white text-secondary border border-neutral-200 mx-1 hover:border-primary hover:text-primary transition-colors"
          >
            <Heart size={16} />
          </button>
          <button 
            onClick={handleAddToCart}
            className="p-2 rounded-full bg-primary text-white mx-1 hover:bg-primary/90 transition-colors"
          >
            <ShoppingCart size={16} />
          </button>
          <button 
            onClick={handleAddToCompare}
            className="p-2 rounded-full bg-white text-secondary border border-neutral-200 mx-1 hover:border-primary hover:text-primary transition-colors"
          >
            <BarChart2 size={16} />
          </button>
        </div>
      </div>
      
      <div className="p-4">
        <Link to={`/products/${product.id}`}>
          <h3 className="font-medium text-neutral-800 mb-1 hover:text-primary transition-colors line-clamp-1">
            {product.name}
          </h3>
        </Link>
        
        <div className="flex items-center mb-2">
          <div className="flex items-center text-accent">
            <Star size={16} className="fill-current" />
            <span className="ml-1 text-sm font-medium">{product.rating}</span>
          </div>
          <span className="mx-2 text-neutral-300">|</span>
          <span className="text-sm text-neutral-500">{product.reviewCount} reviews</span>
        </div>
        
        <div className="flex items-baseline">
          <span className="text-lg font-semibold text-primary">${product.price.toFixed(2)}</span>
          {product.originalPrice && (
            <span className="ml-2 text-sm text-neutral-400 line-through">
              ${product.originalPrice.toFixed(2)}
            </span>
          )}
        </div>
      </div>
    </div>
  );
};