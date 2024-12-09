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
  const materialY = new THREE.MeshBasicMaterial({ color: 0x7fc7f8 });
  const materialOne = new THREE.MeshBasicMaterial({ color: 0xf8b07f });

  // Create "Y" mesh
  const yGeometry = new TextGeometry("Y", {
    font: font,
    size: 5,
    height: 1,
  });
  const yMesh = new THREE.Mesh(yGeometry, materialY);
  yMesh.position.x = -10; // Place on the left
  scene.add(yMesh);

  // Create "1" mesh
  const oneGeometry = new TextGeometry("1", {
    font: font,
    size: 5,
    height: 1,
  });
  const oneMesh = new THREE.Mesh(oneGeometry, materialOne);
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
