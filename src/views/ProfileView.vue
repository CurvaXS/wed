<script setup>
import { ref, computed, onMounted } from 'vue';
import { useAuthStore } from '@/stores/auth';
import { profileService } from '@/services/apiService';


const authStore = useAuthStore();
const isLoading = ref(false);
const errorMessage = ref('');
const successMessage = ref('');
// const API_URL = ref('http://127.0.0.1:8000/api/v1/')
const dateNotificationVisible = ref(false);
const isEditingWeddingDetails = ref(false); // Флаг для модального окна редактирования деталей свадьбы

// Загрузка данных при инициализации
onMounted(() => {
  loadProfile();
});

// Загрузка данных профиля из API
// const loadProfile = async () => {
//   isLoading.value = true;
//   errorMessage.value = '';
  
//   try {
//     // Загружаем профиль пользователя
//     const profileData = await profileService.getUserProfile();
//     console.log('Загруженные данные профиля:', profileData);
    
//     // Заполняем данные профиля пары, если они есть
//     if (profileData.couple_profile) {
//       coupleProfile.value = {
//         avatar: profileData.avatar || null,
//         brideName: profileData.couple_profile.bride_name || '',
//         groomName: profileData.couple_profile.groom_name || '',
//         aboutUs: profileData.couple_profile.about_us || ''
//       };
//     }
    
//     // Заполняем детали свадьбы, если они есть
//     if (profileData.couple_profile && profileData.couple_profile.wedding_details) {
//       const wd = profileData.couple_profile.wedding_details;
//       weddingDetails.value = {
//         date: wd.date || '',
//         time: wd.time || '',
//         venue: wd.venue || '',
//         address: wd.address || '',
//         dressCode: wd.dress_code || ''
//       };
      
//       // Отладочная информация по дате свадьбы
//       console.log('Загружена дата свадьбы:', weddingDetails.value.date);
//     }
    
//     // Загружаем события истории пары
//     try {
//       const storyData = await profileService.getStoryEvents();
//       if (storyData && Array.isArray(storyData)) {
//         storyEvents.value = storyData;
//       } else {
//         // Если API не вернул данные, используем пример
//         console.log('Нет данных истории в API, используем примеры');
//         storyEvents.value = defaultStoryEvents;
//       }
//     } catch (error) {
//       console.error('Ошибка при загрузке истории пары:', error);
//       storyEvents.value = defaultStoryEvents;
//     }
    
//     // Проверка и уведомление о дате свадьбы
//     if (!weddingDetails.value.date) {
//       setTimeout(() => {
//         dateNotificationVisible.value = true;
//       }, 1000);
//     }
    
//     // Загружаем данные команды
//     try {
//       const teamData = await profileService.getTeamMembers();
//       if (teamData && Array.isArray(teamData)) {
//         teamMembers.value = teamData;
//       }
//     } catch (error) {
//       console.error('Ошибка при загрузке членов команды:', error);
//     }
    
//   } catch (error) {
//     console.error('Ошибка при загрузке профиля:', error);
//     errorMessage.value = 'Произошла ошибка при загрузке данных профиля';
//   } finally {
//     isLoading.value = false;
//   }
// };

// Вычисляемое свойство для расчета дней до свадьбы
const daysUntilWedding = computed(() => {
    // Если дата свадьбы не установлена, возвращаем null
    if (!weddingDetails.value.date) {
        console.log('Дата свадьбы отсутствует');
        return null;
    }
    
    let weddingDate;
    
    // Проверяем формат даты и преобразуем при необходимости
    if (typeof weddingDetails.value.date === 'string') {
        // Если дата в формате DD.MM.YYYY, конвертируем в YYYY-MM-DD
        if (weddingDetails.value.date.includes('.')) {
            const parts = weddingDetails.value.date.split('.');
            if (parts.length === 3) {
                weddingDate = new Date(`${parts[2]}-${parts[1]}-${parts[0]}`);
                console.log('Преобразована дата из DD.MM.YYYY:', weddingDetails.value.date, '->', weddingDate);
            } else {
                weddingDate = new Date(weddingDetails.value.date);
            }
        } else {
            // Предполагаем, что это уже формат ISO или другой валидный формат
            weddingDate = new Date(weddingDetails.value.date);
        }
    } else {
        // Если дата уже объект Date
        weddingDate = new Date(weddingDetails.value.date);
    }
    
    // Проверяем, что объект даты валидный
    if (isNaN(weddingDate.getTime())) {
        console.error('Невалидная дата свадьбы:', weddingDetails.value.date);
        return null;
    }
    
    const today = new Date();
    
    // Сбрасываем часы, минуты, секунды для корректного сравнения только дат
    weddingDate.setHours(0, 0, 0, 0);
    today.setHours(0, 0, 0, 0);
    
    // Вычисляем разницу в миллисекундах и переводим в дни
    const diffTime = weddingDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    console.log('Дата свадьбы:', weddingDate, 'Разница в днях:', diffDays);
    
    return diffDays > 0 ? diffDays : null; // Возвращаем null, если дата в прошлом
});

// Состояние профиля пары
const coupleProfile = ref({
    avatar: null,
    brideName: '',
    groomName: '',
    aboutUs: ''
});

// Состояние деталей свадьбы
const weddingDetails = ref({
    date: '',
    time: '',
    venue: '',
    address: '',
    dressCode: ''
});

// Состояние членов команды
const teamMembers = ref([]);

// Состояние постов
const posts = ref([]);

// Файл изображения для поста
const postImageFile = ref(null);

// Состояние истории пары
// Используем пустой массив, который будет заполнен из API
const storyEvents = ref([]);

// Пример данных для тестирования, если API не вернет данные
const defaultStoryEvents = [
    {
        id: 1,
        title: 'Первая встреча',
        date: '2020-08-15',
        description: 'Мы познакомились на дне рождения нашего общего друга Кати. Михаил пришел с коллегой, а я с подругой. Разговорились за столом и поняли, что у нас много общего.',
        photo: 'https://images.unsplash.com/photo-1494774157365-9e04c6720e47?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=500&q=80'
    },
    {
        id: 2,
        title: 'Первое свидание',
        date: '2020-08-22',
        description: 'Через неделю после знакомства Михаил пригласил меня на ужин в итальянский ресторан. Мы просидели там до закрытия, разговаривая обо всем на свете.',
        photo: null
    },
    {
        id: 3,
        title: 'Первое путешествие',
        date: '2020-10-10',
        description: 'Наши первые совместные каникулы мы провели в Крыму. Жили в маленьком домике у моря, ходили в походы и ездили на экскурсии. Именно тогда я поняла, что Михаил - тот самый человек.',
        photos: [
            'https://images.unsplash.com/photo-1503917988258-f87a50bd3c5f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=500&q=80',
            'https://images.unsplash.com/photo-1506197603052-3cc9c3a201bd?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=500&q=80'
        ]
    },
    {
        id: 4,
        title: 'Предложение',
        date: '2023-02-14',
        description: 'Михаил сделал мне предложение в Париже, на смотровой площадке у Эйфелевой башни. Это был самый романтичный момент в моей жизни! Конечно, я сказала "ДА!"',
        photo: 'https://images.unsplash.com/photo-1519671482749-fd09be7ccebf?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=500&q=80'
    },
    {
        id: 5,
        title: 'Свадьба',
        date: '2024-06-15',
        description: 'Мы планируем нашу свадьбу и с нетерпением ждем этого дня! Хотим, чтобы это был самый прекрасный день в нашей жизни, наполненный любовью, радостью и теплом наших близких.',
        photo: null
    }
];

