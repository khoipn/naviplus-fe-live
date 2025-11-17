var naviman_version = "no-version";
if (typeof window.debugTimeStart === 'undefined') {
    window.debugTimeStart = performance.now();
}



/** KIỂM TRA XEM NẾU NHƯ ĐƯỜNG DẪN DẠNG
 * https://cdn.jsdelivr.net/gh/khoipn/naviplus-fe-live@main/live-115/uigen.min.js
 * THÌ LẤY PHIÊN BẢN THEO CÁI NÀY **/
// var scriptUrl = "https://cdn.jsdelivr.net/gh/khoipn/naviplus-fe-live@main/live-115/uigen.min.js";
// var versionMatch = scriptUrl.match(/\/([^\/]+)\/uigen\.min\.js$/);
// if (versionMatch) {
//     naviman_version = versionMatch[1];
//     console.log(naviman_version);
// }


var scriptUrl = document.currentScript.src;
var versionMatch = scriptUrl.match(/\/([^\/]+)\/uigen\.min\.js$/);
if (versionMatch) {
    naviman_version = versionMatch[1];
    // console.log(naviman_version);
} else {
    // console.log("No version found in the URL");
}

/**********************************************************************************/

/* Fix shopifas today: 24/7 */
var naviplusAppUrl = 'https://dash.naviplus.app/naviplus/frontend/';
var naviplusCss = 'https://cdn.jsdelivr.net/gh/khoipn/naviplus-fe-live@main/'+ naviman_version +'/uigen.min.css';
var UIGEN_ENV = "DEPLOYMENT";

// TODO: DEPLOY - Cấu hình đúng với đường dẫn trên server


if (scriptUrl && scriptUrl.indexOf('uigen.js.php') !== -1) {
    
}

var naviplusCDNJson = "https://cdn.naviplus.app/naviplus/data/json";
var naviplusCDNFiles = "https://cdn.naviplus.app/naviplus/data/";
var naviplusCacheMiniseconds = 3600000; // 10 minutes

// Kiểm tra và định nghĩa namespace navihelper nếu chưa tồn tại
if (typeof navihelper === 'undefined') {
    navihelper = {};
}

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
}

// Kiểm tra và khởi tạo biến windowVar trong namespace navihelper nếu chưa tồn tại
if (typeof navihelper.windowVar === 'undefined') {
    navihelper.windowVar = navihelper.WindowVar.getInstance();
}
/**********************************************************************************************************************
 Functions.
 **********************************************************************************************************************/
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


var openDebugMode = function() {
    localStorage.setItem('debugMode', 'true');
    console.log('%cDebug Mode: ON', 'color: green; font-weight: bold;');
};

var closeDebugMode = function() {
    localStorage.removeItem('debugMode');
    console.log('%cDebug Mode: OFF', 'color: red; font-weight: bold;');
};

var isDebugMode = function() {
    return localStorage.getItem('debugMode') === 'true';
};

