# 题目来源： 2018 *CTF 
# ez-js 

## Idea

This challenge is about four strange but interesting js properties.

I learn these strange properties from garzon and some blogs. Thanks a lot~~ 

### string xor
```javascript
('0x11111111111111'^'0x11111111111113') === 2 // true
('0x111111111111111111111111111111'^'0x111111111111111111111111111111133') === 0 // true
```

### toString
```javascript
function index(i) {
    this.i = i;
    this.toString = function() {
        return i++;
    }
}

const i = new index(0);
const arr = [0, 1, 2];
console.log(arr[i]); // 0
console.log(arr[i]); // 1
console.log(arr[i]); // 2
```

### sort
```javascript
const arr = [1, 2, 11, 22, 111, 222]
console.log(arr.sort()) // [ 1, 11, 111, 2, 22, 222 ]
```

### unicode toUpperCase or toLowerCase
```javascript
'İ'.toLowerCase() === 'i̇' // true // Attention! This is not 'i' but looks like it
'K'.toLowerCase() === 'k' // true
```

## Writeup

There are 8 steps to solve the challenge:

### extract data from har

It's easy find `main.js` from the `ez-js.har` and you will find what you input is the flag.

### functions and args

I use strange `toString()` here. As `_0x1df991` is a obj, so if you use `args[_0x1df991]`, it will invoke its `toString()` method, return value of `i`, and `i` will increase.

```javascript
const funcs = [check1, check2, check3, check4];
const args = [
    [_0x225f('0x4', '^n&i')],
    ['0xb8342e58966c'],
    ['0x796ee5dd617265ff777f6f6cc73d2e3d', '0x7dfee9e078e8b'],
    ['0x796f755f6172655f77726f6e673d2e3d', '0x7468693076e6b'],
    ['E5XncQemjRg'],
    ['DQuf7TsLf6W'],
    ['0xcc6e657413726e3974653f3f7312', '0x7413656e39726e3f3f65127374cc'],
    ['0x496e657431726e3974653f3f7321', '0x7431656e39726e3f3f6521737449']
];
function index(_0x286f51) {
    this['i'] = _0x286f51;
    this['toString'] = function () {
        return _0x286f51++;
    };
}
function check(_0x549363) {
    const _0x2dd0a0 = [];
    funcs['forEach'](_0x6161f => {
        _0x2dd0a0['push'](_0x6161f);
        _0x2dd0a0['push'](Array['from'](funcs)['sort'](() => {
            return 0.5 - Math['random']();
        })[0x0]);
    });
    _0x2dd0a0['unshift'](math_check);
    let _0x1df991 = new index(0x0);
    return _0x549363[_0x225f('0x5', '$%O2')] === 0x2a && _0x2dd0a0['shift']()(_0x549363) && [..._0x549363]['filter']((_0x75ff26, _0x4dd2bd) => {
        return _0x4dd2bd >= 0x5 && _0x4dd2bd <= 0x28;
    })['join']('')['split']('_')['map'](_0x5c9b4c => {
        return _0x2dd0a0[_0x1df991](_0x5c9b4c, args[_0x1df991]);
    })['reduce']((_0x338011, _0x398c4a) => {
        return _0x338011 && _0x398c4a;
    });
}
```

If you understand this, it is easy to find out what the true functions and args are.

```javascript
const funcs = [check1, check2, check3, check4]
const args = [
    ['0xb8342e58966c'],
    ['0x796f755f6172655f77726f6e673d2e3d', '0x7468693076e6b'],
    ['DQuf7TsLf6W'],
    ['0x496e657431726e3974653f3f7321', '0x7431656e39726e3f3f6521737449']
];
```

And at next, we need to pass all check functions.

### math_check

If you know what the javascript sort is, you will get the true answer, if not, sorry you may be confused why you can't get the answer/(ㄒoㄒ)/~~

Luckily, you can get hint from challenge `simpleweb`.

