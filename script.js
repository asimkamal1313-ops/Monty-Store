const year = document.getElementById("year");

if (year) {
  year.textContent = new Date().getFullYear();
}

/* =========================
   نموذج طلب الخدمة عبر واتساب
========================= */

const form = document.getElementById("request-form");

if (form) {
  form.addEventListener("submit", function (event) {
    event.preventDefault();

    const data = new FormData(form);

    const name = (data.get("name") || "").toString().trim();
    const service = (data.get("service") || "").toString().trim();
    const device = (data.get("device") || "").toString().trim();
    const serial = (data.get("serial") || "").toString().trim();
    const details = (data.get("details") || "").toString().trim();
    const number = (data.get("contactNumber") || "").toString().trim();

    const allowedNumbers = [
      "249928477105",
      "249960518234"
    ];

    if (!allowedNumbers.includes(number)) {
      alert("يرجى اختيار رقم واتساب صحيح.");
      return;
    }

    const message = [
      "✨ طلب جديد - MONTY STORE",
      "",
      "👤 الاسم: " + name,
      "🛠️ الخدمة: " + service,
      "📱 موديل الجهاز: " + device,
      "🔢 الرقم التسلسلي: " + (serial || "لم يتم إدخاله"),
      "📝 تفاصيل الطلب: " + details,
      "",
      "شكراً لاختياركم MONTY STORE ❤️"
    ].join("\n");

    const url =
      "https://wa.me/" +
      number +
      "?text=" +
      encodeURIComponent(message);

    window.location.href = url;
  });
}

/* =========================
   إعدادات تقييمات العملاء
========================= */

// رابط Google Apps Script المنشور
const REVIEWS_API =
  "https://script.google.com/macros/s/AKfycbz7YB275K5VAHN1zK1PuwvKG3_AcfeLCHbs18u5Evv5HXMzx15DLVBRRZbuaKzhYVR-/exec";

/* تحميل التقييمات المعتمدة */

function loadApprovedReviews() {
  const container = document.getElementById("approved-reviews");

  if (!container) return;

  container.replaceChildren();

  const callbackName =
    "montyReviewsCallback_" + Date.now();

  const script = document.createElement("script");

  const timeout = window.setTimeout(function () {
    if (window[callbackName]) {
      delete window[callbackName];
    }

    script.remove();

    if (!container.hasChildNodes()) {
      container.textContent =
        "تعذر تحميل التقييمات الآن. يرجى المحاولة لاحقًا.";
    }
  }, 12000);

  window[callbackName] = function (result) {
    window.clearTimeout(timeout);
    delete window[callbackName];
    script.remove();

    if (!result || result.ok !== true || !Array.isArray(result.reviews)) {
      container.textContent = "تعذر تحميل التقييمات حاليًا.";
      return;
    }

    container.replaceChildren();

    if (result.reviews.length === 0) {
      container.textContent =
        "لا توجد تقييمات منشورة حتى الآن. كن أول من يشارك تجربته!";
      return;
    }

    result.reviews.forEach(function (review) {
      const card = document.createElement("article");
      card.className = "review-card";

      const heading = document.createElement("h3");
      heading.textContent = review.name;

      const service = document.createElement("p");
      service.className = "review-service";
      service.textContent = review.service;

      const stars = document.createElement("p");
      stars.className = "review-stars";
      stars.textContent =
        "★".repeat(Number(review.rating)) +
        "☆".repeat(5 - Number(review.rating));

      const comment = document.createElement("p");
      comment.className = "review-comment";
      comment.textContent = review.comment;

      const date = document.createElement("small");
      date.className = "review-date";
      date.textContent = review.date || "";

      card.append(heading, service, stars, comment, date);
      container.appendChild(card);
    });
  };

  script.onerror = function () {
    window.clearTimeout(timeout);
    delete window[callbackName];
    script.remove();
    container.textContent =
      "تعذر الاتصال بخدمة التقييمات حاليًا.";
  };

  script.src =
    REVIEWS_API +
    "?action=approved&callback=" +
    encodeURIComponent(callbackName) +
    "&t=" +
    Date.now();

  document.head.appendChild(script);
}

/* إرسال تقييم العميل */

const reviewForm = document.getElementById("review-form");

if (reviewForm) {
  reviewForm.addEventListener("submit", async function (event) {
    event.preventDefault();

    const status = document.getElementById("review-status");
    const submitButton = document.getElementById("review-submit");

    const data = new FormData(reviewForm);

    const review = {
      name: (data.get("name") || "").toString().trim(),
      service: (data.get("service") || "").toString().trim(),
      rating: (data.get("rating") || "").toString().trim(),
      comment: (data.get("comment") || "").toString().trim()
    };

    if (
      !review.name ||
      !review.service ||
      !review.comment ||
      !/^[1-5]$/.test(review.rating)
    ) {
      status.textContent = "يرجى إكمال جميع حقول التقييم.";
      return;
    }

    status.textContent = "جارٍ إرسال تقييمك...";
    submitButton.disabled = true;

    try {
      const body = new URLSearchParams(review);

      await fetch(REVIEWS_API, {
        method: "POST",
        mode: "no-cors",
        body: body
      });

      status.textContent =
        "تم إرسال طلب التقييم. سيظهر بعد المراجعة والموافقة إذا وصل بنجاح.";

      reviewForm.reset();

    } catch (error) {
      status.textContent =
        "تعذر إرسال التقييم. تحقق من اتصال الإنترنت وحاول مجددًا.";
    } finally {
      submitButton.disabled = false;
    }
  });
}

loadApprovedReviews();

/* =========================
   ظهور الأقسام عند التمرير
========================= */

const revealElements = document.querySelectorAll(
  ".section-heading, .service, .steps > div, .contact-section > div, .contact-section form"
);

revealElements.forEach(function (element) {
  element.classList.add("reveal");
});

if ("IntersectionObserver" in window) {
  const revealObserver = new IntersectionObserver(
    function (entries, observer) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.15 }
  );

  revealElements.forEach(function (element) {
    revealObserver.observe(element);
  });
} else {
  revealElements.forEach(function (element) {
    element.classList.add("visible");
  });
  }
