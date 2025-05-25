import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface UiState {
  language: 'en' | 'ar';
  theme: 'light' | 'dark';
  sidebarOpen: boolean;
  mobileMenuOpen: boolean;
  searchOpen: boolean;
  isLoading: boolean;
  toast: {
    visible: boolean;
    message: string;
    type: 'success' | 'error' | 'info' | 'warning' | null;
  };
}

const initialState: UiState = {
  language: localStorage.getItem('language') as 'en' | 'ar' || 'en',
  theme: localStorage.getItem('theme') as 'light' | 'dark' || 'light',
  sidebarOpen: false,
  mobileMenuOpen: false,
  searchOpen: false,
  isLoading: false,
  toast: {
    visible: false,
    message: '',
    type: null,
  },
};

const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    toggleLanguage: (state) => {
      state.language = state.language === 'en' ? 'ar' : 'en';
      localStorage.setItem('language', state.language);
      document.documentElement.dir = state.language === 'ar' ? 'rtl' : 'ltr';
      document.documentElement.lang = state.language;
    },
    toggleTheme: (state) => {
      state.theme = state.theme === 'light' ? 'dark' : 'light';
      localStorage.setItem('theme', state.theme);
    },
    toggleSidebar: (state) => {
      state.sidebarOpen = !state.sidebarOpen;
    },
    toggleMobileMenu: (state) => {
      state.mobileMenuOpen = !state.mobileMenuOpen;
    },
    toggleSearch: (state) => {
      state.searchOpen = !state.searchOpen;
    },
    setIsLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
    showToast: (state, action: PayloadAction<{ message: string; type: 'success' | 'error' | 'info' | 'warning' }>) => {
      state.toast = {
        visible: true,
        message: action.payload.message,
        type: action.payload.type,
      };
    },
    hideToast: (state) => {
      state.toast.visible = false;
    },
  },
});

export const {
  toggleLanguage,
  toggleTheme,
  toggleSidebar,
  toggleMobileMenu,
  toggleSearch,
  setIsLoading,
  showToast,
  hideToast,
} = uiSlice.actions;

export default uiSlice.reducer;