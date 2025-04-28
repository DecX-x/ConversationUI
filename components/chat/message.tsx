'use client';

import React from 'react';
import Image from 'next/image'; // Import next/image
import { Message as MessageType } from '@/lib/types';
import { User, Bot } from 'lucide-react';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';
import ReactMarkdown, { Components } from 'react-markdown'; // Import Components type
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
        </div>
        <div className="text-foreground space-y-4">
          {message.image && (
            // Use next/image for optimization
            <div className="relative w-full max-w-sm aspect-square"> {/* Adjust aspect ratio as needed */}
              <Image
                src={message.image}
                alt="Uploaded content"
                fill // Use fill layout
                className="rounded-lg object-contain" // Adjust object-fit as needed
              />
            </div>
          )}
          <div className="prose prose-sm max-w-full dark:prose-invert">
            <ReactMarkdown
              remarkPlugins={[remarkGfm]}
              components={{
                // Use div for paragraphs to avoid hydration errors with nested blocks
                p({node, children, ...props}) {
                  // Check if the paragraph only contains a single code block
                  // This check might need refinement based on actual node structure
                  if (React.isValidElement(children) && Array.isArray(children) && children.length === 1 && children[0].props?.node?.tagName === 'code' && !children[0].props?.inline) {
                    return <>{children}</>; // Render code block directly without wrapping div/p
                  }
                  return <div {...props} className="whitespace-pre-wrap mb-2 last:mb-0">{children}</div>;
                },
                // Explicitly type props for code component
                code({ node, inline, className, children, ...props }: { node?: any; inline?: boolean; className?: string; children?: React.ReactNode }) {
                  const match = /language-(\w+)/.exec(className || '');
                  return !inline ? (
                    // Render pre directly to avoid div inside p hydration error
                    <pre className={cn(
                      "relative mt-2 rounded-lg bg-accent/50 overflow-x-auto scrollbar-thin scrollbar-thumb-border scrollbar-track-transparent",
                      className // Pass className to pre for language styling
                    )} {...props}>
                       {match && (
                        <div className="absolute top-2 right-2 text-xs text-muted-foreground bg-background/80 px-2 py-1 rounded">
                          {match[1]}
                        </div>
                      )}
                      <code className="block p-4 text-sm font-mono"> {/* Remove className from code tag if passed to pre */}
                        {children}
                      </code>
                    </pre>
                  ) : (
                    <code className={cn("bg-muted px-1 rounded text-sm font-mono", className)} {...props}>
                      {children}
                    </code>
                  );
                }
              } as Components } // Assert type for components object
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