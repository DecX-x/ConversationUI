'use client';

import React from 'react';
import { Message as MessageType } from '@/lib/types';
import { User, Bot } from 'lucide-react';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

interface MessageProps {
  message: MessageType;
}

export function Message({ message }: MessageProps) {
  const isUser = message.role === 'user';

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className={cn(
        "flex gap-3 p-4 rounded-lg",
        isUser ? "bg-accent/40" : "bg-background"
      )}
    >
      <div className="flex-shrink-0">
        <div className={cn(
          "flex items-center justify-center w-8 h-8 rounded-full",
          isUser ? "bg-primary text-primary-foreground" : "bg-secondary text-secondary-foreground"
        )}>
          {isUser ? <User size={18} /> : <Bot size={18} />}
        </div>
      </div>
      <div className="flex-1 space-y-2">
        <div className="text-sm font-medium">
          {isUser ? 'You' : 'AI Assistant'}
        </div>
        <div className="text-foreground space-y-4">
          {message.image && (
            <img src={message.image} alt="Uploaded content" className="max-w-sm rounded-lg" />
          )}
          <div className="prose prose-sm max-w-full dark:prose-invert">
            <ReactMarkdown
              remarkPlugins={[remarkGfm]}
              components={{
                code({ inline, className, children, ...props }) {
                  const match = /language-(\w+)/.exec(className || '');
                  return !inline ? (
                    <div className="relative mt-2 rounded-lg bg-accent/50">
                      {match && (
                        <div className="absolute top-2 right-2 text-xs text-muted-foreground bg-background/80 px-2 py-1 rounded">
                          {match[1]}
                        </div>
                      )}
                      <pre className="overflow-x-auto scrollbar-thin scrollbar-thumb-border scrollbar-track-transparent">
                        <code className={`${className} block p-4 text-sm font-mono`} {...props}>
                          {children}
                        </code>
                      </pre>
                    </div>
                  ) : (
                    <code className="bg-muted px-1 rounded text-sm font-mono" {...props}>
                      {children}
                    </code>
                  );
                }
              }}
            >
              {message.content}
            </ReactMarkdown>
          </div>
        </div>
        <div className="text-xs text-muted-foreground">
          {message.timestamp.toLocaleTimeString()}
        </div>
      </div>
    </motion.div>
  );
}