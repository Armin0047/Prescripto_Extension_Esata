// content/content.js


import { loadBootstrapOnce } from '../modules/bootstrap.js';
import { showMainModal } from '../modules/modalManager.js';
import { checkNoskheExist, fetchDoctorInfo, getKalaInfo,CheckConnectionApi } from '../modules/api.js';
import { ToRial } from '../modules/utils.js';

// ⚠️ در صورت نیاز، متغیرهای وضعیت کلی افزونه
let codetakhsend = 0;
let codetakhsend2 = 0;
let isManfi = 0;
let id = 0;
let Lname = 0;
let Hname = 0;
let CoName = 0;
let inputsabt = 0;
let realValuepass = '';
let realValue = '';
let trackingCodedialog ;
// مرحله اولیه بارگذاری
loadBootstrapOnce();
createFloatingButton();


/**
 * ساخت دکمه شناور برای شروع فرآیند افزونه
 */
function createFloatingButton() {
  const button = document.createElement('button');
  button.id = 'floating-button';
  button.textContent = '📤 ارسال اطلاعات به نرم‌افزار آریا';
  Object.assign(button.style, {
    position: 'fixed',
    top: '75px',
    right: '80vw',
    zIndex: '9999',
    backgroundColor: '#4dc473',
    color: 'white',
    padding: '10px 15px',
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer'
  });
  document.body.appendChild(button);


console.log("%c  developer by : %cdamavandiarmin@gmail.com  ",'color: red; font-weight: bold; background-color: #f5e8c4','color: green;background-color: #f5e8c4');
  button.addEventListener('click', async () => {
    button.disabled = true;

    try {
      trackingCodedialog = document.querySelector("presentation-trackingcode-dialog");

      inputsabt = document.querySelector("presentation-medicine.ng-star-inserted");
      if(!inputsabt){
        inputsabt = document.querySelector("paper-medicine.ng-star-inserted");
      }
      if (!trackingCodedialog) {
        alert("❌ نسخه ای پیدا نشد");
        return button.disabled = false;
      }  
     
      showLoginModal();          
    } catch (err) {
      console.error("❌ خطا در فرآیند افزونه:", err.message);
      alert("❌ خطا در اجرا. جزئیات در کنسول.");
    } finally {
      button.disabled = false;
    }
  });
}


/**
 * استخراج اطلاعات دارو از جدول
 * @returns {Array<Object>}
 */
function parseDrugTable() {
  const data = [];
  let table 
  try{
      table = inputsabt.children[0].children[1].children[1].children[0].children[0].children[0].children[0].children[1];
  }catch{
         table = inputsabt.children[1].children[1].children[1].children[0].children[0].children[0].children[0].children[1];
  }
  const rows = table?.getElementsByTagName('tr')||[];
  var arr = [].slice.call(rows);

  arr.forEach(row => {
    const cells = row.getElementsByTagName('td');
    if (cells.length === 12){
      data.push({
        gencode: cells[2].innerText.toString().replace('...','').trim() ?? "",
        drugName: cells[3].innerText.trim() ?? "",
        tedUsage: cells[4].innerText.trim() ?? 0,
        tedTahod: cells[5].innerText.trim() ?? 0,
        orgShare: cells[6].innerText.trim() ?? "",
        price: cells[7].children[1].children[0].children[0].children[0].value.toString().replace(/,/g, '').trim() ?? 0,
        byOrg: cells[8].innerText.toString().replace(/,/g, '').trim()  ?? 0,
        paymentByOrg: cells[9].innerText.toString().replace(/,/g, '').trim()  ?? 0,  
        paymentByPatient: cells[10].innerText.toString().replace(/,/g, '').trim()  ?? 0,
        totalAmount: cells[11].innerText.toString().replace(/,/g, '').trim()  ?? 0
      });    
    }
    else{
        data.push({          
        gencode: cells[2].innerText.toString().replace('...','').trim() ?? "",
        drugName: cells[3].innerText.trim() ?? "",
        tedUsage: cells[5].innerText.trim() ?? 0,
        tedTahod: cells[6].innerText.trim() ?? 0,
        orgShare: cells[7].innerText.trim() ?? "",
        price: cells[8].children[1].children[0].children[0].children[0].value.toString().replace(/,/g, '').trim() ?? 0,
        byOrg: cells[9].innerText.toString().replace(/,/g, '').trim()  ?? 0,
        paymentByOrg: cells[10].innerText.toString().replace(/,/g, '').trim()  ?? 0,  
        paymentByPatient: cells[11].innerText.toString().replace(/,/g, '').trim()  ?? 0,
        totalAmount: cells[12].innerText.toString().replace(/,/g, '').trim()  ?? 0
      });    
    }
  });
  return data;
}


