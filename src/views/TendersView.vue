<template>
    <!-- Page Header -->
    <section class="bg-white py-12">
        <div class="container mx-auto px-4">
            <div class="flex flex-col md:flex-row justify-between items-start md:items-center">
                <div>
                    <h1 class="text-3xl md:text-4xl font-bold mb-2">Тендеры на свадьбу</h1>
                    <p class="text-gray-600">Создайте тендер и получите предложения от лучших свадебных профессионалов</p>
                </div>
                <button id="create-tender-btn" class="btn-primary text-white px-6 py-3 rounded-full mt-4 md:mt-0">
                    <i class="fas fa-plus mr-2"></i> Создать тендер
                </button>
            </div>
        </div>
    </section>

    <!-- Tenders Filter -->
    <section class="bg-gray-50 py-6 border-b border-gray-200">
        <div class="container mx-auto px-4">
            <div class="flex flex-col md:flex-row items-center justify-between">
                <div class="w-full md:w-auto mb-4 md:mb-0">
                    <div class="relative">
                        <input 
                            v-model="searchQuery" 
                            @input="debounceSearch"
                            type="text" 
                            placeholder="Поиск по тендерам..." 
                            class="w-full md:w-64 pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent">
                        <i class="fas fa-search absolute left-3 top-3 text-gray-400"></i>
                    </div>
                </div>
                
                <div class="flex flex-wrap gap-3 w-full md:w-auto">
                    <select 
                        v-model="selectedCategory"
                        @change="handleFilterChange"
                        class="bg-white border rounded-lg px-4 py-2 focus:ring-2 focus:ring-pink-500 focus:border-transparent">
                        <option value="">Все категории</option>
                        <option value="photography">Фотографы</option>
                        <option value="venue">Площадки</option>
                        <option value="catering">Кейтеринг</option>
                        <option value="music">Музыка</option>
                        <option value="decor">Декор</option>
                        <option value="other">Другое</option>
                    </select>
                    
                    <select 
                        v-model="selectedBudget"
                        @change="handleFilterChange"
                        class="bg-white border rounded-lg px-4 py-2 focus:ring-2 focus:ring-pink-500 focus:border-transparent">
                        <option value="">Любой бюджет</option>
                        <option value="0-50000">До 50 000 ₽</option>
                        <option value="50000-100000">50 000 - 100 000 ₽</option>
                        <option value="100000-200000">100 000 - 200 000 ₽</option>
                        <option value="200000-">От 200 000 ₽</option>
                    </select>
                    
                    <select 
                        v-model="selectedDate"
                        @change="handleFilterChange"
                        class="bg-white border rounded-lg px-4 py-2 focus:ring-2 focus:ring-pink-500 focus:border-transparent">
                        <option value="">Любая дата</option>
                        <option value="1m">Ближайший месяц</option>
                        <option value="3m">Следующие 3 месяца</option>
                        <option value="2023">2023 год</option>
                        <option value="2024">2024 год</option>
                    </select>
                </div>
            </div>
        </div>
    </section>

    <!-- Tenders List -->
    <section class="py-12 bg-white">
        <div class="container mx-auto px-4">
            <div class="mb-8 flex justify-between items-center">
                <h2 class="text-2xl font-bold">Активные тендеры</h2>
                <div class="text-gray-500">
                    <span class="font-medium text-gray-700">124</span> тендера
                </div>
            </div>
            
            <div v-if="loading" class="flex justify-center items-center py-20">
                <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-500"></div>
            </div>

            <div v-else-if="error" class="text-center py-20">
                <i class="fas fa-exclamation-circle text-4xl text-red-500 mb-4"></i>
                <p class="text-lg text-gray-700">{{ error }}</p>
                <button @click="fetchTenders" class="mt-4 px-6 py-2 bg-pink-500 text-white rounded-lg hover:bg-pink-600 transition">
                    Попробовать снова
                </button>
            </div>

            <div v-else-if="tenders.length === 0" class="text-center py-20">
                <i class="fas fa-search text-4xl text-gray-400 mb-4"></i>
                <p class="text-lg text-gray-700">Тендеры не найдены</p>
                <p class="text-gray-500">Попробуйте изменить параметры фильтрации или создайте свой тендер</p>
            </div>

            <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
                <!-- Tender Card -->
                <div v-for="tender in tenders" :key="tender.id" class="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition">
                    <div class="p-6">
                        <div class="flex justify-between items-start mb-4">
                            <div>
                                <span class="inline-flex items-center text-sm text-gray-600 mb-2">
                                    <i :class="getCategoryIcon(tender.category)"></i> {{ getCategoryName(tender.category) }}
                                </span>
                                <h3 class="text-xl font-bold">
                                    <a @click="viewTenderDetails(tender.id)" class="hover:text-pink-500 cursor-pointer">{{ tender.title }}</a>
                                </h3>
                            </div>
                            <span class="text-xs text-gray-500">Опубликован {{ formatDate(tender.created_at) }}</span>
                        </div>
                        
                        <p class="text-gray-600 mb-4 line-clamp-2">{{ tender.description }}</p>
                        
                        <div class="flex flex-wrap gap-4 mb-4">
                            <div class="flex items-center">
                                <i class="fas fa-coins text-gray-400 mr-2"></i>
                                <span>
                                    <span class="font-medium">{{ tender.budget_min || 0 }} - {{ tender.budget_max || 'не ограничен' }} ₽</span>
                                </span>
                            </div>
                            <div class="flex items-center">
                                <i class="fas fa-calendar text-gray-400 mr-2"></i>
                                <span>
                                    <span class="font-medium">{{ formatEventDate(tender.event_date) }}</span>
                                </span>
                            </div>
                        </div>
                        
                        <div class="flex items-center justify-between">
                            <div class="flex-1 mr-4">
                                <div class="flex items-center mb-1">
                                    <span class="text-sm font-medium">Предложения: {{ tender.offer_count || 0 }}</span>
                                    <span v-if="tender.deadline" class="ml-auto text-xs text-gray-500">Закрытие через {{ formatDate(tender.deadline) }}</span>
                                </div>
                                <div class="bg-gray-200 rounded-full h-2 overflow-hidden">
                                    <div class="bg-pink-500 h-2 rounded-full" :style="{ width: getProgressWidth(tender.offer_count) }"></div>
                                </div>
                            </div>
                            <a @click="viewTenderDetails(tender.id)" class="btn-primary text-white py-2 px-4 rounded-lg text-sm cursor-pointer">Подробнее</a>
                        </div>
                    </div>
                    
                    <div v-if="tender.couple" class="px-6 py-3 bg-gray-50 border-t border-gray-100 flex items-center">
                        <img :src="tender.couple.avatar || 'https://via.placeholder.com/32'" alt="User" class="w-8 h-8 rounded-full mr-3 object-cover">
                        <div>
                            <div class="text-sm font-medium">{{ tender.couple.bride_name || '' }} {{ tender.couple.groom_name ? 'и ' + tender.couple.groom_name : '' }}</div>
                            <div class="text-xs text-gray-500">Пара {{ tender.couple.city ? 'из ' + tender.couple.city : '' }}</div>
                            </div>
                        </div>
                    <!-- </div> -->
                </div>
            </div>
            
            <!-- Pagination -->
            <div v-if="totalPages > 1" class="mt-12 flex justify-center">
                <nav class="flex items-center space-x-1">
                    <button 
                        @click="goToPage(currentPage - 1)" 
                        :disabled="currentPage === 1"
                        :class="[currentPage === 1 ? 'opacity-50 cursor-not-allowed' : 'hover:bg-gray-100 cursor-pointer', 'w-10 h-10 flex items-center justify-center rounded-full text-gray-500']">
                        <i class="fas fa-chevron-left"></i>
                    </button>
                    
                    <!-- First page -->
                    <button 
                        v-if="totalPages > 0" 
                        @click="goToPage(1)" 
                        :class="[currentPage === 1 ? 'bg-pink-500 text-white' : 'text-gray-700 hover:bg-gray-100', 'w-10 h-10 flex items-center justify-center rounded-full font-medium']">
                        1
                    </button>
                    
                    <!-- Ellipsis if needed -->
                    <span v-if="startPage > 2" class="px-2 text-gray-500">...</span>
                    
                    <!-- Middle pages -->
                    <button 
                        v-for="page in middlePages" 
                        :key="page" 
                        @click="goToPage(page)" 
                        :class="[currentPage === page ? 'bg-pink-500 text-white' : 'text-gray-700 hover:bg-gray-100', 'w-10 h-10 flex items-center justify-center rounded-full font-medium']">
                        {{ page }}
                    </button>
                    
                    <!-- Ellipsis if needed -->
                    <span v-if="endPage < totalPages - 1" class="px-2 text-gray-500">...</span>
                    
                    <!-- Last page -->
                    <button 
                        v-if="totalPages > 1" 
                        @click="goToPage(totalPages)" 
                        :class="[currentPage === totalPages ? 'bg-pink-500 text-white' : 'text-gray-700 hover:bg-gray-100', 'w-10 h-10 flex items-center justify-center rounded-full font-medium']">
                        {{ totalPages }}
                    </button>
                    
                    <button 
                        @click="goToPage(currentPage + 1)" 
                        :disabled="currentPage === totalPages"
                        :class="[currentPage === totalPages ? 'opacity-50 cursor-not-allowed' : 'hover:bg-gray-100 cursor-pointer', 'w-10 h-10 flex items-center justify-center rounded-full text-gray-500']">
                        <i class="fas fa-chevron-right"></i>
                    </button>
                </nav>
            </div>
        </div>
    </section>

    <!-- Create Tender Modal -->
    <div v-if="showCreateModal" class="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
        <div class="bg-white rounded-xl max-w-2xl w-full p-8 relative max-h-[90vh] overflow-y-auto">
            <button @click="closeCreateModal" class="absolute top-4 right-4 text-gray-500 hover:text-gray-700">
                <i class="fas fa-times text-xl"></i>
            </button>
            
            <h3 class="text-2xl font-bold mb-6">Создать новый тендер</h3>
            
            <form @submit.prevent="createTender">
                <div class="mb-6">
                    <label class="block text-gray-700 mb-2 font-medium">Категория услуги</label>
                    <div class="grid grid-cols-2 md:grid-cols-3 gap-3">
                        <button 
                            type="button" 
                            v-for="cat in ['photography', 'venue', 'catering', 'music', 'decor', 'other']" 
                            :key="cat"
                            @click="selectCategory(cat)"
                            :class="[newTender.category === cat ? 'border-pink-500 text-pink-500' : '', 'tender-category-btn border rounded-lg py-3 px-4 text-center hover:border-pink-500 hover:text-pink-500 transition']" 
                            :data-category="cat">
                            <i :class="[getCategoryIcon(cat).replace('mr-1', ''), 'text-xl mb-2 block']"></i>
                            <span>{{ getCategoryName(cat) }}</span>
                        </button>
                    </div>
                    <p v-if="createErrors?.category" class="text-red-500 text-sm mt-2">{{ createErrors.category }}</p>
                </div>
                
                <div class="mb-6">
                    <label for="tender-title" class="block text-gray-700 mb-2 font-medium">Название тендера</label>
                    <input 
                        type="text" 
                        v-model="newTender.title" 
                        id="tender-title" 
                        class="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent" 
                        placeholder="Например: Ищем фотографа на свадьбу">
                    <p v-if="createErrors?.title" class="text-red-500 text-sm mt-2">{{ createErrors.title }}</p>
                </div>
                
                <div class="mb-6">
                    <label for="tender-description" class="block text-gray-700 mb-2 font-medium">Описание</label>
                    <textarea 
                        v-model="newTender.description" 
                        id="tender-description" 
                        rows="4" 
                        class="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent" 
                        placeholder="Опишите, что вам нужно, ваши предпочтения и пожелания"></textarea>
                    <p v-if="createErrors?.description" class="text-red-500 text-sm mt-2">{{ createErrors.description }}</p>
                </div>
                
                <div class="grid md:grid-cols-2 gap-6 mb-6">
                    <div>
                        <label for="wedding-date" class="block text-gray-700 mb-2 font-medium">Дата свадьбы</label>
                        <input 
                            v-model="newTender.event_date" 
                            type="date" 
                            id="wedding-date" 
                            class="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent">
                        <p v-if="createErrors?.event_date" class="text-red-500 text-sm mt-2">{{ createErrors.event_date }}</p>
                    </div>
                    
                    <div>
                        <label class="block text-gray-700 mb-2 font-medium">Бюджет</label>
                        <div class="flex items-center">
                            <input 
                                v-model.number="newTender.budget_min" 
                                type="number" 
                                placeholder="От" 
                                class="w-1/2 px-4 py-2 border rounded-l-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent">
                            <span class="bg-gray-100 px-3 py-2 border-t border-b border-gray-300">—</span>
                            <input 
                                v-model.number="newTender.budget_max" 
                                type="number" 
                                placeholder="До" 
                                class="w-1/2 px-4 py-2 border rounded-r-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent">
                        </div>
                        <p v-if="createErrors?.budget_min || createErrors?.budget_max" class="text-red-500 text-sm mt-2">
                            {{ createErrors?.budget_min || createErrors?.budget_max }}
                        </p>
                    </div>
                </div>
                
                <!-- Загрузка файлов -->
                <div class="mb-6">
                    <label class="block text-gray-700 mb-2 font-medium">Документы и изображения</label>
                    <div class="flex flex-col space-y-2">
                        <div class="flex items-center justify-center w-full">
                            <label for="attachment-files" class="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100">
                                <div class="flex flex-col items-center justify-center pt-5 pb-6">
                                    <i class="fas fa-cloud-upload-alt text-2xl text-gray-400 mb-2"></i>
                                    <p class="mb-2 text-sm text-gray-500"><span class="font-semibold">Нажмите чтобы загрузить</span> или перетащите файлы</p>
                                    <p class="text-xs text-gray-500">Фотографии, примеры и технические задания</p>
                                </div>
                                <input id="attachment-files" type="file" class="hidden" multiple @change="handleFileSelect" />
                            </label>
                        </div>
                        
                        <!-- Список выбранных файлов -->
                        <div v-if="attachmentFiles.length > 0" class="mt-4">
                            <h4 class="text-sm font-medium text-gray-700 mb-2">Выбранные файлы:</h4>
                            <ul class="space-y-2">
                                <li v-for="(file, index) in attachmentFiles" :key="index" class="flex items-center justify-between p-2 bg-gray-50 rounded">
                                    <div class="flex items-center">
                                        <i class="fas fa-file mr-2 text-gray-400"></i>
                                        <span class="text-sm truncate" :title="file.name">{{ file.name }}</span>
                                    </div>
                                    <button type="button" @click="removeFile(index)" class="text-red-500 hover:text-red-700">
                                        <i class="fas fa-times"></i>
                                    </button>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
                
                <div class="mb-6">
                    <label class="block text-gray-700 mb-2 font-medium">Видимость тендера</label>
                    <div class="flex flex-col space-y-2">
                        <label class="inline-flex items-center">
                            <input 
                                v-model="newTender.visibility" 
                                type="radio" 
                                name="visibility" 
                                value="public"
                                class="form-radio text-pink-500">
                            <span class="ml-2">Публичный (виден всем профессионалам)</span>
                        </label>
                        <label class="inline-flex items-center">
                            <input 
                                v-model="newTender.visibility" 
                                type="radio" 
                                name="visibility" 
                                value="private"
                                class="form-radio text-pink-500">
                            <span class="ml-2">Приватный (только по приглашению)</span>
                        </label>
                    </div>
                </div>
                
                <!-- Общая ошибка -->
                <p v-if="createErrors?._error" class="text-red-500 text-sm mb-4 p-3 bg-red-50 rounded">{{ createErrors._error }}</p>
                
                <div class="flex justify-end space-x-4 pt-6 border-t border-gray-200">
                    <button type="button" @click="closeCreateModal" class="px-6 py-2 border rounded-lg hover:bg-gray-50">Отмена</button>
                    <button 
                        type="submit" 
                        :disabled="createSubmitting"
                        class="btn-primary text-white px-6 py-2 rounded-lg flex items-center justify-center">
                        <span v-if="createSubmitting" class="inline-block w-4 h-4 mr-2 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                        {{ createSubmitting ? 'Создание...' : 'Создать тендер' }}
                    </button>
                </div>
            </form>
        </div>
    </div>
