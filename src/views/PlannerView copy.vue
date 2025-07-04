<template>
  <div>
    <!-- Hero Section -->
    <section class="hero-gradient py-16 text-white">
        <div class="container mx-auto px-4">
            <div class="max-w-4xl mx-auto text-center">
                <h1 class="text-4xl md:text-5xl font-bold mb-6">Планировщик свадьбы</h1>
                <p class="text-xl mb-8">Все инструменты для организации идеальной свадьбы в одном месте</p>
                <div class="flex flex-col sm:flex-row justify-center gap-4">
                    <button @click="createNewWedding" class="btn-primary text-white px-8 py-3 rounded-full font-medium flex items-center justify-center">
                        <i class="fas fa-plus-circle mr-2"></i> Создать новую свадьбу
                    </button>
                    <button @click="showExamples" class="bg-white bg-opacity-20 text-black px-8 py-3 rounded-full font-medium hover:bg-opacity-30 transition flex items-center justify-center">
                        <i class="fas fa-book-open mr-2"></i> Примеры планирования
                    </button>
                </div>
            </div>
        </div>
    </section>
    
    <!-- Dashboard Section -->
    <section class="py-12 bg-white">
        <div class="container mx-auto px-4">
            <div class="flex flex-col md:flex-row gap-8">
                <!-- Left sidebar -->
                <div class="md:w-1/4">
                    <div class="bg-gray-50 rounded-xl p-6 sticky top-24">
                        <h3 class="font-bold text-lg mb-4">Мои свадьбы</h3>
                        <ul class="space-y-2">
                            <li>
                                <a href="#" class="flex items-center justify-between p-2 rounded-lg bg-pink-100 text-pink-700">
                                    <span>Наша свадьба</span>
                                    <span class="text-xs bg-pink-500 text-white px-2 py-1 rounded-full">Активная</span>
                                </a>
                            </li>
                            <li>
                                <a href="#" class="flex items-center justify-between p-2 rounded-lg hover:bg-gray-100">
                                    <span>Свадьба сестры</span>
                                    <span class="text-xs bg-gray-200 text-gray-600 px-2 py-1 rounded-full">Завершена</span>
                                </a>
                            </li>
                            <li>
                                <a href="#" class="flex items-center justify-between p-2 rounded-lg hover:bg-gray-100">
                                    <span>Пробная свадьба</span>
                                    <span class="text-xs bg-gray-200 text-gray-600 px-2 py-1 rounded-full">Черновик</span>
                                </a>
                            </li>
                        </ul>
                        
                        <div class="mt-8">
                            <h3 class="font-bold text-lg mb-4">Прогресс</h3>
                            <div class="mb-2">
                                <div class="flex justify-between text-sm mb-1">
                                    <span>Общий прогресс</span>
                                    <span>{{ overallProgress }}%</span>
                                </div>
                                <div class="progress-bar">
                                    <div class="progress-fill" :style="{ width: overallProgress + '%' }"></div>
                                </div>
                            </div>
                            <div class="mb-2">
                                <div class="flex justify-between text-sm mb-1">
                                    <span>Бюджет</span>
                                    <span>{{ budgetProgress }}%</span>
                                </div>
                                <div class="progress-bar">
                                    <div class="progress-fill" :style="{ width: budgetProgress + '%' }"></div>
                                </div>
                            </div>
                            <div class="mb-2">
                                <div class="flex justify-between text-sm mb-1">
                                    <span>Гости</span>
                                    <span>{{ guestsProgress }}%</span>
                                </div>
                                <div class="progress-bar">
                                    <div class="progress-fill" :style="{ width: guestsProgress + '%' }"></div>
                                </div>
                            </div>
                            <div class="mb-2">
                                <div class="flex justify-between text-sm mb-1">
                                    <span>Поставщики</span>
                                    <span>{{ vendorsProgress }}%</span>
                                </div>
                                <div class="progress-bar">
                                    <div class="progress-fill" :style="{ width: vendorsProgress + '%' }"></div>
                                </div>
                            </div>
                        </div>
                        
                        <div class="mt-8">
                            <h3 class="font-bold text-lg mb-4">До свадьбы</h3>
                            <div class="bg-pink-50 border border-pink-100 rounded-lg p-4 text-center">
                                <div class="text-3xl font-bold text-pink-600 mb-1">{{ daysUntilWedding }}</div>
                                <div class="text-sm text-gray-600">дней</div>
                            </div>
                        </div>
                    </div>
                </div>
                
                <!-- Main content -->
                <div class="md:w-3/4">
                    <!-- Tabs -->
                    <div class="border-b border-gray-200 mb-8">
                        <nav class="flex space-x-8">
                            <button 
                                @click="activeTab = 'overview'" 
                                :class="{
                                  'tab-active': activeTab === 'overview',
                                  'text-gray-500 hover:text-gray-700': activeTab !== 'overview'
                                }"
                                class="py-4 px-1 text-sm font-medium">
                                Обзор
                            </button>
                            <button 
                                @click="activeTab = 'tasks'" 
                                :class="{
                                  'tab-active': activeTab === 'tasks',
                                  'text-gray-500 hover:text-gray-700': activeTab !== 'tasks'
                                }"
                                class="py-4 px-1 text-sm font-medium">
                                Чек-листы
                            </button>
                            <button 
                                @click="activeTab = 'budget'" 
                                :class="{
                                  'tab-active': activeTab === 'budget',
                                  'text-gray-500 hover:text-gray-700': activeTab !== 'budget'
                                }"
                                class="py-4 px-1 text-sm font-medium">
                                Бюджет
                            </button>
                            <button 
                                @click="activeTab = 'guests'" 
                                :class="{
                                  'tab-active': activeTab === 'guests',
                                  'text-gray-500 hover:text-gray-700': activeTab !== 'guests'
                                }"
                                class="py-4 px-1 text-sm font-medium">
                                Гости
                            </button>
                            <button 
                                @click="activeTab = 'vendors'" 
                                :class="{
                                  'tab-active': activeTab === 'vendors',
                                  'text-gray-500 hover:text-gray-700': activeTab !== 'vendors'
                                }"
                                class="py-4 px-1 text-sm font-medium">
                                Поставщики
                            </button>
                            <button 
                                @click="activeTab = 'schedule'" 
                                :class="{
                                  'tab-active': activeTab === 'schedule',
                                  'text-gray-500 hover:text-gray-700': activeTab !== 'schedule'
                                }"
                                class="py-4 px-1 text-sm font-medium">
                                Расписание
                            </button>
                        </nav>
                    </div>
                    
                    <!-- Timeline Section -->
                    <div class="bg-white rounded-xl shadow-sm p-6 mb-8">
                        <div class="flex justify-between items-center mb-6">
                            <h2 class="text-2xl font-bold">Этапы планирования</h2>
                            <button class="text-pink-500 hover:text-pink-700 text-sm font-medium flex items-center">
                                <i class="fas fa-edit mr-1"></i> Настроить
                            </button>
                        </div>
                        
                        <div class="space-y-8">
                            <!-- Step 1 -->
                            <div class="timeline-step">
                                <div class="timeline-dot"></div>
                                <div class="bg-gray-50 rounded-lg p-4">
                                    <div class="flex justify-between items-start mb-2">
                                        <h3 class="font-bold text-lg">12-6 месяцев до свадьбы</h3>
                                        <span class="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full">Завершено</span>
                                    </div>
                                    <p class="text-gray-600 mb-3">Основные решения: дата, бюджет, список гостей, место проведения.</p>
                                    <div class="flex flex-wrap gap-2">
                                        <span class="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full">Определена дата</span>
                                        <span class="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full">Выбрано место</span>
                                        <span class="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full">Утвержден бюджет</span>
                                    </div>
                                </div>
                            </div>
                            
                            <!-- Step 2 -->
                            <div class="timeline-step">
                                <div class="timeline-dot"></div>
                                <div class="bg-gray-50 rounded-lg p-4">
                                    <div class="flex justify-between items-start mb-2">
                                        <h3 class="font-bold text-lg">6-3 месяца до свадьбы</h3>
                                        <span class="text-xs bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full">В процессе</span>
                                    </div>
                                    <p class="text-gray-600 mb-3">Бронирование основных поставщиков: фотограф, ведущий, стилист, транспорт.</p>
                                    <div class="flex flex-wrap gap-2">
                                        <span class="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full">Заказаны приглашения</span>
                                        <span class="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full">Выбран фотограф</span>
                                        <span class="text-xs bg-gray-100 text-gray-800 px-2 py-1 rounded-full">Ведущий не выбран</span>
                                        <span class="text-xs bg-gray-100 text-gray-800 px-2 py-1 rounded-full">Транспорт не заказан</span>
                                    </div>
                                </div>
                            </div>
                            
                            <!-- Step 3 -->
                            <div class="timeline-step">
                                <div class="timeline-dot"></div>
                                <div class="bg-gray-50 rounded-lg p-4">
                                    <div class="flex justify-between items-start mb-2">
                                        <h3 class="font-bold text-lg">3-1 месяц до свадьбы</h3>
                                        <span class="text-xs bg-gray-100 text-gray-800 px-2 py-1 rounded-full">Не начато</span>
                                    </div>
                                    <p class="text-gray-600 mb-3">Финальные приготовления: дегустация меню, примерка платья, рассылка приглашений.</p>
                                </div>
                            </div>
                            
                            <!-- Step 4 -->
                            <div class="timeline-step">
                                <div class="timeline-dot"></div>
                                <div class="bg-gray-50 rounded-lg p-4">
                                    <div class="flex justify-between items-start mb-2">
                                        <h3 class="font-bold text-lg">1 месяц - день свадьбы</h3>
                                        <span class="text-xs bg-gray-100 text-gray-800 px-2 py-1 rounded-full">Не начато</span>
                                    </div>
                                    <p class="text-gray-600 mb-3">Последние штрихи: подтверждение с поставщиками, упаковка подарков, подготовка к торжеству.</p>
                                </div>
                            </div>
                        </div>
                    </div>
                    
                    <!-- Checklist Section -->
                    <div v-if="activeTab === 'overview' || activeTab === 'tasks'" class="bg-white rounded-xl shadow-sm p-6 mb-8">
                        <div class="flex justify-between items-center mb-6">
                            <h2 class="text-2xl font-bold">Ближайшие задачи</h2>
                            <button @click="openAddTaskModal" class="text-pink-500 hover:text-pink-700 text-sm font-medium flex items-center">
                                <i class="fas fa-plus-circle mr-1"></i> Добавить задачу
                            </button>
                        </div>
                        
                        <div v-if="isLoading" class="flex justify-center items-center py-8">
                            <div class="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-pink-500"></div>
                        </div>
                        
                        <div v-else-if="error" class="bg-red-50 text-red-500 p-4 rounded-lg">
                            {{ error }}
                        </div>
                        
                        <div v-else>
                            <div v-if="upcomingTasks.length === 0" class="text-center py-10">
                                <div class="text-gray-400 mb-4"><i class="fas fa-clipboard-check text-5xl"></i></div>
                                <p class="text-xl text-gray-600 mb-2">У вас пока нет задач</p>
                                <p class="text-gray-500 mb-4">Добавьте задачи, чтобы начать планирование</p>
                                <button @click="openAddTaskModal" class="btn-primary text-white px-6 py-2 rounded-full text-sm font-medium">
                                    <i class="fas fa-plus mr-1"></i> Добавить первую задачу
                                </button>
                            </div>
                            
                            <ul v-else class="space-y-3">
                                <li v-for="task in upcomingTasks" :key="task.id" class="task-item border border-gray-100 rounded-lg p-4 hover:bg-gray-50 transition flex justify-between items-start">
                                    <div class="flex items-start w-full">
                                        <div class="flex-shrink-0 mr-3">
                                            <button @click="toggleTaskStatus(task)" class="w-6 h-6 rounded-full border-2" :class="{
                                                'border-green-500 bg-green-50': task.is_completed,
                                                'border-gray-300': !task.is_completed
                                            }">
                                                <i v-if="task.is_completed" class="fas fa-check text-green-500 text-xs"></i>
                                            </button>
                                        </div>
                                        <div class="flex-grow">
                                            <div class="flex justify-between">
                                                <div>
                                                    <h4 class="font-medium" :class="{'line-through text-gray-400': task.is_completed}">{{ task.title }}</h4>
                                                    <p class="text-sm text-gray-600 mt-1">{{ task.description }}</p>
                                                </div>
                                                <div class="flex space-x-2 ml-4">
                                                    <button @click="editTask(task)" class="text-gray-400 hover:text-gray-600">
                                                        <i class="fas fa-edit"></i>
                                                    </button>
                                                    <button @click="confirmDeleteTask(task)" class="text-gray-400 hover:text-red-500">
                                                        <i class="fas fa-trash-alt"></i>
                                                    </button>
                                                </div>
                                            </div>
                                            <div class="flex items-center mt-2 text-xs">
                                                <span :class="getPriorityClass(task.priority)" class="px-2 py-1 rounded-full mr-2">
                                                    {{ getPriorityLabel(task.priority) }}
                                                </span>
                                                <span class="text-gray-500 mr-2">
                                                    <i class="far fa-calendar mr-1"></i> {{ formatDate(task.due_date) }}
                                                </span>
                                                <span class="text-gray-500">
                                                    <i class="far fa-folder mr-1"></i> {{ getCategoryLabel(task.category) }}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                </li>
                            </ul>
                            
                            <div v-if="upcomingTasks.length > 0" class="mt-4 text-center">
                                <button @click="activeTab = 'tasks'" class="text-pink-500 hover:text-pink-700 text-sm font-medium">
                                    Посмотреть все задачи <i class="fas fa-arrow-right ml-1"></i>
                                </button>
                            </div>
                        </div>
                        
                        <!-- Модальные окна для работы с задачами -->
                        <div v-if="showAddTaskModal" class="fixed inset-0 bg-gray-800 bg-opacity-75 flex items-center justify-center z-50">
                            <div class="bg-white rounded-xl p-6 w-full max-w-lg mx-4">
                                <h3 class="text-xl font-bold mb-4">{{ taskToEdit ? 'Редактировать задачу' : 'Добавить новую задачу' }}</h3>
                                
                                <div class="space-y-4">
                                    <div>
                                        <label class="block text-sm font-medium text-gray-700 mb-1">Название задачи</label>
                                        <input 
                                            type="text" 
                                            v-model="newTask.title" 
                                            class="w-full p-2 border border-gray-300 rounded-lg focus:ring-pink-500 focus:border-pink-500" 
                                            placeholder="Например: Забронировать фотографа"
                                        >
                                    </div>
                                    <div>
                                        <label class="block text-sm font-medium text-gray-700 mb-1">Описание задачи</label>
                                        <textarea 
                                            v-model="newTask.description" 
                                            class="w-full p-2 border border-gray-300 rounded-lg focus:ring-pink-500 focus:border-pink-500" 
                                            placeholder="Например: Забронировать фотографа на свадьбу"
                                        ></textarea>
                                    </div>
                                    <div>
                                        <label class="block text-sm font-medium text-gray-700 mb-1">Дата завершения</label>
                                        <input 
                                            type="date" 
                                            v-model="newTask.due_date" 
                                            class="w-full p-2 border border-gray-300 rounded-lg focus:ring-pink-500 focus:border-pink-500"
                                        >
                                    </div>
                                    <div>
                                        <label class="block text-sm font-medium text-gray-700 mb-1">Приоритет</label>
                                        <select 
                                            v-model="newTask.priority" 
                                            class="w-full p-2 border border-gray-300 rounded-lg focus:ring-pink-500 focus:border-pink-500"
                                        >
                                            <option value="low">Низкий</option>
                                            <option value="medium">Средний</option>
                                            <option value="high">Высокий</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label class="block text-sm font-medium text-gray-700 mb-1">Категория</label>
                                        <select 
                                            v-model="newTask.category" 
                                            class="w-full p-2 border border-gray-300 rounded-lg focus:ring-pink-500 focus:border-pink-500"
                                        >
                                            <option value="organization">Организация</option>
                                            <option value="photography">Фотография</option>
                                            <option value="music">Музыка</option>
                                            <option value="transportation">Транспорт</option>
                                        </select>
                                    </div>
                                </div>
                                
                                <div class="flex justify-end mt-4">
                                    <button @click="closeTaskModal" class="text-gray-400 hover:text-gray-600 mr-2">
                                        Отмена
                                    </button>
                                    <button @click="saveTask" class="btn-primary text-white px-6 py-2 rounded-full font-medium">
                                        {{ taskToEdit ? 'Сохранить изменения' : 'Добавить задачу' }}
                                    </button>
                                </div>
                            </div>
                        </div>
                        
                        <!-- Модальное окно подтверждения удаления задачи -->
                        <div v-if="showDeleteConfirmation" class="fixed inset-0 bg-gray-800 bg-opacity-75 flex items-center justify-center z-50">
                            <div class="bg-white rounded-xl p-6 w-full max-w-md mx-4">
                                <h3 class="text-xl font-bold mb-4">Удалить задачу</h3>
                                <p class="mb-6">Вы уверены, что хотите удалить задачу "{{ taskToDelete?.title }}"?</p>
                                
                                <div class="flex justify-end space-x-3">
                                    <button @click="cancelDelete" class="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50">Отмена</button>
                                    <button @click="handleTaskDelete" class="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600">Удалить</button>
                                </div>
                            </div>
                        </div>
                    </div>
                    
                    <!-- Budget Overview -->
                    <div v-if="activeTab === 'overview' || activeTab === 'budget'" class="bg-white rounded-xl shadow-sm p-6 mb-8">
                        <div class="flex justify-between items-center mb-6">
                            <h2 class="text-2xl font-bold">Бюджет</h2>
                            <button class="text-pink-500 hover:text-pink-700 text-sm font-medium flex items-center">
                                <i class="fas fa-chart-pie mr-1"></i> Подробнее
                            </button>
                        </div>
                        
                        <div class="grid md:grid-cols-3 gap-4 mb-6">
                            <div class="bg-gray-50 rounded-lg p-4 text-center">
                                <div class="text-sm text-gray-500 mb-1">Общий бюджет</div>
                                <div class="text-2xl font-bold">500 000 ₽</div>
                            </div>
                            <div class="bg-gray-50 rounded-lg p-4 text-center">
                                <div class="text-sm text-gray-500 mb-1">Потрачено</div>
                                <div class="text-2xl font-bold">185 000 ₽</div>
                            </div>
                            <div class="bg-gray-50 rounded-lg p-4 text-center">
                                <div class="text-sm text-gray-500 mb-1">Осталось</div>
                                <div class="text-2xl font-bold">315 000 ₽</div>
                            </div>
                        </div>
                        
                        <div class="space-y-4">
                            <!-- Category 1 -->
                            <div>
                                <div class="flex justify-between mb-1">
                                    <span class="text-sm font-medium">Место проведения</span>
                                    <span class="text-sm">75 000 / 100 000 ₽</span>
                                </div>
                                <div class="progress-bar">
                                    <div class="progress-fill" style="width: 75%"></div>
                                </div>
                            </div>
                            
                            <!-- Category 2 -->
                            <div>
                                <div class="flex justify-between mb-1">
                                    <span class="text-sm font-medium">Фотограф и видео</span>
                                    <span class="text-sm">50 000 / 60 000 ₽</span>
                                </div>
                                <div class="progress-bar">
                                    <div class="progress-fill" style="width: 83%"></div>
                                </div>
                            </div>
                            
                            <!-- Category 3 -->
                            <div>
                                <div class="flex justify-between mb-1">
                                    <span class="text-sm font-medium">Платье и костюм</span>
                                    <span class="text-sm">60 000 / 80 000 ₽</span>
                                </div>
                                <div class="progress-bar">
                                    <div class="progress-fill" style="width: 75%"></div>
                                </div>
                            </div>
                            
                            <!-- Category 4 -->
                            <div>
                                <div class="flex justify-between mb-1">
                                    <span class="text-sm font-medium">Кольца</span>
                                    <span class="text-sm">0 / 40 000 ₽</span>
                                </div>
                                <div class="progress-bar">
                                    <div class="progress-fill" style="width: 0%"></div>
                                </div>
                            </div>
                        </div>
                    </div>
                    
                    <!-- Guests Section -->  
                    <div v-if="activeTab === 'overview' || activeTab === 'guests'" class="bg-white rounded-xl shadow-sm p-6 mb-8">
                        <div class="flex justify-between items-center mb-6">
                            <h2 class="text-2xl font-bold">Гости</h2>
                            <button @click="openAddGuestModal" class="text-pink-500 hover:text-pink-700 text-sm font-medium flex items-center">
                                <i class="fas fa-plus-circle mr-1"></i> Добавить гостя
                            </button>
                        </div>
                        
                        <div v-if="guests.length === 0" class="text-center py-10">
                            <div class="text-gray-400 mb-4"><i class="fas fa-users text-5xl"></i></div>
                            <p class="text-xl text-gray-600 mb-2">Список гостей пуст</p>
                            <p class="text-gray-500 mb-4">Добавьте гостей, чтобы отслеживать приглашения и ответы</p>
                            <button @click="openAddGuestModal" class="btn-primary text-white px-6 py-2 rounded-full font-medium">
                                <i class="fas fa-plus mr-1"></i> Добавить гостя
                            </button>
                        </div>
                        
                        <div v-else>
                            <div class="flex justify-between items-center mb-4">
                                <div class="flex items-center">
                                    <span class="text-gray-600 mr-4">Всего гостей: <strong>{{ guests.length }}</strong></span>
                                    <span class="text-green-600 mr-4">Подтвердили: <strong>{{ confirmedGuests }}</strong></span>
                                    <span class="text-red-600">Отказались: <strong>{{ declinedGuests }}</strong></span>
                                </div>
                                <div class="flex items-center">
                                    <input type="text" v-model="guestSearch" placeholder="Поиск гостей..." class="border border-gray-300 rounded-lg px-3 py-2 text-sm w-64">
                                </div>
                            </div>
                            
                            <div class="overflow-x-auto">
                                <table class="min-w-full bg-white">
                                    <thead>
                                        <tr class="bg-gray-50 text-gray-600 uppercase text-xs">
                                            <th class="py-3 px-4 text-left">Имя</th>
                                            <th class="py-3 px-4 text-left">Статус</th>
                                            <th class="py-3 px-4 text-left">Группа</th>
                                            <th class="py-3 px-4 text-left">Телефон</th>
                                            <th class="py-3 px-4 text-left">Действия</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr v-for="guest in searchFilteredGuests" :key="guest.id" class="border-b border-gray-100">
                                            <td class="py-3 px-4">{{ guest.name }}</td>
                                            <td class="py-3 px-4">
                                                <span :class="{
                                                    'bg-green-100 text-green-800': guest.status === 'confirmed',
                                                    'bg-yellow-100 text-yellow-800': guest.status === 'pending',
                                                    'bg-red-100 text-red-800': guest.status === 'declined'
                                                }" class="px-2 py-1 rounded-full text-xs">
                                                    {{ getStatusLabel(guest.status) }}
                                                </span>
                                            </td>
                                            <td class="py-3 px-4">{{ guest.group }}</td>
                                            <td class="py-3 px-4">{{ guest.phone || '-' }}</td>
                                            <td class="py-3 px-4">
                                                <button @click="editGuest(guest)" class="text-blue-500 hover:text-blue-700 mr-2">
                                                    <i class="fas fa-edit"></i>
                                                </button>
                                                <button @click="confirmDeleteGuest(guest)" class="text-red-500 hover:text-red-700">
                                                    <i class="fas fa-trash"></i>
                                                </button>
                                            </td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                        </div>
                        
                        <!-- Модальное окно подтверждения удаления гостя -->
                        <div v-if="showDeleteGuestConfirmation" class="fixed inset-0 bg-gray-800 bg-opacity-75 flex items-center justify-center z-50">
                            <div class="bg-white rounded-xl p-6 w-full max-w-md mx-4">
                                <h3 class="text-xl font-bold mb-4">Удалить гостя</h3>
                                <p class="mb-6">Вы уверены, что хотите удалить гостя "{{ guestToDelete?.name }}"?</p>
                                
                                <div class="flex justify-end space-x-3">
                                    <button @click="cancelDeleteGuest" class="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50">Отмена</button>
                                    <button @click="handleGuestDelete" class="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600">Удалить</button>
                                </div>
                            </div>
                        </div>
                        
                        <!-- Модальное окно для добавления/редактирования гостя -->
                        <div v-if="showAddGuestModal" class="fixed inset-0 bg-gray-800 bg-opacity-75 flex items-center justify-center z-50">
                            <div class="bg-white rounded-xl p-6 w-full max-w-lg mx-4">
                                <h3 class="text-xl font-bold mb-4">{{ guestToEdit ? 'Редактировать гостя' : 'Добавить гостя' }}</h3>
                                
                                <div class="space-y-4">
                                    <div>
                                        <label class="block text-gray-700 text-sm font-medium mb-2">Имя и фамилия*</label>
                                        <input v-model="newGuest.name" type="text" class="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-pink-500" placeholder="Имя и фамилия гостя">
                                    </div>
                                    
                                    <div>
                                        <label class="block text-gray-700 text-sm font-medium mb-2">Статус</label>
                                        <select v-model="newGuest.status" class="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-pink-500">
                                            <option value="pending">Ожидается ответ</option>
                                            <option value="confirmed">Подтвердил</option>
                                            <option value="declined">Отказался</option>
                                        </select>
                                    </div>
                                    
                                    <div>
                                        <label class="block text-gray-700 text-sm font-medium mb-2">Группа</label>
                                        <select v-model="newGuest.group" class="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-pink-500">
                                            <option value="family">Семья</option>
                                            <option value="friends">Друзья</option>
                                            <option value="colleagues">Коллеги</option>
                                            <option value="relatives">Родственники</option>
                                        </select>
                                    </div>
                                    
                                    <div>
                                        <label class="block text-gray-700 text-sm font-medium mb-2">Телефон</label>
                                        <input v-model="newGuest.phone" type="text" class="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-pink-500" placeholder="Номер телефона">
                                    </div>
                                    
                                    <div>
                                        <label class="block text-gray-700 text-sm font-medium mb-2">Email</label>
                                        <input v-model="newGuest.email" type="email" class="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-pink-500" placeholder="Email гостя">
                                    </div>
                                </div>
                                
                                <div class="flex justify-end mt-4">
                                    <button @click="closeGuestModal" class="text-gray-400 hover:text-gray-600 mr-2">
                                        Отмена
                                    </button>
                                    <button @click="saveGuest" class="btn-primary text-white px-6 py-2 rounded-full font-medium">
                                        {{ guestToEdit ? 'Сохранить изменения' : 'Добавить гостя' }}
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                    
                    <!-- Vendors Section -->
                    <div v-if="activeTab === 'overview' || activeTab === 'vendors'" class="bg-white rounded-xl shadow-sm p-6 mb-8">
                        <div class="flex justify-between items-center mb-6">
                            <h2 class="text-2xl font-bold">Поставщики</h2>
                            <button class="text-pink-500 hover:text-pink-700 text-sm font-medium flex items-center">
                                <i class="fas fa-search mr-1"></i> Найти поставщиков
                            </button>
                        </div>
                        
                        <div class="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                            <!-- Vendor 1 -->
                            <div class="vendor-card bg-gray-50 rounded-lg p-4 border border-gray-100 transition">
                                <div class="flex items-center mb-3">
                                    <div class="w-12 h-12 rounded-full bg-pink-100 flex items-center justify-center text-pink-500 mr-3">
                                        <i class="fas fa-camera-retro text-xl"></i>
                                    </div>
                                    <div>
                                        <h3 class="font-bold">Иван Петров</h3>
                                        <p class="text-sm text-gray-500">Фотограф</p>
                                    </div>
                                </div>
                                <div class="text-sm text-gray-600 mb-3">Забронирован на 15.12.2023. Предоплата внесена.</div>
                                <div class="flex justify-between items-center">
                                    <span class="text-sm font-medium">50 000 ₽</span>
                                    <span class="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full">Подтвержден</span>
                                </div>
                            </div>
                            
                            <!-- Vendor 2 -->
                            <div class="vendor-card bg-gray-50 rounded-lg p-4 border border-gray-100 transition">
                                <div class="flex items-center mb-3">
                                    <div class="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center text-blue-500 mr-3">
                                        <i class="fas fa-utensils text-xl"></i>
                                    </div>
                                    <div>
                                        <h3 class="font-bold">Ресторан "Лебедь"</h3>
                                        <p class="text-sm text-gray-500">Место проведения</p>
                                    </div>
                                </div>
                                <div class="text-sm text-gray-600 mb-3">Забронирован зал на 50 человек. Депозит внесен.</div>
                                <div class="flex justify-between items-center">
                                    <span class="text-sm font-medium">75 000 ₽</span>
                                    <span class="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full">Подтвержден</span>
                                </div>
                            </div>
                            
                            <!-- Vendor 3 -->
                            <div class="vendor-card bg-gray-50 rounded-lg p-4 border border-gray-100 transition">
                                <div class="flex items-center mb-3">
                                    <div class="w-12 h-12 rounded-full bg-yellow-100 flex items-center justify-center text-yellow-500 mr-3">
                                        <i class="fas fa-ring text-xl"></i>
                                    </div>
                                    <div>
                                        <h3 class="font-bold">Ателье "Невеста"</h3>
                                        <p class="text-sm text-gray-500">Платье</p>
                                    </div>
                                </div>
                                <div class="text-sm text-gray-600 mb-3">Платье выбрано, требуется примерка в сентябре.</div>
                                <div class="flex justify-between items-center">
                                    <span class="text-sm font-medium">60 000 ₽</span>
                                    <span class="text-xs bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full">В процессе</span>
                                </div>
                            </div>
                            
                            <!-- Vendor 4 -->
                            <div class="vendor-card bg-gray-50 rounded-lg p-4 border border-gray-100 transition">
                                <div class="flex items-center mb-3">
                                    <div class="w-12 h-12 rounded-full bg-purple-100 flex items-center justify-center text-purple-500 mr-3">
                                        <i class="fas fa-music text-xl"></i>
                                    </div>
                                    <div>
                                        <h3 class="font-bold">Алексей Семенов</h3>
                                        <p class="text-sm text-gray-500">Ведущий</p>
                                    </div>
                                </div>
                                <div class="text-sm text-gray-600 mb-3">На рассмотрении 3 кандидатуры, требуется встреча.</div>
                                <div class="flex justify-between items-center">
                                    <span class="text-sm font-medium">30 000 ₽</span>
                                    <span class="text-xs bg-red-100 text-red-800 px-2 py-1 rounded-full">Не выбран</span>
                                </div>
                            </div>
                            
                            <!-- Vendor 5 -->
                            <div class="vendor-card bg-gray-50 rounded-lg p-4 border border-gray-100 transition">
                                <div class="flex items-center mb-3">
                                    <div class="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center text-green-500 mr-3">
                                        <i class="fas fa-car text-xl"></i>
                                    </div>
                                    <div>
                                        <h3 class="font-bold">Автопарк "Престиж"</h3>
                                        <p class="text-sm text-gray-500">Транспорт</p>
                                    </div>
                                </div>
                                <div class="text-sm text-gray-600 mb-3">Требуется выбрать автомобиль для молодоженов.</div>
                                <div class="flex justify-between items-center">
                                    <span class="text-sm font-medium">20 000 ₽</span>
                                    <span class="text-xs bg-red-100 text-red-800 px-2 py-1 rounded-full">Не выбран</span>
                                </div>
                            </div>
                            
                            <!-- Vendor 6 -->
                            <div class="vendor-card bg-gray-50 rounded-lg p-4 border border-gray-100 transition">
                                <div class="flex items-center mb-3">
                                    <div class="w-12 h-12 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-500 mr-3">
                                        <i class="fas fa-birthday-cake text-xl"></i>
                                    </div>
                                    <div>
                                        <h3 class="font-bold">Кондитерская "Сласть"</h3>
                                        <p class="text-sm text-gray-500">Торт</p>
                                    </div>
                                </div>
                                <div class="text-sm text-gray-600 mb-3">Необходимо определиться с дизайном и вкусами.</div>
                                <div class="flex justify-between items-center">
                                    <span class="text-sm font-medium">15 000 ₽</span>
                                    <span class="text-xs bg-red-100 text-red-800 px-2 py-1 rounded-full">Не выбран</span>
                                </div>
                            </div>
                        </div>
                        
                        <div class="mt-6 text-center">
                            <button class="btn-primary text-white px-6 py-2 rounded-full font-medium">
                                <i class="fas fa-plus mr-1"></i> Добавить поставщика
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </section>

    <!-- Tips Section -->
    <section class="py-12 bg-gray-50">
        <div class="container mx-auto px-4">
            <div class="text-center mb-12">
                <h2 class="text-3xl font-bold mb-4">Советы по планированию</h2>
                <p class="text-gray-600 max-w-2xl mx-auto">Рекомендации, которые помогут вам в организации свадьбы</p>
            </div>
            
            <div class="grid md:grid-cols-3 gap-8">
                <!-- Tip 1 -->
                <div class="bg-white rounded-xl shadow-sm overflow-hidden">
                    <div class="h-40 bg-pink-100 flex items-center justify-center text-pink-500">
                        <i class="fas fa-wallet text-5xl"></i>
                    </div>
                    <div class="p-6">
                        <h3 class="font-bold text-xl mb-3">Как распределить бюджет</h3>
                        <p class="text-gray-600 mb-4">Оптимальное распределение средств по категориям: какие статьи расходов самые важные.</p>
                        <a href="#" class="text-pink-500 font-medium text-sm flex items-center">
                            Читать статью <i class="fas fa-chevron-right ml-1 text-xs"></i>
                        </a>
                    </div>
                </div>
                
                <!-- Tip 2 -->
                <div class="bg-white rounded-xl shadow-sm overflow-hidden">
                    <div class="h-40 bg-blue-100 flex items-center justify-center text-blue-500">
                        <i class="fas fa-users text-5xl"></i>
                    </div>
                    <div class="p-6">
                        <h3 class="font-bold text-xl mb-3">Как составить список гостей</h3>
                        <p class="text-gray-600 mb-4">Практические советы по формированию гостевого списка без обид и конфликтов.</p>
                        <a href="#" class="text-pink-500 font-medium text-sm flex items-center">
                            Читать статью <i class="fas fa-chevron-right ml-1 text-xs"></i>
                        </a>
                    </div>
                </div>
                
                <!-- Tip 3 -->
                <div class="bg-white rounded-xl shadow-sm overflow-hidden">
                    <div class="h-40 bg-yellow-100 flex items-center justify-center text-yellow-500">
                        <i class="fas fa-handshake text-5xl"></i>
                    </div>
                    <div class="p-6">
                        <h3 class="font-bold text-xl mb-3">Как работать с поставщиками</h3>
                        <p class="text-gray-600 mb-4">Что спросить у фотографа, ведущего и других подрядчиков перед подписанием договора.</p>
                        <a href="#" class="text-pink-500 font-medium text-sm flex items-center">
                            Читать статью <i class="fas fa-chevron-right ml-1 text-xs"></i>
                        </a>
                    </div>
                </div>
            </div>
        </div>
    </section>

    <!-- CTA Section -->
    <section class="py-16 bg-white">
        <div class="container mx-auto px-4">
            <div class="max-w-4xl mx-auto bg-pink-50 rounded-2xl p-8 md:p-12 text-center">
                <h2 class="text-3xl font-bold mb-4">Начните планировать свадьбу прямо сейчас</h2>
                <p class="text-gray-600 mb-8 max-w-2xl mx-auto">Создайте свой свадебный проект и получите доступ ко всем инструментам планирования</p>
                <div class="flex flex-col sm:flex-row justify-center gap-4">
                    <button class="btn-primary text-white px-8 py-3 rounded-full font-medium">
                        Создать свадьбу <i class="fas fa-arrow-right ml-2"></i>
                    </button>
                    <button class="bg-white text-pink-500 border border-pink-500 px-8 py-3 rounded-full font-medium hover:bg-pink-50 transition">
                        Посмотреть пример
                    </button>
                </div>
            </div>
        </div>
    </section>
    
    <!-- Modals will be implemented separately -->
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue';
import { useRouter } from 'vue-router';
import { storeToRefs } from 'pinia';
import { usePlannerStore } from '@/stores/planner';
import { useAuthStore } from '@/stores/auth';

