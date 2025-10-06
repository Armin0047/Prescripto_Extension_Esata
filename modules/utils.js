// modules/utils.js

/*
 * قالب‌بندی عدد برای نمایش ریالی با جداکننده‌ی هزارگان
 * @param {string|number} str
 * @returns {string}
 */
export function ToRial(str) {
  const clean = String(str).replace(/,/g, '');
  return clean.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
}

/*
 * بررسی موجودی منفی کالا
 * @param {string|number} needed - تعداد مورد نیاز
 * @param {string|number} available - موجودی فعلی
 * @param {number} isManfi - وضعیت مجاز بودن موجودی منفی (۰ یا ۱)
 * @returns {boolean}
 */
export function MojodiManfi(needed, available, isManfi) {
  if (parseInt(isManfi) !== 0) return false;
  return parseInt(available) < parseInt(needed);
}

/*
 * بررسی اختلاف منفی قیمت کالای انتخابی با قیمت سیستم تأمین
 * @param {string|number} systemPrice - قیمت ثبت‌شده در سیستم
 * @param {string|number} calculatedPrice - قیمت محاسبه‌شده بر اساس تعداد × قیمت کالا
 * @returns {boolean}
 */
export function PriceManfi(systemPrice, calculatedPrice) {
  return parseFloat(calculatedPrice) < parseFloat(systemPrice);
}