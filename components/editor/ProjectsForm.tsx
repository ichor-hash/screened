import React from 'react';
import { Project } from '../../lib/types';
import styles from '../EditorPanel.module.css';

interface ProjectsFormProps {
  list: Project[];
  onChange: (newList: Project[]) => void;
  onPolish: (originalText: string, onApply: (newText: string) => void) => void;
}

export default function ProjectsForm({ list, onChange, onPolish }: ProjectsFormProps) {
  const handleProjChange = (id: string, field: keyof Project, value: any) => {
    onChange(list.map(proj => proj.id === id ? { ...proj, [field]: value } : proj));
  };

  const addProject = () => {
    const newProj: Project = {
      id: `proj-${Date.now()}`,
      name: '',
      technologies: '',
      link: '',
      description: ['']
    };
    onChange([...list, newProj]);
  };

  const deleteProject = (id: string) => {
    onChange(list.filter(proj => proj.id !== id));
  };

  const moveProject = (index: number, direction: 'up' | 'down') => {
    const newList = [...list];
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= newList.length) return;
    const temp = newList[index];
    newList[index] = newList[targetIndex];
    newList[targetIndex] = temp;
    onChange(newList);
  };

  const handleBulletChange = (projId: string, bulletIndex: number, value: string) => {
    onChange(list.map(proj => {
      if (proj.id === projId) {
        const newDesc = [...proj.description];
        newDesc[bulletIndex] = value;
        return { ...proj, description: newDesc };
      }
      return proj;
    }));
  };

  const addBullet = (projId: string) => {
    onChange(list.map(proj => {
      if (proj.id === projId) {
        return { ...proj, description: [...proj.description, ''] };
      }
      return proj;
    }));
  };

  const deleteBullet = (projId: string, bulletIndex: number) => {
    onChange(list.map(proj => {
      if (proj.id === projId) {
        return { ...proj, description: proj.description.filter((_, i) => i !== bulletIndex) };
      }
      return proj;
    }));
  };

  return (
    <div className={styles.formSection}>
      <div className={styles.sectionHeader}>
        <h3>Portfolio Projects</h3>
        <button className="primary" onClick={addProject}>
          + Add Project
        </button>
      </div>

      {list.length === 0 && (
        <p className={styles.emptyText}>No projects added yet.</p>
      )}

      <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
        {list.map((proj, index) => (
          <div key={proj.id} className={styles.itemCard}>
            <div className={styles.cardHeader}>
              <h4>{proj.name || 'New Project'}</h4>
              <div className={styles.cardActions}>
                <button 
                  className="secondary" 
                  onClick={() => moveProject(index, 'up')} 
                  disabled={index === 0}
                >
                  ↑
                </button>
                <button 
                  className="secondary" 
                  onClick={() => moveProject(index, 'down')} 
                  disabled={index === list.length - 1}
                >
                  ↓
                </button>
                <button className={styles.deleteButton} onClick={() => deleteProject(proj.id)}>
                  Delete
                </button>
              </div>
            </div>

            <div className={styles.row}>
              <div className={styles.inputGroup}>
                <label>Project Name</label>
                <input
                  type="text"
                  placeholder="Screened."
                  value={proj.name}
                  onChange={(e) => handleProjChange(proj.id, 'name', e.target.value)}
                />
              </div>
              <div className={styles.inputGroup}>
                <label>Technologies Used</label>
                <input
                  type="text"
                  placeholder="TypeScript, React, Next.js"
                  value={proj.technologies}
                  onChange={(e) => handleProjChange(proj.id, 'technologies', e.target.value)}
                />
              </div>
            </div>

            <div className={styles.inputGroup}>
              <label>Project URL / GitHub Link</label>
              <input
                type="url"
                placeholder="https://github.com/ichor-hash/screened"
                value={proj.link}
                onChange={(e) => handleProjChange(proj.id, 'link', e.target.value)}
              />
            </div>

            <div className={styles.bulletSection}>
              <div className={styles.bulletHeader}>
                <label>Project Descriptions & Impact</label>
                <button className="secondary" onClick={() => addBullet(proj.id)}>
                  + Add Bullet
                </button>
              </div>

              {proj.description.map((bullet, bulletIdx) => (
                <div key={bulletIdx} className={styles.bulletItem}>
                  <span className={styles.bulletIndex}>{bulletIdx + 1}.</span>
                  <textarea
                    placeholder="Describe what you built and how you measured achievements..."
                    value={bullet}
                    onChange={(e) => handleBulletChange(proj.id, bulletIdx, e.target.value)}
                  />
                  <button 
                    className={styles.bulletAiButton}
                    onClick={() => onPolish(bullet, (newVal) => handleBulletChange(proj.id, bulletIdx, newVal))}
                    title="Polish with AI"
                  >
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="m21 16-1 2-2 1 2 1 1 2 1-2 2-1-2-1-1-2zm-9-4-3 6-6 3 6 3 3 6 3-6 6-3-6-3-3-6zm-4-4-1 2-2 1 2 1 1 2 1-2 2-1-2-1-1-2z"/>
                    </svg>
                  </button>
                  <button className={styles.bulletDelete} onClick={() => deleteBullet(proj.id, bulletIdx)}>
                    ×
                  </button>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
