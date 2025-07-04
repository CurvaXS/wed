// apiService.js - Сервис для работы с API

// Базовый URL API
// const API_URL = 'http://127.0.0.1:8000/api/v1/';  
const API_URL = 'https://makarsoda.pythonanywhere.com/api/v1/';
// const API_URL = 'http://mmpysh9z.beget.tech/api/v1/';


// Заголовки по умолчанию
const getHeaders = () => {
  const headers = {
    'Content-Type': 'application/json',
  };

  // Добавление токена авторизации если он есть
  const token = localStorage.getItem('token');
  if (token) {
    headers['Authorization'] = `Token ${token}`;
  }

  return headers;
};

// Общая функция для выполнения запросов
const apiRequest = async (endpoint, method = 'GET', data = null, isFormData = false) => {
  const url = `${API_URL}${endpoint}`;
  const options = {
    method,
    headers: {}
  };
  
  // Устанавливаем Content-Type только если это не FormData
  if (!isFormData) {
    options.headers['Content-Type'] = 'application/json';
  }
  
  // Добавляем токен авторизации только если это не запрос на логин или регистрацию
  if (!endpoint.includes('login') && !endpoint.includes('register')) {
    const token = localStorage.getItem('token');
    if (token) {
      options.headers['Authorization'] = `Token ${token}`;
    }
  }

  if (data && (method === 'POST' || method === 'PUT' || method === 'PATCH')) {
    // Если это FormData, то отправляем его как есть, иначе преобразуем в JSON
    if (isFormData && data instanceof FormData) {
      options.body = data;
    } else {
      options.body = JSON.stringify(data);
    }
  }

  try {
    const response = await fetch(url, options);
    
    // Проверяем статус ответа
    if (!response.ok) {
      // Если есть ошибка, пытаемся получить сообщение из ответа
      const errorData = await response.json().catch(() => ({}));
      throw {
        status: response.status,
        message: errorData.detail || 'Произошла ошибка при запросе к API',
        errors: errorData
      };
    }
    
    // Для запросов DELETE может не быть JSON-ответа
    if (method === 'DELETE' && response.status === 204) {
      return { success: true };
    }
    
    return await response.json();
  } catch (error) {
    console.error('API Error:', error);
    throw error;
  }
};

// Сервисы для различных разделов API
const authService = {
  login: (credentials) => apiRequest('users/login/', 'POST', credentials),
  register: (userData) => apiRequest('users/register/', 'POST', userData),
  getCurrentUser: () => apiRequest('users/me/'),
  logout: () => {
    localStorage.removeItem('token');
    return Promise.resolve({ success: true });
  }
};

