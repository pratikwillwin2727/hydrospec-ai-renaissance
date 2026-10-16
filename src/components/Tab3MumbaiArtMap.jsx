import React, { useState, useEffect, useRef } from 'react';
import { 
  Radio, 
  MapPin, 
  AlertTriangle, 
  ShieldCheck, 
  ShieldAlert, 
  Clock, 
  Users, 
  FileText, 
  Printer, 
  Send, 
  Sparkles, 
  Activity, 
  Compass, 
  CheckCircle2, 
  Flame, 
  Zap, 
  Hash, 
  Building2, 
  Navigation,
  Download
} from 'lucide-react';
import confetti from 'canvas-confetti';

// ==========================================
// MUMBAI NEIGHBORHOOD NODES DATA
// ==========================================
const MUMBAI_NODES = [
  {
    id: 'vidyavihar',
    name: 'Vidyavihar (KJSSE)',
    subtitle: 'Somaiya Vidyavihar University',
    x: 420,
    y: 280,
    status: 'hotspot', // hotspot due to recent swarm alerts
    contaminationScore: 84, // 0 - 100
    citizenScansToday: 142,
    badBatchesCount: 4,
    darkStoreName: 'Dark Store Hub #402 (LBS Marg)',
    lastBatchHash: '0x9E72...F14A',
    threat: 'Analogue Paneer (Palm Oil + Starch)',
    safeZone: false
  },
  {
    id: 'ghatkopar',
    name: 'Ghatkopar West',
    subtitle: 'R-City & Station Transit Hub',
    x: 440,
    y: 230,
    status: 'hotspot',
    contaminationScore: 92,
    citizenScansToday: 218,
    badBatchesCount: 6,
    darkStoreName: 'Zepto / Blinkit Supply Warehouse #11',
    lastBatchHash: '0x3C81...AA09',
    threat: 'Solvent-Wiped Expired Snacks + Urea Milk',
    safeZone: false
  },
  {
    id: 'sion',
    name: 'Sion Circle',
    subtitle: 'GTB Nagar & Transit Junction',
    x: 370,
    y: 330,
    status: 'safe',
    contaminationScore: 12,
    citizenScansToday: 98,
    badBatchesCount: 0,
    darkStoreName: 'Sion Central Dairy Cooperative',
    lastBatchHash: '0xAA11...44B2',
    threat: 'None. All samples verified pure.',
    safeZone: true
  },
  {
    id: 'dadar',
    name: 'Dadar Central',
    subtitle: 'Flower Market & Shivaji Park',
    x: 330,
    y: 390,
    status: 'safe',
    contaminationScore: 16,
    citizenScansToday: 340,
    badBatchesCount: 1,
    darkStoreName: 'Dadar Food Terminal #03',
    lastBatchHash: '0x55E2...99B1',
    threat: 'Isolated spice sample under review.',
    safeZone: true
  },
  {
    id: 'bandra',
    name: 'Bandra West',
    subtitle: 'Linking Road & Bandra Reclamation',
    x: 270,
    y: 340,
    status: 'safe',
    contaminationScore: 9,
    citizenScansToday: 275,
    badBatchesCount: 0,
    darkStoreName: 'Bandra Organic Supermart Depot',
    lastBatchHash: '0x22F4...DD81',
    threat: 'None. Gold Standard Reference.',
    safeZone: true
  },
  {
    id: 'andheri',
    name: 'Andheri East',
    subtitle: 'MIDC Industrial Corridor',
    x: 310,
    y: 200,
    status: 'warning',
    contaminationScore: 48,
    citizenScansToday: 189,
    badBatchesCount: 2,
    darkStoreName: 'Western Express Quick-Drop #18',
    lastBatchHash: '0x77B9...3301',
    threat: 'Adulterated Turmeric Metanil Dye trace.',
    safeZone: false
  },
  {
    id: 'malad',
    name: 'Malad Link Road',
    subtitle: 'Inorbit & Mindspace Sector',
    x: 260,
    y: 130,
    status: 'safe',
    contaminationScore: 18,
    citizenScansToday: 164,
    badBatchesCount: 0,
    darkStoreName: 'North Mumbai Depot #07',
    lastBatchHash: '0x1188...EE44',
    threat: 'None. Certified dairy pipeline.',
    safeZone: true
  },
  {
    id: 'navimumbai',
    name: 'Navi Mumbai (Vashi)',
    subtitle: 'APMC Grain & Pharma Market',
    x: 550,
    y: 310,
    status: 'hotspot',
    contaminationScore: 96,
    citizenScansToday: 312,
    badBatchesCount: 8,
    darkStoreName: 'APMC Sector 19 Cold Storage #09',
    lastBatchHash: '0xFE83...10B9',
    threat: '₹20 Cr Counterfeit Drug Foil + Re-Stamped Expiry',
    safeZone: false
  }
];

