'use client';

import { useRef, useEffect, useCallback } from 'react';

type OrbState = 'idle' | 'listening' | 'processing' | 'speaking';

interface LiveOrbProps {
    state: OrbState;
    size?: number;
}

// Simple noise function for organic blob deformation
function noise2D(x: number, y: number): number {
    const n = Math.sin(x * 12.9898 + y * 78.233) * 43758.5453;
    return (n - Math.floor(n)) * 2 - 1;
}

function smoothNoise(x: number, y: number, t: number): number {
    return (
        Math.sin(x * 1.2 + t * 0.7) * 0.3 +
        Math.sin(y * 0.8 + t * 1.1) * 0.25 +
        Math.sin((x + y) * 0.6 + t * 0.9) * 0.2 +
        Math.sin(x * 2.1 - t * 0.5) * 0.15 +
        noise2D(x + t * 0.1, y + t * 0.2) * 0.1
    );
}

const STATE_CONFIG: Record<OrbState, {
    colors: [string, string, string];
    glowColor: string;
    pulseSpeed: number;
    noiseIntensity: number;
    particleColor: string;
}> = {
    idle: {
        colors: ['#475569', '#334155', '#1e293b'],
        glowColor: 'rgba(100, 116, 139, 0.15)',
        pulseSpeed: 0.3,
        noiseIntensity: 0.06,
        particleColor: 'rgba(148, 163, 184, 0.4)',
    },
    listening: {
        colors: ['#a78bfa', '#8b5cf6', '#7c3aed'],
        glowColor: 'rgba(139, 92, 246, 0.25)',
        pulseSpeed: 0.8,
        noiseIntensity: 0.15,
        particleColor: 'rgba(167, 139, 250, 0.6)',
    },
    processing: {
        colors: ['#60a5fa', '#3b82f6', '#2563eb'],
        glowColor: 'rgba(59, 130, 246, 0.25)',
        pulseSpeed: 1.2,
        noiseIntensity: 0.1,
        particleColor: 'rgba(96, 165, 250, 0.6)',
    },
    speaking: {
        colors: ['#34d399', '#10b981', '#059669'],
        glowColor: 'rgba(16, 185, 129, 0.25)',
        pulseSpeed: 0.6,
        noiseIntensity: 0.12,
        particleColor: 'rgba(52, 211, 153, 0.6)',
    },
};

