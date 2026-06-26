import React, { useState, useEffect, useRef } from 'react';

/* ── Pixel Art Paper Boat (canvas) ───────────────────────────────────────── */
function PaperBoat() {
  const ref = useRef(null);
  useEffect(() => {
    const canvas = ref.current;
    const ctx = canvas.getContext('2d');
    const S = 4;
    const O = '#1a1a2e';
    const W = '#f7f4ee';
    const H = '#e8e3d5';
    const _ = null;
    const grid = [
    //0  1  2  3  4  5  6  7  8  9  10 11 12 13 14 15 16 17 18 19
      [_,_,_,_,_,_,_,_,_,O,_,_,_,_,_,_,_,_,_,_], // 0  tip
      [_,_,_,_,_,_,_,_,O,W,O,_,_,_,_,_,_,_,_,_], // 1
      [_,_,_,_,_,_,_,O,W,W,W,O,_,_,_,_,_,_,_,_], // 2
      [_,_,_,_,_,_,O,W,W,W,W,W,O,_,_,_,_,_,_,_], // 3
      [_,_,_,_,_,O,W,W,W,W,W,W,W,O,_,_,_,_,_,_], // 4
      [_,O,O,O,O,O,O,O,O,O,O,O,O,O,O,O,O,O,_,_], // 5  waterline
      [_,O,H,H,H,H,H,H,H,H,H,H,H,H,H,H,O,_,_,_], // 6
      [_,_,O,H,H,H,H,H,H,H,H,H,H,H,H,O,_,_,_,_], // 7
      [_,_,_,O,H,H,H,H,H,H,H,H,H,H,O,_,_,_,_,_], // 8
      [_,_,_,_,O,H,H,H,H,H,H,H,H,O,_,_,_,_,_,_], // 9
      [_,_,_,_,_,O,O,O,O,O,O,O,O,_,_,_,_,_,_,_], // 10 keel
    ];
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    grid.forEach((row, y) => {
      row.forEach((color, x) => {
        if (color) { ctx.fillStyle = color; ctx.fillRect(x * S, y * S, S, S); }
      });
    });
  }, []);
  return <canvas ref={ref} width={80} height={44} style={{ imageRendering: 'pixelated', display: 'block' }} />;
}

function Reveal({ children, delay = 0, className = '' }) {
  const ref = useRef(null);
  const [on, setOn] = useState(false);
  useEffect(() => {
    const io = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { setOn(true); io.disconnect(); } },
      { threshold: 0.1 }
    );
    if (ref.current) io.observe(ref.current);
    return () => io.disconnect();
  }, []);
  return (
    <div ref={ref} className={`rv ${on ? 'rv-in' : ''} ${className}`}
      style={{ transitionDelay: `${delay}ms` }}>
      {children}
    </div>
  );
}

function PremiumVideoPlayer() {
  const containerRef = useRef(null);
  const videoRef = useRef(null);
  const [badgePos, setBadgePos] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);
  const [isPlaying, setIsPlaying] = useState(true);
  const [progress, setProgress] = useState(0);
  const [isMouseDown, setIsMouseDown] = useState(false);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const handleTimeUpdate = () => {
      if (video.duration) {
        setProgress((video.currentTime / video.duration) * 100);
      }
    };

    video.addEventListener('timeupdate', handleTimeUpdate);
    return () => {
      video.removeEventListener('timeupdate', handleTimeUpdate);
    };
  }, []);

  const handleMouseMove = (e) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    setBadgePos({ x: e.clientX - rect.left, y: e.clientY - rect.top });
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    setIsMouseDown(false);
  };

  const togglePlay = () => {
    const video = videoRef.current;
    if (!video) return;
    if (video.paused) {
      video.play();
      setIsPlaying(true);
    } else {
      video.pause();
      setIsPlaying(false);
    }
  };

  return (
    <div 
      ref={containerRef}
      className="premium-video-container"
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={handleMouseLeave}
      onMouseDown={() => setIsMouseDown(true)}
      onMouseUp={() => setIsMouseDown(false)}
      onClick={togglePlay}
    >
      {/* Floating Monospace Text Cursor Play/Pause Badge */}
      {isHovered && (
        <div 
          className="video-cursor-badge"
          style={{
            left: `${badgePos.x}px`,
            top: `${badgePos.y}px`,
            transform: `translate(-50%, -50%) scale(${isMouseDown ? 0.9 : 1})`,
            transition: 'transform 0.1s ease'
          }}
        >
          {isPlaying ? 'PAUSE' : 'PLAY'}
        </div>
      )}

      {/* Branded Timeline Progress Bar */}
      <div className="video-progress-bar-wrap">
        <div 
          className="video-progress-bar" 
          style={{ width: `${progress}%` }}
        />
      </div>

      <div className="video-inner-wrap">
        <video
          ref={videoRef}
          src="/demo.mp4"
          autoPlay
          muted
          loop
          playsInline
          className="premium-demo-video"
        />
      </div>
    </div>
  );
}

const SimulatedDemo = () => (
  <section id="demo" className="section demo-sec">
    <Reveal>
      <h2 className="sec-h2 demo-h2">See it in action.</h2>
      <p className="demo-sub">Watch how StudyLM turns dense study material into clear, structured knowledge — in seconds.</p>
    </Reveal>

    <Reveal delay={120}>
      <div className="video-frame-wrap">
        <div className="aurora-glow"></div>
        <PremiumVideoPlayer />
      </div>
    </Reveal>
  </section>
);


