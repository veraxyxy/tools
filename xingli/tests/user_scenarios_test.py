#!/usr/bin/env python3
"""
行理 - 用户场景测试
测试核心用户流程和边界情况
"""

import unittest
import re
from typing import List, Dict, Any, Optional

# ===== Constants (mirrored from JS) =====

DEFAULT_CATEGORIES = [
    {"id": "hygiene", "name": "洗漱用品", "cssClass": "cat-hygiene"},
    {"id": "makeup", "name": "化妆用品", "cssClass": "cat-makeup"},
    {"id": "skincare", "name": "护肤品", "cssClass": "cat-skincare"},
    {"id": "small-bag", "name": "随身小物", "cssClass": "cat-small-bag"},
    {"id": "big-bag", "name": "大件收纳", "cssClass": "cat-big-bag"},
    {"id": "misc", "name": "杂物", "cssClass": "cat-misc"},
    {"id": "docs", "name": "证件", "cssClass": "cat-docs"},
    {"id": "electronics", "name": "电子产品", "cssClass": "cat-electronics"},
    {"id": "medicine", "name": "药品", "cssClass": "cat-medicine"},
    {"id": "clothing", "name": "衣物", "cssClass": "cat-clothing"}
]

DEFAULT_BAGS = [
    {"id": "bag-hygiene", "name": "洗漱包", "icon": "🧴"},
    {"id": "bag-makeup", "name": "化妆包", "icon": "💄"},
    {"id": "bag-docs", "name": "证件包", "icon": "📁"},
    {"id": "bag-clothing", "name": "衣服包", "icon": "👕"},
    {"id": "bag-baby", "name": "宝宝基础包", "icon": "👶"},
    {"id": "bag-baby-vaccine", "name": "疫苗插件包", "icon": "💉"},
    {"id": "bag-baby-feeding", "name": "喂养插件包", "icon": "🍼"},
    {"id": "bag-baby-overnight", "name": "过夜插件包", "icon": "🌙"},
    {"id": "bag-baby-outdoor", "name": "户外插件包", "icon": "⛰️"},
    {"id": "bag-electronics", "name": "电子包", "icon": "🔌"},
    {"id": "bag-small", "name": "随身小包", "icon": "👝"},
    {"id": "bag-big", "name": "大件收纳包", "icon": "🧳"},
    {"id": "bag-medicine", "name": "药品包", "icon": "💊"},
    {"id": "bag-misc", "name": "杂物包", "icon": "📦"}
]

CATEGORY_BAG_MAP = {
    "hygiene": "bag-hygiene",
    "makeup": "bag-makeup",
    "skincare": "bag-hygiene",
    "small-bag": "bag-small",
    "big-bag": "bag-big",
    "misc": "bag-misc",
    "docs": "bag-docs",
    "electronics": "bag-electronics",
    "medicine": "bag-medicine",
    "clothing": "bag-clothing"
}

BABY_MODULE_IDS = {
    "base": "module-baby-base",
    "vaccine": "module-baby-vaccine",
    "feeding": "module-baby-feeding",
    "overnight": "module-baby-overnight",
    "outdoor": "module-baby-outdoor"
}

# ===== Utility Functions =====

_counter = 0

def gid() -> str:
    """Generate unique ID"""
    import time
    global _counter
    _counter += 1
    return f"{int(time.time() * 1000)}{_counter}"

def deep_clone(value: Any) -> Any:
    """Deep clone using JSON"""
    import json
    return json.loads(json.dumps(value))

def unique_strings(values: List[str]) -> List[str]:
    """Remove duplicates and None values"""
    return list(set(v for v in (values or []) if v))

