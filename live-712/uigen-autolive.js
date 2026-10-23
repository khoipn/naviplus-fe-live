/**
 * Menu.AutoProducts.Live — PHẦN MẠNG + VÁ DOM (nạp lười, bundle riêng uigen-autolive.min.js / dev uigen-autolive.js.php).
 *
 * Tách từ menus/AutoProducts_Live.js (Khôi 11/10 "làm sạch nốt"): phần đồng bộ (cache, prepare, afterExpand, canFetch, _idle)
 * vẫn ở bundle chung; file này chỉ được tải khi trang có khối kind 15 bật auto CẦN làm mới (L._withNet). Gắn hàm vào CÙNG
 * object L qua cầu nối window.naviAutoProductsLive (module gốc nằm trong closure naviman). Test Node nạp thẳng sau file gốc
 * (Menu là biến toàn cục của vm) → nhánh dự phòng Menu.AutoProducts.
 * Hợp đồng + quyết định: docs/decisions/auto-products-item-kind.md §7, §8.6, §8.12.
 */
(function (B) {
    if (!B || !B.L || !B.AP) return;
    var L = B.L, AP = B.AP;
    if (typeof L.run === "function") return;   /* đã nạp (tải trùng) → không gắn lại */
    var navidebug = (typeof window !== "undefined" && window.navidebug) ? window.navidebug : { log: function () {} };   /* file lazy: guard được phép (TASK00505) */
    /* rule.exclude (merchant bấm × ở bước B): số dòng cần lấy bù + kiểm 1 handle có bị loại không. */
    L.exN = function (r) { return Array.isArray(r && r.exclude) ? r.exclude.length : 0; };
    L.isEx = function (r, h) { return Array.isArray(r && r.exclude) && r.exclude.indexOf(String(h)) >= 0; };

    /* ── 2. Truy vấn Storefront API ─────────────────────────────────────────────────────────────────── */
    /* Chuỗi GraphQL an toàn: handle chỉ a-z0-9-_ (đã chuẩn hoá); chữ lọc đã qua whitelist (_filterText — TASK01166 fix: không có " \ < > :). */
    L._q = function (s) { return "\"" + String(s).replace(/["\\]/g, "") + "\""; };
    L.PRODUCT_FIELDS = "handle title createdAt vendor productType availableForSale featuredImage{url(transform:{maxWidth:800})} "
        + "priceRange{minVariantPrice{amount currencyCode}} compareAtPriceRange{maxVariantPrice{amount}} "
        /* TASK01190 #4: giá theo variant rẻ nhất + compare-at của CHÍNH nó (= poc_pick_variant_price) — min giá với max compare-at
           của mọi variant ra % giảm sai (Socks $18 vs $54 = -67%, thật ra không giảm). */
        + "variants(first:10){pageInfo{hasNextPage} nodes{price{amount} compareAtPrice{amount}}}";
    /* Ảnh: transform maxWidth 800 = ĐÚNG url bản chụp server (Admin API cùng transform → "…_800x.jpg"); thiếu transform thì
       url tươi luôn khác bản chụp → vá DOM mỗi lần làm mới + tải ảnh GỐC (có thể vài MB). Test độc lập TASK01188 đo thật. */
    L.COLLECTION_FIELDS = "handle title description image{url(transform:{maxWidth:800})} products(first:5, sortKey: CREATED, reverse:true){nodes{featuredImage{url(transform:{maxWidth:800})}}}";   /* TASK01190: SP MỚI NHẤT → pimage = SP mới nhất CÓ ảnh (= server, §8.9) · TASK01208: 3 → 5 = đúng cửa sổ server, ảnh ở vị trí 4–5 không còn tụt về placeholder */
    L.PAGE_FIELDS = "handle title bodySummary";
    /* TASK01166 (Khôi 11/10): dòng "All collections" (rule.allrow) — 5 SP mới nhất toàn shop → pimage (= server
       naviAutoAllCollectionsRow; Storefront chỉ trả SP đã publish). Alias riêng `allp`, không đụng alias c0..cN. TASK01208: 3 → 5 (= server). */
    L.ALLROW_QUERY = "{allp:products(first:5, sortKey:CREATED_AT, reverse:true){nodes{featuredImage{url(transform:{maxWidth:800})}}}}";
    /* sortKey của products(…) toàn shop và của collection.products(…) (2 enum KHÁC nhau trong Storefront API). */
    L.SHOP_SORT = { newest: "CREATED_AT, reverse: true", best: "BEST_SELLING", price_asc: "PRICE", price_desc: "PRICE, reverse: true", title: "TITLE", manual: "CREATED_AT, reverse: true" };
    L.COL_SORT = { newest: "CREATED, reverse: true", best: "BEST_SELLING", price_asc: "PRICE", price_desc: "PRICE, reverse: true", title: "TITLE", manual: "MANUAL" };

    /* Chuỗi tìm kiếm products(query:) — lọc phía Shopify (đã đo thật: tag/vendor/product_type/available_for_sale). */
    L.productSearch = function (rule) {
        var q = [];
        if (rule.tag) q.push("tag:" + L._q(rule.tag));
        if (rule.vendor) q.push("vendor:" + L._q(rule.vendor));
        if (rule.ptype) q.push("product_type:" + L._q(rule.ptype));
        if (rule.instock) q.push("available_for_sale:true");
        return q.join(" AND ");
    };

    /*
     * Dựng 1 truy vấn GraphQL cho khối (cfg = readConfig). Lấy ĐÚNG số cần: first = offset + count (+ đệm khi phải lọc phía
     * client). Nhiều collection/page chọn tay → alias c0..cN trong CÙNG 1 request.
     */
    L.buildQuery = function (cfg) {
        var r = cfg.rule, src = cfg.source;
        if (src === "collections") {
            if (!r.all && r.cols.length <= 50) return "{" + r.cols.map(function (h, i) { return "c" + i + ":collection(handle:" + L._q(h) + "){" + L.COLLECTION_FIELDS + "}"; }).join(" ") + "}";
            return "{collections(first:250, sortKey:" + (r.sort === "title" ? "TITLE" : "UPDATED_AT, reverse: true") + "){nodes{" + L.COLLECTION_FIELDS + "}}}";
        }
        if (src === "pages") {
            if (!r.all && r.pages.length <= 50) return "{" + r.pages.map(function (h, i) { return "c" + i + ":page(handle:" + L._q(h) + "){" + L.PAGE_FIELDS + "}"; }).join(" ") + "}";
            return "{pages(first:250, sortKey:" + (r.sort === "updated" ? "UPDATED_AT, reverse: true" : "TITLE") + "){nodes{" + L.PAGE_FIELDS + "}}}";
        }
        /* Payload tối thiểu: chỉ kéo `tags` khi có lọc tag / nhãn tag (store hay gắn hàng chục tag/SP); chỉ lấy dư khi có lọc
           (toàn shop: Shopify đã lọc, dư 2 phòng khớp lệch; collection.products: không nhận query → dư L.PAD để lọc ở đây). */
        var need = r.offset + r.count + L.exN(r);   /* TASK01190: lấy bù số dòng merchant loại trừ */
        var hasFilter = !!(r.tag || r.vendor || r.ptype || r.instock);
        var fields = L.PRODUCT_FIELDS + ((r.tag || (cfg.show && cfg.show.labels && cfg.show.labels.length)) ? " tags" : "");
        if (!r.cols.length) {
            var s = L.productSearch(r);
            return "{products(first:" + Math.min(L.MAX_FIRST, need + (hasFilter ? 2 : 0)) + ", sortKey:" + L.SHOP_SORT[r.sort] + (s ? ", query:" + JSON.stringify(s) : "") + "){nodes{" + fields + "}}}";
        }
        var n = Math.min(L.MAX_FIRST, need + (hasFilter ? L.PAD : 0));
        return "{" + r.cols.map(function (h, i) {
            return "c" + i + ":collection(handle:" + L._q(h) + "){products(first:" + n + ", sortKey:" + L.COL_SORT[r.sort] + "){nodes{" + fields + "}}}";
        }).join(" ") + "}";
    };
    /* Mỗi đợt tối đa 50 alias; Promise.all chỉ trả dữ liệu khi MỌI đợt thành công. */
    L.fetchRule = function (cfg) {
        var r = cfg.rule, src = cfg.source;
        if (src !== "collections" && src !== "pages") return L.gql(L.buildQuery(cfg));
        var hs = src === "collections" ? r.cols : r.pages, field = src === "collections" ? L.COLLECTION_FIELDS : L.PAGE_FIELDS;
        var calls = [];
        for (var i = 0; i < hs.length; i += 50) {
            var chunk = hs.slice(i, i + 50), start = i;
            calls.push(L.gql("{" + chunk.map(function (h, j) {
                return "c" + (start + j) + ":" + (src === "collections" ? "collection" : "page") + "(handle:" + L._q(h) + "){" + field + "}";
            }).join(" ") + "}"));
        }
        if (r.all) calls.push(L.gql(L.buildQuery(cfg)));
        if (src === "collections" && r.allrow) calls.push(L.gql(L.ALLROW_QUERY));   /* TASK01166: dòng "All collections" */
        return Promise.all(calls).then(function (parts) {
            var data = {};
            parts.forEach(function (part) { if (!AP._isObj(part)) throw new Error("query failed"); Object.keys(part).forEach(function (k) { data[k] = part[k]; }); });
            return data;
        });
    };

    /*
     * POST 1 truy vấn (cùng domain, không token, cookie same-origin → store có password mà người xem đã nhập pass vẫn chạy).
     * Dedupe theo chuỗi truy vấn. Timeout 4s. Trả `data`; HTTP lỗi / 429 / bị chuyển sang /password / JSON hỏng / có
     * `errors` / không có `data` → reject.
     */
    L.gql = function (query) {
        if (L._inflight[query]) return L._inflight[query];
        var ctl = (typeof AbortController === "function") ? new AbortController() : null;
        var timer = null;
        var p = Promise.race([
            fetch(L.API_PATH, { method: "POST", credentials: "same-origin",
                headers: { "Content-Type": "application/json", "Accept": "application/json" },
                body: JSON.stringify({ query: query }), signal: ctl ? ctl.signal : undefined }),
            new Promise(function (_, rej) { timer = setTimeout(function () { if (ctl) ctl.abort(); rej(new Error("timeout")); }, L.TIMEOUT_MS); })
        ]).then(function (res) {
            if (!res || !res.ok) throw new Error("http " + (res ? res.status : "?"));
            if (res.redirected && /\/password(\b|\/|\?|$)/.test(String(res.url || ""))) throw new Error("password");
            return res.json();
        }).then(function (json) {
            if (!AP._isObj(json) || (Array.isArray(json["errors"]) && json["errors"].length) || !AP._isObj(json["data"])) throw new Error("bad json");
            return json["data"];
        });
        p.then(function () { clearTimeout(timer); }, function () { clearTimeout(timer); });
        L._inflight[query] = p;
        return p;
    };

    /* ── 3. Dựng lại dòng cùng định dạng bản chụp server ──────────────────────────────────────────── */
    L.validHandle = function (h) {
        return typeof h === "string" && /^[^\/?#\s"'<>\\&]{1,255}$/.test(h);
    };
    /* = poc_bg_image_url(): bỏ query, thêm "?100". Chỉ nhận https:// hoặc // */
    L.imageUrl = function (src) {
        src = typeof src === "string" ? src.trim() : "";
        if (!/^(https:)?\/\//i.test(src)) return "";
        var q = src.indexOf("?");
        return (q >= 0 ? src.slice(0, q) : src) + "?100";
    };
    /* Tóm tắt chữ (mô tả collection / tóm tắt trang): gộp khoảng trắng, > 80 ký tự → cắt + "…". = naviAutoExcerpt (PHP). */
    L.excerpt = function (s) {
        s = String(s == null ? "" : s).replace(/\s+/g, " ").trim();
        if (s.length <= 80) return s;
        /* Đếm theo KÝ TỰ (code point) như mb_substr của PHP — slice theo UTF-16 cắt đôi emoji (nửa cặp surrogate hỏng) và lệch
           bản chụp server → vá DOM giả mỗi lần làm mới (test độc lập TASK01188, autocontent-twins). */
        var cps = s.match(/[\uD800-\uDBFF][\uDC00-\uDFFF]|[\s\S]/g) || [];
        return cps.length > 80 ? cps.slice(0, 80).join("").replace(/\s+$/, "") + "…" : s;
    };

    /* number_format($a, 0|2, '.', ',') của PHP */
    L._num = function (a) {
        var neg = a < 0; a = Math.abs(a);
        var s = (Math.floor(a) === a) ? String(a) : a.toFixed(2);
        var parts = s.split("."), int = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");
        return (neg ? "-" : "") + int + (parts[1] ? "." + parts[1] : "");
    };
    /* = poc_price_amount_text() (smartDesign/priceText.php) — Storefront API có currencyCode nên in đúng như server. */
    L.SYMBOLS = { USD: "$", EUR: "€", GBP: "£", JPY: "¥", VND: "₫", AUD: "A$", CAD: "CA$", INR: "₹", CNY: "¥", KRW: "₩" };
    L.amountText = function (a, cur) {
        var n = L._num(a), c = String(cur || "").toUpperCase(), sym = L.SYMBOLS[c];
        if (sym === "₫") return n + "₫";
        return sym ? sym + n : (n + " " + c).trim();
    };
    L._parseSeg = function (seg) {
        var m = /^([^\d]*?)(\d{1,3}(?:,\d{3})+|\d+)(\.\d+)?([^\d]*)$/.exec(seg);
        if (!m) return null;
        /* Chỉ nhận đúng các dạng poc_price_amount_text sinh ra: ký hiệu đứng trước ($ € £ ¥ ₹ ₩ A$ CA$…), "₫" đứng sau,
           hoặc " <MÃ>" đứng sau — chữ khác (vd Sub text sửa tay "From $10") → không suy, giữ giá cũ. */
        if (m[1] !== "" && m[4] !== "") return null;
        if (m[1] !== "" && !/^[A-Z]{0,2}[$€£¥₹₩]$/.test(m[1])) return null;
        if (m[4] !== "" && m[4] !== "₫" && !/^ [A-Z]{3}$/.test(m[4])) return null;
        return { pre: m[1], suf: m[4], amount: parseFloat(m[2].replace(/,/g, "") + (m[3] || "")) };
    };
    /*
     * KHỐI CŨ (không có `show` — Sub text là chuỗi giá thô, có thể đã bị sửa tay lúc tạo): suy cách in giá từ CHÍNH bản chụp
     * và kiểm khứ hồi (in lại số đọc được phải ra ĐÚNG chuỗi cũ). Không khớp → {ok:false} → giữ giá cũ. Khối có `show` dùng
     * L.amountText (giá là dữ liệu, không phải chữ khách gõ).
     */
    L.priceFormat = function (snapItems) {
        var fmt = null, seen = 0;
        for (var i = 0; i < snapItems.length; i++) {
            var price = String(snapItems[i].price || "");
            if (price === "") continue;
            var segs = price.split(" · ");
            if (segs.length > 2) return { ok: false };
            for (var j = 0; j < segs.length; j++) {
                var s = L._parseSeg(segs[j]);
                if (!s) return { ok: false };
                if (!fmt) fmt = { pre: s.pre, suf: s.suf };
                if (s.pre !== fmt.pre || s.suf !== fmt.suf) return { ok: false };
                if (fmt.pre + L._num(s.amount) + fmt.suf !== segs[j]) return { ok: false };
            }
            seen++;
        }
        return seen && fmt ? { ok: true, pre: fmt.pre, suf: fmt.suf } : { ok: false };
    };

    /* Node sản phẩm Storefront API → dạng phẳng dùng nội bộ (null nếu thiếu handle hợp lệ). */
    L.fromProduct = function (n) {
        if (!AP._isObj(n) || !L.validHandle(n["handle"])) return null;
        var pr = AP._isObj(n["priceRange"]) && AP._isObj(n["priceRange"]["minVariantPrice"]) ? n["priceRange"]["minVariantPrice"] : {};
        var cp = AP._isObj(n["compareAtPriceRange"]) && AP._isObj(n["compareAtPriceRange"]["maxVariantPrice"]) ? n["compareAtPriceRange"]["maxVariantPrice"] : {};
        var min = parseFloat(pr["amount"]), cmp = parseFloat(cp["amount"]);
        var pk = L.pickVariant(n["variants"], min);
        if (pk) { min = pk.min; cmp = pk.cmp; }
        return {
            handle: n["handle"], title: String(n["title"] == null ? "" : n["title"]),
            created: Date.parse(n["createdAt"] || "") || 0,
            vendor: String(n["vendor"] == null ? "" : n["vendor"]), ptype: String(n["productType"] == null ? "" : n["productType"]),
            tags: Array.isArray(n["tags"]) ? n["tags"].map(function (t) { return String(t); }) : [],
            avail: n["availableForSale"] !== false,
            min: isFinite(min) ? min : null, cmp: isFinite(cmp) && cmp > 0 ? cmp : null, cur: String(pr["currencyCode"] || ""),
            image: L.imageUrl(AP._isObj(n["featuredImage"]) ? n["featuredImage"]["url"] : "")
        };
    };

    /*
     * = poc_pick_variant_price (smartDesign/priceText.php): variant giá THẤP NHẤT (hoà giá → ưu tiên variant đang giảm), compare-at
     * của chính variant đó (≤ giá → không giảm). Còn variant ở trang sau → giá min toàn SP, không giảm. Không có variants → null
     * (dùng priceRange cũ). Trả {min, cmp|NaN}.
     */
    L.pickVariant = function (conn, minAll) {
        if (!AP._isObj(conn) || !Array.isArray(conn["nodes"])) return null;
        if (AP._isObj(conn["pageInfo"]) && conn["pageInfo"]["hasNextPage"]) return isFinite(minAll) ? { min: minAll, cmp: NaN } : null;
        var best = null;
        conn["nodes"].forEach(function (v) {
            if (!AP._isObj(v) || !AP._isObj(v["price"])) return;
            var p = parseFloat(v["price"]["amount"]);
            if (!isFinite(p)) return;
            var c = AP._isObj(v["compareAtPrice"]) ? parseFloat(v["compareAtPrice"]["amount"]) : NaN;
            if (!(isFinite(c) && c > p)) c = NaN;
            if (!best || p < best.min || (p === best.min && isFinite(c) && !isFinite(best.cmp))) best = { min: p, cmp: c };
        });
        return best;
    };

    /* Lọc theo rule (= poc_mp_rules_filter: không phân biệt hoa thường, field vắng → không lọc). */
    L.passes = function (p, rule) {
        var low = function (x) { return String(x == null ? "" : x).trim().toLowerCase(); };
        if (rule.instock && !p.avail) return false;
        if (rule.vendor !== "" && low(p.vendor) !== low(rule.vendor)) return false;
        if (rule.ptype !== "" && low(p.ptype) !== low(rule.ptype)) return false;
        if (rule.tag !== "" && p.tags.map(low).indexOf(low(rule.tag)) < 0) return false;
        return true;
    };
    L._sort = function (rows, sort) {
        var ti = function (p) { return p.title.toLowerCase(); };
        return rows.map(function (p, i) { return { p: p, i: i }; }).sort(function (a, b) {
            var c = 0;
            if (sort === "newest") c = b.p.created - a.p.created;
            else if (sort === "price_asc") c = (a.p.min || 0) - (b.p.min || 0);
            else if (sort === "price_desc") c = (b.p.min || 0) - (a.p.min || 0);
            else { var x = ti(a.p), y = ti(b.p); c = x < y ? -1 : (x > y ? 1 : 0); }
            return c || (a.i - b.i);
        }).map(function (x) { return x.p; });
    };
    /* Nhãn tag: chữ ĐẦU TIÊN trong danh sách khách liệt kê mà sản phẩm có tag trùng (không phân biệt hoa thường). = server. */
    L.labelOf = function (p, show) {
        var labels = (show && Array.isArray(show.labels)) ? show.labels : [];
        var tags = p.tags.map(function (t) { return t.trim().toLowerCase(); });
        for (var i = 0; i < labels.length; i++) if (tags.indexOf(String(labels[i]).toLowerCase()) >= 0) return labels[i];
        return "";
    };

    /* Dòng sản phẩm. fmt = định dạng suy từ bản chụp (khối cũ) hoặc null (khối có show → in theo currencyCode). */
    L.productRow = function (p, cfg, fmt, old) {
        var price = "";
        if (p.min !== null) {
            if (fmt) price = fmt.pre + L._num(p.min) + fmt.suf + (p.cmp !== null && p.cmp > p.min ? " · " + fmt.pre + L._num(p.cmp) + fmt.suf : "");
            else price = L.amountText(p.min, p.cur) + (p.cmp !== null && p.cmp > p.min ? " · " + L.amountText(p.cmp, p.cur) : "");
        } else if (old) price = old.price;
        var row = { name: p.title, url: "products/" + p.handle, image: p.image, price: price };
        if (cfg.show) {
            row.label = L.labelOf(p, cfg.show);
            row.pct = (p.cmp !== null && p.min !== null && p.cmp > p.min) ? Math.round((p.cmp - p.min) / p.cmp * 100) : 0;
            row.vendor = p.vendor; row.ptype = p.ptype; row.so = p.avail ? 0 : 1;
        }
        return row;
    };

    /*
     * Từ `data` của Storefront API + cấu hình khối (bản chụp) → dòng mới, hoặc null (= giữ bản chụp).
     * Products: Shopify đã sort (kể cả bán chạy) + lọc (toàn shop) → luôn dựng lại đầy đủ; collection.products thì lọc ở đây,
     * nhiều collection gộp + khử trùng + sắp lại (best/manual giữ thứ tự gộp, = server). Khối CŨ (không show) mà không suy
     * được định dạng giá từ bản chụp → giữ giá cũ theo handle (SP mới không có giá cũ → Sub text trống).
     * Collections: bỏ frontpage (khi lấy tất cả), bỏ collection rỗng (skipempty), ảnh = ảnh collection → ảnh SP đầu,
     * n (số SP) = của bản chụp theo url (Storefront API không có) → -1 nếu mới. Pages: tên + tóm tắt.
     * Bảo vệ: rỗng, hoặc hụt quá nửa bản chụp (≥4 dòng) → null.
     */
    L.compute = function (cfg, data) {
        if (!AP._isObj(data)) return null;
        var rule = cfg.rule, snap = cfg.snap.items, src = cfg.source;
        var oldBy = {};
        snap.forEach(function (s) { oldBy[s.url] = s; });
        var aliased = function () {   /* c0..cN theo đúng thứ tự khách chọn; null (không tồn tại) → bỏ */
            var out = [];
            for (var i = 0; Object.prototype.hasOwnProperty.call(data, "c" + i); i++) if (AP._isObj(data["c" + i])) out.push(data["c" + i]);
            return out;
        };
        var nodes = function (conn) { return AP._isObj(conn) && Array.isArray(conn["nodes"]) ? conn["nodes"] : []; };
        var items = [];

        if (src === "collections") {
            var cols = aliased().concat(rule.all ? nodes(data["collections"]) : []), seenCols = {};
            var rows = [];
            /* TASK01166: dòng "All collections" ĐẦU danh sách (= server naviAutoAllCollectionsRow). n giữ của bản chụp (Storefront
               không có số đếm); skipempty + shop không còn SP nào → bỏ; merchant × (exclude 'collections') → bỏ. */
            if (rule.allrow && !L.isEx(rule, "collections")) {
                var ap = nodes(data["allp"]), oldA = oldBy["collections"], apimg = "";
                if (!(rule.skipempty && !ap.length)) {
                    ap.forEach(function (pn) { if (!apimg && AP._isObj(pn) && AP._isObj(pn["featuredImage"])) apimg = L.imageUrl(pn["featuredImage"]["url"]); });
                    rows.push({ name: oldA ? oldA.name : "All collections", url: "collections", image: "", pimage: apimg, desc: "",
                                n: oldA && typeof oldA.n === "number" ? oldA.n : -1 });
                }
            }
            cols.forEach(function (c) {
                if (!AP._isObj(c) || !L.validHandle(c["handle"])) return;
                /* TASK01166: `frontpage` chỉ bỏ khi đến từ nhánh legacy nở-ra-tất-cả; khách tick tay → giữ (= server) */
                if ((c["handle"] === "frontpage" && rule.cols.indexOf("frontpage") < 0) || seenCols[c["handle"]]) return;
                seenCols[c["handle"]] = true;
                if (L.isEx(rule, c["handle"])) return;   /* TASK01190 */
                var first = nodes(c["products"])[0];
                if (rule.skipempty && !first) return;
                var url = "collections/" + c["handle"], old = oldBy[url];
                var img = L.imageUrl(AP._isObj(c["image"]) ? c["image"]["url"] : ""), pimg = "";
                /* TASK01190 §8.9: image = ảnh collection (rỗng giữ rỗng) · pimage = SP MỚI NHẤT có ảnh trong 5 SP mới nhất (Storefront
                   chỉ trả SP đã publish) — engine chọn theo imgfb lúc vẽ (rowImage). = server naviAutoListCollections. */
                nodes(c["products"]).forEach(function (pn) { if (!pimg && AP._isObj(pn) && AP._isObj(pn["featuredImage"])) pimg = L.imageUrl(pn["featuredImage"]["url"]); });
                rows.push({ name: String(c["title"] == null ? "" : c["title"]), url: url, image: img, pimage: pimg, desc: L.excerpt(c["description"]),
                            n: old && typeof old.n === "number" ? old.n : -1 });
            });
            items = rows;
        } else if (src === "pages") {
            var seenPages = {};
            aliased().concat(rule.all ? nodes(data["pages"]) : []).forEach(function (pg) {
                if (!AP._isObj(pg) || !L.validHandle(pg["handle"]) || L.isEx(rule, pg["handle"])) return;   /* TASK01190: + loại trừ */
                if (seenPages[pg["handle"]]) return;
                seenPages[pg["handle"]] = true;
                items.push({ name: String(pg["title"] == null ? "" : pg["title"]), url: "pages/" + pg["handle"], image: "", desc: L.excerpt(pg["bodySummary"]) });
            });
        } else {
            var raw = [];
            if (rule.cols.length) aliased().forEach(function (c) { raw = raw.concat(nodes(c["products"])); });
            else raw = nodes(data["products"]);
            var seen = {}, list = [];
            raw.forEach(function (n) {
                var p = L.fromProduct(n);
                if (!p || seen[p.handle] || !L.passes(p, rule) || L.isEx(rule, p.handle)) return;   /* TASK01190: + loại trừ */
                seen[p.handle] = 1;
                list.push(p);
            });
            var sort = (rule.sort === "manual" && !rule.cols.length) ? "newest" : rule.sort;
            if (rule.cols.length > 1 && ["newest", "price_asc", "price_desc", "title"].indexOf(sort) >= 0) list = L._sort(list, sort);
            var fmt = null;
            if (!cfg.show && cfg.map.price !== "") {
                var f = L.priceFormat(snap);
                fmt = f.ok ? f : "keep";
            }
            list.slice(rule.offset, rule.offset + rule.count).forEach(function (p) {
                var old = oldBy["products/" + p.handle];
                if (fmt === "keep") { var r = L.productRow(p, cfg, null, old); r.price = old ? old.price : ""; items.push(r); }   /* không suy được định dạng → giữ giá cũ */
                else items.push(L.productRow(p, cfg, fmt, old));
            });
        }
        items = L._cleanItems(items, src).slice(0, src === "products" ? rule.count : 250);
        /* TASK01190 #6: rỗng = "không còn gì khớp rule" → trả [] (refreshJob chỉ chấp nhận sau 2 lần liên tiếp — Storefront API
           thỉnh thoảng trả nodes:[] ngẫu nhiên). Hụt quá nửa bản chụp (≥4 dòng) vẫn coi là bất thường → null. */
        if (!items.length) return [];
        if (snap.length >= 4 && items.length * 2 < snap.length) return null;
        return items;
    };

    /* ── 4. Chạy các việc làm mới của 1 lượt vẽ ──────────────────────────────────────────────────── */
    L.refreshJob = function (job) {
        var cfg = job.cfg;
        /* Bọc trong Promise.resolve().then: fetch bị app/theme khác "vá" (window.fetch wrapper) có thể ném lỗi ĐỒNG BỘ —
           phải rơi vào .catch bên dưới (ghi mốc thất bại) thay vì lọt ra callback idle và gọi lại mỗi lượt tải trang. */
        return Promise.resolve().then(function () {
            return L.fetchRule(cfg);
        }).then(function (data) {
            var items = L.compute(cfg, data);
            if (!items) throw new Error("suspicious");
            /* Rỗng: lần 1 → mốc thất bại có cờ `empty` (giữ items cũ như lỗi thường); lần 2 liên tiếp (cùng rule) → chấp nhận: entry
               `emptyOk` → khối ẩn trên storefront (đúng ý merchant: rule không còn khớp gì). */
            if (!items.length) {
                var pe = L.readEntry(job.key);
                if (!(AP._isObj(pe) && pe["r"] === job.rh && (pe["empty"] || pe["emptyOk"]))) { var er = new Error("empty"); er.empty = 1; throw er; }
                L.writeEntry(job.key, { t: L.now(), r: job.rh, items: [], emptyOk: 1 });
                return cfg.snap.items.length ? job.hostId : null;
            }
            L.writeEntry(job.key, { t: L.now(), r: job.rh, items: items });
            return JSON.stringify(items) !== JSON.stringify(cfg.snap.items) ? job.hostId : null;
        }).catch(function (e) {
            /* mốc thất bại: không thử lại trước hết khoảng làm mới (store password / 429 không bị gọi mỗi trang) */
            /* TASK01166 fix: GIỮ items cũ (cùng rule) trong mốc thất bại — 1 lần timeout/429 không được làm trình duyệt lùi về
               bản chụp DB cả chu kỳ. ti = lúc lấy items đó (để vẫn so được với snap.at). */
            var fe = { t: L.now(), r: job.rh, fail: 1 }, prev = L.readEntry(job.key);
            if (e && e.empty) fe.empty = 1;   /* TASK01190: đánh dấu rỗng lần 1 */
            if (AP._isObj(prev) && prev["r"] === job.rh && Array.isArray(prev["items"]) && prev["items"].length) {
                var pti = parseInt(prev["ti"], 10) || parseInt(prev["t"], 10) || 0;
                if (pti) { fe.items = prev["items"]; fe.ti = pti; }
            }
            L.writeEntry(job.key, fe);
            navidebug.log("[AutoProducts] giữ bản chụp: " + (e && e.message));
            return null;
        });
    };
    L.run = function (ctx, jobs) {
        return Promise.all(jobs.map(L.refreshJob)).then(function (hosts) {
            var changed = hosts.filter(function (h) { return !!h; });
            if (changed.length) L.applyDom(ctx, changed, 0);
            return changed;
        }).catch(function () { return []; });
    };

    /* ── 5. Vá tại chỗ ───────────────────────────────────────────────────────────────────────────── */
    L._roots = function (embedId) {
        if (typeof document === "undefined" || !embedId) return [];
        return Array.prototype.filter.call(document.getElementsByClassName(String(embedId)), function (el) {
            return el.classList && el.classList.contains("naviItem");
        });
    };
    L._tpl = function (html) {
        var t = document.createElement("template");   /* nội dung trơ: không tải ảnh, không chạy gì */
        t.innerHTML = html;
        return t.content;
    };
    /* TASK01190 #8: chỉ gỡ "navi-skeleton" TRONG thuộc tính class — trước đây regex xoá cả chuỗi trong onload của <img>
       (classList.remove('navi-skeleton') → remove('')) → console "token must not be empty" mỗi lần vá. */
    L._stripSkel = function (s) {
        return String(s).replace(/(\sclass=")([^"]*)"/g, function (m, a, c) { return a + c.replace(/ ?\bnavi-skeleton\b/g, "") + "\""; });
    };
    /*
     * Trạng thái engine TỰ ghi vào bên trong <li> sau khi vẽ (đo trên trình duyệt thật, Tab Bar — test độc lập TASK01166):
     *   - icon font tải xong → bỏ class navi-skeleton, còn lại `class=""` (regex _stripSkel ra `class=" "` → không khớp);
     *   - Helper.closeDropdownsOfOtherMenus / Finalizer.Event.resetSlideMenuState → `span.arrow` có style="display: none;".
     * _normInner: innerHTML đã gỡ 2 dấu vết đó (chỉ để SO SÁNH live với oldGen).
     * _carryLiveState: HTML của newGen mang lại đúng 2 trạng thái đó như live đang có (để vá xong không hồi skeleton / hiện mũi tên).
     */
    /*
     * Dấu vết thứ 3 (sự cố đo trên storefront thật, 16/10/2026): modules/ImagePreload.js (gói Business+) gắn
     * `data-navi-preload-queued="1"` lên mọi <img> trong `.naviItem ul.children` ⇒ khối kind 15 ở CẤP CON lệch innerHTML
     * với oldGen ở MỌI ô có ảnh → _planLi trả null → không bao giờ vá. Cấp 1 không bị (ImagePreload chỉ quét ul.children).
     *
     * Đã soát các module sau-vẽ khác — KHÔNG gắn gì vào BÊN TRONG <li> của khối nên không cần bỏ qua:
     *   - GridRowFlow: `style.minHeight` + `data-navi-rowh` lên chính <li> (thuộc tính <li> → _planLi chỉ xét thuộc tính
     *     oldGen≠newGen, thuộc tính live tự thêm được giữ nguyên).
     *   - AutoProducts_Layout (dải trượt): DỜI cả <li> vào `ul.navi-live-track`, không đụng nội dung <li>.
     *   - HtmlBlock: chỉ <li data-navi-html> (kind 5) — khối kind 15 không sinh loại này.
     *   - DynamicItems / TabSlide / MenuRef: phần tử riêng của chúng (style, nút tab, item nhúng) — không nằm trong ô khối.
     * Danh sách thuộc tính bỏ qua khi SO (chỉ những gì engine tự gắn): L.ENGINE_IMG_ATTRS.
     */
    L.ENGINE_IMG_ATTRS = ["data-navi-preload-queued"];

    L._normInner = function (el) {
        var c = el.cloneNode(true);
        Array.prototype.forEach.call(c.querySelectorAll(".navi-skeleton"), function (n) { n.classList.remove("navi-skeleton"); });
        Array.prototype.forEach.call(c.querySelectorAll("[class]"), function (n) { var v = n.getAttribute("class"); if (v.trim() !== v) n.setAttribute("class", v.trim()); });
        Array.prototype.forEach.call(c.querySelectorAll("span.arrow"), function (n) { n.removeAttribute("style"); });
        L.ENGINE_IMG_ATTRS.forEach(function (a) {
            Array.prototype.forEach.call(c.querySelectorAll("img[" + a + "]"), function (n) { n.removeAttribute(a); });
        });

        return c.innerHTML;
    };
    L._carryLiveState = function (live, newGen) {
        var c = newGen.cloneNode(true);
        if (!live.querySelector(".navi-skeleton")) {
            Array.prototype.forEach.call(c.querySelectorAll(".navi-skeleton"), function (n) { n.classList.remove("navi-skeleton"); });
        }
        var la = live.querySelectorAll("span.arrow"), ca = c.querySelectorAll("span.arrow");
        for (var i = 0; i < ca.length && i < la.length; i++) {
            if (la[i].hasAttribute("style")) ca[i].setAttribute("style", la[i].getAttribute("style"));
        }
        /* Mang lại dấu ImagePreload theo đúng thứ tự <img> (số <img> live = newGen vì _normInner đã khớp) → ảnh mới không bị
           xếp hàng preload lần 2 nếu có lượt quét sau. CHỈ mang khi src không đổi: ảnh đổi URL (sản phẩm/ảnh mới sau
           live refresh) phải để ImagePreload xếp hàng lại (review Codex vòng 2). */
        var li = live.querySelectorAll("img"), ci = c.querySelectorAll("img");
        for (var j = 0; j < ci.length && j < li.length; j++) {
            if (li[j].getAttribute("src") !== ci[j].getAttribute("src")) continue;
            L.ENGINE_IMG_ATTRS.forEach(function (a) {
                if (li[j].hasAttribute(a)) ci[j].setAttribute(a, li[j].getAttribute(a));
            });
        }

        return c.innerHTML;
    };
    L._attrs = function (el) {
        var o = {};
        Array.prototype.forEach.call(el.attributes, function (a) { if (a.name !== "class") o[a.name] = a.value; });
        return o;
    };
    /*
     * Kế hoạch vá 1 <li>: live (đang hiển thị) · oldGen (HTML engine sinh từ dữ liệu ĐÃ vẽ) · newGen (từ dữ liệu tươi).
     * Chỉ đổi phần oldGen→newGen khác nhau; phần do module sau-vẽ thêm vào live (class active, bỏ skeleton…) được giữ.
     * live lệch oldGen ở chỗ cần đổi theo cách không giải thích được → null (huỷ cả lượt vá, chờ lần tải trang sau).
     */
    L._planLi = function (live, oldGen, newGen) {
        var A = L._attrs(oldGen), B = L._attrs(newGen), set = {}, del = [];
        var names = Object.keys(A).concat(Object.keys(B).filter(function (n) { return !Object.prototype.hasOwnProperty.call(A, n); }));
        for (var i = 0; i < names.length; i++) {
            var n = names[i], a = A[n], b = B[n];
            if (a === b) continue;
            if (live.getAttribute(n) !== (typeof a === "undefined" ? null : a)) return null;
            if (typeof b === "undefined") del.push(n); else set[n] = b;
        }
        var oc = Array.prototype.slice.call(oldGen.classList), lc = Array.prototype.slice.call(live.classList);
        var added = lc.filter(function (c) { return oc.indexOf(c) < 0; });
        var removed = oc.filter(function (c) { return lc.indexOf(c) < 0; });
        var cls = Array.prototype.slice.call(newGen.classList).filter(function (c) { return removed.indexOf(c) < 0; });
        added.forEach(function (c) { if (cls.indexOf(c) < 0) cls.push(c); });
        var html = null;
        if (oldGen.innerHTML !== newGen.innerHTML) {
            if (live.innerHTML === oldGen.innerHTML) html = newGen.innerHTML;
            else if (L._stripSkel(live.innerHTML) === L._stripSkel(oldGen.innerHTML)) html = L._stripSkel(newGen.innerHTML);
            else if (live.cloneNode && L._normInner(live) === L._normInner(oldGen)) html = L._carryLiveState(live, newGen);
            else return null;
        }
        return { set: set, del: del, cls: cls.join(" "), html: html };
    };
    /*
     * Vẽ lại (ngoài màn hình) HTML menu từ dữ liệu đã vẽ và dữ liệu tươi bằng CHÍNH generateMenu (ctx.render), rồi chỉ
     * thay nội dung các <li> của khối đổi. Số <li> của khối khác bản đang hiển thị (thêm/bớt SP) → KHÔNG vá (đổi số
     * item là đổi bố cục lưới) — bản tươi đã nằm trong cache, hiện ở lần tải trang sau. Root chưa có (menu
     * publish-to-place còn chờ chỗ chèn) → thử lại tối đa 10 lần × 500ms. Trả số <li> đã vá.
     */
    L.applyDom = function (ctx, hostIds, tries) {
        try {
            if (!ctx || typeof ctx.render !== "function" || !ctx.base || typeof document === "undefined") return 0;
            var roots = L._roots(ctx.embedId);
            if (!roots.length) {
                if ((tries || 0) < 10) setTimeout(function () { L.applyDom(ctx, hostIds, (tries || 0) + 1); }, 500);
                return 0;
            }
            var fresh = AP.expandData(ctx.base, ctx.menuKind, { embedId: ctx.embedId, noJobs: true });
            var oldT = L._tpl(ctx.render(ctx.out)), newT = L._tpl(ctx.render(fresh));
            var patched = 0;
            hostIds.forEach(function (hostId) {
                var sel = "li." + AP.MARK_CLASS + "." + AP.SRC_CLASS_PREFIX + hostId;
                var o = oldT.querySelectorAll(sel), n = newT.querySelectorAll(sel);
                if (!o.length || o.length !== n.length) return;
                roots.forEach(function (root) {
                    var live = root.querySelectorAll(sel);
                    if (live.length !== o.length) return;
                    var plans = [];
                    for (var i = 0; i < live.length; i++) {
                        var pl = L._planLi(live[i], o[i], n[i]);
                        if (!pl) return;   /* 1 <li> không chắc → không vá khối này trong root này */
                        plans.push(pl);
                    }
                    plans.forEach(function (pl, i) {
                        var el = live[i];
                        Object.keys(pl.set).forEach(function (k) { el.setAttribute(k, pl.set[k]); });
                        pl.del.forEach(function (k) { el.removeAttribute(k); });
                        if (el.className !== pl.cls) el.className = pl.cls;
                        if (pl.html !== null) el.innerHTML = pl.html;
                        patched++;
                    });
                });
            });
            ctx.out = fresh;
            return patched;
        } catch (e) {
            navidebug.log("[AutoProducts] không vá được DOM: " + (e && e.message));
            return 0;
        }
    };

    L._netReady();
})((typeof window !== "undefined" && window.naviAutoProductsLive) || (typeof Menu !== "undefined" && Menu.AutoProducts ? { L: Menu.AutoProducts.Live, AP: Menu.AutoProducts } : null));
