import { ResumeState } from './types';

export const defaultResumeData: ResumeState = {
  personalInfo: {
    fullName: 'Adhiyaman Srinivasan',
    jobTitle: 'Software Engineering Intern',
    email: 'adhiyamansrinivasan@gmail.com',
    phone: '+91 73387 71977',
    location: 'Chennai, India',
    website: 'https://adhiyaman.vercel.app',
    linkedin: 'https://linkedin.com/in/adhiyaman2006',
    github: 'https://github.com/ichor-hash',
  },
  experience: [
    {
      id: 'exp-1',
      company: 'Distributed Systems Laboratory (Open Source)',
      position: 'Software Engineering Contributor',
      location: 'Chennai, India',
      startDate: 'May 2025',
      endDate: 'Present',
      description: [
        'Architected a high-throughput distributed log indexing system in Go using channel synchronization, improving parallel message processing speeds by 42% and handling 100k+ concurrent client queries.',
        'Optimized multi-threaded resource synchronization algorithms in a key-value caching system, reducing memory lock contention by 35% and boosting total system reliability under high loads.',
        'Developed end-to-end distributed system visualization dashboards using Next.js and TypeScript, enabling developers to diagnose and resolve performance bottlenecks 50% faster.'
      ],
    },
    {
      id: 'exp-2',
      company: 'Systems & App Lab',
      position: 'Backend Software Developer',
      location: 'Remote',
      startDate: 'Jun 2024',
      endDate: 'Apr 2025',
      description: [
        'Built scalable microservice endpoints in Java using Spring Boot and gRPC, processing 5M+ daily requests with 99.9% uptime and implementing advanced concurrency pools.',
        'Redesigned PostgreSQL database schemas and optimized indexing queries, reducing search API latency by 45% for high-dimensional dataset queries.',
        'Integrated automated CI/CD staging pipelines using Docker and GitHub Actions, saving developers 8 hours of manual deployment overhead per week.'
      ],
    }
  ],
  education: [
    {
      id: 'edu-1',
      institution: 'Vellore Institute of Technology',
      degree: 'Master of Technology',
      major: 'Computer Science and Engineering with Business Analytics',
      location: 'Chennai, India',
      startDate: 'Aug 2025',
      endDate: 'May 2027',
      details: 'GPA: 9.2/10.0. Coursework: Advanced Algorithms, Data Structures, Operating Systems, Compilers, Distributed Systems, Business Data Analytics.',
    }
  ],
  projects: [
    {
      id: 'proj-1',
      name: 'Screened. LaTeX Resume Builder & Scorer',
      technologies: 'Next.js, React, TypeScript, Framer Motion, CSS Modules',
      link: 'https://github.com/ichor-hash/screened',
      description: [
        'Engineered an interactive LaTeX resume builder micro-SaaS with TypeScript and Next.js, achieving 100% client-side compilation speeds in under 200ms.',
        'Designed a 6-metric ATS parsing evaluator checking keyword density, action verb weights, structure completeness, and achievement metrics.',
        'Optimized component layout rendering with hydration skeletons, reducing page loading flashes to 0ms and implementing robust PDF print styling overrides.'
      ],
    },
    {
      id: 'proj-2',
      name: 'Lock-Free Multi-Threaded Cache',
      technologies: 'C/C++, Git, Linux, gtest',
      link: 'https://github.com/ichor-hash/lockfree-cache',
      description: [
        'Implemented a lock-free thread-safe cache in C++ utilizing atomic synchronization primitives, increasing read-write speeds by 30% under heavy thread competition.',
        'Created visual performance analysis and debugging tools using Python and Matplotlib to inspect execution profiles and memory footprint spikes.'
      ],
    }
  ],
  skills: [
    {
      id: 'skill-1',
      category: 'Languages',
      skills: 'TypeScript, JavaScript, Go, C/C++, Java, Python, SQL, HTML/CSS',
    },
    {
      id: 'skill-2',
      category: 'Distributed & Systems',
      skills: 'Distributed Systems, Concurrency, Multi-threading, Synchronization, gRPC, REST APIs',
    },
    {
      id: 'skill-3',
      category: 'Frameworks & Tools',
      skills: 'Next.js, React, Node.js, Spring Boot, Docker, Git, PostgreSQL, Redis, Linux, GitHub Actions',
    }
  ],
};

// Force cache eviction on load
if (typeof window !== 'undefined') {
  const saved = localStorage.getItem('novacv_data');
  if (saved) {
    try {
      const parsed = JSON.parse(saved);
      const isOldName = parsed.personalInfo && parsed.personalInfo.fullName === 'Alex Morgan';
      const hasTargetJob = parsed.personalInfo && parsed.personalInfo.jobTitle && parsed.personalInfo.jobTitle.includes('Target');
      const isOldHandles = parsed.personalInfo && parsed.personalInfo.linkedin && parsed.personalInfo.linkedin.includes('adhiyaman-srinivasan');
      const isWrongDegree = parsed.education && parsed.education[0] && parsed.education[0].major !== 'Computer Science and Engineering with Business Analytics';
      
      if (isOldName || hasTargetJob || isOldHandles || isWrongDegree) {
        // Force delete cache in local browser
        localStorage.removeItem('novacv_data');
        // Let it get re-initialized on load
      }
    } catch(e) {}
  }
}
