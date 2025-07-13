

<script setup>
import { ref, onMounted, computed } from 'vue';
import { storeToRefs } from 'pinia';
import { useCatalogStore } from '@/stores/catalog';
import { useAuthStore } from '@/stores/auth';
import { formatPrice } from '@/services/apiService';

// Создаем экземпляры хранилищ
const catalogStore = useCatalogStore();
const authStore = useAuthStore();

// Получаем данные из хранилища
const { 
  categories, 
  cities,
  specialists, 
  isLoading: loading, 
  filters, 
  pagination,
  filteredSpecialists
} = storeToRefs(catalogStore);

const { isLoggedIn } = storeToRefs(authStore);

// Локальные состояния
const searchQuery = ref('');
const showCategories = ref(false); // состояние для отображения/скрытия блока категорий
const currency = ref('RUB'); // текущая валюта для отображения цен (RUB - рубли, KGS - сомы)
const favorites = ref([]); // массив ID избранных специалистов

// Функция переключения валюты
const toggleCurrency = () => {
  currency.value = currency.value === 'RUB' ? 'KGS' : 'RUB';
  // Сохраняем выбор пользователя в localStorage
  localStorage.setItem('preferred_currency', currency.value);
  console.log(`Валюта изменена на: ${currency.value}`);
};

// Загрузка данных при инициализации компонента
onMounted(async () => {
  // Загружаем всех специалистов
  await catalogStore.fetchSpecialists();
  await catalogStore.fetchCategories();
  await catalogStore.fetchCities();
  
  // Загружаем предпочтительную валюту из localStorage
  const preferredCurrency = localStorage.getItem('preferred_currency');
  if (preferredCurrency) {
    currency.value = preferredCurrency;
    console.log(`Загружена предпочтительная валюта: ${currency.value}`);
  }
  
  // Загружаем избранных специалистов из localStorage
  const savedFavorites = localStorage.getItem('favorites');
  if (savedFavorites) {
    try {
      favorites.value = JSON.parse(savedFavorites);
    } catch (e) {
      console.error('Ошибка при загрузке избранного:', e);
    }
  }
});

const selectedCategory = computed({
  get: () => filters.value.category || 'all',
  set: (value) => {
    catalogStore.updateFilters({ category: value === 'all' ? '' : value });
  }
});

// Методы для работы с фильтрами
const updateCity = (city) => {
  catalogStore.updateFilters({ city });
};

const updateRating = (rating) => {
  catalogStore.updateFilters({ rating });
};

const updateSortBy = (sortBy) => {
  catalogStore.updateFilters({ sortBy });
};

const resetFilters = () => {
  catalogStore.resetFilters();
};

const handleSearch = () => {
  catalogStore.updateFilters({ search: searchQuery.value });
};

// Навигация по страницам
const goToPage = (page) => {
  catalogStore.setPage(page);
};

// Вычисляемое свойство для отображения только специалистов текущей страницы
const paginatedSpecialists = computed(() => {
  const startIndex = (pagination.value.page - 1) * pagination.value.perPage;
  const endIndex = startIndex + pagination.value.perPage;
  return filteredSpecialists.value.slice(startIndex, endIndex);
});

// Вспомогательная функция для генерации страниц пагинации
const getPagesToShow = () => {
  const current = pagination.value.page;
  const total = pagination.value.totalPages;
  const result = { before: [], after: [] };
  
  // Максимальное количество страниц до и после текущей
  const maxPages = 1;
  
  // Страницы перед текущей
  for (let i = current - maxPages; i < current; i++) {
    if (i > 1) { // Первая страница показывается отдельно
      result.before.push(i);
    }
  }
  
  // Страницы после текущей
  for (let i = current + 1; i <= current + maxPages; i++) {
    if (i < total) { // Последняя страница показывается отдельно
      result.after.push(i);
    }
  }
  
  return result;
};



