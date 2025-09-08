function handleNavbarScroll() {
  const navbar = document.getElementById("main-nav");
  if (window.scrollY > 50) {
    navbar.classList.add("scrolled");
  } else {
    navbar.classList.remove("scrolled");
  }
  updateScrollProgress();
}

window.addEventListener("scroll", handleNavbarScroll);

document.addEventListener("DOMContentLoaded", () => {
  handleNavbarScroll();
});

document.addEventListener("DOMContentLoaded", function () {
  const translateBtn = document.getElementById("translateBtn");
  const translateBtnText = translateBtn ? translateBtn.querySelector("span") : null;
  let currentLang = localStorage.getItem("language") || "en";
  localStorage.setItem("language", currentLang);

  function applyTranslation(lang) {
    document.querySelectorAll("[data-en][data-ar]").forEach(el => {
      if (el.tagName === "INPUT" || el.tagName === "TEXTAREA") {
        el.placeholder = el.dataset[lang];
      } else {
        el.textContent = el.dataset[lang];
      }
    });

    document.documentElement.lang = lang;
    document.documentElement.dir = lang === "ar" ? "rtl" : "ltr";
    document.body.classList.toggle("rtl", lang === "ar");

    if (translateBtnText) {
      translateBtnText.textContent = lang === "en"
        ? translateBtnText.dataset.en
        : translateBtnText.dataset.ar;
    }

    document.querySelectorAll(".error-msg").forEach(el => {
      el.textContent = el.dataset[lang] || el.dataset.en;
    });

    // ✅ Re-init Swiper when language changes
    initSwiper(lang);
  }

  applyTranslation(currentLang);

  if (translateBtn) {
    translateBtn.addEventListener("click", function () {
      currentLang = currentLang === "en" ? "ar" : "en";
      localStorage.setItem("language", currentLang);
      applyTranslation(currentLang);

      if (navbarCollapse && navbarCollapse.classList.contains("show")) {
        new bootstrap.Collapse(navbarCollapse).hide();
      }
      navbar.classList.add("scrolled");
    });
  }
});

function createScrollProgress() {
  if (!document.querySelector(".scroll-indicator")) {
    const progressBar = document.createElement("div");
    progressBar.className = "scroll-indicator";
    document.body.appendChild(progressBar);
  }
}

function updateScrollProgress() {
  const progressBar = document.querySelector(".scroll-indicator");
  if (progressBar) {
    const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
    const scrollProgress = scrollHeight > 0 ? (window.scrollY / scrollHeight) * 100 : 0;
    progressBar.style.transform = `scaleX(${scrollProgress / 100})`;
  }
}

function animateCounters() {
  const counters = document.querySelectorAll(".counter");

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      const counter = entry.target;
      const target = parseInt(counter.getAttribute("data-target"));

      if (entry.isIntersecting) {
        let current = 0;
        const increment = target / 100;

        const updateCounter = () => {
          if (current < target) {
            current += increment;
            counter.textContent = Math.ceil(current);
            setTimeout(updateCounter, 20);
          } else {
            counter.textContent = target;
          }
        };

        updateCounter();
      } else {
        counter.textContent = "0";
      }
    });
  }, { threshold: 0.5 });

  counters.forEach(counter => observer.observe(counter));
}

document.addEventListener("DOMContentLoaded", function () {
  createScrollProgress();
  updateScrollProgress();
  animateCounters();
});

