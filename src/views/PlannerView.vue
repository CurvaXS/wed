<template>
  <div class="container mx-auto px-4 py-8 max-w-7xl">
    <!-- Навигация по секциям планировщика -->
    <div class="hidden md:flex bg-white rounded-xl shadow-sm overflow-hidden mb-8">
      <button 
        v-for="(section, index) in sections" 
        :key="index"
        @click="activeSection = section.id"
        :class="['flex-1 flex flex-col items-center justify-center py-4 px-2 transition-all duration-300 border-b-4', 
                activeSection === section.id ? 'border-indigo-500 bg-indigo-50' : 'border-transparent hover:bg-gray-50']"
      >
        <i :class="[section.icon, activeSection === section.id ? 'text-xl text-indigo-600' : 'text-xl text-gray-400']"></i>
        <span :class="['text-sm font-medium mt-1', activeSection === section.id ? 'text-indigo-600' : 'text-gray-500']">{{ section.name }}</span>
      </button>
    </div>
    
    <!-- Мобильный селектор секций -->
    <div class="md:hidden mb-6">
      <select 
        v-model="activeSection" 
        class="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
      >
        <option v-for="section in sections" :key="section.id" :value="section.id">{{ section.name }}</option>
      </select>
    </div>
    
    <!-- Контент секций -->
    <!-- Контейнер для секций -->
    <div>
        <!-- 1. Обзор свадьбы -->
        <div v-if="activeSection === 'overview'" class="overview-section">
          <!-- Заголовок секции -->
          <div class="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
            <h1 class="text-2xl font-bold text-gray-900 mb-4 md:mb-0">Обзор свадьбы</h1>
            <div>
              <button 
                v-if="!weddingDate" 
                @click="showDatePicker = true" 
                class="flex items-center justify-center px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition-colors duration-300"
              >
                <i class="fas fa-calendar-alt mr-2"></i>
                Установить дату свадьбы
              </button>
              <div v-else class="flex items-center space-x-3">
                <span class="text-gray-700">
                  Дата свадьбы:
                  <span class="font-semibold">{{ weddingDisplayDate }}</span>
                   
                </span>
                <!-- <button @click="showDatePicker = true" class="p-2 rounded-full hover:bg-gray-100 text-gray-500 hover:text-indigo-600 transition-colors duration-300">
                  <i class="fas fa-edit"></i>
                </button> -->
              </div>
            </div>
          </div>
          
          <!-- Таймер до свадьбы -->
          <div v-if="weddingDate" class="bg-white shadow-sm wedding-timer-bg rounded-xl p-6 mb-8">
            <h3 class="text-xl font-semibold mb-4 text-center">До свадьбы осталось</h3>
            <div class="flex flex-wrap justify-center gap-4">
              <div class="bg-white bg-opacity-20 shadow-sm rounded-lg px-6 py-4 text-center min-w-24">
                <span class="text-3xl font-bold block">{{ weddingCountdown.days }}</span>
                <span class="text-sm opacity-80">дней</span>
              </div>
              <div class="bg-white bg-opacity-20 shadow-sm rounded-lg px-6 py-4 text-center min-w-24">
                <span class="text-3xl font-bold block">{{ weddingCountdown.hours }}</span>
                <span class="text-sm opacity-80">часов</span>
              </div>
              <div class="bg-white bg-opacity-20 shadow-sm rounded-lg px-6 py-4 text-center min-w-24">
                <span class="text-3xl font-bold block">{{ weddingCountdown.minutes }}</span>
                <span class="text-sm opacity-80">минут</span>
              </div>
            </div>
          </div> 
          
          <!-- Карточки с информацией -->
          <div class="dashboard-grid mb-8">
            <!-- Прогресс подготовки -->
            <div class="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
              <h2 class="text-lg font-semibold text-gray-900 mb-4">Прогресс подготовки</h2>
              <div class="space-y-4">
                <div>
                  <div class="flex justify-between text-sm mb-1">
                    <span class="text-gray-600">Задачи выполнены</span>
                    <span class="font-medium">{{ completedTasksPercent }}%</span>
                  </div>
                  <div class="progress-bar">
                    <div class="after:bg-indigo-500" style="--progress-width: {{ completedTasksPercent }}%"></div>
                  </div>
                </div>
                <div>
                  <div class="flex justify-between text-sm mb-1">
                    <span class="text-gray-600">Бюджет использован</span>
                    <span class="font-medium">{{ usedBudgetPercent }}%</span>
                  </div>
                  <div class="progress-bar">
                    <div class="after:bg-amber-500" style="--progress-width: {{ usedBudgetPercent }}%"></div>
                  </div>
                </div>
              </div>
            </div>
            
            <!-- Бюджет -->
            <div class="bg-white budget-card-bg rounded-xl shadow-sm p-6 mt-2">
              <h2 class="text-lg font-semibold mb-4 text-gray-900">Бюджет</h2>
              <div class="space-y-3">
                <div class="flex justify-between">
                  <span class="text-opacity-80 text-gray-600">Общий бюджет:</span>
                  <span class="font-bold text-gray-600">{{ formatCurrency(totalBudget) }}</span>
                </div>
                <div class="flex justify-between">
                  <span class=" text-opacity-80 text-gray-600">Потрачено:</span>
                  <span class="font-bold text-gray-600">{{ formatCurrency(totalSpent) }}</span>
                </div>
                <div class="flex justify-between border-t border-white border-opacity-20 pt-3 mt-3">
                  <span class="text-opacity-80 text-gray-600">Осталось:</span>
                  <span class="font-bold text-gray-600" :class="{ 'text-red-200': totalBudget < totalSpent }">{{ formatCurrency(totalBudget - totalSpent) }}</span>
                </div>
              </div>
              <button @click="activeSection = 'budget'" class="flex items-center text-sm font-medium mt-4 text-gray-600 hover:underline">
                Подробнее <i class="fas fa-arrow-right ml-2"></i>
              </button>
            </div>
            
            <!-- Статистика по гостям -->
            <!-- <div class="bg-white stats-card-bg rounded-xl shadow-sm p-6 mt-2">
              <h2 class="text-lg font-semibold mb-4 text-gray-900">Гости</h2>
              <div class="grid grid-cols-3 gap-4 mb-4">
                <div class="bg-white bg-opacity-20 rounded-lg p-3 text-center">
                  <div class="text-2xl font-bold">{{ confirmedGuestCount }}</div>
                  <div class="text-xs text-gray-600 text-opacity-80">Подтвердили</div>
                </div>
                <div class="bg-white bg-opacity-20 rounded-lg p-3 text-center">
                  <div class="text-2xl font-bold">{{ declinedGuestCount }}</div>
                  <div class="text-xs text-gray-600 text-opacity-80">Отказались</div>
                </div>
                <div class="bg-white bg-opacity-20 rounded-lg p-3 text-center">
                  <div class="text-2xl font-bold">{{ pendingGuestCount }}</div>
                  <div class="text-xs text-gray-600 text-opacity-80">Ожидают</div>
                </div>
              </div>
              <button @click="activeSection = 'guests'" class="flex items-center text-sm font-medium text-gray-600 hover:underline">
                Управление гостями <i class="fas fa-arrow-right ml-2"></i>
              </button>
            </div> -->
            
            <!-- Сообщение о задачах -->
            <div class="empty-list-message hidden">
              <p>Нет предстоящих задач</p>
              <button @click="activeSection = 'tasks'" class="btn-text">Добавить задачу</button>
            </div>
            </div>
            
            <!-- Статистика 
            <div class="card stats-overview">
              <h2 class="card-title">Статистика</h2>
              <div class="stats-grid ">
                <div class="stat-item">
                  <div class="stat-icon"><i class="fas fa-user-friends"></i></div>
                  <div class="stat-count">{{ totalGuests }}</div>
                  <div class="stat-label">гостей</div>
                </div>
                <div class="stat-item">
                  <div class="stat-icon"><i class="fas fa-thumbs-up"></i></div>
                  <div class="stat-count">{{ confirmedGuests }}</div>
                  <div class="stat-label">подтвердили</div>
                </div>
                <div class="stat-item">
                  <div class="stat-icon"><i class="fas fa-store"></i></div>
                  <div class="stat-count">{{ totalVendors }}</div>
                  <div class="stat-label">поставщиков</div>
                </div>
                <div class="stat-item">
                  <div class="stat-icon"><i class="fas fa-calendar-check"></i></div>
                  <div class="stat-count">{{ daysUntilWedding }}</div>
                  <div class="stat-label">дней до свадьбы</div>
                </div>
              </div>
            </div>-->

          </div>
        </div>
        
        <!-- 2. Задачи и сроки -->
        <div v-if="activeSection === 'tasks'" class="tasks-section">
          <div class="flex flex-col md:flex-row md:items-center md:justify-between mb-4 mt-5">
            <h1 class="text-2xl font-bold text-gray-900 mb-4 md:mb-0">Задачи и сроки</h1>
            <button 
              @click="showNewTaskForm = true" 
              class="flex items-center justify-center px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition-colors duration-300"
            >
              <i class="fas fa-plus mr-2"></i> Добавить задачу
            </button>
          </div>
          
          <!-- Фильтры задач -->
          <div class="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
            <!-- <div class="inline-flex bg-gray-100 rounded-lg p-1 w-full md:w-auto">
              <button 
                @click="taskFilter = 'all'" 
                :class="['px-4 py-2 text-sm font-medium rounded-md transition-colors duration-200', 
                          taskFilter === 'all' ? 'bg-white text-indigo-600 shadow-sm' : 'text-gray-600 hover:text-gray-900']">
                Все
              </button>
              <button 
                @click="taskFilter = 'pending'" 
                :class="['px-4 py-2 text-sm font-medium rounded-md transition-colors duration-200 mx-1', 
                          taskFilter === 'pending' ? 'bg-white text-indigo-600 shadow-sm' : 'text-gray-600 hover:text-gray-900']">
                Невыполненные
              </button>
              <button 
                @click="taskFilter = 'completed'" 
                :class="['px-4 py-2 text-sm font-medium rounded-md transition-colors duration-200', 
                          taskFilter === 'completed' ? 'bg-white text-indigo-600 shadow-sm' : 'text-gray-600 hover:text-gray-900']">
                Выполненные
              </button>
            </div> -->
            
            <!-- <div class="w-full md:w-auto">
              <select 
                v-model="categoryFilter" 
                class="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              >
                <option value="all">Все категории</option>
                <option v-for="category in taskCategories" :key="category.id" :value="category.id">
                  {{ category.name }}
                </option>
              </select>
            </div> -->
          </div>
          
          <!-- Временная шкала -->
          <div class="bg-white rounded-xl shadow-sm p-6 mb-8">
            <div class="flex items-center justify-between mb-4">
              <button 
                @click="moveTimeline(-1)" 
                :disabled="timelineStart <= 0"
                :class="['flex items-center justify-center w-8 h-8 rounded-full', 
                        timelineStart <= 0 ? 'text-gray-300 cursor-not-allowed' : 'text-indigo-600 hover:bg-indigo-50']"
              >
                <i class="fas fa-chevron-left"></i>
              </button>
              <div class="text-gray-700 font-medium">
                {{ timelineMonthsText }}
              </div>
              <button 
                @click="moveTimeline(1)" 
                :disabled="timelineStart >= 9"
                :class="['flex items-center justify-center w-8 h-8 rounded-full', 
                        timelineStart >= 9 ? 'text-gray-300 cursor-not-allowed' : 'text-indigo-600 hover:bg-indigo-50']"
              >
                <i class="fas fa-chevron-right"></i>
              </button>
            </div>
            
            <div class="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-2">
              <div 
                v-for="(month, index) in visibleMonths" 
                :key="index"
                :class="['py-2 px-3 rounded-lg text-center transition-colors', 
                         month.isCurrent ? 'bg-indigo-100 text-indigo-700' : 'bg-gray-50 hover:bg-gray-100 text-gray-700']">
                <div class="text-sm font-medium">{{ month.name }}</div>
                <div v-if="getTaskCountForMonth(month.date) > 0" 
                     class="mt-1 inline-flex items-center justify-center rounded-full bg-indigo-600 text-white text-xs w-5 h-5">
                  {{ getTaskCountForMonth(month.date) }}
                </div>
              </div>
            </div>
          </div>
          
          <!-- Категории задач -->
          <div class="mb-8">
            <h3 class="text-lg font-semibold text-gray-900 mb-4">Категории</h3>
            <div class="flex flex-wrap gap-2">
              <button 
                v-for="category in taskCategories" 
                :key="category.id"
                @click="toggleCategoryFilter(category.id)"
                :class="[
                  'flex items-center px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-200', 
                  selectedCategories.includes(category.id) 
                    ? 'bg-indigo-100 text-indigo-700 border border-indigo-300' 
                    : 'bg-gray-100 text-gray-700 border border-gray-200 hover:bg-gray-200'
                ]"
              >
                <i :class="[category.icon, 'mr-2']"></i>
                <span>{{ category.name }}</span>
              </button>
            </div>
            
            <!-- Список задач по категориям -->
            <div class="mt-8" v-if="filteredTasks.length > 0">
              <div 
                v-for="category in filteredTasksByCategory" 
                :key="category.id"
                class="mb-8"
              >
                <div class="flex items-center justify-between mb-4">
                  <h3 class="text-lg font-semibold text-gray-900 flex items-center">
                    <i :class="[getCategoryIcon(category.id), 'mr-2 text-indigo-600']"></i>
                    {{ getCategoryName(category.id) }}
                  </h3>
                  <span class="inline-flex items-center justify-center rounded-full bg-indigo-100 text-indigo-800 text-xs font-medium px-2.5 py-0.5">
                    {{ category.tasks.length }} задач
                  </span>
                </div>
                
                <div class="space-y-3">
                  <div 
                    v-for="task in category.tasks" 
                    :key="task.id"
                    :class="[
                      'bg-white rounded-lg border p-4 shadow-sm transition-all duration-200',
                      task.completed ? 'border-green-200 bg-green-50' : 'border-gray-200 hover:border-indigo-300 hover:shadow'
                    ]"
                  >
                    <div class="flex items-start">
                      <div class="flex-shrink-0 pt-0.5">
                        <input 
                          type="checkbox" 
                          :id="`task-${task.id}`" 
                          v-model="task.completed" 
                          @change="updateTask(task)"
                          class="h-5 w-5 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                        >
                      </div>
                      <div class="ml-3 flex-1">
                        <div class="text-md font-medium" :class="task.completed ? 'text-green-700 line-through' : 'text-gray-900'">{{ task.title }}</div>
                        <div v-if="task.description" class="mt-1 text-sm text-gray-600">
                          {{ task.description }}
                        </div>
                        <div class="mt-1 flex flex-wrap gap-2 text-sm">
                          <span class="flex items-center text-gray-500">
                            <i class="far fa-calendar-alt mr-1"></i> {{ formatDate(task.due_date || task.deadline) }}
                          </span>
                          <span :class="[
                            'inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium',
                            getPriorityClass(task.priority)
                          ]">
                            {{ getPriorityName(task.priority) }}
                          </span>
                          <span v-if="task.assigned_to" class="flex items-center text-gray-500">
                            <i class="far fa-user mr-1"></i> {{ task.assigned_to }}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div class="mt-3 pt-3 border-t border-gray-100 flex items-center justify-between">
                      <div class="flex items-center space-x-4">
                        <div v-if="task.assigned_to" class="flex items-center text-gray-500 text-sm">
                          <i class="far fa-user mr-1"></i>
                          <span>{{ task.assigned_to }}</span>
                        </div>
                        
                        <div v-if="task.description" class="text-gray-500 text-sm italic overflow-hidden text-ellipsis max-w-xs">
                          {{ task.description.length > 50 ? task.description.substring(0, 50) + '...' : task.description }}
                        </div>
                      </div>
                      
                      <div class="flex space-x-2">
                        <!-- <button 
                          @click="editTask(task)" 
                          class="p-1.5 rounded-full text-gray-500 hover:text-indigo-600 hover:bg-indigo-50 transition-colors"
                        >
                          <i class="fas fa-edit"></i>
                        </button> -->
                        <button 
                          @click="confirmDeleteTask(task)" 
                          class="p-1.5 rounded-full text-gray-500 hover:text-red-600 hover:bg-red-50 transition-colors"
                        >
                          <i class="fas fa-trash"></i>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            <div v-else class="mt-8 bg-gray-50 rounded-xl p-8 text-center">
              <div class="mb-4">
                <svg class="mx-auto h-12 w-12 text-gray-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
              </div>
              <h3 class="text-lg font-medium text-gray-900 mb-2">Нет задач</h3>
              <p class="text-gray-500 mb-4">Не найдено задач, соответствующих выбранным категориям</p>
              <button 
                @click="showNewTaskForm = true" 
                class="inline-flex items-center px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition-colors duration-300"
              >
                <i class="fas fa-plus mr-2"></i> Добавить задачу
              </button>
            </div>
          </div>
          
          <!-- Модальное окно добавления/редактирования задачи -->
          <div v-if="showNewTaskForm || editingTask" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div class="bg-white rounded-xl shadow-xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
              <div class="p-6">
                <div class="flex justify-between items-center mb-6">
                  <h3 class="text-xl font-bold text-gray-900">{{ editingTask ? 'Редактировать задачу' : 'Новая задача' }}</h3>
                  <button @click="cancelTaskForm" class="text-gray-400 hover:text-gray-600">
                    <i class="fas fa-times"></i>
                  </button>
                </div>
                
                <div class="space-y-4">
                  <div>
                    <label for="task-title" class="block text-sm font-medium text-gray-700 mb-1">Название</label>
                    <input 
                      type="text" 
                      id="task-title" 
                      v-model="newTask.title" 
                      class="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                      required
                    >
                  </div>
                  
                  <div>
                    <label for="task-category" class="block text-sm font-medium text-gray-700 mb-1">Категория</label>
                    <select 
                      id="task-category" 
                      v-model="newTask.category_id" 
                      class="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                      required
                    >
                      <option v-for="category in taskCategories" :key="category.id" :value="category.id">
                        {{ category.name }}
                      </option>
                    </select>
                  </div>
                  
                  <div>
                    <label for="task-deadline" class="block text-sm font-medium text-gray-700 mb-1">Срок</label>
                    <input 
                      type="date" 
                      id="task-deadline" 
                      v-model="newTask.deadline" 
                      :min="getTodayString()" 
                      class="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                      required
                    >
                  </div>
                  
                  <div>
                    <label for="task-priority" class="block text-sm font-medium text-gray-700 mb-1">Приоритет</label>
                    <select 
                      id="task-priority" 
                      v-model="newTask.priority"
                      class="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    >
                      <option value="1">Низкий</option>
                      <option value="2">Средний</option>
                      <option value="3">Высокий</option>
                    </select>
                  </div>
                  
                  <div>
                    <label for="task-assigned_to" class="block text-sm font-medium text-gray-700 mb-1">Ответственный</label>
                    <input 
                      type="text" 
                      id="task-assigned_to" 
                      v-model="newTask.assigned_to"
                      class="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    >
                  </div>
                  
                  <div>
                    <label for="task-notes" class="block text-sm font-medium text-gray-700 mb-1">Примечания</label>
                    <textarea 
                      id="task-notes" 
                      v-model="newTask.description" 
                      rows="3"
                      class="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    ></textarea>
                  </div>
                </div>
                
                <div class="flex justify-end space-x-3 mt-6">
                  <button 
                    @click="cancelTaskForm" 
                    class="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
                  >
                    Отмена
                  </button>
                  <button 
                    @click="saveTask" 
                    class="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition-colors duration-300"
                  >
                    Сохранить
                  </button>
                </div>
              </div>
            </div>
          </div>
          
          <!-- Модальное окно подтверждения удаления задачи -->
          <div v-if="taskToDelete" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div class="bg-white rounded-xl shadow-xl w-full max-w-md">
              <div class="p-6">
                <h3 class="text-xl font-bold text-gray-900 mb-4">Удалить задачу?</h3>
                <p class="text-gray-500 mb-6">Вы уверены, что хотите удалить задачу "{{ taskToDelete.title }}"?</p>
                <div class="flex justify-end space-x-3">
                  <button 
                    @click="taskToDelete = null" 
                    class="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                  >
                    Отмена
                  </button>
                  <button 
                    @click="deleteTask" 
                    class="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors duration-300"
                  >
                    Удалить
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <!-- 3. Управление бюджетом -->
        <div v-if="activeSection === 'budget'" class="p-6">
          <div class="flex flex-wrap items-center justify-between mb-8">
            <h1 class="text-2xl font-bold text-gray-900">Управление бюджетом</h1>
            <button 
              @click="showNewBudgetItemForm = true" 
              class="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition-colors duration-300 flex items-center"
            >
              <i class="fas fa-plus mr-2"></i> Добавить расход
            </button>
          </div>
          
          <div class="mb-8">
            <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div class="bg-white p-6 rounded-xl shadow-sm border border-gray-200 flex flex-col">
                <div class="text-sm font-medium text-gray-500 mb-1">Общий бюджет</div>
                <div class="text-3xl font-bold text-gray-900 mb-4">{{ formatCurrency(totalBudget) }}</div>
                <button 
                  @click="showSetBudgetForm = true" 
                  class="mt-auto py-2 px-4 border border-indigo-500 text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors text-sm font-medium"
                >
                  Изменить
                </button>
              </div>
              
              <div class="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                <div class="text-sm font-medium text-gray-500 mb-1">Потрачено</div>
                <div class="text-3xl font-bold text-rose-600 mb-2">{{ formatCurrency(spentBudget) }}</div>
                <div class="flex items-center">
                  <div class="w-full bg-gray-200 rounded-full h-2.5 mr-2">
                    <div 
                      class="bg-rose-500 h-2.5 rounded-full" 
                      :style="{ width: `${Math.min(Math.round((spentBudget / totalBudget) * 100), 100)}%` }"
                    ></div>
                  </div>
                  <span class="text-sm font-medium text-gray-700">{{ Math.round((spentBudget / totalBudget) * 100) }}%</span>
                </div>
              </div>
              
              <div class="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                <div class="text-sm font-medium text-gray-500 mb-1">Осталось</div>
                <div class="text-3xl font-bold text-emerald-600 mb-2">{{ formatCurrency(totalBudget - spentBudget) }}</div>
                <div class="flex items-center">
                  <div class="w-full bg-gray-200 rounded-full h-2.5 mr-2">
                    <div 
                      class="bg-emerald-500 h-2.5 rounded-full" 
                      :style="{ width: `${Math.min(Math.round(((totalBudget - spentBudget) / totalBudget) * 100), 100)}%` }"
                    ></div>
                  </div>
                  <span class="text-sm font-medium text-gray-700">{{ Math.round(((totalBudget - spentBudget) / totalBudget) * 100) }}%</span>
                </div>
              </div>
            </div>

            <!-- Круговая диаграмма и распределение бюджета -->
            <div class="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-10">
              <div class="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                <h3 class="text-lg font-semibold text-gray-900 mb-6">Распределение бюджета</h3>
                
                <div class="relative w-64 h-64 mx-auto">
                  <!-- Сегменты диаграммы -->
                  <div class="absolute inset-0 rounded-full overflow-hidden">
                    <div 
                      v-for="(category, index) in budgetByCategory" 
                      :key="index"
                      class="absolute inset-0"
                      :style="{
                        transform: `rotate(${category.startAngle}deg)`,
                        background: `conic-gradient(${category.color} 0deg, ${category.color} ${category.percentage * 3.6}deg, transparent ${category.percentage * 3.6}deg)`
                      }"
                    ></div>
                  </div>
                  
                  <!-- Центральный круг -->
                  <div class="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-40 h-40 bg-white rounded-full flex flex-col items-center justify-center shadow-inner">
                    <div class="text-2xl font-bold text-gray-900">{{ formatCurrency(spentBudget) }}</div>
                    <div class="text-sm text-gray-500">потрачено</div>
                  </div>
                </div>
              </div>
              
              <!-- Легенда диаграммы -->
              <div class="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                <h3 class="text-lg font-semibold text-gray-900 mb-4">Расходы по категориям</h3>
                
                <div class="space-y-4 max-h-80 overflow-y-auto pr-2">
                  <div 
                    v-for="(category, index) in budgetByCategory" 
                    :key="index"
                    class="flex items-center p-3 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    <div 
                      class="w-4 h-4 rounded-full mr-3 flex-shrink-0" 
                      :style="{ backgroundColor: category.color }"
                    ></div>
                    
                    <div class="flex-grow">
                      <div class="text-sm font-medium text-gray-900">{{ category.name }}</div>
                      <div class="flex justify-between items-center mt-1">
                        <div class="text-sm text-gray-700 font-medium">{{ formatCurrency(category.amount) }}</div>
                        <div class="text-xs font-medium px-2 py-0.5 rounded-full bg-gray-100 text-gray-800">{{ category.percentage }}%</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          
          <!-- Таблица расходов -->
          <div class="mt-12">
            <div class="flex flex-wrap items-center justify-between mb-6">
              <h2 class="text-xl font-bold text-gray-900">Расходы свадьбы</h2>
              
              <div class="flex flex-wrap gap-4 mt-4 sm:mt-0">
                <div class="w-full sm:w-auto">
                  <label for="budget-category-filter" class="block text-sm font-medium text-gray-700 mb-1">Категория</label>
                  <select 
                    id="budget-category-filter"
                    v-model="budgetCategoryFilter"
                    class="w-full px-3 py-2 bg-white border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  >
                    <option value="">Все категории</option>
                    <option v-for="category in budgetCategories" :key="category.id" :value="category.id">
                      {{ category.name }}
                    </option>
                  </select>
                </div>
                
                <div class="w-full sm:w-auto">
                  <label for="budget-status-filter" class="block text-sm font-medium text-gray-700 mb-1">Статус</label>
                  <select 
                    id="budget-status-filter"
                    v-model="budgetStatusFilter"
                    class="w-full px-3 py-2 bg-white border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  >
                    <option value="">Все</option>
                    <option value="paid">Оплачено</option>
                    <option value="planned">Запланировано</option>
                  </select>
                </div>
              </div>
            </div>
            
            <div class="overflow-x-auto bg-white rounded-xl shadow-sm border border-gray-200">
              <table class="min-w-full divide-y divide-gray-200">
                <thead>
                  <tr>
                    <th class="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Категория</th>
                    <th class="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Описание</th>
                    <th class="px-6 py-3 bg-gray-50 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Запланировано</th>
                    <th class="px-6 py-3 bg-gray-50 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Потрачено</th>
                    <th class="px-6 py-3 bg-gray-50 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Статус</th>
                    <th class="px-6 py-3 bg-gray-50 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Действия</th>
                  </tr>
                </thead>
                <tbody class="divide-y divide-gray-200">
                  <tr 
                    v-for="item in filteredBudgetItems" 
                    :key="item.id" 
                    :class="item.status === 'paid' ? 'bg-green-50' : 'hover:bg-gray-50'"
                  >
                    <td class="px-6 py-4 whitespace-nowrap">
                      <div class="flex items-center">
                        <div class="w-2 h-2 rounded-full" :class="getBudgetCategoryColor(item.category, item)"></div>
                        <span class="ml-2 text-sm font-medium text-gray-900">{{ getBudgetCategoryName(item.category, item) }}</span>
                      </div>
                    </td>
                    <td class="px-6 py-4 text-sm text-gray-800">{{ item.description }}</td>
                    <td class="px-6 py-4 text-sm text-right font-medium text-gray-700">{{ formatCurrency(item.planned_amount) }}</td>
                    <td class="px-6 py-4 text-sm text-right font-medium" :class="item.status === 'paid' ? 'text-green-700' : 'text-gray-400'">
                      {{ item.status === 'paid' ? formatCurrency(item.actual_amount) : '-' }}
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap text-center">
                      <span 
                        class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full" 
                        :class="item.status === 'paid' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'"
                      >
                        {{ item.status === 'paid' ? 'Оплачено' : 'Запланировано' }}
                      </span>
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap text-right text-sm">
                      <div class="flex justify-end space-x-2">
                        <button 
                          @click="editBudgetItem(item)" 
                          class="p-1.5 rounded-full text-gray-500 hover:text-indigo-600 hover:bg-indigo-50 transition-colors"
                        >
                          <i class="fas fa-edit"></i>
                        </button>
                        <button 
                          @click="confirmDeleteBudgetItem(item)" 
                          class="p-1.5 rounded-full text-gray-500 hover:text-red-600 hover:bg-red-50 transition-colors"
                        >
                          <i class="fas fa-trash"></i>
                        </button>
                      </div>
                    </td>
                  </tr>
                  
                  <!-- Если нет расходов -->
                  <tr v-if="filteredBudgetItems.length === 0">
                    <td colspan="6" class="px-6 py-10 text-center text-gray-500">
                      <p class="text-base">Нет запланированных расходов</p>
                      <button 
                        @click="showNewBudgetItemForm = true" 
                        class="mt-4 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                      >
                        <i class="fas fa-plus mr-2"></i> Добавить расход
                      </button>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
            
            <!-- Итоговая строка с общими суммами -->
            <div class="mt-6 bg-white rounded-xl shadow-sm border border-gray-200 p-4">
              <div class="flex flex-wrap justify-end gap-8">
                <div class="text-right">
                  <div class="text-sm font-medium text-gray-500 mb-1">Запланировано:</div>
                  <div class="text-lg font-bold text-gray-900">{{ formatCurrency(getTotalPlannedBudget()) }}</div>
                </div>
                
                <div class="text-right">
                  <div class="text-sm font-medium text-gray-500 mb-1">Потрачено:</div>
                  <div class="text-lg font-bold text-rose-600">{{ formatCurrency(getTotalSpentBudget()) }}</div>
                </div>
                
                <div class="text-right">
                  <div class="text-sm font-medium text-gray-500 mb-1">Осталось:</div>
                  <div class="text-lg font-bold text-emerald-600">{{ formatCurrency(getTotalRemainingBudget()) }}</div>
                </div>
              </div>
            </div>
          </div>
          
          <!-- Модальное окно установки бюджета -->
          <div v-if="showSetBudgetForm" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div class="bg-white rounded-xl shadow-xl w-full max-w-md">
              <div class="p-6">
                <div class="flex justify-between items-center mb-6">
                  <h3 class="text-xl font-bold text-gray-900">Установить общий бюджет</h3>
                  <button @click="showSetBudgetForm = false" class="text-gray-400 hover:text-gray-600">
                    <i class="fas fa-times"></i>
                  </button>
                </div>
                
                <div class="mb-6">
                  <label for="total-budget" class="block text-sm font-medium text-gray-700 mb-1">Общий бюджет (₽)</label>
                  <input 
                    type="number" 
                    id="total-budget" 
                    v-model.number="newTotalBudget" 
                    min="0" 
                    step="1000"
                    class="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  >
                </div>
                
                <div class="flex justify-end space-x-3">
                  <button 
                    @click="showSetBudgetForm = false" 
                    class="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                  >
                    Отмена
                  </button>
                  <button 
                    @click="setTotalBudget" 
                    class="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition-colors duration-300"
                  >
                    Сохранить
                  </button>
                </div>
              </div>
            </div>
          </div>
          
          <!-- Модальное окно добавления/редактирования расхода -->
          <div v-if="showNewBudgetItemForm || editingBudgetItem" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div class="bg-white rounded-xl shadow-xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
              <div class="p-6">
                <div class="flex justify-between items-center mb-6">
                  <h3 class="text-xl font-bold text-gray-900">{{ editingBudgetItem ? 'Редактировать расход' : 'Новый расход' }}</h3>
                  <button @click="cancelBudgetItemForm" class="text-gray-400 hover:text-gray-600">
                    <i class="fas fa-times"></i>
                  </button>
                </div>
                
                <div class="space-y-4">
                  <div>
                    <label for="budget-category" class="block text-sm font-medium text-gray-700 mb-1">Категория</label>
                    <select 
                      id="budget-category" 
                      v-model="newBudgetItem.category_id"
                      class="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    >
                      <option v-for="category in budgetCategories" :key="category.id" :value="category.id">
                        {{ category.name }}
                      </option>
                    </select>
                  </div>
                  
                  <div>
                    <label for="budget-description" class="block text-sm font-medium text-gray-700 mb-1">Описание</label>
                    <input 
                      type="text" 
                      id="budget-description" 
                      v-model="newBudgetItem.description" 
                      class="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                      required
                    >
                  </div>
                  
                  <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label for="budget-planned" class="block text-sm font-medium text-gray-700 mb-1">Запланированная сумма (₽)</label>
                      <input 
                        type="number" 
                        id="budget-planned" 
                        v-model.number="newBudgetItem.planned_amount" 
                        min="0"
                        class="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                      >
                    </div>
                    
                    <div>
                      <label for="budget-actual" class="block text-sm font-medium text-gray-700 mb-1">Фактическая сумма (₽)</label>
                      <input 
                        type="number" 
                        id="budget-actual" 
                        v-model.number="newBudgetItem.actual_amount" 
                        min="0"
                        class="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                      >
                    </div>
                  </div>
                  
                  <div>
                    <label for="budget-vendor" class="block text-sm font-medium text-gray-700 mb-1">Поставщик</label>
                    <input 
                      type="text" 
                      id="budget-vendor" 
                      v-model="newBudgetItem.vendor"
                      class="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    >
                  </div>
                  
                  <div>
                    <label for="budget-date" class="block text-sm font-medium text-gray-700 mb-1">Дата</label>
                    <input 
                      type="date" 
                      id="budget-date" 
                      v-model="newBudgetItem.date"
                      class="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    >
                  </div>
                  
                  <div>
                    <label for="budget-notes" class="block text-sm font-medium text-gray-700 mb-1">Примечания</label>
                    <textarea 
                      id="budget-notes" 
                      v-model="newBudgetItem.notes" 
                      rows="3"
                      class="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    ></textarea>
                  </div>
                  
                  <div class="flex items-center">
                    <input 
                      type="checkbox" 
                      id="budget-is-paid" 
                      v-model="newBudgetItem.is_paid"
                      class="h-5 w-5 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                    >
                    <label for="budget-is-paid" class="ml-2 block text-sm text-gray-900">Оплачено</label>
                  </div>
                </div>
                
                <div class="flex justify-end space-x-3 mt-6">
                  <button 
                    @click="cancelBudgetItemForm" 
                    class="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                  >
                    Отмена
                  </button>
                  <button 
                    @click="saveBudgetItem" 
                    class="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition-colors duration-300"
                  >
                    Сохранить
                  </button>
                </div>
              </div>
            </div>
          </div>
          
          <!-- Модальное окно загрузки чека -->
          <div v-if="receiptUploadItem" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div class="bg-white rounded-xl shadow-xl w-full max-w-md">
              <div class="p-6">
                <div class="flex justify-between items-center mb-6">
                  <h3 class="text-xl font-bold text-gray-900">Загрузить чек</h3>
                  <button @click="receiptUploadItem = null" class="text-gray-400 hover:text-gray-600">
                    <i class="fas fa-times"></i>
                  </button>
                </div>
                
                <div class="mb-6">
                  <label for="receipt-file" class="block text-sm font-medium text-gray-700 mb-2">Выберите файл</label>
                  <div class="flex items-center justify-center w-full">
                    <label 
                      for="receipt-file" 
                      class="flex flex-col items-center justify-center w-full h-32 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100"
                    >
                      <div class="flex flex-col items-center justify-center pt-5 pb-6">
                        <i class="fas fa-cloud-upload-alt text-3xl text-gray-400 mb-2"></i>
                        <p class="mb-2 text-sm text-gray-500">
                          <span class="font-medium">Нажмите для загрузки</span> или перетащите файл
                        </p>
                        <p class="text-xs text-gray-500">Поддерживаются PNG, JPG или PDF (max. 10MB)</p>
                      </div>
                      <input 
                        type="file" 
                        id="receipt-file" 
                        @change="handleReceiptFileChange" 
                        class="hidden"
                        accept=".jpg, .jpeg, .png, .pdf"
                      >
                    </label>
                  </div>
                  <div v-if="receiptFile" class="mt-3 text-sm text-gray-600">
                    <i class="fas fa-file mr-1"></i> {{ receiptFile.name }}
                  </div>
                </div>
                
                <div class="flex justify-end space-x-3">
                  <button 
                    @click="receiptUploadItem = null" 
                    class="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                  >
                    Отмена
                  </button>
                  <button 
                    @click="saveReceipt" 
                    class="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition-colors duration-300 disabled:opacity-50 disabled:cursor-not-allowed" 
                    :disabled="!receiptFile"
                  >
                    Загрузить
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <!-- 1. Обзор свадьбы -->
        <div v-if="activeSection === 'overview'" class="overview-section">
          <!-- Заголовок секции -->
          <div class="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
            <h1 class="text-2xl font-bold text-gray-900 mb-4 md:mb-0">Обзор свадьбы</h1>
            <div>
              <button 
                v-if="!weddingDate" 
                @click="showDatePicker = true" 
                class="flex items-center justify-center px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition-colors duration-300"
              >
                <i class="fas fa-calendar-alt mr-2"></i>
                Установить дату свадьбы
              </button>
              <div v-else class="flex items-center space-x-3">
                <span class="text-gray-700">Дата свадьбы: <span class="font-semibold">{{ formatDate(weddingDate) }}</span></span>
                <button @click="showDatePicker = true" class="p-2 rounded-full hover:bg-gray-100 text-gray-500 hover:text-indigo-600 transition-colors duration-300">
                  <i class="fas fa-edit"></i>
                </button>
              </div>
            </div>
          </div>
          
          <!-- Таймер до свадьбы -->
          <div v-if="weddingDate" class="wedding-timer-bg rounded-xl p-6 text-white mb-8">
            <h3 class="text-xl font-semibold mb-4">До свадьбы осталось</h3>
            <div class="flex flex-wrap justify-center md:justify-start gap-4">
              <div class="bg-white bg-opacity-20 rounded-lg px-6 py-4 text-center min-w-24">
                <span class="text-3xl font-bold block">{{ weddingCountdown.days }}</span>
                <span class="text-sm opacity-80">дней</span>
              </div>
              <div class="bg-white bg-opacity-20 rounded-lg px-6 py-4 text-center min-w-24">
                <span class="text-3xl font-bold block">{{ weddingCountdown.hours }}</span>
                <span class="text-sm opacity-80">часов</span>
              </div>
              <div class="bg-white bg-opacity-20 rounded-lg px-6 py-4 text-center min-w-24">
                <span class="text-3xl font-bold block">{{ weddingCountdown.minutes }}</span>
                <span class="text-sm opacity-80">минут</span>
              </div>
            </div>
          </div>  
            <div class="stat-card">
              <div class="stat-value">{{ pendingGuests }}</div>
              <div class="stat-label">Ожидают ответа</div>
            </div>
          </div>
        
        <!-- 4. Список гостей -->
        <div v-if="activeSection === 'guests'" class="guests-section bg-white rounded-xl shadow-sm p-6 mt-8">
          <!-- Отладочная информация -->
          <div class="bg-blue-50 p-4 rounded-lg mb-4 border border-blue-200">
            <h3 class="text-blue-700 font-bold">Отладочная информация:</h3>
            <p>Текущая активная секция: <strong>{{ activeSection }}</strong></p>
            <p>Количество гостей в массиве: <strong>{{ guests.length }}</strong></p>
            <p>Количество отфильтрованных гостей: <strong>{{ filteredGuests.length }}</strong></p>
            <p>Количество групп: <strong>{{ guestGroups.length }}</strong></p>
            <p>Подтвердивших: <strong>{{ confirmedGuests }}</strong>, Отказавшихся: <strong>{{ declinedGuests }}</strong>, Ожидают: <strong>{{ pendingGuests }}</strong></p>
          </div>
          <!-- Заголовок секции -->
          <div class="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
            <h1 class="text-2xl font-bold text-gray-900 mb-4 md:mb-0">Список гостей</h1>
            <button 
              @click="showNewGuestForm = true" 
              class="flex items-center justify-center px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition-colors duration-300"
            >
              <i class="fas fa-plus mr-2"></i> Добавить гостя
            </button>
          </div>
          
          <!-- Статистика по гостям -->
          <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
            <div class="bg-white rounded-xl shadow-sm border border-gray-200 p-5">
              <div class="text-3xl font-bold text-gray-900 mb-1">{{ totalGuests }}</div>
              <div class="text-sm font-medium text-gray-600">Всего гостей</div>
            </div>
            
            <div class="bg-white rounded-xl shadow-sm border border-gray-200 p-5">
              <div class="text-3xl font-bold text-emerald-600 mb-1">{{ confirmedGuests }}</div>
              <div class="text-sm font-medium text-gray-600">Подтвердили</div>
            </div>
            
            <div class="bg-white rounded-xl shadow-sm border border-gray-200 p-5">
              <div class="text-3xl font-bold text-rose-600 mb-1">{{ declinedGuests }}</div>
              <div class="text-sm font-medium text-gray-600">Отказались</div>
            </div>
            
            <div class="bg-white rounded-xl shadow-sm border border-gray-200 p-5">
              <div class="text-3xl font-bold text-amber-500 mb-1">{{ pendingGuests }}</div>
              <div class="text-sm font-medium text-gray-600">Ожидают ответа</div>
            </div>
          </div>
          
          <!-- Фильтры для гостей -->
          <div class="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
            <div class="flex flex-wrap gap-4">
              <div class="w-full md:w-auto md:flex-1">
                <label for="guest-group-filter" class="block text-sm font-medium text-gray-700 mb-1">Группа</label>
                <select 
                  id="guest-group-filter"
                  v-model="guestGroupFilter"
                  class="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                >
                  <option value="">Все группы</option>
                  <option v-for="group in guestGroups" :key="group.id" :value="group.id">
                    {{ group.name }}
                  </option>
                </select>
              </div>
              
              <div class="w-full md:w-auto md:flex-1">
                <label for="guest-status-filter" class="block text-sm font-medium text-gray-700 mb-1">Статус</label>
                <select 
                  id="guest-status-filter"
                  v-model="guestStatusFilter"
                  class="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                >
                  <option value="">Все статусы</option>
                  <option value="confirmed">Подтвердили</option>
                  <option value="declined">Отказались</option>
                  <option value="pending">Ожидают ответа</option>
                </select>
              </div>
              
              <div class="w-full md:w-auto md:flex-1">
                <label for="guest-search" class="block text-sm font-medium text-gray-700 mb-1">Поиск</label>
                <div class="relative">
                  <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <i class="fas fa-search text-gray-400"></i>
                  </div>
                  <input 
                    id="guest-search"
                    type="text" 
                    v-model="guestSearchQuery" 
                    placeholder="Поиск по имени..."
                    class="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  >
                </div>
              </div>
            </div>
          </div>
            
          <!-- Таблица гостей -->
          <div class="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <div class="overflow-x-auto">
              <table class="min-w-full divide-y divide-gray-200">
                <thead>
                  <tr>
                    <th scope="col" class="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Имя</th>
                    <th scope="col" class="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Группа</th>
                    <th scope="col" class="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Контакт</th>
                    <th scope="col" class="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Статус</th>
                    <th scope="col" class="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Примечания</th>
                    <th scope="col" class="px-6 py-3 bg-gray-50 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Действия</th>
                  </tr>
                </thead>
                <tbody class="bg-white divide-y divide-gray-200">
                  <tr 
                    v-for="guest in filteredGuests" 
                    :key="guest.id"
                    class="hover:bg-gray-50 transition-colors duration-150"
                  >
                    <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{{ guest.name }}</td>
                    <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{{ getGroupName(guest.group_id) }}</td>
                    <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{{ guest.contact || 'Не указан' }}</td>
                    <td class="px-6 py-4 whitespace-nowrap">
                      <span 
                        :class="{
                          'px-2 py-1 inline-flex text-xs leading-5 font-medium rounded-full': true,
                          'bg-green-100 text-green-800': guest.status === 'confirmed',
                          'bg-red-100 text-red-800': guest.status === 'declined',
                          'bg-yellow-100 text-yellow-800': guest.status === 'pending'
                        }"
                      >
                        {{ getStatusLabel(guest.status) }}
                      </span>
                    </td>
                    <td class="px-6 py-4 text-sm text-gray-600">{{ guest.notes || '-' }}</td>
                    <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <button 
                        @click="editGuest(guest)" 
                        class="text-indigo-600 hover:text-indigo-900 mr-3 transition-colors"
                        title="Редактировать"
                      >
                        <i class="fas fa-edit"></i>
                      </button>
                      <button 
                        @click="confirmDeleteGuest(guest)" 
                        class="text-rose-600 hover:text-rose-900 transition-colors"
                        title="Удалить"
                      >
                        <i class="fas fa-trash-alt"></i>
                      </button>
                    </td>
                  </tr>
                  <!-- Пустое состояние -->
                  <tr v-if="filteredGuests.length === 0" class="hover:bg-gray-50">
                    <td colspan="6" class="px-6 py-10 text-center">
                      <div class="flex flex-col items-center justify-center">
                        <i class="fas fa-users-slash text-4xl text-gray-300 mb-3"></i>
                        <p class="text-gray-500 mb-4">Нет гостей, соответствующих выбранным фильтрам</p>
                        <button 
                          @click="showNewGuestForm = true" 
                          class="inline-flex items-center px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium rounded-lg transition-colors duration-300"
                        >
                          <i class="fas fa-plus mr-2"></i> Добавить гостя
                        </button>
                      </div>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
          
          <!-- Модальное окно добавления/редактирования гостя -->
          <div v-if="showNewGuestForm || editingGuest" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div class="bg-white rounded-xl shadow-xl w-full max-w-md max-h-[90vh] overflow-y-auto">
              <div class="p-6">
                <div class="flex justify-between items-center mb-6">
                  <h3 class="text-xl font-bold text-gray-900">{{ editingGuest ? 'Редактировать гостя' : 'Новый гость' }}</h3>
                  <button @click="cancelGuestForm" class="text-gray-400 hover:text-gray-600">
                    <i class="fas fa-times"></i>
                  </button>
                </div>
                
                <div class="space-y-4">
                  <div>
                    <label for="guest-name" class="block text-sm font-medium text-gray-700 mb-1">Имя</label>
                    <input 
                      type="text" 
                      id="guest-name" 
                      v-model="newGuest.name" 
                      class="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                      required
                    >
                  </div>
                  
                  <div>
                    <label for="guest-group" class="block text-sm font-medium text-gray-700 mb-1">Группа</label>
                    <select 
                      id="guest-group" 
                      v-model="newGuest.group_id"
                      class="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    >
                      <option v-for="group in guestGroups" :key="group.id" :value="group.id">
                        {{ group.name }}
                      </option>
                    </select>
                  </div>
                  
                  <div>
                    <label for="guest-contact" class="block text-sm font-medium text-gray-700 mb-1">Контакт</label>
                    <input 
                      type="text" 
                      id="guest-contact" 
                      v-model="newGuest.contact"
                      class="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                      placeholder="Телефон или эл. почта"
                    >
                  </div>
                  
                  <div>
                    <label for="guest-status" class="block text-sm font-medium text-gray-700 mb-1">Статус</label>
                    <select 
                      id="guest-status" 
                      v-model="newGuest.status"
                      class="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    >
                      <option value="pending">Ожидает ответа</option>
                      <option value="confirmed">Подтвердил</option>
                      <option value="declined">Отказался</option>
                    </select>
                  </div>
                  
                  <div>
                    <label for="guest-notes" class="block text-sm font-medium text-gray-700 mb-1">Примечания</label>
                    <textarea 
                      id="guest-notes" 
                      v-model="newGuest.notes" 
                      rows="3"
                      class="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    ></textarea>
                  </div>
                </div>
                
                <div class="flex justify-end space-x-3 mt-6">
                  <button 
                    @click="cancelGuestForm" 
                    class="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                  >
                    Отмена
                  </button>
                  <button 
                    @click="saveGuest" 
                    class="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition-colors duration-300"
                  >
                    Сохранить
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <!-- 5. Расписание дня -->
        <div v-if="activeSection === 'schedule'" class="schedule-section space-y-6">
          <!-- Заголовок секции -->
          <div class="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
            <h1 class="text-2xl font-bold text-gray-900 mb-4 md:mb-0">Расписание дня</h1>
            <button 
              @click="showNewScheduleItemForm = true" 
              class="flex items-center justify-center px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition-colors duration-300"
            >
              <i class="fas fa-plus mr-2"></i> Добавить событие
            </button>
          </div>
          
          <!-- Временная шкала расписания -->
          <div class="relative mt-8 bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div class="timeline-line"></div>
            
            <div 
              v-for="(item, index) in sortedScheduleItems" 
              :key="item.id"
              class="relative pl-10 mb-8 last:mb-0"
              :class="{ 'first-item': index === 0, 'last-item': index === sortedScheduleItems.length - 1 }"
            >
              <!-- Время события -->
              <div class="absolute left-0 text-sm font-medium text-gray-600 w-16 text-right pr-8">{{ formatTime(item.time) }}</div>
              
              <!-- Точка на временной шкале -->
              <div class="timeline-dot"></div>
              
              <!-- Карточка события -->
              <div class="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
                <!-- Заголовок карточки -->
                <div class="flex justify-between items-center px-4 py-3 bg-gray-50 border-b border-gray-200">
                  <h3 class="font-medium text-gray-900">{{ item.title }}</h3>
                  <div class="flex space-x-2">
                    <button 
                      @click="editScheduleItem(item)" 
                      class="text-indigo-600 hover:text-indigo-900 transition-colors"
                      title="Редактировать"
                    >
                      <i class="fas fa-edit"></i>
                    </button>
                    <button 
                      @click="confirmDeleteScheduleItem(item)" 
                      class="text-rose-600 hover:text-rose-900 transition-colors"
                      title="Удалить"
                    >
                      <i class="fas fa-trash-alt"></i>
                    </button>
                  </div>
                </div>
                
                <!-- Описание события -->
                <div class="px-4 py-3 text-sm text-gray-700">{{ item.description }}</div>
                
                <!-- Местоположение -->
                <div v-if="item.location" class="px-4 py-2 bg-gray-50 border-t border-gray-200 text-sm text-gray-600 flex items-center">
                  <i class="fas fa-map-marker-alt text-rose-500 mr-2"></i>
                    {{ item.location }}
                  </div>
                  <div v-if="item.responsible" class="px-4 py-2 bg-gray-50 border-t border-gray-200 text-sm text-gray-600 flex items-center">
                    <i class="fas fa-user text-indigo-500 mr-2"></i>
                    {{ item.responsible }}
                  </div>
                </div>
              </div>
            </div>
            
            <!-- Пустое состояние расписания -->
            <div v-if="sortedScheduleItems.length === 0" class="py-12 flex flex-col items-center justify-center text-center">
              <i class="fas fa-calendar-day text-5xl text-gray-300 mb-4"></i>
              <p class="text-gray-500 mb-6">Расписание пока пусто</p>
              <button 
                @click="showNewScheduleItemForm = true" 
                class="flex items-center justify-center px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition-colors duration-300"
              >
                <i class="fas fa-plus mr-2"></i> Добавить первое событие
              </button>
            </div>
          </div>
          
          <!-- Модальное окно добавления/редактирования события расписания -->
          <div v-if="showNewScheduleItemForm || editingScheduleItem" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div class="bg-white rounded-xl shadow-xl w-full max-w-md max-h-[90vh] overflow-y-auto">
              <div class="p-6">
                <div class="flex justify-between items-center mb-6">
                  <h3 class="text-xl font-bold text-gray-900">{{ editingScheduleItem ? 'Редактировать событие' : 'Новое событие' }}</h3>
                  <button @click="cancelScheduleItemForm" class="text-gray-400 hover:text-gray-600">
                    <i class="fas fa-times"></i>
                  </button>
                </div>
                
                <div class="space-y-4">
                  <div>
                    <label for="schedule-title" class="block text-sm font-medium text-gray-700 mb-1">Название</label>
                    <input 
                      type="text" 
                      id="schedule-title" 
                      v-model="newScheduleItem.title"
                      class="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                      required
                    >
                  </div>
                  
                  <div>
                    <label for="schedule-time" class="block text-sm font-medium text-gray-700 mb-1">Время</label>
                    <input 
                      type="time" 
                      id="schedule-time" 
                      v-model="newScheduleItem.time"
                      class="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                      required
                    >
                  </div>
              
                  <div>
                    <label for="schedule-description" class="block text-sm font-medium text-gray-700 mb-1">Описание</label>
                    <textarea 
                      id="schedule-description" 
                      v-model="newScheduleItem.description" 
                      rows="3"
                      class="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    ></textarea>
                  </div>
                  
                  <div>
                    <label for="schedule-location" class="block text-sm font-medium text-gray-700 mb-1">Место</label>
                    <div class="relative">
                      <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <i class="fas fa-map-marker-alt text-gray-400"></i>
                      </div>
                      <input 
                        type="text" 
                        id="schedule-location" 
                        v-model="newScheduleItem.location"
                        class="w-full pl-10 px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                        placeholder="Укажите место проведения"
                      >
                    </div>
                  </div>
                  
                  <div>
                    <label for="schedule-responsible" class="block text-sm font-medium text-gray-700 mb-1">Ответственный</label>
                    <div class="relative">
                      <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <i class="fas fa-user text-gray-400"></i>
                      </div>
                      <input 
                        type="text" 
                        id="schedule-responsible" 
                        v-model="newScheduleItem.responsible"
                        class="w-full pl-10 px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                        placeholder="Имя ответственного лица"
                      >
                    </div>
                  </div>
                </div>
                
                <div class="flex justify-end space-x-3 mt-6">
                  <button 
                    @click="cancelScheduleItemForm" 
                    class="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                  >
                    Отмена
                  </button>
                  <button 
                    @click="saveScheduleItem" 
                    class="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition-colors duration-300"
                  >
                    Сохранить
                  </button>
                </div>
              </div>
            </div>
        </div>
      </div>
    </div>
  
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue';
import { useRouter } from 'vue-router';
import { useUserStore } from '@/stores/user';
import { plannerService } from '@/services/apiService';

