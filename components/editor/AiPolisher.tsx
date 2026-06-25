import React, { useState, useEffect } from 'react';
import { AppSettings } from '../../lib/types';
import {
  isWebGpuSupported,
  loadLocalModel,
  polishBulletLocal,
  polishBulletCloud,
  ModelLoadProgress,
} from '../../lib/aiService';
import styles from './AiPolisher.module.css';

interface AiPolisherProps {
  originalText: string;
  onApply: (newText: string) => void;
  onClose: () => void;
  settings: AppSettings;
}

export default function AiPolisher({ originalText, onApply, onClose, settings }: AiPolisherProps) {
  const [polishedText, setPolishedText] = useState<string>('');
  const [mode, setMode] = useState<'local' | 'cloud'>('cloud');
  const [instruction, setInstruction] = useState<string>('general');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [loadProgress, setLoadProgress] = useState<ModelLoadProgress | null>(null);
  const [webGpuAvailable, setWebGpuAvailable] = useState<boolean>(false);
  const [error, setError] = useState<string>('');
  const [localEngine, setLocalEngine] = useState<any>(null);

  useEffect(() => {
    const supported = isWebGpuSupported();
    setWebGpuAvailable(supported);
    // Default to local WebGPU if supported, otherwise cloud
    if (supported) {
      setMode('local');
    } else {
      setMode('cloud');
    }
  }, []);

  const handlePolish = async (selectedInstruction: string = instruction) => {
    setIsLoading(true);
    setError('');
    setInstruction(selectedInstruction);

    try {
      if (mode === 'local') {
        let engine = localEngine;
        if (!engine) {
          engine = await loadLocalModel(
            'Qwen2.5-0.5B-Instruct-q4f16_1-MLC',
            (progressReport) => setLoadProgress(progressReport)
          );
          setLocalEngine(engine);
          setLoadProgress(null); // Clear progress when done loading
        }
        const result = await polishBulletLocal(engine, originalText, selectedInstruction);
        setPolishedText(result);
      } else {
        // Cloud BYOK mode
        if (!settings.aiApiKey) {
          throw new Error(
            `API Key for ${
              settings.aiProvider === 'gemini' ? 'Google Gemini' : 'OpenAI'
            } is missing. Configure it in the BYOK settings tab first.`
          );
        }
        const result = await polishBulletCloud(settings, originalText, selectedInstruction);
        setPolishedText(result);
      }
    } catch (err: any) {
      console.error(err);
      setError(err?.message || 'Failed to polish text. Check console for details.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleApply = () => {
    if (polishedText.trim()) {
      onApply(polishedText.trim());
      onClose();
    }
  };

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className={styles.header}>
          <h3>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ marginRight: '8px' }}>
              <path d="m21 16-1 2-2 1 2 1 1 2 1-2 2-1-2-1-1-2zm-9-4-3 6-6 3 6 3 3 6 3-6 6-3-6-3-3-6zm-4-4-1 2-2 1 2 1 1 2 1-2 2-1-2-1-1-2z"/>
            </svg>
            AI Bullet Polisher
          </h3>
          <button className={styles.closeButton} onClick={onClose} aria-label="Close">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
          </button>
        </div>

        {/* Content */}
        <div className={styles.content}>
          {/* Engine Mode selector */}
          <div className={styles.engineSelector}>
            <button
              type="button"
              className={`${styles.engineTab} ${mode === 'local' ? styles.engineTabActive : ''} ${
                !webGpuAvailable ? styles.engineTabDisabled : ''
              }`}
              onClick={() => webGpuAvailable && setMode('local')}
              disabled={!webGpuAvailable}
              title={!webGpuAvailable ? 'WebGPU not supported on this browser' : ''}
            >
              Local Offline LLM
            </button>
            <button
              type="button"
              className={`${styles.engineTab} ${mode === 'cloud' ? styles.engineTabActive : ''}`}
              onClick={() => setMode('cloud')}
            >
              Cloud API (BYOK)
            </button>
          </div>

          {/* Helper notes */}
          {mode === 'local' ? (
            <div className={styles.infoBox}>
              Using <strong>Qwen-2.5 0.5B Instruct</strong> locally. First run downloads the model (~350MB). Subsequent polishes are instant.
            </div>
          ) : (
            <div className={styles.infoBox}>
              Using your configured {settings.aiProvider === 'gemini' ? 'Google Gemini' : 'OpenAI'} API Key.
              {!settings.aiApiKey && (
                <span className={styles.warningText}>
                  No API Key configured. Please go to the BYOK & Sync tab.
                </span>
              )}
            </div>
          )}

          {!webGpuAvailable && mode === 'local' && (
            <div className={styles.warningBox}>
              WebGPU is disabled or unsupported. Switch to Cloud API mode.
            </div>
          )}

          {/* Original Text comparison */}
          <div className={styles.originalSection}>
            <span className={styles.label}>Original Bullet Point</span>
            <div className={styles.originalText}>{originalText || 'No text provided.'}</div>
          </div>

          {/* Preset optimization buttons */}
          <div className={styles.originalSection}>
            <span className={styles.label}>Choose Polish Strategy</span>
            <div className={styles.presetsGrid}>
              <button
                type="button"
                className={`${styles.presetButton} ${instruction === 'general' ? styles.presetButtonActive : ''}`}
                onClick={() => handlePolish('general')}
                disabled={isLoading}
              >
                General Improve
              </button>
              <button
                type="button"
                className={`${styles.presetButton} ${instruction === 'verb' ? styles.presetButtonActive : ''}`}
                onClick={() => handlePolish('verb')}
                disabled={isLoading}
              >
                Strong Verbs Boost
              </button>
              <button
                type="button"
                className={`${styles.presetButton} ${instruction === 'quantify' ? styles.presetButtonActive : ''}`}
                onClick={() => handlePolish('quantify')}
                disabled={isLoading}
              >
                Quantify Impact
              </button>
              <button
                type="button"
                className={`${styles.presetButton} ${instruction === 'tighten' ? styles.presetButtonActive : ''}`}
                onClick={() => handlePolish('tighten')}
                disabled={isLoading}
              >
                Tighten & Condense
              </button>
            </div>
          </div>

          {/* Error Message */}
          {error && <div className={styles.warningBox}>{error}</div>}

          {/* Download Progress */}
          {loadProgress && (
            <div className={styles.progressContainer}>
              <div className={styles.progressHeader}>
                <span>Downloading Local Model...</span>
                <span>{Math.round(loadProgress.progress * 100)}%</span>
              </div>
              <div className={styles.progressTrack}>
                <div className={styles.progressBar} style={{ width: `${loadProgress.progress * 100}%` }} />
              </div>
              <div className={styles.progressText}>
                {loadProgress.text}
              </div>
            </div>
          )}

          {/* Generator Loader */}
          {isLoading && !loadProgress && (
            <div className={styles.loadingSpinnerRow}>
              <div className={styles.spinnerSmall} />
              <span>Analyzing syntax and rewriting...</span>
            </div>
          )}

          {/* Output block */}
          {(polishedText || isLoading) && (
            <div className={styles.outputSection}>
              <span className={styles.label}>Polished Result (Editable)</span>
              <textarea
                className={styles.outputTextarea}
                value={polishedText}
                onChange={(e) => setPolishedText(e.target.value)}
                placeholder="AI optimized result will appear here..."
                disabled={isLoading}
              />
            </div>
          )}
        </div>

        {/* Footer */}
        <div className={styles.footer}>
          <button className="secondary" onClick={onClose} disabled={isLoading}>
            Cancel
          </button>
          <button
            className="primary"
            onClick={handleApply}
            disabled={isLoading || !polishedText.trim()}
          >
            Apply Changes
          </button>
        </div>
      </div>
    </div>
  );
}

