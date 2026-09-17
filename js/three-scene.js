// Three.js Interactive 3D Visualizer for Forma Studio Chair
(function() {
  let scene, camera, renderer, chairGroup, chairMaterial, shadowPlane;
  let isInitialized = false;
  let isDragging = false;
  let previousMousePosition = { x: 0, y: 0 };
  let targetRotationY = 0;
  let targetRotationX = 0;
  let currentRotationY = 0;
  let currentRotationX = 0;
  let animationFrameId = null;

  function initThreeScene(container) {
    if (!window.THREE) {
      console.warn("Three.js not yet loaded.");
      return;
    }

    if (isInitialized && renderer) {
      if (renderer.domElement && !container.contains(renderer.domElement)) {
        container.appendChild(renderer.domElement);
      }
      onResize();
      return;
    }

    const width = container.clientWidth || 580;
    const height = container.clientHeight || 550;

    // Scene setup
    scene = new THREE.Scene();

    // Camera setup
    camera = new THREE.PerspectiveCamera(38, width / height, 0.1, 100);
    camera.position.set(0, 0.4, 4.2);
    camera.lookAt(0, 0.05, 0);

    // Renderer setup with alpha transparency
    renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.15;

    container.innerHTML = '';
    container.appendChild(renderer.domElement);

    // Group to hold chair
    chairGroup = new THREE.Group();
    scene.add(chairGroup);

    // Studio Lighting
    setupStudioLighting();

    // Procedural 3D Chair Model
    createProceduralChair('#1a4dc4');

    // Contact Shadow Plane
    createContactShadow();

    // Interaction handlers
    setupInteraction(container);

    // Window resize handler
    window.addEventListener('resize', onResize);

    isInitialized = true;
    animate();
  }

  function setupStudioLighting() {
    // Ambient fill
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.9);
    scene.add(ambientLight);

    // Key light (soft warm top-front)
    const keyLight = new THREE.DirectionalLight(0xffffff, 2.2);
    keyLight.position.set(3, 4.5, 4);
    keyLight.castShadow = true;
    keyLight.shadow.mapSize.width = 1024;
    keyLight.shadow.mapSize.height = 1024;
    keyLight.shadow.camera.near = 0.5;
    keyLight.shadow.camera.far = 15;
    keyLight.shadow.bias = -0.001;
    const d = 2.5;
    keyLight.shadow.camera.left = -d;
    keyLight.shadow.camera.right = d;
    keyLight.shadow.camera.top = d;
    keyLight.shadow.camera.bottom = -d;
    scene.add(keyLight);

    // Fill light (cooler soft light from left)
    const fillLight = new THREE.DirectionalLight(0xbad2ff, 1.2);
    fillLight.position.set(-4, 2, 2.5);
    scene.add(fillLight);

    // Rim / Sheen light (highlights velvet edges from behind)
    const rimLight = new THREE.DirectionalLight(0xffffff, 1.8);
    rimLight.position.set(0, 3, -3.5);
    scene.add(rimLight);

    // Ground bounce light
    const bounceLight = new THREE.DirectionalLight(0xffffff, 0.5);
    bounceLight.position.set(0, -3, 2);
    scene.add(bounceLight);
  }

  function createProceduralChair(initialHexColor) {
    chairMaterial = new THREE.MeshPhysicalMaterial({
      color: new THREE.Color(initialHexColor),
      roughness: 0.82,
      metalness: 0.05,
      clearcoat: 0.04,
      clearcoatRoughness: 0.8
    });

    const archCurve = new THREE.CurvePath();
    const pLeftBase = new THREE.Vector3(-0.92, -0.9, 0);
    const pLeftTop = new THREE.Vector3(-0.92, 0.25, 0);
    const pRightTop = new THREE.Vector3(0.92, 0.25, 0);
    const pRightBase = new THREE.Vector3(0.92, -0.9, 0);

    const leftCurve = new THREE.CubicBezierCurve3(
      pLeftBase,
      new THREE.Vector3(-0.92, -0.3, 0),
      new THREE.Vector3(-0.92, 0.1, 0),
      pLeftTop
    );

    const topArch = new THREE.CubicBezierCurve3(
      pLeftTop,
      new THREE.Vector3(-0.85, 0.9, -0.15),
      new THREE.Vector3(0.85, 0.9, -0.15),
      pRightTop
    );

    const rightCurve = new THREE.CubicBezierCurve3(
      pRightTop,
      new THREE.Vector3(0.92, 0.1, 0),
      new THREE.Vector3(0.92, -0.3, 0),
      pRightBase
    );

    archCurve.add(leftCurve);
    archCurve.add(topArch);
    archCurve.add(rightCurve);

    const tubeGeom = new THREE.TubeGeometry(archCurve, 80, 0.38, 32, false);
    const archMesh = new THREE.Mesh(tubeGeom, chairMaterial);
    archMesh.castShadow = true;
    archMesh.receiveShadow = true;
    archMesh.scale.set(1.0, 1.0, 1.25);
    chairGroup.add(archMesh);

    const legGeom = new THREE.CylinderGeometry(0.39, 0.41, 1.0, 32);
    
    const leftLeg = new THREE.Mesh(legGeom, chairMaterial);
    leftLeg.position.set(-0.92, -0.45, 0.05);
    leftLeg.scale.set(1.0, 1.0, 1.35);
    leftLeg.castShadow = true;
    leftLeg.receiveShadow = true;
    chairGroup.add(leftLeg);

    const rightLeg = new THREE.Mesh(legGeom, chairMaterial);
    rightLeg.position.set(0.92, -0.45, 0.05);
    rightLeg.scale.set(1.0, 1.0, 1.35);
    rightLeg.castShadow = true;
    rightLeg.receiveShadow = true;
    chairGroup.add(rightLeg);

    const cushionGroup = new THREE.Group();
    const cushionGeom = new THREE.CylinderGeometry(0.78, 0.76, 0.52, 48);
    const cushionMesh = new THREE.Mesh(cushionGeom, chairMaterial);
    cushionMesh.position.set(0, -0.22, 0.05);
    cushionMesh.scale.set(1.15, 1.0, 1.15);
    cushionMesh.castShadow = true;
    cushionMesh.receiveShadow = true;
    cushionGroup.add(cushionMesh);

    const capGeom = new THREE.SphereGeometry(0.85, 32, 16, 0, Math.PI * 2, 0, Math.PI * 0.32);
    const capMesh = new THREE.Mesh(capGeom, chairMaterial);
    capMesh.position.set(0, -0.15, 0.05);
    capMesh.scale.set(1.05, 0.42, 1.05);
    capMesh.castShadow = true;
    cushionGroup.add(capMesh);

    chairGroup.add(cushionGroup);
    chairGroup.position.set(0, 0.05, 0);
  }

  function createContactShadow() {
    const canvas = document.createElement('canvas');
    canvas.width = 512;
    canvas.height = 512;
    const ctx = canvas.getContext('2d');

    const grad = ctx.createRadialGradient(256, 256, 40, 256, 256, 250);
    grad.addColorStop(0, 'rgba(0, 0, 0, 0.65)');
    grad.addColorStop(0.35, 'rgba(0, 0, 0, 0.4)');
    grad.addColorStop(0.7, 'rgba(0, 0, 0, 0.12)');
    grad.addColorStop(1, 'rgba(0, 0, 0, 0)');

    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, 512, 512);

    const shadowTexture = new THREE.CanvasTexture(canvas);
    const shadowGeo = new THREE.PlaneGeometry(3.6, 3.6);
    const shadowMat = new THREE.MeshBasicMaterial({
      map: shadowTexture,
      transparent: true,
      opacity: 0.85,
      depthWrite: false
    });

    shadowPlane = new THREE.Mesh(shadowGeo, shadowMat);
    shadowPlane.rotation.x = -Math.PI / 2;
    shadowPlane.position.y = -0.98;
    scene.add(shadowPlane);
  }

  function setupInteraction(container) {
    const dom = renderer.domElement;
    dom.style.cursor = 'grab';

    const onPointerDown = (e) => {
      isDragging = true;
      dom.style.cursor = 'grabbing';
      previousMousePosition = {
        x: e.clientX || (e.touches && e.touches[0].clientX) || 0,
        y: e.clientY || (e.touches && e.touches[0].clientY) || 0
      };
    };

    const onPointerMove = (e) => {
      if (!isDragging) return;
      const clientX = e.clientX || (e.touches && e.touches[0].clientX) || 0;
      const clientY = e.clientY || (e.touches && e.touches[0].clientY) || 0;

      const deltaX = clientX - previousMousePosition.x;
      const deltaY = clientY - previousMousePosition.y;

      targetRotationY += deltaX * 0.008;
      targetRotationX += deltaY * 0.004;
      targetRotationX = Math.max(-0.25, Math.min(0.4, targetRotationX));

      previousMousePosition = { x: clientX, y: clientY };
    };

    const onPointerUp = () => {
      isDragging = false;
      dom.style.cursor = 'grab';
    };

    dom.addEventListener('mousedown', onPointerDown);
    window.addEventListener('mousemove', onPointerMove);
    window.addEventListener('mouseup', onPointerUp);

    dom.addEventListener('touchstart', onPointerDown, { passive: true });
    window.addEventListener('touchmove', onPointerMove, { passive: true });
    window.addEventListener('touchend', onPointerUp);
  }

  function updateChairColor(hexColor) {
    if (!chairMaterial || !window.THREE) return;
    const col = new THREE.Color(hexColor);
    chairMaterial.color.set(col);
  }

  function resetChairRotation() {
    targetRotationX = 0;
    targetRotationY = 0;
  }

  function onResize() {
    if (!renderer || !camera) return;
    const parent = renderer.domElement.parentElement;
    if (!parent) return;
    const width = parent.clientWidth || 580;
    const height = parent.clientHeight || 550;
    camera.aspect = width / height;
    camera.updateProjectionMatrix();
    renderer.setSize(width, height);
  }

  function animate() {
    animationFrameId = requestAnimationFrame(animate);

    currentRotationY += (targetRotationY - currentRotationY) * 0.08;
    currentRotationX += (targetRotationX - currentRotationX) * 0.08;

    if (chairGroup) {
      chairGroup.rotation.y = currentRotationY;
      chairGroup.rotation.x = currentRotationX;
    }

    if (!isDragging) {
      const time = Date.now() * 0.001;
      if (chairGroup) {
        chairGroup.position.y = 0.05 + Math.sin(time * 1.5) * 0.02;
      }
    }

    if (renderer && scene && camera) {
      renderer.render(scene, camera);
    }
  }

  // Expose methods globally
  window.initThreeScene = initThreeScene;
  window.updateChairColor = updateChairColor;
  window.resetChairRotation = resetChairRotation;
})();