// Инициализация сторов и роутера
const router = useRouter();
const userStore = useUserStore();

// Секции планировщика
const sections = [
  { id: 'overview', name: 'Обзор', icon: 'fas fa-home' },
  { id: 'tasks', name: 'Задачи', icon: 'fas fa-tasks' },
  { id: 'budget', name: 'Бюджет', icon: 'fas fa-wallet' },
  //  
];

// Активная секция
const activeSection = ref('overview');

// ----- Общие данные -----
const weddingDate = ref(null);
const showDatePicker = ref(false);
const newWeddingDate = ref('');

// Категории задач
const taskCategories = ref([
  { id: 1, name: 'Платье и костюм', icon: 'fas fa-tshirt' },
  { id: 2, name: 'Место проведения', icon: 'fas fa-map-marker-alt' },
  { id: 3, name: 'Ресторан', icon: 'fas fa-utensils' },
  { id: 4, name: 'Фото/Видео', icon: 'fas fa-camera' },
  { id: 5, name: 'Музыка', icon: 'fas fa-music' },
  { id: 6, name: 'Приглашения', icon: 'fas fa-envelope' },
  { id: 7, name: 'Цветы и декор', icon: 'fas fa-leaf' },
  { id: 8, name: 'Транспорт', icon: 'fas fa-car' }
]);

