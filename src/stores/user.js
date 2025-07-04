// stores/user.js
import { defineStore } from 'pinia';
import { authService } from '../services/apiService';

export const useUserStore = defineStore('user', {
  state: () => ({
    user: null,
    token: localStorage.getItem('token') || null,
    loading: false,
    error: null,
  }),
  
  getters: {
    isAuthenticated: (state) => !!state.token,
    isCouple: (state) => state.user && state.user.user_type === 'couple',
    isSpecialist: (state) => state.user && state.user.user_type === 'specialist',
    isAdmin: (state) => state.user && state.user.user_type === 'admin',
    currentUser: (state) => state.user,
    userRole: (state) => state.user ? state.user.user_type : null,
  },
  
  actions: {
    setUser(user) {
      this.user = user;
    },
    
    setToken(token) {
      this.token = token;
      if (token) {
        localStorage.setItem('token', token);
      } else {
        localStorage.removeItem('token');
      }
    },
    
    async fetchCurrentUser() {
      if (!this.token) return;
      
      this.loading = true;
      
      try {
        // Используем authService из apiService.js для получения данных пользователя
        const userData = await authService.getCurrentUser();
        console.log('Получены данные пользователя:', userData);
        this.setUser(userData);
      } catch (error) {
        console.error('Ошибка при получении данных пользователя:', error);
        this.error = error.message || 'Ошибка при получении данных пользователя';
        // Не удаляем токен при ошибке получения профиля
      } finally {
        this.loading = false;
      }
    },
    
    logout() {
      this.user = null;
      this.token = null;
      localStorage.removeItem('token');
    }
  }
});
