// background/background.js

/**
 * گوش دادن به پیام‌ها از content یا popup
 * اینجا می‌تونیم فایل config.txt رو بخونیم یا داده ارسال کنیم
 */

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === 'readConfig') {
    fetch(chrome.runtime.getURL('assets/config.txt'))
      .then(res => res.text())
      .then(text => {
        const config = parseConfig(text);
        sendResponse({ config });
      })
      .catch(err => sendResponse({ error: err.message }));

    return true; // اجازه ارسال پاسخ async
  }
});

/**
 * تبدیل متن config.txt به آبجکت
 * پشتیبانی از ساختار key=value در هر خط
 * @param {string} text
 * @returns {Object}
 */
function parseConfig(text) {
  const config = {};
  text.split('\n').forEach(line => {
    const [key, value] = line.split('=');
    if (key && value) config[key.trim()] = value.trim();
  });
  return config;
}