// Категории бюджета
const budgetCategories = ref([
  { id: 1, name: 'Платье и костюм', icon: 'fas fa-tshirt', color: '#FF6B6B' },
  { id: 2, name: 'Место проведения', icon: 'fas fa-map-marker-alt', color: '#4ECDC4' },
  { id: 3, name: 'Ресторан', icon: 'fas fa-utensils', color: '#FFD166' },
  { id: 4, name: 'Фото/Видео', icon: 'fas fa-camera', color: '#118AB2' },
  { id: 5, name: 'Музыка', icon: 'fas fa-music', color: '#073B4C' },
  { id: 6, name: 'Приглашения', icon: 'fas fa-envelope', color: '#06D6A0' },
  { id: 7, name: 'Цветы и декор', icon: 'fas fa-leaf', color: '#8338EC' },
  { id: 8, name: 'Транспорт', icon: 'fas fa-car', color: '#FB5607' }
]);

// Группы гостей
const guestGroups = ref([
  { id: 1, name: 'Семья невесты' },
  { id: 2, name: 'Семья жениха' },
  { id: 3, name: 'Друзья невесты' },
  { id: 4, name: 'Друзья жениха' },
  { id: 5, name: 'Коллеги' },
  { id: 6, name: 'Родственники' }
]);

// Функция загрузки групп гостей с сервера
const loadGuestGroups = async () => {
  try {
    const response = await plannerService.getGuestGroups();
    if (response && response.length > 0) {
      guestGroups.value = response;
      console.log('Загружены группы гостей с сервера:', response);
    } else {
      // Если группы не загрузились, оставляем тестовые данные
      console.log('С сервера не получены группы гостей, используются стандартные группы');
    }
  } catch (error) {
    console.error('Ошибка при загрузке групп гостей:', error);
    // В случае ошибки используем предустановленные группы
  }
};

