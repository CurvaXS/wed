// auth.js - Store для аутентификации пользователя
import { defineStore } from 'pinia';
import { authService } from '@/services/apiService';
import avatar from '@/assets/img/default-avatar.png'

export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: null,
    token: localStorage.getItem('token') || null,
    isLoading: false,
    error: null,
    showLoginModal: false,
    username: '',
    password: ''
  }),
  
  getters: {
    isLoggedIn: (state) => !!state.token,
    isCouple: (state) => state.user?.user_type === 'couple',
    isSpecialist: (state) => state.user?.user_type === 'specialist',
    isAdmin: (state) => state.user?.is_staff === true,
    userAvatar: (state) => state.user?.avatar || avatar
  },
  
  actions: {
    // Открытие/закрытие модального окна логина
    openLoginModal() {
      this.showLoginModal = true;
    },
    
    closeLoginModal() {
      this.showLoginModal = false;
      // Очищаем поля при закрытии модального окна
      this.username = '';
      this.password = '';
      this.error = null;
    },
    
    // Вход в систему - объединенная версия
    async login(credentials) {
      this.isLoading = true;
      this.error = null;
      
      try {
        // Если переданы явные учетные данные, используем их
        // Иначе используем данные из состояния (для модального окна)
        const loginData = credentials || {
          username: this.username,
          password: this.password
        };
        
        const response = await authService.login(loginData);
        
        // Поддержка разных форматов ответа (token или auth_token)
        this.token = response.token || response.auth_token;
        localStorage.setItem('token', this.token);
        
        // Сохраняем данные пользователя из ответа, если они есть
        if (response.user) {
          console.log('Данные пользователя из ответа:', response.user);
          this.user = response.user;
          localStorage.setItem('username', response.user.username);
        }
        
        // Всегда получаем полные данные пользователя
        await this.fetchCurrentUser();
        
        // Если вход был из модального окна, закрываем его
        if (!credentials) {
          this.closeLoginModal();
        }
        
        return { success: true };
      } catch (error) {
        this.error = error.message || 'Ошибка входа. Проверьте учетные данные.';
        return { success: false, error: this.error };
      } finally {
        this.isLoading = false;
      }
    },
    
    // Регистрация - объединенная версия
    async register(userData) {
      this.isLoading = true;
      this.error = null;
      
      try {
        console.log('Отправляем данные для регистрации:', userData);
        const response = await authService.register(userData);
        console.log('Успешный ответ при регистрации:', response);
        
        // Автоматически входим после регистрации
        if (response.id || response.token) {
          // Для модальной формы
          if (!userData.username) {
            this.username = userData.username;
            this.password = userData.password;
            return await this.login();
          } else {
            // Для обычной формы
            return await this.login({
              username: userData.username,
              password: userData.password
            });
          }
        }
        
        return { success: true };
      } catch (error) {
        console.error('Ошибка при регистрации пользователя:', error);
        
        // Формируем понятное сообщение об ошибке для пользователя
        if (error.errors) {
          console.error('Детали ошибки:', error.errors);
          
          // Проверяем конкретные типы ошибок и делаем их более человечными
          if (error.errors.email && error.errors.email.length > 0) {
            this.error = `Ошибка email: ${error.errors.email[0]}`;
          } else if (error.errors.username && error.errors.username.length > 0) {
            this.error = `Ошибка имени пользователя: ${error.errors.username[0]}`;
          } else if (error.errors.password && error.errors.password.length > 0) {
            this.error = `Ошибка пароля: ${error.errors.password[0]}`;
          } else if (error.errors.user_type && error.errors.user_type.length > 0) {
            this.error = `Ошибка типа пользователя: ${error.errors.user_type[0]}`;
          } else {
            // Если ошибка не соответствует известным полям, берем первое доступное сообщение
            const firstErrorField = Object.keys(error.errors)[0];
            if (firstErrorField) {
              this.error = `Ошибка ${firstErrorField}: ${error.errors[firstErrorField][0]}`;
            } else {
              this.error = 'Ошибка при регистрации. Пожалуйста, проверьте введенные данные.';
            }
          }
        } else {
          this.error = error.message || 'Ошибка при регистрации. Пожалуйста, попробуйте снова позже.';
        }
        
        return { success: false, error: this.error, details: error.errors };
      } finally {
        this.isLoading = false;
      }
    },
    
    // Получение данных текущего пользователя - улучшенная версия
    async fetchCurrentUser() {
      console.log('Вызываем fetchCurrentUser, текущий токен:', this.token);
      
      // Если нет токена, не делаем запрос
      if (!this.token) {
        console.log('Нет токена, пропускаем запрос на получение данных пользователя');
        return null;
      }
      
      this.isLoading = true;
      
      try {
        console.log('Отправляем запрос на получение данных пользователя...');
        const user = await authService.getCurrentUser();
        console.log('Получены данные пользователя:', user);
        
        if (user) {
          this.user = user;
          console.log('Данные пользователя успешно обновлены');
        }
        
        return user;
      } catch (error) {
        console.error('Ошибка при получении данных пользователя:', error);
        
        // Если не удалось получить пользователя, возможно, токен устарел
        if (error.response && (error.response.status === 401 || error.response.status === 403)) {
          console.log('Недействительный токен, выходим из системы');
          this.logout();
        }
        
        return null;
      } finally {
        this.isLoading = false;
      }
    },
    
    // Выход из системы
    logout() {
      this.user = null;
      this.token = null;
      localStorage.removeItem('token');
      
      // Вызываем logout метод из сервиса, если он существует
      if (typeof authService.logout === 'function') {
        authService.logout();
      }
      
      // Перенаправляем на главную страницу при выходе
      window.location.href = '/';
    }
  }
});