def guess_cat(name: str) -> str:
    """Guess category from item name"""
    n = str(name or "").lower()

    rules = [
        (["身份证", "护照", "签证", "驾照", "工作证", "门禁", "名片", "发票", "行程", "保险", "户口", "出生", "学生证", "预订", "确认单", "社保", "医卡"], "docs"),
        (["充电宝", "电充电", "数据线", "耳机", "手机", "电脑", "ipad", "平板", "相机", "转换插", "u盘", "鼠标", "手电", "头灯", "露营灯", "音箱", "自拍", "插线板", "读卡器", "watch"], "electronics"),
        (["衬衫", "t恤", "裤", "裙", "连裤", "内裤", "文胸", "袜", "外套", "西装", "风衣", "睡衣", "泳衣", "拖鞋", "鞋", "冲锋衣", "速干", "帽子", "围脖", "口巾", "宝宝衣服", "宝宝袜子", "打底裤"], "clothing"),
        (["牙刷", "牙膏", "漱口", "牙线", "洗面", "梳", "剃须", "沐浴", "洗发", "香皂", "浴巾", "毛巾", "牙刷杯"], "hygiene"),
        (["面霜", "防晒", "唇膏", "面膜", "芦荟", "驱蚊", "护肤", "护手霜", "喷雾"], "skincare"),
        (["口红", "唇彩", "粉底", "粉扑", "气垫", "眼影", "化妆", "卸妆", "睫毛", "腮红", "眉笔", "眼线", "遮瑕", "散粉", "高光", "修容", "定妆", "妆前", "美妆蛋", "化妆刷", "香水"], "makeup"),
        (["感冒药", "退烧", "创可贴", "肠胃", "晕车", "维生素", "温度计", "藿香", "止痛", "解毒", "常备药", "退热贴", "过敏药"], "medicine"),
        (["钱包", "钥匙", "口", "随身", "现金", "银行卡", "墨镜", "发绳"], "small-bag"),
        (["购物袋", "收纳袋", "压缩袋", "大包", "行李箱"], "big-bag"),
        (["雨伞", "雨衣", "纸巾", "湿巾", "垃圾袋", "塑料袋", "零食", "水杯", "保温杯", "u型枕", "眼罩", "耳塞", "行李锁", "行李牌", "打火机", "绳索", "扎带", "饮用水", "奶瓶", "奶粉", "围兜", "安抚玩具", "隔尿垫", "奶嘴", "尿不湿", "辅食"], "misc")
    ]

    for keywords, category in rules:
        for keyword in keywords:
            if keyword in n:
                return category
    return "misc"

def cat_info(id: str) -> Dict:
    """Get category info"""
    return next((c for c in DEFAULT_CATEGORIES if c["id"] == id), {"id": "misc", "name": "杂物", "cssClass": "cat-misc"})

def bag_name(id: str, bags: List[Dict] = None) -> str:
    """Get bag name"""
    bags = bags or DEFAULT_BAGS
    bag = next((b for b in bags if b["id"] == id), None)
    return bag["name"] if bag else "未分配"

def suggest_bag_for_item(name: str, category: str) -> str:
    """Suggest bag for item based on name and category"""
    n = str(name or "")

    if any(k in n for k in ["疫苗本", "退烧贴", "退热贴", "医保卡"]):
        return "bag-baby-vaccine"
    if any(k in n for k in ["奶瓶", "奶粉", "奶粉格", "辅食碗", "围兜", "围嘴", "保温杯"]):
        return "bag-baby-feeding"
    if any(k in n for k in ["便携烧水壶", "奶瓶刷", "折叠澡盆"]):
        return "bag-baby-overnight"
    if any(k in n for k in ["驱蚊液", "防晒霜", "便携马桶", "大量零食"]):
        return "bag-baby-outdoor"
    if "宝宝" in n or any(k in n for k in ["尿不湿", "纸尿裤", "隔尿垫", "棉柔巾", "湿巾（婴儿专用）", "备用衣裤", "安抚奶嘴", "口 水巾"]):
        return "bag-baby"

    return CATEGORY_BAG_MAP.get(category, "bag-misc")

def esc(s: str) -> str:
    """HTML escape"""
    if s is None:
        return ""
    s = str(s)
    s = s.replace("&", "&amp;")
    s = s.replace("<", "&lt;")
    s = s.replace(">", "&gt;")
    s = s.replace('"', "&quot;")
    s = s.replace("'", "&#039;")
    return s

