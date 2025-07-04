<template>
  <div class="bg-white">
    <!-- Состояние загрузки -->
    <div v-if="loading" class="text-center py-20">
      <div class="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-pink-500 mx-auto mb-4"></div>
      <p class="text-lg text-gray-600">Загрузка данных тендера...</p>
    </div>

    <!-- Ошибка загрузки -->
    <div v-else-if="error" class="text-center py-20">
      <div class="bg-red-50 border border-red-200 text-red-700 p-4 rounded-lg max-w-lg mx-auto">
        <p class="font-medium">Ошибка при загрузке тендера</p>
        <p class="text-sm">{{ error }}</p>
      </div>
    </div>

    <!-- Контент тендера -->
    <div v-else-if="tender" class="container mx-auto px-4 py-12">
      <!-- Кнопка возврата к списку тендеров -->
      <div class="mb-8">
        <RouterLink to="/tenders" class="inline-flex items-center text-gray-600 hover:text-pink-500">
          <i class="fas fa-arrow-left mr-2"></i> Назад к списку тендеров
        </RouterLink>
      </div>

      <!-- Шапка тендера -->
      <div class="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden mb-8">
        <div class="p-8">
          <!-- Заголовок и статус -->
          <div class="flex flex-wrap justify-between items-start mb-6">
            <div class="mb-4 md:mb-0">
              <div class="flex items-center mb-2">
                <span class="tender-tag" :class="tender.category">
                  {{ getCategoryName(tender.category) }}
                </span>
                <span class="ml-4 text-sm text-gray-500">Создано: {{ formatDate(tender.created_at) }}</span>
              </div>
              <h1 class="text-3xl font-bold mb-2">{{ tender.title }}</h1>
              <div class="flex items-center">
                <span class="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-medium">
                  {{ getTenderStatus(tender.status) }}
                </span>
                <span class="ml-4 text-sm text-gray-500">Заявок: {{ tender.proposals_count || 0 }}</span>
              </div>
            </div>
            <div class="flex">
              <!-- Кнопка отклика только для специалистов -->
              <button 
                v-if="isAuthenticated && isSpecialist && !isAuthor" 
                class="btn-primary text-white px-6 py-2 rounded-full"
                @click="respondToTender"
              >
                <i class="fas fa-paper-plane mr-2"></i> Откликнуться
              </button>
              
              <!-- Отладочная информация по ролям -->
              <!-- <div class="text-sm bg-yellow-100 p-3 rounded mt-4 border border-yellow-300 font-bold">
                Отладочная информация:<br>
                user_type: {{ currentUser?.user_type }} <br>
                isSpecialist: {{ isSpecialist }} <br>
                isCouple: {{ isCouple }} <br>
                isAuthor: {{ isAuthor }} <br>
                isAuthenticated: {{ isAuthenticated }}
              </div> -->
              
              <!-- Кнопка редактирования для автора тендера -->
              <button v-if="isAuthor" @click="openEditModal" class="btn-edit text-white px-6 py-2 rounded-full">
                <i class="fas fa-edit mr-2"></i> Редактировать
              </button>
              
              <!-- Кнопка избранного -->
              <button class="ml-3 bg-gray-100 text-gray-700 px-6 py-2 rounded-full hover:bg-gray-200 transition">
                <i class="far fa-heart"></i>
              </button>
            </div>
          </div>

          <!-- Информация о тендере -->
          <div class="grid md:grid-cols-3 gap-8 mb-6">
            <div>
              <h3 class="font-medium mb-2 text-gray-700">Бюджет</h3>
              <p class="font-bold text-xl text-pink-500">{{ formatPrice(tender.budget) }}</p>
            </div>
            <div>
              <h3 class="font-medium mb-2 text-gray-700">Дата мероприятия</h3>
              <p class="font-bold text-xl">{{ formatDate(tender.event_date) }}</p>
            </div>
            <div>
              <h3 class="font-medium mb-2 text-gray-700">Локация</h3>
              <p class="font-bold text-xl">{{ tender.location }}</p>
            </div>
          </div>

          <!-- Основное содержание -->
          <div class="border-t border-gray-100 pt-6">
            <h2 class="text-xl font-bold mb-4">Описание</h2>
            <div class="text-gray-700 mb-8 whitespace-pre-wrap">{{ tender.description }}</div>

            <div v-if="tender.requirements && tender.requirements.length > 0" class="mb-8">
              <h2 class="text-xl font-bold mb-4">Требования</h2>
              <ul class="list-disc list-inside space-y-2 text-gray-700">
                <li v-for="(req, index) in tender.requirements" :key="index">{{ req }}</li>
              </ul>
            </div>

            <div v-if="tender.attachments && tender.attachments.length > 0" class="mb-8">
              <h2 class="text-xl font-bold mb-4">Вложения</h2>
              <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div v-for="(attachment, index) in tender.attachments" :key="index" class="bg-gray-50 p-3 rounded-lg">
                  <div class="flex items-center">
                    <i class="fas fa-file-alt text-gray-500 mr-3"></i>
                    <a :href="attachment.url" target="_blank" class="text-indigo-600 hover:underline truncate">
                      {{ attachment.name }}
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Информация о заказчике -->
      <div class="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden mb-8">
        <div class="p-6">
          <h2 class="text-xl font-bold mb-6">Информация о заказчике</h2>
          <div class="flex items-center">
            <img :src="tender.client?.avatar || '/src/assets/img/default-avatar.png'" alt="Client Avatar" class="w-16 h-16 rounded-full object-cover">
            <div class="ml-4">
              <h3 class="font-bold text-lg">{{ tender.client?.name || 'Имя заказчика' }}</h3>
              <p class="text-gray-600">{{ tender.client?.email || 'email@example.com' }}</p>
            </div>
          </div>
        </div>
      </div>

      <!-- Заявки исполнителей (если есть права на просмотр) -->
      <div v-if="tender.proposals && tender.proposals.length > 0" class="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div class="p-6">
          <h2 class="text-xl font-bold mb-6">Заявки от исполнителей</h2>
          <div class="space-y-4">
            <div v-for="proposal in tender.proposals" :key="proposal.id" class="border border-gray-100 rounded-lg p-4 hover:border-pink-200 transition">
              <div class="flex items-center justify-between mb-4">
                <div class="flex items-center">
                  <img :src="proposal.specialist_data?.avatar || '/src/assets/img/default-avatar.png'" alt="Specialist Avatar" class="w-12 h-12 rounded-full object-cover mr-4">
                  <div>
                    <!-- Улучшенное отображение имени специалиста с несколькими вариантами источников данных -->
                    <h3 class="font-bold">{{ proposal.specialist_name || proposal.specialist_data?.name || proposal.specialist_data?.first_name || 'Имя специалиста' }}</h3>
                    <!-- Категория специалиста с переводом на русский язык -->
                    <p class="text-gray-600 text-sm">{{ getCategoryName(proposal.specialist_data?.category || proposal.specialist_data?.specialist_type) || 'Специалист' }}</p>
                  </div>
                </div>
                <span class="font-bold text-pink-500">{{ formatPrice(proposal.price) }}</span>
              </div>
              <!-- Текст отклика специалиста -->
              <p class="text-gray-700 mb-3">{{ proposal.message || 'Нет сопроводительного сообщения' }}</p>
              <!-- Описание профиля специалиста -->
              <div v-if="proposal.specialist_data?.description" class="bg-gray-50 p-3 rounded-lg mb-4 text-sm">
                <h4 class="font-medium text-gray-800 mb-1">О специалисте:</h4>
                <p class="text-gray-600">{{ proposal.specialist_data.description }}</p>
              </div>
              <div class="flex justify-between items-center">
                <div class="text-sm text-gray-500">{{ formatDate(proposal.created_at) }}</div>
                <button @click="contactSpecialist(proposal.specialist_data?.id)" class="btn-primary text-white px-4 py-2 rounded-lg text-sm">Связаться</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Тендер не найден -->
    <div v-else class="text-center py-20">
      <div class="max-w-lg mx-auto bg-gray-50 p-8 rounded-lg">
        <i class="fas fa-search text-5xl text-gray-300 mb-4"></i>
        <h2 class="text-2xl font-bold mb-2">Тендер не найден</h2>
        <p class="text-gray-600 mb-4">Запрошенный тендер не существует или был удалён.</p>
        <RouterLink to="/tenders" class="btn-primary text-white px-6 py-2 rounded-full inline-block">
          Вернуться к списку тендеров
        </RouterLink>
      </div>
    </div>
  </div>
  
  <!-- Модальное окно отклика на тендер -->
  <div v-if="isRespondModalOpen" class="fixed inset-0 flex items-center justify-center z-50" style="background-color: #000000c5;">
    <div class="bg-white rounded-lg max-w-lg w-full max-h-[80vh] overflow-y-auto">
      <div class="flex justify-between items-center p-4 border-b">
        <h2 class="text-xl font-bold">Отклик на тендер: {{ tender?.title }}</h2>
        <button @click="closeRespondModal" class="text-gray-500 hover:text-gray-800">
          <i class="fas fa-times text-xl"></i>
        </button>
      </div>
      
      <div class="p-4">
        <form @submit.prevent="submitProposal" class="space-y-4">
          <!-- Информация о тендере -->
          <div class="bg-gray-50 p-3 rounded-lg mb-4">
            <p class="text-sm text-gray-600 mb-2">Бюджет заказчика: <span class="font-medium">{{ formatPrice(tender?.budget) }}</span></p>
            <p class="text-sm text-gray-600">Дата мероприятия: <span class="font-medium">{{ formatDate(tender?.event_date) }}</span></p>
          </div>
          
          <!-- Сообщение -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Ваше предложение</label>
            <textarea 
              v-model="proposalData.message" 
              class="w-full px-3 py-2 border border-gray-300 rounded-md h-32"
              :class="{'border-red-500': proposalErrors.message}"
              placeholder="Опишите свое предложение для заказчика, укажите свой опыт и почему вы подходите для этой работы"
            ></textarea>
            <p v-if="proposalErrors.message" class="text-red-500 text-xs mt-1">{{ proposalErrors.message }}</p>
          </div>
          
          <!-- Цена -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Ваша цена (руб.)</label>
            <input 
              v-model="proposalData.price" 
              type="number" 
              min="0"
              
              class="w-full px-3 py-2 border border-gray-300 rounded-md"
              :class="{'border-red-500': proposalErrors.price}"
            >
            <p v-if="proposalErrors.price" class="text-red-500 text-xs mt-1">{{ proposalErrors.price }}</p>
          </div>
          
          <!-- Доступность в указанную дату -->
          <div class="flex items-center">
            <input 
              v-model="proposalData.availability" 
              type="checkbox"
              id="availability"
              class="mr-2"
            >
            <label for="availability" class="text-sm text-gray-700">Я доступен в указанную дату ({{ formatDate(tender?.event_date) }})</label>
          </div>
          
          <!-- Кнопки -->
          <div class="flex justify-end space-x-3 mt-6">
            <button 
              type="button" 
              @click="closeRespondModal" 
              class="px-4 py-2 text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300"
              :disabled="isProposalSubmitting"
            >
              Отмена
            </button>
            <button 
              type="submit" 
              class="px-4 py-2 text-white bg-pink-500 rounded-md hover:bg-pink-600"
              :disabled="isProposalSubmitting"
            >
              <span v-if="isProposalSubmitting">
                <i class="fas fa-spinner fa-spin mr-2"></i> Отправка...
              </span>
              <span v-else>Отправить предложение</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>

  <!-- Модальное окно редактирования -->
  <div v-if="isEditing" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
    <div class="bg-white rounded-lg max-w-3xl w-full max-h-[90vh] overflow-y-auto">
      <div class="flex justify-between items-center p-6 border-b">
        <h2 class="text-2xl font-bold">Редактирование тендера</h2>
        <button @click="closeEditModal" class="text-gray-500 hover:text-gray-800">
          <i class="fas fa-times text-xl"></i>
        </button>
      </div>
      
      <div class="p-6">
        <form @submit.prevent="saveTender" class="space-y-6">
          <!-- Название тендера -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Название тендера</label>
            <input 
              v-model="editedTender.title" 
              type="text" 
              class="w-full px-3 py-2 border border-gray-300 rounded-md"
              :class="{'border-red-500': editErrors.title}"
            >
            <p v-if="editErrors.title" class="text-red-500 text-xs mt-1">{{ editErrors.title }}</p>
          </div>
          
          <!-- Категория -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Категория</label>
            <select 
              v-model="editedTender.category" 
              class="w-full px-3 py-2 border border-gray-300 rounded-md"
              :class="{'border-red-500': editErrors.category}"
            >
              <option value="photography">Фотограф</option>
              <option value="videography">Видеограф</option>
              <option value="venue">Площадка</option>
              <option value="catering">Кейтеринг</option>
              <option value="band">Музыкальная группа</option>
              <option value="decor">Декор</option>
              <option value="cake">Торты и десерты</option>
              <option value="clothing">Свадебные наряды</option>
              <option value="other">Другое</option>
            </select>
            <p v-if="editErrors.category" class="text-red-500 text-xs mt-1">{{ editErrors.category }}</p>
          </div>
          
          <!-- Бюджет -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Бюджет (руб.)</label>
            <input 
              v-model="editedTender.budget" 
              type="number" 
              class="w-full px-3 py-2 border border-gray-300 rounded-md"
              :class="{'border-red-500': editErrors.budget}"
            >
            <p v-if="editErrors.budget" class="text-red-500 text-xs mt-1">{{ editErrors.budget }}</p>
          </div>
          
          <!-- Дата мероприятия -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Дата мероприятия</label>
            <input 
              v-model="editedTender.event_date" 
              type="date" 
              class="w-full px-3 py-2 border border-gray-300 rounded-md"
              :class="{'border-red-500': editErrors.event_date}"
            >
            <p v-if="editErrors.event_date" class="text-red-500 text-xs mt-1">{{ editErrors.event_date }}</p>
          </div>
          
          <!-- Локация -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Локация</label>
            <input 
              v-model="editedTender.location" 
              type="text" 
              class="w-full px-3 py-2 border border-gray-300 rounded-md"
              :class="{'border-red-500': editErrors.location}"
            >
            <p v-if="editErrors.location" class="text-red-500 text-xs mt-1">{{ editErrors.location }}</p>
          </div>
          
          <!-- Описание -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Описание</label>
            <textarea 
              v-model="editedTender.description" 
              rows="5" 
              class="w-full px-3 py-2 border border-gray-300 rounded-md"
              :class="{'border-red-500': editErrors.description}"
            ></textarea>
            <p v-if="editErrors.description" class="text-red-500 text-xs mt-1">{{ editErrors.description }}</p>
          </div>
          
          <!-- Требования -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Требования (каждое требование с новой строки)</label>
            <textarea 
              v-model="editedTender.requirements_text" 
              rows="3" 
              class="w-full px-3 py-2 border border-gray-300 rounded-md"
              :class="{'border-red-500': editErrors.requirements}"
              placeholder="Укажите каждое требование с новой строки"
            ></textarea>
            <p v-if="editErrors.requirements" class="text-red-500 text-xs mt-1">{{ editErrors.requirements }}</p>
          </div>
          
          <!-- Кнопки -->
          <div class="flex justify-end space-x-4">
            <button 
              type="button" 
              @click="closeEditModal" 
              class="px-6 py-2 bg-gray-100 text-gray-800 rounded-lg hover:bg-gray-200 transition"
            >
              Отмена
            </button>
            <button 
              type="submit" 
              class="px-6 py-2 bg-pink-500 text-white rounded-lg hover:bg-pink-600 transition"
              :disabled="editLoading"
            >
              <span v-if="editLoading" class="inline-block animate-spin mr-2">⏳</span>
              Сохранить
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useAuthStore } from '../stores/auth';
import { tendersService } from '../services/apiService';

