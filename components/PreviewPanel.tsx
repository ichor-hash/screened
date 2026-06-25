'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ResumeState } from '../lib/types';
import { generateLatex } from '../lib/latexGenerator';
import styles from './PreviewPanel.module.css';

interface PreviewPanelProps {
  data: ResumeState;
  previewMode: 'visual' | 'latex';
  setPreviewMode: (mode: 'visual' | 'latex') => void;
  isLoading?: boolean;
}

export default function PreviewPanel({ data, previewMode, setPreviewMode, isLoading = false }: PreviewPanelProps) {
  const [copied, setCopied] = useState(false);

  if (isLoading) {
    return (
      <div className={styles.panel}>
        <div className={styles.header}>
          <div className={styles.toggleButtons}>
            <div className="skeleton skeletonButton" style={{ width: '80px', height: '28px' }}></div>
            <div className="skeleton skeletonButton" style={{ width: '80px', height: '28px', marginLeft: '4px' }}></div>
          </div>
        </div>
        <div className={styles.content}>
          <div className={styles.paperContainer}>
            <div className={styles.resumePaper} style={{ gap: '20px' }}>
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
                <div className="skeleton skeletonTitle" style={{ width: '40%', height: '24px' }}></div>
                <div className="skeleton skeletonText" style={{ width: '20%', height: '10px' }}></div>
                <div className="skeleton skeletonText" style={{ width: '50%', height: '8px' }}></div>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginTop: '20px' }}>
                <div className="skeleton skeletonTitle" style={{ width: '100%', height: '12px', marginBottom: '8px' }}></div>
                <div className="skeleton skeletonText" style={{ width: '90%' }}></div>
                <div className="skeleton skeletonText" style={{ width: '95%' }}></div>
                <div className="skeleton skeletonText" style={{ width: '85%' }}></div>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginTop: '20px' }}>
                <div className="skeleton skeletonTitle" style={{ width: '100%', height: '12px', marginBottom: '8px' }}></div>
                <div className="skeleton skeletonText" style={{ width: '95%' }}></div>
                <div className="skeleton skeletonText" style={{ width: '90%' }}></div>
                <div className="skeleton skeletonText" style={{ width: '88%' }}></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const latexCode = generateLatex(data);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(latexCode);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy text: ', err);
    }
  };

  const handleDownload = () => {
    const blob = new Blob([latexCode], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    
    // Clean filename based on user's name
    const nameStr = data.personalInfo.fullName ? data.personalInfo.fullName.replace(/\s+/g, '_') : 'Resume';
    link.download = `${nameStr}_Resume.tex`;
    
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  // Helper to extract domains for display in HTML preview
  const getDomainText = (urlStr: string) => {
    if (!urlStr) return '';
    return urlStr.replace(/https?:\/\/(www\.)?/, '');
  };

  return (
    <div className={`${styles.panel} resume-print-panel`}>
      <div className={`${styles.header} no-print`}>
        <div className={styles.toggleButtons}>
          <button
            className={`${styles.toggleButton} ${previewMode === 'visual' ? styles.active : ''}`}
            onClick={() => setPreviewMode('visual')}
            style={{ position: 'relative' }}
          >
            {previewMode === 'visual' && (
              <motion.span
                layoutId="activePreviewTab"
                className={styles.toggleIndicator}
                transition={{ type: 'spring', stiffness: 350, damping: 32 }}
              />
            )}
            <span style={{ position: 'relative', zIndex: 2 }}>Live Preview</span>
          </button>
          <button
            className={`${styles.toggleButton} ${previewMode === 'latex' ? styles.active : ''}`}
            onClick={() => setPreviewMode('latex')}
            style={{ position: 'relative' }}
          >
            {previewMode === 'latex' && (
              <motion.span
                layoutId="activePreviewTab"
                className={styles.toggleIndicator}
                transition={{ type: 'spring', stiffness: 350, damping: 32 }}
              />
            )}
            <span style={{ position: 'relative', zIndex: 2 }}>LaTeX Source</span>
          </button>
        </div>
        
        {previewMode === 'latex' && (
          <div className={styles.actions}>
            <button className="secondary" onClick={handleCopy}>
              {copied ? 'Copied!' : 'Copy Code'}
            </button>
            <button className="primary" onClick={handleDownload}>
              Download .tex
            </button>
          </div>
        )}

        {previewMode === 'visual' && (
          <div className={styles.actions}>
            <button className="primary" onClick={() => window.print()}>
              <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6.72 13.829c-.24.03-.48.062-.72.096m.72-.096a42.415 42.415 0 0110.56 0m-10.56 0L6.34 18m10.94-4.171c.24.03.48.062.72.096m-.72-.096L17.66 18m0 0l.229 1.523a1.125 1.125 0 01-1.12 1.227H7.231c-.615 0-1.101-.493-1.12-1.109L5.88 18m11.78 0A12.008 12.008 0 0112 19.5c-2.316 0-4.47-.655-6.3-1.8m16.3-.06a4.125 4.125 0 00-3.75-3.75 4.125 4.125 0 00-3.75 3.75m0 0H18M4.125 12h15.75c.621 0 1.125-.504 1.125-1.125V9.75c0-1.036-.84-1.875-1.875-1.875H5.002c-1.036 0-1.875.84-1.875 1.875v1.125c0 .621.504 1.125 1.125 1.125zM16.5 9v.008H12V9h4.5z"/>
              </svg>
              Print / Save PDF
            </button>
          </div>
        )}
      </div>

      <div className={`${styles.content} resume-print-content`}>
        {/* --- VISUAL LIVE PREVIEW --- */}
        {previewMode === 'visual' && (
          <div className={`${styles.paperContainer} resume-print-container`}>
            <div className={`${styles.resumePaper} resume-print-paper`}>
              {/* Header */}
              <header className={styles.resumeHeader}>
                <h1 className={styles.name}>{data.personalInfo.fullName || 'YOUR NAME'}</h1>
                {data.personalInfo.jobTitle && (
                  <p className={styles.title}>{data.personalInfo.jobTitle}</p>
                )}
                
                <div className={styles.contacts}>
                  {data.personalInfo.email && (
                    <span>{data.personalInfo.email}</span>
                  )}
                  {data.personalInfo.phone && (
                    <span>{data.personalInfo.phone}</span>
                  )}
                  {data.personalInfo.location && (
                    <span>{data.personalInfo.location}</span>
                  )}
                  {data.personalInfo.website && (
                    <span>
                      <a href={data.personalInfo.website} target="_blank" rel="noopener noreferrer" className={styles.linkText}>
                        {getDomainText(data.personalInfo.website)}
                      </a>
                    </span>
                  )}
                  {data.personalInfo.linkedin && (
                    <span>
                      <a href={data.personalInfo.linkedin} target="_blank" rel="noopener noreferrer" className={styles.linkText}>
                        {getDomainText(data.personalInfo.linkedin)}
                      </a>
                    </span>
                  )}
                  {data.personalInfo.github && (
                    <span>
                      <a href={data.personalInfo.github} target="_blank" rel="noopener noreferrer" className={styles.linkText}>
                        {getDomainText(data.personalInfo.github)}
                      </a>
                    </span>
                  )}
                </div>
              </header>

              {/* Education Section */}
              {data.education && data.education.length > 0 && (
                <section className={styles.resumeSection}>
                  <h2 className={styles.sectionTitle}>Education</h2>
                  <div className={styles.subheadingList}>
                    {data.education.map((edu) => (
                      <div key={edu.id} className={styles.subheadingBlock}>
                        <div className={styles.subheadingRow}>
                          <span className={styles.boldText}>{edu.institution}</span>
                          <span className={styles.regularText}>{edu.location}</span>
                        </div>
                        <div className={styles.subheadingRow}>
                          <span className={styles.italicText}>
                            {edu.degree}{edu.major ? `, ${edu.major}` : ''}
                          </span>
                          <span className={styles.italicText}>{edu.startDate} – {edu.endDate}</span>
                        </div>
                        {edu.details && (
                          <div className={styles.detailsBlock}>
                            <span className={styles.bulletSymbol}>•</span>
                            <span className={styles.detailsText}>{edu.details}</span>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </section>
              )}

              {/* Experience Section */}
              {data.experience && data.experience.length > 0 && (
                <section className={styles.resumeSection}>
                  <h2 className={styles.sectionTitle}>Experience</h2>
                  <div className={styles.subheadingList}>
                    {data.experience.map((exp) => (
                      <div key={exp.id} className={styles.subheadingBlock}>
                        <div className={styles.subheadingRow}>
                          <span className={styles.boldText}>{exp.company}</span>
                          <span className={styles.regularText}>{exp.location}</span>
                        </div>
                        <div className={styles.subheadingRow}>
                          <span className={styles.italicText}>{exp.position}</span>
                          <span className={styles.italicText}>{exp.startDate} – {exp.endDate}</span>
                        </div>
                        {exp.description && exp.description.filter(b => b.trim() !== '').length > 0 && (
                          <ul className={styles.bulletPoints}>
                            {exp.description
                              .filter(bullet => bullet.trim() !== '')
                              .map((bullet, idx) => (
                                <li key={idx}>{bullet}</li>
                              ))}
                          </ul>
                        )}
                      </div>
                    ))}
                  </div>
                </section>
              )}

              {/* Projects Section */}
              {data.projects && data.projects.length > 0 && (
                <section className={styles.resumeSection}>
                  <h2 className={styles.sectionTitle}>Projects</h2>
                  <div className={styles.subheadingList}>
                    {data.projects.map((proj) => (
                      <div key={proj.id} className={styles.subheadingBlock}>
                        <div className={styles.subheadingRow}>
                          <span>
                            <span className={styles.boldText}>{proj.name}</span>
                            {proj.technologies && (
                              <span className={styles.techText}> | {proj.technologies}</span>
                            )}
                          </span>
                          {proj.link && (
                            <a href={proj.link} target="_blank" rel="noopener noreferrer" className={styles.linkText}>
                              Link
                            </a>
                          )}
                        </div>
                        {proj.description && proj.description.filter(b => b.trim() !== '').length > 0 && (
                          <ul className={styles.bulletPoints}>
                            {proj.description
                              .filter(bullet => bullet.trim() !== '')
                              .map((bullet, idx) => (
                                <li key={idx}>{bullet}</li>
                              ))}
                          </ul>
                        )}
                      </div>
                    ))}
                  </div>
                </section>
              )}

              {/* Skills Section */}
              {data.skills && data.skills.length > 0 && (
                <section className={styles.resumeSection}>
                  <h2 className={styles.sectionTitle}>Technical Skills</h2>
                  <div className={styles.skillsBlock}>
                    {data.skills.map((skill) => (
                      <div key={skill.id} className={styles.skillRow}>
                        <span className={styles.boldText}>{skill.category}:</span>{' '}
                        <span className={styles.regularText}>{skill.skills}</span>
                      </div>
                    ))}
                  </div>
                </section>
              )}
            </div>
          </div>
        )}

        {/* --- LATEX CODE VIEW --- */}
        {previewMode === 'latex' && (
          <div className={styles.latexContainer}>
            <pre className={styles.latexPre}>
              <code>{latexCode}</code>
            </pre>
          </div>
        )}
      </div>
    </div>
  );
}
