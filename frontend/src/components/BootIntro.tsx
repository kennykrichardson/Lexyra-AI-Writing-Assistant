import { motion } from "framer-motion";
import { useEffect } from "react";

interface BootIntroProps {
  onComplete: () => void;
}

export function BootIntro({
  onComplete,
}: BootIntroProps) {
  useEffect(() => {
    const timer = window.setTimeout(() => {
      onComplete();
    }, 2400);

    return () => window.clearTimeout(timer);
  }, [onComplete]);

  return (
    <motion.div
      className="boot-intro"
      initial={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.55, ease: "easeInOut" }}
      role="status"
      aria-label="Lexyra is starting"
    >
      <div className="boot-intro__grain" />

      <div className="boot-intro__content">
        <motion.div
          className="boot-intro__mark-wrap"
          initial={{ opacity: 0, scale: 0.82 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{
            duration: 0.65,
            ease: [0.16, 1, 0.3, 1],
          }}
        >
          <motion.div
            className="boot-intro__ring"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{
              scale: [0.8, 1, 1.08],
              opacity: [0, 0.6, 0],
            }}
            transition={{
              duration: 1.8,
              ease: "easeOut",
              repeat: 0,
            }}
          />

          <div className="boot-intro__mark">
            <motion.span
              initial={{ scaleY: 0 }}
              animate={{ scaleY: 1 }}
              transition={{
                delay: 0.2,
                duration: 0.5,
                ease: "easeOut",
              }}
            />

            <motion.span
              initial={{ scaleY: 0 }}
              animate={{ scaleY: 1 }}
              transition={{
                delay: 0.35,
                duration: 0.5,
                ease: "easeOut",
              }}
            />
          </div>
        </motion.div>

        <motion.div
          className="boot-intro__wordmark"
          initial={{
            opacity: 0,
            filter: "blur(8px)",
            letterSpacing: "0.7em",
          }}
          animate={{
            opacity: 1,
            filter: "blur(0px)",
            letterSpacing: "0.32em",
          }}
          transition={{
            delay: 0.35,
            duration: 0.9,
            ease: [0.16, 1, 0.3, 1],
          }}
        >
          LEXYRA
        </motion.div>

        <motion.p
          className="boot-intro__subtitle"
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 0.58, y: 0 }}
          transition={{
            delay: 0.75,
            duration: 0.6,
          }}
        >
          YOUR THOUGHTS, REFINED.
        </motion.p>

        <motion.div
          className="boot-intro__progress"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6, duration: 0.4 }}
        >
          <motion.span
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{
              duration: 1.6,
              delay: 0.65,
              ease: [0.65, 0, 0.35, 1],
            }}
          />
        </motion.div>

        <motion.div
          className="boot-intro__status"
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.45 }}
          transition={{ delay: 0.9, duration: 0.5 }}
        >
          INITIALIZING WORKSPACE
        </motion.div>
      </div>

      <div className="boot-intro__footer">
        <span>LEX / 001</span>
        <span>LANGUAGE SYSTEM</span>
      </div>
    </motion.div>
  );
}