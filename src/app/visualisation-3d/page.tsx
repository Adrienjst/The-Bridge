'use client';

import { useState, useMemo, useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Text } from '@react-three/drei';
import * as THREE from 'three';
import { useLanguage } from '@/contexts/LanguageContext';
import { Bilingual } from '@/contexts/LanguageContext';

type SurfaceType = 'volatility' | 'delta' | 'gamma' | 'vega';

const surfaceConfigs: Record<SurfaceType, { label: Bilingual; description: Bilingual; color1: string; color2: string }> = {
    volatility: { label: { fr: 'Surface de Volatilité', en: 'Volatility Surface' }, description: { fr: 'σ(K, T) — Volatilité implicite en fonction du strike et de la maturité', en: 'σ(K, T) — Implied volatility as a function of strike and maturity' }, color1: '#3b82f6', color2: '#ec4899' },
    delta: { label: { fr: 'Surface Delta', en: 'Delta Surface' }, description: { fr: "Δ(S, σ) — Delta d'un call en fonction du spot et de la volatilité", en: 'Δ(S, σ) — Call delta as a function of spot and volatility' }, color1: '#10b981', color2: '#3b82f6' },
    gamma: { label: { fr: 'Surface Gamma', en: 'Gamma Surface' }, description: { fr: "Γ(S, T) — Gamma d'un call en fonction du spot et du temps à maturité", en: 'Γ(S, T) — Call gamma as a function of spot and time to maturity' }, color1: '#f59e0b', color2: '#ef4444' },
    vega: { label: { fr: 'Surface Vega', en: 'Vega Surface' }, description: { fr: "ν(S, T) — Vega d'un call en fonction du spot et du temps à maturité", en: 'ν(S, T) — Call vega as a function of spot and time to maturity' }, color1: '#8b5cf6', color2: '#06b6d4' },
};

function normalCDF(x: number) {
    const a1 = 0.254829592, a2 = -0.284496736, a3 = 1.421413741, a4 = -1.453152027, a5 = 1.061405429, p = 0.3275911;
    const sign = x < 0 ? -1 : 1;
    x = Math.abs(x) / Math.sqrt(2);
    const t = 1.0 / (1.0 + p * x);
    const y = 1 - (((((a5 * t + a4) * t) + a3) * t + a2) * t + a1) * t * Math.exp(-x * x);
    return 0.5 * (1.0 + sign * y);
}

function normalPDF(x: number) {
    return Math.exp(-0.5 * x * x) / Math.sqrt(2 * Math.PI);
}

function computeSurfaceValue(type: SurfaceType, x: number, y: number, baseVol: number): number {
    switch (type) {
        case 'volatility': {
            const strike = 70 + x * 60;
            const maturity = 0.1 + y * 4.9;
            const moneyness = (strike - 100) / 100;
            const smile = baseVol / 100 + 0.15 * moneyness * moneyness + 0.03 * Math.abs(moneyness);
            const termStructure = smile * (1 + 0.1 * Math.sqrt(maturity));
            return termStructure * 100;
        }
        case 'delta': {
            const spot = 70 + x * 60;
            const vol = 0.1 + y * 0.4;
            const K = 100, r = 0.03, T = 1;
            const d1 = (Math.log(spot / K) + (r + vol * vol / 2) * T) / (vol * Math.sqrt(T));
            return normalCDF(d1);
        }
        case 'gamma': {
            const spot = 70 + x * 60;
            const T = 0.05 + y * 2;
            const vol = baseVol / 100, K = 100, r = 0.03;
            const d1 = (Math.log(spot / K) + (r + vol * vol / 2) * T) / (vol * Math.sqrt(T));
            return normalPDF(d1) / (spot * vol * Math.sqrt(T));
        }
        case 'vega': {
            const spot = 70 + x * 60;
            const T = 0.05 + y * 2;
            const vol = baseVol / 100, K = 100, r = 0.03;
            const d1 = (Math.log(spot / K) + (r + vol * vol / 2) * T) / (vol * Math.sqrt(T));
            return spot * normalPDF(d1) * Math.sqrt(T) / 100;
        }
        default: return 0;
    }
}

