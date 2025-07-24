<template>
  <div v-if="loading" class="text-center py-20">
    <div class="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-600 mx-auto mb-4"></div>
    <p class="text-lg text-gray-600">Загрузка данных специалиста...</p>
  </div>
  <div v-else-if="error" class="text-center py-20">
    <div class="bg-red-50 border border-red-200 text-red-700 p-4 rounded-lg max-w-lg mx-auto">
      <p class="font-medium">Ошибка при загрузке профиля</p>
      <p class="text-sm">{{ error }}</p>
    </div>
  </div>
  <div v-else class="text-gray-800">
    <!-- Hero Section -->
    <section class="hero-gradient py-12 text-white">
      <div class="container mx-auto px-4">
        <div class="flex flex-col md:flex-row items-center gap-8">
          <!-- Professional Avatar -->
          <div class="relative">
            <img 
              :src="specialist && specialist.avatar ? specialist.avatar : '/src/assets/img/default-avatar.png'"
              alt="Аватар специалиста" 
              class="w-32 h-32 md:w-40 md:h-40 rounded-full object-cover border-4 border-white pro-avatar"
            >
            <div class="absolute bottom-0 right-0 bg-green-500 text-white text-xs font-medium px-2 py-1 rounded-full">
              Онлайн
            </div>
          </div>
          
          <!-- Professional Info -->
          <div class="text-center md:text-left" v-if="specialist">
            <h1 class="text-3xl md:text-4xl font-bold mb-2">{{ specialist.full_name }}</h1>
            <p class="text-xl mb-3">{{ getCategoryName(specialist.category) }}</p>
            
            <div class="flex flex-wrap items-center justify-center md:justify-start gap-4 mb-4">
              <div class="flex items-center">
                <div class="rating-stars flex mr-1">
                  <i class="fas fa-star"></i>
                  <i class="fas fa-star"></i>
                  <i class="fas fa-star"></i>
                  <i class="fas fa-star"></i>
                  <i class="fas fa-star-half-alt"></i>
                </div>
                <span>
                  <template v-if="specialist.rating > 0">
                    {{ specialist.rating }} ({{ specialist.reviews_count || 0 }} отзывов)
                  </template>
                  <template v-else>Нет отзывов</template>
                </span>
              </div>
              <div class="flex items-center">
                <i class="fas fa-map-marker-alt mr-1"></i>
                <span>{{ specialist.city }}</span>
              </div>
              <div class="flex items-center">
                <i class="far fa-clock mr-1"></i>
                <span>{{ specialist.experience }} опыта</span>
              </div>
            </div>
            
            <!-- Кнопки взаимодействия -->
            <div class="flex flex-wrap justify-center md:justify-start gap-3">
              <!-- <RouterLink :to="`/messages/specialist/${specialist.id}`" >
                
              </RouterLink> -->
              
              <button @click="vRazrabotke"  class="bg-indigo-600 text-white px-6 py-2 rounded-full hover:bg-indigo-700 transition flex items-center">
                <i class="far fa-envelope mr-2"></i> Написать сообщение
              </button>
              <button 
                @click="addToFavorites" 
                class="bg-white text-indigo-600 px-6 py-2 rounded-full hover:bg-gray-100 transition flex items-center"
              >
                <i class="far fa-heart mr-2"></i> В избранное
              </button>
              <button 
                @click="openOrderModal" 
                class="bg-pink-500 text-white px-6 py-2 rounded-full hover:bg-pink-600 transition flex items-center"
              >
                <i class="fas fa-calendar-check mr-2"></i> Заказать услугу
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Main Content -->
    <section class="py-12 bg-white">
      <div class="container mx-auto px-4">
        <div class="flex flex-col lg:flex-row gap-8">
          <!-- Left Column -->
          <div class="lg:w-2/3">
            <!-- About Me -->
            <div class="bg-gray-50 rounded-xl p-6 mb-8">
              <h2 class="text-xl font-bold mb-4">Обо мне</h2>
              <div v-html="specialist.description"></div>
              
              <!-- Specializations -->
              <div v-if="specialist.specializations && specialist.specializations.length > 0" class="mt-4">
                <h3 class="font-medium mb-2">Специализация:</h3>
                <div class="flex flex-wrap gap-2">
                  <span 
                    v-for="(specialization, index) in specialist.specializations" 
                    :key="index"
                    class="bg-indigo-100 text-indigo-800 text-sm px-3 py-1 rounded-full"
                  >
                    {{ specialization }}
                  </span>
                </div>
              </div>
            </div>

            <!-- Services Card -->
            <div class="bg-gray-50 rounded-xl p-6 mb-8">
              <div class="flex justify-between items-center mb-4">
                <h2 class="text-xl font-bold">Услуги и цены</h2>
                <button 
                  @click="toggleCurrency" 
                  class="bg-indigo-50 hover:bg-indigo-100 text-indigo-600 font-medium px-3 py-1 rounded-lg transition flex items-center text-sm"
                >
                  {{ currency === 'RUB' ? 'Рубли ₽' : 'Сомы' }} 
                  <i class="fas fa-exchange-alt ml-2"></i>
                </button>
              </div>
              
              <!-- Загрузка -->
              <div v-if="servicesLoading" class="text-center py-4">
                <div class="animate-spin h-8 w-8 border-t-2 border-b-2 border-indigo-600 rounded-full mx-auto"></div>
                <p class="text-gray-600 mt-2">Загрузка услуг...</p>
              </div>
              
              <!-- Нет услуг -->
              <div v-else-if="!services || services.length === 0" class="text-center py-8">
                <i class="fas fa-list-alt text-4xl text-gray-400 mb-3"></i>
                <p class="text-gray-600">Услуги и цены еще не добавлены</p>
              </div>
              
              <!-- Ошибка при загрузке услуг -->
              <div v-else-if="servicesError" class="bg-red-50 border border-red-200 text-red-700 p-4 rounded-lg mb-4">
                <p class="font-medium">Ошибка при загрузке услуг</p>
                <p class="text-sm">{{ servicesError }}</p>
              </div>
              
              <!-- Список услуг -->
              <div 
                v-else
                v-for="service in services" 
                :key="service.id"
                class="service-card bg-white rounded-lg p-4 mb-4 shadow-sm hover:shadow transition"
              >
                <div class="flex justify-between items-start mb-2">
                  <h3 class="font-bold">{{ service.title }}</h3>
                  <span class="text-indigo-600 font-bold">{{ formatServicePrice(service.price) }}</span>
                  <!-- Отладочный вывод цен -->
                  <span v-if="false">{{ console.log('Сервис:', service.title, 'Цена:', service.price, typeof service.price) }}</span>
                </div>
                <p class="text-gray-600">{{ service.description }}</p>
                <div class="mt-3 flex justify-end">
                  <button 
                    @click="orderService(service)"
                    class="bg-pink-100 text-pink-700 px-4 py-1 rounded-full text-sm hover:bg-pink-200 transition"
                  >
                    Заказать услугу
                  </button>
                </div>
              </div>
            </div>

            <!-- Portfolio Section -->
            <div class="bg-gray-50 rounded-xl p-6 mb-8">
              <h2 class="text-xl font-bold mb-4">Портфолио</h2>
              
              <div v-if="!specialist.portfolio || specialist.portfolio.length === 0" class="text-center py-8">
                <i class="fas fa-images text-4xl text-gray-400 mb-3"></i>
                <p class="text-gray-600">Портфолио еще не добавлено</p>
              </div>
              
              <div v-else class="photo-grid">
                <div v-for="(photo, index) in specialist.portfolio" :key="index" class="portfolio-item">
                  <img :src="photo.image" :alt="photo.title" class="w-full h-48 object-cover">
                  <div class="portfolio-overlay">
                    <h4 class="font-bold">{{ photo.title }}</h4>
                    <p class="text-sm">{{ photo.description }}</p>
                  </div>
                </div>
              </div>
            </div>

            <!-- Reviews Section -->
            <div class="bg-gray-50 rounded-xl p-6 mb-8">
              <div class="flex justify-between items-center mb-4">
                <h2 class="text-xl font-bold">Отзывы клиентов</h2>
                <span class="text-lg font-medium text-indigo-600">{{ specialist.reviews_count || 0 }} отзывов</span>
              </div>
              
              <div v-if="!specialist.reviews || specialist.reviews.length === 0" class="text-center py-8">
                <i class="fas fa-comment-alt text-4xl text-gray-400 mb-3"></i>
                <p class="text-gray-600">Пока нет отзывов</p>
                <button class="mt-3 bg-indigo-600 text-white px-4 py-2 rounded-full hover:bg-indigo-700 transition">Оставить отзыв</button>
              </div>
              
              <div v-else v-for="review in specialist.reviews" :key="review.id" class="bg-white rounded-lg p-4 mb-4 shadow-sm">
                <div class="flex justify-between items-center mb-3">
                  <div class="flex items-center">
                    <img :src="review.user_avatar" :alt="review.user_name" class="w-10 h-10 rounded-full object-cover mr-3">
                    <div>
                      <h4 class="font-bold">{{ review.user_name }}</h4>
                      <p class="text-gray-500 text-sm">{{ formatDate(review.created_at) }}</p>
                    </div>
                  </div>
                  <div class="rating-stars flex">
                    <template v-for="star in 5">
                      <i :class="['fas', star <= review.rating ? 'fa-star' : 'fa-star text-gray-300']"></i>
                    </template>
                  </div>
                </div>
                <p class="text-gray-700">{{ review.comment }}</p>
              </div>
            </div>
          </div>
          
          <!-- Right Column -->
          <div class="lg:w-1/3">
            <!-- Contact Card -->
            <div class="bg-gray-50 rounded-xl p-6 mb-6 sticky top-6">
              <h2 class="text-xl font-bold mb-4">Контактная информация</h2>
              <div class="space-y-3">
                <div class="flex items-center" v-if="specialist.phone">
                  <i class="fas fa-phone-alt w-8 h-8 bg-indigo-100 text-indigo-600 rounded-full flex items-center justify-center mr-3"></i>
                  <span>{{ specialist.phone }}</span>
                </div>
                <div class="flex items-center" v-if="specialist.email">
                  <i class="fas fa-envelope w-8 h-8 bg-indigo-100 text-indigo-600 rounded-full flex items-center justify-center mr-3"></i>
                  <span>{{ specialist.email }}</span>
                </div>
                <div class="flex items-center" v-if="specialist.website">
                  <i class="fas fa-globe w-8 h-8 bg-indigo-100 text-indigo-600 rounded-full flex items-center justify-center mr-3"></i>
                  <a :href="specialist.website" target="_blank" class="text-indigo-600 hover:underline">{{ specialist.website }}</a>
                </div>
                <div class="flex items-center" v-if="specialist.instagram">
                  <i class="fab fa-instagram w-8 h-8 bg-indigo-100 text-indigo-600 rounded-full flex items-center justify-center mr-3"></i>
                  <a :href="'https://instagram.com/' + specialist.instagram" target="_blank" class="text-indigo-600 hover:underline">@{{ specialist.instagram }}</a>
                </div>
              </div>
              
              <div class="mt-6">
                <button 
                  @click="openOrderModal"
                  class="w-full bg-pink-500 text-white py-3 rounded-lg font-medium hover:bg-pink-600 transition"
                >
                  Заказать услугу
                </button>
              </div>
              <div class="mt-3">
                <!-- <RouterLink :to="`/messages/specialist/${specialist.id}`" class="w-full block text-center bg-indigo-600 text-white py-3 rounded-lg font-medium hover:bg-indigo-700 transition">
                  Написать сообщение
                </RouterLink> -->
                <button @click="vRazrabotke"  class="bg-indigo-600 text-white px-6 py-2 rounded-full hover:bg-indigo-700 transition flex items-center">
                <i class="far fa-envelope mr-2"></i> Написать сообщение
              </button>
              </div>
            </div>
            
            <!-- Upcoming Events -->
            <!-- <div class="bg-gray-50 rounded-xl p-6 mb-6">
              <h2 class="text-xl font-bold mb-4">Ближайшие даты</h2>
              
              <div v-if="!specialist.upcoming_events || specialist.upcoming_events.length === 0" class="text-center py-6">
                <p class="text-gray-600">Нет запланированных мероприятий</p>
              </div>
              
              <div v-else class="space-y-4">
                <div v-for="event in specialist.upcoming_events" :key="event.id" class="flex gap-4 items-center">
                  <div class="text-center">
                    <div class="text-2xl font-bold text-indigo-600">{{ formatDateDay(event.date) }}</div>
                    <div class="text-sm text-gray-500">{{ formatDateMonth(event.date) }}</div>
                  </div>
                  <div>
                    <h4 class="font-medium">{{ event.title }}</h4>
                    <p class="text-sm text-gray-500">{{ event.location }}</p>
                  </div>
                </div>
              </div>
            </div> -->
          
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRoute, RouterLink } from 'vue-router';
import { catalogService, formatPrice } from '@/services/apiService';
import { useAuthStore } from '@/stores/auth';

