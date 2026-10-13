import { useEffect, useState } from "react";

interface TypewriterTextProps {
  text: string;
  speed?: number;
}

export default function TypewriterText({
  text,
  speed = 12,
}: TypewriterTextProps) {
  const [visibleLength, setVisibleLength] = useState(0);

  useEffect(() => {
    setVisibleLength(0);

    if (!text) return;

    let currentLength = 0;
    let timeoutId = 0;
    let cancelled = false;

    function typeNextChunk() {
      if (cancelled) return;

      // Reveal several characters per update to reduce React work.
      currentLength = Math.min(
        currentLength + 3,
        text.length,
      );

      setVisibleLength(currentLength);

      if (currentLength < text.length) {
        timeoutId = window.setTimeout(
          typeNextChunk,
          speed,
        );
      }
    }

    timeoutId = window.setTimeout(
      typeNextChunk,
      speed,
    );

    return () => {
      cancelled = true;
      window.clearTimeout(timeoutId);
    };
  }, [text, speed]);

  const complete = visibleLength >= text.length;
  const visibleText = text.slice(0, visibleLength);

  return (
    <div
      className="typewriter-text"
      aria-live={complete ? "off" : "polite"}
    >
      {visibleText ? (
        <p>{visibleText}</p>
      ) : null}

      {!text && (
        <p className="typewriter-placeholder">
          Your enhanced writing will appear here.
        </p>
      )}

      {text && !complete && (
        <span className="typing-caret" aria-hidden="true" />
      )}
    </div>
  );
}