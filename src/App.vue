<script setup>
import { RouterLink, RouterView } from 'vue-router'
import { useAuthStore } from '@/stores/auth';
import { ref, onMounted, onUnmounted, computed } from 'vue';

let username = ref('')
// Получаем хранилище аутентификации
const authStore = useAuthStore();

// Получаем имя пользователя из хранилища
const displayName = computed(() => {
    if (authStore.user) {
        return authStore.user.username || authStore.user.first_name || 'Пользователь';
    }
    return '';
});

// Состояние для отображения выпадающих меню
const userMenuOpen = ref(false);
const mobileMenuOpen = ref(false);

// Функция для обновления имени пользователя
function updateUsername() {
    if (authStore.isLoggedIn && authStore.user){
        username.value = authStore.user.username || authStore.user.first_name || 'Пользователь';
    } else {
        username.value = '';
    }
}

// Функция для переключения состояния меню пользователя
const toggleUserMenu = () => {
    userMenuOpen.value = !userMenuOpen.value;
};

// Функция переключения мобильного меню
const toggleMobileMenu = () => {
    mobileMenuOpen.value = !mobileMenuOpen.value;
};

// Функция для открытия модального окна входа из мобильного меню
const handleMobileLogin = () => {
    authStore.openLoginModal();
    toggleMobileMenu(); // Закрываем мобильное меню после клика
};

// Функция для закрытия меню при клике вне его
const closeMenus = (event) => {
    // Закрытие пользовательского меню
    const userMenu = document.getElementById('user-menu');
    const userMenuButton = document.getElementById('user-menu-button');
    
    // Закрытие мобильного меню
    const mobileMenu = document.getElementById('mobile-menu');
    const mobileMenuButton = document.getElementById('mobile-menu-button');

    if (userMenu && userMenuButton) {
        if (!userMenu.contains(event.target) && !userMenuButton.contains(event.target)) {
            userMenuOpen.value = false;
        }
    }

    // Проверка для мобильного меню, но не закрывать при клике на кнопку бургера
    if (mobileMenu && mobileMenuButton) {
        if (!mobileMenu.contains(event.target) && !mobileMenuButton.contains(event.target)) {
            mobileMenuOpen.value = false;
        }
    }
    
    if (mobileMenu && mobileMenuButton) {
        if (!mobileMenu.contains(event.target) && !mobileMenuButton.contains(event.target)) {
            // Раскомментируйте строку ниже, если хотите закрывать мобильное меню при клике вне
            // mobileMenuOpen.value = false;
        }
    }
};

// Обработка входа пользователя
async function handleLogin() {
    const result = await authStore.login({
        username: authStore.username,
        password: authStore.password
    });
    
    // Если вход успешен, закрываем модальное окно
    if (result.success) {
        authStore.closeLoginModal();
        // Очищаем поля формы
        authStore.username = '';
        authStore.password = '';
        // Обновляем имя пользователя
        updateUsername();
    }
}

onMounted(async () => {
    updateUsername();
    // Добавляем обработчик клика вне меню
    document.addEventListener('click', closeMenus);
    
    // Загружаем данные пользователя при инициализации, если есть токен
    if (authStore.token && !authStore.user) {
        await authStore.fetchCurrentUser();
        console.log('Пользователь загружен при инициализации App:', authStore.user);
    }
});

onUnmounted(() => {
    // Удаляем обработчик при размонтировании компонента
    document.removeEventListener('click', closeMenus);
})

</script>

