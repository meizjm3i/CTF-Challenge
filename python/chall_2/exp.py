# -*- coding: utf-8 -*-
import json, uuid, hashlib
import random,string

EMPTY_HASH = '0' * 64
DIFFICULTY = int('00000' + 'f' * 59, 16)

def hash(x):
    return hashlib.sha256(hashlib.md5(x).digest()).hexdigest()

def hash_reducer(x, y):
    return hash(hash(x) + hash(y))

# 对 output 进行hash
def hash_utxo(utxo):
    return reduce(hash_reducer, [utxo['id'], utxo['addr'], str(utxo['amount'])])

def create_output_utxo(addr_to, amount):
    utxo = {'id': str(uuid.uuid4()), 'addr': addr_to, 'amount': amount}
    utxo['hash'] = str(hash_utxo(utxo))
    return utxo

# 对 transactions 进行hash
def hash_tx(tx):
    return reduce(hash_reducer, [
        reduce(hash_reducer, tx['input'], EMPTY_HASH),
        reduce(hash_reducer, [utxo['hash'] for utxo in tx['output']], EMPTY_HASH)
    ])

#对整个块 hash
def hash_block(block):
    return reduce(hash_reducer, [block['prev'], block['nonce'],
                                 reduce(hash_reducer, [tx['hash'] for tx in block['transactions']], EMPTY_HASH)])

prev = "c5a133c28ade2827223a0aa5dddb3f6c3120dbe2e31291fa4a581d6d0aeea0bc"
input = ["ba8163d7-58f4-4b83-b12e-4d4000036868"]
signature = ['3955b7a2003c4b0656791dc9f405441555a12d2c2d24a4011ac41a1bf96acbcc1bf1d3f13193a37c8efee6e6eac75e57']


address = '996c63922bb8675c7da50fd0966c444520d85869a4286f9f15f5645494d55db7c10e07bf81819f8ce41c29ec9203e43d'
output = [create_output_utxo(address,1000000)]

transactions = {
        "input":input,
        "signature":signature,
        "output":output
    }

# 对 transactions 进行签名
hash_transactions = hash_tx(transactions)
transactions['hash'] = str(hash_transactions)
# 爆破（挖矿，找到满足条件的hash）
def fuzz(block, size=20):
    CHARS = string.letters + string.digits
    while True:
        rnds = ''.join(random.choice(CHARS) for _ in range(size))
        block['nonce'] = rnds
        block_hash = str(hash_block(block))
        # 转换成 16 进制
        tmp_hash = int(block_hash, 16)
        # POW 验证工作
        if tmp_hash < DIFFICULTY:
            block['hash'] = block_hash
            return block

# 创建符合条件的块
block = {
    "prev":prev,
    "transactions":[transactions]
}
ok_block = fuzz(block)
print(json.dumps(ok_block))
# 创建一个空块
empty_tmp = {
    "prev" : ok_block['hash'],
    "transactions" : []
}
empty_block1 = fuzz(empty_tmp)
print(json.dumps(empty_block1))

empty_tmp = {
    "prev" : empty_block1['hash'],
    "transactions" : []
}
empty_block2 = fuzz(empty_tmp)
print(json.dumps(empty_block2))

empty_tmp = {
    "prev" : empty_block2['hash'],
    "transactions" : []
}
empty_block3 = fuzz(empty_tmp)
print(json.dumps(empty_block3))

empty_tmp = {
    "prev" : empty_block3['hash'],
    "transactions" : []
}
empty_block4 = fuzz(empty_tmp)
print(json.dumps(empty_block4))