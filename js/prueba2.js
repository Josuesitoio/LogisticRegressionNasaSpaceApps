const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);

const renderer = new THREE.WebGLRenderer({ 
    antialias: true,
    alpha: true 
});

renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

renderer.setClearColor(0x000000, 1); 

const controls = new THREE.OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.minDistance = 15;
controls.maxDistance = 50;

camera.position.set(0, 0, 50);
controls.target.set(0, 0, 0); 
controls.update();

const ambientLight = new THREE.AmbientLight(0xffffff, 0.4); 
scene.add(ambientLight);

function createStarfield() {
    const starGeometry = new THREE.BufferGeometry();
    const starMaterial = new THREE.PointsMaterial({
        color: 0xffffff,
        size: 0.5,
        transparent: true,
        blending: THREE.AdditiveBlending,
        sizeAttenuation: true
    });

    const vertices = [];
    for (let i = 0; i < 5000; i++) {
        const x = (Math.random() - 0.5) * 2000;
        const y = (Math.random() - 0.5) * 2000;
        const z = (Math.random() - 0.5) * 2000;
        vertices.push(x, y, z);
    }
    starGeometry.setAttribute('position', new THREE.Float32BufferAttribute(vertices, 3));

    const stars = new THREE.Points(starGeometry, starMaterial);
    stars.name = "starfield"; 
    scene.add(stars); 
}

createStarfield();

const planets = [];

const textureLoader = new THREE.TextureLoader();

function getPlanetData(name) {
    const basePath = '../media/'; 
    let fallbackColor = 0x888888; 

    switch (name.toLowerCase()) {
        case "mercurio":
            fallbackColor = 0xAAAAAA;
            return { 
                radius: 3, map: basePath + '2k_mercury.jpg',
                normalMap: null, 
                roughness: 0.9, fallbackColor
            };
        case "venus":
            fallbackColor = 0xdaa520;
            return { 
                radius: 5, map: basePath + 'venus.jpg', 
                normalMap: null, 
                roughness: 0.5, fallbackColor
            };
        case "tierra":
            return { 
                radius: 6, map: basePath + 'tierradia.jpg', 
                normalMap: basePath + 'tierra.jpg', 
                roughness: 0.7, metalness: 0.1, fallbackColor
            };
        case "marte":
            fallbackColor = 0xff4500;
            return { 
                radius: 4, map: basePath + 'marte.jpg',
                normalMap: null, 
                roughness: 1.0, fallbackColor
            };
        case "jupiter":
            fallbackColor = 0xd2b48c;
            return { 
                radius: 12, map: basePath + 'jupiter.jpg', 
                normalMap: null, 
                roughness: 0.9, fallbackColor
            };
        case "saturno":
            fallbackColor = 0xf0e68c;
            return { 
                radius: 10, map: basePath + 'saturno.jpg', 
                normalMap: null, 
                roughness: 0.9,
                ringMap: basePath + 'arosSaturno.png', 
                fallbackColor 
            };
        case "u":
            fallbackColor = 0xf0e68c;
            return { 
                radius: 10, map: basePath + 'saturno.', 
                normalMap: null, 
                roughness: 0.9,
                ringMap: basePath + 'arosSaturno.jpg', 
                fallbackColor 
            };
        default:
            return { radius: 1, map: null, normalMap: null, roughness: 1.0, fallbackColor: 0x888888 };
    }
}

