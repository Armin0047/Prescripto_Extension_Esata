// modules/api.js

const API_BASE = "http://localhost:802/api/Home";

/**
 * ارسال درخواست GET برای بررسی وجود نسخه
 * @param {string} trackingCode
 * @param {string} nationalCode
 * @param {string} dateFac
 * @returns {Promise<Object>}
 */
export async function checkNoskheExist(ConfigConnection,codepigiri, nationalCode, dateFac) {
  const url = `${ConfigConnection.API_URL}api/esata/GetExsitsNoskhe?codepigiri=${codepigiri}&ShDaftarcheh=${nationalCode}&DateFac=${dateFac}`;
  const response = await fetch(url, {
      method: 'GET',
      headers: {
        'X-Db-Server': ConfigConnection.Server ,
        'X-Db-Name': ConfigConnection.DataBase,
        'X-Db-User': ConfigConnection.username,
        'X-Db-Pass': ConfigConnection.pass
      }
    });
  if (!response.ok) throw new Error("ارتباط با API بررسی نسخه ناموفق بود");
  return await response.json();
}

/**
 * دریافت وضعیت موجودی منفی
 * @returns {Promise<Object>}
 */
export async function getMojodiSetting(ConfigConnection) {
  const url = `${ConfigConnection.API_URL}api/Pharmcy/GetSettingMojodi`;
  const response = await fetch(url, {
      method: 'GET',
      headers: {
        'X-Db-Server': ConfigConnection.Server ,
        'X-Db-Name': ConfigConnection.DataBase,
        'X-Db-User': ConfigConnection.username,
        'X-Db-Pass': ConfigConnection.pass
      }
    });;
  if (!response.ok) throw new Error("ارتباط با API موجودی منفی ناموفق بود");
  return await response.json();
}

/**
 * دریافت اطلاعات پزشک
 * @param {string} docID
 * @returns {Promise<Object>}
 */
export async function fetchDoctorInfo(ConfigConnection,docID) {
  const url = `${ConfigConnection.API_URL}api/Pharmcy/GetNameDr?DocID=${docID}`;
  const response = await fetch(url, {
      method: 'GET',
      headers: {
        'X-Db-Server': ConfigConnection.Server ,
        'X-Db-Name': ConfigConnection.DataBase,
        'X-Db-User': ConfigConnection.username,
        'X-Db-Pass': ConfigConnection.pass
      }
    });
  if (!response.ok) throw new Error("ارتباط با API پزشک ناموفق بود");
  return await response.json();
}

/**
 * دریافت لیست سازمان‌ها
 * @returns {Promise<Object>}
 */
export async function getSazemanList(ConfigConnection) {
  const response = await fetch(`${ConfigConnection.API_URL}api/esata/GetSazeman`, {
      method: 'GET',
      headers: {
        'X-Db-Server': ConfigConnection.Server ,
        'X-Db-Name': ConfigConnection.DataBase,
        'X-Db-User': ConfigConnection.username,
        'X-Db-Pass': ConfigConnection.pass
      }
    });
  if (!response.ok) throw new Error("ارتباط با API سازمان‌ها ناموفق بود");
  return await response.json();
}

/**
 * دریافت لیست تخصص‌ها برای تعریف پزشک
 * @returns {Promise<Object>}
 */
export async function getTakhasosList(ConfigConnection) {
  const response = await fetch(`${ConfigConnection.API_URL}api/Pharmcy/GetTakhasos`, {
      method: 'GET',
      headers: {
        'X-Db-Server': ConfigConnection.Server ,
        'X-Db-Name': ConfigConnection.DataBase,
        'X-Db-User': ConfigConnection.username,
        'X-Db-Pass': ConfigConnection.pass
      }
    });
  if (!response.ok) throw new Error("ارتباط با API تخصص‌ها ناموفق بود");
  return await response.json();
}

/**
 * ثبت پزشک جدید
 * @param {string} codeDr
 * @param {string} nameDr
 * @param {string} codeTakh
 * @returns {Promise<Object>}
 */
export async function insertDoctor(ConfigConnection,codeDr, nameDr, codeTakh) {
  const url = `${ConfigConnection.API_URL}api/Pharmcy/InsertDr?Codedr=${codeDr}&NameDr=${nameDr}&codetakh=${codeTakh}`;
  const response = await fetch(url, {
      method: 'GET',
      headers: {
        'X-Db-Server': ConfigConnection.Server ,
        'X-Db-Name': ConfigConnection.DataBase,
        'X-Db-User': ConfigConnection.username,
        'X-Db-Pass': ConfigConnection.pass
      }
    });
  if (!response.ok) throw new Error("ثبت پزشک در API ناموفق بود");
  return await response.json();
}

