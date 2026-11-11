import { useState, useEffect, useRef, useCallback } from 'react';
import { Volume2, VolumeX, MapPin, Network, Terminal, Server, ShieldCheck, Wrench, ClipboardList } from 'lucide-react';

const INTRO_SCRIPT = ["* Hey! I'm Jah!", "* Welcome to my portfolio!"];

const NAV_ITEMS = [
  { id: "home", label: "HOME" },
  { id: "specialities", label: "SPECIALITIES" },
  { id: "projects", label: "PROJECTS" },
  { id: "organizations", label: "ORGS" },
  { id: "events", label: "EVENTS" }
];

const SoulIcon = ({ className = "h-4 w-4" }) => (
  <svg viewBox="0 0 16 16" aria-hidden="true" className={`${className} shrink-0 text-brand`} style={{ shapeRendering: 'crispEdges' }}>
    <path fill="currentColor" d="M2 2h4v2h4V2h4v2h2v5h-2v2h-2v2h-2v2H6v-2H4v-2H2V9H0V4h2V2z" />
  </svg>
);

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

const SPECIALITIES_PILLARS = [
  {
    id: "fundamentals",
    code: "CHAPTER 01",
    title: "Network Fundamentals",
    stat: "ATK 94 // DEF 90",
    summary:
      "I build from the ground up: understanding how data moves across a network, layer by layer, before touching any device.",
    bullets: [
      "OSI and TCP/IP models: what each layer does and where problems hide",
      "IPv4 addressing and subnetting (CIDR and VLSM) to size networks correctly",
      "Core protocols: ARP, ICMP, TCP/UDP, DHCP, and DNS"
    ],
    icon: Network
  },
  {
    id: "cisco-ios",
    code: "CHAPTER 02",
    title: "Cisco IOS Configuration",
    stat: "ATK 92 // DEF 88",
    summary:
      "Hands-on lab practice with the Cisco IOS command line, from first boot to a saved and verified configuration.",
    bullets: [
      "Navigate CLI modes (user, privileged, global config) and verify with show commands",
      "Baseline device setup: hostnames, passwords, banners, SSH, and saving the running-config",
      "Interface configuration and IP addressing on routers and switches"
    ],
    icon: Terminal
  },
  {
    id: "switching-routing",
    code: "CHAPTER 03",
    title: "Switching & Routing Basics",
    stat: "ATK 90 // DEF 91",
    summary:
      "Connecting devices into segmented, reliable networks and moving traffic between them.",
    bullets: [
      "VLANs, 802.1Q trunking, and inter-VLAN routing",
      "Spanning Tree Protocol to prevent loops while keeping redundant links",
      "Static routing and an introduction to OSPF dynamic routing"
    ],
    icon: Server
  },
  {
    id: "services-security",
    code: "CHAPTER 04",
    title: "Network Services & Security",
    stat: "ATK 89 // DEF 95",
    summary:
      "Keeping the network usable and protected with core services and least-privilege access.",
    bullets: [
      "NAT/PAT, DHCP, and DNS services",
      "Access control lists (ACLs) to permit or block specific traffic",
      "Device hardening basics: SSH over Telnet, port security, and strong passwords"
    ],
    icon: ShieldCheck
  },
  {
    id: "management",
    code: "CHAPTER 06",
    title: "ClickUp Project Manager",
    stat: "ATK 96 // DEF 99",
    summary:
      "ClickUp is a project management software company that provides an all-in-one platform to improve workplace efficiency and collaboration.",
    bullets: [
      "Create tabs for each academic courses and organizations",
      "Helps keep track of tasks, events, exams, and deadlines to ensure progress is documented"],
    icon: ClipboardList
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
    placeholderPath: "/assets/events/exec-workshop.jpg",
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
    placeholderPath: "/assets/events/scd-mega-manila-2026.jpg",
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
    placeholderPath: "/assets/events/arduino-2026.jpg",
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
    placeholderPath: "/assets/events/empowher.jpg",
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
    placeholderPath: "/assets/events/techex-ieee.jpg",
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
    placeholderPath: "/assets/events/kubernetes.jpg",
    resolution: "16:9 • Event Photo",
    title: "An introduction to Kubernetes",
    role: "Attendee",
    location: "Globe Tower, BGC",
    tag: "SEMINAR",
    description:
      "learning the fundamentals of Kubernetes to discovering how it empowers developers in managing modern applications, the session gave us valuable insights into one of today’s most in-demand technologies."
  }
];

