import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  Volume2,
  VolumeX,
  Upload,
  Sparkles,
  ChevronLeft,
  ChevronRight,
  Terminal,
  Cpu,
  ShieldCheck,
  Zap,
  ExternalLink,
  Award,
  Calendar,
  MapPin,
  RotateCcw,
  CheckCircle2,
  Eye,
  X,
  Code2,
  Layers,
  Users,
  Camera,
  Image as ImageIcon,
  Pause,
  Play,
  FastForward
} from 'lucide-react';

// ============================================================================
// CUSTOM SVG COMPONENTS (MATCHING MOCKUP 1 & MOCKUP 2)
// ============================================================================

/**
 * Stylized Barong Tagalog Cutout Bust SVG (Default fallback matching Mockup 1)
 * Users can also click "Upload Your Cutout PNG" to drop in their exact photo.
 */
const BarongPortraitSVG = () => (
    <img
    src=".\src\public\assets\intro\barong-cutout.png"
    alt="Portrait of Jah in a barong tagalog"
    className="w-48 h-52 sm:w-56 sm:h-60 mx-auto object-contain drop-shadow-[0_4px_20px_rgba(255,255,255,0.12)] select-none"
    draggable={false}
  />
);

// 5x7 pixel glyphs for the name line
const PIXEL_FONT = {
  J: ["....#", "....#", "....#", "....#", "#...#", "#...#", ".###."],
  U: ["#...#", "#...#", "#...#", "#...#", "#...#", "#...#", ".###."],
  S: [".####", "#....", "#....", ".###.", "....#", "....#", "####."],
  T: ["#####", "..#..", "..#..", "..#..", "..#..", "..#..", "..#.."],
  I: [".###.", "..#..", "..#..", "..#..", "..#..", "..#..", ".###."],
  N: ["#...#", "##..#", "##..#", "#.#.#", "#..##", "#..##", "#...#"],
  R: ["####.", "#...#", "#...#", "####.", "#.#..", "#..#.", "#...#"],
  A: [".###.", "#...#", "#...#", "#####", "#...#", "#...#", "#...#"],
  Y: ["#...#", "#...#", ".#.#.", "..#..", "..#..", "..#..", "..#.."],
  L: ["#....", "#....", "#....", "#....", "#....", "#....", "#####"],
};

const PixelText = ({ text, cell = 4, x = 0, y = 0 }) => {
  const rects = [];
  let cursor = x;
  [...text].forEach((ch, i) => {
    if (ch === " ") {
      cursor += cell * 3; // extra gap between words
      return;
    }
    PIXEL_FONT[ch].forEach((row, r) => {
      let c = 0;
      while (c < 5) {
        if (row[c] === "#") {
          const start = c;
          while (c < 5 && row[c] === "#") c++;
          rects.push(
            <rect
              key={`${i}-${r}-${start}`}
              x={cursor + start * cell}
              y={y + r * cell}
              width={(c - start) * cell}
              height={cell}
            />
          );
        } else c++;
      }
    });
    cursor += cell * 6; // 5 columns + 1 column gap
  });
  return (
    <g fill="#e93e8f" shapeRendering="crispEdges">
      {rects}
    </g>
  );
};

const JahBlockLogoSVG = ({ className = "w-56 sm:w-72 h-auto" }) => (
  <svg
    viewBox="0 0 310 110"
    role="img"
    aria-label="Justin Rayala, Jah"
    className={`${className} select-none drop-shadow-[0_0_18px_rgba(233,62,143,0.35)]`}
  >
    {/* NAME LINE */}
    <PixelText text="JUSTIN RAYALA" cell={4} x={7} y={1} />

    {/* JAH, shifted down below the name */}
    <g transform="translate(0, 28)">
      {/* LETTER J */}
      <path
        fill="#e93e8f"
        d="M 45 10 H 95 V 80 H 10 V 50 H 35 V 60 H 55 V 10 Z"
      />
      {/* LETTER A with pixel heart cut-out */}
      <path
        fill="#e93e8f"
        fillRule="evenodd"
        d="M 110 20 H 120 V 10 H 180 V 20 H 190 V 80 H 160 V 62 H 140 V 80 H 110 V 20 Z
           M 136 28 H 146 V 33 H 154 V 28 H 164 V 40 H 159 V 46 H 154 V 51 H 146 V 46 H 141 V 40 H 136 V 28 Z"
      />
      {/* LETTER H */}
      <path
        fill="#e93e8f"
        d="M 205 10 H 235 V 36 H 260 V 10 H 290 V 80 H 260 V 56 H 235 V 80 H 205 V 10 Z"
      />
    </g>
  </svg>
);

/**
 * Scroll-Reactive AJ Lee Bone-Spider & Scribbled Grunge Heart SVG (Matches Mockup 2 Left Side)
 * Legs articulate subtly as the user scrolls down the page.
 */
const AJBoneSpiderSVG = ({ scrollProgress = 0, activePulse = false }) => {
  // Crawl phase driven by scroll position
  const phase = scrollProgress * Math.PI * 10;
  const swing = Math.sin(phase) * 6;

  // Whole-body up/down bob and tilt (wide, slow waves)
  const bobY = Math.sin(phase * 0.1) * 150;
  const tilt = Math.cos(phase * 0.1) * 40;

  // Staggered gait: each leg steps at a different time, opposite sides in opposition
  const step = (i, side) =>
    Math.cos(phase + i * (Math.PI / 2) + (side === "r" ? Math.PI : 0)) * 6;
  const l1 = step(0, "l"), l2 = step(1, "l"), l3 = step(2, "l"), l4 = step(3, "l");
  const r1 = step(0, "r"), r2 = step(1, "r"), r3 = step(2, "r"), r4 = step(3, "r");

  // Reusable Bone Segment Renderer
  const renderBone = (x1, y1, x2, y2, thickness = 11, key) => {
    const angle = Math.atan2(y2 - y1, x2 - x1) * (180 / Math.PI);
    const length = Math.hypot(x2 - x1, y2 - y1);
    return (
      <g key={key} transform={`translate(${x1}, ${y1}) rotate(${angle})`}>
        {/* Bone Shaft */}
        <rect
          x={0}
          y={-thickness / 2}
          width={length}
          height={thickness}
          rx={thickness / 2}
          fill="#3b0a26"
          stroke="#590d38"
          strokeWidth="1.5"
        />
        {/* Proximal Bone Knobs */}
        <circle cx={0} cy={-thickness * 0.55} r={thickness * 0.65} fill="#3b0a26" stroke="#590d38" strokeWidth="1.2" />
        <circle cx={0} cy={thickness * 0.55} r={thickness * 0.65} fill="#3b0a26" stroke="#590d38" strokeWidth="1.2" />
        {/* Distal Bone Knobs */}
        <circle cx={length} cy={-thickness * 0.55} r={thickness * 0.65} fill="#3b0a26" stroke="#590d38" strokeWidth="1.2" />
        <circle cx={length} cy={thickness * 0.55} r={thickness * 0.65} fill="#3b0a26" stroke="#590d38" strokeWidth="1.2" />
      </g>
    );
  };

  return (
    <svg
      viewBox="0 0 500 720"
      className="w-full h-full overflow-visible select-none pointer-events-none filter drop-shadow-[0_0_25px_rgba(233,62,143,0.18)]"
    >
      <g transform={`translate(0, ${bobY}) rotate(${tilt}, 250, 350)`}>
        {/* Left Side Legs */}
        <g transform={`rotate(${swing * 0.5}, 230, 350)`}>
          {/* Leg L1 */}
          {renderBone(195, 290, 145, 210 - l1, 12, 'l1-a')}
          {renderBone(145, 210 - l1, 215, 75, 11, 'l1-b')}
          <polygon points="212,72 222,78 235,25" fill="#3b0a26" stroke="#590d38" strokeWidth="1.5" />

          {/* Leg L2 */}
          {renderBone(178, 325, 85, 285 + l2, 12, 'l2-a')}
          {renderBone(85, 285 + l2, 140, 145, 10, 'l2-b')}
          <polygon points="135,145 146,148 168,95" fill="#3b0a26" stroke="#590d38" strokeWidth="1.5" />

          {/* Leg L3 */}
          {renderBone(180, 365, 88, 398 - l3, 12, 'l3-a')}
          {renderBone(88, 398 - l3, 145, 525, 10, 'l3-b')}
          <polygon points="140,523 152,520 185,595" fill="#3b0a26" stroke="#590d38" strokeWidth="1.5" />

          {/* Leg L4 */}
          {renderBone(198, 395, 152, 495 + l4, 12, 'l4-a')}
          {renderBone(152, 495 + l4, 215, 625, 11, 'l4-b')}
          <polygon points="210,622 222,618 238,685" fill="#3b0a26" stroke="#590d38" strokeWidth="1.5" />
        </g>

        {/* Right Side Legs */}
        <g transform={`rotate(${-swing * 0.5}, 270, 350)`}>
          {/* Leg R1 */}
          {renderBone(305, 290, 355, 210 + r1, 12, 'r1-a')}
          {renderBone(355, 210 + r1, 285, 75, 11, 'r1-b')}
          <polygon points="288,72 278,78 265,25" fill="#3b0a26" stroke="#590d38" strokeWidth="1.5" />

          {/* Leg R2 */}
          {renderBone(322, 325, 415, 285 - r2, 12, 'r2-a')}
          {renderBone(415, 285 - r2, 360, 145, 10, 'r2-b')}
          <polygon points="365,145 354,148 332,95" fill="#3b0a26" stroke="#590d38" strokeWidth="1.5" />

          {/* Leg R3 */}
          {renderBone(320, 365, 412, 398 + r3, 12, 'r3-a')}
          {renderBone(412, 398 + r3, 355, 525, 10, 'r3-b')}
          <polygon points="360,523 348,520 315,595" fill="#3b0a26" stroke="#590d38" strokeWidth="1.5" />

          {/* Leg R4 */}
          {renderBone(302, 395, 348, 495 - r4, 12, 'r4-a')}
          {renderBone(348, 495 - r4, 285, 625, 11, 'r4-b')}
          <polygon points="290,622 278,618 262,685" fill="#3b0a26" stroke="#590d38" strokeWidth="1.5" />
        </g>

        {/* Top Mandibles / Spider Fangs above Heart */}
        <path
          d="M 218 292 Q 205 255 235 242 Q 225 268 232 288 Z"
          fill="#3b0a26"
          stroke="#7a114d"
          strokeWidth="2"
        />
        <path
          d="M 282 292 Q 295 255 265 242 Q 275 268 268 288 Z"
          fill="#3b0a26"
          stroke="#7a114d"
          strokeWidth="2"
        />

        {/* Central Heart Body */}
        <g
          transform={`scale(${activePulse ? 1.06 : 1})`}
          style={{ transformOrigin: '250px 350px', transition: 'transform 0.3s ease' }}
        >
          {/* Outer Heart Frame */}
          <path
            d="M 250 312
               C 232 278, 175 285, 182 338
               C 188 378, 235 408, 250 432
               C 265 408, 312 378, 318 338
               C 325 285, 268 278, 250 312 Z"
            fill="#070707"
            stroke="#4a0c30"
            strokeWidth="12"
            strokeLinejoin="round"
          />
          {/* Inner Neon Pink Highlight Rim */}
          <path
            d="M 250 312
               C 232 278, 175 285, 182 338
               C 188 378, 235 408, 250 432
               C 265 408, 312 378, 318 338
               C 325 285, 268 278, 250 312 Z"
            fill="none"
            stroke="#e93e8f"
            strokeWidth="2"
            opacity="0.45"
          />

          {/* Grunge Grey Scribble Texture Inside Heart */}
          <path
            d="M 202 318 L 288 342 L 195 348 L 295 362 L 208 372 L 282 380 L 222 392 L 268 398 L 238 412 L 265 315 L 205 335 L 285 325 L 215 360 L 275 350"
            fill="none"
            stroke="#464648"
            strokeWidth="9"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M 208 322 L 282 346 L 202 354 L 288 366 L 218 378 L 274 385 L 235 402"
            fill="none"
            stroke="#68686b"
            strokeWidth="3.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </g>
      </g>
    </svg>
  );
};