// Флаги для управления модальными окнами
const showPhotoUploadModal = ref(false);
const showEditProfileModal = ref(false);
const showEditWeddingDetailsModal = ref(false);
const showTeamMemberModal = ref(false);
const showStoryModal = ref(false);

// Флаг для отображения всех членов команды
const showAllTeamMembers = ref(false);

// Временные данные для редактирования
const photoPreview = ref(null);
const storyPhotoPreview = ref(null);
const editedProfile = ref({...coupleProfile.value});
const editedWeddingDetails = ref({...weddingDetails.value});
const editedTeamMember = ref({ id: null, name: '', role: '', icon: 'camera-retro', color: 'blue' });
const editedStory = ref({ id: null, title: '', date: '', description: '', photo: null });
const editingTeamMember = ref(false);
const editingStory = ref(false);

// Данные для публикации поста
const newPost = ref({
    content: '',
    image: null
});
const emojiPickerVisible = ref(false);

// Вычисляемые свойства
const visibleTeamMembers = computed(() => {
    if (showAllTeamMembers.value) {
        return teamMembers.value;
    } else {
        return teamMembers.value.slice(0, 3);
    }
});

// Методы для работы с фото профиля
const avatarFile = ref(null);

const handlePhotoUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
        avatarFile.value = file;
        photoPreview.value = URL.createObjectURL(file);
    }
};

const uploadProfilePhoto = async () => {
    if (!avatarFile.value) return;
    
    try {
        isLoading.value = true;
        errorMessage.value = '';
        
        const response = await profileService.uploadAvatar(avatarFile.value);
        coupleProfile.value.avatar = response.avatar;
        successMessage.value = 'Фото профиля успешно обновлено';
        
        // Обновляем данные пользователя в хранилище аутентификации
        await authStore.fetchCurrentUser();
        
        photoPreview.value = null;
        avatarFile.value = null;
        showPhotoUploadModal.value = false;
    } catch (error) {
        errorMessage.value = error.message || 'Ошибка при загрузке фото';
        console.error('Ошибка при загрузке фото:', error);
    } finally {
        isLoading.value = false;
        
        // Скрыть сообщение об успехе через 3 секунды
        if (successMessage.value) {
            setTimeout(() => {
                successMessage.value = '';
            }, 3000);
        }
    }
};

// Методы для редактирования профиля
const openEditProfile = () => {
    editedProfile.value = {...coupleProfile.value};
    showEditProfileModal.value = true;
};

const saveProfileInfo = async () => {
    try {
        isLoading.value = true;
        errorMessage.value = '';
        
        const response = await profileService.updateCoupleProfile({
            bride_name: editedProfile.value.brideName,
            groom_name: editedProfile.value.groomName,
            about_us: editedProfile.value.aboutUs
        });
        
        // Обновляем локальное состояние после успешного запроса
        coupleProfile.value = {
            ...coupleProfile.value,
            brideName: response.bride_name,
            groomName: response.groom_name,
            aboutUs: response.about_us
        };
        
        successMessage.value = 'Профиль успешно обновлен';
        showEditProfileModal.value = false;
    } catch (error) {
        errorMessage.value = error.message || 'Ошибка при обновлении профиля';
        console.error('Ошибка при обновлении профиля:', error);
    } finally {
        isLoading.value = false;
        
        // Скрыть сообщение об успехе через 3 секунды
        if (successMessage.value) {
            setTimeout(() => {
                successMessage.value = '';
            }, 3000);
        }
    }
};

// Методы для редактирования деталей свадьбы
const openEditWeddingDetails = () => {
    editedWeddingDetails.value = {...weddingDetails.value};
    showEditWeddingDetailsModal.value = true;
    dateNotificationVisible.value = false; // Закрываем уведомление, если оно отображается
};

const saveWeddingDetails = async () => {
    try {
        isLoading.value = true;
        errorMessage.value = '';
        
        // Получаем текущую дату и преобразуем ее в формат, ожидаемый API
        let dateToSend = editedWeddingDetails.value.date;
        
        console.log('Исходная дата для отправки:', dateToSend, typeof dateToSend);
        
        // Обрабатываем разные форматы даты
        if (dateToSend) {
            // Для формата dd.mm.yyyy (русский формат)
            if (typeof dateToSend === 'string' && dateToSend.includes('.')) {
                const parts = dateToSend.split('.');
                if (parts.length === 3) {
                    const newDate = new Date(`${parts[2]}-${parts[1]}-${parts[0]}`);
                    if (!isNaN(newDate.getTime())) {
                        dateToSend = newDate.toISOString().split('T')[0]; // YYYY-MM-DD
                        console.log('Дата преобразована из dd.mm.yyyy в ISO:', dateToSend);
                    }
                }
            } 
            // Для объекта Date
            else if (dateToSend instanceof Date && !isNaN(dateToSend.getTime())) {
                dateToSend = dateToSend.toISOString().split('T')[0]; // YYYY-MM-DD
                console.log('Дата преобразована из объекта Date в ISO:', dateToSend);
            }
            // Для других строковых форматов проверяем и конвертируем
            else if (typeof dateToSend === 'string') {
                const date = new Date(dateToSend);
                if (!isNaN(date.getTime())) {
                    dateToSend = date.toISOString().split('T')[0]; // YYYY-MM-DD
                    console.log('Дата преобразована в стандартный ISO:', dateToSend);
                }
            }
        }
        
        console.log('Итоговая дата для отправки:', dateToSend);
        
        const response = await profileService.updateWeddingDetails({
            date: dateToSend, // Отправляем дату в формате YYYY-MM-DD
            time: editedWeddingDetails.value.time,
            venue: editedWeddingDetails.value.venue,
            address: editedWeddingDetails.value.address,
            dress_code: editedWeddingDetails.value.dressCode
        });
        
        console.log('Ответ сервера:', response);
        
        // Обрабатываем дату из ответа сервера
        const responseDate = response.date;
        let displayDate = '';
        
        try {
            if (responseDate) {
                const date = new Date(responseDate);
                if (!isNaN(date.getTime())) {
                    displayDate = date.toLocaleDateString('ru-RU');
                    console.log('Дата из ответа API форматирована:', responseDate, '->', displayDate);
                }
            }
        } catch (e) {
            console.warn('Ошибка при обработке даты из ответа:', e);
        }
        
        // Обновляем локальное состояние после успешного запроса
        weddingDetails.value = {
            ...weddingDetails.value,
            date: responseDate, // Сохраняем ISO формат
            displayDate: displayDate, // Для отображения
            time: response.time,
            venue: response.venue,
            address: response.address,
            dressCode: response.dress_code
        };
        
        console.log('Обновлено состояние weddingDetails:', weddingDetails.value);
        
        // Принудительно обновляем вычисляемое свойство daysUntilWedding
        console.log('Обновлен счетчик дней до свадьбы:', daysUntilWedding.value);
        
        successMessage.value = 'Детали свадьбы успешно обновлены';
        showEditWeddingDetailsModal.value = false;
    } catch (error) {
        errorMessage.value = error.message || 'Ошибка при обновлении деталей свадьбы';
        console.error('Ошибка при обновлении деталей свадьбы:', error);
    } finally {
        isLoading.value = false;
        
        // Скрыть сообщение об успехе через 3 секунды
        if (successMessage.value) {
            setTimeout(() => {
                successMessage.value = '';
            }, 3000);
        }
    }
};

