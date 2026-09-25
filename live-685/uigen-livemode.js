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

    modalTitle: "Navi+ Live",
    modalCloseAriaLabel: "Close",
    modalCloseSymbol: "×",
    debugStatusOn: "Status: ON",
    debugTurnOff: "Turn off",

    // Chia làm 2 card rõ ràng thay vì 1 khối liên tục
    modalDescriptionInsertReplace: [
      "<b>To insert before/after an element or replace the original menu (Mega Menu / Icon Menu):</b>",
      "<div style='margin-top:6px'>1. Hover over elements on the page to see their CSS selector.</div>",
      "<div>2. Use ↑ ↓ / ← → to navigate between elements until you find the right one.</div>",
      "<div>3. Press <kbd>Cmd/Ctrl + C</kbd> to copy the selector.</div>",
    ].join(""),
    modalDescriptionSlideMenu: [
      "<b>To replace the original mobile menu:</b>",
      "<div style='margin-top:6px'>1. Switch your site to mobile view.</div>",
      "<div>2. Hover over the target area (e.g. the hamburger menu icon), then press <kbd>Cmd/Ctrl + E</kbd> to simulate a click.</div>",
      "<div>3. If the menu opens → you've found the right selector.</div>",
      "<div>4. Press <kbd>Cmd/Ctrl + C</kbd> to copy it. (Your Navi+ menu will replace this element.)</div>",
    ].join(""),
    modalDescriptionViewDetailLink:
      "<div style='margin-top:10px'><a target=_blank href='https://help.naviplus.io/docs/usage/debug-mode-find-css-selectors'>View detail</a></div>",
    enableLabel: "To enable: ",
    enableCode: "yourdomain.com/#livemode",
    disableLabel: "To disable: ",
    disableCode: "yourdomain.com/#livemode-off",

    turnedOffTitle: "Navi+ Live is now turned off",
    turnedOffMessage: "To enable it again, please use the following URL syntax on your website:",
    turnedOffStatusOff: "Status: OFF",
    turnedOffTurnOn: "Turn on",

    inspectorCopyHintMac: "To copy: [⌘ + C] | Simulate click: [⌘ + E] | Move to parent level: [↑/←], [↓/→] child",
    inspectorCopyHintWindows: "To copy: [Ctrl + C] | Simulate click: [Ctrl + E] | Move to parent level: [↑/←], [↓/→] child",
    inspectorCopiedSnackbar: (selector) => `Copied "${selector}"..`,
    inspectorSimulatedClickSnackbar: (selector) => `Simulated click on "${selector}"`,

    findCssLabel: "Navi+ Inspect:",
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

  /* localStorage (không phải sessionStorage) — nhớ lựa chọn theme qua lại nhiều lần mở Debug mode */
  const safeLocalStorage = {
    get(key) {
      try {
        return window.localStorage.getItem(key);
      } catch {
        return null;
      }
    },
    set(key, value) {
      try {
        window.localStorage.setItem(key, value);
      } catch {}
    },
    remove(key) {
      try {
        window.localStorage.removeItem(key);
      } catch {}
    },
  };

  const isMac = (() => {
    const platform = String(navigator.platform || "");
    if (/(Mac|iPhone|iPad|iPod)/i.test(platform)) return true;
    const ua = String(navigator.userAgent || "");
    return /(Mac OS X|iPhone|iPad|iPod)/i.test(ua);
  })();

  /* Nhận diện browser + ngôn ngữ để wording/phím tắt đúng ngữ cảnh user */
  const getBrowserInfo = () => {
    const ua = String(navigator.userAgent || "");
    if (/Edg\//i.test(ua)) return { key: "edge", label: "Microsoft Edge", featureName: "Toggle device emulation" };
    if (/OPR\//i.test(ua)) return { key: "opera", label: "Opera", featureName: "Toggle device toolbar" };
    if (/Firefox\//i.test(ua)) return { key: "firefox", label: "Firefox", featureName: "Responsive Design Mode" };
    if (/Chrome\//i.test(ua)) return { key: "chrome", label: "Chrome", featureName: "Toggle device toolbar" };
    if (/Safari\//i.test(ua) && !/Chrome|CriOS|Edg|OPR/i.test(ua)) return { key: "safari", label: "Safari", featureName: "Responsive Design Mode" };
    return { key: "other", label: "Browser", featureName: "Device/Responsive mode" };
  };

  const getGuideLocale = () => {
    const lang = String(navigator.language || navigator.userLanguage || "").toLowerCase();
    return lang.startsWith("vi") ? "vi" : "en";
  };

  const getMobileGuideCopy = () => {
    const browser = getBrowserInfo();
    const locale = getGuideLocale();
    const defaultShortcut = isMac ? "Cmd + Shift + M" : "Ctrl + Shift + M";
    const firefoxShortcut = isMac ? "Option + Cmd + M" : "Ctrl + Shift + M";
    const safariShortcut = isMac ? "Option + Cmd + R" : "Không có phím tắt mặc định";
    const shortcutByBrowser = browser.key === "safari"
      ? safariShortcut
      : (browser.key === "firefox" ? firefoxShortcut : defaultShortcut);

    if (locale === "vi") {
      return {
        cardTitle: "Debug website trên mobile",
        cardSubtitle: `${browser.label} • ${isMac ? "Mac" : "Windows/Linux"}`,
        step1: "1) Nhấn chuột phải vào website, chọn Inspect.",
        step2Title: "2) Bật chế độ mobile trong DevTools:",
        step2Shortcut: `<b>Cách 1 - Phím tắt:</b> ${shortcutByBrowser}`,
        step2Icon:
          `<b>Cách 2 - Bấm icon:</b> <i class="ri-smartphone-line" style="font-size:14px;vertical-align:-2px"></i> ` +
          `trên thanh DevTools (${browser.featureName}).`,
        step2Resize:
          "<b>Cách 3 - Resize cửa sổ:</b> kéo rộng/thu nhỏ cửa sổ browser đến kích thước mong muốn, rồi <b>refresh trang</b>.",
        step3:
          "3) Sau đó dùng Navi+ Live hoặc công cụ Inspect của trình duyệt để lấy CSS selector.",
        qrTitle: "Hoặc quét mã QR để mở đúng trang này trên điện thoại thật của bạn:",
        qrPasswordNote: "Store của bạn có password? Quét 1 lần để nhập password, quét lại lần 2 để test.",
      };
    }

    const safariShortcutEn = isMac ? "Option + Cmd + R" : "No default shortcut";
    const shortcutByBrowserEn = browser.key === "safari"
      ? safariShortcutEn
      : (browser.key === "firefox" ? firefoxShortcut : defaultShortcut);
    return {
      cardTitle: "Debug website on mobile",
      cardSubtitle: `${browser.label} • ${isMac ? "Mac" : "Windows/Linux"}`,
      step1: "1) Right-click your website and choose Inspect.",
      step2Title: "2) Enable mobile mode in DevTools:",
      step2Shortcut: `<b>Method 1 - Shortcut:</b> ${shortcutByBrowserEn}`,
      step2Icon:
        `<b>Method 2 - Click icon:</b> <i class="ri-smartphone-line" style="font-size:14px;vertical-align:-2px"></i> ` +
        `in DevTools toolbar (${browser.featureName}).`,
      step2Resize:
        "<b>Method 3 - Resize window:</b> resize the browser window to your target width, then <b>refresh the page</b>.",
      step3:
        "3) Then use Navi+ Live or the browser Inspect tools to capture CSS selectors.",
      qrTitle: "Or scan this QR code to open this exact page on your own phone:",
      qrPasswordNote: "Store has a password? Scan once to unlock it, then scan again to test.",
    };
  };

  /* TASK00534: cú pháp mới #livemode / #livemode-on / #livemode-off — giữ #navidebug-on/off chạy
     SONG SONG (không phá link cũ đã gửi/lưu). Check "-off" TRƯỚC rồi mới check "-on"/bare "#livemode"
     vì "#livemode-off" cũng chứa substring "#livemode" — nếu không loại trừ trước sẽ bị nhận nhầm
     thành cả on lẫn off cùng lúc. */
  const applyDebugModeFromHash = () => {
    const hash = String(window.location.hash || "");
    const sawOff = hash.includes("#navidebug-off") || hash.includes("#livemode-off");
    const sawOn = !sawOff && (hash.includes("#navidebug-on") || hash.includes("#livemode-on") || hash.includes("#livemode"));
    // "&finder=1" đi kèm hash bật debug mode (vd "#livemode&finder=1") → tự bật Navi+
    // Inspect ngay, không cần user tự bấm nút toggle. CHỈ có tác dụng khi sawOn (đang bật debug mode
    // qua chính hash này) — không tự bật finder nếu debug mode đến từ nguồn khác (sessionStorage cũ).
    const sawFinder = sawOn && hash.includes("finder=1");
    // TASK01052 (Khôi 23/09: "chuyển sang live mode thì bấm hộ nút Find spot luôn") — "&autodetect=1"
    // đi kèm hash (nút "Navi+ Live" ở admin, com.navi-live.php::naviLiveOpenUrl) → tự bấm hộ nút
    // "Detect menu spots" của Home mới, khách không phải bấm lại lần nữa khi vừa mở tab. KHÁC hẳn
    // hợp đồng của link onboarding admin (?naviselectorcheck=1, TASK01003, "mở qua link admin KHÔNG
    // tự dò — khách bấm [Detect]") — hợp đồng đó GIỮ NGUYÊN, không đụng; cờ này chỉ áp cho lối vào
    // "Navi+ Live" (khách đã quen sản phẩm, muốn thấy kết quả ngay, không cần từng bước làm quen).
    const sawAutoDetect = sawOn && hash.includes("autodetect=1");

    if (sawOn) {
      safeSessionStorage.set(debugModeStorageKey, "true");
    }
    if (sawOff) {
      safeSessionStorage.remove(debugModeStorageKey);
    }
    if (sawFinder) {
      setInspectorEnabled(true);
    }

    return { sawOn, sawOff, sawAutoDetect };
  };

  /* URL cho QR mobile: LUÔN gắn #livemode (viết đè hash hiện tại) để điện thoại quét xong tự
     bật debug mode ngay — không phụ thuộc tab hiện tại có đang giữ hash đó trên URL hay không (panel
     có thể đang mở lại từ cờ sessionStorage, hash gốc đã rơi mất khỏi URL từ lâu). Giữ nguyên
     location.search vì "Try Navi+ menus" demo cần ?test=1&embed=... để DemoMarket nhận đúng vị trí
     khi phone tải lại trang. TASK00535: bỏ hậu tố "-on" cho ngắn (Khôi chốt, bare #livemode đã được
     applyDebugModeFromHash() nhận diện là bật y hệt #livemode-on). */
  /* Kèm trạng thái "Kiểm tra Selector" (tập spot đang thử + selector đã dò — sessionStorage không sang
     máy khác) để điện thoại/popup mobile dựng lại đúng demo theo spot thay vì bị coi là link demo cũ. */
  const buildDebugQrUrl = () => {
    let extra = "";
    try {
      const trying = sessionStorage.getItem("navi_selcheck_trying") || "";
      const sel = sessionStorage.getItem("navi_selcheck_selectors") || "";
      const res = sessionStorage.getItem("navi_selcheck_result") || "";
      if (trying && trying !== "[]") extra += "&naviseltry=" + encodeURIComponent(trying);
      if (sel) extra += "&navisel=" + encodeURIComponent(sel);
      if (res) extra += "&navires=" + encodeURIComponent(res); // kết quả Detect → điện thoại thấy card ngay, khỏi Detect lại
    } catch (e) {}
    const search = location.search ? location.search + extra : (extra ? "?" + extra.slice(1) : "");
    return location.origin + location.pathname + search + "#livemode";
  };

  const isDebugModeEnabled = () => safeSessionStorage.get(debugModeStorageKey) === "true";

  /** Mặc định OFF. Lưu trong session. */
  const isInspectorEnabled = () => safeSessionStorage.get(inspectorEnabledStorageKey) === "true";
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

    /* "Pick mode" của Navi+ Finder — dùng cho panel "Kiểm tra Selector" (Tầng 3, dò tay): bật
       inspector với 1 handler; click CHUỘT THƯỜNG (không cần ⌥/Ctrl như luồng copy cũ) lên phần tử
       đang khoanh → gọi handler(element) rồi tự tắt inspector. Handler = null → inspector giữ nguyên
       hành vi cũ 100% (click thường đi xuyên xuống trang). KHÔNG ghi cờ inspectorEnabledStorageKey
       để syncInspectorWithDebugMode() không tự bật lại Finder ở lần load sau. */
    let _inspectorPickHandler = null;
    const enableInspectorForPick = (handler) => {
      if (inspectorController) disableInspector();
      _inspectorPickHandler = handler;
      inspectorController = createInspector();
    };
    const cancelInspectorPick = () => {
      _inspectorPickHandler = null;
      disableInspector();
    };

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

    // Inject Remix Icons if not already loaded
    const remixIconLinkId = "dm_remixicon_css";
    if (!document.getElementById(remixIconLinkId)) {
      const link = document.createElement("link");
      link.id = remixIconLinkId;
      link.rel = "stylesheet";
      link.href = "https://cdn.jsdelivr.net/npm/remixicon@4.8.0/fonts/remixicon.css";
      document.head.appendChild(link);
      cleanupTasks.push(() => link.remove());
    }

    // Helper: inline Remix icon + optional label
    const ri = (cls, label = "") =>
      `<i class="ri-${cls}" style="font-size:1em;vertical-align:-0.1em;${label ? "margin-right:5px" : ""}"></i>${label}`;

    if (!document.getElementById(uiStyleId)) {
      const style = document.createElement("style");
      style.id = uiStyleId;
      style.textContent = `
        @keyframes dm-spin { to { transform: rotate(360deg); } }
        .dm-spin { display: inline-block; animation: dm-spin 0.8s linear infinite; }
        body:has(#${modalId}[data-open="1"]) { overflow: hidden !important; }
        #${floatButtonId} {
          position: fixed;
          right: 0;
          top: var(--dm-trigger-top, 100px);
          touch-action: none;
          border-radius: 10px 0 0 10px;
          border: none;
          padding: 10px 8px;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 5px;
          background: #ffffff;
          box-shadow: -2px 0 12px rgba(0,0,0,0.18);
          cursor: pointer;
          z-index: 2147483646;
          font-family: ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial;
          font-size: 10px;
          font-weight: 650;
          color: rgba(17,24,39,0.8);
          letter-spacing: 0.04em;
          /* TASK00485 — KHÔNG đặt writing-mode ở đây nữa: vertical-rl trên chính flex container đổi
             luôn block-axis (flex-direction:column chạy theo hướng lạ dưới vertical-rl), khiến logo
             lệch ra giữa chữ thay vì nằm trên. Container giữ writing-mode ngang bình thường → flex
             column xếp icon-trên/label-dưới đúng ý; chữ dọc chỉ scope riêng vào [data-part="label"]. */
          transition: box-shadow 150ms ease, transform 150ms ease, background 150ms ease;
        }

        #${floatButtonId}:hover {
          background: #f9fafb;
          box-shadow: -4px 0 18px rgba(0,0,0,0.26);
        }

        #${floatButtonId} img {
          width: 14px;
          height: 14px;
          border-radius: 3px;
          display: block;
          flex-shrink: 0;
        }

        #${floatButtonId} [data-part="label"] {
          writing-mode: vertical-rl;
          text-orientation: mixed;
        }

        #${modalBackdropId} {
          position: fixed;
          inset: 0;
          background: rgba(0,0,0,0.12);
          z-index: 2147483646;
          display: none;
        }

        #${modalBackdropId}[data-open="1"] {
          display: block;
        }

        #${modalId} {
          position: fixed;
          right: 0;
          top: 0;
          width: min(60vw, 860px);
          min-width: 320px;
          height: 100vh;
          background: #f0f1f3;
          border: none;
          border-radius: 0;
          box-shadow: -12px 0 40px rgba(0,0,0,0.14);
          color: #111827;
          z-index: 2147483647;
          display: none;
          flex-direction: column;
          overflow: hidden;
          font-family: system-ui, -apple-system, BlinkMacSystemFont, sans-serif;
          font-size: 14px;
        }

        #${modalId}[data-open="1"] {
          display: flex;
        }

        /* Panel nền xám #f0f1f3 (dùng làm canvas cho card trắng nổi lên ở Level 1).
           Level 2 đã bỏ khung "card" (nằm trực tiếp trên nền) nên phải đổi cả nền panel sang trắng
           khi đang ở Level 2, nếu không nội dung lộ nền xám phía sau nhìn xấu. */
        #${modalId}[data-view="detail"] {
          background: #fff;
        }

        /* Floating mode: panel nổi tự do kéo-thả, không dính mép phải, không đẩy nội dung trang.
           Specificity id+[data-floating] cao hơn cả rule desktop dock trong @media (min-width:768px) bên dưới
           (chỉ có id) nên tự thắng, không cần !important. — TASK00485 */
        #${modalId}[data-floating="1"] {
          right: auto;
          left: var(--dm-panel-x, 80px);
          top: var(--dm-panel-y, 80px);
          height: 640px; /* TASK00525: 620 → 640 — đủ chỗ hết scroll màn Try Navi+ Menus */
          max-height: calc(100vh - 40px);
          /* Bằng đúng width panel pin-right (--dm-panel-w, cùng var resizer dùng) — Khôi muốn floating nhỏ hơn 400px cũ */
          width: min(var(--dm-panel-w, 300px), calc(100vw - 40px));
          min-width: 0;
          border-left: none;
          border-radius: 14px;
          box-shadow: 0 20px 60px rgba(0,0,0,0.32), 0 0 0 1px rgba(17,24,39,0.06);
        }
        /* touch-action:none bắt buộc — floating giờ là default cho MỌI user chưa từng chọn view mode
           (trước đây opt-in hiếm khi dùng). Thiếu rule này, kéo header bằng ngón tay trên iOS/Android
           dễ bị trình duyệt hiểu nhầm thành cuộn trang, huỷ giữa chừng bằng pointercancel — panel giật/gãy. */
        #${modalId}[data-floating="1"] [data-part="header"] { cursor: grab; padding-top: 16px; position: relative; touch-action: none; }
        #${modalId}[data-floating="1"] [data-part="header"]:active { cursor: grabbing; }
        #${modalId}[data-floating="1"] [data-part="resizer"] { display: none; }
        /* Tín hiệu trực quan "kéo được": 3 chấm giữa-trên header, chỉ hiện khi floating */
        #${modalId} [data-part="drag-handle"] { display: none; }
        #${modalId}[data-floating="1"] [data-part="drag-handle"] {
          display: flex;
          align-items: center;
          gap: 3px;
          position: absolute;
          top: 5px;
          left: 50%;
          transform: translateX(-50%);
        }
        #${modalId}[data-floating="1"] [data-part="drag-handle"] span {
          width: 4px;
          height: 4px;
          border-radius: 50%;
          background: rgba(17,24,39,0.30);
        }
        /* Desktop dock (@media bên dưới) đẩy body bằng padding-right — floating không chiếm chỗ cố định nên bỏ đẩy */
        body:has(#${modalId}[data-open="1"][data-floating="1"]) {
          padding-right: 0 !important;
        }

        #${modalId} [data-part="header"] {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 12px;
          padding: 10px 14px;
          background: #fff;
          border-bottom: 1px solid rgba(0,0,0,0.07);
          flex-shrink: 0;
        }

        #${modalId} [data-part="brand"] {
          display: flex;
          align-items: center;
          gap: 8px;
          min-width: 0;
        }
        /* Ẩn logo+title khi vào Level 2, nhường chỗ cho detail-brand (back + tên feature) */
        #${modalId}[data-view="detail"] [data-part="brand"] {
          display: none;
        }

        #${modalId} [data-part="brand"] img {
          width: 22px;
          height: 22px;
          border-radius: 4px;
          display: block;
        }

        #${modalId} [data-part="title"] {
          font-size: 14px;
          font-weight: 700;
          letter-spacing: 0.01em;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
          color: #111827;
        }

        #${modalId} [data-part="header-right"] {
          display: flex;
          align-items: center;
          gap: 8px;
          flex-shrink: 0;
        }

        #${modalId} [data-part="status"] {
          font-size: 11px;
          font-weight: 600;
          padding: 2px 8px;
          border-radius: 20px;
          border: 1px solid rgba(34,197,94,0.30);
          background: rgba(34,197,94,0.1);
          color: rgba(21,128,61,0.9);
          white-space: nowrap;
          display: none;
        }

#${modalId} [data-part="close"] {
          appearance: none;
          border: 1px solid rgba(17,24,39,0.14);
          background: transparent;
          color: rgba(17,24,39,0.78);
          border-radius: 8px;
          width: 34px;
          height: 30px;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          font-size: 22px;
          font-weight: 500;
          cursor: pointer;
          white-space: nowrap;
          line-height: 1;
          transition: background 100ms, color 100ms;
        }
        #${modalId} [data-part="close"]:hover {
          background: rgba(17,24,39,0.06);
          color: #111827;
        }

        /* Nút "..." (view mode) + dropdown Minimize/Floating/Pin to right — TASK00485 */
        #${modalId} [data-part="viewmode-wrap"] {
          position: relative;
        }
        #${modalId} [data-part="viewmode"] {
          appearance: none;
          border: 1px solid rgba(17,24,39,0.14);
          background: transparent;
          color: rgba(17,24,39,0.78);
          border-radius: 8px;
          width: 34px;
          height: 30px;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          font-size: 16px;
          cursor: pointer;
          transition: background 100ms, color 100ms;
        }
        #${modalId} [data-part="viewmode"]:hover {
          background: rgba(17,24,39,0.06);
          color: #111827;
        }
        /* Neo right:0 (không phải left:0) — mở lệch về phía tiêu đề để không bị #dm_modal { overflow:hidden } cắt mất khi panel ở min-width 320px */
        #${modalId} [data-part="viewmode-menu"] {
          display: none;
          position: absolute;
          top: calc(100% + 6px);
          right: 0;
          min-width: 172px;
          background: #fff;
          border: 1px solid rgba(17,24,39,0.14);
          border-radius: 10px;
          box-shadow: 0 10px 28px rgba(17,24,39,0.16);
          padding: 4px;
          z-index: 5;
        }
        #${modalId} [data-part="viewmode-menu"][data-open="1"] {
          display: block;
        }
        #${modalId} [data-part="viewmode-menu"] button {
          appearance: none;
          border: none;
          background: transparent;
          width: 100%;
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 7px 8px;
          border-radius: 6px;
          font-size: 12.5px;
          font-weight: 500;
          color: #111827;
          cursor: pointer;
          text-align: left;
        }
        #${modalId} [data-part="viewmode-menu"] button:hover {
          background: rgba(17,24,39,0.06);
        }
        #${modalId} [data-part="viewmode-menu"] button [data-part="check"] {
          margin-left: auto;
          display: none;
        }
        /* Tách nút "Turn off debug mode" khỏi 3 nút view mode phía trên bằng đường kẻ */
        #${modalId} [data-part="viewmode-menu-divider"] {
          height: 1px;
          margin: 4px 2px;
          background: rgba(17,24,39,0.08);
        }

        #${modalId} [data-part="body"] {
          padding: 0;
          flex-direction: column;
          gap: 10px;
          line-height: 1.5;
          overflow-y: auto;
          flex: 1;
        }

        #${modalId} a { color: #2563eb; text-decoration: none; }
        #${modalId} a:hover { text-decoration: underline; }

        #${modalId} code {
          font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
          font-size: 11.5px;
          background: rgba(17,24,39,0.07);
          padding: 1px 5px;
          border-radius: 5px;
          color: rgba(17,24,39,0.88);
        }

        #${modalId} kbd {
          font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
          font-size: 11px;
          background: rgba(17,24,39,0.07);
          border: 1px solid rgba(17,24,39,0.16);
          border-bottom-width: 2px;
          padding: 1px 5px;
          border-radius: 4px;
          color: rgba(17,24,39,0.85);
        }

        /* Bỏ khung "card" ngoài cùng (viền/bo góc/đổ bóng/nền tách biệt) theo yêu cầu
           Khôi: nội dung Level 2 nằm trực tiếp trên nền trắng panel. Card-header/card-body bên dưới
           (chia khu title vs nội dung) vẫn giữ nguyên — chỉ bỏ khung ngoài, không đụng cấu trúc con. */
        #${modalId} [data-part="find-css-card"],
        #${modalId} [data-part="find-menu-card"] {
          margin-top: 0;
        }

        /* Header (title + nút) căn lề trái/phải/trên khớp với body (đã bỏ padding
           riêng) + bỏ nền xám quanh — áp dụng chung cho cả "Navi+ Inspect" và "AI Design"
           (2 màn dùng chung cấu trúc header/body) */
        #${modalId} [data-part="find-css-card-header"],
        #${modalId} [data-part="find-menu-card-header"] {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 10px;
          padding: 0 0 8px;
          border-bottom: 1px solid rgba(0,0,0,0.05);
          background: transparent;
        }

        /* Card label style (uppercase tiny label) — find-menu-card-title đã bỏ (trùng title header) */
        #${modalId} [data-part="find-css-card-title"] {
          font-size: 11px; /* Khôi: đồng bộ size nhãn eyebrow với OUTPUT/PROMPT bar bên "AI Design" */
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.06em;
          color: rgba(17,24,39,0.65);
        }

        #${modalId} [data-part="find-css-card-title"] [data-state="on"] { color: #16a34a; }
        #${modalId} [data-part="find-css-card-title"] [data-state="off"] { color: rgba(17,24,39,0.5); }

        /* Inspector toggle */
        #${modalId} [data-part="find-css-toggle-btn"] {
          appearance: none;
          border: 1px solid rgba(17,24,39,0.14);
          background: transparent;
          color: rgba(17,24,39,0.78);
          border-radius: 6px;
          padding: 3px 10px;
          font-size: 12px;
          font-weight: 600;
          cursor: pointer;
          white-space: nowrap;
          transition: background 100ms, color 100ms;
        }
        #${modalId} [data-part="find-css-toggle-btn"]:hover {
          background: rgba(17,24,39,0.06);
          color: #111827;
        }

        #${modalId} [data-part="find-css-card-body"] {
          /* Bỏ padding riêng (tốn chỗ) — detail-content ngoài đã có padding 14px */
          font-size: 12.5px; /* Khôi: giảm font, đồng bộ size body với "AI Design" (find-menu-step-desc) */
          line-height: 1.55;
          color: rgba(17,24,39,0.78);
        }

        /* TASK00256. Begin — Level 1 home cards + Level 2 detail nav + Find default menu */

        /* ── Level 1: Home screen ── */
        #${modalId} [data-part="home"] {
          padding: 12px 14px 14px;
          display: flex;
          flex-direction: column;
          gap: 8px;
        }
        #${modalId} [data-part="feature-card"] {
          width: 100%;
          background: #fff;
          border: 1px solid rgba(0,0,0,0.08);
          border-radius: 10px;
          overflow: hidden;
          cursor: pointer;
          text-align: left;
          appearance: none;
          font-family: inherit;
          padding: 10px 12px;
          display: flex;
          flex-direction: row;
          align-items: flex-start; /* TASK00525: icon (và badge) căn TRÊN theo khối text, không căn giữa dọc */
          gap: 10px;
          transition: box-shadow 120ms;
        }
        #${modalId} [data-part="feature-card"]:hover {
          box-shadow: 0 2px 10px rgba(0,0,0,0.1);
        }
        #${modalId} [data-part="feature-card-img"] {
          width: 38px;
          height: 38px;
          min-width: 38px;
          border-radius: 9px;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }
        #${modalId} [data-part="feature-card-info"] {
          flex: 1;
          min-width: 0;
        }
        #${modalId} [data-part="feature-card-name"] {
          font-size: 13px;
          font-weight: 700;
          color: #111827;
          margin-bottom: 2px;
        }
        #${modalId} [data-part="feature-card-desc"] {
          font-size: 11.5px;
          color: rgba(17,24,39,0.55);
          line-height: 1.45;
        }
        /* Card "Try Navi+ menus" báo trạng thái demo ngay trên card — TASK00485.
           TASK00525: badge LUÔN hiển thị cả 2 trạng thái — OFF xám trung tính (mặc định), ON xanh. */
        #${modalId} [data-part="feature-card-live-badge"] {
          display: inline-flex;
          align-items: center;
          gap: 3px;
          padding: 3px 8px;
          border-radius: 999px;
          background: rgba(17,24,39,0.07);
          color: rgba(17,24,39,0.5);
          font-size: 10px;
          font-weight: 700;
          letter-spacing: 0.03em;
          flex-shrink: 0;
          white-space: nowrap;
        }
        #${modalId} [data-part="feature-card"][data-live="on"] {
          border-color: rgba(22,163,74,0.45);
          background: rgba(22,163,74,0.06);
        }
        #${modalId} [data-part="feature-card"][data-live="on"] [data-part="feature-card-live-badge"] {
          background: #16a34a;
          color: #fff;
        }
        /* Turn off — dòng nhỏ dưới cùng home (TASK00525: link "How to test on mobile" cũ đã thay
           bằng footer sẫm "Test website on mobile" pin đáy panel) */
        #${modalId} [data-part="footer-links"] {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 14px;
          width: 100%;
          padding: 6px 0 2px;
          margin-top: 2px;
        }
        #${modalId} [data-part="home"] [data-part="turnoff"] {
          border: none;
          background: transparent;
          color: rgba(17,24,39,0.38);
          font-size: 12px;
          cursor: pointer;
          padding: 0;
          text-align: center;
          white-space: nowrap;
          border-radius: 0;
        }
        #${modalId} [data-part="home"] [data-part="turnoff"]:hover {
          color: #dc2626;
          background: transparent;
        }

        /* TASK00525: footer sẫm "Test website on mobile" pin đáy panel + bottom-sheet trượt lên.
           Footer là con trực tiếp của modal (flex column, body flex:1) → tự dính đáy, hiện xuyên suốt
           home lẫn detail. Sheet + overlay absolute trong modal (position:fixed + overflow:hidden)
           → trượt lên "giống popup" nhưng gói gọn trong panel, không đụng layout site khách. */
        #${modalId} [data-part="mobile-footer-bar"] {
          flex-shrink: 0;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 7px;
          width: 100%;
          padding: 11px 14px;
          border: none;
          /* Khôi 21/09: nền trắng + viền trên, thôi tô sẫm — nổi bật quá so với nội dung panel */
          border-top: 1px solid rgba(0,0,0,0.08);
          background: #fff;
          color: #111827;
          font-size: 12.5px;
          font-weight: 650;
          letter-spacing: 0.02em;
          cursor: pointer;
          white-space: nowrap;
        }
        #${modalId} [data-part="mobile-footer-bar"]:hover {
          background: #f3f4f6;
        }
        #${modalId} [data-part="mobile-sheet-overlay"] {
          position: absolute;
          inset: 0;
          background: rgba(17,24,39,0.35);
          opacity: 0;
          pointer-events: none;
          transition: opacity 200ms ease;
          z-index: 40;
        }
        /* TASK00525: trạng thái mở chuyển từ attr trên modal (data-mobile-sheet) sang data-open trên
           CHÍNH element — cho phép nhiều sheet cùng tồn tại (footer "Test website on mobile" + popup
           "Sent to Navi+") mở/đóng độc lập, không bật nhầm nhau. */
        #${modalId} [data-part="mobile-sheet-overlay"][data-open="1"] {
          opacity: 1;
          pointer-events: auto;
        }
        #${modalId} [data-part="mobile-sheet"] {
          position: absolute;
          left: 0;
          right: 0;
          bottom: 0;
          max-height: 78%;
          display: flex;
          flex-direction: column;
          background: #fff;
          border-radius: 14px 14px 0 0;
          box-shadow: 0 -10px 30px rgba(17,24,39,0.25);
          transform: translateY(105%);
          transition: transform 240ms cubic-bezier(0.32, 0.72, 0.33, 1);
          z-index: 41;
        }
        #${modalId} [data-part="mobile-sheet"][data-open="1"] {
          transform: translateY(0);
        }
        #${modalId} [data-part="mobile-sheet-head"] {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 12px 14px 8px;
          flex-shrink: 0;
        }
        #${modalId} [data-part="mobile-sheet-title"] {
          font-size: 13.5px;
          font-weight: 700;
          color: #111827;
        }
        #${modalId} [data-part="mobile-sheet-close"] {
          appearance: none;
          border: none;
          background: transparent;
          font-size: 20px;
          line-height: 1;
          color: rgba(17,24,39,0.5);
          cursor: pointer;
          padding: 2px 4px;
        }
        #${modalId} [data-part="mobile-sheet-close"]:hover {
          color: #111827;
        }
        #${modalId} [data-part="mobile-sheet-body"] {
          padding: 0 14px 14px;
          overflow-y: auto;
          font-size: 12.5px;
          line-height: 1.55;
          color: #374151;
        }

        /* ── Level 2: Detail screen ── */
        #${modalId} [data-part="detail"] {
          display: none;
        }
        /* Gộp header 2 lớp: detail-brand chiếm chỗ brand trong header chính khi
           data-view="detail" (xem toggle brand/detail-brand ở block [data-part="brand"] phía trên) */
        #${modalId} [data-part="detail-brand"] {
          display: none;
          align-items: center;
          gap: 2px;
          min-width: 0;
        }
        #${modalId}[data-view="detail"] [data-part="detail-brand"] {
          display: flex;
        }
        #${modalId} [data-part="back-btn"] {
          appearance: none;
          border: none;
          background: transparent;
          color: #2563eb;
          font-size: 14px;
          font-weight: 700;
          cursor: pointer;
          display: inline-flex;
          align-items: center;
          gap: 1px;
          padding: 3px 0;
          min-width: 0;
          overflow: hidden;
        }
        #${modalId} [data-part="back-btn"] i { font-size: 18px; flex-shrink: 0; }
        #${modalId} [data-part="back-label"] {
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
          color: #111827; /* TASK00525: title level 2 đen — chỉ mũi tên "<" quay về giữ xanh (kế thừa từ back-btn) */
        }
        /* TASK00485 — tag "● ON" nhỏ cạnh title, chỉ hiện khi đang xem trang "Try Navi+ menus" và demo đang bật */
        #${modalId} [data-part="back-live-badge"] {
          display: none;
          align-items: center;
          flex-shrink: 0;
          margin-left: 6px;
          padding: 2px 8px;
          border-radius: 999px;
          background: #16a34a;
          color: #fff;
          font-size: 10px;
          font-weight: 700;
          letter-spacing: 0.03em;
          white-space: nowrap;
          vertical-align: middle;
        }
        #${modalId} [data-part="detail-content"] {
          padding: 14px;
        }

        /* ── Thanh 3 preset size — nằm trong header (chỉ hiện desktop) ── */
        #${modalId} [data-part="sizebar"] {
          display: none;
          gap: 4px;
        }
        #${modalId} [data-part="size-btn"] {
          appearance: none;
          border: 1px solid rgba(17,24,39,0.14);
          background: #fff;
          color: rgba(17,24,39,0.55);
          border-radius: 7px;
          width: 34px;
          height: 28px;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          font-size: 15px;
          cursor: pointer;
          transition: background 120ms, color 120ms, border-color 120ms;
        }
        #${modalId} [data-part="size-btn"]:hover { color: #111827; background: rgba(17,24,39,0.04); }
        #${modalId} [data-part="size-btn"][data-active] {
          border-color: #111827;
          color: #111827;
          background: rgba(17,24,39,0.06);
        }

        #${modalId} [data-part="find-default-card"] {
          overflow: hidden;
        }
        #${modalId} [data-part="find-default-fn"] {
          padding: 12px 14px;
          border-bottom: 1px solid rgba(0,0,0,0.05);
        }
        #${modalId} [data-part="find-default-fn"]:last-child { border-bottom: none; }
        #${modalId} [data-part="find-default-fn-title"] {
          font-size: 14px;
          font-weight: 700;
          color: rgba(17,24,39,0.85);
          margin-bottom: 2px;
        }
        #${modalId} [data-part="find-default-fn-desc"] {
          font-size: 12.5px;
          color: rgba(17,24,39,0.6);
          line-height: 1.5;
          margin-bottom: 8px;
        }
        #${modalId} [data-part="find-default-btn"] {
          appearance: none;
          border: 1px solid #111827;
          background: #111827;
          color: #fff;
          border-radius: 7px;
          padding: 6px 14px;
          font-size: 13px;
          font-weight: 600;
          cursor: pointer;
        }
        #${modalId} [data-part="find-default-btn"]:hover { background: #000; }
        #${modalId} [data-part="find-default-result"] {
          display: none;
          margin-top: 10px;
          padding: 8px 10px;
          background: rgba(17,24,39,0.04);
          border: 1px solid rgba(17,24,39,0.1);
          border-radius: 8px;
          font-size: 12.5px;
          line-height: 1.5;
        }
        #${modalId} [data-part="find-default-result"] code {
          display: block;
          margin: 4px 0 8px;
          word-break: break-all;
          white-space: normal;
        }
        #${modalId} [data-part="find-default-result-actions"] { display: flex; gap: 6px; }
        #${modalId} [data-part="find-default-result-actions"] button {
          appearance: none;
          border: 1px solid rgba(17,24,39,0.14);
          background: #fff;
          border-radius: 6px;
          padding: 3px 10px;
          font-size: 12px;
          font-weight: 600;
          cursor: pointer;
        }
        /* TASK00256. End */

        /* Scan button — Khôi: title trùng đã bỏ, nút Scan giờ là phần tử duy nhất trong header → phóng
           to full-width, nổi bật (cùng kiểu nút chính find-default-btn: nền đen đặc) */
        #${modalId} [data-part="find-menu-scan-btn"] {
          appearance: none;
          width: 100%;
          border: 1px solid #111827;
          background: #111827;
          color: #fff;
          border-radius: 7px;
          padding: 8px 14px;
          font-size: 13px;
          font-weight: 600;
          cursor: pointer;
          white-space: nowrap;
          transition: background 100ms, color 100ms;
        }
        #${modalId} [data-part="find-menu-scan-btn"]:hover {
          background: #000;
        }
        #${modalId} [data-part="find-menu-scan-btn"]:disabled { opacity: 0.4; cursor: default; }

        #${modalId} [data-part="find-menu-card-body"] {
          padding: 0;
        }

        /* Steps */
        #${modalId} [data-part="find-menu-step"] {
          /* Khôi: tiết kiệm diện tích tối đa — bỏ padding trái/phải riêng (đã có padding 14px của
             detail-content ngoài, cộng thêm là dư thừa), chỉ giữ padding dọc gọn cho dễ đọc.
             TASK00525: bỏ border-bottom — là 1 trong 2 line thừa ngay trên hàng nút Send. */
          padding: 10px 0;
        }
        #${modalId} [data-part="find-menu-step"]:last-child {
          border-bottom: none;
        }
        #${modalId} [data-part="find-menu-step"][data-step="2"] {
          background: rgba(17,24,39,0.02);
          border-top: 1px solid rgba(17,24,39,0.06);
          border-bottom: 1px solid rgba(17,24,39,0.06);
        }
        #${modalId} [data-part="find-menu-step"][data-step="3"] {
          background: rgba(17,24,39,0.02);
        }
        #${modalId} [data-part="find-menu-step-header"] {
          display: flex;
          align-items: center;
          gap: 9px;
          margin-bottom: 7px;
        }
        #${modalId} [data-part="find-menu-step-badge"] {
          display: inline-flex;
          align-items: center; justify-content: center;
          width: 22px; height: 22px;
          border-radius: 50%;
          background: rgba(17,24,39,0.09);
          color: rgba(17,24,39,0.55);
          font-size: 11px; font-weight: 800;
          flex-shrink: 0;
        }
        #${modalId} [data-part="find-menu-step-badge"][data-active] {
          background: #111827;
          color: #fff;
        }
        #${modalId} [data-part="find-menu-step-title"] {
          font-size: 13px;
          font-weight: 700;
          color: rgba(17,24,39,0.85);
          letter-spacing: 0;
          text-transform: none;
        }
        #${modalId} [data-part="find-menu-step-desc"] {
          font-size: 12.5px;
          line-height: 1.6;
          color: rgba(17,24,39,0.62);
          margin-bottom: 8px;
        }
        #${modalId} [data-part="find-menu-step3-list"] {
          margin: 0;
          padding-left: 20px;
        }
        #${modalId} [data-part="find-menu-step3-list"] li {
          margin-bottom: 5px;
        }
        #${modalId} [data-part="find-menu-step3-list"] li:last-child {
          margin-bottom: 0;
        }
        #${modalId} [data-part="find-menu-empty"] {
          color: rgba(17,24,39,0.55);
          font-size: 12.5px;
          padding: 10px 0 4px;
          text-align: center;
        }

        /* Tree */
        #${modalId} .dm-tree-node { margin: 1px 0; }
        #${modalId} .dm-tree-row {
          display: flex;
          align-items: center;
          gap: 5px;
          padding: 4px 5px;
          border-radius: 6px;
          cursor: pointer;
        }
        #${modalId} .dm-tree-row:hover { background: rgba(17,24,39,0.05); }
        #${modalId} .dm-tree-toggle {
          width: 16px; height: 16px; flex-shrink: 0;
          display: flex; align-items: center; justify-content: center;
          font-size: 9px; color: rgba(17,24,39,0.55);
          cursor: pointer; border-radius: 3px; user-select: none;
        }
        #${modalId} .dm-tree-toggle:hover { background: rgba(17,24,39,0.08); color: rgba(17,24,39,0.8); }
        #${modalId} .dm-tree-toggle-spacer { width: 16px; flex-shrink: 0; }
        #${modalId} .dm-tree-selector {
          flex: 1;
          font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
          font-size: 12.5px;
          overflow: hidden; text-overflow: ellipsis; white-space: nowrap;
          color: rgba(17,24,39,0.85);
        }
        #${modalId} .dm-tree-count {
          font-size: 11px; color: rgba(17,24,39,0.52);
          white-space: nowrap; flex-shrink: 0;
        }
        #${modalId} .dm-tree-row.dm-active {
          background: rgba(17,24,39,0.06);
          outline: 1px solid rgba(17,24,39,0.25);
        }
        #${modalId} .dm-tree-row.dm-active .dm-tree-selector {
          color: #111827; font-weight: 600;
        }
        #${modalId} .dm-tree-view-badge {
          font-size: 11px; font-weight: 600;
          color: rgba(17,24,39,0.78);
          border: 1px solid rgba(17,24,39,0.2);
          background: rgba(17,24,39,0.05);
          border-radius: 5px;
          padding: 1px 7px;
          white-space: nowrap; flex-shrink: 0;
          transition: background 100ms, color 100ms;
        }
        #${modalId} .dm-tree-row:hover .dm-tree-view-badge {
          background: rgba(17,24,39,0.1);
        }
        #${modalId} .dm-tree-row.dm-active .dm-tree-view-badge {
          color: #15803d;
          border-color: rgba(22,163,74,0.4);
          background: rgba(22,163,74,0.1);
        }

        /* checkbox multi-select menu + hàng "GỬI VỀ NAVI+" */
        #${modalId} .dm-tree-checkbox {
          width: 14px; height: 14px; flex-shrink: 0;
          margin: 0 1px 0 0;
          cursor: pointer;
        }
        #${modalId} [data-part="find-menu-send-row"] {
          display: flex;
          align-items: center;
          flex-wrap: wrap; /* TASK00525: nút full-width — status lỗi (nếu có) rơi xuống dòng dưới */
          gap: 10px;
          /* TASK00525: bỏ border-top (line thừa thứ 2) + bỏ padding trái/phải 14px — nút Send
             align trái thẳng hàng với danh sách menu phía trên (steps đã padding trái 0) */
          padding: 10px 0 14px;
        }
        #${modalId} [data-part="find-menu-send-btn"] {
          appearance: none;
          border: none;
          background: #111827;
          color: #fff;
          border-radius: 7px;
          padding: 7px 14px;
          font-size: 12.5px;
          font-weight: 700;
          cursor: pointer;
          white-space: nowrap;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          width: 100%; /* TASK00525: full-width theo chuẩn nút chính admin */
        }
        #${modalId} [data-part="find-menu-send-btn"]:hover { background: #000; }
        #${modalId} [data-part="find-menu-send-btn"]:disabled { opacity: 0.6; cursor: default; }
        #${modalId} [data-part="find-menu-send-status"] {
          font-size: 12px;
          color: rgba(17,24,39,0.55);
        }
        #${modalId} [data-part="find-menu-send-status"][data-state="ok"] { color: #15803d; }
        #${modalId} [data-part="find-menu-send-status"][data-state="warn"] { color: #b45309; }
        #${modalId} [data-part="find-menu-send-status"][data-state="error"] { color: #dc2626; }

        /* ghim Structure preview + hàng nút gửi ở đáy panel: position:sticky
           bottom:0 bên trong scroller thật #modalId [data-part="body"] (overflow-y:auto, xem rule
           gốc). menuResultsDiv (danh sách menu quét được, nằm trong menuStep1 phía trên) cuộn tự do;
           khối này dính đáy khi cuộn xuống. z-index:1 để nổi trên nội dung cuộn phía trên nó. */
        #${modalId} [data-part="find-menu-pinned"] {
          position: sticky;
          bottom: 0;
          background: #fff;
          /* TASK00525: bỏ border-top (line trên hàng nút Send) theo yêu cầu Khôi */
          padding-top: 8px;
          z-index: 1;
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        /* TASK00525: màn scan lấp ĐÚNG chiều cao panel bằng flex (hết hẳn scroll ngoài,
           không phụ thuộc cap px cố định): chuỗi flex body → detail → detail-content → find-menu-card
           → card-body → step → output; tree flex:1 tự co giãn theo chỗ còn lại, chỉ scroll nội bộ.
           !important chỉ để thắng inline style.display do openFeature set. Kích hoạt duy nhất khi
           modal[data-feature="scan"] (openFeature set/xoá) — các màn khác không bị đụng. */
        #${modalId}[data-feature="scan"] [data-part="body"] {
          display: flex; /* flex-direction:column đã khai báo ở rule [data-part="body"] gốc */
        }
        #${modalId}[data-feature="scan"] [data-part="detail"] {
          display: flex !important;
          flex-direction: column;
          flex: 1 1 auto;
          min-height: 0;
        }
        #${modalId}[data-feature="scan"] [data-part="detail-content"] {
          display: flex;
          flex-direction: column;
          flex: 1 1 auto;
          min-height: 0;
          padding-bottom: 8px; /* TASK00525: 14 → 8 — kéo nút Send sát footer hơn (cùng send-row bỏ padding-bottom) */
        }
        #${modalId}[data-feature="scan"] [data-part="find-menu-card"] {
          display: flex !important;
          flex-direction: column;
          flex: 1 1 auto;
          min-height: 0;
        }
        #${modalId}[data-feature="scan"] [data-part="find-menu-card-body"] {
          display: flex;
          flex-direction: column;
          flex: 1 1 auto;
          min-height: 0;
        }
        #${modalId}[data-feature="scan"] [data-part="find-menu-step"] {
          display: flex;
          flex-direction: column;
          flex: 1 1 auto;
          min-height: 0;
        }
        #${modalId}[data-feature="scan"] [data-part="find-menu-results"] {
          flex-shrink: 0;
        }
        #${modalId}[data-feature="scan"] [data-part="find-menu-output"][data-show="1"] {
          display: flex;
          flex-direction: column;
          flex: 1 1 auto;
          min-height: 0;
        }
        #${modalId}[data-feature="scan"] [data-part="find-menu-output-tree"] {
          max-height: none;
          flex: 1 1 auto;
          min-height: 0;
        }
        #${modalId}[data-feature="scan"] [data-part="find-menu-empty"] {
          flex: 1 1 auto; /* lấp toàn bộ chỗ còn lại của panel (min-height 250 base vẫn giữ sàn) */
        }
        #${modalId}[data-feature="scan"] [data-part="find-menu-send-row"] {
          padding-bottom: 0; /* TASK00525: 14 → 0 — cùng detail-content padding-bottom 8, nút Send xuống ~20px */
        }

        /* Output area */
        #${modalId} [data-part="find-menu-output"] {
          display: none; /* TASK00525: ẩn/hiện qua data-show thay inline style (JS chỉ toggle dataset) */
          margin-top: 8px;
          border: 1px solid rgba(0,0,0,0.07);
          border-radius: 8px;
          overflow: hidden;
          background: #fff;
        }
        #${modalId} [data-part="find-menu-output"][data-show="1"] {
          display: block;
        }
        /* TASK00525 — empty state khung STRUCTURE (khi chưa bấm View menu nào); tự ẩn khi output hiện */
        #${modalId} [data-part="find-menu-empty"] {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: 6px;
          margin-top: 8px;
          padding: 18px 12px;
          min-height: 250px; /* TASK00525: to bằng đúng khung STRUCTURE lúc max (tree cap 250) */
          box-sizing: border-box;
          border: 1px dashed rgba(17,24,39,0.15);
          border-radius: 8px;
          color: rgba(17,24,39,0.45);
          font-size: 12px;
          text-align: center;
        }
        #${modalId} [data-part="find-menu-output"][data-show="1"] ~ [data-part="find-menu-empty"] {
          display: none;
        }
        #${modalId} [data-part="find-menu-output-bar"] {
          display: flex; align-items: center; justify-content: space-between;
          padding: 5px 10px;
          background: rgba(248,249,250,0.9);
          border-bottom: 1px solid rgba(0,0,0,0.06);
          font-size: 11px; color: rgba(17,24,39,0.62);
          font-weight: 700; letter-spacing: 0.05em; text-transform: uppercase;
        }
        #${modalId} [data-part="find-menu-copy-output"] {
          appearance: none;
          border: 1px solid rgba(17,24,39,0.14);
          background: transparent;
          color: rgba(17,24,39,0.78);
          border-radius: 5px;
          padding: 2px 9px;
          font-size: 12px; font-weight: 600;
          cursor: pointer; white-space: nowrap;
          text-transform: none; letter-spacing: 0;
          transition: background 100ms, color 100ms;
        }
        #${modalId} [data-part="find-menu-copy-output"]:hover { background: rgba(17,24,39,0.06); color: #111827; }
        #${modalId} [data-part="find-menu-copy-output"].dm-copied {
          border-color: rgba(22,163,74,0.35);
          background: rgba(22,163,74,0.08);
          color: #15803d;
        }
        /* TASK00516 — Khôi: bỏ scroll "mức ngoài" của scan. Cap chiều cao danh sách menu quét được +
           cuộn NỘI BỘ (overscroll-behavior:contain) → list + preview đều tự cuộn trong ô, card scan
           không tràn làm body panel phải cuộn. */
        #${modalId} [data-part="find-menu-results"] {
          max-height: 140px; /* TASK00525: 230 → 140 — tổng nội dung scan vừa khít floating panel 640px, hết scroll ngoài */
          overflow-y: auto;
          overscroll-behavior: contain;
        }
        /* TASK00516 (vòng 3) — structure preview dạng TREE (thay textarea). Tự xuống dòng, chỉ cuộn
           DỌC, KHÔNG scroll ngang; overscroll-behavior:contain để cuộn hết tree KHÔNG lan ra cuộn panel. */
        #${modalId} [data-part="find-menu-output-tree"] {
          display: block; width: 100%; box-sizing: border-box;
          padding: 6px 0;
          font-size: 12.5px; line-height: 1.5;
          color: rgba(17,24,39,0.88);
          background: #fff;
          max-height: 250px; /* TASK00525: 280 → 190 hụt quá (nút Send cách xa footer) → chốt 250; kết hợp results 140 tổng vẫn vừa panel 640px */
          overflow-y: auto; overflow-x: hidden;
          overscroll-behavior: contain;
        }
        #${modalId} .dm-struct-item {
          display: flex; flex-wrap: wrap; align-items: baseline;
          gap: 2px 8px;
          padding: 3px 12px 3px 0;
          border-bottom: 1px solid rgba(17,24,39,0.04);
        }
        #${modalId} .dm-struct-name {
          font-weight: 500; color: rgba(17,24,39,0.92);
          overflow-wrap: anywhere; word-break: break-word;
        }
        #${modalId} .dm-struct-url {
          font-size: 11.5px; color: rgba(17,24,39,0.45);
          font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
          overflow-wrap: anywhere; word-break: break-word;
        }
        #${modalId} .dm-struct-empty { padding: 8px 12px; color: rgba(17,24,39,0.45); font-style: italic; }

        /* Prompt area — Khôi: bỏ tông indigo/blue, dùng đen (đậm hơn output box 1 chút vì đây là kết
           quả cuối cùng cần nổi bật, border 2px thay vì 1px, không cần thêm màu) */
        #${modalId} [data-part="find-menu-prompt"] {
          margin-top: 8px;
          border: 2px solid #111827;
          border-radius: 8px;
          overflow: hidden;
          background: #fff;
        }
        #${modalId} [data-part="find-menu-prompt-bar"] {
          display: flex; align-items: center; justify-content: space-between;
          padding: 5px 10px;
          background: rgba(248,249,250,0.9);
          border-bottom: 1px solid rgba(0,0,0,0.06);
          font-size: 11px; color: rgba(17,24,39,0.62);
          font-weight: 700; letter-spacing: 0.05em; text-transform: uppercase;
        }
        #${modalId} [data-part="find-menu-copy-prompt"] {
          appearance: none;
          border: 1px solid rgba(17,24,39,0.14);
          background: transparent;
          color: rgba(17,24,39,0.78);
          border-radius: 5px;
          padding: 2px 9px;
          font-size: 12px; font-weight: 600;
          cursor: pointer; white-space: nowrap;
          text-transform: none; letter-spacing: 0;
          transition: background 100ms, color 100ms;
        }
        #${modalId} [data-part="find-menu-copy-prompt"]:hover { background: rgba(17,24,39,0.06); color: #111827; }
        #${modalId} [data-part="find-menu-copy-prompt"].dm-copied {
          border-color: rgba(22,163,74,0.35);
          background: rgba(22,163,74,0.08);
          color: #15803d;
        }
        #${modalId} [data-part="find-menu-prompt-text"] {
          display: block; width: 100%; box-sizing: border-box;
          margin: 0; border: none; outline: none; resize: none;
          padding: 12px 14px;
          font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
          font-size: 12.5px; line-height: 1.7;
          color: rgba(17,24,39,0.88);
          background: #fff;
          min-height: 300px; max-height: 800px;
          overflow-y: auto; white-space: pre;
        }

        /* Title group (title + enable hint stacked) */
        #${modalId} [data-part="title-group"] {
          display: flex;
          flex-direction: column;
          gap: 1px;
          min-width: 0;
        }
        #${modalId} [data-part="header-hint"] {
          font-size: 10.5px;
          color: rgba(17,24,39,0.4);
          white-space: nowrap;
          line-height: 1.4;
        }
        #${modalId} [data-part="header-hint"] code {
          font-size: 10px;
          background: rgba(17,24,39,0.06);
          color: rgba(17,24,39,0.55);
          padding: 0 3px;
          border-radius: 3px;
        }

        #${modalId} .dm-tree-children {
          /* Khôi: Bước 1 danh sách menu thụt vào nhiều quá — giảm indent mỗi cấp (24px → 12px) */
          margin-left: 10px;
          border-left: 2px solid rgba(0,0,0,0.05);
          padding-left: 4px;
        }
        #dm_panel_snackbar {
          position: fixed;
          left: 20px;
          bottom: 20px;
          transform: translate3d(0, 16px, 0);
          opacity: 0;
          pointer-events: none;
          z-index: 2147483647;
          max-width: min(420px, calc(40vw - 24px));
          font-family: ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial;
          font-size: 13px;
          line-height: 1.5;
          padding: 10px 16px;
          border-radius: 12px;
          background: rgba(3,7,18,0.92);
          border: 1px solid rgba(255,255,255,0.12);
          color: rgba(255,255,255,0.95);
          box-shadow: 0 10px 35px rgba(0,0,0,0.5);
          transition: opacity 150ms ease, transform 150ms ease;
        }
        #dm_panel_snackbar[data-show="1"] {
          opacity: 1;
          transform: translate3d(0, 0, 0);
        }
        #${modalId} [data-part="resizer"] {
          display: none;
          position: absolute;
          left: 0;
          top: 0;
          width: 12px;
          height: 100%;
          cursor: ew-resize;
          z-index: 5;
          touch-action: none;
        }
        #${modalId} [data-part="resizer"]::before {
          content: "";
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          width: 4px;
          height: 46px;
          border-radius: 4px;
          background: rgba(17,24,39,0.28);
          transition: background 120ms, height 120ms;
        }
        #${modalId} [data-part="resizer"]:hover::before {
          background: rgba(37,99,235,0.85);
          height: 64px;
        }
        @media (min-width: 768px) {
          #${modalId} {
            width: var(--dm-panel-w, 300px);
            min-width: var(--dm-panel-w, 300px);
            /* Không đổ bóng sang website — chỉ kẻ 1 line 2px ở mép */
            box-shadow: none;
            border-left: 2px solid rgba(17,24,39,0.18);
          }
          /* TASK00485 — Khôi: resize width panel pin-right gây khó khăn căn fab/mega menu demo khi test → bỏ hẳn resize, giữ display:none của rule base (width vẫn cố định qua --dm-panel-w, chỉ không kéo được nữa) */
          /* Panel là sidebar dock, không phải overlay → không phủ mờ trang */
          #${modalBackdropId}[data-open="1"] { display: none !important; }
          /* Mở panel → chừa chỗ bên phải (đẩy web sang trái) + bỏ khóa scroll để web vẫn dùng được */
          body:has(#${modalId}[data-open="1"]) {
            overflow: visible !important;
            padding-right: var(--dm-panel-w, 300px) !important;
          }
        }
        /* Nút Turn off trong header */
        #${modalId} [data-part="turnoff"] {
          appearance: none;
          border: 1px solid rgba(220,38,38,0.4);
          background: #fff;
          color: #dc2626;
          border-radius: 7px;
          padding: 4px 12px;
          font-size: 12.5px;
          font-weight: 600;
          cursor: pointer;
          white-space: nowrap;
        }
        #${modalId} [data-part="turnoff"]:hover { background: rgba(220,38,38,0.08); }
        /* Popup confirm tắt debug mode (append ngoài modal → scope bằng id riêng) */
        .dm-confirm-overlay {
          position: fixed;
          inset: 0;
          z-index: 2147483647;
          background: rgba(0,0,0,0.4);
          display: flex;
          align-items: center;
          justify-content: center;
          font-family: system-ui, -apple-system, BlinkMacSystemFont, sans-serif;
        }
        .dm-confirm-overlay [data-part="confirm-dialog"] {
          position: relative;
          width: min(440px, 92vw);
          background: #fff;
          color: #111827;
          border-radius: 14px;
          padding: 18px 20px;
          box-shadow: 0 20px 60px rgba(0,0,0,0.35);
          font-size: 14px;
          line-height: 1.5;
        }
        /* TASK00485 — Cancel chuyển thành nút × góc phải trên (thay cho nút text trong hàng actions) */
        .dm-confirm-overlay [data-part="confirm-close"] {
          position: absolute;
          top: 10px;
          right: 10px;
          width: 28px;
          height: 28px;
          border: none;
          background: transparent;
          color: rgba(17,24,39,0.5);
          font-size: 20px;
          line-height: 1;
          cursor: pointer;
          border-radius: 6px;
          display: inline-flex;
          align-items: center;
          justify-content: center;
        }
        .dm-confirm-overlay [data-part="confirm-close"]:hover {
          background: rgba(17,24,39,0.06);
          color: #111827;
        }
        .dm-confirm-overlay [data-part="confirm-title"] { font-size: 16px; font-weight: 700; margin-bottom: 8px; padding-right: 26px; }
        .dm-confirm-overlay [data-part="confirm-body"] p { margin: 8px 0; color: rgba(17,24,39,0.75); }
        .dm-confirm-overlay [data-part="confirm-row"] {
          display: flex;
          align-items: center;
          gap: 8px;
          margin: 6px 0;
        }
        .dm-confirm-overlay [data-part="confirm-row"] b {
          width: 56px;
          flex-shrink: 0;
          font-size: 12px;
          color: rgba(17,24,39,0.6);
        }
        .dm-confirm-overlay [data-part="confirm-row"] code {
          font-family: ui-monospace, Menlo, Monaco, monospace;
          font-size: 12px;
          background: rgba(17,24,39,0.07);
          padding: 4px 8px;
          border-radius: 6px;
          word-break: break-all;
          flex: 1;
        }
        /* TASK00485 — 2 nút Minimize/Turn off chia đôi đều nhau ở dưới (thay vì dồn phải như cancel/ok cũ) */
        .dm-confirm-overlay [data-part="confirm-actions"] {
          display: flex;
          gap: 8px;
          margin-top: 16px;
        }
        .dm-confirm-overlay [data-part="confirm-minimize"],
        .dm-confirm-overlay [data-part="confirm-ok"] {
          appearance: none;
          border-radius: 8px;
          padding: 9px 12px;
          font-size: 13px;
          font-weight: 600;
          cursor: pointer;
          flex: 1;
          text-align: center;
        }
        .dm-confirm-overlay [data-part="confirm-minimize"] {
          border: 1px solid rgba(17,24,39,0.18);
          background: #fff;
          color: #111827;
        }
        .dm-confirm-overlay [data-part="confirm-ok"] {
          border: 1px solid #dc2626;
          background: #dc2626;
          color: #fff;
        }
        /* TASK00256. Begin — Custom tooltip (thay native title attribute, không bị clip bởi overflow) */
        #dm_tooltip {
          position: fixed;
          z-index: 2147483647;
          pointer-events: none;
          background: rgba(17,24,39,0.88);
          color: #fff;
          font-family: system-ui, -apple-system, BlinkMacSystemFont, sans-serif;
          font-size: 11.5px;
          font-weight: 500;
          line-height: 1.4;
          padding: 5px 9px;
          border-radius: 6px;
          white-space: nowrap;
          box-shadow: 0 2px 8px rgba(0,0,0,0.25);
          opacity: 0;
          transition: opacity 100ms;
        }
        #dm_tooltip[data-show] { opacity: 1; }
        /* TASK00256. End */
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
    const btnLabel = document.createElement("span");
    btnLabel.setAttribute("data-part", "label"); // TASK00485 — scope chữ dọc chỉ vào riêng label, không phải cả nút
    btnLabel.textContent = "Navi+ Live";
    button.appendChild(img);
    button.appendChild(btnLabel);
    document.body.appendChild(button);
    cleanupTasks.push(() => button.remove());

    // Kéo nút trigger lên/xuống dọc theo mép phải (right:0 giữ nguyên, chỉ top đổi) — TASK00485
    const TRIGGER_TOP_KEY = "_naviplus_debug_trigger_top";
    const TRIGGER_H = 96; // ước lượng chiều cao nút (icon+label dọc) để clamp không tràn viewport
    const clampTriggerTop = (top) => Math.min(Math.max(10, top), Math.max(10, window.innerHeight - TRIGGER_H - 10));
    const applyTriggerTop = (top) => {
      const t = clampTriggerTop(top);
      document.documentElement.style.setProperty("--dm-trigger-top", t + "px");
      return t;
    };
    let currentTriggerTop = (() => {
      const saved = parseInt(safeLocalStorage.get(TRIGGER_TOP_KEY) || "", 10);
      if (Number.isFinite(saved)) return saved;
      return (window.innerHeight - TRIGGER_H) / 2; // TASK00485 — Khôi: default giữa màn hình thay vì top:100px cố định
    })();
    applyTriggerTop(currentTriggerTop);

    let triggerDragging = false;
    let triggerDragMoved = false;
    let triggerDragStartY = 0;
    let triggerDragStartTop = 0;
    const onTriggerPointerMove = (e) => {
      if (!triggerDragging) return;
      const dy = e.clientY - triggerDragStartY;
      if (Math.abs(dy) > 4) triggerDragMoved = true; // ngưỡng nhỏ để phân biệt kéo thật với click tay run
      if (triggerDragMoved) currentTriggerTop = applyTriggerTop(triggerDragStartTop + dy);
    };
    const onTriggerPointerUp = () => {
      if (!triggerDragging) return;
      triggerDragging = false;
      document.body.style.userSelect = "";
      if (triggerDragMoved) safeLocalStorage.set(TRIGGER_TOP_KEY, String(currentTriggerTop));
      window.removeEventListener("pointermove", onTriggerPointerMove);
      window.removeEventListener("pointerup", onTriggerPointerUp);
    };
    button.addEventListener("pointerdown", (e) => {
      triggerDragging = true;
      triggerDragMoved = false;
      triggerDragStartY = e.clientY;
      triggerDragStartTop = currentTriggerTop;
      document.body.style.userSelect = "none";
      window.addEventListener("pointermove", onTriggerPointerMove);
      window.addEventListener("pointerup", onTriggerPointerUp);
    });
    /* Chặn click "ảo" ngay sau khi kéo (mousedown→move→mouseup vẫn phát sinh click) — đăng ký TRƯỚC
       listener openModal (thêm bên dưới, xa hơn trong file) nên chạy trước; stopImmediatePropagation
       chặn luôn listener đó chạy tiếp khi vừa kéo xong. */
    button.addEventListener("click", (e) => {
      if (triggerDragMoved) {
        e.preventDefault();
        e.stopImmediatePropagation();
        triggerDragMoved = false;
      }
    });
    const onWinResizeTriggerTop = () => { currentTriggerTop = applyTriggerTop(currentTriggerTop); };
    window.addEventListener("resize", onWinResizeTriggerTop);
    cleanupTasks.push(() => {
      window.removeEventListener("pointermove", onTriggerPointerMove);
      window.removeEventListener("pointerup", onTriggerPointerUp);
      window.removeEventListener("resize", onWinResizeTriggerTop);
      document.documentElement.style.removeProperty("--dm-trigger-top");
    });

    const backdrop = document.createElement("div");
    backdrop.id = modalBackdropId;
    backdrop.dataset.open = "0";
    document.body.appendChild(backdrop);
    cleanupTasks.push(() => backdrop.remove());

    const modal = document.createElement("div");
    modal.id = modalId;
    modal.dataset.open = "0";
    // Đọc mode floating đã lưu (localStorage, nhớ qua các lần tải lại trang) TRƯỚC khi modal render lần đầu, tránh nháy sai vị trí — TASK00485
    const FLOATING_MODE_KEY = "_naviplus_debug_panel_floating";
    const FLOATING_POS_KEY = "_naviplus_debug_panel_pos";
    /* TASK00525: default đổi pin-right → FLOATING (chưa lưu lựa chọn nào = floating); ai đã chủ động
       chọn "Pin to right" trước đó (lưu "0") vẫn giữ pin-right. */
    // Khôi 2026-09-21: bỏ hẳn chế độ "Pin to right" — panel LUÔN floating (kể cả ai từng lưu "0").
    modal.dataset.floating = "1";

    const header = document.createElement("div");
    header.setAttribute("data-part", "header");

    // Tín hiệu trực quan "kéo được" khi floating: 3 chấm giữa-trên header (chỉ hiện khi data-floating="1") — TASK00485
    const dragHandle = document.createElement("div");
    dragHandle.setAttribute("data-part", "drag-handle");
    dragHandle.innerHTML = "<span></span><span></span><span></span>";
    header.appendChild(dragHandle);

    const brand = document.createElement("div");
    brand.setAttribute("data-part", "brand");

    const brandImg = document.createElement("img");
    brandImg.alt = TEXT.logoAlt;
    brandImg.src = TEXT.logoUrl;
    brand.appendChild(brandImg);

    const titleGroup = document.createElement("div");
    titleGroup.setAttribute("data-part", "title-group");
    const title = document.createElement("div");
    title.setAttribute("data-part", "title");
    title.textContent = TEXT.modalTitle;
    // TASK00256. Begin — bỏ header-hint (Enable/Disable URL) vì bị tràn; cách bật/tắt chuyển sang popup nút Turn off
    titleGroup.appendChild(title);
    brand.appendChild(titleGroup);
    // TASK00256. End

    const headerRight = document.createElement("div");
    headerRight.setAttribute("data-part", "header-right");

    // TASK00256. Begin — Nút Turn off + popup confirm (giải thích bật/tắt bằng domain thật, clear URL khi tắt)
    /* URL chính xác của site hiện tại (đã có domain thật, không dùng yourdomain.com nữa).
       Bỏ location.search: query string (vd ?test=1&embed=...&token=...) chỉ phục vụ demo/preview
       hiện tại, không cần thiết để bật/tắt debug mode (applyDebugModeFromHash chỉ đọc hash). */
    const buildExactUrl = (hash) => location.origin + location.pathname + hash;

    let turnOffOverlay = null;
    const closeTurnOffConfirm = () => {
      if (turnOffOverlay) { turnOffOverlay.remove(); turnOffOverlay = null; }
    };
    cleanupTasks.push(closeTurnOffConfirm);

    const openTurnOffConfirm = () => {
      closeTurnOffConfirm();
      const enableUrl = buildExactUrl("#livemode"); // TASK00535: bỏ hậu tố "-on" cho ngắn
      const disableUrl = buildExactUrl("#livemode-off");

      const overlay = document.createElement("div");
      overlay.id = "dm_confirm_overlay";
      // TASK00525: CSS confirm-dialog đổi scope id → class .dm-confirm-overlay (dùng chung với popup
      // "Sent to Navi+" của Old Menu → Navi+) — id giữ nguyên cho tương thích
      overlay.className = "dm-confirm-overlay";
      overlay.innerHTML =
        "<div data-part='confirm-dialog'>" +
          // TASK00485 — Cancel chuyển thành × góc phải trên
          "<button type='button' data-part='confirm-close' aria-label='Cancel'>×</button>" +
          "<div data-part='confirm-title'>Turn off Navi+ Live?</div>" +
          "<div data-part='confirm-body'>" +
            "<p>How to control Navi+ Live on this site (bookmark for later):</p>" +
            "<div data-part='confirm-row'><b>Enable</b><code>" + enableUrl + "</code></div>" +
            "<div data-part='confirm-row'><b>Disable</b><code>" + disableUrl + "</code></div>" +
            "<p>Turning off now closes Navi+ Live and clears it from the URL.</p>" +
          "</div>" +
          "<div data-part='confirm-actions'></div>" +
        "</div>";

      const closeBtn = overlay.querySelector("[data-part='confirm-close']");
      closeBtn.addEventListener("click", closeTurnOffConfirm);

      const actions = overlay.querySelector("[data-part='confirm-actions']");
      // TASK00485 — nút Minimize mới: chỉ thu nhỏ panel (closeModal), KHÔNG tắt debug mode như "Turn off"
      const minimizeBtn = document.createElement("button");
      minimizeBtn.type = "button";
      minimizeBtn.setAttribute("data-part", "confirm-minimize");
      minimizeBtn.textContent = "Minimize";
      minimizeBtn.addEventListener("click", () => {
        closeTurnOffConfirm();
        closeModal();
      });
      const okBtn = document.createElement("button");
      okBtn.type = "button";
      okBtn.setAttribute("data-part", "confirm-ok");
      okBtn.textContent = "Turn off Navi+ Live";
      okBtn.addEventListener("click", () => {
        closeTurnOffConfirm();
        /* Tắt: xóa cờ session + tắt inspector/UI; chỉ CLEAR hash khỏi URL (không set #navidebug-off) */
        safeSessionStorage.remove(debugModeStorageKey);
        try { history.replaceState(null, "", location.pathname + location.search); } catch {}
        disableInspector();
        disableDebugUI();
      });
      actions.appendChild(minimizeBtn);
      actions.appendChild(okBtn);

      overlay.addEventListener("click", (e) => { if (e.target === overlay) closeTurnOffConfirm(); });
      document.body.appendChild(overlay);
      turnOffOverlay = overlay;
    };

    const turnOffBtn = document.createElement("button");
    turnOffBtn.type = "button";
    turnOffBtn.setAttribute("data-part", "turnoff");
    turnOffBtn.textContent = "Turn off Navi+ Live";
    turnOffBtn.addEventListener("click", openTurnOffConfirm);
    // turnOffBtn appended to homePanel (Level 1) — xem block bên dưới
    // TASK00256. End

    // Nút "..." (view mode): Minimize / Floating / Pin to right, đặt TRƯỚC nút −/× — TASK00485
    const viewmodeWrap = document.createElement("div");
    viewmodeWrap.setAttribute("data-part", "viewmode-wrap");

    const viewmodeBtn = document.createElement("button");
    viewmodeBtn.type = "button";
    viewmodeBtn.setAttribute("data-part", "viewmode");
    viewmodeBtn.setAttribute("aria-label", "Panel view mode");
    viewmodeBtn.innerHTML = ri("more-2-fill");

    const viewmodeMenu = document.createElement("div");
    viewmodeMenu.setAttribute("data-part", "viewmode-menu");
    viewmodeMenu.dataset.open = "0";

    const buildViewmodeRow = (mode, icon, label) => {
      const row = document.createElement("button");
      row.type = "button";
      row.dataset.mode = mode;
      row.innerHTML = ri(icon, label) + '<i class="ri-check-line" data-part="check"></i>';
      return row;
    };
    const viewmodeRowMinimize = buildViewmodeRow("minimize", "subtract-line", "Minimize");
    const viewmodeRowFloating = buildViewmodeRow("floating", "drag-move-2-line", "Floating");
    const viewmodeRowPinRight = buildViewmodeRow("pin-right", "layout-right-line", "Pin to right");
    viewmodeMenu.appendChild(viewmodeRowMinimize);
    viewmodeMenu.appendChild(viewmodeRowFloating);
    // viewmodeRowPinRight KHÔNG gắn vào menu nữa (Khôi 2026-09-21: bỏ Pin to right) — element giữ vì setFloatingMode() còn tham chiếu.

    // Gỡ icon "×" (Turn off) khỏi header (trông như nút Close thường, dễ nhầm là đóng
    // panel trong khi thực ra mở popup xác nhận tắt debug mode) → dời vào cuối menu "...", tách
    // bằng đường kẻ vì đây là hành động khác nhóm (không phải view mode)
    const viewmodeMenuDivider = document.createElement("div");
    viewmodeMenuDivider.setAttribute("data-part", "viewmode-menu-divider");
    const viewmodeRowTurnOff = buildViewmodeRow("turn-off", "shut-down-line", "Turn off Navi+ Live");
    /* Khôi 22/09: Navi+ Finder (dò CSS Selector tự do: hover → selector → Copy) đã rời Home (hiddenFromGrid) nên KHÔNG
       còn lối vào — mất tính năng. Trả lại 1 dòng trong menu "…"; handler ở cạnh viewmodeRowTurnOff (openFeature +
       inspector trong scope lúc đó). BE "Pick it in Live mode" → ?naviselectorcheck=1&navipick=custom → cùng hàm. */
    const viewmodeRowFinder = buildViewmodeRow("finder", "cursor-line", "Pick a CSS Selector");
    viewmodeMenu.appendChild(viewmodeRowFinder);
    viewmodeMenu.appendChild(viewmodeMenuDivider);
    viewmodeMenu.appendChild(viewmodeRowTurnOff);

    viewmodeWrap.appendChild(viewmodeBtn);
    viewmodeWrap.appendChild(viewmodeMenu);

    const collapseBtn = document.createElement("button");
    collapseBtn.type = "button";
    collapseBtn.setAttribute("data-part", "close");
    collapseBtn.setAttribute("aria-label", "Minimize");
    collapseBtn.textContent = "−";

    headerRight.appendChild(viewmodeWrap); // TASK00485
    headerRight.appendChild(collapseBtn);

    header.appendChild(brand);
    header.appendChild(headerRight);

    const body = document.createElement("div");
    body.setAttribute("data-part", "body");

    /* Banner kết quả navicheck: luôn nằm đầu panel, thay cho toast/snackbar */
    const navicheckBanner = document.createElement("div");
    navicheckBanner.setAttribute("data-part", "navicheck-banner");
    navicheckBanner.style.cssText =
      "display:none;margin:10px 14px 0;padding:8px 10px;border-radius:8px;" +
      "border:1px solid rgba(234,179,8,0.55);background:rgba(253,224,71,0.18);" +
      "color:#854d0e;font-size:12.5px;line-height:1.55;";
    body.appendChild(navicheckBanner);

    // TASK00256. Begin — Level 1: home (3 feature cards) + Level 2: detail (back btn + content)
    const FEATURE_DEFS = [
      // đổi feature "AI Design" (scan → sinh prompt copy-paste) thành
      // scan → chọn nhiều menu → gửi thẳng về Navi+ qua API, bỏ bước prompt.
      // TASK00525: đưa lên ĐẦU FEATURE_DEFS (card try-menus insertBefore(firstChild) nên vẫn đứng
      // trước → scan thành card thứ 2); đổi tên "Scan website menus" → "Bring old menu → Navi+".
      {
        id: "scan",
        icon: "sparkling-2-fill",
        color: "rgba(17,24,39,0.6)",
        bg: "rgba(17,24,39,0.07)",
        title: "Old Menu → Navi+",
        desc: "Scan your site and use existing menus as the source for new Navi+ menus",
        hiddenFromGrid: true, // Khôi chốt: bỏ card khỏi Home; code + deep-link ?naviscan=1 (nút "Lấy menu từ website" bên admin) giữ nguyên
      },
      {
        id: "explore-css",
        icon: "compass-3-line",
        color: "rgba(17,24,39,0.6)",
        bg: "rgba(17,24,39,0.07)",
        title: "Selector Guide",
        desc: "Choose your platform to see where menus can be inserted",
        hiddenFromGrid: true, // Khôi chốt: gợi ý tĩnh theo theme thay bằng auto-detect ở Home mới (selcheck-home)
      },
      {
        id: "css",
        icon: "cursor-line",
        color: "rgba(17,24,39,0.6)",
        bg: "rgba(17,24,39,0.07)",
        title: "Navi+ Finder",
        desc: "Hover any element to find its selector. Arrow keys to navigate, Cmd+C to copy",
        hiddenFromGrid: true, // Khôi chốt: Finder lùi thành sub-feature "Pick it/Re-pick" của Home mới (pick mode)
      },
      {
        id: "mobile-guide",
        icon: "smartphone-line",
        color: "rgba(17,24,39,0.6)",
        bg: "rgba(17,24,39,0.07)",
        title: "Debug website on mobile",
        desc: "Browser-aware steps (shortcut/icon/resize) to inspect mobile selectors correctly.",
        hiddenFromGrid: true, // tách ra nút nhỏ trên header — vẫn giữ trong FEATURE_DEFS để openFeature() lấy backLabel
      },
    ];

    // Level 2 — detail container (ẩn mặc định)
    const detailPanel = document.createElement("div");
    detailPanel.setAttribute("data-part", "detail");
    // Gộp header 2 lớp: back button + tên feature chuyển LÊN header chính, thay thế vị
    // trí `brand` (logo + "Navi+ Debug mode") khi đang ở Level 2, thay vì 1 thanh riêng (detailHeader
    // cũ, nền xám sticky) nằm dưới header chính. Toggle qua `modal.dataset.view` ("home"/"detail") —
    // headerRight ("..."/"−") giữ nguyên vị trí, hiện xuyên suốt cả 2 level.
    const detailBrand = document.createElement("div");
    detailBrand.setAttribute("data-part", "detail-brand");
    const backBtn = document.createElement("button");
    backBtn.type = "button";
    backBtn.setAttribute("data-part", "back-btn");
    const backLabel = document.createElement("span");
    backLabel.setAttribute("data-part", "back-label");
    backBtn.appendChild(document.createRange().createContextualFragment(
      `<i class="ri-arrow-left-s-line" style="font-size:18px;vertical-align:-0.1em;"></i>`
    ));
    backBtn.appendChild(backLabel);
    backBtn.addEventListener("click", () => {
      clearPanelView(); // TASK00519 — user chủ động về home thì thôi không khôi phục màn cũ nữa
      detailPanel.style.display = "none";
      homePanel.style.display = "flex";
      modal.dataset.view = "home";
      delete modal.dataset.feature; // TASK00525
    });
    detailBrand.appendChild(backBtn);
    // Tag nhỏ "● ON" cạnh title, chỉ hiện khi đang xem trang "Try Navi+ menus" VÀ demo đang bật — TASK00485
    const backLiveBadge = document.createElement("span");
    backLiveBadge.setAttribute("data-part", "back-live-badge");
    backLiveBadge.textContent = "● ON";
    detailBrand.appendChild(backLiveBadge);
    header.insertBefore(detailBrand, headerRight); // chiếm đúng chỗ brand trong header chính
    const detailContent = document.createElement("div");
    detailContent.setAttribute("data-part", "detail-content");
    detailPanel.appendChild(detailContent);

    // nhớ màn (level 2) đang mở qua reload. Khôi báo 2026-07-23: đang trong "Try
    // Navi+ menus" mà refresh site / Apply đổi mẫu (đều là navigate) là panel rơi về level 1 danh sách
    // chức năng — vì view không được lưu, còn bootstrapTryMenusDirectLink chỉ auto-mở màn Try cho lần
    // ĐẦU (debug chưa bật), reload thì debug đã bật nên bị bỏ qua. sessionStorage = per-tab, đúng đời
    // sống 1 phiên demo.
    const PANEL_VIEW_SESSION_KEY = "_naviplus_debug_panel_view";
    const savePanelView = (id) => { try { sessionStorage.setItem(PANEL_VIEW_SESSION_KEY, id); } catch (e) {} };
    const clearPanelView = () => { try { sessionStorage.removeItem(PANEL_VIEW_SESSION_KEY); } catch (e) {} };

    /* Mở feature (drill-in từ Level 1 → Level 2) */
    const openFeature = (id) => {
      savePanelView(id); // TASK00519 — nhớ màn đang mở (khôi phục sau reload, xem khối trên)
      homePanel.style.display = "none";
      detailPanel.style.display = "block";
      modal.dataset.view = "detail"; // CSS ẩn brand, hiện detailBrand trong header chính
      modal.dataset.feature = id; // TASK00525 — CSS scope theo feature đang mở (flex-chain màn scan)
      for (const el of detailContent.children) {
        el.style.display = el.dataset.featureId === id ? "block" : "none";
      }
      const def = FEATURE_DEFS.find(f => f.id === id);
      /* "try-menus" không nằm trong FEATURE_DEFS (feature riêng, xem block "Live preview" bên dưới)
         nên cần fallback tiêu đề riêng — hiện ngay sau nút back "<" thay vì lặp lại trong nội dung panel. */
      backLabel.textContent = def ? def.title : (id === "try-menus" ? "Try Navi+ Menus" : "");
      updateBackLiveBadge(); // TASK00485 — id đổi (rời khỏi/vào lại try-menus) → cập nhật tag ngay
      // TASK00516 (vòng 3) — mở feature "scan" là TỰ QUÉT luôn (bỏ nút Scan). runScan định nghĩa sau
      // trong cùng closure nhưng openFeature chỉ chạy khi user drill-in (sau khi mọi const đã khai báo).
      if (id === "scan") runScan();
    };

    // Level 1 — home screen
    const homePanel = document.createElement("div");
    homePanel.setAttribute("data-part", "home");
    for (const f of FEATURE_DEFS) {
      if (f.hiddenFromGrid) continue;
      const card = document.createElement("button");
      card.type = "button";
      card.setAttribute("data-part", "feature-card");
      card.dataset.featureId = f.id;
      /* Image area: SVG icon lớn trên gradient background */
      const cardImg = document.createElement("div");
      cardImg.setAttribute("data-part", "feature-card-img");
      cardImg.style.background = f.bg;
      cardImg.innerHTML = `<i class="ri-${f.icon}" style="font-size:20px;color:${f.color};"></i>`;
      /* Text area */
      const cardInfo = document.createElement("div");
      cardInfo.setAttribute("data-part", "feature-card-info");
      cardInfo.innerHTML =
        `<div data-part="feature-card-name">${f.title}</div>` +
        `<div data-part="feature-card-desc">${f.desc}</div>`;
      card.appendChild(cardImg);
      card.appendChild(cardInfo);
      card.addEventListener("click", () => openFeature(f.id));
      homePanel.appendChild(card);
    }

    /* "Try Navi+ menus" — feature thật (TASK00405). TASK00525: đưa LÊN ĐẦU danh sách (feature
       chính, quan trọng hơn các card tiện ích Inspect/Scan/Explore) và bỏ label group "Live preview"
       (tự thân card đã rõ nghĩa). */
    const tryMenusCard = document.createElement("button");
    tryMenusCard.type = "button";
    tryMenusCard.setAttribute("data-part", "feature-card");
    tryMenusCard.dataset.featureId = "try-menus";
    tryMenusCard.dataset.live = "off"; // TASK00485 — cập nhật trong updateTryMenusUI() theo _tryMenusOn
    tryMenusCard.innerHTML =
      `<span data-part="feature-card-img" style="background:rgba(220,38,38,0.08)">` +
        `<i class="ri-rocket-2-line" style="font-size:20px;color:rgba(220,38,38,0.75)"></i>` +
      "</span>" +
      `<span data-part="feature-card-info">` +
        `<div data-part="feature-card-name">Try Navi+ Menus</div>` +
        `<div data-part="feature-card-desc">Preview menu templates directly on your live site — nothing is saved</div>` +
      "</span>" +
      // TASK00485 — badge trạng thái demo; TASK00525 — luôn hiển thị, text ON/OFF set trong updateTryMenusUI()
      `<span data-part="feature-card-live-badge">● OFF</span>`;
    // TASK00525 — tham chiếu badge để updateTryMenusUI() đổi text theo _tryMenusOn
    const tryMenusLiveBadge = tryMenusCard.querySelector('[data-part="feature-card-live-badge"]');
    tryMenusCard.addEventListener("click", () => {
      openFeature("try-menus");
      refreshTryMenusThemeStatus(); // mỗi lần mở lại panel — cập nhật đúng trạng thái theme mới nhất
    });
    /* Khôi chốt: card "Try Navi+ Menus" KHÔNG còn ở Home — demo được hấp thụ vào nút "Test menu" của
       Home mới (selcheck-home, xem selCheckMountInto phía dưới). Element card vẫn tạo (updateTryMenusUI
       đọc tryMenusCard.dataset.live/tryMenusLiveBadge) nhưng không gắn vào DOM. Home mới gắn ở đây,
       TRƯỚC footer. */
    const selCheckHome = document.createElement("div");
    selCheckHome.setAttribute("data-part", "selcheck-home");
    homePanel.insertBefore(selCheckHome, homePanel.firstChild);
    const footerWrap = document.createElement("div");
    footerWrap.setAttribute("data-part", "debug-footer-wrap");
    footerWrap.style.cssText = "margin-top:14px;padding-top:10px;border-top:1px solid rgba(17,24,39,0.08);display:flex;flex-direction:column;align-items:center;gap:6px;";

    /* TASK00525: bỏ link "How to test on mobile" cũ (mở feature mobile-guide) — thay bằng footer
       sẫm "Test website on mobile" pin đáy panel (sheet trượt lên, xem cuối hàm build modal). */
    const footerLinksRow = document.createElement("div");
    footerLinksRow.setAttribute("data-part", "footer-links");
    footerLinksRow.appendChild(turnOffBtn);
    footerWrap.appendChild(footerLinksRow);

    const panelFooter = document.createElement("div");
    panelFooter.setAttribute("data-part", "debug-footer");
    panelFooter.style.cssText = "text-align:center;font-size:11px;color:#6b7280;";
    panelFooter.innerHTML = "Navi+ Menu Builder • <a target='_blank' rel='noopener noreferrer' href='https://naviplus.io' style='color:#2563eb;text-decoration:none'>naviplus.io</a>";
    footerWrap.appendChild(panelFooter);
    // Khôi 2026-09-21: bỏ footer Home ("Turn off Navi+ Live" + "Navi+ Menu Builder • naviplus.io") — Turn off đã có
    // trong menu "…" (viewmodeRowTurnOff). Element vẫn tạo (turnOffBtn được tham chiếu nơi khác), không gắn vào DOM.

    body.appendChild(homePanel);
    body.appendChild(detailPanel);

    // switchTab: no-op (navigation dùng openFeature)
    const switchTab = () => {};
    // TASK00256. End

    const findCssCard = document.createElement("div");
    findCssCard.setAttribute("data-part", "find-css-card");
    findCssCard.dataset.featureId = "css";

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

    // 2 card riêng biệt (thay vì 1 khối liên tục dùng <b> làm tiêu đề phụ)
    const insertReplaceBox = document.createElement("div");
    insertReplaceBox.style.cssText = "background:rgba(17,24,39,0.02);border:1px solid rgba(17,24,39,0.08);border-radius:8px;padding:10px 12px;";
    insertReplaceBox.innerHTML = TEXT.modalDescriptionInsertReplace;
    cardBody.appendChild(insertReplaceBox);

    const slideMenuBox = document.createElement("div");
    slideMenuBox.style.cssText = "background:rgba(17,24,39,0.02);border:1px solid rgba(17,24,39,0.08);border-radius:8px;padding:10px 12px;margin-top:10px;";
    slideMenuBox.innerHTML = TEXT.modalDescriptionSlideMenu;
    cardBody.appendChild(slideMenuBox);

    const viewDetailLink = document.createElement("div");
    viewDetailLink.innerHTML = TEXT.modalDescriptionViewDetailLink;
    cardBody.appendChild(viewDetailLink);

    findCssCard.appendChild(cardBody);

    detailContent.appendChild(findCssCard);

    // ---- Find Menu card ----
    const findMenuCard = document.createElement("div");
    findMenuCard.setAttribute("data-part", "find-menu-card");
    findMenuCard.dataset.featureId = "scan"; // TASK00516 — đổi từ "design"

    // TASK00516 — Khôi (vòng 3): BỎ HẲN nút Scan/Re-scan. Mở feature "scan" là tự quét luôn
    // (openFeature("scan") gọi runScan(), xem cuối closure). Không còn card-header riêng.
    const menuCardBody = document.createElement("div");
    menuCardBody.setAttribute("data-part", "find-menu-card-body");

    // ── Step 1 ──
    const menuStep1 = document.createElement("div");
    menuStep1.setAttribute("data-part", "find-menu-step");

    // TASK00516 (vòng 3) — bỏ badge stepper "1"/luồng Scan thủ công; feature tự quét khi mở
    const menuStep1Header = document.createElement("div");
    menuStep1Header.setAttribute("data-part", "find-menu-step-header");
    const menuStep1Title = document.createElement("span");
    menuStep1Title.setAttribute("data-part", "find-menu-step-title");
    menuStep1Title.textContent = "Detected menus";
    menuStep1Header.appendChild(menuStep1Title);

    const menuStep1Desc = document.createElement("div");
    menuStep1Desc.setAttribute("data-part", "find-menu-step-desc");
    menuStep1Desc.textContent = "Tick the menus you want. Click a menu's View to preview its structure below.";

    const menuResultsDiv = document.createElement("div");
    menuResultsDiv.setAttribute("data-part", "find-menu-results");

    const menuOutputWrap = document.createElement("div");
    menuOutputWrap.setAttribute("data-part", "find-menu-output");
    // TASK00525: ẩn mặc định qua CSS (base [data-part="find-menu-output"] display:none, hiện bằng
    // data-show="1") — bỏ inline style.display để CSS flex-chain màn scan override được khi hiện

    // bỏ nút "Generate prompt" (menuCopyOutputBtn cũ), chỉ còn label "Structure"
    // vì khu vực này giờ CHỈ dùng để xem trước cấu trúc menu đang chọn, không sinh prompt nữa.
    const menuOutputBar = document.createElement("div");
    menuOutputBar.setAttribute("data-part", "find-menu-output-bar");
    const menuOutputLabel = document.createElement("span");
    menuOutputLabel.innerHTML = ri("file-list-3-line", "Structure");
    menuOutputBar.appendChild(menuOutputLabel);

    // TASK00516 (vòng 3) — Khôi: bỏ <textarea> (white-space:pre → scroll NGANG khó đọc). Thay bằng
    // div tree HTML nhiều cấp, tự xuống dòng (overflow-wrap:anywhere), chỉ cuộn DỌC trong ô.
    const menuOutputTree = document.createElement("div");
    menuOutputTree.setAttribute("data-part", "find-menu-output-tree");

    menuOutputWrap.appendChild(menuOutputBar);
    menuOutputWrap.appendChild(menuOutputTree);
    menuStep1.appendChild(menuStep1Header);
    menuStep1.appendChild(menuStep1Desc);
    menuStep1.appendChild(menuResultsDiv);
    // TASK00516 (vòng 3) — Khôi: bấm View thì structure mở ngay DƯỚI danh sách menu (trong body,
    // cuộn cùng body) — KHÔNG còn ghim preview ở đáy. menuOutputWrap trở lại nằm sau menuResultsDiv.
    menuStep1.appendChild(menuOutputWrap);
    // TASK00525 — empty state chỗ khung STRUCTURE khi chưa bấm View menu nào (trước đây trống 1 khoảng).
    // Ẩn/hiện thuần CSS: sibling selector [data-show="1"] ~ [find-menu-empty] → display:none.
    const menuOutputEmpty = document.createElement("div");
    menuOutputEmpty.setAttribute("data-part", "find-menu-empty");
    menuOutputEmpty.innerHTML =
      `<i class="ri-eye-line" style="font-size:18px;opacity:0.6"></i>` +
      "<span>Click <b>View</b> on a menu above to preview its structure here.</span>";
    menuStep1.appendChild(menuOutputEmpty);
    menuCardBody.appendChild(menuStep1);

    // thay Step 2 (Generate PROMPT) + Step 3 (Paste to Navi+) bằng 1 hàng
    // "GỬI VỀ NAVI+" duy nhất: chọn nhiều menu bằng checkbox (renderMenuTree bên dưới) rồi POST
    // thẳng lên microservice mới `menu-scan/api.php`, không còn bước copy/paste prompt thủ công.
    const menuSendRow = document.createElement("div");
    menuSendRow.setAttribute("data-part", "find-menu-send-row");

    const menuSendBtn = document.createElement("button");
    menuSendBtn.type = "button";
    menuSendBtn.setAttribute("data-part", "find-menu-send-btn");
    menuSendBtn.textContent = "Send to Navi+"; // TASK00525: bỏ icon máy bay giấy — chữ thuần (spinner lúc đang gửi vẫn giữ)
    menuSendBtn.disabled = true; // TASK00516 — disable đến khi có ≥1 menu được tick (updateSendBtnState)

    const menuSendStatus = document.createElement("span");
    menuSendStatus.setAttribute("data-part", "find-menu-send-status");

    menuSendRow.appendChild(menuSendBtn);
    menuSendRow.appendChild(menuSendStatus);

    /* TASK00516 (vòng 3) — Khôi: CHỈ ghim hàng nút "GỬI VỀ NAVI+" (menuSendRow) ở ĐÁY khung
       (position:sticky bottom:0 trong scroller thật #modalId [data-part="body"], xem CSS
       [data-part="find-menu-pinned"]). Structure preview đã chuyển vào body (dưới danh sách menu),
       cuộn cùng body — không còn ghim/giới hạn 50% nữa. */
    const menuPinnedBottom = document.createElement("div");
    menuPinnedBottom.setAttribute("data-part", "find-menu-pinned");
    menuPinnedBottom.appendChild(menuSendRow);
    menuCardBody.appendChild(menuPinnedBottom);

    findMenuCard.appendChild(menuCardBody);
    detailContent.appendChild(findMenuCard);

    // TASK00256. Begin — Feature "Find Default Menu": dò hamburger + main menu của theme
    const findDefaultCard = document.createElement("div");
    findDefaultCard.setAttribute("data-part", "find-default-card");
    findDefaultCard.dataset.featureId = "default";

    /* Khung highlight dùng chung cho 2 finder — phủ fixed theo getBoundingClientRect
       (đúng cả khi element bị slot/shadow DOM/transform, xem
       docs/decisions/trigger-overlay-positioning.md). pointer-events:none để không chặn click. */
    let dmFindHighlight = null;
    const clearFindHighlight = () => {
      if (dmFindHighlight) { dmFindHighlight.remove(); dmFindHighlight = null; }
    };
    cleanupTasks.push(clearFindHighlight);
    const highlightElement = (el) => {
      clearFindHighlight();
      const r = el.getBoundingClientRect();
      const box = document.createElement("div");
      box.style.cssText =
        "position:fixed;z-index:2147483646;pointer-events:none;border:2px solid #ef4444;" +
        "border-radius:4px;box-shadow:0 0 0 3px rgba(239,68,68,0.35),0 0 14px 3px rgba(239,68,68,0.5);" +
        "transition:all 140ms;";
      box.style.left = r.left + "px";
      box.style.top = r.top + "px";
      box.style.width = r.width + "px";
      box.style.height = r.height + "px";
      document.body.appendChild(box);
      dmFindHighlight = box;
    };

    /* Tạo 1 khối finder: tiêu đề + mô tả + nút Find + vùng result (selector + Copy).
       onFind() trả về { el, selector, note } hoặc null nếu không tìm thấy. */
    const buildFinderFn = (title, desc, btnLabel, onFind) => {
      const wrap = document.createElement("div");
      wrap.setAttribute("data-part", "find-default-fn");
      const t = document.createElement("div");
      t.setAttribute("data-part", "find-default-fn-title");
      t.innerHTML = title;
      const d = document.createElement("div");
      d.setAttribute("data-part", "find-default-fn-desc");
      d.textContent = desc;
      const btn = document.createElement("button");
      btn.type = "button";
      btn.setAttribute("data-part", "find-default-btn");
      btn.innerHTML = btnLabel;
      const result = document.createElement("div");
      result.setAttribute("data-part", "find-default-result");
      wrap.appendChild(t); wrap.appendChild(d); wrap.appendChild(btn); wrap.appendChild(result);

      btn.addEventListener("click", () => {
        const found = onFind();
        if (!found) {
          clearFindHighlight();
          result.style.display = "block";
          result.innerHTML = ri("close-circle-line") + " No matching element found on this page.";
          return;
        }
        const { el, selector, note } = found;
        el.scrollIntoView({ block: "center", inline: "center" });
        requestAnimationFrame(() => highlightElement(el));
        result.style.display = "block";
        result.innerHTML = "";
        const lbl = document.createElement("div");
        lbl.innerHTML = ri("checkbox-circle-line") + " Found selector:";
        const code = document.createElement("code");
        code.textContent = selector;
        result.appendChild(lbl);
        result.appendChild(code);
        if (note) {
          const n = document.createElement("div");
          n.style.cssText = "color:rgba(180,83,9,0.95);margin-bottom:6px;";
          n.innerHTML = ri("error-warning-line") + " " + note;
          result.appendChild(n);
        }
        const actions = document.createElement("div");
        actions.setAttribute("data-part", "find-default-result-actions");
        const copyBtn = document.createElement("button");
        copyBtn.type = "button";
        copyBtn.innerHTML = ri("clipboard-line", "Copy selector");
        copyBtn.addEventListener("click", async () => {
          const ok = await dmCopyToClipboard(selector);
          if (ok) {
            copyBtn.innerHTML = ri("check-line", "Copied!");
            showPanelSnackbar('Copied "' + selector + '"');
          }
        });
        actions.appendChild(copyBtn);
        result.appendChild(actions);
      });
      return wrap;
    };

    /* Dò nút hamburger (first-pass, chấm điểm heuristic). Tín hiệu: class/id chứa
       hamburger/menu-toggle..., aria-label menu/nav, aria-expanded/controls, SVG vài line,
       nằm trong header, kích thước nhỏ ~vuông. Element ẩn ở desktop nhưng điểm cao =
       nhiều khả năng là hamburger mobile-only → cộng nhẹ. */
    const findHamburger = () => {
      const sel = "button, summary, a, [role=button], [class*=menu], [class*=burger], [class*=nav], [aria-label], [aria-controls]";
      const cands = Array.from(document.querySelectorAll(sel)).filter(el =>
        !el.closest("#" + modalId) &&
        !el.closest("#" + inspectorOverlayId) &&
        !el.closest("#" + floatButtonId)
      );
      let best = null, bestScore = 0;
      for (const el of cands) {
        const rawCls = typeof el.className === "string"
          ? el.className
          : (el.className && el.className.baseVal) || "";
        const idcls = (rawCls + " " + (el.id || "")).toLowerCase();
        const aria = ((el.getAttribute("aria-label") || "") + " " +
                      (el.getAttribute("aria-controls") || "") + " " +
                      (el.getAttribute("title") || "")).toLowerCase();
        let s = 0;
        if (/hamburger|burger/.test(idcls)) s += 5;
        if (/menu-toggle|nav-toggle|toggle-menu|menu-icon|menu[-_]?button|menu[-_]?trigger|header__icon--menu|mobile-menu|js-menu|navbar-toggler|drawer/.test(idcls)) s += 4;
        if (/\bmenu\b|navigation|\bnav\b/.test(aria)) s += 3;
        if (el.hasAttribute("aria-expanded")) s += 2;
        if (el.hasAttribute("aria-controls")) s += 1;
        if (el.tagName === "BUTTON" || el.tagName === "SUMMARY" || el.getAttribute("role") === "button") s += 1;
        const svg = el.querySelector("svg");
        if (svg) {
          const n = svg.querySelectorAll("line, rect, path").length;
          if (n >= 2 && n <= 6) s += 3;
        }
        const r = el.getBoundingClientRect();
        const visible = r.width > 0 && r.height > 0;
        if (visible && r.width >= 16 && r.width <= 64 && r.height >= 12 && r.height <= 64) s += 1;
        if (el.closest("header, .header, [class*=header], [class*=Header], [role=banner]")) s += 1;
        if (!visible && s >= 4) s += 1;
        if (s > bestScore) { bestScore = s; best = el; }
      }
      if (!best || bestScore < 4) return null;
      const r = best.getBoundingClientRect();
      const hidden = r.width === 0 || r.height === 0;
      return {
        el: best,
        selector: dmGetSelector(best),
        note: hidden ? "Element is hidden at current width — switch your site to mobile view to see it." : "",
      };
    };

    /* Dò default main menu: tái dùng isMenuList (đã loại bỏ language/currency picker...),
       chỉ giữ list gốc (không nằm trong list khác), chọn list nhiều <li> nhất. */
    const findMainMenu = () => {
      const lists = Array.from(document.querySelectorAll("ul, ol")).filter(isMenuList);
      if (!lists.length) return null;
      const set = new Set(lists);
      const roots = lists.filter(el => {
        let p = el.parentElement;
        while (p) { if (set.has(p)) return false; p = p.parentElement; }
        return true;
      });
      let best = null, bestN = -1;
      for (const el of roots) {
        const n = Array.from(el.children).filter(c => c.tagName === "LI").length;
        if (n > bestN) { bestN = n; best = el; }
      }
      if (!best) return null;
      return { el: best, selector: dmGetSelector(best), note: "" };
    };

    findDefaultCard.appendChild(buildFinderFn(
      ri("menu-line") + " Find Hamburger menu icon",
      "Detect the hamburger / menu-toggle button of this theme. Tip: switch your site to mobile view first so the icon is visible.",
      ri("search-line", "Find hamburger"),
      findHamburger
    ));
    findDefaultCard.appendChild(buildFinderFn(
      ri("list-unordered") + " Find default main menu",
      "Detect the main navigation menu (the largest real menu list) on this page.",
      ri("search-line", "Find main menu"),
      findMainMenu
    ));
    detailContent.appendChild(findDefaultCard);

    // Feature "Debug website on mobile" — mở dạng detail (slide) để đồng bộ với card khác
    const mobileGuideCopy = getMobileGuideCopy();
    const mobileGuideDetail = document.createElement("div");
    mobileGuideDetail.dataset.featureId = "mobile-guide";
    mobileGuideDetail.style.cssText = "display:none;"; // Bỏ khung card; detail-content đã có padding 14px, khỏi lặp
    mobileGuideDetail.innerHTML =
      `<div style="font-size:13px;font-weight:700;color:#111827">${mobileGuideCopy.cardTitle}</div>` +
      `<div style="font-size:11px;color:#6b7280;margin-top:2px">${mobileGuideCopy.cardSubtitle}</div>` +
      `<div style="margin-top:10px;font-size:12.5px;line-height:1.55;color:#374151">${mobileGuideCopy.step1}</div>` +
      `<div style="margin-top:8px;font-size:12.5px;line-height:1.55;color:#374151">${mobileGuideCopy.step2Title}</div>` +
      `<div style="margin-top:6px;padding:8px 10px;border:1px solid rgba(37,99,235,0.22);background:rgba(37,99,235,0.06);border-radius:8px;font-size:12.5px;line-height:1.55;color:#1e3a8a">${mobileGuideCopy.step2Shortcut}</div>` +
      `<div style="margin-top:6px;padding:8px 10px;border:1px solid rgba(17,24,39,0.12);background:#fff;border-radius:8px;font-size:12.5px;line-height:1.55;color:#374151">${mobileGuideCopy.step2Icon}</div>` +
      `<div style="margin-top:6px;padding:8px 10px;border:1px solid rgba(17,24,39,0.12);background:#fff;border-radius:8px;font-size:12.5px;line-height:1.55;color:#374151">${mobileGuideCopy.step2Resize}</div>` +
      `<div style="margin-top:8px;font-size:12.5px;line-height:1.55;color:#374151">${mobileGuideCopy.step3}</div>` +
      `<div style="margin-top:10px;padding:10px 12px;border:1px solid rgba(17,24,39,0.12);background:rgba(17,24,39,0.02);border-radius:8px;">` +
        `<div style="font-size:12.5px;line-height:1.55;color:#374151;margin-bottom:8px;">${mobileGuideCopy.qrTitle}</div>` +
        `<img src="https://api.qrserver.com/v1/create-qr-code/?size=140x140&data=${encodeURIComponent(buildDebugQrUrl())}" width="120" height="120" style="border:1px solid rgba(17,24,39,0.1);border-radius:6px;display:block;" alt="QR code">` +
        // Cùng note password như bên "Try Navi+ menus"
        `<div style="margin-top:6px;font-size:12px;color:#9ca3af;">${mobileGuideCopy.qrPasswordNote}</div>` +
      `</div>`;
    detailContent.appendChild(mobileGuideDetail);

    // Feature "Explore CSS Selectors" by platform
    const exploreSelectorCard = document.createElement("div");
    exploreSelectorCard.dataset.featureId = "explore-css";
    exploreSelectorCard.style.cssText = "display:none;"; // Bỏ khung card; detail-content đã có padding 14px, khỏi lặp

    const SHOPIFY_THEME_FALLBACK = [
      { slug: "dawn", name: "Dawn" },
      { slug: "horizon", name: "Horizon" },
      { slug: "craft", name: "Craft" },
      { slug: "sense", name: "Sense" },
      { slug: "refresh", name: "Refresh" },
      { slug: "studio", name: "Studio" },
      { slug: "spotlight", name: "Spotlight" },
      { slug: "origin", name: "Origin" },
      { slug: "crave", name: "Crave" },
      { slug: "colorblock", name: "Colorblock" },
      { slug: "ride", name: "Ride" },
      { slug: "taste", name: "Taste" },
      { slug: "publisher", name: "Publisher" },
      { slug: "trade", name: "Trade" },
      { slug: "impulse", name: "Impulse" },
      { slug: "motion", name: "Motion" },
      { slug: "expanse", name: "Expanse" },
      { slug: "warehouse", name: "Warehouse" },
      { slug: "prestige", name: "Prestige" },
      { slug: "impact", name: "Impact" },
      { slug: "symmetry", name: "Symmetry" },
      { slug: "broadcast", name: "Broadcast" },
      { slug: "streamline", name: "Streamline" },
      { slug: "be-yours", name: "Be Yours" },
      { slug: "pipeline", name: "Pipeline" },
      { slug: "empire", name: "Empire" },
      { slug: "turbo", name: "Turbo" },
      { slug: "focal", name: "Focal" },
      { slug: "showcase", name: "Showcase" },
      { slug: "enterprise", name: "Enterprise" },
      { slug: "editions", name: "Editions" },
      { slug: "electro", name: "Electro" },
      { slug: "flow", name: "Flow" },
      { slug: "district", name: "District" },
      { slug: "parallax", name: "Parallax" },
      { slug: "showtime", name: "Showtime" },
      { slug: "icon", name: "Icon" },
      { slug: "split", name: "Split" },
      { slug: "xtra", name: "Xtra" },
      { slug: "minion", name: "Minion" },
      { slug: "mono", name: "Mono" },
      { slug: "modular", name: "Modular" },
      { slug: "local", name: "Local" },
    ];
    const wixSelectorRows = [
      { role: "Hamburger", selector: "#MENU_AS_CONTAINER_TOGGLE", platform: "Mobile", usedFor: "Navi+ binds here to activate the Mobile Menu" },
      { role: "Logo", selector: "#SITE_HEADER a[data-testid='linkElement'][href='/']", platform: "Mobile + Desktop", usedFor: "Fallback — insert a trigger icon before the logo" },
      { role: "Header", selector: "#SITE_HEADER", platform: "Mobile + Desktop", usedFor: "Insert the Mega Menu below the header" },
      { role: "Main menu", selector: "wix-dropdown-menu", platform: "Desktop", usedFor: "Mega Menu replaces the desktop nav contents" },
      { role: "Search icon", selector: ".wixui-search-box", platform: "Mobile + Desktop", usedFor: "Tap to open the search panel / overlay" },
      { role: "Cart icon", selector: "[data-hook='cart-icon-button']", platform: "Mobile + Desktop", usedFor: "Tap to open the cart drawer / panel" },
    ];
    const shopifyThemeEntries = [
      { slug: "dawn", name: "Dawn" }, { slug: "horizon", name: "Horizon" }, { slug: "craft", name: "Craft" }, { slug: "sense", name: "Sense" },
      { slug: "refresh", name: "Refresh" }, { slug: "studio", name: "Studio" }, { slug: "spotlight", name: "Spotlight" }, { slug: "origin", name: "Origin" },
      { slug: "crave", name: "Crave" }, { slug: "colorblock", name: "Colorblock" }, { slug: "ride", name: "Ride" }, { slug: "taste", name: "Taste" },
      { slug: "publisher", name: "Publisher" }, { slug: "trade", name: "Trade" }, { slug: "impulse", name: "Impulse" }, { slug: "motion", name: "Motion" },
      { slug: "expanse", name: "Expanse" }, { slug: "turbo", name: "Turbo" }, { slug: "warehouse", name: "Warehouse" }, { slug: "retina", name: "Retina" },
      { slug: "empire", name: "Empire" }, { slug: "boost", name: "Booster" }, { slug: "focal", name: "Focal" }, { slug: "pipeline", name: "Pipeline" },
      { slug: "handy", name: "Handy" }, { slug: "vogue", name: "Vogue" }, { slug: "loft", name: "Loft" }, { slug: "editorial", name: "Editorial" },
      { slug: "kingdom", name: "Kingdom" }, { slug: "adorn", name: "Adorn" }, { slug: "athens", name: "Athens" }, { slug: "athora", name: "Athora" },
      { slug: "avante", name: "Avante" }, { slug: "boutique", name: "Boutique" }, { slug: "cello", name: "Cello" }, { slug: "combine", name: "Combine" },
      { slug: "concept", name: "Concept" }, { slug: "district", name: "District" }, { slug: "drop", name: "Drop" }, { slug: "editions", name: "Editions" },
      { slug: "electro", name: "Electro" }, { slug: "energy", name: "Energy" }, { slug: "flawless", name: "Flawless" }, { slug: "flow", name: "Flow" },
      { slug: "flux", name: "Flux" }, { slug: "galleria", name: "Galleria" }, { slug: "gravity", name: "Gravity" }, { slug: "highlight", name: "Highlight" },
      { slug: "hyper", name: "Hyper" }, { slug: "icon", name: "Icon" }, { slug: "igloo", name: "Igloo" }, { slug: "july", name: "July" },
      { slug: "koto", name: "Koto" }, { slug: "local", name: "Local" }, { slug: "lollipop", name: "Lollipop" }, { slug: "luxe", name: "Luxe" },
      { slug: "maker", name: "Maker" }, { slug: "maranello", name: "Maranello" }, { slug: "mavon", name: "Mavon" }, { slug: "minion", name: "Minion" },
      { slug: "monochrome", name: "Monochrome" }, { slug: "palo-alto", name: "Palo Alto" }, { slug: "parallax", name: "Parallax" }, { slug: "paris", name: "Paris" },
      { slug: "prestige", name: "Prestige" }, { slug: "purity", name: "Purity" }, { slug: "refine", name: "Refine" }, { slug: "responsive", name: "Responsive" },
      { slug: "sahara", name: "Sahara" }, { slug: "satoshi", name: "Satoshi" }, { slug: "sitar", name: "Sitar" }, { slug: "sleek", name: "Sleek" },
      { slug: "spark", name: "Spark" }, { slug: "story", name: "Story" }, { slug: "sunrise", name: "Sunrise" }, { slug: "supreme", name: "Supreme" },
      { slug: "swiss", name: "Swiss" }, { slug: "vantage", name: "Vantage" }, { slug: "veena", name: "Veena" }, { slug: "viola", name: "Viola" },
      { slug: "vision", name: "Vision" }, { slug: "volume", name: "Volume" }, { slug: "wonder", name: "Wonder" }, { slug: "yuva", name: "Yuva" },
      { slug: "zest", name: "Zest" }, { slug: "agile", name: "Agile" }, { slug: "alchemy", name: "Alchemy" }, { slug: "align", name: "Align" },
      { slug: "allure", name: "Allure" }, { slug: "ascent", name: "Ascent" }, { slug: "atlantic", name: "Atlantic" }, { slug: "aurora", name: "Aurora" },
      { slug: "avenue", name: "Avenue" }, { slug: "baseline", name: "Baseline" }, { slug: "be-yours", name: "Be Yours" }, { slug: "berlin", name: "Berlin" },
      { slug: "beyond", name: "Beyond" }, { slug: "blockshop", name: "Blockshop" }, { slug: "blum", name: "Blum" }, { slug: "broadcast", name: "Broadcast" },
      { slug: "bullet", name: "Bullet" }, { slug: "canopy", name: "Canopy" }, { slug: "cascade", name: "Cascade" }, { slug: "cornerstone", name: "Cornerstone" },
      { slug: "desert", name: "Desert" }, { slug: "digital", name: "Digital" }, { slug: "distinctive", name: "Distinctive" }, { slug: "edge", name: "Edge" },
      { slug: "enterprise", name: "Enterprise" }, { slug: "envy", name: "Envy" }, { slug: "eurus", name: "Eurus" }, { slug: "expression", name: "Expression" },
      { slug: "fashionopolism", name: "Fashionopolism" }, { slug: "foodie", name: "Foodie" }, { slug: "force", name: "Force" }, { slug: "futurer", name: "Futurer" },
      { slug: "gain", name: "Gain" }, { slug: "grid", name: "Grid" }, { slug: "habitat", name: "Habitat" }, { slug: "honey", name: "Honey" },
      { slug: "ignite", name: "Ignite" }, { slug: "impact", name: "Impact" }, { slug: "kidu", name: "Kidu" }, { slug: "krank", name: "Krank" },
      { slug: "madrid", name: "Madrid" }, { slug: "maximize", name: "Maximize" }, { slug: "minimalista", name: "Minimalista" }, { slug: "modular", name: "Modular" },
      { slug: "monaco", name: "Monaco" }, { slug: "monk", name: "Monk" }, { slug: "mono", name: "Mono" }, { slug: "motto", name: "Motto" },
      { slug: "neat", name: "Neat" }, { slug: "next", name: "Next" }, { slug: "nexus", name: "Nexus" }, { slug: "nimbus", name: "Nimbus" },
      { slug: "nordic", name: "Nordic" }, { slug: "normcore", name: "Normcore" }, { slug: "outsiders", name: "Outsiders" }, { slug: "paper", name: "Paper" },
      { slug: "pebble", name: "Pebble" }, { slug: "piano", name: "Piano" }, { slug: "pursuit", name: "Pursuit" }, { slug: "reformation", name: "Reformation" },
      { slug: "release", name: "Release" }, { slug: "retro", name: "Retro" }, { slug: "shapes", name: "Shapes" }, { slug: "shine", name: "Shine" },
      { slug: "showcase", name: "Showcase" }, { slug: "showtime", name: "Showtime" }, { slug: "space", name: "Space" }, { slug: "starlite", name: "Starlite" },
      { slug: "stiletto", name: "Stiletto" }, { slug: "stockmart", name: "Stockmart" }, { slug: "streamline", name: "Streamline" }, { slug: "stretch", name: "Stretch" },
      { slug: "symmetry", name: "Symmetry" }, { slug: "taiga", name: "Taiga" }, { slug: "testament", name: "Testament" }, { slug: "toyo", name: "Toyo" },
      { slug: "ultra", name: "Ultra" }, { slug: "unity", name: "Unity" }, { slug: "venue", name: "Venue" }, { slug: "vetro", name: "Vetro" },
      { slug: "victory", name: "Victory" }, { slug: "vivid", name: "Vivid" }, { slug: "wave", name: "Wave" }, { slug: "whisk", name: "Whisk" },
      { slug: "woodstock", name: "Woodstock" }, { slug: "xclusive", name: "Xclusive" }, { slug: "xtra", name: "Xtra" }, { slug: "zenith", name: "Zenith" },
      { slug: "charge", name: "Charge" }, { slug: "relax", name: "Relax" }, { slug: "emerge", name: "Emerge" }, { slug: "mr-parker", name: "Mr Parker" },
      { slug: "split", name: "Split" },
    ];

    /* Theme phổ biến (theme mặc định/miễn phí chính thức của Shopify) tách nhóm riêng lên
       đầu dropdown — trước đây .sort() theo alphabet xoá mất thứ tự ưu tiên đã định nghĩa ở trên. */
    const POPULAR_SHOPIFY_THEME_SLUGS = ["dawn", "horizon", "craft", "sense", "refresh", "studio", "spotlight", "origin"];
    const popularThemeEntries = POPULAR_SHOPIFY_THEME_SLUGS
      .map((slug) => shopifyThemeEntries.find((t) => t.slug === slug))
      .filter(Boolean);
    const otherThemeEntries = shopifyThemeEntries
      .filter((t) => !POPULAR_SHOPIFY_THEME_SLUGS.includes(t.slug))
      .sort((a, b) => a.name.localeCompare(b.name));
    const EXPLORE_THEME_STORAGE_KEY = "navi_debug_explore_shopify_theme_slug";

    /* Tự đoán theme hiện tại từ storefront để preselect dropdown.
       Ưu tiên Shopify.theme.name, fallback qua vài meta/global phổ biến. */
    const detectCurrentShopifyTheme = () => {
      const picks = [];
      try {
        if (window.Shopify && window.Shopify.theme) {
          if (window.Shopify.theme.name) picks.push(String(window.Shopify.theme.name));
          if (window.Shopify.theme.theme_store_id) picks.push(String(window.Shopify.theme.theme_store_id));
        }
      } catch (e) {}
      try {
        const m = document.querySelector("meta[name='theme-name']");
        if (m && m.content) picks.push(String(m.content));
      } catch (e) {}
      try {
        if (window.theme && window.theme.name) picks.push(String(window.theme.name));
      } catch (e) {}
      return picks
        .map((s) => String(s || "").trim())
        .filter(Boolean);
    };

    /* Trả về entry theme khớp (hoặc null) thay vì gán trực tiếp vào 1 <select> —
       để dùng chung được cho combobox (input) thay vì <select> thuần. */
    const preselectShopifyTheme = (entries) => {
      if (!entries || !entries.length) return null;
      const candidates = detectCurrentShopifyTheme();
      if (!candidates.length) return null;

      const norm = (s) => toSlug(String(s || "").toLowerCase());
      const entryBySlug = new Map(entries.map((e) => [String(e.slug), e]));

      for (const raw of candidates) {
        const n = norm(raw);
        if (!n) continue;
        if (entryBySlug.has(n)) return entryBySlug.get(n);
        const hit = entries.find((e) => n.includes(e.slug) || e.slug.includes(n) || norm(e.name) === n);
        if (hit) return hit;
      }
      return null;
    };
    const toSlug = (s) => String(s || "").trim().toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");

    const platformRow = document.createElement("div");
    platformRow.style.cssText = "display:flex;flex-direction:column;gap:6px;";
    platformRow.innerHTML = "<div style='font-size:12px;font-weight:700;color:#111827'>Choose platform</div>";
    const platformTabs = document.createElement("div");
    platformTabs.style.cssText = "display:flex;gap:6px;flex-wrap:wrap;";
    const platformItems = [
      { id: "shopify", label: "Shopify" },
      { id: "wix", label: "Wix" },
      { id: "wordpress", label: "Wordpress" }
    ];
    let activePlatform = "shopify";
    const setPlatformTab = (platform) => {
      activePlatform = platform;
      Array.from(platformTabs.querySelectorAll("[data-platform-tab]")).forEach((btn) => {
        const isOn = btn.getAttribute("data-platform-tab") === platform;
        btn.style.background = isOn ? "#111827" : "#fff";
        btn.style.color = isOn ? "#fff" : "#111827";
        btn.style.borderColor = isOn ? "#111827" : "rgba(17,24,39,0.16)";
      });
      renderExploreZone();
    };
    platformItems.forEach((p) => {
      const tabBtn = document.createElement("button");
      tabBtn.type = "button";
      tabBtn.setAttribute("data-platform-tab", p.id);
      tabBtn.textContent = p.label;
      tabBtn.style.cssText = "height:30px;padding:0 10px;border:1px solid rgba(17,24,39,0.16);border-radius:999px;background:#fff;color:#111827;font-size:12px;font-weight:600;cursor:pointer;";
      tabBtn.addEventListener("click", () => setPlatformTab(p.id));
      platformTabs.appendChild(tabBtn);
    });
    platformRow.appendChild(platformTabs);
    exploreSelectorCard.appendChild(platformRow);

    const dynamicZone = document.createElement("div");
    dynamicZone.style.cssText = "margin-top:10px;";
    exploreSelectorCard.appendChild(dynamicZone);

    const renderExploreZone = () => {
      const platform = activePlatform;
      dynamicZone.innerHTML = "";
      if (platform === "wordpress") {
        dynamicZone.innerHTML = "<div style='padding:10px;border:1px solid rgba(245,158,11,0.35);background:rgba(245,158,11,0.08);border-radius:8px;font-size:12.5px;color:#92400e'>WordPress is not supported yet for selector exploration by theme.</div>";
        return;
      }
      if (platform === "wix") {
        dynamicZone.innerHTML =
          "<div style='font-size:12px;font-weight:700;color:#111827;margin-bottom:6px'>Wix navigation selector map — copy into the fields below</div>" +
          "<div style='font-size:12px;color:#6b7280;margin-bottom:8px'>These CSS selectors are the same on every Wix site — click any to copy. You can still override them.</div>" +
          "<div style='display:grid;gap:8px'>" +
          wixSelectorRows.map((r) =>
            "<div style='border:1px solid rgba(17,24,39,0.10);border-radius:8px;background:#fff;padding:9px'>" +
              `<div style='font-size:12px;font-weight:700;color:#111827'>${r.role}</div>` +
              `<div style='font-size:11px;color:#6b7280;margin-top:2px'>${r.platform}</div>` +
              `<div style='font-size:12px;color:#374151;margin-top:6px;line-height:1.45'>${r.usedFor}</div>` +
              `<button type='button' data-copy-selector='${r.selector.replace(/'/g, "&#39;")}' style='margin-top:7px;border:1px solid rgba(17,24,39,0.14);background:#f9fafb;border-radius:7px;padding:5px 7px;cursor:pointer;text-align:left;max-width:100%'><code style='font-size:11px;background:transparent;padding:0'>${r.selector}</code></button>` +
            "</div>"
          ).join("") +
          "</div>";
        Array.from(dynamicZone.querySelectorAll("[data-copy-selector]")).forEach((btn) => {
          btn.addEventListener("click", async () => {
            const sel = btn.getAttribute("data-copy-selector") || "";
            await dmCopyToClipboard(sel);
            showPanelSnackbar('Copied "' + sel + '"');
          });
        });
        return;
      }

      const wrap = document.createElement("div");
      wrap.style.cssText = "display:flex;flex-direction:column;gap:8px;";
      const lbl = document.createElement("div");
      lbl.style.cssText = "font-size:12px;font-weight:700;color:#111827;";
      lbl.textContent = "Choose a Shopify theme";
      const rootLink = document.createElement("a");
      rootLink.href = "https://naviplus.io/shopify-themes/";
      rootLink.target = "_blank";
      rootLink.rel = "noopener noreferrer";
      rootLink.textContent = "https://naviplus.io/shopify-themes/";
      rootLink.style.cssText = "font-size:12px;color:#2563eb;text-decoration:none;";
      /* Combobox 1 ô — search + chọn theme trong cùng 1 control. Input hiện text + panel nổi
         bên dưới liệt kê 2 nhóm (Most common / All themes), lọc theo ký tự gõ vào. */
      const comboWrap = document.createElement("div");
      comboWrap.style.cssText = "position:relative;";
      const comboInput = document.createElement("input");
      comboInput.type = "text";
      comboInput.autocomplete = "off";
      comboInput.placeholder = "Search or choose a theme...";
      comboInput.style.cssText = "width:100%;height:34px;border:1px solid rgba(17,24,39,0.16);border-radius:8px;padding:0 10px;font-size:13px;color:#111827;background:#fff;box-sizing:border-box;";
      const comboPanel = document.createElement("div");
      comboPanel.style.cssText = "display:none;position:absolute;top:calc(100% + 4px);left:0;right:0;max-height:260px;overflow-y:auto;background:#fff;border:1px solid rgba(17,24,39,0.16);border-radius:8px;box-shadow:0 8px 20px rgba(17,24,39,0.12);z-index:20;";
      comboWrap.appendChild(comboInput);
      comboWrap.appendChild(comboPanel);

      let selectedThemeSlug = "";

      const buildComboGroup = (label, entries) => {
        if (!entries.length) return null;
        const group = document.createElement("div");
        const groupLabel = document.createElement("div");
        groupLabel.textContent = label;
        groupLabel.style.cssText = "padding:6px 10px;font-size:11px;font-weight:700;color:#6b7280;background:#f9fafb;position:sticky;top:0;";
        group.appendChild(groupLabel);
        entries.forEach((t) => {
          const row = document.createElement("div");
          row.textContent = t.name;
          row.dataset.slug = t.slug;
          row.style.cssText = "padding:7px 10px;font-size:13px;color:#111827;cursor:pointer;";
          row.addEventListener("mouseenter", () => { row.style.background = "#f3f4f6"; });
          row.addEventListener("mouseleave", () => { row.style.background = "transparent"; });
          row.addEventListener("mousedown", (e) => {
            e.preventDefault(); /* giữ focus input, tránh blur nuốt mất click */
            comboInput.value = t.name;
            selectedThemeSlug = t.slug;
            safeLocalStorage.set(EXPLORE_THEME_STORAGE_KEY, t.slug); /* Nhớ lựa chọn cho lần mở sau */
            comboPanel.style.display = "none";
          });
          group.appendChild(row);
        });
        return group;
      };

      const renderComboPanel = (query) => {
        const q = String(query || "").trim().toLowerCase();
        const filteredPopular = q ? popularThemeEntries.filter((t) => t.name.toLowerCase().includes(q)) : popularThemeEntries;
        const filteredOther = q ? otherThemeEntries.filter((t) => t.name.toLowerCase().includes(q)) : otherThemeEntries;
        comboPanel.innerHTML = "";
        const gPopular = buildComboGroup("⭐ Most common", filteredPopular);
        const gOther = buildComboGroup("All themes (A–Z)", filteredOther);
        if (gPopular) {
          comboPanel.appendChild(gPopular);
          if (gOther) {
            /* Line phân cách giữa nhóm Most common và All themes */
            const divider = document.createElement("div");
            divider.style.cssText = "height:1px;background:rgba(17,24,39,0.10);";
            comboPanel.appendChild(divider);
          }
        }
        if (gOther) comboPanel.appendChild(gOther);
        if (!gPopular && !gOther) {
          const empty = document.createElement("div");
          empty.textContent = "No match";
          empty.style.cssText = "padding:10px;font-size:12.5px;color:#9ca3af;";
          comboPanel.appendChild(empty);
        }
      };

      comboInput.addEventListener("input", () => {
        selectedThemeSlug = ""; /* đang gõ lại → bỏ lựa chọn cũ, chờ chọn mới từ panel */
        renderComboPanel(comboInput.value);
        comboPanel.style.display = "block";
      });
      comboInput.addEventListener("focus", () => {
        renderComboPanel(comboInput.value);
        comboPanel.style.display = "block";
      });
      comboInput.addEventListener("blur", () => {
        setTimeout(() => { comboPanel.style.display = "none"; }, 120);
      });
      comboInput.addEventListener("keydown", (e) => {
        if (e.key === "Escape") { comboPanel.style.display = "none"; comboInput.blur(); }
      });

      const btn = document.createElement("button");
      btn.type = "button";
      btn.style.cssText = "height:34px;border:1px solid #111827;border-radius:8px;background:#111827;color:#fff;font-size:12.5px;font-weight:600;cursor:pointer;";
      btn.textContent = "Explore";
      btn.addEventListener("click", () => {
        const slug = selectedThemeSlug || "";
        if (!slug) return;
        window.open("https://naviplus.io/shopify-themes/" + slug + "/", "_blank");
      });
      const loadThemes = async () => {
        if (!shopifyThemeEntries.length) {
          comboInput.placeholder = "No themes available";
          return;
        }
        /* Ưu tiên theme merchant đã tự chọn ở lần trước (localStorage) — chỉ auto-detect
           theo storefront khi merchant chưa từng chọn tay lần nào. */
        const savedSlug = safeLocalStorage.get(EXPLORE_THEME_STORAGE_KEY);
        const saved = savedSlug ? shopifyThemeEntries.find((t) => t.slug === savedSlug) : null;
        const preselected = saved || preselectShopifyTheme(shopifyThemeEntries);
        if (preselected) {
          comboInput.value = preselected.name;
          selectedThemeSlug = preselected.slug;
        }
      };
      wrap.appendChild(lbl);
      wrap.appendChild(rootLink);
      wrap.appendChild(comboWrap);
      wrap.appendChild(btn);
      dynamicZone.appendChild(wrap);
      loadThemes();
    };
    setPlatformTab("shopify");
    renderExploreZone();
    detailContent.appendChild(exploreSelectorCard);

    // TASK00256. End

    /* ============================================================================================
       Feature "Try Navi+ menus" — v2 (Khoi che v1 tu dung render bang tay sinh nhieu bug, yeu cau
       lam DUNG co che showcase.naviplus.io: dung setting THAT da publish, chi tu dong hoa phan chon
       vi tri chen theo theme). Xem TASKS/TASK00405-plan-v2.md.

       Kien truc moi: KHONG tu dung setting/goi drawBottomNav() tay nua. Thay vao do tai dung co che
       `DemoMarket` (naviplus/frontend/start/DemoMarket.js + uigen_func.js.php:530-650) - DANG CHAY
       PRODUCTION THAT cho khach tu test menu publish that tren site cua ho qua `?test=1&embed=SF-xxx`.
       Co che do tu lo: fetch JSON that tu CDN, bypass dieu kien an/hien, chen floating button trigger
       cho Slide. "Turn on demo" chi can dieu huong URL kem 6 embed_id that cua shop `naviplus.io`
       (da cau hinh san qua admin dashboard binh thuong, y het cach Khoi lam cho showcase-navi-1) -
       phan con lai de DemoMarket lo, khong tu viet lai pipeline render/teardown.
       ============================================================================================ */

    const TRY_MENUS_STORAGE_KEY = "_naviplus_try_menus_demo_on";
    const TRY_MENUS_DOMAIN = "naviplus.io"; // shop chua 6 menu demo that (Khoi cung cap qua shopinfo)
    // Global market bat buoc token (Bridge::standardizeJsonName prefix "<token>_" vao ten file CDN) -
    // thieu token -> moi embed_id 404 (da verify bang curl, Khoi xac nhan URL that co token nay).
    const TRY_MENUS_TOKEN = "NAVI733440";
    // Bo Grid khoi demo (Khoi chot: "Thoi bo grid di") - khong tim duoc vi tri chen on dinh dung y,
    // 5 kind con lai (Tabbar/Slide/Mega Desktop/Mega Mobile/FAB) da verify hoat dong tot qua Playwright.
    const TRY_MENUS_EMBEDS = {
      tabbar: "SF-0626114296", // STICKY_TABBAR
      slide: "SF-4896397192", // CONTEXT_SLIDE
      megad: "SF-2311256556", // SECTION_DESKTOP_MEGAMENU (Khoi chot, thay cho SF-9101623868/SF-2613425539)
      megam: "SF-8533383207", // SECTION_MOBILE_MEGAMENU
      fab: "SF-4375927028", // STICKY_FAB_SUPPORT
      // Khôi 2026-09-21: thêm Icon Menu (Grid) — chèn DƯỚI HEADER qua placement theo spot Header (trước
      // bỏ vì "không tìm được vị trí chèn ổn định", giờ đã có selector header thật). Menu demo trên
      // naviplus.io (info.json: SF-8635789695 kind 41, desktopDisplay true).
      grid: "SF-8635789695", // SECTION_MOBILE_GRID
    };
    const TRY_MENUS_KIND_CLASS = {
      tabbar: "STICKY_TABBAR", slide: "CONTEXT_SLIDE", megad: "SECTION_DESKTOP_MEGAMENU",
      megam: "SECTION_MOBILE_MEGAMENU", fab: "STICKY_FAB_SUPPORT", grid: "SECTION_MOBILE_GRID",
    };
    // Dong bo CHINH XAC voi DemoMarket.js (_DEMO_PLACEMENT_KEY) - noi doc override nay khi
    // DemoMarket.isOwnSiteTest() active, de chen Mega dung vi tri theo theme thay vi fallback chung.
    const TRY_MENUS_PLACEMENT_SESSION_KEY = "navi_demo_placement_override";
    // TASK00501: platform THAT debugmode.js tu detect duoc (Wix/Shopify, qua detectTryMenusPlatform())
    // - naviSetting['env'] cua site prospect (khong cai Navi+ that) khong bao gio la 'wix'/'shopify' dung
    // nghia (van la 'demo' hoac rong), khien moi check dua vao section_setting['env'] === 'wix' o core
    // runtime (vd Helper._escapeGridAutoPlacement chong vo layout Wix CSS Grid) bi bo qua am tham du dang
    // chay tren site Wix that. Ghi platform detect duoc vao day, doc lai o uigen_func.js.php dau ham
    // drawBottomNav() de tu sua section_setting['env'] dung platform that (TASK00501).
    const TRY_MENUS_PLATFORM_SESSION_KEY = "navi_demo_real_platform";
    // Key sessionStorage noi bo cua DemoMarket.syncSessionParams() - xoa khi tat demo de khong tu
    // khoi phuc lai embed/domain qua session (DemoMarket doc key nay khi URL khong co param).
    const DEMO_MARKET_SESSION_KEY = "navi_demo_params";

    // Phase 2: đổi mẫu (embed_id) qua EDIT popup. State lưu sessionStorage riêng
    // (KHÔNG lẫn với TRY_MENUS_PLACEMENT_SESSION_KEY — key đó chỉ chứa selector/kind chèn Mega, cơ chế
    // CŨ đã chạy production; key mới này chỉ chứa "đang xem mẫu nào cho từng slot + config kèm theo").
    // MỌI nơi cần tìm element DOM của 1 "key" (tabbar/slide/megad/megam/fab) PHẢI đi qua
    // tryMenusEmbedIdFor(key) thay vì đọc thẳng TRY_MENUS_EMBEDS[key] — vì sau khi đổi mẫu, id thật
    // render ra DOM là SF- id của mẫu vừa chọn, không còn là id demo gốc nữa.
    const TRY_MENUS_OVERRIDES_SESSION_KEY = "_naviplus_try_menus_overrides";
    let _tryMenusOverridesCache; // undefined = chưa đọc lần nào (đọc lười từ sessionStorage khi cần)
    const readTryMenusOverrides = () => {
      if (_tryMenusOverridesCache !== undefined) return _tryMenusOverridesCache;
      try {
        const raw = sessionStorage.getItem(TRY_MENUS_OVERRIDES_SESSION_KEY);
        _tryMenusOverridesCache = raw ? JSON.parse(raw) : null;
      } catch (e) {
        _tryMenusOverridesCache = null;
      }
      return _tryMenusOverridesCache;
    };
    const writeTryMenusOverrides = (overrides) => {
      _tryMenusOverridesCache = overrides;
      try {
        if (overrides && Object.keys(overrides).length) sessionStorage.setItem(TRY_MENUS_OVERRIDES_SESSION_KEY, JSON.stringify(overrides));
        else sessionStorage.removeItem(TRY_MENUS_OVERRIDES_SESSION_KEY);
      } catch (e) {}
    };
    const tryMenusEmbedIdFor = (key) => {
      const overrides = readTryMenusOverrides();
      return (overrides && overrides[key] && overrides[key].embed) ? overrides[key].embed : TRY_MENUS_EMBEDS[key];
    };

    /* LUON dung CDN prod (khong branch theo _NAVIPLUS_VERSION) - script nay chay tren domain THAT
       cua khach (cross-origin voi moi domain naviplus.app/naviplus25), nen bat buoc can CORS.
       Da verify bang curl: dev-shopify.naviplus.app (nginx) KHONG tra access-control-allow-origin
       -> fetch cross-origin tu site khach luon fail am tham. CDN prod (Cloudflare + R2) da co
       access-control-allow-origin: * san - dung luon cho ca dev/prod. */
    const THEME_SELECTORS_URL = "https://cdn.naviplus.app/static/assets/v2/golive/theme-compat/theme-selectors.json";

    /* Fetch + cache 1 lan/phien (khong authenticated, cung JSON admin dang dung o card Theme Compat) */
    let _themeSelectorsCache = null;
    const fetchThemeSelectorsDB = async () => {
      if (_themeSelectorsCache) return _themeSelectorsCache;
      try {
        const res = await fetch(THEME_SELECTORS_URL, { credentials: "omit" });
        if (!res.ok) throw new Error("HTTP " + res.status);
        const json = await res.json();
        _themeSelectorsCache = (json && json.themes) ? json : null;
      } catch (e) {
        _themeSelectorsCache = null;
      }
      return _themeSelectorsCache;
    };

    /* Uu tien theme khach da tu chon o Explore zone (localStorage), fallback auto-detect storefront */
    const resolveShopifyThemeSelectors = async () => {
      const db = await fetchThemeSelectorsDB();
      if (!db) return null;
      const savedSlug = safeLocalStorage.get(EXPLORE_THEME_STORAGE_KEY);
      const savedEntry = savedSlug && db.themes[savedSlug] ? db.themes[savedSlug] : null;
      let slug = savedSlug && savedEntry ? savedSlug : null;
      if (!slug) {
        const detected = preselectShopifyTheme(shopifyThemeEntries);
        slug = detected ? detected.slug : null;
      }
      const entry = slug ? db.themes[slug] : null;
      return entry ? { slug, selectors: entry.selectors || {} } : null;
    };

    /* Khôi chốt: Wix KHÔNG cần chọn theme (khác Shopify 177 theme) — selector CỐ ĐỊNH cho mọi site Wix
       (đã khảo sát 6 site thật, 100% khớp renderer "classic" Thunderbolt — xem docs/decisions/wix-selectors.md).
       Global/WordPress: CHƯA hỗ trợ, báo rõ thay vì cố chạy sai. debugmode.js chạy THUẦN CLIENT trên
       site prospect lạ (không có section_setting/JS_MARKET server-side) — phải tự detect qua window/DOM. */
    const TRY_MENUS_PLATFORM_SHOPIFY = "shopify";
    const TRY_MENUS_PLATFORM_WIX = "wix";
    const TRY_MENUS_PLATFORM_UNSUPPORTED = "unsupported";
    const detectTryMenusPlatform = () => {
      if (window.Shopify && window.Shopify.theme) return TRY_MENUS_PLATFORM_SHOPIFY;
      try {
        const generatorMeta = document.querySelector('meta[name="generator"]');
        const generator = generatorMeta ? (generatorMeta.content || "") : "";
        if (/wix/i.test(generator) || document.getElementById("SITE_HEADER")) return TRY_MENUS_PLATFORM_WIX;
      } catch (e) {}
      return TRY_MENUS_PLATFORM_UNSUPPORTED;
    };

    const WIX_SELECTORS_URL = "https://cdn.naviplus.app/static/assets/v2/golive/theme-compat/wix-selectors.json";
    let _wixSelectorsCache = null;
    const fetchWixSelectorsDB = async () => {
      if (_wixSelectorsCache) return _wixSelectorsCache;
      try {
        const res = await fetch(WIX_SELECTORS_URL, { credentials: "omit" });
        if (!res.ok) throw new Error("HTTP " + res.status);
        const json = await res.json();
        _wixSelectorsCache = (json && json.roles) ? json : null;
      } catch (e) {
        _wixSelectorsCache = null;
      }
      return _wixSelectorsCache;
    };
    // Ghep "primary" + toan bo "alt" thanh 1 chuoi selector phan tach dau phay (giong cach fallback
    // chung chung cua uigen_func.js.php dung nhieu selector cung luc) - tang do phu neu Wix site co
    // bien the nho khac primary.
    const _wixRoleSelector = (role) => {
      if (!role) return null;
      const list = [role.primary].concat(Array.isArray(role.alt) ? role.alt : []).filter(Boolean);
      return list.length ? list.join(", ") : null;
    };
    const resolveWixSelectors = async () => {
      const db = await fetchWixSelectorsDB();
      if (!db || !db.roles) return null;
      const roles = db.roles;
      return {
        slug: "wix",
        selectors: {
          header: _wixRoleSelector(roles.header),
          logo: _wixRoleSelector(roles.logo),
          hamburger: _wixRoleSelector(roles.hamburger),
          mainMenu: _wixRoleSelector(roles.mainMenu),
        },
      };
    };

    /* Đọc selector do panel "Kiểm tra Selector" ghi (SEL_CHECK_SELECTORS_SESSION_KEY — cùng chuỗi
       literal ở khối panel top-level, không import chéo qua ranh giới closure được). Trả về cùng
       shape {slug, selectors} như resolveShopifyThemeSelectors() để downstream không phân biệt. */
    /* Đang "Try" 1 spot cụ thể (navi_selcheck_trying) → CHỈ đưa selector của spot đó vào demo, để
       menu demo chèn đúng 1 chỗ khách đang thử (vd thử "Main menu" thì Mega replace nav, KHÔNG đồng
       thời chèn dưới header). Zone không cần selector (tabbar/fab) → trả selectors rỗng nhưng KHÔNG
       null, để renderTryMenusDemo() không bị chặn ở "chưa chọn theme". */
    const SEL_CHECK_TRY_FIELDS = {
      header: ["header"], megaBelowHeader: ["header"], mainMenu: ["mainMenu"], hamburger: ["hamburger"], logo: ["logo"],
      tabbar: [], fab: [], grid: ["header"],
    };
    /* navi_selcheck_trying = JSON mảng id đang demo CÙNG LÚC (Khôi 2026-09-20: chọn Tab Bar rồi chọn
       FAB thì Tab Bar phải còn) — cùng chuỗi literal với khối Home top-level. */
    const readSelCheckTryingSet = () => {
      try {
        const v = JSON.parse(sessionStorage.getItem("navi_selcheck_trying") || "[]");
        return Array.isArray(v) ? v : [];
      } catch (e) { return []; }
    };
    const readSelCheckSelectorsOverride = () => {
      let raw = null;
      try { raw = JSON.parse(sessionStorage.getItem("navi_selcheck_selectors") || "null"); } catch (e) { raw = null; }
      const trying = readSelCheckTryingSet();
      if (!raw || typeof raw !== "object") raw = {};
      const fields = trying.length
        ? trying.reduce((acc, id) => acc.concat(SEL_CHECK_TRY_FIELDS[id] || []), [])
        : ["header", "mainMenu", "hamburger", "logo"];
      const selectors = {};
      fields.forEach((f) => {
        const sel = raw[f];
        if (!sel || typeof sel !== "string") return;
        try { if (document.querySelectorAll(sel).length === 1) selectors[f] = sel; } catch (e) {}
      });
      if (trying.length) return { slug: "selcheck", selectors };
      return Object.keys(selectors).length ? { slug: "selcheck", selectors } : null;
    };

    /* Dispatch theo platform — TOÀN BỘ code phía dưới (buildTryMenusPlacementOverride,
       initTryMenusPanelState...) chỉ gọi hàm này, không cần biết Shopify hay Wix — cùng field
       selectors.header/logo/hamburger/mainMenu cho cả 2 platform nên không cần sửa gì thêm ở downstream. */
    const resolveCurrentThemeSelectors = async () => {
      /* "Kiểm tra Selector" (panel #dm_selcheck_panel, ngoài closure này) đã tìm/dò tay được vị trí
         header/mainMenu/hamburger NGAY TRÊN DOM sống của site này → ưu tiên tuyệt đối trên mọi đoán
         theo theme (theme DB có thể lệch vì khách đã customize — đúng ca hafizandco.store). Chỉ nhận
         selector còn khớp đúng 1 phần tử trên trang HIỆN TẠI (sessionStorage sống qua điều hướng
         demo, nhưng trang khác của site có thể khác DOM). Rỗng/không còn khớp gì → rơi về luồng cũ. */
      const selCheck = readSelCheckSelectorsOverride();
      if (selCheck) return selCheck;
      const platform = detectTryMenusPlatform();
      if (platform === TRY_MENUS_PLATFORM_WIX) return resolveWixSelectors();
      if (platform === TRY_MENUS_PLATFORM_SHOPIFY) return resolveShopifyThemeSelectors();
      return null; // Global/WordPress hoặc không detect được — chưa hỗ trợ
    };

    /* Map selector theo theme -> override cho tung menuKindClass (doc boi uigen_func.js.php qua
       DemoMarket.getPlacementOverride()). null neu theme khong co selector nao dung duoc - khi do
       Mega van hien (DemoMarket luon force display), chi chen theo fallback chung chung co san.
       Khoi chot (feedback test that): CA 2 kind Mega (Desktop/Mobile) deu chen NGAY DUOI header
       (kind="2" insert-after), KHONG dung mode "replace" (kind="1") de tranh de mat nav that cua site
       trong luc demo (an toan hon cho sale).

       Validate LIVE tren DOM trang hien tai truoc khi tin selector cua theme (Khoi bao "khong thuc
       su o duoi header" tren nv-t62026-dev.myshopify.com — dieu tra bang Playwright xac nhan: khi
       chon DUNG theme (Dawn) thi chen chinh xac pixel-perfect ngay duoi header; khi chon SAI theme
       (vi du "turbo"/"vogue" — auto-detect that bai tren store seed/test-data, phai chon tay) thi
       selector hoac khong khop element nao tren trang nay (Helper.waitToReplaceInsertMulti timeout
       10s, menu khong bao gio hien) hoac khop nham 1 element NAM BEN TRONG chinh header that (chen
       lac vao trong subtree cua header, nhin tam on nhung sai ve cau truc). Fix: querySelector thu
       selector.header tren DOM that — khong khop gi ca thi coi nhu KHONG co override (tra ve null,
       runtime tu fallback selector chung chung), tranh bug "khong hien" hoan toan im lang.

       Dieu tra vong 2 (Playwright, tai hien duoc bug that): chon nham theme co selector.header khop
       1 element NAM TRONG chinh header that (vd "vogue"→.header, "impulse"→.header-wrapper — ca 2
       deu la con cua .section-header cua Dawn) VAN qua duoc check "khong khop gi" o tren (vi no CO
       khop — chi la khop nham element con). Ket qua: chen mega vao TRONG subtree cua header that,
       ke thua position:sticky cua header → mega bar dinh tren dau man hinh de len noi dung khac khi
       cuon (dung "chon lai theme Dawn" la het loi that, nhung them 1 lop an toan: reject match nao
       nam BEN TRONG 1 ancestor sticky/fixed KHAC chinh no — dau hieu ro rang la khop nham element
       con thay vi header goc, bat ke theme nao). */
    const isNestedInsideStickyOrFixedAncestor = (el) => {
      let node = el.parentElement;
      while (node && node !== document.body && node !== document.documentElement) {
        try {
          const pos = window.getComputedStyle(node).position;
          if (pos === "sticky" || pos === "fixed") return true;
        } catch (e) {
          return false;
        }
        node = node.parentElement;
      }
      return false;
    };
    /* Tổ tiên sticky/fixed NGOÀI CÙNG của el (null = không có). Ca thật oromonaco.com (Prestige): spot Header
       của theme DB = `x-header`, nằm TRONG `header.shopify-section--header` position:sticky → gate
       isNestedInsideStickyOrFixedAncestor() ở trên bỏ luôn spot → megad/grid rơi về fallback chung của runtime
       ("header, .header, …" = chính section sticky đó, chèn SAU) → trên trang có transparent header (x-header
       margin-block-end âm = --header-height) menu nằm DƯỚI lớp header đè lên → nhìn như "chui vào trong header",
       logo/nav/icon chồng nhau (ảnh Khôi gửi). Thay vì bỏ spot: neo vào chính thanh sticky ngoài cùng đó và chèn
       SAU nó (ra khỏi vùng dính) — đúng cả ca gate sinh ra để chặn (khớp nhầm phần tử CON của header thật → leo
       lên tới section header thật). */
    const outermostStickyOrFixedAncestor = (el) => {
      let node = el.parentElement, found = null;
      while (node && node !== document.body && node !== document.documentElement) {
        try {
          const pos = window.getComputedStyle(node).position;
          if (pos === "sticky" || pos === "fixed") found = node;
        } catch (e) { break; }
        node = node.parentElement;
      }
      return found;
    };
    /* Đánh dấu thanh sticky bằng attribute riêng (cùng cách TRY_MENUS_LOGO_MARK_ATTR) — không có id/class ổn định
       để tham chiếu; attribute mất khi reload nhưng buildTryMenusPlacementOverride() tính lại mỗi lần load. */
    const TRY_MENUS_HEADER_ANCHOR_ATTR = "data-navi-demo-header-anchor";
    /* Class nhóm section header của Shopify OS2 (`shopify-section-group-header-group`) gắn cho wrapper menu chèn
       sau thanh sticky: theme coi nó là "1 section nữa trong nhóm header" — đúng thứ merchant nhận được khi tự
       thêm section dưới header. Prestige nhờ đó tự tắt transparent header (`:not(:has(.shopify-section--header ~
       .shopify-section-group-header-group))` — đo thật oromonaco.com: header nền trắng, mega + Icon Menu nằm gọn
       dưới header, hero xuống sau; không có class thì header trong suốt đè lên menu). Chỉ copy class nhóm, KHÔNG
       copy `shopify-section`/`shopify-section--header` (MenuSection.js dò section theo `.shopify-section`,
       Prestige treo sticky/transform lên `.shopify-section--header`). */
    const TRY_MENUS_HEADER_GROUP_CLASS = "shopify-section-group-header-group";
    const resolveTryMenusHeaderAnchor = (headerEl) => {
      const stickyRoot = outermostStickyOrFixedAncestor(headerEl);
      if (!stickyRoot) return { selector: null, groupClass: "" };
      if (!stickyRoot.hasAttribute(TRY_MENUS_HEADER_ANCHOR_ATTR)) stickyRoot.setAttribute(TRY_MENUS_HEADER_ANCHOR_ATTR, "1");
      return {
        selector: "[" + TRY_MENUS_HEADER_ANCHOR_ATTR + "='1']",
        groupClass: stickyRoot.classList.contains(TRY_MENUS_HEADER_GROUP_CLASS) ? TRY_MENUS_HEADER_GROUP_CLASS : "",
      };
    };
    /* TASK00501: selectors.logo (wix-selectors.json) là 1 chuỗi combined "primary, alt1, alt2" —
       document.querySelector() trả về phần tử ĐẦU TIÊN khớp BẤT KỲ phần nào trong chuỗi, theo thứ tự
       DOM, không theo độ ưu tiên primary/alt. Alt "#SITE_HEADER [data-testid='linkElement']" (không lọc
       href) khớp NHẦM vào link điều hướng thường (vd "About", "Home") nếu nó đứng trước logo thật trong
       DOM — Khôi báo icon hiện trước "About" thay vì logo, và biến mất khi hover (nghi xung đột CSS
       ::before với hiệu ứng hover riêng của link nav — appendSlideMenuTo dùng ::before ngay trên chính
       phần tử khớp được). Ưu tiên ứng viên CHỨA ảnh/svg (logo Wix thường có icon/ảnh, khác link nav chỉ
       có chữ); không có thì loại bớt ứng viên nằm trong mainMenu (nav thật) nếu resolve được. Đánh dấu
       phần tử chọn được bằng 1 attribute riêng rồi trả về selector CHÍNH XÁC phần tử đó — tránh
       checkTriggerHamburger/appendSlideMenuTo (đọc lại bằng document.querySelector trên CHÍNH chuỗi
       combined cũ) khớp nhầm sang phần tử khác. */
    const TRY_MENUS_LOGO_MARK_ATTR = "data-navi-demo-logo-target";
    let _tryMenusLogoMarkSeq = 0;
    const resolveTryMenusLogoSelector = (selectors) => {
      if (!selectors || !selectors.logo) return null;
      let candidates;
      try { candidates = Array.prototype.slice.call(document.querySelectorAll(selectors.logo)); }
      catch (e) { return null; }
      if (!candidates.length) return null;

      let picked = candidates.find((el) => el.querySelector("svg, img"));
      if (!picked && selectors.mainMenu) {
        let mainMenuEl = null;
        try { mainMenuEl = document.querySelector(selectors.mainMenu); } catch (e) {}
        if (mainMenuEl) picked = candidates.find((el) => !mainMenuEl.contains(el));
      }
      if (!picked) picked = candidates[0]; // khong tim duoc ung vien tot hon — giu hanh vi cu (item dau tien)

      if (!picked.hasAttribute(TRY_MENUS_LOGO_MARK_ATTR)) {
        picked.setAttribute(TRY_MENUS_LOGO_MARK_ATTR, String(++_tryMenusLogoMarkSeq));
      }
      /* Logo là thẻ INLINE chứa ảnh block (Prestige: `a[href="/"]` > `img{display:block}`): appendSlideMenuTo
         (PublicFuncs.js) thêm padding-left 32px cho icon ::before → phần inline có padding thành 1 dòng riêng
         TRÊN ảnh → ô logo cao 116→169px, logo rớt xuống hero (đo thật oromonaco.com). Ép inline-block chỉ cho
         phần tử ĐÃ ĐÁNH DẤU của demo (không đụng engine — publishTriggerHamburger của khách thật giữ nguyên). */
      try {
        if (window.getComputedStyle(picked).display === "inline" && !document.getElementById("navi-demo-logo-inline-fix")) {
          const st = document.createElement("style");
          st.id = "navi-demo-logo-inline-fix";
          st.textContent = "[" + TRY_MENUS_LOGO_MARK_ATTR + "]{display:inline-block;vertical-align:middle;}";
          document.head.appendChild(st);
        }
      } catch (e) {}
      return "[" + TRY_MENUS_LOGO_MARK_ATTR + "='" + picked.getAttribute(TRY_MENUS_LOGO_MARK_ATTR) + "']";
    };
    const buildTryMenusPlacementOverride = (selectors) => {
      if (!selectors) return null;
      const map = {};
      let _headerOk = false; // header hợp lệ (qua gate sticky/fixed) — điều kiện để đặt Icon Menu ở khối dưới

      let _headerGroupClass = ""; // class nhóm header gắn cho wrapper khi neo sau thanh sticky (xem resolveTryMenusHeaderAnchor)
      if (selectors.header) {
        try {
          const headerEl = document.querySelector(selectors.header);
          if (headerEl) {
            /* Header nằm trong thanh sticky/fixed → neo sau CHÍNH thanh đó thay vì bỏ spot (trước: gate
               isNestedInsideStickyOrFixedAncestor() trả false → megad/grid rơi về fallback, vỡ trên Prestige). */
            const anchor = resolveTryMenusHeaderAnchor(headerEl);
            const headerSel = anchor.selector || selectors.header;
            _headerGroupClass = anchor.groupClass;
            map[TRY_MENUS_KIND_CLASS.megad] = { selector: headerSel, kind: "2", groupClass: _headerGroupClass }; // insert after header
            map[TRY_MENUS_KIND_CLASS.megam] = { selector: headerSel, kind: "2", groupClass: _headerGroupClass }; // insert after header
            /* Icon Menu (grid) tính ở KHỐI RIÊNG bên dưới, SAU khi đã biết mega nào ở mode Replace —
               trước đây tính ngay tại đây nên trên mobile chèn nhầm sau mega đang THAY main menu. */
            _headerOk = true;
          }
        } catch (e) {} // selector khong hop le — bo qua, dung fallback chung chung
      }

      // Phase 2 EDIT popup: "Insert below header" (mặc định, đã có ở trên) vs
      // "Replace current menu". Đọc lựa chọn mode đã lưu (_naviplus_try_menus_overrides) NGAY TẠI ĐÂY
      // (không chỉ lúc bấm Apply) vì buildTryMenusPlacementOverride() được gọi lại MỖI LẦN
      // initTryMenusPanelState() chạy (mỗi lần load trang) — nếu không tự phục hồi mode ở đây, mọi
      // reload sau khi chọn "Replace" sẽ rơi về "below header" mặc định (map bị build lại từ đầu).
      // Validate LIVE trên DOM hiện tại (giống cách selectors.header ở trên) — selector sai/không khớp
      // gì thì GIỮ NGUYÊN "below header" đã set ở trên (an toàn hơn, không có nguy cơ "replace nhầm").
      const _tryMenusOverridesForMode = readTryMenusOverrides();
      ["megad", "megam"].forEach((key) => {
        const wantReplace = _tryMenusOverridesForMode && _tryMenusOverridesForMode[key] && _tryMenusOverridesForMode[key].mode === "replace";
        if (!wantReplace || !selectors.mainMenu) return;
        try {
          const mainMenuEl = document.querySelector(selectors.mainMenu);
          if (mainMenuEl) {
            map[TRY_MENUS_KIND_CLASS[key]] = { selector: selectors.mainMenu, kind: "1" }; // replace
            /* Ghi thêm entry theo CHÍNH embed của slot (DemoMarket.getPlacementOverride ưu tiên embed):
               slot megam có thể đang chứa 1 Mega DESKTOP ngắn (Home "Kiểm tra Selector", spot Main menu)
               — nếu chỉ keyed theo kind, nó sẽ ăn entry SECTION_DESKTOP_MEGAMENU (= "dưới header" của
               slot megad) và cả 2 mega desktop chèn cùng 1 chỗ. */
            map[tryMenusEmbedIdFor(key)] = { selector: selectors.mainMenu, kind: "1" };
          }
        } catch (e) {}
      });

      /* Icon Menu cũng dưới header; khi Header (Mega) cùng demo → chèn SAU chính Mega đó để thứ tự
         luôn header → Mega → Icon Menu (Khôi 2026-09-21). Mega được vẽ trước nên selector id đã có;
         waitToReplaceInsertMulti của runtime vẫn chờ tới 10s nếu trễ.
         CHỈ nối sau mega đang ở mode "dưới header" (kind "2"). Ca Khôi báo (popup "Test website on
         mobile", Dawn): thử Header + Current main menu + Icon Menu → trên mobile slot megam là mega
         REPLACE main menu (kind "1", nằm TRONG `header.header` display:grid của theme) → grid chèn sau
         nó = thành 1 ô của CSS grid theme → grid co còn nửa màn, logo bị ép thành cột 1 ký tự. Mega
         của viewport hiện tại không ở dưới header → chèn thẳng sau header. Đo lại: `naviman_app` của
         grid là con trực tiếp của `.section-header`, không còn nằm trong `header.header`. */
      if (_headerOk) {
        let _megaAbove = null;
        if (readSelCheckTryingSet().indexOf("header") !== -1) {
          const _vpKey = (window.matchMedia && window.matchMedia("(max-width: 768px)").matches) ? "megam" : "megad";
          const _vpEmbed = tryMenusEmbedIdFor(_vpKey);
          const _vpPlacement = map[_vpEmbed] || map[TRY_MENUS_KIND_CLASS[_vpKey]];
          if (_vpPlacement && _vpPlacement.kind === "2") _megaAbove = _vpEmbed;
        }
        /* Không có mega phía trên → chèn sau cùng neo header đã tính (thanh sticky nếu có, không phải selector
           thô) + cùng class nhóm; nối sau mega thì wrapper mega đã mang class rồi, grid không cần. */
        const _headerAnchorSel = (map[TRY_MENUS_KIND_CLASS.megad] && map[TRY_MENUS_KIND_CLASS.megad].selector) || selectors.header;
        map[TRY_MENUS_KIND_CLASS.grid] = _megaAbove
          ? { selector: "#" + _megaAbove, kind: "2" }
          : { selector: _headerAnchorSel, kind: "2", groupClass: _headerGroupClass };
      }

      /* Khôi chốt: trên desktop, ngoài trigger nổi (#navi-test-slide-fab), CHÈN THÊM icon hamburger
         trước logo thật của site — dùng đúng field runtime có sẵn `publishTriggerHamburger`
         (Menu.Context.checkTriggerHamburger, MenuContext.js:380-425), cú pháp
         "selector|color|boxed|side(device)". Suffix "(D)" đã tự giới hạn desktop trong CHÍNH runtime —
         không cần tự viết matchMedia riêng cho phần này.
         Màu #777 (xám trung tính) thay vì #111827 (đen) — Khôi báo icon đen chìm mất trên header nền
         đen của theme test (nv-t62026-dev/Dawn); #777 tương phản được cả nền sáng lẫn nền tối, không
         biết trước header thật site prospect sẽ sáng hay tối. */
      if (selectors.logo) {
        try {
          const logoSelector = resolveTryMenusLogoSelector(selectors);
          if (logoSelector) {
            map[TRY_MENUS_KIND_CLASS.slide] = Object.assign({}, map[TRY_MENUS_KIND_CLASS.slide],
              { hamburger: logoSelector + "|#777|false|left(D)" });
          }
        } catch (e) {}
      }

      /* Khôi chốt: "phải gắn Slide menu vào default hamburger của họ chứ?" — gắn THẲNG vào hamburger
         THẬT của theme (Method 1, publishTriggerIDClass — Menu.Context.checkTriggerIDClass,
         MenuContext.js:341-370, CHÍNH cơ chế khách hàng thật đang dùng production) thay vì chỉ dựa vào
         nút nổi tự tạo. uigen_func.js.php nối thêm selector này vào SAU nút nổi (phân tách dấu phẩy —
         publishTriggerIDClass hỗ trợ nhiều selector cùng lúc) — không thay thế, không cần tự đoán
         thiết bị: hamburger thật của theme thường tự ẩn/hiện đúng theo CSS gốc của chính theme đó
         (thường chỉ hiện mobile), nút nổi lo phần desktop khi theme không có hamburger hiển thị. */
      if (selectors.hamburger) {
        try {
          if (document.querySelector(selectors.hamburger)) {
            map[TRY_MENUS_KIND_CLASS.slide] = Object.assign({}, map[TRY_MENUS_KIND_CLASS.slide],
              { trigger: selectors.hamburger });
          }
        } catch (e) {}
      }

      return Object.keys(map).length ? map : null;
    };

    /* Ten kind noi bo + mo ta vi tri chen bang tieng Anh de hieu - bao ro cho Khoi "da them loai
       menu gi, o dau" sau khi bat demo (Khoi chot: khong duoc im lang). */
    const describeTryMenusPosition = (key, override) => {
      switch (key) {
        case "tabbar": return "Tab Bar — fixed bar at the bottom of the screen";
        case "fab": return "FAB — floating button (bottom-right)";
        case "grid": return "Icon Menu — inserted below your site header";
        case "slide": return "Mobile Menu — tap the black “Open Mobile menu” tab (left edge, middle of screen)";
        case "megad":
          return (override && override[TRY_MENUS_KIND_CLASS.megad])
            ? "Mega Menu (Desktop) — inserted below your site header"
            : "Mega Menu (Desktop) — inserted near your header (generic position — theme selector not found)";
        case "megam":
          return (override && override[TRY_MENUS_KIND_CLASS.megam])
            ? "Mega Menu (Mobile) — inserted below your site header"
            : "Mega Menu (Mobile) — inserted near your header (generic position — theme selector not found)";
        default: return key;
      }
    };

    /* Cham do loang ("click here") - 1 rAF ticker dung chung, bam theo getBoundingClientRect cua target.
       Target gio la ID THAT (SF-xxxxxxxxxx) do DemoMarket ve, khong con "navidemo-*" tu dat. */
    const PULSE_STYLE_ID = "navi_demo_pulse_style";
    const ensurePulseStyle = () => {
      if (document.getElementById(PULSE_STYLE_ID)) return;
      const style = document.createElement("style");
      style.id = PULSE_STYLE_ID;
      style.textContent =
        ".navi-demo-pulse-dot{position:fixed;width:14px;height:14px;border-radius:50%;background:#ef4444;" +
        "pointer-events:none;z-index:2147483000;box-shadow:0 0 0 0 rgba(239,68,68,.7);" +
        "animation:navi-demo-pulse-ring 1.6s ease-out infinite;}" +
        "@keyframes navi-demo-pulse-ring{0%{box-shadow:0 0 0 0 rgba(239,68,68,.55)}70%{box-shadow:0 0 0 16px rgba(239,68,68,0)}100%{box-shadow:0 0 0 0 rgba(239,68,68,0)}}";
      document.head.appendChild(style);
    };
    let _pulseMarkers = [];
    let _pulseRafId = null;
    // TASK00481: tập các menu demo đang bị TẮT qua toggle trong khung "Added N demo menus". Chấm pulse
    // mang cùng key (vd "slide") sẽ tự ẩn khi key nằm trong set này; element menu tự ẩn bằng display:none.
    // TASK00610: cache qua sessionStorage — trước đây chỉ là Set trong bộ nhớ, mất ngay khi reload trang
    // hoặc Turn off/Turn on demo lại (cả 2 đều là điều hướng full-page), luôn quay lại đủ 5 menu mặc định
    // dù vừa tắt bớt. sessionStorage (không localStorage) vì đây là lựa chọn của LẦN TEST hiện tại — cùng
    // đời sống với TRY_MENUS_OVERRIDES_SESSION_KEY/TRY_MENUS_PLACEMENT_SESSION_KEY cạnh nó (tự mất khi
    // đóng tab), và KHÔNG bị teardownTryMenusDemo() xoá khi "Turn off demo" (khác overrides mẫu — Khôi
    // chỉ muốn giữ lựa chọn ẩn/hiện, không yêu cầu giữ mẫu đã đổi).
    const TRY_MENUS_HIDDEN_SESSION_KEY = "_naviplus_try_menus_hidden_keys";
    const readTryMenusHiddenKeys = () => {
      try {
        const arr = JSON.parse(sessionStorage.getItem(TRY_MENUS_HIDDEN_SESSION_KEY) || "[]");
        return new Set(Array.isArray(arr) ? arr : []);
      } catch (e) {
        return new Set();
      }
    };
    const writeTryMenusHiddenKeys = (set) => {
      try {
        if (set.size) sessionStorage.setItem(TRY_MENUS_HIDDEN_SESSION_KEY, JSON.stringify(Array.from(set)));
        else sessionStorage.removeItem(TRY_MENUS_HIDDEN_SESSION_KEY);
      } catch (e) {}
    };
    const _tryMenusHiddenKeys = readTryMenusHiddenKeys();

    // state cho cụm nút EDIT/USE THIS (Phase 1). Khai báo TRƯỚC _tickPulseMarkers
    // vì hàm đó được mở rộng bên dưới để cập nhật vị trí cụm nút trong CÙNG 1 vòng lặp rAF (đọc top-down).
    const _tryMenusActionClusters = new Map(); // key ("tabbar"/"slide"/"megad"/"megam"/"fab") -> { wrap, editBtn, useBtn }
    // Hook tuỳ chọn: Phase 2 gán hàm popup EDIT thật vào đây sau khi định nghĩa xong (typeof-guard hợp lệ
    // theo CLAUDE.md — 2 phase khác nhau, thứ tự "đã wire hay chưa" không đảm bảo tại thời điểm Phase 1 chạy riêng).
    let _tryMenusEditPopupFn = null;
    // Hook tuỳ chọn tương tự — Phase 3 gán hàm requestUseThis(key) thật vào đây (khối relay debug-bridge,
    // định nghĩa RẤT XA phía dưới, sau cả khối EDIT popup Phase 2).
    let _tryMenusUseThisFn = null;

    const _tickPulseMarkers = () => {
      _pulseMarkers.forEach((m) => {
        // Menu chứa chấm này đang bị toggle TẮT → ẩn chấm (không định vị)
        if (m.key && _tryMenusHiddenKeys.has(m.key)) { m.el.style.display = "none"; return; }
        if (!m.target || !m.target.isConnected) { m.el.style.display = "none"; return; }
        const r = m.target.getBoundingClientRect();
        if (!r.width && !r.height) { m.el.style.display = "none"; return; }
        m.el.style.display = "block";
        m.el.style.top = (r.top - 6) + "px";
        // anchor "left" — dùng cho icon-trước-logo (icon nằm bên TRÁI logo, chấm ở r.right sẽ chồng
        // lan qua chữ logo — Khôi báo "chấm đỏ cạnh logo lan sang cả logo"). Mặc định vẫn r.right (góc
        // trên-phải target) cho các nút bấm nhỏ khác (FAB, slide-fab, hamburger thật).
        m.el.style.left = (m.anchor === "left" ? (r.left - 8) : (r.right - 8)) + "px";
      });
      // cập nhật vị trí cụm nút EDIT/USE THIS trong CÙNG vòng lặp rAF này (tránh
      // mở thêm 1 rAF loop thứ 2 chạy song song đo lại DOM liên tục — theo đúng gợi ý plan Phase 1).
      _tryMenusActionClusters.forEach((c, key) => {
        if (_tryMenusHiddenKeys.has(key)) { c.wrap.style.display = "none"; return; }
        const targetEl = _resolveActionTargetEl(key);
        if (!targetEl || !targetEl.isConnected) { c.wrap.style.display = "none"; return; }
        const tr = targetEl.getBoundingClientRect();
        if (!tr.width && !tr.height) { c.wrap.style.display = "none"; return; }
        c.wrap.style.display = "flex";
        _positionActionCluster(key, c.wrap, targetEl);
      });

      // TASK00519-fix. Loop này trước đây tự tái lặp requestAnimationFrame VÔ HẠN, kể cả sau khi demo
      // đã tắt (không có cancelAnimationFrame nào trong file) — chạy suốt đời trang, ~60 lần/giây, mỗi
      // lần đo DOM (getBoundingClientRect) cho mọi pulse marker + action cluster dù rỗng. Tự dừng khi
      // không còn gì để theo dõi; mọi nơi thêm marker/cluster mới đều đã có sẵn guard
      // `if (!_pulseRafId) _tickPulseMarkers();` (dòng ~3202/3350) nên loop tự khởi động lại đúng lúc.
      if (!_pulseMarkers.length && !_tryMenusActionClusters.size) { _pulseRafId = null; return; }
      _pulseRafId = window.requestAnimationFrame(_tickPulseMarkers);
    };
    const addPulseMarker = (targetEl, anchor, key) => {
      if (!targetEl) return;
      ensurePulseStyle();
      const dot = document.createElement("div");
      dot.className = "navi-demo-pulse-dot";
      dot.setAttribute("data-navi-demo-pulse", "1");
      document.body.appendChild(dot);
      // key = menu demo mà chấm này thuộc về (để toggle bật/tắt ẩn/hiện cùng menu). null = không gắn menu nào.
      _pulseMarkers.push({ el: dot, target: targetEl, anchor: anchor || "right", key: key || null });
      if (!_pulseRafId) _tickPulseMarkers();
    };

    // Overlay 2 nút EDIT / USE THIS trên góc phải-trên mỗi menu demo (Phase 1).
    // Style inject bằng JS (ensureActionBtnStyle) — theo đúng pattern sẵn có của ensurePulseStyle(),
    // không có file CSS riêng cho debugmode.js (xem docs/decisions/try-navi-menus-demo-market-reuse.md).
    const ACTION_BTN_STYLE_ID = "navi_demo_action_style";
    const ensureActionBtnStyle = () => {
      if (document.getElementById(ACTION_BTN_STYLE_ID)) return;
      const style = document.createElement("style");
      style.id = ACTION_BTN_STYLE_ID;
      style.textContent =
        ".navi-demo-actions{position:fixed;z-index:2147483001;display:flex;gap:4px;pointer-events:auto;" +
        "font-family:ui-sans-serif,system-ui,-apple-system,Segoe UI,Roboto,Helvetica,Arial;}" +
        ".navi-demo-actions button{border:none;border-radius:6px;background:#111827;color:#fff;" +
        "font-size:11px;font-weight:600;line-height:1;padding:6px 9px;cursor:pointer;white-space:nowrap;" +
        "box-shadow:0 2px 8px rgba(0,0,0,0.28);}" +
        ".navi-demo-actions button:hover{background:#000;}" +
        ".navi-demo-actions button[data-act='use']{background:#166534;}" +
        ".navi-demo-actions button[data-act='use']:hover{background:#14532d;}" +
        "@media (max-width:768px){.navi-demo-actions button{padding:0;font-size:0;width:26px;height:26px;" +
        "display:flex;align-items:center;justify-content:center;}" +
        ".navi-demo-actions button[data-act='edit']::before{content:'\\270E';font-size:12px;}" +
        ".navi-demo-actions button[data-act='use']::before{content:'\\FF0B';font-size:14px;}}";
      document.head.appendChild(style);
    };

    /* Stub dùng chung panel snackbar (position:fixed, z-index tối đa, KHÔNG phụ thuộc panel debug đang
       mở/đóng — xem #dm_panel_snackbar CSS + showPanelSnackbar() bên dưới trong cùng file). USE THIS
       còn stub tới hết Phase 2 (Phase 3 sẽ thay bằng requestUseThis(key) thật, ngoài phạm vi lượt này). */
    const _tryMenusActionStub = (label) => {
      showPanelSnackbar(label + " — coming soon");
    };

    /* Tạo 1 cụm nút cho 1 menu demo (key trong TRY_MENUS_EMBEDS). Click EDIT gọi hook _tryMenusEditPopupFn
       nếu Phase 2 đã wire (typeof-guard hợp lệ — hook tuỳ chọn), chưa có thì fallback toast "coming soon"
       để Phase 1 test độc lập được ngay. Click USE THIS luôn stub trong lượt này (Phase 3 chưa làm). */
    const createTryMenusActionCluster = (key) => {
      if (_tryMenusActionClusters.has(key)) return;
      ensureActionBtnStyle();
      const wrap = document.createElement("div");
      wrap.className = "navi-demo-actions";
      wrap.dataset.naviDemoActions = key;
      const editBtn = document.createElement("button");
      editBtn.type = "button";
      editBtn.dataset.act = "edit";
      editBtn.textContent = "EDIT";
      editBtn.addEventListener("click", (e) => {
        e.stopPropagation();
        if (typeof _tryMenusEditPopupFn === "function") _tryMenusEditPopupFn(key);
        else _tryMenusActionStub("Edit");
      });
      const useBtn = document.createElement("button");
      useBtn.type = "button";
      useBtn.dataset.act = "use";
      useBtn.textContent = "ADD MENU";
      useBtn.addEventListener("click", (e) => {
        e.stopPropagation();
        // TASK00519 Phase 3: requestUseThis(key) thật (relay debug-bridge) — wire cuối khối Phase 3B.
        // Fallback stub CHỈ có nghĩa lý thuyết (Phase 3 luôn nằm trong cùng file, cùng IIFE, wire xong
        // trước khi user kịp click) — giữ để không crash nếu code sau này bị tách/refactor giữa chừng.
        if (typeof _tryMenusUseThisFn === "function") _tryMenusUseThisFn(key);
        else _tryMenusActionStub("Use this");
      });
      wrap.appendChild(editBtn);
      wrap.appendChild(useBtn);
      document.body.appendChild(wrap);
      _tryMenusActionClusters.set(key, { wrap, editBtn, useBtn });
    };
    const removeTryMenusActionCluster = (key) => {
      const c = _tryMenusActionClusters.get(key);
      if (!c) return;
      c.wrap.remove();
      _tryMenusActionClusters.delete(key);
    };
    const removeAllTryMenusActionClusters = () => {
      _tryMenusActionClusters.forEach((c) => c.wrap.remove());
      _tryMenusActionClusters.clear();
    };

    // TASK00519-fix. Trước đây KHÔNG có hàm dọn toàn bộ _pulseMarkers khi tắt demo (chỉ có
    // removeMarkerFor lẻ từng target trong attachTryMenusPulseMarkers) — entry cũ (dot đã disconnect
    // khỏi DOM) ở lại mãi trong mảng, khiến điều kiện dừng vòng lặp rAF (_tickPulseMarkers) không bao
    // giờ kích hoạt thật sự sau khi Turn off demo. Dọn sạch cả element lẫn mảng ở đây.
    const removeAllPulseMarkers = () => {
      _pulseMarkers.forEach((m) => { if (m.el && m.el.remove) m.el.remove(); });
      _pulseMarkers = [];
    };

    /* Element mục tiêu để bám theo cho từng key. SLIDE đặc biệt (giống attachTryMenusPulseMarkers ở
       trên): panel CONTEXT_SLIDE ẩn/off-canvas khi đóng — bám rect có kích thước thật + nằm trong
       viewport thì coi là "đang mở". Khôi chốt 2026-07-23: slide ĐÓNG thì KHÔNG hiện cụm nút ở đâu cả
       (trả null → rAF tick tự ẩn) — trước đây bám trigger #navi-test-slide-fab nhưng slide có tới 3
       điểm trigger (trigger dọc mép trái, icon chèn cạnh logo, hamburger theme) nên nút nổi cạnh
       trigger gây rối; mở slide ra rồi EDIT/USE THIS trên panel là đủ. 4 kind còn lại bám thẳng
       element #SF-xxx — id THẬT (có thể đã bị đổi mẫu qua EDIT popup Phase 2, luôn tra qua
       tryMenusEmbedIdFor(key), KHÔNG đọc thẳng TRY_MENUS_EMBEDS). */
    const _resolveActionTargetEl = (key) => {
      if (key === "slide") {
        const panelEl = document.getElementById(tryMenusEmbedIdFor("slide"));
        if (panelEl) {
          /* Điều kiện "đang mở" dùng ĐÚNG tín hiệu core đang dùng để đóng slide (Helper.js ~:1016-1023,
             handleTouchOutsideAllMenus): computed `visibility === "visible"`. KHÔNG check bằng rect —
             drawer CONTEXT_SLIDE khi đóng vẫn GIỮ NGUYÊN kích thước/vị trí trong layout, chỉ ẩn bằng
             visibility:hidden, nên mọi heuristic width/height (2 bản trước: >4 rồi ≥150×200) đều pass
             cả lúc đóng → cụm nút hiện nhầm cạnh icon logo (Khôi báo 2 lần 2026-07-23). */
          const r = panelEl.getBoundingClientRect();
          if (window.getComputedStyle(panelEl).visibility === "visible" && r.width > 4 && r.right > 0 && r.left < window.innerWidth) return panelEl;
        }
        return null;
      }
      return document.getElementById(tryMenusEmbedIdFor(key));
    };

    /* Toạ độ cụm nút theo rect element mục tiêu — xử lý RIÊNG theo kind (không dùng chung 1 công thức):
       - fab: đặt PHÍA TRÊN nút tròn (không đè lên nút), canh phải.
       - tabbar: đặt PHÍA TRÊN thanh bar, canh phải (Khôi báo 2026-07-23: đặt trong bar đè lên item
         cuối — bar mỏng, góc phải-trên của bar chính là chỗ item cuối nằm).
       - còn lại (slide-panel-mở/megad/megam): góc phải-trên của target, nhích vào trong 6px (panel/
         section cao, góc trên thường là vùng trống).
         (Slide ĐÓNG không còn hiện cụm nút — Khôi chốt 2026-07-23, xem _resolveActionTargetEl —
         nên nhánh "đặt cạnh trigger dọc" trước đây đã gỡ.)
       Luôn kẹp trong viewport ở cuối — TABBAR dock phải sát mép desktop (desktopPosition RIGHT_TOP...)
       có thể đẩy cụm nút ra ngoài màn hình nếu không kẹp. Vị trí này tự "ăn theo" mọi transform/width
       mà applyTryMenusPanelOverlapFix() áp lên tabbar/fab/megad khi panel debug đang pin-right, vì rect
       luôn đọc toạ độ SAU khi các style đó đã áp dụng (cùng 1 vòng lặp rAF, đọc lại mỗi frame). */
    const _positionActionCluster = (key, wrap, targetEl) => {
      const r = targetEl.getBoundingClientRect();
      const cw = wrap.offsetWidth || 120;
      const ch = wrap.offsetHeight || 26;
      let top, left;
      if (key === "fab") {
        top = r.top - ch - 6;
        left = r.right - cw;
      } else if (key === "tabbar") {
        top = r.top - ch - 6;
        left = r.right - cw - 6;
      } else {
        top = r.top + 6;
        left = r.right - cw - 6;
      }
      if (left < 4) left = 4;
      if (left + cw > window.innerWidth - 4) left = window.innerWidth - cw - 4;
      if (top < 4) top = 4;
      if (top + ch > window.innerHeight - 4) top = window.innerHeight - ch - 4;
      wrap.style.top = top + "px";
      wrap.style.left = left + "px";
    };

    /* Entry point: tạo cụm nút cho toàn bộ 5 kind theo trạng thái ẩn/hiện hiện tại — gọi 1 lần khi demo
       vừa bật xong xuôi (initTryMenusPanelState, sau applyTryMenusPanelOverlapFix()). _tickPulseMarkers
       lo phần cập nhật vị trí + ẩn/hiện mỗi frame (đã gộp ở trên). */
    const attachTryMenusActionButtons = () => {
      Object.keys(TRY_MENUS_EMBEDS).forEach((key) => {
        if (_tryMenusHiddenKeys.has(key)) return;
        createTryMenusActionCluster(key);
      });
      if (!_pulseRafId) _tickPulseMarkers(); // đảm bảo vòng lặp chung đang chạy kể cả khi chưa có pulse marker nào
    };

    /* TASK00610: áp lại display:none cho ĐÚNG phần tử menu (#SF-xxx) của các key đã bị tắt từ trước (đọc
       ra từ sessionStorage lúc khai báo _tryMenusHiddenKeys) — attachTryMenusActionButtons() ở trên chỉ
       lo cụm nút EDIT/USE THIS (đã tự skip key ẩn), CHƯA đụng gì tới chính element menu. Gọi 1 lần khi
       demo vừa bật xong (initTryMenusPanelState), poll vài mốc giống attachTryMenusPulseMarkers vì DOM
       do DemoMarket vẽ bất đồng bộ (fetch CDN + callDrawLoop) — phần tử có thể CHƯA tồn tại ở lần gọi đầu.
       setTryMenusMenuVisible(key, false) tự no-op an toàn nếu chưa tìm thấy phần tử, trúng 1 lần trong
       dãy poll là đủ; các lần gọi lặp lại sau đó chỉ set lại đúng display:none, không có tác dụng phụ. */
    const applyTryMenusHiddenKeysFromCache = () => {
      if (!_tryMenusHiddenKeys.size) return;
      [0, 400, 900, 1600, 2600, 4000].forEach((delay) => window.setTimeout(() => {
        _tryMenusHiddenKeys.forEach((key) => setTryMenusMenuVisible(key, false));
      }, delay));
    };

    /* DOM do DemoMarket ve la bat dong bo (fetch CDN + callDrawLoop) - poll vai moc thay vi 1 lan co dinh */
    /* Chỉ gắn chấm đỏ RIÊNG cho trigger Slide nổi (#navi-test-slide-fab) — Khôi phản hồi "nhiều chấm đỏ
       thế, bên trái rồi bên phải" khi từng gắn thêm cho cả tabbar/megad/megam (thanh full-width có
       getBoundingClientRect().right sát mép phải bất kể nội dung ở đâu, tạo cụm rối mắt vô nghĩa).
       (TASK00481: megad KHÔNG gắn chấm riêng ở đây — dùng luôn beacon chỉ điểm sẵn của core
       (Animation.flashDemoTrigger), đã ép mega position:relative trong releaseTryMenusMegaToFlow để
       beacon neo đúng góc trái-trên thanh mega thay vì trôi lên mép màn hình. tabbar/megam vẫn KHÔNG gắn.)

       KHÔNG tự gắn thêm cho FAB nữa (Khôi báo "riêng FAB có 2 cái dot đỏ") — điều tra xác nhận FAB đã
       tự có sẵn 1 chấm từ core runtime (`Animation.flashDemoTrigger`, uigen_func.js.php:437-445 — chạy
       cho MỌI DemoMarket active, bao gồm cả khách hàng thật tự test menu của họ, KHÔNG riêng feature
       này) — chấm debugmode.js tự thêm chồng lên thành 2. Slide-trigger KHÔNG nằm trong danh sách kind
       core beacon đó (chỉ áp cho `.canvas__open` ở nhánh KHÔNG own-site-test) nên vẫn cần tự thêm.

       Khôi chốt thêm: cũng cần chấm chỉ điểm cho icon hamburger-trước-logo (desktop) VÀ hamburger THẬT
       của theme (mobile) — 2 trigger mới thêm sau, cùng logic "chỉ điểm nút bấm nhỏ" như FAB/slide-fab.
       Nhận `override` (kết quả buildTryMenusPlacementOverride) để lấy đúng selector đã dùng — tách
       phần selector khỏi chuỗi "selector|color|boxed|side(device)" của field hamburger. */
    const attachTryMenusPulseMarkers = (override) => {
      const attempts = [400, 900, 1600, 2600, 4000];
      const slideOverride = override ? override[TRY_MENUS_KIND_CLASS.slide] : null;
      const logoSelector = (slideOverride && slideOverride.hamburger) ? slideOverride.hamburger.split("|")[0] : null;
      const realHamburgerSelector = (slideOverride && slideOverride.trigger) ? slideOverride.trigger : null;
      const mq = window.matchMedia(TRY_MENUS_MOBILE_QUERY);

      const removeMarkerFor = (targetEl) => {
        const idx = _pulseMarkers.findIndex((m) => m.target === targetEl);
        if (idx === -1) return;
        _pulseMarkers[idx].el.remove();
        _pulseMarkers.splice(idx, 1);
      };
      /* Icon-trước-logo chỉ hiện DESKTOP (suffix "(D)" trong publishTriggerHamburger, CSS runtime tự
         ẩn trên mobile) — nhưng chấm chỉ điểm lại bám vào chính LOGO (luôn hiện cả 2 thiết bị, khác
         icon ::before của nó), nên phải tự kiểm tra viewport riêng thay vì dựa vào rect 0×0 như các
         target khác (Khôi báo "còn hiện cả trên mobile"). Đồng bộ lại khi resize/xoay màn hình. */
      const syncLogoDot = () => {
        if (!logoSelector) return;
        let logoEl;
        try { logoEl = document.querySelector(logoSelector); } catch (e) { return; }
        if (!logoEl) return;
        if (mq.matches) {
          removeMarkerFor(logoEl);
        } else if (!_pulseMarkers.some((m) => m.target === logoEl)) {
          addPulseMarker(logoEl, "left", "slide"); // icon nằm bên TRÁI logo — chấm ở r.right lan sang chữ logo
        }
      };

      const tryAttach = () => {
        const slideFab = document.getElementById("navi-test-slide-fab");
        if (slideFab && !_pulseMarkers.some((m) => m.target === slideFab)) addPulseMarker(slideFab, "right", "slide");
        syncLogoDot();
        if (realHamburgerSelector) {
          try {
            const hbEl = document.querySelector(realHamburgerSelector);
            if (hbEl && !_pulseMarkers.some((m) => m.target === hbEl)) addPulseMarker(hbEl, "right", "slide");
          } catch (e) {}
        }
        // TASK00481: Mega desktop KHÔNG tự thêm chấm ở đây — DÙNG LUÔN beacon chỉ điểm sẵn của core
        // (Animation.flashDemoTrigger, uigen_func.js.php:437) neo vào chính element mega. Trước đây beacon
        // đó trôi lên mép trên màn hình vì mega bị để position:static → nay releaseTryMenusMegaToFlow ép
        // position:relative để beacon neo ĐÚNG góc trái-trên thanh mega (ngay item đầu "☰ Menu"). Không
        // addPulseMarker riêng (tránh 2 chấm) và KHÔNG stopDemoTrigger (giữ beacon core làm chỉ điểm).
      };
      attempts.forEach((delay) => window.setTimeout(tryAttach, delay));
      if (mq.addEventListener) mq.addEventListener("change", syncLogoDot);
      else mq.addListener(syncLogoDot); // Safari cũ
    };

    /* Dang o dung trang demo (URL mang param test/embed/domain cua chinh feature nay) hay khong -
       tinh tu URL hien tai, KHONG dua vao bien JS (vi "Turn on/off" gio la dieu huong/reload trang). */
    const isTryMenusDemoActiveNow = () => {
      try {
        const params = new URLSearchParams(window.location.search);
        return params.get("test") === "1"
          && (params.get("domain") || "") === TRY_MENUS_DOMAIN
          && (params.get("token") || "") === TRY_MENUS_TOKEN;
      } catch (e) {
        return false;
      }
    };
    const buildTryMenusDemoUrl = (addParams) => {
      const url = new URL(window.location.href);
      if (addParams) {
        url.searchParams.set("test", "1");
        // TASK00519: thay embed gốc bằng mẫu đã chọn ở EDIT popup (Phase 2) nếu key đó có override —
        // tryMenusEmbedIdFor() tự fallback về TRY_MENUS_EMBEDS[key] khi chưa đổi mẫu, không đổi hành vi cũ.
        /* Chỉ nạp menu demo ĐANG BẬT — trước đây URL luôn mang đủ 6 embed mặc định, trang vẽ hết rồi
           applyTryMenusHiddenKeysFromCache() mới ẩn dần (poll 0→4s) → khách thấy Tab Bar/FAB/Slide…
           mặc định hiện lên rồi biến mất khi chỉ thêm 1 menu qua Live mode. Ẩn hết (hiếm) → nạp đủ như cũ. */
        const visibleKeys = Object.keys(TRY_MENUS_EMBEDS).filter((k) => !_tryMenusHiddenKeys.has(k));
        url.searchParams.set("embed", (visibleKeys.length ? visibleKeys : Object.keys(TRY_MENUS_EMBEDS)).map(tryMenusEmbedIdFor).join(","));
        url.searchParams.set("domain", TRY_MENUS_DOMAIN);
        url.searchParams.set("token", TRY_MENUS_TOKEN);
      } else {
        url.searchParams.delete("test");
        url.searchParams.delete("embed");
        url.searchParams.delete("domain");
        url.searchParams.delete("token");
      }
      return url.toString();
    };
    /* Chi dieu huong bo param demo khi that su dang co - tranh reload thua khi khong can */
    const navigateAwayFromTryMenusDemo = () => {
      if (!isTryMenusDemoActiveNow()) return;
      window.location.href = buildTryMenusDemoUrl(false);
    };

    let _tryMenusOn = isTryMenusDemoActiveNow();
    let _lastResolvedTheme = null;
    let _lastPlacementOverride = null;

    /* "Turn on demo" - ghi override selector vao sessionStorage roi DIEU HUONG qua ?test=1&embed=...
       (giu nguyen hash debug mode) de pipeline DemoMarket co san tu fetch + render y het luong khach
       test menu that cua ho. KHONG tu dung setting/goi drawBottomNav() tay nua (ly do sinh 8 bug o v1
       - xem TASKS/TASK00405-plan-v2.md). */
    const renderTryMenusDemo = async () => {
      const themeInfo = await resolveCurrentThemeSelectors();
      _lastResolvedTheme = themeInfo;
      if (!themeInfo) {
        updateTryMenusUI();
        return;
      }
      const override = buildTryMenusPlacementOverride(themeInfo.selectors);
      _lastPlacementOverride = override;
      try {
        if (override) sessionStorage.setItem(TRY_MENUS_PLACEMENT_SESSION_KEY, JSON.stringify(override));
        else sessionStorage.removeItem(TRY_MENUS_PLACEMENT_SESSION_KEY);
        // TASK00501: chi Wix can bao sessionStorage platform that (Shopify khong co bug CSS Grid
        // nen khong can escape, giu nguyen hanh vi cu - xem ghi chu TRY_MENUS_PLATFORM_SESSION_KEY).
        if (detectTryMenusPlatform() === TRY_MENUS_PLATFORM_WIX) sessionStorage.setItem(TRY_MENUS_PLATFORM_SESSION_KEY, "wix");
        else sessionStorage.removeItem(TRY_MENUS_PLATFORM_SESSION_KEY);
      } catch (e) {}
      safeLocalStorage.set(TRY_MENUS_STORAGE_KEY, "1");
      window.location.href = buildTryMenusDemoUrl(true);
    };

    /* User chu dong bam "Turn off demo" - xoa co, KHONG tu khoi phuc lai nua (khac teardown do
       debug mode tat tam ben duoi, von phai GIU co de tu bat lai khi debug mode bat lai). */
    const teardownTryMenusDemo = () => {
      safeLocalStorage.set(TRY_MENUS_STORAGE_KEY, "0");
      try {
        sessionStorage.removeItem(TRY_MENUS_PLACEMENT_SESSION_KEY);
        sessionStorage.removeItem(TRY_MENUS_PLATFORM_SESSION_KEY); // TASK00501
        sessionStorage.removeItem(DEMO_MARKET_SESSION_KEY);
      } catch (e) {}
      // "Turn off demo" reset luôn mẫu/config đã đổi qua EDIT popup (Phase 2) —
      // lần "Turn on demo" kế tiếp bắt đầu lại từ 5 mẫu demo gốc, không giữ lựa chọn cũ ngầm. Đồng thời
      // dọn cụm nút EDIT/USE THIS (navigate-away thường dỡ luôn cả trang nên đằng nào cũng mất, nhưng
      // vẫn dọn tường minh cho nhánh KHÔNG navigate bên dưới). Phase 2.5: dọn thêm map domain đa store +
      // Phase 3B: dọn token ghép cặp bridge (dùng chuỗi literal thay vì tham chiếu const khai báo sau
      // trong file — an toàn về thứ tự đọc code, teardown chỉ THỰC THI lúc click về sau, không phải lúc
      // parse, nên không có rủi ro TDZ, nhưng literal rõ ràng hơn khi đọc riêng khối này).
      writeTryMenusOverrides(null);
      try {
        sessionStorage.removeItem("_naviplus_try_menus_embed_domains");
        sessionStorage.removeItem("navi_demo_bridge_ch");
      } catch (e) {}
      removeAllTryMenusActionClusters();
      removeAllPulseMarkers();

      if (!isTryMenusDemoActiveNow()) { _tryMenusOn = false; updateTryMenusUI(); return; }
      navigateAwayFromTryMenusDemo();
    };

    // Feature "Try Navi+ menus" — layer 2 panel, wizard 2 bước (Khôi chốt lại luồng)
    const tryMenusDetail = document.createElement("div");
    tryMenusDetail.dataset.featureId = "try-menus";
    tryMenusDetail.style.cssText = "display:none;"; // Bỏ khung card; detail-content đã có padding 14px, khỏi lặp
    tryMenusDetail.innerHTML =
      // TASK00525: dòng "Preview only..." chuyển từ đầu màn xuống CUỐI thành note (đỡ đẩy nội dung chính xuống, bớt scroll)
      "<div>" +
        "<div data-part='try-menus-step1-title' style='font-size:12px;font-weight:700;color:#111827;margin-bottom:6px'>Step 1 — Choose your theme</div>" +
        "<select data-part='try-menus-theme-select' style='width:100%;height:34px;border:1px solid rgba(17,24,39,0.16);border-radius:8px;padding:0 8px;font-size:12.5px;color:#111827;background:#fff'></select>" +
        "<div data-part='try-menus-wix-note' style='display:none;padding:8px 10px;border:1px solid rgba(22,101,52,0.25);background:rgba(22,101,52,0.06);border-radius:8px;font-size:12px;line-height:1.5;color:#166534'>Wix detected — no theme selection needed, positions are auto-resolved.</div>" +
        "<div data-part='try-menus-unsupported-note' style='display:none;padding:8px 10px;border:1px solid rgba(220,38,38,0.25);background:rgba(220,38,38,0.06);border-radius:8px;font-size:12px;line-height:1.5;color:#991b1b'>This platform is not supported yet for automatic demo placement (Shopify and Wix only for now).</div>" +
        "<div data-part='try-menus-theme-note' style='margin-top:8px;font-size:12px;line-height:1.5'></div>" +
      "</div>" +

      "<div style='margin-top:10px'>" +
        // TASK00525: nút toggle lên NGANG HÀNG title Step 2 (title trái, nút phải) — bớt 1 tầng dọc, đỡ scroll
        "<div style='display:flex;align-items:center;justify-content:space-between;gap:8px;margin-bottom:6px'>" +
          "<div style='font-size:12px;font-weight:700;color:#111827'>Step 2 — Demo</div>" +
          "<button type='button' data-part='try-menus-toggle' style='height:30px;padding:0 12px;border:1px solid #111827;border-radius:8px;background:#111827;color:#fff;font-size:12.5px;font-weight:600;cursor:pointer;flex-shrink:0'>Turn on demo</button>" +
        "</div>" +
        "<div data-part='try-menus-summary' style='display:none;margin-top:8px;padding:8px 10px;border:1px solid rgba(22,101,52,0.25);background:rgba(22,101,52,0.06);border-radius:8px;font-size:12px;line-height:1.6;color:#166534'></div>" +
        "<div data-part='try-menus-mobile-tip' style='display:none;margin-top:8px;padding:8px 10px;border:1px solid rgba(17,24,39,0.12);background:#f9fafb;border-radius:8px;font-size:12px;line-height:1.6;color:#374151'></div>" +
      "</div>" +

      "<div style='margin-top:12px;font-size:11.5px;color:rgba(17,24,39,0.55);line-height:1.5'>Preview only — live sample of every menu type, nothing published; turn off anytime.</div>";
    detailContent.appendChild(tryMenusDetail);

    const tryMenusThemeSelectEl = tryMenusDetail.querySelector("[data-part='try-menus-theme-select']");
    const tryMenusToggleBtn = tryMenusDetail.querySelector("[data-part='try-menus-toggle']");
    const tryMenusThemeNoteEl = tryMenusDetail.querySelector("[data-part='try-menus-theme-note']");
    const tryMenusSummaryEl = tryMenusDetail.querySelector("[data-part='try-menus-summary']");
    const tryMenusMobileTipEl = tryMenusDetail.querySelector("[data-part='try-menus-mobile-tip']");
    const tryMenusStep1TitleEl = tryMenusDetail.querySelector("[data-part='try-menus-step1-title']");
    const tryMenusWixNoteEl = tryMenusDetail.querySelector("[data-part='try-menus-wix-note']");
    const tryMenusUnsupportedNoteEl = tryMenusDetail.querySelector("[data-part='try-menus-unsupported-note']");
    // TASK00485 — tag "● ON" nhỏ cạnh title header (backLiveBadge), thay cho badge lớn cũ trong nội dung trang
    const updateBackLiveBadge = () => {
      backLiveBadge.style.display = (tryMenusDetail.style.display === "block" && _tryMenusOn) ? "inline-flex" : "none";
    };
    let _lastDetectedPlatform = null;

    /* Ẩn/hiện đúng phần Step 1 theo platform detect được — Shopify: dropdown chọn theme (như cũ);
       Wix: không cần chọn gì, chỉ ghi chú; Global/WordPress (hoặc không detect được): báo rõ chưa hỗ
       trợ. Gọi 1 lần khi mở panel — platform không đổi trong lúc site đang mở. */
    const syncTryMenusPlatformUI = () => {
      _lastDetectedPlatform = detectTryMenusPlatform();
      const isShopify = _lastDetectedPlatform === TRY_MENUS_PLATFORM_SHOPIFY;
      const isWix = _lastDetectedPlatform === TRY_MENUS_PLATFORM_WIX;
      const isUnsupported = _lastDetectedPlatform === TRY_MENUS_PLATFORM_UNSUPPORTED;
      tryMenusStep1TitleEl.textContent = isWix ? "Step 1 — Theme (auto-detected: Wix)" : "Step 1 — Choose your theme";
      tryMenusThemeSelectEl.style.display = isShopify ? "" : "none";
      tryMenusWixNoteEl.style.display = isWix ? "block" : "none";
      tryMenusUnsupportedNoteEl.style.display = isUnsupported ? "block" : "none";
      tryMenusThemeNoteEl.style.display = isUnsupported ? "none" : "";
    };

    /* Step 1 — dropdown chọn theme NGAY trong panel (không bắt sang Explore CSS Selectors nữa).
       Preselect: ưu tiên slug đã lưu localStorage (EXPLORE_THEME_STORAGE_KEY, dùng chung với Explore
       zone) — "nếu có trong localStorage đã cache rồi thì suggest luôn" (Khôi chốt) — sau đó mới tới
       auto-detect theo storefront. Đổi lựa chọn ở đây cũng lưu chung key đó. */
    const buildTryMenusThemeSelect = () => {
      tryMenusThemeSelectEl.innerHTML = "";
      const blank = document.createElement("option");
      blank.value = "";
      blank.textContent = "— Select your theme —";
      tryMenusThemeSelectEl.appendChild(blank);
      const gPop = document.createElement("optgroup");
      gPop.label = "Most common";
      popularThemeEntries.forEach((t) => {
        const o = document.createElement("option");
        o.value = t.slug; o.textContent = t.name;
        gPop.appendChild(o);
      });
      tryMenusThemeSelectEl.appendChild(gPop);
      const gAll = document.createElement("optgroup");
      gAll.label = "All themes (A–Z)";
      otherThemeEntries.forEach((t) => {
        const o = document.createElement("option");
        o.value = t.slug; o.textContent = t.name;
        gAll.appendChild(o);
      });
      tryMenusThemeSelectEl.appendChild(gAll);

      const savedSlug = safeLocalStorage.get(EXPLORE_THEME_STORAGE_KEY);
      if (savedSlug) {
        tryMenusThemeSelectEl.value = savedSlug;
      } else {
        const detected = preselectShopifyTheme(shopifyThemeEntries);
        if (detected) tryMenusThemeSelectEl.value = detected.slug;
      }
    };
    buildTryMenusThemeSelect();
    syncTryMenusPlatformUI();
    tryMenusThemeSelectEl.addEventListener("change", () => {
      if (tryMenusThemeSelectEl.value) safeLocalStorage.set(EXPLORE_THEME_STORAGE_KEY, tryMenusThemeSelectEl.value);
      if (_tryMenusOn) {
        // Demo đã active SẴN từ URL (kịch bản mở link demo trực tiếp — TASK00405
        // bootstrapTryMenusDirectLink) — nút "Turn on demo" luôn hiện "Turn off" ngay từ đầu, KHÔNG
        // bao giờ vào được nhánh renderTryMenusDemo() để tính lại override theo theme mới chọn.
        // Reload trang y hệt "Turn on demo" thật — tái dùng đúng luồng self-heal đã verify hoạt động
        // (initTryMenusPanelState), an toàn hơn tự viết logic áp lại pin/pulse tại chỗ (các hàm đó có
        // guard chỉ chạy 1 lần, đổi theme SAU khi đã pin sẽ không áp lại được nếu không reload).
        window.location.reload();
        return;
      }
      refreshTryMenusThemeStatus();
    });

    /* Mega CẦN chọn đúng theme mới có CSS selector để autofill vị trí chèn CHÍNH XÁC (giống
       publish thật) — chưa chọn/không nhận diện được theme thì demo vẫn hiện (DemoMarket luôn force
       display) nhưng Mega chèn theo fallback chung chung (gần header, không chắc đúng chỗ). */
    const updateTryMenusThemeNote = () => {
      if (_lastResolvedTheme && _lastResolvedTheme.slug) {
        if (_lastResolvedTheme.slug === "selcheck") {
          // Vị trí lấy từ "Kiểm tra Selector" (đã dò/chỉ tay ngay trên trang này) — dropdown theme ở
          // Step 1 không còn quyết định vị trí chèn, nói rõ để khách không tưởng phải chọn theme.
          tryMenusThemeNoteEl.style.cssText = "margin-top:8px;font-size:12px;line-height:1.5;color:#166534;";
          tryMenusThemeNoteEl.textContent = "Using the menu spots found on your site — no theme pick needed.";
        } else
        if (_lastDetectedPlatform === TRY_MENUS_PLATFORM_WIX) {
          tryMenusThemeNoteEl.style.cssText = "margin-top:8px;font-size:12px;line-height:1.5;color:#166534;";
          tryMenusThemeNoteEl.textContent = "Wix selectors resolved — Mega will use them automatically.";
        } else {
          // Shopify resolved: không cần báo gì thêm (đã bỏ dòng "Theme resolved: ...")
          tryMenusThemeNoteEl.style.cssText = "display:none;";
          tryMenusThemeNoteEl.textContent = "";
        }
      } else if (_lastDetectedPlatform !== TRY_MENUS_PLATFORM_UNSUPPORTED) {
        // Unsupported đã có ô đỏ riêng (try-menus-unsupported-note) — note này chỉ còn cần cho
        // Shopify (chưa chọn) hoặc Wix (đang tự resolve, hiếm khi thấy vì rất nhanh).
        tryMenusThemeNoteEl.style.cssText = "margin-top:8px;padding:8px 10px;border:1px solid rgba(245,158,11,0.35);background:rgba(245,158,11,0.08);border-radius:8px;font-size:12px;line-height:1.5;color:#92400e;";
        tryMenusThemeNoteEl.textContent = _lastDetectedPlatform === TRY_MENUS_PLATFORM_WIX
          ? "Resolving Wix selectors…"
          : "Pick your theme above to continue — Mega needs it to find where to attach on your site.";
      }
    };
    /* Khôi chốt: bước demo CHỈ được thực hiện khi đã chọn được theme ở Step 1 (không phải gợi ý
       suông) → khoá nút "Turn on demo" cứng khi chưa resolve được theme, mở lại khi đã có. */
    const updateTryMenusUI = () => {
      const canShow = !!_lastResolvedTheme;
      tryMenusToggleBtn.textContent = _tryMenusOn ? "Turn off demo" : "Turn on demo";
      tryMenusToggleBtn.style.background = _tryMenusOn ? "#fff" : "#111827";
      tryMenusToggleBtn.style.color = _tryMenusOn ? "#111827" : "#fff";
      tryMenusToggleBtn.disabled = !_tryMenusOn && !canShow;
      tryMenusToggleBtn.style.opacity = tryMenusToggleBtn.disabled ? "0.5" : "1";
      tryMenusToggleBtn.style.cursor = tryMenusToggleBtn.disabled ? "not-allowed" : "pointer";
      updateTryMenusThemeNote();
      if (!_tryMenusOn) hideTryMenusSummary();
      tryMenusCard.dataset.live = _tryMenusOn ? "on" : "off"; // TASK00485 — card xanh + badge xanh khi demo đang bật
      tryMenusLiveBadge.textContent = _tryMenusOn ? "● ON" : "● OFF"; // TASK00525 — badge luôn hiển thị cả 2 trạng thái
      updateBackLiveBadge(); // TASK00485 — tag "● ON" cạnh title header đồng bộ theo _tryMenusOn
    };

    /* Bấm "Turn on demo" xong (hoặc reload lại đúng trang demo) — nói RÕ đã thêm loại menu gì vào
       vị trí nào, nhắc xem chấm đỏ để biết chỗ tương tác, và hướng dẫn chuyển qua mobile test (kèm QR
       quét bằng điện thoại — vì localStorage không đồng bộ giữa 2 thiết bị nên máy quét QR sẽ cần
       bấm lại Step 2). */
    /* TASK00481: bật/tắt hiện 1 menu demo (toggle trong khung "Added N demo menus"). Ẩn = display:none
       element menu (#SF-xxx) — beacon core là con của element nên tự ẩn theo. Slide đặc biệt: element
       slide ẩn-tới-khi-trigger nên phải ẩn thêm nút "Open Slide menu" (#navi-test-slide-fab). Các chấm pulse
       mang key tương ứng tự ẩn qua _tryMenusHiddenKeys trong _tickPulseMarkers (poll/resize không bật lại
       vì cùng gate bằng set này). */
    const setTryMenusMenuVisible = (key, visible) => {
      if (visible) _tryMenusHiddenKeys.delete(key); else _tryMenusHiddenKeys.add(key);
      writeTryMenusHiddenKeys(_tryMenusHiddenKeys); // TASK00610: ghi cache mỗi lần đổi, không chỉ lúc unload
      /* URL demo giờ chỉ nạp menu đang bật (buildTryMenusDemoUrl) → bật lại 1 menu chưa từng được nạp
         trên trang này thì không có element để hiện → tải lại URL demo có kèm embed đó. */
      if (visible && isTryMenusDemoActiveNow()) {
        const loaded = (new URLSearchParams(window.location.search).get("embed") || "").split(",");
        if (loaded.indexOf(tryMenusEmbedIdFor(key)) === -1) {
          window.location.href = buildTryMenusDemoUrl(true);
          return;
        }
      }
      const el = document.getElementById(tryMenusEmbedIdFor(key)); // TASK00519: tra qua override (mẫu có thể đã đổi)
      if (el) el.style.display = visible ? "" : "none";
      if (key === "slide") {
        const fab = document.getElementById("navi-test-slide-fab");
        // fab chỉ hiện desktop (applyTryMenusResponsiveTweaks) → bật lại vẫn phải tôn trọng mobile
        const isMobile = window.matchMedia(TRY_MENUS_MOBILE_QUERY).matches;
        if (fab) fab.style.display = (!visible || isMobile) ? "none" : "";
      }
      // đồng bộ cụm nút EDIT/USE THIS theo toggle ẩn/hiện menu demo
      if (visible) createTryMenusActionCluster(key); else removeTryMenusActionCluster(key);

    };
    /* TASK00525: guide "Test on mobile" (trước nằm inline trong showTryMenusSummary, giờ chỉ
       còn 1 nơi dùng: bottom-sheet của footer "Test website on mobile" pin đáy panel — sheet có title
       riêng nên gọi với showHeading=false; param giữ lại phòng nơi khác cần heading).
       Nội dung/hành vi giữ nguyên từ TASK00501: mục 1 mở popup 375×812 đúng url debug+demo
       (buildDebugQrUrl — có #navidebug-on + giữ query demo); mục 2 accordion "guide here" NỘI TUYẾN
       (không openFeature("mobile-guide") — nhảy panel = mất context), nội dung từ mobileGuideCopy;
       mục 3 QR; note password. Render lúc gọi để QR luôn theo URL hiện tại. */
    const renderTestOnMobileGuide = (container, showHeading) => {
      const qrUrl = "https://api.qrserver.com/v1/create-qr-code/?size=140x140&data=" + encodeURIComponent(buildDebugQrUrl());
      const mobileOptRowStyle = "display:flex;gap:6px;align-items:flex-start;margin-top:6px;";
      const mobileOptNumStyle = "flex-shrink:0;color:#9ca3af;font-weight:700;";
      container.innerHTML =
        (showHeading ? "<b>Test on mobile:</b>" : "") +
        `<div style="${mobileOptRowStyle}">` +
          `<span style="${mobileOptNumStyle}">1.</span>` +
          "<span><button type='button' data-part='mobile-tip-popup-btn' style=\"appearance:none;border:1px solid rgba(17,24,39,0.2);background:rgba(17,24,39,0.05);color:#111827;border-radius:6px;padding:3px 10px;font-size:12.5px;font-weight:600;cursor:pointer\">Click to open Mobile popup</button></span>" +
        "</div>" +
        `<div style="${mobileOptRowStyle}">` +
          `<span style="${mobileOptNumStyle}">2.</span>` +
          "<span>Resize your browser or use inspect mode " +
            "(<button type='button' data-part='mobile-tip-guide-link' style='appearance:none;border:0;background:transparent;padding:0;font:inherit;color:#111827;text-decoration:underline;cursor:pointer'>guide here</button>)." +
            "<div data-part='mobile-tip-guide-inline' style='display:none;margin-top:6px;padding:8px 10px;border:1px solid rgba(17,24,39,0.12);background:rgba(17,24,39,0.02);border-radius:8px;font-size:12px;line-height:1.55;color:#374151'></div>" +
          "</span>" +
        "</div>" +
        `<div style="${mobileOptRowStyle}">` +
          `<span style="${mobileOptNumStyle}">3.</span>` +
          "<span>Scan this QR code with your phone.<br>" +
            "<img src='" + qrUrl + "' width='120' height='120' style='margin-top:6px;border:1px solid rgba(17,24,39,0.1);border-radius:6px' alt='QR code'>" +
          "</span>" +
        "</div>" +
        "<div style='margin-top:6px;color:#9ca3af'>Store has a password? Scan once to unlock it, then scan again to test.</div>";
      const mobileTipPopupBtn = container.querySelector("[data-part='mobile-tip-popup-btn']");
      if (mobileTipPopupBtn) {
        mobileTipPopupBtn.addEventListener("click", () => {
          window.open(buildDebugQrUrl(), "_blank", "width=375,height=812");
        });
      }
      const mobileTipGuideLink = container.querySelector("[data-part='mobile-tip-guide-link']");
      const mobileTipGuideInline = container.querySelector("[data-part='mobile-tip-guide-inline']");
      mobileTipGuideInline.innerHTML =
        `<div>${mobileGuideCopy.step1}</div>` +
        `<div style="margin-top:6px">${mobileGuideCopy.step2Title}</div>` +
        `<div style="margin-top:4px">${mobileGuideCopy.step2Shortcut}</div>` +
        `<div style="margin-top:4px">${mobileGuideCopy.step2Icon}</div>` +
        `<div style="margin-top:4px">${mobileGuideCopy.step2Resize}</div>`;
      if (mobileTipGuideLink) {
        mobileTipGuideLink.addEventListener("click", () => {
          const expanded = mobileTipGuideInline.style.display !== "none";
          mobileTipGuideInline.style.display = expanded ? "none" : "block";
          mobileTipGuideLink.textContent = expanded ? "guide here" : "hide";
        });
      }
    };

    const showTryMenusSummary = (override) => {
      // TASK00481: mỗi menu 1 dòng có toggle bật/tắt (checkbox accent đen #111827). Tick = hiện, bỏ tick = ẩn.
      const lines = Object.keys(TRY_MENUS_EMBEDS).map((key) =>
        "<label style='display:flex;align-items:flex-start;gap:7px;margin:4px 0;cursor:pointer'>" +
          "<input type='checkbox' data-try-menu-toggle='" + key + "'" + (_tryMenusHiddenKeys.has(key) ? "" : " checked") +
          " style='width:14px;height:14px;margin-top:1px;accent-color:#111827;cursor:pointer;flex-shrink:0'>" +
          "<span>" + describeTryMenusPosition(key, override) + "</span>" +
        "</label>"
      );
      tryMenusSummaryEl.innerHTML =
        "<b>Added " + lines.length + " demo menus:</b>" + // TASK00525: bỏ chú thích "— toggle to show/hide" (checkbox tự nói lên rồi)
        lines.join("") +
        "<div style='margin-top:6px'>👀 Look for the <b style='color:#dc2626'>red pulsing dots</b> to see where you can interact.</div>" +
        // TASK00525: guide 2 nút overlay trên từng menu demo (EDIT / ADD MENU — label khớp createTryMenusActionCluster)
        "<div style='margin-top:4px'>✏️ Click <b>EDIT</b> on a menu to switch templates, <b>ADD MENU</b> to add it to your site.</div>";
      tryMenusSummaryEl.style.display = "block";
      // Wire toggle → ẩn/hiện menu tương ứng
      tryMenusSummaryEl.querySelectorAll("[data-try-menu-toggle]").forEach((cb) => {
        cb.addEventListener("change", function () {
          setTryMenusMenuVisible(this.getAttribute("data-try-menu-toggle"), this.checked);
        });
      });

      // TASK00525: bỏ khối "Test on mobile:" khỏi màn Try Navi+ menus — guide giờ nằm ở bottom-sheet
      // của footer "Test website on mobile" pin đáy panel (renderTestOnMobileGuide), khỏi lặp 2 nơi.
      // tryMenusMobileTipEl giữ nguyên trong DOM (ẩn mặc định), hideTryMenusSummary vẫn dọn như cũ.
    };
    const hideTryMenusSummary = () => {
      tryMenusSummaryEl.style.display = "none";
      tryMenusSummaryEl.innerHTML = "";
      tryMenusMobileTipEl.style.display = "none";
      tryMenusMobileTipEl.innerHTML = "";
    };

    tryMenusToggleBtn.addEventListener("click", async () => {
      tryMenusToggleBtn.disabled = true;
      try {
        if (_tryMenusOn) teardownTryMenusDemo();
        else await renderTryMenusDemo();
      } finally {
        updateTryMenusUI();
      }
    });

    /* Resolve theme (không vẽ gì) — dùng khi panel mở lại lúc demo CHƯA bật, để nút khoá/mở đúng
       trạng thái + ghi chú theme chính xác từ trước khi bấm "Turn on demo". */
    const refreshTryMenusThemeStatus = async () => {
      if (_tryMenusOn) return; // demo đang chạy → giữ nguyên _lastResolvedTheme lúc render, khỏi ghi đè
      _lastResolvedTheme = await resolveCurrentThemeSelectors();
      updateTryMenusUI();
    };

    /* Khôi đảo hướng (feedback demo pro-bottom-bar-1-1, thay cho "manual sticky" của TASK00405/478):
       mega desktop KHÔNG tự pin cứng vào viewport nữa — phải ĐI THEO header của site (header cuộn thì
       mega cuộn theo, header sticky thì mega sticky theo) và TUYỆT ĐỐI không đụng chế độ pin của header
       gốc. Đo DOM thật trên store này (Playwright): publishToPlace đã chèn mega thành con nằm TRONG
       wrapper header của theme (`sticky-header > … > naviman_app > mega`); lúc CHƯA bị demo đụng vào,
       mega vốn `position:relative` in-flow → tự trôi/dính theo header. Bản cũ ép chính mega
       `position:fixed` neo `top` cố định (đo được top:86px) + ép luôn header thành `fixed;top:0` + chèn
       spacer → khi cuộn header trôi -124px còn mega đứng yên (delta 0), tách rời lơ lửng = đúng bug.

       Bỏ HẲN manual-sticky. Giờ chỉ: (1) để mega ở nguyên in-flow (KHÔNG set position/top/spacer,
       KHÔNG chạm header) để nó đi theo header; (2) đánh dấu mega sẵn sàng (dataset.naviDemoPinned) +
       width:100% để applyTryMenusPanelOverlapFix vẫn co/giãn bề rộng khi mở panel debug; (3) gỡ mọi
       inline pin/spacer cũ nếu còn sót (phòng bản manual-sticky cũ đã chạy trong cùng session/CDN cache). */
    const releaseTryMenusMegaToFlow = (el) => {
      if (!el) return;
      // Gỡ inline fixed/pin cũ (top/left/... nếu có) → trả mega về in-flow để đi theo header
      ["top", "left", "right", "bottom", "zIndex"].forEach((p) => { el.style[p] = ""; });
      // position = RELATIVE (KHÔNG fixed): vẫn nằm in-flow → đi theo header, ĐỒNG THỜI làm CONTAINING
      // BLOCK cho beacon chỉ điểm của core (Animation.flashDemoTrigger gắn span absolute top:-6/left:-6
      // vào CHÍNH element mega). Nếu để static (position:""), beacon neo nhầm vào ancestor có position →
      // trôi lên mép TRÊN màn hình (Khôi: "chấm trôi lên góc trái trên màn hình" — đã đo Playwright:
      // beacon rect top ≈ -3 thay vì ~119). Relative KHÔNG tạo containing block cho position:fixed nên
      // dropdown mega vẫn neo viewport bình thường (xem docs/decisions/css-transform-fixed-positioning.md).
      el.style.position = "relative";
      // Full-width như trước (publishToPlace mặc định width:auto) — overlap-fix quản tiếp khi mở panel
      el.style.width = "100%";
      // Cờ "mega đã sẵn sàng" cho applyTryMenusPanelOverlapFix (giữ nguyên tên key, không còn nghĩa "pin")
      el.dataset.naviDemoPinned = "1";
    };
    /* Gắn class nhóm header (entry.groupClass, do buildTryMenusPlacementOverride tính) lên wrapper `.naviman_app`
       runtime tạo khi chèn sau thanh sticky. Wrapper xuất hiện trễ (waitToReplaceInsertMulti chờ tới 10s) → poll
       cùng mốc với pinTryMenusMegaBelowHeader; idempotent. */
    const adoptTryMenusHeaderGroupClass = (override) => {
      if (!override) return;
      const apply = () => {
        ["megad", "megam", "grid"].forEach((key) => {
          const embedId = tryMenusEmbedIdFor(key);
          const entry = override[embedId] || override[TRY_MENUS_KIND_CLASS[key]];
          if (!entry || !entry.groupClass) return;
          const el = document.getElementById(embedId);
          const wrap = el && el.parentElement;
          if (wrap && wrap.classList.contains("naviman_app") && wrap !== document.getElementById("naviman_app")) wrap.classList.add(entry.groupClass);
        });
      };
      [400, 900, 1600, 2600, 4000, 6500, 10000].forEach((delay) => window.setTimeout(apply, delay));
    };

    const pinTryMenusMegaBelowHeader = (override) => {
      // Dọn header từng bị ép fixed (bản cũ) về nguyên trạng + xoá spacer demo cũ, phòng còn sót
      document.querySelectorAll("[data-navi-demo-sticky-header-spacer]").forEach((s) => {
        const hdr = s.nextElementSibling;
        if (hdr) ["position", "top", "left", "right", "width", "zIndex"].forEach((p) => { hdr.style[p] = ""; });
        s.remove();
      });
      document.querySelectorAll("[data-navi-demo-sticky-spacer]").forEach((s) => s.remove());
      // mega có thể xuất hiện trễ (runtime vẽ sau) — poll để chắc chắn thả về in-flow + gắn cờ sẵn sàng
      // CHỈ áp cho megad (desktop). megam (mobile) KHÔNG cần "đi theo header in-flow"
      // (lý do ban đầu của releaseTryMenusMegaToFlow chỉ đúng cho desktop — mega nằm trong sticky
      // header của theme). Ép position:relative lên megam kích hoạt z-index:50 dormant (bình thường
      // position:static nên vô hại) → biến nó thành 1 stacking context riêng NGAY CẢ TRƯỚC khi mở
      // submenu; khi mở submenu, runtime tự đẩy z-index lên max (raiseSectionZIndexForMobileMega)
      // nhưng vòng poll dưới đây xoá sạch zIndex vừa đẩy (dòng zIndex: "" trong releaseTryMenusMegaToFlow)
      // → submenu rơi về mức thấp, bị hero đè lên trên (Khôi báo "sub menu ở dưới hero"). Bỏ megam khỏi
      // đây để nó giữ nguyên position:static như trên site khách thật, z-index hoạt động bình thường.
      // TASK00501: releaseTryMenusMegaToFlow ép position:relative + width:100% (rồi bị
      // applyTryMenusPanelOverlapFix co thêm lần nữa theo bề rộng panel debug) — ĐÚNG cho Shopify (megad
      // là chính element top-level được publishToPlace chèn thẳng, không có wrapper trung gian nào khác
      // lo định vị). Trên Wix, megad nằm BÊN TRONG wrapper `.naviman_app` đã được
      // Helper._escapeGridAutoPlacement định vị+co bề rộng đúng theo panel SẴN (qua layout thật của
      // trang — body đã có padding-right cho panel dock, header đo được cũng đã co theo) — ép co bề
      // rộng thêm 1 lần nữa lên chính megad bên trong gây co ĐÚP, nội dung mega chỉ chiếm 1 phần bề
      // rộng wrapper, để hở khoảng trống bên phải (Khôi báo "không full screen"). Chỉ chạy cho Shopify.
      if (detectTryMenusPlatform() !== TRY_MENUS_PLATFORM_SHOPIFY) return;
      const attempts = [400, 900, 1600, 2600, 4000];
      const tryRelease = () => {
        releaseTryMenusMegaToFlow(document.getElementById(tryMenusEmbedIdFor("megad"))); // TASK00519: tra qua override
      };
      attempts.forEach((delay) => window.setTimeout(tryRelease, delay));
    };

    /* Khôi chốt: panel "Navi+ Debug mode" khi MỞ là side-panel full-height bên phải (`#dm_modal`:
       position:fixed; right:0; top:0; width:min(60vw,860px); height:100vh; z-index:2147483647 — xem
       CSS gốc dòng ~338) — che khuất phần bên phải Mega/FAB trong lúc đang mở (KHÔNG phải lỗi tính
       toán: window.innerWidth không đổi vì panel chỉ là overlay position:fixed, không co layout thật
       — đóng/thu nhỏ panel là hiện đúng ngay). Tự động co bề rộng Mega + dời FAB sang trái đúng bằng
       bề rộng panel trong lúc đang mở, trả lại bình thường khi đóng — theo dõi qua MutationObserver
       trên thuộc tính data-open của #dm_modal, KHÔNG đụng logic mở/đóng panel gốc (tách biệt, an toàn
       hơn sửa trực tiếp các hàm openModal/closeModal đã có sẵn và đã test). */
    const applyTryMenusPanelOverlapFix = () => {
      const panelEl = document.getElementById(modalId);
      if (!panelEl) return;

      const sync = () => {
        // TASK00485 — chỉ né panel khi đang PIN-RIGHT (dock thật, đẩy layout qua padding-right). Floating
        // không còn đẩy body (đã bỏ padding-right ở CSS `body:has(...[data-floating="1"])`) nên KHÔNG được
        // dời/co Mega/Tabbar/FAB theo panelWidth nữa — nếu không, dù panel đang floating ở giữa/đâu đó, các
        // demo menu vẫn bị co/dời trái y hệt lúc pin-right (đúng bug Khôi báo: "dịch sang như đang chọn right panel").
        const isOpen = panelEl.dataset.open === "1" && panelEl.dataset.floating !== "1";
        const panelWidth = isOpen ? panelEl.getBoundingClientRect().width : 0;
        // TASK00519: tra id qua tryMenusEmbedIdFor(key) — không đọc thẳng TRY_MENUS_EMBEDS.xxx (mẫu có thể đã đổi)
        ["megad", "megam"].forEach((key) => {
          const el = document.getElementById(tryMenusEmbedIdFor(key));
          if (el && el.dataset.naviDemoPinned === "1") {
            el.style.width = isOpen ? `calc(100% - ${panelWidth}px)` : "100%";
          }
        });
        // FAB + Tab Bar: chỉ dời trái bằng transform (không đổi width như Mega, vì 2 kind này không
        // full-width) — dời trái LUÔN AN TOÀN bất kể vị trí gốc đang cấu hình là gì (trái/phải/giữa,
        // desktopPosition bất kỳ trong NAVIGLOBAL.DESKTOP_POSITION): nếu đang ở bên phải (RIGHT_TOP,
        // RIGHT_FULL_TOP, RIGHT_FULL_CENTER, BOTTOM_RIGHT...) thì dời trái mới tránh bị panel che; nếu
        // đang ở giữa/trái (như demo hiện tại: Tab Bar desktopPosition=0 BOTTOM_CENTER_FLOAT) thì dời
        // trái thêm 1 chút cũng không hại gì (không có gì để che ở đó, chỉ hơi lệch tâm tạm thời trong
        // lúc panel mở, không phải bug).
        ["tabbar", "fab"].forEach((key) => { // TASK00519: tra qua override, xem comment ở nhánh megad/megam trên
          const el = document.getElementById(tryMenusEmbedIdFor(key));
          if (el) el.style.transform = isOpen ? `translateX(-${panelWidth}px)` : "";
        });
      };
      // Mega chỉ có dataset.naviDemoPinned="1" SAU khi pinTryMenusMegaBelowHeader() poll xong (tới
      // 4000ms) — nếu panel ĐÃ mở sẵn ngay lúc hàm này chạy lần đầu (vd sau "Turn on demo"), sync()
      // đầu tiên sẽ bỏ qua vì mega chưa kịp pin, và không có mutation nào xảy ra để kích lại tự động.
      // Poll lại cùng mốc thời gian để bắt kịp ngay khi mega vừa pin xong.
      [400, 900, 1600, 2600, 4000].forEach((delay) => window.setTimeout(sync, delay));
      const observer = new MutationObserver(sync);
      observer.observe(panelEl, { attributes: true, attributeFilter: ["data-open", "data-floating"] }); // TASK00485 — bắt luôn lúc đổi mode floating⇄pin-right để sync ngay, không đợi tới lượt poll/resize kế tiếp
      window.addEventListener("resize", sync, { passive: true });
    };

    /* Khôi chốt (hardcode CHỈ riêng feature "Try Navi+ menus" — demo trên máy KH, KHÔNG đụng
       uigen_func.js.php dùng CHUNG cho isOwnSiteTest thật của khách hàng khác test menu của họ):
       - Trigger nổi Slide (#navi-test-slide-fab) chỉ hiện DESKTOP, ẩn hẳn mobile.
       - FAB thật (STICKY_FAB_SUPPORT, SF-4375927028) thêm margin-bottom:50px trên mobile (nếu có mặt)
         — tránh dính sát đáy màn hình/đè lên Tab Bar. Breakpoint 768px khớp quy ước sẵn có của runtime
         (common.css `@media screen and (min-width:769px)` = desktop). */
    const TRY_MENUS_MOBILE_QUERY = "(max-width: 768px)";
    const applyTryMenusResponsiveTweaks = () => {
      const mq = window.matchMedia(TRY_MENUS_MOBILE_QUERY);
      const apply = () => {
        const isMobile = mq.matches;
        const slideFab = document.getElementById("navi-test-slide-fab");
        // TASK00481: tôn trọng toggle tắt Slide — poll/resize KHÔNG tự bật lại slideFab nếu slide đang tắt
        if (slideFab) slideFab.style.display = (isMobile || _tryMenusHiddenKeys.has("slide")) ? "none" : "";
        const fabEl = document.getElementById(tryMenusEmbedIdFor("fab")); // TASK00519: tra qua override
        if (fabEl) fabEl.style.marginBottom = isMobile ? "50px" : "";
      };
      const attempts = [400, 900, 1600, 2600, 4000];
      attempts.forEach((delay) => window.setTimeout(apply, delay));
      if (mq.addEventListener) mq.addEventListener("change", apply);
      else mq.addListener(apply); // Safari cũ
    };

    // Phase 2: EDIT popup (đổi mẫu + config, áp dụng ngay bằng override + navigate lại)
    /* Mapping key ("tabbar"/"slide"/"megad"/"megam"/"fab") → tab_key thật trong menu_templates.json
       (docs/decisions/menu-template-tool-r2.md) — bỏ "grid" (Try Navi+ menus không demo GRID). */
    const TRY_MENUS_TAB_KEY = { tabbar: "bottombar", slide: "slide", megad: "mega-desktop", megam: "mega-mobile", fab: "fab", grid: "grid" };
    // Phase 0.4: desktopPosition THẬT lấy từ NAVIGLOBAL.DESKTOP_POSITION (frontend/uigen/includes/init.js)
    // — bảng rút gọn trong core.md không đủ (chỉ có 0/1). Bottom=BOTTOM_CENTER_FLOAT(0) — Khôi chốt
    // 2026-07-23, cũng là vị trí gốc của Tab Bar demo — Left=LEFT_TOP(6), Right=RIGHT_TOP(5): dock DỌC
    // mép màn hình, đúng nghĩa "trái/phải màn hình" hơn BOTTOM_LEFT/BOTTOM_RIGHT (2/3, vẫn là thanh
    // ngang dưới đáy chỉ lệch trái/phải).
    const TRY_MENUS_DESKTOP_POS = { bottom: "0", left: "6", right: "5" };
    const TRY_MENUS_DESKTOP_POS_REVERSE = { "0": "bottom", "6": "left", "5": "right" };

    /* Danh sách mẫu — public, KHÔNG auth (đọc chung với Theme Compat Advisor + popup chọn mẫu trong app,
       xem docs/decisions/menu-template-tool-r2.md), cache 5 phút trong biến module (khỏi fetch lại mỗi
       lần mở popup EDIT trong cùng phiên demo). */
    const MENU_TEMPLATES_JSON_URL = "https://cdn.naviplus.app/static/assets/v2/golive/menuTemplates/menu_templates.json";
    let _menuTemplatesCache = null;
    let _menuTemplatesCacheTs = 0;
    const fetchMenuTemplatesDB = async () => {
      if (_menuTemplatesCache && (Date.now() - _menuTemplatesCacheTs) < 5 * 60 * 1000) return _menuTemplatesCache;
      try {
        const res = await fetch(MENU_TEMPLATES_JSON_URL, { credentials: "omit" });
        if (!res.ok) throw new Error("HTTP " + res.status);
        const json = await res.json();
        _menuTemplatesCache = (json && json.data) ? json.data : null;
        _menuTemplatesCacheTs = Date.now();
      } catch (e) {
        _menuTemplatesCache = null;
      }
      return _menuTemplatesCache;
    };

    // Phase 2.5: resolver domain đa store cho gallery mẫu (thay thế giả định "mọi
    // source_embed_id thuộc shop naviplus.io" — SAI, Fable chạy SQL dev DB xác nhận 29/29 template
    // visible thuộc 4 store RIÊNG theo loại, KHÔNG phải naviplus.io — xem TASKS/TASK00519.md History
    // 2026-07-23 "Fable review Phase 0-2..."). naviplusCDNJson/navihelper.standardizeDomain là GLOBAL
    // THẬT của bundle uigen (khai báo top-level uigen.js.php/uigen_helper.js, TRƯỚC debugmode.js được
    // include) — KHÁC hàm nội bộ đóng kín trong IIFE `naviman` (xem docs/decisions/
    // try-navi-menus-demo-market-reuse.md mục TASK00501 "Gọi hàm nội bộ naviman IIFE" — lỗi đó KHÔNG áp
    // dụng ở đây vì 2 biến này không nằm trong `naviman`). standardizeDomain(domain,"") bỏ đuôi
    // ".myshopify.com" KHÔNG cần token (uigen_helper.js:49-54) — 4 store template là Shopify thường,
    // khác shop demo naviplus.io (Global, cần token NAVI733440).
    const TRY_MENUS_TEMPLATE_STORE_BY_TABKEY = {
      bottombar: "navi-tabbar.myshopify.com",
      slide: "navi-slidemenu.myshopify.com",
      "mega-desktop": "navi-megamenu.myshopify.com",
      "mega-mobile": "navi-megamenu.myshopify.com",
      fab: "navi-fab.myshopify.com",
      grid: "navi-gridmenu.myshopify.com",
    };
    /* Ứng viên domain thử lần lượt cho 1 tab_key: (1) source_shop THẬT nếu menu_templates.json đã có
       field này (lib.php Phase 2.5 bước 5 — future-proof, chưa bắt buộc regenerate ngay), (2) store cố
       định theo tab_key ở trên, (3) TRY_MENUS_DOMAIN/TOKEN (đề phòng generate lại đưa mẫu về
       naviplus.io). Card chỉ enable khi 1 trong 3 ứng viên fetch JSON menu thật thành công. */
    const tryMenuTemplateCandidateDomains = (tabKey, sourceShop) => {
      const list = [];
      if (sourceShop) list.push({ domain: sourceShop, token: "" });
      if (TRY_MENUS_TEMPLATE_STORE_BY_TABKEY[tabKey]) list.push({ domain: TRY_MENUS_TEMPLATE_STORE_BY_TABKEY[tabKey], token: "" });
      list.push({ domain: TRY_MENUS_DOMAIN, token: TRY_MENUS_TOKEN });
      return list;
    };
    /* Cache resolve = {domain, token} (ứng viên fetch OK đầu tiên) hoặc false (không ứng viên nào fetch
       được — card sẽ bị disable). Key = sourceEmbedId, đủ duy nhất trong 1 phiên demo (1 embed_id chỉ
       thuộc đúng 1 tab_key). */
    const _templateDomainCache = new Map();
    const resolveTryMenuTemplateDomain = async (sourceEmbedId, tabKey, sourceShop) => {
      if (_templateDomainCache.has(sourceEmbedId)) return _templateDomainCache.get(sourceEmbedId);
      const candidates = tryMenuTemplateCandidateDomains(tabKey, sourceShop);
      let resolved = false;
      for (const c of candidates) {
        const url = naviplusCDNJson + "/" + navihelper.standardizeDomain(c.domain, c.token) + "." + sourceEmbedId + ".json?v=0";
        try {
          // TASK00617/TASK00721: ?v=0 cố định + JSON không có Cache-Control → trình duyệt heuristic-cache
          // response cũ, resolve nhầm domain/token đã lỗi thời. no-store ép luôn probe bản mới nhất.
          const res = await fetch(url, { credentials: "omit", cache: "no-store" });
          if (res.ok) { resolved = { domain: c.domain, token: c.token }; break; }
        } catch (e) {}
      }
      _templateDomainCache.set(sourceEmbedId, resolved);
      return resolved;
    };

    const EDIT_POPUP_STYLE_ID = "navi_demo_edit_style";
    const ensureEditPopupStyle = () => {
      if (document.getElementById(EDIT_POPUP_STYLE_ID)) return;
      const style = document.createElement("style");
      style.id = EDIT_POPUP_STYLE_ID;
      style.textContent =
        "#navi_demo_edit_overlay{position:fixed;inset:0;z-index:2147483005;background:rgba(0,0,0,0.45);" +
        "display:flex;align-items:center;justify-content:center;font-family:ui-sans-serif,system-ui,-apple-system,Segoe UI,Roboto,Helvetica,Arial;}" +
        /* Khôi chốt 2026-07-23: card = flex column, CHỈ gallery cuộn (flex:1 + min-height:0) — phần config
           (vị trí) + nút Apply pin cứng ở đáy card, không trôi theo cuộn. */
        /* Khôi chốt 2026-07-23 (lượt 4): popup to gấp rưỡi (640px → 960px) */
        /* Khôi 2026-09-21: popup rộng hơn (960→1400) để thumbnail không quá bé; mega desktop 1 cột. */
        "#navi_demo_edit_overlay .navi-edit-card{position:relative;width:min(1400px,94vw);max-height:90vh;overflow:hidden;" +
        "display:flex;flex-direction:column;" +
        "background:#fff;color:#111827;border-radius:14px;padding:20px 22px;box-shadow:0 20px 60px rgba(0,0,0,0.35);}" +
        "#navi_demo_edit_overlay .navi-edit-close{position:absolute;top:10px;right:10px;width:28px;height:28px;border:none;" +
        "background:transparent;color:rgba(17,24,39,0.5);font-size:20px;line-height:1;cursor:pointer;border-radius:6px;}" +
        "#navi_demo_edit_overlay .navi-edit-close:hover{background:rgba(17,24,39,0.06);color:#111827;}" +
        "#navi_demo_edit_overlay .navi-edit-title{font-size:16px;font-weight:700;margin-bottom:14px;padding-right:26px;}" +
        /* Khôi chốt 2026-07-23 (lượt 4): 2 thumbnail / 1 dòng trong popup 960px (mỗi thumb ~450px, vẫn
           to rõ vì img height:auto giữ tỉ lệ gốc). Gallery là vùng CUỘN duy nhất của card (flex:1 1 auto
           + min-height:0 để flex cho phép co — thiếu min-height:0 thì flex item không bao giờ nhỏ hơn
           content, mất cuộn). */
        "#navi_demo_edit_overlay .navi-edit-gallery[data-wide='1']{grid-template-columns:1fr;}" +
        "#navi_demo_edit_overlay .navi-edit-gallery{display:grid;grid-template-columns:repeat(2,1fr);gap:8px;" +
        "overflow-y:auto;flex:1 1 auto;min-height:0;}" +
        "#navi_demo_edit_overlay .navi-edit-card-item{border:2px solid rgba(17,24,39,0.1);border-radius:10px;padding:6px;cursor:pointer;text-align:center;}" +
        "#navi_demo_edit_overlay .navi-edit-card-item:hover{border-color:rgba(17,24,39,0.3);}" +
        "#navi_demo_edit_overlay .navi-edit-card-item[data-selected='1']{border-color:#111827;background:rgba(17,24,39,0.04);}" +
        "#navi_demo_edit_overlay .navi-edit-card-item[data-unavailable='1']{opacity:0.4;cursor:not-allowed;pointer-events:none;}" +
        /* Khôi chốt 2026-07-23 (lượt 3): thumbnail full-width GIỮ NGUYÊN tỉ lệ gốc (height:auto, bỏ khung
           cao cố định + object-fit:contain — khung cố định làm ảnh screenshot bị ép nhỏ, không nhìn được). */
        "#navi_demo_edit_overlay .navi-edit-card-item img{width:100%;height:auto;background:#f9fafb;border-radius:6px;margin-bottom:4px;}" +
        /* Thumbnail thật trên R2 đều 3200x1800 (16:9) nhưng thẻ img không khai kích thước và CSS để
           height:auto ⇒ TRƯỚC khi ảnh tải xong mọi card cao ~0px, dồn hết vào viewport nên
           loading="lazy" vô hiệu: cả 36 ảnh (tab Icon Menu) tải + giải nén cùng lúc ≈ 207 triệu pixel
           (~790MB bitmap) → popup đứng hình vài giây. Ghim sẵn tỉ lệ 16/9 để card chiếm đúng chỗ ngay
           từ đầu ⇒ lazy chạy thật (chỉ ảnh trong tầm nhìn mới tải), đồng thời không còn nhảy layout.
           Skeleton shimmer chạy cho tới khi ảnh load xong để khách biết đang tải, không tưởng bị lỗi. */
        "#navi_demo_edit_overlay .navi-edit-card-item img{aspect-ratio:16/9;object-fit:cover;object-position:top center;}" +
        "#navi_demo_edit_overlay .navi-edit-card-item .navi-edit-thumb-wrap{position:relative;width:100%;border-radius:6px;overflow:hidden;background:#f3f4f6;margin-bottom:4px;}" +
        "#navi_demo_edit_overlay .navi-edit-card-item .navi-edit-thumb-wrap img{margin-bottom:0;display:block;}" +
        "#navi_demo_edit_overlay .navi-edit-skel{position:absolute;inset:0;background:linear-gradient(100deg,#f3f4f6 30%,#e5e7eb 50%,#f3f4f6 70%);" +
        "background-size:220% 100%;animation:naviEditSkel 1.1s linear infinite;}" +
        "#navi_demo_edit_overlay .navi-edit-thumb-wrap[data-loaded='1'] .navi-edit-skel{display:none;}" +
        "#navi_demo_edit_overlay .navi-edit-skel-card{border:2px solid rgba(17,24,39,0.06);border-radius:10px;padding:6px;}" +
        "#navi_demo_edit_overlay .navi-edit-skel-card .navi-edit-thumb-wrap{aspect-ratio:16/9;}" +
        "@keyframes naviEditSkel{0%{background-position:120% 0}100%{background-position:-20% 0}}" +
        "#navi_demo_edit_overlay .navi-edit-card-item .navi-edit-card-noimg{width:100%;height:110px;background:#f9fafb;border-radius:6px;margin-bottom:4px;" +
        "display:flex;align-items:center;justify-content:center;color:rgba(17,24,39,0.35);font-size:11px;}" +
        "#navi_demo_edit_overlay .navi-edit-tier{grid-column:1/-1;font-size:11px;font-weight:700;color:rgba(17,24,39,0.5);margin-top:4px;text-transform:uppercase;letter-spacing:.03em;}" +
        "#navi_demo_edit_overlay .navi-edit-radio-row{display:flex;gap:14px;flex-wrap:wrap;}" +
        "#navi_demo_edit_overlay .navi-edit-radio-row label{display:flex;align-items:center;gap:5px;font-size:13px;cursor:pointer;}" +
        "#navi_demo_edit_overlay .navi-edit-radio-row input:disabled + span{color:rgba(17,24,39,0.35);}" +
        "#navi_demo_edit_overlay .navi-edit-note{margin-top:6px;font-size:11.5px;color:rgba(17,24,39,0.55);}" +
        /* Khôi chốt 2026-07-23 (lượt 6): footer 1 HÀNG pin đáy — config trái, Apply phải (desktop);
           mobile xuống dòng (media query cuối). Apply hết flex:1 trên desktop (nút gọn bên phải). */
        "#navi_demo_edit_overlay .navi-edit-footer{display:flex;align-items:center;justify-content:space-between;gap:14px;margin-top:14px;flex-wrap:wrap;}" +
        "#navi_demo_edit_overlay .navi-edit-footer-config{flex:1 1 auto;min-width:0;}" +
        "#navi_demo_edit_overlay .navi-edit-config-label{font-size:12.5px;font-weight:700;color:#111827;margin-right:4px;white-space:nowrap;}" +
        "#navi_demo_edit_overlay .navi-edit-actions{display:flex;gap:8px;flex:0 0 auto;}" +
        "#navi_demo_edit_overlay .navi-edit-actions button{appearance:none;border-radius:8px;padding:10px 22px;font-size:13px;font-weight:600;cursor:pointer;}" +
        "#navi_demo_edit_overlay .navi-edit-remove{border:1px solid #fca5a5;background:#fee2e2;color:#991b1b;}" +
        "#navi_demo_edit_overlay .navi-edit-apply{border:1px solid #111827;background:#111827;color:#fff;}" +
        "#navi_demo_edit_overlay .navi-edit-loading{grid-column:1/-1;font-size:12.5px;color:rgba(17,24,39,0.55);padding:10px 0;}" +
        "@media (max-width:768px){#navi_demo_edit_overlay .navi-edit-card{width:100vw;max-width:100vw;height:100vh;max-height:100vh;border-radius:0;}" +
        "#navi_demo_edit_overlay .navi-edit-footer{flex-direction:column;align-items:stretch;}" +
        "#navi_demo_edit_overlay .navi-edit-actions button{width:100%;}}";
      document.head.appendChild(style);
    };

    let _editPopupState = null; // { key, selectedEmbed, desktopPos, megaMode, mainMenuSelector }
    let _editPopupEls = null; // DOM refs, tạo 1 lần (singleton), tái dùng qua mỗi lần mở

    /* Home "Kiểm tra Selector" mở popup này cho nút "Try menu" theo spot: đóng popup mà KHÔNG Apply →
       gọi hook để Home dọn trạng thái "đang thử" (cờ trying/hidden keys đã đặt sẵn trước khi mở). */
    let _editPopupCancelHook = null;
    let _editPopupApplied = false;
    const closeTryMenuEditPopup = () => {
      if (_editPopupEls) _editPopupEls.overlay.style.display = "none";
      _editPopupState = null;
      const hook = _editPopupCancelHook;
      const applied = _editPopupApplied;
      _editPopupCancelHook = null;
      _editPopupApplied = false;
      if (hook && !applied) hook();
    };

    const ensureTryMenuEditPopupDom = () => {
      if (_editPopupEls) return _editPopupEls;
      ensureEditPopupStyle();
      const overlay = document.createElement("div");
      overlay.id = "navi_demo_edit_overlay";
      overlay.style.display = "none";
      overlay.innerHTML =
        "<div class='navi-edit-card'>" +
          "<button type='button' class='navi-edit-close' aria-label='Close'>&times;</button>" +
          /* Khôi chốt 2026-07-23 (lượt 6): title = "Choose a template" cố định (bỏ "Edit demo — <kind>"
             + bỏ luôn section-title trùng chữ); footer = 1 HÀNG ngang pin đáy: config (radio) bên trái
             + nút Apply bên phải (mobile xuống dòng — media query bên dưới). */
          "<div class='navi-edit-title'>Choose a template</div>" +
          "<div class='navi-edit-gallery' data-part='gallery'></div>" +
          "<div class='navi-edit-footer'>" +
            "<div class='navi-edit-footer-config' data-part='config'></div>" +
            "<div class='navi-edit-actions'>" +
              /* Khôi chốt 2026-07-23: bỏ nút Cancel — đã có nút × close (+ click nền overlay cũng đóng) */
              /* Khôi 2026-09-21: nút Remove — bỏ menu demo khỏi spot này (chỉ hiện khi spot đang demo) */
              "<button type='button' class='navi-edit-remove' data-part='remove' style='display:none'>Remove</button>" +
              "<button type='button' class='navi-edit-apply' data-part='apply'>Apply</button>" +
            "</div>" +
          "</div>" +
        "</div>";
      document.body.appendChild(overlay);
      overlay.addEventListener("click", (e) => { if (e.target === overlay) closeTryMenuEditPopup(); });
      const els = {
        overlay,
        gallery: overlay.querySelector("[data-part='gallery']"),
        config: overlay.querySelector("[data-part='config']"),
        applyBtn: overlay.querySelector("[data-part='apply']"),
        removeBtn: overlay.querySelector("[data-part='remove']"),
        closeBtn: overlay.querySelector(".navi-edit-close"),
      };
      els.closeBtn.addEventListener("click", closeTryMenuEditPopup);
      els.applyBtn.addEventListener("click", () => applyTryMenuEditChanges());
      els.removeBtn.addEventListener("click", () => {
        const key = _editPopupState && _editPopupState.key;
        _editPopupApplied = true; // đóng do hành động, không chạy hook huỷ
        closeTryMenuEditPopup();
        if (key) selCheckStopByKey(key);
      });
      _editPopupEls = els;
      return els;
    };

    /* Tách số thứ tự đứng đầu tier_label ("1.Basic" → {priority:1, label:"Basic"}).
       Số CHỈ để sắp thứ tự (càng lớn càng lên đầu), không hiện ra cho khách. Không có số → 0.
       Dấu phân cách (. ) -) là BẮT BUỘC để không ăn nhầm tên mở đầu bằng số ("2024 Collection").
       Bản JS của mt_parseTierLabel() trong app/views/createNew/com.list-clone-step1.php — sửa 1 bên
       thì sửa cả bên kia. Khác 1 điểm: rỗng ở đây trả "" (không hiện tiêu đề nhóm, giữ hành vi cũ
       của gallery này) thay vì rơi về nhãn 'Full features' như popup tạo menu mới. */
    const parseTierLabel = (raw) => {
      let s = String(raw == null ? "" : raw).trim();
      const m = s.match(/^(\d+)\s*[.)\-]\s*/);
      let priority = 0;
      if (m) {
        priority = parseInt(m[1], 10);
        s = s.slice(m[0].length).trim();
      }
      return { priority: priority, label: s };
    };

    /* Render lưới mẫu — Default (embed demo gốc) LUÔN là card đầu tiên, sau đó tới danh sách fetch từ
       menu_templates.json, group theo tier_label. "Lưới an toàn" (Phase 0.2 + Phase 2.5): resolve NGẦM
       (không chặn render) domain thật của từng candidate bằng resolveTryMenuTemplateDomain() (thử
       source_shop → store theo tab_key → naviplus.io, xem khối resolver phía trên) — không resolve được
       thì disable card + chú thích nhỏ SAU khi biết kết quả, tuyệt đối không tin mù danh sách R2 khớp
       100% 1 domain cố định. Default KHÔNG resolve lại (đang là bản chạy live trên chính trang này,
       domain của nó luôn là TRY_MENUS_DOMAIN/TRY_MENUS_TOKEN, khỏi tốn 1 fetch thừa). */
    const renderTryMenuEditGallery = async (key, els, state) => {
      // chờ menu_templates.json = lưới skeleton (6 ô) thay 1 dòng chữ — khách thấy ngay
      // hình hài gallery sắp hiện, không tưởng popup lỗi.
      els.gallery.innerHTML = new Array(6).fill(
        "<div class='navi-edit-skel-card'><div class='navi-edit-thumb-wrap'><div class='navi-edit-skel'></div></div></div>"
      ).join("");
      els.gallery.dataset.wide = "0"; // Khôi 2026-09-21: desktop cũng 2 thumbnail/dòng (popup đã nới 1400px là đủ to)
      const defaultCard = { source_embed_id: TRY_MENUS_EMBEDS[key], name: "Default", tier_label: null, isDefault: true };
      // slot mượn (tabKeyOverride = mega-desktop) → card Default là mẫu Mega Desktop mặc định (không phải mobile)
      let list = state.tabKeyOverride
        ? [{ source_embed_id: SEL_CHECK_MAINMENU_DEFAULT_EMBED, name: "Default", tier_label: null, isDefault: true }]
        : [defaultCard];
      const db = await fetchMenuTemplatesDB();
      const tabKey = state.tabKeyOverride || TRY_MENUS_TAB_KEY[key];
      if (db && Array.isArray(db[tabKey])) {
        const fetched = db[tabKey].filter((t) => t && t.source_embed_id && t.source_embed_id !== list[0].source_embed_id);
        /* Sắp nhóm theo số ưu tiên đứng đầu tier_label (số càng lớn càng lên đầu) — cùng quy ước
           với popup "Choose the menu template" (com.list-clone-step1.php: mt_parseTierLabel).
           Sắp gián tiếp qua mảng trang trí để KHÔNG gắn thêm field vào object của db (db được cache
           dùng lại nhiều lần). Cùng priority thì giữ nguyên thứ tự JSON trả về. */
        const decorated = fetched.map((t, i) => ({ item: t, priority: parseTierLabel(t.tier_label).priority, seq: i }));
        decorated.sort((a, b) => (b.priority - a.priority) || (a.seq - b.seq));
        list = list.concat(decorated.map((d) => d.item));
      }
      // TASK00519 Phase 2.5: lưu meta (đặc biệt source_shop nếu JSON có) theo embed_id để
      // applyTryMenuEditChanges() tái dùng khi resolve domain lúc Apply — khỏi phải tìm lại trong list.
      state.templateMetaByEmbed = {};
      list.forEach((t) => { state.templateMetaByEmbed[t.source_embed_id] = t; });

      const renderCard = (t) => {
        const div = document.createElement("div");
        div.className = "navi-edit-card-item";
        div.dataset.embed = t.source_embed_id;
        if (t.source_embed_id === state.selectedEmbed) div.dataset.selected = "1";
        /* Khôi chốt 2026-07-23: ƯU TIÊN thumbnail MOBILE cho mọi kind — giống gallery lúc tạo menu mới
           (kinds/*.php: tabbar/slide/fab/mega-mobile đều render bản mobile) — TRỪ megad (mega desktop)
           dùng thumbnail desktop (menu bản chất desktop, ảnh mobile không thể hiện đúng). KHÔNG còn
           chọn theo viewport như trước. */
        const thumb = (key === "megad" || state.tabKeyOverride === "mega-desktop") ? (t.thumbnail_desktop || t.thumbnail_mobile) : (t.thumbnail_mobile || t.thumbnail_desktop); // slot mượn mega-desktop cũng dùng ảnh desktop
        if (thumb) {
          /* khung giữ chỗ 16:9 + skeleton — ảnh nguồn 3200x1800 rất nặng lúc giải nén,
             phải để lazy làm việc thật (card chiếm chỗ ngay) và báo "đang tải" cho khách. */
          const wrap = document.createElement("div");
          wrap.className = "navi-edit-thumb-wrap";
          const skel = document.createElement("div");
          skel.className = "navi-edit-skel";
          const img = document.createElement("img");
          img.loading = "lazy";
          img.decoding = "async";        // giải nén ngoài luồng chính → không khựng khi cuộn
          img.width = 3200; img.height = 1800;   // tỉ lệ chuẩn của thumbnail R2
          img.alt = t.name || "";
          img.addEventListener("load", () => { wrap.dataset.loaded = "1"; });
          img.addEventListener("error", () => { wrap.dataset.loaded = "1"; });
          img.src = thumb;
          wrap.appendChild(skel);
          wrap.appendChild(img);
          div.appendChild(wrap);
        } else {
          const ph = document.createElement("div");
          ph.className = "navi-edit-card-noimg";
          ph.textContent = t.isDefault ? "Current" : "No preview";
          div.appendChild(ph);
        }
        /* Khôi chốt 2026-07-23 (lượt 6): bỏ tên template dưới thumbnail (không cần) — card không ảnh
           vẫn còn chữ trong placeholder ("Current"/"No preview") nên không thành ô trống vô danh. */
        div.addEventListener("click", () => {
          if (div.dataset.unavailable === "1") return;
          els.gallery.querySelectorAll(".navi-edit-card-item").forEach((c) => delete c.dataset.selected);
          div.dataset.selected = "1";
          state.selectedEmbed = t.source_embed_id;
        });
        return div;
      };

      els.gallery.innerHTML = "";
      let lastTier;
      /* Khôi 2026-09-21: bỏ card "Current"/Default khỏi gallery — mẫu mặc định vẫn là lựa chọn ngầm khi
         chưa chọn gì; đang chọn mẫu không có card (mặc định) → tô chọn card đầu tiên cho rõ. */
      const visible = list.filter((t) => !t.isDefault);
      if (visible.length && !visible.some((t) => t.source_embed_id === state.selectedEmbed)) state.selectedEmbed = visible[0].source_embed_id;
      visible.forEach((t) => {
        /* bỏ số thứ tự đứng đầu, chỉ hiện phần chữ ("1.Basic" → "Basic") */
        const tierLabel = parseTierLabel(t.tier_label).label;
        if (tierLabel && tierLabel !== lastTier) {
          const tierEl = document.createElement("div");
          tierEl.className = "navi-edit-tier";
          tierEl.textContent = tierLabel;
          els.gallery.appendChild(tierEl);
          lastTier = tierLabel;
        }
        els.gallery.appendChild(renderCard(t));
      });

      list.filter((t) => !t.isDefault).forEach((t) => {
        // TASK00519 Phase 2.5: dùng resolver đa store thay vì validate 1 URL cố định — xem khối
        // resolveTryMenuTemplateDomain() phía trên (đọc t.source_shop nếu JSON đã có, future-proof).
        resolveTryMenuTemplateDomain(t.source_embed_id, tabKey, t.source_shop).then((resolved) => {
          if (resolved) return;
          const card = Array.prototype.find.call(
            els.gallery.querySelectorAll(".navi-edit-card-item"),
            (c) => c.dataset.embed === t.source_embed_id
          );
          if (!card) return;
          card.dataset.unavailable = "1";
          if (card.dataset.selected === "1") { delete card.dataset.selected; state.selectedEmbed = defaultCard.source_embed_id; }
          const note = document.createElement("div");
          note.style.cssText = "font-size:9.5px;color:#dc2626;margin-top:2px;";
          note.textContent = "Not available";
          card.appendChild(note);
        });
      });
    };

    /* Config theo kind — CHỈ TABBAR (Desktop position) và MEGA (Insert below header / Replace current
       menu); slide/fab không có config nào trong v1 (khung để sẵn theo plan, chưa cần thêm control gì). */
    const renderTryMenuEditConfig = (key, els, state) => {
      els.config.innerHTML = "";
      if (key === "tabbar") {
        const wrap = document.createElement("div");
        wrap.innerHTML =
          "<div class='navi-edit-radio-row'>" +
            "<span class='navi-edit-config-label'>Desktop position:</span>" +
            "<label><input type='radio' name='naviEditDesktopPos' value='bottom'><span>Bottom</span></label>" +
            "<label><input type='radio' name='naviEditDesktopPos' value='left'><span>Left</span></label>" +
            "<label><input type='radio' name='naviEditDesktopPos' value='right'><span>Right</span></label>" +
          "</div>";
        els.config.appendChild(wrap);
        wrap.querySelectorAll("input[name='naviEditDesktopPos']").forEach((r) => {
          r.checked = (r.value === state.desktopPos);
          r.addEventListener("change", () => { state.desktopPos = r.value; });
        });
      } else if (key === "megad" || key === "megam") {
        const canReplace = !!state.mainMenuSelector;
        const wrap = document.createElement("div");
        wrap.innerHTML =
          "<div class='navi-edit-radio-row'>" +
            "<span class='navi-edit-config-label'>Placement:</span>" +
            "<label><input type='radio' name='naviEditMegaMode' value='below-header'><span>Insert below header</span></label>" +
            "<label><input type='radio' name='naviEditMegaMode' value='replace'" + (canReplace ? "" : " disabled") + "><span>Replace current menu</span></label>" +
          "</div>" +
          (canReplace ? "" : "<div class='navi-edit-note'>Your theme is not supported for replace yet.</div>");
        els.config.appendChild(wrap);
        wrap.querySelectorAll("input[name='naviEditMegaMode']").forEach((r) => {
          r.checked = (r.value === state.megaMode);
          r.addEventListener("change", () => { state.megaMode = r.value; });
        });
      }
    };

    /* Entry point — click nút EDIT trên cụm nút Phase 1 (_tryMenusEditPopupFn, wire ở cuối block này). */
    const openTryMenuEditPopup = async (key, opts) => {
      const els = ensureTryMenuEditPopupDom();
      const overrides = readTryMenusOverrides();
      const existing = (overrides && overrides[key]) || {};
      /* opts (Home "Kiểm tra Selector", spot Main menu): slot megam mượn để chạy 1 Mega DESKTOP ngắn
         thay nav → gallery lấy tab "mega-desktop" thay vì tab của key, mẫu chọn sẵn = defaultEmbed
         (không có card "Default" mobile). Không opts → y như cũ. */
      /* Nút EDIT trên chính menu demo gọi không có opts → slot megam đang mượn cho Mega DESKTOP ngắn
         (spot Current main menu đang thử) phải vẫn ra gallery mega-desktop (Khôi: bấm EDIT ra mẫu mobile = sai). */
      const borrowedForMainMenu = key === "megam" && !opts && readSelCheckTryingSet().indexOf("mainMenu") !== -1;
      const tabKeyOverride = (opts && opts.tabKey) || (borrowedForMainMenu ? "mega-desktop" : null);
      const defaultEmbed = (opts && opts.defaultEmbed) || (borrowedForMainMenu ? SEL_CHECK_MAINMENU_DEFAULT_EMBED : null);
      // mainMenuSelector chỉ tính cho megad/megam — cần theme đã resolve VÀ selector khớp DOM hiện tại
      // THẬT (không chỉ có mặt trong theme-selectors.json — theme chọn sai vẫn có thể có field mainMenu
      // nhưng không khớp element nào trên site đang xem, cùng cách buildTryMenusPlacementOverride() check).
      let mainMenuSelector = null;
      if ((key === "megad" || key === "megam") && _lastResolvedTheme && _lastResolvedTheme.selectors && _lastResolvedTheme.selectors.mainMenu) {
        try { if (document.querySelector(_lastResolvedTheme.selectors.mainMenu)) mainMenuSelector = _lastResolvedTheme.selectors.mainMenu; } catch (e) {}
      }
      _editPopupState = {
        key,
        selectedEmbed: existing.embed || defaultEmbed || TRY_MENUS_EMBEDS[key],
        desktopPos: (existing.setting_patch && TRY_MENUS_DESKTOP_POS_REVERSE[existing.setting_patch.desktopPosition]) || "bottom",
        megaMode: existing.mode || "below-header",
        mainMenuSelector,
        tabKeyOverride, // slot mượn (Home Kiểm tra Selector)
      };
      els.overlay.style.display = "flex";
      // Remove chỉ khi spot dùng key này đang demo (bấm EDIT trên menu demo / Try lại spot đang bật)
      const _set = readSelCheckTryingSet();
      els.removeBtn.style.display = (_tryMenusOn && _set.some((id) => selCheckKeyFor(id, _set) === key)) ? "" : "none";
      renderTryMenuEditConfig(key, els, _editPopupState);
      await renderTryMenuEditGallery(key, els, _editPopupState);
    };

    const showTryMenusApplyingOverlay = () => {
      const el = document.createElement("div");
      el.id = "navi_demo_applying_overlay";
      el.textContent = "Applying…";
      el.style.cssText = "position:fixed;inset:0;z-index:2147483647;background:rgba(255,255,255,0.75);" +
        "display:flex;align-items:center;justify-content:center;font:600 14px/1.4 ui-sans-serif,system-ui,-apple-system,Segoe UI,Roboto,Helvetica,Arial;color:#111827;";
      document.body.appendChild(el);
    };

    // Phase 2.5: ghi map phẳng embed_id → domain/token thật cho DemoMarket.loadEmbeds
    // đọc (per-embed prefix — xem khối sửa DemoMarket.js). Rebuild TOÀN BỘ map từ overrides hiện tại mỗi
    // lần Apply (không cộng dồn rác — entry nào không còn override embed thì domain cũ của nó cũng bỏ).
    const TRY_MENUS_EMBED_DOMAINS_SESSION_KEY = "_naviplus_try_menus_embed_domains";
    const writeTryMenusEmbedDomains = (overrides) => {
      const map = {};
      Object.keys(overrides || {}).forEach((k) => {
        const e = overrides[k];
        if (e && e.embed && e.domain) map[e.embed] = { d: e.domain, t: e.token || "" };
      });
      try {
        if (Object.keys(map).length) sessionStorage.setItem(TRY_MENUS_EMBED_DOMAINS_SESSION_KEY, JSON.stringify(map));
        else sessionStorage.removeItem(TRY_MENUS_EMBED_DOMAINS_SESSION_KEY);
      } catch (e) {}
    };

    /* Apply — ghi override (KHÔNG rebuild toàn bộ overrides, chỉ thay đúng entry của key đang sửa, giữ
       nguyên entry của 4 key còn lại — spread trên bản đọc lại readTryMenusOverrides()) rồi navigate lại
       URL demo. KHÔNG gọi renderTryMenusDemo() ở đây: hàm đó tự resolve lại theme rồi GHI ĐÈ TOÀN BỘ
       TRY_MENUS_PLACEMENT_SESSION_KEY từ đầu — đủ cho lần "Turn on demo" đầu tiên nhưng sẽ xoá mất lựa
       chọn "Replace" vừa Apply. buildTryMenusPlacementOverride() đã được sửa để tự đọc lại override MEGA
       mỗi lần gọi (xem đoạn thêm ở đầu hàm đó) nên chỉ cần navigate thẳng qua buildTryMenusDemoUrl().
       TASK00519 Phase 2.5: mẫu KHÁC Default thuộc store riêng (KHÔNG phải naviplus.io) — phải resolve
       domain/token TRƯỚC khi ghi override (await), huỷ Apply nếu không resolve được (an toàn hơn ghi
       1 embed không thể fetch — về lý thuyết card đó đã bị disable ở gallery, đây là lưới an toàn kép). */
    const applyTryMenuEditChanges = async () => {
      const state = _editPopupState;
      if (!state) return;
      const isDefaultSelection = !state.selectedEmbed || state.selectedEmbed === TRY_MENUS_EMBEDS[state.key];
      let resolvedDomain = null;
      if (!isDefaultSelection) {
        const meta = state.templateMetaByEmbed && state.templateMetaByEmbed[state.selectedEmbed];
        resolvedDomain = await resolveTryMenuTemplateDomain(state.selectedEmbed, state.tabKeyOverride || TRY_MENUS_TAB_KEY[state.key], meta && meta.source_shop); // tab theo slot mượn
        if (!resolvedDomain) {
          showPanelSnackbar("This template is unavailable right now — pick another.");
          return;
        }
      }

      const overrides = Object.assign({}, readTryMenusOverrides());
      const entry = {};
      if (!isDefaultSelection) {
        entry.embed = state.selectedEmbed;
        entry.domain = resolvedDomain.domain;
        entry.token = resolvedDomain.token;
      }
      if (state.key === "tabbar") {
        entry.setting_patch = { desktopPosition: TRY_MENUS_DESKTOP_POS[state.desktopPos] || TRY_MENUS_DESKTOP_POS.bottom };
      } else if (state.key === "megad" || state.key === "megam") {
        entry.mode = state.megaMode || "below-header";
        // Khôi 2026-09-20: Replace main menu → nền level-1 trong suốt (runtime demo merge theo embed,
        // uigen_func.js.php; ADD MENU mang cùng field → menu thật giống demo).
        if (entry.mode === "replace") entry.setting_patch = { level1BackgroundHide: true };
      }
      if (Object.keys(entry).length) overrides[state.key] = entry; else delete overrides[state.key];
      writeTryMenusOverrides(Object.keys(overrides).length ? overrides : null);
      writeTryMenusEmbedDomains(overrides);
      _editPopupApplied = true; // đóng popup do Apply — không chạy hook huỷ của Home
      try {
        const _set = readSelCheckTryingSet();
        selCheckLog("applied", { key: state.key, spots: _set.filter((id) => selCheckKeyFor(id, _set) === state.key), embed: state.selectedEmbed || "" });
      } catch (e) {}
      safeLocalStorage.set(TRY_MENUS_STORAGE_KEY, "1"); // Try từ Home: demo chưa từng bật, cờ phải "1" để restore khi lướt trang khác
      /* BUG Khôi báo: chọn Main menu + Replace vẫn chèn dưới header. Nguyên nhân: Apply chỉ navigate,
         KHÔNG ghi TRY_MENUS_PLACEMENT_SESSION_KEY trước — lúc trang mới load, DemoMarket (uigen.js.php,
         chạy TRƯỚC livemode.js lazy-load) đọc placement từ sessionStorage: chưa có (Try đầu từ Home
         chưa từng qua renderTryMenusDemo) hoặc còn giá trị cũ → vẽ theo fallback "gần header";
         initTryMenusPanelState() tính lại nhưng đã muộn (race). Ghi placement NGAY TẠI ĐÂY, sau khi
         overrides (mode) đã lưu, giống renderTryMenusDemo() làm. */
      if (_lastResolvedTheme) {
        const placement = buildTryMenusPlacementOverride(_lastResolvedTheme.selectors);
        try {
          if (placement) sessionStorage.setItem(TRY_MENUS_PLACEMENT_SESSION_KEY, JSON.stringify(placement));
          else sessionStorage.removeItem(TRY_MENUS_PLACEMENT_SESSION_KEY);
        } catch (e) {}
      }
      closeTryMenuEditPopup();
      showTryMenusApplyingOverlay();
      /* URL đích TRÙNG URL hiện tại (đang ở demo, chọn mẫu Default / chỉ đổi mode hay thêm spot) →
         gán location.href không reload (chỉ khác/không khác hash) → kẹt "Applying…" mãi. Reload tường minh. */
      const nextUrl = buildTryMenusDemoUrl(true);
      if (nextUrl === window.location.href) window.location.reload();
      else window.location.href = nextUrl;
    };

    // Wire hook cho cụm nút Phase 1 (_tryMenusEditPopupFn khai báo gần _tickPulseMarkers, đầu block Phase 1)
    _tryMenusEditPopupFn = openTryMenuEditPopup;

    // Phase 3: USE THIS — hòm thư relay tối thiểu (KHÔNG realtime, xem mục 2 plan)
    // để chèn menu mẫu (+ config đã chọn ở EDIT) vào danh sách menu THẬT của khách + gate limit/trial.
    // Nguyên tắc phân quyền: tab FE (site khách, ở đây) KHÔNG BAO GIỜ tự ghi dữ liệu — chỉ "xin" qua
    // relay; tab BE (admin, đã đăng nhập) mới thực thi bằng session sẵn có (com.theme-demo-engine.php).
    // Host: cùng quy ước branch dev/prod theo _NAVIPLUS_VERSION đã dùng cho MENU_SCAN_API_URL ở dưới.
    const DEBUG_BRIDGE_API_URL = (_NAVIPLUS_VERSION !== "DEV")
      ? "https://dash.naviplus.app/naviplus/microservices/debug-bridge/api.php"
      : "https://dev-shopify.naviplus.app/naviplus/microservices/debug-bridge/api.php";

    /* Token "navich" ghép cặp tab BE↔FE — BE gắn &navich=<token> vào URL khi mở demo từ admin
       (gsLpFinishDemo, com.theme-demo-engine.php). CHỈ dùng ghép cặp + lọc rác trong relay, KHÔNG phải
       secret cấp quyền (xem comment đầu khối). Ưu tiên URL (mới nhất), fallback sessionStorage (sống
       qua navigate EDIT-apply vì buildTryMenusDemoUrl() không đụng tới param "navich"). Demo mở tay
       (không qua admin, không có navich) → requestUseThis() sẽ báo hướng dẫn thay vì gọi relay mù. */
    const TRY_MENUS_BRIDGE_CH_SESSION_KEY = "navi_demo_bridge_ch";
    const readTryMenusBridgeChannel = () => {
      try {
        const fromUrl = new URLSearchParams(window.location.search).get("navich");
        if (fromUrl && /^[A-Za-z0-9_-]{24,64}$/.test(fromUrl)) {
          sessionStorage.setItem(TRY_MENUS_BRIDGE_CH_SESSION_KEY, fromUrl);
          return fromUrl;
        }
        return sessionStorage.getItem(TRY_MENUS_BRIDGE_CH_SESSION_KEY) || null;
      } catch (e) {
        return null;
      }
    };

    /* Bắt token NGAY LÚC TRANG LOAD (không chỉ lúc bấm USE THIS): user có thể lướt sang trang khác
       của site (URL rơi hết param như cơ chế navi_demo_params) rồi MỚI bấm USE THIS — nếu không lưu
       sessionStorage từ lần load đầu tiên (lúc navich còn trên URL) thì token mất vĩnh viễn theo URL. */
    readTryMenusBridgeChannel();

    const tryMenusBridgeRandId = () => Math.random().toString(36).slice(2, 10);

    /* Đẩy 1 message fe2be lên relay, trả về id message đó (BE reply theo reply_to=id này). */
    const tryMenusBridgePush = (ch, type, payload) => {
      const id = tryMenusBridgeRandId();
      const body = { ch, dir: "fe2be", ts: Math.floor(Date.now() / 1000), id, type, payload };
      return fetch(DEBUG_BRIDGE_API_URL + "?action=push", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      }).then((res) => {
        if (!res.ok) throw new Error("HTTP " + res.status);
        return id;
      });
    };
    /* Kéo message be2fe mới hơn "after" (epoch giây) — dùng lọc bớt message cũ không liên quan, KHÔNG
       phải cơ chế dedupe chính (dedupe chính = so reply_to với id request tại nơi gọi). */
    const tryMenusBridgePull = (ch, after) => {
      const url = DEBUG_BRIDGE_API_URL + "?action=pull&ch=" + encodeURIComponent(ch) + "&dir=be2fe&after=" + (after || 0);
      return fetch(url).then((res) => {
        if (!res.ok) throw new Error("HTTP " + res.status);
        return res.json();
      });
    };

    /* setting_patch whitelist gửi kèm use-this — tái dùng NGUYÊN state đã tính cho EDIT popup, KHÔNG
       tự suy luận lại: tabbar lấy thẳng override.setting_patch (đã đúng field `desktopPosition`); mega
       đọc `_lastPlacementOverride` (kết quả buildTryMenusPlacementOverride() đang chạy SỐNG trên chính
       trang demo hiện tại — validate LIVE selector rồi, đúng những gì user đang THẤY trên màn hình) map
       4 field publishToPlace* theo đúng docs/decisions/theme-compat-advisor.md (kind "1"=replace,"2"=after). */
    const buildTryMenusUseThisSettingPatch = (key, overrideEntry) => {
      if (key === "tabbar") {
        return (overrideEntry && overrideEntry.setting_patch) ? overrideEntry.setting_patch : {};
      }
      /* Slide demo bật từ Home "Kiểm tra Selector" (Try ở spot Hamburger/Logo) → ADD MENU mang theo
         đúng cách gắn: hamburger thật (Method 1, publishTriggerIDClass) hoặc icon cạnh logo (Method 3,
         publishTriggerHamburger, cú pháp "selector|color|boxed|side(device)" như demo đang dùng). Đọc
         selector đã dò (không đọc _lastPlacementOverride — logo ở đó là attribute marker tạm, không
         phải selector bền). Không có → {} như cũ. */
      if (key === "slide") {
        let sc = null;
        try { sc = JSON.parse(sessionStorage.getItem("navi_selcheck_selectors") || "null"); } catch (e) {}
        const trying = readSelCheckTryingSet();
        if (!sc || typeof sc !== "object") return {};
        const patch = {};
        if (trying.indexOf("logo") !== -1 && sc.logo) patch.publishTriggerHamburger = sc.logo + "|#777|false|left(D)";
        if (trying.indexOf("hamburger") !== -1 && sc.hamburger) patch.publishTriggerIDClass = sc.hamburger;
        if (!Object.keys(patch).length && sc.hamburger) patch.publishTriggerIDClass = sc.hamburger;
        if (!Object.keys(patch).length) return {};
        patch.displayTrigger = 1;
        return patch;
      }
      if (key === "megad" || key === "megam" || key === "grid") {
        // entry theo embed (slot mượn) ưu tiên trước entry theo kind
        const placement = _lastPlacementOverride && (_lastPlacementOverride[tryMenusEmbedIdFor(key)] || _lastPlacementOverride[TRY_MENUS_KIND_CLASS[key]]);
        if (!placement || !placement.selector) return {};
        /* KHÔNG gửi isPublishToPlace — đó là BIẾN RUNTIME của pipeline vẽ (uigen_func), suy ra từ
           publishToPlaceDisplay == "1" (Menu.Section.checkPublicToPlace, MenuSection.js:61-69), KHÔNG
           phải field trong setting serialize (main.js:701-703). publishToPlaceDisplay = SỐ 1 đúng format
           getCheckboxValueById; publishToPlaceKind = CHUỖI "1"/"2" đúng format radio .val(). */
        const megaPatch = {
          publishToPlaceDisplay: 1,
          publishToPlace: placement.selector,
          publishToPlaceKind: placement.kind || "2",
        };
        // Replace main menu → nền trong suốt (cùng rule với demo)
        if ((placement.kind || "2") === "1") megaPatch.level1BackgroundHide = true;
        return megaPatch;
      }
      return {};
    };
    /* Tên mẫu (nice-to-have, BE không bắt buộc dùng) — tra trong cache menu_templates.json đã fetch
       (Phase 2, _menuTemplatesCache) theo đúng tab_key + embed_id đang chọn; Default không tra. */
    const tryMenusTemplateNameFor = (key) => {
      const embedId = tryMenusEmbedIdFor(key);
      if (embedId === TRY_MENUS_EMBEDS[key]) return "Default";
      const list = _menuTemplatesCache && _menuTemplatesCache[TRY_MENUS_TAB_KEY[key]];
      const found = Array.isArray(list) ? list.find((t) => t.source_embed_id === embedId) : null;
      return (found && found.name) || embedId;
    };

    /* Popup thông báo nhỏ dùng chung cho "hướng dẫn mở từ admin" / "kịch limit + CTA trial" / lỗi/timeout
       — style riêng (KHÔNG tái dùng #navi_demo_edit_overlay vì đó là popup LỚN có gallery, singleton
       riêng biệt — 2 popup có thể cần hiện cùng lúc về mặt logic dù hiếm khi thực tế). */
    const INFO_POPUP_STYLE_ID = "navi_demo_info_style";
    const ensureInfoPopupStyle = () => {
      if (document.getElementById(INFO_POPUP_STYLE_ID)) return;
      const style = document.createElement("style");
      style.id = INFO_POPUP_STYLE_ID;
      style.textContent =
        "#navi_demo_info_overlay{position:fixed;inset:0;z-index:2147483006;background:rgba(0,0,0,0.45);" +
        "display:flex;align-items:center;justify-content:center;font-family:ui-sans-serif,system-ui,-apple-system,Segoe UI,Roboto,Helvetica,Arial;}" +
        "#navi_demo_info_overlay .navi-info-card{width:min(360px,88vw);background:#fff;color:#111827;" +
        "border-radius:14px;padding:20px 22px;box-shadow:0 20px 60px rgba(0,0,0,0.35);text-align:center;}" +
        "#navi_demo_info_overlay .navi-info-text{font-size:13.5px;line-height:1.5;margin-bottom:16px;}" +
        /* Khôi chốt 2026-07-23: icon chuông + chấm đỏ cho popup "Saved!" — SVG inline TỰ CHỨA (trang
           khách KHÔNG có remixicon của admin), chấm đỏ viền trắng đặt góc phải-trên quả chuông. */
        "#navi_demo_info_overlay .navi-info-bell{position:relative;display:inline-block;margin-bottom:10px;}" +
        "#navi_demo_info_overlay .navi-info-bell svg{display:block;}" +
        "#navi_demo_info_overlay .navi-info-bell-dot{position:absolute;top:0;right:-2px;width:13px;height:13px;" +
        "background:#ef4444;border:2.5px solid #fff;border-radius:50%;}" +
        "#navi_demo_info_overlay button{appearance:none;border-radius:8px;padding:10px 14px;font-size:13px;" +
        "font-weight:600;cursor:pointer;width:100%;border:1px solid #111827;background:#111827;color:#fff;margin-bottom:8px;}" +
        "#navi_demo_info_overlay button.navi-info-secondary{background:#fff;color:#111827;margin-bottom:0;}";
      document.head.appendChild(style);
    };
    /* SVG chuông (path chuẩn 24x24, fill đen) + chấm đỏ — dùng cho popup "Saved!" để user hình dung
       đúng thứ phải tìm bên admin (icon chuông có badge đỏ trên trang menu list). */
    const TRY_MENUS_BELL_ICON_HTML =
      "<span class='navi-info-bell'>" +
        "<svg viewBox='0 0 24 24' width='42' height='42' fill='#111827' aria-hidden='true'>" +
          "<path d='M12 22a2.6 2.6 0 0 0 2.55-2.1h-5.1A2.6 2.6 0 0 0 12 22Zm8.1-5.4-1.6-1.8v-4.5a6.5 6.5 0 0 0-5-6.32V3.2a1.5 1.5 0 0 0-3 0v.78a6.5 6.5 0 0 0-5 6.32v4.5l-1.6 1.8a.9.9 0 0 0 .67 1.5h14.86a.9.9 0 0 0 .67-1.5Z'/>" +
        "</svg>" +
        "<span class='navi-info-bell-dot'></span>" +
      "</span>";
    let _infoPopupEl = null;
    const closeTryMenusInfoPopup = () => { if (_infoPopupEl) _infoPopupEl.remove(); _infoPopupEl = null; };
    /* primaryLabel/onPrimary null → chỉ hiện nút "Close" (dùng cho thông báo đơn thuần, không CTA).
       showBellIcon = true → hiện icon chuông + chấm đỏ phía trên text (popup "Saved!" — Khôi chốt
       2026-07-23, text suông không thể hiện rõ phải tìm gì bên admin). */
    const showTryMenusInfoPopup = (text, primaryLabel, onPrimary, showBellIcon) => {
      ensureInfoPopupStyle();
      closeTryMenusInfoPopup();
      const overlay = document.createElement("div");
      overlay.id = "navi_demo_info_overlay";
      overlay.innerHTML =
        "<div class='navi-info-card'>" +
          (showBellIcon ? TRY_MENUS_BELL_ICON_HTML : "") +
          "<div class='navi-info-text'></div>" +
          (primaryLabel ? "<button type='button' data-part='primary'></button>" : "") +
          "<button type='button' class='navi-info-secondary' data-part='close'>Close</button>" +
        "</div>";
      overlay.querySelector(".navi-info-text").textContent = text;
      if (primaryLabel) {
        const btn = overlay.querySelector("[data-part='primary']");
        btn.textContent = primaryLabel;
        btn.addEventListener("click", () => { if (onPrimary) onPrimary(btn); });
      }
      overlay.querySelector("[data-part='close']").addEventListener("click", closeTryMenusInfoPopup);
      overlay.addEventListener("click", (e) => { if (e.target === overlay) closeTryMenusInfoPopup(); });
      document.body.appendChild(overlay);
      _infoPopupEl = overlay;
    };

    /* Popup "reach limit" — CTA push message "start-trial" (tab BE tự điều hướng sang trang Pricing,
       KHÔNG gọi thẳng pay.php — quyết định #5 mục 5 plan) rồi báo "Continue in your Navi+ admin tab…". */
    const showTryMenusLimitPopup = (key, ch, payload) => {
      const plan = (payload && payload.plan) || "Starter";
      showTryMenusInfoPopup(
        "You've reached the limit of your " + plan + " plan. Start a 14-day free trial to add more.",
        "Choose a plan (14-day free trial)",
        (btn) => {
          btn.disabled = true;
          btn.textContent = "Continue in your Navi+ admin tab…";
          tryMenusBridgePush(ch, "start-trial", { kind: key }).catch((e) => {
            _navidebug("TRY_MENUS_BRIDGE", "push start-trial failed", e);
          });
        }
      );
    };

    /* Entry point click "ADD MENU" — wire vào _tryMenusUseThisFn (hook khai báo Phase 1, gần
       _tickPulseMarkers) ở cuối khối này. 5 bước đúng Phase 3B plan: (1) không token → hướng dẫn mở từ
       admin; (2) compose payload; (3) push rồi poll be2fe tối đa 60s (chống double-click bằng disable
       nút); (4) ok/err cập nhật nút/toast; (5) limit → popup + CTA trial. */
    const requestUseThis = async (key, opts) => {
      const cluster = _tryMenusActionClusters.get(key);
      /* opts (tuỳ chọn, panel "Kiểm tra Selector" → nút "Add menu"): btn = nút ngoài cụm demo để
         cập nhật trạng thái; setting_patch = patch tính sẵn từ selector đã dò (không đọc
         _lastPlacementOverride vì lúc đó demo chưa bật); idleLabel = nhãn nút khi trả về trạng thái
         chờ. Không truyền opts → hành vi cũ y nguyên. */
      const useBtn = (opts && opts.btn) || (cluster && cluster.useBtn);
      const idleLabel = (opts && opts.idleLabel) || "ADD MENU";
      if (useBtn && useBtn.disabled) return; // chống double-click trong lúc đang xử lý (relay HOẶC pending)

      const overrides = readTryMenusOverrides();
      const entry = (overrides && overrides[key]) || {};
      const payload = {
        kind: key,
        source_embed_id: tryMenusEmbedIdFor(key),
        template_name: tryMenusTemplateNameFor(key),
        setting_patch: (opts && opts.setting_patch) || buildTryMenusUseThisSettingPatch(key, entry),
      };

      const ch = readTryMenusBridgeChannel();
      if (!ch) {
        /* TASK00519 Phase 5: không có token ghép cặp = demo này KHÔNG được mở từ tab admin (bật tay
           qua panel debug, hoặc tab admin cũ chưa reload nên See Demo chưa gắn navich). TRƯỚC ĐÂY chỉ
           báo hướng dẫn suông — giờ LƯU pending trên R2 (tab admin mở lại sẽ tự hỏi xác nhận, xem 5C
           trong com.theme-demo-engine.php); chỉ rơi về hướng dẫn cũ nếu chính việc lưu pending cũng lỗi. */
        if (useBtn) { useBtn.disabled = true; useBtn.textContent = "Saving…"; }
        try {
          await tryMenusPendingSet(payload);
          if (useBtn) { useBtn.textContent = "✓ Saved — open admin"; }
          showTryMenusInfoPopup("Saved! Go to your Navi+ menu list — look for this bell with a red dot, your menu is waiting there.", null, null, true);
        } catch (e) {
          _navidebug("TRY_MENUS_BRIDGE", "pending-set (no token) failed", e);
          if (useBtn) { useBtn.disabled = false; useBtn.textContent = idleLabel; }
          showTryMenusInfoPopup(
            "This demo isn't connected to your Navi+ admin tab. Open your Navi+ admin, click \"See Demo\" there to relaunch this demo, then press USE THIS again.",
            null, null
          );
        }
        return;
      }
      if (useBtn) { useBtn.disabled = true; useBtn.textContent = "Adding…"; }

      let reqId;
      try {
        reqId = await tryMenusBridgePush(ch, "use-this", payload);
      } catch (e) {
        _navidebug("TRY_MENUS_BRIDGE", "push use-this failed", e);
        if (useBtn) { useBtn.disabled = false; useBtn.textContent = idleLabel; }
        showPanelSnackbar("Could not reach Navi+ — try again.");
        return;
      }

      const pollDeadline = Date.now() + 60000;
      const pollAfter = Math.floor(Date.now() / 1000) - 1;
      const poll = async () => {
        if (Date.now() > pollDeadline) {
          /* TASK00519 Phase 5: hết 60s không thấy reply (tab admin không mở / bận / đã đóng) — LƯU
             pending thay vì chỉ báo timeout suông, cùng cơ chế nhánh không-token phía trên. */
          if (useBtn) { useBtn.disabled = true; useBtn.textContent = "Saving…"; }
          try {
            await tryMenusPendingSet(payload);
            if (useBtn) { useBtn.textContent = "✓ Saved — open admin"; }
            showTryMenusInfoPopup("Your admin tab didn't respond — saved it instead. Go to your Navi+ menu list and look for this bell with a red dot.", null, null, true);
          } catch (e) {
            _navidebug("TRY_MENUS_BRIDGE", "pending-set (timeout) failed", e);
            if (useBtn) { useBtn.disabled = false; useBtn.textContent = idleLabel; }
            showTryMenusInfoPopup("Keep your Navi+ admin tab open and try again.", null, null);
          }
          return;
        }
        let res = null;
        try { res = await tryMenusBridgePull(ch, pollAfter); } catch (e) {}
        const msg = res && res.ok && Array.isArray(res.messages) ? res.messages.find((m) => m.reply_to === reqId) : null;
        if (!msg) { window.setTimeout(poll, 2000); return; }

        if (msg.type === "use-this-ok") {
          if (useBtn) { useBtn.textContent = "✓ Added to your menus"; }
        } else if (msg.type === "use-this-limit") {
          if (useBtn) { useBtn.disabled = false; useBtn.textContent = idleLabel; }
          showTryMenusLimitPopup(key, ch, msg.payload || {});
        } else {
          if (useBtn) { useBtn.disabled = false; useBtn.textContent = idleLabel; }
          showTryMenusInfoPopup((msg.payload && msg.payload.message) || "Something went wrong — try again.", null, null);
        }
      };
      window.setTimeout(poll, 2000);
    };

    // Wire hook cho cụm nút Phase 1 (_tryMenusUseThisFn khai báo gần _tickPulseMarkers, đầu block Phase 1)
    _tryMenusUseThisFn = requestUseThis;

    // Phase 5: Pending action trên R2 (Khôi yêu cầu 2026-07-23). Ca USE THIS KHÔNG
    // ghép cặp được tab BE (demo bật tay / tab admin cũ / poller BE hết hạn 15 phút) trước đây chỉ báo
    // hướng dẫn suông — giờ LƯU request vào R2, tab admin tự hỏi xác nhận khi mở lại (xem
    // TASKS/TASK00519-plan.md Phase 5, gsLpPendingCheck trong com.theme-demo-engine.php).
    /* skey ghép cặp KHÔNG cần token trao trước — CÙNG thuật toán với BE (gsLpPendingSkey(),
       com.theme-demo-engine.php): lowercase, bỏ prefix "www.", thay mọi ký tự ngoài [a-z0-9] thành
       "-". Ưu tiên window.Shopify.shop (khớp $shop Shopify TUYỆT ĐỐI, cả 2 phía đều "xxx.myshopify.com")
       rồi mới tới hostname (Global khớp qua chuẩn hoá www; Wix KHÔNG khớp vì $shop Wix ≠ hostname site —
       limitation đã biết, ghi trong docs/decisions/try-menus-edit-usethis-bridge.md). */
    const tryMenusShopKey = () => {
      const raw = ((window.Shopify && window.Shopify.shop) || window.location.hostname || "").toString().toLowerCase();
      return raw.replace(/^www\./, "").replace(/[^a-z0-9]/g, "-");
    };

    /* Lưu 1 pending action lên relay (debug-bridge/pending/<skey>.json) — best-effort, reject khi
       không tính được skey (site không có domain hợp lệ, cực hiếm). item.host chỉ để BE hiển thị/audit
       (KHÔNG dùng để ghép cặp — ghép cặp bằng "skey" của chính URL request này). */
    const tryMenusPendingSet = (payload) => {
      const skey = tryMenusShopKey();
      if (!skey) return Promise.reject(new Error("no skey"));
      const item = Object.assign({}, payload, { host: window.location.hostname });
      return fetch(DEBUG_BRIDGE_API_URL + "?action=pending-set", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ skey, item }),
      }).then((res) => {
        if (!res.ok) throw new Error("HTTP " + res.status);
        return res.json();
      });
    };

    /* Khôi 2026-09-20: "khi demo thì mega menu để full screen (không fix width)". Runtime cap thanh
       level-1 theo content-width của theme (MenuSection.js publishToPlace: inline max-width !important
       + margin auto; generateCSS_Level1_Width cùng cap) và ruột panel `.fullExpandInner` inline
       max-width (1440/base-width). Demo bỏ cả 2 cap — CHỈ trên embed demo (id cụ thể), không đụng
       menu thật của khách trên cùng trang. Inline !important của runtime chỉ thắng được bằng inline
       khác → poll vài mốc như pinTryMenusMegaBelowHeader (mega vẽ trễ, bake 1 lần, không re-set). */
    /* Khôi 2026-09-20/21: demo Mobile Menu từ spot Hamburger/Logo đã gắn vào trigger THẬT của theme →
       bỏ tab "Open Mobile menu" mép trái (#navi-test-slide-fab) — "nhiều quá". Nút nổi của CHÍNH mẫu
       (naviSlideTriggerBtn_*, góc phải-dưới) GIỮ (Khôi 21/09: "chỉ xoá ở trái thôi" — nó là 1 phần
       của mẫu, khách cần thấy). Chỉ ẩn khi demo đến từ Home (tập trying có hamburger/logo); demo link
       trực tiếp (prospect, không có trigger thật) giữ nguyên. */
    const applyTryMenusSlideNoFloating = () => {
      const set = readSelCheckTryingSet();
      if (set.indexOf("hamburger") === -1 && set.indexOf("logo") === -1) return;
      const styleId = "dm_try_slide_nofloat_style";
      if (document.getElementById(styleId)) return;
      const st = document.createElement("style");
      st.id = styleId;
      st.textContent = "#navi-test-slide-fab { display: none !important; }";
      document.head.appendChild(st);
      cleanupTasks.push(() => st.remove());
    };
    /* Icon Menu (grid) là kind MOBILE: ô lưới chia đều theo bề rộng container → chèn dưới header trên
       desktop 2000px+ thành ô khổng lồ; gói 480px thì lại tí hon (Khôi 2026-09-21 "kinh quá"). Demo desktop:
       cap theo ĐÚNG content-width của theme (cùng số Mega dùng: Finalizer.Desktop.FullExpand.autoMaxWidth,
       ~1200-1440px → ô ~200px như 1 hàng sản phẩm), căn giữa; ≤768px giữ full. Chỉ áp lên embed grid demo. */
    const applyTryMenusGridDemoWidth = () => {
      const id = tryMenusEmbedIdFor("grid");
      const styleId = "dm_try_grid_width_style";
      if (!id || document.getElementById(styleId)) return;
      let maxW = "1200px";
      try { maxW = Finalizer.Desktop.FullExpand.autoMaxWidth() || maxW; } catch (e) {}
      if (maxW === "100%" || maxW === "none") maxW = "1200px";
      const st = document.createElement("style");
      st.id = styleId;
      st.textContent = "@media only screen and (min-width: 769px) { #" + id + " { max-width: " + maxW + " !important; margin-left: auto !important; margin-right: auto !important; } }";
      document.head.appendChild(st);
      cleanupTasks.push(() => st.remove());
    };
    const applyTryMenusMegaFullWidth = () => {
      const ids = ["megad", "megam"].map(tryMenusEmbedIdFor).filter(Boolean);
      const styleId = "dm_try_mega_fullwidth_style";
      if (!document.getElementById(styleId) && ids.length) {
        /* Khung panel full màn, nhưng RUỘT (.fullExpandInner) nằm trong width cơ sở của theme
           (Khôi 2026-09-21) — cùng số Finalizer.Desktop.FullExpand.autoMaxWidth() mà Mega thật dùng ở mode "auto". */
        let baseW = "1440px";
        try { baseW = Finalizer.Desktop.FullExpand.autoMaxWidth() || baseW; } catch (e) {}
        if (baseW === "100%" || baseW === "none") baseW = "1440px";
        const st = document.createElement("style");
        st.id = styleId;
        st.textContent = ids.map((id) => "#" + id + " .fullExpandInner").join(", ") + " { max-width: " + baseW + " !important; margin: 0 auto !important; }";
        document.head.appendChild(st);
        cleanupTasks.push(() => st.remove());
      }
      const tick = () => {
        if (!_tryMenusOn) return;
        ids.forEach((id) => {
          const root = document.getElementById(id);
          if (!root) return;
          const nav = root.querySelector(":scope > ul.navigation, :scope > .scroll-mobile > ul.navigation");
          if (nav) {
            nav.style.setProperty("max-width", "none", "important");
            nav.style.setProperty("width", "100%", "important");
          }
          /* Panel level-2 (ul.children.fullExpand): mẫu có Max width số/per-item → maintainDropdownPosition
             (Finalizer/Desktop.js) đọc dataset.naviConfiguredWidth lúc MỞ panel và dựng khung hẹp bám item.
             Demo = full màn (Khôi 2026-09-21: "live mode thì sub menu phải full width") → ép cấu hình
             width "100%" + bỏ inline width trước khi mở; ruột đã bỏ cap 1440 bằng style ở trên. */
          root.querySelectorAll("ul.children.fullExpand").forEach((panel) => {
            panel.dataset.naviConfiguredWidth = "100%";
            panel.style.width = "100%";
          });
        });
      };
      [400, 900, 1600, 2600, 4000, 6000].forEach((d) => window.setTimeout(tick, d));
    };

    /* Khởi tạo trạng thái panel khi tạo debug UI (mỗi lần load trang) — nếu URL đang đúng trang demo
       (vừa "Turn on demo" xong và reload tới đây), khôi phục summary + chấm đỏ NGAY, không chờ user
       mở lại panel; nếu chưa bật thì chỉ resolve theme cho Step 1 hiển thị đúng trạng thái. */
    const initTryMenusPanelState = async () => {
      if (_tryMenusOn) {
        _lastResolvedTheme = await resolveCurrentThemeSelectors();
        // TASK00501: re-sync moi lan load trang (khong chi lan "Turn on" dau) - phong session cu
        // (truoc fix nay) chua co key, hoac reload lai vao dung link demo truc tiep chua qua renderTryMenusDemo().
        try {
          if (detectTryMenusPlatform() === TRY_MENUS_PLATFORM_WIX) sessionStorage.setItem(TRY_MENUS_PLATFORM_SESSION_KEY, "wix");
          else sessionStorage.removeItem(TRY_MENUS_PLATFORM_SESSION_KEY);
        } catch (e) {}
        /* TASK00501: LUÔN tính lại override tại đây (không chỉ khi sessionStorage rỗng như trước) —
           resolveTryMenusLogoSelector() đánh dấu phần tử logo bằng 1 attribute lên chính DOM đang sống,
           attribute đó KHÔNG sống sót qua điều hướng full-page-reload của renderTryMenusDemo() (viết
           override RỒI MỚI navigate sang trang mới — DOM cũ mất, attribute mất theo). Nếu chỉ tự chữa
           khi rỗng, override cũ (tham chiếu attribute đã mất) vẫn còn trong sessionStorage → tưởng "đã
           có" nên KHÔNG tính lại → chọn nhầm/không tìm thấy logo. Tính lại mỗi lần load trang (rẻ, chỉ
           vài querySelector) đảm bảo luôn khớp đúng DOM hiện tại — an toàn hơn hẳn, không có nhánh nào
           mất tác dụng so với self-heal cũ (bootstrapTryMenusDirectLink vẫn được phủ vì luôn tính). */
        if (_lastResolvedTheme) {
          _lastPlacementOverride = buildTryMenusPlacementOverride(_lastResolvedTheme.selectors);
          try {
            if (_lastPlacementOverride) sessionStorage.setItem(TRY_MENUS_PLACEMENT_SESSION_KEY, JSON.stringify(_lastPlacementOverride));
            else sessionStorage.removeItem(TRY_MENUS_PLACEMENT_SESSION_KEY);
          } catch (e) {}
        } else {
          try {
            _lastPlacementOverride = JSON.parse(sessionStorage.getItem(TRY_MENUS_PLACEMENT_SESSION_KEY) || "null");
          } catch (e) {
            _lastPlacementOverride = null;
          }
        }
        updateTryMenusUI();
        showTryMenusSummary(_lastPlacementOverride);
        attachTryMenusPulseMarkers(_lastPlacementOverride);
        pinTryMenusMegaBelowHeader(_lastPlacementOverride);
        adoptTryMenusHeaderGroupClass(_lastPlacementOverride);
        applyTryMenusMegaFullWidth();
        applyTryMenusGridDemoWidth();
        applyTryMenusSlideNoFloating();
        applyTryMenusResponsiveTweaks();
        applyTryMenusPanelOverlapFix();
        // cụm nút EDIT/USE THIS trên từng menu demo (Phase 1), gọi SAU khi mega đã
        // release-to-flow + panel-overlap-fix wire xong, để _resolveActionTargetEl/_positionActionCluster
        // đọc đúng trạng thái DOM cuối cùng ngay từ frame đầu tiên.
        attachTryMenusActionButtons();
        applyTryMenusHiddenKeysFromCache(); // TASK00610: khôi phục đúng menu đã tắt từ lần trước

      } else {
        await refreshTryMenusThemeStatus();
      }
    };
    initTryMenusPanelState();

    // khôi phục màn "Try Navi+ menus" (level 2) sau reload/Apply nếu đó là màn user
    // đang mở trước khi navigate (xem PANEL_VIEW_SESSION_KEY phía trên). CHỈ khôi phục "try-menus":
    // các feature khác chưa cần (Khôi chỉ báo Try bị rơi về level 1), và "scan" mở là TỰ QUÉT luôn
    // (TASK00516) — auto-khôi phục sẽ tự chạy quét oan mỗi lần reload.
    try {
      // Chỉ khôi phục màn Try Menus khi demo ĐANG bật — Home mới là luồng chính, "Turn off demo"
      // (navigate) phải quay về Home chứ không kẹt ở màn Try Menus rỗng với nút "Turn on demo".
      /* Khôi 2026-09-21: màn "Try Navi+ Menus" cũ KHÔNG còn được mở nữa (Home mới thay hoàn toàn) —
         không khôi phục view này sau reload; demo đang bật hiện trên Home dưới dạng dòng "Demo menu · Stop demo". */
    } catch (e) {}

    /* debug mode BẬT qua hash — nếu cờ localStorage nói demo đang "on" nhưng URL hiện tại KHÔNG mang
       param demo (vd mở lại trang bằng 1 link thường) → tự điều hướng thêm lại param để khôi phục. */
    const restoreTryMenusDemoIfNeeded = async () => {
      if (!isDebugModeEnabled()) return;
      /* TASK00516 (Khôi 2026-07-23): tab mở qua "Lấy menu từ website" (?naviscan=1) là để SCAN menu
         gốc — KHÔNG được khôi phục demo "Try Navi+ menus". Cờ localStorage TRY_MENUS_STORAGE_KEY có thể
         còn "1" từ lần demo trước (chưa Turn off), nếu không chặn thì renderTryMenusDemo() sẽ điều hướng
         tab scan sang URL demo → reload thừa + phá luồng scan (đúng lỗi Khôi báo "đi theo cơ chế demo").
         Chỉ SKIP đúng phiên scan, KHÔNG xoá cờ demo (giữ nguyên trạng thái demo của khách cho lần sau). */
      try { if (new URLSearchParams(window.location.search).get("naviscan") === "1") return; } catch (e) {}
      // Cùng lý do với naviscan: tab "Kiểm tra Selector" (?naviselectorcheck=1) không được bị cờ demo
      // cũ kéo sang URL demo — chỉ vào demo khi khách bấm "Test menu" trên panel.
      try { if (new URLSearchParams(window.location.search).get("naviselectorcheck") === "1") return; } catch (e) {}
      if (isTryMenusDemoActiveNow()) return; // đã đúng trang demo rồi, không cần làm gì
      if (safeLocalStorage.get(TRY_MENUS_STORAGE_KEY) === "1") {
        await renderTryMenusDemo();
      }
    };
    /* debug mode TẮT qua hash — chỉ điều hướng bỏ param demo khỏi URL (site khôi phục nguyên trạng
       ngay khi trang mới load xong), GIỮ NGUYÊN cờ localStorage để tự bật lại khi debug mode bật lại
       (đúng spec gốc: "tự ẩn khi debug mode tắt (giữ cờ), tự khôi phục khi debug mode bật lại"). */
    const tryMenusTeardownForDebugOff = () => {
      navigateAwayFromTryMenusDemo();
    };

    // Shared panel snackbar
    const panelSnackbar = document.createElement("div");
    panelSnackbar.id = "dm_panel_snackbar";
    panelSnackbar.dataset.show = "0";
    document.body.appendChild(panelSnackbar);
    cleanupTasks.push(() => panelSnackbar.remove());

    // TASK00256. Begin — Custom tooltip (position:fixed → không bị clip overflow panel)
    const dmTooltipEl = document.createElement("div");
    dmTooltipEl.id = "dm_tooltip";
    document.body.appendChild(dmTooltipEl);
    cleanupTasks.push(() => dmTooltipEl.remove());
    let _dmTipTimer = 0;
    const showDmTip = (anchor, text) => {
      clearTimeout(_dmTipTimer);
      _dmTipTimer = setTimeout(() => {
        dmTooltipEl.textContent = text;
        dmTooltipEl.setAttribute("data-show", "");
        const r = anchor.getBoundingClientRect();
        let lx = r.left + r.width / 2;
        const ty = r.bottom + 7;
        dmTooltipEl.style.top = ty + "px";
        dmTooltipEl.style.left = lx + "px";
        dmTooltipEl.style.transform = "translateX(-50%)";
        requestAnimationFrame(() => {
          const tr = dmTooltipEl.getBoundingClientRect();
          if (tr.right > window.innerWidth - 6) lx -= (tr.right - window.innerWidth + 8);
          if (tr.left < 6) lx += (6 - tr.left);
          dmTooltipEl.style.left = lx + "px";
        });
      }, 350);
    };
    const hideDmTip = () => {
      clearTimeout(_dmTipTimer);
      dmTooltipEl.removeAttribute("data-show");
    };
    // TASK00256. End

    let panelSnackbarTimer = 0;
    const showPanelSnackbar = (msg) => {
      if (panelSnackbarTimer) window.clearTimeout(panelSnackbarTimer);
      panelSnackbar.textContent = msg;
      panelSnackbar.dataset.show = "1";
      panelSnackbarTimer = window.setTimeout(() => {
        panelSnackbar.dataset.show = "0";
        panelSnackbarTimer = 0;
      }, 3200);
    };

    // TASK00516 — bỏ AI_PROMPT_PREFIX + 2 handler copy prompt (menuCopyOutputBtn/menuCopyPromptBtn,
    // element đã bị xoá khỏi UI phía trên) — feature không còn sinh prompt copy-paste nữa, xem
    // handler menuSendBtn ("GỬI VỀ NAVI+") thêm bên dưới, sau khi parseMenuToStructure/dmGetSelector.

    // Helpers for Find Menu
    const dmCopyToClipboard = async (text) => {
      if (!text) return false;
      try { await navigator.clipboard.writeText(text); return true; } catch {}
      try {
        const ta = document.createElement("textarea");
        ta.value = text;
        ta.setAttribute("readonly", "true");
        ta.style.cssText = "position:fixed;top:-1000px;left:-1000px";
        document.body.appendChild(ta);
        ta.select();
        ta.setSelectionRange(0, ta.value.length);
        const ok = document.execCommand("copy");
        document.body.removeChild(ta);
        return ok;
      } catch { return false; }
    };

    const dmGetSelector = (el) => {
      const cssEsc = typeof CSS !== "undefined" && CSS.escape
        ? (v) => CSS.escape(v)
        : (v) => String(v).replace(/[^a-zA-Z0-9_-]/g, "\\$&");

      const isUniq = (sel, target) => {
        try { const found = document.querySelectorAll(sel); return found.length === 1 && found[0] === target; } catch { return false; }
      };

      const segments = [];
      let cur = el;
      for (let d = 0; d < 7 && cur && cur.nodeType === 1 && cur.tagName !== "HTML"; d++) {
        if (cur.id) {
          const id = "#" + cssEsc(cur.id);
          segments.unshift(id);
          const candidate = segments.join(" > ");
          if (isUniq(candidate, el)) return candidate;
          break;
        }
        let part = cur.tagName.toLowerCase();
        const cls = Array.from(cur.classList).slice(0, 2).map(c => "." + cssEsc(c)).join("");
        part += cls;
        segments.unshift(part);
        const candidate = segments.join(" > ");
        if (isUniq(candidate, el)) return candidate;
        cur = cur.parentElement;
      }
      return segments.join(" > ") || el.tagName.toLowerCase();
    };

    // Basic structural check: ul/ol with li children, majority have <a>
    const isBasicMenuList = (el) => {
      // loại trừ list DO CHÍNH Navi+ tạo ra, để scanner chỉ bắt menu GỐC của theme.
      // Navi+ render menu bằng <ul class="navigation"> chứa item <li class="naviItem">, đặt trong
      // wrapper .naviman_app/#naviman_app/.naviItem_Container/.navi-critical, và gốc menu luôn có id
      // trùng 1 embed_id trong registry global window._processedEmbedIds (start.js set). Không loại các
      // dấu hiệu này thì quét "ul,ol" sẽ bắt luôn menu Navi+ đang publish — kể cả ở chế độ "replace",
      // vì DOM menu gốc của theme vẫn còn trong trang (chỉ bị Navi+ ẩn đi, không xoá), nên loại trừ
      // Navi+ ra vẫn còn menu gốc để quét được.
      if (el.classList.contains("navigation")) return false;
      if (el.closest('.naviman_app, #naviman_app, .naviItem_Container, .navi-critical, [class*="naviman_app"]')) return false;
      if (el.querySelector(".naviItem")) return false;
      for (let a = el; a; a = a.parentElement) {
        if (a.id && window._processedEmbedIds && window._processedEmbedIds[a.id]) return false;
      }
      if (el.tagName !== "UL" && el.tagName !== "OL") return false;
      if (el.closest("#" + inspectorOverlayId) || el.closest("#" + modalId)) return false;
      const items = Array.from(el.children).filter(c => c.tagName === "LI");
      if (items.length < 2) return false;
      const withLinks = items.filter(li => li.querySelector("a"));
      return withLinks.length >= Math.ceil(items.length * 0.5);
    };

    // Returns a reason string if the list should be excluded, null if it passes
    const getMenuExcludeReason = (el) => {
      const items = Array.from(el.children).filter(c => c.tagName === "LI");
      const anchors = items.map(li => li.querySelector("a")).filter(Boolean);

      // Reject if most hrefs are trivial (# or javascript:)
      const trivialCount = anchors.filter(a => {
        const href = (a.getAttribute("href") || "").trim();
        return href === "" || href === "#" || /^javascript:/i.test(href);
      }).length;
      if (trivialCount / anchors.length > 0.7) return "hash-only links";

      // Reject if ancestor element hints at utility picker (country / language / currency)
      const utilityRx = /\b(country|countr|language|lang[-_]|locale|currency|currenc|money|flag|region|timezone|continent)\b/i;
      let ancestor = el.parentElement;
      for (let i = 0; i < 5 && ancestor && ancestor.tagName !== "BODY"; i++) {
        const hint = (ancestor.className || "") + " " + (ancestor.id || "") +
                     " " + (ancestor.getAttribute("aria-label") || "");
        if (utilityRx.test(hint)) return "country/language/currency picker";
        ancestor = ancestor.parentElement;
      }

      // Reject if most item texts look like currency options
      const itemTexts = items.map(li => li.textContent.trim());
      const currencyRx = /^[\$€£¥₩₹฿₫₺₴₦₱]|^(USD|EUR|GBP|JPY|CNY|KRW|VND|AUD|CAD|CHF|HKD|SGD|THB|MXN|BRL|RUB)\b/i;
      const currencyCount = itemTexts.filter(t => currencyRx.test(t)).length;
      if (currencyCount / items.length > 0.5) return "currency list";

      // Reject if texts are all 2-char country/region codes or all look like country names
      // Heuristic: all items ≤ 3 words AND very short average text (< 12 chars) suggests codes/countries
      const avgLen = itemTexts.reduce((s, t) => s + t.length, 0) / itemTexts.length;
      const allShortWords = itemTexts.every(t => t.split(/\s+/).length <= 3);
      if (avgLen < 10 && allShortWords && items.length >= 5) {
        // Extra check: do links differ? If all go to same domain but different paths it may still be valid
        const uniqueHrefs = new Set(anchors.map(a => a.getAttribute("href") || ""));
        if (uniqueHrefs.size <= 2) return "duplicate or trivial links";
      }

      return null;
    };

    const isMenuList = (el) => {
      if (!isBasicMenuList(el)) return false;
      return getMenuExcludeReason(el) === null;
    };

    // Parse a menu element into the output text format
    const parseMenuToOutput = (listEl, depth) => {
      const lines = [];
      const items = Array.from(listEl.children).filter(c => c.tagName === "LI");
      for (const li of items) {
        /* Tìm label element: ưu tiên <summary data-follow-link> hoặc <a> không nằm trong sub-list.
           li.querySelector("a") trả về <a> đầu tiên bất kỳ (kể cả trong sub-list) — sai với
           details/summary menus vì <a> đầu tiên là item con cấp 2, không phải <summary> cha. */
        const _notInSubList = (el) => {
          let cur = el.parentElement;
          while (cur && cur !== li) {
            if (cur.tagName === "UL" || cur.tagName === "OL") return false;
            cur = cur.parentElement;
          }
          return true;
        };
        let labelEl = null, isSummary = false;
        for (const s of li.querySelectorAll("summary[data-follow-link]")) {
          if (_notInSubList(s)) { labelEl = s; isSummary = true; break; }
        }
        if (!labelEl) {
          for (const a of li.querySelectorAll("a")) {
            if (_notInSubList(a)) { labelEl = a; break; }
          }
        }
        if (!labelEl) labelEl = li.querySelector("a");
        if (!labelEl) continue;

        let name, url, desc = "";
        if (isSummary) {
          name = (labelEl.getAttribute("data-title") || labelEl.textContent).trim().replace(/\s+/g, " ");
          url  = labelEl.getAttribute("data-follow-link") || "";
        } else {
          name = labelEl.textContent.trim().replace(/\s+/g, " ");
          const rawTitle = (labelEl.getAttribute("title") || labelEl.getAttribute("aria-label") || "").trim();
          desc = rawTitle && rawTitle.toLowerCase() !== name.toLowerCase() ? rawTitle : "";
          url  = labelEl.getAttribute("href") || "";
        }
        const label = name + (desc ? " (" + desc + ")" : "") + ", " + url;
        if (depth === 0) {
          lines.push(label);
        } else {
          // 2 spaces base + (depth-1)*4 additional spaces, then "- "
          const indent = " ".repeat(2 + (depth - 1) * 4);
          lines.push(indent + "- " + label);
        }
        // Recurse into nested ul/ol inside this li
        const subList = li.querySelector("ul, ol");
        if (subList) {
          lines.push(...parseMenuToOutput(subList, depth + 1));
        }
      }
      return lines;
    };

    // parseMenuToStructure: song song với parseMenuToOutput ở trên, nhưng trả
    // MẢNG {name,url,desc,depth} thay vì text — dùng để build payload gửi về Navi+ (BE cần dữ liệu
    // có cấu trúc, không phải text để hiển thị). Copy y nguyên logic tìm labelEl/_notInSubList của
    // parseMenuToOutput (không sửa hàm gốc — giữ nguyên cho phần hiển thị "Structure" khi View).
    const parseMenuToStructure = (listEl, depth) => {
      const out = [];
      const items = Array.from(listEl.children).filter(c => c.tagName === "LI");
      for (const li of items) {
        const _notInSubList = (el) => {
          let cur = el.parentElement;
          while (cur && cur !== li) {
            if (cur.tagName === "UL" || cur.tagName === "OL") return false;
            cur = cur.parentElement;
          }
          return true;
        };
        let labelEl = null, isSummary = false;
        for (const s of li.querySelectorAll("summary[data-follow-link]")) {
          if (_notInSubList(s)) { labelEl = s; isSummary = true; break; }
        }
        if (!labelEl) {
          for (const a of li.querySelectorAll("a")) {
            if (_notInSubList(a)) { labelEl = a; break; }
          }
        }
        if (!labelEl) labelEl = li.querySelector("a");
        if (!labelEl) continue;

        let name, url, desc = "";
        if (isSummary) {
          name = (labelEl.getAttribute("data-title") || labelEl.textContent).trim().replace(/\s+/g, " ");
          url  = labelEl.getAttribute("data-follow-link") || "";
        } else {
          name = labelEl.textContent.trim().replace(/\s+/g, " ");
          const rawTitle = (labelEl.getAttribute("title") || labelEl.getAttribute("aria-label") || "").trim();
          desc = rawTitle && rawTitle.toLowerCase() !== name.toLowerCase() ? rawTitle : "";
          url  = labelEl.getAttribute("href") || "";
        }
        out.push({ name, url, desc, depth });

        const subList = li.querySelector("ul, ol");
        if (subList) {
          out.push(...parseMenuToStructure(subList, depth + 1));
        }
      }
      return out;
    };

    let activeRow = null;
    // TASK00516 — checkbox (dm-tree-checkbox) → {menuEl, selector, name}, dùng để multi-select
    // menu khi bấm "Send to Navi+"; clear lại mỗi lần renderMenuTree vẽ lại cây (rescan)
    const menuCheckboxMap = new Map();

    // TASK00516 — bật/tắt nút "Send to Navi+" theo có menu nào đang được tick không (Khôi: disable
    // đến khi chọn ≥1 menu). Gọi khi tick/bỏ tick + sau mỗi lần renderMenuTree (rescan → về disabled).
    const updateSendBtnState = () => {
      let anyChecked = false;
      menuCheckboxMap.forEach((info, cb) => { if (cb.checked) anyChecked = true; });
      menuSendBtn.disabled = !anyChecked;
    };

    /* TASK00516 (vòng 3) — render structure dạng TREE HTML nhiều cấp (thay <textarea> text). Mỗi item
       1 dòng, thụt lề theo depth (padding-left), tên + link tự xuống dòng (overflow-wrap:anywhere) →
       KHÔNG scroll ngang. Dùng parseMenuToStructure (mảng phẳng {name,url,desc,depth}, đệ quy đủ mọi
       cấp). textContent để tự escape tên/link lấy từ site khách. */
    const showMenuOutput = (menuEl) => {
      const items = parseMenuToStructure(menuEl, 0);
      menuOutputTree.innerHTML = "";
      if (!items.length) {
        const empty = document.createElement("div");
        empty.className = "dm-struct-empty";
        empty.textContent = "No items";
        menuOutputTree.appendChild(empty);
      } else {
        for (const it of items) {
          const row = document.createElement("div");
          row.className = "dm-struct-item";
          row.style.paddingLeft = (10 + (it.depth || 0) * 16) + "px";
          const nameEl = document.createElement("span");
          nameEl.className = "dm-struct-name";
          nameEl.textContent = it.name || "—";
          row.appendChild(nameEl);
          if (it.url) {
            const urlEl = document.createElement("span");
            urlEl.className = "dm-struct-url";
            urlEl.textContent = it.url;
            row.appendChild(urlEl);
          }
          menuOutputTree.appendChild(row);
        }
      }
      menuOutputWrap.dataset.show = "1"; // TASK00525 — hiện qua CSS data-show (thay inline display)
    };

    // renderMenuTree giờ CHỈ vẽ menu ROOT (level-1), phẳng — bỏ hẳn toggle/
    // .dm-tree-children đệ quy cây lồng nhiều cấp cũ (nguồn gây "quét ra hàng loạt menu ở nhiều cấp"
    // rối mắt user phản ánh). Menu con lồng bên trong (level 2, 3, ...) KHÔNG còn hiện thành dòng
    // riêng — chúng vẫn được thu thập ĐẦY ĐỦ khi bấm 1 dòng root, vì parseMenuToStructure/
    // parseMenuToOutput vốn đã đệ quy hết mọi ul/ol lồng bên trong không giới hạn độ sâu (không đụng
    // 2 hàm đó). Giữ lại tham số childrenMap trong signature để chỗ gọi cũ (window.setTimeout trong
    // menuScanBtn handler) không phải sửa theo, nhưng không dùng nữa. Đếm item hiển thị đổi sang TỔNG
    // số item mọi cấp lồng nhau (qua parseMenuToStructure) thay vì chỉ đếm <li> trực tiếp cấp 1, để
    // user thấy đúng quy mô thật của cả menu trước khi chọn gửi.
    const renderMenuTree = (roots, childrenMap, excluded = []) => {
      menuResultsDiv.innerHTML = "";
      delete menuOutputWrap.dataset.show; // TASK00525 — ẩn qua CSS data-show (thay inline display)
      menuOutputTree.innerHTML = ""; // TASK00516 (vòng 3) — clear tree preview (thay textarea.value)
      activeRow = null;
      menuCheckboxMap.clear(); // TASK00516 — rescan → bỏ hết lựa chọn cũ (element DOM cũ không còn hợp lệ)
      menuSendStatus.textContent = ""; // TASK00516 — rescan → xoá trạng thái gửi lần trước
      menuSendStatus.removeAttribute("data-state");

      if (roots.length === 0) {
        const empty = document.createElement("div");
        empty.setAttribute("data-part", "find-menu-empty");
        empty.textContent = "No menu structures found on this page.";
        menuResultsDiv.appendChild(empty);
        return;
      }

      const renderNode = (menu) => {
        const totalItemCount = parseMenuToStructure(menu, 0).length; // tổng item mọi cấp lồng nhau
        const selector = dmGetSelector(menu);

        const nodeEl = document.createElement("div");
        nodeEl.className = "dm-tree-node";

        const row = document.createElement("div");
        row.className = "dm-tree-row";

        // checkbox multi-select menu để gửi về Navi+ (độc lập với click-để-xem structure bên dưới) —
        // stopPropagation để tick không kích hoạt showMenuOutput ngoài ý muốn
        const checkbox = document.createElement("input");
        checkbox.type = "checkbox";
        checkbox.className = "dm-tree-checkbox";
        checkbox.addEventListener("click", (e) => e.stopPropagation());
        checkbox.addEventListener("change", updateSendBtnState); // TASK00516 — tick/bỏ tick → bật/tắt nút Send
        const menuName = (menu.getAttribute("aria-label") || menu.id || selector).trim();
        menuCheckboxMap.set(checkbox, { menuEl: menu, selector, name: menuName });
        row.appendChild(checkbox);

        const selectorSpan = document.createElement("span");
        selectorSpan.className = "dm-tree-selector";
        selectorSpan.title = selector;
        selectorSpan.textContent = selector;
        row.appendChild(selectorSpan);

        const countSpan = document.createElement("span");
        countSpan.className = "dm-tree-count";
        countSpan.textContent = totalItemCount + " items";
        row.appendChild(countSpan);

        const viewBadge = document.createElement("span");
        viewBadge.className = "dm-tree-view-badge";
        viewBadge.innerHTML = ri("eye-line", "View");
        row.appendChild(viewBadge);

        row.addEventListener("click", () => {
          if (activeRow) {
            activeRow.classList.remove("dm-active");
            const prev = activeRow.querySelector(".dm-tree-view-badge");
            if (prev) prev.innerHTML = ri("eye-line", "View");
          }
          row.classList.add("dm-active");
          viewBadge.innerHTML = ri("check-line", "Selected");
          activeRow = row;
          showMenuOutput(menu);
        });

        nodeEl.appendChild(row);
        return nodeEl;
      };

      for (const root of roots) {
        menuResultsDiv.appendChild(renderNode(root));
      }

      updateSendBtnState(); // TASK00516 — rescan xong: chưa tick gì → nút Send về disabled
    };

    // runScan: tự quét menu khi MỞ feature "scan" (không còn nút Scan/
    // Re-scan). Hiện "Scanning..." trong vùng kết quả rồi vẽ danh sách. Nếu lần quét đầu ra 0 menu
    // (một số theme dựng nav bằng JS SAU khi trang load) → tự thử lại 1 lần sau 1200ms; cờ isRetry
    // chặn lặp vô hạn khi trang thật sự không có menu nào.
    const runScan = (isRetry) => {
      menuResultsDiv.innerHTML = "";
      const scanning = document.createElement("div");
      scanning.setAttribute("data-part", "find-menu-empty");
      scanning.innerHTML = ri("loader-4-line dm-spin", "Scanning...");
      menuResultsDiv.appendChild(scanning);
      window.setTimeout(() => {
        const allLists = Array.from(document.querySelectorAll("ul, ol"));

        // Separate candidates into accepted and rejected
        const basicCandidates = allLists.filter(isBasicMenuList);
        const excluded = [];
        const menuLists = basicCandidates.filter(el => {
          const reason = getMenuExcludeReason(el);
          if (reason) { excluded.push({ el, reason }); return false; }
          return true;
        });

        const menuSet = new Set(menuLists);
        const childrenMap = new Map();
        const roots = [];

        for (const m of menuLists) childrenMap.set(m, []);

        for (const m of menuLists) {
          let node = m.parentElement;
          let parentMenu = null;
          while (node) {
            if (menuSet.has(node)) { parentMenu = node; break; }
            node = node.parentElement;
          }
          if (parentMenu) childrenMap.get(parentMenu).push(m);
          else roots.push(m);
        }

        renderMenuTree(roots, childrenMap, excluded);
        if (roots.length === 0 && !isRetry) window.setTimeout(() => runScan(true), 1200);
      }, 40);
    };

    // "GỬI VỀ NAVI+": POST các menu đã tick lên microservice mới
    // naviplus/microservices/menu-scan/api.php (KHÔNG còn sinh prompt copy-paste).
    // Host: cùng quy ước branch dev/prod theo _NAVIPLUS_VERSION đã dùng cho cdnUigenJS/cdnUigenCSS
    // (start.js.php) — script này chạy TRÊN DOMAIN KHÁCH nên phải trỏ đúng backend PHP (không phải
    // static CDN cdn.naviplus.app dùng cho theme-selectors.json), xem docs/decisions/environments-and-config.md.
    const MENU_SCAN_API_URL = (_NAVIPLUS_VERSION !== "DEV")
      ? "https://dash.naviplus.app/naviplus/microservices/menu-scan/api.php"
      : "https://dev-shopify.naviplus.app/naviplus/microservices/menu-scan/api.php";

    // TASK00525: sheet "Sent to Navi+" sau khi gửi thành công (thay dòng status "Sent N
    // menu(s)" chữ nhỏ dễ trôi): KHÔNG dùng dialog giữa màn hình — sheet trượt lên trong panel,
    // cùng cơ chế/CSS mobile-sheet với footer "Test website on mobile" (data-open trên element).
    const menuSentSheetOverlay = document.createElement("div");
    menuSentSheetOverlay.setAttribute("data-part", "mobile-sheet-overlay");
    const menuSentSheet = document.createElement("div");
    menuSentSheet.setAttribute("data-part", "mobile-sheet");
    menuSentSheet.innerHTML =
      `<div data-part="mobile-sheet-head">` +
        `<span data-part="mobile-sheet-title"></span>` +
        `<button type="button" data-part="mobile-sheet-close" aria-label="Close">×</button>` +
      `</div>` +
      `<div data-part="mobile-sheet-body">` +
        "<p style='margin:0 0 8px'>Open the Navi+ app to receive them.</p>" +
        "<p style='margin:0 0 8px'>To use: click <b>+ Insert menu</b> on the menu tree, then choose the <b>&quot;Source: Old menu&quot;</b> tab.</p>" +
        "<img src='https://cdn.naviplus.app/naviplus/images/help/how-to-insert-menu.webp' alt='How to insert menu' style='width:100%;border:1px solid rgba(17,24,39,0.12);border-radius:8px;display:block'>" +
      `</div>`;
    const menuSentTitleEl = menuSentSheet.querySelector("[data-part='mobile-sheet-title']");
    const closeMenuSentPopup = () => {
      delete menuSentSheetOverlay.dataset.open;
      delete menuSentSheet.dataset.open;
    };
    const openMenuSentPopup = (count) => {
      menuSentTitleEl.textContent = "Sent " + count + " menu(s) to Navi+ 🎉";
      menuSentSheetOverlay.dataset.open = "1";
      menuSentSheet.dataset.open = "1";
    };
    menuSentSheetOverlay.addEventListener("click", closeMenuSentPopup);
    menuSentSheet.querySelector("[data-part='mobile-sheet-close']").addEventListener("click", closeMenuSentPopup);
    modal.appendChild(menuSentSheetOverlay);
    modal.appendChild(menuSentSheet);

    menuSendBtn.addEventListener("click", async () => {
      const selected = Array.from(menuCheckboxMap.entries()).filter(([cb]) => cb.checked);
      if (selected.length === 0) {
        menuSendStatus.textContent = "Select at least one menu";
        menuSendStatus.dataset.state = "warn";
        return;
      }

      const menus = selected.map(([, info]) => ({
        name: info.name,
        selector: info.selector,
        items: parseMenuToStructure(info.menuEl, 0),
      }));

      /* embed_id: window._processedEmbedIds là registry global do naviplus.start.js set không điều
         kiện (window._processedEmbedIds = window._processedEmbedIds || {}) mỗi khi 1 embed Navi+
         được xử lý trên trang — lấy toàn bộ key = mọi embed_id đang render trên trang này. */
      const embedIds = Object.keys(window._processedEmbedIds || {});
      // token: do Part C (launcher "Lấy menu từ website") nhét vào URL storefront lúc mở tab mới
      const token = new URLSearchParams(window.location.search).get("scantoken") || null;
      const payload = {
        domain: window.location.hostname,
        embedIds,
        token,
        menus,
      };

      const originalHtml = menuSendBtn.innerHTML;
      menuSendBtn.disabled = true;
      menuSendBtn.innerHTML = ri("loader-4-line dm-spin", "Sending...");
      menuSendStatus.textContent = "";
      menuSendStatus.removeAttribute("data-state");

      try {
        const res = await fetch(MENU_SCAN_API_URL, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
        if (!res.ok) throw new Error("HTTP " + res.status);
        openMenuSentPopup(menus.length); // TASK00525: popup hướng dẫn nhận/dùng menu thay dòng status nhỏ
        _navidebug("MENU_SCAN", "Sent " + menus.length + " menu(s) to Navi+", payload);
      } catch (err) {
        menuSendStatus.textContent = "Send failed, please try again";
        menuSendStatus.dataset.state = "error";
        _navidebug("MENU_SCAN", "Send failed", err);
      } finally {
        menuSendBtn.disabled = false;
        menuSendBtn.innerHTML = originalHtml;
      }
    });

    modal.appendChild(header);
    modal.appendChild(body);

    // TASK00525: footer sẫm "Test website on mobile" pin đáy panel (con trực tiếp của modal,
    // sau body flex:1 → tự dính đáy, hiện xuyên suốt home/detail) + bottom-sheet trượt lên chứa guide
    // dùng chung renderTestOnMobileGuide(). Toggle qua data-open trên overlay/sheet → CSS transition (TASK00525).
    const mobileFooterBar = document.createElement("button");
    mobileFooterBar.type = "button";
    mobileFooterBar.setAttribute("data-part", "mobile-footer-bar");
    mobileFooterBar.innerHTML = `<i class="ri-smartphone-line" style="font-size:15px"></i>Test website on mobile`;
    const mobileSheetOverlay = document.createElement("div");
    mobileSheetOverlay.setAttribute("data-part", "mobile-sheet-overlay");
    const mobileSheet = document.createElement("div");
    mobileSheet.setAttribute("data-part", "mobile-sheet");
    mobileSheet.innerHTML =
      `<div data-part="mobile-sheet-head">` +
        `<span data-part="mobile-sheet-title">Test website on mobile</span>` +
        `<button type="button" data-part="mobile-sheet-close" aria-label="Close">×</button>` +
      `</div>` +
      `<div data-part="mobile-sheet-body"></div>`;
    const mobileSheetBody = mobileSheet.querySelector("[data-part='mobile-sheet-body']");
    // TASK00525: trạng thái mở đặt trên CHÍNH overlay/sheet (data-open) thay vì modal — nhiều sheet
    // (guide mobile + Sent to Navi+) đóng/mở độc lập, xem CSS tương ứng
    const openMobileSheet = () => {
      renderTestOnMobileGuide(mobileSheetBody, false); // render mỗi lần mở — QR/link luôn theo URL hiện tại
      mobileSheetOverlay.dataset.open = "1";
      mobileSheet.dataset.open = "1";
    };
    const closeMobileSheet = () => {
      delete mobileSheetOverlay.dataset.open;
      delete mobileSheet.dataset.open;
    };
    mobileFooterBar.addEventListener("click", openMobileSheet);
    mobileSheetOverlay.addEventListener("click", closeMobileSheet);
    mobileSheet.querySelector("[data-part='mobile-sheet-close']").addEventListener("click", closeMobileSheet);
    modal.appendChild(mobileFooterBar);
    modal.appendChild(mobileSheetOverlay);
    modal.appendChild(mobileSheet);

    const resizer = document.createElement("div");
    resizer.setAttribute("data-part", "resizer");
    modal.appendChild(resizer);

    const PANEL_W_KEY = "_naviplus_debug_panel_w";
    const PANEL_MIN_W = 300;
    const PANEL_MAX_W = 520;
    const applyPanelWidth = (w) => {
      const maxW = Math.max(PANEL_MIN_W, Math.min(PANEL_MAX_W, window.innerWidth - 320));
      const cw = Math.max(PANEL_MIN_W, Math.min(maxW, Math.round(w)));
      document.documentElement.style.setProperty("--dm-panel-w", cw + "px");
      return cw;
    };
    let customWidth = parseInt(safeSessionStorage.get(PANEL_W_KEY) || "", 10) || 300;
    applyPanelWidth(customWidth);

    const onWinResize = () => applyPanelWidth(customWidth);
    window.addEventListener("resize", onWinResize);
    let resizing = false;
    const onResizerMove = (e) => {
      if (!resizing) return;
      customWidth = applyPanelWidth(window.innerWidth - e.clientX);
    };
    const onResizerUp = () => {
      if (!resizing) return;
      resizing = false;
      document.body.style.userSelect = "";
      safeSessionStorage.set(PANEL_W_KEY, String(customWidth));
      window.removeEventListener("pointermove", onResizerMove);
      window.removeEventListener("pointerup", onResizerUp);
    };
    resizer.addEventListener("pointerdown", (e) => {
      e.preventDefault();
      resizing = true;
      document.body.style.userSelect = "none";
      window.addEventListener("pointermove", onResizerMove);
      window.addEventListener("pointerup", onResizerUp);
    });
    cleanupTasks.push(() => {
      window.removeEventListener("pointermove", onResizerMove);
      window.removeEventListener("pointerup", onResizerUp);
      window.removeEventListener("resize", onWinResize);
      document.documentElement.style.removeProperty("--dm-panel-w");
    });

    document.body.appendChild(modal);
    cleanupTasks.push(() => modal.remove());

    // TASK00256. Begin — nhớ trạng thái mở/đóng để refresh giữ nguyên
    const PANEL_OPEN_KEY = "_naviplus_debug_panel_open";
    // TASK00256. End
    const closeModal = () => {
      backdrop.dataset.open = "0";
      modal.dataset.open = "0";
      safeSessionStorage.set(welcomeDismissedStorageKey, "1");
      // TASK00256. Begin
      safeSessionStorage.set(PANEL_OPEN_KEY, "0");
      // TASK00256. End
    };

    const openModal = (force = false) => {
      if (!force && safeSessionStorage.get(welcomeDismissedStorageKey) === "1") return;
      backdrop.dataset.open = "1";
      modal.dataset.open = "1";
      // TASK00256. Begin
      safeSessionStorage.set(PANEL_OPEN_KEY, "1");
      // TASK00256. End
    };

    const forceHomeAndOpen = () => {
      clearPanelView(); // TASK00519 — ép về home = bỏ luôn màn đã nhớ (đồng bộ với nút back)
      openModal(true);
      detailPanel.style.display = "none";
      homePanel.style.display = "flex";
      modal.dataset.view = "home"; // thiếu dòng này header vẫn hiện "< <feature>" của màn cũ dù body đã là Home
      delete modal.dataset.feature; // TASK00525
    };

    const showNavicheckBanner = (lines, ok) => {
      const intro =
        "Check optimization for UX and speed on CSS Selector menus. Here are the review results.";
      const linesHtml = lines.map((l) => {
        const txt = String(l || "");
        const esc = txt.replace(/&/g, "&amp;").replace(/</g, "&lt;");
        if (/^✓/.test(txt.trim())) return `<div style="color:#166534;font-weight:500">${esc}</div>`;
        if (/^✗|^⚠/.test(txt.trim())) return `<div style="color:#b91c1c;font-weight:500">${esc}</div>`;
        return `<div>${esc}</div>`;
      }).join("");
      navicheckBanner.innerHTML =
        `<div style="font-weight:500;margin-bottom:6px">${intro}</div>` +
        linesHtml +
        `<div style="margin-top:8px"><button type="button" data-part="navicheck-dismiss" style="height:28px;padding:0 10px;border:1px solid rgba(17,24,39,0.2);border-radius:7px;background:#fff;color:#111827;font-size:12px;font-weight:500;cursor:pointer">I understand</button></div>`;
      const dismissBtn = navicheckBanner.querySelector("[data-part='navicheck-dismiss']");
      if (dismissBtn) {
        dismissBtn.addEventListener("click", () => {
          navicheckBanner.style.display = "none";
          navicheckBanner.innerHTML = "";
        });
      }
      navicheckBanner.style.display = "block";
    };

    button.addEventListener("click", () => openModal(true));
    collapseBtn.addEventListener("click", closeModal);
    backdrop.addEventListener("click", closeModal);

    // Floating mode: state (localStorage), dropdown "..." (Minimize/Floating/Pin to right), kéo-thả qua header — TASK00485
    /* Width floating = đúng width panel pin-right hiện tại (customWidth, biến --dm-panel-w resizer đã set ở trên) — không hardcode riêng */
    const FLOATING_H = 640; // TASK00525: khớp height CSS floating 640px (dùng clamp vị trí kéo-thả)
    const clampFloatingPos = (x, y) => {
      const maxX = Math.max(10, window.innerWidth - customWidth - 10);
      const maxY = Math.max(10, window.innerHeight - FLOATING_H - 10);
      return { x: Math.min(Math.max(10, x), maxX), y: Math.min(Math.max(10, y), maxY) };
    };
    const applyFloatingPos = (x, y) => {
      const c = clampFloatingPos(x, y);
      document.documentElement.style.setProperty("--dm-panel-x", c.x + "px");
      document.documentElement.style.setProperty("--dm-panel-y", c.y + "px");
      return c;
    };
    let currentFloatingPos = (() => {
      try {
        const raw = safeLocalStorage.get(FLOATING_POS_KEY);
        const parsed = raw ? JSON.parse(raw) : null;
        if (parsed && typeof parsed.x === "number" && typeof parsed.y === "number") return parsed;
      } catch {}
      // TASK00485 — Khôi: "sao floating không sát góc phải" — default trước để hở 40px, đổi khớp đúng margin 10px clampFloatingPos đang dùng
      return { x: Math.max(10, window.innerWidth - customWidth - 10), y: 80 };
    })();
    /* Set CSS var ngay dù chưa bật floating — bật lên (từ dropdown hoặc lần tải sau) là đúng vị trí luôn, không nháy */
    applyFloatingPos(currentFloatingPos.x, currentFloatingPos.y);

    const updateViewmodeMenuActiveState = () => {
      const floating = modal.dataset.floating === "1";
      viewmodeRowFloating.querySelector('[data-part="check"]').style.display = floating ? "inline" : "none";
      viewmodeRowPinRight.querySelector('[data-part="check"]').style.display = floating ? "none" : "inline";
    };
    const closeViewmodeMenu = () => { viewmodeMenu.dataset.open = "0"; };
    const openViewmodeMenu = () => {
      updateViewmodeMenuActiveState();
      viewmodeMenu.dataset.open = "1";
    };
    viewmodeBtn.addEventListener("click", (e) => {
      e.stopPropagation();
      if (viewmodeMenu.dataset.open === "1") closeViewmodeMenu();
      else openViewmodeMenu();
    });
    const onDocumentClickCloseViewmodeMenu = (e) => {
      if (viewmodeMenu.dataset.open !== "1") return;
      if (e.target.closest('[data-part="viewmode-wrap"]')) return;
      closeViewmodeMenu();
    };
    document.addEventListener("click", onDocumentClickCloseViewmodeMenu);
    cleanupTasks.push(() => document.removeEventListener("click", onDocumentClickCloseViewmodeMenu));

    const setFloatingMode = (on) => {
      modal.dataset.floating = on ? "1" : "0";
      safeLocalStorage.set(FLOATING_MODE_KEY, on ? "1" : "0");
      if (on) currentFloatingPos = applyFloatingPos(currentFloatingPos.x, currentFloatingPos.y);
      updateViewmodeMenuActiveState();
    };
    viewmodeRowMinimize.addEventListener("click", (e) => { e.stopPropagation(); closeViewmodeMenu(); closeModal(); });
    viewmodeRowFloating.addEventListener("click", (e) => { e.stopPropagation(); setFloatingMode(true); closeViewmodeMenu(); });
    viewmodeRowPinRight.addEventListener("click", (e) => { e.stopPropagation(); setFloatingMode(false); closeViewmodeMenu(); });
    viewmodeRowTurnOff.addEventListener("click", (e) => { e.stopPropagation(); closeViewmodeMenu(); openTurnOffConfirm(); });
    /* Mở Navi+ Finder và BẬT inspector ngay (không bắt bấm thêm "Turn on") — dùng cho menu "…" lẫn deep-link navipick=custom */
    const openFinder = () => {
      openModal(true);
      openFeature("css");
      setInspectorEnabled(true);
      syncInspectorWithDebugMode();
      updateCardState();
    };
    viewmodeRowFinder.addEventListener("click", (e) => { e.stopPropagation(); closeViewmodeMenu(); openFinder(); });

    /* Kéo-thả panel qua header khi đang floating — cùng pattern pointerdown/pointermove/pointerup với resizer ở trên */
    let dragging = false;
    let dragStartPointer = { x: 0, y: 0 };
    let dragStartPos = { x: 0, y: 0 };
    const onHeaderPointerMove = (e) => {
      if (!dragging) return;
      currentFloatingPos = applyFloatingPos(
        dragStartPos.x + (e.clientX - dragStartPointer.x),
        dragStartPos.y + (e.clientY - dragStartPointer.y)
      );
    };
    const onHeaderPointerUp = () => {
      if (!dragging) return;
      dragging = false;
      document.body.style.userSelect = "";
      safeLocalStorage.set(FLOATING_POS_KEY, JSON.stringify(currentFloatingPos));
      window.removeEventListener("pointermove", onHeaderPointerMove);
      window.removeEventListener("pointerup", onHeaderPointerUp);
    };
    header.addEventListener("pointerdown", (e) => {
      if (modal.dataset.floating !== "1") return;
      if (e.target.closest('[data-part="header-right"]')) return; // không nuốt click nút viewmode/collapse/off
      dragging = true;
      dragStartPointer = { x: e.clientX, y: e.clientY };
      dragStartPos = { x: currentFloatingPos.x, y: currentFloatingPos.y };
      document.body.style.userSelect = "none";
      window.addEventListener("pointermove", onHeaderPointerMove);
      window.addEventListener("pointerup", onHeaderPointerUp);
    });
    const onWinResizeFloatingPos = () => {
      if (modal.dataset.floating === "1") currentFloatingPos = applyFloatingPos(currentFloatingPos.x, currentFloatingPos.y);
    };
    window.addEventListener("resize", onWinResizeFloatingPos);
    cleanupTasks.push(() => {
      window.removeEventListener("pointermove", onHeaderPointerMove);
      window.removeEventListener("pointerup", onHeaderPointerUp);
      window.removeEventListener("resize", onWinResizeFloatingPos);
      document.documentElement.style.removeProperty("--dm-panel-x");
      document.documentElement.style.removeProperty("--dm-panel-y");
    });
    updateViewmodeMenuActiveState();

    const onKeyDown = (e) => {
      if (e.key !== "Escape") return;
      if (modal.dataset.open !== "1") return;
      if (viewmodeMenu.dataset.open === "1") { closeViewmodeMenu(); return; } // TASK00485
      closeModal();
    };
    document.addEventListener("keydown", onKeyDown, { capture: true });
    cleanupTasks.push(() => document.removeEventListener("keydown", onKeyDown, { capture: true }));

    // TASK00256. Begin — panel đang mở mà refresh → mở lại; nếu đã đóng thì giữ đóng
    if (safeSessionStorage.get(PANEL_OPEN_KEY) === "1") {
      openModal(true);
    } else if (safeSessionStorage.get(welcomeDismissedStorageKey) !== "1") {
      openModal(false);
    }
    // TASK00256. End

    /* Home mới "Kiểm tra Selector" — nội dung + logic ở khối top-level selCheck* (ngoài closure này);
       chỉ cấp hook vào closure: mở màn Try Menus, bật demo, trạng thái demo, tạo menu thật qua relay
       (requestUseThis với patch tính sẵn), thu nhỏ/mở panel (pick mode cần trang trống). */
    /* Try tại 1 spot/zone = demo Try Navi+ menus nhưng CHỈ bật đúng menu hợp spot đó: ẩn các key khác
       qua cơ chế toggle sẵn có (_tryMenusHiddenKeys, TASK00610), đặt mode replace/after cho Mega qua
       overrides (TASK00519), rồi renderTryMenusDemo() (reload sang URL demo). Selector đưa vào demo
       được lọc theo spot đang thử ở readSelCheckSelectorsOverride(). Stop = teardownTryMenusDemo()
       (dọn overrides + navigate về URL thường) + bỏ danh sách ẩn. */
    /* Khôi 2026-09-20: "Try menu" = hiện DANH SÁCH mẫu để chọn rồi chèn luôn → tái dùng popup
       "Choose a template" (openTryMenuEditPopup, Phase 2) cho đúng key của spot; Apply trong popup
       navigate sang URL demo. Mega: desktop viewport → megad, mobile → megam (popup 1 key/lần). */
    /* Khôi 2026-09-20 (chốt bản chất): Main menu cạnh logo → thay bằng 1 MENU NGẮN; dưới header →
       FULL menu. Cả 2 đều Mega Desktop nhưng 2 embed 2 chỗ → Main menu mượn slot megam chứa 1 mẫu
       mega-desktop ngắn (DM2-Simplest-01 mặc định, gallery tab mega-desktop), placement theo embed
       (DemoMarket.getPlacementOverride(kind, embedId)); Header giữ slot megad (full, dưới header). */
    /* Khôi 2026-09-21: "đừng quan tâm ngắn dài lúc này" — mặc định là 1 mẫu Mega Desktop Default bình thường.
       KHÔNG dùng lại TRY_MENUS_EMBEDS.megad: Header (slot megad) + Current main menu (slot megam) cùng bật →
       2 slot cùng 1 embed_id → trùng id DOM, MenuSection tự ẩn bản trùng. Dùng "DesktopMega 1l - Default". */
    const SEL_CHECK_MAINMENU_DEFAULT_EMBED = "SF-3581048689";
    const SEL_CHECK_TRY_PLAN = {
      header:          { key: "mega", mode: "below-header" },
      megaBelowHeader: { key: "mega", mode: "below-header" },
      mainMenu:        { key: "megam", mode: "replace", tabKey: "mega-desktop", defaultEmbed: SEL_CHECK_MAINMENU_DEFAULT_EMBED },
      hamburger:       { key: "slide" },
      logo:            { key: "slide" },
      tabbar:          { key: "tabbar" },
      fab:             { key: "fab" },
      grid:            { key: "grid" }, // Icon Menu dưới header (cần spot Header)
    };
    /* Key demo cho 1 spot, tính theo TẬP đang thử (ids). Khôi 2026-09-20: Header + Main menu phải
       chạy SONG SONG — nhưng placement override của runtime đi theo KIND (DemoMarket.getPlacementOverride
       keyed SECTION_DESKTOP_MEGAMENU/SECTION_MOBILE_MEGAMENU), 2 mega desktop không thể ở 2 chỗ khác
       nhau → Main menu LUÔN = megad (Mega Desktop thay nav), Header = megad khi đi một mình trên
       desktop, chuyển sang megam (Mega Mobile, DemoMarket vẫn force hiện trên desktop — đúng như demo
       Try Menus gốc 5 menu) khi Main menu cùng có mặt. */
    const selCheckKeyFor = (id, ids) => {
      const plan = SEL_CHECK_TRY_PLAN[id];
      if (!plan) return null;
      if (plan.key !== "mega") return plan.key;
      // Header: desktop → megad (full mega dưới header); mobile viewport → megam (Mega Mobile dưới header)
      return (window.matchMedia && window.matchMedia("(max-width: 768px)").matches) ? "megam" : "megad";
    };
    /* Nút Remove trong popup Choose a template: bỏ demo của MỌI spot đang dùng key này (Hamburger+Logo
       cùng slide → bỏ cả 2). selCheckStop (Home, top-level) tự tính tập còn lại + reapply/teardown. */
    const selCheckStopByKey = (key) => {
      const set = readSelCheckTryingSet();
      const ids = set.filter((id) => selCheckKeyFor(id, set) === key);
      if (!ids.length) return;
      const remaining = set.filter((id) => ids.indexOf(id) === -1);
      selCheckWriteTryingSet(remaining);
      selCheckStopTry(ids[0], remaining);
      selCheckRender();
    };
    /* Ẩn mọi menu demo KHÔNG thuộc tập id đang thử (nhiều spot cùng lúc — mỗi spot 1 key). */
    const selCheckSyncHiddenKeys = (ids) => {
      const keep = {};
      (ids || []).forEach((id) => { const k = selCheckKeyFor(id, ids); if (k) keep[k] = true; });
      _tryMenusHiddenKeys.clear();
      Object.keys(TRY_MENUS_EMBEDS).forEach((k) => { if (!keep[k]) _tryMenusHiddenKeys.add(k); });
      writeTryMenusHiddenKeys(_tryMenusHiddenKeys);
    };
    const selCheckTryAt = async (id, ids, onCancel) => {
      const plan = SEL_CHECK_TRY_PLAN[id];
      if (!plan) return;
      const key = selCheckKeyFor(id, ids);
      selCheckSyncHiddenKeys(ids);
      const ov = readTryMenusOverrides() || {};
      if (plan.mode) ov[key] = Object.assign({}, ov[key], { mode: plan.mode });
      writeTryMenusOverrides(ov);
      // popup đọc _lastResolvedTheme.selectors.mainMenu để bật lựa chọn "Replace" — resolve lại theo spot đang thử
      _lastResolvedTheme = await resolveCurrentThemeSelectors();
      _editPopupCancelHook = () => {
        openModal(true);
        if (onCancel) onCancel(); // Home bỏ id khỏi tập rồi gọi lại syncHidden qua ctx
      };
      closeModal(); // popup gallery nằm DƯỚI z-index của panel Navi+ Live → thu panel trong lúc chọn mẫu, huỷ thì mở lại
      openTryMenuEditPopup(key, plan.tabKey ? { tabKey: plan.tabKey, defaultEmbed: plan.defaultEmbed } : undefined);
    };
    /* Stop 1 spot: tập còn lại rỗng → tắt hẳn demo (teardown = navigate về URL thường); còn spot khác
       → chỉ ẩn key vừa stop tại chỗ (setTryMenusMenuVisible, không reload). Placement của key bị ẩn
       giữ nguyên trong session — vô hại vì key đó không hiện. */
    const selCheckStopTry = (id, remaining) => {
      if (!remaining || !remaining.length) {
        _tryMenusHiddenKeys.clear();
        writeTryMenusHiddenKeys(_tryMenusHiddenKeys);
        teardownTryMenusDemo();
        return;
      }
      /* Tập còn lại có thể đổi key (Header megam → megad khi Main menu rời đi) hay đổi placement
         (Hamburger/Logo cùng slide) → tính lại toàn bộ + reload cho chắc, không vá tại chỗ. */
      selCheckReapply(remaining);
    };
    /* Thêm spot dùng CÙNG menu demo đang bật (Hamburger + Logo → cùng 1 Mobile Menu, chỉ thêm trigger
       thứ 2) — Khôi: không mở popup chọn mẫu nữa, dùng luôn. Tính lại placement với tập mới rồi reload. */
    const selCheckReapply = async (ids) => {
      selCheckSyncHiddenKeys(ids);
      /* Mode Mega đi theo spot (Header = dưới header, Main menu = replace) nhưng lưu theo KEY — key có
         thể đổi chủ khi tập đổi (Main menu rời đi → Header quay về megad) → đặt lại mode cho đúng
         chủ hiện tại trước khi build placement. */
      const ov = readTryMenusOverrides() || {};
      (ids || []).forEach((x) => {
        const plan = SEL_CHECK_TRY_PLAN[x];
        const k = selCheckKeyFor(x, ids);
        if (plan && plan.mode && k) ov[k] = Object.assign({}, ov[k], { mode: plan.mode });
      });
      writeTryMenusOverrides(Object.keys(ov).length ? ov : null);
      _lastResolvedTheme = await resolveCurrentThemeSelectors();
      const placement = buildTryMenusPlacementOverride(_lastResolvedTheme ? _lastResolvedTheme.selectors : null);
      try {
        if (placement) sessionStorage.setItem(TRY_MENUS_PLACEMENT_SESSION_KEY, JSON.stringify(placement));
        else sessionStorage.removeItem(TRY_MENUS_PLACEMENT_SESSION_KEY);
      } catch (e) {}
      showTryMenusApplyingOverlay();
      window.location.reload();
    };
    selCheckMountInto(selCheckHome, {
      toast: (msg) => showPanelSnackbar(msg),
      tryAt: selCheckTryAt,
      stopTry: selCheckStopTry,
      reapply: selCheckReapply,
      syncHidden: selCheckSyncHiddenKeys,
      keyFor: selCheckKeyFor,
      isDemoOn: () => _tryMenusOn,
      minimize: () => closeModal(),
      open: () => openModal(true),
      openFinder,   // TASK01021 — navipick=custom (BE "Pick it in Live mode") → Finder tự do, inspector bật ngay
    });
    cleanupTasks.push(selCheckUnmount);

    return {
      cleanup: removeAll,
      openModal: () => openModal(true),
      forceHomeAndOpen,
      showNavicheckBanner,
      // TASK00405 — expose ra ngoài closure createDebugUI() để handleHash() (top-level) gọi được
      tryMenusTeardownForDebugOff: () => tryMenusTeardownForDebugOff(),
      tryMenusRestoreIfNeeded: () => restoreTryMenusDemoIfNeeded(),
      // TASK00405 — mở thẳng panel "Try Navi+ menus" (kịch bản mở link demo trực tiếp, chưa biết theme)
      openTryMenusFeature: () => openFeature("try-menus"),
      /* Mở thẳng feature "Scan website menus" — dùng cho kịch bản admin mở tab storefront qua nút
         "Lấy menu từ website" (URL mang naviscan=1). openFeature("scan") giờ TỰ quét luôn (runScan),
         và runScan tự thử lại 1 lần nếu theme render nav trễ — không cần bấm nút/trễ tay ở đây nữa. */
      openScanFeatureAndScan: () => {
        openFeature("scan");
      },
      // Thu nhỏ panel (KHÔNG tắt debug mode) — dùng cho kịch bản mở trên viewport mobile,
      // ép panel về minimize để KHÔNG che hết trang (panel rộng min-width:320px ~ gần bằng cả màn hình
      // popup 375px demo mobile), để lộ menu demo thật đang render trên trang thay vì che kín
      minimizePanel: () => closeModal(),
    };
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
          font-size: 28px;
          line-height: 1;
        }

        #${modalId} [data-part="body"] {
          padding: 12px 14px 14px;
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
      const nextUrl = `${window.location.origin}${window.location.pathname}${window.location.search}#livemode`; // TASK00535
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

    // TASK00256. Begin — bỏ qua mọi phần tử của debug UI khi dò (popup, nút nổi, snackbar...)
    const DM_IGNORE_SELECTOR =
      // thêm panel "Kiểm tra Selector" + khung gạch nối của nó
      `#${inspectorOverlayId}, #${modalId}, #${modalBackdropId}, #${floatButtonId}, #${inspectorSnackbarId}, #dm_panel_snackbar, #dm_selcheck_pickbar, .dm-sc-frame`;
    const isDebugUIElement = (element) =>
      !!(element && element.closest && element.closest(DM_IGNORE_SELECTOR));
    // TASK00256. End

    const getElementFromPoint = (x, y) => {
      const stack =
        typeof document.elementsFromPoint === "function"
          ? document.elementsFromPoint(x, y)
          : [document.elementFromPoint(x, y)];

      // Filter out inspector elements and ignored tags
      const candidates = stack.filter(element => {
        if (!element) return false;
        // TASK00256. Begin — loại trừ debug UI thay vì chỉ inspector overlay
        if (isDebugUIElement(element)) return false;
        // TASK00256. End
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
          // TASK00256. Begin — loại trừ debug UI thay vì chỉ inspector overlay
          if (isDebugUIElement(element)) continue;
          // TASK00256. End
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

      /* Pick mode: click thường = chọn. Ưu tiên state.element (đã có thể được đẩy lên cha bằng phím
         ↑ — đúng ý "dò lên cao hơn" của Khôi) rồi mới tới phần tử dưới con trỏ. Click lên chính UI
         debug (panel/nút) không tính — isDebugUIElement() để user còn bấm được nút Cancel. */
      if (_inspectorPickHandler) {
        if (isDebugUIElement(e.target)) return;
        e.preventDefault();
        e.stopPropagation();
        const picked = state.element || getElementFromPoint(e.clientX, e.clientY);
        if (!picked) return;
        const handler = _inspectorPickHandler;
        _inspectorPickHandler = null;
        /* preventDefault ở pointerdown KHÔNG huỷ được sự kiện click theo sau — chọn trúng 1 link nav
           là trang điều hướng đi mất. Nuốt đúng 1 click kế tiếp (capture), tự gỡ sau 600ms nếu
           không có click nào (thả chuột ngoài vùng). */
        const swallowClick = (ev) => { ev.preventDefault(); ev.stopPropagation(); cleanupSwallow(); };
        const swallowTimer = window.setTimeout(() => cleanupSwallow(), 600);
        const cleanupSwallow = () => {
          window.clearTimeout(swallowTimer);
          document.removeEventListener("click", swallowClick, { capture: true });
        };
        document.addEventListener("click", swallowClick, { capture: true });
        handler(picked);
        return;
      }

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

  /* Deeplink kiểm tra nhanh CSS selector.
     Admin mở storefront với #navidebug-on&navicheck=<encoded selector(s)> → debug tự chạy
     document.querySelectorAll cho từng selector, highlight element đầu tiên khớp + toast báo
     "matched N" / "not found" → merchant biết selector có đúng slide/mega đã tích hợp không.
     Tự chứa (không đụng inspector), gated: chỉ chạy khi hash có navicheck. */
  const naviCheckParse = () => {
    const hash = String(window.location.hash || "");
    const m = hash.match(/navicheck=([^&]+)/);
    if (!m) return "";
    try { return decodeURIComponent(m[1]); } catch (e) { return m[1]; }
  };
  /* Tách selector: publishTriggerIDClass "sel (D), sel2 (M)" + hamburger "sel|..." → bỏ (D)/(M) & phần sau | */
  const naviCheckClean = (raw) => String(raw || "").split(",").map((s) => {
    s = s.trim().replace(/\s*\([DdMm]\)\s*$/, "");
    return (s.split("|")[0] || "").trim();
  }).filter(Boolean);
  /* Highlight tạm element khớp (khung viền xanh, tự mờ sau 4s) */
  const naviCheckFlash = (el) => {
    try {
      const r = el.getBoundingClientRect();
      const box = document.createElement("div");
      box.style.cssText = "position:fixed;z-index:2147483646;pointer-events:none;border:2px solid #22c55e;border-radius:4px;box-shadow:0 0 0 4px rgba(34,197,94,.25);transition:opacity .4s;top:" + (r.top - 2) + "px;left:" + (r.left - 2) + "px;width:" + r.width + "px;height:" + r.height + "px;";
      document.body.appendChild(box);
      setTimeout(() => { box.style.opacity = "0"; setTimeout(() => box.remove(), 400); }, 4000);
    } catch (e) {}
  };
  const naviCheckRun = (raw) => {
    const sels = naviCheckClean(raw);
    if (!sels.length) return;
    let firstEl = null, totalOk = 0;
    const lines = sels.map((sel) => {
      let n = 0;
      try { const els = document.querySelectorAll(sel); n = els.length; if (!firstEl && n) firstEl = els[0]; }
      catch (e) { n = -1; }
      if (n > 0) totalOk++;
      return (n > 0 ? "✓ " + n + " element(s)" : n === 0 ? "✗ not found" : "⚠ invalid selector") + " — " + sel;
    });
    if (firstEl) { try { firstEl.scrollIntoView({ behavior: "smooth", block: "center" }); } catch (e) {} naviCheckFlash(firstEl); }
    if (debugUIController && typeof debugUIController.forceHomeAndOpen === "function") {
      debugUIController.forceHomeAndOpen();
    }
    if (debugUIController && typeof debugUIController.showNavicheckBanner === "function") {
      debugUIController.showNavicheckBanner(lines, totalOk > 0);
    }
  };

  /* Mở link demo TRỰC TIẾP (không qua hash #navidebug-on) — vd gửi link demo trực tiếp cho khách
     hàng xem, không phải Khôi tự demo qua panel. Khôi chốt (đơn giản hoá): KHÔNG hiện popup thông
     báo riêng nữa ("This is a live preview" — trông chán) — chỉ đơn giản bật Navi+ Debug mode +
     mở sẵn panel ngay tại "Try Navi+ menus". Demo tự hiện độc lập với panel (DemoMarket đọc thẳng
     query param, không phụ thuộc trạng thái panel) nên mở panel ở đây thuần là tiện cho khách xem
     thêm/điều chỉnh, không phải điều kiện để demo chạy. */
  // Trùng CHÍNH XÁC giá trị hằng số cùng tên bên trong createDebugUI() (domain/token cố định của
  // shop demo naviplus.io) — không import chéo qua ranh giới closure được, chấp nhận lặp lại 2 hằng
  // số ngắn thay vì tái cấu trúc lớn toàn bộ scope.
  const isTryMenusDirectLinkActive = () => {
    try {
      const params = new URLSearchParams(window.location.search);
      return params.get("test") === "1"
        && params.get("domain") === "naviplus.io"
        && params.get("token") === "NAVI733440";
    } catch (e) {
      return false;
    }
  };

  /* TASK00484: Navi+ admin (Getting Started) đã tự đoán + xác nhận đúng theme (Shopify, so tên thật
     qua Admin API với theme-selectors.json) TRƯỚC khi điều hướng khách sang đây — truyền slug qua
     param `navithemeslug` vì localStorage không share cross-origin giữa domain admin và domain site
     khách, đây là cách duy nhất "gieo" lựa chọn từ ngoài vào. Không có param → no-op, hành vi cũ giữ
     nguyên (khách tự chọn theme trong panel "Try Navi+ menus" như trước). */
  const seedTryMenusThemeFromUrl = () => {
    try {
      const params = new URLSearchParams(window.location.search);
      const slug = params.get("navithemeslug");
      if (slug) safeLocalStorage.set("navi_debug_explore_shopify_theme_slug", slug);
    } catch (e) {}
  };

  /* Chạy 1 lần lúc trang load, TRƯỚC handleHash() — chỉ can thiệp khi: URL đúng link demo VÀ debug
     mode CHƯA bật qua hash (isDebugModeEnabled() false) — tránh đụng luồng Khôi tự demo trực tiếp qua
     #navidebug-on (luồng đó đã có sẵn cơ chế riêng, không cần chạy lại ở đây). */
  /* QR / popup "Test website on mobile" (buildDebugQrUrl) mang trạng thái "Kiểm tra Selector" qua URL vì
     sessionStorage không sang máy/cửa sổ khác: tập spot đang thử, selector đã dò, kết quả Detect. Ghi lại
     vào session của tab mới TRƯỚC mọi bootstrap khác. */
  const seedSelCheckFromUrl = () => {
    try {
      const p = new URLSearchParams(window.location.search);
      const trying = p.get("naviseltry"), sel = p.get("navisel"), res = p.get("navires");
      if (trying) safeSessionStorage.set("navi_selcheck_trying", trying);
      if (sel) safeSessionStorage.set("navi_selcheck_selectors", sel);
      if (res) safeSessionStorage.set("navi_selcheck_result", res);
    } catch (e) {}
  };

  const bootstrapTryMenusDirectLink = () => {
    if (!isTryMenusDirectLinkActive()) return;
    /* Khôi 2026-09-21 ("dẹp tàn dư"): link demo 5 menu cũ (`?test=1&domain=naviplus.io&token=…`, còn trong
       history/bookmark/tab cũ) KHÔNG còn được bật demo nữa. Chỉ giữ param demo khi nó thuộc luồng mới:
       tập spot đang thử có trong session (Try theo spot) hoặc đi kèm `naviseltry` (QR/popup mobile). Còn
       lại → gỡ param demo, tắt cờ demo, về trang thường + Home mới (Detect). */
    const hasSelCheckDemo = (safeSessionStorage.get("navi_selcheck_trying") || "").replace(/[\[\]\s]/g, "") !== "";
    if (!hasSelCheckDemo) {
      safeLocalStorage.set("_naviplus_try_menus_demo_on", "0");
      try {
        ["navi_demo_placement_override", "navi_demo_params", "_naviplus_try_menus_overrides", "_naviplus_try_menus_hidden_keys"].forEach((k) => sessionStorage.removeItem(k));
      } catch (e) {}
      safeSessionStorage.set(debugModeStorageKey, "true");
      safeSessionStorage.set(welcomeDismissedStorageKey, "1");
      safeSessionStorage.set("_naviplus_debug_panel_open", "1");
      const clean = new URL(window.location.href);
      ["test", "embed", "domain", "token", "navithemeslug", "navich", "naviseltry", "navisel", "navires"].forEach((k) => clean.searchParams.delete(k));
      clean.hash = "#livemode";
      window.location.replace(clean.toString());
      return;
    }
    if (isDebugModeEnabled()) return;

    seedTryMenusThemeFromUrl();
    safeSessionStorage.set(debugModeStorageKey, "true");
    safeSessionStorage.set(welcomeDismissedStorageKey, "1"); // không để createDebugUI() tự mở panel "welcome" mặc định — panel sẽ tự mở thẳng vào try-menus bên dưới
    syncDebugUIWithDebugMode();
    if (debugUIController) {
      debugUIController.openModal(); // Khôi 2026-09-21: mở Home mới (không còn màn Try Navi+ Menus cũ)
    }
  };

  /* Kịch bản admin bấm "Lấy menu từ website hiện tại của bạn" (BE, tab #3 popup Add menu item) → mở
     tab storefront với ?naviscan=1&scantoken=... để tự bật debug mode + mở feature "Scan website
     menus" + tự scan. Không dùng domain/token demo (đó là luồng Try Navi+ menus khác hẳn). */
  const isScanDirectLinkActive = () => {
    try {
      return new URLSearchParams(window.location.search).get("naviscan") === "1";
    } catch (e) {
      return false;
    }
  };

  /* Chạy 1 lần lúc load, cùng chỗ với bootstrapTryMenusDirectLink. Chỉ can thiệp khi URL đúng link
     scan VÀ debug mode CHƯA bật (tránh đụng luồng #navidebug-on tự demo). Bật debug, ẩn welcome mặc
     định, mở panel thẳng vào feature scan và tự chạy scan. scantoken được nút "GỬI VỀ NAVI+" đọc lại
     từ URL (Phần A) nên không cần truyền tay ở đây. */
  const bootstrapScanDirectLink = () => {
    if (!isScanDirectLinkActive() || isDebugModeEnabled()) return;

    safeSessionStorage.set(debugModeStorageKey, "true");
    safeSessionStorage.set(welcomeDismissedStorageKey, "1");
    syncDebugUIWithDebugMode();
    if (debugUIController) {
      debugUIController.openModal();
      if (typeof debugUIController.openScanFeatureAndScan === "function") debugUIController.openScanFeatureAndScan();
    }
  };

  /* "Kiểm tra Selector" (2026-09-20) = HOME MỚI của
     Navi+ Live (Khôi chốt: thay toàn bộ Home 4-card cũ — Try Menus / Scan / Selector Guide / Finder —
     bằng 1 luồng duy nhất). Khối này định nghĩa nội dung Home, còn createDebugUI() chỉ tạo 1 host
     `[data-part="selcheck-home"]` trong homePanel rồi gọi selCheckMountInto(host, ctx).

     Luồng: [Find my menu spots] → Tầng 2 (`cssSelectorTier2.js`, chạy trên DOM sống, 6 spot = cùng bộ
     POC_CSS_ALL_FIELDS của backend: header / mainMenu / hamburger / logo / searchIcon / cartIcon) →
     KHUNG GẠCH NỐI quanh từng spot + mỗi spot 1 nút **Try** (chèn thử ĐÚNG menu hợp với spot đó qua
     pipeline Try Navi+ menus, chỉ bật đúng menu liên quan) / Show / Copy / Re-pick. Vùng KHÔNG có
     spot (Tab Bar đáy màn hình, Floating Button góc, dải Mega dưới header) vẽ KHUNG MA (skeleton nền
     mờ) kèm nút DEMO menu ngay trên trang để khách hình dung (Khôi 2026-09-20). Không tìm được →
     Tầng 3: Navi+ Finder ở dạng "pick mode" (panel tự thu nhỏ trong lúc chọn) hoặc liên hệ hỗ trợ.
     Mọi kết quả lưu về backend (shops.css_selector_check_result) để admin Bước 2 onboarding đọc lại,
     và cache sessionStorage để sống qua các lần reload của demo. Admin mở tab kèm
     ?naviselectorcheck=1 → tự bật Navi+ Live + tự chạy Find. Không còn màn/nút "View demo ON/OFF"
     — demo bật/tắt theo từng spot (Try/Stop). */
  const isCssSelectorCheckDirectLinkActive = () => {
    try {
      return new URLSearchParams(window.location.search).get("naviselectorcheck") === "1";
    } catch (e) {
      return false;
    }
  };

  const CSS_SELECTOR_CHECK_THEME_DB_URL = "https://cdn.naviplus.app/static/assets/v2/golive/theme-compat/theme-selectors.json";
  // 3 khoá session dưới đây được createDebugUI() đọc bằng CÙNG chuỗi literal (không import chéo qua closure).
  const SEL_CHECK_SELECTORS_SESSION_KEY = "navi_selcheck_selectors"; // selector đã dò — resolveCurrentThemeSelectors() ưu tiên
  const SEL_CHECK_TRYING_SESSION_KEY = "navi_selcheck_trying";       // spot/zone đang demo (sống qua reload của demo)
  const SEL_CHECK_RESULT_SESSION_KEY = "navi_selcheck_result";
  /* HỢP ĐỒNG với BE (welcome Bước 2, TASK01003 — Khôi 21/09): mở qua link admin KHÔNG tự dò — khách
     bấm [Detect], thử Show/Try menu bao nhiêu tuỳ ý, ưng thì bấm [Save] (POST save, BE poll checkedAt
     tự thấy) và VẪN ở màn này. `navipick=<field>` → vào thẳng pick mode cho spot đó. */
  const SEL_CHECK_OPENED_SESSION_KEY = "navi_selcheck_opened";   // "1" = vừa mở qua link admin (log "opened" 1 lần)
  const SEL_CHECK_NAVIPICK_SESSION_KEY = "navi_selcheck_navipick"; // field cần pick ngay (từ &navipick=)
  // TASK01052 — "1" = đã tự bấm hộ Detect 1 lần trong tab này (hash &autodetect=1, nút "Navi+ Live"
  // ở admin) — chặn lặp lại Detect mỗi lần hashchange bắn thêm lần nữa (vd link demo phát sinh hash
  // khác trong tab), tôn trọng nếu khách đang tự thao tác dở (Try/Stop 1 spot nào đó).
  const SEL_CHECK_AUTORUN_SESSION_KEY = "navi_selcheck_autorun_done";
  /* "1" = tab này đang trong luồng tìm chỗ đặt menu (mở qua link admin) — sống qua reload, xoá khi Turn off
     Live. Khi cờ bật, menu THẬT của khách đang Replace phần tử theme (Mega Replace header/main menu) được
     TẠM NGƯNG trên tab này để header gốc hiện ra — không thì Detect lẫn Pick đều mù (anbani2023: mega
     Replace cả section header → search/cart/logo/main menu đều display:none, Khôi: "header còn bị replace mất"). */
  const SEL_CHECK_ENGAGED_SESSION_KEY = "navi_selcheck_engaged";
  const SEL_CHECK_FIELDS = ["header", "mainMenu", "hamburger", "logo", "searchIcon", "cartIcon"];
  /* Khôi 2026-09-20: search/cart icon KHÔNG hiện thành dòng/khung (không phải chỗ đặt menu) — vẫn dò
     + lưu (backend/admin dùng sau), chỉ nhắc 1 dòng note cuối "cũng đã xác định… dùng sau". */
  const SEL_CHECK_SHOWN_FIELDS = ["header", "mainMenu", "hamburger", "logo"];
  const SEL_CHECK_NOTE_FIELDS = ["searchIcon", "cartIcon"];
  /* label/hint = spot là gì; can = Navi+ làm được gì ở đó (khớp copy poc_css_build_showcase() bên
     backend); try = "Try" chèn thử menu (demo) hay "click" (bấm thử icon để thấy panel theme mở). */
  /* Khôi 2026-09-21: copy khớp NGUYÊN VĂN card Bước 2 onboarding (welcome.php `CARD`/`DESC`
     /`wl2ad_group_*`) — label = tên card, hint = "Navi+ làm gì ở đó" (câu đầy đủ), `what` = tên
     phần tử để nói với khách lúc pick / chưa tìm thấy ("Click on your header…"). Nhóm hiển thị
     (SEL_CHECK_GROUPS) cũng theo đúng 3 nhóm của onboarding. Trước đó: "Mobile menu icon"/"the ≡
     button…" — khách xem trên desktop không thấy icon đó ở đâu nên không hiểu. */
  const SEL_CHECK_FIELD_META = {
    mainMenu:   { label: "Current main menu",  icon: "ri-layout-top-line",        what: "main menu",  hint: "Replace your main menu with a Mega Menu.",                    can: "Replace it with a Mega Menu",             try: "demo",  color: "#16a34a" },
    header:     { label: "Below header",       icon: "ri-insert-row-bottom",      what: "header",     hint: "Add a Mega Menu below your header.",                         can: "Add a Mega Menu right below it",          try: "demo",  color: "#2563eb" },
    hamburger:  { label: "Existing menu icon", icon: "ri-menu-line",              what: "menu icon (≡)", hint: "Use your existing ≡ icon to open a Navi+ Mobile Menu.",   can: "Open a Navi+ Mobile Menu from it",        try: "demo",  color: "#ea580c",
                  hiddenNote: "Shows on mobile only — that's why you can't see it on this desktop screen. Use \u201cTest website on mobile\u201d below to check it on your phone." },
    logo:       { label: "Next to logo",       icon: "ri-menu-add-line",          what: "logo",       hint: "Add a menu icon next to your logo — opens the Mobile Menu on desktop.", can: "Add a menu icon next to it (desktop)", try: "demo", color: "#7c3aed" },
    searchIcon: { label: "Search icon",        what: "search icon", hint: "Opens your search.",                                        can: "A Navi+ menu item can open it",           try: "click", color: "#0891b2" },
    cartIcon:   { label: "Cart icon",          what: "cart icon",  hint: "Opens your cart.",                                           can: "A Navi+ menu item can open it",           try: "click", color: "#db2777" },
  };
  /* Vùng KHÔNG có spot — khung ma (skeleton) vẽ thẳng trên trang + nút DEMO menu. megaBelowHeader
     chỉ vẽ khi đã có spot header (dải ngay dưới header). */
  const SEL_CHECK_ZONES = {
    grid:   { label: "Icon menu",       icon: "ri-apps-line",               hint: "Add an Icon Menu below your header.",              can: "Category tiles", needs: "header", noGhost: true },
    tabbar: { label: "Tab Bar",         icon: "ri-layout-bottom-line",      hint: "A bar fixed at the bottom of the screen.",         can: "Quick links your customers tap most" },
    fab:    { label: "Floating Button", icon: "ri-customer-service-2-line", hint: "A round button in the bottom-right corner.",       can: "Support / contact / social shortcuts" },
  };
  /* 3 nhóm y hệt Bước 2 onboarding: Desktop navigation · Mobile navigation · No menu spot needed.
     `fields` = spot dò được (SEL_CHECK_FIELD_META), `zones` = vùng không cần spot (SEL_CHECK_ZONES).
     "Next to logo" thuộc Desktop (icon cạnh logo chỉ chèn ở desktop) — Khôi 21/09. Mỗi card 1 icon
     RemixIcon (`icon`, đã load sẵn cho panel) màu ĐEN, không theo màu khung spot — Khôi 21/09. */
  const SEL_CHECK_GROUPS = [
    { title: "Desktop navigation", fields: ["mainMenu", "header", "logo"], zones: [] },
    { title: "Mobile navigation",  fields: ["hamburger"],                  zones: ["grid"] },
    { title: "No menu spot needed — works on any theme", fields: [], zones: ["tabbar", "fab"] },
  ];

  /* Khung ma dải Mega dưới header: KHÔNG phải zone riêng (Khôi 2026-09-20: card "Mega Menu" ở "More
     places" gây khó hiểu vì Header đã là chỗ đó) — chỉ là hình minh hoạ trên trang cho spot Header,
     nút DEMO của nó = Try của Header. */
  const SEL_CHECK_HEADER_BAND = "megaBelowHeader";
  const SEL_CHECK_SUPPORT_EMAIL = "khoipn@naviplus.io";

  const cssSelectorCheckStyleId = "dm_selcheck_style";
  const SEL_CHECK_PICKBAR_ID = "dm_selcheck_pickbar";

  const ensureCssSelectorCheckStyle = () => {
    if (document.getElementById(cssSelectorCheckStyleId)) return;
    const style = document.createElement("style");
    style.id = cssSelectorCheckStyleId;
    style.textContent = `
      .dm-sc{font-size:13px;line-height:1.5;color:#111827}
      .dm-sc *{box-sizing:border-box}
      .dm-sc .dm-sc-title{font-size:14px;font-weight:700;margin:2px 0 6px;display:flex;align-items:center;gap:6px}
      .dm-sc .dm-sc-title-icon{font-size:18px;color:#2563eb}
      .dm-sc .dm-sc-hero{display:block;width:220px;max-width:100%;height:auto;margin:6px auto 10px}
      /* Màn trống: căn giữa hết (Khôi 2026-09-21) */
      .dm-sc .dm-sc-idle{text-align:center;padding:8px 0 4px}
      .dm-sc .dm-sc-idle .dm-sc-title{justify-content:center}
      .dm-sc .dm-sc-idle .dm-sc-btn.is-big{width:auto;min-width:200px;padding-left:22px;padding-right:22px}
      .dm-sc .dm-sc-sub{font-size:12px;font-weight:700;color:#6b7280;text-transform:uppercase;letter-spacing:.03em;margin:12px 0 2px}
      .dm-sc .dm-sc-sub:first-child{margin-top:2px}
      .dm-sc .dm-sc-intro{font-size:12.5px;color:rgba(17,24,39,0.78);margin-bottom:10px}
      /* Card 1 spot — cùng ngôn ngữ card của panel (feature-card cũ): nền trắng, viền mảnh, bo 10px;
         viền trái 3px màu = màu khung gạch nối của spot đó trên trang (Khôi: bỏ icon ở đầu). */
      /* Khôi 21/09: bỏ vạch màu theo spot + khung/nền xanh lúc demo — card luôn trắng, viền mảnh;
         đang demo chỉ còn 1 vạch xanh mép trái + nút Stop demo dạng outline. */
      .dm-sc .dm-sc-row{position:relative;background:#fff;border:1px solid rgba(0,0,0,0.08);
        border-radius:10px;padding:10px 12px;margin-top:8px;box-shadow:0 1px 2px rgba(0,0,0,0.03)}
      .dm-sc .dm-sc-row[data-found="0"]{border-style:dashed;background:#fafafa}
      /* Đang demo: chỉ 1 vạch xanh mép trái (Khôi 21/09 "thêm cái line xanh cũng được"), nền vẫn trắng */
      .dm-sc .dm-sc-row[data-trying="1"]{border-left:3px solid #16a34a}
      .dm-sc .dm-sc-row-head{display:flex;align-items:center;gap:8px}
      .dm-sc .dm-sc-row-head b{font-weight:700;font-size:13.5px;display:flex;align-items:center;gap:7px}
      .dm-sc .dm-sc-ic{font-size:17px;line-height:1;color:#111827;flex:none}
      /* Khôi 2026-09-21: bỏ nút Show — bấm vào TÊN spot để cuộn tới + nháy khung trên trang */
      .dm-sc .dm-sc-name{cursor:pointer;border-bottom:1px dashed transparent}
      .dm-sc .dm-sc-name:hover{border-bottom-color:currentColor}
      .dm-sc .dm-sc-hint{color:#6b7280;font-size:12px}
      .dm-sc .dm-sc-can{font-size:12px;color:#374151;margin-top:2px}
      .dm-sc .dm-sc-sel{display:flex;align-items:center;gap:6px;margin-top:8px}
      /* Chip selector: hover hiện icon copy, bấm cả chip = copy (Khôi: bỏ nút Copy riêng) */
      .dm-sc code{flex:1;min-width:0;display:flex;align-items:center;gap:6px;cursor:pointer;
        font:11.5px/1.4 ui-monospace,SFMono-Regular,Menlo,monospace;background:#f3f4f6;
        border-radius:5px;padding:3px 8px;color:#374151;user-select:none}
      .dm-sc code span{flex:1;min-width:0;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
      .dm-sc code i{flex:none;font-size:13px;color:#6b7280;opacity:0;transition:opacity .15s}
      .dm-sc code:hover{background:#e5e7eb}
      .dm-sc code:hover i{opacity:1}
      .dm-sc code[data-copied="1"] i{opacity:1;color:#16a34a}
      .dm-sc .dm-sc-btn{appearance:none;border:1px solid #d1d5db;background:#fff;border-radius:6px;font-family:inherit;
        padding:4px 9px;font-size:12px;line-height:1.3;cursor:pointer;color:#111827;white-space:nowrap}
      .dm-sc .dm-sc-btn:hover{background:#f3f4f6}
      .dm-sc .dm-sc-btn:disabled{opacity:.6;cursor:default}
      .dm-sc .dm-sc-btn.is-primary{background:#111827;border-color:#111827;color:#fff;font-weight:600}
      .dm-sc .dm-sc-btn.is-primary:hover{background:#000}
      .dm-sc .dm-sc-btn.is-big{padding:9px 12px;font-size:13px;width:100%}
      /* Stop demo = nút outline (Khôi 21/09): nền trắng, viền đen, chữ đen — Try menu vẫn đen đặc */
      .dm-sc .dm-sc-btn.is-stop{background:#fff;border-color:#111827;color:#111827;font-weight:600}
      .dm-sc .dm-sc-btn.is-stop:hover{background:#f3f4f6}
      .dm-sc .dm-sc-btn.is-link{border:0;padding:2px 4px;color:#2563eb;text-decoration:underline;background:transparent}
      .dm-sc .dm-sc-note{font-size:12px;color:#6b7280;margin-top:10px}
      .dm-sc .dm-sc-warn{font-size:12px;color:#b45309;margin-top:2px}
      .dm-sc .dm-sc-errcode{color:#b45309;font-family:ui-monospace,SFMono-Regular,Menlo,monospace;font-size:11.5px}
      .dm-sc .dm-sc-live{font-size:12px;color:#166534;font-weight:600;white-space:nowrap}
      .dm-sc .dm-sc-row-head b{white-space:nowrap}
      /* Panel hẹp (floating/pin-right mặc định 300px, hoặc màn hình bé): tên spot dài ("Current main
         menu", "Existing menu icon") đang nowrap + nút Stop demo cũng nowrap ⇒ min-content của hàng
         rộng hơn card, tràn hẳn ra mép phải panel (Khôi 22/09 ảnh 20260922-205628). Cho hàng xuống
         dòng và tên tự ngắt; nút giữ nguyên khổ, không bị bóp. */
      .dm-sc .dm-sc-row{max-width:100%}
      .dm-sc .dm-sc-row-head{flex-wrap:wrap}
      .dm-sc .dm-sc-row-head b{min-width:0;white-space:normal;overflow-wrap:anywhere}
      .dm-sc .dm-sc-row-head .dm-sc-btn{flex:none}
      .dm-sc .dm-sc-banner{background:#eff6ff;border:1px solid #bfdbfe;border-radius:8px;padding:10px 12px;margin-bottom:8px;font-size:12.5px}
      .dm-sc .dm-sc-banner-title{display:block;margin-bottom:2px}
      .dm-sc a{color:#2563eb}
      .dm-sc-frame{position:fixed;pointer-events:none;z-index:2147482999;border:2px dashed;border-radius:4px;
        box-shadow:0 0 0 2px rgba(255,255,255,.7);transition:opacity .2s}
      .dm-sc-frame-tag{position:absolute;left:-2px;top:-2px;transform:translateY(-100%);padding:1px 6px;border-radius:4px 4px 4px 0;
        font:600 11px/1.5 -apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,sans-serif;color:#fff;white-space:nowrap}
      .dm-sc-frame[data-bottom-tag="1"] .dm-sc-frame-tag{top:auto;bottom:-2px;transform:translateY(100%);border-radius:0 4px 4px 4px}
      /* Khung ma vùng chưa có menu: nền mờ + skeleton + nút DEMO (chỉ nút nhận click, khung xuyên chuột) */
      .dm-sc-ghost{position:fixed;pointer-events:none;z-index:2147482998;background:rgba(17,24,39,.07);
        border:2px dashed rgba(17,24,39,.4);border-radius:10px;display:flex;align-items:center;justify-content:center;gap:14px;
        font:12px/1.4 -apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,sans-serif;color:#111827;transition:opacity .2s}
      .dm-sc-ghost[data-zone="fab"]{border-radius:50%;flex-direction:column;gap:0}
      .dm-sc-ghost .dm-sc-ghost-tag{position:absolute;left:-2px;top:-2px;transform:translateY(-100%);padding:1px 6px;border-radius:4px 4px 4px 0;
        background:#111827;color:#fff;font-weight:600;font-size:11px;white-space:nowrap}
      .dm-sc-ghost[data-bottom-tag="1"] .dm-sc-ghost-tag{top:auto;bottom:-2px;transform:translateY(100%);border-radius:0 4px 4px 4px}
      .dm-sc-ghost .dm-sc-sk{display:flex;gap:16px;align-items:center;opacity:.55}
      .dm-sc-ghost .dm-sc-sk-item{display:flex;flex-direction:column;align-items:center;gap:4px}
      .dm-sc-ghost .dm-sc-sk-ico{width:20px;height:20px;border-radius:6px;background:#6b7280}
      .dm-sc-ghost .dm-sc-sk-bar{height:6px;border-radius:3px;background:#6b7280}
      .dm-sc-ghost button{pointer-events:auto;appearance:none;border:0;background:#111827;color:#fff;border-radius:999px;
        padding:6px 12px;font:600 12px/1.3 inherit;cursor:pointer;box-shadow:0 4px 14px rgba(0,0,0,.25);white-space:nowrap}
      .dm-sc-ghost button:hover{background:#000}
      .dm-sc-ghost[data-zone="fab"] button{position:absolute;right:calc(100% + 10px);top:50%;transform:translateY(-50%)}
      #${SEL_CHECK_PICKBAR_ID}{position:fixed;left:50%;bottom:20px;transform:translateX(-50%);z-index:2147483001;
        width:min(440px,calc(100vw - 32px));background:#111827;color:#fff;border-radius:12px;padding:12px 14px;
        box-shadow:0 8px 30px rgba(0,0,0,.3);font:13px/1.5 -apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,sans-serif}
      #${SEL_CHECK_PICKBAR_ID} b{display:block;font-size:14px;margin-bottom:2px}
      #${SEL_CHECK_PICKBAR_ID} .dm-sc-pick-hint{color:rgba(255,255,255,.75);font-size:12px}
      #${SEL_CHECK_PICKBAR_ID} .dm-sc-pick-err{color:#fbbf24;font-size:12px;margin-top:4px}
      #${SEL_CHECK_PICKBAR_ID} button{appearance:none;margin-top:8px;border:1px solid rgba(255,255,255,.35);background:transparent;
        color:#fff;border-radius:6px;padding:5px 12px;font-size:12px;cursor:pointer;font-family:inherit}
      #${SEL_CHECK_PICKBAR_ID} button:hover{background:rgba(255,255,255,.12)}
      /* thanh xác nhận "đã nhận ra <spot>": nút chính trắng, nút phụ viền */
      #${SEL_CHECK_PICKBAR_ID} .dm-sc-confirm-btns{display:flex;gap:8px;flex-wrap:wrap}
      #${SEL_CHECK_PICKBAR_ID} button.is-primary{background:#fff;color:#111827;border-color:#fff;font-weight:600}
      #${SEL_CHECK_PICKBAR_ID} button.is-primary:hover{background:#e5e7eb}
    `;
    document.head.appendChild(style);
  };

  const selCheckState = {
    host: null,      // div trong homePanel của createDebugUI() (null = panel chưa dựng)
    ctx: null,       // hook do createDebugUI() cấp: tryAt/stopTry/isDemoOn/minimize/open
    result: null,    // { source, theme, themeName, selectors:{field: selector} }
    els: {},         // field → Element đang khớp trên trang
    frames: {},      // field → div.dm-sc-frame
    ghosts: {},      // zoneId → div.dm-sc-ghost
    picking: null,   // field đang dò tay (Tầng 3), null = không
    pickError: "",   // lý do lần pick vừa rồi bị từ chối
    saveState: "",   // "" | "saving" | "saved" | "failed" — "" sau mỗi thay đổi kết quả (chưa Save)
    view: "idle",    // "idle" (chưa Detect) | "scanning" | "result"
    frameTimer: 0,
    focusField: null,   // field đang được hỏi "đúng cái này không?" (navipick tự nhận ra) — vẽ khung dù là spot phụ
    suspended: [],      // menu Replace THẬT của khách đang tạm ngưng trên tab này: [{ style, menu }]
    suspendObserver: null,
  };

  /* Tập id (spot/zone) đang demo cùng lúc — JSON mảng trong session (Khôi: Tab Bar + FAB phải cùng hiện). */
  const selCheckTryingSet = () => {
    try {
      const v = JSON.parse(safeSessionStorage.get(SEL_CHECK_TRYING_SESSION_KEY) || "[]");
      return Array.isArray(v) ? v : [];
    } catch (e) { return []; }
  };
  const selCheckWriteTryingSet = (ids) => {
    if (ids && ids.length) safeSessionStorage.set(SEL_CHECK_TRYING_SESSION_KEY, JSON.stringify(ids));
    else safeSessionStorage.remove(SEL_CHECK_TRYING_SESSION_KEY);
  };
  const selCheckIsTrying = (id) => selCheckIsDemoOn() && selCheckTryingSet().indexOf(id) !== -1;
  const selCheckIsDemoOn = () => !!(selCheckState.ctx && selCheckState.ctx.isDemoOn());

  /* cssSelectorTier2.js nối SAU livemode.js trong bundle — lúc bootstrap chạy (onReady đồng bộ khi
     trang đã load) Tier2 chưa có → chờ rồi gọi lại (log "opened" từng bị nuốt vì vậy). */
  const selCheckLog = (event, detail, attempt) => {
    if (window.NaviCssSelectorTier2 && typeof window.NaviCssSelectorTier2.logEvent === "function") {
      window.NaviCssSelectorTier2.logEvent(event, detail);
    } else if ((attempt || 0) < 10) {
      window.setTimeout(() => selCheckLog(event, detail, (attempt || 0) + 1), 300);
    }
  };

  const selCheckReadCache = () => {
    try {
      const raw = JSON.parse(safeSessionStorage.get(SEL_CHECK_RESULT_SESSION_KEY) || "null");
      return raw && raw.selectors && typeof raw.selectors === "object" ? raw : null;
    } catch (e) {
      return null;
    }
  };
  const selCheckWriteCache = (result) => {
    safeSessionStorage.set(SEL_CHECK_RESULT_SESSION_KEY, JSON.stringify(result));
    // Cho Try Navi+ menus đọc — đúng shape resolveCurrentThemeSelectors() chờ (header/mainMenu/hamburger/logo)
    safeSessionStorage.set(SEL_CHECK_SELECTORS_SESSION_KEY, JSON.stringify(result.selectors || {}));
  };

  const selCheckIsEngaged = () => safeSessionStorage.get(SEL_CHECK_ENGAGED_SESSION_KEY) === "1";

  /* Tạm ngưng menu THẬT của khách đang Replace phần tử theme — chỉ trên tab này, chỉ khi đang trong luồng
     tìm chỗ đặt menu. Engine ẩn phần tử theme bằng <style data-navi-selector> (Helper.strongHideElm) rồi chèn
     menu Navi+ ngay sau (`afterend`, Helper.deployReplaceInsertMode). Ở đây làm ngược lại: gỡ <style> đó
     (header gốc hiện lại) + ẩn menu Navi+ vừa chèn (inline important — phần tử của Navi+, không đụng theme).
     Engine có thể vẽ lại sau (fast path cache → validate version → redraw) và ẩn lại → quan sát <head>, thấy
     <style data-navi-selector> mới là ngưng tiếp; KHÔNG dùng timer. Turn off Live → trả lại nguyên trạng. */
  const selCheckSuspendOneReplace = (style) => {
    const sel = style.getAttribute("data-navi-selector") || "";
    let target = null;
    try { target = sel ? document.querySelector(sel) : null; } catch (e) {}
    const next = target && target.nextElementSibling;
    const menu = next && next.matches(".naviman_app, .naviItem, [id^='SF-']") ? next : null;
    const prev = menu ? [menu.style.getPropertyValue("display"), menu.style.getPropertyPriority("display")] : null;
    if (menu) {
      menu.style.setProperty("display", "none", "important");
      menu.setAttribute("data-navi-selcheck-paused", "1");
    }
    style.remove();
    selCheckState.suspended.push({ style, menu, prev });
  };
  const selCheckSuspendReplacedTheme = () => {
    if (!selCheckIsEngaged()) return;
    /* Đang demo (Try): engine chỉ vẽ menu DEMO (DemoMarket, ?test=1) — <style data-navi-selector> lúc này là của
       demo Replace main menu, ngưng nó là phá demo. Menu thật không vẽ khi demo nên không có gì để ngưng. */
    if (selCheckIsDemoOn()) return;
    const styles = Array.from(document.head.querySelectorAll("style[data-navi-selector]"));
    const before = selCheckState.suspended.length;
    styles.forEach(selCheckSuspendOneReplace);
    if (styles.length) {
      selCheckLog("replace_paused", { count: styles.length });
      selCheckState.els = selCheckResolveEls((selCheckState.result && selCheckState.result.selectors) || {});
      selCheckPositionFrames();
      if (before === 0) selCheckRender(); // dòng nhắc "menu thật đang tạm ngưng" xuất hiện
    }
    if (!selCheckState.suspendObserver && window.MutationObserver) {
      selCheckState.suspendObserver = new MutationObserver((muts) => {
        muts.forEach((m) => Array.from(m.addedNodes).forEach((n) => {
          if (n.nodeType === 1 && n.tagName === "STYLE" && n.hasAttribute("data-navi-selector")) selCheckSuspendOneReplace(n);
        }));
      });
      selCheckState.suspendObserver.observe(document.head, { childList: true });
    }
  };
  const selCheckRestoreReplacedTheme = () => {
    if (selCheckState.suspendObserver) { selCheckState.suspendObserver.disconnect(); selCheckState.suspendObserver = null; }
    selCheckState.suspended.forEach(({ style, menu, prev }) => {
      if (menu && menu.isConnected) {
        if (prev && prev[0]) menu.style.setProperty("display", prev[0], prev[1]); else menu.style.removeProperty("display");
        menu.removeAttribute("data-navi-selcheck-paused");
      }
      if (!style.isConnected) document.head.appendChild(style);
    });
    selCheckState.suspended = [];
  };

  /* Chỉ nhận selector khớp ĐÚNG 1 phần tử (rule cứng "không bao giờ nhiều ứng viên") — sai/0/nhiều
     → coi như chưa có field đó trên trang này (row hiện "Pick it"). */
  const selCheckResolveEls = (selectors) => {
    const els = {};
    SEL_CHECK_FIELDS.forEach((f) => {
      const sel = selectors && selectors[f];
      if (!sel) return;
      try {
        const found = document.querySelectorAll(sel);
        if (found.length === 1) els[f] = found[0];
      } catch (e) {}
    });
    return els;
  };

  const selCheckEsc = (s) => String(s == null ? "" : s)
    .replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

  const selCheckIsRectVisible = (r) => r.width > 0 && r.height > 0 && r.bottom > 0 && r.right > 0
    && r.top < window.innerHeight && r.left < window.innerWidth;

  /* ── Khung gạch nối (spot tìm được) + khung ma (vùng chưa có menu) — cùng 1 vòng định vị ──
     1 div fixed/spot, đặt theo getBoundingClientRect mỗi lần cuộn/đổi cỡ + tick 500ms (layout theme
     đổi ngầm — header sticky co lại, menu mobile mở...). Dùng div riêng thay vì outline lên chính
     phần tử: outline bị overflow:hidden của cha cắt mất, còn khung riêng luôn thấy. Phần tử đang ẩn
     (hamburger ở breakpoint desktop: width 0) → khung ẩn theo. Khung ma của vùng ĐANG demo ẩn đi
     (menu demo thật đang chiếm chỗ đó). */
  const selCheckPositionFrames = () => {
    Object.keys(selCheckState.frames).forEach((f) => {
      const frame = selCheckState.frames[f];
      const el = selCheckState.els[f];
      if (!el || !el.isConnected) { frame.style.opacity = "0"; return; }
      const r = el.getBoundingClientRect();
      if (!selCheckIsRectVisible(r)) { frame.style.opacity = "0"; return; }
      frame.style.opacity = "1";
      frame.style.left = (r.left - 2) + "px";
      frame.style.top = (r.top - 2) + "px";
      frame.style.width = (r.width + 4) + "px";
      frame.style.height = (r.height + 4) + "px";
      frame.dataset.bottomTag = r.top < 24 ? "1" : "0"; // nhãn không còn chỗ phía trên → hạ xuống dưới khung
    });
    const demoOn = selCheckIsDemoOn();
    Object.keys(selCheckState.ghosts).forEach((z) => {
      const ghost = selCheckState.ghosts[z];
      /* Chỉ ẩn khung ma của CHÍNH vùng đang demo (menu thật đang chiếm chỗ); vùng khác giữ skeleton để
         khách còn thấy chỗ trống mà thử tiếp (Khôi 2026-09-21: "thiếu skeleton Tab Bar/FAB" khi đang demo
         Icon Menu). Dải dưới header ẩn khi Header hoặc Icon Menu đang demo. */
      const trying = selCheckTryingSet();
      const occupied = demoOn && (trying.indexOf(z) !== -1 || (z === SEL_CHECK_HEADER_BAND && (trying.indexOf("header") !== -1 || trying.indexOf("grid") !== -1)));
      if (occupied || selCheckState.picking) { ghost.style.opacity = "0"; ghost.style.pointerEvents = "none"; return; }
      ghost.style.opacity = "1";
      ghost.style.pointerEvents = "";
      if (z === SEL_CHECK_HEADER_BAND) {
        const el = selCheckState.els.header;
        const r = el && el.isConnected ? el.getBoundingClientRect() : null;
        if (!r || !selCheckIsRectVisible(r)) { ghost.style.opacity = "0"; return; }
        ghost.style.left = r.left + "px";
        ghost.style.top = (r.bottom + 2) + "px";
        ghost.style.width = r.width + "px";
        ghost.style.height = "48px";
        ghost.dataset.bottomTag = "1";
      }
      // tabbar/fab: vị trí cố định (CSS đặt sẵn lúc tạo), không phụ thuộc DOM theme
    });
  };
  const selCheckRemoveFrames = () => {
    Object.keys(selCheckState.frames).forEach((f) => selCheckState.frames[f].remove());
    Object.keys(selCheckState.ghosts).forEach((z) => selCheckState.ghosts[z].remove());
    selCheckState.frames = {};
    selCheckState.ghosts = {};
    if (selCheckState.frameTimer) {
      window.clearInterval(selCheckState.frameTimer);
      selCheckState.frameTimer = 0;
      window.removeEventListener("scroll", selCheckPositionFrames, { capture: true });
      window.removeEventListener("resize", selCheckPositionFrames);
    }
  };
  const selCheckSkeleton = (n) => {
    let html = '<span class="dm-sc-sk">';
    for (let i = 0; i < n; i += 1) {
      html += '<span class="dm-sc-sk-item"><span class="dm-sc-sk-ico"></span><span class="dm-sc-sk-bar" style="width:' + (18 + (i * 7) % 16) + 'px"></span></span>';
    }
    return html + "</span>";
  };
  const selCheckMakeGhost = (zoneId) => {
    const zone = SEL_CHECK_ZONES[zoneId] || { label: "Mega Menu" };
    const ghost = document.createElement("div");
    ghost.className = "dm-sc-ghost";
    ghost.dataset.zone = zoneId;
    let inner = `<span class="dm-sc-ghost-tag">${selCheckEsc(zone.label)}</span>`;
    if (zoneId === "tabbar") {
      /* Khôi: trên desktop Tab Bar demo NỔI (BOTTOM_CENTER_FLOAT) → skeleton cũng lơ lửng giữa-dưới,
         không dán đáy; mobile mới dán mép dưới full-width như Tab Bar thật. */
      const mobile = window.matchMedia && window.matchMedia("(max-width: 768px)").matches;
      ghost.style.cssText = mobile
        ? "left:0;right:0;bottom:0;height:60px;border-radius:0;border-bottom:0"
        : "left:50%;transform:translateX(-50%);bottom:24px;width:min(440px,calc(100vw - 40px));height:60px;border-radius:14px";
      inner += selCheckSkeleton(5);
    } else if (zoneId === "fab") {
      ghost.style.cssText = "right:20px;bottom:80px;width:56px;height:56px";
      inner += '<span class="dm-sc-sk"><span class="dm-sc-sk-ico" style="width:24px;height:24px;border-radius:50%"></span></span>';
    } else {
      inner += selCheckSkeleton(6);
    }
    inner += `<button type="button" data-act="try" data-id="${zoneId}">DEMO menu</button>`;
    ghost.innerHTML = inner;
    const tryId = zoneId === SEL_CHECK_HEADER_BAND ? "header" : zoneId;
    ghost.querySelector("button").addEventListener("click", () => selCheckTry(tryId));
    return ghost;
  };
  const selCheckRenderFrames = () => {
    selCheckRemoveFrames();
    // spot phụ (search/cart) không có khung, TRỪ khi đang hỏi khách "đúng cái này không?" (navipick)
    Object.keys(selCheckState.els).filter((f) => SEL_CHECK_SHOWN_FIELDS.indexOf(f) !== -1 || f === selCheckState.focusField).forEach((f) => {
      const meta = SEL_CHECK_FIELD_META[f];
      const frame = document.createElement("div");
      frame.className = "dm-sc-frame";
      frame.style.borderColor = meta.color;
      frame.innerHTML = `<span class="dm-sc-frame-tag" style="background:${meta.color}">${meta.label}</span>`;
      document.body.appendChild(frame);
      selCheckState.frames[f] = frame;
    });
    const zoneIds = Object.keys(SEL_CHECK_ZONES).filter((z) => !SEL_CHECK_ZONES[z].noGhost).concat(selCheckState.els.header ? [SEL_CHECK_HEADER_BAND] : []);
    zoneIds.forEach((z) => {
      const ghost = selCheckMakeGhost(z);
      document.body.appendChild(ghost);
      selCheckState.ghosts[z] = ghost;
    });
    selCheckPositionFrames();
    if (!selCheckState.frameTimer) {
      window.addEventListener("scroll", selCheckPositionFrames, { passive: true, capture: true });
      window.addEventListener("resize", selCheckPositionFrames, { passive: true });
      selCheckState.frameTimer = window.setInterval(selCheckPositionFrames, 500);
    }
  };

  const selCheckScrollTo = (field) => {
    const el = selCheckState.els[field];
    if (!el) return;
    el.scrollIntoView({ behavior: "smooth", block: "center" });
    const frame = selCheckState.frames[field];
    if (!frame) return;
    // nháy 3 lần để mắt bắt được khung nào vừa bấm "Show"
    let n = 0;
    const blink = () => {
      frame.style.visibility = (n % 2) ? "visible" : "hidden";
      n += 1;
      if (n < 6) window.setTimeout(blink, 180); else frame.style.visibility = "visible";
    };
    window.setTimeout(blink, 350);
  };

  const selCheckCopy = (text, chip) => {
    const done = () => {
      const icon = chip.querySelector("i");
      chip.dataset.copied = "1";
      if (icon) icon.className = "ri-check-line";
      window.setTimeout(() => { chip.dataset.copied = "0"; if (icon) icon.className = "ri-file-copy-line"; }, 1400);
    };
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(text).then(done, done);
    } else {
      const ta = document.createElement("textarea");
      ta.value = text; document.body.appendChild(ta); ta.select();
      try { document.execCommand("copy"); } catch (e) {}
      ta.remove(); done();
    }
  };

  /* Lưu về backend (shops.css_selector_check_result) — admin bấm "I'm done, check again" ở Bước 2
     onboarding là thấy ngay. Có ít nhất 1 field dò tay → source "manual"; vẫn giữ theme/themeName
     nếu Tầng 2 đã nhận ra theme. */
  /* [Save] — CHỈ khi khách bấm (hợp đồng BE: không tự lưu lúc Detect/pick). Tách 2 request: spot
     thuật toán dò → source "live_auto", spot khách pick → "manual" (server merge theo field và ghi
     danh sách `manual`, `poc_css_save_result`). Xong → VẪN ở màn này + toast "Sent to your Navi+ admin ✓";
     BE poll `checkedAt` tự thấy. */
  const selCheckSave = async () => {
    const result = selCheckState.result;
    const selectors = (result && result.selectors) || {};
    if (!Object.keys(selectors).length) return;
    if (!window.NaviCssSelectorTier2 || typeof window.NaviCssSelectorTier2.saveResult !== "function") return;
    selCheckState.saveState = "saving";
    selCheckRender();
    /* MỘT request duy nhất (báo cáo 28: 2 request nối tiếp không nguyên tử — BE poll thấy checkedAt đổi sau
       request 1 rồi đóng popup với nửa kết quả). `manual` = danh sách field khách pick, server ghi nhớ.
       Kèm tên theme thật của khách (`Shopify.theme.name`) để admin hiện "Finding your menu spot: <tên>". */
    const manualFields = (result.manual || []).filter((f) => selectors[f]);
    const sh = window.Shopify || {};
    const payload = {
      theme: result.theme, themeName: result.themeName,
      themeLabel: (sh.theme && sh.theme.name) || null,
      source: manualFields.length && manualFields.length === Object.keys(selectors).length ? "manual" : "live_auto",
      selectors: selectors, manual: manualFields,
    };
    const r = await window.NaviCssSelectorTier2.saveResult(payload);
    const ok = !!(r && r.ok);
    selCheckState.saveState = ok ? "saved" : "failed";
    selCheckState.saveError = ok ? "" : ((r && r.error) || "network");
    if (ok) { result.savedOnce = true; selCheckWriteCache(result); selCheckLog("saved", { fields: Object.keys(selectors), manual: manualFields }); }
    if (!ok) selCheckLog("error", { where: "save", reason: selCheckState.saveError });
    selCheckRender();
    if (ok && selCheckState.ctx) selCheckState.ctx.toast("Sent to your Navi+ admin ✓");
  };

  const selCheckRenderNote = () => {
    const note = selCheckState.host && selCheckState.host.querySelector("[data-part='save-note']");
    if (!note) return;
    const map = {
      saving: "Sending to your Navi+ admin…",
      saved: "✓ Sent to your Navi+ admin — your onboarding page updates by itself.",
      failed: "⚠️ Could not send — try Save again, or copy the selectors above into your Navi+ admin.",
    };
    /* Lỗi Save trước đây chỉ hiện đúng 1 câu chung chung ⇒ không biết vì sao (server từ chối Origin?
       shop lạ? selector không hợp lệ? mất mạng?) nên không sửa được gì, kể cả khi tự test. Server đã
       trả `error` rõ ràng (ajax.cssSelectorSave.php) và client đã giữ ở selCheckState.saveError —
       in kèm ra cho thấy, và log ra console debug để đọc lại được cả khi popup đã đóng. */
    let html = map[selCheckState.saveState] || "";
    if (selCheckState.saveState === "failed" && selCheckState.saveError) {
      html += ` <span class="dm-sc-errcode">(${selCheckEsc(String(selCheckState.saveError))})</span>`;
      _navidebug("[selcheck] save failed:", selCheckState.saveError);
    }
    note.innerHTML = html;
  };

  /* 1 dòng spot: [dot] Label — hint · "Navi+ can: …" · selector chip + Show/Copy/Re-pick · [Try]
     Đang demo đúng spot này → card tô xanh + [Stop demo] (Khôi 2026-09-21: bỏ badge "● Demo on"). */
  const selCheckRowHtml = (f, trying, demoOn) => {
    const meta = SEL_CHECK_FIELD_META[f];
    const sel = selCheckState.result && selCheckState.result.selectors[f];
    const el = selCheckState.els[f];
    const isTrying = selCheckIsTrying(f);
    if (sel && el) {
      const r = el.getBoundingClientRect();
      // đang demo spot này thì chính demo (mode Replace) đã ẩn phần tử → không cảnh báo "Hidden" sai
      const hidden = !isTrying && !(r.width > 0 && r.height > 0);
      const tryBtn = isTrying
        ? `<button type="button" class="dm-sc-btn is-stop" data-act="stop" data-id="${f}">Stop demo</button>`
        : `<button type="button" class="dm-sc-btn is-primary" data-act="try" data-id="${f}">Try menu</button>`;
      return `<div class="dm-sc-row" data-found="1" data-trying="${isTrying ? 1 : 0}" style="--sc-color:${meta.color}">
        <div class="dm-sc-row-head"><b class="dm-sc-name" data-act="show" data-field="${f}" title="Click to show on the page"><i class="dm-sc-ic ${meta.icon}"></i>${meta.label}</b><span style="flex:1"></span>${tryBtn}</div>
        <div class="dm-sc-hint">${selCheckEsc(meta.hint)}</div>
        <div class="dm-sc-sel"><code data-act="copy" data-field="${f}" title="Click to copy"><span>${selCheckEsc(sel)}</span><i class="ri-file-copy-line"></i></code></div>
        ${hidden ? `<div class="dm-sc-warn">${selCheckEsc(meta.hiddenNote || "Hidden at this screen size — usually shows on mobile only.")}</div>` : ""}
      </div>`;
    }
    return `<div class="dm-sc-row" data-found="0">
      <div class="dm-sc-row-head"><b><i class="dm-sc-ic ${meta.icon}"></i>${meta.label}</b><span style="flex:1"></span>
        <button type="button" class="dm-sc-btn" data-act="pick" data-field="${f}">Pick it</button></div>
      <div class="dm-sc-hint">${selCheckEsc(meta.hint)}</div>
      <div class="dm-sc-warn">Your ${selCheckEsc(meta.what)} wasn't found automatically — point at it yourself.</div>
    </div>`;
  };
  const selCheckZoneRowHtml = (z, trying, demoOn) => {
    const zone = SEL_CHECK_ZONES[z];
    if (zone.needs && !selCheckState.els[zone.needs]) return ""; // Icon Menu cần spot Header
    const isTrying = selCheckIsTrying(z);
    const tryBtn = isTrying
      ? `<button type="button" class="dm-sc-btn is-stop" data-act="stop" data-id="${z}">Stop demo</button>`
      : `<button type="button" class="dm-sc-btn is-primary" data-act="try" data-id="${z}">Try menu</button>`;
    return `<div class="dm-sc-row" data-found="1" data-trying="${isTrying ? 1 : 0}" style="--sc-color:#6b7280">
      <div class="dm-sc-row-head"><b><i class="dm-sc-ic ${zone.icon}"></i>${zone.label}</b><span style="flex:1"></span>${tryBtn}</div>
      <div class="dm-sc-hint">${selCheckEsc(zone.hint)}</div>
    </div>`;
  };

  /* Vẽ lại toàn bộ host từ selCheckState (re-render cả cụm mỗi lần đổi trạng thái — nội dung nhỏ,
     rẻ hơn hẳn việc vá từng nút). Nút bind bằng delegation 1 lần ở selCheckMountInto(). */
  const selCheckRender = () => {
    const host = selCheckState.host;
    if (!host) return;
    const foundCount = SEL_CHECK_SHOWN_FIELDS.filter((f) => selCheckState.els[f]).length;
    const trying = selCheckTryingSet();
    const demoOn = selCheckIsDemoOn();

    /* Demo đang bật (link demo trực tiếp / trang khác không có spot) → luôn có dòng "Demo menu · Stop demo"
       ở mọi trạng thái Home — màn Try Navi+ Menus cũ không còn, đây là chỗ duy nhất tắt demo. */
    const orphanDemoLine = (demoOn && !SEL_CHECK_SHOWN_FIELDS.concat(Object.keys(SEL_CHECK_ZONES)).some((id) =>
      trying.indexOf(id) !== -1 && (selCheckState.els[id] || SEL_CHECK_ZONES[id])))
      ? `<div class="dm-sc-row" data-found="1" data-trying="1"><div class="dm-sc-row-head"><b>Demo menu</b><span style="flex:1"></span>
          <button type="button" class="dm-sc-btn is-stop" data-act="stop" data-id="">Stop demo</button></div>
          <div class="dm-sc-hint">demo menus are showing on this page — click EDIT / ADD MENU on any of them</div></div>`
      : "";
    // menu Replace thật của khách đang tạm ngưng trên tab này (xem selCheckSuspendReplacedTheme)
    const pausedLine = selCheckState.suspended.length
      ? `<div class="dm-sc-banner"><b class="dm-sc-banner-title">Your live menu is paused on this tab</b>
          It replaces part of your theme, so we hid it here to show your theme's own header. Your visitors still see it as usual.</div>`
      : "";
    if (selCheckState.view === "idle") {
      /* Khôi 2026-09-21: hình minh hoạ tối giản (SVG tự chứa) — icon kính lúp + vài vệt xám. */
      host.innerHTML = `${pausedLine}${orphanDemoLine}
        <div class="dm-sc-idle">
        <svg class="dm-sc-hero" viewBox="0 0 300 80" aria-hidden="true">
          <rect x="20" y="16" width="70" height="8" rx="4" fill="#e5e7eb"/>
          <rect x="30" y="36" width="60" height="8" rx="4" fill="#e5e7eb"/>
          <rect x="20" y="56" width="80" height="8" rx="4" fill="#e5e7eb"/>
          <rect x="210" y="16" width="70" height="8" rx="4" fill="#e5e7eb"/>
          <rect x="210" y="36" width="60" height="8" rx="4" fill="#e5e7eb"/>
          <rect x="200" y="56" width="80" height="8" rx="4" fill="#e5e7eb"/>
          <circle cx="146" cy="36" r="18" fill="none" stroke="#111827" stroke-width="3.5"/>
          <line x1="159" y1="49" x2="176" y2="66" stroke="#111827" stroke-width="5" stroke-linecap="round"/>
        </svg>
        <div class="dm-sc-title">Where does your menu go?</div>
        <div class="dm-sc-intro">Find where a menu can go on this page, then try one right there.</div>
        <button type="button" class="dm-sc-btn is-primary is-big" data-act="find">Detect menu spots</button>
        </div>`;
      return;
    }
    if (selCheckState.view === "scanning") {
      host.innerHTML = `<div class="dm-sc-title">Looking for your menu…</div>
        <div class="dm-sc-intro">Scanning this page, a few seconds.</div>`;
      return;
    }

    /* Khôi 21/09: bỏ dòng tiêu đề "Found 4/4 menu spots · Dawn" — thừa, 3 nhóm bên dưới đã đủ. */
    const extraFound = SEL_CHECK_NOTE_FIELDS.filter((f) => selCheckState.els[f]).map((f) => SEL_CHECK_FIELD_META[f].label.toLowerCase());
    const extraNote = extraFound.length
      ? `<div class="dm-sc-note">Also spotted your ${selCheckEsc(extraFound.join(" and "))} — saved, so a Navi+ menu item can open ${extraFound.length > 1 ? "them" : "it"} later.</div>`
      : "";
    const intro = foundCount
      ? ""
      : `<div class="dm-sc-banner"><b class="dm-sc-banner-title">We couldn't spot your menu on this page.</b>
          Point at it yourself with <b>Pick it</b> below — or <a href="mailto:${SEL_CHECK_SUPPORT_EMAIL}?subject=${encodeURIComponent("Navi+ can't find my menu on " + location.hostname)}">ask us</a> and we'll set it up for you.</div>`;
    /* Demo đang bật nhưng không thuộc spot/zone nào trên trang này (khách lướt sang trang khác có
       DOM khác) → vẫn phải có chỗ Stop. */
    const demoLine = orphanDemoLine;

    const groupsHtml = SEL_CHECK_GROUPS.map((g) => `<div class="dm-sc-sub">${selCheckEsc(g.title)}</div>`
      + g.fields.map((f) => selCheckRowHtml(f, trying, demoOn)).join("")
      + g.zones.map((z) => selCheckZoneRowHtml(z, trying, demoOn)).join("")).join("");
    host.innerHTML = `${pausedLine}${intro}${demoLine}
      ${groupsHtml}
      ${extraNote}
      ${foundCount && window.Shopify && window.Shopify.shop ? `<div class="dm-sc-actions"><button type="button" class="dm-sc-btn is-primary is-big" data-act="save"${selCheckState.saveState === "saving" ? " disabled" : ""}>${selCheckState.saveState === "saved" ? "Saved ✓ — Save again" : (selCheckState.saveState === "saving" ? "Sending…" : "Save to Navi+ admin")}</button></div>` : ""}
      <div class="dm-sc-note" data-part="save-note"></div>
      <div class="dm-sc-note"><button type="button" class="dm-sc-btn is-link" data-act="find">Detect again</button></div>`;
    selCheckRenderNote();
  };

  /* Thanh hướng dẫn nổi dưới màn hình trong lúc pick — panel Navi+ Live tự thu nhỏ để không che
     trang (khách cần click THẲNG lên header/nav thật). */
  const selCheckShowPickBar = (field) => {
    const meta = SEL_CHECK_FIELD_META[field];
    let bar = document.getElementById(SEL_CHECK_PICKBAR_ID);
    if (!bar) {
      bar = document.createElement("div");
      bar.id = SEL_CHECK_PICKBAR_ID;
      document.body.appendChild(bar);
    }
    bar.innerHTML = `<b>Click on your ${selCheckEsc(meta.what)} on the page</b>
      <div class="dm-sc-pick-hint">Hover to preview · ↑ widen to its container · ↓ narrow · Esc to cancel</div>
      ${selCheckState.pickError ? `<div class="dm-sc-pick-err">${selCheckEsc(selCheckState.pickError)}</div>` : ""}
      <button type="button" data-act="cancel-pick">Cancel</button>`;
    bar.querySelector("[data-act='cancel-pick']").addEventListener("click", selCheckCancelPick);
  };
  const selCheckHidePickBar = () => {
    const bar = document.getElementById(SEL_CHECK_PICKBAR_ID);
    if (bar) bar.remove();
  };

  /* Mở qua link admin kèm &navipick=<field> (BE không dò ra field đó) — Khôi 22/09: "phải nhận ra ngay chứ nhỉ".
     Trước: vào thẳng pick mode bắt khách tự bấm. Giờ: Detect trước (theme DB + heuristic — cùng đường Detect
     thường), nhận ra thì cuộn tới + vẽ khung + thanh hỏi "đúng cái này không?" → [Yes, save] gửi luôn về admin;
     [Not this one] mới sang pick tay. Không nhận ra → pick tay như cũ. */
  const selCheckShowConfirmBar = (field) => {
    const meta = SEL_CHECK_FIELD_META[field];
    let bar = document.getElementById(SEL_CHECK_PICKBAR_ID);
    if (!bar) {
      bar = document.createElement("div");
      bar.id = SEL_CHECK_PICKBAR_ID;
      document.body.appendChild(bar);
    }
    bar.innerHTML = `<b>We found your ${selCheckEsc(meta.what)} — it's outlined on the page</b>
      <div class="dm-sc-pick-hint">Is that the right one?</div>
      <div class="dm-sc-confirm-btns">
        <button type="button" class="is-primary" data-act="confirm-yes">Yes, save it</button>
        <button type="button" data-act="confirm-no">Not this one — I'll pick it</button>
      </div>`;
    bar.querySelector("[data-act='confirm-yes']").addEventListener("click", async () => {
      selCheckLog("autopick_confirmed", { field });
      selCheckHidePickBar();
      selCheckState.focusField = null;
      await selCheckSave();
      selCheckRenderFrames();
      if (selCheckState.ctx) selCheckState.ctx.open();
    });
    bar.querySelector("[data-act='confirm-no']").addEventListener("click", () => {
      selCheckLog("autopick_rejected", { field });
      selCheckHidePickBar();
      selCheckState.focusField = null;
      selCheckRenderFrames(); // bỏ khung của cái khách vừa từ chối, không thì nó vẫn viền trong lúc pick tay
      selCheckStartPick(field);
    });
  };
  const selCheckAutoPick = async (field) => {
    await selCheckRunFind();
    if (!selCheckState.els[field]) {
      selCheckLog("autopick_miss", { field });
      selCheckStartPick(field);
      return;
    }
    selCheckLog("autopick_hit", { field, selector: selCheckState.result.selectors[field] });
    selCheckState.focusField = field;
    selCheckRenderFrames();
    if (selCheckState.ctx) selCheckState.ctx.minimize(); // panel thu nhỏ để khách nhìn thấy khung trên trang
    selCheckScrollTo(field);
    selCheckShowConfirmBar(field);
  };

  /* Tầng 3 — Navi+ Finder pick mode cho 1 field. Selector sinh bằng chính thuật toán Tầng 2
     (getStableSelector — luôn kiểm unique), rồi lưu + vẽ khung + cập nhật override cho Try. */
  const selCheckStartPick = (field) => {
    selCheckLog("pick_started", { field });
    selCheckState.picking = field;
    Object.keys(selCheckState.frames).forEach((f) => { selCheckState.frames[f].style.opacity = "0"; });
    selCheckPositionFrames(); // ẩn khung ma trong lúc pick
    if (selCheckState.ctx) selCheckState.ctx.minimize();
    selCheckShowPickBar(field);
    const onKey = (e) => {
      if (e.key !== "Escape") return;
      e.preventDefault(); e.stopPropagation();
      selCheckCancelPick();
    };
    document.addEventListener("keydown", onKey, { capture: true });
    selCheckState._pickKeyHandler = onKey;
    enableInspectorForPick((el) => {
      document.removeEventListener("keydown", onKey, { capture: true });
      selCheckState._pickKeyHandler = null;
      selCheckState.picking = null;
      disableInspector();
      /* Chọn trúng chính menu Navi+ đang render (khách đã có menu / demo) → không phải vị trí của
         theme — từ chối và mở lại pick mode kèm lý do, thay vì lưu 1 selector vô nghĩa. */
      if (window.NaviCssSelectorTier2 && window.NaviCssSelectorTier2.isNaviOwn(el)) {
        selCheckState.pickError = "That's a Navi+ menu. Pick a part of your theme instead (press ↑ to widen if needed).";
        selCheckStartPick(field);
        return;
      }
      selCheckState.pickError = "";
      selCheckHidePickBar();
      /* Pick trả phần tử nhỏ nhất (svg/path/span) → leo lên nav/button/header có nghĩa; không dựng được
         selector unique thì báo và mở lại pick (không lưu selector khớp 2-3 phần tử). */
      const T2 = window.NaviCssSelectorTier2;
      const picked = T2 ? T2.normalizePick(el, field) : el;
      const selector = T2 ? T2.getStableSelector(picked) : null;
      if (!selector) {
        selCheckState.pickError = "Couldn't build a unique selector for that element. Press ↑ to widen, then pick again.";
        selCheckStartPick(field);
        return;
      }
      const result = selCheckState.result || { source: "manual", theme: null, themeName: null, selectors: {} };
      if (selector) {
        result.selectors = Object.assign({}, result.selectors, { [field]: selector });
        result.manual = (result.manual || []).filter((x) => x !== field).concat([field]); // spot này do khách chỉ → Save gửi source "manual"
        selCheckState.saveState = ""; // kết quả đổi → chưa Save
      }
      selCheckState.result = result;
      selCheckState.els = selCheckResolveEls(result.selectors);
      selCheckState.view = "result";
      selCheckWriteCache(result);
      selCheckRenderFrames();
      selCheckRender();
      if (selCheckState.ctx) selCheckState.ctx.open();
    });
  };
  const selCheckCancelPick = () => {
    if (selCheckState._pickKeyHandler) {
      document.removeEventListener("keydown", selCheckState._pickKeyHandler, { capture: true });
      selCheckState._pickKeyHandler = null;
    }
    selCheckState.picking = null;
    selCheckState.pickError = "";
    cancelInspectorPick();
    selCheckHidePickBar();
    selCheckRender();
    selCheckPositionFrames();
    if (selCheckState.ctx) selCheckState.ctx.open();
  };

  /* "Try" tại 1 spot/zone. Spot kiểu "click" (search/cart icon) → bấm thử chính icon đó để khách
     thấy panel theme mở ra (một menu item Navi+ làm đúng việc này khi tap). Còn lại → demo Try Navi+
     menus (DemoMarket, pipeline production) chỉ với ĐÚNG menu hợp spot đó (createDebugUI.tryAt:
     ẩn các menu demo khác, đặt mode replace/after, rồi renderTryMenusDemo() = reload sang URL demo).
     Sau reload Home vẽ lại từ cache + dòng đang demo có nút Stop. */
  const selCheckTry = (id) => {
    if (!selCheckState.ctx) return;
    const meta = SEL_CHECK_FIELD_META[id];
    if (meta && meta.try === "click") {
      const el = selCheckState.els[id];
      if (!el) return;
      selCheckScrollTo(id);
      window.setTimeout(() => { try { el.click(); } catch (e) {} }, 400);
      return;
    }
    if (selCheckState.result) selCheckWriteCache(selCheckState.result);
    selCheckLog("try", { spot: id });
    /* Thêm vào tập đang thử. 2 spot dùng CÙNG 1 menu demo (Header & Main menu → megad; Hamburger &
       Logo → slide) không thể cùng hiện → spot mới thay spot cũ cùng key. */
    const before = selCheckTryingSet();
    const candidate = before.filter((x) => x !== id).concat([id]);
    const myKey = selCheckState.ctx.keyFor(id, candidate);
    /* Hamburger + Logo = CÙNG 1 Mobile Menu, 2 chỗ mở (trigger hamburger + icon cạnh logo) → đi
       song song: menu đã bật rồi thì KHÔNG hỏi mẫu nữa, chỉ thêm trigger (Khôi 2026-09-20).
       Header + Main menu: song song (Khôi chốt) — keyFor tự tách Header sang megam khi Main menu
       cùng có mặt, nên không đụng key nhau. */
    const sameMenuAlreadyOn = selCheckIsDemoOn() && before.some((x) => x !== id && selCheckState.ctx.keyFor(x, candidate) === myKey);
    if (myKey === "slide" && sameMenuAlreadyOn) {
      selCheckWriteTryingSet(candidate);
      selCheckState.ctx.reapply(candidate);
      return;
    }
    const ids = candidate.filter((x) => x === id || selCheckState.ctx.keyFor(x, candidate) !== myKey);
    selCheckWriteTryingSet(ids);
    // popup "Choose a template" mở ra; đóng mà không Apply → trả tập về như trước, vẽ lại Home
    selCheckState.ctx.tryAt(id, ids, () => {
      selCheckLog("try_cancel", { spot: id });
      selCheckWriteTryingSet(before);
      selCheckState.ctx.syncHidden(before);
      selCheckRender();
      selCheckPositionFrames();
    });
  };
  /* Stop 1 spot (id) hoặc tất cả (id rỗng). */
  const selCheckStop = (id) => {
    selCheckLog("stop", { spot: id || "all" });
    const remaining = id ? selCheckTryingSet().filter((x) => x !== id) : [];
    selCheckWriteTryingSet(remaining);
    if (selCheckState.ctx) selCheckState.ctx.stopTry(id, remaining);
    selCheckRender();
    selCheckPositionFrames();
  };

  /* Tầng 2 thật sự: tải theme DB (brute-force trên DOM sống) → heuristic → lưu + vẽ khung. */
  const selCheckRunFind = async () => {
    selCheckLog("detect_started");
    selCheckRemoveFrames();
    selCheckState.view = "scanning";
    selCheckRender();
    selCheckLog("detect_started", {});
    let themeDb = null;
    try {
      /* timeout 6s — CDN chậm/bị chặn thì rơi về heuristic thay vì quay mãi ở "Looking for your menu…" */
      const ctl = typeof AbortController !== "undefined" ? new AbortController() : null;
      const timer = ctl ? setTimeout(() => ctl.abort(), 6000) : null;
      const res = await fetch(CSS_SELECTOR_CHECK_THEME_DB_URL, { credentials: "omit", signal: ctl ? ctl.signal : undefined });
      if (timer) clearTimeout(timer);
      themeDb = await res.json();
    } catch (e) {
      /* kho theme DB tải lỗi (mạng/CORS/timeout) — vẫn chạy tiếp Tầng 2b (heuristic thuần DOM), không chặn */
    }
    let found = null;
    try {
      found = window.NaviCssSelectorTier2 ? window.NaviCssSelectorTier2.runTier2(themeDb) : null;
    } catch (e) {
      /* 1 exception trong heuristic không được giết cả panel (báo cáo 28 §6) */
      selCheckLog("error", { where: "detect", reason: String((e && e.message) || e).slice(0, 200) });
    }
    selCheckState.result = found && found.selectors
      ? { source: found.source, theme: found.theme, themeName: found.themeName, selectors: found.selectors, manual: [] }
      : { source: "manual", theme: null, themeName: null, selectors: {}, manual: [] };
    selCheckState.els = selCheckResolveEls(selCheckState.result.selectors);
    selCheckState.view = "result";
    selCheckState.saveState = ""; // hợp đồng BE: KHÔNG tự lưu — khách xem/thử rồi bấm Save
    selCheckWriteCache(selCheckState.result); // cache kể cả rỗng — để zone Tab Bar/FAB vẫn thử được sau reload
    selCheckRenderFrames();
    selCheckRender();
    const foundFields = Object.keys(selCheckState.els);
    if (!foundFields.length) selCheckLog("not_found", { source: selCheckState.result.source });
    else selCheckLog("detected", { source: selCheckState.result.source, theme: selCheckState.result.theme, fields: foundFields });
  };

  /* Gọi từ createDebugUI() mỗi lần dựng panel (mỗi lần load trang có debug mode). ctx = các hook vào
     closure của createDebugUI. Có cache (đã Find trong tab này) → hiện kết quả ngay + vẽ lại khung;
     có cờ autorun (admin mở link ?naviselectorcheck=1) → tự Find 1 lần rồi xoá cờ. */
  const selCheckMountInto = (host, ctx) => {
    ensureCssSelectorCheckStyle();
    selCheckState.host = host;
    selCheckState.ctx = ctx;
    host.classList.add("dm-sc");
    host.addEventListener("click", (e) => {
      const btn = e.target.closest && e.target.closest("[data-act]");
      if (!btn) return;
      const act = btn.getAttribute("data-act");
      const field = btn.getAttribute("data-field");
      if (act === "find") {
        if (selCheckIsDemoOn()) selCheckStop(""); // Find lại khi đang demo → tắt demo trước (reload), tránh dò trúng menu demo
        else selCheckRunFind();
      } else if (act === "show") {
        selCheckScrollTo(field);
      } else if (act === "copy") {
        selCheckCopy((selCheckState.result && selCheckState.result.selectors[field]) || "", btn);
      } else if (act === "pick") {
        selCheckStartPick(field);
      } else if (act === "try") {
        btn.disabled = true;
        selCheckTry(btn.getAttribute("data-id"));
      } else if (act === "stop") {
        btn.disabled = true; btn.textContent = "Stopping…";
        selCheckStop(btn.getAttribute("data-id") || "");
      } else if (act === "save") {
        selCheckSave();
      }
    });

    selCheckSuspendReplacedTheme(); // header gốc phải hiện trước khi đọc cache/Detect/pick
    const cached = selCheckReadCache();
    if (cached) {
      selCheckState.result = cached;
      selCheckState.els = selCheckResolveEls(cached.selectors);
      selCheckState.view = "result";
      selCheckState.saveState = cached.savedOnce ? "saved" : ""; // reload demo không làm mất trạng thái "đã Save"
      selCheckRenderFrames();
      selCheckRender();
    } else {
      selCheckState.view = "idle";
      selCheckRender();
    }
    // Mở qua link admin: log "opened" 1 lần; &navipick=<field> → vào thẳng pick spot đó (không tự Detect)
    if (safeSessionStorage.get(SEL_CHECK_OPENED_SESSION_KEY) === "1") {
      safeSessionStorage.remove(SEL_CHECK_OPENED_SESSION_KEY);
      selCheckLog("opened", { navipick: safeSessionStorage.get(SEL_CHECK_NAVIPICK_SESSION_KEY) || "" });
    }
    const navipick = safeSessionStorage.get(SEL_CHECK_NAVIPICK_SESSION_KEY);
    if (navipick) {
      safeSessionStorage.remove(SEL_CHECK_NAVIPICK_SESSION_KEY);
      if (SEL_CHECK_FIELD_META[navipick]) {
        if (!selCheckState.result) { selCheckState.result = { source: "manual", theme: null, themeName: null, selectors: {}, manual: [] }; selCheckState.view = "result"; }
        window.setTimeout(() => selCheckAutoPick(navipick), 600); // chờ panel mở xong → Detect, nhận ra thì hỏi, không thì pick tay
      } else if (navipick === "custom" && selCheckState.ctx && selCheckState.ctx.openFinder) {
        // TASK01021 — BE khối Advanced "Pick it in Live mode": không phải spot nào, mở Navi+ Finder tự do (hover → Copy)
        window.setTimeout(() => selCheckState.ctx.openFinder(), 600);
      }
    }
  };

  /* Dọn khi createDebugUI() cleanup (Turn off Navi+ Live) — khung/thanh pick không được ở lại trên
     site khách sau khi tắt Live mode. Cache kết quả GIỮ (sessionStorage) để bật lại là thấy ngay. */
  const selCheckUnmount = () => {
    if (selCheckState.picking) selCheckCancelPick();
    selCheckRemoveFrames();
    selCheckHidePickBar();
    // Turn off Live = rời luồng tìm chỗ → menu Replace thật hiện lại, cờ engaged xoá
    selCheckState.focusField = null;
    selCheckRestoreReplacedTheme();
    safeSessionStorage.remove(SEL_CHECK_ENGAGED_SESSION_KEY);
    selCheckState.host = null;
    selCheckState.ctx = null;
  };

  /* Admin (welcome.php Bước 2) mở tab kèm ?naviselectorcheck=1[&navipick=<field>] → bật Navi+ Live, mở
     panel ở Home (KHÔNG tự Detect — hợp đồng BE); có navipick thì vào thẳng pick. Cùng khuôn
     bootstrapScanDirectLink. */
  const bootstrapCssSelectorCheckDirectLink = () => {
    if (!isCssSelectorCheckDirectLinkActive()) return;
    // Debug mode đã bật sẵn trong tab (mở link lần 2) vẫn phải mở Home — link này giờ là lối vào DUY NHẤT
    // từ admin (View Demo / See Demo / Try templates đều trỏ về đây, 2026-09-21).
    safeSessionStorage.set(debugModeStorageKey, "true");
    /* Cờ demo cũ (localStorage "_naviplus_try_menus_demo_on"="1" từ lần bật 5 menu trước, chưa Turn off)
       sẽ tự kéo lại demo 5 menu ở trang thường (restoreTryMenusDemoIfNeeded) → Home hiện "Demo menu"
       không rõ từ đâu. Mở link mới = bắt đầu sạch: bỏ cờ khi không có spot nào đang thử. */
    if (!selCheckTryingSet().length) safeLocalStorage.set("_naviplus_try_menus_demo_on", "0");
    safeSessionStorage.set(welcomeDismissedStorageKey, "1");
    safeSessionStorage.set(SEL_CHECK_OPENED_SESSION_KEY, "1");
    safeSessionStorage.set(SEL_CHECK_ENGAGED_SESSION_KEY, "1");
    try {
      const pick = new URLSearchParams(window.location.search).get("navipick") || "";
      if (pick) safeSessionStorage.set(SEL_CHECK_NAVIPICK_SESSION_KEY, pick);
    } catch (e) {}
    syncDebugUIWithDebugMode();
    if (debugUIController) debugUIController.forceHomeAndOpen();
  };

  onReady(() => {
    seedSelCheckFromUrl();
    bootstrapTryMenusDirectLink();
    // TASK00516 — cùng cơ chế, kịch bản scan menu từ website (link naviscan=1)
    bootstrapScanDirectLink();
    // cùng cơ chế, kịch bản "Kiểm tra Selector" (link naviselectorcheck=1)
    bootstrapCssSelectorCheckDirectLink();


    const handleHash = () => {
      const { sawOn, sawOff, sawAutoDetect } = applyDebugModeFromHash();

      if (sawOff) {
        disableInspector();
        // TASK00405 — PHẢI gọi TRƯỚC disableDebugUI(): disableDebugUI() set debugUIController=null,
        // gọi sau sẽ luôn no-op (đã xảy ra thật — demo bị bỏ sót, kẹt lại trên site KH sau #navidebug-off).
        if (debugUIController && typeof debugUIController.tryMenusTeardownForDebugOff === "function") {
          debugUIController.tryMenusTeardownForDebugOff();
        }
        disableDebugUI();
        disableTurnedOffNotice();
        turnedOffController = createTurnedOffNotice();
        turnedOffController.openModal();
        return;
      }

      disableTurnedOffNotice();

      syncInspectorWithDebugMode();
      syncDebugUIWithDebugMode();
      // TASK00405 — chỉ tự bật lại demo khi debug mode đang ON
      if (debugUIController && typeof debugUIController.tryMenusRestoreIfNeeded === "function") {
        debugUIController.tryMenusRestoreIfNeeded();
      }

      if (sawOn && debugUIController) {
        // URL đang đúng phiên demo Try Navi+ menus (vd popup "Click to open Mobile
        // popup", QR quét điện thoại, hoặc bất kỳ link nào mang #navidebug-on + đúng query
        // test/domain/token) → set sẵn state panel = "Try Navi+ menus" (không phải home), dù panel
        // đang hiện hay đang minimize — mở lại sau (bấm nút nổi) sẽ vào thẳng đúng màn.
        // isTryMenusDirectLinkActive() dùng chung điều kiện y hệt isTryMenusDemoActiveNow() bên trong
        // createDebugUI() (không import chéo qua ranh giới closure được — xem comment tại định nghĩa).
        // Demo bật từ Home "Kiểm tra Selector" (Try theo spot) → ở lại Home (có Stop ngay trên dòng spot),
        // không nhảy sang màn Try Navi+ Menus cũ.
        // Khôi 2026-09-21: màn Try Navi+ Menus cũ đã bỏ hẳn — link demo cũng ở lại Home mới.
        // Khôi: xem trên viewport MOBILE (popup 375×812, QR điện thoại thật, browser resize xuống
        // mobile) → panel phải MINIMIZE ngay thay vì mở full — panel rộng min-width:320px gần như che
        // kín màn hình mobile nhỏ, không thấy được menu demo thật đang render trên trang. Debug mode
        // vẫn BẬT (chỉ ẩn UI panel), demo vẫn hiện bình thường qua tryMenusRestoreIfNeeded() ở trên
        // (độc lập trạng thái panel). Desktop giữ nguyên hành vi cũ: mở panel full.
        const isMobileViewport = window.matchMedia && window.matchMedia("(max-width: 768px)").matches;
        if (isMobileViewport && typeof debugUIController.minimizePanel === "function") {
          debugUIController.minimizePanel();
        } else if (typeof debugUIController.openModal === "function") {
          debugUIController.openModal();
        }
      }

      /* Có navicheck trong deeplink → tự kiểm selector (chờ theme/menu render) */
      if (sawOn) {
        const _chk = naviCheckParse();
        if (_chk) setTimeout(function () { naviCheckRun(_chk); }, 600);
      }

      /* TASK01052 (Khôi 23/09) — hash "&autodetect=1" (nút "Navi+ Live" ở admin) → tự bấm hộ
         "Detect menu spots" 1 LẦN cho tab này (cờ session chặn lặp lại mỗi hashchange). Panel Home
         đã tự mở ở khối `sawOn && debugUIController` phía trên — đợi 600ms cho panel dựng xong rồi
         mới gọi, cùng nhịp với selCheckAutoPick/openFinder (navipick) ở bootstrapCssSelectorCheckDirectLink().
         Đang demo dở 1 spot (selCheckIsDemoOn()) → dừng demo trước như đúng hành vi nút bấm tay
         (xem selCheckMountInto: act === "find"), không Detect chồng lên demo đang chạy. */
      if (sawOn && sawAutoDetect && debugUIController && safeSessionStorage.get(SEL_CHECK_AUTORUN_SESSION_KEY) !== "1") {
        safeSessionStorage.set(SEL_CHECK_AUTORUN_SESSION_KEY, "1");
        setTimeout(function () {
          if (selCheckIsDemoOn()) selCheckStop(""); else selCheckRunFind();
        }, 600);
      }
    };

    handleHash();
    window.addEventListener("hashchange", handleHash);
  });
})();

/**
 * TASK01016 (khởi tạo dưới TASK01003, tách task 2026-09-20) — "Kiểm tra Selector" · Tầng 2: chạy
 * CLIENT-SIDE trên site THẬT của khách (bắt được cả
 * nội dung JS chèn sau khi tải trang — khác Tầng 1 ở backend chỉ đọc HTML tĩnh qua HTTP).
 *
 * File RIÊNG, không viết trực tiếp vào `livemode.js` (6849 dòng, chạy live cho 2000+ khách) — giảm
 * rủi ro đụng vào logic đang chạy. `getStableSelector()` dưới đây CỐ Ý viết lại (không import từ
 * `createInspector()` trong livemode.js — hàm đó là closure private, không export ra ngoài), cùng
 * tinh thần `smartDesign/source.php` cố ý không dùng lại `Shopify::fetchMenus()` của app. Thuật
 * toán giữ Y HỆT: ưu tiên #id → .class (tối đa 3 lớp) → tag+class → fallback path nth-of-type, luôn
 * kiểm `isUnique()` trước khi chấp nhận.
 *
 * Xem docs/decisions/css-selector-check-feature.md cho spec đầy đủ.
 */
(function (global) {
  'use strict';

  const cssEscape =
    typeof CSS !== 'undefined' && typeof CSS.escape === 'function'
      ? CSS.escape.bind(CSS)
      : (value) => String(value).replace(/[^a-zA-Z0-9_-]/g, '\\$&');

  function isUnique(selector, element) {
    try {
      const found = document.querySelectorAll(selector);
      return found.length === 1 && found[0] === element;
    } catch {
      return false;
    }
  }

  function normalizeClasses(className) {
    if (!className || typeof className !== 'string') return [];
    return className.split(/\s+/g).map((c) => c.trim()).filter(Boolean);
  }

  /* Class TRẠNG THÁI / utility (is-sticky, scrolled, menu-open, md:flex, css-1x2y3z…) đúng lúc Detect
     nhưng sai lúc render (báo cáo 28 §3) → không bao giờ đưa vào selector. Class chứa header|nav|menu|logo
     được ưu tiên lên đầu để 3 lớp đầu là lớp có nghĩa. */
  const STATE_CLASS_RE = /^(is-|js-|has-|no-|not-|active|open|opened|scrolled|sticky|stuck|hidden|show|shown|visible|focus|hover|animate|animated|aos|navi-|w-|h-|p-|m-|px-|py-|mx-|my-|mt-|mb-|ml-|mr-|pt-|pb-|pl-|pr-)/i;
  function usefulClasses(className) {
    const all = normalizeClasses(className).filter((c) => !STATE_CLASS_RE.test(c) && !/\d{4,}/.test(c) && !/^[a-z0-9-]+:/i.test(c) && c.length > 1);
    const meaningful = all.filter((c) => /header|nav|menu|logo|cart|search|drawer|toggle|burger/i.test(c));
    return meaningful.concat(all.filter((c) => meaningful.indexOf(c) === -1));
  }
  /* id sinh động: shopify-section-sections--123__header (đổi khi publish theme khác), :r1:/radix, chuỗi số dài */
  function isDynamicId(id) {
    return /^shopify-section-/.test(id) || /^:r|^radix|^headlessui|^\d/.test(id) || /\d{6,}/.test(id);
  }

  function segmentFor(element) {
    const tag = element.tagName.toLowerCase();
    if (element.id) {
      /* Section id của Shopify: giữ đuôi `__header` (bền qua publish) thay vì số section */
      const m = /^shopify-section-(?:sections--\d+|template--\d+)__(.+)$/.exec(element.id);
      if (m) {
        const tail = `[id$="__${cssEscape(m[1])}"]`;
        if (isUnique(tail, element)) return { segment: tail, canStop: true };
      }
      if (!isDynamicId(element.id)) {
        const id = `#${cssEscape(element.id)}`;
        if (isUnique(id, element)) return { segment: id, canStop: true };
      }
    }
    const classes = usefulClasses(element.className).slice(0, 3).map((c) => `.${cssEscape(c)}`).join('');
    let base = `${tag}${classes}`;
    if (base === tag && element.getAttribute('role')) {
      base += `[role="${cssEscape(element.getAttribute('role'))}"]`;
    }
    return { segment: base, canStop: false };
  }

  function nthOfTypeIfNeeded(element, selector) {
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
  }

  /** Sinh 1 CSS selector bền cho `element` — ưu tiên #id, rồi .class, rồi tag+class, cuối cùng path
      nth-of-type (tối đa 7 cấp), luôn xác nhận unique trước khi trả về. */
  function getStableSelector(element) {
    const segments = [];
    let current = element;
    for (let depth = 0; depth < 7 && current && current.nodeType === 1; depth += 1) {
      const { segment, canStop } = segmentFor(current);
      segments.unshift(segment);

      let candidate = segments.join(' > ');
      if (isUnique(candidate, element)) return candidate;

      const withNth = segments.slice();
      withNth[0] = nthOfTypeIfNeeded(current, withNth[0]);
      candidate = withNth.join(' > ');
      if (isUnique(candidate, element)) return candidate;

      if (canStop) break;   /* TASK01020: id anchor mà vẫn 2+ → thử tiếp lên cha thay vì trả selector không unique */
      current = current.parentElement;
    }
    /* TASK01020: không dựng được selector unique → null (khách Pick), không trả selector khớp 2-3 phần tử
       (xidaamoto: logo `[id$=…] > div.shopify-block` khớp 3) */
    const last = segments.join(' > ');
    return isUnique(last, element) ? last : null;
  }

  /** Phần tử thuộc chính menu Navi+ đang render trên site (khách đã có menu Navi+) hoặc UI của panel
      — KHÔNG bao giờ là "vị trí của theme" để chèn menu; loại khỏi mọi ứng viên tự dò lẫn dò tay
      (đã xảy ra thật khi test trên anbani2023: heuristic/pick chọn trúng thanh Mega Menu của Navi+). */
  const NAVI_OWN_SELECTOR = '.naviman_app, .naviItem, #dm_selcheck_panel, .dm-sc-frame, [id^="dm_"]';
  function isNaviOwn(el) {
    return !!(el && el.closest && el.closest(NAVI_OWN_SELECTOR));
  }

  function isVisible(el) {
    if (!el) return false;
    const r = el.getBoundingClientRect();
    if (r.width === 0 || r.height === 0) return false;
    const cs = getComputedStyle(el);
    return cs.display !== 'none' && cs.visibility !== 'hidden';   /* TASK01020: bỏ opacity — header fade-in đổi kết quả giữa 2 lần dò */
  }

  /** Loại phần tử là ancestor/descendant của phần tử khác trong cùng danh sách — giữ lại phần tử
      NGOÀI CÙNG (ancestor), vì đó là mốc ổn định hơn để chèn/thay menu. */
  function dedupeNested(list) {
    return list.filter((el, i) => !list.some((other, j) => i !== j && other !== el && other.contains(el)));
  }

  function commonAncestor(list) {
    if (list.length === 0) return null;
    if (list.length === 1) return list[0];
    let anc = list[0];
    for (let i = 1; i < list.length; i += 1) {
      while (anc && !anc.contains(list[i])) anc = anc.parentElement;
    }
    return anc;
  }

  /** RULE CỨNG (Khôi, TASK01003): không bao giờ để lại nhiều ứng viên — nhiều ứng viên thì escalate
      lên ancestor chung, không bao giờ trả mảng >1 phần tử ra ngoài. */
  /* Trần cho việc leo tổ tiên (báo cáo 28: 4/23 store ra `body` → Replace ẩn cả trang): tổ tiên chung
     KHÔNG được là html/body/main, không chứa <main>/<footer>, không cao quá nửa viewport. Vượt trần →
     trả null (để trống cho khách Pick) thay vì trả đại. */
  function isReasonableSpot(el) {
    if (!el || !el.tagName) return false;
    const tag = el.tagName.toLowerCase();
    if (tag === 'html' || tag === 'body' || tag === 'main') return false;
    if (el.querySelector('main, footer, [role="main"], [role="contentinfo"]')) return false;
    const h = el.getBoundingClientRect().height;
    if (h > Math.max(400, window.innerHeight * 0.5)) return false;
    return true;
  }
  function resolveToOne(candidates) {
    const deduped = dedupeNested(candidates.filter(Boolean));
    if (deduped.length === 0) return null;
    if (deduped.length === 1) return deduped[0];
    const anc = commonAncestor(deduped);
    return isReasonableSpot(anc) ? anc : null;
  }
  /* "Đang ở trong footer": theme hay dùng div/custom element thay <footer> (xidaamoto: nav 24 link ở
     y=4.334px được chọn làm main menu) → xét cả tag, role, class, id và VỊ TRÍ (dưới 60% chiều cao trang). */
  function isInFooterArea(el) {
    if (el.closest('footer, [role="contentinfo"], [class*="footer" i], [id*="footer" i]')) return true;
    if (el.tagName && /footer/i.test(el.tagName)) return true;
    const top = el.getBoundingClientRect().top + window.scrollY;
    const docH = Math.max(document.documentElement.scrollHeight, window.innerHeight);
    return docH > 1500 && top > docH * 0.6;
  }
  let headerCache = null;
  function findHeaderCandidates() {
    if (headerCache) return headerCache;
    const semantic = Array.from(document.querySelectorAll('header, [role="banner"]')).filter(isVisible);
    /* custom element: chỉ nhận khi bản thân nó là cả thanh header (rộng ≥60% viewport, có nav/logo hoặc ≥5
       link) — `header-actions`, `header-menu`, `header-drawer` (fourbrothers/Horizon) là CON của header, không phải header */
    const customEls = Array.from(document.querySelectorAll('*')).filter((el) => {
      if (!el.tagName.includes('-') || !/header/i.test(el.tagName) || !isVisible(el)) return false;
      if (/^header-(actions|menu|drawer|search|cart|logo|icon|button|link|item)/i.test(el.tagName)) return false;
      const r = el.getBoundingClientRect();
      return r.width >= window.innerWidth * 0.6 && (el.querySelector('nav, [class*="logo" i], a[href="/"]') || el.querySelectorAll('a[href]').length >= 5);
    });
    /* header nằm trong <main> nhưng KHÔNG ở đầu trang (heading của bài viết/sản phẩm) không phải header
       trang; theme bọc cả trang trong <main> (sourworld) thì header vẫn ở top → giữ */
    const notPageHeader = (el) => el.closest('main, [role="main"]') && (el.getBoundingClientRect().top + window.scrollY) > 200;
    headerCache = semantic.concat(customEls).filter((el) => !isNaviOwn(el) && !notPageHeader(el) && !isInFooterArea(el));
    return headerCache;
  }
  /* Header đã resolve (nếu có) — main menu / hamburger / icon chỉ tìm trong đây; không có header thì
     giới hạn trong 1/4 trên của trang. */
  function headerScope() {
    return resolveToOne(findHeaderCandidates());
  }
  function inTopArea(el) {
    const top = el.getBoundingClientRect().top + window.scrollY;
    return top < Math.max(600, window.innerHeight * 0.4);
  }

  function findMainMenuCandidates() {
    const header = headerScope();
    return Array.from(document.querySelectorAll('nav, [role="navigation"], ul[class*="menu" i], ul[class*="nav" i], div[class~="menu"], [class*="main-menu" i], [class*="main-nav" i]'))
      .filter(isVisible)
      .filter((el) => !isNaviOwn(el))
      /* trong header, hoặc thanh nav đứng ngay dưới header (watersports24: nav 79 link ở y=195 ngoài <header>) */
      .filter((el) => !isInFooterArea(el) && ((header && header.contains(el)) || inTopArea(el)))
      .filter((el) => el.querySelectorAll('a[href]').length >= 3)
      /* thanh chọn tiền tệ/ngôn ngữ (vibrantvalley: "USD JPY CAD…" 1 link) không phải menu */
      .filter((el) => !/currency|localization|language|country|social|breadcrumb|pagination/i.test((el.className || '') + ' ' + (el.id || '') + ' ' + (el.getAttribute('aria-label') || '')))
      /* overlay cookie/consent/dialog (xandres: ul.CybotCookiebotDialogNavItems) và drawer/panel cao
         (vibrantvalley: nav.mm-spn 440×900 trượt từ cạnh) không phải thanh menu */
      .filter((el) => !isOverlay(el) && el.getBoundingClientRect().height < window.innerHeight * 0.6);
  }
  function isOverlay(el) {
    return !!el.closest('[role="dialog"], [aria-modal="true"], [id*="cookie" i], [class*="cookie" i], [class*="consent" i], [id*="consent" i], [class*="popup" i], [class*="modal" i]');
  }
  /* Nhiều ứng viên: ưu tiên nhóm nằm TRONG header (div.menu trong header thắng drawer ngoài header) */
  function preferInHeader(list) {
    const header = headerScope();
    if (!header || list.length < 2) return list;
    const inside = list.filter((el) => header.contains(el));
    return inside.length ? inside : list;
  }

  /* KHÔNG lọc isVisible() ở đây — hamburger thường CHỈ hiện ở breakpoint mobile (ẩn qua CSS media
     query lúc đang xem desktop, xác nhận thật trên hafizandco.store: nút hamburger tồn tại trong
     DOM nhưng width=0 khi mở bằng viewport desktop). Dấu hiệu ngữ nghĩa (aria-label/class/
     aria-controls) đã đủ chặn false-positive mà không cần đòi hỏi đang hiện ngay lúc dò. */
  /* 3 spot PHỤ (cùng bộ 6 field với backend Tầng 1: POC_CSS_ALL_FIELDS, matcher.php) — không dùng
     để NHẬN DIỆN theme (3 field lõi ở trên đủ), chỉ để trình bày + thử: logo (chèn icon menu cạnh
     logo cho theme không có hamburger), searchIcon/cartIcon (menu item Navi+ bấm mở search/cart). */
  function findLogoCandidates() {
    const scope = headerScope() || document;
    /* TASK01020: logo trỏ root theo Shopify Markets (/fr, /en-ca) + logo chữ (a.header__heading-link > span) */
    const root = (global.Shopify && global.Shopify.routes && global.Shopify.routes.root) || '/';
    const rootSel = root !== '/' ? `, a[href="${root}"], a[href="${root.replace(/\/$/, '')}"]` : '';
    return Array.from(scope.querySelectorAll('a[href="/"], a[href^="/?"], [class*="logo" i] a, a[class*="logo" i], a[class*="heading-link" i], h1 a' + rootSel))
      .filter(isVisible)
      .filter((el) => !isNaviOwn(el))
      .filter((el) => el.querySelector('img, svg') || /logo|heading/i.test((el.className || '').toString()))
      .filter((el) => el.getBoundingClientRect().width < 600);   /* TASK01020: dermaskin logo = div 1.412px */
  }
  /* Icon search/cart: CHỈ tìm trong header (icon ở đó mới là "nút mở panel" — nút "Add to cart" của
     sản phẩm, nút đóng/clear trong modal cũng khớp chữ cart/search nên phải loại), phải đang hiện
     (theme thường có 2 bản mobile/desktop, chỉ 1 bản hiện ở breakpoint hiện tại). */
  function findIconCandidates(kind) {
    const scope = headerScope() || document;
    const re = kind === 'search' ? /search/i : /cart|bag|basket/i;
    const hrefRe = kind === 'search' ? /^\/search/ : /^\/cart/;
    const junk = /add|quick|close|reset|clear|remove|checkout|submit/i;
    return Array.from(scope.querySelectorAll('a, button, [role="button"], summary'))
      .filter((el) => !isNaviOwn(el) && !el.closest('footer') && isVisible(el))
      .filter((el) => {
        const label = el.getAttribute('aria-label') || el.getAttribute('title') || '';
        const cls = (el.className || '').toString();
        const href = el.getAttribute('href') || '';
        if (junk.test(cls) || junk.test(label)) return false;
        return re.test(label) || re.test(cls) || hrefRe.test(href) || re.test(el.id || '');
      })
      .filter((el) => (el.getBoundingClientRect().width || 0) < 200); // icon, không phải cả thanh/form
  }

  /* Hamburger: (1) thêm <summary> (Dawn-family: summary.header__icon--menu trong <details>), (2) loại nút
     close/cart/search/account/localization (aria-controls="cart-drawer" từng khớp /drawer/), (3) ưu tiên
     nút trong header, (4) KHÔNG leo tổ tiên chung — 2 nút không lồng nhau thì để trống cho khách Pick
     (playroom.is/fourbrothers: tổ tiên chung = body → bấm đâu cũng mở Mobile Menu). */
  const HAMBURGER_JUNK_RE = /close|cart|bag|basket|search|account|login|wishlist|currency|localization|language|filter|sort|share|scroll|top|next|prev|slide|carousel/i;
  function findHamburgerCandidates() {
    const header = headerScope();
    const list = Array.from(document.querySelectorAll('button, a, summary, [role="button"]')).filter((el) => {
      if (isNaviOwn(el) || isInFooterArea(el)) return false;
      const label = (el.getAttribute('aria-label') || el.getAttribute('title') || '').toLowerCase();
      const cls = (el.className || '').toString().toLowerCase();
      const controls = (el.getAttribute('aria-controls') || el.getAttribute('data-target') || '').toLowerCase();
      const text = (el.textContent || '').trim().toLowerCase();
      if (HAMBURGER_JUNK_RE.test(label) || HAMBURGER_JUNK_RE.test(cls) || HAMBURGER_JUNK_RE.test(controls)) return false;
      if (text.length > 20) return false;   /* nút có chữ dài = link menu, không phải icon */
      if (isOverlay(el)) return false;
      /* <a> trỏ tới trang thật (xandres: a.menu-link href="/shop") là LINK menu, không phải nút mở menu */
      const href = (el.getAttribute('href') || '').trim();
      if (el.tagName === 'A' && href && href !== '#' && !/^javascript:/i.test(href) && !/hamburger|burger|menu-toggle|nav-toggle|mobile-toggle|menu-drawer|drawer-open|open-nav|icon--menu/i.test(cls)) return false;
      return (
        /(^|\s)(menu|navigation|hamburger|burger|open menu|main menu)(\s|$)/.test(label) || /menu|navigation|hamburger|burger/.test(label) ||
        /hamburger|menu-toggle|nav-toggle|burger|menu-btn|menu-button|mobile-toggle|menu-drawer-button|icon--menu|menu-icon|open-nav|drawer-open-nav|mobile-nav-trigger/.test(cls) ||
        /menu|drawer|nav/.test(controls)
      );
    });
    if (!header) return list;
    const inHeader = list.filter((el) => header.contains(el));
    return inHeader.length ? inHeader : list;
  }
  /* Chọn đúng 1 nút: 1 ứng viên → lấy; nhiều → ưu tiên ứng viên ĐANG HIỆN (mobile) rồi ứng viên duy nhất
     trong header; vẫn nhiều → null (khách Pick). Không bao giờ trả tổ tiên chung. */
  function pickHamburger() {
    const list = dedupeNested(findHamburgerCandidates());
    if (list.length === 0) return null;
    if (list.length === 1) return list[0];
    const visible = list.filter(isVisible);
    if (visible.length === 1) return visible[0];
    const strong = list.filter((el) => /hamburger|burger|menu-toggle|nav-toggle|mobile-toggle|menu-drawer|icon--menu/i.test((el.className || '').toString()) || /^(menu|open menu|main menu|navigation)$/i.test((el.getAttribute('aria-label') || '').trim()));
    if (strong.length === 1) return strong[0];
    /* Clone mobile + sticky (Sleek: button.menu-drawer-button ×2, đều ẩn trên desktop) → bản đầu trong DOM;
       chỉ khi có dấu hiệu MẠNH (class hamburger/menu-drawer…) — không đoán bừa giữa các nút chỉ khớp aria-controls */
    if (strong.length >= 2 && visible.length === 0) return strong[0];
    const sig = (el) => el.tagName + '|' + (el.className || '').toString();
    const pool = strong.length ? strong : list;
    if (pool.every((el) => sig(el) === sig(pool[0]))) return pool[0];
    return null;
  }

  /** Tầng 2a — re-thử "for hết 331 theme" NGAY TRÊN DOM SỐNG (khác Tầng 1 backend chỉ đọc HTML
      tĩnh) — bắt được ca nội dung header/nav do JS chèn sau khi tải trang. `db` = JSON đã tải sẵn
      (schema navi-theme-selectors@3, xem theme-compat/docs/USE-theme-selectors.md). */
  /* Selector RÁC trong registry — cùng luật với poc_css_selector_is_junk() (matcher.php): thẻ HTML
     thường đứng 1 mình, `.shopify-section*` (nhãn Shopify gắn cho MỌI section). Ca thật 2026-09-20:
     theme "Next" (hamburger=`a`, header=`.shopify-section-header`) bị nhận bừa cho store Horizon. */
  function isJunkSelector(sel) {
    const s = String(sel || '').trim();
    if (!s) return true;
    if (/^(a|div|span|li|ul|ol|p|button|section|main|body|html)$/i.test(s)) return true;
    if (/^\.shopify-section/i.test(s) || /^[a-z]+\.shopify-section/i.test(s)) return true;
    return false;
  }

  const CORE_FIELDS = ['mainMenu', 'hamburger', 'header'];
  const EXTRA_FIELDS = ['logo', 'searchIcon', 'cartIcon'];
  const ALL_FIELDS = CORE_FIELDS.concat(EXTRA_FIELDS);

  /* Cùng luật với backend `poc_css_selector_is_specific()` (matcher.php): #id/.class ≥5 ký tự hoặc custom
     element mới là bằng chứng nhận diện; `header nav`, `header`, `[aria-label*='menu']` KHÔNG. Báo cáo 28:
     thiếu gate này Live mode dán nhãn Handy/Atlantic/Satoshi cho 10/23 store. */
  function isSpecificSelector(sel) {
    const str = String(sel || '').trim();
    if (/[#.]((?:[a-zA-Z0-9_-]|\\.){5,})/.test(str)) return true;
    if (/(?:^|[\s>])([a-zA-Z][a-zA-Z0-9]*-[a-zA-Z0-9-]+)(?=$|[\s>.#\[])/.test(str)) return true;
    return false;
  }

  /** Đếm khớp 1 selector registry trên DOM sống. Khớp 2+ (bản mobile + desktop của cùng icon/nav) → lấy
      bản ĐANG HIỆN nếu chỉ 1 bản hiện, đổi sang selector bền của riêng phần tử đó. Trả {el, sel} hoặc null. */
  function matchRegistrySelector(sel) {
    if (!sel || isJunkSelector(sel)) return null;
    let found;
    try { found = Array.from(document.querySelectorAll(sel)); } catch (e) { return null; }
    found = found.filter((el) => !isNaviOwn(el));
    if (found.length === 1) return { el: found[0], sel };
    if (found.length > 1) {
      const visible = found.filter(isVisible);
      if (visible.length === 1) { const st = getStableSelector(visible[0]); if (st) return { el: visible[0], sel: st }; }
    }
    return null;
  }

  /** Verify bộ selector của 1 entry registry trên DOM sống (field nào entry không có / rác thì bỏ qua). */
  function verifyEntry(entry, fields) {
    const out = { matched: 0, total: 0, specific: 0, selectors: {} };
    fields.forEach((f) => {
      const sel = entry.selectors && entry.selectors[f];
      if (!sel || isJunkSelector(sel)) return;
      out.total += 1;
      const m = matchRegistrySelector(sel);
      if (m) { out.matched += 1; out.selectors[f] = m.sel; if (isSpecificSelector(sel)) out.specific += 1; }
    });
    return out;
  }

  /** Tầng 2a-ID — cùng bước 1 của backend: `Shopify.theme.theme_store_id` → entry registry → verify trên DOM
      sống. ID đã khớp thì TIN theme đó (dùng field còn khớp, field thiếu bù heuristic), không brute-force
      sang theme khác (hafizandco: Horizon thật, Live mode từng nói "Handy"). */
  function matchByThemeStoreId(db) {
    const tsid = global.Shopify && global.Shopify.theme && global.Shopify.theme.theme_store_id;
    if (!tsid || !db || !db.themes) return null;
    let slug = null;
    Object.keys(db.themes).forEach((k) => { if (!slug && Number(db.themes[k].themeStoreId) === Number(tsid)) slug = k; });
    if (!slug) return null;
    const entry = db.themes[slug];
    const r = verifyEntry(entry, CORE_FIELDS);
    const extra = verifyEntry(entry, EXTRA_FIELDS);
    Object.assign(r.selectors, extra.selectors);
    return { slug, name: entry.name || slug, matched: r.matched, total: r.total, selectors: r.selectors, byId: true };
  }

  function bruteForceAgainstThemeDb(db) {
    let best = null;
    const themes = (db && db.themes) || {};
    Object.keys(themes).forEach((slug) => {
      const entry = themes[slug];
      const r = verifyEntry(entry, CORE_FIELDS);
      /* Đoán theme không có ID: ≥2 field khớp đúng 1 VÀ ≥2 selector ĐẶC HIỆU (cùng gate backend) */
      if (r.total >= 2 && r.matched === r.total && r.specific >= 2 && (!best || r.total > best.total || (r.total === best.total && (entry.popular || 9999) < (themes[best.slug].popular || 9999)))) {
        best = { slug, name: entry.name || slug, matched: r.matched, total: r.total, selectors: r.selectors };
      }
    });
    if (best) Object.assign(best.selectors, verifyEntry(themes[best.slug], EXTRA_FIELDS).selectors);
    return best;
  }

  /** Tầng 2b — auto-detect thuần DOM (không cần theme DB), dùng khi brute-force cũng không ra gì
      (site hoàn toàn bespoke, không giống theme nào trong 331). */
  function heuristicDetect() {
    headerCache = null;
    const header = headerScope();
    const mainMenu = resolveToOne(preferInHeader(dedupeNested(findMainMenuCandidates())));
    const hamburger = pickHamburger();   /* TASK01020: không leo tổ tiên */
    const selectors = {};
    const put = (f, el) => { const sel = el && getStableSelector(el); if (sel) selectors[f] = sel; };
    put('header', header); put('mainMenu', mainMenu); put('hamburger', hamburger);
    /* Spot phụ: KHÔNG escalate lên ancestor chung (2 icon search ở 2 nơi → ancestor là cả header,
       vô nghĩa) — chỉ nhận khi còn đúng 1 ứng viên sau dedupe, không thì bỏ trống cho khách Pick. */
    const single = (list) => { const d = dedupeNested(list); return d.length === 1 ? d[0] : null; };
    const logo = single(findLogoCandidates());
    const searchIcon = single(findIconCandidates('search'));
    const cartIcon = single(findIconCandidates('cart'));
    put('logo', logo); put('searchIcon', searchIcon); put('cartIcon', cartIcon);
    return { matched: Object.keys(selectors).length, selectors };
  }

  /** Entry point: ID → brute-force → heuristic; field nào registry thiếu/không còn khớp (kể cả field LÕI —
      báo cáo 28: hamburger bị bỏ trống dù nút có trong DOM) đều bù bằng heuristic. Trả null khi không ra gì. */
  function runTier2(themeDb) {
    const dbMatch = (themeDb && matchByThemeStoreId(themeDb)) || (themeDb ? bruteForceAgainstThemeDb(themeDb) : null);
    const h = heuristicDetect().selectors;
    if (dbMatch && dbMatch.matched > 0) {
      ALL_FIELDS.forEach((f) => { if (!dbMatch.selectors[f] && h[f]) dbMatch.selectors[f] = h[f]; });
      return { source: dbMatch.byId ? 'theme_db_by_theme_store_id_live' : 'theme_db_bruteforce_live', theme: dbMatch.slug, themeName: dbMatch.name, selectors: dbMatch.selectors, partial: dbMatch.matched < dbMatch.total };
    }
    if (Object.keys(h).length > 0) {
      /* ID khớp registry nhưng 0 selector gốc còn khớp = theme bị app/agency viết lại: giữ tên theme để admin
         hiện "based on X", selector hoàn toàn từ heuristic */
      return { source: 'heuristic', theme: dbMatch ? dbMatch.slug : null, themeName: dbMatch ? dbMatch.name : null, selectors: h };
    }
    return null;
  }

  /* Lưu kết quả về backend — GHI THẲNG từ tab storefront (KHÔNG qua relay debug-bridge như "Try
     Menus"/"Use this" đang làm cho việc TẠO MENU THẬT). Cố ý khác nguyên tắc "FE không tự ghi dữ
     liệu" ở đó: dữ liệu ở đây chỉ là CACHE GỢI Ý selector (không phải menu/dữ liệu thật của khách),
     sai nhất thì gợi ý sai — admin vẫn phải tự xác nhận Test/Add trước khi áp dụng gì. Endpoint
     `ajax.cssSelectorSave.php` tự chặn bằng Origin phải khớp domain shop + shop phải tồn tại thật
     trong DB. Nếu sau này cần siết chặt hơn, cân nhắc gộp vào chung cơ chế debug-bridge.
     `_NAVIPLUS_VERSION` là global đã có sẵn từ bundle chính (uigen.js.php) trước khi file này load. */
  const CSS_SELECTOR_SAVE_API_URL =
    typeof _NAVIPLUS_VERSION !== 'undefined' && _NAVIPLUS_VERSION !== 'DEV'
      ? 'https://dash.naviplus.app/naviplus/shopify/ajax.cssSelectorSave.php'
      : 'https://dev-shopify.naviplus.app/naviplus/shopify/ajax.cssSelectorSave.php';

  /** Lưu kết quả Tầng 2 (tự động) hoặc Tầng 3 (Navi+ Finder dò tay, `source:'manual'`) về backend.
      `shop` = `window.Shopify.shop` (LUÔN là xxx.myshopify.com — khớp `shops.shop_url` ở backend),
      KHÔNG dùng `location.hostname`: store có custom domain (vd hafizandco.store) thì hostname ≠ shop_url,
      backend sẽ từ chối "Invalid shop". Fallback hostname chỉ cho site không phải Shopify.
      Kèm `themeId`/`themeRole` từ `Shopify.theme` để admin biết kết quả thuộc theme nào (preview
      theme draft → role ≠ main → wl2adStoreUrl() bên admin tự gắn preview_theme_id khi mở lại). */
  function saveResult(result) {
    const sh = global.Shopify || {};
    const theme = sh.theme || {};
    const payload = Object.assign(
      {
        shop: sh.shop || location.hostname,
        themeId: theme.id || null,
        themeRole: theme.role || null,
      },
      result
    );
    return fetch(CSS_SELECTOR_SAVE_API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    })
      .then((r) => r.json().catch(() => ({ ok: false, error: 'HTTP ' + r.status })))
      .catch((e) => ({ ok: false, error: String((e && e.message) || 'network') }));   /* TASK01020: giữ lý do lỗi */
  }

  /** Log 1 sự kiện luồng Live mode về `ajax.cssSelectorLog.php` (bảng css_selector_check_logs — daily
      report đọc). Best-effort, không chờ. event ∈ opened | not_found | pick_started | error (server
      từ chối event lạ). Kết quả TÌM ĐƯỢC/Save đã được chính endpoint save tự log. */
  function logEvent(event, detail) {
    const sh = global.Shopify || {};
    const url = CSS_SELECTOR_SAVE_API_URL.replace('ajax.cssSelectorSave.php', 'ajax.cssSelectorLog.php');
    try {
      fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        keepalive: true,
        body: JSON.stringify({ shop: sh.shop || location.hostname, event, detail: detail || {} }),
      }).catch(() => {});
    } catch (e) {}
  }

  /** Khách Pick trả phần tử NHỎ NHẤT dưới con trỏ (svg/path/span/a) — leo lên phần tử có nghĩa theo
      field: mainMenu → nav/ul; header → header/section; hamburger/logo/icon → nút/link. Không leo quá trần
      (isReasonableSpot) và không quá 6 cấp. */
  const PICK_TARGET = {
    mainMenu: 'nav, [role="navigation"], ul',
    header: 'header, [role="banner"], [id^="shopify-section-"]',
    hamburger: 'button, a, summary, [role="button"]',
    logo: 'a, [class*="logo" i]',
    searchIcon: 'button, a, summary, [role="button"]',
    cartIcon: 'button, a, summary, [role="button"]',
  };
  function normalizePick(el, field) {
    if (!el || !PICK_TARGET[field]) return el;
    let target = null;
    try { target = el.closest(PICK_TARGET[field]); } catch (e) { target = null; }
    if (!target || target === el) return el;
    if (field === 'mainMenu' || field === 'header') {
      if (!isReasonableSpot(target)) return el;
      if (field === 'mainMenu' && target.tagName === 'UL' && target.querySelectorAll('a[href]').length < 3) return el;
    }
    let depth = 0; let cur = el;
    while (cur && cur !== target && depth < 6) { cur = cur.parentElement; depth += 1; }
    return cur === target ? target : el;
  }

  global.NaviCssSelectorTier2 = {
    getStableSelector,
    normalizePick,
    isReasonableSpot,
    logEvent,
    isNaviOwn,
    resolveToOne,
    dedupeNested,
    commonAncestor,
    bruteForceAgainstThemeDb,
    heuristicDetect,
    runTier2,
    saveResult,
  };
})(window);
