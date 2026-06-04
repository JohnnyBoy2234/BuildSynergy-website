import * as THREE from 'three';

// ─── Utilities ───────────────────────────────────────────────────────────────

const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
const clamp = (v: number, lo: number, hi: number) => Math.max(lo, Math.min(hi, v));
const invlerp = (a: number, b: number, v: number) => clamp((v - a) / (b - a), 0, 1);
const smoothstep = (a: number, b: number, v: number) => {
  const t = invlerp(a, b, v);
  return t * t * (3 - 2 * t);
};

// ─── Types ────────────────────────────────────────────────────────────────────

interface ModuleConfig {
  color: number;
  emissive: number;
  width: number;
  height: number;
  rows: number;
}

// ─── Main Class ───────────────────────────────────────────────────────────────

export class SynergyCore {
  private scene!: THREE.Scene;
  private camera!: THREE.PerspectiveCamera;
  private renderer!: THREE.WebGLRenderer;
  private clock = new THREE.Clock();
  private animId = 0;

  // Scene groups
  private root!: THREE.Group;
  private centralCore!: THREE.Group;
  private websiteModule!: THREE.Group;
  private leadModule!: THREE.Group;
  private crmModule!: THREE.Group;
  private automationModule!: THREE.Group;
  private communicationModule!: THREE.Group;
  private analyticsModule!: THREE.Group;
  private outerRings!: THREE.Group;
  private connectorsGroup!: THREE.Group;
  private particlePoints!: THREE.Points;

  // Key meshes for animation
  private coreOrb!: THREE.Mesh;
  private ring1!: THREE.Mesh;
  private ring2!: THREE.Mesh;
  private ring3!: THREE.Mesh;
  private commRing!: THREE.Mesh;
  private analyticsHalo!: THREE.Mesh;
  private coreLight!: THREE.PointLight;
  private connectorLines: THREE.Line[] = [];
  private automationNodes: THREE.Mesh[] = [];
  private particlePositions!: Float32Array;

  // Animation state
  private targetProgress = 0;
  private smoothedProgress = 0;
  private camTargetX = 3.5;
  private camTargetY = 0.5;
  private camTargetZ = 7.5;

  // ─── Public API ─────────────────────────────────────────────────────────────

  init(canvas: HTMLCanvasElement, w: number, h: number): void {
    this.setupRenderer(canvas, w, h);
    this.setupCamera(w, h);
    this.setupScene();
    this.startLoop();
  }

  setProgress(p: number): void {
    this.targetProgress = clamp(p, 0, 1);
  }

  resize(w: number, h: number): void {
    this.camera.aspect = w / h;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(w, h);
    this.renderer.setPixelRatio(Math.min(devicePixelRatio, 2));
  }

  dispose(): void {
    cancelAnimationFrame(this.animId);
    this.renderer.dispose();
  }

  // ─── Setup ──────────────────────────────────────────────────────────────────

  private setupRenderer(canvas: HTMLCanvasElement, w: number, h: number): void {
    this.renderer = new THREE.WebGLRenderer({
      canvas,
      antialias: true,
      alpha: true,
      powerPreference: 'high-performance',
    });
    this.renderer.setSize(w, h);
    this.renderer.setPixelRatio(Math.min(devicePixelRatio, 2));
    this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
    this.renderer.toneMappingExposure = 1.1;
    this.renderer.outputColorSpace = THREE.SRGBColorSpace;
  }

  private setupCamera(w: number, h: number): void {
    this.camera = new THREE.PerspectiveCamera(42, w / h, 0.1, 100);
    this.camera.position.set(3.5, 0.5, 7.5);
    this.camera.lookAt(0, 0, 0);
  }

  private setupScene(): void {
    this.scene = new THREE.Scene();
    this.setupLights();
    this.buildAll();
  }