// Методы для управления командой
const toggleTeamMembersVisibility = () => {
    showAllTeamMembers.value = !showAllTeamMembers.value;
};

const openAddTeamMember = () => {
    editingTeamMember.value = false;
    editedTeamMember.value = { id: Date.now(), name: '', role: '', icon: 'camera-retro', color: 'blue' };
    showTeamMemberModal.value = true;
};

const openEditTeamMember = (member) => {
    editingTeamMember.value = true;
    editedTeamMember.value = {...member};
    showTeamMemberModal.value = true;
};

const saveTeamMember = async () => {
    try {
        isLoading.value = true;
        errorMessage.value = '';
        
        // Получаем ID профиля пары из данных пользователя
        const user = await profileService.getUserProfile();
        const coupleId = user?.couple_profile?.id;
        
        if (!coupleId) {
            throw new Error('Не удалось получить ID профиля пары');
        }
        
        // Собираем данные формы
        const memberData = {
            name: editedTeamMember.value.name,
            role: editedTeamMember.value.role,
            icon: editedTeamMember.value.icon,
            color: editedTeamMember.value.color,
            couple: coupleId // Добавляем идентификатор профиля пары
        };
        
        console.log('Отправляем данные члена команды:', memberData);
        
        let response;
        
        if (editingTeamMember.value) {
            // Обновляем существующего члена команды
            response = await profileService.updateTeamMember(editedTeamMember.value.id, memberData);
            
            // Обновляем локальное состояние
            const index = teamMembers.value.findIndex(m => m.id === editedTeamMember.value.id);
            if (index !== -1) {
                teamMembers.value[index] = {
                    id: response.id,
                    name: response.name,
                    role: response.role,
                    icon: response.icon,
                    color: response.color
                };
            }
        } else {
            // Создаем нового члена команды
            response = await profileService.createTeamMember(memberData);
            
            // Добавляем в локальное состояние
            teamMembers.value.push({
                id: response.id,
                name: response.name,
                role: response.role,
                icon: response.icon,
                color: response.color
            });
        }
        
        successMessage.value = editingTeamMember.value ? 'Член команды обновлен' : 'Член команды добавлен';
        showTeamMemberModal.value = false;
    } catch (error) {
        errorMessage.value = error.message || 'Ошибка при сохранении члена команды';
        console.error('Ошибка при сохранении члена команды:', error);
    } finally {
        isLoading.value = false;
        
        // Скрыть сообщение об успехе через 3 секунды
        if (successMessage.value) {
            setTimeout(() => {
                successMessage.value = '';
            }, 3000);
        }
    }
};

const removeTeamMember = async (id) => {
    if (confirm('Вы уверены, что хотите удалить этого члена команды?')) {
        try {
            isLoading.value = true;
            errorMessage.value = '';
            
            // Отправляем запрос на удаление
            await profileService.deleteTeamMember(id);
            
            // Обновляем локальное состояние
            teamMembers.value = teamMembers.value.filter(m => m.id !== id);
            
            successMessage.value = 'Член команды удален';
        } catch (error) {
            errorMessage.value = error.message || 'Ошибка при удалении члена команды';
            console.error('Ошибка при удалении члена команды:', error);
        } finally {
            isLoading.value = false;
            
            // Скрыть сообщение об успехе через 3 секунды
            if (successMessage.value) {
                setTimeout(() => {
                    successMessage.value = '';
                }, 3000);
            }
        }
    }
};

// Методы для публикации постов
const toggleEmojiPicker = () => {
    emojiPickerVisible.value = !emojiPickerVisible.value;
};

const addEmoji = (emoji) => {
    newPost.value.content += emoji;
    emojiPickerVisible.value = false;
};

const addPostImage = (event) => {
    const file = event.target.files[0];
    if (file) {
        postImageFile.value = file;
        newPost.value.image = URL.createObjectURL(file);
    }
};

const removePostImage = () => {
    newPost.value.image = null;
};

const publishPost = async () => {
    if (!newPost.value.content.trim()) return;
    
    try {
        // Получаем ID профиля пары из user.couple_profile
        const userProfile = await profileService.getUserProfile();
        console.log('Полученный профиль пользователя:', userProfile);
        
        const coupleId = userProfile.couple_profile?.id;
        if (!coupleId) {
            throw new Error('Профиль пары не найден');
        }
        
        // Создаем FormData и добавляем все необходимые поля сразу
        const formData = new FormData();
        formData.append('content', newPost.value.content);
        formData.append('couple', coupleId);
        
        // Если есть изображение, добавляем его сразу в FormData
        if (postImageFile.value) {
            formData.append('image', postImageFile.value);
        }
        
        console.log('Отправляем данные поста с изображением');
        
        // Используем apiService напрямую для отправки FormData
        const response = await profileService.createPostWithImage(formData);
        console.log('Ответ сервера:', response);
        
        // Получаем обновленный список постов
        await loadPosts();
        
        // Очищаем форму
        newPost.value = { content: '', image: null };
        postImageFile.value = null;
        emojiPickerVisible.value = false;
        
        successMessage.value = 'Пост успешно опубликован';
    } catch (error) {
        errorMessage.value = error.message || 'Ошибка при публикации поста';
        console.error('Ошибка при публикации поста:', error);
    } finally {
        isLoading.value = false;
        
        // Скрыть сообщение об успехе через 3 секунды
        if (successMessage.value) {
            setTimeout(() => {
                successMessage.value = '';
            }, 3000);
        }
    }
};

