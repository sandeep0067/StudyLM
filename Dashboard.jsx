import React, { useState, useEffect, useRef, useCallback } from 'react';
import { generateOfflineContent, generateOfflineChatResponse } from './generators';
import { INITIAL_NOTEBOOKS } from './mockData';
import {
  Menu, Sparkles, Home, CheckCircle, Settings,
  BookOpen, AlertTriangle, Info, MessageSquare,
  FileText, UploadCloud, GitCommit, ArrowUp, X,
  Plus, Copy, Loader2, ListTodo, Trash2,
  Edit2, CornerDownRight, Network, ChevronRight
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
   MARKDOWN RENDERER
──────────────────────────────────────────*/
function parseInline(text) {
  if (!text) return text;
  const parts = []; let last = 0; let m;
  const r = /\*\*(.*?)\*\*/g;
  while ((m = r.exec(text)) !== null) {
    if (m.index > last) parts.push(text.slice(last, m.index));
    parts.push(<strong key={m.index} style={{ fontWeight: 600, color: '#1e293b' }}>{m[1]}</strong>);
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
          <li key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 8, marginBottom: 6, fontSize: 14, color: '#475569', lineHeight: 1.65 }}>
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
    if (t.startsWith('> '))   { flushList(i); out.push(<div key={`bq${i}`} style={{ margin: '12px 0', paddingLeft: 12, borderLeft: '2px solid #e2e8f0', fontSize: 13.5, color: '#64748b', fontStyle: 'italic' }}>{parseInline(t.slice(2))}</div>); continue; }
    if (t.startsWith('- ') || t.startsWith('* ')) { listItems.push(t.slice(2)); continue; }
    flushList(i);
    if (t) out.push(<p key={`p${i}`} style={{ fontSize: 14.5, lineHeight: 1.75, color: '#475569', marginBottom: 4 }}>{parseInline(line)}</p>);
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
   CONSTANTS
──────────────────────────────────────────*/
const FIELD = {
  summary: 'summaryData', timeline: 'timelineData',
  mindmap: 'mindmapData', plan: 'projectPlanData'
};

const TABS = [
  { id: 'summary',    label: 'Summary',    icon: FileText },
  { id: 'timeline',   label: 'Timeline',   icon: GitCommit },
  { id: 'mindmap',    label: 'Mind Map',   icon: Network },
  { id: 'plan',       label: 'Roadmap',    icon: ListTodo },
  { id: 'flashcards', label: 'Flashcards', icon: BookOpen },
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
  useEffect(() => {
    const fn = e => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', fn);
    return () => window.removeEventListener('keydown', fn);
  }, [onClose]);
  return (
    <div
      onClick={e => { if (e.target === e.currentTarget) onClose(); }}
      style={{ position: 'fixed', inset: 0, zIndex: 200, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 16, background: 'rgba(15,23,42,0.35)', backdropFilter: 'blur(8px)' }}
    >
      <div style={{ width: '100%', maxWidth: 400, background: '#fff', borderRadius: 20, border: '1px solid #e2e8f0', boxShadow: '0 24px 48px -12px rgba(0,0,0,0.18)', overflow: 'hidden' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px 20px', borderBottom: '1px solid #f1f5f9' }}>
          <span style={{ fontSize: 14, fontWeight: 700, color: '#0f172a' }}>{title}</span>
          <button onClick={onClose} style={{ width: 28, height: 28, borderRadius: 8, border: 'none', background: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#94a3b8' }}
            onMouseOver={e => e.currentTarget.style.background = '#f1f5f9'}
            onMouseOut={e => e.currentTarget.style.background = 'none'}>
            <X size={15} strokeWidth={2} />
          </button>
        </div>
        <div style={{ padding: '16px 20px 20px' }}>{children}</div>
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
   WORKSPACE CARD
──────────────────────────────────────────*/
function WorkspaceCard({ n, onOpen, onDelete, onRename }) {
  const [hov, setHov] = useState(false);
  const activeSrc = (n.sources || []).filter(s => s.active).length;
  const totalSrc  = (n.sources || []).length;
  return (
    <div style={{ position: 'relative' }}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}>
      <button
        onClick={() => onOpen(n.id)}
        style={{
          width: '100%', textAlign: 'left', padding: '16px', borderRadius: 16,
          border: hov ? '1px solid #cbd5e1' : '1px solid #e2e8f0',
          background: hov ? '#f8fafc' : '#fff',
          cursor: 'pointer', transition: 'all 0.12s',
          boxShadow: hov ? '0 4px 12px rgba(0,0,0,0.06)' : '0 1px 3px rgba(0,0,0,0.03)',
          display: 'flex', flexDirection: 'column', gap: 12, minHeight: 120
        }}
      >
        <div style={{ width: 36, height: 36, borderRadius: 10, background: '#f1f5f9', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <FileText size={16} strokeWidth={1.75} color="#64748b" />
        </div>
        <div>
          <p style={{ fontSize: 13.5, fontWeight: 600, color: '#0f172a', marginBottom: 4, lineHeight: 1.3 }}>{n.name}</p>
          <p style={{ fontSize: 11.5, color: '#94a3b8' }}>
            {totalSrc === 0 ? 'No sources' : `${totalSrc} source${totalSrc !== 1 ? 's' : ''}${activeSrc > 0 ? ` · ${activeSrc} active` : ''}`}
          </p>
        </div>
      </button>
      {/* Hover actions */}
      {hov && (
        <div style={{ position: 'absolute', top: 10, right: 10, display: 'flex', gap: 2, background: '#fff', border: '1px solid #e2e8f0', borderRadius: 8, padding: 3, boxShadow: '0 2px 8px rgba(0,0,0,0.08)' }}>
          <button onClick={e => { e.stopPropagation(); onRename(n); }} title="Rename"
            style={{ width: 24, height: 24, borderRadius: 5, border: 'none', background: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#94a3b8' }}
            onMouseOver={e => { e.currentTarget.style.background = '#f1f5f9'; e.currentTarget.style.color = '#374151'; }}
            onMouseOut={e => { e.currentTarget.style.background = 'none'; e.currentTarget.style.color = '#94a3b8'; }}>
            <Edit2 size={11} strokeWidth={2} />
          </button>
          <button onClick={e => { e.stopPropagation(); onDelete(n.id); }} title="Delete"
            style={{ width: 24, height: 24, borderRadius: 5, border: 'none', background: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#94a3b8' }}
            onMouseOver={e => { e.currentTarget.style.background = '#fef2f2'; e.currentTarget.style.color = '#ef4444'; }}
            onMouseOut={e => { e.currentTarget.style.background = 'none'; e.currentTarget.style.color = '#94a3b8'; }}>
            <Trash2 size={11} strokeWidth={2} />
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
        width: '100%', minHeight: 120, borderRadius: 16, cursor: 'pointer',
        border: `2px dashed ${hov ? '#94a3b8' : '#e2e8f0'}`,
        background: hov ? '#f8fafc' : '#fff',
        display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
        gap: 8, transition: 'all 0.12s', fontFamily: 'inherit'
      }}>
      <div style={{ width: 32, height: 32, borderRadius: 8, border: `2px dashed ${hov ? '#94a3b8' : '#e2e8f0'}`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <Plus size={15} strokeWidth={2.5} color={hov ? '#64748b' : '#94a3b8'} />
      </div>
      <span style={{ fontSize: 12.5, fontWeight: 600, color: hov ? '#475569' : '#94a3b8' }}>New Workspace</span>
    </button>
  );
}

/* ─────────────────────────────────────────
   SIDEBAR NAV ITEM
──────────────────────────────────────────*/
function NavItem({ icon: Icon, label, active, onClick }) {
  const [hov, setHov] = useState(false);
  const bg = active ? 'rgba(15,23,42,0.08)' : hov ? 'rgba(0,0,0,0.04)' : 'transparent';
  const col = active ? '#0f172a' : '#64748b';
  return (
    <button onClick={onClick}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{ width: '100%', display: 'flex', alignItems: 'center', gap: 10, padding: '7px 12px', borderRadius: 8, border: 'none', background: bg, cursor: 'pointer', fontFamily: 'inherit', fontSize: 13, fontWeight: active ? 600 : 500, color: col, transition: 'background 0.1s' }}>
      <Icon size={15} strokeWidth={active ? 2 : 1.75} />
      {label}
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
          width: '100%', display: 'flex', alignItems: 'center', gap: 8, padding: '7px 12px',
          paddingRight: hov ? 56 : 12,
          borderRadius: 8, border: 'none',
          background: active ? 'rgba(15,23,42,0.08)' : hov ? 'rgba(0,0,0,0.04)' : 'transparent',
          cursor: 'pointer', fontFamily: 'inherit', fontSize: 13, fontWeight: active ? 600 : 500,
          color: active ? '#0f172a' : '#64748b', transition: 'all 0.1s', textAlign: 'left'
        }}>
        <FileText size={14} strokeWidth={1.75} style={{ flexShrink: 0, color: active ? '#374151' : '#94a3b8' }} />
        <span style={{ flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{n.name}</span>
      </button>
      {hov && (
        <div style={{ position: 'absolute', right: 8, top: '50%', transform: 'translateY(-50%)', display: 'flex', gap: 2 }}>
          <button onClick={e => { e.stopPropagation(); onRename(); }}
            style={{ width: 22, height: 22, borderRadius: 5, border: 'none', background: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#94a3b8' }}
            onMouseOver={e => { e.currentTarget.style.background = '#e2e8f0'; e.currentTarget.style.color = '#374151'; }}
            onMouseOut={e => { e.currentTarget.style.background = 'none'; e.currentTarget.style.color = '#94a3b8'; }}>
            <Edit2 size={10} strokeWidth={2} />
          </button>
          <button onClick={e => { e.stopPropagation(); onDelete(); }}
            style={{ width: 22, height: 22, borderRadius: 5, border: 'none', background: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#94a3b8' }}
            onMouseOver={e => { e.currentTarget.style.background = '#fef2f2'; e.currentTarget.style.color = '#ef4444'; }}
            onMouseOut={e => { e.currentTarget.style.background = 'none'; e.currentTarget.style.color = '#94a3b8'; }}>
            <Trash2 size={10} strokeWidth={2} />
          </button>
        </div>
      )}
    </div>
  );
}

/* ─────────────────────────────────────────
   MAIN DASHBOARD
──────────────────────────────────────────*/
export default function Dashboard() {
  // Always in DOM — keeps ref valid for file picker
  const fileInputRef = useRef(null);
  const chatEndRef   = useRef(null);
  const renameRef    = useRef(null);

  const [notebooks, setNotebooks]   = useState(INITIAL_NOTEBOOKS);
  const [activeId, setActiveId]     = useState(null);
  const [tab, setTab]               = useState('summary');
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [modal, setModal]           = useState(null);
  const [apiKey, setApiKey]         = useState('');
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

  const nb = notebooks.find(n => n.id === activeId) || null;

  useEffect(() => {
    setApiKey(localStorage.getItem('meridian_api_key') || '');
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
  const callGemini = async (sys, prompt) => {
    const res = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`,
      { method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
          systemInstruction: { parts: [{ text: sys }] },
          generationConfig: { temperature: 0.2 }
        }) }
    );
    if (!res.ok) throw new Error(`API ${res.status}: ${res.statusText}`);
    return (await res.json()).candidates[0].content.parts[0].text;
  };

  /* ── Compile ── */
  const compile = async (type) => {
    if (!nb?.sources?.some(s => s.active)) { showToast('Activate at least one source first.', 'warn'); return; }
    setCompiling(true);
    try {
      const srcText = nb.sources.filter(s => s.active)
        .map(s => `[${s.name}]:\n${s.text}`).join('\n\n---\n\n');
      if (!apiKey) {
        const off = generateOfflineContent(nb);
        if (type === 'flashcards') upd({ flashcards: off.flashcards });
        else if (FIELD[type]) upd({ [FIELD[type]]: off[type] });
      } else {
        const cfgs = {
          summary:    ['Expert analyst. Write a structured markdown summary with ## headers.', `Summarize:\n${srcText}`],
          timeline:   ['Historian. Write a timeline. Each bullet: - **Event**: description.', `Timeline:\n${srcText}`],
          mindmap:    ['Architect. Indented * bullet mind map. Bold each main topic.', `Mind map:\n${srcText}`],
          plan:       ['PM. Phased roadmap: ### Phase headers + - [ ] task checkboxes.', `Roadmap:\n${srcText}`],
          flashcards: ['Teacher. Output ONLY valid JSON: [{"q":"...","a":"..."}]. Nothing else.', `Flashcards:\n${srcText}`],
        };
        const [sys, prompt] = cfgs[type] || cfgs.summary;
        const resp = await callGemini(sys, prompt);
        if (type === 'flashcards') {
          try { upd({ flashcards: JSON.parse(resp.replace(/```json\n?|```\n?/g, '').trim()) }); }
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
    if (!apiKey) {
      setTimeout(() => {
        setIsTyping(false);
        upd({ chatHistory: [...hist, { sender: 'ai', text: generateOfflineChatResponse(chatMsg, nb) }] });
      }, 650);
      return;
    }
    try {
      const ctx = nb.sources.filter(s => s.active).map(s => `[${s.name}]:\n${s.text}`).join('\n\n');
      const histStr = hist.map(h => `${h.sender === 'user' ? 'User' : 'Meridian'}: ${h.text}`).join('\n');
      const resp = await callGemini(
        'You are Meridian, a concise research assistant. Answer using only the provided context.',
        `Context:\n${ctx}\n\nConversation:\n${histStr}\n\nMeridian:`
      );
      upd({ chatHistory: [...hist, { sender: 'ai', text: resp }] });
    } catch (e) {
      upd({ chatHistory: [...hist, { sender: 'ai', text: '⚠ ' + e.message }] });
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

  /* computed */
  const currentData   = nb && FIELD[tab] ? nb[FIELD[tab]] : '';
  const flashcards    = nb?.flashcards || [];
  const hasData       = tab === 'flashcards' ? flashcards.length > 0 : !!currentData;
  const hasSources    = nb?.sources?.some(s => s.active);
  const tlItems       = tab === 'timeline' && currentData ? parseTimeline(currentData)  : [];
  const mmNodes       = tab === 'mindmap'  && currentData ? parseMindmap(currentData)   : [];
  const rmPhases      = tab === 'plan'     && currentData ? parseRoadmap(currentData)   : [];

  /* ─────── styles shorthand ─────── */
  const S = {
    root:   { display: 'flex', height: '100vh', overflow: 'hidden', fontFamily: "'Inter', -apple-system, sans-serif", background: '#fff', color: '#0f172a' },
    sb:     { flexShrink: 0, display: 'flex', flexDirection: 'column', borderRight: '1px solid #f0ebe1', background: '#faf8f5', overflow: 'hidden', transition: 'width 0.25s cubic-bezier(0.4,0,0.2,1)' },
    sbHead: { height: 56, display: 'flex', alignItems: 'center', gap: 10, padding: '0 16px', borderBottom: '1px solid #f0ebe1', flexShrink: 0 },
    sbNav:  { flex: 1, overflowY: 'auto', overflowX: 'hidden', padding: '10px 8px', scrollbarWidth: 'none' },
    sbLbl:  { fontSize: 10.5, fontWeight: 700, color: '#a8a29e', textTransform: 'uppercase', letterSpacing: '0.08em', padding: '16px 12px 6px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' },
    sbFoot: { flexShrink: 0, borderTop: '1px solid #f0ebe1', padding: 8 },
    main:   { flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0 },
    topbar: { height: 56, borderBottom: '1px solid #f0ebe1', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 16px', flexShrink: 0, background: '#fff' },
    centerPane: { flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0, borderRight: '1px solid #f0ebe1' },
    tabBar: { height: 44, borderBottom: '1px solid #f0ebe1', display: 'flex', alignItems: 'center', gap: 2, padding: '0 10px', flexShrink: 0, overflowX: 'auto', scrollbarWidth: 'none' },
    viewer: { flex: 1, overflowY: 'auto', position: 'relative', scrollbarWidth: 'thin', scrollbarColor: '#e7e5e4 transparent' },
    rPanel: { width: 288, flexShrink: 0, display: 'flex', flexDirection: 'column', background: '#faf8f5' },
    rHead:  { height: 44, borderBottom: '1px solid #f0ebe1', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 14px', flexShrink: 0 },
    rLbl:   { fontSize: 11.5, fontWeight: 700, color: '#78716c', textTransform: 'uppercase', letterSpacing: '0.07em' },
  };

  return (
    <div style={S.root}
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
        <div style={{ position: 'fixed', inset: 0, zIndex: 100, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(15,23,42,0.4)', backdropFilter: 'blur(10px)', pointerEvents: 'none' }}>
          <div style={{ background: '#fff', borderRadius: 24, padding: '32px 48px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12, boxShadow: '0 32px 64px rgba(0,0,0,0.18)' }}>
            <UploadCloud size={36} strokeWidth={1.5} color="#475569" />
            <p style={{ fontSize: 15, fontWeight: 700, color: '#0f172a', margin: 0 }}>Drop PDF to add source</p>
            <p style={{ fontSize: 12.5, color: '#94a3b8', margin: 0 }}>Will be added to this workspace</p>
          </div>
        </div>
      )}

      {/* ══ SIDEBAR ══ */}
      <aside style={{ ...S.sb, width: sidebarOpen ? 240 : 0 }}>
        <div style={S.sbHead}>
          <BoatLogo size={18} color="#374151" sw={1.7} />
          <span style={{ fontSize: 15, fontWeight: 700, letterSpacing: '-0.025em', color: '#0f172a' }}>Meridian</span>
        </div>
        <div style={S.sbNav}>
          <NavItem icon={Home} label="Home" active={activeId === null} onClick={() => setActiveId(null)} />
          <div style={S.sbLbl}>
            <span>Workspaces</span>
            <button onClick={createWs} title="New workspace"
              style={{ width: 20, height: 20, borderRadius: 5, border: 'none', background: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#94a3b8' }}
              onMouseOver={e => { e.currentTarget.style.background = '#e2e8f0'; e.currentTarget.style.color = '#374151'; }}
              onMouseOut={e => { e.currentTarget.style.background = 'none'; e.currentTarget.style.color = '#94a3b8'; }}>
              <Plus size={13} strokeWidth={2.5} />
            </button>
          </div>
          {notebooks.map(n => (
            <WsNavItem key={n.id} n={n} active={n.id === activeId}
              onClick={() => setActiveId(n.id)}
              onRename={() => openRename(n)}
              onDelete={() => deleteWs(n.id)} />
          ))}
        </div>
        <div style={S.sbFoot}>
          <NavItem icon={Settings} label="Settings" onClick={() => setModal('settings')} />
        </div>
      </aside>

      {/* ══ MAIN ══ */}
      <div style={S.main}>

        {/* Top bar */}
        <div style={S.topbar}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <button onClick={() => setSidebarOpen(s => !s)}
              style={{ width: 32, height: 32, borderRadius: 8, border: 'none', background: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#94a3b8' }}
              onMouseOver={e => { e.currentTarget.style.background = '#f1f5f9'; e.currentTarget.style.color = '#374151'; }}
              onMouseOut={e => { e.currentTarget.style.background = 'none'; e.currentTarget.style.color = '#94a3b8'; }}>
              <Menu size={17} strokeWidth={2} />
            </button>
            {/* Breadcrumb */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 13, color: '#94a3b8', fontWeight: 500 }}>
              <BoatLogo size={14} color="#94a3b8" sw={1.75} />
              <span>Meridian</span>
              {nb && <><ChevronRight size={13} strokeWidth={2} style={{ color: '#cbd5e1' }} /><span style={{ color: '#1e293b' }}>{nb.name}</span></>}
            </div>
          </div>
          {/* Actions */}
          {nb && (
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <button onClick={() => setModal('source')}
                style={{ height: 32, padding: '0 12px', borderRadius: 8, border: '1px solid #e2e8f0', background: '#fff', cursor: 'pointer', fontSize: 12.5, fontWeight: 500, color: '#475569', display: 'flex', alignItems: 'center', gap: 6, fontFamily: 'inherit' }}
                onMouseOver={e => e.currentTarget.style.background = '#f8fafc'}
                onMouseOut={e => e.currentTarget.style.background = '#fff'}>
                <UploadCloud size={13} strokeWidth={2} /> Add Source
              </button>
              <button onClick={() => compile(tab)} disabled={compiling || !hasSources}
                style={{
                  height: 32, padding: '0 16px', borderRadius: 8, border: 'none',
                  background: (compiling || !hasSources) ? '#e2e8f0' : 'linear-gradient(135deg, #10b981, #3b82f6, #a855f7)',
                  cursor: (compiling || !hasSources) ? 'not-allowed' : 'pointer', fontSize: 12.5, fontWeight: 600,
                  color: (compiling || !hasSources) ? '#94a3b8' : '#fff', display: 'flex', alignItems: 'center', gap: 6,
                  fontFamily: 'inherit', transition: 'all 0.12s', boxShadow: (compiling || !hasSources) ? 'none' : '0 2px 8px rgba(59, 130, 246, 0.25)'
                }}
                onMouseOver={e => { if (!compiling && hasSources) e.currentTarget.style.opacity = '0.9'; }}
                onMouseOut={e => { if (!compiling && hasSources) e.currentTarget.style.opacity = '1'; }}>
                {compiling ? <Loader2 size={13} strokeWidth={2.5} style={{ animation: 'spin 1s linear infinite' }} /> : <Sparkles size={13} strokeWidth={2.5} />}
                {compiling ? 'Generating…' : 'Generate'}
              </button>
            </div>
          )}
        </div>

        {/* ── HOME ── */}
        {!nb ? (
          <div style={{ flex: 1, overflowY: 'auto', scrollbarWidth: 'none' }}>
            <div style={{ maxWidth: 1200, margin: '0 auto', padding: '64px 64px 80px' }}>

              {/* ── Hero ── */}
              <div style={{ marginBottom: 52 }}>
                {/* Boat mark — free, animated, no box */}
                <div style={{ marginBottom: 28 }}>
                  <BoatLogo size={52} color="#1e293b" sw={1.35} animated={true} />
                </div>

                <h1 style={{ margin: '0 0 14px', fontSize: 36, fontWeight: 800, letterSpacing: '-0.04em', color: '#0f172a', lineHeight: 1.15 }}>
                  {getGreeting()}
                </h1>
                <p style={{ margin: 0, fontSize: 16, color: '#64748b', lineHeight: 1.7, maxWidth: 440 }}>
                  Meridian reads your documents and turns them into an <span style={{ color: 'transparent', backgroundClip: 'text', WebkitBackgroundClip: 'text', backgroundImage: 'linear-gradient(135deg, #10b981, #3b82f6, #a855f7)', fontWeight: 600, animation: 'aurora 4s ease infinite', backgroundSize: '200% 200%' }}>intelligent research workspace</span> — summaries, timelines, roadmaps, and conversation.
                </p>
              </div>


              {/* ── Workspaces ── */}
              <div>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
                  <p style={{ margin: 0, fontSize: 11, fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Your Workspaces</p>
                  {notebooks.length > 0 && (
                    <button onClick={createWs} style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: 12.5, fontWeight: 600, color: '#475569', background: 'none', border: 'none', cursor: 'pointer', fontFamily: 'inherit', padding: '4px 8px', borderRadius: 6 }}
                      onMouseOver={e => { e.currentTarget.style.background = '#f1f5f9'; }}
                      onMouseOut={e => { e.currentTarget.style.background = 'none'; }}>
                      <Plus size={13} strokeWidth={2.5} /> New
                    </button>
                  )}
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(190px, 1fr))', gap: 12 }}>
                  {notebooks.map(n => (
                    <WorkspaceCard key={n.id} n={n}
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
                  return (
                    <button key={t.id} onClick={() => setTab(t.id)}
                      style={{ height: 30, padding: '0 12px', borderRadius: 7, border: 'none', background: active ? '#0f172a' : 'none', color: active ? '#fff' : '#94a3b8', cursor: 'pointer', fontSize: 12.5, fontWeight: active ? 600 : 500, display: 'flex', alignItems: 'center', gap: 6, whiteSpace: 'nowrap', fontFamily: 'inherit', transition: 'all 0.1s' }}
                      onMouseOver={e => { if (!active) { e.currentTarget.style.background = '#f1f5f9'; e.currentTarget.style.color = '#374151'; }}}
                      onMouseOut={e => { if (!active) { e.currentTarget.style.background = 'none'; e.currentTarget.style.color = '#94a3b8'; }}}>
                      <t.icon size={13} strokeWidth={active ? 2 : 1.75} />
                      {t.label}
                    </button>
                  );
                })}
              </div>

              {/* Viewer */}
              <div style={S.viewer}>

                {/* Empty: no active sources */}
                {!hasSources && (
                  <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 16, textAlign: 'center', padding: 40 }}>
                    <div style={{ width: 48, height: 48, borderRadius: 14, background: '#f1f5f9', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <UploadCloud size={22} strokeWidth={1.5} color="#94a3b8" />
                    </div>
                    <div>
                      <p style={{ margin: '0 0 6px', fontSize: 15, fontWeight: 600, color: '#334155' }}>Add a source to get started</p>
                      <p style={{ margin: 0, fontSize: 13, color: '#94a3b8', lineHeight: 1.6 }}>Upload a PDF document. Meridian will extract and index<br />its contents so you can generate insights.</p>
                    </div>
                    <button onClick={() => setModal('source')}
                      style={{ height: 36, padding: '0 18px', borderRadius: 10, border: 'none', background: '#0f172a', color: '#fff', cursor: 'pointer', fontSize: 13, fontWeight: 600, display: 'flex', alignItems: 'center', gap: 6, fontFamily: 'inherit' }}>
                      <UploadCloud size={13} strokeWidth={2} /> Add Source
                    </button>
                  </div>
                )}

                {/* Empty: sources active but no generated content */}
                {hasSources && !hasData && (
                  <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 16, textAlign: 'center', padding: 40 }}>
                    <div style={{ width: 48, height: 48, borderRadius: 14, background: '#f1f5f9', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <Sparkles size={22} strokeWidth={1.5} color="#94a3b8" />
                    </div>
                    <div>
                      <p style={{ margin: '0 0 6px', fontSize: 15, fontWeight: 600, color: '#334155' }}>Ready to generate</p>
                      <p style={{ margin: 0, fontSize: 13, color: '#94a3b8' }}>Click <strong style={{ color: '#475569', fontWeight: 600 }}>Generate</strong> in the toolbar to create your {TABS.find(t => t.id === tab)?.label?.toLowerCase()}.</p>
                    </div>
                    <button onClick={() => compile(tab)} disabled={compiling}
                      style={{ height: 36, padding: '0 18px', borderRadius: 10, border: 'none', background: compiling ? '#e2e8f0' : '#0f172a', color: compiling ? '#94a3b8' : '#fff', cursor: compiling ? 'not-allowed' : 'pointer', fontSize: 13, fontWeight: 600, display: 'flex', alignItems: 'center', gap: 6, fontFamily: 'inherit' }}>
                      {compiling ? <Loader2 size={13} style={{ animation: 'spin 1s linear infinite' }} /> : <Sparkles size={13} strokeWidth={2} />}
                      {compiling ? 'Generating…' : `Generate ${TABS.find(t => t.id === tab)?.label}`}
                    </button>
                  </div>
                )}

                {/* Content renderers */}
                {hasData && (
                  <div style={{ padding: '32px 40px', maxWidth: 720, margin: '0 auto' }}>

                    {tab === 'summary' && (
                      <div style={{ userSelect: 'text' }}>
                        <p style={{ fontSize: 10.5, fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 24 }}>Summary</p>
                        <MD content={currentData} />
                      </div>
                    )}

                    {tab === 'timeline' && (
                      <div>
                        <p style={{ fontSize: 10.5, fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 32 }}>Timeline</p>
                        <div style={{ position: 'relative', paddingLeft: 28, borderLeft: '2px solid #f1f5f9' }}>
                          {tlItems.map((m, i) => (
                            <div key={i} style={{ position: 'relative', marginBottom: 32 }}>
                              <div style={{ position: 'absolute', left: -35, top: 5, width: 10, height: 10, borderRadius: '50%', border: '2px solid #334155', background: '#fff' }} />
                              <p style={{ margin: '0 0 3px', fontSize: 11, fontFamily: 'monospace', color: '#94a3b8' }}>#{String(i + 1).padStart(2, '0')}</p>
                              <h3 style={{ margin: '0 0 6px', fontSize: 15, fontWeight: 600, color: '#0f172a', letterSpacing: '-0.01em' }}>{m.title}</h3>
                              <p style={{ margin: 0, fontSize: 13.5, color: '#64748b', lineHeight: 1.65 }}>{m.desc}</p>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {tab === 'mindmap' && (
                      <div>
                        <p style={{ fontSize: 10.5, fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 24 }}>Mind Map</p>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                          {mmNodes.map(node => (
                            <div key={node.id} style={{ borderRadius: 14, border: '1px solid #f1f5f9', overflow: 'hidden' }}>
                              <div style={{ padding: '12px 16px', background: '#f8fafc', borderBottom: '1px solid #f1f5f9', display: 'flex', alignItems: 'center', gap: 8 }}>
                                <div style={{ width: 7, height: 7, borderRadius: '50%', background: '#334155', flexShrink: 0 }} />
                                <h3 style={{ margin: 0, fontSize: 14, fontWeight: 600, color: '#0f172a', letterSpacing: '-0.01em' }}>{node.label}</h3>
                              </div>
                              {(node.desc || node.children.length > 0) && (
                                <div style={{ padding: '12px 16px', display: 'flex', flexDirection: 'column', gap: 10 }}>
                                  {node.desc && <p style={{ margin: 0, fontSize: 13.5, color: '#64748b', lineHeight: 1.6 }}>{node.desc}</p>}
                                  {node.children.map(ch => (
                                    <div key={ch.id} style={{ display: 'flex', alignItems: 'flex-start', gap: 8, paddingLeft: 8 }}>
                                      <CornerDownRight size={12} strokeWidth={1.75} color="#cbd5e1" style={{ flexShrink: 0, marginTop: 3 }} />
                                      <div>
                                        <p style={{ margin: '0 0 2px', fontSize: 13.5, fontWeight: 500, color: '#334155' }}>{ch.label}</p>
                                        {ch.desc && <p style={{ margin: 0, fontSize: 12.5, color: '#94a3b8', lineHeight: 1.55 }}>{ch.desc}</p>}
                                      </div>
                                    </div>
                                  ))}
                                </div>
                              )}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {tab === 'plan' && (
                      <div>
                        <p style={{ fontSize: 10.5, fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 24 }}>Roadmap</p>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 32 }}>
                          {rmPhases.map((phase, i) => (
                            <div key={i}>
                              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
                                <div style={{ width: 22, height: 22, borderRadius: 7, background: '#f1f5f9', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 10, fontWeight: 700, color: '#64748b' }}>{i + 1}</div>
                                <h3 style={{ margin: 0, fontSize: 12.5, fontWeight: 700, color: '#475569', textTransform: 'uppercase', letterSpacing: '0.06em' }}>{phase.title}</h3>
                              </div>
                              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                                {phase.tasks.map(t => (
                                  <div key={t.id} style={{ display: 'flex', alignItems: 'flex-start', gap: 12, padding: '12px 14px', borderRadius: 10, border: '1px solid #f1f5f9', background: '#fafafa' }}>
                                    <div style={{ width: 16, height: 16, borderRadius: 5, border: t.done ? 'none' : '1.5px solid #cbd5e1', background: t.done ? '#0f172a' : 'transparent', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, marginTop: 1 }}>
                                      {t.done && <CheckCircle size={9} color="#fff" />}
                                    </div>
                                    <span style={{ fontSize: 13.5, lineHeight: 1.55, color: t.done ? '#94a3b8' : '#334155', textDecoration: t.done ? 'line-through' : 'none' }}>{t.text}</span>
                                  </div>
                                ))}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {tab === 'flashcards' && flashcards.length > 0 && (
                      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', paddingTop: 16 }}>
                        <p style={{ fontSize: 10.5, fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 32, alignSelf: 'flex-start' }}>Flashcards</p>
                        {/* 3D Card */}
                        <div onClick={() => setFlipped(f => !f)} style={{ width: '100%', maxWidth: 440, height: 220, cursor: 'pointer', perspective: '1400px' }}>
                          <div style={{ width: '100%', height: '100%', position: 'relative', transformStyle: 'preserve-3d', transform: flipped ? 'rotateY(180deg)' : 'rotateY(0)', transition: 'transform 0.44s cubic-bezier(0.4,0,0.2,1)' }}>
                            {/* Front */}
                            <div style={{ position: 'absolute', inset: 0, borderRadius: 20, border: '1px solid #e2e8f0', background: '#fff', boxShadow: '0 4px 20px rgba(0,0,0,0.06)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: 32, textAlign: 'center', backfaceVisibility: 'hidden' }}>
                              <p style={{ fontSize: 10.5, fontWeight: 700, color: '#cbd5e1', textTransform: 'uppercase', letterSpacing: '0.12em', marginBottom: 20 }}>Question</p>
                              <p style={{ fontSize: 19, fontWeight: 600, color: '#0f172a', lineHeight: 1.4, margin: 0 }}>{flashcards[cardIdx]?.q}</p>
                              <p style={{ fontSize: 11.5, color: '#cbd5e1', marginTop: 20, marginBottom: 0 }}>Tap to flip</p>
                            </div>
                            {/* Back */}
                            <div style={{ position: 'absolute', inset: 0, borderRadius: 20, background: '#0f172a', boxShadow: '0 4px 20px rgba(0,0,0,0.12)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: 32, textAlign: 'center', backfaceVisibility: 'hidden', transform: 'rotateY(180deg)' }}>
                              <p style={{ fontSize: 10.5, fontWeight: 700, color: '#475569', textTransform: 'uppercase', letterSpacing: '0.12em', marginBottom: 20 }}>Answer</p>
                              <p style={{ fontSize: 16, color: '#f8fafc', lineHeight: 1.6, margin: 0 }}>{flashcards[cardIdx]?.a}</p>
                            </div>
                          </div>
                        </div>
                        {/* Progress + Controls */}
                        <div style={{ width: '100%', maxWidth: 440, marginTop: 24 }}>
                          <div style={{ height: 2, background: '#f1f5f9', borderRadius: 99, overflow: 'hidden', marginBottom: 20 }}>
                            <div style={{ height: '100%', background: '#0f172a', borderRadius: 99, width: `${((cardIdx + 1) / flashcards.length) * 100}%`, transition: 'width 0.3s' }} />
                          </div>
                          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                            <button onClick={() => { setCardIdx(i => Math.max(0, i - 1)); setFlipped(false); }} disabled={cardIdx === 0}
                              style={{ height: 36, padding: '0 18px', borderRadius: 10, border: '1px solid #e2e8f0', background: '#fff', cursor: cardIdx === 0 ? 'not-allowed' : 'pointer', fontSize: 13, fontWeight: 500, color: '#475569', opacity: cardIdx === 0 ? 0.35 : 1, fontFamily: 'inherit' }}>
                              ← Prev
                            </button>
                            <span style={{ fontSize: 12.5, fontWeight: 600, color: '#94a3b8' }}>{cardIdx + 1} / {flashcards.length}</span>
                            <button onClick={() => { setCardIdx(i => Math.min(flashcards.length - 1, i + 1)); setFlipped(false); }} disabled={cardIdx === flashcards.length - 1}
                              style={{ height: 36, padding: '0 18px', borderRadius: 10, border: 'none', background: cardIdx === flashcards.length - 1 ? '#e2e8f0' : '#0f172a', cursor: cardIdx === flashcards.length - 1 ? 'not-allowed' : 'pointer', fontSize: 13, fontWeight: 600, color: cardIdx === flashcards.length - 1 ? '#94a3b8' : '#fff', fontFamily: 'inherit' }}>
                              Next →
                            </button>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>

            {/* ── RIGHT PANEL ── */}
            <div style={S.rPanel}>

              {/* Sources */}
              <div style={{ flex: '0 0 50%', display: 'flex', flexDirection: 'column', borderBottom: '1px solid #f1f5f9' }}>
                <div style={S.rHead}>
                  <span style={S.rLbl}>Sources</span>
                  <button onClick={() => setModal('source')} title="Add source"
                    style={{ width: 26, height: 26, borderRadius: 7, border: 'none', background: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#94a3b8' }}
                    onMouseOver={e => { e.currentTarget.style.background = '#e2e8f0'; e.currentTarget.style.color = '#374151'; }}
                    onMouseOut={e => { e.currentTarget.style.background = 'none'; e.currentTarget.style.color = '#94a3b8'; }}>
                    <Plus size={14} strokeWidth={2.5} />
                  </button>
                </div>
                <div style={{ flex: 1, overflowY: 'auto', padding: 10, display: 'flex', flexDirection: 'column', gap: 6, scrollbarWidth: 'none' }}>
                  {nb.sources.length === 0 ? (
                    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 8, textAlign: 'center', padding: 16 }}>
                      <UploadCloud size={22} strokeWidth={1.25} color="#cbd5e1" />
                      <p style={{ fontSize: 12, color: '#94a3b8', margin: 0, lineHeight: 1.6 }}>No sources yet.<br />Upload a PDF to get started.</p>
                    </div>
                  ) : nb.sources.map((s, i) => {
                    const tog = () => upd({ sources: nb.sources.map(src => src.id === s.id ? { ...src, active: !src.active } : src) });
                    return (
                      <div key={i} onClick={tog} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '10px 12px', borderRadius: 10, border: s.active ? '1px solid #e2e8f0' : '1px solid transparent', background: s.active ? '#fff' : 'transparent', cursor: 'pointer', opacity: s.active ? 1 : 0.5, boxShadow: s.active ? '0 1px 4px rgba(0,0,0,0.04)' : 'none', transition: 'all 0.12s' }}>
                        <div style={{ width: 32, height: 32, borderRadius: 8, background: '#f1f5f9', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                          <FileText size={14} strokeWidth={1.75} color={s.active ? '#475569' : '#94a3b8'} />
                        </div>
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <p style={{ margin: 0, fontSize: 12.5, fontWeight: 500, color: '#334155', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', lineHeight: 1.3 }}>{s.name}</p>
                          <p style={{ margin: '2px 0 0', fontSize: 11, color: '#94a3b8' }}>{s.size}</p>
                        </div>
                        <div style={{ width: 7, height: 7, borderRadius: '50%', background: s.active ? '#0f172a' : '#e2e8f0', flexShrink: 0 }} />
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Chat */}
              <div style={{ flex: '0 0 50%', display: 'flex', flexDirection: 'column' }}>
                <div style={S.rHead}>
                  <span style={S.rLbl}>Assistant</span>
                </div>
                <div style={{ flex: 1, overflowY: 'auto', padding: 12, display: 'flex', flexDirection: 'column', gap: 10, scrollbarWidth: 'none' }}>
                  {nb.chatHistory.length === 0 && (
                    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 8, textAlign: 'center', color: '#94a3b8' }}>
                      <MessageSquare size={22} strokeWidth={1.25} color="#cbd5e1" />
                      <p style={{ fontSize: 12, margin: 0 }}>Ask anything about your sources</p>
                    </div>
                  )}
                  {nb.chatHistory.map((msg, i) => (
                    <div key={i} style={{ display: 'flex', justifyContent: msg.sender === 'user' ? 'flex-end' : 'flex-start' }}>
                      <div style={{ maxWidth: '88%', padding: '10px 14px', borderRadius: msg.sender === 'user' ? '16px 16px 4px 16px' : '16px 16px 16px 4px', background: msg.sender === 'user' ? '#0f172a' : '#fff', color: msg.sender === 'user' ? '#f8fafc' : '#334155', fontSize: 13, lineHeight: 1.6, border: msg.sender === 'user' ? 'none' : '1px solid #f1f5f9', boxShadow: msg.sender === 'ai' ? '0 1px 3px rgba(0,0,0,0.04)' : 'none', userSelect: 'text', wordBreak: 'break-word' }}>
                        {msg.text}
                      </div>
                    </div>
                  ))}
                  {isTyping && (
                    <div style={{ display: 'flex', justifyContent: 'flex-start' }}>
                      <div style={{ padding: '12px 16px', borderRadius: '16px 16px 16px 4px', background: '#fff', border: '1px solid #f1f5f9', display: 'flex', gap: 5, alignItems: 'center' }}>
                        {[0, 0.18, 0.36].map((d, i) => <span key={i} style={{ width: 6, height: 6, borderRadius: '50%', background: '#cbd5e1', display: 'block', animation: `bounce 1s ${d}s infinite` }} />)}
                      </div>
                    </div>
                  )}
                  <div ref={chatEndRef} />
                </div>
                {/* Input */}
                <div style={{ padding: '10px 10px', borderTop: '1px solid #f1f5f9', background: '#fff', flexShrink: 0 }}>
                  <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
                    <input
                      value={chatMsg}
                      onChange={e => setChatMsg(e.target.value)}
                      onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendChat(); } }}
                      placeholder="Ask a question…"
                      style={{ width: '100%', padding: '9px 40px 9px 14px', borderRadius: 10, border: '1px solid #e2e8f0', background: '#f8fafc', fontSize: 13, color: '#0f172a', outline: 'none', fontFamily: 'inherit', boxSizing: 'border-box', transition: 'border-color 0.12s, background 0.12s' }}
                      onFocus={e => { e.currentTarget.style.borderColor = '#94a3b8'; e.currentTarget.style.background = '#fff'; }}
                      onBlur={e => { e.currentTarget.style.borderColor = '#e2e8f0'; e.currentTarget.style.background = '#f8fafc'; }}
                    />
                    <button onClick={sendChat} disabled={!chatMsg.trim() || isTyping}
                      style={{ position: 'absolute', right: 4, width: 30, height: 30, borderRadius: 8, border: 'none', background: chatMsg.trim() && !isTyping ? '#0f172a' : 'transparent', cursor: chatMsg.trim() && !isTyping ? 'pointer' : 'default', display: 'flex', alignItems: 'center', justifyContent: 'center', color: chatMsg.trim() && !isTyping ? '#fff' : '#cbd5e1', transition: 'all 0.12s' }}>
                      <ArrowUp size={14} strokeWidth={2.5} />
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
          <div style={{ marginTop: 16, display: 'flex', flexDirection: 'column', gap: 6 }}>
            <label style={{ fontSize: 11.5, fontWeight: 700, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.07em' }}>Gemini API Key</label>
            <input type="password" value={apiKey}
              onChange={e => { setApiKey(e.target.value); localStorage.setItem('meridian_api_key', e.target.value); }}
              placeholder="AI…"
              style={{ padding: '10px 14px', borderRadius: 10, border: '1px solid #e2e8f0', fontSize: 13, fontFamily: 'monospace', color: '#0f172a', outline: 'none', boxSizing: 'border-box', width: '100%' }}
              onFocus={e => e.currentTarget.style.borderColor = '#94a3b8'}
              onBlur={e => e.currentTarget.style.borderColor = '#e2e8f0'}
            />
            <p style={{ margin: '4px 0 0', fontSize: 12, color: '#94a3b8', lineHeight: 1.55 }}>
              {apiKey ? '✓ API key saved — using Gemini.' : 'No key — running offline sandbox mode.'}
            </p>
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