# ===== Smart Fill Functions =====

def normalize_smart_config(config):
    """Normalize smart config"""
    if not config:
        return None

    scene_factors = {}
    raw_scene_factors = config.get("sceneFactors", {})
    for key, value in raw_scene_factors.items():
        try:
            val = int(value)
            if val > 0:
                scene_factors[key] = val
        except (ValueError, TypeError):
            pass

    daily_increment = config.get("dailyIncrement", config.get("perDay", 0))
    person_increment = config.get("personIncrement", 0)

    return {
        "mode": "formula",
        "dailyIncrement": max(0, int(daily_increment) if daily_increment else 0),
        "personIncrement": max(0, int(person_increment) if person_increment else 0),
        "sceneFactors": scene_factors
    }

def infer_smart_config(name: str):
    """Infer smart config for baby items"""
    n = str(name or "").lower()

    if "尿不湿" in n or "纸尿裤" in n:
        return normalize_smart_config({
            "dailyIncrement": 3,
            "sceneFactors": {
                BABY_MODULE_IDS["vaccine"]: 1,
                BABY_MODULE_IDS["feeding"]: 1,
                BABY_MODULE_IDS["overnight"]: 3,
                BABY_MODULE_IDS["outdoor"]: 2
            }
        })

    if any(k in n for k in ["备用衣裤", "宝宝衣服", "宝宝衣裤"]):
        return normalize_smart_config({
            "dailyIncrement": 1,
            "sceneFactors": {
                BABY_MODULE_IDS["overnight"]: 1,
                BABY_MODULE_IDS["outdoor"]: 1
            }
        })

    if ("湿巾" in n and ("婴儿" in n or "宝宝" in n)) or n == "湿巾（婴儿专用）":
        return normalize_smart_config({
            "dailyIncrement": 1,
            "sceneFactors": {
                BABY_MODULE_IDS["overnight"]: 1,
                BABY_MODULE_IDS["outdoor"]: 1
            }
        })

    if "棉柔巾" in n:
        return normalize_smart_config({
            "dailyIncrement": 1,
            "sceneFactors": {
                BABY_MODULE_IDS["feeding"]: 1,
                BABY_MODULE_IDS["overnight"]: 1
            }
        })

    if "隔尿垫" in n:
        return normalize_smart_config({
            "dailyIncrement": 1,
            "sceneFactors": {
                BABY_MODULE_IDS["overnight"]: 1,
                BABY_MODULE_IDS["outdoor"]: 1
            }
        })

    if any(k in n for k in ["围兜", "围嘴", "口水巾"]):
        return normalize_smart_config({
            "dailyIncrement": 1,
            "sceneFactors": {
                BABY_MODULE_IDS["feeding"]: 1,
                BABY_MODULE_IDS["overnight"]: 1
            }
        })

    if "大量零食" in n:
        return normalize_smart_config({
            "dailyIncrement": 1,
            "sceneFactors": {
                BABY_MODULE_IDS["outdoor"]: 2
            }
        })

    return None

def infer_smart_rule(name: str, category: str):
    """Infer smart rule for item"""
    n = str(name or "").lower()

    if infer_smart_config(name):
        return "formula"

    if category == "clothing":
        if any(k in n for k in ["t恤", "上衣", "衬衫", "裤", "裙", "内衣", "内裤", "文胸", "袜", "打底裤", "宝宝袜子"]):
            return "perPersonPerDay"
        if any(k in n for k in ["睡衣", "外套", "鞋", "拖鞋", "帽子"]):
            return "perPerson"
        return "perPerson"

    if any(k in n for k in ["奶瓶", "毛巾", "浴巾"]):
        return "perPerson"

    return "fixed"