  private setupLights(): void {
    // Soft ambient
    this.scene.add(new THREE.AmbientLight(0x0a0a1e, 5));

    // Key – upper right blue
    const key = new THREE.DirectionalLight(0x4477ff, 5);
    key.position.set(6, 8, 5);
    this.scene.add(key);

    // Fill – violet left
    const fill = new THREE.DirectionalLight(0x7733ff, 2.5);
    fill.position.set(-7, 2, 3);
    this.scene.add(fill);

    // Rim – cyan from below-back
    const rim = new THREE.DirectionalLight(0x00ccff, 1.5);
    rim.position.set(0, -4, -5);
    this.scene.add(rim);

    // Core point light (animated in loop)
    this.coreLight = new THREE.PointLight(0x2255ff, 4, 9);
    this.scene.add(this.coreLight);
  }

  private buildAll(): void {
    this.root = new THREE.Group();
    this.scene.add(this.root);

    this.buildCentralCore();
    this.buildModules();
    this.buildOuterRings();
    this.buildConnectors();
    this.buildParticles();
  }

  // ─── Central Core ───────────────────────────────────────────────────────────

  private buildCentralCore(): void {
    this.centralCore = new THREE.Group();
    this.root.add(this.centralCore);

    // Inner glow sphere
    const inner = new THREE.Mesh(
      new THREE.SphereGeometry(0.28, 20, 20),
      new THREE.MeshStandardMaterial({
        color: 0x002266,
        emissive: 0x0044ff,
        emissiveIntensity: 3,
      }),
    );
    this.centralCore.add(inner);

    // Main faceted orb
    this.coreOrb = new THREE.Mesh(
      new THREE.IcosahedronGeometry(0.68, 3),
      new THREE.MeshPhysicalMaterial({
        color: 0x08122a,
        emissive: 0x0033cc,
        emissiveIntensity: 0.7,
        metalness: 0.75,
        roughness: 0.15,
        clearcoat: 1.0,
        clearcoatRoughness: 0.05,
      }),
    );
    this.centralCore.add(this.coreOrb);

    // Equatorial band
    this.centralCore.add(
      new THREE.Mesh(
        new THREE.TorusGeometry(0.92, 0.048, 10, 80),
        new THREE.MeshPhysicalMaterial({
          color: 0x112244,
          metalness: 0.95,
          roughness: 0.05,
          emissive: 0x0033bb,
          emissiveIntensity: 0.6,
        }),
      ),
    );

    // Orbit rings
    const makeRing = (emissive: number): THREE.Mesh =>
      new THREE.Mesh(
        new THREE.TorusGeometry(1.05, 0.011, 8, 100),
        new THREE.MeshStandardMaterial({
          color: 0x223366,
          emissive: new THREE.Color(emissive),
          emissiveIntensity: 1.8,
          metalness: 0.95,
          roughness: 0.05,
        }),
      );

    this.ring1 = makeRing(0x2255ff);
    this.centralCore.add(this.ring1);

    this.ring2 = makeRing(0x6633ff);
    this.ring2.rotation.x = Math.PI / 2;
    this.centralCore.add(this.ring2);

    this.ring3 = makeRing(0x00bbff);
    this.ring3.rotation.z = Math.PI / 3;
    this.centralCore.add(this.ring3);
  }

  // ─── Module Panel Builder ───────────────────────────────────────────────────

