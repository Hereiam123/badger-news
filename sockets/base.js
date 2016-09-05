module.exports = function (io) { 
	io.on('connection', function(socket){
	 socket.on('send msg', function(data){
	   	io.emit('get msg', data);
	    console.log(data);
		});
	});
}