function Surface({ type, baseVol, resolution = 50 }: { type: SurfaceType; baseVol: number; resolution?: number }) {
    const meshRef = useRef<THREE.Mesh>(null);
    const config = surfaceConfigs[type];

    const { geometry } = useMemo(() => {
        const size = resolution;
        const geo = new THREE.PlaneGeometry(6, 6, size - 1, size - 1);
        const positions = geo.attributes.position.array as Float32Array;
        const colors = new Float32Array(positions.length);

        let maxV = -Infinity, minV = Infinity;
        const values: number[] = [];

        for (let i = 0; i < size; i++) {
            for (let j = 0; j < size; j++) {
                const x = i / (size - 1);
                const y = j / (size - 1);
                const val = computeSurfaceValue(type, x, y, baseVol);
                values.push(val);
                maxV = Math.max(maxV, val);
                minV = Math.min(minV, val);
            }
        }

        const range = maxV - minV || 1;
        const c1 = new THREE.Color(config.color1);
        const c2 = new THREE.Color(config.color2);

        for (let i = 0; i < size; i++) {
            for (let j = 0; j < size; j++) {
                const idx = i * size + j;
                const vertexIdx = j * size + i;
                const val = values[idx];
                const normalized = (val - minV) / range;

                positions[vertexIdx * 3 + 2] = normalized * 3;

                const color = new THREE.Color().lerpColors(c1, c2, normalized);
                colors[vertexIdx * 3] = color.r;
                colors[vertexIdx * 3 + 1] = color.g;
                colors[vertexIdx * 3 + 2] = color.b;
            }
        }

        geo.setAttribute('color', new THREE.BufferAttribute(colors, 3));
        geo.computeVertexNormals();
        return { geometry: geo, maxVal: maxV, minVal: minV };
    }, [type, baseVol, resolution, config.color1, config.color2]);

    useFrame(() => {
        if (meshRef.current) {
            meshRef.current.rotation.z = 0;
        }
    });

    return (
        <mesh ref={meshRef} geometry={geometry} rotation={[-Math.PI / 3, 0, 0]} position={[0, 0, 0]}>
            <meshStandardMaterial vertexColors side={THREE.DoubleSide} flatShading={false} />
        </mesh>
    );
}

function AxisLabels({ type }: { type: SurfaceType }) {
    const labels = {
        volatility: { x: 'Strike', y: 'Maturity', z: 'Vol (%)' },
        delta: { x: 'Spot', y: 'Volatility', z: 'Delta' },
        gamma: { x: 'Spot', y: 'Time', z: 'Gamma' },
        vega: { x: 'Spot', y: 'Time', z: 'Vega' },
    };
    const l = labels[type];
    return (
        <>
            <Text position={[0, -3.5, -2]} fontSize={0.25} color="#64748b">{l.x}</Text>
            <Text position={[-4, -1, -1]} fontSize={0.25} color="#64748b" rotation={[0, Math.PI / 4, 0]}>{l.y}</Text>
        </>
    );
}

