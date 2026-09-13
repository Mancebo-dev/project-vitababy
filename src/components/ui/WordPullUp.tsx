"use client";

import { motion, type Variants } from "framer-motion";

interface WordPullUpProps {
  words: string;
  className?: string;
}

export function WordPullUp({ words, className }: WordPullUpProps) {
  const container: Variants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const item: Variants = {
    hidden: { y: 15, opacity: 0 },
    show: {
      y: 0,
      opacity: 1,
      transition: { duration: 0.8, ease: [0.21, 0.47, 0.32, 0.98] },
    },
  };

  return (
    <motion.h1
      variants={container}
      initial="hidden"
      animate="show"
      className={className}
    >
      {words.split(" ").map((word, i) => (
        <motion.span
          // biome-ignore lint/suspicious/noArrayIndexKey: As palavras são estáticas e a ordem não muda
          key={`${word}-${i}`}
          variants={item}
          style={{ display: "inline-block", paddingRight: "0.25em" }}
        >
          {word}
        </motion.span>
      ))}
    </motion.h1>
  );
}
