import { useState, useRef } from "react";

const STEPS = [
  {
    id: 1,
    title: "Your Flavour",
    subtitle: "What makes your take unmistakably yours?",
    description: "Before AI touches anything, you need to know what makes you different. Not your niche — your angle on it. The thing only you would say.",
    prompts: [
      { id: "p1", label: "My niche is...", placeholder: "e.g. social media for small businesses" },
      { id: "p2", label: "But my angle is...", placeholder: "e.g. I help people ditch the trends and build something that actually lasts" },
      { id: "p3", label: "The thing I believe that most people in my space won't say out loud...", placeholder: "e.g. Most 'passive income' advice is written for people who already have money" },
    ],
    aiPromptTemplate: (answers) => `A woman is building a side hustle. Here are her answers:
- Her niche: ${answers.p1}
- Her angle: ${answers.p2}
- Her unpopular belief: ${answers.p3}

Write her a single, punchy "I see things differently because..." statement — 2-3 sentences max. Use her exact words and tone. Do not add fluff or generic motivation. Keep it grounded, specific, and human. Start with "I see things differently because..."`,
    outputLabel: "Your Flavour Statement",
  },
  {
    id: 2,
    title: "Your Zone A",
    subtitle: "What can never be automated about you?",
    description: "Zone A is the part of your work that requires your live presence, your judgment, your empathy — every single time. Protecting it is the whole point.",
    prompts: [
      { id: "p1", label: "The part of my work I'd never want AI to touch is...", placeholder: "e.g. voice note replies to clients, live Q&As, strategy calls" },
      { id: "p2", label: "When my audience connects with me most, it's usually because...", placeholder: "e.g. I share the messy middle, not just the wins" },
      { id: "p3", label: "The thing I do in my work that feels almost too personal to explain...", placeholder: "e.g. I can sense when someone is about to quit and I know exactly what to say" },
    ],
    aiPromptTemplate: (answers) => `A woman is identifying her "Zone A" — the parts of her side hustle that require her live human presence, every time.

Her answers:
- What she'd never let AI touch: ${answers.p1}
- When her audience connects most: ${answers.p2}
- Her almost-too-personal skill: ${answers.p3}

Write her a short, clear "Zone A Declaration" — 3-4 sentences that name what is irreplaceably human about her work. Be direct and specific. Use her language. No fluff. This should feel like a personal commitment, not a marketing statement.`,
    outputLabel: "Your Zone A Declaration",
  },
  {
    id: 3,
    title: "Your Voice Rules",
    subtitle: "The rules AI must follow to sound like you.",
    description: "This is your most valuable asset. These rules become the instructions you paste into any AI tool — they're what separates your content from everyone else's.",
    prompts: [
      { id: "p1", label: "Words or phrases I always use (list them)...", placeholder: "e.g. real talk, quietly powerful, no fluff, let's be honest" },
      { id: "p2", label: "Words I'd never say in my content...", placeholder: "e.g. hustle, boss babe, crushing it, passive income, game-changer" },
      { id: "p3", label: "My tone in 3 words...", placeholder: "e.g. direct, warm, no-nonsense" },
      { id: "p4", label: "What I want people to feel after reading my content...", placeholder: "e.g. seen, capable, like they can start today" },
    ],
    aiPromptTemplate: (answers) => `A woman is building her personal Voice Rules for AI — a set of instructions so any AI tool produces content that sounds like her.

Her inputs:
- Words she always uses: ${answers.p1}
- Words she never uses: ${answers.p2}
- Her tone in 3 words: ${answers.p3}
- How she wants people to feel: ${answers.p4}

Write her a clean, numbered Voice Rules document (7 rules max). Each rule should be a clear instruction an AI can follow. Format: "Rule 1: [instruction]". Make them specific, practical, and written in her tone. End with a one-line reminder she can paste at the top of any AI prompt.`,
    outputLabel: "Your Voice Rules",
  },
  {
    id: 4,
    title: "The Proof Test",
    subtitle: "See your voice rules in action.",
    description: "Paste a piece of your existing content. We'll run it through AI using your voice rules from Step 3 — so you can feel the difference between AI-generic and AI-as-you.",
    prompts: [
      { id: "p1", label: "Paste a caption, email, or post you've already written (your raw words)...", placeholder: "Paste something you wrote — doesn't have to be perfect", isTextarea: true },
      { id: "p2", label: "What format do you want it reshaped into?", placeholder: "e.g. Instagram caption, email subject line, carousel hook, LinkedIn post" },
    ],
    aiPromptTemplate: (answers, voiceRules) => `You are reshaping a piece of content using strict voice rules. Do NOT rewrite from scratch. Reshape the original into the requested format while preserving the exact voice, specific phrases, and personality of the original.

VOICE RULES:
${voiceRules || "Keep the tone direct, warm, and human. No fluff. No hype."}

ORIGINAL CONTENT:
${answers.p1}

REQUESTED FORMAT:
${answers.p2}

Reshape this content into the requested format. Use her actual words and phrasing wherever possible. If you add anything, make sure it sounds like it came from her, not from a generic AI. No emojis unless she used them. No generic motivational phrases.`,
    outputLabel: "Your Reshaped Content",
  },
  {
    id: 5,
    title: "Your Human Edge Kit",
    subtitle: "Everything in one place. Yours forever.",
    description: "This is your complete kit — the document you paste into any AI tool before you start. This is what keeps you human in a world of noise.",
    prompts: [
      { id: "p1", label: "One sentence: what do you want to be known for?", placeholder: "e.g. The woman who helped side hustlers stop hiding and start selling honestly" },
      { id: "p2", label: "The one thing you'd never compromise on in your business...", placeholder: "e.g. I will never use urgency tactics or fake scarcity" },
    ],
    aiPromptTemplate: (answers, voiceRules, allAnswers) => `You are assembling a woman's complete "Human Edge Kit" — a personal AI instruction document she'll use forever.

Compile the following into a clean, structured document she can copy and paste:

1. FLAVOUR STATEMENT (from her Step 1 work): ${allAnswers?.step1Output || "Not yet generated"}

2. ZONE A DECLARATION (from her Step 2 work): ${allAnswers?.step2Output || "Not yet generated"}

3. VOICE RULES (from her Step 3 work): ${allAnswers?.step3Output || voiceRules || "Not yet generated"}

4. KNOWN FOR: ${answers.p1}

5. NON-NEGOTIABLE: ${answers.p2}

Format this as a clean document with clear section headers. At the top, write a 2-sentence "How to use this kit" instruction. Make it feel personal and professional — something she'd be proud to open every time she sits down to create content.`,
    outputLabel: "Your Complete Human Edge Kit",
    isFinal: true,
  },
];

