// Import necessary components
import * as THREE from "three";
import { FontLoader } from "three/examples/jsm/loaders/FontLoader.js";
import { TextGeometry } from "three/examples/jsm/geometries/TextGeometry.js";
import { alphabetVertexShader, alphabetFragmentShader, digitVertexShader, digitFragmentShader } from './shaderUtils.js';

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

// Light source at the cube's position
const lightPosition = new THREE.Vector3(0, 0, 0);

// Camera position
const viewPosition = new THREE.Vector3();
camera.position.set(0, 0, 20);
camera.lookAt(scene.position);
viewPosition.copy(camera.position);

// Ambient intensity
const ambientIntensity = 0.341;

// Create a small cube at the center
const cubeGeometry = new THREE.BoxGeometry(1, 1, 1);
// ShaderMaterial to simulate light emission
const cubeMaterial = new THREE.ShaderMaterial({
  vertexShader: `
    void main() {
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
  `,
  fragmentShader: `
    void main() {
      gl_FragColor = vec4(1.0);
    }
  `,
  blending: THREE.AdditiveBlending,
  transparent: true,
  depthWrite: false,
});

// Create the cube mesh
const cube = new THREE.Mesh(cubeGeometry, cubeMaterial);
scene.add(cube);

// Add a point light at the cube's position
const pointLight = new THREE.PointLight(0xffffff, 1, 50);
pointLight.position.set(0, 0, 0);
scene.add(pointLight);

// Add event listeners for key presses
document.addEventListener('keydown', function(event) {
  if (event.key === 'w' || event.key === 'W') {
    cube.position.y += 1; // Move up
  } else if (event.key === 's' || event.key === 'S') {
    cube.position.y -= 1; // Move down
  } else if (event.key === 'a' || event.key === 'A') {
    camera.position.x -= 1; // Move camera left
  } else if (event.key === 'd' || event.key === 'D') {
    camera.position.x += 1; // Move camera right
  }
});

// Load font and create text meshes
const loader = new FontLoader();
loader.load("/src/fonts/helvetiker_regular.typeface.json", function (font) {
  // ShaderMaterial for the alphabet mesh ("Y")
  const alphabetMaterial = new THREE.ShaderMaterial({
    uniforms: {
      lightPosition: { value: lightPosition },
      viewPosition: { value: viewPosition },
      ambientColor: { value: new THREE.Color(0x7fc7f8) }, // Light blue
      diffuseColor: { value: new THREE.Color(0x7fc7f8) },
      specularColor: { value: new THREE.Color(1, 1, 1) }, // White specular highlight
      ambientIntensity: { value: ambientIntensity },
      shininess: { value: 32.0 }, // Moderate shininess
    },
    vertexShader: alphabetVertexShader,
    fragmentShader: alphabetFragmentShader,
  });

  // ShaderMaterial for the digit mesh ("1")
  const digitMaterial = new THREE.ShaderMaterial({
    uniforms: {
      lightPosition: { value: lightPosition },
      viewPosition: { value: viewPosition },
      ambientColor: { value: new THREE.Color(0xf8b07f) }, // Complementary color to red
      diffuseColor: { value: new THREE.Color(0xf8b07f) },
      specularColor: { value: new THREE.Color(0xf8b07f) }, // Metallic specular
      ambientIntensity: { value: ambientIntensity },
      shininess: { value: 64.0 }, // Higher shininess for metallic appearance
    },
    vertexShader: digitVertexShader,
    fragmentShader: digitFragmentShader,
  });

  // Create "Y" mesh
  const yGeometry = new TextGeometry("Y", {
    font: font,
    size: 5,
    height: 1,
  });
  const yMesh = new THREE.Mesh(yGeometry, alphabetMaterial);
  yMesh.position.x = -10; // Place on the left
  scene.add(yMesh);

  // Create "1" mesh
  const oneGeometry = new TextGeometry("1", {
    font: font,
    size: 5,
    height: 1,
  });
  const oneMesh = new THREE.Mesh(oneGeometry, digitMaterial);
  oneMesh.position.x = 10; // Place on the right
  scene.add(oneMesh);

  // Position camera
  camera.position.z = 20;

  // Render loop
  function animate() {
    requestAnimationFrame(animate);

    // Update view position and light position
    viewPosition.copy(camera.position);
    lightPosition.copy(cube.position);

    // Update uniforms for alphabet material
    alphabetMaterial.uniforms.viewPosition.value.copy(viewPosition);
    alphabetMaterial.uniforms.lightPosition.value.copy(lightPosition);

    // Update uniforms for digit material
    digitMaterial.uniforms.viewPosition.value.copy(viewPosition);
    digitMaterial.uniforms.lightPosition.value.copy(lightPosition);

    renderer.render(scene, camera);
  }
  animate();
});