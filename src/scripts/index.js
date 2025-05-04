import Swiper from 'swiper';
import 'swiper/css/autoplay';
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import axios from 'axios';

document.addEventListener('DOMContentLoaded', () => {
  setYear()
  initForm()
  initModal()
  initProgramms()
  initProgressFill()

  const form = document.getElementById('form');

  form.addEventListener('submit', function (event) {
    event.preventDefault();
  });
});

const initForm = () => {
  const phoneInput = document.getElementById('inputPhone');
  // let statusForm = "idle";
  const closeBtns = document.querySelectorAll('.form__button-close');
  const sendBtn = document.getElementById('send__form')

  phoneInput.addEventListener('input', function (event) {
    let value = event.target.value.replace(/\D/g, '');

    let formatted = '+7 ';
    if (value.length > 1) formatted += `${value.slice(1, 4)} `;
    if (value.length >= 4) formatted += `${value.slice(4, 7)} `;
    if (value.length >= 7) formatted += `${value.slice(7, 9)} `;
    if (value.length >= 9) formatted += `${value.slice(9, 11)}`;
    
    this.value = formatted.trim();
  });

  sendBtn.addEventListener('click', function (e) {
    e.preventDefault();
  
    const form = document.getElementById('form');
    const inputs = form.querySelectorAll('.form__container-input');
    let isValid = true;
  
    form.querySelectorAll('.form__error').forEach(el => el.remove());
  
    inputs.forEach(input => {
      const value = input.value.trim();
      const container = input.closest('.form__container');
      let errorText = '';
  
      if (!value) {
        errorText = 'Это поле обязательно';
      } else if (input.type === 'tel') {
        const cleanNumber = value.replace(/\D/g, '');
        if (cleanNumber.length !== 11) {
          errorText = 'Введите корректный номер телефона';
        }
      }
  
      if (errorText) {
        const error = document.createElement('p');
        error.className = 'form__error';
        error.textContent = errorText;
        container.appendChild(error);
        isValid = false;
      }
    });
  
    if (isValid) {
      const inputs = form.querySelectorAll('input[name]');
      form.classList.add("recieved")
      const entries = Object.fromEntries(
        Array.from(inputs).map(input => [input.name, input.value])
      );
      console.log('Отправляем данные:', entries);
      closeBtns[1].style.display = "block"
      closeBtns[0].style.display = "none"
      sendBtn.style.display = "none"
      axios.post("http://127.0.0.1:8000/send", entries)
      // Условный блок отправки — замени на свою логику fetch или др.
      // fetch('/your-endpoint', { method: 'POST', body: JSON.stringify(formData) })
    }
  });
}

const setYear = () => {
  const yearSpan = document.getElementById('year');
  yearSpan.textContent = new Date().getFullYear();
}

const initModal = () => {
  const modal = document.getElementById('modal');
  let toggleModal = false;
  const closeBtns = document.querySelectorAll('.form__button-close');
  const form = document.getElementById('form');
  const programInput = document.querySelector('.form__container-input[placeholder="Название"]');
  const bookButtons = document.querySelectorAll(".programm__card-button");
  const bookButtonsSecond = document.querySelectorAll(".programm__button");
  const sendBtn = document.getElementById('send__form')
  const whyButton = document.getElementById('whyButton');
  const steamRooms = document.querySelectorAll(".steamRoom");

  document.addEventListener("click", function (e) {
    if (toggleModal && !form.contains(e.target) && !e.target.closest(".programm__card-button") && !e.target.closest(".programm__button") && !e.target.closest(".why__reboot-button") && !e.target.closest(".steamRoom")) {
      modal.style.display = "none";
      toggleModal = false;
      form.classList.remove("recieved")
      closeBtns[1].style.display = "none"
      closeBtns[0].style.display = "block"
      sendBtn.style.display = "block"
    }
  });

  steamRooms.forEach(steam => {
    steam.addEventListener("click", function () {
      console.log("click ")
      const programTitle = steam.querySelector(".steamRoom__title").innerText;
      programInput.value = programTitle;
      modal.style.display = "flex";
      toggleModal = true
    });
  });

  whyButton.addEventListener("click", function () {
    programInput.value = "";
    modal.style.display = "flex";
    toggleModal = true
  });

  bookButtonsSecond.forEach(button => {
    button.addEventListener("click", function () {
      programInput.value = "";
      modal.style.display = "flex";
      toggleModal = true
    });
  });

  bookButtons.forEach(button => {
    button.addEventListener("click", function () {
      const cardContainer = this.closest(".programm__card-container");
      const programTitle = cardContainer.querySelector(".programm__card-title").innerText;
      programInput.value = programTitle;
      modal.style.display = "flex";
      toggleModal = true
    });
  });

  closeBtns.forEach((button, index) => {
    if (index === 1){
      button.style.display = "none"
    }

    button.addEventListener('click', (e) => {
      e.preventDefault();
      toggleModal = false;
      form.classList.remove("recieved")
      modal.style.display = 'none';
      closeBtns[1].style.display = "none"
      closeBtns[0].style.display = "block"
      sendBtn.style.display = "block"
    })
  });

}

const initProgressFill = () => {
  gsap.registerPlugin(ScrollTrigger);

  const progressFill = document.getElementById('progressFill');
  const steps = document.querySelectorAll('.step');

  gsap.to(progressFill, {
    height: "100%",
    ease: "none",
    scrollTrigger: {
      trigger: document.body,
      start: "top top",
      end: "bottom bottom",
      scrub: true
    }
  });

  steps.forEach((step, index) => {
    const progress = index / (steps.length - 1);
    ScrollTrigger.create({
      trigger: document.body,
      start: `${progress * 100}% top`,
      end: `${(progress + (1 / (steps.length - 1))) * 100}% top`,
      toggleClass: { targets: step, className: "active" }
    });
  });
}

const initProgramms = () => {
  const programs = document.querySelectorAll('.programm');
  const programmsMobile = document.querySelectorAll('.programms-mobile__item');
  programs.forEach(program => {
    program.addEventListener('click', () => {
      programs.forEach(p => p.classList.remove('active'));
      program.classList.add('active');
    });
  });

  programmsMobile.forEach(program => {
    program.addEventListener('click', () => {
      programmsMobile.forEach(p => p.classList.remove('active'));
      program.classList.add('active');
    });
  });

  new Swiper('.programms__list-container', {
    loop: true,
    spaceBetween: 0,  
    slidesPerView: 1.15,
    speed: 800,
    reloadImages: true,
    lazy: {
      loadPrevNext: true,
    },
    watchSlidesProgress: true,
    watchSlidesVisibility: true,
    autoplay: {
      delay: 2500,
      disableOnInteraction: false,
    },
    grabCursor: true,
  });

  new Swiper('.areas__carusel', {
    loop: true,
    slidesPerView: 1.2,
    speed: 400,
    preloadImages: true,
    lazy: {
      loadPrevNext: true,
    },
    watchSlidesProgress: true,
    watchSlidesVisibility: true,
    autoplay: {
      delay: 2500,
      disableOnInteraction: false,
    },
    breakpoints: {
      640: {
        slidesPerView: 1.2,
      },
      1024: {
        slidesPerView: 3.2,
      }
    },
  });
}
