import {
  lazy,
  Suspense,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";

import { AnimatePresence } from "framer-motion";
import { BootIntro } from "./components/BootIntro";

import {
  AlignLeft,
  ArrowLeft,
  ArrowRight,
  BookOpen,
  BriefcaseBusiness,
  Check,
  CheckCircle2,
  Copy,
  Feather,
  Lightbulb,
  LoaderCircle,
  RefreshCw,
  Sparkles,
  Trash2,
  UserRound,
  ChartNoAxesColumnIncreasing,
  X,
} from "lucide-react";

import {
  checkHealth,
  enhanceText,
  type WritingStyle,
} from "./api";

import TypewriterText from "./components/TypewriterText";

// Load the background separately so Three.js or canvas-related
// code does not block the initial application render.
const ParticleField = lazy(
  () => import("./components/ParticleField"),
);

type Page = "rewrite" | "how";

const writingStyles: {
  id: WritingStyle;
  label: string;
  icon: typeof BriefcaseBusiness;
  description: string;
}[] = [
  {
    id: "professional",
    label: "Professional",
    icon: BriefcaseBusiness,
    description: "Polished and workplace-ready.",
  },
  {
    id: "articulate",
    label: "Articulate",
    icon: Sparkles,
    description: "Clearer, more precise expression.",
  },
  {
    id: "concise",
    label: "Concise",
    icon: AlignLeft,
    description: "Fewer words, same meaning.",
  },
  {
    id: "confident",
    label: "Confident",
    icon: ChartNoAxesColumnIncreasing,
    description: "Direct, assured communication.",
  },
  {
    id: "recruiter-friendly",
    label: "Recruiter-Friendly",
    icon: UserRound,
    description: "Suitable for resumes and applications.",
  },
  {
    id: "academic",
    label: "Academic",
    icon: BookOpen,
    description: "Formal and precise.",
  },
];

export default function App() {
  const [bootComplete, setBootComplete] = useState(false);
  const [page, setPage] = useState<Page>("rewrite");

  // Both fields intentionally start empty.
  const [text, setText] = useState("");
  const [result, setResult] = useState("");

  const [style, setStyle] =
    useState<WritingStyle>("professional");

  const [resultStyle, setResultStyle] =
    useState<WritingStyle>("professional");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);
  const [online, setOnline] = useState<boolean | null>(null);

  const [showDetails, setShowDetails] = useState(false);

  const wordCount = useMemo(() => {
    const trimmed = result.trim();

    return trimmed ? trimmed.split(/\s+/).length : 0;
  }, [result]);

  // Check backend availability without blocking the first render.
  useEffect(() => {
    let active = true;

    checkHealth()
      .then((status) => {
        if (active) {
          setOnline(status);
        }
      })
      .catch(() => {
        if (active) {
          setOnline(false);
        }
      });

    return () => {
      active = false;
    };
  }, []);

  const navigate = useCallback(
    (nextPage: Page) => {
      setPage(nextPage);
      setError("");

      window.scrollTo({
        top: 0,
        behavior: "auto",
      });
    },
    [],
  );

  const handleEnhance = useCallback(async () => {
    const originalText = text.trim();

    if (!originalText) {
      setError("Add some text before enhancing it.");
      return;
    }

    if (loading) {
      return;
    }

    setLoading(true);
    setError("");
    setCopied(false);
    setResult("");
    setShowDetails(false);

    try {
      const response = await enhanceText(
        originalText,
        style,
      );

      setResult(response.enhanced_text);
      setResultStyle(response.style);
      setOnline(true);
    } catch (err: unknown) {
      setOnline(false);

      setError(
        err instanceof Error
          ? err.message
          : "Something went wrong. Please try again.",
      );
    } finally {
      setLoading(false);
    }
  }, [text, style, loading]);

  const handleCopy = useCallback(async () => {
    if (!result.trim()) {
      return;
    }

    try {
      await navigator.clipboard.writeText(result);
      setCopied(true);

      window.setTimeout(() => {
        setCopied(false);
      }, 1800);
    } catch {
      setError(
        "Clipboard access failed. Select the result and copy it manually.",
      );
    }
  }, [result]);

  const clearText = useCallback(() => {
    setText("");
    setResult("");
    setError("");
    setCopied(false);
  }, []);

  const selectedStyle = writingStyles.find(
    (item) => item.id === style,
  );

  const selectedResultStyle = writingStyles.find(
    (item) => item.id === resultStyle,
  );

  return (
    <>
      <AnimatePresence>
        {!bootComplete && (
          <BootIntro
            key="lexyra-boot"
            onComplete={() => setBootComplete(true)}
          />
        )}
      </AnimatePresence>

      <main className="shell" id="top">
        {/* Decorative background. It never intercepts clicks. */}
        <Suspense fallback={null}>
          <ParticleField />
        </Suspense>

        {/* Navigation */}
        <header className="topbar">
          <button
            type="button"
            className="brand"
            onClick={() => navigate("rewrite")}
            aria-label="Lexyra home"
          >
            <span className="brand-mark">
              <Feather size={29} />
            </span>

            <span className="brand-title">
              Lexyra <span className="brand-tagline">• Thoughtfully Written</span>
            </span>
          </button>

          <nav className="navigation" aria-label="Main navigation">
            <button
              type="button"
              className={
                page === "rewrite"
                  ? "nav-link active"
                  : "nav-link"
              }
              onClick={() => navigate("rewrite")}
            >
              Rewrite
            </button>

            <button
              type="button"
              className={
                page === "how"
                  ? "nav-link active"
                  : "nav-link"
              }
              onClick={() => navigate("how")}
            >
              How It Works
            </button>
          </nav>

          <a
            className="top-cta"
            href="https://github.com/kennykrichardson"
            target="_blank"
            rel="noreferrer noopener"
            aria-label="Open Kenny Richardson's GitHub profile in a new tab"
          >
            My GitHub
            <ArrowRight size={18} />
          </a>
        </header>

        {/* Changing the key triggers the existing page animation. */}
        <div key={page} className="page-transition">
        {page === "rewrite" ? (
          <>
            {/* Writing workspace */}
            <section
              className="workspace"
              aria-label="Writing workspace"
            >
              {/* Input panel */}
              <div className="input-panel">
                <div className="panel-heading">
                  <label htmlFor="source-text">
                    Your Text
                  </label>

                  <span>{text.length}/10000</span>
                </div>

                <div className="textarea-wrap">
                  <textarea
                    id="source-text"
                    value={text}
                    maxLength={10000}
                    onChange={(event) => {
                      setText(event.target.value);
                      setError("");
                    }}
                    placeholder="Paste your thoughts here. Rough drafts are welcome."
                  />

                  <div className="textarea-bottom">
                    <span>
                      {text
                        ? "Your meaning stays yours."
                        : "Start with a sentence or a rough draft."}
                    </span>

                    <button
                      type="button"
                      className="text-button"
                      onClick={clearText}
                      disabled={!text && !result}
                    >
                      <Trash2 size={15} />
                      Clear
                    </button>
                  </div>
                </div>

                <div className="style-heading">
                  <h2>Writing Style</h2>
                  <span>Choose your tone</span>
                </div>

                <div
                  className="style-grid"
                  role="group"
                  aria-label="Writing style"
                >
                  {writingStyles.map((item) => {
                    const Icon = item.icon;

                    return (
                      <button
                        type="button"
                        key={item.id}
                        className={`style-option ${
                          style === item.id ? "selected" : ""
                        }`}
                        onClick={() => setStyle(item.id)}
                        aria-pressed={style === item.id}
                        title={item.description}
                      >
                        <Icon size={18} />
                        <span>{item.label}</span>
                      </button>
                    );
                  })}
                </div>

                <button
                  type="button"
                  className="enhance-button"
                  onClick={handleEnhance}
                  disabled={loading || !text.trim()}
                >
                  {loading ? (
                    <LoaderCircle
                      className="spin"
                      size={22}
                    />
                  ) : (
                    <Sparkles size={22} />
                  )}

                  <span>
                    {loading
                      ? "Refining your writing..."
                      : "Enhance Writing"}
                  </span>

                  {!loading && <ArrowRight size={22} />}
                </button>

                <div className="input-footnote">
                  <span>
                    <CheckCircle2 size={14} />
                    Meaning preserved
                  </span>

                  <span>
                    <CheckCircle2 size={14} />
                    No invented credentials
                  </span>
                </div>

                {error && (
                  <div
                    className="error-message"
                    role="alert"
                  >
                    <span>{error}</span>

                    <button
                      type="button"
                      onClick={() => setError("")}
                      aria-label="Dismiss error"
                    >
                      <X size={16} />
                    </button>
                  </div>
                )}
              </div>

              {/* Result panel */}
              <div className="result-panel">
                <div className="result-heading">
                  <div>
                    <h2>Enhanced Result</h2>

                    <p>
                      {loading
                        ? "A little polish is on the way."
                        : result
                          ? `${wordCount} words · Ready to use`
                          : "Your improved writing will appear here."}
                    </p>
                  </div>

                  <span className="result-style">
                    <BriefcaseBusiness size={15} />

                    {selectedResultStyle?.label ??
                      "Professional"}
                  </span>
                </div>

                <div
                  className={`result-box ${
                    loading ? "result-loading" : ""
                  }`}
                >
                  {loading ? (
                    <div className="loading-state">
                      <LoaderCircle
                        className="spin"
                        size={27}
                      />

                      <span>
                        Finding the right words...
                      </span>
                    </div>
                  ) : result ? (
                    <TypewriterText
                      key={result}
                      text={result}
                      speed={12}
                    />
                  ) : (
                    <div className="empty-result">
                      <Sparkles size={24} />

                      <p>
                        Your enhanced text will appear here.
                      </p>
                    </div>
                  )}
                </div>

                <div className="result-actions">
                  <button
                    type="button"
                    className="copy-button"
                    onClick={handleCopy}
                    disabled={!result || loading}
                  >
                    {copied ? (
                      <Check size={18} />
                    ) : (
                      <Copy size={18} />
                    )}

                    {copied ? "Copied!" : "Copy Result"}
                  </button>

                  <button
                    type="button"
                    className="regenerate-button"
                    onClick={handleEnhance}
                    disabled={loading || !text.trim()}
                  >
                    <RefreshCw
                      size={18}
                      className={loading ? "spin" : ""}
                    />

                    Regenerate
                  </button>

                  <button
                    type="button"
                    className="more-button"
                    onClick={() =>
                      setShowDetails((value) => !value)
                    }
                    aria-expanded={showDetails}
                    aria-label="More result details"
                  >
                    •••
                  </button>
                </div>

                {showDetails && (
                  <div className="details-panel">
                    <div>
                      <span>Selected style</span>
                      <strong>
                        {selectedStyle?.label ??
                          "Professional"}
                      </strong>
                    </div>

                    <div>
                      <span>Original characters</span>
                      <strong>{text.length}</strong>
                    </div>

                    <div>
                      <span>Result words</span>
                      <strong>{wordCount}</strong>
                    </div>

                    <div>
                      <span>API status</span>

                      <strong
                        className={
                          online
                            ? "status-online"
                            : "status-offline"
                        }
                      >
                        {online === null
                          ? "Checking..."
                          : online
                            ? "Connected"
                            : "Not reachable"}
                      </strong>
                    </div>
                  </div>
                )}

                <div className="why-card">
                  <div className="why-title">
                    <Lightbulb size={18} />
                    <h3>Why this is better</h3>
                  </div>

                  <ul>
                    <li>
                      <CheckCircle2 size={16} />
                      Clearer and more professional tone
                    </li>

                    <li>
                      <CheckCircle2 size={16} />
                      Stronger vocabulary and sentence structure
                    </li>

                    <li>
                      <CheckCircle2 size={16} />
                      Same meaning, no exaggerated claims
                    </li>
                  </ul>
                </div>

                <div className="result-footer">
                  <span>
                    <i
                      className={`status-dot ${
                        online
                          ? "online"
                          : online === false
                            ? "offline"
                            : ""
                      }`}
                    />

                    {online === null
                      ? "Checking API connection"
                      : online
                        ? "Lexyra is connected"
                        : "API not reachable"}
                  </span>

                  <span>Made for words that matter.</span>
                </div>
              </div>
            </section>
          </>
        ) : (
          /* Separate How It Works page */
          <section className="how-page">
            <button
              type="button"
              className="back-button"
              onClick={() => navigate("rewrite")}
            >
              <ArrowLeft size={16} />
              Back to Rewrite
            </button>

            <div className="how-hero">
              <span className="eyebrow">
                SIMPLE BY DESIGN
              </span>

              <h1>
                Better writing,
                <br />
                without losing your voice.
              </h1>

              <p>
                Lexyra sharpens how you express an idea.
                It doesn't decide what you meant.
              </p>
            </div>

            <div className="steps-grid">
              <article className="step-card">
                <span className="step-number">01</span>

                <div className="step-icon">
                  <Copy size={22} />
                </div>

                <h2>Bring your draft</h2>

                <p>
                  Paste a rough sentence, an email, a resume
                  bullet, or a half-formed thought. You don't
                  need to get the words right on the first try.
                </p>
              </article>

              <article className="step-card">
                <span className="step-number">02</span>

                <div className="step-icon">
                  <Sparkles size={22} />
                </div>

                <h2>Choose your style</h2>

                <p>
                  Pick the tone that fits your moment, from
                  concise and confident to professional,
                  recruiter-friendly, or academic.
                </p>
              </article>

              <article className="step-card">
                <span className="step-number">03</span>

                <div className="step-icon">
                  <CheckCircle2 size={22} />
                </div>

                <h2>Make it yours</h2>

                <p>
                  Review the rewritten text, copy the result,
                  and use the words that sound like you.
                  Your original meaning should stay intact.
                </p>
              </article>
            </div>

            <div className="how-note">
              <div className="how-note-icon">
                <Lightbulb size={22} />
              </div>

              <div>
                <h2>Your ideas. Just expressed better.</h2>

                <p>
                  Lexyra helps improve clarity, grammar,
                  vocabulary, and flow. It should never invent
                  experience, qualifications, or facts that
                  weren't in your original writing.
                </p>
              </div>
            </div>

            <button
              type="button"
              className="how-cta"
              onClick={() => navigate("rewrite")}
            >
              Start writing
              <ArrowRight size={19} />
            </button>
          </section>
        )}
        </div>

        {/* Footer */}
        <footer className="footer">
          <button
            type="button"
            className="footer-brand"
            onClick={() => navigate("rewrite")}
          >
            <Feather size={23} />
            Lexyra
          </button>

          
          <a
            className="engineered-by"
            href="https://github.com/kennykrichardson"
            target="_blank"
            rel="noreferrer noopener"
            aria-label="Visit Kenny Richardson's GitHub profile"
          >
            Engineered by Kenny Richardson
          </a>


          <a
            className="footer-social-link"
            href="https://linkedin.com/in/kennykrichardson"
            target="_blank"
            rel="noreferrer noopener"
            aria-label="Open Kenny Richardson's LinkedIn profile in a new tab"
          >
            My LinkedIn
            <ArrowRight size={16} />
          </a>
        </footer>
      </main>
    </>
  );
}