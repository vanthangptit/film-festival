document.addEventListener('DOMContentLoaded', function () {
  const headerElement = document.querySelector('.js-header');
  if (!headerElement) return;

  let lastKnownScrollPosition = 0;
  const headerMenuElement = headerElement.querySelector('.js-header-menu');
  const stickyHeaderMenuElement = headerElement.querySelector('.js-sticky-header-menu');

  console.log('headerMenuElement: ', headerMenuElement.offsetTop)

  window.onscroll = function () {
    if (lastKnownScrollPosition > document.documentElement.scrollTop) {
      stickyHeaderMenuElement.classList.add('is-scrolling');
    } else {
      stickyHeaderMenuElement.classList.remove('is-scrolling');
    }
    lastKnownScrollPosition = document.documentElement.scrollTop;
  };
});
