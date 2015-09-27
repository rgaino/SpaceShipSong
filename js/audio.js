
window.AudioContext = window.AudioContext || window.webkitAudioContext;
var context = new AudioContext();
var tickTimer;

var audioSources = [trackCount];
var analyserNodes = [trackCount];
var freqFloatData  = [trackCount];
var freqByteData = [trackCount];
var timeByteData  = [trackCount];
var loadedCount = 0;
var trackCount = 4;

// loadSound('audio/kick.mp3', 0);
loadSound('audio/drums.mp3', 1);
loadSound('audio/bass.mp3', 3);
loadSound('audio/guitar_chords.mp3', 2);
loadSound('audio/guitar_lead.mp3', 0);


function loadSound(url, trackNumber) {
  var request = new XMLHttpRequest();
  request.open('GET', url, true);
  request.responseType = 'arraybuffer';

  // Decode asynchronously
  request.onload = function() {
    context.decodeAudioData(request.response, function(buffer) {

		loadedCount++;
		console.log("loaded track number " + trackNumber + ", loaded count: " + loadedCount);

		audioSources[trackNumber] = context.createBufferSource();
		audioSources[trackNumber].buffer = buffer;

		analyserNodes[trackNumber] = context.createAnalyser();
		analyserNodes[trackNumber].fftSize = 32;
		analyserNodes[trackNumber].smoothingTimeConstant = 0.85;

		audioSources[trackNumber].connect(analyserNodes[trackNumber]);
		analyserNodes[trackNumber].connect(context.destination);

		freqFloatData[trackNumber] = new Float32Array(analyserNodes[trackNumber].frequencyBinCount);
		freqByteData[trackNumber]  = new Uint8Array(analyserNodes[trackNumber].frequencyBinCount);
		timeByteData[trackNumber]  = new Uint8Array(analyserNodes[trackNumber].frequencyBinCount);

    if(loadedCount == trackCount) {
			document.getElementById("playButton").disabled = false;
		}

    });
  }
  request.send();
}

function playSound() {

	tickTimer = setInterval(tick, 20);

	console.log("on playSound()");
	for(var i=0; i<trackCount; i++) {
		console.log("Starting audio file " + i);
		audioSources[i].start(0);
	}

  createScene();

}

function tick() {
	for(var i=0; i<trackCount; i++) {
		analyserNodes[i].getFloatFrequencyData(freqFloatData[i]);  // this gives us the dBs
		analyserNodes[i].getByteFrequencyData(freqByteData[i]);  // this gives us the frequency
		analyserNodes[i].getByteTimeDomainData(timeByteData[i]);  // this gives us the waveform
	}
}

function getAverage(array) {
    console.log(array);
    var values = 0;

    for (var i = 0; i < array.length; i++) {
        values += array[i];
    }
    return values / array.length;
}

function log() {

  console.log("Log at ", new Date());

  console.log(cubeArray);
  // console.log(freqByteData[0].length);
  // console.log( (getAverage(freqByteData[0]) / 100) + 1);
  // console.log( getAverage(freqByteData[0]));

  for(var i=0; i<trackCount; i++) {
    // console.log(freqFloatData[i][0]);
    // console.log(freqByteData[i][0]);
    // console.log(timeByteData[i][0]);

    // console.log("Data for track " + i);
    // console.log("dBs: " + getAverage(freqFloatData[i]));
    // console.log("Frequency: " + getAverage(freqByteData[i]));
    // console.log("Waveform: " + getAverage(timeByteData[i]));

    }
}
