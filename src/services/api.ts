import axios from 'axios';
import { store } from '../store';
import { logout } from '../store/slices/authSlice';

// Create an Axios instance with default config
export const api = axios.create({
  baseURL: '/api', // In real application, this would be the actual API URL
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000,
});

// Request interceptor for adding auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for handling token expiration
api.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    const originalRequest = error.config;
    
    // If the error is 401 and we haven't tried to refresh the token yet
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      
      try {
        // Try to refresh the token
        const refreshToken = localStorage.getItem('refreshToken');
        
        if (!refreshToken) {
          // If no refresh token, logout
          store.dispatch(logout());
          return Promise.reject(error);
        }
        
        // In a real app, this would be a call to refresh the token
        const response = await axios.post('/api/auth/refresh-token', {
          refreshToken,
        });
        
        const { token, refreshToken: newRefreshToken } = response.data;
        
        // Store the new tokens
        localStorage.setItem('token', token);
        localStorage.setItem('refreshToken', newRefreshToken);
        
        // Update the authorization header
        api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        
        // Retry the original request
        return api(originalRequest);
      } catch (refreshError) {
        // If refresh fails, logout
        store.dispatch(logout());
        return Promise.reject(refreshError);
      }
    }
    
    return Promise.reject(error);
  }
);

// Mock API functions for development
export const mockApi = {
  // Products
  getProducts: () => Promise.resolve({ data: mockProducts }),
  getProductById: (id: string) => Promise.resolve({ data: mockProducts.find(p => p.id === id) }),
  
  // Auth
  login: (credentials: { email: string; password: string }) => 
    Promise.resolve({
      data: {
        token: 'mock-token-12345',
        refreshToken: 'mock-refresh-token-12345',
        user: mockUser,
      }
    }),
  register: (data: any) => 
    Promise.resolve({
      data: {
        token: 'mock-token-12345',
        refreshToken: 'mock-refresh-token-12345',
        user: { ...mockUser, ...data },
      }
    }),
};

// Mock data
const mockUser = {
  id: '1',
  email: 'user@example.com',
  firstName: 'John',
  lastName: 'Doe',
  avatar: 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg',
  phone: '555-1234',
  role: 'customer' as const,
  createdAt: '2023-01-01T00:00:00.000Z',
  updatedAt: '2023-01-01T00:00:00.000Z',
};

