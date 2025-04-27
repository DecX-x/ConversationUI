'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Calculator, Code2, FileText, Layout } from 'lucide-react';

const prompts = [
  {
    icon: <Calculator className="w-6 h-6" />,
    title: "Create a Calculator",
    content: "Create a calculator using TypeScript with basic arithmetic operations and a modern UI design."
  },
  {
    icon: <Layout className="w-6 h-6" />,
    title: "Design a Dashboard",
    content: "Build a responsive admin dashboard with TypeScript, including charts, tables, and dark mode support."
  },
  {
    icon: <FileText className="w-6 h-6" />,
    title: "Todo Application",
    content: "Develop a todo list application with TypeScript featuring CRUD operations and local storage persistence."
  },
  {
    icon: <Code2 className="w-6 h-6" />,
    title: "Weather App",
    content: "Create a weather application using TypeScript that fetches and displays weather data from an API."
  }
];

interface ExamplePromptsProps {
  onSelectPrompt: (prompt: string) => void;
}

export function ExamplePrompts({ onSelectPrompt }: ExamplePromptsProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {prompts.map((prompt, index) => (
        <motion.button
          key={prompt.title}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
          onClick={() => onSelectPrompt(prompt.content)}
          className="flex items-start gap-4 p-4 rounded-lg border border-border/40 hover:bg-accent/40 transition-colors text-left"
        >
          <div className="mt-1 text-primary">{prompt.icon}</div>
          <div className="space-y-1">
            <h3 className="font-medium">{prompt.title}</h3>
            <p className="text-sm text-muted-foreground">{prompt.content}</p>
          </div>
        </motion.button>
      ))}
    </div>
  );
}