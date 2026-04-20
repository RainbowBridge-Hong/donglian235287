# -*- coding: utf-8 -*-
"""
东濂置业数据爬虫
目标：爬取海口房产、土地、网约车、学车等真实数据
"""
import requests
import json
import re
import time
from datetime import datetime

HEADERS = {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
    'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
    'Accept-Language': 'zh-CN,zh;q=0.9,en;q=0.8',
}

def crawl_anjuke_loupan():
    """爬取安居客海口新楼盘"""
    url = "https://www.anjuke.com/haikou/loupan/"
    try:
        resp = requests.get(url, headers=HEADERS, timeout=15)
        print(f"安居客楼盘状态: {resp.status_code}")
        # 查看内容
        if resp.status_code == 200:
            content = resp.text[:2000]
            print(f"内容预览: {content[:500]}")
            return resp.text
    except Exception as e:
        print(f"安居客楼盘错误: {e}")
    return None

def crawl_58_loupan():
    """爬取58同城海口房产"""
    urls = [
        "https://www.58.com/haikou/loupan.html",
        "https://www.58.com/haikou/ershoufang/",
    ]
    for url in urls:
        try:
            resp = requests.get(url, headers=HEADERS, timeout=15)
            print(f"58 {url} 状态: {resp.status_code}")
            if resp.status_code == 200:
                print(f"内容长度: {len(resp.text)}")
        except Exception as e:
            print(f"58错误: {e}")
        time.sleep(1)

def crawl_sina_finance():
    """爬取新浪财经房产新闻"""
    url = "https://finance.sina.com.cn/realstock/company/hnjc.shtml"
    try:
        resp = requests.get(url, headers=HEADERS, timeout=15)
        print(f"新浪财经状态: {resp.status_code}")
    except Exception as e:
        print(f"新浪错误: {e}")

def crawl_hainan_news():
    """爬取海南房产新闻"""
    urls = [
        "https://www.hinews.cn/news/jiaoa/",
        "https://www.hainan.gov.cn/hnzg/",
    ]
    for url in urls:
        try:
            resp = requests.get(url, headers=HEADERS, timeout=15)
            print(f"海南政府网 {url}: {resp.status_code}")
        except Exception as e:
            print(f"错误 {url}: {e}")
        time.sleep(1)

def test_connection():
    """测试各网站连接"""
    print("=" * 50)
    print("开始测试网站连接...")
    print("=" * 50)
    
    test_urls = [
        ("安居客", "https://www.anjuke.com/"),
        ("58同城", "https://www.58.com/"),
        ("房天下", "https://www.fang.com/"),
        ("贝壳找房", "https://www.ke.com/"),
        ("海南政府网", "https://www.hainan.gov.cn/"),
    ]
    
    results = []
    for name, url in test_urls:
        try:
            start = time.time()
            resp = requests.get(url, headers=HEADERS, timeout=10)
            elapsed = time.time() - start
            status = "OK" if resp.status_code == 200 else f"FAIL({resp.status_code})"
            print(f"{name}: {status} ({elapsed:.1f}s)")
            results.append({"name": name, "url": url, "status": resp.status_code, "time": elapsed})
        except Exception as e:
            print(f"{name}: FAIL {e}")
            results.append({"name": name, "url": url, "error": str(e)})
    
    return results

if __name__ == "__main__":
    print("东濂置业数据爬虫 - 连接测试")
    print("测试时间:", datetime.now().strftime("%Y-%m-%d %H:%M:%S"))
    print()
    
    results = test_connection()
    
    print()
    print("=" * 50)
    print("测试完成")
    print("=" * 50)