</template>
   
<script setup>
import { ref, onMounted, reactive, computed } from 'vue';
import { useRouter } from 'vue-router';
import { formatDistanceToNow } from 'date-fns';
import { ru } from 'date-fns/locale';
import { useUserStore } from '../stores/user';
import { tendersService } from '../services/apiService';

const router = useRouter();
const userStore = useUserStore();

// Состояние списка тендеров
const tenders = ref([]);
const loading = ref(true);
const error = ref(null);

// Состояние фильтров и пагинации
const searchQuery = ref('');
const selectedCategory = ref('');
const selectedBudget = ref('');
const selectedDate = ref('');
const currentPage = ref(1);
const totalPages = ref(1);
const totalTenders = ref(0);

// Состояние формы создания тендера
const showCreateModal = ref(false);
const newTender = ref({
  title: '',
  description: '',
  category: '',
  budget_min: null,
  budget_max: null,
  event_date: '',
  visibility: 'public'
});
const attachmentFiles = ref([]);
const createSubmitting = ref(false);
const createErrors = ref(null);

// Дебоунс поиска для уменьшения количества запросов
let searchTimeout = null;
const debounceSearch = () => {
  if (searchTimeout) clearTimeout(searchTimeout);
  searchTimeout = setTimeout(() => {
    handleFilterChange();
  }, 500); // Задержка 500мс перед отправкой запроса
};