var debugModeLog = function(...args) {
    if (isDebugMode()) {
        if (args.length === 1) {
            console.log(args[0]); // Trường hợp chỉ có message
        } else {
            console.log(args[0], args[1]); // Trường hợp có style + message
        }
    } else {
        //console.warn('Debug mode is OFF. Log suppressed.');
    }
};

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
        console.log( object );
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
    if( itemExtIconSize != '' )
        styleImageHeight += ' style="height:'+ itemExtIconSize +'px ';

    if(parseInt(itemExtIconSize) != DEFAULT_ICON_IMAGE_SIZE )
        styleImageHeight += '; width:auto; ';
    if( styleImageHeight != '' )
        styleImageHeight += '"';


    if (!isHadImage) {
        var output = '<span class="icon" style="'+ iconStyle +'" >' + '<i class="' + icon + '" '+ style +'></i>' + '</span>';
        if(seoUrl != "") output = seoUrl + output + '</a>';
        return output;
    } else {
        var imageUrl = image;
        if( !Helper.HTML.isExternalUrl(image) )
            imageUrl = naviplusCDNFiles + image;

        var output = '<div class="image-border" ' + itemExtAlign + ' ><span class="image-box" ' + style + '><span class="image">' + '<img title="' + seoName + '" alt="' + seoName + '" ' + styleImageHeight + ' src="' + imageUrl + '">' + '</span></span></div>';
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
    var menuClass = '';

    if( menuKind == NAVIGLOBAL['MENU_KINDS']['CONTEXT_SLIDE'] ) {
        var isOnMobile = (window.innerWidth <= 768);
        if( !isOnMobile ) {
            if (data["setting"]["hamburgerSubDirection"] == 2) {
                menuClass += " hamburger-desktop-sub-leftright ";
            }else 
                menuClass += " hamburger-desktop-sub-topdown ";
        }
        
    }
    return menuClass;
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

var updateLayoutBySlideFixed = function( embed_id, data ) {

    let el = null;
    const checkEl = setInterval(() => {
        el = document.getElementById(embed_id);
        if (el) {
            clearInterval(checkEl);

            var isOnMobile = window.innerWidth <= 768;
            var slideWidth = el.getBoundingClientRect().width;
            el.style.boxShadow = 'inset 4px 0px 12px rgba(0, 0, 0, 0.2)';

            var isDisplay = false;
            if( !isOnMobile ) {
                if (isHadValue(data["setting"]['slideFixDesktop'])) 
                    if (data["setting"]['slideFixDesktop']) 
                    {  
                        slideWidth = 480;
                        if (isHadValue(data["setting"]['slideFixDesktopWidth']))
                            slideWidth = data["setting"]['slideFixDesktopWidth'];
                        isDisplay = true;
                    }                
            }

            if( isOnMobile ) {
                if (isHadValue(data["setting"]['slideFixMobile'])) 
                    if (data["setting"]['slideFixMobile'])
                    {  
                        slideWidth = 80;
                        if (isHadValue(data["setting"]['slideFixMobileWidth']))
                            slideWidth = data["setting"]['slideFixMobileWidth'];
                        isDisplay = true;
                    }                
            }    

            if( isDisplay ) {
                el.style.setProperty('visibility', 'visible', 'important');
                el.style.setProperty('width', slideWidth + "px", 'important');
                el.style.setProperty('max-width', slideWidth + "px", 'important');
                document.body.style.setProperty("padding-left", slideWidth + "px", "");


                // Ẩn nút close đi
                el.querySelectorAll('.hamburger_close').forEach(e => {
                    e.style.setProperty('display', "none", 'important');;
                });

                // Xử lý việc đổi từ mobile -> desktop và ngược lại thì sẽ bỏ padding đi để ko bị responsive quá xấu xí
                detectDeviceModeChange(function(isMobile) {
                    document.body.style.setProperty("padding-left", "initial", "");
                });

                // Xử lý việc menu expand ra ngoài
                Helper.HTML.addLoadedFSAtBodyEnd('<style>#'+ embed_id +'.hamburger-desktop-sub-leftright ul li.item > ul.children {left: '+ slideWidth +'px; } </style>', 20);
            }
        }
    }, 100); // kiểm tra mỗi 100ms    
}

var menuSlidePositionClass = function ( data, menuKind, embed_id ) {
    var menuSlidePosition = '';
    var hamburgerPosition = 1;
    if( data["setting"]["hamburgerPosition"] != null ) 
        hamburgerPosition = parseInt(data["setting"]["hamburgerPosition"]);

    if( menuKind == NAVIGLOBAL['MENU_KINDS']['CONTEXT_SLIDE'] ) {
        var isOnMobile = (window.innerWidth <= 768);

        if( isOnMobile ) {
            if( hamburgerPosition == 1 )
                menuSlidePosition += " hamburger-left-right";
            else if( hamburgerPosition == 2 )
                menuSlidePosition += " hamburger-right-left ";
            else if( hamburgerPosition == 3 )
                menuSlidePosition += " hamburger-top-down ";
            else if( hamburgerPosition == 4 )
                menuSlidePosition += " hamburger-down-top ";
            else if( hamburgerPosition == 5 )
                menuSlidePosition += " hamburger-fullscreen ";
            else if( hamburgerPosition == 6 )
                menuSlidePosition += " hamburger-full-popup ";            
        }else // Desktop
        {
            if( hamburgerPosition == 2 )
                menuSlidePosition += " hamburger-right-left";
            else
                menuSlidePosition += " hamburger-left-right ";
        }
        if( hamburgerPosition == 7 ) {
            menuSlidePosition += " hamburger-full-fixed ";

            if (isHadValue(data["setting"]['slideFixDesktop'])) 
                    if (data["setting"]['slideFixDesktop'])            
                        menuSlidePosition += " hamburger-desktop-fullfixed ";
            if (isHadValue(data["setting"]['slideFixMobile'])) 
                    if (data["setting"]['slideFixMobile'])            
                        menuSlidePosition += " hamburger-mobile-fullfixed ";

            updateLayoutBySlideFixed( embed_id, data );
        }        

        return menuSlidePosition;
    }

    return "";
}

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

function removeAllEventListeners(element) {
    const newElement = element.cloneNode(true); // Tạo bản sao
    element.parentNode.replaceChild(newElement, element); // Thay thế phần tử gốc bằng bản sao
    return newElement; // Trả về phần tử mới
}

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

/** uigen/libs.js END ****************************************/    var Helper = Helper || {};  
Helper.HTML = Helper.HTML || {};  
Helper.String = Helper.String || {};  
Helper.Debug = Helper.Debug || {};  
Helper.Env = Helper.Env || {}; 
Helper.MultiSite = Helper.MultiSite || {}; 
Helper.CLS = Helper.CLS || {};
Helper.Color = Helper.Color || {};

Helper.Color.hexToRgb = function(hex, alpha = "") {
    // --- Chuẩn hoá chuỗi ---
    hex = (hex || "").replace(/^#/, "").trim();
    alpha = (alpha === null || alpha === undefined) ? "" : String(alpha).trim();

    // --- Kiểm tra hex hợp lệ (3 hoặc 6 ký tự) ---
    if (!/^([0-9A-Fa-f]{3}|[0-9A-Fa-f]{6})$/.test(hex)) {
        console.warn("Invalid HEX color:", hex);
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
    debugModeLog("%c" + message, "color: " + color + "; font-size: 11px");
};

Helper.Debug.writeLineConsoleLog = function (color) {
    console.log("%c____________________________________", "color: " + color + "; font-size: 11px");
};

Helper.Debug.welcomeScreen = function() {
    if (typeof naviman === 'undefined') {
        if (!window.isWelcomeLogged) {
            if( naviman_version != "simulator" )
            console.log(
                "%c\uD83D\uDC96 Using Navi+ (Ver "+ naviman_version +"), a Shopify Menu Builder application to create advanced menus: Tab Bar, Mega Menu, Hamburger Menu, Grid Menu, and more... %cDetail here: https://apps.shopify.com/pronavi-navigation-design", 
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
    debugModeLog(statusLine);

    // Lưu trạng thái vào window để tránh gọi lại
    window._browserSupportChecked = true;
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

    document.querySelectorAll('.naviman_app ul.children').forEach((item) => {
        item.style.display = "none";
    });
    document.querySelectorAll('.naviman_app span.arrow').forEach((item) => {
        item.style.display = "none";
    });

    // Chỗ này không chạy gì cả, tệ quá
    document.querySelectorAll('.naviItem .menu-expand').forEach((item) => {
        // Remove menu-expand of item
        item.classList.remove('menu-expand');
    });

    document.querySelectorAll('.naviman_app ul.children').forEach((item) => {
        item.style.height = "initial";
    });

    document.querySelectorAll('.naviman_app li.overlay-container').forEach((item) => {
        item.remove();
    });

    Helper.hideNaviOverlay();

}

Helper.lockBodyScroll = function(isLock) {
  Helper_lockBodyScroll(isLock);
};

Helper.showNaviOverlayGlobal = function () {    
    if( document.getElementsByClassName("naviman_app_overlay_global") == null )
        return;
    if( document.getElementsByClassName("naviman_app_overlay_global").length == 0 )
        return;
    document.getElementsByClassName("naviman_app_overlay_global")[0].style.display = 'block';
    Helper.lockBodyScroll( true );
}

Helper.hideNaviOverlayGlobal = function () {
    if( document.getElementsByClassName("naviman_app_overlay_global") == null )
        return;
    if( document.getElementsByClassName("naviman_app_overlay_global").length == 0 )
        return;
    document.getElementsByClassName("naviman_app_overlay_global")[0].style.display = 'none';
    Helper.lockBodyScroll( false );
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
            console.log(`⏱️ Timeout after ${MAX_WAITING_SECONDS}s: ${cssVarName} not loaded, executing callback anyway.`);
            callback(); // Nhắm mắt gọi callback luôn
        } else if (retryCount < maxRetry) {
            retryCount++;
            setTimeout(check, delay);
        } else {
            console.warn(`⏱️ Timeout: ${cssVarName} not loaded after ${maxRetry} retries.`);
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

    console.log(
        "%cNAVI+ MULTI-SITES" +
        "\n➤ Current domain:     " + currentDomain +
        "\n➤ Non-Shopify site:   " + section_setting['multisite'] + 
        "\n➤ Shopify sites:      " + setting['multiSites'],
        boxStyle
    );
};


Helper.MultiSite.isMultiSitesHide = function (setting, section_setting) {
    var isHideByMultiSites = false;
    
    if (Helper.Env.isBackendMode())
        return false;

    if (isHadValue(setting['multiSites'])) {

        if( section_setting['multisite'] == "" )
        if( !window.Shopify )   {
            console.log("❌ Multi-sites result: Not define multisite in embed code to Non-Shopify");
            isHideByMultiSites = true;            
        }
            
        console.log("Ha: ", setting['multiSites']);
        if( Helper.MultiSite.checkDomainMatch(setting['multiSites']) ) {
            console.log("   Multi-sites result: Match");    
            // Cần kiểm tra xem match nhưng lại dùng nhiều Shopify thì lỗ vốn.
            if( window.Shopify ) {
                if( window.Shopify["shop"] != section_setting["shop"] ) {
                    isHideByMultiSites = true;
                    console.log("❌ Multi-sites result: Use 2 Shopify websites");
                }
            }                      

        }else {
            if( section_setting['multisite'] == "" ) {
                console.log("   Multi-sites: Not match | But use the root Shopify site");    
            }else {
                // Có cấu hình multiSites trong backend và có cấu hình cả multisite trong mã nhúng.                 
                console.log( "❌ Multi-sites result: Not match: Section on Non-Shopify: " + section_setting['multisite'] + " is not in Shopify sites: " +  setting['multiSites'] );
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
    console.warn("⚠️ deployReplaceInsertMode: el_item hoặc newElement không hợp lệ");
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
      console.warn(`⚠️ Unknown mode: ${publishToPlaceKind}`);
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
        console.log(`✅ Found Replace/Insert element after ${waited} ms`);

        Helper.deployReplaceInsertMode(mode, target, newElement);                                         

        resolve({ target, waited }); // Trả về cho await dùng
      } else {
        const waited = Date.now() - start;
        if (waited > timeout) {
            clearInterval(timer);
            const msg = `⏱️ Timeout (${timeout} ms): element not found -> ${el}`;
            console.warn(msg);
            reject(new Error(msg));
        }
      }
    }, interval);
  });
};




/********************************************************************************************************************/







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
        // console.log('----- FixGoogleApp apply called -----');
        if (!this.isGoogleApp) {
            // console.log('Not in Google App → skip');
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
  setTimeout(() => {
    
    gtag("set", { debug_mode: window.isGADebugMode });
    gtag("js", new Date());
    if( window.isGADebugMode ) 
      gtag("config", "G-ST5B8SVH5B", { 'debug_mode':true });
    else 
      gtag("config", "G-ST5B8SVH5B");
  }, 200);

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

    // Đảm bảo gtag đã sẵn sàng
    if (typeof gtag === 'function') {
      gtag("event", action, eventParams);
      console.log("NAVI+ GA EVENT:", action, eventParams);
    } else {
      // Nếu chưa sẵn sàng, đợi một chút rồi thử lại
      setTimeout(() => {
        if (typeof gtag === 'function') {
          if( isGADebugMode ) 
            gtag("event", action, eventParams, { 'debug_mode':true });
          else
            gtag("event", action, eventParams);

          console.log("NAVI+ GA EVENT (retry):", action, eventParams);
        } else {
          console.warn("GA not ready, event not sent:", action, eventParams);
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
            debugModeLog( naviItem["embed_id"] + " is hide because DONOT contain keyword: " + naviItem["data"]["setting"]['publishContainKeyword']);
    }
    
    if (isHadValue(naviItem["data"]["setting"]['publishDontContainKeyword'])) {
        isDisplayed = !Helper.String.isUrlContain(naviItem["data"]["setting"]['publishDontContainKeyword']);
        if( isDisplayed == false )
            debugModeLog( naviItem["embed_id"] + " is hide because contain keyword: " + naviItem["data"]["setting"]['publishDontContainKeyword']);
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
        debugModeLog( naviItem["embed_id"] + " is hide. The cause is did not active for this platform (mobile/desktop) " );

    return isDisplayed;
}

Menu.Common.initHTMLAppOverlayClasses = function() {
    if( document.getElementsByClassName("naviman_app_overlay").length == 0 )
        naviman_app.insertAdjacentHTML('afterbegin', '<div class="naviman_app_overlay"> </div>');
    if( document.getElementsByClassName("naviman_app_overlay_global").length == 0 )
        //document.body.insertAdjacentHTML('afterend', '<div class="naviman_app_overlay_global"> </div>');
    document.body.insertAdjacentHTML('afterbegin', '<div class="naviman_app_overlay_global"></div>');

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
    console.log("ERROR: isMenuKind not working ********\/\/\/");
    return false;
};


window.menuZIndexMapNaviSticky = window.menuZIndexMapNaviSticky || {};
window.menuZindexNaviSections = window.menuZindexNaviSections || {};

Menu.Common.setTopZindex = function (menuItem, menuKind, embed_id) {

    if( Menu.Common.isMenuKind(menuKind, 'CONTEXT') )
        return;

    if( Menu.Common.isMenuKind(menuKind, 'STICKY') ) {
        var menu = document.getElementById(embed_id);
        if (menu) {
            // Lưu z-index hiện tại nếu chưa lưu
            if (!window.menuZIndexMapNaviSticky[embed_id]) {
                var computedZIndex = window.getComputedStyle(menu).zIndex;
                window.menuZIndexMapNaviSticky[embed_id] = computedZIndex !== "auto" ? computedZIndex : "2";
            }
            // Tăng lên mức cao nhất
            menu.style.zIndex = "2147483647";

            
            //.naviman_app_overlay chỉ áp dụng với ticky menu thôi, section thì ko
            
                var overlay = document.querySelector('.naviman_app_overlay');
                if (overlay) {
                    var overlayZIndex = window.getComputedStyle(overlay).zIndex;            
                    window.menuZIndexMapNaviSticky["naviman_app_overlay"] = overlayZIndex !== "auto" ? computedZIndex : "2";
                    overlay.style.zIndex = "2147483646";
                }        
        }
    }

    // Với section thì cách làm khác hẳn: Lấy toàn bộ các section bọc ngoài của navi Menu, setup the z-index về 0, rồi thì khôi phục lại sau
    if (Menu.Common.isMenuKind(menuKind, 'SECTION')) {
        document.querySelectorAll('section').forEach(section => {
            // Bỏ qua section chứa div có id = embed_id
            if (section.querySelector('.naviItem') && !section.querySelector(`#${embed_id}`)) {
                var computedPosition = window.getComputedStyle(section).position;
                if (computedPosition === "relative") {
                    var computedZIndex = window.getComputedStyle(section).zIndex;
                    window.menuZindexNaviSections[section.id] = computedZIndex !== "auto" ? computedZIndex : "0";
                    section.style.zIndex = "0";
                }
            }
        });
    }
}

Menu.Common.removeTopZindex = function (menuItem, menuKind, embed_id) {

    if( Menu.Common.isMenuKind(menuKind, 'CONTEXT') )
        return;    

    if( Menu.Common.isMenuKind(menuKind, 'STICKY') ) {
        var menu = document.getElementById(embed_id);
        if (menu && window.menuZIndexMapNaviSticky[embed_id] !== undefined) {
            // Khôi phục z-index ban đầu
            menu.style.zIndex = window.menuZIndexMapNaviSticky[embed_id];
            delete window.menuZIndexMapNaviSticky[embed_id]; // Xóa khỏi bộ nhớ tạm

            //.naviman_app_overlay chỉ áp dụng với ticky menu thôi, section thì ko            
                var overlay = document.querySelector('.naviman_app_overlay');
                if (overlay && window.menuZIndexMapNaviSticky["naviman_app_overlay"] !== undefined) {
                    overlay.style.zIndex = window.menuZIndexMapNaviSticky["naviman_app_overlay"];
                }
            
        }
    }

    // Với section thì cách làm khác hẳn: Lấy toàn bộ các section bọc ngoài của navi Menu, setup the z-index về 0, rồi thì khôi phục lại sau
    if (Menu.Common.isMenuKind(menuKind, 'SECTION')) {
        Object.keys(window.menuZindexNaviSections).forEach(sectionId => {
            var section = document.getElementById(sectionId);
            if (section) {
                section.style.zIndex = window.menuZindexNaviSections[sectionId];
            }
        });
        window.menuZindexNaviSections = {}; // Xóa bộ nhớ tạm
    }

    
};

Menu.Common.displayNaviItem_Container =  function( menuKindClass, embed_id, isMultiSite = false ) {
    if(!isMultiSite)
    if (menuKindClass == "CONTEXT_SLIDE")
        return;

    const embedEl = document.getElementById(embed_id);
    embedEl?.closest('.naviItem_Container')?.style.setProperty('display', '');
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

      if (!displayGlobalPages.includes(currentTemplate))
          isDisplayed = false;            
  }
  if( isDisplayed == false ) {
      console.log( naviItem["embed_id"] + " is hide. The cause is the displayGlobal: off" );
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
    console.log("LOCK PAGE SCROLL... FOR TAB BAR (MOBILE ONLY)");

    const html = document.documentElement;
    const body = document.body;
    const STYLE_ID = 'lock-scroll-style-patch';

    if (isLock) {
        const scrollY = window.scrollY || window.pageYOffset;

        if (!body.dataset._lockScrollSaved) {
            body.dataset._lockScrollSaved = "true";

            body._originalStyle = {
                htmlOverflow: html.style.overflow,
                bodyOverflow: body.style.overflow,
                bodyPosition: body.style.position,
                bodyTop: body.style.top,
                bodyLeft: body.style.left,
                bodyRight: body.style.right,
                bodyWidth: body.style.width
            };
        }

        // ✅ Inject scroll-behavior: auto !important
        if (!document.getElementById(STYLE_ID)) {
            const style = document.createElement('style');
            style.id = STYLE_ID;
            style.textContent = `
                html, body {
                    scroll-behavior: auto !important;
                }
            `;
            document.head.appendChild(style);
        }

        html.style.overflow = 'hidden';
        body.style.overflow = 'hidden';
        body.style.position = 'fixed';
        body.style.top = `-${scrollY}px`;
        body.style.left = '0';
        body.style.right = '0';
        body.style.width = '100%';
        body.dataset.scrollY = scrollY;

    } else {
        const scrollY = body.dataset.scrollY ? parseInt(body.dataset.scrollY) : 0;

        if (body._originalStyle) {
            html.style.overflow = body._originalStyle.htmlOverflow;
            body.style.overflow = body._originalStyle.bodyOverflow;
            body.style.position = body._originalStyle.bodyPosition;
            body.style.top = body._originalStyle.bodyTop;
            body.style.left = body._originalStyle.bodyLeft;
            body.style.right = body._originalStyle.bodyRight;
            body.style.width = body._originalStyle.bodyWidth;

            delete body._originalStyle;
            delete body.dataset._lockScrollSaved;
        }

        delete body.dataset.scrollY;

        body.offsetHeight; // force reflow
        window.scrollTo({ top: scrollY, left: 0, behavior: 'auto' });

        // ✅ Delay gỡ scroll-behavior để tránh bị smooth override
        setTimeout(() => {
            const style = document.getElementById(STYLE_ID);
            if (style) style.remove();
        }, 1000); // đủ để đảm bảo scrollTo đã xong
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
                    console.log("Removed publishToPlace because the suffix platforms");
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
        debugModeLog( naviItem["embed_id"] + " will publiced to place: " + naviItem["data"]["setting"]['publishToPlace'] );

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
            debugModeLog( '[Debugging] ' + naviItem["embed_id"] + " is shown by publishToPlace" );
        }
        // Trường hợp 2: ko publishToPlace nhưng có naviItem["embed_id"] -> Publish section qua theme editor
        if( !isPublishToPlace && (naviItem["embed_id"] == embed_id) ) {
            isSectionDisplay = true;
            debugModeLog( '[Debugging] ' + naviItem["embed_id"] + " is shown by theme editor" );
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
    var limitCount = 0;
    while( true ) {
        limitCount ++;
        if( limitCount >= 30 ) return null;
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
    var limitCount = 0;
    while( true ) {
        limitCount ++;
        if( limitCount >= 30 ) return null;
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
 Căn chỉnh CSS cho section parent, để hiển thị tốt hơn
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
        var zIndex = (50 - 1);
        if (isHadValue(setting['zIndex'])) zIndex = setting['zIndex'] - 1;
        session.style.zIndex = zIndex;

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


Menu.Section.fixMobileMegamenuScrollPosition = function(menuItem) {
    if (!menuItem || !(menuItem instanceof Element)) {
      console.warn('[fixMegamenu] menuItem không hợp lệ:', menuItem);
      return;
    }
  
    const submenu = menuItem.querySelector('ul.children[menulevel="2"]');
    if (!submenu) return;
  
    const computed = window.getComputedStyle(submenu);
    if (computed.position !== 'fixed') return;
  
    const rect = menuItem.getBoundingClientRect();
    submenu.style.top = `${rect.bottom + 1}px`;
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

Menu.Context.applySoftGreenOverlay = function(el) {
  el.style.transition = "background 0.5s ease, opacity 0.5s ease 0.5s";
  el.style.background = "rgba(0, 128, 0, 0.02)";
  el.style.opacity = "1";
  el.style.borderRadius = "8px";

  // Trigger fade out sau 0.5s
  requestAnimationFrame(() => {
    setTimeout(() => {
      el.style.opacity = "0";
    }, 300);

    // Sau 1s thì reset lại
    setTimeout(() => {
      el.style.background = "";
      el.style.opacity = "";
      el.style.transition = "";
    }, 700);
  });
}

Menu.Context.removeChildrenListeners = function ( newEl ) {
    /* HÀM NÀY CHỈ XÉT CÁC CHILD Ở 1 LEVEL TỪ CSS SELECTOR THÔI => NẾU CON SÂU HƠN CÓ THỂ NHẬN CLICK THÌ KO XLY ĐƯỢC */
    const allChildren = newEl.querySelectorAll('*');
    allChildren.forEach(child => {

        // Loại bỏ tất cả attribute kiểu on:* (onclick, on:click, onmouseover,…)
        Array.from(child.attributes).forEach(attr => {
            if (attr.name.startsWith('on')) {           // onclick, onmousedown, …
                child.removeAttribute(attr.name);
            }
            if (attr.name.startsWith('on:')) {          // on:click, on:mouseover,… (Svelte)
                child.removeAttribute(attr.name);
            }
            if (attr.name === 'aria-expanded') {        // remove aria-expanded
                child.removeAttribute(attr.name);
            }            
        });

        // Clone node để loại bỏ listener addEventListener
        const clone = child.cloneNode(true);

        // Ngon rồi này
        clone.setAttribute('onclick', 'event.preventDefault();return;');
        
        child.parentNode.replaceChild(clone, child);

        // lockAriaExpanded( clone );
                
    });
}


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
            overlay.innerHTML = "&nbsp;";

            // đảm bảo rootEl có position
            if (getComputedStyle(rootEl).position === "static") {
                rootEl.style.position = "relative";
            }

            // chèn overlay ngang cấp (trước rootEl)
            rootEl.parentNode.insertBefore(overlay, rootEl);

            overlay.addEventListener("click", function(event) {
                console.log("Call event by Details-menu-drawer-container overlay");
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


Menu.Context.checkTriggerIDClass = function(isDisplayed, naviItem ) { 

  if (!isHadValue(naviItem["data"]["setting"]['displayTrigger'])) 
    return;

  if (naviItem["data"]["setting"]['displayTrigger'] == "0") 
    return;

  if (isHadValue(naviItem["data"]["setting"]['publishTriggerIDClass'])) {

    if( naviItem["data"]["setting"]['publishTriggerIDClass'] == "" )
        return;

      var elsArray = Helper.String.stringToArray(naviItem["data"]["setting"]['publishTriggerIDClass']);

        elsArray.forEach(function(elsIdClass) {
            console.log(naviItem["embed_id"] + " added trigger event to: " + elsIdClass);

            elsIdClass = Helper.String.CSSSelectorPlatform(elsIdClass);
            if( elsIdClass == "" ) {
                console.log("Removed publishTriggerIDClass because the suffix platforms");
                return;
            }

            var els = document.querySelectorAll(elsIdClass);

            els.forEach(function(el) {

                if (localStorage.getItem("__isDebug") === "true") 
                  console.log(el);
                

                // Clone phần tử để gỡ toàn bộ event listeners cũ
                const newEl = removeAllEventListeners(el);    

                // Gỡ các thuộc tính Bootstrap như data-bs-toggle
                if (newEl.hasAttribute("data-bs-toggle")) 
                    newEl.removeAttribute("data-bs-toggle");
                
                if( newEl.classList.contains("_navi_loading") )
                    newEl.classList.remove("_navi_loading");

                // Tạo một vùng xanh xung quanh của vùng được chọn để thể hiện là đã load và gán xong
                Menu.Context.applySoftGreenOverlay(newEl);

                // Huỷ tất cả các listener trong các con của newEl
                Menu.Context.removeChildrenListeners(newEl); 

                var eventOpenNaviMenu = function( event) {
                    const target = event.currentTarget;

                    if (target.tagName.toLowerCase() === "a") {
                        event.preventDefault();                // Ngăn chuyển hướng
                        event.stopPropagation();               // Ngăn lan ra ngoài
                        event.stopImmediatePropagation();      // Ngăn các handler khác
                    }

                    openNaviMenu(naviItem["embed_id"]);
                }

                // Gắn lại listener riêng cho menu
                newEl.addEventListener("click", function(event) {
                    eventOpenNaviMenu( event );
                });

                if (localStorage.getItem("__isDebug") === "true") 
                  console.log("Remove children successfully");

                // Với case đặc biệt dành cho các theme Dawn... thì xử lý đặc biệt vì đây là trường hợp phổ biến nhất. 
                Menu.Context.checkReplaceHambugerMenu( elsIdClass, newEl, eventOpenNaviMenu ) ;   
           
            });
        });

        console.log(`⏰ Time to checkTriggerIDClass: ${performance.now() - window.debugTimeStart} ms`);

  }

  debugModeLog( naviItem["embed_id"] + " is always shown. The cause is: CONTEXT_SLIDE" );
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

Menu.Context.generateCSS_FixForHambuger = function (idCssNaviPrefix, setting, dragdrop, isNaviSection, section_setting, embed_id, naviman_appItem, menuKind) {
    var addHtml = " ";
    if( menuKind != NAVIGLOBAL['MENU_KINDS']['CONTEXT_SLIDE'] )
        return;

    var isOnMobile = (window.innerWidth <= 768);

    if (isHadValue(setting['submenuBackgroundColor']))
        addHtml += idCssNaviPrefix + ' ul.children { background: ' + setting['submenuBackgroundColor'] + '; } ';

    if (isHadValue(setting['submenuDividerColor']))
        addHtml += idCssNaviPrefix + ' ul.children ul.children { border-color: ' + setting['submenuDividerColor'] + '; } ';

    // Fix arrow icons to center of menu item (dynamic -> fixing)
    setTimeout(function(){
        const div = document.querySelector(idCssNaviPrefix + ' ul > li.is-parent-top > .inner');
        if( div != null ) {
            var html = '<style>';
            html += idCssNaviPrefix + ' ul > li.is-parent-top::after { top: '+ (div.clientHeight/2 - 4) +'px; } ';
            html += '</style>';

            naviman_appItem.insertAdjacentHTML('beforebegin', html);
        }
    }, 1000);

    // Lưu vào biến window về hamburgerSubDirection để dùng trong hàm showLevel2Items nhằm reset all sub menus -----------------------
    if (!window.hamburgerSubDirection)
        window.hamburgerSubDirection = {};
    window.hamburgerSubDirection[embed_id] = setting["hamburgerSubDirection"];

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
        
            addHtml += `${idCssNaviPrefix} ul li.item > ul.children {
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
            }`;
            
        
            // Chỉnh arrow
            addHtml += `${idCssNaviPrefix} ul > li.is-parent-top ul li.is-parent::after {
                right: 8px;
                top: 16px;
            }`;
        }
        
    }


    return addHtml;
};    var Menu = Menu || {}; 
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
                console.log("Check navi-click " + embedId);

                expandableLi.dispatchEvent(new MouseEvent('click', {
                    bubbles: true,
                    cancelable: true,
                    view: window
                }));
            }, 1000);
        });                                    
    }, 20 );

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
    addHtml += Menu.Common.Level1.generateBackground( setting, cssNaviPrefix, menuKind );        
    addHtml += Menu.Common.Level1.generateDropshadow( setting, cssNaviPrefix, menuKind );        
    addHtml += Menu.Common.Level1.generateHeight( setting, cssNaviPrefix, menuKind );        
    addHtml += Menu.Common.Level1.generateBorderRadius( setting, cssNaviPrefix, menuKind );        
    addHtml += Menu.Common.Level1.generateOpacity( setting, cssNaviPrefix, menuKind );        
   
    return addHtml;
};

var generateCSS_UI_Level2 = function ( setting, cssNaviPrefix, naviman_appItem, dragdrop, section_setting ) {
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
        addHtml += cssNaviPrefix + ' ul li ul.children { box-shadow: none !important; } ';
    }else {
        if (isHadValue(setting['submenuBackgroundColor'])) {
            addHtml += cssNaviPrefix + ' ul li ul.children { background: ' + setting['submenuBackgroundColor'] + ' } ';
            addHtml += cssNaviPrefix + ' ul li ul.children .overlay b.close { background: ' + setting['submenuBackgroundColor'] + ' } ';
        }
    }

    if (! isSettingBeTrue(setting['level2Dropshadow'], true)) { // Nếu không có nền thì bỏ nền và bỏ bóng.
        addHtml += cssNaviPrefix + ' ul li ul.children { box-shadow: none !important; } ';
    }

    if (isHadValue(setting['submenuDividerColor']))
        addHtml += cssNaviPrefix + ' ul li.child_divider { border-color: ' + setting['submenuDividerColor'] + '; } ';

    return addHtml;
};

var generateCSS_Publish = function (setting, cssNaviPrefix, section_setting) {
    //debugConsole("7.generateCSS_Publish");

    var isOnMobile = window.innerWidth <= 768;

    var addHtml = "";

    addHtml += ' @media only screen and (max-width: 768px) { ';
        if (setting['mobileDisplay'] == "false" || setting['mobileDisplay'] == false)
            addHtml += cssNaviPrefix + ' { display: none !important; } ';
        if( !isOnMobile )
            addHtml += cssNaviPrefix + ' { display: none !important; } ';
    addHtml += ' } ';

    addHtml += ' @media only screen and (min-width: 769px) { ';
        if (setting['desktopDisplay'] == "false" || setting['desktopDisplay'] == false) {
            addHtml += cssNaviPrefix + ' { display: none !important; } ';
        }
        if( isOnMobile )
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

var generateCSS_Advance = function (setting, cssNaviPrefix, naviman_appItem, embed_id, section_setting) {
    //debugConsole("9.generateCSS_Advance");

    var addHtml = "";

    // Global JS / jQuery ---------------------------------------------------------
    var jsScript = document.createElement('script');
    jsScript.textContent = Helper.HTML.clearCSS_JS(setting['jsCode']);
    document.body.appendChild(jsScript);

    var jsNaviScript = document.createElement('script');
    jsNaviScript.textContent = standardizeFunctionString( Helper.HTML.clearCSS_JS(setting['jsNaviCode']) );
    document.body.appendChild(jsNaviScript);

    // CSS ---------------------------------------------------------
    naviman_appItem.insertAdjacentHTML('beforebegin', '<style>' + standardizeCSS( Helper.HTML.clearCSS_JS(setting['cssCode']), embed_id ) + '</style>');
    naviman_appItem.insertAdjacentHTML('beforebegin', '<style>' + Helper.HTML.clearCSS_JS(setting['cssCodeGlobal']) + '</style>');

    // zIndex  ------------------------------------------------------
    if (isHadValue(setting['zIndex']))
        addHtml += cssNaviPrefix + ' { z-index: '+ setting['zIndex'] +'; } ';

    // multiSites  ------------------------------------------------------<<    
    if (isHadValue(setting['multiSites'])) {
        Helper.MultiSite.ConsoleDebug(window.location.hostname.toLowerCase().replace(/^www\./, '').trim(), section_setting, setting);
    
        var isHide = Helper.MultiSite.isMultiSitesHide(setting, section_setting);
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

    html += generateCSS_UI_Level2( setting, cssNaviPrefix, section_setting );
    html += generateCSS_FixByLayout( setting, cssNaviPrefix, dragdrop, section_setting );

    // Default is 100/item numbers
    //html += cssNaviPrefix + ' ul li.item { width: ' + (100 / dragdrop.length) + '%; } ';
    html += generateCSS_Level1_Width( setting, cssNaviPrefix, naviman_appItem, dragdrop, section_setting );

    html += generateCSS_Publish( setting, cssNaviPrefix, section_setting );
    html += generateCSS_Position( setting, cssNaviPrefix, section_setting, menuKind );
    html += generateCSS_Advance( setting, cssNaviPrefix, naviman_appItem, embed_id, section_setting );

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

    if( section_setting['multisite'] != "" ) {
        Helper.HTML.addLoadedFSAtBodyEnd( html, 10 );
    }
    else
        naviman_appItem.insertAdjacentHTML('beforebegin', html);

    

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
            console.log(`naviItem with embed_id ${naviItem.embed_id} already exists in queue.`);
        }
    };

/***************************************************************************************************************  
 Nhận về một đoạn giống như trong Blocks, có 2 trường hợp;
 1. Nếu embed_id == "" -> Chèn kiểu Alls (sticky, context, section to place), vẽ vào #naviman_app
 2. Nếu embed_id != "" -> Chèn kiểu section qua Theme Editor, vẽ vào embed_id + "-container"
****************************************************************************************************************/    
    var drawBottomNav = function (response, naviplusAppUrl, var_shop, var_embed_id, section_setting = [], fixMenuKind = 0) {

        console.log(`⏰ Time to drawBottomNav: ${performance.now() - window.debugTimeStart} ms`);

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
    children.forEach((child) => {
      index++;

      var childKind = getItemKind(child);
      var childIsParent = getItemIsParent( child );
      var childDivider = getItemDivider( child );

      var childDividerStyle = getDividerStyles( 2, childDivider, {
          "dividercolor": getExtVariable(child, "dividercolor", ""),
          "dividersize": getExtVariable(child, "dividersize", ""),
          "dividertype": getExtVariable(child, "dividertype", "")
      }, data["setting"], menuKind );

      var childShowBadgeMode = getItemShowBadgeMode(child);

      var childClass = "child ";
      if (childDivider == 1) childClass += "child_divider ";
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

      if( isOpenInbox( childUrl ) ) openInbox_loopHideFAB();

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
      if( classOfKind.trim() == "kind-group-title" && childUrl == "" && (!childIsParent) ) {
            seoUrl = '';
            childOnClick = '';
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
              isParent
          ])
          + '" ' + childOnClick + ' data-name="' + child["name"] + '" data-kind="' + childKind + '">';
      html += '<div class="inner ' + getAnimationClass(childExtAnimation) + '"' + collectStyles([childExtMargin]) + '>';
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
    if( menuKind == NAVIGLOBAL['MENU_KINDS']['CONTEXT_SLIDE'] )
        hamburgerClose = '<span title="Close menu" class="hamburger_close" style="display: none"><i class="ri-close-line"></i></span>';

    var scrollMobileAllow = isSettingBeTrue(naviItem["data"]["setting"]['scrollMobileAllow']);
    var scrollMobileFixWidth = 0;
    if( scrollMobileAllow )
        if (isHadValue(naviItem["data"]["setting"]['scrollMobileFixWidth'])) 
            scrollMobileFixWidth = normalizeNumber( naviItem["data"]["setting"]['scrollMobileFixWidth'] );
    if( normalizeNumber == 0 )    
        scrollMobileAllow = false;

    var scrollMobileDivOpen = '';
    var scrollMobileDivClose = '';
    var scrollMobileFixWidthStyle = '';
    if( scrollMobileAllow ) {
        console.log("___Scroll mobile allow: ", naviItem["embed_id"], scrollMobileFixWidth);        
        scrollMobileDivOpen = '<div class="scroll-mobile">';
        scrollMobileDivClose = '</div><!-- scroll-mobile-->';
        scrollMobileFixWidthStyle = ' style="width: '+ scrollMobileFixWidth +'px" ';
    }


    var html = sectionTitle + hamburgerClose;

    html += scrollMobileDivOpen;

    html += '<ul class="navigation" '+ scrollMobileFixWidthStyle +' >';
    data["dragdrop"].forEach((item) => {
        index++;

        var itemKind = getItemKind(item);
        var itemIsParent = getItemIsParent( item );
        var itemDivider = getItemDivider( item );
        var itemDividerStyle = getDividerStyles( 1, itemDivider, {
            "dividercolor": getExtVariable(item, "dividercolor", ""),
            "dividersize": getExtVariable(item, "dividersize", ""),
            "dividertype": getExtVariable(item, "dividertype", "")
        }, data["setting"], menuKind );

        var itemShowBadgeMode = getItemShowBadgeMode(item);

        var isParent = "";
        if( itemIsParent )
            isParent = " is-parent-top ";

        var itemClass = "item ";
        if (itemDivider == 1) itemClass += "item_divider ";

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

        var itemExtWidth = getExtWidth(item);

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

        if (isOpenInbox(itemUrl)) openInbox_loopHideFAB();

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
        if( classOfKind.trim() == "kind-group-title" && itemUrl == "" && ( !isParent ) ) {
              seoUrl = '';
              itemOnClick = '';
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
                isParent
            ])
            + '" ' + itemOnClick + ' data-name="' + naviLanguage.stringByLanguage(item["name"]) + '" data-kind="' + itemKind + '"' + 'data-fullexpand="'+  getExtVariable(item, "fullexpand", "0") +'"' + 'data-fullexpand-width="'+  getExtVariable(item, "fullexpandwidth", "") +'"' + '>';


        html += '<div class="inner ' + getAnimationClass(itemExtAnimation) + '"' + collectStyles([itemExtMargin]) + '>';
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
        return "";
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


    if( itemExtDiver["dividercolor"] != "" )
        styles += 'border-'+ dividerDirection +'color:' + itemExtDiver["dividercolor"] + ';';
    if( itemExtDiver["dividersize"] != "" )
        styles += 'border-'+ dividerDirection +'width:' + String(itemExtDiver["dividersize"]).strReplace("px", "").strReplace("pt", "") + 'px;';
    if( itemExtDiver["dividertype"] != "" )
        styles += 'border-'+ dividerDirection +'style:' + itemExtDiver["dividertype"] + ';';

    styles += '"';
    return styles;
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

var getExtWidth = function( item ) {
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


    if( widthLayout == 14 ) {
        var widthfix = getExtVariable(item, "widthfix", "");
        if (widthfix != "")
            itemExtWidth = String(widthfix).replace("pt", "").replace("px", "") + "px";
    }

    if( widthLayout == 20 ) itemExtWidth = "auto";

    var itemExtWidthStyle = "";
    var itemExtWidthClass = "";

    // Nếu widthLayout != 0 (tức là automation) thì sẽ có width: xxx. 
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

        var callDrawLoop = function(
            publishToPlaceKind, el_item, divNaviItem,
            naviItem, embed_id, shop, data, isNaviSection,
            section_setting, menuKind, menuKindClass, response,
            isPublishToPlace, naviman_app,
            durationMs = 10000, intervalMs = 300
            ) {
            const id = (naviItem && naviItem.embed_id) ? naviItem.embed_id : embed_id;
            if (!id) {
                console.warn('❗ Không có embed_id');
                return;
            }

            const drawOnce = () => {
                console.log('🎨 Draw_toEmbedIDCSSSelector →', id);
                try {

                    var newElement = Helper.getNewElementReplaceInsert(divNaviItem);        
                    Helper.deployReplaceInsertMode(publishToPlaceKind, el_item, newElement);                                          

                    Draw_toEmbedIDCSSSelector(
                        naviItem, embed_id, shop, data, isNaviSection,
                        section_setting, menuKind, menuKindClass, response,
                        isPublishToPlace, naviman_app
                    );
                } catch (e) {
                    console.error('💥 Lỗi khi draw:', e);
                }
            };

            drawOnce();

            const start = Date.now();
            const timer = setInterval(() => {
                const elapsed = Date.now() - start;
                if (elapsed > durationMs) {
                    clearInterval(timer);
                    console.log('⏱️ Stop loop after', durationMs, 'ms');
                    return;
                }

                const el = document.getElementById(id);

                // Nếu MẤT container → vẽ lại
                if (!el) {
                    console.log('⚠️ Container MẤT, re-draw →', id);

                    drawOnce();
                    return;
                }

                // (Tùy chọn) kiểm tra nội dung rỗng cũng coi như bị đè
                if (!el.innerHTML || el.innerHTML.trim() === '') {
                    console.log('⚠️ Nội dung rỗng, re-draw →', id);
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
                    
                    setTimeout(() => logGAEvent("visit", { navi_embed_id: naviItem["embed_id"] }), 300);
                    jsonp(naviplusAppUrl + 'logWH.php?action=updateVisit' + '&shop=' + shop).then(function(data){});
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

                callbackPublicFunc_delay(drawBottomNav, naviItem["embed_id"]);                   
            } // if (naviman_appItem)
            else 
                console.warn("Can not find (Maybe Insert/replace id be wrong):", naviItem["embed_id"]);                  
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
                }
                                
                
                if( Helper.isMultiSite(section_setting) ) {
                    Helper.waitForVar__Loaded_SF(naviItem.embed_id, function () {
                        Menu.Common.displayNaviItem_Container(menuKindClass, naviItem.embed_id, true);
                    });
                } else {
                    Menu.Common.displayNaviItem_Container( menuKindClass, naviItem.embed_id, false );
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
                    isDisplayed = Menu.Common.checkPlatformMode(isDisplayed, naviItem);
                }

                if( !Menu.Context.isDisplayTrigger(menuKindClass, naviItem) ) 
                    isDisplayed = false;
            }
            
            /*****************************************************************************************************************/
            if (["STICKY_TABBAR", "STICKY_MOBILE_HEADER", "STICKY_FAB_SUPPORT"].includes(menuKindClass)) {
                if (!Helper.Env.isBackendMode()) {
                    isDisplayed = Menu.Common.checkContainKeywords(isDisplayed, naviItem);
                    isDisplayed = Menu.Sticky.checkStickyDisplay(isDisplayed, naviItem, isNaviSection);
                    isDisplayed = Menu.Common.checkPlatformMode(isDisplayed, naviItem);
                }
            }

            /*****************************************************************************************************************/
            var isPublishToPlace = false;
            var publishToPlaceClass = "";

            if ( ["SECTION_MOBILE_HEADER", "SECTION_MOBILE_MEGAMENU", "SECTION_MOBILE_GRID", "SECTION_MOBILE_BANNER", "SECTION_DESKTOP_MEGAMENU"].includes(menuKindClass) ) {
                if (!Helper.Env.isBackendMode()) {
                    isDisplayed = Menu.Common.checkContainKeywords(isDisplayed, naviItem);
                    isDisplayed = Menu.Common.checkPlatformMode(isDisplayed, naviItem);
                                
                    if (isDisplayed) {
                        isPublishToPlace = Menu.Section.checkPublicToPlace(naviItem);
                        isNaviSection = isPublishToPlace || isNaviSection;
                    }
                   isDisplayed = Menu.Section.checkSectionPublishWays(isDisplayed, naviItem, embed_id, isPublishToPlace);

                }                
            }

            /*****************************************************************************************************************/
            // Kiểm tra xem nếu là multisites ko đạt thì isDisplayed = false
            if( Helper.MultiSite.isMultiSitesHide(naviItem["data"]["setting"], section_setting) )
                isDisplayed = false;

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
                if( naviItem["data"]["setting"]["attribute"] != null )
                    attribute = formatAttributes(parseAttributes( naviItem["data"]["setting"]["attribute"] ));

                if( isPublishToPlace == true ) {
                    publishToPlaceClass = " publishToPlace ";
                } 

                var divNaviItem = '<div style="visibility:hidden;'+ embedMarginStyle +'" '+ attribute +' name="' + naviItem["name"] + '" id="'+ naviItem["embed_id"] +
                    '" class="naviItem ' + publishToPlaceClass + naviItem["embed_id"] + menuPositionClass( data ) + menuSlidePositionClass(data, menuKind, naviItem["embed_id"]) + menuSlideDesktopSubDirection(data, menuKind) + ' ' + 
                    menuKindClass
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

                                    console.log("Tiếp tục xử lý JS sau khi DOM đã được thay thế.");
                                    
                                    callDrawLoop(
                                        publishToPlaceKind, el, divNaviItem,
                                        naviItem, embed_id, shop, data, isNaviSection, section_setting, menuKind, menuKindClass, response, isPublishToPlace, naviman_app );              
                                    //Draw_toEmbedIDCSSSelector(naviItem, embed_id, shop, data, isNaviSection, section_setting, menuKind, menuKindClass, response, isPublishToPlace, naviman_app );                  
                                } catch (err) {
                                    console.error("Can not find the CSS element:", err.message);
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

        debugModeLog(window.navimanData);

        // Nếu như cùng lúc section và sticky cùng bật thì loại bỏ sticky
        Menu.Section.hideDuplicateNavimanItems();
    };

    


    var Log = Log || {}; 

Log.saveLog = function(logShop, logToUrl, logFromUrl, logItemName, logEmbedId, logPlatform ) {

  if( logToUrl == "#" ) {
    console.log("Log: To URL is #, not saving log");
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

  logGAEvent("click", 
    { navi_embed_id: logEmbedId,
      navi_to_url: logToUrl,
      navi_from_url: logFromUrl,
      navi_menu_item_name: logItemName
    }
  );

  jsonp(naviplusAppUrl + 'logWH.php?action=saveLog' + '&' + params.toString()).then(function(data){
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
    var menuKind = getMenuKind(shopinfo, embed_id);    

    if( url != '#' )
        console.log("gotoUrl: " + url);

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
                    console.log("Call function: " + jsFunction);

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
                    console.log("Fixed for Whats App");
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
            showLevel3Items_Common(item, isNaviSection, menuKind, embed_id);
            showLevel3Items_Desktop(item, isNaviSection, menuKind, embed_id);
        }
        else
            showLevel2Items(item, menuKind, embed_id);
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
    document.querySelectorAll('.naviman_app ul.children ul.children').forEach((item) => {
        item.style.display = "none";
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

var showLevel3Items_Common = function (menuItem, isNaviSection, menuKind, embed_id) {

    var isOnMobile = (window.innerWidth <= 768);

    // Hide menu level 3 ======================
    if (!isOnMobile) {
        var is_showing = true;
        if (menuItem != null)
            is_showing = (menuItem.querySelector('ul.children').style.display === "block");
        if (is_showing) {
            menuItem.querySelector('ul.children').style.display = "none";
            return;
        }
    }
    // Hide menu level 3 ======================

    // Fix cho việc expand nội bộ từ level 3
    var isInnerExpand = false;
    if (isOnMobile)
        isInnerExpand = true;

    if (menuKind == NAVIGLOBAL['MENU_KINDS']['CONTEXT_SLIDE'])
        isInnerExpand = false;

    var ulParent = menuItem.parentElement;
    let ulChildrent = menuItem.querySelector('ul.children');

    // Nếu trên mobile thì sẽ có 1 cái overlay màu xám
    if (!(menuKind == NAVIGLOBAL['MENU_KINDS']['CONTEXT_SLIDE']))
        if (isInnerExpand) {
            var liTitle = document.createElement("li");
            liTitle.setAttribute("class", "overlay-container");
            liTitle.innerHTML = '<span class="overlay" onclick="return naviman.backToLevel1(event, this)"><b class="close"><i class="ri-arrow-left-line"></i></b></span>';
            ulParent.appendChild(liTitle);
        }


    if (ulChildrent.style.display == "none" || ulChildrent.style.display == "" || ulChildrent.style.display == "initial") {
        hideAllLevel3Items();
        if (menuKind == NAVIGLOBAL['MENU_KINDS']['CONTEXT_SLIDE'])
            displayElement(ulChildrent, true, "inline-block");
        else
            displayElement(ulChildrent, true, "block");
        menuItem.classList.add("menu-expand");
        menuItem.classList.add("menu-expand-level2");
    } else {
        hideAllLevel3Items();
        menuItem.classList.remove("menu-expand");
        menuItem.classList.remove("menu-expand-level2");
        ulChildrent.style.display = "none";
    }

    if (isInnerExpand) {

        /*
        Phương án giải quyết: Tính một lần chiều cao của ulLength và lưu vào attribute.
         */
        var ulLength = 0;
        if (ulChildrent.getAttribute('ulLength'))
            ulLength = ulChildrent.getAttribute('ulLength');
        else {
            ulLength = 8;
            let liChildrent = ulChildrent.querySelectorAll("li.child");
            for (i = 0; i < liChildrent.length; i++)
                ulLength += liChildrent[i].offsetHeight;
            ulChildrent.setAttribute('ulLength', ulLength);
        }


        // Expand menu height
        menuItem.parentElement.style.height = ulLength + "px"; //(8 + ulChildrent.querySelector( 'li.child' ).offsetHeight * ulChildrent.querySelectorAll("li.child").length) + "px";
        menuItem.parentElement.scrollTop = 0;
        menuItem.parentElement.style.overflow = "hidden";

        if (!isFromNotSkickyMenu(menuItem))
            Helper.showNaviOverlay();


        // 1. Cập nhật chiều cao của level 3 bằng level 2
        ulChildrent.style.height = ulLength + "px";

        /*
        Phương án giải quyết: Nếu chưa fix chiều cao của ulChildrentTopFixed để sao cho top của level 3 bằng
        top của level 2 thì tính toán và lưu vào attribute.
         */
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
        if( menuKind == NAVIGLOBAL['MENU_KINDS']['SECTION_MOBILE_MEGAMENU'] ) 
            ulChildrentTopFixed += 10;
        /**************************************************************/

        ulChildrent.style.top = (-ulChildrentTopFixed) + "px";

        // 3. Đánh dấu là đã cập nhật rồi, ko cần update lại
        ulChildrent.style.zIndex = 3;

        // 4. Đôi khi ulChildrent.style.left cần update lại vì parent của nó có thể ở giữa màn hình.
        if (isOnMobile) { // Việc này chỉ xảy ra trên mobile mà thôi.
            ulChildrent.style.left = (48 - ulChildrent.parentElement.getBoundingClientRect().left) + "px";
        }

    }
}

var showLevel3Items_Desktop = function (menuItem, isNaviSection, menuKind, embed_id) {
    var isOnMobile = (window.innerWidth <= 768);

    var ulParent = menuItem.parentElement;
    let ulChildrent = menuItem.querySelector('ul.children');

    // Nếu trên desktop thì sẽ expand ra và set width con=bố
    if (!isOnMobile) {
        
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
            console.log("Error: showLevel2Items - Can't find navimanObj");
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

var showLevel2Items = function (menuItem, menuKind, embed_id) {

    Menu.Section.fixMobileMegamenuScrollPosition( menuItem );

    var setting = getSettingOfNaviman( embed_id );     

    //********** Hàm kiểm tra để nếu dạng hover thì không bị giật giật do việc kiểm tra nếu hàm gọi quá nhanh và nhiều thì bỏ qua ******/
    var desktopHover = isSettingBeTrue(setting['desktopHover']);
    if( desktopHover ) {
        let now = Date.now();    
        if (now - lastShowLevel2ItemsCall < 150) {
            console.log("Reject showLevel2Items because called too fast:", now - lastShowLevel2ItemsCall, "ms");
            return;
        }    
        lastShowLevel2ItemsCall = now; // Cập nhật thời điểm gọi hàm
    }
    //**********************************************************************************************************************************/



    // 1. Kiểm tra xem có những menu item nào đang được hiện không
    var is_showing = true;
    if (menuItem != null)
        //is_showing = (menuItem.querySelector('ul.children').style.display === "block");
        is_showing = ["block", "flex"].includes(menuItem.querySelector('ul.children').style.display);

    // 2. Xoá sạch trạng thái hiện tại đi
    var needCloseAllDropdowns = false;

    // Giải thích: Nếu là các menu không phải hamburger thì cần reset tất cả các menu
    if (!(menuKind == NAVIGLOBAL['MENU_KINDS']['CONTEXT_SLIDE']))
        needCloseAllDropdowns = true;
    // Giải thích: Nếu là hamburger thì kiểm tra nếu mở rộng ra ngoài thì cũng cần reset tất cả các menu
    if (menuKind == NAVIGLOBAL['MENU_KINDS']['CONTEXT_SLIDE']) {
        if( window.hamburgerSubDirection[embed_id] == 2 )
            needCloseAllDropdowns = true;
    }    

    saveOpeningMenuInfo( is_showing, menuItem, menuKind, embed_id);

    // 3. Kiểm tra nếu chưa hiện thì hiện các ông con
    if (menuItem != null) {
        if (!is_showing) {
            
            Menu.Sticky.lockPageScrollingTabBar( menuKind, true );

            if (needCloseAllDropdowns == true)
                Helper.closeAllDropdowns();

            /****************************************************
            Logic là: Nếu như là full expand thì flex để tràn ra, còn lại thì block để hiện lên. */

            if( menuItem.getAttribute('data-fullexpand') == "1" ) {
                var ulChildrent = menuItem.querySelector('ul.children');
                displayElement(ulChildrent, true, "flex");

                // Kiểm tra nếu public ở dạng publishToPlace thì cần cập nhật lại vị trí
                if( isFrom_PublishToPlaceMenu(menuItem, embed_id) )
                    maintainFullExpandDropdownPosition(ulChildrent, "PublishToPlace");
                else 
                    maintainFullExpandDropdownPosition(ulChildrent, "InsertToSection");
            }
            else
                displayElement(menuItem.querySelector('ul.children'), true);
            /****************************************************/

            displayElement(menuItem.querySelector('span.arrow'), true);
            menuItem.querySelector('ul.children').style.overflow = "auto";

            menuItem.classList.add("menu-expand");
            menuItem.classList.add("menu-expand-level1");
            Menu.Common.setTopZindex(menuItem, menuKind, embed_id);

            if (!isFromNotSkickyMenu(menuItem))
                Helper.showNaviOverlay();

        } else {

            
            Menu.Sticky.lockPageScrollingTabBar( menuKind, false );

            var closeDropDown = function () {
                console.log("function: closeDropDown - Something wrong here ");
                displayElement(menuItem.querySelector('ul.children'), false);
                displayElement(menuItem.querySelector('span.arrow'), false);
                menuItem.classList.remove("menu-expand");
                menuItem.classList.remove("menu-expand-level1");
    
                Menu.Common.removeTopZindex(menuItem, menuKind, embed_id);
                Helper.hideNaviOverlay();
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
    console.log("Language already active:", targetLang);
    return;
  }

  let newPathParts = [...pathParts];
  if (currentLang) newPathParts.shift();
  if (targetLang !== defaultLang) newPathParts.unshift(targetLang);

  const newUrl = url.origin + '/' + newPathParts.join('/') + url.search;
  console.log("Redirecting to:", newUrl);
  window.location.href = newUrl;

  if (typeof callbackPublicFunc === 'function') {
    callbackPublicFunc(openChangeLanguage);
  }
};

var openNaviMenu = function(embedId) {
    const element = document.querySelector("#" + embedId);
    if (!element) {
        console.log( "openNaviMenu - Menu #" + embedId + " is not found!" );
        return;
    }

    if (window.innerWidth <= 768) {
        if (element.classList.contains("hamburger-mobile-fullfixed")) 
            return;
        
    } else {
        if (element.classList.contains("hamburger-desktop-fullfixed")) 
            return;        
    }    

    console.log("openNaviMenu:", embedId);

    if (getComputedStyle(element).visibility !== "visible") {
        console.log( "openNaviMenu - Start opening menu #" + embedId + "" );

        // Mở menu ******************************<<<
        const classList = element.classList;
        Helper.showNaviOverlayGlobal();
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
        // Mở menu ******************************>>>

    } else {
        // Đóng menu
        setTimeout(() => {
            element.style.visibility = "hidden";
        }, 300);

        Helper.hideNaviOverlayGlobal();
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
    var isDawnFamily = true;
    if(document.querySelector('details-modal.header__search') == null)
        isDawnFamily = false;
    if(document.querySelector('details-modal.header__search').querySelector("details") == null)
        isDawnFamily = false;

    callbackPublicFunc_delay(openSearch);

    // Dawn & Craft
    if( isDawnFamily ) {
        const divMenuAll = document.querySelectorAll('details-modal.header__search details');
        divMenuAll.forEach((divMenu) => {
            
            divMenu.setAttribute("open", "true");
            divMenu.querySelector("input").focus();
        });
    }else {
        const divMenu = document.querySelector('.header__icon--search');
        divMenu.addEventListener('click', () => {});
        divMenu.click();
    }
};

var focusToElement = function ( cssClass ) {
    console.log("focusToElement:", cssClass);
    if( document.querySelector(cssClass) != null ) {
        setTimeout(() => {
            document.querySelector(cssClass).focus();
            return false;
        }, "200");
    }else
        console.log("This theme is invalid. Can find: " + cssClass);
    return false;
};

/* **** Bản cũ ko dùng đến ******
var clickToElement = function ( cssClass ) {
    console.log("clickToElement:", cssClass);
    if( document.querySelector(cssClass) != null ) {
        setTimeout(() => {
            document.querySelector(cssClass).click();
            return false;
        }, "200");
    }else
        console.log("This theme is invalid. Can find: " + cssClass);
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
  console.log('clickToElement:', selector, { mode, delay, center, focus });

  if (!el) {
    console.log("This theme is invalid. Can find: " + selector);
    return false;
  }
  if (!el.isConnected) {
    console.warn('Element not in DOM:', selector);
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
    console.warn('Dispatch sequence failed, fallback to element.click()', e);
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
        //console.log("Function not found: " + functionName);
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

// CSS transition cho mượt (chèn 1 lần)
(function () {
    if (document.getElementById("__navi_smooth_css")) return;
    const st = document.createElement("style");
    st.id = "__navi_smooth_css";
    st.textContent = `
    .navi-anim {
      transition: transform .22s ease, opacity .22s ease;
      will-change: transform, opacity;
    }
    .navi-hidden {
      transform: translateY(100%);
      opacity: 0;
      pointer-events: none;
    }
    `;
    document.head.appendChild(st);
})();

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
    
    if( document.querySelector('#ShopifyChat').getAttribute("is-open") == "false" )
        if( document.querySelector('#ShopifyChat').style.visibility == "visible" ) {
            document.querySelector('#ShopifyChat').style.visibility = "hidden";
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

    if (document.querySelector('#ShopifyChat') != null) {
        document.querySelector('#ShopifyChat').style.visibility = "hidden";
        isLoop = false;
    }

    if (isLoop) {
        setTimeout(function () {
            openInbox_loopHideFAB();
        }, 200);
    }
};

var openInbox = function() {
    if( document.querySelector('#ShopifyChat') == null ) {
        console.log("Navi+: Shopify inbox is not installed. Read document <a target='_blank' href='https://help.shopifas.com/manual/faqs/open-chat-box-by-shopify-inbox'>here</a>");
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
        console.log("Navi+: Shopify inbox is not installed. Read document <a target='_blank' href='https://help.shopifas.com/manual/faqs/open-chat-box-by-shopify-inbox'>here</a>");
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
            .then(() => console.log('Successful share'))
            .catch(error => console.log('Error sharing:', error));
    }else
        console.log("This device does not support share directly!");

    callbackPublicFunc(openShareMe);
}


var callbackPublicFunc = function(func, embedID = "") {
    let callbackName = `Navi.${func.name}_Callback`;

    if (window.Navi)
    {
        if (typeof eval(callbackName) === 'function') {
            eval(callbackName + '("'+ embedID +'")' );
            console.log('Executed: '+ `${callbackName}` + '("'+ embedID +'") ');
        } else {
            // console.log(`${callbackName} is not found!`);
        }
    }else
    console.log(`The function ${callbackName} is not defined.`);
}

var callbackPublicFunc_delay = function(func, embedID = "") {
    setTimeout(() => { callbackPublicFunc(func, embedID); }, 500);
}

function goBack() {
    window.history.back();
}

function goForward() {
    window.history.forward();
}    var asyncGetCart =  async function() {
    const result = await fetch(window.Shopify.routes.root + 'cart.json');

    if (result.status === 200) {
        return result.json();
    }
    throw new Error(`Failed to get request, Shopify returned ${result.status} ${result.statusText}`);
};

var updateCartCount = function( item_count ) {
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

    asyncGetCart().then( function(result) {
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
                console.log( detail );
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
  console.log("📦 bindELToCartCount started...");

  function setVarIfExists() {
    const el = document.querySelector(targetSelector);
    if (!el) {
      console.log("❌ targetSelector not found:", targetSelector);
      return false;
    }

    const value = el.textContent.trim();
    // console.log(`🔍 Found target. Value = "${value}"`);
    
    document.documentElement.style.setProperty(`--${cssVarName}`, `"${value}"`);
    
    if (value === '' || value === '0') {
      setOpacityOfCartBadge(0);
    } else {
      setOpacityOfCartBadge(1);
    }

    return true;
  }

  function setOpacityOfCartBadge(val) {
    console.log(`🎯 Setting opacity of cart badge to: ${val}`);
    const elements = document.querySelectorAll(
      '.naviItem ul li.item_badge.item_badge_withcount > .inner .icon, ' +
      '.naviItem ul li.item_badge.item_badge_withcount > .inner .image'
    );

    if (!elements.length) {
      console.log("⚠️ No badge elements found.");
      return;
    }

    elements.forEach(el => {
      el.classList.toggle('hide-before', val === 0);
    });

    // console.log(`🎯 Badge visibility set: ${val === 0 ? 'hidden' : 'visible'}`);
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
      console.log(`✅ Style applied to ${selector}: ${styleString}`);
      clearInterval(interval);
    } else {
      console.log(`⏳ Waiting for ${selector}...`);
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
        console.log("LocalStorage has already been disabled.");
        return;
    }

    console.log("----- TURN OFF: LOCALSTORAGE ------");

    // Ghi đè thuộc tính localStorage
    Object.defineProperty(window, 'localStorage', {
        get() {
            console.error('LocalStorage is disabled.');
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

        openDebugMode: openDebugMode,
        closeDebugMode: closeDebugMode,
        debugModeLog: debugModeLog,

        showLevel2Items: showLevel2Items,

        FixGoogleApp: FixGoogleApp,
        MiniSnackbar: MiniSnackbar,

        Helper: Helper


    };

})();

var Navi = Navi || {};


(window.Navi ??= {}).Setting ??= {};

/** uigen/fix_by_cases.js ****************************************/
/*
Fix cho trường hợp click ra ngoài thì đóng toàn bộ menu, quay về trạng thái ban đầu mặc định
 */
if (!window._navimanClickListenerAttached) {
    window._navimanClickListenerAttached = true;
    
    /*******************************************************
     * Fix cho việc hover chuột qua thì hiện lên luôn trên desktop.
    ********************************************************/   
    window.addEventListener("load", function() {

        if (window.location.href.includes("simulator.php")) {
            // console.log( "Shopify info: In simulator mode " );
        } else {
            if( !window.Shopify )
                console.log( "Shopify info: Not in a Shopify shop " );
            else 
                console.log( "Shopify info: ", window.Shopify );
        }

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
    }); // Load xong file mới add các hàm này vào. 


    /*******************************************************
    Kiểm tra và giữ lại chỉ một phần tử navigation trong mỗi naviItem
    *******************************************************/  
    window.addEventListener("load", function() {
        const naviItems = document.querySelectorAll('.naviItem');

        naviItems.forEach(item => {
            const navigations = item.querySelectorAll('ul.navigation');
            if (navigations.length > 1) {
                // Giữ lại phần tử đầu tiên, xoá các phần tử còn lại
                for (let i = 1; i < navigations.length; i++) {
                    navigations[i].remove();
                }
            }
        });
    });


    /*******************************************************
    Fix cho việc bấm vào ngoài menu menu mà ko phải slide thì đóng menu
    *******************************************************/   
    document.addEventListener("click", function(event) {

        if( typeof event.target.closest == "undefined" )
            return;

        // Nếu như click vào ngoài menu thì sẽ đóng menu
        if( event.target.closest(".naviman_app ul li ul.children") == null && event.target.closest(".naviman_app .naviItem") == null ) {   

            if ( window._openingMenuItem && window._openingMenuKind && window._openingEmbedId ) { // Giả lập việc bấm vào đóng sub menu
                naviman.showLevel2Items(
                    window._openingMenuItem,
                    window._openingMenuKind,
                    window._openingEmbedId
                );
            }else {
                document.querySelectorAll('.naviman_app ul li ul.children').forEach((item) => {
                    item.style.display = "none";
                });

                // TODO
                // Nếu chưa load được file JS này thì có thể lỗi
                naviman.Helper.hideNaviOverlay(); 
            }                                             
        }
    });    

    /*******************************************************
    Fix cho việc click vào menu thì sẽ đóng slide/hambuger menu
    *******************************************************/        

    document.addEventListener("click", function(event) {
        const isCloseBtn = event.target.closest(".naviItem .hamburger_close");
        const isOverlay = event.target.closest(".naviman_app_overlay_global");

        if (isCloseBtn || isOverlay) {
            document.querySelectorAll(".naviItem.CONTEXT_SLIDE").forEach((item) => {
                if (window.innerWidth <= 768) {
                    if (!item.classList.contains("hamburger-mobile-fullfixed")) 
                        item.style.visibility = "hidden";
                    
                } else {
                    if (!item.classList.contains("hamburger-desktop-fullfixed")) 
                        item.style.visibility = "hidden";                    
                }
            });

            Helper_lockBodyScroll( false );

            const overlay = document.querySelector(".naviman_app_overlay_global");
            if (overlay) {
            overlay.style.display = "none";
            }

            // console.log("Slide menu closed by click on close button or overlay");
        }
    });    

} // End of click out of menu


/*
Kiểm tra xem có được khai báo không thì sẽ cài thêm phần body_position nữa. 
Navi.Setting = {
  lockBodyScroll_fixBodyPosition: true
}; 
*/

Helper_lockBodyScroll = function(isLock) {
  const html = document.documentElement;
  const body = document.body;

  const isFixBodyPosition =
    typeof Navi !== "undefined" &&
    Navi.Setting &&
    Navi.Setting.lockBodyScroll_fixBodyPosition === true;

   if( isFixBodyPosition )
    console.log("Navi.Setting.lockBodyScroll_fixBodyPosition", Navi.Setting.lockBodyScroll_fixBodyPosition);

  if (isLock) {
    // lưu inline style hiện tại vào window
    window.__lockBodyScrollBackup = {
      body_overflow: body.style.overflow,
      doc_overflowY: html.style.overflowY,
      body_position: body.style.position,
    };
    // set lock
    body.style.overflow = "hidden";
    html.style.overflowY = "hidden";
    if( isFixBodyPosition )
        body.style.position = "fixed";
  } else {
    const backup = window.__lockBodyScrollBackup;
    if (backup) {
      // restore
      body.style.overflow   = backup.body_overflow || "";
      html.style.overflowY  = backup.doc_overflowY || "";
      if( isFixBodyPosition )
        body.style.position   = backup.body_position || "";
      window.__lockBodyScrollBackup = null;
    }
  }
};

/********************************************************** 
    Dành cho fullExpand đảm bảo để dropdown menu
    sẽ luôn luôn duy trì vị trí ở dưới parent menu.
***********************************************************/

function updateFullExpandTop(fullExpandParent) {
    if (!fullExpandParent) return "0px";

    /* 1. Trường hợp cha của full expand ko có sticky, chỉ set là rect.bottom là top là đủ ****/
    const rect = fullExpandParent.getBoundingClientRect();
    let rawTop = rect.bottom;

    /* 2. Trường hợp cha của full expand có sticky thì phải trừ đi vị trí sticky OffsetFromTop. */
    let el = fullExpandParent.parentElement;
    let maxDepth = 20;

    while (el && maxDepth-- > 0 && el !== document.body) {
        const style = window.getComputedStyle(el);
        if (style.position === "sticky") { 
            
            const stickyRect = el.getBoundingClientRect();
            const stickyOffsetFromTop = stickyRect.top;

            // Có thể gặp nhiều case có sticky nhưng lại gỉa, khi đó stickyOffsetFromTop < 0 và sẽ bị bỏ qua
            if( stickyOffsetFromTop > 0 )
                rawTop = rawTop - stickyOffsetFromTop;
            break; // chỉ xử lý sticky đầu tiên
            
        }
        el = el.parentElement;
    }

    return rawTop + "px";
}




function maintainFullExpandDropdownPosition(dropdownFullExpand, insertMethod = "PublishToPlace") {
    function updatePosition() {
        let parent = dropdownFullExpand.parentElement;
        if (parent) {
            let rect = parent.getBoundingClientRect();     
            
            if( insertMethod == "PublishToPlace" )                    
                dropdownFullExpand.style.top = updateFullExpandTop(dropdownFullExpand.parentElement); // rect.bottom + "px";                        
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
            //console.warn("Dropdown has no parent element.");
        }
    }
    
    updatePosition();
    window.addEventListener("scroll", updatePosition);
    window.addEventListener("resize", updatePosition);
}


/********************************************************** 
    Fix vị trí dành cho badge luôn ở góc phải trên của icon/image
***********************************************************/



/********************************************************** 
    Fix cho menu mobile megamenu dropdown thì khi expand ra thì ko cho phép scroll page
***********************************************************/

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
            document.body.style.overflow = isVisible ? 'hidden' : '';
            document.documentElement.style.overflowY = isVisible ? 'hidden' : '';
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
}

function lockAriaExpanded(el) {
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
}

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





var naviman_runApp = function (e) {

/** 1.Link CSS & icons **************************************/
    function linkCSSToHead(href) {
        // Kiểm tra xem file CSS đã tồn tại trong <head> chưa
        if (!document.querySelector(`link[href="${href}"]`)) {
            const link = document.createElement('link');
            link.href = href;
            link.type = "text/css";
            link.rel = 'stylesheet';

            // Khi file CSS được tải xong, log ra thông báo (tùy chọn)
            link.onload = function () {
                // console.log(`CSS file ${href} loaded successfully.`);
            };

            // Thêm phần tử <link> vào phần <head>
            document.head.appendChild(link);
        } else {
            // console.log(`CSS file ${href} is already linked on this page.`);
        }
    }

    /* Ko dùng đến hàm này *****/
    /*
    function linkPreloadCSSToHead(href) {
        // Kiểm tra xem file CSS đã tồn tại trong <head> chưa
        if (!document.querySelector(`link[href="${href}"]`)) {
            // Tạo thẻ <link> với rel="preload" để preload CSS
            const preloadLink = document.createElement('link');
            preloadLink.href = href;
            preloadLink.rel = 'preload';
            preloadLink.as = 'style';

            // Thêm thẻ preload vào <head>
            document.head.appendChild(preloadLink);

            // Sau khi preload xong, thêm thẻ <link rel="stylesheet">
            const link = document.createElement('link');
            link.href = href;
            link.type = "text/css";
            link.rel = 'stylesheet';

            // Khi file CSS được tải xong, log ra thông báo (tùy chọn)
            link.onload = function () {
                // console.log(`CSS file ${href} loaded successfully.`);
            };

            // Thêm phần tử <link> vào phần <head>
            document.head.appendChild(link);
        } else {
            // console.log(`CSS file ${href} is already linked on this page.`);
        }
    } */

    /** 2.Get variables **************************************/
    var shop = document.currentScript.getAttribute('shop');
    var embed_id = '';
    if(document.currentScript.getAttribute('embed_id') != null)
        embed_id = document.currentScript.getAttribute('embed_id');
    var multisite = '';
    if(document.currentScript.getAttribute('multisite') != null)
        multisite = document.currentScript.getAttribute('multisite');

    var section_setting = [];
    section_setting['shop'] = shop;
    section_setting['embed_id'] = '';
    section_setting['not_sticky'] = false;
    section_setting['embed_title'] = '';
    section_setting['embed_is_full'] = false;
    section_setting['embed_margin'] = "0 0 0 0";
    section_setting['multisite'] = multisite;

    if(embed_id != '') {
        var not_sticky = false;
        var embed_title = "";
        var embed_is_full = false;
        var embed_margin = "0 0 0 0";

        if (document.currentScript.getAttribute('not_sticky') != null)
            not_sticky = document.currentScript.getAttribute('not_sticky');
        if(embed_id != '') if(document.currentScript.getAttribute('embed_title') != null)
            embed_title = document.currentScript.getAttribute('embed_title');
        if(embed_id != '') if(document.currentScript.getAttribute('embed_is_full') != null)
            embed_is_full = document.currentScript.getAttribute('embed_is_full');
        if(embed_id != '') if(document.currentScript.getAttribute('embed_margin') != null)
            embed_margin = document.currentScript.getAttribute('embed_margin');

        section_setting['embed_id'] = embed_id.trim();
        section_setting['not_sticky'] = not_sticky;
        section_setting['embed_title'] = embed_title.trim();
        section_setting['embed_is_full'] = embed_is_full;
        section_setting['embed_margin'] = embed_margin;
    }

    /** LOAD CSS ***************/
    linkCSSToHead( "https://cdnjs.cloudflare.com/ajax/libs/animate.css/4.1.1/animate.min.css" );
    linkCSSToHead( "https://cdn.jsdelivr.net/npm/remixicon@4.5.0/fonts/remixicon.min.css" );        
    linkCSSToHead( naviplusCss );


    /*****************
     Mỗi khi gặp đoạn mã này thì sẽ chạy một lần runNaviman. Data có thể là một danh sách hoặc 1 item
     - Nếu all: Chạy for cho nhiều item.
     - Nếu section:
        1. Nếu sticky thì chạy bình thường (for vô nghĩa)
        2. Nếu ko sticky thì bổ sung mã CSS (for vô nghĩa)
     ***************/
    function runNaviman( data, shopinfo ) {
        naviman.init();

        console.log(`⏰ Time to runNaviman: ${performance.now() - window.debugTimeStart} ms`);

        if( isNeedCartCount(data) ) {
            naviman.asyncGetCart().then( function(result) {
                // console.log("Cart count: " + result.item_count );

                console.log(`⏰ Time to runNaviman + isNeedCartCount: ${performance.now() - window.debugTimeStart} ms`);
                
                window.addEventListener('SCE:mutate', (event) => {
                    naviman.checkAndUpdateCartCount();
                });
                naviman.setCartCount( result.item_count );
                naviman.drawBottomNav(data, naviplusAppUrl, shop, embed_id, section_setting);
                naviman.generateActiveItems();

                if( result.item_count == 0 ) {
                    naviman.updateCartCount( result.item_count );
                }

            });
        }else {
            // console.log("kaka");
            naviman.drawBottomNav(data, naviplusAppUrl, shop, embed_id, section_setting);
            naviman.generateActiveItems();
        }
    }


    var api_url = naviplusCDNJson + "/" + shop.replace(".myshopify.com", '') + ".all.json";
    if( embed_id != '' )
        api_url = naviplusCDNJson + "/" + shop.replace(".myshopify.com", '') + "." + embed_id + ".json";
    // TODO: Chỗ này có cái đuôi này là không chạy đúng
    // api_url += "?v=" + Date.now();

    var api_shopinfo_url = naviplusCDNJson + "/" + shop.replace(".myshopify.com", '') + ".info.json";
    // api_shopinfo_url += "?v=" + Math.random();
    // api_shopinfo_url += "?v=" + Date.now();

    function logCache( kind, key, value ) {
        console.log( kind + ": " + key);
        console.log(value);
    }

    // Start here ===============================================<<

    function clearNaviSectionStorage() {
        if( !naviman.isLocalStorageSupported() )
            return;
        for (let i = 0; i < localStorage.length; i++) {
            const key = localStorage.key(i);

            if (key.includes('naviplus')) {
                localStorage.removeItem(key);
                i--;
            }
        }
    }


    function runApplication(shopinfo) {
        var jsonData = naviman.getSessionStorage(api_url);
        var jsonUpdateVersion = 0;
        if( naviman.getSessionStorage("jsonUpdateVersion") != null )
            jsonUpdateVersion = naviman.getSessionStorage("jsonUpdateVersion");
        
        var isNeedRequestServer = false;
        if( jsonData == null )
            isNeedRequestServer = true;
        if( shopinfo["update_version"] != jsonUpdateVersion ) {
            console.log("There is a new version of Navi+ data! Loading from server...");
            clearNaviSectionStorage();
            isNeedRequestServer = true;
        }

        console.log(`⏰ Time to runApplication: ${performance.now() - window.debugTimeStart} ms`);

        // TODO: Chỗ này có thể cải tiến tốc độ load file bằng cách lấy thông tin  chính xác về version.
        if (!window._naviVer) {
            window._naviVer = Date.now();
            console.log( "Loaded on uigen: _naviVer = ", window._naviVer );
        }
        else 
            console.log( "Loaded on theme: _naviVer variable is created! Don't need reload" );


        //    isNeedRequestServer = true; // Dùng để test xem có lưu data vào sesion ko? Hay lúc nào cũng load từ server?
        if( isNeedRequestServer ) {
            fetch(api_url + "?v=" + window._naviVer )
                .then((response) => response.json())
                .then((json) => {
                    console.log( "[Server]", api_url, json );

                    // Set json to localStorate
                    naviman.setSessionStorage(api_url, json, naviplusCacheMiniseconds);

                    // Set update version to localStorate
                    naviman.setSessionStorage("jsonUpdateVersion", shopinfo["update_version"], naviplusCacheMiniseconds);

                    runNaviman(json, shopinfo);
                });
        }else {
            // logCache( "From local", api_url, jsonData );
            console.log("[Session storage] " , api_url);
            runNaviman(jsonData, shopinfo);
        }
    }

    //******************************************************************
    // LẤY THÔNG TIN VỀ BIẾN TOÀN CỤC SHOPINFO ĐỂ CHẠY ỨNG DỤNG
    //******************************************************************
    if (!navihelper.windowVar.isExisted('shopinfoPromise')) {
        navihelper.windowVar.set('shopinfoPromise', null);
    }

    if (!navihelper.windowVar.isExisted('shopinfo')) {
        if (!navihelper.windowVar.get('shopinfoPromise')) {
            // Nếu chưa có dữ liệu và chưa có Promise, thực hiện fetch
            const shopinfoPromise = fetch(api_shopinfo_url)
                .then((response) => response.json())
                .then((shopinfo) => {
                    navihelper.windowVar.set('shopinfo', shopinfo); // Lưu dữ liệu
                    console.log(shopinfo);
                    return shopinfo;
                })
                .catch((error) => {
                    console.error("Error fetching shop info:", error);
                    throw error;
                });
            navihelper.windowVar.set('shopinfoPromise', shopinfoPromise);
        }

        navihelper.windowVar.get('shopinfoPromise').then((shopinfo) => {
            runApplication(shopinfo);
        });
    } else {
        runApplication(navihelper.windowVar.get('shopinfo'));
    }
    //******************************************************************



    // Start here ===============================================>>


    function containsBadgeIsCart(arr) {
        for (let i = 0; i < arr.length; i++) {
            const item = arr[i];
            if( naviman.isHadValue( item["badgeiscart"] ) )
                if( item["badgeiscart"] == 1 || item["badgeiscart"] == "1" ) {
                    return true;

                }

            if (Array.isArray(item["children"]))
                if (item["children"].length > 0) {
                    if (containsBadgeIsCart(item["children"])) {
                        return true;
                    }
                }
        }

        return false;
    }

    function isNeedCartCount( data ) {

        if( section_setting['multisite'] != "" )
            return false;

        if( section_setting['multisite'] == "" ) {
            
            if( window.Shopify ) {
                /* trường hợp 1: Là trong 1 site Shopify */
                console.log( window.Shopify["shop"] );
            }
            else {
                // Ko chịu ghi rõ multisite trong phần nhúng vào website ngoài Shopify
                return false;
            }
        }

        var isNeed = false;
        data.forEach((naviItem) => {
            if( containsBadgeIsCart( naviItem["data"]["dragdrop"] ) ) {
                isNeed = true;
                return;
            }
        });
        return isNeed;
    }

    /** 3.Get API data **************************************/
    function jsonp(uri) {
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
    }



};

// naviman_runApp();


function waitForElement(selector, callback) {
  const el = document.querySelector(selector);
  if (el) {
    callback(el);
    return;
  }

  const observer = new MutationObserver(() => {
    const el = document.querySelector(selector);
    if (el) {
      observer.disconnect();
      callback(el);
    }
  });

  observer.observe(document.body, { childList: true, subtree: true });
}

// Dùng
waitForElement('#naviman_app', () => {
  console.log("%cStart naviman_runApp", "color: purple; font-weight: bold; font-size: 16px;");
  naviman_runApp();
});


