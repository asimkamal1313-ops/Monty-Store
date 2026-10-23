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
      "اختر رقم واتساب لاستقبال الطلب:\n" +
      "1 - +249 928 477 105\n" +
      "2 - +249 990 053 814",
      "1"
    );

    if (choice !== "1" && choice !== "2") {
      return;
    }

    const number = WHATSAPP_NUMBERS[Number(choice) - 1];
    const url =
      "https://wa.me/" + number +
      "?text=" + encodeURIComponent(message);

    window.location.href = url;
  });
}
