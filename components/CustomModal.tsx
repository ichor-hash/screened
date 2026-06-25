"use client";

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import styles from './CustomModal.module.css';

export type ModalType = 'alert' | 'confirm' | 'prompt';

export interface ModalState {
  isOpen: boolean;
  type: ModalType;
  title: string;
  message: string;
  defaultValue?: string;
  isDanger?: boolean;
}

interface CustomModalProps extends ModalState {
  onConfirm: (value?: string) => void;
  onCancel: () => void;
}

export default function CustomModal({
  isOpen,
  type,
  title,
  message,
  defaultValue = '',
  isDanger = false,
  onConfirm,
  onCancel
}: CustomModalProps) {
  const [inputValue, setInputValue] = useState(defaultValue);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      setInputValue(defaultValue);
      if (type === 'prompt') {
        // slight delay to ensure the modal is mounted
        setTimeout(() => inputRef.current?.focus(), 100);
      }
    }
  }, [isOpen, defaultValue, type]);

  const handleSubmit = (e?: React.FormEvent) => {
    e?.preventDefault();
    onConfirm(type === 'prompt' ? inputValue : undefined);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className={styles.overlay}>
          <motion.div 
            className={styles.modal}
            initial={{ opacity: 0, scale: 0.95, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 10 }}
            transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
            style={{ willChange: 'transform, opacity' }}
          >
            <div className={styles.header}>
              <h3 className={styles.title}>{title}</h3>
            </div>
            
            <form onSubmit={handleSubmit}>
              <div className={styles.body}>
                {message && <p className={styles.message}>{message}</p>}
                
                {type === 'prompt' && (
                  <input
                    ref={inputRef}
                    type="text"
                    className={styles.input}
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    placeholder="Type here..."
                  />
                )}
              </div>
              
              <div className={styles.footer}>
                {type !== 'alert' && (
                  <button type="button" className={styles.btnSecondary} onClick={onCancel}>
                    Cancel
                  </button>
                )}
                <button 
                  type="submit" 
                  className={isDanger ? styles.btnDanger : styles.btnPrimary}
                >
                  {type === 'alert' ? 'OK' : 'Confirm'}
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
