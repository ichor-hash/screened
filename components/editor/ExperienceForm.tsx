import React from 'react';
import { WorkExperience } from '../../lib/types';
import styles from '../EditorPanel.module.css';

interface ExperienceFormProps {
  list: WorkExperience[];
  onChange: (newList: WorkExperience[]) => void;
  onPolish: (originalText: string, onApply: (newText: string) => void) => void;
}

export default function ExperienceForm({ list, onChange, onPolish }: ExperienceFormProps) {
  const handleExpChange = (id: string, field: keyof WorkExperience, value: any) => {
    onChange(list.map(exp => exp.id === id ? { ...exp, [field]: value } : exp));
  };

  const addExperience = () => {
    const newExp: WorkExperience = {
      id: `exp-${Date.now()}`,
      company: '',
      position: '',
      location: '',
      startDate: '',
      endDate: '',
      description: ['']
    };
    onChange([...list, newExp]);
  };

  const deleteExperience = (id: string) => {
    onChange(list.filter(exp => exp.id !== id));
  };

  const moveExperience = (index: number, direction: 'up' | 'down') => {
    const newList = [...list];
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= newList.length) return;
    const temp = newList[index];
    newList[index] = newList[targetIndex];
    newList[targetIndex] = temp;
    onChange(newList);
  };

  const handleBulletChange = (expId: string, bulletIndex: number, value: string) => {
    onChange(list.map(exp => {
      if (exp.id === expId) {
        const newDesc = [...exp.description];
        newDesc[bulletIndex] = value;
        return { ...exp, description: newDesc };
      }
      return exp;
    }));
  };

  const addBullet = (expId: string) => {
    onChange(list.map(exp => {
      if (exp.id === expId) {
        return { ...exp, description: [...exp.description, ''] };
      }
      return exp;
    }));
  };

  const deleteBullet = (expId: string, bulletIndex: number) => {
    onChange(list.map(exp => {
      if (exp.id === expId) {
        return { ...exp, description: exp.description.filter((_, i) => i !== bulletIndex) };
      }
      return exp;
    }));
  };

  return (
    <div className={styles.formSection}>
      <div className={styles.sectionHeader}>
        <h3>Work Experience</h3>
        <button className="primary" onClick={addExperience}>
          + Add Experience
        </button>
      </div>

      {list.length === 0 && (
        <p className={styles.emptyText}>No work experience added yet.</p>
      )}

      <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
        {list.map((exp, index) => (
          <div key={exp.id} className={styles.itemCard}>
            <div className={styles.cardHeader}>
              <h4>{exp.company || 'New Company'}</h4>
              <div className={styles.cardActions}>
                <button 
                  className="secondary" 
                  onClick={() => moveExperience(index, 'up')} 
                  disabled={index === 0}
                >
                  ↑
                </button>
                <button 
                  className="secondary" 
                  onClick={() => moveExperience(index, 'down')} 
                  disabled={index === list.length - 1}
                >
                  ↓
                </button>
                <button className={styles.deleteButton} onClick={() => deleteExperience(exp.id)}>
                  Delete
                </button>
              </div>
            </div>

            <div className={styles.row}>
              <div className={styles.inputGroup}>
                <label>Company</label>
                <input
                  type="text"
                  placeholder="Google"
                  value={exp.company}
                  onChange={(e) => handleExpChange(exp.id, 'company', e.target.value)}
                />
              </div>
              <div className={styles.inputGroup}>
                <label>Position</label>
                <input
                  type="text"
                  placeholder="Software Engineering Intern"
                  value={exp.position}
                  onChange={(e) => handleExpChange(exp.id, 'position', e.target.value)}
                />
              </div>
            </div>

            <div className={styles.row}>
              <div className={styles.inputGroup}>
                <label>Location</label>
                <input
                  type="text"
                  placeholder="Bengaluru, India"
                  value={exp.location}
                  onChange={(e) => handleExpChange(exp.id, 'location', e.target.value)}
                />
              </div>
              <div className={styles.inputGroup}>
                <label>Start Date</label>
                <input
                  type="text"
                  placeholder="May 2025"
                  value={exp.startDate}
                  onChange={(e) => handleExpChange(exp.id, 'startDate', e.target.value)}
                />
              </div>
              <div className={styles.inputGroup}>
                <label>End Date</label>
                <input
                  type="text"
                  placeholder="Aug 2025"
                  value={exp.endDate}
                  onChange={(e) => handleExpChange(exp.id, 'endDate', e.target.value)}
                />
              </div>
            </div>

            <div className={styles.bulletSection}>
              <div className={styles.bulletHeader}>
                <label>Responsibilities & Achievements</label>
                <button className="secondary" onClick={() => addBullet(exp.id)}>
                  + Add Bullet
                </button>
              </div>

              {exp.description.map((bullet, bulletIdx) => (
                <div key={bulletIdx} className={styles.bulletItem}>
                  <span className={styles.bulletIndex}>{bulletIdx + 1}.</span>
                  <textarea
                    placeholder="Describe your actions and measurable impact..."
                    value={bullet}
                    onChange={(e) => handleBulletChange(exp.id, bulletIdx, e.target.value)}
                  />
                  <button 
                    className={styles.bulletAiButton}
                    onClick={() => onPolish(bullet, (newVal) => handleBulletChange(exp.id, bulletIdx, newVal))}
                    title="Polish with AI"
                  >
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="m21 16-1 2-2 1 2 1 1 2 1-2 2-1-2-1-1-2zm-9-4-3 6-6 3 6 3 3 6 3-6 6-3-6-3-3-6zm-4-4-1 2-2 1 2 1 1 2 1-2 2-1-2-1-1-2z"/>
                    </svg>
                  </button>
                  <button className={styles.bulletDelete} onClick={() => deleteBullet(exp.id, bulletIdx)}>
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
