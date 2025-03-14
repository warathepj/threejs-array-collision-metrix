// Import necessary modules
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import ArrayCollisionMatrix from './collision/ArrayCollisionMatrix.js';  // Add .js extension

// --- Setup the Three.js scene ---
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth/window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// Add OrbitControls
const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.dampingFactor = 0.05;

// Optional: add a simple light
const light = new THREE.DirectionalLight(0xffffff, 1);
light.position.set(5, 10, 7.5);
scene.add(light);

// --- Create collision matrix for simulation objects ---
// For this example, we have two objects.
const collisionMatrix = new ArrayCollisionMatrix();
collisionMatrix.setNumObjects(2);

// --- Create two 3D objects ---
// Object 1: A green cube
const geometry = new THREE.BoxGeometry(1, 1, 1);
const material1 = new THREE.MeshStandardMaterial({ color: 0x00ff00 });
const cube1 = new THREE.Mesh(geometry, material1);
scene.add(cube1);

// Object 2: A red cube
const material2 = new THREE.MeshStandardMaterial({ color: 0xff0000 });
const cube2 = new THREE.Mesh(geometry, material2);
scene.add(cube2);

// Set initial positions
cube1.position.set(-2, 0, 0);
cube2.position.set(2, 0, 0);

// --- Optionally, load an external 3D model ---
// Uncomment the lines below to load a model (e.g., a GLTF file)
// const loader = new GLTFLoader();
// loader.load('path/to/model.gltf', (gltf) => {
//   const model = gltf.scene;
//   scene.add(model);
//   // Position or scale the model as needed
// });

// --- Collision Detection Helper ---
// A simple Axis-Aligned Bounding Box (AABB) collision check function
function checkCollision(objectA, objectB) {
  const boxA = new THREE.Box3().setFromObject(objectA);
  const boxB = new THREE.Box3().setFromObject(objectB);
  return boxA.intersectsBox(boxB);
}

// --- Simulation Loop ---
// Add this near the top of the file after scene setup
let collisionCount = 0;
const collisionDisplay = document.getElementById('collision-count');

function animate() {
    requestAnimationFrame(animate);
    
    // Example simulation: Move cube1 to the right each frame
    cube1.position.x += 0.02;
    
    // Reset collision matrix for current simulation step
    collisionMatrix.reset();
    
    // Check collision between cube1 and cube2
    const isColliding = checkCollision(cube1, cube2) ? 1 : 0;
    collisionMatrix.set(0, 1, isColliding);
    
    // Update collision display
    if (isColliding) {
        collisionCount++;
        collisionDisplay.textContent = collisionCount;
        console.log("Collision detected between cube1 and cube2");
    }
    
    // Update controls
    controls.update();
    
    // Render the scene
    renderer.render(scene, camera);
}

// Position the camera so both objects are visible
camera.position.z = 5;

// Start the simulation
animate();