// Получаем ID тендера из параметров маршрута
const route = useRoute();
const router = useRouter();
const tenderId = route.params.id;

// Получаем данные пользователя
const authStore = useAuthStore();

// Состояние компонента
const tender = ref(null);
const loading = ref(true);
const error = ref(null);

// Состояние для модального окна редактирования
const isEditing = ref(false);
const editedTender = ref({});
const editErrors = ref({});
const editLoading = ref(false);

// Определяем роль пользователя и дополнительные права
const isSpecialist = computed(() => {
  const result = authStore.isSpecialist;
  console.log('Пользователь специалист?', result, authStore.user?.user_type);
  return result;
});
const isCouple = computed(() => {
  const result = authStore.isCouple;
  console.log('Пользователь пара?', result, authStore.user?.user_type);
  return result;
});
const isAuthenticated = computed(() => {
  const result = authStore.isLoggedIn;
  console.log('Пользователь авторизован?', result);
  return result;
});
const currentUser = computed(() => authStore.user);
const isAuthor = computed(() => {
  if (!tender.value || !currentUser.value) return false;
  const result = tender.value.author_id === currentUser.value.id;
  console.log('Пользователь автор?', result, tender.value?.author_id, currentUser.value?.id);
  return result;
});

// Загрузка данных тендера
const fetchTender = async () => {
  try {
    loading.value = true;
    error.value = null;
    
    const result = await tendersService.getTenderById(tenderId);
    tender.value = result;
    
    // Формируем текст требований для отображения
    const requirementsText = result.requirements?.join('\n') || '';
    
    // Проверяем, является ли текущий пользователь автором тендера
    if (isAuthenticated.value) {
      isAuthor.value = isCouple.value && 
                      tender.value.couple && 
                      tender.value.couple.user === authStore.user.id;
    }
    
    // Проверяем, откликался ли уже текущий пользователь на тендер
    if (isAuthenticated.value && isSpecialist.value) {
      await checkProposalExists();
    }
    
    // Загрузка откликов на тендер
    await fetchProposals();
    
    // Подготавливаем данные для редактирования
    editedTender.value = { ...result };
    editedTender.value.requirements_text = requirementsText;
  } catch (err) {
    console.error('Ошибка при загрузке данных тендера:', err);
    error.value = 'Не удалось загрузить данные тендера: ' + (err.message || 'Неизвестная ошибка');
  } finally {
    loading.value = false;
  }
};

