import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { Star, Heart, ShoppingCart, Share2, BarChart2, Minus, Plus, ChevronRight } from 'lucide-react';
import { RootState } from '../store';
import { fetchProductById } from '../store/slices/productsSlice';
import { addToCart } from '../store/slices/cartSlice';
import { addToWishlist, removeFromWishlist } from '../store/slices/wishlistSlice';
import { showToast } from '../store/slices/uiSlice';
import LoadingSpinner from '../components/ui/LoadingSpinner';
import { ProductCard } from '../components/product/ProductCard';

const ProductDetailPage: React.FC = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const { id } = useParams<{ id: string }>();
  
  const { selectedProduct, items, isLoading, error } = useSelector((state: RootState) => state.products);
  const { items: wishlistItems } = useSelector((state: RootState) => state.wishlist);
  
  const [activeTab, setActiveTab] = useState<'description' | 'specifications' | 'reviews'>('description');
  const [mainImage, setMainImage] = useState<string>('');
  const [quantity, setQuantity] = useState(1);
  
  // Check if product is in wishlist
  const isInWishlist = wishlistItems.some(item => item.id === selectedProduct?.id);
  
  useEffect(() => {
    if (id) {
      dispatch(fetchProductById(id) as any);
    }
  }, [id, dispatch]);
  
  // Set main image when product changes
  useEffect(() => {
    if (selectedProduct?.images?.length) {
      setMainImage(selectedProduct.images[0]);
    }
  }, [selectedProduct]);
  
  const handleQuantityChange = (value: number) => {
    if (value >= 1) {
      setQuantity(value);
    }
  };
  
  const handleAddToCart = () => {
    if (selectedProduct) {
      dispatch(addToCart({ product: selectedProduct, quantity }));
      dispatch(showToast({ 
        message: `${selectedProduct.name} added to cart`, 
        type: 'success' 
      }));
    }
  };
  
  const handleToggleWishlist = () => {
    if (selectedProduct) {
      if (isInWishlist) {
        dispatch(removeFromWishlist(selectedProduct.id));
        dispatch(showToast({ 
          message: `${selectedProduct.name} removed from wishlist`, 
          type: 'info' 
        }));
      } else {
        dispatch(addToWishlist(selectedProduct));
        dispatch(showToast({ 
          message: `${selectedProduct.name} added to wishlist`, 
          type: 'success' 
        }));
      }
    }
  };
  
  // Get related products
  const relatedProducts = items
    .filter(item => item.category === selectedProduct?.category && item.id !== selectedProduct?.id)
    .slice(0, 4);
  
  if (isLoading && !selectedProduct) {
    return <LoadingSpinner size="lg" />;
  }
  
  if (error && !selectedProduct) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold text-error mb-2">Oops, something went wrong!</h2>
        <p className="text-neutral-600 mb-6">{error}</p>
        <button
          onClick={() => id && dispatch(fetchProductById(id) as any)}
          className="btn-primary"
        >
          Try Again
        </button>
      </div>
    );
  }
  
  if (!selectedProduct) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold mb-2">Product not found</h2>
        <p className="text-neutral-600 mb-6">The product you're looking for doesn't exist or has been removed.</p>
        <Link to="/products" className="btn-primary">
          Back to Products
        </Link>
      </div>
    );
  }
  
  return (
    <div className="container mx-auto px-4 py-8">
      {/* Breadcrumbs */}
      <div className="flex items-center text-sm text-neutral-500 mb-6">
        <Link to="/" className="hover:text-primary">Home</Link>
        <ChevronRight size={14} className="mx-2" />
        <Link to="/products" className="hover:text-primary">Products</Link>
        <ChevronRight size={14} className="mx-2" />
        <Link to={`/products?category=${selectedProduct.category}`} className="hover:text-primary">
          {selectedProduct.category}
        </Link>
        <ChevronRight size={14} className="mx-2" />
        <span className="text-neutral-700">{selectedProduct.name}</span>
      </div>
      
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 p-6">
          {/* Image Gallery */}
          <div className="lg:col-span-2 space-y-4">
            <div className="w-full aspect-square rounded-lg overflow-hidden border border-neutral-200">
              <img 
                src={mainImage || selectedProduct.thumbnail} 
                alt={selectedProduct.name} 
                className="w-full h-full object-contain"
              />
            </div>
            
            <div className="flex gap-2 overflow-x-auto pb-2">
              {selectedProduct.images.map((image, index) => (
                <button
                  key={index}
                  onClick={() => setMainImage(image)}
                  className={`w-20 h-20 rounded-md overflow-hidden border-2 flex-shrink-0 ${
                    mainImage === image ? 'border-primary' : 'border-transparent'
                  }`}
                >
                  <img 
                    src={image} 
                    alt={`${selectedProduct.name} view ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                </button>
              ))}
            </div>
          </div>
          
          {/* Product Info */}
          <div className="lg:col-span-3 flex flex-col">
            <div>
              {/* Badges */}
              <div className="flex flex-wrap gap-2 mb-2">
                {selectedProduct.discount && (
                  <span className="badge bg-accent text-white">
                    {selectedProduct.discount}% OFF
                  </span>
                )}
                
                {selectedProduct.newArrival && (
                  <span className="badge bg-primary text-white">
                    NEW
                  </span>
                )}
                
                {selectedProduct.inStock ? (
                  <span className="badge bg-success text-white">
                    IN STOCK
                  </span>
                ) : (
                  <span className="badge bg-error text-white">
                    OUT OF STOCK
                  </span>
                )}
              </div>
              
              <h1 className="text-2xl md:text-3xl font-bold text-neutral-900 mb-2">
                {selectedProduct.name}
              </h1>
              
              {/* Rating */}
              <div className="flex items-center mb-4">
                <div className="flex">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star
                      key={star}
                      size={18}
                      className={`${
                        star <= Math.floor(selectedProduct.rating)
                          ? 'text-accent fill-current'
                          : star <= selectedProduct.rating
                          ? 'text-accent fill-current opacity-50'
                          : 'text-neutral-300'
                      }`}
                    />
                  ))}
                </div>
                <span className="ml-2 text-neutral-500">
                  {selectedProduct.rating} ({selectedProduct.reviewCount} {t('product.reviews')})
                </span>
              </div>
              
              {/* Price */}
              <div className="flex items-baseline mb-6">
                <span className="text-2xl font-bold text-primary">
                  ${selectedProduct.price.toFixed(2)}
                </span>
                {selectedProduct.originalPrice && (
                  <span className="ml-3 text-base text-neutral-400 line-through">
                    ${selectedProduct.originalPrice.toFixed(2)}
                  </span>
                )}
                
                {selectedProduct.discount && (
                  <span className="ml-3 text-sm font-medium text-accent">
                    Save {selectedProduct.discount}%
                  </span>
                )}
              </div>
              
              {/* Brand */}
              <div className="mb-6">
                <p className="text-neutral-500">
                  <span className="font-medium">Brand:</span>{' '}
                  <Link 
                    to={`/products?brand=${selectedProduct.brand}`}
                    className="text-primary hover:underline"
                  >
                    {selectedProduct.brand}
                  </Link>
                </p>
              </div>
              
              {/* Actions */}
              <div className="flex flex-col sm:flex-row gap-4 mb-8">
                <div className="flex items-center border border-neutral-300 rounded-md">
                  <button 
                    onClick={() => handleQuantityChange(quantity - 1)}
                    className="p-2 text-neutral-500 hover:text-neutral-700 disabled:opacity-50"
                    disabled={quantity <= 1}
                  >
                    <Minus size={20} />
                  </button>
                  <input
                    type="number"
                    value={quantity}
                    onChange={(e) => handleQuantityChange(parseInt(e.target.value) || 1)}
                    className="w-12 text-center border-l border-r border-neutral-300 py-2 focus:outline-none"
                  />
                  <button 
                    onClick={() => handleQuantityChange(quantity + 1)}
                    className="p-2 text-neutral-500 hover:text-neutral-700"
                  >
                    <Plus size={20} />
                  </button>
                </div>
                
                <button
                  onClick={handleAddToCart}
                  disabled={!selectedProduct.inStock}
                  className="btn-primary flex-grow"
                >
                  <ShoppingCart size={18} className="mr-2" />
                  {t('products.addToCart')}
                </button>
                
                <button
                  onClick={handleToggleWishlist}
                  className={`btn-outline p-3 ${isInWishlist ? 'text-accent' : ''}`}
                >
                  <Heart size={20} className={isInWishlist ? 'fill-current' : ''} />
                </button>
                
                <button
                  className="btn-outline p-3"
                >
                  <Share2 size={20} />
                </button>
              </div>
            </div>
          </div>
        </div>
        
        {/* Tabs */}
        <div className="border-t border-neutral-200">
          <div className="flex overflow-x-auto">
            <button
              className={`px-6 py-3 font-medium text-sm border-b-2 ${
                activeTab === 'description'
                  ? 'border-primary text-primary'
                  : 'border-transparent text-neutral-500 hover:text-neutral-700'
              }`}
              onClick={() => setActiveTab('description')}
            >
              {t('product.description')}
            </button>
            <button
              className={`px-6 py-3 font-medium text-sm border-b-2 ${
                activeTab === 'specifications'
                  ? 'border-primary text-primary'
                  : 'border-transparent text-neutral-500 hover:text-neutral-700'
              }`}
              onClick={() => setActiveTab('specifications')}
            >
              {t('product.specifications')}
            </button>
            <button
              className={`px-6 py-3 font-medium text-sm border-b-2 ${
                activeTab === 'reviews'
                  ? 'border-primary text-primary'
                  : 'border-transparent text-neutral-500 hover:text-neutral-700'
              }`}
              onClick={() => setActiveTab('reviews')}
            >
              {t('product.reviews')} ({selectedProduct.reviewCount})
            </button>
          </div>
          
          <div className="p-6">
            {activeTab === 'description' && (
              <div>
                <p className="text-neutral-700 leading-relaxed">
                  {selectedProduct.description}
                </p>
              </div>
            )}
            
            {activeTab === 'specifications' && (
              <div className="border rounded-md overflow-hidden">
                <table className="min-w-full divide-y divide-neutral-200">
                  <tbody className="divide-y divide-neutral-200">
                    {Object.entries(selectedProduct.specifications).map(([key, value], index) => (
                      <tr key={index} className={index % 2 === 0 ? 'bg-neutral-50' : 'bg-white'}>
                        <td className="px-4 py-3 text-sm font-medium text-neutral-700 w-1/3">
                          {key}
                        </td>
                        <td className="px-4 py-3 text-sm text-neutral-600">
                          {value}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
            
            {activeTab === 'reviews' && (
              <div>
                <div className="mb-6 flex justify-between items-center">
                  <div>
                    <h3 className="text-lg font-semibold mb-1">Customer Reviews</h3>
                    <div className="flex items-center">
                      <div className="flex">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <Star
                            key={star}
                            size={18}
                            className={`${
                              star <= Math.floor(selectedProduct.rating)
                                ? 'text-accent fill-current'
                                : star <= selectedProduct.rating
                                ? 'text-accent fill-current opacity-50'
                                : 'text-neutral-300'
                            }`}
                          />
                        ))}
                      </div>
                      <span className="ml-2 text-neutral-500">
                        Based on {selectedProduct.reviewCount} reviews
                      </span>
                    </div>
                  </div>
                  
                  <button className="btn-primary">
                    {t('product.writeReview')}
                  </button>
                </div>
                
                <div className="text-center py-8 text-neutral-500">
                  <p>Reviews will appear here soon. Be the first to leave a review!</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
      
      {/* Related Products */}
      {relatedProducts.length > 0 && (
        <section className="mt-16">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-2xl font-bold">{t('product.relatedProducts')}</h2>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {relatedProducts.map(product => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
};

export default ProductDetailPage;