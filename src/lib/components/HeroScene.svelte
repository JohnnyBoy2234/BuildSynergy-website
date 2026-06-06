<script lang="ts">
  import { onMount, onDestroy } from 'svelte';
  import * as THREE from 'three';

  let canvas: HTMLCanvasElement;
  let renderer: THREE.WebGLRenderer | null = null;
  let animId: number;
  let active = true;
  const clock = new THREE.Clock();

  // Mouse parallax state
  let mouseX = 0, mouseY = 0;
  let targetX = 0, targetY = 0;

  onMount(() => {
    if (typeof window === 'undefined') return;

    const isMobile = window.innerWidth < 768;
    const dpr = Math.min(window.devicePixelRatio, isMobile ? 1.5 : 2);

    // ── Scene ────────────────────────────────────────────────────────────
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, canvas.clientWidth / canvas.clientHeight, 0.1, 100);
    camera.position.set(0, 0, 6.5);

    renderer = new THREE.WebGLRenderer({ canvas, antialias: !isMobile, alpha: true });
    renderer.setPixelRatio(dpr);
    renderer.setSize(canvas.clientWidth, canvas.clientHeight, false);
    renderer.shadowMap.enabled = false;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.1;

    // ── Lights ───────────────────────────────────────────────────────────
    scene.add(new THREE.AmbientLight(0x101020, 6));

    const keyLight = new THREE.DirectionalLight(0xd0e8ff, 3.5);
    keyLight.position.set(-3, 4, 5);
    scene.add(keyLight);

    const rimLight = new THREE.DirectionalLight(0x8866ff, 1.2);
    rimLight.position.set(4, -1, -3);
    scene.add(rimLight);

    const cyanPoint = new THREE.PointLight(0x00d4ff, 8, 12);
    cyanPoint.position.set(2, 1.5, 3);
    scene.add(cyanPoint);

    const fillLight = new THREE.PointLight(0x334466, 3, 20);
    fillLight.position.set(-4, -2, 2);
    scene.add(fillLight);

    // ── Materials ────────────────────────────────────────────────────────
    const glassMat = new THREE.MeshPhysicalMaterial({
      color: 0x0d1a30,
      metalness: 0.05,
      roughness: 0.05,
      transmission: 0.8,
      opacity: 0.92,
      transparent: true,
      ior: 1.45,
      reflectivity: 0.6,
    });

    const graphiteMat = new THREE.MeshStandardMaterial({
      color: 0x131622,
      metalness: 0.25,
      roughness: 0.85,
    });

    const edgeMat = new THREE.MeshStandardMaterial({
      color: 0x2a3a5a,
      metalness: 0.9,
      roughness: 0.15,
      emissive: 0x0a1830,
      emissiveIntensity: 0.4,
    });

    const cyanDotMat = new THREE.MeshStandardMaterial({
      color: 0x00d4ff,
      emissive: 0x00d4ff,
      emissiveIntensity: 2.5,
      metalness: 0,
      roughness: 0.1,
    });

    const blueDotMat = new THREE.MeshStandardMaterial({
      color: 0x3366ff,
      emissive: 0x3366ff,
      emissiveIntensity: 1.8,
      metalness: 0,
      roughness: 0.1,
    });

    const lineMat = new THREE.LineBasicMaterial({
      color: 0x1a4080,
      transparent: true,
      opacity: 0.5,
    });

    const uiBarMat = new THREE.MeshStandardMaterial({
      color: 0x1e2a44,
      metalness: 0.2,
      roughness: 0.7,
      emissive: 0x0a1020,
      emissiveIntensity: 0.5,
    });

    // ── Build group ──────────────────────────────────────────────────────
    const group = new THREE.Group();
    scene.add(group);

    function box(w: number, h: number, d: number, mat: THREE.Material) {
      return new THREE.Mesh(new THREE.BoxGeometry(w, h, d), mat);
    }

    // Back large panel
    const back = box(2.9, 1.8, 0.018, glassMat);
    back.position.set(0, 0, -0.3);
    group.add(back);

    // Back panel edge frame (thin metallic strips)
    const edgeH = box(2.92, 0.022, 0.025, edgeMat);
    edgeH.position.set(0, 0.91, -0.28);
    group.add(edgeH);
    const edgeHb = edgeH.clone();
    edgeHb.position.set(0, -0.91, -0.28);
    group.add(edgeHb);
    const edgeV = box(0.022, 1.84, 0.025, edgeMat);
    edgeV.position.set(1.46, 0, -0.28);
    group.add(edgeV);
    const edgeVb = edgeV.clone();
    edgeVb.position.set(-1.46, 0, -0.28);
    group.add(edgeVb);

    // Nav bar strip at top of back panel
    const navBar = box(2.7, 0.13, 0.015, uiBarMat);
    navBar.position.set(0, 0.78, -0.27);
    group.add(navBar);

    // Nav dots in bar
    for (let i = 0; i < 3; i++) {
      const dot = new THREE.Mesh(new THREE.SphereGeometry(0.025, 8, 8), cyanDotMat.clone());
      dot.position.set(-1.2 + i * 0.095, 0.78, -0.24);
      group.add(dot);
    }

    // Mid panel (slightly forward and tilted)
    const mid = box(2.1, 1.2, 0.016, graphiteMat);
    mid.position.set(0.1, -0.05, 0.05);
    mid.rotation.y = -0.04;
    group.add(mid);

    // Mid panel edge
    const midEdgeTop = box(2.12, 0.018, 0.022, edgeMat);
    midEdgeTop.position.set(0.1, 0.61, 0.06);
    midEdgeTop.rotation.y = -0.04;
    group.add(midEdgeTop);

    // Content block on mid panel
    const contentBlock = box(1.25, 0.38, 0.014, uiBarMat);
    contentBlock.position.set(-0.28, 0.12, 0.08);
    group.add(contentBlock);

    // Content block accent line
    const accentLine = box(0.03, 0.38, 0.016, cyanDotMat.clone());
    accentLine.position.set(-0.92, 0.12, 0.09);
    (accentLine.material as THREE.MeshStandardMaterial).emissiveIntensity = 1.2;
    group.add(accentLine);

    // Side info block
    const sideBlock = box(0.72, 0.38, 0.014, uiBarMat);
    sideBlock.position.set(0.72, 0.12, 0.08);
    group.add(sideBlock);

    // Button shapes at bottom of mid panel
    const cta1 = box(0.52, 0.1, 0.013, edgeMat);
    cta1.position.set(-0.55, -0.4, 0.07);
    group.add(cta1);
    const cta2 = box(0.38, 0.1, 0.013, graphiteMat);
    cta2.position.set(0.12, -0.4, 0.07);
    group.add(cta2);

    // Floating card upper right, more forward
    const card1 = box(0.78, 0.52, 0.015, glassMat);
    card1.position.set(1.62, 0.72, 0.55);
    card1.rotation.y = -0.18;
    card1.rotation.x = 0.05;
    group.add(card1);

    const card1Edge = box(0.8, 0.02, 0.018, edgeMat);
    card1Edge.position.set(1.62, 0.98, 0.56);
    card1Edge.rotation.y = -0.18;
    group.add(card1Edge);

    // Floating card lower left
    const card2 = box(0.62, 0.42, 0.015, glassMat);
    card2.position.set(-1.72, -0.62, 0.48);
    card2.rotation.y = 0.22;
    card2.rotation.x = -0.04;
    group.add(card2);

    const card2Edge = box(0.64, 0.02, 0.018, edgeMat);
    card2Edge.position.set(-1.72, -0.41, 0.49);
    card2Edge.rotation.y = 0.22;
    group.add(card2Edge);

    // Emissive glow dots scattered around
    const dotPositions: [number, number, number][] = [
      [ 1.62, 0.72, 0.68],
      [-1.72, -0.62, 0.62],
      [ 0.85, -0.72, 0.35],
      [-0.9,  0.78, 0.25],
      [ 1.45, -0.28, 0.45],
    ];
    dotPositions.forEach(([x, y, z], i) => {
      const mat = i % 2 === 0 ? cyanDotMat : blueDotMat;
      const dot = new THREE.Mesh(new THREE.SphereGeometry(0.028, 8, 8), mat);
      dot.position.set(x, y, z);
      group.add(dot);
    });

    // Connection lines between dots
    const linePairs: [THREE.Vector3, THREE.Vector3][] = [
      [new THREE.Vector3( 1.62,  0.72, 0.68), new THREE.Vector3( 0.85, -0.72, 0.35)],
      [new THREE.Vector3(-1.72, -0.62, 0.62), new THREE.Vector3(-0.9,   0.78, 0.25)],
      [new THREE.Vector3( 1.45, -0.28, 0.45), new THREE.Vector3( 0.85, -0.72, 0.35)],
    ];
    linePairs.forEach(([a, b]) => {
      const geom = new THREE.BufferGeometry().setFromPoints([a, b]);
      group.add(new THREE.Line(geom, lineMat));
    });

    // ── Resize observer ──────────────────────────────────────────────────
    const ro = new ResizeObserver(() => {
      if (!renderer) return;
      const w = canvas.clientWidth, h = canvas.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h, false);
    });
    ro.observe(canvas);

    // ── IntersectionObserver pause when off screen ─────────────────────
    const io = new IntersectionObserver(
      ([entry]) => { active = entry.isIntersecting; },
      { threshold: 0.05 }
    );
    io.observe(canvas);

    // ── Mouse parallax ───────────────────────────────────────────────────
    const onMouseMove = (e: MouseEvent) => {
      mouseX = (e.clientX / window.innerWidth  - 0.5) * 2;
      mouseY = (e.clientY / window.innerHeight - 0.5) * 2;
    };
    window.addEventListener('mousemove', onMouseMove, { passive: true });

    // Entry animation state
    let entryT = 0;

    // ── Render loop ──────────────────────────────────────────────────────
    const tick = () => {
      animId = requestAnimationFrame(tick);
      if (!active) return;

      const elapsed = clock.getElapsedTime();

      // Entry animation (first 1.2s)
      if (entryT < 1) {
        entryT = Math.min(1, entryT + 0.016 / 1.2);
        const ease = 1 - Math.pow(1 - entryT, 3);
        group.scale.setScalar(0.96 + ease * 0.04);
        group.children.forEach((c) => {
          if ((c as THREE.Mesh).material) {
            ((c as THREE.Mesh).material as THREE.Material & { opacity?: number }).opacity = Math.min(
              ((c as THREE.Mesh).material as THREE.Material & { opacity?: number }).opacity ?? 1,
              ease
            );
          }
        });
      }

      // Slow float
      group.position.y = Math.sin(elapsed * 0.4) * 0.06;

      // Showroom rotation
      group.rotation.y = Math.sin(elapsed * 0.15) * 0.18;
      group.rotation.x = Math.sin(elapsed * 0.10) * 0.04;

      // Mouse parallax (smooth)
      targetX += (mouseX - targetX) * 0.04;
      targetY += (mouseY - targetY) * 0.04;
      group.rotation.y += targetX * 0.06;
      group.rotation.x += -targetY * 0.03;

      // Emissive pulse on cyan points
      const pulse = 0.5 + Math.sin(elapsed * 1.2) * 0.3;
      cyanPoint.intensity = 6 + pulse * 4;

      renderer!.render(scene, camera);
    };
    tick();

    // ── Cleanup ──────────────────────────────────────────────────────────
    return () => {
      cancelAnimationFrame(animId);
      ro.disconnect();
      io.disconnect();
      window.removeEventListener('mousemove', onMouseMove);
      renderer?.dispose();
      renderer = null;
      // Dispose geometries and materials
      group.traverse((obj) => {
        if ((obj as THREE.Mesh).geometry) (obj as THREE.Mesh).geometry.dispose();
        const mat = (obj as THREE.Mesh).material;
        if (mat) Array.isArray(mat) ? mat.forEach(m => m.dispose()) : mat.dispose();
      });
    };
  });
</script>

<canvas bind:this={canvas} class="hero-canvas" aria-hidden="true"></canvas>

<style>
  .hero-canvas {
    width: 100%;
    height: 100%;
    display: block;
    pointer-events: none;
  }
</style>