  private makePanel(cfg: ModuleConfig): THREE.Group {
    const g = new THREE.Group();
    const { color, emissive, width: w, height: h } = cfg;

    // Glass background plate
    const plate = new THREE.Mesh(
      new THREE.BoxGeometry(w, h, 0.032),
      new THREE.MeshStandardMaterial({
        color: new THREE.Color(color),
        metalness: 0.1,
        roughness: 0.55,
        transparent: true,
        opacity: 0.88,
      }),
    );
    g.add(plate);

    // Edge glow (LineSegments)
    const edges = new THREE.LineSegments(
      new THREE.EdgesGeometry(new THREE.BoxGeometry(w, h, 0.032)),
      new THREE.LineBasicMaterial({
        color: new THREE.Color(emissive),
        transparent: true,
        opacity: 0.9,
      }),
    );
    g.add(edges);

    // Header stripe
    const header = new THREE.Mesh(
      new THREE.BoxGeometry(w * 0.96, h * 0.09, 0.042),
      new THREE.MeshStandardMaterial({
        color: new THREE.Color(emissive),
        emissive: new THREE.Color(emissive),
        emissiveIntensity: 0.7,
      }),
    );
    header.position.set(0, h * 0.42, 0.006);
    g.add(header);

    // Abstract content rows
    const rowMat = new THREE.MeshStandardMaterial({
      color: new THREE.Color(emissive),
      emissive: new THREE.Color(emissive),
      emissiveIntensity: 0.35,
      transparent: true,
      opacity: 0.65,
    });
    const widths = [0.72, 0.55, 0.65];
    for (let i = 0; i < cfg.rows; i++) {
      const rw = w * (widths[i % widths.length] ?? 0.6);
      const row = new THREE.Mesh(new THREE.BoxGeometry(rw, 0.028, 0.038), rowMat.clone());
      row.position.set((rw - w) * 0.1, h * 0.2 - i * h * 0.175, 0.006);
      g.add(row);
    }

    // Accent square (icon placeholder)
    const accent = new THREE.Mesh(
      new THREE.BoxGeometry(0.13, 0.13, 0.044),
      new THREE.MeshStandardMaterial({
        color: new THREE.Color(emissive),
        emissive: new THREE.Color(emissive),
        emissiveIntensity: 1.2,
      }),
    );
    accent.position.set(-w * 0.38, h * 0.42, 0.01);
    g.add(accent);

    return g;
  }

  // ─── All Modules ────────────────────────────────────────────────────────────

  private buildModules(): void {
    // Website
    this.websiteModule = this.makePanel({ color: 0x08122a, emissive: 0x3377ff, width: 1.45, height: 1.0, rows: 3 });
    this.websiteModule.scale.setScalar(0.05);
    this.root.add(this.websiteModule);

    // Lead
    this.leadModule = this.makePanel({ color: 0x081a10, emissive: 0x22cc66, width: 1.25, height: 0.92, rows: 3 });
    this.leadModule.scale.setScalar(0.05);
    this.root.add(this.leadModule);

    // CRM
    this.crmModule = this.makePanel({ color: 0x100a22, emissive: 0xaa44ff, width: 1.35, height: 1.05, rows: 3 });
    this.crmModule.scale.setScalar(0.05);
    this.root.add(this.crmModule);

    // Automation nodes
    this.automationModule = new THREE.Group();
    this.automationModule.scale.setScalar(0.05);
    this.root.add(this.automationModule);
    this.buildAutomationNodes();

    // Communication ring
    this.communicationModule = new THREE.Group();
    this.communicationModule.scale.setScalar(0.01);
    this.root.add(this.communicationModule);
    this.buildCommRing();

    // Analytics halo
    this.analyticsModule = new THREE.Group();
    this.analyticsModule.scale.setScalar(0.01);
    this.root.add(this.analyticsModule);
    this.buildAnalyticsHalo();
  }

  private buildAutomationNodes(): void {
    const positions: [number, number, number][] = [
      [-0.9, 0.65, 0.3], [0.9, 0.65, 0.3], [0, 1.3, 0.1],
      [-1.25, -0.1, 0.2], [1.25, -0.1, 0.2], [0, -1.05, 0.3],
    ];
    const nodeMat = new THREE.MeshStandardMaterial({
      color: 0x180a2a,
      emissive: 0xaa22ff,
      emissiveIntensity: 1.8,
      metalness: 0.7,
      roughness: 0.2,
    });
    positions.forEach(([x, y, z]) => {
      const node = new THREE.Mesh(new THREE.SphereGeometry(0.11, 14, 14), nodeMat.clone());
      node.position.set(x, y, z);
      this.automationNodes.push(node);
      this.automationModule.add(node);
    });
    // Connector lines between nodes
    const lineMat = new THREE.LineBasicMaterial({ color: 0xaa44ff, transparent: true, opacity: 0.35 });
    const pairs: [number, number][] = [[0,1],[0,2],[1,2],[0,3],[1,4],[3,5],[4,5],[2,4],[3,2]];
    pairs.forEach(([a, b]) => {
      const geo = new THREE.BufferGeometry().setFromPoints([
        new THREE.Vector3(...positions[a]),
        new THREE.Vector3(...positions[b]),
      ]);
      this.automationModule.add(new THREE.Line(geo, lineMat.clone()));
    });
  }

