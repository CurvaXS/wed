// weddings.js - Store для реальных свадеб
import { defineStore } from 'pinia';
import { weddingsService } from '@/services/apiService';

export const useWeddingsStore = defineStore('weddings', {
  state: () => ({
    weddings: [],
    featuredWeddings: [],
    currentWedding: null,
    isLoading: false,
    error: null,
    filters: {
      style: '',
      is_featured: false,
      search: ''
    },
    pagination: {
      page: 1,
      totalPages: 1,
      totalItems: 0,
      perPage: 9
    }
  }),
  
  getters: {
    filteredWeddings: (state) => {
      return state.weddings;
    }
  },
  
  actions: {
    async fetchWeddings(params = {}) {
      this.isLoading = true;
      this.error = null;
      
      try {
        // Применяем фильтры из state и переданные параметры
        const queryParams = {
          ...this.filters,
          ...params,
          page: params.page || this.pagination.page,
          page_size: this.pagination.perPage
        };
        
        const response = await weddingsService.getRealWeddings(queryParams);
        
        // Обновляем state в зависимости от формата ответа API
        if (response.results) {
          this.weddings = response.results;
          this.pagination.totalItems = response.count;
          this.pagination.totalPages = Math.ceil(response.count / this.pagination.perPage);
        } else {
          this.weddings = response;
        }
        
        return this.weddings;
      } catch (error) {
        this.error = error.message || 'Ошибка при загрузке свадеб';
        console.error('Ошибка при загрузке свадеб:', error);
        return [];
      } finally {
        this.isLoading = false;
      }
    },
    
    async fetchFeaturedWeddings() {
      try {
        const response = await weddingsService.getRealWeddings({ is_featured: true, page_size: 4 });
        
        if (response.results) {
          this.featuredWeddings = response.results;
        } else {
          this.featuredWeddings = response;
        }
        
        return this.featuredWeddings;
      } catch (error) {
        console.error('Ошибка при загрузке избранных свадеб:', error);
        return [];
      }
    },
    
    async fetchWeddingById(id) {
      this.isLoading = true;
      this.error = null;
      
      try {
        const wedding = await weddingsService.getRealWeddingById(id);
        this.currentWedding = wedding;
        
        // Загружаем связанные данные
        if (wedding) {
          const [images, details] = await Promise.all([
            weddingsService.getWeddingImages(id),
            weddingsService.getWeddingDetails(id)
          ]);
          
          // Добавляем связанные данные к текущей свадьбе
          this.currentWedding.images = images;
          this.currentWedding.details = details;
        }
        
        return this.currentWedding;
      } catch (error) {
        this.error = error.message || `Ошибка при загрузке свадьбы с ID ${id}`;
        console.error(`Ошибка при загрузке свадьбы с ID ${id}:`, error);
        return null;
      } finally {
        this.isLoading = false;
      }
    },
    
    async toggleLike(weddingId) {
      try {
        const response = await weddingsService.likeWedding(weddingId);
        
        // Обновляем статус лайка в текущей свадьбе
        if (this.currentWedding && this.currentWedding.id === weddingId) {
          const isLiked = response.status === 'liked';
          this.currentWedding.is_liked = isLiked;
          this.currentWedding.likes_count = isLiked 
            ? this.currentWedding.likes_count + 1 
            : this.currentWedding.likes_count - 1;
        }
        
        return response;
      } catch (error) {
        console.error('Ошибка при добавлении/удалении лайка:', error);
        throw error;
      }
    },
    
    async addComment(weddingId, text) {
      try {
        const comment = await weddingsService.addComment(weddingId, text);
        
        // Добавляем новый комментарий к текущей свадьбе
        if (this.currentWedding && this.currentWedding.id === weddingId) {
          if (!this.currentWedding.comments) {
            this.currentWedding.comments = [];
          }
          this.currentWedding.comments.unshift(comment);
          this.currentWedding.comments_count += 1;
        }
        
        return comment;
      } catch (error) {
        console.error('Ошибка при добавлении комментария:', error);
        throw error;
      }
    },
    
    // Обновление фильтров
    updateFilters(newFilters) {
      this.filters = {
        ...this.filters,
        ...newFilters
      };
      
      // Сбрасываем страницу на первую при изменении фильтров
      this.pagination.page = 1;
      
      // Автоматически обновляем список свадеб
      return this.fetchWeddings();
    },
    
    // Изменение страницы пагинации
    setPage(page) {
      this.pagination.page = page;
      return this.fetchWeddings();
    },
    
    // Сброс фильтров
    resetFilters() {
      this.filters = {
        style: '',
        is_featured: false,
        search: ''
      };
      this.pagination.page = 1;
      return this.fetchWeddings();
    }
  }
});
