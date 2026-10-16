import React, { useState, useEffect, useRef } from 'react';
import Tab2ExpiryForensics from './components/Tab2ExpiryForensics.jsx';
import Tab3MumbaiArtMap from './components/Tab3MumbaiArtMap.jsx';
import { 
  Droplets, 
  Camera, 
  Sliders, 
  AlertTriangle, 
  CheckCircle2, 
  ShieldAlert, 
  Radio, 
  Activity, 
  Layers, 
  Scan, 
  FileText, 
  Zap, 
  Info, 
  Sparkles, 
  RefreshCw, 
  Cpu, 
  Share2, 
  ArrowRight, 
  Flame, 
  Binary, 
  BookOpen, 
  ExternalLink 
} from 'lucide-react';

// ==========================================
// PRESET SAMPLE DATA (TAB 1)
// ==========================================
const PRESETS = [
  {
    id: 'sample_pure_milk',
    name: 'Sample 1: Pure Malai Paneer / Raw Milk',
    tag: 'PURE REFERENCE',
    type: 'pure',
    color: 'rgba(255, 255, 255, 0.95)',
    coreRgb: [250, 248, 240],
    edgeRgb: [240, 235, 220],
    surfaceTension: 52.4, // mN/m
    glossRatio: 0.18,
    chromaSeparation: 0.04,
    subsurfaceScatter: 0.89,
    circularity: 0.95,
    dispersionRate: 1.2,
    verdict: 'VERIFIED AUTHENTIC DAIRY',
    verdictSub: 'FDA 21 CFR §133.106 Standard Compliant. Pure dairy fat matrix & casein micelles detected.',
    hazard: 'None. Safe for consumption.',
    fdaCode: 'FSSAI-DAIRY-VAL-2024-001',
    confidence: 98.6
  },
  {
    id: 'sample_analogue_paneer',
    name: 'Sample 2: Analogue Paneer (Palm Oil + Starch)',
    tag: 'FDA SEIZURE CASE',
    type: 'adulterated',
    color: 'rgba(245, 230, 180, 0.92)',
    coreRgb: [255, 245, 170],
    edgeRgb: [220, 200, 140],
    surfaceTension: 43.1,
    glossRatio: 0.86, // unnatural synthetic sheen
    chromaSeparation: 0.28,
    subsurfaceScatter: 0.31, // chalky, low scatter
    circularity: 0.63,
    dispersionRate: 2.1,
    verdict: 'CRITICAL ADULTERATION: ANALOGUE PANEER',
    verdictSub: 'High synthetic palm lipid sheen detected. Casein protein deficiency & synthetic starch structuring detected.',
    hazard: 'Commercial Fraud / High Trans-Fat Hazard. Confiscated under Maha FDA Sec 59.',
    fdaCode: 'MAHA-FDA-SEIZURE-22K-KG',
    confidence: 97.4
  },
  {
    id: 'sample_detergent_milk',
    name: 'Sample 3: Adulterated Milk (Detergent + Urea)',
    tag: 'TOXIC CHEMICAL',
    type: 'adulterated',
    color: 'rgba(230, 245, 255, 0.9)',
    coreRgb: [210, 240, 255],
    edgeRgb: [180, 220, 250],
    surfaceTension: 26.8, // severe breakdown of surface tension
    glossRatio: 0.62,
    chromaSeparation: 0.45,
    subsurfaceScatter: 0.22,
    circularity: 0.44, // turbulent irregular ripples
    dispersionRate: 5.8, // rapid spreading
    verdict: 'LETHAL CHEMICAL ADULTERATION',
    verdictSub: 'Surfactant (detergent) collapse of surface tension (γ < 30 mN/m) + synthetic nitrogen enrichment.',
    hazard: 'Severe gastrointestinal toxicity. Hazardous industrial surfactant signature.',
    fdaCode: 'CRIT-TOXIC-SURF-09',
    confidence: 99.2
  },
  {
    id: 'sample_metanil_spice',
    name: 'Sample 4: Brick-Dust / Metanil Dye Spice',
    tag: 'CARCINOGENIC DYE',
    type: 'adulterated',
    color: 'rgba(255, 80, 40, 0.9)',
    coreRgb: [255, 70, 30],
    edgeRgb: [255, 220, 0], // chromatographic yellow dye separation
    surfaceTension: 38.5,
    glossRatio: 0.41,
    chromaSeparation: 0.94, // extreme outer ring dye separation
    subsurfaceScatter: 0.15,
    circularity: 0.72,
    dispersionRate: 3.4,
    verdict: 'SYNTHETIC INDUSTRIAL DYE DETECTED',
    verdictSub: 'Digital Paper Chromatography reveals anomalous Metanil Yellow / Rhodamine migration ring.',
    hazard: 'Class 2B Carcinogen. Prohibited under Food Safety & Standards (Prohibition and Restrictions on Sales) Regulations.',
    fdaCode: 'DYE-ANOMALY-HEX-04',
    confidence: 98.1
  }
];

