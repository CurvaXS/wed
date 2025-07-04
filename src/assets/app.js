
// // Mobile menu toggle
// document.getElementById('mobile-menu-button').addEventListener('click', function () {
//       const menu = document.getElementById('mobile-menu');
//       menu.classList.toggle('hidden');
// });

// // Login modal
// const loginModal = document.getElementById('login-modal');
// const closeLoginModal = document.getElementById('close-login-modal');

// // Show login modal when login link is clicked
// document.querySelectorAll('a[href="#"]').forEach(link => {
//       if (link.textContent.includes('Вход')) {
//         link.addEventListener('click', function (e) {
//           e.preventDefault();
//           loginModal.classList.remove('hidden');
//           loginModal.classList.add('flex');
//         });
//       }
// });

// // Close login modal
// closeLoginModal.addEventListener('click', function () {
//       loginModal.classList.add('hidden');
//       loginModal.classList.remove('flex');
// });

// // Close modal when clicking outside
// loginModal.addEventListener('click', function (e) {
//       if (e.target === loginModal) {
//         loginModal.classList.add('hidden');
//         loginModal.classList.remove('flex');
//       }
// });

// // Card hover effect
// document.querySelectorAll('.card-hover').forEach(card => {
//       card.addEventListener('mouseenter', function () {
//         this.style.transition = 'transform 0.3s ease, box-shadow 0.3s ease';
//       });
// });

// // Favorite button toggle
// document.querySelectorAll('.fa-heart').forEach(heart => {
//       heart.addEventListener('click', function () {
//         if (this.classList.contains('far')) {
//           this.classList.remove('far');
//           this.classList.add('fas', 'text-pink-500');
//         } else {
//           this.classList.remove('fas', 'text-pink-500');
//           this.classList.add('far');
//         }
//       });
// });

// // Smooth scroll for anchor links
// document.querySelectorAll('a[href^="#"]').forEach(anchor => {
//       anchor.addEventListener('click', function (e) {
//         e.preventDefault();
//         document.querySelector(this.getAttribute('href')).scrollIntoView({
//           behavior: 'smooth'
//         });
//       });
// });
