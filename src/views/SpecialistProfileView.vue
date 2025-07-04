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
                 {{ specialist.rating }} ({{ specialist.reviews_count }} отзывов)
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
            
            <!-- Кнопки для других пользователей (не специалиста) -->
            <div v-if="!isOwnProfile" class="flex flex-wrap justify-center md:justify-start gap-3">
              <button class="bg-indigo-600 text-white px-6 py-2 rounded-full hover:bg-indigo-700 transition flex items-center">
                <i class="far fa-envelope mr-2"></i> Написать сообщение
              </button>
              <button class="bg-white text-indigo-600 px-6 py-2 rounded-full hover:bg-gray-100 transition flex items-center">
                <i class="far fa-heart mr-2"></i> В избранное
              </button>
            </div>
            
            <!-- Кнопка редактирования профиля для специалиста -->
            <div v-if="isOwnProfile" class="flex flex-wrap justify-center md:justify-start gap-3">
              <button 
                @click="startEditing"
                class="bg-indigo-600 text-white px-6 py-2 rounded-full hover:bg-indigo-700 transition flex items-center"
              >
                <i class="fas fa-edit mr-2"></i> Редактировать профиль
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
              
              <div class="mt-6">
                <h3 class="font-bold mb-2">Специализация:</h3>
                <div class="flex flex-wrap gap-2">
                  <span 
                    v-for="(specialization, index) in specialist.specializations || ['Свадебная фотосъемка', 'Портретная фотография', 'Love Story']" 
                    :key="index"
                    class="bg-gray-200 text-gray-800 px-3 py-1 rounded-full text-sm font-medium"
                  >
                    {{ specialization }}
                  </span>
                </div>
              </div>
            </div>

            <!-- Services Card -->
            <div class="bg-gray-50 rounded-xl p-6 mb-8">
              <h2 class="text-xl font-bold mb-4">Услуги и цены</h2>
              
              <!-- Кнопка добавления услуги для владельца профиля -->
              <div v-if="isOwnProfile" class="mb-4">
                <button @click="openNewServiceModal()" class="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition">
                  <i class="fas fa-plus-circle mr-2"></i>Добавить услугу
                </button>
              </div>
              
              <!-- Загрузка услуг -->
              <div v-if="loadingServices" class="bg-gray-100 border border-gray-200 rounded-lg p-6 text-center">
                <div class="animate-pulse flex flex-col items-center">
                  <div class="rounded-full bg-gray-300 h-12 w-12 mb-2"></div>
                  <div class="h-4 bg-gray-300 rounded w-1/3 mb-2"></div>
                  <div class="h-4 bg-gray-300 rounded w-1/4"></div>
                </div>
              </div>
              
              <!-- Пустой список услуг -->
              <div v-else-if="!loadingServices && services.length === 0" class="bg-gray-100 border border-gray-200 rounded-lg p-6 text-center">
                <i class="fas fa-list-alt text-4xl text-gray-400 mb-3"></i>
                <p class="text-gray-600">Услуги и цены еще не добавлены</p>
              </div>
              
              <!-- Ошибка при загрузке услуг -->
              <div v-else-if="servicesError" class="bg-red-50 border border-red-200 text-red-700 p-4 rounded-lg mb-4">
                <div class="flex items-start">
                  <i class="fas fa-exclamation-circle text-red-500 mt-1 mr-2"></i>
                  <div>
                    <p class="font-medium">Ошибка при загрузке услуг</p>
                    <p class="text-sm">{{ servicesError }}</p>
                  </div>
                </div>
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
                  <span class="text-indigo-600 font-bold">{{ formatPrice(service.price) }}</span>
                </div>
                <p class="text-gray-600 mb-3">{{ service.description }}</p>
                <div class="flex justify-between items-center">
                  <span class="text-sm text-gray-500">Длительность: {{ service.duration }} минут</span>
                  <div>
                    <button v-if="!isOwnProfile" class="text-indigo-600 hover:text-indigo-800 text-sm font-medium">
                      Заказать
                    </button>
                    <div v-else class="flex gap-2">
                      <button @click="editService(service)" class="text-blue-600 hover:text-blue-800 text-sm font-medium">
                        <i class="fas fa-edit"></i>
                      </button>
                      <button @click="confirmDeleteService(service)" class="text-red-600 hover:text-red-800 text-sm font-medium">
                        <i class="fas fa-trash"></i>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>

          </div>
          
          <!-- Right Column -->
          <div class="lg:w-1/3">
            <!-- Contact Card -->
            <div class="bg-gray-50 rounded-xl p-6 mb-8 top-6">
              <h2 class="text-xl font-bold mb-4">Свяжитесь со мной</h2>
              
              <div class="mb-6" v-if="!isOwnProfile">
                <button class="w-full bg-indigo-600 text-white py-3 rounded-lg hover:bg-indigo-700 transition mb-3">
                  Отправить сообщение
                </button>
                <button class="w-full bg-white text-indigo-600 border border-indigo-600 py-3 rounded-lg hover:bg-indigo-50 transition">
                  Заказать услугу
                </button>
              </div>
              
              <div class="mb-6">
                <div class="flex items-center mb-3">
                  <i class="fas fa-phone-alt w-5 text-indigo-600"></i>
                  <span>{{ specialist.phone || '+7 (XXX) XXX-XX-XX' }}</span>
                </div>
                <div class="flex items-center mb-3">
                  <i class="fas fa-envelope w-5 text-indigo-600"></i>
                  <span>{{ specialist.email || 'email@example.com' }}</span>
                </div>
                <div class="flex items-center">
                  <i class="fas fa-globe w-5 text-indigo-600"></i>
                  <a href="#" class="text-indigo-600 hover:underline">{{ specialist.website || 'www.example.com' }}</a>
                </div>
              </div>
              
              <div class="border-t border-gray-200 pt-6">
                <h3 class="font-bold mb-3">Социальные сети</h3>
                <div class="flex space-x-2 mt-4">
                  <!-- Социальные сети -->
                  <a href="#" class="bg-indigo-100 text-indigo-600 w-10 h-10 rounded-full flex items-center justify-center hover:bg-indigo-200 transition">
                    <i class="fab fa-instagram"></i>
                  </a>
                  <a href="#" class="bg-indigo-100 text-indigo-600 w-10 h-10 rounded-full flex items-center justify-center hover:bg-indigo-200 transition">
                    <i class="fab fa-vk"></i>
                  </a>
                  <a href="#" class="bg-indigo-100 text-indigo-600 w-10 h-10 rounded-full flex items-center justify-center hover:bg-indigo-200 transition">
                    <i class="fab fa-telegram"></i>
                  </a>
                  <a href="#" class="bg-indigo-100 text-indigo-600 w-10 h-10 rounded-full flex items-center justify-center hover:bg-indigo-200 transition">
                    <i class="fab fa-whatsapp"></i>
                  </a>
                </div>
              </div>
            </div>
            
            
            
            <!-- Availability Card -->
            <div v-if="activeTab === 'availability' || activeTab === 'about'" class="bg-gray-50 rounded-xl p-6">
              <h2 class="text-xl font-bold mb-4">Доступность</h2>
              
              <div class="mb-4">
                <h3 class="font-medium mb-2">Ближайшие свободные даты:</h3>
                <div class="grid grid-cols-3 gap-2">
                  <div 
                    v-for="(date, index) in specialist.available_dates || defaultAvailableDates" 
                    :key="index"
                    class="bg-white rounded p-2 text-center"
