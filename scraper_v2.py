# -*- coding: utf-8 -*-
"""
东濂置业数据爬虫 v2 - 真实数据采集
目标：安居客、58同城、房天下、贝壳
"""
import requests
import json
import re
import time
import os
from datetime import datetime
from bs4 import BeautifulSoup

HEADERS = {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
    'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
    'Accept-Language': 'zh-CN,zh;q=0.9,en;q=0.8',
    'Referer': 'https://www.anjuke.com/',
}

OUTPUT_DIR = r"C:\Users\admin\.qclaw\workspace-agent-94c2ca1d\donglian235287\js"

def save_data(filename, data_var_name, data):
    """保存为JS变量格式"""
    filepath = os.path.join(OUTPUT_DIR, filename)
    content = f"var {data_var_name}={json.dumps(data, ensure_ascii=False, indent=2)};"
    with open(filepath, 'w', encoding='utf-8') as f:
        f.write(content)
    print(f"已保存: {filepath} ({len(data)}条)")

def crawl_anjuke_new_houses():
    """安居客新楼盘"""
    print("\n=== 安居客新楼盘 ===")
    # 安居客移动端API可能更容易获取数据
    api_url = "https://app.api.anjuke.com/v30/ajk_bbs/threadlist"
    
    # 尝试爬取楼盘列表页
    urls = [
        "https://www.anjuke.com/haikou/loupan/",
        "https://hai.fang.anjuke.com/loupan/",
    ]
    
    results = []
    for url in urls:
        try:
            resp = requests.get(url, headers=HEADERS, timeout=15)
            print(f"{url}: {resp.status_code}")
            if resp.status_code == 200:
                soup = BeautifulSoup(resp.text, 'lxml')
                # 尝试找楼盘名称
                titles = soup.find_all('a', href=re.compile(r'/loupan/'))
                for t in titles[:10]:
                    name = t.get_text(strip=True)
                    if name and len(name) > 2:
                        results.append({"name": name, "source": "anjuke"})
        except Exception as e:
            print(f"错误: {e}")
        time.sleep(1)
    
    print(f"找到 {len(results)} 个楼盘")
    return results

def crawl_anjuke_second_hand():
    """安居客二手房"""
    print("\n=== 安居客二手房 ===")
    url = "https://haikou.anjuke.com/sale/"
    
    try:
        resp = requests.get(url, headers=HEADERS, timeout=15)
        print(f"状态: {resp.status_code}")
        if resp.status_code == 200:
            soup = BeautifulSoup(resp.text, 'lxml')
            # 找房源标题
            titles = soup.find_all('a', href=re.compile(r'/sale/\w+\.html'))
            print(f"找到 {len(titles)} 个房源链接")
    except Exception as e:
        print(f"错误: {e}")

def crawl_58_second_hand():
    """58同城二手房"""
    print("\n=== 58同城二手房 ===")
    url = "https://www.58.com/haikou/ershoufang/"
    
    try:
        resp = requests.get(url, headers=HEADERS, timeout=15)
        print(f"状态: {resp.status_code}")
        if resp.status_code == 200:
            soup = BeautifulSoup(resp.text, 'lxml')
            # 58同城通常有列表
            items = soup.find_all('li', class_=re.compile(r'house'))
            print(f"找到 {len(items)} 个房源项")
    except Exception as e:
        print(f"错误: {e}")

def crawl_58_rent():
    """58同城租房"""
    print("\n=== 58同城租房 ===")
    url = "https://www.58.com/haikou/chuzu/"
    
    try:
        resp = requests.get(url, headers=HEADERS, timeout=15)
        print(f"状态: {resp.status_code}")
    except Exception as e:
        print(f"错误: {e}")

def crawl_fang_tudi():
    """房天下土地"""
    print("\n=== 房天下土地 ===")
    url = "https://www.fang.com/tudi/"
    
    try:
        resp = requests.get(url, headers=HEADERS, timeout=15)
        print(f"状态: {resp.status_code}")
        if resp.status_code == 200:
            soup = BeautifulSoup(resp.text, 'lxml')
            # 尝试找土地信息
            links = soup.find_all('a', href=re.compile(r'tudi'))
            print(f"找到 {len(links)} 个土地链接")
    except Exception as e:
        print(f"错误: {e}")

