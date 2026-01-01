// --- 1. Three.js Setup ---
const scene = new THREE.Scene();

// Camera: Field of View, Aspect Ratio, Near, Far
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);

// Renderer: This renders the graphics to the <canvas>
const renderer = new THREE.WebGLRenderer({
  canvas: document.querySelector('#bg'),
  alpha: true // Allows CSS background to show through if needed
});

renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize(window.innerWidth, window.innerHeight);
camera.position.setZ(30);

// --- 2. Create Objects ---

// The Main Shape: Torus Knot (Looks like a complex system/network)
const geometry = new THREE.TorusKnotGeometry(10, 3, 100, 16);
const material = new THREE.MeshStandardMaterial({ 
    color: 0x58a6ff,  // The blue from your palette
    wireframe: true   // Wireframe looks more "tech/backend"
});
const torusKnot = new THREE.Mesh(geometry, material);
scene.add(torusKnot);

// Lighting
const pointLight = new THREE.PointLight(0xffffff);
pointLight.position.set(5, 5, 5);
const ambientLight = new THREE.AmbientLight(0xffffff);
scene.add(pointLight, ambientLight);

// --- 3. Background Particles (Stars) ---
function addStar() {
  const geometry = new THREE.SphereGeometry(0.25, 24, 24);
  const material = new THREE.MeshStandardMaterial({ color: 0xffffff });
  const star = new THREE.Mesh(geometry, material);

  // Random Position
  const [x, y, z] = Array(3).fill().map(() => THREE.MathUtils.randFloatSpread(100));

  star.position.set(x, y, z);
  scene.add(star);
}

// Create 200 stars
Array(200).fill().forEach(addStar);

// --- 4. Animation Loop ---
function animate() {
  requestAnimationFrame(animate);

  // Rotate the main shape
  torusKnot.rotation.x += 0.01;
  torusKnot.rotation.y += 0.005;
  torusKnot.rotation.z += 0.01;

  renderer.render(scene, camera);
}

// --- 5. Scroll Interaction ---
function moveCamera() {
  const t = document.body.getBoundingClientRect().top;
  
  // Rotate shape on scroll
  torusKnot.rotation.y += 0.01;
  torusKnot.rotation.z += 0.01;

  // Move camera
  camera.position.z = t * -0.01 + 30; // +30 is initial offset
  camera.position.x = t * -0.0002;
  camera.rotation.y = t * -0.0002;
}

document.body.onscroll = moveCamera;

// Handle window resize
window.addEventListener('resize', () => {
    renderer.setSize(window.innerWidth, window.innerHeight);
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
});

// Start Animation
animate();

// --- 6. Typing Effect (Retained from previous version) ---
const textElement = document.querySelector('.typing-text');
if(textElement) {
    const roles = ["Java Developer", "Backend Engineer", "Problem Solver"];
    let roleIndex = 0;
    let charIndex = 0;
    let isDeleting = false;

    function typeEffect() {
        const currentRole = roles[roleIndex];
        
        if (isDeleting) {
            textElement.textContent = currentRole.substring(0, charIndex - 1);
            charIndex--;
        } else {
            textElement.textContent = currentRole.substring(0, charIndex + 1);
            charIndex++;
        }

        let typeSpeed = isDeleting ? 100 : 200;

        if (!isDeleting && charIndex === currentRole.length) {
            isDeleting = true;
            typeSpeed = 2000; 
        } else if (isDeleting && charIndex === 0) {
            isDeleting = false;
            roleIndex = (roleIndex + 1) % roles.length;
            typeSpeed = 500;
        }

        setTimeout(typeEffect, typeSpeed);
    }
    document.addEventListener('DOMContentLoaded', typeEffect);
}
