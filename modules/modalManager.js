// modules/modalManager.js
import { loadBootstrapOnce } from './bootstrap.js';
import { MojodiManfi, PriceManfi,ToRial } from '../modules/utils.js';
import { getSazemanList ,insertFactor} from '../modules/api.js';
import { showDoctorModal } from '../modules/doctorManager.js';
import { showProductModal } from '../modules/productManager.js';

let Sazemaninfo=[];
let ConfigConnection=[];
  let jnoskhe = 0;
  let jbimar = 0;
  let jsazeman = 0;
/**
 * نمایش مدال اصلی نسخه با اطلاعات دریافتی
 * @param {Object} versionData - اطلاعات نسخه شامل بیمار، پزشک، سازمان و ردیف‌ها
 */
export function showMainModal(versionData) {
  loadBootstrapOnce();

            const fbutton = document.getElementById('floating-button');
            fbutton.disabled = true;    

  ConfigConnection= {
                        Server : versionData.Server,
                        DataBase : versionData.DataBase,
                        username : versionData.username,
                        pass : versionData.pass,
                        API_URL : versionData.APIURL,
                    }

  const overlay = document.createElement("div");
  overlay.id = "mainModalOverlay";
  overlay.style = `
                position:fixed;
                top:0; left:0;
                width:100%; height:100vh;
                background:rgba(0, 0, 0, 0.6);
                backdrop-filter:blur(4px);
                z-index:9998;`;

  const modal = document.createElement("div");
  modal.id = "mainModalBox";
  modal.style = `
            position: fixed;
            top: 2%;
            left: 50%;
            transform: translateX(-50%);
            max-height: 95vh; /* محدود کردن ارتفاع مدال */
            overflow-y: auto; /* فعال‌سازی اسکرول داخل مدال */
            width: 95vw;
            background: linear-gradient(135deg, #ffffff, #f2f2f2);
            padding: 30px;
            border-radius: 12px;
            box-shadow: 0 20px 40px rgba(0,0,0,0.3);
            z-index: 9999;
            font-family: 'Vazirmatn', sans-serif;
            `;

  const closeBtn = document.createElement("button");
  closeBtn.innerText = "❌";
  closeBtn.setAttribute('id','closeBtnManager');
  closeBtn.classList.add("btn", "btn-sm", "btn-light");
  closeBtn.style = `position:absolute;
            top:15px; right:15px;
            background:#eee;
            border-radius:20%;
            width:32px;
            display:flex; align-items:center; justify-content:center;
            font-size:18px;
            cursor:pointer;
            transition:background 0.3s;`;
  closeBtn.addEventListener("click", () => {
    fbutton.disabled = false; 
    overlay.remove();
    modal.remove();
  });

  const content = document.createElement("div");
  content.innerHTML = buildModalHTML(versionData);

  modal.appendChild(closeBtn);
  modal.appendChild(content);
  document.body.appendChild(overlay);
  document.body.appendChild(modal);

      
   const tbody = document.getElementById('RdfKala');
        tbody.innerHTML = '';
        versionData.Radifs.forEach((datas,index) => {
        const tr = document.createElement('tr');
      
        tr.innerHTML = `
          <td id="datasorgShare${index}" class="dirrtl">${datas.orgShare}</td>
          <td id="dataspaymentByPatient${index}">${datas.paymentByPatient === '' ? 0 : ToRial(datas.paymentByPatient)}</td>
          <td id="dataspaymentByOrg${index}">${datas.paymentByOrg === '' ? 0 : ToRial(datas.paymentByOrg)}</td>
          <td id="datastotalAmount${index}">${datas.totalAmount === '' ? 0 : ToRial(datas.totalAmount)}</td>
          <td id="dataspricebimeh${index}">${ToRial(datas.priceBimeh)}</td>
          <td id="datasprice${index}">${ToRial(datas.price)}</td>
          <td id="datastedUsage${index}">${datas.tedUsage}</td>
          <td id="datadrugName${index}">${datas.drugName}</td>
          <td id="dataserxcode${index}">${datas.erxCode}</td>
          <td id="datasgencode${index}">${datas.gencode}</td>
          <td id="datastedUsage${index}" class="widthCell"><input type="number" id="tdbtnted${index}" class="widthCell" value="${datas.tedUsage}"/></td>
          <td id="datasmojodiAria${index}">${datas.mojodiAria}</td>
          <td id="dataspriceAria${index}">${datas.priceAria}</td>
          <td id="datasnameAria${index}">${datas.nameAria}</td>
          <td id="datasgencodeAria${index}">${datas.gencodeAria}</td>
          <td id="datascodeKalaAria${index}">${datas.codeKalaAria}</td>
          <td id="datascodeKalaAria${index}"><button id="btnAddKala${index}" type="button" style="color:white" class="btn btn-info widthbtn">ویرایش</button></td>
          `          
          tbody.appendChild(tr);
            jnoskhe += parseFloat(datas.totalAmount === '' ? 0 : datas.totalAmount) ;
            jbimar += parseFloat(datas.paymentByPatient === '' ? 0 : datas.paymentByPatient) ;
            jsazeman += parseFloat(datas.paymentByOrg === '' ? 0 : datas.paymentByOrg);

          const trmojodi = document.getElementById('datasmojodiAria'+index);
          trmojodi.style.color=  MojodiManfi(datas.tedUsage.replace(/,/g, '') , datas.mojodiAria , versionData.isManfi) ? "rgb(250, 5, 5)" : "rgb(68, 68, 242)";

          const priceAria = document.getElementById(`dataspriceAria${index}`);
          const priceCalc = parseFloat(datas.tedUsage) * parseInt(datas.priceAria);
          const sysTotal = parseFloat(datas.totalAmount.replace(/,/g, ''));
          priceAria.style.background = PriceManfi(sysTotal, priceCalc) ? '#f0f06c' : 'transparent';

          const ctrltedaria = document.getElementById('tdbtnted'+index);
                                                            ctrltedaria.addEventListener("blur", function() {
                                                                if(ctrltedaria.value==='')
                                                                    ctrltedaria.value = datas.tedUsage;
                                                            });

          const button = document.getElementById('btnAddKala'+index);
          if (button) {
              button.addEventListener('click', function () {
                       const selectedIndex=document.getElementById('ListSazeman').selectedIndex;
                       const selectedOption = document.getElementById('ListSazeman').options[selectedIndex];
                      showProductModal(ConfigConnection,datas.gencode,datas.drugName,selectedOption.value,index,versionData.isManfi,datas.erxCode);                  
              });
          }
          else{
              console.log('دکمه پیدا نشد');
          }                                                    



          });


          const jjnoskhe = document.getElementById("jamkolnoskhe");
          jjnoskhe.innerHTML = ToRial(jnoskhe) ;
          const jjbimar = document.getElementById("hedersahmbimar");
          jjbimar.innerHTML = ToRial(jbimar) ;
          const jjsazeman = document.getElementById("hedersahmsazeman");
          jjsazeman.innerHTML = ToRial(jsazeman) ;

  getSazeman(ConfigConnection);
   document.getElementById('InsertNoskheInAria').addEventListener('click', function (){
        const docname = document.getElementById("lblNameDrAria");
        if(docname.innerHTML === '-' || !docname.innerHTML)
                            alert("❌ ابتدا پزشک را تعریف کنید ❌");
        else
                  InsertNoskhe(ConfigConnection,versionData);
   });

  document.getElementById('btnInserDr').addEventListener('click', function () {
                        var lblNameDrAria =  document.getElementById("lblNameDrAria").innerText;
                            if(lblNameDrAria === '-')
                            {
                                
                                showDoctorModal(ConfigConnection,versionData.NezamDr);
                            }  
                        });   
          
}


