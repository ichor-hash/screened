import React from 'react';
import { AppSettings } from '../../lib/types';
import styles from '../EditorPanel.module.css';

interface SettingsFormProps {
  settings: AppSettings;
  onSettingsChange: (newSettings: AppSettings) => void;
}

export default function SettingsForm({ settings, onSettingsChange }: SettingsFormProps) {
  return (
    <div className={styles.formSection}>
      <div className={styles.sectionHeader}>
        <h3>BYOK & Future Integrations</h3>
        <span className={styles.experimentalBadge}>Future Capabilities</span>
      </div>

      <div className={styles.settingsGrid}>
        {/* OpenAI / Gemini BYOK */}
        <div className={styles.settingsCard}>
          <div className={styles.settingsCardHeader}>
            <h4>AI Optimization Engine (BYOK)</h4>
          </div>
          <p className={styles.settingsDesc}>
            Provide your own OpenAI or Gemini API Key to enable future interactive features like bullet polishing, translation, and auto-tailoring to job descriptions. Your keys are saved directly in local storage and never leave your browser.
          </p>
          <div className={styles.row} style={{ marginTop: '12px' }}>
            <div className={styles.inputGroup}>
              <label>AI Provider</label>
              <select
                value={settings.aiProvider}
                onChange={(e) => onSettingsChange({ ...settings, aiProvider: e.target.value as any })}
              >
                <option value="gemini">Google Gemini API (Recommended)</option>
                <option value="openai">OpenAI GPT-4o API</option>
              </select>
            </div>
            <div className={styles.inputGroup}>
              <label>API Key</label>
              <input
                type="password"
                placeholder="sk-..."
                value={settings.aiApiKey}
                onChange={(e) => onSettingsChange({ ...settings, aiApiKey: e.target.value })}
              />
            </div>
          </div>
        </div>

        {/* GitHub GraphQL Sync */}
        <div className={styles.settingsCard}>
          <div className={styles.settingsCardHeader}>
            <h4>GitHub Integration</h4>
          </div>
          <p className={styles.settingsDesc}>
            Pulls repository details, languages, and star counts directly from the GitHub GraphQL API to auto-fill projects.
          </p>
          <div className={styles.inputGroup} style={{ marginTop: '12px' }}>
            <label>GitHub Personal Access Token</label>
            <input
              type="password"
              placeholder="ghp_..."
              value={settings.githubToken}
              onChange={(e) => onSettingsChange({ ...settings, githubToken: e.target.value })}
            />
          </div>
        </div>

        {/* LinkedIn Scraper Sync */}
        <div className={styles.settingsCard}>
          <div className={styles.settingsCardHeader}>
            <h4>LinkedIn Profile Integration</h4>
          </div>
          <p className={styles.settingsDesc}>
            Syncs positions, certifications, and academic background from your LinkedIn profile via RapidAPI profile scraper endpoints.
          </p>
          <div className={styles.inputGroup} style={{ marginTop: '12px' }}>
            <label>LinkedIn RapidAPI Key</label>
            <input
              type="password"
              placeholder="rapidapi-key..."
              value={settings.linkedinApiKey}
              onChange={(e) => onSettingsChange({ ...settings, linkedinApiKey: e.target.value })}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
