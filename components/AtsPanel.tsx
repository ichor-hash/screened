'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ResumeState } from '../lib/types';
import { checkAts, AtsScore, AtsMetric } from '../lib/atsChecker';
import styles from './AtsPanel.module.css';

interface AtsPanelProps {
  data: ResumeState;
  isLoading?: boolean;
}

export default function AtsPanel({ data, isLoading = false }: AtsPanelProps) {
  const [activeSubTab, setActiveSubTab] = useState<'synopsis' | 'lexical' | 'semantic'>('synopsis');
  const [keywordInput, setKeywordInput] = useState<string>('');
  const [expandedMetric, setExpandedMetric] = useState<string | null>(null);

  // Load target keywords from local storage
  useEffect(() => {
    const saved = localStorage.getItem('screened_keywords');
    if (saved) setKeywordInput(saved);
  }, []);

  const handleKeywordChange = (value: string) => {
    setKeywordInput(value);
    localStorage.setItem('screened_keywords', value);
  };

  if (isLoading) {
    return (
      <div className={styles.container}>
        <div className={styles.header}>
          <div className="skeleton skeletonTitle" style={{ width: '150px' }}></div>
          <div className="skeleton skeletonText" style={{ width: '250px', marginTop: '6px' }}></div>
        </div>
        <div className={styles.scoreGauge}>
          <div className="skeleton skeletonCircle" style={{ width: '80px', height: '80px' }}></div>
          <div className={styles.summary} style={{ flex: 1 }}>
            <div className="skeleton skeletonButton" style={{ width: '120px', height: '22px', borderRadius: '4px' }}></div>
            <div className="skeleton skeletonText" style={{ width: '90%', marginTop: '8px' }}></div>
          </div>
        </div>
        <div className={styles.subtabs}>
          {[1, 2, 3].map(i => (
            <div key={i} className="skeleton skeletonButton" style={{ height: '30px', margin: '4px' }}></div>
          ))}
        </div>
        <div className={styles.tabContent}>
          <div className={styles.card}>
            <div className="skeleton skeletonTitle" style={{ width: '100px' }}></div>
            <div className={styles.synopsisGrid}>
              {[1, 2, 3].map(i => (
                <div key={i} className={styles.synopsisItem}>
                  <div className="skeleton skeletonText" style={{ width: '40%', alignSelf: 'center' }}></div>
                  <div className="skeleton skeletonTitle" style={{ width: '60%', alignSelf: 'center', marginTop: '6px' }}></div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  const scoreResult: AtsScore = checkAts(data);
  const { overallScore, metrics } = scoreResult;

  // --- EXTRACT FULL TEXT FOR LOCAL ANALYSIS ---
  const getResumeText = () => {
    let text = `${data.personalInfo.fullName} ${data.personalInfo.jobTitle} `;
    data.experience.forEach(exp => {
      text += `${exp.company} ${exp.position} ${exp.description.join(' ')} `;
    });
    data.education.forEach(edu => {
      text += `${edu.institution} ${edu.degree} ${edu.major} ${edu.details} `;
    });
    data.projects.forEach(proj => {
      text += `${proj.name} ${proj.technologies} ${proj.description.join(' ')} `;
    });
    data.skills.forEach(sk => {
      text += `${sk.category} ${sk.skills} `;
    });
    return text;
  };

  const fullText = getResumeText();
  const lowercaseText = fullText.toLowerCase();

  // --- KEYWORD MATCHER ---
  const keywords = keywordInput
    .split(',')
    .map(k => k.trim())
    .filter(k => k.length > 0);

  const keywordMatches = keywords.map(kw => {
    // Escape regex characters
    const safeKw = kw.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const regex = new RegExp(`\\b${safeKw}\\b`, 'i');
    const found = regex.test(lowercaseText);
    return { name: kw, found };
  });

  const matchedKeywordsCount = keywordMatches.filter(m => m.found).length;
  const keywordMatchPercentage = keywords.length > 0 
    ? Math.round((matchedKeywordsCount / keywords.length) * 100) 
    : 0;

  // --- ACTION VERBS DETAILS ---
  const ACTION_VERBS = [
    'led', 'managed', 'developed', 'designed', 'built', 'created', 'implemented', 
    'optimized', 'increased', 'decreased', 'reduced', 'spearheaded', 'engineered', 
    'architected', 'authored', 'launched', 'initiated', 'coordinated', 'collaborated', 
    'programmed', 'automated', 'saved', 'generated', 'improved'
  ];

  const foundActionVerbs = ACTION_VERBS.filter(verb => {
    const regex = new RegExp(`\\b${verb}\\b`, 'i');
    return regex.test(lowercaseText);
  });

  // Calculate estimated reading time
  const wordCount = fullText.split(/\s+/).filter(w => w.trim().length > 0).length;
  const readTimeSec = Math.round((wordCount / 200) * 60); // 200 WPM average

  // SVG Circle animation
  const radius = 60;
  const stroke = 6;
  const normalizedRadius = radius - stroke * 2;
  const circumference = normalizedRadius * 2 * Math.PI;
  const strokeDashoffset = circumference - (overallScore / 100) * circumference;

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h3>Screened. ATS Diagnostics</h3>
        <p>Advanced syntactic parsing, lexical audit, and semantic alignment.</p>
      </div>

      {/* Glassmorphic Score summary */}
      <div className={styles.scoreGauge}>
        <div className={styles.svgWrapper}>
          <svg height={radius * 2} width={radius * 2}>
            <circle
              className={styles.circleBg}
              stroke="var(--card-border)"
              fill="transparent"
              strokeWidth={stroke}
              r={normalizedRadius}
              cx={radius}
              cy={radius}
            />
            <motion.circle
              className={styles.circleProgress}
              stroke="var(--primary)"
              fill="transparent"
              strokeWidth={stroke}
              strokeDasharray={circumference + ' ' + circumference}
              initial={{ strokeDashoffset: circumference }}
              animate={{ strokeDashoffset }}
              transition={{ duration: 0.8, ease: 'easeOut' }}
              r={normalizedRadius}
              cx={radius}
              cy={radius}
            />
          </svg>
          <div className={styles.scoreText}>
            <span className={styles.scoreValue}>{overallScore}</span>
            <span className={styles.scoreLabel}>/100</span>
          </div>
        </div>

        <div className={styles.summary}>
          {overallScore >= 80 ? (
            <span className={styles.badgeSuccess}>Optimal Indexing Quality</span>
          ) : overallScore >= 50 ? (
            <span className={styles.badgeWarning}>Partial Structural Match</span>
          ) : (
            <span className={styles.badgeDanger}>Parsing Failure Warning</span>
          )}
          <p className={styles.scoreDescription}>
            Estimated ATS compliance rating is <strong>{overallScore}%</strong>. Expand sections below to inspect structural alerts, lexical gaps, and keyword match rates.
          </p>
        </div>
      </div>

      {/* Internal Subtabs */}
      <div className={styles.subtabs}>
        <button
          className={`${styles.subtab} ${activeSubTab === 'synopsis' ? styles.subtabActive : ''}`}
          onClick={() => setActiveSubTab('synopsis')}
        >
          Synopsis & Data ID
        </button>
        <button
          className={`${styles.subtab} ${activeSubTab === 'lexical' ? styles.subtabActive : ''}`}
          onClick={() => setActiveSubTab('lexical')}
        >
          Lexical Audit
        </button>
        <button
          className={`${styles.subtab} ${activeSubTab === 'semantic' ? styles.subtabActive : ''}`}
          onClick={() => setActiveSubTab('semantic')}
        >
          Semantic Keywords ({keywords.length})
        </button>
      </div>

      <div className={styles.tabContent}>
        {/* --- SYNOPSIS & DATA ID --- */}
        {activeSubTab === 'synopsis' && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className={styles.tabPane}
          >
            {/* Document Synopsis info card */}
            <div className={styles.card}>
              <h4>Document Synopsis</h4>
              <div className={styles.synopsisGrid}>
                <div className={styles.synopsisItem}>
                  <span className={styles.synopsisLabel}>Reading Time</span>
                  <span className={styles.synopsisValue}>{readTimeSec}s</span>
                </div>
                <div className={styles.synopsisItem}>
                  <span className={styles.synopsisLabel}>Total Words</span>
                  <span className={styles.synopsisValue}>{wordCount}</span>
                </div>
                <div className={styles.synopsisItem}>
                  <span className={styles.synopsisLabel}>Parsed Sections</span>
                  <span className={styles.synopsisValue}>
                    {metrics.find(m => m.name === 'Section Completeness')?.score || 0}/20 pts
                  </span>
                </div>
              </div>
            </div>

            {/* Data Identification Status Table */}
            <div className={styles.card}>
              <h4>Data Identification Map</h4>
              <p className={styles.cardDesc}>Checks for standard contact entries required for machine validation.</p>
              <div className={styles.identificationMap}>
                {[
                  { label: 'Full Name', val: data.personalInfo.fullName },
                  { label: 'Job Title', val: data.personalInfo.jobTitle },
                  { label: 'Email Address', val: data.personalInfo.email },
                  { label: 'Phone Number', val: data.personalInfo.phone },
                  { label: 'Location Details', val: data.personalInfo.location },
                  { label: 'LinkedIn Profile', val: data.personalInfo.linkedin },
                  { label: 'GitHub Profile', val: data.personalInfo.github },
                ].map((item, idx) => (
                  <div key={idx} className={styles.dataIdRow}>
                    <span>{item.label}</span>
                    {item.val ? (
                      <span className={styles.badgePass}>Found</span>
                    ) : (
                      <span className={styles.badgeFail}>Missing</span>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        )}

        {/* --- LEXICAL AUDIT --- */}
        {activeSubTab === 'lexical' && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className={styles.tabPane}
          >
            {/* Word choices/Action verbs list */}
            <div className={styles.card}>
              <h4>Lexical Action Verbs ({foundActionVerbs.length} Found)</h4>
              <p className={styles.cardDesc}>Verbs that demonstrate impact and leadership rather than passive tasks.</p>
              
              {foundActionVerbs.length > 0 ? (
                <div className={styles.keywordContainer}>
                  {foundActionVerbs.map(verb => (
                    <span key={verb} className={styles.keywordPillMatched}>
                      {verb}
                    </span>
                  ))}
                </div>
              ) : (
                <p className={styles.warningText}>No strong engineering action verbs detected. Rewrite bullet points starting with words like "Led", "Engineered", or "Designed".</p>
              )}
            </div>

            {/* Checker Metric list */}
            <div className={styles.checkerMetrics}>
              <h4>Checklist Audit</h4>
              <div className={styles.metricsList}>
                {metrics.map((metric) => {
                  const isExpanded = expandedMetric === metric.name;
                  return (
                    <div key={metric.name} className={styles.metricRowContainer}>
                      <div
                        className={styles.metricHeader}
                        onClick={() => setExpandedMetric(isExpanded ? null : metric.name)}
                      >
                        <div className={styles.metricNameGroup}>
                          <span className={metric.passed ? styles.bulletPass : styles.bulletFail}>
                            {metric.passed ? '✓' : '!'}
                          </span>
                          <span className={styles.metricName}>{metric.name}</span>
                        </div>
                        <span className={styles.metricScore}>
                          {metric.score}/{metric.maxPoints} {metric.suggestions.length > 0 ? (isExpanded ? '▼' : '▶') : ''}
                        </span>
                      </div>
                      
                      <AnimatePresence>
                        {isExpanded && metric.suggestions.length > 0 && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            className={styles.suggestionsBox}
                          >
                            <ul>
                              {metric.suggestions.map((s, i) => (
                                <li key={i}>{s}</li>
                              ))}
                            </ul>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  );
                })}
              </div>
            </div>
          </motion.div>
        )}

        {/* --- SEMANTIC KEYWORDS --- */}
        {activeSubTab === 'semantic' && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className={styles.tabPane}
          >
            {/* Interactive Job Target Scraper */}
            <div className={styles.card}>
              <h4>Job Target Keywords Scan</h4>
              <p className={styles.cardDesc}>
                Type the core skills or technologies from the job description (comma-separated). We will scan your resume text to measure matching density.
              </p>
              <textarea
                rows={3}
                placeholder="e.g. React, TypeScript, GraphQL, AWS, Docker, Microservices"
                value={keywordInput}
                onChange={(e) => handleKeywordChange(e.target.value)}
                className={styles.keywordInputText}
              />
            </div>

            {keywords.length > 0 && (
              <div className={styles.card} style={{ backgroundColor: 'transparent', borderStyle: 'dashed' }}>
                <div className={styles.semanticScoreHeader}>
                  <h4>Keyword Density Match</h4>
                  <span className={keywordMatchPercentage >= 75 ? styles.badgePass : styles.badgeWarning}>
                    {keywordMatchPercentage}% Match
                  </span>
                </div>
                
                <div className={styles.keywordContainer} style={{ marginTop: '12px' }}>
                  {keywordMatches.map((match, idx) => (
                    <span
                      key={idx}
                      className={match.found ? styles.keywordPillMatched : styles.keywordPillMissing}
                    >
                      {match.name} {match.found ? '✓' : '×'}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </motion.div>
        )}
      </div>
    </div>
  );
}
