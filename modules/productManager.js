// modules/productManager.js

import { fetchProducts, updateDefaultKala } from './api.js';
import { ToRial, MojodiManfi, PriceManfi } from './utils.js';

const pageSize = 50;


export async function showProductModal(ConfigConnection,searchValue,namereq,strCodesazeman,index,isManfi,erxCode){
 const backdrop = document.createElement('div');
    backdrop.id = 'modalBackdropDr';
    backdrop.style = `
      position: fixed; top: 0; left: 0;
      width: 100vw; height: 100vh;
      background: rgba(0,0,0,0.5);
      overflow-y: auto;
      display: flex; justify-content: center; align-items: center; direction: rtl;
      z-index: 9999;`;

    const modal = document.createElement('div');
    modal.id = 'InsertDr';
    modal.style = `
      background: white;
      max-height: 90vh;
      padding: 20px;
      border-radius: 8px;
      top: 10%;
      width: 80vw;
      box-shadow: 0 0 20px rgba(0,0,0,0.3);`;

    const content = document.createElement("div");
    content.style.height = '80vh';

    content.innerHTML = `
      <div class="card">
        <div class="card-header">
          <small class="form-text text-muted">جستجو کالا</small>
          <p style="font-size:1rem">
            <span>دارو تجویزی: </span><span>${searchValue} - </span><span>${erxCode} - </span><span>${namereq}</span>
          </p>
        </div>
        <div class="form-group row">
          <small class="col-sm-1 col-form-label" style="margin-right:1rem;margin-top:0.5rem;margin-bottom:0.5rem;">جستجو</small>
          <div class="col-sm-10">
            <input style="margin-top:0.5rem" class="form-control" type="text" name="SName" value="${searchValue}" placeholder="برای جستجو تایپ کنید..." />
          </div>
        </div>
      </div>
      <div class="modal-body" style="margin-top:1rem;">
        <div class="table-responsive">
          <table class="table table-bordered table-hover">
            <thead class="thead-light" >
              <tr>
                <th>انتخاب</th><th>کد کالا</th><th>نام فارسی</th><th>نام لاتین</th><th>کدژنریک</th><th>قیمت</th><th>موجودی قفسه</th><th>موجودی انبار</th>
              </tr>
            </thead>
            <tbody id="productTableBody">
            </tbody>
          </table>
        </div>
  </div>`;

  const closeBtn = document.createElement('button');
  closeBtn.id = 'btnCloseModalDr';
  closeBtn.textContent = 'بستن';
  closeBtn.classList.add('btn', 'btn-secondary');
  closeBtn.style = "margin-top: 10px; float: left;";

  modal.appendChild(content);
  modal.appendChild(closeBtn);
  backdrop.appendChild(modal);
  document.body.appendChild(backdrop);

    closeBtn.addEventListener('click', function () {
        backdrop.remove();
    });

    backdrop.addEventListener('click', function (event) {
        if (!modal.contains(event.target)) {
        event.stopPropagation();
        }
       });
 // بارگذاری محصولات صفحه اول

  loadProductList(ConfigConnection,strCodesazeman, 1,searchValue,index,isManfi,erxCode);


    let searchTimer;
    document.querySelector('input[name="SName"]').addEventListener("input", function () {
    clearTimeout(searchTimer);
    const searchValue = this.value.trim();

    searchTimer = setTimeout(() => {
        loadProductList(ConfigConnection,strCodesazeman, 1,searchValue,index,isManfi,erxCode);
    }, 300); // استفاده از debounce برای کاهش بار روی API
    });

}

/**
 * بارگذاری لیست کالاها با صفحه‌بندی و جستجو
 * @param {string} codesazeman
 * @param {number} page
 * @param {string} searchValue
 * @param {number} indexAria - شماره ردیف در نسخه برای اعمال انتخاب
 */
export async function loadProductList(ConfigConnection,codesazeman, page = 1, searchValue = '', indexAria,isManfi,erxCode) {
  const data = await fetchProducts(ConfigConnection,codesazeman, page, pageSize, searchValue);
  const tbody = document.getElementById('productTableBody');
  tbody.innerHTML = '';
  renderProducts(ConfigConnection,data.data, indexAria,isManfi,erxCode);
}

