// Import necessary components
import * as THREE from "three";
import { FontLoader } from "three/examples/jsm/loaders/FontLoader.js";
import { TextGeometry } from "three/examples/jsm/geometries/TextGeometry.js";

// Create scene, camera, and renderer
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// Load font and create text meshes
const loader = new FontLoader();
loader.load("/src/fonts/helvetiker_regular.typeface.json", function (font) {
  const material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });

  // Create "Y" mesh
  const yGeometry = new TextGeometry("Y", {
    font: font,
    size: 5,
    height: 1,
  });
  const yMesh = new THREE.Mesh(yGeometry, material);
  yMesh.position.x = -10; // Place on the left
  scene.add(yMesh);

  // Create "1" mesh
  const oneGeometry = new TextGeometry("1", {
    font: font,
    size: 5,
    height: 1,
  });
  const oneMesh = new THREE.Mesh(oneGeometry, material);
  oneMesh.position.x = 10; // Place on the right
  scene.add(oneMesh);

  // Position camera
  camera.position.z = 20;

  // Render loop
  function animate() {
    requestAnimationFrame(animate);
    renderer.render(scene, camera);
  }
  animate();
});
