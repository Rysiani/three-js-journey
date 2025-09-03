import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import GUI from 'lil-gui'

/**
 * Base
 */
// Debug
const gui = new GUI()

// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()

/**
 * Textures
 */
const textureLoader = new THREE.TextureLoader()
const bakedShadow = textureLoader.load('/textures/bakedShadow.jpg')
bakedShadow.colorSpace = THREE.SRGBColorSpace

// simple shadow
const simpleShadow = textureLoader.load('/textures/simpleShadow.jpg')


/**
 * Lights
 */
// Ambient light
const ambientLight = new THREE.AmbientLight(0xffffff, 1)
gui.add(ambientLight, 'intensity').min(0).max(3).step(0.001)
scene.add(ambientLight)

// Directional light
const directionalLight = new THREE.DirectionalLight(0xffffff, 1.5)
directionalLight.position.set(2, 2, - 1)
gui.add(directionalLight, 'intensity').min(0).max(3).step(0.001)
gui.add(directionalLight.position, 'x').min(- 5).max(5).step(0.001)
gui.add(directionalLight.position, 'y').min(- 5).max(5).step(0.001)
gui.add(directionalLight.position, 'z').min(- 5).max(5).step(0.001)
scene.add(directionalLight)

const sphereRadius = {
    value: 0.5
}
gui.add(sphereRadius, 'value').min(0.1).max(2).step(0.001)
directionalLight.castShadow = true
// increase the render size
directionalLight.shadow.mapSize.width = 1024
directionalLight.shadow.mapSize.height = 1024

// near and far values
directionalLight.shadow.camera.near = 1
directionalLight.shadow.camera.far = 6

// size for the shadow
directionalLight.shadow.camera.left = - sphereRadius.value * 1.1
directionalLight.shadow.camera.right = sphereRadius.value * 1.1
directionalLight.shadow.camera.top = sphereRadius.value * 1.1
directionalLight.shadow.camera.bottom = - sphereRadius.value * 1.1

// shadow radius
directionalLight.shadow.radius = 1.5
gui.add(directionalLight.shadow, 'radius').min(0).max(20).step(0.001)


const directionalLightCameraHelper = new THREE.CameraHelper(directionalLight.shadow.camera)
directionalLightCameraHelper.visible = false
gui.add(directionalLightCameraHelper, 'visible').name('Directional Light Camera Helper')
scene.add(directionalLightCameraHelper)

// Spot light
const spotLight = new THREE.SpotLight(0xffffff, 4, 10, Math.PI * 0.3)

gui.add(spotLight, 'intensity').min(0).max(5).step(0.001)

spotLight.position.set(0, 2, 2)
spotLight.castShadow = true

spotLight.shadow.mapSize.width = 1024
spotLight.shadow.mapSize.height = 1024

spotLight.shadow.camera.near = 1
spotLight.shadow.camera.far = 4

scene.add(spotLight)
scene.add(spotLight.target)


const spotLightCameraHelper = new THREE.CameraHelper(spotLight.shadow.camera)
spotLightCameraHelper.visible = false
gui.add(spotLightCameraHelper, 'visible').name('Spot Light Camera Helper')
scene.add(spotLightCameraHelper)

// Point light
const pointLight = new THREE.PointLight(0xffffff, 5)
pointLight.position.set(-0.5, 1, 0)
pointLight.castShadow = true
pointLight.shadow.mapSize.width = 1024
pointLight.shadow.mapSize.height = 1024
pointLight.shadow.camera.near = 0.1
pointLight.shadow.camera.far = 2.5


const pointLightCameraHelper = new THREE.CameraHelper(pointLight.shadow.camera)
pointLightCameraHelper.visible = false
gui.add(pointLightCameraHelper, 'visible').name('Camera Point Light Helper')
scene.add(pointLightCameraHelper)
gui.add(pointLight, 'intensity').min(0).max(5).step(0.001)
scene.add(pointLight)


/**
 * Materials
 */
const material = new THREE.MeshStandardMaterial()
material.roughness = 0.7
gui.add(material, 'metalness').min(0).max(1).step(0.001)
gui.add(material, 'roughness').min(0).max(1).step(0.001)

/**
 * Objects
 */
const sphere = new THREE.Mesh(
    new THREE.SphereGeometry(sphereRadius.value, 32, 32),
    material
)
sphere.castShadow = true

const plane = new THREE.Mesh(
    new THREE.PlaneGeometry(5, 5),
    // new THREE.MeshStandardMaterial({
    //     map: bakedShadow
    // })
    material
)
plane.rotation.x = - Math.PI * 0.5
plane.position.y = - 0.5

plane.receiveShadow = true

scene.add(sphere, plane)

// shadowplane
const sphereShadow = new THREE.Mesh(
    new THREE.PlaneGeometry(1.5, 1.5),
    new THREE.MeshBasicMaterial({
        color: 0x000000,
        transparent: true,
        alphaMap: simpleShadow
    })
)
sphereShadow.position.y = plane.position.y + 0.01
sphereShadow.rotation.x = - Math.PI * 0.5
sphereShadow.receiveShadow = true
scene.add(sphereShadow)

/**
 * Sizes
 */
const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
}

window.addEventListener('resize', () =>
{
    // Update sizes
    sizes.width = window.innerWidth
    sizes.height = window.innerHeight

    // Update camera
    camera.aspect = sizes.width / sizes.height
    camera.updateProjectionMatrix()

    // Update renderer
    renderer.setSize(sizes.width, sizes.height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
})

/**
 * Camera
 */
// Base camera
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 100)
camera.position.x = 1
camera.position.y = 1
camera.position.z = 2
scene.add(camera)

// Controls
const controls = new OrbitControls(camera, canvas)
controls.enableDamping = true

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
    canvas: canvas
})
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

// renderer.shadowMap.enabled = true
renderer.shadowMap.type = THREE.PCFSoftShadowMap

/**
 * Animate
 */
const clock = new THREE.Clock()

const tick = () =>
{
    const elapsedTime = clock.getElapsedTime()
    // Update the sphere
    sphere.position.z = Math.cos(elapsedTime) * 1.5
    sphere.position.x = Math.sin(elapsedTime) *1.5
    sphere.position.y = Math.abs(Math.sin(elapsedTime * 3))

    sphereShadow.position.x = sphere.position.x
    sphereShadow.position.z = sphere.position.z
    sphereShadow.material.opacity = (1 - sphere.position.y) * 0.5

    // Update controls
    controls.update()

    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()