# -*- coding: utf8 -*-
import hashlib
import base58

def check_printable(c):
    return c >= 0x20 and c <= 0x7e

def part1():
    after = [0xb8, 0x34, 0x2e, 0x58, 0x96, 0x6c]
    before = []
    possible = []
    
    for v in after:
        v = v>>4|v<<4&0xff
        v = (v&0xcc)>>2|(v&0x33)<<2
        v = (v&0xaa)>>1|(v&0x55)<<1
        before.append(v)
    for i in range(0x20, 0x7f):
        for j in range(0x20, 0x7f):
            a2 = i ^ before[4]
            a3 = j ^ before[5]            
            a4 = i ^ before[2]
            a5 = j ^ before[3]
            if check_printable(a2) and check_printable(a3) and check_printable(a4) and check_printable(a5):
                possible.append(''.join([chr(c) for c in [i, j, a2, a3, a4, a5]]))
    return possible

def part2():
    possible = []
    pT = ['T', 't']
    pH = ['H', 'h']
    pN = ['N', 'n']
    for t in pT:
        for h in pH:
            for n in pN:
                possible.append(''.join([t, h, 'İ', n, 'K']))
    return possible

# this is a simple base58 encode and you can decode easily
def part3():
     return bytes.decode(base58.b58decode('DQuf7TsLf6W'))

def part4():
    return 'Interest1n9??!'

def sha1_check(possible):
    true_sha1 = 'da117a29dd40fd69768ee49e35f82113f9868bba'
    for flag in possible:
        sha1 = hashlib.sha1()
        sha1.update(flag.encode('utf8'))
        if sha1.hexdigest() == true_sha1:
            return flag

def main():
    f1 = part1()
    f2 = part2()
    f3 = part3()
    f4 = part4()
    
    possible = []
    
    for p in f1:
        for q in f2:
            possible.append("*ctf{%s}" % ('_'.join([p, q, f3, f4])))
    
    print(sha1_check(possible))

main()