const catalogService = {
  getSpecialists: (params = {}) => {
    // Клонируем объект параметров, чтобы не изменять оригинальный
    const paramsClone = { ...params };
    
    // Преобразуем числовые ID категорий в строковые коды из SPECIALIST_CATEGORIES
    if (paramsClone.category) {
      // Карта соответствия числовых ID и строковых кодов категорий
      const categoryMapping = {
        '1': 'photographer',    // Фотограф
        '2': 'videographer',    // Видеограф
        '3': 'caterer',         // Кейтеринг
        '4': 'band',            // Музыка
        '5': 'wedding_planner', // Организаторы
        '6': 'hairstylist',     // Стилисты
        '7': 'transport',       // Транспорт
        '8': 'venue',           // Локации
        '9': 'decorator',       // Декор
        '10': 'cake',           // Торты
        '11': 'accessories',    // Аренда/Аксессуары
        '12': 'clothing',       // Костюмы/Свадебные наряды
        '13': 'other'           // Другое
      };
      
      // Получаем строковый код для выбранной категории
      const categoryId = String(paramsClone.category);
      const categoryCode = categoryMapping[categoryId];
      
      if (categoryCode) {
        console.log(`Преобразование категории: ${categoryId} (число) -> ${categoryCode} (строка)`);
        paramsClone.category = categoryCode;
      } else {
        console.log(`Невозможно преобразовать категорию: ${categoryId}`);
      }
    }
    
    const queryParams = new URLSearchParams();
    
    // Добавляем параметры фильтрации
    Object.entries(paramsClone).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        queryParams.append(key, value);
      }
    });
    
    // Формируем URL для запроса
    const apiUrl = queryParams.toString() 
      ? `catalog/specialists?${queryParams.toString()}` 
      : 'catalog/specialists/';
    
    console.log(`Отправляем запрос к: ${apiUrl}`);
    return apiRequest(apiUrl);
  },
  getSpecialistById: (id) => apiRequest(`catalog/specialists/${id}/`),
  getCategories: () => apiRequest('catalog/categories/'),
  getCities: () => apiRequest('catalog/cities/'),
  getFavorites: () => apiRequest('catalog/favorites/'),
  addToFavorites: (specialistId) => apiRequest('catalog/favorites/', 'POST', { specialist: specialistId }),
  removeFromFavorites: (favoriteId) => apiRequest(`catalog/favorites/${favoriteId}/`, 'DELETE'),
  
  // Методы для работы с услугами специалистов
  getSpecialistServices: (specialistId) => {
    // Формируем URL для запроса с учетом особенностей Django APPEND_SLASH=True
    const apiUrl = `catalog/services?specialist=${specialistId}`;
    console.log(`Отправляем запрос на получение услуг специалиста: ${apiUrl}`);
    return apiRequest(apiUrl);
  },
  getServiceById: (id) => apiRequest(`catalog/services/${id}/`),
  createService: (serviceData) => {
    // Проверяем, что передано FormData или обычный объект
    const isFormData = serviceData instanceof FormData;
    console.log(`Создание услуги, тип данных: ${isFormData ? 'FormData' : 'JSON'}`);
    return apiRequest('catalog/services/', 'POST', serviceData, isFormData);
  },
  updateService: (id, serviceData) => {
    // Проверяем, что передано FormData или обычный объект
    const isFormData = serviceData instanceof FormData;
    console.log(`Обновление услуги, тип данных: ${isFormData ? 'FormData' : 'JSON'}`);
    return apiRequest(`catalog/services/${id}/`, 'PATCH', serviceData, isFormData);
  },
  deleteService: (id) => apiRequest(`catalog/services/${id}/`, 'DELETE'),
  uploadServiceImage: (serviceId, imageFile) => {
    const formData = new FormData();
    formData.append('image', imageFile);
    return apiRequest(`catalog/services/${serviceId}/`, 'PATCH', formData, true);
  },
  // Обновление данных профиля специалиста
  updateSpecialistProfile: async (profileData) => {
    try {
      console.log('Обновление профиля специалиста:', profileData);
      
      // Если есть specialist_profile_id, используем его для обновления профиля
      if (profileData.specialist_profile_id) {
        const response = await apiRequest(`catalog/specialists/${profileData.specialist_profile_id}/`, 'PATCH', profileData);
        console.log('Профиль специалиста обновлен:', response);
        return response;
      } 
      // Если нет specialist_profile_id, но есть id пользователя
      else if (profileData.id) {
        // Создаем FormData для отправки (эндпоинт update-user ожидает данные в формате FormData)
        const formData = new FormData();
        
        // Добавляем все поля в formData
        Object.keys(profileData).forEach(key => {
          if (profileData[key] !== null && profileData[key] !== undefined) {
            formData.append(key, profileData[key]);
          }
        });
        
        // Отправляем запрос с FormData
        const url = `${API_URL}users/profile/update-user/`;
        const token = localStorage.getItem('token');
        
        const response = await fetch(url, {
          method: 'PATCH',
          headers: {
            'Authorization': `Token ${token}`
          },
          body: formData
        });
        
        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}));
          throw {
            status: response.status,
            message: errorData.detail || 'Произошла ошибка при обновлении профиля',
            errors: errorData
          };
        }
        
        const result = await response.json();
        console.log('Профиль пользователя-специалиста обновлен:', result);
        return result;
      } else {
        throw new Error('Не указан ID профиля специалиста или ID пользователя');
      }
    } catch (error) {
      console.error('Ошибка при обновлении профиля специалиста:', error);
      throw error;
    }
  },
  getSpecialistProfileId: async (userId) => {
    try {
      console.log('Запрашиваем ID профиля специалиста для пользователя:', userId);
      
      // Поскольку эндпоинт users/specialist-profile/ не существует, используем другой подход
      // Сначала пробуем получить данные текущего пользователя, если они могут содержать информацию о профиле
      const currentUser = await apiRequest('users/me/');
      
      if (currentUser && currentUser.specialist_profile) {
        console.log('Получен ID профиля специалиста из данных пользователя:', currentUser.specialist_profile.id);
        return currentUser.specialist_profile.id;
      }
      
      // Если мы здесь, значит информации о профиле специалиста нет в данных пользователя
      // В этом случае придется использовать userId как ID профиля специалиста (предположение)
      console.log('Используем ID пользователя как ID профиля специалиста:', userId);
      return userId;
      
    } catch (error) {
      console.error('Ошибка при получении ID профиля специалиста:', error);
      // В случае ошибки, просто возвращаем ID пользователя как запасной вариант
      console.log('Возвращаем ID пользователя как запасной вариант для ID профиля специалиста:', userId);
      return userId;
    }
  }
};

