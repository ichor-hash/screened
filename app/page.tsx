'use client';

import React, { useState } from 'react';
import { defaultResumeData } from '../lib/defaultData';
import { checkAts } from '../lib/atsChecker';
import { useResumeStore } from '../lib/useResumeStore';
import EditorPanel from '../components/EditorPanel';
import PreviewPanel from '../components/PreviewPanel';
import AtsPanel from '../components/AtsPanel';
import Navbar from '../components/Navbar';
import OnboardingModal from '../components/OnboardingModal';
import CustomModal, { ModalState } from '../components/CustomModal';
import styles from './page.module.css';

export default function Home() {
  const [activeTab, setActiveTab] = useState<string>('personal');
  const [previewMode, setPreviewMode] = useState<'visual' | 'latex'>('visual');

  const {
    isStoreReady,
    versions,
    activeVersion,
    activeVersionId,
    setActiveVersionId,
    resumeData,
    handleDataChange,
    handleCreateBranch,
    handleRenameBranch,
    handleDeleteBranch,
    theme,
    handleThemeToggle,
    settings,
    setSettings,
    hasCompletedOnboarding,
    completeOnboarding
  } = useResumeStore();

  const [modal, setModal] = useState<ModalState & { onConfirm: (val?: string) => void, onCancel: () => void }>({
    isOpen: false,
    type: 'alert',
    title: '',
    message: '',
    onConfirm: () => {},
    onCancel: () => {}
  });

  const closeModal = () => setModal(prev => ({ ...prev, isOpen: false }));

  const showAlert = (title: string, message: string, isDanger = false) => {
    setModal({
      isOpen: true,
      type: 'alert',
      title,
      message,
      isDanger,
      onConfirm: closeModal,
      onCancel: closeModal
    });
  };

  const handleReset = () => {
    setModal({
      isOpen: true,
      type: 'confirm',
      title: 'Reset to Sample Data',
      message: 'Are you sure you want to reset your resume to the sample data? This will overwrite your current changes.',
      isDanger: true,
      onConfirm: () => {
        handleDataChange(defaultResumeData);
        setActiveTab('personal');
        closeModal();
      },
      onCancel: closeModal
    });
  };

  const handleClear = () => {
    setModal({
      isOpen: true,
      type: 'confirm',
      title: 'Clear Resume Data',
      message: 'Are you sure you want to clear all data on this branch? This will erase your current resume content.',
      isDanger: true,
      onConfirm: () => {
        handleDataChange({
          personalInfo: {
            fullName: '',
            jobTitle: '',
            email: '',
            phone: '',
            location: '',
            website: '',
            linkedin: '',
            github: '',
          },
          experience: [],
          education: [],
          projects: [],
          skills: [],
        });
        setActiveTab('personal');
        closeModal();
      },
      onCancel: closeModal
    });
  };

  const handleExportJSON = () => {
    const jsonString = `data:text/json;charset=utf-8,${encodeURIComponent(
      JSON.stringify(resumeData, null, 2)
    )}`;
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', jsonString);
    
    const nameStr = resumeData.personalInfo.fullName ? resumeData.personalInfo.fullName.replace(/\s+/g, '_') : 'Resume';
    downloadAnchor.setAttribute('download', `${nameStr}_data.json`);
    
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    document.body.removeChild(downloadAnchor);
  };

  const handleImportJSON = (e: React.ChangeEvent<HTMLInputElement>) => {
    const fileReader = new FileReader();
    const files = e.target.files;
    if (!files || files.length === 0) return;

    fileReader.onload = (event) => {
      try {
        const parsed = JSON.parse(event.target?.result as string);
        if (parsed.personalInfo) {
          handleDataChange(parsed);
          showAlert('Success', 'Resume JSON imported successfully into the active branch!');
        } else {
          showAlert('Invalid Format', 'Make sure the JSON has the correct resume data structure.', true);
        }
      } catch (err) {
        showAlert('Parse Error', 'Failed to parse JSON file.', true);
      }
    };
    fileReader.readAsText(files[0]);
    e.target.value = '';
  };

  const { overallScore } = checkAts(resumeData);

  return (
    <div className={styles.workspace}>
      <Navbar
        versions={versions}
        activeVersion={activeVersion}
        activeVersionId={activeVersionId}
        setActiveVersionId={setActiveVersionId}
        handleCreateBranch={handleCreateBranch}
        handleRenameBranch={handleRenameBranch}
        handleDeleteBranch={handleDeleteBranch}
        overallScore={overallScore}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        handleImportJSON={handleImportJSON}
        handleExportJSON={handleExportJSON}
        handleReset={handleReset}
        handleClear={handleClear}
        theme={theme}
        handleThemeToggle={handleThemeToggle}
        isLoading={!isStoreReady}
      />

      {/* Main Workspace Panels split */}
      <main className={styles.mainGrid}>
        {/* Left Side: Editor Form */}
        <section className={`${styles.leftPane} no-print`}>
          {activeTab === 'ats' ? (
            <div className={styles.atsContainer}>
              <div className={styles.backButtonRow}>
                <button className="secondary" onClick={() => setActiveTab('personal')}>
                  ← Back to Editor
                </button>
              </div>
              <AtsPanel data={resumeData} isLoading={!isStoreReady} />
            </div>
          ) : (
            <EditorPanel
              data={resumeData}
              onChange={handleDataChange}
              activeTab={activeTab}
              setActiveTab={setActiveTab}
              settings={settings}
              onSettingsChange={setSettings}
              isLoading={!isStoreReady}
            />
          )}
        </section>

        {/* Right Side: Resume Render / Exporter */}
        <section className={styles.rightPane}>
          <PreviewPanel
            data={resumeData}
            previewMode={previewMode}
            setPreviewMode={setPreviewMode}
            isLoading={!isStoreReady}
          />
        </section>
      </main>

      {/* Onboarding Wizard */}
      {isStoreReady && !hasCompletedOnboarding && (
        <OnboardingModal 
          completeOnboarding={completeOnboarding} 
          settings={settings} 
          setSettings={setSettings} 
        />
      )}

      {/* Global Modals */}
      <CustomModal {...modal} onCancel={closeModal} />
    </div>
  );
}
