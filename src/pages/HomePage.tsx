import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { ArrowRight, ShoppingBag, Star, Heart } from 'lucide-react';
import { RootState } from '../store';
import { fetchProducts } from '../store/slices/productsSlice';
import LoadingSpinner from '../components/ui/LoadingSpinner';
import { Product } from '../types/product';

const HomePage: React.FC = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const { items: products, isLoading, error } = useSelector((state: RootState) => state.products);
  
  useEffect(() => {
    dispatch(fetchProducts() as any);
  }, [dispatch]);
  
  // Filter products with array check
  const productArray = Array.isArray(products) ? products : [];
  const featuredProducts = productArray.filter(product => product.featured).slice(0, 4);
  const newArrivals = productArray.filter(product => product.newArrival).slice(0, 4);
  const bestSellers = productArray.filter(product => product.bestSeller).slice(0, 4);
  
  if (isLoading) {
    return <LoadingSpinner size="lg" />;
  }
  
  if (error) {
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
    <div className="space-y-16">
      {/* Hero Section */}
      <section className="py-16 md:py-24 relative overflow-hidden">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-secondary mb-6">
              {t('app.slogan')}
            </h1>
            <p className="text-lg md:text-xl text-neutral-600 mb-8 max-w-2xl">
              Discover a carefully curated selection of premium products designed to elevate your lifestyle.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link to="/products" className="btn-primary px-6 py-3">
                Shop Now
              </Link>
              <Link to="/categories" className="btn-outline px-6 py-3">
                Browse Categories
              </Link>
            </div>
          </div>
        </div>
      </section>
      
      {/* Featured Products */}
      <section>
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-2xl md:text-3xl font-bold">{t('home.featuredProducts')}</h2>
            <Link 
              to="/products?featured=true" 
              className="flex items-center text-primary hover:text-primary/80 font-medium"
            >
              View All <ArrowRight size={16} className="ml-1" />
            </Link>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredProducts.map(product => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </section>
      
      {/* Categories Section */}
      <section className="bg-neutral-100 py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl md:text-3xl font-bold text-center mb-10">
            {t('home.categories')}
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <CategoryCard
              title="Electronics"
              description="Latest gadgets and tech"
              image="https://images.pexels.com/photos/3721941/pexels-photo-3721941.jpeg"
              link="/products?category=electronics"
            />
            <CategoryCard
              title="Audio"
              description="Premium sound experience"
              image="https://images.pexels.com/photos/577769/pexels-photo-577769.jpeg"
              link="/products?category=audio"
            />
            <CategoryCard
              title="Computers"
              description="Powerful machines for every need"
              image="https://images.pexels.com/photos/18105/pexels-photo.jpg"
              link="/products?category=computers"
            />
          </div>
        </div>
      </section>
      
      {/* New Arrivals */}
      <section>
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-2xl md:text-3xl font-bold">{t('home.newArrivals')}</h2>
            <Link 
              to="/products?new=true" 
              className="flex items-center text-primary hover:text-primary/80 font-medium"
            >
              View All <ArrowRight size={16} className="ml-1" />
            </Link>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {newArrivals.map(product => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </section>
      
      {/* Best Sellers */}
      <section className="bg-neutral-100 py-16">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-2xl md:text-3xl font-bold">{t('home.bestSellers')}</h2>
            <Link 
              to="/products?bestseller=true" 
              className="flex items-center text-primary hover:text-primary/80 font-medium"
            >
              View All <ArrowRight size={16} className="ml-1" />
            </Link>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {bestSellers.map(product => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

interface ProductCardProps {
  product: Product;
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
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
          <button className="p-2 rounded-full bg-primary text-white mx-1 hover:bg-primary/90 transition-colors">
            <ShoppingBag size={16} />
          </button>
          <button className="p-2 rounded-full bg-white text-secondary border border-neutral-200 mx-1 hover:border-primary hover:text-primary transition-colors">
            <Heart size={16} />
          </button>
        </div>
      </div>
      
      <div className="p-4">
        <Link to={`/products/${product.id}`}>
          <h3 className="font-medium text-neutral-800 mb-1 hover:text-primary transition-colors">
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

interface CategoryCardProps {
  title: string;
  description: string;
  image: string;
  link: string;
}

const CategoryCard: React.FC<CategoryCardProps> = ({ title, description, image, link }) => {
  return (
    <Link to={link} className="group block relative overflow-hidden rounded-lg h-64 shadow-md">
      <img 
        src={image} 
        alt={title} 
        className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-secondary/80 to-transparent flex flex-col justify-end p-6">
        <h3 className="text-white text-xl font-semibold mb-1">{title}</h3>
        <p className="text-neutral-200 text-sm mb-3">{description}</p>
        <span className="text-white font-medium flex items-center text-sm">
          Shop Now <ArrowRight size={14} className="ml-1" />
        </span>
      </div>
    </Link>
  );
};

export default HomePage;