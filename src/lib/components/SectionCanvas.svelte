<script lang="ts">
  import { onMount } from 'svelte';
  import * as THREE from 'three';

  interface Props {
    particleCount?: number;
    opacity?: number;
  }
  const { particleCount = 60, opacity = 0.55 }: Props = $props();

  let canvas: HTMLCanvasElement;
  let active = $state(true);

  onMount(() => {
    if (typeof window === 'undefined') return;
    const isMobile = window.innerWidth < 768;
    const count = isMobile ? Math.floor(particleCount * 0.5) : particleCount;

    const scene    = new THREE.Scene();
    const camera   = new THREE.PerspectiveCamera(60, canvas.clientWidth / canvas.clientHeight, 0.1, 100);
    camera.position.z = 28;

    const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: false });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
    renderer.setSize(canvas.clientWidth, canvas.clientHeight, false);

    // Palette from abstract 3D bg: indigo / cyan / violet / pink
    const palette = [
      new THREE.Color('#6366f1'),
      new THREE.Color('#22d3ee'),
      new THREE.Color('#a855f7'),
      new THREE.Color('#e879f9'),
    ];

    const positions  = new Float32Array(count * 3);
    const colors     = new Float32Array(count * 3);
    const velocities: { x: number; y: number }[] = [];

    for (let i = 0; i < count; i++) {
      positions[i * 3]     = (Math.random() - 0.5) * 55;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 35;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 15;
      const c = palette[Math.floor(Math.random() * palette.length)];
      colors[i * 3] = c.r; colors[i * 3 + 1] = c.g; colors[i * 3 + 2] = c.b;
      velocities.push({ x: (Math.random() - 0.5) * 0.008, y: (Math.random() - 0.5) * 0.006 });
    }

    const pointGeo = new THREE.BufferGeometry();
    pointGeo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    pointGeo.setAttribute('color',    new THREE.BufferAttribute(colors, 3));
    const pointMat = new THREE.PointsMaterial({ size: 0.22, vertexColors: true, transparent: true, opacity });
    scene.add(new THREE.Points(pointGeo, pointMat));

    // Connection lines
    const maxSegs = count * 4;
    const linePosArr = new Float32Array(maxSegs * 6);
    const lineGeo = new THREE.BufferGeometry();
    lineGeo.setAttribute('position', new THREE.BufferAttribute(linePosArr, 3));
    const lineMat = new THREE.LineBasicMaterial({ color: 0x6366f1, transparent: true, opacity: 0.1 });
    const lineSegs = new THREE.LineSegments(lineGeo, lineMat);
    scene.add(lineSegs);

    const io = new IntersectionObserver(([e]) => { active = e.isIntersecting; }, { threshold: 0.05 });
    io.observe(canvas);

    const ro = new ResizeObserver(() => {
      if (!canvas) return;
      camera.aspect = canvas.clientWidth / canvas.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(canvas.clientWidth, canvas.clientHeight, false);
    });
    ro.observe(canvas);

    let animId: number;
    const tick = () => {
      animId = requestAnimationFrame(tick);
      if (!active) return;

      const pos = pointGeo.attributes.position.array as Float32Array;
      for (let i = 0; i < count; i++) {
        pos[i * 3]     += velocities[i].x;
        pos[i * 3 + 1] += velocities[i].y;
        if (pos[i * 3] >  28) pos[i * 3] = -28;
        if (pos[i * 3] < -28) pos[i * 3] =  28;
        if (pos[i * 3 + 1] >  18) pos[i * 3 + 1] = -18;
        if (pos[i * 3 + 1] < -18) pos[i * 3 + 1] =  18;
      }
      pointGeo.attributes.position.needsUpdate = true;

      let li = 0;
      const maxDist = 13;
      for (let i = 0; i < count && li < maxSegs; i++) {
        for (let j = i + 1; j < count && li < maxSegs; j++) {
          const dx = pos[i*3]-pos[j*3], dy = pos[i*3+1]-pos[j*3+1], dz = pos[i*3+2]-pos[j*3+2];
          if (dx*dx + dy*dy + dz*dz < maxDist * maxDist) {
            linePosArr[li*6]=pos[i*3]; linePosArr[li*6+1]=pos[i*3+1]; linePosArr[li*6+2]=pos[i*3+2];
            linePosArr[li*6+3]=pos[j*3]; linePosArr[li*6+4]=pos[j*3+1]; linePosArr[li*6+5]=pos[j*3+2];
            li++;
          }
        }
      }
      for (let k = li * 6; k < maxSegs * 6; k++) linePosArr[k] = 0;
      lineGeo.attributes.position.needsUpdate = true;
      lineGeo.setDrawRange(0, li * 2);

      renderer.render(scene, camera);
    };
    tick();

    return () => {
      cancelAnimationFrame(animId);
      io.disconnect(); ro.disconnect();
      pointGeo.dispose(); pointMat.dispose();
      lineGeo.dispose();  lineMat.dispose();
      renderer.dispose();
    };
  });
</script>

<canvas bind:this={canvas} class="sc" aria-hidden="true"></canvas>

<style>
  .sc {
    position: absolute;
    inset: 0;
    width: 100%;
    height: 100%;
    pointer-events: none;
  }
</style>