// Методы для управления историей
const openAddStory = () => {
    editingStory.value = false;
    editedStory.value = { id: Date.now(), title: '', date: '', description: '', photo: null };
    storyPhotoPreview.value = null;
    showStoryModal.value = true;
};

const openEditStory = (story) => {
    editingStory.value = true;
    editedStory.value = {...story};
    storyPhotoPreview.value = story.photo;
    showStoryModal.value = true;
};

const handleStoryPhotoUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
        storyPhotoPreview.value = URL.createObjectURL(file);
    }
};

const saveStory = async () => {
    isLoading.value = true;
    errorMessage.value = '';
    
    try {
        // Подготавливаем данные для отправки
        const storyData = {
            ...editedStory.value
        };
        
        // Обрабатываем фото, если оно изменилось
        if (storyPhotoPreview.value && storyPhotoPreview.value instanceof File) {
            storyData.photo = storyPhotoPreview.value;
        }
        
        let result;
        
        if (editingStory.value) {
            // Обновляем существующее событие через API
            console.log('Обновляем событие истории:', storyData.id);
            result = await profileService.updateStoryEvent(storyData.id, storyData);
            
            // Обновляем локальное состояние
            const index = storyEvents.value.findIndex(s => s.id === storyData.id);
            if (index !== -1) {
                storyEvents.value[index] = result;
            }
            
            successMessage.value = 'Событие истории успешно обновлено';
        } else {
            // Создаем новое событие через API
            console.log('Создаем новое событие истории');
            result = await profileService.createStoryEvent(storyData);
            
            // Добавляем в локальное состояние
            storyEvents.value.push(result);
            
            successMessage.value = 'Новое событие истории добавлено';
        }
        
        // Очищаем форму и закрываем модальное окно
        storyPhotoPreview.value = null;
        showStoryModal.value = false;
        
    } catch (error) {
        console.error('Ошибка при сохранении события истории:', error);
        errorMessage.value = 'Произошла ошибка при сохранении события истории';
    } finally {
        isLoading.value = false;
        
        // Скрываем сообщение об успехе через 3 секунды
        if (successMessage.value) {
            setTimeout(() => {
                successMessage.value = '';
            }, 3000);
        }
    }
};

const removeStory = async (id) => {
    if (confirm('Вы уверены, что хотите удалить эту историю?')) {
        isLoading.value = true;
        errorMessage.value = '';
        
        try {
            // Удаляем событие через API
            await profileService.deleteStoryEvent(id);
            
            // Удаляем из локального состояния
            storyEvents.value = storyEvents.value.filter(s => s.id !== id);
            
            successMessage.value = 'Событие истории успешно удалено';
            
            // Скрываем сообщение об успехе через 3 секунды
            setTimeout(() => {
                successMessage.value = '';
            }, 3000);
        } catch (error) {
            console.error('Ошибка при удалении события истории:', error);
            errorMessage.value = 'Произошла ошибка при удалении события';
        } finally {
            isLoading.value = false;
        }
    }
};

// Функция для форматирования даты в формате 'время назад'
const formatDate = (date) => {
    const now = new Date();
    const postDate = new Date(date);
    const diffTime = Math.abs(now - postDate);
    const diffMinutes = Math.floor(diffTime / (1000 * 60));
    const diffHours = Math.floor(diffTime / (1000 * 60 * 60));
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffMinutes < 60) {
        return `${diffMinutes} минут назад`;
    } else if (diffHours < 24) {
        return `${diffHours} часов назад`;
    } else if (diffDays < 7) {
        return `${diffDays} дней назад`;
    } else {
        return postDate.toLocaleDateString('ru-RU');
    }
};

// Функция для форматирования даты свадьбы
const formatWeddingDate = (date) => {
    if (!date) return '';
    
    try {
        const weddingDate = new Date(date);
        if (isNaN(weddingDate.getTime())) {
            console.warn('Невалидная дата свадьбы при форматировании:', date);
            return '';
        }
        return weddingDate.toLocaleDateString('ru-RU');
    } catch (e) {
        console.error('Ошибка при форматировании даты свадьбы:', e);
        return '';
    }
};

// Функция для обработки лайков
const likePost = async (post) => {
    try {
        isLoading.value = true;
        errorMessage.value = '';
        
        // Отправляем запрос на лайк поста
        await profileService.likePost(post.id);
        
        // Обновляем локальное состояние
        post.likes += 1;
        
    } catch (error) {
        errorMessage.value = error.message || 'Ошибка при лайке поста';
        console.error('Ошибка при лайке поста:', error);
    } finally {
        isLoading.value = false;
    }
};

// Функция загрузки постов с сервера
const loadPosts = async () => {
    try {
        const response = await profileService.getPosts();
        console.log('Полученные посты:', response);
        
        posts.value = response.map(post => {
            // Безопасное преобразование даты
            let postDate;
            try {
                postDate = post.date_created ? new Date(post.date_created) : new Date();
                // Проверка валидности даты
                if (isNaN(postDate.getTime())) {
                    console.warn('Некорректная дата для поста:', post.id, post.date_created);
                    postDate = new Date(); // Используем текущую дату как запасной вариант
                }
            } catch (e) {
                console.warn('Ошибка при обработке даты поста:', e);
                postDate = new Date();
            }
            
            return {
                id: post.id,
                author: post.author || 'Пользователь',
                content: post.content,
                image: post.image,
                date: postDate,
                likes: post.likes || 0,
                comments: Array.isArray(post.comments) ? post.comments.map(comment => ({
                    id: comment.id,
                    author: comment.user_name || 'Пользователь',
                    text: comment.text
                })) : []
            };
        });
        
        console.log('Преобразованные посты:', posts.value);
    } catch (error) {
        console.error('Ошибка при загрузке постов:', error);
        errorMessage.value = 'Не удалось загрузить посты';
    }
};

// Функция для загрузки команды с сервера
const loadTeamMembers = async () => {
    try {
        const response = await profileService.getTeamMembers();
        teamMembers.value = response.map(member => ({
            id: member.id,
            name: member.name,
            role: member.role,
            icon: member.icon,
            color: member.color
        }));
    } catch (error) {
        console.error('Ошибка при загрузке команды:', error);
        errorMessage.value = 'Не удалось загрузить информацию о команде';
    }
};

