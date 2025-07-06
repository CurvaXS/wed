<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '@/stores/auth';

const router = useRouter();
const authStore = useAuthStore();

// Реактивные переменные для формы регистрации
const form = ref({
    username: '',
    firstName: '',
    lastName: '',
    // Данные второго супруга для роли "пара"
    partnerFirstName: '',
    partnerLastName: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: 'couple', // по умолчанию регистрация как пара
    agreeTerms: false
});

// Обработка ошибок
const errors = ref({});
const serverError = ref('');

// Валидация формы
const validateForm = () => {
    errors.value = {};
    
    if (!form.value.username.trim()) {
        errors.value.username = 'Имя пользователя обязательно для заполнения';
    }
    
    if (!form.value.firstName.trim()) {
        errors.value.firstName = 'Имя обязательно для заполнения';
    }
    
    if (!form.value.lastName.trim()) {
        errors.value.lastName = 'Фамилия обязательна для заполнения';
    }
    
    // Валидация полей второго супруга только для роли "пара"
    if (form.value.role === 'couple') {
        if (!form.value.partnerFirstName.trim()) {
            errors.value.partnerFirstName = 'Имя второго супруга обязательно для заполнения';
        }
        
        if (!form.value.partnerLastName.trim()) {
            errors.value.partnerLastName = 'Фамилия второго супруга обязательна для заполнения';
        }
    }
    
    if (!form.value.email.trim()) {
        errors.value.email = 'Email обязателен для заполнения';
    } else if (!/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/.test(form.value.email)) {
        errors.value.email = 'Введите корректный email';
    }
    
    if (!form.value.password) {
        errors.value.password = 'Пароль обязателен для заполнения';
    } else if (form.value.password.length < 8) {
        errors.value.password = 'Пароль должен содержать минимум 8 символов';
    }
    
    if (form.value.password !== form.value.confirmPassword) {
        errors.value.confirmPassword = 'Пароли не совпадают';
    }
    
    if (!form.value.agreeTerms) {
        errors.value.agreeTerms = 'Необходимо согласиться с условиями';
    }
    
    return Object.keys(errors.value).length === 0;
};

// Отправка формы
const handleSubmit = async () => {
    if (!validateForm()) return;
    
    try {
        // Подготавливаем данные для регистрации
        const userData = {
            username: form.value.username, // Используем введенное имя пользователя
            email: form.value.email,
            password: form.value.password,
            password_confirm: form.value.confirmPassword, // Используем значение из confirmPassword
            first_name: form.value.firstName,
            last_name: form.value.lastName,
            user_type: form.value.role, // Тип пользователя: couple или specialist
            // Добавляем данные второго супруга для роли "пара"
            partner_first_name: form.value.role === 'couple' ? form.value.partnerFirstName : '',
            partner_last_name: form.value.role === 'couple' ? form.value.partnerLastName : ''
        };
        
        // Вызываем метод регистрации из хранилища auth
        const result = await authStore.register(userData);
        
        if (result.success) {
            console.log('Регистрация и автоматическая авторизация успешны!');
            
            // После успешной регистрации и авторизации перенаправляем на страницу профиля
            // Сохраняем имя пользователя в localStorage для отображения в шапке
            if (form.value.role === 'couple') {
                // Для пары сохраняем имена обоих супругов
                localStorage.setItem('username', `${form.value.firstName} и ${form.value.partnerFirstName}`);
            } else {
                // Для специалиста сохраняем только его имя
                localStorage.setItem('username', `${form.value.firstName} ${form.value.lastName}`);
            }
            
            // Перенаправляем на страницу профиля
            router.push('/profile');
        } else {
            serverError.value = result.error || 'Ошибка при регистрации';
        }
    } catch (error) {
        console.error('Registration error:', error);
        
        // Обрабатываем детальные ошибки API
        if (error.errors) {
            console.log('Обработка ошибок регистрации:', error.errors);
            // Обработка пользовательских ошибок при регистрации
            if (error.errors.username && error.errors.username.length > 0) {
                errors.value.username = error.errors.username[0];
            }
            
            if (error.errors.email && error.errors.email.length > 0) {
                errors.value.email = error.errors.email[0];
                // Прокручиваем к полю email, чтобы пользователь увидел ошибку
                setTimeout(() => {
                    document.getElementById('email')?.scrollIntoView({ behavior: 'smooth', block: 'center' });
                }, 100);
            }
            
            if (error.errors.password && error.errors.password.length > 0) {
                errors.value.password = error.errors.password[0];
            }
            
            if (error.errors.password_confirm && error.errors.password_confirm.length > 0) {
                errors.value.confirmPassword = error.errors.password_confirm[0];
            }
            
            if (error.errors.user_type && error.errors.user_type.length > 0) {
                serverError.value = `Ошибка в типе пользователя: ${error.errors.user_type[0]}`;
            }
            
            // Если нет ошибок для конкретных полей, показываем общую ошибку
            const hasFieldErrors = Object.keys(errors.value).length > 0;
            if (!hasFieldErrors) {
                serverError.value = 'Ошибка при регистрации. Пожалуйста, попробуйте снова позже.';
            }
        } else {
            serverError.value = 'Ошибка при регистрации. Пожалуйста, попробуйте снова позже.';
        }
    }
};
</script>

