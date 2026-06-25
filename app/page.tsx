'use client';

import React, { useState } from 'react';
import { defaultResumeData } from '../lib/defaultData';
import { checkAts } from '../lib/atsChecker';
import { useResumeStore } from '../lib/useResumeStore';
import EditorPanel from '../components/EditorPanel';
import PreviewPanel from '../components/PreviewPanel';
import AtsPanel from '../components/AtsPanel';
import Navbar from '../components/Navbar';
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
  } = useResumeStore();

  const handleReset = () => {
    if (window.confirm('Are you sure you want to reset your resume to the sample data? This will overwrite your current changes.')) {
      handleDataChange(defaultResumeData);
      setActiveTab('personal');
    }
  };

  const handleClear = () => {
    if (window.confirm('Are you sure you want to clear all data on this branch? This will erase your current resume content.')) {
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
    }
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
          alert('Resume JSON imported successfully into the active branch!');
        } else {
          alert('Invalid file format: Make sure the JSON has the correct resume data structure.');
        }
      } catch (err) {
        alert('Failed to parse JSON file.');
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
                <button className="secondary" onClick={() => setActiveTab('personal')} disabled={!isStoreReady}>
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
    </div>
  );
}
