/* ==========================================================
   M.R.F. Sara — Portfolio
   All site behaviour lives here. Edit CONFIG to update links.
   ========================================================== */

"use strict";

/* ---------- 1. CONFIG: the only part you need to edit ---------- */
const CONFIG = {
  links: {
    linkedin: "https://www.linkedin.com/in/sara-riflan-592b8b348/",
    instagram: "https://www.instagram.com/iamnxt_sarah/",
    github: "https://github.com/sarah-dev2004",
    facebook: "", // add a Facebook URL; empty = icon is hidden
  },
  whatsappNumber: "94741240990", // country code + number, no "+" or spaces
  typedTexts: [
    "Web Developer",
    "Software Engineer Intern",
    "Java Developer",
    "IT Undergraduate",
  ],
};

/* ---------- Small helpers ---------- */
const $ = (selector, scope = document) => scope.querySelector(selector);
const $$ = (selector, scope = document) => [...scope.querySelectorAll(selector)];
const prefersReducedMotion = window.matchMedia(
  "(prefers-reduced-motion: reduce)"
).matches;

/* ---------- 2. Social links ---------- */
function setupSocialLinks() {
  const iconToLink = {
    "bxl-linkedin": CONFIG.links.linkedin,
    "bxl-github": CONFIG.links.github,
    "bxl-facebook": CONFIG.links.facebook,
    "bxl-instagram": CONFIG.links.instagram,
  };

  $$(".social-media a, .footer .social a").forEach((anchor) => {
    const icon = $("i", anchor);
    const key = Object.keys(iconToLink).find((cls) =>
      icon?.classList.contains(cls)
    );
    const url = iconToLink[key];

    if (!url) {
      anchor.hidden = true; // no URL set, so hide the icon
      return;
    }

    anchor.href = url;
    anchor.target = "_blank";
    anchor.rel = "noopener noreferrer";
    anchor.setAttribute("aria-label", key.replace("bxl-", ""));
  });
}

/* ---------- 3. Mobile menu ---------- */
function setupMobileMenu() {
  const menuIcon = $("#menu-icon");
  const navbar = $(".navbar");
  if (!menuIcon || !navbar) return;

  const setOpen = (open) => {
    navbar.classList.toggle("active", open);
    menuIcon.classList.toggle("bx-menu", !open);
    menuIcon.classList.toggle("bx-x", open);
    menuIcon.setAttribute("aria-expanded", String(open));
  };

  menuIcon.setAttribute("role", "button");
  menuIcon.setAttribute("tabindex", "0");
  menuIcon.setAttribute("aria-label", "Toggle navigation menu");
  setOpen(false);

  menuIcon.addEventListener("click", () =>
    setOpen(!navbar.classList.contains("active"))
  );
  menuIcon.addEventListener("keydown", (e) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      setOpen(!navbar.classList.contains("active"));
    }
  });

  // Close after choosing a link, pressing Escape, or resizing to desktop
  navbar.addEventListener("click", (e) => {
    if (e.target.closest("a")) setOpen(false);
  });
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") setOpen(false);
  });
  window.addEventListener("resize", () => {
    if (window.innerWidth > 991) setOpen(false);
  });
}

/* ---------- 4. Highlight the nav link of the visible section ---------- */
function setupScrollSpy() {
  const sections = $$("section[id]");
  const links = $$(".navbar a");

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        links.forEach((link) =>
          link.classList.toggle(
            "active",
            link.getAttribute("href") === `#${entry.target.id}`
          )
        );
      });
    },
    { rootMargin: "-45% 0px -50% 0px" } // triggers near the middle of the screen
  );

  sections.forEach((section) => observer.observe(section));
}

/* ---------- 5. Header shadow + back-to-top button ---------- */
function setupScrollEffects() {
  const header = $(".header");

  const toTop = document.createElement("button");
  toTop.className = "back-to-top";
  toTop.type = "button";
  toTop.setAttribute("aria-label", "Back to top");
  toTop.innerHTML = "<i class='bx bx-up-arrow-alt'></i>";
  toTop.addEventListener("click", () =>
    window.scrollTo({ top: 0, behavior: prefersReducedMotion ? "auto" : "smooth" })
  );
  document.body.appendChild(toTop);

  let ticking = false;
  const update = () => {
    header.classList.toggle("sticky", window.scrollY > 50);
    toTop.classList.toggle("visible", window.scrollY > 500);
    ticking = false;
  };

  window.addEventListener(
    "scroll",
    () => {
      if (!ticking) {
        requestAnimationFrame(update);
        ticking = true;
      }
    },
    { passive: true }
  );
  update();
}

