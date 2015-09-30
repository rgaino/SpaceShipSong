
window.AudioContext = window.AudioContext || window.webkitAudioContext;

var context = new AudioContext();
var tickTimer;

var tracks = [
              'audio/drums.mp3',
              'audio/bass.mp3',
              'audio/guitar_chords.mp3',
              'audio/guitar_lead.mp3',
              'audio/guitar_solo.mp3',
              'audio/percussion.mp3'
            ];

var FFTSIZE = 32;
var trackCount = tracks.length;
var audioSources = [trackCount];
var gainNodes = [trackCount];
var analyserNodes = [trackCount];
var freqFloatData  = [trackCount];
var freqByteData = [trackCount];
var timeByteData  = [trackCount];
var loadedCount = 0;

for(var trackNumber=0; trackNumber<trackCount; trackNumber++) {
  loadSound(tracks[trackNumber], trackNumber);
  freqFloatData[trackNumber] = new Float32Array(FFTSIZE/2);
  freqByteData[trackNumber]  = new Uint8Array(FFTSIZE/2);
  timeByteData[trackNumber]  = new Uint8Array(FFTSIZE/2);
}

function loadSound(url, trackNumber) {
  var request = new XMLHttpRequest();
  request.open('GET', url, true);
  request.responseType = 'arraybuffer';

  // Decode asynchronously
  request.onload = function() {
    context.decodeAudioData(request.response, function(buffer) {
  		console.log("loaded track number " + trackNumber + ", loaded count: " + loadedCount);
      loadedCount++;

  		audioSources[trackNumber] = context.createBufferSource();
  		audioSources[trackNumber].buffer = buffer;

      //the gain node (which should come first so the visualization doesn't show the track info when muted)
      gainNodes[trackNumber] = context.createGain();

      //the Analyser node
  		analyserNodes[trackNumber] = context.createAnalyser();
  		analyserNodes[trackNumber].fftSize = FFTSIZE;
  		analyserNodes[trackNumber].smoothingTimeConstant = 0.85;

      //connect souce -> gain -> analyser -> destination
  		audioSources[trackNumber].connect(gainNodes[trackNumber]);
      gainNodes[trackNumber].connect(analyserNodes[trackNumber]);
  		analyserNodes[trackNumber].connect(context.destination);

      //initialize arrays to hold the track frequency data
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
  console.log( freqByteData );
}