const router = useRouter();
const plannerStore = usePlannerStore();
const authStore = useAuthStore();

// Check authentication
const { isLoggedIn } = storeToRefs(authStore);

// Get reactive state from the store
const { 
  tasks, 
  budget, 
  guests, 
  isLoading, 
  error,
  taskFilters,
  filteredTasks,
  filteredGuests,
  totalGuests,
  confirmedGuests,
  declinedGuests,
  weddingDate,
  pendingGuests,
  budgetStats
} = storeToRefs(plannerStore);

// UI state
const activeTab = ref('tasks');
const showAddTaskModal = ref(false);
const showAddBudgetItemModal = ref(false);
const showAddGuestModal = ref(false);
const showAddVendorModal = ref(false);
const taskToEdit = ref(null);
const budgetItemToEdit = ref(null);
const guestToEdit = ref(null);
const vendorToEdit = ref(null);

// Расчет прогресса
const overallProgress = computed(() => {
  // Логика расчета общего прогресса на основе доступных прогрессов
  let total = 0;
  let count = 0;
  
  // Добавляем каждый тип прогресса, если он доступен
  if (typeof tasksProgress.value === 'number') {
    total += tasksProgress.value;
    count++;
  }
  
  if (typeof budgetProgress.value === 'number') {
    total += budgetProgress.value;
    count++;
  }
  
  if (typeof guestsProgress.value === 'number') {
    total += guestsProgress.value;
    count++;
  }
  
  if (typeof vendorsProgress.value === 'number') {
    total += vendorsProgress.value;
    count++;
  }
  
  return count > 0 ? Math.round(total / count) : 0;
});

