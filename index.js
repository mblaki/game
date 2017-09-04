var express = require('express');
var app = express();
var counter = 0;
var WIDTH = "60%";
var HEIGHT = "100vh";

//Static resources server
app.use(express.static(__dirname + '/www'));

var server = app.listen(process.env.PORT || 8082, function () {
	var port = server.address().port;
	console.log('Server running at port %s', port);
});

var io = require('socket.io')(server);

function GameServer() {
	this.tanks = [];
}

GameServer.prototype = {

	addTank: function(tank){
		this.tanks.push(tank);
        document.getElementById("command").innerHTML += "tank: " + tank.id + "\n";
	}

}

var game = new GameServer();

/* Connection events */

io.on('connection', function(client) {
	console.log('User connected');

	client.on('joinGame', function(tank){
		console.log(tank.id + ' joined the game');
		var initX = getRandomInt(40, 900);
		var initY = getRandomInt(40, 500);
		client.emit('addTank', { id: tank.id, type: tank.type, isLocal: true, x: initX, y: initY, hp: TANK_INIT_HP });
		client.broadcast.emit('addTank', { id: tank.id, type: tank.type, isLocal: false, x: initX, y: initY, hp: TANK_INIT_HP} );
        document.getElementById("command2").innerHTML += "tank: " + tank.id + "\n";
		game.addTank({ id: tank.id, type: tank.type, hp: TANK_INIT_HP});
	});

	

});


function getRandomInt(min, max) {
	return Math.floor(Math.random() * (max - min)) + min;
}