const Spinner = () => (
  <div style={{ display: "flex", alignItems: "center", gap: "8px", color: "#8B7355" }}>
    <div style={{
      width: "16px", height: "16px", border: "2px solid #D4C5A9", borderTopColor: "#8B7355",
      borderRadius: "50%", animation: "spin 0.8s linear infinite"
    }} />
    <span style={{ fontSize: "13px", fontFamily: "'DM Sans', sans-serif" }}>Generating your output...</span>
  </div>
);

export default function YourHumanEdge() {
  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState({});
  const [outputs, setOutputs] = useState({});
  const [loading, setLoading] = useState(false);
  const [started, setStarted] = useState(false);
  const outputRef = useRef(null);

  const step = STEPS[currentStep];
  const stepAnswers = answers[step.id] || {};
  const stepOutput = outputs[step.id];

  const updateAnswer = (promptId, value) => {
    setAnswers(prev => ({
      ...prev,
      [step.id]: { ...(prev[step.id] || {}), [promptId]: value }
    }));
  };

  const allFilled = step.prompts.every(p => (stepAnswers[p.id] || "").trim().length > 0);

  const generateOutput = async () => {
    setLoading(true);
    try {
      const voiceRules = outputs[3];
      const allStepOutputs = { step1Output: outputs[1], step2Output: outputs[2], step3Output: outputs[3] };
      const promptFn = step.aiPromptTemplate;
      const prompt = step.id === 4
        ? promptFn(stepAnswers, voiceRules)
        : step.id === 5
        ? promptFn(stepAnswers, voiceRules, allStepOutputs)
        : promptFn(stepAnswers);

      const res = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json", "x-api-key": import.meta.env.VITE_ANTHROPIC_API_KEY, "anthropic-version": "2023-06-01", "anthropic-dangerous-direct-browser-access": "true" },
        body: JSON.stringify({
          model: "claude-sonnet-4-20250514",
          max_tokens: 1000,
          messages: [{ role: "user", content: prompt }]
        })
      });
      const data = await res.json();
      const text = data.content?.find(b => b.type === "text")?.text || "Something went wrong. Please try again.";
      setOutputs(prev => ({ ...prev, [step.id]: text }));
      setTimeout(() => outputRef.current?.scrollIntoView({ behavior: "smooth", block: "start" }), 100);
    } catch (e) {
      setOutputs(prev => ({ ...prev, [step.id]: "Error generating output. Please try again." }));
    }
    setLoading(false);
  };

  const downloadKit = () => {
    const kit = outputs[5] || "Complete all steps to generate your kit.";
    const blob = new Blob([kit], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "your-human-edge-kit.txt";
    a.click();
    URL.revokeObjectURL(url);
  };

  const styles = {
    root: {
      minHeight: "100vh",
      background: "#FAF8F4",
      fontFamily: "'DM Sans', sans-serif",
      color: "#2C2416",
    },
    header: {
      background: "#2C2416",
      padding: "0",
      position: "sticky",
      top: 0,
      zIndex: 100,
    },
    headerInner: {
      maxWidth: "720px",
      margin: "0 auto",
      padding: "18px 24px",
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
    },
    logo: {
      fontSize: "14px",
      fontFamily: "'Playfair Display', serif",
      color: "#D4C5A9",
      letterSpacing: "0.08em",
      textTransform: "uppercase",
    },
    stepIndicator: {
      fontSize: "12px",
      color: "#8B7355",
      letterSpacing: "0.1em",
      textTransform: "uppercase",
    },
    hero: {
      background: "#2C2416",
      padding: "80px 24px 64px",
      textAlign: "center",
    },
    heroTag: {
      display: "inline-block",
      fontSize: "11px",
      letterSpacing: "0.15em",
      textTransform: "uppercase",
      color: "#8B7355",
      marginBottom: "20px",
      fontFamily: "'DM Sans', sans-serif",
    },
    heroTitle: {
      fontFamily: "'Playfair Display', serif",
      fontSize: "clamp(36px, 6vw, 56px)",
      fontWeight: "700",
      color: "#FAF8F4",
      lineHeight: "1.1",
      marginBottom: "16px",
      letterSpacing: "-0.02em",
    },
    heroSub: {
      fontSize: "16px",
      color: "#A89880",
      maxWidth: "480px",
      margin: "0 auto 32px",
      lineHeight: "1.6",
    },
    startBtn: {
      background: "#C4A882",
      color: "#2C2416",
      border: "none",
      padding: "14px 36px",
      fontSize: "14px",
      fontWeight: "600",
      letterSpacing: "0.08em",
      textTransform: "uppercase",
      cursor: "pointer",
      fontFamily: "'DM Sans', sans-serif",
      transition: "all 0.2s",
    },
    container: {
      maxWidth: "720px",
      margin: "0 auto",
      padding: "48px 24px 80px",
    },
    progressBar: {
      display: "flex",
      gap: "6px",
      marginBottom: "48px",
    },
    progressSegment: (active, done) => ({
      flex: 1,
      height: "3px",
      background: done ? "#2C2416" : active ? "#C4A882" : "#E8E0D4",
      transition: "background 0.3s",
    }),
    stepHeader: {
      marginBottom: "32px",
      borderBottom: "1px solid #E8E0D4",
      paddingBottom: "24px",
    },
    stepNum: {
      fontSize: "11px",
      letterSpacing: "0.15em",
      textTransform: "uppercase",
      color: "#8B7355",
      marginBottom: "8px",
    },
    stepTitle: {
      fontFamily: "'Playfair Display', serif",
      fontSize: "28px",
      fontWeight: "700",
      color: "#2C2416",
      marginBottom: "6px",
      letterSpacing: "-0.01em",
    },
    stepSubtitle: {
      fontSize: "15px",
      color: "#6B5B45",
      fontStyle: "italic",
      marginBottom: "12px",
    },
    stepDesc: {
      fontSize: "14px",
      color: "#8B7355",
      lineHeight: "1.7",
    },
    promptGroup: {
      marginBottom: "20px",
    },
    label: {
      display: "block",
      fontSize: "13px",
      fontWeight: "600",
      color: "#2C2416",
      marginBottom: "8px",
      letterSpacing: "0.01em",
    },
    input: {
      width: "100%",
      padding: "12px 16px",
      fontSize: "14px",
      fontFamily: "'DM Sans', sans-serif",
      color: "#2C2416",
      background: "#FFFFFF",
      border: "1px solid #E8E0D4",
      outline: "none",
      boxSizing: "border-box",
      lineHeight: "1.5",
      transition: "border-color 0.2s",
    },
    textarea: {
      width: "100%",
      padding: "12px 16px",
      fontSize: "14px",
      fontFamily: "'DM Sans', sans-serif",
      color: "#2C2416",
      background: "#FFFFFF",
      border: "1px solid #E8E0D4",
      outline: "none",
      boxSizing: "border-box",
      lineHeight: "1.6",
      resize: "vertical",
      minHeight: "120px",
      transition: "border-color 0.2s",
    },
    generateBtn: (disabled) => ({
      background: disabled ? "#E8E0D4" : "#2C2416",
      color: disabled ? "#A89880" : "#FAF8F4",
      border: "none",
      padding: "14px 32px",
      fontSize: "13px",
      fontWeight: "600",
      letterSpacing: "0.08em",
      textTransform: "uppercase",
      cursor: disabled ? "not-allowed" : "pointer",
      fontFamily: "'DM Sans', sans-serif",
      transition: "all 0.2s",
      marginTop: "8px",
    }),
    outputBox: {
      background: "#FFFFFF",
      border: "1px solid #D4C5A9",
      borderLeft: "3px solid #C4A882",
      padding: "24px",
      marginTop: "28px",
    },
    outputLabel: {
      fontSize: "11px",
      letterSpacing: "0.12em",
      textTransform: "uppercase",
      color: "#8B7355",
      marginBottom: "12px",
      fontWeight: "600",
    },
    outputText: {
      fontSize: "14px",
      color: "#2C2416",
      lineHeight: "1.8",
      whiteSpace: "pre-wrap",
    },
    navRow: {
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      marginTop: "32px",
      paddingTop: "24px",
      borderTop: "1px solid #E8E0D4",
    },
    backBtn: {
      background: "transparent",
      border: "1px solid #D4C5A9",
      padding: "10px 24px",
      fontSize: "13px",
      color: "#6B5B45",
      cursor: "pointer",
      fontFamily: "'DM Sans', sans-serif",
      letterSpacing: "0.05em",
    },
    nextBtn: (disabled) => ({
      background: disabled ? "#E8E0D4" : "#C4A882",
      color: disabled ? "#A89880" : "#2C2416",
      border: "none",
      padding: "12px 28px",
      fontSize: "13px",
      fontWeight: "600",
      letterSpacing: "0.08em",
      textTransform: "uppercase",
      cursor: disabled ? "not-allowed" : "pointer",
      fontFamily: "'DM Sans', sans-serif",
    }),
    downloadBtn: {
      background: "#2C2416",
      color: "#FAF8F4",
      border: "none",
      padding: "14px 36px",
      fontSize: "13px",
      fontWeight: "600",
      letterSpacing: "0.08em",
      textTransform: "uppercase",
      cursor: "pointer",
      fontFamily: "'DM Sans', sans-serif",
      marginTop: "16px",
      display: "block",
    },
  };

  if (!started) {
    return (
      <>
        <style>{`
          @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700&family=DM+Sans:wght@400;500;600&display=swap');
          @keyframes spin { to { transform: rotate(360deg); } }
          * { margin: 0; padding: 0; box-sizing: border-box; }
        `}</style>
        <div style={styles.root}>
          <div style={styles.hero}>
            <p style={styles.heroTag}>5-Step Challenge</p>
            <h1 style={styles.heroTitle}>Your Human<br />Edge</h1>
            <p style={styles.heroSub}>Extract and protect what makes you unmistakably you — before AI touches anything.</p>
            <button style={styles.startBtn} onClick={() => setStarted(true)}>
              Begin the Challenge →
            </button>
          </div>
          <div style={{ maxWidth: "720px", margin: "0 auto", padding: "56px 24px" }}>
            <p style={{ fontSize: "13px", textTransform: "uppercase", letterSpacing: "0.12em", color: "#8B7355", marginBottom: "32px" }}>What you'll walk away with</p>
            {[
              ["Your Flavour Statement", "The 2-sentence thing only you would say."],
              ["Your Zone A Declaration", "What is irreplaceably human about your work."],
              ["Your Voice Rules", "The 7 rules that keep AI sounding like you."],
              ["Your Proof Test", "Your own content reshaped — without losing your soul."],
              ["Your Human Edge Kit", "Everything in one document. Paste it into any AI tool, forever."],
            ].map(([title, desc], i) => (
              <div key={i} style={{ display: "flex", gap: "20px", padding: "18px 0", borderBottom: "1px solid #E8E0D4" }}>
                <span style={{ fontFamily: "'Playfair Display', serif", fontSize: "20px", color: "#C4A882", minWidth: "28px" }}>{i + 1}</span>
                <div>
                  <p style={{ fontSize: "15px", fontWeight: "600", color: "#2C2416", marginBottom: "4px" }}>{title}</p>
                  <p style={{ fontSize: "13px", color: "#8B7355" }}>{desc}</p>
                </div>
              </div>
            ))}
            <button style={{ ...styles.startBtn, marginTop: "40px", display: "block" }} onClick={() => setStarted(true)}>
              Start Step 1 →
            </button>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700&family=DM+Sans:wght@400;500;600&display=swap');
        @keyframes spin { to { transform: rotate(360deg); } }
        * { margin: 0; padding: 0; box-sizing: border-box; }
        input:focus, textarea:focus { border-color: #C4A882 !important; }
      `}</style>
      <div style={styles.root}>
        <div style={styles.header}>
          <div style={styles.headerInner}>
            <span style={styles.logo}>Your Human Edge</span>
            <span style={styles.stepIndicator}>Step {currentStep + 1} of 5</span>
          </div>
        </div>

        <div style={styles.container}>
          <div style={styles.progressBar}>
            {STEPS.map((s, i) => (
              <div key={s.id} style={styles.progressSegment(i === currentStep, i < currentStep)} />
            ))}
          </div>

          <div style={styles.stepHeader}>
            <p style={styles.stepNum}>Step {step.id} of 5</p>
            <h2 style={styles.stepTitle}>{step.title}</h2>
            <p style={styles.stepSubtitle}>{step.subtitle}</p>
            <p style={styles.stepDesc}>{step.description}</p>
          </div>

          {step.prompts.map(prompt => (
            <div key={prompt.id} style={styles.promptGroup}>
              <label style={styles.label}>{prompt.label}</label>
              {prompt.isTextarea ? (
                <textarea
                  style={styles.textarea}
                  placeholder={prompt.placeholder}
                  value={stepAnswers[prompt.id] || ""}
                  onChange={e => updateAnswer(prompt.id, e.target.value)}
                />
              ) : (
                <input
                  type="text"
                  style={styles.input}
                  placeholder={prompt.placeholder}
                  value={stepAnswers[prompt.id] || ""}
                  onChange={e => updateAnswer(prompt.id, e.target.value)}
                />
              )}
            </div>
          ))}

          <button
            style={styles.generateBtn(!allFilled || loading)}
            disabled={!allFilled || loading}
            onClick={generateOutput}
          >
            {loading ? "Generating..." : `Generate ${step.outputLabel}`}
          </button>

          {loading && <div style={{ marginTop: "16px" }}><Spinner /></div>}

          {stepOutput && (
            <div style={styles.outputBox} ref={outputRef}>
              <p style={styles.outputLabel}>{step.outputLabel}</p>
              <p style={styles.outputText}>{stepOutput}</p>
              {step.isFinal && (
                <>
                  <button style={styles.downloadBtn} onClick={downloadKit}>
                    ↓ Download Your Human Edge Kit
                  </button>
                  <div style={{
                    marginTop: "40px",
                    borderTop: "1px solid #E8E0D4",
                    paddingTop: "32px",
                  }}>
                    <p style={{
                      fontSize: "11px", letterSpacing: "0.15em", textTransform: "uppercase",
                      color: "#8B7355", marginBottom: "12px", fontWeight: "600"
                    }}>What's next</p>
                    <h3 style={{
                      fontFamily: "'Playfair Display', serif", fontSize: "22px",
                      color: "#2C2416", marginBottom: "10px", lineHeight: "1.2"
                    }}>You know your edge.<br />Now put it to work.</h3>
                    <p style={{
                      fontSize: "14px", color: "#6B5B45", lineHeight: "1.7", marginBottom: "20px"
                    }}>
                      The Calm Profits Method is the next step — a soft launch system for women who want to sell their digital product with paid traffic that actually sounds like them. No hype. No overnight promises. Just a method that works quietly and consistently.
                    </p>
                    <div style={{
                      background: "#FAF8F4", border: "1px solid #E8E0D4",
                      padding: "16px 20px", marginBottom: "20px"
                    }}>
                      {[
                        "Build your offer around your Human Edge Kit",
                        "Write ads that sound like you, not like everyone else",
                        "Run $5/day traffic that compounds over time",
                      ].map((item, i) => (
                        <div key={i} style={{ display: "flex", gap: "10px", alignItems: "flex-start", marginBottom: i < 2 ? "10px" : 0 }}>
                          <span style={{ color: "#C4A882", fontSize: "14px", marginTop: "1px" }}>→</span>
                          <p style={{ fontSize: "13px", color: "#2C2416", lineHeight: "1.5" }}>{item}</p>
                        </div>
                      ))}
                    </div>
                    <a
                      href="LINK:TBC"
                      style={{
                        display: "inline-block", background: "#C4A882", color: "#2C2416",
                        padding: "13px 28px", fontSize: "13px", fontWeight: "600",
                        letterSpacing: "0.08em", textTransform: "uppercase",
                        textDecoration: "none", fontFamily: "'DM Sans', sans-serif",
                      }}
                    >
                      Show Me the Calm Profits Method →
                    </a>
                    <p style={{ fontSize: "12px", color: "#A89880", marginTop: "10px" }}>Soft launch pricing — $47</p>
                  </div>
                </>
              )}
            </div>
          )}

          <div style={styles.navRow}>
            <button
              style={styles.backBtn}
              onClick={() => { if (currentStep > 0) setCurrentStep(currentStep - 1); else setStarted(false); }}
            >
              ← Back
            </button>
            {currentStep < STEPS.length - 1 && (
              <button
                style={styles.nextBtn(!stepOutput)}
                disabled={!stepOutput}
                onClick={() => setCurrentStep(currentStep + 1)}
              >
                Next Step →
              </button>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