// Загрузка откликов на тендер
const fetchProposals = async () => {
  try {
    console.log('Загрузка откликов для тендера ID:', tenderId);
    const proposals = await tendersService.getTenderProposals(tenderId);
    console.log('Получены отклики:', proposals);
    
    // Сохраняем отклики в объект тендера
    if (tender.value) {
      tender.value.proposals = proposals;
    }
  } catch (err) {
    console.error('Ошибка при загрузке откликов:', err);
  }
};

// Вспомогательные функции
const getCategoryName = (categoryCode) => {
  // Если категория не указана, возвращаем общее название
  if (!categoryCode) return 'Специалист';
  
  const categoryMap = {
    // Основные категории
    'photography': 'Фотограф',
    'videography': 'Видеограф',
    'venue': 'Площадка',
    'catering': 'Кейтеринг',
    'music': 'Музыка',
    'decor': 'Декор',
    'cake': 'Торты и десерты',
    'flowers': 'Цветы',
    'beauty': 'Красота',
    'coordinator': 'Координатор',
    'transport': 'Транспорт',
    
    // Дополнительные категории, которые могут использоваться в API
    'musician': 'Музыкант',
    'suit': 'Костюмы',
    'dress': 'Платья',
    'rings': 'Кольца',
    'invitation': 'Приглашения',
    'accessories': 'Аксессуары',
    'stylist': 'Стилист',
    'makeup': 'Визажист',
    'planner': 'Организатор',
    'host': 'Ведущий',
    'other': 'Другое'
  };
  
  // Возвращаем локализованное название или оригинальный код как запасной вариант
  return categoryMap[categoryCode] || categoryCode;
};

