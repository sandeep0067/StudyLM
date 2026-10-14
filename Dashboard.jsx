import React, { useState, useEffect, useRef, useCallback } from 'react';
import { generateOfflineContent, generateOfflineChatResponse } from './generators';
import {
  Menu, Sparkles, Home, CheckCircle, Settings,
  BookOpen, AlertTriangle, Info, MessageSquare,
  FileText, UploadCloud, GitCommit, ArrowUp, X,
  Plus, Copy, Loader2, ListTodo, Trash2,
  Edit2, CornerDownRight, Network, ChevronRight, ArrowRight, Search
} from 'lucide-react';

/* ─────────────────────────────────────────
   BOAT LOGO  — pure SVG, no canvas, no pixels
──────────────────────────────────────────*/
function BoatLogo({ size = 20, color = '#374151', sw = 1.6, animated = false }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none"
      stroke={color} strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round">
      <line x1="12" y1="3"  x2="12" y2="16" />      {/* mast */}
      <path d="M12 4 L19 15 L12 15 Z" />              {/* main sail */}
      <path d="M12 7 L6.5 15 L12 15 Z" />             {/* foresail */}
      <path d="M5 16 Q12 20.5 19 16" />               {/* hull */}
      {/* Back Wave */}
      <path d="M2 18.5 Q7 17 12 18.5 T22 18.5" opacity="0.35">
        {animated && (
          <animate attributeName="d" dur="3.5s" repeatCount="indefinite" ease="ease-in-out"
            values="M2 18.5 Q7 17 12 18.5 T22 18.5; M2 18.5 Q7 20 12 18.5 T22 18.5; M2 18.5 Q7 17 12 18.5 T22 18.5" />
        )}
      </path>
      {/* Front Wave */}
      <path d="M2 18.5 Q7 20 12 18.5 T22 18.5">
        {animated && (
          <animate attributeName="d" dur="3.5s" repeatCount="indefinite" ease="ease-in-out"
            values="M2 18.5 Q7 20 12 18.5 T22 18.5; M2 18.5 Q7 17 12 18.5 T22 18.5; M2 18.5 Q7 20 12 18.5 T22 18.5" />
        )}
      </path>
    </svg>
  );
}

/* ─────────────────────────────────────────
   CUSTOM ILLUSTRATIONS - Professional SVG Art
──────────────────────────────────────────*/

// Study Guide Illustration - Books and learning
function StudyGuideIllustration({ width = 120, height = 120 }) {
  return (
    <svg width={width} height={height} viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Background circle */}
      <circle cx="60" cy="60" r="55" fill="#FFF7ED" />
      {/* Stacked books */}
      <rect x="25" y="35" width="70" height="12" rx="2" fill="#F97316" />
      <rect x="25" y="35" width="5" height="12" rx="1" fill="#EA580C" />
      <rect x="25" y="50" width="70" height="12" rx="2" fill="#FB923C" />
      <rect x="25" y="50" width="5" height="12" rx="1" fill="#F97316" />
      <rect x="25" y="65" width="70" height="12" rx="2" fill="#FDBA74" />
      <rect x="25" y="65" width="5" height="12" rx="1" fill="#FB923C" />
      {/* Sparkle */}
      <path d="M95 25L98 32L105 35L98 38L95 45L92 38L85 35L92 32L95 25Z" fill="#F97316" />
      <circle cx="90" cy="40" r="3" fill="#FDBA74" opacity="0.6" />
      <circle cx="100" cy="30" r="2" fill="#FDBA74" opacity="0.4" />
    </svg>
  );
}

// Chat Illustration - Conversation bubbles
function ChatIllustration({ width = 120, height = 120 }) {
  return (
    <svg width={width} height={height} viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Background circle */}
      <circle cx="60" cy="60" r="55" fill="#F5F3FF" />
      {/* Chat bubbles */}
      <rect x="20" y="30" width="45" height="30" rx="8" fill="#8B5CF6" />
      <path d="M20 50L15 58L20 55V50Z" fill="#8B5CF6" />
      <rect x="55" y="55" width="45" height="30" rx="8" fill="#A78BFA" />
      <path d="M100 75L105 83L100 80V75Z" fill="#A78BFA" />
      {/* Decorative dots */}
      <circle cx="35" cy="45" r="3" fill="#DDD6FE" />
      <circle cx="45" cy="45" r="3" fill="#DDD6FE" />
      <circle cx="55" cy="45" r="3" fill="#DDD6FE" />
      <circle cx="70" cy="70" r="3" fill="#DDD6FE" />
      <circle cx="80" cy="70" r="3" fill="#DDD6FE" />
      <circle cx="90" cy="70" r="3" fill="#DDD6FE" />
    </svg>
  );
}

// Flashcard Illustration - Learning cards
function FlashcardIllustration({ width = 120, height = 120 }) {
  return (
    <svg width={width} height={height} viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Background circle */}
      <circle cx="60" cy="60" r="55" fill="#EFF6FF" />
      {/* Cards */}
      <rect x="20" y="25" width="40" height="50" rx="6" fill="#3B82F6" transform="rotate(-10 40 50)" />
      <rect x="50" y="35" width="40" height="50" rx="6" fill="#60A5FA" transform="rotate(10 70 60)" />
      {/* Card details */}
      <rect x="25" y="32" width="30" height="4" rx="2" fill="#BFDBFE" transform="rotate(-10 40 34)" />
      <rect x="25" y="40" width="25" height="3" rx="1.5" fill="#BFDBFE" transform="rotate(-10 37.5 41.5)" />
      <rect x="25" y="47" width="28" height="3" rx="1.5" fill="#BFDBFE" transform="rotate(-10 39 48.5)" />
      <rect x="55" y="42" width="30" height="4" rx="2" fill="#DBEAFE" transform="rotate(10 70 44)" />
      <rect x="55" y="50" width="25" height="3" rx="1.5" fill="#DBEAFE" transform="rotate(10 67.5 51.5)" />
      <rect x="55" y="57" width="28" height="3" rx="1.5" fill="#DBEAFE" transform="rotate(10 69 58.5)" />
      {/* Star */}
      <path d="M95 25L97 31L103 33L97 35L95 41L93 35L87 33L93 31L95 25Z" fill="#3B82F6" />
    </svg>
  );
}

// Empty State - Upload illustration
function UploadIllustration({ width = 160, height = 160 }) {
  return (
    <svg width={width} height={height} viewBox="0 0 160 160" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Background gradient */}
      <defs>
        <linearGradient id="uploadGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#F97316" />
          <stop offset="100%" stopColor="#FB923C" />
        </linearGradient>
      </defs>
      <circle cx="80" cy="80" r="70" fill="url(#uploadGrad)" opacity="0.1" />
      {/* Document */}
      <rect x="45" y="35" width="50" height="65" rx="4" fill="#FFF" stroke="#F97316" strokeWidth="2" />
      <path d="M70 35V55H90" fill="#FED7AA" stroke="#F97316" strokeWidth="2" />
      {/* Upload arrow */}
      <path d="M70 85L70 65" stroke="#F97316" strokeWidth="3" strokeLinecap="round" />
      <path d="M62 73L70 65L78 73" stroke="#F97316" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
      {/* Cloud */}
      <path d="M50 95C40 95 35 90 35 82C35 75 40 70 48 68C50 58 60 55 70 55C80 55 90 60 92 70C100 72 105 78 105 85C105 95 95 100 80 100H50" fill="#FED7AA" stroke="#F97316" strokeWidth="2" />
    </svg>
  );
}

// Empty State - Generate illustration
function GenerateIllustration({ width = 160, height = 160 }) {
  return (
    <svg width={width} height={height} viewBox="0 0 160 160" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Background gradient */}
      <defs>
        <linearGradient id="genGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#8B5CF6" />
          <stop offset="100%" stopColor="#A78BFA" />
        </linearGradient>
      </defs>
      <circle cx="80" cy="80" r="70" fill="url(#genGrad)" opacity="0.1" />
      {/* Brain/AI icon */}
      <circle cx="80" cy="60" r="25" fill="#DDD6FE" stroke="#8B5CF6" strokeWidth="2" />
      <path d="M60 60C60 50 70 45 80 45C90 45 100 50 100 60" stroke="#8B5CF6" strokeWidth="2" fill="none" />
      <path d="M65 75C65 85 75 90 80 90C85 90 95 85 95 75" stroke="#8B5CF6" strokeWidth="2" fill="none" />
      {/* Sparkles */}
      <path d="M45 40L48 47L55 50L48 53L45 60L42 53L35 50L42 47L45 40Z" fill="#8B5CF6" />
      <path d="M115 90L117 95L122 98L117 101L115 106L113 101L108 98L113 95L115 90Z" fill="#A78BFA" />
      <circle cx="110" cy="45" r="4" fill="#DDD6FE" />
      <circle cx="50" cy="100" r="3" fill="#DDD6FE" />
      {/* Connection lines */}
      <path d="M55 50L45 40" stroke="#A78BFA" strokeWidth="1.5" strokeDasharray="3 3" />
      <path d="M105 50L110 45" stroke="#A78BFA" strokeWidth="1.5" strokeDasharray="3 3" />
      <path d="M95 85L115 90" stroke="#A78BFA" strokeWidth="1.5" strokeDasharray="3 3" />
    </svg>
  );
}

/* ─────────────────────────────────────────
   MARKDOWN RENDERER
──────────────────────────────────────────*/
function parseInline(text) {
  if (!text) return text;
  const parts = []; let last = 0; let m;
  const r = /(\*\*|__)(.*?)\1|(\*|_)(.*?)\3|`(.*?)`/g;
  while ((m = r.exec(text)) !== null) {
    if (m.index > last) parts.push(text.slice(last, m.index));
    if (m[1]) parts.push(<strong key={m.index} style={{ fontWeight: 600, color: 'inherit' }}>{m[2]}</strong>);
    else if (m[3]) parts.push(<em key={m.index} style={{ fontStyle: 'normal', color: 'inherit' }}>{m[4]}</em>);
    else if (m[5]) parts.push(<code key={m.index} style={{ fontFamily: 'monospace', fontSize: '0.9em', background: 'rgba(0,0,0,0.05)', padding: '2px 4px', borderRadius: 4, color: 'inherit' }}>{m[5]}</code>);
    last = r.lastIndex;
  }
  if (last < text.length) parts.push(text.slice(last));
  return parts.length ? parts : text;
}

function MD({ content }) {
  if (!content) return null;
  const lines = content.split('\n');
  const out = []; let codeLines = [], codeLang = '', inCode = false, listItems = [];
  const flushList = k => {
    if (!listItems.length) return;
    out.push(
      <ul key={`ul${k}`} style={{ margin: '8px 0', padding: '0 0 0 16px', listStyle: 'none' }}>
        {listItems.map((it, i) => (
          <li key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 8, marginBottom: 6, fontSize: 14, color: 'inherit', lineHeight: 1.65 }}>
            <span style={{ width: 4, height: 4, borderRadius: '50%', background: '#cbd5e1', flexShrink: 0, marginTop: 8 }} />
            <span>{parseInline(it)}</span>
          </li>
        ))}
      </ul>
    );
    listItems = [];
  };
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i]; const t = line.trim();
    if (t.startsWith('```')) {
      if (inCode) {
        const code = codeLines.join('\n');
        out.push(
          <div key={`c${i}`} style={{ margin: '16px 0', borderRadius: 10, overflow: 'hidden', border: '1px solid #f1f5f9' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '8px 16px', background: '#f8fafc', borderBottom: '1px solid #f1f5f9' }}>
              <span style={{ fontSize: 11, fontFamily: 'monospace', color: '#94a3b8', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em' }}>{codeLang || 'code'}</span>
              <button onClick={() => navigator.clipboard.writeText(code)} style={{ fontSize: 11.5, color: '#94a3b8', background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 4 }}>
                <Copy size={11} /> Copy
              </button>
            </div>
            <pre style={{ padding: 16, margin: 0, fontSize: 12.5, fontFamily: 'monospace', color: '#334155', overflowX: 'auto', lineHeight: 1.65, background: '#fff' }}><code>{code}</code></pre>
          </div>
        );
        codeLines = []; codeLang = ''; inCode = false;
      } else { flushList(i); inCode = true; codeLang = t.slice(3).trim(); }
      continue;
    }
    if (inCode) { codeLines.push(line); continue; }
    if (t === '') { flushList(i); out.push(<div key={`sp${i}`} style={{ height: 6 }} />); continue; }
    if (t.startsWith('### ')) { flushList(i); out.push(<h4 key={`h3${i}`} style={{ fontSize: 13, fontWeight: 700, color: '#64748b', marginTop: 20, marginBottom: 6, textTransform: 'uppercase', letterSpacing: '0.06em' }}>{parseInline(t.slice(4))}</h4>); continue; }
    if (t.startsWith('## '))  { flushList(i); out.push(<h3 key={`h2${i}`} style={{ fontSize: 17, fontWeight: 600, color: '#0f172a', marginTop: 28, marginBottom: 8, letterSpacing: '-0.02em' }}>{parseInline(t.slice(3))}</h3>); continue; }
    if (t.startsWith('# '))   { flushList(i); out.push(<h2 key={`h1${i}`} style={{ fontSize: 22, fontWeight: 700, color: '#0f172a', marginTop: 32, marginBottom: 12, letterSpacing: '-0.03em' }}>{parseInline(t.slice(2))}</h2>); continue; }
    if (t.startsWith('> '))   { flushList(i); out.push(<div key={`bq${i}`} style={{ margin: '12px 0', paddingLeft: 12, borderLeft: '2px solid #e2e8f0', fontSize: 13.5, color: '#64748b', fontStyle: 'normal' }}>{parseInline(t.slice(2))}</div>); continue; }
    if (t.startsWith('- ') || t.startsWith('* ')) { listItems.push(t.slice(2)); continue; }
    flushList(i);
    if (t) out.push(<p key={`p${i}`} style={{ fontSize: 14.5, lineHeight: 1.75, color: 'inherit', marginBottom: 4, margin: '4px 0' }}>{parseInline(line)}</p>);
  }
  flushList(lines.length);
  return <div>{out}</div>;
}