  private buildCommRing(): void {
    this.commRing = new THREE.Mesh(
      new THREE.TorusGeometry(2.75, 0.018, 8, 120),
      new THREE.MeshStandardMaterial({
        color: 0x113355,
        emissive: 0x00aaff,
        emissiveIntensity: 1.2,
        metalness: 0.85,
        roughness: 0.08,
      }),
    );
    this.communicationModule.add(this.commRing);

    // Message dots along the ring (local XY space, parent is rotated)
    const dotMat = new THREE.MeshStandardMaterial({
      color: 0x00ccff,
      emissive: 0x00aaff,
      emissiveIntensity: 2.5,
    });
    for (let i = 0; i < 9; i++) {
      const a = (i / 9) * Math.PI * 2;
      const dot = new THREE.Mesh(new THREE.SphereGeometry(0.055, 8, 8), dotMat.clone());
      dot.position.set(Math.cos(a) * 2.75, Math.sin(a) * 2.75, 0);
      this.communicationModule.add(dot);
    }
    // Tilt the entire module
    this.communicationModule.rotation.x = Math.PI * 0.18;
  }

  private buildAnalyticsHalo(): void {
    this.analyticsHalo = new THREE.Mesh(
      new THREE.TorusGeometry(3.4, 0.009, 5, 130),
      new THREE.MeshStandardMaterial({
        color: 0x1a1400,
        emissive: 0xffaa22,
        emissiveIntensity: 1.0,
        metalness: 0.95,
        roughness: 0.05,
      }),
    );
    this.analyticsModule.add(this.analyticsHalo);

    // Bar chart elements along ring
    const barMat = new THREE.MeshStandardMaterial({
      color: 0xffcc44,
      emissive: 0xffaa22,
      emissiveIntensity: 0.6,
      transparent: true,
      opacity: 0.85,
    });
    for (let i = 0; i < 14; i++) {
      const a = (i / 14) * Math.PI * 2;
      const bh = 0.07 + (i % 3) * 0.06;
      const bar = new THREE.Mesh(new THREE.BoxGeometry(0.06, bh, 0.02), barMat.clone());
      bar.position.set(Math.cos(a) * 3.4, Math.sin(a) * 3.4, 0);
      bar.rotation.z = a;
      this.analyticsModule.add(bar);
    }
    this.analyticsModule.rotation.x = Math.PI * 0.08;
  }

  // ─── Outer Decorative Rings ─────────────────────────────────────────────────

  private buildOuterRings(): void {
    this.outerRings = new THREE.Group();
    this.root.add(this.outerRings);

    const cfgs = [
      { r: 1.55, t: 0.007, em: 0x2244ff, rx: 0.28, rz: 0.0 },
      { r: 1.9,  t: 0.006, em: 0x5522ff, rx: -0.5, rz: 0.85 },
      { r: 2.25, t: 0.005, em: 0x0033bb, rx: 0.85, rz: 0.3 },
    ];
    cfgs.forEach(({ r, t, em, rx, rz }) => {
      const mesh = new THREE.Mesh(
        new THREE.TorusGeometry(r, t, 6, 100),
        new THREE.MeshStandardMaterial({
          color: 0x111130,
          emissive: new THREE.Color(em),
          emissiveIntensity: 1.0,
          metalness: 0.95,
          roughness: 0.05,
        }),
      );
      mesh.rotation.x = rx;
      mesh.rotation.z = rz;
      this.outerRings.add(mesh);
    });
  }