/**
 * Classic Undertale Pixel Heart (SOUL) Icon
 */
const UndertaleSoulSVG = ({ color = "#e93e8f", className = "w-4 h-4" }) => (
  <svg viewBox="0 0 16 16" className={`${className} inline-block shrink-0`} style={{ shapeRendering: 'crispEdges' }}>
    <path
      fill={color}
      d="M2 2h4v2h4V2h4v2h2v5h-2v2h-2v2h-2v2H6v-2H4v-2H2V9H0V4h2V2z"
    />
  </svg>
);

/**
 * Undertale 4-Pointed Glowing SAVE Star SVG
 */
const UndertaleSaveStarSVG = ({ className = "w-7 h-7" }) => (
  <svg viewBox="0 0 24 24" className={`${className} inline-block shrink-0`} style={{ shapeRendering: 'crispEdges' }}>
    <path
      fill="#e93e8f"
      d="M11 0h2v5h2v2h2v2h2v2h5v2h-5v2h-2v2h-2v2h-2v5h-2v-5H9v-2H7v-2H5v-2H0v-2h5V9h2V7h2V5h2V0z"
    />
    <path
      fill="#ffffff"
      d="M11 4h2v4h2v2h2v2h4v2h-4v2h-2v2h-2v4h-2v-4H9v-2H7v-2H3v-2h4V10h2V8h2V4z"
    />
  </svg>
);

// ============================================================================
// PORTFOLIO DATA (JAH'S AUTHENTIC CONTENT)
// ============================================================================

const CAROUSEL_SLIDES = [
  {
    id: 1,
    label: "picture 1",
    placeholderPath: "/assets/bionote/bionote-1.jpg",
    resolution: "1200x800px",
    title: "AWS Cloud Club - Hugo GA 2026",
    subtitle: "Chief Administrative Officer // Flagship Assembly & Ideathon",
    badge: "CLOUD LEADERSHIP",
    accent: "#ff0055",
    illustration: "cloud"
  },
  {
    id: 2,
    label: "picture 2",
    placeholderPath: "/assets/bionote/bionote-2.jpg",
    resolution: "1200x800px",
    title: "TUP Manila Student Governance",
    subtitle: "USG Assistant Secretary for Resources & COS Secretariat",
    badge: "INSTITUTIONAL POLICY",
    accent: "#00ff00",
    illustration: "gov"
  },
  {
    id: 3,
    label: "picture 3",
    placeholderPath: "/assets/bionote/bionote-3.jpg",
    resolution: "1200x800px",
    title: "OpenCV & Embedded Hardware Lab",
    subtitle: "QR Door Access Security + Arduino Ultrasonic & MOSFET Circuits",
    badge: "SYSTEMS & IOT",
    accent: "#b80028",
    illustration: "hardware"
  }
];

const HOW_I_WORK_PILLARS = [
  {
    id: "management",
    code: "CHAPTER 01",
    title: "ClickUp Project Manager",
    stat: "ATK 96 // DEF 99",
    summary:
      "ClickUp is a project management software company that provides an all-in-one platform to improve workplace efficiency and collaboration.",
    bullets: [
      "Create tabs for each academic courses and organizations",
      "Helps keep track of tasks, events, exams, and deadlines to ensure progress is documented"],
    icon: Terminal
  },
  {
    id: "priority",
    code: "CHAPTER 2",
    title: "Highest Priority First",
    stat: "ATK 98 // DEF 93",
    summary:
      "I prioritize which tasks have the most priority.",
    bullets: [
      "legends", "lang", "nakakaalam"
    ],
    icon: Terminal
  }
];

const PROJECTS_DATA = [
  {
    id: "qr-access",
    encounter: "BOSS ENCOUNTER #01",
    level: "LV 99 SECURITY SYS",
    placeholderPath: "/assets/projects/qr-security.jpg",
    resolution: "16:9 • 1280x720px",
    title: "QR Code-Based Door Security and Attendance Monitoring System",
    shortDesc:
      "A more easy and accessible way of documenting and identifying students coming in or out of a room.",
    stack: ["Python", "OpenCV", "Supabase", "MySQL"],
    metrics: "Real-Time Security • Role-Based Access",
    architecture: [
      "OpenCV video stream pipeline performing low-latency QR detection, bounding-box validation, and anti-replay timestamp checks.",
      "Cloud PostgreSQL database hosted on Supabase storing member credentials, schedules, and immutable entry/exit logs.",
      "GPIO / serial relay trigger signaling physical door strike hardware upon verified database handshake."
    ]
  },
  {
    id: "eoq-inventory",
    encounter: "BOSS ENCOUNTER #02",
    level: "LV 94 OPS ENGINE",
    placeholderPath: "/assets/projects/eoq-inventory.jpg",
    resolution: "16:9 • 1280x720px",
    title: "Optimization of Supermarket Inventory Management",
    shortDesc:
      "A desktop-based Supermarket Inventory Optimization System that automates EOQ-driven inventory decision-making for supermarket administrators.",
    stack: ["Python", "Operations Research", "EOQ", "ROP", "MySQL", "Data Modeling"],
    metrics: "Minimized Total Cost • Automated Reorder Alerts • Stockout Prevention",
    architecture: [
      "Computes optimal batch order quantities dynamically using demand rate (D), setup cost (S), and holding cost (H) via EOQ formula.",
      "Tracks real-time SKU depletion against lead-time demand and safety stock buffers to trigger automated Reorder Point (ROP) alerts.",
      "Generates actionable restocking schedules for high-turnover supermarket product categories."
    ]
  },
  {
    id: "arduino-game",
    encounter: "BOSS ENCOUNTER #03",
    level: "LV 92 ROBO ENCOUNTER",
    placeholderPath: "/assets/projects/divide-and-choose.jpg",
    resolution: "16:9 • 1280x720px",
    title: "Sison Says!",
    shortDesc:
      "legends lang nakakaalam",
    stack: ["Arduino Uno", "C / C++", "Tinkercad", "Robotics"],
    metrics: "Game Building • Sensor Logic",
    architecture: [
      "Formalizes utility functions for two-player and multi-agent resource partitioning under the classic Divide-and-Choose protocol.",
      "Analyzes subgame perfect equilibria when players possess heterogeneous preferences vs. asymmetric information.",
      "Demonstrates practical applications in computational resource allocation and dispute resolution."
    ]
  },
  {
    id: "talaria",
    encounter: "BOSS ENCOUNTER #04",
    level: "LV 95 WEBSYS ENCOUNTER",
    placeholderPath: "/assets/projects/arduino-sensor-lab.jpg",
    resolution: "16:9 • 1280x720px",
    title: "Talaria Publications Website",
    shortDesc:
      "legends lang nakakaalam",
    stack: ["HTML", "CSS", "JavaScript"],
    metrics: "Basics of HTML • Getting Started with Web Development",
    architecture: [
      "Non-blocking distance telemetry using HC-SR04 ultrasonic transducers for proximity-triggered automation.",
      "Analog voltage divider networks with Light Dependent Resistors (LDR) for hysteresis-stabilized threshold switching.",
      "Logic-level N-channel MOSFET driver stages isolating the 5V microcontroller pins from higher-current DC loads."
    ]
  }
];