// ----- Данные для обзора -----
// Таймер до свадьбы
const weddingCountdown = computed(() => {
  if (!weddingDate.value) return { days: 0, hours: 0, minutes: 0 };
  
  const now = new Date();
  const wedding = new Date(weddingDate.value);
  const diff = wedding - now;
  
  if (diff <= 0) return { days: 0, hours: 0, minutes: 0 };
  
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
  
  return { days, hours, minutes };
});

// Прогресс подготовки
const preparationProgress = computed(() => {
  if (totalTasks.value === 0) return 0;
  return Math.round((completedTasks.value / totalTasks.value) * 100);
});

// Бюджет
const totalBudget = ref(1000000); // 1 000 000 ₽
const spentBudget = computed(() => {
  // Используем исправленную функцию с преобразованием строк в числа
  return getTotalSpentBudget();
});
const budgetProgress = computed(() => {
  if (totalBudget.value === 0) return 0;
  return Math.min(100, Math.round((spentBudget.value / totalBudget.value) * 100));
});

// Ближайшие задачи
const upcomingTasks = computed(() => {
  return tasks.value
    .filter(task => !task.completed)
    .sort((a, b) => new Date(a.deadline) - new Date(b.deadline))
    .slice(0, 3);
});

// Статистика
const totalGuests = computed(() => guests.value.length);
const confirmedGuests = computed(() => guests.value.filter(guest => guest.status === 'confirmed').length);
const declinedGuests = computed(() => guests.value.filter(guest => guest.status === 'declined').length);
const pendingGuests = computed(() => guests.value.filter(guest => guest.status === 'pending').length);
const totalVendors = ref(0);
const daysUntilWedding = computed(() => weddingCountdown.value.days);