function createPlanet(name, xPos) {
    const data = getPlanetData(name);
    
    let materialOptions = {
        color: new THREE.Color(data.fallbackColor),
        roughness: data.roughness,
        metalness: data.metalness || 0.0,
    };

    if (data.map) {
        const mapTexture = textureLoader.load(
            data.map, 
            (texture) => { console.log(`Textura de ${name} cargada.`); }, 
            undefined, 
            (error) => { 
                console.error(`🔴 ERROR al cargar la textura de ${name} en: ${data.map}`, error); 
                console.warn(`Mostrando color de respaldo (${data.fallbackColor}) para ${name}.`);
            } 
        );
        materialOptions.map = mapTexture;
    }

    if (data.normalMap) {
        const normalTexture = textureLoader.load(data.normalMap, 
            () => {}, 
            undefined, 
            (error) => { console.error(`🔴 ERROR al cargar el normal map de ${name}:`, error); }
        );
        materialOptions.normalMap = normalTexture;
        materialOptions.normalScale = new THREE.Vector2(0.5, 0.5); 
    }

    const geometry = new THREE.SphereGeometry(data.radius, 64, 64);
    const material = new THREE.MeshStandardMaterial(materialOptions);
    const mesh = new THREE.Mesh(geometry, material);
    
    if (name.toLowerCase() === 'saturno' && data.ringMap) {
        const ringGeometry = new THREE.RingGeometry(data.radius * 1.2, data.radius * 2.2, 64);
        
        const ringTexture = textureLoader.load(data.ringMap,
            () => {}, 
            undefined, 
            (error) => { console.error(`🔴 ERROR al cargar la textura del anillo de Saturno:`, error); }
        );
        
        const ringMaterial = new THREE.MeshBasicMaterial({
            map: ringTexture,
            side: THREE.DoubleSide,
            transparent: true, 
            opacity: 0.8
        });

        var pos = ringGeometry.attributes.position;
        var v3 = new THREE.Vector3();
        for (let i = 0; i < pos.count; i++){
            v3.fromBufferAttribute(pos, i);
            ringGeometry.attributes.uv.setXY(i, v3.length() < data.radius * 1.7 ? 0 : 1, 1);
        }

        const ringMesh = new THREE.Mesh(ringGeometry, ringMaterial);
        ringMesh.rotation.x = Math.PI / 2; 
        ringMesh.rotation.y = 0.3; 
        mesh.add(ringMesh);
    }
    
    mesh.name = name.toLowerCase(); 
    mesh.position.x = xPos;
    mesh.visible = false; 
    
    scene.add(mesh);
    planets.push(mesh);
    
    return mesh;
}

const sunLight = new THREE.PointLight(0xffffff, 8, 500); 
sunLight.position.set(0, 0, 0);
scene.add(sunLight);

createPlanet("Mercurio", 0); 
createPlanet("Venus", 0);
createPlanet("Tierra", 0);
createPlanet("Marte", 0); 
createPlanet("Jupiter", 0);
createPlanet("Saturno", 0);

const searchInput = document.getElementById('planet-search');
let targetPlanet = null; 
let isSearching = false;
const galaxyCanvas = document.getElementById('galaxy-canvas'); 
const starfield = scene.getObjectByName("starfield");

const cameraFocusPosition = new THREE.Vector3(0, 0, 25); 

searchInput.addEventListener('input', (event) => {
    const searchTerm = event.target.value.toLowerCase().trim();
    
    planets.forEach(p => p.visible = false);
    targetPlanet = null;

    if (galaxyCanvas) {
        galaxyCanvas.style.display = (searchTerm.length > 0) ? 'none' : 'block';
    }
    
    if (starfield) {
        starfield.visible = (searchTerm.length > 0);
    }

    const foundPlanet = planets.find(planet => planet.name.includes(searchTerm));

    if (foundPlanet && searchTerm.length > 0) {
        targetPlanet = foundPlanet;
        targetPlanet.visible = true; 
        controls.target.set(0, 0, 0);
        isSearching = true;

    } else if (searchTerm.length === 0) {
        controls.target.set(0, 0, 0);
        isSearching = true;
    }
});

function animate() {
    requestAnimationFrame(animate);

    if (isSearching) {
        camera.position.lerp(cameraFocusPosition, 0.05); 
        
        if (camera.position.distanceTo(cameraFocusPosition) < 0.1) {
            isSearching = false;
        }
    }
    
    if (targetPlanet) {
        targetPlanet.rotation.y += 0.005;
    }
    if (starfield && starfield.visible) {
        starfield.rotation.y += 0.0005;
    }

    controls.update(); 
    renderer.render(scene, camera);
}

animate(); 

window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});