define(
[
	'happy/app/BaseApp',
	'socketio',
	'UserSocketInterface'
],
function (
	BaseApp,
	socketio,
	UserSocketInterface
){

	var App = function(){
		var 
		self = this,
		socketInterface,
		socket;

		self.setup = function(){
			socketInterface = new UserSocketInterface();
			socketInterface.connect('http://localhost:8080');
		}
	}
	App.prototype = new BaseApp();
	return App;
});