const getTenderStatus = (status) => {
  const statusMap = {
    'active': 'Активный',
    'pending': 'На рассмотрении',
    'completed': 'Завершен',
    'canceled': 'Отменен',
    'draft': 'Черновик'
  };
  
  return statusMap[status] || status;
};

const formatDate = (dateString) => {
  if (!dateString) return '';
  const date = new Date(dateString);
  return new Intl.DateTimeFormat('ru-RU', { day: 'numeric', month: 'long', year: 'numeric' }).format(date);
};

const formatPrice = (price) => {
  if (!price && price !== 0) return '';
  return new Intl.NumberFormat('ru-RU', { style: 'currency', currency: 'RUB', maximumFractionDigits: 0 }).format(price);
};

// Открытие модального окна редактирования
const openEditModal = () => {
  // Создаем копию объекта тендера для редактирования
  editedTender.value = {
    ...tender.value,
    event_date: tender.value.event_date ? new Date(tender.value.event_date).toISOString().split('T')[0] : '',
    // Преобразуем массив требований в текст для формы
    requirements_text: Array.isArray(tender.value.requirements) ? tender.value.requirements.join('\n') : ''
  };
  
  // Открываем модальное окно
  isEditing.value = true;
  editErrors.value = {};
};

// Закрытие модального окна
const closeEditModal = () => {
  isEditing.value = false;
  editErrors.value = {};
};

