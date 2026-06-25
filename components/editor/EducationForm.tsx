import React from 'react';
import { Education } from '../../lib/types';
import styles from '../EditorPanel.module.css';

interface EducationFormProps {
  list: Education[];
  onChange: (newList: Education[]) => void;
}

export default function EducationForm({ list, onChange }: EducationFormProps) {
  const handleEduChange = (id: string, field: keyof Education, value: string) => {
    onChange(list.map(edu => edu.id === id ? { ...edu, [field]: value } : edu));
  };

  const addEducation = () => {
    const newEdu: Education = {
      id: `edu-${Date.now()}`,
      institution: '',
      degree: '',
      major: '',
      location: '',
      startDate: '',
      endDate: '',
      details: ''
    };
    onChange([...list, newEdu]);
  };

  const deleteEducation = (id: string) => {
    onChange(list.filter(edu => edu.id !== id));
  };

  const moveEducation = (index: number, direction: 'up' | 'down') => {
    const newList = [...list];
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= newList.length) return;
    const temp = newList[index];
    newList[index] = newList[targetIndex];
    newList[targetIndex] = temp;
    onChange(newList);
  };

  return (
    <div className={styles.formSection}>
      <div className={styles.sectionHeader}>
        <h3>Education History</h3>
        <button className="primary" onClick={addEducation}>
          + Add Education
        </button>
      </div>

      {list.length === 0 && (
        <p className={styles.emptyText}>No education entries added yet.</p>
      )}

      <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
        {list.map((edu, index) => (
          <div key={edu.id} className={styles.itemCard}>
            <div className={styles.cardHeader}>
              <h4>{edu.institution || 'New Institution'}</h4>
              <div className={styles.cardActions}>
                <button 
                  className="secondary" 
                  onClick={() => moveEducation(index, 'up')} 
                  disabled={index === 0}
                >
                  ↑
                </button>
                <button 
                  className="secondary" 
                  onClick={() => moveEducation(index, 'down')} 
                  disabled={index === list.length - 1}
                >
                  ↓
                </button>
                <button className={styles.deleteButton} onClick={() => deleteEducation(edu.id)}>
                  Delete
                </button>
              </div>
            </div>

            <div className={styles.row}>
              <div className={styles.inputGroup}>
                <label>Institution</label>
                <input
                  type="text"
                  placeholder="Vellore Institute of Technology"
                  value={edu.institution}
                  onChange={(e) => handleEduChange(edu.id, 'institution', e.target.value)}
                />
              </div>
              <div className={styles.inputGroup}>
                <label>Location</label>
                <input
                  type="text"
                  placeholder="Chennai, India"
                  value={edu.location}
                  onChange={(e) => handleEduChange(edu.id, 'location', e.target.value)}
                />
              </div>
            </div>

            <div className={styles.row}>
              <div className={styles.inputGroup}>
                <label>Degree</label>
                <input
                  type="text"
                  placeholder="Master of Technology"
                  value={edu.degree}
                  onChange={(e) => handleEduChange(edu.id, 'degree', e.target.value)}
                />
              </div>
              <div className={styles.inputGroup}>
                <label>Major</label>
                <input
                  type="text"
                  placeholder="Computer Science and Engineering"
                  value={edu.major}
                  onChange={(e) => handleEduChange(edu.id, 'major', e.target.value)}
                />
              </div>
            </div>

            <div className={styles.row}>
              <div className={styles.inputGroup}>
                <label>Start Date</label>
                <input
                  type="text"
                  placeholder="Sep 2025"
                  value={edu.startDate}
                  onChange={(e) => handleEduChange(edu.id, 'startDate', e.target.value)}
                />
              </div>
              <div className={styles.inputGroup}>
                <label>End Date (Expected)</label>
                <input
                  type="text"
                  placeholder="May 2027"
                  value={edu.endDate}
                  onChange={(e) => handleEduChange(edu.id, 'endDate', e.target.value)}
                />
              </div>
            </div>

            <div className={styles.inputGroup}>
              <label>Details & Academic Honors</label>
              <textarea
                placeholder="GPA details, awards, relevant coursework..."
                value={edu.details}
                onChange={(e) => handleEduChange(edu.id, 'details', e.target.value)}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