async function getSazeman(ConfigConnection){
      // لیست سازمان‌ها برای نمایش در مدال
      const getsazeman = await getSazemanList(ConfigConnection); // می‌تونه در مدال فراخوانی شود
       let LSazeman=[];
                                                getsazeman.data.forEach(datas=>{
                                                            LSazeman= {
                                                                Codesazeman : datas.codeSazeman,
                                                                NameSazeman : datas.nameSazeman
                                                            }
                                                            Sazemaninfo.push(LSazeman);
                                        });                                                                                           
                                        Sazemaninfo.forEach(item=>{
                                                    const selectElement  = document.getElementById('ListSazeman');
                                                    const newOption = document.createElement('option');
                                                    newOption.textContent = item.NameSazeman; // The text displayed to the user
                                                    newOption.value = item.Codesazeman;
                                                    selectElement.appendChild(newOption);
                                        });  
}


/**
 * تولید HTML مدال با اطلاعات نسخه
 * @param {Object} data
 * @returns {string} - کد HTML مدال
 */
function buildModalHTML(data) {
            const fbutton = document.getElementById('floating-button');
            fbutton.textContent = '📤 ارسال اطلاعات به نرم‌افزار آریا';
            fbutton.style.backgroundColor =  '#4dc473';

 const content = document.createElement("div");
            let rowsHtml = "<div Class='table-responsive scroll-container'> <table style='width:100%;"
                                        +"border-collapse:separate; "
                                        +"border-spacing:0; "
                                        +"margin-bottom:20px; "
                                        +"background:#fafafa; "
                                        +"box-shadow:0 2px 6px rgba(0,0,0,0.05); "
                                        +"border-radius:8px; overflow:hidden;border: 1px solid black;border-collapse: collapse;' class='table table-striped table-bordered'>"
        + "<thead style='text-align: center;'><tr><th scope='col' colspan='10' style='background:rgb(209, 207, 207)'>اطلاعات سایت  نیروهای مسلح</th><th scope='col' colspan='7' style='background-color:rgb(213, 227, 242)'>اطلاعات نرم افزار آریا</th></tr><tr>"
        + "<th>دستور مصرف</th><th>سهم بیمار</th><th>سهم سازمان</th><th>مجموع</th><th>قیمت تعهد</th><th>قیمت واحد</th>"
        + "<th>تعداد</th><th>نام</th><th>ERXCode</th><th>کدژنریک / IRC</th>"
        + "<th class='widthCell'>تعداد تحویلی</th><th>موجودی</th><th>قیمت</th>"
        + "<th>نام</th><th>کدژنریک</th><th>کدکالا</th><th class='widthCell'>انتخاب</th></tr></thead><tbody id='RdfKala'>";
        rowsHtml += "</tbody></table></div>";

        return  `
        <div Class="form-group">
        <div style="text-align: center;">
        <h2>نرم افزار اتوماسیون داروخانه آریا</h2>
        </div>
        <div Class="form-control">
                            <table style="
                            width:100%;
                            top=10px;
                            border-collapse:separate;
                            border-spacing:0;
                            margin-bottom:20px;
                            background:#fafafa;
                            box-shadow:0 2px 6px rgba(0,0,0,0.05);
                            border-radius:8px;
                            overflow:hidden;" dir=\"rtl\">
                            <tbody id="tbodyFacheder">
                            <tr style="background:#05f7ab;">
                            <td colspan="2" style="padding:10px; font-weight:bold;">${data.CoName}</td>
                            <td style="padding:10px; font-weight:bold;">سرور :</td>
                            <td style="padding:10px; font-weight:bold;">${data.Hname}</td>
                            <td style="padding:10px; font-weight:bold;">کاربر :</td>
                            <td style="padding:10px; font-weight:bold;">${data.Lname}</td>
                            <td style="padding:10px; font-weight:bold;">فروش منفی :</td>
                            <td style="padding:10px; font-weight:bold;">${data.isManfi === 1 ?`مجاز`:`غیر مجاز`}</td>
                            </tr>
                            <tr>                           
                            <td style="padding:10px; font-weight:bold;">کدرهگیری تجویز :</td>
                            <td style="padding:10px;">${data.ReqNum}</td>                    
                            <td style="padding:10px; font-weight:bold;">کد ملی :</td>
                            <td style="padding:10px;">${data.NationalCode.replace('- کد ملی : ','')}</td>
                            <td style="padding:10px; font-weight:bold;">نظام پزشک :</td>
                            <td style="padding:10px;">${data.NezamDr}</td>
                            <td style="padding:10px; font-weight:bold;">مبلغ کل :</td>
                            <td style="padding:10px;" id="jamkolnoskhe">${data.jamkol}</td>
                            </tr>
                            <tr style="background:#f2f2f2;">
                            <td style="padding:10px; font-weight:bold;">تاریخ ثبت :</td>
                            <td style="padding:10px;" id="lbltdDateFac">${data.DateNoskhe.toString().substring(0,4)}/${data.DateNoskhe.toString().substring(4,6)}/${data.DateNoskhe.toString().substring(6,8)}</td>                    
                            <td style="padding:10px; font-weight:bold;">نام بیمار : </td>
                            <td style="padding:10px;"><input type="text" class="form-control" id="lblBimarName" Placeholder="نام بیمار را وارد کنید..." value="${data.bimarname.replace('- ','')}"></td>
                            <td style="padding:10px; font-weight:bold;">پزشک آریا :</td>
                            <td style="padding:10px;"><label id="lblNameDrAria">${data.NameDrAria}</label></td>
                            <td style="padding:10px; font-weight:bold;">سهم سازمان :</td>
                            <td style="padding:10px;" id="hedersahmsazeman">${data.Sahmsazemanvalue}</td>
                            </tr>
                            <tr>
                            <td style="padding:10px; font-weight:bold;">تاریخ نسخه :</td>
                            <td style="padding:10px;" id="lbltdDateNoskhe" >${data.DateNoskhe.toString().substring(0,4)}/${data.DateNoskhe.toString().substring(4,6)}/${data.DateNoskhe.toString().substring(6,8)}</td>                    
                            <td style="padding:10px; font-weight:bold;">موبایل :</td>
                            <td style="padding:10px;"><input type="text" class="form-control" id="lblMobileName" Placeholder="موبایل بیمار را وارد کنید..."></td>
                            <td style="padding:10px; font-weight:bold;">تخصص آریا :</td>
                            <td style="padding:10px;"><label id="lblTakhasosName">${data.Takhasos}</label></td>
                            <td style="padding:10px; font-weight:bold; color:red;">سهم بیمار :</td>
                            <td style="padding:10px; color:red;" id="hedersahmbimar">${data.SahmBimar}</td>
                            </tr>
                            </tr>
                            <tr style="background:#f2f2f2;">
                            <td style="padding:10px; font-weight:bold; color:red;">کدرهگیری ارائه :</td>
                            <td style="padding:10px; color:red;">${data.trackingCode}</td>                                        
                            <td style="padding:10px; font-weight:bold;">سازمان :</td>
                            <td style="padding:10px;"><select id="ListSazeman" name="ListSazeman" class="form-select"></select></td>
                            <td style="padding:10px; font-weight:bold;">تعریف پزشک :</td>
                            <td style="padding:10px;"><input id="btnInserDr" type="button" value="تعریف پزشک" class="btn btn-warning"></td>
                            <td style="padding:10px; font-weight:bold; color:red;"></td>
                            <td style="padding:10px; color:red;"></td>
                            </tr>
                        </tbody>
                        </table>
        </div>                
                        <h6 class="text-muted" dir=\"rtl\">ردیف‌ها:</h6>   
                         ${rowsHtml}                                  
                        
        </div>
        <footer>
        <div Class="form-control">
                        <div calss=""row>
                            <div dir=\"rtl\">
                            <label style="color:red;direction:rtl;">نکته : اگر جمع قیمت کالا انتخابی شما از جمع سایت نیروهای مسلح کمتر شود اطلاعات قیمت سایت  نیروهای مسلح برای آن ردیف لحاظ میگردد</label>
                            </div>
                            <div dir=\"rtl\">
                            <label style="color:red;direction:rtl;">نکته : اگر جمع قیمت کالا انتخابی شما از جمع سایت  نیروهای مسلح بیشتر شود اختلاف قیمت در اضافه مبلغ آن ردیف لحاظ میگردد</label>
                            </div>
                        </div>
                        <div class="main"> 
                            <hr />
                            <div class="row">                                
                                <div dir=\"rtl\" class="col-lg-9">                        
                                    <P style="font-size:0.9rem;"><span>شماره نسخه : </span><span id="sh_noskhe">0</span><span id="txtsh_noskhe"></span></P> 
                                    <P style="font-size:0.9rem;margin-top:-10px;"><span>مبلغ قابل پرداخت : </span><span id="jamkolpardakht">0</span><span>&nbsp&nbspريال&nbsp&nbsp</span></P>
                                </div>  
                                <div class="col-lg-3">         
                                    <input id="InsertNoskheInAria" type="submit" value="ثبت نسخه" Class="btn btn-success pull-left">  
                                </div>                              
                            </div> 
                        </div>
            </div>
                        
                        
        </footer>
        `;
 
}