<template>
  <header class="bg-white shadow-sm sticky top-0 z-50">
        <div class="container mx-auto px-4 py-3">
            <div class="flex justify-between items-center">
                <div class="flex items-center">
                    <RouterLink to="/" class="text-2xl font-bold text-pink-500 flex items-center">
                        <!-- <i class="fas fa-heart mr-2"></i>
                        Название -->
                        <img src="@/assets/img/logo.png" alt="" style="max-width: 150px;">
                    </RouterLink>
                </div>
                
                <nav class="hidden md:flex space-x-8">
                    <RouterLink to="/" class="nav-link text-gray-700 hover:text-pink-500">Главная</RouterLink> 
                    <RouterLink v-if="!authStore.isSpecialist" to="/planner" class="nav-link text-gray-700 hover:text-pink-500">Планировщик</RouterLink>
                    <RouterLink to="/catalog" class="nav-link text-gray-700 hover:text-pink-500">Каталог</RouterLink>
                    <RouterLink to="/tenders" class="nav-link text-gray-700 hover:text-pink-500">Тендеры</RouterLink>
                    <!-- <RouterLink to="/real-weddings" class="nav-link text-gray-700 hover:text-pink-500">Реальные свадьбы</RouterLink> -->
                    <!-- <RouterLink to="/articles" class="nav-link text-gray-700 hover:text-pink-500">Статьи</RouterLink> -->
                </nav>
                
                <div class="flex items-center space-x-4">
                    <!-- Показываем кнопки авторизации только если пользователь не авторизован -->
                    <template v-if="!authStore.isLoggedIn">
                        <button @click="authStore.openLoginModal" class="text-gray-700 hover:text-pink-500 hidden md:block bg-transparent border-0 cursor-pointer">Вход</button>
                        <RouterLink to="/register" class="bg-pink-500 text-white px-4 py-2 rounded-full hover:bg-pink-600 transition">Регистрация</RouterLink>
                    </template>
                    
                    <!-- Показываем информацию о пользователе если он авторизован -->
                    <div v-else class="flex items-center space-x-4">
                        <div class="relative">
                            <button 
                                id="user-menu-button"
                                @click="toggleUserMenu" 
                                class="flex items-center text-gray-700 hover:text-pink-500 bg-transparent border-0 cursor-pointer"
                            >
                                <img :src="authStore.userAvatar" alt="Аватар" class="w-8 h-8 rounded-full mr-2 object-cover">
                                <span>{{ displayName || username || 'Пользователь' }}</span>
                                <i class="fas fa-chevron-down ml-1 text-xs transition-transform" :class="{'rotate-180': userMenuOpen}"></i>
                            </button>
                            
                            <!-- Выпадающее меню -->
                            <div 
                                id="user-menu"
                                v-show="userMenuOpen" 
                                class="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg py-1 z-50 transition-all duration-200 ease-in-out"
                            >
                                <RouterLink to="/profile" class="block px-4 py-2 text-gray-700 hover:bg-pink-50 hover:text-pink-500">
                                    <i class="fas fa-user mr-2"></i> Мой профиль
                                </RouterLink>
                                <RouterLink v-if="!authStore.isSpecialist" to="/planner" class="block px-4 py-2 text-gray-700 hover:bg-pink-50 hover:text-pink-500">
                                    <i class="fas fa-tasks mr-2"></i> Планировщик
                                </RouterLink>
                                <button @click="authStore.logout" class="w-full text-left px-4 py-2 text-gray-700 hover:bg-pink-50 hover:text-pink-500">
                                    <i class="fas fa-sign-out-alt mr-2"></i> Выход
                                </button>
                            </div>
                            
                        </div>
                    </div>
                    
                    <button id="mobile-menu-button" @click="toggleMobileMenu" class="md:hidden text-gray-700">
                        <i class="fas fa-bars text-xl"></i>
                    </button>
                </div>
            </div>
            
            <!-- Mobile menu -->
            <div id="mobile-menu" :class="{'hidden': !mobileMenuOpen}" class="md:hidden mt-4 pb-4">
                <div class="flex flex-col space-y-3">
                    <RouterLink to="/" class="text-gray-700 hover:text-pink-500" @click="toggleMobileMenu">Главная</RouterLink>
                    <RouterLink v-if="!authStore.isSpecialist" to="/planner" class="text-gray-700 hover:text-pink-500" @click="toggleMobileMenu">Планировщик</RouterLink>
                    <RouterLink to="/catalog" class="text-gray-700 hover:text-pink-500" @click="toggleMobileMenu">Каталог</RouterLink>
                    <RouterLink to="/tenders" class="text-gray-700 hover:text-pink-500" @click="toggleMobileMenu">Тендеры</RouterLink>
                    <!-- <RouterLink to="/real-weddings" class="text-gray-700 hover:text-pink-500" @click="toggleMobileMenu">Реальные свадьбы</RouterLink> -->
                    <!-- <RouterLink to="/articles" class="text-gray-700 hover:text-pink-500" @click="toggleMobileMenu">Статьи</RouterLink> -->
                    <!-- Неавторизованный пользователь -->
                    <div v-if="!authStore.isLoggedIn" class="pt-2 border-t">
                        <button @click="handleMobileLogin" class="text-gray-700 hover:text-pink-500 block mb-2 bg-transparent border-0 cursor-pointer text-left w-full">Войти</button>
                        <!-- <RouterLink to="/register" class="text-pink-500 hover:text-pink-600 block" @click="toggleMobileMenu">Регистрация</RouterLink> -->
                    </div>
                    
                    <!-- Авторизованный пользователь -->
                    <div v-else class="pt-2 border-t">
                        <div class="flex items-center mb-3">
                            <img :src="authStore.userAvatar" alt="Аватар" class="w-8 h-8 rounded-full mr-2 object-cover">
                            <span class="font-medium">{{ displayName || 'Пользователь' }}</span>
                        </div>
                        <RouterLink to="/profile" class="text-gray-700 hover:text-pink-500 block mb-2" @click="toggleMobileMenu">
                            <i class="fas fa-user mr-2"></i> Мой профиль
                        </RouterLink>
                        <button @click="authStore.logout; toggleMobileMenu();" class="text-gray-700 hover:text-pink-500 block mb-2 bg-transparent border-0 cursor-pointer text-left w-full">
                            <i class="fas fa-sign-out-alt mr-2"></i> Выход
                        </button>
                    </div>
                </div>
            </div>
        </div>
    </header>

  <!-- Секция для отображения наполнения страниц -->
  <section>
    <RouterView />
  </section>

  
  <!-- Footer -->
  <footer class="bg-gray-900 text-white pt-12 pb-8">
        <div class="container mx-auto px-4">
            <div class="flex flex-col items-center justify-center">
                <div class="mb-8">
                    <h3 class="text-xl font-bold mb-4 flex items-center">
                        <i class="fas fa-heart mr-2 text-pink-400"></i> СвадьбаГид
                    </h3>
                </div>
                
                <!-- Меню в подвале (идентичное шапке) -->
                <nav class="flex flex-wrap justify-center space-x-4 space-y-2 md:space-y-0 mb-8">
                    <RouterLink to="/" class="text-gray-400 hover:text-white">Главная</RouterLink>
                    <RouterLink v-if="!authStore.isSpecialist" to="/planner" class="text-gray-400 hover:text-white">Планировщик</RouterLink>
                    <RouterLink to="/catalog" class="text-gray-400 hover:text-white">Каталог</RouterLink>
                    <RouterLink to="/tenders" class="text-gray-400 hover:text-white">Тендеры</RouterLink>
                    <!-- <RouterLink to="/real-weddings" class="text-gray-400 hover:text-white">Реальные свадьбы</RouterLink> -->
                    <!-- <RouterLink to="/articles" class="text-gray-400 hover:text-white">Статьи</RouterLink> -->
                </nav>
            </div>
            
            <div class="pt-8 border-t border-gray-800 flex flex-col md:flex-row justify-center items-center">
                <p class="text-gray-500 text-sm">© 2025 СвадьбаГид. Все права защищены.</p>
            </div>
        </div>
  </footer>

    <!-- Login Modal -->
    <div v-if="authStore.showLoginModal" class="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" @click.self="authStore.closeLoginModal()">
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
            
            <form @submit.prevent="handleLogin">
                <div v-if="authStore.error" class="mb-4 p-3 bg-red-50 text-red-700 rounded-lg border border-red-200">
                    {{ authStore.error }}
                </div>
                
                <div class="mb-4">
                    <label for="username" class="block text-gray-700 mb-2">Имя пользователя</label>
                    <input 
                        type="text" 
                        id="username" 
                        v-model="authStore.username" 
                        class="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent" 
                        placeholder="Введите имя пользователя"
                    >
                </div>
                
                <div class="mb-6">
                    <label for="password" class="block text-gray-700 mb-2">Пароль</label>
                    <input 
                        type="password" 
                        id="password" 
                        v-model="authStore.password" 
                        class="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent" 
                        placeholder="Ваш пароль"
                    >
                    <a href="#" class="text-sm text-pink-500 hover:text-pink-600 mt-1 block">Забыли пароль?</a>
                </div>
                
                <button 
                    type="submit" 
                    class="w-full bg-pink-500 text-white py-3 rounded-lg font-medium hover:bg-pink-600 mb-4" 
                    :disabled="authStore.isLoading"
                >
                    <span v-if="authStore.isLoading">
                        <i class="fas fa-spinner fa-spin mr-2"></i> Загрузка...
                    </span>
                    <span v-else>Войти</span>
                </button>
                
                <p class="text-center text-gray-600">
                    Ещё нет аккаунта? <router-link to="/register" @click="authStore.closeLoginModal()" class="text-pink-500 hover:text-pink-600 font-medium">Зарегистрироваться</router-link>
                </p>
            </form>
        </div>
    </div>


</template>

<style scoped>

</style>