>
                    <div class="text-indigo-600 font-bold">{{ formatDateDay(date) }}</div>
                    <div class="text-xs">{{ formatDateMonth(date) }}</div>
                  </div>
                </div>
              </div>
            </div>
          
          </div>
        </div>
      </div>
    </section>
    
    <!-- Модальное окно редактирования профиля -->
    <div v-if="isEditing" class="fixed inset-0 z-50 flex items-center justify-center px-4" style="background-color: #0000009c;">
      <div class="bg-white rounded-lg max-w-3xl w-full max-h-[90vh] overflow-y-auto">
        <div class="p-6">
          <div class="flex justify-between items-center mb-6">
            <h2 class="text-2xl font-bold">Редактирование профиля</h2>
            <button @click="cancelEditing" class="text-gray-500 hover:text-gray-700">
              <i class="fas fa-times text-xl"></i>
            </button>
          </div>
          
          <form @submit.prevent="saveProfile" class="space-y-6">
            <!-- Основная информация -->
            <div class="space-y-4">
              <h3 class="text-xl font-semibold">Основная информация</h3>
              
              <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label for="fullName" class="block text-sm font-medium text-gray-700 mb-1">ФИО</label>
                  <input 
                    type="text" 
                    id="fullName" 
                    v-model="editForm.full_name" 
                    class="w-full p-3 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
                  >
                </div>
                
                <div>
                  <label for="city" class="block text-sm font-medium text-gray-700 mb-1">Город</label>
                  <input 
                    type="text" 
                    id="city" 
                    v-model="editForm.city" 
                    class="w-full p-3 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
                  >
                </div>
              </div>
              
              <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label for="category" class="block text-sm font-medium text-gray-700 mb-1">Категория специалиста</label>
                  <select 
                    id="category" 
                    v-model="editForm.category" 
                    class="w-full p-3 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
                  >
                    <option value="photographer">Фотограф</option>
                    <option value="videographer">Видеограф</option>
                    <option value="florist">Флорист</option>
                    <option value="decorator">Декоратор</option>
                    <option value="makeup_artist">Визажист</option>
                    <option value="hairstylist">Стилист по волосам</option>
                    <option value="venue">Площадка для свадьбы</option>
                    <option value="caterer">Кейтеринг</option>
                    <option value="band">Музыкальная группа</option>
                    <option value="dj">DJ</option>
                    <option value="wedding_planner">Свадебный организатор</option>
                    <option value="master_of_ceremony">Ведущий</option>
                    <option value="cake">Торты и десерты</option>
                    <option value="transport">Транспорт</option>
                    <option value="clothing">Свадебные наряды</option>
                    <option value="accessories">Аксессуары</option>
                    <option value="invitations">Приглашения</option>
                    <option value="other">Другое</option>
                  </select>
                </div>
                
                <div>
                  <label for="experience" class="block text-sm font-medium text-gray-700 mb-1">Опыт работы</label>
                  <input 
                    type="text" 
                    id="experience" 
                    v-model="editForm.experience" 
                    placeholder="Например: 5 лет" 
                    class="w-full p-3 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
                  >
                </div>
              </div>
              
              <div>
                <label for="description" class="block text-sm font-medium text-gray-700 mb-1">О себе</label>
                <textarea 
                  id="description" 
                  v-model="editForm.description" 
                  rows="4" 
                  class="w-full p-3 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
                ></textarea>
              </div>
            </div>
            
            <!-- Контактная информация -->
            <div class="space-y-4">
              <h3 class="text-xl font-semibold">Контактная информация</h3>
              
              <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label for="phone" class="block text-sm font-medium text-gray-700 mb-1">Телефон</label>
                  <input 
                    type="tel" 
                    id="phone" 
                    v-model="editForm.phone" 
                    class="w-full p-3 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
                  >
                </div>
                
                <div>
                  <label for="email" class="block text-sm font-medium text-gray-700 mb-1">Email</label>
                  <input 
                    type="email" 
                    id="email" 
                    v-model="editForm.email" 
                    class="w-full p-3 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
                  >
                </div>
              </div>
              
              <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label for="instagram" class="block text-sm font-medium text-gray-700 mb-1">Instagram</label>
                  <input 
                    type="text" 
                    id="instagram" 
                    v-model="editForm.instagram" 
                    class="w-full p-3 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
                  >
                </div>
                
                <div>
                  <label for="website" class="block text-sm font-medium text-gray-700 mb-1">Веб-сайт</label>
                  <input 
                    type="text" 
                    id="website" 
                    v-model="editForm.website" 
                    class="w-full p-3 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
                  >
                </div>
              </div>
            </div>
            
            <!-- Кнопки действий -->
            <div class="flex justify-end space-x-4 pt-4 border-t border-gray-200">
              <button 
                type="button"
                @click="cancelEditing" 
                class="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
              >
                Отмена
              </button>
              <button 
                type="submit" 
                class="px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
                :disabled="loading"
              >
                <span v-if="loading" class="flex items-center">
                  <svg class="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                    <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Сохранение...
                </span>
                <span v-else>Сохранить</span>
              </button>
            </div>
          </form>
        </div>

      </div>
    </div>
    
    <!-- Модальное окно добавления/редактирования услуги -->
    <div v-if="isServiceModalOpen" class="fixed inset-0 z-50 flex items-center justify-center px-4" style="background-color: #0000009c;">
      <div class="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div class="p-6">
          <div class="flex justify-between items-center mb-6">
            <h3 class="text-xl font-bold">{{ isEditingService ? 'Редактирование услуги' : 'Добавление новой услуги' }}</h3>
            <button @click="closeServiceModal()" class="text-gray-500 hover:text-gray-700">
              <i class="fas fa-times"></i>
            </button>
          </div>
          
          <div v-if="serviceModalError" class="bg-red-50 border border-red-200 text-red-700 p-4 rounded-lg mb-4">
            <div class="flex items-start">
              <i class="fas fa-exclamation-circle text-red-500 mt-1 mr-2"></i>
              <p>{{ serviceModalError }}</p>
            </div>
          </div>
          
          <form @submit.prevent="saveService" class="space-y-4">
            <!-- Название услуги -->
            <div>
              <label for="service-title" class="block text-sm font-medium text-gray-700 mb-1">Название услуги *</label>
              <input 
                id="service-title"
                v-model="serviceForm.title"
                type="text"
                class="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-indigo-500"
                placeholder="Например: Фотосессия Love Story"
                required
              />
            </div>
            
            <!-- Описание услуги -->
            <div>
              <label for="service-description" class="block text-sm font-medium text-gray-700 mb-1">Описание услуги *</label>
              <textarea 
                id="service-description"
                v-model="serviceForm.description"
                rows="4"
                class="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-indigo-500"
                placeholder="Подробное описание услуги..."
                required
              ></textarea>
            </div>
            
            <!-- Цена -->
            <div>
              <label for="service-price" class="block text-sm font-medium text-gray-700 mb-1">Цена (руб.) *</label>
              <input 
                id="service-price"
                v-model="serviceForm.price"
                type="number"
                min="0"
                
                class="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-indigo-500"
                placeholder="5000"
                required
              />
            </div>
            
            <!-- Длительность -->
            <div>
              <label for="service-duration" class="block text-sm font-medium text-gray-700 mb-1">Длительность (минут) *</label>
              <input 
                id="service-duration"
                v-model="serviceForm.duration"
                type="number"
                min="1"
                
                class="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-indigo-500"
                placeholder="120"
                required
              />
            </div>
            
            <!-- Изображение (опционально) -->
            <div>
              <label for="service-image" class="block text-sm font-medium text-gray-700 mb-1">Изображение (опционально)</label>
              <input 
                id="service-image"
                type="file"
                accept="image/*"
                class="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-indigo-500"
                @change="handleImageUpload"
              />
              
              <div v-if="serviceForm.imagePreview" class="mt-2">
                <img :src="serviceForm.imagePreview" alt="Превью" class="max-h-40 rounded" />
              </div>
            </div>
            
            <!-- Кнопки действий -->
            <div class="flex justify-end space-x-3 pt-4">
              <button 
                type="button" 
                @click="closeServiceModal()" 
                class="px-4 py-2 text-gray-700 bg-gray-200 rounded hover:bg-gray-300 transition"
              >
                Отмена
              </button>
              <button 
                type="submit" 
                class="px-4 py-2 text-white bg-indigo-600 rounded hover:bg-indigo-700 transition"
                :disabled="serviceModalLoading"
              >
                <span v-if="serviceModalLoading" class="inline-flex items-center">
                  <i class="fas fa-spinner fa-spin mr-2"></i> Сохранение...
                </span>
                <span v-else>{{ isEditingService ? 'Сохранить изменения' : 'Добавить услугу' }}</span>
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
    
    <!-- Модальное окно подтверждения удаления услуги -->
    <div v-if="isDeleteConfirmOpen" class="fixed inset-0 z-50 flex items-center justify-center px-4" style="background-color: #0000009c;">
      <div class="bg-white rounded-lg max-w-md w-full">
        <div class="p-6">
          <h3 class="text-xl font-bold mb-4">Подтверждение удаления</h3>
          <p class="mb-6">Вы действительно хотите удалить услугу "{{ serviceToDelete?.title }}"?</p>
          
          <div v-if="deleteError" class="bg-red-50 border border-red-200 text-red-700 p-4 rounded-lg mb-4">
            <div class="flex items-start">
              <i class="fas fa-exclamation-circle text-red-500 mt-1 mr-2"></i>
              <p>{{ deleteError }}</p>
            </div>
          </div>
          
          <div class="flex justify-end space-x-3">
            <button 
              @click="cancelDelete()" 
              class="px-4 py-2 text-gray-700 bg-gray-200 rounded hover:bg-gray-300 transition"
            >
              Отмена
            </button>
            <button 
              @click="deleteService()" 
              class="px-4 py-2 text-white bg-red-600 rounded hover:bg-red-700 transition"
              :disabled="deleteLoading"
            >
              <span v-if="deleteLoading" class="inline-flex items-center">
                <i class="fas fa-spinner fa-spin mr-2"></i> Удаление...
              </span>
              <span v-else>Удалить</span>
            </button>
          </div>
        </div>
      </div>
    </div>
      </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted, watch } from 'vue';