const weddingsService = {
  getRealWeddings: (params = {}) => {
    const queryParams = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
      if (value) queryParams.append(key, value);
    });
    const query = queryParams.toString() ? `?${queryParams.toString()}` : '';
    return apiRequest(`weddings/real-weddings/${query}`);
  },
  getRealWeddingById: (id) => apiRequest(`weddings/real-weddings/${id}/`),
  getWeddingImages: (weddingId) => apiRequest(`weddings/images/?wedding=${weddingId}`),
  getWeddingDetails: (weddingId) => apiRequest(`weddings/details/?wedding=${weddingId}`),
  getWeddingStyles: () => apiRequest('weddings/styles/'),
  getWeddingTags: () => apiRequest('weddings/tags/'),
  getFeaturedWeddings: () => apiRequest('weddings/real-weddings/?featured=true'),
  getWeddingsByStyle: (styleId) => apiRequest(`weddings/real-weddings/?style=${styleId}`),
  getWeddingsByTag: (tag) => apiRequest(`weddings/real-weddings/?tag=${tag}`),
  likeWedding: (weddingId) => apiRequest(`weddings/real-weddings/${weddingId}/like/`, 'POST'),
  unlikeWedding: (weddingId) => apiRequest(`weddings/real-weddings/${weddingId}/unlike/`, 'POST'),
  toggleLike: (weddingId) => apiRequest(`weddings/real-weddings/${weddingId}/toggle_like/`, 'POST'),
  addComment: (weddingId, text) => apiRequest(`weddings/comments/`, 'POST', { wedding: weddingId, text }),
  getLikedWeddings: () => apiRequest('weddings/real-weddings/liked/'),
  getRelatedWeddings: (weddingId) => apiRequest(`weddings/real-weddings/${weddingId}/related/`),
  getWeddingVendors: (weddingId) => apiRequest(`weddings/real-weddings/${weddingId}/vendors/`)
};