const budgetProgress = computed(() => {
  if (!budget.value || !budget.value.total || budget.value.total === 0) return 0;
  const totalBudget = budget.value.total;
  const allocatedBudget = budget.value.items ? budget.value.items.reduce((sum, item) => sum + (item.amount || 0), 0) : 0;
  return Math.min(Math.round((allocatedBudget / totalBudget) * 100), 100);
});

const guestsProgress = computed(() => {
  if (!totalGuests.value || totalGuests.value === 0) return 0;
  const respondedGuests = (confirmedGuests.value || 0) + (declinedGuests.value || 0);
  return Math.round((respondedGuests / totalGuests.value) * 100);
});

const vendorsProgress = computed(() => {
  // Добавляем проверку на существование vendors
  try {
    // Если vendors не определено в store, используем фиксированное значение
    return 50; // Временное значение, пока не реализована работа с поставщиками
  } catch (error) {
    console.error('Ошибка при расчете прогресса поставщиков:', error);
    return 0;
  }
});

// Расчет дней до свадьбы
const daysUntilWedding = computed(() => {
  try {
    // Проверяем, что weddingDate существует
    if (!weddingDate || !weddingDate.value) {
      // Если дата свадьбы не определена, возвращаем временное значение
      return 120; // Фиксированное значение, пока не реализована дата свадьбы
    }
    
    const today = new Date();
    const wedding = new Date(weddingDate.value);
    const diffTime = wedding - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    return diffDays > 0 ? diffDays : 0;
  } catch (error) {
    console.error('Ошибка при расчете дней до свадьбы:', error);
    return 120; // Фиксированное значение при ошибке
  }
});