// Основная функция загрузки профиля
const loadProfile = async () => {
    isLoading.value = true;
    errorMessage.value = '';
    
    try {
        // Загружаем профиль пользователя
        const user = authStore.user;
        
        if (user && user.couple_profile) {
            // Безопасно извлекаем данные профиля пары
            const coupleData = user.couple_profile;
            coupleProfile.value = {
                id: coupleData.id,
                avatar: user.avatar,
                brideName: user.first_name || '',
                groomName: user.last_name || '',
                partnerFirstName: coupleData.partner_first_name || '',
                partnerLastName: coupleData.partner_last_name || '',
                aboutUs: coupleData.about_us || ''
            };
            
            // Форматируем дату свадьбы для отображения
            let weddingDate = coupleData.wedding_date;
            try {
                if (weddingDate) {
                    const date = new Date(weddingDate);
                    if (!isNaN(date.getTime())) {
                        weddingDate = date.toLocaleDateString('ru-RU');
                    }
                }
            } catch (e) {
                console.warn('Ошибка при обработке даты свадьбы:', e);
                weddingDate = '';
            }
            
            // Обновляем дату свадьбы в профиле
            coupleProfile.value.weddingDate = weddingDate;
            
            if (coupleData.wedding_details) {
                const details = coupleData.wedding_details;
                const rawDate = details.date || '';
                let displayDate = '';
                
                try {
                    if (rawDate) {
                        const date = new Date(rawDate);
                        if (!isNaN(date.getTime())) {
                            displayDate = date.toLocaleDateString('ru-RU');
                        }
                    }
                } catch (e) {
                    console.warn('Ошибка при обработке даты свадебных деталей:', e);
                }
                
                weddingDetails.value = {
                    date: rawDate,
                    displayDate: displayDate,
                    time: details.time || '',
                    venue: details.venue || '',
                    address: details.address || '',
                    dressCode: details.dress_code || ''
                };
            }
            
            // Показать уведомление, если дата свадьбы не указана
            if (!weddingDetails.value.date) {
                dateNotificationVisible.value = true;
                setTimeout(() => {
                    dateNotificationVisible.value = false;
                }, 10000);
            }
        }
        
        // Загружаем команду и посты
        await Promise.all([loadTeamMembers(), loadPosts()]);
        
    } catch (error) {
        console.error('Ошибка при загрузке профиля:', error);
        errorMessage.value = 'Не удалось загрузить данные профиля';
    } finally {
        isLoading.value = false;
    }
};

// Загружаем данные при монтировании компонента
onMounted(() => {
    if (authStore.isLoggedIn) {
        loadProfile();
    }
});

// Тестовые посты на случай, если API недоступен
if (posts.value.length === 0) {
    posts.value = [
    {
        id: 1,
        author: 'Анна',
        content: 'Наконец-то выбрали и заказали мое свадебное платье! 👰‍♀️ Это было непросто, но результат того стоит. Не могу дождаться, когда его примерю снова перед свадьбой. 💖',
        image: 'https://images.unsplash.com/photo-1537832816519-689ad163238b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=500&q=80',
        date: new Date(new Date().getTime() - 2 * 60 * 60 * 1000), // 2 часа назад
        likes: 12,
        comments: [
            { id: 1, author: 'Мария', text: 'Очень красивое! Ты будешь прекрасной невестой!' },
            { id: 2, author: 'Екатерина', text: 'Поздравляю! Когда примерка?' },
            { id: 3, author: 'Михаил', text: 'Мне не показывай, хочу увидеть тебя в нем только на свадьбе! 😊' }
        ]
    },
    {
        id: 2,
        author: 'Михаил',
        content: 'Забронировали ресторан для свадьбы! 🎉 Теперь точно знаем, где будем праздновать. Осталось определиться с меню на дегустацию. Кто-нибудь знает хорошего ведущего? 🤔',
        image: 'https://images.unsplash.com/photo-1519671482749-fd09be7ccebf?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=500&q=80',
        date: new Date(new Date().getTime() - 24 * 60 * 60 * 1000), // вчера
        likes: 8,
        comments: [
            { id: 4, author: 'Мария (свидетельница)', text: 'Я знаю отличного ведущего! Дала вам его контакты в личку 😊' }
        ]
    },
    {
        id: 3,
        author: 'Анна',
        content: 'Сегодня подписали договор с фотографом! 📸 Очень рады, что нашли такого профессионала. Теперь точно знаем, что наши свадебные моменты будут запечатлены красиво. 💫',
        image: null,
        date: new Date(new Date().getTime() - 3 * 24 * 60 * 60 * 1000), // 3 дня назад
        likes: 15,
        comments: [
            { id: 5, author: 'Иван (фотограф)', text: 'Спасибо за доверие! Сделаю всё возможное, чтобы ваши фотографии были идеальными!' },
            { id: 6, author: 'Михаил', text: 'Отлично! Одной заботой меньше.' }
        ]
    }
    ];}

</script>

