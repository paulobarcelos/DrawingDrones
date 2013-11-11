define(
[
	'socketio'
],
function (
	socketio
){
	var DroneSocketInterface = function() {
		var self = this,
		robotId,
		userId,
		socket;

		var connect = function (host) {
			socket = socketio.connect(host);
			socket.on('error', function () {
				setTimeout(function () {
					socket.socket.connect();
				}, 1000);
			});

			socket.on('Who are you?', onReportIdentity);
			socket.on('Login', onLogin);
			socket.on('User connected', onUserConnected);
			socket.on('User disconnected',onUserDisconnected);

			socket.on('Stop', stop);
			socket.on('Draw', draw);
			socket.on('Drive', drive);
			socket.on('Control', control);
			socket.on('Display', display);
		}		
		var stop = function () {
			console.log('Stop');
		}
		var draw = function(data) {
			console.log('Draw', data.path);
		}
		var display = function(data) { 
			console.log('Display', data.graphics);
		}
		var drive = function(data) { 
			/**
			* coronal => (-1) rear <-> front (+1) 
			* sagittal => (-1) left <-> right (+1) 
			*/
			console.log('Drive', data.coronal, data.sagittal);
		}
		var control = function(data) {
			console.log('Control', data.leftWheel, data.rightWheel);
		}

		var onReportIdentity = function () {
			socket.emit('I am a robot', localStorage.getItem('robot_robotId'));
		}
		var onLogin = function(data){
			if(data.robotId) {
				robotId = data.robotId;
				localStorage.setItem('robot_robotId', data.robotId);
			}
			else {
				robotId = null;
				localStorage.removeItem('robot_robotId');
			}

			if(data.userId) {
				userId = data.userId;
				localStorage.setItem('robot_userId', data.userId);
			}
			else {
				userId = null;
				localStorage.removeItem('robot_userId');
			}
			console.log('Login', data);
		}
		var onUserConnected = function(id){
			userId = id;
			localStorage.setItem('robot_userId', id);
			console.log('User connected', id);
		}
		var onUserDisconnected = function(id){
			userId = null;
			localStorage.removeItem('robot_userId');
			console.log('User disconnected', id);
		}


		Object.defineProperty(self, 'connect', {
			value: connect
		});
		/*Object.defineProperty(self, 'userId', {
			get: getUserId,
			set: setUserId
		});
		Object.defineProperty(self, 'robotSocket', {
			get: getRobotSocket,
			set: setRobotSocket
		});
		Object.defineProperty(self, 'userSocket', {
			get: getUserSocket,
			set: setUserSocket
		});*/
	}
	return DroneSocketInterface;
});