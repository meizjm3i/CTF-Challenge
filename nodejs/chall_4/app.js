const express = require('express')
var hbs = require('hbs');
var bodyParser = require('body-parser');
const md5 = require('md5');
var morganBody = require('morgan-body');
const app = express();
var user = []; //empty for now

var matrix = [];
for (var i = 0; i < 3; i++){
	matrix[i] = [null , null, null];
}

function draw(mat) {
	var count = 0;
	for (var i = 0; i < 3; i++){
		for (var j = 0; j < 3; j++){
			if (matrix[i][j] !== null){
				count += 1;
			}
		}
	}
	return count === 9;
}

app.use('/static', express.static('static'));
app.use(bodyParser.json());
app.set('view engine', 'html');
morganBody(app);
app.engine('html', require('hbs').__express);

app.get('/', (req, res) => {

	for (var i = 0; i < 3; i++){
		matrix[i] = [null , null, null];

	}
	res.render('index');
})


app.get('/admin', (req, res) => { 
	/*this is under development I guess ??*/

	if(user.admintoken && req.query.querytoken && md5(user.admintoken) === req.query.querytoken){
		res.send('Hey admin your flag is <b>flag{prototype_pollution_is_very_dangerous}</b>');
	} 
	else {
		res.status(403).send('Forbidden');
	}	
}
)


app.post('/api', (req, res) => {
	var client = req.body;
	var winner = null;

	if (client.row > 3 || client.col > 3){
		client.row %= 3;
		client.col %= 3;
	}
	
	matrix[client.row][client.col] = client.data;
	console.log(matrix);
	for(var i = 0; i < 3; i++){
		if (matrix[i][0] === matrix[i][1] && matrix[i][1] === matrix[i][2] ){
			if (matrix[i][0] === 'X') {
				winner = 1;
			}
			else if(matrix[i][0] === 'O') {
				winner = 2;
			}
		}
		if (matrix[0][i] === matrix[1][i] && matrix[1][i] === matrix[2][i]){
			if (matrix[0][i] === 'X') {
				winner = 1;
			}
			else if(matrix[0][i] === 'O') {
				winner = 2;
			}
		}
	}

	if (matrix[0][0] === matrix[1][1] && matrix[1][1] === matrix[2][2] && matrix[0][0] === 'X'){
		winner = 1;
	}
	if (matrix[0][0] === matrix[1][1] && matrix[1][1] === matrix[2][2] && matrix[0][0] === 'O'){
		winner = 2;
	} 

	if (matrix[0][2] === matrix[1][1] && matrix[1][1] === matrix[2][0] && matrix[2][0] === 'X'){
		winner = 1;
	}
	if (matrix[0][2] === matrix[1][1] && matrix[1][1] === matrix[2][0] && matrix[2][0] === 'O'){
		winner = 2;
	}

	if (draw(matrix) && winner === null){
		res.send(JSON.stringify({winner: 0}))
	}
	else if (winner !== null) {
		res.send(JSON.stringify({winner: winner}))
	}
	else {
		res.send(JSON.stringify({winner: -1}))
	}

})
app.listen(3000, () => {
	console.log('app listening on port 3000!')
})