var io = require('socket.io').listen(8080);

var Drone = function(io) {
	var self = this,
	robotId,
	userId,
	robotSocket,
	userSocket;
	
	var stop = function () {
		if(robotSocket) robotSocket.emmit('Stop', data);
	}
	var draw = function(data) {
		if(robotSocket) robotSocket.emmit('Draw', data);
	}
	var drive = function(data) {
		if(robotSocket) robotSocket.emmit('Drive', data);
	}
	var control = function(data) {
		if(robotSocket) robotSocket.emmit('Control', data);
	}
	var display = function(data) {
		if(robotSocket) robotSocket.emmit('Display', data);
	}

	var onRobotConnect = function() {
		robotSocket.on('disconnect', onRobotDisconnect);
		reportRobotConnetion();
	}
	var onUserConnect = function() {
		userSocket.on('disconnect', onUserDisconnect);
		userSocket.on('Stop', stop);
		userSocket.on('Draw', draw);
		userSocket.on('Drive', drive);
		userSocket.on('Control', control);
		userSocket.on('Display', display);
		reportUserConnetion();
	}
	var onRobotDisconnect = function() {
		robotSocket = null;
		reportRobotDisconnetion();
	}
	var onUserDisconnect = function() {
		userSocket = null;
		reportUserDisconnetion();
	}

	var reportRobotConnetion = function(){
		if(userSocket) userSocket.emit('Robot connected', robotId);
		io.sockets.emit('A robot has connected', robotId);
	}
	var reportRobotDisconnetion = function(){
		if(userSocket) userSocket.emit('Robot disconnected', robotId);
		io.sockets.emit('A robot has disconnected', robotId);
	}
	var reportUserConnetion = function(){
		if(robotSocket) robotSocket.emit('User connected', userId);
		io.sockets.emit('A user has connected', userId);
	}
	var reportUserDisconnetion = function(){
		if(robotSocket) robotSocket.emit('User disconnected', userId);
		io.sockets.emit('A user has disconnected', userId);
	}

	var getRobotId = function () {
		return robotId;
	}
	var setRobotId = function (value) {
		robotId = value;
	}
	var getUserId = function () {
		return userId;
	}
	var setUserId = function (value) {
		userId = value;
	}
	var getRobotSocket = function () {
		return robotSocket;
	}
	var setRobotSocket = function (value) {
		robotSocket = value;
		onRobotConnect()		
	}
	var getUserSocket = function () {
		return userSocket;
	}
	var setUserSocket = function (value) {
		userSocket = value;
		onUserConnect();
	}


	Object.defineProperty(self, 'robotId', {
		get: getRobotId,
		set: setRobotId
	});
	Object.defineProperty(self, 'userId', {
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
	});
}

var drones = [];
var USER_ID_FACTORY = 1;

io.sockets.on('connection', function (socket) {
	socket.emit('Who are you?');
	socket.on('I am a robot', function(robotId) {
		var drone = reclaimDroneForRobot(robotId);
		drone.robotSocket = socket;
		socket.emit('Login', { userId : drone.userId, robotId : drone.robotId} );
	});
	socket.on('I am a user', function(userId) {
		var drone = reclaimDroneForUser(userId);
		if(drone){
			drone.userSocket = socket;
			socket.emit('Login', { userId : drone.userId, robotId : drone.robotId} );
		}
		else{
			socket.emit('No robot available');
		}
	});
});

var reclaimDroneForRobot = function(robotId){
	var drone;
	for (var i = 0; i < drones.length; i++) {
		if ( (!robotId && !drones[i].robotId) || (robotId && drones[i].robotId == robotId)){
			drone = drones[i];
			break;
		}
	};
	if(!drone){
		drone = new Drone(io);
		drones.push(drone);
		robotId = robotId || drones.length;
		drone.robotId = robotId;
	}
	return drone;
}
var reclaimDroneForUser = function(userId){
	var drone;
	for (var i = 0; i < drones.length; i++) {
		if ( drones[i].userId == userId ){
			drone = drones[i];
			break;
		}
	}
	if(!drone){
		for (var i = 0; i < drones.length; i++) {
			if (!drones[i].userId ){
				drone = drones[i];
				break;
			}
		}
	}
	
	if(drone){
		userId = userId || USER_ID_FACTORY++;
		drone.userId = userId;
		return drone;
	}
}