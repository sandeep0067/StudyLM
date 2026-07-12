export const INITIAL_NOTEBOOKS = [
  {
    id: 'startup',
    name: 'Startup Idea',
    sources: [
      { id: 'st-1', name: 'Pitch Deck.pdf', type: 'pdf', size: '1.2MB', text: 'Pitch deck for Meridian: An operating system for knowledge. Focuses on spatial layout containers, modular center view workspaces, and contextual AI chat helpers.', active: true },
      { id: 'st-2', name: 'Competitor Analysis.csv', type: 'website', size: '24KB', text: 'Competitors analysis: Notion AI, ChatGPT, NotebookLM, Heptabase. Meridian stands out because of its modular split layout dividing sources, workspace, and chat panels.', active: true },
      { id: 'st-3', name: 'github.com/meridian/mvp', type: 'github', size: 'Connected', text: 'React code implementing the spatial dashboard, collapsible drawers, and SpeachSynthesis audio player hooks.', active: true }
    ],
    chatHistory: [
      { sender: 'ai', text: "Hello! Welcome to your Startup Idea Workspace. I have analyzed your pitch files and competitors. What aspect of the Meridian startup MVP would you like to review first?" }
    ],
    notes: [
      { id: 'n-st-1', title: 'Startup Notes', content: 'Meridian MVP milestones:\n- Overhaul layout to 3-pane spatial system.\n- Wires up PDF ingestion and text generators.', date: 'Just now', sourceCount: 3 }
    ],
    summaryData: '',
    timelineData: '',
    mindmapData: '',
    reportData: '',
    documentationData: '',
    projectPlanData: '',
    presentationData: '',
    flashcards: [],
    audioScript: []
  },
  {
    id: 'ml',
    name: 'Machine Learning',
    sources: [
      { id: 'ml-1', name: 'Backpropagation.pdf', type: 'pdf', size: '4.8MB', text: 'Backpropagation algorithm: Calculates gradients of loss function with respect to neural network weights, updating weights to reduce error.', active: true },
      { id: 'ml-2', name: 'github.com/pytorch/examples', type: 'github', size: 'Connected', text: 'Pytorch training loops, loss functions, optimizer steps: optimizer.zero_grad(), loss.backward(), optimizer.step().', active: true }
    ],
    chatHistory: [
      { sender: 'ai', text: "Welcome to the Machine Learning Workspace. I see we have Pytorch codebase examples and backpropagation mathematical models loaded. Let me know what you want to evaluate." }
    ],
    notes: [
      { id: 'n-ml-1', title: 'ML Notes', content: 'Loss calculation: Mean Squared Error or Cross Entropy. Backpropagation propagates errors backward through nodes using chain rule derivatives.', date: 'Yesterday', sourceCount: 2 }
    ],
    summaryData: '',
    timelineData: '',
    mindmapData: '',
    reportData: '',
    documentationData: '',
    projectPlanData: '',
    presentationData: '',
    flashcards: [],
    audioScript: []
  },
  {
    id: 'portfolio',
    name: 'Portfolio Website',
    sources: [
      { id: 'port-1', name: 'Design Spec.pdf', type: 'pdf', size: '940KB', text: 'Portfolio design system: warm alabaster theme, absolute borders, responsive mobile drawer controls, CSS grid layouts.', active: true }
    ],
    chatHistory: [
      { sender: 'ai', text: "Hello. I have read your design spec for the portfolio website. Let's discuss your layout plans." }
    ],
    notes: [
      { id: 'n-port-1', title: 'Portfolio Draft', content: 'Grid structure: 12-column layout. Media queries: breakpoint at 768px for menu toggles.', date: '2d ago', sourceCount: 1 }
    ],
    summaryData: '',
    timelineData: '',
    mindmapData: '',
    reportData: '',
    documentationData: '',
    projectPlanData: '',
    presentationData: '',
    flashcards: [],
    audioScript: []
  },
  {
    id: 'research',
    name: 'Research Paper',
    sources: [
      { id: 'res-1', name: 'Double Blind Study.pdf', type: 'pdf', size: '1.1MB', text: 'Double blind studies reduce researcher bias by keeping both patient and administrator unaware of placebo groupings.', active: true }
    ],
    chatHistory: [
      { sender: 'ai', text: "Hello. Let's analyze the placebo controls and double-blind setups in this paper." }
    ],
    notes: [
      { id: 'n-res-1', title: 'Paper Outlines', content: 'Double blind parameters require distinct administrative staffing to prevent leaks.', date: '3d ago', sourceCount: 1 }
    ],
    summaryData: '',
    timelineData: '',
    mindmapData: '',
    reportData: '',
    documentationData: '',
    projectPlanData: '',
    presentationData: '',
    flashcards: [],
    audioScript: []
  },
  {
    id: 'interview',
    name: 'Interview Prep',
    sources: [
      { id: 'int-1', name: 'Coding Patterns.pdf', type: 'pdf', size: '3.1MB', text: 'Sliding window, Two pointers, Fast and slow pointers, Merge intervals, Topological sort, Depth first search.', active: true }
    ],
    chatHistory: [
      { sender: 'ai', text: "Welcome to Interview Prep. Let's practice sliding window or two-pointer patterns. What question pattern should we solve?" }
    ],
    notes: [
      { id: 'n-int-1', title: 'Leetcode Patterns', content: 'Two pointer checks require sorted arrays. Sliding window is useful for subarray min/max calculations.', date: '4d ago', sourceCount: 1 }
    ],
    summaryData: '',
    timelineData: '',
    mindmapData: '',
    reportData: '',
    documentationData: '',
    projectPlanData: '',
    presentationData: '',
    flashcards: [],
    audioScript: []
  }
];
