"use client";
import React, { useEffect, useRef } from "react";
import * as THREE from "three";

export interface MemoryNodeData {
  id: string;
  label: string;
  subtitle: string;
  yearRange: string;
  description: string;
  citation: string;
  position: [number, number, number];
  color: string;
}

export const MEMORY_NODES: MemoryNodeData[] = [
  {
    id: "education",
    label: "EDUCATION",
    subtitle: "NICE Society & University Charters",
    yearRange: "1989 — Present",
    description: "Pioneered computer literacy in 1989, established SIET Meerut in 2000, and achieved Deemed-to-be-University status in 2006.",
    citation: "MHRD Gazette No. F.9-37/2004-U.3 • NICE Society Charter 1989",
    position: [3.4, 1.8, 0.5],
    color: "#E4C98A",
  },
  {
    id: "healthcare",
    label: "HEALTHCARE & AYURVEDA",
    subtitle: "Shobhit Ayurvedic Medical College & Hospital",
    yearRange: "2014 — Present",
    description: "Revitalized traditional Indian medicine with a modern 100-bed charitable hospital delivering affordable care to rural communities.",
    citation: "Ministry of AYUSH Records • NCISM Institutional Guidelines",
    position: [-3.5, 1.2, 0.8],
    color: "#C9A45C",
  },
  {
    id: "innovation",
    label: "INNOVATION & AI",
    subtitle: "Biotechnology & Computational Research",
    yearRange: "2020 — Present",
    description: "Inaugurated dedicated research clusters in Artificial Intelligence, Bioinformatics, and Precision Agri-Informatics.",
    citation: "Shobhit University Research Annual Council Proceedings",
    position: [2.6, -2.2, 1.2],
    color: "#F5F2EA",
  },
  {
    id: "leadership",
    label: "LEADERSHIP & DIPLOMACY",
    subtitle: "ASSOCHAM Council & Global Conclaves",
    yearRange: "2018 — Present",
    description: "Chairman of ASSOCHAM National Council on Education, advocating for progressive NEP policies and representing India at UN/UNESCO forums.",
    citation: "ASSOCHAM National Summit Archives • UNESCO Youth Conclave",
    position: [-2.8, -1.9, 0.6],
    color: "#E4C98A",
  },
  {
    id: "vision",
    label: "RURAL VISION & IMPACT",
    subtitle: "Gangoh Campus & Rural Upliftment",
    yearRange: "2012 — Present",
    description: "Established Shobhit University Gangoh under UP State Act to bring world-class higher education to rural first-generation learners.",
    citation: "UP State Act No. 3 of 2012 • UGC Section 2(f)",
    position: [0, 3.2, -0.5],
    color: "#C9A45C",
  },
];

interface LegacyUniverseCanvasProps {
  onNodeSelect?: (node: MemoryNodeData) => void;
  isTransformed?: boolean;
}

