define(
[
	'socketio'
],
function (
	socketio
){
	var UserSocketInterface = function() {
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
			socket.on('Robot connected', onRobotConnected);
			socket.on('Robot disconnected',onRobotDisconnected);
			socket.on('No robot available', onNoRobotAvailable);
		}
		var stop = function () {
			socket.emmit('Stop');
			console.log('Stop');
		}
		var draw = function(data) {
			socket.emmit('Draw', data);
			console.log('Draw', data.path);
		}
		var display = function(data) { 
			socket.emmit('Display', data);
			console.log('Display', data.graphics);
		}
		var drive = function(data) { 
			/**
			* coronal => (-1) rear <-> front (+1) 
			* sagittal => (-1) left <-> right (+1) 
			*/
			socket.emmit('Drive', data);
			console.log('Drive', data.coronal, data.sagittal);
		}
		var control = function(data) {
			socket.emmit('Control', data);
			console.log('Control', data.leftWheel, data.rightWheel);
		}

		var onReportIdentity = function () {
			socket.emit('I am a user', localStorage.getItem('user_userId'));
		}
		var onLogin = function(data){
			if(data.robotId) {
				robotId = data.robotId;
				localStorage.setItem('user_robotId', data.robotId);
			}
			else {
				robotId = null;
				localStorage.removeItem('user_robotId');
			}

			if(data.userId) {
				userId = data.userId;
				localStorage.setItem('user_userId', data.userId);
			}
			else {
				userId = null;
				localStorage.removeItem('user_userId');
			}
			console.log('Login', data);
		}
		var onRobotConnected = function(id){
			robotId = id;
			localStorage.setItem('user_robotId', id);
			console.log('Robot connected', id);
		}
		var onRobotDisconnected = function(id){
			robotId = null;
			localStorage.removeItem('user_robotId');
			console.log('Robot disconnected', id);
		}
		var onNoRobotAvailable = function(){
			robotId = null;
			userId = null;
			localStorage.removeItem('user_robotId');
			localStorage.removeItem('user_userId');
			console.log('No robot available');
		}

		Object.defineProperty(self, 'connect', {
			value: connect
		});
		Object.defineProperty(self, 'stop', {
			value: stop
		});
		Object.defineProperty(self, 'draw', {
			value: draw
		});
		Object.defineProperty(self, 'display', {
			value: display
		});
		Object.defineProperty(self, 'drive', {
			value: drive
		});
		Object.defineProperty(self, 'control', {
			value: control
		});
	}
	return UserSocketInterface;
});