// ----- Данные для задач -----
const tasks = ref([]);
const totalTasks = computed(() => tasks.value.length);
const completedTasks = computed(() => tasks.value.filter(task => task.completed).length);

const showNewTaskForm = ref(false);
const editingTask = ref(null);
const taskToDelete = ref(null);
const newTask = ref({
  title: '',
  category_id: 1,
  deadline: '',
  assigned_to: '',
  description: '',
  completed: false
});

// Временная шкала
const timelineStart = ref(0);
const timelineMonths = computed(() => {
  const months = [];
  const today = new Date();
  
  // Создаем 12 месяцев от текущей даты
  for (let i = 0; i < 12; i++) {
    const date = new Date(today.getFullYear(), today.getMonth() + i, 1);
    months.push({
      date,
      name: date.toLocaleString('ru-RU', { month: 'long' }),
      isCurrent: i === 0
    });
  }
  
  return months;
});

const visibleMonths = computed(() => {
  return timelineMonths.value.slice(timelineStart.value, timelineStart.value + 4);
});

const timelineMonthsText = computed(() => {
  const first = visibleMonths.value[0].name;
  const last = visibleMonths.value[visibleMonths.value.length - 1].name;
  return `${first} - ${last}`;
});

// Фильтрация задач
const selectedCategories = ref([]);
const filteredTasks = computed(() => {
  if (selectedCategories.value.length === 0) return tasks.value;
  
  // Фильтруем задачи по выбранным категориям, учитывая различные форматы категорий
  return tasks.value.filter(task => {
    // Если есть category_id в задаче
    if (task.category_id !== undefined) {
      return selectedCategories.value.includes(task.category_id);
    }
    // Если есть объект категории
    else if (task.category && typeof task.category === 'object') {
      return selectedCategories.value.includes(task.category.id);
    }
    // Если в task.category записан ID категории
    else if (task.category) {
      return selectedCategories.value.includes(task.category);
    }
    return false;
  });
});

const filteredTasksByCategory = computed(() => {
  const categories = {};
  
  // Инициализируем категории
  selectedCategories.value.forEach(categoryId => {
    categories[categoryId] = {
      id: categoryId,
      tasks: []
    };
  });
  
  // Если нет выбранных категорий, используем все категории
  if (selectedCategories.value.length === 0) {
    taskCategories.value.forEach(category => {
      categories[category.id] = {
        id: category.id,
        tasks: []
      };
    });
    
    // Добавим категорию для задач без категории
    categories['uncategorized'] = {
      id: 'uncategorized',
      tasks: []
    };
  }
  
  // Группируем задачи по категориям, учитывая различные форматы категорий
  filteredTasks.value.forEach(task => {
    let categoryId;
    
    // Определяем ID категории задачи
    if (task.category_id !== undefined) {
      categoryId = task.category_id;
    } else if (task.category && typeof task.category === 'object') {
      categoryId = task.category.id;
    } else if (task.category) {
      categoryId = task.category;
    } else {
      categoryId = 'uncategorized';
    }
    
    // Если категория существует, добавляем в нее задачу
    if (categories[categoryId]) {
      categories[categoryId].tasks.push(task);
    } 
    // Если категории нет в списке, добавляем в некатегоризированные
    else if (categories['uncategorized']) {
      categories['uncategorized'].tasks.push(task);
    }
  });
  
  // Удаляем пустые категории
  return Object.values(categories).filter(category => category.tasks.length > 0);
});

// ----- Данные для бюджета -----
const budgetItems = ref([]);
const showNewBudgetItemForm = ref(false);
const editingBudgetItem = ref(null);
const budgetItemToDelete = ref(null);
const showSetBudgetForm = ref(false);
const newTotalBudget = ref(1000000);
const newBudgetItem = ref({
  category_id: 1,
  description: '',
  planned_amount: 0,
  actual_amount: 0,
  vendor: '',
  date: '',
  notes: '',
  is_paid: false
});

// Загрузка чеков
const receiptUploadItem = ref(null);
const receiptFile = ref(null);

// Фильтрация бюджета
const budgetCategoryFilter = ref('');
const budgetStatusFilter = ref('');
const filteredBudgetItems = computed(() => {
  return budgetItems.value.filter(item => {
    // Фильтр по категории
    if (budgetCategoryFilter.value && item.category_id !== parseInt(budgetCategoryFilter.value)) {
      return false;
    }
    
    // Фильтр по статусу
    if (budgetStatusFilter.value === 'paid' && !item.is_paid) {
      return false;
    }
    if (budgetStatusFilter.value === 'planned' && item.is_paid) {
      return false;
    }
    
    return true;
  });
});

// Бюджет по категориям для диаграммы
const budgetByCategory = computed(() => {
  const categories = {};
  let startAngle = 0;
  
  // Инициализируем категории из budgetCategories
  budgetCategories.value.forEach(category => {
    categories[category.id] = {
      id: category.id,
      name: category.name,
      color: category.color,
      spent: 0,
      percentage: 0,
      startAngle: 0
    };
  });
  
  // Считаем сумму по каждой категории
  budgetItems.value.forEach(item => {
    if (categories[item.category_id]) {
      categories[item.category_id].spent += item.actual_amount || 0;
    }
  });
  
  // Считаем процент от общей суммы и угол начала для каждой категории
  const totalSpent = spentBudget.value;
  if (totalSpent > 0) {
    Object.values(categories).forEach(category => {
      category.percentage = Math.round((category.spent / totalSpent) * 100);
      category.startAngle = startAngle;
      startAngle += category.percentage * 3.6; // 3.6 = 360 / 100
    });
  }
  
  // Возвращаем только категории с расходами
  return Object.values(categories).filter(category => category.spent > 0);
});

// ----- Данные для гостей -----
const guests = ref([
  { id: 1, name: 'Иван Иванов', group_id: 1, contact: '+7 (999) 123-45-67', status: 'confirmed', notes: 'Гость со стороны невесты' },
  { id: 2, name: 'Мария Петрова', group_id: 2, contact: '+7 (999) 987-65-43', status: 'pending', notes: 'Подруга невесты' },
  { id: 3, name: 'Алексей Сидоров', group_id: 1, contact: '+7 (999) 555-44-33', status: 'declined', notes: 'Друг жениха' }
]);
const showNewGuestForm = ref(false);
const editingGuest = ref(null);
const guestToDelete = ref(null);
const newGuest = ref({
  name: '',
  group_id: 1,
  contact: '',
  status: 'pending',
  notes: ''
});

// Группы гостей уже определены в коде выше, на строках 1509-1516

// Фильтрация гостей
const guestGroupFilter = ref('');
const guestStatusFilter = ref('');
const guestSearchQuery = ref('');
const filteredGuests = computed(() => {
  console.log('Вызов filteredGuests, guests.value =', guests.value);
  return guests.value.filter(guest => {
    // Фильтр по группе
    if (guestGroupFilter.value && guest.group_id !== parseInt(guestGroupFilter.value)) {
      return false;
    }
    
    // Фильтр по статусу
    if (guestStatusFilter.value && guest.status !== guestStatusFilter.value) {
      return false;
    }
    
    // Поиск по имени
    if (guestSearchQuery.value && !guest.name.toLowerCase().includes(guestSearchQuery.value.toLowerCase())) {
      return false;
    }
    
    return true;
  });
});

// ----- Сводные данные по гостям -----
// Вычисляемые свойства для статистики гостей
// Подсчёт общего количества гостей
const guestCount = computed(() => {
  return guests.value.length;
});

// Количество подтвердившихся гостей
const confirmedGuestCount = computed(() => {
  return guests.value.filter(guest => guest.status === 'confirmed').length;
});

// Количество отказавшихся гостей
const declinedGuestCount = computed(() => {
  return guests.value.filter(guest => guest.status === 'declined').length;
});

// Количество ожидающих ответа гостей
const pendingGuestCount = computed(() => {
  return guests.value.filter(guest => guest.status === 'pending').length;
});

// Функция для получения названия группы по её ID
const getGroupName = (groupId) => {
  if (!groupId) return 'Не указана';
  const group = guestGroups.value.find(g => g.id === groupId);
  return group ? group.name : 'Неизвестная группа';
};

// Функция для получения понятного названия статуса
const getStatusLabel = (status) => {
  const statusMap = {
    'confirmed': 'Подтвержден',
    'declined': 'Отказался',
    'pending': 'Ожидается'
  };
  return statusMap[status] || 'Неизвестно';
};