  // ─── Connector Lines ────────────────────────────────────────────────────────

  private buildConnectors(): void {
    this.connectorsGroup = new THREE.Group();
    this.root.add(this.connectorsGroup);

    // Pre-build 4 connector lines, positions updated in animate loop
    for (let i = 0; i < 4; i++) {
      const geo = new THREE.BufferGeometry();
      geo.setAttribute('position', new THREE.BufferAttribute(new Float32Array([0,0,0, 1,0,0]), 3));
      const line = new THREE.Line(
        geo,
        new THREE.LineBasicMaterial({ color: 0x3366ff, transparent: true, opacity: 0 }),
      );
      this.connectorLines.push(line);
      this.connectorsGroup.add(line);
    }
  }

  // ─── Particles ──────────────────────────────────────────────────────────────

  private buildParticles(): void {
    const count = 320;
    this.particlePositions = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      const r = 1.6 + Math.random() * 3.2;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      this.particlePositions[i * 3] = r * Math.sin(phi) * Math.cos(theta);
      this.particlePositions[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
      this.particlePositions[i * 3 + 2] = r * Math.cos(phi);
    }
    const geo = new THREE.BufferGeometry();
    geo.setAttribute('position', new THREE.BufferAttribute(this.particlePositions, 3));
    this.particlePoints = new THREE.Points(
      geo,
      new THREE.PointsMaterial({ color: 0x4466cc, size: 0.022, sizeAttenuation: true, transparent: true, opacity: 0.55 }),
    );
    this.scene.add(this.particlePoints);
  }

  // ─── Animation Loop ─────────────────────────────────────────────────────────

  private startLoop(): void {
    const loop = () => {
      this.animId = requestAnimationFrame(loop);
      this.update();
    };
    loop();
  }

  private update(): void {
    const t = this.clock.getElapsedTime();
    const dt = this.clock.getDelta();

    // Smooth scroll progress
    this.smoothedProgress += (this.targetProgress - this.smoothedProgress) * 0.055;
    const sp = this.smoothedProgress;

    // Always-on idle animations
    this.centralCore.rotation.y += 0.0025;
    this.ring1.rotation.z += 0.005;
    this.ring2.rotation.y += 0.004;
    this.ring3.rotation.x += 0.006;

    // Core pulse
    const pulse = Math.sin(t * 1.4) * 0.15 + 0.85;
    (this.coreOrb.material as THREE.MeshPhysicalMaterial).emissiveIntensity = pulse * 0.7;
    this.coreLight.intensity = pulse * 4;

    // Float
    this.root.position.y = Math.sin(t * 0.45) * 0.06;
    this.root.rotation.y = Math.sin(t * 0.2) * 0.04;

    // Scroll-driven state
    this.animateByProgress(sp, t);
    this.updateConnectors(sp);
    this.updateParticles(sp, t);
    this.updateCamera(sp, t);

    this.renderer.render(this.scene, this.camera);
  }

  // ─── Scroll-Driven Animation ─────────────────────────────────────────────────