// Получение тендеров с учетом фильтров
const fetchTenders = async () => {
  loading.value = true;
  error.value = null;
  
  try {
    const params = {
      page: currentPage.value,
      search: searchQuery.value || undefined,
    };
    
    // Обработка категории - преобразуем числовые ID в строковые коды при необходимости
    if (selectedCategory.value) {
      // Если категория передана числом, преобразуем в строковой код для API
      if (!isNaN(parseInt(selectedCategory.value))) {
        const categoryMap = {
          '1': 'photography',
          '2': 'videographer',
          '3': 'venue',
          '4': 'catering',
          '5': 'music',
          '6': 'decor',
          '7': 'cake',
          '8': 'suit',
          '9': 'dress',
          '10': 'other'
        };
        params.category = categoryMap[selectedCategory.value] || selectedCategory.value;
      } else {
        params.category = selectedCategory.value;
      }
    }
    
    // Обработка фильтра по бюджету
    if (selectedBudget.value) {
      const [min, max] = selectedBudget.value.split('-');
      if (min) params.budget_min = min;
      if (max) params.budget_max = max;
    }
    
    // Обработка фильтра по дате
    if (selectedDate.value) {
      const now = new Date();
      
      if (selectedDate.value === '1m') {
        // Ближайший месяц
        const nextMonth = new Date(now);
        nextMonth.setMonth(now.getMonth() + 1);
        params.event_date_min = now.toISOString().split('T')[0];
        params.event_date_max = nextMonth.toISOString().split('T')[0];
      } else if (selectedDate.value === '3m') {
        // Следующие 3 месяца
        const next3Month = new Date(now);
        next3Month.setMonth(now.getMonth() + 3);
        params.event_date_min = now.toISOString().split('T')[0];
        params.event_date_max = next3Month.toISOString().split('T')[0];
      } else if (selectedDate.value === '2023') {
        // 2023 год
        params.event_date_min = '2023-01-01';
        params.event_date_max = '2023-12-31';
      } else if (selectedDate.value === '2024') {
        // 2024 год
        params.event_date_min = '2024-01-01';
        params.event_date_max = '2024-12-31';
      }
    }
    
    console.log('Fetching tenders with params:', params);
    
    // Используем правильный формат URL в зависимости от наличия параметров
    // без параметров: 'tenders/' (с завершающим слешем)
    // с параметрами: 'tenders' (без завершающего слеша)
    const response = await tendersService.getTenders(params);
    tenders.value = response.results || response;
    totalTenders.value = response.count || tenders.value.length;
    totalPages.value = Math.ceil(totalTenders.value / 10); // Предполагаем 10 тендеров на страницу
    
    console.log('Fetched tenders:', tenders.value);
  } catch (err) {
    console.error('Error fetching tenders:', err);
    error.value = 'Не удалось загрузить тендеры. Пожалуйста, попробуйте позже.';
    tenders.value = [];
  } finally {
    loading.value = false;
  }
};