// Получаем ID специалиста из маршрута
const route = useRoute();
const specialistId = route.params.id;

// Локальное состояние
const specialist = ref(null);
const loading = ref(true);
const error = ref(null);
const currency = ref('RUB'); // текущая валюта для отображения цен (RUB - рубли, KGS - сомы)
const services = ref([]);
const servicesLoading = ref(false);
const servicesError = ref(null);

// Получение данных специалиста
const fetchSpecialist = async () => {
  try {
    loading.value = true;
    const data = await catalogService.getSpecialistById(specialistId);
    specialist.value = data;
    console.log('Получены данные специалиста:', data);
    await fetchServices();
  } catch (err) {
    console.error('Ошибка при загрузке данных специалиста:', err);
    error.value = 'Не удалось загрузить данные специалиста: ' + (err.message || 'Неизвестная ошибка');
  } finally {
    loading.value = false;
  }
};

// Получение услуг специалиста
const fetchServices = async () => {
  try {
    servicesLoading.value = true;
    // Получаем услуги по ID специалиста
    const data = await catalogService.getSpecialistServices(specialistId);
    services.value = data;
    console.log('Получены услуги специалиста:', data);
  } catch (err) {
    console.error('Ошибка при загрузке услуг специалиста:', err);
    servicesError.value = 'Не удалось загрузить услуги: ' + (err.message || 'Неизвестная ошибка');
  } finally {
    servicesLoading.value = false;
  }
};