  private animateByProgress(sp: number, t: number): void {
    // Thresholds
    const TH = {
      web:   [0.22, 0.35] as [number, number],
      lead:  [0.35, 0.48] as [number, number],
      crm:   [0.48, 0.60] as [number, number],
      auto:  [0.58, 0.70] as [number, number],
      comm:  [0.68, 0.78] as [number, number],
      anal:  [0.77, 0.87] as [number, number],
      full:  [0.87, 1.00] as [number, number],
    };

    const pct = (a: number, b: number) => smoothstep(a, b, sp);

    // ── Website module ──────────────────────────────────────────────────────
    const wP = pct(...TH.web);
    const wStay = sp > TH.web[1] ? 1 : wP;
    this.websiteModule.position.set(lerp(0.4, 2.35, wStay), lerp(0, 0.25, wStay), lerp(0, 0.5, wStay));
    this.websiteModule.scale.setScalar(lerp(0.05, 1, wStay));
    this.setGroupEmissive(this.websiteModule, lerp(0.05, 1.0, wStay));

    // ── Lead module ─────────────────────────────────────────────────────────
    const lP = pct(...TH.lead);
    const lStay = sp > TH.lead[1] ? 1 : lP;
    this.leadModule.position.set(lerp(0.3, 1.55, lStay), lerp(0, -1.8, lStay), lerp(0, 0.35, lStay));
    this.leadModule.scale.setScalar(lerp(0.05, 1, lStay));
    this.setGroupEmissive(this.leadModule, lerp(0.05, 1.0, lStay));

    // ── CRM module ──────────────────────────────────────────────────────────
    const cP = pct(...TH.crm);
    const cStay = sp > TH.crm[1] ? 1 : cP;
    this.crmModule.position.set(lerp(-0.4, -2.35, cStay), lerp(0, 0.2, cStay), lerp(0, 0.35, cStay));
    this.crmModule.scale.setScalar(lerp(0.05, 1, cStay));
    this.setGroupEmissive(this.crmModule, lerp(0.05, 1.0, cStay));

    // ── Automation module ───────────────────────────────────────────────────
    const aP = pct(...TH.auto);
    const aStay = sp > TH.auto[1] ? 1 : aP;
    this.automationModule.scale.setScalar(lerp(0.05, 1, aStay));
    this.automationModule.position.set(0, lerp(-2.5, 0, aStay), 0);
    this.automationNodes.forEach((node, i) => {
      (node.material as THREE.MeshStandardMaterial).emissiveIntensity =
        lerp(0.2, 2.2, aStay) * (0.6 + 0.4 * Math.sin(t * 2.5 + i * 1.1));
    });

    // ── Communication ring ──────────────────────────────────────────────────
    const coP = pct(...TH.comm);
    const coStay = sp > TH.comm[1] ? 1 : coP;
    this.communicationModule.scale.setScalar(lerp(0.01, 1, coStay));
    this.commRing.rotation.z += 0.0018;

    // ── Analytics halo ──────────────────────────────────────────────────────
    const anP = pct(...TH.anal);
    const anStay = sp > TH.anal[1] ? 1 : anP;
    this.analyticsModule.scale.setScalar(lerp(0.01, 1, anStay));
    this.analyticsHalo.rotation.z += 0.001;

    // ── Full ecosystem brightness ────────────────────────────────────────────
    const fP = pct(...TH.full);
    const baseEmissive = lerp(0.7, 2.2, fP);
    (this.coreOrb.material as THREE.MeshPhysicalMaterial).emissive.setHex(
      fP > 0.5 ? 0x0044ff : 0x0033cc,
    );

    // Outer rings animated intensity
    this.outerRings.children.forEach((child, i) => {
      if (child instanceof THREE.Mesh) {
        (child.material as THREE.MeshStandardMaterial).emissiveIntensity =
          lerp(0.4, 1.8, sp) * (0.85 + 0.15 * Math.sin(t + i * 1.3));
      }
    });
  }

