/*
 * بارگذاری فایل‌های Bootstrap CSS و JS فقط یک‌بار
 * از تکرار بارگذاری در صفحات مختلف جلوگیری می‌کند.
 */
export function loadBootstrapOnce() {
  // بررسی وجود فایل CSS و JS در صفحه
  const hasBootstrapCSS = document.querySelector("link[href*='bootstrap']");
  const hasBootstrapJS = document.querySelector("script[src*='bootstrap']");

  // بارگذاری فایل CSS اگر قبلاً اضافه نشده
  if (!hasBootstrapCSS) {
    const bootstrapCSS = document.createElement("link");
    bootstrapCSS.rel = "stylesheet";
    bootstrapCSS.href = chrome.runtime.getURL("assets/css/bootstrap.min.css");
    document.head.appendChild(bootstrapCSS);
  }

  // بارگذاری فایل JS اگر قبلاً اضافه نشده
  if (!hasBootstrapJS) {
    const bootstrapJS = document.createElement("script");
    bootstrapJS.src = chrome.runtime.getURL("assets/js/bootstrap.bundle.min.js");
    bootstrapJS.defer = true;
    document.head.appendChild(bootstrapJS);
  }
}