const ORGANIZATIONS_DATA = [
  {
    org: "AWS Student Builder Group - Hugo",
    role: "Co-Lead & Chief Finance Officer",
    period: "Aug 2025 – Present",
    secondaryRole: "Former Chief Administrative Officer & Co-Executive for Operations",
    badge: "CLOUD LEADERSHIP",
    color: "#e93e8f",
    highlights: [
      "Leads project scheduling, risk assessment, and inventory management to ensure seamless operational execution across initiatives."
    ]
  },
  {
    org: "AWS Student User Group Philippines",
    role: "Assistant Secretary, Resources Department",
    period: "Aug 2026 - Present",
    secondaryRole: "",
    badge: "NATIONAL REPRESENTATION",
    color: "#00ff00",
    highlights: [
      "Assists with document management and supports the Executive Secretary."
    ]
  }
];

const EVENTS_DATA = [
  {
    id: "exec-workshop",
    date: "2026",
    placeholderPath: ".\\src\\public\\assets\\events\\exec-workshop.jpg",
    resolution: "16:9 • Event Photo",
    title: "AWS Skill Builder Execution Workshop",
    role: "Attendee",
    location: "Arthaland Century Pacific Tower, BGC",
    tag: "WORKSHOP",
    description:
      "An evening of learning, collaboration, and hands-on activities designed to help AWS Cloud Club leaders and members transform ideas into impactful initiatives."
  },
  {
    id: "scd-mega-manila-2026",
    date: "2026",
    placeholderPath: ".\\src\\public\\assets\\events\\scd-mega-manila-2026.jpg",
    resolution: "16:9 • Event Photo",
    title: "AWS Student Community Day Mega Manila 2026",
    role: "Official Volunteer Photographer",
    location: "Asia Pacific Colleges, Makati City",
    tag: "MAJOR EVENT",
    description:
      "Documented keynote talks, technical breakout tracks, networking sessions, and community milestones across one of the largest student-led AWS conferences in the region."
  },
  {
    id: "arduino-2026",
    date: "2026",
    placeholderPath: ".\\src\\public\\assets\\events\\arduino-2026.jpg",
    resolution: "16:9 • Event Photo",
    title: "Arduino Day Philippines 2026",
    role: "Attendee",
    location: "Asia Pacific Colleges, Makati City",
    tag: "MAJOR EVENT",
    description:
      "From groundbreaking builds to inspiring talks and powerhouse collaborations, we’re taking over APC for a celebration of creativity, innovation, and community like never before. This isn’t just an event,  it’s where the brightest ideas connect and come alive."
  },
  {
    id: "empowher",
    date: "2026",
    placeholderPath: ".\\src\\public\\assets\\events\\empowher.jpg",
    resolution: "16:9 • Event Photo",
    title: "EmpowHER: Sketching Visions, Building Futures",
    role: "Secretary and Attendee",
    location: "Arthaland Century Pacific Tower, BGC",
    tag: "EMPOWERMENT SEMINAR",
    description:
      "An event that brings together women leaders, builders, designers, and advocates in tech to share the real stories, the pivots, the doubts, the risks, and the breakthroughs."
  },
  {
    id: "techex-ieee",
    date: "2025",
    placeholderPath: ".\\src\\public\\assets\\events\\techex-ieee.jpg",
    resolution: "16:9 • Event Photo",
    title: "IEEE TechEx 2025: Engineering Solutions for Disaster Adversities",
    role: "Attendee",
    location: "Palma Hall, UP Diliman",
    tag: "SEMINAR",
    description:
      "Disasters are inevitable, but with the power of engineering and technology, we can minimize their impact and build a safer tomorrow. IEEE TechEX 2025 brings together experts, researchers, and students to explore cutting-edge solutions that enhance disaster preparedness, mitigation, and response."
  },
  {
    id: "kubernetes",
    date: "2025",
    placeholderPath: ".\\src\\public\\assets\\events\\kubernetes.jpg",
    resolution: "16:9 • Event Photo",
    title: "An introduction to Kubernetes",
    role: "Attendee",
    location: "Globe Tower, BGC",
    tag: "SEMINAR",
    description:
      "learning the fundamentals of Kubernetes to discovering how it empowers developers in managing modern applications, the session gave us valuable insights into one of today’s most in-demand technologies."
  }
];

const EventPhoto = ({ src, alt }) => {
  const [failed, setFailed] = useState(false);
  return (
    <div className="relative w-full aspect-video mb-4 border-2 border-zinc-700 bg-zinc-950 overflow-hidden">
      {failed ? (
        <div className="w-full h-full flex items-center justify-center font-pixel text-[9px] text-zinc-500">
          [ PHOTO NOT FOUND: {src} ]
        </div>
      ) : (
        <img
          src={src}
          alt={alt}
          loading="lazy"
          onError={() => setFailed(true)}
          className="w-full h-full object-cover"
        />
      )}
    </div>
  );
};

// ============================================================================
// MAIN APPLICATION COMPONENT
// ============================================================================