const mockProducts = [
  {
    id: '1',
    name: 'Professional Camera XL-1000',
    description: 'High-end professional camera with 50MP sensor and 4K video capabilities.',
    price: 1299.99,
    originalPrice: 1499.99,
    discount: 13,
    images: [
      'https://images.pexels.com/photos/90946/pexels-photo-90946.jpeg',
      'https://images.pexels.com/photos/243757/pexels-photo-243757.jpeg',
      'https://images.pexels.com/photos/3497128/pexels-photo-3497128.jpeg'
    ],
    thumbnail: 'https://images.pexels.com/photos/90946/pexels-photo-90946.jpeg',
    category: 'Electronics',
    brand: 'CameraPro',
    inStock: true,
    rating: 4.8,
    reviewCount: 128,
    featured: true,
    newArrival: false,
    bestSeller: true,
    specifications: {
      'Sensor': '50MP Full-Frame CMOS',
      'Video': '4K 60fps',
      'Connectivity': 'WiFi, Bluetooth, USB-C',
      'Battery Life': 'Up to 500 shots'
    },
    tags: ['camera', 'professional', 'photography'],
    createdAt: '2023-04-12T14:30:00Z',
    updatedAt: '2023-05-20T09:15:00Z'
  },
  {
    id: '2',
    name: 'Wireless Noise-Cancelling Headphones',
    description: 'Premium wireless headphones with active noise cancellation and 30 hours of battery life.',
    price: 249.99,
    originalPrice: 299.99,
    discount: 16,
    images: [
      'https://images.pexels.com/photos/577769/pexels-photo-577769.jpeg',
      'https://images.pexels.com/photos/1649771/pexels-photo-1649771.jpeg',
      'https://images.pexels.com/photos/1591/technology-music-sound-things.jpg'
    ],
    thumbnail: 'https://images.pexels.com/photos/577769/pexels-photo-577769.jpeg',
    category: 'Audio',
    brand: 'SoundMaster',
    inStock: true,
    rating: 4.6,
    reviewCount: 302,
    featured: true,
    newArrival: true,
    bestSeller: true,
    specifications: {
      'Type': 'Over-ear',
      'Noise Cancellation': 'Active',
      'Battery Life': '30 hours',
      'Connectivity': 'Bluetooth 5.0, 3.5mm'
    },
    tags: ['headphones', 'wireless', 'audio'],
    createdAt: '2023-03-05T11:45:00Z',
    updatedAt: '2023-05-18T16:20:00Z'
  },
  {
    id: '3',
    name: 'Ultra-thin Laptop Pro',
    description: 'Powerful yet lightweight laptop with 16" display, 16GB RAM and 1TB SSD storage.',
    price: 1499.99,
    images: [
      'https://images.pexels.com/photos/18105/pexels-photo.jpg',
      'https://images.pexels.com/photos/459653/pexels-photo-459653.jpeg',
      'https://images.pexels.com/photos/705164/computer-laptop-work-place-camera-705164.jpeg'
    ],
    thumbnail: 'https://images.pexels.com/photos/18105/pexels-photo.jpg',
    category: 'Computers',
    brand: 'TechElite',
    inStock: true,
    rating: 4.9,
    reviewCount: 87,
    featured: true,
    newArrival: true,
    bestSeller: false,
    specifications: {
      'Processor': 'Intel Core i7, 10th Gen',
      'RAM': '16GB DDR4',
      'Storage': '1TB SSD',
      'Display': '16" 4K IPS'
    },
    tags: ['laptop', 'computer', 'ultrabook'],
    createdAt: '2023-05-01T10:00:00Z',
    updatedAt: '2023-05-22T14:10:00Z'
  },
  {
    id: '4',
    name: 'Smart Fitness Watch',
    description: 'Track your fitness goals with this waterproof smart watch featuring heart rate monitoring and GPS.',
    price: 199.99,
    originalPrice: 249.99,
    discount: 20,
    images: [
      'https://images.pexels.com/photos/437037/pexels-photo-437037.jpeg',
      'https://images.pexels.com/photos/393047/pexels-photo-393047.jpeg',
      'https://images.pexels.com/photos/280254/pexels-photo-280254.jpeg'
    ],
    thumbnail: 'https://images.pexels.com/photos/437037/pexels-photo-437037.jpeg',
    category: 'Wearables',
    brand: 'FitTech',
    inStock: true,
    rating: 4.5,
    reviewCount: 216,
    featured: false,
    newArrival: true,
    bestSeller: true,
    specifications: {
      'Display': '1.5" AMOLED',
      'Battery Life': 'Up to 7 days',
      'Water Resistance': '5ATM',
      'Sensors': 'Heart rate, GPS, Accelerometer'
    },
    tags: ['smartwatch', 'fitness', 'wearable'],
    createdAt: '2023-02-15T08:30:00Z',
    updatedAt: '2023-05-19T11:45:00Z'
  },
  {
    id: '5',
    name: 'Premium Wireless Earbuds',
    description: 'True wireless earbuds with premium sound quality and active noise cancellation.',
    price: 179.99,
    images: [
      'https://images.pexels.com/photos/3780681/pexels-photo-3780681.jpeg',
      'https://images.pexels.com/photos/3394650/pexels-photo-3394650.jpeg',
      'https://images.pexels.com/photos/3394651/pexels-photo-3394651.jpeg'
    ],
    thumbnail: 'https://images.pexels.com/photos/3780681/pexels-photo-3780681.jpeg',
    category: 'Audio',
    brand: 'SoundMaster',
    inStock: true,
    rating: 4.7,
    reviewCount: 178,
    featured: false,
    newArrival: true,
    bestSeller: false,
    specifications: {
      'Type': 'In-ear',
      'Noise Cancellation': 'Active',
      'Battery Life': '8 hours (30 with case)',
      'Connectivity': 'Bluetooth 5.2'
    },
    tags: ['earbuds', 'wireless', 'audio'],
    createdAt: '2023-04-05T15:20:00Z',
    updatedAt: '2023-05-21T13:40:00Z'
  }
];