async function InsertNoskhe(ConfigConnection,versionData){

   const InsertAria = document.getElementById('InsertNoskheInAria');
   const closeBtn = document.getElementById('closeBtnManager');
    InsertAria.disabled = true ;
    closeBtn.disabled = true;   

  let CheckMojodi = 1;
  let CheckKala = 1;
    const tb = document.getElementById('RdfKala');
    const rows = tb.querySelectorAll('tr');
    /**
     * اگر موجودی منفی غیرفعال بود چک کنیم کالایی با وضعیت منفی داخل لیست نباشد
     */

      
    rows.forEach((row,index)=>{
    const codeKalaAria = document.getElementById('datascodeKalaAria'+index);
        if( parseInt(codeKalaAria.innerHTML) === 0 || !codeKalaAria.innerText)
        {                         
          if( CheckKala === 1)
          {
              CheckKala = 0;                                                                           
          }
        }                                     
    });               
    
    if (parseInt(versionData.isManfi) !== 1 && parseInt(CheckKala) === 1)
    {
      rows.forEach((row,index)=>{
        const mojodis = document.getElementById('datasmojodiAria'+index);
        const tedAAria = document.getElementById('tdbtnted'+index);
            if( MojodiManfi( tedAAria.value , mojodis.innerText , versionData.isManfi ) )
            {                         
              if( CheckMojodi === 1)
              {
                  CheckMojodi = 0;                                                                           
              }
            }                                     
        });               
    }    
      
    if(parseInt(CheckMojodi) === 1 && parseInt(CheckKala) === 1)
    {
      const facradif = [];
      rows.forEach( (row,index) =>{
      const cells = row.querySelectorAll('td'); 
              const tedAAria = document.getElementById('tdbtnted'+index);                               
          facradif.push({
              orgShare: cells[0].innerText.trim(),
              paymentByPatient: cells[1].innerText.trim(),
              paymentByOrg: cells[2].innerText.trim(),
              totalAmount: cells[3].innerText.trim(),
              priceBimeh: cells[4].innerText.trim().toString().replace(/,/g,''),
              price: cells[5].innerText.trim().toString().replace(/,/g,''),
              tedUsage: tedAAria.value,
              PriceAria : cells[12].innerText.trim(),
              CodeKalaAria : cells[15].innerText.trim(),
          });
        });
      const datefac = document.getElementById('lbltdDateFac');
      const datenoskhe = document.getElementById('lbltdDateNoskhe');
      const mobile = document.getElementById('lblMobileName');
      const bimarname = document.getElementById('lblBimarName');
      const selectedIndex=document.getElementById('ListSazeman').selectedIndex;
      const selectedOption = document.getElementById('ListSazeman').options[selectedIndex];
                    
      const fachederInsert = {
      ReqNum : versionData.ReqNum.toString().trim(),
      RegDate : datefac.innerText.trim(),
      ReqDate : datenoskhe.innerText.trim(),
      TotalAmount : jnoskhe.toString(),
      PaymentByOrg : jsazeman.toString(),
      PaymentByPatient : jbimar.toString(),    
      NationalCode : versionData.NationalCode,
      DocID : versionData.NezamDr,
      codetakh : versionData.codetakh,
      codetakh2 : versionData.codetakhsend2,
      mobile : mobile.value,
      bimarname : bimarname.value,
      Codesazeman : selectedOption.value ,
      trackingcode : versionData.trackingCode.toString(),
      Radifs : facradif
      } 
      console.log(fachederInsert);
                          
            // ذخیره اطلاعات کالاها   
            const result = await insertFactor(ConfigConnection,fachederInsert)

            if(result.data.sh_noskhe > 0)
            {
                const jamkolpardakht=result.data.jamkolpardakht;
                const sh=document.getElementById('sh_noskhe');
                sh.innerHTML='&nbsp&nbsp'+ result.data.sh_noskhe +'&nbsp&nbsp';
                sh.style.background = "rgb(59, 150, 77)";
                const txt=document.getElementById('txtsh_noskhe');
                txt.innerHTML='&nbsp&nbsp&nbspثبت نسخه با موفقیت انجام شد&nbsp&nbsp&nbsp';
                txt.style.color = "rgb(59, 150, 77)";
                const jamkol=document.getElementById('jamkolpardakht');
                jamkol.innerHTML='&nbsp&nbsp'+ToRial(jamkolpardakht)+'&nbsp&nbsp';
                alert("✅ نسخه شما با موفقیت در نرم افزار ثبت شد ✅ \n شماره نسخه : "+ result.data.sh_noskhe + " \n مبلغ قابل پرداخت : " + ToRial(jamkolpardakht) + " ريال " );
                closeBtn.disabled = false;
                console.log("%c  developer by : %cdamavandiarmin@gmail.com  ",'color: red; font-weight: bold; background-color: #f5e8c4','color: green;background-color: #f5e8c4');
            }
            else
            {
                alert("⚠️ خطا ناشناخته : " + result.statusmessage);
                console.log("%c  developer by : %cdamavandiarmin@gmail.com  ",'color: red; font-weight: bold; background-color: #f5e8c4','color: green;background-color: #f5e8c4');
                 InsertAria.disabled = false ;  
                closeBtn.disabled = false;
            }                                
                            
    }
    else
    {
       if(parseInt(CheckKala) === 0)
      {
        alert("❌ برخی از اقلام هنوز  به کالا آریا متصل نشده اند ❌");
      }
      else if(parseInt(CheckMojodi) === 0)
      {
        alert("❌ موجودی برخی اقلام منفی میباشد ❌");
      }

        InsertAria.disabled = false ;  
        closeBtn.disabled = false;
    }      
}