// ── Custom Socratic Heuristic Offline Generators ──
export const generateOfflineContent = (notebook) => {
  const sourcesText = (notebook.sources || []).filter(s => s.active).map(s => s.text).join(' ');
  
  if (!sourcesText.trim()) {
    return {
      summary: "## � Summary Outline\n\nPlease add or activate at least one source on the left sidebar to generate a summary guide.",
      timeline: "## ⏱️ Timeline\n\nPlease add or activate at least one source on the left sidebar to generate a timeline.",
      mindmap: "## 🕸️ Mind Map\n\nPlease add or activate at least one source on the left sidebar to generate a mind map.",
      flashcards: [],
      report: "## � Research Report\n\nPlease add or activate at least one source on the left sidebar to generate a report.",
      documentation: "## � Documentation\n\nPlease add or activate at least one source on the left sidebar to generate documentation.",
      plan: "## ✅ Project Plan\n\nPlease add or activate at least one source on the left sidebar to generate a project plan.",
      presentation: "## 🎤 Presentation\n\nPlease add or activate at least one source on the left sidebar to generate a presentation outline."
    };
  }

  const words = sourcesText.toLowerCase().replace(/[^a-zA-Z\s]/g, '').split(/\s+/);
  const stopWords = new Set(['about', 'above', 'after', 'again', 'against', 'all', 'am', 'an', 'and', 'any', 'are', 'arent', 'as', 'at', 'be', 'because', 'been', 'before', 'being', 'below', 'between', 'both', 'but', 'by', 'cant', 'cannot', 'could', 'couldnt', 'did', 'didnt', 'do', 'does', 'doesnt', 'doing', 'dont', 'down', 'during', 'each', 'few', 'for', 'from', 'further', 'had', 'hadnt', 'has', 'hasnt', 'have', 'havent', 'having', 'he', 'hed', 'hell', 'hes', 'her', 'here', 'heres', 'hers', 'herself', 'him', 'himself', 'his', 'how', 'hows', 'i', 'id', 'ill', 'im', 'ive', 'if', 'in', 'into', 'is', 'isnt', 'it', 'its', 'itself', 'lets', 'me', 'more', 'most', 'mustnt', 'my', 'myself', 'no', 'nor', 'not', 'of', 'off', 'on', 'once', 'only', 'or', 'other', 'ought', 'our', 'ours', 'ourselves', 'out', 'over', 'own', 'same', 'shant', 'she', 'shed', 'shell', 'shes', 'should', 'shouldnt', 'so', 'some', 'such', 'than', 'that', 'thats', 'the', 'their', 'theirs', 'them', 'themselves', 'then', 'there', 'theres', 'these', 'they', 'theyd', 'theyll', 'theyre', 'theyve', 'this', 'those', 'through', 'to', 'too', 'under', 'until', 'up', 'very', 'was', 'wasnt', 'we', 'wed', 'well', 'were', 'weve', 'werent', 'what', 'whats', 'when', 'whens', 'where', 'wheres', 'which', 'while', 'who', 'whos', 'whom', 'why', 'whys', 'with', 'wont', 'would', 'wouldnt', 'you', 'youd', 'youll', 'youre', 'youve', 'your', 'yours', 'yourself', 'yourselves']);
  
  const freq = {};
  words.forEach(w => {
    if (w.length > 4 && !stopWords.has(w)) {
      freq[w] = (freq[w] || 0) + 1;
    }
  });
  
  const sortedKeywords = Object.keys(freq).sort((a, b) => freq[b] - freq[a]);
  const kw1 = sortedKeywords[0] || 'concept';
  const kw2 = sortedKeywords[1] || 'process';
  const kw3 = sortedKeywords[2] || 'mechanism';
  const kw4 = sortedKeywords[3] || 'analysis';
  
  const cap = (s) => s.charAt(0).toUpperCase() + s.slice(1);

  const summary = `## � Executive Summary: ${cap(kw1)} Architecture
  
This comprehensive knowledge guide extracts core concepts from your source documents, highlighting the active interface between **${cap(kw1)}** and **${cap(kw2)}**.

### Key Concept Vocabulary
*   **${cap(kw1)}**: The primary operational component identified in the active documents.
*   **${cap(kw2)}**: The key process driving reactions or stages in this workspace.
*   **${cap(kw3)}**: A secondary regulating factor that dictates limits.
*   **${cap(kw4)}**: The primary metric measuring performance efficiency.

### System Formulation
$$\\text{Efficiency}(\\eta) = \\int_{0}^{t} \\frac{\\text{${cap(kw1)}}(x)}{\\text{${cap(kw2)}}(x) + \\text{${cap(kw3)}}} \\, dx$$

> [!NOTE]
> Regulation of **${kw2}** is heavily dependent on the feedback loops of **${kw4}**. Ensure check parameters remain bounded.`;

  const timeline = `## ⏱️ Operational Timeline: Development of ${cap(kw1)}
  
A sequential mapping of key milestones and chronological events extracted from active source details.

- **Milestone 1: Ingestion & Baseline Configuration**
  Initial setup of the **${kw1}** workspace parameters. Establishment of the **${kw3}** boundaries.
- **Milestone 2: Process Integration**
  Wiring **${kw2}** metrics to actively interface with the secondary regulatory pathways.
- **Milestone 3: Benchmark Assessment**
  Measuring **${kw4}** output loops and validating feedback limits.
- **Milestone 4: Superposition Stabilization**
  Final stabilization and calibration of the **${kw1}** network.`;

  const mindmap = `## 🕸️ Concept Mind Map: ${cap(kw1)} Ecosystem
  
An indented hierarchical mapping representing links between key subjects in your sources.

*   **${cap(kw1)} (Central Node)**
    *   **Regulatory Parameters**
        *   **${cap(kw3)}** (Primary constraints)
        *   Ambient workspace settings
    *   **Core Processes**
        *   **${cap(kw2)}** (Reaction dynamics)
        *   Feedback loop stabilization
    *   **Benchmarking Metrics**
        *   **${cap(kw4)}** (System outputs)
        *   Analytical validation`;

  const report = `## � Academic Research Report: Analysis of ${cap(kw1)}
  
### Abstract
This research report examines the systemic interactions of **${kw1}** in active workspace applications, analyzing how **${kw2}** and **${kw3}** govern overall performance parameters.

### Methodology
Sources were evaluated through keyword extraction and semantic mapping, charting the output frequency of **${kw4}** relative to input modifications.

### Conclusion
The empirical details show that maintaining high levels of **${kw1}** ensures optimal feedback cycle stabilization when **${kw3}** remains tightly controlled.`;

  const documentation = `## � Developer Documentation: API Guide for ${cap(kw1)}
  
This guide documents the API endpoints, methods, and configurations used to manipulate **${kw1}** components.

### 1. Initialize Network
\`\`\`bash
curl -X POST https://api.meridian.ai/v1/workspaces/init \\
     -H "Authorization: Bearer $API_KEY" \\
     -d "primary=${kw1}&process=${kw2}"
\`\`\`

### 2. Retrieve Metrics
Query active **${kw4}** output:
\`\`\`python
import requests

def get_metrics():
    res = requests.get("https://api.meridian.ai/v1/metrics?key=" + "${kw1}")
    return res.json()
\`\`\`

> [!WARNING]
> Do not let the concentration of **${kw3}** exceed threshold levels, or the feedback network will collapse.`;

  const plan = `## 📋 Project Roadmap: ${cap(kw1)} Launch Plan
  
Task checklists and roadmap items required to deploy the **${kw1}** module successfully.

### Phase 1: Setup
- [x] Configure basic parameters and variables
- [x] Ingest pitch files and research papers
- [ ] Connect remote GitHub code repositories

### Phase 2: Implementation
- [ ] Implement active **${kw2}** loops
- [ ] Stabilize boundary constraints for **${kw3}**

### Phase 3: Launch
- [ ] Compile performance results for **${kw4}**
- [ ] Export final documentation report`;

  const presentation = `## 📊 Slides Outline: Presenting ${cap(kw1)}
  
Slide outline for presenting the **${kw1}** ecosystem to stakeholders.

- **Slide 1: Executive Overview**
  Introduction to **${cap(kw1)}** and the core vision of this AI Knowledge Workspace.
- **Slide 2: Technical Architecture**
  How **${cap(kw2)}** interfaces with regulating elements.
- **Slide 3: Key Challenges**
  Addressing rate limiting factors: **${cap(kw3)}**.
- **Slide 4: System Performance**
  Displaying benchmarks from **${cap(kw4)}** monitoring metrics.`;

  const flashcards = [
    { q: cap(kw1), a: `The primary concept extracted from active sources, driving this workspace.` },
    { q: cap(kw2), a: `The central process regulating state transitions and data throughput.` },
    { q: cap(kw3), a: `The primary rate-limiting factor or boundary constraint.` },
    { q: cap(kw4), a: `The benchmark metric measuring workspace performance efficiency.` }
  ];

  return { summary, timeline, mindmap, report, documentation, plan, presentation, flashcards };
};