import { useAuthStore } from '../stores/auth.js';
import { catalogService } from '../services/apiService.js';
import router from '../router';

// Store
const authStore = useAuthStore();

// Состояние
const specialist = ref(null);
const loading = ref(true);
const error = ref(null);
const isOwnProfile = ref(false);

// Услуги специалиста
const services = ref([]);
const loadingServices = ref(false);
const servicesError = ref(null);

// Модальное окно добавления/редактирования услуги
const isServiceModalOpen = ref(false);
const isEditingService = ref(false);
const serviceModalLoading = ref(false);
const serviceModalError = ref('');
const serviceForm = reactive({
  id: null,
  title: '',
  description: '',
  price: 0,
  duration: 60,
  image: null,
  imagePreview: null,
});

// Модальное окно удаления услуги
const isDeleteConfirmOpen = ref(false);
const serviceToDelete = ref(null);
const deleteLoading = ref(false);
const deleteError = ref('');

// Флаги для редактирования профиля и услуг
const isEditing = ref(false);
const currentService = ref(null);
const editForm = reactive({
  full_name: '',
  city: '',
  experience: '',
  description: '',
  category: '',
  phone: '',
  email: '',
  instagram: '',
  website: ''
});

// Вычисляемые свойства на основе данных пользователя
const specialistData = computed(() => {
  if (!authStore.user) return {};
  
  const user = authStore.user;
  const specialistProfile = user.specialist_profile || {};
  
  return {
    id: user.id,
    full_name: `${user.first_name || ''} ${user.last_name || ''}`.trim() || user.username,
    category: specialistProfile.category || 'specialist',
    city: user.city || 'Не указан',
    rating: specialistProfile.rating || 0,
    reviews_count: specialistProfile.reviews_count || 0,
    experience: specialistProfile.experience || 'Не указан',
    description: specialistProfile.description || '<p>Информация о специалисте отсутствует</p>',
    avatar: user.avatar || null,
    instagram: specialistProfile.instagram || '',
    phone: user.phone || 'Не указан',
    email: user.email || '',
    website: specialistProfile.website || '',
    // Для этих данных пока используем заглушки, так как они скорее всего отсутствуют в API
    specializations: specialistProfile.specializations || [
      'Свадебная фотография', 'Семейная фотография', 'Портретная фотография', 'Love story', 'Репортажная съемка'
    ],
    portfolio: specialistProfile.portfolio || [
      { 
        image: 'https://images.unsplash.com/photo-1519741497674-611481863552?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=500&q=80',
        title: 'Свадьба Анны и Михаила',
        description: 'Июнь 2024'
      },
      { 
        image: 'https://images.unsplash.com/photo-1537633552985-df8429e8048b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=500&q=80',
        title: 'Свадьба Елены и Алексея',
        description: 'Май 2024'
      },
      { 
        image: 'https://images.unsplash.com/photo-1606800052052-a08af7148866?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=500&q=80',
        title: 'Love story Дмитрия и Ольги',
        description: 'Апрель 2024'
      },
      { 
        image: 'https://images.unsplash.com/photo-1583939003579-730e3918a45a?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=500&q=80',
        title: 'Свадьба Натальи и Сергея',
        description: 'Март 2024'
      }
    ],
    reviews: specialistProfile.reviews || [
      {
        author: 'Анна С.',
        date: '2024-05-15',
        rating: 5,
        project_type: 'Свадебная фотосъемка',
        text: 'Алексей - потрясающий фотограф! Он сумел запечатлеть все самые важные и трогательные моменты нашей свадьбы. Работать с ним было очень комфортно, он помогал нам с позированием и давал ценные советы. Фотографии получились просто восхитительными, все наши друзья и родственники в восторге!',
        photos: [
          'https://images.unsplash.com/photo-1583939003579-730e3918a45a?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=100&q=80',
          'https://images.unsplash.com/photo-1537633552985-df8429e8048b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=100&q=80'
        ]
      },
      {
        author: 'Дмитрий И.',
        date: '2024-04-02',
        rating: 4.5,
        project_type: 'Love story',
        text: 'Спасибо большое за чудесную Love story! Фотографии передают все наши эмоции и чувства. Алексей создал непринужденную атмосферу во время съемки, мы чувствовали себя естественно и комфортно. Рекомендую всем, кто хочет получить качественные и эмоциональные фотографии!'
      }
    ],
    services: specialistProfile.services || [
      {
        title: 'Свадебная фотосъемка полного дня',
        price: 60000,
        description: 'Полный день съемки (до 12 часов), от сборов до окончания банкета. Все фотографии в обработке, онлайн-галерея, предварительная встреча.',
        duration: '12 часов'
      },
      {
        title: 'Love story',
        price: 15000,
        description: 'Романтическая фотосессия для пары. Идеально подходит для предсвадебной съемки или просто чтобы запечатлеть ваши чувства.',
        duration: '2 часа'
      },
      {
        title: 'Свадебная фотокнига',
        price: 12000,
        description: 'Профессионально разработанная и напечатанная фотокнига формата 30x30 см, 20 разворотов, премиум-качество.',
        duration: 'Срок изготовления: 2 недели'
      }
    ],
    available_dates: specialistProfile.available_dates || [
      '2024-06-15',
      '2024-06-22',
      '2024-06-29',
      '2024-07-06',
      '2024-07-13',
      '2024-07-20'
    ]
  };
});

