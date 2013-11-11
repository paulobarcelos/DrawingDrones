define(
[
	'happy/app/BaseApp',
	'happy/audio/Node',
	'happy/utils/Vendor',
	'DroneSocketInterface'
],
function (
	BaseApp,
	Node,
	Vendor,
	DroneSocketInterface
){
	var vendor = new Vendor();
	var AudioContext = vendor.validateConstructor('AudioContext');

	var SingalControl = function(audioContext, merger, channel){
		var 
		self = this,
		merger,
		splitter,
		osc,
		started;

		splitter = audioContext.createChannelSplitter(2);
		splitter.connect(merger,0, channel);

		osc = audioContext.createOscillator();
		osc.frequency.value = 50;
		osc.type = 1;
		osc.connect(splitter);


		var sendSignal = function (command) {
			if(!started){ 
				started = true;
				osc.noteOn(0);
			}
			var frequency;
			switch (command){
				case 0:
					frequency = 30;
					break;
				case 1:
					frequency = 40;
					break;
				case 2:
					frequency = 50;
					break;
				case 3:
					frequency = 60;
					break;
				case 4:
					frequency = 70;
					break;
			}
			osc.frequency.setValueAtTime(frequency, 0);
		}

		self.sendSignal = sendSignal;
	}

	var App = function(){
		var 
		self = this,
		audioContext,
		merger,
		controlA,
		controlB,
		socketInterface;

		self.setup = function(){
			socketInterface = new DroneSocketInterface();
			socketInterface.connect('http://localhost:8080');

			audioContext = new AudioContext();

			merger = audioContext.createChannelMerger(2);
			merger.connect(audioContext.destination);

			controlA = new SingalControl(audioContext, merger, 0);

			var a_bb = document.createElement('button');
			a_bb.innerHTML = '  <<  ';
			self.container.appendChild(a_bb);
			a_bb.addEventListener('click', function(){
				controlA.sendSignal(0);
			});

			var a_b = document.createElement('button');
			a_b.innerHTML = '  <  ';
			self.container.appendChild(a_b);
			a_b.addEventListener('click', function(){
				controlA.sendSignal(1);
			});

			var a_s = document.createElement('button');
			a_s.innerHTML = '  -  ';
			self.container.appendChild(a_s);
			a_s.addEventListener('click', function(){
				controlA.sendSignal(2);
			});

			var a_f = document.createElement('button');
			a_f.innerHTML = '  >  ';
			self.container.appendChild(a_f);
			a_f.addEventListener('click', function(){
				controlA.sendSignal(3);
			});

			var a_ff = document.createElement('button');
			a_ff.innerHTML = '  >> ';
			self.container.appendChild(a_ff);
			a_ff.addEventListener('click', function(){
				controlA.sendSignal(4);
			});


			controlB = new SingalControl(audioContext, merger, 1);

			var b_bb = document.createElement('button');
			b_bb.innerHTML = '  <<  ';
			self.container.appendChild(b_bb);
			b_bb.addEventListener('click', function(){
				controlB.sendSignal(0);
			});

			var b_b = document.createElement('button');
			b_b.innerHTML = '  <  ';
			self.container.appendChild(b_b);
			b_b.addEventListener('click', function(){
				controlB.sendSignal(1);
			});

			var b_s = document.createElement('button');
			b_s.innerHTML = '  -  ';
			self.container.appendChild(b_s);
			b_s.addEventListener('click', function(){
				controlB.sendSignal(2);
			});

			var b_f = document.createElement('button');
			b_f.innerHTML = '  >  ';
			self.container.appendChild(b_f);
			b_f.addEventListener('click', function(){
				controlB.sendSignal(3);
			});

			var b_ff = document.createElement('button');
			b_ff.innerHTML = '  >>  ';
			self.container.appendChild(b_ff);
			b_ff.addEventListener('click', function(){
				controlB.sendSignal(4);
			});
				
		}
	}
	App.prototype = new BaseApp();
	return App;
});