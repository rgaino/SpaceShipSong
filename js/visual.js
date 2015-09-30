var renderer;
var camera;
var scene;

function createScene() {

  //setup Threejs scene, camera and renderer
   scene = new THREE.Scene();
  camera = new THREE.PerspectiveCamera( 75, window.innerWidth/window.innerHeight, 0.1, 1000 );
  renderer = new THREE.WebGLRenderer();
  renderer.setClearColor( 0xEBF0F5 );
  renderer.setSize( window.innerWidth, window.innerHeight );

  document.body.appendChild( renderer.domElement );
  window.addEventListener( 'resize', onWindowResize, false );
  var domEvents   = new THREEx.DomEvents(camera, renderer.domElement)

  var trackViewColor = [0x00FF00, 0xFF66FF, 0xFF9900,       0x0066FF,     0x000033,      0xB82E00];
  var trackViewNames = ['drums',  'bass',   'base guitar', 'lead guitar', 'solo guitar', 'percussion'];

  var originalGroupY = -5;
  var groupY = originalGroupY;

  for(var trackNumber=0; trackNumber<trackCount; trackNumber++) {

    var xPosition = -45;
    var xPositionOffset = 0.5;

    //beginning of a new column of tracks
    if(trackNumber == (trackCount/2)) {
      groupY = originalGroupY;
    }

    //for every column on the second half of track number
    if(trackNumber >= trackCount/2) {
      xPosition = 5;
    }

    console.log("Creating 3D objects for " + trackViewNames[trackNumber] + " track at " + xPosition + ',' + groupY);

    var switchSphereGeometry = new THREE.SphereGeometry( 1, 32, 32 );
    var geometry = new THREE.BoxGeometry( 1, 1, 1 );
    var material = new THREE.MeshLambertMaterial( { color: trackViewColor[trackNumber] } );
    var sphere = new THREE.Mesh( switchSphereGeometry, material );

    sphere.trackNumber = trackNumber;
    sphere.position.y = groupY;
    sphere.position.x = xPosition;
    scene.add(sphere);
    domEvents.addEventListener(sphere, 'click', switchClick, false)

    xPosition += (xPositionOffset + (sphere.scale.x*3));

    for(var i=0; i<=freqByteData[trackNumber].length; i++) {
      var cube = new THREE.Mesh( geometry, material );
      cube.position.y = groupY;
      cube.position.x = xPosition;
      xPosition += (xPositionOffset + cube.scale.x);
      cube.name = trackNumber + '.' + i;
      scene.add(cube);
    }

    xPosition += (xPositionOffset + cube.scale.x);

    //track name in 3D text, using same material as frequency bars
    var textParams = { size: 1.2, height: 0.1, curveSegments: 2, font: "helvetiker" };
    var trackNameGeometry = new THREE.TextGeometry(trackViewNames[trackNumber].toUpperCase(), textParams);
    var text3D = new THREE.Mesh( trackNameGeometry, material );
    text3D.position.x = xPosition;
    text3D.position.y = groupY;
    text3D.text = trackViewNames[trackNumber].toUpperCase();
    scene.add(text3D);

    groupY += 10;
  }

  //Add some lighting
	var light = new THREE.PointLight(0xffffff);
	light.position.set(0,150,100);
	scene.add(light);

  camera.position.z = 40;
  controls = new THREE.OrbitControls(camera, document, renderer.domElement);

  var render = function () {

    requestAnimationFrame( render );

    for(var trackNumber=0; trackNumber<trackCount; trackNumber++) {
      for(var i=0; i<=freqByteData[trackNumber].length; i++) {
        // look for the current bar for the current track group
        //they are named 0.0, 0.1, 0.2... 1.0, 1.1, 1.2,... etc.
        var cube = scene.getObjectByName( trackNumber + '.' + i, true );
        cube.scale.y = (freqByteData[trackNumber][i] / 100) + 0.1 ;
      }
    }

    renderer.render(scene, camera);
  };

  render();
}

function switchClick(event) {
  //mute and unmute track
  if(gainNodes[event.target.trackNumber].gain.value == 0) {
    gainNodes[event.target.trackNumber].gain.value = 1;
  } else {
    gainNodes[event.target.trackNumber].gain.value = 0;
  }
}

function onWindowResize() {

  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();

  renderer.setSize( window.innerWidth, window.innerHeight );

}