const tendersService = {
  // Получение списка тендеров с фильтрацией
  getTenders: (params = {}) => {
    // Клонируем объект параметров, чтобы не изменять оригинальный
    const paramsClone = { ...params };
    
    // Преобразуем числовые ID категорий в строковые коды
    if (paramsClone.category && !isNaN(parseInt(paramsClone.category))) {
      // Карта соответствия числовых ID и строковых кодов категорий
      const categoryMapping = {
        '1': 'photography',    // Фотограф
        '2': 'videographer',   // Видеограф
        '3': 'venue',          // Площадка
        '4': 'catering',       // Кейтеринг
        '5': 'music',          // Музыка
        '6': 'decor',          // Декор
        '7': 'cake',           // Торт
        '8': 'suit',           // Костюм
        '9': 'dress',          // Платье
        '10': 'other'          // Другое
      };
      
      // Получаем строковый код для выбранной категории
      const categoryId = String(paramsClone.category);
      const categoryCode = categoryMapping[categoryId];
      
      if (categoryCode) {
        console.log(`Преобразование категории: ${categoryId} (число) -> ${categoryCode} (строка)`);
        paramsClone.category = categoryCode;
      } else {
        console.log(`Невозможно преобразовать категорию: ${categoryId}`);
      }
    }
    
    const queryParams = new URLSearchParams();
    
    // Добавляем параметры фильтрации
    Object.entries(paramsClone).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        queryParams.append(key, value);
      }
    });
    
    // Формируем URL для запроса с учетом особенностей Django (APPEND_SLASH=True)
    // Без параметров: 'tenders/tenders/' (с завершающим слешем)
    // С параметрами: 'tenders/tenders' + параметры (без завершающего слеша)
    const queryString = queryParams.toString();
    const apiUrl = queryString 
      ? `tenders/tenders?${queryString}` 
      : 'tenders/tenders/';
    
    console.log(`Отправляем запрос к тендерам: ${apiUrl}`);
    return apiRequest(apiUrl);
  },
  
  // Получение тендера по ID
  getTenderById: (id) => apiRequest(`tenders/tenders/${id}/`),
  
  // Создание нового тендера с поддержкой JSON
  createTender: (tenderData) => {
    // Клонируем объект данных, чтобы не изменять оригинальный
    const tenderDataClone = { ...tenderData };
    
    // Преобразуем числовую категорию в строковый код при необходимости
    if (tenderDataClone.category && !isNaN(parseInt(tenderDataClone.category))) {
      const categoryMapping = {
        '1': 'photographer',    // Фотограф
        '2': 'videographer',   // Видеограф
        '3': 'venue',          // Площадка
        '4': 'catering',       // Кейтеринг
        '5': 'music',          // Музыка
        '6': 'decor',          // Декор
        '7': 'cake',           // Торт
        '8': 'suit',           // Костюм
        '9': 'dress',          // Платье
        '10': 'other'          // Другое
      };
      
      const categoryId = String(tenderDataClone.category);
      const categoryCode = categoryMapping[categoryId];
      
      if (categoryCode) {
        tenderDataClone.category = categoryCode;
      }
    }
    
    console.log('Creating new tender:', tenderDataClone);
    return apiRequest('tenders/tenders/', 'POST', tenderDataClone);
  },
  
  // Создание нового тендера с вложениями через FormData
  createTenderWithAttachments: async (formData) => {
    console.log('Creating tender with attachments');
    
    // FormData уже должен быть сформирован в компоненте
    const url = `${API_URL}tenders/tenders/`;
    
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          // Не указываем Content-Type, он будет автоматически установлен как multipart/form-data с boundary
          'Authorization': token ? `Token ${token}` : '',
        },
        body: formData
      });
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        console.error('Error creating tender with attachments:', errorData);
        throw { 
          status: response.status,
          message: errorData.detail || 'Failed to create tender',
          errors: errorData
        };
      }
      
      return await response.json();
    } catch (error) {
      console.error('API error creating tender with attachments:', error);
      throw error;
    }
  },
  
  // Обновление тендера (JSON)
  updateTender: (id, tenderData) => {
    // Клонируем объект данных, чтобы не изменять исходный
    const data = { ...tenderData };
    
    // Проверяем поле категории и преобразуем его при необходимости
    if (data.category) {
      // Карта соответствия категорий
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
      
      // Если есть соответствие в карте, используем его
      if (categoryMap[data.category]) {
        console.log(`Преобразование категории: ${data.category} -> ${categoryMap[data.category]}`);
        data.category = categoryMap[data.category];
      }
    }
    
    // Используем правильный путь для обновления тендера
    return apiRequest(`tenders/tenders/${id}/`, 'PATCH', data);
  },
  
  // Откликнуться на тендер (для специалистов)
  respondToTender: (tenderId, proposalData) => {
    console.log('Отклик на тендер:', tenderId, proposalData);
    return apiRequest(`tenders/tenders/${tenderId}/proposals/`, 'POST', proposalData);
  },
  
  // Получить список откликов на тендер
  getTenderProposals: (tenderId) => {
    return apiRequest(`tenders/offers/?tender=${tenderId}`);
  },
  
  // Проверить, откликнулся ли уже специалист на тендер
  // Временное решение: всегда возвращаем false, т.к. на бэкенде нет эндпойнта check-proposal
  checkProposalExists: (tenderId) => {
    console.log('Проверка наличия отклика на тендер:', tenderId);
    // Временное решение: возвращаем Promise с фиксированным результатом
    return Promise.resolve({ exists: false });
    
    // TODO: Реализовать эндпойнт на бэкенде и вернуть этот код:
    // return apiRequest(`tenders/tenders/${tenderId}/check-proposal/`).catch(err => {
    //   if (err.status === 404) {
    //     return { exists: false };
    //   }
    //   throw err;
    // });
  },
  
  // Обновление тендера с вложениями через FormData
  updateTenderWithAttachments: async (id, tenderData, files) => {
    console.log('Updating tender with attachments:', id, tenderData, files);
    
    const formData = new FormData();
    
    // Добавляем данные тендера
    Object.entries(tenderData).forEach(([key, value]) => {
      // Преобразуем даты в формат YYYY-MM-DD для API
      if (key === 'event_date' && value instanceof Date) {
        formData.append(key, value.toISOString().split('T')[0]);
      } else if (value !== null && value !== undefined) {
        formData.append(key, value);
      }
    });
    
    // Добавляем файлы, если они есть
    if (files && files.length > 0) {
      files.forEach((file, index) => {
        formData.append(`attachments[${index}]`, file);
      });
    }
    
    const url = `${API_URL}tenders/${id}/`;
    
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(url, {
        method: 'PATCH',
        headers: {
          'Authorization': token ? `Token ${token}` : '',
        },
        body: formData
      });
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        console.error('Error updating tender with attachments:', errorData);
        throw { 
          status: response.status,
          message: errorData.detail || 'Failed to update tender',
          errors: errorData
        };
      }
      
      return await response.json();
    } catch (error) {
      console.error('API error updating tender with attachments:', error);
      throw error;
    }
  },
  
  // Добавление вложения к тендеру
  addTenderAttachment: async (tenderId, file, description = '') => {
    console.log('Adding attachment to tender:', tenderId, file);
    
    const formData = new FormData();
    formData.append('file', file);
    
    if (description) {
      formData.append('description', description);
    }
    
    const url = `${API_URL}tenders/${tenderId}/add_attachment/`;
    
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Authorization': token ? `Token ${token}` : '',
        },
        body: formData
      });
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        console.error('Error adding attachment to tender:', errorData);
        throw { 
          status: response.status,
          message: errorData.detail || 'Failed to add attachment',
          errors: errorData
        };
      }
      
      return await response.json();
    } catch (error) {
      console.error('API error adding attachment to tender:', error);
      throw error;
    }
  },
  
  // Удаление тендера
  deleteTender: (id) => apiRequest(`tenders/${id}/`, 'DELETE'),
  
  // Получение предложений для тендера
  getOffers: (tenderId) => apiRequest(`offers/?tender=${tenderId}`),
  
  // Получение предложения по ID
  getOfferById: (id) => apiRequest(`offers/${id}/`),
  
  // Создание предложения (JSON)
  createOffer: (offerData) => {
    console.log('Creating new offer:', offerData);
    return apiRequest('offers/', 'POST', offerData);
  },
  
  // Создание предложения с вложениями через FormData
  createOfferWithAttachments: async (offerData, files) => {
    console.log('Creating offer with attachments:', offerData, files);
    
    const formData = new FormData();
    
    // Добавляем данные предложения
    Object.entries(offerData).forEach(([key, value]) => {
      // Преобразуем даты в формат YYYY-MM-DD для API
      if (key === 'available_date' && value instanceof Date) {
        formData.append(key, value.toISOString().split('T')[0]);
      } else if (value !== null && value !== undefined) {
        formData.append(key, value);
      }
    });
    
    // Добавляем файлы, если они есть
    if (files && files.length > 0) {
      files.forEach((file, index) => {
        formData.append(`attachments[${index}]`, file);
      });
    }
    
    const url = `${API_URL}offers/`;
    
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Authorization': token ? `Token ${token}` : '',
        },
        body: formData
      });
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        console.error('Error creating offer with attachments:', errorData);
        throw { 
          status: response.status,
          message: errorData.detail || 'Failed to create offer',
          errors: errorData
        };
      }
      
      return await response.json();
    } catch (error) {
      console.error('API error creating offer with attachments:', error);
      throw error;
    }
  },
  
  // Обновление статуса предложения (принятие/отклонение)
  updateOfferStatus: (id, status) => {
    console.log('Updating offer status:', id, status);
    return apiRequest(`offers/${id}/`, 'PATCH', { status });
  },
  
  // Получение сообщений по тендеру
  getMessages: (tenderId) => apiRequest(`messages/?tender=${tenderId}`),
  
  // Отправка сообщения
  sendMessage: (messageData) => apiRequest('messages/', 'POST', messageData),
  
  // Получение уведомлений
  getNotifications: () => apiRequest('notifications/')
};