// Валидация формы
const validateTenderForm = () => {
  const errors = {};
  
  if (!editedTender.value.title || editedTender.value.title.trim() === '') {
    errors.title = 'Необходимо указать название тендера';
  }
  
  if (!editedTender.value.category) {
    errors.category = 'Выберите категорию';
  }
  
  if (!editedTender.value.budget) {
    errors.budget = 'Укажите бюджет';
  } else if (isNaN(parseFloat(editedTender.value.budget)) || parseFloat(editedTender.value.budget) <= 0) {
    errors.budget = 'Бюджет должен быть положительным числом';
  }
  
  if (!editedTender.value.event_date) {
    errors.event_date = 'Укажите дату мероприятия';
  }
  
  if (!editedTender.value.location || editedTender.value.location.trim() === '') {
    errors.location = 'Укажите место проведения';
  }
  
  if (!editedTender.value.description || editedTender.value.description.trim() === '') {
    errors.description = 'Необходимо добавить описание';
  }
  
  return errors;
};

// Отклик на тендер (для специалистов)
const isRespondModalOpen = ref(false);
const proposalData = ref({
  message: '',
  price: '',
  availability: true,
});
const proposalErrors = ref({});
const isProposalSubmitting = ref(false);
const hasProposal = ref(false);

// Проверка, откликался ли уже специалист на тендер
const checkExistingProposal = async () => {
  try {
    const result = await tendersService.checkProposalExists(tenderId);
    hasProposal.value = result.exists;
    console.log('Проверка наличия отклика:', result);
    return result.exists;
  } catch (err) {
    console.error('Ошибка при проверке наличия отклика:', err);
    return false;
  }
};

