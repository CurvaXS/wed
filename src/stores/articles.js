import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import apiService from '@/services/apiService';

export const useArticlesStore = defineStore('articles', () => {
  // Состояние
  const articles = ref([]);
  const articleCategories = ref([]);
  const isLoading = ref(false);
  const error = ref(null);
  
  // Фильтры и пагинация
  const filters = ref({
    search: '',
    categories: [],
    dateFrom: null,
    dateTo: null,
  });
  
  const pagination = ref({
    currentPage: 1,
    totalPages: 1,
    pageSize: 9,
    totalItems: 0
  });
  
  // Геттеры
  const filteredArticles = computed(() => {
    // Фильтрация будет происходить на стороне API, здесь возвращаем текущий список статей
    return articles.value;
  });
  
  // Методы
  const fetchArticles = async (params = {}) => {
    isLoading.value = true;
    error.value = null;
    
    try {
      const queryParams = {
        page: pagination.value.currentPage,
        page_size: pagination.value.pageSize,
        search: filters.value.search,
        ...params
      };
      
      // Добавляем категории, если они выбраны
      if (filters.value.categories && filters.value.categories.length > 0) {
        queryParams.categories = filters.value.categories.join(',');
      }
      
      // Добавляем фильтрацию по датам, если они указаны
      if (filters.value.dateFrom) {
        queryParams.date_from = filters.value.dateFrom;
      }
      
      if (filters.value.dateTo) {
        queryParams.date_to = filters.value.dateTo;
      }
      
      const response = await apiService.contentService.getArticles(queryParams);
      
      articles.value = response.results.map(article => ({
        ...article,
        // Преобразуем данные из API в формат, удобный для компонента
        image: article.image || 'https://via.placeholder.com/600x400',
        category_name: article.category_name || 'Общее',
        author_image: article.author_image || 'https://via.placeholder.com/50x50',
        views_count: article.views_count || 0
      }));
      
      // Обновляем данные пагинации
      pagination.value.totalItems = response.count;
      pagination.value.totalPages = Math.ceil(response.count / pagination.value.pageSize);
      
      return response;
    } catch (error) {
      console.error('Ошибка при загрузке статей:', error);
      error.value = 'Не удалось загрузить статьи. Пожалуйста, попробуйте позже.';
      return [];
    } finally {
      isLoading.value = false;
    }
  };
  
  const fetchArticleCategories = async () => {
    try {
      const response = await apiService.contentService.getArticleCategories();
      articleCategories.value = response;
      return response;
    } catch (error) {
      console.error('Ошибка при загрузке категорий статей:', error);
      return [];
    }
  };
  
  const fetchArticleById = async (articleId) => {
    isLoading.value = true;
    error.value = null;
    
    try {
      const response = await apiService.contentService.getArticleById(articleId);
      
      // Увеличиваем счетчик просмотров
      await apiService.contentService.incrementArticleViews(articleId);
      
      return response;
    } catch (error) {
      console.error(`Ошибка при загрузке статьи с ID ${articleId}:`, error);
      error.value = 'Не удалось загрузить статью. Пожалуйста, попробуйте позже.';
      return null;
    } finally {
      isLoading.value = false;
    }
  };
  
  const updateFilters = (newFilters) => {
    filters.value = {
      ...filters.value,
      ...newFilters
    };
    
    pagination.value.currentPage = 1; // Сбрасываем на первую страницу при изменении фильтров
    fetchArticles(); // Обновляем список статей с новыми фильтрами
  };
  
  const resetFilters = () => {
    filters.value = {
      search: '',
      categories: [],
      dateFrom: null,
      dateTo: null,
    };
    
    pagination.value.currentPage = 1;
    fetchArticles();
  };
  
  const setPage = (page) => {
    pagination.value.currentPage = page;
    fetchArticles();
  };
  
  return {
    // Состояние
    articles,
    articleCategories,
    isLoading,
    error,
    filters,
    pagination,
    
    // Геттеры
    filteredArticles,
    
    // Методы
    fetchArticles,
    fetchArticleCategories,
    fetchArticleById,
    updateFilters,
    resetFilters,
    setPage
  };
});
