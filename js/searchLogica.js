// --- 1. CONFIGURACIÓN BÁSICA Y LUZ (Three.js) ---

const scene = new THREE.Scene();

const planetContainer = document.getElementById('threejs-planet-container');

// Solo inicializamos si el contenedor existe
if (planetContainer) {
    const aspectRatio = planetContainer.clientWidth / planetContainer.clientHeight;
    const camera = new THREE.PerspectiveCamera(75, aspectRatio, 0.1, 1000);
    
    const renderer = new THREE.WebGLRenderer({ 
        antialias: true, 
        alpha: true // CLAVE: Permite que el fondo se vea
    }); 

    // Establece el color de fondo del renderizador a transparente
    renderer.setClearColor(0x000000, 0); 

    // AJUSTE: Adjuntamos el canvas al contenedor específico
    renderer.setSize(planetContainer.clientWidth, planetContainer.clientHeight);
    planetContainer.appendChild(renderer.domElement);

    // ***************************************************************
    // CONTROLES: Mantienen el movimiento del ratón
    // ***************************************************************
    const controls = new THREE.OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.minDistance = 15;
    controls.maxDistance = 50;

    // Posición inicial de la cámara: mirando al centro del visor
    const cameraFocusPosition = new THREE.Vector3(0, 0, 25); 
    camera.position.copy(cameraFocusPosition);
    controls.target.set(0, 0, 0); 
    controls.update();

    // LUZ Y AMBIENTE
    // Aumentamos la luz ambiental
    const ambientLight = new THREE.AmbientLight(0x404040, 2.0); // Aumento a 2.0
    scene.add(ambientLight);

    // Aumentamos la luz puntual para el brillo
    const pointLight = new THREE.PointLight(0xffffff, 3.0); // Aumento a 3.0
    pointLight.position.set(50, 50, 50);
    scene.add(pointLight);

    const planets = [];

    // --- 2. CREACIÓN DE PLANETAS ---

    function createPlanet(name, radius, color) { 
        const geometry = new THREE.SphereGeometry(radius, 64, 64); 
        
        const material = new THREE.MeshPhongMaterial({ 
            color: new THREE.Color(color),
            specular: 0x888888, 
            shininess: 80       // ⬅️ CLAVE: Aumentamos el brillo del material (de 30 a 80)
        });

        const mesh = new THREE.Mesh(geometry, material);
        
        mesh.name = name.toLowerCase(); 
        mesh.visible = false; // Comienzan ocultos
        
        scene.add(mesh);
        planets.push(mesh);
        
        return mesh;
    }

    const sunLight = new THREE.PointLight(0xFFFF00, 3, 500); 
    sunLight.position.set(0, 0, 0);
    scene.add(sunLight);

    // Crear planetas (todos centrados en 0,0,0)
    createPlanet("Mercurio", 3, 0xaaaaaa); 
    createPlanet("Venus", 5, 0xdaa520);
    createPlanet("Tierra", 6, 0x0000ff);
    createPlanet("Marte", 4, 0xff4500);
    createPlanet("Jupiter", 12, 0xd2b48c);
    createPlanet("Saturno", 10, 0xf0e68c);


    // --- 3. LÓGICA DE BÚSQUEDA ---

    const searchInput = document.getElementById('planet-input'); 
    let targetPlanet = null; 
    const planetDisplayArea = document.getElementById('planet-display-area');

    if (searchInput) {
        searchInput.addEventListener('input', (event) => {
            const searchTerm = event.target.value.toLowerCase().trim();
            
            planets.forEach(p => p.visible = false);
            targetPlanet = null;
            
            // ***************************************************************
            // LÓGICA CORREGIDA: Controla la visibilidad del área de visualización
            // ***************************************************************
            if (searchTerm.length === 0) {
                planetDisplayArea.style.display = 'none'; // Oculta si el campo está vacío
                return;
            }

            const foundPlanet = planets.find(planet => planet.name.includes(searchTerm));

            if (foundPlanet) {
                targetPlanet = foundPlanet;
                targetPlanet.visible = true; 
                planetDisplayArea.style.display = 'flex'; // Muestra si se encuentra algo
            } else {
                // Oculta si el usuario escribe algo que no existe
                planetDisplayArea.style.display = 'none';
            }
        });
    }

    // --- 4. ANIMACIÓN Y BUCLE DE RENDERIZADO ---

    function animateThreeJS() {
        requestAnimationFrame(animateThreeJS);

        if (targetPlanet) {
            targetPlanet.rotation.y += 0.005;
        }

        controls.update(); 
        renderer.render(scene, camera);
    }

    animateThreeJS(); 

    // --- 5. RESPONSIVE DESIGN ---

    window.addEventListener('resize', () => {
        renderer.setSize(planetContainer.clientWidth, planetContainer.clientHeight);
        camera.aspect = planetContainer.clientWidth / planetContainer.clientHeight;
        camera.updateProjectionMatrix();
    });
}