// Обработка изменения фильтров
const handleFilterChange = () => {
  currentPage.value = 1; // Сброс на первую страницу при изменении фильтров
  fetchTenders();
};

// Переход на указанную страницу
const goToPage = (page) => {
  if (page < 1 || page > totalPages.value) return;
  currentPage.value = page;
  fetchTenders();
};

// Вычисляем диапазон страниц для пагинации
const startPage = computed(() => {
  if (totalPages.value <= 5) return 2;
  const start = Math.max(2, currentPage.value - 1);
  return Math.min(start, totalPages.value - 3);
});

const endPage = computed(() => {
  if (totalPages.value <= 5) return totalPages.value - 1;
  const end = Math.min(totalPages.value - 1, currentPage.value + 1);
  return Math.max(end, 4);
});

const middlePages = computed(() => {
  if (totalPages.value <= 2) return [];
  const pages = [];
  for (let i = startPage.value; i <= endPage.value; i++) {
    if (i > 1 && i < totalPages.value) {
      pages.push(i);
    }
  }
  return pages;
});

// Форматирование даты для отображения "3 дня назад" и т.п.
const formatDate = (dateString) => {
  try {
    if (!dateString) return '';
    const date = new Date(dateString);
    return formatDistanceToNow(date, { addSuffix: true, locale: ru });
  } catch (e) {
    return dateString || '';
  }
};

