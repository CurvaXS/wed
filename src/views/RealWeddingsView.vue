<template>
   <!-- Hero Section -->
   <section class="hero-gradient py-16 text-white">
        <div class="container mx-auto px-4">
            <div class="max-w-3xl mx-auto text-center">
                <h1 class="text-4xl md:text-5xl font-bold mb-6">Реальные свадьбы</h1>
                <p class="text-xl mb-8">Вдохновляйтесь самыми красивыми свадьбами и находите идеи для своей особенной церемонии</p>
                <div class="flex flex-wrap justify-center gap-3">
                    <!-- <button class="bg-white text-pink-600 px-6 py-2 rounded-full font-medium hover:bg-opacity-90 transition">Классические</button> -->
                    <button class="bg-white px-6 py-2 rounded-full font-medium hover:bg-opacity-90 transition text-black">Классические</button>
                    <button class="bg-white bg-opacity-20 px-6 py-2 rounded-full font-medium hover:bg-opacity-30 transition text-black">Современные</button>
                    <button class="bg-white bg-opacity-20 px-6 py-2 rounded-full font-medium hover:bg-opacity-30 transition text-black">Бохо</button>
                    <button class="bg-white bg-opacity-20 px-6 py-2 rounded-full font-medium hover:bg-opacity-30 transition text-black">Рустик</button>
                    <button class="bg-white bg-opacity-20 px-6 py-2 rounded-full font-medium hover:bg-opacity-30 transition text-black">Винтажные</button>
                </div>
            </div>
        </div>
    </section>

    <!-- Featured Weddings -->
    <section class="py-16 bg-white">
        <div class="container mx-auto px-4">
            <div class="mb-12 text-center">
                <h2 class="text-3xl font-bold mb-4">Свадьбы недели</h2>
                <p class="text-gray-600 max-w-2xl mx-auto">Самые красивые и вдохновляющие свадьбы, которые мы выбрали специально для вас</p>
            </div>
            
            <div class="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                <!-- Wedding 1 -->
                <div class="bg-white rounded-xl overflow-hidden shadow-sm card-hover transition">
                    <div class="relative overflow-hidden h-64">
                        <img src="https://images.unsplash.com/photo-1519225421980-715cb0215aed?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80" alt="Классическая свадьба" class="w-full h-full object-cover transition duration-500 hover:scale-105">
                        <div class="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                        <div class="absolute bottom-0 left-0 p-6">
                            <span class="wedding-tag classic mb-2">Классика</span>
                            <h3 class="text-xl font-bold text-white">Анна и Дмитрий</h3>
                            <p class="text-white text-opacity-90">Москва • 15 июля 2023</p>
                        </div>
                    </div>
                    <div class="p-6">
                        <p class="text-gray-600 mb-4">Элегантная классическая свадьба в историческом особняке с белыми розами и хрустальными люстрами.</p>
                        <div class="flex justify-between items-center pt-4 border-t border-gray-100">
                            <div class="flex items-center">
                                <div class="w-8 h-8 rounded-full overflow-hidden mr-2">
                                    <img src="https://randomuser.me/api/portraits/women/32.jpg" alt="Анна" class="w-full h-full object-cover">
                                </div>
                                <span class="text-sm">Анна К.</span>
                            </div>
                            <a href="#" class="text-pink-500 hover:text-pink-600 font-medium text-sm flex items-center">
                                Смотреть фото <i class="fas fa-chevron-right ml-1 text-xs"></i>
                            </a>
                        </div>
                    </div>
                </div>
                
                <!-- Wedding 2 -->
                <div class="bg-white rounded-xl overflow-hidden shadow-sm card-hover transition">
                    <div class="relative overflow-hidden h-64">
                        <img src="https://images.unsplash.com/photo-1523438885200-e635ba2c371e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1374&q=80" alt="Бохо свадьба" class="w-full h-full object-cover transition duration-500 hover:scale-105">
                        <div class="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                        <div class="absolute bottom-0 left-0 p-6">
                            <span class="wedding-tag bohemian mb-2">Бохо</span>
                            <h3 class="text-xl font-bold text-white">Елена и Алексей</h3>
                            <p class="text-white text-opacity-90">Сочи • 22 июня 2023</p>
                        </div>
                    </div>
                    <div class="p-6">
                        <p class="text-gray-600 mb-4">Романтическая бохо свадьба на берегу моря с плетёной мебелью, сухоцветами и гирляндами из ткани.</p>
                        <div class="flex justify-between items-center pt-4 border-t border-gray-100">
                            <div class="flex items-center">
                                <div class="w-8 h-8 rounded-full overflow-hidden mr-2">
                                    <img src="https://randomuser.me/api/portraits/women/68.jpg" alt="Елена" class="w-full h-full object-cover">
                                </div>
                                <span class="text-sm">Елена В.</span>
                            </div>
                            <a href="#" class="text-pink-500 hover:text-pink-600 font-medium text-sm flex items-center">
                                Смотреть фото <i class="fas fa-chevron-right ml-1 text-xs"></i>
                            </a>
                        </div>
                    </div>
                </div>
                
                <!-- Wedding 3 -->
                <div class="bg-white rounded-xl overflow-hidden shadow-sm card-hover transition">
                    <div class="relative overflow-hidden h-64">
                        <img src="https://images.unsplash.com/photo-1527631746610-bca00a040d60?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80" alt="Рустик свадьба" class="w-full h-full object-cover transition duration-500 hover:scale-105">
                        <div class="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                        <div class="absolute bottom-0 left-0 p-6">
                            <span class="wedding-tag rustic mb-2">Рустик</span>
                            <h3 class="text-xl font-bold text-white">Ольга и Иван</h3>
                            <p class="text-white text-opacity-90">Подмосковье • 30 июля 2023</p>
                        </div>
                    </div>
                    <div class="p-6">
                        <p class="text-gray-600 mb-4">Уютная рустик свадьба в загородном доме с деревянными столами, полевыми цветами и домашней кухней.</p>
                        <div class="flex justify-between items-center pt-4 border-t border-gray-100">
                            <div class="flex items-center">
                                <div class="w-8 h-8 rounded-full overflow-hidden mr-2">
                                    <img src="https://randomuser.me/api/portraits/women/54.jpg" alt="Ольга" class="w-full h-full object-cover">
                                </div>
                                <span class="text-sm">Ольга С.</span>
                            </div>
                            <a href="#" class="text-pink-500 hover:text-pink-600 font-medium text-sm flex items-center">
                                Смотреть фото <i class="fas fa-chevron-right ml-1 text-xs"></i>
                            </a>
                        </div>
                    </div>
                </div>
            </div>
            
            <div class="text-center mt-12">
                <a href="#" class="btn-primary text-white px-8 py-3 rounded-full inline-flex items-center">
                    Смотреть все свадьбы <i class="fas fa-chevron-right ml-2"></i>
                </a>
            </div>
        </div>
    </section>

    <!-- Wedding Styles -->
    <section class="py-16 bg-gray-50">
        <div class="container mx-auto px-4">
            <div class="mb-12 text-center">
                <h2 class="text-3xl font-bold mb-4">Популярные стили свадеб</h2>
                <p class="text-gray-600 max-w-2xl mx-auto">Выберите стиль, который вам ближе, и найдите вдохновение для своей свадьбы</p>
            </div>
            
            <div class="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                <!-- Style 1 -->
                <a href="#" class="group relative overflow-hidden rounded-xl h-64">
                    <img src="https://images.unsplash.com/photo-1515934751635-c81c6bc9a2d8?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80" alt="Классическая свадьба" class="w-full h-full object-cover transition duration-500 group-hover:scale-105">
                    <div class="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                    <div class="absolute bottom-0 left-0 p-6">
                        <h3 class="text-xl font-bold text-white">Классические</h3>
                        <p class="text-white text-opacity-90">32 свадьбы</p>
                    </div>
                </a>
                
                <!-- Style 2 -->
                <a href="#" class="group relative overflow-hidden rounded-xl h-64">
                    <img src="https://images.unsplash.com/photo-1519225421980-715cb0215aed?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80" alt="Современные свадьбы" class="w-full h-full object-cover transition duration-500 group-hover:scale-105">
                    <div class="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                    <div class="absolute bottom-0 left-0 p-6">
                        <h3 class="text-xl font-bold text-white">Современные</h3>
                        <p class="text-white text-opacity-90">28 свадеб</p>
                    </div>
                </a>
                
                <!-- Style 3 -->
                <a href="#" class="group relative overflow-hidden rounded-xl h-64">
                    <img src="https://images.unsplash.com/photo-1523438885200-e635ba2c371e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1374&q=80" alt="Бохо свадьбы" class="w-full h-full object-cover transition duration-500 group-hover:scale-105">
                    <div class="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                    <div class="absolute bottom-0 left-0 p-6">
                        <h3 class="text-xl font-bold text-white">Бохо</h3>
                        <p class="text-white text-opacity-90">45 свадеб</p>
                    </div>
                </a>
                
                <!-- Style 4 -->
                <a href="#" class="group relative overflow-hidden rounded-xl h-64">
                    <img src="https://images.unsplash.com/photo-1527631746610-bca00a040d60?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80" alt="Рустик свадьбы" class="w-full h-full object-cover transition duration-500 group-hover:scale-105">
                    <div class="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                    <div class="absolute bottom-0 left-0 p-6">
                        <h3 class="text-xl font-bold text-white">Рустик</h3>
                        <p class="text-white text-opacity-90">19 свадеб</p>
                    </div>
                </a>
            </div>
        </div>
    </section>

    <!-- Photo Gallery -->
    <section class="py-16 bg-white">
        <div class="container mx-auto px-4">
            <div class="mb-12 text-center">
                <h2 class="text-3xl font-bold mb-4">Фотогалерея</h2>
                <p class="text-gray-600 max-w-2xl mx-auto">Лучшие моменты реальных свадеб, которые помогут вам в планировании</p>
            </div>
            
            <div class="gallery-grid mb-8">
                <!-- Main image -->
                <div class="gallery-item gallery-item-main">
                    <img src="https://images.unsplash.com/photo-1519225421980-715cb0215aed?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80" alt="Свадебное фото" class="gallery-img" data-index="0">
                </div>
                
                <!-- Other images -->
                <div class="gallery-item">
                    <img src="https://images.unsplash.com/photo-1527631746610-bca00a040d60?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80" alt="Свадебное фото" class="gallery-img" data-index="1">
                </div>
                
                <div class="gallery-item">
                    <img src="https://images.unsplash.com/photo-1523438885200-e635ba2c371e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1374&q=80" alt="Свадебное фото" class="gallery-img" data-index="2">
                </div>
                
                <div class="gallery-item">
                    <img src="https://images.unsplash.com/photo-1515934751635-c81c6bc9a2d8?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80" alt="Свадебное фото" class="gallery-img" data-index="3">
                </div>
                
                <div class="gallery-item">
                    <img src="https://images.unsplash.com/photo-1511795409834-ef04bbd61622?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1469&q=80" alt="Свадебное фото" class="gallery-img" data-index="4">
                </div>
                
                <div class="gallery-item">
                    <img src="https://images.unsplash.com/photo-1519671482749-fd09be7ccebf?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80" alt="Свадебное фото" class="gallery-img" data-index="5">
                </div>
            </div>
            
            <div class="text-center">
                <a href="#" class="btn-primary text-white px-8 py-3 rounded-full inline-flex items-center">
                    Смотреть все фото <i class="fas fa-chevron-right ml-2"></i>
                </a>
            </div>
        </div>
    </section>

    <!-- Testimonials -->
    <section class="py-16 bg-gray-50">
        <div class="container mx-auto px-4">
            <div class="mb-12 text-center">
                <h2 class="text-3xl font-bold mb-4">Отзывы пар</h2>
                <p class="text-gray-600 max-w-2xl mx-auto">Истории реальных пар, которые уже прошли через организацию свадьбы</p>
            </div>
            
            <div class="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                <!-- Testimonial 1 -->
                <div class="testimonial-card p-6">
                    <div class="flex items-center mb-4">
                        <div class="w-12 h-12 rounded-full overflow-hidden mr-4">
                            <img src="https://randomuser.me/api/portraits/women/32.jpg" alt="Анна" class="w-full h-full object-cover">
                        </div>
                        <div>
                            <h4 class="font-bold">Анна и Дмитрий</h4>
                            <p class="text-sm text-gray-500">15 июля 2023</p>
                        </div>
                    </div>
                    <p class="text-gray-600 mb-4">"СвадьбаГид помог нам найти всех лучших подрядчиков для нашей свадьбы. Особенно понравился фотограф, которого мы нашли через сервис - его работы превзошли все наши ожидания!"</p>
                    <div class="flex items-center">
                        <div class="flex text-yellow-400 mr-2">
                            <i class="fas fa-star"></i>
                            <i class="fas fa-star"></i>
                            <i class="fas fa-star"></i>
                            <i class="fas fa-star"></i>
                            <i class="fas fa-star"></i>
                        </div>
                        <span class="text-sm font-medium">5.0</span>
                    </div>
                </div>
                
                <!-- Testimonial 2 -->
                <div class="testimonial-card p-6">
                    <div class="flex items-center mb-4">
                        <div class="w-12 h-12 rounded-full overflow-hidden mr-4">
                            <img src="https://randomuser.me/api/portraits/women/68.jpg" alt="Елена" class="w-full h-full object-cover">
                        </div>
                        <div>
                            <h4 class="font-bold">Елена и Алексей</h4>
                            <p class="text-sm text-gray-500">22 июня 2023</p>
                        </div>
                    </div>
                    <p class="text-gray-600 mb-4">"Мы хотели необычную свадьбу в стиле бохо, и благодаря каталогу нашли потрясающего декоратора, который воплотил все наши мечты. Все гости были в восторге от оформления!"</p>
                    <div class="flex items-center">
                        <div class="flex text-yellow-400 mr-2">
                            <i class="fas fa-star"></i>
                            <i class="fas fa-star"></i>
                            <i class="fas fa-star"></i>
                            <i class="fas fa-star"></i>
                            <i class="fas fa-star"></i>
                        </div>
                        <span class="text-sm font-medium">5.0</span>
                    </div>
                </div>
                
                <!-- Testimonial 3 -->
                <div class="testimonial-card p-6">
                    <div class="flex items-center mb-4">
                        <div class="w-12 h-12 rounded-full overflow-hidden mr-4">
                            <img src="https://randomuser.me/api/portraits/men/45.jpg" alt="Дмитрий" class="w-full h-full object-cover">
                        </div>
                        <div>
                            <h4 class="font-bold">Дмитрий и Ольга</h4>
                            <p class="text-sm text-gray-500">30 июля 2023</p>
                        </div>
                    </div>
                    <p class="text-gray-600 mb-4">"Сервис тендеров просто спас нас! Мы получили 15 предложений от разных площадок в нашем бюджете и смогли выбрать идеальный вариант. Всё прошло идеально, спасибо команде СвадьбаГид!"</p>
                    <div class="flex items-center">
                        <div class="flex text-yellow-400 mr-2">
                            <i class="fas fa-star"></i>
                            <i class="fas fa-star"></i>
                            <i class="fas fa-star"></i>
                            <i class="fas fa-star"></i>
                            <i class="fas fa-star-half-alt"></i>
                        </div>
                        <span class="text-sm font-medium">4.7</span>
                    </div>
                </div>
            </div>
        </div>
    </section>

    <!-- CTA Section -->
    <section class="py-16 bg-pink-50">
        <div class="container mx-auto px-4">
            <div class="max-w-3xl mx-auto text-center">
                <h2 class="text-3xl font-bold mb-6">Готовы к своей идеальной свадьбе?</h2>
                <p class="text-gray-600 mb-8">Начните планирование прямо сейчас и получите доступ к лучшим свадебным специалистам в вашем городе</p>
                <div class="flex flex-col sm:flex-row justify-center gap-4">
                    <a href="#" class="btn-primary text-white px-8 py-3 rounded-full">Найти подрядчиков</a>
                    <a href="#" class="bg-white text-pink-600 px-8 py-3 rounded-full font-medium hover:bg-opacity-90 transition">Опубликовать свадьбу</a>
                </div>
            </div>
        </div>
    </section>

    <!-- Image Modal -->
    <div class="modal-overlay" id="image-modal">
        <div class="modal-content">
            <img id="modal-image" src="" alt="">
            <div class="modal-nav">
                <button id="prev-btn"><i class="fas fa-chevron-left"></i></button>
                <button id="next-btn"><i class="fas fa-chevron-right"></i></button>
            </div>
            <button class="modal-close" id="close-modal">
                <i class="fas fa-times"></i>
            </button>
        </div>
    </div>