// ----- Данные для расписания дня -----
const scheduleItems = ref([]);
const showNewScheduleItemForm = ref(false);
const editingScheduleItem = ref(null);
const scheduleItemToDelete = ref(null);
const newScheduleItem = ref({
  title: '',
  time: '',
  description: '',
  location: '',
  responsible: ''
});

// Сортировка событий расписания по времени
const sortedScheduleItems = computed(() => {
  return [...scheduleItems.value].sort((a, b) => {
    return a.time.localeCompare(b.time);
  });
});

// ----- Методы -----
// Общие методы
const formatCurrency = (amount) => {
  return new Intl.NumberFormat('ru-RU', { style: 'currency', currency: 'RUB', maximumFractionDigits: 0 }).format(amount);
};

const formatDate = (dateString) => {
  if (!dateString) return '';
  const date = new Date(dateString);
  return date.toLocaleDateString('ru-RU', { day: 'numeric', month: 'long', year: 'numeric' });
};

const formatTime = (timeString) => {
  if (!timeString) return '';
  const [hours, minutes] = timeString.split(':');
  return `${hours}:${minutes}`;
};

const getTodayString = () => {
  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, '0');
  const day = String(today.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

// Получение имен и иконок
const getCategoryName = (categoryId) => {
  const category = taskCategories.value.find(c => c.id === categoryId);
  return category ? category.name : '';
};

const getCategoryIcon = (categoryId) => {
  const category = taskCategories.value.find(c => c.id === categoryId);
  return category ? category.icon : 'fas fa-question';
};

const getCategoryColor = (categoryId) => {
  const category = budgetCategories.value.find(c => c.id === categoryId);
  return category ? category.color : '#ccc';
};

// Функция getGroupName уже определена выше

// Функция getStatusLabel уже определена выше

// Функция для отображения названия приоритета задачи
const getPriorityName = (priority) => {
  // Проверяем, является ли значение числом
  if (!isNaN(Number(priority))) {
    switch (Number(priority)) {
      case 3: return 'Высокий';
      case 2: return 'Средний';
      case 1: return 'Низкий';
      default: return 'Обычный';
    }
  } else {
    // Обрабатываем строковые значения
    switch (priority) {
      case 'high': return 'Высокий';
      case 'medium': return 'Средний';
      case 'low': return 'Низкий';
      default: return 'Обычный';
    }
  }
};

// Функция для определения CSS класса приоритета
const getPriorityClass = (priority) => {
  // Проверяем, является ли значение числом
  if (!isNaN(Number(priority))) {
    switch (Number(priority)) {
      case 3: return 'bg-red-100 text-red-800'; // Высокий приоритет
      case 2: return 'bg-amber-100 text-amber-800'; // Средний
      case 1: return 'bg-blue-100 text-blue-800'; // Низкий
      default: return 'bg-gray-100 text-gray-800';
    }
  } else {
    // Обрабатываем строковые значения
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-800';
      case 'medium': return 'bg-amber-100 text-amber-800';
      case 'low': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  }
};

// Инициализация данных при монтировании компонента
onMounted(() => {
  console.log('Компонент PlannerView смонтирован');
  
  // Инициализация данных при монтировании компонента
  const initData = async () => {
    try {
      console.log('Начало инициализации данных планировщика...');
      
      // Загружаем детали свадьбы через API (самый важный шаг)
      await loadWeddingDetails();
      console.log('Дата свадьбы после загрузки:', weddingDate.value, 'Таймер:', weddingCountdown.value);
      
      // Загружаем категории задач с сервера
      await loadTaskCategories();
      
      // Затем загружаем задачи
      await loadTasks();
      
      // Загрузка остальных данных
      loadBudgetItems();
      loadGuests();
      loadScheduleItems();
      
      console.log('Инициализация завершена успешно');
    } catch (error) {
      console.error('Ошибка при инициализации данных:', error);
    }
  };
  
  // Загрузка даты свадьбы из профиля пользователя
  const loadWeddingDate = async () => {
    try {
      // Получаем данные из профиля пользователя
      const userData = userStore.user;
      console.log('Данные пользователя для даты свадьбы:', userData);
      
      // Проверяем наличие даты свадьбы в профиле
      if (userData && userData.couple_profile && userData.couple_profile.wedding_details && userData.couple_profile.wedding_details.wedding_date) {
        weddingDate.value = userData.couple_profile.wedding_details.wedding_date;
        console.log('Загружена дата свадьбы из профиля:', weddingDate.value);
      } else {
        console.log('Дата свадьбы в профиле не найдена');
        
        // Если даты в профиле нет, пробуем взять из localStorage
        const savedWeddingDate = localStorage.getItem('weddingDate');
        if (savedWeddingDate) {
          weddingDate.value = savedWeddingDate;
          console.log('Загружена дата свадьбы из localStorage:', weddingDate.value);
        }
      }
    } catch (error) {
      console.error('Ошибка при загрузке даты свадьбы:', error);
    }
  };
  
    // Загрузка общего бюджета
  const savedTotalBudget = localStorage.getItem('totalBudget');
  if (savedTotalBudget) {
    totalBudget.value = Number(savedTotalBudget);
  }
  
  // Запускаем загрузку данных
  initData();
});

const getStatusClass = (status) => {
  switch (status) {
    case 'confirmed': return 'status-confirmed';
    case 'declined': return 'status-declined';
    case 'pending': return 'status-pending';
    default: return '';
  }
};

// Методы для свадебной даты
const setWeddingDate = async () => {
  weddingDate.value = newWeddingDate.value;
  showDatePicker.value = false;
  
  // Сохранение в localStorage и на сервере
  localStorage.setItem('weddingDate', weddingDate.value);
  
  // Отправляем дату на сервер для сохранения в профиле
  try {
    await plannerService.updateWeddingDetails({ wedding_date: weddingDate.value });
    console.log('Дата свадьбы успешно сохранена на сервере:', weddingDate.value);
    
    // Обновляем данные пользователя в сторе, чтобы отобразить изменения без перезагрузки
    await userStore.fetchUser();
  } catch (error) {
    console.error('Ошибка при сохранении даты свадьбы на сервере:', error);
  }
};

// Методы для задач
const moveTimeline = (direction) => {
  timelineStart.value = Math.max(0, Math.min(9, timelineStart.value + direction));
};

const toggleCategoryFilter = (categoryId) => {
  const index = selectedCategories.value.indexOf(categoryId);
  if (index === -1) {
    selectedCategories.value.push(categoryId);
  } else {
    selectedCategories.value.splice(index, 1);
  }
};

const getTaskCountForMonth = (date) => {
  return tasks.value.filter(task => {
    const taskDate = new Date(task.deadline);
    return taskDate.getMonth() === date.getMonth() && taskDate.getFullYear() === date.getFullYear();
  }).length;
};

const editTask = (task) => {
  editingTask.value = task;
  newTask.value = { ...task };
};



const confirmDeleteTask = (task) => {
  taskToDelete.value = task;
};

const cancelTaskForm = () => {
  showNewTaskForm.value = false;
  editingTask.value = null;
  newTask.value = {
    title: '',
    category_id: 1,
    deadline: '',
    assigned_to: '',
    notes: '',
    completed: false
  };
};

const saveTask = async () => {
  if (!newTask.value.title || !newTask.value.deadline || !newTask.value.category_id) {
    alert('Пожалуйста, заполните все обязательные поля (название, категория, срок)');
    return;
  }
  
  try {
    // Подготовим данные для отправки на сервер
    const taskData = { ...newTask.value };
    
    // Конвертируем числовые приоритеты в строковые коды, ожидаемые бэкендом
    if (taskData.priority) {
      switch (Number(taskData.priority)) {
        case 3:
          taskData.priority = 'high'; // Высокий
          break;
        case 2:
          taskData.priority = 'medium'; // Средний
          break;
        case 1:
          taskData.priority = 'low'; // Низкий
          break;
        default:
          taskData.priority = 'medium'; // По умолчанию средний
      }
    }
    
    // Преобразуем категорию задачи для бэкенда
    if (taskData.category_id) {
      // Устанавливаем поле category для бэкенда
      taskData.category = Number(taskData.category_id);
      // Удаляем category_id, т.к. бэкенд ожидает поле category
      delete taskData.category_id;
    }
    
    // Преобразуем дату в формат для бэкенда, если она есть
    if (taskData.deadline && typeof taskData.deadline === 'string') {
      taskData.due_date = taskData.deadline; // Бэкенд ожидает due_date, не deadline
      delete taskData.deadline;
    }
    
    console.log('Отправляем задачу:', taskData);
    
    // Отправляем запрос к API
    if (editingTask.value) {
      // Обновление существующей задачи через API
      const response = await plannerService.updateTask(editingTask.value.id, taskData);
      
      // Обновляем задачу в локальном массиве
      const index = tasks.value.findIndex(t => t.id === editingTask.value.id);
      if (index !== -1) {
        tasks.value[index] = { ...response }; // Используем данные с сервера
      }
    } else {
      // Создание новой задачи через API
      const response = await plannerService.createTask(taskData);
      
      // Добавляем новую задачу с ID, полученным с сервера
      tasks.value.push(response);
    }
    
    // Сохраняем и в localStorage для быстрого доступа
    localStorage.setItem('tasks', JSON.stringify(tasks.value));
    
    // Сброс формы
    cancelTaskForm();
  } catch (error) {
    console.error('Ошибка при сохранении задачи:', error);
    
    // Показываем более информативное сообщение об ошибке
    if (error.errors) {
      // Если есть детализация ошибок от API
      const errorMessages = Object.entries(error.errors)
        .map(([field, msgs]) => `${field}: ${msgs.join(', ')}`)
        .join('\n');
      alert(`Ошибка валидации:\n${errorMessages}`);
    } else {
      alert(error.message || 'Произошла ошибка при сохранении задачи');
    }
  }
};

const deleteTask = async () => {
  if (!taskToDelete.value) return;
  
  try {
    // Удаляем задачу с сервера
    await plannerService.deleteTask(taskToDelete.value.id);
    
    // Удаляем задачу из локального массива
    const index = tasks.value.findIndex(t => t.id === taskToDelete.value.id);
    if (index !== -1) {
      tasks.value.splice(index, 1);
    }
    
    // Сохранение в localStorage
    localStorage.setItem('tasks', JSON.stringify(tasks.value));
    
    // Сброс
    taskToDelete.value = null;
  } catch (error) {
    console.error('Ошибка при удалении задачи:', error);
    alert(error.message || 'Произошла ошибка при удалении задачи');
  }
};

const updateTask = async (task) => {
  try {
    // Подготовим данные для отправки на сервер
    const taskData = { ...task };
    
    // Преобразование completed в status для бэкенда
    if (taskData.completed !== undefined) {
      taskData.status = taskData.completed ? 'done' : 'todo';
      delete taskData.completed;
    }
    
    // Если есть category_id, преобразуем его в category
    if (taskData.category_id !== undefined) {
      taskData.category = Number(taskData.category_id);
      delete taskData.category_id;
    }
    
    // Если есть deadline, преобразуем в due_date
    if (taskData.deadline && !taskData.due_date) {
      taskData.due_date = taskData.deadline;
      delete taskData.deadline;
    }
    
    // Преобразование числовых приоритетов в строковые
    if (taskData.priority && !isNaN(Number(taskData.priority))) {
      const priorityNum = Number(taskData.priority);
      if (priorityNum === 3) taskData.priority = 'high';
      else if (priorityNum === 2) taskData.priority = 'medium';
      else if (priorityNum === 1) taskData.priority = 'low';
    }

    console.log('Отправляем обновление задачи:', taskData);
    
    // Отправляем запрос на обновление
    const response = await plannerService.updateTask(task.id, taskData);
    console.log('Задача обновлена:', response);
    
    // Находим задачу в массиве и обновляем её
    const index = tasks.value.findIndex(t => t.id === task.id);
    if (index !== -1) {
      tasks.value[index] = { ...response };
      
      // Устанавливаем completed на основе status
      tasks.value[index].completed = response.status === 'done';
    }
    
    // Сохранение в localStorage
    localStorage.setItem('tasks', JSON.stringify(tasks.value));
  } catch (error) {
    console.error('Ошибка при обновлении задачи:', error);
    
    // Возвращаем предыдущее состояние чекбокса
    if (task.completed !== undefined) {
      task.completed = !task.completed;
    }
    
    // Показываем ошибку
    alert(error.message || 'Произошла ошибка при обновлении задачи');
  }
};

// Методы для бюджета
const setTotalBudget = () => {
  totalBudget.value = newTotalBudget.value;
  showSetBudgetForm.value = false;
  
  // Сохранение в localStorage
  localStorage.setItem('totalBudget', totalBudget.value.toString());
};

const editBudgetItem = (item) => {
  editingBudgetItem.value = item;
  newBudgetItem.value = { ...item };
};

const confirmDeleteBudgetItem = (item) => {
  budgetItemToDelete.value = item;
};

const cancelBudgetItemForm = () => {
  showNewBudgetItemForm.value = false;
  editingBudgetItem.value = null;
  newBudgetItem.value = {
    category_id: 1,
    title: '', // Добавляем обязательное поле для бэкенда
    description: '',
    planned_amount: 0,
    actual_amount: 0,
    vendor: '',
    date: '',
    notes: '',
    is_paid: false
  };
};

const saveBudgetItem = async () => {
  if (!newBudgetItem.value.description) {
    alert('Пожалуйста, заполните описание');
    return;
  }
  
  // Проверяем наличие обязательного поля title для API
  if (!newBudgetItem.value.title) {
    // Используем описание в качестве названия, если название не заполнено
    newBudgetItem.value.title = newBudgetItem.value.description;
  }
  
  try {
    // Копируем объект для безопасного изменения
    const budgetItemData = { ...newBudgetItem.value };
    
    // Преобразовываем поля для бэкенда
    // Преобразуем category_id в category для бэкенда
    if (budgetItemData.category_id) {
      budgetItemData.category = Number(budgetItemData.category_id);
      delete budgetItemData.category_id; // Удаляем category_id, т.к. бэкенд ожидает поле category
    }
    
    let response;
    
    if (editingBudgetItem.value) {
      // Обновление существующего расхода через API
      response = await plannerService.updateBudgetItem(editingBudgetItem.value.id, budgetItemData);
      console.log('Расход обновлен через API:', response);
      
      // Обновляем элемент в локальном массиве
      const index = budgetItems.value.findIndex(item => item.id === editingBudgetItem.value.id);
      if (index !== -1) {
        budgetItems.value[index] = { ...response };
      }
    } else {
      // Создание нового расхода через API
      response = await plannerService.createBudgetItem(budgetItemData);
      console.log('Создан новый расход через API:', response);
      
      // Добавляем новый элемент в локальный массив
      budgetItems.value.push(response);
    }
    
    // В случае успеха сохраняем в localStorage для офлайн-доступа
    localStorage.setItem('budgetItems', JSON.stringify(budgetItems.value));
    
    // Сброс формы
    cancelBudgetItemForm();
  } catch (error) {
    console.error('Ошибка при сохранении расхода:', error);
    alert('Произошла ошибка при сохранении расхода: ' + (error.message || 'Неизвестная ошибка'));
  }
};

const uploadReceipt = (item) => {
  receiptUploadItem.value = item;
  receiptFile.value = null;
};

const handleReceiptFileChange = (event) => {
  receiptFile.value = event.target.files[0];
};


const formatDateDay = (dateString) => {
  if (!dateString) return '';
  return new Date(dateString).toLocaleDateString('ru-RU', { day: 'numeric' });
};

const formatDateMonth = (dateString) => {
  if (!dateString) return '';
  return new Date(dateString).toLocaleDateString('ru-RU', { month: 'long' });
};


// ----- Методы для работы с задачами -----
// Загрузка категорий задач с сервера
const loadTaskCategories = async () => {
  try {
    const response = await plannerService.getTaskCategories();
    if (response && response.length > 0) {
      // Если категории успешно получены
      taskCategories.value = response;
      console.log('Загружены категории задач с сервера:', response);
    } else {
      console.log('На сервере нет категорий задач, используем локальные');
      // Если категории не получены, оставляем статические
    }
  } catch (error) {
    console.error('Ошибка при загрузке категорий задач:', error);
  }
};

// Загрузка задач с сервера
const loadTasks = async () => {
  try {
    // Загрузка задач с сервера
    const response = await plannerService.getTasks();
    
    if (response && response.length > 0) {
      console.log('Задачи получены с сервера:', response);
      
      // Добавляем поле category_id для совместимости с фронтендом
      tasks.value = response.map(task => {
        // Если у задачи есть связь с категорией
        if (task.category && typeof task.category === 'object') {
          return {
            ...task,
            category_id: task.category.id,
            // Преобразовываем статус в completed
            completed: task.status === 'done'
          };
        }
        // Если есть только ID категории
        else if (task.category) {
          return {
            ...task,
            category_id: task.category,
            completed: task.status === 'done'
          };
        } 
        // Если категории нет
        else {
          return {
            ...task,
            category_id: 1, // Ставим первую категорию по умолчанию
            completed: task.status === 'done'
          };
        }
      });
      
      // Сохранение в localStorage для оффлайн доступа
      localStorage.setItem('tasks', JSON.stringify(tasks.value));
    } else {
      tasks.value = [];
      console.log('На сервере нет задач');
    }
  } catch (error) {
    console.error('Ошибка при загрузке задач:', error);
    
    // Если не удалось получить с сервера, пробуем загрузить из localStorage
    const savedTasks = localStorage.getItem('tasks');
    if (savedTasks) {
      try {
        tasks.value = JSON.parse(savedTasks);
        console.log('Загружены задачи из localStorage');
      } catch (parseError) {
        console.error('Ошибка при загрузке задач из localStorage:', parseError);
        tasks.value = [];
      }
    } else {
      tasks.value = [];
    }
  }
};

// Загрузка элементов расписания из localStorage или API
const loadScheduleItems = async () => {
  try {
    // Пока загружаем из localStorage, в будущем может быть добавлен API
    const savedScheduleItems = localStorage.getItem('scheduleItems');
    if (savedScheduleItems) {
      scheduleItems.value = JSON.parse(savedScheduleItems);
      console.log('Загружены элементы расписания из localStorage');
    }
  } catch (error) {
    console.error('Ошибка при загрузке элементов расписания:', error);
    scheduleItems.value = [];
  }
};

// ----- Методы для работы с бюджетом -----
// Загрузка категорий бюджета с сервера
const loadBudgetCategories = async () => {
  try {
    const response = await plannerService.getBudgetCategories();
    if (response && response.length > 0) {
      // Если категории успешно получены, обновляем локальные данные
      // Преобразуем ответ от API в формат для фронтенда
      budgetCategories.value = response.map(category => ({
        id: category.id,
        name: category.name,
        icon: category.icon || 'fas fa-money-bill',  // Используем иконку по умолчанию, если нет у категории
        color: category.color || getRandomColor(),   // Генерируем цвет, если в API его нет
      }));
      console.log('Загружены категории бюджета с сервера:', response);
    } else {
      console.log('На сервере нет категорий бюджета, используем локальные');
    }
  } catch (error) {
    console.error('Ошибка при загрузке категорий бюджета:', error);
  }
};

// Загрузка элементов бюджета с сервера
const loadBudgetItems = async () => {
  try {
    const response = await plannerService.getBudget();
    if (response && response.length > 0) {
      budgetItems.value = response;
      console.log('Загружены элементы бюджета с сервера:', response);
      // Сохраняем в localStorage для офлайн-доступа
      localStorage.setItem('budgetItems', JSON.stringify(budgetItems.value));
    } else {
      console.log('На сервере нет элементов бюджета, пробуем загрузить из localStorage');
      
      // Если с сервера ничего не получилось, пробуем загрузить из localStorage
      const savedBudget = localStorage.getItem('budgetItems');
      if (savedBudget) {
        try {
          budgetItems.value = JSON.parse(savedBudget);
          console.log('Загружены элементы бюджета из localStorage');
        } catch (parseError) {
          console.error('Ошибка при загрузке бюджета из localStorage:', parseError);
          budgetItems.value = [];
        }
      } else {
        budgetItems.value = [];
      }
    }
  } catch (error) {
    console.error('Ошибка при загрузке бюджета:', error);
    
    // В случае ошибки API, пробуем загрузить из localStorage
    const savedBudget = localStorage.getItem('budgetItems');
    if (savedBudget) {
      try {
        budgetItems.value = JSON.parse(savedBudget);
        console.log('Загружены элементы бюджета из localStorage');
      } catch (parseError) {
        console.error('Ошибка при загрузке бюджета из localStorage:', parseError);
        budgetItems.value = [];
      }
    } else {
      budgetItems.value = [];
    }
  }
};

// Удаление элемента бюджета
const deleteBudgetItem = async () => {
  if (!budgetItemToDelete.value) return;
  
  try {
    // Удаляем через API
    await plannerService.deleteBudgetItem(budgetItemToDelete.value.id);
    console.log('Расход успешно удален:', budgetItemToDelete.value.id);
    
    // Удаляем из локального массива
    budgetItems.value = budgetItems.value.filter(item => item.id !== budgetItemToDelete.value.id);
    
    // Обновляем в localStorage
    localStorage.setItem('budgetItems', JSON.stringify(budgetItems.value));
    
    // Сбрасываем идентификатор удаляемого элемента
    budgetItemToDelete.value = null;
  } catch (error) {
    console.error('Ошибка при удалении расхода:', error);
    alert('Произошла ошибка при удалении расхода: ' + (error.message || 'Неизвестная ошибка'));
    budgetItemToDelete.value = null;
  }
};

const saveReceipt = async () => {
  // Здесь будет метод загрузки чека через API
  receiptUploadItem.value = null;
};

// Функция генерации случайного HEX-цвета для категорий
const getRandomColor = () => {
  // Массив предопределенных цветов для лучшей визуальной совместимости
  const colors = [
    '#f87171', // red-400
    '#fb923c', // orange-400
    '#fbbf24', // amber-400
    '#facc15', // yellow-400
    '#a3e635', // lime-400
    '#4ade80', // green-400
    '#34d399', // emerald-400
    '#2dd4bf', // teal-400
    '#22d3ee', // cyan-400
    '#38bdf8', // sky-400
    '#60a5fa', // blue-400
    '#818cf8', // indigo-400
    '#a78bfa', // violet-400
    '#c084fc', // purple-400
    '#e879f9', // fuchsia-400
    '#f472b6', // pink-400
    '#fb7185', // rose-400
  ];
  
  // Возвращаем случайный цвет из массива
  return colors[Math.floor(Math.random() * colors.length)];
};

// Функции для работы с категориями бюджета
const getBudgetCategoryName = (categoryId, item) => {
  // Если передан бюджетный элемент и в нём есть category_name, используем его
  if (item && item.category_name) {
    return item.category_name;
  }
  
  // Иначе ищем в загруженных категориях
  const category = budgetCategories.value.find(cat => cat.id === categoryId);
  return category ? category.name : 'Неизвестная категория';
};

const getBudgetCategoryColor = (categoryId, item) => {
  // Сначала пробуем найти категорию в загруженных категориях
  const category = budgetCategories.value.find(cat => cat.id === categoryId);
  if (!category) return 'bg-gray-500'; // Цвет по умолчанию, если категория не найдена
  
  // Если цвет указан в HEX-формате, преобразуем его в класс Tailwind
  const color = category.color || '#6366f1'; // Цвет по умолчанию - индиго
  
  // Карта соответствия цветов к классам Tailwind
  const colorMap = {
    '#f87171': 'bg-red-400',
    '#fb923c': 'bg-orange-400',
    '#fbbf24': 'bg-amber-400',
    '#facc15': 'bg-yellow-400',
    '#a3e635': 'bg-lime-400',
    '#4ade80': 'bg-green-400',
    '#34d399': 'bg-emerald-400',
    '#2dd4bf': 'bg-teal-400',
    '#22d3ee': 'bg-cyan-400',
    '#38bdf8': 'bg-sky-400',
    '#60a5fa': 'bg-blue-400',
    '#818cf8': 'bg-indigo-400',
    '#a78bfa': 'bg-violet-400',
    '#c084fc': 'bg-purple-400',
    '#e879f9': 'bg-fuchsia-400',
    '#f472b6': 'bg-pink-400',
    '#fb7185': 'bg-rose-400',
    '#6366f1': 'bg-indigo-500',
    '#000000': 'bg-gray-900',
    '#a1a1aa': 'bg-zinc-400',
  };
  
  // Возвращаем класс Tailwind или дефолтный цвет если такого цвета нет в карте
  return colorMap[color] || 'bg-indigo-500';
};

const getTotalPlannedBudget = () => {
  return filteredBudgetItems.value.reduce((sum, item) => {
    // Преобразуем строку в число
    const amount = parseFloat(item.planned_amount) || 0;
    return sum + amount;
  }, 0);
};

const getTotalSpentBudget = () => {
  return filteredBudgetItems.value.reduce((sum, item) => {
    // Преобразуем строку в число
    const amount = parseFloat(item.actual_amount) || 0;
    return sum + amount;
  }, 0);
};

const getTotalRemainingBudget = () => {
  return getTotalPlannedBudget() - getTotalSpentBudget();
};

// Вычисляемые свойства для отображения в шаблоне
// Для использования в разных частях шаблона (обзор и бюджет)
// totalSpent используется в разделе общего обзора
const totalSpent = computed(() => getTotalSpentBudget());

// НЕ создаем дублирующее определение totalBudget и spentBudget,
// т.к. они уже существуют в коде как ref и computed соответственно

// ----- Методы для работы с гостями -----
const loadGuests = async () => {
  try {
    const response = await plannerService.getGuests();
    if (response && response.length > 0) {
      guests.value = response;
      console.log('Загружены гости с сервера:', response);
    } else {
      // Если с сервера ничего не пришло, используем тестовые данные
      guests.value = [
        { id: 1, name: 'Иван Иванов', group_id: 1, contact: '+7 (999) 123-45-67', status: 'confirmed', notes: 'Гость со стороны невесты' },
        { id: 2, name: 'Мария Петрова', group_id: 2, contact: '+7 (999) 987-65-43', status: 'pending', notes: 'Подруга невесты' },
        { id: 3, name: 'Алексей Сидоров', group_id: 1, contact: '+7 (999) 555-44-33', status: 'declined', notes: 'Друг жениха' }
      ];
      console.log('На сервере нет гостей, используем тестовые данные:', guests.value);
    }
    // Дополнительно логируем для отладки сразу после загрузки
    console.log('Текущее значение guests.value после загрузки:', guests.value);
    console.log('Текущее значение filteredGuests.value:', filteredGuests.value);
  } catch (error) {
    console.error('Ошибка при загрузке гостей:', error);
    // В случае ошибки также используем тестовые данные
    guests.value = [
      { id: 1, name: 'Иван Иванов', group_id: 1, contact: '+7 (999) 123-45-67', status: 'confirmed', notes: 'Гость со стороны невесты' },
      { id: 2, name: 'Мария Петрова', group_id: 2, contact: '+7 (999) 987-65-43', status: 'pending', notes: 'Подруга невесты' },
      { id: 3, name: 'Алексей Сидоров', group_id: 1, contact: '+7 (999) 555-44-33', status: 'declined', notes: 'Друг жениха' }
    ];
    console.log('В случае ошибки используем тестовые данные для гостей');
  }
};

const saveGuest = async () => {
  try {
    if (editingGuest.value) {
      await plannerService.updateGuest(editingGuest.value.id, newGuest.value);
    } else {
      await plannerService.createGuest(newGuest.value);
    }
    
    await loadGuests();
    cancelGuestForm();
  } catch (error) {
    console.error('Ошибка при сохранении гостя:', error);
  }
};

const editGuest = (guest) => {
  editingGuest.value = guest;
  newGuest.value = { ...guest };
  showNewGuestForm.value = true;
};

const cancelGuestForm = () => {
  showNewGuestForm.value = false;
  editingGuest.value = null;
  newGuest.value = {
    name: '',
    group_id: 1,
    contact: '',
    status: 'pending',
    notes: '',
    plus_one: false,
    dietary_restrictions: '',
    table_number: null
  };
};

const confirmDeleteGuest = (guest) => {
  guestToDelete.value = guest;
};

const deleteGuest = async () => {
  try {
    if (guestToDelete.value) {
      await plannerService.deleteGuest(guestToDelete.value.id);
      await loadGuests();
      guestToDelete.value = null;
    }
  } catch (error) {
    console.error('Ошибка при удалении гостя:', error);
  }
};

const updateGuestStatus = async (guest, status) => {
  try {
    await plannerService.updateGuest(guest.id, { ...guest, status });
    await loadGuests();
  } catch (error) {
    console.error('Ошибка при обновлении статуса гостя:', error);
  }
};



// ----- Методы для работы с датой свадьбы -----
// Состояние даты свадьбы, синхронизированной с профилем пары
// const weddingDate = ref('');
const weddingDisplayDate = ref('');
const weddingTime = ref('');
const weddingVenue = ref('');

// Загрузка деталей свадьбы из профиля пользователя
const loadWeddingDetails = async () => {
  try {
    // Получаем детали свадьбы через plannerService
    // Метод getWeddingDetails теперь возвращает только wedding_details из профиля
    const weddingDetails = await plannerService.getWeddingDetails();
    console.log('Получены детали свадьбы из API:', weddingDetails);
    
    // Проверяем, что детали свадьбы не пустые и есть дата
    if (weddingDetails && weddingDetails.date) {
      // Сохраняем дату в исходном формате для вычислений
      weddingDate.value = weddingDetails.date;
      console.log('Установлена дата свадьбы из API:', weddingDate.value);
      
      // Форматируем дату для отображения
      try {
        const dateObj = new Date(weddingDate.value);
        if (!isNaN(dateObj.getTime())) {
          weddingDisplayDate.value = dateObj.toLocaleDateString('ru-RU');
          console.log('Дата свадьбы для отображения:', weddingDisplayDate.value);
        } else {
          console.warn('Неверный формат даты:', weddingDate.value);
        }
      } catch (e) {
        console.warn('Ошибка при форматировании даты свадьбы:', e);
      }
      
      // Сохраняем другие детали свадьбы
      if (weddingDetails.wedding_time) {
        weddingTime.value = weddingDetails.wedding_time;
      }
      if (weddingDetails.wedding_venue) {
        weddingVenue.value = weddingDetails.wedding_venue;
      }
      
      // Сохраняем в localStorage для быстрого доступа и оффлайн-режима
      localStorage.setItem('weddingDate', weddingDate.value);
    } else {
      console.warn('Дата свадьбы не найдена в ответе API, проверяем localStorage');
      
      // Пробуем восстановить из localStorage
      const savedWeddingDate = localStorage.getItem('weddingDate');
      if (savedWeddingDate) {
        weddingDate.value = savedWeddingDate;
        console.log('Восстановлена дата свадьбы из localStorage:', weddingDate.value);
        
        // Форматируем дату для отображения
        try {
          const dateObj = new Date(weddingDate.value);
          if (!isNaN(dateObj.getTime())) {
            weddingDisplayDate.value = dateObj.toLocaleDateString('ru-RU');
          }
        } catch (e) {
          console.warn('Ошибка при форматировании даты из localStorage:', e);
        }
      } else {
        console.warn('Детали свадьбы не найдены ни в API, ни в localStorage');
      }
    }
    
    // Проверим таймер
    console.log('Таймер обратного отсчёта:', weddingCountdown.value);
  } catch (error) {
    console.error('Ошибка при загрузке деталей свадьбы:', error);
    // В случае ошибки пытаемся загрузить данные из localStorage
    const savedWeddingDate = localStorage.getItem('weddingDate');
    if (savedWeddingDate) {
      weddingDate.value = savedWeddingDate;
      console.log('Загружена дата свадьбы из localStorage после ошибки API:', weddingDate.value);
    }
  }
};

// Сохранение деталей свадьбы в профиль пользователя
const saveWeddingDetails = async () => {
  try {
    console.log('Сохранение даты свадьбы:', weddingDate.value);
    
    // Формируем объект с деталями свадьбы для отправки на сервер
    const weddingDetails = {
      date: weddingDate.value,
      time: weddingTime.value,
      venue: weddingVenue.value
    };
    
    // Вызываем API для обновления деталей свадьбы
    await profileService.updateWeddingDetails(weddingDetails);
    
    console.log('Детали свадьбы успешно сохранены');
    
    // Обновляем форматированную дату для отображения
    if (weddingDate.value) {
      try {
        const date = new Date(weddingDate.value);
        if (!isNaN(date.getTime())) {
          weddingDisplayDate.value = date.toLocaleDateString('ru-RU');
        }
      } catch (e) {
        console.warn('Ошибка при форматировании даты свадьбы после сохранения:', e);
      }
    }
    
    // Можно добавить уведомление для пользователя о успешном сохранении
    // toastMessage('Дата свадьбы успешно сохранена');
    
    return true;
  } catch (error) {
    console.error('Ошибка при сохранении деталей свадьбы:', error);
    
    // Можно добавить уведомление для пользователя об ошибке
    // toastError('Ошибка при сохранении даты свадьбы');
    
    return false;
  }
};




// ----- Жизненный цикл компонента -----
onMounted(async () => {
  if (!userStore.isAuthenticated) {
    router.push('/login');
    return;
  }
  
  // Загружаем данные планировщика
  try {
    // Загружаем детали свадьбы из профиля пользователя
    await loadWeddingDetails();
    
    // Загружаем задачи
    await loadTasks();
    
    // Загружаем категории бюджета
    await loadBudgetCategories();
    
    // Загружаем элементы бюджета
    await loadBudgetItems();
    
    // Загружаем группы гостей
    await plannerService.getGuestGroups().then(response => {
      if (response && response.length > 0) {
        guestGroups.value = response;
        console.log('Загружены группы гостей с сервера:', response);
      }
    }).catch(error => {
      console.error('Ошибка при загрузке групп гостей:', error);
    });
    
    // Загружаем гостей
    await loadGuests();
    
    // Загружаем детали свадьбы (дата и т.д.)
    // Здесь будет метод загрузки деталей свадьбы через API
  } catch (error) {
    console.error('Ошибка при загрузке данных планировщика:', error);
  }
});

// Обновление счетчика до свадьбы и загрузка данных
let countdownInterval;
onMounted(() => {
  // Запускаем интервал обновления счетчика
  countdownInterval = setInterval(() => {
    // Для обновления реактивных вычисляемых свойств
    const now = new Date();
  }, 1000);
  
  // Загружаем данные для всех разделов
  loadGuests();
  loadGuestGroups();
  console.log('PlannerView компонент успешно инициализирован, данные загружены');
});

// Остановка интервала при размонтировании компонента
onUnmounted(() => {
  clearInterval(countdownInterval);
});
</script>

<style scoped>
/* Общие стили */
.planner-view {
  font-family: 'Roboto', sans-serif;
  color: #333;
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
}

.section-tabs {
  display: flex;
  justify-content: space-between;
  background-color: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  margin-bottom: 20px;
  overflow-x: auto;
}

.section-tab {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 15px;
  flex: 1;
  background: none;
  transition: all 0.3s;
  border-bottom: 3px solid transparent;
}

.section-tab i {
  font-size: 20px;
/* {{ ...  */
}

.timeline-container {
  position: relative;
  margin-bottom: 30px;
}

.timeline-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 15px;
}