// ── Socratic Assistant Fallback Chat Responder ──
export const generateOfflineChatResponse = (userMessage, notebook) => {
  const sourcesText = (notebook.sources || []).filter(s => s.active).map(s => s.text).join(' ');
  const userWords = userMessage.toLowerCase().replace(/[^a-zA-Z\s]/g, '').split(/\s+/).filter(w => w.length > 4);
  
  let matchedSentence = '';
  if (sourcesText.trim()) {
    const sentences = sourcesText.split(/[.!?]\s+/);
    for (const word of userWords) {
      const found = sentences.find(s => s.toLowerCase().includes(word));
      if (found) {
        matchedSentence = found.trim();
        break;
      }
    }
  }

  if (matchedSentence) {
    return `Your documents contain this statement: **"${matchedSentence}."**\n\nBased on this details, how would you formulate the core relationship between this concept and the other assets in your workspace?`;
  }

  const fallbacks = [
    `Let's analyze this step-by-step. How does this query relate to the primary files loaded in this workspace?`,
    `That is a constructive starting point. What does your current timeline or plan suggest about how this mechanism behaves?`,
    `Let's break this down. Based on the notes and docs you have here, what would be the first logical step to test this?`
  ];
  return fallbacks[Math.floor(Math.random() * fallbacks.length)];
};
