
var naviman_version = "no-version";
if (typeof window.debugTimeStart === 'undefined') {
    window.debugTimeStart = performance.now();
}

// Khởi tạo object navihelper và navihelper.Env nếu chưa có
if (typeof navihelper === 'undefined') {
  navihelper = {};
};

if (typeof navihelper.Env === 'undefined') {
  navihelper.Env = {};
};

/**
 * Lấy thẻ <script> đang chạy uigen.js/uigen.min.js.
 * Ưu tiên document.currentScript, fallback nếu không tìm được:
 *  - Quét lùi từ cuối document các thẻ <script> có src chứa 'uigen.js' hoặc 'uigen.min.js'.
 * Trả về: DOM element script hoặc null nếu không tìm thấy.
 */
navihelper.Env.getUIGenScript = function() {
    try {
        if (document.currentScript && document.currentScript.src) {
            return document.currentScript;
        } else {
            // Tìm <script> có chứa tên file đúng dạng uigen.js hoặc uigen.min.js (dự phòng cho browser kém)
            const scripts = document.getElementsByTagName('script');
            for (let i = scripts.length - 1; i >= 0; i--) {
                const src = scripts[i].src || '';
                if (src.includes('uigen.js') || src.includes('uigen.min.js')) {
                    return scripts[i];
                }
            }
        }
    } catch (e) {
        console.warn('⚠️ Không xác định được uigenJs script (uigen.min.js):', e);
    }
    return null;
};

/**
 * Lấy src (url) của script uigen hiện tại. Trả về string hoặc null.
 */
navihelper.Env.getUIGenScriptUrl = function() {
    const scriptElem = this.getUIGenScript();
    if (scriptElem && scriptElem.src) {
        return scriptElem.src;
    }
    return null;
};

/**
 * Lấy attribute từ thẻ script uigen.js.
 * Nếu không có trả về giá trị mặc định.
 * @param {string} attr - tên thuộc tính cần lấy
 * @param {*} defaultValue - mặc định nếu không có attribute
 */
navihelper.Env.getAttribute = function(attr, defaultValue = null) {
    const scriptElem = this.getUIGenScript();
    if (scriptElem && scriptElem.getAttribute(attr) !== null) {
        return scriptElem.getAttribute(attr);
    }
    return defaultValue;
};

/**
 * Parse giá trị về boolean đúng chuẩn dựa theo string 'true'/'false'.
 * @param {*} val - giá trị truyền vào
 * @returns {boolean|*}
 */
navihelper.Env.parseBoolean = function(val) {
    if (typeof val === 'string') {
        if (val.trim().toLowerCase() === 'true') return true;
        if (val.trim().toLowerCase() === 'false') return false;
    }
    return val;
};



// var uigenJsScript = navihelper.Env.getUIGenScript();

// naviman_version khi dev sẽ là "no-version", _NAVIPLUS_VERSION = "DEV".
if( _NAVIPLUS_VERSION != 'DEV' ) // Định nghĩ trong start.js 
    naviman_version = _NAVIPLUS_VERSION;

/**********************************************************************************/
// Lấy các đường dẫn đến các CDN khác nhau. hiện tại sẽ quy hết về live.naviplus.app/live/{version}
/**********************************************************************************/
/* Fix shopifas today: 24/7 */
var naviplusAppUrl = 'https://dash.naviplus.app/naviplus/frontend/'; // Dùng cho DEV

/*** KO dùng */
var cdn_github = 'https://cdn.jsdelivr.net/gh/khoipn/naviplus-fe-live@main'; // Không dùng !!!!
var cdn_cloudflare = 'https://cdn.naviplus.app/naviplus/golive/live'; // Không dùng !!!!
/*** END KO dùng */


var cdn_golive_cloudflare_page = 'https://live-r2.naviplus.app/live'; // Dùng cho LIVE (Cloudflare Pages)

// Fallback CDN
if (typeof _isUseNaviCDNFallback !== 'undefined' && _isUseNaviCDNFallback === true) cdn_golive_cloudflare_page = 'https://flov.b-cdn.net/live';

var naviplusCss = navihelper.Env.getUIGenScriptUrl().replace('.js', '.css'); // cdn_golive_cloudflare_page + '/'+ naviman_version +'/uigen.min.css';
var UIGEN_ENV = "DEPLOYMENT";
/**********************************************************************************/


/**********************************************************************************/
// Lấy lại đường dẫn cho môi trường DEV 
// Đoạn này sẽ được xoá khi chạy qua golive-live.php nhưng thực ra ko cần thiết lắm
/**********************************************************************************/
if ( _NAVIPLUS_VERSION == 'DEV' ) {
    
}
/**********************************************************************************/



var naviplusCDNJson = "https://cdn.naviplus.app/naviplus/data/json";
if (typeof _isUseNaviCDNFallback !== 'undefined' && _isUseNaviCDNFallback === true)  naviplusCDNJson = "https://flov.b-cdn.net/data/json";

var naviplusCDNFiles = "https://cdn.naviplus.app/naviplus/data/";
var naviplusCacheMiniseconds = 3600000; // 10 minutes

// Kiểm tra và định nghĩa namespace navihelper nếu chưa tồn tại
if (typeof navihelper === 'undefined') {
    navihelper = {};
};

// Kiểm tra và định nghĩa class WindowVar trong namespace navihelper nếu chưa tồn tại
if (typeof navihelper.WindowVar === 'undefined') {
    navihelper.WindowVar = class {
        constructor() {
            // Khởi tạo không gian lưu trữ nếu chưa tồn tại
            this.naviplusVars = this.naviplusVars || {};
        }

        static getInstance() {
            // Nếu instance đã tồn tại, trả về nó
            if (!navihelper.WindowVar.instance) {
                navihelper.WindowVar.instance = new navihelper.WindowVar();
            }
            return navihelper.WindowVar.instance;
        }

        set(varName, value) {
            this.naviplusVars[varName] = value;
        }

        get(varName) {
            return this.naviplusVars[varName] !== undefined ? this.naviplusVars[varName] : null;
        }

        isExisted(varName) {
            return this.naviplusVars[varName] !== undefined;
        }

        delete(varName) {
            if (this.isExisted(varName)) {
                delete this.naviplusVars[varName];
                return true;
            }
            return false;
        }
    }
};

// Kiểm tra và khởi tạo biến windowVar trong namespace navihelper nếu chưa tồn tại
if (typeof navihelper.windowVar === 'undefined') {
    navihelper.windowVar = navihelper.WindowVar.getInstance();
};

navihelper.standardizeDomain = function(domain, token) {    
    if( token == "" )
        return domain.replace(".myshopify.com", '');

    return token + "_" + domain.replace(".myshopify.com", '');
};

/**
 * Cache promise đang fetch theo api_shopinfo_url để coalesce request song song.
 */
navihelper._shopInfoPromiseInFlight = navihelper._shopInfoPromiseInFlight || {};

/**
 * Lấy thông tin shopinfo từ CDN, cache vào biến toàn cục để tối ưu request:
 * - Nếu đã có dữ liệu shopinfo (đã fetch trước), trả về luôn (Promise resolved).
 * - Nếu đang có promise fetch shopinfo, dùng lại promise này (giảm duplicate request).
 * - Nếu chưa có thông tin:
 *      + Gửi request GET tới file .info.json của shop trên CDN.
 *      + Cache promise này, đảm bảo chỉ request 1 lần khi có nhiều call đồng thời.
 *      + Khi thành công thì cache data, gặp lỗi trả ra lỗi cho xử lý ngoài.
 *
 * @param {string} shop - Tên shop cần lấy shopinfo
 * @returns {Promise<object>} Promise trả object shopinfo lấy từ CDN
 */
navihelper.getShopInfo = async function(shop, token) {     

    // Bước 1: Kiểm tra trong biến window (Chỉ sinh ra 1 lần duy nhất)
    if (navihelper.windowVar.isExisted('shopinfo')) 
        return navihelper.windowVar.get('shopinfo');    

    var api_shopinfo_url = naviplusCDNJson + "/" + navihelper.standardizeDomain(shop, token) + ".info.json";            

    // Bước 2: Kiểm tra cache sessionStorage (15s TTL) với key là api_shopinfo_url
    var shopinfo = window.navisession.get(api_shopinfo_url);
    if (shopinfo) {
        navihelper.reportSteps("---> Yead!! Lấy shopinfo từ sessionStorage với update_version: " + shopinfo["update_version"]);
        navihelper.windowVar.set('shopinfo', shopinfo);
        return shopinfo;
    }        

    // Bước 2.5: Đang có fetch song song → dùng lại promise, tránh gọi info.json nhiều lần
    var inFlight = navihelper._shopInfoPromiseInFlight[api_shopinfo_url];
    if (inFlight) {
        return inFlight;
    }

    // Bước 3: Fetch shopinfo từ CDN (No cache)
    var fetchPromise = (async function() {
        var shopinfo;
        try {
            shopinfo = await fetch(api_shopinfo_url + "?v=" + Math.random()).then((response) => response.json());
        } catch (error) {
            navidebug.error("Error fetching shop info:", error);
            throw error;
        } finally {
            delete navihelper._shopInfoPromiseInFlight[api_shopinfo_url];
        }
        navihelper.reportSteps("---> WTF! Lấy shopinfo bằng fetch chậm: (NO-CACHE)" + api_shopinfo_url);

        // Bước 4: Kiểm tra update_version có thay đổi không → nếu có thì xoá hết cache IndexDB
        var lastVersion = sessionStorage.getItem('navi_last_update_version');
        if (lastVersion !== null && String(shopinfo["update_version"]) !== String(lastVersion)) {
            await window.naviindexdb.clearByPrefix('navi_idb_');
        }
        sessionStorage.setItem('navi_last_update_version', String(shopinfo["update_version"]));

        // Bước 5: Lưu shopinfo vào sessionStorage (15s TTL)
        window.navisession.set(api_shopinfo_url, shopinfo);

        // Bước 6: Truyền vào biến windowVar để dùng lại
        navihelper.windowVar.set('shopinfo', shopinfo);    
    
        return shopinfo;
    })();

    navihelper._shopInfoPromiseInFlight[api_shopinfo_url] = fetchPromise;
    return fetchPromise;
};

/**
 * Duyệt qua toàn bộ cấu trúc menu (kể cả children) để kiểm tra
 * xem có item nào bật badge giỏ hàng (`badgeiscart === 1`) hay không.
 * @param {Array} arr - Mảng menu hoặc mảng children
 * @returns {boolean} - true nếu có ít nhất một item là giỏ hàng
 */
navihelper.containsBadgeIsCart = function(arr) {
    for (let i = 0; i < arr.length; i++) {
        const item = arr[i];
        if( navihelper.isHadValue( item["badgeiscart"] ) )
            if( item["badgeiscart"] == 1 || item["badgeiscart"] == "1" ) {
                return true;

            }

        if (Array.isArray(item["children"]))
            if (item["children"].length > 0) {
                if (navihelper.containsBadgeIsCart(item["children"])) {
                    return true;
                }
            }
    }

    return false;
};

/**
 * Kiểm tra biến có "đáng giá" hay không:
 * - undefined hoặc chuỗi rỗng sau khi trim sẽ coi là không có giá trị.
 * @param {*} checkVar
 * @returns {boolean}
 */
navihelper.isHadValue = function(checkVar) {
    if (typeof (checkVar) == 'undefined')
        return false;

    if (checkVar.toString().trim() == "")
        return false;

    return true;
};

/**
 * Quyết định có cần lấy/cart count hay không cho cấu hình hiện tại.
 * - Nếu `multisite` khác rỗng → luôn trả về false.
 * - Nếu không phải multisite thì chỉ bật khi đang chạy trong Shopify
 *   và trong dragdrop có item gắn badge giỏ hàng.
 * @param {Array} data - Dữ liệu publish (chứa dragdrop của từng naviItem)
 * @param {Object} section_setting - Cấu hình section hiện tại
 * @returns {boolean}
 */
navihelper.isNeedCartCount = function( data, section_setting ) {

    // 1. Nếu không phải shopify thì không cần lấy/cart count
    if( section_setting['env'] != "shopify" )
        return false;
    
    // 2. Là shopify + multisite Lỗi thời: Bỏ dần
    if( section_setting['multisite'] != "" )
        return false;

    // 3. Là Shopify thực sự thì tính tiếp ----<<
    if( section_setting['multisite'] == "" ) {
        
        // Kiểm tra thêm 1 lần nữa
        if( window.Shopify ) {
            /* trường hợp 1: Là trong 1 site Shopify */
            navidebug.log( window.Shopify["shop"] );
        }
        else {
            // Ko chịu ghi rõ multisite trong phần nhúng vào website ngoài Shopify
            return false;
        }
    }

    var isNeed = false;
    data.forEach((naviItem) => {
        if( navihelper.containsBadgeIsCart( naviItem["data"]["dragdrop"] ) ) {
            isNeed = true;
            return;
        }
    });
    return isNeed;
    // ------------------------------------------->>
};

/**
 * Chèn file CSS vào `<head>` nếu chưa tồn tại.
 * Hữu ích để load thêm CSS động theo từng case.
 * @param {string} href - Đường dẫn file CSS
 */
navihelper.linkCSSToHead = function(href) {
    // Kiểm tra xem file CSS đã tồn tại trong <head> chưa
    if (!document.querySelector(`link[href="${href}"]`)) {
        const link = document.createElement('link');
        link.href = href;
        link.type = "text/css";
        link.rel = 'stylesheet';

        // Khi file CSS được tải xong, log ra thông báo (tùy chọn)
        link.onload = function () {
            // navidebug.log(`CSS file ${href} loaded successfully.`);
        };

        // Thêm phần tử <link> vào phần <head>
        document.head.appendChild(link);
    } else {
        // navidebug.log(`CSS file ${href} is already linked on this page.`);
    }
};



/**
 * Xoá mọi item trong localStorage có tên chứa 'naviplus'.
 * Dùng cho mục đích reset, xoá cache cục bộ khi cần thiết.
 */
navihelper.clearNaviSectionStorage = function() {
    if( !naviman.isLocalStorageSupported() )
        return;
    for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);

        if (key.includes('naviplus')) {
            localStorage.removeItem(key);
            i--;
        }
    }
};

/**
 * Chờ phần tử với selector xuất hiện (ready), sau đó gọi callback.
 *
 * Các bước thực hiện:
 * 1. Cache trạng thái đã "ready" thông qua window._naviplusReadyElements để tránh kiểm tra lại nhiều lần.
 * 2. Nếu selector đã ready trước đó, gọi callback luôn và return.
 * 3. Nếu phần tử đã có sẵn trong DOM, cache lại, gọi callback và return.
 * 4. Nếu phần tử chưa xuất hiện:
 *    - Tạo MutationObserver theo dõi sự thay đổi trong DOM (body hoặc documentElement).
 *    - Khi phát hiện phần tử xuất hiện, disconnect observer, cache lại và gọi callback.
 * 5. Nếu chưa có DOM (body/documentElement), chờ 'DOMContentLoaded' để thử lại (chỉ 1 lần).
 */
navihelper.waitForElementReady = function(selector, callback) {
    // Bước 1: Sử dụng cache để biết selector đã sẵn sàng trước đó chưa
    window._naviplusReadyElements = window._naviplusReadyElements || {};
    if (window._naviplusReadyElements[selector] === true) {
        callback(document.querySelector(selector));
        return;
    }

    // Bước 3: Kiểm tra xem phần tử đã tồn tại trong DOM chưa
    const el = document.querySelector(selector);
    if (el) {
        window._naviplusReadyElements[selector] = true;
        callback(el);
        return;
    }

    // Bước 4: Nếu chưa có, lắng nghe thay đổi DOM để phát hiện khi nào xuất hiện
    const observer = new MutationObserver(() => {
        const el = document.querySelector(selector);
        if (el) {
            observer.disconnect();
            window._naviplusReadyElements[selector] = true;
            callback(el);
        }
    });

    // Bước 4.1: Xác định node gốc để quan sát (body hoặc documentElement)
    const targetNode = document.body || document.documentElement;
    if (!targetNode) {
        // Bước 5: Nếu DOM chưa sẵn sàng, chờ 'DOMContentLoaded' rồi thử lại
        document.addEventListener('DOMContentLoaded', () => navihelper.waitForElementReady(selector, callback), { once: true });
        return;
    }
    observer.observe(targetNode, { childList: true, subtree: true });
};

navihelper.reportSteps = function(message) {
    navidebug.log(
        "%c     " + message,
        "color: purple;font-family: monospace; font-size: 11px;"
    );
};

/******************************************************************/

if (typeof window.NaviIndexDB === 'undefined') {
    class NaviIndexDB {
        constructor(dbName = 'navi_indexdb', ttlSeconds = 30) {
            this.dbName = dbName;
            this.ttl = ttlSeconds * 1000;
            this.prefix = 'navi_idb_';
            this.storeName = 'kv';
            this._db = null;
        }

        _fullKey(key) {
            return this.prefix + key;
        }

        async _openDB() {
            if (this._db) return this._db;
            return new Promise((resolve, reject) => {
                const req = indexedDB.open(this.dbName, 1);
                req.onerror = () => reject(req.error);
                req.onsuccess = () => {
                    this._db = req.result;
                    resolve(this._db);
                };
                req.onupgradeneeded = (e) => {
                    if (!e.target.result.objectStoreNames.contains(this.storeName)) {
                        e.target.result.createObjectStore(this.storeName);
                    }
                };
            });
        }

        async set(key, value) {
            const db = await this._openDB();
            const data = {
                value: value,
                expires: Date.now() + this.ttl
            };
            return new Promise((resolve, reject) => {
                const tx = db.transaction(this.storeName, 'readwrite');
                const store = tx.objectStore(this.storeName);
                const req = store.put(data, this._fullKey(key));
                req.onsuccess = () => resolve();
                req.onerror = () => reject(req.error);
            });
        }

        async get(key) {
            const db = await this._openDB();
            return new Promise((resolve, reject) => {
                const tx = db.transaction(this.storeName, 'readonly');
                const store = tx.objectStore(this.storeName);
                const req = store.get(this._fullKey(key));
                req.onsuccess = () => {
                    const data = req.result;
                    if (!data) return resolve(null);

                    try {
                        if (Date.now() > data.expires) {
                            this.delete(key).then(() => resolve(null));
                            return;
                        }
                        resolve(data.value);
                    } catch (e) {
                        this.delete(key).then(() => resolve(null));
                    }
                };
                req.onerror = () => reject(req.error);
            });
        }

        async exists(key) {
            const db = await this._openDB();
            return new Promise((resolve, reject) => {
                const tx = db.transaction(this.storeName, 'readonly');
                const store = tx.objectStore(this.storeName);
                const req = store.get(this._fullKey(key));
                req.onsuccess = () => {
                    const data = req.result;
                    if (!data) return resolve(false);

                    try {
                        if (Date.now() > data.expires) {
                            this.delete(key).then(() => resolve(false));
                            return;
                        }
                        resolve(true);
                    } catch (e) {
                        this.delete(key).then(() => resolve(false));
                    }
                };
                req.onerror = () => reject(req.error);
            });
        }

        async delete(key) {
            const db = await this._openDB();
            return new Promise((resolve, reject) => {
                const tx = db.transaction(this.storeName, 'readwrite');
                const store = tx.objectStore(this.storeName);
                const req = store.delete(this._fullKey(key));
                req.onsuccess = () => resolve();
                req.onerror = () => reject(req.error);
            });
        }

        async clearByPrefix(prefix) {
            const db = await this._openDB();
            return new Promise((resolve, reject) => {
                const tx = db.transaction(this.storeName, 'readwrite');
                const store = tx.objectStore(this.storeName);
                const req = store.openCursor();

                req.onsuccess = (e) => {
                    const cursor = e.target.result;
                    if (!cursor) {
                        resolve();
                        return;
                    }
                    const key = cursor.key;
                    if (typeof key === 'string' && key.startsWith(prefix)) {
                        cursor.delete();
                    }
                    cursor.continue();
                };
                req.onerror = () => reject(req.error);
            });
        }

        async clearExpired() {
            const db = await this._openDB();
            const now = Date.now();
            return new Promise((resolve, reject) => {
                const tx = db.transaction(this.storeName, 'readwrite');
                const store = tx.objectStore(this.storeName);
                const req = store.openCursor();

                req.onsuccess = (e) => {
                    const cursor = e.target.result;
                    if (!cursor) {
                        resolve();
                        return;
                    }
                    const key = cursor.key;
                    if (typeof key === 'string' && key.startsWith(this.prefix)) {
                        try {
                            if (now > cursor.value.expires) {
                                cursor.delete();
                            }
                        } catch {
                            cursor.delete();
                        }
                    }
                    cursor.continue();
                };
                req.onerror = () => reject(req.error);
            });
        }
    }

    window.NaviIndexDB = NaviIndexDB;
}

window.naviindexdb = window.naviindexdb || new window.NaviIndexDB('navi_indexdb', 60);
if (typeof window.NaviSessionStorage === 'undefined') {
    class NaviSessionStorage {
        constructor(ttlSeconds = 30) {
            this.ttl = ttlSeconds * 1000; // đổi sang ms
            this.prefix = "navi_ss_";     // tránh đụng key khác
        }

    _fullKey(key) {
        return this.prefix + key;
    }

    set(key, value) {
        const data = {
            value: value,
            expires: Date.now() + this.ttl
        };
        sessionStorage.setItem(this._fullKey(key), JSON.stringify(data));
    }

    get(key) {
        const raw = sessionStorage.getItem(this._fullKey(key));
        if (!raw) return null;

        try {
            const data = JSON.parse(raw);

            // Nếu hết hạn
            if (Date.now() > data.expires) {
                sessionStorage.removeItem(this._fullKey(key));
                return null;
            }

            return data.value;

        } catch (e) {
            sessionStorage.removeItem(this._fullKey(key));
            return null;
        }
    }

    exists(key) {
        const raw = sessionStorage.getItem(this._fullKey(key));
        if (!raw) return false;

        try {
            const data = JSON.parse(raw);

            // Hết hạn → không tồn tại
            if (Date.now() > data.expires) {
                sessionStorage.removeItem(this._fullKey(key));
                return false;
            }

            return true; // tồn tại & còn hạn

        } catch (e) {
            sessionStorage.removeItem(this._fullKey(key));
            return false;
        }
    }

    delete(key) {
        sessionStorage.removeItem(this._fullKey(key));
    }

    clearExpired() {
        const now = Date.now();

        Object.keys(sessionStorage).forEach(k => {
            if (k.startsWith(this.prefix)) {
                try {
                    const data = JSON.parse(sessionStorage.getItem(k));
                    if (now > data.expires) {
                        sessionStorage.removeItem(k);
                    }
                } catch {
                    sessionStorage.removeItem(k);
                }
            }
        });
    }
    }

    window.NaviSessionStorage = NaviSessionStorage;
}

window.navisession = window.navisession || new window.NaviSessionStorage(10); // TTL = 10s (dùng cho shopinfo)

/**********************************************************************************************************************
 Functions.
 **********************************************************************************************************************/
 (() => {
  // Nếu đã tồn tại thì thoát (tránh khai báo lại)
  if (window.__NaviplusDebug__) return;

  // Khởi tạo mốc thời gian bắt đầu (nếu chưa có)
  if (typeof window.debugTimeStart === "undefined") {
      window.debugTimeStart = performance.now();
  }

  // Helper: trả về suffix thời gian dạng "⏰ [4,100]" (ms, làm tròn, có phân cách hàng nghìn)
  function getTimeSuffix() {
      if (typeof window.debugTimeStart !== "number") return "";
      var elapsedMs = Math.round(performance.now() - window.debugTimeStart);
      var formatted = elapsedMs.toLocaleString("en-US"); // 4100 -> "4,100"
      return " | " + formatted + "ms";
  }

  class Console {
      constructor(key = "debug") {
          this.key = key;
      }

      isEnabled() {
          return localStorage.getItem(this.key) === "1";
      }

      log(...args) {
          if (this.isEnabled()) {
              console.log(...args, getTimeSuffix());
          }
      }

      warn(...args) {
          if (this.isEnabled()) {
              console.warn(...args, getTimeSuffix());
          }
      }

      error(...args) {
          if (this.isEnabled()) {
              console.error(...args, getTimeSuffix());
          }
      }

      enable() {
          localStorage.setItem(this.key, "1");
          console.log("✔ Debug enabled");
          return this.isEnabled();
      }

      disable() {
          localStorage.removeItem(this.key);
          console.log("✘ Debug disabled");
          return this.isEnabled();
      }

      help() {
          console.log(`
======== Debug Console Help ========
• navidebug.enable()      → bật debug
• navidebug.disable()     → tắt debug
• navidebug.log(x)        → log khi debug == 1
• navidebug.isEnabled()   → kiểm tra trạng thái
====================================
          `);
      }
  }

  // Tạo instance và gán vào window
  window.__NaviplusDebug__ = new Console();

  // Alias dễ gọi
  window.navidebug = window.__NaviplusDebug__;
})();

/******************************************************************/


 window.navimanData = window.navimanData || [];

 var naviman = (function(){

    var VERTICAL_CHILDREN_WIDTH = 200;
    var DESKTOP_MAX_WIDTH = 400;
    
    var BOX_SHADOW = 'box-shadow: 0px 4px 8px 0px rgba(0, 0, 0, 0.10);';
    var shop = '';
    var embed_id = '';
    var windowWidth = window.innerWidth;
    var windowHeight = window.innerHeight;
    var cartCount = 0;

    var BADGE_HIDE = 0;
    var BADGE_DOT = 1;
    var BADGE_ISCART_WITHCOUNT = 2;
    // Gom toàn bộ những SF-1234567 data vào 1 biến để dùng

    /** Khởi tạo các biến dùng chung **************************/
    /** uigen/init.js ****************************************/
if (typeof NAVIGLOBAL === 'undefined') {
    NAVIGLOBAL = [];
    NAVIGLOBAL['ITEM_KINDS'] = [];
    NAVIGLOBAL['MENU_KINDS'] = [];

    NAVIGLOBAL['ITEM_KINDS'] = {
        ICON_IMAGE_TEXT: 1,
        GROUP_TITLE: 2,
        BLANK_SPACE: 3,
        BIG_IMAGE_TEXT: 4,
        CUSTOM_HTML: 5,
        BUTTON: 6

    };

    // TODO
    NAVIGLOBAL['ITEM_DISPLAY_LAYOUT'] = {
        TOP_DOWN: 1,
        LEFT_RIGHT: 2,
        ICON_IMAGE_ONLY: 3,
        TEXT_ONLY: 4,
        EMPTY: 5,
    };

    NAVIGLOBAL['MENU_KINDS'] = {
        STICKY_TABBAR: 1,
        STICKY_MOBILE_HEADER: 2, /* Không dùng nữa */
        STICKY_FAB_SUPPORT: 11,

        /*******************************/
        SECTION_MOBILE_HEADER: 20,
        SECTION_MOBILE_MEGAMENU: 31,
        SECTION_MOBILE_GRID: 41,
        SECTION_MOBILE_BANNER: 42,
        /*******************************/
        SECTION_DESKTOP_MEGAMENU: 131,
        /*******************************/
        CONTEXT_SLIDE: 141
    }

    NAVIGLOBAL['MOBILE_POSITION'] = {
        BOTTOM: 1,
        TOP: 2,
        RIGHT_CENTER: 3,
        LEFT_CENTER: 4,
        RIGHT_BOTTOM: 5,
        LEFT_BOTTOM: 6
    }

    NAVIGLOBAL['DESKTOP_POSITION'] = {
        BOTTOM_CENTER_FLOAT: 0,
        BOTTOM_CENTER: 1,
        BOTTOM_RIGHT: 2,
        BOTTOM_LEFT: 3,
        BOTTOM_FULL: 4,
        RIGHT_TOP: 5,
        LEFT_TOP: 6,
        LEFT_FULL_TOP: 7,
        LEFT_FULL_CENTER: 8,
        RIGHT_FULL_TOP: 9,
        RIGHT_FULL_CENTER: 10,
        TOP_FULL: 11
    }

    NAVIGLOBAL['LAYOUT'] = {
        DEFAULT: 1,
        HIGHLIGHT: 2,
        FLOATING: 3,
        FAB: 4
    }
}

const DEFAULT_ICON_IMAGE_SIZE = 22;

/** uigen/init.js END ****************************************/


    /** Khởi tạo các hàm dùng chung **************************/
    /** uigen/libs.js ****************************************/

var isHadValue = function(checkVar) {
    if (typeof (checkVar) == 'undefined')
        return false;

    if (checkVar.toString().trim() == "")
        return false;

    return true;
};

var defaultValue = function( str, defaultValue ) {
    if (typeof str == 'undefined')
        return defaultValue;
    if( str.toString().trim() == "" )
        return defaultValue;
    return platformValue(str);
};

var isOptimizeSEO = function( naviman_shopinfo ) {
    /* Hàm này được sử dụng để SEO nên đối với backend mode, không cần cho SEO
        Chỗ này xử lý không tối ưu nhưng cũng tạm được.
    *******/
    if( Helper.Env.isBackendMode() ) {
        return false;
    }

    if (typeof naviman_shopinfo != 'undefined') {
        if (typeof naviman_shopinfo["plan"] != "undefined") {
            if( naviman_shopinfo['plan'] == 'Elite' )
                return true;
        }
    }
    return false;
};

var standardizeCSS = function(rules, className){
    if (rules == "") return rules;

    // Step 1: Clean up comments and spaces
    rules = rules.replace(/\/\*[\s\S]*?\*\//g, '');
    rules = rules.replace(/\s{2,}/g, ' ');
    rules = rules.replace(/\s*({|}|,|;|:)\s*/g, '$1');
    rules = rules.replace(/&nbsp;/g, ' ');
    rules = rules.trim();

    // Step 2: Check if already prefixed
    if (rules.length >= className.length + 1)
        if (rules.substring(0, className.length + 1) == '.' + className)
            return rules;

    // Step 3: Setup
    var classLen = className.length,
        char, nextChar, isAt, isIn;
    className = ' #' + className + ' ';

    // Step 4: Handle @media blocks separately
    var mediaRegex = /@media[^{]+{([^{}]*{[^{}]*})+\s*}/g;
    var matches = [];
    var match;

    while ((match = mediaRegex.exec(rules)) !== null) {
        matches.push({
            text: match[0],
            index: match.index
        });
    }

    var parts = [];
    var lastIndex = 0;

    matches.forEach(function(m) {
        if (m.index > lastIndex) {
            parts.push({
                type: 'normal',
                content: rules.substring(lastIndex, m.index)
            });
        }
        parts.push({
            type: 'media',
            content: m.text
        });
        lastIndex = m.index + m.text.length;
    });

    if (lastIndex < rules.length) {
        parts.push({
            type: 'normal',
            content: rules.substring(lastIndex)
        });
    }

    // Step 5: Process each part
    var result = parts.map(function(part) {
        if (part.type === 'normal') {
            return processRules(part.content, className);
        } else if (part.type === 'media') {
            var innerRules = part.content.replace(/^@media[^\{]+\{/, '').replace(/\}$/, '');
            var processedInner = processRules(innerRules, className);
            var mediaQuery = part.content.match(/^@media[^\{]+\{/)[0];
            return mediaQuery + processedInner + '}\n';
        }
    }).join('\n');

    return result.trim();
};

function processRules(rules, className) {
    if (!rules) return '';

    rules = rules.replace(/\/\*(?:(?!\*\/)[\s\S])*\*\/|[\r\n\t]+/g, '');
    rules = rules.replace(/}(\s*)@/g, '}@');
    rules = rules.replace(/}(\s*)}/g, '}}');

    var classLen = className.length,
        char, nextChar, isAt, isIn;

    for (var i = 0; i < rules.length-2; i++) {
        char = rules[i];
        nextChar = rules[i+1];

        if (char === '@' && nextChar !== 'f') isAt = true;
        if (!isAt && char === '{') isIn = true;
        if (isIn && char === '}') isIn = false;

        if (
            !isIn &&
            nextChar !== '@' &&
            nextChar !== '}' &&
            (
                char === '}' ||
                char === ',' ||
                ((char === '{' || char === ';') && isAt)
            )
        ) {
            rules = rules.slice(0, i+1) + className + rules.slice(i+1);
            i += classLen;
            isAt = false;
        }
    }

    // Prefix first selector if needed
    if (rules.indexOf(className) !== 0 && rules.indexOf('@') !== 0)
        rules = ' ' + className + rules;

    return rules;
}


var isMobileMode = function () {
    if (window.innerWidth <= 768)
        return true;
    return false;
};

var getCurrentTemplate = function () {
    let path = window.location.pathname.toUpperCase().trim();
    if (path == '/' || path == '')
        return "index";
    if (path.includes('PRODUCTS'))
        return "products";
    if (path.includes('COLLECTIONS'))
        return "collections";
    if (path.includes('PAGES'))
        return "pages";
    if (path.includes('BLOGS'))
        return "blogs";

    return "others";
};


var jsonp = function(uri) {
    return new Promise(function(resolve, reject) {
        var id = '_' + Math.round(10000 * Math.random());
        var callbackName = 'jsonp_callback_' + id;
        window[callbackName] = function(data) {
            delete window[callbackName];
            var ele = document.getElementById(id);
            ele.parentNode.removeChild(ele);
            resolve(data);
        }

        var src = uri + '&callback=' + callbackName;
        var script = document.createElement('script');
        script.src = src;
        script.id = id;
        script.addEventListener('error', reject);
        (document.getElementsByTagName('head')[0] || document.body || document.documentElement).appendChild(script)
    });
};

var displayElement = function( el, display, displayKind = "block" ) {

    if( isNull(el)) return;
    if( isNull(el.style)) return;

    if( display )
        el.style.display = displayKind;
    else
        el.style.display = "none";
};

var isNull = function( object ) {

    if ( object == null ) return true;
    if ( typeof object == "undefined" ) return true;

    return false;
};

String.prototype.strReplace = function(strR, strWith) {
    var esc = strR.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
    var reg = new RegExp(esc, 'ig');
    return this.replace(reg, strWith);
};

var debugConsole = function ( object ) {
    if( UIGEN_ENV == "DEVELOPMENT" )
        navidebug.log( object );
};


// Kiểm tra xem nếu là icon thì trả về icon, nếu có ảnh thì chỉ hiện thị ảnh thôi
var itemMedia =  function(icon, image, naviplusAppUrl, style='', iconboxpadding, /*iconBoxPaddingTop = 0, */itemExtIconSize = '', itemExtAlign = '', seoUrl = '', seoName = '')
{
    let isHadImage = true;

    if (typeof (image) === 'undefined')
        isHadImage = false;
    else if (image.trim() == "")
        isHadImage = false;

    var iconStyle = "";
    /*if( iconBoxPaddingTop != 0 ) {
        iconStyle += 'margin-bottom:' + ( iconBoxPaddingTop - 2 ) + 'px; padding-top: ' + iconBoxPaddingTop + 'px;';
    }*/

    /* Chỗ này kiểm tra xem nếu có colorbox thì: 1. đặt span.icon là height:fitcontent và i.ri là display;inline-block,
    điều này làm chiều cao của span.icon bằng với chiều cao của cả cụm icon. */
    if( iconboxpadding != "" && iconboxpadding != "0" ) {
        iconStyle += ' height: fit-content; ';
    }

    var styleImageHeight = '';
    if( itemExtIconSize != '' ) {
        styleImageHeight = ' style="height:'+ itemExtIconSize +'px';
        if( parseInt(itemExtIconSize) != DEFAULT_ICON_IMAGE_SIZE )
            styleImageHeight += '; width:auto';
        styleImageHeight += '"';
    }


    if (!isHadImage) {
        var output = '<span class="icon" style="'+ iconStyle +'" >' + '<i class="' + icon + '" '+ style +'></i>' + '</span>';
        if(seoUrl != "") output = seoUrl + output + '</a>';
        return output;
    } else {
        var imageUrl = image;
        if( !Helper.HTML.isExternalUrl(image) )
            imageUrl = naviplusCDNFiles + image;

        var output = '<div class="image-border" ' + itemExtAlign + ' ><span class="image-box" ' + style + '><span class="image">' + '<img title="' + seoName + '" alt="' + seoName + '" ' + styleImageHeight + ' src="' + imageUrl + '" loading="lazy" decoding="async">' + '</span></span></div>';
        if (seoUrl != '') output = seoUrl + output + '</a>';
        return output;
    }
};

var defaultMarginPadding = function( marginPadding ) {
    if( marginPadding == null ) marginPadding = {
        'top' : 0, 'right' : 0, 'bottom' : 0, 'left' : 0
    };

    marginPadding['top'] = platformValue( marginPadding['top'] );
    marginPadding['right'] = platformValue( marginPadding['right'] );
    marginPadding['bottom'] = platformValue( marginPadding['bottom'] );
    marginPadding['left'] = platformValue( marginPadding['left'] );

    if(marginPadding['top'] == '') marginPadding['top'] = 0;
    if(marginPadding['right'] == '') marginPadding['right'] = 0;
    if(marginPadding['bottom'] == '') marginPadding['bottom'] = 0;
    if(marginPadding['left'] == '') marginPadding['left'] = 0;

    return marginPadding;
};


function encodeBody( url ) {
    var output = url;
    const words = output.split('body=');
    if( words.length == 2 ) {
        var body = encodeURIComponent(words[1]);
        output = words[0] + 'body=' + body;
    }
    return output;
}


function isUserLoggedIn() {
    try {
        if (window.ShopifyAnalytics.meta.page.customerId == null)
            return false;
    }catch({ name, message }) {
        return false;
    }
    return true;
}

var hexToRgba = function(hex, alpha = 1) {
    // Remove the leading #
    hex = hex.replace('#', '');

    // Parse the red, green, and blue values
    let red = parseInt(hex.substring(0, 2), 16);
    let green = parseInt(hex.substring(2, 4), 16);
    let blue = parseInt(hex.substring(4, 6), 16);

    // Return the rgba string
    return `rgba(${red}, ${green}, ${blue}, ${alpha})`;
}

var isSettingBeTrue = function( checkVar, defaultValue = false ) {
    if (isHadValue(checkVar))
        if( checkVar == true || checkVar == "true" )
            return true;
        else
            return false;
    return defaultValue;
}

var removeExtraSpaces = function(str) {
    // Sử dụng biểu thức chính quy để thay thế nhiều khoảng trắng bằng một khoảng trắng duy nhất
    return str.replace(/\s+/g, ' ').trim();
}

var menuSlideDesktopSubDirection = function ( data, menuKind ) {
    var isOnMobile = (window.innerWidth <= 768);
    var result = getSlideClassesForViewport( data, menuKind, isOnMobile );
    return result.subDirection ? (" " + result.subDirection + " ") : "";
}

var detectDeviceModeChange = function(callback, breakpoint = 768) {
    let lastIsMobile = window.innerWidth < breakpoint;

    window.addEventListener('resize', function () {
        const isMobileNow = window.innerWidth < breakpoint;
        if (isMobileNow !== lastIsMobile) {
            lastIsMobile = isMobileNow;
            if (typeof callback === 'function') {
                callback(isMobileNow);
            }
        }
    });
}

/**
 * updateLayoutBySlideFixed( embed_id, data )
 * Áp dụng layout fullfixed cho hamburgerPosition == 7.
 * slideFixDesktop / slideFixMobile bật/tắt chế độ luôn hiện trên desktop/mobile.
 * Width lấy từ getBoundingClientRect() — với position 7, applyHamburgerWidthSettings
 * đã inject CSS synchronously trước khi element render, nên getBoundingClientRect()
 * sẽ trả về đúng width cấu hình (không còn bị flash 360px).
 * Interval 100ms để chờ element tồn tại trong DOM.
 */
var updateLayoutBySlideFixed = function( embed_id, data ) {
    let el = null;
    const checkEl = setInterval(() => {
        el = document.getElementById(embed_id);
        if (el) {
            clearInterval(checkEl);

            var isOnMobile = window.innerWidth <= 768;
            var isDisplay  = false;

            if (!isOnMobile && isHadValue(data["setting"]['slideFixDesktop']) && data["setting"]['slideFixDesktop'])
                isDisplay = true;
            if (isOnMobile && isHadValue(data["setting"]['slideFixMobile']) && data["setting"]['slideFixMobile'])
                isDisplay = true;

            if (!isDisplay) return;

            // Đọc width thực tế sau khi applyHamburgerWidthSettings đã inject CSS
            var slideWidth = el.getBoundingClientRect().width || 360;

            el.style.boxShadow = 'inset 0px 0px 1px rgba(0, 0, 0, 0.4)';
            el.style.setProperty('visibility', 'visible', 'important');
            document.body.style.setProperty("padding-left", slideWidth + "px", "");

            // Ẩn nút close
            el.querySelectorAll('.hamburger_close').forEach(e => {
                e.style.setProperty('display', "none", 'important');
            });

            // Khi chuyển mobile <-> desktop thì reset padding
            detectDeviceModeChange(function(isMobile) {
                document.body.style.setProperty("padding-left", "initial", "");
            });

            // hamburgerPosition == 2 (panel phải): children mở sang trái → right: slideWidth, left: auto
            var _slideFixPos = parseInt(data["setting"]["hamburgerPosition"] || 1) === 2
                ? 'right: ' + slideWidth + 'px; left: auto;'
                : 'left: ' + slideWidth + 'px;';
            Helper.HTML.addLoadedFSAtBodyEnd('<style>#'+ embed_id +'.hamburger-desktop-sub-leftright ul li.item > ul.children {' + _slideFixPos + '} </style>', 20);

            // slide-horizontal: panel và header cần khớp đúng slideWidth (không dùng 90% viewport)
            if (data["setting"]["ui"] == "slide-horizontal") {
                Helper.HTML.addLoadedFSAtBodyEnd('<style>'
                    + '#' + embed_id + '[ui="slide-horizontal"] ul li.item > ul.children,'
                    + '#' + embed_id + '[ui="slide-horizontal"] ul li.item > ul.children li ul.children,'
                    + '#' + embed_id + '[ui="slide-horizontal"] .slide-horizontal-header,'
                    + '#' + embed_id + '[ui="slide-horizontal"] .slide-horizontal-header-level3'
                    + ' { width: ' + slideWidth + 'px !important; max-width: none !important; }'
                    + '</style>', 21);
            }
        }
    }, 100);
}

/**
 * Tính menuSlidePosition + menuSlideDesktopSubDirection cho viewport chỉ định.
 * Dùng cho draw ban đầu và cập nhật khi resize.
 * @param {Object} data - data.setting
 * @param {number} menuKind
 * @param {boolean} isMobile
 * @returns {{position: string, subDirection: string}}
 */
var getSlideClassesForViewport = function( data, menuKind, isMobile ) {
    var position = '', subDirection = '';
    if( menuKind != NAVIGLOBAL['MENU_KINDS']['CONTEXT_SLIDE'] ) return { position: '', subDirection: '' };

    var hamburgerPosition = 1;
    if( data["setting"]["hamburgerPosition"] != null )
        hamburgerPosition = parseInt(data["setting"]["hamburgerPosition"]);

    if( isMobile ) {
        if( hamburgerPosition == 1 ) position += " hamburger-left-right";
        else if( hamburgerPosition == 2 ) position += " hamburger-right-left ";
        else if( hamburgerPosition == 3 ) position += " hamburger-top-down ";
        else if( hamburgerPosition == 4 ) position += " hamburger-down-top ";
        else if( hamburgerPosition == 5 ) position += " hamburger-fullscreen ";
        else if( hamburgerPosition == 6 ) position += " hamburger-full-popup ";
        // Position 7 (Fix on Left): không có case mobile → openNaviMenu không tìm được class hướng → không animate.
        // Thêm hamburger-left-right để animation hoạt động khi slideFixMobile = false.
        // Khi slideFixMobile = true, openNaviMenu return sớm vì hamburger-mobile-fullfixed (menu luôn hiện).
        else if( hamburgerPosition == 7 ) position += " hamburger-left-right ";
    } else {
        if( hamburgerPosition == 2 ) position += " hamburger-right-left";
        else position += " hamburger-left-right ";
    }
    if( hamburgerPosition == 7 ) {
        position += " hamburger-full-fixed ";
        // slideFixDesktop/slideFixMobile: bật/tắt chế độ luôn hiện (fullfixed) trên desktop/mobile.
        // Width điều khiển bởi hamburgerWidth.desktopMax / hamburgerWidth.mobile (setting-slide-width.php).
        if (isHadValue(data["setting"]['slideFixDesktop']) && data["setting"]['slideFixDesktop'])
            position += " hamburger-desktop-fullfixed ";
        if (isHadValue(data["setting"]['slideFixMobile']) && data["setting"]['slideFixMobile'])
            position += " hamburger-mobile-fullfixed ";
    }
    if( !isMobile && isHadValue(data["setting"]["hamburgerSubDirection"]) && data["setting"]["hamburgerSubDirection"] == 2 )
        subDirection += " hamburger-desktop-sub-leftright ";
    else if( !isMobile && isHadValue(data["setting"]["hamburgerSubDirection"]) && data["setting"]["hamburgerSubDirection"] == 3 )
        subDirection += " hamburger-desktop-sub-contextmenu ";
    else if( !isMobile )
        subDirection += " hamburger-desktop-sub-topdown ";
    return { position: position.trim(), subDirection: subDirection.trim() };
};

var menuSlidePositionClass = function ( data, menuKind, embed_id ) {
    // Chỉ xử lý CONTEXT_SLIDE — các loại menu khác không dùng class này.
    if ( menuKind != NAVIGLOBAL['MENU_KINDS']['CONTEXT_SLIDE'] ) return "";

    // Force hamburgerSubDirection=1 khi desktop cũng dùng slide-horizontal:
    // - ui="slide-horizontal" set trực tiếp, HOẶC
    // - expandEffect==2 với hamburgerSubDirection==4 (desktop slide-h tường minh) hoặc ==0 (unset, backward compat).
    // hamburgerSubDirection 1-3 + expandEffect==2: mobile=slide-h, desktop=hướng đã chọn — KHÔNG force.
    var _subDirInit = parseInt(data["setting"]["hamburgerSubDirection"] || 0);
    if (data["setting"]["ui"] == "slide-horizontal" ||
        (String(data["setting"]["expandEffect"] || '') === '2' && (_subDirInit === 4 || _subDirInit === 0))) {
        data["setting"]["hamburgerSubDirection"] = 1;
    }
    var isOnMobile = (window.innerWidth <= 768);
    var result = getSlideClassesForViewport( data, menuKind, isOnMobile );
    if( data["setting"]["hamburgerPosition"] == 7 )
        updateLayoutBySlideFixed( embed_id, data );
    applyHamburgerWidthSettings( data, embed_id );
    return result.position ? (" " + result.position + " ") : "";
}

/**
 * applyHamburgerWidthSettings( data, embed_id )
 * Áp dụng CSS width cho slide menu theo các setting:
 *   hamburgerWidth.mobile     — width menu trên mobile (px hoặc %).
 *   hamburgerWidth.desktopMax — max-width menu trên desktop (px).
 *   hamburgerWidth.desktopSub — width submenu panel trên desktop (px).
 *                               Chỉ áp dụng khi hamburgerSubDirection = 2
 *                               VÀ expandEffect ≠ 2.
 *
 * Giá trị lưu: số thuần = px, số + "%" = %.
 * Backward compat: đọc flat keys cũ nếu hamburgerWidth chưa tồn tại.
 */
var applyHamburgerWidthSettings = function ( data, embed_id ) {
    var setting = data["setting"];
    var css = '';

    // Đọc theo cấu trúc mới; fallback về flat keys cũ cho dữ liệu đã lưu trước đó
    var hw          = setting["hamburgerWidth"] || {};
    var wMobile     = hw.mobile     || setting["hamburgerWidthMobile"]     || '';
    var wDesktopMax = hw.desktopMax || setting["hamburgerWidthDesktopMax"] || '';
    var wDesktopSub = hw.desktopSub || setting["hamburgerWidthDesktopSub"] || '';
    var _isSlideHorizontal = String(setting["expandEffect"] || '') === '2';

    /**
     * toCSS( val )
     * Chuyển giá trị lưu thành giá trị CSS hợp lệ:
     *   "300"  → "300px"
     *   "80%"  → "80%"
     */
    function toCSS(val) {
        var s = String(val).trim();
        return /^\d+(?:\.\d+)?$/.test(s) ? s + 'px' : s;
    }

    // Mobile width — override cả max-width 360px hardcode trong CSS cho menu + li.item
    if (isHadValue(wMobile)) {
        var wM = toCSS(wMobile);
        css += '@media (max-width: 768px) {'
             + ' #' + embed_id + ' { width: ' + wM + ' !important; max-width: ' + wM + ' !important; }'
             + ' }';

        // slide-horizontal: children position:fixed nên width:90% = 90% viewport, không theo parent
        // → cần override width children + header cho khớp container trên mobile
        if (_isSlideHorizontal) {
            css += '@media (max-width: 768px) {'
                 + ' #' + embed_id + '[ui="slide-horizontal"] ul li.item > ul.children,'
                 + ' #' + embed_id + '[ui="slide-horizontal"] ul li.item > ul.children li ul.children,'
                 + ' #' + embed_id + '[ui="slide-horizontal"] .slide-horizontal-header,'
                 + ' #' + embed_id + '[ui="slide-horizontal"] .slide-horizontal-header-level3'
                 + ' { width: ' + wM + ' !important; max-width: none !important; }'
                 + ' }';
        }
    }

    // Desktop max-width — cũng cập nhật left/right của ul.children để bám sát menu (thay 360px hardcode)
    if (isHadValue(wDesktopMax)) {
        var wD = toCSS(wDesktopMax);
        var _hamburgerPos = parseInt(setting["hamburgerPosition"] || 1);
        // Không dùng !important ở đây: inline style từ showLevel2Items (getBoundingClientRect) sẽ thắng tự nhiên.
        // hamburgerPosition == 2 (panel phải): level 2 mở sang trái → right: wD, left: auto.
        // hamburgerPosition khác: level 2 mở sang phải → left: wD.
        var _childrenPosCSS = _hamburgerPos === 2
            ? ' right: ' + wD + '; left: auto; '
            : ' left: ' + wD + '; ';
        css += '@media (min-width: 769px) {'
             + ' #' + embed_id + ' { width: ' + wD + ' !important; max-width: ' + wD + ' !important; }'
             // Chỉ level 2: left/right bằng width menu level 1 để bám sát (không !important — inline style thắng)
             // Level 3 không set left ở đây — tự tính theo width level 2
             + ' #' + embed_id + '.hamburger-desktop-sub-leftright ul li.item > ul.children[menulevel="2"]'
             + ' {' + _childrenPosCSS + '}'
             + ' }';

        // slide-horizontal: children position:fixed nên width:90% = 90% viewport, không theo parent
        // → cần override width children + header cho khớp container trên desktop
        if (_isSlideHorizontal) {
            css += '@media (min-width: 769px) {'
                 + ' #' + embed_id + '[ui="slide-horizontal"] ul li.item > ul.children,'
                 + ' #' + embed_id + '[ui="slide-horizontal"] ul li.item > ul.children li ul.children,'
                 + ' #' + embed_id + '[ui="slide-horizontal"] .slide-horizontal-header,'
                 + ' #' + embed_id + '[ui="slide-horizontal"] .slide-horizontal-header-level3'
                 + ' { width: ' + wD + ' !important; max-width: none !important; }'
                 + ' }';
        }
    }

    // Desktop submenu width — chỉ khi hamburgerSubDirection = 2 và expandEffect ≠ 2
    var subDir    = String(setting["hamburgerSubDirection"] || '');
    var expandEff = String(setting["expandEffect"] || '');
    if (isHadValue(wDesktopSub) && subDir === '2' && expandEff !== '2') {
        var wS = toCSS(wDesktopSub);
        css += '@media (min-width: 769px) {'
             + ' #' + embed_id + ' ul li.item > ul.children'             
             + ' { width: ' + wS + ' !important; max-width: ' + wS + ' !important; }'
             + ' }';
    }

    if (css) {
        // Inject CSS ngay lập tức (không qua addLoadedFSAtBodyEnd) để tránh flash 360px
        // khi user mở menu trong lúc page đang load. CSS này chỉ scope vào #embed_id
        // nên không có lý do defer đến window.load.
        (document.head || document.body).insertAdjacentHTML('beforeend', '<style>' + css + '</style>');
    }

    // slide-horizontal: level 2, 3 và header phải khớp width thực tế của level 1
    // Đọc sau khi CSS được áp dụng (dùng setInterval như updateLayoutBySlideFixed)
    // để translateX(100%) = đúng khoảng cách panel → animation slide đồng bộ
    // Skip khi đã có wMobile hoặc wDesktopMax — CSS media query ở trên đã set width chính xác cho children,
    // setInterval đọc getBoundingClientRect trước khi CSS kia apply sẽ gây race condition (width sai).
    if (_isSlideHorizontal && !isHadValue(wMobile) && !isHadValue(wDesktopMax)) {
        var _eid = embed_id;
        var _checkSH = setInterval(function() {
            var el = document.getElementById(_eid);
            if (!el) return;
            var w = Math.round(el.getBoundingClientRect().width);
            if (w <= 0) return;
            clearInterval(_checkSH);
            Helper.HTML.addLoadedFSAtBodyEnd('<style>'
                + '#' + _eid + '[ui="slide-horizontal"] ul li.item > ul.children,'
                + '#' + _eid + '[ui="slide-horizontal"] ul li.item > ul.children li ul.children,'
                + '#' + _eid + '[ui="slide-horizontal"] .slide-horizontal-header,'
                + '#' + _eid + '[ui="slide-horizontal"] .slide-horizontal-header-level3'
                + ' { width: ' + w + 'px !important; max-width: none !important; }'
                + '</style>', 23);
        }, 50);
    }
};

var menuPositionClass = function ( data ) {
    var menuPosition = '';

    switch (parseInt(data["setting"]["mobilePosition"])) {
        case NAVIGLOBAL['MOBILE_POSITION']['BOTTOM']:
            menuPosition += " mobile-" + "bottom ";
            break;
        case NAVIGLOBAL['MOBILE_POSITION']['TOP']:
            menuPosition += " mobile-" + "top ";
            break;
        case NAVIGLOBAL['MOBILE_POSITION']['RIGHT_CENTER']:
            menuPosition += " mobile-" + "right-center ";
            break;
        case NAVIGLOBAL['MOBILE_POSITION']['LEFT_CENTER']:
            menuPosition += " mobile-" + "left-center ";
            break;
        case NAVIGLOBAL['MOBILE_POSITION']['RIGHT_BOTTOM']:
            menuPosition += " mobile-" + "right-bottom ";
            break;
        case NAVIGLOBAL['MOBILE_POSITION']['LEFT_BOTTOM']:
            menuPosition += " mobile-" + "left-button ";
            break;
    }

    switch (parseInt(data["setting"]["desktopPosition"])) {
        case NAVIGLOBAL['DESKTOP_POSITION']['BOTTOM_CENTER_FLOAT']:
            menuPosition += " desktop-" + "bottom-center-float ";
            break;
        case NAVIGLOBAL['DESKTOP_POSITION']['BOTTOM_CENTER']:
            menuPosition += " desktop-" + "bottom-center ";
            break;
        case NAVIGLOBAL['DESKTOP_POSITION']['BOTTOM_RIGHT']:
            menuPosition += " desktop-" + "bottom-right ";
            break;
        case NAVIGLOBAL['DESKTOP_POSITION']['BOTTOM_RIGHT']:
            menuPosition += " desktop-" + "bottom-right ";
            break;
        case NAVIGLOBAL['DESKTOP_POSITION']['BOTTOM_LEFT']:
            menuPosition += " desktop-" + "bottom-left ";
            break;
        case NAVIGLOBAL['DESKTOP_POSITION']['BOTTOM_FULL']:
            menuPosition += " desktop-" + "bottom-full ";
            break;
        case NAVIGLOBAL['DESKTOP_POSITION']['RIGHT_TOP']:
            menuPosition += " desktop-" + "right-top ";
            break;
        case NAVIGLOBAL['DESKTOP_POSITION']['LEFT_TOP']:
            menuPosition += " desktop-" + "left-top ";
            break;
        case NAVIGLOBAL['DESKTOP_POSITION']['LEFT_FULL_TOP']:
            menuPosition += " desktop-" + "left-full-top ";
            break;
        case NAVIGLOBAL['DESKTOP_POSITION']['LEFT_FULL_CENTER']:
            menuPosition += " desktop-" + "left-full-center ";
            break;
        case NAVIGLOBAL['DESKTOP_POSITION']['RIGHT_FULL_TOP']:
            menuPosition += " desktop-" + "right-full-top ";
            break;
        case NAVIGLOBAL['DESKTOP_POSITION']['RIGHT_FULL_CENTER']:
            menuPosition += " desktop-" + "right-full-center ";
            break;
        case NAVIGLOBAL['DESKTOP_POSITION']['TOP_FULL']:
            menuPosition += " desktop-" + "top-full ";
            break;
    }

    return menuPosition;
}







var getSEOUrl = function (itemUrl) {
    var currentDomain = window.location.origin;
    itemUrl = itemUrl.trim();

    if (itemUrl === "") return currentDomain;
    if (itemUrl === "#") return itemUrl;

    if( itemUrl.startsWith("#") )
        return "";

    // Kiểm tra xem itemUrl có phải là một URL tuyệt đối (bắt đầu bằng http:// hoặc https://) không
    if (itemUrl.startsWith("http://") || itemUrl.startsWith("https://")) {
        return itemUrl;
    }

    // Loại bỏ các giá trị đặc biệt
    const invalidPrefixes = ["open:", "scroll:", "javascript:", "tel:", "sms:", "mailto:", "share:"];
    if (invalidPrefixes.some(prefix => itemUrl.includes(prefix))) {
        return "";
    }

    return currentDomain + "/" + itemUrl;
};

var getMenuKind = function( naviman_shopinfo, embed_id ) {

    if( Helper.Env.isBackendMode() ) {
        if( typeof fakeMenuKind != "undefined" )
            return fakeMenuKind;
        return "1";
    }
    
    if( typeof naviman_shopinfo != "undefined" ) {
        if (typeof naviman_shopinfo["bottombars"] != "undefined") {
            if (typeof naviman_shopinfo["bottombars"][embed_id] != "undefined") {
                return naviman_shopinfo["bottombars"][embed_id];
            }
        }
    }

    return -1;
}


var getMenuKindByHtml = function( embed_id ) {

    if( Helper.Env.isBackendMode() ) {
        if( typeof fakeMenuKind != "undefined" )
            return fakeMenuKind;
        return "1";
    }

    var menuEl = document.getElementById(embed_id);
    if (menuEl) {
        if (menuEl.classList.contains("CONTEXT_SLIDE"))
            return NAVIGLOBAL['MENU_KINDS']['CONTEXT_SLIDE'];

        // STICKY_TABBAR: class hiện tại của container là "STICKY_TABBAR", không phải "TABBAR"
        // Nhưng để tương thích ngược, vẫn chấp nhận cả "TABBAR" nếu có.
        if (menuEl.classList.contains("STICKY_TABBAR") || menuEl.classList.contains("TABBAR"))
            return NAVIGLOBAL['MENU_KINDS']['STICKY_TABBAR'];

        // STICKY_FAB_SUPPORT: class hiện tại thường là "STICKY_FAB_SUPPORT", nhưng giữ thêm "FAB" cho backward-compat
        if (menuEl.classList.contains("STICKY_FAB_SUPPORT") || menuEl.classList.contains("FAB"))
            return NAVIGLOBAL['MENU_KINDS']['STICKY_FAB_SUPPORT'];
        if (menuEl.classList.contains("SECTION_MOBILE_HEADER"))
            return NAVIGLOBAL['MENU_KINDS']['SECTION_MOBILE_HEADER'];
        if (menuEl.classList.contains("SECTION_MOBILE_MEGAMENU"))
            return NAVIGLOBAL['MENU_KINDS']['SECTION_MOBILE_MEGAMENU'];
        if (menuEl.classList.contains("SECTION_MOBILE_GRID"))
            return NAVIGLOBAL['MENU_KINDS']['SECTION_MOBILE_GRID'];
        if (menuEl.classList.contains("SECTION_MOBILE_BANNER"))
            return NAVIGLOBAL['MENU_KINDS']['SECTION_MOBILE_BANNER'];
        if (menuEl.classList.contains("SECTION_DESKTOP_MEGAMENU"))
            return NAVIGLOBAL['MENU_KINDS']['SECTION_DESKTOP_MEGAMENU'];
    }

    return -1;
}

var getMenuKindString = function(naviman_shopinfo, embed_id) {
    var menuKind = getMenuKind(naviman_shopinfo, embed_id);

    const menuKindMap = {
        [NAVIGLOBAL['MENU_KINDS']['STICKY_TABBAR']]: "STICKY_TABBAR",
        [NAVIGLOBAL['MENU_KINDS']['STICKY_MOBILE_HEADER']]: "STICKY_MOBILE_HEADER",
        [NAVIGLOBAL['MENU_KINDS']['STICKY_FAB_SUPPORT']]: "STICKY_FAB_SUPPORT",
        [NAVIGLOBAL['MENU_KINDS']['SECTION_MOBILE_HEADER']]: "SECTION_MOBILE_HEADER",
        [NAVIGLOBAL['MENU_KINDS']['SECTION_MOBILE_MEGAMENU']]: "SECTION_MOBILE_MEGAMENU",
        [NAVIGLOBAL['MENU_KINDS']['SECTION_MOBILE_GRID']]: "SECTION_MOBILE_GRID",
        [NAVIGLOBAL['MENU_KINDS']['SECTION_MOBILE_BANNER']]: "SECTION_MOBILE_BANNER",
        [NAVIGLOBAL['MENU_KINDS']['SECTION_DESKTOP_MEGAMENU']]: "SECTION_DESKTOP_MEGAMENU",
        [NAVIGLOBAL['MENU_KINDS']['CONTEXT_SLIDE']]: "CONTEXT_SLIDE"
    };

    return menuKindMap[menuKind] || "";
};

var getMenuKindStringById = function(menuKind) {

    const menuKindMap = {
        [NAVIGLOBAL['MENU_KINDS']['STICKY_TABBAR']]: "STICKY_TABBAR",
        [NAVIGLOBAL['MENU_KINDS']['STICKY_MOBILE_HEADER']]: "STICKY_MOBILE_HEADER",
        [NAVIGLOBAL['MENU_KINDS']['STICKY_FAB_SUPPORT']]: "STICKY_FAB_SUPPORT",
        [NAVIGLOBAL['MENU_KINDS']['SECTION_MOBILE_HEADER']]: "SECTION_MOBILE_HEADER",
        [NAVIGLOBAL['MENU_KINDS']['SECTION_MOBILE_MEGAMENU']]: "SECTION_MOBILE_MEGAMENU",
        [NAVIGLOBAL['MENU_KINDS']['SECTION_MOBILE_GRID']]: "SECTION_MOBILE_GRID",
        [NAVIGLOBAL['MENU_KINDS']['SECTION_MOBILE_BANNER']]: "SECTION_MOBILE_BANNER",
        [NAVIGLOBAL['MENU_KINDS']['SECTION_DESKTOP_MEGAMENU']]: "SECTION_DESKTOP_MEGAMENU",
        [NAVIGLOBAL['MENU_KINDS']['CONTEXT_SLIDE']]: "CONTEXT_SLIDE"
    };

    return menuKindMap[menuKind] || "";
};


function encodeQuery(query) {
    if (typeof query !== 'string') return "";
    let encoded = btoa(query); // Encode to Base64
    return encoded.replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}

function decodeQuery(encoded) {
    if (typeof encoded !== 'string') return "";
    encoded = encoded.replace(/-/g, '+').replace(/_/g, '/');
    try {
        return atob(encoded);
    } catch {
        return "";
    }
}

function parseAttributes(input) {
    // Split by ; and , delimiters
    let parts = input.split(/[,;]+/);

    // Filter and clean valid attributes (attr=value)
    let validAttributes = parts
        .map(part => part.trim()) // Trim spaces around
        .filter(part => {
            // Only keep parts that have an = sign and no space in the attribute name
            return /^[a-zA-Z0-9_-]+\s*=\s*[^\s]+/.test(part);
        });

    return validAttributes;
}

function formatAttributes(attrArray) {
    return attrArray.map(attrPair => {
        let [attribute, value] = attrPair.split('=');

        // Replace spaces in the attribute name with hyphens
        attribute = attribute.trim().replace(/\s+/g, '-');

        // Return the formatted string with value in double quotes
        return `${attribute}="${value.trim()}"`;
    }).join(' ');
}

function standardizeFunctionString(funcString) {
    // Bắt các hàm dạng 'function tenHam(...) {...}' hoặc có khoảng trắng trước dấu (
    const functionDeclarationPattern = /function\s+([a-zA-Z_$][\w$]*)\s*\(\s*([^)]*)\s*\)\s*\{/g;

    // Bắt các hàm dạng 'var tenHam = function(...) {...}'
    const functionExpressionPattern = /var\s+([a-zA-Z_$][\w$]*)\s*=\s*function\s*\(\s*([^)]*)\s*\)\s*\{/g;

    // Thay thế thành Navi.tenHam
    let output = funcString.replace(functionDeclarationPattern, 'Navi.$1 = function($2) {');
    output = output.replace(functionExpressionPattern, 'Navi.$1 = function($2) {');

    return output;
}

var platformValue = function( val ) {
    if( val != "" )
    {
        if( typeof val !== 'string' )
            return val;

        // Bước 0: Cắt bỏ ký tự '|' ở đầu và cuối nếu có
        if (val.startsWith('|')) val = val.slice(1);
        if (val.endsWith('|')) val = val.slice(0, -1);

        // Bước 1: Kiểm tra nếu không chứa ký tự '|', trả về chính nó
        if (!val.includes('|')) return val;

        // Bước 2: Split thành array
        const parts = val.split('|');

        // Kiểm tra kích thước và lấy phần tử tương ứng
        if (window.innerWidth <= 768) {
            return parts[0] !== '' ? parts[0].trim() : parts[1].trim() || '';
        } else {
            return parts[1] !== '' ? parts[1].trim() : parts[0].trim() || '';
        }
    }
    return val;
}

function getHiddenDivSize(div) {
    const clone = div.cloneNode(true); // Sao chép thẻ div
    clone.style.visibility = 'hidden'; // Ẩn nhưng vẫn render
    clone.style.position = 'absolute'; // Đặt ở vị trí tạm thời
    clone.style.display = 'block';     // Đảm bảo nó được render

    document.body.appendChild(clone);  // Thêm clone vào DOM
    const width = clone.offsetWidth;
    const height = clone.offsetHeight;
    document.body.removeChild(clone);  // Xóa clone khỏi DOM

    return { width, height };
}




function isBrowserSafari() {
    return /^((?!chrome|android).)*safari/i.test(navigator.userAgent) && !!window.safari;
}

function convertPXToNumber(value) {
    if (!value) return 0; // Nếu giá trị là null, undefined, "" thì trả về 0

    if (typeof value === "string") {
        let num = parseFloat(value.replace(/[^0-9.]/g, "")); // Loại bỏ ký tự không phải số hoặc dấu chấm
        return isNaN(num) ? 0 : num; // Nếu không có số hợp lệ, trả về 0
    }

    return Number(value) || 0; // Nếu không phải số hợp lệ, trả về 0
}


var generateActiveItems = function() {
    var pathName = Helper.String.trimChar(window.location.pathname, '/');
    var naviItems = document.querySelectorAll(".naviItem");
    
    for (let navi_item = 0; navi_item < naviItems.length; navi_item++) {
        const listItems = naviItems[navi_item].querySelectorAll('li');
        
        for (let i = 0; i < listItems.length; i++) {
            let url = listItems[i].getAttribute("linkto");
            
            if (url) { // Kiểm tra nếu url không null
                url = Helper.String.trimChar(url.replace(/^.*\/\/[^\/]+/, ''), '/');
                
                if (url !== "" && Helper.String.topContain(pathName, url)) {
                    listItems[i].classList.add("navi-active");
                    
                    let parent = listItems[i];
                    for (let parent_index = 0; parent_index < 10; parent_index++) {
                        parent = parent.parentElement;
                        
                        if (!parent) break; // Kiểm tra nếu parent là null thì thoát vòng lặp
                        
                        if (parent.tagName === "LI") {
                            parent.classList.add("navi-active");
                        }
                        if (parent.classList.contains('naviItem')) {
                            break;
                        }
                    }
                }
            }
        }
    }
};

/** uigen/libs.js END ****************************************/    /**
 * Animation - Thư viện xử lý animation cho menu NaviPlus.
 * Đầu vào: element DOM, options tùy chọn.
 * Tái sử dụng được cho nhiều loại menu, dễ mở rộng sau này.
 */
var Animation = Animation || {};

/**
 * Hằng số dùng chung
 * SLIDE_DURATION_MS: tạm thời x5 để slide chậm hơn (duration nhân 5)
 */
Animation.DURATION_MS = 888; /* 800*5/3 - DEBUG slow */
Animation.EASING = "cubic-bezier(0.4, 0.0, 0.2, 1)";
Animation.SLIDE_DURATION_MS = 200; /* 200*5/3 - DEBUG slow */

/**
 * Trượt từ phải sang trái (không fade, giữ opacity 1).
 * Dùng cho mở submenu (level 2, level 3) slide-horizontal.
 *
 * @param {Element} element - Phần tử cần animate
 * @param {Object} [options]
 * @param {string} [options.displayValue="block"] - Giá trị display khi hiện (block, inline-block...)
 * @param {Object} [options.initialStyles] - Style bổ sung trước khi animate (vd: { width: "100%" })
 * @param {Function} [options.doneCallback] - Gọi sau khi animation xong
 * @returns {boolean}
 */
Animation.slideInFromRight = function(element, options) {
    if (!element || !element.style) return false;

    options = options || {};
    var displayValue = options.displayValue || "block";
    var initialStyles = options.initialStyles || {};
    var doneCallback = options.doneCallback;

    element.style.transform = "translateX(100%)";
    element.style.opacity = "1";
    if (element.style.display === "" || element.style.display === "none") {
        element.style.display = displayValue;
    }
    for (var key in initialStyles) {
        if (initialStyles.hasOwnProperty(key)) {
            element.style[key] = initialStyles[key];
        }
    }
    element.style.transition = "none";

    requestAnimationFrame(function() {
        requestAnimationFrame(function() {
            element.style.transition = "transform " + (Animation.SLIDE_DURATION_MS || 67) + "ms " + Animation.EASING;
            element.style.transform = "translateX(0)";

            if (typeof doneCallback === "function") {
                setTimeout(doneCallback, Animation.SLIDE_DURATION_MS || Animation.DURATION_MS || 67);
            }
        });
    });

    return true;
};

/**
 * Fade in: opacity 0 → 1.
 * Dùng cho menu không phải slide-horizontal (top-down, down-top). Thay cho scale vì expand/co trông xấu.
 *
 * @param {Element} element - Phần tử cần animate
 * @param {Object} [options]
 * @param {string} [options.displayValue="block"] - Giá trị display khi hiện
 * @param {Object} [options.initialStyles] - Style bổ sung
 * @param {Function} [options.doneCallback] - Gọi sau khi animation xong
 * @returns {boolean}
 */
Animation.fadeIn = function(element, options) {
    if (!element || !element.style) return false;

    options = options || {};
    var displayValue = options.displayValue || "block";
    var initialStyles = options.initialStyles || {};
    var doneCallback = options.doneCallback;

    element.style.opacity = "0";
    if (element.style.display === "" || element.style.display === "none") {
        element.style.display = displayValue;
    }
    for (var key in initialStyles) {
        if (initialStyles.hasOwnProperty(key)) {
            element.style[key] = initialStyles[key];
        }
    }
    element.style.transition = "none";

    requestAnimationFrame(function() {
        requestAnimationFrame(function() {
            element.style.transition = "opacity 0.2s " + Animation.EASING;
            element.style.opacity = "1";

            if (typeof doneCallback === "function") {
                setTimeout(doneCallback, 200);
            }
        });
    });

    return true;
};

/**
 * Fade out: opacity 1 → 0.
 * Đóng submenu khi dùng fadeIn cho mở.
 *
 * @param {Element} element - Phần tử cần animate
 * @param {Object} [options]
 * @param {Function} [options.doneCallback]
 * @param {string[]} [options.removeProperties] - Properties cần xóa sau khi ẩn
 * @returns {boolean}
 */
Animation.fadeOut = function(element, options) {
    if (!element || !element.style) return false;

    options = options || {};
    var doneCallback = options.doneCallback;
    var removeProperties = options.removeProperties || [];

    element.style.transition = "opacity 0.2s " + Animation.EASING;
    requestAnimationFrame(function() {
        element.style.opacity = "0";
    });

    setTimeout(function() {
        element.style.display = "none";
        element.style.removeProperty("transition");
        element.style.removeProperty("opacity");
        removeProperties.forEach(function(prop) {
            element.style.removeProperty(prop);
        });
        if (typeof doneCallback === "function") doneCallback();
    }, 200);

    return true;
};

/**
 * Trượt từ trái sang phải (translateX -100% → 0).
 * Dùng cho desktop hamburger-desktop-sub-leftright khi panel trái: submenu mở ra bên phải sidebar.
 *
 * @param {Element} element - Phần tử cần animate
 * @param {Object} [options] - Giống slideInFromRight (displayValue, initialStyles, doneCallback)
 * @returns {boolean}
 */
Animation.slideInFromLeft = function(element, options) {
    if (!element || !element.style) return false;

    options = options || {};
    var displayValue = options.displayValue || "block";
    var initialStyles = options.initialStyles || {};
    var doneCallback = options.doneCallback;

    element.style.transform = "translateX(-100%)";
    element.style.opacity = "1";
    if (element.style.display === "" || element.style.display === "none") {
        element.style.display = displayValue;
    }
    for (var key in initialStyles) {
        if (initialStyles.hasOwnProperty(key)) {
            element.style[key] = initialStyles[key];
        }
    }
    element.style.transition = "none";

    requestAnimationFrame(function() {
        requestAnimationFrame(function() {
            var dur = Animation.SLIDE_DURATION_MS || 67;
            element.style.transition = "transform " + dur + "ms " + Animation.EASING;
            element.style.transform = "translateX(0)";

            if (typeof doneCallback === "function") {
                setTimeout(doneCallback, dur);
            }
        });
    });

    return true;
};

/**
 * Trượt từ trái sang phải (translateX 0 → 100% hoặc slideDistancePx).
 * Dùng cho đóng submenu (level 2, level 3) slide-horizontal.
 *
 * @param {Element} element - Phần tử cần animate
 * @param {Object} [options]
 * @param {Function} [options.doneCallback] - Gọi sau khi animation xong
 * @param {string[]} [options.removeProperties] - Các property cần xóa sau khi ẩn (vd: ["width"])
 * @param {number} [options.slideDistancePx] - Khoảng cách trượt (px). Dùng để header và content trượt cùng quãng đường.
 * @returns {boolean}
 */
Animation.slideOutToRight = function(element, options) {
    if (!element || !element.style) return false;

    options = options || {};
    var doneCallback = options.doneCallback;
    var removeProperties = options.removeProperties || [];
    var slideDistancePx = options.slideDistancePx;

    var translateValue = (typeof slideDistancePx === "number" && slideDistancePx > 0)
        ? "translateX(" + slideDistancePx + "px)"
        : "translateX(100%)";

    var dur = Animation.SLIDE_DURATION_MS || 67;
    element.style.transition = "transform " + dur + "ms " + Animation.EASING;
    requestAnimationFrame(function() {
        element.style.transform = translateValue;
    });

    setTimeout(function() {
        element.style.display = "none";
        element.style.removeProperty("transition");
        element.style.removeProperty("transform");
        removeProperties.forEach(function(prop) {
            element.style.removeProperty(prop);
        });
        if (typeof doneCallback === "function") doneCallback();
    }, dur);

    return true;
};

/**
 * Đóng submenu: trượt sang trái (translateX 0 → -100% hoặc -slideDistancePx).
 * Cặp với slideInFromLeft.
 *
 * @param {Element} element - Phần tử cần animate
 * @param {Object} [options] - doneCallback, removeProperties, slideDistancePx
 * @returns {boolean}
 */
Animation.slideOutToLeft = function(element, options) {
    if (!element || !element.style) return false;

    options = options || {};
    var doneCallback = options.doneCallback;
    var removeProperties = options.removeProperties || [];
    var slideDistancePx = options.slideDistancePx;

    var translateValue = (typeof slideDistancePx === "number" && slideDistancePx > 0)
        ? "translateX(-" + slideDistancePx + "px)"
        : "translateX(-100%)";

    var dur = Animation.SLIDE_DURATION_MS || 67;
    element.style.transition = "transform " + dur + "ms " + Animation.EASING;
    requestAnimationFrame(function() {
        element.style.transform = translateValue;
    });

    setTimeout(function() {
        element.style.display = "none";
        element.style.removeProperty("transition");
        element.style.removeProperty("transform");
        removeProperties.forEach(function(prop) {
            element.style.removeProperty(prop);
        });
        if (typeof doneCallback === "function") doneCallback();
    }, dur);

    return true;
};

/**
 * Đóng panel hamburger (level 1) với animation trượt ngược chiều mở.
 * Đọc class của element (hamburger-left-right, hamburger-right-left, ...) để xác định hướng trượt.
 *
 * @param {Element} element - .naviItem.CONTEXT_SLIDE cần đóng
 * @param {Object} [options]
 * @param {Function} [options.doneCallback] - Gọi sau khi animation xong
 * @returns {boolean}
 */
Animation.hamburgerClose = function(element, options) {
    if (!element || !element.style) return false;

    options = options || {};
    var doneCallback = options.doneCallback;
    var classList = element.classList;

    var transformTo = null;
    if (classList.contains("hamburger-left-right")) {
        transformTo = "translateX(-100%)";
    } else if (classList.contains("hamburger-right-left")) {
        transformTo = "translateX(100%)";
    } else if (classList.contains("hamburger-top-down")) {
        transformTo = "translateY(-100%)";
    } else if (classList.contains("hamburger-down-top")) {
        transformTo = "translateY(100%)";
    } else if (classList.contains("hamburger-fullscreen") || classList.contains("hamburger-fullpopup")) {
        transformTo = null;
    } else {
        element.style.visibility = "hidden";
        if (typeof doneCallback === "function") doneCallback();
        return true;
    }

    if (transformTo !== null) {
        element.style.transition = "transform 0.3s ease-out";
        requestAnimationFrame(function() {
            element.style.transform = transformTo;
        });
        setTimeout(function() {
            element.style.visibility = "hidden";
            element.style.removeProperty("transition");
            element.style.removeProperty("transform");
            if (typeof doneCallback === "function") doneCallback();
        }, 300);
    } else {
        element.style.transition = "opacity 0.2s ease-out";
        requestAnimationFrame(function() {
            element.style.opacity = "0";
        });
        setTimeout(function() {
            element.style.visibility = "hidden";
            element.style.removeProperty("opacity");
            element.style.removeProperty("transition");
            if (typeof doneCallback === "function") doneCallback();
        }, 200);
    }

    return true;
};

/**
 * Nhấp nháy xanh nhạt trên phần tử để chỉ báo trigger đã được gắn.
 * @param {Element} el - Phần tử cần highlight
 */
Animation.flashTriggerBound = function(el) {
  el.style.transition = "background 0.5s ease, opacity 0.5s ease 0.5s";
  el.style.background = "rgba(0, 128, 0, 0.02)";
  el.style.opacity = "1";
  el.style.borderRadius = "8px";
  requestAnimationFrame(function() {
    setTimeout(function() { el.style.opacity = "0"; }, 300);
    setTimeout(function() {
      el.style.background = "";
      el.style.opacity = "";
      el.style.transition = "";
    }, 700);
  });
};

if (typeof window !== "undefined") window.Animation = Animation;

/**********************************************************/
    var Helper = Helper || {};  
Helper.HTML = Helper.HTML || {};  
Helper.String = Helper.String || {};  
Helper.Debug = Helper.Debug || {};  
Helper.Env = Helper.Env || {}; 
Helper.MultiSite = Helper.MultiSite || {}; 
Helper.CLS = Helper.CLS || {};
Helper.Color = Helper.Color || {};
Helper.Animation = Helper.Animation || {};

Helper.Color.hexToRgb = function(hex, alpha = "") {
    // --- Chuẩn hoá chuỗi ---
    hex = (hex || "").replace(/^#/, "").trim();
    alpha = (alpha === null || alpha === undefined) ? "" : String(alpha).trim();

    // --- Kiểm tra hex hợp lệ (3 hoặc 6 ký tự) ---
    if (!/^([0-9A-Fa-f]{3}|[0-9A-Fa-f]{6})$/.test(hex)) {
        navidebug.warn("Invalid HEX color:", hex);
        return null;
    }

    // --- Chuyển hex 3 -> 6 ký tự ---
    if (hex.length === 3) {
        hex = hex.split("").map(c => c + c).join("");
    }

    // --- Chuyển hex -> RGB ---
    const int = parseInt(hex, 16);
    const r = (int >> 16) & 255;
    const g = (int >> 8) & 255;
    const b = int & 255;

    // --- Không có alpha -> trả về rgb() ---
    if (alpha === "") {
        return `rgb(${r}, ${g}, ${b})`;
    }

    // --- Xử lý alpha ---
    // Nếu alpha là dạng số nguyên (0–100) → chuyển sang 0–1
    if (/^\d+$/.test(alpha)) {
        alpha = Math.min(100, Math.max(0, parseInt(alpha, 10))) / 100;
    } 
    else {
        // Dạng số thực 0–1
        alpha = parseFloat(alpha);
        if (isNaN(alpha)) alpha = 1;
    }

    // Đảm bảo alpha trong khoảng 0–1
    alpha = Math.min(1, Math.max(0, alpha));

    return `rgba(${r}, ${g}, ${b}, ${alpha})`;
};


Helper.String.isUrlContain = function (keywordsSetting) {
    var url = window.location.pathname + window.location.search; //window.location.href.toLowerCase();
    url = url.toLowerCase()
    var keywords = keywordsSetting.split(',');
    for (let i = 0; i < keywords.length; i++) {
        keywords[i] = keywords[i].trim().toLowerCase();
        if( keywords[i] != '' ) {
            if( url.includes( keywords[i] ) )
                return true;
        }
    }
    return false;
};

Helper.String.stringToArray = function (inputString) {
    return inputString
        .split(/[,;]/)         // Tách chuỗi theo dấu , hoặc ;
        .map(item => item.trim()) // Loại bỏ khoảng trắng thừa ở đầu và cuối mỗi item
        .filter(item => item !== ""); // Loại bỏ các item rỗng
};

/**
 * Chuẩn hoá selector theo platform (M: mobile, D: desktop).
 * @param {string} sel - CSS selector có thể có hậu tố (M|m|D|d).
 * @returns {string} selector hợp lệ hoặc '' nếu không khớp platform.
 */
Helper.String.CSSSelectorPlatform = function (sel) {
    if (!sel) return "";

    var isMobile = window.innerWidth <= 768;

    // Tách hậu tố nếu có
    var match = /\((M|m|D|d)\)\s*$/.exec(sel);
    var cleanSel = sel.replace(/\s*\((M|m|D|d)\)\s*$/, "").trim();

    if (!match) {
        // Không có hậu tố -> giữ nguyên
        return cleanSel;
    }

    var flag = match[1].toUpperCase();
    if (flag === "M" && !isMobile) return "";
    if (flag === "D" && isMobile) return "";

    return cleanSel;
};

/**
 * Lấy CSS selector đầu tiên trong chuỗi, ngăn cách bởi "," hoặc ";"
 * @param {string} sel
 * @returns {string} selector đầu tiên đã trim (rỗng nếu không hợp lệ)
 */
Helper.String.getFirstCSSSelector = function (sel) {
  if (sel == null) return "";
  const s = String(sel).trim();
  if (!s) return "";
  const i = s.search(/[;,]/);
  if (i === -1) return s;
  return s.slice(0, i).trim();
};

Helper.String.trimChar = function(str, ch){
    var start = 0,
        end = str.length;

    while(start < end && str[start] === ch)
        ++start;

    while(end > start && str[end - 1] === ch)
        --end;

    return (start > 0 || end < str.length) ? str.substring(start, end) : str;
};

Helper.String.topContain = function( str, compare ) {
    str = str.toLowerCase().trim();
    compare = compare.toLowerCase().trim();

    if( str.trim() == "" )
        if( compare.trim() == "" )
            return true;
    if( str.trim() != "" )
        if( compare.trim() == "" )
            return false;

    if( str.length < compare.length )
        return false;

    if (str.substring(0, compare.length).includes(compare)) {
        return true;
    }
    return false;
};

Helper.String.classToID = function(className) {
    if (!className) return "";

    // Bỏ dấu chấm đầu nếu có
    className = className.trim().replace(/^\./, "");

    // Nếu đã có # rồi thì giữ nguyên
    if (className.startsWith("#")) return className;

    // Thêm # vào đầu
    return "#" + className;
};

Helper.Debug.writeBeautifyConsoleLog = function (message, color) {
    navidebug.log("%c" + message, "color: " + color + "; font-size: 11px");
};

Helper.Debug.writeLineConsoleLog = function (color) {
    console.log("%c____________________________________", "color: " + color + "; font-size: 11px");
};

Helper.Debug.welcomeScreen = function() {
    if (typeof naviman === 'undefined') {
        if (!window.isWelcomeLogged) {
            if( naviman_version != "simulator" )
            console.log(
                "%c\uD83D\uDC96 Using Navi+ (Ver "+ naviman_version +"), a Shopify Menu Builder application to create advanced menus: Tab Bar, Mega Menu, Hamburger Menu, Grid Menu, and more... %cDetail here: https://naviplus.io", 
                "color: green; font-size: 12px; font-weight: bold; background:#d5ffcd; padding: 4px 12px; margin: 12px 0px 0px 0px; border-radius: 8px;", 
                "color: green; font-size: 12px; font-weight: bold; background: #FFFACD; padding: 4px 12px; margin: 1px 0px 12px 0px; border-radius: 8px; text-decoration: none;"
            );
            window.isWelcomeLogged = true;
        }
    }
}

Helper.Env.isBackendMode = function () {
    if (typeof DEPLOY_ENVIROIMENT != 'undefined')
        if (DEPLOY_ENVIROIMENT == "DESIGNING") {
            return true;
        }
    return false;
};

Helper.Env.isInternalUsed = function ( embed_id ) {

    if( embed_id == "SF-3142083120" )
        return true;
    return false;
};


/**
 * Helper.Env.checkBrowserSupport
 * -------------------------------------------
 * Kiểm tra và log các tính năng trình duyệt quan trọng (cookie, localStorage, sessionStorage, serviceWorker, fetch, WebSocket).
 * Chỉ kiểm tra 1 lần trong 1 phiên để tránh log lặp.
 * Dùng để hỗ trợ debug các vấn đề liên quan tới trình duyệt không hỗ trợ đủ các tính năng cần thiết cho Navi+.
 */
Helper.Env.checkBrowserSupport = function () {
    // Kiểm tra nếu trạng thái đã được lưu trong window
    if (window._browserSupportChecked) {
        return;
    }

    // Thực hiện kiểm tra
    const supportStatus = {
        cookies: navigator.cookieEnabled,
        localStorage: typeof localStorage !== 'undefined',
        sessionStorage: typeof sessionStorage !== 'undefined',
        serviceWorkers: 'serviceWorker' in navigator,
        fetchAPI: typeof fetch === 'function',
        webSockets: 'WebSocket' in window
    };

    // Log trạng thái thành một dòng
    const statusLine = Object.entries(supportStatus)
        .map(([feature, isSupported]) => `${feature}: ${isSupported ? 'Supported' : 'Not Supported'}`)
        .join(', ');
        navidebug.log(statusLine);

    // Lưu trạng thái vào window để tránh gọi lại
    window._browserSupportChecked = true;
};

/**
 * Kiểm tra tính hợp lệ của embed dựa trên domain hiện tại.
 * Quy trình:
 *  1. Lấy domain shop từ section_setting['shop'] (bỏ www, port, khoảng trắng).
 *  2. Lấy domain hiện tại từ window.location.hostname (bỏ www, port, khoảng trắng).
 *  3. So sánh hai domain:
 *     - Nếu khác nhau, trả về true (embed KHÔNG hợp lệ).
 *     - Nếu giống nhau, trả về false (embed hợp lệ).
 * @param {Object} section_setting - Cấu hình section hiện tại, cần có thuộc tính 'shop'.
 * @returns {boolean} true nếu domain embed khác domain shop (không hợp lệ), ngược lại trả về false.
 */
Helper.Env.isInvalidEmbed = function( section_setting ) {
    if( this.isBackendMode() ) return false;

    // WordPress SSO: shop là "wp_TOKEN", không phải domain thật → bỏ qua domain check
    if( WpMarket.isActive(section_setting['env']) ) {
        return false;
    }

    var shop = navistart.normalizeDomainSync(section_setting['shop']);
    var currentDomain = navistart.normalizeDomainSync(window.location.hostname);

    if( shop != currentDomain )
        return true;

    return false;
}

/**
 * Dọn dẹp phần tử: gỡ các attribute và class chỉ định.
 * @param {Element} el - Phần tử cần xử lý
 * @param {Object} opts - { attr: ["data-bs-toggle", ...], class: ["_navi_loading", ...] }
 */
Helper.HTML.cleanupElement = function(el, opts) {
  opts = opts || {};
  var attrs = opts.attr || opts.attrs || [];
  var classes = opts.class || opts.classes || [];
  if (!Array.isArray(attrs)) attrs = [attrs];
  if (!Array.isArray(classes)) classes = [classes];
  attrs.forEach(function(name) {
    if (el.hasAttribute(name)) el.removeAttribute(name);
  });
  classes.forEach(function(cls) {
    if (el.classList.contains(cls)) el.classList.remove(cls);
  });
  return el;
};

/**
 * Gỡ toàn bộ event listeners: clone phần tử và thay thế, phần tử mới không còn listener.
 * @param {Element} element - Phần tử cần gỡ listener
 * @returns {Element} Phần tử mới (đã thay thế)
 */
Helper.HTML.removeAllEventListeners = function(element) {
  var newElement = element.cloneNode(true);
  element.parentNode.replaceChild(newElement, element);
  return newElement;
};

/**
 * Gỡ listener ở tất cả các con (1 level từ CSS selector). Con sâu hơn có click thì ko xử lý được.
 * Loại bỏ attr on:*, on:* (Svelte), aria-expanded; clone node để gỡ addEventListener; chặn onclick.
 */
Helper.HTML.removeChildrenListeners = function(newEl) {
  var allChildren = newEl.querySelectorAll('*');
  allChildren.forEach(function(child) {
    Array.from(child.attributes).forEach(function(attr) {
      if (attr.name.startsWith('on') || attr.name.startsWith('on:') || attr.name === 'aria-expanded')
        child.removeAttribute(attr.name);
    });
    var clone = child.cloneNode(true);
    clone.setAttribute('onclick', 'event.preventDefault();return;');
    child.parentNode.replaceChild(clone, child);
  });
};

Helper.HTML.parsePaddingMargin = function (paddingVars) {
    var padding = {
        "top": 0,
        "right": 0,
        "bottom": 0,
        "left": 0,
    };

    if( paddingVars == "" )
        return padding;

    paddingVars = String(paddingVars).strReplace("px", " ").strReplace("pt", " ").strReplace(",", " ").strReplace("|", " ").strReplace(";", " ");

    // Tách chuỗi padding thành mảng các giá trị
    var values = paddingVars.split(' ').map(Number);

    // Gán giá trị vào các thuộc tính của đối tượng padding
    switch (values.length) {
        case 1:
            padding.top = values[0];
            padding.right = values[0];
            padding.bottom = values[0];
            padding.left = values[0];
            break;
        case 2:
            padding.top = values[0];
            padding.right = values[1];
            padding.bottom = values[0];
            padding.left = values[1];
            break;
        case 3:
            padding.top = values[0];
            padding.right = values[1];
            padding.bottom = values[2];
            padding.left = values[1];
            break;
        case 4:
            padding.top = values[0];
            padding.right = values[1];
            padding.bottom = values[2];
            padding.left = values[3];
            break;
    }
    return padding;
};


Helper.HTML.formatPaddingTRBL = function( padding ) {
    if( padding.top == 0 & padding.right == 0 & padding.bottom == 0 & padding.left == 0 )
        return "";
    return ' padding: '+ padding.top +'px '+ padding.right +'px '+ padding.bottom +'px '+ padding.left +'px; '
}

Helper.HTML.formatMarginTRBL = function( margin ) {
    if( margin.top == 0 & margin.right == 0 & margin.bottom == 0 & margin.left == 0 )
        return "";
    return ' margin: '+ margin.top +'px '+ margin.right +'px '+ margin.bottom +'px '+ margin.left +'px; '
}

Helper.HTML.addStyleToMenu = function(naviman_appItem, inputStyle) {
    let html = '<style> ';
    html += inputStyle;
    html += ' </style>';
    naviman_appItem.insertAdjacentHTML('beforebegin', html);
}

Helper.HTML.addStyleToMenuAfterEnd = function(naviman_appItem, inputStyle) {
    let html = '<style> ';
    html += inputStyle;
    html += ' </style>';
    naviman_appItem.insertAdjacentHTML('afterend', html);
}

Helper.HTML.addStyleToHeader = function(styles) {
    var css = document.createElement('style');
    css.type = 'text/css';
    if (css.styleSheet)
        css.styleSheet.cssText = styles;
    else
        css.appendChild(document.createTextNode(styles));
    document.getElementsByTagName("head")[0].appendChild(css);
}

Helper.HTML.clearCSS_JS =  function (css) {
    if (typeof css == 'undefined')
        return "";
    css = css.trim();
    css = css.strReplace('<script>', '');
    css = css.strReplace('</script>', '');
    css = css.strReplace('<style>', '');
    css = css.strReplace('</style>', '');
    return css;
};

Helper.HTML.isExternalUrl = function(file_path) {
    if (file_path.length > 5) { // Kiểm tra độ dài tối thiểu
        return file_path.startsWith('http://') || file_path.startsWith('https://');
    }
    return false;
};

/*
Phương án giải quyết: Tính một lần chiều cao của ulLength và lưu vào attribute.
1. Hiện ulChildrent là cha của các li.child 
2. Tính offsetHeight và cộng vào ulLength
3. Lưu ulLength vào attribute
4. Khi hiển thị lại thì không cần tính toán lại (nếu có)
    */
Helper.HTML.getULLength = function(ulChildrent) {
    var ulLength = 0;
    if (ulChildrent.getAttribute('ulLength')) 
        ulLength = ulChildrent.getAttribute('ulLength');
    else {
        ulLength = 8; // Một con số bốc thuốc
        let liChildrent = ulChildrent.querySelectorAll("li.child");
        for (let i = 0; i < liChildrent.length; i++) 
            ulLength += liChildrent[i].offsetHeight;
        ulChildrent.setAttribute('ulLength', ulLength);
    }
    return ulLength;
}




Helper.hasVisibleSlideMenu = function() {
    var items = document.querySelectorAll('.naviItem.CONTEXT_SLIDE');
    for (var i = 0; i < items.length; i++) {
        if (window.getComputedStyle(items[i]).visibility === "visible")
            return true;
    }
    return false;
};

Helper.hideNaviOverlay = function () {
    if( document.getElementsByClassName("naviman_app_overlay") == null )
        return;
    if( document.getElementsByClassName("naviman_app_overlay").length == 0 )
        return;
    document.getElementsByClassName("naviman_app_overlay")[0].style.display = 'none';
}

Helper.showNaviOverlay = function () {
    if( document.getElementsByClassName("naviman_app_overlay") == null )
        return;
    if( document.getElementsByClassName("naviman_app_overlay").length == 0 )
        return;
    document.getElementsByClassName("naviman_app_overlay")[0].style.display = 'block';

/*    var body = document.getElementsByTagName('body')[0];
    body.style.overflow = 'hidden';
*/
}

Helper.closeAllDropdowns = function () {
    ZIndex.restoreAllElementsFromMax();
    ZIndex.restoreAllSectionZIndex();

    document.querySelectorAll('.naviman_app ul.children').forEach((item) => {
        item.style.display = "none";
    });
    document.querySelectorAll('.naviman_app span.arrow').forEach((item) => {
        item.style.display = "none";
    });

    document.querySelectorAll('.naviItem .menu-expand, .naviItem .menu-expand-level1, .naviItem .menu-expand-level2').forEach((item) => {
        item.classList.remove('menu-expand', 'menu-expand-level1', 'menu-expand-level2');
    });

    document.querySelectorAll('.naviman_app ul.children').forEach((item) => {
        item.style.height = "initial";
    });

    document.querySelectorAll('.naviman_app li.overlay-container').forEach((item) => {
        item.remove();
    });

    Helper.hideNaviOverlay();

    // Đảm bảo nếu đang dùng overlay_global để khóa body (BodyLocker)
    // thì khi đóng hết dropdown cũng mở khóa luôn.
    // Tuy nhiên, nếu đang có slide menu (CONTEXT_SLIDE) hiển thị
    // thì KHÔNG được tắt overlay_global, vì slide menu đang dùng chung overlay này.
    if (!Helper.hasVisibleSlideMenu()) {
        Helper.hideNaviOverlayGlobal();
    }

}

Helper.lockBodyScroll = function(isLock) {
  Helper_lockBodyScroll(isLock);
};

Helper.showNaviOverlayGlobal = function () {    
    const overlayGlobal = document.querySelector('.naviman_app_overlay_global');
    if (!overlayGlobal) return;
    //overlayGlobal.style.display = 'block';
    overlayGlobal.classList.add('is-open');
    Helper.lockBodyScroll(true);
}

Helper.hideNaviOverlayGlobal = function () {
    const overlayGlobal = document.querySelector('.naviman_app_overlay_global');
    if (!overlayGlobal) return;
    // overlayGlobal.style.display = 'none';
    overlayGlobal.classList.remove('is-open');
    Helper.lockBodyScroll(false);
}


Helper.waitForCssToLoad = function(callback, section_setting) {

    const checkInterval = setInterval(() => {
        const isCssLoaded = getComputedStyle(document.documentElement)
            .getPropertyValue('--is-navi-css-loaded')
            .trim();

        if (isCssLoaded) {
            clearInterval(checkInterval); // Dừng kiểm tra khi CSS đã tải
            callback(); // Gọi hàm khi CSS đã tải xong
        }
    }, 50); // Kiểm tra mỗi 50ms để tránh ảnh hưởng hiệu suất
}


// Nếu ko có domain thì sẽ thêm https:// vào đầu url
Helper.standalizeUrl = function(url) {
    if (typeof url !== 'string') return url;

    // Bỏ dấu / đầu và cuối
    const cleanedUrl = url.replace(/^\/+|\/+$/g, '');

    // Lấy phần đầu tiên (trước dấu /)
    const firstSegment = cleanedUrl.split('/')[0];

    // Kiểm tra nếu phần đầu có dấu . và trông giống domain
    const isDomain = /^[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(firstSegment);

    // Nếu là domain và chưa có http/https → thêm https://
    if (isDomain && !/^https?:\/\//i.test(url)) {
        return 'https://' + cleanedUrl;
    }

    return url;
}


Helper.MultiSite.checkDomainMatch = function(multiSitesString) {
  if (!multiSitesString) return false;

    const sites = multiSitesString
    .split(/[,;|\s]+/)
    .map(s => s.trim()
                .toLowerCase()
                .replace(/^https?:\/\//, '')   // bỏ http:// hoặc https://
                .replace(/^www\./, '')         // bỏ www.
                .replace(/\/+$/, '')           // bỏ dấu / cuối
                .replace(/^www\./, '')         // bỏ lại www nếu nó xuất hiện sau bước trước (phòng trường hợp www xuất hiện sau https)
    )
    .filter(s => s.length > 0);


  if (sites.length === 0) return false;

  const currentDomain = window.location.hostname
    .toLowerCase()
    .replace(/^www\./, '')
    .trim();

  return sites.some(pattern => {

    if (pattern.startsWith('*.')) {
      const base = pattern.slice(2);
      const matched = currentDomain.endsWith('.' + base);
      return matched;
    } else {
      const matched = currentDomain === pattern;
      return matched;
    }
  });
};

Helper.waitForVar__Loaded_SF = function(embedId, callback, maxRetry = 250, delay = 100) {
    const MAX_WAITING_SECONDS = 5;
    let retryCount = 0;
    const cssVarName = `--loaded-${embedId}`;
    const startTime = Date.now();

    function check() {
        const val = getComputedStyle(document.documentElement)
            .getPropertyValue(cssVarName)
            .trim();

        const elapsedSeconds = (Date.now() - startTime) / 1000;

        if (val === '1') {
            callback(); // Gọi hàm khi sẵn sàng
        } else if (elapsedSeconds >= MAX_WAITING_SECONDS) {
            navidebug.log(`⏱️ Timeout after ${MAX_WAITING_SECONDS}s: ${cssVarName} not loaded, executing callback anyway.`);
            callback(); // Nhắm mắt gọi callback luôn
        } else if (retryCount < maxRetry) {
            retryCount++;
            setTimeout(check, delay);
        } else {
            navidebug.warn(`⏱️ Timeout: ${cssVarName} not loaded after ${maxRetry} retries.`);
        }
    }

    check();
}

Helper.HTML.addLoadedFSAtBodyEnd = function(html, delay = 100) {
  function insert() {
    setTimeout(() => {
      document.body.insertAdjacentHTML('beforeend', html);
    }, delay);
  }

  if (document.readyState === 'complete') {
    insert(); // trang đã load xong
  } else {
    window.addEventListener('load', insert); // chờ toàn bộ trang load xong
  }
}

Helper.isMultiSite = function( section_setting ) {
    if( section_setting['multisite'] != "" )
        return true;
    return false;
}

Helper.isSectionMenu = function(embed_id, section_setting ) {
    if( embed_id != "" && (section_setting['not_sticky'] == true || section_setting['not_sticky'] == "true" ) ) 
        return true;
    return false;
}

/**
 * Helper.MultiSite.ConsoleDebug 
 * -------------------------------------------
 * Hàm này dùng để kiểm tra + ghi log ra console phục vụ debug multisite trong Navi+.
 * - Hiển thị domain hiện tại, multisite đang áp dụng (nếu có) và danh sách các site Shopify cấu hình.
 * - Hữu dụng để kiểm tra khớp domain, sai sót structs multisite, hoặc phát hiện nhúng từ ngoài Shopify.
 * - Log theo style thân thiện, dễ đọc; hỗ trợ dev kiểm soát nhanh cấu hình MultiSites.
 *
 * Sử dụng:
 *    Helper.MultiSite.ConsoleDebug(domain, section_setting, setting);
 */
Helper.MultiSite.ConsoleDebug = function(currentDomain, section_setting, setting) {
    const boxStyle = `
        background: #e6f4ea;
        color: #000;
        padding-left: 16px;
        padding-right: 16px;
        font-size: 11px;
        border-radius: 12px;
        display: block;
    `;

    navidebug.log(
        "%cNAVI+ MULTI-SITES" +
        "\n➤ Current domain:     " + currentDomain +
        "\n➤ Non-Shopify site:   " + section_setting['multisite'] + 
        "\n➤ Shopify sites:      " + setting['multiSites'],
        boxStyle
    );
};





/**
 * Kiểm tra xem menu (section) có cần bị ẩn khi sử dụng tính năng multiSites không.
 * Dùng trong trường hợp:
 *   - Có nhiều site được cấu hình hiển thị 1 menu duy nhất, tránh hiển thị trùng trên 2 site Shopify hoặc ngoài Shopify.
 *   - Dựa vào setting['multiSites'] và section_setting (môi trường, multisite embed, shop, ...)
 * Trả về:
 *   - true: Cần ẩn menu này trên trang hiện tại.
 *   - false: Vẫn cho phép hiển thị menu này.
 */
Helper.MultiSite.isInvalidEmbed = function (setting, section_setting) {
    var isHideByMultiSites = false;

    if (Helper.Env.isBackendMode())
        return false;

    if (isHadValue(setting['multiSites'])) {

        if( section_setting['multisite'] == "" )
        if( !window.Shopify )   {
            navidebug.log("❌ Multi-sites result: Not define multisite in embed code to Non-Shopify");
            isHideByMultiSites = true;            
        }
            
        navidebug.log("Ha: ", setting['multiSites']);
        if( Helper.MultiSite.checkDomainMatch(setting['multiSites']) ) {
            navidebug.log("   Multi-sites result: Match");    
            // Cần kiểm tra xem match nhưng lại dùng nhiều Shopify thì lỗ vốn.
            if( window.Shopify ) {
                if( window.Shopify["shop"] != section_setting["shop"] ) {
                    isHideByMultiSites = true;
                    navidebug.log("❌ Multi-sites result: Use 2 Shopify websites");
                }
            }                      

        }else {
            if( section_setting['multisite'] == "" ) {
                navidebug.log("   Multi-sites: Not match | But use the root Shopify site");    
            }else {
                // Có cấu hình multiSites trong backend và có cấu hình cả multisite trong mã nhúng.                 
                navidebug.log( "❌ Multi-sites result: Not match: Section on Non-Shopify: " + section_setting['multisite'] + " is not in Shopify sites: " +  setting['multiSites'] );
                isHideByMultiSites = true;
            }
        }

        
    }else {
        // Nếu không đặt multiSites trong các menu nhưng vẫn nhúng vào các trang ngoài thì bỏ qua
        // trường hợp 1: Nếu là trang ko phải shopify thì bỏ qua
        if( !window.Shopify ) {
            isHideByMultiSites = true;
        }
    }
    return isHideByMultiSites;    
}

/***
 * Cụm tính năng này giúp tăng điểm CLS khi dùng Navi+. naviman_app sẽ được ẩn cho đến
 * khi tải được file uigen.css về. Việc này chỉ áp dụng khi có loại menu CONTEXT_SLIDE 
 * gây xộc xệch form, còn ko thì thôi.
 */

Helper.CLS.hideNavimanApp = function (menuKindClass) {
    if( menuKindClass != "CONTEXT_SLIDE" )
        return '';

    if (window.__naviman_app_hidden__) return '';
    window.__naviman_app_hidden__ = true;
    return '<style>.naviman_app {display: none}</style>';
};

Helper.CLS.showNavimanApp = function () {
  document.querySelectorAll('.naviman_app').forEach(el => {
    const currentDisplay = window.getComputedStyle(el).display;
    if (currentDisplay === 'none') {
      el.style.setProperty('display', 'initial', 'important');
    }
  });
};


/* To Safari ****/
Helper.isSafari = function() {
    return /^((?!chrome|android).)*safari/i.test(navigator.userAgent);
}

Helper.getNewElementReplaceInsert = function(divNaviItem) {
    var tempElement = document.createElement('div');
    divNaviItem = '<div class="naviman_app">' + divNaviItem + '</div>';
    tempElement.innerHTML = divNaviItem;

    // Lấy phần tử thực sự từ chuỗi divNaviItem
    var newElement = tempElement.firstChild; 
    return newElement;
};

Helper.deployReplaceInsertMode = function(publishToPlaceKind, el_item, newElement) {
  if (!el_item || !newElement) {
    navidebug.warn("⚠️ deployReplaceInsertMode: el_item hoặc newElement không hợp lệ");
    return;
  }

  const mode = String(publishToPlaceKind).toLowerCase();

  switch (mode) {
    case "1":
    case "replace":
      // el_item.style.setProperty('display', 'none', 'important');
      Helper.strongHideElm( el_item ); 
      el_item.insertAdjacentElement("afterend", newElement);
      break;

    case "2":
    case "after":
      el_item.insertAdjacentElement("afterend", newElement);
      break;

    case "3":
    case "before":
      el_item.insertAdjacentElement("beforebegin", newElement);
      break;

    default:
        navidebug.warn(`⚠️ Unknown mode: ${publishToPlaceKind}`);
  }
};


/* Ẩn một đối tượng DOM đi một cách cẩn thận bằng các kết hợp tag, id và class */
Helper.strongHideElm = function(el_item) {
  if (!(el_item instanceof Element)) return;

  const tag = el_item.tagName.toLowerCase();
  const id = el_item.id ? `#${CSS.escape(el_item.id)}` : "";

  // Escape class để không lỗi với tên có ký tự đặc biệt (vd: mobile:hidden)
  const classes = el_item.classList.length
    ? "." + Array.from(el_item.classList).map(c => CSS.escape(c)).join(".")
    : "";

  const selector = `${tag}${id}${classes}`;

  const style = document.createElement("style");
  style.textContent = `${selector} { display: none !important; }`;
  document.head.appendChild(style);

  return selector; // trả về selector nếu muốn debug
};



Helper.waitToReplaceInsert = function(el, divNaviItem, mode = 'replace', timeout = 1000, interval = 100) {
  return new Promise((resolve, reject) => {
    const start = Date.now();
    const isSelector = (typeof el === 'string');

    const timer = setInterval(() => {
      const target = isSelector ? document.querySelector(el) : el;

      if (target) {

        var newElement = Helper.getNewElementReplaceInsert(divNaviItem);                

        clearInterval(timer);

        const waited = Date.now() - start;
        navidebug.log(`✅ Found Replace/Insert element after ${waited} ms`);

        Helper.deployReplaceInsertMode(mode, target, newElement);                                         

        resolve({ target, waited }); // Trả về cho await dùng
      } else {
        const waited = Date.now() - start;
        if (waited > timeout) {
            clearInterval(timer);
            const msg = `⏱️ Timeout (${timeout} ms): element not found -> ${el}`;
            navidebug.warn(msg);
            reject(new Error(msg));
        }
      }
    }, interval);
  });
};

Helper.deferCall = function(callback) {
    if (window.requestIdleCallback) {
        requestIdleCallback(callback);
    } else {
        setTimeout(callback, 0); // Dùng 0 thay vì 300 để chạy sớm hơn
    }
};





/********************************************************************************************************************/






    var Helper = Helper || {};  
Helper.ENV_VARS = Helper.ENV_VARS || {};


/**
 * Xử lý chuỗi ENV để tạo object chứa các biến môi trường
 *
 * Chuỗi đầu vào có thể chứa các khai báo dạng: VAR=val; hoặc VAR=val,
 *
 * Các bước xử lý:
 *  1. Tách chuỗi thành các phần tử dựa trên dấu ; hoặc ,, loại bỏ phần tử rỗng sau khi trim
 *  2. Với mỗi phần tử, tách thành 2 phần bởi dấu = (tên biến và giá trị)
 *  3. Xử lý tên biến:
 *     - Trim khoảng trắng hai đầu
 *     - Thay thế dấu cách " " bằng dấu "_"
 *  4. Xử lý giá trị:
 *     - Loại bỏ dấu nháy đơn (') và nháy đôi (") nếu có
 *     - Trim khoảng trắng hai đầu
 *  5. Tạo object envObj với key-value pairs từ các biến hợp lệ
 *  6. Log ra console để debug
 */
Helper.ENV_VARS.proceedEnvVars = function( envVars, embed_id ) {
    if( envVars == "" )
        return;


    var items = (envVars || "")
        .split(/;|,/)    // Tách từng biến qua dấu ; hoặc ,
        .map(s => s.trim()) // Loại bỏ khoảng trắng thừa
        .filter(s => s !== ""); // Chỉ lấy phần tử không rỗng

    var envObj = {};

    items.forEach(function(item) {
        var parts = item.split("="); // Tách tên biến và giá trị
        if(parts.length < 2) return;

        // Xử lý tên biến: trim và thay " " bằng "_"
        var name = parts[0].trim().replace(/ /g, '_');

        // Xử lý value: bỏ dấu " và ', rồi trim
        var value = parts.slice(1).join("=")
            .replace(/["']/g, "")
            .trim();

        if(name && value) {
            envObj[name] = value;
        }
    });

    Helper.ENV_VARS.proceedFontEnvVars(envObj, embed_id);

};

Helper.ENV_VARS.proceedFontEnvVars = function( envObj, embed_id ) {
    for( var key in envObj ) {
        if( key == "ENV_FONT_SIZE" ) {
            Helper.HTML.addLoadedFSAtBodyEnd('<style> #' + embed_id + ' .name { font-size: '+  envObj[key] +'; } </style>', 0);
        }
    }
}
    // ===========================
// MiniSnackbar
// ===========================
class MiniSnackbar {
    constructor() {
      this.snackbar = null;
      this.isGoogleApp = (navigator.userAgent || '').includes('GSA');
    }
  
    show(message, duration = 3000, type = 'info') {
      // Xóa snackbar cũ
      if (this.snackbar) this.snackbar.remove();
  
      const el = document.createElement('div');
      el.className = 'mini-snackbar mini-snackbar-' + type;
      el.textContent = message;
  
      const baseColor = {
        success: 'rgba(76,175,80,0.9)',
        error: 'rgba(244,67,54,0.9)',
        warning: 'rgba(255,152,0,0.9)',
        info: 'rgba(33,150,243,0.9)',
      }[type] || 'rgba(33,150,243,0.9)';
  
      Object.assign(el.style, {
        position: this.isGoogleApp ? 'absolute' : 'fixed',
        left: '50%',
        bottom: '0px',
        transform: 'translateX(-50%)',
        padding: '4px 14px',
        borderRadius: '6px 6px 0px 0px',
        fontSize: '14px',
        color: '#fff',
        backgroundColor: baseColor,
        opacity: '0',
        transition: 'opacity 0.3s, transform 0.3s',
        width: '100%',
        zIndex: 9999,
        pointerEvents: 'none',
        boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
      });
  
      document.body.appendChild(el);
      this.snackbar = el;
      this.updatePosition(); // set vị trí thực tế nếu Google App
  
      // Hiện dần
      requestAnimationFrame(() => {
        el.style.opacity = '1';
        el.style.transform = 'translateX(-50%) translateY(0)';
      });
  
      // Ẩn sau duration
      setTimeout(() => this.hide(), duration);
    }
  
    updatePosition() {
      if (!this.isGoogleApp || !this.snackbar) return;
      const el = this.snackbar;
      const vh = window.innerHeight;
      const scrollY = window.scrollY;
      const height = el.offsetHeight;
      el.style.top = (scrollY + vh - height - 16) + 'px';
    }
  
    hide() {
      if (!this.snackbar) return;
      this.snackbar.style.opacity = '0';
      this.snackbar.style.transform = 'translateX(-50%) translateY(20px)';
      setTimeout(() => {
        if (this.snackbar) this.snackbar.remove();
        this.snackbar = null;
      }, 300);
    }
  }
  
  
  const miniSnackbar = new MiniSnackbar();
  
  
// =========================== 
// END: MiniSnackbar
// ===========================     // ===========================
// FixGoogleApp
// Để giả lập Google App trên Chrome ta gõ cái này vào console: 
/*
Object.defineProperty(navigator, 'userAgent', {
  value: navigator.userAgent + ' GSA',
  configurable: true,
});
*/

// ===========================

class FixGoogleApp {
    constructor() {
        this.isGoogleApp = /GSA/i.test(navigator.userAgent);
        this._sessionKey = 'fixGoogleApp_restored';
    }

    /**
     * 🧩 Step 1: Kiểm tra xem có tồn tại bottom bar hợp lệ hay không
     * Điều kiện:
     * - Có div chứa đủ 3 class: naviItem, STICKY_TABBAR, mobile-bottom
     * - Và computedStyle.bottom === '0px'
     * 
     * @returns {HTMLElement|null}
     */
    findBottomBar() {
        const bars = [...document.querySelectorAll('div.naviItem.STICKY_TABBAR.mobile-bottom')];
        if (!bars.length) {
            // miniSnackbar?.show?.('❌ No valid bottom bar found', 1500, 'warning');
            return null;
        }

        const found = bars.find(el => getComputedStyle(el).bottom === '0px');
        if (found) {
            // miniSnackbar?.show?.('✅ Bottom bar found with bottom=0', 1500, 'info');
            return found;
        }

        // miniSnackbar?.show?.('⚠️ Bottom bar exists but bottom ≠ 0', 1500, 'warning');
        return null;
    }

    /**
     * 🧩 Step 2: Kiểm tra xem đã fix trong session này chưa
     */
    isAlreadyFixed() {
        return sessionStorage.getItem(this._sessionKey) === 'true';
    }

    /**
     * 🧩 Step 3: Áp dụng fix layout (chính là logic bạn đã có)
     */
    fixLayout() {
        const app = document.querySelector('#naviman_app');
        if (!app) {
            // miniSnackbar?.show?.('⚠️ #naviman_app not found', 1500, 'warning');
            return;
        }

        // backup style ban đầu
        this._originalStyles = {
            position: app.style.position || '',
            top: app.style.top || '',
            left: app.style.left || '',
            width: app.style.width || '',
            height: app.style.height || '',
            zIndex: app.style.zIndex || '',
            overflow: app.style.overflow || '',
        };

        // ép full màn hình
        Object.assign(app.style, {
            position: 'fixed',
            top: '0',
            left: '0',
            width: '100%',
            height: '100%',
            zIndex: '9999',
            overflow: 'hidden',
        });

        // miniSnackbar?.show?.('✅ #naviman_app forced full screen', 1500, 'info');

        // restore lại khi user scroll hoặc chạm
        const restore = () => {
            if (this._restored) return;
            this._restored = true;

            Object.entries(this._originalStyles).forEach(([k, v]) => (app.style[k] = v));
            sessionStorage.setItem(this._sessionKey, 'true');
            // miniSnackbar?.show?.('♻️ Restored original #naviman_app style', 1500, 'info');

            window.removeEventListener('scroll', restore);
            document.removeEventListener('touchmove', restore);
        };

        window.addEventListener('scroll', restore, { passive: true });
        document.addEventListener('touchmove', restore, { passive: true });
    }

    /**
     * 🚀 Entry point
     *  - Nếu không phải Google App thì bỏ qua
     *  - Nếu không có bottom bar hoặc bottom ≠ 0 thì bỏ qua
     *  - Nếu đã fix trong session thì bỏ qua
     *  - Ngược lại, áp dụng fix
     */
    apply() {
        // navidebug.log('----- FixGoogleApp apply called -----');
        if (!this.isGoogleApp) {
            // navidebug.log('Not in Google App → skip');
            return;
        }

        const run = () => {
            const bottomBar = this.findBottomBar();
            if (!bottomBar) return;

            if (this.isAlreadyFixed()) {
                // miniSnackbar?.show?.('⏩ Skip: Already fixed this session', 1500, 'info');
                return;
            }

            // ✅ Nếu qua được tất cả điều kiện, tiến hành fix
            this.fixLayout();
        };

        if (document.readyState === 'complete' || document.readyState === 'interactive') run();
        else document.addEventListener('DOMContentLoaded', run);
    }
}



/*******************************************************
   Khởi động khi load xong trang
*******************************************************/
if (!window.fixGoogleAppInitialized) {
    window.fixGoogleAppInitialized = true;
    const fix = new FixGoogleApp();

    window.addEventListener('load', () => {
        setTimeout(() => fix.apply('.naviItem'), 1000);
    });
}

// ===========================
// End of FixGoogleApp
// ===========================    

    if (!window._naviGALoaded) {
  window._naviGALoaded = true;

  // Enable debug mode trước khi config
  // https://analytics.google.com/analytics/web/?authuser=1#/a375318433p513334130/admin/debugview/overview?params=_u..nav%3Dmaui
  window.isGADebugMode = false;

  var blackListDomains = 
    [
      "45676e-4.myshopify.com", // https://www.alasil.ae
      "naviplus.io", 
    ];

  // 1. LOAD GOOGLE TAG ASYNC
  if (!document.querySelector('script[src*="googletagmanager.com/gtag/js"]')) {
    var gtagScript = document.createElement("script");
    gtagScript.async = true;
    gtagScript.src = "https://www.googletagmanager.com/gtag/js?id=G-ST5B8SVH5B";
    document.head.appendChild(gtagScript);
  }

  // 2. KHAI BÁO GTAG
  window.dataLayer = window.dataLayer || [];
  window.gtag = window.gtag || function(){ dataLayer.push(arguments); };

  // 3. CONFIG GA
  // Lấy shop domain từ script element hoặc window variable
  let domain = null;
  const cs = document.currentScript;
  if (cs) {
    domain = cs.getAttribute('shop');
  } else {
    // Fallback: tìm script có shop attribute
    const scripts = document.querySelectorAll('script[shop]');
    if (scripts.length) domain = scripts[scripts.length - 1].getAttribute('shop');
  }

  // Nếu domain nằm trong blackListDomains thì không gắn thẻ GA luôn
  if (blackListDomains.includes(domain)) {
    console.warn("[Navi+] GA tag not attached - domain in black list:", domain);
  } else {
    setTimeout(() => {
      gtag("set", { debug_mode: window.isGADebugMode });
      gtag("js", new Date());
      if( window.isGADebugMode ) 
        gtag("config", "G-ST5B8SVH5B", { 'debug_mode':true });
      else 
        gtag("config", "G-ST5B8SVH5B");
    }, 200);
  }

  // 4. HÀM LOG EVENT CHUNG
  window.logGAEvent = function(action, extra = {}) {

    // Lấy shop từ script element hoặc window variable
    let domain = null;
    const cs = document.currentScript;
    if (cs) {
      domain = cs.getAttribute('shop');
    } else {
      // Fallback: tìm script có shop attribute
      const scripts = document.querySelectorAll('script[shop]');
      if (scripts.length) domain = scripts[scripts.length - 1].getAttribute('shop');
    }

    // GA4 event format: event_name + event parameters
    const eventParams = {
      navi_event_category: 'naviplus_app',
      navi_event_label: action,
      navi_domain: domain,
      navi_url: location.href,
      navi_platform: /Mobile|Android|iPhone/i.test(navigator.userAgent) ? "M" : "D",
      ...extra
    };

    // Nếu domain nằm trong blackListDomains, không gửi event
    if (blackListDomains.includes(domain)) {
      navidebug.warn("GA event not sent:", action, eventParams);
      return;
    }       

    // Đảm bảo gtag đã sẵn sàng
    if (typeof gtag === 'function') {
      gtag("event", action, eventParams);
      // navidebug.log("NAVI+ GA EVENT:", action, eventParams);
    } else {
      // Nếu chưa sẵn sàng, đợi một chút rồi thử lại
      setTimeout(() => {
        if (typeof gtag === 'function') {
          if( isGADebugMode ) 
            gtag("event", action, eventParams, { 'debug_mode':true });
          else
            gtag("event", action, eventParams);

          // navidebug.log("NAVI+ GA EVENT (retry):", action, eventParams);
        } else {
          navidebug.warn("GA not ready, event not sent:", action, eventParams);
        }
      }, 500);
    }
  };
}    

    var Menu = Menu || {}; 
Menu.Common = Menu.Common || {};
Menu.Common.Level1 = Menu.Common.Level1 || {}; 

Menu.Common.checkContainKeywords = function(isDisplayed, naviItem ) {

    if( !isDisplayed )
        return false;

    if (isHadValue(naviItem["data"]["setting"]['publishContainKeyword'])) {
        isDisplayed = Helper.String.isUrlContain(naviItem["data"]["setting"]['publishContainKeyword']);
        if( isDisplayed == false )
            navidebug.log( naviItem["embed_id"] + " is hide because DONOT contain keyword: " + naviItem["data"]["setting"]['publishContainKeyword']);
    }
    
    if (isHadValue(naviItem["data"]["setting"]['publishDontContainKeyword'])) {
        isDisplayed = !Helper.String.isUrlContain(naviItem["data"]["setting"]['publishDontContainKeyword']);
        if( isDisplayed == false )
            navidebug.log( naviItem["embed_id"] + " is hide because contain keyword: " + naviItem["data"]["setting"]['publishDontContainKeyword']);
    }

    return isDisplayed;
}

Menu.Common.checkPlatformMode = function(isDisplayed, naviItem) {
    if( !isDisplayed )
        return false;

    var isOnMobile = window.innerWidth <= 768;

    if( isOnMobile )
        if( naviItem["data"]["setting"]["mobileDisplay"] == false || naviItem["data"]["setting"]["mobileDisplay"] == 'false' )
            isDisplayed = false;
    if( !isOnMobile )
        if( naviItem["data"]["setting"]["desktopDisplay"] == false || naviItem["data"]["setting"]["desktopDisplay"] == 'false' )
            isDisplayed = false;

    if( isDisplayed == false ) 
        navidebug.log( naviItem["embed_id"] + " is hide. The cause is did not active for this platform (mobile/desktop) " );

    return isDisplayed;
}

/**
 * Kiểm tra menu có nên được vẽ vào DOM để hỗ trợ responsive.
 * Vẽ khi mobileDisplay hoặc desktopDisplay = true, để CSS media query ẩn/hiện theo viewport.
 * Dùng thay checkPlatformMode khi muốn responsive resize (vẽ cả hai platform, CSS điều khiển hiển thị).
 * @param {Object} naviItem - Navi item có data.setting.mobileDisplay, desktopDisplay
 * @returns {boolean}
 */
Menu.Common.shouldDrawForResponsive = function(naviItem) {
    var setting = naviItem["data"]["setting"];
    var mobileDisplay = setting["mobileDisplay"];
    var desktopDisplay = setting["desktopDisplay"];
    var mobileOk = mobileDisplay !== false && mobileDisplay !== 'false';
    var desktopOk = desktopDisplay !== false && desktopDisplay !== 'false';
    return mobileOk || desktopOk;
}

Menu.Common.initHTMLAppOverlayClasses = function() {
    if( document.getElementsByClassName("naviman_app_overlay").length == 0 )
        naviman_app.insertAdjacentHTML('afterbegin', '<div class="naviman_app_overlay"> </div>');
    if( document.getElementsByClassName("naviman_app_overlay_global").length == 0 )
        //document.body.insertAdjacentHTML('afterend', '<div class="naviman_app_overlay_global"> </div>');
    document.body.insertAdjacentHTML('afterbegin', '<div class="naviman_app_overlay_global">&nbsp;</div>');

};

/*****************************************************************************************************/

Menu.Common.Level1.generateExpandArrowShow = function( setting, cssNaviPrefix, menuKind ) {
    var addHtml = "";

    if( menuKind == NAVIGLOBAL['MENU_KINDS']['CONTEXT_SLIDE'] || 
        menuKind == NAVIGLOBAL['MENU_KINDS']['SECTION_DESKTOP_MEGAMENU'] ||
        menuKind == NAVIGLOBAL['MENU_KINDS']['SECTION_MOBILE_MEGAMENU']
    )
        {
            if (!isSettingBeTrue(setting['expandArrowShow'], true)) {

                addHtml += cssNaviPrefix + ' ul.navigation > li.is-parent-top::after { content: "" !important; } ';
                addHtml += cssNaviPrefix + ' ul.navigation > li.is-parent::after { content: "" !important; } ';
                var paddingRight = 16;
                if( menuKind == NAVIGLOBAL['MENU_KINDS']['SECTION_MOBILE_MEGAMENU'] )
                    paddingRight = 12;                

                addHtml += cssNaviPrefix + ' ul.navigation > li.item.is-parent-top { padding-right: '+ paddingRight +'px !important; } ';
                
            }
        }  
    return addHtml;
};


/**
 * _arrowIconClassToContent( iconClass )
 * Convert RemixIcon class name (VD: "ri-arrow-right-s-line") sang ký tự unicode
 * bằng cách đọc CSS ::before content của một element tạm thời.
 * Remixicon định nghĩa icon qua ::before, nên đây là cách đáng tin cậy nhất
 * mà không cần lookup table.
 * Trả về ký tự unicode (string), hoặc '' nếu không resolve được.
 */
var _arrowIconClassToContent = function(iconClass) {
    if (!iconClass) return '';
    var temp = document.createElement('i');
    temp.className = iconClass;
    temp.style.cssText = 'position:absolute;visibility:hidden;left:-9999px;';
    document.body.appendChild(temp);
    var content = window.getComputedStyle(temp, '::before').getPropertyValue('content');
    document.body.removeChild(temp);
    // getComputedStyle trả về dạng '"<char>"' hoặc 'none' → strip dấu nháy
    if (!content || content === 'none' || content === 'normal') return '';
    return content.replace(/^["']|["']$/g, '');
};

/**
 * generateArrowStyle( setting, cssNaviPrefix, menuKind )
 * Override màu và/hoặc icon của expand arrow nếu arrowStyle được khai báo.
 * Dùng ID selector (Helper.String.classToID) để thắng CSS textColor arrow ở uigen_generateCSS line 35.
 * Chỉ áp dụng khi có ít nhất 1 trường color/icon khác rỗng.
 *
 * setting.arrowStyle = { color: '#FF0000', opacity: '70', icon: 'ri-arrow-right-s-line' }
 *   opacity 0–100 (%), để trống = dùng mặc định 30.
 *   icon = RemixIcon class name, để trống = giữ icon mặc định.
 */
Menu.Common.Level1.generateArrowStyle = function(setting, cssNaviPrefix, menuKind) {
    var addHtml = "";
    var as = setting['arrowStyle'];
    if (!as || typeof as !== 'object') return addHtml;

    var colorCSS = '';
    if (isHadValue(as['color'])) {
        var opacity = isHadValue(as['opacity']) ? parseInt(as['opacity']) : 30;
        colorCSS = 'color: ' + Helper.Color.hexToRgb(as['color'], opacity) + ' !important; ';
    }

    var sizeCSS = '';
    if (isHadValue(as['size'])) {
        sizeCSS = 'font-size: ' + parseInt(as['size']) + 'px !important; ';
    }

    var iconCSS = '';
    if (isHadValue(as['icon'])) {
        var unicodeChar = _arrowIconClassToContent(as['icon']);
        if (unicodeChar) {
            iconCSS = 'content: "' + unicodeChar + '" !important; ';
        }
    }

    if (colorCSS || sizeCSS || iconCSS) {
        // Target cả level1 (is-parent-top) và level2+ (is-parent bên trong)
        var idSel = Helper.String.classToID(cssNaviPrefix);
        var sel = idSel + ' ul > li.is-parent-top::after, '
                + idSel + ' ul > li.is-parent-top ul li.is-parent::after';
        addHtml += sel + ' { ' + colorCSS + sizeCSS + iconCSS + '} ';
    }

    return addHtml;
};


Menu.Common.Level1.generateBackground = function(setting, cssNaviPrefix, menuKind) {
    var addHtml = "";
    if (isSettingBeTrue(setting['level1BackgroundHide'])) { // Nếu không có nền thì bỏ nền và bỏ bóng.
        addHtml += cssNaviPrefix + '{ background: initial; } ';
        addHtml += cssNaviPrefix + '{ box-shadow: none !important; } ';
    }else {
        if (isHadValue(setting['backgroundImage'])) {
            if (setting['backgroundImage'].includes("?")) {
                // Xử lý duy nhất trường hợp có opacity cho background Image
                var bg = setting['backgroundImage'].split("?");
                var bgImage = bg[0];
                var bgOpacity = parseInt(bg[1]);
                if (bgOpacity != 0) {
                    addHtml += cssNaviPrefix + '{ background-image: url("' + bgImage + '"); background-size: cover; } ';
                    addHtml += cssNaviPrefix + '{ background-color: ' + hexToRgba(setting['backgroundColor'], 1 - (bgOpacity / 100)) + '; background-blend-mode: hue; } ';
                } else {
                    addHtml += cssNaviPrefix + '{ background: ' + setting['backgroundColor'] + ' } ';
                    addHtml += cssNaviPrefix + '{ background-image: url("' + bgImage + '"); background-size: cover; } ';
                }
            } else {
                addHtml += cssNaviPrefix + '{ background: ' + setting['backgroundColor'] + ' } ';
            }
        } else { // Nếu ko có background thì dùng màu bình thường.
            if (isHadValue(setting['backgroundColor']))
                addHtml += cssNaviPrefix + '{ background: ' + setting['backgroundColor'] + ' } ';
            else 
                addHtml += cssNaviPrefix + '{ background: initial; } ';
        }
    }
    return addHtml;
};


Menu.Common.Level1.generateDropshadow = function(setting, cssNaviPrefix, menuKind) {
    var addHtml = "";
    if (! isSettingBeTrue(setting['level1Dropshadow'], true)) { // Nếu không có nền thì bỏ nền và bỏ bóng.
        addHtml += cssNaviPrefix + ' { box-shadow: none !important; } ';
    }
    return addHtml;
};

Menu.Common.Level1.generateHeight = function(setting, cssNaviPrefix, menuKind) {
    var addHtml = "";
    
    addHtml += cssNaviPrefix + 'ul li.item { height: ' + setting['height'] + 'px } ';

    /* Logic là: Chỉ có các dropdown menu dạng megamenu thì mới set height, 
    còn lại thì nó sẽ Hug theo content (và content thì set height) */
    if( menuKind == NAVIGLOBAL['MENU_KINDS']['SECTION_DESKTOP_MEGAMENU'] ||
        menuKind == NAVIGLOBAL['MENU_KINDS']['SECTION_MOBILE_HEADER'] ||
        menuKind == NAVIGLOBAL['MENU_KINDS']['SECTION_MOBILE_MEGAMENU'] 
    ) {    
        addHtml += cssNaviPrefix + ' ul.navigation { min-height: ' + setting['height'] + 'px } ';
    }

    return addHtml;
};


Menu.Common.Level1.generateBorderRadius = function(setting, cssNaviPrefix, menuKind) {
    var addHtml = "";

    addHtml += cssNaviPrefix + '{ border-radius: ' + setting['borderRadius'] + 'px } ';
    addHtml += cssNaviPrefix + ' ul li ul.children { border-radius: ' + setting['borderRadius'] + 'px; } ';

    // Setup border-radius của phần từ đầu tiên và cuối cùng. 
    addHtml += cssNaviPrefix + ' ul li.item:first-child { border-radius: ' + setting['borderRadius'] + 'px 0px 0px ' + setting['borderRadius'] + 'px; } ';
    addHtml += cssNaviPrefix + ' ul li.item:last-child { border-radius: 0px ' + setting['borderRadius'] + 'px ' + setting['borderRadius'] + 'px 0px; } ';


    /* Chỉ quan tâm đến layout với dạng sticky tabbar **************************/
    if( menuKind == NAVIGLOBAL['MENU_KINDS']['STICKY_TABBAR'] ) {    
        if (isHadValue(setting['layout'])) {
            if (setting['layout'] == NAVIGLOBAL['LAYOUT']['DEFAULT'] || setting['layout'] ==  NAVIGLOBAL['LAYOUT']['HIGHLIGHT']) {
                // Nếu sát lề dưới thì chỉ bo vong lề dưới thôi. 
                if (setting["settingMargin"]["bottom"] == 0 || setting["settingMargin"]["bottom"] == "0" || setting["settingMargin"]["bottom"] == "" )                
                    addHtml += cssNaviPrefix + '{ border-radius: ' + setting['borderRadius'] + 'px ' + setting['borderRadius'] + 'px 0px 0px } ';
            }

            if (setting['layout'] ==  NAVIGLOBAL['LAYOUT']['FLOATING']) {
                // Do nothing
            }

            if (setting['layout'] ==  NAVIGLOBAL['LAYOUT']['FAB']) {
                // Nếu là float button thì level có border-radius: 1/2
                addHtml += cssNaviPrefix + ' ul li ul.children { border-radius: ' + (setting['borderRadius'] / 2) + 'px;} ';
            }
        }
    } 
    
    return addHtml;
};

Menu.Common.Level1.generateOpacity = function(setting, cssNaviPrefix, menuKind) {
    var addHtml = "";

    if (isHadValue(setting['opacity']))
        addHtml += cssNaviPrefix + '{ opacity: ' + (setting['opacity'] / 100) + ' } ';

    return addHtml;
};

Menu.Common.Level1.generatePaddingMargin = function( setting, cssNaviPrefix, menuKind ) {
    var addHtml = "";
    addHtml += cssNaviPrefix + ' { margin: ' +
        setting['settingMargin']['top'] + 'px ' +
        setting['settingMargin']['right'] + 'px ' +
        setting['settingMargin']['bottom'] + 'px ' +
        setting['settingMargin']['left'] + 'px ' +
        ' } ';
    addHtml += cssNaviPrefix + ' { padding: ' +
        setting['settingPadding']['top'] + 'px ' +
        setting['settingPadding']['right'] + 'px ' +
        setting['settingPadding']['bottom'] + 'px ' +
        setting['settingPadding']['left'] + 'px ' +
        ' } ';
    return addHtml;
};

/* 

Menu.Common.Level1.generateHeight = function(menuKind, cssNaviPrefix, setting) {
    var addHtml = "";

    return addHtml;
};


*/

Menu.Common.isMenuKind = function( menuKind, kind ) {
    /**
     * Checks if the given menuKind matches the specified kind category.
     * 
     * @param {string} menuKind - The menu kind to check.
     * @param {string} kind - The category to check against. It can be "STICKY", "SECTION", or "CONTEXT".
     * @returns {boolean} - Returns true if the menuKind matches the specified kind category, false otherwise.
     * 
     * Example usage:
     * var menuKind = NAVIGLOBAL['MENU_KINDS']['STICKY_TABBAR'];
     * var kind = "STICKY";
     */
    kind = kind.toUpperCase();
    if( kind == "STICKY" ) {
        if( menuKind == NAVIGLOBAL['MENU_KINDS']["STICKY_TABBAR"] ||
            menuKind == NAVIGLOBAL['MENU_KINDS']["STICKY_MOBILE_HEADER"] ||
            menuKind == NAVIGLOBAL['MENU_KINDS']["STICKY_FAB_SUPPORT"] )
            return true;
        else
            return false;
    }

    if( kind == "SECTION" ) {
        if( menuKind == NAVIGLOBAL['MENU_KINDS']["SECTION_MOBILE_HEADER"] ||
            menuKind == NAVIGLOBAL['MENU_KINDS']["SECTION_MOBILE_MEGAMENU"] ||
            menuKind == NAVIGLOBAL['MENU_KINDS']["SECTION_MOBILE_GRID"] ||
            menuKind == NAVIGLOBAL['MENU_KINDS']["SECTION_MOBILE_BANNER"] ||
            menuKind == NAVIGLOBAL['MENU_KINDS']["SECTION_DESKTOP_MEGAMENU"] )
            return true;
        else
            return false;
    }

    if( kind == "CONTEXT" ) {
        if( menuKind == NAVIGLOBAL['MENU_KINDS']["CONTEXT_SLIDE"])
            return true;
        else
            return false;
    }
    navidebug.error("ERROR: isMenuKind not working ********\/\/\/");
    return false;
};


Menu.Common.displayNaviItem_Container =  function( menuKindClass, embed_id, isMultiSite = false ) {
    if(!isMultiSite)
    if (menuKindClass == "CONTEXT_SLIDE")
        return;

    const embedEl = document.getElementById(embed_id);
    embedEl?.closest('.naviItem_Container')?.style.setProperty('display', '');
};

/**
 * Căn arrow (::after) cho item có submenu trong dropdown (li.is-parent, level 2→3) theo tâm dòng .name.
 * CONTEXT_SLIDE dùng --navi-slide-arrow-y riêng → bỏ qua.
 *
 * @param {string} embed_id
 */
Menu.Common.alignDropdownArrowsToName = function (embed_id) {
    var root = document.getElementById(embed_id);
    if (!root || root.classList.contains("CONTEXT_SLIDE")) return;

    var items = root.querySelectorAll("li.is-parent");
    for (var i = 0; i < items.length; i++) {
        var li = items[i];
        var nameEl = li.querySelector(".inner .name");
        if (!nameEl) {
            li.style.removeProperty("--navi-dropdown-arrow-y");
            continue;
        }
        var liRect = li.getBoundingClientRect();
        var nameRect = nameEl.getBoundingClientRect();
        if (liRect.height < 2 || nameRect.height < 1) {
            li.style.removeProperty("--navi-dropdown-arrow-y");
            continue;
        }
        var centerY = nameRect.top - liRect.top + nameRect.height / 2;
        li.style.setProperty("--navi-dropdown-arrow-y", centerY + "px");
    }
};

/**
 * Gọi lại căn arrow dropdown sau khi mở panel / ảnh load.
 *
 * @param {string} embed_id
 */
Menu.Common.scheduleDropdownArrowsAlign = function (embed_id) {
    if (!embed_id) return;
    var run = function () {
        Menu.Common.alignDropdownArrowsToName(embed_id);
    };
    requestAnimationFrame(function () {
        requestAnimationFrame(run);
    });
    [0, 50, 150, 400, 800].forEach(function (ms) {
        setTimeout(run, ms);
    });
    var root = document.getElementById(embed_id);
    if (!root) return;
    var imgs = root.querySelectorAll("img");
    for (var j = 0; j < imgs.length; j++) {
        var im = imgs[j];
        if (im.complete) continue;
        im.addEventListener("load", run, { once: true });
    }
};

/**
 * Một lần: resize / load / fonts → align lại dropdown cho mọi menu tabbar / mega / section header (không slide).
 */
Menu.Common.initDropdownArrowAlignListeners = function () {
    if (Menu.Common._dropdownArrowAlignListenersBound) return;
    Menu.Common._dropdownArrowAlignListenersBound = true;

    var runAll = function () {
        if (!window.navimanData || !Array.isArray(window.navimanData)) return;
        if (typeof NAVIGLOBAL === "undefined") return;
        var kinds = [
            NAVIGLOBAL["MENU_KINDS"]["STICKY_TABBAR"],
            NAVIGLOBAL["MENU_KINDS"]["STICKY_MOBILE_HEADER"],
            NAVIGLOBAL["MENU_KINDS"]["STICKY_FAB_SUPPORT"],
            NAVIGLOBAL["MENU_KINDS"]["SECTION_DESKTOP_MEGAMENU"],
            NAVIGLOBAL["MENU_KINDS"]["SECTION_MOBILE_MEGAMENU"],
            NAVIGLOBAL["MENU_KINDS"]["SECTION_MOBILE_HEADER"]
        ];
        window.navimanData.forEach(function (n) {
            if (kinds.indexOf(n.menuKind) >= 0 && Menu.Common.alignDropdownArrowsToName)
                Menu.Common.alignDropdownArrowsToName(n.embed_id);
        });
    };

    var debounceTimer = null;
    window.addEventListener("resize", function () {
        if (debounceTimer) clearTimeout(debounceTimer);
        debounceTimer = setTimeout(function () {
            debounceTimer = null;
            requestAnimationFrame(runAll);
        }, 100);
    });
    window.addEventListener("load", function () {
        requestAnimationFrame(runAll);
    });
    if (document.fonts && document.fonts.ready) {
        document.fonts.ready.then(function () {
            requestAnimationFrame(runAll);
        });
    }
};
    var Menu = Menu || {}; 
Menu.Sticky = Menu.Sticky || {}; 


Menu.Sticky.checkStickyDisplay = function(isDisplayed, naviItem, isNaviSection ) {
  if( !isDisplayed )
      return false;

  if (naviItem["data"]["setting"]["displayGlobal"] == null || naviItem["data"]["setting"]["displayGlobal"] == "0") {
      // Logic: Nếu nhưng ko bật nhưng là block thì vẫn hiển thị bình thường.
      isDisplayed = false;
      if( isNaviSection ) isDisplayed = true;
  }else {
      let displayGlobalPages = naviItem["data"]["setting"]["displayGlobalPages"];
      let currentTemplate = getCurrentTemplate();

      if (!displayGlobalPages.includes(currentTemplate)) {
          isDisplayed = false;
      }
  }
  if( isDisplayed == false ) {
    navidebug.log( naviItem["embed_id"] + " is hide. The cause is the displayGlobal: off" );
      return;
  }

  return isDisplayed;
};

Menu.Sticky.fixCSS_adjustLevel3Items_LeftRight_Desktop = function(menuItem, isNaviSection, menuKind, embed_id, setting) {
    if(menuKind == NAVIGLOBAL['MENU_KINDS']['STICKY_TABBAR'] ) { 

        let ulChildrent = menuItem.querySelector('ul.children');

        var parent = ulChildrent.parentElement.parentElement;
        var granpa = parent.parentElement.parentElement;
        var root = granpa.parentElement;        

        if (setting.desktopPosition == NAVIGLOBAL['DESKTOP_POSITION']['RIGHT_TOP'] || setting.desktopPosition == NAVIGLOBAL['DESKTOP_POSITION']['RIGHT_FULL_TOP'] || setting.desktopPosition == NAVIGLOBAL['DESKTOP_POSITION']['RIGHT_FULL_CENTER']) {
            ulChildrent.style.top = root.offsetTop +  parent.offsetTop + 82 + "px"; // Top của level 3 trùng với level 2 - 82 chả hiểu vì sao, cứ chọn đại

            ulChildrent.style.left = "initial";
            ulChildrent.style.right = parent.offsetWidth + granpa.offsetWidth + 1 + "px"; 
        }

        if (setting.desktopPosition == NAVIGLOBAL['DESKTOP_POSITION']['RIGHT_FULL_TOP'] || setting.desktopPosition == NAVIGLOBAL['DESKTOP_POSITION']['RIGHT_FULL_CENTER']) {
            ulChildrent.style.top = granpa.offsetTop +  parent.offsetTop + 82 + "px"; 
        }

        if (setting.desktopPosition == NAVIGLOBAL['DESKTOP_POSITION']['LEFT_TOP'] || setting.desktopPosition == NAVIGLOBAL['DESKTOP_POSITION']['LEFT_FULL_TOP'] || setting.desktopPosition == NAVIGLOBAL['DESKTOP_POSITION']['LEFT_FULL_CENTER']) {
            ulChildrent.style.top = root.offsetTop +  parent.offsetTop + 82 + "px"; // Top của level 3 trùng với level 2 - 82 chả hiểu vì sao, cứ chọn đại

            ulChildrent.style.right = "initial";
            ulChildrent.style.left = parent.offsetWidth + granpa.offsetWidth + 1 + "px"; 
        }

        if (setting.desktopPosition == NAVIGLOBAL['DESKTOP_POSITION']['LEFT_FULL_TOP'] || setting.desktopPosition == NAVIGLOBAL['DESKTOP_POSITION']['LEFT_FULL_CENTER']) {
            ulChildrent.style.top = granpa.offsetTop +  parent.offsetTop + 82 + "px"; 
        }        
    }    
}


Menu.Sticky.fixCSS_showLevel3Items_Desktop = function(menuItem, isNaviSection, menuKind, embed_id) {

  if (window.innerWidth < 769) return;

    let ulChildrent = menuItem.querySelector('ul.children');
  
    if(menuKind == NAVIGLOBAL['MENU_KINDS']['STICKY_TABBAR'] ) { 
              
      
      // Trên tất cả các trình duyệt thì menu sẽ không bị tràn và có thể scroll cả trong bố và con, cách lề dưới 100px (tạm thời)
      ulChildrent.parentElement.parentElement.style.overflow = "auto";
  
      // Trên Safari thì chấp nhận menu sẽ bị tràn và xấu nhưng tạm ổn để nghĩ tiết
      // TODO: Cần phải tìm cách fix cho Safari vấn đề menu trên level 3 bị tràn trên desktop
      if(isBrowserSafari())
        ulChildrent.parentElement.parentElement.style.overflow = "visible";
  
      // Tại sao lại là 100px thì chả có logic gì, tạm thế để xem sao
      // TODO: Cần phải tìm một logic tốt hơn là menu level 3 luôn cách lề dưới 100px
      ulChildrent.style.bottom =  "100px"; 
  
      // Thuật toán: Đổi level 3 ở dạng fixed (và sẽ ăn theo level 1), do đó ta sẽ lấy mép level2 - level 1 để tính left của level 3
      var rightEdgeOfLevel2 = ulChildrent.parentElement.parentElement.getBoundingClientRect().left + ulChildrent.parentElement.parentElement.offsetWidth;
      var leftEdgeOfLevel1 = document.getElementById(embed_id).getBoundingClientRect().left;
  
      // Thuật toán: Nếu như có setup paddingLeft của bottomBar thì trừ nốt đi
      const navimenuStyle = window.getComputedStyle(document.getElementById( embed_id ));
  
      ulChildrent.style.left = (rightEdgeOfLevel2 - leftEdgeOfLevel1 + convertPXToNumber(navimenuStyle.paddingLeft) ) + "px"; 
      
      // Cho phép scroll bên trong của level 3
      ulChildrent.style.overflow = "auto";
    }
  };

Menu.Sticky.lockPageScrollingTabBar = function (menuKind, isLock) {
    if (menuKind !== NAVIGLOBAL['MENU_KINDS']['STICKY_TABBAR']) return;
    if (window.innerWidth > 768) return;

    // Không can thiệp trực tiếp vào html/body.
    // TABBAR sẽ dùng overlay_global để khóa/mở scroll (CSS :has xử lý overflow).
    var overlayGlobal = document.querySelector('.naviman_app_overlay_global');
    if (!overlayGlobal) return;

    if (isLock) {
        overlayGlobal.classList.add('is-open');
    } else {
        overlayGlobal.classList.remove('is-open');
    }
};




    Menu.Sticky.fixCSS_ForDesktop = function (cssNaviPrefix, setting, dragdrop, isNaviSection, section_setting) {
  
    var isOnMobile = window.innerWidth <= 768;

  if (setting['layout'] == NAVIGLOBAL['LAYOUT']['FAB'])
      return "";
  if (isOnMobile)
      return "";

  var fixPositionBottomCenterFloat = function (setting, cssNaviPrefix, dragdrop) {
      var addHtml = "";
      if (setting['desktopPosition'] == NAVIGLOBAL['DESKTOP_POSITION']['BOTTOM_CENTER_FLOAT']) {
          addHtml += cssNaviPrefix + ' { width: ' + (DESKTOP_MAX_WIDTH * 1.3) + 'px; } ';
          addHtml += cssNaviPrefix + ' { left: 50%; transform: translate(-50%, 0); } ';

          addHtml += cssNaviPrefix + ' ul li.item{ position: relative; } ';
          addHtml += cssNaviPrefix + ' ul li ul.children{ left: initial; right: 0px; bottom: ' + (parseInt(setting['height']) + 1) + 'px; } ';
          addHtml += cssNaviPrefix + ' ul li ul.children {width: ' + setting['submenuWidth'] + 'px; } ';
          addHtml += cssNaviPrefix + ' { border-radius: ' + setting['borderRadius'] + 'px } ';
      }
      return addHtml;
  };

  var fixPositionBottomCenter = function (setting, cssNaviPrefix, dragdrop) {
      var addHtml = "";
      if (setting['desktopPosition'] == NAVIGLOBAL['DESKTOP_POSITION']['BOTTOM_CENTER']) {
          addHtml += cssNaviPrefix + ' { width: ' + (DESKTOP_MAX_WIDTH * 1.3) + 'px; } ';
          addHtml += cssNaviPrefix + ' { left: 50%; transform: translate(-50%, 0); } ';

          addHtml += cssNaviPrefix + ' ul li.item{ position: relative; } ';
          addHtml += cssNaviPrefix + ' ul li ul.children{ left: initial; right: 0px; bottom: ' + (parseInt(setting['height']) + 1) + 'px; } ';
          addHtml += cssNaviPrefix + ' ul li ul.children {width: ' + setting['submenuWidth'] + 'px; } ';
      }
      return addHtml;
  };

  var fixPositionBottomRight = function (setting, cssNaviPrefix, dragdrop) {
      var addHtml = "";
      if (setting['desktopPosition'] == NAVIGLOBAL['DESKTOP_POSITION']['BOTTOM_RIGHT']) {
          addHtml += cssNaviPrefix + ' { width: ' + DESKTOP_MAX_WIDTH + 'px; left: initial; right: 16px; } ';

          addHtml += cssNaviPrefix + ' ul li.item{ position: relative; } ';
          addHtml += cssNaviPrefix + ' ul li ul.children{ left: initial; right: 0px; bottom: ' + (parseInt(setting['height']) + 1) + 'px; } ';
          addHtml += cssNaviPrefix + ' ul li ul.children {width: ' + setting['submenuWidth'] + 'px; } ';
      }
      return addHtml;
  };

  var fixPositionBottomLeft = function (setting, cssNaviPrefix, dragdrop) {
      var addHtml = "";
      if (setting['desktopPosition'] == NAVIGLOBAL['DESKTOP_POSITION']['BOTTOM_LEFT']) {
          addHtml += cssNaviPrefix + ' { width: ' + DESKTOP_MAX_WIDTH + 'px; left: 16px; } ';

          addHtml += cssNaviPrefix + ' ul li.item{ position: relative; } ';
          addHtml += cssNaviPrefix + ' ul li ul.children{ left: initial; right: 0px; bottom: ' + (parseInt(setting['height']) + 1) + 'px; } ';
          addHtml += cssNaviPrefix + ' ul li ul.children {width: ' + setting['submenuWidth'] + 'px; } ';
      }
      return addHtml;
  };

  var fixPositionTopFull = function (setting, cssNaviPrefix, dragdrop) {
      var addHtml = "";
      if (setting['desktopPosition'] == NAVIGLOBAL['DESKTOP_POSITION']['TOP_FULL']) {
          addHtml += cssNaviPrefix + ' .navigation { width: ' + (DESKTOP_MAX_WIDTH * 2) + 'px; } ';
          addHtml += cssNaviPrefix + ' .navigation { left: initial; } ';

          addHtml += cssNaviPrefix + ' ul li.item{ position: relative; } ';
          addHtml += cssNaviPrefix + ' ul li ul.children{ left: initial; right: 0px; top: ' + (parseInt(setting['height']) + 1) + 'px; } ';
          addHtml += cssNaviPrefix + ' ul li ul.children {width: ' + setting['submenuWidth'] + 'px; } ';

          addHtml += ' body { padding-top: ' + (parseInt(setting['height']) + 0) + 'px; }';
      }

      return addHtml;
  };

  var fixPositionBottomFull = function (setting, cssNaviPrefix, dragdrop) {
      var addHtml = "";
      if (setting['desktopPosition'] == NAVIGLOBAL['DESKTOP_POSITION']['BOTTOM_FULL']) {
          addHtml += cssNaviPrefix + ' .navigation { width: ' + (DESKTOP_MAX_WIDTH * 2) + 'px; } ';
          addHtml += cssNaviPrefix + ' .navigation { left: initial; } ';

          addHtml += cssNaviPrefix + ' ul li.item{ position: relative; } ';
          addHtml += cssNaviPrefix + ' ul li ul.children{ left: initial; right: 0px; bottom: ' + (parseInt(setting['height']) + 1) + 'px; } ';
          addHtml += cssNaviPrefix + ' ul li ul.children {width: ' + setting['submenuWidth'] + 'px; } ';
      }

      return addHtml;
  };

  var fixWindowResize = function (setting, cssNaviPrefix, dragdrop, isNaviSection) {
      if (!isNaviSection) {
          window.addEventListener('resize', function (event) {
          });
      }
  }


  var fixPositionRightTop = function (setting, cssNaviPrefix, dragdrop) {
      var addHtml = "";

      if (setting['desktopPosition'] == NAVIGLOBAL['DESKTOP_POSITION']['RIGHT_TOP']) {
          addHtml += cssNaviPrefix + ' { width: ' + setting['height'] + 'px; left: initial; right: 0px; height: ' + ((parseInt(setting['height']) + 8) * dragdrop.length) + 'px } ';
          addHtml += cssNaviPrefix + ' ul li.item { width: ' + setting['height'] + 'px; height: ' + (parseInt(setting['height']) + 8) + 'px; } ';
          addHtml += cssNaviPrefix + ' { top: ' + ((windowHeight - ((parseInt(setting['height']) + 8) * dragdrop.length)) / 2) + 'px; }';
          addHtml += cssNaviPrefix + ' { border-radius: ' + setting['borderRadius'] + 'px 0px 0px ' + setting['borderRadius'] + 'px } ';
          addHtml += cssNaviPrefix + ' ul li ul.children { left: -201px; bottom: initial; margin-top: -' + (parseInt(setting['height']) + 8) + 'px; width: ' + VERTICAL_CHILDREN_WIDTH + 'px; } ';
          addHtml += cssNaviPrefix + ' ul li ul.children { ' + BOX_SHADOW + ' } ';
          if (setting['layout'] == NAVIGLOBAL['LAYOUT']['HIGHLIGHT'])
              addHtml += cssNaviPrefix + ' ul li.item_primary > .inner { margin-top: 0px; margin-left: -8px } ';

          if (setting['layout'] == NAVIGLOBAL['LAYOUT']['FLOATING']) {
              if (setting['bottomMargin'] != "") {
                  addHtml += cssNaviPrefix + ' { right: ' + (parseInt(setting['bottomMargin'])) + 'px; } ';
                  addHtml += cssNaviPrefix + ' { border-radius: ' + setting['borderRadius'] + 'px } ';
              }
          }

          if (isHadValue(setting['dividerColor']))
              addHtml += cssNaviPrefix + ' ul li.item_divider { border-right: 0px; margin-right: 0px; border-bottom: solid 1px ' + setting['dividerColor'] + '; margin-bottom: -1px; } ';

          if (setting['layout'] != NAVIGLOBAL['LAYOUT']['HIGHLIGHT']) // Nếu là layout 2 thì ko làm việc này.
              addHtml += cssNaviPrefix + ' ul li.item .inner {width: initial; } ';

          let submenuWidth = (-setting['submenuWidth'] - 1);
          addHtml += cssNaviPrefix + ' ul li ul.children {width: ' + setting['submenuWidth'] + 'px; left: ' + submenuWidth + 'px; } ';
          addHtml += cssNaviPrefix + ' ul li.item { width: 100%; } ';
      }
      return addHtml;
  };


  var fixPositionLeftTop = function (setting, cssNaviPrefix, dragdrop) {
      var addHtml = "";
      if (setting['desktopPosition'] == NAVIGLOBAL['DESKTOP_POSITION']['LEFT_TOP']) {
          addHtml += cssNaviPrefix + ' { width: ' + setting['height'] + 'px; right: initial; left: 0px; height: ' + ((parseInt(setting['height']) + 8) * dragdrop.length) + 'px } ';
          addHtml += cssNaviPrefix + ' ul li.item { width: ' + setting['height'] + 'px; height: ' + (parseInt(setting['height']) + 8) + 'px; } ';
          addHtml += cssNaviPrefix + ' { top: ' + ((windowHeight - ((parseInt(setting['height']) + 8) * dragdrop.length)) / 2) + 'px; }';
          addHtml += cssNaviPrefix + ' { border-radius: 0px ' + setting['borderRadius'] + 'px ' + setting['borderRadius'] + 'px 0px } ';
          addHtml += cssNaviPrefix + ' ul li ul.children { left: ' + (parseInt(setting['height']) + 1) + 'px; bottom: initial; margin-top: -' + (parseInt(setting['height']) + 8) + 'px; width: ' + VERTICAL_CHILDREN_WIDTH + 'px; } ';
          addHtml += cssNaviPrefix + ' ul li ul.children { ' + BOX_SHADOW + ' } ';
          if (setting['layout'] == NAVIGLOBAL['LAYOUT']['HIGHLIGHT'])
              addHtml += cssNaviPrefix + ' ul li.item_primary > .inner { margin-top: 0px; margin-left: 1px } ';

          if (setting['layout'] == NAVIGLOBAL['LAYOUT']['FLOATING']) {
              if (setting['bottomMargin'] != "") {
                  addHtml += cssNaviPrefix + ' { left: ' + (parseInt(setting['bottomMargin'])) + 'px; } ';
                  addHtml += cssNaviPrefix + ' { border-radius: ' + setting['borderRadius'] + 'px } ';
              }
          }

          if (isHadValue(setting['dividerColor']))
              addHtml += cssNaviPrefix + ' ul li.item_divider { border-right: 0px; margin-right: 0px; border-bottom: solid 1px ' + setting['dividerColor'] + '; margin-bottom: -1px; } ';

          if (setting['layout'] != NAVIGLOBAL['LAYOUT']['HIGHLIGHT']) // Nếu là layout 2 thì ko làm việc này.
              addHtml += cssNaviPrefix + ' ul li.item .inner {width: initial; } ';

          let submenuWidth = (-setting['submenuWidth'] - 1);
          submenuWidth = (parseInt(setting['height']) + 1);
          addHtml += cssNaviPrefix + ' ul li ul.children {width: ' + setting['submenuWidth'] + 'px; left: ' + submenuWidth + 'px; } ';
          addHtml += cssNaviPrefix + ' ul li.item { width: 100%; } ';
      }
      return addHtml;
  };


  var fixPositionLeftFullTop = function (setting, cssNaviPrefix, dragdrop) {
      var addHtml = "";
      if (setting['desktopPosition'] == NAVIGLOBAL['DESKTOP_POSITION']['LEFT_FULL_TOP']) {
          if (isHadValue(setting['dividerColor']))
              addHtml += cssNaviPrefix + ' ul li.item_divider { border-right: 0px; margin-right: 0px; border-bottom: solid 1px ' + setting['dividerColor'] + '; margin-bottom: -1px; } ';

          if (setting['layout'] != NAVIGLOBAL['LAYOUT']['HIGHLIGHT']) // Nếu là layout 2 thì ko làm việc này.
              addHtml += cssNaviPrefix + ' ul li.item .inner {width: initial; } ';

          let submenuWidth = (-setting['submenuWidth'] - 1);
          //if (setting['desktopPosition'] == NAVIGLOBAL['DESKTOP_POSITION']['LEFT_TOP']) submenuWidth = (parseInt(setting['height']) + 1);
          addHtml += cssNaviPrefix + ' ul li ul.children {width: ' + setting['submenuWidth'] + 'px; left: ' + submenuWidth + 'px; } ';
          addHtml += cssNaviPrefix + ' ul li.item { width: 100%; } ';


          addHtml += ' body {width: calc(100% - ' + setting['height'] + 'px); margin-left: ' + setting['height'] + 'px; } ';

          addHtml += cssNaviPrefix + ' { width: ' + setting['height'] + 'px; right: initial; left: 0px; top: 0px; height: 100vh; padding-top: 16px; } ';
          addHtml += cssNaviPrefix + ' ul li.item { width: ' + setting['height'] + 'px; height: ' + (parseInt(setting['height']) + 8) + 'px; } ';
          addHtml += cssNaviPrefix + ' { border-radius: 0px; } ';
          addHtml += cssNaviPrefix + ' ul li ul.children { left: ' + (parseInt(setting['height']) + 1) + 'px; bottom: initial; margin-top: -' + (parseInt(setting['height']) + 8) + 'px; } ';
          addHtml += cssNaviPrefix + ' ul li ul.children { ' + BOX_SHADOW + ' } ';

          addHtml += cssNaviPrefix + ' { padding-top: 16px; } ';

          addHtml += cssNaviPrefix + ' ul li.item { width: 100%; min-width: 24px; } '; // Fix lỗi nếu padding quá lớn thì bị dồn cục
      }
      return addHtml;
  };


  var fixPositionLeftFullCenter = function (setting, cssNaviPrefix, dragdrop) {
      var addHtml = "";
      if (setting['desktopPosition'] == NAVIGLOBAL['DESKTOP_POSITION']['LEFT_FULL_CENTER']) {
          if (isHadValue(setting['dividerColor']))
              addHtml += cssNaviPrefix + ' ul li.item_divider { border-right: 0px; margin-right: 0px; border-bottom: solid 1px ' + setting['dividerColor'] + '; margin-bottom: -1px; } ';

          if (setting['layout'] != NAVIGLOBAL['LAYOUT']['HIGHLIGHT']) // Nếu là layout 2 thì ko làm việc này.
              addHtml += cssNaviPrefix + ' ul li.item .inner {width: initial; } ';

          let submenuWidth = (-setting['submenuWidth'] - 1);
          addHtml += cssNaviPrefix + ' ul li ul.children {width: ' + setting['submenuWidth'] + 'px; left: ' + submenuWidth + 'px; } ';
          addHtml += cssNaviPrefix + ' ul li.item { width: 100%; } ';

          addHtml += ' body {width: calc(100% - ' + setting['height'] + 'px); margin-left: ' + setting['height'] + 'px; } ';

          addHtml += cssNaviPrefix + ' { width: ' + setting['height'] + 'px; right: initial; left: 0px; top: 0px; height: 100vh; padding-top: 16px; } ';
          addHtml += cssNaviPrefix + ' ul li.item { width: ' + setting['height'] + 'px; height: ' + (parseInt(setting['height']) + 8) + 'px; } ';
          addHtml += cssNaviPrefix + ' { border-radius: 0px; } ';
          addHtml += cssNaviPrefix + ' ul li ul.children { left: ' + (parseInt(setting['height']) + 1) + 'px; bottom: initial; margin-top: -' + (parseInt(setting['height']) + 8) + 'px;} ';
          addHtml += cssNaviPrefix + ' ul li ul.children { ' + BOX_SHADOW + ' } ';


          let bodyPaddingTop = (window.innerHeight - (parseInt(setting['height']) + 8) * dragdrop.length) / 2;
          addHtml += cssNaviPrefix + ' { padding-top: ' + bodyPaddingTop + 'px; } ';


          addHtml += cssNaviPrefix + ' ul li.item { width: 100%; min-width: 24px; } '; // Fix lỗi nếu padding quá lớn thì bị dồn cục

      }
      return addHtml;
  };


  var fixPositionRightFullTop = function (setting, cssNaviPrefix, dragdrop) {
      var addHtml = "";
      if (setting['desktopPosition'] == NAVIGLOBAL['DESKTOP_POSITION']['RIGHT_FULL_TOP']) {
          if (isHadValue(setting['dividerColor']))
              addHtml += cssNaviPrefix + ' ul li.item_divider { border-right: 0px; margin-right: 0px; border-bottom: solid 1px ' + setting['dividerColor'] + '; margin-bottom: -1px; } ';

          if (setting['layout'] != NAVIGLOBAL['LAYOUT']['HIGHLIGHT']) // Nếu là layout 2 thì ko làm việc này.
              addHtml += cssNaviPrefix + ' ul li.item .inner {width: initial; } ';

          let submenuWidth = (-setting['submenuWidth'] - 1);
          addHtml += cssNaviPrefix + ' ul li ul.children {width: ' + setting['submenuWidth'] + 'px; left: ' + submenuWidth + 'px; } ';
          addHtml += cssNaviPrefix + ' ul li.item { width: 100%; } ';

          addHtml += ' body {width: calc(100% - ' + setting['height'] + 'px); margin-right: ' + setting['height'] + 'px; } ';

          addHtml += cssNaviPrefix + ' { width: ' + setting['height'] + 'px; right: 0; left: initial; top: 0px; height: 100vh; padding-top: 16px; } ';
          addHtml += cssNaviPrefix + ' ul li.item { width: ' + setting['height'] + 'px; height: ' + (parseInt(setting['height']) + 8) + 'px; } ';
          addHtml += cssNaviPrefix + ' { border-radius: 0px; } ';
          addHtml += cssNaviPrefix + ' ul li ul.children { right: ' + (parseInt(setting['height']) + 1) + 'px; bottom: initial; margin-top: -' + (parseInt(setting['height']) + 8) + 'px; width: ' + VERTICAL_CHILDREN_WIDTH + 'px; } ';
          addHtml += cssNaviPrefix + ' ul li ul.children { ' + BOX_SHADOW + ' } ';

          addHtml += cssNaviPrefix + ' ul li ul.children {width: ' + setting['submenuWidth'] + 'px; left: ' + submenuWidth + 'px; } ';

          addHtml += cssNaviPrefix + ' { padding-top: 16px; } ';

          addHtml += cssNaviPrefix + ' ul li.item { width: 100%; min-width: 24px; } '; // Fix lỗi nếu padding quá lớn thì bị dồn cục

      }
      return addHtml;
  };


  var fixPositionRightFullCenter = function (setting, cssNaviPrefix, dragdrop) {
      var addHtml = "";
      if (setting['desktopPosition'] == NAVIGLOBAL['DESKTOP_POSITION']['RIGHT_FULL_CENTER']) {
          if (isHadValue(setting['dividerColor']))
              addHtml += cssNaviPrefix + ' ul li.item_divider { border-right: 0px; margin-right: 0px; border-bottom: solid 1px ' + setting['dividerColor'] + '; margin-bottom: -1px; } ';

          if (setting['layout'] != NAVIGLOBAL['LAYOUT']['HIGHLIGHT']) // Nếu là layout 2 thì ko làm việc này.
              addHtml += cssNaviPrefix + ' ul li.item .inner {width: initial; } ';

          let submenuWidth = (-setting['submenuWidth'] - 1);
          addHtml += cssNaviPrefix + ' ul li ul.children {width: ' + setting['submenuWidth'] + 'px; left: ' + submenuWidth + 'px; } ';
          addHtml += cssNaviPrefix + ' ul li.item { width: 100%; } ';


          addHtml += ' body {width: calc(100% - ' + setting['height'] + 'px); margin-right: ' + setting['height'] + 'px; } ';

          addHtml += cssNaviPrefix + ' { width: ' + setting['height'] + 'px; right: 0; left: initial; top: 0px; height: 100vh; padding-top: 16px; } ';
          addHtml += cssNaviPrefix + ' ul li.item { width: ' + setting['height'] + 'px; height: ' + (parseInt(setting['height']) + 8) + 'px; } ';
          addHtml += cssNaviPrefix + ' { border-radius: 0px; } ';
          addHtml += cssNaviPrefix + ' ul li ul.children { right: ' + (parseInt(setting['height']) + 1) + 'px; bottom: initial; margin-top: -' + (parseInt(setting['height']) + 8) + 'px; width: ' + VERTICAL_CHILDREN_WIDTH + 'px; } ';
          addHtml += cssNaviPrefix + ' ul li ul.children { ' + BOX_SHADOW + ' } ';

          addHtml += cssNaviPrefix + ' ul li ul.children {width: ' + setting['submenuWidth'] + 'px; left: ' + submenuWidth + 'px; } ';

          if (setting['desktopPosition'] == NAVIGLOBAL['DESKTOP_POSITION']['RIGHT_FULL_TOP'])
              addHtml += cssNaviPrefix + ' { padding-top: 16px; } ';
          else if (setting['desktopPosition'] == 10) {
              let bodyPaddingTop = (window.innerHeight - (parseInt(setting['height']) + 8) * dragdrop.length) / 2;
              addHtml += cssNaviPrefix + ' { padding-top: ' + bodyPaddingTop + 'px; } ';
          }

          addHtml += cssNaviPrefix + ' ul li.item { width: 100%; min-width: 24px; } '; // Fix lỗi nếu padding quá lớn thì bị dồn cục

      }
      return addHtml;
  };

  var fixPositionNaviSection = function (setting, cssNaviPrefix, dragdrop) {
      var addHtml = "";
      if (true) {
          addHtml += cssNaviPrefix + ' { bottom: initial; top:0px; } ';

          //if(section_setting['not_sticky'] == false || section_setting['not_sticky'] == "false" ) // Nếu là loại sticky thì mới + thêm padding-top cho boddy
          //    addHtml += ' body {padding-top: ' + setting['height'] + 'px;} ';
          addHtml += cssNaviPrefix + ' ul li ul.children { bottom: initial; top: ' + (parseInt(setting['height']) + 0) + 'px; ' + BOX_SHADOW + ' } ';
          //addHtml += cssNaviPrefix + ' { border-radius: 0px 0px ' + setting['borderRadius'] + 'px ' + setting['borderRadius'] + 'px } ';

          // Thêm cái line ở giữa level 1 và 2
          addHtml += cssNaviPrefix + ' ul li ul.children { border-top: solid 1px rgba(0,0,0,0.05); border-bottom:0px; } ';
          addHtml += cssNaviPrefix + ' ul li ul.children {width: ' + setting['submenuWidth'] + 'px; } ';

      }
      return addHtml;
  };

  let html = ' @media only screen and (min-width: 769px) {';
  //--------------------------------------------------------

  if (!isNaviSection) {
      html += fixPositionBottomCenterFloat(setting, cssNaviPrefix, dragdrop);
      html += fixPositionBottomCenter(setting, cssNaviPrefix, dragdrop);
      html += fixPositionBottomRight(setting, cssNaviPrefix, dragdrop);
      html += fixPositionBottomLeft(setting, cssNaviPrefix, dragdrop);
      html += fixPositionBottomFull(setting, cssNaviPrefix, dragdrop);
      html += fixPositionRightTop(setting, cssNaviPrefix, dragdrop);
      html += fixPositionLeftTop(setting, cssNaviPrefix, dragdrop);
      html += fixPositionLeftFullTop(setting, cssNaviPrefix, dragdrop);
      html += fixPositionLeftFullCenter(setting, cssNaviPrefix, dragdrop);
      html += fixPositionRightFullTop(setting, cssNaviPrefix, dragdrop);
      html += fixPositionRightFullCenter(setting, cssNaviPrefix, dragdrop);
      html += fixPositionTopFull(setting, cssNaviPrefix, dragdrop);
  } else {
    html += fixPositionNaviSection(setting, cssNaviPrefix, dragdrop);
  }
      
  html += fixWindowResize(setting, cssNaviPrefix, dragdrop, isNaviSection);

  //--------------------------------------------------------
  html += '}';
  return html;
};
    Menu.Sticky.fixCSS_ForMobile = function(cssNaviPrefix, setting, dragdrop, section_setting) {

    var isOnMobile = window.innerWidth <= 768;

  if (setting['layout'] == NAVIGLOBAL['LAYOUT']['FAB'])
      return "";
  if (!isOnMobile)
      return "";

  var fixPositionBottom = function (setting, cssNaviPrefix, dragdrop, section_setting) {
      var addHtml = "";
      if (setting['mobilePosition'] == NAVIGLOBAL['MOBILE_POSITION']['BOTTOM']) { // Thêm footer padding-bottom

          // Fix: Thêm một khoảng trống ở dưới body, (nhưng nếu auto hide thì bỏ qua)
          if (setting['mobileAutoHide'] != "true" && setting['mobileAutoHide'] != true) {
              addHtml += ' body { padding-bottom: ' + (parseInt(setting['height']) + 0) + 'px; }';
          }
          // Fix: Hất bóng shadow lên.
          addHtml += cssNaviPrefix + ' { box-shadow: 0px -4px 8px 0px rgba(0, 0, 0, 0.05); } ';

          // Fix: Nếu padding-left, right được set, thì sub menu (level 2) vẫn phải full screen
          if( parseInt(setting['settingPadding']['left']) + parseInt(setting['settingPadding']['right']) > 0 ) {
              addHtml += cssNaviPrefix + 'ul li ul.children { width: calc( 100% + ' + (parseInt(setting['settingPadding']['left']) + parseInt(setting['settingPadding']['right'])) + 'px ); } ';
              if (parseInt(setting['settingPadding']['left']) > 0)
                  addHtml += cssNaviPrefix + 'ul li ul.children { left: -' + parseInt(setting['settingPadding']['left']) + 'px; } ';
          }

          // Fix: Nếu margin-left, right được set, set width của menu để không bị tràn
          if (setting['settingMargin']['left'] != 0 || setting['settingMargin']['right'] != 0) {
              addHtml += cssNaviPrefix + ' { width: calc( 100% - ' + (parseInt(setting['settingMargin']['left']) + parseInt(setting['settingMargin']['right'])) + 'px) }; ';
          }
      }
      return addHtml;
  };

  var fixPositionTop = function (setting, cssNaviPrefix, dragdrop, section_setting) {
      var addHtml = "";

      if (setting['mobilePosition'] == NAVIGLOBAL['MOBILE_POSITION']['TOP']) {
          addHtml += cssNaviPrefix + ' { bottom: initial; top:0px; } ';

          if(section_setting['not_sticky'] == false || section_setting['not_sticky'] == "false" ) // Nếu là loại sticky thì mới + thêm padding-top cho boddy
              addHtml += ' body {padding-top: ' + setting['height'] + 'px;} ';
          addHtml += cssNaviPrefix + ' ul li ul.children { bottom: initial; top: ' + (parseInt(setting['height']) + 0) + 'px; ' + BOX_SHADOW + ' } ';
          addHtml += cssNaviPrefix + ' { border-radius: 0px 0px ' + setting['borderRadius'] + 'px ' + setting['borderRadius'] + 'px } ';
          if (setting['layout'] ==  NAVIGLOBAL['LAYOUT']['HIGHLIGHT'])
              addHtml += cssNaviPrefix + ' ul li.item_primary > .inner { margin-top: 0px } ';

          // Fix: Float là loại thứ 3, ko phải FAB
          if (setting['layout'] ==  NAVIGLOBAL['LAYOUT']['FLOATING']) {
              if (setting['bottomMargin'] != 0) {
                  addHtml += cssNaviPrefix + ' { bottom: initial; top: ' + (parseInt(setting['bottomMargin'])) + 'px; } ';
                  addHtml += cssNaviPrefix + ' { border-radius: ' + setting['borderRadius'] + 'px } ';
                  addHtml += ' body {padding-top: ' + (parseInt(setting['height']) + parseInt(setting['bottomMargin']) + 8) + 'px} ';
              }
          }

          // Thêm cái line ở giữa level 1 và 2
          addHtml += cssNaviPrefix + ' ul li ul.children { border-top: solid 1px rgba(0,0,0,0.05); border-bottom:0px; } ';

          // Fix: Nếu padding-left, right được set, thì sub menu (level 2) vẫn phải full screen
          if( parseInt(setting['settingPadding']['left']) + parseInt(setting['settingPadding']['right']) > 0 ) {
              addHtml += cssNaviPrefix + 'ul li ul.children { width: calc( 100% + ' + (parseInt(setting['settingPadding']['left']) + parseInt(setting['settingPadding']['right'])) + 'px ); } ';
              if (parseInt(setting['settingPadding']['left']) > 0)
                  addHtml += cssNaviPrefix + 'ul li ul.children { left: -' + parseInt(setting['settingPadding']['left']) + 'px; } ';
          }

          // Fix: Nếu margin-left, right được set, set width của menu để không bị tràn
          if (setting['settingMargin']['left'] != 0 || setting['settingMargin']['right'] != 0) {
              addHtml += cssNaviPrefix + ' { width: calc( 100% - ' + (parseInt(setting['settingMargin']['left']) + parseInt(setting['settingMargin']['right'])) + 'px) }; ';
          }
      }
      return addHtml;
  };


  var fixPositionRightCenter = function (setting, cssNaviPrefix, dragdrop, section_setting) {
      var addHtml = "";
      if (setting['mobilePosition'] == NAVIGLOBAL['MOBILE_POSITION']['RIGHT_CENTER']) {
          addHtml += cssNaviPrefix + ' { width: ' + setting['height'] + 'px; left: initial; right: 0px; height: ' + ((parseInt(setting['height']) + 8) * dragdrop.length) + 'px } ';
          addHtml += cssNaviPrefix + ' ul li.item { width: ' + setting['height'] + 'px; height: ' + (parseInt(setting['height']) + 8) + 'px; } ';
          addHtml += cssNaviPrefix + ' { top: ' + ((windowHeight - ((parseInt(setting['height']) + 8) * dragdrop.length)) / 2) + 'px; }';
          addHtml += cssNaviPrefix + ' { border-radius: ' + setting['borderRadius'] + 'px 0px 0px ' + setting['borderRadius'] + 'px } ';
          addHtml += cssNaviPrefix + ' ul li ul.children { left: -201px; bottom: initial; margin-top: -' + (parseInt(setting['height']) + 8) + 'px; width: ' + VERTICAL_CHILDREN_WIDTH + 'px; } ';
          addHtml += cssNaviPrefix + ' ul li ul.children { box-shadow: 0px 4px 8px 0px rgba(0, 0, 0, 0.10); } ';
          if (setting['layout'] ==  NAVIGLOBAL['LAYOUT']['HIGHLIGHT'])
              addHtml += cssNaviPrefix + ' ul li.item_primary > .inner { margin-top: 0px; margin-left: -8px } ';

          if (setting['layout'] ==  NAVIGLOBAL['LAYOUT']['FLOATING']) {
              if (setting['bottomMargin'] != "") {
                  addHtml += cssNaviPrefix + ' { right: ' + (parseInt(setting['bottomMargin'])) + 'px; } ';
                  addHtml += cssNaviPrefix + ' { border-radius: ' + setting['borderRadius'] + 'px } ';
              }
          }

          if (isHadValue(setting['dividerColor']))
              addHtml += cssNaviPrefix + ' ul li.item_divider { border-right: 0px; margin-right: 0px; border-bottom: solid 1px ' + setting['dividerColor'] + '; margin-bottom: -1px; } ';

          addHtml += cssNaviPrefix + ' ul li ul.children {width: ' + setting['submenuWidth'] + 'px; } ';
          addHtml += cssNaviPrefix + ' ul li ul.children {left: ' + (-(setting['submenuWidth']) - 1) + 'px; } ';

          /*if (setting['layout'] != NAVIGLOBAL['LAYOUT']['HIGHLIGHT'])
              addHtml += cssNaviPrefix + ' ul li.item .inner { padding: 8px 0px 0px 0px; } ';*/
      }
      return addHtml;
  };


  var fixPositionRightBottom = function (setting, cssNaviPrefix, dragdrop, section_setting) {
      var addHtml = "";
      if ( setting['mobilePosition'] == NAVIGLOBAL['MOBILE_POSITION']['RIGHT_BOTTOM'] )
      {
          addHtml += cssNaviPrefix + ' { width: ' + setting['height'] + 'px; left: initial; right: 0px; height: ' + ((parseInt(setting['height']) + 8) * dragdrop.length) + 'px } ';
          addHtml += cssNaviPrefix + ' ul li.item { width: ' + setting['height'] + 'px; height: ' + (parseInt(setting['height']) + 8) + 'px; } ';
          addHtml += cssNaviPrefix + ' { top: ' + ((windowHeight - ((parseInt(setting['height']) + 8) * dragdrop.length)) / 2) + 'px; }';
          addHtml += cssNaviPrefix + ' { border-radius: ' + setting['borderRadius'] + 'px 0px 0px ' + setting['borderRadius'] + 'px } ';
          addHtml += cssNaviPrefix + ' ul li ul.children { left: -201px; bottom: initial; margin-top: -' + (parseInt(setting['height']) + 8) + 'px; width: ' + VERTICAL_CHILDREN_WIDTH + 'px; } ';
          addHtml += cssNaviPrefix + ' ul li ul.children { box-shadow: 0px 4px 8px 0px rgba(0, 0, 0, 0.10); } ';
          if (setting['layout'] ==  NAVIGLOBAL['LAYOUT']['HIGHLIGHT'])
              addHtml += cssNaviPrefix + ' ul li.item_primary > .inner { margin-top: 0px; margin-left: -8px } ';

          if (setting['layout'] ==  NAVIGLOBAL['LAYOUT']['FLOATING']) {
              if (setting['bottomMargin'] != "") {
                  addHtml += cssNaviPrefix + ' { right: ' + (parseInt(setting['bottomMargin'])) + 'px; } ';
                  addHtml += cssNaviPrefix + ' { border-radius: ' + setting['borderRadius'] + 'px } ';
              }
          }

          addHtml += cssNaviPrefix + ' { top: initial; bottom: 24px; } ';

          if (isHadValue(setting['dividerColor']))
              addHtml += cssNaviPrefix + ' ul li.item_divider { border-right: 0px; margin-right: 0px; border-bottom: solid 1px ' + setting['dividerColor'] + '; margin-bottom: -1px; } ';

          addHtml += cssNaviPrefix + ' ul li ul.children {width: ' + setting['submenuWidth'] + 'px; } ';
          addHtml += cssNaviPrefix + ' ul li ul.children {left: ' + (-(setting['submenuWidth']) - 1) + 'px; } ';
          addHtml += cssNaviPrefix + ' ul li.item { position: relative; } ';
          addHtml += cssNaviPrefix + ' ul li ul.children { margin-top: initial; bottom: 0px; top: initial; } ';

          /*if (setting['layout'] != NAVIGLOBAL['LAYOUT']['HIGHLIGHT'])
              addHtml += cssNaviPrefix + ' ul li.item .inner { padding: 8px 0px 0px 0px; } ';*/


      }
      return addHtml;
  };


  var fixPositionLeftCenter = function (setting, cssNaviPrefix, dragdrop, section_setting) {
      var addHtml = "";
      if (setting['mobilePosition'] == NAVIGLOBAL['MOBILE_POSITION']['LEFT_CENTER']) {
          addHtml += cssNaviPrefix + ' { width: ' + setting['height'] + 'px; right: initial; left: 0px; height: ' + ((parseInt(setting['height']) + 8) * dragdrop.length) + 'px } ';
          addHtml += cssNaviPrefix + ' ul li.item { width: ' + setting['height'] + 'px; height: ' + (parseInt(setting['height']) + 8) + 'px; } ';
          addHtml += cssNaviPrefix + ' { top: ' + ((windowHeight - ((parseInt(setting['height']) + 8) * dragdrop.length)) / 2) + 'px; }';
          addHtml += cssNaviPrefix + ' { border-radius: 0px ' + setting['borderRadius'] + 'px ' + setting['borderRadius'] + 'px 0px } ';
          addHtml += cssNaviPrefix + ' ul li ul.children { left: ' + (parseInt(setting['height']) + 1) + 'px; bottom: initial; margin-top: -' + (parseInt(setting['height']) + 8) + 'px; width: ' + VERTICAL_CHILDREN_WIDTH + 'px; } ';
          addHtml += cssNaviPrefix + ' ul li ul.children { box-shadow: 0px 4px 8px 0px rgba(0, 0, 0, 0.10); } ';
          if (setting['layout'] ==  NAVIGLOBAL['LAYOUT']['HIGHLIGHT'])
              addHtml += cssNaviPrefix + ' ul li.item_primary > .inner { margin-top: 0px; margin-left: 1px } ';

          if (setting['layout'] ==  NAVIGLOBAL['LAYOUT']['FLOATING']) {
              if (setting['bottomMargin'] != "") {
                  addHtml += cssNaviPrefix + ' { left: ' + (parseInt(setting['bottomMargin'])) + 'px; } ';
                  addHtml += cssNaviPrefix + ' { border-radius: ' + setting['borderRadius'] + 'px } ';
              }
          }

          if (isHadValue(setting['dividerColor']))
              addHtml += cssNaviPrefix + ' ul li.item_divider { border-right: 0px; margin-right: 0px; border-bottom: solid 1px ' + setting['dividerColor'] + '; margin-bottom: -1px; } ';

          addHtml += cssNaviPrefix + ' ul li ul.children {width: ' + setting['submenuWidth'] + 'px; } ';

          /*if (setting['layout'] != NAVIGLOBAL['LAYOUT']['HIGHLIGHT'])
              addHtml += cssNaviPrefix + ' ul li.item .inner { padding: 8px 0px 0px 0px; } ';*/
      }
      return addHtml;
  };


  var fixPositionLeftBottom = function (setting, cssNaviPrefix, dragdrop, section_setting) {
      var addHtml = "";
      if (setting['mobilePosition'] == NAVIGLOBAL['MOBILE_POSITION']['LEFT_BOTTOM']) {
          addHtml += cssNaviPrefix + ' { width: ' + setting['height'] + 'px; right: initial; left: 0px; height: ' + ((parseInt(setting['height']) + 8) * dragdrop.length) + 'px } ';
          addHtml += cssNaviPrefix + ' ul li.item { width: ' + setting['height'] + 'px; height: ' + (parseInt(setting['height']) + 8) + 'px; } ';
          addHtml += cssNaviPrefix + ' { top: ' + ((windowHeight - ((parseInt(setting['height']) + 8) * dragdrop.length)) / 2) + 'px; }';
          addHtml += cssNaviPrefix + ' { border-radius: 0px ' + setting['borderRadius'] + 'px ' + setting['borderRadius'] + 'px 0px } ';
          addHtml += cssNaviPrefix + ' ul li ul.children { left: ' + (parseInt(setting['height']) + 1) + 'px; bottom: initial; margin-top: -' + (parseInt(setting['height']) + 8) + 'px; width: ' + VERTICAL_CHILDREN_WIDTH + 'px; } ';
          addHtml += cssNaviPrefix + ' ul li ul.children { box-shadow: 0px 4px 8px 0px rgba(0, 0, 0, 0.10); } ';
          if (setting['layout'] ==  NAVIGLOBAL['LAYOUT']['HIGHLIGHT'])
              addHtml += cssNaviPrefix + ' ul li.item_primary > .inner { margin-top: 0px; margin-left: 1px } ';

          if (setting['layout'] ==  NAVIGLOBAL['LAYOUT']['FLOATING']) {
              if (setting['bottomMargin'] != "") {
                  addHtml += cssNaviPrefix + ' { left: ' + (parseInt(setting['bottomMargin'])) + 'px; } ';
                  addHtml += cssNaviPrefix + ' { border-radius: ' + setting['borderRadius'] + 'px } ';
              }
          }

          addHtml += cssNaviPrefix + ' { top: initial; bottom: 24px; } ';

          if (isHadValue(setting['dividerColor']))
              addHtml += cssNaviPrefix + ' ul li.item_divider { border-right: 0px; margin-right: 0px; border-bottom: solid 1px ' + setting['dividerColor'] + '; margin-bottom: -1px; } ';

          addHtml += cssNaviPrefix + ' ul li ul.children {width: ' + setting['submenuWidth'] + 'px; } ';

          addHtml += cssNaviPrefix + ' ul li.item { position: relative; } ';
          addHtml += cssNaviPrefix + ' ul li ul.children { margin-top: initial; bottom: 0px; top: initial; } ';

      }
      return addHtml;
  };

  let html = ' @media only screen and (max-width: 768px) {';
      html += fixPositionBottom(setting, cssNaviPrefix, dragdrop, section_setting);
      html += fixPositionTop(setting, cssNaviPrefix, dragdrop, section_setting);
      html += fixPositionRightCenter(setting, cssNaviPrefix, dragdrop, section_setting);
      html += fixPositionRightBottom(setting, cssNaviPrefix, dragdrop, section_setting);
      html += fixPositionLeftCenter(setting, cssNaviPrefix, dragdrop, section_setting);
      html += fixPositionLeftBottom(setting, cssNaviPrefix, dragdrop, section_setting);
  html += '}';
  return html;
};
    var Menu = Menu || {}; 
Menu.Section = Menu.Section || {};

/***************************************************************************************************************  
 Kiểm tra xem nếu section cấu hình margin thì trả về style 
****************************************************************************************************************/
Menu.Section.getStyleSectionMargin = function(section_setting) {
    var embedMarginStyle = "";

    if( section_setting["embed_margin"] != '0 0 0 0' && section_setting["embed_margin"].trim() != '' ) {
        var margin = Helper.HTML.parsePaddingMargin(section_setting["embed_margin"]);
        embedMarginStyle += ' margin: '
            + margin.top + 'px '
            + margin.right + 'px '
            + margin.bottom + 'px '
            + margin.left + 'px '
        ;
    }

    return embedMarginStyle;
};


/*********************************************************************************** 
Hàm này chỉ xử lý một case duy nhất là vừa khai báo section dạng sticky vừa chèn vào code, 
dẫn đến có 2 item xuất hiện đồng thời, khi đó ẩn cái sticky đi 
/*********************************************************************************** */

Menu.Section.hideDuplicateNavimanItems = function() {
    let navimanApp = document.querySelector("#naviman_app");
    if (!navimanApp) return; // Thoát nếu không tìm thấy #naviman_app

    let naviItems = navimanApp.querySelectorAll(".naviItem");
    let ids = new Set();

    // Lấy danh sách ID từ các .naviItem trong #naviman_app
    naviItems.forEach(item => {
        let id = item.id;
        if (id) {
            ids.add(id);
        }
    });

    // Kiểm tra xem ID có xuất hiện ở nơi khác không
    ids.forEach(id => {
        let allOccurrences = document.querySelectorAll(`.naviItem#${id}`);
        let outsideOccurrences = [...allOccurrences].filter(item => !navimanApp.contains(item));

        if (outsideOccurrences.length > 0) {
            let itemInNavimanApp = navimanApp.querySelector(`.naviItem#${id} ul.navigation`);
            if (itemInNavimanApp) {
                itemInNavimanApp.style.display = "none"; // Ẩn ul.navigation nếu ID trùng ngoài #naviman_app
            }
        }
    });
};
    
/***************************************************************************************************************  
 Kiểm tra xem có phải được publish theo dạng publicToPlace không, nếu đúng trả về true
****************************************************************************************************************/    
Menu.Section.checkPublicToPlace = function(naviItem ) { 
    var isPublishToPlace = false;

    if (isHadValue(naviItem["data"]["setting"]['publishToPlaceDisplay'])) {
        if (naviItem["data"]["setting"]['publishToPlaceDisplay'] == "1") {
            isPublishToPlace = true;
        }else 
        isPublishToPlace = false;
        // Sau bước này là có isPublishToPlace  
        if( isPublishToPlace ) {
            if (isHadValue(naviItem["data"]["setting"]['publishToPlace'])) {

                var elsIdClass = Helper.String.getFirstCSSSelector( naviItem["data"]["setting"]['publishToPlace'] );

                elsIdClass = Helper.String.CSSSelectorPlatform( elsIdClass );
                if( elsIdClass == "" ) {
                    navidebug.log("Removed publishToPlace because the suffix platforms");
                    return;
                }                

                if (elsIdClass && elsIdClass.trim() !== "") {
                    isPublishToPlace = true;
                }else 
                    isPublishToPlace = false;
            }
            else 
                isPublishToPlace = false;
        }

    }               

    if (Helper.Env.isBackendMode())
        isPublishToPlace = false;

    if( isPublishToPlace == true ) 
        navidebug.log( naviItem["embed_id"] + " will publiced to place: " + naviItem["data"]["setting"]['publishToPlace'] );

    return isPublishToPlace;
};

/***************************************************************************************************************  
 Kiểm tra section được hiển thị dạng theme editor hay là publishToPlace
****************************************************************************************************************/  
Menu.Section.checkSectionPublishWays = function (isDisplayed, naviItem, embed_id, isPublishToPlace) {
    if( isDisplayed == false ) return false;   

    if( isDisplayed ) {                        
        var isSectionDisplay = false;
        // Trường hợp 1: có publishToPlace nhưng không có naviItem["embed_id"] -> Publish section qua publishToPlace
        if( isPublishToPlace && (naviItem["embed_id"] != embed_id) ) {
            isSectionDisplay = true;
            navidebug.log( '[Debugging] ' + naviItem["embed_id"] + " is shown by publishToPlace" );
        }
        // Trường hợp 2: ko publishToPlace nhưng có naviItem["embed_id"] -> Publish section qua theme editor
        if( !isPublishToPlace && (naviItem["embed_id"] == embed_id) ) {
            isSectionDisplay = true;
            navidebug.log( '[Debugging] ' + naviItem["embed_id"] + " is shown by theme editor" );
        }

        if( !isSectionDisplay )
            isDisplayed = false;
    }

    return isDisplayed;
};

/***************************************************************************************************************  
 Chỉnh CSS cho megamenu mobile
****************************************************************************************************************/
Menu.Section.fixCSS_Megamenu_Mobile = function(cssNaviPrefix, setting, dragdrop, isNaviSection, section_setting) {
    var addHtml = "";
    addHtml += cssNaviPrefix + ' ul li ul.children { top: ' + parseInt(setting['height']) + 'px;} ';
    return addHtml;
};

/***************************************************************************************************************  
 Chỉnh CSS cho megamenu desktop
****************************************************************************************************************/  
Menu.Section.fixCSS_Megamenu_Desktop2 = function(cssNaviPrefix, setting, dragdrop, isNaviSection, section_setting, menuKind) {

    if( menuKind != NAVIGLOBAL['MENU_KINDS']['SECTION_DESKTOP_MEGAMENU'] )
        return;

    

    var addHtml = "";
    addHtml += cssNaviPrefix.trim() + '.SECTION_DESKTOP_MEGAMENU' + ' ul li ul.children { top: ' + parseInt(setting['height']) + 'px;} ';
    addHtml += cssNaviPrefix.trim() + '.SECTION_DESKTOP_MEGAMENU' + ' ul.children { width: ' + parseInt(setting['submenuWidth']) + 'px;} ';
  
    return addHtml;
};

/***************************************************************************************************************  
 Hàm này không có tác dụng vì hiện tại cứ là section: display -> grid theo đó thì top/bottom không còn giá trị 
****************************************************************************************************************/
Menu.Section.fixCSS_ResetBotomTop = function (naviman_appItem, shop, embed_id, section_setting) {    
    //if(section_setting.length === 0 ) return;
    if(section_setting['embed_id'] == '') return;
    if(section_setting['not_sticky'] == false || section_setting['not_sticky'] == "false" ) return;

    Helper.HTML.addStyleToMenu(naviman_appItem, '#'+ embed_id +' { bottom: initial; top: initial; }');
};

/***************************************************************************************************************  
 Với megamenu thì đặt max-height: initial để hiển thị tất cả các menu con
****************************************************************************************************************/
Menu.Section.fixCSS_Megamenu_desktop = function (naviman_appItem, shop, embed_id, section_setting, menuKind) {

    if(section_setting['embed_id'] == '') return;
    if(section_setting['not_sticky'] == false || section_setting['not_sticky'] == "false" ) return;

    if( menuKind != NAVIGLOBAL['MENU_KINDS']['SECTION_DESKTOP_MEGAMENU'] )
        return;

    Helper.HTML.addStyleToMenu(naviman_appItem, '#'+ embed_id + ' ul li ul.children { max-height: initial;  } ');
};


/***************************************************************************************************************  
 Tìm đến section cha của một element
****************************************************************************************************************/
Menu.Section.getSessionParent = function(session_parent) {
    if( session_parent == null ) return null;
    var limitCount = 0;
    while( true ) {
        limitCount ++;
        if( limitCount >= 30 ) return null;
        if( !session_parent || typeof session_parent.nodeName === "undefined" ) return null;
        
        if( session_parent.nodeName == "SECTION" )
            return session_parent;

        if( session_parent.nodeName == "MAIN" )
            return null;

        if( session_parent == document.body)
            return null;

        session_parent = session_parent.parentElement;
    }
};

/***************************************************************************************************************  
 Tìm đến shopify-block cha của một element
****************************************************************************************************************/
Menu.Section.getBlockParent = function(session_parent) {
    if( session_parent == null ) return null;
    var limitCount = 0;
    while( true ) {
        limitCount ++;
        if( limitCount >= 30 ) return null;
        if( !session_parent || typeof session_parent.nodeName === "undefined" ) return null;
        if( !session_parent || typeof session_parent.className === "undefined" ) return null;


        if( session_parent.className.includes("shopify-block") )
            return session_parent;

        if( session_parent.nodeName == "MAIN" )
            return null;

        if( session_parent == document.body)
            return null;

        session_parent = session_parent.parentElement;
    }
};

/***************************************************************************************************************  
 Tìm đến page-width cha của một element
****************************************************************************************************************/
Menu.Section.getPageWidthParent = function(session_parent) {
    if( session_parent == null ) return null;
    var limitCount = 0;
    while( true ) {
        limitCount ++;
        if( limitCount >= 30 ) return null;
        if( session_parent.className.includes("page-width") )
            return session_parent;

        if( session_parent.nodeName == "MAIN" )
            return null;

        if( session_parent == document.body)
            return null;

        session_parent = session_parent.parentElement;
    }
};

/***************************************************************************************************************  
 - Căn chỉnh CSS cho section parent, để hiển thị tốt hơn
 - CHÚ Ý: Hàm này chỉ áp dụng cho section nhúng trực tiếp (Chỉ chạy với Shopify
****************************************************************************************************************/
Menu.Section.fixCSS_SectionParent = function (naviman_app, naviItem, embed_id, section_setting, menuKind) {    
    var setting = naviItem["data"]["setting"];

    var session = Menu.Section.getSessionParent(naviman_app);
    if( session != null ) {
        session.style.position = "relative";

        /* Fix cho phần header trên desktop, setup màu, bóng.. cho Section thay vì riêng cái menu đó *****/
        if( menuKind == NAVIGLOBAL['MENU_KINDS']['SECTION_DESKTOP_MEGAMENU'] ) {
            session.style.backgroundColor = setting['backgroundColor'];

            if( setting['level1BackgroundHide'] == false ) {
                session.style.boxShadow = "0px 4px 8px 0px rgba(0, 0, 0, 0.05)";
                document.getElementById(embed_id).style.boxShadow = "initial";
            }
        }

        /* Fix việc không bị đè các item này lên item khác *****/
        /*
        // Sau khi điều chỉnh z-index lên max khi mở level 2, 3 thì chỉ set z-index vừa đủ là 1 để cho phép hiển thị.
        var zIndex = (50 - 1);
        if (isHadValue(setting['zIndex'])) zIndex = setting['zIndex'] - 1;
        session.style.zIndex = zIndex; */

        session.style.zIndex = 1;

        if( setting['fixedTopScrolling'] == true || setting['fixedTopScrolling'] == "true" ) {
            session.style.position = "sticky";
            session.style.top = 0;

            if( setting["level1Dropshadow"] == false || setting["level1Dropshadow"] == 'false' ) {
                var stickyPageYOffset = session.offsetTop;
                window.onscroll = function () {
                    if (window.pageYOffset > stickyPageYOffset) {
                        session.style.boxShadow = "0px 4px 8px 0px rgba(0, 0, 0, 0.05)";
                    } else {
                        session.style.boxShadow = "initial";
                    }
                };
            }
        }
    }

    // Đoạn này ko hiểu vì sao lại cần?
    var shopify_block = Menu.Section.getBlockParent(naviman_app);
    if( shopify_block != null ) {
        shopify_block.style.display = "flex";
    }

    // Nếu full width thì bỏ padding 2 bên đi
    if( section_setting['embed_is_full'] == true || section_setting['embed_is_full'] == "true" ) {
        var page_width = Menu.Section.getPageWidthParent(naviman_app);
        if (page_width != null) {
            page_width.style.padding = "0px";
        }
    }
};

Menu.Section.fixWidthLayoutForMegamenu = function (itemExtWidth, menuKind) {
    if( menuKind == NAVIGLOBAL['MENU_KINDS']['SECTION_DESKTOP_MEGAMENU'] || menuKind == NAVIGLOBAL['MENU_KINDS']['SECTION_MOBILE_MEGAMENU']) {
        if( itemExtWidth.width == "" ) // Với mega menu thì level 1: Auto -> Hug
            itemExtWidth = {
                'width': 'auto',
                'style' : ' width: auto ',
                'class' : ''
            };
    }

    return itemExtWidth;
};


/***************************************************************************************************************
 Fix vị trí top của ul.children level 2 cho mobile megamenu (position fixed theo menu cha)
 Khi nằm trong .section_naviman_app thì dùng top: auto vì giá trị tính từ viewport sẽ sai.
****************************************************************************************************************/
Menu.Section.fixTopOfMobileMega = function(menuKind, menuItem) {
    if (menuKind != NAVIGLOBAL['MENU_KINDS']['SECTION_MOBILE_MEGAMENU']) return;

    if (!menuItem || !(menuItem instanceof Element)) return;
    if (menuItem._mobileMegamenuLevel2FixedHandlerBound) return;

    var isInSectionWrap = menuItem.closest && menuItem.closest(".section_naviman_app");

    const updateUlChildrenPosition = () => {
        const ulChildren = menuItem.querySelector('ul.children[menulevel="2"]');
        if (!ulChildren) return;
        ulChildren.style.position = 'fixed';
        ulChildren.style.top = isInSectionWrap ? 'auto' : (menuItem.getBoundingClientRect().bottom) + 'px';
        ulChildren.style.zIndex = 2147483647;
    };

    menuItem._mobileMegamenuLevel2FixedScrollHandler = updateUlChildrenPosition;

    window.addEventListener('scroll', menuItem._mobileMegamenuLevel2FixedScrollHandler, { capture: true, passive: true });

    menuItem._mobileMegamenuLevel2FixedResizeObserver = new ResizeObserver(() => updateUlChildrenPosition());
    menuItem._mobileMegamenuLevel2FixedResizeObserver.observe(menuItem);

    setTimeout(updateUlChildrenPosition, 0);
    menuItem._mobileMegamenuLevel2FixedHandlerBound = true;
};


Menu.Section.fixMobileMegamenuScrollPosition = function(menuItem) {
    if (!menuItem || !(menuItem instanceof Element)) {
        navidebug.warn('[fixMegamenu] menuItem không hợp lệ:', menuItem);
      return;
    }
  
    const submenu = menuItem.querySelector('ul.children[menulevel="2"]');
    if (!submenu) return;
  
    const computed = window.getComputedStyle(submenu);
    if (computed.position !== 'fixed') return;

    if (menuItem.closest && menuItem.closest(".section_naviman_app")) return;
  
    const rect = menuItem.getBoundingClientRect();
    submenu.style.top = `${rect.bottom + 1}px`;
};

/***************************************************************************************************************
 Tối ưu vùng scroll cho SECTION_MOBILE_MEGAMENU:
 - Nếu level 1 toàn bộ là width:auto → set width ul.navigation = tổng width các item level 1
 - Nếu ul.navigation chưa có width (inline) hoặc width == 0 → set mặc định 1280px
****************************************************************************************************************/
Menu.Section.optimizeMobileMegamenuNavigationWidth = function(embed_id) {
    try {
        if (window.innerWidth > 768) return;

        var root = document.getElementById(embed_id);
        if (!root) return;

        var ulNav = root.querySelector(".scroll-mobile ul.navigation") || root.querySelector("ul.navigation");
        if (!ulNav) return;

        var level1Items = ulNav.querySelectorAll(":scope > li.item.level-1");
        if (!level1Items || level1Items.length === 0) return;

        var allAuto = true;
        level1Items.forEach(function(li) {
            if (!li || !li.classList) return;
            if (li.classList.contains("widthfix") && !li.classList.contains("widthauto")) {
                allAuto = false;
            }
        });

        if (allAuto) {
            var total = 0;
            level1Items.forEach(function(li) {
                if (!li || !li.getBoundingClientRect) return;
                var w = li.getBoundingClientRect().width || 0;
                if (w > 0) total += w;
            });

            if (total > 0) {
                ulNav.style.width = Math.ceil(total + 8) + "px";
            }
        }

        var inlineWidth = (ulNav.style.width || "").trim();
        var rectWidth = (ulNav.getBoundingClientRect && ulNav.getBoundingClientRect().width) ? ulNav.getBoundingClientRect().width : 0;

        if (inlineWidth === "" || parseFloat(inlineWidth) === 0 || rectWidth === 0) {
            ulNav.style.width = "1280px";
        }
    } catch (e) {
        navidebug.warn("[optimizeMobileMegamenu] error:", e);
    }
};


Menu.Section.updatePublishToPlaceZIndex = function( embed_id ) {
    var naviItem = document.getElementById(embed_id);
    if( !naviItem ) return;
        const parent = naviItem.closest('.naviman_app');
        if (parent) {
            const childZIndex = window.getComputedStyle(naviItem).zIndex;
            if (childZIndex !== 'auto') {
                parent.style.zIndex = childZIndex;
            }
        }
    
};    var Menu = Menu || {}; 
Menu.Context = Menu.Context || {}; 
Menu.Context.Horizontal = Menu.Context.Horizontal || {}; 

Menu.Context.isSlideMenu = function(menuKind ) {
    if (menuKind == NAVIGLOBAL['MENU_KINDS']['CONTEXT_SLIDE']) 
        return true;    
    return false;
}

Menu.Context.isSlideMenuHorizontal = function(menuKind, embed_id ) {
    if (menuKind == NAVIGLOBAL['MENU_KINDS']['CONTEXT_SLIDE']) {
        var menuItem = document.getElementById(embed_id);
        if (menuItem.getAttribute("ui") == "slide-horizontal")
            return true;    
        return false;
    }
    return false;
}

/**
 * Kiểm tra có dùng slideInFromLeft/slideOutToLeft cho desktop sub-leftright không.
 * Chỉ true khi: desktop + hamburger-desktop-sub-leftright + panel trái (hamburger-left-right).
 * Panel phải (right-left) dùng slideInFromRight như mobile.
 *
 * @param {Element} menu - .naviItem.CONTEXT_SLIDE
 * @returns {boolean}
 */
Menu.Context.shouldSlideFromLeft = function(menu) {
    if (!menu || !menu.classList) return false;
    if (window.innerWidth <= 768) return false; /* mobile: không đụng */
    if (!menu.classList.contains("hamburger-desktop-sub-leftright")) return false;
    return menu.classList.contains("hamburger-left-right");
}

/**
 * Handler click mở menu Navi+: ngăn link chuyển hướng, gọi openNaviMenu(embedId).
 * @param {Event} event
 * @param {string} embedId
 */
Menu.Context.triggerOpenNaviMenu = function(event, embedId) {
  var target = event.currentTarget;
  if (target && target.tagName && target.tagName.toLowerCase() === "a") {
    event.preventDefault();
    event.stopPropagation();
    event.stopImmediatePropagation();
  }
  openNaviMenu(embedId);
};

Menu.Context.checkReplaceHambugerMenu = function(elsIdClass, newEl, callFunction) {
    if (!elsIdClass.includes("#Details-menu-drawer-container")) return;

    const addOverlay = () => {
        const rootEl = document.querySelector("#Details-menu-drawer-container");
        if (!rootEl) return;

        // nếu overlay chưa tồn tại thì chèn lại
        if (!rootEl.previousSibling || !rootEl.previousSibling.classList || !rootEl.previousSibling.classList.contains("navi-hambuger-overlay")) {
            const overlay = document.createElement("div");
            overlay.className = "navi-hambuger-overlay";
            overlay.style.position = "absolute";
            overlay.style.width = rootEl.offsetWidth + "px";
            overlay.style.height = rootEl.offsetHeight + "px";
            overlay.style.background = "rgba(0,0,0,0.0)";
            overlay.style.zIndex = 1000;
            
            overlay.style.top = rootEl.offsetTop + "px";
            overlay.style.left = rootEl.offsetLeft + "px";

            overlay.innerHTML = "&nbsp;";

            // đảm bảo rootEl có position
            if (getComputedStyle(rootEl).position === "static") {
                rootEl.style.position = "relative";
            }

            // chèn overlay ngang cấp (trước rootEl)
            rootEl.parentNode.insertBefore(overlay, rootEl);

            overlay.addEventListener("click", function(event) {
                navidebug.log("Call event by Details-menu-drawer-container overlay");
                callFunction(event);
            });
        }
    };

    // chạy ngay lần đầu
    addOverlay();

    // theo dõi toàn bộ body
    const obs = new MutationObserver(() => addOverlay());
    obs.observe(document.body, { childList: true, subtree: true });
};


var DATA_TRIGGER_BOUND = "data-navi-trigger-bound";

/**
 * Gán trigger mở menu lên một element: clone/clean, thêm click listener, flash, xử lý hamburger.
 * @param {Element} el - Element cần gán trigger
 * @param {string} embedId - embed_id của naviItem
 * @param {string} elsIdClass - CSS selector (dùng cho checkReplaceHambugerMenu)
 * @param {boolean} isReBind - true khi re-bind do DOM bị thay thế (để log khác)
 */
Menu.Context.bindTriggerToElement = function(el, embedId, elsIdClass, isReBind) {
    if (el.getAttribute(DATA_TRIGGER_BOUND) === embedId) return;

    if (isReBind) console.log("[Navi trigger] Re-binding needed: element was replaced, selector=" + elsIdClass);

    const newEl = Helper.HTML.removeAllEventListeners(el);
    Helper.HTML.cleanupElement(newEl, {
        attr: ["data-bs-toggle"],
        class: ["_navi_loading"]
    });
    Helper.HTML.removeChildrenListeners(newEl);

    const openHandler = function(e) { Menu.Context.triggerOpenNaviMenu(e, embedId); };
    newEl.addEventListener("click", openHandler);
    newEl.setAttribute(DATA_TRIGGER_BOUND, embedId);

    Animation.flashTriggerBound(newEl);
    Menu.Context.checkReplaceHambugerMenu(elsIdClass, newEl, openHandler);

    console.log("[Navi trigger] Trigger bound: embedId=" + embedId + ", selector=" + elsIdClass);
};

Menu.Context._triggerWatchRegistry = [];
Menu.Context._triggerRebindDebounceTimer = null;
Menu.Context._triggerObserver = null;

Menu.Context._runTriggerRebindCheck = function() {
    Menu.Context._triggerRebindDebounceTimer = null;
    Menu.Context._triggerWatchRegistry.forEach(function(entry) {
        var els = document.querySelectorAll(entry.selector);
        els.forEach(function(el) {
            if (el.getAttribute(DATA_TRIGGER_BOUND) !== entry.embedId) {
                Menu.Context.bindTriggerToElement(el, entry.embedId, entry.selector, true);
            }
        });
    });
};

Menu.Context._startTriggerMutationObserver = function() {
    if (Menu.Context._triggerObserver) return;
    Menu.Context._triggerObserver = new MutationObserver(function() {
        if (Menu.Context._triggerRebindDebounceTimer) clearTimeout(Menu.Context._triggerRebindDebounceTimer);
        Menu.Context._triggerRebindDebounceTimer = setTimeout(Menu.Context._runTriggerRebindCheck, 300);
    });
    Menu.Context._triggerObserver.observe(document.body, { childList: true, subtree: true });
};

/**
 * Gán sự kiện mở menu (trigger) lên các element được chỉ định bởi publishTriggerIDClass.
 * Duyệt qua từng CSS selector trong setting, tìm các element tương ứng và gọi bindTriggerToElement.
 * Đăng ký selector vào registry để MutationObserver theo dõi và re-bind khi DOM bị thay thế.
 * @param {boolean} isDisplayed - Có đang hiển thị hay không (dự phòng)
 * @param {Object} naviItem - Navi item chứa embed_id và data.setting (displayTrigger, publishTriggerIDClass)
 */
Menu.Context.checkTriggerIDClass = function(isDisplayed, naviItem ) { 
  var setting = naviItem["data"]["setting"];
  if (!isHadValue(setting['displayTrigger']) || setting['displayTrigger'] == "0" || !isHadValue(setting['publishTriggerIDClass']) || setting['publishTriggerIDClass'] == "") return;

  var elsArray = Helper.String.stringToArray(setting['publishTriggerIDClass']);
  var embedId = naviItem["embed_id"];
  var registry = Menu.Context._triggerWatchRegistry;

  elsArray.forEach(function(elsIdClass) {
        navidebug.log(embedId + " added trigger event to: " + elsIdClass);

        elsIdClass = Helper.String.CSSSelectorPlatform(elsIdClass);
        if( elsIdClass == "" ) {
            navidebug.log("Removed publishTriggerIDClass because the suffix platforms");
            return;
        }

        if (!registry.some(function(e) { return e.selector === elsIdClass && e.embedId === embedId; })) {
            registry.push({ selector: elsIdClass, embedId: embedId });
        }

        document.querySelectorAll(elsIdClass).forEach(function(el) {
            Menu.Context.bindTriggerToElement(el, embedId, elsIdClass);
        });
    });

  Menu.Context._startTriggerMutationObserver();

  navidebug.log(`⏰ Time to checkTriggerIDClass: ${performance.now() - window.debugTimeStart} ms`);
}

Menu.Context.isDisplayTrigger = function (menuKindClass, naviItem) {
    if (menuKindClass != "CONTEXT_SLIDE") 
        return false;
    
    var data = naviItem["data"];
    if(typeof data["setting"]["displayTrigger"] == 'undefined')
        return false;

    if (data["setting"]["displayTrigger"] == 1 || data["setting"]["displayTrigger"] == "1" ) {
        return true;
    }

    return false;
};

Menu.Context.splitTriggerFunction = function (str) {
    var match = str.match(/^([^(]+)\(([^)]*)\)$/);
    if (!match) return null;
    return {
        functionName: match[1],
        variableName: match[2] || ''
    };
};

/**
 * Căn arrow (::after) slide menu theo đường giữa dòng chữ .name (không theo cả khối li).
 * Đặt --navi-slide-arrow-y trên từng li; CSS dùng top: var(...) + translateY(-50%).
 *
 * @param {string} embed_id - id phần tử .naviItem.CONTEXT_SLIDE
 */
Menu.Context.alignSlideArrowsToName = function (embed_id) {
    var root = document.getElementById(embed_id);
    if (!root || !root.classList.contains("CONTEXT_SLIDE")) return;

    var items = root.querySelectorAll("li.is-parent-top, li.is-parent");
    for (var i = 0; i < items.length; i++) {
        var li = items[i];
        var nameEl = li.querySelector(".inner .name");
        if (!nameEl) {
            li.style.removeProperty("--navi-slide-arrow-y");
            continue;
        }
        var liRect = li.getBoundingClientRect();
        var nameRect = nameEl.getBoundingClientRect();
        /* Submenu đang display:none / chưa layout: không đo được — để CSS fallback */
        if (liRect.height < 2 || nameRect.height < 1) {
            li.style.removeProperty("--navi-slide-arrow-y");
            continue;
        }
        var centerY = nameRect.top - liRect.top + nameRect.height / 2;
        li.style.setProperty("--navi-slide-arrow-y", centerY + "px");
    }
};

/**
 * Gọi lại căn arrow sau khi panel level 2/3 hiện hoặc ảnh trong menu load (layout đổi sau frame đầu).
 *
 * @param {string} embed_id - id .naviItem.CONTEXT_SLIDE
 */
Menu.Context.scheduleSlideArrowsAlign = function (embed_id) {
    if (!embed_id) return;
    var run = function () {
        Menu.Context.alignSlideArrowsToName(embed_id);
    };
    requestAnimationFrame(function () {
        requestAnimationFrame(run);
    });
    [0, 50, 150, 400, 800].forEach(function (ms) {
        setTimeout(run, ms);
    });
    var root = document.getElementById(embed_id);
    if (!root) return;
    var imgs = root.querySelectorAll("img");
    for (var j = 0; j < imgs.length; j++) {
        var im = imgs[j];
        if (im.complete) continue;
        im.addEventListener("load", run, { once: true });
    }
};

/**
 * Đăng ký resize/load/fonts một lần để gọi lại alignSlideArrowsToName cho mọi slide menu.
 */
Menu.Context.initSlideArrowAlignListeners = function () {
    if (Menu.Context._slideArrowAlignListenersBound) return;
    Menu.Context._slideArrowAlignListenersBound = true;

    var runAll = function () {
        if (!window.navimanData || !Array.isArray(window.navimanData)) return;
        var mk = typeof NAVIGLOBAL !== "undefined" ? NAVIGLOBAL["MENU_KINDS"]["CONTEXT_SLIDE"] : null;
        window.navimanData.forEach(function (n) {
            if (mk != null && n.menuKind === mk) Menu.Context.alignSlideArrowsToName(n.embed_id);
        });
    };

    var debounceTimer = null;
    var onResize = function () {
        if (debounceTimer) clearTimeout(debounceTimer);
        debounceTimer = setTimeout(function () {
            debounceTimer = null;
            requestAnimationFrame(runAll);
        }, 100);
    };

    window.addEventListener("resize", onResize);
    window.addEventListener("load", function () {
        requestAnimationFrame(runAll);
    });
    if (document.fonts && document.fonts.ready) {
        document.fonts.ready.then(function () {
            requestAnimationFrame(runAll);
        });
    }
};

/**
 * Sinh CSS cho menu CONTEXT_SLIDE: màu submenu, arrow, desktop sub-leftright (width/position level 2, 3).
 *
 * @param {string} idCssNaviPrefix - Selector prefix, ví dụ " #embed_id "
 * @param {Object} setting - Cấu hình menu
 * @param {Object} dragdrop
 * @param {boolean} isNaviSection
 * @param {Object} section_setting
 * @param {string} embed_id
 * @param {Element} naviman_appItem
 * @param {number} menuKind
 * @returns {string}
 */
Menu.Context.generateCSS_FixForHambuger = function (idCssNaviPrefix, setting, dragdrop, isNaviSection, section_setting, embed_id, naviman_appItem, menuKind) {
    var addHtml = " ";
    if( menuKind != NAVIGLOBAL['MENU_KINDS']['CONTEXT_SLIDE'] )
        return;

    var isOnMobile = (window.innerWidth <= 768);

    if (isHadValue(setting['submenuBackgroundColor']))
        addHtml += idCssNaviPrefix + ' ul.children { background: ' + setting['submenuBackgroundColor'] + '; } ';

    if (isHadValue(setting['submenuDividerColor']))
        addHtml += idCssNaviPrefix + ' ul.children ul.children { border-color: ' + setting['submenuDividerColor'] + '; } ';

    // slide-horizontal: đồng bộ toàn bộ màu level 2/3 với level 1 (bg, text, icon, header, back icon).
    // Nhận diện qua setting['ui'] === 'slide-horizontal' HOẶC setting['expandEffect'] == 2.
    var isSlideHorizontal = setting['ui'] === 'slide-horizontal'
                          || String(setting['expandEffect']) === '2';

    if (isSlideHorizontal) {

        // Background: panel level 2, 3 + cả 2 header dùng backgroundColor level 1.
        if (isHadValue(setting['backgroundColor'])) {
            addHtml += idCssNaviPrefix + ' ul li.item > ul.children,'
                     + idCssNaviPrefix + ' ul li.item > ul.children li ul.children'
                     + ' { background: ' + setting['backgroundColor'] + ' !important; } ';

            addHtml += idCssNaviPrefix + ' .slide-horizontal-header,'
                     + idCssNaviPrefix + ' .slide-horizontal-header-level3'
                     + ' { background-color: ' + setting['backgroundColor'] + ' !important; } ';
        }

        // Text: li.child .name, .description + header title dùng textColor level 1.
        if (isHadValue(setting['textColor'])) {
            addHtml += idCssNaviPrefix + ' ul li.child .name,'
                     + idCssNaviPrefix + ' ul li.child .description'
                     + ' { color: ' + setting['textColor'] + ' !important; } ';

            addHtml += idCssNaviPrefix + ' .slide-horizontal-header-title'
                     + ' { color: ' + setting['textColor'] + ' !important; } ';

            // Arrow trong submenu theo textColor @ 30% opacity.
            addHtml += idCssNaviPrefix + ' ul li.child.is-parent::after'
                     + ' { color: ' + Helper.Color.hexToRgb(setting['textColor'], 30) + ' !important; } ';
        }

        // Icon: li.child .icon i + close icon + back icon + back-clone dùng iconColor (fallback textColor).
        var iconColorVal = isHadValue(setting['iconColor']) ? setting['iconColor']
                         : (isHadValue(setting['textColor']) ? setting['textColor'] : null);
        if (iconColorVal) {
            addHtml += idCssNaviPrefix + ' ul li.child .icon i'
                     + ' { color: ' + iconColorVal + ' !important; } ';

            addHtml += idCssNaviPrefix + ' i.close-icon,'
                     + idCssNaviPrefix + ' i.back-icon,'
                     + idCssNaviPrefix + ' .slide-horizontal-back-clone-icon'
                     + ' { color: ' + iconColorVal + ' !important; } ';
        }

        // Divider: dùng dividerColor level 1 khi không set submenuDividerColor.
        if (!isHadValue(setting['submenuDividerColor']) && isHadValue(setting['dividerColor'])) {
            addHtml += idCssNaviPrefix + ' ul li.child_divider'
                     + ' { border-color: ' + setting['dividerColor'] + ' !important; } ';
        }
    }

    Menu.Context.initSlideArrowAlignListeners();
    var scheduleAlign = function () {
        Menu.Context.alignSlideArrowsToName(embed_id);
    };
    requestAnimationFrame(scheduleAlign);
    setTimeout(scheduleAlign, 100);
    setTimeout(scheduleAlign, 1000);
    if (document.fonts && document.fonts.ready) {
        document.fonts.ready.then(scheduleAlign);
    }

    // Lưu vào biến window về hamburgerSubDirection để dùng trong hàm showLevel2Items nhằm reset all sub menus -----------------------
    if (!window.hamburgerSubDirection)
        window.hamburgerSubDirection = {};
    // Mobile: option 3 không hỗ trợ → fallback về option 1 (top-down expand)
    // Option 4 = slide-horizontal trên desktop → xử lý qua ui="slide-horizontal", không cần subDir riêng
    var _subDir = setting["hamburgerSubDirection"];
    if (isOnMobile && _subDir == 3) _subDir = 1;
    if (_subDir == 4) _subDir = 1; // Option 4 (desktop slide-h): treat same as default for sub-menu direction logic
    window.hamburgerSubDirection[embed_id] = _subDir;

    // Trên desktop mở menu ra ngoài thay vì xổ xuống
    if( !isOnMobile ) { // Desktop only

        if (setting["hamburgerSubDirection"] == 2) {

            // Xác định vị trí hamburger: 1 = trái, 2 = phải (mặc định là 1)
            let hamburgerPosition = 1;
            if (setting["hamburgerPosition"] != null) {
                hamburgerPosition = parseInt(setting["hamburgerPosition"]);
                if (hamburgerPosition !== 2) hamburgerPosition = 1;
            }

            const parentMenuSize = getHiddenDivSize(document.querySelector(idCssNaviPrefix));

            // Bọc trong @media (min-width: 769px) để chỉ áp dụng trên desktop, tránh ảnh hưởng mobile.
            // Vị trí thực tế được tính lại chính xác bằng inline style tại thời điểm click (showLevel2Items).
            addHtml += `@media (min-width: 769px) {
                ${idCssNaviPrefix} ul li.item > ul.children {
                    position: fixed;
                    top: 0px;
                    height: 100% !important;
                    border: 0px;
                    margin-top: 0px;
                    border-radius: 0px;
                    ${hamburgerPosition === 2
                        ? 'border-right: solid 1px rgba(128,128,128,0.2); right: ' + parentMenuSize.width + 'px; left: initial;'
                        : 'border-left: solid 1px rgba(128,128,128,0.2); left: ' + parentMenuSize.width + 'px;'}
                    width: ${parentMenuSize.width}px;
                }
            }`;


            // Arrow level 2/3: vị trí dọc do JS (--navi-slide-arrow-y), chỉ chỉnh right trên desktop
            addHtml += `@media (min-width: 769px) {
                ${idCssNaviPrefix} ul > li.is-parent-top ul li.is-parent::after {
                    right: 8px;
                }
            }`;
        }

        if (setting["hamburgerSubDirection"] == 3) {
            const parentMenuSize = getHiddenDivSize(document.querySelector(idCssNaviPrefix));
            let hamburgerPosition = 1;
            if (setting["hamburgerPosition"] != null) {
                hamburgerPosition = parseInt(setting["hamburgerPosition"]);
                if (hamburgerPosition !== 2) hamburgerPosition = 1;
            }

            // Hướng bóng theo hamburgerPosition: panel phải → bóng sang trái (offset-x âm), ngược lại sang phải.
            const shadowDir3 = hamburgerPosition === 2
                ? '-4px 8px 8px 0px rgba(0, 0, 0, 0.1)'
                : '4px 4px 8px 0px rgba(0, 0, 0, 0.10)';

            // Bọc trong media query để chỉ áp dụng trên desktop
            addHtml += `@media (min-width: 769px) {
                ${idCssNaviPrefix} ul li.item > ul.children {
                    position: fixed;
                    border: 0px;
                    margin-top: 0px;
                    border-radius: 4px;
                    ${hamburgerPosition === 2
                        ? 'border-right: solid 1px rgba(128,128,128,0.2);'
                        : 'border-left: solid 1px rgba(128,128,128,0.2);'}
                    width: ${parentMenuSize.width}px;
                    overflow-y: auto;
                    box-shadow: ${shadowDir3};
                }

                ${idCssNaviPrefix} ul li.item > ul.children li ul.children {
                    box-shadow: ${shadowDir3};
                    border: 0px;
                    ${hamburgerPosition === 2
                        ? 'border-right: solid 1px rgba(128,128,128,0.2);'
                        : 'border-left: solid 1px rgba(128,128,128,0.2);'}
                }

                ${idCssNaviPrefix} ul > li.is-parent-top ul li.is-parent::after {
                    right: 8px;
                }
            }`;
        }

    }


    return addHtml;
};

/* slide-horizontal có nhiều logic riêng → đã tách sang `MenuContext_SlideHorizontal.js` */    var Menu = Menu || {};
Menu.Context = Menu.Context || {};
Menu.Context.Horizontal = Menu.Context.Horizontal || {};

/**
 * Hiện/ẩn nút back trên slide-horizontal dựa vào trạng thái submenu đang mở.
 * - Nếu có level 2 hoặc level 3 đang hiển thị → thêm class navi-back-visible (hiện nút back, ẩn nút close).
 * - Ngược lại → gỡ class (ẩn nút back, hiện nút close).
 * @param {Element} menu - .naviItem.CONTEXT_SLIDE[ui="slide-horizontal"]
 */
Menu.Context.Horizontal.showBackButton = function(menu) {
    if (!menu) return;
    if (!menu.classList || !menu.classList.contains("CONTEXT_SLIDE")) return;
    if (menu.getAttribute("ui") != "slide-horizontal") return;

    const hasLevel2 = Array.from(menu.querySelectorAll('ul.children[menulevel="2"]'))
        .some(ul => window.getComputedStyle(ul).display !== "none");
    const hasLevel3 = Array.from(menu.querySelectorAll('ul.children[menulevel="3"]'))
        .some(ul => window.getComputedStyle(ul).display !== "none");

    if (hasLevel2 || hasLevel3)
        menu.classList.add("navi-back-visible");
    else
        menu.classList.remove("navi-back-visible");
}

/**
 * Reset slide-horizontal menu về level 1 (không animation). Dùng khi đóng qua overlay/close btn.
 * Tránh bug: mở lại menu thấy header level 2 nhưng content level 1.
 * @param {Element} menu - .naviItem.CONTEXT_SLIDE[ui="slide-horizontal"]
 */
Menu.Context.Horizontal.resetToLevel1 = function(menu) {
    if (!menu || !menu.classList || !menu.classList.contains("CONTEXT_SLIDE")) return;
    if (menu.getAttribute("ui") != "slide-horizontal") return;

    menu.querySelectorAll('ul.children').forEach(function(ul) {
        ul.style.display = "none";
        ul.classList.remove("navi-level2-scroll-locked");
        if (ul._naviPrevScrollTop !== undefined) delete ul._naviPrevScrollTop;
    });

    menu.querySelectorAll('.menu-expand, .menu-expand-level1, .menu-expand-level2').forEach(function(li) {
        li.classList.remove("menu-expand", "menu-expand-level1", "menu-expand-level2");
    });

    menu.querySelectorAll('span.arrow').forEach(function(arrow) {
        arrow.style.display = "none";
    });

    menu.querySelectorAll('li.overlay-container').forEach(function(el) {
        el.remove();
    });

    var level2Ul = menu.querySelector('ul.children[menulevel="2"]');
    if (level2Ul) level2Ul.style.overflowY = "auto";

    /* Ẩn fake header level 3 nếu còn hiển thị (tránh bị kẹt khi close qua overlay/close btn) */
    var level3FakeHeader = menu.querySelector(".slide-horizontal-header-level3");
    if (level3FakeHeader) level3FakeHeader.style.display = "none";

    menu.classList.remove("navi-level3-open");
    Menu.Context.Horizontal.setHeaderTitle(menu, "");
    Menu.Context.Horizontal.showBackButton(menu);
}


/**
 * Lấy submenu đang mở (level 2 hoặc 3).
 * @param {Element} menu - .naviItem.CONTEXT_SLIDE
 * @param {string} menuLevel - "2" hoặc "3"
 * @returns {{ul: Element, li: Element}|null}
 */
Menu.Context.Horizontal.getOpenedSubmenu = function(menu, menuLevel) {
    if (!menu) return;
    if (!menu.classList || !menu.classList.contains("CONTEXT_SLIDE")) return;
    if (menu.getAttribute("ui") != "slide-horizontal") return;

    const opened = Array.from(menu.querySelectorAll('ul.children[menulevel="' + menuLevel + '"]'))
        .filter(ul => window.getComputedStyle(ul).display !== "none");
    if (opened.length == 0) return null;
    const ul = opened[opened.length - 1];
    const li = ul.closest("li");
    return { ul, li };
}

/**
 * Tạo icon back giả (clone) trong header để chạy cùng animation.
 * Chỉ dùng cho hiệu ứng mở/đóng, không phải icon thật. Khi xong animation phải gọi removeBackCloneFake.
 *
 * @param {Element} menu - .naviItem.CONTEXT_SLIDE
 * @param {Element} [headerEl] - Header để chèn clone vào. Nếu không truyền thì dùng ensureHeaderElement(menu)
 * @returns {Element|null} Wrapper của clone, hoặc null nếu thất bại
 */
Menu.Context.Horizontal.createBackCloneFake = function(menu, headerEl) {
    if (!menu) return null;
    var header = headerEl || (Menu.Context.Horizontal.ensureHeaderElement ? Menu.Context.Horizontal.ensureHeaderElement(menu) : null);
    if (!header) return null;

    var backIconSrc = menu.querySelector("i.back-icon");
    var backCloneIcon = backIconSrc ? backIconSrc.cloneNode(true) : (function() {
        var i = document.createElement("i");
        i.className = "ri-arrow-left-line back-icon";
        i.setAttribute("aria-hidden", "true");
        return i;
    }());
    backCloneIcon.classList.add("slide-horizontal-back-clone-icon");
    backCloneIcon.style.display = "";

    var wrapper = document.createElement("div");
    wrapper.className = "slide-horizontal-back-clone";
    wrapper.appendChild(backCloneIcon);
    header.insertBefore(wrapper, header.firstChild);
    return wrapper;
};

/**
 * Xoá icon back giả (clone) đã tạo bởi createBackCloneFake.
 * @param {Element|null} cloneEl - Phần tử wrapper trả về từ createBackCloneFake
 */
Menu.Context.Horizontal.removeBackCloneFake = function(cloneEl) {
    if (cloneEl && cloneEl.parentNode) cloneEl.parentNode.removeChild(cloneEl);
};

/**
 * Tạo hoặc lấy header riêng cho level 3 (fake header trượt cùng panel level 3).
 * Header này đè lên header chính, giúp header chính giữ nguyên title level 2.
 * @param {Element} menu - .naviItem.CONTEXT_SLIDE
 * @returns {Element|null}
 */
Menu.Context.Horizontal.ensureLevel3Header = function(menu) {
    if (!menu) return null;
    var header = menu.querySelector(".slide-horizontal-header-level3");
    if (!header) {
        header = document.createElement("div");
        header.className = "slide-horizontal-header-level3";
        header.style.display = "none";

        /* Back clone: clickable, kích hoạt closeLevel3 qua event handler có sẵn */
        var backClone = document.createElement("div");
        backClone.className = "slide-horizontal-back-clone slide-horizontal-back-clone-active";
        var backIcon = document.createElement("i");
        backIcon.className = "ri-arrow-left-line back-icon";
        backClone.appendChild(backIcon);
        header.appendChild(backClone);

        var titleSpan = document.createElement("span");
        titleSpan.className = "slide-horizontal-header-title";
        header.appendChild(titleSpan);

        menu.appendChild(header);
    }
    return header;
};

/**
 * Slide in fake header level 3 cùng hướng với panel level 3.
 * Header cùng kích thước panel (90% width) nên trượt vào đồng thời trông như 1 khối.
 * @param {Element} menu - .naviItem.CONTEXT_SLIDE
 * @param {string} title - Tiêu đề của item level 3
 * @param {boolean} slideFromLeft
 */
Menu.Context.Horizontal.slideInLevel3Header = function(menu, title, slideFromLeft) {
    var header = Menu.Context.Horizontal.ensureLevel3Header(menu);
    if (!header) return;

    var titleSpan = header.querySelector(".slide-horizontal-header-title");
    if (titleSpan) titleSpan.textContent = title || "";

    if (slideFromLeft)
        Animation.slideInFromLeft(header, { displayValue: "flex" });
    else
        Animation.slideInFromRight(header, { displayValue: "flex" });
};

/**
 * Slide out fake header level 3 cùng hướng với panel level 3, rồi ẩn đi.
 * @param {Element} menu - .naviItem.CONTEXT_SLIDE
 * @param {boolean} slideFromLeft
 * @param {Function} [doneCallback]
 */
Menu.Context.Horizontal.slideOutLevel3Header = function(menu, slideFromLeft, doneCallback) {
    var header = menu ? menu.querySelector(".slide-horizontal-header-level3") : null;
    if (!header || header.style.display === "none") {
        if (typeof doneCallback === "function") doneCallback();
        return;
    }

    var opts = {
        doneCallback: function() {
            header.style.display = "none";
            if (typeof doneCallback === "function") doneCallback();
        }
    };
    if (slideFromLeft)
        Animation.slideOutToLeft(header, opts);
    else
        Animation.slideOutToRight(header, opts);
};

/**
 * Đảm bảo tồn tại header cho slide-horizontal (chứa title hiện tại).
 * @param {Element} menu - .naviItem.CONTEXT_SLIDE
 * @returns {Element|null}
 */

Menu.Context.Horizontal.ensureHeaderElement = function(menu) {
    if (!menu) return null;
    if (!menu.classList || !menu.classList.contains("CONTEXT_SLIDE")) return null;
    if (menu.getAttribute("ui") != "slide-horizontal") return null;

    var header = menu.querySelector(".slide-horizontal-header");
    if (!header) {
        header = document.createElement("div");
        header.className = "slide-horizontal-header";

        var titleSpan = document.createElement("span");
        titleSpan.className = "slide-horizontal-header-title";
        header.appendChild(titleSpan);

        menu.appendChild(header);
    }
    return header;
};

/**
 * Set text cho header title của slide-horizontal.
 * @param {Element} menu - .naviItem.CONTEXT_SLIDE
 * @param {string} title
 */
Menu.Context.Horizontal.setHeaderTitle = function(menu, title) {
    var header = Menu.Context.Horizontal.ensureHeaderElement(menu);
    if (!header) return;

    var titleSpan = header.querySelector(".slide-horizontal-header-title");
    if (!titleSpan) {
        titleSpan = document.createElement("span");
        titleSpan.className = "slide-horizontal-header-title";
        header.appendChild(titleSpan);
    }

    title = (title || "").trim();
    if (title) {
        titleSpan.textContent = title;
        header.style.display = "flex";
    } else {
        titleSpan.textContent = "";
        header.style.display = "none";
    }
};

/**
 * Cập nhật header title theo menuItem đang mở (level 2 hoặc 3).
 * @param {Element} menuItem - li.item đang mở submenu
 */
Menu.Context.Horizontal.updateHeaderTitleFromMenuItem = function(menuItem) {
    if (!menuItem || !menuItem.closest) return;
    var menu = menuItem.closest(".naviItem.CONTEXT_SLIDE");
    if (!menu || menu.getAttribute("ui") != "slide-horizontal") return;

    var title = "";
    var titleEl = null;

    try {
        titleEl = menuItem.querySelector(":scope > .inner .name");
    } catch (e) {
        // Fallback nếu browser không hỗ trợ :scope (hiếm)
        titleEl = menuItem.querySelector(".inner .name");
    }

    if (titleEl && titleEl.textContent)
        title = titleEl.textContent.trim();

    if (!title && menuItem.dataset && menuItem.dataset.name)
        title = menuItem.dataset.name;

    if (!title)
        title = menuItem.getAttribute("data-name") || "";

    Menu.Context.Horizontal.setHeaderTitle(menu, title);
};

/**
 * Refresh lại header title dựa trên submenu đang mở:
 * - Ưu tiên level 3, nếu không có thì lấy level 2.
 * - Nếu không có submenu nào, xoá title.
 * @param {Element} menu - .naviItem.CONTEXT_SLIDE
 */
Menu.Context.Horizontal.refreshHeaderTitle = function(menu) {
    if (!menu) return;
    if (!menu.classList || !menu.classList.contains("CONTEXT_SLIDE")) return;
    if (menu.getAttribute("ui") != "slide-horizontal") return;

    /* Level 3 dùng fake header riêng, header chính chỉ phản ánh level 2.
       Nếu level 3 đang mở, bỏ qua level 3 và dùng level 2 cho header chính. */
    var openedLevel2 = Menu.Context.Horizontal.getOpenedSubmenu(menu, "2");
    if (openedLevel2 && openedLevel2.li) {
        Menu.Context.Horizontal.updateHeaderTitleFromMenuItem(openedLevel2.li);
        return;
    }

    Menu.Context.Horizontal.setHeaderTitle(menu, "");
};

/**
 * Áp dụng animation mở submenu (level 2 hoặc 3).
 * Chọn fadeIn, slideInFromLeft hoặc slideInFromRight theo loại menu.
 *
 * @param {Element} menuItem - li.item chứa submenu
 * @param {Element} submenuElement - ul.children
 * @param {number} menuKind
 * @param {string} mode - "level2" hoặc "level3"
 * @returns {boolean}
 */
Menu.Context.Horizontal.applyOpenAnimation = function (menuItem, submenuElement, menuKind, mode) {
    if (!submenuElement) return false;

    if (menuKind != NAVIGLOBAL['MENU_KINDS']['CONTEXT_SLIDE'])
        return false;

    var menuLevel = submenuElement.getAttribute('menulevel');
    if (menuLevel !== "2" && menuLevel !== "3") return false;
    if (mode === "level2" && menuLevel !== "2") return false;
    if (mode === "level3" && menuLevel !== "3") return false;

    var menu = menuItem.closest ? menuItem.closest(".naviItem.CONTEXT_SLIDE") : null;
    var embed_id = menu ? menu.id : "";
    var isHorizontal = Menu.Context.isSlideMenuHorizontal(menuKind, embed_id);
    var slideFromLeft = menu && Menu.Context.shouldSlideFromLeft(menu);
    /* right-left: panel ở bên phải → submenu vào từ trái (ngược với left-right) */
    if (isHorizontal && menu && menu.classList.contains("hamburger-right-left")) slideFromLeft = true;

    var config = {
        "2": { expandClass: "menu-expand-level1", displayValue: "block" },
        /* width không set inline: CSS đã có width:90% → translateX(100%) = 90vw = khớp fake level3 header (cũng 90%) */
        "3": { expandClass: "menu-expand-level2", displayValue: "inline-block" }
    };
    var cfg = config[menuLevel] || config["2"];

    menuItem.classList.add(cfg.expandClass);

    var header = menu && Menu.Context.Horizontal.ensureHeaderElement ? Menu.Context.Horizontal.ensureHeaderElement(menu) : null;
    if (header && Menu.Context.Horizontal.updateHeaderTitleFromMenuItem) {
        /* Level 3 horizontal: header chính giữ nguyên title level 2, fake header riêng sẽ slide in */
        if (!(isHorizontal && menuLevel === "3")) {
            Menu.Context.Horizontal.updateHeaderTitleFromMenuItem(menuItem);
        }
    }

    var overlayElOpen = null;
    var closeBtnOpen = null;
    var closeIconOpen = null;
    var backCloneEl = null;
    if (isHorizontal && menuLevel === "2" && menu && header) {
        backCloneEl = Menu.Context.Horizontal.createBackCloneFake(menu);
    }
    /* hamburger-full-fixed: sidebar luôn visible có overflow-y:auto → trên iOS Safari position:fixed bên trong
       overflow:auto bị treat như position:absolute → khi sidebar đã scroll thì top:0 bị lệch off-screen.
       Fix: reset scrollTop về 0 và lock overflow TRƯỚC khi animation để panel/header ở đúng vị trí. */
    if (isHorizontal && menuLevel === "2" && menu && menu.classList.contains("hamburger-full-fixed")) {
        menu._naviFullFixedScrollTop = menu.scrollTop;
        menu.scrollTop = 0;
        menu.style.setProperty("overflow", "hidden", "important");
    }
    if (isHorizontal && menuLevel === "2" && menu) {
        /* Ẩn icon close: dùng opacity/visibility/transform (không dùng display:none để transition mượt) */
        closeBtnOpen = menu.querySelector(".hamburger_close");
        closeIconOpen = menu.querySelector("i.close-icon");
        var translateOff = menu.classList.contains("hamburger-right-left") ? "translateX(-100%)" : "translateX(100%)";
        [closeBtnOpen, closeIconOpen].forEach(function(el) {
            if (!el) return;
            el.style.setProperty("visibility", "hidden", "important");
            el.style.setProperty("opacity", "0", "important");
            el.style.setProperty("pointer-events", "none", "important");
            el.style.setProperty("transform", translateOff, "important");
            el.style.setProperty("transition", "none", "important");
        });
        menu.classList.add("slide-open-animating");
        /* Đặt overlay TRONG level1 ul (position:absolute) để không phủ lên level2 panel (position:fixed;z-index:900) */
        var level1Ul = menu.querySelector('ul.children[menulevel="1"]');
        if (level1Ul) {
            var existedL1 = level1Ul.querySelector(':scope > .slide-horizontal-close-overlay');
            if (existedL1 && existedL1.parentNode) existedL1.parentNode.removeChild(existedL1);
            overlayElOpen = document.createElement("div");
            overlayElOpen.className = "slide-horizontal-close-overlay";
            overlayElOpen.style.cssText = "position:absolute;top:" + level1Ul.scrollTop + "px;left:0;right:0;height:" + level1Ul.offsetHeight + "px;background:rgba(128,128,128,0.05);z-index:2;pointer-events:none;";
            level1Ul.insertBefore(overlayElOpen, level1Ul.firstChild);
        } else {
            overlayElOpen = document.createElement("div");
            overlayElOpen.className = "slide-horizontal-close-overlay";
            overlayElOpen.style.cssText = "position:fixed;top:0;left:0;right:0;bottom:0;background:rgba(128,128,128,0.05);z-index:2;pointer-events:none;";
            menu.appendChild(overlayElOpen);
        }
        menu.classList.add("slide-horizontal-level2-shadow");
    }
    if (isHorizontal && menuLevel === "3" && menu) {
        /* Level 2 <-> Level 3: phủ overlay tạm trong lúc animation (giống lúc mở level 2 từ level 1) */
        /* Dùng closest để lấy đúng level2Panel chứa menuItem đang click (tránh lấy nhầm panel đầu tiên trong DOM) */
        var level2Panel = menuItem.closest ? menuItem.closest('ul.children[menulevel="2"]') : menu.querySelector('ul.children[menulevel="2"]');
        if (level2Panel) {
            /* Lưu scrollTop TRƯỚC khi thêm navi-level2-scroll-locked (overflow:hidden có thể reset scrollTop về 0) */
            var savedScrollTop = level2Panel.scrollTop;
            /* Khoá scroll level 2 trong khi level 3 đang hiển thị (tránh user scroll level 2 khi đang ở level 3) */
            level2Panel.classList.add("navi-level2-scroll-locked");

            // Tránh overlay tồn đọng khi thao tác nhanh
            var existed = level2Panel.querySelector(':scope > .slide-horizontal-close-overlay.slide-horizontal-overlay-level2-only');
            if (existed && existed.parentNode) existed.parentNode.removeChild(existed);

            overlayElOpen = document.createElement("div");
            overlayElOpen.className = "slide-horizontal-close-overlay slide-horizontal-overlay-level2-only";
            /* Dùng savedScrollTop (trước khi lock) để overlay luôn hiện tại vùng nhìn thấy được của level 2 */
            overlayElOpen.style.cssText = "position:absolute;top:" + savedScrollTop + "px;left:0;right:0;height:" + level2Panel.offsetHeight + "px;background:rgba(128,128,128,0.05);z-index:10;pointer-events:none;";
            level2Panel.insertBefore(overlayElOpen, level2Panel.firstChild);
        } else {
            // Fallback nếu không tìm thấy level 2 panel
            overlayElOpen = document.createElement("div");
            overlayElOpen.className = "slide-horizontal-close-overlay";
            var rectOpenL3 = menu.getBoundingClientRect();
            overlayElOpen.style.cssText = "position:fixed;top:" + rectOpenL3.top + "px;left:" + rectOpenL3.left + "px;width:" + rectOpenL3.width + "px;height:" + (typeof window !== "undefined" ? window.innerHeight : rectOpenL3.height) + "px;background:rgba(128,128,128,0.05);z-index:899;pointer-events:none;";
            menu.appendChild(overlayElOpen);
        }
    }
    var doneCallback = function() {
        if (overlayElOpen && overlayElOpen.parentNode) overlayElOpen.parentNode.removeChild(overlayElOpen);
        /* Gỡ border-left tạm đã thêm trước animation (panel + header) */
        if (isHorizontal) {
            submenuElement.style.removeProperty("border-left");
            if (header) header.style.removeProperty("border-left");
            if (menuLevel === "3" && menu) {
                var fakeHdrDone = menu.querySelector(".slide-horizontal-header-level3");
                if (fakeHdrDone) fakeHdrDone.style.removeProperty("border-left");
            }
        }
        menu.classList.remove("slide-horizontal-level2-shadow", "slide-open-animating");
        Menu.Context.Horizontal.removeBackCloneFake(backCloneEl);
        /* Level 3: ẩn real back button trước khi showBackButton thêm navi-back-visible,
           tránh flicker (right-left menu: real back button ở left:0, fake clone ở cạnh panel) */
        if (isHorizontal && menuLevel === "3") menu.classList.add("navi-level3-open");
        Menu.Context.Horizontal.showBackButton(menu);
        /* right-left: real back button mặc định ở left:0 (góc trái viewport) nhưng panel ở bên phải →
           sau animation xong tính lại left dựa vào vị trí thực của panel để back button nằm đúng cạnh panel */
        if (isHorizontal && menu.classList.contains("hamburger-right-left")) {
            var backBtn = menu.querySelector(".hamburger_back");
            var backIconEl = menu.querySelector("i.back-icon");
            var panelEl = submenuElement || menu.querySelector('ul.children[menulevel="2"]');
            if (panelEl && backBtn) {
                var panelLeft = panelEl.getBoundingClientRect().left;
                backBtn.style.left = panelLeft + "px";
                if (backIconEl) backIconEl.style.left = (panelLeft + 14) + "px";
            }
        }
        /* Chỉ gỡ inline style close khi là level 2 (ta đã thêm để ẩn). */
        if (menuLevel === "2") {
            var closeBtnDone = menu && menu.querySelector ? menu.querySelector(".hamburger_close") : null;
            var closeIconDone = menu && menu.querySelector ? menu.querySelector("i.close-icon") : null;
            [closeBtnDone, closeIconDone].forEach(function(el) {
                if (!el) return;
                el.style.removeProperty("visibility"); el.style.removeProperty("opacity");
                el.style.removeProperty("pointer-events"); el.style.removeProperty("transform"); el.style.removeProperty("transition");
            });
            /* Xóa inline transform khỏi level 2 sau khi animation xong.
               transform khác none (dù là translateX(0)) sẽ biến level 2 thành containing block cho level 3,
               khiến position:fixed của level 3 bị tương đối với level 2 thay vì viewport → animation level 3 bị clip/lệch. */
            submenuElement.style.removeProperty("transform");
            submenuElement.style.removeProperty("transition");
            submenuElement.style.removeProperty("opacity");
        }
        menuItem.classList.add("menu-expand");
        if (menu && menu.id && Menu.Context.scheduleSlideArrowsAlign)
            Menu.Context.scheduleSlideArrowsAlign(menu.id);
    };

    var options = {
        displayValue: cfg.displayValue,
        doneCallback: doneCallback,
        initialStyles: cfg.initialStyles || {}
    };

    /* Level 2 hoặc non-horizontal: animate header chính trượt vào */
    if (header && !(isHorizontal && menuLevel === "3")) {
        var headerOpts = { displayValue: "flex" };
        if (!isHorizontal)
            Animation.fadeIn(header, headerOpts);
        else if (slideFromLeft)
            Animation.slideInFromLeft(header, headerOpts);
        else
            Animation.slideInFromRight(header, headerOpts);
        /* Border-left chạy liên tục từ header xuống panel: thêm cùng lúc với panel */
        if (isHorizontal) header.style.setProperty("border-left", "1px solid rgba(128, 128, 128, 0.3)", "important");
    }

    /* Level 3 horizontal: slide in fake header riêng, header chính giữ nguyên title level 2 */
    if (isHorizontal && menuLevel === "3" && menu) {
        var l3Title = "";
        var l3TitleEl = null;
        try { l3TitleEl = menuItem.querySelector(":scope > .inner .name"); } catch(e) { l3TitleEl = menuItem.querySelector(".inner .name"); }
        if (l3TitleEl) l3Title = l3TitleEl.textContent.trim();
        if (!l3Title) l3Title = menuItem.getAttribute("data-name") || "";

        /* Fake level3 header slide in cùng hướng với panel level 3 (cùng width 90% → trông như 1 khối) */
        Menu.Context.Horizontal.slideInLevel3Header(menu, l3Title, slideFromLeft);

        /* Thêm border-left cho fake header cùng với panel để trông như 1 khối */
        var fakeHdrOpen = menu.querySelector(".slide-horizontal-header-level3");
        if (fakeHdrOpen) fakeHdrOpen.style.setProperty("border-left", "1px solid rgba(128, 128, 128, 0.3)", "important");
    }

    /* Thêm border-left tạm trong lúc animation để tạo visual separator (gỡ trong doneCallback) */
    if (isHorizontal) {
        submenuElement.style.setProperty("border-left", "1px solid rgba(128, 128, 128, 0.3)", "important");
    }

    if (!isHorizontal)
        return Animation.fadeIn(submenuElement, options);
    return slideFromLeft
        ? Animation.slideInFromLeft(submenuElement, options)
        : Animation.slideInFromRight(submenuElement, options);
}

/**
 * Áp dụng animation đóng submenu.
 * Chọn fadeOut, slideOutToLeft hoặc slideOutToRight theo loại menu.
 *
 * @param {Element} submenuElement - ul.children cần đóng
 * @param {string} mode - "level2" hoặc "level3"
 * @param {Function} doneCallback - Gọi sau khi animation xong
 * @param {boolean} [isHorizontal] - Nếu undefined sẽ tự detect từ menu
 */
Menu.Context.Horizontal.applyCloseAnimation = function(submenuElement, mode, doneCallback, isHorizontal) {
    if (!submenuElement) return false;

    var menu = submenuElement.closest ? submenuElement.closest(".naviItem.CONTEXT_SLIDE") : null;
    if (typeof isHorizontal === "undefined" && menu) {
        var embed_id = menu.id;
        var menuKind = window._openingEmbedId == embed_id ? window._openingMenuKind : NAVIGLOBAL['MENU_KINDS']['CONTEXT_SLIDE'];
        isHorizontal = menu.getAttribute("ui") === "slide-horizontal";
    }
    if (typeof isHorizontal === "undefined") isHorizontal = true;

    var slideFromLeft = menu && Menu.Context.shouldSlideFromLeft(menu);
    /* right-left: panel ở bên phải → submenu đóng sang phải (ngược với left-right) */
    if (isHorizontal && menu && menu.classList.contains("hamburger-right-left")) slideFromLeft = true;
    var menuLevel = submenuElement.getAttribute('menulevel');
    var isOnMobile = (typeof window !== "undefined") ? (window.innerWidth <= 768) : false;
    var overlayEl = null;
    var overlayElL3 = null;
    var closeBtnClose = null;
    var closeIconClose = null;
    var backCloneClose = null;

    /* Khi đóng level 2 về level 1: dùng cùng slideDistancePx để header và content trượt đồng bộ, phủ qua level 1 */
    var slideDistancePx = null;
    if (isHorizontal && menuLevel === "2" && menu) {
        slideDistancePx = submenuElement.offsetWidth || menu.offsetWidth;
    }

    var options = {
        doneCallback: function() {
            /* Gỡ border-left tạm đã thêm trước close animation */
            if (isHorizontal) {
                submenuElement.style.removeProperty("border-left");
                if (header) header.style.removeProperty("border-left");
                if (menuLevel === "3" && menu) {
                    var fakeHdrCloseDone = menu.querySelector(".slide-horizontal-header-level3");
                    if (fakeHdrCloseDone) fakeHdrCloseDone.style.removeProperty("border-left");
                }
            }
            if (isHorizontal && menuLevel === "2" && menu) {
                menu.classList.remove("slide-close-animating", "slide-horizontal-level2-shadow");
                if (overlayEl && overlayEl.parentNode) overlayEl.parentNode.removeChild(overlayEl);
                Menu.Context.Horizontal.removeBackCloneFake(backCloneClose);
                /* Gỡ inline display:none để icon close hiện lại (đã về level 1) */
                [closeBtnClose, closeIconClose].forEach(function(el) {
                    if (el) el.style.removeProperty("display");
                });
            }
            if (overlayElL3 && overlayElL3.parentNode) overlayElL3.parentNode.removeChild(overlayElL3);
            // Đảm bảo trên DESKTOP: sau khi đóng level 2/3 thì level 2 luôn scroll được.
            try {
                if (!isOnMobile && menu && menu.getAttribute && menu.getAttribute("ui") === "slide-horizontal") {
                    var level2Force = menu.querySelector('ul.children[menulevel="2"]');
                    if (level2Force) {
                        level2Force.style.overflowY = "auto";
                    }
                }
            } catch (e) {
                // ignore
            }

            if (typeof doneCallback === "function") {
                doneCallback();
            }
        },
        removeProperties: menuLevel === "3" ? ["width"] : []
    };

    if (slideDistancePx != null) {
        options.slideDistancePx = slideDistancePx;
    }

    var header = menu && Menu.Context.Horizontal.ensureHeaderElement ? Menu.Context.Horizontal.ensureHeaderElement(menu) : null;
    if (isHorizontal && menuLevel === "3" && menu) {
        /* Level 2 <-> Level 3: phủ overlay tạm trong lúc animation (giống lúc mở level 2 từ level 1) */
        /* Dùng closest từ submenuElement (level3 ul) để tìm đúng level2Panel đang mở */
        var level2Panel = submenuElement.closest ? submenuElement.closest('ul.children[menulevel="2"]') : menu.querySelector('ul.children[menulevel="2"]');
        if (level2Panel) {
            var existed = level2Panel.querySelector(':scope > .slide-horizontal-close-overlay.slide-horizontal-overlay-level2-only');
            if (existed && existed.parentNode) existed.parentNode.removeChild(existed);

            overlayElL3 = document.createElement("div");
            overlayElL3.className = "slide-horizontal-close-overlay slide-horizontal-overlay-level2-only";
            /* Dùng top = scrollTop để overlay hiện đúng vùng nhìn thấy của level 2 khi đóng level 3. */
            overlayElL3.style.cssText = "position:absolute;top:" + level2Panel.scrollTop + "px;left:0;right:0;height:" + level2Panel.offsetHeight + "px;background:rgba(128,128,128,0.05);z-index:10;pointer-events:none;";
            level2Panel.insertBefore(overlayElL3, level2Panel.firstChild);
        } else {
            overlayElL3 = document.createElement("div");
            overlayElL3.className = "slide-horizontal-close-overlay";
            var rectCloseL3 = menu.getBoundingClientRect();
            overlayElL3.style.cssText = "position:fixed;top:" + rectCloseL3.top + "px;left:" + rectCloseL3.left + "px;width:" + rectCloseL3.width + "px;height:" + (typeof window !== "undefined" ? window.innerHeight : rectCloseL3.height) + "px;background:rgba(128,128,128,0.05);z-index:899;pointer-events:none;";
            menu.appendChild(overlayElL3);
        }
        /* Thêm border-left cho fake header (giống panel) trước khi trượt ra */
        var fakeHdrCloseStart = menu.querySelector(".slide-horizontal-header-level3");
        if (fakeHdrCloseStart) fakeHdrCloseStart.style.setProperty("border-left", "1px solid rgba(128, 128, 128, 0.3)", "important");

        /* Fake level3 header slide out cùng hướng với panel level 3 */
        Menu.Context.Horizontal.slideOutLevel3Header(menu, slideFromLeft);
    }
    if (header && menuLevel === "2") {
        /* Ẩn back icon thật, thêm clone giả vào header để clone trượt ra cùng animation */
        if (isHorizontal) {
            backCloneClose = Menu.Context.Horizontal.createBackCloneFake(menu);
            menu.classList.remove("navi-back-visible");
            menu.classList.add("slide-close-animating"); /* Ẩn icon close trong lúc level 2 trượt qua, tránh bị "giữ" nổi trên */
            /* Inline style ép ẩn (override display:block !important) */
            closeBtnClose = menu.querySelector(".hamburger_close");
            closeIconClose = menu.querySelector("i.close-icon");
            [closeBtnClose, closeIconClose].forEach(function(el) {
                if (el) el.style.setProperty("display", "none", "important");
            });
            /* Phủ overlay lên level 1 trước khi level 2 trượt ra - transition mượt hơn.
               z-index 899 (dưới level 2=900) để level 2 luôn đè lên. */
            /* Đặt overlay TRONG level1 ul để không phủ lên level2 panel (position:fixed;z-index:900) */
            var level1UlClose = menu.querySelector('ul.children[menulevel="1"]');
            if (level1UlClose) {
                var existedL1Close = level1UlClose.querySelector(':scope > .slide-horizontal-close-overlay');
                if (existedL1Close && existedL1Close.parentNode) existedL1Close.parentNode.removeChild(existedL1Close);
                overlayEl = document.createElement("div");
                overlayEl.className = "slide-horizontal-close-overlay";
                overlayEl.style.cssText = "position:absolute;top:" + level1UlClose.scrollTop + "px;left:0;right:0;height:" + level1UlClose.offsetHeight + "px;background:rgba(128,128,128,0.05);z-index:2;pointer-events:none;";
                level1UlClose.insertBefore(overlayEl, level1UlClose.firstChild);
            } else {
                overlayEl = document.createElement("div");
                overlayEl.className = "slide-horizontal-close-overlay";
                overlayEl.style.cssText = "position:fixed;top:0;left:0;right:0;bottom:0;background:rgba(128,128,128,0.05);z-index:2;pointer-events:none;";
                menu.appendChild(overlayEl);
            }
            menu.classList.add("slide-horizontal-level2-shadow");
        }
        var headerOpts = slideDistancePx != null ? { slideDistancePx: slideDistancePx } : {};
        if (!isHorizontal)
            Animation.fadeOut(header, {});
        else if (slideFromLeft)
            Animation.slideOutToLeft(header, headerOpts);
        else
            Animation.slideOutToRight(header, headerOpts);
    }

    /* Thêm border-left tạm trong lúc close animation (gỡ trong doneCallback) */
    if (isHorizontal) {
        submenuElement.style.setProperty("border-left", "1px solid rgba(128, 128, 128, 0.3)", "important");
        if (header && menuLevel === "2") header.style.setProperty("border-left", "1px solid rgba(128, 128, 128, 0.3)", "important");
    }

    if (!isHorizontal)
        return Animation.fadeOut(submenuElement, options);
    return slideFromLeft
        ? Animation.slideOutToLeft(submenuElement, options)
        : Animation.slideOutToRight(submenuElement, options);
}

/**
 * Đóng level 3 đang mở bằng animation slide-out.
 * - Unlock level 2 scroll ngay lập tức (trước animation) để user thấy level 2 scroll được sau khi level 3 trượt ra.
 * - Sau animation: cập nhật nút back và header title.
 * @param {Element} menu - .naviItem.CONTEXT_SLIDE[ui="slide-horizontal"]
 * @returns {boolean} true nếu có level 3 để đóng, false nếu không có.
 */
Menu.Context.Horizontal.closeLevel3 = function(menu) {
    if (!menu) return;
    if (!menu.classList || !menu.classList.contains("CONTEXT_SLIDE")) return;
    if (menu.getAttribute("ui") != "slide-horizontal") return;
    const opened = Menu.Context.Horizontal.getOpenedSubmenu(menu, "3");
    if (!opened) return false;

    const ul = opened.ul;
    const li = opened.li;
    if (li) {
        li.classList.remove("menu-expand");
        li.classList.remove("menu-expand-level2");
    }

    // Unlock level 2 NGAY LẬP TỨC (khi level 3 vẫn đang che), để sau khi level 3 trượt ra user thấy level 2 scrollable
    var level2Ul = ul.closest ? ul.closest('ul.children[menulevel="2"]') : null;
    if (level2Ul) level2Ul.classList.remove("navi-level2-scroll-locked");

    /* Bỏ navi-level3-open ngay khi bắt đầu close: back icon level 2 hiện ra từ phía sau fake header đang trượt đi */
    menu.classList.remove("navi-level3-open");

    Menu.Context.Horizontal.applyCloseAnimation(ul, "level3", function() {
        menu.classList.remove("navi-level3-open"); /* no-op, đã remove ở trên, giữ để an toàn */
        Menu.Context.Horizontal.showBackButton(menu);
        if (Menu.Context.Horizontal && typeof Menu.Context.Horizontal.refreshHeaderTitle === "function") {
            Menu.Context.Horizontal.refreshHeaderTitle(menu);
        }
    });

    return true;
}

/**
 * Đóng level 2 đang mở bằng animation slide-out (về level 1).
 * - Xóa menu-expand TRƯỚC khi animate để tránh CSS rule "transform:0 !important" chặn animation.
 * - Sau animation: ẩn arrow, gỡ z-index, mở khóa scroll page, cập nhật nút back và header title.
 * @param {Element} menu - .naviItem.CONTEXT_SLIDE[ui="slide-horizontal"]
 * @returns {boolean} true nếu có level 2 để đóng, false nếu không có.
 */
Menu.Context.Horizontal.closeLevel2 = function(menu) {
    if (!menu) return;
    if (!menu.classList || !menu.classList.contains("CONTEXT_SLIDE")) return;
    if (menu.getAttribute("ui") != "slide-horizontal") return;

    const opened = Menu.Context.Horizontal.getOpenedSubmenu(menu, "2");
    if (!opened) return false;

    const ul = opened.ul;
    const li = opened.li;
    if (!li) return false;

    const embed_id = menu.id;
    const menuKind = window._openingEmbedId == embed_id ? window._openingMenuKind : NAVIGLOBAL['MENU_KINDS']['CONTEXT_SLIDE'];

    // Phải xóa menu-expand TRƯỚC khi animate, nếu không CSS rule
    // "li.item.menu-expand > ul.children { transform:0 !important }" sẽ chặn animation.
    li.classList.remove("menu-expand");
    li.classList.remove("menu-expand-level1");

    Menu.Context.Horizontal.applyCloseAnimation(ul, "level2", function() {
        const arrow = li.querySelector(":scope > span.arrow");
        if (arrow) arrow.style.display = "none";

        /* Reset inline left của back button (đã set khi mở level 2 với hamburger-right-left) */
        var backBtnClose = menu.querySelector(".hamburger_back");
        var backIconClose = menu.querySelector("i.back-icon");
        if (backBtnClose) backBtnClose.style.removeProperty("left");
        if (backIconClose) backIconClose.style.removeProperty("left");

        /* hamburger-full-fixed: restore overflow và scrollTop sau khi đóng level 2 */
        if (menu.classList.contains("hamburger-full-fixed")) {
            menu.style.removeProperty("overflow");
            if (menu._naviFullFixedScrollTop !== undefined) {
                menu.scrollTop = menu._naviFullFixedScrollTop;
                delete menu._naviFullFixedScrollTop;
            }
        }

        ZIndex.removeTopZindex(li, menuKind, embed_id);

        /* closeLevel2 chỉ cho slide-horizontal, không dùng naviman_app_overlay → không gọi hideNaviOverlay (tránh observer gỡ is-open sai) */

        if (typeof Menu !== "undefined" && Menu.Sticky && typeof Menu.Sticky.lockPageScrollingTabBar === "function")
            Menu.Sticky.lockPageScrollingTabBar(menuKind, false);

        Menu.Context.Horizontal.showBackButton(menu);
        if (Menu.Context.Horizontal && typeof Menu.Context.Horizontal.refreshHeaderTitle === "function") {
            Menu.Context.Horizontal.refreshHeaderTitle(menu);
        }
    });

    return true;
}

/**********************************************************/
    var Menu = Menu || {}; 
Menu.Item = Menu.Item || {};

Menu.Item.isItemPublished = function( item ) {
  var itemIsPublished = getItemValue(item, "ispublished", 1);
  var itemHideWhenLogined = getItemValue(item, "hidewhenlogined", 0);
  var itemShowWhenLogined = getItemValue(item, "showwhenlogined", 0);

  if( itemIsPublished == 0 )
      return false;
  if( itemHideWhenLogined == 1 ) {
      if( isUserLoggedIn() )
          return false;
  }

  if( itemShowWhenLogined == 1 ) {
      if( !(isUserLoggedIn()) )
          return false;
  }

  var hidePages = Menu.Item.getHidePages(parseAttributes(decodeQuery( item['attr'] )));
  if( hidePages.length != 0 ) {
    let currentTemplate = getCurrentTemplate();

    if (hidePages.includes(currentTemplate)) 
        return false;            
  }

  return true;
};

Menu.Item.getHidePages = function(attrArray) {
  if (!Array.isArray(attrArray) || attrArray.length === 0) return []; // Kiểm tra đầu vào hợp lệ

  for (const attr of attrArray) {
      let [key, value] = attr.split("=").map(s => s.trim()); // Cắt khoảng trắng
      if (key === "hidepages") {
          return value && value.trim() ? value.split("|").map(s => s.trim()) : [];
      }
  }
  return []; // Không tìm thấy "hidepages"
};

Menu.Item.checkNaviClick = function( embedId ) {
    setTimeout( () => {        
        const navi_Item = document.getElementById( embedId); 
        
        const expandableLis = navi_Item.querySelectorAll('li.navi-click'); // lấy tất cả

        expandableLis.forEach(expandableLi => {
            setTimeout(() => {
                // Giả lập click
                navidebug.log("Check navi-click " + embedId);

                expandableLi.dispatchEvent(new MouseEvent('click', {
                    bubbles: true,
                    cancelable: true,
                    view: window
                }));
            }, 1000);
        });                                    
    }, 20 );

};    var Menu = Menu || {};
Menu.Mega = Menu.Mega || {};

/**
 * Căn chỉnh vị trí top của level 3 (ul.children[menulevel="3"]) trong mobile megamenu.
 *
 * Mục tiêu:
 * - Với SECTION_MOBILE_MEGAMENU: top của level 3 phải trùng với top của overlay xám
 *   (li.overlay-container > span.overlay) để UX ổn định, không bị lệch khi thay đổi layout/CSS.
 *
 * Tham số:
 * - menuItem            : li.child đang mở level 3.
 * - ulChildrent         : ul.children (menulevel="3").
 * - ulParent            : ul cha chứa overlay-container (menuItem.parentElement).
 * - ulChildrentTopFixed : giá trị topFixed đã được tính sẵn (sau khi trừ offset section nếu có).
 *
 * Ghi chú:
 * - Hàm này chỉ xử lý cho SECTION_MOBILE_MEGAMENU và chỉnh trực tiếp style.top khi cần.
 * - Nếu không cần/chưa đủ dữ liệu, caller vẫn sẽ set top = -ulChildrentTopFixed như logic cũ.
 */
Menu.Mega.fixLevel3MobileTop = function (menuItem, ulChildrent, ulParent, ulChildrentTopFixed) {
    if (!ulChildrent || !menuItem || !ulParent) return;

    var overlayEl = ulParent.querySelector('.overlay');
    if (!overlayEl) return;

    var overlayRect = overlayEl.getBoundingClientRect();
    var level3Rect = ulChildrent.getBoundingClientRect();
    var diffTop = level3Rect.top - overlayRect.top;

    // Logic y hệt đoạn inline ban đầu:
    // currentTop = top hiện tại của level 3 (thường là 0px lần đầu),
    // newTop = currentTop - diffTop → đưa level 3 về trùng top với overlay.
    if (Math.abs(diffTop) > 0.5) {
        var currentTop = parseFloat(window.getComputedStyle(ulChildrent).top) || 0;
        ulChildrent.style.top = (currentTop - diffTop) + "px";
    }
};

/**
 * Z-INDEX CHO DESKTOP MEGA MENU
 *
 * Khi level 2, 3 của mega menu (SECTION_DESKTOP_MEGAMENU) hiện ra,
 * dùng ZIndex.pushElementToMax / restoreElementFromMax để nâng/hồi phục
 * z-index của container (cha tạo stacking context).
 */

/**
 * Tìm cha gần nhất của fromElement có position != static (tạo stacking context).
 */
Menu.Mega._findStackingContextParent = function (fromElement) {
    var target = fromElement.parentElement;
    var limit = 0;
    while (target && target !== document.body && limit++ < 40) {
        var style = window.getComputedStyle(target);
        if (style.position !== "static") return target;
        target = target.parentElement;
    }
    return null;
};

/**
 * Trả về mảng các element cần nâng z-index khi mở mega menu.
 * - target1: cha stacking context gần nhất của menuItem
 * - target2: cha stacking context gần nhất của section_naviman_app (nếu menu bọc trong đó)
 *   Cần cả hai vì đặt max chỉ cho target1 có thể chưa đủ khi menu nằm trong section_naviman_app.
 */
Menu.Mega._getElementsToPushZIndex = function (menuItem) {
    var targets = [];
    var target1 = Menu.Mega._findStackingContextParent(menuItem);
    if (target1) targets.push(target1);

    var sectionWrap = menuItem.closest ? menuItem.closest(".section_naviman_app") : null;
    if (sectionWrap) {
        var target2 = Menu.Mega._findStackingContextParent(sectionWrap);
        if (target2 && targets.indexOf(target2) < 0) targets.push(target2);
    }
    return targets;
};

/**
 * Nâng tạm z-index của container (và cha section_naviman_app nếu có) lên max khi mở level 2/3.
 * Gọi khi MỞ dropdown desktop mega menu.
 */
Menu.Mega.raiseSectionZIndexForDesktopMega = function (menuItem) {
    if (!menuItem) return;
    var targets = Menu.Mega._getElementsToPushZIndex(menuItem);
    for (var i = 0; i < targets.length; i++) ZIndex.pushElementToMax(targets[i]);
    var menuRoot = menuItem.closest ? menuItem.closest(".naviItem") : null;
    if (menuRoot && menuRoot.id && Menu.Mega.scheduleMegaArrowsAlign)
        Menu.Mega.scheduleMegaArrowsAlign(menuRoot.id);
    if (menuRoot && menuRoot.id && typeof Menu !== "undefined" && Menu.Common && Menu.Common.scheduleDropdownArrowsAlign)
        Menu.Common.scheduleDropdownArrowsAlign(menuRoot.id);
};

/**
 * Khôi phục z-index của container về giá trị gốc khi đóng level 2/3.
 * Gọi khi ĐÓNG dropdown desktop mega menu.
 */
Menu.Mega.restoreSectionZIndexForDesktopMega = function (menuItem) {
    if (!menuItem) return;
    var targets = Menu.Mega._getElementsToPushZIndex(menuItem);
    for (var i = 0; i < targets.length; i++) ZIndex.restoreElementFromMax(targets[i]);
};

/**
 * Z-INDEX CHO MOBILE MEGA MENU
 *
 * Tương tự desktop: nâng/hồi phục z-index container khi level 2, 3 hiện ra,
 * dùng ZIndex.pushElementToMax / restoreElementFromMax.
 */

/**
 * Nâng tạm z-index của container (và cha section_naviman_app nếu có) lên max khi mở level 2/3.
 * Gọi khi MỞ dropdown mobile mega menu.
 */
Menu.Mega.raiseSectionZIndexForMobileMega = function (menuItem) {
    if (!menuItem) return;
    var targets = Menu.Mega._getElementsToPushZIndex(menuItem);
    for (var i = 0; i < targets.length; i++) ZIndex.pushElementToMax(targets[i]);
    var menuRoot = menuItem.closest ? menuItem.closest(".naviItem") : null;
    if (menuRoot && menuRoot.id && Menu.Mega.scheduleMegaArrowsAlign)
        Menu.Mega.scheduleMegaArrowsAlign(menuRoot.id);
    if (menuRoot && menuRoot.id && typeof Menu !== "undefined" && Menu.Common && Menu.Common.scheduleDropdownArrowsAlign)
        Menu.Common.scheduleDropdownArrowsAlign(menuRoot.id);
};

/**
 * Khôi phục z-index của container về giá trị gốc khi đóng level 2/3.
 * Gọi khi ĐÓNG dropdown mobile mega menu.
 */
Menu.Mega.restoreSectionZIndexForMobileMega = function (menuItem) {
    if (!menuItem) return;
    var targets = Menu.Mega._getElementsToPushZIndex(menuItem);
    for (var i = 0; i < targets.length; i++) ZIndex.restoreElementFromMax(targets[i]);
};

/**
 * Căn arrow (::after) level 1 mega menu theo tâm dòng .name (SECTION_DESKTOP_MEGAMENU / SECTION_MOBILE_MEGAMENU).
 *
 * @param {string} embed_id - id phần tử .naviItem (mega)
 */
Menu.Mega.alignLevel1ArrowsToName = function (embed_id) {
    var root = document.getElementById(embed_id);
    if (!root) return;
    if (!root.classList.contains("SECTION_DESKTOP_MEGAMENU") && !root.classList.contains("SECTION_MOBILE_MEGAMENU")) return;

    var items = root.querySelectorAll("li.is-parent-top");
    for (var i = 0; i < items.length; i++) {
        var li = items[i];
        var nameEl = li.querySelector(".inner .name");
        if (!nameEl) {
            li.style.removeProperty("--navi-mega-arrow-y");
            continue;
        }
        var liRect = li.getBoundingClientRect();
        var nameRect = nameEl.getBoundingClientRect();
        if (liRect.height < 2 || nameRect.height < 1) {
            li.style.removeProperty("--navi-mega-arrow-y");
            continue;
        }
        var centerY = nameRect.top - liRect.top + nameRect.height / 2;
        li.style.setProperty("--navi-mega-arrow-y", centerY + "px");
    }
};

/**
 * Gọi lại căn arrow sau layout / khi ảnh load.
 *
 * @param {string} embed_id
 */
Menu.Mega.scheduleMegaArrowsAlign = function (embed_id) {
    if (!embed_id) return;
    var run = function () {
        Menu.Mega.alignLevel1ArrowsToName(embed_id);
    };
    requestAnimationFrame(function () {
        requestAnimationFrame(run);
    });
    [0, 50, 150, 400, 800].forEach(function (ms) {
        setTimeout(run, ms);
    });
    var root = document.getElementById(embed_id);
    if (!root) return;
    var imgs = root.querySelectorAll("img");
    for (var j = 0; j < imgs.length; j++) {
        var im = imgs[j];
        if (im.complete) continue;
        im.addEventListener("load", run, { once: true });
    }
};

/**
 * Một lần: resize / load / fonts → align lại mọi mega menu trong navimanData.
 */
Menu.Mega.initMegaArrowAlignListeners = function () {
    if (Menu.Mega._megaArrowAlignListenersBound) return;
    Menu.Mega._megaArrowAlignListenersBound = true;

    var runAll = function () {
        if (!window.navimanData || !Array.isArray(window.navimanData)) return;
        var mkD = typeof NAVIGLOBAL !== "undefined" ? NAVIGLOBAL["MENU_KINDS"]["SECTION_DESKTOP_MEGAMENU"] : null;
        var mkM = typeof NAVIGLOBAL !== "undefined" ? NAVIGLOBAL["MENU_KINDS"]["SECTION_MOBILE_MEGAMENU"] : null;
        window.navimanData.forEach(function (n) {
            if ((mkD != null && n.menuKind === mkD) || (mkM != null && n.menuKind === mkM))
                Menu.Mega.alignLevel1ArrowsToName(n.embed_id);
        });
    };

    var debounceTimer = null;
    window.addEventListener("resize", function () {
        if (debounceTimer) clearTimeout(debounceTimer);
        debounceTimer = setTimeout(function () {
            debounceTimer = null;
            requestAnimationFrame(runAll);
        }, 100);
    });
    window.addEventListener("load", function () {
        requestAnimationFrame(runAll);
    });
    if (document.fonts && document.fonts.ready) {
        document.fonts.ready.then(function () {
            requestAnimationFrame(runAll);
        });
    }
};

    /**
 * DeviceModeResize – Xử lý resize màn hình khi chuyển mobile ↔ desktop.
 *
 * Luồng hoạt động:
 * 1. watchPlatformChange() lắng nghe resize, gọi callback(isMobile) khi vượt breakpoint 768px
 * 2. matchMedia backup – bắt trường hợp resize không fire khi mở rộng
 * 3. onPlatformChange() – handler chính, gọi các cập nhật đặc biệt (Grid, Slide)
 *
 * Trường hợp đặc biệt:
 * - Grid menu (SECTION_MOBILE_GRID): ul width, scroll-mobile, width từng li.item theo platform + scaleToDesktop
 * - Slide menu (CONTEXT_SLIDE): cập nhật class layout
 */
var DeviceModeResize = DeviceModeResize || {};

DeviceModeResize.BREAKPOINT = 768;
DeviceModeResize._lastPlatform = null;

/**
 * Theo dõi chuyển platform. Mốc BREAKPOINT: <=768 mobile, >768 desktop.
 * @param {function} callback - callback(isMobile) khi vượt breakpoint
 * @returns {function} - hàm để hủy listener
 */
DeviceModeResize.watchPlatformChange = function(callback) {
    var bp = DeviceModeResize.BREAKPOINT;
    var lastIsMobile = window.innerWidth <= bp;
    DeviceModeResize._lastPlatform = lastIsMobile ? "mobile" : "desktop";

    var handler = function() {
        var isMobileNow = window.innerWidth <= bp;
        if (isMobileNow !== lastIsMobile) {
            lastIsMobile = isMobileNow;
            DeviceModeResize._lastPlatform = isMobileNow ? "mobile" : "desktop";
            if (typeof callback === "function") callback(isMobileNow);
        }
    };
    window.addEventListener("resize", handler);
    return function() { window.removeEventListener("resize", handler); };
};

/* Ánh xạ widthlayout → base % (tương đương getExtWidth trong uigen_drawNav) */
DeviceModeResize.WIDTHLAYOUT_TO_PERCENT = {
    2: "8.3333333333", 3: "16.6666666666", 4: "25", 5: "33.3333333333",
    6: "41.6666666666", 7: "50", 8: "58.3333333333", 9: "66.6666666666",
    10: "75", 11: "83.3333333333", 12: "91.6666666666", 13: "100",
    15: "10", 16: "20", 17: "50", 18: "100"
};

/** Chuyển scaleToDesktop string ("1x","2x",...) thành số ratio */
DeviceModeResize.parseScaleRatio = function(scaleToDesktop) {
    if (!scaleToDesktop || scaleToDesktop === "1x") return 1;
    if (scaleToDesktop === "1.5x") return 1.5;
    if (scaleToDesktop === "2x") return 2;
    if (scaleToDesktop === "2.5x") return 2.5;
    if (scaleToDesktop === "3x") return 3;
    return 1;
};

/**
 * Cập nhật Grid menu theo platform. Desktop và Mobile xử lý khác nhau:
 * - Desktop: ul width=auto, tắt scroll ngang, li width = base% / ratio (scaleToDesktop)
 * - Mobile: ul width từ data-scroll-mobile-width nếu có scroll, li width = base%
 *
 * @param {string} [forceMode] - 'mobile' | 'desktop' ép chế độ (dùng khi gọi từ onPlatformChange,
 *   vì window.innerWidth có thể chưa cập nhật khi resize event fire)
 */
DeviceModeResize.updateGridMenuStyles = function(forceMode) {
    var bp = DeviceModeResize.BREAKPOINT;
    var isDesktop = (forceMode === "desktop" || forceMode === "mobile")
        ? (forceMode === "desktop")
        : (window.innerWidth > bp);
    var grids = document.querySelectorAll(".naviItem.SECTION_MOBILE_GRID");
    grids.forEach(function(gridEl) {
        var scrollWrap = gridEl.querySelector(".scroll-mobile");
        var ulNav = gridEl.querySelector("ul.navigation");
        if (!ulNav) return;

        /* scaleToDesktop: ưu tiên data attribute, fallback navimanData (cho section render qua Liquid/publishToPlace) */
        var scaleToDesktop = (gridEl.getAttribute("data-scale-to-desktop") || "").trim();
        if (!scaleToDesktop && window.navimanData && Array.isArray(window.navimanData)) {
            var nd = window.navimanData.find(function(n) { return n.embed_id === gridEl.id; });
            if (nd && nd.data && nd.data.setting && nd.data.setting.scaleToDesktop)
                scaleToDesktop = String(nd.data.setting.scaleToDesktop).trim();
        }
        scaleToDesktop = scaleToDesktop || "1x";
        var ratio = DeviceModeResize.parseScaleRatio(scaleToDesktop);
        var useDesktopScale = isDesktop && ratio > 1;

        /* ul.navigation: Desktop luôn bỏ fix width. Mobile chỉ fix khi có data-scroll-mobile-width (scroll ngang) */
        if (isDesktop) {
            ulNav.style.width = "auto";
            ulNav.style.minWidth = "";
            if (scrollWrap) scrollWrap.style.overflow = "visible";
        } else {
            var sw = ulNav.getAttribute("data-scroll-mobile-width");
            ulNav.style.minWidth = "";
            if (scrollWrap && sw) {
                ulNav.style.width = sw + "px";
                scrollWrap.style.overflow = "auto";
            } else {
                ulNav.style.width = "";
                if (scrollWrap) scrollWrap.style.overflow = "";
            }
        }

        /* li.item: width theo platform. Desktop+scale → chia ratio; Mobile hoặc ratio=1 → base % */
        if (useDesktopScale) {
            gridEl.classList.add("grid-desktop-scale");
            gridEl.style.setProperty("--grid-ratio", String(ratio));
        } else {
            gridEl.classList.remove("grid-desktop-scale");
            gridEl.style.removeProperty("--grid-ratio");
        }
        var items = gridEl.querySelectorAll("ul.navigation li[data-widthlayout]");
        items.forEach(function(li) {
            var wl = parseInt(li.getAttribute("data-widthlayout"), 10) || 1;
            var widthfix = li.getAttribute("data-widthfix") || "";
            var itemWidth = "";
            /* widthlayout 2-13, 15-18: %; 14: px cố định; 20: auto */
            if (DeviceModeResize.WIDTHLAYOUT_TO_PERCENT[wl] !== undefined) {
                var pct = parseFloat(DeviceModeResize.WIDTHLAYOUT_TO_PERCENT[wl]);
                itemWidth = (useDesktopScale ? (pct / ratio) : pct) + "%";
            } else if (wl === 14 && widthfix) {
                itemWidth = String(widthfix).replace(/pt|px/gi, "").trim() + "px";
            } else if (wl === 20) {
                itemWidth = "auto";
            }
            if (itemWidth) {
                li.style.width = itemWidth;
            } else {
                li.style.width = "";
            }
            if (itemWidth) {
                li.classList.add("widthfix");
                li.classList.toggle("widthauto", itemWidth === "auto");
            } else {
                li.classList.remove("widthfix", "widthauto");
            }
        });
    });
};

DeviceModeResize.HAMBURGER_CLASSES = [
    'hamburger-left-right', 'hamburger-right-left', 'hamburger-top-down', 'hamburger-down-top',
    'hamburger-fullscreen', 'hamburger-full-popup', 'hamburger-full-fixed',
    'hamburger-desktop-fullfixed', 'hamburger-mobile-fullfixed',
    'hamburger-desktop-sub-leftright', 'hamburger-desktop-sub-topdown', 'hamburger-desktop-sub-contextmenu'
];

/**
 * Cập nhật class Slide menu khi đổi viewport.
 * @param {Object} naviItem - từ window.navimanData
 * @param {boolean} isMobile
 */
/**
 * Cập nhật class layout và thuộc tính ui="slide-horizontal" của Slide menu khi đổi viewport.
 * - Classes (hamburger-left-right, hamburger-desktop-sub-*, ...): lấy từ getSlideClassesForViewport.
 * - ui="slide-horizontal": chỉ set khi expandEffect==2 VÀ (hamburgerSubDirection==4/0/unset OR đang mobile).
 *   → hamburgerSubDirection 1-3 + expandEffect==2: mobile = slide-horizontal, desktop = không.
 * @param {Object} naviItem - từ window.navimanData
 * @param {boolean} isMobile
 */
DeviceModeResize.updateSlideMenuClasses = function(naviItem, isMobile) {
    if (!naviItem || naviItem.menuKind != NAVIGLOBAL['MENU_KINDS']['CONTEXT_SLIDE']) return;
    var el = document.getElementById(naviItem.embed_id);
    if (!el) return;

    var data = naviItem["data"];
    if (!data) return;

    var result = getSlideClassesForViewport(data, naviItem.menuKind, isMobile);
    var newClasses = [result.position, result.subDirection].filter(Boolean).join(' ').split(/\s+/).filter(Boolean);

    DeviceModeResize.HAMBURGER_CLASSES.forEach(function(c) { el.classList.remove(c); });
    newClasses.forEach(function(c) { if (c) el.classList.add(c); });

    // Cập nhật ui="slide-horizontal" theo viewport khi hamburgerSubDirection 1-3 + expandEffect==2
    var setting = data["setting"] || {};
    var _expandEff = String(setting["expandEffect"] || '');
    var _subDirResize = parseInt(setting["hamburgerSubDirection"] || 0);
    // slide-horizontal cần thiết khi: mobile (luôn), HOẶC desktop với subDir==4/0 (unset, backward compat)
    var _needSlideH = _expandEff === '2' && (_subDirResize === 4 || _subDirResize === 0 || isMobile);
    if (_needSlideH) {
        if (el.getAttribute("ui") !== "slide-horizontal") el.setAttribute("ui", "slide-horizontal");
    } else {
        if (el.getAttribute("ui") === "slide-horizontal") el.removeAttribute("ui");
    }
};

/**
 * Handler khi platform đổi. Gọi forceMode rõ ràng cho Grid (tránh window.innerWidth chưa cập nhật khi resize fire).
 * @param {boolean} isMobile
 */
DeviceModeResize.onPlatformChange = function(isMobile) {
    var mode = isMobile ? "mobile" : "desktop";
    if (typeof Helper !== "undefined" && Helper.closeAllDropdowns) Helper.closeAllDropdowns();

    DeviceModeResize.updateGridMenuStyles(mode);

    /* Slide menu: cập nhật class layout (hamburger-left-right, ...) theo viewport */
    if (window.navimanData && Array.isArray(window.navimanData)) {
        window.navimanData.forEach(function(naviItem) {
            DeviceModeResize.updateSlideMenuClasses(naviItem, isMobile);
            if (typeof Menu !== "undefined" && Menu.Context && Menu.Context.alignSlideArrowsToName
                && naviItem.menuKind == NAVIGLOBAL["MENU_KINDS"]["CONTEXT_SLIDE"]) {
                Menu.Context.alignSlideArrowsToName(naviItem.embed_id);
            }
            if (typeof Menu !== "undefined" && Menu.Mega && Menu.Mega.alignLevel1ArrowsToName
                && typeof NAVIGLOBAL !== "undefined") {
                var mkD = NAVIGLOBAL["MENU_KINDS"]["SECTION_DESKTOP_MEGAMENU"];
                var mkM = NAVIGLOBAL["MENU_KINDS"]["SECTION_MOBILE_MEGAMENU"];
                if (naviItem.menuKind === mkD || naviItem.menuKind === mkM)
                    Menu.Mega.alignLevel1ArrowsToName(naviItem.embed_id);
            }
            if (typeof Menu !== "undefined" && Menu.Common && Menu.Common.alignDropdownArrowsToName
                && typeof NAVIGLOBAL !== "undefined") {
                var dk = [
                    NAVIGLOBAL["MENU_KINDS"]["STICKY_TABBAR"],
                    NAVIGLOBAL["MENU_KINDS"]["STICKY_MOBILE_HEADER"],
                    NAVIGLOBAL["MENU_KINDS"]["STICKY_FAB_SUPPORT"],
                    NAVIGLOBAL["MENU_KINDS"]["SECTION_DESKTOP_MEGAMENU"],
                    NAVIGLOBAL["MENU_KINDS"]["SECTION_MOBILE_MEGAMENU"],
                    NAVIGLOBAL["MENU_KINDS"]["SECTION_MOBILE_HEADER"]
                ];
                if (dk.indexOf(naviItem.menuKind) >= 0)
                    Menu.Common.alignDropdownArrowsToName(naviItem.embed_id);
            }
        });
    }
};

DeviceModeResize._gridObserverTimer = null;
DeviceModeResize._stopPlatformWatch = null;

/* MutationObserver: bắt Grid redraw (publishToPlace async insert), áp dụng lại width theo viewport hiện tại */
DeviceModeResize._observeGridRedraw = function() {
    var grids = document.querySelectorAll(".naviItem.SECTION_MOBILE_GRID");
    grids.forEach(function(gridEl) {
        if (gridEl._gridObserved) return;
        gridEl._gridObserved = true;
        var obs = new MutationObserver(function() {
            if (DeviceModeResize._gridObserverTimer) clearTimeout(DeviceModeResize._gridObserverTimer);
            DeviceModeResize._gridObserverTimer = setTimeout(function() {
                DeviceModeResize._gridObserverTimer = null;
                DeviceModeResize.updateGridMenuStyles();
            }, 50);
        });
        obs.observe(gridEl, { childList: true, subtree: true });
    });
};

/**
 * Khởi tạo: chạy sau drawBottomNav. Đăng ký watchPlatformChange + matchMedia (backup khi resize không fire lúc mở rộng).
 * Expose applyGridView(mode) cho console debug.
 */
DeviceModeResize.init = function() {
    DeviceModeResize.updateGridMenuStyles();
    DeviceModeResize._observeGridRedraw();
    setTimeout(DeviceModeResize._observeGridRedraw, 300); /* Bắt Grid insert async (publishToPlace) */
    if (typeof window !== "undefined" && !window.applyGridView) {
        window.applyGridView = function(mode) {
            if (mode !== "mobile" && mode !== "desktop") return;
            DeviceModeResize.updateGridMenuStyles(mode);
        };
    }
    if (DeviceModeResize._bound) return;
    DeviceModeResize._stopPlatformWatch = DeviceModeResize.watchPlatformChange(function(isMobile) {
        DeviceModeResize.onPlatformChange(isMobile);
    });
    var mq = window.matchMedia("(min-width: " + (DeviceModeResize.BREAKPOINT + 1) + "px)");
    mq.addEventListener("change", function(e) {
        DeviceModeResize.onPlatformChange(!e.matches);
    });
    DeviceModeResize._bound = true;
};

    var generateCSS_init = function ( setting ) {
    //debugConsole("1.generateCSS_init");

    setting['submenuWidth'] = defaultValue(setting['submenuWidth'], 200);

    setting['submenuFullExpandWidth'] = defaultValue(setting['submenuFullExpandWidth'], "");
    if (window.innerWidth < parseInt(setting['submenuFullExpandWidth'])) 
        setting['submenuFullExpandWidth'] = "";

    setting['textSize'] = defaultValue( setting['textSize'], 10);
    setting['spaceTextIcon'] = defaultValue(setting['spaceTextIcon'], 2);
    setting['iconSize'] = defaultValue(setting['iconSize'], DEFAULT_ICON_IMAGE_SIZE);
    setting['imageRadius'] = defaultValue(setting['imageRadius'], 0);
    setting['height'] = defaultValue(setting['height'], 54);
    setting['borderRadius'] = defaultValue(setting['borderRadius'], 0);
    setting['opacity'] = defaultValue(setting['opacity'], 100);
    setting['bottomMargin'] = defaultValue(setting['bottomMargin'], "");
    setting['settingMargin'] = defaultMarginPadding( setting['settingMargin'] );
    setting['settingPadding'] = defaultMarginPadding( setting['settingPadding'] );

};


var generateCSS_UI_Level1_Menuitems = function ( setting, cssNaviPrefix, naviman_appItem, dragdrop, section_setting ) {
    //debugConsole("2.generateCSS_UI_Level1_Menuitems");

    var isOnMobile = window.innerWidth <= 768;
    var addHtml = "";

    if (isHadValue(setting['textColor'])) {
        addHtml += cssNaviPrefix + ' ul li.item .name { color: ' + setting['textColor'] + '; } ';
        addHtml += cssNaviPrefix + ' ul li.item .description { color: ' + setting['textColor'] + '; } ';

        // Nếu như có arrow thì ép màu bằng màu text x opacity 0.5. Ép kiểu mạnh hơn #SF-123456789 để overwrite.
        addHtml += Helper.String.classToID(cssNaviPrefix) + ' ul > li.is-parent-top::after { color: '+ Helper.Color.hexToRgb(setting['textColor'], 30) +'; } ';        
    }

    // TODO: Cho chọn không chọn font và một font tự chọn tên.
    if (isHadValue(setting['fontFamily'])) {
        if( setting['fontFamily'] != "Use+Default" )
        {
            let fontFamily_css = '<link href="https://fonts.googleapis.com/css2?family=' + setting['fontFamily'] + ':wght@400;700&display=swap" rel="stylesheet">';
            naviman_appItem.insertAdjacentHTML('beforebegin', fontFamily_css);

            addHtml += cssNaviPrefix + ' {font-family: "' + setting['fontFamily'].strReplace('+', ' ') + '", "Roboto"} ';
        }
    }

    if (isHadValue(setting['textSize'])) {
        addHtml += cssNaviPrefix + ' ul li.item > .inner .name { font-size: ' + setting['textSize'] + 'px; } ';
        addHtml += cssNaviPrefix + ' ul li.item > .inner .name > { font-size: ' + setting['textSize'] + 'px; } '; // Sửa chỗ này để overwrite các ông khác.
    }

/*    if (isHadValue(setting['spaceTextIcon']))*/
/*        addHtml += cssNaviPrefix + ' ul li.item .icon, ' + cssNaviPrefix + ' ul li.item .image { height: ' + (21 + (setting['spaceTextIcon'] - 2)) + 'px; } ';*/

    if (isHadValue(setting['dividerColor']))
        addHtml += cssNaviPrefix + ' ul li.item_divider { border-color: ' + setting['dividerColor'] + '; } ';

    if (isHadValue(setting['badgeColor']))
        addHtml += cssNaviPrefix + 'ul li.item_badge .inner .icon::before, ' + cssNaviPrefix + ' ul li.item_badge .inner .image::before { color: ' + setting['badgeColor'] + '; } ';

    if (isHadValue(setting['iconColor']))
        addHtml += cssNaviPrefix + 'ul li.item .icon i { color: ' + setting['iconColor'] + '; } ';

    if (isHadValue(setting['iconSize'])) {
                
        /*
        Login của đoạn này như sau (Chỉ áp dụng cho icon/Small image):
        1. Nếu setting chung icon size thì áp dụng cho cả icon và image
        2. Đối với level 2: Thì đặt chiều cao của icon và image bằng nhau và bằng iconSize + 4
         */
        addHtml += cssNaviPrefix + 'ul li.item .icon i { font-size: ' + setting['iconSize'] + 'px; } ';
        addHtml += cssNaviPrefix + 'ul li.item ul li.child .icon i { font-size: ' + setting['iconSize'] + 'px; } ';
        addHtml += cssNaviPrefix + 'ul li.item ul li.child .icon { height: ' + ( parseInt(setting['iconSize']) + 4) + 'px; } ';
        addHtml += cssNaviPrefix + 'ul li.item ul li.child .info { width: calc(100% -   ' + parseInt(setting['iconSize']) + 'px); } ';

        addHtml += cssNaviPrefix + 'ul li.item .image img { height: ' + setting['iconSize'] + 'px; } ';
        addHtml += cssNaviPrefix + 'ul li.item ul li.child .image img { height: ' + setting['iconSize'] + 'px; } ';
        addHtml += cssNaviPrefix + 'ul li.item ul li.child .image { height: ' + ( parseInt(setting['iconSize']) + 4) + 'px; } ';

        if (setting['layout'] ==  NAVIGLOBAL['LAYOUT']['HIGHLIGHT'])
            addHtml += cssNaviPrefix + ' ul li.item_primary > .inner { left: calc(50% - 26px); position: absolute; padding-top: ' + (16 - (setting['iconSize'] - 12) / 2) + 'px; } ';
    }

    // Don't display text ---------------------------------------------------------
    if (setting['textHide'] == "true" || setting['textHide'] == true) {
        addHtml += cssNaviPrefix + ' ul li.item > .inner .name { display:none; } ';
        addHtml += cssNaviPrefix + ' ul li.item > .inner .description { display:none; } ';
        /* if (setting['layout'] !=  NAVIGLOBAL['LAYOUT']['FAB'])
            addHtml += cssNaviPrefix + 'ul li.item .inner { padding-top: ' + ((setting['height'] - 50) / 2 + 8 + (setting['textSize'] / 2)) + 'px } ';

         */

        if (setting['layout'] != NAVIGLOBAL['LAYOUT']['FAB']) {
            let isVertical = false;
            if (isOnMobile)
                if (setting['mobilePosition'] == NAVIGLOBAL['MOBILE_POSITION']['RIGHT_CENTER']
                    || setting['mobilePosition'] == NAVIGLOBAL['MOBILE_POSITION']['LEFT_CENTER']
                    || setting['mobilePosition'] == NAVIGLOBAL['MOBILE_POSITION']['RIGHT_BOTTOM']
                    || setting['mobilePosition'] == NAVIGLOBAL['MOBILE_POSITION']['LEFT_BOTTOM']
                )
                    isVertical = true;

            if (!isOnMobile) // Desktop mode
                if (setting['desktopPosition'] == NAVIGLOBAL['DESKTOP_POSITION']['RIGHT_TOP']
                    || setting['desktopPosition'] == NAVIGLOBAL['DESKTOP_POSITION']['LEFT_TOP']
                    || setting['desktopPosition'] == NAVIGLOBAL['DESKTOP_POSITION']['LEFT_FULL_TOP']
                    || setting['desktopPosition'] == NAVIGLOBAL['DESKTOP_POSITION']['LEFT_FULL_CENTER']
                )
                    isVertical = true;

            if (isVertical) {
                let itemHeight = (parseInt(setting['height']) - setting['textSize']);

                /* TODO: Cần chỉnh chỗ này, nếu như có padding thì phải phình to ra chứ? */

                addHtml += cssNaviPrefix + ' ul li.item { height: ' + itemHeight + 'px } ';
                addHtml += cssNaviPrefix + '{ height: ' + itemHeight * dragdrop.length + 'px } ';

            }
        }
    }


    return addHtml;
}


var generateCSS_UI_Level1_Background = function ( setting, cssNaviPrefix, section_setting, menuKind ) {

    var addHtml = "";
    // Expand menu icon (only mega menu and slide) ---------------------------------------------------------

    var embed_id = cssNaviPrefix.trim();
    var embed_id = embed_id.startsWith(".") ? embed_id.slice(1) : embed_id;

    addHtml += Menu.Common.Level1.generateExpandArrowShow( setting, cssNaviPrefix, menuKind );
    addHtml += Menu.Common.Level1.generateArrowStyle( setting, cssNaviPrefix, menuKind );
    addHtml += Menu.Common.Level1.generateBackground( setting, cssNaviPrefix, menuKind );        
    addHtml += Menu.Common.Level1.generateDropshadow( setting, cssNaviPrefix, menuKind );        
    addHtml += Menu.Common.Level1.generateHeight( setting, cssNaviPrefix, menuKind );        
    addHtml += Menu.Common.Level1.generateBorderRadius( setting, cssNaviPrefix, menuKind );        
    addHtml += Menu.Common.Level1.generateOpacity( setting, cssNaviPrefix, menuKind );        
   
    return addHtml;
};

var generateCSS_UI_Level2 = function ( setting, cssNaviPrefix, naviman_appItem, dragdrop, section_setting, menuKind ) {
    //debugConsole("5.generateCSS_UI_Level2");

    var addHtml = "";

    if (isHadValue(setting['submenuTextColor'])) {
        addHtml += cssNaviPrefix + ' ul li.item ul li.child .name { color: ' + setting['submenuTextColor'] + '; } ';
        addHtml += cssNaviPrefix + ' ul li.item a { color: ' + setting['submenuTextColor'] + '; } ';
        addHtml += cssNaviPrefix + ' ul li.item ul li.child .description { color: ' + setting['submenuTextColor'] + '; } ';
        addHtml += cssNaviPrefix + ' ul li ul.children .overlay b.close { color: ' + setting['submenuTextColor'] + '; } ';
    }

    if (isHadValue(setting['submenuIconColor']))
        addHtml += cssNaviPrefix + ' ul li.item ul li.child .icon i { color: ' + setting['submenuIconColor'] + '; } ';

    if (isSettingBeTrue(setting['level2BackgroundHide'])) { // Nếu không có nền thì bỏ nền và bỏ bóng.
        addHtml += cssNaviPrefix + ' ul li ul.children { background: initial; } ';
        if (menuKind != NAVIGLOBAL['MENU_KINDS']['CONTEXT_SLIDE']) {
            addHtml += cssNaviPrefix + ' ul li ul.children { box-shadow: none !important; } ';
        }
    }else {
        if (isHadValue(setting['submenuBackgroundColor'])) {
            addHtml += cssNaviPrefix + ' ul li ul.children { background: ' + setting['submenuBackgroundColor'] + ' } ';
            addHtml += cssNaviPrefix + ' ul li ul.children .overlay b.close { background: ' + setting['submenuBackgroundColor'] + ' } ';
        }
    }

    if (! isSettingBeTrue(setting['level2Dropshadow'], true) && menuKind != NAVIGLOBAL['MENU_KINDS']['CONTEXT_SLIDE']) { // Nếu không có nền thì bỏ nền và bỏ bóng.
        addHtml += cssNaviPrefix + ' ul li ul.children { box-shadow: none !important; } ';
    }

    // CONTEXT_SLIDE desktop: bỏ shadow theo hamburgerSubDirection.
    // Nguồn shadow subDir==3: JS (MenuContext.js) add cho level 2; static CSS (menu_context_slide.css:39) add cho level 3.
    // subDir==1,2,4: không có rule chủ động nào add shadow — shadow từ base CSS specificity thấp.
    // Selector dùng cssNaviPrefix (.embed_id) + .item + .children + [menulevel] → specificity (0,4,3), thắng base rule (0,2,3) mà không cần !important.
    if (menuKind == NAVIGLOBAL['MENU_KINDS']['CONTEXT_SLIDE']) {
        var _slideSubDir = String(setting['hamburgerSubDirection'] || '');
        // Mobile: không bao giờ có shadow ở level 2, 3 cho slide menu
        addHtml += '@media (max-width: 768px) {'
            + cssNaviPrefix + ' ul li.item > ul.children[menulevel="2"] { box-shadow: none; }'
            + cssNaviPrefix + ' ul.children[menulevel="3"] { box-shadow: none; }'
            + '}';
        // Desktop: bỏ shadow theo hamburgerSubDirection.
        // Level 2: direct child của li.item → li.item > ul.children[menulevel="2"]
        // Level 3: direct child của li.child (không phải li.item) → ul.children[menulevel="3"]
        if (_slideSubDir === '1' || _slideSubDir === '4') {
            addHtml += '@media (min-width: 769px) {'
                + cssNaviPrefix + ' ul li.item > ul.children[menulevel="2"] { box-shadow: none; }'
                + cssNaviPrefix + ' ul.children[menulevel="3"] { box-shadow: none; }'
                + '}';
        }
        else if (_slideSubDir === '2') {
            addHtml += '@media (min-width: 769px) {'
                + cssNaviPrefix + ' ul.children[menulevel="3"] { box-shadow: none; }'
                + '}';
        }

        // Desktop: hướng bóng cho subDir==2 (level 2).
        // subDir==3 xử lý trong MenuContext.js dùng #id selector (specificity cao hơn).
        // hamburgerPosition==2 (panel phải): bóng đổ sang trái. Mặc định: sang phải.
        if (_slideSubDir === '2') {
            var _hamburgerPos = parseInt(setting['hamburgerPosition'] || 1);
            var _shadow2 = _hamburgerPos === 2
                ? '-4px 8px 8px 0px rgba(0, 0, 0, 0.1)'
                : '4px 4px 8px 0px rgba(0, 0, 0, 0.10)';
            addHtml += '@media (min-width: 769px) {'
                + cssNaviPrefix + ' ul li.item > ul.children[menulevel="2"] { box-shadow: ' + _shadow2 + '; }'
                + '}';
        }
    }

    if (isHadValue(setting['submenuDividerColor']))
        addHtml += cssNaviPrefix + ' ul li.child_divider { border-color: ' + setting['submenuDividerColor'] + '; } ';

    return addHtml;
};

var generateCSS_Publish = function (setting, cssNaviPrefix, section_setting) {
    //debugConsole("7.generateCSS_Publish");
    // Chỉ dùng mobileDisplay/desktopDisplay để responsive đúng khi resize, không phụ thuộc isOnMobile lúc generate
    var addHtml = "";

    // Simulator (DESIGNING mode) luôn hiện menu dù cấu hình mobileDisplay/desktopDisplay thế nào
    if (Helper.Env.isBackendMode()) return addHtml;

    addHtml += ' @media only screen and (max-width: 768px) { ';
        if (setting['mobileDisplay'] == "false" || setting['mobileDisplay'] == false)
            addHtml += cssNaviPrefix + ' { display: none !important; } ';
    addHtml += ' } ';

    addHtml += ' @media only screen and (min-width: 769px) { ';
        if (setting['desktopDisplay'] == "false" || setting['desktopDisplay'] == false)
            addHtml += cssNaviPrefix + ' { display: none !important; } ';
    addHtml += ' } ';

    return addHtml;
};

var generateCSS_Position = function (setting, cssNaviPrefix, section_setting, menuKind) {

    var addHtml = "";

    addHtml += ' @media only screen and (max-width: 768px) {';

    if (setting['mobileAutoHide'] == "true" || setting['mobileAutoHide'] == true) {
        if (setting['mobileDisplay'] == "true" || setting['mobileDisplay'] == true)
            scrollToHide("mobile", cssNaviPrefix);
    }

    if (setting['mobileAutoShow'] == "true" || setting['mobileAutoShow'] == true) {
        if (setting['mobileDisplay'] == "true" || setting['mobileDisplay'] == true)
            scrollToShow("mobile", cssNaviPrefix);
    }

    addHtml += '} ';

    addHtml += ' @media only screen and (min-width: 769px) {';

    if (setting['desktopAutoHide'] == "true" || setting['desktopAutoHide'] == true) {
        if( setting['desktopDisplay'] == "true" || setting['desktopDisplay'] == true )

            if( menuKind == NAVIGLOBAL['MENU_KINDS']['STICKY_TABBAR']) {
                if (setting['desktopPosition'] != NAVIGLOBAL['DESKTOP_POSITION']['LEFT_FULL_TOP']
                    && setting['desktopPosition'] != NAVIGLOBAL['DESKTOP_POSITION']['LEFT_FULL_CENTER']
                    && setting['desktopPosition'] != NAVIGLOBAL['DESKTOP_POSITION']['RIGHT_FULL_TOP']
                    && setting['desktopPosition'] != NAVIGLOBAL['DESKTOP_POSITION']['RIGHT_FULL_CENTER']
                )
                    scrollToHide("desktop", cssNaviPrefix);
            }

            if( menuKind == NAVIGLOBAL['MENU_KINDS']['STICKY_FAB_SUPPORT']) 
                scrollToHide("desktop", cssNaviPrefix);
    }

    if (setting['desktopAutoShow'] == "true" || setting['desktopAutoShow'] == true) {
        if( setting['desktopDisplay'] == "true" || setting['desktopDisplay'] == true )

            if( menuKind == NAVIGLOBAL['MENU_KINDS']['STICKY_TABBAR']) {
                if (setting['desktopPosition'] != NAVIGLOBAL['DESKTOP_POSITION']['LEFT_FULL_TOP']
                    && setting['desktopPosition'] != NAVIGLOBAL['DESKTOP_POSITION']['LEFT_FULL_CENTER']
                    && setting['desktopPosition'] != NAVIGLOBAL['DESKTOP_POSITION']['RIGHT_FULL_TOP']
                    && setting['desktopPosition'] != NAVIGLOBAL['DESKTOP_POSITION']['RIGHT_FULL_CENTER']
                )
                scrollToShow("desktop", cssNaviPrefix);
            }

            if( menuKind == NAVIGLOBAL['MENU_KINDS']['STICKY_FAB_SUPPORT']) 
                scrollToShow("desktop", cssNaviPrefix);
    }

    addHtml += '} ';

    return addHtml;
};

/**
 * Quyết định có áp dụng các đoạn CSS/JS nâng cao (settingCSS, settingCSSGlobal, settingJS, settingNaviJS)
 * cho platform hiện tại hay không, dựa trên cấu hình mobileDisplay / desktopDisplay.
 *
 * Rule:
 * - Chỉ mobile   (hasMobile && !hasDesktop): chỉ áp dụng trên viewport mobile (<= 768px).
 * - Chỉ desktop  (!hasMobile && hasDesktop): chỉ áp dụng trên viewport desktop (>= 769px).
 * - Cả 2         (hasMobile && hasDesktop): luôn áp dụng.
 * - Không platform (cả 2 false): không áp dụng.
 *
 * @param {Object} setting
 * @returns {boolean}
 */
var shouldApplyAdvancedSettingsForCurrentPlatform = function (setting) {
    var hasMobile = (setting['mobileDisplay'] == "true" || setting['mobileDisplay'] === true);
    var hasDesktop = (setting['desktopDisplay'] == "true" || setting['desktopDisplay'] === true);

    var viewportWidth = window.innerWidth || document.documentElement.clientWidth || 0;
    var isMobileViewport = viewportWidth <= 768;
    var isDesktopViewport = viewportWidth >= 769;

    var isMobileOnly = hasMobile && !hasDesktop;
    var isDesktopOnly = hasDesktop && !hasMobile;

    if (!hasMobile && !hasDesktop) return false;
    if (isMobileOnly) return isMobileViewport;
    if (isDesktopOnly) return isDesktopViewport;
    // hasMobile && hasDesktop
    return true;
};

var generateCSS_Advance = function (setting, cssNaviPrefix, naviman_appItem, embed_id, section_setting, menuKind) {
    //debugConsole("9.generateCSS_Advance");

    var addHtml = "";

    var shouldApply = shouldApplyAdvancedSettingsForCurrentPlatform(setting);

    // Global JS / jQuery ---------------------------------------------------------
    if (shouldApply) {
        var jsScript = document.createElement('script');
        jsScript.textContent = Helper.HTML.clearCSS_JS(setting['jsCode']);
        document.body.appendChild(jsScript);

        var jsNaviScript = document.createElement('script');
        jsNaviScript.textContent = standardizeFunctionString( Helper.HTML.clearCSS_JS(setting['jsNaviCode']) );
        document.body.appendChild(jsNaviScript);

        // CSS ---------------------------------------------------------
        // Scope custom CSS tới đúng menu kind: #SF-xxx.naviItem.CONTEXT_SLIDE .class
        var _menuKindClass = getMenuKindStringById(menuKind);
        var _cssCustomPrefix = embed_id + (_menuKindClass ? '.naviItem.' + _menuKindClass : '');
        naviman_appItem.insertAdjacentHTML('beforebegin', '<style>' + standardizeCSS( Helper.HTML.clearCSS_JS(setting['cssCode']), _cssCustomPrefix ) + '</style>');
        naviman_appItem.insertAdjacentHTML('beforebegin', '<style>' + Helper.HTML.clearCSS_JS(setting['cssCodeGlobal']) + '</style>');
    }

    // zIndex  ------------------------------------------------------
    if (isHadValue(setting['zIndex']))
        addHtml += cssNaviPrefix + ' { z-index: '+ setting['zIndex'] +'; } ';

    // multiSites  ------------------------------------------------------<<    
    if (isHadValue(setting['multiSites'])) {
        Helper.MultiSite.ConsoleDebug(window.location.hostname.toLowerCase().replace(/^www\./, '').trim(), section_setting, setting);
    
        var isHide = section_setting['env'] == "shopify" && Helper.MultiSite.isInvalidEmbed(setting, section_setting);
        if( isHide )
            if( naviman_version != "simulator" )
            addHtml += cssNaviPrefix + ' { display: none !important; } '; 
    }
    // multiSites  ------------------------------------------------------>>


    return addHtml;
};

var generateCSS_FixByLayout = function (setting, cssNaviPrefix, dragdrop, section_setting) {
    //debugConsole("6.generateCSS_FixByLayout");

    var addHtml = "";

    if (setting['layout'] ==  NAVIGLOBAL['LAYOUT']['HIGHLIGHT']) {

        if (setting['highlightColor'].trim() != "")
            addHtml += cssNaviPrefix + ' ul li.item_primary > .inner { background: ' + setting['highlightColor'] + '; } ';
        if (setting['highlightIconColor'].trim() != "")
            addHtml += cssNaviPrefix + ' ul li.item_primary > .inner i { color: ' + setting['highlightIconColor'] + '; } ';
    }

    if (setting['layout'] ==  NAVIGLOBAL['LAYOUT']['FLOATING']) {
        if (setting['bottomMargin'] != "") {
            addHtml += cssNaviPrefix + ' { bottom: ' + setting['bottomMargin'] + 'px; } ';
        }
    }

    if (setting['layout'] ==  NAVIGLOBAL['LAYOUT']['FAB']) {
        addHtml += cssNaviPrefix + ' { width: ' + setting['height'] + 'px; left: initial; right: 16px; height: ' + parseInt(setting['height']) + 'px; width: ' + (parseInt(setting['height']) * dragdrop.length) + 'px; } ';

        //addHtml += cssNaviPrefix + ' ul li.item .inner { padding: 8px 0px 0px 0px; } ';
        //addHtml += cssNaviPrefix + 'ul li.item .inner { padding-top: ' + ((setting['height'] - 50) / 2 + 8 + (setting['textSize'] / 2)) + 'px } ';

        addHtml += cssNaviPrefix + ' ul li ul.children { left: initial; right: 0px; bottom: 4px; width: ' + setting['submenuWidth'] + 'px; } ';
        addHtml += cssNaviPrefix + ' ul li ul.children { ' + BOX_SHADOW + ';} ';


        if (setting['bottomMargin'] != "")
            addHtml += cssNaviPrefix + ' { bottom: ' + (parseInt(setting['bottomMargin'])) + 'px; } ';
    }

    return addHtml;
}

var generateCSS_UI_Common = function ( setting, cssNaviPrefix, naviman_appItem, dragdrop, section_setting ) {
    var addHtml = "";

    // Logic: Nếu set height và kiểu left-right thì sẽ đặt một cái padding-top để nó căn vào giữa cho nó đẹp.
    //addHtml += cssNaviPrefix + ' ul > li.item .inner { padding-top: ' + ((setting['height'] - 50) / 2 + 7) + 'px } ';
    //addHtml += cssNaviPrefix + ' ul > li.left-right .inner { padding-top: 0px } ';


    // TODO: Chỗ này chưa ngon do nếu gap < 0 thì chỉ sống với top-down
    if (isHadValue(setting['spaceTextIcon'])) {
        if( setting['spaceTextIcon'] < 0 ) {
            addHtml += cssNaviPrefix + ' ul li.item .inner { gap: 0px }';
            addHtml += cssNaviPrefix + ' ul li.item .inner .info { margin-top: '+ setting['spaceTextIcon'] +'px }';
        }else
            addHtml += cssNaviPrefix + ' ul li.item .inner { gap: '+ setting['spaceTextIcon'] +'px }';
    }

    if (isHadValue(setting['imageRadius'])) {        
        addHtml += cssNaviPrefix + ' li.item .image img { border-radius: '+ setting['imageRadius'] +'px !important; } ';
    }

    /* To Safari ****/
    var display_showCSS = 'display: -webkit-inline-box';
    if( Helper.isSafari() )
        display_showCSS = 'display: inline-flex';

    if( isUserLoggedIn() ) {
        addHtml += cssNaviPrefix + ' ul li.publish-show-logined { '+ display_showCSS +' }';
        addHtml += cssNaviPrefix + ' ul li.publish-hide-logined { display: none }';
    }else {
        addHtml += cssNaviPrefix + ' ul li.publish-show-logined { display: none }';
        addHtml += cssNaviPrefix + ' ul li.publish-hide-logined { '+ display_showCSS +' }';
    }


    return addHtml;
}

var getItemValue = function( item, keyName, defaultVal ) {
    if( item[keyName] != null )
        return item[keyName];
    return defaultVal;
}


var generateCSS_Level1_Width = function (setting, cssNaviPrefix, naviman_appItem, dragdrop, section_setting) {
    var addHtml = "";

    var fixPx = 0;
    var fixPercent = 0;
    var automationCount = 0;
    var maxAutomationCount = 0;

    dragdrop.forEach((item) => {

        if( Menu.Item.isItemPublished(item) == false ) return;

        var itemWidthLayout = getItemValue(item, "widthlayout", 1);

        if( itemWidthLayout == 14 )
            fixPx += parseInt( item["widthfix"] );

        if( itemWidthLayout == 2 ) fixPercent += 8.3333333333;
        if( itemWidthLayout == 3 ) fixPercent += 16.6666666666;
        if( itemWidthLayout == 4 ) fixPercent += 25;
        if( itemWidthLayout == 5 ) fixPercent += 33.3333333333;
        if( itemWidthLayout == 6 ) fixPercent += 41.6666666666;
        if( itemWidthLayout == 7 ) fixPercent += 50;
        if( itemWidthLayout == 8 ) fixPercent += 58.3333333333;
        if( itemWidthLayout == 9 ) fixPercent += 66.6666666666;
        if( itemWidthLayout == 10 ) fixPercent += 75;
        if( itemWidthLayout == 11 ) fixPercent += 83.3333333333;
        if( itemWidthLayout == 12 ) fixPercent += 91.6666666666;
        if( itemWidthLayout == 13 ) fixPercent += 100;

        if( itemWidthLayout == 15 ) fixPercent += 10;
        if( itemWidthLayout == 16 ) fixPercent += 20;
        if( itemWidthLayout == 17 ) fixPercent += 50;
        if( itemWidthLayout == 18 ) fixPercent += 100;

        if( itemWidthLayout == 20 ) {
            // Do nothing
        }

        if( itemWidthLayout == 1 )
            automationCount ++;

        if( fixPercent == 100 ) { // Nếu gặp một item tràn màn hình thì ngắt, lấy max để làm lưới cơ sở.
            if( automationCount > maxAutomationCount) {
                maxAutomationCount = automationCount;
                automationCount = 0;
            }
        }
    });

    if( automationCount == 0 && maxAutomationCount == 0 ) return "";
    if( maxAutomationCount > 0 ) automationCount = maxAutomationCount;

    if( fixPercent >= 100 ) fixPercent = 0;
    addHtml += cssNaviPrefix + ' ul li.item { width: calc( calc( '+ (100 - fixPercent ) +'% - '+ fixPx +'px) / '+ automationCount +') } ';
    return addHtml;
}



var generateCSS = function(naviman_appItem, embed_id, setting, dragdrop, isNaviSection, section_setting, menuKind) {

    generateCSS_init(setting);

    let html = '<style>';
    let cssNaviPrefix = ' .' + embed_id + ' ';
    let idCssNaviPrefix = ' #' + embed_id + ' ';
    html += generateCSS_UI_Common( setting, cssNaviPrefix, naviman_appItem, dragdrop, section_setting );
    html += generateCSS_UI_Level1_Menuitems( setting, cssNaviPrefix, naviman_appItem, dragdrop, section_setting );
    html += generateCSS_UI_Level1_Background( setting, cssNaviPrefix, section_setting, menuKind );
    html += Menu.Common.Level1.generatePaddingMargin( setting, cssNaviPrefix, menuKind );

    html += generateCSS_UI_Level2( setting, cssNaviPrefix, null, null, section_setting, menuKind );
    html += generateCSS_FixByLayout( setting, cssNaviPrefix, dragdrop, section_setting );

    // Default is 100/item numbers
    //html += cssNaviPrefix + ' ul li.item { width: ' + (100 / dragdrop.length) + '%; } ';
    html += generateCSS_Level1_Width( setting, cssNaviPrefix, naviman_appItem, dragdrop, section_setting );

    html += generateCSS_Publish( setting, cssNaviPrefix, section_setting );
    html += generateCSS_Position( setting, cssNaviPrefix, section_setting, menuKind );
    html += generateCSS_Advance( setting, cssNaviPrefix, naviman_appItem, embed_id, section_setting, menuKind );

    if( // Is sticky menu
        menuKind == NAVIGLOBAL['MENU_KINDS']['STICKY_TABBAR'] ||
        menuKind == NAVIGLOBAL['MENU_KINDS']['STICKY_MOBILE_HEADER'] ||
        menuKind == NAVIGLOBAL['MENU_KINDS']['CONTEXT_SLIDE'] ||
        menuKind == NAVIGLOBAL['MENU_KINDS']['STICKY_FAB_SUPPORT'] 
    ) {    
        if (setting['mobileDisplay'] == "true" || setting['mobileDisplay'] == true) {
            // Nếu là bottom bar thì mới fix chỗ này
            html += Menu.Sticky.fixCSS_ForMobile(cssNaviPrefix, setting, dragdrop, section_setting);
        }

        if (setting['desktopDisplay'] == "true" || setting['desktopDisplay'] == true)
            html += Menu.Sticky.fixCSS_ForDesktop(cssNaviPrefix, setting, dragdrop, isNaviSection, section_setting);
    }

    if( 
        menuKind == NAVIGLOBAL['MENU_KINDS']['SECTION_MOBILE_MEGAMENU'] ||
        menuKind == NAVIGLOBAL['MENU_KINDS']['SECTION_MOBILE_HEADER']        
    ) 
        html += Menu.Section.fixCSS_Megamenu_Mobile(cssNaviPrefix, setting, dragdrop, isNaviSection, section_setting);

    if(  menuKind == NAVIGLOBAL['MENU_KINDS']['SECTION_DESKTOP_MEGAMENU'] ) 
        html += Menu.Section.fixCSS_Megamenu_Desktop2(cssNaviPrefix, setting, dragdrop, isNaviSection, section_setting, menuKind);            

    if( menuKind == NAVIGLOBAL['MENU_KINDS']['CONTEXT_SLIDE'] )        
        html += Menu.Context.generateCSS_FixForHambuger(idCssNaviPrefix, setting, dragdrop, isNaviSection, section_setting, embed_id, naviman_appItem, menuKind);

    html += '</style>';

    // ==============================================================
    // Lỗi thời - Nếu là multisites thì chờ load xong cả trang HTML rồi thêm vào cuối body
    if( section_setting['multisite'] != "" ) {
        Helper.HTML.addLoadedFSAtBodyEnd( html, 10 );
    }
    // Nếu không phải multisite, chèn CSS vào trước naviman_appItem (Shopify, Wordpress, nền tảng khác)
    else    
        naviman_appItem.insertAdjacentHTML('beforebegin', html);
    // ==============================================================

    if (menuKind == NAVIGLOBAL['MENU_KINDS']['SECTION_DESKTOP_MEGAMENU'] ||
        menuKind == NAVIGLOBAL['MENU_KINDS']['SECTION_MOBILE_MEGAMENU']) {
        if (typeof Menu !== "undefined" && Menu.Mega && Menu.Mega.initMegaArrowAlignListeners)
            Menu.Mega.initMegaArrowAlignListeners();
        var scheduleMegaAlign = function () {
            if (typeof Menu !== "undefined" && Menu.Mega && Menu.Mega.scheduleMegaArrowsAlign)
                Menu.Mega.scheduleMegaArrowsAlign(embed_id);
        };
        requestAnimationFrame(scheduleMegaAlign);
        setTimeout(scheduleMegaAlign, 100);
        setTimeout(scheduleMegaAlign, 500);
        if (document.fonts && document.fonts.ready)
            document.fonts.ready.then(scheduleMegaAlign);
        if (typeof Menu !== "undefined" && Menu.Common && Menu.Common.initDropdownArrowAlignListeners)
            Menu.Common.initDropdownArrowAlignListeners();
        var scheduleDropAlign = function () {
            if (typeof Menu !== "undefined" && Menu.Common && Menu.Common.scheduleDropdownArrowsAlign)
                Menu.Common.scheduleDropdownArrowsAlign(embed_id);
        };
        requestAnimationFrame(scheduleDropAlign);
        setTimeout(scheduleDropAlign, 100);
        setTimeout(scheduleDropAlign, 500);
        if (document.fonts && document.fonts.ready)
            document.fonts.ready.then(scheduleDropAlign);
    }

    if (menuKind == NAVIGLOBAL['MENU_KINDS']['STICKY_TABBAR'] ||
        menuKind == NAVIGLOBAL['MENU_KINDS']['STICKY_MOBILE_HEADER'] ||
        menuKind == NAVIGLOBAL['MENU_KINDS']['STICKY_FAB_SUPPORT'] ||
        menuKind == NAVIGLOBAL['MENU_KINDS']['SECTION_MOBILE_HEADER']) {
        if (typeof Menu !== "undefined" && Menu.Common && Menu.Common.initDropdownArrowAlignListeners)
            Menu.Common.initDropdownArrowAlignListeners();
        var scheduleTabbarDrop = function () {
            if (typeof Menu !== "undefined" && Menu.Common && Menu.Common.scheduleDropdownArrowsAlign)
                Menu.Common.scheduleDropdownArrowsAlign(embed_id);
        };
        requestAnimationFrame(scheduleTabbarDrop);
        setTimeout(scheduleTabbarDrop, 100);
        setTimeout(scheduleTabbarDrop, 500);
        if (document.fonts && document.fonts.ready)
            document.fonts.ready.then(scheduleTabbarDrop);
    }

    /*debugConsole("R:Setting ----------------------------");
    debugConsole(setting);*/
};

    


    Helper.Env.checkBrowserSupport();
    Helper.Debug.welcomeScreen();

    var init = function () {
        // debugConsole(NAVIGLOBAL);
    };

    var addNaviItemToQueue = function(naviItem) {
        const exists = window.navimanData.some(item => item.embed_id === naviItem.embed_id);
        
        if (!exists) {
            window.navimanData.push(naviItem);            
        } else {
            navidebug.warn(`naviItem with embed_id ${naviItem.embed_id} already exists in queue.`);
        }
    };

/***************************************************************************************************************  
 Nhận về một đoạn giống như trong Blocks, có 2 trường hợp;
 1. Nếu embed_id == "" -> Chèn kiểu Alls (sticky, context, section to place), vẽ vào #naviman_app
 2. Nếu embed_id != "" -> Chèn kiểu section qua Theme Editor, vẽ vào embed_id + "-container"
****************************************************************************************************************/    
    var drawBottomNav = function (response, naviplusAppUrl, var_shop, var_embed_id, section_setting = [], fixMenuKind = 0) {

        navihelper.reportSteps("===STEP 4=============================================================");
        navihelper.reportSteps("drawBottomNav() để vẽ từng menu từ data JSON get về (có thể có nhiều menu)");

        var shop = var_shop;
        var embed_id = var_embed_id;

        // Nếu ở dạng sticky thì sử dụng thẻ chung: <div class="naviman_app" id="naviman_app">
        var naviman_app = document.getElementById("naviman_app");

        // Nếu ở dạng section thì tạo riêng một loại: <div class="naviman_app section_naviman_app" id="{{embed_id}}-container">
        if( Helper.isSectionMenu( embed_id, section_setting ) ) 
            naviman_app = document.getElementById(embed_id + "-container");           
        
        //--------------------------------------------------------------------------------------------------------------------------
        
        var generateMenu_Children_LIList = function(children, naviItem, data, extSubmenu, isNaviSection, section_setting, otherClasses = "", childrenLevel = 2, menuKind) {
    var index = 0;
    var desktopHover = isSettingBeTrue(naviItem["data"]["setting"]['desktopHover']);
    if (window.innerWidth <= 768) desktopHover = false;

    var html = '';

    // Xác định menu đang hiển trên mobile / desktop dựa trên config mobileDisplay / desktopDisplay.
    var hasMobile = isSettingBeTrue(data["setting"]["mobileDisplay"]);
    var hasDesktop = isSettingBeTrue(data["setting"]["desktopDisplay"]);
    children.forEach((child) => {
      index++;

      var childKind = getItemKind(child);
      var childIsParent = getItemIsParent( child );
      var childDivider = getItemDivider( child );

      var childDividerInfo = getDividerStyles( 2, childDivider, {
          "dividercolor": getExtVariable(child, "dividercolor", ""),
          "dividersize": getExtVariable(child, "dividersize", ""),
          "dividertype": getExtVariable(child, "dividertype", ""),
          "dividerwidth": getExtVariable(child, "dividerwidth", "")
      }, data["setting"], menuKind );
      var childDividerStyle = childDividerInfo.style;

      var childShowBadgeMode = getItemShowBadgeMode(child);

      var childClass = "child ";
      if (childDivider == 1) {
          childClass += "child_divider ";
          childClass += childDividerInfo.widthClass;
      }
      childClass += getChildExClassOfBadge( child );

      var childUrl = Helper.standalizeUrl(naviLanguage.stringByLanguage(child["url"]));
      var isTel = isItemTel( childUrl );
      var isSMS = isItemSMS(childUrl);

      /*** Một số cái sẽ dùng chung cho tất cả các menu item *************************************/
      var childExtTextColor = getExtVariable(child, "textcolor", "");
      var childExtTextSize = getExtVariable(child, "textsize", "");
      var childExtIconColor = getExtVariable(child, "iconcolor", "");
      var childExtIconSize = getExtVariable(child, "iconsize", "");
      var childExtBackgroundColor = getExtVariable(child, "backgroundcolor", "");
      var childExtBackgroundImage = getExtVariable(child, "backgroundimage", "");

      var childExtWidth = getExtWidth(child);
      var childExtPosition = getExtPosition(child);

      var childExtAlign = getExtVariable(child, "align", "inherit");
      var childExtClassname = getExtVariable(child, "classname", "");
      var childExtAnimation = getExtVariable(child, "animation", "");
      var childExtDisplayLayout = getExtVariable(child, "displaylayout", "");
      if( childExtDisplayLayout == "" )
          childExtDisplayLayout = "layout-automatic";
      if( child["icon"] == "" && child["image"] == "" ) {
          childExtDisplayLayout = "text-only";
      }
      if( child["name"] == "" ) {
          if( child["icon"] == "" && child["image"] == "" )
              childExtDisplayLayout = "empty";
          else
              childExtDisplayLayout = "icon-image-only";
      }

      var childExtAttr = getExtVariable(child, "attr", "");

      /**** Dành riêng cho child ***********/
      // Nếu layout == automatic thì sẽ đổi thành left-right
      if( childExtDisplayLayout == "" ) childExtDisplayLayout = "left-right";
      /*************************************/

      var childExtIsPublished = getExtVariable(child, "ispublished", 1);
      var childExtHideWhenLogined = getExtVariable(child, "hidewhenlogined", 0);
      var childExtShowWhenLogined = getExtVariable(child, "showwhenlogined", 0);

      // Search: update 4 - Apply
      var childExtPadding = Helper.HTML.formatPaddingTRBL(Helper.HTML.parsePaddingMargin(getExtVariable(child, "padding", "")));
      var childExtMargin = Helper.HTML.formatMarginTRBL(Helper.HTML.parsePaddingMargin(getExtVariable(child, "margin", "")));

      var childExtHeightFix = getExtHeight(getExtVariable(child, "heightfix", ""));

      var childExtIconboxStyle = getIconboxStyle(
          getExtVariable(child, "iconboxcolor", ""),
          getExtVariable(child, "iconboxpadding", ""),
          getExtVariable(child, "iconboxradius", "")
      );

      var childExtCSS = getExtVariable(child, "css", "");

      /*** Bắt đầu đoạn mã để draw code tất tất cả kind of menu **********************************/

      // Điều kiện ẩn/hiện Shopify Inbox cho child open:Inbox dựa trên cấu hình menu + viewport.
      if (isOpenInbox(childUrl)) {
          // Ủy quyền xử lý ẩn/hiện Shopify Inbox cho helper dùng chung.
          handleOpenInboxVisibility(hasMobile, hasDesktop);
      }

              var onclickFunc = 'return naviman.gotoUrl(event, this, ' + childIsParent + ', \'' + childUrl + '\', \'' + naviItem["embed_id"] + '\', '+ isNaviSection +')';
              var onhoverFunc = 'return naviman.gotoUrl(event, this, ' + childIsParent + ', \'#\', \'' + naviItem["embed_id"] + '\', '+ isNaviSection +')';
              var childOnClick = 'onclick="'+ onclickFunc +'" ';
              
              if (desktopHover) {
                  if (childIsParent) {
                      if (!(childExtClassname.includes('navi-nohover') || childExtClassname.includes('navi-hover'))) {

                        var childHoverTimeout = 250; // Thời gian hover timeout, có thể điều chỉnh nếu cần
                        if( menuKind == NAVIGLOBAL['MENU_KINDS']['CONTEXT_SLIDE'] )
                            childHoverTimeout = 500; 

                          // Khai báo hoverTimeout trong phạm vi của naviman
                          childOnClick += 'onMouseEnter="clearTimeout(naviman.hoverTimeout); naviman.hoverTimeout = setTimeout(() => { if (this.matches(\':hover\')) { this.classList.add(\'navi-hover-active\'); ' + onhoverFunc + '; } }, '+ childHoverTimeout +');" ';
                          childOnClick += 'onMouseLeave="clearTimeout(naviman.hoverTimeout); naviman.hoverTimeout = setTimeout(() => { if (!this.matches(\':hover\')) { this.classList.remove(\'navi-hover-active\'); ' + onhoverFunc + '; } }, '+ childHoverTimeout +');" ';
                      }
                  }
              }            

      /*
      ************************************************************
      */


      if (isTel || isSMS) childOnClick = "";

      var childStylePositive = "";
      if( isTel || isSMS ) childStylePositive = ' style="position:relative; " ';

      var isParent = "";
      if( childIsParent )
          isParent = " is-parent ";

      var seoName = naviLanguage.stringByLanguage(child["name"]);

      var seoUrl = '';
      if(isOptimizeSEO(navihelper.windowVar.get('shopinfo')))
          seoUrl = '<a alt="'+ seoName +'" title="'+ seoName +'" href="'+ getSEOUrl( childUrl ) +'" onclick="return false;">';

      

      var classOfKind = getItemExClassOfKind( childKind );
      if( classOfKind.trim() == "kind-group-title" && (childUrl == "" || childUrl == "#") && (!childIsParent) ) {
            seoUrl = '';
            childOnClick = '';
        }
      if( classOfKind.trim() == "kind-group-title" && childUrl != "" && childUrl != "#" ) {
            classOfKind += " has-url ";
        }

      if (isHadValue(data["setting"]['submenuDividerColor'])) {  
        if(classOfKind.trim() == "kind-blank-space") {
            if(childExtBackgroundColor == "" && childExtBackgroundImage == "") {
                childExtBackgroundColor = data["setting"]['submenuDividerColor'];
            }
        }  
      }      

      html += '<li ' +
          collectStyles([
              getStyleExtBackground(childExtBackgroundColor, childExtBackgroundImage, data, 2),
              getStyleExtAlign(childExtAlign),
              childExtWidth['style'],
              childExtPosition,
              childStylePositive,
              childExtPadding,
              childExtCSS,
              childDividerStyle,
              childExtHeightFix
          ]) +
          getAttr( childExtAttr ) +
          ' linkto="' + childUrl + '" class="' +
          collectClasses([childClass,
              childExtClassname,
              childExtDisplayLayout,
              classOfKind,
              getPublishClassed(childExtIsPublished, childExtHideWhenLogined, childExtShowWhenLogined, childExtAttr),
              childExtWidth['class'],
              getClassesExtAlign( childExtAlign),
              isParent,
              "level-" + childrenLevel
          ])
          + '" ' + childOnClick + ' data-name="' + child["name"] + '" data-kind="' + childKind + '">';
      html += '<div class="inner inner-level' + childrenLevel + ' ' + getAnimationClass(childExtAnimation) + '"' + collectStyles([childExtMargin]) + '>';
      html += '<span class="arrow"></span>';

      if( childShowBadgeMode == BADGE_ISCART_WITHCOUNT ) {
          html += '<span class="cart_count">'+ cartCount +'</span>';

          if( cartCount == 0 || cartCount == "" ) { 
              document.documentElement.style.setProperty('--cart-count-number', '');
          } else {          
            document.documentElement.style.setProperty('--cart-count-number', `"${cartCount}"`);
          }
      }

      html += itemMedia(
          child['icon'],
          child['image'],
          naviplusAppUrl,
          getStyleExtIcon(childExtIconColor, childExtIconSize, childExtIconboxStyle, getIconBoxPaddingTop( getExtVariable(child, "iconboxpadding", "") )),
          getIconBoxPaddingTop( getExtVariable(child, "iconboxpadding", "") ),
          childExtIconSize,
          getStyleExtAlign(childExtAlign),
          seoUrl,
          seoName
      );

      var divInfo = '<div class="info">';
      if( childExtDisplayLayout == "text-only" )
          divInfo = '<div class="info" '+ collectStyles(childExtIconboxStyle, getIconBoxPaddingTop( getExtVariable(child, "iconboxpadding", "") )), +'>';

      html += divInfo;
      html += '<div class="flexcol">';

      if(seoUrl != "") html += seoUrl;
      html += '<span class="name"' + getStyleExtText(childExtTextColor, childExtTextSize) + '>' + naviLanguage.stringByLanguage(child["name"]) + '</span>';
      if(seoUrl != "") html += '</a>';

      if (child["description"] != "")
          html += '<div class="description"'+ getStyleExtText(childExtTextColor, "") +'>' + naviLanguage.stringByLanguage(child["description"]) + '</div>';
      html += '</div>'; // flexcol

      html += '</div>'; // info

      html += getItemClickTelSMS(isTel, isSMS, childUrl);

      html += '</div>'; // inner

      if( childrenLevel < 3 ) {
        if (childIsParent) html += generateMenu_Children(
            child["children"], 
            naviItem, 
            data, 
            {
            "Animation": getExtVariable(child, "submenuanimation", ""),
            "Background": getExtVariable(child, "submenubackgroundcolor", ""),
            "BackgroundImage": getExtVariable(child, "submenubackgroundimage", ""),
            }, 
            isNaviSection, 
            section_setting, 
            otherClasses, 
            childrenLevel + 1,
            menuKind
        );
        }

      html += '</li>';
      /*** ENDOF: Đoạn mã để draw code tất tất cả kind of menu **********************************/


      if( childrenLevel == 3 ) 
        if( child["children"] )
        {
        html += generateMenu_Children_Level4(
            child["children"], naviItem, data, extSubmenu, isNaviSection, section_setting, otherClasses, 4, menuKind
        );
      }

  });
  return html;
}

/************************************************************************************************************************ */

var generateMenu_Children = function(children, naviItem, data, extSubmenu, isNaviSection, section_setting, otherClasses = "", childrenLevel = 2, menuKind) {

    var html = '<ul menulevel="'+ childrenLevel +'" class="'+ collectClasses( [' children ' +  otherClasses + ' ', getSubmenuClasses(extSubmenu)] )  +' " '+ getSubmenuStyles(extSubmenu, data) +'>';
    html+= generateMenu_Children_LIList(children, naviItem, data, extSubmenu, isNaviSection, section_setting, otherClasses, childrenLevel, menuKind);
    html += '</ul>';
  return html;
}

/************************************************************************************************************************ */

var generateMenu_Children_Level4 = function(children, naviItem, data, extSubmenu, isNaviSection, section_setting, otherClasses = "", childrenLevel = 2, menuKind) {
        
    var html = '<li class="divider-level4-top" >&nbsp;<li>';
    html+= generateMenu_Children_LIList(children, naviItem, data, extSubmenu, isNaviSection, section_setting, otherClasses, 4, menuKind);
    html += '<li class="divider-level4-bottom">&nbsp;<li>';
    return html;
  }

/************************************************************************************************************************ */

var generateMenu_Children_FullExpand = function(children, naviItem, data, extSubmenu, isNaviSection, section_setting, fullexpandWidth = "", fullexpandwidthByItem = "", menuKind) {
  var index = 0;

    function standardizePXValue(value) {
        if (value === undefined || value === null) return "";

        // Ép về chuỗi và xóa khoảng trắng
        value = String(value).trim();

        // Trả về "" nếu rỗng
        if (value === "") return "";

        // Giữ nguyên nếu đã có đơn vị px hoặc pt
        if (value.endsWith("px") || value.endsWith("pt")) {
            return value;
        }

        // Cho phép giữ nguyên "100%"
        if (value === "100%") {
            return value;
        }

        // Nếu là số thì thêm đơn vị px
        return isNaN(value) ? "" : value + "px";
    }
  
    var fullWidthPxStyle = "";

    if( fullexpandwidthByItem != "" && fullexpandwidthByItem != "0" )  
        fullexpandWidth = fullexpandwidthByItem;
    
    fullWidthPxStyle = `width: ${standardizePXValue(fullexpandWidth)};`; 
    if( parseInt(fullexpandWidth, 10) < 980 ) 
        fullWidthPxStyle += `overflow: auto; left: auto;`;
    else 
        fullWidthPxStyle += `overflow: auto; left: 50%; transform: translate(-50%, 0px);`;

    var html = '<ul '+ collectStyles( fullWidthPxStyle, getSubmenuStyles(extSubmenu, data))  +'" class="'+ collectClasses( [' children fullExpand ', getSubmenuClasses(extSubmenu)] )  +' " >';

  children.forEach((child) => {
      index++;
      var childIsParent = getItemIsParent( child );

      var itemWidthLayout = child["widthlayout"];

      var styleWidthFlex = ' style="';

      const widthMap = {
        2: 8.3333333333, 3: 16.6666666666, 4: 25, 5: 33.3333333333,
        6: 41.6666666666, 7: 50, 8: 58.3333333333, 9: 66.6666666666,
        10: 75, 11: 83.3333333333, 12: 91.6666666666, 13: 100,
        15: 10, 16: 20, 17: 50, 18: 100
      };
      
      if (widthMap[itemWidthLayout]) {
          let width = widthMap[itemWidthLayout];
          styleWidthFlex += `flex: 0 0 ${width}%; `;
          styleWidthFlex += `max-width: ${width}%; `;
      }


      if( itemWidthLayout == 14 ) { // Fix width
        styleWidthFlex += 'flex: 0 0 '+ parseInt( child["widthfix"] ) +'px; ';
        styleWidthFlex += 'max-width: '+ parseInt( child["widthfix"] ) +'px; ';  
      }

      styleWidthFlex += '" ';

      html += '<li class="child_column " '+ styleWidthFlex +' >';


      var childrenLevel = 2;
        if (childIsParent) {
          html += generateMenu_Children(
            child["children"], 
            naviItem, 
            data, 
            {
                "Animation": getExtVariable(child, "submenuanimation", ""),
                "Background": getExtVariable(child, "submenubackgroundcolor", ""),
                "BackgroundImage": getExtVariable(child, "submenubackgroundimage", ""),
            }, 
            isNaviSection, 
            section_setting,
            "fullExpandChildrent", 
            childrenLevel,
            menuKind
        );
      }


      html += '</li>';
      /*** ENDOF: Đoạn mã để draw code tất tất cả kind of menu **********************************/
  });


  html += '</ul>';
  return html;
}

function normalizeNumber(value) {
    // Loại bỏ "px" hoặc "pt" nếu có ở cuối
    value = value.replace(/(px|pt)$/i, '');
    
    // Chuyển đổi thành số
    return isNaN(value) ? 0 : parseFloat(value);
}

function isOpenNaviMenu(itemUrl) {
    if (itemUrl.substring(0, 13).toLowerCase() == "open:navimenu")
        return true;
    return false;
}

var generateMenu = function( data, naviItem, isNaviSection, section_setting, menuKind ){
    var index = 0;
    var highLightItem = getItemHighlight(data);

    var sectionTitle = '';
    if( section_setting['embed_title'] != "")
        sectionTitle += '<h2>'+ section_setting['embed_title'] +'</h2>';

    var desktopHover = isSettingBeTrue(naviItem["data"]["setting"]['desktopHover']);
    if (window.innerWidth <= 768) desktopHover = false;

    var hamburgerClose = '';
    if( menuKind == NAVIGLOBAL['MENU_KINDS']['CONTEXT_SLIDE'] ) {
        hamburgerClose = '<span title="Close menu" class="hamburger_close"></span><i class="ri-close-line close-icon"></i>';
        hamburgerClose += '<span title="Back menu" class="hamburger_back"></span><i style="display: none" class="ri-arrow-left-line back-icon"></i>';
    }

    var scrollMobileAllow = isSettingBeTrue(naviItem["data"]["setting"]['scrollMobileAllow']);
    var scrollMobileFixWidth = 0;
    if( scrollMobileAllow )
        if (isHadValue(naviItem["data"]["setting"]['scrollMobileFixWidth'])) 
            scrollMobileFixWidth = normalizeNumber( naviItem["data"]["setting"]['scrollMobileFixWidth'] );
    if( scrollMobileFixWidth == 0 )    
        scrollMobileAllow = false;

    var scrollMobileDivOpen = '';
    var scrollMobileDivClose = '';
    var scrollMobileFixWidthStyle = '';
    var isMegaMenu = (menuKind == NAVIGLOBAL['MENU_KINDS']['SECTION_MOBILE_MEGAMENU']);
    var isGridMenu = (menuKind == NAVIGLOBAL['MENU_KINDS']['SECTION_MOBILE_GRID']);
    if( scrollMobileAllow ) {
        // Grid menu: luôn tạo .scroll-mobile (như Mega menu) để DeviceModeResize xử lý đúng khi resize.
        // Nếu chỉ tạo khi window.innerWidth <= 768 → page load trên desktop sẽ không có wrapper,
        // DeviceModeResize không tìm thấy scrollWrap → ul.width không được set khi chuyển sang mobile.
        if (isMegaMenu || isGridMenu || window.innerWidth <= 768) {
            navidebug.log("___Scroll mobile allow: ", naviItem["embed_id"], scrollMobileFixWidth);
            scrollMobileDivOpen = '<div class="scroll-mobile">';
            scrollMobileDivClose = '</div><!-- scroll-mobile-->';
            // Grid menu: không set inline width trên desktop (tránh bị "fix" width khi refresh desktop).
            // Width fix cho mobile sẽ được DeviceModeResize áp dụng dựa trên data-scroll-mobile-width.
            if (!isGridMenu || window.innerWidth <= 768) {
                scrollMobileFixWidthStyle = ' style="width: '+ scrollMobileFixWidth +'px" ';
            }
        }
    }

    var html = sectionTitle + hamburgerClose;

    html += scrollMobileDivOpen;

    // ulDataAttrs Phục vụ cho việc resize màn hình thì đáp ứng cho đúng.
    var ulDataAttrs = scrollMobileAllow && menuKind == NAVIGLOBAL['MENU_KINDS']['SECTION_MOBILE_GRID']
        ? ' data-scroll-mobile-width="' + scrollMobileFixWidth + '"' : '';
    html += '<ul class="navigation" '+ scrollMobileFixWidthStyle + ulDataAttrs + '>';

    // Xác định menu đang hiển trên mobile / desktop dựa trên config mobileDisplay / desktopDisplay.
    var hasMobile = isSettingBeTrue(data["setting"]["mobileDisplay"]);
    var hasDesktop = isSettingBeTrue(data["setting"]["desktopDisplay"]);
    var isMobileOnly = (hasMobile && !hasDesktop);
    var isDesktopOnly = (hasDesktop && !hasMobile);
    data["dragdrop"].forEach((item) => {
        index++;

        var itemKind = getItemKind(item);
        var itemIsParent = getItemIsParent( item );
        var itemDivider = getItemDivider( item );
        var itemDividerInfo = getDividerStyles( 1, itemDivider, {
            "dividercolor": getExtVariable(item, "dividercolor", ""),
            "dividersize": getExtVariable(item, "dividersize", ""),
            "dividertype": getExtVariable(item, "dividertype", ""),
            "dividerwidth": getExtVariable(item, "dividerwidth", "")
        }, data["setting"], menuKind );
        var itemDividerStyle = itemDividerInfo.style;

        var itemShowBadgeMode = getItemShowBadgeMode(item);

        var isParent = "";
        if( itemIsParent )
            isParent = " is-parent-top ";

        var itemClass = "item ";
        if (itemDivider == 1) {
            itemClass += "item_divider ";
            itemClass += itemDividerInfo.widthClass;
        }

        if (highLightItem == index) itemClass += "item_primary ";
        itemClass += getItemExClassOfBadge( item );

        var itemUrl = Helper.standalizeUrl(naviLanguage.stringByLanguage(item["url"]));
        var isTel = isItemTel( itemUrl );
        var isSMS = isItemSMS( itemUrl );

        /*** Một số cái sẽ dùng chung cho tất cả các menu item *************************************/
        var itemExtTextColor = getExtVariable(item, "textcolor", "");
        var itemExtTextSize = getExtVariable(item, "textsize", "");
        var itemExtIconColor = getExtVariable(item, "iconcolor", "");
        var itemExtIconSize = getExtVariable(item, "iconsize", "");
        var itemExtBackgroundColor = getExtVariable(item, "backgroundcolor", "");
        var itemExtBackgroundImage = getExtVariable(item, "backgroundimage", "");

        var itemExtWidth = getExtWidth(item, menuKind, data["setting"]);

        itemExtWidth = Menu.Section.fixWidthLayoutForMegamenu( itemExtWidth, menuKind );

        var itemExtPosition = getExtPosition(item);

        var itemExtAlign = getExtVariable(item, "align", "inherit");
        var itemExtClassname = getExtVariable(item, "classname", "");
        var itemExtAnimation = getExtVariable(item, "animation", "");
        var itemExtDisplayLayout = getExtVariable(item, "displaylayout", "");
        if( itemExtDisplayLayout == "" )
            itemExtDisplayLayout = "layout-automatic";
        if( item["icon"] == "" && item["image"] == "" ) {
            itemExtDisplayLayout = "text-only";
        }
        if( item["name"] == "" ) {
            if( item["icon"] == "" && item["image"] == "" )
                itemExtDisplayLayout = "empty";
            else
                itemExtDisplayLayout = "icon-image-only";
        }

        var itemExtAttr = getExtVariable(item, "attr", "");

        var itemExtIsPublished = getExtVariable(item, "ispublished", 1);
        var itemExtHideWhenLogined = getExtVariable(item, "hidewhenlogined", 0);
        var itemExtShowWhenLogined = getExtVariable(item, "showwhenlogined", 0);


        var itemExtHeightFix = getExtHeight(getExtVariable(item, "heightfix", ""));

        var itemExtCSS = getExtVariable(item, "css", "");

        // Search: update 4 - Apply
        var itemExtPadding = Helper.HTML.formatPaddingTRBL(Helper.HTML.parsePaddingMargin(getExtVariable(item, "padding", "")));
        var itemExtMargin = Helper.HTML.formatMarginTRBL(Helper.HTML.parsePaddingMargin(getExtVariable(item, "margin", "")));

        var itemExtIconboxStyle = getIconboxStyle(
            getExtVariable(item, "iconboxcolor", ""),
            getExtVariable(item, "iconboxpadding", ""),
            getExtVariable(item, "iconboxradius", "")
        );

        /*** Bắt đầu đoạn mã để draw code tất tất cả kind of menu **********************************/

        // Điều kiện ẩn Shopify Inbox cho item open:Inbox dựa trên cấu hình menu + viewport.
        if (isOpenInbox(itemUrl)) {
            // Ủy quyền xử lý ẩn/hiện Shopify Inbox cho helper dùng chung.
            handleOpenInboxVisibility(hasMobile, hasDesktop);
        }

        var desktopParentHoverLink = "#";
        if (window.innerWidth >= 769) {
            if (isOpenNaviMenu(itemUrl)) 
                desktopParentHoverLink = itemUrl;
        }

        var onclickFunc = 'return naviman.gotoUrl(event, this, ' + itemIsParent + ', \'' + itemUrl + '\', \'' + naviItem["embed_id"] + '\', '+ isNaviSection +')';
        var onhoverFunc = 'return naviman.gotoUrl(event, this, ' + itemIsParent + ', \''+ desktopParentHoverLink +'\', \'' + naviItem["embed_id"] + '\', '+ isNaviSection +')';
        var itemOnClick = 'onclick="'+ onclickFunc +'" ';
        
        if (desktopHover) {
            if (!(itemExtClassname.includes('navi-nohover') || itemExtClassname.includes('navi-hover'))) {

                var itemHoverTimeout = 100; // Thời gian hover timeout, có thể điều chỉnh nếu cần
                if( menuKind == NAVIGLOBAL['MENU_KINDS']['CONTEXT_SLIDE'] )
                    itemHoverTimeout = 200; 

                itemOnClick += 'onMouseEnter="clearTimeout(naviman.hoverTimeout); naviman.hoverTimeout = setTimeout(() => { if (this.matches(\':hover\')) { this.classList.add(\'navi-hover-active\'); ' + onhoverFunc + '; } }, '+ itemHoverTimeout +');" ';
                if (itemIsParent ) 
                    itemOnClick += 'onMouseLeave="clearTimeout(naviman.hoverTimeout); naviman.hoverTimeout = setTimeout(() => { if (!this.matches(\':hover\')) { this.classList.remove(\'navi-hover-active\'); ' + onhoverFunc + '; } }, '+ itemHoverTimeout +');" ';                                    
            }// navi-hover
        
        } // desktopHover
                
        /*
        ************************************************************
        */


            
        if (isTel || isSMS) itemOnClick = "";

        var itemStylePositive = "";
        if (isTel || isSMS) itemStylePositive = ' style="position:relative; " ';

        var seoName = naviLanguage.stringByLanguage(item["name"]); 

        var seoUrl = '';
        if(isOptimizeSEO(navihelper.windowVar.get('shopinfo')))
            seoUrl = '<a alt="'+ seoName +'" title="'+ seoName +'" href="'+ getSEOUrl( itemUrl ) +'" onclick="return false;">';
        
        

        var classOfKind = getItemExClassOfKind( itemKind );
        if( classOfKind.trim() == "kind-group-title" && (itemUrl == "" || itemUrl == "#") && ( !isParent ) ) {
              seoUrl = '';
              itemOnClick = '';
          }
        if( classOfKind.trim() == "kind-group-title" && itemUrl != "" && itemUrl != "#" ) {
              classOfKind += " has-url ";
          }
        
        if (isHadValue(data["setting"]['dividerColor'])) {  
            if(classOfKind.trim() == "kind-blank-space") {
                if(itemExtBackgroundColor == "" && itemExtBackgroundImage == "") {
                    itemExtBackgroundColor = data["setting"]['dividerColor'];
                }
            }  
        }        


        html += '<li ' +
            collectStyles([
                getStyleExtBackground(itemExtBackgroundColor, itemExtBackgroundImage, data, 1),
                getStyleExtAlign(itemExtAlign),
                itemExtWidth['style'],
                itemExtPosition,
                itemStylePositive,
                itemExtPadding,
                itemExtCSS,
                itemDividerStyle,
                itemExtHeightFix
            ]) +
            getAttr( itemExtAttr ) +
            ' linkto="' + itemUrl + '" class="' +
            collectClasses([itemClass,
                itemExtClassname,
                itemExtDisplayLayout,
                classOfKind,
                getPublishClassed(itemExtIsPublished, itemExtHideWhenLogined, itemExtShowWhenLogined, itemExtAttr),
                itemExtWidth['class'],
                getClassesExtAlign( itemExtAlign ),
                isParent,
                "level-1"
            ])
            + '" ' + itemOnClick + ' data-name="' + naviLanguage.stringByLanguage(item["name"]) + '" data-kind="' + itemKind + '"' + 'data-fullexpand="'+  getExtVariable(item, "fullexpand", "0") +'"' + 'data-fullexpand-width="'+  getExtVariable(item, "fullexpandwidth", "") +'"'
            + (menuKind == NAVIGLOBAL['MENU_KINDS']['SECTION_MOBILE_GRID'] ? getGridItemDataAttrs(item) : '')
            + '>';


        html += '<div class="inner inner-level1 ' + getAnimationClass(itemExtAnimation) + '"' + collectStyles([itemExtMargin]) + '>';
        html += '<span class="arrow"></span>';


        if (itemShowBadgeMode == BADGE_ISCART_WITHCOUNT) {
            html += '<span class="cart_count">' + cartCount + '</span>';
            if( cartCount == 0 || cartCount == "" ) { 
                document.documentElement.style.setProperty('--cart-count-number', '');
            }else {
                document.documentElement.style.setProperty('--cart-count-number', `"${cartCount}"`);
            }
        }

        html += itemMedia(
            item['icon'],
            item['image'],
            naviplusAppUrl,
            getStyleExtIcon(itemExtIconColor, itemExtIconSize, itemExtIconboxStyle, getIconBoxPaddingTop( getExtVariable(item, "iconboxpadding", "") )),
            //getIconBoxPaddingTop( getExtVariable(item, "iconboxpadding", "") ),
            getExtVariable(item, "iconboxpadding", ""),
            itemExtIconSize,
            getStyleExtAlign(itemExtAlign),
            seoUrl,
            seoName
        );

        var divInfo = '<div class="info">';
        if( itemExtDisplayLayout == "text-only" )
            divInfo = '<div class="info" '+ collectStyles(itemExtIconboxStyle, getIconBoxPaddingTop( getExtVariable(item, "iconboxpadding", "") )) +'>';

        html += divInfo;
        html += '<div class="flexcol">';
        if(seoUrl != "") html += seoUrl;
        html += '<span class="name"' + getStyleExtText(itemExtTextColor, itemExtTextSize) + '>' + naviLanguage.stringByLanguage(item["name"]) + '</span>';
        if(seoUrl != "") html += '</a>';

        if (item["description"] != "")
            html += '<div class="description" '+ getStyleExtText(itemExtTextColor, "") +'>' + naviLanguage.stringByLanguage(item["description"]) + '</div>';
        html += '</div>'; // flexcol
        html += '</div>'; // info

        html += getItemClickTelSMS(isTel, isSMS, itemUrl);

        html += '</div>'; // inner


        if (itemIsParent) 
            if( getExtVariable(item, "fullexpand", "") == "1" ) {
                html += generateMenu_Children_FullExpand(item["children"], naviItem, data, 
                    {
                        "Animation": getExtVariable(item, "submenuanimation", ""),
                        "Background": getExtVariable(item, "submenubackgroundcolor", ""),
                        "BackgroundImage": getExtVariable(item, "submenubackgroundimage", ""),
                    }, 
                    isNaviSection, 
                    section_setting, 
                    defaultValue(data["setting"]['submenuFullExpandWidth'], ""), 
                    defaultValue(item['fullexpandwidth'], ""), 
                    menuKind
                     );    
            }else {
                var childrenLevel = 2;
                html += generateMenu_Children(
                    item["children"], 
                    naviItem, 
                    data, 
                    {
                        "Animation": getExtVariable(item, "submenuanimation", ""),
                        "Background": getExtVariable(item, "submenubackgroundcolor", ""),
                        "BackgroundImage": getExtVariable(item, "submenubackgroundimage", ""),
                    }, 
                    isNaviSection, 
                    section_setting, 
                    "", // otherClass
                    childrenLevel,
                    menuKind
                     );
            }
        
        html += '</li>';
        /*** ENDOF: Đoạn mã để draw code tất tất cả kind of menu **********************************/

    });
    html += '</ul>';

    html += scrollMobileDivClose;

    return html;
} // generateMenu - level 1

/******************************************************************************************************************/
var getAttr = function ( attr ) {
    if( attr == "" )
        return "";
    var attrArray = parseAttributes(decodeQuery( attr ));
    if( attrArray.length == 0 )
        return "";

    return formatAttributes( attrArray );
}

var getExtHeight = function ( heightfix ) {
    if( heightfix == "" )
        return "";
    return ' height: ' + String(heightfix).strReplace("px", " ").strReplace("pt", " ") + 'px; ';
}

var getDividerStyles = function ( level = 1, itemDivider, itemExtDiver, setting, menuKind ) {
    if (itemDivider != 1)
        return { style: "", widthClass: "" };
    var styles = ' style="';
    var isOnMobile = window.innerWidth <= 768;

    var dividerDirection = "right-";
    if( level == 1 ) { // Nếu là level 1 thì chia một số trường hợp
        if( menuKind == NAVIGLOBAL['MENU_KINDS']['STICKY_TABBAR']
            /*
            || menuKind == NAVIGLOBAL['MENU_KINDS']['STICKY_FAB_SUPPORT'] /* Trường hợp STICKY_FAB_SUPPORT thực tế ko xảy ra vì ko có chọn vị trí */
        ) {
            if (isOnMobile) {
                if (
                    setting['mobilePosition'] == NAVIGLOBAL['MOBILE_POSITION']['RIGHT_CENTER'] ||
                    setting['mobilePosition'] == NAVIGLOBAL['MOBILE_POSITION']['LEFT_CENTER'] ||
                    setting['mobilePosition'] == NAVIGLOBAL['MOBILE_POSITION']['RIGHT_BOTTOM'] ||
                    setting['mobilePosition'] == NAVIGLOBAL['MOBILE_POSITION']['LEFT_BOTTOM']
                ) dividerDirection = "bottom-";
            }
            else {
                if (
                    setting['desktopPosition'] == NAVIGLOBAL['DESKTOP_POSITION']['RIGHT_TOP'] ||
                    setting['desktopPosition'] == NAVIGLOBAL['DESKTOP_POSITION']['LEFT_TOP'] ||
                    setting['desktopPosition'] == NAVIGLOBAL['DESKTOP_POSITION']['LEFT_FULL_TOP'] ||
                    setting['desktopPosition'] == NAVIGLOBAL['DESKTOP_POSITION']['LEFT_FULL_CENTER'] ||
                    setting['desktopPosition'] == NAVIGLOBAL['DESKTOP_POSITION']['RIGHT_FULL_TOP'] ||
                    setting['desktopPosition'] == NAVIGLOBAL['DESKTOP_POSITION']['RIGHT_FULL_CENTER']
                ) dividerDirection = "bottom-";
            }
        }

        if( menuKind == NAVIGLOBAL['MENU_KINDS']['CONTEXT_SLIDE'])
            dividerDirection = "bottom-";

        /* Phần này dành cho các FAB bên trái và bên phải phải- đã không còn ở trong thư viện nữa rồi ************/
        if( menuKind == NAVIGLOBAL['MENU_KINDS']['STICKY_FAB_SUPPORT']) {
            if (isOnMobile) {
                if (
                    setting['mobilePosition'] == NAVIGLOBAL['MOBILE_POSITION']['RIGHT_CENTER'] ||
                    setting['mobilePosition'] == NAVIGLOBAL['MOBILE_POSITION']['LEFT_CENTER']
                ) dividerDirection = "bottom-";
            }
            else {
                if (
                    setting['desktopPosition'] == NAVIGLOBAL['DESKTOP_POSITION']['RIGHT_TOP'] ||
                    setting['desktopPosition'] == NAVIGLOBAL['DESKTOP_POSITION']['LEFT_TOP']
                ) dividerDirection = "bottom-";
            }
        }
        /* Phần này dành cho các FAB bên trái và bên phải phải- đã không còn ở trong thư viện nữa rồi **********/

    } else // Nếu là level 2,3 thì chỉ có một trường hợp ngang thôi.
        dividerDirection = "bottom-";

    var dividerWidth = itemExtDiver["dividerwidth"] || "";
    var hasWidthLimit = (dividerWidth !== "" && dividerWidth !== "full");

    if (hasWidthLimit) {
        // Dùng CSS variables để ::after pseudo-element có thể kế thừa color/size/style
        if( itemExtDiver["dividercolor"] != "" )
            styles += '--nd-color:' + itemExtDiver["dividercolor"] + ';';
        if( itemExtDiver["dividersize"] != "" )
            styles += '--nd-size:' + String(itemExtDiver["dividersize"]).strReplace("px", "").strReplace("pt", "") + 'px;';
        if( itemExtDiver["dividertype"] != "" )
            styles += '--nd-style:' + itemExtDiver["dividertype"] + ';';
        styles += '"';
        return { style: styles, widthClass: " divider-w-" + dividerWidth };
    }

    if( itemExtDiver["dividercolor"] != "" )
        styles += 'border-'+ dividerDirection +'color:' + itemExtDiver["dividercolor"] + ';';
    if( itemExtDiver["dividersize"] != "" )
        styles += 'border-'+ dividerDirection +'width:' + String(itemExtDiver["dividersize"]).strReplace("px", "").strReplace("pt", "") + 'px;';
    if( itemExtDiver["dividertype"] != "" )
        styles += 'border-'+ dividerDirection +'style:' + itemExtDiver["dividertype"] + ';';

    styles += '"';
    return { style: styles, widthClass: "" };
}

var getSubmenuClasses = function (itemExtSubmenu) {
    if( itemExtSubmenu["Animation"] != "" )
        return getAnimationClass( itemExtSubmenu["Animation"] );
    return "";
}

var getSubmenuStyles = function (itemExtSubmenu, data) {
    /*var styles = ' style="';
    if( itemExtSubmenu["Background"] != "" )
        styles += 'background-color:' + itemExtSubmenu["Background"] + ';';
    if( itemExtSubmenu["BackgroundImage"] != "" )
        styles += ' background-image: url('+ itemExtSubmenu["BackgroundImage"] +'); background-size: cover;';
    styles += '"';
    return styles;*/
    return getStyleExtBackground(itemExtSubmenu["Background"], itemExtSubmenu["BackgroundImage"], data, 2);
}

var getIconBoxPaddingTop = function (iconBoxPadding) {
    var itemExtIconBox = Helper.HTML.parsePaddingMargin(iconBoxPadding);
    return itemExtIconBox.top;
}

var getIconboxStyle = function ( color, padding, radius ) {
    if( color == "" )
        return "";
    var styleCSS = "";
    styleCSS += 'background-color:' + color + ';';
    if( padding != "") {
        styleCSS += Helper.HTML.formatPaddingTRBL(Helper.HTML.parsePaddingMargin(padding));
        styleCSS += ' display: inline-block; ';
    }
    if( radius != "")
        styleCSS += 'border-radius:' + String(radius).strReplace("px", "").strReplace("pt", "") + 'px';
    return styleCSS;
}



var getItemExClassOfKind = function ( itemKind ) {
    if( itemKind == NAVIGLOBAL['ITEM_KINDS']['ICON_IMAGE_TEXT'] )
        return " kind-icon-image-text ";
    if( itemKind == NAVIGLOBAL['ITEM_KINDS']['GROUP_TITLE'] )
        return " kind-group-title ";
    if( itemKind == NAVIGLOBAL['ITEM_KINDS']['BLANK_SPACE'] )
        return " kind-blank-space ";
    if( itemKind == NAVIGLOBAL['ITEM_KINDS']['BIG_IMAGE_TEXT'] )
        return " kind-big-image-text ";
    if( itemKind == NAVIGLOBAL['ITEM_KINDS']['CUSTOM_HTML'] )
        return " kind-custom-html ";
    if( itemKind == NAVIGLOBAL['ITEM_KINDS']['BUTTON'] )
        return " kind-button ";
}

var getPublishClassed = function ( itemExtIsPublished, itemExtHideWhenLogined, itemExtShowWhenLogined, itemExtAttr ) {
    var combinedClass = " ";
    if( itemExtIsPublished != 1 )
        combinedClass += "publish-hide ";
    if( itemExtHideWhenLogined == 1 )
        combinedClass += "publish-hide-logined ";
    if( itemExtShowWhenLogined == 1 )
        combinedClass += "publish-show-logined ";

    if( itemExtAttr != "" ) {
        var hidePages = Menu.Item.getHidePages(parseAttributes(decodeQuery( itemExtAttr )));
        if( hidePages.length != 0 ) {
          let currentTemplate = getCurrentTemplate();
            
          if (hidePages.includes(currentTemplate)) 
            combinedClass += "publish-hide ";
        }
    }

    if( combinedClass.trim() == "" )
        return "";
    return combinedClass;
}

var getAnimationClass = function ( itemExtAnimation ) {
    if( itemExtAnimation != "" )
        return " animate__animated " + itemExtAnimation;
    return "";
}

var collectStyles = function(styleArray) {
    
    let combinedStyle = ' style="';

    for (var i = 0; i < styleArray.length; i++) {
        if (!styleArray[i]) continue; // Bỏ qua nếu là null, undefined hoặc chuỗi rỗng
        let styles = styleArray[i].replace(/style="|"/g, '');
        combinedStyle += styles;
    }

    combinedStyle += '"';
    return removeExtraSpaces(combinedStyle);
};

var collectClasses = function (classesArray) {
    if (!Array.isArray(classesArray) || classesArray.length === 0) {
        return '';
    }

    let combinedClasses = '';

    for (let i = 0; i < classesArray.length; i++) {
        if (typeof classesArray[i] !== 'string' || !classesArray[i].trim()) continue; // Bỏ qua giá trị không phải string hoặc rỗng
        let cleanedClasses = classesArray[i].split(/[ ,;|.]+/).filter(Boolean).join(' ');
        combinedClasses += cleanedClasses + ' ';
    }

    return removeExtraSpaces(combinedClasses.trim());
};

var getStyleExtAlign = function (itemExtAlign) {
    var style = ' style="';
    if( itemExtAlign != "inherit") style += ' text-align: '+ itemExtAlign +'; ';
    style += '" ';
    if( style.trim() == 'style=""' )
        return '';
    return style;
}

var getClassesExtAlign = function (itemExtAlign) {
    var style = ' ';
    if( itemExtAlign != "inherit") style += ' align-' + itemExtAlign + ' ';
    if( style.trim() == 'style=""' )
        return '';
    return style;
}

var getStyleExtBackground = function (itemExtBackgroundColor, itemExtBackgroundImage, data, menuLevel = 1) {
    var style = ' style="';

    if (itemExtBackgroundImage != "") {
        if( itemExtBackgroundImage.includes("?") ) {
            // Xử lý duy nhất trường hợp có opacity cho background Image
            var bg = itemExtBackgroundImage.split("?");
            var bgImage = bg[0];
            var bgOpacity = parseInt( bg[1] );

            if( bgOpacity != 0 ) {
                if( itemExtBackgroundColor == "") {
                    if(menuLevel == 1)
                        itemExtBackgroundColor = data["setting"]['backgroundColor'];
                    else
                        itemExtBackgroundColor = data["setting"]['submenuBackgroundColor'];
                }
                style += ' background-image: url(\'' + bgImage + '\'); background-size: cover; background-position: initial; ';
                style += ' background-color: ' + hexToRgba(itemExtBackgroundColor, 1 - (bgOpacity / 100)) + '; background-blend-mode: hue; ';
            }else {
                style += ' background-color: '+ itemExtBackgroundColor +'; ';
            }
        }else {
            style += ' background-color: '+ itemExtBackgroundColor +'; ';
            style += ' background-image: url('+ itemExtBackgroundImage +'); background-size: cover;';
        }
    }else
    { // Nếu ko có background thì dùng màu bình thường.
        if (itemExtBackgroundColor != "")
            style += ' background-color: '+ itemExtBackgroundColor +'; ';
    }


/*
    if( itemExtBackgroundColor != "") style += ' background-color: '+ itemExtBackgroundColor +'; ';
    if( itemExtBackgroundImage != "") style += ' background-image: url('+ itemExtBackgroundImage +'); background-size: cover;';

*/


    style += '" ';
    if( style.trim() == 'style=""' )
        return '';
    return style;
}

var getStyleExtText = function (itemExtTextColor, itemExtTextSize) {
    var style = ' style="';
    if( itemExtTextColor != "") style += ' color: '+ itemExtTextColor +'; ';
    if( itemExtTextSize != "") style += ' font-size: '+ itemExtTextSize +'px; ';
    style += '" ';
    if( style.trim() == 'style=""' )
        return '';
    return style;
}

var getStyleExtIcon = function (itemExtIconColor, itemExtIconSize, itemExtIconboxStyle = "", itemExtIconBoxPaddingTop = 0) {
    var style = ' style="';
    if( itemExtIconColor != "") style += ' color: '+ itemExtIconColor +'; ';
    if( itemExtIconSize != "") {
        style += ' font-size: ' + itemExtIconSize + 'px;';

        // Logic: Nếu có iconBox thì sẽ ko fix cái chiều cao của icon
        if( itemExtIconBoxPaddingTop == 0 )
            style += ' height: ' + itemExtIconSize + 'px; ';
        /*if( itemExtIconBoxPaddingTop != 0 )
            style += ' z-index:10; ';*/
    }

    if( itemExtIconboxStyle != "" ) style += itemExtIconboxStyle;
    style += '" ';
    if( style.trim() == 'style=""' )
        return '';
    return style;
}

var getExtPosition = function (item) {
    var position = getExtVariable(item, "position", 1);
    var style = ' style="';

    /** Logic: Nếu như mà width layout ko phải là fix hay là hug thì position không thêm vào ko sẽ bị lỗi */
    var widthLayout = getExtVariable(item, "widthlayout", 1);
    if( widthLayout != 14 && widthLayout != 20 ) {
        return "";
    }
    /******************************************************************************************************/

    if (position == 2)
        style += "position: absolute; margin-left: auto; margin-right: auto; left: 0; right: 0; text-align: center;z-index: 0; ";
    if (position == 3)
        style += "position: absolute; right: 0; text-align: right; ";
    if (position == 4)
        style += "position: absolute; left: 0; text-align: left; ";

    style += '" ';
    if (style.trim() == 'style=""')
        return '';
    return style;
}

var getGridItemDataAttrs = function(item) {
    var wl = getExtVariable(item, "widthlayout", 1);
    var attrs = ' data-widthlayout="' + wl + '"';
    if (wl == 14) attrs += ' data-widthfix="' + (getExtVariable(item, "widthfix", "") || "") + '"';
    return attrs;
};

var getScaleRatio = function(setting) {
    var ratio = 1;
    var scaleToDesktop = "1x";
    if (setting && isHadValue(setting['scaleToDesktop']) && setting['scaleToDesktop'] != "") 
        scaleToDesktop = setting['scaleToDesktop'];

    if (window.innerWidth >= 769)
    if( scaleToDesktop != "1x" ) {
        if( scaleToDesktop == "1.5x" )
            ratio = 1.5;
        else if( scaleToDesktop == "2x" )
            ratio = 2;
        else if( scaleToDesktop == "2.5x" )
            ratio = 2.5;
        else if( scaleToDesktop == "3x" )
            ratio = 3;
    }
    return ratio;
}

var getExtWidth = function( item, menuKind, setting ) {
    var widthLayout = getExtVariable(item, "widthlayout", 1);
    var itemExtWidth = "";            

    if( widthLayout == 1 ) itemExtWidth = "";
    if( widthLayout == 2 ) itemExtWidth = "8.3333333333%";
    if( widthLayout == 3 ) itemExtWidth = "16.6666666666%";
    if( widthLayout == 4 ) itemExtWidth = "25%";
    if( widthLayout == 5 ) itemExtWidth = "33.3333333333%";
    if( widthLayout == 6 ) itemExtWidth = "41.6666666666%";
    if( widthLayout == 7 ) itemExtWidth = "50%";
    if( widthLayout == 8 ) itemExtWidth = "58.3333333333%";
    if( widthLayout == 9 ) itemExtWidth = "66.6666666666%";
    if( widthLayout == 10 ) itemExtWidth = "75%";
    if( widthLayout == 11 ) itemExtWidth = "83.3333333333%";
    if( widthLayout == 12 ) itemExtWidth = "91.6666666666%";
    if( widthLayout == 13 ) itemExtWidth = "100%";

    if( widthLayout == 15 ) itemExtWidth = "10%";
    if( widthLayout == 16 ) itemExtWidth = "20%";
    if( widthLayout == 17 ) itemExtWidth = "50%";
    if( widthLayout == 18 ) itemExtWidth = "100%";

    if( window.innerWidth >= 769 ) 
        if( menuKind == NAVIGLOBAL['MENU_KINDS']['SECTION_MOBILE_GRID'] )
    {
        var ratio = getScaleRatio(setting);
        if(typeof itemExtWidth === 'string' && itemExtWidth.endsWith('%')) {
            var numericWidth = parseFloat(itemExtWidth);
            itemExtWidth = (numericWidth / ratio) + "%";
        } else {
            itemExtWidth = parseFloat(itemExtWidth) / ratio + "%";
        }
    }

    if( widthLayout == 14 ) {
        var widthfix = getExtVariable(item, "widthfix", "");
        if (widthfix != "")
            itemExtWidth = String(widthfix).replace("pt", "").replace("px", "") + "px";
    }

    if( widthLayout == 20 ) itemExtWidth = "auto";

    var itemExtWidthStyle = "";
    var itemExtWidthClass = "";

    if( itemExtWidth != "" ) {
        itemExtWidthStyle = ' width: ' + itemExtWidth + ';';
        itemExtWidthClass = ' widthfix ';
        if( itemExtWidth == "auto" )
            itemExtWidthClass += ' widthauto ';
    }

    return {
        'width': itemExtWidth,
        'style' : itemExtWidthStyle,
        'class' : itemExtWidthClass
    };

}

function isString(value) {
    return typeof value === 'string' || value instanceof String
}

var getExtVariable = function( item, varName, defaultValue  ) {
    if( item[varName] != null ) {
        var val = item[varName];
        if( isString(val) )
            val = val.trim();

        val = platformValue( val );

        return val;
    }
    return defaultValue;
}

var getItemHighlight = function(data) { // Chỉ phục vụ cho loại highlight
    var highLightItem = 0;

    if (data["setting"]['layout'] == NAVIGLOBAL['LAYOUT']['HIGHLIGHT']) {
        if (data["dragdrop"].length == 7 || data["dragdrop"].length == 5 || data["dragdrop"].length == 3)
            highLightItem = (data["dragdrop"].length + 1) / 2;
    }
    return highLightItem;
}

var getItemKind = function (item) {
    var itemKind = 1;
    if(  item["kind"] != null )
        itemKind = item["kind"];
    return itemKind;
}

var getItemDivider = function (item) {
    var divider = 0;
    if(  item["divider"] != null )
        divider = item["divider"];
    return divider;
}

var getItemIsParent = function( item ) {
    var itemIsParent = false;
    if (typeof (item["children"]) !== 'undefined')
        if (item["children"].length > 0)
            itemIsParent = true;
    return itemIsParent;
}

var getItemShowBadgeMode = function (item) {
    var itemShowBadgeMode = BADGE_HIDE;
    if (item["badge"] == 1) {
        if( isHadValue (item["badgeiscart"]) ) {
            if (item["badgeiscart"] == 0)
                itemShowBadgeMode = BADGE_HIDE;
            else {
                itemShowBadgeMode = BADGE_ISCART_WITHCOUNT;
            }
        }else
            itemShowBadgeMode = BADGE_DOT;
    }
    return itemShowBadgeMode;
}

var getItemClickTelSMS = function (isTel, isSMS, item_url) {
    var html = " ";
    if( isTel || isSMS ) {
        html += '<a href="' + encodeBody(item_url.strReplace('[url]', window.location.href)) + '">';
        html += '<span class="telsms-click-spaces"></span>'
        html += '</a>';
    }
    return html;
}

var getItemExClassOfBadge = function (item) {
    var item_css = " ";
    if (item["badge"] == 1) {
        item_css += " item_badge";
        if( isHadValue (item["badgeiscart"]) ) {
            if (item["badgeiscart"] == 1) {
                item_css += " item_badge_withcount ";
                if (item["badgecartcount"] == 1)
                    item_css += "";
                else
                    item_css += " item_badge_withcount item_badge_withcount_hide";
            }
        }
    }
    else
        item_css += ""; // Do nothing
    return item_css;
};

var getChildExClassOfBadge = function (child) {
    var child_css = " ";
    if (child["badge"] == 1) {
        child_css += " child_badge";
        if( isHadValue (child["badgeiscart"]) ) {
            if (child["badgeiscart"] == 1) {
                child_css += " child_badge_withcount ";
                if (child["badgecartcount"] == 1)
                    child_css += "";
                else
                    child_css += " child_badge_withcount child_badge_withcount_hide";
            }
        }
    }
    else
        child_css += ""; // Do nothing
    return child_css;
};

var isOpenInbox = function ( item_url ) {
    if( item_url.length == 10 ) // open:Inbox
        if( item_url.substring(0, 10).toLowerCase() == "open:inbox" )
            return true;
    return false;
};

var isItemTel = function ( item_url ) {
    if( item_url.length >= 4 ) // tel
        if( item_url.substring(0, 4).toLowerCase() == "tel:" )
            return true;
    return false;
};

var isItemSMS = function ( item_url ) {
    if( item_url.length >= 4 ) // sms
        if( item_url.substring(0, 4).toLowerCase() == "sms:" )
            return true;
    return  false;
}

        /*****************************************************************************************************************/
        // Phải chờ đến khi vẽ được Embeded ID thì mới vẽ menu
        /*****************************************************************************************************************/

        /**
         * Vẽ lại menu nhiều lần nếu bị mất container/DOM do site bên ngoài can thiệp.
         * 1. Vẽ lần đầu.
         * 2. Lặp kiểm tra, nếu mất div/hoặc bị xoá nội dung thì vẽ lại.
         * 3. Hết timeout thì dừng.
         */
        var callDrawLoop = function(
            publishToPlaceKind, el_item, divNaviItem,
            naviItem, embed_id, shop, data, isNaviSection,
            section_setting, menuKind, menuKindClass, response,
            isPublishToPlace, naviman_app,
            durationMs = 10000, intervalMs = 300
        ) {
            // 1. Lấy id menu cần vẽ (ưu tiên lấy từ naviItem, fallback về embed_id)
            const id = (naviItem && naviItem.embed_id) ? naviItem.embed_id : embed_id;
            if (!id) {
                navidebug.warn('❗ Không có embed_id');
                return;
            }

            // 2. Hàm vẽ 1 lần: Tạo element mới & replace vào đúng chỗ
            const drawOnce = () => {
                navidebug.log('🎨 Draw_toEmbedIDCSSSelector →', id);
                try {
                    var newElement = Helper.getNewElementReplaceInsert(divNaviItem);        
                    Helper.deployReplaceInsertMode(publishToPlaceKind, el_item, newElement);                                          
                    Draw_toEmbedIDCSSSelector(
                        naviItem, embed_id, shop, data, isNaviSection,
                        section_setting, menuKind, menuKindClass, response,
                        isPublishToPlace, naviman_app
                    );
                } catch (e) {
                    navidebug.error('💥 Lỗi khi draw:', e);
                }
            };

            drawOnce(); // Vẽ phát đầu tiên

            // 3. Lặp kiểm tra nếu bị mất container hoặc bị site khác xoá nội dung thì tự phục hồi
            const start = Date.now();
            const timer = setInterval(() => {
                const elapsed = Date.now() - start;
                if (elapsed > durationMs) { // Hết thời gian thì dừng vòng lặp
                    clearInterval(timer);
                    navidebug.log('⏱️ Stop call callDrawLoop (only for replace/insert mode) loop after', durationMs, 'ms');
                    return;
                }

                const el = document.getElementById(id);

                // Nếu container bị xoá khỏi DOM → vẽ lại luôn
                if (!el) {
                    navidebug.error('⚠️ Container MẤT, re-draw →', id);
                    drawOnce();
                    return;
                }

                // Nếu nội dung container bị rỗng (có thể bị bug hoặc bị bên ngoài xoá nội dung)
                if (!el.innerHTML || el.innerHTML.trim() === '') {
                    navidebug.error('⚠️ Nội dung rỗng, re-draw →', id);
                    drawOnce();
                    return;
                }

            }, intervalMs);
        };




        var Draw_toEmbedIDCSSSelector = function(naviItem, embed_id, shop, data, isNaviSection, section_setting, menuKind, menuKindClass, response, isPublishToPlace, naviman_app ) {

            var naviman_appItem = document.getElementById(naviItem["embed_id"]);                

            if (naviman_appItem) {
                naviman_appItem.classList.add('naviman_layout' + data["setting"]['layout']); 
                            
                generateCSS(naviman_appItem, naviItem["embed_id"], data["setting"], data["dragdrop"], isNaviSection, section_setting, menuKind);

                // Add visit call to server by increasing the file count
                if (!Helper.Env.isBackendMode()) {
                    Helper.deferCall(() => {
                        logGAEvent("navi_visit", { navi_embed_id: naviItem["embed_id"] });
                    });

                    // TODO: Tối ưu sau khi đưa lên Cloudflare
                    /* 
                    Helper.deferCall(() => {
                        jsonp(naviplusAppUrl + 'logWH.php?action=updateVisit' + '&shop=' + shop)
                            .catch(() => {}); // Bắt lỗi thay vì .then() rỗng
                    }); */
                }                

                naviman_appItem.insertAdjacentHTML('beforeend',
                    generateMenu(data, naviItem, isNaviSection, section_setting, menuKind)
                );

                // Fix cho section
                if( Helper.isSectionMenu( embed_id, section_setting ) )  {
                    
                    Menu.Section.fixCSS_ResetBotomTop( naviman_appItem, shop, naviItem["embed_id"], section_setting );
                    Menu.Section.fixCSS_Megamenu_desktop( naviman_appItem, shop, naviItem["embed_id"], section_setting, menuKind );

                    // Logic: Tìm đến section class gần nhất trên Shopify để đổi style -> Có thể có rủi ro nếu ko tìm thấy
                    if( isNaviSection )
                        Menu.Section.fixCSS_SectionParent( naviman_app, response[0], embed_id, section_setting, menuKind );
                }

                // Đánh dấu là đã generate xong CSS và page đã load đến dòng này. 
                if( Helper.isMultiSite(section_setting) )
                    Helper.HTML.addLoadedFSAtBodyEnd('<style> :root ' +' { --loaded-'+  naviItem["embed_id"] +': 1 } </style>', 20);
                else 
                    Helper.HTML.addStyleToMenuAfterEnd( naviman_appItem, ' :root ' +' { --loaded-'+  naviItem["embed_id"] +': 1 } ' );

                Draw_waitToLoad(naviItem, embed_id, shop, data, isNaviSection, section_setting, menuKind, menuKindClass, response, isPublishToPlace, naviman_app );
                
                Menu.Item.checkNaviClick( naviItem["embed_id"] );     

                if( naviItem["data"]["setting"]["envVars"] != null )
                    Helper.ENV_VARS.proceedEnvVars( naviItem["data"]["setting"]["envVars"], naviItem["embed_id"] ); 
                       

                callbackPublicFunc_delay(drawBottomNav, naviItem["embed_id"]);                   
            } // if (naviman_appItem)
            else 
            navidebug.warn("Can not find (Maybe Insert/replace id be wrong):", naviItem["embed_id"]);                  
        };

        /*****************************************************************************************************************/
        // Chờ đến khi CSS được tải về ở cuối của website thì mới hiện ra.
        /*****************************************************************************************************************/
        var Draw_waitToLoad = function(naviItem, embed_id, shop, data, isNaviSection, section_setting, menuKind, menuKindClass, response, isPublishToPlace, naviman_app ) {
            Helper.waitForCssToLoad(() => {

                Helper.CLS.showNavimanApp();

                var isStartVisibility = true;
                
                if (Menu.Context.isDisplayTrigger(menuKindClass, naviItem)) 
                    isStartVisibility = false;
                
                if (Helper.Env.isBackendMode())
                    isStartVisibility = true;
            
                if (isStartVisibility) {
                    Helper.closeAllDropdowns(); // Đóng hết lại để đảm bảo ko có dropdown nào tự động mở

                    Helper.HTML.addStyleToHeader(
                        '#' + naviItem["embed_id"] + ' { visibility: visible !important; }'
                    );

                    /* if (document.getElementById('naviman_app') && getComputedStyle(document.getElementById('naviman_app')).display === "none") {
                        navihelper.reportSteps("===STEP 5=============================================================");
                        navihelper.reportSteps("Draw_waitToLoad() chờ CSS được tải về ở cuối của website thì mới hiện ra (#embed_id visibility: visible), #naviman_app display: block.");    
                    }
                    
                    Helper.CLS.showNavimanApp(); */
                }
                                
                
                if( Helper.isMultiSite(section_setting) ) {
                    Helper.waitForVar__Loaded_SF(naviItem.embed_id, function () {
                        Menu.Common.displayNaviItem_Container(menuKindClass, naviItem.embed_id, true);
                    });
                } else {
                    Menu.Common.displayNaviItem_Container( menuKindClass, naviItem.embed_id, false );
                }       

                if (menuKind == NAVIGLOBAL['MENU_KINDS']['SECTION_MOBILE_MEGAMENU']) {
                    requestAnimationFrame(function() {
                        requestAnimationFrame(function() {
                            Menu.Section.optimizeMobileMegamenuNavigationWidth(naviItem.embed_id);
                        });
                    });
                }
                
                
                if( isPublishToPlace == true )
                    Menu.Section.updatePublishToPlaceZIndex(naviItem.embed_id);
                                                                                            
            }, section_setting);            
        }
        /*****************************************************************************************************************/

        var isNaviSection = false;
        
        response.forEach((naviItem) => {

            isNaviSection = (embed_id != '' );
            
            /* Thêm vào 1 Queue để đảm bảo không lặp lại */
            addNaviItemToQueue(naviItem);
            
            //*********************************************************************** */
            
            var menuKind = fixMenuKind; 
            if( menuKind == 0 ) // Nếu như ko phải là simulator                
                menuKind = naviItem["menuKind"];
            var menuKindClass = getMenuKindStringById(menuKind);

            var isDisplayed = true;            

            /*****************************************************************************************************************/
            if( menuKindClass == "CONTEXT_SLIDE" ) {
                if( !Helper.Env.isBackendMode() ) {
                    Menu.Context.checkTriggerIDClass(isDisplayed, naviItem);
                    isDisplayed = isDisplayed && Menu.Common.shouldDrawForResponsive(naviItem);
                }

                if( !Menu.Context.isDisplayTrigger(menuKindClass, naviItem) ) 
                    isDisplayed = false;

                if( Helper.Env.isBackendMode() ) {
                    isDisplayed = true;
                }
            }
            
            /*****************************************************************************************************************/
            if (["STICKY_TABBAR", "STICKY_MOBILE_HEADER", "STICKY_FAB_SUPPORT"].includes(menuKindClass)) {
                if (!Helper.Env.isBackendMode()) {
                    isDisplayed = Menu.Common.checkContainKeywords(isDisplayed, naviItem);
                    isDisplayed = Menu.Sticky.checkStickyDisplay(isDisplayed, naviItem, isNaviSection);
                    isDisplayed = isDisplayed && Menu.Common.shouldDrawForResponsive(naviItem);
                }
            }

            /*****************************************************************************************************************/
            var isPublishToPlace = false;
            var publishToPlaceClass = "";

            if ( ["SECTION_MOBILE_HEADER", "SECTION_MOBILE_MEGAMENU", "SECTION_MOBILE_GRID", "SECTION_MOBILE_BANNER", "SECTION_DESKTOP_MEGAMENU"].includes(menuKindClass) ) {
                if (!Helper.Env.isBackendMode()) {
                    isDisplayed = Menu.Common.checkContainKeywords(isDisplayed, naviItem);
                    if (menuKindClass == "SECTION_MOBILE_GRID")
                        isDisplayed = Menu.Common.checkPlatformMode(isDisplayed, naviItem);
                    else
                        isDisplayed = isDisplayed && Menu.Common.shouldDrawForResponsive(naviItem);
                                
                    if (isDisplayed) {
                        isPublishToPlace = Menu.Section.checkPublicToPlace(naviItem);
                        isNaviSection = isPublishToPlace || isNaviSection;
                    }
                   isDisplayed = Menu.Section.checkSectionPublishWays(isDisplayed, naviItem, embed_id, isPublishToPlace);

                }                
            }

            /*****************************************************************************************************************/
            // Kiểm tra xem nếu là multisites ko đạt thì isDisplayed = false
            if( section_setting['env'] == "shopify" && Helper.MultiSite.isInvalidEmbed(naviItem["data"]["setting"], section_setting) ) {
                isDisplayed = false;
            }

            if( section_setting['env'] != "shopify" && Helper.Env.isInvalidEmbed(section_setting) ) {
                isDisplayed = false;
            }
            

            /******** Nếu là backend mode thì sẽ không coi là Section, chỉ coi là nhúng bình thường thôi *******************/
            if (Helper.Env.isBackendMode())
                isNaviSection = false;

            /*****************************************************************************************************************/

            if( isDisplayed )
                Helper.Debug.writeBeautifyConsoleLog( "\uD83D\uDE01 Navi+: " + naviItem["embed_id"] + " (" +  menuKindClass + ") display: " + isDisplayed, "green" );
            else 
                Helper.Debug.writeBeautifyConsoleLog( "Navi+: " + naviItem["embed_id"] + " (" +  menuKindClass + ") display: " + isDisplayed, "red" );

            /******** Nếu chỉ dành cho internal Navi+ thì luôn hiện *******************/
            if (Helper.Env.isInternalUsed( naviItem["embed_id"] ))
                isDisplayed = true; 


            // BẮT ĐẦU HIỂN THỊ NẾU ISDISPLAY  ******************************************************************************
            if (isDisplayed) {

                let data = naviItem["data"];

                Menu.Common.initHTMLAppOverlayClasses();

                var embedMarginStyle = Menu.Section.getStyleSectionMargin(section_setting);

                var attribute = "";
                var setting = naviItem["data"]["setting"] || {};

                // Expand / collapse effect: default 1 (Top-down expand) when not defined
                var expandEffect = 1;
                if (typeof setting["expandEffect"] !== "undefined" && setting["expandEffect"] !== null && setting["expandEffect"] !== "") {
                    var parsedExpand = parseInt(setting["expandEffect"], 10);
                    if (!isNaN(parsedExpand) && parsedExpand > 0) {
                        expandEffect = parsedExpand;
                    }
                }

                /**
                 * Kiểm tra settingAttribute có được phép apply cho platform hiện tại hay không.
                 *
                 * Rule:
                 * - Chỉ mobile   (mobileDisplay=true, desktopDisplay=false): chỉ nhúng attribute trên viewport mobile (<= 768px).
                 * - Chỉ desktop  (mobileDisplay=false, desktopDisplay=true): chỉ nhúng attribute trên viewport desktop (>= 769px).
                 * - Cả 2         (cả 2 true)                              : luôn nhúng attribute.
                 * - Không platform (cả 2 false)                           : không nhúng attribute.
                 *
                 * @param {Object} setting
                 * @returns {boolean}
                 */
                var shouldApplyAttributeForCurrentPlatform = function(setting) {
                    var hasMobile = (setting["mobileDisplay"] === true || setting["mobileDisplay"] === "true");
                    var hasDesktop = (setting["desktopDisplay"] === true || setting["desktopDisplay"] === "true");

                    if (!hasMobile && !hasDesktop) return false;

                    var viewportWidth = window.innerWidth || document.documentElement.clientWidth || 0;
                    var isMobileViewport = viewportWidth <= 768;
                    var isDesktopViewport = viewportWidth >= 769;

                    var isMobileOnly = hasMobile && !hasDesktop;
                    var isDesktopOnly = hasDesktop && !hasMobile;

                    if (isMobileOnly) return isMobileViewport;
                    if (isDesktopOnly) return isDesktopViewport;
                    // hasMobile && hasDesktop
                    return true;
                };

                if (shouldApplyAttributeForCurrentPlatform(setting) && setting["attribute"] != null)
                    attribute = formatAttributes(parseAttributes(setting["attribute"]));

                // If expandEffect = 2, force ui="slide-horizontal" for slide context menus.
                // hamburgerSubDirection 4 (or 0 = unset, backward compat): mobile + desktop both slide-horizontal.
                // hamburgerSubDirection 1-3: mobile = slide-horizontal, desktop = chosen sub-direction (NOT slide-horizontal).
                if (menuKindClass == "CONTEXT_SLIDE" && expandEffect == 2) {
                    var _subDirForUi = parseInt(setting["hamburgerSubDirection"] || 0);
                    var _isDesktopNow = window.innerWidth > 768;
                    // Skip ui="slide-horizontal" on desktop when hamburgerSubDirection is 1–3
                    var _skipSlideH = _isDesktopNow && _subDirForUi >= 1 && _subDirForUi <= 3;
                    if (!_skipSlideH && attribute.indexOf('ui="') === -1) {
                        attribute = (attribute ? attribute + ' ' : '') + 'ui="slide-horizontal"';
                    }
                }

                if( isPublishToPlace == true ) {
                    publishToPlaceClass = " publishToPlace ";
                } 

                var divNaviItem = '<div style="visibility:hidden;'+ embedMarginStyle +'" '+ attribute +' name="' + naviItem["name"] + '" id="'+ naviItem["embed_id"] +
                    '" class="naviItem ' + publishToPlaceClass + naviItem["embed_id"] + menuPositionClass( data ) + menuSlidePositionClass(data, menuKind, naviItem["embed_id"]) + menuSlideDesktopSubDirection(data, menuKind) + ' ' + 
                    menuKindClass
                    + (menuKindClass == "SECTION_MOBILE_GRID" && data["setting"] ? ' data-scale-to-desktop="' + (data["setting"]["scaleToDesktop"] || "1x") + '"' : '')
                    + '"></div>';

                if( !Helper.Env.isBackendMode() ) 
                if( Helper.isMultiSite(section_setting) )    
                    divNaviItem = '<div class="naviItem_Container" style="display:none">' + divNaviItem + '</div>';
                                
                divNaviItem += Helper.CLS.hideNavimanApp(menuKindClass);


                /***************************************************************************************************************************
                 * REPLACMENT / INSERT MODE
                 ***************************************************************************************************************************/

                if( isPublishToPlace == true ) {                    
                    var elsIdClass = Helper.String.getFirstCSSSelector( naviItem["data"]["setting"]['publishToPlace'] );

                    elsIdClass = Helper.String.CSSSelectorPlatform( elsIdClass );
                    if( elsIdClass != "" ) {                        
                        // Chọn tất cả các phần tử khớp với chuỗi
                        var els = document.querySelectorAll(elsIdClass);

                        // Lặp qua các phần tử được chọn
                        els.forEach(function(el) {
                            

                            // publishToPlaceKind
                            var publishToPlaceKind = 1;
                            if( isHadValue( naviItem["data"]["setting"]['publishToPlaceKind'] ) )
                                publishToPlaceKind = naviItem["data"]["setting"]['publishToPlaceKind'];

                            (async () => {
                                try {
                                    if( publishToPlaceKind == "1" ) // replace
                                        await Helper.waitToReplaceInsert(el, divNaviItem, 'replace');
                                    if( publishToPlaceKind == "2" ) // insert after
                                        await Helper.waitToReplaceInsert(el, divNaviItem, 'after');
                                    if( publishToPlaceKind == "3" ) // insert before
                                        await Helper.waitToReplaceInsert(el, divNaviItem, 'before');  

                                        navidebug.log("Tiếp tục xử lý JS sau khi DOM đã được thay thế.");
                                    
                                    callDrawLoop(
                                        publishToPlaceKind, el, divNaviItem,
                                        naviItem, embed_id, shop, data, isNaviSection, section_setting, menuKind, menuKindClass, response, isPublishToPlace, naviman_app );              
                                    //Draw_toEmbedIDCSSSelector(naviItem, embed_id, shop, data, isNaviSection, section_setting, menuKind, menuKindClass, response, isPublishToPlace, naviman_app );                  
                                } catch (err) {
                                    navidebug.error("Can not find the CSS element:", err.message);
                                }
                            })();    

                        });
                    }                
                } // Replace / insert mode
                
                /***************************************************************************************************************************
                 * STICKY / SLIDE * OTHER MODES
                 ***************************************************************************************************************************/
                if( isPublishToPlace == false ) {
                    naviman_app.insertAdjacentHTML('beforeend', divNaviItem);
                    Draw_toEmbedIDCSSSelector(naviItem, embed_id, shop, data, isNaviSection, section_setting, menuKind, menuKindClass, response, isPublishToPlace, naviman_app );              
                }


            } // isDisplayed



        });

        navidebug.log(window.navimanData);

        // Nếu như cùng lúc section và sticky cùng bật thì loại bỏ sticky
        Menu.Section.hideDuplicateNavimanItems();

        // Đăng ký xử lý resize cho Slide menu (Tabbar, FAB, Mega, Grid dùng CSS)
        DeviceModeResize.init();
    };

    


    var Log = Log || {}; 

Log.saveLog = function(logShop, logToUrl, logFromUrl, logItemName, logEmbedId, logPlatform ) {

  if( logToUrl == "#" ) {
    navidebug.log("Log: To URL is #, not saving log");
    return;
  }

  let tranferData = {
      shop: logShop,
      to_url: logToUrl,
      from_url: logFromUrl,
      item_name: logItemName,
      embed_id: logEmbedId,
      platform: logPlatform
  };

  const params = new URLSearchParams(tranferData);

  logGAEvent("navi_click", 
    { navi_embed_id: logEmbedId,
      navi_to_url: logToUrl,
      navi_from_url: logFromUrl,
      navi_menu_item_name: logItemName
    }
  );

  Helper.deferCall(() => {
    jsonp(naviplusAppUrl + 'logWH.php?action=saveLog' + '&' + params.toString())
        .catch(() => {}); // Bắt lỗi thay vì .then() rỗng
  });  

  
};
    var standalizeFuncWillVar = function (str) {

    str = str.strReplace('"', '');
    str = str.strReplace("'", "");

    // 1. Add "" for var
    let result = '';
    let parenthesesStack = [];

    for (let i = 0; i < str.length; i++) {
        if (str[i] === '(' && (i === 0 || str[i - 1] !== '"')) {
            result += str[i] + '"';
            parenthesesStack.push('(');
        } else if (str[i] === ')' && (i === str.length - 1 || str[i + 1] !== '"')) {
            result += '"' + str[i];
            if (parenthesesStack.length > 0 && parenthesesStack[parenthesesStack.length - 1] === '(') {
                parenthesesStack.pop();
            } else {
                // Unbalanced parentheses
                return null;
            }
        } else {
            result += str[i];
        }
    }

    // Check for unbalanced parentheses
    if (parenthesesStack.length > 0) {
        return null;
    }

    return result;
}

var checkClickOnHovermenu = function(event, item, is_parent, url, embed_id, isNaviSection) {
    var eventType = (event && event.type) || "click"; // click or mouseenter

    var setting = getSettingOfNaviman( embed_id );         
    var desktopHover = isSettingBeTrue(setting['desktopHover']);
    if (window.innerWidth <= 768) desktopHover = false;    

    if( !desktopHover ) return;

    if( eventType == "click" ) {
        url = url.trim();
        if( url == "" )
            url = "#";          
        gotoUrl(event, item, false, url, embed_id, isNaviSection);
    }    
};

/* Tạo một thẻ a dạng <a href="#1234 để giả lập việc click vào link này */
var gotoHash = function(hash) {
    window.location.hash = hash;
    
    hash = String(hash).replace(/^#/, "");

    let a = document.querySelector(`a[href="#${hash}"]`);
    if (!a) {
        a = document.createElement("a");
        a.href = `#${hash}`;
        a.style.cssText = "position:absolute;left:0px;top:0px;width:1px;height:1px;overflow:hidden;opacity:0;";
        a.setAttribute("aria-hidden", "true");

        document.body.appendChild(a);
    }

    a.click();
};

var gotoUrl = function (event, item, is_parent, url, embed_id, isNaviSection) {

    event = event || {
        stopPropagation: function() {},
        preventDefault: function() {},
        type: 'click'
    };    

    var shopinfo = navihelper.windowVar.get('shopinfo');
    var menuKind = getMenuKindByHtml(embed_id); // getMenuKind(shopinfo, embed_id);    


    if( url != '#' )
        navidebug.log("gotoUrl: " + url);

    if (!is_parent) {
        if (Helper.Env.isBackendMode()) {
            if (url != "")
                showSnackbar("Link to: <u>" + url + "</u>");
            return false;
        }

        // khoipn

        let logShop = shopinfo["shop"];
        let logFromUrl = window.location.href;
        let logItemName = item.dataset.name;
        let logEmbedId = embed_id; // Lỗi ở đây rồi
        let logPlatform = "M";
        if (window.innerWidth > 768)
            logPlatform = "D";
        let openNewTab = false;

        if (url.toLowerCase().includes("@new")) {
            openNewTab = true;
            url = url.replace(/@new/gi, '');
        }

        if (url.substring(0, 13).toLowerCase() == "https://m.me/")
            openNewTab = true;
        if (url.substring(0, 14).toLowerCase() == "https://wa.me/")
            openNewTab = true;

        let logDomain = "https://" + window.location.hostname;

        url = url.trim();

        if (url == "") { // Home page
            Log.saveLog(logShop, logDomain, logFromUrl, logItemName, logEmbedId, logPlatform);
            if (openNewTab)
                window.open(logDomain);
            else
                window.location.href = logDomain;
        }

        if (url == "#") { // Do nothing
            Log.saveLog(logShop, url, logFromUrl, logItemName, logEmbedId, logPlatform);
            return false;
        }

        if (url.length > 1) {
            if (url.charAt(0) === "#") { // #gotoAnchor
                let cleanUrl = logFromUrl.replace(/#.*$/, ""); // Xoá hash cũ nếu có
                let logTo = cleanUrl + url;
            
                Log.saveLog(logShop, logTo, logFromUrl, logItemName, logEmbedId, logPlatform);
            
                /*if (window.location.hash === url) {
                    // Nếu hash mới trùng với hash hiện tại, xóa nó trước rồi đặt lại
                    window.history.replaceState(null, "", cleanUrl);
                    setTimeout(() => {
                        window.history.pushState(null, "", logTo);
                    }, 10);
                } else {
                    window.history.pushState(null, "", logTo);
                }*/

                gotoHash(url);
            
                return;
            }
            

            if (url.length >= 4) // tel
                if (url.substring(0, 4).toLowerCase() == "tel:") {
                    //window.open( url );
                    //window.location.href = url;
                    return false;
                }

            if (url.length >= 4) // sms
                if (url.substring(0, 4).toLowerCase() == "sms:") {
                    //window.open( url );
                    //window.location.href = url;
                    return false;
                }

            if (url.length >= 5) // open
                if (url.substring(0, 5).toLowerCase() == "open:") {

                    jsFunction = url.strReplace(':', '');
                    Log.saveLog(logShop, url, logFromUrl, logItemName, logEmbedId, logPlatform);

                    // Open NaviMenu
                    if (url.length >= 13)
                        if (url.substring(0, 13).toLowerCase() == "open:navimenu") {
                            const func = Menu.Context.splitTriggerFunction(jsFunction);
                            eval('naviman.' + func["functionName"] + '("' + func["variableName"] + '")');
                            return false;
                        }
                        
                    // Open ChangeLanguage
                    if (url.length >= 19)
                        if (url.substring(0, 19).toLowerCase() === "open:changelanguage") {
                            const func = Menu.Context.splitTriggerFunction(jsFunction);

                            const funcCall = func["variableName"]
                                ? `naviman.${func["functionName"]}("${func["variableName"]}")`
                                : `naviman.${func["functionName"]}()`;

                            eval(funcCall);
                            return false;
                        }                       

                    // Handle ClickTo
                    if (url.length >= 12 && url.toLowerCase().startsWith("open:clickto")) {
                        const func = Menu.Context.splitTriggerFunction(jsFunction);
                        const params = func["variableName"].split(",");

                        const elementSelector = params[0].trim();
                        const direction = params[1] ? params[1].trim().toLowerCase() : null;

                        const clickAction = () => naviman.clickToElement(elementSelector);

                        if (direction === "down") {
                            naviman.scrollBottom();
                            setTimeout(clickAction, 1000);
                        } else if (direction === "up") {
                            naviman.scrollTop();
                            setTimeout(clickAction, 1000);
                        } else {
                            clickAction(); // Execute immediately if no scroll direction
                        }

                        return false;
                    }

                    // Handle FocusTo
                    if (url.length >= 12 && url.toLowerCase().startsWith("open:focusto")) {
                        const func = Menu.Context.splitTriggerFunction(jsFunction);
                        const params = func["variableName"].split(",");

                        const elementSelector = params[0].trim();
                        const direction = params[1] ? params[1].trim().toLowerCase() : null;

                        const focusAction = () => naviman.focusToElement(elementSelector);

                        if (direction === "down") {
                            naviman.scrollBottom();
                            setTimeout(focusAction, 1000);
                        } else if (direction === "up") {
                            naviman.scrollTop();
                            setTimeout(focusAction, 1000);
                        } else {
                            focusAction(); // Execute immediately if no scroll direction
                        }

                        return false;
                    }



                    // Open other functions such as: openMobileMenu
                    // Nếu được gọi từ slide menu → đóng slide trước, sau đó mới chạy action.
                    var _slideMenuEl = item && item.closest ? item.closest(".naviItem.CONTEXT_SLIDE") : null;
                    if (_slideMenuEl) {
                        var _capturedJsFunc = jsFunction;
                        Animation.hamburgerClose(_slideMenuEl, {
                            doneCallback: function() {
                                Helper_lockBodyScroll(false);
                                var _og = document.querySelector(".naviman_app_overlay_global");
                                if (_og) _og.classList.remove("is-open");
                                naviman.Helper.hideNaviOverlay();
                                eval("naviman." + _capturedJsFunc)();
                            }
                        });
                        return false;
                    }
                    eval("naviman." + jsFunction)();
                    return false;
                }

            if (url.length >= 6) // share
                if (url.substring(0, 6).toLowerCase() == "share:") {
                    jsFunction = url.strReplace(':', '');
                    Log.saveLog(logShop, url, logFromUrl, logItemName, logEmbedId, logPlatform);
                    eval("naviman." + jsFunction)();
                    return false;
                }

            if (url.length >= 7) // scroll
                if (url.substring(0, 7).toLowerCase() == "scroll:") {
                    jsFunction = url.strReplace(':', '');

                    var isScrollOnPage = true;
                    if (url.length >= 10) if (url.substring(0, 10).toLowerCase() == "scroll:top")
                        isScrollOnPage = false;
                    if (url.length >= 13) if (url.substring(0, 13).toLowerCase() == "scroll:bottom")
                        isScrollOnPage = false;

                    if (isScrollOnPage)
                        jsFunction = standalizeFuncWillVar(jsFunction);

                    Log.saveLog(logShop, url, logFromUrl, logItemName, logEmbedId, logPlatform);

                    if (jsFunction.includes('(')) // Có biến
                        eval("naviman." + jsFunction);
                    else
                        eval("naviman." + jsFunction)();

                    return false;
                }

            if (url.length >= 7) // mailto
                if (url.substring(0, 7).toLowerCase() == "mailto:") {
                    window.open(url);
                    return false;
                }

            if (url.length >= 11) // javascript
                if (url.substring(0, 11).toLowerCase() == "javascript:") {
                    let jsFunction = url.substring(11, url.length);
                    jsFunction = jsFunction.strReplace('(', '').strReplace(')', '');

                    Log.saveLog(logShop, 'js/' + jsFunction, logFromUrl, logItemName, logEmbedId, logPlatform);
                    navidebug.log("Call function: " + jsFunction);

                    eval(jsFunction)();

                    event.preventDefault(); // Ko có tác dụng mấy
                    return false;
                }

            let isHadDomain = false;
            if (url.length >= 4)
                if (url.substring(0, 4).toLowerCase() == "http")
                    isHadDomain = true;

            if (!isHadDomain) {
                if (url.charAt(0) != "/")
                    url = "/" + url;
                url = logDomain + url;
            }

            Log.saveLog(logShop, url, logFromUrl, logItemName, logEmbedId, logPlatform);
            if (openNewTab) {
                if (url.substring(0, 14).toLowerCase() == "https://wa.me/") {
                    // TODO: Need to optimize
                    navidebug.log("Fixed for Whats App");
                    /* Mình sẽ mở lại một tab mới bình thường để hiển thị What's App */
                    // window.open(url, "WhatsApp", "width=200,height=100");
                    
                    openWhatsAppChat(url.substring(14, url.length));

                } else
                    window.open(url);
            } else
            /* URL THÔNG THƯỜNG **********************************/
            {
                redirectToUrl(url);
            }
        }
    } else {

        // Kiểm tra nếu như hover chuột và có click thì chuyển theo link
        checkClickOnHovermenu(event, item, is_parent, url, embed_id, isNaviSection);

        if (item.classList.contains("child")) {
            showLevel3Items_Common(item, isNaviSection, menuKind, embed_id, event);
            showLevel3Items_Desktop(item, isNaviSection, menuKind, embed_id, event);
        }
        else
            showLevel2Items(item, menuKind, embed_id, event);
    }

    // Tránh việc gọi ông con thì lại gọi thêm ông bố
    event.stopPropagation();
};

var redirectToUrl = function (url) {            
    window.location.href = url;

    // Nếu có dấu # thì reload sau 500ms
    if (url.includes('#')) {
        setTimeout(function () {
            location.reload();
        }, 500);
    }
}


var openWhatsAppChat = function(phone, message = "") {
    const isMobile = window.innerWidth <= 768;
    const encodedMessage = encodeURIComponent(message);
  
    const url = isMobile
      ? `https://wa.me/${phone}?text=${encodedMessage}`
      : `https://api.whatsapp.com/send?phone=${phone}&text=${encodedMessage}`;
  
    window.open(url, "_blank"); // luôn mở tab mới
};
  

var hideAllLevel3Items = function () {
    document.querySelectorAll('.naviman_app ul.children ul.children').forEach((item) => {
        item.style.display = "none";
    });
    document.querySelectorAll('.naviman_app .menu-expand-level2').forEach((item) => {
        item.classList.remove('menu-expand-level2', 'menu-expand');
    });
    /* slide-horizontal: ul nằm trong wrapper, cần ẩn wrapper để tránh lớp đè chặn click level 2 */
    document.querySelectorAll('.slide-horizontal-level3-wrapper').forEach((wrapper) => {
        wrapper.style.display = "none";
    });
};

var findIDofMenuItem = function (menuItem) {
    if (menuItem == null)
        return null;
    if (menuItem.parentElement == null)
        return null;
    if (menuItem.classList.contains("naviItem"))
        return menuItem.id;
    return findIDofMenuItem(menuItem.parentElement);
}



/**
 * positionContextSubMenu( ulChildren, referenceItem, referencePanel, isRightPanel )
 * Positions a submenu panel in "context menu" style beside its parent panel.
 *   - Horizontally: right of referencePanel (or left if isRightPanel)
 *   - Vertically: top aligns with referenceItem, clamped to viewport
 *   - If height > viewport: fills full height with scroll
 *
 * @param {Element} ulChildren     - submenu ul to position
 * @param {Element} referenceItem  - li that was clicked (for top alignment)
 * @param {Element} referencePanel - panel element to appear beside
 * @param {boolean} isRightPanel   - true if main slide panel is on the right side
 */
var positionContextSubMenu = function(ulChildren, referenceItem, referencePanel, isRightPanel) {
    if (!ulChildren || !referenceItem || !referencePanel) return;

    var panelRect = referencePanel.getBoundingClientRect();
    var vh        = window.innerHeight;

    // Đảm bảo position: fixed TRƯỚC KHI đọc itemRect.
    // Nếu ulChildren đang display:block với position:static thì nó nằm trong normal flow
    // làm panel cha (level 2) phình to → itemRect của referenceItem bị sai (lệch lên trên).
    // Set position:fixed trước để element ra khỏi flow, level 2 co về đúng kích thước,
    // sau đó mới đọc itemRect để có toạ độ chính xác.
    ulChildren.style.position = 'fixed';

    // Horizontal: beside the reference panel, same width, flush (no gap)
    ulChildren.style.width = panelRect.width + 'px';
    if (isRightPanel) {
        ulChildren.style.left  = 'auto';
        ulChildren.style.right = (window.innerWidth - panelRect.left) + 'px';
    } else {
        ulChildren.style.left  = panelRect.right + 'px';
        ulChildren.style.right = 'auto';
    }

    // Đọc itemRect SAU KHI đã set position:fixed — element đã ra khỏi normal flow,
    // panel cha không bị phình, itemRect.top của referenceItem chính xác.
    var itemRect = referenceItem.getBoundingClientRect();

    // Measure natural height — cần element visible để scrollHeight chính xác
    // Nếu đang display:none thì tạm show (visibility:hidden) để đo rồi restore
    var _wasHidden = ulChildren.style.display === 'none' || ulChildren.style.display === '';
    if (_wasHidden) {
        ulChildren.style.visibility = 'hidden';
        ulChildren.style.display    = 'block';
    }
    ulChildren.style.height    = 'auto';
    ulChildren.style.overflowY = '';
    var ulHeight = ulChildren.scrollHeight;
    if (_wasHidden) {
        ulChildren.style.display    = 'none';
        ulChildren.style.visibility = '';
    }

    if (ulHeight >= vh) {
        // Taller than viewport: fill and scroll
        ulChildren.style.top      = '0px';
        ulChildren.style.bottom   = 'auto';
        ulChildren.style.height   = vh + 'px';
        ulChildren.style.overflowY = 'auto';
    } else {
        var top = itemRect.top;
        if (top < 0) top = 0;
        if (top + ulHeight > vh) {
            // Overflows bottom: anchor to bottom instead
            ulChildren.style.top    = 'auto';
            ulChildren.style.bottom = '0px';
        } else {
            ulChildren.style.top    = top + 'px';
            ulChildren.style.bottom = 'auto';
        }
    }
};

/**
 * positionSlideSidePanel( submenuElement, embed_id )
 * Đặt vị trí submenu level 2 dạng full-height side panel (hamburgerSubDirection == 2) trên desktop.
 * - Dùng getBoundingClientRect() để đọc width thực tế sau khi CSS đã áp dụng.
 * - isRight đọc từ setting để tránh class chưa sync gây sai nhánh.
 *
 * @param {Element} submenuElement - ul.children level 2 cần đặt vị trí
 * @param {string}  embed_id       - ID của naviItem (.naviItem.CONTEXT_SLIDE)
 */
var positionSlideSidePanel = function(submenuElement, embed_id) {
    var menu       = document.getElementById(embed_id);
    var panelRect  = menu.getBoundingClientRect();
    var setting    = getSettingOfNaviman(embed_id);
    var isRight    = parseInt((setting && setting["hamburgerPosition"]) || 1) === 2;
    var panelWidth = panelRect.width;
    submenuElement.style.position  = 'fixed';
    submenuElement.style.top       = '0px';
    submenuElement.style.height    = '100%';
    submenuElement.style.overflowY = 'auto';
    submenuElement.style.width     = panelWidth + 'px';
    if (isRight) {
        submenuElement.style.left  = 'auto';
        submenuElement.style.right = panelWidth + 'px';
    } else {
        submenuElement.style.left  = panelWidth + 'px';
        submenuElement.style.right = 'auto';
    }
};

var showLevel3Items_Common = function (menuItem, isNaviSection, menuKind, embed_id, event) {

    var isOnMobile = (window.innerWidth <= 768);

    // Hide menu level 3 ======================
    if (!isOnMobile) {
        var is_showing = true;
        if (menuItem != null)
            is_showing = (menuItem.querySelector('ul.children').style.display === "block");
        if (is_showing) {
            menuItem.querySelector('ul.children').style.display = "none";
            menuItem.classList.remove("menu-expand");
            menuItem.classList.remove("menu-expand-level2");
            return;
        }
    }
    // Hide menu level 3 ======================

    // Fix cho việc expand nội bộ từ level 3
    var isInnerExpand = false;
    if (isOnMobile)
        isInnerExpand = true;

    if (Menu.Context.isSlideMenuHorizontal(menuKind, embed_id)) {
        isInnerExpand = false;
    }    

    var ulParent = menuItem.parentElement;

    // Target ul.children[menulevel="2"] or menulevel="3"
    let ulChildrent = menuItem.querySelector('ul.children[menulevel="2"]') ||
                      menuItem.querySelector('ul.children[menulevel="3"]');

    if (!ulChildrent) {
        return;
    }

    /*******************************************
    Đây là dành riêng cho inner expand (nhất là TABBAR và Mobile Mega menu), có overlay xám và icon back.
    */
    if (!Menu.Context.isSlideMenu(menuKind))
        if (isInnerExpand) {
            var liTitle = document.createElement("li");
            liTitle.setAttribute("class", "overlay-container");
            liTitle.innerHTML = '<span class="overlay" onclick="return naviman.backToLevel1(event, this)"><b class="close"><i class="ri-arrow-left-line"></i></b></span>';
            ulParent.appendChild(liTitle);
        }
    /*******************************************/    

    
    // Nếu mà đang đóng thì đóng hết đi rồi thì mở sau
    if (ulChildrent.style.display == "none" || ulChildrent.style.display == "" || ulChildrent.style.display == "initial") {
        hideAllLevel3Items();
        lastSlidemenuOpenTime[embed_id] = Date.now();

        if (menuKind == NAVIGLOBAL['MENU_KINDS']['CONTEXT_SLIDE'])
            Menu.Context.Horizontal.applyOpenAnimation(menuItem, ulChildrent, menuKind, "level3");

    } else {

        // - Khi expand submenu, nếu bấm vào background của submenu thì ko collapse
        if (event && event.target && event.target.closest('ul[menulevel="3"]')) {
            return;
        }
        // Grace period: vừa mở xong thì không cho đóng ngay
        if (lastSlidemenuOpenTime[embed_id] && (Date.now() - lastSlidemenuOpenTime[embed_id]) < 200)
            return;

        hideAllLevel3Items();
        menuItem.classList.remove("menu-expand");
        menuItem.classList.remove("menu-expand-level2");

        if (menuKind == NAVIGLOBAL['MENU_KINDS']['CONTEXT_SLIDE']) {
            var menu = menuItem.closest ? menuItem.closest(".naviItem.CONTEXT_SLIDE") : null;
            var isHorizontal = Menu.Context.isSlideMenuHorizontal(menuKind, embed_id);
            Menu.Context.Horizontal.applyCloseAnimation(ulChildrent, "level3", function() {
                Menu.Context.Horizontal.showBackButton(menu);
            }, isHorizontal);
        } else {
            ulChildrent.style.display = "none";
        }
    }

    if (isInnerExpand) {

        ulChildrent.style.display = "block";
        var ulLength = Helper.HTML.getULLength(ulChildrent) + "px";
        if (menuKind == NAVIGLOBAL['MENU_KINDS']['CONTEXT_SLIDE']) 
            ulLength = "auto";
        

        // Expand menu height
        menuItem.parentElement.style.height = ulLength; //(8 + ulChildrent.querySelector( 'li.child' ).offsetHeight * ulChildrent.querySelectorAll("li.child").length) + "px";
        menuItem.parentElement.scrollTop = 0;
        menuItem.parentElement.style.overflow = "hidden";

        // slide-horizontal KHÔNG dùng naviman_app_overlay → không gọi showNaviOverlay
        var menuElL3 = document.getElementById(embed_id);
        var isSlideHorizontalL3 = menuElL3 && menuElL3.getAttribute && menuElL3.getAttribute("ui") === "slide-horizontal";
        if (!isSlideHorizontalL3 && (
            (menuKind == NAVIGLOBAL['MENU_KINDS']['SECTION_MOBILE_MEGAMENU']) ||
            !isFromNotSkickyMenu(menuItem)
        ))
            Helper.showNaviOverlay();


        // 1. Cập nhật chiều cao của level 3 bằng level 2
        ulChildrent.style.height = ulLength;

        /*
        Phương án giải quyết: Nếu chưa fix chiều cao của ulChildrentTopFixed để sao cho top của level 3 bằng
        top của level 2 thì tính toán và lưu vào attribute.
         */
        var ulChildrentTopFixed;
        if (ulChildrent.getAttribute('ulChildrentTopFixed'))
            ulChildrentTopFixed = ulChildrent.getAttribute('ulChildrentTopFixed');
        else {
            // 2. Cập nhật top của level 3 bằng 0/level 2
            ulChildrentTopFixed = ulChildrent.getBoundingClientRect().top - ulChildrent.parentElement.parentElement.getBoundingClientRect().top;
            ulChildrent.setAttribute('ulChildrentTopFixed', ulChildrentTopFixed);
        }

        
        if (isNaviSection == true || isNaviSection == "true")
            ulChildrentTopFixed = ulChildrentTopFixed - 10;

        /******* Thay đổi cho phù hợp với từng loại menu **************/
        if ( menuKind == NAVIGLOBAL['MENU_KINDS']['SECTION_MOBILE_MEGAMENU'] ) {
            // Căn top level 3 bám theo overlay xám (li.overlay-container > span.overlay)
            // bằng helper chuyên biệt cho mobile megamenu.
            Menu.Mega.fixLevel3MobileTop(menuItem, ulChildrent, ulParent, ulChildrentTopFixed);
        }else 
            ulChildrent.style.top = (-ulChildrentTopFixed) + "px";
        /**************************************************************/

        // 3. Đánh dấu là đã cập nhật rồi, ko cần update lại
        ulChildrent.style.zIndex = 3;

        // 4. Đôi khi ulChildrent.style.left cần update lại vì parent của nó có thể ở giữa màn hình.
        if (isOnMobile) { // Việc này chỉ xảy ra trên mobile mà thôi.
            ulChildrent.style.left = (48 - ulChildrent.parentElement.getBoundingClientRect().left) + "px";
        }

    } // End of if (isInnerExpand)
    else { // Mở ở dạng expand, trên desktop
        ulChildrent.style.display = "block";
        showLevel3Items_Fix_Expand(menuKind, ulChildrent);
    }

    if (typeof Menu !== "undefined" && Menu.Common && Menu.Common.scheduleDropdownArrowsAlign)
        Menu.Common.scheduleDropdownArrowsAlign(embed_id);

}

var showLevel3Items_Fix_Expand =  function (menuKind, ulChildrent) {
    if (menuKind == NAVIGLOBAL['MENU_KINDS']['SECTION_DESKTOP_MEGAMENU'] ||
        menuKind == NAVIGLOBAL['MENU_KINDS']['CONTEXT_SLIDE']) {
        ulChildrent.style.setProperty('bottom', 'auto', 'important');
    }

    
}

var showLevel3Items_Desktop = function (menuItem, isNaviSection, menuKind, embed_id, event) {
    var isOnMobile = (window.innerWidth <= 768);

    var ulParent = menuItem.parentElement;
    let ulChildrent = menuItem.querySelector('ul.children');

    // Nếu trên desktop thì sẽ expand ra và set width con=bố
    if (!isOnMobile) {
        // hamburgerSubDirection == 3: context menu style — position beside level 2 panel
        if (menuKind == NAVIGLOBAL['MENU_KINDS']['CONTEXT_SLIDE']
            && window.hamburgerSubDirection && window.hamburgerSubDirection[embed_id] == 3
            && ulChildrent) {
            var menuEl3 = document.getElementById(embed_id);
            var isRight3 = menuEl3 && menuEl3.classList.contains('hamburger-right-left');
            // referencePanel = ul.children[menulevel="2"] (direct parent of the clicked li)
            var level2Panel = menuItem.parentElement;
            positionContextSubMenu(ulChildrent, menuItem, level2Panel, isRight3);
            menuItem.classList.add("menu-expand");
            menuItem.classList.add("menu-expand-level2");
            adjustMenuPosition(menuItem, menuKind, embed_id);
            return;
        }

        var setting = getSettingOfNaviman( embed_id );

        /* Chỗ này chỉ đúng với mega menu thôi, còn bottom bar trên desktop thì cần sửa lại ****************************/
        ulChildrent.parentElement.parentElement.style.overflow = "visible";

        var submenuWidth = setting["submenuWidth"];
        
        if (!(menuKind == NAVIGLOBAL['MENU_KINDS']['CONTEXT_SLIDE']))
            ulChildrent.style.width =  submenuWidth + "px"; //  ulChildrent.parentElement.parentElement.offsetWidth + "px";

        // ở dưới
        if (setting.desktopPosition == NAVIGLOBAL['DESKTOP_POSITION']['BOTTOM_CENTER'] || setting.desktopPosition == NAVIGLOBAL['DESKTOP_POSITION']['BOTTOM_RIGHT'] || setting.desktopPosition == NAVIGLOBAL['DESKTOP_POSITION']['BOTTOM_LEFT'] || setting.desktopPosition == NAVIGLOBAL['DESKTOP_POSITION']['BOTTOM_FULL'] || setting.desktopPosition == NAVIGLOBAL['DESKTOP_POSITION']['TOP_FULL'] || setting.desktopPosition == NAVIGLOBAL['DESKTOP_POSITION']['BOTTOM_CENTER_FLOAT']) {

            if (setting.subDirection == false || setting.subDirection == "false")
                ulChildrent.style.left = "-" + ulChildrent.parentElement.parentElement.offsetWidth + "px";
            else
                ulChildrent.style.left = ulChildrent.parentElement.parentElement.offsetWidth + "px";
            ulChildrent.style.overflow = "visible";
            ulChildrent.style.height = "fit-content";
            ulChildrent.style.top = "initial";
            ulChildrent.style.bottom = "0px";

            if (isNaviSection) {
                ulChildrent.style.top = "0px";
                ulChildrent.style.bottom = "initial";
            }
        }

        // Nếu bottom bar nằm ở cạnh bên phải
        if (setting.desktopPosition == NAVIGLOBAL['DESKTOP_POSITION']['RIGHT_TOP'] || setting.desktopPosition == NAVIGLOBAL['DESKTOP_POSITION']['RIGHT_FULL_TOP'] || setting.desktopPosition == NAVIGLOBAL['DESKTOP_POSITION']['RIGHT_FULL_CENTER']) {
            ulChildrent.style.left = "-" + ulChildrent.parentElement.parentElement.offsetWidth + "px";

        }

        // Nếu bottom bar nằm ở cạnh bên trái
        if (setting.desktopPosition == NAVIGLOBAL['DESKTOP_POSITION']['LEFT_TOP'] || setting.desktopPosition == NAVIGLOBAL['DESKTOP_POSITION']['LEFT_FULL_TOP'] || setting.desktopPosition == NAVIGLOBAL['DESKTOP_POSITION']['LEFT_FULL_CENTER']) {
            ulChildrent.style.left = (ulChildrent.parentElement.parentElement.offsetWidth + 2) + "px";
        }

        /* Chỗ này sửa lại cho BOTTOM BAR trên desktop ***************************************************************/
        Menu.Sticky.fixCSS_showLevel3Items_Desktop(menuItem, isNaviSection, menuKind, embed_id);        

        Menu.Sticky.fixCSS_adjustLevel3Items_LeftRight_Desktop(menuItem, isNaviSection, menuKind, embed_id, setting);

        showLevel3Items_Fix_Expand(menuKind, ulChildrent);
    }

    adjustMenuPosition(menuItem, menuKind, embed_id);
}

var backToLevel1 = function (event, item) {

    // Hide all level 2
    var level1Childrens = item.parentElement.parentElement.getElementsByClassName("children");
    for (var i = 0; i < level1Childrens.length; i++) {
        displayElement(level1Childrens[i], false);
    }

    var parrent = item.parentElement.parentElement;
    parrent.style.height = "initial";
    parrent.style.overflow = "auto";

    // Remove overlay
    var overlay = item.parentElement;
    overlay.remove();

    // Khôi phục z-index khi đóng từ nút back (inner expand: tabbar, FAB, mobile mega menu...)
    ZIndex.handleBackToLevel1();

    event.stopPropagation();
}



var isFromNotSkickyMenu = function (menuItem) {
    var limitCount = 0;
    while (true) {
        limitCount++;
        if (limitCount >= 30) return false;

        if (menuItem.className.includes("section_naviman_app"))
            return true;

        if (menuItem == document.body)
            return false;

        menuItem = menuItem.parentElement;
    }
}

var getSettingOfNaviman = function(embed_id) {
    var navimanObj = null;
        for (var i = 0; i < window.navimanData.length; i++)
            if (window.navimanData[i]["embed_id"] == embed_id) {
                navimanObj = window.navimanData[i];
                break;
            }
        
        if( navimanObj == null ) {
            navidebug.log("Error: showLevel2Items - Can't find navimanObj");
            return null;
        }

    return navimanObj["data"]["setting"]; 
}

// Hàm này sẽ truy ngược từ một menu item lên trên xem có chứa class publishToPlace ko
var isFrom_PublishToPlaceMenu = function (menuItem, embed_id ) {
    let naviMenu = menuItem;
    while (naviMenu && naviMenu.id !== embed_id && naviMenu.tagName !== "BODY") {
        naviMenu = naviMenu.parentElement;
    }
    
    if (naviMenu && naviMenu.id === embed_id) {
        return naviMenu.classList.contains("publishToPlace");
    }    
    return false;
}

var saveOpeningMenuInfo = function(isShowing, menuItem, menuKind, embed_id) {
    if (!isShowing) {
        window._openingMenuItem = menuItem;
        window._openingMenuKind = menuKind;
        window._openingEmbedId = embed_id;
    } else {
        delete window._openingMenuItem;
        delete window._openingMenuKind;
        delete window._openingEmbedId;
    }
}


let lastShowLevel2ItemsCall = 0;
var lastSlidemenuOpenTime = {};

var showLevel2Items = function (menuItem, menuKind, embed_id, event) {

    /* Fix vị trí top của ul.children level 2 cho mobile megamenu
     * để đảm bảo khi mở menu level 2 thì nó luôn luôn bám theo menu level 1
     */
    Menu.Section.fixTopOfMobileMega(menuKind, menuItem);

    Menu.Section.fixMobileMegamenuScrollPosition( menuItem );

    var setting = getSettingOfNaviman( embed_id );
    var now = Date.now();
    var desktopHover = isSettingBeTrue(setting['desktopHover']);

    // Throttle: bỏ qua nếu gọi quá nhanh (cả hover và click)
    if (now - lastShowLevel2ItemsCall < 180) return;
    lastShowLevel2ItemsCall = now;



    // 1. Kiểm tra xem có những menu item nào đang được hiện không
    var is_showing = true;
    if (menuItem != null)
        is_showing = ["block", "flex"].includes(menuItem.querySelector('ul.children').style.display);

    // Grace period: vừa mở xong (< 200ms) thì không cho đóng ngay (tránh double-click đóng trước khi animation chạy)
    if (is_showing && lastSlidemenuOpenTime[embed_id] && (now - lastSlidemenuOpenTime[embed_id]) < 200)
        return;

    // 2. Xoá sạch trạng thái hiện tại đi
    var needCloseAllDropdowns = false;

    // Giải thích: Nếu là các menu không phải hamburger thì cần reset tất cả các menu
    if (!(menuKind == NAVIGLOBAL['MENU_KINDS']['CONTEXT_SLIDE']))
        needCloseAllDropdowns = true;
    // Giải thích: Nếu là hamburger thì kiểm tra nếu mở rộng ra ngoài thì cũng cần reset tất cả các menu
    if (menuKind == NAVIGLOBAL['MENU_KINDS']['CONTEXT_SLIDE']) {
        if( window.hamburgerSubDirection[embed_id] == 2 || (window.hamburgerSubDirection[embed_id] == 3 && window.innerWidth > 768) )
            needCloseAllDropdowns = true;
    }

    saveOpeningMenuInfo( is_showing, menuItem, menuKind, embed_id);

    // 3. Kiểm tra nếu chưa hiện thì hiện các ông con
    if (menuItem != null) {
        if (!is_showing) {            

            // Đóng toàn bộ dropdown cũ trước, sau đó mới lock scroll + mở dropdown mới
            if (needCloseAllDropdowns == true)
                Helper.closeAllDropdowns();

            Menu.Sticky.lockPageScrollingTabBar( menuKind, true );

            /****************************************************
            Logic là: Nếu như là full expand thì flex để tràn ra, còn lại thì block để hiện lên. */

            // CONTEXT_SLIDE desktop: đặt vị trí submenu TRƯỚC khi hiện để tránh flash 360px mặc định
            var submenuElement = menuItem.querySelector('ul.children');
            if (window.innerWidth > 768 && menuKind == NAVIGLOBAL['MENU_KINDS']['CONTEXT_SLIDE']
                && window.hamburgerSubDirection) {
                var _subDir2 = window.hamburgerSubDirection[embed_id];
                if (_subDir2 == 2)
                    positionSlideSidePanel(submenuElement, embed_id);
                else if (_subDir2 == 3) {
                    var menuElL2 = document.getElementById(embed_id);
                    positionContextSubMenu(submenuElement, menuItem, menuElL2, menuElL2 && menuElL2.classList.contains('hamburger-right-left'));
                }
            }

            if( menuItem.getAttribute('data-fullexpand') == "1" ) {
                var ulChildrent = menuItem.querySelector('ul.children');
                displayElement(ulChildrent, true, "flex");

                // Kiểm tra nếu public ở dạng publishToPlace thì cần cập nhật lại vị trí
                if( isFrom_PublishToPlaceMenu(menuItem, embed_id) )
                    Finalizer.Desktop.FullExpand.maintainDropdownPosition(ulChildrent, "PublishToPlace");
                else
                    Finalizer.Desktop.FullExpand.maintainDropdownPosition(ulChildrent, "InsertToSection");
            }
            else
                displayElement(menuItem.querySelector('ul.children'), true);
            /****************************************************/

            displayElement(menuItem.querySelector('span.arrow'), true);
            menuItem.querySelector('ul.children').style.overflow = "auto";
            lastSlidemenuOpenTime[embed_id] = Date.now();

            if (!Menu.Context.Horizontal.applyOpenAnimation(menuItem, submenuElement, menuKind, "level2")) {
                menuItem.classList.add("menu-expand");
                menuItem.classList.add("menu-expand-level1");
                if (typeof Menu !== "undefined" && Menu.Context && Menu.Context.scheduleSlideArrowsAlign)
                    Menu.Context.scheduleSlideArrowsAlign(embed_id);
            }
            
            if (!ZIndex.applyWhenOpen(menuKind, embed_id)) {
                ZIndex.setTopZindex(menuItem, menuKind, embed_id);
            }

            if (menuKind == NAVIGLOBAL['MENU_KINDS']['SECTION_DESKTOP_MEGAMENU'])
                Menu.Mega.raiseSectionZIndexForDesktopMega(menuItem);
            if (menuKind == NAVIGLOBAL['MENU_KINDS']['SECTION_MOBILE_MEGAMENU'])
                Menu.Mega.raiseSectionZIndexForMobileMega(menuItem);

            if (typeof Menu !== "undefined" && Menu.Common && Menu.Common.scheduleDropdownArrowsAlign)
                Menu.Common.scheduleDropdownArrowsAlign(embed_id);

            // Với SECTION_MOBILE_MEGAMENU: luôn bật naviman_app_overlay khi mở dropdown level 2 trên mobile
            // để tránh cảm giác "lúc có overlay, lúc không". Các menu khác giữ logic cũ.
            // slide-horizontal KHÔNG dùng naviman_app_overlay (dùng overlay_global) → không gọi showNaviOverlay
            var menuEl = document.getElementById(embed_id);
            var isSlideHorizontal = menuEl && menuEl.getAttribute && menuEl.getAttribute("ui") === "slide-horizontal";
            if (!isSlideHorizontal && (
                (typeof NAVIGLOBAL !== "undefined" &&
                 NAVIGLOBAL['MENU_KINDS'] &&
                 menuKind == NAVIGLOBAL['MENU_KINDS']['SECTION_MOBILE_MEGAMENU']) ||
                !isFromNotSkickyMenu(menuItem)
            ))
                Helper.showNaviOverlay();

        } else {

            // - Khi expand submenu, nếu bấm vào background của submenu thì ko collapse
            if (event && event.target && event.target.closest('ul[menulevel="2"]')) {
                return;
            } // --------------------------

            
            Menu.Sticky.lockPageScrollingTabBar( menuKind, false );

            var closeDropDown = function () {
                navidebug.log("function: closeDropDown - Something wrong here ");
                var ulChildren = menuItem.querySelector('ul.children');
                var doRest = function() {
                    displayElement(menuItem.querySelector('span.arrow'), false);
                    menuItem.classList.remove("menu-expand");
                    menuItem.classList.remove("menu-expand-level1");
                    if (!ZIndex.applyWhenClose(menuKind, embed_id)) {
                        ZIndex.removeTopZindex(menuItem, menuKind, embed_id);
                    }

                    if (menuKind == NAVIGLOBAL['MENU_KINDS']['SECTION_DESKTOP_MEGAMENU'])
                        Menu.Mega.restoreSectionZIndexForDesktopMega(menuItem);
                    if (menuKind == NAVIGLOBAL['MENU_KINDS']['SECTION_MOBILE_MEGAMENU'])
                        Menu.Mega.restoreSectionZIndexForMobileMega(menuItem);

                    if (!(menuKind == NAVIGLOBAL['MENU_KINDS']['CONTEXT_SLIDE'] && Menu.Context.isSlideMenuHorizontal && Menu.Context.isSlideMenuHorizontal(menuKind, embed_id)))
                        Helper.hideNaviOverlay();
                    var menu = document.getElementById(embed_id);
                    if (menu && typeof Menu !== "undefined" && Menu.Context && Menu.Context.Horizontal && typeof Menu.Context.Horizontal.showBackButton === "function") {
                        Menu.Context.Horizontal.showBackButton(menu);
                        if (typeof Menu.Context.Horizontal.refreshHeaderTitle === "function") {
                            Menu.Context.Horizontal.refreshHeaderTitle(menu);
                        }
                    }
                };
                if (menuKind == NAVIGLOBAL['MENU_KINDS']['CONTEXT_SLIDE'] && ulChildren) {
                    var isHorizontal = Menu.Context.isSlideMenuHorizontal(menuKind, embed_id);
                    menuItem.classList.remove("menu-expand");
                    menuItem.classList.remove("menu-expand-level1");
                    Menu.Context.Horizontal.applyCloseAnimation(ulChildren, "level2", doRest, isHorizontal);
                } else {
                    displayElement(ulChildren, false);
                    doRest();
                }
            }

            /****************************************************
             * Đây là chỗ xử lý hover chuột ra ngoài menu item thì delay lại để ko tắt menu quá nhanh gây UX kém 
             */
            var isOnMobile = (window.innerWidth <= 768);

            var isNeedDelay = false;
            if( !isOnMobile ) 
                if( desktopHover ) 
                    isNeedDelay = true;

            
            if( isNeedDelay)
                setTimeout(() => {                
                    var menu = document.getElementById( embed_id );
                    if( !menu.matches(":hover") ) {
                        closeDropDown();
                    }
                }, 300);
            else // isNeedDelay == false 
                closeDropDown();
            /****************************************************/
        }

        adjustMenuPosition(menuItem, menuKind, embed_id);

    }
};

var adjustMenuPosition = function (menuItem, menuKind, embed_id) {    
    if (window.innerWidth < 769) return;

    var menuChildren = menuItem.querySelector(":scope > ul");
    if (!menuChildren) return;

    var rect = menuChildren.getBoundingClientRect();
    var viewportWidth = window.innerWidth;
    
    if (rect.right > viewportWidth) {
        var shift = viewportWidth - rect.right;
        menuChildren.style.transform = `translateX(${shift}px)`;
    } else if (rect.left < 0) {
        var shift = -rect.left;
        menuChildren.style.transform = `translateX(${shift}px)`;
    }        

    
};

    const supportedLanguages = [
  // ISO 639-1
  "ab","aa","af","ak","sq","am","ar","an","hy","as","av","ae","ay","az",
  "ba","bm","eu","be","bn","bh","bi","bs","br","bg","my","ca","ch","ce",
  "zh","cu","cv","kw","co","cr","hr","cs","da","dv","nl","dz","en","eo",
  "et","ee","fo","fj","fi","fr","ff","gl","gd","lg","ka","de","ki","el",
  "kl","gn","gu","ht","ha","he","hz","hi","hu","is","id","ia","ie","iu",
  "ik","ga","it","ja","jv","kn","kr","ks","kk","rw","ky","kv","kg","ko",
  "kj","ku","lo","la","lv","li","ln","lt","lu","lb","mk","mg","ms","ml",
  "mt","mi","mr","mo","mn","na","nv","nd","ne","no","nb","nn","ny","oc",
  "or","om","os","pa","fa","pl","pt","ps","qu","rm","ro","rn","ru","sm",
  "sg","sa","sr","sh","st","tn","sn","sd","si","sk","sl","so","es","su",
  "sw","sv","tl","ty","ta","tt","te","th","bo","ti","to","ts","tr","tk",
  "tw","ug","uk","ur","uz","ve","vi","vo","wa","cy","wo","xh","yi","yo",
  "za","zu",

  // Extended / common Shopify & Navi+ variants
  "en-us","en-gb","fr-ca","pt-br","es-mx","zh-hans","zh-hant","zh-cn","zh-tw","sr-latn","sr-cyrl",
  "fil","he","id","no","nb","nn","uk","vi","km","th","ms","ja","ko","ru"
];

var openChangeLanguage = function(targetLang) {
  const defaultLang = (window.Shopify && Shopify.defaultLocale) || 'en';
  const currentUrl = window.location.href;
  const url = new URL(currentUrl);
  const pathParts = url.pathname.split('/').filter(Boolean);

  const firstSegment = pathParts[0];
  const lowerFirstSegment = firstSegment?.toLowerCase();
  const currentLang = supportedLanguages.includes(lowerFirstSegment) ? lowerFirstSegment : null;

  if (!targetLang || typeof targetLang !== 'string' || !supportedLanguages.includes(targetLang.toLowerCase())) {
    targetLang = defaultLang;
  }
  targetLang = targetLang.toLowerCase();

  if (currentLang === targetLang) {
    navidebug.log("Language already active:", targetLang);
    return;
  }

  let newPathParts = [...pathParts];
  if (currentLang) newPathParts.shift();
  if (targetLang !== defaultLang) newPathParts.unshift(targetLang);

  const newUrl = url.origin + '/' + newPathParts.join('/') + url.search;
  navidebug.log("Redirecting to:", newUrl);
  window.location.href = newUrl;

  if (typeof callbackPublicFunc === 'function') {
    callbackPublicFunc(openChangeLanguage);
  }
};

var openNaviMenu = function(embedId) {
    const element = document.querySelector("#" + embedId);
    if (!element) {
        navidebug.log( "openNaviMenu - Menu #" + embedId + " is not found!" );
        return;
    }

    if (window.innerWidth <= 768) {
        if (element.classList.contains("hamburger-mobile-fullfixed")) 
            return;
        
    } else {
        if (element.classList.contains("hamburger-desktop-fullfixed")) 
            return;        
    }    

    navidebug.log("openNaviMenu:", embedId);

    if (getComputedStyle(element).visibility !== "visible") {
        navidebug.log( "openNaviMenu - Start opening menu #" + embedId + "" );

        // Mở menu ******************************<<<
        const classList = element.classList;
        Helper.showNaviOverlayGlobal();
        /* Đảm bảo overlay có is-open (phòng trường hợp đóng qua overlay level 2/3 rồi mở lại bị thiếu) */
        var overlayGlobal = document.querySelector('.naviman_app_overlay_global');
        if (overlayGlobal && !overlayGlobal.classList.contains('is-open')) {
            overlayGlobal.classList.add('is-open');
            if (typeof Helper_lockBodyScroll === 'function') Helper_lockBodyScroll(true);
        }
        element.style.visibility = "visible";
        element.style.opacity = "0";

        let transformFrom = null;

        if (classList.contains("hamburger-left-right")) {
            transformFrom = "translateX(-100%)";
        } else if (classList.contains("hamburger-right-left")) {
            transformFrom = "translateX(100%)";
        } else if (classList.contains("hamburger-top-down")) {
            transformFrom = "translateY(-100%)";
        } else if (classList.contains("hamburger-down-top")) {
            transformFrom = "translateY(100%)";
        } else if (classList.contains("hamburger-fullscreen") || classList.contains("hamburger-fullpopup")) {
            transformFrom = null; // Chỉ dùng opacity
        } else {
            // Không hiệu ứng nếu không khớp class nào
            element.style.opacity = "1";
            return;
        }

        if (transformFrom !== null) {
            element.style.transform = transformFrom;
        }

        requestAnimationFrame(() => {
            requestAnimationFrame(() => {
                element.style.transition = "transform 0.3s ease-out, opacity 0.2s ease-out";
                element.style.opacity = "1";
                if (transformFrom !== null) {
                    element.style.transform = "translate(0, 0)";
                }

                // ⏳ Sau khi mở xong, xoá rác
                setTimeout(() => {
                    ["transform", "opacity", "transition"].forEach(prop => element.style.removeProperty(prop));
                }, 300);
            });
        });
        // Mở menu ******************************>>>

    } else {
        // Đóng menu với animation trượt
        Animation.hamburgerClose(element, {
            doneCallback: function() {
                Helper.hideNaviOverlayGlobal();
                Helper.hideNaviOverlay();
            }
        });
    }

    callbackPublicFunc(openNaviMenu);
};


var openMobileMenu = function() {
    const divMenu = document.querySelector('.header__icon--menu');

    callbackPublicFunc_delay(openMobileMenu);

    divMenu.addEventListener('click', () => {}); // Xem lai cho false nay
    divMenu.click();
};

var openCart = function() {
    const divMenu = document.querySelector('.header__icon--cart');

    callbackPublicFunc_delay(openCart);

    divMenu.addEventListener('click', () => {});
    divMenu.click();
};

var openSearch = function() {
    callbackPublicFunc_delay(openSearch);    

    const divMenu = document.querySelector('.header__icon--search');
    if (divMenu) {        
        clickToElement('.header__icon--search');
        return;
    }

    var isDawnFamily = true;
    if (document.querySelector('details-modal.header__search') == null)
        isDawnFamily = false;
    else if (document.querySelector('details-modal.header__search').querySelector("details") == null)
        isDawnFamily = false;

    // Dawn & Craft
    if (isDawnFamily) {
        const divMenuAll = document.querySelectorAll('details-modal.header__search details');
        divMenuAll.forEach((divMenu) => {
            divMenu.setAttribute("open", "true");
            divMenu.querySelector("input").focus();
        });
    } else {
        const divMenuFallback = document.querySelector('.header__icon--search');
        if (divMenuFallback) {
            divMenuFallback.addEventListener('click', () => {});
            divMenuFallback.click();
        }
    }
};

var focusToElement = function ( cssClass ) {
    navidebug.log("focusToElement:", cssClass);
    if( document.querySelector(cssClass) != null ) {
        setTimeout(() => {
            document.querySelector(cssClass).focus();
            return false;
        }, "200");
    }else
        navidebug.error("This theme is invalid. Can find: " + cssClass);
    return false;
};

/* **** Bản cũ ko dùng đến ******
var clickToElement = function ( cssClass ) {
    navidebug.log("clickToElement:", cssClass);
    if( document.querySelector(cssClass) != null ) {
        setTimeout(() => {
            document.querySelector(cssClass).click();
            return false;
        }, "200");
    }else
        navidebug.error("This theme is invalid. Can find: " + cssClass);
    return false;
}; */

/**
 * Simulate user interaction on an element:
 * - scroll into view
 * - focus (nếu có thể)
 * - dispatch pointer/touch/mouse events theo mode
 * - fallback .click()
 *
 * @param {string} selector - CSS selector của element ('.btn', '#id', 'input[name=q]', ...)
 * @param {Object} opts
 * @param {'auto'|'pointer'|'touch'|'mouse'} [opts.mode='auto'] - Ưu tiên loại event
 * @param {number} [opts.delay=200] - Delay trước khi bắn event (ms)
 * @param {boolean} [opts.center=true] - Cuộn element vào giữa viewport
 * @param {boolean} [opts.focus=true] - Gọi .focus() trước khi click
 * @returns {Promise<boolean>} true nếu tìm thấy và đã bắn event, false nếu không
 */
async function clickToElement(selector, opts = {}) {
  const {
    mode = 'auto',
    delay = 200,
    center = true,
    focus = true,
  } = opts;

  const el = document.querySelector(selector);
  navidebug.log('clickToElement:', selector, { mode, delay, center, focus });

  if (!el) {
    navidebug.log("This theme is invalid. Can find: " + selector);
    return false;
  }
  if (!el.isConnected) {
    navidebug.warn('Element not in DOM:', selector);
    return false;
  }

  // Đưa vào khung nhìn để đảm bảo nhận event
  try {
    el.scrollIntoView({ behavior: 'instant' in Element.prototype ? 'instant' : 'smooth', block: center ? 'center' : 'nearest' });
  } catch {
    // một số môi trường không có 'instant'
    el.scrollIntoView({ behavior: 'smooth', block: center ? 'center' : 'nearest' });
  }

  // Chờ một nhịp layout
  await new Promise(r => setTimeout(r, Math.max(0, delay)));

  // Thử focus (nếu không bị chặn)
  if (focus && typeof el.focus === 'function') {
    try { el.focus({ preventScroll: true }); } catch {}
  }

  // Tọa độ tương đối ở giữa element
  const rect = el.getBoundingClientRect();
  const clientX = rect.left + rect.width / 2;
  const clientY = rect.top + rect.height / 2;

  // Helper bắn event an toàn
  const fire = (type, EventCtor, init) => {
    try {
      const ev = new EventCtor(type, { bubbles: true, cancelable: true, ...init });
      return el.dispatchEvent(ev);
    } catch (e) {
      // fallback nhẹ nếu constructor cụ thể bị chặn (nhất là TouchEvent)
      try {
        const ev = new Event(type, { bubbles: true, cancelable: true });
        return el.dispatchEvent(ev);
      } catch {}
    }
    return false;
  };

  // Quyết định mode
  const hasPointer = 'PointerEvent' in window;
  const pickMode = mode === 'auto' ? (hasPointer ? 'pointer' : ('ontouchstart' in window ? 'touch' : 'mouse')) : mode;

  // Chuỗi sự kiện mô phỏng “tap/click” thực tế
  try {
    if (pickMode === 'pointer') {
      fire('pointerover', PointerEvent, { pointerType: 'touch', clientX, clientY });
      fire('pointerenter', PointerEvent, { pointerType: 'touch', clientX, clientY });
      fire('pointerdown', PointerEvent, { pointerType: 'touch', buttons: 1, clientX, clientY });
      fire('pointerup', PointerEvent, { pointerType: 'touch', buttons: 0, clientX, clientY });
      // Nhiều site vẫn nghe mouse*, nên kèm thêm:
      fire('mousedown', MouseEvent, { buttons: 1, clientX, clientY });
      fire('mouseup', MouseEvent, { buttons: 0, clientX, clientY });
      fire('click', MouseEvent, { buttons: 0, clientX, clientY });
    } else if (pickMode === 'touch') {
      // CẢNH BÁO: TouchEvent có thể bị hạn chế bởi quyền/UA, nên ta bao try/catch và vẫn bắn mouse/click dự phòng
      const touchInit = (() => {
        if ('Touch' in window && 'TouchEvent' in window) {
          const touch = new Touch({ identifier: Date.now(), target: el, clientX, clientY, radiusX: 2, radiusY: 2 });
          return { touches: [touch], targetTouches: [touch], changedTouches: [touch] };
        }
        return {};
      })();
      fire('touchstart', TouchEvent, touchInit);
      fire('touchend', TouchEvent, touchInit);
      // Dự phòng cho các lib chỉ lắng nghe mouse/click
      fire('mousedown', MouseEvent, { buttons: 1, clientX, clientY });
      fire('mouseup', MouseEvent, { buttons: 0, clientX, clientY });
      fire('click', MouseEvent, { buttons: 0, clientX, clientY });
    } else {
      // mouse
      fire('mouseover', MouseEvent, { clientX, clientY });
      fire('mouseenter', MouseEvent, { clientX, clientY });
      fire('mousedown', MouseEvent, { buttons: 1, clientX, clientY });
      fire('mouseup', MouseEvent, { buttons: 0, clientX, clientY });
      fire('click', MouseEvent, { buttons: 0, clientX, clientY });
    }
  } catch (e) {
    navidebug.warn('Dispatch sequence failed, fallback to element.click()', e);
    if (typeof el.click === 'function') el.click();
  }

  // Chốt hạ: nếu là input, cố gắng select để người dùng thấy rõ
  if (focus && (el.matches('input, textarea') || el.isContentEditable)) {
    try {
      if (typeof el.select === 'function') el.select();
    } catch {}
  }

  return true;
}


/***** Scroll to Up/OnPage ******************************************************************/

var scrollTop = function (topMargin = 0) {
    callbackPublicFunc_delay(scrollTop);
    window.scrollTo({ top: topMargin, behavior: "smooth" });
    return false;
};

var scrollOnPage = function ( cssOrID ) {
    var element = document.querySelector( cssOrID );
    if( element != null )
        element.scrollIntoView( {behavior: "smooth"});
    callbackPublicFunc_delay(scrollOnPage);
};

var scrollBottom = function (bottomMargin = 0) {
    callbackPublicFunc_delay(scrollBottom);
    window.scrollTo({ top: (document.body.scrollHeight - screen.height - bottomMargin), behavior: "smooth" });
    return false;
};

/***** Share/copy url ******************************************************************/
var shareCopyUrl = function () {
    navigator.clipboard.writeText(window.location.href);
    callbackPublicFunc_delay(shareCopyUrl);
    return false;
};

var shareFacebook = function () {
    var url = window.location.href;
    callbackPublicFunc_delay(shareFacebook);
    window.open('https://www.facebook.com/sharer/sharer.php?u=' + url, '_blank');
    return false;
};

var shareTweet = function () {
    var url = window.location.href;
    callbackPublicFunc_delay(shareTweet);
    window.open('https://twitter.com/share?url=' + url, '_blank');
    return false;
};


/***** Theme: Tailor https://themes.shopify.com/themes/tailor/styles/cotton ******************/
var openMenu_Tailor = function() {
    callbackPublicFunc_delay(openMenu_Tailor);
    return clickToElement('.header__controls .header__menu-button');
};
var openSearch_Tailor = function() {
    callbackPublicFunc_delay(openSearch_Tailor);
    return clickToElement('.header__controls .header__search-button');
};
var openCart_Tailor = function() {
    callbackPublicFunc_delay(openCart_Tailor);
    return clickToElement('.header__controls .header__cart-button');
};

/***** Theme: Symmetry https://themes.shopify.com/themes/symmetry/styles/beatnik ******************/
var openMenu_Symmetry = function() {
    callbackPublicFunc_delay(openMenu_Symmetry);
    return clickToElement(".mobile-nav-toggle");
};
var openSearch_Symmetry = function() {
    callbackPublicFunc_delay(openSearch_Symmetry);
    return clickToElement(".show-search-link");
};
var openCart_Symmetry = function() {
    callbackPublicFunc_delay(openCart_Symmetry);
    return clickToElement(".cart-link");
};

/***** Theme: Pipeline https://themes.shopify.com/themes/pipeline/styles/bright ******************/
var openMenu_Pipeline = function() {
    callbackPublicFunc_delay(openMenu_Pipeline);
    return clickToElement('[data-drawer-toggle="hamburger"]');
};
var openCart_Pipeline = function() {
    callbackPublicFunc_delay(openCart_Pipeline);
    return clickToElement('[data-drawer-toggle="drawer-cart"]');
};
var openSearch_Pipeline = function() {
    openMenu_Pipeline();
    setTimeout(() => {
        focusToElement('[type="search"]');
    }, "300");
    callbackPublicFunc_delay(openSearch_Pipeline);
    return;
};

/***** Theme: Empire https://themes.shopify.com/themes/empire/styles/supply ******************/
var openMenu_Empire = function() {
    callbackPublicFunc_delay(openMenu_Empire);
    return clickToElement('.site-header-menu-toggle--button');
};
var openSearch_Empire = function() {
    callbackPublicFunc_delay(openSearch_Empire);
    return clickToElement('.site-header-mobile-search-button--button');
};

/***** Theme: Impulse https://themes.shopify.com/themes/impulse/styles/modern ******************/
var openMenu_Impulse = function() {
    if(!document.documentElement.classList.contains("js-drawer-open")) {
        setTimeout(() => {
            document.querySelector('.js-drawer-open-nav').click();
        }, "200");
        callbackPublicFunc_delay(openMenu_Impulse);
    }
    return false;
};
var openSearch_Impulse = function() {
    callbackPublicFunc_delay(openSearch_Impulse);
    return clickToElement('.js-search-header');
};
var openCart_Impulse = function() {
    if(!document.documentElement.classList.contains("js-drawer-open")) {
        setTimeout(() => {
            document.querySelector('.js-drawer-open-cart').click();
        }, "200");

        callbackPublicFunc_delay(openCart_Impulse);
    }
    return false;
};

/***** Theme: Horizon - Polished design meets a clean setup: launch faster without sacrificing style. ******************/
var openMenu_Horizon = function() {
    callbackPublicFunc_delay(openMenu_Horizon);
    return clickToElement('.header__icon--menu');
};
var openSearch_Horizon = function() {
    callbackPublicFunc_delay(openSearch_Horizon);
    return clickToElement('.search-action .header-actions__action');
};
var openCart_Horizon = function() {
    callbackPublicFunc_delay(openCart_Horizon);
    return clickToElement('.header-actions__cart-icon');
};

/***** Theme: Enterprise https://themes.shopify.com/themes/enterprise/styles/active ******************/
var openMenu_Enterprise = function() {
    callbackPublicFunc_delay(openMenu_Enterprise);
    return clickToElement('.main-menu__toggle');
};
var openCart_Enterprise = function() {
    callbackPublicFunc_delay(openCart_Enterprise);
    return clickToElement('#cart-icon');
};

/***** Theme: Warehouse https://themes.shopify.com/themes/warehouse/styles/metal ******************/
var openMenu_Warehouse = function() {
    callbackPublicFunc_delay(openMenu_Warehouse);
    return clickToElement('[data-action="toggle-menu"]');
};
var openCart_Warehouse = function() {
    callbackPublicFunc_delay(openCart_Warehouse);
    return clickToElement('[data-action="toggle-mini-cart"]');
};
var openSearch_Warehouse = function() {
    callbackPublicFunc_delay(openSearch_Warehouse);
    return clickToElement('[data-action="toggle-search"]');
};

/***** Theme: Eurus https://themes.shopify.com/themes/eurus/presets/eurus ******************/
var openMenu_Eurus = function() {
    callbackPublicFunc_delay(openMenu_Eurus);
    return clickToElement('#mobile-navigation');
};
var openCart_Eurus = function() {
    callbackPublicFunc_delay(openCart_Eurus);
    return clickToElement('#cart-icon');
};
var openSearch_Eurus = function() {
    callbackPublicFunc_delay(openSearch_Eurus);
    return clickToElement('#SearchOpen');
};

/***** Theme: Veena https://themes.shopify.com/themes/veena/presets/veena ******************/
var openMenu_Veena= function() {
    callbackPublicFunc_delay(openMenu_Veena);
    return clickToElement('#Details-menu-drawer-container .header__icon--menu');
};
var openCart_Veena = function() {
    callbackPublicFunc_delay(openCart_Veena);
    return clickToElement('#cart-icon-bubble');
};
var openSearch_Veena = function() {
    callbackPublicFunc_delay(openSearch_Veena);
    return focusToElement('#Search-In-Modal');
};

/***** Theme: Hongo https://preview.themeforest.net/item/hongo-multipurpose-shopify-theme-os-20 ******************/
var openMenu_Hongo = function() {
    callbackPublicFunc_delay(openMenu_Hongo);
    return clickToElement('.navbar .navbar-toggler');
};
var openCart_Hongo = function() {
    callbackPublicFunc_delay(openCart_Hongo);
    return clickToElement('.navbar [aria-label="cart"]');
};
var openSearch_Hongo = function() {
    callbackPublicFunc_delay(openSearch_Hongo);    
    return clickToElement('.navbar .search');
};

/***** Theme: Shark https://themes.shopify.com/themes/shark/styles/bright ******************/
var openMenu_Shark = function() {
    callbackPublicFunc_delay(openMenu_Shark);
    return clickToElement('.hamburger-toggler');
};
var openCart_Shark = function() {
    callbackPublicFunc_delay(openCart_Shark);
    return clickToElement('.cart .header-icons-link');
};
var openSearch_Shark = function() {
    callbackPublicFunc_delay(openSearch_Shark);    
    return clickToElement('.search .header-icons-link');
};

/***** Theme: District https://themes.shopify.com/themes/district/styles/district ******************/
var openMenu_District = function() {
    callbackPublicFunc_delay(openMenu_District);
    return clickToElement('.header-top__menu');
};
var openCart_District = function() {
    callbackPublicFunc_delay(openCart_District);
    return clickToElement('.header-top__cart-button');
};
var openSearch_District = function() {
    callbackPublicFunc_delay(openSearch_District);
    if (document.querySelector('.header-top__search')) {
        return clickToElement('.header-top__search');
    } else {
        clickToElement('.header-top__menu');
        setTimeout(function() {
            clickToElement("#menu.panel .search");
        }, 1000);
    }
};

/***** Theme: Honey https://themes.shopify.com/themes/honey/styles/paws ******************/
var openMenu_Honey = function() {
    callbackPublicFunc_delay(openMenu_Honey);
    return clickToElement('.header__icon--menu');
};
var openCart_Honey = function() {
    callbackPublicFunc_delay(openCart_Honey);
    return clickToElement('.header__icon--cart');
};
var openSearch_Honey = function() {
    if (document.getElementById("search-home-field")) { 
        window.scrollTo({ top: 0, behavior: "smooth" });

        setTimeout(() => {
            naviman.focusToElement('#Search-In-Template');  

            // Add animation
            document.getElementById("Search-In-Template").classList.add('animate__animated', 'animate__flash');          

            // Remove animation
            setTimeout(() => {
                document.getElementById("Search-In-Template").classList.remove('animate__animated', 'animate__flash');          
            }, 1000);
        }, 1000);

    } else {
        window.scrollTo({ top: 0, behavior: "smooth" });
        setTimeout(() => {
            naviman.clickToElement('[aria-label="Search"]'); 
        }, 500);
    }    

    return true;

};

/***** Theme: Focal https://themes.shopify.com/themes/focal/styles/carbon ******************/
var openMenu_Focal = function() {
    callbackPublicFunc_delay(openMenu_Focal);
    return clickToElement('[aria-controls="mobile-menu-drawer"]');
};
var openCart_Focal = function() {
    callbackPublicFunc_delay(openCart_Focal);
    return clickToElement('[aria-controls="mini-cart"]');
};
var openSearch_Focal = function() {
    callbackPublicFunc_delay(openSearch_Focal);
    return clickToElement('[aria-controls="search-drawer"]');
};

/***** Theme: Xclusive https://themes.shopify.com/themes/xclusive/styles/shoes ******************/
var openMenu_Xclusive = function() {
    callbackPublicFunc_delay(openMenu_Xclusive);
    return clickToElement('[aria-controls="nav"]');
};
var openCart_Xclusive = function() {
    callbackPublicFunc_delay(openCart_Xclusive);
    return clickToElement('[aria-controls="cart"]');
};
var openSearch_Xclusive = function() {
    callbackPublicFunc_delay(openSearch_Xclusive);
    return clickToElement('.search-compact');
};


/***** Theme: Prestige https://themes.shopify.com/themes/prestige/styles/couture ******************/
var openMenu_Prestige = function() {
    callbackPublicFunc_delay(openMenu_Prestige);
    return clickToElement('[aria-controls="sidebar-menu"]');
};
var openCart_Prestige = function() {
    callbackPublicFunc_delay(openCart_Prestige);
    return clickToElement('[aria-controls="cart-drawer"]');
};
var openSearch_Prestige = function() {
    callbackPublicFunc_delay(openSearch_Prestige);
    return clickToElement('.header__search-link a');
};

/***** Theme: Palo Alto https://themes.shopify.com/themes/palo-alto/styles/vibrant ******************/
var openMenu_PaloAlto = function() {
    callbackPublicFunc_delay(openMenu_PaloAlto);
    return clickToElement('[aria-controls="nav-drawer"]');
};
var openCart_PaloAlto = function() {
    callbackPublicFunc_delay(openCart_PaloAlto);
    return clickToElement('[aria-controls="cart-drawer"]');
};
var openSearch_PaloAlto = function() {
    callbackPublicFunc_delay(openSearch_PaloAlto);
    return clickToElement('.mobile-menu .search-popdown__toggle');
};

/***** Theme: Minion https://themes.shopify.com/themes/minion/styles/vertical ******************/
var openMenu_Minion = function() {
    callbackPublicFunc_delay(openMenu_Minion);
    return clickToElement(".drawer__icon-menu");
};
var openCart_Minion = function() {
    callbackPublicFunc_delay(openCart_Minion);
    return clickToElement("#cart-icon-bubble--mobile");
};
var openSearch_Minion = function() {
    callbackPublicFunc_delay(openSearch_Minion);
    window.scrollTo({ top: 0, behavior: "smooth" });
    return focusToElement("#Search-In-Modal-mobile");
};

/***** Theme: Borders https://themes.shopify.com/themes/borders/styles/raw ******************/
var openMenu_Borders = function() {
    callbackPublicFunc_delay(openMenu_Borders);
    return clickToElement( ".mobile-menu-button" );
};
var openCart_Borders = function() {
    callbackPublicFunc_delay(openCart_Borders);
    return clickToElement('[aria-controls="site-cart-sidebar"]');
};
var openSearch_Borders = function() {
    callbackPublicFunc_delay(openSearch_Borders);
    return clickToElement('[aria-controls="site-search-sidebar"]');
};

/***** Theme: Impact https://themes.shopify.com/themes/impact/styles/sound ******************/
var openMenu_Impact = function() {
    callbackPublicFunc_delay(openMenu_Impact);
    clickToElement('[aria-controls="header-sidebar-menu"]');
};
var openCart_Impact = function() {
    callbackPublicFunc_delay(openCart_Impact);
    clickToElement('[aria-controls="cart-drawer"]');
};
var openSearch_Impact = function() {
    callbackPublicFunc_delay(openSearch_Impact);
    clickToElement('[aria-controls="search-drawer"]');
};

/***** Theme: Broadcast https://themes.shopify.com/themes/broadcast/styles/clean ******************/
var openMenu_Broadcast = function() {
    callbackPublicFunc_delay(openMenu_Broadcast);
    return clickToElement('.header__mobile__hamburger');
};
var openCart_Broadcast = function() {
    callbackPublicFunc_delay(openCart_Broadcast);
    return clickToElement('.navlink--cart');
};
var openSearch_Broadcast = function() {
    callbackPublicFunc_delay(openSearch_Broadcast);
    return clickToElement('.navlink--search');
};

/***** Theme: Expanse https://themes.shopify.com/themes/expanse/styles/classic ******************/
var openMenu_Expanse = function() {
    callbackPublicFunc_delay(openMenu_Expanse);
    return clickToElement('.mobile-nav-trigger');
};
var openCart_Expanse = function() {
    callbackPublicFunc_delay(openCart_Expanse);
    return clickToElement('#HeaderCartTrigger');
};
var openSearch_Expanse = function() {
    callbackPublicFunc_delay(openSearch_Expanse);
    return clickToElement('.js-search-header');
};

/***** Theme: ShowTime https://themes.shopify.com/themes/showtime/styles/cooktime ******************/
var openMenu_ShowTime = function() {
    callbackPublicFunc_delay(openMenu_ShowTime);
    return clickToElement('[class="#main-navigation-mobile-icon"]');
};
var openCart_ShowTime = function() {
    callbackPublicFunc_delay(openCart_ShowTime);
    return clickToElement('cart-drawer-trigger');
};
var openSearch_ShowTime = function() {
    callbackPublicFunc_delay(openSearch_ShowTime);
    var input = document.querySelector('[class="#header-searchbar-input"]');

    input.addEventListener('touchstart', function() { input.focus(); });
    input.addEventListener('click', function() { input.focus(); });
    setTimeout(() => {
        input.focus();
    }, 500);
};


/***** Theme: Local https://themes.shopify.com/themes/local/styles/light ******************/
var openMenu_Local = function() {
    callbackPublicFunc_delay(openMenu_Local);
    return clickToElement('.mobile-menu-button');
};
var openCart_Local = function() {
    callbackPublicFunc_delay(openCart_Local);
    return focusToElement('.mobile-search input');
};
var openSearch_Local = function() {
    callbackPublicFunc_delay(openSearch_Local);
    return clickToElement('.mobile-cart-button');
};

/***** Theme: Avenue https://themes.shopify.com/themes/avenue/styles/casual ******************/
var openMenu_Avenue = function() {
    callbackPublicFunc_delay(openMenu_Avenue);
    return clickToElement('.toggleMenu');
};
var openCart_Avenue = function() {
    callbackPublicFunc_delay(openCart_Avenue);
    return clickToElement('#cart-count-mobile .cart-count-mobile');
};
/*var openSearch_Avenue = function() {
    return clickToElement('.mobile-cart-button');
};*/

/***** Theme: Parallax https://themes.shopify.com/themes/parallax/styles/aspen ******************/
var openMenu_Parallax = function() {
    callbackPublicFunc_delay(openMenu_Parallax);
    return clickToElement('.icon-menu');
};
var openCart_Parallax = function() {
    callbackPublicFunc_delay(openCart_Parallax);
    return clickToElement('.icon-cart');
};
var openSearch_Parallax = function() {
    window.scrollTo({ top: 0, behavior: "smooth" });

    var input = document.querySelector('.mobile-search-bar .search-form__input');

    input.addEventListener('touchstart', function() { input.focus(); });
    input.addEventListener('click', function() { input.focus(); });
    setTimeout(() => {
        input.focus(); // Focus vào textbox sau khi sự kiện đã được xử lý
    }, 500);

    callbackPublicFunc(openSearch_Parallax);

    return false;
};

/******************************************************************************************/

var callPublicFunction = function (functionName, context /*, args */) {
    var args = Array.prototype.slice.call(arguments, 2);
    var namespaces = functionName.split(".");
    var func = namespaces.pop();
    for(var i = 0; i < namespaces.length; i++) {
        context = context[namespaces[i]];
    }
    if(typeof context[func] === "function") {
        return context[func].apply(context, args);
    } else {
        //navidebug.log("Function not found: " + functionName);
    }
};

/**
 * ================= Navi+ Scroll Toggle =================
 * Bộ hàm điều khiển Tabbar/Menu dựa trên hướng scroll:
 * 
 * - scrollToHide:   Vào trang đang HIỆN. 
 *                   Scroll xuống -> ẨN, scroll lên -> HIỆN.
 *                   (Thích hợp cho tabbar đáy màn hình)
 * 
 * - scrollToShow:   Vào trang đang ẨN.
 *                   Scroll xuống -> HIỆN, scroll lên -> ẨN.
 *                   (Logic ngược với scrollToHide, 
 *                    thường dùng cho nút action, back-to-top, v.v.)
 * 
 * Điểm chung:
 *  - Tự động thêm CSS transition để ẩn/hiện mượt bằng transform+opacity.
 *  - Hysteresis 20px để tránh rung giật.
 *  - Có check mobile/desktop screen.
 *  - Vẫn tương thích với naviman_version == "simulator".
 * 
 * Lưu ý:
 *  - Nếu tabbar nằm trên cùng màn hình, đổi CSS translateY(100%) thành translateY(-100%).
 *  - Có thể thay đổi thời gian transition (.22s) hoặc hysteresis (20px) theo ý muốn.
 * 
 * Bổ sung:
 *  - Khi behavior = "downShow" (autoShow):
 *      + Nếu cách top < 3px thì menu sẽ LUÔN luôn ẨN.
 *      + Nếu cách bottom < 3px thì menu sẽ LUÔN luôn HIỆN.
 *  - Khi behavior = "downHide" (autoHide):
 *      + Nếu cách top < 3px thì menu sẽ LUÔN luôn HIỆN.
 *      + Nếu cách bottom < 3px thì menu sẽ LUÔN luôn ẨN.
 */

// Các biến cấu hình
const HYSTERESIS = 20;  // px biên tránh rung
const EDGE_LOCK = 3;    // px: biên khóa ở top/bottom

// Hàm chung nội bộ (không gọi trực tiếp)
var _scrollToggle = function (screen, selector, behavior, initial) {
    
    if (typeof naviman_version !== "undefined" && naviman_version === "simulator") return;

    var isMobile = window.innerWidth <= 768;
    if ((isMobile && screen === "desktop") || (!isMobile && screen === "mobile")) return;


    let obj = selector.startsWith('.') ? document.getElementsByClassName(selector.substr(1))[0]
        : selector.startsWith('#') ? document.getElementById(selector.substr(1))
            : document.querySelector(selector);
    if (!obj) return;

    obj.classList.add("navi-anim");
    if (initial === "hide") obj.classList.add("navi-hidden"); else obj.classList.remove("navi-hidden");
    let hidden = obj.classList.contains("navi-hidden");

    const hide = () => { if (!hidden) { obj.classList.add("navi-hidden"); hidden = true; } };
    const show = () => { if (hidden) { obj.classList.remove("navi-hidden"); hidden = false; } };

    let lastY = window.pageYOffset || document.documentElement.scrollTop || 0;

    window.addEventListener("scroll", () => {
        const curY = window.pageYOffset || document.documentElement.scrollTop || 0;
        const maxScroll = document.documentElement.scrollHeight - window.innerHeight;

        // ================= AutoShow =================
        if (behavior === "downShow") {
            // Nếu ở gần top -> luôn ẩn
            if (curY <= EDGE_LOCK) {
                hide();
                lastY = curY;
                return;
            }
            // Nếu ở gần bottom -> luôn hiện
            if ((maxScroll - curY) <= EDGE_LOCK) {
                show();
                lastY = curY;
                return;
            }
        }

        // ================= AutoHide =================
        if (behavior === "downHide") {          
  
            // Nếu ở gần top -> luôn hiện
            if (curY <= EDGE_LOCK) {
                show();
                lastY = curY;
                return;
            }
            // Nếu ở gần bottom -> luôn ẩn
            if ((maxScroll - curY) <= EDGE_LOCK) {
                hide();
                lastY = curY;
                return;
            }
        }

        // ================= Scroll detection =================
        if (curY > lastY + HYSTERESIS) { // scroll xuống
            (behavior === "downHide" ? hide : show)();
            lastY = curY;
        }
        else if (curY < lastY - HYSTERESIS) { // scroll lên
            (behavior === "downHide" ? show : hide)();
            lastY = curY;
        }
    }, { passive: true });
};

/**
 * scrollToHide:
 *  - Vào trang: menu HIỆN.
 *  - Scroll xuống: ẨN.
 *  - Scroll lên: HIỆN.
 */
var scrollToHide = function(screen, cssNaviPrefix){
  _scrollToggle(screen, cssNaviPrefix.trim(), "downHide", "show");
};

/**
 * scrollToShow:
 *  - Vào trang: menu ẨN.
 *  - Scroll xuống: HIỆN.
 *  - Scroll lên: ẨN.
 */
var scrollToShow = function(screen, cssNaviPrefix){
  _scrollToggle(screen, cssNaviPrefix.trim(), "downShow", "hide");
};
/* ================= Navi+ Scroll Toggle ================= */


var openInbox_loopHideChat = function () {
    var isLoop = true;

    var shopifyChatEl = document.querySelector('#ShopifyChat');
    if (shopifyChatEl != null) {
        if( shopifyChatEl.getAttribute("is-open") == "false" )
            if( shopifyChatEl.style.visibility == "visible" ) {
                shopifyChatEl.style.visibility = "hidden";
                isLoop = false;
            }
    } else {
        isLoop = false;
    }

    callbackPublicFunc(openInbox_loopHideChat);

    if( isLoop ) {
        setTimeout(function () {
            openInbox_loopHideChat();
        }, 200);
    }
};

var openInbox_loopHideFAB = function () {
    var isLoop = true;

    var shopifyChatEl = document.querySelector('#ShopifyChat');
    if (shopifyChatEl != null) {
        shopifyChatEl.style.visibility = "hidden";
        isLoop = false;
    }

    if (isLoop) {
        setTimeout(function () {
            openInbox_loopHideFAB();
        }, 200);
    }
};

/**
 * Reset visibility Shopify Inbox nếu platform hiện tại không nên bị ẩn bởi open:Inbox.
 *
 * - Trên mobile: nếu menu đang ẨN (hasMobile == false) thì đảm bảo Shopify Inbox hiển thị.
 * - Trên desktop: nếu menu đang ẨN (hasDesktop == false) thì đảm bảo Shopify Inbox hiển thị.
 *
 * @param {boolean} hasMobile  Menu được bật hiển thị trên mobile hay không (setting mobileDisplay)
 * @param {boolean} hasDesktop Menu được bật hiển thị trên desktop hay không (setting desktopDisplay)
 */
var resetShopifyInboxVisibilityForPlatform = function (hasMobile, hasDesktop) {
    var shopifyChatEl = document.querySelector('#ShopifyChat');
    if (!shopifyChatEl) return;

    var shouldShow = false;

    if (window.innerWidth <= 768 && !hasMobile) shouldShow = true;
    if (window.innerWidth >= 769 && !hasDesktop) shouldShow = true;

    if (shouldShow && shopifyChatEl.style.visibility === 'hidden') {
        shopifyChatEl.style.visibility = 'visible';
    }
};

/**
 * Xử lý ẩn/hiện Shopify Inbox khi gặp menu item có url open:Inbox.
 *
 * Logic theo cấu hình:
 *  - Menu chỉ mobile  (hasMobile && !hasDesktop): ẩn Inbox trên mobile, không đụng desktop.
 *  - Menu chỉ desktop (!hasMobile && hasDesktop): ẩn Inbox trên desktop, không đụng mobile.
 *  - Menu cả hai (hasMobile && hasDesktop): ẩn Inbox trên cả mobile + desktop (giữ behavior cũ).
 *  - Nếu menu bị ẩn trên platform hiện tại: đảm bảo Inbox được hiển thị lại (không bị inline style cũ giữ lại).
 *
 * @param {boolean} hasMobile  Menu được bật hiển thị trên mobile hay không (setting mobileDisplay)
 * @param {boolean} hasDesktop Menu được bật hiển thị trên desktop hay không (setting desktopDisplay)
 */
var handleOpenInboxVisibility = function (hasMobile, hasDesktop) {
    var viewportWidth = window.innerWidth || document.documentElement.clientWidth || 0;
    var isMobileViewport = viewportWidth <= 768;
    var isDesktopViewport = viewportWidth >= 769;

    var isMobileOnly = hasMobile && !hasDesktop;
    var isDesktopOnly = hasDesktop && !hasMobile;

    var shouldHide = false;

    if (isMobileOnly && isMobileViewport) shouldHide = true;
    else if (isDesktopOnly && isDesktopViewport) shouldHide = true;
    else if (hasMobile && hasDesktop) shouldHide = true;

    if (shouldHide) {
        openInbox_loopHideFAB();
    } else {
        resetShopifyInboxVisibilityForPlatform(hasMobile, hasDesktop);
    }
};

var openInbox = function() {
    if( document.querySelector('#ShopifyChat') == null ) {
        console.log("Navi+: Shopify inbox is not installed. Read document <a target='_blank' href='https://help.naviplus.io/docs/integrations/chat-tools/shopify-inbox/'>here</a>");
    }

    var divMenu = document.querySelector('#ShopifyChat').shadowRoot.querySelector('.chat-toggle');
    document.querySelector('#ShopifyChat').style.visibility = "visible";
    divMenu.addEventListener('click', () => {});
    divMenu.click();

    callbackPublicFunc(openInbox);

    setTimeout(function() {
        openInbox_loopHideChat();
    }, 200);

};

var openInboxWithoutReplace = function() {
    if( document.querySelector('#ShopifyChat') == null ) {
        console.log("Navi+: Shopify inbox is not installed. Read document <a target='_blank' href='https://help.naviplus.io/docs/integrations/chat-tools/shopify-inbox/'>here</a>");
    }

    var divMenu = document.querySelector('#ShopifyChat').shadowRoot.querySelector('.chat-toggle');
    document.querySelector('#ShopifyChat').style.visibility = "visible";
    divMenu.addEventListener('click', () => {});
    divMenu.click();

    callbackPublicFunc(openInboxWithoutReplace);
};

var openShareMe = function(){
    if (navigator.share) {
        navigator.share({
            title: document.title,
            text: "Navi+ share",
            url: window.location.href
        })
            .then(() => navidebug.log('Successful share'))
            .catch(error => navidebug.error('Error sharing:', error));
    }else
    navidebug.log("This device does not support share directly!");

    callbackPublicFunc(openShareMe);
}


var callbackPublicFunc = function(func, embedID = "") {
    let callbackName = `Navi.${func.name}_Callback`;

    if (window.Navi)
    {
        if (typeof eval(callbackName) === 'function') {
            eval(callbackName + '("'+ embedID +'")' );
            navidebug.log('Executed: '+ `${callbackName}` + '("'+ embedID +'") ');
        } else {
            // navidebug.log(`${callbackName} is not found!`);
        }
    }else
    navidebug.log(`The function ${callbackName} is not defined.`);
}

var callbackPublicFunc_delay = function(func, embedID = "") {
    setTimeout(() => { callbackPublicFunc(func, embedID); }, 500);
}

function goBack() {
    window.history.back();
}

function goForward() {
    window.history.forward();
}    var asyncGetCart = async function(opts) {
    var forceFetch = opts && opts.forceFetch;
    if (!forceFetch && window.NaviEnv && typeof window.NaviEnv.cartItem !== 'undefined') {
        console.log('Cart count loaded from NaviEnv.cartItem');
        return { item_count: window.NaviEnv.cartItem };
    }

    const result = await fetch(window.Shopify.routes.root + 'cart.json');

    if (result.status === 200) {
        var data = await result.json();
        if (window.NaviEnv && typeof data.item_count !== 'undefined') {
            window.NaviEnv.cartItem = data.item_count;
        }
        return data;
    }
    throw new Error(`Failed to get request, Shopify returned ${result.status} ${result.statusText}`);
};

var updateCartCount = function( item_count ) {
    setCartCount(item_count);
    // Todo 19/6: Chỗ này cần test kỹ càng, ko work rồi vì nếu trộn lẫn thì sẽ ko chạy
    var isHideBadge = false;
    var span = document.querySelectorAll('li.item_badge_withcount span.cart_count');
    for (var i = 0; i < span.length; i++) {
        span[i].textContent = item_count;
        if( item_count == 0 ) {
            span[i].style.display = "none";
            isHideBadge = true;
        }
        else
            span[i].style.display = "initial";
    }

    var span = document.querySelectorAll('li.child_badge_withcount span.cart_count');
    for (var i = 0; i < span.length; i++) {
        span[i].textContent = item_count;
        if( item_count == 0 ) {
            span[i].style.display = "none";
            isHideBadge = true;
        }
        else
            span[i].style.display = "initial";
    }

    if( item_count == 0 ) {
        document.documentElement.style.setProperty('--cart-count-number', '');
    }else {
        document.documentElement.style.setProperty('--cart-count-number', `"${item_count}"`);
    }

    const root = document.querySelector(":root");
    if( isHideBadge )
        root.style.setProperty("--cart-count-text", '""');
    else
        root.style.setProperty("--cart-count-text", '"●"');

    callbackPublicFunc(updateCartCount);
};

var checkAndUpdateCartCount = function() {
    asyncGetCart({ forceFetch: true }).then(function(result) {
        updateCartCount(result.item_count);
    });
};

var setCartCount =  function(count)
{
    cartCount = count;
};

/*window.addEventListener('SCE:mutate', (event) => {
    updateCartCount();
});*/

/** Library for cart event listener ********************/
(function () {
    if (!window || !window.Shopify) return;

    const CartEvents = {
        add: "SCE:add",
        update: "SCE:update",
        change: "SCE:change",
        clear: "SCE:clear",
        mutate: "SCE:mutate",
    };

    const ShopifyCartURLs = [
        "/cart/add",
        "/cart/update",
        "/cart/change",
        "/cart/clear",
        "/cart/add.js",
        "/cart/update.js",
        "/cart/change.js",
        "/cart/clear.js",
    ];

    function isShopifyCartURL(url) {
        if (!url) return false;
        if (typeof url === 'string' || url instanceof String) {
            const path = url.split("/").pop();
            return ShopifyCartURLs.includes(`/cart/${path}`);
        }
        return false;
    }

    function updateType(url) {
        if (!url) return false;
        if (url.includes("cart/add")) {
            return "add";
        } else if (url.includes("cart/update")) {
            return "update";
        } else if (url.includes("cart/change")) {
            return "change";
        } else if (url.includes("cart/clear")) {
            return "clear";
        } else return false;
    }

    function dispatchEvent(url, detail) {
        if (typeof detail === "string") {
            try {
                detail = JSON.parse(detail);
                navidebug.log( detail );
            } catch (err) {

            }
        }

        window.dispatchEvent(new CustomEvent(CartEvents.mutate, { detail }));
        const type = updateType(url);
        switch (type) {
            case "add":
                window.dispatchEvent(new CustomEvent(CartEvents.add, { detail }));
                break;
            case "update":
                window.dispatchEvent(new CustomEvent(CartEvents.update, { detail }));
                break;
            case "change":
                window.dispatchEvent(new CustomEvent(CartEvents.change, { detail }));
                break;
            case "clear":
                window.dispatchEvent(new CustomEvent(CartEvents.clear, { detail }));
                break;
            default:
                break;
        }
    }

    function XHROverride() {
        if (!window.XMLHttpRequest) return;

        const originalOpen = window.XMLHttpRequest.prototype.open;
        window.XMLHttpRequest.prototype.open = function () {
            const url = arguments[1];
            this.addEventListener("load", function () {
                if (isShopifyCartURL(url)) {
                    dispatchEvent(url, this.response);
                }
            });
            return originalOpen.apply(this, arguments);
        };
    }

    function fetchOverride() {
        if (!window.fetch || typeof window.fetch !== "function") return;
        const originalFetch = window.fetch;
        window.fetch = function () {
            const response = originalFetch.apply(this, arguments);

            if (isShopifyCartURL(arguments[0])) {
                response.then((res) => {
                    res
                        .clone()
                        .json()
                        .then((data) => dispatchEvent(res.url, data));
                });
            }

            return response;
        };
    }

    fetchOverride();
    XHROverride();
})();


/********************************************************** 
    Chờ số lượng trong giỏ hàng thay đổi thì cập nhật biến CSS
***********************************************************/

/* 
window.addEventListener('load', function () {
  naviman.bindELToCartCount('#cart_link span');
});
*/


function bindELToCartCount(targetSelector, cssVarName = "cart-count-number") {
    navidebug.log("📦 bindELToCartCount started...");

  function setVarIfExists() {
    const el = document.querySelector(targetSelector);
    if (!el) {
        navidebug.log("❌ targetSelector not found:", targetSelector);
      return false;
    }

    const value = el.textContent.trim();
    // navidebug.log(`🔍 Found target. Value = "${value}"`);
    
    document.documentElement.style.setProperty(`--${cssVarName}`, `"${value}"`);
    
    if (value === '' || value === '0') {
      setOpacityOfCartBadge(0);
    } else {
      setOpacityOfCartBadge(1);
    }

    return true;
  }

  function setOpacityOfCartBadge(val) {
    navidebug.log(`🎯 Setting opacity of cart badge to: ${val}`);
    const elements = document.querySelectorAll(
      '.naviItem ul li.item_badge.item_badge_withcount > .inner .icon, ' +
      '.naviItem ul li.item_badge.item_badge_withcount > .inner .image'
    );

    if (!elements.length) {
        navidebug.log("⚠️ No badge elements found.");
      return;
    }

    elements.forEach(el => {
      el.classList.toggle('hide-before', val === 0);
    });

    // navidebug.log(`🎯 Badge visibility set: ${val === 0 ? 'hidden' : 'visible'}`);
  }

    // Gọi lần đầu để có thể xử lý ngay nếu phần tử đã có
    setVarIfExists();

    // Theo dõi mỗi 1 giây
    setInterval(() => {
      setVarIfExists();
    }, 1000);
}

function waitElementToAddStyle(selector, styleString) {
  const interval = setInterval(() => {
    const el = document.querySelector(selector);
    if (el) {
      styleString.split(';').forEach(rule => {
        const [property, value] = rule.split(':').map(str => str && str.trim());
        if (property && value) {
          el.style.setProperty(property, value.replace(/!important/g, '').trim(), 'important');
        }
      });
      navidebug.log(`✅ Style applied to ${selector}: ${styleString}`);
      clearInterval(interval);
    } else {
        navidebug.log(`⏳ Waiting for ${selector}...`);
    }
  }, 500);
}    /******** LOCAL STORAGE ******************************/
function setLocalStorage(key, value, ttl = 15000) {

    if( !naviman.isLocalStorageSupported() )
        return null;

    const now = new Date()

    // `item` is an object which contains the original value
    // as well as the time when it's supposed to expire
    const item = {
        value: value,
        expiry: now.getTime() + ttl,
    }
    localStorage.setItem(key, JSON.stringify(item))
}

function getLocalStorage(key) {
    if( !naviman.isLocalStorageSupported() )
        return null;

    const itemStr = localStorage.getItem(key)
    // if the item doesn't exist, return null
    if (!itemStr) {
        return null
    }
    const item = JSON.parse(itemStr)
    const now = new Date()
    // compare the expiry time of the item with the current time
    if (now.getTime() > item.expiry) {
        // If the item is expired, delete the item from storage
        // and return null
        localStorage.removeItem(key)
        return null
    }
    return item.value
}

function turnOffLocalStorage() {
    // Kiểm tra nếu hàm đã được gọi trước đó
    if (window._localStorageDisabled) {
        navidebug.log("LocalStorage has already been disabled.");
        return;
    }

    navidebug.log("----- TURN OFF: LOCALSTORAGE ------");

    // Ghi đè thuộc tính localStorage
    Object.defineProperty(window, 'localStorage', {
        get() {
            navidebug.error('LocalStorage is disabled.');
        }
    });

    // Đặt cờ để ngăn việc gọi lại
    window._localStorageDisabled = true;
}


function isLocalStorageSupported() {
    // Nếu kết quả đã được lưu, trả về ngay
    if (typeof window._localStorageSupport !== 'undefined') {
        return window._localStorageSupport;
    }

    // Kiểm tra hỗ trợ localStorage
    try {
        const testKey = '__test__';
        localStorage.setItem(testKey, 'test');
        localStorage.removeItem(testKey);
        window._localStorageSupport = true; // Lưu kết quả vào window
    } catch (e) {
        window._localStorageSupport = false; // Lưu kết quả vào window
    }

    return window._localStorageSupport;
}


/******** SESSION STORAGE ******************************/

function setSessionStorage(key, value) {
    if (!naviman.isSessionStorageSupported()) {
        return null;
    }

    // Lưu dữ liệu dưới dạng chuỗi JSON
    const item = { value: value };
    sessionStorage.setItem(key, JSON.stringify(item));
}

function getSessionStorage(key) {
    if (!naviman.isSessionStorageSupported()) {
        return null;
    }

    const itemStr = sessionStorage.getItem(key);
    // Nếu không tìm thấy, trả về null
    if (!itemStr) {
        return null;
    }

    // Parse dữ liệu JSON và trả về giá trị gốc
    const item = JSON.parse(itemStr);
    return item.value !== undefined ? item.value : null;
}

function isSessionStorageSupported() {
    // Nếu kết quả đã được lưu, trả về ngay
    if (typeof window._sessionStorageSupport !== 'undefined') {
        return window._sessionStorageSupport;
    }

    // Kiểm tra hỗ trợ sessionStorage
    try {
        const testKey = '__test__';
        sessionStorage.setItem(testKey, 'test');
        sessionStorage.removeItem(testKey);
        window._sessionStorageSupport = true; // Lưu kết quả vào window
    } catch (e) {
        window._sessionStorageSupport = false; // Lưu kết quả vào window
    }

    return window._sessionStorageSupport;
}
    /**
 * ZIndex.js — Quản lý z-index cho menu Navi+ và xử lý floating element bên thứ ba
 *
 * ==================================================================================
 * TỔNG QUAN
 * ==================================================================================
 * Module này có hai nhiệm vụ chính:
 * 1. Quản lý z-index của Tabbar/FAB và overlay khi mở/đóng menu Navi+.
 * 2. Theo dõi floating element (drawer, modal, popup) của theme/website bên thứ ba:
 *    khi có floating hiển thị → hạ z-index Tabbar/FAB xuống 1 để tránh đè lên;
 *    khi floating ẩn → khôi phục z-index như cũ.
 *
 * ==================================================================================
 * LUỒNG FLOATING OBSERVER (cơ chế chính)
 * ==================================================================================
 *
 * 1. Khởi động (initOverlayObserver):
 *    - Chạy khi trang load (document.readyState === "complete" hoặc "interactive",
 *      hoặc sự kiện "load" nếu chưa sẵn sàng).
 *    - Chỉ chạy 1 lần/trang (cờ window._naviZIndexOverlayObserverStarted).
 *    - Gọi _initOverlayBaseline() để ghi nhận "baseline" (xem mục 2).
 *    - Gọi observeOverlaysAndAdjustZIndex() để thiết lập cơ chế burst.
 *
 * 2. Baseline (tránh nhầm layout cố định với floating):
 *    - Lúc observer bắt đầu, thu thập tất cả element thỏa:
 *      position ∈ {fixed, absolute, sticky}, z-index > 0, đang hiển thị.
 *    - Lưu vào ZIndex._baselineOverlayElements.
 *    - Các element này (header sticky, thanh thông báo, …) KHÔNG dùng để trigger down z-index.
 *    - Chỉ element xuất hiện SAU baseline mới được coi là floating cần xử lý.
 *
 * 3. Burst mode (theo dõi theo tương tác người dùng):
 *    - KHÔNG polling liên tục để tránh nặng web.
 *    - Chỉ chạy khi user click hoặc touch (listener trên document, capture).
 *    - Mỗi lần tương tác: tạo burst tối đa 2 tick, mỗi tick cách 300ms.
 *    - Tick 1 chạy sau 300ms, tick 2 (nếu có) chạy sau 600ms.
 *    - Nếu tick nào phát hiện floating active → dừng burst ngay (không chạy tick còn lại).
 *
 * 4. Mỗi tick (runBurstTick):
 *    a) Kiểm tra nhanh: nếu trang không có .naviItem.STICKY_TABBAR hoặc
 *       .naviItem.STICKY_FAB_SUPPORT → return ngay (tránh quét DOM vô ích).
 *    b) Gọi _hasActiveOverlay() để quét DOM tìm floating.
 *    c) Nếu active (có floating): _applyFloatingActiveState(true) → downNaviMenuZIndex().
 *    d) Nếu không active (hết floating): _applyFloatingActiveState(false) → restoreNaviMenuZIndex().
 *
 * 5. Thu thập candidate floating (_collectActiveOverlayCandidates):
 *    Quét mọi element trong document, lọc theo:
 *    - position:relative + z-index số > 0 → coi là fake z-index floating (log debug, bỏ qua)
 *    - position ∈ {fixed, absolute} — loại sticky vì là layout cố định, không che lấp menu
 *    - z-index là số, khác 0, khác "auto"
 *    - _isElementActive(el): display≠none, visibility≠hidden, opacity≠0
 *    - _isNaviElement(el) = false: loại bỏ element thuộc Navi+ (menu, overlay, hamburger overlay, …)
 *    - _isIgnoredThirdPartyOverlayHost(el): bỏ qua host theme (vd quick-add-component, nhiều instance trên PLP)
 *    - Diện tích (width×height) ≥ 30000 px² (~1/10 màn hình): bỏ qua vùng nhỏ (icon, nút).
 *    - Fake off-canvas drawer: _fakeReason_OffCanvasDrawerTransform (translate ≥100% theo trục + neo cạnh).
 *
 * 6. Chọn floating thực sự (_findActiveOverlayInDOM):
 *    - Lấy danh sách candidate từ _collectActiveOverlayCandidates.
 *    - Loại trừ element nằm trong baseline.
 *    - Chọn element có z-index cao nhất.
 *
 * 7. Down / Restore z-index:
 *    - downNaviMenuZIndex: set z-index của .naviItem.STICKY_TABBAR, .naviItem.STICKY_FAB_SUPPORT,
 *      .naviman_app_overlay xuống 1 (lưu giá trị gốc trong _elementMinStore).
 *    - restoreNaviMenuZIndex: khôi phục z-index đã lưu.
 *
 * ==================================================================================
 * CÁC HÀM KHÁC (menu Navi+, section, …)
 * ==================================================================================
 * - setZIndexMax / restoreZIndexMax: nâng/hồi phục z-index khi mở/đóng submenu (tabbar, fab).
 * - downOtherSectionsZIndex / restoreAllSectionZIndex: xử lý section khi mở mega menu.
 * - pushElementToMax / restoreElementFromMax: nâng max z-index cho container desktop mega menu.
 * - pushElementToMin / restoreElementFromMin: hạ z-index xuống 1 (dùng chung cho down/restore).
 */
var ZIndex = ZIndex || {};

ZIndex._storageKey = 'menuZIndexMapNaviSticky';

/**
 * Phân loại "overlay/floating element" để phục vụ thuật toán auto down z-index.
 *
 * Yêu cầu thực tế:
 * - Ta chỉ muốn coi element là "floating thật" khi nó có khả năng che phủ UI Navi+ (tabbar/fab).
 * - Tuy nhiên, ngoài đời có nhiều element "giả floating" (fake floating):
 *   - Có z-index cao + position fixed/absolute nhưng thực tế ẩn (opacity:0),
 *   - Hoặc bị đẩy ra khỏi viewport (left/top âm lớn hoặc vượt quá kích thước viewport),
 *   - Hoặc margin-left/margin-top cực trị khiến nó nằm ngoài màn hình.
 *   - Off-canvas drawer đóng: translate theo % với |giá trị| ≥ 100% (100%, 120%, …) kết hợp
 *     position fixed/absolute + neo cạnh — kể cả khi theme đẩy xa hơn một bề rộng (>100%).
 *   - Có z-index số > 0 nhưng position:relative — không phải lớp floating viewport (chỉ xếp chồng trong flow).
 *   - Host absolute/fixed + background #0000/transparent, không ảnh nền, không shadow/backdrop/filter/viền đục
 *     — thường là wrapper (vd quick-add) có con, không phải overlay che màn hình.
 *
 * Fake floating KHÔNG được dùng để trigger down z-index, nhưng cần log ra console để debug
 * (vì nó khiến thuật toán detect overlay dễ bị hiểu nhầm).
 *
 * Trả về object:
 * - shouldConsider: true nếu element là ứng viên overlay cần cân nhắc (tức "floating thật" theo tiêu chí)
 * - isFakeFloating: true nếu element rơi vào nhóm fake floating
 * - fakeReasons: mảng lý do (string) để log
 */
ZIndex._classifyOverlayElement = function (el, style, rect) {
    if (!el) {
        return { shouldConsider: false, isFakeFloating: false, fakeReasons: [] };
    }

    style = style || window.getComputedStyle(el);

    // display/visibility: nếu không render thì bỏ qua hoàn toàn (không coi là fake).
    if (style.display === "none") {
        return { shouldConsider: false, isFakeFloating: false, fakeReasons: [] };
    }
    if (style.visibility === "hidden") {
        return { shouldConsider: false, isFakeFloating: false, fakeReasons: [] };
    }

    // rect: dùng để đo vị trí trong viewport (có thể throw ở một số trường hợp hiếm).
    rect = rect || (function () {
        try { return el.getBoundingClientRect(); } catch (e) { return null; }
    })();

    var vw = (typeof window !== "undefined" && window.innerWidth) ? window.innerWidth : 0;
    var vh = (typeof window !== "undefined" && window.innerHeight) ? window.innerHeight : 0;
    var fakeReasons = ZIndex._getFakeFloatingReasons(el, style, rect, vw, vh);
    if (fakeReasons && fakeReasons.length) return { shouldConsider: false, isFakeFloating: true, fakeReasons: fakeReasons };

    return { shouldConsider: true, isFakeFloating: false, fakeReasons: [] };
};

/**
 * Trả về danh sách "lý do" khiến element được coi là fake floating.
 *
 * Mục tiêu:
 * - Trong thực tế, có nhiều element có position fixed/absolute + z-index cao nhưng KHÔNG che UI
 *   (ví dụ: widget chat ẩn bằng opacity:0, container bị đẩy ra ngoài viewport, v.v...).
 * - Nếu ta coi nhầm các element này là overlay thật, thuật toán sẽ "down" z-index Tabbar/FAB sai,
 *   làm menu bị tụt xuống dưới không cần thiết.
 *
 * Quy ước:
 * - Chỉ cần 1 điều kiện fake đúng → element là fake floating.
 * - Mỗi điều kiện fake sẽ push 1 string vào fakeReasons để debug (log 1 lần/element ở nơi gọi).
 *
 * Lưu ý:
 * - Hàm này KHÔNG kiểm tra display/visibility (đã check ở _classifyOverlayElement trước đó).
 * - Các hàm con cố tình "fail-safe": nếu thiếu dữ liệu (rect/vw/vh) thì bỏ qua điều kiện đó,
 *   tránh classify sai vì thiếu thông tin.
 */
ZIndex._getFakeFloatingReasons = function (el, style, rect, vw, vh) {
    // tolerance: ngưỡng "cho phép lệch" khi kiểm tra ra khỏi viewport/margin.
    // - Ví dụ rect.left = -1 là sai số do rounding/layout, không nên coi là fake.
    // - Chỉ khi < -20 hoặc > viewport mới coi là "đẩy ra khỏi màn hình" rõ rệt.
    var tolerance = 20;

    var reasons = [];

    // Điều kiện fake #1: opacity:0 → element "vô hình", nhìn giống overlay nhưng thực tế không che UI.
    ZIndex._fakeReason_OpacityZero(reasons, style);

    // Điều kiện fake #1b: filter/backdrop-filter opacity(0) → element có thể bị "ẩn" dù opacity vẫn là 1.
    // Case này hay gặp ở widget/theme dùng filter để fadeOut.
    ZIndex._fakeReason_FilterOpacityZero(reasons, style);

    // Điều kiện fake #1c: clip-path khiến element bị cắt về 0 diện tích (vd: circle(0)).
    ZIndex._fakeReason_ClipPathZero(reasons, style);

    // Điều kiện fake #1d: transform scale(0) khiến element về 0 kích thước hiển thị.
    ZIndex._fakeReason_TransformScaleZero(reasons, style);

    // Điều kiện fake #2: rect nằm ngoài viewport → element bị đẩy ra khỏi màn hình.
    ZIndex._fakeReason_OutOfViewport(reasons, rect, vw, vh, tolerance);

    // Điều kiện fake #3: margin cực trị → element bị kéo ra ngoài màn hình do margin-left/top.
    ZIndex._fakeReason_ExtremeMargin(reasons, style, vw, vh, tolerance);

    // Điều kiện fake #3b: drawer off-canvas đóng — translate theo trục ≥100% (%) + neo cạnh (không dùng rect vì có thể lệch transition).
    ZIndex._fakeReason_OffCanvasDrawerTransform(reasons, style);

    // Điều kiện fake #4: click-catcher rỗng + không background.
    // - Nhiều website tạo 1 lớp overlay trong suốt để bắt click rồi phân phối lại (event delegation),
    //   element này thường không có "ruột" thật (text chỉ whitespace/&nbsp;) và background không set.
    // - Nó vẫn có thể có position fixed/absolute + z-index cao, nên dễ bị nhận nhầm là floating overlay.
    ZIndex._fakeReason_EmptyNoBackground(reasons, el, style);

    // Điều kiện fake #5: lớp vẽ hoàn toàn trong suốt nhưng có phần tử con (empty-no-bg không bắt được).
    ZIndex._fakeReason_InvisiblePaintLayer(reasons, style);

    return reasons;
};

/**
 * Fake condition: position:relative + z-index số > 0 ("fake z-index floating")
 *
 * Vì sao fake:
 * - Thuật toán overlay chỉ quan tâm lớp fixed/absolute có thể phủ viewport.
 * - relative + z-index chỉ tạo stacking context trong luồng tài liệu, không phải modal/drawer floating
 *   theo nghĩa cần down z-index Tabbar/FAB.
 *
 * Khi nào áp dụng:
 * - Gọi từ _collectActiveOverlayCandidates (trước nhánh fixed/absolute) vì relative không đi vào _classifyOverlayElement.
 */
ZIndex._fakeReason_PositionRelativeZIndex = function (reasons, style) {
    if (!reasons || !style) return;
    if (style.position !== "relative") return;
    var z = style.zIndex;
    if (!z || z === "auto") return;
    var zNum = parseInt(z, 10);
    if (!isNaN(zNum) && zNum > 0) reasons.push("position:relative+z-index");
};

/**
 * Fake condition: opacity:0
 *
 * Vì sao fake:
 * - Rất nhiều widget/pop-up "ẩn" bằng opacity:0 để giữ DOM + animation.
 * - Chúng vẫn có position fixed/absolute + z-index cao, nên nếu chỉ nhìn z-index sẽ bị nhận nhầm.
 *
 * Khi nào áp dụng:
 * - Nếu parseFloat(opacity) ra số và đúng bằng 0 → coi là fake.
 *
 * Ghi chú:
 * - Nếu opacity là "auto"/"" (hiếm) → parseFloat NaN → bỏ qua.
 */
ZIndex._fakeReason_OpacityZero = function (reasons, style) {
    if (!reasons || !style) return;
    var opacityNum = parseFloat(style.opacity);
    if (!isNaN(opacityNum) && opacityNum === 0) reasons.push("opacity:0");
};

/**
 * Fake condition: filter/backdrop-filter opacity(0)
 *
 * Vì sao cần:
 * - Một số site không dùng `opacity:0` mà dùng `filter: opacity(0)` để ẩn/fade element.
 * - Lúc này computed `style.opacity` vẫn có thể là 1, nên điều kiện opacity:0 sẽ không bắt được.
 *
 * Tiêu chí:
 * - Nếu `filter` hoặc `backdrop-filter` có function `opacity(0)` hoặc `opacity(0%)` → coi là fake.
 *
 * Lưu ý:
 * - Đây là heuristic theo string; không parse đầy đủ CSS filter grammar để tránh nặng.
 */
ZIndex._fakeReason_FilterOpacityZero = function (reasons, style) {
    if (!reasons || !style) return;
    var f = (style.filter || "").toLowerCase();
    var bf = (style.backdropFilter || "").toLowerCase();
    // Bắt các dạng: opacity(0), opacity(0.0), opacity(0%), opacity(.0)
    var re = /opacity\(\s*(0|0\.0+|\.0+)\s*%?\s*\)/;
    if (f && re.test(f)) reasons.push("filter:opacity(0)");
    if (bf && re.test(bf)) reasons.push("backdrop-filter:opacity(0)");
};

/**
 * Fake condition: clip-path cắt về 0 diện tích (heuristic)
 *
 * Vì sao cần:
 * - Một số widget dùng clip-path để "ẩn" element (vd: circle(0) hoặc inset gần như 100%).
 * - Element vẫn có position/z-index cao nhưng thực tế không hiển thị.
 *
 * Tiêu chí (heuristic):
 * - clip-path chứa "circle(0" hoặc "inset(50%" (case thường gặp để cắt gần hết).
 *
 * Lưu ý:
 * - Không thể xác định chính xác mọi clip-path; mình bắt những pattern phổ biến, an toàn.
 */
ZIndex._fakeReason_ClipPathZero = function (reasons, style) {
    if (!reasons || !style) return;
    var cp = (style.clipPath || "").toLowerCase();
    if (!cp || cp === "none") return;
    if (cp.indexOf("circle(0") !== -1) reasons.push("clip-path:circle(0)");
    else if (cp.indexOf("inset(50%") !== -1) reasons.push("clip-path:inset(50%)");
};

/**
 * Fake condition: transform scale(0) / matrix scale ~ 0
 *
 * Vì sao cần:
 * - Nhiều animation ẩn bằng scale(0) (hoặc transform matrix tương đương).
 * - Rect đôi khi vẫn "có số" trong một số browser/transition timing, nên out-of-viewport không bắt được.
 *
 * Tiêu chí:
 * - transform = "none" → bỏ qua.
 * - transform chứa "scale(0" hoặc "scale3d(0" → coi là fake.
 * - Hoặc transform là matrix(...) / matrix3d(...) với scale (a,d) gần 0 → coi là fake.
 *
 * Lưu ý:
 * - Đây là heuristic nhẹ, tránh tính toán nặng. Dùng ngưỡng 0.001 để chống noise/rounding.
 */
ZIndex._fakeReason_TransformScaleZero = function (reasons, style) {
    if (!reasons || !style) return;
    var t = (style.transform || "").toLowerCase();
    if (!t || t === "none") return;

    if (t.indexOf("scale(0") !== -1 || t.indexOf("scale3d(0") !== -1) {
        reasons.push("transform:scale(0)");
        return;
    }

    // matrix(a, b, c, d, tx, ty) → scaleX ~ a, scaleY ~ d (khi không có skew/rotate phức tạp)
    // Dùng heuristic: nếu a và d đều rất nhỏ → coi là scale 0.
    var m2 = t.match(/^matrix\(\s*([-\d.]+)\s*,\s*([-\d.]+)\s*,\s*([-\d.]+)\s*,\s*([-\d.]+)\s*,/);
    if (m2) {
        var a = parseFloat(m2[1]);
        var d = parseFloat(m2[4]);
        if (!isNaN(a) && !isNaN(d) && Math.abs(a) < 0.001 && Math.abs(d) < 0.001) {
            reasons.push("transform:matrix(scale~0)");
            return;
        }
    }

    // matrix3d: scaleX = m11, scaleY = m22 (theo layout chuẩn)
    var m3 = t.match(/^matrix3d\(\s*([-\d.]+)\s*,\s*([-\d.]+)\s*,\s*([-\d.]+)\s*,\s*([-\d.]+)\s*,\s*([-\d.]+)\s*,\s*([-\d.]+)\s*,\s*([-\d.]+)\s*,\s*([-\d.]+)\s*,\s*([-\d.]+)\s*,\s*([-\d.]+)\s*,\s*([-\d.]+)\s*,\s*([-\d.]+)\s*,\s*([-\d.]+)\s*,\s*([-\d.]+)\s*,\s*([-\d.]+)\s*,\s*([-\d.]+)\s*\)/);
    if (m3) {
        var sx = parseFloat(m3[1]);  // m11
        var sy = parseFloat(m3[6]);  // m22
        if (!isNaN(sx) && !isNaN(sy) && Math.abs(sx) < 0.001 && Math.abs(sy) < 0.001) {
            reasons.push("transform:matrix3d(scale~0)");
            return;
        }
    }
};

/**
 * Fake condition: element bị đẩy ra khỏi viewport (getBoundingClientRect)
 *
 * Vì sao fake:
 * - Nhiều overlay container tồn tại sẵn nhưng được đặt ở ngoài màn hình (off-canvas) cho đến khi mở.
 * - Trường hợp này không nên trigger down z-index vì UI thực tế không bị che.
 *
 * Khi nào áp dụng:
 * - Cần có đủ rect + vw + vh (để so sánh đúng).
 * - Các check (với tolerance):
 *   - rect.left < -tolerance
 *   - rect.left > vw
 *   - rect.top < -tolerance
 *   - rect.top > vh
 */
ZIndex._fakeReason_OutOfViewport = function (reasons, rect, vw, vh, tolerance) {
    if (!reasons) return;
    if (!rect || !vw || !vh) return;
    if (rect.left < -tolerance) reasons.push("left<-20 (" + rect.left + ")");
    if (rect.left > vw) reasons.push("left>viewportWidth (" + rect.left + ">" + vw + ")");
    if (rect.top < -tolerance) reasons.push("top<-20 (" + rect.top + ")");
    if (rect.top > vh) reasons.push("top>viewportHeight (" + rect.top + ">" + vh + ")");
};

/**
 * Fake condition: margin-left / margin-top cực trị
 *
 * Vì sao fake:
 * - Một số theme/widget dùng margin cực trị để đẩy element ra ngoài màn hình (hoặc căn "hacky").
 * - Dù rect có thể chưa phản ánh rõ (do transform/transition), margin vẫn cho tín hiệu mạnh.
 *
 * Khi nào áp dụng:
 * - parseFloat(marginLeft/marginTop) ra số (nếu "auto" → NaN thì bỏ qua).
 * - Các check (với tolerance):
 *   - margin-left < -tolerance
 *   - margin-left > vw
 *   - margin-top < -tolerance
 *   - margin-top > vh
 */
ZIndex._fakeReason_ExtremeMargin = function (reasons, style, vw, vh, tolerance) {
    if (!reasons || !style) return;
    var marginLeft = parseFloat(style.marginLeft);
    var marginTop = parseFloat(style.marginTop);
    if (!isNaN(marginLeft)) {
        if (marginLeft < -tolerance) reasons.push("margin-left<-20 (" + marginLeft + ")");
        if (vw && marginLeft > vw) reasons.push("margin-left>viewportWidth (" + marginLeft + ">" + vw + ")");
    }
    if (!isNaN(marginTop)) {
        if (marginTop < -tolerance) reasons.push("margin-top<-20 (" + marginTop + ")");
        if (vh && marginTop > vh) reasons.push("margin-top>viewportHeight (" + marginTop + ">" + vh + ")");
    }
};

/**
 * Fake condition: off-canvas panel / drawer đang ở trạng thái "đóng" (ẩn ngoài viewport)
 *
 * Vì sao cần:
 * - Nhiều theme dùng pattern: position fixed|absolute + neo một cạnh (left/right/top/bottom) + transform
 *   translateX/Y(±100%) để đẩy toàn bộ panel ra khỏi màn hình theo đúng kích thước bản thân.
 * - Element vẫn có z-index cao và diện tích lớn, nhưng không che Tabbar/FAB — không nên down z-index.
 *
 * Tiêu chí (heuristic, parse % từ chuỗi transform computed):
 * - position ∈ {fixed, absolute}.
 * - Ít nhất một trong top/right/bottom/left khác "auto" (có neo cạnh).
 * - Trục X: lấy % từ translateX(…%), translate(…%, …) / translate(…%,) đối số đầu, translate3d(…%, …
 *   → trái nếu giá trị ≤ -100%; phải nếu ≥ +100% (bao gồm 120%, 150%, …).
 * - Trục Y: translateY(…%), translate(…, …%) đối số sau, translate3d(…, …%, …
 *   → trên nếu ≤ -100%; dưới nếu ≥ +100%.
 * - Ghép neo: X âm + left; X dương + right; Y âm + top; Y dương + bottom.
 *
 * Lưu ý:
 * - Không parse matrix(); chỉ translate* với đơn vị %.
 * - Khi drawer mở (translate về 0), không còn |%| ≥ 100 trên trục đó → không fake.
 */
ZIndex._offCanvasReadTranslateXPercent = function (t) {
    if (!t) return null;
    t = ("" + t).toLowerCase();
    var m = t.match(/translatex\(\s*(-?[0-9]+(?:\.[0-9]+)?)%\s*\)/);
    if (m) return parseFloat(m[1]);
    m = t.match(/translate3d\(\s*(-?[0-9]+(?:\.[0-9]+)?)%\s*,/);
    if (m) return parseFloat(m[1]);
    m = t.match(/translate\(\s*(-?[0-9]+(?:\.[0-9]+)?)%\s*,/);
    if (m) return parseFloat(m[1]);
    m = t.match(/translate\(\s*(-?[0-9]+(?:\.[0-9]+)?)%\s*\)/);
    if (m) return parseFloat(m[1]);
    return null;
};

ZIndex._offCanvasReadTranslateYPercent = function (t) {
    if (!t) return null;
    t = ("" + t).toLowerCase();
    var m = t.match(/translatey\(\s*(-?[0-9]+(?:\.[0-9]+)?)%\s*\)/);
    if (m) return parseFloat(m[1]);
    m = t.match(/translate3d\(\s*[^,]+,\s*(-?[0-9]+(?:\.[0-9]+)?)%\s*,/);
    if (m) return parseFloat(m[1]);
    m = t.match(/translate\(\s*[^,]+,\s*(-?[0-9]+(?:\.[0-9]+)?)%\s*\)/);
    if (m) return parseFloat(m[1]);
    return null;
};

ZIndex._fakeReason_OffCanvasDrawerTransform = function (reasons, style) {
    if (!reasons || !style) return;
    var pos = style.position;
    if (pos !== "fixed" && pos !== "absolute") return;

    var t = (style.transform || "").toLowerCase();
    if (!t || t === "none") return;

    var left = style.left;
    var right = style.right;
    var top = style.top;
    var bottom = style.bottom;

    var leftSet = left !== "auto" && ("" + left).trim() !== "";
    var rightSet = right !== "auto" && ("" + right).trim() !== "";
    var topSet = top !== "auto" && ("" + top).trim() !== "";
    var bottomSet = bottom !== "auto" && ("" + bottom).trim() !== "";

    if (!leftSet && !rightSet && !topSet && !bottomSet) return;

    var minAbs = 100;
    var xPct = ZIndex._offCanvasReadTranslateXPercent(t);
    var yPct = ZIndex._offCanvasReadTranslateYPercent(t);

    if (xPct !== null && !isNaN(xPct) && leftSet && xPct <= -minAbs) {
        reasons.push("off-canvas:translateX(" + xPct + "%)+left");
        return;
    }
    if (xPct !== null && !isNaN(xPct) && rightSet && xPct >= minAbs) {
        reasons.push("off-canvas:translateX(" + xPct + "%)+right");
        return;
    }
    if (yPct !== null && !isNaN(yPct) && topSet && yPct <= -minAbs) {
        reasons.push("off-canvas:translateY(" + yPct + "%)+top");
        return;
    }
    if (yPct !== null && !isNaN(yPct) && bottomSet && yPct >= minAbs) {
        reasons.push("off-canvas:translateY(" + yPct + "%)+bottom");
        return;
    }
};

/**
 * Helper: kiểm tra màu "trong suốt hoàn toàn"
 *
 * Hỗ trợ các dạng thường gặp khi computedStyle trả về:
 * - "transparent"
 * - "#rrggbbaa", "#rgba" (CSS Color 4 — vd #0000 = rgba(0,0,0,0))
 * - "rgba(r,g,b,0)" / alpha 0%
 * - "hsla(h,s,l,0)" / alpha 0%
 * - "rgb(r g b / 0)" (cú pháp hiện đại có dấu /)
 *
 * Lưu ý:
 * - Một số engine vẫn trả đúng chuỗi hex có alpha thay vì normalize sang rgba.
 */
ZIndex._isFullyTransparentColor = function (color) {
    if (!color) return true;
    var c = ("" + color).trim().toLowerCase();
    if (!c) return true;
    if (c === "transparent") return true;

    var alphaNearZero = function (a) {
        if (typeof a !== "number" || isNaN(a)) return false;
        return a <= 1e-6;
    };

    if (c.charAt(0) === "#") {
        var body = c.slice(1);
        if (/^[0-9a-f]{8}$/i.test(body)) {
            return parseInt(body.slice(6, 8), 16) === 0;
        }
        if (/^[0-9a-f]{4}$/i.test(body)) {
            var nib = body.charAt(3);
            return parseInt(nib + nib, 16) === 0;
        }
        return false;
    }

    var rgba = c.match(/^rgba\(\s*[\d.]+\s*,\s*[\d.]+\s*,\s*[\d.]+\s*,\s*([-\d.]+)(%?)\s*\)$/);
    if (rgba) {
        var a = parseFloat(rgba[1]);
        if (rgba[2]) a = a / 100;
        return alphaNearZero(a);
    }

    var hsla = c.match(/^hsla\(\s*[-\d.]+\s*,\s*[-\d.]+%\s*,\s*[-\d.]+%\s*,\s*([-\d.]+)(%?)\s*\)$/);
    if (hsla) {
        var a2 = parseFloat(hsla[1]);
        if (hsla[2]) a2 = a2 / 100;
        return alphaNearZero(a2);
    }

    if (/^rgba?\(/.test(c) && c.indexOf("/") !== -1) {
        var tail = c.match(/\/\s*([-\d.]+)\s*(%?)\s*\)\s*$/);
        if (tail) {
            var aval = parseFloat(tail[1]);
            if (tail[2]) aval = aval / 100;
            return alphaNearZero(aval);
        }
    }

    return false;
};

/**
 * Fake condition: element "rỗng" (không có ruột) + không có background
 *
 * Vì sao fake:
 * - Một pattern phổ biến là tạo 1 "click-catcher" (lớp trong suốt) để bắt click/touch trên trang,
 *   sau đó website xử lý và phân phối lại. Lớp này:
 *   - Thường không render nội dung: không có child element, text chỉ là khoảng trắng hoặc &nbsp;.
 *   - Thường không có background: background-color trong suốt và background-image = none.
 * - Nếu coi nhầm đây là overlay thật, Navi+ sẽ bị down z-index dù UI không bị che.
 *
 * Tiêu chí "rỗng" (cố tình nghiêm ngặt để tránh false-positive):
 * - Không có element con: el.children.length === 0
 * - textContent sau khi loại whitespace + NBSP (\u00A0) là rỗng
 *
 * Tiêu chí "không background":
 * - background-image = none
 * - background-color là "trong suốt hoàn toàn" (transparent, #0000, rgba(...,0), rgb(... / 0), …)
 *
 * Ghi chú:
 * - Không dùng innerHTML để tránh tốn chi phí/ảnh hưởng DOM; chỉ đọc textContent + children.
 * - Nếu style hoặc el không hợp lệ → bỏ qua.
 */
ZIndex._fakeReason_EmptyNoBackground = function (reasons, el, style) {
    if (!reasons || !el || !style) return;

    // 1) Kiểm tra "rỗng": không có element con + textContent chỉ whitespace/NBSP.
    try {
        if (el.children && el.children.length > 0) return;
    } catch (e) {
        return;
    }

    var txt = "";
    try {
        txt = (el.textContent != null) ? ("" + el.textContent) : "";
    } catch (e) {
        txt = "";
    }

    // Loại bỏ:
    // - whitespace bình thường (\s)
    // - NBSP (Unicode: \u00A0) thường xuất hiện từ &nbsp;
    var normalized = txt.replace(/\u00A0/g, " ").trim();
    if (normalized.length !== 0) return;

    // 2) Kiểm tra "không background".
    var bgImg = style.backgroundImage || "";
    var bgColor = style.backgroundColor || "";

    // background-image phải là none (có image/pattern thì không coi là "không background")
    var hasBgImage = ("" + bgImg).toLowerCase() !== "none";
    if (hasBgImage) return;

    // background-color trong suốt hoàn toàn
    if (!ZIndex._isFullyTransparentColor(bgColor)) return;

    reasons.push("empty-no-bg");
};

/**
 * Fake condition: lớp vẽ "vô hình" — nền trong suốt hoàn toàn, không có gì vẽ lên chính element
 *
 * Vì sao cần:
 * - Nhiều theme (vd Shopify quick-add) đặt `background-color: #0000` + `position: absolute` + z-index
 *   trên host chỉ để bọc slot; phần nhìn thấy nằm ở con. Rule `empty-no-bg` không chạy vì có children.
 * - Computed style vẫn là nền trong suốt; không che tabbar theo nghĩa một lớp màu/mờ phủ viewport.
 *
 * Tiêu chí (đủ điều kiện → fake):
 * - background-image = none
 * - background-color trong suốt hoàn toàn (#0000, rgba(...,0), …)
 * - backdrop-filter = none (kể cả -webkit-)
 * - box-shadow = none
 * - filter = none (tránh blur/drop-shadow tạo hình dù nền trong suốt)
 * - outline-width > 0 chỉ khi outline-color cũng trong suốt; có outline đục → không fake
 * - mọi cạnh có border-width > 0 chỉ khi border-color tương ứng trong suốt; có viền đục → không fake
 *
 * Lưu ý:
 * - Không đọc DOM con; chỉ dựa computed của chính element để giữ nhẹ.
 */
ZIndex._fakeReason_InvisiblePaintLayer = function (reasons, style) {
    if (!reasons || !style) return;

    var bgImg = ("" + (style.backgroundImage || "")).trim().toLowerCase();
    if (bgImg && bgImg !== "none") return;

    if (!ZIndex._isFullyTransparentColor(style.backgroundColor || "")) return;

    var bf = ("" + (style.backdropFilter || style.webkitBackdropFilter || "")).trim().toLowerCase();
    if (bf && bf !== "none") return;

    var bs = ("" + (style.boxShadow || "")).trim().toLowerCase();
    if (bs && bs !== "none") return;

    var flt = ("" + (style.filter || "")).trim().toLowerCase();
    if (flt && flt !== "none") return;

    var ow = parseFloat(style.outlineWidth);
    if (!isNaN(ow) && ow > 0) {
        if (!ZIndex._isFullyTransparentColor(style.outlineColor || "")) return;
    }

    var sides = [
        { w: style.borderTopWidth, c: style.borderTopColor },
        { w: style.borderRightWidth, c: style.borderRightColor },
        { w: style.borderBottomWidth, c: style.borderBottomColor },
        { w: style.borderLeftWidth, c: style.borderLeftColor }
    ];
    for (var i = 0; i < sides.length; i++) {
        var bw = parseFloat(sides[i].w);
        if (isNaN(bw) || bw <= 0) continue;
        if (!ZIndex._isFullyTransparentColor(sides[i].c || "")) return;
    }

    reasons.push("invisible-paint-layer");
};

ZIndex._isElementActive = function (el) {
    if (!el) return false;
    var s = window.getComputedStyle(el);
    if (s.display === "none") return false;
    if (s.visibility === "hidden") return false;
    return true;
};

/**
 * Loại trừ các element thuộc Navi+ (menu, overlay của chính app) khỏi việc detect overlay bên thứ ba.
 */
ZIndex._isNaviElement = function (el) {
    if (!el || !el.closest) return false;
    return !!el.closest(".naviItem, .naviman_app_overlay, .naviman_app_overlay_global, .section_naviman_app, .navi-hamburger-overlay, .navi-hambuger-overlay");
};

/**
 * Host component của theme / nền tảng: có absolute + z-index nhưng không phải overlay che viewport.
 *
 * Ví dụ Shopify: mỗi thẻ sản phẩm một &lt;quick-add-component class="quick-add"&gt; — hàng chục node cùng selector.
 * Heuristic nền trong suốt dễ lệch khi vài instance có box-shadow/filter/viền khác (hover, biến thể theme).
 * Loại host bằng tên tag là ổn định hơn.
 *
 * Tradeoff: drawer/modal nằm hoàn toàn trong Shadow DOM của host không bị getElementsByTagName("*") quét,
 * nên auto down z-index có thể không bám theo lớp đó; ưu tiên tránh false-positive trên catalog.
 */
ZIndex._isIgnoredThirdPartyOverlayHost = function (el) {
    if (!el || !el.tagName) return false;
    var t = el.tagName.toLowerCase();
    return t === "quick-add-component";
};

/**
 * Mô tả ngắn gọn một element để log debug (tag#id.class1.class2 + z-index, position).
 */
ZIndex._describeElementForDebug = function (el, style) {
    if (!el) return "";
    style = style || window.getComputedStyle(el);
    var idPart = el.id ? ("#" + el.id) : "";
    var classPart = "";
    if (el.className) {
        var cls = ("" + el.className).trim().split(/\s+/).filter(function (c) { return c; });
        if (cls.length) {
            classPart = "." + cls.join(".");
        }
    }
    var tag = el.tagName ? el.tagName.toLowerCase() : "element";
    return tag + idPart + classPart + " (zIndex=" + style.zIndex + ", position=" + style.position + ")";
};

/**
 * Thu thập thông tin computed + kích thước viewport cho log khi phát hiện floating overlay.
 *
 * @param {Element} el
 * @returns {object|null} Plain object hoặc null nếu không đọc được.
 */
ZIndex._getFloatingOverlayLogDetails = function (el) {
    if (!el || typeof el.getBoundingClientRect !== "function") return null;
    try {
        if (!el.isConnected) return null;
    } catch (e0) {
        return null;
    }
    var style;
    try {
        style = window.getComputedStyle(el);
    } catch (e) {
        return null;
    }
    var rect = null;
    try {
        rect = el.getBoundingClientRect();
    } catch (e2) {
        rect = null;
    }
    return {
        zIndex: style.zIndex,
        position: style.position,
        background: style.background || "",
        backgroundColor: style.backgroundColor || "",
        top: style.top,
        right: style.right,
        bottom: style.bottom,
        left: style.left,
        width: rect ? rect.width : null,
        height: rect ? rect.height : null
    };
};

/**
 * Baseline: các floating element (fixed/absolute/sticky + z-index != auto/0) đã tồn tại và active
 * ngay từ khi Navi+ khởi động. Ta coi đây là layout mặc định (header sticky, thanh thông báo...)
 * và KHÔNG dùng để trigger down z-index menu.
 */
ZIndex._baselineOverlayElements = ZIndex._baselineOverlayElements || [];
ZIndex._baselineInitialized = ZIndex._baselineInitialized || false;
ZIndex._fakeFloatingLogged = ZIndex._fakeFloatingLogged || (typeof WeakSet !== "undefined" ? new WeakSet() : []);

ZIndex._isFakeFloatingLogged = function (el) {
    if (!el) return true;
    if (ZIndex._fakeFloatingLogged && typeof WeakSet !== "undefined" && ZIndex._fakeFloatingLogged instanceof WeakSet) {
        return ZIndex._fakeFloatingLogged.has(el);
    }
    return ZIndex._fakeFloatingLogged.indexOf(el) !== -1;
};

ZIndex._markFakeFloatingLogged = function (el) {
    if (!el) return;
    if (ZIndex._fakeFloatingLogged && typeof WeakSet !== "undefined" && ZIndex._fakeFloatingLogged instanceof WeakSet) {
        ZIndex._fakeFloatingLogged.add(el);
        return;
    }
    if (ZIndex._fakeFloatingLogged.indexOf(el) === -1) ZIndex._fakeFloatingLogged.push(el);
};

ZIndex._rememberBaselineOverlay = function (el) {
    if (!el) return;
    if (ZIndex._baselineOverlayElements.indexOf(el) !== -1) return;
    ZIndex._baselineOverlayElements.push(el);
};

ZIndex._isBaselineOverlayElement = function (el) {
    if (!el) return false;
    return ZIndex._baselineOverlayElements.indexOf(el) !== -1;
};

/**
 * Thu thập toàn bộ floating element đang active thỏa:
 * - position ∈ {fixed, absolute, sticky}
 * - z-index là số, > 0, != auto
 * - không thuộc Navi+
 * - không phải host third-party đã allowlist (vd quick-add-component)
 * - position:relative + z-index > 0: fake z-index floating (log, không vào danh sách candidate)
 */
ZIndex._collectActiveOverlayCandidates = function () {
    if (typeof document === "undefined") return [];
    var all = document.getElementsByTagName("*");
    var result = [];
    for (var i = 0; i < all.length; i++) {
        var el = all[i];
        if (ZIndex._isNaviElement(el)) continue;
        if (ZIndex._isIgnoredThirdPartyOverlayHost(el)) continue;
        if (!ZIndex._isElementActive(el)) continue;
        var style;
        try {
            style = window.getComputedStyle(el);
        } catch (e) {
            continue;
        }
        var pos = style.position;
        // Fake z-index floating: có z-index nhưng relative — không phải overlay viewport.
        if (pos === "relative") {
            var reasonsRel = [];
            ZIndex._fakeReason_PositionRelativeZIndex(reasonsRel, style);
            if (reasonsRel.length) {
                if (!ZIndex._isFakeFloatingLogged(el)) {
                    console.log("[ZIndex] Fake floating detected (ignored):", ZIndex._describeElementForDebug(el, style), reasonsRel);
                    ZIndex._markFakeFloatingLogged(el);
                }
            }
            continue;
        }
        // Loại sticky vì nó là layout cố định của website, không đại diện cho việc che lấp menu.
        if (pos !== "fixed" && pos !== "absolute") continue;
        var z = style.zIndex;
        if (!z || z === "auto") continue;
        var zNum = parseInt(z, 10);
        // z-index <= 0 thường không thể "đè" UI theo nghĩa overlay,
        // và một số site còn set z-index:-1 như kiểu hack để ẩn.
        if (isNaN(zNum) || zNum <= 0) continue;

        var rect = null;
        try { rect = el.getBoundingClientRect(); } catch (e) { rect = null; }

        // Fake floating: KHÔNG coi là overlay thật, nhưng log ra console để debug.
        // Log 1 lần/element để tránh spam trong burst ticks.
        try {
            var cls = ZIndex._classifyOverlayElement(el, style, rect);
            if (cls && cls.isFakeFloating) {
                if (!ZIndex._isFakeFloatingLogged(el)) {
                    console.log("[ZIndex] Fake floating detected (ignored):", ZIndex._describeElementForDebug(el, style), cls.fakeReasons);
                    ZIndex._markFakeFloatingLogged(el);
                }
                continue;
            }
            if (!cls || !cls.shouldConsider) continue;
        } catch (e) {
            // Nếu classify lỗi (hiếm), bỏ qua element để tránh làm crash toàn bộ burst.
            continue;
        }

        // Skip elements with area < 30000 px² (~1/10 of typical screen).
        try {
            if (!rect) rect = el.getBoundingClientRect();
            if (rect.width * rect.height < 30000) continue;
        } catch (e) { continue; }
        result.push(el);
    }
    return result;
};

/**
 * Khởi tạo baseline ngay khi observer bắt đầu:
 * - Ghi nhận tất cả candidate hiện có lúc đó vào baseline,
 *   coi đó là layout cố định của website.
 */
ZIndex._initOverlayBaseline = function () {
    if (ZIndex._baselineInitialized) return;
    ZIndex._baselineInitialized = true;
    var cands = ZIndex._collectActiveOverlayCandidates();
    for (var i = 0; i < cands.length; i++) {
        ZIndex._rememberBaselineOverlay(cands[i]);
    }
    // (no log — baseline is internal state)
};

/**
 * Tìm floating element đang active TRÊN baseline:
 * - Chỉ quan tâm tới những element mới xuất hiện/được show sau baseline.
 * - Ưu tiên element có z-index cao hơn.
 */
ZIndex._findActiveOverlayInDOM = function () {
    var cands = ZIndex._collectActiveOverlayCandidates();
    var picked = null;
    var pickedZ = -Infinity;
    for (var i = 0; i < cands.length; i++) {
        var el = cands[i];
        if (ZIndex._isBaselineOverlayElement(el)) continue;
        var style;
        try {
            style = window.getComputedStyle(el);
        } catch (e) {
            continue;
        }
        var zNum = parseInt(style.zIndex, 10);
        if (isNaN(zNum)) continue;
        if (zNum > pickedZ) {
            pickedZ = zNum;
            picked = el;
        }
    }
    return picked;
};

ZIndex._hasActiveOverlay = function () {
    ZIndex._lastActiveOverlaySelector = null;
    ZIndex._lastFloatingOverlayElement = null;
    // Chỉ dùng cơ chế auto-detect DOM (baseline + quét floating element mới xuất hiện).
    var domOverlay = ZIndex._findActiveOverlayInDOM();
    if (domOverlay) {
        ZIndex._lastActiveOverlaySelector = ZIndex._describeElementForDebug(domOverlay);
        ZIndex._lastFloatingOverlayElement = domOverlay;
        return true;
    }
    return false;
};

/**
 * Giảm z-index Navi+ sticky (tabbar, fab) và naviman_app_overlay xuống 1.
 * Dùng pushElementToMin dùng chung.
 */
ZIndex.downNaviMenuZIndex = function () {
    var items = document.querySelectorAll(".naviItem.STICKY_TABBAR, .naviItem.STICKY_FAB_SUPPORT");
    for (var i = 0; i < items.length; i++) {
        ZIndex.pushElementToMin(items[i]);
    }
    var overlay = document.querySelector(".naviman_app_overlay");
    if (overlay) ZIndex.pushElementToMin(overlay);
};

/**
 * Hồi phục z-index Navi+ sticky và naviman_app_overlay đã bị down.
 * Dùng restoreElementFromMin dùng chung.
 * Lưu ý: với menu đang ở trạng thái max (mainStore), restore sẽ trả về đúng giá trị đã lưu (2147483647).
 */
ZIndex.restoreNaviMenuZIndex = function () {
    var items = document.querySelectorAll(".naviItem.STICKY_TABBAR, .naviItem.STICKY_FAB_SUPPORT");
    for (var i = 0; i < items.length; i++) {
        ZIndex.restoreElementFromMin(items[i]);
    }
    var overlay = document.querySelector(".naviman_app_overlay");
    if (overlay) ZIndex.restoreElementFromMin(overlay);
};

/**
 * Helper apply trạng thái active/non-active cho floating:
 * - active = true: nếu trước đó chưa active → down z-index.
 * - active = false: nếu trước đó đang active → restore z-index.
 */
ZIndex._floatingLastActive = ZIndex._floatingLastActive || false;

ZIndex._applyFloatingActiveState = function (active) {
    if (active && !ZIndex._floatingLastActive) {
        var overlayDetail = ZIndex._getFloatingOverlayLogDetails(ZIndex._lastFloatingOverlayElement);
        console.log("[ZIndex] Lowering z-index — floating overlay detected:", ZIndex._lastActiveOverlaySelector, overlayDetail || {});
        ZIndex.downNaviMenuZIndex();
    } else if (!active && ZIndex._floatingLastActive) {
        console.log("[ZIndex] Restored z-index");
        ZIndex.restoreNaviMenuZIndex();
    }
    ZIndex._floatingLastActive = active;
};

ZIndex.observeOverlaysAndAdjustZIndex = function () {
    if (typeof document === "undefined") return;

    // State cho cơ chế burst.
    ZIndex._floatingTickCounter = 0;
    ZIndex._floatingBurstRemaining = 0;
    ZIndex._floatingBurstIntervalId = null;
    ZIndex._floatingLastActive = ZIndex._floatingLastActive || false;

    var runBurstTick = function () {
        if (ZIndex._floatingBurstRemaining <= 0) {
            if (ZIndex._floatingBurstIntervalId) {
                clearInterval(ZIndex._floatingBurstIntervalId);
                ZIndex._floatingBurstIntervalId = null;
            }
            return;
        }

        ZIndex._floatingBurstRemaining--;
        ZIndex._floatingTickCounter++;

        // Nếu không có TABBAR/FAB thì return sớm, tránh quét DOM.
        var stickyItems = document.querySelectorAll(".naviItem.STICKY_TABBAR, .naviItem.STICKY_FAB_SUPPORT");
        if (!stickyItems || !stickyItems.length) {
            if (ZIndex._floatingBurstRemaining <= 0 && ZIndex._floatingBurstIntervalId) {
                clearInterval(ZIndex._floatingBurstIntervalId);
                ZIndex._floatingBurstIntervalId = null;
            }
            return;
        }

        var active = false;
        try {
            active = ZIndex._hasActiveOverlay();
        } catch (e) {
            console.log("[ZIndex] Floating burst check error", e);
            active = false;
        }

        // Dùng helper hiện có để down/restore theo trạng thái.
        ZIndex._applyFloatingActiveState(active);

        // Nếu đã phát hiện floating active ở tick này thì dừng sớm,
        // tránh chạy thêm lần quét DOM không cần thiết.
        if (active && ZIndex._floatingBurstIntervalId) {
            clearInterval(ZIndex._floatingBurstIntervalId);
            ZIndex._floatingBurstIntervalId = null;
            ZIndex._floatingBurstRemaining = 0;
        }
    };

    var startOrRefreshBurst = function () {
        // Mỗi lần user tương tác, reset số lần check còn lại về 2.
        ZIndex._floatingBurstRemaining = 2;

        // Nếu interval đã chạy thì chỉ cần refresh remaining; không tạo thêm interval mới.
        if (ZIndex._floatingBurstIntervalId) {
            return;
        }

        ZIndex._floatingBurstIntervalId = setInterval(function () {
            runBurstTick();
        }, 300);
    };

    var interactionHandler = function () {
        startOrRefreshBurst();
    };

    // Dùng capture để bắt được cả click/touch ở sâu trong DOM.
    document.addEventListener("click", interactionHandler, true);
    document.addEventListener("touchstart", interactionHandler, true);
};

/**
 * Store WeakMap cho các hàm dùng chung push/restore z-index theo element.
 * _pushedToMaxElements dùng để restore tất cả khi closeAllDropdowns (WeakMap không iterate được).
 */
ZIndex._elementMaxStore = ZIndex._elementMaxStore || (typeof WeakMap !== "undefined" ? new WeakMap() : null);
ZIndex._elementMinStore = ZIndex._elementMinStore || (typeof WeakMap !== "undefined" ? new WeakMap() : null);
ZIndex._pushedToMaxElements = ZIndex._pushedToMaxElements || [];

/**
 * Đẩy z-index của một element lên max (2147483647), lưu giá trị gốc để hồi phục.
 * Dùng chung cho mọi đối tượng (vd: container desktop mega menu).
 */
ZIndex.pushElementToMax = function (element) {
    if (!element || !element.style || !ZIndex._elementMaxStore) return;
    if (ZIndex._elementMaxStore.has(element)) return;
    var computed = window.getComputedStyle(element).zIndex;
    var oldZ = computed !== "auto" ? computed : "0";
    ZIndex._elementMaxStore.set(element, oldZ);
    ZIndex._pushedToMaxElements.push(element);
    element.style.zIndex = "2147483647";
};

/**
 * Hồi phục z-index của element đã được pushElementToMax.
 */
ZIndex.restoreElementFromMax = function (element) {
    if (!element || !ZIndex._elementMaxStore) return;
    if (!ZIndex._elementMaxStore.has(element)) return;
    element.style.zIndex = ZIndex._elementMaxStore.get(element);
    ZIndex._elementMaxStore.delete(element);
    var idx = ZIndex._pushedToMaxElements.indexOf(element);
    if (idx >= 0) ZIndex._pushedToMaxElements.splice(idx, 1);
};

window.menuZindexNaviSections = window.menuZindexNaviSections || {};

/**
 * Set z-index của các section khác xuống 0 khi mở mega menu (desktop + mobile).
 * Section chứa menu (embed_id) được giữ nguyên.
 */
ZIndex.downOtherSectionsZIndex = function (embed_id) {
    if (!embed_id) return;
    var store = window.menuZindexNaviSections;
    document.querySelectorAll("section").forEach(function (section) {
        if (section.querySelector(".naviItem") && !section.querySelector("#" + embed_id)) {
            var style = window.getComputedStyle(section);
            if (style.position === "relative") {
                var computedZIndex = style.zIndex;
                store[section.id] = computedZIndex !== "auto" ? computedZIndex : "0";
                section.style.zIndex = "0";
            }
        }
    });
};

/**
 * Khôi phục z-index của các section đã bị set = 0 khi mở mega menu (desktop + mobile).
 * Dùng khi closeAllDropdowns (click ngoài, hover ra...).
 */
ZIndex.restoreAllSectionZIndex = function () {
    var store = window.menuZindexNaviSections;
    if (!store || !Object.keys(store).length) return;
    Object.keys(store).forEach(function (sectionId) {
        var section = document.getElementById(sectionId);
        if (section) section.style.zIndex = store[sectionId];
    });
    window.menuZindexNaviSections = {};
};

/**
 * Hồi phục z-index của mọi element đã pushElementToMax.
 * Dùng khi đóng qua closeAllDropdowns (click ngoài, hover ra...) mà không qua doRest.
 */
ZIndex.restoreAllElementsFromMax = function () {
    if (!ZIndex._pushedToMaxElements || !ZIndex._pushedToMaxElements.length) return;
    var list = ZIndex._pushedToMaxElements.slice();
    ZIndex._pushedToMaxElements.length = 0;
    for (var i = 0; i < list.length; i++) {
        if (ZIndex._elementMaxStore && ZIndex._elementMaxStore.has(list[i])) {
            list[i].style.zIndex = ZIndex._elementMaxStore.get(list[i]);
            ZIndex._elementMaxStore.delete(list[i]);
        }
    }
};

/**
 * Giảm z-index của một element xuống 1, lưu giá trị gốc để hồi phục.
 */
ZIndex.pushElementToMin = function (element) {
    if (!element || !element.style || !ZIndex._elementMinStore) return;
    if (ZIndex._elementMinStore.has(element)) return;
    var computed = window.getComputedStyle(element).zIndex;
    var oldZ = computed !== "auto" ? computed : "0";
    ZIndex._elementMinStore.set(element, oldZ);
    element.style.zIndex = "1";
};

/**
 * Hồi phục z-index của element đã được pushElementToMin.
 */
ZIndex.restoreElementFromMin = function (element) {
    if (!element || !ZIndex._elementMinStore) return;
    if (!ZIndex._elementMinStore.has(element)) return;
    element.style.zIndex = ZIndex._elementMinStore.get(element);
    ZIndex._elementMinStore.delete(element);
};

/**
 * Hủy element khỏi elementMinStore (không restore, chỉ xóa).
 * Dùng khi đã restore z-index theo cách khác (vd: restoreZIndexMax) để tránh
 * restoreNaviMenuZIndex sau đó ghi đè sai.
 */
ZIndex.cancelElementFromMin = function (element) {
    if (!element || !ZIndex._elementMinStore) return;
    ZIndex._elementMinStore.delete(element);
};

/**
 * Đảm bảo tồn tại store lưu trữ z-index gốc của menu và overlay.
 * Trả về object dùng chung trong window[ZIndex._storageKey].
 */
ZIndex._ensureStore = function () {
    if (!window[ZIndex._storageKey]) {
        window[ZIndex._storageKey] = {};
    }
    return window[ZIndex._storageKey];
};

/**
 * Nâng z-index của một menu (theo embed_id) lên mức tối đa
 * và lưu lại z-index gốc (cả menu lẫn .naviman_app_overlay) để khôi phục sau.
 */
ZIndex.setZIndexMax = function (embed_id) {
    if (!embed_id) {
        return;
    }

    var menu = document.getElementById(embed_id);
    if (!menu) {
        return;
    }

    var store = ZIndex._ensureStore();

    if (store[embed_id] === undefined) {
        var computedZIndex = window.getComputedStyle(menu).zIndex;
        store[embed_id] = computedZIndex !== "auto" ? computedZIndex : "2";
    }

    menu.style.zIndex = "2147483647";

    var overlay = document.querySelector('.naviman_app_overlay');
    if (overlay) {
        if (store["naviman_app_overlay"] === undefined) {
            var overlayZIndex = window.getComputedStyle(overlay).zIndex;
            store["naviman_app_overlay"] = overlayZIndex !== "auto" ? overlayZIndex : "2";
        }
        overlay.style.zIndex = "2147483646";
    }
};

/**
 * Khôi phục z-index gốc của menu (theo embed_id)
 * và .naviman_app_overlay nếu đã được lưu trước đó.
 */
ZIndex.restoreZIndexMax = function (embed_id) {
    if (!embed_id) {
        return;
    }

    var store = window[ZIndex._storageKey];
    if (!store) {
        return;
    }

    var menu = document.getElementById(embed_id);
    if (menu && store[embed_id] !== undefined) {
        menu.style.zIndex = store[embed_id];
        delete store[embed_id];
        ZIndex.cancelElementFromMin(menu);
    }

    var overlay = document.querySelector('.naviman_app_overlay');
    if (overlay && store["naviman_app_overlay"] !== undefined) {
        overlay.style.zIndex = store["naviman_app_overlay"];
        delete store["naviman_app_overlay"];
        ZIndex.cancelElementFromMin(overlay);
    }
};

/**
 * Hàm apply chung khi MỞ submenu:
 * - Hiện tại xử lý cho STICKY_TABBAR và STICKY_FAB_SUPPORT.
 * - Trả về true nếu đã xử lý z-index, false nếu bỏ qua (để caller dùng fallback khác).
 */
ZIndex.applyWhenOpen = function(menuKind, embed_id) {
    if (!embed_id || typeof NAVIGLOBAL === "undefined" || !NAVIGLOBAL['MENU_KINDS'])
        return false;

    if (menuKind == NAVIGLOBAL['MENU_KINDS']['STICKY_TABBAR'] ||
        menuKind == NAVIGLOBAL['MENU_KINDS']['STICKY_FAB_SUPPORT']) {
        ZIndex.setZIndexMax(embed_id);
        return true;
    }

    return false;
};

/**
 * Nâng z-index khi mở submenu. Tái sử dụng setZIndexMax (STICKY) và downOtherSectionsZIndex (SECTION).
 */
ZIndex.setTopZindex = function (menuItem, menuKind, embed_id) {
    if (Menu.Common.isMenuKind(menuKind, "CONTEXT")) return;
    if (Menu.Common.isMenuKind(menuKind, "STICKY")) {
        ZIndex.setZIndexMax(embed_id);
        return;
    }
    if (Menu.Common.isMenuKind(menuKind, "SECTION")) {
        ZIndex.downOtherSectionsZIndex(embed_id);
    }
};

/**
 * Khôi phục z-index khi đóng submenu. Tái sử dụng restoreZIndexMax (STICKY) và restoreAllSectionZIndex (SECTION).
 */
ZIndex.removeTopZindex = function (menuItem, menuKind, embed_id) {
    if (Menu.Common.isMenuKind(menuKind, "CONTEXT")) return;
    if (Menu.Common.isMenuKind(menuKind, "STICKY")) {
        ZIndex.restoreZIndexMax(embed_id);
        return;
    }
    if (Menu.Common.isMenuKind(menuKind, "SECTION")) {
        ZIndex.restoreAllSectionZIndex();
    }
};

/**
 * Hàm apply chung khi ĐÓNG submenu:
 * - Hiện tại xử lý cho STICKY_TABBAR và STICKY_FAB_SUPPORT.
 * - Trả về true nếu đã khôi phục z-index, false nếu bỏ qua (để caller dùng fallback khác).
 */
ZIndex.applyWhenClose = function(menuKind, embed_id) {
    if (!embed_id || typeof NAVIGLOBAL === "undefined" || !NAVIGLOBAL['MENU_KINDS'])
        return false;

    if (menuKind == NAVIGLOBAL['MENU_KINDS']['STICKY_TABBAR'] ||
        menuKind == NAVIGLOBAL['MENU_KINDS']['STICKY_FAB_SUPPORT']) {
        ZIndex.restoreZIndexMax(embed_id);
        return true;
    }

    return false;
};

/**
 * Helper dùng riêng cho backToLevel1 (khi đã biết openingMenuItem, menuKind, embed_id):
 * - Cố gắng khôi phục z-index bằng ZIndex.applyWhenClose (Tabbar, FAB,...)
 * - Nếu không xử lý được thì fallback sang ZIndex.removeTopZindex.
 */
ZIndex.restoreOnBackToLevel1 = function(openingMenuItem, menuKind, embed_id) {
    if (!embed_id || !menuKind) return;

    if (menuKind == NAVIGLOBAL['MENU_KINDS']['STICKY_TABBAR'] ||
        menuKind == NAVIGLOBAL['MENU_KINDS']['STICKY_FAB_SUPPORT']) {
        return;
    }

    if (ZIndex.applyWhenClose(menuKind, embed_id)) return;

    ZIndex.removeTopZindex(openingMenuItem, menuKind, embed_id);
};

/**
 * Helper full cho backToLevel1:
 * - Tự đọc window._opening* (do saveOpeningMenuInfo set),
 * - Gọi restoreOnBackToLevel1 để khôi phục z-index,
 * - Sau đó dọn sạch các biến window._opening*.
 */
ZIndex.handleBackToLevel1 = function() {
    if (!window._openingEmbedId || !window._openingMenuKind)
        return;

    var embed_id = window._openingEmbedId;
    var menuKind = window._openingMenuKind;
    var openingMenuItem = window._openingMenuItem;

    ZIndex.restoreOnBackToLevel1(openingMenuItem, menuKind, embed_id);

    ZIndex.resetOpeningMenuState();
};

/**
 * Reset trạng thái menu đang mở (dùng chung cho Tabbar, FAB, v.v...)
 */
ZIndex.resetOpeningMenuState = function () {
    delete window._openingMenuItem;
    delete window._openingMenuKind;
    delete window._openingEmbedId;
};

/**
 * Khi đóng menu hoàn toàn (vd: click overlay_global):
 * Khôi phục z-index của menu đang mở (Tabbar, FAB...), rồi reset state.
 */
ZIndex.restoreAndResetOnClose = function () {
    if (window._openingMenuKind && window._openingEmbedId) {
        ZIndex.applyWhenClose(window._openingMenuKind, window._openingEmbedId);
    }
    ZIndex.resetOpeningMenuState();
};

/**
 * Khởi động observer theo dõi floating element bên thứ ba để tự động down/restore z-index Navi+ sticky menu.
 * - Chỉ chạy 1 lần cho toàn trang (dùng cờ window._naviZIndexOverlayObserverStarted).
 * - Tự gắn vào sự kiện load / hoặc chạy ngay nếu DOM đã sẵn sàng.
 */
ZIndex.initOverlayObserver = function () {
    if (typeof window === "undefined") return;
    if (window._naviZIndexOverlayObserverStarted) return;
    window._naviZIndexOverlayObserverStarted = true;

    var startObserver = function () {
        if (typeof ZIndex !== "undefined" && typeof ZIndex.observeOverlaysAndAdjustZIndex === "function") {
            // Ghi nhận baseline floating elements của website trước khi bắt đầu observe (auto-detect, không dùng selectors).
            ZIndex._initOverlayBaseline();
            ZIndex.observeOverlaysAndAdjustZIndex();
        }
    };

    if (document.readyState === "complete" || document.readyState === "interactive") {
        startObserver();
    } else {
        window.addEventListener("load", startObserver);
    }
};

// Tự khởi động observer sau khi trang load (không phụ thuộc Finalizer).
ZIndex.initOverlayObserver();


    return {
        Name: "Naviman Libraries",
        drawBottomNav: drawBottomNav,
        init: init,
        gotoUrl: gotoUrl,
        backToLevel1: backToLevel1,

        clickToElement: clickToElement,
        focusToElement: focusToElement,

        // Trigger
        openNaviMenu: openNaviMenu,
        openChangeLanguage: openChangeLanguage,

        // public JS functions
        openMobileMenu: openMobileMenu,
        openCart: openCart,
        openSearch: openSearch,

        // Scroll
        scrollTop:scrollTop,
        scrollBottom:scrollBottom,
        scrollOnPage:scrollOnPage,

        // Share
        shareCopyUrl:shareCopyUrl,
        shareFacebook:shareFacebook,
        shareTweet:shareTweet,

        // Tailor - https://themes.shopify.com/themes/tailor/styles/cotton
        openMenu_Tailor: openMenu_Tailor,
        openSearch_Tailor: openSearch_Tailor,
        openCart_Tailor: openCart_Tailor,

        // Symmetry - https://themes.shopify.com/themes/symmetry/styles/beatnik
        openMenu_Symmetry: openMenu_Symmetry,
        openSearch_Symmetry: openSearch_Symmetry,
        openCart_Symmetry: openCart_Symmetry,

        // Enterprise - https://themes.shopify.com/themes/tailor/styles/cotton
        openMenu_Enterprise: openMenu_Enterprise,
        openCart_Enterprise: openCart_Enterprise,

        // Pipeline https://themes.shopify.com/themes/pipeline/styles/bright
        openMenu_Pipeline: openMenu_Pipeline,
        openSearch_Pipeline: openSearch_Pipeline,
        openCart_Pipeline: openCart_Pipeline,

        // Empire - https://themes.shopify.com/themes/empire/styles/supply
        openMenu_Empire: openMenu_Empire,
        openSearch_Empire: openSearch_Empire,

        // Impulse - https://themes.shopify.com/themes/impulse/styles/modern
        openMenu_Impulse: openMenu_Impulse,
        openSearch_Impulse: openSearch_Impulse,
        openCart_Impulse: openCart_Impulse,

        // Horizon - Polished design meets a clean setup: launch faster without sacrificing style.
        openMenu_Horizon: openMenu_Horizon,
        openSearch_Horizon: openSearch_Horizon,
        openCart_Horizon: openCart_Horizon,

        // Warehouse - https://themes.shopify.com/themes/impact/styles/sound
        openMenu_Warehouse: openMenu_Warehouse,
        openCart_Warehouse: openCart_Warehouse,
        openSearch_Warehouse: openSearch_Warehouse,

        // Eurus - https://themes.shopify.com/themes/eurus/presets/eurus
        openMenu_Eurus: openMenu_Eurus,
        openCart_Eurus: openCart_Eurus,
        openSearch_Eurus: openSearch_Eurus,        

        // Veena - https://themes.shopify.com/themes/veena/presets/veena
        openMenu_Veena: openMenu_Veena,
        openCart_Veena: openCart_Veena,
        openSearch_Veena: openSearch_Veena,


        // Hongo - https://preview.themeforest.net/item/hongo-multipurpose-shopify-theme-os-20
        openMenu_Hongo: openMenu_Hongo,
        openCart_Hongo: openCart_Hongo,
        openSearch_Hongo: openSearch_Hongo,        

        // Shark - https://themes.shopify.com/themes/shark/styles/bright
        openMenu_Shark: openMenu_Shark,
        openCart_Shark: openCart_Shark,
        openSearch_Shark: openSearch_Shark,                

        // District - https://themes.shopify.com/themes/district/styles/district
        openMenu_District: openMenu_District,
        openCart_District: openCart_District,
        openSearch_District: openSearch_District,

        // Honey - https://themes.shopify.com/themes/honey/styles/paws
        openMenu_Honey: openMenu_Honey,
        openCart_Honey: openCart_Honey,
        openSearch_Honey: openSearch_Honey,

        // Focal - https://themes.shopify.com/themes/focal/styles/carbon
        openMenu_Focal: openMenu_Focal,
        openCart_Focal: openCart_Focal,
        openSearch_Focal: openSearch_Focal,

        // Xclusive - https://themes.shopify.com/themes/xclusive/styles/shoes
        openMenu_Xclusive: openMenu_Xclusive,
        openCart_Xclusive: openCart_Xclusive,
        openSearch_Xclusive: openSearch_Xclusive,

        // Prestige - https://themes.shopify.com/themes/prestige/styles/couture
        openMenu_Prestige: openMenu_Prestige,
        openCart_Prestige: openCart_Prestige,
        openSearch_Prestige: openSearch_Prestige,

        // Palo Alto https://themes.shopify.com/themes/palo-alto/styles/vibrant
        openMenu_PaloAlto: openMenu_PaloAlto,
        openCart_PaloAlto: openCart_PaloAlto,
        openSearch_PaloAlto: openSearch_PaloAlto,

        // Minion https://themes.shopify.com/themes/minion/styles/vertical
        openMenu_Minion: openMenu_Minion,
        openCart_Minion: openCart_Minion,
        openSearch_Minion: openSearch_Minion,

        // Borders https://themes.shopify.com/themes/borders/styles/raw
        openMenu_Borders: openMenu_Borders,
        openCart_Borders: openCart_Borders,
        openSearch_Borders: openSearch_Borders,

        // Impact - https://themes.shopify.com/themes/Impact/styles/metal
        openMenu_Impact: openMenu_Impact,
        openCart_Impact: openCart_Impact,
        openSearch_Impact: openSearch_Impact,

        // Broadcast - https://themes.shopify.com/themes/broadcast/styles/clean
        openMenu_Broadcast: openMenu_Broadcast,
        openCart_Broadcast: openCart_Broadcast,
        openSearch_Broadcast: openSearch_Broadcast,

        // Expanse - https://themes.shopify.com/themes/expanse/styles/classic
        openMenu_Expanse: openMenu_Expanse,
        openCart_Expanse: openCart_Expanse,
        openSearch_Expanse: openSearch_Expanse,

        // ShowTime - https://themes.shopify.com/themes/showtime/styles/cooktime
        openMenu_ShowTime: openMenu_ShowTime,
        openCart_ShowTime: openCart_ShowTime,
        openSearch_ShowTime: openSearch_ShowTime,

        // Local - https://themes.shopify.com/themes/local/styles/light
        openMenu_Local: openMenu_Local,
        openCart_Local: openCart_Local,
        openSearch_Local: openSearch_Local,

        // Avenue - https://themes.shopify.com/themes/avenue/styles/casual
        openMenu_Avenue: openMenu_Avenue,
        openCart_Avenue: openCart_Avenue,
        // openSearch_Avenue: openSearch_Avenue,

        // Parallax - https://themes.shopify.com/themes/parallax/styles/aspen
        openMenu_Parallax: openMenu_Parallax,
        openCart_Parallax: openCart_Parallax,
        openSearch_Parallax: openSearch_Parallax,

        // Work with other applications
        openInbox: openInbox,
        openInboxWithoutReplace: openInboxWithoutReplace,

        openShareMe: openShareMe,

        isHadValue: isHadValue, // TODO: No need publish this function

        goBack: goBack,
        goForward: goForward,   

        // Cart
        setCartCount: setCartCount,
        asyncGetCart:asyncGetCart,
        checkAndUpdateCartCount:checkAndUpdateCartCount,
        updateCartCount:updateCartCount,
        generateActiveItems:generateActiveItems,
        bindELToCartCount:bindELToCartCount,

        waitElementToAddStyle:waitElementToAddStyle,

        isMobileMode: isMobileMode,
        setLocalStorage: setLocalStorage,
        getLocalStorage: getLocalStorage,
        isLocalStorageSupported: isLocalStorageSupported,

        setSessionStorage: setSessionStorage,
        getSessionStorage: getSessionStorage,
        isSessionStorageSupported: isSessionStorageSupported,

        callbackPublicFunc: callbackPublicFunc,
        turnOffLocalStorage: turnOffLocalStorage,

        showLevel2Items: showLevel2Items,

        FixGoogleApp: FixGoogleApp,
        MiniSnackbar: MiniSnackbar,

        Helper: Helper,
        Menu: Menu


    };

})();

var Navi = Navi || {};


var Finalizer = Finalizer || {}
Finalizer.Desktop = Finalizer.Desktop || {}; 
Finalizer.Desktop.FullExpand = Finalizer.Desktop.FullExpand || {}; 



/**
 * Đảm bảo dropdown dạng full-expand nằm đúng vị trí bên dưới menu cha khi hiển thị hoặc khi trang cuộn/resize.
 * 
 * - Với insertMethod = "PublishToPlace": sử dụng Finalizer.Desktop.FullExpand.getFullExpandTop để căn chỉnh top, xử lý trường hợp sticky parent.
 * - Với insertMethod = "InsertToSection": xử lý thêm một số lỗi hiển thị mega menu bằng cách tính lại khoảng cách, tránh bị lệch.
 * - Luôn cập nhật vị trí khi scroll hoặc resize cửa sổ.
 * 
 * @param {Element} dropdownFullExpand - Element dropdown full-expand cần xử lý vị trí.
 * @param {String} insertMethod        - Cách chèn ("PublishToPlace" hoặc "InsertToSection"), mặc định là "PublishToPlace".
 */
Finalizer.Desktop.FullExpand.maintainDropdownPosition = function(dropdownFullExpand, insertMethod = "PublishToPlace") {
    function updatePosition() {
        let parent = dropdownFullExpand.parentElement;
        if (parent) {
            let rect = parent.getBoundingClientRect();     
            
            if( insertMethod == "PublishToPlace" )                    
                dropdownFullExpand.style.top = Finalizer.Desktop.FullExpand.getFullExpandTop(dropdownFullExpand.parentElement); // rect.bottom + "px";                        
            else 
            if( insertMethod == "InsertToSection" ) {                
                /* Đối với một số mega menu lỗi hiển thị, thì tính 1 cái gap rồi trừ đi
                   Nó sẽ khiến cho có 1 đoạn delay chút xíu và tạo cảm giác sóng trên megamenu 
                   --------------------------------------------------------------------------*/   
                dropdownFullExpand.style.opacity = "0";
                dropdownFullExpand.style.top = rect.top + "px";                     

                var gap = (dropdownFullExpand.getBoundingClientRect().top + rect.height) - rect.bottom;
                if( gap > 0 ) {
                    dropdownFullExpand.style.top = (rect.bottom - gap ) + "px";                        
                }else 
                    dropdownFullExpand.style.top = rect.bottom + "px";

                dropdownFullExpand.style.opacity = "1";    
                /*--------------------------------------------------------------------------*/                   
            }            
        } else {
            //navidebug.warn("Dropdown has no parent element.");
        }
    }
    
    updatePosition();
    window.addEventListener("scroll", updatePosition);
    window.addEventListener("resize", updatePosition);
}


/**
 * Tính toán vị trí top cho dropdown dạng full expand,
 * đảm bảo dropdown luôn hiển thị ngay bên dưới parent menu,
 * kể cả khi parent hoặc ancestor có position: sticky.
 *
 * - Nếu cha không sticky: trả về bottom của cha.
 * - Nếu cha hoặc ancestor sticky: trừ offset sticky đầu tiên ra khỏi vị trí trả về.
 *
 * @param {Element} fullExpandParent - Element cha chứa dropdown.
 * @returns {string} Top tính toán (vd "120px") cho style.top.
 */
Finalizer.Desktop.FullExpand.getFullExpandTop = function(fullExpandParent) {
    if (!fullExpandParent) return "0px";

    // 1. Nếu cha không sticky, set top là bottom của cha
    const rect = fullExpandParent.getBoundingClientRect();
    let rawTop = rect.bottom;

    // 2. Nếu cha hoặc ancestor sticky, trừ offset sticky đầu tiên
    let el = fullExpandParent.parentElement;
    let maxDepth = 20;

    while (el && maxDepth-- > 0 && el !== document.body) {
        const style = window.getComputedStyle(el);
        if (style.position === "sticky") { 
            const stickyRect = el.getBoundingClientRect();
            const stickyOffsetFromTop = stickyRect.top;
            // Bỏ qua sticky giả (offset < 0)
            if( stickyOffsetFromTop > 0 )
                rawTop = rawTop - stickyOffsetFromTop;
            break; // chỉ lấy sticky đầu tiên
        }
        el = el.parentElement;
    }

    // Tránh submenu nhảy lên đầu khi rawTop < rect.bottom (do trừ sticky)
    const clamped = rawTop < rect.bottom;
    if (clamped) rawTop = rect.bottom;

    console.log("[getFullExpandTop] top=" + rawTop + "px, rect.bottom=" + rect.bottom + (clamped ? " (clamped)" : ""));

    return rawTop + "px";
}


/**
 * Xử lý mouse hover cho menu dạng desktop (không áp dụng cho mobile):
 * - Khi hover vào phần tử có class "navi-hover", sẽ tự động thêm class "navi-hover-active" và kích hoạt sự kiện click để mở menu.
 * - Khi mouseout, sẽ loại bỏ class và click để đóng menu.
 * Lưu ý: Chờ 1 giây sau khi trang tải xong mới bind để đảm bảo DOM đã sẵn sàng.
 * Không tác động trên trang simulator hoặc chế độ mobile.
 */
Finalizer.Desktop.handleHoverMenu = function() {
    // Nếu đang ở trang simulator thì không làm gì
    if (window.location.href.includes("simulator.php")) {
        return;
    }

    // Ghi log thông tin Shopify (nếu cần debug)
    if (!window.Shopify)
        navidebug.log("Shopify info: Not in a Shopify shop ");
    else
        navidebug.log("Shopify info: ", window.Shopify);

    // Chỉ áp dụng ở chế độ desktop
    if (!naviman.isMobileMode()) {
        setTimeout(() => {
            var actions = document.getElementsByClassName("navi-hover");
            for (var i = 0; i < actions.length; i++) {
                actions[i].addEventListener("mouseover", function () {
                    if (!this.classList.contains("navi-hover-active")) {
                        this.classList.add("navi-hover-active");
                        this.click();
                    }
                });

                actions[i].addEventListener("mouseout", function () {
                    if (this.classList.contains("navi-hover-active")) {
                        this.classList.remove("navi-hover-active");
                        this.click();
                    }
                });
            }
        }, 1000);
    }
}


/**********************************************************/var Finalizer = Finalizer || {}
Finalizer.Optimize = Finalizer.Optimize || {}; 



/**
 * Gắn MutationObserver để luôn lock giá trị aria-expanded="false" cho element được chỉ định.
 * - Nếu đã gắn observer vào element thì không tạo thêm.
 * - Khi attribute aria-expanded thay đổi, sẽ tự động reset về "false".
 * - Dùng _ariaObserver để lưu lại observer, tránh lặp lại (memory leak).
 */

/*
Finalizer.Optimize.lockAriaExpanded = function(el) {
    // Nếu đã có observer gắn vào element, không tạo lại
    if(el._ariaObserver) return;
  
    const observer = new MutationObserver(muts => {
      muts.forEach(m => {
        if(m.type === 'attributes' && m.attributeName === 'aria-expanded') {
          el.setAttribute('aria-expanded','false');
        }
      });
    });
  
    observer.observe(el, { attributes: true, attributeFilter: ['aria-expanded'] });
  
    // Lưu reference để tránh tạo nhiều observer
    el._ariaObserver = observer;
} */


/**
 * Đảm bảo mỗi .naviItem chỉ chứa duy nhất một phần tử <ul class="navigation">.
 * - Nếu có nhiều hơn một <ul class="navigation"> bên trong .naviItem,
 *   hàm sẽ giữ lại phần tử đầu tiên và xoá tất cả các phần tử còn lại.
 */
Finalizer.Optimize.fixOnlyOneULNavigation = function() {
    const naviItems = document.querySelectorAll('.naviItem');
    naviItems.forEach(item => {
        const navigations = item.querySelectorAll('ul.navigation');
        if (navigations.length > 1) {
            for (let i = 1; i < navigations.length; i++) {
                if (navigations[i] && navigations[i].parentNode) {
                    navigations[i].parentNode.removeChild(navigations[i]);
                }
            }
        }
    });
};    

/**********************************************************/ var Finalizer = Finalizer || {}
Finalizer.DebugMode = Finalizer.DebugMode || {}; 

/*******************************************************
Nếu là debug mode thì luôn luôn hiển thị menu
*******************************************************/  
// Bước 1: Chờ trang web load hoàn toàn

window.addEventListener("load", function() {
    // Bước 2: Delay 1 giây để đảm bảo mọi thứ đã sẵn sàng
    // CHÚ Ý: HIỆN TẠI HÀM NÀY KO CHẠY ĐÚNG NÊN ĐÃ BỎ RA
    // Finalizer.DebugMode.checkToAlwaysDisplayMenu();
});

/**
 * Luôn hiển thị menu NaviPlus khi ở debug mode.
 * 
 * Quy trình:
 * - Sau 1s kể từ khi gọi hàm, kiểm tra sessionStorage có bật _naviplus_debug_mode hay không.
 * - Nếu có:
 *   + Xóa embed_id khỏi biến đã xử lý để cho phép nạp lại menu.
 *   + Reset cờ NAVIPLUS_APP_LOADED để file start.js chạy lại.
 *   + Tìm url file start.js nếu có custom, lấy bản cuối cùng nếu có nhiều, nếu không thì dùng url mặc định.
 *   + Tạo mã nhúng HTML+script để chèn lại menu NaviPlus (sử dụng embed_id mẫu).
 *   + Chèn mã nhúng vào cuối body và gọi initNaviplusApp() để khởi tạo lại menu.
 */
/*
Finalizer.DebugMode.checkToAlwaysDisplayMenu = function() {
    setTimeout(() => {
        // Bước 3: Kiểm tra xem có đang ở debug mode không
        if (sessionStorage.getItem("_naviplus_debug_mode") === true || sessionStorage.getItem("_naviplus_debug_mode") === "true") {

            // Bước 4: Reset các flag để start.js có thể chạy lại
            // 4.1: Xóa embed ID khỏi danh sách đã xử lý
            window._processedEmbedIds = window._processedEmbedIds || {};
            delete window._processedEmbedIds["SF-4707896042"];

            // 4.2: Reset flag đã load NaviPlus app
            window._NAVIPLUS_APP_LOADED = false;

            // Bước 5: Tìm URL của start.js trong HTML hiện tại
            var startJsUrl = "https://live.naviplus.app/start.js"; // URL fallback
            var scripts = document.querySelectorAll('script[src*="start.js"]');
            if (scripts.length > 0) {
                startJsUrl = scripts[scripts.length - 1].src; // Lấy script cuối cùng (mới nhất)
            }
            console.log("Debug mode: Found start.js URL:", startJsUrl);

            // Bước 6: Tạo embed code để chèn NaviPlus menu
            console.log("Debug mode: Reset processed embed IDs and NaviPlus app loaded flag");

            (window._navi_setting ||= []).push({
                embed_id: "SF-4707896042"
            });

            var embedCode = `
                <div class="naviman_app section_naviman_app" id="SF-123456789-container"></div>
                <script src="${startJsUrl}" async><\/script>
                <script src="https://dev-shopify.naviplus.app/naviplus/frontend/uigen.js.php" shop="anbani2023.myshopify.com" env="shopify" embed_id="SF-4707896042" async><\/script>
            `;

            // Bước 7: Chèn embed code vào cuối body
            document.body.insertAdjacentHTML('beforeend', embedCode);
            initNaviplusApp();
        }
    }, 1000);
}    */


/**********************************************************/var Finalizer = Finalizer || {}
Finalizer.Event = Finalizer.Event || {}; 

/**
 * Đóng menu khi người dùng click ra ngoài vùng menu.
 * - Nếu đang có menu con mở (dựa vào biến toàn cục _openingMenuItem...), gọi hàm để đóng submenu đó.
 * - Ngược lại, ẩn tất cả các ul.children, đồng thời ẩn overlay.
 * Lưu ý: Hợp lệ chỉ khi event.target có hàm closest (tránh lỗi với element đặc biệt/iframe cũ).
 */
Finalizer.Event.handleTouchOutsideAllMenus = function() {
    document.addEventListener("click", function(event) {
        if (typeof event.target.closest !== "function") return;

        /* Click vào overlay_global (slide menu): để handleTouchOutsideSlideMenu xử lý, tránh conflict */
        if (event.target.closest(".naviman_app_overlay_global")) return;

        /* Click vào trigger mở slide menu: đang mở menu, không xử lý "click ngoài" (tránh overlay hiện rồi ẩn ngay) */
        if (event.target.closest("[data-navi-trigger-bound], .navi-hambuger-overlay")) return;

        // Kiểm tra nếu click không nằm trong menu/submenu
        if (
            event.target.closest(".naviman_app ul li ul.children") === null &&
            event.target.closest(".naviman_app .naviItem") === null
        ) {
            if (
                window._openingMenuItem &&
                window._openingMenuKind &&
                window._openingEmbedId
            ) {
                naviman.showLevel2Items(
                    window._openingMenuItem,
                    window._openingMenuKind,
                    window._openingEmbedId
                );
            } else {
                // Đóng toàn bộ dropdown (level 2/3) + ẩn overlay + mở khóa scroll (TABBAR, SECTION, ...)
                if (naviman.Helper && typeof naviman.Helper.closeAllDropdowns === "function") {
                    naviman.Helper.closeAllDropdowns();
                }
            }
        }
    });
}

/**
 * Đóng menu kiểu slide (CONTEXT_SLIDE) khi người dùng click vào nút đóng (hamburger_close)
 * hoặc vào vùng overlay của app (naviman_app_overlay_global).
 * - Chỉ xử lý khi event.target hợp lệ (có hàm closest).
 * - Tùy thuộc vào chế độ mobile/desktop, ẩn menu nếu không phải dạng "fullfixed".
 * - Gọi hàm cập nhật lại trạng thái nút back nếu cần.
 * - Bỏ lock scroll trên body.
 * - Ẩn overlay toàn cục.
 */
Finalizer.Event.getVisibleSlideMenus = function(items) {
    var result = [];
    items.forEach(function(item) {
        if (window.innerWidth <= 768) {
            if (!item.classList.contains("hamburger-mobile-fullfixed") && getComputedStyle(item).visibility === "visible")
                result.push(item);
        } else {
            if (!item.classList.contains("hamburger-desktop-fullfixed") && getComputedStyle(item).visibility === "visible")
                result.push(item);
        }
    });
    return result;
};

/**
 * resetSlideMenuState( item )
 * Reset trạng thái nội bộ slide menu khi đóng panel level 1:
 * ẩn submenu, xóa class expand, reset header/back button.
 * Dùng cho slide menu không phải ui="slide-horizontal"
 * (slide-horizontal dùng resetToLevel1 thay thế).
 *
 * @param {Element} item - .naviItem.CONTEXT_SLIDE element
 */
Finalizer.Event.resetSlideMenuState = function(item) {
    item.querySelectorAll('ul.children').forEach(function(ul) { ul.style.display = "none"; });
    item.querySelectorAll('span.arrow').forEach(function(a) { a.style.display = "none"; });
    item.querySelectorAll('.menu-expand, .menu-expand-level1, .menu-expand-level2').forEach(function(li) {
        li.classList.remove("menu-expand", "menu-expand-level1", "menu-expand-level2");
    });
    if (typeof naviman.Menu.Context.Horizontal.showBackButton === "function") {
        naviman.Menu.Context.Horizontal.showBackButton(item);
    } else {
        item.classList.remove("navi-back-visible");
    }
    if (naviman.Menu.Context.Horizontal && typeof naviman.Menu.Context.Horizontal.setHeaderTitle === "function") {
        naviman.Menu.Context.Horizontal.setHeaderTitle(item, "");
    }
};

Finalizer.Event.handleTouchOutsideSlideMenu = function() {
    document.addEventListener("click", function(event) {
        if (typeof event.target.closest !== "function") return;

        const isCloseBtn = event.target.closest(".naviItem .hamburger_close");
        const isOverlay = event.target.closest(".naviman_app_overlay_global");

        if (!isCloseBtn && !isOverlay) return;

        var items = document.querySelectorAll(".naviItem.CONTEXT_SLIDE");

        // Nếu click overlay_global:
        // - Nếu KHÔNG có slide menu nào: coi như case Tabbar/Section dùng chung overlay_global.
        // - Nếu CÓ slide menu: luôn đóng hẳn tất cả (resetToLevel1 + hamburgerClose),
        //   bất kể đang ở level 2 hay 3 → tránh cảm giác chỉ "lùi 1 level".
        if (isOverlay) {
            var visibleSlides = Finalizer.Event.getVisibleSlideMenus(items);

            if (visibleSlides.length === 0) {
                Finalizer.Event.closeByOverlayGlobalForNonSlideMenus();
                return;
            }

            var doneCountOverlay = visibleSlides.length;
            var onAllDoneOverlay = function() {
                Helper_lockBodyScroll(false);
                var overlayGlobal = document.querySelector(".naviman_app_overlay_global");
                if (overlayGlobal) overlayGlobal.classList.remove("is-open");
                naviman.Helper.hideNaviOverlay();
            };

            visibleSlides.forEach(function(item) {
                if (item.getAttribute("ui") === "slide-horizontal" && naviman.Menu.Context.Horizontal.resetToLevel1) {
                    naviman.Menu.Context.Horizontal.resetToLevel1(item);
                } else {
                    Finalizer.Event.resetSlideMenuState(item);
                }
                Animation.hamburgerClose(item, {
                    doneCallback: function() {
                        if (--doneCountOverlay === 0) onAllDoneOverlay();
                    }
                });
            });

            return;
        }

        // Đến đây là trường hợp bấm nút close (hamburger_close)
        var needClose = Finalizer.Event.getVisibleSlideMenus(items);

        var doneCount = needClose.length;
        var onAllDone = function() {
            Helper_lockBodyScroll(false);
            var overlayGlobal = document.querySelector(".naviman_app_overlay_global");
            if (overlayGlobal) overlayGlobal.classList.remove("is-open");
            naviman.Helper.hideNaviOverlay();
        };

        if (needClose.length === 0) {
            items.forEach(function(item) {
                if (item.getAttribute("ui") === "slide-horizontal" && naviman.Menu.Context.Horizontal.resetToLevel1) {
                    naviman.Menu.Context.Horizontal.resetToLevel1(item);
                } else {
                    Finalizer.Event.resetSlideMenuState(item);
                }
            });
            onAllDone();
        } else {
            needClose.forEach(function(item) {
                if (item.getAttribute("ui") === "slide-horizontal" && naviman.Menu.Context.Horizontal.resetToLevel1) {
                    naviman.Menu.Context.Horizontal.resetToLevel1(item);
                } else {
                    Finalizer.Event.resetSlideMenuState(item);
                }
                Animation.hamburgerClose(item, {
                    doneCallback: function() {
                        if (--doneCount === 0) onAllDone();
                    }
                });
            });
        }
    }); 
}


/**
 * Xử lý khi bấm nút back trong menu kiểu slide-horizontal (hamburger_back hoặc back-icon)
 * - Kiểm tra hợp lệ:
 *   + Sự kiện phải xuất phát từ nút back (hamburger_back, back-icon) nằm trong .naviItem
 *   + Tìm menu cha .naviItem.CONTEXT_SLIDE, chỉ áp dụng khi có thuộc tính ui="slide-horizontal"
 * - Khi hợp lệ, ngăn propagation & click mặc định, ưu tiên đóng level 3 nếu đang mở, nếu không thì đóng level 2
 */
Finalizer.Event.handleTouchBackButtonOnSlideMenuHorizontal = function() {
    /* Capture phase: chạy trước onclick của li để tránh gotoUrl xử lý khi click back clone */
    document.addEventListener("click", function(event) {
        // Kiểm tra nút back (hamburger_back, back-icon, hoặc slide-horizontal-back-clone khi ở level 3)
        const isBackBtn = event.target.closest(".naviItem .hamburger_back, .naviItem .back-icon, .naviItem .slide-horizontal-back-clone");
        if (!isBackBtn) return;

        // Xác định menu cần thao tác (kiểm tra loại menu và kiểu slide-horizontal)
        const menu = event.target.closest(".naviItem.CONTEXT_SLIDE");
        if (!menu) return;
        if (menu.getAttribute("ui") !== "slide-horizontal") return;

        // Ngăn click/tác động bubbling, chặn trigger menu item ngoài
        event.preventDefault();
        event.stopPropagation();
        if (typeof event.stopImmediatePropagation === "function")
            event.stopImmediatePropagation();

        // Ưu tiên đóng level 3 trước, sau đó mới đóng level 2
        if (naviman.Menu.Context.Horizontal.closeLevel3(menu)) return;
        if (naviman.Menu.Context.Horizontal.closeLevel2(menu)) return;
    }, true); /* capture: true - chạy trước onclick của li, tránh gotoUrl xử lý khi click back */
}

/**
 * Đóng toàn bộ menu không phải CONTEXT_SLIDE khi click overlay_global:
 * - Đóng hết dropdown (level 2/3) qua Helper.closeAllDropdowns()
 * - Mở khóa scroll body (Helper_lockBodyScroll(false))
 * - Gỡ class is-open khỏi .naviman_app_overlay_global
 */
Finalizer.Event.closeByOverlayGlobalForNonSlideMenus = function() {
    // Khôi phục z-index cho menu đang mở (Tabbar, FAB...) nếu có
    if (typeof ZIndex !== "undefined" && typeof ZIndex.restoreAndResetOnClose === "function") {
        ZIndex.restoreAndResetOnClose();
    }

    if (typeof naviman !== "undefined" && naviman.Helper && typeof naviman.Helper.closeAllDropdowns === "function") {
        naviman.Helper.closeAllDropdowns();
    }
    if (typeof Helper_lockBodyScroll === "function") {
        Helper_lockBodyScroll(false);
    }
    var overlayGlobal = document.querySelector(".naviman_app_overlay_global");
    if (overlayGlobal) overlayGlobal.classList.remove("is-open");
};


/**********************************************************/var Finalizer = Finalizer || {}
Finalizer.BodyLocker = Finalizer.BodyLocker || {}; 


/**
 * Khóa scroll của trang bằng cách thêm class 'is-open' cho .naviman_app_overlay_global.
 * Kiểm tra tồn tại của overlay trước khi thao tác.
 */
Finalizer.BodyLocker.lock = function() {
    const overlayGlobal = document.querySelector('.naviman_app_overlay_global');
    if (!overlayGlobal) return;
    overlayGlobal.classList.add('is-open');
}

/**
 * Mở khóa scroll của trang bằng cách loại bỏ class 'is-open' khỏi .naviman_app_overlay_global.
 * Kiểm tra tồn tại của overlay trước khi thao tác.
 */
Finalizer.BodyLocker.unlock = function() {
    const overlayGlobal = document.querySelector('.naviman_app_overlay_global');
    if (!overlayGlobal) return;
    overlayGlobal.classList.remove('is-open');
}


/**
 * API helper: Gọi lock nếu isLock=true, ngược lại gọi unlock.
 * Giúp các module khác dễ dàng khóa/mở khóa scroll body qua hàm trung gian.
 */
Helper_lockBodyScroll = function(isLock) {
    if (isLock) {
        Finalizer.BodyLocker.lock();
    } else {
        Finalizer.BodyLocker.unlock();
    }
};



/**********************************************************/  (window.Navi ??= {}).Setting ??= {};

var Finalizer = Finalizer || {}


if (!window._navimanCallFinalizerOneTimeOnly) {
    window._navimanCallFinalizerOneTimeOnly = true;    
    
    window.addEventListener("load", function() {

        // Xử lý hover chuột với desktop qua class
        Finalizer.Desktop.handleHoverMenu();      
    
        // Fix cho việc chỉ hiện 1 ul navigation duy nhất khi hover
        Finalizer.Optimize.fixOnlyOneULNavigation();    
    
        // Fix cho việc bấm vào ngoài menu thì đóng menu vào
        Finalizer.Event.handleTouchOutsideAllMenus();   

        // Fix cho việc click vào close/overlay thì sẽ đóng slide/hamburger menu
        Finalizer.Event.handleTouchOutsideSlideMenu();   
        
        //Back button cho CONTEXT_SLIDE ui=slide-horizontal. Đóng submenu đang mở (level 3 -> level 2 -> level 1)
        Finalizer.Event.handleTouchBackButtonOnSlideMenuHorizontal();
    });

} // End of click out of menu

/********************************************************** 
    Fix cho menu mobile megamenu dropdown thì khi expand ra thì ko cho phép scroll page
    TẠM XOÁ VÌ GÂY LỖI LUNG TUNG CHO TABBAR
***********************************************************/
/*
if (window.innerWidth <= 768) {
    if (!window._fixMobileBodyScroll) {
        window._fixMobileBodyScroll = true;
    
        const waitForOverlay = () => {
        const overlay = document.querySelector('.naviman_app_overlay');
        if (!overlay) {
            setTimeout(waitForOverlay, 100);
            return;
        }
    
        const checkOverlayVisibility = () => {
            const display = window.getComputedStyle(overlay).display;
            const isVisible = display !== 'none';
            // Trang chỉ slide menu: naviman_app_overlay luôn none. Không unlock khi slide đang mở. 
            if (!isVisible) {
                var slideMenus = document.querySelectorAll('.naviItem.CONTEXT_SLIDE');
                if (slideMenus.length && Array.from(slideMenus).some(function(el) { return window.getComputedStyle(el).visibility === 'visible'; }))
                    return;
            }
            if (typeof Helper_lockBodyScroll === 'function') {
                Helper_lockBodyScroll(isVisible);
            } else {
                document.body.style.overflow = isVisible ? 'hidden' : '';
                document.documentElement.style.overflowY = isVisible ? 'hidden' : '';
            }
        };
    
        const observer = new MutationObserver(checkOverlayVisibility);
    
        observer.observe(overlay, {
            attributes: true,
            attributeFilter: ['style', 'class']
        });
    
        checkOverlayVisibility();
        };
    
        document.addEventListener('DOMContentLoaded', waitForOverlay);
    }
}*/

/**********************************************************/


var naviLanguage = (function(){

    /* var countryList = {
        'ab' : 'Abkhazian',
        'aa' : 'Afar',
        'af' : 'Afrikaans',
        'ak' : 'Akan',
        'sq' : 'Albanian',
        'am' : 'Amharic',
        'ar' : 'Arabic',
        'an' : 'Aragonese',
        'hy' : 'Armenian',
        'as' : 'Assamese',
        'av' : 'Avaric',
        'ae' : 'Avestan',
        'ay' : 'Aymara',
        'az' : 'Azerbaijani',
        'bm' : 'Bambara',
        'ba' : 'Bashkir',
        'eu' : 'Basque',
        'be' : 'Belarusian',
        'bn' : 'Bengali',
        'bh' : 'Bihari languages',
        'bi' : 'Bislama',
        'bs' : 'Bosnian',
        'br' : 'Breton',
        'bg' : 'Bulgarian',
        'my' : 'Burmese',
        'ca' : 'Catalan, Valencian',
        'km' : 'Central Khmer',
        'ch' : 'Chamorro',
        'ce' : 'Chechen',
        'ny' : 'Chichewa, Chewa, Nyanja',
        'zh' : 'Chinese',
        'cu' : 'Church Slavonic, Old Bulgarian, Old Church Slavonic',
        'cv' : 'Chuvash',
        'kw' : 'Cornish',
        'co' : 'Corsican',
        'cr' : 'Cree',
        'hr' : 'Croatian',
        'cs' : 'Czech',
        'da' : 'Danish',
        'dv' : 'Divehi, Dhivehi, Maldivian',
        'nl' : 'Dutch, Flemish',
        'dz' : 'Dzongkha',
        'en' : 'English',
        'eo' : 'Esperanto',
        'et' : 'Estonian',
        'ee' : 'Ewe',
        'fo' : 'Faroese',
        'fj' : 'Fijian',
        'fi' : 'Finnish',
        'fr' : 'French',
        'ff' : 'Fulah',
        'gd' : 'Gaelic, Scottish Gaelic',
        'gl' : 'Galician',
        'lg' : 'Ganda',
        'ka' : 'Georgian',
        'de' : 'German',
        'ki' : 'Gikuyu, Kikuyu',
        'el' : 'Greek (Modern)',
        'kl' : 'Greenlandic, Kalaallisut',
        'gn' : 'Guarani',
        'gu' : 'Gujarati',
        'ht' : 'Haitian, Haitian Creole',
        'ha' : 'Hausa',
        'he' : 'Hebrew',
        'hz' : 'Herero',
        'hi' : 'Hindi',
        'ho' : 'Hiri Motu',
        'hu' : 'Hungarian',
        'is' : 'Icelandic',
        'io' : 'Ido',
        'ig' : 'Igbo',
        'id' : 'Indonesian',
        'ia' : 'Interlingua (International Auxiliary Language Association)',
        'ie' : 'Interlingue',
        'iu' : 'Inuktitut',
        'ik' : 'Inupiaq',
        'ga' : 'Irish',
        'it' : 'Italian',
        'ja' : 'Japanese',
        'jv' : 'Javanese',
        'kn' : 'Kannada',
        'kr' : 'Kanuri',
        'ks' : 'Kashmiri',
        'kk' : 'Kazakh',
        'rw' : 'Kinyarwanda',
        'kv' : 'Komi',
        'kg' : 'Kongo',
        'ko' : 'Korean',
        'kj' : 'Kwanyama, Kuanyama',
        'ku' : 'Kurdish',
        'ky' : 'Kyrgyz',
        'lo' : 'Lao',
        'la' : 'Latin',
        'lv' : 'Latvian',
        'lb' : 'Letzeburgesch, Luxembourgish',
        'li' : 'Limburgish, Limburgan, Limburger',
        'ln' : 'Lingala',
        'lt' : 'Lithuanian',
        'lu' : 'Luba-Katanga',
        'mk' : 'Macedonian',
        'mg' : 'Malagasy',
        'ms' : 'Malay',
        'ml' : 'Malayalam',
        'mt' : 'Maltese',
        'gv' : 'Manx',
        'mi' : 'Maori',
        'mr' : 'Marathi',
        'mh' : 'Marshallese',
        'ro' : 'Moldovan, Moldavian, Romanian',
        'mn' : 'Mongolian',
        'na' : 'Nauru',
        'nv' : 'Navajo, Navaho',
        'nd' : 'Northern Ndebele',
        'ng' : 'Ndonga',
        'ne' : 'Nepali',
        'se' : 'Northern Sami',
        'no' : 'Norwegian',
        'nb' : 'Norwegian Bokmål',
        'nn' : 'Norwegian Nynorsk',
        'ii' : 'Nuosu, Sichuan Yi',
        'oc' : 'Occitan (post 1500)',
        'oj' : 'Ojibwa',
        'or' : 'Oriya',
        'om' : 'Oromo',
        'os' : 'Ossetian, Ossetic',
        'pi' : 'Pali',
        'pa' : 'Panjabi, Punjabi',
        'ps' : 'Pashto, Pushto',
        'fa' : 'Persian',
        'pl' : 'Polish',
        'pt' : 'Portuguese',
        'qu' : 'Quechua',
        'rm' : 'Romansh',
        'rn' : 'Rundi',
        'ru' : 'Russian',
        'sm' : 'Samoan',
        'sg' : 'Sango',
        'sa' : 'Sanskrit',
        'sc' : 'Sardinian',
        'sr' : 'Serbian',
        'sn' : 'Shona',
        'sd' : 'Sindhi',
        'si' : 'Sinhala, Sinhalese',
        'sk' : 'Slovak',
        'sl' : 'Slovenian',
        'so' : 'Somali',
        'st' : 'Sotho, Southern',
        'nr' : 'South Ndebele',
        'es' : 'Spanish, Castilian',
        'su' : 'Sundanese',
        'sw' : 'Swahili',
        'ss' : 'Swati',
        'sv' : 'Swedish',
        'tl' : 'Tagalog',
        'ty' : 'Tahitian',
        'tg' : 'Tajik',
        'ta' : 'Tamil',
        'tt' : 'Tatar',
        'te' : 'Telugu',
        'th' : 'Thai',
        'bo' : 'Tibetan',
        'ti' : 'Tigrinya',
        'to' : 'Tonga (Tonga Islands)',
        'ts' : 'Tsonga',
        'tn' : 'Tswana',
        'tr' : 'Turkish',
        'tk' : 'Turkmen',
        'tw' : 'Twi',
        'ug' : 'Uighur, Uyghur',
        'uk' : 'Ukrainian',
        'ur' : 'Urdu',
        'uz' : 'Uzbek',
        've' : 'Venda',
        'vi' : 'Vietnamese',
        'vo' : 'Volap_k',
        'wa' : 'Walloon',
        'cy' : 'Welsh',
        'fy' : 'Western Frisian',
        'wo' : 'Wolof',
        'xh' : 'Xhosa',
        'yi' : 'Yiddish',
        'yo' : 'Yoruba',
        'za' : 'Zhuang, Chuang',
        'zu' : 'Zulu'
    }; */

    function stringByLanguage( str ) {
        if( str == null )
            return "";
        str = String(str);
        str = str.trim();
        let arr = str.match(/<.*?>/g);

        if( arr == null )
            return str;

        if( arr.length == 0 )
            return str;

        // 1. Loại bỏ các phần có <language_code: >
        let localizeStr = str;
        arr.forEach((item) => {
            localizeStr = localizeStr.replace( item, "" );
        });
        localizeStr = localizeStr.trim();

        // 2. Tạo một array gồm language_code:string
        langStr = [];
        langStr.push(["localize", localizeStr]);

        arr.forEach((item) => {
            let child = item.replace( "<", "" ).replace( "/>", "" ).replace( ">", "" );
            var index = child.indexOf(':');
            if( index > -1 ) {
                var child_array = [child.slice(0, index).trim(), child.slice(index + 1).trim()];
                if(child_array.length == 2)
                    if( child_array[0] != "" )
                        langStr.push([child_array[0], child_array[1]]);
            }
        });

        // 3. So sánh trong danh sách trả về
        let currentLang = currentLanguage();
        
        var output = localizeStr;
        langStr.forEach((lang) => {
            if( lang[0] == currentLang ) {
                output = lang[1];
                return;
            }
        });

        return output;
    }

    /*function currentLanguage() {
        let pathName =  document.location.pathname;

        if( pathName.length < 3 )
            return "localize";

        for (var lang in countryList) {
            var langCom = "/" + lang;

            if( pathName.substring(0, 3).toLowerCase() == langCom.toLowerCase() ) {
                if( pathName.length == 3 )
                    return lang;

                if( pathName.length > 3 )
                    if( pathName[3] == "/" || pathName[3] == "&" || pathName[3] == "#" || pathName[3] == "?" || pathName[3] == "%" )
                        return lang;
            }
        }

        return "localize";
    }*/

    function currentLanguage() {
        let pathName = document.location.pathname;
    
        // Loại bỏ domain và lấy phần đầu tiên sau dấu "/"
        let pathParts = pathName.split('/').filter(part => part.length > 0);
    
        // Kiểm tra nếu không có đủ phần sau dấu "/"
        if (pathParts.length < 1) {
            return "localize";
        }
    
        // Lấy phần đầu tiên sau dấu "/" và trả về nó mà không cần kiểm tra trong countryList
        return pathParts[0];
    }

    return {
        Name: "Naviman Language",
        stringByLanguage: stringByLanguage,
        currentLanguage: currentLanguage,

    };

})();

(() => {
  // Prevent multiple initialization in the same session
  if (window.__naviplus_debug_mode_initialized) {
    return;
  }
  window.__naviplus_debug_mode_initialized = true;

  const debugModeStorageKey = "_naviplus_debug_mode";
  const welcomeDismissedStorageKey = "_naviplus_debug_welcome_dismissed";
  const inspectorEnabledStorageKey = "_naviplus_debug_inspector_enabled";

  const uiStyleId = "dm_ui_style";
  const floatButtonId = "dm_float_button";
  const modalBackdropId = "dm_modal_backdrop";
  const modalId = "dm_modal";

  const inspectorOverlayId = "dm_inspector_overlay";
  const inspectorStyleId = "dm_inspector_style";
  const inspectorSnackbarId = "dm_inspector_snackbar";

  const TEXT = {
    logoUrl: "https://cdn.naviplus.app/static/golive/images/logo/webp/logo-navi-1-big-round.webp",
    logoAlt: "Navi+",

    modalTitle: "Navi+ Debug mode",
    modalCloseAriaLabel: "Close",
    modalCloseSymbol: "×",
    debugStatusOn: "Status: ON",
    debugTurnOff: "Turn off",

    modalDescription: [ 
      "<b style='display:block;padding-top:8px'>To insert before/after an element or replace the original menu (Mega Menu / Grid Menu):</b>",
      "<div>1. Hover over elements on the page to see their CSS selector.</div>",
      "<div>2. Use ↑ ↓ / ← → to navigate between elements until you find the right one.</div>",
      "<div>3. Press <kbd>Cmd/Ctrl + C</kbd> to copy the selector.</div>",
      "<b style='display:block;padding-top:8px'>To replace the original slide menu:</b>",
      "<div>1. Switch your site to mobile view.</div>",
      "<div>2. Hover over the target area (e.g. the hamburger menu icon), then press <kbd>Cmd/Ctrl + E</kbd> to simulate a click.</div>",
      "<div>3. If the menu opens → you've found the right selector.</div>",
      "<div>4. Press <kbd>Cmd/Ctrl + C</kbd> to copy it. (Your Navi+ menu will replace this element.)</div>",
      "<div style='padding-top:10px'><a target=_blank href='https://help.naviplus.io/docs/usage/debug-mode-find-css-selectors'>",
      "View detail</a></div>",
      
    ].join(""),
    enableLabel: "To enable: ",
    enableCode: "yourdomain.com/#navidebug-on",
    disableLabel: "To disable: ",
    disableCode: "yourdomain.com/#navidebug-off",

    turnedOffTitle: "Navi+ debug mode is now turned off",
    turnedOffMessage: "To enable it again, please use the following URL syntax on your website:",
    turnedOffStatusOff: "Status: OFF",
    turnedOffTurnOn: "Turn on",

    inspectorCopyHintMac: "To copy: [⌘ + C] | Simulate click: [⌘ + E] | Move to parent level: [↑/←], [↓/→] child",
    inspectorCopyHintWindows: "To copy: [Ctrl + C] | Simulate click: [Ctrl + E] | Move to parent level: [↑/←], [↓/→] child",
    inspectorCopiedSnackbar: (selector) => `Copied "${selector}"..`,
    inspectorSimulatedClickSnackbar: (selector) => `Simulated click on "${selector}"`,

    findCssLabel: "Find CSS Selector:",
    findCssOn: "ON",
    findCssOff: "OFF",
    findCssTurnOff: "TURN OFF",
    findCssTurnOn: "TURN ON",
  };

  const safeSessionStorage = {
    get(key) {
      try {
        return window.sessionStorage.getItem(key);
      } catch {
        return null;
      }
    },
    set(key, value) {
      try {
        window.sessionStorage.setItem(key, value);
      } catch {}
    },
    remove(key) {
      try {
        window.sessionStorage.removeItem(key);
      } catch {}
    },
  };

  const isMac = (() => {
    const platform = String(navigator.platform || "");
    if (/(Mac|iPhone|iPad|iPod)/i.test(platform)) return true;
    const ua = String(navigator.userAgent || "");
    return /(Mac OS X|iPhone|iPad|iPod)/i.test(ua);
  })();

  const applyDebugModeFromHash = () => {
    const hash = String(window.location.hash || "");
    const sawOn = hash.includes("#navidebug-on");
    const sawOff = hash.includes("#navidebug-off");

    if (sawOn) {
      safeSessionStorage.set(debugModeStorageKey, "true");
    }
    if (sawOff) {
      safeSessionStorage.remove(debugModeStorageKey);
    }

    return { sawOn, sawOff };
  };

  const isDebugModeEnabled = () => safeSessionStorage.get(debugModeStorageKey) === "true";

  /** Mặc định ON. Lưu trong session. */
  const isInspectorEnabled = () => safeSessionStorage.get(inspectorEnabledStorageKey) !== "false";
  const setInspectorEnabled = (v) => safeSessionStorage.set(inspectorEnabledStorageKey, v ? "true" : "false");

  const onReady = (fn) => {
    if (document.readyState === "loading") {
      document.addEventListener("DOMContentLoaded", fn, { once: true });
      return;
    }
    fn();
  };

    let inspectorController = null;
    let currentElementStack = []; // Stack of selected elements for navigation
    let currentStackIndex = -1; // Current position in stack

    const disableInspector = () => {
      if (!inspectorController) return;
      inspectorController.cleanup();
      inspectorController = null;
      currentElementStack = [];
      currentStackIndex = -1;
    };

    const enableInspector = () => {
      if (inspectorController) return;
      inspectorController = createInspector();
    };

  const syncInspectorWithDebugMode = () => {
    if (isDebugModeEnabled() && isInspectorEnabled()) enableInspector();
    else disableInspector();
  };

  let debugUIController = null;
  let turnedOffController = null;

  const disableDebugUI = () => {
    if (!debugUIController) return;
    debugUIController.cleanup();
    debugUIController = null;
  };

  const enableDebugUI = () => {
    if (debugUIController) return;
    debugUIController = createDebugUI();
  };

  const syncDebugUIWithDebugMode = () => {
    if (isDebugModeEnabled()) enableDebugUI();
    else disableDebugUI();
  };

  const disableTurnedOffNotice = () => {
    if (!turnedOffController) return;
    turnedOffController.cleanup();
    turnedOffController = null;
  };

  const createDebugUI = () => {
    const cleanupTasks = [];
    const removed = { value: false };

    const removeAll = () => {
      if (removed.value) return;
      removed.value = true;
      for (const task of cleanupTasks.splice(0)) task();
    };

    if (!document.getElementById(uiStyleId)) {
      const style = document.createElement("style");
      style.id = uiStyleId;
      style.textContent = `
        #${floatButtonId} {
          position: fixed;
          right: 14px;
          top: 50%;
          transform: translate3d(0, -50%, 0);
          width: 40px;
          height: 40px;
          border-radius: 8px;
          border: 1px solid rgba(17,24,39,0.4);
          padding: 0;
          display: grid;
          place-items: center;
          background: #ffffff;
          box-shadow: 0 8px 20px rgba(0,0,0,0.16);
          cursor: pointer;
          z-index: 2147483646;
        }

        #${floatButtonId} img {
          width: 40px;
          height: 40px;
          border-radius: 8px;
          display: block;
        }

        #${modalBackdropId} {
          position: fixed;
          inset: 0;
          background: rgba(0,0,0,0.25);
          z-index: 2147483646;
          display: none;
        }

        #${modalBackdropId}[data-open="1"] {
          display: block;
        }

        #${modalId} {
          position: fixed;
          left: 50%;
          top: 50%;
          transform: translate3d(-50%, -50%, 0);
          width: min(820px, calc(100vw - 24px));
          background: #ffffff;
          border: 1px solid rgba(17,24,39,0.4);
          border-radius: 16px;
          box-shadow: 0 24px 60px rgba(0,0,0,0.24);
          color: rgba(17,24,39,0.95);
          z-index: 2147483647;
          display: none;
          font-family: ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial;
        }

        #${modalId}[data-open="1"] {
          display: block;
        }

        #${modalId} [data-part="header"] {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 12px;
          padding: 12px 14px;
        }

        #${modalId} [data-part="brand"] {
          display: flex;
          align-items: center;
          gap: 10px;
          min-width: 0;
        }

        #${modalId} [data-part="brand"] img {
          width: 28px;
          height: 28px;
          border-radius: 4px;
          display: block;
        }

        #${modalId} [data-part="title"] {
          font-weight: 750;
          letter-spacing: 0.01em;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        #${modalId} [data-part="header-right"] {
          display: flex;
          align-items: center;
          gap: 10px;
          flex-shrink: 0;
        }

        #${modalId} [data-part="status"] {
          font-size: 12px;
          font-weight: 700;
          padding: 6px 10px;
          border-radius: 8px;
          border: 1px solid rgba(34,197,94,0.30);
          background: rgba(34,197,94,0.14);
          color: rgba(21,128,61,0.95);
          white-space: nowrap;
          display: none;
        }

        #${modalId} [data-part="off"] {
          appearance: none;
          border: 1px solid rgba(17,24,39,0.18);
          background: rgba(17,24,39,0.06);
          color: rgba(17,24,39,0.92);
          border-radius: 8px;
          padding: 4px 10px;
          font-weight: 650;
          cursor: pointer;
          white-space: nowrap;
        }

        #${modalId} [data-part="close"] {
          appearance: none;
          border: 1px solid rgba(17,24,39,0.14);
          background: rgba(17,24,39,0.04);
          color: rgba(17,24,39,0.92);
          border-radius: 10px;
          width: 34px;
          height: 34px;
          cursor: pointer;
          font-size: 24px;
          line-height: 1;
        }

        #${modalId} [data-part="body"] {
          padding: 12px 14px 14px;
          display: flex;
          flex-direction: column;
          gap: 10px;
          font-size: 14px;
          line-height: 1.45;
        }

        #${modalId} a {
          color: rgba(2,132,199,0.95);
          text-decoration: none;
        }

        #${modalId} a:hover {
          text-decoration: underline;
        }

        #${modalId} code {
          font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace;
          font-size: 13px;
          background: rgba(17,24,39,0.06);
          padding: 2px 6px;
          border-radius: 8px;
          color: rgba(17,24,39,0.95);
        }

        #${modalId} kbd {
          font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace;
          font-size: 12px;
          background: rgba(17,24,39,0.08);
          border: 1px solid rgba(17,24,39,0.18);
          border-bottom-width: 2px;
          padding: 1px 6px;
          border-radius: 5px;
          color: rgba(17,24,39,0.9);
        }

        #${modalId} [data-part="find-css-card"] {
          border: 1px solid rgba(17,24,39,0.4);
          border-radius: 12px;
          overflow: hidden;
          position: relative;
        }
        #${modalId} [data-part="find-css-card-header"] {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 10px;
          padding: 10px 12px;
          border-bottom: 1px solid rgba(17,24,39,0.08);
          min-height: 40px;
        }
        #${modalId} [data-part="find-css-card-title"] {
          font-weight: 700;
          font-size: 17px;
        }
        #${modalId} [data-part="find-css-card-title"] [data-state="on"] {
          color: #16a34a;
        }
        #${modalId} [data-part="find-css-card-title"] [data-state="off"] {
          color: #dc2626;
        }
        #${modalId} [data-part="find-css-toggle-btn"] {
          appearance: none;
          border: none;
          background: #111;
          color: #fff;
          border-radius: 8px;
          padding: 6px 12px;
          font-weight: 650;
          cursor: pointer;
          white-space: nowrap;
        }
        #${modalId} [data-part="find-css-card-body"] {
          padding: 10px 12px 12px;
          font-size: 14px;
          line-height: 1.45;
        }
      `;
      document.head.appendChild(style);
      cleanupTasks.push(() => style.remove());
    }

    const button = document.createElement("button");
    button.type = "button";
    button.id = floatButtonId;
    const img = document.createElement("img");
    img.alt = TEXT.logoAlt;
    img.src = TEXT.logoUrl;
    button.appendChild(img);
    document.body.appendChild(button);
    cleanupTasks.push(() => button.remove());

    const backdrop = document.createElement("div");
    backdrop.id = modalBackdropId;
    backdrop.dataset.open = "0";
    document.body.appendChild(backdrop);
    cleanupTasks.push(() => backdrop.remove());

    const modal = document.createElement("div");
    modal.id = modalId;
    modal.dataset.open = "0";

    const header = document.createElement("div");
    header.setAttribute("data-part", "header");

    const brand = document.createElement("div");
    brand.setAttribute("data-part", "brand");

    const brandImg = document.createElement("img");
    brandImg.alt = TEXT.logoAlt;
    brandImg.src = TEXT.logoUrl;
    brand.appendChild(brandImg);

    const title = document.createElement("div");
    title.setAttribute("data-part", "title");
    title.textContent = TEXT.modalTitle;
    brand.appendChild(title);

    const headerRight = document.createElement("div");
    headerRight.setAttribute("data-part", "header-right");

    const closeBtn = document.createElement("button");
    closeBtn.type = "button";
    closeBtn.setAttribute("data-part", "close");
    closeBtn.setAttribute("aria-label", TEXT.modalCloseAriaLabel);
    closeBtn.textContent = TEXT.modalCloseSymbol;

    headerRight.appendChild(closeBtn);

    header.appendChild(brand);
    header.appendChild(headerRight);

    const body = document.createElement("div");
    body.setAttribute("data-part", "body");

    const findCssCard = document.createElement("div");
    findCssCard.setAttribute("data-part", "find-css-card");

    const cardHeader = document.createElement("div");
    cardHeader.setAttribute("data-part", "find-css-card-header");

    const cardTitle = document.createElement("div");
    cardTitle.setAttribute("data-part", "find-css-card-title");

    const inspectorToggleBtn = document.createElement("button");
    inspectorToggleBtn.type = "button";
    inspectorToggleBtn.setAttribute("data-part", "find-css-toggle-btn");

    const updateCardState = () => {
      const enabled = isInspectorEnabled();
      const stateText = enabled ? TEXT.findCssOn : TEXT.findCssOff;
      cardTitle.innerHTML = TEXT.findCssLabel + " <span data-state=\"" + (enabled ? "on" : "off") + "\">" + stateText + "</span>";
      inspectorToggleBtn.textContent = enabled ? TEXT.findCssTurnOff : TEXT.findCssTurnOn;
    };
    updateCardState();
    inspectorToggleBtn.addEventListener("click", () => {
      setInspectorEnabled(!isInspectorEnabled());
      syncInspectorWithDebugMode();
      updateCardState();
    });

    cardHeader.appendChild(cardTitle);
    cardHeader.appendChild(inspectorToggleBtn);
    findCssCard.appendChild(cardHeader);

    const cardBody = document.createElement("div");
    cardBody.setAttribute("data-part", "find-css-card-body");
    cardBody.innerHTML = TEXT.modalDescription;

    // Check for Shopify default slide menu drawer → recommend using it as CSS selector
    if (document.getElementById("Details-menu-drawer-container")) {
      const tip = document.createElement("div");
      tip.style.cssText = "margin-top:10px;padding:8px 10px;background:rgba(22,163,74,0.08);border:1px solid rgba(22,163,74,0.35);border-radius:8px;font-size:13px;line-height:1.5;";
      tip.innerHTML = "💡 Found <code>#Details-menu-drawer-container</code> — recommended for Slide Menu.";
      cardBody.appendChild(tip);
    }

    findCssCard.appendChild(cardBody);

    body.appendChild(findCssCard);

    const p3 = document.createElement("div");
    p3.appendChild(document.createTextNode(TEXT.enableLabel));
    const c1 = document.createElement("code");
    c1.textContent = TEXT.enableCode;
    p3.appendChild(c1);
    p3.appendChild(document.createTextNode(" | "));
    p3.appendChild(document.createTextNode(TEXT.disableLabel));
    const c2 = document.createElement("code");
    c2.textContent = TEXT.disableCode;
    p3.appendChild(c2);

    body.appendChild(p3);

    modal.appendChild(header);
    modal.appendChild(body);
    document.body.appendChild(modal);
    cleanupTasks.push(() => modal.remove());

    const closeModal = () => {
      backdrop.dataset.open = "0";
      modal.dataset.open = "0";
      safeSessionStorage.set(welcomeDismissedStorageKey, "1");
    };

    const openModal = (force = false) => {
      if (!force && safeSessionStorage.get(welcomeDismissedStorageKey) === "1") return;
      backdrop.dataset.open = "1";
      modal.dataset.open = "1";
    };

    button.addEventListener("click", () => openModal(true));
    closeBtn.addEventListener("click", closeModal);
    backdrop.addEventListener("click", closeModal);

    const onKeyDown = (e) => {
      if (e.key !== "Escape") return;
      if (modal.dataset.open !== "1") return;
      closeModal();
    };
    document.addEventListener("keydown", onKeyDown, { capture: true });
    cleanupTasks.push(() => document.removeEventListener("keydown", onKeyDown, { capture: true }));

    if (safeSessionStorage.get(welcomeDismissedStorageKey) !== "1") {
      openModal(false);
    }

    return { cleanup: removeAll, openModal: () => openModal(true) };
  };

  const createTurnedOffNotice = () => {
    const cleanupTasks = [];
    const removed = { value: false };

    const removeAll = () => {
      if (removed.value) return;
      removed.value = true;
      for (const task of cleanupTasks.splice(0)) task();
    };

    if (!document.getElementById(uiStyleId)) {
      const style = document.createElement("style");
      style.id = uiStyleId;
      style.textContent = `
        #${modalBackdropId} {
          position: fixed;
          inset: 0;
          background: rgba(0,0,0,0.25);
          z-index: 2147483646;
          display: none;
        }

        #${modalBackdropId}[data-open="1"] {
          display: block;
        }

        #${modalId} {
          position: fixed;
          left: 50%;
          top: 50%;
          transform: translate3d(-50%, -50%, 0);
          width: min(560px, calc(100vw - 24px));
          background: #ffffff;
          border: 1px solid rgba(17,24,39,0.4);
          border-radius: 16px;
          box-shadow: 0 24px 60px rgba(0,0,0,0.24);
          color: rgba(17,24,39,0.95);
          z-index: 2147483647;
          display: none;
          font-family: ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial;
        }

        #${modalId}[data-open="1"] {
          display: block;
        }

        #${modalId} [data-part="header"] {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 12px;
          padding: 12px 14px;
        }

        #${modalId} [data-part="brand"] {
          display: flex;
          align-items: center;
          gap: 10px;
          min-width: 0;
        }

        #${modalId} [data-part="brand"] img {
          width: 28px;
          height: 28px;
          border-radius: 4px;
          display: block;
        }

        #${modalId} [data-part="title"] {
          font-weight: 750;
          letter-spacing: 0.01em;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        #${modalId} [data-part="close"] {
          appearance: none;
          border: 0px;
          background: rgba(17,24,39,0.04);
          color: rgba(17,24,39,0.92);
          border-radius: 10px;
          width: 34px;
          height: 34px;
          cursor: pointer;
          font-size: 24px;
          line-height: 1;
        }

        #${modalId} [data-part="body"] {
          padding: 12px 14px 14px;
          display: flex;
          flex-direction: column;
          gap: 10px;
          font-size: 14px;
          line-height: 1.45;
        }

        #${modalId} [data-part="header-right"] {
          display: flex;
          align-items: center;
          gap: 10px;
          flex-shrink: 0;
        }

        #${modalId} [data-part="status"] {
          font-size: 12px;
          font-weight: 700;
          padding: 6px 10px;
          border-radius: 999px;
          border: 1px solid rgba(239,68,68,0.28);
          background: rgba(239,68,68,0.12);
          color: rgba(153,27,27,0.95);
          white-space: nowrap;
          display:none;
        }

        #${modalId} [data-part="off"] {
          appearance: none;
          border: 1px solid rgba(17,24,39,0.18);
          background: rgba(17,24,39,0.06);
          color: rgba(17,24,39,0.92);
          border-radius: 8px;
          padding: 4px 10px;
          font-weight: 650;
          cursor: pointer;
          white-space: nowrap;
        }

        #${modalId} code {
          font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace;
          font-size: 13px;
          background: rgba(17,24,39,0.06);
          padding: 2px 6px;
          border-radius: 8px;
          color: rgba(17,24,39,0.95);
        }
      `;
      document.head.appendChild(style);
      cleanupTasks.push(() => style.remove());
    }

    const backdrop = document.createElement("div");
    backdrop.id = modalBackdropId;
    backdrop.dataset.open = "0";
    document.body.appendChild(backdrop);
    cleanupTasks.push(() => backdrop.remove());

    const modal = document.createElement("div");
    modal.id = modalId;
    modal.dataset.open = "0";

    const header = document.createElement("div");
    header.setAttribute("data-part", "header");

    const brand = document.createElement("div");
    brand.setAttribute("data-part", "brand");

    const brandImg = document.createElement("img");
    brandImg.alt = TEXT.logoAlt;
    brandImg.src = TEXT.logoUrl;
    brand.appendChild(brandImg);

    const title = document.createElement("div");
    title.setAttribute("data-part", "title");
    title.textContent = TEXT.turnedOffTitle;
    brand.appendChild(title);

    const headerRight = document.createElement("div");
    headerRight.setAttribute("data-part", "header-right");

    const status = document.createElement("div");
    status.setAttribute("data-part", "status");
    status.textContent = TEXT.turnedOffStatusOff;

    const turnOnBtn = document.createElement("button");
    turnOnBtn.type = "button";
    turnOnBtn.setAttribute("data-part", "off");
    turnOnBtn.textContent = TEXT.turnedOffTurnOn;

    const closeBtn = document.createElement("button");
    closeBtn.type = "button";
    closeBtn.setAttribute("data-part", "close");
    closeBtn.setAttribute("aria-label", TEXT.modalCloseAriaLabel);
    closeBtn.textContent = TEXT.modalCloseSymbol;

    headerRight.appendChild(status);
    headerRight.appendChild(turnOnBtn);
    headerRight.appendChild(closeBtn);

    header.appendChild(brand);
    header.appendChild(headerRight);

    const body = document.createElement("div");
    body.setAttribute("data-part", "body");

    const msg = document.createElement("div");
    msg.textContent = TEXT.turnedOffMessage;

    const code = document.createElement("code");
    code.textContent = TEXT.enableCode;

    body.appendChild(msg);
    body.appendChild(code);

    modal.appendChild(header);
    modal.appendChild(body);
    document.body.appendChild(modal);
    cleanupTasks.push(() => modal.remove());

    const closeModal = () => {
      backdrop.dataset.open = "0";
      modal.dataset.open = "0";
    };

    const openModal = () => {
      backdrop.dataset.open = "1";
      modal.dataset.open = "1";
    };

    closeBtn.addEventListener("click", closeModal);
    backdrop.addEventListener("click", closeModal);

    turnOnBtn.addEventListener("click", () => {
      const nextUrl = `${window.location.origin}${window.location.pathname}${window.location.search}#navidebug-on`;
      window.location.href = nextUrl;
    });

    const onKeyDown = (e) => {
      if (e.key !== "Escape") return;
      if (modal.dataset.open !== "1") return;
      closeModal();
    };
    document.addEventListener("keydown", onKeyDown, { capture: true });
    cleanupTasks.push(() => document.removeEventListener("keydown", onKeyDown, { capture: true }));

    return { cleanup: removeAll, openModal };
  };

  const createInspector = () => {
    const cleanupTasks = [];
    const removed = { value: false };

    const removeAll = () => {
      if (removed.value) return;
      removed.value = true;
      for (const task of cleanupTasks.splice(0)) task();
    };

    const existingOverlay = document.getElementById(inspectorOverlayId);
    if (existingOverlay) {
      return { cleanup: () => {} };
    }

    const style = document.createElement("style");
    style.id = inspectorStyleId;
    style.textContent = `
      #${inspectorOverlayId} {
        position: fixed;
        inset: 0;
        pointer-events: none;
        z-index: 2147483647;
      }

      #${inspectorOverlayId} [data-part="box"] {
        /* Initial hidden state - will be overridden by inline styles */
        transform: translate3d(-99999px, -99999px, 0);
        width: 0;
        height: 0;
        display: none;
      }

      #${inspectorOverlayId} [data-part="label"] {
        position: fixed;
        transform: translate3d(-99999px, -99999px, 0);
        max-width: min(720px, calc(100vw - 16px));
        pointer-events: none;
        display: flex;
        flex-direction: column;
        gap: 6px;
        font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace;
        font-size: 12px;
        line-height: 1.4;
        padding: 8px 10px;
        border-radius: 8px;
        background: rgba(7, 10, 22, 0.98);
        border: 2px solid #00d4ff;
        color: rgba(255, 255, 255, 0.95);
        box-shadow: 0 0 0 2px rgba(0,0,0,0.8), 0 0 20px rgba(0, 212, 255, 0.5), 0 4px 12px rgba(0,0,0,0.4);
        backdrop-filter: blur(8px);
        -webkit-backdrop-filter: blur(8px);
        z-index: 2147483647;
      }

      #${inspectorOverlayId} [data-part="selector"] {
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }

      #${inspectorOverlayId} [data-part="actions"] {
        display: flex;
        justify-content: flex-end;
        gap: 8px;
      }

      #${inspectorOverlayId} [data-part="copy"] {
        pointer-events: none;
        cursor: default;
        user-select: text;
        appearance: none;
        border-radius: 6px;
        border: 1px solid rgba(0, 212, 255, 0.6);
        background: rgba(0, 212, 255, 0.1);
        color: rgba(255, 255, 255, 0.95);
        padding: 6px 10px;
        font-family: inherit;
        font-size: 11px;
        line-height: 1.35;
        text-align: right;
        white-space: normal;
        backdrop-filter: blur(4px);
        -webkit-backdrop-filter: blur(4px);
      }

      #${inspectorSnackbarId} {
        position: fixed;
        left: 50%;
        bottom: 16px;
        transform: translate3d(-50%, 16px, 0);
        opacity: 0;
        pointer-events: none;
        z-index: 2147483647;
        max-width: min(900px, calc(100vw - 24px));
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        font-family: ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial, "Apple Color Emoji", "Segoe UI Emoji";
        font-size: 13px;
        line-height: 1.3;
        padding: 10px 12px;
        border-radius: 12px;
        background: rgba(3, 7, 18, 0.92);
        border: 1px solid rgba(255, 255, 255, 0.14);
        color: rgba(255, 255, 255, 0.95);
        box-shadow: 0 10px 35px rgba(0,0,0,0.55);
        transition: opacity 120ms ease, transform 120ms ease;
      }

      #${inspectorSnackbarId}[data-show="1"] {
        opacity: 1;
        transform: translate3d(-50%, 0px, 0);
      }
    `;
    document.head.appendChild(style);
    cleanupTasks.push(() => style.remove());

    const overlay = document.createElement("div");
    overlay.id = inspectorOverlayId;

    const box = document.createElement("div");
    box.setAttribute("data-part", "box");

    const label = document.createElement("div");
    label.setAttribute("data-part", "label");

    const selectorText = document.createElement("div");
    selectorText.setAttribute("data-part", "selector");

    const actions = document.createElement("div");
    actions.setAttribute("data-part", "actions");

    const copyBtn = document.createElement("button");
    copyBtn.type = "button";
    copyBtn.setAttribute("data-part", "copy");
    copyBtn.textContent = isMac ? TEXT.inspectorCopyHintMac : TEXT.inspectorCopyHintWindows;

    actions.appendChild(copyBtn);
    label.appendChild(selectorText);
    label.appendChild(actions);
    overlay.appendChild(box);
    overlay.appendChild(label);
    document.body.appendChild(overlay);
    cleanupTasks.push(() => overlay.remove());

    const snackbar = document.createElement("div");
    snackbar.id = inspectorSnackbarId;
    document.body.appendChild(snackbar);
    cleanupTasks.push(() => snackbar.remove());

    const ignoredTags = new Set(["HTML", "BODY", "HEAD", "SCRIPT", "STYLE", "META", "LINK", "TITLE"]);

    const getContentSpecificity = (element) => {
      let score = 0;

      // Interactive elements get highest priority
      const tagName = element.tagName.toLowerCase();
      if (['a', 'button', 'input', 'select', 'textarea'].includes(tagName)) {
        score += 10;
      }

      // Elements with click handlers
      if (element.onclick || element.hasAttribute('onclick')) {
        score += 5;
      }

      // Elements with text content
      const textContent = element.textContent || '';
      if (textContent.trim().length > 0) {
        score += 3;
      }

      // Elements with meaningful attributes
      if (element.hasAttribute('href') || element.hasAttribute('src') ||
          element.hasAttribute('alt') || element.hasAttribute('title')) {
        score += 2;
      }

      // ARIA roles
      if (element.hasAttribute('role')) {
        score += 1;
      }

      return score;
    };

    const cssEscape =
      typeof CSS !== "undefined" && typeof CSS.escape === "function"
        ? CSS.escape.bind(CSS)
        : (value) => String(value).replace(/[^a-zA-Z0-9_-]/g, "\\$&");

    const isUnique = (selector, element) => {
      try {
        const found = document.querySelectorAll(selector);
        return found.length === 1 && found[0] === element;
      } catch {
        return false;
      }
    };

    const normalizeClasses = (className) => {
      if (!className || typeof className !== "string") return [];
      return className
        .split(/\s+/g)
        .map((c) => c.trim())
        .filter(Boolean)
        .filter((c) => c !== inspectorOverlayId);
    };

    const segmentFor = (element) => {
      const tag = element.tagName.toLowerCase();

      if (element.id) {
        const id = `#${cssEscape(element.id)}`;
        if (isUnique(id, element)) return { segment: id, canStop: true };
      }

      const classes = normalizeClasses(element.className)
        .slice(0, 3)
        .map((c) => `.${cssEscape(c)}`)
        .join("");

      let base = `${tag}${classes}`;
      if (base === tag && element.getAttribute("role")) {
        base += `[role="${cssEscape(element.getAttribute("role"))}"]`;
      }

      return { segment: base, canStop: false };
    };

    const nthOfTypeIfNeeded = (element, selector) => {
      try {
        const parent = element.parentElement;
        if (!parent) return selector;
        const matches = Array.from(parent.children).filter((c) => c.matches(selector));
        if (matches.length <= 1) return selector;
        const sameType = Array.from(parent.children).filter((c) => c.tagName === element.tagName);
        const index = sameType.indexOf(element) + 1;
        return `${selector}:nth-of-type(${index})`;
      } catch {
        return selector;
      }
    };

    const getSimplifiedSelector = (element) => {
      // For semantic elements, try to simplify by removing unnecessary classes/ids
      const semanticTags = ['BODY', 'HEADER', 'NAV', 'MAIN', 'FOOTER', 'SECTION', 'ARTICLE', 'ASIDE', 'FIGURE', 'FIGCAPTION'];
      const tagName = element.tagName;

      if (semanticTags.includes(tagName)) {
        const baseSelector = tagName.toLowerCase();

        // If base tag is unique, use it
        if (isUnique(baseSelector, element)) {
          return baseSelector;
        }

        // Try with classes if available
        if (element.className) {
          const classes = element.className.trim().split(/\s+/);
          for (const className of classes) {
            if (className) {
              const selectorWithClass = `${baseSelector}.${className}`;
              if (isUnique(selectorWithClass, element)) {
                return selectorWithClass;
              }
            }
          }
        }

        // Try with id if available
        if (element.id) {
          const selectorWithId = `${baseSelector}#${element.id}`;
          if (isUnique(selectorWithId, element)) {
            return selectorWithId;
          }
        }
      }

      // Fallback to full unique selector
      return getUniqueSelector(element);
    };

    const getUniqueSelector = (element) => {
      const segments = [];
      let current = element;

      for (let depth = 0; depth < 7 && current && current.nodeType === 1; depth += 1) {
        const { segment, canStop } = segmentFor(current);
        segments.unshift(segment);

        let candidate = segments.join(" > ");
        if (isUnique(candidate, element)) return candidate;

        const withNth = segments.slice();
        withNth[0] = nthOfTypeIfNeeded(current, withNth[0]);
        candidate = withNth.join(" > ");
        if (isUnique(candidate, element)) return candidate;

        if (canStop) return segments.join(" > ");

        current = current.parentElement;
      }

      return segments.join(" > ");
    };

    const state = {
      element: null,
      selector: "",
      lastClientX: null,
      lastClientY: null,
      rafId: 0,
      copyResetTimer: 0,
      pendingHideTimer: 0,
      locked: false,
      snackbarTimer: 0,
    };

    const hide = () => {
      box.style.cssText =
        `transform: translate3d(-99999px, -99999px, 0) !important; ` +
        `width: 0 !important; ` +
        `height: 0 !important; ` +
        `display: none !important; ` +
        `visibility: hidden !important;`;
      label.style.transform = "translate3d(-99999px, -99999px, 0)";
      selectorText.textContent = "";
      state.selector = "";
      state.locked = false;
    };

    const clearPendingHide = () => {
      if (!state.pendingHideTimer) return;
      window.clearTimeout(state.pendingHideTimer);
      state.pendingHideTimer = 0;
    };

    const scheduleHide = () => {
      if (state.locked) return;
      if (state.pendingHideTimer) return;
      state.pendingHideTimer = window.setTimeout(() => {
        state.pendingHideTimer = 0;
        hide();
        state.element = null;
      }, 400); // Increased timeout for better sensitivity
    };

    const showSnackbar = (selector) => {
      if (state.snackbarTimer) window.clearTimeout(state.snackbarTimer);
      snackbar.textContent = TEXT.inspectorCopiedSnackbar(selector);
      snackbar.dataset.show = "1";
      state.snackbarTimer = window.setTimeout(() => {
        snackbar.dataset.show = "0";
        state.snackbarTimer = 0;
      }, 1400);
    };

    const copyToClipboard = async (text) => {
      if (!text) return false;
      try {
        await navigator.clipboard.writeText(text);
        return true;
      } catch {}

      try {
        const textarea = document.createElement("textarea");
        textarea.value = text;
        textarea.setAttribute("readonly", "true");
        textarea.style.position = "fixed";
        textarea.style.top = "-1000px";
        textarea.style.left = "-1000px";
        document.body.appendChild(textarea);
        textarea.select();
        textarea.setSelectionRange(0, textarea.value.length);
        const ok = document.execCommand("copy");
        document.body.removeChild(textarea);
        return ok;
      } catch {
        return false;
      }
    };

    const isEditableTarget = (target) => {
      const el = target && target.nodeType === 1 ? target : null;
      if (!el) return false;
      if (el.isContentEditable) return true;
      const tag = el.tagName;
      return tag === "INPUT" || tag === "TEXTAREA" || tag === "SELECT";
    };

    const copySelectorForElement = async (element) => {
      if (!element) return;
      const selector = element === state.element ? state.selector : getSimplifiedSelector(element);
      const ok = await copyToClipboard(selector);
      if (ok) showSnackbar(selector);
    };

    const positionLabel = (rect) => {
      const padding = 8;
      const gap = 8;

      const labelRect = label.getBoundingClientRect();

      let left = rect.left;
      let top = rect.bottom + gap;

      if (top + labelRect.height > window.innerHeight - padding) {
        top = rect.top - gap - labelRect.height;
      }

      left = Math.max(padding, Math.min(left, window.innerWidth - padding - labelRect.width));
      top = Math.max(padding, Math.min(top, window.innerHeight - padding - labelRect.height));

      label.style.transform = `translate3d(${Math.round(left)}px, ${Math.round(top)}px, 0)`;
    };

    const buildElementStack = (element) => {
      const stack = [];
      let current = element;
      let depth = 0;

      // Build stack from child to root, stopping before <html> (up to 12 levels)
      while (current && current.tagName !== 'HTML' && depth < 12) {
        stack.unshift(current); // Add to beginning
        current = current.parentElement;
        depth++;
      }

      return stack;
    };

    const updateForElement = (element, isNavigation = false) => {
      if (!element) {
        if (state.locked) return;
        scheduleHide();
        return;
      }

      clearPendingHide();

      const rect = element.getBoundingClientRect();
      if (!Number.isFinite(rect.left) || !Number.isFinite(rect.top)) {
        scheduleHide();
        return;
      }

      // Allow very small elements to be highlighted (minimum 2x2 pixels for visibility)
      const displayWidth = Math.max(3, Math.round(rect.width)); // Minimum 3px for visibility
      const displayHeight = Math.max(3, Math.round(rect.height));

      // Build element stack if this is a new selection (not navigation)
      if (!isNavigation && element !== state.element) {
        currentElementStack = buildElementStack(element);
        currentStackIndex = currentElementStack.length - 1; // Start at deepest element
      }

      // Set styles directly on the element
      box.style.cssText =
        `position: fixed !important; ` +
        `border: 2px solid #00d4ff !important; ` +
        `outline: 1px solid #ffffff !important; ` +
        `outline-offset: -1px !important; ` +
        `background: rgba(0, 212, 255, 0.15) !important; ` +
        `box-shadow: 0 0 0 2px rgba(0,0,0,0.8), 0 0 20px rgba(0, 212, 255, 0.6) !important; ` +
        `border-radius: 6px !important; ` +
        `transform: translate3d(${Math.round(rect.left)}px, ${Math.round(rect.top)}px, 0) !important; ` +
        `width: ${displayWidth}px !important; ` +
        `height: ${displayHeight}px !important; ` +
        `min-width: 8px !important; ` +
        `min-height: 8px !important; ` +
        `box-sizing: border-box !important; ` +
        `display: block !important; ` +
        `visibility: visible !important; ` +
        `opacity: 1 !important; ` +
        `z-index: 2147483647 !important; ` +
        `pointer-events: none !important;`;
      label.style.transform = "translate3d(0, 0, 0)";

      if (element !== state.element) {
        // Use simplified selector for semantic elements, fallback to unique selector
        state.selector = getSimplifiedSelector(element);

        // Add navigation indicator if we have a stack
        let displaySelector = state.selector;
        if (currentElementStack.length > 1) {
          const level = currentStackIndex + 1;
          const total = currentElementStack.length;
          displaySelector = `[${level}/${total}] ${state.selector}`;
        }

        selectorText.textContent = displaySelector;
        state.element = element;
      }

      positionLabel(rect);
    };

    const navigateToParent = () => {
      if (currentElementStack.length === 0 || currentStackIndex <= 0) return;

      currentStackIndex--;
      const parentElement = currentElementStack[currentStackIndex];
      updateForElement(parentElement, true);
    };

    const navigateToChild = () => {
      if (currentElementStack.length === 0 || currentStackIndex >= currentElementStack.length - 1) return;

      currentStackIndex++;
      const childElement = currentElementStack[currentStackIndex];
      updateForElement(childElement, true);
    };

    const getElementFromPoint = (x, y) => {
      const stack =
        typeof document.elementsFromPoint === "function"
          ? document.elementsFromPoint(x, y)
          : [document.elementFromPoint(x, y)];

      // Filter out inspector elements and ignored tags
      const candidates = stack.filter(element => {
        if (!element) return false;
        if (element.closest && element.closest(`#${inspectorOverlayId}`)) return false;
        if (ignoredTags.has(element.tagName)) return false;
        return true;
      });

      if (candidates.length === 0) return null;

      // Test extensive points around cursor for maximum sensitivity on small elements
      const testPoints = [
        [x, y], // Center point
        // Adjacent points (1px radius)
        [x - 1, y], [x + 1, y], [x, y - 1], [x, y + 1],
        // Diagonals (1px radius)
        [x - 1, y - 1], [x + 1, y - 1], [x - 1, y + 1], [x + 1, y + 1],
        // 2px radius
        [x - 2, y], [x + 2, y], [x, y - 2], [x, y + 2],
        [x - 2, y - 1], [x - 1, y - 2], [x + 1, y - 2], [x + 2, y - 1],
        [x + 2, y + 1], [x + 1, y + 2], [x - 1, y + 2], [x - 2, y + 1],
        // 3px radius
        [x - 3, y], [x + 3, y], [x, y - 3], [x, y + 3],
        // 4px radius for maximum coverage
        [x - 4, y], [x + 4, y], [x, y - 4], [x, y + 4],
        // 5px radius for extreme sensitivity
        [x - 5, y], [x + 5, y], [x, y - 5], [x, y + 5],
        // Some strategic points at 3-4px diagonals
        [x - 3, y - 2], [x - 3, y + 2], [x + 3, y - 2], [x + 3, y + 2],
        [x - 2, y - 3], [x + 2, y - 3], [x - 2, y + 3], [x + 2, y + 3],
      ];

      const allCandidates = new Set();

      for (const [testX, testY] of testPoints) {
        const stack =
          typeof document.elementsFromPoint === "function"
            ? document.elementsFromPoint(testX, testY)
            : [document.elementFromPoint(testX, testY)];

        for (const element of stack) {
          if (!element) continue;
          if (element.closest && element.closest(`#${inspectorOverlayId}`)) continue;
          if (ignoredTags.has(element.tagName)) continue;

          const rect = element.getBoundingClientRect();
          const computedStyle = window.getComputedStyle(element);
          const opacity = parseFloat(computedStyle.opacity) || 1;

          // Accept extremely small elements with some visibility (minimum 0.1x0.1 pixel, opacity > 0.1)
          if (rect.width >= 0.1 && rect.height >= 0.1 &&
              opacity > 0.1 &&
              computedStyle.visibility !== 'hidden' &&
              computedStyle.display !== 'none') {
            allCandidates.add(element);
          }
        }
      }

      if (allCandidates.size === 0) return null;

      const allCandidatesArray = Array.from(allCandidates);

      // Sort by multiple criteria for better sensitivity
      allCandidatesArray.sort((a, b) => {
        const rectA = a.getBoundingClientRect();
        const rectB = b.getBoundingClientRect();
        const areaA = rectA.width * rectA.height;
        const areaB = rectB.width * rectB.height;

        // Calculate multiple distance metrics for better sensitivity
        const centerAX = rectA.left + rectA.width / 2;
        const centerAY = rectA.top + rectA.height / 2;
        const centerBX = rectB.left + rectB.width / 2;
        const centerBY = rectB.top + rectB.height / 2;

        // Distance from cursor to element center
        const centerDistanceA = Math.sqrt((centerAX - x) ** 2 + (centerAY - y) ** 2);
        const centerDistanceB = Math.sqrt((centerBX - x) ** 2 + (centerBY - y) ** 2);

        // Distance from cursor to nearest edge of element
        const edgeDistanceA = Math.max(
          0,
          Math.max(rectA.left - x, x - rectA.right, rectA.top - y, y - rectA.bottom)
        );
        const edgeDistanceB = Math.max(
          0,
          Math.max(rectB.left - x, x - rectB.right, rectB.top - y, y - rectB.bottom)
        );

        // Check if cursor is actually inside element bounds
        const cursorInA = x >= rectA.left && x <= rectA.right && y >= rectA.top && y <= rectA.bottom;
        const cursorInB = x >= rectB.left && x <= rectB.right && y >= rectB.top && y <= rectB.bottom;

        // Priority order:
        // 1. Elements containing cursor (highest priority)
        if (cursorInA && !cursorInB) return -1;
        if (!cursorInA && cursorInB) return 1;

        // 2. Proximity-based sorting (prefer elements where cursor is closer to center)
        const proximityScoreA = centerDistanceA; // Primary: center distance
        const proximityScoreB = centerDistanceB;

        // If distances are very different, prioritize closer elements
        if (Math.abs(proximityScoreA - proximityScoreB) > 3) {
          return proximityScoreA - proximityScoreB;
        }

        // 3. Smaller elements (more specific)
        if (areaA !== areaB) {
          return areaA - areaB;
        }

        // 4. Higher content specificity
        const contentScoreA = getContentSpecificity(a);
        const contentScoreB = getContentSpecificity(b);
        return contentScoreB - contentScoreA;
      });

      return allCandidatesArray[0];
    };

    const scheduleUpdateFromPoint = (x, y) => {
      state.lastClientX = x;
      state.lastClientY = y;
      if (state.rafId) {
        // Cancel previous RAF and schedule new one immediately for higher responsiveness
        window.cancelAnimationFrame(state.rafId);
      }
      state.rafId = window.requestAnimationFrame(() => {
        state.rafId = 0;
        const element = getElementFromPoint(state.lastClientX, state.lastClientY);
        if (element) {
          updateForElement(element);
        } else if (state.element) {
          // Keep current element if no new element found, but only if cursor is still inside it
          const rect = state.element.getBoundingClientRect();
          const stillInside = state.lastClientX >= rect.left && state.lastClientX <= rect.right &&
                             state.lastClientY >= rect.top && state.lastClientY <= rect.bottom;
          if (!stillInside) {
            updateForElement(null);
          }
        }
      });
    };

    const isPointInsideRect = (x, y, rect, margin = 0) => {
      const left = rect.left - margin;
      const top = rect.top - margin;
      const right = rect.right + margin;
      const bottom = rect.bottom + margin;
      return x >= left && x <= right && y >= top && y <= bottom;
    };

    const onMouseMove = (e) => {
      if (state.locked) {
        clearPendingHide();
        if (state.element) updateForElement(state.element);
        return;
      }

      // Always try to find element at current position for maximum sensitivity
      scheduleUpdateFromPoint(e.clientX, e.clientY);
    };

    window.addEventListener("mousemove", onMouseMove, { passive: true, capture: true });
    cleanupTasks.push(() => window.removeEventListener("mousemove", onMouseMove, { capture: true }));

    const onScroll = () => {
      if (!state.element) return;
      updateForElement(state.element);
    };
    window.addEventListener("scroll", onScroll, { passive: true, capture: true });
    cleanupTasks.push(() => window.removeEventListener("scroll", onScroll, { capture: true }));

    const onResize = () => {
      if (!state.element) return;
      updateForElement(state.element);
    };
    window.addEventListener("resize", onResize, { passive: true });
    cleanupTasks.push(() => window.removeEventListener("resize", onResize));

    const onMouseLeave = () => {
      clearPendingHide();
      hide();
      state.element = null;
    };
    document.addEventListener("mouseleave", onMouseLeave, { passive: true, capture: true });
    cleanupTasks.push(() => document.removeEventListener("mouseleave", onMouseLeave, { capture: true }));

    const onPointerDown = async (e) => {
      if (e.button !== 0) return;
      if (isEditableTarget(e.target)) return;

      const wantsCopy = isMac ? e.altKey : e.ctrlKey;
      if (!wantsCopy) return;

      e.preventDefault();
      e.stopPropagation();

      const element = getElementFromPoint(e.clientX, e.clientY) || state.element;
      if (!element) return;

      clearPendingHide();
      state.locked = true;
      updateForElement(element);
      await copySelectorForElement(element);
    };
    document.addEventListener("pointerdown", onPointerDown, { capture: true });
    cleanupTasks.push(() => document.removeEventListener("pointerdown", onPointerDown, { capture: true }));

    const onNavigationKeyDown = (e) => {
      if (isEditableTarget(e.target)) return;

      // Navigation keys for parent navigation
      if (e.key === 'Backspace' || e.key === 'ArrowUp' || e.key === 'ArrowLeft') {
        e.preventDefault();
        e.stopPropagation();
        navigateToParent();
      } else if (e.key === 'ArrowDown' || e.key === 'ArrowRight' || (e.shiftKey && e.key === 'Backspace')) {
        e.preventDefault();
        e.stopPropagation();
        navigateToChild();
      }
    };
    document.addEventListener("keydown", onNavigationKeyDown, { capture: true });
    cleanupTasks.push(() => document.removeEventListener("keydown", onNavigationKeyDown, { capture: true }));

    const simulateClickOnElement = (element) => {
      if (!element) return;
      // Dispatch click event
      element.dispatchEvent(new MouseEvent("click", { bubbles: true, cancelable: true }));
      // Also dispatch touch events to cover mobile-style handlers
      element.dispatchEvent(new TouchEvent("touchstart", { bubbles: true, cancelable: true }));
      element.dispatchEvent(new TouchEvent("touchend",   { bubbles: true, cancelable: true }));
      const selector = getSimplifiedSelector(element);
      showSnackbar(TEXT.inspectorSimulatedClickSnackbar(selector));
    };

    const onKeyDown = async (e) => {
      if (e.repeat) return;
      if (isEditableTarget(e.target)) return;

      const key = String(e.key || "").toLowerCase();
      const wantsModifier = isMac ? e.metaKey : e.ctrlKey;
      if (!wantsModifier) return;

      // ⌘+C / Ctrl+C → copy selector
      if (key === "c") {
        if (!state.element) return;
        e.preventDefault();
        e.stopPropagation();
        clearPendingHide();
        state.locked = true;
        updateForElement(state.element);
        await copySelectorForElement(state.element);
        return;
      }

      // ⌘+E / Ctrl+E → simulate click/touch on hovered element
      if (key === "e") {
        if (!state.element) return;
        e.preventDefault();
        e.stopPropagation();
        simulateClickOnElement(state.element);
        return;
      }
    };
    document.addEventListener("keydown", onKeyDown, { capture: true });
    cleanupTasks.push(() => document.removeEventListener("keydown", onKeyDown, { capture: true }));

    cleanupTasks.push(() => {
      if (state.rafId) window.cancelAnimationFrame(state.rafId);
      if (state.copyResetTimer) window.clearTimeout(state.copyResetTimer);
      if (state.pendingHideTimer) window.clearTimeout(state.pendingHideTimer);
      if (state.snackbarTimer) window.clearTimeout(state.snackbarTimer);
    });

    hide();

    return { cleanup: removeAll };
  };

  onReady(() => {
    const handleHash = () => {
      const { sawOn, sawOff } = applyDebugModeFromHash();

      if (sawOff) {
        disableInspector();
        disableDebugUI();
        disableTurnedOffNotice();
        turnedOffController = createTurnedOffNotice();
        turnedOffController.openModal();
        return;
      }

      disableTurnedOffNotice();

      syncInspectorWithDebugMode();
      syncDebugUIWithDebugMode();

      if (sawOn && debugUIController && typeof debugUIController.openModal === "function") {
        debugUIController.openModal();
      }
    };

    handleHash();
    window.addEventListener("hashchange", handleHash);
  });
})();



// Bước 1: Chờ #naviman_app rồi chạy initNaviplusApp()
// Nhiệm vụ: lấy script tags, chuẩn bị CSS, icons.. lấy shopinfo, chạy bước 2. Chú ý: shopinfo sẽ ko chạy cache để lấy ra version mới nhất
var initNaviplusApp = function (e) {

    /** 1.Get variables **************************************/

    /********************************************/
    // Lấy attribute từ uigenJs script (đã đc failover từ currentScript)
    /********************************************/
    var shop = navihelper.Env.getAttribute('shop', '');
    var token = navihelper.Env.getAttribute('token', '');
    var embed_id = navihelper.Env.getAttribute('embed_id', '');
    var multisite = navihelper.Env.getAttribute('multisite', '');
    var deploy_env = navihelper.Env.getAttribute('env', '');

    // WordPress SSO: reconstruct shop từ token để đảm bảo đúng case
    // Không dùng getAttribute('shop') vì có thể đã bị lowercase trước đó
    if (WpMarket.isActive(deploy_env)) {
        shop = WpMarket.buildShop(token);
        console.log('[Navi+ WP] uigen: shop reconstructed →', shop);
        console.log('[Navi+ WP] uigen: standardizeDomain →', navihelper.standardizeDomain(shop, token));
        console.log('[Navi+ WP] uigen: info.json →', naviplusCDNJson + '/' + navihelper.standardizeDomain(shop, token) + '.info.json');
    } else if( deploy_env != "shopify" ) {
        shop = navistart.normalizeDomainSync(shop);
    }
    /********************************************/


    var section_setting = [];
    section_setting['shop'] = shop;
    section_setting['token'] = token;
    section_setting['embed_id'] = '';
    section_setting['not_sticky'] = false;
    section_setting['embed_title'] = '';
    section_setting['embed_is_full'] = false;
    section_setting['embed_margin'] = "0 0 0 0";
    section_setting['multisite'] = multisite;
    section_setting['env'] = deploy_env;

    // console.log("section_setting['shop']: ", section_setting['shop']);

    // Fail over menu nếu embed_id không hợp lệ: Đôi khi khách hàng sẽ điền linh tinh vào embed_id khi đó cần bỏ qua menu này 
    if (embed_id.trim() !== "" && !/^SF-\d+$/.test(embed_id.trim())) {
        embed_id = "";
        console.error("Invalid Embed ID, skipping menu");
    }    


    if(embed_id != '') {
        
        /********************************************/
        // Lấy attribute từ uigenJs script (đã đc failover từ currentScript)
        /********************************************/
        var not_sticky = navihelper.Env.parseBoolean(navihelper.Env.getAttribute('not_sticky', deploy_env != "shopify")); // Nếu ngoài shopify thì mặc định not_sticky = false (ko sticky)
        
        var embed_title =  navihelper.Env.getAttribute('embed_title', "");
        var embed_is_full = navihelper.Env.parseBoolean(navihelper.Env.getAttribute('embed_is_full', false));
        var embed_margin = navihelper.Env.getAttribute('embed_margin', "0 0 0 0");

        /********************************************/        
        section_setting['embed_id'] = embed_id.trim();
        section_setting['token'] = token;
        section_setting['not_sticky'] = not_sticky;
        section_setting['embed_title'] = embed_title.trim();
        section_setting['embed_is_full'] = embed_is_full;
        section_setting['embed_margin'] = embed_margin;
    }

    /** 2. Load CSS, Icons & fonts. Thường bị bỏ qua do start.js đã làm ***************/
    navihelper.linkCSSToHead( "https://cdn.jsdelivr.net/npm/animate.css@4.1.1/animate.min.css" );
    navihelper.linkCSSToHead( "https://cdn.jsdelivr.net/npm/remixicon@4.8.0/fonts/remixicon.css" );        
    navihelper.linkCSSToHead( naviplusCss );


    /*****************
     Mỗi khi gặp đoạn mã này thì sẽ chạy một lần runNavimanFunc. Data có thể là một danh sách hoặc 1 item
     - Nếu all: Chạy for cho nhiều item.
     - Nếu section:
        1. Nếu sticky thì chạy bình thường (for vô nghĩa)
        2. Nếu ko sticky thì bổ sung mã CSS (for vô nghĩa)
     ***************/
    function runNavimanFunc( data, shopinfo ) {
        naviman.init();

        navihelper.reportSteps("===STEP 3=============================================================");
        navihelper.reportSteps("runNavimanFunc() sử dụng thư viện uigen_func | Kiểm tra xem có cart count không, gọi drawBottomNav + sửa active items");

        if( navihelper.isNeedCartCount(data, section_setting) ) {

            window.addEventListener('SCE:mutate', (event) => {
                naviman.checkAndUpdateCartCount();
            });
            // Ưu tiên NaviEnv.cartItem (Liquid) để drawBottomNav và callbackPublicFunc_delay(drawBottomNav) vẽ đúng ngay
            var initialCartCount = (window.NaviEnv && typeof window.NaviEnv.cartItem !== 'undefined') ? window.NaviEnv.cartItem : 0;
            naviman.setCartCount( initialCartCount );
            naviman.drawBottomNav(data, naviplusAppUrl, shop, embed_id, section_setting);
            naviman.generateActiveItems();
            naviman.updateCartCount( initialCartCount );

            // Chỉ fetch khi chưa có NaviEnv (theme không set) hoặc cart rỗng
            if (initialCartCount === 0) {
                naviman.asyncGetCart().then(function(result) {
                    naviman.updateCartCount( result.item_count );
                });
            }

        }else {
            // navidebug.log("kaka");
            naviman.drawBottomNav(data, naviplusAppUrl, shop, embed_id, section_setting);
            naviman.generateActiveItems();
        }
    }

    async function getJSONData(shopinfo, token) {

        navihelper.reportSteps("===STEP 2=============================================================");
        navihelper.reportSteps("getJSONData() chờ shopinfo | Tải json về, parse dữ liệu chuẩn bị chuyển sang vẽ menu");    

        // Bước 1: Tạo URL JSON (all.json hoặc {embed_id}.json) + version
        var api_url = naviplusCDNJson + "/" + navihelper.standardizeDomain(shop, token) + ".all.json";
        
        if (embed_id != '')
            api_url = naviplusCDNJson + "/" + navihelper.standardizeDomain(shop, token) + "." + embed_id + ".json";
        api_url += "?v=" + shopinfo["update_version"];        

        navihelper.reportSteps("DATA JSON URL: " + api_url);

        // Bước 2: Thử lấy từ IndexDB trước để tránh fetch lại
        var cachedJson = await window.naviindexdb.get(api_url);
        if (cachedJson) {
            navihelper.reportSteps("---> HAHA! Lấy JSON data từ IndexDB cho URL: " + api_url);
            runNavimanFunc(cachedJson, shopinfo);
            return;
        }

        // Bước 3: Không có cache → fetch từ CDN chính
        try {
            var json;
            try {
                var response = await fetch(api_url);
                if (!response.ok) throw new Error("HTTP error");
                navihelper.reportSteps("---> WTF! Lấy JSON data từ CDN cho URL: " + api_url);
                json = await response.json();
            } catch {
                // Bước 4: Fallback sang FLOV nếu CDN chính lỗi
                const flovUrl = "https://flov.b-cdn.net/data/json/" + api_url.split("/").pop();
                console.warn("JSON failover → FLOV", flovUrl);
                var r = await fetch(flovUrl);
                if (!r.ok) throw new Error("HTTP error");
                json = await r.json();
            }
            // Bước 5: Lưu vào IndexDB để lần sau khỏi fetch
            await window.naviindexdb.set(api_url, json);

            // Bước 6: Chạy app
            runNavimanFunc(json, shopinfo);
        } catch (error) {
            console.error("Error loading Json data (primary & fallback):", error);
        }

    }
    
    navihelper.getShopInfo(shop, section_setting['token']).then(async (shopinfo) => {
        await getJSONData(shopinfo, token);
    });

}; // End of initNaviplusApp function

navihelper.waitForElementReady('#naviman_app', () => {  
    navihelper.reportSteps("===STEP 1=============================================================");
    navihelper.reportSteps("initNaviplusApp() chờ #naviman_app | Lấy script tags, chuẩn bị CSS, icons.. lấy shopinfo (ko cache )");
    initNaviplusApp();
});