export default function LiveOrb({ state, size = 280 }: LiveOrbProps) {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const animRef = useRef<number>(0);
    const timeRef = useRef(0);
    const currentColorsRef = useRef({ r1: 71, g1: 85, b1: 105, r2: 51, g2: 65, b2: 85, r3: 30, g3: 41, b3: 59 });
    const currentGlowRef = useRef(0.15);
    const currentNoiseRef = useRef(0.06);

    // Parse hex color
    const hexToRgb = useCallback((hex: string) => {
        const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
        return result ? {
            r: parseInt(result[1], 16),
            g: parseInt(result[2], 16),
            b: parseInt(result[3], 16),
        } : { r: 0, g: 0, b: 0 };
    }, []);

    // Lerp
    const lerp = useCallback((a: number, b: number, t: number) => a + (b - a) * t, []);

    const draw = useCallback((ctx: CanvasRenderingContext2D, width: number, height: number) => {
        const config = STATE_CONFIG[state];
        const dt = 0.016;
        timeRef.current += dt;
        const t = timeRef.current;

        // Smoothly interpolate colors
        const c1 = hexToRgb(config.colors[0]);
        const c2 = hexToRgb(config.colors[1]);
        const c3 = hexToRgb(config.colors[2]);
        const lerpSpeed = 0.04;
        const cc = currentColorsRef.current;
        cc.r1 = lerp(cc.r1, c1.r, lerpSpeed); cc.g1 = lerp(cc.g1, c1.g, lerpSpeed); cc.b1 = lerp(cc.b1, c1.b, lerpSpeed);
        cc.r2 = lerp(cc.r2, c2.r, lerpSpeed); cc.g2 = lerp(cc.g2, c2.g, lerpSpeed); cc.b2 = lerp(cc.b2, c2.b, lerpSpeed);
        cc.r3 = lerp(cc.r3, c3.r, lerpSpeed); cc.g3 = lerp(cc.g3, c3.g, lerpSpeed); cc.b3 = lerp(cc.b3, c3.b, lerpSpeed);
        currentGlowRef.current = lerp(currentGlowRef.current, config.colors === STATE_CONFIG.idle.colors ? 0.15 : 0.25, lerpSpeed);
        currentNoiseRef.current = lerp(currentNoiseRef.current, config.noiseIntensity, lerpSpeed);

        const cx = width / 2;
        const cy = height / 2;
        const baseRadius = Math.min(width, height) * 0.28;

        // Clear
        ctx.clearRect(0, 0, width, height);

        // Draw outer glow rings
        for (let ring = 3; ring >= 0; ring--) {
            const ringRadius = baseRadius + 30 + ring * 20;
            const alpha = 0.02 + Math.sin(t * config.pulseSpeed + ring) * 0.01;
            ctx.beginPath();
            ctx.arc(cx, cy, ringRadius, 0, Math.PI * 2);
            ctx.strokeStyle = `rgba(${Math.round(cc.r1)}, ${Math.round(cc.g1)}, ${Math.round(cc.b1)}, ${alpha})`;
            ctx.lineWidth = 1;
            ctx.stroke();
        }

        // Draw particles orbiting the blob
        const particleCount = 40;
        for (let i = 0; i < particleCount; i++) {
            const angle = (i / particleCount) * Math.PI * 2 + t * 0.2;
            const orbitRadius = baseRadius + 20 + Math.sin(t * 0.5 + i * 1.7) * 15;
            const px = cx + Math.cos(angle) * orbitRadius;
            const py = cy + Math.sin(angle) * orbitRadius;
            const pSize = 1 + Math.sin(t * 2 + i * 0.8) * 0.8;
            const alpha = 0.3 + Math.sin(t * 1.5 + i * 0.5) * 0.2;

            ctx.beginPath();
            ctx.arc(px, py, pSize, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(${Math.round(cc.r1)}, ${Math.round(cc.g1)}, ${Math.round(cc.b1)}, ${alpha})`;
            ctx.fill();
        }

        // Draw soft glow behind blob
        const glowGrad = ctx.createRadialGradient(cx, cy, 0, cx, cy, baseRadius * 1.8);
        glowGrad.addColorStop(0, `rgba(${Math.round(cc.r1)}, ${Math.round(cc.g1)}, ${Math.round(cc.b1)}, ${currentGlowRef.current})`);
        glowGrad.addColorStop(0.5, `rgba(${Math.round(cc.r2)}, ${Math.round(cc.g2)}, ${Math.round(cc.b2)}, 0.08)`);
        glowGrad.addColorStop(1, 'rgba(0, 0, 0, 0)');
        ctx.beginPath();
        ctx.arc(cx, cy, baseRadius * 1.8, 0, Math.PI * 2);
        ctx.fillStyle = glowGrad;
        ctx.fill();

        // Draw the blob (3 layers for depth)
        const layers = [
            { scale: 1.08, alpha: 0.15, noiseOffset: 3.0, noiseScale: 0.8, color: cc.r3 + ',' + cc.g3 + ',' + cc.b3 },
            { scale: 1.03, alpha: 0.3, noiseOffset: 1.5, noiseScale: 1.0, color: cc.r2 + ',' + cc.g2 + ',' + cc.b2 },
            { scale: 1.0, alpha: 1.0, noiseOffset: 0, noiseScale: 1.2, color: null },
        ];

        for (const layer of layers) {
            const points = 120;
            const r = baseRadius * layer.scale;
            const breathing = 1 + Math.sin(t * config.pulseSpeed) * 0.03;

            ctx.beginPath();
            for (let i = 0; i <= points; i++) {
                const angle = (i / points) * Math.PI * 2;
                const noiseVal = smoothNoise(
                    Math.cos(angle) * layer.noiseScale + layer.noiseOffset,
                    Math.sin(angle) * layer.noiseScale + layer.noiseOffset,
                    t * config.pulseSpeed * 0.8
                );
                const displacement = r * breathing + noiseVal * r * currentNoiseRef.current;
                const px = cx + Math.cos(angle) * displacement;
                const py = cy + Math.sin(angle) * displacement;
                if (i === 0) ctx.moveTo(px, py);
                else ctx.lineTo(px, py);
            }
            ctx.closePath();

            if (layer.color) {
                ctx.fillStyle = `rgba(${layer.color}, ${layer.alpha})`;
                ctx.fill();
            } else {
                // Main blob with gradient
                const mainGrad = ctx.createRadialGradient(
                    cx - r * 0.2, cy - r * 0.2, 0,
                    cx, cy, r * 1.2
                );
                mainGrad.addColorStop(0, `rgb(${Math.round(cc.r1 * 1.3)}, ${Math.round(cc.g1 * 1.3)}, ${Math.round(cc.b1 * 1.3)})`);
                mainGrad.addColorStop(0.4, `rgb(${Math.round(cc.r1)}, ${Math.round(cc.g1)}, ${Math.round(cc.b1)})`);
                mainGrad.addColorStop(0.7, `rgb(${Math.round(cc.r2)}, ${Math.round(cc.g2)}, ${Math.round(cc.b2)})`);
                mainGrad.addColorStop(1, `rgb(${Math.round(cc.r3)}, ${Math.round(cc.g3)}, ${Math.round(cc.b3)})`);
                ctx.fillStyle = mainGrad;
                ctx.fill();
            }
        }

        // Inner highlight (specular)
        const highlightGrad = ctx.createRadialGradient(
            cx - baseRadius * 0.25, cy - baseRadius * 0.3, 0,
            cx - baseRadius * 0.1, cy - baseRadius * 0.15, baseRadius * 0.5
        );
        highlightGrad.addColorStop(0, 'rgba(255, 255, 255, 0.12)');
        highlightGrad.addColorStop(1, 'rgba(255, 255, 255, 0)');
        ctx.beginPath();
        ctx.arc(cx, cy, baseRadius * 0.9, 0, Math.PI * 2);
        ctx.fillStyle = highlightGrad;
        ctx.fill();

        // Floating energy particles (inner)
        const innerParticleCount = 12;
        for (let i = 0; i < innerParticleCount; i++) {
            const angle = (i / innerParticleCount) * Math.PI * 2 + t * 0.4;
            const dist = baseRadius * 0.3 + Math.sin(t * 0.8 + i * 2.1) * baseRadius * 0.15;
            const px = cx + Math.cos(angle) * dist;
            const py = cy + Math.sin(angle) * dist;
            const pSize = 1.5 + Math.sin(t * 3 + i) * 0.8;
            ctx.beginPath();
            ctx.arc(px, py, pSize, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(255, 255, 255, ${0.15 + Math.sin(t * 2 + i * 0.7) * 0.1})`;
            ctx.fill();
        }
    }, [state, hexToRgb, lerp]);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const dpr = window.devicePixelRatio || 1;
        canvas.width = size * dpr;
        canvas.height = size * dpr;
        canvas.style.width = `${size}px`;
        canvas.style.height = `${size}px`;

        const ctx = canvas.getContext('2d');
        if (!ctx) return;
        ctx.scale(dpr, dpr);

        const animate = () => {
            ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
            draw(ctx, size, size);
            animRef.current = requestAnimationFrame(animate);
        };

        animate();
        return () => cancelAnimationFrame(animRef.current);
    }, [size, draw]);

    return (
        <canvas
            ref={canvasRef}
            style={{
                width: size,
                height: size,
                borderRadius: '50%',
            }}
        />
    );
}