/* .timeline-months {
}} */

.filter-select {
  padding: 8px 12px;
  border-radius: 8px;
  border: 1px solid #d1d5db;
  background-color: #fff;
  min-width: 200px;
}

.budget-table {
  width: 100%;
  border-collapse: collapse;
/* {{ ... }} */
}

.budget-table th,
.budget-table td {
  padding: 12px;
  text-align: left;
  border-bottom: 1px solid #e5e7eb;
}

.budget-table th {
  font-weight: 600;
  color: #6b7280;
  background-color: #f9fafb;
}

.budget-table tr:hover {
  background-color: #f9fafb;
}

.budget-category {
  display: flex;
  align-items: center;
}

.budget-category i {
  margin-right: 8px;
  color: #8b5cf6;
}

.budget-actions-cell {
  display: flex;
  gap: 10px;
}

.status-badge {
  display: inline-block;
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 12px;
  font-weight: 500;
}

.status-paid {
  background-color: #d1fae5;
  color: #065f46;
}

.status-planned {
  background-color: #e0f2fe;
  color: #0369a1;
}

/* Гости */
.guests-container {
  margin-top: 20px;
}

.guest-stats {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
  gap: 20px;
  margin-bottom: 20px;
}

.guest-stat-card {
  padding: 15px;
  border-radius: 8px;
  background-color: #f9fafb;
  text-align: center;
}

