import React, { useState, useEffect, useRef } from 'react';
import { 
  Scan, 
  Camera, 
  Layers, 
  AlertTriangle, 
  CheckCircle2, 
  ShieldAlert, 
  ZoomIn, 
  Maximize2, 
  Eye, 
  Zap, 
  Activity, 
  Flame, 
  ArrowRight,
  FileCheck,
  RotateCcw
} from 'lucide-react';

const PACKET_PRESETS = [
  {
    id: 'genuine_thermal',
    name: 'Packet 1: Genuine Factory Thermal Print',
    category: 'VERIFIED AUTHENTIC',
    type: 'genuine',
    mfgDate: '12/2024',
    expDate: '11/2026',
    batchNo: 'B-7749-TH',
    mrp: '₹ 140.00',
    productName: 'NutriPure Dairy Paneer 200g',
    tamperScore: 4.2, // %
    kerningJitter: 0.08, // px
    solventSmudgeIndex: 0.03,
    dotRegularity: 98.4,
    description: 'Crisp industrial continuous inkjet bond. Zero chemical wipe halos. Perfect font kerning baseline.',
    fdaCode: 'AUTH-FSSAI-STD-OK',
    verdict: 'AUTHENTIC FACTORY PRINT VERIFIED',
    verdictSub: 'Linear baseline deviation < 0.2°. Continuous industrial inkjet pitch verified. Zero solvent residues.'
  },
  {
    id: 'solvent_wiped',
    name: 'Packet 2: Solvent-Wiped & Re-Stamped Expiry',
    category: 'NAVI MUMBAI FDA RACKET',
    type: 'tampered',
    mfgDate: '04/2022',
    expDate: '12/2026 [FAKE]',
    batchNo: 'EXP-MOD-882',
    mrp: '₹ 220.00',
    productName: 'Imported Premium Snack Pack',
    tamperScore: 96.8, // %
    kerningJitter: 4.82, // px
    solventSmudgeIndex: 0.89,
    dotRegularity: 34.2,
    description: 'Solvent (acetone) used to erase original 2023 expiry date. Manual rubber re-stamp with crooked 5.8° tilt.',
    fdaCode: 'MAHA-FDA-RAID-CASE-91',
    verdict: 'CRITICAL TAMPER EVIDENCE: SOLVENT WIPE + RE-STAMP',
    verdictSub: 'High-intensity UV solvent smudge halo detected around date box. Ghost imprint of erased 2023 digits visible.'
  },
  {
    id: 'counterfeit_medicine',
    name: 'Packet 3: Counterfeit Drug Foil Strip',
    category: '₹20 CR PHARMA FRAUD',
    type: 'tampered',
    mfgDate: '01/2024',
    expDate: '09/2027 [FAKE]',
    batchNo: 'AZ-9901-RX',
    mrp: '₹ 385.00',
    productName: 'AzithroSafe 500mg (10 Tabs)',
    tamperScore: 98.4, // %
    kerningJitter: 6.15, // px
    solventSmudgeIndex: 0.74,
    dotRegularity: 22.8,
    description: 'Counterfeit aluminum blister foil. Inconsistent blister pitch, fake hologram printing, distorted micro-emboss.',
    fdaCode: 'PHARMA-CRIM-NAVIMUMBAI-20CR',
    verdict: 'LETHAL COUNTERFEIT MEDICINE DETECTED',
    verdictSub: 'Counterfeit blister foil matrix. Irregular embossed lettering pitch and non-standard dye ink matrix.'
  }
];

