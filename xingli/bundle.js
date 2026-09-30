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
    { id: "bag-skincare", name: "\u62A4\u80A4\u5305", icon: "\u{1FAE7}" },
    { id: "bag-docs", name: "\u8BC1\u4EF6\u5305", icon: "\u{1F4C1}" },
    { id: "bag-clothing", name: "\u8863\u670D\u5305", icon: "\u{1F455}" },
    { id: "bag-baby", name: "\u5B9D\u5B9D\u65E5\u5E38\u51FA\u95E8\u5305", icon: "\u{1F9F7}" },
    { id: "bag-baby-feeding", name: "\u5B9D\u5B9D\u5582\u517B\u5305", icon: "\u{1F37C}" },
    { id: "bag-baby-clothing", name: "\u5B9D\u5B9D\u8863\u7269\u5305", icon: "\u{1F455}" },
    { id: "bag-baby-bath", name: "\u5B9D\u5B9D\u8FC7\u591C\u8865\u5145\u5305", icon: "\u{1F319}" },
    { id: "bag-baby-medicine", name: "\u5B9D\u5B9D\u836F\u54C1\u5305", icon: "\u{1F321}\uFE0F" },
    { id: "bag-baby-gear", name: "\u5B9D\u5B9D\u51FA\u884C\u88C5\u5907\u5305", icon: "\u{1F697}" },
    { id: "bag-baby-vaccine", name: "\u5B9D\u5B9D\u75AB\u82D7\u573A\u666F", icon: "\u{1F489}" },
    { id: "bag-baby-outdoor", name: "\u5B9D\u5B9D\u6237\u5916\u573A\u666F", icon: "\u{1F33F}" },
    { id: "bag-electronics", name: "\u7535\u5B50\u5305", icon: "\u{1F50C}" },
    { id: "bag-camera", name: "\u6444\u5F71\u8BBE\u5907\u5305", icon: "\u{1F4F7}" },
    { id: "bag-small", name: "\u968F\u8EAB\u5C0F\u5305", icon: "\u{1F45B}" },
    { id: "bag-big", name: "\u5927\u4EF6\u6536\u7EB3\u5305", icon: "\u{1F9F3}" },
    { id: "bag-medicine", name: "\u836F\u54C1\u5305", icon: "\u{1F48A}" },
    { id: "bag-misc", name: "\u6742\u7269\u5305", icon: "\u{1F4E6}" }
  ];
  var CATEGORY_BAG_MAP = {
    hygiene: "bag-hygiene",
    makeup: "bag-makeup",
    skincare: "bag-skincare",
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
    { id: "short", name: "\u77ED\u9014" },
    { id: "business", name: "\u51FA\u5DEE" },
    { id: "travel", name: "\u51FA\u884C" },
    { id: "family", name: "\u5B9D\u5B9D" },
    { id: "daily", name: "\u968F\u8EAB" },
    { id: "custom", name: "\u6211\u7684" }
  ];
  var STORAGE_KEYS = {
    records: "packHelper_lists",
    itemLibrary: "packHelper_itemLibrary",
    officialModules: "packHelper_officialModules",
    officialSeedVersion: "packHelper_officialSeedVersion",
    deletedOfficialModules: "packHelper_deletedOfficialModules",
    onboarded: "packHelper_onboarded"
  };
  var BABY_MODULE_IDS = {
    base: "module-baby-base",
    feeding: "module-baby-feeding",
    clothing: "module-baby-clothing",
    // 沿用旧的过夜模块 ID，避免已有行程失去来源关联。
    bath: "module-baby-overnight",
    comfort: "module-baby-comfort",
    snacks: "module-baby-snacks",
    medicine: "module-baby-medicine",
    gear: "module-baby-gear",
    vaccine: "module-baby-vaccine",
    // 保留旧键名，兼容已有行程与智能推荐数据。
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
      [["\u53E3\u7EA2", "\u5507\u91C9", "\u7C89\u5E95", "\u7C89\u6251", "\u6C14\u57AB", "\u773C\u5F71", "\u5316\u5986", "\u5378\u5986", "\u776B\u6BDB", "\u816E\u7EA2", "\u7709\u7B14", "\u773C\u7EBF", "\u906E\u7455", "\u6563\u7C89", "\u9AD8\u5149", "\u4FEE\u5BB9", "\u5B9A\u5986", "\u5986\u524D", "\u7F8E\u5986\u86CB", "\u5316\u5986\u5237", "\u9999\u6C34", "\u5B9A\u5986\u55B7\u96FE"], "makeup"],
      [["\u9762\u971C", "\u9632\u6652", "\u5507\u818F", "\u9762\u819C", "\u82A6\u835F", "\u9A71\u868A", "\u62A4\u80A4", "\u62A4\u81C0", "\u4E73\u6DB2", "\u7CBE\u534E", "\u8EAB\u4F53\u4E73", "\u62A4\u624B\u971C", "\u55B7\u96FE"], "skincare"],
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
    if (["\u75AB\u82D7\u672C", "\u533B\u4FDD\u5361"].some((keyword) => n.includes(keyword))) return "bag-baby-vaccine";
    if (["\u5976\u74F6", "\u5976\u7C89", "\u50A8\u5976\u888B", "\u8F85\u98DF\u7897", "\u8F85\u98DF\u526A", "\u4FDD\u6E29\u676F", "\u6C34\u6E29\u8BA1"].some((keyword) => n.includes(keyword))) return "bag-baby-feeding";
    if (["\u70E7\u6C34\u58F6", "\u5976\u74F6\u5237", "\u5976\u74F6\u6E05\u6D01\u5242", "\u6D17\u7897\u6D77\u7EF5", "\u62A4\u81C0\u818F", "\u6D74\u7F38\u5957", "\u6CE1\u6FA1\u888B", "\u5B9D\u5B9D\u6D74\u5DFE", "\u5B9D\u5B9D\u6C90\u6D74\u9732", "\u6298\u53E0\u6FA1\u76C6"].some((keyword) => n.includes(keyword))) return "bag-baby-bath";
    if (["\u5B9D\u5B9D\u9000\u70E7\u836F", "\u9000\u70ED\u8D34", "\u4F53\u6E29\u8BA1", "D3", "AD", "\u5B9D\u5B9D\u6B62\u75D2\u818F"].some((keyword) => n.includes(keyword))) return "bag-baby-medicine";
    if (["\u5A74\u513F\u8F66", "\u5B9D\u5B9D\u80CC\u5E26", "\u6E38\u6CF3\u5708"].some((keyword) => n.includes(keyword))) return "bag-baby-gear";
    if (["\u5B9D\u5B9D\u8863\u670D", "\u5B9D\u5B9D\u88E4\u5B50", "\u5B9D\u5B9D\u889C\u5B50", "\u53E3\u6C34\u515C", "\u56F4\u515C", "\u7F69\u8863", "\u76D6\u6BEF", "\u7761\u888B"].some((keyword) => n.includes(keyword))) return "bag-baby-clothing";
    if (["\u5B9D\u5B9D\u9A71\u868A\u6C34", "\u9632\u868A\u8D34", "\u5B9D\u5B9D\u9632\u6652\u971C", "\u4FBF\u643A\u9A6C\u6876"].some((keyword) => n.includes(keyword))) return "bag-baby-outdoor";
    if (n.includes("\u5B9D\u5B9D") || ["\u5C3F\u4E0D\u6E7F", "\u7EB8\u5C3F\u88E4", "\u9694\u5C3F\u57AB", "\u68C9\u67D4\u5DFE", "\u4E91\u67D4\u5DFE", "\u5A74\u513F\u6E7F\u5DFE", "\u5373\u98DF\u7CA5", "\u679C\u6CE5", "\u6CE1\u8299", "\u5C0F\u9992\u5934", "\u7ED8\u672C", "\u4FBF\u643A\u5C0F\u73A9\u5177", "\u5B89\u629A\u5976\u5634"].some((keyword) => n.includes(keyword))) return "bag-baby";
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
        { name: "\u6298\u53E0\u7259\u5237\u676F", c: "hygiene" },
        { name: "\u6D17\u9762\u5976", c: "hygiene" },
        { name: "\u68B3\u5B50", c: "hygiene" },
        { name: "\u76AE\u7B4B", c: "small-bag" },
        { name: "\u7259\u7EBF", c: "hygiene" },
        { name: "\u6BDB\u5DFE", c: "hygiene", smart: "perPerson" },
        { name: "\u6D17\u53D1\u6C34\u3001\u62A4\u53D1\u7D20", c: "hygiene" },
        { name: "\u6C90\u6D74\u9732", c: "hygiene" }
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
        { name: "\u53E3\u7EA2/\u5507\u91C9", c: "makeup" },
        { name: "\u7C89\u5E95\u6DB2", c: "makeup" },
        { name: "\u7C89\u6251", c: "makeup" },
        { name: "\u6C14\u57AB\u7C89\u5E95\u6DB2", c: "makeup" },
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
        { name: "\u884C\u7A0B\u5355", c: "docs" }
      ]
    },
    {
      id: "module-skincare",
      name: "\u62A4\u80A4\u5305",
      icon: "\u{1FAE7}",
      purpose: "starter",
      desc: "\u628A\u65E5\u5E38\u62A4\u80A4\u3001\u5378\u5986\u548C\u9690\u5F62\u773C\u955C\u7528\u54C1\u96C6\u4E2D\u6536\u7EB3\uFF0C\u907F\u514D\u548C\u5316\u5986\u54C1\u6DF7\u5728\u4E00\u8D77\u53CD\u590D\u7FFB\u627E\u3002",
      tags: ["\u62A4\u80A4", "\u5378\u5986", "\u5E38\u7528\u5C0F\u5305"],
      items: [
        { name: "\u773C\u971C", c: "skincare", bag: "bag-skincare" },
        { name: "\u723D\u80A4\u6C34", c: "skincare", bag: "bag-skincare" },
        { name: "\u4E73\u6DB2", c: "skincare" },
        { name: "\u4FDD\u6E7F\u971C", c: "skincare", bag: "bag-skincare" },
        { name: "\u9632\u6652\u971C", c: "skincare" },
        { name: "\u6DA6\u5507\u818F", c: "skincare" },
        { name: "\u5378\u5986\u6CB9/\u5378\u5986\u6C34", c: "skincare" },
        { name: "\u773C\u5507\u5378\u5986\u6DB2", c: "skincare" },
        { name: "\u5316\u5986\u68C9", c: "skincare" },
        { name: "\u9762\u819C", c: "skincare" },
        { name: "\u9690\u5F62\u773C\u955C", c: "small-bag" }
      ]
    },
    {
      id: "module-carry-on",
      name: "\u968F\u8EAB\u5C0F\u5305",
      icon: "\u{1F45B}",
      purpose: "daily",
      desc: "\u51FA\u95E8\u524D\u6700\u540E\u786E\u8BA4\u3001\u9700\u8981\u968F\u624B\u62FF\u53D6\u7684\u9AD8\u9891\u7269\u54C1\u3002",
      tags: ["\u968F\u8EAB", "\u9AD8\u9891", "\u5E38\u7528\u5C0F\u5305"],
      items: [
        { name: "\u8BC1\u4EF6", c: "docs", bag: "bag-small" },
        { name: "\u5145\u7535\u5B9D", c: "electronics", bag: "bag-small" },
        { name: "\u96E8\u4F1E", c: "misc", bag: "bag-small" },
        { name: "\u773C\u955C\u5E03", c: "small-bag", bag: "bag-small" },
        { name: "\u7259\u7EBF", c: "hygiene", bag: "bag-small" }
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
        { name: "\u5916\u5957", c: "clothing", smart: "perPerson" },
        { name: "\u8FD0\u52A8\u978B", c: "clothing", smart: "perPerson" },
        { name: "\u62D6\u978B", c: "clothing", smart: "perPerson" }
      ]
    },
    {
      id: BABY_MODULE_IDS.base,
      name: "\u5B9D\u5B9D\u65E5\u5E38\u51FA\u95E8\u5305",
      icon: "\u{1F9F7}",
      purpose: "family",
      group: "baby",
      role: "base",
      defaultOn: true,
      desc: "\u6BCF\u6B21\u5E26\u5B9D\u5B9D\u51FA\u95E8\u90FD\u4F1A\u7528\u5230\u7684\u6362\u6D17\u3001\u7EB8\u5DFE\u3001\u96F6\u98DF\u548C\u5C11\u91CF\u5B89\u629A\u7269\u3002",
      tags: ["\u5B9D\u5B9D", "\u65E5\u5E38\u51FA\u95E8", "\u9ED8\u8BA4\u5C0F\u5305"],
      items: [
        { name: "\u5C3F\u4E0D\u6E7F", c: "misc", q: 5, smart: "perDay", bag: "bag-baby" },
        { name: "\u5A74\u513F\u6E7F\u5DFE", c: "misc", bag: "bag-baby" },
        { name: "\u68C9\u67D4\u5DFE", c: "misc", bag: "bag-baby" },
        { name: "\u4E91\u67D4\u5DFE", c: "misc", bag: "bag-baby" },
        { name: "\u9694\u5C3F\u57AB", c: "misc", bag: "bag-baby" },
        { name: "\u5B9D\u5B9D\u9632\u6652\u971C", c: "skincare", bag: "bag-baby" },
        { name: "\u514D\u6D17\u6D17\u624B\u6DB2/\u64E6\u624B\u6D88\u6BD2\u6E7F\u5DFE", c: "hygiene", bag: "bag-baby" },
        { name: "\u5851\u6599\u888B", c: "misc", bag: "bag-baby" },
        { name: "\u5B9D\u5B9D\u96F6\u98DF", c: "misc", bag: "bag-baby" },
        { name: "\u7ED8\u672C", c: "misc", bag: "bag-baby" },
        { name: "\u4FBF\u643A\u5C0F\u73A9\u5177", c: "misc", bag: "bag-baby" },
        { name: "\u5B89\u629A\u5976\u5634\uFF08\u6309\u9700\uFF09", c: "misc", bag: "bag-baby" },
        { name: "\u9A71\u868A\u8D34", c: "misc", bag: "bag-baby" }
      ]
    },
    {
      id: BABY_MODULE_IDS.feeding,
      name: "\u5B9D\u5B9D\u5582\u517B\u5305",
      icon: "\u{1F37C}",
      purpose: "family",
      group: "baby",
      role: "pack",
      desc: "\u5F53\u5929\u5582\u517B\u6240\u9700\u7684\u5976\u7C89\u3001\u51B2\u6CE1\u7528\u54C1\u548C\u9910\u5177\uFF0C\u6BCD\u4E73\u6216\u5DF2\u65AD\u5976\u5B9D\u5B9D\u53EF\u6309\u9700\u5220\u51CF\u3002",
      tags: ["\u5B9D\u5B9D", "\u5582\u517B", "\u5E38\u7528\u5C0F\u5305"],
      items: [
        { name: "\u5976\u7C89", c: "misc", bag: "bag-baby-feeding" },
        { name: "\u5976\u7C89\u5206\u88C5\u76D2", c: "misc", bag: "bag-baby-feeding" },
        { name: "\u5976\u74F6", c: "misc", q: 2, bag: "bag-baby-feeding" },
        { name: "\u4FDD\u6E29\u676F", c: "misc", bag: "bag-baby-feeding" },
        { name: "\u5B9D\u5B9D\u9762/\u51B2\u6CE1\u9762\uFF08\u6309\u9700\uFF09", c: "misc", q: 3, bag: "bag-baby-feeding" },
        { name: "\u8F85\u98DF\u7897\u3001\u52FA\u3001\u8F85\u98DF\u526A", c: "misc", bag: "bag-baby-feeding" },
        { name: "\u5B9D\u5B9D\u6C34\u676F", c: "misc", bag: "bag-baby-feeding" },
        { name: "\u77FF\u6CC9\u6C34", c: "misc", bag: "bag-baby-feeding" },
        { name: "\u56F4\u515C+\u53E3\u6C34\u515C", c: "clothing", bag: "bag-baby-feeding" }
      ]
    },
    {
      id: BABY_MODULE_IDS.clothing,
      name: "\u5B9D\u5B9D\u8863\u7269\u5305",
      icon: "\u{1F455}",
      purpose: "family",
      group: "baby",
      role: "pack",
      desc: "\u6309\u884C\u7A0B\u5929\u6570\u51C6\u5907\u6362\u6D17\u8863\u7269\uFF0C\u6570\u91CF\u53EF\u5728\u52A0\u5165\u884C\u7A0B\u540E\u7EE7\u7EED\u8C03\u6574\u3002",
      tags: ["\u5B9D\u5B9D", "\u8863\u7269", "\u6309\u5929\u6570"],
      items: [
        { name: "\u5B9D\u5B9D\u8863\u670D", c: "clothing", q: 2, smart: "perDay", bag: "bag-baby-clothing" },
        { name: "\u5B9D\u5B9D\u88E4\u5B50", c: "clothing", smart: "perDay", bag: "bag-baby-clothing" },
        { name: "\u53E3\u6C34\u515C", c: "clothing", q: 2, smart: "perDay", bag: "bag-baby-clothing" },
        { name: "\u56F4\u515C/\u7F69\u8863", c: "clothing", bag: "bag-baby-clothing" },
        { name: "\u5B9D\u5B9D\u978B\u5B50", c: "clothing", bag: "bag-baby-clothing" },
        { name: "\u76D6\u6BEF", c: "clothing", bag: "bag-baby-clothing" },
        { name: "\u7761\u888B", c: "clothing", bag: "bag-baby-clothing" },
        { name: "\u5B9D\u5B9D\u889C\u5B50", c: "clothing", q: 1, smart: "perDay", bag: "bag-baby-clothing" }
      ]
    },
    {
      id: BABY_MODULE_IDS.bath,
      name: "\u5B9D\u5B9D\u8FC7\u591C\u8865\u5145\u5305",
      icon: "\u{1F319}",
      purpose: "family",
      group: "baby",
      role: "scenario",
      desc: "\u53EA\u6709\u5916\u5BBF\u65F6\u624D\u8865\u5145\u70E7\u6C34\u3001\u5976\u74F6\u6E05\u6D17\u3001\u62A4\u81C0\u548C\u6D17\u6FA1\u7528\u54C1\u3002",
      tags: ["\u5B9D\u5B9D", "\u573A\u666F\u8865\u5145", "\u8FC7\u591C"],
      items: [
        { name: "\u4FBF\u643A\u70E7\u6C34\u58F6", c: "misc", bag: "bag-baby-bath" },
        { name: "\u5976\u74F6\u5237\u53CA\u6536\u7EB3\u76D2", c: "hygiene", bag: "bag-baby-bath" },
        { name: "\u6CA5\u6C34\u67B6", c: "hygiene", bag: "bag-baby-bath" },
        { name: "\u5976\u74F6\u6E05\u6D01\u5242", c: "hygiene", bag: "bag-baby-bath" },
        { name: "\u6D17\u7897\u6D77\u7EF5", c: "hygiene", bag: "bag-baby-bath" },
        { name: "\u62A4\u81C0\u818F", c: "skincare", bag: "bag-baby-bath" },
        { name: "\u4E00\u6B21\u6027\u6D74\u7F38\u5957/\u6CE1\u6FA1\u888B", c: "hygiene", bag: "bag-baby-bath" },
        { name: "\u5B9D\u5B9D\u6D74\u5DFE", c: "hygiene", bag: "bag-baby-bath" },
        { name: "\u5B9D\u5B9D\u6C90\u6D74\u9732", c: "hygiene", bag: "bag-baby-bath" },
        { name: "\u6298\u53E0\u6FA1\u76C6", c: "misc", bag: "bag-baby-bath" },
        { name: "\u5B9D\u5B9D\u9762\u971C&\u8EAB\u4F53\u4E73", c: "skincare", bag: "bag-baby-bath" },
        { name: "\u5B9D\u5B9D\u7259\u5237&\u7259\u5237\u676F", c: "hygiene", bag: "bag-baby-bath" },
        { name: "D3/AD\uFF08\u6309\u65E5\u5E38\u670D\u7528\uFF09", c: "medicine", bag: "bag-baby-bath" }
      ]
    },
    {
      id: BABY_MODULE_IDS.medicine,
      name: "\u5B9D\u5B9D\u836F\u54C1\u5305",
      icon: "\u{1F321}\uFE0F",
      purpose: "family",
      group: "baby",
      role: "pack",
      desc: "\u5E38\u7528\u836F\u4E0E\u65E5\u5E38\u8865\u5145\u5242\u96C6\u4E2D\u6536\u7EB3\uFF1B\u7528\u836F\u8BF7\u9075\u5FAA\u533B\u751F\u6216\u836F\u5E08\u5EFA\u8BAE\u3002",
      tags: ["\u5B9D\u5B9D", "\u836F\u54C1", "\u5E94\u6025"],
      items: [
        { name: "\u5B9D\u5B9D\u9000\u70E7\u836F", c: "medicine", bag: "bag-baby-medicine" },
        { name: "\u9000\u70ED\u8D34", c: "medicine", q: 2, bag: "bag-baby-medicine" },
        { name: "\u4F53\u6E29\u8BA1", c: "medicine", bag: "bag-baby-medicine" },
        { name: "\u5B9D\u5B9D\u6B62\u75D2\u818F", c: "medicine", bag: "bag-baby-medicine" },
        { name: "\u9A71\u868A\u8D34", c: "misc", bag: "bag-baby-medicine" }
      ]
    },
    {
      id: BABY_MODULE_IDS.gear,
      name: "\u5B9D\u5B9D\u51FA\u884C\u88C5\u5907\u5305",
      icon: "\u{1F697}",
      purpose: "family",
      group: "baby",
      role: "pack",
      desc: "\u5A74\u513F\u8F66\u3001\u80CC\u5E26\u7B49\u5927\u4EF6\u88C5\u5907\uFF0C\u6309\u8DEF\u7EBF\u548C\u5B9D\u5B9D\u6708\u9F84\u9009\u62E9\u3002",
      tags: ["\u5B9D\u5B9D", "\u5927\u4EF6", "\u51FA\u884C\u88C5\u5907"],
      items: [
        { name: "\u5A74\u513F\u8F66", c: "big-bag", bag: "bag-baby-gear" },
        { name: "\u5B9D\u5B9D\u80CC\u5E26", c: "big-bag", bag: "bag-baby-gear" },
        { name: "\u5B9D\u5B9D\u6307\u7532\u526A", c: "hygiene", bag: "bag-baby-gear" },
        { name: "\u6E38\u6CF3\u5708\uFF08\u6309\u9700\uFF09", c: "big-bag", bag: "bag-baby-gear" }
      ]
    },
    {
      id: BABY_MODULE_IDS.vaccine,
      name: "\u5B9D\u5B9D\u75AB\u82D7\u573A\u666F",
      icon: "\u{1F489}",
      purpose: "family",
      group: "baby",
      role: "scenario",
      desc: "\u6253\u75AB\u82D7\u6216\u4F53\u68C0\u65F6\uFF0C\u5728\u5B9D\u5B9D\u5C0F\u5305\u4E4B\u5916\u8865\u5145\u8BC1\u4EF6\uFF1B\u9000\u70ED\u7528\u54C1\u7EDF\u4E00\u653E\u5728\u5B9D\u5B9D\u836F\u54C1\u5305\u3002",
      tags: ["\u5B9D\u5B9D", "\u573A\u666F\u8865\u5145", "\u4F53\u68C0\u75AB\u82D7"],
      items: [
        { name: "\u75AB\u82D7\u672C", c: "docs", bag: "bag-baby-vaccine" },
        { name: "\u533B\u4FDD\u5361", c: "docs", bag: "bag-baby-vaccine" }
      ]
    },
    {
      id: BABY_MODULE_IDS.outdoor,
      name: "\u5B9D\u5B9D\u6237\u5916\u573A\u666F",
      icon: "\u{1F33F}",
      purpose: "family",
      group: "baby",
      role: "scenario",
      desc: "\u516C\u56ED\u3001\u9732\u8425\u6216\u957F\u65F6\u95F4\u6237\u5916\u65F6\u8865\u5145\u9632\u6652\u3001\u9632\u868A\u548C\u5982\u5395\u7528\u54C1\u3002",
      tags: ["\u5B9D\u5B9D", "\u573A\u666F\u8865\u5145", "\u6237\u5916"],
      items: [
        { name: "\u5B9D\u5B9D\u9A71\u868A\u6C34", c: "skincare", bag: "bag-baby-outdoor" },
        { name: "\u9632\u868A\u8D34", c: "misc", q: 2, bag: "bag-baby-outdoor" },
        { name: "\u5B9D\u5B9D\u9632\u6652\u971C", c: "skincare", bag: "bag-baby-outdoor" },
        { name: "\u4FBF\u643A\u9A6C\u6876\uFF08\u6309\u9700\uFF09", c: "big-bag", bag: "bag-baby-outdoor" }
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
        { name: "\u5145\u7535\u5668\uFF08\u624B\u673A\uFF09", c: "electronics" },
        { name: "\u6570\u636E\u7EBF", c: "electronics", q: 2 },
        { name: "\u5145\u7535\u5B9D", c: "electronics" },
        { name: "\u8033\u673A", c: "electronics" },
        { name: "Apple Watch \u5145\u7535\u5668", c: "electronics" },
        { name: "iPad", c: "electronics" },
        { name: "\u7B14\u8BB0\u672C\u7535\u8111", c: "electronics" },
        { name: "\u5145\u7535\u5668\uFF08\u7535\u8111\uFF09", c: "electronics" },
        { name: "\u8F6C\u6362\u63D2\u5934", c: "electronics" }
      ]
    },
    {
      id: "module-adult-medicine",
      name: "\u5E38\u5907\u836F\u5305",
      icon: "\u{1F48A}",
      purpose: "starter",
      desc: "\u65C5\u884C\u5E38\u89C1\u7684\u5C0F\u4F24\u3001\u53D1\u70ED\u548C\u80A0\u80C3\u4E0D\u9002\u7528\u54C1\uFF1B\u6309\u4E2A\u4EBA\u60C5\u51B5\u589E\u51CF\uFF0C\u5E76\u9075\u5FAA\u533B\u751F\u6216\u836F\u5E08\u5EFA\u8BAE\u3002",
      tags: ["\u836F\u54C1", "\u5E94\u6025", "\u5E38\u7528\u5C0F\u5305"],
      items: [
        { name: "\u4E2A\u4EBA\u5904\u65B9\u836F", c: "medicine", bag: "bag-medicine" },
        { name: "\u521B\u53EF\u8D34", c: "medicine", q: 4 },
        { name: "\u611F\u5192\u836F", c: "medicine" },
        { name: "\u9000\u70E7\u6B62\u75DB\u836F", c: "medicine" },
        { name: "\u80A0\u80C3\u836F", c: "medicine" },
        { name: "\u6655\u8F66\u836F", c: "medicine" },
        { name: "\u773C\u836F\u6C34", c: "medicine", bag: "bag-medicine" },
        { name: "\u9152\u7CBE\u68C9\u7247", c: "medicine", q: 4 },
        { name: "\u9A71\u868A\u6B62\u75D2\u7528\u54C1", c: "medicine" },
        { name: "\u53E3\u7F69", c: "small-bag", q: 2 }
      ]
    },
    {
      id: "module-camera",
      name: "\u6444\u5F71\u8BBE\u5907\u5305",
      icon: "\u{1F4F7}",
      purpose: "travel",
      desc: "\u76F8\u673A\u3001\u955C\u5934\u3001\u5B58\u50A8\u4E0E\u5145\u7535\u914D\u4EF6\u96C6\u4E2D\u68C0\u67E5\uFF0C\u4E0D\u62CD\u6444\u65F6\u53EF\u4EE5\u6574\u5305\u4E0D\u9009\u3002",
      tags: ["\u6444\u5F71", "\u7535\u5B50\u8BBE\u5907", "\u53EF\u9009\u5C0F\u5305"],
      items: [
        { name: "\u76F8\u673A", c: "electronics", bag: "bag-camera" },
        { name: "\u955C\u5934", c: "electronics", bag: "bag-camera" },
        { name: "\u76F8\u673A\u7535\u6C60", c: "electronics", q: 2, bag: "bag-camera" },
        { name: "\u76F8\u673A\u5145\u7535\u5668", c: "electronics", bag: "bag-camera" },
        { name: "SD\u5361", c: "electronics", q: 2, bag: "bag-camera" },
        { name: "\u8BFB\u5361\u5668", c: "electronics", bag: "bag-camera" },
        { name: "\u955C\u5934\u6E05\u6D01\u5E03", c: "misc", bag: "bag-camera" },
        { name: "\u76F8\u673A\u6536\u7EB3\u888B", c: "misc", bag: "bag-camera" }
      ]
    },
    {
      id: "module-business-trip",
      name: "\u5546\u52A1\u51FA\u5DEE\u5305",
      icon: "\u{1F4BC}",
      purpose: "business",
      desc: "\u4ECE\u529E\u516C\u8BBE\u5907\u5230\u6B63\u5F0F\u7740\u88C5\uFF0C\u9002\u5408\u5BA2\u6237\u62DC\u8BBF\u3001\u4F1A\u8BAE\u548C\u5916\u5730\u9A7B\u70B9\u3002",
      tags: ["\u51FA\u5DEE", "\u529E\u516C", "\u6B63\u5F0F\u573A\u5408"],
      items: [
        { name: "\u5DE5\u4F5C\u8BC1/\u95E8\u7981\u5361", c: "docs" },
        { name: "\u540D\u7247", c: "docs", q: 10 },
        { name: "\u7B14\u8BB0\u672C\u7535\u8111", c: "electronics" },
        { name: "\u5145\u7535\u5668\uFF08\u7535\u8111\uFF09", c: "electronics" },
        { name: "\u9F20\u6807", c: "electronics" },
        { name: "U\u76D8", c: "electronics" },
        { name: "\u6F14\u793A\u8F6C\u63A5\u5934", c: "electronics" },
        { name: "\u7B14\u8BB0\u672C", c: "misc" },
        { name: "\u7B14", c: "misc", q: 2 },
        { name: "\u6B63\u5F0F\u886C\u886B", c: "clothing", smart: "perPersonPerDay" },
        { name: "\u897F\u88C5/\u6B63\u5F0F\u5916\u5957", c: "clothing", smart: "perPerson" },
        { name: "\u6B63\u88C5\u978B", c: "clothing", smart: "perPerson" }
      ]
    },
    {
      id: "module-weekend-short",
      name: "\u5468\u672B\u77ED\u9014\u5305",
      icon: "\u{1F392}",
      purpose: "short",
      desc: "\u4E00\u5230\u4E24\u665A\u7684\u5468\u8FB9\u6E38\u3001\u63A2\u4EB2\u6216\u4E34\u65F6\u8FC7\u591C\uFF0C\u53EA\u5E26\u771F\u6B63\u5FC5\u9700\u7684\u4E1C\u897F\u3002",
      tags: ["\u5468\u672B", "\u8FC7\u591C", "\u8F7B\u88C5"],
      items: [
        { name: "\u8EAB\u4EFD\u8BC1", c: "docs" },
        { name: "\u624B\u673A", c: "electronics" },
        { name: "\u5145\u7535\u5668\uFF08\u624B\u673A\uFF09", c: "electronics" },
        { name: "\u5145\u7535\u5B9D", c: "electronics" },
        { name: "\u7259\u5237\u7259\u818F", c: "hygiene" },
        { name: "\u6D17\u9762\u5976", c: "hygiene" },
        { name: "\u5185\u8863", c: "clothing", smart: "perPersonPerDay" },
        { name: "\u5185\u88E4", c: "clothing", smart: "perPersonPerDay" },
        { name: "\u889C\u5B50", c: "clothing", smart: "perPersonPerDay" },
        { name: "T\u6064/\u4E0A\u8863", c: "clothing", smart: "perPersonPerDay" },
        { name: "\u7761\u8863", c: "clothing", smart: "perPerson" },
        { name: "\u5E38\u5907\u836F", c: "medicine" },
        { name: "\u96E8\u4F1E", c: "misc" }
      ]
    },
    {
      id: "module-road-trip",
      name: "\u81EA\u9A7E\u51FA\u884C\u5305",
      icon: "\u{1F697}",
      purpose: "travel",
      desc: "\u81EA\u9A7E\u51FA\u53D1\u524D\u4E00\u6B21\u68C0\u67E5\u8BC1\u4EF6\u3001\u8F66\u8F7D\u8865\u7ED9\u548C\u9053\u8DEF\u5E94\u6025\u7269\u54C1\u3002",
      tags: ["\u81EA\u9A7E", "\u8F66\u8F7D", "\u5E94\u6025"],
      items: [
        { name: "\u9A7E\u9A76\u8BC1", c: "docs" },
        { name: "\u884C\u9A76\u8BC1", c: "docs" },
        { name: "\u8F66\u94A5\u5319", c: "small-bag" },
        { name: "\u624B\u673A\u652F\u67B6", c: "electronics" },
        { name: "\u8F66\u8F7D\u5145\u7535\u5668", c: "electronics" },
        { name: "\u6570\u636E\u7EBF", c: "electronics", q: 2 },
        { name: "\u996E\u7528\u6C34", c: "misc", q: 2 },
        { name: "\u96F6\u98DF", c: "misc" },
        { name: "\u7EB8\u5DFE", c: "misc" },
        { name: "\u5783\u573E\u888B", c: "misc", q: 3 },
        { name: "\u58A8\u955C", c: "small-bag" },
        { name: "\u8F66\u8F7D\u6025\u6551\u5305", c: "medicine" }
      ]
    },
    {
      id: "module-international",
      name: "\u6D77\u5916\u51FA\u884C\u5305",
      icon: "\u{1F30F}",
      purpose: "travel",
      desc: "\u4F5C\u4E3A\u6D77\u5916\u573A\u666F\u8865\u5145\uFF0C\u96C6\u4E2D\u6838\u5BF9\u8BC1\u4EF6\u3001\u901A\u4FE1\u3001\u652F\u4ED8\u548C\u8F6C\u6362\u8BBE\u5907\u3002",
      tags: ["\u573A\u666F\u8865\u5145", "\u51FA\u5883", "\u8BC1\u4EF6", "\u901A\u4FE1"],
      items: [
        { name: "\u62A4\u7167", c: "docs" },
        { name: "\u7B7E\u8BC1/\u5165\u5883\u6587\u4EF6", c: "docs" },
        { name: "\u8F66\u7968/\u673A\u7968", c: "docs" },
        { name: "\u9152\u5E97\u9884\u8BA2\u786E\u8BA4\u5355", c: "docs" },
        { name: "\u65C5\u884C\u4FDD\u9669\u4FDD\u5355", c: "docs" },
        { name: "\u8BC1\u4EF6\u590D\u5370\u4EF6", c: "docs", q: 2 },
        { name: "\u5883\u5916\u94F6\u884C\u5361", c: "small-bag" },
        { name: "\u5C11\u91CF\u5F53\u5730\u73B0\u91D1", c: "small-bag" },
        { name: "SIM\u5361/eSIM\u4FE1\u606F", c: "docs" },
        { name: "\u53D6\u5361\u9488", c: "small-bag" },
        { name: "\u5F53\u5730\u4EA4\u901A\u5361", c: "small-bag" },
        { name: "\u9ED1\u8272\u6C34\u7B14", c: "small-bag" },
        { name: "\u8F6C\u6362\u63D2\u5934", c: "electronics" },
        { name: "\u63D2\u7EBF\u677F", c: "electronics" },
        { name: "\u5E38\u7528\u836F\u82F1\u6587\u8BF4\u660E", c: "medicine" }
      ]
    },
    {
      id: "module-long-haul-flight",
      name: "\u957F\u9014\u98DE\u673A\u573A\u666F",
      icon: "\u2708\uFE0F",
      purpose: "travel",
      desc: "\u98DE\u884C\u65F6\u95F4\u8F83\u957F\u65F6\u8865\u5145\u7761\u7720\u3001\u4FDD\u6E7F\u3001\u4FDD\u6696\u548C\u673A\u4E0A\u5A31\u4E50\u7528\u54C1\uFF1B\u8BC1\u4EF6\u4E0E\u7535\u5B50\u8BBE\u5907\u4ECD\u7531\u5BF9\u5E94\u5C0F\u5305\u8D1F\u8D23\u3002",
      tags: ["\u573A\u666F\u8865\u5145", "\u957F\u9014\u98DE\u884C", "\u968F\u8EAB\u884C\u674E"],
      items: [
        { name: "U\u578B\u6795", c: "small-bag" },
        { name: "\u773C\u7F69", c: "small-bag" },
        { name: "\u964D\u566A\u8033\u673A", c: "electronics" },
        { name: "\u4E00\u6B21\u6027\u62D6\u978B", c: "clothing" },
        { name: "\u8584\u5916\u5957/\u4FDD\u6696\u6BEF", c: "clothing" },
        { name: "\u98DE\u673A\u5145\u6C14\u811A\u57AB", c: "small-bag" },
        { name: "\u6C34\u676F", c: "misc" },
        { name: "\u624B\u673A\u652F\u67B6", c: "electronics" },
        { name: "\u79BB\u7EBF\u7535\u5F71/\u4E66\u7C4D", c: "electronics" },
        { name: "\u9762\u971C", c: "skincare" },
        { name: "\u6DA6\u5507\u818F", c: "skincare" },
        { name: "\u62A4\u624B\u971C", c: "skincare" },
        { name: "\u4FDD\u6E7F\u9762\u819C", c: "skincare" },
        { name: "\u6F31\u53E3\u6C34", c: "hygiene" },
        { name: "\u7EB8\u5DFE", c: "misc" },
        { name: "\u6E7F\u5DFE", c: "misc" },
        { name: "\u514D\u6D17\u6D17\u624B\u6DB2", c: "hygiene" },
        { name: "\u53D1\u7EF3", c: "small-bag" }
      ]
    },
    {
      id: "module-travel-anti-theft",
      name: "\u65C5\u884C\u9632\u76D7\u573A\u666F",
      icon: "\u{1F510}",
      purpose: "travel",
      desc: "\u5728\u4EBA\u591A\u3001\u6362\u4E58\u591A\u6216\u6252\u7A83\u98CE\u9669\u8F83\u9AD8\u7684\u76EE\u7684\u5730\uFF0C\u6309\u968F\u8EAB\u5305\u7C7B\u578B\u8865\u5145\u9632\u76D7\u7528\u54C1\u3002",
      tags: ["\u573A\u666F\u8865\u5145", "\u9632\u76D7", "\u968F\u8EAB"],
      items: [
        { name: "\u624B\u673A\u9632\u76D7\u94FE", c: "small-bag" },
        { name: "\u5305\u9632\u76D7\u6263/\u94FE", c: "small-bag" },
        { name: "8\u5B57\u6263", c: "small-bag", q: 2 },
        { name: "\u9632\u76D7\u8170\u5305\uFF08\u6309\u9700\uFF09", c: "small-bag" },
        { name: "\u8D34\u8EAB\u8BC1\u4EF6\u888B\uFF08\u6309\u9700\uFF09", c: "small-bag" },
        { name: "\u524D\u80CC\u659C\u630E\u5305\uFF08\u6309\u9700\uFF09", c: "small-bag" }
      ]
    },
    {
      id: "module-cold-weather",
      name: "\u5BD2\u51B7\u5929\u6C14\u573A\u666F",
      icon: "\u2744\uFE0F",
      purpose: "travel",
      desc: "\u4F4E\u6E29\u3001\u98CE\u96EA\u6216\u663C\u591C\u6E29\u5DEE\u5927\u7684\u76EE\u7684\u5730\uFF0C\u7528\u4E8E\u8865\u5145\u9632\u98CE\u3001\u9632\u6C34\u548C\u4FDD\u6696\u5C42\u3002",
      tags: ["\u573A\u666F\u8865\u5145", "\u4F4E\u6E29", "\u9632\u6C34\u4FDD\u6696"],
      items: [
        { name: "\u9632\u6ED1\u9632\u6C34\u978B", c: "clothing", smart: "perPerson" },
        { name: "\u7FBD\u7ED2\u670D", c: "clothing", smart: "perPerson" },
        { name: "\u9632\u6C34\u88E4", c: "clothing", smart: "perPerson" },
        { name: "\u7F8A\u7ED2\u886B/\u6BDB\u8863", c: "clothing", smart: "perPerson" },
        { name: "\u4FDD\u6696\u5185\u8863", c: "clothing", smart: "perPerson" },
        { name: "\u9632\u98CE\u624B\u5957", c: "clothing", smart: "perPerson" },
        { name: "\u56F4\u5DFE", c: "clothing", smart: "perPerson" },
        { name: "\u4FDD\u6696\u5E3D", c: "clothing", smart: "perPerson" },
        { name: "\u6696\u5B9D\u5B9D", c: "misc", q: 4 },
        { name: "\u4FDD\u6E29\u676F", c: "misc" }
      ]
    },
    {
      id: "module-concert",
      name: "\u6F14\u5531\u4F1A\u5305",
      icon: "\u{1F3A4}",
      purpose: "travel",
      desc: "\u4ECE\u5165\u573A\u51ED\u8BC1\u3001\u5E94\u63F4\u5230\u624B\u673A\u7EED\u822A\uFF0C\u9002\u5408\u6F14\u5531\u4F1A\u3001\u97F3\u4E50\u8282\u548C\u5927\u578B\u73B0\u573A\u6D3B\u52A8\u3002",
      tags: ["\u6F14\u5531\u4F1A", "\u5E94\u63F4", "\u73B0\u573A\u6D3B\u52A8"],
      items: [
        { name: "\u8EAB\u4EFD\u8BC1", c: "docs" },
        { name: "\u7535\u5B50\u7968/\u5165\u573A\u7801", c: "docs" },
        { name: "\u624B\u673A", c: "electronics" },
        { name: "\u5145\u7535\u5B9D", c: "electronics" },
        { name: "\u6570\u636E\u7EBF", c: "electronics" },
        { name: "\u5E94\u63F4\u68D2", c: "electronics" },
        { name: "\u5E94\u63F4\u68D2\u5907\u7528\u7535\u6C60", c: "electronics", q: 2 },
        { name: "\u964D\u566A\u8033\u585E", c: "small-bag" },
        { name: "\u8F7B\u4FBF\u5C0F\u5305", c: "small-bag" },
        { name: "\u7EB8\u5DFE", c: "misc" },
        { name: "\u4E00\u6B21\u6027\u96E8\u8863", c: "misc" },
        { name: "\u5C0F\u578B\u624B\u6301\u98CE\u6247", c: "electronics" },
        { name: "\u53E3\u7F69", c: "small-bag", q: 2 },
        { name: "\u6563\u573A\u4EA4\u901A\u65B9\u6848", c: "docs" }
      ]
    },
    {
      id: "module-solo-hiking",
      name: "\u5355\u4EBA\u5F92\u6B65\u767B\u5C71\u5305",
      icon: "\u{1F97E}",
      purpose: "travel",
      desc: "\u5355\u4EBA\u5F92\u6B65\u7684\u5BFC\u822A\u3001\u8865\u7ED9\u3001\u9632\u62A4\u4E0E\u5E94\u6025\u6E05\u5355\u3002\u51FA\u53D1\u524D\u8BF7\u8BC4\u4F30\u8DEF\u7EBF\u548C\u5929\u6C14\uFF0C\u5E76\u5411\u4EB2\u53CB\u544A\u77E5\u884C\u7A0B\u3002",
      tags: ["\u5F92\u6B65", "\u767B\u5C71", "\u5355\u4EBA", "\u5B89\u5168"],
      items: [
        { name: "\u8EAB\u4EFD\u8BC1", c: "docs" },
        { name: "\u884C\u7A0B\u544A\u77E5/\u7D27\u6025\u8054\u7CFB\u4EBA", c: "docs" },
        { name: "\u79BB\u7EBF\u5730\u56FE\u4E0E\u8F68\u8FF9", c: "electronics" },
        { name: "\u624B\u673A", c: "electronics" },
        { name: "\u5145\u7535\u5B9D", c: "electronics" },
        { name: "\u5934\u706F", c: "electronics" },
        { name: "\u5934\u706F\u5907\u7528\u7535\u6C60", c: "electronics", q: 2 },
        { name: "\u996E\u7528\u6C34", c: "misc", q: 2 },
        { name: "\u80FD\u91CF\u98DF\u54C1", c: "misc", q: 2 },
        { name: "\u4E2A\u4EBA\u5E38\u7528\u836F", c: "medicine" },
        { name: "\u6237\u5916\u6025\u6551\u5305", c: "medicine" },
        { name: "\u4FDD\u6E29\u6025\u6551\u6BEF", c: "misc" },
        { name: "\u6C42\u751F\u54E8", c: "misc" },
        { name: "\u51B2\u950B\u8863/\u9632\u96E8\u5916\u5C42", c: "clothing" },
        { name: "\u9632\u6652\u971C", c: "skincare" },
        { name: "\u5E3D\u5B50", c: "clothing" },
        { name: "\u767B\u5C71\u978B", c: "clothing" },
        { name: "\u767B\u5C71\u6756", c: "big-bag", q: 2 },
        { name: "\u5783\u573E\u888B", c: "misc", q: 2 }
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
      id: (module == null ? void 0 : module.id) || "official-module-" + gid(),
      name: (module == null ? void 0 : module.name) || "\u672A\u547D\u540D\u5B98\u65B9\u5C0F\u5305",
      icon: (module == null ? void 0 : module.icon) || "\u{1F9F0}",
      purpose: (module == null ? void 0 : module.purpose) || "starter",
      group: (module == null ? void 0 : module.group) || "",
      role: (module == null ? void 0 : module.role) || "",
      defaultOn: Boolean(module == null ? void 0 : module.defaultOn),
      desc: (module == null ? void 0 : module.desc) || "",
      tags: Array.isArray(module == null ? void 0 : module.tags) ? uniqueStrings(module.tags) : [],
      items: ((module == null ? void 0 : module.items) || []).map(normalizeModuleItem)
    };
  }
  function normalizeModuleRecord(record) {
    var _a, _b;
    return {
      ...record,
      recordType: "module",
      isTemplate: true,
      icon: record.icon || ((_a = record.kitMeta) == null ? void 0 : _a.icon) || "\u{1F9F0}",
      desc: record.desc || ((_b = record.kitMeta) == null ? void 0 : _b.desc) || "",
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
      // Stable module identities. `sourceModules` remains the human-readable
      // snapshot for display and backward compatibility with existing data.
      sourceModuleKeys: Array.isArray(item.sourceModuleKeys) ? uniqueStrings(item.sourceModuleKeys) : [],
      tags: Array.isArray(item == null ? void 0 : item.tags) ? uniqueStrings(item.tags) : []
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
    const name = String((item == null ? void 0 : item.name) || "\u672A\u547D\u540D\u7269\u54C1").trim();
    const category = (item == null ? void 0 : item.category) || guessCat(name);
    const smartConfig = normalizeSmartConfig((item == null ? void 0 : item.smartConfig) || inferSmartConfig(name, category));
    return {
      id: (item == null ? void 0 : item.id) || "asset-" + gid(),
      name,
      category,
      defaultQty: Math.max(1, parseInt(item == null ? void 0 : item.defaultQty) || 1),
      bag: (item == null ? void 0 : item.bag) || suggestBagForItem(name, category),
      smartRule: smartConfig ? "formula" : (item == null ? void 0 : item.smartRule) || inferSmartRule(name, category),
      smartConfig,
      source: (item == null ? void 0 : item.source) === "user" ? "user" : "system",
      tags: Array.isArray(item == null ? void 0 : item.tags) ? uniqueStrings(item.tags) : []
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
    var _a;
    const config = normalizeSmartConfig(smartConfig);
    if (!config || !((_a = tripContext == null ? void 0 : tripContext.sourceModules) == null ? void 0 : _a.length)) return 0;
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
      return "\u57FA\u7840\u91CF + ".concat(config.dailyIncrement, "\xD7\u5929\u6570 + \u573A\u666F\u7CFB\u6570");
    }
    if (rule === "perPerson") return "\u6309\u4EBA\u6570\u5EFA\u8BAE";
    if (rule === "perDay") return "\u6309\u5929\u6570\u5EFA\u8BAE";
    if (rule === "perPersonPerDay") return "\u6309\u5929\u6570 \xD7 \u4EBA\u6570\u5EFA\u8BAE";
    return "\u56FA\u5B9A\u6570\u91CF";
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
      existing.sourceModuleKeys = uniqueStrings([...existing.sourceModuleKeys || [], ...candidate.sourceModuleKeys || []]);
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
      } catch (e) {
        return null;
      }
    }
    write(key, value) {
      try {
        localStorage.setItem(key, value);
        return true;
      } catch (e) {
        console.warn("[LocalStorageAdapter] write failed:", e);
        return false;
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
  var RETIRED_OFFICIAL_MODULE_IDS = /* @__PURE__ */ new Set([
    "module-baby-comfort",
    "module-baby-snacks"
  ]);
  var OFFICIAL_SEED_VERSION = 6;
  var REVISED_OFFICIAL_MODULE_IDS = /* @__PURE__ */ new Set([
    "module-hygiene",
    "module-makeup",
    "module-docs",
    "module-skincare",
    "module-adult-medicine",
    "module-clothing",
    "module-baby-base",
    "module-baby-feeding",
    "module-baby-clothing",
    "module-baby-overnight",
    "module-baby-medicine",
    "module-baby-gear",
    "module-baby-vaccine",
    "module-baby-outdoor",
    "module-electronics",
    "module-international",
    "module-long-haul-flight",
    "module-road-trip"
  ]);
  var LEGACY_OFFICIAL_MODULE_NAMES = {
    "module-hygiene": ["\u6D17\u6F31\u5305"],
    "module-makeup": ["\u5316\u5986\u5305"],
    "module-docs": ["\u8BC1\u4EF6\u5305"],
    "module-skincare": ["\u62A4\u80A4\u5305"],
    "module-adult-medicine": ["\u5E38\u5907\u836F\u5305"],
    "module-clothing": ["\u8863\u670D\u5305"],
    "module-baby-base": ["\u5B9D\u5B9D\u57FA\u7840\u5305", "\u5B9D\u5B9D\u6362\u6D17\u62A4\u7406\u5305", "\u5B9D\u5B9D\u65E5\u5E38\u51FA\u95E8\u5305"],
    "module-baby-feeding": ["\u5582\u517B\u63D2\u4EF6\u5305", "\u5B9D\u5B9D\u5582\u517B\u5305"],
    "module-baby-clothing": ["\u5B9D\u5B9D\u8863\u7269\u5305"],
    "module-baby-overnight": ["\u8FC7\u591C\u63D2\u4EF6\u5305", "\u5B9D\u5B9D\u6D17\u6FA1\u5305", "\u5B9D\u5B9D\u8FC7\u591C\u8865\u5145\u5305"],
    "module-baby-medicine": ["\u5B9D\u5B9D\u836F\u54C1\u5305"],
    "module-baby-gear": ["\u5B9D\u5B9D\u51FA\u884C\u88C5\u5907\u5305"],
    "module-baby-vaccine": ["\u75AB\u82D7\u63D2\u4EF6\u5305", "\u5B9D\u5B9D\u75AB\u82D7\u573A\u666F"],
    "module-baby-outdoor": ["\u6237\u5916\u63D2\u4EF6\u5305", "\u5B9D\u5B9D\u6237\u5916\u573A\u666F"],
    "module-electronics": ["\u7535\u5B50\u5305"],
    "module-international": ["\u6D77\u5916\u51FA\u884C\u5305"],
    "module-long-haul-flight": ["\u957F\u9014\u98DE\u673A\u573A\u666F"],
    "module-road-trip": ["\u81EA\u9A7E\u51FA\u884C\u5305"]
  };
  var DataStore = class {
    constructor(adapter = new LocalStorageAdapter()) {
      this._adapter = adapter;
    }
    _parseJson(raw, fallback) {
      try {
        return raw ? JSON.parse(raw) : fallback;
      } catch (e) {
        return fallback;
      }
    }
    readJson(key, fallback) {
      return this._parseJson(this._adapter.read(key), fallback);
    }
    writeJson(key, value) {
      return this._adapter.write(key, JSON.stringify(value)) !== false;
    }
    // ===== 记录（Trip + Module 混存）=====
    getRecords() {
      return this.readJson(STORAGE_KEYS.records, []).map(normalizeRecord).sort((a, b) => new Date(b.updatedAt || b.createdAt || 0) - new Date(a.updatedAt || a.createdAt || 0));
    }
    saveRecords(records) {
      return this.writeJson(STORAGE_KEYS.records, records);
    }
    saveRecord(record) {
      const records = this.getRecords();
      const idx = records.findIndex((item) => item.id === record.id);
      const normalized = normalizeRecord(record);
      if (idx >= 0) records[idx] = normalized;
      else records.unshift(normalized);
      return this.saveRecords(records);
    }
    // ===== 官方小包 =====
    getOfficialModules() {
      const stored = this.readJson(STORAGE_KEYS.officialModules, null);
      const deletedIds = new Set(this.readJson(STORAGE_KEYS.deletedOfficialModules, []));
      const storedSeedVersion = Number(this.readJson(STORAGE_KEYS.officialSeedVersion, 0)) || 0;
      const shouldRefreshOfficialSeeds = storedSeedVersion < OFFICIAL_SEED_VERSION;
      if (!stored) {
        this.writeJson(STORAGE_KEYS.officialSeedVersion, OFFICIAL_SEED_VERSION);
        return OFFICIAL_MODULES.filter((module) => !deletedIds.has(module.id)).map(normalizeOfficialModule);
      }
      const storedModules = (stored || []).map(normalizeOfficialModule).filter((module) => !RETIRED_OFFICIAL_MODULE_IDS.has(module.id));
      const storedById = new Map(storedModules.map((module) => [module.id, module]));
      const seedIds = new Set(OFFICIAL_MODULES.map((module) => module.id));
      const seeded = OFFICIAL_MODULES.filter((module) => !deletedIds.has(module.id)).map((module) => {
        const storedModule = storedById.get(module.id);
        const legacyNames = LEGACY_OFFICIAL_MODULE_NAMES[module.id] || [];
        const canRefreshSeed = !storedModule || legacyNames.includes(storedModule.name);
        return shouldRefreshOfficialSeeds && REVISED_OFFICIAL_MODULE_IDS.has(module.id) && canRefreshSeed ? normalizeOfficialModule(module) : storedModule || normalizeOfficialModule(module);
      });
      const extra = storedModules.filter((module) => !seedIds.has(module.id) && !deletedIds.has(module.id));
      if (shouldRefreshOfficialSeeds) {
        this.writeJson(STORAGE_KEYS.officialSeedVersion, OFFICIAL_SEED_VERSION);
        this.saveOfficialModules([...seeded, ...extra]);
      }
      return [...seeded, ...extra];
    }
    saveOfficialModules(modules) {
      return this.writeJson(STORAGE_KEYS.officialModules, (modules || []).map(normalizeOfficialModule));
    }
    markOfficialModuleDeleted(moduleId) {
      const deleted = new Set(this.readJson(STORAGE_KEYS.deletedOfficialModules, []));
      deleted.add(moduleId);
      return this.writeJson(STORAGE_KEYS.deletedOfficialModules, [...deleted]);
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
    return _store.writeJson(key, value);
  }
  function getRecords() {
    return _store.getRecords();
  }
  function saveRecords(records) {
    return _store.saveRecords(records);
  }
  function saveRecord(record) {
    return _store.saveRecord(record);
  }
  function getOfficialModules() {
    return _store.getOfficialModules();
  }
  function saveOfficialModules(modules) {
    return _store.saveOfficialModules(modules);
  }
  function markOfficialModuleDeleted(moduleId) {
    return _store.markOfficialModuleDeleted(moduleId);
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
    return writeJson(STORAGE_KEYS.itemLibrary, sortLibraryItems((items || []).map(normalizeLibraryItem)));
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
      const name = String((item == null ? void 0 : item.name) || "").trim();
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
    const sourceModule = { source: "official", id: module.id, name: module.name };
    return (module.items || []).map((item) => createTripItemFromModuleItem(normalizeModuleItem(item), days, people, sourceModule));
  }
  function resolveCustomModuleItems(module, days, people) {
    const sourceModule = { source: "custom", id: module.id, name: module.name };
    return (module.items || []).map((item) => createTripItemFromModuleItem(item, days, people, sourceModule));
  }
  function createTripItemFromModuleItem(item, days, people, sourceModule) {
    const { smartRule, smartConfig } = resolveItemSmartPlan(item.name, item.category, item.smartRule, item.smartConfig);
    const sourceModuleName = typeof sourceModule === "string" ? sourceModule : sourceModule == null ? void 0 : sourceModule.name;
    const sourceModuleKey = typeof sourceModule === "object" && (sourceModule == null ? void 0 : sourceModule.id) ? getModuleKey(sourceModule.source || "custom", sourceModule.id) : "";
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
      sourceModuleKeys: sourceModuleKey ? [sourceModuleKey] : [],
      tags: Array.isArray(item.tags) ? [...item.tags] : []
    });
  }
  function createTripItemFromAsset(asset, days, people) {
    const { smartRule, smartConfig } = resolveItemSmartPlan(asset.name, asset.category, asset.smartRule, asset.smartConfig);
    return normalizeTripItem({
      id: "item-" + gid(),
      name: asset.name,
      category: asset.category,
      bag: asset.bag || suggestBagForItem(asset.name, asset.category),
      smartRule,
      smartConfig,
      smartBaseQty: asset.defaultQty || 1,
      qty: computeSmartQty(asset.defaultQty || 1, smartRule, days, people, smartConfig),
      packed: false,
      notes: "",
      sourceModules: [],
      tags: Array.isArray(asset.tags) ? [...asset.tags] : []
    });
  }
  function getTripProgress(trip) {
    var _a, _b;
    const total = ((_a = trip.items) == null ? void 0 : _a.length) || 0;
    const packed = ((_b = trip.items) == null ? void 0 : _b.filter((item) => item.packed).length) || 0;
    return {
      total,
      packed,
      pending: Math.max(0, total - packed),
      pct: total ? Math.round(packed / total * 100) : 0
    };
  }
  function getTripStatus(trip) {
    const progress = getTripProgress(trip);
    if (progress.total > 0 && progress.packed >= progress.total) return { key: "done", label: "\u5DF2\u5B8C\u6210", icon: "" };
    if (progress.packed > 0) return { key: "packing", label: "\u6253\u5305\u4E2D", icon: "" };
    return { key: "planning", label: "\u89C4\u5212\u4E2D", icon: "" };
  }
  function formatTripMeta(trip) {
    var _a, _b;
    const modules = ((_a = trip.sourceModules) == null ? void 0 : _a.length) ? " \xB7 ".concat(trip.sourceModules.length, " \u4E2A\u5C0F\u5305") : "";
    return "".concat(trip.days || 1, " \u5929 \xB7 ").concat(trip.people || 1, " \u4EBA \xB7 ").concat(((_b = trip.items) == null ? void 0 : _b.length) || 0, " \u4EF6").concat(modules);
  }
  function formatTripSourceSummary(trip) {
    var _a;
    if (!((_a = trip.sourceModules) == null ? void 0 : _a.length)) return "\u81EA\u7531\u6DFB\u52A0\u7269\u54C1";
    const names = trip.sourceModules.map((module) => module.name);
    if (names.length <= 2) return names.join(" + ");
    return names.slice(0, 2).join(" + ") + " +".concat(names.length - 2, " \u4E2A\u5C0F\u5305");
  }
  function getModuleKey(source, id) {
    return "".concat(source, ":").concat(id);
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
  function isModuleOnTrip(trip, source, moduleId) {
    return ((trip == null ? void 0 : trip.sourceModules) || []).some((module) => module.source === source && module.id === moduleId);
  }
  function removeModuleFromTrip(trip, source, moduleId) {
    const entity = getModuleEntity(source, moduleId);
    if (!entity || !trip) return { changed: false, trip, moduleName: "", removedItems: 0 };
    const allSourceModules = [...trip.sourceModules || []];
    const sourceMeta = allSourceModules.find(
      (module) => module.source === source && module.id === moduleId
    );
    const moduleName = (sourceMeta == null ? void 0 : sourceMeta.name) || entity.name;
    const moduleKey = getModuleKey(source, moduleId);
    if (!isModuleOnTrip(trip, source, moduleId)) {
      return { changed: false, trip, moduleName, removedItems: 0 };
    }
    trip.sourceModules = (trip.sourceModules || []).filter(
      (module) => !(module.source === source && module.id === moduleId)
    );
    let removedItems = 0;
    const nextItems = [];
    (trip.items || []).forEach((item) => {
      const sources = [...item.sourceModules || []];
      const sourceKeys = [...item.sourceModuleKeys || []];
      if (!sources.length) {
        nextItems.push(item);
        return;
      }
      const hasStableSource = sourceKeys.includes(moduleKey);
      const legacyIndex = sources.indexOf(moduleName);
      if (sourceKeys.length ? !hasStableSource : legacyIndex < 0) {
        nextItems.push(item);
        return;
      }
      const remainingKeys = sourceKeys.filter((key) => key !== moduleKey);
      if (sourceKeys.length && !remainingKeys.length) {
        removedItems += 1;
        return;
      }
      const remaining = sourceKeys.length ? uniqueStrings(remainingKeys.map((key) => {
        var _a;
        const [entrySource, entryId] = splitModuleKey(key);
        return (_a = allSourceModules.find((meta) => meta.source === entrySource && meta.id === entryId)) == null ? void 0 : _a.name;
      }).filter(Boolean)) : sources.filter((_, index) => index !== legacyIndex);
      if (!sourceKeys.length && !remaining.length) {
        removedItems += 1;
        return;
      }
      nextItems.push({
        ...item,
        sourceModules: uniqueStrings(remaining),
        sourceModuleKeys: uniqueStrings(remainingKeys)
      });
    });
    trip.items = nextItems.map(normalizeTripItem);
    return { changed: true, trip, moduleName, removedItems };
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
  function tripItemSnapshotKey(item) {
    return "".concat(item.name, "::").concat(item.category);
  }
  function getTripModuleEntries(trip) {
    const entries = [];
    const seen = /* @__PURE__ */ new Set();
    ((trip == null ? void 0 : trip.sourceModules) || []).forEach((meta) => {
      const entity = getModuleEntity(meta.source, meta.id);
      if (!entity) return;
      const key = "".concat(meta.source, ":").concat(meta.id);
      if (seen.has(key)) return;
      seen.add(key);
      entries.push({
        source: meta.source,
        module: entity,
        meta: { source: meta.source, id: meta.id, name: meta.name || entity.name }
      });
    });
    return entries;
  }
  function ensureBabyBaseInModuleEntries(entries) {
    const hasBabyAddon = entries.some((entry) => isBabyModuleEntity(entry.module) && !isBabyBaseModuleEntity(entry.module));
    if (!hasBabyAddon) return entries;
    if (entries.some((entry) => isBabyBaseModuleEntity(entry.module))) return entries;
    const baseModule = getBabyBaseModule();
    if (!baseModule) return entries;
    return [{
      source: "official",
      module: baseModule,
      meta: { source: "official", id: baseModule.id, name: baseModule.name }
    }, ...entries];
  }
  function buildTripItemsFromModuleEntries(trip, entries) {
    const sourceModules = entries.map((entry) => entry.meta);
    const tripContext = {
      days: trip.days,
      people: trip.people,
      sourceModules
    };
    const items = [];
    entries.forEach(({ source, module }) => {
      const resolved = source === "official" ? resolveOfficialModuleItems(module, trip.days, trip.people) : resolveCustomModuleItems(module, trip.days, trip.people);
      mergeTripItems(items, resolved, tripContext, "module");
    });
    applyTripSmartFill({ days: trip.days, people: trip.people, items, sourceModules }, false);
    return { items, sourceModules };
  }
  function resyncTripFromSourceModules(trip, options = {}) {
    const preservePacked = options.preservePacked !== false;
    const preserveLocked = options.preserveLocked !== false;
    const preserveManualFields = options.preserveManualFields !== false;
    const manualItems = (trip.items || []).filter((item) => !(item.sourceModules || []).length);
    const oldModuleSnapshots = /* @__PURE__ */ new Map();
    (trip.items || []).filter((item) => (item.sourceModules || []).length).forEach((item) => oldModuleSnapshots.set(tripItemSnapshotKey(item), normalizeTripItem(item)));
    const hadModuleRefs = (trip.sourceModules || []).length > 0;
    const entries = ensureBabyBaseInModuleEntries(getTripModuleEntries(trip));
    if (!entries.length) {
      if (!hadModuleRefs) {
        return { changed: false, trip, added: 0, removed: 0, updated: 0, moduleCount: 0 };
      }
      trip.sourceModules = [];
      trip.items = manualItems.map(normalizeTripItem);
      return {
        changed: oldModuleSnapshots.size > 0,
        trip,
        added: 0,
        removed: oldModuleSnapshots.size,
        updated: 0,
        moduleCount: 0
      };
    }
    const beforeKeys = new Set(oldModuleSnapshots.keys());
    const { items: moduleItems, sourceModules } = buildTripItemsFromModuleEntries(trip, entries);
    const afterKeys = new Set(moduleItems.map(tripItemSnapshotKey));
    moduleItems.forEach((item) => {
      var _a;
      const old = oldModuleSnapshots.get(tripItemSnapshotKey(item));
      if (!old) return;
      if (preservePacked) item.packed = old.packed;
      if (preserveManualFields) {
        if (old.notes) item.notes = old.notes;
        if ((_a = old.tags) == null ? void 0 : _a.length) item.tags = [...old.tags];
      }
      if (preserveLocked && old.smartLocked) {
        item.smartLocked = true;
        item.qty = old.qty;
      }
    });
    const keptManual = [];
    let mergedDuplicates = 0;
    manualItems.forEach((item) => {
      var _a;
      const key = tripItemSnapshotKey(item);
      const moduleItem = moduleItems.find((entry) => tripItemSnapshotKey(entry) === key);
      if (!moduleItem) {
        keptManual.push(item);
        return;
      }
      mergedDuplicates += 1;
      moduleItem.qty = Math.max(moduleItem.qty || 1, item.qty || 1);
      if (preservePacked && item.packed) moduleItem.packed = true;
      if (preserveManualFields) {
        if (item.notes && !moduleItem.notes) moduleItem.notes = item.notes;
        if ((_a = item.tags) == null ? void 0 : _a.length) {
          moduleItem.tags = uniqueStrings([...moduleItem.tags || [], ...item.tags]);
        }
      }
      if (preserveLocked && item.smartLocked) {
        moduleItem.smartLocked = true;
        moduleItem.qty = item.qty;
      }
    });
    trip.sourceModules = sourceModules;
    trip.items = [...moduleItems.map(normalizeTripItem), ...keptManual.map(normalizeTripItem)];
    applyTripSmartFill(trip, false);
    let added = 0;
    let removed = 0;
    let updated = 0;
    afterKeys.forEach((key) => {
      if (!beforeKeys.has(key)) added += 1;
    });
    beforeKeys.forEach((key) => {
      if (!afterKeys.has(key)) removed += 1;
    });
    moduleItems.forEach((item) => {
      const old = oldModuleSnapshots.get(tripItemSnapshotKey(item));
      if (!old) return;
      if (old.qty !== item.qty || old.smartBaseQty !== item.smartBaseQty || old.smartRule !== item.smartRule) {
        updated += 1;
      }
    });
    return {
      changed: added > 0 || removed > 0 || updated > 0 || mergedDuplicates > 0,
      trip,
      added,
      removed,
      updated,
      mergedDuplicates,
      moduleCount: entries.length
    };
  }

  // app.js
  var S = {
    currentPage: "list",
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
    moduleBuilderItems: [],
    moduleItemEditContext: null,
    tripActionsTargetId: null,
    kitView: "compact",
    collapsedBags: /* @__PURE__ */ new Set(),
    tripInfoCollapsed: true,
    moduleAddPanelOpen: false,
    currentEditingTags: []
  };
  var modalReturnFocus = null;
  function init() {
    ensureItemLibrarySeeded();
    applyRuntimeCapabilityClasses();
    bindDeclarativeActions();
    setupModalOverlays();
    fillCatSelect("libraryItemCategory");
    fillBagSelect("libraryItemBag", null, DEFAULT_BAGS);
    fillCatSelect("manualItemCategory");
    fillCatSelect("tripItemCategory");
    fillCatSelect("moduleItemCategory");
    fillBagSelect("moduleItemBag", null, DEFAULT_BAGS);
    bindFormEvents();
    openTripPage();
    if (!safeStorageGet(STORAGE_KEYS.onboarded)) {
      setTimeout(startOnboarding, 400);
    }
  }
  function safeStorageGet(key) {
    try {
      return localStorage.getItem(key);
    } catch (error) {
      return null;
    }
  }
  function safeStorageSet(key, value) {
    try {
      localStorage.setItem(key, value);
      return true;
    } catch (error) {
      return false;
    }
  }
  function safeStorageRemove(key) {
    try {
      localStorage.removeItem(key);
      return true;
    } catch (error) {
      return false;
    }
  }
  function applyRuntimeCapabilityClasses() {
    const flex = document.createElement("div");
    flex.style.position = "absolute";
    flex.style.visibility = "hidden";
    flex.style.display = "flex";
    flex.style.flexDirection = "column";
    flex.style.rowGap = "1px";
    flex.appendChild(document.createElement("div"));
    flex.appendChild(document.createElement("div"));
    document.body.appendChild(flex);
    const supportsFlexGap = flex.scrollHeight === 1;
    flex.parentNode.removeChild(flex);
    document.documentElement.classList.add(supportsFlexGap ? "supports-flex-gap" : "no-flex-gap");
  }
  var ACTION_EVENT_ATTRIBUTES = {
    click: "actionClick",
    input: "actionInput",
    change: "actionChange"
  };
  function bindDeclarativeActions() {
    Object.keys(ACTION_EVENT_ATTRIBUTES).forEach((eventName) => {
      document.addEventListener(eventName, (event) => {
        const actionElement = event.target.closest("[data-action-" + eventName + "]");
        if (!actionElement) return;
        const expression = actionElement.dataset[ACTION_EVENT_ATTRIBUTES[eventName]];
        runDeclarativeAction(expression, actionElement, event);
      });
    });
  }
  function runDeclarativeAction(expression, element, event) {
    let source = String(expression || "").trim();
    if (!source) return;
    const selfTargetPrefix = "if(event.target===this)";
    if (source.indexOf(selfTargetPrefix) === 0) {
      if (event.target !== element) return;
      source = source.slice(selfTargetPrefix.length);
    }
    source.split(";").map((statement) => statement.trim()).filter(Boolean).forEach((statement) => {
      if (statement === "event.stopPropagation()") {
        event.stopPropagation();
        return;
      }
      const call = statement.match(/^([A-Za-z_$][\w$]*)\((.*)\)$/);
      if (!call) return;
      const action = window[call[1]];
      if (typeof action !== "function") return;
      action.apply(element, parseDeclarativeArguments(call[2], element, event));
    });
  }
  function parseDeclarativeArguments(source, element, event) {
    if (!source.trim()) return [];
    const tokens = [];
    let token = "";
    let quote = "";
    for (let index = 0; index < source.length; index += 1) {
      const char = source[index];
      if (quote) {
        token += char;
        if (char === quote && source[index - 1] !== "\\") quote = "";
      } else if (char === "'" || char === '"') {
        quote = char;
        token += char;
      } else if (char === ",") {
        tokens.push(token.trim());
        token = "";
      } else {
        token += char;
      }
    }
    tokens.push(token.trim());
    return tokens.map((value) => parseDeclarativeValue(value, element, event));
  }
  function parseDeclarativeValue(value, element, event) {
    if (value === "this.value") return element.value;
    if (value === "S.tripMode") return S.tripMode;
    if (value === "event") return event;
    if (value === "true") return true;
    if (value === "false") return false;
    if (value === "null") return null;
    if (/^-?\d+(?:\.\d+)?$/.test(value)) return Number(value);
    if (value[0] === "'" && value[value.length - 1] === "'" || value[0] === '"' && value[value.length - 1] === '"') {
      return value.slice(1, -1).replace(/\\(['"\\])/g, "$1");
    }
    return value;
  }
  function bindFormEvents() {
    var _a, _b, _c, _d, _e, _f, _g, _h, _i, _j, _k, _l, _m, _n, _o, _p, _q, _r, _s, _t, _u, _v, _w;
    (_a = document.getElementById("tripDays")) == null ? void 0 : _a.addEventListener("input", syncTripBuilderSummary);
    (_b = document.getElementById("tripPeople")) == null ? void 0 : _b.addEventListener("input", syncTripBuilderSummary);
    (_c = document.getElementById("libraryItemCategory")) == null ? void 0 : _c.addEventListener("change", () => {
      syncBagWithCategory("libraryItemCategory", "libraryItemBag", DEFAULT_BAGS);
      updateLibrarySmartHint();
    });
    (_d = document.getElementById("libraryItemName")) == null ? void 0 : _d.addEventListener("input", updateLibrarySmartHint);
    (_e = document.getElementById("libraryItemBulkInput")) == null ? void 0 : _e.addEventListener("input", updateLibrarySmartHint);
    (_f = document.getElementById("libraryItemQty")) == null ? void 0 : _f.addEventListener("input", updateLibrarySmartHint);
    (_g = document.getElementById("manualItemCategory")) == null ? void 0 : _g.addEventListener("change", () => {
      var _a2;
      syncBagWithCategory("manualItemCategory", "manualItemBag", ((_a2 = S.currentTrip) == null ? void 0 : _a2.bags) || DEFAULT_BAGS);
      updateManualItemSmartHint();
    });
    (_h = document.getElementById("manualItemName")) == null ? void 0 : _h.addEventListener("input", updateManualItemSmartHint);
    (_i = document.getElementById("manualItemBulkInput")) == null ? void 0 : _i.addEventListener("input", updateManualItemSmartHint);
    (_j = document.getElementById("manualItemQty")) == null ? void 0 : _j.addEventListener("input", updateManualItemSmartHint);
    (_k = document.getElementById("tripItemQty")) == null ? void 0 : _k.addEventListener("input", updateTripItemSmartMeta);
    (_l = document.getElementById("tripItemCategory")) == null ? void 0 : _l.addEventListener("change", () => {
      var _a2;
      syncBagWithCategory("tripItemCategory", "tripItemBag", ((_a2 = S.currentTrip) == null ? void 0 : _a2.bags) || DEFAULT_BAGS);
      updateTripItemSmartMeta();
    });
    (_m = document.getElementById("moduleItemQty")) == null ? void 0 : _m.addEventListener("input", updateModuleItemSmartHint);
    (_n = document.getElementById("moduleQuickAddInput")) == null ? void 0 : _n.addEventListener("keydown", (event) => {
      if (event.key !== "Enter") return;
      event.preventDefault();
      quickAddItemToCurrentModule();
    });
    (_o = document.getElementById("moduleDetailItems")) == null ? void 0 : _o.addEventListener("click", (event) => {
      const button = event.target.closest("[data-remove-detail-item]");
      if (!button) return;
      removeItemFromCurrentModule(Number(button.dataset.removeDetailItem));
    });
    (_p = document.getElementById("moduleBuilderItems")) == null ? void 0 : _p.addEventListener("click", (e) => {
      const tile = e.target.closest(".picker-item");
      if (!(tile == null ? void 0 : tile.dataset.itemId)) return;
      addModuleBuilderItemByAssetId(tile.dataset.itemId);
    });
    (_q = document.getElementById("moduleBuilderSelectedItems")) == null ? void 0 : _q.addEventListener("click", (e) => {
      const btn = e.target.closest("[data-remove-module-item]");
      if (!btn) return;
      removeModuleBuilderItem(btn.dataset.removeModuleItem);
    });
    (_r = document.getElementById("libraryItemTagsDisplay")) == null ? void 0 : _r.addEventListener("click", (e) => {
      const btn = e.target.closest(".item-tag-remove");
      if (!btn) return;
      e.preventDefault();
      removeLibraryItemTagByIndex(parseInt(btn.dataset.tagIndex, 10));
    });
    (_s = document.getElementById("tripItemTagsDisplay")) == null ? void 0 : _s.addEventListener("click", (e) => {
      const btn = e.target.closest(".item-tag-remove");
      if (!btn) return;
      e.preventDefault();
      removeTripItemTagByIndex(parseInt(btn.dataset.tagIndex, 10));
    });
    (_t = document.getElementById("listContent")) == null ? void 0 : _t.addEventListener("click", (e) => {
      const card = e.target.closest("[data-trip-item-id]");
      if (!card || S.tripMode !== "plan") return;
      openTripItemModal(card.dataset.tripItemId);
    });
    (_u = document.getElementById("libraryItemTagInput")) == null ? void 0 : _u.addEventListener("keydown", (e) => {
      if (e.key === "Enter") {
        e.preventDefault();
        addLibraryItemTag();
      }
    });
    (_v = document.getElementById("tripItemTagInput")) == null ? void 0 : _v.addEventListener("keydown", (e) => {
      if (e.key === "Enter") {
        e.preventDefault();
        addTripItemTag();
      }
    });
    (_w = document.getElementById("moduleItemCategory")) == null ? void 0 : _w.addEventListener("change", () => {
      syncBagWithCategory("moduleItemCategory", "moduleItemBag", DEFAULT_BAGS);
      updateModuleItemSmartHint();
    });
  }
  function nav(page) {
    if (page === "itemlibrary") page = "items";
    S.currentPage = page;
    document.querySelectorAll(".page").forEach((el) => el.classList.toggle("active", el.dataset.page === page));
    renderHeader();
    renderBottomNav();
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
  function openSubPage(page, returnTo) {
    S.returnPage = returnTo;
    S.currentModuleAction = "browse";
    nav(page);
  }
  function openTripPage() {
    S.returnPage = null;
    S.currentModuleAction = "browse";
    nav("list");
  }
  function goBack() {
    if (S.currentPage === "list" && S.currentTrip) {
      S.currentTrip = null;
      S.currentTripId = null;
      renderHeader();
      renderTripPage();
      return;
    }
    if (S.returnPage) {
      const target = S.returnPage;
      S.returnPage = null;
      S.currentModuleAction = "browse";
      nav(target);
      return;
    }
    nav("list");
  }
  function refreshTripHub() {
    if (S.currentPage === "list" && !S.currentTrip) renderTripPage();
  }
  function renderHeader() {
    var _a;
    const backWrap = document.getElementById("headerBackWrap");
    const title = document.getElementById("headerTitle");
    const eyebrow = document.getElementById("headerEyebrow");
    const right = document.getElementById("headerRight");
    backWrap.style.visibility = S.currentPage === "list" && S.currentTrip || S.returnPage ? "visible" : "hidden";
    right.innerHTML = "";
    right.className = "header-right";
    if (S.currentPage === "kits") {
      title.textContent = "\u5C0F\u5305";
      eyebrow.textContent = S.currentModuleAction === "add" ? "\u52A0\u5165\u5F53\u524D\u884C\u7A0B" : "\u53EF\u590D\u7528\u7684\u6253\u5305\u6A21\u5757";
      right.innerHTML = '<button class="btn-icon" data-action-click="openCreateModuleModal()" aria-label="\u65B0\u5EFA\u5C0F\u5305">\uFF0B</button>';
    } else if (S.currentPage === "items") {
      title.textContent = "\u7269\u54C1\u5E93";
      eyebrow.textContent = S.currentTrip ? "\u7ED9\u5F53\u524D\u884C\u7A0B\u8865\u8D27" : "\u5E38\u7528\u7269\u54C1\u4E00\u5904\u7BA1\u7406";
      right.innerHTML = '<button class="btn-icon" data-action-click="openLibraryItemModal()" aria-label="\u65B0\u589E\u7269\u54C1">\uFF0B</button>';
    } else if (S.currentPage === "list" && !S.currentTrip) {
      title.textContent = "\u884C\u7A0B";
      eyebrow.textContent = "\u89C4\u5212 \xB7 \u6253\u5305 \xB7 \u51FA\u53D1";
      right.innerHTML = '<button class="btn-icon" data-action-click="openCreateTripModal()" aria-label="\u65B0\u5EFA\u884C\u7A0B">\uFF0B</button>';
    } else if (S.currentPage === "list") {
      title.textContent = ((_a = S.currentTrip) == null ? void 0 : _a.name) || "\u884C\u7A0B";
      eyebrow.textContent = formatTripMeta(S.currentTrip);
      right.className = "header-right wide";
      right.innerHTML = '<div class="header-mode-switch"><button type="button" class="header-mode-tab' + (S.tripMode === "plan" ? " active" : "") + '" data-action-click="setTripMode(\'plan\')">\u89C4\u5212</button><button type="button" class="header-mode-tab' + (S.tripMode === "pack" ? " active" : "") + '" data-action-click="setTripMode(\'pack\')">\u6253\u5305</button></div>';
    } else if (S.currentPage === "me") {
      title.textContent = "\u6211\u7684";
      eyebrow.textContent = "\u8BBE\u7F6E\u4E0E\u6570\u636E";
      right.innerHTML = "";
    }
  }
  function renderBottomNav() {
    document.querySelectorAll(".nav-item").forEach((btn) => {
      btn.classList.toggle("active", btn.dataset.nav === S.currentPage);
    });
  }
  function renderTripHub() {
    const trips = getTrips();
    const summaryBox = document.getElementById("listSummary");
    const switchBox = document.getElementById("listModeSwitch");
    const actionBar = document.getElementById("listActionBar");
    const subBar = document.getElementById("listSubBar");
    const content = document.getElementById("listContent");
    if (!summaryBox || !content) return;
    switchBox.innerHTML = "";
    actionBar.innerHTML = "";
    subBar.innerHTML = "";
    if (!trips.length) {
      summaryBox.innerHTML = "";
      content.innerHTML = '<div class="trip-hub"><div class="empty-hero"><img class="empty-mascot" src="assets/xingli-dog-mascot.png" alt="" aria-hidden="true"><div class="empty-kicker">\u5F00\u59CB\u7B2C\u4E00\u6B21\u51FA\u884C</div><div class="empty-title">\u8FD8\u6CA1\u6709\u884C\u7A0B</div><div class="empty-hint">\u7528\u5C0F\u5305\u62FC\u51FA\u6E05\u5355\uFF0C\u518D\u6309\u5929\u6309\u4EBA\u667A\u80FD\u5EFA\u8BAE\u6570\u91CF\u3002</div></div><div class="empty-steps"><div class="empty-step"><span class="empty-step-num">1</span><div><div class="empty-step-title">\u6574\u7406\u5C0F\u5305</div><div class="empty-step-desc">\u6D17\u6F31\u3001\u5316\u5986\u3001\u8BC1\u4EF6\u7B49\u5E38\u5E26\u7EC4\u5408</div></div></div><div class="empty-step"><span class="empty-step-num">2</span><div><div class="empty-step-title">\u65B0\u5EFA\u884C\u7A0B</div><div class="empty-step-desc">\u52FE\u9009\u8FD9\u6B21\u8981\u5E26\u7684\u5C0F\u5305</div></div></div><div class="empty-step"><span class="empty-step-num">3</span><div><div class="empty-step-title">\u6253\u5305\u52FE\u9009</div><div class="empty-step-desc">\u5BF9\u7167\u5B9E\u7269\u9010\u9879\u6253\u52FE</div></div></div></div><div class="empty-actions stacked"><button class="btn-primary wide" type="button" data-action-click="openCreateTripModal()">\u65B0\u5EFA\u884C\u7A0B</button><button class="btn-secondary wide" type="button" data-action-click="openMainPage(\'kits\')">\u5148\u770B\u5C0F\u5305</button></div></div>';
      return;
    }
    const active = trips.filter((trip) => getTripStatus(trip).key !== "done");
    const done = trips.filter((trip) => getTripStatus(trip).key === "done");
    summaryBox.innerHTML = '<div class="hub-toolbar"><img class="hub-mascot" src="assets/xingli-dog-mascot.png" alt="" aria-hidden="true"><div class="hub-toolbar-copy"><div class="hub-toolbar-title">\u6211\u7684\u884C\u7A0B</div><div class="hub-toolbar-meta">' + active.length + " \u4E2A\u8FDB\u884C\u4E2D \xB7 \u5171 " + trips.length + ' \u4E2A</div></div><button class="btn-primary" type="button" data-action-click="openCreateTripModal()">\u65B0\u5EFA</button></div>';
    let html = "";
    if (active.length) {
      html += '<section class="section trip-home-section"><div class="section-head"><h3 class="section-title">\u8FDB\u884C\u4E2D</h3><span class="section-meta">' + active.length + '</span></div><div class="trip-list-compact">' + active.map(renderTripCardCompact).join("") + "</div></section>";
    } else {
      html += '<div class="soft-banner">\u6682\u65E0\u8FDB\u884C\u4E2D\u7684\u884C\u7A0B\uFF0C\u70B9\u53F3\u4E0A\u89D2\u65B0\u5EFA\u4E00\u5F20\u3002</div>';
    }
    if (done.length) {
      const showing = S.homeHistoryExpanded ? done : done.slice(0, 3);
      html += '<section class="section trip-home-section section-gap-top"><div class="section-head"><h3 class="section-title">\u5DF2\u5B8C\u6210</h3>' + (done.length > 3 ? '<span class="section-meta section-link" data-action-click="toggleHomeHistory()">' + (S.homeHistoryExpanded ? "\u6536\u8D77" : "\u5168\u90E8 " + done.length) + "</span>" : '<span class="section-meta">' + done.length + "</span>") + '</div><div class="trip-list-compact">' + showing.map(renderTripCardCompact).join("") + "</div></section>";
    }
    content.innerHTML = html;
  }
  function toggleHomeHistory() {
    if (getDoneTrips().length <= 3) return;
    S.homeHistoryExpanded = !S.homeHistoryExpanded;
    refreshTripHub();
  }
  function renderTripCardCompact(trip) {
    var _a;
    const progress = getTripProgress(trip);
    const status = getTripStatus(trip);
    const openMode = progress.packed > 0 && status.key !== "done" ? "pack" : "plan";
    return '<div class="trip-row"><button type="button" class="trip-row-hit" data-action-click="openTrip(\'' + trip.id + "','" + openMode + '\')"><div class="trip-row-content"><div class="trip-row-top"><div class="trip-row-title">' + esc(trip.name) + '</div><span class="status-chip ' + status.key + '">' + status.label + '</span></div><div class="trip-row-subtitle">' + esc(formatTripMeta(trip)) + (((_a = trip.sourceModules) == null ? void 0 : _a.length) ? " \xB7 " + esc(formatTripSourceSummary(trip)) : "") + '</div></div><div class="trip-row-trail"><div class="progress-ring progress-ring-sm" style="--pct:' + progress.pct + '"><span class="progress-ring-text">' + progress.pct + '%</span></div><span class="trip-row-chevron" aria-hidden="true">\u203A</span></div></button><button type="button" class="trip-row-menu" data-action-click="openTripActionsSheet(\'' + trip.id + '\')" aria-label="\u66F4\u591A\u64CD\u4F5C">\u22EF</button></div>';
  }
  function openTripActionsSheet(tripId) {
    var _a;
    S.tripActionsTargetId = tripId;
    (_a = document.getElementById("tripActionsSheet")) == null ? void 0 : _a.classList.add("active");
  }
  function closeTripActionsSheet() {
    var _a;
    S.tripActionsTargetId = null;
    (_a = document.getElementById("tripActionsSheet")) == null ? void 0 : _a.classList.remove("active");
  }
  function duplicateTripFromSheet() {
    const id = S.tripActionsTargetId;
    closeTripActionsSheet();
    if (id) duplicateTrip(id);
  }
  function deleteTripFromSheet() {
    const id = S.tripActionsTargetId;
    closeTripActionsSheet();
    if (id) deleteTrip(id);
  }
  function renderProgress(progress) {
    return '<div class="saved-list-progress"><div class="saved-list-progress-bar"><div class="saved-list-progress-fill" style="width:' + progress.pct + '%"></div></div><span class="saved-list-progress-text">\u5DF2\u6253\u5305 ' + progress.packed + "/" + progress.total + " \u4EF6</span></div>";
  }
  function getDoneTrips() {
    return getTrips().filter((trip) => getTripStatus(trip).key === "done");
  }
  function renderTripPage() {
    const summaryBox = document.getElementById("listSummary");
    const switchBox = document.getElementById("listModeSwitch");
    const actionBar = document.getElementById("listActionBar");
    const subBar = document.getElementById("listSubBar");
    const content = document.getElementById("listContent");
    if (!S.currentTrip) {
      renderTripHub();
      return;
    }
    const trip = S.currentTrip;
    const progress = getTripProgress(trip);
    const status = getTripStatus(trip);
    const smartCount = trip.items.filter((item) => item.smartRule !== "fixed").length;
    const collapsed = S.tripInfoCollapsed ? " collapsed" : "";
    const cardClass = "list-summary-card" + (S.tripInfoCollapsed ? " is-collapsed" : "") + (S.tripMode === "pack" ? " pack-mode" : "");
    const allTrips = getTrips();
    const tripSwitcher = allTrips.length > 1 ? '<div class="trip-switch-row"><select class="trip-switch-select" aria-label="\u5207\u6362\u884C\u7A0B" data-action-change="openTrip(this.value, S.tripMode)">' + allTrips.map((entry) => '<option value="' + entry.id + '"' + (entry.id === trip.id ? " selected" : "") + ">" + esc(entry.name) + "</option>").join("") + "</select></div>" : "";
    summaryBox.innerHTML = '<div class="' + cardClass + '"><div class="trip-summary-bar" data-action-click="toggleTripInfoCard()"><div class="trip-summary-bar-main"><div class="list-summary-title">' + esc(trip.name) + '</div><span class="status-chip ' + status.key + '">' + status.label + '</span><span class="trip-summary-pct">' + progress.pct + '%</span></div><span class="trip-info-toggle-arrow' + collapsed + '">\u25BC</span></div>' + tripSwitcher + '<div class="trip-summary-expanded"><div class="list-summary-meta">' + esc(formatTripSourceSummary(trip)) + " \xB7 " + esc(formatTripMeta(trip)) + "</div>" + renderProgress(progress) + '<div class="trip-info-body' + collapsed + '"><div class="trip-info-row"><div class="trip-info-row-label">\u5929\u6570</div><div class="stepper"><button class="stepper-btn" data-action-click="changeCurrentTripSetting(\'days\', -1)">\u2212</button><input type="number" min="1" max="90" value="' + trip.days + '" aria-label="\u884C\u7A0B\u5929\u6570" data-action-change="updateCurrentTripSetting(\'days\', this.value)"><button class="stepper-btn" data-action-click="changeCurrentTripSetting(\'days\', 1)">+</button></div></div><div class="trip-info-row"><div class="trip-info-row-label">\u4EBA\u6570</div><div class="stepper"><button class="stepper-btn" data-action-click="changeCurrentTripSetting(\'people\', -1)">\u2212</button><input type="number" min="1" max="20" value="' + trip.people + '" aria-label="\u51FA\u884C\u4EBA\u6570" data-action-change="updateCurrentTripSetting(\'people\', this.value)"><button class="stepper-btn" data-action-click="changeCurrentTripSetting(\'people\', 1)">+</button></div></div><div class="trip-info-actions"><button type="button" class="btn-ghost" data-action-click="saveCurrentTripAsModule()">\u5B58\u4E3A\u5C0F\u5305</button>' + ((trip.sourceModules || []).length ? '<button type="button" class="btn-recompute" data-action-click="resyncCurrentTripFromModules()">\u6309\u5C0F\u5305\u91CD\u65B0\u540C\u6B65</button>' : "") + '<button type="button" class="btn-recompute outline" data-action-click="reapplyTripSmartFill()">\u91CD\u65B0\u667A\u80FD\u586B\u5145</button></div></div><div class="trip-smart-note">' + ((trip.sourceModules || []).length ? "\u6539\u8FC7\u5C0F\u5305\u540E\u53EF\u91CD\u65B0\u540C\u6B65\uFF1B\u624B\u8C03\u6570\u91CF\u4E0E\u52FE\u9009\u4F1A\u5C3D\u91CF\u4FDD\u7559\u3002" : "\u5DF2\u5EFA\u8BAE " + smartCount + " \u9879\u53EF\u53D8\u6570\u91CF\uFF1B\u624B\u6539\u8FC7\u7684\u6570\u91CF\u4F18\u5148\u4FDD\u7559\u3002") + "</div></div></div>";
    switchBox.innerHTML = "";
    if (S.tripMode === "plan") {
      actionBar.innerHTML = (trip.items.length ? '<button type="button" class="start-pack-cta" data-action-click="setTripMode(\'pack\')"><span class="start-pack-copy"><strong>\u5F00\u59CB\u6253\u5305</strong><small>\u5171 ' + trip.items.length + ' \u4EF6\uFF0C\u8FB9\u6536\u62FE\u8FB9\u52FE\u9009</small></span><span class="start-pack-arrow" aria-hidden="true">\u2192</span></button>' : "") + '<div class="trip-edit-actions"><button class="btn-secondary" data-action-click="goSelectModuleForTrip()">\u4ECE\u5C0F\u5305\u6DFB\u52A0</button><button class="btn-secondary" data-action-click="goSelectItemsForTrip()">\u4ECE\u7269\u54C1\u5E93</button><button class="btn-primary" data-action-click="openManualItemModal()">\u624B\u52A8\u6DFB\u52A0</button></div>';
      subBar.innerHTML = "";
      content.innerHTML = trip.items.length ? renderPlanBagGroups(trip) : renderTripEmpty();
    } else {
      actionBar.innerHTML = trip.items.some((item) => item.packed) ? '<button class="btn-secondary" data-action-click="markAllUnpacked()">\u91CD\u7F6E\u6253\u5305\u8FDB\u5EA6</button>' : "";
      subBar.innerHTML = '<div class="pack-view-switch"><button class="pack-view-tab ' + (S.packView === "bags" ? "active" : "") + '" data-action-click="setPackView(\'bags\')">\u6309\u5C0F\u5305</button><button class="pack-view-tab ' + (S.packView === "remaining" ? "active" : "") + '" data-action-click="setPackView(\'remaining\')">\u672A\u6253\u5305</button><button class="pack-view-tab ' + (S.packView === "all" ? "active" : "") + '" data-action-click="setPackView(\'all\')">\u5168\u90E8</button></div>';
      content.innerHTML = renderPackContent(trip);
    }
  }
  function renderTripEmpty() {
    return '<div class="empty-panel"><div class="empty-title">\u8FD9\u5F20\u884C\u7A0B\u5355\u8FD8\u662F\u7A7A\u7684</div><div class="empty-hint">\u52FE\u9009\u5C0F\u5305\uFF0C\u6216\u624B\u52A8\u6DFB\u52A0\u7269\u54C1\u3002</div></div>';
  }
  function renderPlanBagGroups(trip) {
    const bags = trip.bags || DEFAULT_BAGS;
    const groups = bags.map((bag) => ({ bag, items: trip.items.filter((item) => item.bag === bag.id) })).filter((group) => group.items.length);
    const unassigned = trip.items.filter((item) => !bags.some((bag) => bag.id === item.bag));
    if (unassigned.length) {
      groups.push({ bag: { id: "unassigned", icon: "", name: "\u672A\u5206\u914D" }, items: unassigned });
    }
    return groups.map(
      (group) => '<div class="bag-group" id="plan-bag-' + group.bag.id + '"><div class="bag-group-header"><div class="bag-group-label"><span class="bag-icon">' + (group.bag.icon || "") + '</span><span class="bag-name">' + esc(group.bag.name) + '</span></div><span class="bag-progress-count">' + group.items.length + '\u4EF6</span></div><div class="bag-group-items">' + group.items.map(renderTripPlanItemCard).join("") + "</div></div>"
    ).join("");
  }
  function renderTripPlanItemCard(item) {
    return '<div class="list-item-card plan-card' + (item.packed ? " packed" : "") + '" data-trip-item-id="' + item.id + '"><div class="plan-card-name">' + (item.packed ? '<span class="packed-dot">\u2713</span>' : "") + esc(item.name) + (item.qty > 1 ? '<span class="plan-card-qty">\xD7' + item.qty + "</span>" : "") + "</div></div>";
  }
  function renderPackContent(trip) {
    if (!trip.items.length) return renderTripEmpty();
    if (S.packView === "remaining") {
      const remaining = trip.items.filter((item) => !item.packed);
      if (!remaining.length) {
        return '<div class="empty-panel"><div class="empty-title">\u5168\u90E8\u6253\u5305\u5B8C\u6210</div><div class="empty-hint">\u9700\u8981\u5E26\u7684\u4E1C\u897F\u90FD\u51C6\u5907\u597D\u4E86\u3002</div></div>';
      }
      const bags = trip.bags || DEFAULT_BAGS;
      const groups = bags.map((bag) => ({ bag, items: remaining.filter((item) => item.bag === bag.id) })).filter((group) => group.items.length);
      const unassigned = remaining.filter((item) => !bags.some((bag) => bag.id === item.bag));
      if (unassigned.length) {
        groups.push({ bag: { id: "unassigned", icon: "", name: "\u672A\u5206\u914D" }, items: unassigned });
      }
      return groups.map(
        (group) => '<div class="bag-group" id="bag-remain-' + group.bag.id + '"><div class="bag-group-header"><div class="bag-group-label"><span class="bag-icon">' + (group.bag.icon || "") + '</span><span class="bag-name">' + esc(group.bag.name) + '</span></div><span class="bag-progress-count">' + group.items.length + '\u4EF6\u672A\u6253</span></div><div class="bag-group-items">' + group.items.map(renderPackItemCard).join("") + "</div></div>"
      ).join("");
    }
    if (S.packView === "all") {
      const bags = trip.bags || DEFAULT_BAGS;
      const groups = bags.map((bag) => ({ bag, items: trip.items.filter((item) => item.bag === bag.id) })).filter((group) => group.items.length);
      const unassigned = trip.items.filter((item) => !bags.some((bag) => bag.id === item.bag));
      if (unassigned.length) {
        groups.push({ bag: { id: "unassigned", icon: "", name: "\u672A\u5206\u914D" }, items: unassigned });
      }
      return groups.map((group) => {
        const packed = group.items.filter((item) => item.packed).length;
        const collapsed = S.collapsedBags.has(group.bag.id) ? " collapsed" : "";
        return '<div class="bag-group' + collapsed + '" id="bag-' + group.bag.id + '"><button type="button" class="bag-group-header" data-action-click="toggleBagCollapse(\'' + group.bag.id + '\')" aria-expanded="' + !collapsed + '" aria-controls="bag-all-items-' + group.bag.id + '"><div class="bag-group-label"><span class="bag-icon">' + (group.bag.icon || "") + '</span><span class="bag-name">' + esc(group.bag.name) + '</span></div><div style="display:flex;align-items:center;gap:8px"><span class="bag-progress-count">' + packed + "/" + group.items.length + '</span><span class="bag-toggle" aria-hidden="true">\u25BC</span></div></button><div class="bag-group-items" id="bag-all-items-' + group.bag.id + '">' + group.items.map(renderPackItemCard).join("") + "</div></div>";
      }).join("");
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
      return '<div class="bag-group' + collapsed + '" id="bag-' + group.bag.id + '"><button type="button" class="bag-group-header" data-action-click="toggleBagCollapse(\'' + group.bag.id + '\')" aria-expanded="' + !collapsed + '" aria-controls="bag-items-' + group.bag.id + '"><div class="bag-group-label"><span class="bag-icon">' + (group.bag.icon || "") + '</span><span class="bag-name">' + esc(group.bag.name) + '</span></div><div style="display:flex;align-items:center;gap:8px"><span class="bag-progress-count">' + packed + "/" + group.items.length + '</span><span class="bag-toggle" aria-hidden="true">\u25BC</span></div></button><div class="bag-group-items" id="bag-items-' + group.bag.id + '">' + group.items.map(renderPackItemCard).join("") + "</div></div>";
    }).join("");
  }
  function toggleBagCollapse(bagId) {
    var _a;
    if (S.collapsedBags.has(bagId)) {
      S.collapsedBags.delete(bagId);
    } else {
      S.collapsedBags.add(bagId);
    }
    const el = document.getElementById("bag-" + bagId);
    if (el) {
      const collapsed = S.collapsedBags.has(bagId);
      el.classList.toggle("collapsed", collapsed);
      (_a = el.querySelector(".bag-group-header")) == null ? void 0 : _a.setAttribute("aria-expanded", String(!collapsed));
    }
  }
  function toggleTripInfoCard() {
    S.tripInfoCollapsed = !S.tripInfoCollapsed;
    const summaryBox = document.getElementById("listSummary");
    if (!summaryBox) return;
    const card = summaryBox.querySelector(".list-summary-card");
    const toggle = summaryBox.querySelector(".trip-info-toggle-arrow");
    const body = summaryBox.querySelector(".trip-info-body");
    const expanded = summaryBox.querySelector(".trip-summary-expanded");
    if (card) card.classList.toggle("is-collapsed", S.tripInfoCollapsed);
    if (toggle) toggle.classList.toggle("collapsed", S.tripInfoCollapsed);
    if (body) body.classList.toggle("collapsed", S.tripInfoCollapsed);
    if (expanded) expanded.classList.toggle("collapsed", S.tripInfoCollapsed);
  }
  function renderPackItemCard(item) {
    return '<button type="button" class="list-item-card plan-card' + (item.packed ? " packed" : "") + '" data-action-click="togglePackItem(\'' + item.id + '\')" aria-pressed="' + item.packed + '"><span class="pack-check" aria-hidden="true">' + (item.packed ? "\u2713" : "") + '</span><div class="plan-card-name">' + esc(item.name) + (item.qty > 1 ? '<span class="plan-card-qty">\xD7' + item.qty + "</span>" : "") + "</div></button>";
  }
  function setTripMode(mode) {
    S.tripMode = mode;
    if (mode === "pack") {
      S.collapsedBags = /* @__PURE__ */ new Set();
      S.tripInfoCollapsed = true;
    }
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
    S.tripInfoCollapsed = true;
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
    if (!persistCurrentTrip()) return;
    refreshTripSettingViews();
    refreshTripHub();
  }
  function reapplyTripSmartFill() {
    if (!S.currentTrip) return;
    applyTripSmartFill(S.currentTrip, true);
    if (!persistCurrentTrip()) return;
    refreshTripSettingViews();
    refreshTripHub();
    toast("\u5DF2\u91CD\u65B0\u6309\u5929\u6570\u548C\u4EBA\u6570\u667A\u80FD\u586B\u5145");
  }
  function resyncCurrentTripFromModules() {
    if (!S.currentTrip) return;
    if (!(S.currentTrip.sourceModules || []).length) {
      toast("\u5F53\u524D\u884C\u7A0B\u6CA1\u6709\u5173\u8054\u5C0F\u5305\uFF0C\u65E0\u6CD5\u540C\u6B65");
      return;
    }
    if (!confirm("\u5C06\u6309\u5C0F\u5305\u6700\u65B0\u5B9A\u4E49\u91CD\u65B0\u751F\u6210\u672C\u884C\u7A0B\u4E2D\u7684\u5C0F\u5305\u7269\u54C1\u3002\n\n\xB7 \u624B\u52A8\u6DFB\u52A0\u7684\u7269\u54C1\u4F1A\u4FDD\u7559\n\xB7 \u5DF2\u6253\u5305\u52FE\u9009\u3001\u5907\u6CE8\u548C\u6807\u7B7E\u4F1A\u4FDD\u7559\n\xB7 \u4F60\u624B\u52A8\u6539\u8FC7\u7684\u6570\u91CF\u4F1A\u4FDD\u7559\n\n\u7EE7\u7EED\uFF1F")) {
      return;
    }
    const result = resyncTripFromSourceModules(S.currentTrip);
    if (!persistCurrentTrip()) return;
    refreshTripSettingViews();
    refreshTripHub();
    if (!result.changed) {
      toast("\u5DF2\u4E0E\u5C0F\u5305\u5B9A\u4E49\u4E00\u81F4\uFF0C\u65E0\u9700\u53D8\u66F4");
      return;
    }
    const parts = [];
    if (result.added) parts.push("\u65B0\u589E ".concat(result.added, " \u4EF6"));
    if (result.removed) parts.push("\u79FB\u9664 ".concat(result.removed, " \u4EF6"));
    if (result.updated) parts.push("\u66F4\u65B0 ".concat(result.updated, " \u4EF6"));
    if (result.mergedDuplicates) parts.push("\u5408\u5E76\u540C\u540D ".concat(result.mergedDuplicates, " \u4EF6"));
    toast(parts.length ? "\u5DF2\u4ECE\u5C0F\u5305\u540C\u6B65\uFF08".concat(result.moduleCount, " \u4E2A\u5C0F\u5305\uFF09\uFF1A").concat(parts.join("\uFF0C")) : "\u5DF2\u6309\u5C0F\u5305\u91CD\u65B0\u540C\u6B65");
  }
  function removeModuleFromCurrentTrip(source, id) {
    if (!S.currentTrip) return;
    const entity = getModuleEntity(source, id);
    if (!entity) return;
    if (!confirm("\u786E\u5B9A\u4ECE\u5F53\u524D\u884C\u7A0B\u79FB\u9664\u300C".concat(entity.name, "\u300D\uFF1F\n\n\u4EC5\u6765\u81EA\u8FD9\u4E2A\u5C0F\u5305\u7684\u7269\u54C1\u4F1A\u88AB\u79FB\u9664\uFF1B\u82E5\u7269\u54C1\u540C\u65F6\u6765\u81EA\u591A\u4E2A\u5C0F\u5305\uFF0C\u4F1A\u4FDD\u7559\u5E76\u53BB\u6389\u8BE5\u6765\u6E90\u3002"))) {
      return;
    }
    const result = removeModuleFromTrip(S.currentTrip, source, id);
    if (!result.changed) return;
    applyTripSmartFill(S.currentTrip, false);
    if (!persistCurrentTrip()) return;
    renderTripPage();
    refreshTripHub();
    toast(result.removedItems ? "\u5DF2\u79FB\u9664\u300C".concat(result.moduleName, "\u300D\uFF0C\u5E76\u5220\u6389 ").concat(result.removedItems, " \u4EF6\u4EC5\u5C5E\u4E8E\u5B83\u7684\u7269\u54C1") : "\u5DF2\u79FB\u9664\u300C".concat(result.moduleName, "\u300D"));
  }
  function refreshTripListContent() {
    const content = document.getElementById("listContent");
    if (!content || !S.currentTrip) return;
    const trip = S.currentTrip;
    if (S.tripMode === "plan") {
      content.innerHTML = trip.items.length ? renderPlanBagGroups(trip) : renderTripEmpty();
    } else {
      content.innerHTML = renderPackContent(trip);
    }
  }
  function patchTripSummaryMetrics() {
    var _a, _b;
    if (!S.currentTrip) return;
    const summaryBox = document.getElementById("listSummary");
    if (!summaryBox) return;
    const trip = S.currentTrip;
    const progress = getTripProgress(trip);
    const status = getTripStatus(trip);
    const smartCount = trip.items.filter((item) => item.smartRule !== "fixed").length;
    const pctEl = summaryBox.querySelector(".trip-summary-pct");
    if (pctEl) pctEl.textContent = progress.pct + "%";
    const progressEl = summaryBox.querySelector(".saved-list-progress");
    if (progressEl) progressEl.outerHTML = renderProgress(progress);
    const statusChip = summaryBox.querySelector(".status-chip");
    if (statusChip) {
      statusChip.className = "status-chip " + status.key;
      statusChip.textContent = status.label;
    }
    const metaEl = summaryBox.querySelector(".list-summary-meta");
    if (metaEl) metaEl.textContent = formatTripSourceSummary(trip) + " \xB7 " + formatTripMeta(trip);
    const smartNote = summaryBox.querySelector(".trip-smart-note");
    if (smartNote) {
      smartNote.textContent = "\u5DF2\u6309\u5F53\u524D\u8BBE\u7F6E\u5EFA\u8BAE " + smartCount + " \u9879\u53EF\u53D8\u6570\u91CF\u7269\u54C1\uFF1B\u4F60\u624B\u52A8\u6539\u8FC7\u7684\u6570\u91CF\u4F1A\u4F18\u5148\u4FDD\u7559\u3002";
    }
    const rows = summaryBox.querySelectorAll(".trip-info-row");
    const daysInput = (_a = rows[0]) == null ? void 0 : _a.querySelector("input");
    const peopleInput = (_b = rows[1]) == null ? void 0 : _b.querySelector("input");
    if (daysInput && document.activeElement !== daysInput) daysInput.value = trip.days;
    if (peopleInput && document.activeElement !== peopleInput) peopleInput.value = trip.people;
  }
  function refreshTripSettingViews() {
    if (S.currentPage !== "list" || !S.currentTrip) {
      renderTripPage();
      return;
    }
    patchTripSummaryMetrics();
    refreshTripListContent();
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
    banner.classList.toggle("visible", S.currentModuleAction === "add" && !!S.currentTrip);
    if (S.currentModuleAction === "add" && S.currentTrip) {
      const added = (S.currentTrip.sourceModules || []).length;
      banner.textContent = "\u4E3A\u300C".concat(S.currentTrip.name, "\u300D\u6DFB\u52A0\u5C0F\u5305\uFF08\u5DF2\u6DFB\u52A0 ").concat(added, " \u4E2A\uFF0C\u5E26\u300C\u5DF2\u6DFB\u52A0\u300D\u6807\u8BB0\u7684\u65E0\u9700\u91CD\u590D\u52A0\u5165\uFF09");
    } else {
      banner.textContent = "\u7EF4\u62A4\u53EF\u590D\u7528\u5C0F\u5305\uFF1B\u65B0\u5EFA\u884C\u7A0B\u65F6\u52FE\u9009\u7EC4\u5408\u3002";
    }
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
    officialBox.innerHTML = official.length ? official.map((m) => renderOfficialModuleCard(m)).join("") : '<div class="empty-panel"><div class="empty-hint">\u6CA1\u6709\u5339\u914D\u7684\u5C0F\u5305\u3002</div></div>';
    myMeta.textContent = mine.length ? "".concat(mine.length, " \u4E2A") : "";
    myBox.innerHTML = mine.length ? mine.map((m) => renderMyModuleCard(m)).join("") : '<div class="empty-panel"><div class="empty-title">\u8FD8\u6CA1\u6709\u6211\u7684\u5C0F\u5305</div><div class="empty-hint">\u70B9\u53F3\u4E0A\u89D2 + \u65B0\u5EFA\uFF0C\u6216\u4ECE\u5B98\u65B9\u5C0F\u5305\u590D\u5236\u4FEE\u6539\u3002</div></div>';
  }
  function renderModuleFilters() {
    document.getElementById("moduleFilterRow").innerHTML = MODULE_FILTERS.map(
      (filter) => '<button class="filter-chip ' + (S.moduleFilter === filter.id ? "active" : "") + '" data-action-click="setModuleFilter(\'' + filter.id + "')\">" + esc(filter.name) + "</button>"
    ).join("");
  }
  function isModuleOnCurrentTrip(source, id) {
    return S.currentTrip && isModuleOnTrip(S.currentTrip, source, id);
  }
  function renderOfficialModuleCard(module) {
    const preview = resolveOfficialModuleItems(module, getPreviewDays(), getPreviewPeople());
    const added = S.currentModuleAction === "add" && isModuleOnCurrentTrip("official", module.id);
    const tag = module.tags && module.tags[0] || "\u5B98\u65B9";
    return '<div class="kit-card compact recommended' + (added ? " added" : "") + "\" data-action-click=\"openModuleDetail('official','" + module.id + '\')"><div class="kit-card-body"><div class="kit-card-kicker">\u5B98\u65B9 \xB7 ' + esc(tag) + '</div><div class="kit-card-name"><span class="kit-card-emoji" aria-hidden="true">' + esc(module.icon || "\u{1F9F0}") + "</span>" + esc(module.name) + '</div><div class="kit-card-meta">' + preview.length + " \u4EF6\u7269\u54C1</div></div>" + (added ? '<span class="kit-added-badge">\u5DF2\u6DFB\u52A0</span>' : '<span class="kit-card-chevron">\u203A</span>') + "</div>";
  }
  function renderMyModuleCard(module) {
    const preview = resolveCustomModuleItems(module, getPreviewDays(), getPreviewPeople());
    const added = S.currentModuleAction === "add" && isModuleOnCurrentTrip("custom", module.id);
    return '<div class="kit-card compact' + (added ? " added" : "") + "\" data-action-click=\"openModuleDetail('custom','" + module.id + '\')"><div class="kit-card-body"><div class="kit-card-kicker">\u6211\u7684\u5C0F\u5305</div><div class="kit-card-name"><span class="kit-card-emoji" aria-hidden="true">' + esc(module.icon || "\u{1F9F0}") + "</span>" + esc(module.name) + '</div><div class="kit-card-meta">' + preview.length + " \u4EF6\u7269\u54C1</div></div>" + (added ? '<span class="kit-added-badge">\u5DF2\u6DFB\u52A0</span>' : '<span class="kit-card-chevron">\u203A</span>') + "</div>";
  }
  function openModuleDetail(source, id) {
    S.currentModule = { source, id };
    renderModuleDetailModal(source, id);
    showModal("moduleDetailModal");
  }
  function renderModuleDetailModal(source, id) {
    const entity = getModuleEntity(source, id);
    if (!entity) return;
    const moduleItems = (entity.items || []).map(normalizeModuleItem);
    const smartCount = moduleItems.filter((item) => item.smartRule !== "fixed").length;
    document.getElementById("moduleDetailTitle").textContent = entity.name;
    document.getElementById("moduleDetailSummary").innerHTML = '<div class="module-detail-badges"><span class="mini-badge">' + (source === "official" ? "\u5B98\u65B9\u5C0F\u5305" : "\u6211\u7684\u5C0F\u5305") + '</span><span class="mini-badge soft">' + moduleItems.length + " \u4EF6</span>" + (smartCount ? '<span class="mini-badge soft">' + smartCount + " \u9879\u53EF\u53D8\u6570\u91CF</span>" : "") + '</div><p class="module-detail-desc">' + esc(entity.desc || "\u53EF\u590D\u7528\u7684\u6253\u5305\u6A21\u5757\uFF0C\u521B\u5EFA\u884C\u7A0B\u65F6\u53EF\u4E00\u952E\u52A0\u5165\u3002") + "</p>";
    document.getElementById("moduleDetailItems").innerHTML = moduleItems.length ? moduleItems.map((item, index) => renderModuleDetailItemRow(item, index)).join("") : '<div class="empty-panel"><div class="empty-hint">\u8FD9\u4E2A\u5305\u8FD8\u662F\u7A7A\u7684\uFF0C\u5728\u4E0B\u65B9\u76F4\u63A5\u8F93\u5165\u7269\u54C1\u540D\u79F0\u3002</div></div>';
    document.getElementById("moduleEditBtn").style.display = "inline-flex";
    document.getElementById("moduleEditBtn").textContent = "\u8C03\u6574\u6570\u91CF";
    const quickAddInput = document.getElementById("moduleQuickAddInput");
    if (quickAddInput) quickAddInput.value = "";
    const deleteBtn = document.getElementById("moduleDeleteBtn");
    deleteBtn.style.display = "inline-flex";
    deleteBtn.textContent = source === "official" ? "\u5220\u9664\u5B98\u65B9\u5C0F\u5305" : "\u5220\u9664\u5C0F\u5305";
    const alreadyOnTrip = S.currentModuleAction === "add" && S.currentTrip && isModuleOnTrip(S.currentTrip, source, id);
    const primaryBtn = document.getElementById("modulePrimaryBtn");
    primaryBtn.textContent = alreadyOnTrip ? "\u5DF2\u5728\u5F53\u524D\u884C\u7A0B" : S.currentModuleAction === "add" && S.currentTrip ? "\u52A0\u5165\u5F53\u524D\u884C\u7A0B" : "\u7528\u4E8E\u65B0\u884C\u7A0B";
    primaryBtn.disabled = alreadyOnTrip;
    primaryBtn.classList.toggle("disabled", alreadyOnTrip);
  }
  function deleteCurrentModuleFromDetail() {
    if (!S.currentModule) return;
    const { source, id } = S.currentModule;
    const entity = getModuleEntity(source, id);
    if (!entity) return;
    const recoveryHint = source === "official" ? "\n\n\u4E4B\u540E\u53EF\u5728\u300C\u6211\u7684 \u2192 \u6062\u590D\u5B98\u65B9\u5C0F\u5305\u300D\u4E2D\u627E\u56DE\u3002" : "";
    if (!confirm("\u786E\u5B9A\u5220\u9664\u300C".concat(entity.name, "\u300D\u5417\uFF1F").concat(recoveryHint))) return;
    if (source === "official") {
      if (!markOfficialModuleDeleted(id)) {
        toast("\u5220\u9664\u5931\u8D25\uFF0C\u8BF7\u91CD\u8BD5");
        return;
      }
    } else if (!deleteRecord(id, { silent: true })) {
      return;
    }
    closeModal("moduleDetailModal");
    S.currentModule = null;
    renderModuleLibrary();
    refreshTripHub();
    toast(source === "official" ? "\u5DF2\u5220\u9664\uFF0C\u53EF\u5728\u300C\u6211\u7684\u300D\u4E2D\u6062\u590D" : "\u5DF2\u5220\u9664\u5C0F\u5305");
  }
  function renderModuleDetailItemRow(item, index) {
    const cat = catInfo(item.category);
    return '<div class="module-detail-row"><div class="module-detail-main"><span class="module-detail-name">' + esc(item.name) + '</span><span class="module-detail-sub">' + esc(cat.name) + (item.smartRule !== "fixed" ? " \xB7 \u667A\u80FD\u6570\u91CF" : "") + '</span></div><span class="module-detail-qty">\xD7' + item.defaultQty + '</span><button type="button" class="module-item-remove" data-remove-detail-item="' + index + '" aria-label="\u4ECE\u5C0F\u5305\u79FB\u9664 ' + esc(item.name) + '">\xD7</button></div>';
  }
  function quickAddItemToCurrentModule() {
    if (!S.currentModule) return;
    const input = document.getElementById("moduleQuickAddInput");
    const name = input == null ? void 0 : input.value.trim();
    if (!name) {
      toast("\u8BF7\u8F93\u5165\u7269\u54C1\u540D\u79F0");
      input == null ? void 0 : input.focus();
      return;
    }
    const { source, id } = S.currentModule;
    const entity = getModuleEntity(source, id);
    if (!entity) return;
    if ((entity.items || []).some((item) => item.name.trim().toLowerCase() === name.toLowerCase())) {
      toast("\u8FD9\u4E2A\u7269\u54C1\u5DF2\u5728\u5305\u5185");
      input == null ? void 0 : input.select();
      return;
    }
    const moduleItem = normalizeModuleItem({ name });
    const saved = saveModuleEntityItems(source, id, [...entity.items || [], moduleItem]);
    if (!saved) {
      toast("\u6DFB\u52A0\u5931\u8D25\uFF0C\u8BF7\u91CD\u8BD5");
      return;
    }
    upsertLibraryFromModuleItem(moduleItem);
    renderModuleDetailModal(source, id);
    renderModuleLibrary();
    toast("\u5DF2\u52A0\u5165\u300C" + entity.name + "\u300D");
    setTimeout(() => {
      var _a;
      return (_a = document.getElementById("moduleQuickAddInput")) == null ? void 0 : _a.focus();
    }, 0);
  }
  function removeItemFromCurrentModule(index) {
    if (!S.currentModule) return;
    const { source, id } = S.currentModule;
    const entity = getModuleEntity(source, id);
    if (!entity || index < 0 || index >= (entity.items || []).length) return;
    const items = [...entity.items];
    const [removed] = items.splice(index, 1);
    const saved = saveModuleEntityItems(source, id, items);
    if (!saved) {
      toast("\u79FB\u9664\u5931\u8D25\uFF0C\u8BF7\u91CD\u8BD5");
      return;
    }
    renderModuleDetailModal(source, id);
    renderModuleLibrary();
    toast("\u5DF2\u79FB\u9664\u300C" + removed.name + "\u300D");
  }
  function tripOrModuleItemToModuleItem(item) {
    return normalizeModuleItem({
      id: String(item.id || "").startsWith("module-item-") ? item.id : "module-item-" + gid(),
      name: item.name,
      category: item.category,
      bag: item.bag,
      defaultQty: item.defaultQty || item.smartBaseQty || item.qty || 1,
      smartRule: item.smartRule,
      smartConfig: item.smartConfig
    });
  }
  function syncModuleBuilderSelectionFromItems() {
    const library = getItemLibrary();
    S.moduleBuilderSelection = new Set(
      S.moduleBuilderItems.map((item) => {
        var _a;
        return (_a = library.find((asset) => asset.name === item.name)) == null ? void 0 : _a.id;
      }).filter(Boolean)
    );
  }
  function upsertLibraryFromModuleItem(moduleItem) {
    const library = getItemLibrary();
    const idx = library.findIndex((entry) => entry.name === moduleItem.name);
    const next = normalizeLibraryItem({
      ...idx >= 0 ? library[idx] : {},
      id: idx >= 0 ? library[idx].id : "asset-" + gid(),
      name: moduleItem.name,
      category: moduleItem.category,
      defaultQty: moduleItem.defaultQty,
      bag: moduleItem.bag,
      smartRule: moduleItem.smartRule,
      smartConfig: moduleItem.smartConfig,
      source: idx >= 0 ? library[idx].source : "user"
    });
    if (idx >= 0) library[idx] = next;
    else library.unshift(next);
    saveItemLibrary(library);
  }
  function saveModuleEntityItems(source, moduleId, items) {
    if (source === "official") {
      const modules = getOfficialModules();
      const idx = modules.findIndex((module2) => module2.id === moduleId);
      if (idx < 0) return null;
      modules[idx] = normalizeOfficialModule({
        ...modules[idx],
        items: items.map(normalizeModuleItem)
      });
      saveOfficialModules(modules);
      return modules[idx];
    }
    const module = getMyModules().find((entry) => entry.id === moduleId);
    if (!module) return null;
    const next = normalizeModuleRecord({
      ...module,
      items: items.map(normalizeModuleItem),
      updatedAt: (/* @__PURE__ */ new Date()).toISOString()
    });
    saveRecord(next);
    return next;
  }
  function findModuleItemContext(itemId) {
    const ctx = S.moduleItemEditContext;
    if (!ctx) return null;
    if (ctx.mode === "builder") {
      const item2 = S.moduleBuilderItems.find((entry) => entry.id === itemId);
      return item2 ? { item: item2, items: S.moduleBuilderItems } : null;
    }
    const entity = getModuleEntity(ctx.source, ctx.moduleId);
    if (!entity) return null;
    const item = (entity.items || []).find((entry) => entry.id === itemId);
    return item ? { item, entity } : null;
  }
  function openModuleItemModal(mode, source, moduleId, itemId) {
    var _a;
    const ctx = { mode, source: source || null, moduleId: moduleId || null, itemId };
    S.moduleItemEditContext = ctx;
    let item = null;
    if (mode === "builder") {
      item = S.moduleBuilderItems.find((entry) => entry.id === itemId);
    } else {
      const entity = getModuleEntity(source, moduleId);
      item = (_a = entity == null ? void 0 : entity.items) == null ? void 0 : _a.find((entry) => entry.id === itemId);
    }
    if (!item) return;
    item = normalizeModuleItem(item);
    document.getElementById("moduleItemModalTitle").textContent = item.name;
    document.getElementById("moduleItemQty").value = item.defaultQty;
    fillCatSelect("moduleItemCategory", item.category);
    fillBagSelect("moduleItemBag", item.bag, DEFAULT_BAGS);
    document.getElementById("moduleItemDeleteBtn").style.display = "inline-flex";
    updateModuleItemSmartHint();
    showModal("moduleItemModal");
  }
  function updateModuleItemSmartHint() {
    var _a, _b, _c;
    const hint = document.getElementById("moduleItemSmartHint");
    const ctx = S.moduleItemEditContext;
    if (!hint || !ctx) return;
    const found = findModuleItemContext(ctx.itemId);
    if (!(found == null ? void 0 : found.item)) return;
    const category = ((_a = document.getElementById("moduleItemCategory")) == null ? void 0 : _a.value) || found.item.category;
    const qty = Math.max(1, parseInt((_b = document.getElementById("moduleItemQty")) == null ? void 0 : _b.value) || 1);
    const { smartRule, smartConfig } = resolveItemSmartPlan(found.item.name, category, found.item.smartRule, found.item.smartConfig);
    const previewContext = ctx.mode === "module" && ctx.moduleId ? { sourceModules: [{ source: ctx.source, id: ctx.moduleId, name: ((_c = getModuleEntity(ctx.source, ctx.moduleId)) == null ? void 0 : _c.name) || "" }] } : null;
    const previewQty = smartRule === "fixed" ? qty : computeSmartQty(qty, smartRule, getPreviewDays(), getPreviewPeople(), smartConfig, previewContext);
    hint.textContent = smartRule === "fixed" ? "\u9ED8\u8BA4\u56FA\u5B9A\u6570\u91CF \xD7".concat(qty, "\u3002\u4FDD\u5B58\u540E\uFF0C\u4E4B\u540E\u7528\u8FD9\u4E2A\u5305\u521B\u5EFA\u884C\u7A0B\u90FD\u4F1A\u6309\u6B64\u9ED8\u8BA4\u91CF\u751F\u6210\u3002") : "\u9ED8\u8BA4\u57FA\u7840\u91CF \xD7".concat(qty, "\uFF0C\u6309\u300C").concat(smartRuleLabel(smartRule, smartConfig), "\u300D\u667A\u80FD\u5EFA\u8BAE\uFF1B\u5F53\u524D\u9884\u89C8\u7EA6 \xD7").concat(previewQty, "\u3002\u4FDD\u5B58\u540E\u65B0\u5EFA\u884C\u7A0B\u90FD\u4F1A\u6CBF\u7528\u8FD9\u91CC\u7684\u9ED8\u8BA4\u8BBE\u7F6E\u3002");
  }
  function saveModuleItemEdit() {
    var _a, _b;
    const ctx = S.moduleItemEditContext;
    if (!ctx) return;
    const found = findModuleItemContext(ctx.itemId);
    if (!(found == null ? void 0 : found.item)) return;
    const nextItem = normalizeModuleItem({
      ...found.item,
      defaultQty: Math.max(1, parseInt(document.getElementById("moduleItemQty").value) || 1),
      category: document.getElementById("moduleItemCategory").value,
      bag: document.getElementById("moduleItemBag").value
    });
    const { smartRule, smartConfig } = resolveItemSmartPlan(nextItem.name, nextItem.category, found.item.smartRule, found.item.smartConfig);
    nextItem.smartRule = smartRule;
    nextItem.smartConfig = smartConfig;
    if (ctx.mode === "builder") {
      const idx = S.moduleBuilderItems.findIndex((entry) => entry.id === ctx.itemId);
      if (idx >= 0) S.moduleBuilderItems[idx] = nextItem;
      upsertLibraryFromModuleItem(nextItem);
      syncModuleBuilderSelectionFromItems();
      closeModal("moduleItemModal");
      renderModuleBuilderSelectedItems();
      renderModuleBuilderItems();
      renderItemLibrary();
      toast("\u5C0F\u5305\u7269\u54C1\u5DF2\u66F4\u65B0");
      return;
    }
    const entity = found.entity;
    const items = (entity.items || []).map((item) => item.id === ctx.itemId ? nextItem : normalizeModuleItem(item));
    saveModuleEntityItems(ctx.source, ctx.moduleId, items);
    upsertLibraryFromModuleItem(nextItem);
    closeModal("moduleItemModal");
    if (((_a = S.currentModule) == null ? void 0 : _a.source) === ctx.source && ((_b = S.currentModule) == null ? void 0 : _b.id) === ctx.moduleId) {
      renderModuleDetailModal(ctx.source, ctx.moduleId);
    }
    renderModuleLibrary();
    toast("\u5DF2\u4FDD\u5B58\u5230\u5C0F\u5305\u91CC\uFF0C\u4E4B\u540E\u65B0\u5EFA\u884C\u7A0B\u90FD\u4F1A\u6309\u6B64\u9ED8\u8BA4\u8BBE\u7F6E\u751F\u6210");
  }
  function deleteModuleItemEdit() {
    var _a, _b, _c;
    const ctx = S.moduleItemEditContext;
    if (!ctx) return;
    if (ctx.mode === "builder") {
      const target = S.moduleBuilderItems.find((entry) => entry.id === ctx.itemId);
      S.moduleBuilderItems = S.moduleBuilderItems.filter((entry) => entry.id !== ctx.itemId);
      if (target) {
        const library = getItemLibrary();
        const assetId = (_a = library.find((asset) => asset.name === target.name)) == null ? void 0 : _a.id;
        if (assetId) S.moduleBuilderSelection.delete(assetId);
      }
      closeModal("moduleItemModal");
      renderModuleBuilderSelectedItems();
      renderModuleBuilderItems();
      toast("\u5DF2\u4ECE\u5C0F\u5305\u4E2D\u79FB\u9664");
      return;
    }
    const entity = getModuleEntity(ctx.source, ctx.moduleId);
    if (!entity) return;
    const items = (entity.items || []).filter((item) => item.id !== ctx.itemId);
    saveModuleEntityItems(ctx.source, ctx.moduleId, items);
    closeModal("moduleItemModal");
    if (((_b = S.currentModule) == null ? void 0 : _b.source) === ctx.source && ((_c = S.currentModule) == null ? void 0 : _c.id) === ctx.moduleId) {
      renderModuleDetailModal(ctx.source, ctx.moduleId);
    }
    renderModuleLibrary();
    toast("\u5DF2\u4ECE\u5C0F\u5305\u4E2D\u79FB\u9664");
  }
  function useCurrentModule() {
    if (!S.currentModule) return;
    const { source, id } = S.currentModule;
    if (S.currentModuleAction === "add" && S.currentTrip) {
      addModuleToCurrentTrip(source, id);
      renderModuleDetailModal(source, id);
      renderModuleLibrary();
      return;
    }
    closeModal("moduleDetailModal");
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
  function updateILibrarySearch(value) {
    updateItemSearch(value);
  }
  function setItemFilter(filterId) {
    S.itemFilter = filterId;
    renderItemLibrary();
  }
  function renderItemLibrary() {
    var _a;
    const banner = document.getElementById("itemContextBanner");
    const gridBox = document.getElementById("ilibraryGrid") || document.getElementById("itemLibraryGrid");
    const searchInput = document.getElementById("ilibrarySearchInput") || document.getElementById("itemSearchInput");
    const summaryBox = document.getElementById("ilibrarySummary") || document.getElementById("itemLibrarySummary");
    const allItems = getItemLibrary();
    const currentTripItemKeys = new Set((((_a = S.currentTrip) == null ? void 0 : _a.items) || []).map(
      (item) => String(item.name || "").trim() + "::" + String(item.category || "")
    ));
    const isOnCurrentTrip = (item) => currentTripItemKeys.has(String(item.name || "").trim() + "::" + String(item.category || ""));
    if (banner) {
      banner.classList.toggle("visible", !!S.currentTrip);
      banner.textContent = S.currentTrip ? "\u6B63\u5728\u4E3A\u300C".concat(S.currentTrip.name, "\u300D\u6DFB\u52A0\u7269\u54C1\uFF1B\u5DF2\u5728\u6E05\u5355\u4E2D\u7684\u7269\u54C1\u4F1A\u660E\u786E\u6807\u8BB0\u3002") : "";
    }
    if (searchInput) searchInput.value = S.itemSearch;
    renderItemFilters();
    const keyword = S.itemSearch.toLowerCase();
    const joinedCount = S.currentTrip ? allItems.filter(isOnCurrentTrip).length : 0;
    const items = allItems.filter((item) => {
      const filterMatch = S.itemFilter === "all" || item.category === S.itemFilter;
      const searchMatch = !keyword || item.name.toLowerCase().includes(keyword);
      return filterMatch && searchMatch;
    }).sort((a, b) => Number(isOnCurrentTrip(a)) - Number(isOnCurrentTrip(b)));
    const customCount = allItems.filter((item) => item.source === "user").length;
    if (summaryBox) {
      summaryBox.innerHTML = "<span>\u5171 " + allItems.length + " \u4EF6</span>" + (customCount ? '<span class="qs-dot">\xB7</span><span>\u81EA\u5EFA ' + customCount + "</span>" : "") + (S.currentTrip ? '<span class="qs-dot">\xB7</span><span>\u53EF\u6DFB\u52A0 ' + (allItems.length - joinedCount) + '</span><span class="qs-dot">\xB7</span><span class="summary-joined">\u5DF2\u52A0\u5165 ' + joinedCount + "</span>" : "");
    }
    if (!gridBox) return;
    gridBox.innerHTML = items.length ? items.map((item) => renderLibraryCard(item, isOnCurrentTrip(item))).join("") : '<div class="empty-panel full-span"><div class="empty-hint">\u6CA1\u6709\u5339\u914D\u7684\u7269\u54C1\u3002</div></div>';
  }
  function renderItemFilters() {
    const options = [{ id: "all", name: "\u5168\u90E8" }, ...DEFAULT_CATEGORIES.map((cat) => ({ id: cat.id, name: cat.name }))];
    const filterRow = document.getElementById("ilibraryFilterRow") || document.getElementById("itemFilterRow");
    if (!filterRow) return;
    filterRow.innerHTML = options.map(
      (option) => '<button class="filter-chip ' + (S.itemFilter === option.id ? "active" : "") + '" data-action-click="setItemFilter(\'' + option.id + "')\">" + esc(option.name) + "</button>"
    ).join("");
  }
  function renderLibraryCard(item, alreadyAdded = false) {
    const cat = catInfo(item.category);
    const addButton = S.currentTrip ? alreadyAdded ? '<span class="library-action added">\u5DF2\u52A0\u5165 \u2713</span>' : '<button class="library-action primary" data-action-click="event.stopPropagation();addLibraryItemToCurrentTrip(\'' + item.id + "')\">\u52A0\u5165</button>" : "";
    const cardAction = S.currentTrip ? alreadyAdded ? "" : "addLibraryItemToCurrentTrip('" + item.id + "')" : "openLibraryItemModal('" + item.id + "')";
    return '<div class="library-card ' + (item.source === "user" ? "user-built " : "") + (alreadyAdded ? "on-trip" : "") + '"' + (cardAction ? ' data-action-click="' + cardAction + '" role="button" tabindex="0"' : "") + '><div class="library-card-body"><div class="library-card-top"><span class="item-pill ' + cat.cssClass + '">' + esc(cat.name) + "</span>" + (item.source === "user" ? '<span class="mini-badge soft">\u81EA\u5EFA</span>' : "") + '</div><div class="library-name">' + esc(item.name) + '</div><div class="library-meta">' + esc(bagName(item.bag, DEFAULT_BAGS)) + " \xB7 \u9ED8\u8BA4 \xD7" + item.defaultQty + "</div></div>" + (addButton ? '<div class="library-actions">' + addButton + "</div>" : "") + "</div>";
  }
  function parseBulkNames(text) {
    return uniqueStrings(
      String(text || "").split(/[\s,，、；;]+/).map((name) => name.trim()).filter(Boolean)
    );
  }
  function collectDraftNames(singleInputId, bulkInputId = null) {
    var _a, _b;
    const single = ((_a = document.getElementById(singleInputId)) == null ? void 0 : _a.value.trim()) || "";
    const bulk = bulkInputId ? parseBulkNames(((_b = document.getElementById(bulkInputId)) == null ? void 0 : _b.value) || "") : [];
    return uniqueStrings([single, ...bulk].filter(Boolean));
  }
  function buildLibraryItemDraft(name, qty, category, bag, existing = null) {
    const { smartRule, smartConfig } = resolveItemSmartPlan(name, category, existing == null ? void 0 : existing.smartRule, existing == null ? void 0 : existing.smartConfig);
    return normalizeLibraryItem({
      ...existing,
      id: (existing == null ? void 0 : existing.id) || "asset-" + gid(),
      name,
      defaultQty: qty,
      category,
      bag,
      smartRule,
      smartConfig,
      source: (existing == null ? void 0 : existing.source) || "user"
    });
  }
  function openCreateTripModal(initialModuleKeys = []) {
    var _a, _b, _c;
    S.tripBuilderSelection = new Set(initialModuleKeys);
    ensureTripBuilderBabyBaseSelection();
    document.getElementById("createTripName").value = initialModuleKeys.length === 1 ? ((_a = getModuleEntity(...splitModuleKey(initialModuleKeys[0]))) == null ? void 0 : _a.name) + " \u884C\u7A0B" : "\u65B0\u7684\u884C\u7A0B\u5355";
    document.getElementById("tripDays").value = ((_b = S.currentTrip) == null ? void 0 : _b.days) || 2;
    document.getElementById("tripPeople").value = ((_c = S.currentTrip) == null ? void 0 : _c.people) || 1;
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
      const previewNames = preview.slice(0, 3).map((item) => item.name).join("\u3001");
      const isScenario = module.role === "scenario" || (module.tags || []).includes("\u573A\u666F\u8865\u5145");
      const typeLabel = module.group === "baby" ? isScenario ? "\u573A\u666F\u8865\u5145" : "\u5B9D\u5B9D\u5C0F\u5305" : source === "official" ? isScenario ? "\u573A\u666F\u8865\u5145" : "\u5B98\u65B9\u5C0F\u5305" : "\u6211\u7684\u5C0F\u5305";
      const stateLabel = locked ? "\u9ED8\u8BA4\u5F00\u542F" : selected ? "\u5DF2\u52FE\u9009" : "\u70B9\u9009";
      return '<div class="picker-item module-choice ' + (selected ? "selected" : "") + '" data-action-click="toggleTripBuilderModule(\'' + source + "','" + module.id + '\')"><div class="picker-item-top"><span class="item-pill">' + esc(typeLabel) + '</span><span class="mini-badge picker-tile-state">' + stateLabel + '</span></div><div class="picker-item-name">' + esc(module.icon || "\u{1F9F0}") + " " + esc(module.name) + '</div><div class="picker-item-meta">' + preview.length + " \u4EF6\u7269\u54C1 \xB7 " + smartCount + " \u9879\u4F1A\u53D8\u52A8</div>" + (previewNames ? '<div class="picker-item-preview">' + esc(previewNames) + (preview.length > 3 ? "\u2026" : "") + "</div>" : "") + "</div>";
    }).join("") : '<div class="empty-panel full-span"><div class="empty-title">\u8FD8\u6CA1\u6709\u53EF\u9009\u5C0F\u5305</div><div class="empty-hint">\u5148\u53BB\u521B\u5EFA\u4E00\u4E2A\u5427\u3002</div></div>';
  }
  function toggleTripBuilderModule(source, id) {
    const key = getModuleKey(source, id);
    const module = getModuleEntity(source, id);
    if (isBabyBaseModuleEntity(module) && tripBuilderHasBabyAddonSelection()) {
      toast("\u5B9D\u5B9D\u573A\u666F\u4F1A\u9ED8\u8BA4\u5E26\u4E0A\u65E5\u5E38\u51FA\u95E8\u5305");
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
    document.getElementById("tripBuilderCount").textContent = "\u5DF2\u9009 ".concat(modules.length, " \u4E2A\u5C0F\u5305");
    document.getElementById("tripBuilderSummary").innerHTML = modules.length ? "\u5DF2\u9009 <strong>".concat(modules.length, "</strong> \u4E2A\u5C0F\u5305\uFF0C\u9884\u8BA1\u751F\u6210 <strong>").concat(previewTrip.items.length, "</strong> \u4EF6\u7269\u54C1\uFF0C\u5176\u4E2D <strong>").concat(smartCount, "</strong> \u9879\u4F1A\u6309 ").concat(days, " \u5929 / ").concat(people, " \u4EBA\u81EA\u52A8\u5EFA\u8BAE\u6570\u91CF\u3002").concat(hasBabyAddon ? " \u5DF2\u81EA\u52A8\u5E26\u4E0A <strong>\u5B9D\u5B9D\u57FA\u7840\u5305</strong>\uFF0C\u5E76\u4F1A\u7ED9\u5C3F\u4E0D\u6E7F\u3001\u5907\u7528\u8863\u88E4\u8FD9\u7C7B\u7269\u54C1\u53E0\u52A0\u573A\u666F\u7CFB\u6570\u3002" : "") : "\u4F60\u4E5F\u53EF\u4EE5\u5148\u521B\u5EFA\u4E00\u5F20\u7A7A\u767D\u884C\u7A0B\uFF0C\u518D\u6162\u6162\u4ECE\u5C0F\u5305\u5E93\u6216\u7269\u54C1\u5E93\u5F80\u91CC\u52A0\u3002";
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
    if (!saveRecord(trip)) {
      toast("\u4FDD\u5B58\u5931\u8D25\uFF0C\u8BF7\u68C0\u67E5\u8BBE\u5907\u5B58\u50A8\u7A7A\u95F4\u540E\u91CD\u8BD5");
      return;
    }
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
    if (isModuleOnTrip(S.currentTrip, source, id)) {
      toast("\u8FD9\u4E2A\u5C0F\u5305\u5DF2\u5728\u5F53\u524D\u884C\u7A0B\u4E2D");
      return;
    }
    const entity = getModuleEntity(source, id);
    if (!entity) return;
    if (isBabyModuleEntity(entity) && !isBabyBaseModuleEntity(entity)) {
      ensureBabyBaseModuleOnTripRecord(S.currentTrip);
    }
    const items = source === "official" ? resolveOfficialModuleItems(entity, S.currentTrip.days, S.currentTrip.people) : resolveCustomModuleItems(entity, S.currentTrip.days, S.currentTrip.people);
    mergeItemsIntoCurrentTrip(items, "module", { source, id: entity.id, name: entity.name });
    if (S.currentPage === "kits") renderModuleLibrary();
    toast(isBabyModuleEntity(entity) && !isBabyBaseModuleEntity(entity) ? "\u5DF2\u52A0\u5165\u63D2\u4EF6\u5305\uFF0C\u5E76\u81EA\u52A8\u8865\u4E0A\u5B9D\u5B9D\u57FA\u7840\u5305" : "\u5DF2\u628A\u5C0F\u5305\u52A0\u5165\u5F53\u524D\u884C\u7A0B");
  }
  function addLibraryItemToCurrentTrip(itemId) {
    if (!S.currentTrip) {
      toast("\u8BF7\u5148\u6253\u5F00\u4E00\u5F20\u884C\u7A0B");
      return;
    }
    const asset = getItemLibrary().find((item) => item.id === itemId);
    if (!asset) return;
    mergeItemsIntoCurrentTrip([createTripItemFromAsset(asset, S.currentTrip.days, S.currentTrip.people)], "manual");
    toast("\u5DF2\u52A0\u5165\u5F53\u524D\u884C\u7A0B");
  }
  function mergeItemsIntoCurrentTrip(items, strategy = "manual", sourceModule = null) {
    if (!S.currentTrip) return;
    mergeTripItems(S.currentTrip.items, items, S.currentTrip, strategy);
    if (sourceModule) upsertTripSourceModule(S.currentTrip, sourceModule);
    if (strategy === "module") applyTripSmartFill(S.currentTrip, false);
    if (!persistCurrentTrip()) return;
    renderTripPage();
    renderItemLibrary();
    refreshTripHub();
  }
  function openLibraryItemModal(itemId = null) {
    S.libraryModalEditId = itemId;
    const item = itemId ? getItemLibrary().find((entry) => entry.id === itemId) : null;
    fillCatSelect("libraryItemCategory", (item == null ? void 0 : item.category) || "misc");
    fillBagSelect("libraryItemBag", (item == null ? void 0 : item.bag) || (CATEGORY_BAG_MAP[(item == null ? void 0 : item.category) || "misc"] || "bag-misc"), DEFAULT_BAGS);
    document.getElementById("libraryItemModalTitle").textContent = item ? "\u7F16\u8F91\u7269\u54C1" : "\u65B0\u589E\u7269\u54C1";
    document.getElementById("libraryItemName").value = (item == null ? void 0 : item.name) || "";
    document.getElementById("libraryItemQty").value = (item == null ? void 0 : item.defaultQty) || 1;
    document.getElementById("libraryItemBulkInput").value = "";
    document.getElementById("libraryBulkPanel").style.display = item ? "none" : "block";
    document.getElementById("libraryDeleteBtn").style.visibility = (item == null ? void 0 : item.source) === "user" ? "visible" : "hidden";
    S.currentEditingTags = Array.isArray(item == null ? void 0 : item.tags) ? [...item.tags] : [];
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
      (tag, index) => '<span class="item-tag-pill">' + esc(tag) + '<button type="button" class="item-tag-remove" data-tag-index="' + index + '" aria-label="\u79FB\u9664\u6807\u7B7E ' + esc(tag) + '">\u2715</button></span>'
    ).join("");
  }
  function addLibraryItemTag() {
    const input = document.getElementById("libraryItemTagInput");
    const val = input == null ? void 0 : input.value.trim();
    if (!val) return;
    if (S.currentEditingTags.includes(val)) {
      toast("\u8BE5\u6807\u7B7E\u5DF2\u5B58\u5728");
      return;
    }
    S.currentEditingTags.push(val);
    renderLibraryItemTags();
    if (input) input.value = "";
  }
  function toggleLibraryItemTagSection() {
    toggleTagSection("libraryItemTagSection", "libraryItemTagToggle");
  }
  function toggleTagSection(sectionId, toggleId) {
    const section = document.getElementById(sectionId);
    const toggle = document.getElementById(toggleId);
    if (!section) return;
    const expanded = section.classList.toggle("expanded");
    if (toggle) toggle.textContent = expanded ? "\u6536\u8D77\u6807\u7B7E" : "+ \u6DFB\u52A0\u6807\u7B7E";
  }
  function removeLibraryItemTagByIndex(index) {
    if (!Number.isFinite(index) || index < 0 || index >= S.currentEditingTags.length) return;
    S.currentEditingTags = S.currentEditingTags.filter((_, i) => i !== index);
    renderLibraryItemTags();
  }
  function updateLibrarySmartHint() {
    var _a, _b;
    const hint = document.getElementById("libraryItemSmartHint");
    if (!hint) return;
    const names = S.libraryModalEditId ? collectDraftNames("libraryItemName") : collectDraftNames("libraryItemName", "libraryItemBulkInput");
    const category = ((_a = document.getElementById("libraryItemCategory")) == null ? void 0 : _a.value) || "misc";
    const qty = Math.max(1, parseInt((_b = document.getElementById("libraryItemQty")) == null ? void 0 : _b.value) || 1);
    if (!names.length) {
      hint.textContent = "\u8863\u7269\u7C7B\u548C\u5B9D\u5B9D\u9AD8\u9891\u6D88\u8017\u7269\u54C1\u4F1A\u9ED8\u8BA4\u53C2\u4E0E\u667A\u80FD\u586B\u5145\uFF1B\u6279\u91CF\u6DFB\u52A0\u65F6\u4F1A\u9ED8\u8BA4\u4F7F\u7528\u540C\u4E00\u5206\u7C7B\u548C\u9ED8\u8BA4\u6570\u91CF\u3002";
      return;
    }
    if (!S.libraryModalEditId && names.length > 1) {
      hint.textContent = "\u5C06\u6279\u91CF\u4FDD\u5B58 ".concat(names.length, " \u4EF6\u7269\u54C1\uFF0C\u7EDF\u4E00\u4F7F\u7528\u5F53\u524D\u5206\u7C7B\u3001\u9ED8\u8BA4\u6570\u91CF\u548C\u5F52\u5C5E\u5C0F\u5305\uFF1B\u4FDD\u5B58\u540E\u4E5F\u53EF\u4EE5\u9010\u4E2A\u518D\u4FEE\u6539\u3002");
      return;
    }
    const name = names[0];
    const { smartRule, smartConfig } = resolveItemSmartPlan(name, category);
    hint.textContent = smartRule === "fixed" ? "\u5F53\u524D\u4F1A\u6309\u56FA\u5B9A\u9ED8\u8BA4\u6570\u91CF \xD7".concat(qty, " \u4FDD\u5B58\u3002") : '\u5F53\u524D\u4F1A\u6309"'.concat(smartRuleLabel(smartRule, smartConfig), '"\u53C2\u4E0E\u667A\u80FD\u586B\u5145\uFF1B\u57FA\u7840\u6570\u91CF\u4E3A ').concat(qty, "\u3002");
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
    if (!saveItemLibrary(items)) {
      toast("\u7269\u54C1\u5E93\u4FDD\u5B58\u5931\u8D25\uFF0C\u8BF7\u91CD\u8BD5");
      return;
    }
    closeModal("libraryItemModal");
    renderItemLibrary();
    renderModuleBuilderItems();
    toast(names.length > 1 ? "\u5DF2\u6279\u91CF\u5904\u7406 ".concat(names.length, " \u4EF6\u7269\u54C1\uFF08\u65B0\u589E ").concat(added, "\uFF0C\u66F4\u65B0 ").concat(updated, "\uFF09") : "\u7269\u54C1\u5E93\u5DF2\u66F4\u65B0");
  }
  function deleteLibraryItem() {
    if (!S.libraryModalEditId) return;
    const items = getItemLibrary();
    const target = items.find((item) => item.id === S.libraryModalEditId);
    if (!target || target.source !== "user") {
      toast("\u7CFB\u7EDF\u7269\u54C1\u4E0D\u652F\u6301\u5220\u9664");
      return;
    }
    if (!saveItemLibrary(items.filter((item) => item.id !== S.libraryModalEditId))) {
      toast("\u5220\u9664\u5931\u8D25\uFF0C\u8BF7\u91CD\u8BD5");
      return;
    }
    closeModal("libraryItemModal");
    renderItemLibrary();
    renderModuleBuilderItems();
    toast("\u5DF2\u5220\u9664\u7269\u54C1");
  }
  function openManualItemModal() {
    var _a;
    fillCatSelect("manualItemCategory", "misc");
    fillBagSelect("manualItemBag", "bag-misc", ((_a = S.currentTrip) == null ? void 0 : _a.bags) || DEFAULT_BAGS);
    document.getElementById("manualItemName").value = "";
    document.getElementById("manualItemBulkInput").value = "";
    document.getElementById("manualItemQty").value = 1;
    document.getElementById("manualItemNotes").value = "";
    updateManualItemSmartHint();
    showModal("manualItemModal");
    setTimeout(() => document.getElementById("manualItemName").focus(), 50);
  }
  function updateManualItemSmartHint() {
    var _a, _b;
    const hint = document.getElementById("manualItemSmartHint");
    if (!hint) return;
    const names = collectDraftNames("manualItemName", "manualItemBulkInput");
    const category = ((_a = document.getElementById("manualItemCategory")) == null ? void 0 : _a.value) || "misc";
    const qty = Math.max(1, parseInt((_b = document.getElementById("manualItemQty")) == null ? void 0 : _b.value) || 1);
    if (!names.length) {
      hint.textContent = "\u652F\u6301\u4E00\u6B21\u7C98\u8D34\u591A\u4EF6\u7269\u54C1\uFF0C\u7CFB\u7EDF\u4F1A\u6309\u7A7A\u683C\u3001\u9017\u53F7\u6216\u6362\u884C\u62C6\u5206\uFF1B\u6BCF\u4EF6\u7269\u54C1\u90FD\u4F1A\u5355\u72EC\u5224\u65AD\u667A\u80FD\u6570\u91CF\u3002";
      return;
    }
    if (names.length > 1) {
      hint.textContent = "\u5C06\u6309\u5F53\u524D\u5206\u7C7B\u548C\u5F52\u5C5E\u5C0F\u5305\u6279\u91CF\u6DFB\u52A0 ".concat(names.length, " \u4EF6\u7269\u54C1\uFF1B\u6BCF\u4EF6\u90FD\u4F1A\u5355\u72EC\u5224\u65AD\u667A\u80FD\u6570\u91CF\uFF0C\u4E4B\u540E\u4E5F\u53EF\u4EE5\u9010\u4E2A\u4FEE\u6539\u3002");
      return;
    }
    const { smartRule, smartConfig } = resolveItemSmartPlan(names[0], category);
    const currentSuggestion = S.currentTrip ? computeSmartQty(qty, smartRule, S.currentTrip.days, S.currentTrip.people, smartConfig, S.currentTrip) : qty;
    hint.textContent = smartRule === "fixed" ? "\u8FD9\u4EF6\u7269\u54C1\u4F1A\u6309\u56FA\u5B9A\u6570\u91CF \xD7".concat(qty, " \u52A0\u5165\u5F53\u524D\u884C\u7A0B\u3002") : '\u8FD9\u4EF6\u7269\u54C1\u4F1A\u6309"'.concat(smartRuleLabel(smartRule, smartConfig), '"\u667A\u80FD\u5EFA\u8BAE\uFF1B\u5F53\u524D\u884C\u7A0B\u9884\u8BA1\u6570\u91CF \xD7').concat(currentSuggestion, "\u3002");
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
    toast(names.length > 1 ? "\u5DF2\u6279\u91CF\u6DFB\u52A0 ".concat(names.length, " \u4EF6\u7269\u54C1") : "\u5DF2\u6DFB\u52A0\u5230\u884C\u7A0B");
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
      (tag, index) => '<span class="item-tag-pill">' + esc(tag) + '<button type="button" class="item-tag-remove" data-tag-index="' + index + '" aria-label="\u79FB\u9664\u6807\u7B7E ' + esc(tag) + '">\u2715</button></span>'
    ).join("");
  }
  function addTripItemTag() {
    const input = document.getElementById("tripItemTagInput");
    const val = input == null ? void 0 : input.value.trim();
    if (!val) return;
    if (S.currentEditingTags.includes(val)) {
      toast("\u8BE5\u6807\u7B7E\u5DF2\u5B58\u5728");
      return;
    }
    S.currentEditingTags.push(val);
    renderTripItemTags();
    if (input) input.value = "";
  }
  function toggleTripItemTagSection() {
    toggleTagSection("tripItemTagSection", "tripItemTagToggle");
  }
  function updateItemPickerSearch(value) {
    const query = String(value || "").trim().toLowerCase();
    document.querySelectorAll("#itemPickerItems .picker-item").forEach((item) => {
      item.style.display = !query || item.textContent.toLowerCase().includes(query) ? "" : "none";
    });
  }
  function confirmItemPicker() {
    closeModal("itemPickerModal");
  }
  function removeTripItemTagByIndex(index) {
    if (!Number.isFinite(index) || index < 0 || index >= S.currentEditingTags.length) return;
    S.currentEditingTags = S.currentEditingTags.filter((_, i) => i !== index);
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
    const suggested = computeSmartQty(
      item.smartBaseQty || 1,
      item.smartRule,
      S.currentTrip.days,
      S.currentTrip.people,
      item.smartConfig,
      S.currentTrip
    );
    meta.style.display = "block";
    meta.textContent = qty === suggested ? "\u667A\u80FD\u586B\u5145\uFF1A".concat(smartRuleLabel(item.smartRule, item.smartConfig), "\u3002\u5F53\u524D\u5EFA\u8BAE\u6570\u91CF \xD7").concat(suggested, "\u3002") : "\u667A\u80FD\u586B\u5145\uFF1A".concat(smartRuleLabel(item.smartRule, item.smartConfig), "\u3002\u5F53\u524D\u5EFA\u8BAE \xD7").concat(suggested, "\uFF1B\u4F60\u73B0\u5728\u586B\u5199\u7684\u662F \xD7").concat(qty, "\uFF0C\u4FDD\u5B58\u540E\u4F1A\u4F18\u5148\u6309\u4F60\u7684\u624B\u52A8\u6570\u91CF\u4FDD\u7559\u3002");
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
      const suggested = computeSmartQty(
        item.smartBaseQty || 1,
        item.smartRule,
        S.currentTrip.days,
        S.currentTrip.people,
        item.smartConfig,
        S.currentTrip
      );
      item.smartLocked = item.qty !== suggested;
    }
    if (!persistCurrentTrip()) return;
    closeModal("tripItemModal");
    renderTripPage();
    refreshTripHub();
    toast("\u7269\u54C1\u5DF2\u66F4\u65B0");
  }
  function deleteCurrentTripItem() {
    if (!S.currentTrip || !S.tripItemEditId) return;
    S.currentTrip.items = S.currentTrip.items.filter((item) => item.id !== S.tripItemEditId);
    if (!persistCurrentTrip()) return;
    closeModal("tripItemModal");
    renderTripPage();
    refreshTripHub();
    toast("\u5DF2\u5220\u9664\u7269\u54C1");
  }
  function togglePackItem(itemId) {
    if (!S.currentTrip) return;
    const item = S.currentTrip.items.find((entry) => entry.id === itemId);
    if (!item) return;
    item.packed = !item.packed;
    if (!persistCurrentTrip()) return;
    renderTripPage();
    refreshTripHub();
  }
  function markAllPacked() {
    if (!S.currentTrip) return;
    S.currentTrip.items.forEach((item) => {
      item.packed = true;
    });
    if (!persistCurrentTrip()) return;
    renderTripPage();
    refreshTripHub();
    toast("\u5DF2\u5168\u90E8\u6807\u8BB0\u5B8C\u6210");
  }
  function markAllUnpacked() {
    if (!S.currentTrip) return;
    S.currentTrip.items.forEach((item) => {
      item.packed = false;
    });
    if (!persistCurrentTrip()) return;
    renderTripPage();
    refreshTripHub();
    toast("\u5DF2\u6062\u590D\u4E3A\u672A\u6253\u5305");
  }
  function openCreateModuleModal(initialItems = null, options = {}) {
    const editSource = options.editSource || "custom";
    const editModule = options.editId ? getModuleEntity(editSource, options.editId) : null;
    const baseItems = editModule ? editModule.items : initialItems || [];
    syncItemsIntoLibrary(baseItems);
    S.moduleBuilderDraftId = (editModule == null ? void 0 : editModule.id) || null;
    S.moduleBuilderDraftSource = editModule ? editSource : "custom";
    S.moduleBuilderItems = (baseItems || []).map((item) => tripOrModuleItemToModuleItem(item));
    syncModuleBuilderSelectionFromItems();
    S.moduleBuilderSearch = "";
    S.moduleAddPanelOpen = false;
    document.getElementById("moduleBuilderModalTitle").textContent = editModule ? "\u7F16\u8F91\u5C0F\u5305" : "\u65B0\u5EFA\u5C0F\u5305";
    document.getElementById("moduleBuilderSaveBtn").textContent = "\u4FDD\u5B58";
    document.getElementById("moduleBuilderDeleteBtn").style.visibility = editModule ? "visible" : "hidden";
    document.getElementById("moduleBuilderName").value = (editModule == null ? void 0 : editModule.name) || "";
    document.getElementById("moduleBuilderSearch").value = "";
    const panel = document.getElementById("moduleAddPanel");
    if (panel) panel.hidden = true;
    renderModuleBuilderSelectedItems();
    renderModuleBuilderItems();
    showModal("createModuleModal");
    setTimeout(() => document.getElementById("moduleBuilderName").focus(), 50);
  }
  function toggleModuleAddPanel() {
    S.moduleAddPanelOpen = !S.moduleAddPanelOpen;
    const panel = document.getElementById("moduleAddPanel");
    if (panel) panel.hidden = !S.moduleAddPanelOpen;
    if (S.moduleAddPanelOpen) {
      renderModuleBuilderItems();
      setTimeout(() => {
        var _a;
        return (_a = document.getElementById("moduleBuilderSearch")) == null ? void 0 : _a.focus();
      }, 50);
    }
  }
  function updateModuleBuilderSearch(value) {
    S.moduleBuilderSearch = value.trim();
    renderModuleBuilderItems();
  }
  function removeModuleBuilderItem(itemId) {
    var _a;
    const target = S.moduleBuilderItems.find((item) => item.id === itemId);
    S.moduleBuilderItems = S.moduleBuilderItems.filter((item) => item.id !== itemId);
    if (target) {
      const library = getItemLibrary();
      const assetId = (_a = library.find((asset) => asset.name === target.name)) == null ? void 0 : _a.id;
      if (assetId) S.moduleBuilderSelection.delete(assetId);
    }
    renderModuleBuilderSelectedItems();
    renderModuleBuilderItems();
  }
  function addModuleBuilderItemByAssetId(itemId) {
    const library = getItemLibrary();
    const asset = library.find((entry) => entry.id === itemId);
    if (!asset) return;
    if (S.moduleBuilderItems.some((item) => item.name === asset.name)) {
      toast("\u5DF2\u5728\u5305\u5185");
      return;
    }
    S.moduleBuilderSelection.add(itemId);
    S.moduleBuilderItems.push(createModuleItemFromAsset(asset));
    renderModuleBuilderSelectedItems();
    renderModuleBuilderItems();
  }
  function renderModuleBuilderSelectedItems() {
    const box = document.getElementById("moduleBuilderSelectedItems");
    if (!box) return;
    const items = S.moduleBuilderItems || [];
    box.innerHTML = items.length ? items.map(
      (item) => '<div class="module-edit-row"><span class="module-edit-name">' + esc(item.name) + '</span><span class="module-edit-qty">\xD7' + item.defaultQty + '</span><button type="button" class="chip-remove" data-remove-module-item="' + item.id + '" aria-label="\u79FB\u9664">\xD7</button></div>'
    ).join("") : '<div class="empty-hint">\u8FD8\u6CA1\u6709\u7269\u54C1\uFF0C\u70B9\u300C+ \u6DFB\u52A0\u300D\u4ECE\u7269\u54C1\u5E93\u6311\u9009\u3002</div>';
  }
  function renderModuleBuilderItems() {
    const box = document.getElementById("moduleBuilderItems");
    if (!box) return;
    const selectedNames = new Set((S.moduleBuilderItems || []).map((item) => item.name));
    const keyword = S.moduleBuilderSearch.toLowerCase();
    const items = getItemLibrary().filter((item) => !selectedNames.has(item.name)).filter((item) => !keyword || item.name.toLowerCase().includes(keyword)).sort((a, b) => a.name.localeCompare(b.name, "zh-Hans-CN"));
    box.innerHTML = items.length ? items.map(
      (item) => '<div class="picker-item addable" data-item-id="' + item.id + '"><div class="picker-item-name">' + esc(item.name) + "</div></div>"
    ).join("") : '<div class="empty-panel full-span"><div class="empty-hint">' + (keyword ? "\u6CA1\u6709\u5339\u914D\u7684\u7269\u54C1" : "\u7269\u54C1\u5E93\u91CC\u7684\u90FD\u5DF2\u52A0\u5165") + "</div></div>";
  }
  function saveCustomModule() {
    var _a;
    const name = document.getElementById("moduleBuilderName").value.trim();
    if (!name) {
      toast("\u8BF7\u586B\u5199\u5C0F\u5305\u540D\u79F0");
      return;
    }
    const items = (S.moduleBuilderItems || []).map(normalizeModuleItem);
    if (!items.length) {
      toast("\u8BF7\u81F3\u5C11\u9009\u62E9\u4E00\u4E2A\u7269\u54C1");
      return;
    }
    if (S.moduleBuilderDraftSource === "official") {
      const officialModules = getOfficialModules();
      const existing2 = S.moduleBuilderDraftId ? officialModules.find((item) => item.id === S.moduleBuilderDraftId) : null;
      const nextModule = normalizeOfficialModule({
        ...existing2,
        id: (existing2 == null ? void 0 : existing2.id) || "official-module-" + gid(),
        name,
        icon: (existing2 == null ? void 0 : existing2.icon) || "\xB7",
        desc: (existing2 == null ? void 0 : existing2.desc) || "",
        purpose: (existing2 == null ? void 0 : existing2.purpose) || "starter",
        group: (existing2 == null ? void 0 : existing2.group) || "",
        role: (existing2 == null ? void 0 : existing2.role) || "",
        defaultOn: (existing2 == null ? void 0 : existing2.defaultOn) || false,
        tags: ((_a = existing2 == null ? void 0 : existing2.tags) == null ? void 0 : _a.length) ? existing2.tags : ["\u5B98\u65B9\u5C0F\u5305"],
        items
      });
      const idx = officialModules.findIndex((item) => item.id === nextModule.id);
      if (idx >= 0) officialModules[idx] = nextModule;
      else officialModules.unshift(nextModule);
      items.forEach(upsertLibraryFromModuleItem);
      if (!saveOfficialModules(officialModules)) {
        toast("\u5C0F\u5305\u4FDD\u5B58\u5931\u8D25\uFF0C\u8BF7\u91CD\u8BD5");
        return;
      }
      closeModal("createModuleModal");
      renderModuleLibrary();
      refreshTripHub();
      toast("\u5B98\u65B9\u5C0F\u5305\u5DF2\u66F4\u65B0\uFF0C\u4E4B\u540E\u65B0\u5EFA\u884C\u7A0B\u90FD\u4F1A\u6309\u65B0\u8BBE\u7F6E\u751F\u6210");
      return;
    }
    const existing = S.moduleBuilderDraftId ? getMyModules().find((item) => item.id === S.moduleBuilderDraftId) : null;
    const module = normalizeModuleRecord({
      id: (existing == null ? void 0 : existing.id) || "module-" + gid(),
      recordType: "module",
      name,
      icon: (existing == null ? void 0 : existing.icon) || "\xB7",
      desc: (existing == null ? void 0 : existing.desc) || "",
      purpose: "custom",
      tags: (existing == null ? void 0 : existing.tags) || ["\u6211\u7684\u5C0F\u5305"],
      items,
      createdAt: (existing == null ? void 0 : existing.createdAt) || (/* @__PURE__ */ new Date()).toISOString(),
      updatedAt: (/* @__PURE__ */ new Date()).toISOString()
    });
    items.forEach(upsertLibraryFromModuleItem);
    if (!saveRecord(module)) {
      toast("\u5C0F\u5305\u4FDD\u5B58\u5931\u8D25\uFF0C\u8BF7\u91CD\u8BD5");
      return;
    }
    closeModal("createModuleModal");
    renderModuleLibrary();
    refreshTripHub();
    toast(existing ? "\u5C0F\u5305\u5DF2\u66F4\u65B0\uFF0C\u4E4B\u540E\u65B0\u5EFA\u884C\u7A0B\u90FD\u4F1A\u6309\u65B0\u8BBE\u7F6E\u751F\u6210" : "\u5DF2\u4FDD\u5B58\u5230\u6211\u7684\u5C0F\u5305");
  }
  function deleteCurrentModuleDraft() {
    if (!S.moduleBuilderDraftId) return;
    if (!confirm(S.moduleBuilderDraftSource === "official" ? "\u786E\u5B9A\u5220\u9664\u8FD9\u4E2A\u5B98\u65B9\u5C0F\u5305\u5417\uFF1F" : "\u786E\u5B9A\u5220\u9664\u8FD9\u4E2A\u5C0F\u5305\u5417\uFF1F")) return;
    if (S.moduleBuilderDraftSource === "official") {
      if (!markOfficialModuleDeleted(S.moduleBuilderDraftId)) {
        toast("\u5220\u9664\u5931\u8D25\uFF0C\u8BF7\u91CD\u8BD5");
        return;
      }
    } else {
      if (!deleteRecord(S.moduleBuilderDraftId, { silent: true })) return;
    }
    closeModal("createModuleModal");
    renderModuleLibrary();
    refreshTripHub();
    toast(S.moduleBuilderDraftSource === "official" ? "\u5DF2\u5220\u9664\u5B98\u65B9\u5C0F\u5305" : "\u5DF2\u5220\u9664\u5C0F\u5305");
  }
  function saveCurrentTripAsModule() {
    if (!S.currentTrip || !S.currentTrip.items.length) {
      toast("\u7A7A\u884C\u7A0B\u8FD8\u4E0D\u80FD\u4FDD\u5B58\u4E3A\u5C0F\u5305");
      return;
    }
    openCreateModuleModal(S.currentTrip.items);
    document.getElementById("moduleBuilderName").value = S.currentTrip.name + " \u5C0F\u5305";
  }
  function deleteTrip(id) {
    const target = getTrips().find((trip) => trip.id === id);
    if (!target) return;
    if (!confirm("\u786E\u5B9A\u5220\u9664\u884C\u7A0B\u300C".concat(target.name, "\u300D\u5417\uFF1F\u6B64\u64CD\u4F5C\u4E0D\u53EF\u64A4\u9500\u3002"))) return;
    deleteRecord(id);
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
    if (!saveRecord(copy)) {
      toast("\u590D\u5236\u5931\u8D25\uFF0C\u8BF7\u91CD\u8BD5");
      return;
    }
    refreshTripHub();
    toast("\u5DF2\u590D\u5236\u884C\u7A0B");
  }
  function deleteRecord(id, options = {}) {
    var _a;
    const records = getRecords().filter((record) => record.id !== id);
    if (!saveRecords(records)) {
      toast("\u5220\u9664\u5931\u8D25\uFF0C\u8BF7\u91CD\u8BD5");
      return false;
    }
    if (S.currentTripId === id) {
      S.currentTripId = null;
      S.currentTrip = null;
    }
    if (((_a = S.currentModule) == null ? void 0 : _a.id) === id) {
      S.currentModule = null;
      closeModal("moduleDetailModal");
    }
    if (!options.silent) {
      if (S.currentPage === "list") nav("list");
      refreshTripHub();
      renderModuleLibrary();
      toast("\u5DF2\u5220\u9664");
    }
    return true;
  }
  function persistCurrentTrip() {
    var _a;
    if (!((_a = S.currentTrip) == null ? void 0 : _a.id)) return false;
    S.currentTrip.updatedAt = (/* @__PURE__ */ new Date()).toISOString();
    const saved = saveRecord(S.currentTrip);
    if (!saved) {
      const stored = getTrips().find((trip) => trip.id === S.currentTripId);
      if (stored) S.currentTrip = deepClone(stored);
      toast("\u884C\u7A0B\u4FDD\u5B58\u5931\u8D25\uFF0C\u8BF7\u68C0\u67E5\u8BBE\u5907\u5B58\u50A8\u7A7A\u95F4\u540E\u91CD\u8BD5");
    }
    return saved;
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
    var _a;
    return Math.max(1, parseInt((_a = document.getElementById("tripDays")) == null ? void 0 : _a.value) || 1);
  }
  function getTripBuilderPeople() {
    var _a;
    return Math.max(1, parseInt((_a = document.getElementById("tripPeople")) == null ? void 0 : _a.value) || 1);
  }
  function getPreviewDays() {
    var _a;
    return ((_a = S.currentTrip) == null ? void 0 : _a.days) || 2;
  }
  function getPreviewPeople() {
    var _a;
    return ((_a = S.currentTrip) == null ? void 0 : _a.people) || 1;
  }
  function tripBuilderHasBabyAddonSelection() {
    return Array.from(S.tripBuilderSelection).some((key) => {
      const [source, id] = splitModuleKey(key);
      const module = getModuleEntity(source, id);
      return isBabyModuleEntity(module) && (module == null ? void 0 : module.role) === "scenario";
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
    var _a, _b;
    const category = (_a = document.getElementById(catSelectId)) == null ? void 0 : _a.value;
    const select = document.getElementById(bagSelectId);
    if (!category || !select) return;
    const preferred = suggestBagForItem(
      ((_b = document.getElementById(catSelectId.replace("Category", "Name"))) == null ? void 0 : _b.value) || "",
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
    el.innerHTML = (bags || DEFAULT_BAGS).map((bag) => '<option value="' + bag.id + '"' + (bag.id === selected ? " selected" : "") + ">" + esc(bag.name) + "</option>").join("");
  }
  function esc(value) {
    const div = document.createElement("div");
    div.textContent = value == null ? "" : String(value);
    return div.innerHTML;
  }
  function setupModalOverlays() {
    document.querySelectorAll(".modal-overlay").forEach((overlay) => {
      const dialog = overlay.querySelector(".modal");
      if (dialog) {
        dialog.setAttribute("role", "dialog");
        dialog.setAttribute("aria-modal", "true");
        dialog.setAttribute("tabindex", "-1");
      }
      overlay.addEventListener("click", (event) => {
        if (event.target === overlay) closeModal(overlay.id);
      });
    });
    document.addEventListener("keydown", (event) => {
      if (event.key !== "Escape") return;
      const activeOverlay = document.querySelector(".modal-overlay.active");
      if (activeOverlay) closeModal(activeOverlay.id);
    });
  }
  function showModal(id) {
    const overlay = document.getElementById(id);
    if (!overlay) return;
    modalReturnFocus = document.activeElement;
    overlay.classList.add("active");
    setTimeout(() => {
      const target = overlay.querySelector('input:not([type="hidden"]), textarea, select, button, [tabindex="0"]');
      target == null ? void 0 : target.focus();
    }, 0);
  }
  function closeModal(id) {
    var _a;
    if (id === "createModuleModal") {
      S.moduleBuilderDraftId = null;
      S.moduleAddPanelOpen = false;
    }
    (_a = document.getElementById(id)) == null ? void 0 : _a.classList.remove("active");
    if (modalReturnFocus instanceof HTMLElement) modalReturnFocus.focus();
    modalReturnFocus = null;
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
      title: "\u6574\u7406\u5C0F\u5305",
      desc: "\u628A\u5E38\u5E26\u7269\u54C1\u6309\u7528\u9014\u5206\u7EC4\uFF0C\u6BD4\u5982\u6D17\u6F31\u5305\u3001\u5316\u5986\u5305\u3002\u7CFB\u7EDF\u5DF2\u9884\u7F6E\u5B98\u65B9\u5C0F\u5305\uFF0C\u4F60\u4E5F\u53EF\u4EE5\u65B0\u5EFA\u81EA\u5DF1\u7684\u3002"
    },
    {
      title: "\u65B0\u5EFA\u884C\u7A0B",
      desc: "\u6BCF\u6B21\u51FA\u95E8\u524D\u65B0\u5EFA\u884C\u7A0B\uFF0C\u52FE\u9009\u9700\u8981\u7684\u5C0F\u5305\uFF0C\u7CFB\u7EDF\u81EA\u52A8\u5408\u5E76\u7269\u54C1\u5E76\u6309\u5929\u6570\u3001\u4EBA\u6570\u5EFA\u8BAE\u6570\u91CF\u3002"
    },
    {
      title: "\u6253\u5305\u51FA\u53D1",
      desc: "\u6253\u5F00\u884C\u7A0B\u540E\u5207\u6362\u5230\u6253\u5305\u6A21\u5F0F\uFF0C\u5B9E\u7269\u6253\u5305\u65F6\u9010\u4E00\u52FE\u9009\u3002"
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
    stepEl.innerHTML = '<div class="onboarding-title">' + step.title + '</div><div class="onboarding-desc">' + step.desc + "</div>";
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
    safeStorageSet(STORAGE_KEYS.onboarded, "1");
    closeModal("onboardingModal");
  }
  function renderMePage() {
    const trips = getTrips();
    const modules = getMyModules();
    const library = getItemLibrary();
    const officialCount = getOfficialModules().length;
    const activeCount = trips.filter((trip) => getTripStatus(trip).key !== "done").length;
    document.getElementById("meName").textContent = "\u884C\u7406";
    document.getElementById("meStats").innerHTML = [
      { label: "\u8FDB\u884C\u4E2D", value: activeCount },
      { label: "\u884C\u7A0B", value: trips.length },
      { label: "\u5C0F\u5305", value: modules.length + officialCount },
      { label: "\u7269\u54C1", value: library.length }
    ].map(
      (stat) => '<div class="me-stat"><div class="me-stat-value">' + stat.value + '</div><div class="me-stat-label">' + stat.label + "</div></div>"
    ).join("");
  }
  function resetOfficialModules() {
    if (!confirm("\u786E\u5B9A\u6062\u590D\u6240\u6709\u5B98\u65B9\u5C0F\u5305\u5230\u521D\u59CB\u72B6\u6001\uFF1F\u4F60\u81EA\u5EFA\u7684\u5C0F\u5305\u4E0D\u4F1A\u53D7\u5F71\u54CD\u3002")) return;
    safeStorageRemove(STORAGE_KEYS.officialModules);
    safeStorageRemove(STORAGE_KEYS.deletedOfficialModules);
    safeStorageRemove(STORAGE_KEYS.officialSeedVersion);
    ensureItemLibrarySeeded();
    renderModuleLibrary();
    renderMePage();
    toast("\u5DF2\u6062\u590D\u5B98\u65B9\u5C0F\u5305");
  }
  function clearAllData() {
    if (!confirm("\u786E\u5B9A\u6E05\u9664\u6240\u6709\u6570\u636E\uFF1F\u5305\u62EC\u884C\u7A0B\u3001\u5C0F\u5305\u548C\u7269\u54C1\u5E93\uFF0C\u6B64\u64CD\u4F5C\u4E0D\u53EF\u64A4\u9500\u3002")) return;
    safeStorageRemove(STORAGE_KEYS.records);
    safeStorageRemove(STORAGE_KEYS.itemLibrary);
    safeStorageRemove(STORAGE_KEYS.officialModules);
    safeStorageRemove(STORAGE_KEYS.deletedOfficialModules);
    safeStorageRemove(STORAGE_KEYS.onboarded);
    S.currentTrip = null;
    S.currentTripId = null;
    ensureItemLibrarySeeded();
    nav("list");
    toast("\u6570\u636E\u5DF2\u6E05\u9664");
  }
  Object.assign(window, {
    // nav & pages
    openMainPage,
    openSubPage,
    openTripPage,
    goBack,
    nav,
    // trip builder
    openCreateTripModal,
    confirmCreateTrip,
    stepValue,
    toggleTripBuilderModule,
    changeCurrentTripSetting,
    updateCurrentTripSetting,
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
    resyncCurrentTripFromModules,
    removeModuleFromCurrentTrip,
    saveCurrentTripAsModule,
    goSelectModuleForTrip,
    goSelectItemsForTrip,
    // module
    openCreateModuleModal,
    saveCustomModule,
    deleteCurrentModuleDraft,
    deleteCurrentModuleFromDetail,
    quickAddItemToCurrentModule,
    removeItemFromCurrentModule,
    toggleModuleAddPanel,
    updateModuleBuilderSearch,
    useCurrentModule,
    openEditCurrentModule,
    openEditModuleModal,
    openModuleDetail,
    openModuleItemModal,
    saveModuleItemEdit,
    deleteModuleItemEdit,
    setModuleFilter,
    updateModuleSearch,
    // library
    saveLibraryItem,
    deleteLibraryItem,
    openLibraryItemModal,
    addLibraryItemToCurrentTrip,
    addLibraryItemTag,
    toggleLibraryItemTagSection,
    setItemFilter,
    updateItemSearch,
    updateILibrarySearch,
    // manual item
    openManualItemModal,
    saveManualTripItem,
    // trip item edit
    openTripItemModal,
    saveCurrentTripItem,
    deleteCurrentTripItem,
    addTripItemTag,
    toggleTripItemTagSection,
    // modals
    showModal,
    closeModal,
    updateItemPickerSearch,
    confirmItemPicker,
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
    deleteTrip,
    openTripActionsSheet,
    closeTripActionsSheet,
    duplicateTripFromSheet,
    deleteTripFromSheet
  });
  try {
    init();
  } catch (error) {
    console.error("[xingli] init failed", error);
    const content = document.getElementById("listContent");
    if (content) {
      content.innerHTML = '<div class="empty-panel"><div class="empty-title">\u9875\u9762\u52A0\u8F7D\u5931\u8D25</div><div class="empty-hint">\u8BF7\u5173\u95ED\u540E\u91CD\u65B0\u6253\u5F00\uFF1B\u5982\u679C\u4ECD\u7136\u5931\u8D25\uFF0C\u8BF7\u66F4\u65B0\u5230\u6700\u65B0\u7248\u672C\u3002</div></div>';
    }
  }
})();
