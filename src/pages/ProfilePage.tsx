import React, { useState } from 'react';
import { Routes, Route, Link, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { RootState } from '../store';
import { User, Package, MapPin, Heart, Settings } from 'lucide-react';

// Profile Tab Components
const PersonalInfo = React.lazy(() => import('../components/profile/PersonalInfo'));
const Orders = React.lazy(() => import('../components/profile/Orders'));
const Addresses = React.lazy(() => import('../components/profile/Addresses'));
const ProfileWishlist = React.lazy(() => import('../components/profile/ProfileWishlist'));
const ProfileSettings = React.lazy(() => import('../components/profile/ProfileSettings'));

const ProfilePage: React.FC = () => {
  const { t } = useTranslation();
  const location = useLocation();
  const { user } = useSelector((state: RootState) => state.auth);
  
  const navigationItems = [
    { 
      icon: <User size={20} />, 
      label: t('profile.personalInfo'), 
      path: '/profile' 
    },
    { 
      icon: <Package size={20} />, 
      label: t('profile.orders'), 
      path: '/profile/orders' 
    },
    { 
      icon: <MapPin size={20} />, 
      label: t('profile.addresses'), 
      path: '/profile/addresses' 
    },
    { 
      icon: <Heart size={20} />, 
      label: t('profile.wishlist'), 
      path: '/profile/wishlist' 
    },
    { 
      icon: <Settings size={20} />, 
      label: t('profile.settings'), 
      path: '/profile/settings' 
    }
  ];
  
  const isActive = (path: string) => {
    if (path === '/profile' && location.pathname === '/profile') {
      return true;
    }
    return location.pathname.startsWith(path) && path !== '/profile';
  };
  
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">{t('profile.title')}</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Sidebar */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            {/* User Info */}
            <div className="p-6 border-b border-neutral-200">
              <div className="flex items-center">
                <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold text-xl mr-4">
                  {user?.firstName?.[0]}{user?.lastName?.[0]}
                </div>
                <div>
                  <h3 className="font-medium text-lg">{user?.firstName} {user?.lastName}</h3>
                  <p className="text-neutral-500 text-sm">{user?.email}</p>
                </div>
              </div>
            </div>
            
            {/* Navigation */}
            <nav className="p-2">
              <ul className="space-y-1">
                {navigationItems.map((item, index) => (
                  <li key={index}>
                    <Link
                      to={item.path}
                      className={`flex items-center px-4 py-3 rounded-md transition-colors ${
                        isActive(item.path)
                          ? 'bg-primary/10 text-primary'
                          : 'text-neutral-700 hover:bg-neutral-100'
                      }`}
                    >
                      <span className="mr-3">{item.icon}</span>
                      <span>{item.label}</span>
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          </div>
        </div>
        
        {/* Content */}
        <div className="lg:col-span-3">
          <div className="bg-white rounded-lg shadow-md p-6">
            <React.Suspense fallback={<div className="py-8 text-center">Loading...</div>}>
              <Routes>
                <Route path="/" element={<PersonalInfo />} />
                <Route path="/orders" element={<Orders />} />
                <Route path="/addresses" element={<Addresses />} />
                <Route path="/wishlist" element={<ProfileWishlist />} />
                <Route path="/settings" element={<ProfileSettings />} />
              </Routes>
            </React.Suspense>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;