<template>
    <!-- Profile Hero Section -->
    <section class="hero-gradient py-12 text-white">
        <div class="container mx-auto px-4">
            <div class="flex flex-col md:flex-row items-center gap-6">
                <!-- Couple Avatar -->
                <div class="relative">
                    <div class="w-32 h-32 md:w-40 md:h-40 rounded-full bg-white flex items-center justify-center overflow-hidden couple-avatar">
                        <div v-if="coupleProfile.avatar" class="w-full h-full">
                            <img :src="coupleProfile.avatar" alt="Фото пары" class="w-full h-full object-cover">
                        </div>
                        <div v-else class="w-full h-full bg-gradient-to-r from-pink-300 to-blue-300 flex items-center justify-center">
                            <span class="text-4xl"></span>
                        </div>
                    </div>
                    <button @click="showPhotoUploadModal = true" class="absolute bottom-0 right-0 bg-pink-600 text-white w-10 h-10 rounded-full flex items-center justify-center shadow-md hover:bg-pink-700 transition">
                        <i class="fas fa-camera text-sm"></i>
                    </button>
                </div>
                
                <!-- Couple Info -->
                <div class="flex-1">
                    <h1 class="text-3xl font-bold mb-2">
                        {{ coupleProfile.brideName }}  {{ coupleProfile.groomName }}
                        <span v-if="coupleProfile.partnerFirstName">
                            и {{ coupleProfile.partnerFirstName }} {{ coupleProfile.partnerLastName }}
                        </span>
                    </h1>
                    <p class="text-lg opacity-80">
                        <span v-if="weddingDetails.date">Свадьба {{ weddingDetails.displayDate }}</span>
                        <span v-else class="text-pink-400">Дата свадьбы не указана</span>
                    </p>
                </div>

                <!-- Stats -->
                <div class="md:ml-auto bg-white bg-opacity-20 rounded-xl p-6">
                    <div class="grid grid-cols-1 gap-4 text-center text-black">
                        <div>
                            <div v-if="daysUntilWedding !== null" class="text-2xl font-bold">{{ daysUntilWedding }}</div>
                            <div v-else class="text-2xl font-bold text-pink-400">—</div>
                            <div class="text-sm">дней до свадьбы</div>
                        </div>
                        <!-- <div>
                            <div class="text-2xl font-bold">42%</div>
                            <div class="text-sm">готовности</div>
                        </div> 
                        <div>
                            <div class="text-2xl font-bold">85</div>
                            <div class="text-sm">гостей</div>
                        </div> -->
                    </div>
                </div>
            </div>
        </div>
    </section>

    <!-- Profile Content -->
    <section class="py-12 bg-white">
        <div class="container mx-auto px-4">
            <!-- Tabs -->
            <div class="border-b border-gray-200 mb-8">
                <nav class="flex space-x-8">
                    <button class="tab-active py-4 px-1 text-sm font-medium border-b-2 border-pink-500 text-pink-600">Профиль</button>
                    <!-- <button class="text-gray-500 hover:text-gray-700 py-4 px-1 text-sm font-medium">Наша история</button>
                    <button class="text-gray-500 hover:text-gray-700 py-4 px-1 text-sm font-medium">Фото</button>
                    <button class="text-gray-500 hover:text-gray-700 py-4 px-1 text-sm font-medium">Гости</button>
                    <button class="text-gray-500 hover:text-gray-700 py-4 px-1 text-sm font-medium">Поставщики</button> -->
                </nav>
            </div>
            
            <!-- Main Content Container -->
            <div>
                <!-- Сообщения об ошибках и успехе -->
                <div v-if="errorMessage" class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4" role="alert">
                    <span class="block sm:inline">{{ errorMessage }}</span>
                    <span class="absolute top-0 bottom-0 right-0 px-4 py-3" @click="errorMessage = ''">
                        <i class="fas fa-times"></i>
                    </span>
                </div>
                
                <div v-if="successMessage" class="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative mb-4" role="alert">
                    <span class="block sm:inline">{{ successMessage }}</span>
                    <span class="absolute top-0 bottom-0 right-0 px-4 py-3" @click="successMessage = ''">
                        <i class="fas fa-times"></i>
                    </span>
                </div>
                
                <!-- Загрузка или основной контент -->
                <div v-if="isLoading" class="flex justify-center items-center py-8">
                    <div class="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-pink-500"></div>
                </div>
                
                <div v-else class="flex flex-col lg:flex-row gap-8">
                    <!-- Left Column -->
                    <div class="lg:w-1/3">
                    <!-- About Us -->
                    <div class="bg-gray-50 rounded-xl p-6 mb-8">
                        <div class="flex justify-between items-center mb-4">
                            <h2 class="text-xl font-bold">О нас</h2>
                            <button @click="openEditProfile" class="text-pink-500 hover:text-pink-700 text-sm font-medium flex items-center">
                                <i class="fas fa-edit mr-1"></i> Редактировать
                            </button>
                        </div>
                        
                        <div class="space-y-4">
                            <div>
                                <h3 class="font-medium text-gray-500 mb-1">История знакомства</h3>
                                <p class="text-sm">{{ coupleProfile.aboutUs }}</p>
                            </div>
                            <!-- Динамически отображаем загруженные события истории пары -->
                            <div v-for="story in storyEvents" :key="story.id" class="mt-4">
                                <h3 class="font-medium text-gray-500 mb-1">{{ story.title }}</h3>
                                <p class="mb-2">{{ story.description }}</p>
                                <p v-if="story.date" class="text-xs text-gray-400">{{ new Date(story.date).toLocaleDateString('ru-RU') }}</p>
                                <img v-if="story.photo" :src="story.photo" class="mt-2 rounded-lg w-full h-auto max-h-48 object-cover" :alt="story.title">
                            </div>
                        </div>
                    </div>
                    
                    <!-- Wedding Details -->
                    <div class="bg-gray-50 rounded-xl p-6 mb-8">
                        <div class="flex justify-between items-center mb-4">
                            <h2 class="text-xl font-bold">Детали свадьбы</h2>
                            <button @click="openEditWeddingDetails" class="text-pink-500 hover:text-pink-700 text-sm font-medium flex items-center">
                                <i class="fas fa-edit mr-1"></i> Редактировать
                            </button>
                        </div>
                        
                        <div class="space-y-4">
                            <div>
                                <h3 class="font-medium text-gray-500 mb-1">Дата</h3>
                                <span v-if="weddingDetails.date">
                                    Свадьба {{ formatWeddingDate(weddingDetails.date) }}
                                </span>
                                <span v-else class="text-pink-400">Дата свадьбы не указана</span>
                            </div>
                            <div>
                                <h3 class="font-medium text-gray-500 mb-1">Место проведения</h3>
                                <p>{{ weddingDetails.venue }}</p>
                                <p class="text-sm text-gray-400">{{ weddingDetails.address }}</p>
                            </div>
                            <div>
                                <h3 class="font-medium text-gray-500 mb-1">Дресс-код</h3>
                                <p>{{ weddingDetails.dressCode }}</p>
                            </div>
                        </div>
                    </div>
                    
                    <!-- Wedding Team -->
                    <div class="bg-gray-50 rounded-xl p-6">
                        <div class="flex justify-between items-center mb-4">
                            <h2 class="text-xl font-bold">Наша команда</h2>
                            <button @click="openAddTeamMember" class="text-pink-500 hover:text-pink-700 text-sm font-medium flex items-center">
                                <i class="fas fa-plus-circle mr-1"></i> Добавить
                            </button>
                        </div>
                        
                        <div class="space-y-3">
                            <div v-for="member in visibleTeamMembers" :key="member.id" class="flex items-center p-2 hover:bg-gray-100 rounded-lg transition group">
                                <div :class="`w-10 h-10 rounded-full bg-${member.color}-100 flex items-center justify-center text-${member.color}-500 mr-3`">
                                    <i :class="`fas fa-${member.icon}`"></i>
                                </div>
                                <div class="flex-1">
                                    <h3 class="font-medium">{{ member.name }}</h3>
                                    <p class="text-sm text-gray-500">{{ member.role }}</p>
                                </div>
                                <div class="opacity-0 group-hover:opacity-100 transition">
                                    <button @click="openEditTeamMember(member)" class="text-gray-400 hover:text-blue-500 mr-2">
                                        <i class="fas fa-edit"></i>
                                    </button>
                                    <button @click="removeTeamMember(member.id)" class="text-gray-400 hover:text-red-500">
                                        <i class="fas fa-trash"></i>
                                    </button>
                                </div>
                            </div>
                            
                            <div v-if="teamMembers.length > 3" class="text-center pt-2">
                                <button @click="toggleTeamMembersVisibility" class="text-pink-500 hover:text-pink-700 text-sm font-medium">
                                    <span v-if="!showAllTeamMembers">Показать всех ({{ teamMembers.length }}) <i class="fas fa-chevron-down ml-1"></i></span>
                                    <span v-else>Скрыть <i class="fas fa-chevron-up ml-1"></i></span>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
                
                <!-- Right Column -->
                <div class="lg:w-2/3">
                    <!-- Status Update -->
                    <div class="bg-gray-50 rounded-xl p-6 mb-8">
                        <div class="flex items-start mb-4">
                            <div class="w-12 h-12 rounded-full bg-pink-100 flex items-center justify-center text-pink-500 mr-3">
                                <i class="fas fa-heart"></i>
                            </div>
                            <div class="flex-1">
                                <textarea v-model="newPost.content" class="w-full border border-gray-200 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-pink-300" rows="3" placeholder="Расскажите, как идут приготовления к свадьбе..."></textarea>
                                
                                <!-- Предпросмотр изображения -->
                                <div v-if="newPost.image" class="mt-3 relative">
                                    <img :src="newPost.image" alt="Предпросмотр" class="max-h-40 rounded-lg">
                                    <button @click="removePostImage" class="absolute top-2 right-2 bg-gray-800 bg-opacity-70 text-white w-6 h-6 rounded-full flex items-center justify-center text-xs">
                                        <i class="fas fa-times"></i>
                                    </button>
                                </div>
                                
                                <div class="flex justify-between items-center mt-3">
                                    <div class="flex space-x-2">
                                        <button @click="toggleEmojiPicker" class="text-gray-400 hover:text-pink-500">
                                            <i class="far fa-smile text-xl"></i>
                                        </button>
                                        <label class="text-gray-400 hover:text-pink-500 cursor-pointer">
                                            <i class="fas fa-camera text-xl"></i>
                                            <input type="file" @change="addPostImage" accept="image/*" class="hidden">
                                        </label>
                                    </div>
                                    <button @click="publishPost" class="bg-pink-500 text-white px-4 py-2 rounded-full hover:bg-pink-600 transition" :disabled="!newPost.content.trim()">
                                        Опубликовать
                                    </button>
                                </div>
                                
                                <!-- Emoji Picker -->
                                <div v-show="emojiPickerVisible" class="mt-3 bg-white border rounded-lg p-3 shadow-lg">
                                    <div class="grid grid-cols-8 gap-1">
                                        <span v-for="emoji in ['😊', '❤️', '🎉', '👰', '🤵', '💍', '💐', '🍾', '💖', '🥂', '🎊', '💒', '🌹', '💕', '✨', '🎭']" 
                                              :key="emoji" 
                                              @click="addEmoji(emoji)" 
                                              class="text-xl cursor-pointer hover:scale-125 transition p-1 rounded hover:bg-gray-100">
                                            {{ emoji }}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    
                    <!-- Updates Feed -->
                    <div class="space-y-6">

                        <div v-for="post in posts" :key="post.id" class="bg-gray-50 rounded-xl p-6">
                            <div class="flex items-start mb-4">
                                <div class="w-12 h-12 rounded-full bg-pink-100 flex items-center justify-center text-pink-500 mr-3">
                                    <i class="fas fa-heart"></i>
                                </div>
                                <div>
                                    <h3 class="font-bold">{{ post.author }}</h3>
                                    <p class="text-sm text-gray-500">{{ formatDate(post.date) }}</p>
                                </div>
                            </div>
                            <p class="mb-4">{{ post.content }}</p>
                            
                            <!-- Post Image -->
                            <div v-if="post.image" class="photo-grid mb-4">
                                <div class="aspect-w-16 aspect-h-9 bg-pink-100 rounded-lg overflow-hidden">
                                    <img :src="post.image" alt="Фото поста" class="w-full h-full object-cover">
                                </div>
                            </div>
                            
                            <div class="flex items-center text-gray-500">
                                <button @click="likePost(post)" class="flex items-center mr-4 hover:text-pink-500 transition">
                                    <i class="far fa-heart mr-1"></i> {{ post.likes }}
                                </button>
                                <button class="flex items-center hover:text-pink-500 transition">
                                    <i class="far fa-comment mr-1"></i> {{ post.comments.length }}
                                </button>
                            </div>
                            
                            <!-- Comments -->
                            <div v-if="post.comments.length > 0" class="mt-4 space-y-3">
                                <div v-for="comment in post.comments" :key="comment.id" class="flex items-start">
                                    <div class="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center text-gray-500 mr-2">
                                        <i class="fas fa-user text-xs"></i>
                                    </div>
                                    <div class="bg-white p-3 rounded-lg flex-1">
                                        <h4 class="font-bold text-sm">{{ comment.author }}</h4>
                                        <p class="text-sm">{{ comment.text }}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                        
                        <!-- Load More -->
                        <div class="text-center">
                            <button class="text-pink-500 hover:text-pink-700 font-medium">
                                <i class="fas fa-sync-alt mr-2"></i> Загрузить еще
                            </button>
                        </div>
                    </div>
                </div>
            
               </div>
            </div>
        </div>
    </section>

    <!-- Modal: Photo Upload -->
    <div v-if="showPhotoUploadModal" class="fixed inset-0 bg-black-opacity-50 z-50 flex items-center justify-center p-4">
        <div class="bg-white rounded-lg max-w-md w-full p-6">
            <div class="flex justify-between items-center mb-4">
                <h3 class="text-xl font-bold">Загрузить фото</h3>
                <button @click="showPhotoUploadModal = false" class="text-gray-500 hover:text-gray-700">
                    <i class="fas fa-times"></i>
                </button>
            </div>
            
            <div class="space-y-4">
                <div v-if="photoPreview" class="relative aspect-square rounded-lg overflow-hidden bg-gray-100">
                    <img :src="photoPreview" alt="Предпросмотр" class="w-full h-full object-cover">
                    <button @click="photoPreview = null" class="absolute top-2 right-2 bg-gray-800 bg-opacity-70 text-white w-8 h-8 rounded-full flex items-center justify-center">
                        <i class="fas fa-times"></i>
                    </button>
                </div>
                
                <div v-else class="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
                    <i class="fas fa-upload text-gray-400 text-3xl mb-2"></i>
                    <p class="text-gray-600 mb-4">Перетащите фото сюда или нажмите для выбора</p>
                    <label class="bg-pink-500 text-white px-4 py-2 rounded-lg hover:bg-pink-600 transition cursor-pointer">
                        Выбрать фото
                        <input type="file" @change="handlePhotoUpload" accept="image/*" class="hidden">
                    </label>
                </div>
                
                <div class="flex justify-end space-x-3">
                    <button @click="showPhotoUploadModal = false" class="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-100 transition">
                        Отмена
                    </button>
                    <button @click="uploadProfilePhoto" class="bg-pink-500 text-white px-4 py-2 rounded-lg hover:bg-pink-600 transition" :disabled="!photoPreview" :class="{'opacity-50 cursor-not-allowed': !photoPreview}">
                        Сохранить
                    </button>
                </div>
            </div>
        </div>
    </div>

    <!-- Modal: Edit Profile -->
    <div v-if="showEditProfileModal" class="fixed inset-0 bg-black-opacity-50  z-50 flex items-center justify-center p-4">
        <div class="bg-white rounded-lg max-w-lg w-full p-6">
            <div class="flex justify-between items-center mb-4">
                <h3 class="text-xl font-bold">Редактировать профиль</h3>
                <button @click="showEditProfileModal = false" class="text-gray-500 hover:text-gray-700">
                    <i class="fas fa-times"></i>
                </button>
            </div>
            
            <div class="space-y-4">
                <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1">Имя невесты</label>
                    <input v-model="editedProfile.brideName" type="text" class="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-pink-300">
                </div>
                <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1">Имя жениха</label>
                    <input v-model="editedProfile.groomName" type="text" class="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-pink-300">
                </div>
                <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1">История знакомства</label>
                    <textarea v-model="editedProfile.aboutUs" rows="4" class="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-pink-300"></textarea>
                </div>
                
                <div class="flex justify-end space-x-3">
                    <button @click="showEditProfileModal = false" class="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-100 transition">
                        Отмена
                    </button>
                    <button @click="saveProfileInfo" class="bg-pink-500 text-white px-4 py-2 rounded-lg hover:bg-pink-600 transition">
                        Сохранить
                    </button>
                </div>
            </div>
        </div>
    </div>

    <!-- Modal: Edit Wedding Details -->
    <div v-if="showEditWeddingDetailsModal" class="fixed inset-0 bg-black-opacity-50  z-50 flex items-center justify-center p-4">
        <div class="bg-white rounded-lg max-w-lg w-full p-6">
            <div class="flex justify-between items-center mb-4">
                <h3 class="text-xl font-bold">Редактировать детали свадьбы</h3>
                <button @click="showEditWeddingDetailsModal = false" class="text-gray-500 hover:text-gray-700">
                    <i class="fas fa-times"></i>
                </button>
            </div>
            
            <div class="space-y-4">
                <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1">Дата свадьбы</label>
                    <input v-model="editedWeddingDetails.date" type="date" class="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-pink-300">
                </div>
                <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1">Время</label>
                    <input v-model="editedWeddingDetails.time" type="time" class="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-pink-300">
                </div>
                <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1">Место проведения</label>
                    <input v-model="editedWeddingDetails.venue" type="text" class="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-pink-300">
                </div>
                <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1">Адрес</label>
                    <input v-model="editedWeddingDetails.address" type="text" class="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-pink-300">
                </div>
                <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1">Дресс-код</label>
                    <input v-model="editedWeddingDetails.dressCode" type="text" class="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-pink-300">
                </div>
                
                <div class="flex justify-end space-x-3">
                    <button @click="showEditWeddingDetailsModal = false" class="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-100 transition">
                        Отмена
                    </button>
                    <button @click="saveWeddingDetails" class="bg-pink-500 text-white px-4 py-2 rounded-lg hover:bg-pink-600 transition">
                        Сохранить
                    </button>
                </div>
            </div>
        </div>
    </div>

    <!-- Modal: Team Member -->
    <div v-if="showTeamMemberModal" class="fixed inset-0 bg-black-opacity-50  z-50 flex items-center justify-center p-4">
        <div class="bg-white rounded-lg max-w-lg w-full p-6">
            <div class="flex justify-between items-center mb-4">
                <h3 class="text-xl font-bold">{{ editingTeamMember ? 'Редактировать' : 'Добавить' }} члена команды</h3>
                <button @click="showTeamMemberModal = false" class="text-gray-500 hover:text-gray-700">
                    <i class="fas fa-times"></i>
                </button>
            </div>
            
            <div class="space-y-4">
                <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1">Имя</label>
                    <input v-model="editedTeamMember.name" type="text" class="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-pink-300">
                </div>
                <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1">Роль</label>
                    <input v-model="editedTeamMember.role" type="text" class="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-pink-300">
                </div>
                <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1">Иконка</label>
                    <select v-model="editedTeamMember.icon" class="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-pink-300">
                        <option value="camera-retro">Фотограф</option>
                        <option value="video">Видеограф</option>
                        <option value="utensils">Ресторан</option>
                        <option value="music">Музыка</option>
                        <option value="ring">Свидетель</option>
                        <option value="magic">Декор</option>
                        <option value="car">Транспорт</option>
                        <option value="flower">Флористика</option>
                    </select>
                </div>
                <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1">Цвет</label>
                    <select v-model="editedTeamMember.color" class="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-pink-300">
                        <option value="blue">Синий</option>
                        <option value="green">Зеленый</option>
                        <option value="purple">Фиолетовый</option>
                        <option value="pink">Розовый</option>
                        <option value="yellow">Желтый</option>
                        <option value="indigo">Индиго</option>
                        <option value="red">Красный</option>
                    </select>
                </div>
                
                <div class="flex justify-end space-x-3">
                    <button @click="showTeamMemberModal = false" class="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-100 transition">
                        Отмена
                    </button>
                    <button @click="saveTeamMember" class="bg-pink-500 text-white px-4 py-2 rounded-lg hover:bg-pink-600 transition">
                        Сохранить
                    </button>
                </div>
            </div>
        </div>
    </div>
