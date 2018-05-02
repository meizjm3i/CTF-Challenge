flag = "*ctf{Do-Y0u_ThİnK_J5-is-So_Interest1n9??!}"

const funcs = [check1, check2, check3, check4];
const args = [
    ['0xd83c2e5d9c6c'],    
    ['0xb8342e58966c'],
    ['0x796ee5dd617265ff777f6f6cc73d2e3d', '0x7dfee9e078e8b'],
    ['0x796f755f6172655f77726f6e673d2e3d', '0x7468693076e6b'],
    ['E5XncQemjRg'],
    ['DQuf7TsLf6W'],
    ['0xcc6e657413726e3974653f3f7312', '0x7413656e39726e3f3f65127374cc'],   
    ['0x496e657431726e3974653f3f7321', '0x7431656e39726e3f3f6521737449'],
]

function index(i) {
    this.i = i;
    this.toString = function() {
        return i++;
    }
}

function check(flag) {
    const newFuncs = [];
    funcs.forEach((value)=>{
        newFuncs.push(value);
        newFuncs.push(Array.from(funcs).sort(()=>{return 0.5-Math.random()})[0]);
    });
    newFuncs.unshift(math_check);
    let i = new index(0);
    return flag.length === 42 && newFuncs.shift()(flag) && [...flag].filter((value, index) => {
        return index >= 5 && index <= 40;
    }).join('').split('_').map((value) => {
        return newFuncs[i](value, args[i]);
    }).reduce((before, value) => {
        return before && value;
    });
}

function check2(text, [v1, v2]) {
    if (text2hex(Array.from(text).map((value) => {
            const v = value.charCodeAt();
            return `${String.fromCharCode(v-1)}${String.fromCharCode(v-1)}${String.fromCharCode(v+1)}`
        }).join('')) ^ v1 & 1) {
        return true;
    }
    return !(text2hex(Array.from(text).map((value) => {
        return value.toLowerCase();
    }).join('')) ^ v2) && (text[2] !== text[2].toLowerCase() && text[2] !== text[2].toLowerCase().toUpperCase()) && (text[4] !== text[4].toLowerCase() && text[4] !== text[4].toLowerCase().toUpperCase());
}

function check1(text, [v1]) {
    function swap(arr) {
        for (let i = 0; i < arr.length; i++) {
            const tmp = arr[0];
            for (let j = 0; j < arr.length - 1; j++) {
                arr[j] = String.fromCharCode(arr[j].charCodeAt() ^ arr[j + 1].charCodeAt());
            }
            arr[arr.length - 1] = String.fromCharCode(tmp.charCodeAt() ^ arr[arr.length - 1].charCodeAt());
        }
        return arr;
    }
    return `0x${swap(Array.from(text)).map((value)=>{
        let v = value.charCodeAt();
        v = v>>4|v<<4&0xff;
        v = (v&0xcc)>>2|(v&0x33)<<2;
        v = (v&0xaa)>>1|(v&0x55)<<1;
        return v.toString(16);
    }).join('')}` === v1;
}

function text2hex(text) {
    return `0x${Array.from(text).map((c)=>{
        return c.charCodeAt().toString(16);
    }).join('')}`;
}

function check3(text, [v1]) {
    if (text.length === 0) {
        return '';
    }
    const ALPHABET = '123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz';
    const BASE = ALPHABET.length;
    const digits = Array.of(0);
    [...text].map((value) => {
        return value.charCodeAt()
    }).map((value) => {
        let carry = (digits[0] << 8) + value;
        digits[0] = carry % BASE;
        carry = (carry / BASE) | 0;
        for (let j = 1; j < digits.length; ++j) {
            carry += digits[j] << 8;
            digits[j] = carry % BASE;
            carry = (carry / BASE) | 0;
        }
        while (carry > 0) {
            digits.push(carry % BASE);
            carry = (carry / BASE) | 0;
        }
        return value;
    }).forEach((value) => {
        if (!value) digits.push(0);
    });
    for (let ii = 0, jj = digits.length - 1; ii <= jj; ++ii, --jj) {
        if (ii == jj) {
            digits[ii] = ALPHABET[digits[ii]];
            continue;
        }
        digits[ii] = ALPHABET[digits[ii]];
        digits[jj] = ALPHABET[digits[jj]].charCodeAt() ^ digits[ii].charCodeAt();
        digits[ii] = String.fromCharCode(digits[jj] ^ digits[ii].charCodeAt());
        digits[jj] = String.fromCharCode(digits[ii].charCodeAt() ^ digits[jj]);
    }
    return digits.join('') === v1;
}

function check4(text, [v1, v2]) {
    function Node(data) {
        this.data = data;
        this.left = null;
        this.right = null;
    }

    function buildTree(text) {
        let root = null;
        const tmp = new Array();
        let current;
        for (let c of text) {
            let node = new Node(c);
            if (root === null) {
                root = node;
                current = node;
                continue;
            } else if (current.left === null) {
                current.left = node;
            } else {
                current.right = node;
                current = tmp.shift();
            }
            tmp.push(node);
        }
        return root;
    }

    function getPreOrder(node, array) {
        array.push(node.data);
        if (node.left !== null) {
            getPreOrder(node.left, array);
        }
        if (node.right !== null) {
            getPreOrder(node.right, array);
        }
    }

    function getPostOrder(node, array) {
        if (node.left !== null) {
            getPostOrder(node.left, array);
        }
        if (node.right !== null) {
            getPostOrder(node.right, array);
        }
        array.push(node.data);
    }

    const node = buildTree(text);
    const preOrder = new Array();
    const postOrder = new Array();
    getPreOrder(node, preOrder);
    getPostOrder(node, postOrder);

    return text2hex(preOrder) === v1 && text2hex(postOrder) === v2;
}

function math_check(flag) {
    const k = [
        [2, 3, 5, 7, 11, 151],
        [17, 19, 23, 29, 31, 37],
        [41, 43, 47, 53, 59, 61],
        [67, 71, 73, 79, 83, 89],
        [97, 101, 103, 107, 109, 113],
        [127, 131, 137, 139, 149, 433]
    ];
    return [47703, 16659, 64467, 21903, 31719, 120825].sort().filter((value, idx1) => {
        return value === Array.from(flag).filter((value, index) => {
            return index < 5 || index > 40;
        }).map((value, idx2) => {
            return value.codePointAt() * k.sort()[idx1][idx2];
        }).reduce((total, value) => {
            return total + value;
        })
    }).length === 6;
}

/* flag'sha1: da117a29dd40fd69768ee49e35f82113f9868bba */
console.log(check(flag))