// Получаем данные специалиста
const fetchSpecialistProfile = async () => {
  loading.value = true;
  error.value = null;
  
  try {
    // Если пользователь не авторизован или не является специалистом
    if (!authStore.token) {
      error.value = 'Необходимо авторизоваться для просмотра профиля';
      return;
    }
    
    // Проверяем, загружены ли данные пользователя
    if (!authStore.user) {
      await authStore.fetchCurrentUser();
    }
    
    // Устанавливаем данные специалиста из authStore
    specialist.value = specialistData.value;
    
    // Диагностика: выводим полную структуру объекта специалиста
    console.log('Полная структура объекта специалиста:', JSON.stringify(specialist.value, null, 2));
    
    // Выводим все ключи первого уровня для понимания структуры
    console.log('Ключи первого уровня:', Object.keys(specialist.value));
    
    // Если есть поле specialist_profile, выводим его
    if (specialist.value.specialist_profile) {
      console.log('Структура specialist_profile:', specialist.value.specialist_profile);
      console.log('ID профиля специалиста:', specialist.value.specialist_profile.id);
    }
    
    // Проверяем, является ли это профиль текущего пользователя
    if (authStore.isLoggedIn && authStore.isSpecialist && authStore.user && authStore.user.id === specialist.value.id) {
      isOwnProfile.value = true;
    }
    
    // Загрузка услуг специалиста
    await fetchServices();
    
    console.log('Данные профиля специалиста:', specialist.value, 'Собственный профиль:', isOwnProfile.value);
  } catch (err) {
    console.error('Ошибка при загрузке профиля специалиста:', err);
    error.value = 'Не удалось загрузить профиль специалиста';
  } finally {
    loading.value = false;
  }
};

