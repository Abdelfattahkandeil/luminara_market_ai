export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  originalPrice?: number;
  discount?: number;
  images: string[];
  thumbnail: string;
  category: string;
  brand: string;
  inStock: boolean;
  rating: number;
  reviewCount: number;
  featured: boolean;
  newArrival: boolean;
  bestSeller: boolean;
  specifications: {
    [key: string]: string;
  };
  tags: string[];
  createdAt: string;
  updatedAt: string;
}

export interface ProductFilter {
  category: string | null;
  priceRange: [number, number];
  brand: string | null;
  availability: boolean | null;
  searchQuery: string;
}

export interface Review {
  id: string;
  productId: string;
  userId: string;
  userName: string;
  rating: number;
  comment: string;
  images?: string[];
  createdAt: string;
  updatedAt?: string;
}