document.addEventListener('DOMContentLoaded', function () {
  const linkDropdownElement = document.querySelector('.js-link-dropdown');
  const linkDropdownSwiperElement = document.querySelector('.js-link-dropdown-swiper');

  if (!linkDropdownElement || !linkDropdownSwiperElement) return;

  const bodyElement = document.querySelector('body');
  const linkDropdownSwiper = new Swiper(".js-link-dropdown-swiper", {
    direction: "vertical",
    slidesPerView: 1,
    loop: true,
    autoplay: {
      delay: 3500,
      disableOnInteraction: false,
    },
    speed: 1200,
  });
});