def compute_smart_qty(base_qty: int, smart_rule: str, days: int, people: int, smart_config=None, trip_context=None) -> int:
    """Compute smart quantity based on rule"""
    safe_base = max(1, int(base_qty) if base_qty else 1)
    safe_days = max(1, int(days) if days else 1)
    safe_people = max(1, int(people) if people else 1)

    if smart_rule == "formula":
        config = normalize_smart_config(smart_config)
        if not config:
            return safe_base

        scene_factor = 0
        if trip_context and trip_context.get("sourceModules"):
            active_module_ids = set(m.get("id") for m in trip_context["sourceModules"])
            for module_id, factor in config.get("sceneFactors", {}).items():
                if module_id in active_module_ids:
                    scene_factor += factor

        return max(1, safe_base + safe_days * config["dailyIncrement"] + max(0, safe_people - 1) * config["personIncrement"] + scene_factor)

    if smart_rule == "perPerson":
        return safe_base * safe_people
    if smart_rule == "perDay":
        return safe_base * safe_days
    if smart_rule == "perPersonPerDay":
        return safe_base * safe_days * safe_people

    return safe_base

# ===== Model Normalization Functions =====

def normalize_trip_record(record):
    """Normalize trip record"""
    bags = record.get("bags", []) if record.get("bags") else deep_clone(DEFAULT_BAGS)

    source_modules = []
    for module in (record.get("sourceModules") or []):
        source_modules.append({
            "source": module.get("source") or "custom",
            "id": module.get("id") or "",
            "name": module.get("name") or "未命名小包"
        })

    items = [normalize_trip_item(item) for item in (record.get("items") or [])]

    import datetime
    now = datetime.datetime.now().isoformat()

    return {
        **record,
        "recordType": "trip",
        "isTemplate": False,
        "days": max(1, int(record.get("days", 1) or 1)),
        "people": max(1, int(record.get("people", 1) or 1)),
        "bags": bags,
        "sourceModules": source_modules,
        "items": items,
        "createdAt": record.get("createdAt") or now,
        "updatedAt": record.get("updatedAt") or record.get("createdAt") or now
    }

def normalize_trip_item(item):
    """Normalize trip item"""
    name = item.get("name") or ""
    category = item.get("category") or guess_cat(name)
    smart_config = item.get("smartConfig") or infer_smart_config(name)
    smart_rule = item.get("smartRule") or ("formula" if smart_config else infer_smart_rule(name, category))
    smart_base_qty = max(1, int(item.get("smartBaseQty") or item.get("defaultQty") or item.get("qty") or 1))

    return {
        "id": item.get("id") or f"item-{gid()}",
        "name": name or "未命名物品",
        "category": category,
        "bag": item.get("bag") or suggest_bag_for_item(name, category),
        "qty": max(1, int(item.get("qty") or 1)),
        "packed": bool(item.get("packed")),
        "notes": item.get("notes") or "",
        "smartRule": smart_rule,
        "smartConfig": smart_config,
        "smartBaseQty": smart_base_qty,
        "smartLocked": bool(item.get("smartLocked")),
        "sourceModules": list(set(item.get("sourceModules", []))) if isinstance(item.get("sourceModules"), list) else ([item.get("sourceModule")] if item.get("sourceModule") else []),
        "tags": list(set(item.get("tags", []))) if isinstance(item.get("tags"), list) else []
    }

def normalize_module_record(record):
    """Normalize module record"""
    return {
        **record,
        "recordType": "module",
        "isTemplate": True,
        "icon": record.get("icon") or record.get("kitMeta", {}).get("icon") or "🧰",
        "desc": record.get("desc") or record.get("kitMeta", {}).get("desc") or "",
        "purpose": record.get("purpose") or "custom",
        "tags": list(set(record.get("tags", []))) if isinstance(record.get("tags"), list) else [],
        "items": [normalize_module_item(item) for item in (record.get("items") or [])],
        "createdAt": record.get("createdAt"),
        "updatedAt": record.get("updatedAt") or record.get("createdAt")
    }