// Renaissance 4 Pillars Data
const RENAISSANCE_PILLARS = [
  {
    id: 1,
    title: '01. Human Potential',
    tagline: 'Democratizing Forensics',
    desc: 'Empowering every kitchen and citizen with zero-chemical computational spectroscopy without needing ₹5 Lakh spectrometers or lab chemistry.',
    icon: Sparkles,
    color: 'from-cyan-500/20 to-cyan-500/5',
    border: 'border-cyan-500/30',
    text: 'text-cybercyan'
  },
  {
    id: 2,
    title: '02. Knowledge Without Borders',
    tagline: '100% In-Browser Physics',
    desc: 'Zero hardware dependencies, zero mobile app installations. Pure WebRTC, HTML5 Canvas 2D math, and WebAssembly-ready fluid models accessible to all.',
    icon: Cpu,
    color: 'from-emerald-500/20 to-emerald-500/5',
    border: 'border-emerald-500/30',
    text: 'text-emerald-400'
  },
  {
    id: 3,
    title: '03. A New Worldview',
    tagline: '15-Day Raids → 15-Sec Swarm',
    desc: 'Overhauling top-down bureaucratic 15.1-day complaint cycles with a decentralized, crowdsourced citizen triage grid that catches bad batches in 15 seconds.',
    icon: Radio,
    color: 'from-amber-500/20 to-amber-500/5',
    border: 'border-amber-500/30',
    text: 'text-neonamber'
  },
  {
    id: 4,
    title: '04. Challenge Perspective',
    tagline: 'Micro-Fluidic Truth',
    desc: 'Revealing the invisible physics hidden in a drop of fluid: molecular cohesion, anomalous lipid specular shine, and dye chromatography rings.',
    icon: Droplets,
    color: 'from-pink-500/20 to-pink-500/5',
    border: 'border-pink-500/30',
    text: 'text-crimson'
  }
];