export const LegacyUniverseCanvas: React.FC<LegacyUniverseCanvasProps> = ({
  onNodeSelect,
  isTransformed = false,
}) => {
  const mountRef = useRef<HTMLDivElement>(null);
  const activeNodeRef = useRef<MemoryNodeData | null>(null);

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    // --- Scene, Camera, Renderer ---
    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x0b0b0a, 0.05);

    const camera = new THREE.PerspectiveCamera(
      50,
      container.clientWidth / container.clientHeight,
      0.1,
      1000
    );
    camera.position.z = 8.5;

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: "high-performance" });
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.1;
    container.appendChild(renderer.domElement);

    // --- A. Particle Sphere (3,000 living legacy particles) ---
    const particleCount = 2800;
    const geometry = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);
    const colors = new Float32Array(particleCount * 3);
    const originalPositions = new Float32Array(particleCount * 3);

    const goldColor = new THREE.Color("#C9A45C");
    const softGoldColor = new THREE.Color("#E4C98A");
    const starColor = new THREE.Color("#F5F2EA");

    for (let i = 0; i < particleCount; i++) {
      // Golden sphere volume with density variation
      const u = Math.random();
      const v = Math.random();
      const theta = u * 2.0 * Math.PI;
      const phi = Math.acos(2.0 * v - 1.0);
      const r = 2.8 + Math.random() * 3.4; // Shell around portrait center

      const x = r * Math.sin(phi) * Math.cos(theta);
      const y = r * Math.sin(phi) * Math.sin(theta);
      const z = r * Math.cos(phi) * 0.7; // Flattened slightly for depth

      positions[i * 3] = x;
      positions[i * 3 + 1] = y;
      positions[i * 3 + 2] = z;

      originalPositions[i * 3] = x;
      originalPositions[i * 3 + 1] = y;
      originalPositions[i * 3 + 2] = z;

      // Color variation: 60% gold, 25% soft gold, 15% starlight
      const rand = Math.random();
      const chosenColor = rand > 0.4 ? goldColor : rand > 0.15 ? softGoldColor : starColor;
      colors[i * 3] = chosenColor.r;
      colors[i * 3 + 1] = chosenColor.g;
      colors[i * 3 + 2] = chosenColor.b;
    }

    geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute("color", new THREE.BufferAttribute(colors, 3));

    // Particle Material with custom soft circular particle texture
    const canvas = document.createElement("canvas");
    canvas.width = 32;
    canvas.height = 32;
    const ctx = canvas.getContext("2d")!;
    const grad = ctx.createRadialGradient(16, 16, 0, 16, 16, 16);
    grad.addColorStop(0, "rgba(255,255,255,1)");
    grad.addColorStop(0.3, "rgba(228,201,138,0.8)");
    grad.addColorStop(0.8, "rgba(201,164,92,0.2)");
    grad.addColorStop(1, "rgba(0,0,0,0)");
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, 32, 32);
    const particleTexture = new THREE.CanvasTexture(canvas);

    const particleMaterial = new THREE.PointsMaterial({
      size: 0.08,
      map: particleTexture,
      transparent: true,
      vertexColors: true,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });

    const particleSystem = new THREE.Points(geometry, particleMaterial);
    scene.add(particleSystem);

    // --- B. Golden Orbital Rings & Travelling Pulses ---
    const orbitalGroup = new THREE.Group();
    scene.add(orbitalGroup);

    interface RingData {
      mesh: THREE.LineLoop;
      pulseMesh: THREE.Mesh;
      inclination: number;
      speed: number;
      radiusX: number;
      radiusY: number;
      pulseAngle: number;
    }

    const rings: RingData[] = [];
    const ringConfigs = [
      { rx: 4.8, ry: 4.2, rotX: 0.6, rotY: 0.3, speed: 0.003, color: "#C9A45C" },
      { rx: 5.6, ry: 3.9, rotX: -0.8, rotY: 0.5, speed: -0.0025, color: "#E4C98A" },
      { rx: 6.2, ry: 4.5, rotX: 1.1, rotY: -0.4, speed: 0.002, color: "#9B7A38" },
    ];

    const pulseGeo = new THREE.SphereGeometry(0.06, 16, 16);
    const pulseMat = new THREE.MeshBasicMaterial({ color: 0xffffff });

    ringConfigs.forEach((cfg) => {
      const curve = new THREE.EllipseCurve(0, 0, cfg.rx, cfg.ry, 0, 2 * Math.PI, false, 0);
      const points = curve.getPoints(120);
      const lineGeo = new THREE.BufferGeometry().setFromPoints(points);
      const lineMat = new THREE.LineBasicMaterial({
        color: new THREE.Color(cfg.color),
        transparent: true,
        opacity: 0.35,
        blending: THREE.AdditiveBlending,
      });

      const lineLoop = new THREE.LineLoop(lineGeo, lineMat);
      lineLoop.rotation.x = cfg.rotX;
      lineLoop.rotation.y = cfg.rotY;

      // Travelling energy pulse
      const pulse = new THREE.Mesh(pulseGeo, pulseMat);
      lineLoop.add(pulse);

      orbitalGroup.add(lineLoop);
      rings.push({
        mesh: lineLoop,
        pulseMesh: pulse,
        inclination: cfg.rotX,
        speed: cfg.speed,
        radiusX: cfg.rx,
        radiusY: cfg.ry,
        pulseAngle: Math.random() * Math.PI * 2,
      });
    });

    // --- C. Memory Nodes (3D Interactive Objects) ---
    const nodeGroup = new THREE.Group();
    scene.add(nodeGroup);

    const nodeMeshes: { mesh: THREE.Mesh; data: MemoryNodeData; ring: THREE.Mesh }[] = [];
    const nodeGeometry = new THREE.SphereGeometry(0.16, 24, 24);
    const outerRingGeo = new THREE.RingGeometry(0.24, 0.28, 32);

    MEMORY_NODES.forEach((node) => {
      const mat = new THREE.MeshBasicMaterial({
        color: new THREE.Color(node.color),
      });
      const nodeMesh = new THREE.Mesh(nodeGeometry, mat);
      nodeMesh.position.set(...node.position);

      // Subtle halo ring around each node
      const ringMat = new THREE.MeshBasicMaterial({
        color: new THREE.Color(node.color),
        side: THREE.DoubleSide,
        transparent: true,
        opacity: 0.6,
      });
      const ring = new THREE.Mesh(outerRingGeo, ringMat);
      nodeMesh.add(ring);

      nodeMesh.userData = { nodeData: node };
      nodeGroup.add(nodeMesh);
      nodeMeshes.push({ mesh: nodeMesh, data: node, ring });
    });

    // --- D. Interaction & Mouse Parallax with Smooth Lerp ---
    let mouseX = 0;
    let mouseY = 0;
    let targetCameraX = 0;
    let targetCameraY = 0;

    const handleMouseMove = (e: MouseEvent) => {
      const rect = container.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      const y = -(((e.clientY - rect.top) / rect.height) * 2 - 1);
      mouseX = x;
      mouseY = y;
      targetCameraX = x * 0.9;
      targetCameraY = y * 0.6;

      // Raycasting for interactive nodes
      raycaster.setFromCamera(new THREE.Vector2(x, y), camera);
      const intersects = raycaster.intersectObjects(nodeMeshes.map((n) => n.mesh));

      if (intersects.length > 0) {
        const hit = intersects[0].object as THREE.Mesh;
        const hitData = hit.userData.nodeData as MemoryNodeData;
        activeNodeRef.current = hitData;
        container.style.cursor = "pointer";
      } else {
        activeNodeRef.current = null;
        container.style.cursor = "default";
      }
    };

    const handleClick = () => {
      if (activeNodeRef.current && onNodeSelect) {
        onNodeSelect(activeNodeRef.current);
      }
    };

    const raycaster = new THREE.Raycaster();
    window.addEventListener("mousemove", handleMouseMove);
    container.addEventListener("click", handleClick);

    // --- E. Resize Handler ---
    const handleResize = () => {
      if (!container) return;
      camera.aspect = container.clientWidth / container.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(container.clientWidth, container.clientHeight);
    };
    window.addEventListener("resize", handleResize);

    // --- F. Animation Loop ---
    let animationFrameId: number;
    let clock = new THREE.Clock();

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      const elapsed = clock.getElapsedTime();

      // Smooth camera parallax
      camera.position.x += (targetCameraX - camera.position.x) * 0.05;
      camera.position.y += (targetCameraY - camera.position.y) * 0.05;
      camera.lookAt(0, 0, 0);

      // Rotate particle sphere
      particleSystem.rotation.y = elapsed * 0.03;
      particleSystem.rotation.x = Math.sin(elapsed * 0.02) * 0.08;

      // Gentle living particle pulse
      const posAttr = geometry.attributes.position as THREE.BufferAttribute;
      const posArr = posAttr.array as Float32Array;

      // Pulse wave propagation
      const pulseFactor = 1.0 + Math.sin(elapsed * 1.2) * 0.03;
      for (let i = 0; i < particleCount; i += 4) {
        posArr[i * 3] = originalPositions[i * 3] * pulseFactor;
        posArr[i * 3 + 1] = originalPositions[i * 3 + 1] * pulseFactor;
        posArr[i * 3 + 2] = originalPositions[i * 3 + 2] * pulseFactor;
      }
      posAttr.needsUpdate = true;

      // Orbit rings & travelling pulses
      rings.forEach((ring) => {
        ring.mesh.rotation.z += ring.speed;
        ring.pulseAngle += 0.02;
        const px = ring.radiusX * Math.cos(ring.pulseAngle);
        const py = ring.radiusY * Math.sin(ring.pulseAngle);
        ring.pulseMesh.position.set(px, py, 0);
      });

      // Animate Memory Nodes (gentle bobbing & pulsing rings)
      nodeMeshes.forEach(({ mesh, ring }) => {
        ring.rotation.z += 0.015;
        const isHovered = activeNodeRef.current?.id === mesh.userData.nodeData?.id;
        const targetScale = isHovered ? 1.6 : 1.0;
        mesh.scale.lerp(new THREE.Vector3(targetScale, targetScale, targetScale), 0.1);
      });

      renderer.render(scene, camera);
    };

    animate();

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("resize", handleResize);
      container.removeEventListener("click", handleClick);
      cancelAnimationFrame(animationFrameId);
      renderer.dispose();
      geometry.dispose();
      particleMaterial.dispose();
      particleTexture.dispose();
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
    };
  }, [onNodeSelect]);

  return (
    <div
      ref={mountRef}
      className={`absolute inset-0 w-full h-full pointer-events-auto transition-opacity duration-1000 ${
        isTransformed ? "opacity-30 scale-105" : "opacity-100"
      }`}
    />
  );
};
