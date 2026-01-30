import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { useReducedMotion } from '../hooks/useReducedMotion';

const ThreeScene = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const prefersReducedMotion = useReducedMotion();

  useEffect(() => {
    if (!canvasRef.current) return;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({
      canvas: canvasRef.current,
      antialias: true,
      alpha: true,
      powerPreference: 'high-performance'
    });

    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setClearColor(0x000000, 0);

    // Créer un seul matériau pour toutes les lignes
    const material = new THREE.LineBasicMaterial({ 
      color: 0xffffff, 
      transparent: true, 
      opacity: 0.15,
      depthTest: false
    });

    const lines: THREE.LineSegments[] = [];
    const gridSize = 20;
    const spacing = 0.5;

    // Créer une géométrie pour toutes les lignes horizontales
    const horizontalPoints: THREE.Vector3[] = [];
    const verticalPoints: THREE.Vector3[] = [];

    for (let i = -gridSize; i <= gridSize; i++) {
      // Points pour les lignes horizontales
      horizontalPoints.push(
        new THREE.Vector3(-gridSize * spacing, i * spacing, 0),
        new THREE.Vector3(gridSize * spacing, i * spacing, 0)
      );

      // Points pour les lignes verticales
      verticalPoints.push(
        new THREE.Vector3(i * spacing, -gridSize * spacing, 0),
        new THREE.Vector3(i * spacing, gridSize * spacing, 0)
      );
    }

    const horizontalGeometry = new THREE.BufferGeometry().setFromPoints(horizontalPoints);
    const verticalGeometry = new THREE.BufferGeometry().setFromPoints(verticalPoints);

    const horizontalLines = new THREE.LineSegments(horizontalGeometry, material);
    const verticalLines = new THREE.LineSegments(verticalGeometry, material);

    scene.add(horizontalLines, verticalLines);
    lines.push(horizontalLines, verticalLines);

    camera.position.z = 15;

    let animationFrameId: number;

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      if (!prefersReducedMotion) {
        lines.forEach((line) => {
          line.rotation.z += 0.0005;
        });
      }
      renderer.render(scene, camera);
    };

    animate();

    const handleResize = () => {
      const width = window.innerWidth;
      const height = window.innerHeight;

      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);
      renderer.dispose();
      material.dispose();
      horizontalGeometry.dispose();
      verticalGeometry.dispose();
      scene.clear();
    };
  }, []);

  return <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" />;
};

export default ThreeScene;