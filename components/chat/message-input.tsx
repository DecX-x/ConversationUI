'use client';

import React, { useState, useRef, useEffect } from 'react';
import { ArrowRightCircle, ImageIcon, X , Square } from 'lucide-react';
import { motion } from 'framer-motion';

interface MessageInputProps {
  onSendMessage: (message: string, image?: string) => void;
  isLoading: boolean;
  onInterrupt?: () => void;
}

export function MessageInput({ onSendMessage, isLoading, onInterrupt }: MessageInputProps) {
  const [message, setMessage] = useState('');
  const [image, setImage] = useState<string | null>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (message.trim() && !isLoading) {
      onSendMessage(message, image || undefined);
      setMessage('');
      setImage(null);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  }, [message]);

  return (
    <div className="space-y-4">
      {image && (
        <div className="relative inline-block">
          <img src={image} alt="Upload preview" className="max-h-32 rounded-lg" />
          <button
            onClick={() => setImage(null)}
            className="absolute -top-2 -right-2 p-1 bg-destructive text-destructive-foreground rounded-full hover:opacity-90"
          >
            <X size={14} />
          </button>
        </div>
      )}
      <form 
        onSubmit={handleSubmit}
        className="relative border border-input rounded-lg bg-background shadow-lg"
      >
        <textarea
          ref={textareaRef}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Ask a question..."
          className="w-full resize-none py-3 pl-4 pr-24 bg-transparent focus:outline-none min-h-[50px] max-h-[200px]"
          rows={1}
          disabled={isLoading}
        />
        <div className="absolute right-2 bottom-2 flex gap-2">
          <motion.button
            whileTap={{ scale: 0.95 }}
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="p-2 rounded-md text-foreground hover:bg-accent"
            disabled={isLoading}
          >
            <ImageIcon size={18} />
          </motion.button>
          {isLoading ? (
            <motion.button
              whileTap={{ scale: 0.95 }}
              type="button"
              onClick={onInterrupt}
              className="p-2 rounded-md text-destructive hover:bg-destructive/10"
            >
              <Square size={18} />
            </motion.button>
          ) : (
            <motion.button
              whileTap={{ scale: 0.95 }}
              type="submit"
              className="p-2 rounded-md text-foreground hover:bg-accent disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={!message.trim() || isLoading}
            >
              <ArrowRightCircle size={18} />
            </motion.button>
          )}
        </div>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleImageUpload}
          className="hidden"
        />
      </form>
    </div>
  );
}