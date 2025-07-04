// catalog.js - Store для каталога специалистов
import { defineStore } from 'pinia';
import { catalogService } from '@/services/apiService';

// Статические данные категорий (до реализации API)
const staticCategories = [
  { id: 1, name: 'Фотографы', icon: 'fa-camera', color: 'indigo' },
  { id: 2, name: 'Видеографы', icon: 'fa-video', color: 'indigo' },
  { id: 3, name: 'Кейтеринг', icon: 'fa-utensils', color: 'indigo' },
  { id: 4, name: 'Музыка', icon: 'fa-music', color: 'indigo' },
  { id: 5, name: 'Организаторы', icon: 'fa-ring', color: 'indigo' },
  { id: 6, name: 'Стилисты', icon: 'fa-tshirt', color: 'indigo' },
  { id: 7, name: 'Транспорт', icon: 'fa-car', color: 'indigo' },
  { id: 8, name: 'Локации', icon: 'fa-church', color: 'indigo' },
  { id: 9, name: 'Декор', icon: 'fa-gift', color: 'indigo' },
  { id: 10, name: 'Торты', icon: 'fa-birthday-cake', color: 'indigo' },
  { id: 11, name: 'Аренда', icon: 'fa-glass-cheers', color: 'indigo' },
  { id: 12, name: 'Другое', icon: 'fa-ellipsis-h', color: 'indigo' }
];