// Ближайшие задачи для отображения
const upcomingTasks = computed(() => {
  if (!filteredTasks.value) return [];
  
  return filteredTasks.value
    .filter(task => !task.is_completed)
    .sort((a, b) => new Date(a.due_date) - new Date(b.due_date))
    .slice(0, 5); // Показываем 5 ближайших задач
});

// Computed values
const totalTasks = computed(() => tasks.value.length);
const completedTasks = computed(() => tasks.value.filter(t => t.is_completed).length);
const tasksProgress = computed(() => {
  if (totalTasks.value === 0) return 0;
  return Math.round((completedTasks.value / totalTasks.value) * 100);
});

// Tabs configuration
const tabs = [
  { id: 'tasks', label: 'Задачи', icon: 'fa-tasks' },
  { id: 'budget', label: 'Бюджет', icon: 'fa-money-bill-wave' },
  { id: 'guests', label: 'Гости', icon: 'fa-user-friends' }
];

// Format helpers
const formatCurrency = (value) => {
  return new Intl.NumberFormat('ru-RU', { 
    style: 'currency', 
    currency: 'RUB',
    maximumFractionDigits: 0 
  }).format(value || 0);
};

const formatDate = (dateString) => {
  const date = new Date(dateString);
  return new Intl.DateTimeFormat('ru-RU', { 
    day: 'numeric', 
    month: 'long', 
    year: 'numeric' 
  }).format(date);
};

