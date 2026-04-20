(() => {
  // src/data/constants.js
  var DEFAULT_CATEGORIES = [
    { id: "hygiene", name: "\u6D17\u6F31\u7528\u54C1", cssClass: "cat-hygiene" },
    { id: "makeup", name: "\u5316\u5986\u7528\u54C1", cssClass: "cat-makeup" },
    { id: "skincare", name: "\u62A4\u80A4\u7528\u54C1", cssClass: "cat-skincare" },
    { id: "small-bag", name: "\u968F\u8EAB\u5C0F\u7269", cssClass: "cat-small-bag" },
    { id: "big-bag", name: "\u5927\u4EF6\u6536\u7EB3", cssClass: "cat-big-bag" },
    { id: "misc", name: "\u6742\u7269", cssClass: "cat-misc" },
    { id: "docs", name: "\u8BC1\u4EF6", cssClass: "cat-docs" },
    { id: "electronics", name: "\u7535\u5B50\u8BBE\u5907", cssClass: "cat-electronics" },
    { id: "medicine", name: "\u836F\u54C1", cssClass: "cat-medicine" },
    { id: "clothing", name: "\u8863\u7269", cssClass: "cat-clothing" }
  ];
  var DEFAULT_BAGS = [
    { id: "bag-hygiene", name: "\u6D17\u6F31\u5305", icon: "\u{1F9F4}" },
    { id: "bag-makeup", name: "\u5316\u5986\u5305", icon: "\u{1F484}" },
    { id: "bag-docs", name: "\u8BC1\u4EF6\u5305", icon: "\u{1F4C1}" },
    { id: "bag-clothing", name: "\u8863\u670D\u5305", icon: "\u{1F455}" },
    { id: "bag-baby", name: "\u5B9D\u5B9D\u57FA\u7840\u5305", icon: "\u{1F37C}" },
    { id: "bag-baby-vaccine", name: "\u75AB\u82D7\u63D2\u4EF6\u5305", icon: "\u{1F489}" },
    { id: "bag-baby-feeding", name: "\u5582\u517B\u63D2\u4EF6\u5305", icon: "\u{1F9C3}" },
    { id: "bag-baby-overnight", name: "\u8FC7\u591C\u63D2\u4EF6\u5305", icon: "\u{1F319}" },
    { id: "bag-baby-outdoor", name: "\u6237\u5916\u63D2\u4EF6\u5305", icon: "\u26F0\uFE0F" },
    { id: "bag-electronics", name: "\u7535\u5B50\u5305", icon: "\u{1F50C}" },
    { id: "bag-small", name: "\u968F\u8EAB\u5C0F\u5305", icon: "\u{1F45B}" },
    { id: "bag-big", name: "\u5927\u4EF6\u6536\u7EB3\u5305", icon: "\u{1F9F3}" },
    { id: "bag-medicine", name: "\u836F\u54C1\u5305", icon: "\u{1F48A}" },
    { id: "bag-misc", name: "\u6742\u7269\u5305", icon: "\u{1F4E6}" }
  ];
  var CATEGORY_BAG_MAP = {
    hygiene: "bag-hygiene",
    makeup: "bag-makeup",
    skincare: "bag-hygiene",
    "small-bag": "bag-small",
    "big-bag": "bag-big",
    misc: "bag-misc",
    docs: "bag-docs",
    electronics: "bag-electronics",
    medicine: "bag-medicine",
    clothing: "bag-clothing"
  };
  var MODULE_FILTERS = [
    { id: "all", name: "\u5168\u90E8" },
    { id: "starter", name: "\u57FA\u7840" },
    { id: "travel", name: "\u51FA\u884C" },
    { id: "family", name: "\u5B9D\u5B9D" },
    { id: "daily", name: "\u968F\u8EAB" },
    { id: "custom", name: "\u6211\u7684" }
  ];
  var STORAGE_KEYS = {
    records: "packHelper_lists",
    itemLibrary: "packHelper_itemLibrary",
    officialModules: "packHelper_officialModules",
    onboarded: "packHelper_onboarded"
  };
  var BABY_MODULE_IDS = {
    base: "module-baby-base",
    vaccine: "module-baby-vaccine",
    feeding: "module-baby-feeding",
    overnight: "module-baby-overnight",
    outdoor: "module-baby-outdoor"
  };

  // src/data/utils.js
  function gid() {
    return Date.now().toString(36) + Math.random().toString(36).slice(2, 7);
  }
  function deepClone(value) {
    return JSON.parse(JSON.stringify(value));
  }
  function uniqueStrings(values) {
    return Array.from(new Set((values || []).filter(Boolean)));
  }
  function guessCat(name) {
    const n = String(name || "").toLowerCase();
    const rules = [
      [["\u8EAB\u4EFD\u8BC1", "\u62A4\u7167", "\u7B7E\u8BC1", "\u9A7E\u7167", "\u5DE5\u4F5C\u8BC1", "\u95E8\u7981", "\u540D\u7247", "\u53D1\u7968", "\u884C\u7A0B", "\u4FDD\u9669", "\u6237\u53E3", "\u51FA\u751F", "\u5B66\u751F\u8BC1", "\u9884\u8BA2", "\u786E\u8BA4\u5355", "\u793E\u4FDD", "\u533B\u4FDD"], "docs"],
      [["\u5145\u7535", "\u7535\u6C60", "\u6570\u636E\u7EBF", "\u8033\u673A", "\u624B\u673A", "\u7535\u8111", "pad", "\u5E73\u677F", "\u76F8\u673A", "\u8F6C\u6362\u63D2", "u\u76D8", "\u9F20\u6807", "\u624B\u7535", "\u5934\u706F", "\u9732\u8425\u706F", "\u97F3\u7BB1", "\u81EA\u62CD", "\u63D2\u7EBF\u677F", "\u8BFB\u5361\u5668", "watch"], "electronics"],
      [["\u886C\u886B", "t\u6064", "\u88E4", "\u88D9", "\u8FDE\u8863\u88D9", "\u5185\u8863", "\u5185\u88E4", "\u6587\u80F8", "\u889C", "\u5916\u5957", "\u897F\u88C5", "\u98CE\u8863", "\u7761\u8863", "\u6CF3\u8863", "\u62D6\u978B", "\u978B", "\u51B2\u950B\u8863", "\u901F\u5E72", "\u5E3D\u5B50", "\u56F4\u5DFE", "\u53E3\u6C34\u5DFE", "\u5B9D\u5B9D\u8863\u670D", "\u5B9D\u5B9D\u889C\u5B50", "\u6253\u5E95\u88E4"], "clothing"],
      [["\u7259\u5237", "\u7259\u818F", "\u6F31\u53E3", "\u7259\u7EBF", "\u6D17\u9762", "\u68B3", "\u5243\u987B", "\u6C90\u6D74", "\u6D17\u53D1", "\u9999\u7682", "\u6D74\u5DFE", "\u6BDB\u5DFE", "\u7259\u5237\u676F"], "hygiene"],
      [["\u9762\u971C", "\u9632\u6652", "\u5507\u818F", "\u9762\u819C", "\u82A6\u835F", "\u9A71\u868A", "\u62A4\u80A4", "\u62A4\u81C0", "\u4E73\u6DB2", "\u7CBE\u534E", "\u8EAB\u4F53\u4E73", "\u62A4\u624B\u971C", "\u55B7\u96FE"], "skincare"],
      [["\u53E3\u7EA2", "\u5507\u91C9", "\u7C89\u5E95", "\u7C89\u6251", "\u6C14\u57AB", "\u773C\u5F71", "\u5316\u5986", "\u5378\u5986", "\u776B\u6BDB", "\u816E\u7EA2", "\u7709\u7B14", "\u773C\u7EBF", "\u906E\u7455", "\u6563\u7C89", "\u9AD8\u5149", "\u4FEE\u5BB9", "\u5B9A\u5986", "\u5986\u524D", "\u7F8E\u5986\u86CB", "\u5316\u5986\u5237", "\u9999\u6C34"], "makeup"],
      [["\u611F\u5192\u836F", "\u9000\u70E7", "\u521B\u53EF\u8D34", "\u80A0\u80C3", "\u6655\u8F66", "\u7EF4\u751F\u7D20", "\u6E29\u5EA6\u8BA1", "\u7898\u4F0F", "\u6B62\u75DB", "\u6D88\u6BD2", "\u5E38\u5907\u836F", "\u9000\u70ED\u8D34", "\u8FC7\u654F\u836F"], "medicine"],
      [["\u94B1\u5305", "\u94A5\u5319", "\u53E3\u7F69", "\u968F\u8EAB", "\u73B0\u91D1", "\u94F6\u884C\u5361", "\u58A8\u955C", "\u53D1\u7EF3"], "small-bag"],
      [["\u8D2D\u7269\u888B", "\u6536\u7EB3\u888B", "\u538B\u7F29\u888B", "\u5927\u5305", "\u884C\u674E\u7BB1"], "big-bag"],
      [["\u96E8\u4F1E", "\u96E8\u8863", "\u7EB8\u5DFE", "\u6E7F\u5DFE", "\u5783\u573E\u888B", "\u5851\u6599\u888B", "\u96F6\u98DF", "\u6C34\u676F", "\u4FDD\u6E29\u676F", "u\u578B\u6795", "\u773C\u7F69", "\u8033\u585E", "\u884C\u674E\u9501", "\u884C\u674E\u724C", "\u6253\u706B\u673A", "\u7EF3\u7D22", "\u624E\u5E26", "\u996E\u7528\u6C34", "\u5976\u74F6", "\u5976\u7C89", "\u56F4\u515C", "\u5B89\u629A\u73A9\u5177", "\u9694\u5C3F\u57AB", "\u5976\u5634", "\u5C3F\u4E0D\u6E7F", "\u8F85\u98DF"], "misc"]
    ];
    for (const [keywords, category] of rules) {
      if (keywords.some((keyword) => n.includes(keyword))) return category;
    }
    return "misc";
  }
  function catInfo(id) {
    return DEFAULT_CATEGORIES.find((cat) => cat.id === id) || { id: "misc", name: "\u6742\u7269", cssClass: "cat-misc" };
  }
  function bagName(id, bags = DEFAULT_BAGS) {
    const bag = (bags || []).find((entry) => entry.id === id);
    return bag ? bag.name : "\u672A\u5206\u914D";
  }
  function suggestBagForItem(name, category) {
    const n = String(name || "");
    if (["\u75AB\u82D7\u672C", "\u9000\u70E7\u8D34", "\u9000\u70ED\u8D34", "\u533B\u4FDD\u5361"].some((keyword) => n.includes(keyword))) return "bag-baby-vaccine";
    if (["\u5976\u74F6", "\u5976\u7C89", "\u5976\u7C89\u683C", "\u8F85\u98DF\u7897", "\u56F4\u515C", "\u56F4\u5634", "\u4FDD\u6E29\u676F"].some((keyword) => n.includes(keyword))) return "bag-baby-feeding";
    if (["\u4FBF\u643A\u70E7\u6C34\u58F6", "\u5976\u74F6\u5237", "\u6298\u53E0\u6FA1\u76C6"].some((keyword) => n.includes(keyword))) return "bag-baby-overnight";
    if (["\u9A71\u868A\u6DB2", "\u9632\u6652\u971C", "\u4FBF\u643A\u9A6C\u6876", "\u5927\u91CF\u96F6\u98DF"].some((keyword) => n.includes(keyword))) return "bag-baby-outdoor";
    if (n.includes("\u5B9D\u5B9D") || ["\u5C3F\u4E0D\u6E7F", "\u7EB8\u5C3F\u88E4", "\u9694\u5C3F\u57AB", "\u68C9\u67D4\u5DFE", "\u6E7F\u5DFE\uFF08\u5A74\u513F\u4E13\u7528\uFF09", "\u5907\u7528\u8863\u88E4", "\u5B89\u629A\u5976\u5634", "\u53E3\u6C34\u5DFE"].some((keyword) => n.includes(keyword))) return "bag-baby";
    return CATEGORY_BAG_MAP[category] || "bag-misc";
  }

  // src/data/seeds.js
  var OFFICIAL_MODULES = [
    {
      id: "module-hygiene",
      name: "\u6D17\u6F31\u5305",
      icon: "\u{1F9F4}",
      purpose: "starter",
      desc: "\u8FC7\u591C\u548C\u4E2D\u77ED\u9014\u90FD\u80FD\u76F4\u63A5\u590D\u7528\u7684\u57FA\u7840\u6D17\u6F31\u6A21\u5757\u3002",
      tags: ["\u57FA\u7840", "\u8FC7\u591C", "\u9AD8\u9891"],
      items: [
        { name: "\u7259\u5237\u7259\u818F", c: "hygiene" },
        { name: "\u6D17\u9762\u5976", c: "hygiene" },
        { name: "\u68B3\u5B50", c: "hygiene" },
        { name: "\u6F31\u53E3\u6C34", c: "hygiene" },
        { name: "\u7259\u7EBF", c: "hygiene" },
        { name: "\u6BDB\u5DFE", c: "hygiene", smart: "perPerson" },
        { name: "\u6D17\u53D1\u6C34\u5206\u88C5\u74F6", c: "hygiene" },
        { name: "\u62A4\u53D1\u7D20\u5206\u88C5\u74F6", c: "hygiene" },
        { name: "\u6C90\u6D74\u9732\u5206\u88C5\u74F6", c: "hygiene" },
        { name: "\u6298\u53E0\u7259\u5237\u676F", c: "hygiene" }
      ]
    },
    {
      id: "module-makeup",
      name: "\u5316\u5986\u5305",
      icon: "\u{1F484}",
      purpose: "starter",
      desc: "\u628A\u5986\u9762\u9700\u8981\u7684\u56FA\u5B9A\u7269\u54C1\u6536\u6210\u4E00\u4E2A\u5C0F\u5305\uFF0C\u51FA\u884C\u65F6\u6309\u9700\u52FE\u9009\u3002",
      tags: ["\u5986\u9762", "\u56FA\u5B9A\u642D\u914D", "\u9AD8\u9891"],
      items: [
        { name: "\u53E3\u7EA2", c: "makeup" },
        { name: "\u5507\u91C9", c: "makeup" },
        { name: "\u7C89\u5E95\u6DB2", c: "makeup" },
        { name: "\u7C89\u6251", c: "makeup" },
        { name: "\u6C14\u57AB", c: "makeup" },
        { name: "\u773C\u5F71\u76D8", c: "makeup" },
        { name: "\u7709\u7B14", c: "makeup" },
        { name: "\u773C\u7EBF\u7B14", c: "makeup" },
        { name: "\u776B\u6BDB\u818F", c: "makeup" },
        { name: "\u816E\u7EA2", c: "makeup" },
        { name: "\u6563\u7C89", c: "makeup" },
        { name: "\u9AD8\u5149", c: "makeup" },
        { name: "\u4FEE\u5BB9", c: "makeup" },
        { name: "\u906E\u7455", c: "makeup" },
        { name: "\u5B9A\u5986\u55B7\u96FE", c: "makeup" },
        { name: "\u7F8E\u5986\u86CB", c: "makeup" },
        { name: "\u5316\u5986\u5237", c: "makeup" }
      ]
    },
    {
      id: "module-docs",
      name: "\u8BC1\u4EF6\u5305",
      icon: "\u{1F4C1}",
      purpose: "daily",
      desc: "\u6240\u6709\u9700\u8981\u4E34\u51FA\u95E8\u786E\u8BA4\u7684\u8BC1\u4EF6\u3001\u652F\u4ED8\u548C\u9884\u8BA2\u5355\u636E\u7EDF\u4E00\u5F52\u4F4D\u3002",
      tags: ["\u8BC1\u4EF6", "\u652F\u4ED8", "\u968F\u624B\u5E26"],
      items: [
        { name: "\u8EAB\u4EFD\u8BC1", c: "docs" },
        { name: "\u62A4\u7167", c: "docs" },
        { name: "\u9A7E\u9A76\u8BC1", c: "docs" },
        { name: "\u94F6\u884C\u5361", c: "small-bag" },
        { name: "\u73B0\u91D1", c: "small-bag" },
        { name: "\u8F66\u7968/\u673A\u7968", c: "docs" },
        { name: "\u9152\u5E97\u9884\u8BA2\u786E\u8BA4\u5355", c: "docs" },
        { name: "\u884C\u7A0B\u5355", c: "docs" }
      ]
    },
    {
      id: "module-clothing",
      name: "\u8863\u670D\u5305",
      icon: "\u{1F455}",
      purpose: "travel",
      desc: "\u8FD9\u7C7B\u7269\u54C1\u4F1A\u6309\u884C\u7A0B\u5929\u6570\u548C\u4EBA\u6570\u81EA\u52A8\u7ED9\u51FA\u5EFA\u8BAE\u6570\u91CF\u3002",
      tags: ["\u667A\u80FD\u586B\u5145", "\u8863\u7269", "\u6309\u5929\u6570"],
      items: [
        { name: "T\u6064/\u4E0A\u8863", c: "clothing", smart: "perPersonPerDay" },
        { name: "\u886C\u886B", c: "clothing", smart: "perPersonPerDay" },
        { name: "\u88E4\u5B50/\u88D9\u5B50", c: "clothing", smart: "perPersonPerDay" },
        { name: "\u5185\u8863", c: "clothing", smart: "perPersonPerDay" },
        { name: "\u5185\u88E4", c: "clothing", smart: "perPersonPerDay" },
        { name: "\u889C\u5B50", c: "clothing", smart: "perPersonPerDay" },
        { name: "\u7761\u8863", c: "clothing", smart: "perPerson" },
        { name: "\u8F7B\u8584\u5916\u5957", c: "clothing", smart: "perPerson" },
        { name: "\u8FD0\u52A8\u978B", c: "clothing", smart: "perPerson" },
        { name: "\u62D6\u978B", c: "clothing", smart: "perPerson" }
      ]
    },
    {
      id: BABY_MODULE_IDS.base,
      name: "\u5B9D\u5B9D\u57FA\u7840\u5305",
      icon: "\u{1F37C}",
      purpose: "family",
      group: "baby",
      role: "base",
      defaultOn: true,
      desc: "\u6240\u6709\u5E26\u5A03\u884C\u7A0B\u7684\u9ED8\u8BA4\u5E95\u76D8\uFF0C\u4F1A\u5728\u9009\u62E9\u4EFB\u4E00\u5B9D\u5B9D\u63D2\u4EF6\u5305\u65F6\u81EA\u52A8\u5E26\u4E0A\u3002",
      tags: ["\u5B9D\u5B9D", "\u9ED8\u8BA4\u5F00\u542F", "\u57FA\u7840\u5E95\u76D8"],
      items: [
        { name: "\u5C3F\u4E0D\u6E7F", c: "misc", q: 2, bag: "bag-baby" },
        { name: "\u6E7F\u5DFE\uFF08\u5A74\u513F\u4E13\u7528\uFF09", c: "misc", q: 1, bag: "bag-baby" },
        { name: "\u68C9\u67D4\u5DFE", c: "misc", q: 1, bag: "bag-baby" },
        { name: "\u9694\u5C3F\u57AB", c: "misc", q: 1, bag: "bag-baby" },
        { name: "\u5907\u7528\u8863\u88E4", c: "clothing", q: 1, bag: "bag-baby" },
        { name: "\u5B89\u629A\u5976\u5634", c: "misc", q: 1, bag: "bag-baby" }
      ]
    },
    {
      id: BABY_MODULE_IDS.vaccine,
      name: "\u75AB\u82D7\u63D2\u4EF6\u5305",
      icon: "\u{1F489}",
      purpose: "family",
      group: "baby",
      role: "addon",
      desc: "\u5E26\u5B9D\u5B9D\u53BB\u6253\u75AB\u82D7\u3001\u4F53\u68C0\u8FD9\u7C7B\u534A\u5929\u5916\u51FA\u65F6\u53E0\u52A0\u7684\u8BC1\u4EF6\u548C\u5E94\u6025\u63D2\u4EF6\u3002",
      tags: ["\u5B9D\u5B9D", "\u63D2\u4EF6", "\u77ED\u65F6\u5916\u51FA"],
      items: [
        { name: "\u75AB\u82D7\u672C", c: "docs", bag: "bag-baby-vaccine" },
        { name: "\u9000\u70E7\u8D34", c: "medicine", q: 2, bag: "bag-baby-vaccine" },
        { name: "\u533B\u4FDD\u5361", c: "docs", bag: "bag-baby-vaccine" }
      ]
    },
    {
      id: BABY_MODULE_IDS.feeding,
      name: "\u5582\u517B\u63D2\u4EF6\u5305",
      icon: "\u{1F9C3}",
      purpose: "family",
      group: "baby",
      role: "addon",
      desc: "\u5976\u7C89\u3001\u5976\u74F6\u548C\u8F85\u98DF\u76F8\u5173\u7269\u54C1\u96C6\u4E2D\u6210\u5305\uFF0C\u6309\u5582\u517B\u9700\u6C42\u968F\u65F6\u53E0\u52A0\u3002",
      tags: ["\u5B9D\u5B9D", "\u63D2\u4EF6", "\u5582\u517B"],
      items: [
        { name: "\u5976\u7C89\u683C", c: "misc", bag: "bag-baby-feeding" },
        { name: "\u5976\u74F6", c: "misc", q: 2, bag: "bag-baby-feeding" },
        { name: "\u4FDD\u6E29\u676F", c: "misc", bag: "bag-baby-feeding" },
        { name: "\u8F85\u98DF\u7897", c: "misc", bag: "bag-baby-feeding" },
        { name: "\u56F4\u515C", c: "misc", q: 1, bag: "bag-baby-feeding" }
      ]
    },
    {
      id: BABY_MODULE_IDS.overnight,
      name: "\u8FC7\u591C\u63D2\u4EF6\u5305",
      icon: "\u{1F319}",
      purpose: "family",
      group: "baby",
      role: "addon",
      desc: "\u53EA\u5728\u5E26\u5B9D\u5B9D\u5916\u4F4F\u65F6\u6253\u5F00\uFF0C\u8865\u8DB3\u6D17\u5976\u74F6\u3001\u6D17\u6FA1\u548C\u591C\u95F4\u6362\u6D17\u76F8\u5173\u7269\u54C1\u3002",
      tags: ["\u5B9D\u5B9D", "\u63D2\u4EF6", "\u8FC7\u591C"],
      items: [
        { name: "\u4FBF\u643A\u70E7\u6C34\u58F6", c: "misc", bag: "bag-baby-overnight" },
        { name: "\u5976\u74F6\u5237", c: "misc", bag: "bag-baby-overnight" },
        { name: "\u6298\u53E0\u6FA1\u76C6", c: "misc", bag: "bag-baby-overnight" },
        { name: "\u7761\u8863", c: "clothing", q: 1, bag: "bag-baby-overnight" }
      ]
    },
    {
      id: BABY_MODULE_IDS.outdoor,
      name: "\u6237\u5916\u63D2\u4EF6\u5305",
      icon: "\u26F0\uFE0F",
      purpose: "family",
      group: "baby",
      role: "addon",
      desc: "\u722C\u5C71\u3001\u9732\u8425\u3001\u516C\u56ED\u4E45\u5F85\u65F6\u53E0\u52A0\uFF0C\u91CD\u70B9\u8865\u9632\u62A4\u548C\u6237\u5916\u8865\u7ED9\u3002",
      tags: ["\u5B9D\u5B9D", "\u63D2\u4EF6", "\u6237\u5916"],
      items: [
        { name: "\u9A71\u868A\u6DB2", c: "skincare", bag: "bag-baby-outdoor" },
        { name: "\u9632\u6652\u971C", c: "skincare", bag: "bag-baby-outdoor" },
        { name: "\u4FBF\u643A\u9A6C\u6876", c: "misc", bag: "bag-baby-outdoor" },
        { name: "\u5927\u91CF\u96F6\u98DF", c: "misc", q: 2, bag: "bag-baby-outdoor" }
      ]
    },
    {
      id: "module-electronics",
      name: "\u7535\u5B50\u5305",
      icon: "\u{1F50C}",
      purpose: "travel",
      desc: "\u957F\u77ED\u9014\u90FD\u80FD\u76F4\u63A5\u62FF\u8D70\u7684\u5145\u7535\u3001\u62CD\u6444\u548C\u529E\u516C\u7535\u5B50\u6A21\u5757\u3002",
      tags: ["\u7535\u5B50", "\u5145\u7535", "\u529E\u516C"],
      items: [
        { name: "\u624B\u673A", c: "electronics" },
        { name: "\u5145\u7535\u5668\uFF08\u624B\u673A\uFF09", c: "electronics" },
        { name: "\u6570\u636E\u7EBF", c: "electronics", q: 2 },
        { name: "\u5145\u7535\u5B9D", c: "electronics" },
        { name: "\u8033\u673A", c: "electronics" },
        { name: "Apple Watch \u5145\u7535\u5668", c: "electronics" },
        { name: "iPad", c: "electronics" },
        { name: "iPad \u5145\u7535\u5668", c: "electronics" },
        { name: "\u7B14\u8BB0\u672C\u7535\u8111", c: "electronics" },
        { name: "\u5145\u7535\u5668\uFF08\u7535\u8111\uFF09", c: "electronics" },
        { name: "\u8F6C\u6362\u63D2\u5934", c: "electronics" }
      ]
    },
    {
      id: "module-camping",
      name: "\u9732\u8425\u57FA\u7840\u5305",
      icon: "\u26FA",
      purpose: "travel",
      desc: "\u6237\u5916\u9732\u8425\u7684\u5B8C\u6574\u88C5\u5907\uFF0C\u5305\u542B\u8D77\u5C45\u3001\u70F9\u996A\u3001\u7167\u660E\u3001\u6E05\u6D01\u7B4921\u7C7B\u5FC5\u5907\u7269\u54C1\u3002",
      tags: ["\u9732\u8425", "\u6237\u5916", "\u5B8C\u6574\u88C5\u5907"],
      items: [
        { name: "\u7259\u5237\u7259\u818F", c: "hygiene" },
        { name: "\u7259\u7EBF", c: "hygiene" },
        { name: "\u6D17\u9762\u5976", c: "hygiene" },
        { name: "\u6BDB\u5DFE", c: "hygiene" },
        { name: "\u906E\u9633\u4F1E", c: "misc" },
        { name: "\u9632\u6652\u971C", c: "skincare" },
        { name: "\u58A8\u955C", c: "small-bag" },
        { name: "\u5E3D\u5B50", c: "clothing" },
        { name: "\u4FDD\u6E29\u7BB1", c: "big-bag" },
        { name: "\u51B0\u888B\uFF08\u5DF2\u653E\u51B0\u7BB1\uFF09", c: "misc" },
        { name: "\u676F\u5B50", c: "misc" },
        { name: "\u5E10\u7BF7", c: "big-bag" },
        { name: "\u7761\u888B", c: "big-bag" },
        { name: "\u62D6\u978B", c: "clothing" },
        { name: "\u9A71\u868A\u6C34", c: "skincare" },
        { name: "\u65E0\u6BD4\u6EF4", c: "skincare" },
        { name: "\u711A\u706B\u53F0", c: "misc" },
        { name: "\u9632\u706B\u5E03", c: "misc" },
        { name: "\u5361\u5F0F\u7089", c: "misc" },
        { name: "\u70E7\u70E4\u7089", c: "misc" },
        { name: "\u94C1\u677F", c: "misc" },
        { name: "\u7AF9\u70AD", c: "misc" },
        { name: "\u6C14\u7F50", c: "misc" },
        { name: "\u706B\u67F4", c: "misc" },
        { name: "\u706B\u67AA", c: "misc" },
        { name: "\u949B\u676F", c: "misc" },
        { name: "\u9A6C\u514B\u676F", c: "misc" },
        { name: "\u94A2\u7897", c: "misc" },
        { name: "\u7B77\u5B50", c: "misc" },
        { name: "\u8336\u5177", c: "misc" },
        { name: "\u4E00\u6B21\u6027\u7B77\u5B50\u9910\u5177", c: "misc" },
        { name: "\u5929\u5E55", c: "big-bag" },
        { name: "\u9732\u8425\u8F66", c: "big-bag" },
        { name: "\u9732\u8425\u684C", c: "big-bag" },
        { name: "\u9732\u8425\u6905", c: "big-bag", q: 5 },
        { name: "\u8336\u53F6\u5496\u5561", c: "misc" },
        { name: "\u4FDD\u6696\u8863\u670D", c: "clothing" },
        { name: "\u51B2\u950B\u8863", c: "clothing" },
        { name: "\u957F\u88E4", c: "clothing" },
        { name: "\u6362\u6D17\u8863\u670D", c: "clothing", smart: "perPersonPerDay" },
        { name: "bose\u97F3\u54CD", c: "electronics" },
        { name: "\u4E3B\u706F", c: "electronics" },
        { name: "\u5934\u706F", c: "electronics" },
        { name: "\u6302\u706F", c: "electronics" },
        { name: "\u6C1B\u56F4\u706F", c: "electronics" },
        { name: "\u53A8\u623F\u526A\u5200", c: "misc" },
        { name: "\u70E4\u8089\u5939", c: "misc" },
        { name: "\u6C34\u679C\u5200", c: "misc" },
        { name: "\u83DC\u5200", c: "misc" },
        { name: "\u6D17\u6D01\u7CBE", c: "misc" },
        { name: "\u6D17\u7897\u6D77\u7EF5", c: "misc" },
        { name: "\u7EB8\u5DFE", c: "misc" },
        { name: "\u62B9\u5E03", c: "misc" },
        { name: "\u6E7F\u5DFE", c: "misc" },
        { name: "\u5B5C\u7136\u7C89", c: "misc" },
        { name: "\u80E1\u6912\u7C89", c: "misc" },
        { name: "\u76D0", c: "misc" },
        { name: "\u6CB9", c: "misc" },
        { name: "\u9171\u6CB9", c: "misc" },
        { name: "\u65E0\u4EBA\u673A", c: "electronics" },
        { name: "\u5355\u53CD", c: "electronics" },
        { name: "\u4E09\u811A\u67B6", c: "electronics" },
        { name: "\u79FB\u52A8\u7535\u6E90", c: "electronics" },
        { name: "\u624B\u673A\u5145\u7535\u7EBF", c: "electronics" },
        { name: "\u5145\u7535\u5B9D", c: "electronics" },
        { name: "\u5783\u573E\u888B", c: "misc" },
        { name: "\u5783\u573E\u888B\u652F\u67B6", c: "misc" },
        { name: "\u5730\u9489", c: "misc" },
        { name: "\u9524\u5B50", c: "misc" }
      ]
    }
  ];
  var BASE_LIBRARY_ITEMS = [
    { name: "\u8EAB\u4EFD\u8BC1", category: "docs" },
    { name: "\u62A4\u7167", category: "docs" },
    { name: "\u9A7E\u9A76\u8BC1", category: "docs" },
    { name: "\u5DE5\u4F5C\u8BC1/\u95E8\u7981\u5361", category: "docs" },
    { name: "\u793E\u4FDD\u5361", category: "docs" },
    { name: "\u533B\u4FDD\u5361", category: "docs" },
    { name: "\u5B9D\u5B9D\u51FA\u751F\u8BC1\u660E", category: "docs" },
    { name: "\u6237\u53E3\u672C", category: "docs" },
    { name: "\u5B66\u751F\u8BC1", category: "docs" },
    { name: "\u8F66\u7968/\u673A\u7968", category: "docs" },
    { name: "\u9152\u5E97\u9884\u8BA2\u786E\u8BA4\u5355", category: "docs" },
    { name: "\u884C\u7A0B\u5355", category: "docs" },
    { name: "\u4FDD\u9669\u4FDD\u5355", category: "docs" },
    { name: "\u94F6\u884C\u5361", category: "small-bag" },
    { name: "\u73B0\u91D1", category: "small-bag" },
    { name: "\u94B1\u5305", category: "small-bag" },
    { name: "\u94A5\u5319", category: "small-bag" },
    { name: "\u53E3\u7F69", category: "small-bag", defaultQty: 3 },
    { name: "\u58A8\u955C", category: "small-bag" },
    { name: "\u53D1\u7EF3", category: "small-bag" },
    { name: "\u7EB8\u5DFE", category: "misc" },
    { name: "\u6E7F\u5DFE", category: "misc" },
    { name: "\u6E7F\u5DFE\uFF08\u5A74\u513F\u4E13\u7528\uFF09", category: "misc", defaultQty: 2, bag: "bag-baby" },
    { name: "\u5783\u573E\u888B", category: "misc", defaultQty: 3 },
    { name: "\u4FDD\u9C9C\u888B", category: "misc" },
    { name: "\u6536\u7EB3\u888B", category: "big-bag" },
    { name: "\u538B\u7F29\u888B", category: "big-bag" },
    { name: "\u6298\u53E0\u8D2D\u7269\u888B", category: "big-bag" },
    { name: "\u96E8\u4F1E", category: "misc" },
    { name: "\u4FDD\u6E29\u676F", category: "misc" },
    { name: "\u6C34\u676F", category: "misc" },
    { name: "\u96F6\u98DF", category: "misc" },
    { name: "\u7B14", category: "misc" },
    { name: "\u884C\u674E\u724C", category: "misc" },
    { name: "\u884C\u674E\u9501", category: "misc" },
    { name: "U\u578B\u6795", category: "misc" },
    { name: "\u773C\u7F69", category: "misc" },
    { name: "\u8033\u585E", category: "small-bag" },
    { name: "\u5976\u74F6", category: "misc", defaultQty: 2, bag: "bag-baby", smartRule: "perPerson" },
    { name: "\u5976\u7C89", category: "misc", bag: "bag-baby" },
    { name: "\u5976\u74F6\u5237", category: "misc", bag: "bag-baby" },
    { name: "\u5B9D\u5B9D\u5976\u5634", category: "misc", defaultQty: 2, bag: "bag-baby" },
    { name: "\u56F4\u515C", category: "misc", defaultQty: 1, bag: "bag-baby", smartRule: "perPersonPerDay" },
    { name: "\u5B89\u629A\u73A9\u5177", category: "misc", bag: "bag-baby" },
    { name: "\u9694\u5C3F\u57AB", category: "misc", defaultQty: 2, bag: "bag-baby" },
    { name: "\u68C9\u67D4\u5DFE", category: "misc", bag: "bag-baby" },
    { name: "\u8F85\u98DF\u526A", category: "misc", bag: "bag-baby" },
    { name: "\u8F85\u98DF\u7897", category: "misc", bag: "bag-baby" },
    { name: "\u5C3F\u4E0D\u6E7F", category: "misc", defaultQty: 5, bag: "bag-baby", smartRule: "perPersonPerDay" },
    { name: "\u624B\u673A", category: "electronics" },
    { name: "\u5145\u7535\u5668\uFF08\u624B\u673A\uFF09", category: "electronics" },
    { name: "\u6570\u636E\u7EBF", category: "electronics", defaultQty: 2 },
    { name: "\u53CC\u5934\u5145\u7535\u7EBF", category: "electronics" },
    { name: "\u5145\u7535\u5B9D", category: "electronics" },
    { name: "\u8033\u673A", category: "electronics" },
    { name: "\u964D\u566A\u8033\u673A", category: "electronics" },
    { name: "Apple Watch \u5145\u7535\u5668", category: "electronics" },
    { name: "iPad", category: "electronics" },
    { name: "iPad \u5145\u7535\u5668", category: "electronics" },
    { name: "\u7B14\u8BB0\u672C\u7535\u8111", category: "electronics" },
    { name: "\u5145\u7535\u5668\uFF08\u7535\u8111\uFF09", category: "electronics" },
    { name: "\u9F20\u6807", category: "electronics" },
    { name: "\u76F8\u673A", category: "electronics" },
    { name: "\u76F8\u673A\u5907\u7528\u7535\u6C60", category: "electronics" },
    { name: "\u76F8\u673A\u5145\u7535\u5668", category: "electronics" },
    { name: "\u8BFB\u5361\u5668", category: "electronics" },
    { name: "\u81EA\u62CD\u6746", category: "electronics" },
    { name: "\u8F6C\u6362\u63D2\u5934", category: "electronics" },
    { name: "\u63D2\u7EBF\u677F", category: "electronics" },
    { name: "\u624B\u7535\u7B52", category: "electronics" },
    { name: "\u9732\u8425\u706F", category: "electronics" },
    { name: "\u7259\u5237\u7259\u818F", category: "hygiene" },
    { name: "\u7535\u52A8\u7259\u5237", category: "hygiene" },
    { name: "\u6F31\u53E3\u6C34", category: "hygiene" },
    { name: "\u7259\u7EBF", category: "hygiene" },
    { name: "\u6D17\u9762\u5976", category: "hygiene" },
    { name: "\u68B3\u5B50", category: "hygiene" },
    { name: "\u5243\u987B\u5200", category: "hygiene" },
    { name: "\u6BDB\u5DFE", category: "hygiene", smartRule: "perPerson" },
    { name: "\u6D74\u5DFE", category: "hygiene", smartRule: "perPerson" },
    { name: "\u6D17\u53D1\u6C34\u5206\u88C5\u74F6", category: "hygiene" },
    { name: "\u62A4\u53D1\u7D20\u5206\u88C5\u74F6", category: "hygiene" },
    { name: "\u6C90\u6D74\u9732\u5206\u88C5\u74F6", category: "hygiene" },
    { name: "\u6298\u53E0\u7259\u5237\u676F", category: "hygiene" },
    { name: "\u6DA6\u5507\u818F", category: "skincare" },
    { name: "\u9632\u6652\u971C", category: "skincare" },
    { name: "\u9762\u971C", category: "skincare" },
    { name: "\u4E73\u6DB2", category: "skincare" },
    { name: "\u7CBE\u534E", category: "skincare" },
    { name: "\u9762\u819C", category: "skincare", defaultQty: 2 },
    { name: "\u8EAB\u4F53\u4E73", category: "skincare" },
    { name: "\u62A4\u624B\u971C", category: "skincare" },
    { name: "\u55B7\u96FE", category: "skincare" },
    { name: "\u9A71\u868A\u6DB2", category: "skincare" },
    { name: "\u62A4\u81C0\u818F", category: "skincare", bag: "bag-baby" },
    { name: "\u82A6\u835F\u80F6", category: "skincare" },
    { name: "\u53E3\u7EA2", category: "makeup" },
    { name: "\u5507\u91C9", category: "makeup" },
    { name: "\u7C89\u5E95\u6DB2", category: "makeup" },
    { name: "\u7C89\u6251", category: "makeup" },
    { name: "\u6C14\u57AB", category: "makeup" },
    { name: "\u773C\u5F71\u76D8", category: "makeup" },
    { name: "\u7709\u7B14", category: "makeup" },
    { name: "\u773C\u7EBF\u7B14", category: "makeup" },
    { name: "\u776B\u6BDB\u818F", category: "makeup" },
    { name: "\u816E\u7EA2", category: "makeup" },
    { name: "\u6563\u7C89", category: "makeup" },
    { name: "\u9AD8\u5149", category: "makeup" },
    { name: "\u4FEE\u5BB9", category: "makeup" },
    { name: "\u906E\u7455", category: "makeup" },
    { name: "\u5986\u524D\u4E73", category: "makeup" },
    { name: "\u5B9A\u5986\u55B7\u96FE", category: "makeup" },
    { name: "\u7F8E\u5986\u86CB", category: "makeup" },
    { name: "\u5316\u5986\u5237", category: "makeup" },
    { name: "\u5378\u5986\u6CB9", category: "makeup" },
    { name: "\u5378\u5986\u6E7F\u5DFE", category: "makeup" },
    { name: "\u9999\u6C34", category: "makeup" },
    { name: "T\u6064/\u4E0A\u8863", category: "clothing", smartRule: "perPersonPerDay" },
    { name: "\u886C\u886B", category: "clothing", smartRule: "perPersonPerDay" },
    { name: "\u88E4\u5B50/\u88D9\u5B50", category: "clothing", smartRule: "perPersonPerDay" },
    { name: "\u8FDE\u8863\u88D9", category: "clothing", smartRule: "perPersonPerDay" },
    { name: "\u7761\u8863", category: "clothing", smartRule: "perPerson" },
    { name: "\u5185\u8863", category: "clothing", defaultQty: 1, smartRule: "perPersonPerDay" },
    { name: "\u5185\u88E4", category: "clothing", defaultQty: 1, smartRule: "perPersonPerDay" },
    { name: "\u6587\u80F8", category: "clothing", defaultQty: 1, smartRule: "perPersonPerDay" },
    { name: "\u889C\u5B50", category: "clothing", defaultQty: 1, smartRule: "perPersonPerDay" },
    { name: "\u6253\u5E95\u88E4", category: "clothing", defaultQty: 1, smartRule: "perPersonPerDay" },
    { name: "\u8F7B\u8584\u5916\u5957", category: "clothing", smartRule: "perPerson" },
    { name: "\u8FD0\u52A8\u978B", category: "clothing", smartRule: "perPerson" },
    { name: "\u62D6\u978B", category: "clothing", smartRule: "perPerson" },
    { name: "\u5B9D\u5B9D\u8863\u670D", category: "clothing", defaultQty: 2, bag: "bag-baby", smartRule: "perPersonPerDay" },
    { name: "\u5B9D\u5B9D\u889C\u5B50", category: "clothing", defaultQty: 1, bag: "bag-baby", smartRule: "perPersonPerDay" },
    { name: "\u53E3\u6C34\u5DFE", category: "clothing", defaultQty: 1, bag: "bag-baby", smartRule: "perPersonPerDay" },
    { name: "\u5E3D\u5B50", category: "clothing", smartRule: "perPerson" },
    { name: "\u611F\u5192\u836F", category: "medicine" },
    { name: "\u9000\u70E7\u836F", category: "medicine" },
    { name: "\u9000\u70E7\u836F\uFF08\u513F\u7AE5\uFF09", category: "medicine", bag: "bag-baby" },
    { name: "\u4F53\u6E29\u8BA1", category: "medicine", bag: "bag-baby" },
    { name: "\u9000\u70E7\u8D34", category: "medicine", defaultQty: 2, bag: "bag-baby-vaccine" },
    { name: "\u9000\u70ED\u8D34", category: "medicine", defaultQty: 2, bag: "bag-baby" },
    { name: "\u521B\u53EF\u8D34", category: "medicine" },
    { name: "\u7898\u4F0F\u68C9\u7B7E", category: "medicine" },
    { name: "\u6B62\u75DB\u836F", category: "medicine" },
    { name: "\u6655\u8F66\u836F", category: "medicine" },
    { name: "\u80A0\u80C3\u836F", category: "medicine" },
    { name: "\u8FC7\u654F\u836F", category: "medicine" },
    { name: "\u6D88\u6BD2\u55B7\u96FE", category: "medicine" },
    { name: "\u5E38\u5907\u836F", category: "medicine" }
  ];

  // src/data/models.js
  function normalizeRecord(record) {
    const type = record.recordType || (record.isTemplate ? "module" : "trip");
    return type === "module" ? normalizeModuleRecord(record) : normalizeTripRecord(record);
  }
  function normalizeTripRecord(record) {
    const bags = Array.isArray(record.bags) && record.bags.length ? record.bags : deepClone(DEFAULT_BAGS);
    return {
      ...record,
      recordType: "trip",
      isTemplate: false,
      days: Math.max(1, parseInt(record.days) || 1),
      people: Math.max(1, parseInt(record.people) || 1),
      bags,
      sourceModules: Array.isArray(record.sourceModules) ? record.sourceModules.map((module) => ({
        source: module.source || "custom",
        id: module.id || "",
        name: module.name || "\u672A\u547D\u540D\u5C0F\u5305"
      })) : [],
      items: (record.items || []).map(normalizeTripItem),
      createdAt: record.createdAt || (/* @__PURE__ */ new Date()).toISOString(),
      updatedAt: record.updatedAt || record.createdAt || (/* @__PURE__ */ new Date()).toISOString()
    };
  }
  function normalizeOfficialModule(module) {
    return {
      id: module?.id || "official-module-" + gid(),
      name: module?.name || "\u672A\u547D\u540D\u5B98\u65B9\u5C0F\u5305",
      icon: module?.icon || "\u{1F9F0}",
      purpose: module?.purpose || "starter",
      group: module?.group || "",
      role: module?.role || "",
      defaultOn: Boolean(module?.defaultOn),
      desc: module?.desc || "",
      tags: Array.isArray(module?.tags) ? uniqueStrings(module.tags) : [],
      items: (module?.items || []).map(normalizeModuleItem)
    };
  }
  function normalizeModuleRecord(record) {
    return {
      ...record,
      recordType: "module",
      isTemplate: true,
      icon: record.icon || record.kitMeta?.icon || "\u{1F9F0}",
      desc: record.desc || record.kitMeta?.desc || "",
      purpose: record.purpose || "custom",
      tags: Array.isArray(record.tags) ? record.tags : [],
      items: (record.items || []).map(normalizeModuleItem),
      createdAt: record.createdAt || (/* @__PURE__ */ new Date()).toISOString(),
      updatedAt: record.updatedAt || record.createdAt || (/* @__PURE__ */ new Date()).toISOString()
    };
  }
  function normalizeTripItem(item) {
    const category = item.category || guessCat(item.name || "");
    const smartConfig = normalizeSmartConfig(item.smartConfig || inferSmartConfig(item.name, category));
    return {
      id: item.id || "item-" + gid(),
      name: item.name || "\u672A\u547D\u540D\u7269\u54C1",
      category,
      bag: item.bag || suggestBagForItem(item.name, category),
      qty: Math.max(1, parseInt(item.qty) || 1),
      packed: Boolean(item.packed),
      notes: item.notes || "",
      smartRule: item.smartRule || (smartConfig ? "formula" : "fixed"),
      smartConfig,
      smartBaseQty: Math.max(1, parseInt(item.smartBaseQty) || parseInt(item.defaultQty) || parseInt(item.qty) || 1),
      smartLocked: Boolean(item.smartLocked),
      sourceModules: Array.isArray(item.sourceModules) ? uniqueStrings(item.sourceModules) : item.sourceModule ? [item.sourceModule] : [],
      tags: Array.isArray(item?.tags) ? uniqueStrings(item.tags) : []
    };
  }
  function normalizeModuleItem(item) {
    const category = item.category || guessCat(item.name || "");
    const smartConfig = normalizeSmartConfig(item.smartConfig || inferSmartConfig(item.name, category));
    return {
      id: item.id || "module-item-" + gid(),
      name: item.name || "\u672A\u547D\u540D\u7269\u54C1",
      category,
      bag: item.bag || suggestBagForItem(item.name, category),
      defaultQty: Math.max(1, parseInt(item.defaultQty) || parseInt(item.smartBaseQty) || parseInt(item.qty) || 1),
      smartRule: item.smartRule || (smartConfig ? "formula" : inferSmartRule(item.name, category)),
      smartConfig
    };
  }
  function normalizeLibraryItem(item) {
    const name = String(item?.name || "\u672A\u547D\u540D\u7269\u54C1").trim();
    const category = item?.category || guessCat(name);
    const smartConfig = normalizeSmartConfig(item?.smartConfig || inferSmartConfig(name, category));
    return {
      id: item?.id || "asset-" + gid(),
      name,
      category,
      defaultQty: Math.max(1, parseInt(item?.defaultQty) || 1),
      bag: item?.bag || suggestBagForItem(name, category),
      smartRule: smartConfig ? "formula" : item?.smartRule || inferSmartRule(name, category),
      smartConfig,
      source: item?.source === "user" ? "user" : "system",
      tags: Array.isArray(item?.tags) ? uniqueStrings(item.tags) : []
    };
  }

  // src/data/smartFill.js
  function normalizeSmartConfig(config) {
    if (!config) return null;
    const sceneFactors = {};
    const rawSceneFactors = config.sceneFactors || {};
    Object.keys(rawSceneFactors).forEach((key) => {
      const value = parseInt(rawSceneFactors[key]);
      if (Number.isFinite(value) && value > 0) sceneFactors[key] = value;
    });
    return {
      mode: "formula",
      dailyIncrement: Math.max(0, parseInt(config.dailyIncrement) || parseInt(config.perDay) || 0),
      personIncrement: Math.max(0, parseInt(config.personIncrement) || 0),
      sceneFactors
    };
  }
  function mergeSmartConfig(currentConfig, nextConfig) {
    const current = normalizeSmartConfig(currentConfig);
    const next = normalizeSmartConfig(nextConfig);
    if (!current) return next;
    if (!next) return current;
    const mergedSceneFactors = { ...current.sceneFactors };
    Object.keys(next.sceneFactors).forEach((key) => {
      mergedSceneFactors[key] = Math.max(mergedSceneFactors[key] || 0, next.sceneFactors[key]);
    });
    return {
      mode: "formula",
      dailyIncrement: Math.max(current.dailyIncrement, next.dailyIncrement),
      personIncrement: Math.max(current.personIncrement, next.personIncrement),
      sceneFactors: mergedSceneFactors
    };
  }
  function getSmartSceneFactor(smartConfig, tripContext) {
    const config = normalizeSmartConfig(smartConfig);
    if (!config || !tripContext?.sourceModules?.length) return 0;
    const activeModuleIds = new Set((tripContext.sourceModules || []).map((module) => module.id));
    return Object.keys(config.sceneFactors).reduce((sum, moduleId) => sum + (activeModuleIds.has(moduleId) ? config.sceneFactors[moduleId] : 0), 0);
  }
  function computeSmartQty(baseQty, smartRule, days, people, smartConfig = null, tripContext = null) {
    const safeBase = Math.max(1, parseInt(baseQty) || 1);
    const safeDays = Math.max(1, parseInt(days) || 1);
    const safePeople = Math.max(1, parseInt(people) || 1);
    if (smartRule === "formula") {
      const config = normalizeSmartConfig(smartConfig);
      if (!config) return safeBase;
      return Math.max(1, safeBase + safeDays * config.dailyIncrement + Math.max(0, safePeople - 1) * config.personIncrement + getSmartSceneFactor(config, tripContext));
    }
    if (smartRule === "perPerson") return safeBase * safePeople;
    if (smartRule === "perDay") return safeBase * safeDays;
    if (smartRule === "perPersonPerDay") return safeBase * safeDays * safePeople;
    return safeBase;
  }
  function strongerSmartRule(currentRule, nextRule) {
    const order = { fixed: 0, perPerson: 1, perDay: 2, perPersonPerDay: 3, formula: 4 };
    return (order[nextRule] || 0) > (order[currentRule] || 0) ? nextRule : currentRule;
  }
  function smartRuleLabel(rule, smartConfig = null) {
    if (rule === "formula") {
      const config = normalizeSmartConfig(smartConfig);
      if (!config) return "\u57FA\u7840\u91CF + \u5929\u6570\u589E\u91CF + \u573A\u666F\u7CFB\u6570";
      return `\u57FA\u7840\u91CF + ${config.dailyIncrement}\xD7\u5929\u6570 + \u573A\u666F\u7CFB\u6570`;
    }
    if (rule === "perPerson") return "\u6309\u4EBA\u6570\u5EFA\u8BAE";
    if (rule === "perDay") return "\u6309\u5929\u6570\u5EFA\u8BAE";
    if (rule === "perPersonPerDay") return "\u6309\u5929\u6570 \xD7 \u4EBA\u6570\u5EFA\u8BAE";
    return "\u56FA\u5B9A\u6570\u91CF";
  }
  function smartRuleShort(rule) {
    if (rule === "formula") return "\u516C\u5F0F\u8865\u91CF";
    if (rule === "perPerson") return "\u6309\u4EBA\u6570";
    if (rule === "perDay") return "\u6309\u5929\u6570";
    if (rule === "perPersonPerDay") return "\u6309\u5929/\u4EBA";
    return "\u56FA\u5B9A";
  }
  function inferSmartConfig(name, category) {
    const n = String(name || "").toLowerCase();
    if (["\u5C3F\u4E0D\u6E7F", "\u7EB8\u5C3F\u88E4"].some((keyword) => n.includes(keyword))) {
      return normalizeSmartConfig({
        dailyIncrement: 3,
        sceneFactors: {
          [BABY_MODULE_IDS.vaccine]: 1,
          [BABY_MODULE_IDS.feeding]: 1,
          [BABY_MODULE_IDS.overnight]: 3,
          [BABY_MODULE_IDS.outdoor]: 2
        }
      });
    }
    if (["\u5907\u7528\u8863\u88E4", "\u5B9D\u5B9D\u8863\u670D", "\u5B9D\u5B9D\u8863\u88E4"].some((keyword) => n.includes(keyword))) {
      return normalizeSmartConfig({
        dailyIncrement: 1,
        sceneFactors: {
          [BABY_MODULE_IDS.overnight]: 1,
          [BABY_MODULE_IDS.outdoor]: 1
        }
      });
    }
    if (n.includes("\u6E7F\u5DFE") && (n.includes("\u5A74\u513F") || n.includes("\u5B9D\u5B9D")) || n === "\u6E7F\u5DFE\uFF08\u5A74\u513F\u4E13\u7528\uFF09") {
      return normalizeSmartConfig({
        dailyIncrement: 1,
        sceneFactors: {
          [BABY_MODULE_IDS.overnight]: 1,
          [BABY_MODULE_IDS.outdoor]: 1
        }
      });
    }
    if (n.includes("\u68C9\u67D4\u5DFE")) {
      return normalizeSmartConfig({
        dailyIncrement: 1,
        sceneFactors: {
          [BABY_MODULE_IDS.feeding]: 1,
          [BABY_MODULE_IDS.overnight]: 1
        }
      });
    }
    if (n.includes("\u9694\u5C3F\u57AB")) {
      return normalizeSmartConfig({
        dailyIncrement: 1,
        sceneFactors: {
          [BABY_MODULE_IDS.overnight]: 1,
          [BABY_MODULE_IDS.outdoor]: 1
        }
      });
    }
    if (["\u56F4\u515C", "\u56F4\u5634", "\u53E3\u6C34\u5DFE"].some((keyword) => n.includes(keyword))) {
      return normalizeSmartConfig({
        dailyIncrement: 1,
        sceneFactors: {
          [BABY_MODULE_IDS.feeding]: 1,
          [BABY_MODULE_IDS.overnight]: 1
        }
      });
    }
    if (n.includes("\u5927\u91CF\u96F6\u98DF")) {
      return normalizeSmartConfig({
        dailyIncrement: 1,
        sceneFactors: {
          [BABY_MODULE_IDS.outdoor]: 2
        }
      });
    }
    return null;
  }
  function inferSmartRule(name, category) {
    const n = String(name || "").toLowerCase();
    if (inferSmartConfig(name, category)) return "formula";
    if (category === "clothing") {
      if (["t\u6064", "\u4E0A\u8863", "\u886C\u886B", "\u88E4", "\u88D9", "\u5185\u8863", "\u5185\u88E4", "\u6587\u80F8", "\u889C", "\u6253\u5E95\u88E4", "\u5B9D\u5B9D\u889C\u5B50"].some((keyword) => n.includes(keyword))) {
        return "perPersonPerDay";
      }
      if (["\u7761\u8863", "\u5916\u5957", "\u978B", "\u62D6\u978B", "\u5E3D\u5B50"].some((keyword) => n.includes(keyword))) {
        return "perPerson";
      }
      return "perPerson";
    }
    if (["\u5976\u74F6", "\u6BDB\u5DFE", "\u6D74\u5DFE"].some((keyword) => n.includes(keyword))) return "perPerson";
    return "fixed";
  }
  function resolveItemSmartPlan(name, category, rawRule = null, rawConfig = null) {
    const smartConfig = normalizeSmartConfig(rawConfig || inferSmartConfig(name, category));
    const fallbackRule = inferSmartRule(name, category);
    const smartRule = rawRule || (smartConfig ? "formula" : fallbackRule);
    return {
      smartRule: smartConfig && smartRule === "fixed" ? "formula" : smartRule,
      smartConfig
    };
  }
  function mergeTripItems(targetItems, incomingItems, tripContext, strategy = "manual") {
    incomingItems.forEach((candidate) => {
      const existing = targetItems.find((item) => item.name === candidate.name && item.category === candidate.category);
      if (!existing) {
        targetItems.push(normalizeTripItem(candidate));
        return;
      }
      existing.sourceModules = uniqueStrings([...existing.sourceModules || [], ...candidate.sourceModules || []]);
      existing.notes = existing.notes || candidate.notes || "";
      if (strategy === "module") {
        existing.smartRule = strongerSmartRule(existing.smartRule, candidate.smartRule);
        existing.smartConfig = mergeSmartConfig(existing.smartConfig, candidate.smartConfig);
        existing.smartBaseQty = Math.max(existing.smartBaseQty || existing.qty, candidate.smartBaseQty || candidate.qty || 1);
        if (!existing.smartLocked) {
          existing.qty = Math.max(
            existing.qty,
            candidate.qty,
            computeSmartQty(existing.smartBaseQty || 1, existing.smartRule, tripContext.days, tripContext.people, existing.smartConfig, tripContext)
          );
        } else {
          existing.qty = Math.max(existing.qty, candidate.qty);
        }
      } else {
        existing.qty += candidate.qty;
        if (existing.smartRule !== "fixed") existing.smartLocked = true;
      }
    });
  }
  function applyTripSmartFill(trip, unlockAll = false) {
    trip.items = trip.items.map((item) => {
      const next = normalizeTripItem(item);
      if (unlockAll) next.smartLocked = false;
      if (next.smartRule !== "fixed" && !next.smartLocked) {
        next.qty = computeSmartQty(next.smartBaseQty || 1, next.smartRule, trip.days, trip.people, next.smartConfig, trip);
      }
      return next;
    });
  }

  // src/data/adapters/localStorageAdapter.js
  var LocalStorageAdapter = class {
    read(key) {
      try {
        return localStorage.getItem(key);
      } catch {
        return null;
      }
    }
    write(key, value) {
      try {
        localStorage.setItem(key, value);
      } catch (e) {
        console.warn("[LocalStorageAdapter] write failed:", e);
      }
    }
    remove(key) {
      try {
        localStorage.removeItem(key);
      } catch (e) {
        console.warn("[LocalStorageAdapter] remove failed:", e);
      }
    }
  };

  // src/data/store.js
  var DataStore = class {
    constructor(adapter = new LocalStorageAdapter()) {
      this._adapter = adapter;
    }
    _parseJson(raw, fallback) {
      try {
        return raw ? JSON.parse(raw) : fallback;
      } catch {
        return fallback;
      }
    }
    readJson(key, fallback) {
      return this._parseJson(this._adapter.read(key), fallback);
    }
    writeJson(key, value) {
      this._adapter.write(key, JSON.stringify(value));
    }
    // ===== 记录（Trip + Module 混存）=====
    getRecords() {
      return this.readJson(STORAGE_KEYS.records, []).map(normalizeRecord).sort((a, b) => new Date(b.updatedAt || b.createdAt || 0) - new Date(a.updatedAt || a.createdAt || 0));
    }
    saveRecords(records) {
      this.writeJson(STORAGE_KEYS.records, records);
    }
    saveRecord(record) {
      const records = this.getRecords();
      const idx = records.findIndex((item) => item.id === record.id);
      const normalized = normalizeRecord(record);
      if (idx >= 0) records[idx] = normalized;
      else records.unshift(normalized);
      this.saveRecords(records);
    }
    // ===== 官方小包 =====
    getOfficialModules() {
      return this.readJson(STORAGE_KEYS.officialModules, OFFICIAL_MODULES).map(normalizeOfficialModule);
    }
    saveOfficialModules(modules) {
      this.writeJson(STORAGE_KEYS.officialModules, (modules || []).map(normalizeOfficialModule));
    }
    // ===== 便捷访问 =====
    getTrips() {
      return this.getRecords().filter((record) => record.recordType === "trip");
    }
    getMyModules() {
      return this.getRecords().filter((record) => record.recordType === "module");
    }
  };
  var _store = new DataStore();
  function readJson(key, fallback) {
    return _store.readJson(key, fallback);
  }
  function writeJson(key, value) {
    _store.writeJson(key, value);
  }
  function getRecords() {
    return _store.getRecords();
  }
  function saveRecords(records) {
    _store.saveRecords(records);
  }
  function saveRecord(record) {
    _store.saveRecord(record);
  }
  function getOfficialModules() {
    return _store.getOfficialModules();
  }
  function saveOfficialModules(modules) {
    _store.saveOfficialModules(modules);
  }
  function getTrips() {
    return _store.getTrips();
  }
  function getMyModules() {
    return _store.getMyModules();
  }

  // src/data/libraryService.js
  function sortLibraryItems(items) {
    return [...items].sort((a, b) => {
      const sourceDiff = Number(b.source === "user") - Number(a.source === "user");
      if (sourceDiff !== 0) return sourceDiff;
      const categoryDiff = catInfo(a.category).name.localeCompare(catInfo(b.category).name, "zh-Hans-CN");
      if (categoryDiff !== 0) return categoryDiff;
      return a.name.localeCompare(b.name, "zh-Hans-CN");
    });
  }
  function getItemLibrary() {
    const items = readJson(STORAGE_KEYS.itemLibrary, buildSeedItemLibrary());
    return sortLibraryItems((items || []).map(normalizeLibraryItem));
  }
  function saveItemLibrary(items) {
    writeJson(STORAGE_KEYS.itemLibrary, sortLibraryItems((items || []).map(normalizeLibraryItem)));
  }
  function buildSeedItemLibrary() {
    const byName = /* @__PURE__ */ new Map();
    const ref = { value: 1 };
    BASE_LIBRARY_ITEMS.forEach((def) => registerSeedItem(byName, def, ref));
    getOfficialModules().forEach((module) => {
      module.items.forEach((def) => registerSeedItem(byName, def, ref));
    });
    return sortLibraryItems(Array.from(byName.values()));
  }
  function registerSeedItem(map, def, ref) {
    const name = String(def.name || "").trim();
    if (!name || map.has(name)) return;
    const category = def.category || def.c || guessCat(name);
    map.set(name, normalizeLibraryItem({
      id: "asset-seed-" + ref.value++,
      name,
      category,
      defaultQty: def.defaultQty || def.q || 1,
      bag: def.bag || suggestBagForItem(name, category),
      smartRule: def.smartRule || def.smart || inferSmartRule(name, category),
      source: "system"
    }));
  }
  function ensureItemLibrarySeeded() {
    const stored = readJson(STORAGE_KEYS.itemLibrary, null);
    const seeded = buildSeedItemLibrary();
    if (!stored || !stored.length) {
      saveItemLibrary(seeded);
      return;
    }
    const merged = (stored || []).map(normalizeLibraryItem);
    const byName = new Map(merged.map((item) => [item.name, true]));
    seeded.forEach((item) => {
      if (!byName.has(item.name)) merged.push(item);
    });
    saveItemLibrary(merged);
  }
  function syncItemsIntoLibrary(items = []) {
    if (!items.length) return;
    const library = getItemLibrary();
    const byName = new Map(library.map((item) => [item.name, true]));
    let changed = false;
    items.forEach((item) => {
      const name = String(item?.name || "").trim();
      if (!name || byName.has(name)) return;
      const category = item.category || guessCat(name);
      const { smartRule, smartConfig } = resolveItemSmartPlan(name, category, item.smartRule, item.smartConfig);
      library.unshift(normalizeLibraryItem({
        id: "asset-" + gid(),
        name,
        category,
        defaultQty: item.defaultQty || item.smartBaseQty || item.qty || 1,
        bag: item.bag || suggestBagForItem(name, category),
        smartRule,
        smartConfig,
        source: "user"
      }));
      byName.set(name, true);
      changed = true;
    });
    if (changed) saveItemLibrary(library);
  }
  function createModuleItemFromAsset(asset) {
    const { smartRule, smartConfig } = resolveItemSmartPlan(asset.name, asset.category, asset.smartRule, asset.smartConfig);
    return normalizeModuleItem({
      id: "module-item-" + gid(),
      name: asset.name,
      category: asset.category,
      bag: asset.bag || suggestBagForItem(asset.name, asset.category),
      defaultQty: asset.defaultQty || 1,
      smartRule,
      smartConfig
    });
  }

  // src/data/tripService.js
  function getModuleEntity(source, id) {
    if (source === "official") return getOfficialModules().find((module) => module.id === id) || null;
    return getMyModules().find((module) => module.id === id) || null;
  }
  function resolveOfficialModuleItems(module, days, people) {
    return (module.items || []).map((item) => createTripItemFromModuleItem(normalizeModuleItem(item), days, people, module.name));
  }
  function resolveCustomModuleItems(module, days, people) {
    return (module.items || []).map((item) => createTripItemFromModuleItem(item, days, people, module.name));
  }
  function createTripItemFromModuleItem(item, days, people, sourceModuleName) {
    const { smartRule, smartConfig } = resolveItemSmartPlan(item.name, item.category, item.smartRule, item.smartConfig);
    return normalizeTripItem({
      id: "item-" + gid(),
      name: item.name,
      category: item.category,
      bag: item.bag,
      smartRule,
      smartConfig,
      smartBaseQty: item.defaultQty,
      qty: computeSmartQty(item.defaultQty, smartRule, days, people, smartConfig),
      packed: false,
      notes: "",
      sourceModules: sourceModuleName ? [sourceModuleName] : [],
      tags: Array.isArray(item.tags) ? [...item.tags] : []
    });
  }
  function getTripProgress(trip) {
    const total = trip.items?.length || 0;
    const packed = trip.items?.filter((item) => item.packed).length || 0;
    return {
      total,
      packed,
      pending: Math.max(0, total - packed),
      pct: total ? Math.round(packed / total * 100) : 0
    };
  }
  function getTripStatus(trip) {
    const progress = getTripProgress(trip);
    if (progress.total > 0 && progress.packed >= progress.total) return { key: "done", label: "\u5DF2\u5B8C\u6210", icon: "\u2705" };
    if (progress.packed > 0) return { key: "packing", label: "\u6253\u5305\u4E2D", icon: "\u{1F392}" };
    return { key: "planning", label: "\u89C4\u5212\u4E2D", icon: "\u{1F4DD}" };
  }
  function formatTripMeta(trip) {
    const modules = trip.sourceModules?.length ? ` \xB7 ${trip.sourceModules.length} \u4E2A\u5C0F\u5305` : "";
    return `${trip.days || 1} \u5929 \xB7 ${trip.people || 1} \u4EBA \xB7 ${trip.items?.length || 0} \u4EF6${modules}`;
  }
  function formatTripSourceSummary(trip) {
    if (!trip.sourceModules?.length) return "\u81EA\u7531\u6DFB\u52A0\u7269\u54C1";
    const names = trip.sourceModules.map((module) => module.name);
    if (names.length <= 2) return names.join(" + ");
    return names.slice(0, 2).join(" + ") + ` +${names.length - 2} \u4E2A\u5C0F\u5305`;
  }
  function formatItemSource(item) {
    if (!item.sourceModules?.length) return "";
    if (item.sourceModules.length === 1) return "\u6765\u81EA " + item.sourceModules[0];
    return `\u6765\u81EA ${item.sourceModules.length} \u4E2A\u5C0F\u5305`;
  }
  function getModuleKey(source, id) {
    return `${source}:${id}`;
  }
  function splitModuleKey(key) {
    return key.split(":");
  }
  function getBabyBaseModule() {
    return getOfficialModules().find((module) => module.id === BABY_MODULE_IDS.base) || null;
  }
  function isBabyModuleEntity(module) {
    if (!module) return false;
    if (module.group === "baby") return true;
    if (module.purpose === "family") return true;
    const blob = [module.name, module.desc, ...module.tags || [], ...(module.items || []).map((item) => item.name || "")].join(" ");
    return /宝宝|带娃|疫苗|奶瓶|尿不湿|辅食/.test(blob);
  }
  function isBabyBaseModuleEntity(module) {
    return !!module && module.id === BABY_MODULE_IDS.base;
  }
  function upsertTripSourceModule(trip, sourceModule) {
    if (!trip || !sourceModule) return;
    const existing = trip.sourceModules || [];
    if (!existing.some((module) => module.source === sourceModule.source && module.id === sourceModule.id)) {
      existing.push(sourceModule);
      trip.sourceModules = existing;
    }
  }
  function ensureBabyBaseModuleOnTripRecord(trip) {
    if (!trip) return;
    const baseModule = getBabyBaseModule();
    if (!baseModule) return;
    if ((trip.sourceModules || []).some((module) => module.source === "official" && module.id === baseModule.id)) return;
    const items = resolveOfficialModuleItems(baseModule, trip.days, trip.people);
    mergeTripItems(trip.items, items, trip, "module");
    upsertTripSourceModule(trip, { source: "official", id: baseModule.id, name: baseModule.name });
  }

  // app.js
  var S = {
    currentPage: "home",
    currentTripId: null,
    currentTrip: null,
    currentModule: null,
    currentModuleAction: "browse",
    homeHistoryExpanded: false,
    tripMode: "plan",
    packView: "bags",
    moduleFilter: "all",
    moduleSearch: "",
    itemFilter: "all",
    itemSearch: "",
    returnPage: null,
    libraryModalEditId: null,
    tripItemEditId: null,
    moduleBuilderSelection: /* @__PURE__ */ new Set(),
    moduleBuilderSearch: "",
    moduleBuilderDraftId: null,
    moduleBuilderDraftSource: "custom",
    moduleBuilderGesture: {
      active: false,
      pointerId: null,
      mode: "add",
      visited: /* @__PURE__ */ new Set()
    },
    tripBuilderSelection: /* @__PURE__ */ new Set(),
    kitView: "compact",
    collapsedBags: /* @__PURE__ */ new Set(),
    tripInfoCollapsed: false,
    currentEditingTags: []
  };
  function init() {
    ensureItemLibrarySeeded();
    setupModalOverlays();
    setupModuleBuilderGesture();
    fillCatSelect("libraryItemCategory");
    fillBagSelect("libraryItemBag", null, DEFAULT_BAGS);
    fillCatSelect("manualItemCategory");
    fillCatSelect("tripItemCategory");
    fillCatSelect("moduleQuickItemCategory");
    bindFormEvents();
    nav("home");
    if (!localStorage.getItem(STORAGE_KEYS.onboarded)) {
      setTimeout(startOnboarding, 400);
    }
  }
  function bindFormEvents() {
    document.getElementById("tripDays")?.addEventListener("input", syncTripBuilderSummary);
    document.getElementById("tripPeople")?.addEventListener("input", syncTripBuilderSummary);
    document.getElementById("libraryItemCategory")?.addEventListener("change", () => {
      syncBagWithCategory("libraryItemCategory", "libraryItemBag", DEFAULT_BAGS);
      updateLibrarySmartHint();
    });
    document.getElementById("libraryItemName")?.addEventListener("input", updateLibrarySmartHint);
    document.getElementById("libraryItemBulkInput")?.addEventListener("input", updateLibrarySmartHint);
    document.getElementById("libraryItemQty")?.addEventListener("input", updateLibrarySmartHint);
    document.getElementById("manualItemCategory")?.addEventListener("change", () => {
      syncBagWithCategory("manualItemCategory", "manualItemBag", S.currentTrip?.bags || DEFAULT_BAGS);
      updateManualItemSmartHint();
    });
    document.getElementById("manualItemName")?.addEventListener("input", updateManualItemSmartHint);
    document.getElementById("manualItemBulkInput")?.addEventListener("input", updateManualItemSmartHint);
    document.getElementById("manualItemQty")?.addEventListener("input", updateManualItemSmartHint);
    document.getElementById("tripItemQty")?.addEventListener("input", updateTripItemSmartMeta);
    document.getElementById("tripItemCategory")?.addEventListener("change", () => {
      syncBagWithCategory("tripItemCategory", "tripItemBag", S.currentTrip?.bags || DEFAULT_BAGS);
      updateTripItemSmartMeta();
    });
    document.getElementById("moduleQuickItemName")?.addEventListener("input", updateModuleQuickItemCategory);
    document.getElementById("moduleQuickItemCategory")?.addEventListener("change", updateModuleQuickItemCategory);
    document.getElementById("libraryItemTagInput")?.addEventListener("keydown", (e) => {
      if (e.key === "Enter") {
        e.preventDefault();
        addLibraryItemTag();
      }
    });
    document.getElementById("tripItemTagInput")?.addEventListener("keydown", (e) => {
      if (e.key === "Enter") {
        e.preventDefault();
        addTripItemTag();
      }
    });
  }
  function nav(page) {
    S.currentPage = page;
    document.querySelectorAll(".page").forEach((el) => el.classList.toggle("active", el.dataset.page === page));
    renderHeader();
    renderBottomNav();
    if (page === "home") renderHome();
    if (page === "kits") renderModuleLibrary();
    if (page === "items") renderItemLibrary();
    if (page === "list") renderTripPage();
    if (page === "me") renderMePage();
  }
  function openMainPage(page) {
    S.returnPage = null;
    S.currentModuleAction = "browse";
    nav(page);
  }
  function goBack() {
    if (S.currentPage === "list") {
      nav("home");
      return;
    }
    if (S.returnPage) {
      const target = S.returnPage;
      S.returnPage = null;
      S.currentModuleAction = "browse";
      nav(target);
      return;
    }
    nav("home");
  }
  function renderHeader() {
    const backWrap = document.getElementById("headerBackWrap");
    const title = document.getElementById("headerTitle");
    const eyebrow = document.getElementById("headerEyebrow");
    const right = document.getElementById("headerRight");
    backWrap.style.visibility = S.currentPage === "list" || S.returnPage ? "visible" : "hidden";
    right.innerHTML = "";
    if (S.currentPage === "home") {
      title.textContent = "\u884C\u7406";
      eyebrow.textContent = "\u7269\u54C1\u5E93 \u2192 \u5C0F\u5305 \u2192 \u884C\u7A0B";
      right.innerHTML = '<button class="btn-icon" onclick="openCreateTripModal()" aria-label="\u65B0\u5EFA\u884C\u7A0B">\uFF0B</button>';
    } else if (S.currentPage === "kits") {
      title.textContent = "\u5C0F\u5305";
      eyebrow.textContent = S.currentModuleAction === "add" ? "\u628A\u5C0F\u5305\u52A0\u8FDB\u5F53\u524D\u884C\u7A0B\u5355" : "\u5148\u6C89\u6DC0\uFF0C\u518D\u590D\u7528";
      right.innerHTML = '<button class="btn-icon" onclick="openCreateModuleModal()" aria-label="\u65B0\u5EFA\u5C0F\u5305">\uFF0B</button>';
    } else if (S.currentPage === "items") {
      title.textContent = "\u7269\u54C1\u5E93";
      eyebrow.textContent = S.currentTrip ? "\u4ECE\u7269\u54C1\u5E93\u7ED9\u5F53\u524D\u884C\u7A0B\u8865\u8D27" : "\u6C89\u6DC0\u4F60\u7684\u6807\u51C6\u7269\u54C1\u8D44\u4EA7";
      right.innerHTML = '<button class="btn-icon" onclick="openLibraryItemModal()" aria-label="\u65B0\u589E\u7269\u54C1">\uFF0B</button>';
    } else if (S.currentPage === "list") {
      title.textContent = "\u884C\u7A0B\u8BE6\u60C5";
      eyebrow.textContent = S.tripMode === "plan" ? "\u89C4\u5212\u6A21\u5F0F\uFF1A\u7EC4\u5408\u5C0F\u5305\u3001\u8865\u5145\u7269\u54C1\u3001\u667A\u80FD\u5EFA\u8BAE" : "\u6253\u5305\u6A21\u5F0F\uFF1A\u5BF9\u7167\u5B9E\u7269\u52FE\u9009";
      right.innerHTML = '<button class="btn-icon" onclick="toggleTripMode()" aria-label="\u5207\u6362\u6A21\u5F0F">' + (S.tripMode === "plan" ? "\u{1F392}" : "\u270F\uFE0F") + "</button>";
    } else if (S.currentPage === "me") {
      title.textContent = "\u6211\u7684";
      eyebrow.textContent = "\u8BBE\u7F6E\u4E0E\u6570\u636E\u7BA1\u7406";
      right.innerHTML = "";
    }
  }
  function renderBottomNav() {
    document.querySelectorAll(".nav-item").forEach((btn) => {
      btn.classList.toggle("active", btn.dataset.nav === S.currentPage);
    });
  }
  function renderHome() {
    const trips = getTrips();
    const modules = getMyModules();
    const library = getItemLibrary();
    const active = trips.find((trip) => getTripStatus(trip).key !== "done") || null;
    const done = trips.filter((trip) => getTripStatus(trip).key === "done");
    const rest = trips.filter((trip) => trip.id !== active?.id);
    const recent = rest.filter((t) => getTripStatus(t).key !== "done").slice(0, 3);
    const history = done;
    const isNewUser = !trips.length && !modules.length;
    const heroEl = document.getElementById("homeHero");
    if (heroEl) heroEl.style.display = isNewUser ? "block" : "none";
    const statsEl = document.getElementById("homeStats");
    if (statsEl) {
      statsEl.innerHTML = isNewUser ? "" : "<span>" + trips.length + ' \u4E2A\u884C\u7A0B</span><span class="qs-dot">\xB7</span><span>' + (modules.length + getOfficialModules().length) + ' \u4E2A\u5C0F\u5305</span><span class="qs-dot">\xB7</span><span>' + library.length + " \u4EF6\u7269\u54C1</span>";
    }
    const content = document.getElementById("homeContent");
    if (!content) return;
    if (isNewUser) {
      content.innerHTML = renderNewUserGuide();
      return;
    }
    let html = "";
    if (active) {
      html += '<section class="section"><div class="section-head"><h3 class="section-title">\u8FDB\u884C\u4E2D</h3><span class="section-meta">' + getTripStatus(active).label + "</span></div>" + renderActiveTrip(active) + "</section>";
    } else {
      html += '<div class="home-cta-banner" onclick="openCreateTripModal()"><div class="home-cta-icon">\u{1F4DD}</div><div class="home-cta-body"><div class="home-cta-title">\u65B0\u5EFA\u884C\u7A0B</div><div class="home-cta-desc">\u9009\u51E0\u4E2A\u5C0F\u5305\uFF0C\u667A\u80FD\u751F\u6210\u6253\u5305\u6E05\u5355</div></div><div class="home-cta-arrow">\u203A</div></div>';
    }
    if (recent.length) {
      html += '<section class="section"><div class="section-head"><h3 class="section-title">\u6700\u8FD1</h3></div><div class="trip-list-compact">' + recent.map(renderTripCardCompact).join("") + "</div></section>";
    }
    if (history.length) {
      const showing = S.homeHistoryExpanded ? history : history.slice(0, 2);
      html += '<section class="section"><div class="section-head"><h3 class="section-title">\u5DF2\u5B8C\u6210</h3><span class="section-meta section-link" onclick="toggleHomeHistory()">' + (S.homeHistoryExpanded ? "\u6536\u8D77" : history.length > 2 ? "\u67E5\u770B\u5168\u90E8 " + history.length + " \u6761" : "") + '</span></div><div class="trip-list-compact">' + showing.map(renderTripCardCompact).join("") + "</div></section>";
    }
    content.innerHTML = html;
  }
  function renderNewUserGuide() {
    return `<div class="home-features"><div class="feature-card" onclick="openMainPage('kits')"><div class="feature-icon">\u{1F9F0}</div><div class="feature-body"><div class="feature-title">\u6574\u7406\u5C0F\u5305</div><div class="feature-desc">\u628A\u5E38\u5E26\u7269\u54C1\u6309\u7528\u9014\u5206\u7EC4\uFF0C\u6BD4\u5982\u6D17\u6F31\u5305\u3001\u5316\u5986\u5305\u3002\u7CFB\u7EDF\u5DF2\u9884\u7F6E 9 \u4E2A\u5B98\u65B9\u5C0F\u5305\u3002</div></div><div class="home-cta-arrow">\u203A</div></div><div class="feature-card" onclick="openCreateTripModal()"><div class="feature-icon">\u{1F4DD}</div><div class="feature-body"><div class="feature-title">\u65B0\u5EFA\u884C\u7A0B</div><div class="feature-desc">\u52FE\u9009\u9700\u8981\u7684\u5C0F\u5305\uFF0C\u7CFB\u7EDF\u81EA\u52A8\u5408\u5E76\u7269\u54C1\u5E76\u6309\u5929\u6570\u3001\u4EBA\u6570\u5EFA\u8BAE\u6570\u91CF\u3002</div></div><div class="home-cta-arrow">\u203A</div></div><div class="feature-card" onclick="openMainPage('items')"><div class="feature-icon">\u{1F392}</div><div class="feature-body"><div class="feature-title">\u7269\u54C1\u5E93</div><div class="feature-desc">\u7BA1\u7406\u4F60\u7684\u7269\u54C1\u5E93\uFF0C\u6DFB\u52A0\u4E2A\u4EBA\u5E38\u7528\u7269\u54C1\uFF0C\u6253\u5305\u65F6\u968F\u624B\u6311\u9009\u3002</div></div><div class="home-cta-arrow">\u203A</div></div></div>`;
  }
  function renderActiveTrip(trip) {
    const progress = getTripProgress(trip);
    const status = getTripStatus(trip);
    return '<div class="active-trip-card"><div class="active-trip-top"><span class="status-chip ' + status.key + '">' + status.label + '</span><span class="section-meta">' + esc(formatTripMeta(trip)) + '</span></div><div class="list-summary-title">' + esc(trip.name) + '</div><div class="list-summary-meta">' + esc(formatTripSourceSummary(trip)) + "</div>" + renderProgress(progress) + `<div class="hero-actions" style="margin-top:14px;"><button class="btn-secondary" onclick="openTrip('` + trip.id + `','plan')">\u7EE7\u7EED\u89C4\u5212</button><button class="btn-primary" onclick="openTrip('` + trip.id + `','pack')">\u5F00\u59CB\u6253\u5305</button></div></div>`;
  }
  function renderTripCardCompact(trip) {
    const progress = getTripProgress(trip);
    const status = getTripStatus(trip);
    return `<div class="trip-card-compact" onclick="openTrip('` + trip.id + `','plan')"><div class="trip-compact-icon">` + status.icon + '</div><div class="trip-compact-body"><div class="trip-compact-name">' + esc(trip.name) + '</div><div class="trip-compact-meta">' + esc(formatTripMeta(trip)) + '</div></div><div class="trip-compact-progress"><div class="progress-ring" style="--pct:' + progress.pct + '"><span class="progress-ring-text">' + progress.pct + "%</span></div></div></div>";
  }
  function renderProgress(progress) {
    return '<div class="saved-list-progress"><div class="saved-list-progress-bar"><div class="saved-list-progress-fill" style="width:' + progress.pct + '%"></div></div><span class="saved-list-progress-text">\u5DF2\u6253\u5305 ' + progress.packed + "/" + progress.total + " \u4EF6</span></div>";
  }
  function toggleHomeHistory() {
    if (!getTrips().slice(3).length) return;
    S.homeHistoryExpanded = !S.homeHistoryExpanded;
    renderHome();
  }
  function renderTripPage() {
    const summaryBox = document.getElementById("listSummary");
    const switchBox = document.getElementById("listModeSwitch");
    const actionBar = document.getElementById("listActionBar");
    const subBar = document.getElementById("listSubBar");
    const content = document.getElementById("listContent");
    if (!S.currentTrip) {
      summaryBox.innerHTML = '<div class="empty-panel"><div class="empty-icon">\u{1F4ED}</div><div class="empty-title">\u8FD8\u6CA1\u6709\u6253\u5F00\u7684\u884C\u7A0B</div><div class="empty-hint">\u5148\u53BB\u52FE\u9009\u51E0\u4E2A\u5C0F\u5305\uFF0C\u518D\u56DE\u6765\u8FD9\u91CC\u7EE7\u7EED\u6574\u7406\u3002</div></div>';
      switchBox.innerHTML = "";
      actionBar.innerHTML = "";
      subBar.innerHTML = "";
      content.innerHTML = "";
      return;
    }
    const trip = S.currentTrip;
    const progress = getTripProgress(trip);
    const status = getTripStatus(trip);
    const smartCount = trip.items.filter((item) => item.smartRule !== "fixed").length;
    const collapsed = S.tripInfoCollapsed ? " collapsed" : "";
    summaryBox.innerHTML = '<div class="list-summary-card"><div class="list-summary-top"><div><div class="list-summary-title-row"><div class="list-summary-title">' + esc(trip.name) + '</div><span class="status-chip ' + status.key + '">' + status.label + '</span></div><div class="list-summary-meta">' + esc(formatTripSourceSummary(trip)) + " \xB7 " + esc(formatTripMeta(trip)) + '</div></div><button class="pill-button" onclick="saveCurrentTripAsModule()">\u5B58\u4E3A\u5C0F\u5305</button></div>' + renderProgress(progress) + '<div class="trip-info-toggle" onclick="toggleTripInfoCard()"><span class="trip-info-toggle-text">\u884C\u7A0B\u8BBE\u7F6E</span><span class="trip-info-toggle-arrow' + collapsed + '">\u25BC</span></div><div class="trip-info-body' + collapsed + `"><div class="trip-info-row"><div class="trip-info-row-label">\u5929\u6570</div><div class="stepper"><button class="stepper-btn" onclick="changeCurrentTripSetting('days', -1)">\u2212</button><input type="number" min="1" max="90" value="` + trip.days + `" oninput="updateCurrentTripSetting('days', this.value)"><button class="stepper-btn" onclick="changeCurrentTripSetting('days', 1)">+</button></div></div><div class="trip-info-row"><div class="trip-info-row-label">\u4EBA\u6570</div><div class="stepper"><button class="stepper-btn" onclick="changeCurrentTripSetting('people', -1)">\u2212</button><input type="number" min="1" max="20" value="` + trip.people + `" oninput="updateCurrentTripSetting('people', this.value)"><button class="stepper-btn" onclick="changeCurrentTripSetting('people', 1)">+</button></div></div><button class="btn-recompute" onclick="reapplyTripSmartFill()">\u91CD\u65B0\u667A\u80FD\u586B\u5145</button></div><div class="trip-smart-note">\u5DF2\u6309\u5F53\u524D\u8BBE\u7F6E\u5EFA\u8BAE ` + smartCount + " \u9879\u53EF\u53D8\u6570\u91CF\u7269\u54C1\uFF1B\u4F60\u624B\u52A8\u6539\u8FC7\u7684\u6570\u91CF\u4F1A\u4F18\u5148\u4FDD\u7559\u3002</div></div>";
    switchBox.innerHTML = '<button class="mode-tab ' + (S.tripMode === "plan" ? "active" : "") + `" onclick="setTripMode('plan')">\u89C4\u5212\u6A21\u5F0F</button><button class="mode-tab ` + (S.tripMode === "pack" ? "active" : "") + `" onclick="setTripMode('pack')">\u6253\u5305\u6A21\u5F0F</button>`;
    if (S.tripMode === "plan") {
      actionBar.innerHTML = [
        '<button class="btn-secondary" onclick="goSelectModuleForTrip()">\u4ECE\u5C0F\u5305\u6DFB\u52A0</button>',
        '<button class="btn-secondary" onclick="goSelectItemsForTrip()">\u4ECE\u7269\u54C1\u5E93\u6DFB\u52A0</button>',
        '<button class="btn-primary" onclick="openManualItemModal()">\u624B\u52A8\u6DFB\u52A0\u7269\u54C1</button>'
      ].join("");
      subBar.innerHTML = '<div class="info-card subtle">\u884C\u7A0B\u91CC\u53EA\u9700\u8981\u52FE\u9009\u8FD9\u6B21\u8981\u5E26\u7684\u5C0F\u5305\uFF1B\u5982\u679C\u52FE\u9009\u4E86\u5B9D\u5B9D\u63D2\u4EF6\u5305\uFF0C\u7CFB\u7EDF\u4F1A\u81EA\u52A8\u8865\u4E0A\u5B9D\u5B9D\u57FA\u7840\u5305\uFF0C\u5E76\u7ED9\u5C3F\u4E0D\u6E7F\u3001\u5907\u7528\u8863\u88E4\u3001\u6E7F\u5DFE\u8FD9\u7C7B\u7269\u54C1\u6309\u5929\u6570\u548C\u573A\u666F\u91CD\u65B0\u5EFA\u8BAE\u6570\u91CF\u3002</div>';
      content.innerHTML = trip.items.length ? trip.items.map(renderTripPlanItemCard).join("") : renderTripEmpty();
    } else {
      actionBar.innerHTML = [
        '<button class="btn-secondary" onclick="markAllPacked()">\u6807\u8BB0\u5168\u90E8\u5B8C\u6210</button>',
        '<button class="btn-secondary" onclick="markAllUnpacked()">\u6062\u590D\u4E3A\u672A\u6253\u5305</button>'
      ].join("");
      subBar.innerHTML = '<div class="pack-view-switch"><button class="pack-view-tab ' + (S.packView === "bags" ? "active" : "") + `" onclick="setPackView('bags')">\u6309\u5C0F\u5305\u770B</button><button class="pack-view-tab ` + (S.packView === "remaining" ? "active" : "") + `" onclick="setPackView('remaining')">\u672A\u6253\u5305</button><button class="pack-view-tab ` + (S.packView === "all" ? "active" : "") + `" onclick="setPackView('all')">\u5168\u90E8</button></div>`;
      content.innerHTML = renderPackContent(trip);
    }
  }
  function renderTripEmpty() {
    return '<div class="empty-panel"><div class="empty-icon">\u{1F9F3}</div><div class="empty-title">\u8FD9\u5F20\u884C\u7A0B\u5355\u8FD8\u662F\u7A7A\u7684</div><div class="empty-hint">\u53BB\u52FE\u9009\u4E00\u4E2A\u6216\u591A\u4E2A\u5C0F\u5305\uFF0C\u6216\u8005\u76F4\u63A5\u624B\u52A8\u52A0\u5355\u4E2A\u7269\u54C1\u3002</div></div>';
  }
  function renderTripPlanItemCard(item) {
    const cat = catInfo(item.category);
    const sourceText = formatItemSource(item);
    const tagsHtml = (item.tags || []).map((tag) => '<span class="item-pill" style="background:var(--secondary-soft);color:#1d7fbf">' + esc(tag) + "</span>").join("");
    const smartBadge = item.smartRule !== "fixed" ? '<span class="item-pill smart-pill">' + esc(item.smartLocked ? "\u6570\u91CF\u5DF2\u624B\u8C03" : smartRuleShort(item.smartRule)) + "</span>" : "";
    return '<div class="list-item-card' + (item.packed ? " packed" : "") + '"><button class="check-button ' + (item.packed ? "checked" : "") + `" onclick="togglePackItem('` + item.id + `')">\u2713</button><div class="list-item-main" onclick="openTripItemModal('` + item.id + `')"><div class="list-item-name">` + esc(item.name) + '</div><div class="item-subline"><span class="item-pill ' + cat.cssClass + '">' + esc(cat.name) + '</span><span class="item-pill">' + esc(bagName(item.bag, S.currentTrip.bags)) + "</span>" + smartBadge + (sourceText ? '<span class="item-pill">' + esc(sourceText) + "</span>" : "") + "</div>" + (item.notes ? '<div class="item-notes">\u5907\u6CE8\uFF1A' + esc(item.notes) + "</div>" : "") + (tagsHtml ? '<div class="item-subline">' + tagsHtml + "</div>" : "") + '</div><div class="item-qty">\xD7' + item.qty + "</div></div>";
  }
  function renderPackContent(trip) {
    if (!trip.items.length) return renderTripEmpty();
    if (S.packView === "remaining") {
      const remaining = trip.items.filter((item) => !item.packed);
      if (!remaining.length) {
        return '<div class="empty-panel"><div class="empty-icon">\u{1F389}</div><div class="empty-title">\u5168\u90E8\u6253\u5305\u5B8C\u6210</div><div class="empty-hint">\u8FD9\u6B21\u51FA\u95E8\u9700\u8981\u5E26\u7684\u4E1C\u897F\u90FD\u51C6\u5907\u597D\u4E86\u3002</div></div>';
      }
      return remaining.map(renderPackItemCard).join("");
    }
    if (S.packView === "all") {
      return trip.items.map(renderPackItemCard).join("");
    }
    return renderBagsPackView(trip);
  }
  function renderBagsPackView(trip) {
    const bags = trip.bags || DEFAULT_BAGS;
    const groups = bags.map((bag) => ({
      bag,
      items: trip.items.filter((item) => item.bag === bag.id)
    })).filter((group) => group.items.length);
    const unassigned = trip.items.filter((item) => !bags.some((bag) => bag.id === item.bag));
    if (unassigned.length) groups.push({ bag: { id: "unassigned", icon: "\u2753", name: "\u672A\u5206\u914D" }, items: unassigned });
    if (!groups.length) return renderTripEmpty();
    return groups.map((group) => {
      const packed = group.items.filter((item) => item.packed).length;
      const collapsed = S.collapsedBags.has(group.bag.id) ? " collapsed" : "";
      return '<div class="bag-group' + collapsed + '" id="bag-' + group.bag.id + '"><div class="bag-group-header"><div class="bag-group-label"><span class="bag-icon">' + group.bag.icon + '</span><span class="bag-name">' + esc(group.bag.name) + `</span></div><div style="display:flex;align-items:center;gap:8px"><span class="bag-toggle" onclick="toggleBagCollapse('` + group.bag.id + `')">\u25BC</span></div></div><div class="bag-group-items">` + group.items.map(renderPackItemCard).join("") + "</div></div>";
    }).join("");
  }
  function toggleBagCollapse(bagId) {
    if (S.collapsedBags.has(bagId)) {
      S.collapsedBags.delete(bagId);
    } else {
      S.collapsedBags.add(bagId);
    }
    const el = document.getElementById("bag-" + bagId);
    if (el) el.classList.toggle("collapsed", S.collapsedBags.has(bagId));
  }
  function toggleTripInfoCard() {
    S.tripInfoCollapsed = !S.tripInfoCollapsed;
    const summaryBox = document.getElementById("listSummary");
    if (!summaryBox) return;
    const toggle = summaryBox.querySelector(".trip-info-toggle-arrow");
    const body = summaryBox.querySelector(".trip-info-body");
    if (toggle) toggle.classList.toggle("collapsed", S.tripInfoCollapsed);
    if (body) body.classList.toggle("collapsed", S.tripInfoCollapsed);
  }
  function renderPackItemCard(item) {
    const cat = catInfo(item.category);
    const tags = (item.tags || []).map((tag) => '<span class="item-pill" style="background:var(--secondary-soft);color:#1d7fbf">' + esc(tag) + "</span>").join("");
    const sourceModules = item.sourceModules || [];
    const sourcePill = sourceModules.length > 0 ? '<span class="item-pill source-module-pill" title="' + sourceModules.map(esc).join(", ") + '">' + esc(sourceModules.length > 1 ? sourceModules[0] + "\u7B49" : sourceModules[0]) + "</span>" : "";
    return '<div class="list-item-card' + (item.packed ? " packed" : "") + `" onclick="togglePackItem('` + item.id + `')"><button class="check-button ` + (item.packed ? "checked" : "") + '">\u2713</button><div class="list-item-main"><div class="list-item-name">' + esc(item.name) + '</div><div class="item-subline"><span class="item-pill ' + cat.cssClass + '">' + esc(cat.name) + "</span>" + (sourcePill ? sourcePill : '<span class="item-pill">' + esc(bagName(item.bag, S.currentTrip.bags)) + "</span>") + (tags ? tags : "") + '</div></div><div class="item-qty">\xD7' + item.qty + "</div></div>";
  }
  function setTripMode(mode) {
    S.tripMode = mode;
    renderHeader();
    renderTripPage();
  }
  function toggleTripMode() {
    setTripMode(S.tripMode === "plan" ? "pack" : "plan");
  }
  function setPackView(view) {
    S.packView = view;
    renderTripPage();
  }
  function openTrip(id, mode = "plan") {
    const trip = getTrips().find((item) => item.id === id);
    if (!trip) return;
    S.currentTripId = id;
    S.currentTrip = deepClone(trip);
    S.tripMode = mode;
    S.collapsedBags = /* @__PURE__ */ new Set();
    S.tripInfoCollapsed = false;
    nav("list");
  }
  function changeCurrentTripSetting(field, delta) {
    if (!S.currentTrip) return;
    const current = field === "days" ? S.currentTrip.days : S.currentTrip.people;
    updateCurrentTripSetting(field, current + delta);
  }
  function updateCurrentTripSetting(field, rawValue) {
    if (!S.currentTrip) return;
    const min = field === "days" ? 1 : 1;
    const max = field === "days" ? 90 : 20;
    const value = Math.max(min, Math.min(max, parseInt(rawValue) || min));
    if (field === "days" && value === S.currentTrip.days) return;
    if (field === "people" && value === S.currentTrip.people) return;
    if (field === "days") S.currentTrip.days = value;
    if (field === "people") S.currentTrip.people = value;
    applyTripSmartFill(S.currentTrip, false);
    persistCurrentTrip();
    renderTripPage();
    renderHome();
  }
  function reapplyTripSmartFill() {
    if (!S.currentTrip) return;
    applyTripSmartFill(S.currentTrip, true);
    persistCurrentTrip();
    renderTripPage();
    renderHome();
    toast("\u5DF2\u91CD\u65B0\u6309\u5929\u6570\u548C\u4EBA\u6570\u667A\u80FD\u586B\u5145");
  }
  function updateModuleSearch(value) {
    S.moduleSearch = value.trim();
    renderModuleLibrary();
  }
  function setModuleFilter(filterId) {
    S.moduleFilter = filterId;
    renderModuleLibrary();
  }
  function renderModuleLibrary() {
    const banner = document.getElementById("moduleContextBanner");
    const officialBox = document.getElementById("officialModuleGrid");
    const myBox = document.getElementById("myModuleGrid");
    const myMeta = document.getElementById("myModuleMeta");
    const toggle = document.getElementById("kitViewToggle");
    toggle.innerHTML = '<button class="kit-view-btn ' + (S.kitView === "compact" ? "active" : "") + `" onclick="setKitView('compact')">\u7CBE\u7B80</button><button class="kit-view-btn ` + (S.kitView === "normal" ? "active" : "") + `" onclick="setKitView('normal')">\u8BE6\u60C5</button>`;
    banner.classList.toggle("visible", S.currentModuleAction === "add" && !!S.currentTrip);
    banner.textContent = S.currentModuleAction === "add" && S.currentTrip ? `\u5F53\u524D\u884C\u7A0B\uFF1A${S.currentTrip.name}\u3002\u6253\u5F00\u4E00\u4E2A\u5C0F\u5305\u540E\uFF0C\u53EF\u628A\u6574\u5305\u7269\u54C1\u4E00\u952E\u52A0\u5165\u5F53\u524D\u884C\u7A0B\u3002` : "\u4F60\u5148\u5728\u8FD9\u91CC\u7EF4\u62A4\u6807\u51C6\u5316\u5C0F\u5305\uFF1B\u521B\u5EFA Trips \u65F6\uFF0C\u518D\u4ECE\u5E93\u91CC\u52FE\u9009\u9700\u8981\u7684\u5C0F\u5305\u7EC4\u5408\u3002";
    renderModuleFilters();
    document.getElementById("moduleSearchInput").value = S.moduleSearch;
    const keyword = S.moduleSearch.toLowerCase();
    const official = getOfficialModules().filter((module) => {
      const searchBlob = [module.name, module.desc, ...module.tags || []].join(" ").toLowerCase();
      const filterMatch = S.moduleFilter === "all" || S.moduleFilter === module.purpose;
      const searchMatch = !keyword || searchBlob.includes(keyword);
      return filterMatch && searchMatch;
    });
    const mine = getMyModules().filter((module) => {
      const searchBlob = [module.name, module.desc, ...module.tags || [], ...(module.items || []).map((item) => item.name)].join(" ").toLowerCase();
      const filterMatch = S.moduleFilter === "all" || S.moduleFilter === "custom";
      const searchMatch = !keyword || searchBlob.includes(keyword);
      return filterMatch && searchMatch;
    });
    officialBox.innerHTML = official.length ? official.map((m) => renderOfficialModuleCard(m, S.kitView)).join("") : '<div class="empty-panel"><div class="empty-hint">\u6CA1\u6709\u5339\u914D\u7684\u5B98\u65B9\u5C0F\u5305\u3002</div></div>';
    myMeta.textContent = mine.length ? `${mine.length} \u4E2A\u53EF\u590D\u7528\u5C0F\u5305` : "\u8FD8\u6CA1\u6709";
    myBox.innerHTML = mine.length ? mine.map((m) => renderMyModuleCard(m, S.kitView)).join("") : '<div class="empty-panel"><div class="empty-title">\u8FD8\u6CA1\u6709\u6211\u7684\u5C0F\u5305</div><div class="empty-hint">\u53EF\u4EE5\u4ECE\u5B98\u65B9\u5C0F\u5305\u8D77\u6B65\uFF0C\u4E5F\u53EF\u4EE5\u4ECE\u7269\u54C1\u5E93\u6ED1\u9009\u540E\u65B0\u5EFA\u3002</div></div>';
  }
  function renderModuleFilters() {
    document.getElementById("moduleFilterRow").innerHTML = MODULE_FILTERS.map(
      (filter) => '<button class="filter-chip ' + (S.moduleFilter === filter.id ? "active" : "") + `" onclick="setModuleFilter('` + filter.id + `')">` + esc(filter.name) + "</button>"
    ).join("");
  }
  function renderOfficialModuleCard(module, view = "normal") {
    const preview = resolveOfficialModuleItems(module, getPreviewDays(), getPreviewPeople());
    const smartCount = preview.filter((item) => item.smartRule !== "fixed").length;
    if (view === "compact") {
      return `<div class="kit-card compact recommended" onclick="openModuleDetail('official','` + module.id + `')"><div class="kit-card-top"><div class="kit-card-icon">` + module.icon + '</div><div class="kit-card-name">' + esc(module.name) + "</div></div></div>";
    }
    return `<div class="kit-card recommended" onclick="openModuleDetail('official','` + module.id + `')"><div class="kit-card-top"><div class="kit-card-icon">` + module.icon + `</div><div class="inline-actions"><span class="kit-badge">\u5B98\u65B9\u5C0F\u5305</span><button class="icon-action" onclick="event.stopPropagation();openEditModuleModal('official','` + module.id + `')" title="\u7F16\u8F91\u5B98\u65B9\u5C0F\u5305">\u270F\uFE0F</button></div></div><div class="kit-card-name">` + esc(module.name) + '</div><div class="kit-card-desc">' + esc(module.desc) + '</div><div class="tag-row">' + (module.tags || []).map((tag) => '<span class="tag">' + esc(tag) + "</span>").join("") + '</div><div class="kit-card-meta">' + preview.length + " \u4EF6\u7269\u54C1 \xB7 " + smartCount + " \u9879\u968F\u5929\u6570/\u4EBA\u6570\u53D8\u5316</div></div>";
  }
  function renderMyModuleCard(module, view = "normal") {
    const preview = resolveCustomModuleItems(module, getPreviewDays(), getPreviewPeople());
    const smartCount = preview.filter((item) => item.smartRule !== "fixed").length;
    if (view === "compact") {
      return `<div class="kit-card compact" onclick="openModuleDetail('custom','` + module.id + `')"><div class="kit-card-top"><div class="kit-card-icon">` + esc(module.icon || "\u{1F9F0}") + '</div><div class="kit-card-name">' + esc(module.name) + "</div></div></div>";
    }
    return `<div class="kit-card" onclick="openModuleDetail('custom','` + module.id + `')"><div class="kit-card-top"><div class="kit-card-icon">` + esc(module.icon || "\u{1F9F0}") + `</div><div class="inline-actions"><span class="kit-badge soft">\u6211\u7684\u5C0F\u5305</span><button class="icon-action" onclick="event.stopPropagation();openEditModuleModal('custom','` + module.id + `')" title="\u7F16\u8F91\u5C0F\u5305">\u270F\uFE0F</button></div></div><div class="kit-card-name">` + esc(module.name) + '</div><div class="kit-card-desc">' + esc(module.desc || "\u4F60\u81EA\u5DF1\u7EF4\u62A4\u7684\u53EF\u590D\u7528\u5C0F\u5305\u6A21\u5757") + '</div><div class="kit-card-meta">' + preview.length + " \u4EF6\u7269\u54C1 \xB7 " + smartCount + " \u9879\u53EF\u667A\u80FD\u586B\u5145</div></div>";
  }
  function setKitView(view) {
    S.kitView = view;
    renderModuleLibrary();
  }
  function openModuleDetail(source, id) {
    S.currentModule = { source, id };
    const entity = getModuleEntity(source, id);
    if (!entity) return;
    const days = getPreviewDays();
    const people = getPreviewPeople();
    const preview = source === "official" ? resolveOfficialModuleItems(entity, days, people) : resolveCustomModuleItems(entity, days, people);
    const smartCount = preview.filter((item) => item.smartRule !== "fixed").length;
    document.getElementById("moduleDetailTitle").textContent = entity.name;
    document.getElementById("moduleDetailIcon").textContent = entity.icon || "\u{1F9F0}";
    document.getElementById("moduleDetailSubtitle").textContent = source === "official" ? "\u5B98\u65B9\u5C0F\u5305 \xB7 \u53EF\u7F16\u8F91" : "\u6211\u7684\u5C0F\u5305 \xB7 \u53EF\u7F16\u8F91";
    document.getElementById("moduleDetailDesc").textContent = entity.desc || "\u53EF\u590D\u7528\u7684\u5C0F\u5305\u6A21\u5757\u3002";
    document.getElementById("moduleDetailTags").innerHTML = (entity.tags || []).map((tag) => '<span class="tag">' + esc(tag) + "</span>").join("") || '<span class="tag">\u6807\u51C6\u5316\u5C0F\u5305</span>';
    document.getElementById("moduleDetailSummary").textContent = `\u6309\u5F53\u524D ${days} \u5929 / ${people} \u4EBA\u9884\u89C8\uFF0C\u5171 ${preview.length} \u4EF6\u7269\u54C1\uFF0C\u5176\u4E2D ${smartCount} \u9879\u4F1A\u968F\u5929\u6570\u6216\u4EBA\u6570\u53D8\u5316\u3002`;
    document.getElementById("moduleDetailItems").innerHTML = preview.map((item) => renderReadonlyModuleItemCard(item, S.currentTrip?.bags || DEFAULT_BAGS)).join("");
    document.getElementById("moduleEditBtn").style.display = "inline-flex";
    document.getElementById("moduleEditBtn").textContent = source === "official" ? "\u7F16\u8F91\u5B98\u65B9\u5C0F\u5305" : "\u7F16\u8F91\u5C0F\u5305";
    document.getElementById("modulePrimaryBtn").textContent = S.currentModuleAction === "add" && S.currentTrip ? "\u52A0\u5165\u5F53\u524D\u884C\u7A0B" : "\u7528\u4E8E\u65B0\u884C\u7A0B";
    showModal("moduleDetailModal");
  }
  function renderReadonlyModuleItemCard(item, bags) {
    const cat = catInfo(item.category);
    const smart = item.smartRule !== "fixed" ? '<span class="item-pill smart-pill">' + esc(smartRuleShort(item.smartRule)) + "</span>" : "";
    return '<div class="list-item-card"><div class="list-item-main"><div class="list-item-name">' + esc(item.name) + '</div><div class="item-subline"><span class="item-pill ' + cat.cssClass + '">' + esc(cat.name) + '</span><span class="item-pill">' + esc(bagName(item.bag, bags)) + "</span>" + smart + '</div></div><div class="item-qty">\xD7' + item.qty + "</div></div>";
  }
  function useCurrentModule() {
    if (!S.currentModule) return;
    const { source, id } = S.currentModule;
    closeModal("moduleDetailModal");
    if (S.currentModuleAction === "add" && S.currentTrip) {
      addModuleToCurrentTrip(source, id);
      nav("list");
      return;
    }
    openCreateTripModal([getModuleKey(source, id)]);
  }
  function openEditCurrentModule() {
    if (!S.currentModule) return;
    closeModal("moduleDetailModal");
    openEditModuleModal(S.currentModule.source, S.currentModule.id);
  }
  function openEditModuleModal(source = "custom", id) {
    const module = getModuleEntity(source, id);
    if (!module) return;
    openCreateModuleModal(module.items, { editId: id, editSource: source });
  }
  function updateItemSearch(value) {
    S.itemSearch = value.trim();
    renderItemLibrary();
  }
  function setItemFilter(filterId) {
    S.itemFilter = filterId;
    renderItemLibrary();
  }
  function renderItemLibrary() {
    const banner = document.getElementById("itemContextBanner");
    const gridBox = document.getElementById("itemLibraryGrid");
    const searchInput = document.getElementById("itemSearchInput");
    const summaryBox = document.getElementById("itemLibrarySummary");
    const allItems = getItemLibrary();
    const currentTripNames = new Set((S.currentTrip?.items || []).map((item) => String(item.name || "").trim()));
    banner.classList.toggle("visible", !!S.currentTrip);
    banner.textContent = S.currentTrip ? `\u5F53\u524D\u884C\u7A0B\uFF1A${S.currentTrip.name}\u3002\u53EA\u663E\u793A\u672A\u52A0\u5165\u7684\u7269\u54C1\u3002` : "";
    searchInput.value = S.itemSearch;
    renderItemFilters();
    const keyword = S.itemSearch.toLowerCase();
    const hiddenCount = S.currentTrip ? allItems.filter((item) => currentTripNames.has(item.name)).length : 0;
    const items = allItems.filter((item) => {
      const filterMatch = S.itemFilter === "all" || item.category === S.itemFilter;
      const searchMatch = !keyword || item.name.toLowerCase().includes(keyword);
      const tripMatch = !S.currentTrip || !currentTripNames.has(item.name);
      return filterMatch && searchMatch && tripMatch;
    });
    const customCount = allItems.filter((item) => item.source === "user").length;
    if (summaryBox) {
      summaryBox.innerHTML = "<span>\u5171 " + allItems.length + " \u4EF6</span>" + (customCount ? '<span class="qs-dot">\xB7</span><span>\u81EA\u5EFA ' + customCount + "</span>" : "") + (hiddenCount ? '<span class="qs-dot">\xB7</span><span>\u5DF2\u9690\u85CF ' + hiddenCount + "</span>" : "");
    }
    gridBox.innerHTML = items.length ? items.map(renderLibraryCard).join("") : '<div class="empty-panel full-span"><div class="empty-hint">' + (S.currentTrip ? "\u672C\u6B21\u6E05\u5355\u7269\u54C1\u5DF2\u5168\u90E8\u8865\u9F50\u3002" : "\u6CA1\u6709\u5339\u914D\u7684\u7269\u54C1\u3002") + "</div></div>";
  }
  function renderItemFilters() {
    const options = [{ id: "all", name: "\u5168\u90E8" }, ...DEFAULT_CATEGORIES.map((cat) => ({ id: cat.id, name: cat.name }))];
    document.getElementById("itemFilterRow").innerHTML = options.map(
      (option) => '<button class="filter-chip ' + (S.itemFilter === option.id ? "active" : "") + `" onclick="setItemFilter('` + option.id + `')">` + esc(option.name) + "</button>"
    ).join("");
  }
  function renderLibraryCard(item) {
    const cat = catInfo(item.category);
    const addButton = S.currentTrip ? `<button class="library-action primary" onclick="event.stopPropagation();addLibraryItemToCurrentTrip('` + item.id + `')">+ \u52A0\u5165</button>` : "";
    const tagsHtml = (item.tags || []).map((tag) => '<span class="library-item-tag">' + esc(tag) + "</span>").join("");
    return '<div class="library-card ' + (item.source === "user" ? "user-built" : "") + `" onclick="openLibraryItemModal('` + item.id + `')"><div class="library-card-body"><div class="library-name">` + esc(item.name) + '</div><div class="library-meta">' + esc(cat.name) + " \xB7 " + esc(bagName(item.bag, DEFAULT_BAGS)) + " \xB7 \xD7" + item.defaultQty + "</div>" + (tagsHtml ? '<div class="library-item-tags">' + tagsHtml + "</div>" : "") + "</div>" + (addButton ? '<div class="library-actions">' + addButton + "</div>" : "") + "</div>";
  }
  function parseBulkNames(text) {
    return uniqueStrings(
      String(text || "").split(/[\s,，、；;]+/).map((name) => name.trim()).filter(Boolean)
    );
  }
  function collectDraftNames(singleInputId, bulkInputId = null) {
    const single = document.getElementById(singleInputId)?.value.trim() || "";
    const bulk = bulkInputId ? parseBulkNames(document.getElementById(bulkInputId)?.value || "") : [];
    return uniqueStrings([single, ...bulk].filter(Boolean));
  }
  function buildLibraryItemDraft(name, qty, category, bag, existing = null) {
    const { smartRule, smartConfig } = resolveItemSmartPlan(name, category, existing?.smartRule, existing?.smartConfig);
    return normalizeLibraryItem({
      ...existing,
      id: existing?.id || "asset-" + gid(),
      name,
      defaultQty: qty,
      category,
      bag,
      smartRule,
      smartConfig,
      source: existing?.source || "user"
    });
  }
  function openCreateTripModal(initialModuleKeys = []) {
    S.tripBuilderSelection = new Set(initialModuleKeys);
    ensureTripBuilderBabyBaseSelection();
    document.getElementById("createTripName").value = initialModuleKeys.length === 1 ? getModuleEntity(...splitModuleKey(initialModuleKeys[0]))?.name + " \u884C\u7A0B" : "\u65B0\u7684\u884C\u7A0B\u5355";
    document.getElementById("tripDays").value = S.currentTrip?.days || 2;
    document.getElementById("tripPeople").value = S.currentTrip?.people || 1;
    renderTripBuilderModules();
    syncTripBuilderSummary();
    showModal("createTripModal");
    setTimeout(() => document.getElementById("createTripName").focus(), 50);
  }
  function renderTripBuilderModules() {
    const box = document.getElementById("tripBuilderModuleGrid");
    if (!box) return;
    const modules = [
      ...getOfficialModules().map((module) => ({ source: "official", module })),
      ...getMyModules().map((module) => ({ source: "custom", module }))
    ];
    const forceBabyBase = tripBuilderHasBabyAddonSelection();
    box.innerHTML = modules.length ? modules.map(({ source, module }) => {
      const key = getModuleKey(source, module.id);
      const selected = S.tripBuilderSelection.has(key);
      const locked = forceBabyBase && source === "official" && module.id === BABY_MODULE_IDS.base;
      const preview = source === "official" ? resolveOfficialModuleItems(module, getTripBuilderDays(), getTripBuilderPeople()) : resolveCustomModuleItems(module, getTripBuilderDays(), getTripBuilderPeople());
      const smartCount = preview.filter((item) => item.smartRule !== "fixed").length;
      const typeLabel = module.group === "baby" ? module.role === "base" ? "\u5B9D\u5B9D\u5E95\u76D8" : "\u5B9D\u5B9D\u63D2\u4EF6" : source === "official" ? "\u5B98\u65B9\u5C0F\u5305" : "\u6211\u7684\u5C0F\u5305";
      const stateLabel = locked ? "\u9ED8\u8BA4\u5F00\u542F" : selected ? "\u5DF2\u52FE\u9009" : "\u70B9\u9009";
      return '<div class="picker-item module-choice ' + (selected ? "selected" : "") + `" onclick="toggleTripBuilderModule('` + source + "','" + module.id + `')"><div class="picker-item-top"><span class="item-pill">` + esc(typeLabel) + '</span><span class="mini-badge picker-tile-state">' + stateLabel + '</span></div><div class="picker-item-name">' + esc(module.icon || "\u{1F9F0}") + " " + esc(module.name) + '</div><div class="picker-item-meta">' + preview.length + " \u4EF6\u7269\u54C1 \xB7 " + smartCount + " \u9879\u4F1A\u53D8\u52A8</div></div>";
    }).join("") : '<div class="empty-panel full-span"><div class="empty-title">\u8FD8\u6CA1\u6709\u53EF\u9009\u5C0F\u5305</div><div class="empty-hint">\u5148\u53BB\u521B\u5EFA\u4E00\u4E2A\u5427\u3002</div></div>';
  }
  function toggleTripBuilderModule(source, id) {
    const key = getModuleKey(source, id);
    const module = getModuleEntity(source, id);
    if (isBabyBaseModuleEntity(module) && tripBuilderHasBabyAddonSelection()) {
      toast("\u5E26\u5A03\u884C\u7A0B\u4F1A\u9ED8\u8BA4\u5E26\u4E0A\u5B9D\u5B9D\u57FA\u7840\u5305");
      return;
    }
    if (S.tripBuilderSelection.has(key)) S.tripBuilderSelection.delete(key);
    else S.tripBuilderSelection.add(key);
    ensureTripBuilderBabyBaseSelection();
    renderTripBuilderModules();
    syncTripBuilderSummary();
  }
  function syncTripBuilderSummary() {
    const days = getTripBuilderDays();
    const people = getTripBuilderPeople();
    const modules = buildTripBuilderModulesFromSelection();
    const items = [];
    modules.forEach(({ source, module }) => {
      const resolved = source === "official" ? resolveOfficialModuleItems(module, days, people) : resolveCustomModuleItems(module, days, people);
      mergeTripItems(items, resolved, { days, people, sourceModules: modules.map((entry) => ({ source: entry.source, id: entry.module.id, name: entry.module.name })) }, "module");
    });
    const previewTrip = {
      days,
      people,
      items,
      sourceModules: modules.map((entry) => ({ source: entry.source, id: entry.module.id, name: entry.module.name }))
    };
    applyTripSmartFill(previewTrip, false);
    const hasBabyAddon = modules.some((entry) => isBabyModuleEntity(entry.module) && !isBabyBaseModuleEntity(entry.module));
    const smartCount = previewTrip.items.filter((item) => item.smartRule !== "fixed").length;
    document.getElementById("tripBuilderCount").textContent = `\u5DF2\u9009 ${modules.length} \u4E2A\u5C0F\u5305`;
    document.getElementById("tripBuilderSummary").innerHTML = modules.length ? `\u5DF2\u9009 <strong>${modules.length}</strong> \u4E2A\u5C0F\u5305\uFF0C\u9884\u8BA1\u751F\u6210 <strong>${previewTrip.items.length}</strong> \u4EF6\u7269\u54C1\uFF0C\u5176\u4E2D <strong>${smartCount}</strong> \u9879\u4F1A\u6309 ${days} \u5929 / ${people} \u4EBA\u81EA\u52A8\u5EFA\u8BAE\u6570\u91CF\u3002${hasBabyAddon ? " \u5DF2\u81EA\u52A8\u5E26\u4E0A <strong>\u5B9D\u5B9D\u57FA\u7840\u5305</strong>\uFF0C\u5E76\u4F1A\u7ED9\u5C3F\u4E0D\u6E7F\u3001\u5907\u7528\u8863\u88E4\u8FD9\u7C7B\u7269\u54C1\u53E0\u52A0\u573A\u666F\u7CFB\u6570\u3002" : ""}` : "\u4F60\u4E5F\u53EF\u4EE5\u5148\u521B\u5EFA\u4E00\u5F20\u7A7A\u767D\u884C\u7A0B\uFF0C\u518D\u6162\u6162\u4ECE\u5C0F\u5305\u5E93\u6216\u7269\u54C1\u5E93\u5F80\u91CC\u52A0\u3002";
  }
  function confirmCreateTrip() {
    const name = document.getElementById("createTripName").value.trim();
    if (!name) {
      toast("\u8BF7\u5148\u586B\u5199\u884C\u7A0B\u540D\u79F0");
      return;
    }
    const days = getTripBuilderDays();
    const people = getTripBuilderPeople();
    const selected = buildTripBuilderModulesFromSelection();
    const items = [];
    selected.forEach(({ source, module }) => {
      const resolved = source === "official" ? resolveOfficialModuleItems(module, days, people) : resolveCustomModuleItems(module, days, people);
      mergeTripItems(items, resolved, { days, people, sourceModules: selected.map((entry) => ({ source: entry.source, id: entry.module.id, name: entry.module.name })) }, "module");
    });
    const trip = normalizeTripRecord({
      id: "trip-" + gid(),
      recordType: "trip",
      name,
      days,
      people,
      bags: deepClone(DEFAULT_BAGS),
      sourceModules: selected.map(({ source, module }) => ({ source, id: module.id, name: module.name })),
      items,
      createdAt: (/* @__PURE__ */ new Date()).toISOString(),
      updatedAt: (/* @__PURE__ */ new Date()).toISOString()
    });
    applyTripSmartFill(trip, false);
    saveRecord(trip);
    closeModal("createTripModal");
    openTrip(trip.id, "plan");
    toast(selected.some((entry) => isBabyModuleEntity(entry.module) && !isBabyBaseModuleEntity(entry.module)) ? "\u884C\u7A0B\u5DF2\u521B\u5EFA\uFF0C\u5DF2\u81EA\u52A8\u5E26\u4E0A\u5B9D\u5B9D\u57FA\u7840\u5305" : "\u884C\u7A0B\u5DF2\u521B\u5EFA");
  }
  function goSelectModuleForTrip() {
    if (!S.currentTrip) return;
    S.returnPage = "list";
    S.currentModuleAction = "add";
    nav("kits");
  }
  function goSelectItemsForTrip() {
    if (!S.currentTrip) return;
    S.returnPage = "list";
    nav("items");
  }
  function addModuleToCurrentTrip(source, id) {
    if (!S.currentTrip) return;
    const entity = getModuleEntity(source, id);
    if (!entity) return;
    if (isBabyModuleEntity(entity) && !isBabyBaseModuleEntity(entity)) {
      ensureBabyBaseModuleOnTripRecord(S.currentTrip);
    }
    const items = source === "official" ? resolveOfficialModuleItems(entity, S.currentTrip.days, S.currentTrip.people) : resolveCustomModuleItems(entity, S.currentTrip.days, S.currentTrip.people);
    mergeItemsIntoCurrentTrip(items, "module", { source, id: entity.id, name: entity.name });
    toast(isBabyModuleEntity(entity) && !isBabyBaseModuleEntity(entity) ? "\u5DF2\u52A0\u5165\u63D2\u4EF6\u5305\uFF0C\u5E76\u81EA\u52A8\u8865\u4E0A\u5B9D\u5B9D\u57FA\u7840\u5305" : "\u5DF2\u628A\u5C0F\u5305\u52A0\u5165\u5F53\u524D\u884C\u7A0B");
  }
  function mergeItemsIntoCurrentTrip(items, strategy = "manual", sourceModule = null) {
    if (!S.currentTrip) return;
    mergeTripItems(S.currentTrip.items, items, S.currentTrip, strategy);
    if (sourceModule) upsertTripSourceModule(S.currentTrip, sourceModule);
    if (strategy === "module") applyTripSmartFill(S.currentTrip, false);
    persistCurrentTrip();
    renderTripPage();
    renderItemLibrary();
    renderHome();
  }
  function openLibraryItemModal(itemId = null) {
    S.libraryModalEditId = itemId;
    const item = itemId ? getItemLibrary().find((entry) => entry.id === itemId) : null;
    fillCatSelect("libraryItemCategory", item?.category || "misc");
    fillBagSelect("libraryItemBag", item?.bag || (CATEGORY_BAG_MAP[item?.category || "misc"] || "bag-misc"), DEFAULT_BAGS);
    document.getElementById("libraryItemModalTitle").textContent = item ? "\u7F16\u8F91\u7269\u54C1" : "\u65B0\u589E\u7269\u54C1";
    document.getElementById("libraryItemName").value = item?.name || "";
    document.getElementById("libraryItemQty").value = item?.defaultQty || 1;
    document.getElementById("libraryItemBulkInput").value = "";
    document.getElementById("libraryBulkPanel").style.display = item ? "none" : "block";
    document.getElementById("libraryDeleteBtn").style.visibility = item?.source === "user" ? "visible" : "hidden";
    S.currentEditingTags = Array.isArray(item?.tags) ? [...item.tags] : [];
    renderLibraryItemTags();
    document.getElementById("libraryItemTagInput").value = "";
    updateLibrarySmartHint();
    showModal("libraryItemModal");
    setTimeout(() => document.getElementById("libraryItemName").focus(), 50);
  }
  function renderLibraryItemTags() {
    const el = document.getElementById("libraryItemTagsDisplay");
    if (!el) return;
    el.innerHTML = S.currentEditingTags.map(
      (tag) => '<span class="item-tag-pill">' + esc(tag) + `<span class="item-tag-remove" onclick="removeLibraryItemTag('` + esc(tag) + `')">\u2715</span></span>`
    ).join("");
  }
  function addLibraryItemTag() {
    const input = document.getElementById("libraryItemTagInput");
    const val = input?.value.trim();
    if (!val) return;
    if (S.currentEditingTags.includes(val)) {
      toast("\u8BE5\u6807\u7B7E\u5DF2\u5B58\u5728");
      return;
    }
    S.currentEditingTags.push(val);
    renderLibraryItemTags();
    if (input) input.value = "";
  }
  function removeLibraryItemTag(tag) {
    S.currentEditingTags = S.currentEditingTags.filter((t) => t !== tag);
    renderLibraryItemTags();
  }
  function updateLibrarySmartHint() {
    const hint = document.getElementById("libraryItemSmartHint");
    if (!hint) return;
    const names = S.libraryModalEditId ? collectDraftNames("libraryItemName") : collectDraftNames("libraryItemName", "libraryItemBulkInput");
    const category = document.getElementById("libraryItemCategory")?.value || "misc";
    const qty = Math.max(1, parseInt(document.getElementById("libraryItemQty")?.value) || 1);
    if (!names.length) {
      hint.textContent = "\u8863\u7269\u7C7B\u548C\u5B9D\u5B9D\u9AD8\u9891\u6D88\u8017\u7269\u54C1\u4F1A\u9ED8\u8BA4\u53C2\u4E0E\u667A\u80FD\u586B\u5145\uFF1B\u6279\u91CF\u6DFB\u52A0\u65F6\u4F1A\u9ED8\u8BA4\u4F7F\u7528\u540C\u4E00\u5206\u7C7B\u548C\u9ED8\u8BA4\u6570\u91CF\u3002";
      return;
    }
    if (!S.libraryModalEditId && names.length > 1) {
      hint.textContent = `\u5C06\u6279\u91CF\u4FDD\u5B58 ${names.length} \u4EF6\u7269\u54C1\uFF0C\u7EDF\u4E00\u4F7F\u7528\u5F53\u524D\u5206\u7C7B\u3001\u9ED8\u8BA4\u6570\u91CF\u548C\u5F52\u5C5E\u5C0F\u5305\uFF1B\u4FDD\u5B58\u540E\u4E5F\u53EF\u4EE5\u9010\u4E2A\u518D\u4FEE\u6539\u3002`;
      return;
    }
    const name = names[0];
    const { smartRule, smartConfig } = resolveItemSmartPlan(name, category);
    hint.textContent = smartRule === "fixed" ? `\u5F53\u524D\u4F1A\u6309\u56FA\u5B9A\u9ED8\u8BA4\u6570\u91CF \xD7${qty} \u4FDD\u5B58\u3002` : `\u5F53\u524D\u4F1A\u6309"${smartRuleLabel(smartRule, smartConfig)}"\u53C2\u4E0E\u667A\u80FD\u586B\u5145\uFF1B\u57FA\u7840\u6570\u91CF\u4E3A ${qty}\u3002`;
  }
  function saveLibraryItem() {
    const names = S.libraryModalEditId ? collectDraftNames("libraryItemName") : collectDraftNames("libraryItemName", "libraryItemBulkInput");
    if (!names.length) {
      toast("\u8BF7\u586B\u5199\u81F3\u5C11\u4E00\u4E2A\u7269\u54C1\u540D\u79F0");
      return;
    }
    const qty = Math.max(1, parseInt(document.getElementById("libraryItemQty").value) || 1);
    const category = document.getElementById("libraryItemCategory").value;
    const bag = document.getElementById("libraryItemBag").value;
    const items = getItemLibrary();
    let added = 0;
    let updated = 0;
    names.forEach((name, index) => {
      const existing = S.libraryModalEditId ? items.find((item) => item.id === S.libraryModalEditId) : items.find((item) => item.name === name);
      const nextItem = buildLibraryItemDraft(name, qty, category, bag, existing);
      if (S.libraryModalEditId && index === 0) {
        nextItem.tags = [...S.currentEditingTags];
      } else if (!existing) {
        nextItem.tags = [];
      }
      if (existing) {
        const idx = items.findIndex((item) => item.id === existing.id);
        if (idx >= 0) items[idx] = nextItem;
        updated += 1;
      } else {
        items.unshift(nextItem);
        added += 1;
      }
      if (S.libraryModalEditId && index === 0) return;
    });
    saveItemLibrary(items);
    closeModal("libraryItemModal");
    renderItemLibrary();
    renderModuleBuilderItems();
    toast(names.length > 1 ? `\u5DF2\u6279\u91CF\u5904\u7406 ${names.length} \u4EF6\u7269\u54C1\uFF08\u65B0\u589E ${added}\uFF0C\u66F4\u65B0 ${updated}\uFF09` : "\u7269\u54C1\u5E93\u5DF2\u66F4\u65B0");
  }
  function deleteLibraryItem() {
    if (!S.libraryModalEditId) return;
    const items = getItemLibrary();
    const target = items.find((item) => item.id === S.libraryModalEditId);
    if (!target || target.source !== "user") {
      toast("\u7CFB\u7EDF\u7269\u54C1\u4E0D\u652F\u6301\u5220\u9664");
      return;
    }
    saveItemLibrary(items.filter((item) => item.id !== S.libraryModalEditId));
    closeModal("libraryItemModal");
    renderItemLibrary();
    renderModuleBuilderItems();
    toast("\u5DF2\u5220\u9664\u7269\u54C1");
  }
  function openManualItemModal() {
    fillCatSelect("manualItemCategory", "misc");
    fillBagSelect("manualItemBag", "bag-misc", S.currentTrip?.bags || DEFAULT_BAGS);
    document.getElementById("manualItemName").value = "";
    document.getElementById("manualItemBulkInput").value = "";
    document.getElementById("manualItemQty").value = 1;
    document.getElementById("manualItemNotes").value = "";
    updateManualItemSmartHint();
    showModal("manualItemModal");
    setTimeout(() => document.getElementById("manualItemName").focus(), 50);
  }
  function updateManualItemSmartHint() {
    const hint = document.getElementById("manualItemSmartHint");
    if (!hint) return;
    const names = collectDraftNames("manualItemName", "manualItemBulkInput");
    const category = document.getElementById("manualItemCategory")?.value || "misc";
    const qty = Math.max(1, parseInt(document.getElementById("manualItemQty")?.value) || 1);
    if (!names.length) {
      hint.textContent = "\u652F\u6301\u4E00\u6B21\u7C98\u8D34\u591A\u4EF6\u7269\u54C1\uFF0C\u7CFB\u7EDF\u4F1A\u6309\u7A7A\u683C\u3001\u9017\u53F7\u6216\u6362\u884C\u62C6\u5206\uFF1B\u6BCF\u4EF6\u7269\u54C1\u90FD\u4F1A\u5355\u72EC\u5224\u65AD\u667A\u80FD\u6570\u91CF\u3002";
      return;
    }
    if (names.length > 1) {
      hint.textContent = `\u5C06\u6309\u5F53\u524D\u5206\u7C7B\u548C\u5F52\u5C5E\u5C0F\u5305\u6279\u91CF\u6DFB\u52A0 ${names.length} \u4EF6\u7269\u54C1\uFF1B\u6BCF\u4EF6\u90FD\u4F1A\u5355\u72EC\u5224\u65AD\u667A\u80FD\u6570\u91CF\uFF0C\u4E4B\u540E\u4E5F\u53EF\u4EE5\u9010\u4E2A\u4FEE\u6539\u3002`;
      return;
    }
    const { smartRule, smartConfig } = resolveItemSmartPlan(names[0], category);
    const currentSuggestion = S.currentTrip ? computeSmartQty(qty, smartRule, S.currentTrip.days, S.currentTrip.people, smartConfig, S.currentTrip) : qty;
    hint.textContent = smartRule === "fixed" ? `\u8FD9\u4EF6\u7269\u54C1\u4F1A\u6309\u56FA\u5B9A\u6570\u91CF \xD7${qty} \u52A0\u5165\u5F53\u524D\u884C\u7A0B\u3002` : `\u8FD9\u4EF6\u7269\u54C1\u4F1A\u6309"${smartRuleLabel(smartRule, smartConfig)}"\u667A\u80FD\u5EFA\u8BAE\uFF1B\u5F53\u524D\u884C\u7A0B\u9884\u8BA1\u6570\u91CF \xD7${currentSuggestion}\u3002`;
  }
  function saveManualTripItem() {
    if (!S.currentTrip) return;
    const names = collectDraftNames("manualItemName", "manualItemBulkInput");
    if (!names.length) {
      toast("\u8BF7\u586B\u5199\u81F3\u5C11\u4E00\u4E2A\u7269\u54C1\u540D\u79F0");
      return;
    }
    const baseQty = Math.max(1, parseInt(document.getElementById("manualItemQty").value) || 1);
    const category = document.getElementById("manualItemCategory").value;
    const bag = document.getElementById("manualItemBag").value;
    const notes = document.getElementById("manualItemNotes").value.trim();
    const items = names.map((name) => {
      const { smartRule, smartConfig } = resolveItemSmartPlan(name, category);
      return normalizeTripItem({
        id: "item-" + gid(),
        name,
        category,
        bag,
        notes,
        smartRule,
        smartConfig,
        smartBaseQty: baseQty,
        qty: computeSmartQty(baseQty, smartRule, S.currentTrip.days, S.currentTrip.people, smartConfig, S.currentTrip),
        packed: false,
        sourceModules: []
      });
    });
    mergeItemsIntoCurrentTrip(items, "manual");
    closeModal("manualItemModal");
    toast(names.length > 1 ? `\u5DF2\u6279\u91CF\u6DFB\u52A0 ${names.length} \u4EF6\u7269\u54C1` : "\u5DF2\u6DFB\u52A0\u5230\u884C\u7A0B");
  }
  function openTripItemModal(itemId) {
    if (!S.currentTrip) return;
    const item = S.currentTrip.items.find((entry) => entry.id === itemId);
    if (!item) return;
    S.tripItemEditId = itemId;
    document.getElementById("tripItemModalTitle").textContent = item.name;
    document.getElementById("tripItemQty").value = item.qty;
    fillCatSelect("tripItemCategory", item.category);
    fillBagSelect("tripItemBag", item.bag, S.currentTrip.bags || DEFAULT_BAGS);
    document.getElementById("tripItemNotes").value = item.notes || "";
    S.currentEditingTags = Array.isArray(item.tags) ? [...item.tags] : [];
    renderTripItemTags();
    document.getElementById("tripItemTagInput").value = "";
    updateTripItemSmartMeta();
    showModal("tripItemModal");
  }
  function renderTripItemTags() {
    const el = document.getElementById("tripItemTagsDisplay");
    if (!el) return;
    el.innerHTML = S.currentEditingTags.map(
      (tag) => '<span class="item-tag-pill">' + esc(tag) + `<span class="item-tag-remove" onclick="removeTripItemTag('` + esc(tag) + `')">\u2715</span></span>`
    ).join("");
  }
  function addTripItemTag() {
    const input = document.getElementById("tripItemTagInput");
    const val = input?.value.trim();
    if (!val) return;
    if (S.currentEditingTags.includes(val)) {
      toast("\u8BE5\u6807\u7B7E\u5DF2\u5B58\u5728");
      return;
    }
    S.currentEditingTags.push(val);
    renderTripItemTags();
    if (input) input.value = "";
  }
  function removeTripItemTag(tag) {
    S.currentEditingTags = S.currentEditingTags.filter((t) => t !== tag);
    renderTripItemTags();
  }
  function updateTripItemSmartMeta() {
    const meta = document.getElementById("tripItemSmartMeta");
    if (!meta || !S.currentTrip || !S.tripItemEditId) return;
    const item = S.currentTrip.items.find((entry) => entry.id === S.tripItemEditId);
    if (!item) return;
    if (item.smartRule === "fixed") {
      meta.style.display = "none";
      return;
    }
    const qty = Math.max(1, parseInt(document.getElementById("tripItemQty").value) || 1);
    const suggested = computeSmartQty(item.smartBaseQty || 1, item.smartRule, S.currentTrip.days, S.currentTrip.people);
    meta.style.display = "block";
    meta.textContent = qty === suggested ? `\u667A\u80FD\u586B\u5145\uFF1A${smartRuleLabel(item.smartRule)}\u3002\u5F53\u524D\u5EFA\u8BAE\u6570\u91CF \xD7${suggested}\u3002` : `\u667A\u80FD\u586B\u5145\uFF1A${smartRuleLabel(item.smartRule)}\u3002\u5F53\u524D\u5EFA\u8BAE \xD7${suggested}\uFF1B\u4F60\u73B0\u5728\u586B\u5199\u7684\u662F \xD7${qty}\uFF0C\u4FDD\u5B58\u540E\u4F1A\u4F18\u5148\u6309\u4F60\u7684\u624B\u52A8\u6570\u91CF\u4FDD\u7559\u3002`;
  }
  function saveCurrentTripItem() {
    if (!S.currentTrip || !S.tripItemEditId) return;
    const item = S.currentTrip.items.find((entry) => entry.id === S.tripItemEditId);
    if (!item) return;
    item.qty = Math.max(1, parseInt(document.getElementById("tripItemQty").value) || 1);
    item.category = document.getElementById("tripItemCategory").value;
    item.bag = document.getElementById("tripItemBag").value;
    item.notes = document.getElementById("tripItemNotes").value.trim();
    item.tags = [...S.currentEditingTags];
    if (item.smartRule !== "fixed") {
      const suggested = computeSmartQty(item.smartBaseQty || 1, item.smartRule, S.currentTrip.days, S.currentTrip.people);
      item.smartLocked = item.qty !== suggested;
    }
    persistCurrentTrip();
    closeModal("tripItemModal");
    renderTripPage();
    renderHome();
    toast("\u7269\u54C1\u5DF2\u66F4\u65B0");
  }
  function deleteCurrentTripItem() {
    if (!S.currentTrip || !S.tripItemEditId) return;
    S.currentTrip.items = S.currentTrip.items.filter((item) => item.id !== S.tripItemEditId);
    persistCurrentTrip();
    closeModal("tripItemModal");
    renderTripPage();
    renderHome();
    toast("\u5DF2\u5220\u9664\u7269\u54C1");
  }
  function togglePackItem(itemId) {
    if (!S.currentTrip) return;
    const item = S.currentTrip.items.find((entry) => entry.id === itemId);
    if (!item) return;
    item.packed = !item.packed;
    persistCurrentTrip();
    renderTripPage();
    renderHome();
  }
  function markAllPacked() {
    if (!S.currentTrip) return;
    S.currentTrip.items.forEach((item) => {
      item.packed = true;
    });
    persistCurrentTrip();
    renderTripPage();
    renderHome();
    toast("\u5DF2\u5168\u90E8\u6807\u8BB0\u5B8C\u6210");
  }
  function markAllUnpacked() {
    if (!S.currentTrip) return;
    S.currentTrip.items.forEach((item) => {
      item.packed = false;
    });
    persistCurrentTrip();
    renderTripPage();
    renderHome();
    toast("\u5DF2\u6062\u590D\u4E3A\u672A\u6253\u5305");
  }
  function openCreateModuleModal(initialItems = null, options = {}) {
    const editSource = options.editSource || "custom";
    const editModule = options.editId ? getModuleEntity(editSource, options.editId) : null;
    const baseItems = editModule ? editModule.items : initialItems || [];
    syncItemsIntoLibrary(baseItems);
    const library = getItemLibrary();
    const selected = baseItems.map((item) => library.find((asset) => asset.name === item.name)?.id).filter(Boolean);
    S.moduleBuilderDraftId = editModule?.id || null;
    S.moduleBuilderDraftSource = editModule ? editSource : "custom";
    S.moduleBuilderSelection = new Set(selected);
    S.moduleBuilderSearch = "";
    document.getElementById("moduleBuilderModalTitle").textContent = editModule ? editSource === "official" ? "\u7F16\u8F91\u5B98\u65B9\u5C0F\u5305" : "\u7F16\u8F91\u6211\u7684\u5C0F\u5305" : "\u65B0\u5EFA\u6211\u7684\u5C0F\u5305";
    document.getElementById("moduleBuilderSaveBtn").textContent = editModule ? "\u4FDD\u5B58\u5C0F\u5305\u4FEE\u6539" : "\u4FDD\u5B58\u5230\u6211\u7684\u5C0F\u5305";
    document.getElementById("moduleBuilderDeleteBtn").style.visibility = editModule ? "visible" : "hidden";
    document.getElementById("moduleBuilderHint").textContent = editModule ? "\u5DF2\u5E26\u51FA\u539F\u6709\u7269\u54C1\uFF1B\u6309\u4F4F\u5E76\u6ED1\u8FC7\u5361\u7247\u53EF\u8FDE\u7EED\u8865\u9009\u6216\u53D6\u6D88\uFF0C\u4E5F\u80FD\u624B\u52A8\u8F93\u4E00\u4E2A\u65B0\u7269\u54C1\u9A6C\u4E0A\u52A0\u8FDB\u5F53\u524D\u5C0F\u5305\u3002" : "\u4ECE\u7269\u54C1\u5E93\u91CC\u6309\u4F4F\u5E76\u6ED1\u8FC7\u5361\u7247\u5373\u53EF\u8FDE\u7EED\u591A\u9009\uFF1B\u4E5F\u53EF\u4EE5\u5148\u624B\u52A8\u8F93\u5165\u4E00\u4E2A\u65B0\u7269\u54C1\u518D\u9009\u5165\u5C0F\u5305\u3002";
    document.getElementById("moduleBuilderName").value = editModule?.name || "";
    document.getElementById("moduleBuilderIcon").value = editModule?.icon || "\u{1F9F0}";
    document.getElementById("moduleBuilderDesc").value = editModule?.desc || "";
    document.getElementById("moduleBuilderSearch").value = "";
    document.getElementById("moduleQuickItemName").value = "";
    document.getElementById("moduleQuickItemQty").value = 1;
    document.getElementById("moduleQuickItemCategory").value = "misc";
    renderModuleBuilderItems();
    showModal("createModuleModal");
    setTimeout(() => document.getElementById("moduleBuilderName").focus(), 50);
  }
  function updateModuleBuilderSearch(value) {
    S.moduleBuilderSearch = value.trim();
    renderModuleBuilderItems();
  }
  function clearModuleBuilderSelection() {
    S.moduleBuilderSelection = /* @__PURE__ */ new Set();
    renderModuleBuilderItems();
  }
  function updateModuleQuickItemCategory() {
    const input = document.getElementById("moduleQuickItemName");
    const select = document.getElementById("moduleQuickItemCategory");
    if (!input || !select) return;
    const current = select.value;
    if (current && current !== "misc") return;
    select.value = guessCat(input.value.trim());
  }
  function addBuilderCustomItem() {
    const name = document.getElementById("moduleQuickItemName").value.trim();
    if (!name) {
      toast("\u8BF7\u5148\u586B\u5199\u7269\u54C1\u540D\u79F0");
      return;
    }
    const qty = Math.max(1, parseInt(document.getElementById("moduleQuickItemQty").value) || 1);
    const category = document.getElementById("moduleQuickItemCategory").value || guessCat(name);
    const bag = category === "misc" && name.includes("\u5B9D\u5B9D") ? "bag-baby" : CATEGORY_BAG_MAP[category] || "bag-misc";
    const { smartRule, smartConfig } = resolveItemSmartPlan(name, category);
    const library = getItemLibrary();
    let target = library.find((item) => item.name === name) || null;
    if (!target) {
      target = normalizeLibraryItem({
        id: "asset-" + gid(),
        name,
        defaultQty: qty,
        category,
        bag,
        smartRule,
        smartConfig,
        source: "user"
      });
      library.unshift(target);
      saveItemLibrary(library);
    } else {
      target = normalizeLibraryItem({
        ...target,
        defaultQty: qty,
        category,
        bag,
        smartRule,
        smartConfig
      });
      const idx = library.findIndex((item) => item.id === target.id);
      if (idx >= 0) library[idx] = target;
      saveItemLibrary(library);
    }
    S.moduleBuilderSelection.add(target.id);
    document.getElementById("moduleQuickItemName").value = "";
    document.getElementById("moduleQuickItemQty").value = 1;
    document.getElementById("moduleQuickItemCategory").value = "misc";
    renderModuleBuilderItems();
    renderItemLibrary();
    toast("\u65B0\u7269\u54C1\u5DF2\u52A0\u5165\u7269\u54C1\u5E93\uFF0C\u5E76\u9009\u5165\u5F53\u524D\u5C0F\u5305");
  }
  function renderModuleBuilderItems() {
    const box = document.getElementById("moduleBuilderItems");
    if (!box) return;
    const keyword = S.moduleBuilderSearch.toLowerCase();
    const items = getItemLibrary().filter((item) => !keyword || item.name.toLowerCase().includes(keyword)).sort((a, b) => {
      const selectedDiff = Number(S.moduleBuilderSelection.has(b.id)) - Number(S.moduleBuilderSelection.has(a.id));
      if (selectedDiff !== 0) return selectedDiff;
      const userDiff = Number(b.source === "user") - Number(a.source === "user");
      if (userDiff !== 0) return userDiff;
      return a.name.localeCompare(b.name, "zh-Hans-CN");
    });
    box.innerHTML = items.length ? items.map((item) => {
      const selected = S.moduleBuilderSelection.has(item.id);
      const cat = catInfo(item.category);
      return '<div class="picker-item ' + (selected ? "selected" : "") + '" data-item-id="' + item.id + '"><div class="picker-item-top"><span class="item-pill ' + cat.cssClass + '">' + esc(cat.name) + '</span><span class="mini-badge picker-tile-state">' + (selected ? "\u5DF2\u9009" : "\u6ED1\u9009") + '</span></div><div class="picker-item-name">' + esc(item.name) + '</div><div class="picker-item-meta">\u9ED8\u8BA4 \xD7' + item.defaultQty + " \xB7 " + esc(smartRuleShort(item.smartRule)) + "</div></div>";
    }).join("") : '<div class="empty-panel full-span"><div class="empty-title">\u6CA1\u6709\u627E\u5230\u7269\u54C1</div><div class="empty-hint">\u6362\u4E2A\u5173\u952E\u8BCD\u8BD5\u8BD5\u3002</div></div>';
    syncModuleBuilderMeta();
  }
  function syncModuleBuilderMeta() {
    const meta = document.getElementById("moduleBuilderCount");
    const clearBtn = document.getElementById("moduleBuilderClearBtn");
    if (meta) meta.textContent = `\u5DF2\u9009 ${S.moduleBuilderSelection.size} \u4EF6`;
    if (clearBtn) clearBtn.textContent = S.moduleBuilderSelection.size ? `\u6E05\u7A7A\uFF08${S.moduleBuilderSelection.size}\uFF09` : "\u6E05\u7A7A\u9009\u62E9";
  }
  function setupModuleBuilderGesture() {
    const box = document.getElementById("moduleBuilderItems");
    if (!box || box.dataset.gestureReady === "true") return;
    box.dataset.gestureReady = "true";
    box.addEventListener("pointerdown", handleModuleBuilderPointerDown);
    box.addEventListener("pointermove", handleModuleBuilderPointerMove);
    document.addEventListener("pointerup", endModuleBuilderGesture);
    document.addEventListener("pointercancel", endModuleBuilderGesture);
  }
  function handleModuleBuilderPointerDown(event) {
    const box = document.getElementById("moduleBuilderItems");
    const tile = event.target.closest(".picker-item");
    if (!box || !tile || !box.contains(tile)) return;
    const itemId = tile.dataset.itemId;
    const shouldSelect = !S.moduleBuilderSelection.has(itemId);
    S.moduleBuilderGesture = {
      active: true,
      pointerId: event.pointerId,
      mode: shouldSelect ? "add" : "remove",
      visited: /* @__PURE__ */ new Set()
    };
    try {
      box.setPointerCapture(event.pointerId);
    } catch {
    }
    applyModuleBuilderGesture(itemId);
    event.preventDefault();
  }
  function handleModuleBuilderPointerMove(event) {
    if (!S.moduleBuilderGesture.active || S.moduleBuilderGesture.pointerId !== event.pointerId) return;
    const box = document.getElementById("moduleBuilderItems");
    if (!box) return;
    const node = document.elementFromPoint(event.clientX, event.clientY);
    const tile = node && node.closest ? node.closest(".picker-item") : null;
    if (!tile || !box.contains(tile)) return;
    applyModuleBuilderGesture(tile.dataset.itemId);
    event.preventDefault();
  }
  function applyModuleBuilderGesture(itemId) {
    if (!itemId || S.moduleBuilderGesture.visited.has(itemId)) return;
    S.moduleBuilderGesture.visited.add(itemId);
    setModuleBuilderItemSelected(itemId, S.moduleBuilderGesture.mode === "add");
  }
  function setModuleBuilderItemSelected(itemId, selected) {
    if (selected) S.moduleBuilderSelection.add(itemId);
    else S.moduleBuilderSelection.delete(itemId);
    const tile = document.querySelector('.picker-item[data-item-id="' + itemId + '"]');
    if (tile) {
      tile.classList.toggle("selected", selected);
      const state = tile.querySelector(".picker-tile-state");
      if (state) state.textContent = selected ? "\u5DF2\u9009" : "\u6ED1\u9009";
    }
    syncModuleBuilderMeta();
  }
  function endModuleBuilderGesture(event) {
    if (!S.moduleBuilderGesture.active) return;
    if (event?.pointerId != null && event.pointerId !== S.moduleBuilderGesture.pointerId) return;
    const box = document.getElementById("moduleBuilderItems");
    try {
      box?.releasePointerCapture?.(S.moduleBuilderGesture.pointerId);
    } catch {
    }
    S.moduleBuilderGesture = {
      active: false,
      pointerId: null,
      mode: "add",
      visited: /* @__PURE__ */ new Set()
    };
  }
  function saveCustomModule() {
    const name = document.getElementById("moduleBuilderName").value.trim();
    if (!name) {
      toast("\u8BF7\u586B\u5199\u5C0F\u5305\u540D\u79F0");
      return;
    }
    const selectedIds = Array.from(S.moduleBuilderSelection);
    if (!selectedIds.length) {
      toast("\u8BF7\u81F3\u5C11\u9009\u62E9\u4E00\u4E2A\u7269\u54C1");
      return;
    }
    const library = getItemLibrary();
    const items = selectedIds.map((id) => {
      const asset = library.find((entry) => entry.id === id);
      return asset ? createModuleItemFromAsset(asset) : null;
    }).filter(Boolean);
    if (S.moduleBuilderDraftSource === "official") {
      const officialModules = getOfficialModules();
      const existing2 = S.moduleBuilderDraftId ? officialModules.find((item) => item.id === S.moduleBuilderDraftId) : null;
      const nextModule = normalizeOfficialModule({
        ...existing2,
        id: existing2?.id || "official-module-" + gid(),
        name,
        icon: document.getElementById("moduleBuilderIcon").value.trim() || "\u{1F9F0}",
        desc: document.getElementById("moduleBuilderDesc").value.trim(),
        purpose: existing2?.purpose || "starter",
        group: existing2?.group || "",
        role: existing2?.role || "",
        defaultOn: existing2?.defaultOn || false,
        tags: existing2?.tags?.length ? existing2.tags : ["\u5B98\u65B9\u5C0F\u5305"],
        items
      });
      const idx = officialModules.findIndex((item) => item.id === nextModule.id);
      if (idx >= 0) officialModules[idx] = nextModule;
      else officialModules.unshift(nextModule);
      saveOfficialModules(officialModules);
      closeModal("createModuleModal");
      renderModuleLibrary();
      renderHome();
      toast("\u5B98\u65B9\u5C0F\u5305\u5DF2\u66F4\u65B0");
      return;
    }
    const existing = S.moduleBuilderDraftId ? getMyModules().find((item) => item.id === S.moduleBuilderDraftId) : null;
    const module = normalizeModuleRecord({
      id: existing?.id || "module-" + gid(),
      recordType: "module",
      name,
      icon: document.getElementById("moduleBuilderIcon").value.trim() || "\u{1F9F0}",
      desc: document.getElementById("moduleBuilderDesc").value.trim(),
      purpose: "custom",
      tags: existing?.tags || ["\u6211\u7684\u5C0F\u5305"],
      items,
      createdAt: existing?.createdAt || (/* @__PURE__ */ new Date()).toISOString(),
      updatedAt: (/* @__PURE__ */ new Date()).toISOString()
    });
    saveRecord(module);
    closeModal("createModuleModal");
    renderModuleLibrary();
    renderHome();
    toast(existing ? "\u5C0F\u5305\u5DF2\u66F4\u65B0" : "\u5DF2\u4FDD\u5B58\u5230\u6211\u7684\u5C0F\u5305");
  }
  function deleteCurrentModuleDraft() {
    if (!S.moduleBuilderDraftId) return;
    if (!confirm(S.moduleBuilderDraftSource === "official" ? "\u786E\u5B9A\u5220\u9664\u8FD9\u4E2A\u5B98\u65B9\u5C0F\u5305\u5417\uFF1F" : "\u786E\u5B9A\u5220\u9664\u8FD9\u4E2A\u5C0F\u5305\u5417\uFF1F")) return;
    if (S.moduleBuilderDraftSource === "official") {
      saveOfficialModules(getOfficialModules().filter((item) => item.id !== S.moduleBuilderDraftId));
    } else {
      deleteRecord(S.moduleBuilderDraftId, { silent: true });
    }
    closeModal("createModuleModal");
    renderModuleLibrary();
    renderHome();
    toast(S.moduleBuilderDraftSource === "official" ? "\u5DF2\u5220\u9664\u5B98\u65B9\u5C0F\u5305" : "\u5DF2\u5220\u9664\u5C0F\u5305");
  }
  function saveCurrentTripAsModule() {
    if (!S.currentTrip || !S.currentTrip.items.length) {
      toast("\u7A7A\u884C\u7A0B\u8FD8\u4E0D\u80FD\u4FDD\u5B58\u4E3A\u5C0F\u5305");
      return;
    }
    openCreateModuleModal(S.currentTrip.items);
    document.getElementById("moduleBuilderName").value = S.currentTrip.name + " \u5C0F\u5305";
    document.getElementById("moduleBuilderDesc").value = `\u7531\u884C\u7A0B\u300C${S.currentTrip.name}\u300D\u6C89\u6DC0\u800C\u6765\uFF0C\u53EF\u5728\u540E\u7EED Trips \u4E2D\u590D\u7528\u3002`;
  }
  function duplicateTrip(id) {
    const target = getTrips().find((trip) => trip.id === id);
    if (!target) return;
    const copy = deepClone(target);
    copy.id = "trip-" + gid();
    copy.name = target.name + "\uFF08\u526F\u672C\uFF09";
    copy.recordType = "trip";
    copy.createdAt = (/* @__PURE__ */ new Date()).toISOString();
    copy.updatedAt = (/* @__PURE__ */ new Date()).toISOString();
    saveRecord(copy);
    renderHome();
    toast("\u5DF2\u590D\u5236\u884C\u7A0B");
  }
  function deleteRecord(id, options = {}) {
    const records = getRecords().filter((record) => record.id !== id);
    saveRecords(records);
    if (S.currentTripId === id) {
      S.currentTripId = null;
      S.currentTrip = null;
    }
    if (S.currentModule?.id === id) {
      S.currentModule = null;
      closeModal("moduleDetailModal");
    }
    if (!options.silent) {
      if (S.currentPage === "list") nav("home");
      renderHome();
      renderModuleLibrary();
      toast("\u5DF2\u5220\u9664");
    }
  }
  function persistCurrentTrip() {
    if (!S.currentTrip?.id) return;
    S.currentTrip.updatedAt = (/* @__PURE__ */ new Date()).toISOString();
    saveRecord(S.currentTrip);
  }
  function stepValue(id, delta) {
    const input = document.getElementById(id);
    if (!input) return;
    const min = parseInt(input.min) || 0;
    const max = parseInt(input.max) || 90;
    let value = parseInt(input.value);
    if (!Number.isFinite(value)) value = min;
    value = Math.max(min, Math.min(max, value + delta));
    input.value = value;
    if (id === "tripDays" || id === "tripPeople") {
      syncTripBuilderSummary();
      renderTripBuilderModules();
    }
  }
  function getTripBuilderDays() {
    return Math.max(1, parseInt(document.getElementById("tripDays")?.value) || 1);
  }
  function getTripBuilderPeople() {
    return Math.max(1, parseInt(document.getElementById("tripPeople")?.value) || 1);
  }
  function getPreviewDays() {
    return S.currentTrip?.days || 2;
  }
  function getPreviewPeople() {
    return S.currentTrip?.people || 1;
  }
  function tripBuilderHasBabyAddonSelection() {
    return Array.from(S.tripBuilderSelection).some((key) => {
      const [source, id] = splitModuleKey(key);
      const module = getModuleEntity(source, id);
      return isBabyModuleEntity(module) && !isBabyBaseModuleEntity(module);
    });
  }
  function ensureTripBuilderBabyBaseSelection() {
    if (!tripBuilderHasBabyAddonSelection()) return;
    S.tripBuilderSelection.add(getModuleKey("official", BABY_MODULE_IDS.base));
  }
  function buildTripBuilderModulesFromSelection() {
    ensureTripBuilderBabyBaseSelection();
    return Array.from(S.tripBuilderSelection).map((key) => {
      const [source, id] = splitModuleKey(key);
      const module = getModuleEntity(source, id);
      return module ? { source, module } : null;
    }).filter(Boolean);
  }
  function syncBagWithCategory(catSelectId, bagSelectId, bags) {
    const category = document.getElementById(catSelectId)?.value;
    const select = document.getElementById(bagSelectId);
    if (!category || !select) return;
    const preferred = suggestBagForItem(
      document.getElementById(catSelectId.replace("Category", "Name"))?.value || "",
      category
    );
    fillBagSelect(bagSelectId, preferred, bags);
  }
  function fillCatSelect(id, selected) {
    const el = document.getElementById(id);
    if (!el) return;
    el.innerHTML = DEFAULT_CATEGORIES.map((cat) => '<option value="' + cat.id + '"' + (cat.id === selected ? " selected" : "") + ">" + cat.name + "</option>").join("");
  }
  function fillBagSelect(id, selected, bags = DEFAULT_BAGS) {
    const el = document.getElementById(id);
    if (!el) return;
    el.innerHTML = (bags || DEFAULT_BAGS).map((bag) => '<option value="' + bag.id + '"' + (bag.id === selected ? " selected" : "") + ">" + bag.icon + " " + bag.name + "</option>").join("");
  }
  function esc(value) {
    const div = document.createElement("div");
    div.textContent = value == null ? "" : String(value);
    return div.innerHTML;
  }
  function setupModalOverlays() {
    document.querySelectorAll(".modal-overlay").forEach((overlay) => {
      overlay.addEventListener("click", (event) => {
        if (event.target === overlay) overlay.classList.remove("active");
      });
    });
  }
  function showModal(id) {
    document.getElementById(id)?.classList.add("active");
  }
  function closeModal(id) {
    if (id === "createModuleModal") {
      S.moduleBuilderDraftId = null;
      endModuleBuilderGesture();
    }
    document.getElementById(id)?.classList.remove("active");
  }
  function toast(message) {
    const el = document.createElement("div");
    el.className = "notification";
    el.textContent = message;
    document.body.appendChild(el);
    setTimeout(() => el.remove(), 2200);
  }
  var ONBOARDING_STEPS = [
    {
      icon: "\u{1F9F0}",
      title: "\u7B2C\u4E00\u6B65\uFF1A\u6574\u7406\u5C0F\u5305",
      desc: "\u628A\u4F60\u5E38\u5E26\u7684\u7269\u54C1\u6309\u7528\u9014\u5206\u7EC4\uFF0C\u6BD4\u5982\u6D17\u6F31\u5305\u3001\u5316\u5986\u5305\u3001\u8BC1\u4EF6\u5305\u3002\u7CFB\u7EDF\u5DF2\u9884\u7F6E\u4E86\u4E00\u6279\u5B98\u65B9\u5C0F\u5305\uFF0C\u4F60\u4E5F\u53EF\u4EE5\u65B0\u5EFA\u81EA\u5DF1\u7684\u3002"
    },
    {
      icon: "\u{1F4DD}",
      title: "\u7B2C\u4E8C\u6B65\uFF1A\u65B0\u5EFA\u884C\u7A0B",
      desc: "\u6BCF\u6B21\u51FA\u95E8\u524D\uFF0C\u65B0\u5EFA\u4E00\u4E2A\u884C\u7A0B\uFF0C\u52FE\u9009\u8FD9\u6B21\u9700\u8981\u5E26\u7684\u5C0F\u5305\u3002\u7CFB\u7EDF\u4F1A\u81EA\u52A8\u5408\u5E76\u7269\u54C1\u5E76\u6309\u5929\u6570\u3001\u4EBA\u6570\u5EFA\u8BAE\u6570\u91CF\u3002"
    },
    {
      icon: "\u{1F392}",
      title: "\u7B2C\u4E09\u6B65\uFF1A\u6253\u5305\u51FA\u53D1",
      desc: '\u6253\u5F00\u884C\u7A0B\u540E\u5207\u6362\u5230"\u6253\u5305\u6A21\u5F0F"\uFF0C\u5B9E\u7269\u6253\u5305\u65F6\u9010\u4E00\u52FE\u9009\uFF0C\u518D\u4E5F\u4E0D\u6015\u843D\u4E1C\u897F\u3002'
    }
  ];
  var onboardingIndex = 0;
  function startOnboarding() {
    onboardingIndex = 0;
    renderOnboardingStep();
    showModal("onboardingModal");
  }
  function renderOnboardingStep() {
    const step = ONBOARDING_STEPS[onboardingIndex];
    const stepEl = document.getElementById("onboardingStep");
    const dotsEl = document.getElementById("onboardingDots");
    const nextBtn = document.getElementById("onboardingNext");
    const skipBtn = document.getElementById("onboardingSkip");
    if (!stepEl || !step) return;
    stepEl.innerHTML = '<div class="onboarding-icon">' + step.icon + '</div><div class="onboarding-title">' + step.title + '</div><div class="onboarding-desc">' + step.desc + "</div>";
    dotsEl.innerHTML = ONBOARDING_STEPS.map(
      (_, i) => '<span class="onboarding-dot ' + (i === onboardingIndex ? "active" : "") + '"></span>'
    ).join("");
    const isLast = onboardingIndex >= ONBOARDING_STEPS.length - 1;
    nextBtn.textContent = isLast ? "\u5F00\u59CB\u4F7F\u7528" : "\u4E0B\u4E00\u6B65";
    skipBtn.style.display = isLast ? "none" : "inline-flex";
  }
  function nextOnboardingStep() {
    if (onboardingIndex >= ONBOARDING_STEPS.length - 1) {
      finishOnboarding();
      return;
    }
    onboardingIndex++;
    renderOnboardingStep();
  }
  function finishOnboarding() {
    localStorage.setItem(STORAGE_KEYS.onboarded, "1");
    closeModal("onboardingModal");
  }
  function renderMePage() {
    const trips = getTrips();
    const modules = getMyModules();
    const library = getItemLibrary();
    const officialCount = getOfficialModules().length;
    document.getElementById("meStats").innerHTML = [
      { label: "\u884C\u7A0B", value: trips.length },
      { label: "\u5C0F\u5305", value: modules.length + officialCount },
      { label: "\u7269\u54C1", value: library.length }
    ].map((stat) => `
        <div class="me-stat">
            <div class="me-stat-value">${stat.value}</div>
            <div class="me-stat-label">${stat.label}</div>
        </div>
    `).join("");
  }
  function resetOfficialModules() {
    if (!confirm("\u786E\u5B9A\u6062\u590D\u6240\u6709\u5B98\u65B9\u5C0F\u5305\u5230\u521D\u59CB\u72B6\u6001\uFF1F\u4F60\u81EA\u5EFA\u7684\u5C0F\u5305\u4E0D\u4F1A\u53D7\u5F71\u54CD\u3002")) return;
    localStorage.removeItem(STORAGE_KEYS.officialModules);
    ensureItemLibrarySeeded();
    renderModuleLibrary();
    renderMePage();
    toast("\u5DF2\u6062\u590D\u5B98\u65B9\u5C0F\u5305");
  }
  function clearAllData() {
    if (!confirm("\u786E\u5B9A\u6E05\u9664\u6240\u6709\u6570\u636E\uFF1F\u5305\u62EC\u884C\u7A0B\u3001\u5C0F\u5305\u548C\u7269\u54C1\u5E93\uFF0C\u6B64\u64CD\u4F5C\u4E0D\u53EF\u64A4\u9500\u3002")) return;
    localStorage.removeItem(STORAGE_KEYS.records);
    localStorage.removeItem(STORAGE_KEYS.itemLibrary);
    localStorage.removeItem(STORAGE_KEYS.officialModules);
    localStorage.removeItem(STORAGE_KEYS.onboarded);
    S.currentTrip = null;
    S.currentTripId = null;
    ensureItemLibrarySeeded();
    nav("home");
    toast("\u6570\u636E\u5DF2\u6E05\u9664");
  }
  Object.assign(window, {
    // nav & pages
    openMainPage,
    goBack,
    nav,
    // trip builder
    openCreateTripModal,
    confirmCreateTrip,
    stepValue,
    toggleTripBuilderModule,
    changeCurrentTripSetting,
    // trip page
    openTrip,
    setTripMode,
    toggleTripMode,
    setPackView,
    togglePackItem,
    toggleBagCollapse,
    toggleTripInfoCard,
    markAllPacked,
    markAllUnpacked,
    reapplyTripSmartFill,
    saveCurrentTripAsModule,
    goSelectModuleForTrip,
    goSelectItemsForTrip,
    // module
    openCreateModuleModal,
    saveCustomModule,
    deleteCurrentModuleDraft,
    clearModuleBuilderSelection,
    addBuilderCustomItem,
    useCurrentModule,
    openEditCurrentModule,
    openModuleDetail,
    setModuleFilter,
    updateModuleSearch,
    updateModuleBuilderSearch,
    // library
    saveLibraryItem,
    deleteLibraryItem,
    openLibraryItemModal,
    addLibraryItemTag,
    removeLibraryItemTag,
    setItemFilter,
    updateItemSearch,
    // manual item
    openManualItemModal,
    saveManualTripItem,
    // trip item edit
    openTripItemModal,
    saveCurrentTripItem,
    deleteCurrentTripItem,
    addTripItemTag,
    removeTripItemTag,
    // modals
    showModal,
    closeModal,
    // onboarding
    startOnboarding,
    nextOnboardingStep,
    finishOnboarding,
    // me page
    resetOfficialModules,
    clearAllData,
    // home extras
    toggleHomeHistory,
    duplicateTrip,
    // kit view
    setKitView
  });
  init();
})();