// Моковые данные услуг на случай, если API недоступен
const defaultServices = [
  {
    id: 1,
    title: 'Фотосессия Love Story',
    description: 'Романтичная фотосессия для пары',
    price: 5000,
    duration: 120,
    image: '/img/services/photo1.jpg'
  },
  {
    id: 2,
    title: 'Свадебная фотосессия',
    description: 'Полный день съёмки свадьбы',
    price: 25000,
    duration: 480,
    image: '/img/services/photo2.jpg'
  }
];

// Определение переменной tabs для предотвращения предупреждения
const tabs = ref([
  { name: 'portfolio', label: 'Портфолио' },
  { name: 'reviews', label: 'Отзывы' },
  { name: 'services', label: 'Услуги и цены' },
  { name: 'contact', label: 'Контакты' }
]);

// Загрузка услуг специалиста
// Методы для работы с услугами специалиста
// Открыть модальное окно для добавления новой услуги
const openNewServiceModal = () => {
  // Сбрасываем форму
  serviceForm.id = null;
  serviceForm.title = '';
  serviceForm.description = '';
  serviceForm.price = 0;
  serviceForm.duration = 60;
  serviceForm.image = null;
  serviceForm.imagePreview = null;
  
  // Устанавливаем режим добавления
  isEditingService.value = false;
  serviceModalError.value = '';
  
  // Открываем модальное окно
  isServiceModalOpen.value = true;
};