// Supply chain connection links
const NETWORK_EDGES = [
  ['navimumbai', 'ghatkopar'], // Contaminated distribution route!
  ['ghatkopar', 'vidyavihar'], // Contaminated spillover to KJSSE area!
  ['vidyavihar', 'sion'],
  ['sion', 'dadar'],
  ['dadar', 'bandra'],
  ['bandra', 'andheri'],
  ['andheri', 'malad'],
  ['andheri', 'ghatkopar']
];

export default function Tab3MumbaiArtMap({ initialBatch }) {
  const [selectedNode, setSelectedNode] = useState(MUMBAI_NODES[0]); // Default to Vidyavihar (KJSSE)
  const [swarmTriggered, setSwarmTriggered] = useState(false);
  const [swarmSeconds, setSwarmSeconds] = useState(15.1 * 86400); // 15.1 days in seconds
  const [isSwarmRunning, setIsSwarmRunning] = useState(false);
  const [showDossierModal, setShowDossierModal] = useState(false);
  const [citizenReports, setCitizenReports] = useState([]);

  const canvasRef = useRef(null);
  const animationFrameRef = useRef(null);

  // Trigger Citizen Swarm Triage Simulation
  const handleTriggerSwarm = () => {
    setIsSwarmRunning(true);
    setSwarmTriggered(true);

    // Blast celebratory / alert cyber confetti
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#00F5D4', '#FF2A85', '#FFB703']
    });

    // Populate 5 Rapid Citizen Reports in Vidyavihar & Ghatkopar
    setCitizenReports([
      {
        id: 'CR-101',
        user: 'Citizen #892 (Somaiya KJSSE Canteen)',
        location: 'Vidyavihar East',
        item: 'Paneer Butter Masala (Raw Sample)',
        result: 'Palm Oil Lipid Sheen (Gloss: 0.88)',
        time: '2 mins ago',
        verdict: 'FAIL - ANALOGUE PANEER'
      },
      {
        id: 'CR-102',
        user: 'Citizen #414 (Ghatkopar Station Dairy)',
        location: 'Ghatkopar West',
        item: 'Pouch Milk 500ml',
        result: 'Surface Tension Collapse (γ = 26.2 mN/m)',
        time: '4 mins ago',
        verdict: 'FAIL - DETERGENT / UREA'
      },
      {
        id: 'CR-103',
        user: 'Citizen #729 (Tilak Nagar Mart)',
        location: 'Vidyavihar South',
        item: 'Imported Snack Box',
        result: 'Acetone Wipe Smudge + Crooked 5.8° Stamp',
        time: '7 mins ago',
        verdict: 'FAIL - EXPIRED RE-STAMP'
      },
      {
        id: 'CR-104',
        user: 'Citizen #305 (Ghatkopar West Depot)',
        location: 'LBS Marg Hub',
        item: 'Malai Paneer Slab',
        result: 'Starch Subsurface Deficit (Scatter: 0.28)',
        time: '8 mins ago',
        verdict: 'FAIL - SYNTHETIC STARCH'
      },
      {
        id: 'CR-105',
        user: 'Citizen #612 (Vashi APMC Transit)',
        location: 'Navi Mumbai Sector 19',
        item: 'Azithromycin Blister Pack',
        result: 'Counterfeit Emboss Foil & Dot Pitch Error',
        time: '10 mins ago',
        verdict: 'FAIL - FAKE PHARMA FOIL'
      }
    ]);
  };

  // Swarm Countdown Animation: Drops from 15.1 Days to 12.0 Seconds!
  useEffect(() => {
    let timer;
    if (isSwarmRunning) {
      let currentVal = 15.1 * 86400; // 1,304,640 seconds
      timer = setInterval(() => {
        currentVal = Math.max(12, currentVal * 0.45);
        setSwarmSeconds(currentVal);
        if (currentVal <= 12.1) {
          clearInterval(timer);
          setIsSwarmRunning(false);
          setShowDossierModal(true);
        }
      }, 100);
    }
    return () => clearInterval(timer);
  }, [isSwarmRunning]);

  // Living Bioluminescent Mumbai Map 60FPS Canvas Animation
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const width = 640;
    const height = 500;
    canvas.width = width;
    canvas.height = height;

    // Background floating bioluminescent plankton spores
    const spores = [];
    for (let i = 0; i < 45; i++) {
      spores.push({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.4,
        vy: (Math.random() - 0.5) * 0.4,
        radius: 1 + Math.random() * 2,
        alpha: 0.2 + Math.random() * 0.6,
        color: Math.random() > 0.4 ? '#00F5D4' : '#FF2A85'
      });
    }

    let frame = 0;

    const render = () => {
      frame++;
      ctx.fillStyle = '#06080F';
      ctx.fillRect(0, 0, width, height);

      // Draw stylized Mumbai Coastline Silhouette & Arabian Sea Water Glow
      ctx.fillStyle = 'rgba(0, 245, 212, 0.02)';
      ctx.beginPath();
      ctx.moveTo(180, 0);
      ctx.bezierCurveTo(240, 150, 220, 280, 260, 360);
      ctx.bezierCurveTo(280, 420, 320, 480, 340, 500);
      ctx.lineTo(0, 500);
      ctx.lineTo(0, 0);
      ctx.fill();

      // Draw subtle grid
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.03)';
      ctx.lineWidth = 1;
      for (let x = 0; x < width; x += 40) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, height);
        ctx.stroke();
      }
      for (let y = 0; y < height; y += 40) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(width, y);
        ctx.stroke();
      }

      // Update and draw floating bioluminescent spores
      spores.forEach((s) => {
        s.x += s.vx;
        s.y += s.vy;
        if (s.x < 0) s.x = width;
        if (s.x > width) s.x = 0;
        if (s.y < 0) s.y = height;
        if (s.y > height) s.y = 0;

        ctx.beginPath();
        ctx.arc(s.x, s.y, s.radius, 0, Math.PI * 2);
        ctx.fillStyle = s.color;
        ctx.globalAlpha = s.alpha * (0.6 + Math.sin(frame * 0.03 + s.x) * 0.4);
        ctx.fill();
        ctx.globalAlpha = 1.0;
      });

      // Draw Supply Chain Interconnection Links
      NETWORK_EDGES.forEach(([fromId, toId]) => {
        const fromNode = MUMBAI_NODES.find((n) => n.id === fromId);
        const toNode = MUMBAI_NODES.find((n) => n.id === toId);
        if (!fromNode || !toNode) return;

        const isContaminatedRoute = (!fromNode.safeZone && !toNode.safeZone);

        ctx.beginPath();
        ctx.moveTo(fromNode.x, fromNode.y);
        ctx.lineTo(toNode.x, toNode.y);

        if (isContaminatedRoute) {
          // Crimson pulsing supply line of contaminated stock
          ctx.strokeStyle = 'rgba(255, 42, 133, 0.6)';
          ctx.lineWidth = 2.5;
          ctx.setLineDash([6, 6]);
          ctx.lineDashOffset = -frame * 0.8; // animated moving dash flow!
          ctx.stroke();
          ctx.setLineDash([]);

          // Animated spore payload traveling down the supply line
          const progress = (frame * 0.015) % 1;
          const px = fromNode.x + (toNode.x - fromNode.x) * progress;
          const py = fromNode.y + (toNode.y - fromNode.y) * progress;
          ctx.beginPath();
          ctx.arc(px, py, 3.5, 0, Math.PI * 2);
          ctx.fillStyle = '#FF2A85';
          ctx.shadowColor = '#FF2A85';
          ctx.shadowBlur = 10;
          ctx.fill();
          ctx.shadowBlur = 0;
        } else {
          // Calm cyan bioluminescent coral network line
          ctx.strokeStyle = 'rgba(0, 245, 212, 0.25)';
          ctx.lineWidth = 1.5;
          ctx.stroke();
        }
      });

      // Draw Neighborhood Nodes
      MUMBAI_NODES.forEach((node) => {
        const isSelected = selectedNode.id === node.id;
        const isHotspot = !node.safeZone;

        // Expanding Bio-Spore Waves around Hotspots (Vidyavihar & Ghatkopar)
        if (isHotspot) {
          const waveRadius = 18 + ((frame * 0.6 + node.x) % 36);
          const waveAlpha = Math.max(0, 1 - waveRadius / 54);
          ctx.beginPath();
          ctx.arc(node.x, node.y, waveRadius, 0, Math.PI * 2);
          ctx.strokeStyle = `rgba(255, 42, 133, ${waveAlpha * 0.8})`;
          ctx.lineWidth = 1.5;
          ctx.stroke();
        } else {
          // Calm breathing cyan halo
          const cyanPulse = 14 + Math.sin(frame * 0.05 + node.y) * 4;
          ctx.beginPath();
          ctx.arc(node.x, node.y, cyanPulse, 0, Math.PI * 2);
          ctx.strokeStyle = 'rgba(0, 245, 212, 0.25)';
          ctx.lineWidth = 1;
          ctx.stroke();
        }

        // Outer Ring Node
        ctx.beginPath();
        ctx.arc(node.x, node.y, isSelected ? 12 : 9, 0, Math.PI * 2);
        ctx.fillStyle = isHotspot ? '#1F0A14' : '#041F1A';
        ctx.fill();
        ctx.strokeStyle = isHotspot ? '#FF2A85' : '#00F5D4';
        ctx.lineWidth = isSelected ? 3 : 2;
        ctx.stroke();

        // Glowing Core
        ctx.beginPath();
        ctx.arc(node.x, node.y, isSelected ? 6 : 4, 0, Math.PI * 2);
        ctx.fillStyle = isHotspot ? '#FF2A85' : '#00F5D4';
        ctx.shadowColor = isHotspot ? '#FF2A85' : '#00F5D4';
        ctx.shadowBlur = 12;
        ctx.fill();
        ctx.shadowBlur = 0;

        // Node Label
        ctx.fillStyle = '#FFFFFF';
        ctx.font = isSelected ? 'bold 11px JetBrains Mono' : '10px JetBrains Mono';
        ctx.fillText(node.name, node.x + 16, node.y + 4);

        // Subtitle / Contamination Score tag
        ctx.fillStyle = isHotspot ? '#FF2A85' : '#00F5D4';
        ctx.font = '9px JetBrains Mono';
        ctx.fillText(
          isHotspot ? `HOTSPOT: ${node.contaminationScore}% BIO-INDEX` : `SAFE: ${node.contaminationScore}%`,
          node.x + 16,
          node.y + 16
        );
      });

      animationFrameRef.current = requestAnimationFrame(render);
    };

    animationFrameRef.current = requestAnimationFrame(render);

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [selectedNode]);

  // Handle Canvas Click to Select Node
  const handleCanvasClick = (e) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    const clickX = (e.clientX - rect.left) * scaleX;
    const clickY = (e.clientY - rect.top) * scaleY;

    // Find closest node within 30px
    let closest = null;
    let minD = 35;
    MUMBAI_NODES.forEach((n) => {
      const dist = Math.hypot(n.x - clickX, n.y - clickY);
      if (dist < minD) {
        minD = dist;
        closest = n;
      }
    });

    if (closest) {
      setSelectedNode(closest);
    }
  };

  return (
    <div className="space-y-6">
      {/* Tab Context Banner */}
      <div className="rounded-xl border border-crimson/30 bg-gradient-to-r from-slate-900/95 via-slate-900/80 to-rose-950/40 p-4 lg:p-5 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 shadow-xl">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 rounded bg-crimson/20 text-crimson border border-crimson/40 text-[10px] font-mono font-bold">
              THE RENAISSANCE "ART" + "COMMUNICATION" THEME
            </span>
            <span className="text-xs font-mono text-slate-400">
              Living Generative Mumbai Bio-Contamination Map
            </span>
          </div>
          <h2 className="text-lg lg:text-xl font-bold text-white tracking-wide">
            15-Days to 15-Seconds: FDA Citizen Swarm Triage
          </h2>
          <p className="text-xs text-slate-300 max-w-3xl">
            Top-down raids taking 15.1 days allow adulterated batches to be sold before inspectors arrive.
            HydroSpec AI networks citizen scans into a living bioluminescent coral map that triangulates dark stores in 15 seconds.
          </p>
        </div>

        {/* Trigger Swarm CTA Button */}
        <button
          onClick={handleTriggerSwarm}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-crimson to-pink-600 hover:from-crimson hover:to-pink-500 text-white font-mono text-xs font-black shadow-[0_0_20px_rgba(255,42,133,0.5)] transition-all hover:scale-105 shrink-0"
        >
          <Zap className="w-4 h-4 animate-bounce" />
          <span>TRIGGER CITIZEN SWARM REPORT</span>
        </button>
      </div>

      {/* Main 15-Days to 15-Seconds Speed Comparison Banner */}
      <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
        {/* Old Model */}
        <div className="space-y-1 p-3 rounded-lg bg-slate-900/60 border border-slate-800">
          <span className="text-[10px] font-mono text-slate-500 uppercase font-semibold">
            TRADITIONAL FDA MANUAL COMPLAINT
          </span>
          <div className="flex items-baseline gap-2">
            <span className="font-mono text-2xl font-black text-slate-400 line-through">
              15.1 DAYS
            </span>
            <span className="text-xs text-slate-500 font-mono">(362.4 Hours)</span>
          </div>
          <p className="text-[11px] text-slate-400 font-sans">
            Samples sent to physical government labs; stock sold & consumed before raids occur.
          </p>
        </div>

        {/* Arrow Transform */}
        <div className="text-center font-mono text-xs text-cybercyan flex flex-col items-center justify-center">
          <Sparkles className="w-5 h-5 text-cybercyan animate-spin mb-1" />
          <span className="font-bold tracking-wider">DECISION ACCELERATION</span>
          <span className="text-[10px] text-slate-400">108,000× FASTER RESOLUTION</span>
        </div>

        {/* HydroSpec AI Swarm Speed */}
        <div className="space-y-1 p-3 rounded-lg bg-gradient-to-r from-emerald-950/40 to-slate-900/80 border border-cybercyan/40 shadow-[0_0_15px_rgba(0,245,212,0.15)]">
          <span className="text-[10px] font-mono text-cybercyan uppercase font-bold flex items-center gap-1">
            <CheckCircle2 className="w-3.5 h-3.5" />
            HYDROSPEC AI SWARM TRIAGE
          </span>
          <div className="flex items-baseline gap-2">
            <span className="font-mono text-3xl font-black text-white text-glow-cyan">
              {swarmSeconds > 86400
                ? `${(swarmSeconds / 86400).toFixed(1)} DAYS`
                : `${swarmSeconds.toFixed(1)} SECONDS`}
            </span>
            <span className="text-xs text-emerald-400 font-mono font-bold">TARGET LOCKED</span>
          </div>
          <p className="text-[11px] text-slate-300 font-sans">
            5 citizen scans cross-correlated $\rightarrow$ dark-store geo-triangulated $\rightarrow$ warrant generated.
          </p>
        </div>
      </div>

      {/* Main Grid: Mumbai Bioluminescent Map + Swarm Triage Feed */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Column: Interactive Mumbai Bioluminescent Canvas (7 Cols) */}
        <div className="lg:col-span-7 space-y-4">
          <div className="rounded-xl border border-slate-800 bg-slate-950 p-4 space-y-3 relative overflow-hidden">
            
            {/* Header */}
            <div className="flex items-center justify-between pb-3 border-b border-slate-800 font-mono text-xs">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-crimson animate-ping" />
                <span className="text-white font-bold">BIOLUMINESCENT MUMBAI SUPPLY-CHAIN GRID</span>
              </div>
              <span className="text-[11px] text-slate-400">
                CLICK ANY NODE TO INSPECT
              </span>
            </div>

            {/* 60FPS Interactive Canvas */}
            <div className="relative w-full aspect-[4/3] max-h-[480px] rounded-lg overflow-hidden border border-slate-800 bg-obsidian cursor-pointer">
              <canvas
                ref={canvasRef}
                onClick={handleCanvasClick}
                className="w-full h-full object-contain"
              />

              {/* Map Legend Overlay */}
              <div className="absolute bottom-3 left-3 bg-obsidian/90 backdrop-blur-md p-2.5 rounded-lg border border-slate-800 font-mono text-[10px] space-y-1.5 pointer-events-none">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-cybercyan inline-block" />
                  <span className="text-slate-300">Calm Cyan Coral: Safe Zone (&lt;20%)</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-crimson inline-block animate-pulse" />
                  <span className="text-slate-300">Crimson Spore Wave: Active Contamination Hub</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-4 h-0.5 bg-crimson inline-block border-b border-dashed border-white" />
                  <span className="text-slate-300">Dotted Arc: Offending Supply Route</span>
                </div>
              </div>

              {/* Watermark */}
              <div className="absolute top-3 right-3 font-mono text-[10px] text-slate-500 bg-obsidian/70 px-2 py-1 rounded">
                LAT: 19.0760° N, LON: 72.8777° E
              </div>
            </div>

            {/* Selected Node Real-Time Summary */}
            <div className="p-3 rounded-lg bg-slate-900 border border-slate-800 flex flex-wrap items-center justify-between gap-3 text-xs font-mono">
              <div>
                SELECTED ZONE: <strong className="text-white">{selectedNode.name}</strong> ({selectedNode.subtitle})
              </div>
              <div className="flex items-center gap-4">
                <span>SCANS TODAY: <strong className="text-cybercyan">{selectedNode.citizenScansToday}</strong></span>
                <span>BIO-INDEX: <strong className={selectedNode.safeZone ? 'text-emerald-400' : 'text-crimson'}>{selectedNode.contaminationScore}%</strong></span>
              </div>
            </div>

          </div>
        </div>

        {/* Right Column: Live Swarm Triage Feed & FDA Raid Dossier (5 Cols) */}
        <div className="lg:col-span-5 space-y-4">
          
          {/* Active Node Detail Card */}
          <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-3 font-mono text-xs">
            <div className="flex items-center justify-between border-b border-slate-800 pb-2">
              <span className="font-bold text-white flex items-center gap-1.5">
                <Building2 className="w-4 h-4 text-cybercyan" />
                <span>TRIANGULATED FACILITY PROFILE</span>
              </span>
              <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${selectedNode.safeZone ? 'bg-cybercyan/20 text-cybercyan' : 'bg-crimson/20 text-crimson'}`}>
                {selectedNode.safeZone ? 'STATUS: SAFE' : 'STATUS: RAID TARGET'}
              </span>
            </div>

            <div className="space-y-1.5 text-[11px] text-slate-300">
              <div className="flex justify-between">
                <span className="text-slate-500">FACILITY:</span>
                <span className="text-white font-semibold">{selectedNode.darkStoreName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">PRIMARY THREAT:</span>
                <span className={selectedNode.safeZone ? 'text-slate-300' : 'text-crimson font-bold'}>{selectedNode.threat}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">LAST BATCH HASH:</span>
                <span className="text-cybercyan">{selectedNode.lastBatchHash}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">ACTIVE COMPLAINTS:</span>
                <span className="text-white font-bold">{selectedNode.badBatchesCount} Batches Flagged</span>
              </div>
            </div>
          </div>

          {/* Live 5 Citizen Reports Stream */}
          <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-3 font-mono text-xs">
            <div className="flex items-center justify-between border-b border-slate-800 pb-2">
              <span className="font-bold text-white flex items-center gap-1.5">
                <Users className="w-4 h-4 text-neonamber" />
                <span>CITIZEN SWARM CORRELATION FEED</span>
              </span>
              <span className="text-[10px] text-slate-400">GHATKOPAR & VIDYAVIHAR</span>
            </div>

            {citizenReports.length === 0 ? (
              <div className="p-6 text-center text-slate-500 space-y-2">
                <Radio className="w-6 h-6 mx-auto text-slate-600 animate-pulse" />
                <p className="text-xs">
                  Click "TRIGGER CITIZEN SWARM REPORT" to simulate 5 real-time citizen scans converging on the same dark store.
                </p>
              </div>
            ) : (
              <div className="space-y-2 max-h-56 overflow-y-auto pr-1">
                {citizenReports.map((report) => (
                  <div
                    key={report.id}
                    className="p-2.5 rounded-lg bg-slate-900 border border-slate-800 text-[11px] space-y-1 animate-in fade-in duration-300"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-white">{report.user}</span>
                      <span className="text-slate-500 text-[10px]">{report.time}</span>
                    </div>
                    <div className="text-slate-300">
                      Sample: <span className="text-slate-200">{report.item}</span>
                    </div>
                    <div className="flex items-center justify-between pt-0.5">
                      <span className="text-slate-400 text-[10px]">{report.result}</span>
                      <span className="text-crimson font-bold text-[10px] px-1.5 py-0.2 rounded bg-crimson/10 border border-crimson/30">
                        {report.verdict}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* FDA Dispatch Action Trigger */}
          <div className="p-4 rounded-xl bg-gradient-to-r from-crimson/20 via-slate-900 to-slate-950 border border-crimson/40 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <ShieldAlert className="w-5 h-5 text-crimson animate-pulse" />
                <span className="font-mono text-xs font-bold text-white">
                  FDA RAPID RAID DISPATCH DOSSIER
                </span>
              </div>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-crimson text-white font-bold">
                READY FOR EXECUTION
              </span>
            </div>
            <p className="text-xs text-slate-300 font-sans leading-relaxed">
              Cryptographically signed warrant generated under Maharashtra Food & Drug Administration Section 59. 
              Dark store geo-triangulation verified via 5 multi-point citizen optical signatures.
            </p>
            <div className="flex items-center gap-2 pt-1">
              <button
                onClick={() => setShowDossierModal(true)}
                className="flex-1 flex items-center justify-center gap-2 px-3 py-2 rounded-lg bg-crimson hover:bg-crimson/90 text-white font-mono text-xs font-bold shadow-[0_0_15px_rgba(255,42,133,0.4)] transition-all"
              >
                <FileText className="w-3.5 h-3.5" />
                <span>INSPECT OFFICIAL DOSSIER</span>
              </button>
            </div>
          </div>

        </div>

      </div>

      {/* ======================================================== */}
      {/* OFFICIAL FDA RAPID RAID DISPATCH DOSSIER MODAL */}
      {/* ======================================================== */}
      {showDossierModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-obsidian/80 backdrop-blur-md animate-in fade-in duration-200">
          <div className="max-w-2xl w-full bg-slate-950 border-2 border-crimson rounded-2xl shadow-[0_0_50px_rgba(255,42,133,0.5)] overflow-hidden flex flex-col max-h-[90vh]">
            
            {/* Modal Header */}
            <div className="bg-gradient-to-r from-rose-950 to-slate-900 p-4 border-b border-crimson/40 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-lg bg-crimson/20 border border-crimson/50 flex items-center justify-center">
                  <ShieldAlert className="w-5 h-5 text-crimson animate-pulse" />
                </div>
                <div>
                  <h3 className="font-mono text-sm font-bold text-white uppercase tracking-wider">
                    Government of Maharashtra • Food & Drug Administration (FDA)
                  </h3>
                  <p className="text-[11px] font-mono text-crimson">
                    RAPID RAID DISPATCH ORDER & SEARCH WARRANT [§59 FSSAI ACT / §94 CrPC]
                  </p>
                </div>
              </div>
              <button
                onClick={() => setShowDossierModal(false)}
                className="text-slate-400 hover:text-white px-2 py-1 rounded bg-slate-900 border border-slate-700 font-mono text-xs"
              >
                ✕ CLOSE
              </button>
            </div>

            {/* Modal Body: Legal Dossier */}
            <div className="p-6 overflow-y-auto space-y-4 font-mono text-xs text-slate-200 bg-obsidian">
              {/* Reference & Timestamps */}
              <div className="grid grid-cols-2 gap-3 p-3 rounded-lg bg-slate-950 border border-slate-800 text-[11px]">
                <div>
                  <span className="text-slate-500">DOSSIER REF:</span>{' '}
                  <strong className="text-white">MAHA-FDA-2024-KJSSE-0941</strong>
                </div>
                <div>
                  <span className="text-slate-500">TRIAGE TIME:</span>{' '}
                  <strong className="text-emerald-400">12.0 SECONDS (AUTONOMOUS)</strong>
                </div>
                <div>
                  <span className="text-slate-500">PRIMARY JURISDICTION:</span>{' '}
                  <strong className="text-white">Zone IV (Ghatkopar / Vidyavihar / Navi Mumbai)</strong>
                </div>
                <div>
                  <span className="text-slate-500">CRYPTO BATCH HASH:</span>{' '}
                  <strong className="text-cybercyan">0x7F9A2B44E81C09D3</strong>
                </div>
              </div>

              {/* Target Location Box */}
              <div className="p-3 rounded-lg bg-slate-950 border border-crimson/40 space-y-1">
                <span className="text-[10px] text-crimson font-bold uppercase tracking-wider">
                  TARGET FACILITY GEO-TRIANGULATION
                </span>
                <p className="text-sm font-bold text-white">
                  Central Supply Warehouse Hub #GH-402, LBS Marg, Ghatkopar West, Mumbai 400086
                </p>
                <p className="text-[11px] text-slate-400">
                  Coordinates: 19.0864° N, 72.9081° E • Multi-point citizen scan triangulation density: 98.6%
                </p>
              </div>

              {/* Forensic Findings */}
              <div className="space-y-2">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                  FORENSIC OPTICAL EVIDENCE SUMMARY:
                </span>
                <ul className="list-disc list-inside space-y-1 text-slate-300 text-[11px]">
                  <li>
                    <strong className="text-white">Micro-Fluidic Physics:</strong> Extreme surface tension collapse ($γ = 26.8$ mN/m) and elevated synthetic lipid gloss ($0.86$) confirming commercial analogue paneer (palm-oil/starch).
                  </li>
                  <li>
                    <strong className="text-white">Sobel Edge Packaging Analysis:</strong> 5.8° baseline kerning tilt and 24.3 cm² acetone solvent wipe residue confirming re-stamped expired packaging.
                  </li>
                  <li>
                    <strong className="text-white">Citizen Swarm Quorum:</strong> 5 independent citizen submissions within 10 minutes from Somaiya Vidyavihar campus and Ghatkopar commercial zones.
                  </li>
                </ul>
              </div>

              {/* Official Seal Mock */}
              <div className="p-3 rounded-lg bg-slate-950 border border-slate-800 flex items-center justify-between text-[11px]">
                <div className="space-y-0.5">
                  <span className="text-slate-500">DISPATCHING AUTHORITY:</span>
                  <div className="font-bold text-white">Enforcement Directorate, Maharashtra FDA</div>
                  <div className="text-[10px] text-slate-400">Verified by HydroSpec AI Consensus Engine</div>
                </div>
                <div className="px-3 py-1 rounded border border-emerald-500/40 bg-emerald-950/30 text-emerald-400 font-bold text-[10px]">
                  ✓ WARRANT ACTIVE
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="bg-slate-950 p-4 border-t border-slate-800 flex items-center justify-between gap-3">
              <span className="text-[11px] font-mono text-slate-500">
                Authorized for Hackathon Demonstration • KJSSE Renaissance Buildathon
              </span>
              <button
                onClick={() => {
                  window.print();
                }}
                className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-cybercyan text-obsidian font-mono text-xs font-bold shadow-[0_0_12px_rgba(0,245,212,0.4)] hover:bg-cybercyan/90 transition-all"
              >
                <Printer className="w-3.5 h-3.5" />
                <span>PRINT / EXPORT DOSSIER</span>
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