<template>
    <div class="register-page py-12 min-h-screen bg-gray-50">
        <div class="container mx-auto px-4">
            <div class="max-w-3xl mx-auto bg-white rounded-xl shadow-lg overflow-hidden">
                <div class="md:flex">
                    <!-- Левая часть с информацией -->
                    <div class="md:w-1/2 bg-gradient-to-r from-pink-500 to-purple-600 p-8 text-white flex flex-col justify-between">
                        <div>
                            <h2 class="text-3xl font-bold mb-6">Добро пожаловать на нашу платформу!</h2>
                            <p class="text-white/80 mb-6">Создайте аккаунт и начните планировать свадьбу вашей мечты уже сегодня.</p>
                            
                            <div class="space-y-4 mb-8">
                                <div class="flex items-center">
                                    <div class="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center mr-4">
                                        <i class="fas fa-heart text-white"></i>
                                    </div>
                                    <p>Создавайте и персонализируйте ваш профиль пары</p>
                                </div>
                                <div class="flex items-center">
                                    <div class="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center mr-4">
                                        <i class="fas fa-tasks text-white"></i>
                                    </div>
                                    <p>Планируйте задачи и отслеживайте прогресс</p>
                                </div>
                                <div class="flex items-center">
                                    <div class="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center mr-4">
                                        <i class="fas fa-users text-white"></i>
                                    </div>
                                    <p>Управляйте списком гостей и рассадкой</p>
                                </div>
                            </div>
                        </div>
                        
                        <div>
                            <p class="text-sm text-white/60">Уже есть аккаунт?</p>
                            <button @click="authStore.openLoginModal" class="text-white font-medium hover:underline bg-transparent border-0 p-0 cursor-pointer">Войти</button>
                        </div>
                    </div>
                    
                    <!-- Правая часть с формой -->
                    <div class="md:w-1/2 p-8">
                        <h2 class="text-2xl font-bold mb-6 text-gray-800">Регистрация</h2>
                        
                        <form @submit.prevent="handleSubmit" class="space-y-4">
                            <!-- Общая ошибка сервера -->
                            <div v-if="serverError" class="p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 mb-4">
                                {{ serverError }}
                            </div>
                            
                            <!-- Выбор роли -->
                            <div class="flex border rounded-lg overflow-hidden mb-6">
                                <button 
                                    type="button"
                                    @click="form.role = 'couple'"
                                    class="flex-1 py-3 px-4 text-center transition"
                                    :class="form.role === 'couple' ? 'bg-pink-500 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'"
                                >
                                    <i class="fas fa-heart mr-2"></i> Я пара
                                </button>
                                <button 
                                    type="button"
                                    @click="form.role = 'specialist'"
                                    class="flex-1 py-3 px-4 text-center transition"
                                    :class="form.role === 'specialist' ? 'bg-pink-500 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'"
                                >
                                    <i class="fas fa-store mr-2"></i> Я подрядчик
                                </button>
                            </div>
                            
                            <!-- Имя пользователя -->
                            <div class="mb-4">
                                <label for="username" class="block text-sm font-medium text-gray-700 mb-1">Логин <span class="text-gray-400">(используйте латиницу)</span></label>
                                <input 
                                    type="text" 
                                    id="username" 
                                    v-model="form.username"
                                    class="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-pink-300 focus:border-pink-500 outline-none transition"
                                    :class="errors.username ? 'border-red-500' : 'border-gray-300'"
                                >
                                <p v-if="errors.username" class="mt-1 text-sm text-red-500">{{ errors.username }}</p>
                            </div>

                            <!-- Имя и фамилия -->
                            <div>
                                <h3 v-if="form.role === 'couple'" class="text-md font-medium text-gray-700 mb-2">Данные первого супруга</h3>
                                <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                                    <div>
                                        <label for="firstName" class="block text-sm font-medium text-gray-700 mb-1">Имя</label>
                                        <input 
                                            type="text" 
                                            id="firstName" 
                                            v-model="form.firstName"
                                            class="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-pink-300 focus:border-pink-500 outline-none transition"
                                            :class="errors.firstName ? 'border-red-500' : 'border-gray-300'"
                                        >
                                        <p v-if="errors.firstName" class="mt-1 text-sm text-red-500">{{ errors.firstName }}</p>
                                    </div>
                                    <div>
                                        <label for="lastName" class="block text-sm font-medium text-gray-700 mb-1">Фамилия</label>
                                        <input 
                                            type="text" 
                                            id="lastName" 
                                            v-model="form.lastName"
                                            class="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-pink-300 focus:border-pink-500 outline-none transition"
                                            :class="errors.lastName ? 'border-red-500' : 'border-gray-300'"
                                        >
                                        <p v-if="errors.lastName" class="mt-1 text-sm text-red-500">{{ errors.lastName }}</p>
                                    </div>
                                </div>
                                
                                <!-- Данные второго супруга (только для роли "пара") -->
                                <div v-if="form.role === 'couple'" class="mt-4">
                                    <h3 class="text-md font-medium text-gray-700 mb-2">Данные второго супруга</h3>
                                    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div>
                                            <label for="partnerFirstName" class="block text-sm font-medium text-gray-700 mb-1">Имя</label>
                                            <input 
                                                type="text" 
                                                id="partnerFirstName" 
                                                v-model="form.partnerFirstName"
                                                class="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-pink-300 focus:border-pink-500 outline-none transition"
                                                :class="errors.partnerFirstName ? 'border-red-500' : 'border-gray-300'"
                                            >
                                            <p v-if="errors.partnerFirstName" class="mt-1 text-sm text-red-500">{{ errors.partnerFirstName }}</p>
                                        </div>
                                        <div>
                                            <label for="partnerLastName" class="block text-sm font-medium text-gray-700 mb-1">Фамилия</label>
                                            <input 
                                                type="text" 
                                                id="partnerLastName" 
                                                v-model="form.partnerLastName"
                                                class="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-pink-300 focus:border-pink-500 outline-none transition"
                                                :class="errors.partnerLastName ? 'border-red-500' : 'border-gray-300'"
                                            >
                                            <p v-if="errors.partnerLastName" class="mt-1 text-sm text-red-500">{{ errors.partnerLastName }}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            
                            <!-- Email -->
                            <div>
                                <label for="email" class="block text-sm font-medium text-gray-700 mb-1">Email</label>
                                <input 
                                    type="email" 
                                    id="email" 
                                    v-model="form.email"
                                    class="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-pink-300 focus:border-pink-500 outline-none transition"
                                    :class="errors.email ? 'border-red-500' : 'border-gray-300'"
                                >
                                <p v-if="errors.email" class="mt-1 text-sm text-red-500">{{ errors.email }}</p>
                            </div>
                            
                            <!-- Пароль -->
                            <div>
                                <label for="password" class="block text-sm font-medium text-gray-700 mb-1">Пароль</label>
                                <input 
                                    type="password" 
                                    id="password" 
                                    v-model="form.password"
                                    class="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-pink-300 focus:border-pink-500 outline-none transition"
                                    :class="errors.password ? 'border-red-500' : 'border-gray-300'"
                                >
                                <p v-if="errors.password" class="mt-1 text-sm text-red-500">{{ errors.password }}</p>
                            </div>
                            
                            <!-- Подтверждение пароля -->
                            <div>
                                <label for="confirmPassword" class="block text-sm font-medium text-gray-700 mb-1">Подтверждение пароля</label>
                                <input 
                                    type="password" 
                                    id="confirmPassword" 
                                    v-model="form.confirmPassword"
                                    class="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-pink-300 focus:border-pink-500 outline-none transition"
                                    :class="errors.confirmPassword ? 'border-red-500' : 'border-gray-300'"
                                >
                                <p v-if="errors.confirmPassword" class="mt-1 text-sm text-red-500">{{ errors.confirmPassword }}</p>
                            </div>
                            
                            <!-- Согласие с условиями -->
                            <div class="flex items-start mt-4">
                                <div class="flex items-center h-5">
                                    <input 
                                        type="checkbox" 
                                        id="agreeTerms" 
                                        v-model="form.agreeTerms"
                                        class="w-4 h-4 border border-gray-300 rounded bg-gray-50 focus:ring-3 focus:ring-pink-300"
                                    >
                                </div>
                                <div class="ml-3 text-sm">
                                    <label for="agreeTerms" class="font-medium text-gray-700">Я согласен с <a href="#" class="text-pink-600 hover:underline">условиями использования</a> и <a href="#" class="text-pink-600 hover:underline">политикой конфиденциальности</a>.</label>
                                    <p v-if="errors.agreeTerms" class="mt-1 text-sm text-red-500">{{ errors.agreeTerms }}</p>
                                </div>
                            </div>
                            
                            <!-- Серверная ошибка -->
                            <div v-if="serverError" class="p-4 bg-red-50 border border-red-200 rounded-lg text-red-600">
                                {{ serverError }}
                            </div>
                            
                            <!-- Кнопка отправки -->
                            <button 
                                type="submit"
                                class="w-full bg-pink-500 hover:bg-pink-600 focus:ring-4 focus:ring-pink-300 text-white font-medium rounded-lg py-3 px-5 transition mt-6"
                            >
                                Зарегистрироваться
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<style scoped>
.register-page {
    background-image: url('data:image/svg+xml;charset=utf-8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 320"><path fill="%23f9a8d4" fill-opacity="0.1" d="M0,64L48,90.7C96,117,192,171,288,165.3C384,160,480,96,576,90.7C672,85,768,139,864,138.7C960,139,1056,85,1152,69.3C1248,53,1344,75,1392,85.3L1440,96L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"></path></svg>');
    background-position: bottom;
    background-repeat: no-repeat;
    background-size: 100%;
}
</style>
