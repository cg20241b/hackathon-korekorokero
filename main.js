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

// ShaderMaterial for the alphabet mesh ("Y")
const alphabetMaterial = new THREE.ShaderMaterial({
  uniforms: {
    lightPosition: { value: lightPosition },
    viewPosition: { value: viewPosition },
    ambientColor: { value: new THREE.Color(0xADD8E6) }, // Light blue
    diffuseColor: { value: new THREE.Color(0xADD8E6) },
    specularColor: { value: new THREE.Color(1, 1, 1) }, // White specular highlight
    ambientIntensity: { value: ambientIntensity },
    shininess: { value: 32.0 }, // Moderate shininess
  },
  vertexShader: `
    varying vec3 vNormal;
    varying vec3 vPosition;

    void main() {
      vNormal = normalMatrix * normal;
      vPosition = (modelViewMatrix * vec4(position, 1.0)).xyz;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
  `,
  fragmentShader: `
    uniform vec3 lightPosition;
    uniform vec3 viewPosition;
    uniform vec3 ambientColor;
    uniform vec3 diffuseColor;
    uniform vec3 specularColor;
    uniform float ambientIntensity;
    uniform float shininess;

    varying vec3 vNormal;
    varying vec3 vPosition;

    void main() {
      vec3 normal = normalize(vNormal);
      vec3 lightDir = normalize(lightPosition - vPosition);
      vec3 viewDir = normalize(viewPosition - vPosition);

      // Ambient component
      vec3 ambient = ambientIntensity * ambientColor;

      // Diffuse component
      float diff = max(dot(normal, lightDir), 0.0);
      vec3 diffuse = diff * diffuseColor;

      // Specular component (Phong model)
      vec3 reflectDir = reflect(-lightDir, normal);
      float spec = pow(max(dot(viewDir, reflectDir), 0.0), shininess);
      vec3 specular = spec * specularColor;

      vec3 color = ambient + diffuse + specular;
      gl_FragColor = vec4(color, 1.0);
    }
  `,
});

// ShaderMaterial for the digit mesh ("1")
const digitMaterial = new THREE.ShaderMaterial({
  uniforms: {
    lightPosition: { value: lightPosition },
    viewPosition: { value: viewPosition },
    ambientColor: { value: new THREE.Color(0x00FFFF) }, // Complementary color to red
    diffuseColor: { value: new THREE.Color(0x00FFFF) },
    specularColor: { value: new THREE.Color(0x00FFFF) }, // Metallic specular
    ambientIntensity: { value: ambientIntensity },
    shininess: { value: 64.0 }, // Higher shininess for metallic appearance
  },
  vertexShader: `
    varying vec3 vNormal;
    varying vec3 vPosition;

    void main() {
      vNormal = normalMatrix * normal;
      vPosition = (modelViewMatrix * vec4(position, 1.0)).xyz;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
  `,
  fragmentShader: `
    uniform vec3 lightPosition;
    uniform vec3 viewPosition;
    uniform vec3 ambientColor;
    uniform vec3 diffuseColor;
    uniform vec3 specularColor;
    uniform float ambientIntensity;
    uniform float shininess;

    varying vec3 vNormal;
    varying vec3 vPosition;

    void main() {
      vec3 normal = normalize(vNormal);
      vec3 lightDir = normalize(lightPosition - vPosition);
      vec3 viewDir = normalize(viewPosition - vPosition);

      // Ambient component
      vec3 ambient = ambientIntensity * ambientColor;

      // Diffuse component
      float diff = max(dot(normal, lightDir), 0.0);
      vec3 diffuse = diff * diffuseColor;

      // Specular component (Phong model)
      vec3 reflectDir = reflect(-lightDir, normal);
      float spec = pow(max(dot(viewDir, reflectDir), 0.0), shininess);
      vec3 specular = spec * specularColor;

      vec3 color = ambient + diffuse + specular;
      gl_FragColor = vec4(color, 1.0);
    }
  `,
});

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

    // Update view position (if the camera moves)
    viewPosition.copy(camera.position);
    lightPosition.copy(cube.position);
    alphabetMaterial.uniforms.viewPosition.value.copy(viewPosition);
    digitMaterial.uniforms.viewPosition.value.copy(viewPosition);

    renderer.render(scene, camera);
  }
  animate();
});