export default function App() {
  // 1. Pre-Landing Intro Overlay State (100% Automatic Sequence + 5s Countdown)
  const [showIntro, setShowIntro] = useState(true);
  const [introExiting, setIntroExiting] = useState(false);
  const [typedLines, setTypedLines] = useState(["", "", ""]);
  const [introDoneTyping, setIntroDoneTyping] = useState(false);
  const [countdownLeft, setCountdownLeft] = useState(2.0);
  const [timerPaused, setTimerPaused] = useState(false);
  const [customPortraitUrl, setCustomPortraitUrl] = useState(null);

  // 2. Audio Synthesizer State
  const [soundEnabled, setSoundEnabled] = useState(true);
  const audioCtxRef = useRef(null);

  // 3. Scroll & Spider Animation State (Matches Mockup 2)
  const [scrollProgress, setScrollProgress] = useState(0);
  const [scrollY, setScrollY] = useState(0);
  const [activeSection, setActiveSection] = useState("bionote");

  // 4. Bionote & Tilted 3-Card Carousel + Custom Image Upload States
  const [useMockupTagline, setUseMockupTagline] = useState(true);
  const [activeSlideIndex, setActiveSlideIndex] = useState(0);
  const [customSlideImages, setCustomSlideImages] = useState({});
  const [customProjectImages, setCustomProjectImages] = useState({});
  const [customEventImages, setCustomEventImages] = useState({});

  // 5. Interactive How I Work & Project Modal State
  const [selectedPillarIndex, setSelectedPillarIndex] = useState(0);
  const [inspectedProject, setInspectedProject] = useState(null);
  const [savedEvents, setSavedEvents] = useState({});

  // --------------------------------------------------------------------------
  // WEB AUDIO API 8-BIT UNDERTALE VOICE SYNTHESIZER
  // --------------------------------------------------------------------------
  const playBlip = useCallback(
    (freq = 440, duration = 0.038, wave = "square") => {
      if (!soundEnabled) return;
      try {
        const AudioContextClass = window.AudioContext || window.webkitAudioContext;
        if (!AudioContextClass) return;
        if (!audioCtxRef.current) {
          audioCtxRef.current = new AudioContextClass();
        }
        const ctx = audioCtxRef.current;
        if (ctx.state === "suspended") {
          ctx.resume();
        }

        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = wave;
        osc.frequency.setValueAtTime(freq + (Math.random() * 50 - 25), ctx.currentTime);

        gain.gain.setValueAtTime(0.035, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration);

        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start();
        osc.stop(ctx.currentTime + duration);
      } catch {
        // Ignore audio autoplay block until user clicks
      }
    },
    [soundEnabled]
  );

  const playSaveSound = useCallback(() => {
    if (!soundEnabled) return;
    try {
      const AudioContextClass = window.AudioContext || window.webkitAudioContext;
      if (!AudioContextClass) return;
      if (!audioCtxRef.current) {
        audioCtxRef.current = new AudioContextClass();
      }
      const ctx = audioCtxRef.current;
      if (ctx.state === "suspended") ctx.resume();

      const now = ctx.currentTime;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = "triangle";
      osc.frequency.setValueAtTime(523.25, now); // C5
      osc.frequency.setValueAtTime(659.25, now + 0.06); // E5
      osc.frequency.setValueAtTime(783.99, now + 0.12); // G5
      osc.frequency.setValueAtTime(1046.5, now + 0.18); // C6

      gain.gain.setValueAtTime(0.06, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.34);

      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now);
      osc.stop(now + 0.34);
    } catch {
      // Ignore
    }
  }, [soundEnabled]);

  // --------------------------------------------------------------------------
  // ZERO-USER-INPUT AUTOMATIC INTRO TYPEWRITER + 400MS PAUSES + 5S TRANSITION
  // --------------------------------------------------------------------------
  const INTRO_SCRIPT = [
    "* Hey! I'm Jah!",
    "* Welcome to my portfolio!",
    "* Ready to light it up?"
  ];

  const triggerIntroExit = useCallback(() => {
    playSaveSound();
    setIntroExiting(true);
    setTimeout(() => {
      setShowIntro(false);
      setIntroExiting(false);
    }, 520);
  }, [playSaveSound]);

  // Step 1: Automatically type out all 3 lines with ~400ms pauses between lines
  useEffect(() => {
    if (!showIntro) return;

   setTypedLines(["", "", ""]);
   setIntroDoneTyping(false);
   setCountdownLeft(2.0);

    let lineIdx = 0;
    let charIdx = 0;
    let cancelled = false;
    let timeoutId = null;

    const stepTypewriter = () => {
      if (cancelled) return;
      const currentTarget = INTRO_SCRIPT[lineIdx];

      if (charIdx < currentTarget.length) {
        const nextSlice = currentTarget.slice(0, charIdx + 1);
        setTypedLines((prev) => {
          const copy = [...prev];
          copy[lineIdx] = nextSlice;
          return copy;
        });

        if (currentTarget[charIdx] !== " " && charIdx % 2 === 0) {
          playBlip(460, 0.032, "square");
        }

        charIdx++;
        timeoutId = setTimeout(stepTypewriter, 36);
      } else {
        // Line finished: pause 400ms before automatically starting the next line
        if (lineIdx < INTRO_SCRIPT.length - 1) {
          lineIdx++;
          charIdx = 0;
          timeoutId = setTimeout(stepTypewriter, 400);
        } else {
          // All 3 lines finished! Automatically trigger the 5-second countdown
          setIntroDoneTyping(true);
        }
      }
    };

    timeoutId = setTimeout(stepTypewriter, 300);

    return () => {
      cancelled = true;
      if (timeoutId) clearTimeout(timeoutId);
    };
  }, [showIntro, playBlip]);

  // Step 2: Automatic 5-second countdown once all 3 lines finish typing
  useEffect(() => {
    if (!showIntro || !introDoneTyping || timerPaused || introExiting) return;

    const interval = setInterval(() => {
      setCountdownLeft((prev) => {
        if (prev <= 0.1) {
          clearInterval(interval);
          triggerIntroExit();
          return 0;
        }
        return Number((prev - 0.1).toFixed(1));
      });
    }, 100);

    return () => clearInterval(interval);
  }, [showIntro, introDoneTyping, timerPaused, introExiting, triggerIntroExit]);

  const handleReplayIntro = () => {
    playBlip(520, 0.05);
    window.scrollTo({ top: 0, behavior: "smooth" });
    setTimerPaused(false);
    setShowIntro(true);
  };

  // Close modal on Escape key
  useEffect(() => {
    const onKeyDown = (e) => {
      if (e.key === "Escape" && inspectedProject) {
        setInspectedProject(null);
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [inspectedProject]);

  // --------------------------------------------------------------------------
  // SCROLL LISTENER FOR AJ LEE SPIDER ANIMATION & ACTIVE SECTION TRACKING
  // --------------------------------------------------------------------------
  useEffect(() => {
    const handleScroll = () => {
      const currentY = window.scrollY;
      const maxScroll = Math.max(
        1,
        document.documentElement.scrollHeight - window.innerHeight
      );
      const progress = Math.min(1, Math.max(0, currentY / maxScroll));
      setScrollY(currentY);
      setScrollProgress(progress);

      // Determine active section
      const sectionIds = ["bionote", "how-i-work", "projects", "organizations", "events"];
      for (const id of sectionIds) {
        const el = document.getElementById(id);
        if (el) {
          const rect = el.getBoundingClientRect();
          if (rect.top <= 280 && rect.bottom >= 240) {
            setActiveSection(id);
            break;
          }
        }
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Handle Custom Portrait Image Upload (Mockup 1 Barong Placeholder)
  const handlePortraitUpload = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setCustomPortraitUrl(url);
      playSaveSound();
    }
  };

  // Handle Custom Carousel Card Image Upload (Mockup 2)
  const handleCarouselImageUpload = (slideId, e) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setCustomSlideImages((prev) => ({ ...prev, [slideId]: url }));
      playSaveSound();
    }
  };

  // Handle Custom Project Image Upload
  const handleProjectImageUpload = (projectId, e) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setCustomProjectImages((prev) => ({ ...prev, [projectId]: url }));
      playSaveSound();
    }
  };

  // Handle Custom Event Image Upload
  const handleEventImageUpload = (eventId, e) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setCustomEventImages((prev) => ({ ...prev, [eventId]: url }));
      playSaveSound();
    }
  };

  // Helper to highlight "Jah" in bright neon green (#00ff00) on Line 1 of Mockup 1
  const renderLineWithGreenJah = (lineText) => {
    if (!lineText.includes("Jah")) return lineText;
    const parts = lineText.split(/(Jah)/g);
    return parts.map((part, idx) =>
      part === "Jah" ? (
        <span key={idx} className="text-[#00ff00] drop-shadow-[0_0_8px_rgba(0,255,0,0.5)]">
          Jah
        </span>
      ) : (
        <span key={idx}>{part}</span>
      )
    );
  };

  const scrollToSection = (id) => {
    playBlip(640, 0.045);
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  return (
    <div className="min-h-screen bg-black text-white relative overflow-x-clip selection:bg-[#e93e8f] selection:text-white">
      {/* Load Undertale Pixel Fonts */}
      <style>{`
        .font-pixel {
          font-family: 'Press Start 2P', monospace;
        }
        .font-vt {
          font-family: 'VT323', monospace;
        }
        .font-sans-clean {
          font-family: 'Inter', sans-serif;
        }

        /* Authentic Undertale Double-Frame Dialogue Box from Mockup 1 */
        .undertale-mockup-box {
          background-color: #ffffff;
          padding: 10px;
          box-shadow: 0 0 35px rgba(255, 255, 255, 0.14);
        }
        .undertale-mockup-inner {
          background-color: #000000;
          border-radius: 10px;
        }

        /* Crisp Undertale Section Box */
        .ut-card {
          background-color: rgba(0, 0, 0, 0.88);
          border: 3px solid #ffffff;
          box-shadow: 6px 6px 0px rgba(233, 62, 143, 0.28);
          transition: all 0.18s ease;
        }
        .ut-card:hover {
          border-color: #e93e8f;
          box-shadow: 6px 6px 0px rgba(233, 62, 143, 0.65);
        }

        /* Custom Scrollbar */
        ::-webkit-scrollbar {
          width: 8px;
        }
        ::-webkit-scrollbar-track {
          background: #000000;
          border-left: 1px solid #27272a;
        }
        ::-webkit-scrollbar-thumb {
          background: #e93e8f;
        }
      `}</style>

      {/* ==================================================================== */}
      {/* 1. PRE-LANDING UNDERTALE GREETING OVERLAY (100% AUTO-TRANSITION)     */}
      {/* ==================================================================== */}
      {showIntro && (
        <div
          className={`fixed inset-0 z-50 bg-black flex flex-col items-center justify-center px-4 py-6 transition-all duration-500 ${
            introExiting
              ? "opacity-0 -translate-y-6 pointer-events-none"
              : "opacity-100 translate-y-0"
          }`}
        >

          {/* Dedicated Barong Tagalog Cutout Placeholder (Click to Upload + Pauses Timer while selecting) */}
          <div className="mb-6 flex flex-col items-center">
              {customPortraitUrl ? (
                <img
                  src={customPortraitUrl}
                  alt="Jah in Barong Tagalog"
                  className="w-44 h-48 sm:w-52 sm:h-56 object-contain mx-auto select-none"
                />
              ) : (
                <BarongPortraitSVG />
              )}
          </div>

          {/* Undertale White Outer Rectangle + Black Rounded Inner Box (100% Automatic) */}
          <div className="undertale-mockup-box w-full max-w-2xl select-none">
            <div className="undertale-mockup-inner px-6 py-6 sm:px-10 sm:py-8 min-h-[175px] sm:min-h-[195px] flex flex-col justify-between">
              <div className="space-y-3 sm:space-y-4 font-pixel text-sm sm:text-xl md:text-[22px] leading-relaxed tracking-wide text-white">
                {/* Line 1: * Hey! I'm Jah! */}
                <div className="min-h-[1.6em]">
                  {renderLineWithGreenJah(typedLines[0])}
                </div>

                {/* Line 2: * Welcome to my portfolio! */}
                <div className="min-h-[1.6em]">{typedLines[1]}</div>

                {/* Line 3: * Ready to light it up? */}
                <div className="min-h-[1.6em] flex items-center gap-2">
                  <span>{typedLines[2]}</span>
                  {introDoneTyping && (
                    <span className="inline-block animate-bounce text-[#ff0055]">
                      <UndertaleSoulSVG color="#ff0055" className="w-5 h-5" />
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ==================================================================== */}
      {/* 2. SCROLL-REACTIVE AJ LEE BONE-SPIDER & WEB TRAIL (LEFT TO RIGHT)    */}
      {/* ==================================================================== */}
      <div
        aria-hidden="true"
        className="fixed inset-0 pointer-events-none z-0 overflow-hidden opacity-75 sm:opacity-95 transition-opacity"
      >
        {/* Horizontal Silk Web Trail spanning from the left edge behind the crawling spider */}
        <div
          className="absolute left-0 top-1/2 -translate-y-1/2 h-[2px] bg-gradient-to-r from-[#3b0a26] via-[#e93e8f]/75 to-[#ff0055] shadow-[0_0_12px_rgba(233,62,143,0.6)]"
          style={{
            width: `calc(${2 + scrollProgress * 80}vw + 180px)`,
            transition: "width 0.08s linear"
          }}
        />

        {/* Subtle Secondary Anchor Web Strands */}
        <div
          className="absolute left-0 top-[48%] h-[1px] bg-gradient-to-r from-transparent via-[#590d38]/60 to-[#e93e8f]/40"
          style={{
            width: `calc(${2 + scrollProgress * 80}vw + 140px)`,
            transition: "width 0.08s linear"
          }}
        />

        {/* Spider Container Crawling Horizontally from Left (~2vw) to Right (~82vw) on Scroll */}
        <div
          className="absolute top-1/2 left-0 w-[320px] sm:w-[420px] lg:w-[480px] h-[460px] sm:h-[560px] -mt-[230px] sm:-mt-[280px] -ml-[60px] sm:-ml-[80px] flex items-center justify-center"
          style={{
            transform: `translate3d(${2 + scrollProgress * 80}vw, ${
              Math.sin(scrollProgress * Math.PI * 12) * 14
            }px, 0) rotate(${
              90 + Math.cos(scrollProgress * Math.PI * 12) * 6
            }deg)`,
            transition: "transform 0.08s linear"
          }}
        >
          <AJBoneSpiderSVG
            scrollProgress={scrollProgress * 2.2}
            activePulse={scrollY % 450 < 120}
          />
        </div>
      </div>

      {/* ==================================================================== */}
      {/* 3. STICKY TOP UNDERTALE NAVIGATION HUD                               */}
      {/* ==================================================================== */}
      <header className="sticky top-0 z-40 bg-black/90 backdrop-blur-md border-b-2 border-white/90 px-4 py-3">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-3">
          {/* Left Brand Status */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => scrollToSection("bionote")}
              className="flex items-center gap-2 group text-left"
            >
              <UndertaleSoulSVG color="#e93e8f" className="w-5 h-5 group-hover:scale-110 transition-transform" />
              <span className="font-pixel text-xs sm:text-sm tracking-wider text-white group-hover:text-[#e93e8f] transition-colors">
                JAH<span className="text-[#00ff00]">.EXE</span>
              </span>
            </button>
            <span className="hidden md:inline-block font-pixel text-[9px] px-2 py-0.5 bg-[#3b0a26] border border-[#e93e8f] text-[#e93e8f]">
              DESPITE EVERYTHING, IT'S STILL YOU.
            </span>
          </div>

          {/* Center / Right Navigation Buttons */}
          <nav className="flex flex-wrap items-center gap-1.5 sm:gap-2">
            {[
              { id: "bionote", label: "BIONOTE" },
              { id: "how-i-work", label: "HOW I WORK" },
              { id: "projects", label: "PROJECTS" },
              { id: "organizations", label: "ORGS" },
              { id: "events", label: "EVENTS" }
            ].map((item) => {
              const isActive = activeSection === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => scrollToSection(item.id)}
                  onMouseEnter={() => playBlip(520, 0.025)}
                  className={`px-2.5 py-1.5 border-2 font-pixel text-[9px] sm:text-[10px] flex items-center gap-1.5 transition-all ${
                    isActive
                      ? "border-[#e93e8f] bg-[#e93e8f]/15 text-[#e93e8f]"
                      : "border-white/70 bg-black text-white hover:border-[#e93e8f] hover:text-[#e93e8f]"
                  }`}
                >
                  {isActive && <UndertaleSoulSVG color="#e93e8f" className="w-3 h-3" />}
                  <span>{item.label}</span>
                </button>
              );
            })}

            {/* Replay Greeting Animation Button */}
            <button
              onClick={handleReplayIntro}
              title="Replay Undertale Barong Greeting"
              className="px-2.5 py-1.5 border-2 border-[#00ff00] bg-black text-[#00ff00] hover:bg-[#00ff00] hover:text-black font-pixel text-[9px] sm:text-[10px] flex items-center gap-1 transition-colors ml-1"
            >
              <RotateCcw className="w-3 h-3" />
              <span className="hidden sm:inline">INTRO</span>
            </button>

            {/* Audio Toggle */}
            <button
              onClick={() => setSoundEnabled(!soundEnabled)}
              title="Toggle 8-Bit Sound Effects"
              className="p-1.5 border-2 border-zinc-600 hover:border-[#e93e8f] text-zinc-300 hover:text-[#e93e8f] transition-colors"
            >
              {soundEnabled ? <Volume2 className="w-4 h-4 text-[#e93e8f]" /> : <VolumeX className="w-4 h-4" />}
            </button>
          </nav>
        </div>
      </header>

      {/* ==================================================================== */}
      {/* MAIN CONTENT CONTAINER (RIGHT-WEIGHTED ON HERO TO SHOW SPIDER)       */}
      {/* ==================================================================== */}
      <main className="relative z-10 max-w-7xl mx-auto px-4 sm:px-8 pb-28">
        {/* ================================================================== */}
        {/* SECTION 1: HERO & BIONOTE + TILTED 3-CARD CAROUSEL (MOCKUP 2)      */}
        {/* ================================================================== */}
        <section
          id="bionote"
          className="scroll-mt-24 min-h-[92vh] pt-10 pb-20 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center"
        >
          {/* Left 5 Columns reserved on desktop so the AJ Lee Bone-Spider starts on the left cleanly */}
          <div className="hidden lg:flex lg:col-span-5 flex-col justify-end h-full pb-12 pointer-events-none">
            <div className="bg-black/80 border-l-4 border-[#e93e8f] pl-4 py-2 max-w-xs">
              <p className="font-pixel text-[10px] text-[#e93e8f] uppercase">
                * LOVE BITES // BLACK WIDOW
              </p>
              <p className="font-vt text-lg text-zinc-400">
                Scroll down to watch the skeletal spider crawl horizontally from left to right across the screen.
              </p>
            </div>
          </div>

          {/* Right 7 Columns: Blocky JAH Logo, Bionote, and Tilted 3-Card Carousel (Matches Mockup 2) */}
          <div className="lg:col-span-7 flex flex-col items-end text-right space-y-6">
            {/* Blocky Pink JAH Logo with Heart Cut-out in 'A' */}
            <div className="flex flex-col items-end">
              <JahBlockLogoSVG className="w-52 sm:w-64 md:w-72 h-auto" />
            </div>

            {/* Mockup 2 Headline ("bionote na pangmalakasan wow") with Mode Toggle */}
            <div className="space-y-3 w-full max-w-2xl">
              <div className="flex flex-wrap items-center justify-end gap-3">
                <span className="font-pixel text-[10px] text-[#00ff00]">
                  * BIONOTE // LV 99
                </span>
              </div>

              <h1 className="text-2xl sm:text-4xl font-sans-clean font-medium tracking-tight text-[#e93e8f]">
                  Filled with Hopes and Dreams
              </h1>

              {/* Authentic Bionote Box */}
              <div className="ut-card p-5 sm:p-6 text-left space-y-3">
                <p className="font-vt text-2xl sm:text-[26px] leading-snug text-white">
                  <span className="text-[#e93e8f] font-bold">* </span>
                  Hey! I’m <span className="text-[#00ff00] font-bold">Jah</span>—a Bachelor of Science in Information Technology (<span className="text-[#e93e8f]">BSIT</span>) student at the{" "}
                  <span className="underline decoration-[#e93e8f]">
                    Technological University of the Philippines (TUP) Manila
                  </span>
                  .
                </p>
                <p className="font-sans-clean text-sm sm:text-base text-zinc-300 leading-relaxed">
                  A junior Information Technology student who aspires to build cloud-driven systems and secure network infrastructures that solve real-world operational challenges. My academic coursework and leadership in student tech initiatives have strengthened my ability to adapt quickly to emerging stacks and troubleshoot complex system environments.
                </p>

                {/* Quick RPG Stat Badges */}
                <div className="pt-2 flex flex-wrap gap-2 font-pixel text-[9px]">
                  <span className="px-2.5 py-1 bg-[#3b0a26] border border-[#e93e8f] text-white">
                    CLOUD COMPUTING
                  </span>
                  <span className="px-2.5 py-1 bg-zinc-900 border border-white/40 text-[#00ff00]">
                    COMPUTER NETWORKING
                  </span>
                  <span className="px-2.5 py-1 bg-zinc-900 border border-white/40 text-zinc-200">
                    AWS STUDENT BUILDER GROUP - HUGO
                  </span>
                </div>
              </div>
            </div>

            {/* ============================================================== */}
            {/* TILTED 3-CARD INTERACTIVE CAROUSEL (EXACT MOCKUP 2 GEOMETRY)   */}
            {/* ============================================================== */}
            <div className="w-full pt-4">
              <div className="flex items-center justify-between mb-3 px-2">
                <span className="font-pixel text-[10px] text-zinc-400">
                  * CLICK ANY TILTED CARD OR USE ARROWS TO CYCLE
                </span>
                <span className="font-sans-clean text-sm text-[#e93e8f] italic">
                  carousel // {activeSlideIndex + 1} of {CAROUSEL_SLIDES.length}
                </span>
              </div>

              {/* 3-Card Fanned Collage Stage matching Mockup 2 */}
              <div className="relative h-[320px] sm:h-[360px] w-full max-w-2xl ml-auto flex items-center justify-center select-none">
                {CAROUSEL_SLIDES.map((slide, index) => {
                  // Calculate relative slot (0 = Top/Center, 1 = Bottom-Right Tilted, 2 = Bottom-Left Tilted)
                  const offset =
                    (index - activeSlideIndex + CAROUSEL_SLIDES.length) %
                    CAROUSEL_SLIDES.length;

                  let positionStyles = "";
                  if (offset === 0) {
                    // Top Center Card (matches Mockup 2 top-middle dark card)
                    positionStyles =
                      "z-30 -translate-y-12 sm:-translate-y-14 translate-x-0 -rotate-2 scale-100 border-[#e93e8f] shadow-[0_15px_35px_rgba(0,0,0,0.9),0_0_20px_rgba(233,62,143,0.35)]";
                  } else if (offset === 1) {
                    // Bottom Right Tilted Card (matches Mockup 2 right tilted card)
                    positionStyles =
                      "z-20 translate-y-14 sm:translate-y-16 translate-x-10 sm:translate-x-36 rotate-[13deg] scale-90 border-zinc-600/80 opacity-90 hover:opacity-100";
                  } else {
                    // Bottom Left Tilted Card (matches Mockup 2 left tilted card)
                    positionStyles =
                      "z-10 translate-y-16 sm:translate-y-20 -translate-x-10 sm:-translate-x-36 -rotate-[16deg] scale-90 border-zinc-600/80 opacity-90 hover:opacity-100";
                  }

                  const customImg = customSlideImages[slide.id];

                  return (
                    <div
                      key={slide.id}
                      onClick={() => {
                        playBlip(560, 0.04);
                        setActiveSlideIndex(index);
                      }}
                      className={`absolute w-[240px] sm:w-[310px] h-[165px] sm:h-[195px] bg-[#262626] border-2 cursor-pointer transition-all duration-500 ease-out flex flex-col justify-between p-4 overflow-hidden group ${positionStyles}`}
                    >
                      {customImg ? (
                        <img
                          src={customImg}
                          alt={slide.title}
                          className="absolute inset-0 w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity"
                        />
                      ) : (
                        /* Subtle Diagonal Grid Texture inside Mockup Dark Grey Card */
                        <div
                          className="absolute inset-0 opacity-20 pointer-events-none"
                          style={{
                            backgroundImage:
                              "radial-gradient(#e93e8f 1px, transparent 1px)",
                            backgroundSize: "12px 12px"
                          }}
                        />
                      )}

                      {/* Top Row: Badge + Upload Custom Photo Button */}
                      <div className="relative z-10 flex items-center justify-between">
                        <span className="font-pixel text-[8px] px-2 py-0.5 bg-black/80 text-[#ff0055] border border-[#ff0055]/50">
                          {slide.badge}
                        </span>

                        <label
                          onClick={(e) => e.stopPropagation()}
                          title="Upload custom photo for this card"
                          className="cursor-pointer px-2 py-0.5 bg-black/90 hover:bg-[#ff0055] text-zinc-200 hover:text-black font-pixel text-[8px] border border-zinc-500 transition-colors flex items-center gap-1"
                        >
                          <Camera className="w-2.5 h-2.5" />
                          <span>UPLOAD</span>
                          <input
                            type="file"
                            accept="image/*"
                            onChange={(e) => handleCarouselImageUpload(slide.id, e)}
                            className="hidden"
                          />
                        </label>
                      </div>

                      {/* Center Mockup Label ("picture 1" + explicit file path placeholder) */}
                      <div className="relative z-10 text-center my-auto bg-black/65 py-1.5 px-2 border border-dashed border-zinc-600/80">
                        <span className="font-sans-clean text-base sm:text-lg text-[#ff0055] font-semibold tracking-wide block">
                          {slide.label}
                        </span>
                        <span className="font-pixel text-[8px] text-zinc-300 block mt-0.5">
                          [ {slide.placeholderPath} ]
                        </span>
                        <h3 className="font-pixel text-[9px] sm:text-[10px] text-white mt-1 line-clamp-1">
                          {slide.title}
                        </h3>
                      </div>

                      {/* Bottom Caption */}
                      <div className="relative z-10 bg-black/80 px-2.5 py-1 border-l-2 border-[#ff0055] text-left">
                        <p className="font-vt text-sm sm:text-base text-zinc-200 truncate">
                          * {slide.subtitle}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Carousel Controls Bar */}
              <div className="mt-4 flex items-center justify-end gap-3">
                <button
                  onClick={() => {
                    playBlip(480, 0.03);
                    setActiveSlideIndex(
                      (prev) =>
                        (prev - 1 + CAROUSEL_SLIDES.length) % CAROUSEL_SLIDES.length
                    );
                  }}
                  className="px-3 py-1.5 border-2 border-white bg-black hover:border-[#e93e8f] hover:text-[#e93e8f] font-pixel text-[10px] flex items-center gap-1 transition-colors"
                >
                  <ChevronLeft className="w-3.5 h-3.5" />
                  <span>PREV</span>
                </button>
                <button
                  onClick={() => {
                    playBlip(620, 0.03);
                    setActiveSlideIndex(
                      (prev) => (prev + 1) % CAROUSEL_SLIDES.length
                    );
                  }}
                  className="px-3 py-1.5 border-2 border-[#e93e8f] bg-[#e93e8f] text-black hover:bg-white hover:border-white font-pixel text-[10px] flex items-center gap-1 transition-colors"
                >
                  <span>NEXT</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* ================================================================== */}
        {/* SECTION 2: HOW I WORK (UNDERTALE RPG ACT / WORKFLOW CONSOLE)       */}
        {/* ================================================================== */}
        <section id="how-i-work" className="scroll-mt-24 py-16 space-y-8">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between border-b-4 border-white pb-4 gap-3">
            <div>
              <div className="flex items-center gap-2.5 mb-2">
                <span className="px-2.5 py-1 bg-[#e93e8f] text-black font-pixel text-[10px]">
                  ACT // 02
                </span>
                <span className="font-pixel text-xs text-[#00ff00]">
                  * ENGINEERING METHODOLOGY & GOVERNANCE WORKFLOW
                </span>
              </div>
              <h2 className="font-pixel text-xl sm:text-2xl text-white">
                HOW I WORK // BATTLE STRATEGY
              </h2>
            </div>
            <p className="font-vt text-xl text-zinc-400">
              * Select an ACT pillar below to inspect my workflow stats.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
            {/* Left 5 Columns: Selectable RPG ACT Pillars */}
            <div className="lg:col-span-5 flex flex-col justify-between gap-3">
              {HOW_I_WORK_PILLARS.map((pillar, idx) => {
                const IconComponent = pillar.icon;
                const isSelected = selectedPillarIndex === idx;
                return (
                  <button
                    key={pillar.id}
                    onClick={() => {
                      playBlip(580, 0.04);
                      setSelectedPillarIndex(idx);
                    }}
                    className={`w-full text-left p-4 border-2 transition-all flex items-center justify-between gap-3 ${
                      isSelected
                        ? "border-[#e93e8f] bg-[#3b0a26]/60 shadow-[4px_4px_0px_#e93e8f]"
                        : "border-white/80 bg-black/90 hover:border-[#e93e8f]"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      {isSelected ? (
                        <UndertaleSoulSVG color="#e93e8f" className="w-4 h-4" />
                      ) : (
                        <IconComponent className="w-4 h-4 text-zinc-400" />
                      )}
                      <div>
                        <div className="font-pixel text-[9px] text-[#e93e8f]">
                          {pillar.code}
                        </div>
                        <div className="font-pixel text-xs text-white mt-0.5 line-clamp-1">
                          {pillar.title}
                        </div>
                      </div>
                    </div>
                    <span className="font-pixel text-[8px] px-2 py-1 bg-black border border-zinc-700 text-[#00ff00] shrink-0">
                      {pillar.stat}
                    </span>
                  </button>
                );
              })}
            </div>

            {/* Right 7 Columns: Active Pillar Undertale Inspection Console */}
            <div className="lg:col-span-7 ut-card p-6 sm:p-8 flex flex-col justify-between space-y-6">
              {(() => {
                const activePillar = HOW_I_WORK_PILLARS[selectedPillarIndex];
                const ActiveIcon = activePillar.icon;
                return (
                  <>
                    <div className="space-y-4">
                      <div className="flex flex-wrap items-center justify-between gap-2 border-b-2 border-zinc-800 pb-3">
                        <div className="flex items-center gap-2.5">
                          <ActiveIcon className="w-5 h-5 text-[#e93e8f]" />
                          <span className="font-pixel text-xs text-[#e93e8f]">
                            * {activePillar.code} // INSPECTING WORKFLOW
                          </span>
                        </div>
                        <span className="font-pixel text-[10px] text-[#00ff00] bg-zinc-950 px-2.5 py-1 border border-[#00ff00]/40">
                          {activePillar.stat}
                        </span>
                      </div>

                      <h3 className="font-pixel text-base sm:text-lg text-white leading-snug">
                        {activePillar.title}
                      </h3>

                      <p className="font-vt text-2xl text-zinc-200 leading-relaxed">
                        <span className="text-[#e93e8f] font-bold">* </span>
                        {activePillar.summary}
                      </p>

                      <div className="space-y-2.5 pt-2">
                        {activePillar.bullets.map((b, bIdx) => (
                          <div
                            key={bIdx}
                            className="flex items-start gap-3 bg-zinc-950/90 p-3 border-l-4 border-[#e93e8f]"
                          >
                            <span className="font-pixel text-xs text-[#00ff00] mt-0.5">
                              ▶
                            </span>
                            <p className="font-sans-clean text-sm sm:text-base text-zinc-200">
                              {b}
                            </p>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="pt-4 border-t border-zinc-800 flex flex-wrap items-center justify-between gap-3 font-pixel text-[9px] text-zinc-400">
                      <span>STATUS: BATTLE-TESTED IN LABS & STUDENT COUNCILS</span>
                      <span className="text-[#e93e8f]">DETERMINATION: 100%</span>
                    </div>
                  </>
                );
              })()}
            </div>
          </div>
        </section>

        {/* ================================================================== */}
        {/* SECTION 3: PROJECTS (WITH 16:9 IMAGE PLACEHOLDERS + UPLOAD)        */}
        {/* ================================================================== */}
        <section id="projects" className="scroll-mt-24 py-16 space-y-8">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between border-b-4 border-white pb-4 gap-3">
            <div>
              <div className="flex items-center gap-2.5 mb-2">
                <span className="px-2.5 py-1 bg-[#ff0055] text-black font-pixel text-[10px]">
                  FIGHT // 03
                </span>
                <span className="font-pixel text-xs text-[#00ff00]">
                  * SOFTWARE, COMPUTER VISION, OR & HARDWARE BUILDS
                </span>
              </div>
              <h2 className="font-pixel text-xl sm:text-2xl text-white">
                PROJECTS & TECHNICAL LABS
              </h2>
            </div>
            <p className="font-vt text-xl text-zinc-400">
              * Click any image placeholder to preview your project screenshots, or inspect architecture.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {PROJECTS_DATA.map((project) => {
              const customProjImg = customProjectImages[project.id];
              return (
                <article
                  key={project.id}
                  className="ut-card p-6 flex flex-col justify-between group"
                >
                  <div>
                    {/* Encounter Header */}
                    <div className="flex items-center justify-between border-b border-zinc-800 pb-3 mb-4">
                      <span className="font-pixel text-[9px] text-[#ff0055]">
                        * {project.encounter}
                      </span>
                      <span className="font-pixel text-[9px] px-2 py-0.5 bg-white text-black">
                        {project.level}
                      </span>
                    </div>

                    {/* Prominent 16:9 Project Image Placeholder Box */}
                    <label
                      className="block relative w-full aspect-video mb-5 border-2 border-dashed border-zinc-600 hover:border-[#ff0055] bg-zinc-950 overflow-hidden cursor-pointer transition-colors group/img"
                      title="Click to test-upload a screenshot for this project"
                    >
                      {customProjImg ? (
                        <img
                          src={customProjImg}
                          alt={project.title}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div
                          className="w-full h-full flex flex-col items-center justify-center p-4 text-center"
                          style={{
                            backgroundImage:
                              "radial-gradient(rgba(255, 0, 85, 0.16) 1px, transparent 1px)",
                            backgroundSize: "14px 14px"
                          }}
                        >
                          <ImageIcon className="w-8 h-8 text-[#ff0055] mb-2 opacity-80 group-hover/img:scale-110 transition-transform" />
                          <span className="font-pixel text-[9px] sm:text-[10px] text-white bg-black/90 px-2.5 py-1 border border-[#8a004f]">
                            [ IMAGE PLACEHOLDER ]
                          </span>
                          <span className="font-vt text-lg sm:text-xl text-[#ff0055] mt-1">
                            {project.placeholderPath}
                          </span>
                          <span className="font-pixel text-[8px] text-zinc-400 mt-1">
                            {project.resolution} • CLICK TO UPLOAD PREVIEW
                          </span>
                        </div>
                      )}

                      {/* Top-Right Upload Badge */}
                      <span className="absolute top-2 right-2 bg-black/85 border border-zinc-600 group-hover/img:border-[#00ff00] px-2 py-1 font-pixel text-[8px] text-[#00ff00] flex items-center gap-1">
                        <Upload className="w-2.5 h-2.5" />
                        <span>{customProjImg ? "CHANGE IMG" : "UPLOAD IMG"}</span>
                      </span>

                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => handleProjectImageUpload(project.id, e)}
                        className="hidden"
                      />
                    </label>

                    {/* Title */}
                    <h3 className="font-pixel text-sm sm:text-base text-white group-hover:text-[#ff0055] transition-colors leading-relaxed mb-3">
                      {project.title}
                    </h3>

                    {/* Description */}
                    <p className="font-sans-clean text-sm sm:text-base text-zinc-300 leading-relaxed mb-4">
                      {project.shortDesc}
                    </p>

                    {/* Key Metrics Banner */}
                    <div className="bg-zinc-950 border-l-4 border-[#00ff00] px-3 py-2 mb-4 font-vt text-lg text-zinc-200">
                      * {project.metrics}
                    </div>

                    {/* Stack Pills */}
                    <div className="flex flex-wrap gap-1.5 mb-6">
                      {project.stack.map((tech) => (
                        <span
                          key={tech}
                          className="px-2.5 py-1 font-pixel text-[8px] bg-[#3b0a26] border border-[#ff0055]/60 text-white"
                        >
                          {tech}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Action Button */}
                  <div className="pt-3 border-t border-zinc-800 flex items-center justify-between gap-3">
                    <button
                      onClick={() => {
                        playBlip(640, 0.05);
                        setInspectedProject(project);
                      }}
                      className="w-full py-2.5 px-4 border-2 border-white bg-black hover:border-[#ff0055] hover:bg-[#ff0055] hover:text-black font-pixel text-[10px] flex items-center justify-center gap-2 transition-colors"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      <span>[ * INSPECT ARCHITECTURE ]</span>
                    </button>
                  </div>
                </article>
              );
            })}
          </div>
        </section>

        {/* ================================================================== */}
        {/* SECTION 4: ORGANIZATIONS / AFFILIATIONS (GUILD & FACTION HUD)      */}
        {/* ================================================================== */}
        <section id="organizations" className="scroll-mt-24 py-16 space-y-8">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between border-b-4 border-white pb-4 gap-3">
            <div>
              <div className="flex items-center gap-2.5 mb-2">
                <span className="px-2.5 py-1 bg-[#e93e8f] text-black font-pixel text-[10px]">
                  ITEM // 04
                </span>
                <span className="font-pixel text-xs text-[#00ff00]">
                  * EXECUTIVE LEADERSHIP & STUDENT GOVERNANCE
                </span>
              </div>
              <h2 className="font-pixel text-xl sm:text-2xl text-white">
                ORGANIZATIONS & AFFILIATIONS
              </h2>
            </div>
            <p className="font-vt text-xl text-zinc-400">
              * Active leadership rosters across cloud computing & university governance.
            </p>
          </div>

          <div className="space-y-6">
            {ORGANIZATIONS_DATA.map((item, idx) => (
              <div
                key={idx}
                className="ut-card p-6 sm:p-7 relative overflow-hidden"
              >
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 border-b-2 border-zinc-800 pb-4 mb-4">
                  <div>
                    <div className="flex flex-wrap items-center gap-2 mb-1.5">
                      <span
                        className="font-pixel text-[9px] px-2.5 py-0.5 text-black font-bold"
                        style={{ backgroundColor: item.color }}
                      >
                        {item.badge}
                      </span>
                      <span className="font-pixel text-[10px] text-zinc-400">
                        // {item.period}
                      </span>
                    </div>
                    <h3 className="font-pixel text-base sm:text-lg text-white">
                      {item.org}
                    </h3>
                  </div>

                  <div className="text-left md:text-right">
                    <div className="font-pixel text-xs sm:text-sm text-[#e93e8f]">
                      {item.role}
                    </div>
                    <div className="font-vt text-lg text-zinc-400">
                      {item.secondaryRole}
                    </div>
                  </div>
                </div>

                <ul className="space-y-2.5">
                  {item.highlights.map((pt, hIdx) => (
                    <li
                      key={hIdx}
                      className="flex items-start gap-3 font-sans-clean text-sm sm:text-base text-zinc-200"
                    >
                      <span className="font-pixel text-xs text-[#e93e8f] mt-1">
                        ★
                      </span>
                      <span>{pt}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </section>

        {/* ================================================================== */}
        {/* SECTION 5: EVENTS ATTENDED (WITH EVENT PHOTO PLACEHOLDERS)         */}
        {/* ================================================================== */}
        <section id="events" className="scroll-mt-24 py-16 space-y-8">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between border-b-4 border-white pb-4 gap-3">
            <div>
              <div className="flex items-center gap-2.5 mb-2">
                <span className="px-2.5 py-1 bg-[#ff0055] text-black font-pixel text-[10px]">
                  MERCY // 05
                </span>
                <span className="font-pixel text-xs text-[#00ff00]">
                  * CONFERENCES, ASSEMBLIES & MILESTONE SAVE POINTS
                </span>
              </div>
              <h2 className="font-pixel text-xl sm:text-2xl text-white">
                EVENTS ATTENDED & ORGANIZED
              </h2>
            </div>
            <p className="font-vt text-xl text-zinc-400">
              * Click any event photo placeholder to upload crowd/event shots, or touch the SAVE STAR!
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {EVENTS_DATA.map((ev) => {
              const isSaved = !!savedEvents[ev.id];
              const customEvImg = customEventImages[ev.id];
              return (
                <div
                  key={ev.id}
                  className="ut-card p-6 flex flex-col justify-between relative"
                >
                  <div>
                    {/* Top Row with Interactive Undertale SAVE Star */}
                    <div className="flex items-center justify-between mb-4">
                      <button
                        onClick={() => {
                          playSaveSound();
                          setSavedEvents((prev) => ({
                            ...prev,
                            [ev.id]: !prev[ev.id]
                          }));
                        }}
                        className="flex items-center gap-2 group focus:outline-none"
                        title="Touch SAVE Star"
                      >
                        <UndertaleSaveStarSVG className="w-7 h-7 group-hover:rotate-45 transition-transform" />
                        <span className="font-pixel text-[9px] text-[#ff0055] group-hover:underline">
                          {isSaved ? "★ SAVED" : "* SAVE POINT"}
                        </span>
                      </button>

                      <span className="font-pixel text-[9px] px-2 py-0.5 bg-zinc-900 border border-zinc-700 text-zinc-300">
                        {ev.date}
                      </span>
                    </div>

                    <EventPhoto src={ev.placeholderPath} alt={ev.title} />

                    <div className="mb-2 font-pixel text-[9px] text-[#00ff00]">
                      [{ev.tag}]
                    </div>

                    <h3 className="font-pixel text-sm sm:text-base text-white leading-snug mb-2">
                      {ev.title}
                    </h3>

                    <div className="flex items-center gap-2 font-vt text-xl text-[#ff0055] mb-3">
                      <span>Role: {ev.role}</span>
                    </div>

                    <p className="font-sans-clean text-sm text-zinc-300 leading-relaxed mb-5">
                      {ev.description}
                    </p>
                  </div>

                  <div className="pt-3 border-t border-zinc-800 flex items-center justify-between text-xs font-vt text-zinc-400">
                    <span className="flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5 text-[#ff0055]" />
                      {ev.location}
                    </span>
                    {isSaved && (
                      <span className="text-[#00ff00] font-pixel text-[8px]">
                        HP RESTORED!
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      </main>

      {/* ==================================================================== */}
      {/* PROJECT ARCHITECTURE MODAL (UNDERTALE BOSS CHECK WINDOW)             */}
      {/* ==================================================================== */}
      {inspectedProject && (
        <div
          onClick={() => setInspectedProject(null)}
          className="fixed inset-0 z-50 bg-black/85 backdrop-blur-sm flex items-center justify-center p-4"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="ut-card max-w-2xl w-full p-6 sm:p-8 space-y-5 border-4 border-[#e93e8f]"
          >
            <div className="flex items-center justify-between border-b-2 border-zinc-800 pb-3">
              <div className="flex items-center gap-2">
                <UndertaleSoulSVG color="#e93e8f" className="w-4 h-4" />
                <span className="font-pixel text-[10px] text-[#e93e8f]">
                  * {inspectedProject.encounter} // SYSTEM CHECK
                </span>
              </div>
              <button
                onClick={() => setInspectedProject(null)}
                className="px-2.5 py-1 border border-white hover:border-[#e93e8f] hover:text-[#e93e8f] font-pixel text-[10px]"
              >
                [ ESC / X ]
              </button>
            </div>

            <h3 className="font-pixel text-base sm:text-lg text-white leading-relaxed">
              {inspectedProject.title}
            </h3>

            <div className="p-3 bg-zinc-950 border border-[#00ff00]/60 font-vt text-xl text-[#00ff00]">
              * {inspectedProject.metrics}
            </div>

            <div className="space-y-2.5">
              <div className="font-pixel text-[10px] text-[#e93e8f]">
                TECHNICAL ARCHITECTURE & IMPLEMENTATION:
              </div>
              {inspectedProject.architecture.map((line, i) => (
                <div
                  key={i}
                  className="flex items-start gap-3 bg-zinc-900/70 p-3 border-l-2 border-[#e93e8f]"
                >
                  <span className="font-pixel text-xs text-[#e93e8f] mt-0.5">
                    *
                  </span>
                  <p className="font-sans-clean text-sm sm:text-base text-zinc-200">
                    {line}
                  </p>
                </div>
              ))}
            </div>

            <div className="flex flex-wrap gap-2 pt-2">
              {inspectedProject.stack.map((t) => (
                <span
                  key={t}
                  className="px-2.5 py-1 font-pixel text-[9px] bg-[#3b0a26] border border-[#e93e8f] text-white"
                >
                  {t}
                </span>
              ))}
            </div>

            <div className="pt-4 border-t border-zinc-800 flex justify-end">
              <button
                onClick={() => {
                  playSaveSound();
                  setInspectedProject(null);
                }}
                className="px-5 py-2.5 bg-[#e93e8f] text-black hover:bg-white font-pixel text-[10px] transition-colors"
              >
                [ PROCEED ♥ ]
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ==================================================================== */}
      {/* FOOTER                                                               */}
      {/* ==================================================================== */}
      <footer className="relative z-10 border-t-4 border-white bg-black py-8 px-4">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <UndertaleSoulSVG color="#e93e8f" className="w-4 h-4" />
            <span className="font-pixel text-[10px] text-zinc-300">
              JAH
            </span>
          </div>
          <div className="font-vt text-xl text-zinc-400 text-center sm:text-right">
            * Filled with <span className="text-[#00ff00]">KINDNESS</span>
          </div>
        </div>
      </footer>
    </div>
  );
}