/* ─────────────────────────────────────────
   PARSERS
──────────────────────────────────────────*/
function parseMindmap(text) {
  if (!text) return [];
  const items = [];
  text.split('\n').forEach(line => {
    const t = line.trim(); if (!t) return;
    const indent = line.match(/^(\s*)/)[1].length;
    let label = t.replace(/^[\*\-\+]\s*/, ''), desc = '';
    const bold = label.match(/^\*\*(.*?)\*\*(.*)$/);
    if (bold) { label = bold[1]; desc = bold[2].trim(); }
    else { const parts = label.split(':'); if (parts.length > 1) { label = parts[0]; desc = parts.slice(1).join(':').trim(); } }
    items.push({ indent, label: label.trim(), desc: desc.replace(/^[\-\s:\(\)]+/, '').replace(/[\)\s]+$/, '') });
  });
  const nodes = [], stack = [];
  items.forEach(item => {
    while (stack.length && stack[stack.length - 1].indent >= item.indent) stack.pop();
    const node = { id: Math.random(), label: item.label, desc: item.desc, children: [] };
    if (stack.length) stack[stack.length - 1].node.children.push(node); else nodes.push(node);
    stack.push({ indent: item.indent, node });
  });
  return nodes;
}

function parseTimeline(text) {
  if (!text) return [];
  return text.split('\n').filter(l => /^[\-\*]/.test(l.trim())).map(line => {
    const c = line.trim().replace(/^[\*\-\+]\s*/, '');
    const bold = c.match(/^\*\*(.*?)\*\*(.*)$/);
    if (bold) return { title: bold[1].trim(), desc: bold[2].trim().replace(/^[\-\s:]+/, '') };
    const parts = c.split(':');
    return parts.length > 1 ? { title: parts[0].trim(), desc: parts.slice(1).join(':').trim() } : { title: c, desc: '' };
  });
}

