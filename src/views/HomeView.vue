<script setup>
import { ref, onMounted, computed } from 'vue';
import { storeToRefs } from 'pinia';
import { RouterLink } from 'vue-router';

// Импортируем хранилища
import { useCatalogStore } from '@/stores/catalog';
import { useWeddingsStore } from '@/stores/weddings';
import { useAuthStore } from '@/stores/auth';
import { contentService } from '@/services/apiService';

// Создаем экземпляры хранилищ
const catalogStore = useCatalogStore();
const weddingsStore = useWeddingsStore();
const authStore = useAuthStore();

// Получаем свойства из хранилищ с реактивностью
const { specialists: featuredSpecialists, isLoading: isLoadingSpecialists } = storeToRefs(catalogStore);
const { featuredWeddings: realWeddings, isLoading: isLoadingWeddings } = storeToRefs(weddingsStore);
const { isLoggedIn } = storeToRefs(authStore);

// Локальные состояния
const articles = ref([]);
const isLoadingArticles = ref(false);
const isLoadingData = computed(() => {
  return isLoadingSpecialists.value || isLoadingWeddings.value || isLoadingArticles.value;
});

// Словари для отображения человекочитаемых названий

// Стили свадеб
const weddingStyles = {
  'classic': 'Классический',
  'rustic': 'Рустик',
  'boho': 'Бохо',
  'vintage': 'Винтаж',
  'modern': 'Современный',
  'beach': 'Пляжный',
  'garden': 'Садовый',
  'glamour': 'Гламурный',
  'eco': 'Эко-свадьба',
  'minimalist': 'Минимализм',
  'fairytale': 'Сказочный',
  'ethnic': 'Этнический',
  'other': 'Другое'
};

// Категории специалистов
const specialistCategories = {
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
  'other': 'Другое'
};

// Для управления модальным окном используем хранилище аутентификации
// Все методы для работы с модальным окном содержатся в хранилище

// Закрытие модального окна при клике вне его области
const handleModalBackdropClick = (event) => {
  if (event.target.id === 'login-modal') {
    authStore.closeLoginModal();
  }
};

// Загрузка статей
const fetchArticles = async () => {
  isLoadingArticles.value = true;
  try {
    // Запрос к API для получения статей
    const response = await contentService.getArticles({ page_size: 3 });
    
    // Обработка результата в зависимости от формата ответа API
    if (response.results) {
      articles.value = response.results;
    } else {
      articles.value = response;
    }
    
    // Если API недоступен, используем тестовые данные
    if (articles.value.length === 0) {
      articles.value = [
        {
          id: 1,
          title: '10 идей для свадебного декора',
          category: 'Декор',
          image: 'https://images.unsplash.com/photo-1519225421980-715cb0215aed?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=870&q=80',
          date: '10 мая 2023',
        },
        {
          id: 2,
          title: 'Как выбрать свадебное платье',
          category: 'Мода',
          image: 'https://images.unsplash.com/photo-1594552072238-b8a33785b261?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=387&q=80',
          date: '15 мая 2023',
        },
        {
          id: 3,
          title: 'Свадебный бюджет: как спланировать',
          category: 'Планирование',
          image: 'https://images.unsplash.com/photo-1593206668403-9a08a5475c85?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=871&q=80',
          date: '20 мая 2023',
        },
      ];
    }
  } catch (error) {
    console.error('Ошибка при загрузке статей:', error);
    // Используем заглушки при ошибке
    articles.value = [
      {
        id: 1,
        title: '10 идей для свадебного декора',
        category: 'Декор',
        image: 'https://images.unsplash.com/photo-1519225421980-715cb0215aed?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=870&q=80',
        date: '10 мая 2023',
      },
      {
        id: 2,
        title: 'Как выбрать свадебное платье',
        category: 'Мода',
        image: 'https://images.unsplash.com/photo-1594552072238-b8a33785b261?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=387&q=80',
        date: '15 мая 2023',
      },
      {
        id: 3,
        title: 'Свадебный бюджет: как спланировать',
        category: 'Планирование',
        image: 'https://images.unsplash.com/photo-1593206668403-9a08a5475c85?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=871&q=80',
        date: '20 мая 2023',
      },
    ];
  } finally {
    isLoadingArticles.value = false;
  }
};