</template>

<script setup>

</script>

<style scoped>
.line-clamp-3 {
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
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
        .wedding-tag {
            display: inline-flex;
            align-items: center;
            padding: 0.25rem 0.75rem;
            border-radius: 9999px;
            font-size: 0.75rem;
            font-weight: 500;
        }
        .wedding-tag.classic {
            background-color: #DBEAFE;
            color: #1E40AF;
        }
        .wedding-tag.rustic {
            background-color: #D1FAE5;
            color: #065F46;
        }
        .wedding-tag.modern {
            background-color: #FCE7F3;
            color: #9D174D;
        }
        .wedding-tag.bohemian {
            background-color: #EDE9FE;
            color: #5B21B6;
        }
        .wedding-tag.vintage {
            background-color: #E0F2FE;
            color: #0369A1;
        }
        .gallery-grid {
            display: grid;
            grid-template-columns: repeat(3, 1fr);
            grid-auto-rows: 200px;
            gap: 1rem;
        }
        .gallery-item {
            position: relative;
            overflow: hidden;
            border-radius: 0.5rem;
            cursor: pointer;
        }
        .gallery-item img {
            width: 100%;
            height: 100%;
            object-fit: cover;
            transition: transform 0.3s ease;
        }
        .gallery-item:hover img {
            transform: scale(1.05);
        }
        .gallery-item-main {
            grid-column: span 2;
            grid-row: span 2;
        }
        .modal-overlay {
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background-color: rgba(0,0,0,0.9);
            z-index: 1000;
            display: flex;
            justify-content: center;
            align-items: center;
            opacity: 0;
            visibility: hidden;
            transition: all 0.3s ease;
        }
        .modal-overlay.active {
            opacity: 1;
            visibility: visible;
        }
        .modal-content {
            position: relative;
            max-width: 90%;
            max-height: 90%;
        }
        .modal-content img {
            max-width: 100%;
            max-height: 80vh;
            object-fit: contain;
        }
        .modal-nav {
            position: absolute;
            top: 50%;
            transform: translateY(-50%);
            width: 100%;
            display: flex;
            justify-content: space-between;
            padding: 0 1rem;
        }
        .modal-nav button {
            background-color: rgba(255,255,255,0.8);
            width: 40px;
            height: 40px;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            cursor: pointer;
            transition: all 0.3s ease;
        }
        .modal-nav button:hover {
            background-color: rgba(255,255,255,1);
        }
        .modal-close {
            position: absolute;
            top: 1rem;
            right: 1rem;
            background-color: rgba(255,255,255,0.8);
            width: 40px;
            height: 40px;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            cursor: pointer;
            transition: all 0.3s ease;
        }
        .modal-close:hover {
            background-color: rgba(255,255,255,1);
        }
        .testimonial-card {
            background: white;
            border-radius: 0.5rem;
            box-shadow: 0 4px 6px rgba(0,0,0,0.1);
            transition: all 0.3s ease;
        }
        .testimonial-card:hover {
            transform: translateY(-5px);
            box-shadow: 0 10px 25px rgba(0,0,0,0.1);
        }
</style>