// Открытие модального окна для отклика
const respondToTender = async () => {
  // Проверяем, откликался ли уже специалист
  const alreadyResponded = await checkExistingProposal();
  if (alreadyResponded) {
    alert('Вы уже откликнулись на этот тендер');
    return;
  }
  
  // Сбрасываем данные формы
  proposalData.value = {
    message: '',
    price: tender.value ? tender.value.budget : '',
    availability: true,
  };
  
  proposalErrors.value = {};
  isRespondModalOpen.value = true;
};

// Закрытие модального окна отклика
const closeRespondModal = () => {
  isRespondModalOpen.value = false;
};

// Валидация формы отклика
const validateProposal = () => {
  const errors = {};
  
  if (!proposalData.value.message || proposalData.value.message.trim() === '') {
    errors.message = 'Введите текст предложения';
  }
  
  if (!proposalData.value.price) {
    errors.price = 'Укажите вашу цену';
  } else if (isNaN(parseFloat(proposalData.value.price)) || parseFloat(proposalData.value.price) <= 0) {
    errors.price = 'Цена должна быть положительным числом';
  }
  
  return errors;
};

// Отправка отклика
const submitProposal = async () => {
  // Проверка валидации
  const validationErrors = validateProposal();
  
  if (Object.keys(validationErrors).length > 0) {
    proposalErrors.value = validationErrors;
    return;
  }
  
  try {
    isProposalSubmitting.value = true;
    
    // Подготовка данных
    const data = {
      message: proposalData.value.message,
      price: parseFloat(proposalData.value.price),
      availability: proposalData.value.availability,
      tender: tenderId // ID тендера
    };
    
    // Отправка на сервер
    const result = await tendersService.respondToTender(tenderId, data);
    console.log('Отклик отправлен:', result);
    
    // Обновление статуса отклика
    hasProposal.value = true;
    
    // Закрываем модальное окно
    isRespondModalOpen.value = false;
    
    // Уведомление об успехе
    alert('Ваш отклик успешно отправлен!');
    
    console.log('Обновляем список откликов после успешного отклика');
    
    // Обновляем данные тендера и список откликов
    await fetchTender(); // fetchTender() включает в себя вызов fetchProposals()
    
  } catch (err) {
    console.error('Ошибка при отправке отклика:', err);
    
    if (err.errors) {
      proposalErrors.value = err.errors;
    } else {
      alert('Произошла ошибка при отправке отклика. Попробуйте еще раз.');
    }
  } finally {
    isProposalSubmitting.value = false;
  }
};