document.getElementById("contactForm")?.addEventListener("submit", function (e) {
  e.preventDefault();

  const form = e.target;
  let isValid = true;
  let errors = {};

  const firstName = form.firstName.value.trim();
  const lastName = form.lastName.value.trim();
  const email = form.email.value.trim();
  const phone = form.phone.value.trim();
  const destination = form.destination.value.trim();
  const travelDate = form.travelDate.value.trim();
  const travelers = form.travelers.value.trim();
  const message = form.message.value.trim();

  const nameRegex = /^[A-Za-z\u0600-\u06FF\s]+$/;
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const phoneRegex = /^\+?\d{8,15}$/;

  if (!firstName) {
    errors.firstName = { en: "First name can't be empty", ar: "لا يمكن أن يكون الاسم الأول فارغًا" };
    isValid = false;
  } else if (!nameRegex.test(firstName)) {
    errors.firstName = { en: "Invalid first name", ar: "اسم أول غير صالح" };
    isValid = false;
  }

  if (!lastName) {
    errors.lastName = { en: "Last name can't be empty", ar: "لا يمكن أن يكون اسم العائلة فارغًا" };
    isValid = false;
  } else if (!nameRegex.test(lastName)) {
    errors.lastName = { en: "Invalid last name", ar: "اسم العائلة غير صالح" };
    isValid = false;
  }

  if (!email) {
    errors.email = { en: "Email can't be empty", ar: "لا يمكن أن يكون البريد الإلكتروني فارغًا" };
    isValid = false;
  } else if (!emailRegex.test(email)) {
    errors.email = { en: "Invalid email address", ar: "بريد إلكتروني غير صالح" };
    isValid = false;
  }

  if (!phone) {
    errors.phone = { en: "Phone number can't be empty", ar: "لا يمكن أن يكون رقم الهاتف فارغًا" };
    isValid = false;
  } else if (!phoneRegex.test(phone)) {
    errors.phone = { en: "Invalid phone number", ar: "رقم الهاتف غير صالح" };
    isValid = false;
  }

  if (!destination) {
    errors.destination = { en: "Please choose a destination", ar: "الرجاء اختيار الوجهة" };
    isValid = false;
  }

  if (!travelDate) {
    errors.travelDate = { en: "Travel date can't be empty", ar: "لا يمكن أن يكون تاريخ السفر فارغًا" };
    isValid = false;
  }

  if (!travelers) {
    errors.travelers = { en: "Please select number of travelers", ar: "الرجاء اختيار عدد المسافرين" };
    isValid = false;
  }

  form.querySelectorAll(".error-msg").forEach(el => el.remove());

  for (const key in errors) {
    const field = form.querySelector(`#${key}`);
    if (field) {
      const error = document.createElement("small");
      error.className = "error-msg text-danger d-block mt-1";
      error.dataset.en = errors[key].en;
      error.dataset.ar = errors[key].ar;
      error.textContent = errors[key][document.documentElement.lang] || errors[key].en;
      field.closest(".form-floating").appendChild(error);

      field.addEventListener("input", () => {
        const siblingError = field.closest(".form-floating").querySelector(".error-msg");
        if (siblingError) siblingError.remove();
      });
      field.addEventListener("change", () => {
        const siblingError = field.closest(".form-floating").querySelector(".error-msg");
        if (siblingError) siblingError.remove();
      });
    }
  }

  if (isValid) {
    const text =
      `New Travel Inquiry:\n` +
      `First Name: ${firstName}\n` +
      `Last Name: ${lastName}\n` +
      `Email: ${email}\n` +
      `Phone: ${phone}\n` +
      `Destination: ${destination}\n` +
      `Travel Date: ${travelDate}\n` +
      `Travelers: ${travelers}\n` +
      `Message: ${message}`;

    const whatsappNumber = "966567638260";
    const url = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(text)}`;
    window.open(url, "_blank");
    form.reset();
    form.querySelectorAll(".error-msg").forEach(el => el.remove());
  }
});

const backToTopBtn = document.getElementById("backToTop");
if (backToTopBtn) {
  window.addEventListener("scroll", () => {
    if (window.scrollY > 200) {
      backToTopBtn.classList.add("show");
    } else {
      backToTopBtn.classList.remove("show");
    }
  });

  backToTopBtn.addEventListener("click", () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  });
}

const navbar = document.getElementById("main-nav");
const navbarToggler = document.querySelector(".navbar-toggler");
const navbarCollapse = document.querySelector(".navbar-collapse");

if (navbarToggler) {
  navbarToggler.addEventListener("click", () => {
    navbar.classList.add("scrolled");
  });
}

document.querySelectorAll(".nav-link").forEach(link => {
  link.addEventListener("click", () => {
    if (navbarCollapse && navbarCollapse.classList.contains("show")) {
      new bootstrap.Collapse(navbarCollapse).hide();
    }
    navbar.classList.add("scrolled");
  });
});

document.addEventListener("DOMContentLoaded", function () {
  AOS.init({
    duration: 1000,
    once: false,
  });

  const currentLang = localStorage.getItem("language") || "en";
  initSwiper(currentLang);
});

let swiper;
function initSwiper(lang) {
  if (swiper) swiper.destroy(true, true);

  swiper = new Swiper(".mySwiper", {
    loop: true,
    autoplay: {
      delay: 2500,
      disableOnInteraction: false,
    },
    pagination: {
      el: ".swiper-pagination",
      clickable: true,
    },
    navigation: {
      nextEl: ".swiper-button-next",
      prevEl: ".swiper-button-prev",
    },
    breakpoints: {
      320: { slidesPerView: 1, spaceBetween: 10 },
      768: { slidesPerView: 2, spaceBetween: 20 },
      992: { slidesPerView: 3, spaceBetween: 30 }
    },
    direction: "horizontal",
    rtl: lang === "ar", 
  });
}