Here is the answer:
```
42*2 + 99*3 + 116*5 + 102*7 + 123*11 + 125*151 = 21903
42*17 + 99*19 + 116*23 + 102*29 + 123*31 + 125*37 = 16659
42*41 + 99*43 + 116*47 + 102*53 + 123*59 + 125*61 = 31719
42*67 + 99*71 + 116*73 + 102*79 + 123*83 + 125*89 = 47703
42*97 + 99*101 + 116*103 + 102*107 + 123*109 + 125*113 = 64467
42*127 + 99*131 + 116*137 + 102*139 + 123*149 + 125*433 = 120825
```

After finishing this part, you will get `*ctf{}`

### part1

This part is about xor and bit change, but unluckily I write some wrong code and it will be multiple solutions.

|stage|arr[0]|arr[1]|arr[2]|arr[3]|arr[4]|arr[5]|
|---|---|---|---|---|---|---|
|0|a|b|c|d|e|f|
|1|a^b|b^c|c^d|d^e|e^f|f^a|
|2|a^c|b^d|c^e|d^f|e^a|f^b|
|3|a^b^c^d|b^c^d^e|c^d^e^f|d^e^f^a|e^f^a^b|f^a^b^c|
|4|a^e|b^f|c^a|d^b|e^c|f^d|
|5|a^b^e^f|a^b^c^f|a^b^c^d|b^c^d^e|c^d^e^f|a^d^e^f|
|6|c^e|d^f|a^e|b^f|a^c|b^d|

And now you you can get all possible conditions with different `a` and `b`. 

### part2

This is the most interesting part I think~~

At first, you will find this check:

```javascript
return text2hex(Array.from(a).map(function (a) {
        a = a.charCodeAt();
        return "" + String.fromCharCode(a - 1) + String.fromCharCode(a - 1) + String.fromCharCode(a + 1)
    }).join("")) ^ c & 1
```

But unluckily as mentioned above, the length of text is too long and it will always return false. So it need to pass check in another part.

```javascript
!(text2hex(Array.from(a).map(function (a) {
        return a.toLowerCase()
    }).join("")) ^ d) && a[2] !== a[2].toLowerCase() && a[2] !== a[2].toLowerCase().toUpperCase() && a[4] !== a[4].toLowerCase() && a[4] !== a[4].toLowerCase().toUpperCase()
```

You need find some character which is non-ascii and its lowercase's uppercase or its lowercase doesn't equal to it itself.

```javascript
for(let i = 0x100; i<0x8000; i++) {
    const c = String.fromCharCode(i)
    if(c.toLowerCase() !== c && c.toLowerCase().toUpperCase() !== c) console.log(c)
}
```

And you will find what meets our requirements and is also printable is `İ` and `K`, `T`\\`t`, `H`\\`h`, `N`\\`n` are all possible and need sha1 to check which is true.

### part3

This is a base58 decode, if you find the secret, it will be so easy by using some tools to decode it, such as [online base58-decode](https://www.browserling.com/tools/base58-decode)

`Base58` is usually used in Bitcoin, and if you are interested in it, you can view this link: [Base 58](https://en.wikipedia.org/wiki/Base58)

### part4

It is also a easy part since you can build the tree. And the tree is like this:

```
       I
   n       t
 e   r   e   s
t 1 n 9 ? ? ! 
```

So you will find this part is `Interest1n9??!` 

### sha1 check

Sorry, i didn't think enough, and you need check what the true flag is with sha1 `da117a29dd40fd69768ee49e35f82113f9868bba`

## Solve Script

[solve.py](./solve.py)

## Source code

[source.js](./source.js)

## And so on...

At first, i think it will a easy problem. But maybe there are some non-ascii characters in flag confuse participants. So we release a hint. And unluckily someone ignore both `check1` and `check2` has many choices and forget the sha1 I give. Maybe it will be better if I ask them to submit the md5 of the true flag.

Maybe next time I can give a more interesting but less confusing challenge. _(°:з」∠)_