
import * as THREE from 'three';

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.z = 15; 

const renderer = new THREE.WebGLRenderer({
    antialias: true,
    canvas: document.createElement('canvas') 
});
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.domElement.id = 'bg-canvas';
document.body.appendChild(renderer.domElement);

const ambientLight = new THREE.AmbientLight(0xffffff, 0.2); 
scene.add(ambientLight);

const directionalLight = new THREE.DirectionalLight(0xffffff, .5);
directionalLight.position.set(0, 0, -2); 
scene.add(directionalLight);

const textureLoader = new THREE.TextureLoader();

        const planet1Texture = textureLoader.load('../media/marte.jpg');
        const planet1Geometry = new THREE.SphereGeometry(8, 64, 64); 
        const planet1Material = new THREE.MeshStandardMaterial({ map: planet1Texture });
        const planet1 = new THREE.Mesh(planet1Geometry, planet1Material);
        planet1.position.set(12, -8, -10); 
        scene.add(planet1);

        const planet2Texture = textureLoader.load('../media/jupiter.jpg');
        const planet2Geometry = new THREE.SphereGeometry(3, 32, 32); 
        const planet2Material = new THREE.MeshStandardMaterial({ map: planet2Texture });
        const planet2 = new THREE.Mesh(planet2Geometry, planet2Material);
        planet2.position.set(-15, 7, -12);
        scene.add(planet2);

        const starVertices = [];
        for (let i = 0; i < 10000; i++) {
            const x = (Math.random() - 0.5) * 2000;
            const y = (Math.random() - 0.5) * 2000;
            const z = (Math.random() - 0.5) * 2000;
            starVertices.push(x, y, z);
        }
        const starGeometry = new THREE.BufferGeometry();
        starGeometry.setAttribute('position', new THREE.Float32BufferAttribute(starVertices, 3));
        const starMaterial = new THREE.PointsMaterial({ 
            color: 0xffffff,
            size: 0.7 
        });
        const stars = new THREE.Points(starGeometry, starMaterial);
        scene.add(stars);

        function animate() {
            requestAnimationFrame(animate);

            planet1.rotation.y += 0.0005;
            planet2.rotation.y += 0.001;

            stars.rotation.y += 0.0001;

            renderer.render(scene, camera);
        }
        animate();

        window.addEventListener('resize', () => {
            camera.aspect = window.innerWidth / window.innerHeight;
            camera.updateProjectionMatrix();
            renderer.setSize(window.innerWidth, window.innerHeight);
        });