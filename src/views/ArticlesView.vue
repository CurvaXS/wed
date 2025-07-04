<template>
 <!-- Hero Section -->
 <section class="hero-gradient py-16 text-white">
        <div class="container mx-auto px-4">
            <div class="max-w-3xl mx-auto text-center">
                <h1 class="text-4xl md:text-5xl font-bold mb-6">Полезные статьи о свадьбах</h1>
                <p class="text-xl mb-8">Советы, идеи и рекомендации от экспертов свадебной индустрии</p>
                <div class="relative max-w-md mx-auto">
                    <input type="text" placeholder="Поиск статей..." class="w-full px-6 py-3 rounded-full text-gray-800 focus:outline-none focus:ring-2 focus:ring-pink-500 bg-white">
                    <button class="absolute right-2 top-1/2 transform -translate-y-1/2 bg-pink-500 text-white p-2 rounded-full hover:bg-pink-600 transition">
                        <i class="fas fa-search"></i>
                    </button>
                </div>
            </div>
        </div>
    </section>

    <!-- Categories Section -->
    <section class="py-12 bg-white">
        <div class="container mx-auto px-4">
            <div class="flex flex-wrap justify-center gap-4 mb-12">
                <button class="bg-pink-500 text-white px-6 py-2 rounded-full font-medium hover:bg-pink-600 transition">Все статьи</button>
                <button class="bg-gray-100 text-gray-800 px-6 py-2 rounded-full font-medium hover:bg-gray-200 transition">Планирование</button>
                <button class="bg-gray-100 text-gray-800 px-6 py-2 rounded-full font-medium hover:bg-gray-200 transition">Стиль и декор</button>
                <button class="bg-gray-100 text-gray-800 px-6 py-2 rounded-full font-medium hover:bg-gray-200 transition">Бюджет</button>
                <button class="bg-gray-100 text-gray-800 px-6 py-2 rounded-full font-medium hover:bg-gray-200 transition">Традиции</button>
                <button class="bg-gray-100 text-gray-800 px-6 py-2 rounded-full font-medium hover:bg-gray-200 transition">Советы</button>
            </div>
        </div>
    </section>

    <!-- Featured Articles -->
    <section class="py-12 bg-gray-50">
        <div class="container mx-auto px-4">
            <div class="mb-12">
                <h2 class="text-3xl font-bold mb-4">Популярные статьи</h2>
                <p class="text-gray-600">Самые читаемые материалы этой недели</p>
            </div>
            
            <div class="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                <!-- Article 1 -->
                <a href="#" class="article-card bg-white rounded-lg overflow-hidden shadow-sm">
                    <div class="relative article-image">
                        <span class="popular-badge">Популярно</span>
                        <img src="https://images.unsplash.com/photo-1515934751635-c81c6bc9a2d8?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80" alt="Планирование свадьбы" class="w-full h-full object-cover">
                    </div>
                    <div class="p-6">
                        <span class="article-tag planning mb-3">Планирование</span>
                        <h3 class="article-title text-xl font-bold mb-3 transition">Полное руководство по планированию свадьбы за 12 месяцев</h3>
                        <p class="text-gray-600 mb-4">Пошаговый план организации свадьбы с нуля до торжественного дня с чек-листами и советами.</p>
                        <div class="flex items-center text-sm text-gray-500">
                            <i class="far fa-calendar mr-2"></i>
                            <span class="mr-4">15 мая 2023</span>
                            <i class="far fa-eye mr-2"></i>
                            <span>12.5K</span>
                        </div>
                    </div>
                </a>
                
                <!-- Article 2 -->
                <a href="#" class="article-card bg-white rounded-lg overflow-hidden shadow-sm">
                    <div class="relative article-image">
                        <img src="https://images.unsplash.com/photo-1523438885200-e635ba2c371e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1374&q=80" alt="Свадебный стиль" class="w-full h-full object-cover">
                    </div>
                    <div class="p-6">
                        <span class="article-tag style mb-3">Стиль и декор</span>
                        <h3 class="article-title text-xl font-bold mb-3 transition">Топ-10 свадебных стилей 2023 года: от классики до бохо</h3>
                        <p class="text-gray-600 mb-4">Актуальные тенденции в оформлении свадеб: какие стили выбирают современные пары и как их реализовать.</p>
                        <div class="flex items-center text-sm text-gray-500">
                            <i class="far fa-calendar mr-2"></i>
                            <span class="mr-4">8 мая 2023</span>
                            <i class="far fa-eye mr-2"></i>
                            <span>9.3K</span>
                        </div>
                    </div>
                </a>
                
                <!-- Article 3 -->
                <a href="#" class="article-card bg-white rounded-lg overflow-hidden shadow-sm">
                    <div class="relative article-image">
                        <img src="https://images.unsplash.com/photo-1527631746610-bca00a040d60?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80" alt="Свадебный бюджет" class="w-full h-full object-cover">
                    </div>
                    <div class="p-6">
                        <span class="article-tag budget mb-3">Бюджет</span>
                        <h3 class="article-title text-xl font-bold mb-3 transition">Как сэкономить на свадьбе без потери качества: 15 проверенных способов</h3>
                        <p class="text-gray-600 mb-4">Практические советы по оптимизации свадебного бюджета от опытных организаторов.</p>
                        <div class="flex items-center text-sm text-gray-500">
                            <i class="far fa-calendar mr-2"></i>
                            <span class="mr-4">1 мая 2023</span>
                            <i class="far fa-eye mr-2"></i>
                            <span>8.1K</span>
                        </div>
                    </div>
                </a>
            </div>
        </div>
    </section>

    <!-- All Articles -->
    <section class="py-12 bg-white">
        <div class="container mx-auto px-4">
            <div class="mb-12">
                <h2 class="text-3xl font-bold mb-4">Все статьи</h2>
                <p class="text-gray-600">Больше полезных материалов для подготовки к свадьбе</p>
            </div>
            
            <div class="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
                <!-- Article 4 -->
                <a href="#" class="article-card bg-white rounded-lg overflow-hidden shadow-sm">
                    <div class="relative article-image">
                        <img src="https://images.unsplash.com/photo-1519671482749-fd09be7ccebf?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80" alt="Свадебные традиции" class="w-full h-full object-cover">
                    </div>
                    <div class="p-6">
                        <span class="article-tag traditions mb-3">Традиции</span>
                        <h3 class="article-title text-xl font-bold mb-3 transition">Свадебные традиции разных стран: что перенять для своей свадьбы</h3>
                        <p class="text-gray-600 mb-4">Интересные свадебные обычаи со всего мира, которые сделают ваше торжество уникальным.</p>
                        <div class="flex items-center text-sm text-gray-500">
                            <i class="far fa-calendar mr-2"></i>
                            <span class="mr-4">24 апреля 2023</span>
                            <i class="far fa-eye mr-2"></i>
                            <span>7.5K</span>
                        </div>
                    </div>
                </a>
                
                <!-- Article 5 -->
                <a href="#" class="article-card bg-white rounded-lg overflow-hidden shadow-sm">
                    <div class="relative article-image">
                        <img src="https://images.unsplash.com/photo-1511795409834-ef04bbd61622?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1469&q=80" alt="Свадебный букет" class="w-full h-full object-cover">
                    </div>
                    <div class="p-6">
                        <span class="article-tag style mb-3">Стиль и декор</span>
                        <h3 class="article-title text-xl font-bold mb-3 transition">Как выбрать идеальный свадебный букет: сезонность, стиль и символика цветов</h3>
                        <p class="text-gray-600 mb-4">Полное руководство по выбору свадебного букета с учетом всех важных факторов.</p>
                        <div class="flex items-center text-sm text-gray-500">
                            <i class="far fa-calendar mr-2"></i>
                            <span class="mr-4">17 апреля 2023</span>
                            <i class="far fa-eye mr-2"></i>
                            <span>6.8K</span>
                        </div>
                    </div>
                </a>
                
                <!-- Article 6 -->
                <a href="#" class="article-card bg-white rounded-lg overflow-hidden shadow-sm">
                    <div class="relative article-image">
                        <img src="https://images.unsplash.com/photo-1519225421980-715cb0215aed?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80" alt="Свадебное меню" class="w-full h-full object-cover">
                    </div>
                    <div class="p-6">
                        <span class="article-tag tips mb-3">Советы</span>
                        <h3 class="article-title text-xl font-bold mb-3 transition">Свадебное меню: как угодить всем гостям и не разориться</h3>
                        <p class="text-gray-600 mb-4">Практические советы по составлению свадебного меню с учетом разных вкусов и бюджетов.</p>
                        <div class="flex items-center text-sm text-gray-500">
                            <i class="far fa-calendar mr-2"></i>
                            <span class="mr-4">10 апреля 2023</span>
                            <i class="far fa-eye mr-2"></i>
                            <span>6.2K</span>
                        </div>
                    </div>
                </a>
                
                <!-- Article 7 -->
                <a href="#" class="article-card bg-white rounded-lg overflow-hidden shadow-sm">
                    <div class="relative article-image">
                        <img src="https://images.unsplash.com/photo-1515934751635-c81c6bc9a2d8?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80" alt="Свадебный маршрут" class="w-full h-full object-cover">
                    </div>
                    <div class="p-6">
                        <span class="article-tag planning mb-3">Планирование</span>
                        <h3 class="article-title text-xl font-bold mb-3 transition">Идеальный свадебный маршрут: как спланировать день без суеты</h3>
                        <p class="text-gray-600 mb-4">Пошаговое руководство по созданию оптимального графика свадебного дня с временными буферами.</p>
                        <div class="flex items-center text-sm text-gray-500">
                            <i class="far fa-calendar mr-2"></i>
                            <span class="mr-4">3 апреля 2023</span>
                            <i class="far fa-eye mr-2"></i>
                            <span>5.9K</span>
                        </div>
                    </div>
                </a>
                
                <!-- Article 8 -->
                <a href="#" class="article-card bg-white rounded-lg overflow-hidden shadow-sm">
                    <div class="relative article-image">
                        <img src="https://images.unsplash.com/photo-1523438885200-e635ba2c371e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1374&q=80" alt="Свадебный фотограф" class="w-full h-full object-cover">
                    </div>
                    <div class="p-6">
                        <span class="article-tag tips mb-3">Советы</span>
                        <h3 class="article-title text-xl font-bold mb-3 transition">Как выбрать свадебного фотографа: 10 ключевых критериев</h3>
                        <p class="text-gray-600 mb-4">На что обратить внимание при выборе фотографа, чтобы остаться довольными результатом.</p>
                        <div class="flex items-center text-sm text-gray-500">
                            <i class="far fa-calendar mr-2"></i>
                            <span class="mr-4">27 марта 2023</span>
                            <i class="far fa-eye mr-2"></i>
                            <span>5.6K</span>
                        </div>
                    </div>
                </a>
                
                <!-- Article 9 -->
                <a href="#" class="article-card bg-white rounded-lg overflow-hidden shadow-sm">
                    <div class="relative article-image">
                        <img src="https://images.unsplash.com/photo-1527631746610-bca00a040d60?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80" alt="Свадебный торт" class="w-full h-full object-cover">
                    </div>
                    <div class="p-6">
                        <span class="article-tag style mb-3">Стиль и декор</span>
                        <h3 class="article-title text-xl font-bold mb-3 transition">Свадебный торт: от выбора стиля до дегустации - полное руководство</h3>
                        <p class="text-gray-600 mb-4">Все, что нужно знать о свадебных тортах: от модных тенденций до практических советов.</p>
                        <div class="flex items-center text-sm text-gray-500">
                            <i class="far fa-calendar mr-2"></i>
                            <span class="mr-4">20 марта 2023</span>
                            <i class="far fa-eye mr-2"></i>
                            <span>5.3K</span>
                        </div>
                    </div>
                </a>
            </div>
            
            <div class="text-center">
                <button class="btn-primary text-white px-8 py-3 rounded-full inline-flex items-center">
                    Показать еще <i class="fas fa-chevron-down ml-2"></i>
                </button>
            </div>
        </div>
    </section>

    <!-- Experts Section -->
    <section class="py-16 bg-gray-50">
        <div class="container mx-auto px-4">
            <div class="mb-12 text-center">
                <h2 class="text-3xl font-bold mb-4">Эксперты пишут</h2>
                <p class="text-gray-600 max-w-2xl mx-auto">Профессиональные советы от ведущих специалистов свадебной индустрии</p>
            </div>
            
            <div class="grid md:grid-cols-3 gap-8">
                <!-- Expert 1 -->
                <div class="bg-white rounded-lg overflow-hidden shadow-sm p-6 flex flex-col items-center text-center">
                    <div class="w-24 h-24 rounded-full overflow-hidden mb-4">
                        <img src="https://randomuser.me/api/portraits/women/32.jpg" alt="Анна Смирнова" class="w-full h-full object-cover">
                    </div>
                    <h3 class="text-xl font-bold mb-2">Анна Смирнова</h3>
                    <p class="text-gray-500 mb-4">Свадебный организатор с 10-летним опытом</p>
                    <p class="text-gray-600 mb-4">"В своих статьях я делюсь практическими советами, которые помогли сотням пар организовать свадьбу мечты без лишнего стресса."</p>
                    <a href="#" class="text-pink-500 font-medium text-sm flex items-center">
                        Все статьи автора <i class="fas fa-chevron-right ml-1 text-xs"></i>
                    </a>
                </div>
                
                <!-- Expert 2 -->
                <div class="bg-white rounded-lg overflow-hidden shadow-sm p-6 flex flex-col items-center text-center">
                    <div class="w-24 h-24 rounded-full overflow-hidden mb-4">
                        <img src="https://randomuser.me/api/portraits/men/45.jpg" alt="Дмитрий Иванов" class="w-full h-full object-cover">
                    </div>
                    <h3 class="text-xl font-bold mb-2">Дмитрий Иванов</h3>
                    <p class="text-gray-500 mb-4">Флорист и декоратор</p>
                    <p class="text-gray-600 mb-4">"Создаю уникальные свадебные декорации уже 8 лет. В статьях рассказываю, как сделать оформление стильным и запоминающимся."</p>
                    <a href="#" class="text-pink-500 font-medium text-sm flex items-center">
                        Все статьи автора <i class="fas fa-chevron-right ml-1 text-xs"></i>
                    </a>
                </div>
                
                <!-- Expert 3 -->
                <div class="bg-white rounded-lg overflow-hidden shadow-sm p-6 flex flex-col items-center text-center">
                    <div class="w-24 h-24 rounded-full overflow-hidden mb-4">
                        <img src="https://randomuser.me/api/portraits/women/68.jpg" alt="Елена Петрова" class="w-full h-full object-cover">
                    </div>
                    <h3 class="text-xl font-bold mb-2">Елена Петрова</h3>
                    <p class="text-gray-500 mb-4">Фотограф, специалист по свадебной фотографии</p>
                    <p class="text-gray-600 mb-4">"Снимаю свадьбы 12 лет. В статьях делюсь секретами, как получить идеальные кадры и сохранить воспоминания на всю жизнь."</p>
                    <a href="#" class="text-pink-500 font-medium text-sm flex items-center">
                        Все статьи автора <i class="fas fa-chevron-right ml-1 text-xs"></i>
                    </a>
                </div>
            </div>
        </div>
    </section>

    <!-- Subscribe Section -->
    <section class="py-16 bg-white">
        <div class="container mx-auto px-4">
            <div class="max-w-3xl mx-auto bg-pink-50 rounded-xl p-8 md:p-12 text-center">
                <h2 class="text-3xl font-bold mb-4">Подпишитесь на рассылку</h2>
                <p class="text-gray-600 mb-8">Получайте свежие статьи и советы по планированию свадьбы прямо на почту</p>
                <form class="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
                    <input type="email" placeholder="Ваш email" class="flex-grow px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent">
                    <button type="submit" class="btn-primary text-white px-6 py-3 rounded-lg whitespace-nowrap">Подписаться</button>
                </form>
                <p class="text-xs text-gray-500 mt-4">Подписываясь, вы соглашаетесь с нашей <a href="#" class="text-pink-500">Политикой конфиденциальности</a></p>
            </div>
        </div>
    </section>