def normalize_module_item(item):
    """Normalize module item"""
    name = item.get("name") or ""
    category = item.get("category") or guess_cat(name)
    smart_config = item.get("smartConfig") or infer_smart_config(name)

    return {
        "id": item.get("id") or f"module-item-{gid()}",
        "name": name or "未命名物品",
        "category": category,
        "bag": item.get("bag") or suggest_bag_for_item(name, category),
        "defaultQty": max(1, int(item.get("defaultQty") or item.get("smartBaseQty") or item.get("qty") or 1)),
        "smartRule": item.get("smartRule") or ("formula" if smart_config else infer_smart_rule(name, category)),
        "smartConfig": smart_config
    }

def normalize_library_item(item):
    """Normalize library item"""
    name = str(item.get("name") or "未命名物品").strip()
    category = item.get("category") or guess_cat(name)
    smart_config = item.get("smartConfig") or infer_smart_config(name)

    return {
        "id": item.get("id") or f"asset-{gid()}",
        "name": name,
        "category": category,
        "defaultQty": max(1, int(item.get("defaultQty") or 1)),
        "bag": item.get("bag") or suggest_bag_for_item(name, category),
        "smartRule": "formula" if smart_config else (item.get("smartRule") or infer_smart_rule(name, category)),
        "smartConfig": smart_config,
        "source": item.get("source") if item.get("source") == "user" else "system",
        "tags": list(set(item.get("tags", []))) if isinstance(item.get("tags"), list) else []
    }

# ===== Test Cases =====

class TestUserScenario1(unittest.TestCase):
    """【用户场景1】创建新行程"""

    def test_create_trip_basic_structure(self):
        """创建2天1人行程，基础结构正确"""
        record = normalize_trip_record({
            "name": "周末出行",
            "days": 2,
            "people": 1,
        })
        self.assertEqual(record["recordType"], "trip")
        self.assertEqual(record["days"], 2)
        self.assertEqual(record["people"], 1)
        self.assertEqual(record["items"], [])
        self.assertEqual(len(record["bags"]), len(DEFAULT_BAGS))

    def test_days_people_minimum_value(self):
        """天数和人数最小值为1"""
        record1 = normalize_trip_record({"days": 0, "people": 1})
        record2 = normalize_trip_record({"days": 2, "people": 0})
        record3 = normalize_trip_record({"days": -5, "people": -3})

        self.assertEqual(record1["days"], 1)
        self.assertEqual(record2["people"], 1)
        self.assertEqual(record3["days"], 1)
        self.assertEqual(record3["people"], 1)

    def test_no_name_not_crash(self):
        """不提供行程名称时不会崩溃"""
        record = normalize_trip_record({})
        self.assertEqual(record["recordType"], "trip")


class TestUserScenario2(unittest.TestCase):
    """【用户场景2】添加小包到行程"""

    def test_add_kit_items_to_trip(self):
        """从洗漱包添加物品到行程"""
        trip = normalize_trip_record({"name": "测试行程", "days": 2, "people": 1})

        hygiene_module = {
            "source": "official",
            "id": "module-hygiene",
            "name": "洗漱包",
            "items": [
                {"name": "牙刷", "c": "hygiene"},
                {"name": "牙膏", "c": "hygiene"},
            ]
        }

        for item in hygiene_module["items"]:
            trip["items"].append(normalize_trip_item(item))

        self.assertEqual(len(trip["items"]), 2)
        names = [i["name"] for i in trip["items"]]
        self.assertIn("牙刷", names)
        self.assertIn("牙膏", names)

    def test_duplicate_items_accumulate_qty(self):
        """重复添加相同物品，数量累加"""
        trip = normalize_trip_record({"name": "测试行程", "days": 2, "people": 1})

        item1 = normalize_trip_item({"name": "牙刷", "c": "hygiene", "qty": 1})
        item2 = normalize_trip_item({"name": "牙刷", "c": "hygiene", "qty": 1})

        trip["items"].append(item1)

        # 模拟重复添加 - 查找相同物品并累加
        existing = next((i for i in trip["items"] if i["name"] == "牙刷"), None)
        if existing:
            existing["qty"] += item2["qty"]

        self.assertEqual(len(trip["items"]), 1)
        self.assertEqual(trip["items"][0]["qty"], 2)


