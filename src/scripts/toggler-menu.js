document.addEventListener('DOMContentLoaded', function () {
  const togglerMenuElement = document.querySelector('.js-toggler-menu');
  if (!togglerMenuElement) return;

  togglerMenuElement.addEventListener('click', function(e) {
    e.preventDefault();
    if (togglerMenuElement.classList.contains('is-active')) {
      togglerMenuElement.classList.remove('is-active');
    } else {
      togglerMenuElement.classList.add('is-active');
    }
  }, false);
});