// Форматирование даты события (свадьбы)
const formatEventDate = (dateString) => {
  try {
    if (!dateString) return 'Не указана';
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('ru-RU', { day: '2-digit', month: '2-digit', year: 'numeric' }).format(date);
  } catch (e) {
    return dateString || 'Не указана';
  }
};

// Получение иконки для категории тендера
const getCategoryIcon = (category) => {
  const iconMap = {
    'photography': 'fas fa-camera mr-1',
    'venue': 'fas fa-home mr-1',
    'catering': 'fas fa-utensils mr-1',
    'music': 'fas fa-music mr-1',
    'decor': 'fas fa-paint-brush mr-1',
    'other': 'fas fa-ellipsis-h mr-1'
  };
  
  return iconMap[category] || 'fas fa-tag mr-1';
};

// Расчет ширины полосы прогресса в зависимости от количества предложений
const getProgressWidth = (offerCount) => {
  if (!offerCount) return '0%';
  const count = parseInt(offerCount);
  // Максимальная ширина при 15+ предложениях
  if (count >= 15) return '100%';
  return `${Math.min(count * 6.5, 100)}%`;
};

// Открытие модального окна создания тендера
const openCreateModal = () => {
  if (!userStore.isCouple) {
    alert('Только пары могут создавать тендеры');
    return;
  }
  
  // Сброс формы
  newTender.value = {
    title: '',
    description: '',
    category: '',
    budget_min: null,
    budget_max: null,
    event_date: '',
    visibility: 'public',
  };
  
  attachmentFiles.value = [];
  createErrors.value = null;
  showCreateModal.value = true;
};

