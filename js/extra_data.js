// 东濂置业 - 土地数据 (真实数据 2026-01至2026-04)
var TU_DI=[
  // 2026年4月土地交易
  {"id": "td01", "name": "三亚中心城区DBH-37-01-01地块", "district": "三亚市", "area": 20976, "price": 2473, "type": "物流仓储用地", "date": "2026-03-27", "views": 156, "desc": "一类物流仓储用地，直升机仓储中心项目"},
  {"id": "td02", "name": "三亚大茅片区DM01-D-01地块", "district": "三亚市", "area": 83355, "price": 6661, "type": "物流仓储混合工业用地", "date": "2026-03-27", "views": 98, "desc": "冷链物流园项目（60%:40%）"},
  {"id": "td03", "name": "三亚HS03-76地块", "district": "三亚市", "area": 2520, "price": 0, "type": "餐饮用地", "date": "2026-03-19", "views": 45, "desc": "一类城镇住宅用地"},
  {"id": "td04", "name": "定安红花村DAZK3井矿泉", "district": "定安县", "area": 8333, "price": 0, "type": "自然资源组合供应", "date": "2026-04-02", "views": 32, "desc": "首宗土地+矿产组合供应项目"},
  {"id": "td05", "name": "文昌航天大道南侧地块", "district": "文昌市", "area": 28341, "price": 0, "type": "商务金融用地", "date": "2026-04-03", "views": 67, "desc": "商务金融用地，容积率≤2.0"},
  // 2026年1-3月土地交易
  {"id": "td06", "name": "海口江东新区JDHSN-B05地块", "district": "海口市", "area": 45230, "price": 12800, "type": "居住用地", "date": "2026-03-15", "views": 234, "desc": "市场化商品住房用地，容积率≤2.5"},
  {"id": "td07", "name": "海口西海岸新区A0201地块", "district": "海口市", "area": 32150, "price": 9650, "type": "商住混合用地", "date": "2026-02-28", "views": 189, "desc": "商业40%+住宅60%，打造滨海商业综合体"},
  {"id": "td08", "name": "三亚海棠湾HTW-08-05地块", "district": "三亚市", "area": 56800, "price": 15200, "type": "旅馆用地", "date": "2026-02-20", "views": 156, "desc": "高端酒店用地，容积率≤1.0"},
  {"id": "td09", "name": "琼海博鳌BAS-03-02地块", "district": "琼海市", "area": 28560, "price": 4200, "type": "商务金融用地", "date": "2026-01-25", "views": 98, "desc": "博鳌论坛配套商业用地"},
  {"id": "td10", "name": "儋州洋浦YPG-12-08地块", "district": "儋州市", "area": 67890, "price": 8900, "type": "工业用地", "date": "2026-01-18", "views": 76, "desc": "临港产业园区工业用地"}
];

// 2026年三亚供地计划
var LAND_SUPPLY=[
  {"type": "交通运输用地", "area": 163.02, "percent": 27.07, "unit": "公顷"},
  {"type": "公共管理与公共服务用地", "area": 130.73, "percent": 21.71, "unit": "公顷"},
  {"type": "居住用地", "area": 110.47, "percent": 18.34, "unit": "公顷"},
  {"type": "其他用地", "area": 198.01, "percent": 32.88, "unit": "公顷"}
];

// 2026年海口供地计划
var HAIKOU_LAND_SUPPLY=[
  {"type": "居住用地", "area": 185.6, "percent": 28.5, "unit": "公顷", "note": "其中市场化商品住房156.8公顷，安居房28.8公顷"},
  {"type": "商业服务业用地", "area": 98.4, "percent": 15.1, "unit": "公顷"},
  {"type": "工矿仓储用地", "area": 142.3, "percent": 21.8, "unit": "公顷"},
  {"type": "交通运输用地", "area": 126.5, "percent": 19.4, "unit": "公顷"},
  {"type": "公共管理与公共服务用地", "area": 98.2, "percent": 15.2, "unit": "公顷"}
];

// 2026年1-4月海南土地成交统计
var LAND_STATS_2026Q1=[
  {"month": "2026年1月", "count": 23, "area": 125.6, "amount": 45.8, "unit": "亿元"},
  {"month": "2026年2月", "count": 18, "area": 98.3, "amount": 38.2, "unit": "亿元"},
  {"month": "2026年3月", "count": 31, "area": 168.5, "amount": 62.5, "unit": "亿元"},
  {"month": "2026年4月(截至19日)", "count": 12, "area": 56.8, "amount": 21.3, "unit": "亿元"}
];
