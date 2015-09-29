
var cubeArray = [trackCount];

function createScene() {

  //setup Threejs scene, camera and renderer
  var scene = new THREE.Scene();
  var camera = new THREE.PerspectiveCamera( 75, window.innerWidth/window.innerHeight, 0.1, 1000 );
  var renderer = new THREE.WebGLRenderer();
  renderer.setClearColor( 0xEBF0F5 );
  renderer.setSize( window.innerWidth, window.innerHeight );
  document.body.appendChild( renderer.domElement );

  //each view group contains 16 bars that shows the track frequency information
  var trackViewGroups = [trackCount];
  var trackViewColor = [0x00FF00,
                        0xFF66FF,
                        0xFF9900,
                        0x0066FF,
                        0x000033,
                        0xB82E00];
  var trackViewNames = ['drums', 'bass', 'base guitar', 'lead guitar', 'solo guitar', 'percussion'];

  var groupY = -25;

  for(var trackNumber=0; trackNumber<trackCount; trackNumber++) {

    console.log("Creating track view group " + trackNumber);

    group = new THREE.Object3D();
    group.position = new THREE.Vector3(0, groupY, 0);
    group.name = trackNumber;

    var geometry = new THREE.BoxGeometry( 1, 1, 1 );
    var material = new THREE.MeshLambertMaterial( { color: trackViewColor[trackNumber] } );
    var xPosition = -10;
    var xPositionOffset = 0.5;

    for(var i=0; i<=freqByteData[trackNumber].length; i++) {
      var cube = new THREE.Mesh( geometry, material );
      cube.position.y = groupY;
      cube.position.x = xPosition;
      xPosition += (xPositionOffset + cube.scale.x);
      cube.name = trackNumber + '.' + i;
      cubeArray[i] = cube;

      group.add(cube);
    }

    xPosition += (xPositionOffset + cube.scale.x);

    var textParams = {
            					size: 2,
            					height: 1,
            					curveSegments: 2,
            					font: "helvetiker"
            				};

    //track name in 3D text, using same material as frequency bars
    var trackNameGeometry = new THREE.TextGeometry(trackViewNames[trackNumber], textParams);
    var text3D = new THREE.Mesh( trackNameGeometry, material );
    text3D.position.x = xPosition;
    text3D.position.y = groupY;

    group.add(text3D);

    trackViewGroups[trackNumber] = group;

    scene.add(group);
    groupY += 10;
  }

  // LIGHT
	var light = new THREE.PointLight(0xffffff);
	light.position.set(0,150,100);
	scene.add(light);

  camera.position.z = 50;
  controls = new THREE.OrbitControls(camera, document, renderer.domElement);

  var render = function () {

    requestAnimationFrame( render );

    for(var trackNumber=0; trackNumber<trackCount; trackNumber++) {
      for(var i=0; i<=freqByteData[trackNumber].length; i++) {
        // look for the current bar for the current track group
        //they are named 0.0, 0.1, 0.2... 1.0, 1.1, 1.2,... etc.
        var cube = scene.getObjectByName( trackNumber + '.' + i, true );
        cube.scale.y = (freqByteData[trackNumber][i] / 100) ;
      }
    }

    renderer.render(scene, camera);
  };

  render();
}
