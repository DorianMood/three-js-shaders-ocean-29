import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import * as dat from "lil-gui";

import waterVertexShader from "./shaders/water/vertex.glsl";
import waterFragmentShader from "./shaders/water/fragment.glsl";

/**
 * Base
 */
// Debug
const gui = new dat.GUI({ width: 340 });
const debugObject = {};

// Canvas
const canvas = document.querySelector("canvas.webgl");

// Scene
const scene = new THREE.Scene();

debugObject.fog = {};
debugObject.fog.color = new THREE.Color(0xa0a0a0);
debugObject.fog.near = 0.25;
debugObject.fog.far = 8;
debugObject.fog.density = 0.5;

scene.fog = new THREE.Fog(
  debugObject.fog.color,
  debugObject.fog.near,
  debugObject.fog.far,
  debugObject.fog.density
);
scene.background = debugObject.fog.color;

/**
 * Water
 */
// Geometry
const waterGeometry = new THREE.PlaneGeometry(20, 20, 512, 512);

// Colors
debugObject.depthColor = 0x186691;
debugObject.surfaceColor = 0x9bd8ff;

// Material
const waterMaterial = new THREE.ShaderMaterial({
  vertexShader: waterVertexShader,
  fragmentShader: waterFragmentShader,
  fog: true,
  uniforms: THREE.UniformsUtils.merge([
    THREE.UniformsLib["fog"],
    {
      uBigWaveElevation: { value: 0.2 },
      uBigWaveFrequency: { value: new THREE.Vector2(1, 1) },
      uTime: { value: 0 },
      uBigWaveSpeed: { value: 0.75 },
      uDepthColor: { value: new THREE.Color(debugObject.depthColor) },
      uSurfaceColor: { value: new THREE.Color(debugObject.surfaceColor) },
      uColorOffset: { value: 0.08 },
      uColorMultiplier: { value: 5 },
      uSmallWavesElevation: { value: 0.15 },
      uSmallWavesFrequency: { value: 3 },
      uSmallWavesSpeed: { value: 0.2 },
      uSmallWavesIterations: { value: 3 },
    },
  ]),
});

gui
  .add(waterMaterial.uniforms.uBigWaveElevation, "value")
  .min(0)
  .max(1)
  .step(0.05)
  .name("uBigWaveElevation");

gui
  .add(waterMaterial.uniforms.uBigWaveFrequency.value, "x")
  .min(0)
  .max(10)
  .step(0.05)
  .name("uBigWaveFrequency.x");

gui
  .add(waterMaterial.uniforms.uBigWaveFrequency.value, "y")
  .min(0)
  .max(10)
  .step(0.05)
  .name("uBigWaveFrequency.y");

gui
  .add(waterMaterial.uniforms.uBigWaveSpeed, "value")
  .min(0)
  .max(10)
  .step(0.05)
  .name("uBigWaveSpeed");

gui
  .addColor(debugObject, "depthColor")
  .name("uDepthColor")
  .onChange(() => {
    waterMaterial.uniforms.uDepthColor.value.set(debugObject.depthColor);
  });

gui
  .addColor(debugObject, "surfaceColor")
  .name("uSurfaceColor")
  .onChange(() => {
    waterMaterial.uniforms.uDepthColor.value.set(debugObject.surfaceColor);
  });

gui
  .add(waterMaterial.uniforms.uColorOffset, "value")
  .min(0)
  .max(1)
  .step(0.1)
  .name("uColorOffset");

gui
  .add(waterMaterial.uniforms.uColorMultiplier, "value")
  .min(0)
  .max(10)
  .step(0.2)
  .name("uColorMultiplier");

gui
  .add(waterMaterial.uniforms.uSmallWavesElevation, "value")
  .min(0)
  .max(1)
  .step(0.1)
  .name("uSmallWavesElevation");

gui
  .add(waterMaterial.uniforms.uSmallWavesFrequency, "value")
  .min(0)
  .max(10)
  .step(0.1)
  .name("uSmallWavesFrequency");

gui
  .add(waterMaterial.uniforms.uSmallWavesSpeed, "value")
  .min(0)
  .max(1)
  .step(0.1)
  .name("uSmallWavesSpeed");

gui
  .add(waterMaterial.uniforms.uSmallWavesIterations, "value")
  .min(0)
  .max(10)
  .step(1)
  .name("uSmallWavesIterations");

gui
  .addColor(debugObject.fog, "color")
  .name("fogColor")
  .onChange(() => {
    scene.fog.color = debugObject.fog.color;
  });

gui
  .add(debugObject.fog, "near")
  .min(0)
  .max(10)
  .step(0.1)
  .name("fogNear")
  .onChange(() => {
    scene.fog.near = debugObject.fog.near;
  });

gui
  .add(debugObject.fog, "far")
  .min(0)
  .max(10)
  .step(0.1)
  .name("fogFar")
  .onChange(() => {
    scene.fog.far = debugObject.fog.far;
  });

gui
  .add(debugObject.fog, "density")
  .min(0)
  .max(10)
  .step(0.1)
  .name("fogDensity")
  .onChange(() => {
    scene.fog.density = debugObject.fog.density;
  });

// Mesh
const water = new THREE.Mesh(waterGeometry, waterMaterial);
water.rotation.x = -Math.PI * 0.5;
scene.add(water);

// Light
const light = new THREE.DirectionalLight(0xffffff, 0.8);
scene.add(light);

/**
 * Sizes
 */
const sizes = {
  width: window.innerWidth,
  height: window.innerHeight,
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
camera.position.set(1, 1, 1);
scene.add(camera);

// Controls
const controls = new OrbitControls(camera, canvas);
controls.enableDamping = true;

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
  canvas: canvas,
});
renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

/**
 * Animate
 */
const clock = new THREE.Clock();

const tick = () => {
  const elapsedTime = clock.getElapsedTime();

  // Water
  waterMaterial.uniforms.uTime.value = elapsedTime;

  // Update controls
  controls.update();

  // Render
  renderer.render(scene, camera);

  // Call tick again on the next frame
  window.requestAnimationFrame(tick);
};

tick();
