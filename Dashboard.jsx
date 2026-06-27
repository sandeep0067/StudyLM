import React, { useState, useEffect, useRef } from 'react';

// Custom lightweight Markdown Renderer component (No dependencies, parses alerts, list items, math, and code blocks)
function MarkdownRenderer({ content }) {
  if (!content) return null;
  const lines = content.split('\n');
  const renderedElements = [];
  
  let inCodeBlock = false;
  let codeLang = '';
  let codeLines = [];
  
  let currentListItems = [];
  let isInsideAlert = false;
  let alertType = ''; // 'note', 'important', 'warning'
  let alertLines = [];

  const flushList = (key) => {
    if (currentListItems.length > 0) {
      renderedElements.push(
        <ul key={`ul-${key}`} className="list-disc pl-5 my-2 space-y-1 text-on-surface-variant font-sans">
          {currentListItems.map((item, idx) => (
            <li key={`li-${key}-${idx}`} className="text-body-md">
              {parseInlineMarkdown(item)}
            </li>
          ))}
        </ul>
      );
      currentListItems = [];
    }
  };

  const flushAlert = (key) => {
    if (isInsideAlert) {
      let borderCol = 'border-l-4 border-primary bg-primary/5';
      let titleCol = 'text-primary';
      if (alertType === 'important') {
        borderCol = 'border-l-4 border-amber-500 bg-amber-500/5';
        titleCol = 'text-amber-600';
      } else if (alertType === 'warning') {
        borderCol = 'border-l-4 border-red-500 bg-red-500/5';
        titleCol = 'text-red-600';
      }
      renderedElements.push(
        <div key={`alert-${key}`} className={`p-4 rounded-r-lg my-4 ${borderCol} font-sans`}>
          <div className={`font-bold text-[11px] uppercase tracking-wider mb-2 ${titleCol}`}>{alertType}</div>
          <div className="text-body-md text-on-surface leading-relaxed">
            {alertLines.map((line, idx) => (
              <p key={`alert-p-${key}-${idx}`} className="mb-2 last:mb-0">
                {parseInlineMarkdown(line)}
              </p>
            ))}
          </div>
        </div>
      );
      alertLines = [];
      isInsideAlert = false;
      alertType = '';
    }
  };

  const parseInlineMarkdown = (text) => {
    const parts = [];
    const boldRegex = /\*\*(.*?)\*\*/g;
    let match;
    let lastIndex = 0;

    boldRegex.lastIndex = 0;

    while ((match = boldRegex.exec(text)) !== null) {
      const index = match.index;
      if (index > lastIndex) {
        parts.push(text.substring(lastIndex, index));
      }
      parts.push(<strong key={`b-${index}`} className="font-semibold text-on-surface">{match[1]}</strong>);
      lastIndex = boldRegex.lastIndex;
    }

    if (lastIndex < text.length) {
      parts.push(text.substring(lastIndex));
    }

    return parts.length > 0 ? parts : text;
  };

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const trimmed = line.trim();

    // Code block detection
    if (trimmed.startsWith('```')) {
      if (inCodeBlock) {
        const codeContent = codeLines.join('\n');
        const currentLang = codeLang || 'code';
        renderedElements.push(
          <div key={`code-${i}`} className="bg-[#F8F9FA] rounded overflow-hidden border border-outline-variant my-md font-sans">
            <div className="flex justify-between items-center px-md py-sm bg-white border-b border-outline-variant">
              <span className="text-label-sm font-bold text-on-surface-variant/70">{currentLang}</span>
              <span 
                onClick={() => {
                  navigator.clipboard.writeText(codeContent);
                  alert("Copied code snippet to clipboard!");
                }}
                className="material-symbols-outlined text-[16px] text-on-surface-variant cursor-pointer hover:text-primary"
                title="Copy code"
              >
                content_copy
              </span>
            </div>
            <pre className="p-md text-[13px] font-code leading-relaxed text-[#24292e] overflow-x-auto">
              <code>{codeContent}</code>
            </pre>
          </div>
        );
        codeLines = [];
        inCodeBlock = false;
        codeLang = '';
      } else {
        flushList(i);
        flushAlert(i);
        inCodeBlock = true;
        codeLang = trimmed.substring(3).trim();
      }
      continue;
    }

    if (inCodeBlock) {
      codeLines.push(line);
      continue;
    }

    // Math formulation detection
    if (trimmed.startsWith('$$') || trimmed.startsWith('\\[') || (trimmed.startsWith('|\\') && trimmed.endsWith('\\rangle')) || trimmed.includes('\\Psi\\rangle') || trimmed.includes('\\langle\\phi')) {
      flushList(i);
      flushAlert(i);
      
      // Split math formulas if multiple in one block
      const formulas = trimmed.split('\n');
      
      renderedElements.push(
        <div key={`math-${i}`} className="bg-surface-container-low p-md rounded border border-outline-variant mb-md font-code text-primary">
          <div className="flex items-center gap-sm mb-2 text-[10px] font-bold text-on-surface-variant/60 border-b border-outline-variant/50 pb-1 uppercase tracking-widest">
            <span className="material-symbols-outlined text-[14px]">functions</span>
            Mathematical Formulation
          </div>
          <div className="py-2 flex flex-col gap-2 font-medium text-body-lg text-primary overflow-x-auto">
            {formulas.map((form, fIdx) => (
              <p key={fIdx} className="leading-relaxed whitespace-nowrap">{form.startsWith('$$') ? form.replace(/\$\$/g, '') : form}</p>
            ))}
          </div>
        </div>
      );
      continue;
    }

    // Blockquotes & Alerts
    if (trimmed.startsWith('>')) {
      flushList(i);
      const quoteContent = trimmed.substring(1).trim();
      
      if (quoteContent.startsWith('[!NOTE]')) {
        flushAlert(i);
        isInsideAlert = true;
        alertType = 'note';
      } else if (quoteContent.startsWith('[!IMPORTANT]')) {
        flushAlert(i);
        isInsideAlert = true;
        alertType = 'important';
      } else if (quoteContent.startsWith('[!WARNING]')) {
        flushAlert(i);
        isInsideAlert = true;
        alertType = 'warning';
      } else {
        if (isInsideAlert) {
          alertLines.push(quoteContent);
        } else {
          renderedElements.push(
            <blockquote key={`bq-${i}`} className="border-l-4 border-outline pl-md my-md italic text-on-surface-variant font-sans">
              {parseInlineMarkdown(quoteContent)}
            </blockquote>
          );
        }
      }
      continue;
    }

    if (isInsideAlert && !trimmed.startsWith('>')) {
      flushAlert(i);
    }

    // Headings
    if (trimmed.startsWith('### ')) {
      flushList(i);
      renderedElements.push(
        <h4 key={`h3-${i}`} className="text-headline-sm font-semibold text-on-surface mt-6 mb-2 font-sans">
          {parseInlineMarkdown(trimmed.substring(4))}
        </h4>
      );
    } else if (trimmed.startsWith('## ')) {
      flushList(i);
      renderedElements.push(
        <h3 key={`h2-${i}`} className="text-headline-md font-bold text-on-surface mt-8 mb-4 border-b border-outline-variant pb-2 font-sans">
          {parseInlineMarkdown(trimmed.substring(3))}
        </h3>
      );
    } else if (trimmed.startsWith('# ')) {
      flushList(i);
      renderedElements.push(
        <h2 key={`h1-${i}`} className="text-headline-lg font-bold text-on-surface mt-10 mb-6 font-sans">
          {parseInlineMarkdown(trimmed.substring(2))}
        </h2>
      );
    } else if (trimmed.startsWith('* ') || trimmed.startsWith('- ')) {
      currentListItems.push(trimmed.substring(2));
    } else if (trimmed === '') {
      flushList(i);
      renderedElements.push(<div key={`br-${i}`} className="h-4" />);
    } else {
      flushList(i);
      renderedElements.push(
        <p key={`p-${i}`} className="text-body-md text-on-surface leading-relaxed mb-3 last:mb-0 font-sans">
          {parseInlineMarkdown(line)}
        </p>
      );
    }
  }

  flushList(lines.length);
  flushAlert(lines.length);

  return <div className="space-y-1">{renderedElements}</div>;
}

