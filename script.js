
const WHATSAPP_NUMBERS = [
  "249928477105",
  "249990053814",
  "249960518234"
];

const year = document.getElementById("year");
if (year) {
  year.textContent = new Date().getFullYear();
}

const form = document.getElementById("request-form");

if (form) {
  form.addEventListener("submit", function (event) {
    event.preventDefault();

    const data = new FormData(form);

    const message = [
      "طلب جديد - MONTY STORE",
      "الاسم: " + (data.get("name") || ""),
      "الخدمة: " + (data.get("service") || ""),
      "الجهاز: " + (data.get("device") || ""),
      "التفاصيل: " + (data.get("details") || "")
    ].join("\n");

    const choice = prompt(
      "مرحباً بك في MONTY STORE\n\n" +
      "اختر رقم واتساب للتواصل:\n" +
      "1 - +249 928 477 105\n" +
      "2 - +249 990 053 814\n" +
      "3 - +249 960 518 234 (احتياطي)\n\n" +
      "اكتب 1 أو 2 أو 3:",
      "1"
    );

    if (!["1", "2", "3"].includes((choice || "").trim())) {
      if (choice !== null) {
        alert("اختيار غير صحيح. اختر 1 أو 2 أو 3.");
      }
      return;
    }

    const number = WHATSAPP_NUMBERS[Number(choice.trim()) - 1];

    const url =
      "https://wa.me/" + number +
      "?text=" + encodeURIComponent(message);

    window.location.href = url;
  });
}
