import React, { useRef, useState, useEffect } from "react";
import { ImageWithFallback } from './components/figma/ImageWithFallback';
import productImage from 'figma:asset/0d108e7bc776ba543ff09e4ad43f249b95d59e4b.png';
import productImage2 from 'figma:asset/b3cc17721e89a87637d3b3cf53c9711ce1cc9549.png';

export default function AerFrameLanding() {
  const BRAND = "#57A4DA";
  const COLORS = { bg: "#FFFFFF", fg: "#0F172A", sub: "#374151" };
  const STATE_BILLING = [
    {
      id: "CA",
      name: "California",
      codes: [
        { code: "77373", description: "SBRT delivery (5 fractions)", qty: 5, rate: 1125 },
        { code: "77290", description: "Complex simulation", qty: 1, rate: 575 },
        { code: "77293", description: "3D treatment planning", qty: 1, rate: 780 },
        { code: "77014", description: "CT guidance (per fraction)", qty: 5, rate: 175 },
      ],
    },
    {
      id: "TX",
      name: "Texas",
      codes: [
        { code: "77373", description: "SBRT delivery (5 fractions)", qty: 5, rate: 1040 },
        { code: "77290", description: "Complex simulation", qty: 1, rate: 540 },
        { code: "77293", description: "3D treatment planning", qty: 1, rate: 730 },
        { code: "77014", description: "CT guidance (per fraction)", qty: 5, rate: 165 },
      ],
    },
    {
      id: "FL",
      name: "Florida",
      codes: [
        { code: "77373", description: "SBRT delivery (5 fractions)", qty: 5, rate: 1015 },
        { code: "77290", description: "Complex simulation", qty: 1, rate: 520 },
        { code: "77293", description: "3D treatment planning", qty: 1, rate: 710 },
        { code: "77014", description: "CT guidance (per fraction)", qty: 5, rate: 160 },
      ],
    },
    {
      id: "NY",
      name: "New York",
      codes: [
        { code: "77373", description: "SBRT delivery (5 fractions)", qty: 5, rate: 1180 },
        { code: "77290", description: "Complex simulation", qty: 1, rate: 590 },
        { code: "77293", description: "3D treatment planning", qty: 1, rate: 810 },
        { code: "77014", description: "CT guidance (per fraction)", qty: 5, rate: 190 },
      ],
    },
  ];
  const CASE_MIX = [
    { id: "lung", label: "SBRT Lung", multiplier: 1.05, detail: "Higher image guidance utilization" },
    { id: "prostate", label: "SBRT Prostate", multiplier: 0.95, detail: "Lower per-fraction imaging time" },
    { id: "spine", label: "SBRT Spine", multiplier: 1.15, detail: "Complex setup & immobilization" },
  ];

  const [stats, setStats] = useState({ hospitals: 127, countries: 23, installs: 1849 });
  const [heroRef, setHeroRef] = useState(null);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [selectedState, setSelectedState] = useState("CA");
  const [purchasePrice, setPurchasePrice] = useState(65000);
  const [patientMix, setPatientMix] = useState({ lung: 40, prostate: 35, spine: 25 });

  useEffect(() => {
    try {
      if (typeof window !== "undefined" && window.__AER_STATS__) setStats(window.__AER_STATS__);
    } catch {}
  }, []);

  useEffect(() => {
    const handleMouseMove = (e) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  const selectedStateData = STATE_BILLING.find((state) => state.id === selectedState) || STATE_BILLING[0];
  const patientMixTotal = Object.values(patientMix).reduce((sum, value) => sum + value, 0);
  const normalizedMix = CASE_MIX.map((item) => {
    const value = patientMix[item.id] ?? 0;
    return {
      ...item,
      share: patientMixTotal > 0 ? value / patientMixTotal : 0,
    };
  });
  const baseCaseRevenue = selectedStateData.codes.reduce((sum, code) => sum + code.qty * code.rate, 0);
  const weightedMultiplier = normalizedMix.reduce((sum, item) => sum + item.share * item.multiplier, 0);
  const averageRevenue = baseCaseRevenue * weightedMultiplier;
  const breakEvenCases = averageRevenue > 0 ? purchasePrice / averageRevenue : 0;
  const breakEvenRounded = Math.ceil(breakEvenCases);
  const formatCurrency = (value) =>
    new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 }).format(value);

  return (
    <div className="min-h-screen w-full overflow-x-hidden" style={{ background: COLORS.bg, color: COLORS.fg }}>
      <Style brand={BRAND} />
      <ScrollMotionVars />
      <ScrollProgressBar brand={BRAND} />
      <CinematicCuts brand={BRAND} />
      <ParticleSystem mousePosition={mousePosition} brand={BRAND} />
      
      <header className="sticky top-0 z-40">
        <div className="glass">
          <div className="max-w-7xl mx-auto px-6 h-16 flex items-center gap-6">
            <MorphingLogo brand={BRAND} />
            <nav className="ml-auto hidden md:flex items-center gap-8 text-sm opacity-90">
              <HoverLink href="#features">Features</HoverLink>
              <HoverLink href="#benefits">Benefits</HoverLink>
              <HoverLink href="#calculator">Calculator</HoverLink>
              <HoverLink href="#voices">Stories</HoverLink>
              <HoverLink href="#cta">Contact</HoverLink>
            </nav>
          </div>
        </div>
      </header>

      <section className="relative overflow-hidden" ref={setHeroRef}>
        <div className="absolute inset-0 pointer-events-none" aria-hidden>
          <div className="absolute -right-40 top-0 bottom-0 w-[52%] stripeField" />
          <div className="absolute inset-0 energyField" style={{ background: "radial-gradient(120% 120% at 10% 10%, rgba(87,164,218,0.10) 0%, rgba(255,255,255,0) 60%)" }} />
          <FloatingElements />
        </div>
        <div className="relative max-w-7xl mx-auto px-6 pt-16 pb-8 md:pt-24 md:pb-10">
          <div className="flex flex-col lg:flex-row items-center gap-10 lg:gap-16">
            <div className="flex-1 text-center lg:text-left">
              <Reveal as="div" delay={0}>
                <div className="uppercase tracking-[0.28em] text-2xl font-semibold mb-3 glowText" style={{ color: BRAND }}>AERFRAME</div>
              </Reveal>
              <Reveal as="h1" delay={60} className="font-extrabold leading-[0.9]" style={{ fontSize: "clamp(48px, 8vw, 120px)" }}>
                <Parallax yFrom={0} yTo={-28} scaleFrom={1} scaleTo={1.045} rootRef={heroRef}>
                  <TypewriterText 
                    text="Near‑Invisible Immobilization"
                    className="headlineSweepTxt"
                    style={{
                      background: `linear-gradient(90deg, ${BRAND}, ${BRAND} 35%, #ffffff 50%, ${BRAND} 65%, ${BRAND} 100%)`,
                      WebkitBackgroundClip: "text",
                      color: "transparent"
                    }}
                  />
                </Parallax>
              </Reveal>
              <Reveal as="p" delay={120} className="mt-4 text-lg md:text-xl max-w-xl lg:max-w-none" style={{ color: COLORS.sub }}>
                <Parallax yFrom={6} yTo={-10} scaleFrom={1} scaleTo={1.01} rootRef={heroRef}>
                  Ultra‑low attenuation. Ultra‑low weight. Built for SBRT adaptive therapy—so clinicians can see more and do more.
                </Parallax>
              </Reveal>
              <Reveal as="div" delay={180} className="mt-6 flex flex-wrap gap-3 justify-center lg:justify-start">
                <Parallax yFrom={8} yTo={-8} scaleFrom={1} scaleTo={1.005} rootRef={heroRef}>
                  <MagneticLink>
                    <a href="#features" className="px-5 py-3 rounded-full font-semibold magnetBtn pulseBtn" style={{ background: BRAND, color: "#fff" }}>Learn More</a>
                  </MagneticLink>
                  <MagneticLink>
                    <a href="#cta" className="px-5 py-3 rounded-full font-semibold ml-3 magnetOutline" style={{ border: `1px solid ${COLORS.fg}22` }}>Book live demo</a>
                  </MagneticLink>
                </Parallax>
              </Reveal>
              <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4 max-w-2xl mx-auto lg:mx-0">
                {[
                  ["Low attenuation", "Nearly invisible to X‑rays", "🔬"],
                  ["Ultra‑low weight", "Effortless lift + position", "⚡"],
                  ["Cost‑effective", "Value without compromise", "💎"],
                ].map(([t, s, icon], i) => (
                  <Reveal key={i} delay={220 + i*90} className="rounded-2xl glass p-4 border shine cardLift featureCard" style={{ borderColor: `${COLORS.fg}22` }}>
                    <div className="text-2xl mb-2 iconFloat">{icon}</div>
                    <div className="text-[10px] uppercase tracking-[0.22em]" style={{ color: COLORS.sub }}>Feature</div>
                    <div className="text-lg font-extrabold" style={{ color: BRAND }}>{t}</div>
                    <div className="text-xs opacity-80 mt-1">{s}</div>
                  </Reveal>
                ))}
              </div>
            </div>
            
            <div className="flex-1 w-full max-w-2xl">
              <Reveal as="div" delay={260}>
                <TiltContainer className="relative rounded-2xl overflow-hidden glass p-6 lg:p-8 productShowcase" intensity={8} scale={1.0}>
                  <div className="relative">
                    <Parallax yFrom={0} yTo={-15} scaleFrom={1} scaleTo={1.02} rootRef={heroRef}>
                      <ImageWithFallback
                        src={productImage}
                        alt="AerFrame patient immobilization device - ultra-low attenuation design for SBRT adaptive therapy"
                        className="w-full h-auto object-contain filter drop-shadow-2xl productImage"
                        style={{ 
                          filter: "drop-shadow(0 25px 50px rgba(87, 164, 218, 0.15))",
                          transform: "perspective(1000px) rotateX(5deg)"
                        }}
                      />
                    </Parallax>
                    <div className="absolute inset-0 bg-gradient-to-t from-white/10 to-transparent pointer-events-none" />
                    <div className="absolute top-4 right-4 w-3 h-3 rounded-full statusDot" style={{ background: BRAND }}></div>
                  </div>
                  <div className="mt-4 text-center">
                    <div className="text-xs uppercase tracking-[0.25em] mb-1" style={{ color: COLORS.sub }}>Product</div>
                    <div className="text-lg font-extrabold" style={{ color: BRAND }}>AerFrame Immobilization System</div>
                    <div className="text-sm opacity-80 mt-1">Patient positioning device for radiation therapy</div>
                  </div>
                </TiltContainer>
              </Reveal>
            </div>
          </div>
        </div>
      </section>

      <section className="relative py-16 md:py-24" data-cut>
        <div className="max-w-7xl mx-auto px-6">
          <Reveal delay={0} className="text-center mb-12">
            <div className="text-xs uppercase tracking-[0.25em] mb-2" style={{ color: COLORS.sub }}>Product Overview</div>
            <h2 className="text-3xl md:text-4xl font-extrabold" style={{ color: BRAND }}>Complete System Components</h2>
            <p className="text-lg mt-2 opacity-80">Modular design for maximum flexibility and precision</p>
          </Reveal>
          
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            <Reveal delay={100}>
              <TiltContainer className="relative rounded-2xl overflow-hidden glass p-6 lg:p-8" intensity={6} scale={1.0}>
                <ImageWithFallback
                  src={productImage2}
                  alt="AerFrame complete platform system with positioning components and blue immobilization arc"
                  className="w-full h-auto object-contain"
                  style={{ 
                    filter: "drop-shadow(0 20px 40px rgba(87, 164, 218, 0.12))",
                  }}
                />
                <div className="mt-4 text-center">
                  <div className="text-xs uppercase tracking-[0.25em] mb-1" style={{ color: COLORS.sub }}>Full System</div>
                  <div className="text-lg font-extrabold" style={{ color: BRAND }}>Platform & Positioning Components</div>
                  <div className="text-sm opacity-80 mt-1">Complete immobilization platform with adjustable components</div>
                </div>
              </TiltContainer>
            </Reveal>

            <div className="space-y-6">
              <Reveal delay={200}>
                <div className="rounded-2xl glass p-6 border shine cardLift" style={{ borderColor: `${COLORS.fg}22` }}>
                  <div className="flex items-start gap-4">
                    <div className="w-8 h-8 rounded-full flex items-center justify-center pulsingDot" style={{ background: `${BRAND}22` }}>
                      <div className="w-3 h-3 rounded-full" style={{ background: BRAND }} />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-lg font-extrabold mb-2" style={{ color: BRAND }}>Modular Platform</h3>
                      <p className="text-sm opacity-80">Ultra-lightweight base platform designed for easy handling and optimal patient comfort during extended treatments.</p>
                    </div>
                  </div>
                </div>
              </Reveal>

              <Reveal delay={280}>
                <div className="rounded-2xl glass p-6 border shine cardLift" style={{ borderColor: `${COLORS.fg}22` }}>
                  <div className="flex items-start gap-4">
                    <div className="w-8 h-8 rounded-full flex items-center justify-center pulsingDot" style={{ background: `${BRAND}22` }}>
                      <div className="w-3 h-3 rounded-full" style={{ background: BRAND }} />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-lg font-extrabold mb-2" style={{ color: BRAND }}>Precision Positioning</h3>
                      <p className="text-sm opacity-80">Adjustable immobilization components ensure reproducible patient positioning for accurate dose delivery.</p>
                    </div>
                  </div>
                </div>
              </Reveal>

              <Reveal delay={360}>
                <div className="rounded-2xl glass p-6 border shine cardLift" style={{ borderColor: `${COLORS.fg}22` }}>
                  <div className="flex items-start gap-4">
                    <div className="w-8 h-8 rounded-full flex items-center justify-center pulsingDot" style={{ background: `${BRAND}22` }}>
                      <div className="w-3 h-3 rounded-full" style={{ background: BRAND }} />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-lg font-extrabold mb-2" style={{ color: BRAND }}>Adaptive Integration</h3>
                      <p className="text-sm opacity-80">Seamlessly integrates with adaptive SBRT workflows, enabling real-time adjustments and optimal treatment delivery.</p>
                    </div>
                  </div>
                </div>
              </Reveal>
            </div>
          </div>
        </div>
      </section>

      <section id="benefits" className="relative py-16 md:py-24" data-cut>
        <div className="max-w-7xl mx-auto px-6">
          <Reveal delay={0} className="text-center mb-16">
            <div className="text-xs uppercase tracking-[0.25em] mb-2" style={{ color: COLORS.sub }}>Performance Metrics</div>
            <h2 className="text-3xl md:text-4xl font-extrabold" style={{ color: BRAND }}>Why AerFrame Delivers</h2>
            <p className="text-lg mt-2 opacity-80">Real-world benefits proven across clinical environments</p>
          </Reveal>
          
          <InteractiveBenefits brand={BRAND} colors={COLORS} />
        </div>
      </section>

      <section id="features" className="relative" data-cut>
        <div className="max-w-7xl mx-auto px-6 py-16 md:py-24 grid md:grid-cols-3 gap-6">
          <Reveal delay={0} className="rounded-2xl p-7 glass border shine cardLift featureCard" style={{ borderColor: `${COLORS.fg}22` }}>
            <div className="text-xs uppercase tracking-[0.25em] mb-1" style={{ color: COLORS.sub }}>Why AerFrame</div>
            <div className="text-2xl font-extrabold mb-2" style={{ color: BRAND }}>See more of what matters</div>
            <p className="opacity-80">Low‑attenuation design keeps anatomy in view, minimizing artifacts and enabling precise targeting in adaptive SBRT workflows.</p>
            <div className="mt-4 w-full h-1 rounded-full" style={{ background: `${COLORS.fg}11` }}>
              <div className="h-full rounded-full progressBar" style={{ background: `linear-gradient(90deg, ${BRAND}, ${BRAND}88)`, width: "92%" }}></div>
            </div>
          </Reveal>
          <Reveal delay={100} className="rounded-2xl p-7 glass border shine cardLift featureCard" style={{ borderColor: `${COLORS.fg}22` }}>
            <div className="text-xs uppercase tracking-[0.25em] mb-1" style={{ color: COLORS.sub }}>Setup</div>
            <div className="text-2xl font-extrabold mb-2" style={{ color: BRAND }}>Lightweight, fewer steps</div>
            <p className="opacity-80">Ultra‑low weight reduces handling fatigue and makes daily setup faster for therapists and physicists.</p>
            <div className="mt-4 w-full h-1 rounded-full" style={{ background: `${COLORS.fg}11` }}>
              <div className="h-full rounded-full progressBar" style={{ background: `linear-gradient(90deg, ${BRAND}, ${BRAND}88)`, width: "87%" }}></div>
            </div>
          </Reveal>
          <Reveal delay={200} className="rounded-2xl p-7 glass border shine cardLift featureCard" style={{ borderColor: `${COLORS.fg}22` }}>
            <div className="text-xs uppercase tracking-[0.25em] mb-1" style={{ color: COLORS.sub }}>Value</div>
            <div className="text-2xl font-extrabold mb-2" style={{ color: BRAND }}>Cost‑effective</div>
            <p className="opacity-80">Modular components are easy to maintain and built to last, providing value without compromise.</p>
            <div className="mt-4 w-full h-1 rounded-full" style={{ background: `${COLORS.fg}11` }}>
              <div className="h-full rounded-full progressBar" style={{ background: `linear-gradient(90deg, ${BRAND}, ${BRAND}88)`, width: "95%" }}></div>
            </div>
          </Reveal>
        </div>
      </section>

      <section id="calculator" className="relative py-16 md:py-24" data-cut>
        <div className="max-w-7xl mx-auto px-6">
          <Reveal delay={0} className="text-center mb-12">
            <div className="text-xs uppercase tracking-[0.25em] mb-2" style={{ color: COLORS.sub }}>Billing + ROI</div>
            <h2 className="text-3xl md:text-4xl font-extrabold" style={{ color: BRAND }}>AerFrame Billing Code Calculator</h2>
            <p className="text-lg mt-2 opacity-80">
              Model patient mix, state-specific billing codes, and payback timing for SBRT + simulation workflows.
            </p>
          </Reveal>

          <div className="grid lg:grid-cols-[1.1fr_0.9fr] gap-8">
            <div className="space-y-6">
              <Reveal delay={80} className="rounded-3xl glass border p-6 md:p-8 shine cardLift" style={{ borderColor: `${COLORS.fg}22` }}>
                <div className="flex items-center justify-between flex-wrap gap-3 mb-6">
                  <div>
                    <div className="text-xs uppercase tracking-[0.25em]" style={{ color: COLORS.sub }}>Inputs</div>
                    <h3 className="text-2xl font-extrabold" style={{ color: BRAND }}>Clinic assumptions</h3>
                  </div>
                  <div className="text-sm px-3 py-1 rounded-full border" style={{ borderColor: `${COLORS.fg}22`, color: COLORS.sub }}>
                    SBRT + simulation
                  </div>
                </div>

                <label className="block text-sm font-semibold mb-2" style={{ color: COLORS.sub }}>Clinic state</label>
                <select
                  value={selectedState}
                  onChange={(event) => setSelectedState(event.target.value)}
                  className="w-full rounded-xl border px-4 py-3 bg-white/70 text-sm"
                  style={{ borderColor: `${COLORS.fg}22` }}
                >
                  {STATE_BILLING.map((state) => (
                    <option key={state.id} value={state.id}>
                      {state.name}
                    </option>
                  ))}
                </select>

                <div className="mt-6">
                  <label className="block text-sm font-semibold mb-2" style={{ color: COLORS.sub }}>AerFrame purchase price</label>
                  <div className="flex items-center gap-3">
                    <span className="text-lg font-semibold" style={{ color: BRAND }}>$</span>
                    <input
                      type="number"
                      min="0"
                      value={purchasePrice}
                      onChange={(event) => setPurchasePrice(Number(event.target.value))}
                      className="w-full rounded-xl border px-4 py-3 bg-white/70 text-sm"
                      style={{ borderColor: `${COLORS.fg}22` }}
                    />
                  </div>
                </div>
              </Reveal>

              <Reveal delay={140} className="rounded-3xl glass border p-6 md:p-8 shine cardLift" style={{ borderColor: `${COLORS.fg}22` }}>
                <div className="flex items-center justify-between flex-wrap gap-3 mb-6">
                  <div>
                    <div className="text-xs uppercase tracking-[0.25em]" style={{ color: COLORS.sub }}>Patient mix</div>
                    <h3 className="text-2xl font-extrabold" style={{ color: BRAND }}>SBRT case distribution</h3>
                  </div>
                  <div className="text-sm px-3 py-1 rounded-full border" style={{ borderColor: `${COLORS.fg}22`, color: COLORS.sub }}>
                    Total: {patientMixTotal}%
                  </div>
                </div>

                <div className="space-y-4">
                  {CASE_MIX.map((item) => (
                    <div key={item.id} className="rounded-2xl border p-4 glass" style={{ borderColor: `${COLORS.fg}12` }}>
                      <div className="flex flex-wrap items-start justify-between gap-2">
                        <div>
                          <div className="text-sm font-semibold" style={{ color: BRAND }}>{item.label}</div>
                          <div className="text-xs opacity-80">{item.detail}</div>
                        </div>
                        <div className="flex items-center gap-2">
                          <input
                            type="number"
                            min="0"
                            max="100"
                            value={patientMix[item.id]}
                            onChange={(event) =>
                              setPatientMix((prev) => ({ ...prev, [item.id]: Number(event.target.value) }))
                            }
                            className="w-20 rounded-lg border px-3 py-2 text-sm bg-white/70 text-right"
                            style={{ borderColor: `${COLORS.fg}22` }}
                          />
                          <span className="text-xs" style={{ color: COLORS.sub }}>%</span>
                        </div>
                      </div>
                      <div className="mt-3 h-2 rounded-full" style={{ background: `${COLORS.fg}11` }}>
                        <div
                          className="h-full rounded-full"
                          style={{ background: BRAND, width: `${Math.min(100, Math.max(0, patientMix[item.id]))}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>

                <p className="text-xs mt-4 opacity-70">
                  If totals don’t equal 100%, the calculator normalizes the mix automatically.
                </p>
              </Reveal>
            </div>

            <div className="space-y-6">
              <Reveal delay={180} className="rounded-3xl glass border p-6 md:p-8 shine cardLift" style={{ borderColor: `${COLORS.fg}22` }}>
                <div className="text-xs uppercase tracking-[0.25em] mb-2" style={{ color: COLORS.sub }}>ROI estimate</div>
                <h3 className="text-2xl font-extrabold mb-4" style={{ color: BRAND }}>Investment outlook</h3>

                <div className="space-y-4">
                  <div className="rounded-2xl border p-4 glass" style={{ borderColor: `${COLORS.fg}12` }}>
                    <div className="text-xs uppercase tracking-[0.2em]" style={{ color: COLORS.sub }}>Estimated revenue per case</div>
                    <div className="text-2xl font-extrabold mt-2">{formatCurrency(Math.round(averageRevenue))}</div>
                    <div className="text-xs opacity-70 mt-1">
                      Based on {selectedStateData.name} rates + normalized mix multiplier ({weightedMultiplier.toFixed(2)}x)
                    </div>
                  </div>
                  <div className="rounded-2xl border p-4 glass" style={{ borderColor: `${COLORS.fg}12` }}>
                    <div className="text-xs uppercase tracking-[0.2em]" style={{ color: COLORS.sub }}>Cases to break even</div>
                    <div className="text-3xl font-extrabold mt-2" style={{ color: BRAND }}>{breakEvenRounded} cases</div>
                    <div className="text-xs opacity-70 mt-1">≈ {breakEvenCases.toFixed(1)} cases based on gross reimbursement</div>
                  </div>
                  <div className="rounded-2xl border p-4 glass" style={{ borderColor: `${COLORS.fg}12` }}>
                    <div className="text-xs uppercase tracking-[0.2em]" style={{ color: COLORS.sub }}>Base SBRT + simulation bundle</div>
                    <div className="text-lg font-semibold mt-2">{formatCurrency(Math.round(baseCaseRevenue))}</div>
                    <div className="text-xs opacity-70 mt-1">Sum of listed CPT codes per typical SBRT course</div>
                  </div>
                </div>
              </Reveal>

              <Reveal delay={220} className="rounded-3xl glass border p-6 md:p-8 shine cardLift" style={{ borderColor: `${COLORS.fg}22` }}>
                <div className="flex items-center justify-between gap-4 mb-4 flex-wrap">
                  <div>
                    <div className="text-xs uppercase tracking-[0.25em]" style={{ color: COLORS.sub }}>Billing codes by state</div>
                    <h3 className="text-2xl font-extrabold" style={{ color: BRAND }}>{selectedStateData.name}</h3>
                  </div>
                  <div className="text-sm px-3 py-1 rounded-full border" style={{ borderColor: `${COLORS.fg}22`, color: COLORS.sub }}>
                    Illustrative estimates
                  </div>
                </div>

                <div className="space-y-3">
                  {selectedStateData.codes.map((code) => (
                    <div key={code.code} className="flex items-center justify-between gap-3 rounded-2xl border p-4 glass" style={{ borderColor: `${COLORS.fg}12` }}>
                      <div>
                        <div className="text-sm font-semibold" style={{ color: BRAND }}>CPT {code.code}</div>
                        <div className="text-xs opacity-70">{code.description}</div>
                      </div>
                      <div className="text-right">
                        <div className="text-sm font-semibold">{formatCurrency(code.rate)}</div>
                        <div className="text-xs opacity-70">x{code.qty}</div>
                      </div>
                    </div>
                  ))}
                </div>

                <p className="text-xs mt-4 opacity-70">
                  Estimates are directional and should be validated with payer contracts and local coverage determinations.
                </p>
              </Reveal>
            </div>
          </div>
        </div>
      </section>

      <section id="voices" className="relative" data-cut>
        <div className="max-w-7xl mx-auto px-6 py-16 md:py-24">
          <Reveal delay={0} className="text-center mb-8">
            <div className="text-xs uppercase tracking-[0.25em]" style={{ color: COLORS.sub }}>Voices from the field</div>
            <h2 className="text-3xl md:text-4xl font-extrabold mt-2" style={{ color: BRAND }}>What clinicians are saying</h2>
          </Reveal>
          <QuoteCarousel brand={BRAND} />
        </div>
      </section>

      <section className="relative" data-cut>
        <div className="max-w-7xl mx-auto px-6 pb-6 md:pb-10">
          <Reveal delay={0} className="rounded-3xl glass border p-6 md:p-10 flex flex-wrap items-center justify-between gap-6 statsSection" style={{ borderColor: `${COLORS.fg}22` }}>
            <div>
              <div className="text-xs uppercase tracking-[0.25em] mb-2" style={{ color: COLORS.sub }}>At‑a‑glance</div>
              <div className="text-2xl md:text-3xl font-extrabold" style={{ color: BRAND }}>Designed for SBRT adaptive therapy</div>
              <div className="text-sm mt-1" style={{ color: COLORS.sub }}>Patient immobilization device</div>
            </div>
            <div className="grid grid-cols-3 gap-4 w-full md:w-auto">
              <Reveal delay={80} className="rounded-xl border p-4 glass min-w-[120px] text-center shine cardLift statCard" style={{ borderColor: `${COLORS.fg}22` }}>
                <div className="text-[10px] uppercase tracking-[0.18em]" style={{ color: COLORS.sub }}>Hospitals</div>
                <div className="text-2xl font-extrabold counterNumber" style={{ color: BRAND }}>
                  <StatCounter target={stats.hospitals} />
                </div>
                <div className="w-full h-1 mt-2 rounded-full" style={{ background: `${COLORS.fg}11` }}>
                  <div className="h-full rounded-full statProgress" style={{ background: BRAND }}></div>
                </div>
              </Reveal>
              <Reveal delay={160} className="rounded-xl border p-4 glass min-w-[120px] text-center shine cardLift statCard" style={{ borderColor: `${COLORS.fg}22` }}>
                <div className="text-[10px] uppercase tracking-[0.18em]" style={{ color: COLORS.sub }}>Countries</div>
                <div className="text-2xl font-extrabold counterNumber" style={{ color: BRAND }}>
                  <StatCounter target={stats.countries} />
                </div>
                <div className="w-full h-1 mt-2 rounded-full" style={{ background: `${COLORS.fg}11` }}>
                  <div className="h-full rounded-full statProgress" style={{ background: BRAND }}></div>
                </div>
              </Reveal>
              <Reveal delay={240} className="rounded-xl border p-4 glass min-w-[120px] text-center shine cardLift statCard" style={{ borderColor: `${COLORS.fg}22` }}>
                <div className="text-[10px] uppercase tracking-[0.18em]" style={{ color: COLORS.sub }}>Installs</div>
                <div className="text-2xl font-extrabold counterNumber" style={{ color: BRAND }}>
                  <StatCounter target={stats.installs} />
                </div>
                <div className="w-full h-1 mt-2 rounded-full" style={{ background: `${COLORS.fg}11` }}>
                  <div className="h-full rounded-full statProgress" style={{ background: BRAND }}></div>
                </div>
              </Reveal>
            </div>
          </Reveal>
        </div>
      </section>

      <section id="cta" className="max-w-7xl mx-auto px-6 pb-24" data-cut>
        <Reveal delay={0} className="rounded-3xl p-8 md:p-12 text-center border glass ctaSection" style={{ borderColor: `${COLORS.fg}22` }}>
          <h3 className="text-3xl md:text-4xl font-extrabold mb-3 glowText">See AerFrame in action</h3>
          <p className="opacity-80 mb-6">Schedule a 15‑second lift demo and experience the ultra‑low weight design.</p>
          <div className="flex items-center justify-center gap-3">
            <MagneticLink>
              <a href="#" className="px-6 py-3 rounded-full font-semibold magnetBtn pulseBtn" style={{ background: BRAND, color: "#fff" }}>Book live demo</a>
            </MagneticLink>
            <MagneticLink>
              <a href="#" className="px-6 py-3 rounded-full font-semibold magnetOutline" style={{ border: `1px solid ${COLORS.fg}22` }}>Talk to sales</a>
            </MagneticLink>
          </div>
        </Reveal>
      </section>
    </div>
  );
}

function ParticleSystem({ mousePosition, brand }) {
  const canvasRef = useRef(null);
  const particlesRef = useRef([]);
  const animationRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    const rect = canvas.getBoundingClientRect();
    
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    // Initialize particles
    const particleCount = 50;
    particlesRef.current = Array.from({ length: particleCount }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      size: Math.random() * 3 + 1,
      speedX: (Math.random() - 0.5) * 0.5,
      speedY: (Math.random() - 0.5) * 0.5,
      opacity: Math.random() * 0.5 + 0.2,
      color: brand
    }));

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      particlesRef.current.forEach((particle, index) => {
        // Mouse interaction
        const dx = mousePosition.x - particle.x;
        const dy = mousePosition.y - particle.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        
        if (distance < 100) {
          const force = (100 - distance) / 100;
          particle.x -= (dx / distance) * force * 2;
          particle.y -= (dy / distance) * force * 2;
          particle.opacity = Math.min(0.8, particle.opacity + force * 0.02);
        } else {
          particle.opacity = Math.max(0.2, particle.opacity - 0.01);
        }
        
        // Update position
        particle.x += particle.speedX;
        particle.y += particle.speedY;
        
        // Wrap around screen
        if (particle.x < 0) particle.x = canvas.width;
        if (particle.x > canvas.width) particle.x = 0;
        if (particle.y < 0) particle.y = canvas.height;
        if (particle.y > canvas.height) particle.y = 0;
        
        // Draw particle
        ctx.globalAlpha = particle.opacity;
        ctx.fillStyle = particle.color;
        ctx.beginPath();
        ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
        ctx.fill();
        
        // Draw connections
        particlesRef.current.slice(index + 1).forEach(otherParticle => {
          const distance = Math.sqrt(
            Math.pow(particle.x - otherParticle.x, 2) + 
            Math.pow(particle.y - otherParticle.y, 2)
          );
          
          if (distance < 150) {
            ctx.globalAlpha = (150 - distance) / 150 * 0.3;
            ctx.strokeStyle = particle.color;
            ctx.lineWidth = 0.5;
            ctx.beginPath();
            ctx.moveTo(particle.x, particle.y);
            ctx.lineTo(otherParticle.x, otherParticle.y);
            ctx.stroke();
          }
        });
      });
      
      animationRef.current = requestAnimationFrame(animate);
    };

    animate();

    const handleResize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    
    window.addEventListener('resize', handleResize);
    
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
      window.removeEventListener('resize', handleResize);
    };
  }, [mousePosition, brand]);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-10"
      style={{ opacity: 0.6 }}
    />
  );
}

function InteractiveBenefits({ brand, colors }) {
  const [activeMetric, setActiveMetric] = useState(0);
  const metrics = [
    { title: "Setup Time Reduction", value: "65%", description: "Faster daily setup vs traditional systems", icon: "⏱️" },
    { title: "Image Quality", value: "94%", description: "Artifact-free imaging in clinical trials", icon: "🎯" },
    { title: "Cost Savings", value: "40%", description: "Reduction in operational expenses", icon: "💰" },
    { title: "Patient Comfort", value: "89%", description: "Patient satisfaction rating", icon: "😊" }
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveMetric((prev) => (prev + 1) % metrics.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="grid lg:grid-cols-2 gap-12 items-center">
      <div className="space-y-4">
        {metrics.map((metric, index) => (
          <Reveal key={index} delay={index * 100}>
            <div 
              className={`p-6 rounded-2xl glass border cursor-pointer transition-all duration-500 ${
                index === activeMetric ? 'ring-2 shine cardLift' : 'hover:cardLift'
              }`}
              style={{ 
                borderColor: index === activeMetric ? brand : `${colors.fg}22`,
                ringColor: brand
              }}
              onClick={() => setActiveMetric(index)}
            >
              <div className="flex items-center gap-4">
                <div className="text-2xl">{metric.icon}</div>
                <div className="flex-1">
                  <div className="font-extrabold text-lg" style={{ color: brand }}>{metric.title}</div>
                  <div className="text-sm opacity-80 mt-1">{metric.description}</div>
                </div>
                <div className="text-3xl font-extrabold" style={{ color: brand }}>
                  <AnimatedNumber value={parseInt(metric.value)} suffix="%" />
                </div>
              </div>
            </div>
          </Reveal>
        ))}
      </div>
      
      <div className="relative">
        <Reveal delay={200}>
          <div className="rounded-2xl glass p-8 border" style={{ borderColor: `${colors.fg}22` }}>
            <CircularProgress 
              value={parseInt(metrics[activeMetric].value)} 
              brand={brand}
              title={metrics[activeMetric].title}
              description={metrics[activeMetric].description}
            />
          </div>
        </Reveal>
      </div>
    </div>
  );
}

function CircularProgress({ value, brand, title, description }) {
  const [displayValue, setDisplayValue] = useState(0);
  const circumference = 2 * Math.PI * 45;
  const strokeDasharray = circumference;
  const strokeDashoffset = circumference - (displayValue / 100) * circumference;

  useEffect(() => {
    const timer = setTimeout(() => {
      setDisplayValue(value);
    }, 100);
    return () => clearTimeout(timer);
  }, [value]);

  return (
    <div className="text-center">
      <div className="relative w-32 h-32 mx-auto mb-4">
        <svg className="w-32 h-32 transform -rotate-90" viewBox="0 0 100 100">
          <circle
            cx="50"
            cy="50"
            r="45"
            stroke={`${brand}22`}
            strokeWidth="8"
            fill="none"
          />
          <circle
            cx="50"
            cy="50"
            r="45"
            stroke={brand}
            strokeWidth="8"
            fill="none"
            strokeLinecap="round"
            strokeDasharray={strokeDasharray}
            strokeDashoffset={strokeDashoffset}
            className="progressCircle"
            style={{
              transition: 'stroke-dashoffset 1.5s ease-in-out',
            }}
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-2xl font-bold counterNumber" style={{ color: brand }}>
            {displayValue}%
          </span>
        </div>
      </div>
      <h3 className="font-extrabold text-lg mb-2" style={{ color: brand }}>{title}</h3>
      <p className="text-sm opacity-80">{description}</p>
    </div>
  );
}

function AnimatedNumber({ value, suffix = "" }) {
  const [displayValue, setDisplayValue] = useState(0);

  useEffect(() => {
    const duration = 2000;
    const increment = value / (duration / 16);
    let current = 0;
    
    const timer = setInterval(() => {
      current += increment;
      if (current >= value) {
        setDisplayValue(value);
        clearInterval(timer);
      } else {
        setDisplayValue(Math.floor(current));
      }
    }, 16);
    
    return () => clearInterval(timer);
  }, [value]);

  return <span>{displayValue}{suffix}</span>;
}

function TypewriterText({ text, className = "", style = {} }) {
  const [displayText, setDisplayText] = useState("");
  const [showCursor, setShowCursor] = useState(true);

  useEffect(() => {
    let index = 0;
    const timer = setInterval(() => {
      if (index <= text.length) {
        setDisplayText(text.slice(0, index));
        index++;
      } else {
        clearInterval(timer);
        setShowCursor(false);
      }
    }, 100);

    return () => clearInterval(timer);
  }, [text]);

  useEffect(() => {
    const cursorTimer = setInterval(() => {
      setShowCursor(prev => !prev);
    }, 500);

    return () => clearInterval(cursorTimer);
  }, []);

  return (
    <span className={className} style={style}>
      {displayText}
      {showCursor && <span className="animate-pulse">|</span>}
    </span>
  );
}

function MorphingLogo({ brand }) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div 
      className="h-8 w-36 rounded-md flex items-center justify-center text-xs tracking-widest cursor-pointer transition-all duration-500 logoMorph"
      style={{ 
        border: `1px solid ${isHovered ? brand : 'rgba(15,23,42,0.2)'}`,
        background: isHovered ? `${brand}11` : 'transparent',
        color: isHovered ? brand : 'inherit'
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      AERFRAME
    </div>
  );
}

function HoverLink({ href, children }) {
  return (
    <a 
      href={href} 
      className="hover:opacity-100 transition-all duration-300 relative linkHover"
    >
      {children}
      <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-current transition-all duration-300 linkUnderline"></span>
    </a>
  );
}

function FloatingElements() {
  return (
    <div className="absolute inset-0 pointer-events-none">
      <div className="floatingElement w-2 h-2 rounded-full bg-blue-400 opacity-30 absolute top-1/4 left-1/4"></div>
      <div className="floatingElement w-1 h-1 rounded-full bg-blue-500 opacity-40 absolute top-1/3 right-1/3"></div>
      <div className="floatingElement w-3 h-3 rounded-full bg-blue-300 opacity-20 absolute bottom-1/4 right-1/4"></div>
      <div className="floatingElement w-1.5 h-1.5 rounded-full bg-blue-600 opacity-35 absolute bottom-1/3 left-1/5"></div>
    </div>
  );
}

function Style({ brand }) {
  return (
    <style>{`
      :root { --progress: 0; --stripe-offset: 0px; --stripe-skew: 0deg; }
      .glass { backdrop-filter: saturate(160%) blur(10px); background: rgba(15,23,42,0.04); border: 1px solid rgba(15,23,42,0.12); }
      .stripeField { background-image: repeating-linear-gradient(20deg, ${brand} 0, ${brand} 8px, transparent 8px, transparent 22px); opacity: 0.1; animation: stripeDrift 16s ease-in-out infinite alternate; transform: translateZ(0) translateY(var(--stripe-offset)) skewY(var(--stripe-skew)); }
      .energyField { animation: glowPulse 10s ease-in-out infinite alternate; }
      @keyframes stripeDrift { 0% { filter: saturate(105%); } 100% { filter: saturate(125%); } }
      @keyframes glowPulse { 0% { filter: saturate(110%) brightness(100%); } 100% { filter: saturate(140%) brightness(105%); } }
      .reveal { opacity: 0; transform: translateY(16px) scale(0.995); transition: opacity .8s ease, transform .8s ease; will-change: opacity, transform; }
      .reveal.show { opacity: 1; transform: translateY(0) scale(1); }
      .shine { position: relative; overflow: hidden; }
      .shine::after { content: ""; position: absolute; inset: -200%; background: linear-gradient(75deg, transparent 45%, rgba(255,255,255,.13) 50%, transparent 55%); transform: translateX(-120%); }
      .shine:hover::after { animation: shineMove 1s ease; }
      @keyframes shineMove { to { transform: translateX(120%); } }
      .cardLift { transition: transform .25s ease, box-shadow .25s ease; }
      .cardLift:hover { transform: translateY(-4px); box-shadow: 0 12px 30px rgba(0,0,0,.12); }
      .magnetBtn { transition: transform .15s ease; }
      .magnetOutline { transition: transform .15s ease, border-color .2s ease; }
      .headlineSweepTxt { animation: sweep 8s ease-in-out infinite; background-size: 200% 100% !important; }
      @keyframes sweep { 0% { background-position: 200% 0; } 100% { background-position: -200% 0; } }
      .progressRoot { position: fixed; top: 0; left: 0; right: 0; height: 3px; z-index: 60; }
      .progressBar { height: 100%; transform-origin: 0 50%; transform: scaleX(var(--progress)); }

      .cutOverlay { position: fixed; inset: 0; z-index: 55; pointer-events: none; background: linear-gradient(100deg, rgba(0,0,0,0) 0%, rgba(87,164,218,0.25) 40%, rgba(87,164,218,0.85) 50%, rgba(87,164,218,0.25) 60%, rgba(0,0,0,0) 100%); transform: translateX(-120%); animation: wipe 900ms cubic-bezier(.2,.8,.2,1) forwards; mix-blend-mode: screen; }
      @keyframes wipe { 0% { transform: translateX(-120%); } 60% { transform: translateX(0%); } 100% { transform: translateX(120%); } }

      .quoteWrap { position: relative; min-height: 160px; }
      .fadeSlide { position: absolute; inset: 0; opacity: 0; transition: opacity .8s ease; }
      .fadeSlide.active { opacity: 1; }
      .quoteCard { border-radius: 16px; padding: 28px; }
      .quoteText { font-size: clamp(18px, 2.2vw, 24px); line-height: 1.35; font-weight: 700; }
      .quoteMeta { font-size: 13px; letter-spacing: .03em; opacity: .85; }

      /* New WOW Factor Animations */
      .glowText { animation: glow 2s ease-in-out infinite alternate; }
      @keyframes glow { from { text-shadow: 0 0 10px ${brand}44; } to { text-shadow: 0 0 20px ${brand}66, 0 0 30px ${brand}44; } }
      
      .pulseBtn { animation: pulse 2s ease-in-out infinite; }
      @keyframes pulse { 0%, 100% { box-shadow: 0 0 0 0 ${brand}66; } 50% { box-shadow: 0 0 0 10px ${brand}11; } }
      
      .iconFloat { animation: iconFloat 3s ease-in-out infinite; }
      @keyframes iconFloat { 0%, 100% { transform: translateY(0px); } 50% { transform: translateY(-5px); } }
      
      .productImage { animation: productGlow 4s ease-in-out infinite alternate; }
      @keyframes productGlow { 0% { filter: drop-shadow(0 25px 50px rgba(87, 164, 218, 0.15)); } 100% { filter: drop-shadow(0 30px 60px rgba(87, 164, 218, 0.25)) brightness(1.05); } }
      
      .statusDot { animation: statusPulse 2s ease-in-out infinite; }
      @keyframes statusPulse { 0%, 100% { opacity: 1; transform: scale(1); } 50% { opacity: 0.6; transform: scale(1.2); } }
      
      .pulsingDot { animation: dotPulse 2s ease-in-out infinite; }
      @keyframes dotPulse { 0%, 100% { transform: scale(1); } 50% { transform: scale(1.1); } }
      
      .featureCard:hover { animation: cardPulse 0.6s ease-in-out; }
      @keyframes cardPulse { 0%, 100% { transform: scale(1) translateY(-4px); } 50% { transform: scale(1.02) translateY(-6px); } }
      
      .progressBar { animation: progressFill 2s ease-out forwards; }
      @keyframes progressFill { from { width: 0%; } }
      
      .counterNumber { animation: numberGlow 3s ease-in-out infinite alternate; }
      @keyframes numberGlow { 0% { text-shadow: none; } 100% { text-shadow: 0 0 10px ${brand}66; } }
      
      .statProgress { animation: statFill 3s ease-out forwards; }
      @keyframes statFill { from { width: 0%; } to { width: 100%; } }
      
      .statsSection:hover .statCard { animation: statHover 0.5s ease-in-out; }
      @keyframes statHover { 0%, 100% { transform: scale(1); } 50% { transform: scale(1.05); } }
      
      .productShowcase { position: relative; overflow: visible; }
      .productShowcase::before { content: ""; position: absolute; inset: -20px; background: radial-gradient(circle, ${brand}11 0%, transparent 70%); z-index: -1; border-radius: 2rem; animation: showcaseGlow 4s ease-in-out infinite alternate; }
      @keyframes showcaseGlow { 0% { opacity: 0.5; transform: scale(0.98); } 100% { opacity: 1; transform: scale(1.02); } }
      
      .linkHover:hover .linkUnderline { width: 100%; }
      
      .floatingElement { animation: float 6s ease-in-out infinite; }
      @keyframes float { 0%, 100% { transform: translateY(0px) rotate(0deg); } 33% { transform: translateY(-10px) rotate(120deg); } 66% { transform: translateY(5px) rotate(240deg); } }
      
      .ctaSection { position: relative; overflow: hidden; }
      .ctaSection::before { content: ""; position: absolute; inset: 0; background: linear-gradient(45deg, transparent, ${brand}08, transparent); animation: ctaShimmer 3s linear infinite; }
      @keyframes ctaShimmer { 0% { transform: translateX(-100%); } 100% { transform: translateX(100%); } }
      
      .logoMorph { transition: all 0.5s cubic-bezier(0.4, 0, 0.2, 1); }
      .logoMorph:hover { transform: scale(1.05) rotateY(10deg); }

      @media (prefers-reduced-motion: reduce) {
        .stripeField, .energyField, .shine::after, .headlineSweepTxt, .cutOverlay, .glowText, .pulseBtn, .iconFloat, .productImage, .statusDot, .pulsingDot, .floatingElement { animation: none !important; }
        .reveal { transition: none !important; opacity: 1 !important; transform: none !important; }
      }
    `}</style>
  );
}

function useInView(opts) {
  const ref = useRef(null);
  const [inView, setInView] = useState(false);
  useEffect(() => {
    if (!ref.current) return;
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        setInView(true);
        if (opts?.once !== false) observer.disconnect();
      }
    }, { root: null, rootMargin: opts?.rootMargin || "0px", threshold: opts?.threshold ?? 0.15 });
    observer.observe(ref.current);
    return () => observer.disconnect();
  }, [opts?.once, opts?.rootMargin, opts?.threshold]);
  return [ref, inView];
}

function Reveal({ as = "div", children, delay = 0, className = "", style = {} }) {
  const [ref, inView] = useInView({ threshold: 0.2 });
  const Tag = as;
  return (
    <Tag ref={ref} className={`reveal ${inView ? "show" : ""} ${className}`} style={{ transitionDelay: `${delay}ms`, ...style }}>
      {children}
    </Tag>
  );
}

function useParallaxStyle(targetRef, rootRef, conf) {
  const cfg = { yFrom: 0, yTo: -24, scaleFrom: 1, scaleTo: 1.04, rotFrom: 0, rotTo: 0, ...conf };
  const [style, setStyle] = useState({ transform: "translate3d(0,0,0)" });
  useEffect(() => {
    let raf = null;
    const clamp = (n, a, b) => Math.max(a, Math.min(b, n));
    const lerp = (a, b, t) => a + (b - a) * t;
    const update = () => {
      if (!targetRef.current) return;
      const root = rootRef && rootRef.getBoundingClientRect ? rootRef : null;
      const bounds = (root ? root : targetRef.current).getBoundingClientRect();
      const vh = window.innerHeight || 1;
      const prog = clamp((vh - bounds.top) / (vh + bounds.height), 0, 1);
      const y = lerp(cfg.yFrom, cfg.yTo, prog);
      const s = lerp(cfg.scaleFrom, cfg.scaleTo, prog);
      const r = lerp(cfg.rotFrom, cfg.rotTo, prog);
      setStyle({ transform: `translate3d(0, ${y}px, 0) scale(${s}) rotate(${r}deg)`, willChange: "transform", display: "inline-block" });
    };
    const onScroll = () => { if (raf) cancelAnimationFrame(raf); raf = requestAnimationFrame(update); };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => { window.removeEventListener("scroll", onScroll); window.removeEventListener("resize", onScroll); if (raf) cancelAnimationFrame(raf); };
  }, [targetRef, rootRef, conf?.yFrom, conf?.yTo, conf?.scaleFrom, conf?.scaleTo, conf?.rotFrom, conf?.rotTo]);
  return style;
}

function Parallax({ children, yFrom=0, yTo=-24, scaleFrom=1, scaleTo=1.04, rotFrom=0, rotTo=0, rootRef }) {
  const ref = useRef(null);
  const style = useParallaxStyle(ref, rootRef, { yFrom, yTo, scaleFrom, scaleTo, rotFrom, rotTo });
  return <span ref={ref} style={style}>{children}</span>;
}

function StatCounter({ target, duration = 1400, formatter }) {
  const [ref, inView] = useInView({ threshold: 0.4 });
  const [value, setValue] = useState(0);
  useEffect(() => {
    if (!inView || target == null) return;
    let start;
    const d = Math.max(300, duration);
    const raf = requestAnimationFrame(function step(t){
      if (start == null) start = t;
      const prog = Math.min(1, (t - start) / d);
      const eased = 1 - Math.pow(1 - prog, 3);
      const val = Math.round(target * eased);
      setValue(val);
      if (prog < 1) requestAnimationFrame(step);
    });
    return () => cancelAnimationFrame(raf);
  }, [inView, target, duration]);
  const format = formatter || ((n)=> new Intl.NumberFormat().format(n));
  return <span ref={ref}>{target == null ? "—" : format(value)}</span>;
}

function ScrollMotionVars() {
  useEffect(() => {
    const setVars = () => {
      const max = Math.max(1, document.documentElement.scrollHeight - window.innerHeight);
      const p = Math.min(1, Math.max(0, window.scrollY / max));
      document.documentElement.style.setProperty("--progress", p.toFixed(4));
      document.documentElement.style.setProperty("--stripe-offset", `${-window.scrollY * 0.15}px`);
      document.documentElement.style.setProperty("--stripe-skew", `${Math.sin(window.scrollY * 0.0015) * 2}deg`);
    };
    setVars();
    window.addEventListener("scroll", setVars, { passive: true });
    window.addEventListener("resize", setVars);
    return () => { window.removeEventListener("scroll", setVars); window.removeEventListener("resize", setVars); };
  }, []);
  return null;
}

function ScrollProgressBar({ brand = "#57A4DA" }) {
  return (
    <div className="progressRoot">
      <div className="progressBar" style={{ background: brand }} />
    </div>
  );
}

function useMagnet(strength = 12) {
  const ref = useRef(null);
  const [style, setStyle] = useState({ transform: "translate(0,0)" });
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    let raf = null;
    const onMove = (e) => {
      const rect = el.getBoundingClientRect();
      const x = e.clientX - rect.left - rect.width / 2;
      const y = e.clientY - rect.top - rect.height / 2;
      const nx = x / rect.width;
      const ny = y / rect.height;
      const tx = nx * strength;
      const ty = ny * strength;
      if (raf) cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => setStyle({ transform: `translate(${tx}px, ${ty}px)` }));
    };
    const onLeave = () => {
      if (raf) cancelAnimationFrame(raf);
      setStyle({ transform: `translate(0,0)` });
    };
    el.addEventListener("mousemove", onMove);
    el.addEventListener("mouseleave", onLeave);
    return () => { el.removeEventListener("mousemove", onMove); el.removeEventListener("mouseleave", onLeave); if (raf) cancelAnimationFrame(raf); };
  }, [strength]);
  return [ref, style];
}

function MagneticLink({ children, strength = 14, className = "", style = {} }) {
  const [ref, s] = useMagnet(strength);
  return <span ref={ref} className={className} style={{ display: "inline-block", willChange: "transform", ...s, ...style }}>{children}</span>;
}

function TiltContainer({ children, className = "", intensity = 8, scale = 1.0 }) {
  const ref = useRef(null);
  const [style, setStyle] = useState({ transform: `perspective(1000px) rotateX(0deg) rotateY(0deg) scale(${scale})` });
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    let raf = null;
    const onMove = (e) => {
      const rect = el.getBoundingClientRect();
      const px = (e.clientX - rect.left) / rect.width;
      const py = (e.clientY - rect.top) / rect.height;
      const rx = (0.5 - py) * intensity;
      const ry = (px - 0.5) * intensity;
      if (raf) cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => setStyle({ transform: `perspective(1000px) rotateX(${rx}deg) rotateY(${ry}deg) scale(${scale})` }));
    };
    const onLeave = () => {
      if (raf) cancelAnimationFrame(raf);
      setStyle({ transform: `perspective(1000px) rotateX(0deg) rotateY(0deg) scale(${scale})` });
    };
    el.addEventListener("mousemove", onMove);
    el.addEventListener("mouseleave", onLeave);
    return () => { el.removeEventListener("mousemove", onMove); el.removeEventListener("mouseleave", onLeave); if (raf) cancelAnimationFrame(raf); };
  }, [intensity, scale]);
  return <div ref={ref} className={className} style={{ ...style, transition: "transform .18s ease-out", transformStyle: "preserve-3d" }}>{children}</div>;
}

function QuoteCarousel({ brand = "#57A4DA", quotes = DEFAULT_QUOTES }) {
  const items = (Array.isArray(quotes) && quotes.length ? quotes : DEFAULT_QUOTES).slice(0, 6);
  const [idx, setIdx] = useState(0);
  useEffect(() => {
    const id = setInterval(() => setIdx(i => (i + 1) % items.length), 5200);
    return () => clearInterval(id);
  }, [items.length]);
  const prev = () => setIdx((idx - 1 + items.length) % items.length);
  const next = () => setIdx((idx + 1) % items.length);
  return (
    <div className="relative">
      <div className="quoteWrap">
        {items.map((q, i) => (
          <figure key={i} className={`fadeSlide ${i === idx ? 'active' : ''}`}>
            <div className="glass quoteCard border mx-auto max-w-3xl" style={{ borderColor: `${brand}22` }}>
              <div className="quoteText" style={{ color: brand }}>"{q.text}"</div>
              <div className="quoteMeta mt-3" style={{ color: '#94A3B8' }}>{q.author}{q.org ? ` · ${q.org}` : ''}</div>
            </div>
          </figure>
        ))}
      </div>
      <div className="mt-6 flex items-center justify-center gap-3">
        <button onClick={prev} className="px-3 py-1.5 rounded-full text-xs" style={{ border: `1px solid ${brand}44` }}>Prev</button>
        <div className="flex items-center gap-2">
          {items.map((_, i) => (
            <button key={i} onClick={()=>setIdx(i)} aria-label={`Go to quote ${i+1}`} style={{ width: 8, height: 8, borderRadius: 9999, background: i===idx? brand : `${brand}33`, border: 'none' }} />
          ))}
        </div>
        <button onClick={next} className="px-3 py-1.5 rounded-full text-xs" style={{ border: `1px solid ${brand}44` }}>Next</button>
      </div>
    </div>
  );
}

const DEFAULT_QUOTES = [
  { text: "Nearly invisible to X‑rays—image quality is just cleaner.", author: "Radiation Oncologist", org: "University Center" },
  { text: "Setup is quicker and the device is feather‑light.", author: "Therapist", org: "Regional Hospital" },
  { text: "We switched for the adaptive workflow—value made sense.", author: "Chief Physicist", org: "Cancer Institute" },
  { text: "The abdominal compression option integrates seamlessly.", author: "Physicist", org: "Community Site" },
  { text: "Laser alignment is straightforward and repeatable.", author: "Dosimetrist", org: "Cancer Network" },
  { text: "It feels purpose‑built for SBRT.", author: "Radiation Oncologist", org: "Academic Center" },
];

function CinematicCuts({ brand = "#57A4DA" }) {
  const [kick, setKick] = useState(0);
  useEffect(() => {
    const sections = Array.from(document.querySelectorAll('section[data-cut]'));
    if (!sections.length) return;
    let last = 0;
    const obs = new IntersectionObserver((entries) => {
      const now = Date.now();
      entries.forEach(e => {
        if (e.isIntersecting && now - last > 800) { last = now; setKick(k => k + 1); }
      });
    }, { threshold: 0.6 });
    sections.forEach(s => obs.observe(s));
    return () => obs.disconnect();
  }, []);
  return <div key={kick} className="cutOverlay" style={{ ["--cutColorA"]: brand + "44", ["--cutColorB"]: brand }} />;
}