// Fallback summaries
const FALLBACK_SUMMARY = `The **observer effect** in quantum mechanics refers to changes that the act of observation makes on a quantum system. In its simplest form, measuring a property of a particle (like its position) forces the wavefunction to transition from a superposition of states into a single, definite eigenstate.

|\\Psi\\rangle = \\sum_i c_i |\\phi_i\\rangle
P(\\phi_n) = |\\langle\\phi_n|\\Psi\\rangle|^2 = |c_n|^2

\`\`\`python
import numpy as np

def simulate_collapse(wavefunction):
    # Probability amplitudes
    probabilities = np.abs(wavefunction)**2
    # Choice based on distribution
    observed_state = np.random.choice(len(wavefunction), p=probabilities)
    return observed_state
\`\`\``;

const FALLBACK_QUIZ = [
  {
    question: "During which phase of mitosis do chromosomes align at the center of the cell?",
    options: ["Prophase", "Metaphase", "Anaphase", "Telophase"],
    answerIndex: 1,
    explanation: "Metaphase is characterized by chromosomes lining up along the middle (metaphase plate) of the cell. In Prophase they condense, in Anaphase they separate, and in Telophase the nuclear envelope reforms."
  },
  {
    question: "What is the primary product of a single mitotic division?",
    options: [
      "Four genetically unique haploid gamete cells",
      "Two genetically unique diploid cells",
      "Two genetically identical diploid somatic cells",
      "Four genetically identical diploid cells"
    ],
    answerIndex: 2,
    explanation: "Mitosis yields two somatic cells that are genetically identical to each other and to the parent cell, containing the full diploid set of chromosomes (2n)."
  }
];

const FALLBACK_CARDS = [
  { q: "Chromatin", a: "The material of which the chromosomes of organisms other than bacteria are composed, consisting of protein, RNA, and DNA." },
  { q: "Cytokinesis", a: "The physical division of the cytoplasm, organelles, and cell membrane into two daughter cells, occurring immediately after telophase." },
  { q: "Somatic Cells", a: "Any cell of a living organism other than the reproductive cells (gametes)." },
  { q: "Haploid (n)", a: "Having a single set of unpaired chromosomes, typical of gamete cells produced during meiosis." }
];

const KREBS_CYCLE_SUMMARY = `## 📖 Deep Read: The Krebs Cycle (Citric Acid Cycle)
The Citric Acid Cycle is a central metabolic pathway that oxidizes acetyl-CoA into carbon dioxide, harvesting energy in the form of NADH, FADH2, and GTP/ATP.

|\\text{Reaction Matrix}
\\text{Acetyl-CoA (2C)} + \\text{Oxaloacetate (4C)} \\rightarrow \\text{Citrate (6C)}

\`\`\`python
def krebs_turn(acetyl_coa):
    # Produces high energy yields
    nadh = 3
    fadh2 = 1
    gtp = 1
    return nadh, fadh2, gtp
\`\`\``;

const KREBS_CYCLE_QUIZ = [
  {
    question: "Which 4-carbon compound is regenerated at the end of each Krebs cycle turn?",
    options: ["Malate", "Citrate", "Oxaloacetate", "Succinate"],
    answerIndex: 2,
    explanation: "Oxaloacetate (4C) combines with Acetyl-CoA (2C) to start the cycle and is regenerated at the final step from Malate."
  }
];

const KREBS_CYCLE_CARDS = [
  { q: "Acetyl-CoA", a: "A 2-carbon molecule that transfers the acetyl group to oxaloacetate to initiate the Krebs cycle." },
  { q: "Mitochondrial Matrix", a: "The fluid-filled inner space of the mitochondrion where the Krebs cycle enzymes are located." }
];

const GENERIC_SUMMARY = `## 📖 Deep Read: Core Principles & Summarization
This is a synthesized study outline generated from your search query. To get deep custom outlines of your specific textbook chapters, upload your PDF notes in the Left Pane.

|\\text{Spaced Repetition Schedule}
f(t) = e^{-t/S}`;

const GENERIC_QUIZ = [
  {
    question: "Which study technique involves explaining a concept in simple terms to find knowledge gaps?",
    options: ["Passive reading", "The Feynman Technique", "Highlighting text", "Cramming"],
    answerIndex: 1,
    explanation: "The Feynman Technique focuses on explaining a topic simply as if teaching a child, highlighting where your own understanding breaks down."
  }
];

const GENERIC_CARDS = [
  { q: "Spaced Repetition", a: "A learning technique performed with flashcards where cards are reviewed at increasing intervals." },
  { q: "Active Retrieval", a: "The process of testing yourself to retrieve knowledge from memory, forming stronger neural connections." }
];

// Seed initial notebooks
const INITIAL_NOTEBOOKS = [
  {
    id: 'mitosis',
    name: '🧬 Cell Division (Mitosis)',
    sources: [
      {
        id: 'mit-1',
        name: 'Quantum Physics Intro.pdf',
        type: 'pdf',
        size: '2.4MB • Updated 2h ago',
        text: FALLBACK_SUMMARY,
        active: true
      },
      {
        id: 'mit-2',
        name: 'Stanford Lecture Notes',
        type: 'pdf',
        size: '842KB • Updated Yesterday',
        text: 'This document contains Stanford Lecture Notes on wave mechanics and wavefunction collapses.',
        active: true
      },
      {
        id: 'mit-3',
        name: 'React Architecture Design',
        type: 'text',
        size: 'Markdown • 3d ago',
        text: 'Markdown notes detailing React architecture designs and workspace viewport bindings.',
        active: true
      }
    ],
    chatHistory: [
      { sender: 'user', text: "Explain the observer effect in quantum mechanics and show the mathematical formulation for a wavefunction collapse." },
      { sender: 'ai', text: FALLBACK_SUMMARY }
    ],
    notes: [
      {
        id: 'note-mitosis-1',
        title: 'Study Notes',
        content: 'Wave-particle duality exists in all matter.\nThe observer effect states measurement alters the system.\nCollapse occurs when a superposition reduces to an eigenstate.',
        date: 'Updated 2h ago',
        sourceCount: 3
      }
    ],
    summaryData: FALLBACK_SUMMARY,
    quizQuestions: FALLBACK_QUIZ,
    flashcards: FALLBACK_CARDS,
    audioScript: [
      { speaker: "Aria", text: "Hey everyone, welcome to StudyLM Audio. I'm Aria, and today we're talking about cell division, specifically mitosis." },
      { speaker: "Liam", text: "And I'm Liam! Honestly, mitosis is like the copy machine of biology. One cell splits, and boom—you have two identical copies." }
    ]
  },
  {
    id: 'krebs',
    name: '🔄 Citric Acid Cycle (Krebs)',
    sources: [
      {
        id: 'krebs-1',
        name: 'Krebs Cycle Lecture.pdf',
        type: 'pdf',
        size: '12.8 KB',
        text: KREBS_CYCLE_SUMMARY,
        active: true
      }
    ],
    chatHistory: [
      { sender: 'ai', text: "Hello! I am your Socratic Study Guide for the Citric Acid Cycle. Let's begin: What molecule combines with acetyl-CoA to form citrate, and how many carbons does it have?" }
    ],
    notes: [
      {
        id: 'note-krebs-1',
        title: 'Krebs Notes',
        content: 'Per single Acetyl-CoA turn:\n- 3 NADH\n- 1 FADH2\n- 1 GTP\n- 2 CO2 molecules',
        date: 'Updated Yesterday',
        sourceCount: 1
      }
    ],
    summaryData: KREBS_CYCLE_SUMMARY,
    quizQuestions: KREBS_CYCLE_QUIZ,
    flashcards: KREBS_CYCLE_CARDS,
    audioScript: [
      { speaker: "Aria", text: "Welcome back. Today we're digesting the Citric Acid Cycle, or the Krebs Cycle. It sounds complex, but let's break it down." },
      { speaker: "Liam", text: "Yeah, the Krebs cycle takes place in the mitochondrial matrix. Think of it as the power-loading phase of respiration." }
    ]
  }
];