// Открыть модальное окно для редактирования услуги
const editService = (service) => {
  // Заполняем форму данными услуги
  serviceForm.id = service.id;
  serviceForm.title = service.title;
  serviceForm.description = service.description;
  serviceForm.price = service.price;
  serviceForm.duration = service.duration;
  serviceForm.image = null;
  
  // Если есть изображение, устанавливаем его превью
  if (service.image) {
    serviceForm.imagePreview = service.image.startsWith('http') ? 
      service.image : 
      `${import.meta.env.VITE_API_URL}${service.image}`;
  } else {
    serviceForm.imagePreview = null;
  }
  
  // Устанавливаем режим редактирования
  isEditingService.value = true;
  serviceModalError.value = '';
  
  // Открываем модальное окно
  isServiceModalOpen.value = true;
};

// Сохранить услугу (создание или обновление)
const saveService = async () => {
  try {
    serviceModalLoading.value = true;
    serviceModalError.value = '';
    
    // Подготавливаем данные для отправки
    const serviceData = new FormData();
    serviceData.append('title', serviceForm.title);
    serviceData.append('description', serviceForm.description);
    serviceData.append('price', serviceForm.price);
    serviceData.append('duration', serviceForm.duration);
    
    // Добавляем specialist_id, если это новая услуга
    if (!isEditingService.value) {
      // Определяем ID профиля специалиста
      let specialistProfileId;
      
      if (specialist.value.specialist_profile_id) {
        specialistProfileId = specialist.value.specialist_profile_id;
      } else if (specialist.value.profile && specialist.value.profile.id) {
        specialistProfileId = specialist.value.profile.id;
      } else if (specialist.value.specialist_profile && specialist.value.specialist_profile.id) {
        specialistProfileId = specialist.value.specialist_profile.id;
      } else {
        // Пытаемся получить ID профиля специалиста через API
        try {
          const profileResponse = await catalogService.getSpecialistProfileId(specialist.value.id);
          console.log('Получен ответ от getSpecialistProfileId:', profileResponse);
          
          // Проверяем, что profileResponse не null или undefined
          if (profileResponse) {
            // Если это массив с объектами
            if (Array.isArray(profileResponse) && profileResponse.length > 0) {
              specialistProfileId = profileResponse[0].id;
            }
            // Если это просто ID
            else if (typeof profileResponse === 'number' || typeof profileResponse === 'string') {
              specialistProfileId = profileResponse;
            }
          }
        } catch (err) {
          console.error('Ошибка при получении ID профиля специалиста:', err);
          throw new Error('Не удалось определить ID профиля специалиста');
        }
      }
      
      if (!specialistProfileId) {
        throw new Error('Не удалось определить ID профиля специалиста');
      }
      
      serviceData.append('specialist', specialistProfileId);
    }
    
    // Добавляем изображение, если оно выбрано
    if (serviceForm.image) {
      serviceData.append('image', serviceForm.image);
    }
    
    // Выполняем запрос к API (создание или обновление)
    let response;
    if (isEditingService.value) {
      response = await catalogService.updateService(serviceForm.id, serviceData);
      console.log('Услуга успешно обновлена:', response);
    } else {
      response = await catalogService.createService(serviceData);
      console.log('Новая услуга успешно создана:', response);
    }
    
    // Обновляем список услуг
    await fetchServices();
    
    // Закрываем модальное окно
    closeServiceModal();
    
  } catch (err) {
    console.error('Ошибка при сохранении услуги:', err);
    serviceModalError.value = `Ошибка при ${isEditingService.value ? 'обновлении' : 'создании'} услуги: ${err.message || 'неизвестная ошибка'}`;
  } finally {
    serviceModalLoading.value = false;
  }
};

