import { ResumeState } from './types';

// Helper to escape special LaTeX characters
export function escapeLatex(text: string | undefined): string {
  if (!text) return '';
  return text
    .replace(/\\/g, '\\textbackslash{}')
    .replace(/&/g, '\\&')
    .replace(/%/g, '\\%')
    .replace(/\$/g, '\\$')
    .replace(/#/g, '\\#')
    .replace(/_/g, '\\_')
    .replace(/{/g, '\\{')
    .replace(/}/g, '\\}')
    .replace(/~/g, '\\textasciitilde{}')
    .replace(/\^/g, '\\textasciicircum{}');
}

export function generateLatex(state: ResumeState): string {
  const { personalInfo, education, experience, projects, skills } = state;

  // Build Contact Information Line
  const contactParts: string[] = [];
  if (personalInfo.email) {
    contactParts.push(`\\href{mailto:${personalInfo.email}}{\\underline{${escapeLatex(personalInfo.email)}}}`);
  }
  if (personalInfo.phone) {
    contactParts.push(escapeLatex(personalInfo.phone));
  }
  if (personalInfo.location) {
    contactParts.push(escapeLatex(personalInfo.location));
  }
  if (personalInfo.website) {
    const cleanUrl = personalInfo.website.replace(/https?:\/\//, '');
    contactParts.push(`\\href{${personalInfo.website}}{\\underline{${escapeLatex(cleanUrl)}}}`);
  }
  if (personalInfo.linkedin) {
    const cleanUrl = personalInfo.linkedin.replace(/https?:\/\/(www\.)?linkedin\.com\/in\//, 'linkedin.com/in/');
    contactParts.push(`\\href{${personalInfo.linkedin}}{\\underline{${escapeLatex(cleanUrl)}}}`);
  }
  if (personalInfo.github) {
    const cleanUrl = personalInfo.github.replace(/https?:\/\/(www\.)?github\.com\//, 'github.com/');
    contactParts.push(`\\href{${personalInfo.github}}{\\underline{${escapeLatex(cleanUrl)}}}`);
  }

  const contactLine = contactParts.join(' $|$ ');

  let latex = `\\documentclass[letterpaper,11pt]{article}

\\usepackage{latexsym}
\\usepackage[empty]{fullpage}
\\usepackage{titlesec}
\\usepackage{marvosym}
\\usepackage[usenames,dvipsnames]{color}
\\usepackage{verbatim}
\\usepackage{enumitem}
\\usepackage[hidelinks]{hyperref}
\\usepackage{fancyhdr}
\\usepackage[english]{babel}
\\usepackage{tabularx}
\\input{glyphtounicode}

\\pagestyle{fancy}
\\fancyhf{} % clear all header and footer fields
\\fancyfoot{}
\\renewcommand{\\headrulewidth}{0pt}
\\renewcommand{\\footrulewidth}{0pt}

% Adjust margins
\\addtolength{\\oddsidemargin}{-0.5in}
\\addtolength{\\evensidemargin}{-0.5in}
\\addtolength{\\textwidth}{1.0in}
\\addtolength{\\topmargin}{-.5in}
\\addtolength{\\textheight}{1.0in}

\\urlstyle{same}

\\raggedbottom
\\raggedright
\\setlength{\\tabcolsep}{0in}

% Sections formatting
\\titleformat{\\section}{
  \\vspace{-4pt}\\scshape\\raggedright\\large
}{}{0em}{}[\\color{black}\\titlerule \\vspace{-5pt}]

% Ensure that generate pdf is machine readable/ATS parsable
\\pdfgentounicode=1

%-------------------------
% Custom commands
\\newcommand{\\resumeItem}[1]{
  \\item\\small{
    {#1 \\vspace{-2pt}}
  }
}

\\newcommand{\\resumeSubheading}[4]{
  \\vspace{-2pt}\\item
    \\begin{tabular*}{0.97\\textwidth}[t]{l@{\\extracolsep{\\fill}}r}
      \\textbf{#1} & #2 \\\\
      \\textit{\\small#3} & \\textit{\\small #4} \\\\
    \\end{tabular*}\\vspace{-7pt}
}

\\newcommand{\\resumeProjectHeading}[2]{
    \\item
    \\begin{tabular*}{0.97\\textwidth}{l@{\\extracolsep{\\fill}}r}
      \\small\\textbf{#1} & #2 \\\\
    \\end{tabular*}\\vspace{-7pt}
}

\\renewcommand\\labelitemii{$\\vcenter{\\hbox{\\tiny$\\bullet$}}$}

\\newcommand{\\resumeSubHeadingListStart}{\\begin{itemize}[leftmargin=0.15in, label={}]}
\\newcommand{\\resumeSubHeadingListEnd}{\\end{itemize}}
\\newcommand{\\resumeItemListStart}{\\begin{itemize}}
\\newcommand{\\resumeItemListEnd}{\\end{itemize}\\vspace{-5pt}}

%-------------------------------------------
%%%%%%  RESUME STARTS HERE  %%%%%%%%%%%%%%%%%%%%%%%%%%%%


\\begin{document}

%----------HEADING----------
\\begin{center}
    \\textbf{\\Huge \\scshape ${escapeLatex(personalInfo.fullName || 'Your Name')}} \\\\ \\vspace{1pt}
    ${personalInfo.jobTitle ? `\\small \\textit{${escapeLatex(personalInfo.jobTitle)}} \\\\ \\vspace{4pt}` : ''}
    \\small ${contactLine}
\\end{center}
`;

  // EDUCATION SECTION
  if (education && education.length > 0) {
    latex += `\n%-----------EDUCATION-----------\n\\section{Education}\n  \\resumeSubHeadingListStart\n`;
    education.forEach((edu) => {
      latex += `    \\resumeSubheading{
      ${escapeLatex(edu.institution)}}{${escapeLatex(edu.location)}}
      {${escapeLatex(edu.degree)}${edu.major ? ` in ${escapeLatex(edu.major)}` : ''}}{${escapeLatex(edu.startDate)} -- ${escapeLatex(edu.endDate)}}
`;
      if (edu.details) {
        latex += `      \\resumeItemListStart
        \\resumeItem{${escapeLatex(edu.details)}}
      \\resumeItemListEnd
`;
      }
    });
    latex += `  \\resumeSubHeadingListEnd\n`;
  }

  // EXPERIENCE SECTION
  if (experience && experience.length > 0) {
    latex += `\n%-----------EXPERIENCE-----------\n\\section{Experience}\n  \\resumeSubHeadingListStart\n`;
    experience.forEach((exp) => {
      latex += `    \\resumeSubheading{
      ${escapeLatex(exp.company)}}{${escapeLatex(exp.location)}}
      {${escapeLatex(exp.position)}}{${escapeLatex(exp.startDate)} -- ${escapeLatex(exp.endDate)}}
`;
      const validBullets = exp.description.filter(bullet => bullet.trim() !== '');
      if (validBullets.length > 0) {
        latex += `      \\resumeItemListStart\n`;
        validBullets.forEach((bullet) => {
          latex += `        \\resumeItem{${escapeLatex(bullet)}}\n`;
        });
        latex += `      \\resumeItemListEnd\n`;
      }
    });
    latex += `  \\resumeSubHeadingListEnd\n`;
  }

  // PROJECTS SECTION
  if (projects && projects.length > 0) {
    latex += `\n%-----------PROJECTS-----------\n\\section{Projects}\n  \\resumeSubHeadingListStart\n`;
    projects.forEach((proj) => {
      const headingText = proj.name + (proj.technologies ? ` $|$ \\emph{${escapeLatex(proj.technologies)}}` : '');
      const linkText = proj.link ? `\\href{${proj.link}}{\\underline{Link}}` : '';
      
      latex += `    \\resumeProjectHeading{
      ${headingText}}{${linkText}}
`;
      const validBullets = proj.description.filter(bullet => bullet.trim() !== '');
      if (validBullets.length > 0) {
        latex += `      \\resumeItemListStart\n`;
        validBullets.forEach((bullet) => {
          latex += `        \\resumeItem{${escapeLatex(bullet)}}\n`;
        });
        latex += `      \\resumeItemListEnd\n`;
      }
    });
    latex += `  \\resumeSubHeadingListEnd\n`;
  }

  // SKILLS SECTION
  if (skills && skills.length > 0) {
    latex += `\n%-----------TECHNICAL SKILLS-----------\n\\section{Technical Skills}\n \\begin{itemize}[leftmargin=0.15in, label={}]\n    \\small{\\item{\n`;
    skills.forEach((skill, index) => {
      const isLast = index === skills.length - 1;
      latex += `      \\textbf{${escapeLatex(skill.category)}}: {${escapeLatex(skill.skills)}}${isLast ? '' : ' \\\\'}\n`;
    });
    latex += `    }}\n \\end{itemize}\n`;
  }

  latex += `\n\\end{document}\n`;
  return latex;
}
