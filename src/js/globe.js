/**
 * WebGL Globe — Three.js point cloud.
 * Lazy-loaded via dynamic import() from main.js.
 * Treeshaken: only imports what the globe scene needs.
 */

import {
  WebGLRenderer,
  Scene,
  PerspectiveCamera,
  BufferGeometry,
  BufferAttribute,
  Points,
  PointsMaterial,
  Color,
  AdditiveBlending,
  SphereGeometry,
  MeshPhongMaterial,
  Mesh,
  AmbientLight,
  DirectionalLight,
} from 'three';

let renderer, scene, camera, globe, pointCloud;
let animationId;
let mouseX = 0;
let mouseY = 0;
let targetX = 0;
let targetY = 0;

// Hardcoded city locations (lat, lon) for accent dots
const CITIES = [
  { lat: 40.7128, lon: -74.006 },   // New York
  { lat: 51.5074, lon: -0.1278 },   // London
  { lat: -23.5505, lon: -46.6333 }, // São Paulo
  { lat: 25.2048, lon: 55.2708 },   // Dubai
  { lat: 1.3521, lon: 103.8198 },   // Singapore
  { lat: 35.6762, lon: 139.6503 },  // Tokyo
];

function latLonToVector3(lat, lon, radius) {
  const phi = (90 - lat) * (Math.PI / 180);
  const theta = (lon + 180) * (Math.PI / 180);

  return {
    x: -(radius * Math.sin(phi) * Math.cos(theta)),
    y: radius * Math.cos(phi),
    z: radius * Math.sin(phi) * Math.sin(theta),
  };
}

function generateGlobePoints(count, radius) {
  const positions = new Float32Array(count * 3);
  const colors = new Float32Array(count * 3);

  const baseColor = new Color(0.15, 0.15, 0.15);
  const accentColor = new Color(0.349, 0.416, 0.816); // purple #596AD0

  for (let i = 0; i < count; i++) {
    // Uniform sphere distribution
    const theta = Math.random() * Math.PI * 2;
    const phi = Math.acos(2 * Math.random() - 1);

    const x = radius * Math.sin(phi) * Math.cos(theta);
    const y = radius * Math.cos(phi);
    const z = radius * Math.sin(phi) * Math.sin(theta);

    positions[i * 3] = x;
    positions[i * 3 + 1] = y;
    positions[i * 3 + 2] = z;

    // Base point color — very dim white/gray
    colors[i * 3] = 0.12;
    colors[i * 3 + 1] = 0.12;
    colors[i * 3 + 2] = 0.12;
  }

  return { positions, colors };
}

function createAccentPoints(radius) {
  const positions = [];
  const colors = [];

  CITIES.forEach(({ lat, lon }) => {
    // Cluster of points around each city
    for (let j = 0; j < 12; j++) {
      const jitter = (Math.random() - 0.5) * 0.15;
      const v = latLonToVector3(lat + jitter * 10, lon + jitter * 10, radius);
      positions.push(v.x, v.y, v.z);
      // Lime accent
      colors.push(0.349, 0.416, 0.816);
    }
  });

  return {
    positions: new Float32Array(positions),
    colors: new Float32Array(colors),
  };
}

export function initGlobe(canvas) {
  if (!canvas) return;

  const container = canvas.parentElement;
  const W = container.clientWidth;
  const H = container.clientHeight;

  // Renderer
  renderer = new WebGLRenderer({
    canvas,
    antialias: false,
    alpha: true,
    powerPreference: 'low-power',
  });
  renderer.setSize(W, H);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
  renderer.setClearColor(0x000000, 0);

  // Scene
  scene = new Scene();

  // Camera
  camera = new PerspectiveCamera(45, W / H, 0.1, 1000);
  camera.position.set(0, 0, 4.5);

  const RADIUS = 1.8;

  // --- Globe base point cloud ---
  const POINT_COUNT = 8000;
  const { positions, colors } = generateGlobePoints(POINT_COUNT, RADIUS);

  const geo = new BufferGeometry();
  geo.setAttribute('position', new BufferAttribute(positions, 3));
  geo.setAttribute('color', new BufferAttribute(colors, 3));

  const mat = new PointsMaterial({
    size: 0.012,
    vertexColors: true,
    transparent: true,
    opacity: 0.8,
    blending: AdditiveBlending,
    depthWrite: false,
    sizeAttenuation: true,
  });

  globe = new Points(geo, mat);
  scene.add(globe);

  // --- Accent (city) points ---
  const accentData = createAccentPoints(RADIUS);
  const accentGeo = new BufferGeometry();
  accentGeo.setAttribute('position', new BufferAttribute(accentData.positions, 3));
  accentGeo.setAttribute('color', new BufferAttribute(accentData.colors, 3));

  const accentMat = new PointsMaterial({
    size: 0.025,
    vertexColors: true,
    transparent: true,
    opacity: 0.9,
    blending: AdditiveBlending,
    depthWrite: false,
    sizeAttenuation: true,
  });

  const accentPoints = new Points(accentGeo, accentMat);
  scene.add(accentPoints);

  // Pulse animation for accent points
  let accentPulse = 0;
  const animateAccent = () => {
    accentPulse += 0.02;
    accentMat.opacity = 0.5 + 0.4 * Math.sin(accentPulse);
  };

  // Mouse parallax
  const heroEl = document.querySelector('#hero');
  if (heroEl) {
    heroEl.addEventListener('mousemove', (e) => {
      const rect = heroEl.getBoundingClientRect();
      mouseX = ((e.clientX - rect.left) / rect.width - 0.5) * 2;
      mouseY = ((e.clientY - rect.top) / rect.height - 0.5) * 2;
    }, { passive: true });
  }

  // Render loop
  let rotationY = 0;
  const tick = () => {
    animationId = requestAnimationFrame(tick);

    // Slow base rotation
    rotationY += 0.0005;
    globe.rotation.y = rotationY;
    accentPoints.rotation.y = rotationY;

    // Mouse parallax — slight globe tilt
    targetX += (mouseX * 0.15 - targetX) * 0.05;
    targetY += (mouseY * 0.1 - targetY) * 0.05;
    globe.rotation.x = targetY;
    accentPoints.rotation.x = targetY;

    animateAccent();
    renderer.render(scene, camera);
  };

  tick();

  // Resize handler
  const onResize = () => {
    const W2 = container.clientWidth;
    const H2 = container.clientHeight;
    camera.aspect = W2 / H2;
    camera.updateProjectionMatrix();
    renderer.setSize(W2, H2);
  };

  window.addEventListener('resize', onResize, { passive: true });

  // Hide fallback
  const fallback = document.querySelector('.globe-fallback');
  if (fallback) fallback.style.display = 'none';

  return () => {
    cancelAnimationFrame(animationId);
    renderer.dispose();
    window.removeEventListener('resize', onResize);
  };
}
