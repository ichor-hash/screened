import { useState, useEffect } from 'react';
import { ResumeState, ResumeVersion } from './types';
import { defaultResumeData } from './defaultData';
import { AppSettings } from '../components/EditorPanel';

export function useResumeStore() {
  const [versions, setVersions] = useState<ResumeVersion[]>([]);
  const [activeVersionId, setActiveVersionId] = useState<string>('v-main');
  const [theme, setTheme] = useState<'light' | 'dark'>('light');
  const [settings, setSettings] = useState<AppSettings>({
    githubToken: '',
    linkedinApiKey: '',
    aiApiKey: '',
    aiProvider: 'gemini',
  });
  const [isStoreReady, setIsStoreReady] = useState<boolean>(false);

  // Derive active data
  const activeVersion = versions.find((v) => v.id === activeVersionId) || versions[0];
  const resumeData = activeVersion ? activeVersion.data : defaultResumeData;

  useEffect(() => {
    // 1. Theme Hydration
    const savedTheme = localStorage.getItem('novacv_theme') as 'light' | 'dark' | null;
    const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
    const initialTheme = savedTheme || (prefersDark ? 'dark' : 'light');
    setTheme(initialTheme);

    // 2. Settings Hydration
    const savedSettings = localStorage.getItem('screened_settings');
    if (savedSettings) {
      try {
        setSettings(JSON.parse(savedSettings));
      } catch (e) {}
    }

    // 3. Data & Versions Hydration
    const savedVersions = localStorage.getItem('novacv_versions');
    const savedActiveId = localStorage.getItem('novacv_active_version_id');
    
    let loadedVersions: ResumeVersion[] = [];
    let loadedActiveId = 'v-main';

    if (savedVersions) {
      try {
        loadedVersions = JSON.parse(savedVersions);
        if (savedActiveId) loadedActiveId = savedActiveId;
      } catch (e) {}
    }

    if (loadedVersions.length === 0) {
      const savedData = localStorage.getItem('novacv_data');
      let baseData = defaultResumeData;
      if (savedData) {
        try {
          const parsed = JSON.parse(savedData);
          const isOldName = parsed.personalInfo && parsed.personalInfo.fullName === 'Alex Morgan';
          const hasTargetJob = parsed.personalInfo && parsed.personalInfo.jobTitle && parsed.personalInfo.jobTitle.includes('Target');
          
          if (!isOldName && !hasTargetJob && parsed.personalInfo) {
            baseData = parsed;
          }
        } catch (e) {}
      }
      
      const defaultBranch: ResumeVersion = {
        id: 'v-main',
        name: 'main',
        data: baseData,
        createdAt: Date.now(),
        updatedAt: Date.now()
      };
      loadedVersions = [defaultBranch];
    } else {
      loadedVersions = loadedVersions.map(v => {
        const parsed = v.data;
        const isOldName = parsed.personalInfo && parsed.personalInfo.fullName === 'Alex Morgan';
        const hasTargetJob = parsed.personalInfo && parsed.personalInfo.jobTitle && parsed.personalInfo.jobTitle.includes('Target');
        if (isOldName || hasTargetJob) {
          return { ...v, data: defaultResumeData, updatedAt: Date.now() };
        }
        return v;
      });
    }

    setVersions(loadedVersions);
    setActiveVersionId(loadedActiveId);
    setIsStoreReady(true);
  }, []);

  // Save changes automatically
  useEffect(() => {
    if (!isStoreReady) return;
    localStorage.setItem('novacv_versions', JSON.stringify(versions));
    localStorage.setItem('novacv_active_version_id', activeVersionId);
    localStorage.setItem('novacv_data', JSON.stringify(resumeData));
  }, [versions, activeVersionId, resumeData, isStoreReady]);

  useEffect(() => {
    if (!isStoreReady) return;
    localStorage.setItem('screened_settings', JSON.stringify(settings));
  }, [settings, isStoreReady]);

  // Handlers
  const handleDataChange = (newData: ResumeState) => {
    setVersions(prev => prev.map(v => v.id === activeVersionId ? { ...v, data: newData, updatedAt: Date.now() } : v));
  };

  const handleCreateBranch = (name: string) => {
    const cleanName = name.trim().toLowerCase().replace(/\s+/g, '-');
    if (!cleanName) return;
    if (versions.some(v => v.name === cleanName)) {
      alert('A branch with this name already exists.');
      return;
    }
    const newBranch: ResumeVersion = {
      id: `v-${Date.now()}`,
      name: cleanName,
      data: JSON.parse(JSON.stringify(resumeData)),
      createdAt: Date.now(),
      updatedAt: Date.now(),
    };
    setVersions(prev => [...prev, newBranch]);
    setActiveVersionId(newBranch.id);
  };

  const handleRenameBranch = (id: string, newName: string) => {
    const cleanName = newName.trim().toLowerCase().replace(/\s+/g, '-');
    if (!cleanName) return;
    if (versions.some(v => v.id !== id && v.name === cleanName)) {
      alert('A branch with this name already exists.');
      return;
    }
    setVersions(prev => prev.map(v => v.id === id ? { ...v, name: cleanName, updatedAt: Date.now() } : v));
  };

  const handleDeleteBranch = (id: string) => {
    if (versions.length <= 1) {
      alert('Cannot delete the last remaining branch.');
      return;
    }
    if (window.confirm('Are you sure you want to delete this branch?')) {
      const remaining = versions.filter(v => v.id !== id);
      setVersions(remaining);
      if (activeVersionId === id) setActiveVersionId(remaining[0].id);
    }
  };

  const handleThemeToggle = () => {
    const nextTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(nextTheme);
    localStorage.setItem('novacv_theme', nextTheme);
    document.documentElement.setAttribute('data-theme', nextTheme);
  };

  return {
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
  };
}