function parseRoadmap(text) {
  if (!text) return [];
  const phases = []; let cur = null;
  text.split('\n').forEach(line => {
    const t = line.trim(); if (!t) return;
    if (t.startsWith('### ')) { cur = { title: t.slice(4).replace(/\*\*/g, '').trim(), tasks: [] }; phases.push(cur); }
    else if (/^[\*\-]\s*\[/.test(t)) {
      const done = t.includes('[x]') || t.includes('[X]');
      const txt = t.replace(/^[\*\-]\s*\[[xX\s]\]\s*/, '').trim();
      if (!cur) { cur = { title: 'Tasks', tasks: [] }; phases.push(cur); }
      cur.tasks.push({ id: Math.random(), text: txt, done });
    }
  });
  return phases;
}

/* ─────────────────────────────────────────
   CONSTANTS - Premium Color System
──────────────────────────────────────────*/
const COLORS = {
  white: '#ffffff',
  offWhite: '#fafbfc',
  lightGray: '#f1f3f5',
  mediumGray: '#e9ecef',
  darkGray: '#868e96',
  text: '#212529',
  textSecondary: '#495057',
  textMuted: '#6c757d',
  accent: '#0d6efd',
  accentLight: '#e7f1ff',
  accentDark: '#0a58ca',
  accentSecondary: '#6366f1',
  accentSecondaryLight: '#eef2ff',
  accentSecondaryDark: '#4f46e5',
  accentTertiary: '#0dcaf0',
  accentTertiaryLight: '#cff4fc',
  accentTertiaryDark: '#0aa2c0',
  border: '#dee2e6',
  borderLight: '#e9ecef',
  shadow: 'rgba(0, 0, 0, 0.1)',
  shadowSubtle: 'rgba(0, 0, 0, 0.05)',
  shadowLarge: 'rgba(0, 0, 0, 0.15)',
  success: '#198754',
  successLight: '#d1e7dd',
  warning: '#ffc107',
  warningLight: '#fff3cd',
  danger: '#dc3545',
  dangerLight: '#f8d7da',
  glass: 'rgba(255, 255, 255, 0.7)',
  glassDark: 'rgba(255, 255, 255, 0.9)',
  surface: '#ffffff',
  surfaceElevated: '#ffffff',
  background: '#f8f9fa'
};

const FIELD = {
  summary: 'summaryData', timeline: 'timelineData',
  mindmap: 'mindmapData', plan: 'projectPlanData'
};

const TABS = [
  { id: 'summary',    label: 'Read',    icon: FileText },
  { id: 'timeline',   label: 'Trace',   icon: GitCommit },
  { id: 'mindmap',    label: 'Connect', icon: Network },
  { id: 'plan',       label: 'Plan',    icon: ListTodo },
  { id: 'flashcards', label: 'Recall',  icon: BookOpen },
];

function getGreeting() {
  const h = new Date().getHours();
  if (h < 5)  return 'Still up?';
  if (h < 12) return 'Good morning.';
  if (h < 17) return 'Good afternoon.';
  if (h < 21) return 'Good evening.';
  return 'Good night.';
}

/* ─────────────────────────────────────────
   REUSABLE SMALL COMPONENTS
──────────────────────────────────────────*/
function Modal({ title, onClose, children }) {
  React.useEffect(() => {
    const fn = e => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', fn);
    return () => window.removeEventListener('keydown', fn);
  }, [onClose]);
  return (
    <div
      onClick={e => { if (e.target === e.currentTarget) onClose(); }}
      style={{ position: 'fixed', inset: 0, zIndex: 200, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20, background: 'rgba(26,26,46,0.4)', backdropFilter: 'blur(12px)' }}
    >
      <div style={{ width: '100%', maxWidth: 420, background: '#faf9f6', borderRadius: 2, border: '2px solid rgba(233,69,96,0.2)', boxShadow: '0 32px 64px -16px rgba(26,26,46,0.25)', overflow: 'hidden' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '20px 24px', borderBottom: '2px solid rgba(233,69,96,0.15)', background: 'linear-gradient(180deg, #faf9f6 0%, #f5f0e6 100%)' }}>
          <span style={{ fontSize: 16, fontWeight: 700, color: '#1a1a2e', fontFamily: 'inherit', fontStyle: 'normal', letterSpacing: '0.02em' }}>{title}</span>
          <button onClick={onClose} style={{ width: 32, height: 32, borderRadius: 2, border: '1px solid rgba(233,69,96,0.2)', background: 'transparent', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#e94560' }}
            onMouseOver={e => e.currentTarget.style.background = 'rgba(233,69,96,0.1)'}
            onMouseOut={e => e.currentTarget.style.background = 'transparent'}>
            <X size={16} strokeWidth={2.2} />
          </button>
        </div>
        <div style={{ padding: '24px' }}>{children}</div>
      </div>
    </div>
  );
}

function SBtn({ children, onClick, style = {}, disabled = false }) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      onMouseOver={e => { if (!disabled) e.currentTarget.style.opacity = '0.85'; }}
      onMouseOut={e => { e.currentTarget.style.opacity = '1'; }}
      style={{ border: 'none', cursor: disabled ? 'not-allowed' : 'pointer', fontFamily: 'inherit', display: 'inline-flex', alignItems: 'center', gap: 6, transition: 'opacity 0.12s', opacity: disabled ? 0.4 : 1, ...style }}
    >
      {children}
    </button>
  );
}

/* ─────────────────────────────────────────
   WORKSPACE CARD - Enhanced with professional thumbnail
──────────────────────────────────────────*/
function WorkspaceCard({ n, index = 0, onOpen, onDelete, onRename }) {
  const [hov, setHov] = useState(false);
  const activeSrc = (n.sources || []).filter(s => s.active).length;
  const totalSrc  = (n.sources || []).length;
  const progress = totalSrc ? Math.min(100, Math.round((activeSrc / totalSrc) * 100)) : 0;
  const colors = ['#f97316', '#8b5cf6', '#3b82f6', '#10b981', '#f59e0b'];
  const cardColor = colors[index % colors.length];

  return (
    <div style={{ position: 'relative' }}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}>
      <button
        onClick={() => onOpen(n.id)}
        style={{
          width: '100%', textAlign: 'left', padding: 0, borderRadius: 16,
          border: `1px solid ${hov ? cardColor : COLORS.border}`,
          background: COLORS.white,
          cursor: 'pointer',
          transition: 'all 0.3s ease',
          boxShadow: hov ? '0 8px 24px rgba(0,0,0,0.12)' : '0 2px 8px rgba(0,0,0,0.04)',
          transform: hov ? 'translateY(-4px)' : 'translateY(0)',
          display: 'flex', flexDirection: 'column', minHeight: 160,
          boxSizing: 'border-box', overflow: 'hidden'
        }}
      >
        {/* Visual Thumbnail Area */}
        <div style={{ height: 100, background: `linear-gradient(135deg, ${cardColor}15 0%, ${cardColor}30 100%)`, padding: '20px', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative' }}>
          {/* Document stack illustration */}
          <svg width="80" height="80" viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg">
            {/* Back document */}
            <rect x="15" y="20" width="35" height="45" rx="4" fill="#fff" stroke={cardColor} strokeWidth="1.5" opacity="0.6" transform="rotate(-5 32.5 42.5)" />
            {/* Front document */}
            <rect x="30" y="15" width="35" height="45" rx="4" fill="#fff" stroke={cardColor} strokeWidth="2" />
            {/* Document lines */}
            <rect x="38" y="25" width="19" height="3" rx="1.5" fill={cardColor} opacity="0.8" />
            <rect x="38" y="32" width="15" height="2" rx="1" fill="#e2e8f0" />
            <rect x="38" y="37" width="18" height="2" rx="1" fill="#e2e8f0" />
            <rect x="38" y="42" width="12" height="2" rx="1" fill="#e2e8f0" />
            {/* Decorative elements */}
            <circle cx="52" cy="65" r="4" fill={cardColor} opacity="0.3" />
            <circle cx="20" cy="70" r="3" fill={cardColor} opacity="0.2" />
          </svg>
          {/* Status badge */}
          <div style={{ position: 'absolute', top: 12, right: 12, padding: '4px 10px', borderRadius: 20, background: cardColor, color: '#fff', fontSize: 11, fontWeight: 600, boxShadow: '0 2px 8px rgba(0,0,0,0.15)' }}>
            {totalSrc} files
          </div>
        </div>

        {/* Content Area */}
        <div style={{ padding: '20px', flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
          <div>
            <h3 style={{ margin: '0 0 6px', fontSize: 16, fontWeight: 600, color: COLORS.text, lineHeight: 1.3 }}>
              {n.name}
            </h3>
            <p style={{ margin: 0, fontSize: 13, color: COLORS.darkGray }}>
              {totalSrc} {totalSrc === 1 ? 'source' : 'sources'}
            </p>
          </div>

          {totalSrc > 0 && (
            <div style={{ marginTop: 16 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8, fontSize: 12 }}>
                <span style={{ color: COLORS.darkGray }}>{activeSrc} active</span>
                <span style={{ color: cardColor, fontWeight: 600 }}>{progress}%</span>
              </div>
              <div style={{ height: 5, background: COLORS.lightGray, borderRadius: 3, overflow: 'hidden' }}>
                <div style={{ height: '100%', width: `${progress}%`, background: cardColor, borderRadius: 3, transition: 'width 0.3s ease' }} />
              </div>
            </div>
          )}
        </div>
      </button>

      {hov && (
        <div style={{ position: 'absolute', bottom: 16, right: 16, display: 'flex', gap: 6 }}>
          <button onClick={e => { e.stopPropagation(); onRename(n); }} title="Rename"
            style={{ width: 32, height: 32, borderRadius: 8, border: 'none', background: COLORS.white, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: COLORS.darkGray, boxShadow: '0 2px 8px rgba(0,0,0,0.15)' }}
            onMouseOver={e => { e.currentTarget.style.background = COLORS.lightGray; }}
            onMouseOut={e => { e.currentTarget.style.background = COLORS.white; }}>
            <Edit2 size={14} strokeWidth={2} />
          </button>
          <button onClick={e => { e.stopPropagation(); onDelete(n.id); }} title="Delete"
            style={{ width: 32, height: 32, borderRadius: 8, border: 'none', background: COLORS.white, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: COLORS.darkGray, boxShadow: '0 2px 8px rgba(0,0,0,0.15)' }}
            onMouseOver={e => { e.currentTarget.style.background = '#fee2e2'; e.currentTarget.style.color = '#ef4444'; }}
            onMouseOut={e => { e.currentTarget.style.background = COLORS.white; e.currentTarget.style.color = COLORS.darkGray; }}>
            <Trash2 size={14} strokeWidth={2} />
          </button>
        </div>
      )}
    </div>
  );
}

function NewCard({ onClick }) {
  const [hov, setHov] = useState(false);
  return (
    <button onClick={onClick}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        width: '100%', minHeight: 160, borderRadius: 16, cursor: 'pointer',
        border: `2px dashed ${hov ? COLORS.accentOrange : COLORS.border}`,
        background: hov ? COLORS.accentOrangeLight : 'transparent',
        display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
        gap: 16, fontFamily: 'inherit',
        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
        transform: hov ? 'translateY(-4px)' : 'translateY(0)',
        boxShadow: hov ? '0 8px 24px rgba(249,115,22,0.15)' : 'none',
        boxSizing: 'border-box', padding: 24
      }}>
      <div style={{ width: 56, height: 56, borderRadius: 16, background: hov ? COLORS.accentOrange : COLORS.lightGray, display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all 0.3s', boxShadow: hov ? '0 4px 12px rgba(249,115,22,0.3)' : 'none' }}>
        <Plus size={28} strokeWidth={2.5} color={hov ? COLORS.white : COLORS.darkGray} />
      </div>
      <span style={{ fontSize: 15, fontWeight: 600, color: hov ? COLORS.accentOrangeDark : COLORS.darkGray }}>Create Library</span>
    </button>
  );
}

/* ─────────────────────────────────────────
   SIDEBAR NAV ITEM - Premium Design
──────────────────────────────────────────*/
function NavItem({ icon: Icon, label, active, onClick, badgeColor = null }) {
  const [hov, setHov] = useState(false);
  return (
    <button onClick={onClick}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        width: '100%', display: 'flex', alignItems: 'center', gap: 14, padding: '14px 16px',
        borderRadius: 10, border: 'none',
        background: active ? COLORS.accentLight : hov ? COLORS.lightGray : 'transparent',
        cursor: 'pointer', fontFamily: 'inherit', fontSize: 14.5,
        fontWeight: active ? 600 : 500,
        color: active ? COLORS.accentDark : hov ? COLORS.text : COLORS.textSecondary,
        transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
        position: 'relative',
        ...(active && { boxShadow: '0 1px 3px rgba(13, 110, 253, 0.1)' })
      }}>
      <div style={{ position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <Icon size={19} strokeWidth={active ? 2.5 : 2} color={active ? COLORS.accentDark : hov ? COLORS.text : COLORS.textSecondary} style={{ transition: 'all 0.2s' }} />
        {badgeColor && (
          <div style={{ position: 'absolute', top: -3, right: -3, width: 8, height: 8, borderRadius: '50%', background: badgeColor, border: '2px solid #fff', boxShadow: '0 1px 3px rgba(0,0,0,0.2)' }} />
        )}
      </div>
      <span style={{ transition: 'color 0.2s' }}>{label}</span>
      {active && (
        <div style={{ position: 'absolute', left: 0, top: '50%', transform: 'translateY(-50%)', width: 3, height: 24, background: COLORS.accent, borderRadius: '0 4px 4px 0' }} />
      )}
    </button>
  );
}

function WsNavItem({ n, active, onClick, onRename, onDelete }) {
  const [hov, setHov] = useState(false);
  return (
    <div style={{ position: 'relative' }}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}>
      <button onClick={onClick}
        style={{
          width: '100%', display: 'flex', alignItems: 'center', gap: 10, padding: '10px 14px',
          paddingRight: hov ? 54 : 14,
          borderRadius: 8, border: 'none',
          background: active ? COLORS.accentOrangeLight : hov ? COLORS.lightGray : 'transparent',
          cursor: 'pointer', fontFamily: 'inherit', fontSize: 14, fontWeight: active ? 600 : 500,
          color: active ? COLORS.accentOrangeDark : hov ? COLORS.text : COLORS.darkGray,
          transition: 'all 0.2s ease', textAlign: 'left',
        }}>
        <FileText size={16} strokeWidth={active ? 2.2 : 1.8} style={{ flexShrink: 0, color: active ? COLORS.accentOrangeDark : hov ? COLORS.text : COLORS.darkGray, transition: 'color 0.2s' }} />
        <span style={{ flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{n.name}</span>
      </button>
      {hov && (
        <div style={{ position: 'absolute', right: 6, top: '50%', transform: 'translateY(-50%)', display: 'flex', gap: 2 }}>
          <button onClick={e => { e.stopPropagation(); onRename(); }}
            style={{ width: 24, height: 24, borderRadius: 6, border: 'none', background: COLORS.lightGray, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: COLORS.darkGray }}
            onMouseOver={e => { e.currentTarget.style.background = COLORS.mediumGray; }}
            onMouseOut={e => { e.currentTarget.style.background = COLORS.lightGray; }}>
            <Edit2 size={12} strokeWidth={2} />
          </button>
          <button onClick={e => { e.stopPropagation(); onDelete(); }}
            style={{ width: 24, height: 24, borderRadius: 6, border: 'none', background: COLORS.lightGray, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: COLORS.darkGray }}
            onMouseOver={e => { e.currentTarget.style.background = '#fee2e2'; e.currentTarget.style.color = '#ef4444'; }}
            onMouseOut={e => { e.currentTarget.style.background = COLORS.lightGray; e.currentTarget.style.color = COLORS.darkGray; }}>
            <Trash2 size={12} strokeWidth={2} />
          </button>
        </div>
      )}
    </div>
  );
}

/* ─────────────────────────────────────────
   MAIN DASHBOARD
──────────────────────────────────────────*/
export default function Dashboard({ navigate }) {
  // Always in DOM — keeps ref valid for file picker
  const fileInputRef = useRef(null);
  const chatEndRef   = useRef(null);
  const renameRef    = useRef(null);

  // All useState calls must come before useEffect
  const [notebooks, setNotebooks] = useState(() => {
    try {
      const saved = localStorage.getItem('meridian_workspaces');
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error('Failed to load workspaces from local storage', e);
    }
    return [];
  });

  const [activeId, setActiveId]     = useState(null);
  const [tab, setTab]               = useState('summary');
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [modal, setModal]           = useState(null);
  const [apiKey, setApiKey]         = useState('');
  const [apiProvider, setApiProvider] = useState(() => localStorage.getItem('api_provider') || 'groq');
  const [isDragging, setIsDragging] = useState(false);
  const [parsing, setParsing]       = useState('');
  const [chatMsg, setChatMsg]       = useState('');
  const [isTyping, setIsTyping]     = useState(false);
  const [compiling, setCompiling]   = useState(false);
  const [cardIdx, setCardIdx]       = useState(0);
  const [flipped, setFlipped]       = useState(false);
  const [renameTarget, setRenameTarget] = useState(null);
  const [renameVal, setRenameVal]   = useState('');
  const [toast, setToast]           = useState(null);
  const [rWidth, setRWidth]         = useState(288);
  const [isDraggingR, setIsDraggingR] = useState(false);

  // All useEffect calls after useState
  useEffect(() => {
    localStorage.setItem('meridian_workspaces', JSON.stringify(notebooks));
  }, [notebooks]);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const q = params.get('q');
    if (q) {
      const id = 'ws-' + Date.now();
      setNotebooks(prev => [...prev, { id, name: 'New Project', sources: [], chatHistory: [], summaryData: '', timelineData: '', mindmapData: '', projectPlanData: '', flashcards: [] }]);
      setTimeout(() => {
        setActiveId(id);
        setChatMsg(q);
      }, 0);
      window.history.replaceState({}, '', '/dashboard');
    }
  }, []);

  useEffect(() => {
    if (!isDraggingR) return;
    const onMove = e => setRWidth(Math.max(250, Math.min(800, window.innerWidth - e.clientX)));
    const onUp = () => setIsDraggingR(false);
    window.addEventListener('mousemove', onMove);
    window.addEventListener('mouseup', onUp);
    return () => { window.removeEventListener('mousemove', onMove); window.removeEventListener('mouseup', onUp); };
  }, [isDraggingR]);

  const nb = notebooks.find(n => n.id === activeId) || null;

  useEffect(() => {
    setApiKey(localStorage.getItem('meridian_api_key') || '');
    setApiProvider(localStorage.getItem('api_provider') || 'groq');
    if (window.pdfjsLib) {
      window.pdfjsLib.GlobalWorkerOptions.workerSrc =
        'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.4.120/pdf.worker.min.js';
    }
  }, []);

  useEffect(() => { chatEndRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [nb?.chatHistory, isTyping]);
  useEffect(() => { setCardIdx(0); setFlipped(false); }, [tab, activeId]);
  useEffect(() => { if (modal === 'rename') setTimeout(() => renameRef.current?.focus(), 60); }, [modal]);

  const upd = useCallback(fields =>
    setNotebooks(prev => prev.map(n => n.id === activeId ? { ...n, ...fields } : n)),
    [activeId]);

  const showToast = (msg, type = 'ok') => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  };

  /* ── Gemini API ── */
  const callGemini = async (sys, prompt, isJson = false) => {
    const body = {
      contents: [{ parts: [{ text: prompt }] }],
      systemInstruction: { parts: [{ text: sys }] },
      generationConfig: { temperature: 0.2 }
    };
    if (isJson) body.generationConfig.responseMimeType = "application/json";

    const res = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-flash-latest:generateContent?key=${apiKey}`,
      { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) }
    );
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err?.error?.message || `API ${res.status}: ${res.statusText}`);
    }
    return (await res.json()).candidates[0].content.parts[0].text;
  };

  /* ── Groq API ── */
  const callGroq = async (sys, prompt, isJson = false) => {
    const GROQ_API_KEY = apiKey;
    
    const body = {
      messages: [
        { role: 'system', content: sys },
        { role: 'user', content: prompt }
      ],
      model: 'openai/gpt-oss-20b',
      temperature: 0.2,
      response_format: isJson ? { type: 'json_object' } : { type: 'text' }
    };

    const res = await fetch(
      'https://api.groq.com/openai/v1/chat/completions',
      { method: 'POST', headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${GROQ_API_KEY}` }, body: JSON.stringify(body) }
    );
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err?.error?.message || `Groq API ${res.status}: ${res.statusText}`);
    }
    return (await res.json()).choices[0]?.message?.content || '';
  };

  /* ── Unified API Call ── */
  const callAPI = async (sys, prompt, isJson = false) => {
    const provider = localStorage.getItem('api_provider') || 'groq';
    if (provider === 'groq') {
      return callGroq(sys, prompt, isJson);
    } else {
      return callGemini(sys, prompt, isJson);
    }
  };

  /* ── Compile ── */
  const compile = async (type) => {
    if (!nb?.sources?.some(s => s.active)) { showToast('Activate at least one source first.', 'warn'); return; }
    setCompiling(true);
    try {
      const srcText = nb.sources.filter(s => s.active)
        .map(s => `[${s.name}]:\n${s.text}`).join('\n\n---\n\n');
      const provider = localStorage.getItem('api_provider') || 'groq';
      
      if (provider === 'gemini' && !apiKey) {
        // Fall back to offline mode for Gemini if no key
        const off = generateOfflineContent(nb);
        if (type === 'flashcards') upd({ flashcards: off.flashcards });
        else if (FIELD[type]) upd({ [FIELD[type]]: off[type] });
      } else {
        const cfgs = {
          summary:    [
            'You are an analyst. Summarize this text quickly and concisely using markdown (`##` for title, bullet points).',
            `Summarize concisely:\n\n${srcText}`
          ],
          timeline:   [
            'You are a historian. Extract up to 10 key events. Format as a strict markdown list: `- **[Time]**: [Event]`. Be extremely brief.',
            `Extract a quick timeline (max 10 items) from:\n\n${srcText}`
          ],
          mindmap:    [
            'You are a systems expert. Create a very brief, indented markdown list (`*`, `  *`) representing the core concepts. No intro text.',
            `Create a quick concept list from:\n\n${srcText}`
          ],
          plan:       [
            'You are a PM. Create a short roadmap. Use `### Phase [X]: [Name]` and `- [ ] [Task]`. Limit to 3 phases, very brief.',
            `Generate a quick roadmap from:\n\n${srcText}`
          ],
          flashcards: [
            'Generate exactly 5 flashcards for key terms. Output ONLY a valid JSON array of objects with keys "q" and "a". Keep answers very short.',
            `Generate 5 quick JSON flashcards from:\n\n${srcText}`
          ],
        };
        const [sys, prompt] = cfgs[type] || cfgs.summary;
        const resp = await callAPI(sys, prompt, type === 'flashcards');
        if (type === 'flashcards') {
          try { upd({ flashcards: JSON.parse(resp.replace(/```json/i, '').replace(/```/, '').trim()) }); }
          catch { upd({ flashcards: [] }); showToast('Could not parse flashcards — try again.', 'warn'); }
        } else {
          upd({ [FIELD[type]]: resp });
        }
      }
      setTab(type);
      showToast(`${TABS.find(t => t.id === type)?.label || type} ready`);
    } catch (e) { showToast(e.message, 'error'); }
    finally { setCompiling(false); }
  };

  /* ── Chat ── */
  const sendChat = async () => {
    if (!chatMsg.trim() || isTyping) return;
    const hist = [...(nb?.chatHistory || []), { sender: 'user', text: chatMsg.trim() }];
    upd({ chatHistory: hist }); setChatMsg(''); setIsTyping(true);
    const provider = localStorage.getItem('api_provider') || 'groq';
    
    if (provider === 'gemini' && !apiKey) {
      setTimeout(() => {
        setIsTyping(false);
        upd({ chatHistory: [...hist, { sender: 'assistant', text: generateOfflineChatResponse(chatMsg, nb) }] });
      }, 650);
      return;
    }
    try {
      const ctx = nb.sources.filter(s => s.active).map(s => `[${s.name}]:\n${s.text}`).join('\n\n');
      const histStr = hist.map(h => `${h.sender === 'user' ? 'User' : 'Meridian'}: ${h.text}`).join('\n');
      const resp = await callAPI(
        'You are Meridian, a concise, highly intelligent research assistant. You answer the user\'s questions using strictly the provided context. If the answer is not in the context, politely state that you cannot find it in the current documents. Format your response beautifully using markdown (bolding, lists, code blocks if necessary).',
        `Context Documents:\n${ctx}\n\n---\nConversation History:\n${histStr}\n\nMeridian:`
      );
      upd({ chatHistory: [...hist, { sender: 'assistant', text: resp }] });
    } catch (e) {
      upd({ chatHistory: [...hist, { sender: 'assistant', text: '⚠ ' + e.message }] });
    } finally { setIsTyping(false); }
  };

  /* ── PDF processing ── */
  const processPdf = useCallback(async (file) => {
    if (!file) return;
    if (!file.name.toLowerCase().endsWith('.pdf')) { showToast('Only PDF files are supported.', 'warn'); return; }
    if (!nb) { showToast('Open a workspace first, then add a source.', 'warn'); return; }
    setParsing(`Reading ${file.name}…`);
    const reader = new FileReader();
    reader.onload = async ev => {
      try {
        if (!window.pdfjsLib) throw new Error('PDF.js not loaded. Check index.html.');
        const pdf = await window.pdfjsLib.getDocument({ data: ev.target.result }).promise;
        let text = '';
        for (let i = 1; i <= pdf.numPages; i++) {
          const page = await pdf.getPage(i);
          const c = await page.getTextContent();
          text += `\n[p.${i}] ` + c.items.map(x => x.str).join(' ');
        }
        const src = {
          id: 'pdf-' + Date.now(), name: file.name, type: 'pdf',
          size: (file.size / 1048576).toFixed(1) + ' MB', text, active: true
        };
        upd({ sources: [...(nb?.sources || []), src] });
        setModal(null);
        showToast(`${file.name} added`);
      } catch (err) { showToast('PDF error: ' + err.message, 'error'); }
      finally { setParsing(''); }
    };
    reader.readAsArrayBuffer(file);
  }, [nb, upd]);

  const handleFilePick = e => {
    const file = e.target.files?.[0];
    if (file) processPdf(file);
    e.target.value = ''; // allow re-picking same file
  };

  const handleDrop = e => {
    e.preventDefault(); setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) processPdf(file);
  };

  /* ── Workspace ops ── */
  const createWs = () => {
    const id = 'ws-' + Date.now();
    setNotebooks(prev => [...prev, { id, name: 'Untitled Workspace', sources: [], chatHistory: [], summaryData: '', timelineData: '', mindmapData: '', projectPlanData: '', flashcards: [] }]);
    setActiveId(id);
  };

  const deleteWs = (id) => {
    if (!window.confirm('Delete this workspace?')) return;
    setNotebooks(prev => prev.filter(n => n.id !== id));
    if (activeId === id) setActiveId(null);
  };

  const openRename = n => { setRenameTarget(n); setRenameVal(n.name); setModal('rename'); };
  const commitRename = () => {
    if (renameVal.trim() && renameTarget) {
      setNotebooks(prev => prev.map(n => n.id === renameTarget.id ? { ...n, name: renameVal.trim() } : n));
    }
    setModal(null); setRenameTarget(null);
  };
  const toggleTask = (taskText, currentDone) => {
    if (!nb?.projectPlanData) return;
    const lines = nb.projectPlanData.split('\n');
    const updatedLines = lines.map(line => {
      if (line.includes(taskText) && /^[\*\-]\s*\[/.test(line.trim())) {
        return currentDone ? line.replace(/\[[xX]\]/, '[ ]') : line.replace(/\[\s*\]/, '[x]');
      }
      return line;
    });
    upd({ projectPlanData: updatedLines.join('\n') });
  };

  const toggleAllSources = () => {
    if (!nb || !nb.sources) return;
    const allActive = nb.sources.every(s => s.active);
    upd({ sources: nb.sources.map(s => ({ ...s, active: !allActive })) });
  };

  /* computed */
  const currentData   = nb && FIELD[tab] ? nb[FIELD[tab]] : '';
  const flashcards    = nb?.flashcards || [];
  const hasData       = tab === 'flashcards' ? flashcards.length > 0 : !!currentData;
  const hasSources    = nb?.sources?.some(s => s.active);
  const tlItems       = tab === 'timeline' && currentData ? parseTimeline(currentData)  : [];
  const mmNodes       = tab === 'mindmap'  && currentData ? parseMindmap(currentData)   : [];
  const rmPhases      = tab === 'plan'     && currentData ? parseRoadmap(currentData)   : [];
  const sourceCount   = notebooks.reduce((sum, book) => sum + (book.sources?.length || 0), 0);
  const activeSources = notebooks.reduce((sum, book) => sum + (book.sources?.filter(s => s.active).length || 0), 0);

  const renderTabHeader = (title, subtitle) => {
    const tabColors = {
      summary: COLORS.accentOrange,
      timeline: COLORS.accentPurple,
      mindmap: COLORS.accentBlue,
      plan: COLORS.success,
      flashcards: COLORS.warning
    };
    const color = tabColors[tab] || COLORS.accentOrange;

    return (
      <div style={{ borderBottom: '1px solid #E5E7EB', paddingBottom: 24, marginBottom: 32 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 8 }}>
          <div style={{ width: 4, height: 32, background: color, borderRadius: 2 }} />
          <h2 style={{ margin: 0, fontSize: 28, fontWeight: 700, fontFamily: 'inherit', color: COLORS.text, letterSpacing: '-0.02em' }}>
            {title}
          </h2>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, fontSize: 13, color: COLORS.darkGray, marginLeft: 16 }}>
          <span>{subtitle}</span>
          {nb?.sources?.some(s => s.active) && (
            <>
              <span style={{ color: '#CBD5E1', fontSize: 16 }}>·</span>
              <span style={{ background: color + '15', color: color, padding: '4px 12px', borderRadius: 20, fontWeight: 500, fontSize: 12 }}>
                From {nb.sources.filter(s => s.active).length} source{nb.sources.filter(s => s.active).length !== 1 ? 's' : ''}
              </span>
            </>
          )}
        </div>
      </div>
    );
  };

  /* ─────── styles shorthand ─────── */
  const S = {
    root:       { display: 'flex', minHeight: '100vh', overflow: 'hidden', fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif', background: COLORS.background, color: COLORS.text },
    sb:         { flexShrink: 0, display: 'flex', flexDirection: 'column', background: COLORS.surface, overflow: 'hidden', transition: 'width 0.3s cubic-bezier(0.4,0,0.2,1)', borderRight: `1px solid ${COLORS.borderLight}`, width: 280 },
    sbHead:     { height: 72, display: 'flex', alignItems: 'center', gap: 12, padding: '0 24px', borderBottom: `1px solid ${COLORS.borderLight}`, flexShrink: 0 },
    sbNav:      { flex: 1, overflowY: 'auto', overflowX: 'hidden', padding: '20px 16px', scrollbarWidth: 'none' },
    sbLbl:      { fontSize: 11, fontWeight: 700, color: COLORS.textMuted, textTransform: 'uppercase', letterSpacing: '0.15em', padding: '28px 16px 12px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' },
    sbFoot:     { flexShrink: 0, borderTop: `1px solid ${COLORS.borderLight}`, padding: 20 },
    main:       { flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0, background: COLORS.background },
    topbar:     { height: 80, borderBottom: `1px solid ${COLORS.borderLight}`, display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 40px', flexShrink: 0, background: COLORS.surface },
    centerPane: { flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0 },
    tabBar:     { height: 64, borderBottom: `1px solid ${COLORS.borderLight}`, display: 'flex', alignItems: 'center', gap: 2, padding: '0 32px', flexShrink: 0, overflowX: 'auto', scrollbarWidth: 'none', background: COLORS.surface },
    viewer:     { flex: 1, overflowY: 'auto', position: 'relative', scrollbarWidth: 'thin', scrollbarColor: '#dee2e6 transparent', background: COLORS.background, padding: '40px' },
    rPanel:     { width: rWidth, flexShrink: 0, display: 'flex', flexDirection: 'column', background: COLORS.surface, borderLeft: `1px solid ${COLORS.borderLight}`, position: 'relative' },
    rHead:      { height: 64, borderBottom: `1px solid ${COLORS.borderLight}`, display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 24px', flexShrink: 0, background: COLORS.surface },
    rLbl:       { fontSize: 11, fontWeight: 700, color: COLORS.textMuted, textTransform: 'uppercase', letterSpacing: '0.15em' },
  };

  return (
    <div style={{ ...S.root, userSelect: isDraggingR ? 'none' : 'auto', cursor: isDraggingR ? 'col-resize' : 'auto' }}
      onDragOver={e => { if (nb) { e.preventDefault(); setIsDragging(true); }}}
      onDragLeave={e => { if (!e.currentTarget.contains(e.relatedTarget)) setIsDragging(false); }}
      onDrop={handleDrop}
    >
      {/* ══ PERSISTENT file input (never unmounts) ══ */}
      <input
        ref={fileInputRef}
        type="file"
        accept=".pdf"
        onChange={handleFilePick}
        style={{ position: 'fixed', top: -9999, left: -9999, opacity: 0, pointerEvents: 'none' }}
      />

      {/* ══ DRAG OVERLAY ══ */}
      {isDragging && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 100, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(26,26,46,0.5)', backdropFilter: 'blur(12px)', pointerEvents: 'none' }}>
          <div style={{ background: '#faf9f6', borderRadius: 2, padding: '40px 56px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 16, boxShadow: '0 32px 64px rgba(26,26,46,0.25)', border: '2px solid rgba(233,69,96,0.3)' }}>
            <UploadCloud size={40} strokeWidth={2} color="#e94560" />
            <p style={{ fontSize: 16, fontWeight: 700, color: '#1a1a2e', margin: 0, fontFamily: 'inherit', fontStyle: 'normal', letterSpacing: '0.02em' }}>Drop PDF to add source</p>
            <p style={{ fontSize: 13, color: '#8b8b7a', margin: 0, fontFamily: 'inherit' }}>Will be added to this library</p>
          </div>
        </div>
      )}

      {/* ══ SIDEBAR ══ */}
      <aside style={{ ...S.sb, width: sidebarOpen ? 280 : 0 }}>
        <div style={{ ...S.sbHead, cursor: 'pointer', transition: 'background 0.2s', background: 'linear-gradient(180deg, #fff 0%, #fafafa 100%)' }}
          onClick={() => navigate && navigate('/')}
          onMouseEnter={e => e.currentTarget.style.background = COLORS.lightGray}
          onMouseLeave={e => e.currentTarget.style.background = 'linear-gradient(180deg, #fff 0%, #fafafa 100%)'}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{ width: 40, height: 40, borderRadius: 12, background: 'linear-gradient(135deg, #f97316 0%, #fb923c 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 4px 12px rgba(249,115,22,0.25)' }}>
              <BoatLogo size={22} color="#fff" sw={2.5} />
            </div>
            <div>
              <span style={{ fontSize: 19, fontWeight: 700, letterSpacing: '-0.02em', color: COLORS.text, display: 'block', lineHeight: 1.2 }}>StudyLM</span>
              <span style={{ fontSize: 11, fontWeight: 500, color: COLORS.darkGray, letterSpacing: '0.05em' }}>Smart Learning</span>
            </div>
          </div>
          <span style={{ marginLeft: 'auto', fontSize: 10, fontWeight: 700, color: COLORS.success, background: '#ecfdf5', padding: '6px 12px', borderRadius: 20, textTransform: 'uppercase', letterSpacing: '0.1em' }}>Free</span>
        </div>
        
        {/* Search Bar */}
        <div style={{ padding: '16px 20px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '10px 12px', borderRadius: 8, background: COLORS.lightGray, border: `1px solid ${COLORS.border}` }}>
            <Search size={16} color={COLORS.darkGray} strokeWidth={2} />
            <input type="text" placeholder="Search anything" style={{ border: 'none', background: 'none', outline: 'none', fontSize: 14, color: COLORS.text, flex: 1, fontFamily: 'inherit' }} />
          </div>
        </div>
        
        <div style={S.sbNav}>
          <NavItem icon={Home} label="Overview" active={activeId === null} onClick={() => setActiveId(null)} />
          <div style={S.sbLbl}>
            <span>My Libraries</span>
            <button onClick={createWs} title="New workspace"
              style={{ width: 24, height: 24, borderRadius: 6, border: 'none', background: COLORS.lightGray, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: COLORS.darkGray }}
              onMouseOver={e => { e.currentTarget.style.background = COLORS.mediumGray; }}
              onMouseOut={e => { e.currentTarget.style.background = COLORS.lightGray; }}>
              <Plus size={14} strokeWidth={2.5} />
            </button>
          </div>
          {notebooks.map(n => (
            <WsNavItem key={n.id} n={n} active={n.id === activeId}
              onClick={() => setActiveId(n.id)}
              onRename={() => openRename(n)}
              onDelete={() => deleteWs(n.id)} />
          ))}

          {/* Features Section */}
          <div style={S.sbLbl}>
            <span>Features</span>
          </div>
          <NavItem icon={Sparkles} label="Insights" active={false} onClick={() => {}} badgeColor="#f97316" />
          <NavItem icon={Network} label="Study Analysis" active={false} onClick={() => {}} badgeColor="#8b5cf6" />
          <NavItem icon={MessageSquare} label="Assistant" active={false} onClick={() => {}} badgeColor="#3b82f6" />
          <NavItem icon={Settings} label="Settings" active={false} onClick={() => setModal('settings')} />
        </div>
      </aside>

      {/* ══ MAIN ══ */}
      <div style={S.main}>

        {/* Top bar */}
        <div style={S.topbar}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
            <button onClick={() => setSidebarOpen(s => !s)}
              style={{ width: 44, height: 44, borderRadius: 12, border: 'none', background: COLORS.lightGray, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: COLORS.darkGray, transition: 'all 0.2s' }}
              onMouseOver={e => { e.currentTarget.style.background = COLORS.mediumGray; e.currentTarget.style.transform = 'scale(1.05)'; }}
              onMouseOut={e => { e.currentTarget.style.background = COLORS.lightGray; e.currentTarget.style.transform = 'scale(1)'; }}>
              <Menu size={22} strokeWidth={2} />
            </button>
            {/* Breadcrumb */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, fontSize: 15, color: COLORS.darkGray, fontWeight: 500 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '8px 16px', background: 'linear-gradient(135deg, #fff7ed 0%, #fff 100%)', borderRadius: 12, border: '1px solid #fed7aa' }}>
                <BoatLogo size={20} color={COLORS.accentOrange} sw={2} />
                <span style={{ color: COLORS.accentOrangeDark, fontWeight: 600 }}>StudyLM</span>
              </div>
              {nb && (
                <>
                  <ChevronRight size={16} strokeWidth={2} style={{ color: COLORS.mediumGray }} />
                  <span
                    onDoubleClick={() => openRename(nb)}
                    title="Double-click to rename"
                    style={{ color: COLORS.text, fontWeight: 600, cursor: 'pointer', padding: '8px 16px', background: '#fff', borderRadius: 12, border: '1px solid #e2e8f0', transition: 'all 0.2s' }}
                    onMouseOver={e => { e.currentTarget.style.borderColor = COLORS.accentOrange; e.currentTarget.style.background = COLORS.accentOrangeLight; }}
                    onMouseOut={e => { e.currentTarget.style.borderColor = '#e2e8f0'; e.currentTarget.style.background = '#fff'; }}>
                    {nb.name}
                  </span>
                </>
              )}
            </div>
          </div>
          {/* Actions */}
          {nb && (
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <button onClick={() => setModal('source')}
                style={{ height: 44, padding: '0 20px', borderRadius: 12, border: `1px solid ${COLORS.border}`, background: COLORS.white, cursor: 'pointer', fontSize: 14, fontWeight: 500, color: COLORS.text, display: 'flex', alignItems: 'center', gap: 10, fontFamily: 'inherit', boxShadow: '0 2px 8px rgba(0,0,0,0.04)', transition: 'all 0.2s' }}
                onMouseOver={e => { e.currentTarget.style.background = COLORS.lightGray; e.currentTarget.style.borderColor = COLORS.accentOrange; e.currentTarget.style.transform = 'translateY(-1px)'; }}
                onMouseOut={e => { e.currentTarget.style.background = COLORS.white; e.currentTarget.style.borderColor = COLORS.border; e.currentTarget.style.transform = 'translateY(0)'; }}>
                <UploadCloud size={18} strokeWidth={2} /> Add Source
              </button>
              <button onClick={() => compile(tab)} disabled={compiling || !hasSources}
                style={{
                  height: 44, padding: '0 24px', borderRadius: 12, border: 'none',
                  background: (compiling || !hasSources) ? COLORS.mediumGray : 'linear-gradient(135deg, #f97316 0%, #fb923c 100%)',
                  cursor: (compiling || !hasSources) ? 'not-allowed' : 'pointer', fontSize: 14, fontWeight: 600,
                  color: (compiling || !hasSources) ? COLORS.darkGray : COLORS.white, display: 'flex', alignItems: 'center', gap: 10,
                  fontFamily: 'inherit', boxShadow: (compiling || !hasSources) ? 'none' : '0 4px 12px rgba(249,115,22,0.3)',
                  transition: 'all 0.2s'
                }}
                onMouseOver={e => { if (!compiling && hasSources) { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 6px 16px rgba(249,115,22,0.4)'; } }}
                onMouseOut={e => { if (!compiling && hasSources) { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 4px 12px rgba(249,115,22,0.3)'; } }}>
                {compiling ? <Loader2 size={18} strokeWidth={2.5} style={{ animation: 'spin 1s linear infinite' }} /> : <Sparkles size={18} strokeWidth={2.5} />}
                {compiling ? 'Processing…' : 'Generate'}
              </button>
            </div>
          )}
        </div>

        {/* ── HOME ── */}
        {!nb ? (
          <div style={{ flex: 1, overflowY: 'auto', scrollbarWidth: 'none', background: 'linear-gradient(180deg, #fafafa 0%, #f5f5f5 100%)' }}>
            <div style={{ maxWidth: 1200, margin: '0 auto', padding: '80px 60px 120px' }}>

              {/* ── Hero ── */}
              <div style={{ marginBottom: 56, textAlign: 'center' }}>
                <h1 style={{ margin: '0 0 16px', fontSize: 42, fontWeight: 700, fontFamily: 'inherit', color: COLORS.text, lineHeight: 1.2, letterSpacing: '-0.02em' }}>
                  {getGreeting()},!
                </h1>
                <p style={{ margin: 0, fontSize: 18, color: COLORS.darkGray, lineHeight: 1.7, maxWidth: 700, marginLeft: 'auto', marginRight: 'auto' }}>
                  A new day, a new opportunity! Let's create something amazing together with your study tools.
                </p>
              </div>

              {/* ── Feature Cards ── */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 20, marginBottom: 32 }}>
                {/* Study Guide Card */}
                <div style={{ padding: 0, borderRadius: 16, background: COLORS.white, border: `1px solid ${COLORS.border}`, boxShadow: '0 2px 8px rgba(0,0,0,0.04)', display: 'flex', flexDirection: 'column', cursor: 'pointer', transition: 'all 0.3s ease', overflow: 'hidden' }}
                  onMouseOver={e => { e.currentTarget.style.transform = 'translateY(-4px)'; e.currentTarget.style.boxShadow = '0 8px 24px rgba(249,115,22,0.15)'; e.currentTarget.style.borderColor = '#f97316'; }}
                  onMouseOut={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.04)'; e.currentTarget.style.borderColor = COLORS.border; }}>
                  <div style={{ height: 140, background: 'linear-gradient(180deg, #FFF7ED 0%, #fff 100%)', padding: 24, display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative' }}>
                    <StudyGuideIllustration width={120} height={120} />
                  </div>
                  <div style={{ padding: 24 }}>
                    <h3 style={{ margin: '0 0 8px', fontSize: 17, fontWeight: 600, color: COLORS.text }}>Help me build my study guide</h3>
                    <p style={{ margin: 0, fontSize: 14, color: COLORS.darkGray, lineHeight: 1.6 }}>Start fresh or let the system guide your layout and content.</p>
                  </div>
                </div>

                {/* Chat with Docs Card */}
                <div style={{ padding: 0, borderRadius: 16, background: COLORS.white, border: `1px solid ${COLORS.border}`, boxShadow: '0 2px 8px rgba(0,0,0,0.04)', display: 'flex', flexDirection: 'column', cursor: 'pointer', transition: 'all 0.3s ease', overflow: 'hidden' }}
                  onMouseOver={e => { e.currentTarget.style.transform = 'translateY(-4px)'; e.currentTarget.style.boxShadow = '0 8px 24px rgba(139,92,246,0.15)'; e.currentTarget.style.borderColor = '#8b5cf6'; }}
                  onMouseOut={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.04)'; e.currentTarget.style.borderColor = COLORS.border; }}>
                  <div style={{ height: 140, background: 'linear-gradient(180deg, #F5F3FF 0%, #fff 100%)', padding: 24, display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative' }}>
                    <ChatIllustration width={120} height={120} />
                  </div>
                  <div style={{ padding: 24 }}>
                    <h3 style={{ margin: '0 0 8px', fontSize: 17, fontWeight: 600, color: COLORS.text }}>Help me chat with my docs</h3>
                    <p style={{ margin: 0, fontSize: 14, color: COLORS.darkGray, lineHeight: 1.6 }}>The system will answer questions using your document context.</p>
                  </div>
                </div>

                {/* Flashcards Card */}
                <div style={{ padding: 0, borderRadius: 16, background: COLORS.white, border: `1px solid ${COLORS.border}`, boxShadow: '0 2px 8px rgba(0,0,0,0.04)', display: 'flex', flexDirection: 'column', cursor: 'pointer', transition: 'all 0.3s ease', overflow: 'hidden' }}
                  onMouseOver={e => { e.currentTarget.style.transform = 'translateY(-4px)'; e.currentTarget.style.boxShadow = '0 8px 24px rgba(59,130,246,0.15)'; e.currentTarget.style.borderColor = '#3b82f6'; }}
                  onMouseOut={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.04)'; e.currentTarget.style.borderColor = COLORS.border; }}>
                  <div style={{ height: 140, background: 'linear-gradient(180deg, #EFF6FF 0%, #fff 100%)', padding: 24, display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative' }}>
                    <FlashcardIllustration width={120} height={120} />
                  </div>
                  <div style={{ padding: 24 }}>
                    <h3 style={{ margin: '0 0 8px', fontSize: 17, fontWeight: 600, color: COLORS.text }}>Help me create flashcards</h3>
                    <p style={{ margin: 0, fontSize: 14, color: COLORS.darkGray, lineHeight: 1.6 }}>The system will generate personalized flashcards instantly.</p>
                  </div>
                </div>
              </div>

              {/* ── Trial Offer Card ── */}
              <div style={{ padding: 0, borderRadius: 20, background: `linear-gradient(135deg, ${COLORS.accentOrange} 0%, ${COLORS.accentOrangeDark} 100%)`, color: COLORS.white, marginBottom: 48, boxShadow: '0 8px 32px rgba(249,115,22,0.25)', overflow: 'hidden', display: 'flex', flexDirection: 'row', alignItems: 'center', position: 'relative' }}>
                <div style={{ padding: '32px 40px', flex: 1, zIndex: 1 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 12 }}>
                    <div style={{ width: 48, height: 48, background: 'rgba(255,255,255,0.25)', borderRadius: 12, display: 'flex', alignItems: 'center', justifyContent: 'center', backdropFilter: 'blur(8px)' }}>
                      <Sparkles size={24} color="#fff" strokeWidth={2.5} />
                    </div>
                    <h3 style={{ margin: 0, fontSize: 22, fontWeight: 700, letterSpacing: '-0.01em' }}>Start with our free features now!</h3>
                  </div>
                  <p style={{ margin: 0, fontSize: 15, lineHeight: 1.7, opacity: 0.95 }}>Get all of our integration features with your free Groq API key. Let's get your plan and work for your better future!</p>
                </div>
                <div style={{ width: 150, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 32, position: 'relative', zIndex: 1 }}>
                  <div style={{ width: 80, height: 80, background: 'rgba(255,255,255,0.2)', borderRadius: 20, display: 'flex', alignItems: 'center', justifyContent: 'center', backdropFilter: 'blur(12px)', boxShadow: '0 8px 24px rgba(0,0,0,0.15)' }}>
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
                      <div style={{ fontSize: 28, fontWeight: 800, lineHeight: 1 }}>Study</div>
                      <div style={{ width: 32, height: 4, background: '#fff', borderRadius: 2 }} />
                    </div>
                  </div>
                </div>
                {/* Decorative circles */}
                <div style={{ position: 'absolute', top: -50, right: -50, width: 200, height: 200, borderRadius: '50%', background: 'rgba(255,255,255,0.1)' }} />
                <div style={{ position: 'absolute', bottom: -30, left: 40, width: 100, height: 100, borderRadius: '50%', background: 'rgba(255,255,255,0.08)' }} />
              </div>

              {/* ── Recent Files Section ── */}
              <div>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 28 }}>
                  <h2 style={{ margin: 0, fontSize: 26, fontWeight: 700, color: COLORS.text, letterSpacing: '-0.02em' }}>Recently Opened</h2>
                  <div style={{ display: 'flex', gap: 8 }}>
                    <button style={{ padding: '10px 20px', borderRadius: 10, border: '1px solid #e2e8f0', background: COLORS.white, color: COLORS.text, fontSize: 14, fontWeight: 500, cursor: 'pointer', boxShadow: '0 2px 8px rgba(0,0,0,0.04)', transition: 'all 0.2s' }}
                      onMouseOver={e => { e.currentTarget.style.borderColor = COLORS.accentOrange; e.currentTarget.style.transform = 'translateY(-1px)'; }}
                      onMouseOut={e => { e.currentTarget.style.borderColor = '#e2e8f0'; e.currentTarget.style.transform = 'translateY(0)'; }}>All Files</button>
                  </div>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 24 }}>
                  {notebooks.map((n, index) => (
                    <WorkspaceCard key={n.id} n={n} index={index}
                      onOpen={id => setActiveId(id)}
                      onDelete={deleteWs}
                      onRename={openRename} />
                  ))}
                  <NewCard onClick={createWs} />
                </div>
              </div>
            </div>
          </div>

        ) : (
          /* ── WORKSPACE ── */
          <div style={{ flex: 1, display: 'flex', overflow: 'hidden' }}>

            {/* Centre pane */}
            <div style={S.centerPane}>
              {/* Tab bar */}
              <div style={S.tabBar}>
                {TABS.map(t => {
                  const active = tab === t.id;
                  const tabColors = {
                    summary: COLORS.accentOrange,
                    timeline: COLORS.accentPurple,
                    mindmap: COLORS.accentBlue,
                    plan: COLORS.success,
                    flashcards: COLORS.warning
                  };
                  const tabLightColors = {
                    summary: COLORS.accentOrangeLight,
                    timeline: COLORS.accentPurpleLight,
                    mindmap: COLORS.accentBlueLight,
                    plan: '#ecfdf5',
                    flashcards: '#fef3c7'
                  };
                  const color = tabColors[t.id] || COLORS.accentOrange;
                  const lightColor = tabLightColors[t.id] || COLORS.accentOrangeLight;

                  return (
                    <button key={t.id} onClick={() => setTab(t.id)}
                      style={{
                        height: 40, padding: '0 20px',
                        borderRadius: 10,
                        border: 'none',
                        background: active ? lightColor : 'transparent',
                        color: active ? color : COLORS.darkGray,
                        cursor: 'pointer', fontSize: 14,
                        fontWeight: active ? 600 : 500,
                        display: 'flex', alignItems: 'center', gap: 10,
                        whiteSpace: 'nowrap', fontFamily: 'inherit', transition: 'all 0.25s cubic-bezier(0.4, 0, 0.2, 1)',
                        ...(active && { boxShadow: '0 2px 8px rgba(0,0,0,0.08)' })
                      }}
                      onMouseOver={e => { if (!active) { e.currentTarget.style.background = COLORS.lightGray; e.currentTarget.style.transform = 'translateY(-1px)'; } }}
                      onMouseOut={e => { if (!active) { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.transform = 'translateY(0)'; } }}>
                      <t.icon size={16} strokeWidth={active ? 2.5 : 2} color={active ? color : COLORS.darkGray} />
                      {t.label}
                    </button>
                  );
                })}
              </div>

              {/* Viewer */}
              <div style={S.viewer}>

                {/* Empty: no active sources */}
                {!hasSources && (
                  <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 24, textAlign: 'center', padding: 40 }}>
                    <UploadIllustration width={160} height={160} />
                    <div>
                      <p style={{ margin: '0 0 8px', fontSize: 19, fontWeight: 600, color: '#334155' }}>Add a source to get started</p>
                      <p style={{ margin: 0, fontSize: 15, color: '#94a3b8', lineHeight: 1.7 }}>Upload a PDF document. StudyLM will extract and index<br />its contents so you can generate insights.</p>
                    </div>
                    <button onClick={() => setModal('source')}
                      style={{ height: 48, padding: '0 28px', borderRadius: 12, border: 'none', background: 'linear-gradient(135deg, #f97316 0%, #fb923c 100%)', color: '#fff', cursor: 'pointer', fontSize: 15, fontWeight: 600, display: 'flex', alignItems: 'center', gap: 10, fontFamily: 'inherit', boxShadow: '0 4px 16px rgba(249,115,22,0.35)', transition: 'all 0.2s' }}
                      onMouseOver={e => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 6px 20px rgba(249,115,22,0.4)'; }}
                      onMouseOut={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 4px 16px rgba(249,115,22,0.35)'; }}>
                      <UploadCloud size={18} strokeWidth={2} /> Add Source
                    </button>
                  </div>
                )}

                {/* Empty: sources active but no generated content */}
                {hasSources && !hasData && (
                  <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 24, textAlign: 'center', padding: 40 }}>
                    <GenerateIllustration width={160} height={160} />
                    <div>
                      <p style={{ margin: '0 0 8px', fontSize: 19, fontWeight: 600, color: '#334155' }}>Ready to generate</p>
                      <p style={{ margin: 0, fontSize: 15, color: '#94a3b8', lineHeight: 1.7 }}>Click <strong style={{ color: '#8b5cf6', fontWeight: 600 }}>Generate</strong> in the toolbar to create your {TABS.find(t => t.id === tab)?.label?.toLowerCase()}.</p>
                    </div>
                    <button onClick={() => compile(tab)} disabled={compiling}
                      style={{ height: 48, padding: '0 28px', borderRadius: 12, border: 'none', background: compiling ? '#e2e8f0' : 'linear-gradient(135deg, #8b5cf6 0%, #a78bfa 100%)', color: compiling ? '#94a3b8' : '#fff', cursor: compiling ? 'not-allowed' : 'pointer', fontSize: 15, fontWeight: 600, display: 'flex', alignItems: 'center', gap: 10, fontFamily: 'inherit', boxShadow: compiling ? 'none' : '0 4px 16px rgba(139,92,246,0.35)', transition: 'all 0.2s' }}
                      onMouseOver={e => { if (!compiling) { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 6px 20px rgba(139,92,246,0.4)'; } }}
                      onMouseOut={e => { if (!compiling) { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 4px 16px rgba(139,92,246,0.35)'; } }}>
                      {compiling ? <Loader2 size={18} style={{ animation: 'spin 1s linear infinite' }} /> : <Sparkles size={18} strokeWidth={2} />}
                      {compiling ? 'Generating…' : `Generate ${TABS.find(t => t.id === tab)?.label}`}
                    </button>
                  </div>
                )}

                {/* Content renderers */}
                {hasData && (
                  <div style={{ padding: '28px 36px', maxWidth: 760, margin: '0 auto' }}>

                    {tab === 'summary' && (
                      <div style={{ userSelect: 'text' }}>
                        {renderTabHeader('Summary', 'Key concepts and highlights')}
                        <MD content={currentData} />
                      </div>
                    )}

                    {tab === 'timeline' && (
                      <div>
                        {renderTabHeader('Timeline', 'Sequential event trace')}
                        <div style={{ position: 'relative', paddingLeft: 40, borderLeft: '3px solid #f1f5f9' }}>
                          {tlItems.map((m, i) => (
                            <div key={i} style={{ position: 'relative', marginBottom: 40, paddingLeft: 24 }}>
                              <div style={{ position: 'absolute', left: -46, top: 0, width: 16, height: 16, borderRadius: '50%', border: '3px solid #8b5cf6', background: '#fff', boxShadow: '0 2px 8px rgba(139,92,246,0.2)' }} />
                              <div style={{ background: '#fff', padding: 20, borderRadius: 12, border: '1px solid #e2e8f0', boxShadow: '0 2px 8px rgba(0,0,0,0.04)', transition: 'all 0.2s' }}
                                onMouseOver={e => { e.currentTarget.style.transform = 'translateX(4px)'; e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.08)'; }}
                                onMouseOut={e => { e.currentTarget.style.transform = 'translateX(0)'; e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.04)'; }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 8 }}>
                                  <span style={{ padding: '4px 12px', background: '#f5f3ff', color: '#8b5cf6', borderRadius: 20, fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em' }}>
                                    #{String(i + 1).padStart(2, '0')}
                                  </span>
                                </div>
                                <h3 style={{ margin: '0 0 8px', fontSize: 17, fontWeight: 600, color: COLORS.text, letterSpacing: '-0.01em' }}>{m.title}</h3>
                                <p style={{ margin: 0, fontSize: 14, color: COLORS.darkGray, lineHeight: 1.7 }}>{m.desc}</p>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {tab === 'mindmap' && (
                      <div>
                        {renderTabHeader('Concept Map', 'Connected knowledge hierarchy')}
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                          {mmNodes.map((node, idx) => {
                            const colors = ['#f97316', '#8b5cf6', '#3b82f6', '#10b981', '#f59e0b'];
                            const nodeColor = colors[idx % colors.length];
                            return (
                              <div key={node.id} style={{ borderRadius: 16, border: '1px solid #e2e8f0', overflow: 'hidden', background: '#fff', boxShadow: '0 2px 8px rgba(0,0,0,0.04)', transition: 'all 0.2s' }}
                                onMouseOver={e => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 8px 24px rgba(0,0,0,0.12)'; }}
                                onMouseOut={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.04)'; }}>
                                <div style={{ padding: '16px 20px', background: `linear-gradient(135deg, ${nodeColor}15 0%, ${nodeColor}25 100%)`, borderBottom: '1px solid #e2e8f0', display: 'flex', alignItems: 'center', gap: 12 }}>
                                  <div style={{ width: 10, height: 10, borderRadius: '50%', background: nodeColor, flexShrink: 0, boxShadow: `0 2px 8px ${nodeColor}40` }} />
                                  <h3 style={{ margin: 0, fontSize: 16, fontWeight: 600, color: COLORS.text, letterSpacing: '-0.01em' }}>{node.label}</h3>
                                </div>
                                {(node.desc || node.children.length > 0) && (
                                  <div style={{ padding: '16px 20px', display: 'flex', flexDirection: 'column', gap: 12 }}>
                                    {node.desc && <p style={{ margin: 0, fontSize: 14, color: COLORS.darkGray, lineHeight: 1.7, fontStyle: 'italic' }}>{node.desc}</p>}
                                    {node.children.map(ch => (
                                      <div key={ch.id} style={{ display: 'flex', alignItems: 'flex-start', gap: 12, paddingLeft: 16, padding: '12px', background: '#fafafa', borderRadius: 10, border: '1px solid #f1f5f9' }}>
                                        <CornerDownRight size={14} strokeWidth={2} color={nodeColor} style={{ flexShrink: 0, marginTop: 2 }} />
                                        <div style={{ flex: 1 }}>
                                          <p style={{ margin: '0 0 4px', fontSize: 14, fontWeight: 500, color: COLORS.text }}>{ch.label}</p>
                                          {ch.desc && <p style={{ margin: 0, fontSize: 13, color: COLORS.darkGray, lineHeight: 1.6 }}>{ch.desc}</p>}
                                        </div>
                                      </div>
                                    ))}
                                  </div>
                                )}
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    )}

                    {tab === 'plan' && (
                      <div>
                        {renderTabHeader('Roadmap', 'Actionable study phases and tasks')}
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 32 }}>
                          {rmPhases.map((phase, i) => {
                            const phaseColors = ['#f97316', '#8b5cf6', '#3b82f6', '#10b981'];
                            const phaseColor = phaseColors[i % phaseColors.length];
                            const completedTasks = phase.tasks.filter(t => t.done).length;
                            const totalTasks = phase.tasks.length;
                            const progress = totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0;

                            return (
                              <div key={i} style={{ background: '#fff', borderRadius: 16, padding: 24, border: '1px solid #e2e8f0', boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}>
                                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
                                  <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                                    <div style={{ width: 32, height: 32, borderRadius: 10, background: `${phaseColor}20`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14, fontWeight: 700, color: phaseColor }}>
                                      {i + 1}
                                    </div>
                                    <h3 style={{ margin: 0, fontSize: 15, fontWeight: 700, color: COLORS.text, textTransform: 'uppercase', letterSpacing: '0.08em' }}>{phase.title}</h3>
                                  </div>
                                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                                    <div style={{ height: 6, width: 80, background: '#f1f5f9', borderRadius: 3, overflow: 'hidden' }}>
                                      <div style={{ height: '100%', width: `${progress}%`, background: phaseColor, borderRadius: 3, transition: 'width 0.3s ease' }} />
                                    </div>
                                    <span style={{ fontSize: 12, fontWeight: 600, color: phaseColor }}>{completedTasks}/{totalTasks}</span>
                                  </div>
                                </div>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                                  {phase.tasks.map(t => (
                                    <button key={t.id} onClick={() => toggleTask(t.text, t.done)}
                                      style={{ display: 'flex', alignItems: 'flex-start', gap: 14, padding: '14px 16px', borderRadius: 10, border: t.done ? '1px solid #e2e8f0' : '1px solid #e2e8f0', background: t.done ? '#f8fafc' : '#fff', width: '100%', textAlign: 'left', cursor: 'pointer', fontFamily: 'inherit', transition: 'all 0.2s' }}
                                      onMouseOver={e => { if (!t.done) { e.currentTarget.style.borderColor = phaseColor; e.currentTarget.style.transform = 'translateX(4px)'; } }}
                                      onMouseOut={e => { if (!t.done) { e.currentTarget.style.borderColor = '#e2e8f0'; e.currentTarget.style.transform = 'translateX(0)'; } }}>
                                      <div style={{ width: 20, height: 20, borderRadius: 6, border: t.done ? 'none' : '2px solid #cbd5e1', background: t.done ? phaseColor : 'transparent', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, marginTop: 1, transition: 'all 0.2s' }}>
                                        {t.done && <CheckCircle size={12} color="#fff" strokeWidth={2.5} />}
                                      </div>
                                      <span style={{ fontSize: 14, lineHeight: 1.6, color: t.done ? '#94a3b8' : COLORS.text, textDecoration: t.done ? 'line-through' : 'none', flex: 1 }}>{t.text}</span>
                                    </button>
                                  ))}
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    )}

                    {tab === 'flashcards' && flashcards.length > 0 && (
                      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', paddingTop: 16 }}>
                        {renderTabHeader('Recall', 'Active learning flashcards')}
                        <div onClick={() => setFlipped(f => !f)} style={{ width: '100%', maxWidth: 480, height: 280, cursor: 'pointer', perspective: '1500px' }}>
                          <div style={{ width: '100%', height: '100%', position: 'relative', transformStyle: 'preserve-3d', transform: flipped ? 'rotateY(180deg)' : 'rotateY(0)', transition: 'transform 0.5s cubic-bezier(0.4, 0, 0.2, 1)' }}>
                            {/* Front */}
                            <div style={{ position: 'absolute', inset: 0, borderRadius: 24, border: '2px solid #e2e8f0', background: 'linear-gradient(135deg, #fff 0%, #fafafa 100%)', boxShadow: '0 8px 32px rgba(0,0,0,0.08)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: 40, textAlign: 'center', backfaceVisibility: 'hidden' }}>
                              <div style={{ padding: '8px 20px', background: '#fff7ed', color: '#f97316', borderRadius: 20, fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.15em', marginBottom: 24 }}>
                                Question
                              </div>
                              <p style={{ fontSize: 22, fontWeight: 600, color: COLORS.text, lineHeight: 1.4, margin: 0, maxWidth: 400 }}>{flashcards[cardIdx]?.q}</p>
                              <div style={{ marginTop: 32, display: 'flex', alignItems: 'center', gap: 8, color: '#94a3b8', fontSize: 12 }}>
                                <Sparkles size={14} strokeWidth={2} />
                                <span>Tap to reveal answer</span>
                              </div>
                            </div>
                            {/* Back */}
                            <div style={{ position: 'absolute', inset: 0, borderRadius: 24, background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)', boxShadow: '0 8px 32px rgba(0,0,0,0.2)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: 40, textAlign: 'center', backfaceVisibility: 'hidden', transform: 'rotateY(180deg)' }}>
                              <div style={{ padding: '8px 20px', background: 'rgba(255,255,255,0.1)', color: '#94a3b8', borderRadius: 20, fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.15em', marginBottom: 24 }}>
                                Answer
                              </div>
                              <p style={{ fontSize: 18, color: '#f8fafc', lineHeight: 1.6, margin: 0, maxWidth: 400 }}>{flashcards[cardIdx]?.a}</p>
                              <div style={{ marginTop: 32, display: 'flex', alignItems: 'center', gap: 8, color: '#64748b', fontSize: 12 }}>
                                <ArrowRight size={14} strokeWidth={2} />
                                <span>Tap to flip back</span>
                              </div>
                            </div>
                          </div>
                        </div>
                        {/* Progress + Controls */}
                        <div style={{ width: '100%', maxWidth: 480, marginTop: 32 }}>
                          <div style={{ height: 4, background: '#f1f5f9', borderRadius: 4, overflow: 'hidden', marginBottom: 24 }}>
                            <div style={{ height: '100%', background: 'linear-gradient(90deg, #f97316 0%, #fb923c 100%)', borderRadius: 4, width: `${((cardIdx + 1) / flashcards.length) * 100}%`, transition: 'width 0.4s ease' }} />
                          </div>
                          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 16 }}>
                            <button onClick={() => { setCardIdx(i => Math.max(0, i - 1)); setFlipped(false); }} disabled={cardIdx === 0}
                              style={{ height: 44, padding: '0 24px', borderRadius: 12, border: '1px solid #e2e8f0', background: '#fff', cursor: cardIdx === 0 ? 'not-allowed' : 'pointer', fontSize: 14, fontWeight: 500, color: COLORS.text, opacity: cardIdx === 0 ? 0.4 : 1, fontFamily: 'inherit', display: 'flex', alignItems: 'center', gap: 8, transition: 'all 0.2s' }}
                              onMouseOver={e => { if (cardIdx !== 0) { e.currentTarget.style.background = '#f8fafc'; e.currentTarget.style.borderColor = '#f97316'; } }}
                              onMouseOut={e => { if (cardIdx !== 0) { e.currentTarget.style.background = '#fff'; e.currentTarget.style.borderColor = '#e2e8f0'; } }}>
                              <ChevronRight size={16} strokeWidth={2.5} style={{ transform: 'rotate(180deg)' }} />
                              Previous
                            </button>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                              <span style={{ fontSize: 16, fontWeight: 700, color: COLORS.text }}>{cardIdx + 1}</span>
                              <span style={{ fontSize: 14, color: '#94a3b8' }}>of</span>
                              <span style={{ fontSize: 16, fontWeight: 700, color: COLORS.text }}>{flashcards.length}</span>
                            </div>
                            <button onClick={() => { setCardIdx(i => Math.min(flashcards.length - 1, i + 1)); setFlipped(false); }} disabled={cardIdx === flashcards.length - 1}
                              style={{ height: 44, padding: '0 24px', borderRadius: 12, border: 'none', background: cardIdx === flashcards.length - 1 ? '#e2e8f0' : 'linear-gradient(135deg, #f97316 0%, #fb923c 100%)', cursor: cardIdx === flashcards.length - 1 ? 'not-allowed' : 'pointer', fontSize: 14, fontWeight: 600, color: cardIdx === flashcards.length - 1 ? '#94a3b8' : '#fff', fontFamily: 'inherit', display: 'flex', alignItems: 'center', gap: 8, transition: 'all 0.2s', boxShadow: cardIdx === flashcards.length - 1 ? 'none' : '0 4px 12px rgba(249,115,22,0.3)' }}
                              onMouseOver={e => { if (cardIdx !== flashcards.length - 1) { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 6px 16px rgba(249,115,22,0.4)'; } }}
                              onMouseOut={e => { if (cardIdx !== flashcards.length - 1) { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 4px 12px rgba(249,115,22,0.3)'; } }}>
                              Next
                              <ChevronRight size={16} strokeWidth={2.5} />
                            </button>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>

            {/* ── DRAG HANDLE ── */}
            <div
              onMouseDown={() => setIsDraggingR(true)}
              style={{
                width: 6, cursor: 'col-resize', background: isDraggingR ? '#3b82f6' : 'transparent',
                transition: 'background 0.15s', zIndex: 10, flexShrink: 0,
                borderLeft: '1px solid #f0ebe1' // Replaces centerPane borderRight if needed, but keeping it invisible is fine
              }}
              onMouseEnter={e => { if (!isDraggingR) e.currentTarget.style.background = '#e2e8f0'; }}
              onMouseLeave={e => { if (!isDraggingR) e.currentTarget.style.background = 'transparent'; }}
            />

            {/* ── RIGHT PANEL ── */}
            <div style={S.rPanel}>

              {/* Sources */}
              <div style={{ flex: 1, minHeight: 0, display: 'flex', flexDirection: 'column', borderBottom: '1px solid #f1f5f9' }}>
                <div style={S.rHead}>
                  <span style={S.rLbl}>Sources</span>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    {nb?.sources?.length > 0 && (
                      <button onClick={toggleAllSources}
                        title={nb.sources.every(s => s.active) ? "Deselect all" : "Select all"}
                        style={{ height: 28, padding: '0 12px', borderRadius: 8, border: '1px solid #E5E7EB', background: '#fff', cursor: 'pointer', fontSize: 11, fontWeight: 600, color: '#4B5563', fontFamily: 'inherit', display: 'flex', alignItems: 'center', gap: 6, transition: 'all 0.2s' }}
                        onMouseOver={e => { e.currentTarget.style.borderColor = '#f97316'; e.currentTarget.style.color = '#f97316'; }}
                        onMouseOut={e => { e.currentTarget.style.borderColor = '#E5E7EB'; e.currentTarget.style.color = '#4B5563'; }}>
                        {nb.sources.every(s => s.active) ? 'Deselect' : 'Select all'}
                      </button>
                    )}
                    <button onClick={() => setModal('source')} title="Add source"
                      style={{ width: 32, height: 32, borderRadius: 8, border: 'none', background: 'linear-gradient(135deg, #f97316 0%, #fb923c 100%)', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', transition: 'all 0.2s', boxShadow: '0 2px 8px rgba(249,115,22,0.3)' }}
                      onMouseOver={e => { e.currentTarget.style.transform = 'scale(1.05)'; e.currentTarget.style.boxShadow = '0 4px 12px rgba(249,115,22,0.4)'; }}
                      onMouseOut={e => { e.currentTarget.style.transform = 'scale(1)'; e.currentTarget.style.boxShadow = '0 2px 8px rgba(249,115,22,0.3)'; }}>
                      <Plus size={16} strokeWidth={2.5} />
                    </button>
                  </div>
                </div>
                <div style={{ flex: 1, overflowY: 'auto', padding: 16, display: 'flex', flexDirection: 'column', gap: 8, scrollbarWidth: 'none' }}>
                  {nb.sources.length === 0 ? (
                    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 12, textAlign: 'center', padding: 24 }}>
                      <div style={{ width: 48, height: 48, borderRadius: 12, background: '#fff7ed', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <UploadCloud size={24} strokeWidth={2} color="#f97316" />
                      </div>
                      <p style={{ fontSize: 13, color: COLORS.darkGray, margin: 0, lineHeight: 1.6 }}>No sources yet.<br />Upload a PDF to get started.</p>
                    </div>
                  ) : nb.sources.map((s, i) => {
                    const tog = () => upd({ sources: nb.sources.map(src => src.id === s.id ? { ...src, active: !src.active } : src) });
                    return (
                      <div key={i} onClick={tog} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '14px 16px', borderRadius: 12, border: s.active ? '2px solid #f97316' : '1px solid #e2e8f0', background: s.active ? '#fff7ed' : '#fff', cursor: 'pointer', opacity: s.active ? 1 : 0.6, boxShadow: s.active ? '0 2px 8px rgba(249,115,22,0.15)' : '0 1px 3px rgba(0,0,0,0.04)', transition: 'all 0.2s' }}
                        onMouseOver={e => { if (!s.active) { e.currentTarget.style.borderColor = '#cbd5e1'; e.currentTarget.style.transform = 'translateX(2px)'; } }}
                        onMouseOut={e => { if (!s.active) { e.currentTarget.style.borderColor = '#e2e8f0'; e.currentTarget.style.transform = 'translateX(0)'; } }}>
                        <div style={{ width: 40, height: 40, borderRadius: 10, background: s.active ? '#f97316' : '#f1f5f9', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, transition: 'all 0.2s' }}>
                          <FileText size={18} strokeWidth={2} color={s.active ? '#fff' : '#64748b'} />
                        </div>
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <p style={{ margin: 0, fontSize: 13.5, fontWeight: 500, color: COLORS.text, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', lineHeight: 1.4 }}>{s.name}</p>
                          <p style={{ margin: '4px 0 0', fontSize: 11.5, color: COLORS.darkGray }}>{s.size}</p>
                        </div>
                        <div style={{ width: 10, height: 10, borderRadius: '50%', background: s.active ? '#f97316' : '#e2e8f0', flexShrink: 0, boxShadow: s.active ? '0 2px 6px rgba(249,115,22,0.4)' : 'none' }} />
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Chat */}
              <div style={{ flex: 1, minHeight: 0, display: 'flex', flexDirection: 'column' }}>
                <div style={S.rHead}>
                  <span style={S.rLbl}>Assistant</span>
                </div>
                <div style={{ flex: 1, overflowY: 'auto', padding: 16, display: 'flex', flexDirection: 'column', gap: 12, scrollbarWidth: 'none', background: '#fafafa' }}>
                  {nb.chatHistory.length === 0 && (
                    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 12, textAlign: 'center', color: COLORS.darkGray }}>
                      <div style={{ width: 56, height: 56, borderRadius: 16, background: 'linear-gradient(135deg, #f5f3ff 0%, #ede9fe 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <MessageSquare size={28} strokeWidth={2} color="#8b5cf6" />
                      </div>
                      <p style={{ fontSize: 14, margin: 0, fontWeight: 500 }}>Ask anything about your sources</p>
                    </div>
                  )}
                  {nb.chatHistory.map((msg, i) => (
                    <div key={i} style={{ display: 'flex', justifyContent: msg.sender === 'user' ? 'flex-end' : 'flex-start' }}>
                      <div style={{ maxWidth: '90%', padding: '14px 18px', borderRadius: msg.sender === 'user' ? '20px 20px 6px 20px' : '20px 20px 20px 6px', background: msg.sender === 'user' ? 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)' : '#fff', color: msg.sender === 'user' ? '#f8fafc' : COLORS.text, fontSize: 14, lineHeight: 1.7, border: msg.sender === 'user' ? 'none' : '1px solid #e2e8f0', boxShadow: msg.sender === 'assistant' ? '0 2px 8px rgba(0,0,0,0.06)' : '0 2px 8px rgba(15,23,42,0.15)', userSelect: 'text', wordBreak: 'break-word' }}>
                        <MD content={msg.text} />
                      </div>
                    </div>
                  ))}
                  {isTyping && (
                    <div style={{ display: 'flex', justifyContent: 'flex-start' }}>
                      <div style={{ padding: '14px 18px', borderRadius: '20px 20px 20px 6px', background: '#fff', border: '1px solid #e2e8f0', display: 'flex', gap: 6, alignItems: 'center', boxShadow: '0 2px 8px rgba(0,0,0,0.06)' }}>
                        {[0, 0.2, 0.4].map((d, i) => <span key={i} style={{ width: 8, height: 8, borderRadius: '50%', background: '#cbd5e1', display: 'block', animation: `bounce 1s ${d}s infinite` }} />)}
                      </div>
                    </div>
                  )}
                  <div ref={chatEndRef} />
                </div>
                {/* Input */}
                <div style={{ padding: '16px', borderTop: '1px solid #f1f5f9', background: '#fff', flexShrink: 0 }}>
                  <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
                    <input
                      value={chatMsg}
                      onChange={e => setChatMsg(e.target.value)}
                      onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendChat(); } }}
                      placeholder="Ask a question about your sources…"
                      style={{ width: '100%', padding: '14px 48px 14px 18px', borderRadius: 12, border: '2px solid #e2e8f0', background: '#f8fafc', fontSize: 14, color: COLORS.text, outline: 'none', fontFamily: 'inherit', boxSizing: 'border-box', transition: 'all 0.2s' }}
                      onFocus={e => { e.currentTarget.style.borderColor = '#8b5cf6'; e.currentTarget.style.background = '#fff'; e.currentTarget.style.boxShadow = '0 0 0 4px rgba(139,92,246,0.1)'; }}
                      onBlur={e => { e.currentTarget.style.borderColor = '#e2e8f0'; e.currentTarget.style.background = '#f8fafc'; e.currentTarget.style.boxShadow = 'none'; }}
                    />
                    <button onClick={sendChat} disabled={!chatMsg.trim() || isTyping}
                      style={{ position: 'absolute', right: 6, width: 36, height: 36, borderRadius: 10, border: 'none', background: chatMsg.trim() && !isTyping ? 'linear-gradient(135deg, #8b5cf6 0%, #a78bfa 100%)' : 'transparent', cursor: chatMsg.trim() && !isTyping ? 'pointer' : 'default', display: 'flex', alignItems: 'center', justifyContent: 'center', color: chatMsg.trim() && !isTyping ? '#fff' : '#cbd5e1', transition: 'all 0.2s', boxShadow: chatMsg.trim() && !isTyping ? '0 2px 8px rgba(139,92,246,0.3)' : 'none' }}
                      onMouseOver={e => { if (chatMsg.trim() && !isTyping) { e.currentTarget.style.transform = 'scale(1.05)'; } }}
                      onMouseOut={e => { if (chatMsg.trim() && !isTyping) { e.currentTarget.style.transform = 'scale(1)'; } }}>
                      <ArrowUp size={18} strokeWidth={2.5} />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* ══ MODALS ══ */}

      {modal === 'source' && (
        <Modal title="Add Source" onClose={() => setModal(null)}>
          <div
            onClick={() => fileInputRef.current?.click()}
            style={{ marginTop: 12, border: '2px dashed #e2e8f0', borderRadius: 16, padding: '36px 24px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12, cursor: 'pointer', transition: 'all 0.12s' }}
            onMouseOver={e => { e.currentTarget.style.borderColor = '#94a3b8'; e.currentTarget.style.background = '#f8fafc'; }}
            onMouseOut={e => { e.currentTarget.style.borderColor = '#e2e8f0'; e.currentTarget.style.background = 'transparent'; }}
          >
            <div style={{ width: 48, height: 48, borderRadius: 14, background: '#f1f5f9', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <UploadCloud size={22} strokeWidth={1.5} color="#64748b" />
            </div>
            <div style={{ textAlign: 'center' }}>
              <p style={{ margin: '0 0 4px', fontSize: 14, fontWeight: 600, color: '#1e293b' }}>Click to select a PDF</p>
              <p style={{ margin: 0, fontSize: 12.5, color: '#94a3b8' }}>or drag & drop anywhere in the workspace</p>
            </div>
            <span style={{ fontSize: 11.5, padding: '4px 12px', borderRadius: 99, background: '#f1f5f9', color: '#64748b', fontWeight: 500 }}>PDF only · max 50 MB</span>
          </div>
        </Modal>
      )}

      {modal === 'settings' && (
        <Modal title="Preferences" onClose={() => setModal(null)}>
          <div style={{ marginTop: 16, display: 'flex', flexDirection: 'column', gap: 16 }}>
            {/* API Provider Selection */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
              <label style={{ fontSize: 11.5, fontWeight: 700, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.07em' }}>API Provider</label>
              <select
                value={apiProvider}
                onChange={e => { 
                  setApiProvider(e.target.value); 
                  localStorage.setItem('api_provider', e.target.value);
                }}
                style={{ padding: '10px 14px', borderRadius: 10, border: '1px solid #e2e8f0', fontSize: 13, color: '#0f172a', outline: 'none', boxSizing: 'border-box', width: '100%', background: '#fff' }}
              >
                <option value="groq">Groq (Default - Built-in)</option>
                <option value="gemini">Google Gemini (Requires API Key)</option>
              </select>
              <p style={{ margin: '4px 0 0', fontSize: 12, color: '#94a3b8', lineHeight: 1.55 }}>
                {apiProvider === 'groq' ? '✅ Using built-in Groq API - no setup required' : 'Switch to Gemini and add your API key below'}
              </p>
            </div>

            {/* Gemini API Key - Only shown when Gemini is selected */}
            {apiProvider === 'gemini' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                <label style={{ fontSize: 11.5, fontWeight: 700, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.07em' }}>Gemini API Key</label>
                <input type="password" value={apiKey}
                  onChange={e => { setApiKey(e.target.value); localStorage.setItem('meridian_api_key', e.target.value); }}
                  placeholder="Enter Gemini API key…"
                  style={{ padding: '10px 14px', borderRadius: 10, border: '1px solid #e2e8f0', fontSize: 13, fontFamily: 'monospace', color: '#0f172a', outline: 'none', boxSizing: 'border-box', width: '100%' }}
                  onFocus={e => e.currentTarget.style.borderColor = '#94a3b8'}
                  onBlur={e => e.currentTarget.style.borderColor = '#e2e8f0'}
                />
                <p style={{ margin: '4px 0 0', fontSize: 12, color: '#94a3b8', lineHeight: 1.55 }}>
                  {apiKey ? '✓ Gemini API key saved' : 'Add your Gemini API key to use this provider'}
                </p>
              </div>
            )}

            {/* Status */}
            <div style={{ marginTop: 8, padding: '12px', borderRadius: 8, background: '#f8fafc', border: '1px solid #e2e8f0' }}>
              <p style={{ margin: 0, fontSize: 12, color: '#64748b', lineHeight: 1.5 }}>
                {apiProvider === 'groq' 
                  ? '✅ Using built-in Groq API - ready to use'
                  : (apiKey ? '✓ Using Gemini API with your key' : '⚠ Add Gemini API key to enable features')
                }
              </p>
            </div>
          </div>
        </Modal>
      )}

      {modal === 'rename' && renameTarget && (
        <Modal title="Rename Workspace" onClose={() => { setModal(null); setRenameTarget(null); }}>
          <div style={{ marginTop: 12, display: 'flex', flexDirection: 'column', gap: 10 }}>
            <input ref={renameRef} type="text" value={renameVal}
              onChange={e => setRenameVal(e.target.value)}
              onKeyDown={e => { if (e.key === 'Enter') commitRename(); if (e.key === 'Escape') { setModal(null); setRenameTarget(null); } }}
              placeholder="Workspace name…"
              style={{ padding: '10px 14px', borderRadius: 10, border: '1px solid #e2e8f0', fontSize: 14, fontWeight: 500, color: '#0f172a', outline: 'none', boxSizing: 'border-box', width: '100%', fontFamily: 'inherit' }}
              onFocus={e => e.currentTarget.style.borderColor = '#94a3b8'}
              onBlur={e => e.currentTarget.style.borderColor = '#e2e8f0'}
            />
            <div style={{ display: 'flex', gap: 8 }}>
              <button onClick={() => { setModal(null); setRenameTarget(null); }}
                style={{ flex: 1, height: 36, borderRadius: 10, border: '1px solid #e2e8f0', background: '#fff', fontSize: 13, fontWeight: 500, color: '#475569', cursor: 'pointer', fontFamily: 'inherit' }}>
                Cancel
              </button>
              <button onClick={commitRename}
                style={{ flex: 1, height: 36, borderRadius: 10, border: 'none', background: '#0f172a', fontSize: 13, fontWeight: 600, color: '#fff', cursor: 'pointer', fontFamily: 'inherit' }}>
                Save
              </button>
            </div>
          </div>
        </Modal>
      )}

      {/* Toast */}
      {toast && (
        <div style={{ position: 'fixed', bottom: 20, right: 20, zIndex: 300, padding: '12px 18px', borderRadius: 12, fontSize: 13, fontWeight: 500, display: 'flex', alignItems: 'center', gap: 10, boxShadow: '0 8px 24px rgba(0,0,0,0.14)', background: toast.type === 'error' ? '#fef2f2' : toast.type === 'warn' ? '#fffbeb' : '#0f172a', color: toast.type === 'error' ? '#b91c1c' : toast.type === 'warn' ? '#92400e' : '#f8fafc', border: toast.type === 'error' ? '1px solid #fee2e2' : toast.type === 'warn' ? '1px solid #fde68a' : 'none', fontFamily: 'inherit' }}>
          {toast.msg}
        </div>
      )}

      {/* Parsing toast */}
      {parsing && (
        <div style={{ position: 'fixed', bottom: 20, right: 20, zIndex: 300, padding: '12px 18px', borderRadius: 12, fontSize: 13, fontWeight: 500, display: 'flex', alignItems: 'center', gap: 10, background: '#0f172a', color: '#f8fafc', boxShadow: '0 8px 24px rgba(0,0,0,0.14)', fontFamily: 'inherit' }}>
          <Loader2 size={14} strokeWidth={2} color="#475569" style={{ animation: 'spin 1s linear infinite' }} />
          {parsing}
        </div>
      )}

      {/* Global keyframe styles */}
      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
        @keyframes bounce {
          0%, 60%, 100% { transform: translateY(0); }
          30% { transform: translateY(-5px); }
        }
        @keyframes pulse {
          0%, 100% { box-shadow: 0 0 0 2px rgba(34,197,94,0.2); }
          50% { box-shadow: 0 0 0 5px rgba(34,197,94,0.0); }
        }
        @keyframes aurora {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
        @keyframes flow {
          0% { left: -100px; opacity: 0; }
          20% { opacity: 1; }
          80% { opacity: 1; }
          100% { left: 100%; opacity: 0; }
        }
      `}</style>
    </div>
  );
}