// Функция форматирования цены с учетом выбранной валюты
const formatSpecialistPrice = (price) => {
  return formatPrice(price, currency.value);
};

// Проверка, находится ли специалист в избранном
const isInFavorites = (specialistId) => {
  return favorites.value.includes(Number(specialistId));
};

// Добавление в избранное
const toggleFavorite = async (specialistId) => {
  if (!isLoggedIn.value) {
    // Если пользователь не авторизован, перенаправляем на страницу входа
    alert('Необходимо войти в систему, чтобы добавить специалиста в избранное');
    return;
  }
  
  try {
    if (catalogStore.isFavorite(specialistId)) {
      await catalogStore.removeFromFavorites(specialistId);
    } else {
      await catalogStore.addToFavorites(specialistId);
    }
  } catch (error) {
    console.error('Ошибка при работе с избранным:', error);
  }
};

// Загрузка данных при монтировании компонента
onMounted(async () => {
  try {
    // Загружаем предпочитаемую валюту из localStorage, если она там есть
    const savedCurrency = localStorage.getItem('preferred_currency');
    if (savedCurrency && (savedCurrency === 'RUB' || savedCurrency === 'KGS')) {
      currency.value = savedCurrency;
    }
    
    // Загружаем категории и города параллельно
    await Promise.all([
      catalogStore.fetchCategories(),
      catalogStore.fetchCities()
    ]);
    
    // Затем загружаем специалистов с явной передачей параметра page_size
    await catalogStore.fetchSpecialists({ page_size: 9 });
    
    if (isLoggedIn.value) {
      await catalogStore.fetchFavorites();
    }
  } catch (error) {
    console.error('Ошибка при загрузке данных каталога:', error);
  }
});
</script>