// Закрыть модальное окно редактирования услуги
const closeServiceModal = () => {
  isServiceModalOpen.value = false;
};

// Открыть модальное окно подтверждения удаления услуги
const confirmDeleteService = (service) => {
  serviceToDelete.value = service;
  deleteError.value = '';
  isDeleteConfirmOpen.value = true;
};

// Удалить услугу
const deleteService = async () => {
  try {
    deleteLoading.value = true;
    deleteError.value = '';
    
    await catalogService.deleteService(serviceToDelete.value.id);
    console.log('Услуга успешно удалена');
    
    // Обновляем список услуг
    await fetchServices();
    
    // Закрываем модальное окно
    cancelDelete();
    
  } catch (err) {
    console.error('Ошибка при удалении услуги:', err);
    deleteError.value = `Ошибка при удалении услуги: ${err.message || 'неизвестная ошибка'}`;
  } finally {
    deleteLoading.value = false;
  }
};

// Отмена удаления услуги
const cancelDelete = () => {
  isDeleteConfirmOpen.value = false;
  serviceToDelete.value = null;
};

// Обработка загрузки изображения
const handleImageUpload = (event) => {
  const file = event.target.files[0];
  if (file) {
    serviceForm.image = file;
    
    // Создаем превью изображения
    const reader = new FileReader();
    reader.onload = (e) => {
      serviceForm.imagePreview = e.target.result;
    };
    reader.readAsDataURL(file);
  }
};

// Загрузка услуг специалиста
const fetchServices = async () => {
  try {
    loadingServices.value = true;
    servicesError.value = null;
    
    // Проверка наличия данных специалиста перед запросом услуг
    if (!specialist.value) {
      console.warn('Данные специалиста недоступны, используем моковые данные');
      services.value = defaultServices;
      return;
    }
    
    // Определяем ID профиля специалиста
    let specialistProfileId;
    
    // Сначала проверяем все возможные пути к ID профиля специалиста
    if (specialist.value.specialist_profile_id) {
      specialistProfileId = specialist.value.specialist_profile_id;
      console.log('ID профиля специалиста получен из specialist_profile_id:', specialistProfileId);
    } else if (specialist.value.profile && specialist.value.profile.id) {
      specialistProfileId = specialist.value.profile.id;
      console.log('ID профиля специалиста получен из profile.id:', specialistProfileId);
    } else if (specialist.value.specialist_profile && specialist.value.specialist_profile.id) {
      specialistProfileId = specialist.value.specialist_profile.id;
      console.log('ID профиля специалиста получен из specialist_profile.id:', specialistProfileId);
    } else {
      // Если не нашли ID в объекте, запрашиваем через API
      try {
        const profileId = await catalogService.getSpecialistProfileId(specialist.value.id);
        console.log('Результат запроса getSpecialistProfileId:', profileId);
        
        // Проверяем все возможные форматы ответа
        if (profileId) {
          // Если это массив с объектами
          if (Array.isArray(profileId) && profileId.length > 0) {
            specialistProfileId = profileId[0].id;
          }
          // Если это просто ID (число или строка)
          else if (typeof profileId === 'number' || typeof profileId === 'string') {
            specialistProfileId = profileId;
          }
          console.log('ID профиля специалиста получен через API:', specialistProfileId);
        }
      } catch (err) {
        console.error('Ошибка при получении ID профиля специалиста через API:', err);
      }
    }
    
    // Если нашли ID профиля специалиста, запрашиваем его услуги
    if (specialistProfileId) {
      try {
        console.log('Запрашиваем услуги специалиста с ID:', specialistProfileId);
        const servicesResponse = await catalogService.getSpecialistServices(specialistProfileId);
        
        if (servicesResponse && Array.isArray(servicesResponse)) {
          console.log('Успешно получены услуги специалиста через API:', servicesResponse);
          services.value = servicesResponse;
          return; // Успешно получили услуги через API
        } else {
          console.warn('Некорректный формат ответа API для услуг:', servicesResponse);
        }
      } catch (err) {
        console.error('Ошибка при запросе услуг специалиста через API:', err);
        servicesError.value = 'Не удалось загрузить услуги с сервера';
      }
    } else {
      console.warn('Не удалось определить ID профиля специалиста для запроса услуг');
    }
    
    // Если не удалось получить услуги через API, используем услуги из объекта специалиста (если есть)
    if (specialist.value.services && specialist.value.services.length > 0) {
      console.log('Используем услуги из объекта специалиста:', specialist.value.services);
      services.value = specialist.value.services;
    } else {
      // Если нет услуг в объекте специалиста, используем моковые данные
      console.log('Используем моковые данные услуг');
      services.value = [];
    }
  } catch (err) {
    console.error('Ошибка при загрузке услуг специалиста:', err);
    servicesError.value = 'Произошла ошибка при загрузке услуг';
    // В случае ошибки показываем пустой список
    services.value = [];
  } finally {
    loadingServices.value = false;
  }
};