const contentService = {
  getArticles: (params = {}) => {
    const queryParams = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
      if (value) queryParams.append(key, value);
    });
    const query = queryParams.toString() ? `?${queryParams.toString()}` : '';
    return apiRequest(`content/articles/${query}`);
  },
  getArticleById: (id) => apiRequest(`content/articles/${id}/`),
  getArticleCategories: () => apiRequest('content/article-categories/'),
  getArticleTags: () => apiRequest('content/article-tags/'),
  incrementArticleViews: (id) => apiRequest(`content/articles/${id}/view/`, 'POST'),
  likeArticle: (id) => apiRequest(`content/articles/${id}/like/`, 'POST'),
  unlikeArticle: (id) => apiRequest(`content/articles/${id}/unlike/`, 'POST'),
  addArticleComment: (articleId, text) => apiRequest(`content/articles/${articleId}/comments/`, 'POST', { text }),
  getRelatedArticles: (id) => apiRequest(`content/articles/${id}/related/`)
};

const plannerService = {
  // Задачи
  getTasks: () => apiRequest('planner/tasks/'),
  createTask: (taskData) => apiRequest('planner/tasks/', 'POST', taskData),
  updateTask: (id, taskData) => apiRequest(`planner/tasks/${id}/`, 'PATCH', taskData),
  deleteTask: (id) => apiRequest(`planner/tasks/${id}/`, 'DELETE'),
  getTaskCategories: () => apiRequest('planner/task-categories/'),
  
  // Бюджет
  getBudgetCategories: () => apiRequest('planner/budget-categories/'),
  getBudget: () => apiRequest('planner/budget/'),
  createBudgetItem: (itemData) => apiRequest('planner/budget/', 'POST', itemData),
  updateBudgetItem: (id, itemData) => apiRequest(`planner/budget/${id}/`, 'PATCH', itemData),
  deleteBudgetItem: (id) => apiRequest(`planner/budget/${id}/`, 'DELETE'),
  
  // Группы гостей
  getGuestGroups: () => apiRequest('planner/guest-groups/'),
  createGuestGroup: (groupData) => apiRequest('planner/guest-groups/', 'POST', groupData),
  updateGuestGroup: (id, groupData) => apiRequest(`planner/guest-groups/${id}/`, 'PATCH', groupData),
  deleteGuestGroup: (id) => apiRequest(`planner/guest-groups/${id}/`, 'DELETE'),
  
  // Гости
  getGuests: () => apiRequest('planner/guests/'),
  createGuest: (guestData) => apiRequest('planner/guests/', 'POST', guestData),
  updateGuest: (id, guestData) => apiRequest(`planner/guests/${id}/`, 'PATCH', guestData),
  deleteGuest: (id) => apiRequest(`planner/guests/${id}/`, 'DELETE'),
  
  // Сводка по гостям (статистика)
  getGuestsSummary: () => apiRequest('planner/guests/summary/')
};

