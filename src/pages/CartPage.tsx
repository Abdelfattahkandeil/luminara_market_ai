import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Trash2, Minus, Plus, ShoppingBag } from 'lucide-react';
import { RootState } from '../store';
import { removeFromCart, updateQuantity, clearCart } from '../store/slices/cartSlice';

const CartPage: React.FC = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const { items, isLoading } = useSelector((state: RootState) => state.cart);
  const { isAuthenticated } = useSelector((state: RootState) => state.auth);
  
  // Calculate totals
  const subtotal = items.reduce((total, item) => total + (item.price * item.quantity), 0);
  const tax = subtotal * 0.1; // 10% tax
  const shipping = items.length > 0 ? 15 : 0; // $15 shipping
  const total = subtotal + tax + shipping;
  
  // Handle quantity change
  const handleQuantityChange = (id: string, quantity: number) => {
    if (quantity < 1) return;
    dispatch(updateQuantity({ id, quantity }));
  };
  
  // Handle remove item
  const handleRemoveItem = (id: string) => {
    dispatch(removeFromCart(id));
  };
  
  // Handle clear cart
  const handleClearCart = () => {
    dispatch(clearCart());
  };
  
  if (items.length === 0) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="bg-white rounded-lg shadow-md p-8 text-center">
          <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-neutral-100 flex items-center justify-center">
            <ShoppingBag size={32} className="text-neutral-400" />
          </div>
          <h2 className="text-2xl font-bold mb-2">Your cart is empty</h2>
          <p className="text-neutral-500 mb-8">Looks like you haven't added any products to your cart yet.</p>
          <Link to="/products" className="btn-primary">
            Continue Shopping
          </Link>
        </div>
      </div>
    );
  }
  
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">{t('cart.title')}</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Cart Items */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            {/* Cart Header */}
            <div className="p-4 border-b border-neutral-200 flex justify-between items-center">
              <h2 className="font-semibold">
                {items.length} {items.length === 1 ? 'item' : 'items'}
              </h2>
              <button
                onClick={handleClearCart}
                className="text-sm text-neutral-500 hover:text-error"
              >
                Clear Cart
              </button>
            </div>
            
            {/* Cart Items */}
            <div className="divide-y divide-neutral-200">
              {items.map(item => (
                <div key={item.id} className="p-4 flex flex-col sm:flex-row">
                  {/* Product Image */}
                  <div className="sm:w-24 h-24 sm:mr-6 mb-4 sm:mb-0 flex-shrink-0">
                    <img
                      src={item.thumbnail}
                      alt={item.name}
                      className="w-full h-full object-cover rounded-md"
                    />
                  </div>
                  
                  {/* Product Info */}
                  <div className="flex-grow">
                    <div className="flex flex-col sm:flex-row justify-between mb-2">
                      <Link
                        to={`/products/${item.id}`}
                        className="text-lg font-medium text-neutral-800 hover:text-primary mb-1 sm:mb-0"
                      >
                        {item.name}
                      </Link>
                      <span className="text-lg font-semibold text-primary">
                        ${(item.price * item.quantity).toFixed(2)}
                      </span>
                    </div>
                    
                    <div className="flex flex-wrap justify-between items-center mt-4">
                      <div className="flex items-center border border-neutral-300 rounded-md">
                        <button
                          onClick={() => handleQuantityChange(item.id, item.quantity - 1)}
                          className="p-1 text-neutral-500 hover:text-neutral-700"
                          disabled={item.quantity <= 1}
                        >
                          <Minus size={16} />
                        </button>
                        <input
                          type="number"
                          value={item.quantity}
                          onChange={(e) => handleQuantityChange(item.id, parseInt(e.target.value) || 1)}
                          min="1"
                          className="w-10 text-center border-l border-r border-neutral-300 py-1"
                        />
                        <button
                          onClick={() => handleQuantityChange(item.id, item.quantity + 1)}
                          className="p-1 text-neutral-500 hover:text-neutral-700"
                        >
                          <Plus size={16} />
                        </button>
                      </div>
                      
                      <button
                        onClick={() => handleRemoveItem(item.id)}
                        className="text-error hover:text-error-dark transition-colors flex items-center"
                      >
                        <Trash2 size={16} className="mr-1" />
                        <span className="text-sm">Remove</span>
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          <div className="mt-6">
            <Link to="/products" className="text-primary hover:text-primary/80 font-medium flex items-center">
              <ShoppingBag size={16} className="mr-2" />
              {t('cart.continueShopping')}
            </Link>
          </div>
        </div>
        
        {/* Order Summary */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-lg font-semibold mb-4">Order Summary</h2>
            
            <div className="space-y-3 mb-6">
              <div className="flex justify-between text-neutral-600">
                <span>{t('cart.subtotal')}</span>
                <span>${subtotal.toFixed(2)}</span>
              </div>
              
              <div className="flex justify-between text-neutral-600">
                <span>{t('cart.shipping')}</span>
                <span>${shipping.toFixed(2)}</span>
              </div>
              
              <div className="flex justify-between text-neutral-600">
                <span>{t('cart.tax')}</span>
                <span>${tax.toFixed(2)}</span>
              </div>
              
              <div className="border-t border-neutral-200 pt-3 flex justify-between font-semibold text-lg">
                <span>{t('cart.total')}</span>
                <span>${total.toFixed(2)}</span>
              </div>
            </div>
            
            <Link
              to={isAuthenticated ? "/checkout" : "/auth/login?redirect=checkout"}
              className="btn-primary w-full py-3 flex items-center justify-center"
            >
              {t('cart.proceedToCheckout')}
            </Link>
            
            <div className="mt-6 text-sm text-neutral-500">
              <p className="mb-2">
                We accept:
              </p>
              <div className="flex space-x-2">
                <span className="px-2 py-1 bg-neutral-100 rounded text-neutral-700">Visa</span>
                <span className="px-2 py-1 bg-neutral-100 rounded text-neutral-700">Mastercard</span>
                <span className="px-2 py-1 bg-neutral-100 rounded text-neutral-700">PayPal</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartPage;