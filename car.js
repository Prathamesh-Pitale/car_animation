import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import Stats from 'three/addons/libs/stats.module.js';
import { GUI } from 'three/addons/libs/lil-gui.module.min.js';
//import { GUI } from 'dat.gui';

let mixer, loader, clock, actions, settings, stats, skeleton, renderer;
let scene, camera, controls,mesh;
let  dt, lastframe = Date.now();

const crossFadeControls = [];


let openDoor;
//let idleWeight, walkWeight;

init();

function init() {

 renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.outputColorSpace = THREE.SRGBColorSpace;

renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setClearColor(0x000000);
renderer.setPixelRatio(window.devicePixelRatio);

renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;

document.body.appendChild(renderer.domElement);

 scene = new THREE.Scene();

 camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 1, 1000);
camera.position.set(4, 5, 4);

 controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.enablePan = false;
controls.minDistance = 5;
controls.maxDistance = 20;
controls.minPolarAngle = 0.5;
controls.maxPolarAngle = 1.5;
controls.autoRotate = false;
controls.target = new THREE.Vector3(0, 1, 0);
controls.update();

const dirLight = new THREE.DirectionalLight( 0xffffff, 3 );
dirLight.position.set( - 3, 10, - 10 );
dirLight.castShadow = true;
dirLight.shadow.camera.top = 2;
dirLight.shadow.camera.bottom = - 2;
dirLight.shadow.camera.left = - 2;
dirLight.shadow.camera.right = 2;
dirLight.shadow.camera.near = 0.1;
dirLight.shadow.camera.far = 40;
scene.add( dirLight );

const groundGeometry = new THREE.PlaneGeometry(20, 20, 32, 32);
groundGeometry.rotateX(-Math.PI / 2);
const groundMaterial = new THREE.MeshStandardMaterial({
  color: 0x555555,
  side: THREE.DoubleSide
});
const groundMesh = new THREE.Mesh(groundGeometry, groundMaterial);
groundMesh.castShadow = false;
groundMesh.receiveShadow = true;
scene.add(groundMesh);

const spotLight = new THREE.SpotLight(0xffffff, 3000, 100, 0.22, 1);
spotLight.position.set(0, 25, );
spotLight.castShadow = true;
spotLight.shadow.bias = -2.0001;
scene.add(spotLight);

const loader = new GLTFLoader().setPath('car/');
loader.load('scene.gltf', (gltf) => {
  console.log('loading model');
   mesh = gltf.scene;

   mixer = new THREE.AnimationMixer( mesh );
   openDoor= mixer.clipAction (gltf.animations[0])
   scene.add(mesh)
   //openDoor.play()

  mesh.traverse((child) => {
    if (child.isMesh) {
      child.castShadow = true;
      child.receiveShadow = true;
    }
  });

  mesh.position.set(0, 1.05, 2);
  scene.add(mesh);

  skeleton = new THREE.SkeletonHelper( mesh );
  skeleton.visible = false;
  scene.add( skeleton );

  createPanel();

  /*  const animations = gltf.animations;
    mixer = new THREE.AnimationMixer( mesh );
    openDoor= mixer.clipAction (gltf.animations[1])
    scene.add(mesh)
    openDoor.play()
    */


   // idleAction = mixer.clipAction( animations[ 0 ] );
	//walkAction = mixer.clipAction( animations[ 3 ] );

    //actions = [ idleAction, walkAction, runAction ];


	//renderer.setAnimationLoop( animate );


 // document.getElementById('progress-container').style.display = 'none';
}, (xhr) => {
  console.log(`loading ${xhr.loaded / xhr.total * 100}%`);
}, (error) => {
  console.error(error);
});



window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});

}

function createPanel() {

    const panel = new GUI( { width: 210 } );

    const folder1 = panel.addFolder( 'Visibility' );
   const folder2 = panel.addFolder( 'Open/Close' );
    //const folder3 = panel.addFolder( 'Pausing/Stepping' );
    
    settings = {
        'show model': true,
        'show skeleton': false,
        'open door':openDoors,
        'close door':closeDoors,
        //'deactivate all': deactivateAllActions,
        //'activate all': activateAllActions,
        //'pause/continue': pauseContinue,
       
       
        //'use default duration': true,
        //'set custom duration': 3.5,
       
    };

    folder1.add( settings, 'show model').onChange( showModel );
    folder1.add( settings, 'show skeleton' ).onChange( showSkeleton );
    folder2.add( settings, 'open door' );
    folder2.add( settings, 'close door' );

    //folder2.add( settings, 'activate all' );
    //folder3.add( settings, 'pause/continue' );
   

    folder1.open();
    folder2.open();
    //folder3.open();
    

}

function showModel( visibility ) {

    mesh.visible = visibility;

}
function showSkeleton( visibility ) {

    skeleton.visible = visibility;

}

function openDoors(  ) {

   // mesh.visible = visibility;
  
   openDoor.play()

}

function closeDoors(  ) {

    // mesh.visible = visibility;
   
    openDoor.stop()
 
 }


function animate() {

    dt = (Date.now()-lastframe)/1000

if(mixer){
    mixer.update(dt)        
}
renderer.render(scene, camera);
lastframe=Date.now()
  requestAnimationFrame(animate);
  controls.update();
  
}

animate();