const vRazrabotke = async () => {
  alert('Находится в разработке')
}

// Добавление в избранное
const addToFavorites = async () => {
  const authStore = useAuthStore();
  if (!authStore.isLoggedIn) {
    // Если пользователь не авторизован, показываем всплывающее окно или перенаправляем на страницу входа
    alert('Для добавления в избранное необходимо войти в систему.');
    return;
  }
  
  try {
    await catalogService.addToFavorites(specialistId);
    alert('Специалист добавлен в избранное!');
  } catch (error) {
    console.error('Ошибка при добавлении в избранное:', error);
    alert('Не удалось добавить в избранное. Попробуйте позже.');
  }
};

// Открытие модального окна для заказа услуги
const openOrderModal = () => {
  // В будущей реализации: открытие модального окна для заказа услуги
  alert('Функциональность заказа услуг будет доступна в ближайшее время');
};

// Заказ конкретной услуги
const orderService = (service) => {
  // В будущей реализации: открытие модального окна для заказа конкретной услуги
  alert(`Услуга "${service.title}" будет доступна для заказа в ближайшее время`);
};

// Функция переключения валюты
const toggleCurrency = () => {
  currency.value = currency.value === 'RUB' ? 'KGS' : 'RUB';
  // Сохраняем выбор пользователя в localStorage
  localStorage.setItem('preferred_currency', currency.value);
};

