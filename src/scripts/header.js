document.addEventListener('DOMContentLoaded', function () {
  const headerElement = document.querySelector('.js-header');
  if (!headerElement) return;

  let lastKnownScrollPosition = 0;
  const stickyHeaderElement = headerElement.querySelector('.js-sticky-header');
  const navbarDropdownElement = headerElement.querySelector('.js-navbar-dropdown');

  window.onscroll = function () {
    if (lastKnownScrollPosition > document.documentElement.scrollTop) {
      if (headerElement.offsetTop >= document.documentElement.scrollTop) {
        stickyHeaderElement.classList.remove('is-fixed');
      } else {
        stickyHeaderElement.classList.add('is-fixed');
      }
    } else {
      stickyHeaderElement.classList.remove('is-fixed');
    }
    lastKnownScrollPosition = document.documentElement.scrollTop;
  };
});