const profileService = {
  // Получение профиля пользователя
  getUserProfile: () => apiRequest('users/me/'),
  
  // Обновление пользовательских данных
  updateUserProfile: async (userData) => {
    const formData = new FormData();
    
    // Добавляем все поля в formData
    Object.keys(userData).forEach(key => {
      if (userData[key] !== null && userData[key] !== undefined) {
        formData.append(key, userData[key]);
      }
    });
    
    const url = `${API_URL}users/profile/update-user/`;
    const token = localStorage.getItem('token');
    
    const response = await fetch(url, {
      method: 'PATCH',
      headers: {
        'Authorization': `Token ${token}`
      },
      body: formData
    });
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw {
        status: response.status,
        message: errorData.detail || 'Произошла ошибка при обновлении профиля пользователя',
        errors: errorData
      };
    }
    
    return await response.json();
  },
  
  // Обновление профиля пары
  updateCoupleProfile: async (coupleData) => {
    const formData = new FormData();
    
    // Добавляем все поля в formData
    Object.keys(coupleData).forEach(key => {
      if (coupleData[key] !== null && coupleData[key] !== undefined) {
        formData.append(key, coupleData[key]);
      }
    });
    
    const url = `${API_URL}users/profile/update-couple-profile/`;
    const token = localStorage.getItem('token');
    
    const response = await fetch(url, {
      method: 'PATCH',
      headers: {
        'Authorization': `Token ${token}`
        // Не устанавливаем Content-Type, браузер сам установит его с правильным boundary
      },
      body: formData
    });
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw {
        status: response.status,
        message: errorData.detail || 'Произошла ошибка при обновлении профиля пары',
        errors: errorData
      };
    }
    
    return await response.json();
  },
  
  // Обновление деталей свадьбы
  updateWeddingDetails: async (weddingData) => {
    const formData = new FormData();
    
    // Добавляем все поля в formData
    Object.keys(weddingData).forEach(key => {
      if (weddingData[key] !== null && weddingData[key] !== undefined) {
        formData.append(key, weddingData[key]);
      }
    });
    
    const url = `${API_URL}users/profile/update-wedding-details/`;
    const token = localStorage.getItem('token');
    
    const response = await fetch(url, {
      method: 'PATCH',
      headers: {
        'Authorization': `Token ${token}`
      },
      body: formData
    });
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw {
        status: response.status,
        message: errorData.detail || 'Произошла ошибка при обновлении деталей свадьбы',
        errors: errorData
      };
    }
    
    return await response.json();
  },
  
  // Загрузка аватара с помощью FormData
  uploadAvatar: async (file) => {
    const formData = new FormData();
    formData.append('avatar', file);
    
    // Используем эндпоинт update-user с методом PATCH
    const url = `${API_URL}users/profile/update-user/`;
    const token = localStorage.getItem('token');
    
    console.log('Загрузка аватара...');
    
    const response = await fetch(url, {
      method: 'PATCH',
      headers: {
        'Authorization': `Token ${token}`
      },
      body: formData
    });
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      console.error('Ошибка при загрузке аватара:', response.status, errorData);
      throw {
        status: response.status,
        message: errorData.detail || 'Произошла ошибка при загрузке аватара',
        errors: errorData
      };
    }
    
    return await response.json();
  },
  
  // Управление командой
  getTeamMembers: () => apiRequest('users/team-members/'),
  createTeamMember: async (memberData) => {
    const formData = new FormData();
    
    // Добавляем все поля в formData
    Object.keys(memberData).forEach(key => {
      if (memberData[key] !== null && memberData[key] !== undefined) {
        formData.append(key, memberData[key]);
      }
    });
    
    const url = `${API_URL}users/team-members/`;
    const token = localStorage.getItem('token');
    
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Authorization': `Token ${token}`
      },
      body: formData
    });
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw {
        status: response.status,
        message: errorData.detail || 'Произошла ошибка при создании члена команды',
        errors: errorData
      };
    }
    
    return await response.json();
  },
  updateTeamMember: async (id, memberData) => {
    const formData = new FormData();
    
    // Добавляем все поля в formData
    Object.keys(memberData).forEach(key => {
      if (memberData[key] !== null && memberData[key] !== undefined) {
        formData.append(key, memberData[key]);
      }
    });
    
    const url = `${API_URL}users/team-members/${id}/`;
    const token = localStorage.getItem('token');
    
    const response = await fetch(url, {
      method: 'PATCH',
      headers: {
        'Authorization': `Token ${token}`
      },
      body: formData
    });
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw {
        status: response.status,
        message: errorData.detail || 'Произошла ошибка при обновлении члена команды',
        errors: errorData
      };
    }
    
    return await response.json();
  },
  deleteTeamMember: (id) => apiRequest(`users/team-members/${id}/`, 'DELETE'),
  
  // Управление постами
  getPosts: () => apiRequest('users/posts/'),
  createPost: async (postData) => {
    const formData = new FormData();
    
    // Добавляем все поля в formData
    Object.keys(postData).forEach(key => {
      if (postData[key] !== null && postData[key] !== undefined) {
        // Если это файл, то он будет добавлен как есть,
        // а если это простое поле, то оно будет преобразовано в строку
        formData.append(key, postData[key]);
      }
    });
    
    const url = `${API_URL}users/posts/`;
    const token = localStorage.getItem('token');
    
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Authorization': `Token ${token}`
      },
      body: formData
    });
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw {
        status: response.status,
        message: errorData.detail || 'Произошла ошибка при создании поста',
        errors: errorData
      };
    }
    
    return await response.json();
  },
  createPostWithImage: async (formData) => {
    const url = `${API_URL}users/posts/`;
    const token = localStorage.getItem('token');
    
    console.log('Отправка поста с изображением...');
    
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Authorization': `Token ${token}`
      },
      body: formData
    });
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      console.error('Ошибка при создании поста:', response.status, errorData);
      throw {
        status: response.status,
        message: errorData.detail || 'Произошла ошибка при создании поста',
        errors: errorData
      };
    }
    
    return await response.json();
  },
  updatePost: async (id, postData) => {
    const formData = new FormData();
    
    // Добавляем все поля в formData
    Object.keys(postData).forEach(key => {
      if (postData[key] !== null && postData[key] !== undefined) {
        formData.append(key, postData[key]);
      }
    });
    
    const url = `${API_URL}users/posts/${id}/`;
    const token = localStorage.getItem('token');
    // console.log(formData)
    const response = await fetch(url, {
      method: 'PATCH',
      headers: {
        'Authorization': `Token ${token}`
      },
      body: formData
    });
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw {
        status: response.status,
        message: errorData.detail || 'Произошла ошибка при обновлении поста',
        errors: errorData
      };
    }
    
    return await response.json();
  },
  deletePost: (id) => apiRequest(`users/posts/${id}/`, 'DELETE'),
  likePost: (id) => apiRequest(`users/posts/${id}/like/`, 'POST'),
  
  // Загрузка изображения для поста с помощью FormData
  uploadPostImage: async (id, file) => {
    const formData = new FormData();
    formData.append('image', file);
    
    // Используем обычный URL поста и PATCH-запрос для обновления изображения
    const url = `${API_URL}users/posts/${id}/`;
    const token = localStorage.getItem('token');
    
    console.log(`Загрузка изображения для поста ${id}`);
    
    const response = await fetch(url, {
      method: 'PATCH',
      headers: {
        'Authorization': `Token ${token}`
      },
      body: formData
    });
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      console.error('Ошибка при загрузке изображения:', response.status, errorData);
      throw {
        status: response.status,
        message: errorData.detail || 'Произошла ошибка при загрузке изображения',
        errors: errorData
      };
    }
    
    return await response.json();
  },
  
  // Комментарии к постам
  getPostComments: (postId) => apiRequest(`users/posts/${postId}/comments/`),
  addPostComment: (postId, commentData) => apiRequest(`users/posts/${postId}/comments/`, 'POST', commentData),
  updatePostComment: (id, commentData) => apiRequest(`users/comments/${id}/`, 'PATCH', commentData),
  deletePostComment: (id) => apiRequest(`users/comments/${id}/`, 'DELETE'),
};

// Экспортируем все сервисы
export {
  authService,
  catalogService,
  weddingsService,
  tendersService,
  contentService,
  plannerService,
  profileService
};

// Дефолтный экспорт всех сервисов в одном объекте
export default {
  authService,
  catalogService,
  weddingsService,
  tendersService,
  contentService,
  plannerService
};
