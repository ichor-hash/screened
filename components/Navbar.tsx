import React, { useRef, useState } from 'react';
import { ResumeVersion } from '../lib/types';
import styles from '../app/page.module.css';

interface NavbarProps {
  versions: ResumeVersion[];
  activeVersion: ResumeVersion | undefined;
  activeVersionId: string;
  setActiveVersionId: (id: string) => void;
  handleCreateBranch: (name: string) => void;
  handleRenameBranch: (id: string, newName: string) => void;
  handleDeleteBranch: (id: string) => void;
  overallScore: number;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  handleImportJSON: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleExportJSON: () => void;
  handleReset: () => void;
  handleClear: () => void;
  theme: 'light' | 'dark';
  handleThemeToggle: () => void;
  isLoading: boolean;
}

export default function Navbar({
  versions,
  activeVersion,
  activeVersionId,
  setActiveVersionId,
  handleCreateBranch,
  handleRenameBranch,
  handleDeleteBranch,
  overallScore,
  activeTab,
  setActiveTab,
  handleImportJSON,
  handleExportJSON,
  handleReset,
  handleClear,
  theme,
  handleThemeToggle,
  isLoading
}: NavbarProps) {
  const [showBranchDropdown, setShowBranchDropdown] = useState<boolean>(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImportJSONClick = () => {
    fileInputRef.current?.click();
  };

  let atsPillClass = styles.atsPillLow;
  if (overallScore >= 80) {
    atsPillClass = styles.atsPillHigh;
  } else if (overallScore >= 50) {
    atsPillClass = styles.atsPillMedium;
  }

  return (
    <header className={`${styles.navbar} no-print`}>
      <div className={styles.brand}>
        <h1 className={styles.textLogo}>Screened.</h1>
        <span className={styles.brandSlash}>/</span>
        
        {/* Git Branch Switcher Dropdown */}
        <div className={styles.branchSwitcherContainer}>
          <button 
            className={styles.branchButton} 
            onClick={() => setShowBranchDropdown(!showBranchDropdown)}
            title="Click to switch or manage resume branches"
          >
            <svg className={styles.branchIcon} width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 21a9.004 9.004 0 008.716-6.747M12 21a9.004 9.004 0 01-8.716-6.747M12 21V10m0-7a3 3 0 110 6 3 3 0 010-6zm0 0V3"/>
            </svg>
            <span className={styles.branchName}>{activeVersion ? activeVersion.name : 'main'}</span>
            <svg className={styles.dropdownArrow} width="10" height="10" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
          </button>
          
          {showBranchDropdown && (
            <div className={styles.branchDropdown}>
              <div className={styles.dropdownHeader}>
                <span>Resume Branches</span>
              </div>
              <div className={styles.dropdownList}>
                {versions.map(v => (
                  <div 
                    key={v.id} 
                    className={`${styles.dropdownItem} ${v.id === activeVersionId ? styles.dropdownItemActive : ''}`}
                  >
                    <button 
                      className={styles.switchButton}
                      onClick={() => {
                        setActiveVersionId(v.id);
                        setShowBranchDropdown(false);
                      }}
                    >
                      <span className={styles.itemBranchName}>{v.name}</span>
                      <span className={styles.itemBranchDate}>
                        Updated {new Date(v.updatedAt).toLocaleDateString(undefined, {month: 'short', day: 'numeric'})}
                      </span>
                    </button>
                    
                    <div className={styles.itemActions}>
                      <button 
                        onClick={() => {
                          const newName = prompt('Enter new branch name:', v.name);
                          if (newName) handleRenameBranch(v.id, newName);
                        }}
                        title="Rename Branch"
                      >
                        ✏️
                      </button>
                      {versions.length > 1 && (
                        <button 
                          onClick={() => handleDeleteBranch(v.id)}
                          title="Delete Branch"
                          className={styles.deleteBranchBtn}
                        >
                          🗑️
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
              <div className={styles.dropdownFooter}>
                <button 
                  className={styles.createBranchBtn}
                  onClick={() => {
                    const name = prompt('Enter new branch name (e.g. google-swe):');
                    if (name) handleCreateBranch(name);
                    setShowBranchDropdown(false);
                  }}
                >
                  + Create Branch
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Global Control Tools */}
      <div className={styles.navActions}>
        {/* ATS Score Indicator */}
        <button 
          className={`${styles.atsIndicator} ${atsPillClass} ${activeTab === 'ats' ? styles.atsActive : ''}`}
          onClick={() => setActiveTab('ats')}
          title="ATS Score - click to open detailed scanner"
        >
          <span>ATS Score:</span>
          <strong>{overallScore}</strong>
        </button>

        {/* Import / Export JSON buttons */}
        <input 
          type="file" 
          ref={fileInputRef} 
          style={{ display: 'none' }} 
          accept=".json" 
          onChange={handleImportJSON}
        />
        <button className="secondary" onClick={handleImportJSONClick} title="Load backup file">
          <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5"/>
          </svg>
          Import JSON
        </button>
        
        <button className="secondary" onClick={handleExportJSON} title="Save backup file">
          <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3"/>
          </svg>
          Export JSON
        </button>

        {/* Reset button */}
        <button className="secondary" onClick={handleReset} title="Load demo template">
          Reset Sample
        </button>
        
        {/* Clear button */}
        <button className="secondary" onClick={handleClear} title="Erase everything">
          Clear
        </button>

        {/* Theme button */}
        <button className={styles.themeToggle} onClick={handleThemeToggle} aria-label="Toggle Theme">
          {theme === 'light' ? (
            // Moon Icon
            <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M21.752 15.002A9.718 9.718 0 0118 15.75c-5.385 0-9.75-4.365-9.75-9.75 0-1.33.266-2.597.748-3.752A9.753 9.753 0 003 11.25C3 16.635 7.365 21 12.75 21a9.753 9.753 0 009.002-5.998z"/>
            </svg>
          ) : (
            // Sun Icon
            <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v2.25m0 13.5V21M4.22 4.22l1.59 1.59m12.38 12.38l1.59 1.59M3 12h2.25m13.5 0H21M5.81 18.19l-1.59 1.59m14.38-14.38l-1.59 1.59M15 12a3 3 0 11-6 0 3 3 0 016 0z"/>
            </svg>
          )}
        </button>
      </div>
    </header>
  );
}