// Закрытие модального окна
const closeCreateModal = () => {
  showCreateModal.value = false;
};

// Выбор категории тендера
const selectCategory = (category) => {
  newTender.value.category = category;
};

// Получение названия категории
const getCategoryName = (category) => {
  // Соответствие строковых кодов категорий их отображаемым названиям
  const categoryNames = {
    'photography': 'Фотограф',
    'videographer': 'Видеограф',
    'venue': 'Площадка',
    'catering': 'Кейтеринг',
    'music': 'Музыка',
    'musician': 'Музыкант',
    'decor': 'Декор',
    'cake': 'Торт',
    'suit': 'Костюм',
    'dress': 'Платье',
    'other': 'Другое'
  };
  
  // Проверяем, если передано числовое значение (ID категории в UI)
  if (!isNaN(parseInt(category))) {
    const idToCode = {
      '1': 'photography',
      '2': 'videographer',
      '3': 'venue',
      '4': 'catering',
      '5': 'music',
      '6': 'decor',
      '7': 'cake',
      '8': 'suit',
      '9': 'dress',
      '10': 'other'
    };
    const code = idToCode[category];
    return categoryNames[code] || code || category;
  }
  
  return categoryNames[category] || category;
};

// Обработка выбора файлов
const handleFileSelect = (event) => {
  const files = event.target.files;
  if (!files) return;
  
  // Добавляем новые файлы в массив
  const newFiles = Array.from(files);
  attachmentFiles.value = [...attachmentFiles.value, ...newFiles];
};