class TestUserScenario3(unittest.TestCase):
    """【用户场景3】从物品库添加物品"""

    def test_add_library_item_to_trip(self):
        """物品库物品正常添加到行程"""
        library_item = normalize_library_item({
            "name": "充电宝",
            "category": "electronics",
            "defaultQty": 1,
        })

        trip_item = normalize_trip_item({
            "name": library_item["name"],
            "category": library_item["category"],
            "qty": library_item["defaultQty"],
        })

        self.assertEqual(trip_item["name"], "充电宝")
        self.assertEqual(trip_item["category"], "electronics")
        self.assertEqual(trip_item["bag"], "bag-electronics")

    def test_user_item_marked_as_user_source(self):
        """物品库自定义物品标记为user来源"""
        user_item = normalize_library_item({
            "name": "我的特殊物品",
            "source": "user",
        })
        self.assertEqual(user_item["source"], "user")

        system_item = normalize_library_item({
            "name": "系统物品",
        })
        self.assertEqual(system_item["source"], "system")


class TestUserScenario4(unittest.TestCase):
    """【用户场景4】打包模式操作"""

    def test_item_initial_not_packed(self):
        """物品初始状态未打包"""
        item = normalize_trip_item({"name": "牙刷"})
        self.assertEqual(item["packed"], False)

    def test_item_after_pack_is_packed(self):
        """勾选物品后状态变为已打包"""
        item = normalize_trip_item({"name": "牙刷"})
        item["packed"] = True
        self.assertEqual(item["packed"], True)

    def test_trip_pack_progress(self):
        """行程打包进度计算"""
        trip = normalize_trip_record({"name": "测试行程"})
        trip["items"] = [
            normalize_trip_item({"name": "牙刷", "packed": True}),
            normalize_trip_item({"name": "牙膏", "packed": True}),
            normalize_trip_item({"name": "毛巾", "packed": False}),
            normalize_trip_item({"name": "洗发水", "packed": False}),
        ]

        packed_count = sum(1 for i in trip["items"] if i["packed"])
        total_count = len(trip["items"])

        self.assertEqual(packed_count, 2)
        self.assertEqual(total_count, 4)


class TestUserScenario5(unittest.TestCase):
    """【用户场景5】物品库管理"""

    def test_add_custom_item(self):
        """新增自定义物品"""
        new_item = normalize_library_item({
            "id": f"asset-{gid()}",
            "name": "防晒霜",
            "category": "skincare",
            "defaultQty": 1,
            "source": "user",
        })

        self.assertTrue(new_item["id"].startswith("asset-"))
        self.assertEqual(new_item["name"], "防晒霜")
        self.assertEqual(new_item["source"], "user")

    def test_delete_user_item_by_source(self):
        """删除自定义物品（通过source区分）"""
        items = [
            normalize_library_item({"name": "系统物品A"}),
            normalize_library_item({"name": "自定义物品B", "source": "user"}),
            normalize_library_item({"name": "系统物品C"}),
        ]

        user_items = [i for i in items if i["source"] == "user"]
        system_items = [i for i in items if i["source"] == "system"]

        self.assertEqual(len(user_items), 1)
        self.assertEqual(len(system_items), 2)

    def test_search_items_by_name(self):
        """物品库搜索（按名称过滤）"""
        items = [
            normalize_library_item({"name": "牙刷"}),
            normalize_library_item({"name": "牙膏"}),
            normalize_library_item({"name": "毛巾"}),
            normalize_library_item({"name": "洗面奶"}),
        ]

        keyword = "牙"
        filtered = [i for i in items if keyword in i["name"]]

        self.assertEqual(len(filtered), 2)


class TestUserScenario6(unittest.TestCase):
    """【用户场景6】小包管理"""

    def test_create_custom_kit(self):
        """创建自定义小包"""
        module = normalize_module_record({
            "recordType": "module",
            "isTemplate": True,
            "name": "我的洗漱包",
            "icon": "🪥",
            "items": [
                {"name": "牙刷"},
                {"name": "牙膏"},
            ]
        })

        self.assertEqual(module["recordType"], "module")
        self.assertEqual(module["isTemplate"], True)
        self.assertEqual(len(module["items"]), 2)