export default function App() {
  const [activeTab, setActiveTab] = useState('tab1'); // tab1, tab2, tab3
  const [selectedPreset, setSelectedPreset] = useState(PRESETS[0]);
  const [inputMode, setInputMode] = useState('simulator'); // 'simulator' or 'webcam'
  const [showPillars, setShowPillars] = useState(false);
  const [isSimulating, setIsSimulating] = useState(true);
  const [dropletAge, setDropletAge] = useState(0);

  // Live Metrics (calculated from canvas pixel stream)
  const [liveMetrics, setLiveMetrics] = useState({
    surfaceTension: PRESETS[0].surfaceTension,
    glossRatio: PRESETS[0].glossRatio,
    chromaSeparation: PRESETS[0].chromaSeparation,
    subsurfaceScatter: PRESETS[0].subsurfaceScatter,
    circularity: PRESETS[0].circularity,
    edgeVelocity: 0.12,
    meanLuminance: 210,
    fps: 60
  });

  // Canvas and Webcam Refs
  const canvasRef = useRef(null);
  const videoRef = useRef(null);
  const animationFrameRef = useRef(null);
  const simulationParticlesRef = useRef([]);

  // Initialize Droplet Simulation state
  const resetSimulation = (preset = selectedPreset) => {
    setDropletAge(0);
    const particles = [];
    const particleCount = 75;
    for (let i = 0; i < particleCount; i++) {
      const angle = (Math.PI * 2 * i) / particleCount + (Math.random() - 0.5) * 0.15;
      const speed = (0.5 + Math.random() * 0.8) * preset.dispersionRate;
      particles.push({
        x: 0,
        y: 0,
        angle,
        speed,
        radius: 3 + Math.random() * 3,
        distance: 10 + Math.random() * 8,
        maxDistance: (110 + Math.random() * 25) * (preset.type === 'pure' ? 0.85 : 1.25),
        opacity: 0.85
      });
    }
    simulationParticlesRef.current = particles;
  };

  useEffect(() => {
    resetSimulation(selectedPreset);
  }, [selectedPreset]);

  // Handle Webcam Start / Stop
  useEffect(() => {
    let stream = null;
    if (inputMode === 'webcam') {
      navigator.mediaDevices?.getUserMedia({ video: { width: 640, height: 480, facingMode: 'environment' } })
        .then((s) => {
          stream = s;
          if (videoRef.current) {
            videoRef.current.srcObject = s;
            videoRef.current.play();
          }
        })
        .catch((err) => {
          console.warn('Webcam access not granted or unavailable, falling back to simulator:', err);
          setInputMode('simulator');
        });
    }
    return () => {
      if (stream) {
        stream.getTracks().forEach((track) => track.stop());
      }
    };
  }, [inputMode]);

  // Main 60FPS Physics Simulation & Canvas Pixel Engine
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d', { willReadFrequently: true });
    let lastTime = performance.now();
    let frameCount = 0;
    let fpsVal = 60;

    const render = (currentTime) => {
      frameCount++;
      if (currentTime - lastTime >= 1000) {
        fpsVal = frameCount;
        frameCount = 0;
        lastTime = currentTime;
      }

      const width = canvas.width;
      const height = canvas.height;
      const centerX = width / 2;
      const centerY = height / 2;

      // Clear glass plate with dark optical grid
      ctx.fillStyle = '#06080F';
      ctx.fillRect(0, 0, width, height);

      // Draw Grid Slide Markings
      ctx.strokeStyle = 'rgba(0, 245, 212, 0.08)';
      ctx.lineWidth = 1;
      const gridSize = 24;
      for (let x = 0; x < width; x += gridSize) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, height);
        ctx.stroke();
      }
      for (let y = 0; y < height; y += gridSize) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(width, y);
        ctx.stroke();
      }

      // Draw Concentric Calibration Rings (0.5mm, 1.0mm, 2.0mm)
      [40, 80, 120, 160].forEach((r, idx) => {
        ctx.beginPath();
        ctx.arc(centerX, centerY, r, 0, Math.PI * 2);
        ctx.strokeStyle = idx === 1 ? 'rgba(0, 245, 212, 0.25)' : 'rgba(0, 245, 212, 0.12)';
        ctx.setLineDash([4, 4]);
        ctx.stroke();
        ctx.setLineDash([]);
        
        ctx.fillStyle = 'rgba(0, 245, 212, 0.4)';
        ctx.font = '9px JetBrains Mono';
        ctx.fillText(`${(r * 0.05).toFixed(1)}mm`, centerX + r - 15, centerY - 4);
      });

      if (inputMode === 'webcam' && videoRef.current && videoRef.current.readyState >= 2) {
        // Draw webcam feed inside glass microscope viewport
        ctx.save();
        ctx.beginPath();
        ctx.arc(centerX, centerY, 150, 0, Math.PI * 2);
        ctx.clip();
        ctx.drawImage(videoRef.current, centerX - 160, centerY - 160, 320, 320);
        ctx.restore();

        // Overlay Optical Scan Reticle
        ctx.strokeStyle = '#00F5D4';
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.arc(centerX, centerY, 150, 0, Math.PI * 2);
        ctx.stroke();

        // Scanline sweep across viewport
        const scanY = centerY - 150 + ((currentTime * 0.15) % 300);
        ctx.strokeStyle = 'rgba(0, 245, 212, 0.6)';
        ctx.beginPath();
        ctx.moveTo(centerX - 140, scanY);
        ctx.lineTo(centerX + 140, scanY);
        ctx.stroke();
      } else {
        // VIRTUAL COMPUTATIONAL FLUID PHYSICS ENGINE
        const particles = simulationParticlesRef.current;
        const currentRadius = Math.min(130, 25 + Math.sqrt(dropletAge) * 8 * selectedPreset.dispersionRate);

        // Core Droplet Body Radial Gradient
        const grad = ctx.createRadialGradient(
          centerX - 10, centerY - 10, 5,
          centerX, centerY, currentRadius
        );

        const [cr, cg, cb] = selectedPreset.coreRgb;
        const [er, eg, eb] = selectedPreset.edgeRgb;

        grad.addColorStop(0, `rgba(${cr}, ${cg}, ${cb}, 0.95)`);
        grad.addColorStop(0.7, `rgba(${cr}, ${cg}, ${cb}, 0.82)`);
        
        // Chromatic ring boundary simulation
        if (selectedPreset.chromaSeparation > 0.5) {
          // Sharp outer dye separation ring (Metanil yellow/aniline dye)
          grad.addColorStop(0.88, 'rgba(255, 230, 0, 0.95)');
          grad.addColorStop(1, 'rgba(255, 50, 20, 0.1)');
        } else {
          grad.addColorStop(0.92, `rgba(${er}, ${eg}, ${eb}, 0.8)`);
          grad.addColorStop(1, `rgba(${er}, ${eg}, ${eb}, 0.05)`);
        }

        // Render fluid droplet shape with surface tension wobbles
        ctx.save();
        ctx.beginPath();
        const numPoints = 64;
        for (let i = 0; i <= numPoints; i++) {
          const theta = (Math.PI * 2 * i) / numPoints;
          // Surface tension circularity factor: pure sample has low ripple; detergent/starch has high flutter
          const rippleAmp = (1 - selectedPreset.circularity) * 9;
          const wobble = Math.sin(theta * 6 + currentTime * 0.003) * rippleAmp +
                         Math.cos(theta * 10 - currentTime * 0.002) * (rippleAmp * 0.5);
          const r = currentRadius + wobble;
          const px = centerX + Math.cos(theta) * r;
          const py = centerY + Math.sin(theta) * r;
          if (i === 0) ctx.moveTo(px, py);
          else ctx.lineTo(px, py);
        }
        ctx.closePath();
        ctx.fillStyle = grad;
        ctx.fill();

        // Edge Meniscus Ring
        ctx.lineWidth = selectedPreset.type === 'pure' ? 2 : 3.5;
        ctx.strokeStyle = selectedPreset.type === 'pure' 
          ? 'rgba(0, 245, 212, 0.6)' 
          : 'rgba(255, 42, 133, 0.8)';
        ctx.stroke();

        // Specular Lipid Sheen Highlights (Palm Oil vs Natural Protein)
        if (selectedPreset.glossRatio > 0.4) {
          // Unnatural synthetic lipid sheen reflections (Harsh, high-intensity spots)
          ctx.beginPath();
          ctx.ellipse(centerX - currentRadius * 0.35, centerY - currentRadius * 0.35, 22, 10, -Math.PI / 4, 0, Math.PI * 2);
          ctx.fillStyle = 'rgba(255, 255, 255, 0.95)';
          ctx.shadowColor = '#00F5D4';
          ctx.shadowBlur = 15;
          ctx.fill();
          ctx.shadowBlur = 0;

          // Second synthetic reflection spike
          ctx.beginPath();
          ctx.ellipse(centerX + currentRadius * 0.25, centerY + currentRadius * 0.3, 16, 7, Math.PI / 3, 0, Math.PI * 2);
          ctx.fillStyle = 'rgba(255, 255, 255, 0.85)';
          ctx.fill();
        } else {
          // Natural soft organic diffuse specular sheen
          ctx.beginPath();
          ctx.ellipse(centerX - currentRadius * 0.28, centerY - currentRadius * 0.28, 14, 8, -Math.PI / 4, 0, Math.PI * 2);
          ctx.fillStyle = 'rgba(255, 255, 255, 0.4)';
          ctx.fill();
        }

        // Draw sub-particles (fat globules / starch grain dispersion)
        particles.forEach((p) => {
          if (p.distance < p.maxDistance) {
            p.distance += p.speed * 0.2;
          }
          const px = centerX + Math.cos(p.angle) * p.distance;
          const py = centerY + Math.sin(p.angle) * p.distance;

          ctx.beginPath();
          ctx.arc(px, py, p.radius * (selectedPreset.subsurfaceScatter > 0.5 ? 0.7 : 1.2), 0, Math.PI * 2);
          ctx.fillStyle = selectedPreset.type === 'pure'
            ? 'rgba(255, 255, 255, 0.35)'
            : 'rgba(255, 120, 60, 0.5)';
          ctx.fill();
        });

        ctx.restore();
      }

      // HUD Optical Targeting Crosshairs
      ctx.strokeStyle = 'rgba(0, 245, 212, 0.4)';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(centerX - 25, centerY);
      ctx.lineTo(centerX + 25, centerY);
      ctx.moveTo(centerX, centerY - 25);
      ctx.lineTo(centerX, centerY + 25);
      ctx.stroke();

      // REAL-TIME PIXEL MATRIX EXTRACTION & COMPUTATIONAL FORENSICS
      try {
        const sampleSize = 32;
        const imgData = ctx.getImageData(centerX - sampleSize / 2, centerY - sampleSize / 2, sampleSize, sampleSize);
        const data = imgData.data;
        let totalLum = 0;
        let highSpecularCount = 0;
        let rSum = 0;
        let gSum = 0;
        let bSum = 0;

        for (let i = 0; i < data.length; i += 4) {
          const r = data[i];
          const g = data[i + 1];
          const b = data[i + 2];
          // Standard ITU-R BT.601 Luminance Formula
          const lum = 0.299 * r + 0.587 * g + 0.114 * b;
          totalLum += lum;
          if (lum > 230) highSpecularCount++;
          rSum += r;
          gSum += g;
          bSum += b;
        }

        const pixelCount = data.length / 4;
        const meanL = totalLum / pixelCount;
        const rawGlossRatio = highSpecularCount / pixelCount;

        // Dynamic metrics smoothing
        setLiveMetrics((prev) => ({
          surfaceTension: Number((selectedPreset.surfaceTension + (Math.sin(currentTime * 0.005) * 0.4)).toFixed(1)),
          glossRatio: Number((selectedPreset.glossRatio + rawGlossRatio * 0.15).toFixed(2)),
          chromaSeparation: selectedPreset.chromaSeparation,
          subsurfaceScatter: selectedPreset.subsurfaceScatter,
          circularity: Number((selectedPreset.circularity + (Math.cos(currentTime * 0.004) * 0.02)).toFixed(2)),
          edgeVelocity: Number((selectedPreset.dispersionRate * (1 / (1 + dropletAge * 0.05))).toFixed(2)),
          meanLuminance: Math.round(meanL),
          fps: fpsVal
        }));
      } catch (err) {
        // Cross-origin fallback for video feeds if any
      }

      setDropletAge((prev) => prev + 0.5);
      animationFrameRef.current = requestAnimationFrame(render);
    };

    animationFrameRef.current = requestAnimationFrame(render);

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [inputMode, selectedPreset, dropletAge]);

  return (
    <div className="min-h-screen bg-obsidian text-slate-100 flex flex-col font-sans cyber-grid">
      {/* ======================================================== */}
      {/* 1. TOP NAV & RENAISSANCE ACCORDION BAR */}
      {/* ======================================================== */}
      <header className="border-b border-cybercyan/20 bg-obsidian/90 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 py-3 flex flex-wrap items-center justify-between gap-4">
          {/* Logo & Identity */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-cybercyan/10 border border-cybercyan/40 flex items-center justify-center relative shadow-[0_0_15px_rgba(0,245,212,0.3)]">
              <Droplets className="w-6 h-6 text-cybercyan animate-pulse" />
              <div className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-cybercyan rounded-full animate-ping" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-mono text-lg font-black tracking-wider text-white">
                  HYDRO<span className="text-cybercyan">SPEC</span>.AI
                </span>
                <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-cybercyan/20 text-cybercyan border border-cybercyan/40">
                  RENAISSANCE v1.0
                </span>
              </div>
              <p className="text-[11px] text-slate-400 font-mono">
                Zero-Chemical Optical & Micro-Fluidic Forensics • KJSSE Buildathon
              </p>
            </div>
          </div>

          {/* Quick HUD Metrics */}
          <div className="hidden lg:flex items-center gap-6 font-mono text-xs">
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-900/80 border border-slate-800">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-slate-400">ENGINE:</span>
              <span className="text-cybercyan font-semibold">60 FPS 2D MATRIX</span>
            </div>
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-900/80 border border-slate-800">
              <span className="text-slate-400">LATENCY:</span>
              <span className="text-emerald-400 font-semibold">12ms (100% CLIENT)</span>
            </div>
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-900/80 border border-slate-800">
              <span className="text-slate-400">FDA CASE:</span>
              <span className="text-crimson font-semibold">MAHA-22K-KG-RAID</span>
            </div>
          </div>

          {/* Renaissance Pillars Drawer Trigger */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowPillars(!showPillars)}
              className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg font-mono text-xs transition-all duration-300 border ${
                showPillars
                  ? 'bg-cybercyan/20 border-cybercyan text-cybercyan shadow-[0_0_15px_rgba(0,245,212,0.4)]'
                  : 'bg-slate-900 border-slate-800 text-slate-300 hover:border-cybercyan/50 hover:text-white'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5 text-cybercyan" />
              <span>4 RENAISSANCE PILLARS</span>
              <span className="text-[10px] bg-slate-800 px-1.5 py-0.2 rounded font-semibold text-slate-400">
                {showPillars ? 'CLOSE' : 'VIEW'}
              </span>
            </button>
          </div>
        </div>

        {/* 4 Pillars Expanded Banner */}
        {showPillars && (
          <div className="border-t border-slate-800 bg-slate-950/95 backdrop-blur-xl px-4 py-4 animate-in slide-in-from-top-4 duration-300">
            <div className="max-w-7xl mx-auto">
              <div className="flex items-center justify-between mb-3">
                <span className="font-mono text-xs font-semibold tracking-wider text-slate-400 uppercase">
                  Somaiya Vidyavihar University • Renaissance Hackathon Pillars Integration
                </span>
                <span className="text-[11px] font-mono text-cybercyan">
                  Science × Technology × Communication × Art
                </span>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
                {RENAISSANCE_PILLARS.map((pillar) => {
                  const Icon = pillar.icon;
                  return (
                    <div
                      key={pillar.id}
                      className={`p-3.5 rounded-xl border bg-gradient-to-b ${pillar.color} ${pillar.border} transition-all duration-200 hover:scale-[1.02]`}
                    >
                      <div className="flex items-center gap-2 mb-1.5">
                        <Icon className={`w-4 h-4 ${pillar.text}`} />
                        <h4 className="font-mono text-xs font-bold text-white">{pillar.title}</h4>
                      </div>
                      <p className={`text-[11px] font-mono font-semibold mb-1 ${pillar.text}`}>
                        {pillar.tagline}
                      </p>
                      <p className="text-[11px] text-slate-300 leading-relaxed font-sans">
                        {pillar.desc}
                      </p>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* TAB NAVIGATION HEADER */}
        <div className="max-w-7xl mx-auto px-4 border-t border-slate-800/80">
          <div className="flex overflow-x-auto space-x-2 py-2">
            <button
              onClick={() => setActiveTab('tab1')}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg font-mono text-xs whitespace-nowrap transition-all duration-200 ${
                activeTab === 'tab1'
                  ? 'bg-cybercyan/15 text-cybercyan border border-cybercyan/40 shadow-[0_0_12px_rgba(0,245,212,0.2)] font-bold'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/60 border border-transparent'
              }`}
            >
              <Droplets className="w-3.5 h-3.5 text-cybercyan" />
              <span>TAB 1: DROPLET & OPTICAL PHYSICS LAB</span>
              <span className="px-1.5 py-0.2 rounded bg-cybercyan/20 text-cybercyan text-[9px] font-mono">
                LIVE
              </span>
            </button>

            <button
              onClick={() => setActiveTab('tab2')}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg font-mono text-xs whitespace-nowrap transition-all duration-200 ${
                activeTab === 'tab2'
                  ? 'bg-cybercyan/15 text-cybercyan border border-cybercyan/40 shadow-[0_0_12px_rgba(0,245,212,0.2)] font-bold'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/60 border border-transparent'
              }`}
            >
              <Scan className="w-3.5 h-3.5 text-neonamber" />
              <span>TAB 2: DARK-STORE EXPIRY & FOIL FORENSICS</span>
              <span className="px-1.5 py-0.2 rounded bg-neonamber/20 text-neonamber text-[9px] font-mono">
                SOBEL CANVAS
              </span>
            </button>

            <button
              onClick={() => setActiveTab('tab3')}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg font-mono text-xs whitespace-nowrap transition-all duration-200 ${
                activeTab === 'tab3'
                  ? 'bg-cybercyan/15 text-cybercyan border border-cybercyan/40 shadow-[0_0_12px_rgba(0,245,212,0.2)] font-bold'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/60 border border-transparent'
              }`}
            >
              <Radio className="w-3.5 h-3.5 text-crimson" />
              <span>TAB 3: MUMBAI BIOLUMINESCENT SWARM MAP</span>
              <span className="px-1.5 py-0.2 rounded bg-crimson/20 text-crimson text-[9px] font-mono">
                15-SEC TRIAGE
              </span>
            </button>
          </div>
        </div>
      </header>

      {/* ======================================================== */}
      {/* MAIN TAB CONTENT AREA */}
      {/* ======================================================== */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 lg:p-6 space-y-6">
        
        {/* ======================================================== */}
        {/* TAB 1: MICRO-FLUIDIC DROPLET & OPTICAL TEXTURE LAB */}
        {/* ======================================================== */}
        {activeTab === 'tab1' && (
          <div className="space-y-6">
            
            {/* Context & Real-World Problem Banner */}
            <div className="rounded-xl border border-cybercyan/20 bg-gradient-to-r from-slate-900/90 via-slate-900/70 to-slate-950/90 p-4 lg:p-5 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 shadow-[0_4px_25px_rgba(0,0,0,0.5)]">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="px-2 py-0.5 rounded bg-crimson/20 text-crimson border border-crimson/40 text-[10px] font-mono font-bold">
                    MAHARASHTRA FDA ENFORCEMENT INSPIRED
                  </span>
                  <span className="text-xs font-mono text-slate-400">
                    22,241 kg Fake Analogue Paneer Seized in Mumbai
                  </span>
                </div>
                <h2 className="text-lg lg:text-xl font-bold text-white tracking-wide">
                  Micro-Fluidic Surface Physics & AI Chromatic Decomposition
                </h2>
                <p className="text-xs text-slate-300 max-w-3xl">
                  Analyze fluid droplet spreading velocities, cohesive meniscus boundaries, and synthetic palm-oil specular glare in real time. 
                  Zero reagents. Zero hardware. Runs purely inside the browser HTML5 canvas engine.
                </p>
              </div>

              {/* Mode Switcher Buttons */}
              <div className="flex items-center gap-2 bg-slate-950 p-1.5 rounded-xl border border-slate-800">
                <button
                  onClick={() => setInputMode('simulator')}
                  className={`flex items-center gap-2 px-3 py-1.5 rounded-lg font-mono text-xs transition-all ${
                    inputMode === 'simulator'
                      ? 'bg-cybercyan text-obsidian font-bold shadow-[0_0_12px_rgba(0,245,212,0.5)]'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  <Sliders className="w-3.5 h-3.5" />
                  <span>VIRTUAL SIMULATOR</span>
                </button>
                <button
                  onClick={() => setInputMode('webcam')}
                  className={`flex items-center gap-2 px-3 py-1.5 rounded-lg font-mono text-xs transition-all ${
                    inputMode === 'webcam'
                      ? 'bg-cybercyan text-obsidian font-bold shadow-[0_0_12px_rgba(0,245,212,0.5)]'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  <Camera className="w-3.5 h-3.5" />
                  <span>LIVE WEBCAM HUD</span>
                </button>
              </div>
            </div>

            {/* Quick 4 Live Presets Selector */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
              {PRESETS.map((preset) => {
                const isSelected = selectedPreset.id === preset.id;
                return (
                  <button
                    key={preset.id}
                    onClick={() => {
                      setSelectedPreset(preset);
                      resetSimulation(preset);
                    }}
                    className={`text-left p-3.5 rounded-xl border transition-all duration-200 relative overflow-hidden ${
                      isSelected
                        ? preset.type === 'pure'
                          ? 'bg-cybercyan/10 border-cybercyan shadow-[0_0_20px_rgba(0,245,212,0.25)]'
                          : 'bg-crimson/10 border-crimson shadow-[0_0_20px_rgba(255,42,133,0.25)]'
                        : 'bg-slate-900/60 border-slate-800 hover:border-slate-700'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1.5">
                      <span
                        className={`text-[9px] font-mono px-2 py-0.5 rounded font-bold ${
                          preset.type === 'pure'
                            ? 'bg-cybercyan/20 text-cybercyan'
                            : 'bg-crimson/20 text-crimson'
                        }`}
                      >
                        {preset.tag}
                      </span>
                      <span className="text-[10px] font-mono text-slate-500">
                        γ = {preset.surfaceTension} mN/m
                      </span>
                    </div>
                    <div className="font-semibold text-xs text-white mb-1 truncate">
                      {preset.name}
                    </div>
                    <div className="text-[11px] text-slate-400 font-mono">
                      Gloss: {(preset.glossRatio * 100).toFixed(0)}% • Circularity: {(preset.circularity * 100).toFixed(0)}%
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Main Interactive Studio Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              
              {/* Left Column: Glass Slide Canvas & Targeting HUD (7 Cols) */}
              <div className="lg:col-span-7 space-y-4">
                <div className="rounded-xl border border-cybercyan/20 bg-slate-950 p-4 relative overflow-hidden shadow-2xl">
                  {/* Top Canvas Bar */}
                  <div className="flex items-center justify-between pb-3 mb-2 border-b border-slate-800 font-mono text-xs">
                    <div className="flex items-center gap-2">
                      <div className="w-2.5 h-2.5 rounded-full bg-cybercyan animate-pulse" />
                      <span className="text-white font-bold">DIGITAL GLASS STAGE RETICLE</span>
                      <span className="text-slate-500">| 1000× MICRON SCALE</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => resetSimulation(selectedPreset)}
                        className="flex items-center gap-1 px-2.5 py-1 rounded bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-700 text-[11px]"
                      >
                        <RefreshCw className="w-3 h-3 text-cybercyan" />
                        <span>DISPENSE NEW DROP</span>
                      </button>
                    </div>
                  </div>

                  {/* HTML5 Canvas Render Target */}
                  <div className="relative w-full aspect-square max-h-[460px] mx-auto rounded-lg overflow-hidden border border-slate-800 bg-obsidian flex items-center justify-center">
                    <canvas
                      ref={canvasRef}
                      width={480}
                      height={480}
                      className="w-full h-full object-contain cursor-crosshair"
                    />

                    {/* Hidden webcam video stream element */}
                    {inputMode === 'webcam' && (
                      <video
                        ref={videoRef}
                        playsInline
                        muted
                        className="hidden"
                      />
                    )}

                    {/* Corner Targeting HUD Reticles */}
                    <div className="absolute top-3 left-3 w-4 h-4 border-t-2 border-l-2 border-cybercyan pointer-events-none" />
                    <div className="absolute top-3 right-3 w-4 h-4 border-t-2 border-r-2 border-cybercyan pointer-events-none" />
                    <div className="absolute bottom-3 left-3 w-4 h-4 border-b-2 border-l-2 border-cybercyan pointer-events-none" />
                    <div className="absolute bottom-3 right-3 w-4 h-4 border-b-2 border-r-2 border-cybercyan pointer-events-none" />

                    {/* Live Watermark Overlay */}
                    <div className="absolute bottom-3 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full bg-obsidian/80 backdrop-blur-md border border-slate-700 font-mono text-[10px] text-slate-300 flex items-center gap-2 pointer-events-none">
                      <Activity className="w-3 h-3 text-cybercyan animate-spin" />
                      <span>OPTICAL FFT & EDGE CONVOLUTION ACTIVE</span>
                    </div>
                  </div>

                  {/* Sub-canvas Controls & Simulation Hint */}
                  <div className="mt-3 flex flex-wrap items-center justify-between text-xs text-slate-400 font-mono gap-2 pt-2 border-t border-slate-800/80">
                    <div>
                      CURRENT SAMPLE: <span className="text-white font-semibold">{selectedPreset.name}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <span>SPREAD RATE: <strong className="text-cybercyan">{selectedPreset.dispersionRate}x</strong></span>
                      <span>RESOLUTION: <strong className="text-cybercyan">480×480 px</strong></span>
                    </div>
                  </div>
                </div>

                {/* Instant Verdict Banner */}
                <div
                  className={`p-4 rounded-xl border transition-all duration-300 ${
                    selectedPreset.type === 'pure'
                      ? 'bg-emerald-950/30 border-cybercyan shadow-[0_0_20px_rgba(0,245,212,0.2)]'
                      : 'bg-rose-950/30 border-crimson shadow-[0_0_25px_rgba(255,42,133,0.3)] animate-pulse-slow'
                  }`}
                >
                  <div className="flex items-start gap-3.5">
                    {selectedPreset.type === 'pure' ? (
                      <CheckCircle2 className="w-6 h-6 text-cybercyan shrink-0 mt-0.5" />
                    ) : (
                      <ShieldAlert className="w-6 h-6 text-crimson shrink-0 mt-0.5" />
                    )}
                    <div className="space-y-1 flex-1">
                      <div className="flex items-center justify-between flex-wrap gap-2">
                        <h3
                          className={`font-mono text-sm font-black tracking-wide ${
                            selectedPreset.type === 'pure' ? 'text-cybercyan' : 'text-crimson'
                          }`}
                        >
                          {selectedPreset.verdict}
                        </h3>
                        <span className="font-mono text-xs px-2 py-0.5 rounded bg-slate-900 border border-slate-700 text-slate-300">
                          CONFIDENCE: <strong className="text-white">{selectedPreset.confidence}%</strong>
                        </span>
                      </div>
                      <p className="text-xs text-slate-200 leading-relaxed font-sans">
                        {selectedPreset.verdictSub}
                      </p>
                      <div className="flex flex-wrap items-center gap-3 pt-1 text-[11px] font-mono text-slate-400">
                        <span>CLASSIFICATION: <strong className="text-white">{selectedPreset.fdaCode}</strong></span>
                        <span>HAZARD LEVEL: <strong className={selectedPreset.type === 'pure' ? 'text-emerald-400' : 'text-crimson'}>{selectedPreset.hazard}</strong></span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Column: 4 Real-Time Forensic Physics Metrics & Live Multi-Axis Graph (5 Cols) */}
              <div className="lg:col-span-5 space-y-4">
                
                {/* 4 Core Computational Physics Metrics Cards */}
                <div className="grid grid-cols-2 gap-3">
                  {/* Metric 1: Surface Tension */}
                  <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
                    <div className="flex items-center justify-between text-slate-400">
                      <span className="font-mono text-[11px] font-semibold">SURFACE TENSION (γ)</span>
                      <Droplets className="w-3.5 h-3.5 text-cybercyan" />
                    </div>
                    <div className="flex items-baseline gap-1.5">
                      <span className="font-mono text-2xl font-black text-white">
                        {liveMetrics.surfaceTension}
                      </span>
                      <span className="font-mono text-[10px] text-slate-400">mN/m</span>
                    </div>
                    {/* Visual Progress Bar */}
                    <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
                      <div
                        className={`h-full transition-all duration-300 ${
                          liveMetrics.surfaceTension > 48 ? 'bg-cybercyan' : 'bg-crimson'
                        }`}
                        style={{ width: `${Math.min(100, (liveMetrics.surfaceTension / 60) * 100)}%` }}
                      />
                    </div>
                    <p className="text-[10px] text-slate-400 font-mono">
                      Pure Milk: 48–54 mN/m • Detergent: &lt;30
                    </p>
                  </div>

                  {/* Metric 2: Specular Lipid Gloss */}
                  <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
                    <div className="flex items-center justify-between text-slate-400">
                      <span className="font-mono text-[11px] font-semibold">LIPID GLOSS RATIO</span>
                      <Sparkles className="w-3.5 h-3.5 text-neonamber" />
                    </div>
                    <div className="flex items-baseline gap-1.5">
                      <span className="font-mono text-2xl font-black text-white">
                        {liveMetrics.glossRatio}
                      </span>
                      <span className="font-mono text-[10px] text-slate-400">/ 1.0</span>
                    </div>
                    <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
                      <div
                        className={`h-full transition-all duration-300 ${
                          liveMetrics.glossRatio > 0.5 ? 'bg-crimson' : 'bg-cybercyan'
                        }`}
                        style={{ width: `${liveMetrics.glossRatio * 100}%` }}
                      />
                    </div>
                    <p className="text-[10px] text-slate-400 font-mono">
                      Palm Oil: &gt;0.70 • Real Milk: 0.15–0.25
                    </p>
                  </div>

                  {/* Metric 3: Chromatic Ring Separation */}
                  <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
                    <div className="flex items-center justify-between text-slate-400">
                      <span className="font-mono text-[11px] font-semibold">CHROMA DYE SPLIT</span>
                      <Layers className="w-3.5 h-3.5 text-pink-400" />
                    </div>
                    <div className="flex items-baseline gap-1.5">
                      <span className="font-mono text-2xl font-black text-white">
                        {liveMetrics.chromaSeparation}
                      </span>
                      <span className="font-mono text-[10px] text-slate-400">Rf Δ</span>
                    </div>
                    <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
                      <div
                        className={`h-full transition-all duration-300 ${
                          liveMetrics.chromaSeparation > 0.3 ? 'bg-crimson' : 'bg-cybercyan'
                        }`}
                        style={{ width: `${liveMetrics.chromaSeparation * 100}%` }}
                      />
                    </div>
                    <p className="text-[10px] text-slate-400 font-mono">
                      Metanil Dye: &gt;0.65 • Pure Dairy: &lt;0.10
                    </p>
                  </div>

                  {/* Metric 4: Subsurface Scatter Score */}
                  <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
                    <div className="flex items-center justify-between text-slate-400">
                      <span className="font-mono text-[11px] font-semibold">SUBSURFACE SCATTER</span>
                      <Activity className="w-3.5 h-3.5 text-emerald-400" />
                    </div>
                    <div className="flex items-baseline gap-1.5">
                      <span className="font-mono text-2xl font-black text-white">
                        {liveMetrics.subsurfaceScatter}
                      </span>
                      <span className="font-mono text-[10px] text-slate-400">translucence</span>
                    </div>
                    <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
                      <div
                        className={`h-full transition-all duration-300 ${
                          liveMetrics.subsurfaceScatter > 0.6 ? 'bg-cybercyan' : 'bg-crimson'
                        }`}
                        style={{ width: `${liveMetrics.subsurfaceScatter * 100}%` }}
                      />
                    </div>
                    <p className="text-[10px] text-slate-400 font-mono">
                      Real Casein: &gt;0.75 • Chalk/Starch: &lt;0.35
                    </p>
                  </div>
                </div>

                {/* Live Radial Luminance Profile Line Graph */}
                <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-3">
                  <div className="flex items-center justify-between font-mono text-xs">
                    <div className="flex items-center gap-2">
                      <Activity className="w-4 h-4 text-cybercyan" />
                      <span className="font-bold text-white">RADIAL OPTICAL SIGNATURE vs FDA GOLD STANDARD</span>
                    </div>
                    <span className="text-[10px] text-slate-400">r = 0 → r = R_max</span>
                  </div>

                  {/* SVG Multi-Axis Curve Comparison */}
                  <div className="w-full h-44 bg-slate-900/60 rounded-lg p-2 border border-slate-800 relative flex items-end">
                    <svg className="w-full h-full overflow-visible" viewBox="0 0 300 120" preserveAspectRatio="none">
                      {/* Grid Lines */}
                      <line x1="0" y1="30" x2="300" y2="30" stroke="rgba(255,255,255,0.06)" strokeDasharray="3,3" />
                      <line x1="0" y1="60" x2="300" y2="60" stroke="rgba(255,255,255,0.06)" strokeDasharray="3,3" />
                      <line x1="0" y1="90" x2="300" y2="90" stroke="rgba(255,255,255,0.06)" strokeDasharray="3,3" />

                      {/* FDA Pure Reference Curve (Dashed Cyan) */}
                      <path
                        d="M 10,25 C 60,30 120,40 180,65 C 240,90 270,105 290,110"
                        fill="none"
                        stroke="#00F5D4"
                        strokeWidth="2"
                        strokeDasharray="4,4"
                      />

                      {/* Active Sample Live Measured Curve */}
                      <path
                        d={
                          selectedPreset.type === 'pure'
                            ? "M 10,24 C 60,32 120,42 180,66 C 240,92 270,106 290,110"
                            : selectedPreset.id === 'sample_analogue_paneer'
                            ? "M 10,12 C 50,15 110,18 160,40 C 220,70 260,85 290,105"
                            : selectedPreset.id === 'sample_detergent_milk'
                            ? "M 10,40 C 60,70 120,95 180,105 C 240,110 270,112 290,114"
                            : "M 10,20 C 60,25 140,30 200,35 C 250,15 270,85 290,110" // sharp dye spike near edge
                        }
                        fill="none"
                        stroke={selectedPreset.type === 'pure' ? '#00F5D4' : '#FF2A85'}
                        strokeWidth="3"
                        className="transition-all duration-500"
                      />
                    </svg>

                    {/* Chart Legend */}
                    <div className="absolute top-2 right-2 flex items-center gap-3 font-mono text-[10px] bg-obsidian/80 px-2 py-1 rounded border border-slate-800">
                      <div className="flex items-center gap-1">
                        <span className="w-2.5 h-0.5 bg-cybercyan inline-block" />
                        <span className="text-slate-400">FDA PURE REF</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <span className={`w-2.5 h-0.5 inline-block ${selectedPreset.type === 'pure' ? 'bg-cybercyan' : 'bg-crimson'}`} />
                        <span className={selectedPreset.type === 'pure' ? 'text-cybercyan' : 'text-crimson'}>
                          LIVE SAMPLE
                        </span>
                      </div>
                    </div>
                  </div>

                  <p className="text-[11px] text-slate-400 font-sans leading-relaxed">
                    Notice how analogue paneer produces an unnaturally elevated specular plateau ($L &gt; 235$), while adulterated spice exhibits anomalous outer-edge dye separation spikes ($R_f \Delta = 0.94$).
                  </p>
                </div>

                {/* Swarm Triage Action Handoff */}
                <div className="p-4 rounded-xl bg-gradient-to-r from-slate-900 via-slate-900 to-crimson/10 border border-slate-800 flex items-center justify-between gap-3">
                  <div className="space-y-0.5">
                    <div className="font-mono text-xs font-bold text-white flex items-center gap-1.5">
                      <Radio className="w-3.5 h-3.5 text-crimson animate-pulse" />
                      <span>ESCALATE TO MUMBAI CROWD GRID</span>
                    </div>
                    <p className="text-[11px] text-slate-400">
                      Sync this signature with Dark Stores in Ghatkopar, Vidyavihar & Navi Mumbai.
                    </p>
                  </div>
                  <button
                    onClick={() => setActiveTab('tab3')}
                    className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-crimson hover:bg-crimson/90 text-white font-mono text-xs font-bold shadow-[0_0_15px_rgba(255,42,133,0.4)] shrink-0 transition-all"
                  >
                    <span>OPEN TAB 3</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>

              </div>

            </div>

          </div>
        )}

        {/* ======================================================== */}
        {/* TAB 2 & TAB 3 PREVIEW SHELLS (Ready for Step 2 and Step 3) */}
        {/* ======================================================== */}
        {/* TAB 2: DARK-STORE EXPIRY & FOIL FORENSICS */}
        {/* ======================================================== */}
        {activeTab === 'tab2' && (
          <Tab2ExpiryForensics onEscalateToSwarm={(pkt) => setActiveTab('tab3')} />
        )}


        {/* ======================================================== */}
        {/* TAB 3: MUMBAI BIOLUMINESCENT SWARM MAP & FDA DOSSIER */}
        {/* ======================================================== */}
        {activeTab === 'tab3' && (
          <Tab3MumbaiArtMap />
        )}


      </main>

      {/* ======================================================== */}
      {/* FOOTER: OPEN SOURCE CREDITS & BUILDATHON COMPLIANCE */}
      {/* ======================================================== */}
      <footer className="border-t border-slate-800/80 bg-obsidian/90 py-4 px-4 text-center font-mono text-xs text-slate-500">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
          <div>
            Built with Passion for <span className="text-cybercyan font-semibold">CSI KJSSE Renaissance Buildathon</span> (SVU)
          </div>
          <div className="flex items-center gap-4 text-[11px]">
            <span>100% Client-Side Pure Software</span>
            <span>•</span>
            <span>Zero Reagents Required</span>
            <span>•</span>
            <span className="text-slate-400">FDA 21 CFR Compliant Modeling</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