// Удаление выбранного файла
const removeFile = (index) => {
  attachmentFiles.value.splice(index, 1);
};

// Создание нового тендера
const createTender = async () => {
  createSubmitting.value = true;
  createErrors.value = null;
  
  try {
    // Проверяем, загружены ли данные пользователя и является ли он парой
    if (!userStore.token) {
      createErrors.value = { _error: 'Вы должны войти в систему для создания тендера' };
      createSubmitting.value = false;
      return;
    }
    
    // Если данные пользователя не загружены, загружаем их
    if (!userStore.currentUser) {
      console.log('Загрузка данных пользователя перед созданием тендера');
      await userStore.fetchCurrentUser();
    }
    
    // Проверяем роль пользователя
    console.log('Данные пользователя перед созданием тендера:', userStore.currentUser);
    console.log('Роль пользователя:', userStore.userRole);
    
    if (!userStore.isCouple) {
      createErrors.value = { _error: 'Только пары могут создавать тендеры' };
      createSubmitting.value = false;
      return;
    }
    
    // Валидация формы
    const errors = {};
    
    if (!newTender.value.title) errors.title = 'Название обязательно';
    if (!newTender.value.description) errors.description = 'Описание обязательно';
    if (!newTender.value.category) errors.category = 'Выберите категорию';
    
    if (Object.keys(errors).length > 0) {
      createErrors.value = errors;
      createSubmitting.value = false;
      return;
    }
    
    // Используем FormData для отправки тендера и вложений в одном запросе
    const formData = new FormData();
    
    // Добавляем все поля формы
    Object.keys(newTender.value).forEach(key => {
      if (newTender.value[key] !== null && newTender.value[key] !== undefined && newTender.value[key] !== '') {
        // Если это категория, применяем преобразование в правильный код для бэкенда
        if (key === 'category') {
          // Используем точные коды из SPECIALIST_CATEGORIES бэкенда
          const categoryMap = {
            // Преобразование числовых ID в строковые коды
            '1': 'photographer',
            '2': 'videographer',
            '3': 'venue',
            '4': 'caterer',
            '5': 'band',
            '6': 'decorator',
            '7': 'cake',
            '8': 'clothing',
            '9': 'clothing',
            '10': 'other',
            // Преобразование строковых кодов, не соответствующих SPECIALIST_CATEGORIES
            'music': 'band',         // музыка -> музыкальная группа
            'musician': 'band',      // музыкант -> музыкальная группа
            'suit': 'clothing',      // костюм -> свадебные наряды
            'dj': 'dj'               // DJ уже должен быть в SPECIALIST_CATEGORIES
          };
          
          // Получаем значение категории
          const categoryValue = newTender.value.category;
          
          // Если есть соответствие в карте, используем его, иначе оставляем как есть
          const mappedCategory = categoryMap[categoryValue] || categoryValue;
          console.log(`Преобразование категории: ${categoryValue} -> ${mappedCategory}`);
          
          formData.append(key, mappedCategory);
        } else {
          formData.append(key, newTender.value[key]);
        }
      }
    });
    
    // Добавляем все файлы
    if (attachmentFiles.value.length > 0) {
      // Используем правильный формат отправки файлов - напрямую с ключом 'attachments'
      attachmentFiles.value.forEach((file, index) => {
        formData.append('attachments', file);
      });
    }
    
    console.log('Creating tender with data:', Object.fromEntries(formData.entries()));
    
    // Отправляем все в одном запросе (и данные тендера, и файлы) через multipart/form-data
    const response = await tendersService.createTenderWithAttachments(formData);
    
    // Закрываем модальное окно и обновляем список тендеров
    closeCreateModal();
    fetchTenders();
    
    // Переход на страницу созданного тендера
    if (response?.id) {
      router.push(`/tenders/${response.id}`);
    }
  } catch (err) {
    console.error('Error creating tender:', err);
    
    // Обрабатываем ошибки валидации с сервера
    if (err.response?.data) {
      createErrors.value = err.response.data;
    } else {
      createErrors.value = {
        _error: 'Произошла ошибка при создании тендера. Пожалуйста, попробуйте еще раз.'
      };
    }
  } finally {
    createSubmitting.value = false;
  }
};

