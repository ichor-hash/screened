import React from 'react';
import { SkillCategory } from '../../lib/types';
import styles from '../EditorPanel.module.css';

interface SkillsFormProps {
  list: SkillCategory[];
  onChange: (newList: SkillCategory[]) => void;
}

export default function SkillsForm({ list, onChange }: SkillsFormProps) {
  const handleSkillChange = (id: string, field: keyof SkillCategory, value: string) => {
    onChange(list.map(sk => sk.id === id ? { ...sk, [field]: value } : sk));
  };

  const addSkillCategory = () => {
    const newSkill: SkillCategory = {
      id: `skill-${Date.now()}`,
      category: '',
      skills: ''
    };
    onChange([...list, newSkill]);
  };

  const deleteSkillCategory = (id: string) => {
    onChange(list.filter(sk => sk.id !== id));
  };

  const moveSkill = (index: number, direction: 'up' | 'down') => {
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
        <h3>Technical Skills</h3>
        <button className="primary" onClick={addSkillCategory}>
          + Add Category
        </button>
      </div>

      {list.length === 0 && (
        <p className={styles.emptyText}>No skills added yet. Click "+ Add Category" to get started.</p>
      )}

      <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
        {list.map((skill, index) => (
          <div key={skill.id} className={styles.itemCard}>
            <div className={styles.cardHeader}>
              <h4>{skill.category || 'New Category'}</h4>
              <div className={styles.cardActions}>
                <button 
                  className="secondary" 
                  onClick={() => moveSkill(index, 'up')} 
                  disabled={index === 0}
                >
                  ↑
                </button>
                <button 
                  className="secondary" 
                  onClick={() => moveSkill(index, 'down')} 
                  disabled={index === list.length - 1}
                >
                  ↓
                </button>
                <button className={styles.deleteButton} onClick={() => deleteSkillCategory(skill.id)}>
                  Delete
                </button>
              </div>
            </div>

            <div className={styles.inputGroup}>
              <label>Skill Category</label>
              <input
                type="text"
                placeholder="Languages or Frameworks"
                value={skill.category}
                onChange={(e) => handleSkillChange(skill.id, 'category', e.target.value)}
              />
            </div>

            <div className={styles.inputGroup}>
              <label>Skills (Comma-separated)</label>
              <input
                type="text"
                placeholder="JavaScript, TypeScript, Python, Ruby"
                value={skill.skills}
                onChange={(e) => handleSkillChange(skill.id, 'skills', e.target.value)}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