const getPriorityLabel = (priority) => {
  const labels = {
    high: 'Высокий',
    medium: 'Средний',
    low: 'Низкий'
  };
  return labels[priority] || priority;
};

const getCategoryLabel = (category) => {
  const labels = {
    venue: 'Площадка',
    catering: 'Кейтеринг',
    decor: 'Декор',
    attire: 'Наряды',
    photo: 'Фото/Видео',
    music: 'Музыка',
    beauty: 'Красота',
    transportation: 'Транспорт',
    other: 'Другое'
  };
  return labels[category] || category;
};

// Классы для приоритетов
function getPriorityClass(priority) {
  switch (priority) {
    case 'high':
      return 'text-red-500';
    case 'medium':
      return 'text-yellow-500';
    case 'low':
      return 'text-green-500';
    default:
      return 'text-gray-500';
  }
}

// Функции для работы с задачами
function toggleTaskStatus(task) {
  // Используем toggleTaskCompletion из планировщика
  toggleTaskCompletion(task.id);
}

// Methods from store
const { 
  initializePlanner,
  fetchTasks,
  toggleTaskCompletion,
  deleteTask,
  updateTaskFilters,
  resetTaskFilters,
  deleteBudgetItem,
  deleteGuest
} = plannerStore;

// UI handlers
const editTask = (task) => {
  taskToEdit.value = task;
  showAddTaskModal.value = true;
};