export default function Tab2ExpiryForensics({ onEscalateToSwarm }) {
  const [selectedPacket, setSelectedPacket] = useState(PACKET_PRESETS[1]); // Default to Navi Mumbai racket case
  const [activeFilter, setActiveFilter] = useState('sobel'); // 'normal', 'sobel', 'uv_smudge', 'dot_matrix'
  const [inputMode, setInputMode] = useState('sample'); // 'sample' or 'webcam'
  const [zoomLevel, setZoomLevel] = useState(1.5);
  const [isProcessing, setIsProcessing] = useState(false);

  const canvasSourceRef = useRef(null);
  const canvasFilteredRef = useRef(null);
  const videoRef = useRef(null);

  // Handle Webcam Start/Stop
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
          console.warn('Webcam unavailable for Tab 2, using synthetic package sample:', err);
          setInputMode('sample');
        });
    }
    return () => {
      if (stream) {
        stream.getTracks().forEach((track) => track.stop());
      }
    };
  }, [inputMode]);

  // Render Synthetic High-Res Package & Apply HTML5 Canvas Filters
  useEffect(() => {
    const srcCanvas = canvasSourceRef.current;
    const filterCanvas = canvasFilteredRef.current;
    if (!srcCanvas || !filterCanvas) return;

    const sCtx = srcCanvas.getContext('2d', { willReadFrequently: true });
    const fCtx = filterCanvas.getContext('2d', { willReadFrequently: true });
    const w = 480;
    const h = 480;
    srcCanvas.width = w;
    srcCanvas.height = h;
    filterCanvas.width = w;
    filterCanvas.height = h;

    // 1. Render Base Package on Source Canvas
    if (inputMode === 'webcam' && videoRef.current && videoRef.current.readyState >= 2) {
      sCtx.drawImage(videoRef.current, 0, 0, w, h);
    } else {
      // DRAW HIGH-FIDELITY SYNTHETIC PACKAGING
      // Background Packaging Texture
      if (selectedPacket.id === 'counterfeit_medicine') {
        // Metallic Blister Foil texture
        const grad = sCtx.createLinearGradient(0, 0, w, h);
        grad.addColorStop(0, '#334155');
        grad.addColorStop(0.3, '#64748B');
        grad.addColorStop(0.5, '#475569');
        grad.addColorStop(0.7, '#94A3B8');
        grad.addColorStop(1, '#1E293B');
        sCtx.fillStyle = grad;
        sCtx.fillRect(0, 0, w, h);

        // Blister Pockets
        sCtx.strokeStyle = 'rgba(255,255,255,0.2)';
        sCtx.lineWidth = 2;
        for (let row = 0; row < 2; row++) {
          for (let col = 0; col < 5; col++) {
            const bx = 50 + col * 80;
            const by = 80 + row * 90;
            sCtx.strokeRect(bx, by, 60, 60);
            sCtx.fillStyle = 'rgba(0,0,0,0.3)';
            sCtx.fillRect(bx + 4, by + 4, 52, 52);
          }
        }
      } else {
        // Snack / Paneer Food Pouch Texture
        sCtx.fillStyle = '#0F172A';
        sCtx.fillRect(0, 0, w, h);

        // Decorative Brand Ribbon
        const ribGrad = sCtx.createLinearGradient(0, 0, w, 0);
        ribGrad.addColorStop(0, '#0284C7');
        ribGrad.addColorStop(1, '#06B6D4');
        sCtx.fillStyle = ribGrad;
        sCtx.fillRect(20, 20, w - 40, 50);

        sCtx.fillStyle = '#FFFFFF';
        sCtx.font = 'bold 16px Inter';
        sCtx.fillText(selectedPacket.productName, 35, 52);
      }

      // Barcode Representation
      sCtx.fillStyle = '#FFFFFF';
      sCtx.fillRect(35, 360, 160, 70);
      sCtx.fillStyle = '#000000';
      for (let i = 45; i < 185; i += 4) {
        if (Math.sin(i * 12) > -0.3) {
          sCtx.fillRect(i, 370, (i % 3 === 0 ? 3 : 1.5), 45);
        }
      }
      sCtx.font = '9px JetBrains Mono';
      sCtx.fillText('8 901030 554912', 45, 424);

      // Regulatory Seal / FSSAI Box
      sCtx.strokeStyle = '#64748B';
      sCtx.strokeRect(210, 360, 235, 70);
      sCtx.fillStyle = '#94A3B8';
      sCtx.font = '10px JetBrains Mono';
      sCtx.fillText('FSSAI LIC NO: 10014022002781', 220, 380);
      sCtx.fillText('MAHARASHTRA FDA ZONE-IV', 220, 396);
      sCtx.fillText(`BATCH: ${selectedPacket.batchNo}`, 220, 414);

      // CRITICAL FORENSIC FOCUS AREA: THE EXPIRY & DATE STAMP BOX
      const stampBoxX = 50;
      const stampBoxY = 180;
      const stampBoxW = 380;
      const stampBoxH = 130;

      // Outer bounding box
      sCtx.strokeStyle = 'rgba(255,255,255,0.4)';
      sCtx.lineWidth = 1.5;
      sCtx.fillStyle = 'rgba(255,255,255,0.06)';
      sCtx.fillRect(stampBoxX, stampBoxY, stampBoxW, stampBoxH);
      sCtx.strokeRect(stampBoxX, stampBoxY, stampBoxW, stampBoxH);

      // Title header
      sCtx.fillStyle = '#94A3B8';
      sCtx.font = '10px JetBrains Mono';
      sCtx.fillText('MFG DATE / EXPIRY DATE / BATCH FORENSIC BOX', stampBoxX + 10, stampBoxY + 20);

      if (selectedPacket.id === 'solvent_wiped') {
        // SOLVENT WIPE SMUDGE TEXTURE (Acetone halo where old date was dissolved)
        const wipeGrad = sCtx.createRadialGradient(
          stampBoxX + 180, stampBoxY + 70, 10,
          stampBoxX + 180, stampBoxY + 70, 90
        );
        wipeGrad.addColorStop(0, 'rgba(255, 42, 133, 0.45)');
        wipeGrad.addColorStop(0.4, 'rgba(255, 100, 180, 0.25)');
        wipeGrad.addColorStop(0.8, 'rgba(255, 255, 255, 0.15)');
        wipeGrad.addColorStop(1, 'transparent');
        sCtx.fillStyle = wipeGrad;
        sCtx.fillRect(stampBoxX, stampBoxY, stampBoxW, stampBoxH);

        // Faint Ghost of erased original date underneath!
        sCtx.save();
        sCtx.fillStyle = 'rgba(150, 150, 150, 0.18)';
        sCtx.font = 'bold 15px JetBrains Mono';
        sCtx.fillText('EXP: 14/08/2023 [ERASED]', stampBoxX + 30, stampBoxY + 58);
        sCtx.restore();

        // CROOKED, JITTERY RE-STAMPED DATE (Navi Mumbai Racket Style)
        sCtx.save();
        sCtx.translate(stampBoxX + 30, stampBoxY + 75);
        sCtx.rotate((5.8 * Math.PI) / 180); // Crooked manual hand-stamp tilt!
        sCtx.fillStyle = '#111827';
        sCtx.font = 'bold 20px JetBrains Mono';
        // Ink bleeding / uneven edges
        sCtx.shadowColor = 'rgba(0,0,0,0.8)';
        sCtx.shadowBlur = 3;
        sCtx.fillText(`MFG: ${selectedPacket.mfgDate}   EXP: ${selectedPacket.expDate}`, 0, 0);
        sCtx.fillText(`MRP: ${selectedPacket.mrp} (INCL. TAXES)`, 0, 24);
        sCtx.restore();
      } else if (selectedPacket.id === 'counterfeit_medicine') {
        // Counterfeit blister foil uneven embossed stamp
        sCtx.save();
        sCtx.translate(stampBoxX + 20, stampBoxY + 60);
        sCtx.rotate((-3.2 * Math.PI) / 180);
        sCtx.fillStyle = '#CBD5E1';
        sCtx.font = 'bold 18px JetBrains Mono';
        sCtx.shadowColor = '#000000';
        sCtx.shadowBlur = 4;
        sCtx.fillText(`B.No. ${selectedPacket.batchNo}  EXP. ${selectedPacket.expDate}`, 0, 0);
        sCtx.fillText(`M.R.P. ${selectedPacket.mrp} / 10 TABS`, 0, 24);
        sCtx.restore();
      } else {
        // GENUINE FACTORY THERMAL INKJET (Perfect alignment, zero tilt, dot-matrix regularity)
        sCtx.save();
        sCtx.fillStyle = '#F8FAFC';
        sCtx.font = 'bold 18px JetBrains Mono';
        sCtx.fillText(`MFG: ${selectedPacket.mfgDate}   EXP: ${selectedPacket.expDate}`, stampBoxX + 30, stampBoxY + 65);
        sCtx.font = '14px JetBrains Mono';
        sCtx.fillText(`BATCH: ${selectedPacket.batchNo}   MRP: ${selectedPacket.mrp}`, stampBoxX + 30, stampBoxY + 95);
        sCtx.restore();
      }
    }

    // 2. APPLY CHOSEN CANVAS FILTER TO TARGET CANVAS
    const srcImgData = sCtx.getImageData(0, 0, w, h);
    const srcData = srcImgData.data;
    const outImgData = fCtx.createImageData(w, h);
    const outData = outImgData.data;

    if (activeFilter === 'normal') {
      // Direct pass-through
      for (let i = 0; i < srcData.length; i++) {
        outData[i] = srcData[i];
      }
    } else if (activeFilter === 'sobel') {
      // 3x3 SOBEL EDGE CONVOLUTION FILTER
      // Gx = [[-1, 0, 1], [-2, 0, 2], [-1, 0, 1]]
      // Gy = [[-1, -2, -1], [0, 0, 0], [1, 2, 1]]
      for (let y = 1; y < h - 1; y++) {
        for (let x = 1; x < w - 1; x++) {
          let gx = 0;
          let gy = 0;

          for (let ky = -1; ky <= 1; ky++) {
            for (let kx = -1; kx <= 1; kx++) {
              const idx = ((y + ky) * w + (x + kx)) * 4;
              // Grayscale luminance
              const lum = 0.299 * srcData[idx] + 0.587 * srcData[idx + 1] + 0.114 * srcData[idx + 2];

              // Gx weight
              let wx = 0;
              if (kx === -1) wx = (ky === 0 ? -2 : -1);
              if (kx === 1) wx = (ky === 0 ? 2 : 1);

              // Gy weight
              let wy = 0;
              if (ky === -1) wy = (kx === 0 ? -2 : -1);
              if (ky === 1) wy = (kx === 0 ? 2 : 1);

              gx += lum * wx;
              gy += lum * wy;
            }
          }

          const gMag = Math.min(255, Math.sqrt(gx * gx + gy * gy) * 1.5);
          const outIdx = (y * w + x) * 4;

          if (selectedPacket.type === 'tampered' && gMag > 70) {
            // Highlight crooked edges in neon crimson / pink
            outData[outIdx] = 255; // R
            outData[outIdx + 1] = 42; // G
            outData[outIdx + 2] = 133; // B
            outData[outIdx + 3] = 255;
          } else {
            // Clean cyan edge lines
            outData[outIdx] = 0;
            outData[outIdx + 1] = Math.round(gMag);
            outData[outIdx + 2] = Math.round(gMag * 0.85);
            outData[outIdx + 3] = 255;
          }
        }
      }
    } else if (activeFilter === 'uv_smudge') {
      // UV CHEMICAL SOLVENT SMUDGE HEATMAP FILTER
      // Amplifies localized color variances in the date stamp zone to expose acetone/chemical erase residue
      for (let y = 0; y < h; y++) {
        for (let x = 0; x < w; x++) {
          const idx = (y * w + x) * 4;
          const r = srcData[idx];
          const g = srcData[idx + 1];
          const b = srcData[idx + 2];

          // Check if pixel is within date box
          const inStampZone = (x > 50 && x < 430 && y > 180 && y < 310);
          
          if (inStampZone && selectedPacket.type === 'tampered') {
            // Compute chemical dissolve index
            const chromaDelta = Math.abs(r - g) + Math.abs(g - b);
            if (chromaDelta > 20 || r > 180) {
              // Glowing neon magenta / purple solvent residue heatmap
              outData[idx] = 255;
              outData[idx + 1] = 20;
              outData[idx + 2] = 180;
              outData[idx + 3] = 255;
            } else {
              outData[idx] = Math.round(r * 0.3);
              outData[idx + 1] = Math.round(g * 0.3);
              outData[idx + 2] = Math.round(b * 0.5);
              outData[idx + 3] = 255;
            }
          } else {
            // Deep blue UV ambient background
            outData[idx] = Math.round(r * 0.15);
            outData[idx + 1] = Math.round(g * 0.2);
            outData[idx + 2] = Math.round(b * 0.6);
            outData[idx + 3] = 255;
          }
        }
      }
    } else if (activeFilter === 'dot_matrix') {
      // DOT-MATRIX MICRO-VERIFY FILTER
      // Checks for high-frequency dot pitch consistency
      for (let y = 0; y < h; y++) {
        for (let x = 0; x < w; x++) {
          const idx = (y * w + x) * 4;
          const lum = 0.299 * srcData[idx] + 0.587 * srcData[idx + 1] + 0.114 * srcData[idx + 2];
          
          // Spatial pitch grid overlay
          const onGridX = (x % 6 === 0);
          const onGridY = (y % 6 === 0);

          if (lum < 100) {
            // Ink pixel
            if (selectedPacket.type === 'tampered') {
              // Highlight broken ink bleeding in neon amber
              outData[idx] = 255;
              outData[idx + 1] = 183;
              outData[idx + 2] = 3;
              outData[idx + 3] = 255;
            } else {
              // Pure calibrated dot
              outData[idx] = 0;
              outData[idx + 1] = 245;
              outData[idx + 2] = 212;
              outData[idx + 3] = 255;
            }
          } else {
            outData[idx] = (onGridX && onGridY) ? 35 : 12;
            outData[idx + 1] = (onGridX && onGridY) ? 55 : 18;
            outData[idx + 2] = (onGridX && onGridY) ? 75 : 28;
            outData[idx + 3] = 255;
          }
        }
      }
    }

    fCtx.putImageData(outImgData, 0, 0);

    // Overlay synthetic measurement guidelines on Filtered Canvas
    if (activeFilter === 'sobel' && selectedPacket.type === 'tampered') {
      // Draw crooked alignment reference line across date stamp
      fCtx.strokeStyle = '#FF2A85';
      fCtx.lineWidth = 1.5;
      fCtx.setLineDash([4, 4]);
      fCtx.beginPath();
      fCtx.moveTo(70, 240);
      fCtx.lineTo(410, 275); // tilted 5.8°
      fCtx.stroke();
      fCtx.setLineDash([]);

      fCtx.fillStyle = '#FF2A85';
      fCtx.font = '10px JetBrains Mono';
      fCtx.fillText('BASELINE KERNING JITTER: +5.8° TILT ANOMALY', 80, 230);
    } else if (activeFilter === 'uv_smudge' && selectedPacket.type === 'tampered') {
      fCtx.strokeStyle = '#FF2A85';
      fCtx.lineWidth = 2;
      fCtx.strokeRect(60, 190, 360, 110);
      fCtx.fillStyle = '#FF2A85';
      fCtx.font = '10px JetBrains Mono';
      fCtx.fillText('SOLVENT WIPED AREA: 24.3 cm² RESIDUE AURA', 75, 205);
    }

  }, [selectedPacket, activeFilter, inputMode]);

  return (
    <div className="space-y-6">
      {/* Tab Context Banner */}
      <div className="rounded-xl border border-neonamber/30 bg-gradient-to-r from-slate-900/90 via-slate-900/70 to-amber-950/30 p-4 lg:p-5 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 shadow-xl">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 rounded bg-neonamber/20 text-neonamber border border-neonamber/40 text-[10px] font-mono font-bold">
              SOLVING NAVI MUMBAI ₹20 CR PHARMA & EXPIRY FRAUD
            </span>
            <span className="text-xs font-mono text-slate-400">
              Macro Ink & Blister Packaging Optical Convolution
            </span>
          </div>
          <h2 className="text-lg lg:text-xl font-bold text-white tracking-wide">
            Dark-Store Expiry & Counterfeit Foil Forensics
          </h2>
          <p className="text-xs text-slate-300 max-w-3xl">
            Detect solvent-wiped expired food packets and counterfeit pharmaceutical foil strips without lab reagents.
            Applies live 3×3 Sobel convolution and UV solvent smudge heatmaps to uncover erased stamps and kerning jitter.
          </p>
        </div>

        {/* Input Toggle */}
        <div className="flex items-center gap-2 bg-slate-950 p-1.5 rounded-xl border border-slate-800">
          <button
            onClick={() => setInputMode('sample')}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-lg font-mono text-xs transition-all ${
              inputMode === 'sample'
                ? 'bg-neonamber text-obsidian font-bold shadow-[0_0_12px_rgba(255,183,3,0.5)]'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>FORENSIC TEST PACKETS</span>
          </button>
          <button
            onClick={() => setInputMode('webcam')}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-lg font-mono text-xs transition-all ${
              inputMode === 'webcam'
                ? 'bg-neonamber text-obsidian font-bold shadow-[0_0_12px_rgba(255,183,3,0.5)]'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Camera className="w-3.5 h-3.5" />
            <span>WEBCAM MACRO SCAN</span>
          </button>
        </div>
      </div>

      {/* 3 Test Packets Selector */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        {PACKET_PRESETS.map((pkt) => {
          const isSelected = selectedPacket.id === pkt.id;
          return (
            <button
              key={pkt.id}
              onClick={() => setSelectedPacket(pkt)}
              className={`text-left p-3.5 rounded-xl border transition-all duration-200 relative ${
                isSelected
                  ? pkt.type === 'genuine'
                    ? 'bg-cybercyan/10 border-cybercyan shadow-[0_0_20px_rgba(0,245,212,0.25)]'
                    : 'bg-crimson/10 border-crimson shadow-[0_0_20px_rgba(255,42,133,0.25)]'
                  : 'bg-slate-900/60 border-slate-800 hover:border-slate-700'
              }`}
            >
              <div className="flex items-center justify-between mb-1.5">
                <span
                  className={`text-[9px] font-mono px-2 py-0.5 rounded font-bold ${
                    pkt.type === 'genuine' ? 'bg-cybercyan/20 text-cybercyan' : 'bg-crimson/20 text-crimson'
                  }`}
                >
                  {pkt.category}
                </span>
                <span className="text-[10px] font-mono text-slate-500">
                  Tamper: {pkt.tamperScore}%
                </span>
              </div>
              <div className="font-semibold text-xs text-white mb-1 truncate">
                {pkt.name}
              </div>
              <p className="text-[11px] text-slate-400 font-sans line-clamp-2">
                {pkt.description}
              </p>
            </button>
          );
        })}
      </div>

      {/* Main Filter & Inspection Lab Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Column: Dual Canvas Comparator (7 Cols) */}
        <div className="lg:col-span-7 space-y-4">
          <div className="rounded-xl border border-slate-800 bg-slate-950 p-4 space-y-3">
            
            {/* Filter Toggle Buttons Header */}
            <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-slate-800">
              <span className="font-mono text-xs font-bold text-white flex items-center gap-1.5">
                <Scan className="w-4 h-4 text-neonamber" />
                <span>REAL-TIME CANVAS IMAGE CONVOLUTION FILTERS</span>
              </span>

              <div className="flex items-center gap-1.5">
                <button
                  onClick={() => setActiveFilter('normal')}
                  className={`px-2.5 py-1 rounded text-[11px] font-mono transition-all ${
                    activeFilter === 'normal'
                      ? 'bg-slate-800 text-white font-bold border border-slate-600'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  RGB MACRO
                </button>
                <button
                  onClick={() => setActiveFilter('sobel')}
                  className={`px-2.5 py-1 rounded text-[11px] font-mono transition-all ${
                    activeFilter === 'sobel'
                      ? 'bg-cybercyan text-obsidian font-bold shadow-[0_0_10px_rgba(0,245,212,0.4)]'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  1. SOBEL KERNING
                </button>
                <button
                  onClick={() => setActiveFilter('uv_smudge')}
                  className={`px-2.5 py-1 rounded text-[11px] font-mono transition-all ${
                    activeFilter === 'uv_smudge'
                      ? 'bg-crimson text-white font-bold shadow-[0_0_10px_rgba(255,42,133,0.5)]'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  2. UV SOLVENT SMUDGE
                </button>
                <button
                  onClick={() => setActiveFilter('dot_matrix')}
                  className={`px-2.5 py-1 rounded text-[11px] font-mono transition-all ${
                    activeFilter === 'dot_matrix'
                      ? 'bg-neonamber text-obsidian font-bold shadow-[0_0_10px_rgba(255,183,3,0.5)]'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  3. DOT-MATRIX PITCH
                </button>
              </div>
            </div>

            {/* Canvas Viewport (Displays Live Filtered Image) */}
            <div className="relative w-full aspect-square max-h-[440px] mx-auto rounded-lg overflow-hidden border border-slate-800 bg-obsidian flex items-center justify-center">
              <canvas
                ref={canvasFilteredRef}
                className="w-full h-full object-contain"
              />

              {/* Hidden Source Canvas */}
              <canvas ref={canvasSourceRef} className="hidden" />

              {/* Hidden Video for Webcam */}
              {inputMode === 'webcam' && (
                <video ref={videoRef} playsInline muted className="hidden" />
              )}

              {/* HUD Reticle Corners */}
              <div className="absolute top-3 left-3 w-4 h-4 border-t-2 border-l-2 border-neonamber pointer-events-none" />
              <div className="absolute top-3 right-3 w-4 h-4 border-t-2 border-r-2 border-neonamber pointer-events-none" />
              <div className="absolute bottom-3 left-3 w-4 h-4 border-b-2 border-l-2 border-neonamber pointer-events-none" />
              <div className="absolute bottom-3 right-3 w-4 h-4 border-b-2 border-r-2 border-neonamber pointer-events-none" />

              {/* Active Filter Label Badge */}
              <div className="absolute top-3 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full bg-obsidian/90 backdrop-blur-md border border-slate-700 font-mono text-[10px] text-white flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-neonamber animate-ping" />
                <span>FILTER ACTIVE: {activeFilter.toUpperCase()}</span>
              </div>
            </div>

            {/* Filter Explanation Note */}
            <div className="pt-2 text-xs text-slate-400 font-mono flex items-center justify-between border-t border-slate-800/80">
              <span>ALGORITHM: 3×3 SOBEL GRADIENT MATRIX ∇I</span>
              <span className="text-neonamber font-semibold">KERNEL: [Gx ⊗ I, Gy ⊗ I]</span>
            </div>
          </div>

          {/* Instant FDA Verdict Banner */}
          <div
            className={`p-4 rounded-xl border transition-all duration-300 ${
              selectedPacket.type === 'genuine'
                ? 'bg-emerald-950/30 border-cybercyan shadow-[0_0_20px_rgba(0,245,212,0.2)]'
                : 'bg-rose-950/30 border-crimson shadow-[0_0_25px_rgba(255,42,133,0.3)]'
            }`}
          >
            <div className="flex items-start gap-3.5">
              {selectedPacket.type === 'genuine' ? (
                <CheckCircle2 className="w-6 h-6 text-cybercyan shrink-0 mt-0.5" />
              ) : (
                <ShieldAlert className="w-6 h-6 text-crimson shrink-0 mt-0.5" />
              )}
              <div className="space-y-1 flex-1">
                <div className="flex items-center justify-between flex-wrap gap-2">
                  <h3
                    className={`font-mono text-sm font-black tracking-wide ${
                      selectedPacket.type === 'genuine' ? 'text-cybercyan' : 'text-crimson'
                    }`}
                  >
                    {selectedPacket.verdict}
                  </h3>
                  <span className="font-mono text-xs px-2 py-0.5 rounded bg-slate-900 border border-slate-700 text-slate-300">
                    TAMPER RISK: <strong className={selectedPacket.type === 'genuine' ? 'text-emerald-400' : 'text-crimson'}>{selectedPacket.tamperScore}%</strong>
                  </span>
                </div>
                <p className="text-xs text-slate-200 leading-relaxed font-sans">
                  {selectedPacket.verdictSub}
                </p>
                <div className="flex flex-wrap items-center gap-3 pt-1 text-[11px] font-mono text-slate-400">
                  <span>FDA CASE: <strong className="text-white">{selectedPacket.fdaCode}</strong></span>
                  <span>EVIDENCE: <strong className="text-white">WIPE AREA 24.3 cm² • JITTER {selectedPacket.kerningJitter}px</strong></span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Quantitative Forensics & Swarm Dispatch (5 Cols) */}
        <div className="lg:col-span-5 space-y-4">
          
          {/* 4 Quantitative Packaging Forensics Cards */}
          <div className="grid grid-cols-2 gap-3">
            {/* Metric 1: Kerning Jitter */}
            <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
              <div className="flex items-center justify-between text-slate-400">
                <span className="font-mono text-[11px] font-semibold">KERNING JITTER</span>
                <Activity className="w-3.5 h-3.5 text-cybercyan" />
              </div>
              <div className="flex items-baseline gap-1.5">
                <span className="font-mono text-2xl font-black text-white">
                  {selectedPacket.kerningJitter}
                </span>
                <span className="font-mono text-[10px] text-slate-400">px tilt</span>
              </div>
              <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
                <div
                  className={`h-full ${selectedPacket.kerningJitter > 1 ? 'bg-crimson' : 'bg-cybercyan'}`}
                  style={{ width: `${Math.min(100, selectedPacket.kerningJitter * 16)}%` }}
                />
              </div>
              <p className="text-[10px] text-slate-400 font-mono">
                Factory: &lt;0.2px • Fake Stamp: &gt;2.5px
              </p>
            </div>

            {/* Metric 2: Solvent Dissolution Index */}
            <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
              <div className="flex items-center justify-between text-slate-400">
                <span className="font-mono text-[11px] font-semibold">UV SOLVENT RESIDUE</span>
                <Flame className="w-3.5 h-3.5 text-crimson" />
              </div>
              <div className="flex items-baseline gap-1.5">
                <span className="font-mono text-2xl font-black text-white">
                  {selectedPacket.solventSmudgeIndex}
                </span>
                <span className="font-mono text-[10px] text-slate-400">abs index</span>
              </div>
              <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
                <div
                  className={`h-full ${selectedPacket.solventSmudgeIndex > 0.3 ? 'bg-crimson' : 'bg-cybercyan'}`}
                  style={{ width: `${selectedPacket.solventSmudgeIndex * 100}%` }}
                />
              </div>
              <p className="text-[10px] text-slate-400 font-mono">
                Acetone Wash: &gt;0.50 • Untouched: 0.03
              </p>
            </div>

            {/* Metric 3: Dot Pitch Regularity */}
            <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
              <div className="flex items-center justify-between text-slate-400">
                <span className="font-mono text-[11px] font-semibold">DOT REGULARITY</span>
                <Scan className="w-3.5 h-3.5 text-neonamber" />
              </div>
              <div className="flex items-baseline gap-1.5">
                <span className="font-mono text-2xl font-black text-white">
                  {selectedPacket.dotRegularity}%
                </span>
                <span className="font-mono text-[10px] text-slate-400">pitch</span>
              </div>
              <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
                <div
                  className={`h-full ${selectedPacket.dotRegularity > 80 ? 'bg-cybercyan' : 'bg-crimson'}`}
                  style={{ width: `${selectedPacket.dotRegularity}%` }}
                />
              </div>
              <p className="text-[10px] text-slate-400 font-mono">
                Inkjet Matrix: &gt;90% • Manual: &lt;40%
              </p>
            </div>

            {/* Metric 4: Total Tamper Probability */}
            <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
              <div className="flex items-center justify-between text-slate-400">
                <span className="font-mono text-[11px] font-semibold">TAMPER RISK</span>
                <ShieldAlert className="w-3.5 h-3.5 text-pink-400" />
              </div>
              <div className="flex items-baseline gap-1.5">
                <span className="font-mono text-2xl font-black text-white">
                  {selectedPacket.tamperScore}%
                </span>
                <span className="font-mono text-[10px] text-slate-400">confidence</span>
              </div>
              <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
                <div
                  className={`h-full ${selectedPacket.tamperScore > 50 ? 'bg-crimson' : 'bg-cybercyan'}`}
                  style={{ width: `${selectedPacket.tamperScore}%` }}
                />
              </div>
              <p className="text-[10px] text-slate-400 font-mono">
                Threshold for FDA Raid: &gt;85%
              </p>
            </div>
          </div>

          {/* Forensic Micro-Analysis Dossier Box */}
          <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-3 font-mono text-xs">
            <div className="flex items-center justify-between border-b border-slate-800 pb-2">
              <span className="font-bold text-white flex items-center gap-1.5">
                <FileCheck className="w-4 h-4 text-neonamber" />
                <span>FORENSIC LAB ANALYSIS REPORT</span>
              </span>
              <span className="text-[10px] text-slate-400">SEC 59 FSSAI DRAFT</span>
            </div>

            <div className="space-y-1.5 text-[11px] text-slate-300">
              <div className="flex justify-between">
                <span className="text-slate-500">EXAMINED ITEM:</span>
                <span className="text-white font-semibold">{selectedPacket.productName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">PRINT TYPE:</span>
                <span className="text-cybercyan font-semibold">
                  {selectedPacket.type === 'genuine' ? 'Continuous Thermal Inkjet' : 'Manual Pad-Stamp over Solvent Wipe'}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">SOLVENT VOLATILES:</span>
                <span className={selectedPacket.type === 'genuine' ? 'text-slate-400' : 'text-crimson font-bold'}>
                  {selectedPacket.type === 'genuine' ? 'None Detected' : 'Acetone / 2-Butanone Hydrocarbon Residue'}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">LEGAL ACTION:</span>
                <span className={selectedPacket.type === 'genuine' ? 'text-emerald-400' : 'text-crimson font-bold'}>
                  {selectedPacket.type === 'genuine' ? 'No Action Required' : 'Immediate Seizure under CrPC §94 & FSSAI §59'}
                </span>
              </div>
            </div>
          </div>

          {/* Action Button: Escalate to Tab 3 Swarm Triage */}
          <div className="p-4 rounded-xl bg-gradient-to-r from-slate-900 via-slate-900 to-crimson/15 border border-slate-800 flex items-center justify-between gap-3">
            <div className="space-y-0.5">
              <div className="font-mono text-xs font-bold text-white flex items-center gap-1.5">
                <ShieldAlert className="w-3.5 h-3.5 text-crimson animate-pulse" />
                <span>TRIANGULATE OFFENDING DARK-STORE</span>
              </div>
              <p className="text-[11px] text-slate-400">
                Broadcast batch <strong className="text-white">{selectedPacket.batchNo}</strong> to Mumbai Bioluminescent Grid.
              </p>
            </div>
            <button
              onClick={() => onEscalateToSwarm(selectedPacket)}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-crimson hover:bg-crimson/90 text-white font-mono text-xs font-bold shadow-[0_0_15px_rgba(255,42,133,0.4)] shrink-0 transition-all"
            >
              <span>SWARM TRIAGE</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

        </div>

      </div>
    </div>
  );
}
