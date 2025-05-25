import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { Product, ProductFilter } from '../../types/product';
import { api } from '../../services/api';

interface ProductsState {
  items: Product[];
  filteredItems: Product[];
  selectedProduct: Product | null;
  filters: ProductFilter;
  searchHistory: string[];
  comparisonList: string[];
  isLoading: boolean;
  error: string | null;
}

const initialState: ProductsState = {
  items: [],
  filteredItems: [],
  selectedProduct: null,
  filters: {
    category: null,
    priceRange: [0, 5000],
    brand: null,
    availability: null,
    searchQuery: '',
  },
  searchHistory: JSON.parse(localStorage.getItem('searchHistory') || '[]'),
  comparisonList: [],
  isLoading: false,
  error: null,
};

export const fetchProducts = createAsyncThunk(
  'products/fetchProducts',
  async (_, { rejectWithValue }) => {
    try {
      // In a real app, this would be a real API call
      const response = await api.get('/products');
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch products');
    }
  }
);

export const fetchProductById = createAsyncThunk(
  'products/fetchProductById',
  async (id: string, { rejectWithValue }) => {
    try {
      // In a real app, this would be a real API call
      const response = await api.get(`/products/${id}`);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch product');
    }
  }
);

const productsSlice = createSlice({
  name: 'products',
  initialState,
  reducers: {
    setFilter: (state, action: PayloadAction<Partial<ProductFilter>>) => {
      state.filters = { ...state.filters, ...action.payload };
      
      // Apply filters
      state.filteredItems = state.items.filter(product => {
        const { category, priceRange, brand, availability, searchQuery } = state.filters;
        
        // Category filter
        if (category && product.category !== category) {
          return false;
        }
        
        // Price range filter
        if (product.price < priceRange[0] || product.price > priceRange[1]) {
          return false;
        }
        
        // Brand filter
        if (brand && product.brand !== brand) {
          return false;
        }
        
        // Availability filter
        if (availability !== null && product.inStock !== availability) {
          return false;
        }
        
        // Search query filter
        if (searchQuery && !product.name.toLowerCase().includes(searchQuery.toLowerCase())) {
          return false;
        }
        
        return true;
      });
    },
    clearFilters: (state) => {
      state.filters = {
        category: null,
        priceRange: [0, 5000],
        brand: null,
        availability: null,
        searchQuery: '',
      };
      state.filteredItems = state.items;
    },
    addToSearchHistory: (state, action: PayloadAction<string>) => {
      const query = action.payload;
      // Remove if exists and add to the beginning
      state.searchHistory = [
        query,
        ...state.searchHistory.filter(q => q !== query),
      ].slice(0, 10); // Keep only 10 most recent
      
      localStorage.setItem('searchHistory', JSON.stringify(state.searchHistory));
    },
    addToComparisonList: (state, action: PayloadAction<string>) => {
      if (!state.comparisonList.includes(action.payload)) {
        // Limit to 4 items
        state.comparisonList = [
          ...state.comparisonList.slice(0, 3),
          action.payload,
        ];
      }
    },
    removeFromComparisonList: (state, action: PayloadAction<string>) => {
      state.comparisonList = state.comparisonList.filter(id => id !== action.payload);
    },
    clearComparisonList: (state) => {
      state.comparisonList = [];
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchProducts.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchProducts.fulfilled, (state, action) => {
        state.isLoading = false;
        state.items = action.payload;
        state.filteredItems = action.payload;
      })
      .addCase(fetchProducts.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      .addCase(fetchProductById.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchProductById.fulfilled, (state, action) => {
        state.isLoading = false;
        state.selectedProduct = action.payload;
      })
      .addCase(fetchProductById.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });
  },
});

export const {
  setFilter,
  clearFilters,
  addToSearchHistory,
  addToComparisonList,
  removeFromComparisonList,
  clearComparisonList,
} = productsSlice.actions;

export default productsSlice.reducer;