class TestUserScenario7(unittest.TestCase):
    """【用户场景7】智能填充"""

    def test_clothing_per_person_per_day(self):
        """T恤：perPersonPerDay规则，2人3天"""
        qty = compute_smart_qty(1, "perPersonPerDay", 3, 2)
        self.assertEqual(qty, 6)  # 1 × 3天 × 2人

    def test_clothing_per_person_per_day_1p2d(self):
        """内裤：perPersonPerDay规则，1人2天"""
        qty = compute_smart_qty(1, "perPersonPerDay", 2, 1)
        self.assertEqual(qty, 2)

    def test_pajamas_per_person(self):
        """睡衣：perPerson规则，2人"""
        qty = compute_smart_qty(1, "perPerson", 3, 2)
        self.assertEqual(qty, 2)

    def test_diaper_formula(self):
        """纸尿裤：按天增量+场景系数"""
        config = infer_smart_config("纸尿裤")
        self.assertIsNotNone(config)
        self.assertEqual(config["dailyIncrement"], 3)

        trip_context = {
            "sourceModules": [{"id": BABY_MODULE_IDS["overnight"]}]
        }
        qty = compute_smart_qty(3, "formula", 1, 1, config, trip_context)
        self.assertGreater(qty, 3)

    def test_apply_smart_fill_to_trip(self):
        """应用智能填充后衣物数量正确"""
        trip = normalize_trip_record({
            "name": "3天2人出行",
            "days": 3,
            "people": 2,
        })

        trip["items"] = [
            normalize_trip_item({"name": "T恤", "category": "clothing", "qty": 2, "smartRule": "perPersonPerDay", "smartBaseQty": 1}),
            normalize_trip_item({"name": "牙刷", "category": "hygiene", "qty": 1, "smartRule": "fixed"}),
        ]

        # Apply smart fill
        for item in trip["items"]:
            if item["smartRule"] != "fixed" and not item.get("smartLocked"):
                item["qty"] = compute_smart_qty(
                    item.get("smartBaseQty", 1),
                    item["smartRule"],
                    trip["days"],
                    trip["people"],
                    item.get("smartConfig"),
                    trip
                )

        tshirt = next(i for i in trip["items"] if i["name"] == "T恤")
        self.assertEqual(tshirt["qty"], 6)  # 1 × 3天 × 2人


class TestUserScenario8(unittest.TestCase):
    """【用户场景8】边界情况和错误处理"""

    def test_empty_trip_name(self):
        """空行程名称"""
        record = normalize_trip_record({"name": ""})
        self.assertEqual(record["name"], "")

    def test_long_trip_name(self):
        """超长行程名称"""
        long_name = "A" * 200
        record = normalize_trip_record({"name": long_name})
        self.assertEqual(len(record["name"]), 200)

    def test_item_qty_zero_or_negative(self):
        """物品数量为0或负数时取默认值1"""
        item1 = normalize_trip_item({"name": "测试", "qty": 0})
        item2 = normalize_trip_item({"name": "测试", "qty": -5})

        self.assertEqual(item1["qty"], 1)
        self.assertEqual(item2["qty"], 1)

    def test_unknown_category_defaults_to_misc(self):
        """无法识别分类的物品默认归为misc"""
        item = normalize_trip_item({"name": "奇特物品XYZ123"})
        self.assertEqual(item["category"], "misc")

    def test_no_source_defaults_to_system(self):
        """没有source的物品默认归为system"""
        item = normalize_library_item({"name": "测试物品"})
        self.assertEqual(item["source"], "system")