const editBudgetItem = (item) => {
  budgetItemToEdit.value = item;
  showAddBudgetItemModal.value = true;
};

const editGuest = (guest) => {
  guestToEdit.value = guest;
  showAddGuestModal.value = true;
};

// UI state для модальных окон
const showDeleteConfirmation = ref(false);
const taskToDelete = ref(null);
const newTask = ref({
  title: '',
  description: '',
  due_date: '',
  priority: 'medium',
  category: 'general',
  is_completed: false
});

const guestSearch = ref('');
const showDeleteGuestConfirmation = ref(false);
const guestToDelete = ref(null);
const newGuest = ref({
  name: '',
  status: 'pending',
  group: 'family',
  phone: '',
  email: ''
});

// Используем поиск по списку гостей
const searchFilteredGuests = computed(() => {
  if (!guestSearch.value) return guests.value;
  const searchTerm = guestSearch.value.toLowerCase();
  return guests.value.filter(guest => 
    guest.name.toLowerCase().includes(searchTerm) ||
    guest.group.toLowerCase().includes(searchTerm)
  );
});

// Методы для работы с задачами
const openAddTaskModal = () => {
  // Сбрасываем форму
  newTask.value = {
    title: '',
    description: '',
    due_date: new Date().toISOString().slice(0, 10),
    priority: 'medium',
    category: 'other',
    is_completed: false
  };
  taskToEdit.value = null;
  showAddTaskModal.value = true;
};