/**
 * دریافت اطلاعات کالاها بر اساس ردیف نسخه
 * @param {Object} factorData - شامل اطلاعات نسخه و ردیف‌ها
 * @returns {Promise<Object>}
 */
export async function getKalaInfo(ConfigConnection,factorData) {
  const response = await fetch(`${ConfigConnection.API_URL}api/esata/SelectKala`, {
    method: "POST",
     headers: {
        'X-Db-Server': ConfigConnection.Server ,
        'X-Db-Name': ConfigConnection.DataBase,
        'X-Db-User': ConfigConnection.username,
        'X-Db-Pass': ConfigConnection.pass,
        "Content-Type": "application/json" 
      },
    body: JSON.stringify(factorData)
  });
  if (!response.ok) throw new Error("دریافت کالاها از API ناموفق بود");
  return await response.json();
}

/**
 * دریافت کالاهای قابل فروش با جستجو و صفحه‌بندی
 * @param {string} codesazeman
 * @param {number} page
 * @param {number} size
 * @param {string} search
 * @returns {Promise<Object>}
 */
export async function fetchProducts(ConfigConnection,codesazeman, page = 1, size = 50, search = '') {
  const url = `${ConfigConnection.API_URL}api/Pharmcy/GetProducts?Codesazeman=${codesazeman}&page=${page}&size=${size}&search=${encodeURIComponent(search)}`;
  const response = await fetch(url, {
          method: 'GET',
          headers: {
          'X-Db-Server': ConfigConnection.Server ,
          'X-Db-Name': ConfigConnection.DataBase,
          'X-Db-User': ConfigConnection.username,
          'X-Db-Pass': ConfigConnection.pass,      
          }
      });
  if (!response.ok) throw new Error("دریافت محصولات از API ناموفق بود");
  return await response.json();
}

/**
 * ثبت نسخه در نرم‌افزار آریا
 * @param {Object} payload - اطلاعات نسخه و کالاها
 * @returns {Promise<Object>}
 */
export async function insertFactor(ConfigConnection,payload) {
  const response = await fetch(`${ConfigConnection.API_URL}api/esata/InsertFactor`, {
    method: "POST",
    headers: { 
          'X-Db-Server': ConfigConnection.Server ,
          'X-Db-Name': ConfigConnection.DataBase,
          'X-Db-User': ConfigConnection.username,
          'X-Db-Pass': ConfigConnection.pass,
          "Content-Type": "application/json" },
    body: JSON.stringify(payload)
  });
  //if (!response.ok) throw new Error("ثبت نسخه در API ناموفق بود");
  return await response.json();
}

/**
 * بروزرسانی پیش‌فرض کالای یک ژنریک
 * @param {string} oldCode
 * @param {string} newCode
 * @param {string} gencode
 * * @returns {Promise<Object>}
 */
export async function updateDefaultKala(ConfigConnection,oldCode, newCode, erxCode) {
  const url = `${ConfigConnection.API_URL}api/esata/UpdateKala?codeKala=${oldCode}&CodeKalaNew=${newCode}&erxCode=${encodeURIComponent(erxCode)}`;
  const response = await fetch(url, {
          method: 'GET',
          headers: {
          'X-Db-Server': ConfigConnection.Server ,
          'X-Db-Name': ConfigConnection.DataBase,
          'X-Db-User': ConfigConnection.username,
          'X-Db-Pass': ConfigConnection.pass,      
          }
      });
  if (!response.ok) throw new Error("ثبت کالای پیش‌فرض ناموفق بود");
  return await response.json();
}


/**
 * بررسی صحت اتصالات به سرور
 * 
 * 
 */
export async function CheckConnectionApi(ConfigConnection) {
  try {
    const response = await fetch( `${ConfigConnection.API_URL}api/Pharmcy/GetName`, {
      method: 'GET',
      headers: {
        'X-Db-Server': ConfigConnection.Server ,
        'X-Db-Name': ConfigConnection.DataBase,
        'X-Db-User': ConfigConnection.username,
        'X-Db-Pass': ConfigConnection.pass
      }
    });

    const result = await response.json();

    if (result.success) {
      return await result;
    } else {
      return await result;
      //console.error('⚠️ Server Error:', result.error);
    }

  } catch (err) {
    //console.error('❌ Network or parsing error:', err.message);
    return await new Error('❌ Network or parsing error:', err.message);
    //console.error('❌ Network or parsing error:', err.message);
  }
}