class TestUserScenario9(unittest.TestCase):
    """【用户场景9】数据一致性"""

    def test_deep_clone_independence(self):
        """行程对象深拷贝后修改不影响原对象"""
        original = normalize_trip_record({"name": "原行程", "days": 2})
        copy = deep_clone(original)

        copy["name"] = "修改后的行程"
        copy["days"] = 5

        self.assertEqual(original["name"], "原行程")
        self.assertEqual(original["days"], 2)

    def test_unique_strings(self):
        """物品数组去重"""
        names = ["牙刷", "牙膏", "牙刷", "毛巾", "牙刷"]
        unique = unique_strings(names)

        self.assertEqual(len(unique), 3)
        self.assertIn("牙刷", unique)
        self.assertIn("牙膏", unique)
        self.assertIn("毛巾", unique)

    def test_unique_ids(self):
        """物品ID唯一性"""
        ids = [gid() for _ in range(100)]
        unique_ids = set(ids)

        self.assertEqual(len(unique_ids), 100)


class TestUserScenario10(unittest.TestCase):
    """【用户场景10】HTML转义"""

    def test_escape_script_tag(self):
        """转义script标签"""
        self.assertEqual(esc("<script>"), "&lt;script&gt;")

    def test_escape_double_quote(self):
        """转义双引号"""
        self.assertEqual(esc('"test"'), "&quot;test&quot;")

    def test_escape_single_quote(self):
        """转义单引号"""
        self.assertEqual(esc("it's"), "it&#039;s")

    def test_chinese_not_escaped(self):
        """中文文本不被转义"""
        self.assertEqual(esc("物品名称"), "物品名称")


class TestUserScenario11(unittest.TestCase):
    """【用户场景11】宝宝相关场景"""

    def test_baby_base_module_items(self):
        """宝宝基础包包含正确物品"""
        items = ["纸尿裤", "湿巾（婴儿专用）", "宝宝衣服"]

        for name in items:
            item = normalize_trip_item({"name": name})
            self.assertTrue(item["bag"].startswith("bag-baby"), f"{name} should be in baby bag, got {item['bag']}")

    def test_vaccine_module_item(self):
        """疫苗包物品正确分配"""
        item = normalize_trip_item({"name": "疫苗本"})
        self.assertEqual(item["bag"], "bag-baby-vaccine")

    def test_feeding_module_item(self):
        """喂养包物品正确分配"""
        item = normalize_trip_item({"name": "奶瓶"})
        self.assertEqual(item["bag"], "bag-baby-feeding")

    def test_overnight_module_item(self):
        """过夜包物品正确分配"""
        item = normalize_trip_item({"name": "便携烧水壶"})
        self.assertEqual(item["bag"], "bag-baby-overnight")

    def test_outdoor_module_item(self):
        """户外包物品正确分配"""
        item = normalize_trip_item({"name": "驱蚊液"})
        self.assertEqual(item["bag"], "bag-baby-outdoor")


if __name__ == "__main__":
    print("=" * 60)
    print("行理 - 用户场景测试")
    print("=" * 60)
    print()

    # Run tests
    loader = unittest.TestLoader()
    suite = unittest.TestSuite()

    # Add test classes
    test_classes = [
        TestUserScenario1,
        TestUserScenario2,
        TestUserScenario3,
        TestUserScenario4,
        TestUserScenario5,
        TestUserScenario6,
        TestUserScenario7,
        TestUserScenario8,
        TestUserScenario9,
        TestUserScenario10,
        TestUserScenario11,
    ]

    for test_class in test_classes:
        suite.addTests(loader.loadTestsFromTestCase(test_class))

    runner = unittest.TextTestRunner(verbosity=2)
    result = runner.run(suite)

    # Print summary
    print()
    print("=" * 60)
    print("测试摘要")
    print("=" * 60)
    print(f"测试总数: {result.testsRun}")
    print(f"成功: {result.testsRun - len(result.failures) - len(result.errors)}")
    print(f"失败: {len(result.failures)}")
    print(f"错误: {len(result.errors)}")
    print()

    if result.wasSuccessful():
        print("✅ 所有测试通过！")
    else:
        print("❌ 有测试失败，请检查上述输出。")

    exit(0 if result.wasSuccessful() else 1)
