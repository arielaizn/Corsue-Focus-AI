"use client";

import { useEffect, useRef, useState } from "react";

export interface NebulaBackgroundProps {
  /** 'hero' is denser/brighter; 'global' is a faint always-on backdrop */
  variant?: "global" | "hero";
}

/**
 * Fixed, behind-content deep-space backdrop. WebGL starfield + soft volumetric
 * blue→violet nebula glow + slow-drifting gold particles, subtle parallax.
 * Under prefers-reduced-motion (or WebGL failure) renders a STATIC CSS radial
 * nebula instead. Caps DPR, pauses when tab hidden, disposes on unmount.
 */
export function NebulaBackground({ variant = "global" }: NebulaBackgroundProps) {
  const mountRef = useRef<HTMLDivElement>(null);
  const [staticOnly, setStaticOnly] = useState(true);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const reduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    if (reduced) {
      setStaticOnly(true);
      return;
    }

    let disposed = false;
    let cleanup = () => {};

    (async () => {
      try {
        const THREE = await import("three");
        const mount = mountRef.current;
        if (!mount || disposed) return;

        const intensity = variant === "hero" ? 1 : 0.55;
        const width = mount.clientWidth || window.innerWidth;
        const height = mount.clientHeight || window.innerHeight;

        const renderer = new THREE.WebGLRenderer({
          antialias: true,
          alpha: true,
          powerPreference: "low-power",
        });
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
        renderer.setSize(width, height);
        renderer.setClearColor(0x000000, 0);
        mount.appendChild(renderer.domElement);

        const scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera(
          60,
          width / height,
          0.1,
          1000,
        );
        camera.position.z = 60;

        // --- starfield ---
        const starCount = variant === "hero" ? 1400 : 800;
        const starGeo = new THREE.BufferGeometry();
        const starPos = new Float32Array(starCount * 3);
        for (let i = 0; i < starCount; i++) {
          starPos[i * 3] = (Math.random() - 0.5) * 220;
          starPos[i * 3 + 1] = (Math.random() - 0.5) * 160;
          starPos[i * 3 + 2] = (Math.random() - 0.5) * 120;
        }
        starGeo.setAttribute(
          "position",
          new THREE.BufferAttribute(starPos, 3),
        );
        const starMat = new THREE.PointsMaterial({
          color: 0xcdd6f0,
          size: 0.7,
          sizeAttenuation: true,
          transparent: true,
          opacity: 0.85 * intensity,
          depthWrite: false,
        });
        const stars = new THREE.Points(starGeo, starMat);
        scene.add(stars);

        // --- drifting gold particles ---
        const goldCount = variant === "hero" ? 120 : 60;
        const goldGeo = new THREE.BufferGeometry();
        const goldPos = new Float32Array(goldCount * 3);
        for (let i = 0; i < goldCount; i++) {
          goldPos[i * 3] = (Math.random() - 0.5) * 160;
          goldPos[i * 3 + 1] = (Math.random() - 0.5) * 110;
          goldPos[i * 3 + 2] = (Math.random() - 0.5) * 60;
        }
        goldGeo.setAttribute(
          "position",
          new THREE.BufferAttribute(goldPos, 3),
        );
        const goldMat = new THREE.PointsMaterial({
          color: 0xf2d489,
          size: 1.5,
          sizeAttenuation: true,
          transparent: true,
          opacity: 0.72 * intensity,
          depthWrite: false,
          blending: THREE.AdditiveBlending,
        });
        const gold = new THREE.Points(goldGeo, goldMat);
        scene.add(gold);

        // --- soft volumetric nebula glows (sprite-like planes) ---
        const makeGlow = (
          color: number,
          x: number,
          y: number,
          scale: number,
          opacity: number,
        ) => {
          const canvas = document.createElement("canvas");
          canvas.width = canvas.height = 256;
          const ctx = canvas.getContext("2d")!;
          const c = new THREE.Color(color);
          const grad = ctx.createRadialGradient(128, 128, 0, 128, 128, 128);
          grad.addColorStop(
            0,
            `rgba(${c.r * 255},${c.g * 255},${c.b * 255},1)`,
          );
          grad.addColorStop(
            1,
            `rgba(${c.r * 255},${c.g * 255},${c.b * 255},0)`,
          );
          ctx.fillStyle = grad;
          ctx.fillRect(0, 0, 256, 256);
          const tex = new THREE.CanvasTexture(canvas);
          const mat = new THREE.SpriteMaterial({
            map: tex,
            transparent: true,
            opacity: opacity * intensity,
            blending: THREE.AdditiveBlending,
            depthWrite: false,
          });
          const sprite = new THREE.Sprite(mat);
          sprite.position.set(x, y, -20);
          sprite.scale.set(scale, scale, 1);
          scene.add(sprite);
          return { sprite, tex, mat };
        };

        // Aurora: blue → violet → magenta (the logo halo, from the brief)
        const glowA = makeGlow(0x3b6fe0, -30, 16, 130, 0.5); // blue
        const glowB = makeGlow(0x8b5cf6, 24, -6, 150, 0.45); // violet
        const glowC = makeGlow(0xc44cd9, 40, -22, 110, 0.34); // magenta (warm end)

        // parallax pointer
        let px = 0;
        let py = 0;
        const onPointer = (e: PointerEvent) => {
          px = (e.clientX / window.innerWidth - 0.5) * 2;
          py = (e.clientY / window.innerHeight - 0.5) * 2;
        };
        window.addEventListener("pointermove", onPointer);

        let visible = true;
        const onVisibility = () => {
          visible = !document.hidden;
        };
        document.addEventListener("visibilitychange", onVisibility);

        const onResize = () => {
          const w = mount.clientWidth || window.innerWidth;
          const h = mount.clientHeight || window.innerHeight;
          renderer.setSize(w, h);
          camera.aspect = w / h;
          camera.updateProjectionMatrix();
        };
        window.addEventListener("resize", onResize);

        let raf = 0;
        const clock = new THREE.Clock();
        const animate = () => {
          raf = requestAnimationFrame(animate);
          if (!visible) return;
          const t = clock.getElapsedTime();
          stars.rotation.y = t * 0.01;
          stars.rotation.x = Math.sin(t * 0.04) * 0.02;
          gold.rotation.y = -t * 0.02;
          gold.position.y = Math.sin(t * 0.15) * 2;
          // slow, calm breathing across the three aurora stops
          glowA.sprite.material.opacity =
            (0.42 + Math.sin(t * 0.32) * 0.08) * intensity;
          glowB.sprite.material.opacity =
            (0.4 + Math.cos(t * 0.28) * 0.08) * intensity;
          glowC.sprite.material.opacity =
            (0.3 + Math.sin(t * 0.22 + 1.2) * 0.07) * intensity;
          // gentle depth parallax — glows drift on their own slow phase
          glowA.sprite.position.x = -30 + Math.sin(t * 0.06) * 3;
          glowC.sprite.position.x = 40 + Math.cos(t * 0.05) * 3;
          camera.position.x += (px * 6 - camera.position.x) * 0.03;
          camera.position.y += (-py * 4 - camera.position.y) * 0.03;
          camera.lookAt(scene.position);
          renderer.render(scene, camera);
        };
        animate();
        setStaticOnly(false);

        cleanup = () => {
          cancelAnimationFrame(raf);
          window.removeEventListener("pointermove", onPointer);
          window.removeEventListener("resize", onResize);
          document.removeEventListener("visibilitychange", onVisibility);
          starGeo.dispose();
          starMat.dispose();
          goldGeo.dispose();
          goldMat.dispose();
          glowA.tex.dispose();
          glowA.mat.dispose();
          glowB.tex.dispose();
          glowB.mat.dispose();
          glowC.tex.dispose();
          glowC.mat.dispose();
          renderer.dispose();
          if (renderer.domElement.parentNode === mount)
            mount.removeChild(renderer.domElement);
        };
      } catch {
        setStaticOnly(true);
      }
    })();

    return () => {
      disposed = true;
      cleanup();
    };
  }, [variant]);

  return (
    <div
      aria-hidden
      className="pointer-events-none fixed inset-0 z-[-1] overflow-hidden bg-bg"
    >
      {/* Always-present static base so there's never a black flash */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(110% 80% at 50% -10%, oklch(0.26 0.1 290 / 0.5), transparent 55%), radial-gradient(80% 60% at 14% 12%, oklch(0.28 0.12 262 / 0.42), transparent 58%), radial-gradient(78% 60% at 86% 34%, oklch(0.3 0.13 330 / 0.34), transparent 60%), radial-gradient(60% 50% at 70% 92%, oklch(0.72 0.13 78 / 0.06), transparent 60%)",
          opacity: staticOnly ? 1 : 0.6,
          transition: "opacity 0.6s ease",
        }}
      />
      <div ref={mountRef} className="absolute inset-0" />
      {/* subtle vignette to seat content */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(120% 120% at 50% 30%, transparent 55%, oklch(0.11 0.035 268 / 0.6) 100%)",
        }}
      />
    </div>
  );
}

export default NebulaBackground;