// Другие операции CRUD для услуг уже определены выше

// Начать редактирование профиля
const startEditing = () => {
  // Проверяем наличие данных специалиста перед редактированием
  if (!specialist.value) {
    console.error('Невозможно редактировать профиль: данные специалиста не загружены');
    error.value = 'Невозможно редактировать профиль: данные не загружены';
    return;
  }
  
  // Заполняем форму текущими данными
  editForm.full_name = specialist.value.full_name || '';
  editForm.city = specialist.value.city || '';
  editForm.experience = specialist.value.experience || '';
  editForm.description = specialist.value.description || '';
  editForm.category = specialist.value.category || '';
  editForm.phone = specialist.value.phone || '';
  editForm.email = specialist.value.email || '';
  editForm.instagram = specialist.value.instagram || '';
  editForm.website = specialist.value.website || '';
  
  isEditing.value = true;
};

// Сохранить изменения профиля
const saveProfile = async () => {
  error.value = null;
  loading.value = true;
  
  try {
    // Проверяем наличие данных специалиста
    if (!specialist.value) {
      throw new Error('Невозможно сохранить профиль: данные не загружены');
    }
    
    // Формируем данные для отправки на сервер
    const profileData = {
      id: specialist.value.id, // ID пользователя
      full_name: editForm.full_name,
      city: editForm.city,
      experience: editForm.experience,
      description: editForm.description,
      category: editForm.category,
      phone: editForm.phone,
      email: editForm.email,
      instagram: editForm.instagram,
      website: editForm.website
    };
    
    // Если есть ID профиля специалиста, добавляем его
    if (specialist.value.specialist_profile && specialist.value.specialist_profile.id) {
      profileData.specialist_profile_id = specialist.value.specialist_profile.id;
    }
    
    // Отправляем данные на сервер
    console.log('Отправка данных профиля на сервер:', profileData);
    const response = await catalogService.updateSpecialistProfile(profileData);
    console.log('Ответ сервера:', response);
    
    // Обновляем локальные данные
    specialist.value = {
      ...specialist.value,
      full_name: editForm.full_name,
      city: editForm.city,
      experience: editForm.experience,
      description: editForm.description,
      category: editForm.category,
      phone: editForm.phone,
      email: editForm.email,
      instagram: editForm.instagram,
      website: editForm.website
    };
    
    // Выходим из режима редактирования
    isEditing.value = false;
    
    console.log('Профиль обновлен:', specialist.value);
  } catch (err) {
    console.error('Ошибка при сохранении профиля:', err);
    error.value = 'Не удалось сохранить профиль: ' + (err.message || JSON.stringify(err));
  } finally {
    loading.value = false;
  }
};

// Отменить редактирование
const cancelEditing = () => {
  isEditing.value = false;
};

// Загрузка данных при монтировании компонента
onMounted(async () => {
  try {
    loading.value = true;
    await fetchSpecialistProfile();
  } catch (err) {
    console.error('Ошибка при инициализации компонента SpecialistProfileView:', err);
    error.value = 'Не удалось загрузить данные профиля';
  } finally {
    loading.value = false;
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
  const date = new Date(dateString);
  return new Intl.DateTimeFormat('ru-RU', { day: 'numeric', month: 'long', year: 'numeric' }).format(date);
};

const formatDateDay = (dateString) => {
  const date = new Date(dateString);
  return date.getDate();
};

const formatDateMonth = (dateString) => {
  const date = new Date(dateString);
  return new Intl.DateTimeFormat('ru-RU', { month: 'long' }).format(date);
};

const formatPrice = (price) => {
  return new Intl.NumberFormat('ru-RU', { style: 'currency', currency: 'RUB', maximumFractionDigits: 0 }).format(price);
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