</template>

<script setup>

</script>

<style scoped>
.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.line-clamp-3 {
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

h1, h2, h3, h4 {
            font-family: 'Montserrat', sans-serif;
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
        .article-tag {
            display: inline-flex;
            align-items: center;
            padding: 0.25rem 0.75rem;
            border-radius: 9999px;
            font-size: 0.75rem;
            font-weight: 500;
        }
        .article-tag.planning {
            background-color: #DBEAFE;
            color: #1E40AF;
        }
        .article-tag.style {
            background-color: #D1FAE5;
            color: #065F46;
        }
        .article-tag.budget {
            background-color: #FCE7F3;
            color: #9D174D;
        }
        .article-tag.traditions {
            background-color: #EDE9FE;
            color: #5B21B6;
        }
        .article-tag.tips {
            background-color: #E0F2FE;
            color: #0369A1;
        }
        .article-card {
            transition: all 0.3s ease;
        }
        .article-card:hover {
            transform: translateY(-5px);
            box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
        }
        .article-card:hover .article-title {
            color: #FF6B8B;
        }
        .article-image {
            height: 200px;
            overflow: hidden;
        }
        .article-image img {
            transition: transform 0.5s ease;
        }
        .article-card:hover .article-image img {
            transform: scale(1.05);
        }
        .popular-badge {
            position: absolute;
            top: 1rem;
            right: 1rem;
            background-color: #FF6B8B;
            color: white;
            font-size: 0.75rem;
            font-weight: 600;
            padding: 0.25rem 0.75rem;
            border-radius: 9999px;
            z-index: 10;
        }
</style>
