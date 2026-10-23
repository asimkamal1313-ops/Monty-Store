// TODO: Replace with the store's WhatsApp number in international format, digits only.
const WHATSAPP_NUMBERS = ["249928477105", "249990053814"];
document.getElementById("year").textContent = new Date().getFullYear();
document.getElementById("request-form").addEventListener("submit", function (event) {
  event.preventDefault();
  const data = new FormData(event.currentTarget);
  const message = [
    "طلب جديد - MONTY STORE",
    "الاسم: " + data.get("name"),
    "الخدمة: " + data.get("service"),
    "الجهاز: " + data.get("device"),
    "التفاصيل: " + data.get("details")
  ].join("\n");
  const choice = prompt("اختر رقم واتساب لإرسال الطلب:\\n1 - 249928477105\\n2 - 249990053814", "1");
  const index = choice === "2" ? 1 : 0;
  const number = WHATSAPP_NUMBERS[index];
  window.open("https://wa.me/" + number + "?text=" + encodeURIComponent(message), "_blank", "noopener");
});
