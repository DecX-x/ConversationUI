'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowDownCircle } from 'lucide-react';

interface NewMessageIndicatorProps {
  show: boolean;
  onClick: () => void;
}

export function NewMessageIndicator({ show, onClick }: NewMessageIndicatorProps) {
  return (
    <AnimatePresence>
      {show && (
        <motion.button
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 10 }}
          onClick={onClick}
          className="absolute bottom-20 left-1/2 -translate-x-1/2 flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-full shadow-lg hover:opacity-90 transition-opacity"
        >
          <ArrowDownCircle size={16} />
          <span className="text-sm font-medium">New message</span>
        </motion.button>
      )}
    </AnimatePresence>
  );
}