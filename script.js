
// =====================================
// MONTY STORE - MAIN SCRIPT
// =====================================

// أرقام واتساب
const WHATSAPP_NUMBERS = {
  "249928477105": "رقم التواصل الأول",
  "249960518234": "رقم التواصل الثاني"
};

// روابط Google Apps Script
const REVIEWS_API = "https://script.google.com/macros/s/AKfycbwvgY3a7dUg2Jo2JfYI77RQSg2Fi4XedlRsASCdNll1ufVYy_DKf4CmIbv2A8YaDgg4Bg/exec";

const OFFERS_API = "https://script.google.com/macros/s/AKfycbxJktjkFaN8gVuRc2fBGhgVeCnzNpZmtkAucg5JLFKYW2nt_Fj-1LZERdvOLsu4LNz6/exec";

// =====================================
// السنة الحالية
// =====================================

const yearElement = document.getElementById("year");

if (yearElement) {
  yearElement.textContent = new Date().getFullYear();
}

// =====================================
// إرسال طلب الخدمة عبر واتساب
// =====================================

const requestForm = document.getElementById("request-form");

if (requestForm) {
  requestForm.addEventListener("submit", function (event) {
    event.preventDefault();

    const formData = new FormData(requestForm);

    const name = formData.get("name")?.trim() || "";
    const service = formData.get("service") || "";
    const device = formData.get("device")?.trim() || "";
    const serial = formData.get("serial")?.trim() || "غير مذكور";
    const details = formData.get("details")?.trim() || "";
    const contactNumber = formData.get("contactNumber");

    if (!WHATSAPP_NUMBERS[contactNumber]) {
      alert("يرجى اختيار رقم تواصل صحيح.");
      return;
    }

    const message =
`طلب جديد - MONTY STORE

الاسم: ${name}
الخدمة: ${service}
الجهاز: ${device}
الرقم التسلسلي: ${serial}

التفاصيل:
${details}

شكراً لثقتكم في MONTY STORE`;

    const whatsappURL =
      "https://wa.me/" +
      contactNumber +
      "?text=" +
      encodeURIComponent(message);

    window.open(whatsappURL, "_blank");
  });
}

// =====================================
// أداة تحميل البيانات JSONP
// =====================================

function loadJsonp(url, callback) {
  const callbackName =
    "montyCallback_" +
    Date.now() +
    "_" +
    Math.floor(Math.random() * 100000);

  const script = document.createElement("script");

  window[callbackName] = function (data) {
    callback(data);

    delete window[callbackName];
    script.remove();
  };

  script.onerror = function () {
    delete window[callbackName];
    script.remove();
    console.error("تعذر تحميل البيانات:", url);
  };

  const separator = url.includes("?") ? "&" : "?";

  script.src =
    url +
    separator +
    "callback=" +
    encodeURIComponent(callbackName);

  document.body.appendChild(script);
}

// =====================================
// تحميل العروض من Google Sheets
// =====================================

function loadOffers() {
  const container = document.getElementById("offers-container");

  if (!container) return;

  loadJsonp(OFFERS_API, function (data) {
    container.innerHTML = "";

    if (!data || !data.ok || !Array.isArray(data.offers)) {
      container.textContent = "تعذر تحميل العروض حالياً.";
      return;
    }

    if (data.offers.length === 0) {
      container.textContent = "لا توجد عروض متاحة حالياً.";
      return;
    }

    data.offers.forEach(function (offer) {
      const card = document.createElement("article");
      card.className = "service offer-card";

      const title = document.createElement("h3");
      title.textContent = offer.name || "عرض خاص";

      const details = document.createElement("p");
      details.textContent = offer.details || "";

      card.appendChild(title);
      card.appendChild(details);

      if (offer.oldPrice) {
        const oldPrice = document.createElement("p");
        oldPrice.className = "offer-old-price";
        oldPrice.textContent = "السعر قبل الخصم: " + offer.oldPrice;
        card.appendChild(oldPrice);
      }

      if (offer.newPrice) {
        const newPrice = document.createElement("p");
        newPrice.className = "offer-new-price";
        newPrice.textContent = "السعر بعد الخصم: " + offer.newPrice;
        card.appendChild(newPrice);
      }

      const link = document.createElement("a");
      link.href = "#contact";
      link.textContent = "اطلب العرض ←";

      card.appendChild(link);
      container.appendChild(card);
    });
  });
}

// =====================================
// تحميل التقييمات المعتمدة
// =====================================

function loadApprovedReviews() {
  const container = document.getElementById("approved-reviews");

  if (!container) return;

  loadJsonp(REVIEWS_API + "?action=approved", function (data) {
    container.innerHTML = "";

    const reviews = Array.isArray(data)
      ? data
      : data && Array.isArray(data.reviews)
        ? data.reviews
        : [];

    if (reviews.length === 0) {
      container.textContent = "لا توجد تقييمات منشورة حالياً.";
      return;
    }

    reviews.forEach(function (review) {
      const card = document.createElement("article");
      card.className = "service review-card";

      const name = document.createElement("h3");
      name.textContent = review.name || review.customer || "عميل MONTY STORE";

      const service = document.createElement("p");
      service.textContent = review.service || "";

      const rating = document.createElement("p");
      const stars = Math.max(
        0,
        Math.min(5, Number(review.rating || 0))
      );

      rating.textContent = "⭐".repeat(stars);

      const comment = document.createElement("p");
      comment.textContent = review.comment || "";

      card.appendChild(name);
      card.appendChild(service);
      card.appendChild(rating);
      card.appendChild(comment);

      container.appendChild(card);
    });
  });
}

// =====================================
// إرسال تقييم جديد
// =====================================

const reviewForm = document.getElementById("review-form");

if (reviewForm) {
  reviewForm.addEventListener("submit", async function (event) {
    event.preventDefault();

    const status = document.getElementById("review-status");
    const submitButton = document.getElementById("review-submit");

    const formData = new FormData(reviewForm);

    const review = {
      name: formData.get("name")?.trim() || "",
      service: formData.get("service") || "",
      rating: formData.get("rating") || "",
      comment: formData.get("comment")?.trim() || ""
    };

    if (!review.name || !review.service || !review.rating || !review.comment) {
      status.textContent = "يرجى إكمال جميع بيانات التقييم.";
      return;
    }

    submitButton.disabled = true;
    status.textContent = "جارٍ إرسال تقييمك...";

    try {
      await fetch(REVIEWS_API, {
        method: "POST",
        mode: "no-cors",
        body: JSON.stringify(review)
      });

      status.textContent =
        "تم إرسال تقييمك. سيظهر بعد المراجعة والموافقة عليه.";

      reviewForm.reset();

    } catch (error) {
      status.textContent =
        "تعذر إرسال التقييم. حاول مرة أخرى أو تواصل معنا عبر واتساب.";

      console.error(error);

    } finally {
      submitButton.disabled = false;
    }
  });
}

// =====================================
// تأثير ظهور العناصر عند التمرير
// =====================================

if ("IntersectionObserver" in window) {
  const observer = new IntersectionObserver(
    function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.12 }
  );

  document
    .querySelectorAll(".service, .steps > div, .section-heading")
    .forEach(function (element) {
      observer.observe(element);
    });
}

// =====================================
// تشغيل الأنظمة
// =====================================

document.addEventListener("DOMContentLoaded", function () {
  loadOffers();
  loadApprovedReviews();
});