<template>
  <!-- Hero Section -->
  <section class="hero-gradient text-white py-16">
    <div class="container mx-auto px-4">
      <h1 class="text-4xl font-bold mb-4 text-center">Найдите идеальных специалистов для вашей свадьбы</h1>
      <p class="text-xl mb-8 text-center max-w-3xl mx-auto">Тысячи профессионалов с проверенными отзывами готовы сделать ваш день особенным</p>
      
      <!-- Search Form -->
      <form @submit.prevent="handleSearch" class="max-w-4xl mx-auto bg-white rounded-full shadow-lg overflow-hidden">
        <div class="flex">
          <!-- <label class="block text-gray-700 text-sm font-medium mb-1">Поиск специалиста</label> -->
          <input v-model="searchQuery" type="text" placeholder="Введите имя или услугу..." class="flex-grow px-6 py-4 text-gray-800 focus:outline-none">
          <button type="submit" class="bg-pink-500 text-white px-6 py-4 hover:bg-pink-700 transition">
            <i class="fas fa-search mr-2"></i> Найти
          </button>
        </div>
        <!-- <div class="md:w-1/6 md:px-4">
          <label class="block text-gray-700 text-sm font-medium mb-1">Город</label>
          <select :value="filters.city" @change="updateCity($event.target.value)" class="w-full px-4 py-2 border rounded-lg text-gray-700 focus:outline-none focus:ring-2 focus:ring-pink-500">
            <option value="">Все города</option>
            <option v-for="city in cities" :key="city.id" :value="city.name">{{ city.name }}</option>
          </select>
        </div> -->
        <!-- <div class="md:w-1/3 md:pl-4 flex items-end">
          <button type="submit" class="w-full bg-pink-500 hover:bg-pink-600 text-white font-medium py-2 px-4 rounded-lg transition">
            <i class="fas fa-search mr-2"></i> Найти
          </button>
        </div> -->
      </form>
    </div>
  </section>

  <!-- Categories Section -->
  <section class="py-12 bg-white">
    <div class="container mx-auto px-4">
      <div class="flex justify-between items-center mb-8">
        <h2 class="text-3xl font-bold text-center">Категории специалистов</h2>
        <button 
          @click="showCategories = !showCategories" 
          class="px-4 py-2 bg-pink-500 text-white rounded-lg hover:bg-pink-600 transition flex items-center"
        >
          <span>{{ showCategories ? 'Скрыть категории' : 'Показать категории' }}</span>
          <i class="fas" :class="showCategories ? 'fa-chevron-up ml-2' : 'fa-chevron-down ml-2'"></i>
        </button>
      </div>
      
      <div v-show="showCategories" class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
        <!-- All Categories -->
        <a @click.prevent="selectedCategory = 'all'" href="#" :class="{'active-category': selectedCategory === 'all'}" class="p-4 rounded-xl text-center transition hover:bg-pink-50">
          <div class="category-icon bg-pink-100 text-pink-500 mx-auto">
            <i class="fas fa-th"></i>
          </div>
          <span class="font-medium">Все</span>
        </a>
        
        <!-- Categories -->
        <a v-for="category in categories" :key="category.id" @click.prevent="selectedCategory = category.id" href="#" :class="{'active-category': selectedCategory === category.id}" class="p-4 rounded-xl text-center transition hover:bg-pink-50">
          <div class="category-icon bg-pink-100 text-pink-500 mx-auto">
            <i :class="'fas ' + category.icon"></i>
          </div>
          <span class="font-medium">{{ category.name }}</span>
        </a>
      </div>
    </div>
  </section>

  <!-- Main Content -->
  <section class="py-8 bg-gray-50">
    <div class="container mx-auto px-4">
      <div class="flex flex-col lg:flex-row gap-8">
        <!-- Filters Sidebar -->
        <div class="lg:w-1/4">
          <div class="bg-white rounded-xl shadow-sm p-6 sticky top-24">
            <h3 class="font-bold text-lg mb-4">Фильтры</h3>
            
            <!-- Location Filter -->
            <div class="mb-6">
              <h4 class="font-medium mb-3 flex items-center justify-between">
                <span>Город</span>
                <i class="fas fa-chevron-down text-sm"></i>
              </h4>
              <div class="space-y-2">
                <div v-for="city in cities" :key="city.id" class="flex items-center">
                  <input :id="'city-' + city.id" type="radio" name="city" :value="city.name" :checked="filters.city === city.name" @change="updateCity(city.name)" class="text-pink-500 focus:ring-pink-500 h-4 w-4">
                  <label :for="'city-' + city.id" class="ml-2 text-gray-700">{{ city.name }}</label>
                </div>
                <div class="flex items-center mt-2">
                  <input id="city-all" type="radio" name="city" value="" :checked="!filters.city" @change="updateCity('')" class="text-pink-500 focus:ring-pink-500 h-4 w-4">
                  <label for="city-all" class="ml-2 text-gray-700">Все города</label>
                </div>
              </div>
            </div>
            
            <!-- Rating Filter -->
            <div class="mb-6">
              <h4 class="flex justify-between items-center cursor-pointer">
                <span>Рейтинг</span>
                <i class="fas fa-chevron-down text-sm"></i>
              </h4>
              <div class="space-y-2">
                <div class="flex items-center">
                  <input id="rating-5" type="radio" name="rating" value="5" :checked="Number(filters.rating) === 5" @change="updateRating(5)" class="text-pink-500 focus:ring-pink-500 h-4 w-4">
                  <label for="rating-5" class="ml-2 text-gray-700 flex items-center">
                    <span class="rating-stars flex mr-1">
                      <i class="fas fa-star"></i>
                      <i class="fas fa-star"></i>
                      <i class="fas fa-star"></i>
                      <i class="fas fa-star"></i>
                      <i class="fas fa-star"></i>
                    </span>
                    и выше
                  </label>
                </div>
                <div class="flex items-center">
                  <input id="rating-4" type="radio" name="rating" value="4" :checked="Number(filters.rating) === 4" @change="updateRating(4)" class="text-pink-500 focus:ring-pink-500 h-4 w-4">
                  <label for="rating-4" class="ml-2 text-gray-700 flex items-center">
                    <span class="rating-stars flex mr-1">
                      <i class="fas fa-star"></i>
                      <i class="fas fa-star"></i>
                      <i class="fas fa-star"></i>
                      <i class="fas fa-star"></i>
                    </span>
                    и выше
                  </label>
                </div>
                <div class="flex items-center">
                  <input id="rating-3" type="radio" name="rating" value="3" :checked="Number(filters.rating) === 3" @change="updateRating(3)" class="text-pink-500 focus:ring-pink-500 h-4 w-4">
                  <label for="rating-3" class="ml-2 text-gray-700 flex items-center">
                    <span class="rating-stars flex mr-1">
                      <i class="fas fa-star"></i>
                      <i class="fas fa-star"></i>
                      <i class="fas fa-star"></i>
                    </span>
                    и выше
                  </label>
                </div>
                <div class="flex items-center">
                  <input id="rating-0" type="radio" name="rating" value="0" :checked="Number(filters.rating) === 0" @change="updateRating(0)" class="text-pink-500 focus:ring-pink-500 h-4 w-4">
                  <label for="rating-0" class="ml-2 text-gray-700">Все рейтинги</label>
                </div>
              </div>
            </div>
            
            <!-- Reset Filters -->
            <button @click="resetFilters" class="w-full py-2 px-4 border border-pink-500 text-pink-500 rounded-lg hover:bg-pink-50 transition font-medium">
              Сбросить фильтры
            </button>
          </div>
        </div>
        
        <!-- Professionals List -->
        <div class="lg:w-3/4">
          <!-- Sorting -->
          <div class="bg-white rounded-xl shadow-sm p-4 mb-6 flex flex-col sm:flex-row justify-between items-center">
            <div>
            <!-- Results Header -->
              <div class="flex justify-between items-center mb-6">
                <h2 class="text-xl font-bold">
                  Найдено {{ filteredSpecialists.length }} специалистов
                </h2>
                
                <div class="flex items-center gap-4">
                  <!-- Currency Toggle -->
                  <div class="flex items-center">
                    <span class="text-sm mr-2">Валюта:</span>
                    <button 
                      @click="toggleCurrency" 
                      class="bg-indigo-50 hover:bg-indigo-100 text-indigo-600 font-medium px-3 py-1 rounded-lg transition flex items-center"
                    >
                      {{ currency === 'RUB' ? 'Рубли ₽' : 'Сомы' }} 
                      <i class="fas fa-exchange-alt ml-2"></i>
                    </button>
                  </div>
                  
                  <!-- Sort Dropdown -->
                  <div class="relative">
                    <select 
                      @change="updateSortBy($event.target.value)"
                      :value="filters.sortBy"
                      class="appearance-none bg-gray-50 border border-gray-300 text-gray-700 py-2 px-4 pr-8 rounded leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                    >
                      <option value="rating">По рейтингу</option>
                      <option value="price_low">Сначала недорогие</option>
                      <option value="price_high">Сначала дорогие</option>
                      <option value="reviews">По количеству отзывов</option>
                    </select>
                    <div class="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                      <i class="fas fa-chevron-down text-xs"></i>
                    </div>

                  </div>
                </div>
              </div>
              
              <!-- Specialists List -->
              <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
                <div 
                  v-for="specialist in filteredSpecialists.slice((pagination.page - 1) * pagination.perPage, pagination.page * pagination.perPage)" 
                  :key="specialist.id" 
                  class="bg-white rounded-xl shadow-sm overflow-hidden transition hover:shadow-md"
                >
                  <div class="relative">
                    <img 
                      :src="specialist.avatar || 'https://via.placeholder.com/300x200'" 
                      alt="Specialist" 
                      class="w-full h-48 object-cover"
                    >
                    <button 
                      @click="toggleFavorite(specialist.id)" 
                      class="absolute top-4 right-4 w-10 h-10 rounded-full bg-white shadow flex items-center justify-center"
                    >
                      <i 
                        :class="['fas fa-heart', {'text-pink-500': isInFavorites(specialist.id), 'text-gray-300': !isInFavorites(specialist.id)}]"
                      ></i>
                    </button>
                  </div>
                  <div class="p-6">
                    <div class="flex justify-between items-start mb-4">
                      <h3 class="text-lg font-bold">{{ specialist.name }}</h3>
                      <div class="flex items-center bg-pink-50 text-pink-600 py-1 px-2 rounded">
                        <i class="fas fa-star mr-1 text-yellow-500"></i>
                        <span>{{ specialist.rating || '0.0' }}</span>
                      </div>
                    </div>
                    <p class="text-gray-600 mb-4 line-clamp-2">{{ specialist.description }}</p>
                    <div class="text-gray-500 text-sm flex items-center mb-2">
                      <i class="fas fa-map-marker-alt mr-1"></i>
                      <span>{{ specialist.city || 'Не указан' }}</span>
                    </div>
                    <div class="text-gray-500 text-sm flex items-center mb-2">
                      <i class="fas fa-comment mr-1"></i>
                      <span>{{ specialist.reviewsCount || 0 }} отзывов</span>
                    </div>
                    <div class="text-gray-500 text-sm flex items-center mb-4">
                      <i class="fas fa-money-bill-alt mr-1"></i>
                      <span>{{ formatPrice(specialist.price_range_min || 0, currency) }} - {{ formatPrice(specialist.price_range_max || 0, currency) }}</span>
                      <!-- Отладочный вывод, удалить после отладки -->
                      <span v-if="false">{{ console.log('Цены специалиста:', specialist.id, specialist.price_range_min, specialist.price_range_max) }}</span>
                    </div>
                    <RouterLink :to="`/catalog/specialist/${specialist.id}`" class="text-pink-500 font-medium hover:text-pink-600 flex items-center">
                      Подробнее <i class="fas fa-chevron-right ml-1 text-xs"></i>
                    </RouterLink>
                  </div>
                </div>
              </div>
              
              <!-- Empty State -->
              <div v-if="filteredSpecialists.length === 0" class="text-center py-12 bg-white rounded-xl shadow-sm">
                <i class="fas fa-search text-4xl text-gray-300 mb-4"></i>
                <h3 class="text-xl font-bold mb-2">Ничего не найдено</h3>
                <p class="text-gray-600">Попробуйте изменить параметры поиска или фильтры</p>
                <button @click="resetFilters" class="mt-4 py-2 px-4 bg-pink-500 text-white rounded-lg hover:bg-pink-600 transition font-medium">
                  Сбросить фильтры
                </button>
              </div>
              
              <!-- Pagination -->
              <div class="mt-6 flex justify-center" v-if="filteredSpecialists && filteredSpecialists.length > 0">
                <nav class="flex items-center space-x-1">
                  <!-- Previous Page Button -->
                  <a 
                    @click.prevent="pagination.page > 1 && goToPage(pagination.page - 1)" 
                    href="#" 
                    :class="[
                      'px-3 py-1 rounded-md', 
                      pagination.page > 1 ? 'bg-gray-100 text-gray-700 hover:bg-pink-50 hover:text-pink-500 cursor-pointer' : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                    ]">
                    <i class="fas fa-chevron-left text-xs"></i>
                  </a>
                  
                  <!-- First Page -->
                  <a 
                    v-if="pagination.totalPages > 0" 
                    @click.prevent="goToPage(1)" 
                    href="#" 
                    :class="[
                      'px-3 py-1 rounded-md', 
                      pagination.page === 1 ? 'bg-pink-500 text-white' : 'bg-gray-100 text-gray-700 hover:bg-pink-50 hover:text-pink-500'
                    ]">
                    1
                  </a>
                  
                  <!-- Ellipsis if needed -->
                  <span v-if="pagination.page > 3" class="px-3 py-1 text-gray-600">...</span>
                  
                  <!-- Pages before current -->
                  <template v-for="p in getPagesToShow().before">
                    <a 
                      @click.prevent="goToPage(p)" 
                      href="#" 
                      :class="[
                        'px-3 py-1 rounded-md', 
                        pagination.page === p ? 'bg-pink-500 text-white' : 'bg-gray-100 text-gray-700 hover:bg-pink-50 hover:text-pink-500'
                      ]">
                      {{ p }}
                    </a>
                  </template>
                  
                  <!-- Current page (only shown if > 1 and < totalPages) -->
                  <a 
                    v-if="pagination.page > 1 && pagination.page < pagination.totalPages" 
                    href="#" 
                    class="px-3 py-1 rounded-md bg-pink-500 text-white">
                    {{ pagination.page }}
                  </a>
                  
                  <!-- Pages after current -->
                  <template v-for="p in getPagesToShow().after">
                    <a 
                      @click.prevent="goToPage(p)" 
                      href="#" 
                      :class="[
                        'px-3 py-1 rounded-md', 
                        pagination.page === p ? 'bg-pink-500 text-white' : 'bg-gray-100 text-gray-700 hover:bg-pink-50 hover:text-pink-500'
                      ]">
                      {{ p }}
                    </a>
                  </template>
                  
                  <!-- Ellipsis if needed -->
                  <span v-if="pagination.page < pagination.totalPages - 2" class="px-3 py-1 text-gray-600">...</span>
                  
                  <!-- Last Page -->
                  <a 
                    v-if="pagination.totalPages > 1" 
                    @click.prevent="goToPage(pagination.totalPages)" 
                    href="#" 
                    :class="[
                      'px-3 py-1 rounded-md', 
                      pagination.page === pagination.totalPages ? 'bg-pink-500 text-white' : 'bg-gray-100 text-gray-700 hover:bg-pink-50 hover:text-pink-500'
                    ]">
                    {{ pagination.totalPages }}
                  </a>
                  
                  <!-- Next Page Button -->
                  <a 
                    @click.prevent="pagination.page < pagination.totalPages && goToPage(pagination.page + 1)" 
                    href="#" 
                    :class="[
                      'px-3 py-1 rounded-md', 
                      pagination.page < pagination.totalPages ? 'bg-gray-100 text-gray-700 hover:bg-pink-50 hover:text-pink-500 cursor-pointer' : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                    ]">
                    <i class="fas fa-chevron-right text-xs"></i>
                  </a>
                </nav>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>

  <!-- CTA Section -->
  <section class="py-16 bg-pink-500 text-white">
    <div class="container mx-auto px-4 text-center">
      <h2 class="text-3xl font-bold mb-4">Вы профессионал свадебной индустрии?</h2>
      <p class="text-lg mb-8 max-w-2xl mx-auto">Присоединяйтесь к нашему сервису и получайте заказы от пар, которые планируют свадьбу.</p>
      <RouterLink to="/register" class="inline-block bg-white text-pink-500 font-medium px-8 py-3 rounded-full hover:bg-gray-100 hover:shadow-lg transition">
        Стать специалистом
      </RouterLink>
    </div>
  </section>
</template>

<style scoped>
.hero-gradient {
  background: linear-gradient(135deg, #FF6B8B 0%, #FF8E53 100%);
}

.category-icon {
  width: 60px;
  height: 60px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 12px;
  font-size: 24px;
  margin-bottom: 10px;
}

.active-category {
  background-color: #FF6B8B;
  color: white;
}

.active-category .category-icon {
  background-color: white;
  color: #FF6B8B;
}

.rating-stars {
  color: #F59E0B;
}

.card-hover {
  transition: all 0.3s ease;
}

.card-hover:hover {
  transform: translateY(-5px);
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
}
</style>

<style>

</style>