.guest-stat-value {
  font-size: 28px;
  font-weight: 700;
  color: #1f2937;
}

.guest-stat-label {
  font-size: 14px;
  color: #6b7280;
}

.guest-filters {
  display: flex;
  flex-wrap: wrap;
  gap: 20px;
  margin-bottom: 20px;
}

.guest-search {
  flex: 1;
  min-width: 250px;
}

.search-input {
  width: 100%;
  padding: 10px 16px;
  border-radius: 8px;
  border: 1px solid #d1d5db;
  background-color: #fff;
  font-size: 16px;
}

.guest-table {
  width: 100%;
  border-collapse: collapse;
}

.guest-table th,
.guest-table td {
  padding: 12px;
  text-align: left;
  border-bottom: 1px solid #e5e7eb;
}

.guest-table th {
  font-weight: 600;
  color: #6b7280;
  background-color: #f9fafb;
}

.guest-table tr:hover {
  background-color: #f9fafb;
}

.guest-name {
  font-weight: 600;
}

.guest-group {
  display: inline-block;
  padding: 4px 8px;
  border-radius: 4px;
  background-color: #f3f4f6;
  font-size: 12px;
}

.guest-status {
  display: inline-block;
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 12px;
  font-weight: 500;
}

.status-confirmed {
  background-color: #d1fae5;
  color: #065f46;
}

.status-declined {
  background-color: #fee2e2;
  color: #b91c1c;
}

.status-pending {
  background-color: #fef3c7;
  color: #92400e;
}

.guest-actions {
  display: flex;
  gap: 10px;
}

/* Формы */
.form-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  z-index: 100;
  display: flex;
  justify-content: center;
  align-items: center;
}

.form-container {
  background-color: white;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
  padding: 20px;
  width: 100%;
  max-width: 500px;
  max-height: 90vh;
  overflow-y: auto;
}

.form-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  padding-bottom: 10px;
  border-bottom: 1px solid #e5e7eb;
}

.form-title {
  font-size: 20px;
  font-weight: 600;
  color: #1f2937;
}

.form-close {
  background: none;
  border: none;
  font-size: 24px;
  color: #6b7280;
  cursor: pointer;
}

.form-group {
  margin-bottom: 15px;
}

.form-label {
  display: block;
  font-weight: 500;
  margin-bottom: 5px;
  color: #4b5563;
}

.form-input, .form-textarea, .form-select {
  width: 100%;
  padding: 10px;
  border: 1px solid #d1d5db;
  border-radius: 8px;
  background-color: #fff;
  font-size: 16px;
  color: #1f2937;
}

.form-textarea {
  resize: vertical;
  min-height: 80px;
}

.form-checkbox {
  display: flex;
  align-items: center;
  margin-top: 5px;
}

.form-checkbox input {
  margin-right: 10px;
}

.form-checkbox label {
  font-weight: normal;
}

.form-actions {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
  margin-top: 20px;
}

/* Модальные окна */
.confirm-dialog {
  text-align: center;
}

.confirm-dialog p {
  margin-bottom: 20px;
  color: #4b5563;
}

.confirm-actions {
  display: flex;
  justify-content: center;
  gap: 15px;
}

/* Адаптивные стили */
@media (max-width: 768px) {
  .section-tabs {
    display: none;
  }
  
  .mobile-section-select {
    display: block;
  }
  
  .dashboard-cards, .budget-overview {
    grid-template-columns: 1fr;
  }
  
  .timeline-grid {
    grid-template-columns: repeat(2, 1fr);
    gap: 15px;
  }
  
  .budget-filters, .guest-filters {
    flex-direction: column;
    gap: 15px;
  }
  
  .filter-container, .guest-search {
    width: 100%;
  }
}

@media (max-width: 576px) {
  .timeline-grid {
    grid-template-columns: 1fr;
  }
  
  .budget-table, .guest-table {
    display: block;
    overflow-x: auto;
  }
}

</style>