// Вспомогательные методы для работы с данными о свадьбах
const getDefaultWeddingImage = (index) => {
  const defaultImages = [
    'https://images.unsplash.com/photo-1519671482749-fd09be7ccebf?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80',
    'https://images.unsplash.com/photo-1523438885200-e635ba2c371e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1374&q=80',
    'https://images.unsplash.com/photo-1529634310410-0c3f3a6eab1f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1471&q=80'
  ];
  return defaultImages[index % defaultImages.length];
};

const getWeddingCouple = (index) => {
  const couples = [
    'Анна и Максим',
    'Екатерина и Дмитрий',
    'Ольга и Иван'
  ];
  return couples[index % couples.length];
};

const getGuestsCount = (index) => {
  const counts = [120, 80, 60];
  return counts[index % counts.length];
};

const getWeddingTags = (index) => {
  const tagSets = [
    ['Природа', 'Романтика'],
    ['Лофт', 'Современный'],
    ['Зима', 'Сказка']
  ];
  return tagSets[index % tagSets.length];
};

// Загрузка всех данных для главной страницы
const loadHomePageData = async () => {
  // Запускаем все запросы параллельно для ускорения загрузки
  await Promise.all([
    // Загрузка рекомендуемых специалистов
    catalogStore.fetchFeaturedSpecialists(),
    // Загрузка реальных свадеб
    weddingsStore.fetchFeaturedWeddings(),
    // Загрузка статей
    fetchArticles()
  ]);
};

onMounted(() => {
  loadHomePageData();
});
</script>