const closeTaskModal = () => {
  showAddTaskModal.value = false;
  taskToEdit.value = null;
};

const saveTask = async () => {
  try {
    if (!newTask.value.title.trim()) {
      alert('Пожалуйста, введите название задачи');
      return;
    }
    
    if (taskToEdit.value) {
      // Обновляем существующую задачу
      await plannerStore.updateTask(taskToEdit.value.id, { ...newTask.value });
    } else {
      // Создаем новую задачу
      await plannerStore.createTask({ ...newTask.value });
    }
    
    closeTaskModal();
  } catch (error) {
    console.error('Ошибка при сохранении задачи:', error);
  }
};

const confirmDeleteTask = (task) => {
  taskToDelete.value = task;
  showDeleteConfirmation.value = true;
};

const cancelDelete = () => {
  showDeleteConfirmation.value = false;
  taskToDelete.value = null;
};

const handleTaskDelete = async () => {
  if (!taskToDelete.value) return;
  
  try {
    await deleteTask(taskToDelete.value.id);
    showDeleteConfirmation.value = false;
    taskToDelete.value = null;
  } catch (error) {
    console.error('Ошибка при удалении задачи:', error);
  }
};

// Методы для работы с гостями
const getStatusLabel = (status) => {
  const statusMap = {
    'confirmed': 'Подтвердил',
    'pending': 'Ожидается ответ',
    'declined': 'Отказался'
  };
  return statusMap[status] || status;
};

