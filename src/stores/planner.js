import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import { useAuthStore } from './auth';
import apiService from '@/services/apiService';

export const usePlannerStore = defineStore('planner', () => {
  // Состояние
  const tasks = ref([]);
  const budget = ref({
    items: [],
    total: 0,
    spent: 0,
    remaining: 0
  });
  const guests = ref([]);
  const isLoading = ref(false);
  const error = ref(null);
  
  // Фильтры для задач
  const taskFilters = ref({
    status: 'all', // all, completed, pending
    category: 'all',
    priority: 'all',
    search: '',
    dateRange: null
  });
  
  // Геттеры
  const filteredTasks = computed(() => {
    let result = [...tasks.value];
    
    // Фильтрация по статусу
    if (taskFilters.value.status === 'completed') {
      result = result.filter(task => task.is_completed);
    } else if (taskFilters.value.status === 'pending') {
      result = result.filter(task => !task.is_completed);
    }
    
    // Фильтрация по категории
    if (taskFilters.value.category !== 'all') {
      result = result.filter(task => task.category === taskFilters.value.category);
    }
    
    // Фильтрация по приоритету
    if (taskFilters.value.priority !== 'all') {
      result = result.filter(task => task.priority === taskFilters.value.priority);
    }
    
    // Поиск по названию или описанию
    if (taskFilters.value.search) {
      const searchLower = taskFilters.value.search.toLowerCase();
      result = result.filter(task => 
        task.title.toLowerCase().includes(searchLower) || 
        (task.description && task.description.toLowerCase().includes(searchLower))
      );
    }
    
    // Фильтрация по дате
    if (taskFilters.value.dateRange) {
      const { start, end } = taskFilters.value.dateRange;
      if (start) {
        result = result.filter(task => new Date(task.due_date) >= new Date(start));
      }
      if (end) {
        result = result.filter(task => new Date(task.due_date) <= new Date(end));
      }
    }
    
    // Сортировка: сначала по приоритету, затем по дате
    return result.sort((a, b) => {
      // Приоритет: high > medium > low
      const priorityOrder = { high: 0, medium: 1, low: 2 };
      const priorityDiff = (priorityOrder[a.priority] || 999) - (priorityOrder[b.priority] || 999);
      
      if (priorityDiff !== 0) return priorityDiff;
      
      // Затем по дате (ближайшие сначала)
      return new Date(a.due_date) - new Date(b.due_date);
    });
  });
  
  const filteredGuests = computed(() => {
    return guests.value;
  });
  
  const totalGuests = computed(() => guests.value.length);
  const confirmedGuests = computed(() => guests.value.filter(g => g.is_confirmed).length);
  const declinedGuests = computed(() => guests.value.filter(g => g.is_declined).length);
  const pendingGuests = computed(() => guests.value.filter(g => !g.is_confirmed && !g.is_declined).length);
  
  const budgetStats = computed(() => ({
    total: budget.value.total,
    spent: budget.value.spent,
    remaining: budget.value.remaining,
    percentSpent: budget.value.total > 0 ? (budget.value.spent / budget.value.total) * 100 : 0
  }));
  
  // Методы
  const fetchTasks = async () => {
    isLoading.value = true;
    error.value = null;
    
    try {
      const authStore = useAuthStore();
      if (!authStore.isLoggedIn) {
        throw new Error('Необходимо войти в систему');
      }
      
      const response = await apiService.plannerService.getTasks();
      tasks.value = response.map(task => ({
        ...task,
        due_date: task.due_date || new Date().toISOString().split('T')[0]
      }));
      
      return response;
    } catch (err) {
      console.error('Ошибка при загрузке задач:', err);
      error.value = 'Не удалось загрузить задачи. Пожалуйста, попробуйте позже.';
      return [];
    } finally {
      isLoading.value = false;
    }
  };
  
  const createTask = async (taskData) => {
    isLoading.value = true;
    error.value = null;
    
    try {
      const response = await apiService.plannerService.createTask(taskData);
      tasks.value.push(response);
      return response;
    } catch (err) {
      console.error('Ошибка при создании задачи:', err);
      error.value = 'Не удалось создать задачу. Пожалуйста, попробуйте позже.';
      throw err;
    } finally {
      isLoading.value = false;
    }
  };
  
  const updateTask = async (taskId, taskData) => {
    isLoading.value = true;
    error.value = null;
    
    try {
      const response = await apiService.plannerService.updateTask(taskId, taskData);
      
      const index = tasks.value.findIndex(task => task.id === taskId);
      if (index !== -1) {
        tasks.value[index] = { ...tasks.value[index], ...response };
      }
      
      return response;
    } catch (err) {
      console.error('Ошибка при обновлении задачи:', err);
      error.value = 'Не удалось обновить задачу. Пожалуйста, попробуйте позже.';
      throw err;
    } finally {
      isLoading.value = false;
    }
  };
  
  const deleteTask = async (taskId) => {
    isLoading.value = true;
    error.value = null;
    
    try {
      await apiService.plannerService.deleteTask(taskId);
      tasks.value = tasks.value.filter(task => task.id !== taskId);
      return { success: true };
    } catch (err) {
      console.error('Ошибка при удалении задачи:', err);
      error.value = 'Не удалось удалить задачу. Пожалуйста, попробуйте позже.';
      throw err;
    } finally {
      isLoading.value = false;
    }
  };
  
  const toggleTaskCompletion = async (taskId) => {
    const task = tasks.value.find(t => t.id === taskId);
    if (!task) return;
    
    const updatedData = { is_completed: !task.is_completed };
    return updateTask(taskId, updatedData);
  };
  
  const updateTaskFilters = (newFilters) => {
    taskFilters.value = {
      ...taskFilters.value,
      ...newFilters
    };
  };
  
  const resetTaskFilters = () => {
    taskFilters.value = {
      status: 'all',
      category: 'all',
      priority: 'all',
      search: '',
      dateRange: null
    };
  };
  
  // Методы для работы с бюджетом
  const fetchBudget = async () => {
    isLoading.value = true;
    error.value = null;
    
    try {
      const response = await apiService.plannerService.getBudget();
      
      budget.value = {
        items: response.items || [],
        total: response.total || 0,
        spent: response.spent || 0,
        remaining: response.remaining || 0
      };
      
      return response;
    } catch (err) {
      console.error('Ошибка при загрузке бюджета:', err);
      error.value = 'Не удалось загрузить бюджет. Пожалуйста, попробуйте позже.';
      return null;
    } finally {
      isLoading.value = false;
    }
  };
  
  const createBudgetItem = async (itemData) => {
    isLoading.value = true;
    error.value = null;
    
    try {
      const response = await apiService.plannerService.createBudgetItem(itemData);
      budget.value.items.push(response);
      
      // Обновляем общие суммы
      fetchBudget();
      
      return response;
    } catch (err) {
      console.error('Ошибка при создании статьи бюджета:', err);
      error.value = 'Не удалось создать статью бюджета. Пожалуйста, попробуйте позже.';
      throw err;
    } finally {
      isLoading.value = false;
    }
  };
  
  const updateBudgetItem = async (itemId, itemData) => {
    isLoading.value = true;
    error.value = null;
    
    try {
      const response = await apiService.plannerService.updateBudgetItem(itemId, itemData);
      
      const index = budget.value.items.findIndex(item => item.id === itemId);
      if (index !== -1) {
        budget.value.items[index] = { ...budget.value.items[index], ...response };
      }
      
      // Обновляем общие суммы
      fetchBudget();
      
      return response;
    } catch (err) {
      console.error('Ошибка при обновлении статьи бюджета:', err);
      error.value = 'Не удалось обновить статью бюджета. Пожалуйста, попробуйте позже.';
      throw err;
    } finally {
      isLoading.value = false;
    }
  };
  
  const deleteBudgetItem = async (itemId) => {
    isLoading.value = true;
    error.value = null;
    
    try {
      await apiService.plannerService.deleteBudgetItem(itemId);
      budget.value.items = budget.value.items.filter(item => item.id !== itemId);
      
      // Обновляем общие суммы
      fetchBudget();
      
      return { success: true };
    } catch (err) {
      console.error('Ошибка при удалении статьи бюджета:', err);
      error.value = 'Не удалось удалить статью бюджета. Пожалуйста, попробуйте позже.';
      throw err;
    } finally {
      isLoading.value = false;
    }
  };
  
  // Методы для работы со списком гостей
  const fetchGuests = async () => {
    isLoading.value = true;
    error.value = null;
    
    try {
      const response = await apiService.plannerService.getGuests();
      guests.value = response;
      return response;
    } catch (err) {
      console.error('Ошибка при загрузке списка гостей:', err);
      error.value = 'Не удалось загрузить список гостей. Пожалуйста, попробуйте позже.';
      return [];
    } finally {
      isLoading.value = false;
    }
  };
  
  const createGuest = async (guestData) => {
    isLoading.value = true;
    error.value = null;
    
    try {
      const response = await apiService.plannerService.createGuest(guestData);
      guests.value.push(response);
      return response;
    } catch (err) {
      console.error('Ошибка при добавлении гостя:', err);
      error.value = 'Не удалось добавить гостя. Пожалуйста, попробуйте позже.';
      throw err;
    } finally {
      isLoading.value = false;
    }
  };
  
  const updateGuest = async (guestId, guestData) => {
    isLoading.value = true;
    error.value = null;
    
    try {
      const response = await apiService.plannerService.updateGuest(guestId, guestData);
      
      const index = guests.value.findIndex(guest => guest.id === guestId);
      if (index !== -1) {
        guests.value[index] = { ...guests.value[index], ...response };
      }
      
      return response;
    } catch (err) {
      console.error('Ошибка при обновлении информации о госте:', err);
      error.value = 'Не удалось обновить информацию о госте. Пожалуйста, попробуйте позже.';
      throw err;
    } finally {
      isLoading.value = false;
    }
  };
  
  const deleteGuest = async (guestId) => {
    isLoading.value = true;
    error.value = null;
    
    try {
      await apiService.plannerService.deleteGuest(guestId);
      guests.value = guests.value.filter(guest => guest.id !== guestId);
      return { success: true };
    } catch (err) {
      console.error('Ошибка при удалении гостя:', err);
      error.value = 'Не удалось удалить гостя. Пожалуйста, попробуйте позже.';
      throw err;
    } finally {
      isLoading.value = false;
    }
  };
  
  // Инициализация всех данных планировщика
  const initializePlanner = async () => {
    isLoading.value = true;
    error.value = null;
    
    try {
      // Загружаем все данные параллельно
      await Promise.all([
        fetchTasks(),
        fetchBudget(),
        fetchGuests()
      ]);
      
      return { success: true };
    } catch (err) {
      console.error('Ошибка при инициализации планировщика:', err);
      error.value = 'Не удалось загрузить данные планировщика. Пожалуйста, попробуйте позже.';
      return { success: false, error: err };
    } finally {
      isLoading.value = false;
    }
  };
  
  return {
    // Состояние
    tasks,
    budget,
    guests,
    isLoading,
    error,
    taskFilters,
    
    // Геттеры
    filteredTasks,
    filteredGuests,
    totalGuests,
    confirmedGuests,
    declinedGuests,
    pendingGuests,
    budgetStats,
    
    // Методы для задач
    fetchTasks,
    createTask,
    updateTask,
    deleteTask,
    toggleTaskCompletion,
    updateTaskFilters,
    resetTaskFilters,
    
    // Методы для бюджета
    fetchBudget,
    createBudgetItem,
    updateBudgetItem,
    deleteBudgetItem,
    
    // Методы для гостей
    fetchGuests,
    createGuest,
    updateGuest,
    deleteGuest,
    
    // Инициализация
    initializePlanner
  };
});
