import { ResumeState } from './types';

export interface AtsMetric {
  name: string;
  score: number;
  maxPoints: number;
  description: string;
  passed: boolean;
  suggestions: string[];
}

export interface AtsScore {
  overallScore: number;
  metrics: AtsMetric[];
}

const ACTION_VERBS = new Set([
  'led', 'managed', 'developed', 'designed', 'built', 'created', 'implemented', 
  'optimized', 'increased', 'decreased', 'reduced', 'spearheaded', 'engineered', 
  'architected', 'authored', 'launched', 'initiated', 'coordinated', 'collaborated', 
  'programmed', 'automated', 'saved', 'generated', 'improved', 'accelerated', 
  'established', 'expanded', 'formulated', 'headed', 'produced', 'resolved', 
  'supervised', 'trained', 'mentored', 'analyzed', 'delivered', 'conducted'
]);

const BUZZWORDS = new Set([
  'synergy', 'go-getter', 'detail-oriented', 'team player', 'hard worker', 
  'self-motivated', 'guru', 'ninja', 'rockstar', 'motivated', 'passionate', 
  'results-oriented', 'dynamic', 'think outside the box'
]);

export function checkAts(state: ResumeState): AtsScore {
  const metrics: AtsMetric[] = [];

  // --- 1. CONTACT INFO (Max 15 Points) ---
  const contactSuggestions: string[] = [];
  let contactScore = 0;
  
  if (state.personalInfo.email) contactScore += 4;
  else contactSuggestions.push('Add your professional email address.');

  if (state.personalInfo.phone) contactScore += 4;
  else contactSuggestions.push('Add your phone number for recruiters.');

  if (state.personalInfo.location) contactScore += 3;
  else contactSuggestions.push('Add your location (City, State/Country).');

  if (state.personalInfo.linkedin) contactScore += 2;
  else contactSuggestions.push('Add your LinkedIn profile link to improve social proof.');

  if (state.personalInfo.github || state.personalInfo.website) contactScore += 2;
  else contactSuggestions.push('Add your GitHub or personal website to showcase projects.');

  metrics.push({
    name: 'Contact Information',
    score: contactScore,
    maxPoints: 15,
    description: 'Recruiters and ATS parsers require standard contact channels.',
    passed: contactScore >= 11,
    suggestions: contactSuggestions,
  });


  // --- 2. SECTION COMPLETENESS (Max 15 Points) ---
  const sectionSuggestions: string[] = [];
  let sectionScore = 0;

  if (state.experience && state.experience.length > 0) sectionScore += 5;
  else sectionSuggestions.push('Add at least one professional work experience.');

  if (state.education && state.education.length > 0) sectionScore += 4;
  else sectionSuggestions.push('Add your academic background (Education section).');

  if (state.skills && state.skills.length > 0) sectionScore += 3;
  else sectionSuggestions.push('List your skills to match job descriptions.');

  if (state.projects && state.projects.length > 0) sectionScore += 3;
  else sectionSuggestions.push('Add personal or professional projects to show applied experience.');

  metrics.push({
    name: 'Section Completeness',
    score: sectionScore,
    maxPoints: 15,
    description: 'Checks if your resume has all essential sections.',
    passed: sectionScore >= 12,
    suggestions: sectionSuggestions,
  });


  // --- 3. CONTENT LENGTH & QUANTITY (Max 15 Points) ---
  const lengthSuggestions: string[] = [];
  let lengthScore = 0;

  // Calculate total words in text fields
  let allText = `${state.personalInfo.fullName} ${state.personalInfo.jobTitle} `;
  state.experience.forEach(exp => {
    allText += `${exp.company} ${exp.position} ${exp.description.join(' ')} `;
  });
  state.education.forEach(edu => {
    allText += `${edu.institution} ${edu.degree} ${edu.major} ${edu.details} `;
  });
  state.projects.forEach(proj => {
    allText += `${proj.name} ${proj.technologies} ${proj.description.join(' ')} `;
  });
  state.skills.forEach(sk => {
    allText += `${sk.category} ${sk.skills} `;
  });

  const wordCount = allText.split(/\s+/).filter(w => w.trim().length > 0).length;

  if (wordCount >= 350 && wordCount <= 800) {
    lengthScore += 8;
  } else if (wordCount > 800 && wordCount <= 1100) {
    lengthScore += 4;
    lengthSuggestions.push(`Your resume has ${wordCount} words. Consider editing down closer to 800 words to keep it readable.`);
  } else if (wordCount > 1100) {
    lengthScore += 1;
    lengthSuggestions.push(`Your resume is very long (${wordCount} words). ATS systems and recruiters prefer a dense 1-page summary (350-800 words).`);
  } else if (wordCount > 0 && wordCount < 350) {
    lengthScore += 2;
    lengthSuggestions.push(`Your resume is too brief (${wordCount} words). Expand on your experience, details, or projects.`);
  }

  // Bullet point count helper
  let totalBullets = 0;
  let experienceCount = state.experience.length;
  state.experience.forEach(exp => {
    totalBullets += exp.description.filter(b => b.trim().length > 0).length;
  });

  const avgBullets = experienceCount > 0 ? totalBullets / experienceCount : 0;
  if (experienceCount > 0) {
    if (avgBullets >= 3 && avgBullets <= 6) {
      lengthScore += 7;
    } else if (avgBullets < 3) {
      lengthScore += 3;
      lengthSuggestions.push('Add more details to your experience entries. Aim for 3-5 bullet points per job.');
    } else {
      lengthScore += 5;
      lengthSuggestions.push('Some job descriptions have too many bullet points. Keep it punchy (3-6 per role).');
    }
  } else {
    lengthScore += 0;
    lengthSuggestions.push('Add experience entries with bullet point descriptions.');
  }

  metrics.push({
    name: 'Content & Formatting Density',
    score: lengthScore,
    maxPoints: 15,
    description: 'Evaluates the length, word count, and bullet spacing of your resume.',
    passed: lengthScore >= 11,
    suggestions: lengthSuggestions,
  });


  // --- 4. ACTION VERBS (Max 20 Points) ---
  const actionSuggestions: string[] = [];
  let actionScore = 0;
  
  let bulletPointsList: string[] = [];
  state.experience.forEach(exp => {
    bulletPointsList = bulletPointsList.concat(exp.description.filter(b => b.trim().length > 0));
  });
  state.projects.forEach(proj => {
    bulletPointsList = bulletPointsList.concat(proj.description.filter(b => b.trim().length > 0));
  });

  let bulletsStartingWithActionVerb = 0;
  let actionVerbsFound = new Set<string>();

  bulletPointsList.forEach(bullet => {
    // Standardize bullet point text
    const cleanBullet = bullet.toLowerCase().trim().replace(/^[^\w]+/, '');
    const words = cleanBullet.split(/\s+/);
    if (words.length > 0) {
      const firstWord = words[0].replace(/[^\w]/g, ''); // strip punctuation
      if (ACTION_VERBS.has(firstWord)) {
        bulletsStartingWithActionVerb++;
      }
      
      // Also look for other action verbs in the bullet
      words.forEach(w => {
        const cleanW = w.replace(/[^\w]/g, '');
        if (ACTION_VERBS.has(cleanW)) {
          actionVerbsFound.add(cleanW);
        }
      });
    }
  });

  const bulletCount = bulletPointsList.length;
  const actionVerbPercentage = bulletCount > 0 ? (bulletsStartingWithActionVerb / bulletCount) * 100 : 0;

  if (bulletCount === 0) {
    actionSuggestions.push('Write descriptive bullet points starting with strong action verbs (e.g., Developed, Lead, Engineered).');
  } else {
    if (actionVerbPercentage >= 70) {
      actionScore += 12;
    } else if (actionVerbPercentage >= 40) {
      actionScore += 8;
      actionSuggestions.push(`Only ${Math.round(actionVerbPercentage)}% of your bullet points start with an action verb. Aim for 70%+ starting with verbs like "Designed", "Executed", or "Analyzed".`);
    } else {
      actionScore += 3;
      actionSuggestions.push(`Few bullet points start with action verbs (${Math.round(actionVerbPercentage)}%). Restructure your bullets to start with actions rather than passive phrases like "Responsible for...".`);
    }

    // Diverse action verbs count
    if (actionVerbsFound.size >= 8) {
      actionScore += 8;
    } else if (actionVerbsFound.size >= 4) {
      actionScore += 4;
      actionSuggestions.push(`You used ${actionVerbsFound.size} unique action verbs. Try to vary your vocabulary to make the resume more engaging.`);
    } else {
      actionScore += 1;
      actionSuggestions.push('Use a wider variety of action verbs. Avoid repeating the same verbs like "developed" or "managed".');
    }
  }

  metrics.push({
    name: 'Impact & Action Verbs',
    score: actionScore,
    maxPoints: 20,
    description: 'Measures your usage of strong action verbs to drive impact.',
    passed: actionScore >= 12,
    suggestions: actionSuggestions,
  });


  // --- 5. BUZZWORDS & CLICHES (Max 15 Points) ---
  const buzzSuggestions: string[] = [];
  let buzzScore = 15;
  const buzzwordsFound: string[] = [];

  // Scan all text for buzzwords
  const lowercaseText = allText.toLowerCase();
  BUZZWORDS.forEach(buzzword => {
    // simple boundary match
    const regex = new RegExp(`\\b${buzzword}\\b`, 'g');
    if (regex.test(lowercaseText)) {
      buzzwordsFound.push(buzzword);
      buzzScore -= 3;
    }
  });

  if (buzzScore < 0) buzzScore = 0;

  if (buzzwordsFound.length > 0) {
    buzzSuggestions.push(`Found weak/overused buzzwords: "${buzzwordsFound.join('", "')}". Replace these cliches with specific actions and metrics.`);
  }

  metrics.push({
    name: 'Cliché & Buzzword Avoidance',
    score: buzzScore,
    maxPoints: 15,
    description: 'Scans for generic terms like "team player" or "guru" which ATS and recruiters disfavor.',
    passed: buzzScore >= 12,
    suggestions: buzzSuggestions,
  });


  // --- 6. QUANTIFIABLE ACHIEVEMENTS (Max 20 Points) ---
  const metricSuggestions: string[] = [];
  let metricScore = 0;
  let bulletsWithMetrics = 0;

  bulletPointsList.forEach(bullet => {
    // Regex matches numbers, percentages, currency, or performance multipliers
    const hasMetric = /[\$\d%x]/.test(bullet) && /\d+/.test(bullet);
    if (hasMetric) {
      bulletsWithMetrics++;
    }
  });

  const metricPercentage = bulletCount > 0 ? (bulletsWithMetrics / bulletCount) * 100 : 0;

  if (bulletCount === 0) {
    metricSuggestions.push('Add experience entries with metrics to qualify achievements.');
  } else {
    if (metricPercentage >= 40) {
      metricScore = 20;
    } else if (metricPercentage >= 20) {
      metricScore = 12;
      metricSuggestions.push(`Only ${Math.round(metricPercentage)}% of your bullet points contain numbers or metrics. Try to quantify your impact in more bullets (aim for 40%+).`);
    } else if (metricPercentage > 0) {
      metricScore = 6;
      metricSuggestions.push(`Very few metrics detected (${Math.round(metricPercentage)}% of bullets). Add quantifiable outcomes, like revenue generated, time saved, or team sizes managed.`);
    } else {
      metricScore = 0;
      metricSuggestions.push('No measurable metrics detected. Recruiters look for metrics. Add numbers, percentages, or currency values to demonstrate concrete achievements.');
    }
  }

  metrics.push({
    name: 'Quantifiable Achievements',
    score: metricScore,
    maxPoints: 20,
    description: 'Scans for percentages, counts, currency figures, and performance multipliers.',
    passed: metricScore >= 12,
    suggestions: metricSuggestions,
  });


  // --- CALCULATE OVERALL SCORE ---
  const totalScorePoints = metrics.reduce((acc, m) => acc + m.score, 0);
  const totalMaxPoints = metrics.reduce((acc, m) => acc + m.maxPoints, 0);
  const overallScore = totalMaxPoints > 0 ? Math.round((totalScorePoints / totalMaxPoints) * 100) : 0;

  return {
    overallScore,
    metrics,
  };
}
