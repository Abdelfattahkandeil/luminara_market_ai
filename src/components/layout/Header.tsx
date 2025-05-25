import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { RootState } from '../../store';
import { toggleLanguage, toggleMobileMenu, toggleSearch } from '../../store/slices/uiSlice';
import { Search, ShoppingCart, Heart, User, Menu, X, Sun, Moon, Globe } from 'lucide-react';
import SearchBar from '../product/SearchBar';

const Header: React.FC = () => {
  const { t, i18n } = useTranslation();
  const location = useLocation();
  const dispatch = useDispatch();
  const { mobileMenuOpen, language } = useSelector((state: RootState) => state.ui);
  const { isAuthenticated } = useSelector((state: RootState) => state.auth);
  const { items: cartItems } = useSelector((state: RootState) => state.cart);
  const { items: wishlistItems } = useSelector((state: RootState) => state.wishlist);
  
  const [isScrolled, setIsScrolled] = useState(false);
  const [searchVisible, setSearchVisible] = useState(false);
  
  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);
  
  // Close mobile menu on route change
  useEffect(() => {
    if (mobileMenuOpen) {
      dispatch(toggleMobileMenu());
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.pathname]);
  
  // Toggle search bar
  const handleToggleSearch = () => {
    setSearchVisible(!searchVisible);
    dispatch(toggleSearch());
  };
  
  // Toggle language
  const handleToggleLanguage = () => {
    dispatch(toggleLanguage());
    i18n.changeLanguage(language === 'en' ? 'ar' : 'en');
  };
  
  return (
    <header 
      className={`sticky top-0 z-20 w-full transition-all duration-300 ${
        isScrolled ? 'bg-white shadow-md' : 'bg-transparent'
      }`}
    >
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16 md:h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2 text-secondary">
            <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center">
              <span className="text-white font-bold text-xl">LM</span>
            </div>
            <h1 className="hidden md:block text-xl font-bold">{t('app.name')}</h1>
          </Link>
          
          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <Link to="/" className="text-neutral-700 hover:text-primary transition-colors">
              {t('nav.home')}
            </Link>
            <Link to="/products" className="text-neutral-700 hover:text-primary transition-colors">
              {t('nav.products')}
            </Link>
          </nav>
          
          {/* Actions */}
          <div className="flex items-center space-x-4">
            {/* Search */}
            <button 
              onClick={handleToggleSearch}
              className="p-2 text-neutral-600 hover:text-primary transition-colors"
            >
              <Search size={20} />
            </button>
            
            {/* Language Toggle */}
            <button 
              onClick={handleToggleLanguage}
              className="p-2 text-neutral-600 hover:text-primary transition-colors"
            >
              <Globe size={20} />
              <span className="sr-only">{language === 'en' ? 'Switch to Arabic' : 'Switch to English'}</span>
            </button>
            
            {/* Wishlist */}
            <Link to="/wishlist" className="p-2 text-neutral-600 hover:text-primary transition-colors relative">
              <Heart size={20} />
              {wishlistItems.length > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 bg-accent text-white text-xs rounded-full flex items-center justify-center">
                  {wishlistItems.length}
                </span>
              )}
            </Link>
            
            {/* Cart */}
            <Link to="/cart" className="p-2 text-neutral-600 hover:text-primary transition-colors relative">
              <ShoppingCart size={20} />
              {cartItems.length > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 bg-accent text-white text-xs rounded-full flex items-center justify-center">
                  {cartItems.length}
                </span>
              )}
            </Link>
            
            {/* User */}
            {isAuthenticated ? (
              <Link to="/profile" className="p-2 text-neutral-600 hover:text-primary transition-colors">
                <User size={20} />
              </Link>
            ) : (
              <Link to="/auth/login" className="p-2 text-neutral-600 hover:text-primary transition-colors">
                <User size={20} />
              </Link>
            )}
            
            {/* Mobile menu button */}
            <button 
              onClick={() => dispatch(toggleMobileMenu())}
              className="md:hidden p-2 text-neutral-600 hover:text-primary transition-colors"
            >
              {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
        
        {/* Search Bar */}
        {searchVisible && (
          <div className="py-3 border-t border-neutral-200">
            <SearchBar />
          </div>
        )}
        
        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden py-4 border-t border-neutral-200">
            <nav className="flex flex-col space-y-4">
              <Link 
                to="/" 
                className="text-neutral-700 hover:text-primary transition-colors px-2 py-1"
              >
                {t('nav.home')}
              </Link>
              <Link 
                to="/products" 
                className="text-neutral-700 hover:text-primary transition-colors px-2 py-1"
              >
                {t('nav.products')}
              </Link>
              {isAuthenticated ? (
                <>
                  <Link 
                    to="/profile" 
                    className="text-neutral-700 hover:text-primary transition-colors px-2 py-1"
                  >
                    {t('nav.profile')}
                  </Link>
                  <button 
                    className="text-left text-neutral-700 hover:text-primary transition-colors px-2 py-1"
                  >
                    {t('nav.logout')}
                  </button>
                </>
              ) : (
                <>
                  <Link 
                    to="/auth/login" 
                    className="text-neutral-700 hover:text-primary transition-colors px-2 py-1"
                  >
                    {t('nav.login')}
                  </Link>
                  <Link 
                    to="/auth/register" 
                    className="text-neutral-700 hover:text-primary transition-colors px-2 py-1"
                  >
                    {t('nav.register')}
                  </Link>
                </>
              )}
            </nav>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;