const openAddGuestModal = () => {
  // Сбрасываем форму
  newGuest.value = {
    name: '',
    status: 'pending',
    group: 'family',
    phone: '',
    email: ''
  };
  guestToEdit.value = null;
  showAddGuestModal.value = true;
};

const closeGuestModal = () => {
  showAddGuestModal.value = false;
};

const saveGuest = () => {
  // Валидация
  if (!newGuest.value.name.trim()) {
    alert('Имя гостя обязательно');
    return;
  }

  if (guestToEdit.value) {
    // Обновление существующего гостя
    const index = guests.value.findIndex(g => g.id === guestToEdit.value.id);
    if (index !== -1) {
      guests.value[index] = { ...guestToEdit.value, ...newGuest.value };
    }
  } else {
    // Добавление нового гостя
    guests.value.push({
      id: Date.now(), // Временный ID
      ...newGuest.value
    });
  }

  closeGuestModal();
};

const confirmDeleteGuest = (guest) => {
  guestToDelete.value = guest;
  showDeleteGuestConfirmation.value = true;
};

const cancelDeleteGuest = () => {
  guestToDelete.value = null;
  showDeleteGuestConfirmation.value = false;
};

const handleGuestDelete = async () => {
  if (guestToDelete.value) {
    try {
      await deleteGuest(guestToDelete.value.id);
      cancelDeleteGuest();
    } catch (error) {
      console.error('Ошибка при удалении гостя:', error);
    }
  }
};

// Методы для создания свадьбы и просмотра примеров
const createNewWedding = () => {
  console.log('Создание новой свадьбы');
  // TODO: Реализовать создание новой свадьбы
};

const showExamples = () => {
  console.log('Показать примеры');
  // TODO: Реализовать просмотр примеров
};  

// Инициализация данных
const loadSampleData = () => {
  // Загружаем примеры гостей для демонстрации
  guests.value = [
    { id: 1, name: 'Иван Иванов', status: 'confirmed', group: 'family', phone: '+7 999 123-45-67', email: 'ivan@example.com' },
    { id: 2, name: 'Мария Петрова', status: 'confirmed', group: 'family', phone: '+7 999 765-43-21', email: 'maria@example.com' },
    { id: 3, name: 'Алексей Сидоров', status: 'pending', group: 'friends', phone: '+7 999 111-22-33', email: 'alex@example.com' },
    { id: 4, name: 'Екатерина Смирнова', status: 'declined', group: 'colleagues', phone: '+7 999 444-55-66', email: 'kate@example.com' },
  ];
};

// Инициализация планировщика
onMounted(async () => {
  if (isLoggedIn.value) {
    // Загрузка данных пользователя
    await initializePlanner();
    
    // Загрузка задач
    await fetchTasks();
    
    // Загрузка тестовых данных пока нет API
    loadSampleData();
  }
});

// Проверка аутентификации и перенаправление
watch(isLoggedIn, (loggedIn) => {
  if (!loggedIn) {
    router.push({ name: 'login', query: { redirect: 'planner' } });
  }
});

// Initialize data on mount
onMounted(async () => {
  if (!isLoggedIn.value) {
    router.push({ name: 'login', query: { redirect: 'planner' } });
    return;
  }
  
  await initializePlanner();
});
</script>

<style scoped>
body {
            font-family: 'Open Sans', sans-serif;
            background-color: #f7f7f7;
        }
        h1, h2, h3, h4 {
            font-family: 'Montserrat', sans-serif;
        }
        button {
            cursor: pointer;
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
        .timeline-step {
            position: relative;
            padding-left: 3rem;
        }
        .timeline-step:before {
            content: '';
            position: absolute;
            left: 1.5rem;
            top: 0;
            height: 100%;
            width: 2px;
            background-color: #FF6B8B;
        }
        .timeline-step:last-child:before {
            height: 50%;
        }
        .timeline-dot {
            position: absolute;
            left: 1.25rem;
            top: 0.25rem;
            width: 0.5rem;
            height: 0.5rem;
            border-radius: 50%;
            background-color: #FF6B8B;
        }
        .progress-bar {
            height: 0.5rem;
            background-color: #E5E7EB;
            border-radius: 0.25rem;
        }
        .progress-fill {
            height: 100%;
            border-radius: 0.25rem;
            background-color: #FF6B8B;
            transition: width 0.5s ease;
        }
        .checklist-item:hover {
            background-color: #F9FAFB;
        }
        .checklist-item.completed {
            background-color: #F0FDF4;
        }
        .checklist-item.completed .checklist-text {
            text-decoration: line-through;
            color: #9CA3AF;
        }
        .budget-category:hover {
            transform: translateY(-3px);
            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
        }
        .vendor-card:hover {
            transform: translateY(-5px);
            box-shadow: 0 10px 15px rgba(0, 0, 0, 0.1);
        }
        .tab-active {
            border-bottom: 3px solid #FF6B8B;
            color: #FF6B8B;
            font-weight: 600;
        }
</style>
