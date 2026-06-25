'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { ResumeState, AppSettings } from '../lib/types';
import styles from './EditorPanel.module.css';

// Import modular form components
import PersonalInfoForm from './editor/PersonalInfoForm';
import ExperienceForm from './editor/ExperienceForm';
import EducationForm from './editor/EducationForm';
import ProjectsForm from './editor/ProjectsForm';
import SkillsForm from './editor/SkillsForm';
import SettingsForm from './editor/SettingsForm';
import AiPolisher from './editor/AiPolisher';

export type { AppSettings };

interface EditorPanelProps {
  data: ResumeState;
  onChange: (newData: ResumeState) => void;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  settings: AppSettings;
  onSettingsChange: (newSettings: AppSettings) => void;
  isLoading?: boolean;
}

export default function EditorPanel({
  data,
  onChange,
  activeTab,
  setActiveTab,
  settings,
  onSettingsChange,
  isLoading = false,
}: EditorPanelProps) {
  const [activePolish, setActivePolish] = React.useState<{
    originalText: string;
    onApply: (newText: string) => void;
  } | null>(null);
  
  if (isLoading) {
    return (
      <div className={styles.panel}>
        <div className={styles.tabs}>
          {[1, 2, 3, 4, 5].map((i) => (
            <div
              key={i}
              className="skeleton skeletonButton"
              style={{ margin: '8px 4px', width: '90px' }}
            />
          ))}
        </div>
        <div className={styles.formContent}>
          <div className={styles.formSection}>
            <div className={styles.sectionHeader}>
              <div className="skeleton skeletonTitle" style={{ width: '150px' }} />
            </div>
            <div className={styles.row}>
              <div className={styles.inputGroup}>
                <div className="skeleton skeletonText" style={{ width: '50px', marginBottom: '8px' }} />
                <div className="skeleton skeletonInput" />
              </div>
              <div className={styles.inputGroup}>
                <div className="skeleton skeletonText" style={{ width: '70px', marginBottom: '8px' }} />
                <div className="skeleton skeletonInput" />
              </div>
            </div>
            <div className={styles.row} style={{ marginTop: '16px' }}>
              <div className={styles.inputGroup}>
                <div className="skeleton skeletonText" style={{ width: '40px', marginBottom: '8px' }} />
                <div className="skeleton skeletonInput" />
              </div>
              <div className={styles.inputGroup}>
                <div className="skeleton skeletonText" style={{ width: '80px', marginBottom: '8px' }} />
                <div className="skeleton skeletonInput" />
              </div>
            </div>
            <div className={styles.row} style={{ marginTop: '16px' }}>
              <div className={styles.inputGroup}>
                <div className="skeleton skeletonText" style={{ width: '60px', marginBottom: '8px' }} />
                <div className="skeleton skeletonInput" />
              </div>
              <div className={styles.inputGroup}>
                <div className="skeleton skeletonText" style={{ width: '40px', marginBottom: '8px' }} />
                <div className="skeleton skeletonInput" />
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const tabs = [
    { id: 'personal', label: 'Personal Info' },
    { id: 'experience', label: 'Experience' },
    { id: 'education', label: 'Education' },
    { id: 'projects', label: 'Projects' },
    { id: 'skills', label: 'Skills' },
    { id: 'settings', label: 'BYOK & Sync' },
  ];

  return (
    <div className={styles.panel}>
      <div className={styles.tabs}>
        {tabs.map((tab) => {
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`${styles.tab} ${isActive ? styles.activeTab : ''}`}
              style={{ position: 'relative' }}
            >
              {isActive && (
                <motion.span
                  layoutId="activeEditorTab"
                  className={styles.tabIndicator}
                  transition={{ type: 'spring', stiffness: 350, damping: 32 }}
                />
              )}
              <span style={{ position: 'relative', zIndex: 2 }}>{tab.label}</span>
            </button>
          );
        })}
      </div>

      <div className={styles.formContent}>
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.15, ease: 'easeOut' }}
          style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: '20px' }}
        >
          {activeTab === 'personal' && (
            <PersonalInfoForm
              data={data.personalInfo}
              onChange={(personalInfo) => onChange({ ...data, personalInfo })}
            />
          )}

          {activeTab === 'experience' && (
            <ExperienceForm
              list={data.experience}
              onChange={(experience) => onChange({ ...data, experience })}
              onPolish={(originalText, onApply) => setActivePolish({ originalText, onApply })}
            />
          )}

          {activeTab === 'education' && (
            <EducationForm
              list={data.education}
              onChange={(education) => onChange({ ...data, education })}
            />
          )}

          {activeTab === 'projects' && (
            <ProjectsForm
              list={data.projects}
              onChange={(projects) => onChange({ ...data, projects })}
              onPolish={(originalText, onApply) => setActivePolish({ originalText, onApply })}
            />
          )}

          {activeTab === 'skills' && (
            <SkillsForm
              list={data.skills}
              onChange={(skills) => onChange({ ...data, skills })}
            />
          )}

          {activeTab === 'settings' && (
            <SettingsForm
              settings={settings}
              onSettingsChange={onSettingsChange}
            />
          )}
        </motion.div>
      </div>

      {activePolish && (
        <AiPolisher
          originalText={activePolish.originalText}
          onApply={activePolish.onApply}
          onClose={() => setActivePolish(null)}
          settings={settings}
        />
      )}
    </div>
  );
}
