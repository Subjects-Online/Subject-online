// تعريف المسارات
const routes = {
  "/": "pages/index.html",
  "/accounting": "pages/accounting.html",
  // يمكن إضافة المزيد من المسارات هنا
};

// دالة لتحميل المحتوى
async function loadPage(path) {
  const wrapper = document.getElementById("app");

  try {
    // تأثير التلاشي
    wrapper.style.opacity = "0";

    const response = await fetch(path);
    if (!response.ok) throw new Error("الملف غير موجود");

    const data = await response.text();

    // إضافة التأخير للتأثير البصري
    setTimeout(() => {
      wrapper.innerHTML = data;
      wrapper.style.opacity = "1";

      // تفعيل السكريبتات بعد تحميل المحتوى
      initScripts();
    }, 300);
  } catch (error) {
    wrapper.innerHTML = `
            <div style="text-align: center; padding: 50px;">
                <h2>خطأ في تحميل الصفحة</h2>
                <p>${error.message}</p>
                <a href="/" data-link>العودة للصفحة الرئيسية</a>
            </div>
        `;
    wrapper.style.opacity = "1";
  }
}

// معالجة المسارات
async function handleRoute() {
  const path = window.location.pathname;
  const route = routes[path] || routes["/"];
  await loadPage(route);
}

// تفعيل السكريبتات بعد تحميل الصفحة
function initScripts() {
  // يمكن إضافة أي كود يحتاج للتنفيذ بعد تحميل الصفحة
  console.log("تم تحميل الصفحة بنجاح");

  // تفعيل الروابط الديناميكية
  document.querySelectorAll("a[data-link]").forEach((link) => {
    link.addEventListener("click", handleLinkClick);
  });
}

// معالجة النقر على الروابط
function handleLinkClick(e) {
  e.preventDefault();
  const path = this.getAttribute("href");
  window.history.pushState({}, "", path);
  handleRoute();
}

// تهيئة التطبيق
function init() {
  // معالجة زر الرجوع في المتصفح
  window.addEventListener("popstate", handleRoute);

  // تحميل الصفحة الأولى
  handleRoute();
}

// بدء التطبيق عند تحميل الصفحة
document.addEventListener("DOMContentLoaded", init);