// Открытие деталей тендера
const viewTenderDetails = (tenderId) => {
  router.push(`/tenders/${tenderId}`);
};

// Инициализация модальных окон и обработчиков событий
const initializeUI = () => {
  // Обработчик кнопки создания тендера
  document.getElementById('create-tender-btn')?.addEventListener('click', openCreateModal);
  
  // Обработчики закрытия модального окна
  document.getElementById('close-tender-modal')?.addEventListener('click', closeCreateModal);
  document.getElementById('cancel-tender-btn')?.addEventListener('click', closeCreateModal);
};

// Инициализация при загрузке компонента
onMounted(async () => {
  // Загружаем данные о пользователе
  if (userStore.token && !userStore.currentUser) {
    console.log('Загрузка данных пользователя для страницы тендеров');
    await userStore.fetchCurrentUser();
  }
  
  // Загружаем список тендеров
  fetchTenders();
  initializeUI();
});
</script>
   
<style scoped>
  h1, h2, h3, h4 {
            font-family: 'Montserrat', sans-serif;
        }
        .hero-gradient {
            background: linear-gradient(135deg, #FFD1DC 0%, #4A90E2 100%);
        }
        .btn-primary {
            background-color: #FF6B8B;
            transition: all 0.3s ease;
        }
        .btn-primary:hover {
            background-color: #FF4D6D;
            transform: translateY(-2px);
        }
        .nav-link {
            position: relative;
        }
        .nav-link:after {
            content: '';
            position: absolute;
            width: 0;
            height: 2px;
            bottom: 0;
            left: 0;
            background-color: #FF6B8B;
            transition: width 0.3s ease;
        }
        .nav-link:hover:after {
            width: 100%;
        }
        .card-hover:hover {
            transform: translateY(-5px);
            box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
        }
        .fade-in {
            animation: fadeIn 0.5s ease-in;
        }
        @keyframes fadeIn {
            from { opacity: 0; }
            to { opacity: 1; }
        }
        .tender-tag {
            display: inline-flex;
            align-items: center;
            padding: 0.25rem 0.75rem;
            border-radius: 9999px;
            font-size: 0.75rem;
            font-weight: 500;
        }
        .tender-tag.photography {
            background-color: #DBEAFE;
            color: #1E40AF;
        }
        .tender-tag.venue {
            background-color: #D1FAE5;
            color: #065F46;
        }
        .tender-tag.catering {
            background-color: #FCE7F3;
            color: #9D174D;
        }
        .tender-tag.music {
            background-color: #EDE9FE;
            color: #5B21B6;
        }
        .tender-tag.decor {
            background-color: #E0F2FE;
            color: #0369A1;
        }
        .progress-bar {
            height: 6px;
            border-radius: 3px;
            background-color: #E5E7EB;
            overflow: hidden;
        }
        .progress-fill {
            height: 100%;
            background-color: #10B981;
            transition: width 0.3s ease;
        }
</style>
   