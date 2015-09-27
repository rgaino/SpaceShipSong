
var cubeArray = [trackCount];

function createScene() {
  var scene = new THREE.Scene();
  var camera = new THREE.PerspectiveCamera( 75, window.innerWidth/window.innerHeight, 0.1, 1000 );

  var renderer = new THREE.WebGLRenderer();
  renderer.setSize( window.innerWidth, window.innerHeight );
  document.body.appendChild( renderer.domElement );

  var geometry = new THREE.BoxGeometry( 1, 1, 1 );
  var material = new THREE.MeshBasicMaterial( { color: 0x00ff00 } );
  var xPosition = -10;
  var xPositionOffset = 0.5;

  for(var i=0; i<=freqByteData[0].length; i++) {
  //
  //   console.log("Creating cube number " + i + " at x=" + xPosition);

    var cube = new THREE.Mesh( geometry, material );
    cube.position.x = xPosition;
    xPosition += (xPositionOffset + cube.scale.x);
    cubeArray[i] = cube;

    scene.add(cube);
  }
  console.log("Total scene.children=" + scene.children.length);

  camera.position.z = 5;

  var render = function () {
    requestAnimationFrame( render );

    for(var i=0; i<=freqByteData[0].length; i++) {
      console.log(freqByteData[i]);
      cubeArray[i].scale.y = (freqByteData[0][i] / 100) + 1;
    }
    // cube.rotation.x += 0.1;
    // cube.rotation.y += 0.1;
    // cube.scale.y = (getAverage(freqByteData[0]) / 100) + 1;
    // console.log(cube.scale.y);


    renderer.render(scene, camera);
  };

  render();
}