<style scoped>
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
.card-hover {
  transition: all 0.3s ease;
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
</style>

<template>
  <main>
    <!-- Hero Section -->
    <section class="hero-gradient text-white py-16 md:py-24">
      <div class="container mx-auto px-4">
        <div class="flex flex-col md:flex-row items-center">
          <div class="md:w-1/2 mb-10 md:mb-0 fade-in">
            <h1 class="text-4xl md:text-5xl font-bold mb-6">Создайте свадьбу своей мечты</h1>
            <p class="text-xl mb-8 opacity-90">Планируйте свадьбу легко с нашим инструментом и находите лучших профессионалов в одном месте</p>
            <div class="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-4">
              <RouterLink to="/planner" class="btn-primary text-white px-8 py-3 rounded-full text-center font-medium">Начать планирование</RouterLink>
              <RouterLink to="/catalog" class="bg-white text-pink-600 px-8 py-3 rounded-full text-center font-medium hover:bg-gray-100">Найти профессионалов</RouterLink>
              <!-- <button @click="authStore.openLoginModal" class="border-2 border-white text-white px-8 py-3 rounded-full text-center font-medium hover:bg-white/10">Войти</button> -->
            </div>
          </div>
          <div class="md:w-1/2 flex justify-center fade-in">
            <div class="relative">
              <img src="https://images.unsplash.com/photo-1519225421980-715cb0215aed?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80" alt="Счастливая пара" class="rounded-lg shadow-xl w-full max-w-md">
              <div class="absolute -bottom-6 -right-6 bg-white p-4 rounded-lg shadow-lg hidden md:block">
                <div class="flex items-center">
                  <div class="bg-pink-100 p-3 rounded-full mr-3">
                    <i class="fas fa-check text-pink-500"></i>
                  </div>
                  <div>
                    <p class="font-bold text-gray-800">500+ свадеб</p>
                    <p class="text-sm text-gray-600">успешно спланировано</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- How It Works -->
    <section class="py-16 bg-white">
      <div class="container mx-auto px-4">
        <h2 class="text-3xl font-bold text-center mb-12">Как это работает</h2>
        
        <div class="grid md:grid-cols-3 gap-8">
          <div class="bg-gray-50 p-6 rounded-xl text-center card-hover transition">
            <div class="bg-pink-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <i class="fas fa-calendar-alt text-pink-500 text-2xl"></i>
            </div>
            <h3 class="text-xl font-bold mb-3">1. Создайте свадьбу</h3>
            <p class="text-gray-600">Укажите дату, бюджет и предпочтения для вашей свадьбы в нашем планировщике.</p>
          </div>
          
          <div class="bg-gray-50 p-6 rounded-xl text-center card-hover transition">
            <div class="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <i class="fas fa-search text-blue-500 text-2xl"></i>
            </div>
            <h3 class="text-xl font-bold mb-3">2. Найдите профессионалов</h3>
            <p class="text-gray-600">Изучите каталог или создайте тендер, чтобы получить предложения от проверенных специалистов.</p>
          </div>
          
          <div class="bg-gray-50 p-6 rounded-xl text-center card-hover transition">
            <div class="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <i class="fas fa-heart text-green-500 text-2xl"></i>
            </div>
            <h3 class="text-xl font-bold mb-3">3. Наслаждайтесь днём</h3>
            <p class="text-gray-600">Отслеживайте все детали в одном месте и наслаждайтесь идеальным днём без стресса.</p>
          </div>
        </div>
      </div>
    </section>

    <!-- Professionals Section -->
    <section class="py-16 bg-gray-50">
      <div class="container mx-auto px-4">
        <div class="flex justify-between items-center mb-8">
          <h2 class="text-3xl font-bold">Проверенные профессионалы</h2>
          <RouterLink to="/catalog" class="text-pink-500 hover:text-pink-600 font-medium flex items-center">
            Смотреть всех <i class="fas fa-arrow-right ml-2"></i>
          </RouterLink>
        </div>
        
        <div class="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <!-- Professionals -->
          <div v-for="specialist in featuredSpecialists.slice(0, 4)" :key="specialist.id" class="bg-white rounded-xl overflow-hidden shadow-sm card-hover transition">
            <div class="relative">
              <img :src="specialist.image || 'https://via.placeholder.com/300x200?text=Фото+специалиста'" :alt="specialist.category" class="w-full h-48 object-cover">
              <div class="absolute top-3 right-3 bg-white/80 backdrop-blur-sm px-2 py-1 rounded-full text-sm font-medium flex items-center">
                <i class="fas fa-star text-yellow-400 mr-1"></i> {{ specialist.rating || '5.0' }}
              </div>
            </div>
            <div class="p-4">
              <h3 class="font-bold text-lg">{{ specialist.full_name }}</h3>
              <p class="text-gray-600 mb-2">{{ specialistCategories[specialist.category] || specialist.category }}</p>
              <p class="text-sm text-gray-500 mb-3">{{ specialist.description.slice(0, 95) || 'Снимаю свадьбы в романтическом и репортажном стиле. Более 150 свадеб в портфолио.' }}...</p>
              
              <div class="flex justify-between items-center">
                <span class="font-medium">от {{ specialist.price_range_min || '10 000' }} ₽</span>
                <button class="text-pink-500 hover:text-pink-600">
                  <i class="far fa-heart text-xl"></i>
                </button>
              </div>
              <RouterLink :to="`/catalog/specialist/${specialist.id}`" class="text-pink-500 font-medium hover:text-pink-600 flex items-center mt-2">
                Смотреть профиль <i class="fas fa-chevron-right ml-1 text-xs"></i>
              </RouterLink>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Real Weddings -->
    <!-- <section class="py-16 bg-white">
      <div class="container mx-auto px-4">
        <div class="flex justify-between items-center mb-8">
          <h2 class="text-3xl font-bold">Реальные свадьбы</h2>
          <RouterLink to="/real-weddings" class="text-pink-500 hover:text-pink-600 font-medium flex items-center">
            Смотреть все <i class="fas fa-arrow-right ml-2"></i>
          </RouterLink>
        </div>
        
        <div class="grid md:grid-cols-3 gap-6">
          
          <div v-for="wedding in realWeddings.slice(0, 3)" :key="wedding.id" class="relative rounded-xl overflow-hidden h-80 card-hover transition group">
            <img :src="wedding.main_image || 'https://via.placeholder.com/800x600?text=Свадьба'" :alt="wedding.title" class="w-full h-full object-cover">
            <div class="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex flex-col justify-end p-6">
              <h3 class="text-white text-xl font-bold mb-1 group-hover:text-pink-300 transition">{{ wedding.title }}</h3>
              <p class="text-gray-200 mb-3">{{ wedding.couple_names || 'Молодожены' }} • {{ wedding.guest_count || '100' }} гостей</p>
              <div class="flex flex-wrap gap-2">
                <span v-if="wedding.wedding_style" class="bg-white/20 text-white text-xs px-3 py-1 rounded-full">{{ weddingStyles[wedding.wedding_style] || wedding.wedding_style }}</span>
                <span v-if="wedding.city" class="bg-white/20 text-white text-xs px-3 py-1 rounded-full">{{ wedding.city }}</span>
                <span v-if="wedding.budget_range" class="bg-white/20 text-white text-xs px-3 py-1 rounded-full">{{ wedding.budget_range }}</span>
              </div>
            </div>
            <RouterLink :to="`/real-weddings/${wedding.id}`" class="absolute inset-0"></RouterLink>
          </div>
          
          
          <template v-if="realWeddings.length === 0">
           
            <div class="relative rounded-xl overflow-hidden h-80 card-hover transition group">
              <img src="https://images.unsplash.com/photo-1519671482749-fd09be7ccebf?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80" alt="Свадьба на природе" class="w-full h-full object-cover">
              <div class="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex flex-col justify-end p-6">
                <h3 class="text-white text-xl font-bold mb-1 group-hover:text-pink-300 transition">Летняя свадьба у озера</h3>
                <p class="text-gray-200 mb-3">Анна и Максим • 120 гостей</p>
                <div class="flex flex-wrap gap-2">
                  <span class="bg-white/20 text-white text-xs px-3 py-1 rounded-full">Природа</span>
                  <span class="bg-white/20 text-white text-xs px-3 py-1 rounded-full">Романтика</span>
                </div>
              </div>
              <RouterLink to="/real-weddings" class="absolute inset-0"></RouterLink>
            </div>
            
            
            <div class="relative rounded-xl overflow-hidden h-80 card-hover transition group">
              <img src="https://images.unsplash.com/photo-1523438885200-e635ba2c371e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1374&q=80" alt="Городская свадьба" class="w-full h-full object-cover">
              <div class="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex flex-col justify-end p-6">
                <h3 class="text-white text-xl font-bold mb-1 group-hover:text-pink-300 transition">Городской лофт в индустриальном стиле</h3>
                <p class="text-gray-200 mb-3">Екатерина и Дмитрий • 80 гостей</p>
                <div class="flex flex-wrap gap-2">
                  <span class="bg-white/20 text-white text-xs px-3 py-1 rounded-full">Лофт</span>
                  <span class="bg-white/20 text-white text-xs px-3 py-1 rounded-full">Современный</span>
                </div>
              </div>
              <RouterLink to="/real-weddings" class="absolute inset-0"></RouterLink>
            </div>
            
            
            <div class="relative rounded-xl overflow-hidden h-80 card-hover transition group">
              <img src="https://images.unsplash.com/photo-1529634310410-0c3f3a6eab1f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1471&q=80" alt="Зимняя свадьба" class="w-full h-full object-cover">
              <div class="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex flex-col justify-end p-6">
                <h3 class="text-white text-xl font-bold mb-1 group-hover:text-pink-300 transition">Сказочная зимняя свадьба</h3>
                <p class="text-gray-200 mb-3">Ольга и Иван • 60 гостей</p>
                <div class="flex flex-wrap gap-2">
                  <span class="bg-white/20 text-white text-xs px-3 py-1 rounded-full">Зима</span>
                  <span class="bg-white/20 text-white text-xs px-3 py-1 rounded-full">Сказка</span>
                </div>
              </div>
              <RouterLink to="/real-weddings" class="absolute inset-0"></RouterLink>
            </div>
          </template>
        </div>
      </div>
    </section> -->

    <!-- Testimonials -->
    <section class="py-16 bg-pink-50">
      <div class="container mx-auto px-4">
        <h2 class="text-3xl font-bold text-center mb-12">Отзывы пар</h2>
        
        <div class="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          <!-- Testimonial 1 -->
          <div class="bg-white p-6 rounded-xl shadow-sm">
            <div class="flex items-center mb-4">
              <img src="https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=870&q=80" alt="Анна и Павел" class="w-12 h-12 rounded-full object-cover mr-4">
              <div>
                <h4 class="font-bold">Анна и Павел</h4>
                <div class="text-yellow-400 flex text-sm">
                  <i class="fas fa-star"></i>
                  <i class="fas fa-star"></i>
                  <i class="fas fa-star"></i>
                  <i class="fas fa-star"></i>
                  <i class="fas fa-star"></i>
                </div>
              </div>
            </div>
            <p class="text-gray-600 italic">"Благодаря сервису мы нашли идеальных специалистов для нашей свадьбы. Планировщик помог организовать все детали, и мы наслаждались каждым моментом подготовки. Всем рекомендую!"</p>
          </div>
          
          <!-- Testimonial 2 -->
          <div class="bg-white p-6 rounded-xl shadow-sm">
            <div class="flex items-center mb-4">
              <img src="https://images.unsplash.com/photo-1491349174775-aaafddd81942?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=387&q=80" alt="Мария и Дмитрий" class="w-12 h-12 rounded-full object-cover mr-4">
              <div>
                <h4 class="font-bold">Мария и Дмитрий</h4>
                <div class="text-yellow-400 flex text-sm">
                  <i class="fas fa-star"></i>
                  <i class="fas fa-star"></i>
                  <i class="fas fa-star"></i>
                  <i class="fas fa-star"></i>
                  <i class="fas fa-star"></i>
                </div>
              </div>
            </div>
            <p class="text-gray-600 italic">"Удобный сервис для планирования свадьбы! Мы смогли легко управлять нашим бюджетом, списком гостей и задачами. Подобрали отличного фотографа и ведущего. Наша свадьба была именно такой, как мы мечтали!"</p>
          </div>
        </div>
      </div>
    </section>

    <!-- CTA Section -->
    <section class="py-16 bg-blue-600 text-white">
            <div class="container mx-auto px-4 text-center">
                <h2 class="text-3xl font-bold mb-6">Готовы начать планирование?</h2>
                <p class="text-xl mb-8 max-w-2xl mx-auto">Зарегистрируйтесь сейчас и получите доступ ко всем инструментам для организации идеальной свадьбы</p>
                <div class="flex flex-col sm:flex-row justify-center space-y-3 sm:space-y-0 sm:space-x-4">
                    <a href="#" class="bg-white text-blue-600 px-8 py-3 rounded-full font-medium hover:bg-gray-100">Зарегистрироваться</a>
                    <a href="#" class="border-2 border-white px-8 py-3 rounded-full font-medium hover:bg-white/10">Узнать больше</a>
                </div>
            </div>
        </section>

    <!-- Blog Section -->
    <!-- <section class="py-16 bg-white">
      <div class="container mx-auto px-4">
        <div class="flex justify-between items-center mb-8">
          <h2 class="text-3xl font-bold">Советы и вдохновение</h2>
          <RouterLink to="/articles" class="text-pink-500 hover:text-pink-600 font-medium flex items-center">
            Все статьи <i class="fas fa-arrow-right ml-2"></i>
          </RouterLink>
        </div>
        
        <div class="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
          
          <div v-for="article in articles.slice(0, 3)" :key="article.id" class="bg-white border border-gray-100 rounded-xl overflow-hidden shadow-sm card-hover transition">
            <img :src="article.image" :alt="article.title" class="w-full h-48 object-cover">
            <div class="p-6">
              <div class="text-sm text-pink-500 font-medium mb-2">{{ article.category_name }}</div>
              <h3 class="text-xl font-bold mb-3">{{ article.title }}</h3>
              <p class="text-gray-600 mb-4"> {{ article.excerpt }} </p>
              <div class="text-gray-500 text-sm mb-4">{{ article.date }}</div>
              <RouterLink :to="`/articles/${article.id}`" class="text-pink-500 font-medium hover:text-pink-600 flex items-center">
                Читать статью <i class="fas fa-chevron-right ml-1 text-xs"></i>
              </RouterLink>
            </div>
          </div>
        </div>
      </div>
    </section> -->
  </main>

  <!-- Login Modal -->
  <div v-if="authStore.showLoginModal" id="login-modal" 
       class="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
       @click="handleModalBackdropClick">
    <div class="bg-white rounded-xl max-w-md w-full p-8 relative">
      <button @click="authStore.closeLoginModal" class="absolute top-4 right-4 text-gray-500 hover:text-gray-700">
        <i class="fas fa-times text-xl"></i>
      </button>
      
      <h3 class="text-2xl font-bold mb-6 text-center">Вход в аккаунт</h3>
      
      <div class="flex justify-center space-x-4 mb-6">
        <button class="bg-blue-600 text-white px-4 py-2 rounded flex items-center">
          <i class="fab fa-vk mr-2"></i> ВКонтакте
        </button>
        <button class="bg-red-500 text-white px-4 py-2 rounded flex items-center">
          <i class="fab fa-google mr-2"></i> Google
        </button>
      </div>
      
      <div class="relative mb-6">
        <div class="absolute inset-0 flex items-center">
          <div class="w-full border-t border-gray-300"></div>
        </div>
        <div class="relative flex justify-center">
          <span class="bg-white px-2 text-gray-500">или</span>
        </div>
      </div>
      
      <form @submit.prevent="authStore.login()">
        <div class="mb-4">
          <label for="username" class="block text-gray-700 mb-2">Имя пользователя</label>
          <input v-model="authStore.username" type="text" id="username" class="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent" placeholder="Например: user">
          <!-- <div class="mt-1 text-xs text-gray-500">Для тестирования используйте имя пользователя, которое есть в базе данных</div> -->
        </div>
        
        <div class="mb-6">
          <label for="password" class="block text-gray-700 mb-2">Пароль</label>
          <input v-model="authStore.password" type="password" id="password" class="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent" placeholder="Ваш пароль">
          <a href="#" class="text-sm text-pink-500 hover:text-pink-600 mt-1 block">Забыли пароль?</a>
        </div>
        
        <div v-if="authStore.error" class="mb-4 p-3 bg-red-100 text-red-600 rounded-lg text-sm">
          {{ authStore.error }}
        </div>
        
        <button type="submit" class="w-full bg-pink-500 text-white py-3 rounded-lg font-medium hover:bg-pink-600 mb-4" :disabled="authStore.isLoading">
          <span v-if="authStore.isLoading">Загрузка...</span>
          <span v-else>Войти</span>
        </button>
        
        <p class="text-center text-gray-600">
          Ещё нет аккаунта? <RouterLink to="/register" class="text-pink-500 hover:text-pink-600 font-medium">Зарегистрироваться</RouterLink>
        </p>
      </form>
    </div>
  </div>
</template>
