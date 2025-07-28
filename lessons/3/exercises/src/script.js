import * as THREE from 'three';

// Fetch the canvas element
const canvas = document.querySelector('canvas.webgl');

// Create a scene
const scene = new THREE.Scene();

// Create geometry
const geometry = new THREE.BoxGeometry(1, 1, 1);
const material = new THREE.MeshBasicMaterial(
    {color: 0x00ff00}
);
const mesh = new THREE.Mesh(geometry, material);

// Add the mesh to the scene
scene.add(mesh);

// Create sizes
let sizes = {
    width: window.innerWidth,
    height: window.innerHeight
};

// sizes = {
//     width: 800,
//     height: 600
// }

// Create a camera
const camera = new THREE.PerspectiveCamera(
    45, // Field of view
    sizes.width / sizes.height, // Aspect ratio
);
// By default the camera is inside the cube. We need to position it outside so we can see it.
camera.position.z = 3; // Position the camera
scene.add(camera);

// Render the scene
const renderer = new THREE.WebGLRenderer({
    canvas: canvas
});
renderer.setSize(sizes.width, sizes.height);
renderer.render(scene, camera);