export default function Dashboard({ navigate }) {
  // Notebook States
  const [notebooks, setNotebooks] = useState(INITIAL_NOTEBOOKS);
  const [activeNotebookId, setActiveNotebookId] = useState('mitosis');

  // UI Views and Panel States
  const [activeView, setActiveView] = useState('chat'); // 'chat', 'study-guide', 'quiz', 'audio-overview', 'outline'
  const [activeNoteId, setActiveNoteId] = useState(null);
  const [isLeftPaneCollapsed, setIsLeftPaneCollapsed] = useState(false);
  const [isRightPaneCollapsed, setIsRightPaneCollapsed] = useState(true);
  const [isLeftSidebarOpen, setIsLeftSidebarOpen] = useState(true);
  const [rightPanelTab, setRightPanelTab] = useState('notes'); // 'notes', 'flashcards'

  // Modals
  const [showAddSourceModal, setShowAddSourceModal] = useState(false);
  const [addSourceTab, setAddSourceTab] = useState('pdf'); // 'pdf', 'video', 'text'
  const [showAnalyticsModal, setShowAnalyticsModal] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);
  const [showSettingsModal, setShowSettingsModal] = useState(false);

  // Inputs & Key
  const [apiKey, setApiKey] = useState('');
  const [showApiKey, setShowApiKey] = useState(false);
  const [videoUrl, setVideoUrl] = useState('');
  const [customTextTitle, setCustomTextTitle] = useState('');
  const [customTextContent, setCustomTextContent] = useState('');
  const [webSearchQuery, setWebSearchQuery] = useState('');
  const [parsingStatus, setParsingStatus] = useState('');

  // Socratic chat state
  const [socraticInput, setSocraticInput] = useState('');
  const [isSocraticTyping, setIsSocraticTyping] = useState(false);

  // Quiz active question state
  const [currentQuestionIdx, setCurrentQuestionIdx] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState({}); // { questionIdx: optionIdx }
  const [submittedAnswers, setSubmittedAnswers] = useState({}); // { questionIdx: true }

  // Flashcards active deck state
  const [cardIndex, setCardIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);

  // Generated Materials Loaders
  const [isLoadingSummary, setIsLoadingSummary] = useState(false);
  const [isLoadingQuiz, setIsLoadingQuiz] = useState(false);
  const [isLoadingCards, setIsLoadingCards] = useState(false);
  const [isLoadingAudio, setIsLoadingAudio] = useState(false);
  
  // Custom outlines (Studio)
  const [outlineTitle, setOutlineTitle] = useState('');
  const [outlineContent, setOutlineContent] = useState('');
  const [isLoadingOutline, setIsLoadingOutline] = useState(false);

  // Audio Overview Player states
  const [audioIsPlaying, setAudioIsPlaying] = useState(false);
  const [audioActiveLine, setAudioActiveLine] = useState(-1);
  const [audioPlaySpeed, setAudioPlaySpeed] = useState(1);

  // Refs
  const fileInputRef = useRef(null);
  const chatBottomRef = useRef(null);
  const synthRef = useRef(window.speechSynthesis);
  const utteranceRef = useRef(null);

  // Active Notebook reference helper
  const activeNotebook = notebooks.find(n => n.id === activeNotebookId) || notebooks[0];

  // Initialize activeNoteId
  useEffect(() => {
    if (activeNotebook && activeNotebook.notes.length > 0) {
      setActiveNoteId(activeNotebook.notes[0].id);
    } else {
      setActiveNoteId(null);
    }
  }, [activeNotebookId]);

  // Helper to update active notebook fields
  const updateActiveNotebook = (updatedFields) => {
    setNotebooks(prev => prev.map(n => {
      if (n.id === activeNotebookId) {
        return { ...n, ...updatedFields };
      }
      return n;
    }));
  };

  // Setup pdfjs global worker and handle search queries
  useEffect(() => {
    if (window.pdfjsLib) {
      window.pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.4.120/pdf.worker.min.js';
    }
    const savedKey = localStorage.getItem('studylm_gemini_key') || '';
    setApiKey(savedKey);

    // Read search query parameter
    const params = new URLSearchParams(window.location.search);
    const query = params.get('q');
    if (query) {
      const newId = 'notebook-query-' + Date.now();
      const querySource = {
        id: 'query-source',
        name: `Topic: "${query.substring(0, 15)}${query.length > 15 ? '...' : ''}"`,
        type: 'pdf',
        size: 'Search Input',
        text: `The user wants to study: "${query}". Please focus the study guides, questions, flashcards, and quizzes on this topic.`,
        active: true
      };

      const lowerQuery = query.toLowerCase();
      let summary = GENERIC_SUMMARY;
      let quiz = GENERIC_QUIZ;
      let cards = GENERIC_CARDS;

      if (lowerQuery.includes('krebs')) {
        summary = KREBS_CYCLE_SUMMARY;
        quiz = KREBS_CYCLE_QUIZ;
        cards = KREBS_CYCLE_CARDS;
      } else if (lowerQuery.includes('mitosis') || lowerQuery.includes('meiosis') || lowerQuery.includes('division') || lowerQuery.includes('cell')) {
        summary = FALLBACK_SUMMARY;
        quiz = FALLBACK_QUIZ;
        cards = FALLBACK_CARDS;
      }

      const initialSocraticPrompt = lowerQuery.includes('krebs') 
        ? `Hello! I am your Socratic Study Guide for the Krebs Cycle. I see you want to master this metabolic pathway. Let's begin: What is the primary molecule that enters the Krebs cycle, and where does it come from?`
        : `Hello! I am your Socratic Study Guide. I see you want to study: "${query}". Let's start with a core question: What do you already know about this topic?`;

      const newNotebook = {
        id: newId,
        name: `🔍 ${query.substring(0, 25)}${query.length > 25 ? '...' : ''}`,
        sources: [querySource],
        chatHistory: [{ sender: 'ai', text: initialSocraticPrompt }],
        notes: [
          {
            id: 'note-new-query',
            title: 'Study Notes',
            content: `Wave-particle duality exists in all matter.\nThe observer effect states measurement alters the system.\nCollapse occurs when a superposition reduces to an eigenstate.`,
            date: 'Just now',
            sourceCount: 1
          }
        ],
        summaryData: summary,
        quizQuestions: quiz,
        flashcards: cards,
        audioScript: []
      };

      setNotebooks(prev => [...prev, newNotebook]);
      setActiveNotebookId(newId);
      setActiveView('chat');
    }
  }, []);

  // Scroll to bottom of chat
  useEffect(() => {
    chatBottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [activeNotebook.chatHistory, isSocraticTyping]);

  // Audio clean-up on view change
  useEffect(() => {
    return () => {
      if (synthRef.current) {
        synthRef.current.cancel();
      }
    };
  }, [activeView, activeNotebookId]);

  const handleApiKeyChange = (e) => {
    const key = e.target.value.trim();
    setApiKey(key);
    localStorage.setItem('studylm_gemini_key', key);
  };

  // Notebook controllers
  const handleCreateNotebook = (name = "Untitled Notebook") => {
    const newId = 'notebook-' + Date.now();
    const newNotebook = {
      id: newId,
      name: name,
      sources: [],
      chatHistory: [
        { sender: 'ai', text: "Hello! I am your Socratic Study Guide. Add some sources in the Left Pane (PDF notes, Video links, or custom text) to customize my responses. What would you like to cover?" }
      ],
      notes: [
        {
          id: 'note-default-' + Date.now(),
          title: 'Study Notes',
          content: 'Start drafting your notes here...',
          date: 'Just now',
          sourceCount: 0
        }
      ],
      summaryData: '',
      quizQuestions: [],
      flashcards: [],
      audioScript: []
    };
    setNotebooks(prev => [...prev, newNotebook]);
    setActiveNotebookId(newId);
    setActiveView('chat');
    setActiveNoteId(newNotebook.notes[0].id);
  };

  const handleDeleteNotebook = (id, e) => {
    e.stopPropagation();
    if (notebooks.length === 1) {
      alert("You must keep at least one notebook.");
      return;
    }
    const confirmed = window.confirm("Are you sure you want to delete this notebook?");
    if (!confirmed) return;

    const remaining = notebooks.filter(n => n.id !== id);
    setNotebooks(remaining);
    if (activeNotebookId === id) {
      setActiveNotebookId(remaining[0].id);
      setActiveView('chat');
    }
  };

  // Helper function to query Gemini API via fetch
  const callGeminiAPI = async (systemInstruction, promptText) => {
    if (!apiKey) {
      throw new Error("No API key entered. Enter your Gemini API Key in the settings to activate real AI analysis.");
    }

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [{ parts: [{ text: promptText }] }],
          systemInstruction: { parts: [{ text: systemInstruction }] }
        })
      }
    );

    if (!response.ok) {
      const errorResponse = await response.json().catch(() => ({}));
      throw new Error(errorResponse?.error?.message || `API error (status: ${response.status})`);
    }

    const data = await response.json();
    return data.candidates?.[0]?.content?.parts?.[0]?.text || "";
  };

  // Combine texts from checked sources
  const getCombinedSourcesText = () => {
    const activeSources = activeNotebook.sources.filter(s => s.active);
    if (activeSources.length === 0) return "No active study materials selected.";
    return activeSources.map(s => `[SOURCE NAME: ${s.name}]\n[SOURCE TEXT]:\n${s.text}`).join('\n\n');
  };

  // Source checklist controllers
  const handleToggleSource = (id) => {
    const updated = activeNotebook.sources.map(s => s.id === id ? { ...s, active: !s.active } : s);
    updateActiveNotebook({ sources: updated });
  };

  const handleToggleAllSources = (checked) => {
    const updated = activeNotebook.sources.map(s => ({ ...s, active: checked }));
    updateActiveNotebook({ sources: updated });
  };

  const handleDeleteSource = (id) => {
    const updated = activeNotebook.sources.filter(s => s.id !== id);
    updateActiveNotebook({ sources: updated });
  };

  // Parse PDF file using pdf.js
  const handlePdfUpload = (e) => {
    const file = e.target.files[0];
    if (!file || file.type !== "application/pdf") {
      alert("Please upload a valid PDF document.");
      return;
    }

    setParsingStatus(`Reading PDF: "${file.name}"...`);
    const reader = new FileReader();

    reader.onload = async (event) => {
      try {
        const arrayBuffer = event.target.result;
        const pdf = await window.pdfjsLib.getDocument({ data: arrayBuffer }).promise;
        let extractedText = "";

        for (let i = 1; i <= pdf.numPages; i++) {
          const page = await pdf.getPage(i);
          const textContent = await page.getTextContent();
          const pageText = textContent.items.map(item => item.str).join(" ");
          extractedText += `\n--- PAGE ${i} ---\n` + pageText;
        }

        const sizeStr = (file.size / (1024 * 1024)).toFixed(2) + " MB";
        const newSource = {
          id: 'pdf-' + Date.now(),
          name: file.name,
          type: "pdf",
          size: sizeStr + " • Updated just now",
          text: extractedText,
          active: true
        };

        updateActiveNotebook({ sources: [...activeNotebook.sources, newSource] });
        setParsingStatus("");
        setShowAddSourceModal(false);
        alert(`Successfully parsed PDF "${file.name}" (${pdf.numPages} pages).`);
      } catch (err) {
        console.error("PDF Parsing Error:", err);
        setParsingStatus("");
        alert("Failed to parse PDF document. Ensure the PDF contains readable text.");
      }
    };

    reader.readAsArrayBuffer(file);
  };

  // Ingest Video URL Link
  const handleAddVideoLink = (e) => {
    e.preventDefault();
    if (!videoUrl.trim()) return;

    const newSource = {
      id: 'video-' + Date.now(),
      name: `Video: ${videoUrl.replace(/(^\w+:|^)\/\//, '').substring(0, 25)}...`,
      type: "video",
      size: "URL Link • Updated just now",
      text: `Context is a study lecture video available at: ${videoUrl}. Please help the user prepare materials related to standard academic topics mentioned in this video context.`,
      active: true
    };

    updateActiveNotebook({ sources: [...activeNotebook.sources, newSource] });
    setVideoUrl('');
    setShowAddSourceModal(false);
    alert("Video link added as a study context source.");
  };

  // Ingest Raw Text Notes
  const handleAddTextSource = (e) => {
    e.preventDefault();
    if (!customTextTitle.trim() || !customTextContent.trim()) {
      alert("Please fill in both the title and text content.");
      return;
    }

    const newSource = {
      id: 'text-' + Date.now(),
      name: `Text: ${customTextTitle.trim()}`,
      type: "text",
      size: `${(customTextContent.length / 1024).toFixed(2)} KB • Updated just now`,
      text: customTextContent.trim(),
      active: true
    };

    updateActiveNotebook({ sources: [...activeNotebook.sources, newSource] });
    setCustomTextTitle('');
    setCustomTextContent('');
    setShowAddSourceModal(false);
    alert("Text note added as a study context source.");
  };

  // Web search simulation or live Gemini summary creation
  const handleSearchWeb = async (e) => {
    e.preventDefault();
    if (!webSearchQuery.trim()) return;
    const query = webSearchQuery.trim();
    setParsingStatus(`Searching web for "${query}"...`);
    setWebSearchQuery('');

    if (apiKey) {
      try {
        const systemInstruction = `You are a web search reader. Write a highly detailed, fact-filled academic summary article about the topic: "${query}". Focus on providing core factual context, definitions, and mechanisms suitable for college study. Do not write chat responses, just write the article text.`;
        const prompt = `Write a study article about: ${query}`;
        const result = await callGeminiAPI(systemInstruction, prompt);
        
        const newSource = {
          id: 'web-' + Date.now(),
          name: `Web: ${query.substring(0, 15)}${query.length > 15 ? '...' : ''}`,
          type: 'web',
          size: 'Web Article • Just now',
          text: result,
          active: true
        };
        updateActiveNotebook({ sources: [...activeNotebook.sources, newSource] });
        alert(`Added web source for "${query}".`);
      } catch (err) {
        alert("Web search failed: " + err.message);
      } finally {
        setParsingStatus('');
      }
    } else {
      setTimeout(() => {
        const mockArticle = `## 🌐 Web Resource: ${query}
This is a web search result generated for "${query}".
It contains structural elements and biological pathway details.`;
        
        const newSource = {
          id: 'web-' + Date.now(),
          name: `Web: ${query.substring(0, 15)}${query.length > 15 ? '...' : ''}`,
          type: 'web',
          size: 'Web Resource • Just now',
          text: mockArticle,
          active: true
        };
        updateActiveNotebook({ sources: [...activeNotebook.sources, newSource] });
        setParsingStatus('');
        alert(`Added simulated web source for "${query}".`);
      }, 1500);
    }
  };

  // Notes update
  const handleUpdateNoteContent = (val) => {
    if (!activeNoteId) return;
    const updatedNotes = activeNotebook.notes.map(n => {
      if (n.id === activeNoteId) {
        return { ...n, content: val, date: 'Updated just now' };
      }
      return n;
    });
    updateActiveNotebook({ notes: updatedNotes });
  };

  const handleUpdateNoteTitle = (val) => {
    if (!activeNoteId) return;
    const updatedNotes = activeNotebook.notes.map(n => {
      if (n.id === activeNoteId) {
        return { ...n, title: val, date: 'Updated just now' };
      }
      return n;
    });
    updateActiveNotebook({ notes: updatedNotes });
  };

  const handleAddNewNote = () => {
    const newNote = {
      id: 'note-' + Date.now(),
      title: 'New Note',
      content: '',
      date: 'Just now',
      sourceCount: activeNotebook.sources.filter(s => s.active).length
    };
    updateActiveNotebook({ notes: [...activeNotebook.notes, newNote] });
    setActiveNoteId(newNote.id);
    setRightPanelTab('notes');
    setActiveView('edit-note');
  };

  const handleDeleteNote = (id) => {
    const updatedNotes = activeNotebook.notes.filter(n => n.id !== id);
    updateActiveNotebook({ notes: updatedNotes });
    if (activeNoteId === id) {
      if (updatedNotes.length > 0) {
        setActiveNoteId(updatedNotes[0].id);
      } else {
        setActiveNoteId(null);
      }
      setActiveView('chat');
    }
  };

  const handleSaveToNotes = (title, content) => {
    const newNote = {
      id: 'note-' + Date.now(),
      title: title,
      content: content,
      date: 'Just now',
      sourceCount: activeNotebook.sources.filter(s => s.active).length
    };
    updateActiveNotebook({ notes: [...activeNotebook.notes, newNote] });
    setActiveNoteId(newNote.id);
    setRightPanelTab('notes');
    alert(`Saved "${title}" to your study notes!`);
  };

  // ── Socratic Assistant Send ──
  const handleSocraticSend = async (e) => {
    e.preventDefault();
    if (!socraticInput.trim()) return;

    const userMessage = socraticInput.trim();
    const updatedChat = [...activeNotebook.chatHistory, { sender: 'user', text: userMessage }];
    
    updateActiveNotebook({ chatHistory: updatedChat });
    setSocraticInput('');
    setIsSocraticTyping(true);

    if (!apiKey) {
      setTimeout(() => {
        setIsSocraticTyping(false);
        let aiResponse = "The **observer effect** in quantum mechanics refers to changes that the act of observation makes on a quantum system. In its simplest form, measuring a property of a particle (like its position) forces the wavefunction to transition from a superposition of states into a single, definite eigenstate.\n\n|\\Psi\\rangle = \\sum_i c_i |\\phi_i\\rangle\nP(\\phi_n) = |\\langle\\phi_n|\\Psi\\rangle|^2 = |c_n|^2\n\n```python\nimport numpy as np\n\ndef simulate_collapse(wavefunction):\n    # Probability amplitudes\n    probabilities = np.abs(wavefunction)**2\n    # Choice based on distribution\n    observed_state = np.random.choice(len(wavefunction), p=probabilities)\n    return observed_state\n```";
        if (userMessage.toLowerCase().includes("mitosis") || userMessage.toLowerCase().includes("cell")) {
          aiResponse = "Mitosis splits somatic cells into 2 duplicate diploid cells. Let's write a python simulation:\n\n```python\ndef mitosis_split(cell_dna):\n    # Replicate DNA\n    copy1 = cell_dna.copy()\n    copy2 = cell_dna.copy()\n    return copy1, copy2\n```\nWhat is the role of spindle fibers in pulling the chromatids to opposite poles?";
        } else if (userMessage.toLowerCase().includes("krebs") || userMessage.toLowerCase().includes("citric")) {
          aiResponse = "The Krebs cycle oxidizes Acetyl-CoA (2 carbons) by combining it with Oxaloacetate (4 carbons) to form Citrate (6 carbons).\n\n\\text{Acetyl-CoA (2C)} + \\text{Oxaloacetate (4C)} \\rightarrow \\text{Citrate (6C)}\n\nWhat other electron carriers are generated per turn?";
        }
        updateActiveNotebook({ chatHistory: [...updatedChat, { sender: 'ai', text: aiResponse }] });
      }, 1200);
      return;
    }

    try {
      const systemInstruction = `You are a Socratic tutor. Your goal is to guide the user in learning the provided study materials. Do not give direct answers. Instead, ask thoughtful, guiding questions that lead the user to figure out the answer themselves. If they make a mistake, explain the gap in their understanding gently with an analogy, and follow up with a simpler question. Keep your tone encouraging and educational. Structure your responses with LaTeX math formulas (written with double backslashes) and code snippets.`;
      
      const combinedText = getCombinedSourcesText();
      const historyStr = updatedChat.map(m => `${m.sender === 'user' ? 'Student' : 'Tutor'}: ${m.text}`).join('\n');
      const prompt = `Uploaded study materials context:\n${combinedText}\n\nChat History:\n${historyStr}\n\nStudent's latest reply: "${userMessage}"\n\nTutor Socratic response:`;
      
      const response = await callGeminiAPI(systemInstruction, prompt);
      updateActiveNotebook({ chatHistory: [...updatedChat, { sender: 'ai', text: response }] });
    } catch (err) {
      updateActiveNotebook({ chatHistory: [...updatedChat, { sender: 'ai', text: "Error connecting to tutor: " + err.message }] });
    } finally {
      setIsSocraticTyping(false);
    }
  };

  const handleRegenerateLastChat = () => {
    if (activeNotebook.chatHistory.length <= 1) return;
    const history = [...activeNotebook.chatHistory];
    const lastUserMsgIndex = [...history].reverse().findIndex(m => m.sender === 'user');
    if (lastUserMsgIndex === -1) return;
    
    const actualIndex = history.length - 1 - lastUserMsgIndex;
    const lastUserMessageText = history[actualIndex].text;
    
    const trimmedHistory = history.slice(0, actualIndex);
    updateActiveNotebook({ chatHistory: trimmedHistory });
    
    setSocraticInput(lastUserMessageText);
    setTimeout(() => {
      const fakeEvent = { preventDefault: () => {} };
      handleSocraticSend(fakeEvent);
    }, 100);
  };

  // ── 1. GENERATE STUDY SUMMARY ──
  const triggerGenerateSummary = async () => {
    if (activeNotebook.sources.filter(s => s.active).length === 0) {
      alert("Please check or upload at least one source first.");
      return;
    }
    if (!apiKey) {
      if (activeNotebook.id === 'mitosis') {
        updateActiveNotebook({ summaryData: FALLBACK_SUMMARY });
      } else if (activeNotebook.id === 'krebs') {
        updateActiveNotebook({ summaryData: KREBS_CYCLE_SUMMARY });
      } else {
        updateActiveNotebook({ summaryData: GENERIC_SUMMARY });
      }
      alert("Loaded simulated study guide.");
      return;
    }

    setIsLoadingSummary(true);
    try {
      const systemInstruction = `You are an elite academic tutor. Analyze the provided study materials and write a highly detailed, comprehensive study guide. Format with clear headings, list key vocabulary terms with definitions, explain difficult concepts using concrete analogies, and output key takeaways. Output in clean Markdown format using GitHub alerts ([!NOTE] or [!IMPORTANT]) to emphasize core concepts.`;
      const combinedText = getCombinedSourcesText();
      const prompt = `Here are my study materials:\n\n${combinedText}\n\nPlease generate a thorough study guide.`;
      const result = await callGeminiAPI(systemInstruction, prompt);
      updateActiveNotebook({ summaryData: result });
    } catch (err) {
      alert("Failed to generate summary guide: " + err.message);
    } finally {
      setIsLoadingSummary(false);
    }
  };

  // ── 2. GENERATE ACTIVE RECALL QUIZ ──
  const triggerGenerateQuiz = async () => {
    if (activeNotebook.sources.filter(s => s.active).length === 0) {
      alert("Please check or upload at least one source first.");
      return;
    }
    if (!apiKey) {
      if (activeNotebook.id === 'mitosis') {
        updateActiveNotebook({ quizQuestions: FALLBACK_QUIZ });
      } else if (activeNotebook.id === 'krebs') {
        updateActiveNotebook({ quizQuestions: KREBS_CYCLE_QUIZ });
      } else {
        updateActiveNotebook({ quizQuestions: GENERIC_QUIZ });
      }
      setSelectedAnswers({});
      setSubmittedAnswers({});
      setCurrentQuestionIdx(0);
      alert("Loaded simulated test questions.");
      return;
    }

    setIsLoadingQuiz(true);
    try {
      const systemInstruction = `Generate 3 highly relevant multiple-choice questions based on the provided study materials to test the user's recall. Format the output in strict JSON so the UI can parse it. The JSON must be an array of objects. Do not wrap it in markdown code blocks. The JSON structure: [{"question": "...", "options": ["Option A", "Option B", "Option C", "Option D"], "answerIndex": 0, "explanation": "..."}]`;
      const combinedText = getCombinedSourcesText();
      const prompt = `Generate a JSON quiz array based on these materials:\n\n${combinedText}`;
      const resultText = await callGeminiAPI(systemInstruction, prompt);
      const cleanJson = resultText.replace(/```json/g, '').replace(/```/g, '').trim();
      const parsed = JSON.parse(cleanJson);
      
      if (Array.isArray(parsed) && parsed.length > 0) {
        updateActiveNotebook({ quizQuestions: parsed });
        setSelectedAnswers({});
        setSubmittedAnswers({});
        setCurrentQuestionIdx(0);
      } else {
        throw new Error("Invalid format returned by API.");
      }
    } catch (err) {
      alert("Failed to generate dynamic quiz: " + err.message + "\nFallback quiz loaded.");
      updateActiveNotebook({ quizQuestions: FALLBACK_QUIZ });
    } finally {
      setIsLoadingQuiz(false);
    }
  };

  // ── 3. GENERATE FLASHCARDS ──
  const triggerGenerateCards = async () => {
    if (activeNotebook.sources.filter(s => s.active).length === 0) {
      alert("Please check or upload at least one source first.");
      return;
    }
    if (!apiKey) {
      if (activeNotebook.id === 'mitosis') {
        updateActiveNotebook({ flashcards: FALLBACK_CARDS });
      } else if (activeNotebook.id === 'krebs') {
        updateActiveNotebook({ flashcards: KREBS_CYCLE_CARDS });
      } else {
        updateActiveNotebook({ flashcards: GENERIC_CARDS });
      }
      setCardIndex(0);
      setIsFlipped(false);
      alert("Loaded simulated flashcards.");
      return;
    }

    setIsLoadingCards(true);
    try {
      const systemInstruction = `Generate 4 core vocabulary terms and definitions from the provided study materials. Format the output in strict JSON so the UI can parse it. The JSON must be an array of objects. Do not wrap it in markdown code blocks. The JSON structure: [{"q": "Term", "a": "Detailed Definition"}]`;
      const combinedText = getCombinedSourcesText();
      const prompt = `Generate a JSON flashcards array based on these materials:\n\n${combinedText}`;
      const resultText = await callGeminiAPI(systemInstruction, prompt);
      const cleanJson = resultText.replace(/```json/g, '').replace(/```/g, '').trim();
      const parsed = JSON.parse(cleanJson);
      
      if (Array.isArray(parsed) && parsed.length > 0) {
        updateActiveNotebook({ flashcards: parsed });
        setCardIndex(0);
        setIsFlipped(false);
      } else {
        throw new Error("Invalid format returned by API.");
      }
    } catch (err) {
      alert("Failed to generate dynamic flashcards: " + err.message + "\nFallback flashcards loaded.");
      updateActiveNotebook({ flashcards: FALLBACK_CARDS });
    } finally {
      setIsLoadingCards(false);
    }
  };

  // ── 4. GENERATE AUDIO PODCAST OVERVIEW ──
  const triggerGenerateAudio = async () => {
    if (activeNotebook.sources.filter(s => s.active).length === 0) {
      alert("Please check or upload at least one source first.");
      return;
    }
    
    if (!apiKey) {
      if (activeNotebook.id === 'mitosis') {
        updateActiveNotebook({ audioScript: INITIAL_NOTEBOOKS[0].audioScript });
      } else if (activeNotebook.id === 'krebs') {
        updateActiveNotebook({ audioScript: INITIAL_NOTEBOOKS[1].audioScript });
      } else {
        const genericScript = [
          { speaker: "Aria", text: `Welcome to StudyLM Audio. Today we're looking at the material on ${activeNotebook.name}.` },
          { speaker: "Liam", text: "Yeah! It's a great topic. The sources outline key concepts and terminology." }
        ];
        updateActiveNotebook({ audioScript: genericScript });
      }
      alert("Loaded simulated audio overview dialogue script.");
      return;
    }

    setIsLoadingAudio(true);
    try {
      const systemInstruction = `You are a podcast writer. Generate a lively dialogue script between two hosts, Aria and Liam discussing the provided study materials. Structure as a JSON array of objects speaker and text. Do not output markdown code blocks.`;
      const combinedText = getCombinedSourcesText();
      const prompt = `Write a podcast script based on these materials:\n\n${combinedText}`;
      const resultText = await callGeminiAPI(systemInstruction, prompt);
      const cleanJson = resultText.replace(/```json/g, '').replace(/```/g, '').trim();
      const parsed = JSON.parse(cleanJson);
      
      if (Array.isArray(parsed) && parsed.length > 0) {
        updateActiveNotebook({ audioScript: parsed });
      } else {
        throw new Error("Invalid script structure returned.");
      }
    } catch (err) {
      alert("Failed to generate custom Audio Overview: " + err.message + "\nFallback script loaded.");
      updateActiveNotebook({ audioScript: INITIAL_NOTEBOOKS[0].audioScript });
    } finally {
      setIsLoadingAudio(false);
    }
  };

  // SpeechSynthesis Podcast playback
  const playAudioScript = (startIndex = 0) => {
    if (!activeNotebook.audioScript || activeNotebook.audioScript.length === 0) {
      triggerGenerateAudio();
      return;
    }
    synthRef.current?.cancel();
    if (window.audioMockTimeout) clearTimeout(window.audioMockTimeout);
    
    setAudioIsPlaying(true);
    let currentLine = startIndex;

    const speakNextLine = () => {
      if (currentLine >= activeNotebook.audioScript.length) {
        setAudioIsPlaying(false);
        setAudioActiveLine(-1);
        return;
      }
      setAudioActiveLine(currentLine);
      const lineData = activeNotebook.audioScript[currentLine];

      if (window.speechSynthesis) {
        const utterance = new SpeechSynthesisUtterance(lineData.text);
        utteranceRef.current = utterance;
        utterance.rate = audioPlaySpeed;

        const voices = window.speechSynthesis.getVoices();
        if (voices.length > 0) {
          const voiceFilter = lineData.speaker === 'Aria' ? 'female' : 'male';
          const voice = voices.find(v => v.name.toLowerCase().includes(voiceFilter));
          if (voice) utterance.voice = voice;
        }

        utterance.onend = () => {
          currentLine++;
          speakNextLine();
        };
        utterance.onerror = () => {
          window.audioMockTimeout = setTimeout(() => {
            currentLine++;
            speakNextLine();
          }, lineData.text.length * 60 + 1200);
        };
        synthRef.current.speak(utterance);
      } else {
        window.audioMockTimeout = setTimeout(() => {
          currentLine++;
          speakNextLine();
        }, lineData.text.length * 60 + 1200);
      }
    };
    speakNextLine();
  };

  const pauseAudioScript = () => {
    setAudioIsPlaying(false);
    synthRef.current?.cancel();
    if (window.audioMockTimeout) clearTimeout(window.audioMockTimeout);
  };

  // ── Studio outlines compiler ──
  const generateStudioMaterial = async (type) => {
    if (activeNotebook.sources.filter(s => s.active).length === 0) {
      alert("Please check or upload at least one source first.");
      return;
    }
    
    setActiveView('outline');
    setOutlineTitle(`${type.toUpperCase()} OUTLINE`);
    setOutlineContent('');
    
    if (!apiKey) {
      setTimeout(() => {
        let content = `## 📄 Simulated ${type}\n\nThis is a simulated ${type} generated from the active sources.`;
        if (type === 'Mind Map') {
          content = `## 🧠 Mind Map: ${activeNotebook.name}\n\n*   **Core Concept**\n    *   *Mechanism 1*: Secondary pathways and energetic controls.\n    *   *Mechanism 2*: Feedback loop regulations.`;
        } else if (type === 'Slide Deck') {
          content = `## 🎴 Slide Deck Outline: ${activeNotebook.name}\n\n### Slide 1: Introduction\n*   Topic Overview\n*   Significance and relevance`;
        } else if (type === 'Reports') {
          content = `## 📋 Briefing Report: ${activeNotebook.name}\n\n**Executive Summary**\nThis brief provides a structured overview.`;
        } else if (type === 'Data Table') {
          content = `## 📊 Data Table Summary: ${activeNotebook.name}\n\n| Concept | Definition | Key Role |\n|---|---|---|\n| Term A | Primary reactant/node | Initiates the pathway |`;
        }
        setOutlineContent(content);
      }, 1000);
      return;
    }

    setIsLoadingOutline(true);
    try {
      let systemInstruction = `You are a study designer. Generate study outline materials in clean Markdown for: ${type}.`;
      const combinedText = getCombinedSourcesText();
      const prompt = `Generate a ${type} based on these study materials:\n\n${combinedText}`;
      const result = await callGeminiAPI(systemInstruction, prompt);
      setOutlineContent(result);
    } catch (err) {
      alert(`Failed to generate ${type}: ` + err.message);
    } finally {
      setIsLoadingOutline(false);
    }
  };

  // Quick Action: Add text to study note editor
  const handleAddTextToNote = (text) => {
    if (!activeNoteId) return;
    const currentNote = activeNotebook.notes.find(n => n.id === activeNoteId);
    if (!currentNote) return;

    const separator = currentNote.content ? '\n\n' : '';
    const updatedContent = currentNote.content + separator + text.replace(/```python[\s\S]*?```/g, '').replace(/```[\s\S]*?```/g, '').substring(0, 300);
    handleUpdateNoteContent(updatedContent);
    alert("Response snippet added to study notes!");
  };

  return (
    <div className="flex h-screen bg-gray-50 text-gray-900 font-sans selection:bg-blue-100 overflow-hidden">
      
      {/* 1. LEFT NAVIGATION PANEL (Apple/Stripe Inspired Sidebar) */}
      <aside className={`transition-all duration-300 ease-in-out border-r border-gray-200 bg-gray-50 flex flex-col flex-shrink-0 ${isLeftSidebarOpen ? 'w-[280px]' : 'w-0 overflow-hidden border-none'}`}>
        {/* Workspace Header */}
        <div className="h-16 flex items-center px-6 shrink-0 mt-2">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-gray-900 flex items-center justify-center text-white shadow-sm">
              <span className="material-symbols-outlined text-[18px]">dataset</span>
            </div>
            <div>
              <h1 className="font-semibold text-gray-900 text-[14px]">Workspace</h1>
              <p className="text-[11px] text-gray-500 font-medium">StudyLM Environment</p>
            </div>
          </div>
        </div>

        {/* Sources List */}
        <div className="flex-1 overflow-y-auto px-4 py-6 custom-scrollbar">
          <div className="flex items-center justify-between text-[11px] font-semibold text-gray-500 mb-3 px-2 uppercase tracking-wide">
            Resources
            <button className="text-gray-400 hover:text-gray-700 transition-colors">
              <span className="material-symbols-outlined text-[16px]">add</span>
            </button>
          </div>
          
          <div className="space-y-1">
            <button className="w-full text-left px-3 py-2.5 rounded-lg flex items-center gap-3 hover:bg-gray-200/50 text-[13px] text-gray-600 hover:text-gray-900 transition-colors font-medium">
              <span className="material-symbols-outlined text-[18px] text-gray-400">description</span>
              <span className="truncate">Reference_Manual.pdf</span>
            </button>
            <button className="w-full text-left px-3 py-2.5 rounded-lg flex items-center gap-3 hover:bg-gray-200/50 text-[13px] text-gray-600 hover:text-gray-900 transition-colors font-medium">
              <span className="material-symbols-outlined text-[18px] text-gray-400">play_circle</span>
              <span className="truncate">Lecture Recording</span>
            </button>
            <button className="w-full text-left px-3 py-2.5 rounded-lg flex items-center gap-3 bg-white shadow-sm border border-gray-200 text-[13px] text-gray-900 transition-colors font-semibold">
              <span className="material-symbols-outlined text-[18px] text-blue-500">article</span>
              <span className="truncate">Active Knowledge Base</span>
            </button>
          </div>
        </div>
        
        {/* User Footer */}
        <div className="p-4 shrink-0">
          <button onClick={() => setView('landing')} className="w-full flex items-center gap-2 px-3 py-2 text-[13px] font-medium text-gray-500 hover:text-gray-900 hover:bg-gray-200/50 rounded-lg transition-colors">
            <span className="material-symbols-outlined text-[18px]">logout</span>
            Sign Out
          </button>
        </div>
      </aside>

      {/* 2. MAIN WORKSPACE */}
      <main className="flex-1 flex flex-col min-w-0 bg-white relative shadow-[0_0_40px_-15px_rgba(0,0,0,0.05)] z-10 border-x border-gray-200">
        
        {/* Header */}
        <header className="h-16 flex items-center justify-between px-6 shrink-0 border-b border-gray-100 bg-white z-20">
          <div className="flex items-center gap-4">
            <button onClick={() => setIsLeftSidebarOpen(!isLeftSidebarOpen)} className="text-gray-400 hover:text-gray-700 transition-colors flex items-center p-1 rounded-md hover:bg-gray-50">
              <span className="material-symbols-outlined text-[20px]">dock_to_right</span>
            </button>
            <div className="w-[1px] h-5 bg-gray-200"></div>
            
            <h2 className="text-[15px] font-semibold text-gray-800 tracking-tight">
              {activeNotebook?.title || 'Untitled Project'}
            </h2>
          </div>
          
          <div className="flex items-center">
            <button 
              onClick={() => setIsRightPaneCollapsed(!isRightPaneCollapsed)}
              className={`w-9 h-9 rounded-lg flex items-center justify-center transition-colors ${!isRightPaneCollapsed ? 'bg-blue-50 text-blue-600' : 'text-gray-400 hover:text-gray-700 hover:bg-gray-50'}`}
            >
              <span className="material-symbols-outlined text-[20px]">vertical_split</span>
            </button>
          </div>
        </header>

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto custom-scrollbar relative bg-white pb-32" id="chat-container">
          
          {activeNotebook?.chatHistory?.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center p-8 max-w-lg mx-auto">
               <div className="w-16 h-16 rounded-2xl bg-gray-50 border border-gray-100 flex items-center justify-center mb-6 shadow-sm">
                 <span className="material-symbols-outlined text-gray-400 text-[32px]">neurology</span>
               </div>
               <h2 className="text-xl font-semibold text-gray-900 mb-2">How can I assist?</h2>
               <p className="text-[14px] text-gray-500 mb-8 leading-relaxed">
                 Type a query below to interact with your sources, generate summaries, or construct study materials.
               </p>
               
               <div className="flex gap-3">
                 <button className="px-4 py-2 rounded-lg border border-gray-200 bg-white hover:bg-gray-50 text-[13px] font-medium text-gray-700 transition-colors shadow-sm flex items-center gap-2">
                   <span className="material-symbols-outlined text-[18px]">bolt</span>
                   Summarize
                 </button>
                 <button className="px-4 py-2 rounded-lg border border-gray-200 bg-white hover:bg-gray-50 text-[13px] font-medium text-gray-700 transition-colors shadow-sm flex items-center gap-2">
                   <span className="material-symbols-outlined text-[18px]">style</span>
                   Create Cards
                 </button>
               </div>
            </div>
          ) : (
            <div className="max-w-3xl mx-auto w-full px-6 py-8 space-y-8">
              {activeNotebook?.chatHistory?.map((msg, i) => (
                <div key={i} className={`flex w-full animate-fade-up ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`} style={{ animationDelay: `${i * 0.02}s` }}>
                  
                  {msg.sender === 'user' ? (
                    <div className="max-w-[75%] bg-gray-900 px-5 py-3.5 rounded-2xl rounded-tr-sm shadow-sm">
                      <p className="text-[14px] text-white font-medium leading-relaxed">{msg.text}</p>
                    </div>
                  ) : (
                    <div className="w-full max-w-[85%] flex gap-4 group">
                      {/* Avatar */}
                      <div className="w-8 h-8 rounded-full bg-blue-50 border border-blue-100 flex items-center justify-center shrink-0 mt-1">
                        <span className="material-symbols-outlined text-blue-600 text-[16px]">neurology</span>
                      </div>
                      
                      <div className="flex-1 min-w-0 flex flex-col gap-2 pt-1.5">
                        <div className="text-gray-800 text-[15px] leading-relaxed">
                          <MarkdownRenderer content={msg.text} />
                        </div>
                        
                        {/* Tools (Hidden until hover) */}
                        <div className="flex items-center gap-2 mt-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                          <button onClick={() => handleAddTextToNote(msg.text)} className="flex items-center gap-1.5 px-3 py-1.5 rounded-md border border-gray-200 bg-white hover:bg-gray-50 text-[12px] font-medium text-gray-600 transition-colors shadow-sm">
                            <span className="material-symbols-outlined text-[14px]">bookmark_add</span> Save Note
                          </button>
                          <button className="flex items-center justify-center w-8 h-8 rounded-md border border-gray-200 bg-white hover:bg-gray-50 text-gray-600 transition-colors shadow-sm">
                            <span className="material-symbols-outlined text-[14px]">content_copy</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Input Bar */}
        <div className="absolute bottom-0 w-full bg-gradient-to-t from-white via-white to-transparent pt-10 pb-6 px-6 z-30 pointer-events-none">
          <div className="max-w-3xl mx-auto pointer-events-auto">
            <div className="bg-white border border-gray-200 rounded-xl shadow-sm focus-within:border-gray-300 focus-within:shadow-md transition-all">
              <div className="flex items-end px-3 py-3 gap-2">
                <button className="w-9 h-9 flex items-center justify-center rounded-lg text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-colors shrink-0">
                  <span className="material-symbols-outlined text-[20px]">add</span>
                </button>
                
                <textarea
                  value={socraticInput}
                  onChange={(e) => setSocraticInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault();
                      handleSocraticSend();
                    }
                  }}
                  placeholder="Ask a question or type '/' for commands..."
                  className="flex-1 bg-transparent border-none text-[15px] text-gray-800 placeholder:text-gray-400 p-2 outline-none font-medium resize-none min-h-[40px] max-h-[200px]"
                  rows={1}
                />
                
                <button 
                  onClick={handleSocraticSend}
                  disabled={!socraticInput.trim()}
                  className={`w-9 h-9 flex items-center justify-center rounded-lg shrink-0 transition-all ${socraticInput.trim() ? 'bg-gray-900 text-white hover:bg-gray-800 shadow-sm' : 'bg-gray-100 text-gray-400 cursor-not-allowed'}`}
                >
                  <span className="material-symbols-outlined text-[18px]">arrow_upward</span>
                </button>
              </div>
            </div>
            <div className="text-center mt-3 text-[11px] text-gray-400 font-medium">
              Responses are generated by AI and may be inaccurate.
            </div>
          </div>
        </div>
      </main>

      {/* 3. RIGHT DETAIL PANEL */}
      <aside className={`transition-all duration-300 ease-in-out border-l border-gray-200 bg-gray-50 flex flex-col flex-shrink-0 z-20 ${!isRightPaneCollapsed ? 'w-[340px]' : 'w-0 overflow-hidden border-none'}`}>
        
        {/* Tabs */}
        <div className="h-16 flex items-center px-4 shrink-0 border-b border-gray-200/60 bg-gray-50">
          <div className="flex bg-gray-200/50 rounded-lg p-1 w-full border border-gray-200/50">
            <button
              onClick={() => setRightPanelTab('notes')}
              className={`flex-1 flex items-center justify-center gap-2 py-1.5 text-[12px] font-semibold rounded-md transition-all ${rightPanelTab === 'notes' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
            >
              Notes
            </button>
            <button
              onClick={() => setRightPanelTab('flashcards')}
              className={`flex-1 flex items-center justify-center gap-2 py-1.5 text-[12px] font-semibold rounded-md transition-all ${rightPanelTab === 'flashcards' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
            >
              Flashcards
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto custom-scrollbar">
          
          {rightPanelTab === 'notes' && (
            <div className="h-full flex flex-col p-6">
               <textarea 
                  className="flex-1 w-full bg-transparent border-none outline-none resize-none text-[14px] text-gray-700 placeholder:text-gray-400 leading-relaxed font-medium"
                  placeholder="Capture key insights here..."
                  value={activeNotebook?.notes?.find(n => n.id === activeNoteId)?.content || ''}
                  onChange={(e) => handleUpdateNoteContent(e.target.value)}
               />
            </div>
          )}

          {rightPanelTab === 'flashcards' && (
            <div className="p-6 space-y-4">
              <button className="w-full flex items-center justify-center gap-2 bg-white hover:bg-gray-50 border border-gray-200 text-gray-900 py-2.5 rounded-lg text-[13px] font-semibold shadow-sm transition-colors">
                <span className="material-symbols-outlined text-[18px]">sync</span>
                Generate Cards
              </button>
              
              <div className="space-y-4 pt-2">
                {(activeNotebook?.flashcards || []).map(fc => (
                  <div key={fc.id} className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm hover:shadow-md transition-shadow">
                    <span className="text-[11px] font-bold tracking-wider text-gray-400 uppercase block mb-2">Front</span>
                    <p className="text-[14px] font-medium text-gray-900 mb-4">{fc.q}</p>
                    
                    <div className="pt-3 border-t border-gray-100">
                      <span className="text-[11px] font-bold tracking-wider text-gray-400 uppercase block mb-2">Back</span>
                      <p className="text-[14px] text-gray-600">{fc.a}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </aside>

    </div>
  );
}
