// modules/doctorManager.js

import { getTakhasosList, insertDoctor } from './api.js';

/**
 * نمایش مدال ثبت پزشک با لیست تخصص‌ها
 * @param {string} docID - کد نظام پزشک
 */
export async function showDoctorModal(ConfigConnection,docID) {
  const backdrop = document.createElement('div');
  backdrop.id = 'modalBackdropDr';
  backdrop.style = `
    position: fixed;
    top: 0; left: 0;
    width: 100vw; height: 100vh;
    background: rgba(0,0,0,0.5);
    display: flex;
    justify-content: center;
    align-items: center;
    direction: rtl;
    z-index: 9999;`
  ;

  const modal = document.createElement('div');
  modal.id = 'InsertDr';
  modal.style = `
    background: white;
    padding: 25px;
    border-radius: 10px;
    width: 50vw;
    box-shadow: 0 0 20px rgba(0,0,0,0.3);`
  ;

  const content = document.createElement('div');
  content.innerHTML = `
    <h5>تعریف پزشک</h5>
    <div class="form-group">
      <label>نام پزشک:</label>
      <input type="text" id="inputnameDr" class="form-control" />
    </div>
    <div class="form-group mt-3">
      <label>تخصص پزشک:</label>
      <select id="selectTakh" class="form-select">
        <option value="0" disabled selected>انتخاب تخصص</option>
      </select>
    </div>
    <div class="form-group mt-4">
      <button class="btn btn-success" id="btnInsideModalDr">ثبت و ذخیره</button>
      <button class="btn btn-secondary" id="btnCloseModalDr">بستن</button>
    </div>`
  ;

  modal.appendChild(content);
  backdrop.appendChild(modal);
  document.body.appendChild(backdrop);

  // بستن مدال
  document.getElementById('btnCloseModalDr').addEventListener('click', () => {
    backdrop.remove();
  });

  // بارگذاری تخصص‌ها
  try {
    const data = await getTakhasosList(ConfigConnection);
    if (data.success) {
      const select = document.getElementById('selectTakh');
      data.data.forEach(({ codeTakh, takhasosName }) => {
        const opt = document.createElement('option');
        opt.value = codeTakh;
        opt.textContent = takhasosName;
        select.appendChild(opt);
      });
    }
  } catch (err) {
    console.error("❌ خطا در دریافت تخصص‌ها:", err.message);
  }

  // ثبت پزشک
  document.getElementById('btnInsideModalDr').addEventListener('click', async () => {
    const nameDr = document.getElementById('inputnameDr').value.trim();
    const select = document.getElementById('selectTakh');
    const selectedOption = select.options[select.selectedIndex];

    if (!nameDr) return alert("لطفاً نام پزشک را وارد کنید");
    if (!selectedOption || !selectedOption.value || parseInt(selectedOption.value) === 0 ) return alert("لطفاً تخصص را انتخاب کنید");

    try {
      const result = await insertDoctor(ConfigConnection,docID, nameDr, selectedOption.value);
      if (result.success) {
        // اعمال در مدال اصلی نسخه
        document.getElementById("lblNameDrAria").innerText = nameDr;
        document.getElementById("lblTakhasosName").innerText = selectedOption.text;
        window.codetakhsend = selectedOption.value;
        window.codetakhsend2 = result.data.codetakh2;

        backdrop.remove();
      } else {
        alert("❌ خطا: " + result.message);
      }
    } catch (err) {
      console.error("❌ خطا در ثبت پزشک:", err.message);
    }
  });
}