const Photo = ({ src, alt, fallback, className = "" }) => {
  const [failed, setFailed] = useState(false);
  return (
    <div className={`relative aspect-video overflow-hidden rounded-lg border border-white/10 bg-zinc-900 ${className}`}>
      {failed ? (
        <div className="absolute inset-0 grid place-items-center px-3 text-center font-mono text-sm text-zinc-500">
          {fallback}
        </div>
      ) : (
        <img src={src} alt={alt} loading="lazy" onError={() => setFailed(true)} className="h-full w-full object-cover" />
      )}
    </div>
  );
};

const Section = ({ id, code, title, children }) => (
  <section id={id} className="scroll-mt-24 py-16">
    <div className="mb-8 flex flex-wrap items-baseline gap-x-4 gap-y-1 border-b border-white/15 pb-4">
      <span className="font-mono text-base text-brand">{code}</span>
      <h2 className="font-tech text-2xl text-white sm:text-3xl">{title}</h2>
    </div>
    {children}
  </section>
);

export default function App() {
  const [showIntro, setShowIntro] = useState(true);
  const [introExiting, setIntroExiting] = useState(false);
  const [typedLines, setTypedLines] = useState(["", ""]);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [activeSection, setActiveSection] = useState("home");
  const [selectedPillarIndex, setSelectedPillarIndex] = useState(0);
  const [savedEvents, setSavedEvents] = useState({});
  const audioCtxRef = useRef(null);

  const tone = useCallback(
    (notes, dur, wave, vol) => {
      if (!soundEnabled) return;
      try {
        const Ctx = window.AudioContext || window.webkitAudioContext;
        if (!Ctx) return;
        const ctx = (audioCtxRef.current ??= new Ctx());
        if (ctx.state === "suspended") ctx.resume();
        const t = ctx.currentTime;
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = wave;
        notes.forEach((f, i) => osc.frequency.setValueAtTime(f, t + i * 0.06));
        gain.gain.setValueAtTime(vol, t);
        gain.gain.exponentialRampToValueAtTime(0.001, t + dur);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(t);
        osc.stop(t + dur);
      } catch {
        /* audio unsupported */
      }
    },
    [soundEnabled]
  );
  const playBlip = useCallback(
    (freq = 440, dur = 0.038) => tone([freq + Math.random() * 50 - 25], dur, "square", 0.035),
    [tone]
  );
  const playSaveSound = useCallback(
    () => tone([523.25, 659.25, 783.99, 1046.5], 0.34, "triangle", 0.06),
    [tone]
  );

  useEffect(() => {
    if (!showIntro) return;
    let line = 0, ch = 0, timer;
    setTypedLines(["", ""]);

    const leave = () => {
      playSaveSound();
      setIntroExiting(true);
      timer = setTimeout(() => {
        setShowIntro(false);
        setIntroExiting(false);
      }, 520);
    };
    const step = () => {
      const target = INTRO_SCRIPT[line];
      if (ch < target.length) {
        const l = line, slice = target.slice(0, ++ch);
        setTypedLines((prev) => prev.map((t, i) => (i === l ? slice : t)));
        if (target[ch - 1] !== " " && ch % 2 === 1) playBlip(460, 0.032);
        timer = setTimeout(step, 36);
      } else if (line < INTRO_SCRIPT.length - 1) {
        line++;
        ch = 0;
        timer = setTimeout(step, 400);
      } else {
        timer = setTimeout(leave, 2000);
      }
    };
    timer = setTimeout(step, 300);
    return () => clearTimeout(timer);
  }, [showIntro, playBlip, playSaveSound]);

  useEffect(() => {
    const onScroll = () => {
      for (const { id } of NAV_ITEMS) {
        const rect = document.getElementById(id)?.getBoundingClientRect();
        if (rect && rect.top <= 280 && rect.bottom >= 240) {
          setActiveSection(id);
          break;
        }
      }
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const scrollToSection = (id) => {
    playBlip(640, 0.045);
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const activePillar = SPECIALITIES_PILLARS[selectedPillarIndex];
  const ActiveIcon = activePillar.icon;

  return (
    <div className="relative min-h-screen overflow-x-clip bg-black text-white selection:bg-brand selection:text-white">
      {showIntro && (
        <div
          className={`fixed inset-0 z-50 flex flex-col items-center justify-center bg-black px-4 py-6 transition-all duration-500 ${
            introExiting ? "pointer-events-none -translate-y-6 opacity-0" : "translate-y-0 opacity-100"
          }`}
        >
          <img
            src="/assets/intro/barong-cutout.png"
            alt="Portrait of Jah in a barong tagalog"
            draggable={false}
            className="mx-auto mb-6 h-48 w-44 select-none object-contain sm:h-56 sm:w-52"
          />
          <div className="w-full max-w-2xl select-none rounded-xl bg-white p-2.5 shadow-[0_0_35px_rgba(255,255,255,0.14)]">
            <div className="min-h-[175px] space-y-4 rounded-lg bg-black px-6 py-6 font-dialog text-2xl leading-relaxed text-white sm:px-10 sm:py-8 sm:text-3xl">
              <p className="min-h-[1.6em]">
                {typedLines[0].split(/(Jah)/g).map((part, i) =>
                  part === "Jah" ? <span key={i} className="text-ut">Jah</span> : <span key={i}>{part}</span>
                )}
              </p>
              <p className="min-h-[1.6em]">{typedLines[1]}</p>
            </div>
          </div>
        </div>
      )}

      <header className="sticky top-0 z-40 border-b border-white/10 bg-black/85 backdrop-blur-md">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-3 sm:px-8">
          <button onClick={() => scrollToSection("home")} className="group flex shrink-0 items-center gap-2.5">
            <SoulIcon className="h-5 w-5 transition-transform group-hover:scale-110" />
            <span className="font-tech text-xl text-white">
              JAH<span className="text-ut">.EXE</span>
            </span>
          </button>
          <span className="hidden border-l border-white/15 pl-4 font-dialog text-lg text-zinc-400 xl:block">
            DESPITE EVERYTHING, IT'S STILL YOU.
          </span>
          <nav className="flex min-w-0 items-center gap-1 overflow-x-auto">
            {NAV_ITEMS.map(({ id, label }) => (
              <button
                key={id}
                onClick={() => scrollToSection(id)}
                onMouseEnter={() => playBlip(520, 0.025)}
                className={`shrink-0 border-b-2 px-3 py-2 font-tech text-sm transition-colors ${
                  activeSection === id
                    ? "border-brand text-white"
                    : "border-transparent text-zinc-400 hover:text-white"
                }`}
              >
                {label}
              </button>
            ))}
            <button
              onClick={() => setSoundEnabled(!soundEnabled)}
              title="Toggle 8-Bit Sound Effects"
              aria-label="Toggle sound effects"
              className="ml-2 shrink-0 rounded-md p-2 text-zinc-400 transition-colors hover:text-brand"
            >
              {soundEnabled ? <Volume2 className="h-4 w-4 text-brand" /> : <VolumeX className="h-4 w-4" />}
            </button>
          </nav>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-4 pb-20 sm:px-8">
        <section id="home" className="grid scroll-mt-24 items-center gap-x-12 gap-y-14 pb-8 pt-16 lg:grid-cols-12 lg:pt-24">
          <div className="space-y-6 lg:col-span-7">
            <div>
              <h1 className="relative font-title text-6xl leading-none text-brand sm:text-8xl">
                <span aria-hidden="true" className="absolute inset-0 select-none font-title-back text-white">Justin Rayala</span>
                <span className="relative">Justin Rayala</span>
              </h1>
              <p className="mt-4 font-dialog text-4xl text-ut sm:text-5xl">Jah</p>
            </div>
            <p className="font-tech text-2xl text-zinc-200 sm:text-3xl">Filled with Hopes and Dreams</p>

            <div className="card space-y-4 p-6 sm:p-8">
              <p className="font-mono text-base text-ut">* BIONOTE // LV 99</p>
              <p className="font-dialog text-2xl leading-snug text-white sm:text-3xl">
                <span className="text-brand">* </span>
                Hey! I’m <span className="text-ut">Jah</span>—a Bachelor of Science in Information Technology (<span className="text-brand">BSIT</span>) student at the{" "}
                <span className="underline decoration-brand decoration-2 underline-offset-4">
                  Technological University of the Philippines (TUP) Manila
                </span>
                .
              </p>
              <p className="max-w-prose leading-relaxed text-zinc-300">
                A junior Information Technology student who aspires to build cloud-driven systems and secure network infrastructures that solve real-world operational challenges. My academic coursework and leadership in student tech initiatives have strengthened my ability to adapt quickly to emerging stacks and troubleshoot complex system environments.
              </p>
              <div className="flex flex-wrap gap-2 pt-1">
                <span className="chip border-brand/60 bg-brand-deep text-white">CLOUD COMPUTING</span>
                <span className="chip text-ut">COMPUTER NETWORKING</span>
                <span className="chip">AWS STUDENT BUILDER GROUP - HUGO</span>
              </div>
            </div>
          </div>

          <div className="hidden lg:col-span-5 lg:block">
            <img
              src="/assets/intro/barong-cutout.png"
              alt="Portrait of Jah in a barong tagalog"
              className="mx-auto w-full max-w-md select-none object-contain drop-shadow-[0_8px_40px_rgba(233,62,143,0.2)]"
            />
          </div>

          <div className="grid gap-5 sm:grid-cols-3 lg:col-span-12">
            {CAROUSEL_SLIDES.map((slide) => (
              <figure key={slide.id} className="card space-y-3 p-3">
                <Photo src={slide.placeholderPath} alt={slide.title} fallback={slide.label} className="aspect-[3/2]" />
                <figcaption className="px-1 pb-1 font-mono text-base leading-snug text-zinc-300">
                  * {slide.subtitle}
                </figcaption>
              </figure>
            ))}
          </div>
        </section>

        <Section id="how-i-work" code="ACT // 02" title="SPECIALITIES  // BATTLE STRATEGY">
          <div className="grid items-stretch gap-6 lg:grid-cols-12">
            <div className="flex flex-col gap-3 lg:col-span-5">
              {SPECIALITIES_PILLARS.map((pillar, idx) => {
                const Icon = pillar.icon;
                const selected = selectedPillarIndex === idx;
                return (
                  <button
                    key={pillar.id}
                    onClick={() => {
                      playBlip(580, 0.04);
                      setSelectedPillarIndex(idx);
                    }}
                    className={`flex items-center justify-between gap-3 rounded-xl border p-4 text-left transition-colors ${
                      selected ? "border-brand bg-brand-deep/50" : "border-white/10 bg-zinc-950 hover:border-white/30"
                    }`}
                  >
                    <span className="flex items-center gap-3">
                      {selected ? <SoulIcon /> : <Icon className="h-4 w-4 text-zinc-500" />}
                      <span>
                        <span className="block font-mono text-sm text-brand">{pillar.code}</span>
                        <span className="block font-tech text-lg text-white">{pillar.title}</span>
                      </span>
                    </span>
                    <span className="chip shrink-0 text-ut">{pillar.stat}</span>
                  </button>
                );
              })}
            </div>

            <div className="card flex flex-col justify-between gap-6 p-6 sm:p-8 lg:col-span-7">
              <div className="space-y-4">
                <div className="flex flex-wrap items-center justify-between gap-2 border-b border-white/10 pb-3">
                  <span className="flex items-center gap-2.5 font-mono text-base text-brand">
                    <ActiveIcon className="h-5 w-5" />* {activePillar.code} // INSPECTING WORKFLOW
                  </span>
                  <span className="chip text-ut">{activePillar.stat}</span>
                </div>
                <h3 className="font-tech text-2xl text-white">{activePillar.title}</h3>
                <p className="font-dialog text-2xl leading-relaxed text-zinc-200">
                  <span className="text-brand">* </span>
                  {activePillar.summary}
                </p>
                <ul className="space-y-2.5 pt-2">
                  {activePillar.bullets.map((b, i) => (
                    <li key={i} className="flex items-start gap-3 rounded-md border-l-2 border-brand bg-zinc-900/70 p-3 text-zinc-200">
                      <span className="mt-0.5 text-sm text-ut">▶</span>
                      <span>{b}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="flex flex-wrap items-center justify-between gap-3 border-t border-white/10 pt-4 font-mono text-sm text-zinc-400">
                <span>STATUS: BATTLE-TESTED IN LABS & STUDENT COUNCILS</span>
                <span className="text-brand">DETERMINATION: 100%</span>
              </div>
            </div>
          </div>
        </Section>

        <Section id="projects" code="FIGHT // 03" title="PROJECTS & TECHNICAL LABS">
          <div className="grid gap-6 md:grid-cols-2">
            {PROJECTS_DATA.map((p) => (
              <article key={p.id} className="card flex flex-col gap-4 p-6">
                <div className="flex items-center justify-between gap-3 border-b border-white/10 pb-3 font-mono text-sm">
                  <span className="text-brand">* {p.encounter}</span>
                  <span className="chip">{p.level}</span>
                </div>
                <h3 className="font-tech text-xl leading-snug text-white">{p.title}</h3>
                <p className="leading-relaxed text-zinc-300">{p.shortDesc}</p>
                <p className="mt-auto rounded-md border-l-2 border-ut bg-zinc-900/70 px-3 py-2 font-mono text-base text-zinc-200">
                  * {p.metrics}
                </p>
                <div className="flex flex-wrap gap-1.5">
                  {p.stack.map((tech) => (
                    <span key={tech} className="chip border-brand/50 bg-brand-deep text-white">{tech}</span>
                  ))}
                </div>
              </article>
            ))}
          </div>
        </Section>

        <Section id="organizations" code="ITEM // 04" title="ORGANIZATIONS & AFFILIATIONS">
          <div className="space-y-6">
            {ORGANIZATIONS_DATA.map((item) => (
              <div key={item.org} className="card border-l-4 p-6 sm:p-7" style={{ borderLeftColor: item.color }}>
                <div className="mb-4 flex flex-col justify-between gap-3 border-b border-white/10 pb-4 md:flex-row md:items-center">
                  <div>
                    <div className="mb-2 flex flex-wrap items-center gap-3 font-mono text-sm">
                      <span className="chip" style={{ color: item.color, borderColor: item.color }}>{item.badge}</span>
                      <span className="text-zinc-400">// {item.period}</span>
                    </div>
                    <h3 className="font-tech text-xl text-white sm:text-2xl">{item.org}</h3>
                  </div>
                  <div className="md:text-right">
                    <div className="font-tech text-lg text-brand">{item.role}</div>
                    <div className="font-mono text-base text-zinc-400">{item.secondaryRole}</div>
                  </div>
                </div>
                <ul className="space-y-2.5">
                  {item.highlights.map((pt, i) => (
                    <li key={i} className="flex items-start gap-3 text-zinc-200">
                      <span className="mt-0.5 text-sm text-brand">★</span>
                      <span>{pt}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </Section>

        <Section id="events" code="MERCY // 05" title="EVENTS ATTENDED & ORGANIZED">
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {EVENTS_DATA.map((ev) => {
              const isSaved = !!savedEvents[ev.id];
              return (
                <article key={ev.id} className="card flex flex-col p-5">
                  <div className="mb-4 flex items-center justify-between">
                    <button
                      onClick={() => {
                        playSaveSound();
                        setSavedEvents((prev) => ({ ...prev, [ev.id]: !prev[ev.id] }));
                      }}
                      title="Touch SAVE Star"
                      className="group flex items-center gap-2 font-mono text-sm text-brand focus-visible:outline-2 focus-visible:outline-brand"
                    >
                      <SoulIcon className="h-5 w-5 transition-transform group-hover:scale-125" />
                      <span className="group-hover:underline">{isSaved ? "★ SAVED" : "* SAVE POINT"}</span>
                    </button>
                    <span className="chip">{ev.date}</span>
                  </div>
                  <Photo src={ev.placeholderPath} alt={ev.title} fallback={`[ PHOTO NOT FOUND: ${ev.placeholderPath} ]`} className="mb-4" />
                  <p className="mb-2 font-mono text-sm text-ut">[{ev.tag}]</p>
                  <h3 className="mb-2 font-tech text-lg leading-snug text-white">{ev.title}</h3>
                  <p className="mb-3 font-dialog text-xl text-brand">Role: {ev.role}</p>
                  <p className="mb-5 text-sm leading-relaxed text-zinc-300">{ev.description}</p>
                  <div className="mt-auto flex items-center justify-between gap-2 border-t border-white/10 pt-3 font-mono text-sm text-zinc-400">
                    <span className="flex items-center gap-1.5">
                      <MapPin className="h-3.5 w-3.5 shrink-0 text-brand" />
                      {ev.location}
                    </span>
                    {isSaved && <span className="shrink-0 text-ut">HP RESTORED!</span>}
                  </div>
                </article>
              );
            })}
          </div>
        </Section>
      </main>

      <footer className="border-t border-white/10 bg-black px-4 py-8">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 sm:flex-row sm:px-4">
          <div className="flex items-center gap-3">
            <SoulIcon />
            <span className="font-tech text-base text-zinc-300">JAH</span>
          </div>
          <div className="font-dialog text-xl text-zinc-400">
            * Filled with <span className="text-ut">KINDNESS</span>
          </div>
        </div>
      </footer>
    </div>
  );
}