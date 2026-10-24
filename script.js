const year = document.getElementById("year");

if (year) {
  year.textContent = new Date().getFullYear();
}

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
// حركة ظهور الأقسام عند التمرير
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
    {
      threshold: 0.15
    }
  );

  revealElements.forEach(function (element) {
    revealObserver.observe(element);
  });
} else {
  revealElements.forEach(function (element) {
    element.classList.add("visible");
  });
}