let ConfigConnection=[];
let result=[];

export async function showLoginModal(){

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
    width: 30vw;
    box-shadow: 0 0 20px rgba(0,0,0,0.3);`
  ;

  const content = document.createElement('div');
  content.setAttribute('class','card');
  content.innerHTML = `
    <div class="card-header text-center" style="background:rgb(212, 206, 205);">
        <h5>ورود به نرم افزار</h5>
    </div>
    <div class="container">
    </form>
    <form>
        <div class="row">
                <div class="col-10">
                    <label>نام کاربری</label><br>      
                    <input type="text" name="uidaria" autocomplete="off" id="uidaria" class="form-control" value="" spellcheck="false" placeholder="نام کاربری"/>
                </div> 
                <div class="col-2">            
                </div>      
        </div>
        <div class="w-100"></div>
        <div class="row">
                <div class="col-10">
                    <label>رمز عبور</label><br>            
                    <input type="text" name="pidaria" autocomplete="off" id="pidaria" class="form-control" value="" spellcheck="false" placeholder="رمز عبور"/>
                </div> 
                <div class="col-2">            
                </div>      
        </div>
        <div class="w-100"></div>
        <div class="row">
                <div class="col-10">
                    <label>نام سرور</label><br>            
                    <input type="text" dir="ltr" name="servernamearia"  id="servernamearia" class="form-control text-center" disabled/>
                </div> 
                <div class="col-2">            
                </div>      
        </div>
        <div class="w-100"></div>
        <div class="row">
                <div class="col-10">
                    <label>پایگاه داده</label><br>            
                    <input type="text" name="databasenamearia" id="databasenamearia" class="form-control text-center" disabled/>
                </div> 
                <div class="col-2">            
                </div>      
        </div>
        <div class="w-100"></div><br>
    </form>    
    </div> 
    <div class="card-footer">   
        <div class="row"  style=" position: relative;">
            <div class="col-md-4">
            </div>
            <div class="col-md-4">
            <button class="btn btn-success" id="btnInsideModalDr" style="height:auto;width:100%;top: 0%;bottom: 0%;margin:0;pading:0;">ورود</button>
            </div>
            <div class="col-md-4">
            <button class="btn btn-secondary" id="btnCloseModalDr" style="height:auto;width:100%;top: 0%;bottom: 0%;margin:0;pading:0;">خروج</button>
            </div>
        </div>        
    </div>`
  ;

  modal.appendChild(content);
  backdrop.appendChild(modal);
  document.body.appendChild(backdrop);


  // بستن مدال
  document.getElementById('btnCloseModalDr').addEventListener('click', () => {
    backdrop.remove();
  });

   document.getElementById('btnInsideModalDr').addEventListener('click',async() => {
    const cls = document.getElementById('btnCloseModalDr');
       const ins = document.getElementById('btnInsideModalDr');
       cls.disabled=true;
       ins.disabled=true;
    if(document.getElementById('uidaria').value === null || !document.getElementById('uidaria').value){
          alert("نام کاربری و رمز خود را وارد کنید");
          cls.disabled=false;
          ins.disabled=false;
    }
        
    else   {
       
      ConfigConnection.username = realValue;
      ConfigConnection.pass = realValuepass;
      ConfigConnection.Server = document.getElementById('servernamearia').value;
      ConfigConnection.DataBase = document.getElementById('databasenamearia').value;
      
       result = await CheckConnectionApi(ConfigConnection);               
        if(result.success){        
            const fbutton = document.getElementById('floating-button');
            fbutton.textContent = `در حال واکشی اطلاعات... لطفا کمی صبر کنید` ;
            fbutton.style.backgroundColor =  '#945916';
            fbutton.disabled = true;                
            isManfi = result.data.valMojodi;
            id = result.data.id;
            Lname = result.data.lname;
            Hname = result.data.hname;
            CoName = result.data.coName;
            backdrop.remove();
            await MainExtension(ConfigConnection);
            
        }
        else
        {
          alert("⚠️نام کاربری یا رمز ورود اشتباه میباشد⚠️"); 
          cls.disabled=false;
          ins.disabled=false;
        }               
      return result;
    }   
        
  });


  chrome.runtime.sendMessage({ action: 'readConfig' }, (response) => {
    if (response?.config) {
      const config = response.config;
      ConfigConnection = config;
      // حالا می‌تونی هر قسمت از UI رو با مقادیر config پر کنی
      document.getElementById('uidaria').value = config.username || null;
      document.getElementById('pidaria').value = config.pass || null;
      document.getElementById('servernamearia').value = config.Server ;
      document.getElementById('databasenamearia').value = config.DataBase ;
      realValue =document.getElementById('uidaria').value;
      document.getElementById('uidaria').value = '*'.repeat(realValue.length);
      realValuepass =document.getElementById('pidaria').value;
      document.getElementById('pidaria').value = '*'.repeat(realValuepass.length);
    } else {
      console.error('خطا در دریافت تنظیمات:', response?.error || response);
    }
  });

    const input = document.getElementById('uidaria');
    input.addEventListener('input', (e) => {
    const newChar = e.data;
    const currentLength = input.value.length;
    // بررسی حذف کاراکتر
    if (currentLength < realValue.length) {
         realValue = realValue.slice(0, currentLength);
      } else if (newChar !== null) {
        realValue += newChar;
      }
      // نمایش خط تیره به جای کاراکترها
      input.value = '*'.repeat(realValue.length);
    });
    // جلوگیری از کپی‌کردن مقدار ماسک‌شده
    input.addEventListener('copy', (e) => {
      e.preventDefault();
    });
    

    const inputpass = document.getElementById('pidaria');    
    inputpass.addEventListener('input', (e) => {
      const newChar = e.data;
      const currentLength = inputpass.value.length;
      // بررسی حذف کاراکتر
      if (currentLength < realValuepass.length) {
        realValuepass = realValuepass.slice(0, currentLength);
      } else if (newChar !== null) {
        realValuepass += newChar;
      }
      // نمایش خط تیره به جای کاراکترها
      inputpass.value = '*'.repeat(realValuepass.length);
    });
    // جلوگیری از کپی‌کردن مقدار ماسک‌شده
    inputpass.addEventListener('copy', (e) => {
      e.preventDefault();
    });
}




    



async function MainExtension(ConfigConnection){
  let inputsabtvalue,inputCodeMelivalue,inputCodeNezamvalue,inputDateFacvalue,inputDateNoskhevalue,inputNamebimarvalue,idNoskhe;
            const el = document.getElementById("layoutContent");
            
            inputsabtvalue = el.children[1]?.children[1]?.children[0]?.children[0]?.children[1]?.children[1]?.children[0]?.children[1]?.children[0]?.children[0]?.children[6]?.children[1].innerText;
            inputCodeMelivalue = el.children[1]?.children[1]?.children[0]?.children[0]?.children[0]?.children[3].innerText.toString().replace('- کد ملی : ','').trim();
            inputCodeNezamvalue = el.children[1]?.children[1]?.children[0]?.children[0]?.children[1]?.children[1]?.children[0]?.children[1]?.children[0]?.children[0]?.children[3]?.children[1].innerText;
            inputDateFacvalue = el.children[1]?.children[1]?.children[0]?.children[0]?.children[1]?.children[1]?.children[0]?.children[1]?.children[0]?.children[0]?.children[4]?.children[1].innerText.toString().replace(/-/g, '').trim();
            inputDateNoskhevalue = el.children[1]?.children[1]?.children[0]?.children[0]?.children[1]?.children[1]?.children[0]?.children[1]?.children[0]?.children[0]?.children[4]?.children[1].innerText.toString().replace(/-/g, '').trim();            
            inputNamebimarvalue = el.children[1]?.children[1]?.children[0]?.children[0]?.children[0]?.children[2].innerText;
            idNoskhe = el.children[1]?.children[1]?.children[0]?.children[0]?.children[1]?.children[0]?.children[1]?.children[0].innerText;
            if(!inputDateFacvalue)
            {
            inputCodeMelivalue = el.children[1]?.children[1]?.children[0]?.children[0]?.children[0]?.children[3].innerText.toString().replace('- کد ملی : ','').trim();
            inputCodeNezamvalue = el.children[1]?.children[1]?.children[0]?.children[0]?.children[1]?.children[1]?.children[0]?.children[1]?.children[0]?.children[0]?.children[2]?.children[1].innerText;
            inputDateFacvalue =   el.children[1]?.children[1]?.children[0]?.children[0]?.children[1]?.children[1]?.children[0]?.children[1]?.children[0]?.children[0]?.children[3]?.children[1].innerText.toString().replace(/-/g, '').trim();
            inputDateNoskhevalue = el.children[1]?.children[1]?.children[0]?.children[0]?.children[1]?.children[1]?.children[0]?.children[1]?.children[0]?.children[0]?.children[3]?.children[1].innerText.toString().replace(/-/g, '').trim();            
            inputNamebimarvalue = el.children[1]?.children[1]?.children[0]?.children[0]?.children[0]?.children[2].innerText;

            idNoskhe = el.children[1]?.children[1]?.children[0]?.children[0]?.children[1]?.children[0]?.children[1]?.children[0].innerText;
            const parts = idNoskhe?.trim().split(" - ");            
            inputsabtvalue = parts[1];
            }            


            // گرفتن ردیف‌های جدول
            const data = parseDrugTable();

            const trackingcode = trackingCodedialog.children[0].children[0].children[0].children[1].children[0].children[0].children[0].children[1].innerHTML;


            // چک نسخه قبلی
            //const dateFormatted = formatPersianDate(inputDateFacvalue);
            const versionCheck = await checkNoskheExist(ConfigConnection,trackingcode, inputCodeMelivalue, inputDateFacvalue );            
            if (versionCheck.data.sh_noskhe > 0) {
              alert("❌ این نسخه قبلاً ثبت شده است ❌\n"+" شماره نسخه : " + versionCheck.data.sh_noskhe +"\n قابل پرداخت : "+ToRial(versionCheck.data.jamkolpardakht) + " ريال");
              const fbutton = document.getElementById('floating-button');
              fbutton.textContent = '📤 ارسال اطلاعات به نرم‌افزار آریا';
              fbutton.style.backgroundColor =  '#4dc473';
              return fbutton.disabled = false;
            }

            // دریافت اطلاعات پزشک
            const doctor = await fetchDoctorInfo(ConfigConnection,inputCodeNezamvalue);
            let doctorName = '-', takhasosName = '-';
            if (doctor.success) {
              codetakhsend = doctor.data.codeTakh;
              codetakhsend2 = doctor.data.codetakh2;
              doctorName = doctor.data.nameDoctor;
              takhasosName = doctor.data.takhasos;
            }


            // گرفتن اطلاعات کالاها
            const esata = {
              ReqNum: inputsabtvalue,
              RegDate: inputDateFacvalue,
              ReqDate: inputDateNoskhevalue,              
              NationalCode: inputCodeMelivalue,
              DocID: inputCodeNezamvalue,
              idNoskhe : idNoskhe,
              trackingcode : inputsabtvalue,
              Radifs: data
            };
            console.log(esata);
            const kalaResult = await getKalaInfo(ConfigConnection,esata);
            // نمایش مدال اصلی نسخه
            const versionData = {
              ReqNum: inputsabtvalue,
              bimarname: inputNamebimarvalue,
              NationalCode: inputCodeMelivalue,
              NameDrAria: doctorName,
              Takhasos: takhasosName,
              NezamDr : inputCodeNezamvalue,
              datefac : inputDateFacvalue,
              DateNoskhe :inputDateNoskhevalue,
              codetakh : codetakhsend,
              codetakhsend2 : codetakhsend2,
              trackingCode : trackingcode,
              isManfi :isManfi,
              CoName : CoName,
              id : id,
              Lname : Lname,
              Hname : Hname,
              Server : ConfigConnection.Server,
              DataBase : ConfigConnection.DataBase,
              username : ConfigConnection.username,
              pass : ConfigConnection.pass,
              APIURL : ConfigConnection.API_URL,
              Radifs: kalaResult.data||[]
            };
            showMainModal(versionData);
}