export const useCatalogStore = defineStore('catalog', {
  state: () => ({
    specialists: [],
    categories: [],
    cities: [],
    favorites: [],
    isLoading: false,
    error: null,
    filters: {
      category: '',
      city: '',
      rating: 0,
      search: '',
      priceMin: '',
      priceMax: ''
    },
    pagination: {
      page: 1,
      totalPages: 1,
      totalItems: 0,
      perPage: 9
    }
  }),
  
  getters: {
    filteredSpecialists: (state) => {
      return state.specialists;
    },
    
    isFavorite: (state) => (specialistId) => {
      return state.favorites.some(fav => fav.specialist === specialistId);
    },
    
    getCategoryName: (state) => (categoryId) => {
      const category = state.categories.find(cat => cat.id === categoryId);
      return category ? category.name : 'Не указана';
    }
  },
  
  actions: {
    async fetchSpecialists(params = {}) {
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
        
        const response = await catalogService.getSpecialists(queryParams);
        
        // Обновляем state в зависимости от формата ответа API
        // Предполагаем, что API возвращает { results: [...], count: Number }
        
        // Добавляем отладочные данные
        console.log('Получены данные специалистов:', response);
        
        let specialistsData = [];
        
        if (response.results) {
          // Получаем данные с пагинацией
          specialistsData = response.results;
          this.pagination.totalItems = response.count;
          
          // Расширенный лог для отладки пагинации
          console.log('Пагинация - всего элементов (count):', response.count);
          console.log('Пагинация - элементов на странице (perPage):', this.pagination.perPage);
          console.log('Пагинация - вычисление totalPages:', `Math.ceil(${response.count} / ${this.pagination.perPage}) = ${Math.ceil(response.count / this.pagination.perPage)}`);
          
          // Убеждаемся, что totalPages всегда минимум 1
          const calculatedPages = Math.ceil(response.count / this.pagination.perPage);
          this.pagination.totalPages = calculatedPages > 0 ? calculatedPages : 1;
          
          console.log('Пагинация - итоговое количество страниц:', this.pagination.totalPages);
        } else {
          // Получаем массив данных без пагинации
          specialistsData = response;
          
          // Если получили массив, обновляем totalItems и totalPages
          this.pagination.totalItems = specialistsData.length;
          this.pagination.totalPages = Math.ceil(specialistsData.length / this.pagination.perPage) || 1;
          
          console.log('Данные получены как массив без пагинации:');
          console.log('- Количество элементов:', specialistsData.length);
          console.log('- Количество страниц:', this.pagination.totalPages);
        }
        
        // Преобразуем данные для отображения в шаблоне
        this.specialists = specialistsData.map(specialist => {
          // Находим категорию по строковому идентификатору или используем значение по умолчанию
          let categoryName = 'Не указана';
          
          // Преобразуем строковые идентификаторы категорий в названия
          if (specialist.category) {
            // Преобразование строковых идентификаторов в названия категорий (на основе SPECIALIST_CATEGORIES из бэкенда)
            const categoryMap = {
              'photographer': 'Фотограф',
              'videographer': 'Видеограф',
              'florist': 'Флорист',
              'decorator': 'Декоратор',
              'makeup_artist': 'Визажист',
              'hairstylist': 'Стилист по волосам',
              'venue': 'Площадка для свадьбы',
              'caterer': 'Кейтеринг',
              'band': 'Музыкальная группа',
              'dj': 'DJ',
              'wedding_planner': 'Свадебный организатор',
              'master_of_ceremony': 'Ведущий',
              'cake': 'Торты и десерты',
              'transport': 'Транспорт',
              'clothing': 'Свадебные наряды',
              'accessories': 'Аксессуары',
              'invitations': 'Приглашения',
              'other': 'Другое',
              // Дополнительные категории, которых нет в SPECIALIST_CATEGORIES, но используются в API
              'musician': 'Музыкант',
              'suit': 'Костюмы'
            };
            
            categoryName = categoryMap[specialist.category] || `Категория: ${specialist.category}`;
          } else if (specialist.category_id) {
            // Используем числовой ID категории
            categoryName = this.getCategoryName(specialist.category_id);
          }
          
          // Формируем диапазон цен
          let priceRange = 'Цена по запросу';
          if (specialist.price_range_min && specialist.price_range_max) {
            priceRange = `${parseInt(specialist.price_range_min).toLocaleString('ru-RU')} - ${parseInt(specialist.price_range_max).toLocaleString('ru-RU')} руб.`;
          }
          
          // Создаем новый объект с полями, ожидаемыми в шаблоне
          return {
            ...specialist,
            // Используем имеющиеся поля или значения по умолчанию
            id: specialist.id,
            name: specialist.name || specialist.full_name || 'Имя не указано',
            categoryName: categoryName,
            image: specialist.avatar || specialist.image || specialist.photo || 'https://via.placeholder.com/300x200?text=Нет+фото',
            city: specialist.city || specialist.location || 'Город не указан',
            rating: specialist.rating || specialist.rating_avg || specialist.avg_rating || '5.0',
            reviewsCount: specialist.review_count || specialist.reviews_count || specialist.reviewsCount || 0,
            priceRange: specialist.price_range || specialist.priceRange || priceRange,
            featured: specialist.featured || specialist.is_featured || false
          };
        });
        
        // Отладочная информация
        console.log('Преобразованные данные специалистов:', this.specialists);
        
        return this.specialists;
      } catch (error) {
        this.error = error.message || 'Ошибка при загрузке специалистов';
        console.error('Ошибка при загрузке специалистов:', error);
        return [];
      } finally {
        this.isLoading = false;
      }
    },
    
    async fetchCategories() {
      if (this.categories.length > 0) return this.categories;
      
      this.isLoading = true;
      
      try {
        // Закомментированный API-запрос (вернем когда будет реализован на бэкенде)
        // const categories = await catalogService.getCategories();
        
        // Используем статические данные вместо API-запроса
        console.log('Используются статические категории вместо API');
        this.categories = staticCategories;
        return staticCategories;
      } catch (error) {
        console.error('Ошибка при загрузке категорий:', error);
        // Если произошла ошибка, всё равно используем статические данные
        this.categories = staticCategories;
        return staticCategories;
      } finally {
        this.isLoading = false;
      }
    },
    
    async fetchCities() {
      if (this.cities.length > 0) return this.cities;
      
      this.isLoading = true;
      
      try {
        const cities = await catalogService.getCities();
        this.cities = cities;
        return cities;
      } catch (error) {
        console.error('Ошибка при загрузке городов:', error);
        return [];
      } finally {
        this.isLoading = false;
      }
    },
    
    async fetchFavorites() {
      this.isLoading = true;
      
      try {
        const favorites = await catalogService.getFavorites();
        this.favorites = favorites;
        return favorites;
      } catch (error) {
        console.error('Ошибка при загрузке избранного:', error);
        return [];
      } finally {
        this.isLoading = false;
      }
    },
    
    async addToFavorites(specialistId) {
      try {
        const response = await catalogService.addToFavorites(specialistId);
        // Обновляем список избранного
        await this.fetchFavorites();
        return response;
      } catch (error) {
        console.error('Ошибка при добавлении в избранное:', error);
        throw error;
      }
    },
    
    async removeFromFavorites(specialistId) {
      // Найдем ID записи избранного
      const favorite = this.favorites.find(fav => fav.specialist === specialistId);
      if (!favorite) return;
      
      try {
        await catalogService.removeFromFavorites(favorite.id);
        // Обновляем список избранного
        await this.fetchFavorites();
      } catch (error) {
        console.error('Ошибка при удалении из избранного:', error);
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
      
      // Автоматически обновляем список специалистов
      return this.fetchSpecialists();
    },
    
    // Изменение страницы пагинации
    setPage(page) {
      this.pagination.page = page;
      return this.fetchSpecialists();
    },
    
    // Сброс фильтров
    resetFilters() {
      this.filters = {
        category: '',
        city: '',
        rating: 0,
        search: '',
        priceMin: '',
        priceMax: ''
      };
      this.pagination.page = 1;
      return this.fetchSpecialists();
    },
    
    // Получение рекомендуемых специалистов для главной страницы
    async fetchFeaturedSpecialists() {
      this.isLoading = true;
      this.error = null;
      
      try {
        // Используем модель FeaturedSpecialist из бэкенда для получения рекомендуемых специалистов
        const response = await catalogService.getSpecialists({ featured: true, page_size: 4 });
        
        if (response.results) {
          this.specialists = response.results.map(specialist => ({
            ...specialist,
            // Если нет изображения, используем заглушку
            image: specialist.avatar || specialist.main_image || 'https://via.placeholder.com/300x200?text=Фото+специалиста',
            // Форматируем имя
            name: specialist.display_name || `${specialist.user?.first_name || ''} ${specialist.user?.last_name || ''}`.trim() || 'Специалист',
            // Форматируем цену
            price_range_min: specialist.price_range_min || specialist.min_price || '30 000'
          }));
        } else {
          this.specialists = response.map(specialist => ({
            ...specialist,
            image: specialist.avatar || specialist.main_image || 'https://via.placeholder.com/300x200?text=Фото+специалиста',
            name: specialist.display_name || `${specialist.user?.first_name || ''} ${specialist.user?.last_name || ''}`.trim() || 'Специалист',
            price_range_min: specialist.price_range_min || specialist.min_price || '30 000'
          }));
        }
        
        return this.specialists;
      } catch (error) {
        console.error('Ошибка при загрузке рекомендуемых специалистов:', error);
        this.error = error.message || 'Не удалось загрузить рекомендуемых специалистов';
        return [];
      } finally {
        this.isLoading = false;
      }
    }
  }
});
