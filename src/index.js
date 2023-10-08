import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import * as dat from "dat.gui";

/**
 * Base
 */
// Debug
const gui = new dat.GUI();

// Canvas
const canvas = document.querySelector("canvas.webgl");

// Scene
const scene = new THREE.Scene();

/**
 * Textures
 */
const textureLoader = new THREE.TextureLoader();

/**
 * Objects
 */
let hearts = [];
const fontLoader = new THREE.FontLoader();
fontLoader.load(
  "/static/fonts/helvetiker_bold.typeface.json",
  // '/fonts/gentilis_regular.typeface.json',
  // '/fonts/optimer_regular.typeface.json',
  (font) => {
    const textGeometry = new THREE.TextGeometry("MATEUS", {
      font,
      size: 0.5,
      height: 0.2,
      curveSegments: 3,
      bevelEnabled: true,
      bevelThickness: 0.03,
      bevelSize: 0.04,
      bevelOffset: 0,
      bevelSegments: 8
    });

    // textGeometry.computeBoundingBox()
    // textGeometry.translate(
    //     textGeometry.boundingBox.max.x * -0.5,
    //     textGeometry.boundingBox.max.y * -0.5,
    //     textGeometry.boundingBox.max.z * -0.5,
    // )
    textGeometry.center(); // does the same things as above code
    const matcapTexture = textureLoader.load("/static/textures/matcaps/3.png");
    const material = new THREE.MeshMatcapMaterial({
      matcap: matcapTexture
    });
    const text = new THREE.Mesh(textGeometry, material);
    scene.add(text);

    const heartShape = new THREE.Shape();
    heartShape.moveTo(0.25, 0.25);
    heartShape.bezierCurveTo(0.25, 0.25, 0.2, 0, 0, 0);
    heartShape.bezierCurveTo(-0.3, 0, -0.3, 0.35, -0.3, 0.35);
    heartShape.bezierCurveTo(-0.3, 0.55, -0.1, 0.77, 0.25, 0.95);
    heartShape.bezierCurveTo(0.6, 0.77, 0.8, 0.55, 0.8, 0.35);
    heartShape.bezierCurveTo(0.8, 0.35, 0.8, 0, 0.5, 0);
    heartShape.bezierCurveTo(0.35, 0, 0.25, 0.25, 0.25, 0.25);

    const matcap5Texture = textureLoader.load("/static/textures/matcaps/5.png");
    const matcap8Texture = textureLoader.load("/static/textures/matcaps/8.png");
    const matcap5 = new THREE.MeshMatcapMaterial({
      matcap: matcap5Texture
    });
    const matcap8 = new THREE.MeshMatcapMaterial({
      matcap: matcap8Texture
    });

    const geometry = new THREE.ExtrudeGeometry(heartShape, {
      depth: 0.25,
      bevelEnabled: true,
      bevelSegments: 8,
      steps: 2,
      bevelSize: 0.1,
      bevelThickness: 0.1
    });

    const spread = 10;

    for (let i = 0; i < 100; i++) {
      const heart = new THREE.Mesh(geometry, matcap8);
      heart.position.x = (Math.random() - 0.5) * spread;
      heart.position.y = (Math.random() - 0.5) * spread;
      heart.position.z = (Math.random() - 0.5) * spread;
      heart.rotation.x = Math.random() * Math.PI;
      heart.rotation.y = Math.random() * Math.PI;
      const scale = Math.random();
      heart.scale.set(scale, scale, scale);
      hearts.push(heart);
    }
  }
);

/**
 * Sizes
 */
const sizes = {
  width: window.innerWidth,
  height: window.innerHeight
};

window.addEventListener("resize", () => {
  // Update sizes
  sizes.width = window.innerWidth;
  sizes.height = window.innerHeight;

  // Update camera
  camera.aspect = sizes.width / sizes.height;
  camera.updateProjectionMatrix();

  // Update renderer
  renderer.setSize(sizes.width, sizes.height);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
});

/**
 * Camera
 */
// Base camera
const camera = new THREE.PerspectiveCamera(
  75,
  sizes.width / sizes.height,
  0.1,
  100
);
camera.position.x = 1;
camera.position.y = 1;
camera.position.z = 3;
scene.add(camera);

// Controls
const controls = new OrbitControls(camera, canvas);
controls.enableDamping = true;

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
  canvas: canvas,
  alpha: true
});
renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

/**
 * Animate
 */
const clock = new THREE.Clock();

const tick = () => {
  const elapsedTime = clock.getElapsedTime();

  hearts.forEach((heart) => {
    heart.rotation.x = elapsedTime;
    heart.rotation.y = elapsedTime;
  });

  camera.position.x = Math.sin(elapsedTime);
  camera.position.y = Math.cos(elapsedTime);
  camera.lookAt(0, 0, 0);

  // Update controls
  controls.update();

  // Render
  renderer.render(scene, camera);

  // Call tick again on the next frame
  window.requestAnimationFrame(tick);
};

tick();