</template>

<!-- Всплывающее уведомление о дате свадьбы -->
<!-- <Teleport to="body">
    <div v-if="dateNotificationVisible" 
         class="fixed bottom-8 right-8 max-w-md bg-white rounded-lg shadow-lg border-l-4 border-pink-500 p-4 z-50 animate-fade-in-up">
        <div class="flex items-start">
            <div class="flex-shrink-0 text-pink-500">
                <i class="fas fa-info-circle text-xl"></i>
            </div>
            <div class="ml-3 flex-1">
                <h3 class="text-sm font-medium text-gray-800">Дата свадьбы не указана</h3>
                <div class="mt-2 text-sm text-gray-700">
                    <p>Укажите дату свадьбы в разделе «Детали свадьбы», чтобы видеть таймер обратного отсчёта и другие полезные функции.</p>
                </div>
                <div class="mt-3 flex gap-2">
                    <button @click="openEditWeddingDetails" 
                            class="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-md shadow-sm text-white bg-pink-600 hover:bg-pink-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-pink-500">
                        Указать дату
                    </button>
                    <button @click="dateNotificationVisible = false" 
                            class="inline-flex items-center px-3 py-1.5 border border-gray-300 text-xs font-medium rounded-md shadow-sm text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-pink-500">
                        Закрыть
                    </button>
                </div>
            </div>
            <div class="ml-4 flex-shrink-0 flex">
                <button @click="dateNotificationVisible = false" class="inline-flex text-gray-400 hover:text-gray-500">
                    <span class="sr-only">Закрыть</span>
                    <i class="fas fa-times"></i>
                </button>
            </div>
        </div>
    </div>
</Teleport> -->

<style scoped>
.bg-black-opacity-50{
    background-color:rgba(0, 0, 0, 0.60);
}

.hero-gradient {
    background: linear-gradient(to right, #ec4899, #8b5cf6);
}

.story-item::before {
    content: '';
    position: absolute;
    left: 0.375rem;
    top: 0;
    width: 2px;
    height: 100%;
    background-color: #ec4899;
}

.emoji-picker {
    display: block;
}
</style>
