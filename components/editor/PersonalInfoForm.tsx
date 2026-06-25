import React from 'react';
import { PersonalInfo } from '../../lib/types';
import styles from '../EditorPanel.module.css';

interface PersonalInfoFormProps {
  data: PersonalInfo;
  onChange: (newData: PersonalInfo) => void;
}

export default function PersonalInfoForm({ data, onChange }: PersonalInfoFormProps) {
  const handleChange = (field: keyof PersonalInfo, value: string) => {
    onChange({
      ...data,
      [field]: value
    });
  };

  return (
    <div className={styles.formSection}>
      <div className={styles.row}>
        <div className={styles.inputGroup}>
          <label htmlFor="fullName">Full Name</label>
          <input
            id="fullName"
            type="text"
            placeholder="John Doe"
            value={data.fullName}
            onChange={(e) => handleChange('fullName', e.target.value)}
          />
        </div>
        <div className={styles.inputGroup}>
          <label htmlFor="jobTitle">Job Title</label>
          <input
            id="jobTitle"
            type="text"
            placeholder="Full Stack Software Engineer"
            value={data.jobTitle}
            onChange={(e) => handleChange('jobTitle', e.target.value)}
          />
        </div>
      </div>

      <div className={styles.row}>
        <div className={styles.inputGroup}>
          <label htmlFor="email">Email Address</label>
          <input
            id="email"
            type="email"
            placeholder="john.doe@email.com"
            value={data.email}
            onChange={(e) => handleChange('email', e.target.value)}
          />
        </div>
        <div className={styles.inputGroup}>
          <label htmlFor="phone">Phone Number</label>
          <input
            id="phone"
            type="tel"
            placeholder="+1 (555) 019-2834"
            value={data.phone}
            onChange={(e) => handleChange('phone', e.target.value)}
          />
        </div>
      </div>

      <div className={styles.row}>
        <div className={styles.inputGroup}>
          <label htmlFor="location">Location Details</label>
          <input
            id="location"
            type="text"
            placeholder="San Francisco, CA"
            value={data.location}
            onChange={(e) => handleChange('location', e.target.value)}
          />
        </div>
        <div className={styles.inputGroup}>
          <label htmlFor="website">Portfolio Website</label>
          <input
            id="website"
            type="url"
            placeholder="https://johndoe.dev"
            value={data.website}
            onChange={(e) => handleChange('website', e.target.value)}
          />
        </div>
      </div>

      <div className={styles.row}>
        <div className={styles.inputGroup}>
          <label htmlFor="linkedin">LinkedIn URL</label>
          <input
            id="linkedin"
            type="url"
            placeholder="https://linkedin.com/in/johndoe"
            value={data.linkedin}
            onChange={(e) => handleChange('linkedin', e.target.value)}
          />
        </div>
        <div className={styles.inputGroup}>
          <label htmlFor="github">GitHub URL</label>
          <input
            id="github"
            type="url"
            placeholder="https://github.com/johndoe"
            value={data.github}
            onChange={(e) => handleChange('github', e.target.value)}
          />
        </div>
      </div>
    </div>
  );
}
