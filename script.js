const btnConfigurar = document.querySelector('.btnConfigurar');
const iconClose = document.querySelector('.icon-close');
const wrapper = document.querySelector('.wrapper');

btnConfigurar.addEventListener('click', () => {
    wrapper.classList.add('active-popup');
});

iconClose.addEventListener('click', () => {
    wrapper.classList.remove('active-popup');
});



