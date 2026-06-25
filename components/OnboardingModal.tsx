"use client";

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import styles from './OnboardingModal.module.css';
import { AppSettings } from './EditorPanel';

interface OnboardingModalProps {
  completeOnboarding: () => void;
  settings: AppSettings;
  setSettings: (settings: AppSettings) => void;
}

export default function OnboardingModal({ completeOnboarding, settings, setSettings }: OnboardingModalProps) {
  const [currentStep, setCurrentStep] = useState(0);

  const steps = [
    {
      id: 'welcome',
      title: 'Screened.',
      content: (
        <p className={styles.description}>
          The applicant tracking system is broken. It filters out the best engineers because of missing lexical density or unreadable formatting.<br/><br/>
          We built <span className={styles.highlight}>Screened</span> to fix this. It forces you to write ATS-optimized, metric-driven bullet points and outputs clean LaTeX.
        </p>
      )
    },
    {
      id: 'philosophy',
      title: 'The Architecture',
      content: (
        <p className={styles.description}>
          This is not a toy. Treat your resume like code.<br/><br/>
          <span className={styles.highlight}>1. Branches:</span> Create different versions of your profile and switch instantly.<br/>
          <span className={styles.highlight}>2. Local First:</span> Your data never leaves your browser.<br/>
          <span className={styles.highlight}>3. Brutal ATS Parsing:</span> Real-time metric density and action verb auditing.
        </p>
      )
    },
    {
      id: 'api',
      title: 'Bring Your Own Key',
      content: (
        <>
          <p className={styles.description}>
            To use the AI Bullet Polisher, provide an API key. If you leave this blank, the app will try to use your local GPU via WebGPU (which requires a powerful machine).
          </p>
          <div className={styles.inputGroup}>
            <label className={styles.label}>Gemini API Key (Optional)</label>
            <input 
              type="password" 
              className={styles.input} 
              placeholder="AIzaSy..." 
              value={settings.aiApiKey || ''}
              onChange={(e) => settings && setSettings({...settings, aiApiKey: e.target.value})}
            />
          </div>
        </>
      )
    },
    {
      id: 'ready',
      title: 'Ready.',
      content: (
        <p className={styles.description}>
          No emojis. Pure utility. Matte black.<br/><br/>
          Go build the resume that gets you hired.
        </p>
      )
    }
  ];

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(prev => prev + 1);
    } else {
      completeOnboarding();
    }
  };

  const handleBack = () => {
    if (currentStep > 0) setCurrentStep(prev => prev - 1);
  };

  return (
    <div className={styles.overlay}>
      <motion.div 
        className={styles.modal}
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
      >
        <button className={styles.skipBtn} onClick={completeOnboarding}>Skip</button>
        
        <div className={styles.content}>
          <AnimatePresence mode="wait">
            <motion.div
              key={currentStep}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3, ease: 'easeOut' }}
            >
              <h2 className={styles.title}>{steps[currentStep].title}</h2>
              {typeof steps[currentStep].content === 'function' 
                ? (steps[currentStep].content as any)() 
                : steps[currentStep].content}
            </motion.div>
          </AnimatePresence>
        </div>

        <div className={styles.footer}>
          <div className={styles.stepIndicator}>
            {steps.map((_, idx) => (
              <div 
                key={idx} 
                className={`${styles.dot} ${idx === currentStep ? styles.dotActive : ''}`} 
              />
            ))}
          </div>
          
          <div className={styles.buttonRow}>
            {currentStep > 0 && (
              <button className={styles.btnSecondary} onClick={handleBack}>
                Back
              </button>
            )}
            <button className={styles.btnPrimary} onClick={handleNext}>
              {currentStep === steps.length - 1 ? 'Start Building' : 'Continue'}
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