export default function Visualisation3DPage() {
    const { t } = useLanguage();
    const [surfaceType, setSurfaceType] = useState<SurfaceType>('volatility');
    const [baseVol, setBaseVol] = useState(20);
    const config = surfaceConfigs[surfaceType];

    return (
        <div className="page-container">
            <h1 className="page-title">{t({ fr: 'Visualisation 3D', en: '3D Visualization' })}</h1>
            <p className="page-subtitle">{t({ fr: 'Surfaces de volatilité et Greeks en 3D interactif.', en: 'Volatility surfaces and Greeks in interactive 3D.' })}</p>

            <div style={{ display: 'grid', gridTemplateColumns: '280px 1fr', gap: '1.5rem' }}>
                {/* Controls */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    <div className="glass-card-static" style={{ padding: '1rem' }}>
                        <label style={{ fontSize: '0.7rem', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.04em', display: 'block', marginBottom: '0.5rem' }}>
                            {t({ fr: 'Type de surface', en: 'Surface Type' })}
                        </label>
                        {(Object.keys(surfaceConfigs) as SurfaceType[]).map(typ => (
                            <button
                                key={typ}
                                onClick={() => setSurfaceType(typ)}
                                style={{
                                    display: 'block',
                                    width: '100%',
                                    padding: '0.5rem 0.7rem',
                                    background: surfaceType === typ ? `${surfaceConfigs[typ].color1}18` : 'transparent',
                                    border: surfaceType === typ ? `1px solid ${surfaceConfigs[typ].color1}40` : '1px solid transparent',
                                    borderRadius: 8,
                                    color: surfaceType === typ ? surfaceConfigs[typ].color1 : 'var(--text-secondary)',
                                    fontSize: '0.82rem',
                                    fontWeight: surfaceType === typ ? 600 : 400,
                                    cursor: 'pointer',
                                    textAlign: 'left',
                                    fontFamily: 'inherit',
                                    marginBottom: 3,
                                    transition: 'all 0.15s ease',
                                }}
                            >
                                {t(surfaceConfigs[typ].label)}
                            </button>
                        ))}
                    </div>

                    <div className="glass-card-static" style={{ padding: '1rem' }}>
                        <label style={{ fontSize: '0.7rem', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.04em', display: 'block', marginBottom: '0.75rem' }}>
                            {t({ fr: 'Paramètres', en: 'Parameters' })}
                        </label>
                        <div style={{ marginBottom: '0.75rem' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.25rem' }}>
                                <span style={{ fontSize: '0.78rem', color: 'var(--text-secondary)' }}>{t({ fr: 'Vol de base (%)', en: 'Base Vol (%)' })}</span>
                                <span style={{ fontSize: '0.78rem', fontWeight: 600, color: 'var(--text-primary)' }}>{baseVol}%</span>
                            </div>
                            <input
                                type="range"
                                min={10}
                                max={50}
                                value={baseVol}
                                onChange={e => setBaseVol(Number(e.target.value))}
                                style={{
                                    width: '100%', height: 4, borderRadius: 2,
                                    appearance: 'none', WebkitAppearance: 'none',
                                    background: 'rgba(255,255,255,0.1)', outline: 'none',
                                    cursor: 'pointer', accentColor: config.color1,
                                }}
                            />
                        </div>
                    </div>

                    <div className="glass-card-static" style={{ padding: '1rem' }}>
                        <p style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '0.35rem' }}>
                            {t({ fr: 'Contrôles', en: 'Controls' })}
                        </p>
                        <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)', lineHeight: 1.5 }}>
                            {t({
                                fr: '🖱️ Clic + glisser pour pivoter\n🔍 Molette pour zoomer\n⇧ Shift + clic pour déplacer',
                                en: '🖱️ Click + drag to rotate\n🔍 Scroll to zoom\n⇧ Shift + click to pan'
                            }).split('\n').map((line, i) => <span key={i}>{line}<br /></span>)}
                        </p>
                    </div>
                </div>

                {/* 3D Canvas */}
                <div className="glass-card-static" style={{ padding: 0, overflow: 'hidden', minHeight: 500 }}>
                    <div style={{ padding: '1rem 1.25rem', borderBottom: '1px solid var(--border)' }}>
                        <h3 style={{ fontSize: '1.05rem', fontWeight: 600, color: 'var(--text-primary)' }}>{t(config.label)}</h3>
                        <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '0.2rem' }}>{t(config.description)}</p>
                    </div>
                    <div style={{ height: 450 }}>
                        <Canvas camera={{ position: [6, 5, 6], fov: 50 }}>
                            <ambientLight intensity={0.6} />
                            <directionalLight position={[10, 10, 5]} intensity={0.8} />
                            <pointLight position={[-5, 5, -5]} intensity={0.4} />
                            <Surface type={surfaceType} baseVol={baseVol} />
                            <AxisLabels type={surfaceType} />
                            <OrbitControls
                                enablePan={true}
                                enableZoom={true}
                                enableRotate={true}
                                minDistance={4}
                                maxDistance={15}
                            />
                            <gridHelper args={[8, 8, 'rgba(255,255,255,0.05)', 'rgba(255,255,255,0.03)']} position={[0, -2, 0]} />
                        </Canvas>
                    </div>

                    {/* Legend */}
                    <div style={{ padding: '0.75rem 1.25rem', borderTop: '1px solid var(--border)', display: 'flex', alignItems: 'center', gap: '1rem' }}>
                        <div style={{
                            width: 120, height: 8, borderRadius: 4,
                            background: `linear-gradient(90deg, ${config.color1}, ${config.color2})`,
                        }} />
                        <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
                            {t({ fr: 'Bas → Haut', en: 'Low → High' })}
                        </span>
                    </div>
                </div>
            </div>
        </div>
    );
}