/* ---------- 6. Typing effect for the hero role ---------- */
function setupTypedText() {
  const target = $(".multiple-text");
  if (!target) return;

  const texts = CONFIG.typedTexts;

  // Motion-sensitive visitors just see the first role
  if (prefersReducedMotion) {
    target.textContent = texts[0];
    return;
  }

  let textIndex = 0;
  let charIndex = 0;
  let deleting = false;

  const tick = () => {
    const current = texts[textIndex];
    charIndex += deleting ? -1 : 1;
    target.textContent = current.slice(0, charIndex);

    let delay = deleting ? 40 : 90;

    if (!deleting && charIndex === current.length) {
      deleting = true;
      delay = 1500; // pause on the full word
    } else if (deleting && charIndex === 0) {
      deleting = false;
      textIndex = (textIndex + 1) % texts.length;
      delay = 400;
    }
    setTimeout(tick, delay);
  };

  tick();
}

/* ---------- 7. Reveal sections as they scroll into view ---------- */
function setupReveal() {
  if (prefersReducedMotion || !("IntersectionObserver" in window)) return;

  const items = $$(
    ".home-content, .home-img, .about-content, .about-img, .service-box, .contact form"
  );

  const observer = new IntersectionObserver(
    (entries, obs) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("show");
        obs.unobserve(entry.target); // animate once only
      });
    },
    { threshold: 0.15 }
  );

  items.forEach((item) => {
    item.classList.add("reveal");
    observer.observe(item);
  });
}

/* ---------- 8. Contact form -> opens WhatsApp with the message ---------- */
function setupContactForm() {
  const form = $(".contact form");
  if (!form) return;

  const fields = {
    name: $('input[name="name"]', form),
    email: $('input[name="email"]', form),
    phone: $('input[name="phone"]', form),
    subject: $('input[name="subject"]', form),
    message: $('textarea[name="message"]', form),
  };

  const status = document.createElement("p");
  status.className = "form-status";
  status.setAttribute("role", "status");
  form.appendChild(status);

  const showStatus = (text, isError = false) => {
    status.textContent = text;
    status.classList.toggle("error", isError);
  };

  const validators = {
    name: (v) => v.length >= 2 || "Please enter your full name.",
    email: (v) =>
      /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v) || "Please enter a valid email address.",
    phone: (v) =>
      v === "" || /^[+\d\s()-]{7,15}$/.test(v) || "Please enter a valid phone number.",
    subject: (v) => v.length >= 3 || "Please add a subject.",
    message: (v) => v.length >= 10 || "Your message should be at least 10 characters.",
  };

  // Clear an error as soon as the person fixes the field
  Object.values(fields).forEach((field) =>
    field.addEventListener("input", () => {
      field.classList.remove("invalid");
      showStatus("");
    })
  );

  form.addEventListener("submit", (e) => {
    e.preventDefault();

    const values = {};
    for (const [key, field] of Object.entries(fields)) {
      values[key] = field.value.trim();
      const result = validators[key](values[key]);
      if (result !== true) {
        field.classList.add("invalid");
        field.focus();
        showStatus(result, true);
        return;
      }
    }

    const text = [
      `Hello Sara, I'm ${values.name}.`,
      `Subject: ${values.subject}`,
      "",
      values.message,
      "",
      `Email: ${values.email}`,
      values.phone ? `Phone: ${values.phone}` : null,
    ]
      .filter((line) => line !== null) // drops the phone line when it's empty
      .join("\n");

    const url = `https://wa.me/${CONFIG.whatsappNumber}?text=${encodeURIComponent(text)}`;
    window.open(url, "_blank", "noopener");

    showStatus("Opening WhatsApp. Press send there to deliver your message.");
    form.reset();
  });
}

/* ---------- 9. Footer year + CV button ---------- */
function setupMisc() {
  const copyright = $(".copyright");
  if (copyright) {
    copyright.innerHTML = `&copy; ${new Date().getFullYear()} Mohamed Riflan Fathima Sara. All rights reserved`;
  }
}

/* ---------- Start everything ---------- */
document.addEventListener("DOMContentLoaded", () => {
  setupSocialLinks();
  setupMobileMenu();
  setupScrollSpy();
  setupScrollEffects();
  setupTypedText();
  setupReveal();
  setupContactForm();
  setupMisc();
});