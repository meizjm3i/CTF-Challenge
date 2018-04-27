var net = require('net');

flag='*ctf{web_chal_made_by_binary_players_lol}';

var server = net.createServer(function(socket) {
        socket.on('data', (data) => {
                //m = data.toString().replace(/[\n\r]*$/, '');
                ok = true;
                arr = data.toString().split(' ');
                arr = arr.map(Number);
                if (arr.length != 5)
                        ok = false;
                arr1 = arr.slice(0);
                arr1.sort();
                for (var i=0; i<4; i++)
                        if (arr1[i+1] == arr1[i] || arr[i] < 0 || arr1[i+1] > 127)
                                ok = false;
                arr2 = []
                for (var i=0; i<4; i++)
                        arr2.push(arr1[i] + arr1[i+1]);
                val = 0;
                for (var i=0; i<4; i++)
                        val = val * 0x100 + arr2[i];
                if (val != 0x23332333)
                        ok = false;
                if (ok)
                        socket.write(flag+'\n');
                else
                        socket.write('nope\n');
        });
        //socket.write('Echo server\r\n');
        //socket.pipe(socket);
});

HOST = '0.0.0.0'
PORT = 23333

server.listen(PORT, HOST);