  private updateConnectors(sp: number): void {
    type ConnConfig = { from: THREE.Vector3; to: THREE.Vector3; show: number; color: number };
    const configs: ConnConfig[] = [
      { from: this.websiteModule.position, to: this.centralCore.position, show: 0.25, color: 0x3366ff },
      { from: this.websiteModule.position, to: this.leadModule.position,  show: 0.38, color: 0x22aa55 },
      { from: this.leadModule.position,    to: this.crmModule.position,   show: 0.52, color: 0x8844ff },
      { from: this.crmModule.position,     to: this.centralCore.position, show: 0.62, color: 0x6633ff },
    ];

    configs.forEach((cfg, i) => {
      if (i >= this.connectorLines.length) return;
      const line = this.connectorLines[i];
      const opacity = clamp((sp - cfg.show) / 0.08, 0, 1) * 0.55;
      (line.material as THREE.LineBasicMaterial).opacity = opacity;

      if (opacity > 0.01) {
        const buf = line.geometry.attributes.position as THREE.BufferAttribute;
        buf.array[0] = cfg.from.x; buf.array[1] = cfg.from.y; buf.array[2] = cfg.from.z;
        buf.array[3] = cfg.to.x;   buf.array[4] = cfg.to.y;   buf.array[5] = cfg.to.z;
        buf.needsUpdate = true;
        line.geometry.computeBoundingSphere();
      }
    });
  }

  private updateParticles(sp: number, t: number): void {
    const pos = this.particlePositions;
    const count = pos.length / 3;
    const spd = 0.002 + sp * 0.004;

    for (let i = 0; i < count; i++) {
      const ti = t * 0.15 + i * 0.08;
      pos[i * 3]     += Math.sin(ti * 1.1 + i) * spd;
      pos[i * 3 + 1] += Math.cos(ti * 0.9 + i * 0.5) * spd * 0.7;
      pos[i * 3 + 2] += Math.sin(ti * 1.3 + i * 0.3) * spd * 0.5;

      // Wrap
      const x = pos[i * 3], y = pos[i * 3 + 1], z = pos[i * 3 + 2];
      const d = Math.sqrt(x * x + y * y + z * z);
      if (d > 5.5 || d < 1.3) {
        const r = 1.8 + Math.random() * 2.8;
        const theta = Math.random() * Math.PI * 2;
        const phi = Math.acos(2 * Math.random() - 1);
        pos[i * 3]     = r * Math.sin(phi) * Math.cos(theta);
        pos[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
        pos[i * 3 + 2] = r * Math.cos(phi);
      }
    }

    (this.particlePoints.geometry.attributes.position as THREE.BufferAttribute).needsUpdate = true;
    (this.particlePoints.material as THREE.PointsMaterial).opacity = 0.25 + sp * 0.5;
  }

  private updateCamera(sp: number, t: number): void {
    // Camera waypoints indexed by scroll
    const pts: [number, number, number][] = [
      [3.5, 0.5, 7.5],   // hero
      [3.2, 0.3, 7.8],   // reality
      [2.2, 0.2, 7.2],   // website
      [1.2, -0.3, 7.2],  // lead
      [-1.0, 0.2, 7.4],  // crm
      [0.2, 0.4, 8.0],   // auto
      [0.0, 0.3, 8.8],   // comm
      [0.0, 0.5, 9.2],   // analytics
      [0.0, 0.5, 9.8],   // full
    ];

    const idx = clamp(Math.floor(sp * 8), 0, 7);
    const frac = smoothstep(0, 1, (sp * 8) - idx);
    const a = pts[idx], b = pts[Math.min(idx + 1, pts.length - 1)];

    const tx = lerp(a[0], b[0], frac) + Math.sin(t * 0.12) * 0.08;
    const ty = lerp(a[1], b[1], frac);
    const tz = lerp(a[2], b[2], frac);

    this.camera.position.x += (tx - this.camera.position.x) * 0.032;
    this.camera.position.y += (ty - this.camera.position.y) * 0.032;
    this.camera.position.z += (tz - this.camera.position.z) * 0.032;
    this.camera.lookAt(0, 0, 0);
  }

  // ─── Helpers ─────────────────────────────────────────────────────────────────

  private setGroupEmissive(group: THREE.Group, intensity: number): void {
    group.traverse(child => {
      if (child instanceof THREE.Mesh) {
        const mat = child.material as THREE.MeshStandardMaterial;
        if (mat.emissive && mat.emissiveIntensity !== undefined) {
          mat.emissiveIntensity = intensity;
        }
      }
    });
  }
}
