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
  const [isRightPaneCollapsed, setIsRightPaneCollapsed] = useState(false);
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
    <div className="bg-background text-on-surface font-sans antialiased h-screen overflow-hidden flex flex-col select-none selection:bg-primary/10">
      
      {/* ── TOP NAV BAR ── */}
      <header className="flex justify-between items-center px-lg w-full fixed top-0 z-50 h-14 border-b border-outline-variant bg-white/80 backdrop-blur-xl">
        <div className="flex items-center gap-md">
          <span 
            className="font-headline-lg text-[24px] font-bold text-primary tracking-tight cursor-pointer"
            onClick={() => navigate('/')}
          >
            Aether IDE
          </span>
          <div className="hidden md:flex items-center gap-xl ml-xl">
            <button 
              onClick={() => { setActiveView('chat'); pauseAudioScript(); }} 
              className={`pb-4 mt-4 font-body-md text-body-md cursor-pointer border-b-2 transition-all ${activeView === 'chat' ? 'text-primary font-bold border-primary' : 'text-on-surface-variant font-medium border-transparent hover:text-primary'}`}
            >
              Workspace
            </button>
            <button 
              onClick={() => { setActiveView('study-guide'); triggerGenerateSummary(); }}
              className={`pb-4 mt-4 font-body-md text-body-md cursor-pointer border-b-2 transition-all ${activeView === 'study-guide' ? 'text-primary font-bold border-primary' : 'text-on-surface-variant font-medium border-transparent hover:text-primary'}`}
            >
              Library
            </button>
            <button 
              onClick={() => setShowAnalyticsModal(true)} 
              className="text-on-surface-variant font-medium hover:text-primary transition-colors pb-4 mt-4 font-body-md text-body-md cursor-pointer"
            >
              Analytics
            </button>
            <button 
              onClick={() => setShowSettingsModal(true)} 
              className="text-on-surface-variant font-medium hover:text-primary transition-colors pb-4 mt-4 font-body-md text-body-md cursor-pointer"
            >
              Settings
            </button>
          </div>
        </div>
        
        {/* Upgrade & Right-side action icons */}
        <div className="flex items-center gap-md">
          {/* Notebook picker inline */}
          <div className="hidden sm:flex items-center gap-1.5 bg-slate-50 border border-outline-variant px-2 py-1 rounded text-body-sm font-semibold">
            <span className="material-symbols-outlined text-[16px] text-on-surface-variant">folder_open</span>
            <select 
              value={activeNotebookId} 
              onChange={(e) => {
                setActiveNotebookId(e.target.value);
                setActiveView('chat');
                pauseAudioScript();
              }}
              className="bg-transparent border-none outline-none text-on-surface cursor-pointer py-0.5"
            >
              {notebooks.map(n => (
                <option key={n.id} value={n.id}>{n.name}</option>
              ))}
            </select>
          </div>

          <button 
            onClick={() => handleCreateNotebook()}
            className="bg-primary text-on-primary px-md py-sm rounded font-bold text-label-md hover:opacity-90 transition-opacity cursor-pointer shadow-sm shadow-primary/10"
          >
            Upgrade Pro
          </button>
          <div className="flex items-center gap-md">
            <span 
              onClick={() => alert("No new notifications")} 
              className="material-symbols-outlined text-on-surface-variant cursor-pointer hover:text-primary text-[22px]"
            >
              notifications
            </span>
            <span 
              onClick={() => { setActiveView('study-guide'); triggerGenerateSummary(); }} 
              className="material-symbols-outlined text-on-surface-variant cursor-pointer hover:text-primary text-[22px]"
              data-weight="fill"
            >
              auto_awesome
            </span>
            <span 
              onClick={() => setShowSettingsModal(true)} 
              className="material-symbols-outlined text-on-surface-variant cursor-pointer hover:text-primary text-[22px]"
            >
              account_circle
            </span>
          </div>
        </div>
      </header>

      {/* ── MAIN WORKSPACE BODY ── */}
      <div className="flex-grow flex relative overflow-hidden bg-white">
        
        {/* ══ COLUMN 1: LEFT SIDEBAR (SOURCES & FILES) ══ */}
        <aside 
          className={`h-full border-r border-outline-variant bg-surface-container-low pt-14 flex flex-col z-40 fixed left-0 top-0 transition-all duration-200 shrink-0 ${isLeftPaneCollapsed ? 'w-14' : 'w-[280px]'}`}
        >
          {isLeftPaneCollapsed ? (
            // Collapsed Left Sidebar
            <div className="flex flex-col items-center py-sm gap-sm flex-grow">
              <button 
                onClick={() => setIsLeftPaneCollapsed(false)}
                className="w-10 h-10 rounded hover:bg-surface-variant flex items-center justify-center text-on-surface-variant cursor-pointer"
                title="Expand sidepanel"
              >
                <span className="material-symbols-outlined text-[20px]">menu</span>
              </button>
              <div className="h-[1px] w-6 bg-outline-variant my-xs" />
              
              <button 
                onClick={() => setShowAddSourceModal(true)} 
                className="w-10 h-10 rounded bg-primary/10 text-primary flex items-center justify-center hover:bg-primary/20 cursor-pointer"
                title="Add New Source"
              >
                <span className="material-symbols-outlined text-[20px]">add</span>
              </button>
              
              <button 
                onClick={() => { setActiveView('chat'); setIsLeftPaneCollapsed(false); }} 
                className="w-10 h-10 rounded hover:bg-surface-variant flex items-center justify-center text-on-surface-variant cursor-pointer"
                title="Workspace Chat"
              >
                <span className="material-symbols-outlined text-[20px]">forum</span>
              </button>

              <button 
                onClick={() => { setActiveView('study-guide'); setIsLeftPaneCollapsed(false); triggerGenerateSummary(); }} 
                className="w-10 h-10 rounded hover:bg-surface-variant flex items-center justify-center text-on-surface-variant cursor-pointer"
                title="Study Guides"
              >
                <span className="material-symbols-outlined text-[20px]">edit_note</span>
              </button>
            </div>
          ) : (
            // Expanded Left Sidebar
            <div className="p-md flex flex-col gap-sm overflow-y-auto flex-grow">
              
              {/* Header section with collapse controls */}
              <div className="flex items-center justify-between mb-sm mt-sm">
                <h2 className="font-bold text-label-sm uppercase tracking-wider text-on-surface-variant/70">Sources</h2>
                <div className="flex items-center gap-xs">
                  <button 
                    onClick={() => setShowAddSourceModal(true)} 
                    className="flex items-center gap-xs text-primary bg-primary/5 px-sm py-1 rounded border border-primary/20 hover:bg-primary/10 transition-all text-label-sm font-bold cursor-pointer"
                  >
                    <span className="material-symbols-outlined text-[16px]">add</span>
                    New Source
                  </button>
                  <button 
                    onClick={() => setIsLeftPaneCollapsed(true)} 
                    className="p-1 hover:bg-surface-variant rounded text-on-surface-variant cursor-pointer flex items-center"
                    title="Collapse Left Sidebar"
                  >
                    <span className="material-symbols-outlined text-[18px]">keyboard_double_arrow_left</span>
                  </button>
                </div>
              </div>

              {/* Navigation lists */}
              <nav className="flex flex-col gap-xs">
                <div 
                  onClick={() => { setActiveView('chat'); }} 
                  className={`flex items-center gap-sm p-sm rounded cursor-pointer transition-all duration-150 ${activeView === 'chat' ? 'bg-primary text-white font-bold' : 'text-on-surface-variant hover:bg-surface-variant'}`}
                >
                  <span className="material-symbols-outlined text-[20px]">folder_open</span>
                  <span className="truncate">Sources</span>
                </div>
                <div 
                  onClick={() => { setActiveView('chat'); }} 
                  className={`flex items-center gap-sm p-sm rounded text-on-surface-variant hover:bg-surface-variant cursor-pointer transition-all duration-150`}
                >
                  <span className="material-symbols-outlined text-[20px]">forum</span>
                  <span className="truncate">Active Chat</span>
                </div>
                <div 
                  onClick={() => { setRightPanelTab('notes'); setActiveView('edit-note'); }} 
                  className={`flex items-center gap-sm p-sm rounded text-on-surface-variant hover:bg-surface-variant cursor-pointer transition-all duration-150`}
                >
                  <span className="material-symbols-outlined text-[20px]">edit_note</span>
                  <span className="truncate">Drafts</span>
                </div>
                <div 
                  onClick={() => { generateStudioMaterial('Reports'); }} 
                  className={`flex items-center gap-sm p-sm rounded text-on-surface-variant hover:bg-surface-variant cursor-pointer transition-all duration-150`}
                >
                  <span className="material-symbols-outlined text-[20px]">format_quote</span>
                  <span className="truncate">Citations</span>
                </div>
                <div 
                  onClick={() => { setRightPanelTab('flashcards'); }} 
                  className={`flex items-center gap-sm p-sm rounded text-on-surface-variant hover:bg-surface-variant cursor-pointer transition-all duration-150`}
                >
                  <span className="material-symbols-outlined text-[20px]">quiz</span>
                  <span className="truncate">Flashcards</span>
                </div>
              </nav>

              {/* Ingestion status spinner */}
              {parsingStatus && (
                <div className="text-[11px] text-amber-600 bg-amber-50 border border-amber-200/50 p-2.5 rounded flex items-center gap-2 font-mono">
                  <span className="material-symbols-outlined text-[14px] animate-spin">refresh</span>
                  {parsingStatus}
                </div>
              )}

              {/* Web search source form */}
              <form onSubmit={handleSearchWeb} className="flex gap-2 bg-white border border-outline-variant p-1.5 rounded focus-within:border-primary transition-all mt-sm">
                <input 
                  type="text" 
                  value={webSearchQuery}
                  onChange={(e) => setWebSearchQuery(e.target.value)}
                  placeholder="Search web sources..."
                  className="flex-grow bg-transparent border-none outline-none text-body-sm py-1 px-1.5"
                />
                <button type="submit" className="bg-primary/10 hover:bg-primary/25 text-primary p-1 rounded transition-all flex items-center justify-center cursor-pointer">
                  <span className="material-symbols-outlined text-[16px]">search</span>
                </button>
              </form>

              {/* Recent Documents Section */}
              <div className="mt-md border-t border-outline-variant pt-md">
                <div className="text-label-sm font-bold text-on-surface-variant/70 mb-sm px-sm uppercase tracking-wider">Recent Documents</div>
                <div className="space-y-1 max-h-56 overflow-y-auto">
                  {activeNotebook.sources.map(src => (
                    <div 
                      key={src.id}
                      className="group flex items-center justify-between p-sm rounded hover:bg-surface-variant transition-colors cursor-pointer"
                      onClick={() => {
                        handleToggleSource(src.id);
                        alert(`${src.active ? 'Disabled' : 'Enabled'} source context: "${src.name}"`);
                      }}
                    >
                      <div className="flex items-center gap-sm min-w-0 flex-grow">
                        <span className={`material-symbols-outlined text-on-surface-variant text-[20px] shrink-0 ${src.active ? 'text-primary' : ''}`}>
                          {src.type === 'pdf' ? 'description' : src.type === 'video' ? 'movie' : 'terminal'}
                        </span>
                        <div className="flex-grow min-w-0">
                          <p className={`truncate text-body-md font-medium ${src.active ? 'text-primary font-semibold' : 'text-on-surface'}`}>{src.name}</p>
                          <p className="text-[11px] text-on-surface-variant/60">{src.size}</p>
                        </div>
                      </div>
                      <span 
                        onClick={(e) => { e.stopPropagation(); handleDeleteSource(src.id); }}
                        className="material-symbols-outlined text-[16px] text-on-surface-variant/40 hover:text-red-500 opacity-0 group-hover:opacity-100 p-0.5 rounded cursor-pointer"
                        title="Delete source"
                      >
                        delete
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Sidebar Footer storage capacity meter */}
              <div className="mt-auto border-t border-outline-variant pt-md">
                <div className="mb-md">
                  <div className="flex justify-between text-[11px] font-bold text-on-surface-variant/70 mb-1">
                    <span>STORAGE USED</span>
                    <span>85%</span>
                  </div>
                  <div className="h-1.5 w-full bg-surface-variant rounded-full overflow-hidden">
                    <div className="h-full bg-primary w-[85%]"></div>
                  </div>
                </div>
                
                <div className="flex flex-col gap-sm">
                  <div 
                    onClick={() => alert("StudyLM Socratic AI Workspace. Drag & Drop PDF slides to study concepts.")}
                    className="flex items-center gap-sm text-body-sm font-medium text-on-surface-variant hover:text-primary cursor-pointer transition-all"
                  >
                    <span className="material-symbols-outlined text-[20px]">help_outline</span>
                    Help
                  </div>
                  <div 
                    onClick={() => alert("Send study questions or feature requests to contact@studylm.com")}
                    className="flex items-center gap-sm text-body-sm font-medium text-on-surface-variant hover:text-primary cursor-pointer transition-all"
                  >
                    <span className="material-symbols-outlined text-[20px]">chat_bubble_outline</span>
                    Feedback
                  </div>
                </div>
              </div>

            </div>
          )}
        </aside>

        {/* ══ COLUMN 2: CENTER WORKSPACE AREA ══ */}
        <main 
          className="pt-14 h-screen flex flex-col relative overflow-hidden bg-white transition-all duration-200"
          style={{ 
            marginLeft: isLeftPaneCollapsed ? '56px' : '280px', 
            marginRight: isRightPaneCollapsed ? '56px' : '320px' 
          }}
        >
          {/* Header toolbar for other studio views (quizzes, guides, outlines, podcasts) */}
          {activeView !== 'chat' && (
            <div className="h-12 border-b border-outline-variant px-md flex justify-between items-center bg-slate-50 shrink-0">
              <div className="flex items-center gap-sm">
                <span className="w-2.5 h-2.5 rounded-full bg-primary animate-pulse" />
                <span className="font-bold text-label-md text-on-surface">
                  {activeView === 'study-guide' && 'Study Guide Outline'}
                  {activeView === 'quiz' && 'Recall Practice Quiz'}
                  {activeView === 'audio-overview' && 'Hosts Audio Podcast'}
                  {activeView === 'outline' && outlineTitle}
                  {activeView === 'edit-note' && 'Saved Note Editor'}
                </span>
              </div>
              <button 
                onClick={() => { setActiveView('chat'); pauseAudioScript(); }}
                className="text-label-sm font-bold text-primary hover:underline flex items-center gap-xs cursor-pointer"
              >
                <span className="material-symbols-outlined text-[16px]">arrow_back</span>
                Back to Workspace Chat
              </button>
            </div>
          )}

          {/* Active Viewport content panel */}
          <div className="flex-grow overflow-y-auto px-xl py-xl flex flex-col gap-xl pb-28">
            
            {/* VIEW 1: Socratic Chat Area */}
            {activeView === 'chat' && (
              <div className="flex flex-col gap-lg">
                {activeNotebook.chatHistory.map((msg, idx) => (
                  <div key={idx}>
                    {msg.sender === 'user' ? (
                      // User message structure
                      <div className="flex justify-end">
                        <div className="max-w-[80%] bg-surface-container-low p-md rounded-xl rounded-tr-none border border-outline-variant shadow-sm">
                          <p className="text-body-md text-on-surface leading-relaxed">{msg.text}</p>
                        </div>
                      </div>
                    ) : (
                      // AI message structure
                      <div className="flex justify-start gap-md">
                        {/* Auto_awesome icon box */}
                        <div className="w-8 h-8 rounded bg-primary flex items-center justify-center shrink-0">
                          <span className="material-symbols-outlined text-white text-[20px]" data-weight="fill">auto_awesome</span>
                        </div>
                        {/* Bubble containing text, math formulation, code block, citations */}
                        <div className="max-w-[85%] flex flex-col gap-md">
                          <div className="bg-white border border-outline-variant p-lg rounded-xl rounded-tl-none ai-glow">
                            <MarkdownRenderer content={msg.text} />
                            
                            {/* Injected citations list */}
                            {activeNotebook.sources.filter(s => s.active).length > 0 && (
                              <div className="flex flex-wrap gap-sm mt-md">
                                {activeNotebook.sources.filter(s => s.active).map((src, sIdx) => (
                                  <div 
                                    key={sIdx}
                                    className="flex items-center gap-xs bg-surface-container-low px-sm py-1 rounded border border-outline-variant text-[11px] font-bold text-primary cursor-pointer hover:bg-primary/5 transition-colors"
                                    onClick={() => alert(`Sourced from ingested file: "${src.name}"`)}
                                  >
                                    <span className="material-symbols-outlined text-[14px]">link</span>
                                    Citation: {src.name}
                                  </div>
                                ))}
                              </div>
                            )}
                          </div>

                          {/* Quick Actions for AI response */}
                          <div className="flex gap-sm">
                            <button 
                              onClick={() => handleCopyText(msg.text)}
                              className="p-xs hover:bg-surface-variant rounded transition-colors cursor-pointer" 
                              title="Copy response"
                            >
                              <span className="material-symbols-outlined text-[20px] text-on-surface-variant">content_copy</span>
                            </button>
                            <button 
                              onClick={handleRegenerateLastChat}
                              className="p-xs hover:bg-surface-variant rounded transition-colors cursor-pointer" 
                              title="Regenerate"
                            >
                              <span className="material-symbols-outlined text-[20px] text-on-surface-variant">refresh</span>
                            </button>
                            <button 
                              onClick={() => handleAddTextToNote(msg.text)}
                              className="p-xs hover:bg-surface-variant rounded transition-colors cursor-pointer" 
                              title="Add response to notes"
                            >
                              <span className="material-symbols-outlined text-[20px] text-on-surface-variant">note_add</span>
                            </button>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                ))}

                {isSocraticTyping && (
                  <div className="flex justify-start gap-md">
                    <div className="w-8 h-8 rounded bg-primary flex items-center justify-center shrink-0">
                      <span className="material-symbols-outlined text-white text-[20px]" data-weight="fill">auto_awesome</span>
                    </div>
                    <div className="bg-white border border-outline-variant p-md rounded-xl rounded-tl-none ai-glow flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-primary/60 animate-bounce" style={{ animationDelay: '0ms' }} />
                      <span className="w-2 h-2 rounded-full bg-primary/60 animate-bounce" style={{ animationDelay: '150ms' }} />
                      <span className="w-2 h-2 rounded-full bg-primary/60 animate-bounce" style={{ animationDelay: '300ms' }} />
                    </div>
                  </div>
                )}
                
                <div ref={chatBottomRef} />
              </div>
            )}

            {/* VIEW 2: Study Guide Summary outline */}
            {activeView === 'study-guide' && (
              <div className="max-w-2xl mx-auto flex flex-col gap-6">
                <div className="flex justify-between items-center bg-surface-container-low p-md border border-outline-variant rounded-lg">
                  <span className="text-body-sm font-semibold text-on-surface-variant/80">Deep study guide compiled from sources.</span>
                  <div className="flex gap-2">
                    <button 
                      onClick={triggerGenerateSummary} 
                      className="bg-primary text-on-primary px-3 py-1.5 rounded font-bold text-label-sm hover:opacity-90 cursor-pointer"
                      disabled={isLoadingSummary}
                    >
                      {isLoadingSummary ? "Generating..." : "🔄 Re-generate"}
                    </button>
                    {activeNotebook.summaryData && (
                      <button 
                        onClick={() => handleSaveToNotes("Study Guide Summary", activeNotebook.summaryData)}
                        className="bg-white border border-outline text-on-surface px-3 py-1.5 rounded font-bold text-label-sm hover:bg-surface-variant cursor-pointer"
                      >
                        Save to Notes
                      </button>
                    )}
                  </div>
                </div>
                <div className="bg-white border border-outline-variant p-lg rounded-xl ai-glow">
                  {isLoadingSummary ? (
                    <div className="space-y-4">
                      <div className="h-4 bg-surface-variant rounded w-3/4 animate-pulse" />
                      <div className="h-4 bg-surface-variant rounded w-full animate-pulse" />
                      <div className="h-4 bg-surface-variant rounded w-5/6 animate-pulse" />
                    </div>
                  ) : activeNotebook.summaryData ? (
                    <MarkdownRenderer content={activeNotebook.summaryData} />
                  ) : (
                    <p className="text-center text-on-surface-variant py-8">Click re-generate to parse summaries.</p>
                  )}
                </div>
              </div>
            )}

            {/* VIEW 3: Recall Quiz */}
            {activeView === 'quiz' && (
              <div className="max-w-2xl mx-auto flex flex-col gap-md">
                <div className="flex justify-between items-center bg-surface-container-low p-md border border-outline-variant rounded-lg">
                  <span className="text-body-sm font-bold text-on-surface-variant">Active recall quiz practice.</span>
                  <button 
                    onClick={triggerGenerateQuiz}
                    className="bg-primary text-on-primary px-3 py-1.5 rounded font-bold text-label-sm hover:opacity-90 cursor-pointer"
                    disabled={isLoadingQuiz}
                  >
                    {isLoadingQuiz ? "Drafting..." : "🔄 Re-generate Quiz"}
                  </button>
                </div>

                {isLoadingQuiz ? (
                  <div className="bg-white border border-outline-variant p-8 rounded-xl text-center flex flex-col items-center gap-2">
                    <span className="material-symbols-outlined text-[32px] text-primary animate-spin">refresh</span>
                    <p className="text-body-md font-bold text-on-surface-variant">Compiling recall questions...</p>
                  </div>
                ) : activeNotebook.quizQuestions.length > 0 ? (
                  <div className="bg-white border border-outline-variant p-lg rounded-xl ai-glow flex flex-col gap-lg">
                    <div>
                      <div className="flex justify-between text-label-sm font-bold text-on-surface-variant mb-1.5">
                        <span>QUESTION {currentQuestionIdx + 1} OF {activeNotebook.quizQuestions.length}</span>
                        <span>SCORE: {Object.keys(submittedAnswers).filter(idx => activeNotebook.quizQuestions[idx]?.answerIndex === selectedAnswers[idx]).length} / {Object.keys(submittedAnswers).length}</span>
                      </div>
                      <div className="h-1.5 w-full bg-surface-variant rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-primary transition-all duration-300"
                          style={{ width: `${((currentQuestionIdx + 1) / activeNotebook.quizQuestions.length) * 100}%` }}
                        />
                      </div>
                    </div>

                    <h3 className="font-bold text-headline-sm text-on-surface">
                      {activeNotebook.quizQuestions[currentQuestionIdx]?.question}
                    </h3>

                    <div className="flex flex-col gap-sm">
                      {activeNotebook.quizQuestions[currentQuestionIdx]?.options.map((opt, optIdx) => {
                        const isSubmitted = submittedAnswers[currentQuestionIdx];
                        const selectedOpt = selectedAnswers[currentQuestionIdx];
                        const isSelected = selectedOpt === optIdx;
                        const isCorrect = activeNotebook.quizQuestions[currentQuestionIdx]?.answerIndex === optIdx;

                        let borderCl = 'border-outline-variant hover:bg-surface-variant';
                        let bgCl = 'bg-white';
                        let textCl = 'text-on-surface';

                        if (isSelected) {
                          borderCl = 'border-primary';
                          bgCl = 'bg-primary/5';
                        }
                        if (isSubmitted) {
                          if (isCorrect) {
                            borderCl = 'border-emerald-500';
                            bgCl = 'bg-emerald-50';
                            textCl = 'text-emerald-800 font-semibold';
                          } else if (isSelected) {
                            borderCl = 'border-red-500';
                            bgCl = 'bg-red-50';
                            textCl = 'text-red-800 font-semibold';
                          }
                        }

                        return (
                          <button
                            key={optIdx}
                            onClick={() => {
                              if (isSubmitted) return;
                              setSelectedAnswers(prev => ({ ...prev, [currentQuestionIdx]: optIdx }));
                            }}
                            className={`w-full text-left p-md border rounded-xl flex items-center gap-md text-body-md transition-all cursor-pointer ${borderCl} ${bgCl} ${textCl}`}
                            disabled={isSubmitted}
                          >
                            <span className={`w-6 h-6 rounded-full flex items-center justify-center font-bold text-xs shrink-0 ${isSelected ? 'bg-primary text-white' : 'bg-surface-variant text-on-surface-variant'}`}>
                              {String.fromCharCode(65 + optIdx)}
                            </span>
                            <span>{opt}</span>
                          </button>
                        );
                      })}
                    </div>

                    {submittedAnswers[currentQuestionIdx] && (
                      <div className="bg-surface-container-low p-md border border-outline-variant rounded">
                        <p className="text-body-sm leading-relaxed">{activeNotebook.quizQuestions[currentQuestionIdx]?.explanation}</p>
                      </div>
                    )}

                    <div className="flex justify-between items-center border-t border-outline-variant pt-md">
                      <button 
                        onClick={() => setCurrentQuestionIdx(prev => prev - 1)}
                        disabled={currentQuestionIdx === 0}
                        className="bg-white border border-outline text-on-surface px-md py-sm rounded font-bold text-label-md hover:bg-surface-variant cursor-pointer disabled:opacity-50"
                      >
                        Previous
                      </button>
                      
                      {!submittedAnswers[currentQuestionIdx] && selectedAnswers[currentQuestionIdx] !== undefined && (
                        <button 
                          onClick={() => setSubmittedAnswers(prev => ({ ...prev, [currentQuestionIdx]: true }))}
                          className="bg-primary text-on-primary px-lg py-sm rounded font-bold text-label-md hover:opacity-90 cursor-pointer"
                        >
                          Submit Answer
                        </button>
                      )}

                      <button 
                        onClick={() => setCurrentQuestionIdx(prev => prev + 1)}
                        disabled={currentQuestionIdx === activeNotebook.quizQuestions.length - 1}
                        className="bg-white border border-outline text-on-surface px-md py-sm rounded font-bold text-label-md hover:bg-surface-variant cursor-pointer disabled:opacity-50"
                      >
                        Next
                      </button>
                    </div>

                  </div>
                ) : (
                  <p className="text-center text-on-surface-variant py-8">Click re-generate to parse quiz questions.</p>
                )}
              </div>
            )}

            {/* VIEW 4: Audio Podcast overview */}
            {activeView === 'audio-overview' && (
              <div className="max-w-2xl mx-auto flex flex-col gap-lg">
                <div className="flex justify-between items-center bg-surface-container-low p-md border border-outline-variant rounded-lg">
                  <span className="text-body-sm font-semibold text-on-surface-variant">Aria & Liam Podcast overview co-hosts.</span>
                  <button 
                    onClick={triggerGenerateAudio}
                    className="bg-primary text-on-primary px-3 py-1.5 rounded font-bold text-label-sm hover:opacity-90 cursor-pointer"
                    disabled={isLoadingAudio}
                  >
                    {isLoadingAudio ? "Writing..." : "🔄 Re-generate Podcast"}
                  </button>
                </div>

                {isLoadingAudio ? (
                  <div className="bg-white border border-outline-variant p-8 rounded-xl text-center flex flex-col items-center gap-2">
                    <span className="material-symbols-outlined text-[32px] text-primary animate-spin">refresh</span>
                    <p className="text-body-md font-bold text-on-surface-variant">Drafting banter dialogue script...</p>
                  </div>
                ) : activeNotebook.audioScript.length > 0 ? (
                  <div className="flex flex-col gap-md">
                    
                    {/* Visual Player card */}
                    <div className="bg-white border border-outline-variant p-lg rounded-xl flex flex-col gap-lg ai-glow">
                      
                      <div className="flex justify-around items-center">
                        <div className="flex flex-col items-center gap-sm">
                          <div className={`w-12 h-12 rounded-full flex items-center justify-center font-bold text-white transition-all ${audioIsPlaying && activeNotebook.audioScript[audioActiveLine]?.speaker === 'Aria' ? 'bg-primary scale-110 shadow-lg shadow-primary/25' : 'bg-slate-400'}`}>A</div>
                          <span className="text-body-sm font-bold text-on-surface">Aria</span>
                        </div>
                        
                        <div className="flex items-end gap-1 h-6">
                          {[4, 8, 3, 6, 9, 2].map((h, i) => (
                            <span 
                              key={i} 
                              className={`w-1 bg-primary/60 rounded-full transition-all duration-300 ${audioIsPlaying ? 'animate-bounce' : 'h-1'}`}
                              style={{ 
                                height: audioIsPlaying ? `${h * 2}px` : '3px',
                                animationDelay: `${i * 100}ms`
                              }}
                            />
                          ))}
                        </div>

                        <div className="flex flex-col items-center gap-sm">
                          <div className={`w-12 h-12 rounded-full flex items-center justify-center font-bold text-white transition-all ${audioIsPlaying && activeNotebook.audioScript[audioActiveLine]?.speaker === 'Liam' ? 'bg-indigo-600 scale-110 shadow-lg shadow-indigo-600/25' : 'bg-slate-400'}`}>L</div>
                          <span className="text-body-sm font-bold text-on-surface">Liam</span>
                        </div>
                      </div>

                      <div className="bg-slate-50 border border-outline-variant p-md rounded-lg flex flex-col gap-sm">
                        <div className="flex justify-between items-center">
                          {audioIsPlaying ? (
                            <button 
                              onClick={pauseAudioScript}
                              className="bg-indigo-600 text-white px-md py-sm rounded-full font-bold text-label-md hover:opacity-90 flex items-center gap-xs cursor-pointer shadow-md shadow-indigo-600/10"
                            >
                              <span className="material-symbols-outlined text-[18px]">pause</span>
                              Pause Podcast
                            </button>
                          ) : (
                            <button 
                              onClick={() => playAudioScript(audioActiveLine >= 0 ? audioActiveLine : 0)}
                              className="bg-primary text-on-primary px-md py-sm rounded-full font-bold text-label-md hover:opacity-90 flex items-center gap-xs cursor-pointer shadow-md shadow-primary/10"
                            >
                              <span className="material-symbols-outlined text-[18px]">play_arrow</span>
                              Play Podcast
                            </button>
                          )}

                          <select 
                            value={audioPlaySpeed}
                            onChange={(e) => {
                              const speed = parseFloat(e.target.value);
                              setAudioPlaySpeed(speed);
                              if (audioIsPlaying) playAudioScript(audioActiveLine);
                            }}
                            className="bg-white border border-outline px-sm py-1 rounded text-body-sm cursor-pointer"
                          >
                            <option value="0.8">0.8x Speed</option>
                            <option value="1">1.0x Speed</option>
                            <option value="1.2">1.2x Speed</option>
                          </select>
                        </div>

                        {audioActiveLine >= 0 && (
                          <div className="flex flex-col gap-1 mt-xs">
                            <div className="h-1 w-full bg-slate-200 rounded-full overflow-hidden">
                              <div className="h-full bg-primary" style={{ width: `${((audioActiveLine + 1) / activeNotebook.audioScript.length) * 100}%` }} />
                            </div>
                            <span className="text-[10px] text-on-surface-variant font-mono">Segment {audioActiveLine + 1} of {activeNotebook.audioScript.length}</span>
                          </div>
                        )}
                      </div>

                    </div>

                    {/* Scrolling dialogue transcript cards */}
                    <div className="bg-white border border-outline-variant p-md rounded-xl flex flex-col gap-sm max-h-72 overflow-y-auto">
                      {activeNotebook.audioScript.map((line, idx) => (
                        <div 
                          key={idx}
                          onClick={() => playAudioScript(idx)}
                          className={`p-sm rounded border transition-all cursor-pointer text-left text-body-md ${audioActiveLine === idx ? 'border-primary bg-primary/[0.02] font-semibold' : 'border-transparent hover:bg-surface-variant'}`}
                        >
                          <span className={`font-bold mr-1.5 ${line.speaker === 'Aria' ? 'text-primary' : 'text-indigo-600'}`}>{line.speaker.toUpperCase()}:</span>
                          <span>{line.text}</span>
                        </div>
                      ))}
                    </div>

                  </div>
                ) : (
                  <p className="text-center text-on-surface-variant py-8">Click re-generate to parse podcast overview.</p>
                )}
              </div>
            )}

            {/* VIEW 5: Outline Compilation */}
            {activeView === 'outline' && (
              <div className="max-w-2xl mx-auto flex flex-col gap-lg">
                <div className="flex justify-between items-center bg-slate-50 p-md border border-outline-variant rounded-lg">
                  <span className="text-body-sm font-bold text-primary">{outlineTitle}</span>
                  {outlineContent && (
                    <button 
                      onClick={() => handleSaveToNotes(outlineTitle, outlineContent)}
                      className="bg-primary text-on-primary px-3 py-1.5 rounded font-bold text-label-sm hover:opacity-90 cursor-pointer"
                    >
                      💾 Save to Notes
                    </button>
                  )}
                </div>
                <div className="bg-white border border-outline-variant p-lg rounded-xl ai-glow">
                  {isLoadingOutline ? (
                    <div className="space-y-4">
                      <div className="h-4 bg-surface-variant rounded w-4/5 animate-pulse" />
                      <div className="h-4 bg-surface-variant rounded w-full animate-pulse" />
                    </div>
                  ) : outlineContent ? (
                    <MarkdownRenderer content={outlineContent} />
                  ) : (
                    <p className="text-center text-on-surface-variant py-8">No content compiled.</p>
                  )}
                </div>
              </div>
            )}

            {/* VIEW 6: Full Saved Note Editor (fallback viewport) */}
            {activeView === 'edit-note' && (
              <div className="max-w-2xl mx-auto bg-white border border-outline-variant p-lg rounded-xl flex flex-col gap-md shadow-sm">
                {activeNotebook.notes.find(n => n.id === activeNoteId) ? (
                  <div className="flex flex-col gap-md">
                    <input 
                      type="text" 
                      value={activeNotebook.notes.find(n => n.id === activeNoteId).title}
                      onChange={(e) => handleUpdateNoteTitle(e.target.value)}
                      placeholder="Note Title..."
                      className="w-full text-headline-sm font-bold border-b border-outline-variant pb-xs focus:border-primary outline-none"
                    />
                    <textarea 
                      value={activeNotebook.notes.find(n => n.id === activeNoteId).content}
                      onChange={(e) => handleUpdateNoteContent(e.target.value)}
                      placeholder="Start drafting notes here..."
                      className="w-full min-h-[320px] text-body-md leading-relaxed border-none outline-none resize-none p-0"
                    />
                    <div className="flex justify-between items-center border-t border-outline-variant pt-md">
                      <button 
                        onClick={() => handleDeleteNote(activeNoteId)}
                        className="text-red-500 hover:bg-red-50 px-md py-sm rounded font-bold text-label-md cursor-pointer"
                      >
                        Delete Note
                      </button>
                      <button 
                        onClick={() => { setActiveView('chat'); setActiveNoteId(null); }}
                        className="bg-primary text-on-primary px-lg py-sm rounded font-bold text-label-md hover:opacity-90 cursor-pointer"
                      >
                        Save & Close
                      </button>
                    </div>
                  </div>
                ) : (
                  <p className="text-center text-on-surface-variant py-8">Select a note or click Add Note in My Notes tab.</p>
                )}
              </div>
            )}

          </div>

          {/* Floating bottom input bar (Exactly matching mockup card layout) */}
          <div className="absolute bottom-0 left-0 w-full px-xl pb-xl bg-gradient-to-t from-white via-white/80 to-transparent pointer-events-none">
            <div className="max-w-4xl mx-auto mesh-gradient-border rounded p-2 flex items-end gap-sm shadow-lg pointer-events-auto bg-white/95 backdrop-blur">
              <button 
                onClick={() => setShowAddSourceModal(true)} 
                className="p-sm hover:bg-surface-variant rounded transition-colors text-on-surface-variant cursor-pointer flex items-center justify-center shrink-0"
                title="Attach source file"
              >
                <span className="material-symbols-outlined">attach_file</span>
              </button>
              
              <textarea 
                value={socraticInput}
                onChange={(e) => setSocraticInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    handleSocraticSend(e);
                  }
                }}
                className="flex-grow bg-transparent border-none focus:ring-0 text-body-md py-2 px-2 resize-none max-h-48 overflow-y-auto text-on-surface outline-none"
                placeholder="Ask Aether anything about your sources..." 
                rows="1"
              />

              <div className="flex items-center gap-sm pb-1 shrink-0">
                <button 
                  onClick={() => alert("Speech recognition currently in development!")} 
                  className="p-sm hover:bg-surface-variant rounded transition-colors text-on-surface-variant cursor-pointer flex items-center justify-center"
                  title="Voice input"
                >
                  <span className="material-symbols-outlined">mic</span>
                </button>
                <button 
                  onClick={handleSocraticSend}
                  className="bg-primary text-white p-sm rounded hover:opacity-90 transition-opacity flex items-center justify-center cursor-pointer shadow-sm shadow-primary/20"
                  title="Send message"
                >
                  <span className="material-symbols-outlined" data-weight="fill">send</span>
                </button>
              </div>
            </div>
          </div>

        </main>

        {/* ══ COLUMN 3: RIGHT SIDEBAR (NOTES & FLASHCARDS TAB) ══ */}
        <aside 
          className={`h-screen border-l border-outline-variant bg-surface-container-low pt-14 flex flex-col z-40 fixed right-0 top-0 transition-all duration-200 shrink-0 ${isRightPaneCollapsed ? 'w-14' : 'w-[320px]'}`}
        >
          {isRightPaneCollapsed ? (
            // Collapsed Right Sidebar
            <div className="flex flex-col items-center py-sm gap-sm flex-grow">
              <button 
                onClick={() => setIsRightPaneCollapsed(false)}
                className="w-10 h-10 rounded hover:bg-surface-variant flex items-center justify-center text-on-surface-variant cursor-pointer"
                title="Expand sidepanel"
              >
                <span className="material-symbols-outlined text-[20px]">menu_open</span>
              </button>
              <div className="h-[1px] w-6 bg-outline-variant my-xs" />
              
              <button 
                onClick={() => { setRightPanelTab('notes'); setIsRightPaneCollapsed(false); }}
                className={`w-10 h-10 rounded flex items-center justify-center cursor-pointer ${rightPanelTab === 'notes' ? 'bg-primary/10 text-primary' : 'text-on-surface-variant hover:bg-surface-variant'}`}
                title="Study Notes"
              >
                <span className="material-symbols-outlined text-[20px]">edit</span>
              </button>

              <button 
                onClick={() => { setRightPanelTab('flashcards'); setIsRightPaneCollapsed(false); triggerGenerateCards(); }}
                className={`w-10 h-10 rounded flex items-center justify-center cursor-pointer ${rightPanelTab === 'flashcards' ? 'bg-primary/10 text-primary' : 'text-on-surface-variant hover:bg-surface-variant'}`}
                title="Flashcards Study"
              >
                <span className="material-symbols-outlined text-[20px]">quiz</span>
              </button>
            </div>
          ) : (
            // Expanded Right Sidebar (Exactly matching Notes / Flashcards layout in mockup)
            <div className="flex flex-col h-full overflow-hidden">
              
              {/* Sidebar Tabs switcher */}
              <div className="flex border-b border-outline-variant bg-white relative pr-8 shrink-0">
                <button 
                  onClick={() => setRightPanelTab('notes')}
                  className={`flex-grow py-md text-label-sm font-bold text-center border-b-2 cursor-pointer transition-colors ${rightPanelTab === 'notes' ? 'text-primary border-primary' : 'text-on-surface-variant/60 hover:text-on-surface border-transparent'}`}
                >
                  Notes
                </button>
                <button 
                  onClick={() => { setRightPanelTab('flashcards'); triggerGenerateCards(); }}
                  className={`flex-grow py-md text-label-sm font-bold text-center border-b-2 cursor-pointer transition-colors ${rightPanelTab === 'flashcards' ? 'text-primary border-primary' : 'text-on-surface-variant/60 hover:text-on-surface border-transparent'}`}
                >
                  Flashcards
                </button>
                
                <button 
                  onClick={() => setIsRightPaneCollapsed(true)} 
                  className="absolute right-1 top-2.5 p-1 hover:bg-surface-variant rounded text-on-surface-variant cursor-pointer flex items-center"
                  title="Collapse Right Sidebar"
                >
                  <span className="material-symbols-outlined text-[18px]">keyboard_double_arrow_right</span>
                </button>
              </div>

              {/* Sidebar Content body */}
              <div className="flex-grow flex flex-col overflow-hidden bg-white">
                
                {/* ── NOTES PANEL VIEW ── */}
                {rightPanelTab === 'notes' && (
                  <div className="flex flex-col h-full overflow-hidden justify-between">
                    <div className="flex-grow flex flex-col overflow-hidden">
                      {/* Scratchpad Header */}
                      <div className="p-md flex justify-between items-center border-b border-outline-variant/50 shrink-0">
                        <div className="flex items-center gap-sm">
                          <span className="material-symbols-outlined text-on-surface-variant text-[18px]">edit</span>
                          
                          {/* Note select selector inline */}
                          {activeNotebook.notes.length > 0 ? (
                            <select 
                              value={activeNoteId || ''} 
                              onChange={(e) => setActiveNoteId(e.target.value)}
                              className="text-label-sm font-bold uppercase tracking-wider text-on-surface-variant/80 bg-transparent border-none outline-none cursor-pointer"
                            >
                              {activeNotebook.notes.map(note => (
                                <option key={note.id} value={note.id}>{note.title}</option>
                              ))}
                            </select>
                          ) : (
                            <span className="text-label-sm font-bold uppercase tracking-wider text-on-surface-variant/80">Study Notes</span>
                          )}
                        </div>
                        <div className="flex gap-sm">
                          <span 
                            onClick={handleAddNewNote}
                            className="material-symbols-outlined text-[18px] text-on-surface-variant cursor-pointer hover:text-primary"
                            title="Add new note"
                          >
                            add
                          </span>
                          <span 
                            onClick={() => {
                              if (activeNoteId) alert("Notes are saved automatically in your active workspace!");
                            }}
                            className="material-symbols-outlined text-[18px] text-on-surface-variant cursor-pointer hover:text-primary"
                            title="Save notes"
                          >
                            save
                          </span>
                        </div>
                      </div>

                      {/* Markdown Editor Textarea area */}
                      <div className="flex-grow p-lg overflow-y-auto flex flex-col">
                        {activeNoteId && activeNotebook.notes.find(n => n.id === activeNoteId) ? (
                          <div className="flex flex-col h-full">
                            <textarea 
                              value={activeNotebook.notes.find(n => n.id === activeNoteId).content}
                              onChange={(e) => handleUpdateNoteContent(e.target.value)}
                              className="w-full h-40 bg-transparent border-none focus:ring-0 text-body-md leading-relaxed text-on-surface p-0 placeholder-on-surface-variant/30 resize-none outline-none shrink-0" 
                              placeholder="Start drafting your notes here..."
                            />
                            
                            {/* Key Concepts Preview Section */}
                            <div className="mt-xl border-t border-outline-variant/60 pt-md">
                              <h3 className="text-headline-sm font-bold text-on-surface mb-md">Key Concepts: Quantum Mechanics</h3>
                              <ul className="space-y-sm list-none text-on-surface-variant">
                                <li className="flex items-start gap-sm text-body-md">
                                  <span className="text-primary mt-1 text-xs">•</span>
                                  <span>Wave-particle duality exists in all matter.</span>
                                </li>
                                <li className="flex items-start gap-sm text-body-md">
                                  <span className="text-primary mt-1 text-xs">•</span>
                                  <span>The observer effect states measurement alters the system.</span>
                                </li>
                                <li className="flex items-start gap-sm text-body-md">
                                  <span className="text-primary mt-1 text-xs">•</span>
                                  <span>Collapse occurs when a superposition reduces to an eigenstate.</span>
                                </li>
                              </ul>
                            </div>
                          </div>
                        ) : (
                          <div className="text-center py-12 text-on-surface-variant">
                            No active note. Click "+" above to add study session notes.
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Generate Flashcards bottom button */}
                    <div className="p-md border-t border-outline-variant bg-white shrink-0">
                      <button 
                        onClick={() => { setRightPanelTab('flashcards'); triggerGenerateCards(); }}
                        className="w-full py-3 bg-primary/10 text-primary rounded font-bold text-label-md flex items-center justify-center gap-sm hover:bg-primary/20 transition-all cursor-pointer shadow-sm shadow-primary/5"
                      >
                        <span className="material-symbols-outlined text-[20px]">auto_fix_high</span>
                        Generate Flashcards
                      </button>
                    </div>
                  </div>
                )}

                {/* ── FLASHCARDS PANEL VIEW ── */}
                {rightPanelTab === 'flashcards' && (
                  <div className="flex flex-col h-full overflow-hidden justify-between p-md bg-slate-50/50">
                    {isLoadingCards ? (
                      <div className="flex-grow flex flex-col justify-center items-center gap-2 text-center text-on-surface-variant">
                        <span className="material-symbols-outlined text-[32px] text-primary animate-spin">refresh</span>
                        <span className="text-body-sm font-bold">Drafting vocab card decks...</span>
                      </div>
                    ) : activeNotebook.flashcards.length > 0 ? (
                      <div className="flex-grow flex flex-col justify-between py-md">
                        {/* 3D flipped recall card */}
                        <div 
                          onClick={() => setIsFlipped(!isFlipped)}
                          className="w-full h-56 rounded-xl border border-outline-variant shadow-md bg-white relative cursor-pointer select-none transition-all duration-300 transform hover:shadow-lg active:scale-[0.98] flex flex-col justify-between p-md"
                        >
                          <div className="border-b border-outline-variant pb-1 flex justify-between items-center">
                            <span className="text-[9px] font-bold text-primary tracking-widest font-mono">
                              {isFlipped ? 'DEFINITION' : 'ACADEMIC TERM'}
                            </span>
                            <span className="material-symbols-outlined text-[16px] text-on-surface-variant/40">
                              {isFlipped ? 'visibility' : 'help'}
                            </span>
                          </div>

                          <div className="flex-grow flex items-center justify-center text-center px-xs py-sm">
                            {isFlipped ? (
                              <p className="text-body-md text-on-surface leading-normal">{activeNotebook.flashcards[cardIndex]?.a}</p>
                            ) : (
                              <h4 className="text-body-lg font-bold text-on-surface">{activeNotebook.flashcards[cardIndex]?.q}</h4>
                            )}
                          </div>

                          <div className="text-center text-[10px] font-semibold text-on-surface-variant/50 border-t border-outline-variant/30 pt-1">
                            [ CLICK CARD TO FLIP ]
                          </div>
                        </div>

                        {/* Deck card nav bar */}
                        <div className="flex items-center justify-center gap-sm mt-md bg-white border border-outline-variant py-1 rounded-full shadow-sm max-w-[160px] mx-auto">
                          <button 
                            className="p-1 hover:bg-slate-100 rounded text-on-surface-variant disabled:opacity-40 cursor-pointer"
                            disabled={cardIndex === 0}
                            onClick={() => { setCardIndex(prev => prev - 1); setIsFlipped(false); }}
                          >
                            <span className="material-symbols-outlined text-[20px]">chevron_left</span>
                          </button>
                          <span className="text-body-sm font-bold text-on-surface-variant font-mono">
                            {cardIndex + 1} / {activeNotebook.flashcards.length}
                          </span>
                          <button 
                            className="p-1 hover:bg-slate-100 rounded text-on-surface-variant disabled:opacity-40 cursor-pointer"
                            disabled={cardIndex === activeNotebook.flashcards.length - 1}
                            onClick={() => { setCardIndex(prev => prev + 1); setIsFlipped(false); }}
                          >
                            <span className="material-symbols-outlined text-[20px]">chevron_right</span>
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div className="flex-grow flex flex-col justify-center items-center text-center p-md text-on-surface-variant gap-sm">
                        <span className="material-symbols-outlined text-[32px] text-on-surface-variant/30">quiz</span>
                        <p className="text-body-sm">No cards compiled. Go back to study guides or notes, click "Generate Flashcards" to extract vocabs.</p>
                      </div>
                    )}

                    <div className="p-sm bg-white border-t border-outline-variant rounded-t-xl shrink-0">
                      <button 
                        onClick={() => setRightPanelTab('notes')}
                        className="w-full py-2 border border-outline text-on-surface hover:bg-slate-50 rounded font-bold text-label-md flex items-center justify-center gap-xs cursor-pointer"
                      >
                        <span className="material-symbols-outlined text-[18px]">arrow_back</span>
                        Back to Notes
                      </button>
                    </div>
                  </div>
                )}

              </div>
            </div>
          )}
        </aside>

      </div>

      {/* ── OVERLAY MODAL: INGEST / ADD SOURCES ── */}
      {showAddSourceModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/45 backdrop-blur-sm">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg border border-outline-variant overflow-hidden flex flex-col animate-scale-in">
            <div className="flex justify-between items-center px-6 py-4 bg-slate-50 border-b border-outline-variant">
              <h3 className="font-bold text-headline-sm text-on-surface">Ingest Study Source</h3>
              <button 
                className="text-on-surface-variant/60 hover:text-on-surface text-2xl font-bold cursor-pointer" 
                onClick={() => setShowAddSourceModal(false)}
              >
                ×
              </button>
            </div>

            <div className="flex border-b border-outline-variant bg-slate-50/50">
              <button 
                className={`flex-grow py-3 font-semibold text-body-sm text-center border-b-2 cursor-pointer ${addSourceTab === 'pdf' ? 'text-primary border-primary bg-white' : 'text-on-surface-variant/70 border-transparent hover:bg-slate-100'}`}
                onClick={() => setAddSourceTab('pdf')}
              >
                PDF Document
              </button>
              <button 
                className={`flex-grow py-3 font-semibold text-body-sm text-center border-b-2 cursor-pointer ${addSourceTab === 'video' ? 'text-primary border-primary bg-white' : 'text-on-surface-variant/70 border-transparent hover:bg-slate-100'}`}
                onClick={() => setAddSourceTab('video')}
              >
                Lecture Video Link
              </button>
              <button 
                className={`flex-grow py-3 font-semibold text-body-sm text-center border-b-2 cursor-pointer ${addSourceTab === 'text' ? 'text-primary border-primary bg-white' : 'text-on-surface-variant/70 border-transparent hover:bg-slate-100'}`}
                onClick={() => setAddSourceTab('text')}
              >
                Custom Passages
              </button>
            </div>

            <div className="p-6">
              {addSourceTab === 'pdf' && (
                <div 
                  onClick={() => fileInputRef.current?.click()}
                  className="border-2 border-dashed border-primary/45 bg-primary/[0.01] hover:bg-primary/[0.03] transition-all rounded-xl p-8 text-center cursor-pointer flex flex-col items-center gap-3"
                >
                  <span className="material-symbols-outlined text-[48px] text-primary/70">upload_file</span>
                  <p className="text-body-md font-bold text-on-surface">Select PDF slides or pass notes</p>
                  <input 
                    type="file"
                    ref={fileInputRef}
                    onChange={handlePdfUpload}
                    accept="application/pdf"
                    style={{ display: 'none' }}
                  />
                </div>
              )}

              {addSourceTab === 'video' && (
                <form onSubmit={handleAddVideoLink} className="flex flex-col gap-4">
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[10px] font-bold text-on-surface-variant/65 uppercase tracking-wider font-mono">Lecture Video URL</label>
                    <input 
                      type="url" 
                      value={videoUrl}
                      onChange={(e) => setVideoUrl(e.target.value)}
                      placeholder="Paste YouTube link..."
                      className="w-full border border-outline px-3.5 py-2.5 rounded-lg text-body-md focus:border-primary outline-none"
                      required
                    />
                  </div>
                  <button type="submit" className="w-full bg-primary text-white py-2.5 rounded-lg font-bold text-label-md hover:opacity-95 cursor-pointer mt-2 shadow-md shadow-primary/10">
                    Ingest Video Context
                  </button>
                </form>
              )}

              {addSourceTab === 'text' && (
                <form onSubmit={handleAddTextSource} className="flex flex-col gap-4">
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[10px] font-bold text-on-surface-variant/65 uppercase tracking-wider font-mono">Source Title</label>
                    <input 
                      type="text" 
                      value={customTextTitle}
                      onChange={(e) => setCustomTextTitle(e.target.value)}
                      placeholder="Title of notes..."
                      className="w-full border border-outline px-3.5 py-2 rounded-lg text-body-md focus:border-primary outline-none"
                      required
                    />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[10px] font-bold text-on-surface-variant/65 uppercase tracking-wider font-mono">Passages</label>
                    <textarea 
                      value={customTextContent}
                      onChange={(e) => setCustomTextContent(e.target.value)}
                      placeholder="Paste textbook details or slide outlines..."
                      className="w-full h-32 border border-outline px-3.5 py-2 rounded-lg text-body-md focus:border-primary outline-none resize-none"
                      required
                    />
                  </div>
                  <button type="submit" className="w-full bg-primary text-white py-2.5 rounded-lg font-bold text-label-md hover:opacity-95 cursor-pointer mt-2 shadow-md shadow-primary/10">
                    Add Text Source
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ── OVERLAY MODAL: COGNITIVE API KEY SETTINGS ── */}
      {showSettingsModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/45 backdrop-blur-sm">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-sm border border-outline-variant overflow-hidden animate-scale-in">
            <div className="flex justify-between items-center px-6 py-4 bg-slate-50 border-b border-outline-variant">
              <h3 className="font-bold text-headline-sm text-on-surface">Gemini API Key</h3>
              <button 
                className="text-on-surface-variant/60 hover:text-on-surface text-2xl font-bold cursor-pointer" 
                onClick={() => setShowSettingsModal(false)}
              >
                ×
              </button>
            </div>
            <div className="p-6 flex flex-col gap-4">
              <div className="flex flex-col gap-2">
                <div className="flex justify-between items-center">
                  <span className="text-[10px] font-bold uppercase tracking-wider font-mono text-on-surface-variant">API Key Settings</span>
                  <span className={`text-[9px] font-bold px-2 py-0.5 rounded font-mono ${apiKey ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-slate-100 text-slate-600 border border-slate-200'}`}>
                    {apiKey ? 'REAL AI ACTIVE' : 'SIMULATED DEMO'}
                  </span>
                </div>
                <div className="flex border border-outline rounded-lg bg-white overflow-hidden focus-within:border-primary transition-all">
                  <input 
                    type={showApiKey ? "text" : "password"}
                    value={apiKey}
                    onChange={handleApiKeyChange}
                    placeholder="Enter Gemini API Key..."
                    className="flex-grow px-3 py-2 text-body-md outline-none border-none font-mono"
                  />
                  <button 
                    type="button" 
                    onClick={() => setShowApiKey(!showApiKey)}
                    className="px-3 border-l border-outline bg-slate-50 font-mono text-[10px] font-bold text-on-surface-variant cursor-pointer"
                  >
                    {showApiKey ? "Hide" : "Show"}
                  </button>
                </div>
              </div>
              <button 
                onClick={() => setShowSettingsModal(false)} 
                className="w-full bg-primary text-white py-2.5 rounded-lg font-bold text-label-md hover:opacity-95 cursor-pointer mt-2"
              >
                Apply Settings
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── OVERLAY MODAL: SHARE NOTEBOOK ── */}
      {showShareModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/45 backdrop-blur-sm">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-sm border border-outline-variant overflow-hidden animate-scale-in">
            <div className="flex justify-between items-center px-6 py-4 bg-slate-50 border-b border-outline-variant">
              <h3 className="font-bold text-headline-sm text-on-surface">Share Workspace</h3>
              <button 
                className="text-on-surface-variant/60 hover:text-on-surface text-2xl font-bold cursor-pointer" 
                onClick={() => setShowShareModal(false)}
              >
                ×
              </button>
            </div>
            <div className="p-6 flex flex-col gap-4">
              <p className="text-body-sm text-on-surface-variant/80">Copy workspace link to share active source guides with classmate:</p>
              <div className="flex border border-outline rounded-lg bg-slate-50 overflow-hidden">
                <input 
                  type="text" 
                  value={window.location.href}
                  className="flex-grow px-3 py-2 text-body-sm outline-none border-none bg-transparent text-on-surface-variant/70 font-mono" 
                  readOnly 
                />
                <button 
                  onClick={() => {
                    navigator.clipboard.writeText(window.location.href);
                    alert("StudyLM Workspace link copied!");
                  }}
                  className="px-4 bg-primary text-white font-bold text-label-sm hover:opacity-90 cursor-pointer shrink-0"
                >
                  Copy
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── OVERLAY MODAL: STUDY ANALYTICS ── */}
      {showAnalyticsModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/45 backdrop-blur-sm">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-sm border border-outline-variant overflow-hidden animate-scale-in">
            <div className="flex justify-between items-center px-6 py-4 bg-slate-50 border-b border-outline-variant">
              <h3 className="font-bold text-headline-sm text-on-surface">Study Analytics</h3>
              <button 
                className="text-on-surface-variant/60 hover:text-on-surface text-2xl font-bold cursor-pointer" 
                onClick={() => setShowAnalyticsModal(false)}
              >
                ×
              </button>
            </div>
            <div className="p-6 flex flex-col gap-4">
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-slate-50 border border-outline-variant rounded-lg p-3 text-center">
                  <div className="text-2xl font-bold text-primary font-mono">{notebooks.length}</div>
                  <div className="text-[10px] text-on-surface-variant/60 uppercase font-mono tracking-wider font-bold mt-1">Active Notebooks</div>
                </div>
                <div className="bg-slate-50 border border-outline-variant rounded-lg p-3 text-center">
                  <div className="text-2xl font-bold text-primary font-mono">{activeNotebook.sources.length}</div>
                  <div className="text-[10px] text-on-surface-variant/60 uppercase font-mono tracking-wider font-bold mt-1">Total Sources</div>
                </div>
                <div className="bg-slate-50 border border-outline-variant rounded-lg p-3 text-center">
                  <div className="text-2xl font-bold text-primary font-mono">{activeNotebook.notes.length}</div>
                  <div className="text-[10px] text-on-surface-variant/60 uppercase font-mono tracking-wider font-bold mt-1">Saved Outlines</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