def crawl_news():
    """爬取房产新闻资讯"""
    print("\n=== 房产新闻 ===")
    
    news_sources = [
        ("新浪房产", "https://finance.sina.com.cn/realstock/"),
        ("凤凰网房产", "https://house.ifeng.com/"),
        ("腾讯房产", "https://house.qq.com/"),
    ]
    
    news_list = []
    for name, url in news_sources:
        try:
            resp = requests.get(url, headers=HEADERS, timeout=15)
            if resp.status_code == 200:
                soup = BeautifulSoup(resp.text, 'lxml')
                # 尝试找新闻标题
                titles = soup.find_all(['a', 'h3', 'h2'], string=re.compile(r'房|地产|海口|海南'))
                for t in titles[:5]:
                    text = t.get_text(strip=True) if hasattr(t, 'get_text') else str(t)
                    if text and len(text) > 5:
                        news_list.append({
                            "title": text[:100],
                            "source": name,
                            "date": datetime.now().strftime("%Y-%m-%d")
                        })
                print(f"{name}: 找到 {len(titles)} 条")
        except Exception as e:
            print(f"{name} 错误: {e}")
        time.sleep(1)
    
    return news_list

def crawl_hainan_policy():
    """爬取海南房产政策"""
    print("\n=== 海南房产政策 ===")
    
    urls = [
        ("海南省住建厅", "http://zjt.hainan.gov.cn/"),
        ("海口市住建局", "http://zjj.haikou.gov.cn/"),
    ]
    
    policy_list = []
    for name, url in urls:
        try:
            resp = requests.get(url, headers=HEADERS, timeout=15, verify=False)
            if resp.status_code == 200:
                soup = BeautifulSoup(resp.text, 'lxml')
                # 找政策相关链接
                links = soup.find_all('a', href=re.compile(r'zfxxgk|policy|news'))
                for l in links[:5]:
                    text = l.get_text(strip=True)
                    if text and len(text) > 5:
                        policy_list.append({
                            "title": text[:100],
                            "source": name,
                            "date": datetime.now().strftime("%Y-%m-%d")
                        })
                print(f"{name}: 找到 {len(links)} 条")
        except Exception as e:
            print(f"{name} 错误: {e}")
        time.sleep(1)
    
    return policy_list

def generate_sample_data():
    """生成示例数据结构 - 基于真实网站格式"""
    print("\n=== 生成示例数据 ===")
    
    # 楼盘数据格式示例
    loupan = [
        {"id": "lp001", "name": "测试楼盘1", "district": "龙华区", "price": 18000, "wy": 2.5, "tc": 120, "xq": "海口九小", "date": "2026-04-20", "views": 100, "desc": "测试数据"},
    ]
    
    # 土地数据格式
    tudi = [
        {"id": "td01", "name": "测试地块1", "district": "龙华区", "area": 10000, "price": 20000, "type": "住宅用地", "date": "2026-04-20", "views": 50, "desc": "测试数据"},
    ]
    
    # 新闻资讯格式
    news = [
        {"id": "fc001", "title": "测试新闻标题", "content": "测试内容", "source": "测试来源", "date": "2026-04-20", "views": 100},
    ]
    
    print(f"楼盘: {len(loupan)}条")
    print(f"土地: {len(tudi)}条")
    print(f"新闻: {len(news)}条")
    
    return loupan, tudi, news

if __name__ == "__main__":
    print("东濂置业数据爬虫 v2")
    print("=" * 50)
    
    # 先生成示例结构
    loupan, tudi, news = generate_sample_data()
    
    # 尝试爬取真实数据
    crawl_anjuke_new_houses()
    crawl_58_second_hand()
    crawl_news()
    crawl_hainan_policy()
    
    print("\n" + "=" * 50)
    print("爬取完成")
    print("=" * 50)