export default function StudyLM({ navigate }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [openFaq, setOpenFaq]   = useState(null);
  const [inputValue, setInputValue] = useState('');
  const [activeFeat, setActiveFeat] = useState(0);

  const faqs = [
    { q: "Does it hallucinate answers?", a: "No. If the answer isn't explicitly in the PDFs or slides you uploaded, the system will state it cannot find it." },
    { q: "File limits?", a: "The free tier supports up to 5 documents (max 50MB each). Pro tier removes all limits." },
    { q: "Is it secure?", a: "Yes. End-to-end encrypted. We never use your university materials to train our models." },
  ];

  const handleSearch = (e) => {
    e.preventDefault();
    if (inputValue.trim()) {
      navigate(`/dashboard?q=${encodeURIComponent(inputValue.trim())}`);
    } else {
      navigate('/dashboard');
    }
  };

  // ══ LANDING PAGE ════════════════════════════════════════════════════════
  return (
    <div className="app">

      {/* ── HEADER ────────────────────────────────────────────────────────── */}
      <header className="header">
        <div className="header-grid">
          <div className="cell cell-logo">
            <span className="logo-text">StudyLM</span>
          </div>
          <div className="cell cell-nav hidden-mob">
            <a href="#engine">Engine</a>
            <a href="#stats">Metrics</a>
            <a href="#faq">FAQ</a>
          </div>
          <div className="cell cell-cta">
            <a href="#" onClick={(e) => { e.preventDefault(); navigate('/dashboard'); }} className="btn-outline">Initialize</a>
            <button className="burger" onClick={() => setMenuOpen(!menuOpen)}>Menu</button>
          </div>
        </div>
        {menuOpen && (
          <div className="mob-menu">
            <a href="#engine" onClick={() => setMenuOpen(false)}>Engine</a>
            <a href="#stats" onClick={() => setMenuOpen(false)}>Metrics</a>
            <a href="#faq" onClick={() => setMenuOpen(false)}>FAQ</a>
          </div>
        )}
      </header>

      {/* ══ HERO ════════════════════════════════════════════════════════════ */}
      <section className="hero">
        <div className="hero-wave-layer"></div>
        
        <div className="paper-boat">
          <PaperBoat />
        </div>
        <div className="hero-center">
          <Reveal className="hero-content">
            <h1 className="hero-h1">What do you want to master today?</h1>
            
            {/* INTERACTIVE PROMPT UI */}
            <form onSubmit={handleSearch} className="prompt-ui-unified">
              <div className="input-wrap-massive">
                <span className="attach-icon">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="11" cy="11" r="8"/>
                    <line x1="21" y1="21" x2="16.65" y2="16.65"/>
                  </svg>
                </span>
                <input 
                  type="text" 
                  className="prompt-input-massive"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  placeholder="Search a text or structure..."
                />
                <button type="submit" className={`prompt-send-massive ${inputValue.length > 0 ? 'active' : ''}`}>
                   <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                     <line x1="5" y1="12" x2="19" y2="12"/>
                     <polyline points="12 5 19 12 12 19"/>
                   </svg>
                </button>
              </div>
              
              <div className="prompt-chips-minimal">
                <button type="button" onClick={() => setInputValue('Summarize Chapter 4')}>Summarize Chapter 4</button>
                <button type="button" onClick={() => setInputValue('Quiz me on the Krebs cycle')}>Quiz me on Krebs cycle</button>
                <button type="button" onClick={() => setInputValue('Compare mitosis and meiosis')}>Compare mitosis & meiosis</button>
              </div>
            </form>
          </Reveal>
        </div>
      </section>

      {/* ══ SIMULATED PRODUCT DEMO ════════════════════════════════════════════ */}
      <SimulatedDemo />

      {/* ══ METRICS & PROOF ═════════════════════════════════════════════════ */}
      <section id="stats" className="section proof-sec">
        <div className="proof-grid">
          <div className="proof-left">
            <Reveal>
              <div className="stat-block">
                <span className="s-num">94%</span>
                <span className="s-lbl">GRADE IMPROVEMENT</span>
              </div>
              <div className="stat-block">
                <span className="s-num">8hrs</span>
                <span className="s-lbl">SAVED WEEKLY</span>
              </div>
            </Reveal>
          </div>
          <div className="proof-right">
            <Reveal delay={100}>
              <blockquote className="quote">
                "It reads my professor's exact slides and tests me on them. Completely ruthless efficiency."
                <footer>— Priya M., Medicine Year 3</footer>
              </blockquote>
            </Reveal>
          </div>
        </div>
      </section>

      {/* ══ FAQ ═════════════════════════════════════════════════════════════ */}
      <section id="faq" className="section faq-sec">
        <Reveal className="sec-head-grid">
          <h2 className="sec-h2">Parameters.</h2>
        </Reveal>
        <div className="faq-list">
          {faqs.map((f, i) => (
            <Reveal key={i} delay={i * 30} className="faq-row">
              <button className="faq-trig" onClick={() => setOpenFaq(openFaq === i ? null : i)}>
                <span className="faq-q">{f.q}</span>
                <span className="faq-ic">{openFaq === i ? '−' : '+'}</span>
              </button>
              <div className={`faq-ans-box ${openFaq === i ? 'open' : ''}`}>
                <p className="faq-a">{f.a}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* ══ FOOTER ══════════════════════════════════════════════════════════ */}
      <footer className="footer">
        <div className="foot-grid">
          <div className="foot-brand">
            <span className="logo-text">StudyLM</span>
            <span className="mono-label">© 2025</span>
          </div>
          <div className="foot-links">
            <a href="#">Privacy</a>
            <a href="#">Terms</a>
            <a href="#">Contact</a>
          </div>
        </div>
      </footer>

    </div>
  );
}
