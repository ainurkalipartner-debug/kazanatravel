/* =========================================================
   KAZANA TRAVEL — interactivity
   ========================================================= */
(function () {
  "use strict";

  /* ---------- i18n ---------- */
  function getLang() {
    return localStorage.getItem("kz_lang") || (document.documentElement.lang === "ar" ? "ar" : "en");
  }
  function applyLang(lang) {
    const dict = (window.KAZANA_I18N && window.KAZANA_I18N[lang]) || {};
    document.documentElement.lang = lang;
    document.documentElement.dir = lang === "ar" ? "rtl" : "ltr";
    localStorage.setItem("kz_lang", lang);

    document.querySelectorAll("[data-i18n]").forEach(el => {
      const key = el.getAttribute("data-i18n");
      const attr = el.getAttribute("data-i18n-attr");
      if (!dict[key]) return;
      if (attr) el.setAttribute(attr, dict[key]);
      else el.textContent = dict[key];
    });

    const label = document.querySelector("[data-lang-label]");
    if (label) label.textContent = lang === "ar" ? "EN" : "عربي";
  }
  document.addEventListener("DOMContentLoaded", () => applyLang(getLang()));

  const langBtn = document.getElementById("langToggle");
  if (langBtn) {
    langBtn.addEventListener("click", () => applyLang(getLang() === "ar" ? "en" : "ar"));
  }

  /* ---------- NAV scroll ---------- */
  const nav = document.getElementById("nav");
  if (nav) {
    const onScroll = () => nav.classList.toggle("scrolled", window.scrollY > 40);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
  }

  /* ---------- Mobile menu ---------- */
  const menuToggle = document.getElementById("menuToggle");
  const navLinks = document.getElementById("navLinks");
  if (menuToggle && navLinks) {
    menuToggle.addEventListener("click", () => {
      menuToggle.classList.toggle("is-open");
      navLinks.classList.toggle("is-open");
      document.body.classList.toggle("no-scroll");
    });
    navLinks.querySelectorAll("a").forEach(a => a.addEventListener("click", () => {
      menuToggle.classList.remove("is-open");
      navLinks.classList.remove("is-open");
      document.body.classList.remove("no-scroll");
    }));
  }

  /* ---------- Hero slides ---------- */
  const slides = document.querySelectorAll(".hero-slide");
  if (slides.length > 1) {
    let idx = 0;
    setInterval(() => {
      slides[idx].classList.remove("active");
      idx = (idx + 1) % slides.length;
      slides[idx].classList.add("active");
    }, 5000);
  }

  /* ---------- Reveal on scroll ---------- */
  if ("IntersectionObserver" in window) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach(e => {
        if (e.isIntersecting) {
          e.target.classList.add("is-visible");
          io.unobserve(e.target);
        }
      });
    }, { threshold: 0.12, rootMargin: "0px 0px -60px 0px" });
    document.querySelectorAll("[data-reveal]").forEach(el => io.observe(el));
  } else {
    document.querySelectorAll("[data-reveal]").forEach(el => el.classList.add("is-visible"));
  }

  /* ---------- Counters ---------- */
  const counterEls = document.querySelectorAll(".counter-num[data-count]");
  if (counterEls.length && "IntersectionObserver" in window) {
    const cio = new IntersectionObserver((entries) => {
      entries.forEach(e => {
        if (!e.isIntersecting) return;
        const el = e.target;
        const target = parseInt(el.dataset.count, 10);
        const suffix = el.querySelector("span.plus");
        const suffixHTML = suffix ? suffix.outerHTML : "";
        let cur = 0;
        const step = Math.max(1, Math.round(target / 50));
        const tick = () => {
          cur = Math.min(target, cur + step);
          el.innerHTML = cur + suffixHTML;
          if (cur < target) requestAnimationFrame(tick);
        };
        tick();
        cio.unobserve(el);
      });
    }, { threshold: 0.4 });
    counterEls.forEach(el => cio.observe(el));
  }

  /* ---------- Testimonials carousel ---------- */
  const testWrap = document.getElementById("testWrap");
  const testStage = document.getElementById("testStage");
  const testDots = document.getElementById("testDots");
  if (testStage && testDots) {
    const slidesT = testStage.querySelectorAll(".test-slide");
    const dots = testDots.querySelectorAll(".test-dot");
    const prevBtn = document.getElementById("testPrev");
    const nextBtn = document.getElementById("testNext");
    let i = 0, t = null, paused = false;
    const show = (n) => {
      i = (n + slidesT.length) % slidesT.length;
      slidesT.forEach(s => s.classList.remove("active"));
      dots.forEach(d => d.classList.remove("active"));
      slidesT[i].classList.add("active");
      dots[i].classList.add("active");
    };
    const next = () => show(i + 1);
    const prev = () => show(i - 1);
    const auto = () => { clearInterval(t); if (!paused) t = setInterval(next, 6500); };
    dots.forEach(d => d.addEventListener("click", () => { show(parseInt(d.dataset.i, 10)); auto(); }));
    prevBtn?.addEventListener("click", () => { prev(); auto(); });
    nextBtn?.addEventListener("click", () => { next(); auto(); });
    if (testWrap) {
      testWrap.addEventListener("mouseenter", () => { paused = true; clearInterval(t); });
      testWrap.addEventListener("mouseleave", () => { paused = false; auto(); });
    }
    // Keyboard arrows when section in view
    document.addEventListener("keydown", (e) => {
      if (!testWrap) return;
      const r = testWrap.getBoundingClientRect();
      if (r.top > window.innerHeight || r.bottom < 0) return;
      if (e.key === "ArrowRight") { next(); auto(); }
      if (e.key === "ArrowLeft")  { prev(); auto(); }
    });
    auto();
  }

  /* ---------- FAQ ---------- */
  document.querySelectorAll(".faq-item").forEach(item => {
    const q = item.querySelector(".faq-q");
    const a = item.querySelector(".faq-a");
    q.addEventListener("click", () => {
      const open = item.classList.toggle("open");
      a.style.maxHeight = open ? a.scrollHeight + "px" : 0;
    });
  });

  /* ---------- Lead form ---------- */
  const leadForm = document.getElementById("leadForm");
  if (leadForm) {
    leadForm.addEventListener("submit", (e) => {
      e.preventDefault();
      const data = new FormData(leadForm);
      const text = encodeURIComponent(
        "Hello Kazana Travel!\n" +
        "Name: " + (data.get("name") || "") + "\n" +
        "Phone: " + (data.get("phone") || "") + "\n" +
        "Country: " + (data.get("country") || "") + "\n" +
        "Dates: " + (data.get("dates") || "") + "\n" +
        "Travelers: " + (data.get("travelers") || "") + "\n" +
        "Package: " + (data.get("package") || "") + "\n" +
        "Message: " + (data.get("message") || "")
      );
      document.getElementById("formSuccess").classList.add("show");
      setTimeout(() => {
        window.open("https://wa.me/77713160021?text=" + text, "_blank");
      }, 600);
    });
  }

  /* ---------- Floating WhatsApp menu ---------- */
  const fabWrap = document.getElementById("fabWrap");
  const fabBtn = document.getElementById("fabBtn");
  if (fabWrap && fabBtn) {
    fabBtn.addEventListener("click", (e) => { e.stopPropagation(); fabWrap.classList.toggle("open"); });
    document.addEventListener("click", (e) => { if (!fabWrap.contains(e.target)) fabWrap.classList.remove("open"); });
  }

  /* ---------- Destination lightbox / gallery ---------- */
  const destGalleries = {
    "big-almaty-lake":  [["assets/images/big-almaty-lake.jpg","Big Almaty Lake — turquoise at 2,511 m"], ["assets/images/shymbulak.jpg","Approach via Tian Shan"], ["assets/images/pic-3.png","Lakeside reflections"]],
    "charyn-canyon":    [["assets/images/pic-1.png","Charyn Canyon — the Valley of Castles"], ["assets/images/tour-4.png","Inside the canyon"]],
    "kolsay":           [["assets/images/pic-3.png","Kolsay Lake #1 — quiet morning"], ["assets/images/tour-4.png","Kolsay highlands"]],
    "shymbulak":        [["assets/images/shymbulak.jpg","Shymbulak resort"], ["assets/images/pic-4.jpg","Shymbulak in winter"]],
    "oi-qaragai":       [["assets/images/tour-1.png","Oi Qaragai cottages"], ["assets/images/oi-qaragai.jpg","Forest cottages"], ["assets/images/tour-2.png","Treehouse walkway"]],
    "qazaq-auyl":       [["assets/images/qazaq-auyl.jpg","Qazaq Auyl heritage village"]],
    "tenir":            [["assets/images/tenir-resort.jpg","Tenir Resort"], ["assets/images/tour-3.png","Honeymoon cottage decor"]],
    "kok-tobe":         [["assets/images/pic-5.jpg","Kok Tobe"]],
    "almarasan":        [["assets/images/pic-2.png","Almarasan horseback trail"]],
    "butakovka":        [["assets/images/butakovka.jpg","Butakovka Gorge"], ["assets/images/tour-4.png","Mountain trails near Butakovka"]]
  };

  const lb = document.getElementById("lightbox");
  const lbImg = document.getElementById("lbImg");
  const lbCap = document.getElementById("lbCaption");
  let lbList = []; let lbIdx = 0;

  function openLightbox(list, start) {
    if (!lb) return;
    lbList = list; lbIdx = start || 0;
    paintLightbox();
    lb.classList.add("open");
    document.body.classList.add("no-scroll");
  }
  function paintLightbox() {
    if (!lbList.length) return;
    const [src, cap] = lbList[lbIdx];
    lbImg.src = src;
    lbImg.alt = cap || "";
    lbCap.textContent = cap || "";
  }
  function closeLightbox() { lb.classList.remove("open"); document.body.classList.remove("no-scroll"); }

  document.querySelectorAll(".dest-card").forEach(card => {
    card.addEventListener("click", () => {
      const key = card.getAttribute("data-gallery");
      const list = destGalleries[key];
      if (list && list.length) openLightbox(list, 0);
    });
  });

  // Tour-page galleries: any .tour-gallery img with data-list-id grouping
  document.querySelectorAll(".tour-gallery img").forEach((img, i, all) => {
    img.addEventListener("click", () => {
      const list = Array.from(all).map(x => [x.src, x.alt]);
      openLightbox(list, i);
    });
  });

  document.getElementById("lbClose")?.addEventListener("click", closeLightbox);
  document.getElementById("lbPrev")?.addEventListener("click", () => { lbIdx = (lbIdx - 1 + lbList.length) % lbList.length; paintLightbox(); });
  document.getElementById("lbNext")?.addEventListener("click", () => { lbIdx = (lbIdx + 1) % lbList.length; paintLightbox(); });
  if (lb) lb.addEventListener("click", (e) => { if (e.target === lb) closeLightbox(); });
  document.addEventListener("keydown", (e) => {
    if (!lb || !lb.classList.contains("open")) return;
    if (e.key === "Escape") closeLightbox();
    if (e.key === "ArrowRight") { lbIdx = (lbIdx + 1) % lbList.length; paintLightbox(); }
    if (e.key === "ArrowLeft")  { lbIdx = (lbIdx - 1 + lbList.length) % lbList.length; paintLightbox(); }
  });

})();
