var WIDTH = "60%";
var HEIGHT = "100vh";
// This IP is hardcoded to my server, replace with your own
var socket = io.connect('http://139.59.179.121:8082');
var game = new Game('#arena', WIDTH, HEIGHT, socket);
var selectedTank = 1;
var tankName = '';

socket.on('addTank', function(tank){
	game.addTank(tank.id, tank.type, tank.isLocal, tank.x, tank.y);
});

socket.on('sync', function(gameServerData){
	game.receiveData(gameServerData);
});

socket.on('killTank', function(tankData){
	game.killTank(tankData);
});

socket.on('removeTank', function(tankId){
	game.removeTank(tankId);
});

$(document).ready( function(){

	$('#join').click( function(){
		tankName = $('#tank-name').val();
		joinGame(tankName, selectedTank, socket);
	});

	$('#tank-name').keyup( function(e){
		tankName = $('#tank-name').val();
		var k = e.keyCode || e.which;
		if(k == 13){
			joinGame(tankName, selectedTank, socket);
		}
	});

	$('ul.tank-selection li').click( function(){
		$('.tank-selection li').removeClass('selected')
		$(this).addClass('selected');
		selectedTank = $(this).data('tank');
	});

});

$(window).on('beforeunload', function(){
	socket.emit('leaveGame', tankName);
});

function joinGame(tankName, tankType, socket){
	
		$('#prompt').hide();
		socket.emit('joinGame', {id: tankName, type: tankType});
	
}