/**
 * ساخت ردیف‌های کالا در جدول مدال
 * @param {Array<Object>} products
 * @param {number} indexAria
 */
function renderProducts(ConfigConnection,products, indexAria,isManfi,erxCode) {
  const tbody = document.getElementById('productTableBody');

  products.forEach((p, index) => {
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td id="trbtn${index}"></td>
      <td id="trcode${index}">${p.code}</td>
      <td id="trfaname${index}">${p.faname}</td>
      <td id="trenname${index}">${p.enname}</td>
      <td id="trgencode${index}">${p.gencode}</td>
      <td id="trprice${index}">${ToRial(p.price || '0')}</td>
      <td id="trmojodi${index}">${p.mojodi ?? ''}</td>
      <td id="trmojodianb${index}">${p.mojodiAnb ?? ''}</td>`;

    tbody.appendChild(tr);

    const btn = document.createElement('button');
    btn.textContent = 'انتخاب';
    btn.classList.add('btn', 'btn-sm', 'btn-success');
    btn.id = `btnselectKala${index}`;
    document.getElementById(`trbtn${index}`).appendChild(btn);

    btn.addEventListener('click', () => handleSelectProduct(ConfigConnection,index, indexAria,isManfi,erxCode));
  });
}

/**
 * اعمال انتخاب کالا روی ردیف نسخه
 * @param {number} index
 * @param {number} indexAria
 */
async function handleSelectProduct(ConfigConnection,index, indexAria,isManfi,erxCode) {
  const code = document.getElementById(`trcode${index}`).innerText.trim();
  const faname = document.getElementById(`trfaname${index}`).innerText.trim();
  const gencode = document.getElementById(`trgencode${index}`).innerText.trim();
  const priceRaw = document.getElementById(`trprice${index}`).innerText.replace(/,/g, '');
  const mojodi = document.getElementById(`trmojodi${index}`).innerText.trim() || '0';

  const codeAria = document.getElementById(`datascodeKalaAria${indexAria}`);
  const fanameAria = document.getElementById(`datasnameAria${indexAria}`);
  const gencodeAria = document.getElementById(`datasgencodeAria${indexAria}`);
  const priceAria = document.getElementById(`dataspriceAria${indexAria}`);
  const mojodiAria = document.getElementById(`datasmojodiAria${indexAria}`);
  const tedAria = document.getElementById(`tdbtnted${indexAria}`);
  const totalAmount = document.getElementById(`datastotalAmount${indexAria}`);
  const gencodeTamin = document.getElementById(`datasgencode${indexAria}`);

  // موجودی منفی
  if (MojodiManfi(tedAria.value, mojodi,isManfi)) {
    mojodiAria.style.color = 'red';
  } else {
    mojodiAria.style.color = 'blue';
  }

  // اختلاف قیمت
  const priceCalc = parseFloat(priceRaw) * parseInt(tedAria.value);
  const sysTotal = parseFloat(totalAmount.innerText.replace(/,/g, ''));
  priceAria.style.background = PriceManfi(sysTotal, priceCalc) ? '#f0f06c' : 'transparent';

  // ذخیره پیش‌فرض ژنریک
  if(codeAria.innerText === '0'){
    const confirmed = confirm("آیا داروی انتخابی را به عنوان پیش‌فرض ژنریک ذخیره می‌کنید؟");
      if (confirmed) {
        await updateDefaultKala(ConfigConnection,codeAria.innerText, code, erxCode);
      }
  }

  else if (!codeAria.innerText || codeAria.innerText !== code) {

    if (parseInt(gencode.toString()) === parseInt(gencodeAria.innerText.toString())) {
      const confirmed = confirm("آیا داروی انتخابی را به عنوان پیش‌فرض ژنریک ذخیره می‌کنید؟");
      if (confirmed) {
        await updateDefaultKala(ConfigConnection,codeAria.innerText, code, erxCode);
      }
    }
  }

  // اعمال در جدول
  fanameAria.innerText = faname;
  gencodeAria.innerText = gencode;
  priceAria.innerText = ToRial(priceRaw);
  mojodiAria.innerText = mojodi;
  codeAria.innerText = code;

  // بستن مدال
  document.getElementById('InsertDr')?.remove();
  document.getElementById('modalBackdropDr')?.remove();
}