// Сохранение изменений тендера
const saveTender = async () => {
  // Проверка валидации
  const validationErrors = validateTenderForm();
  
  if (Object.keys(validationErrors).length > 0) {
    editErrors.value = validationErrors;
    return;
  }
  
  try {
    editLoading.value = true;
    
    // Преобразуем требования из текста в массив
    const requirementsArray = editedTender.value.requirements_text
      ? editedTender.value.requirements_text
          .split('\n')
          .map(item => item.trim())
          .filter(item => item !== '')
      : [];
    
    // Создаем объект для отправки
    const updatedTender = {
      title: editedTender.value.title,
      category: editedTender.value.category,
      budget: parseFloat(editedTender.value.budget),
      event_date: editedTender.value.event_date,
      location: editedTender.value.location,
      description: editedTender.value.description,
      requirements: requirementsArray
    };
    
    // Отправка на сервер
    const result = await tendersService.updateTender(tenderId, updatedTender);
    
    // Обновляем данные тендера на странице
    tender.value = result;
    
    // Закрываем модальное окно
    isEditing.value = false;
    
    // Уведомление об успехе
    alert('Тендер успешно обновлен!');
    
  } catch (err) {
    console.error('Ошибка при обновлении тендера:', err);
    
    // Обработка ошибок сервера, если есть
    if (err.errors) {
      editErrors.value = err.errors;
    } else {
      alert('Произошла ошибка при сохранении тендера. Попробуйте еще раз.');
    }
    
  } finally {
    editLoading.value = false;
  }
};

// Переход на страницу профиля специалиста
const contactSpecialist = (specialistId) => {
  if (!specialistId) {
    console.error('Невозможно перейти к профилю специалиста: идентификатор не найден');
    return;
  }

  // Переходим на страницу профиля специалиста
  // Корректный URL согласно настройкам маршрутизатора: /catalog/specialist/:id
  console.log('Переход к профилю специалиста', specialistId);
  router.push(`/catalog/specialist/${specialistId}`);
};

// Загрузка данных при монтировании компонента
onMounted(() => {
  fetchTender();
});
</script>

<style scoped>
.btn-primary {
  background-color: #FF6B8B;
  transition: all 0.3s ease;
}
.btn-primary:hover {
  background-color: #FF4D6D;
  transform: translateY(-2px);
}
.btn-edit {
  background-color: #3B82F6;
  transition: all 0.3s ease;
}
.btn-edit:hover {
  background-color: #2563EB;
  transform: translateY(-2px);
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
.tender-tag.videography {
  background-color: #E0F2FE;
  color: #0369A1;
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
  background-color: #FEF3C7;
  color: #92400E;
}
.tender-tag.other {
  background-color: #F3F4F6;
  color: #374151;
}
</style>