// Загрузка данных при монтировании компонента
onMounted(() => {
  fetchSpecialist();
  
  // Загружаем предпочтительную валюту из localStorage
  const preferredCurrency = localStorage.getItem('preferred_currency');
  if (preferredCurrency) {
    currency.value = preferredCurrency;
  }
});

// Вспомогательные функции
const getCategoryName = (categoryCode) => {
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
    'other': 'Другое'
  };
  
  return categoryMap[categoryCode] || categoryCode;
};

const formatDate = (dateString) => {
  if (!dateString) return '';
  const date = new Date(dateString);
  return new Intl.DateTimeFormat('ru-RU', { day: 'numeric', month: 'long', year: 'numeric' }).format(date);
};

const formatDateDay = (dateString) => {
  if (!dateString) return '';
  const date = new Date(dateString);
  return date.getDate();
};

const formatDateMonth = (dateString) => {
  if (!dateString) return '';
  const date = new Date(dateString);
  return new Intl.DateTimeFormat('ru-RU', { month: 'long' }).format(date);
};

// Функция обертка для formatPrice с учетом текущей валюты
const formatServicePrice = (price) => {
  return formatPrice(price, currency.value);
};
</script>

<style scoped>
.hero-gradient {
  background: linear-gradient(135deg, #6B7280 0%, #4B5563 100%);
}
.pro-avatar {
  box-shadow: 0 0 0 5px white, 0 0 0 8px #4F46E5;
}
.photo-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(230px, 1fr));
  gap: 16px;
}
.portfolio-item {
  position: relative;
  overflow: hidden;
  border-radius: 8px;
}
.portfolio-item:hover .portfolio-overlay {
  opacity: 1;
}
.portfolio-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(79, 70, 229, 0.8);
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  opacity: 0;
  transition: opacity 0.3s ease;
  color: white;
  padding: 1rem;
  text-align: center;
}
.rating-stars {
  color: #F59E0B;
}
.service-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
}
</style>
