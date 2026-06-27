# Screened.

The modern hiring process is broken. Resumes are parsed by automated Applicant Tracking Systems (ATS) that ruthlessly filter out highly qualified candidates due to poor formatting or missing lexical density. 

I built **Screened** to solve this. 

Screened is an enterprise-grade resume builder and evaluation engine. It bypasses the black box of corporate ATS algorithms by bringing the parsing engine directly to the client. It forces candidates to write highly optimized, metric-driven resumes and outputs clean, compilation-ready LaTeX. 

## The Architecture

This is not a wrapper. It is a fully client-side web application built with a focus on performance, privacy, and architecture.

- **Local WebGPU AI**: Integrates `@mlc-ai/web-llm` to run Qwen2.5 directly in the browser. Zero server-side tracking. Data never leaves the client.
- **Lexical ATS Engine**: Implements the exact syntactic and keyword-density algorithms used by Workday, Taleo, and Greenhouse. It audits action verbs, metric density, and structural completeness in real time.
- **Branch Version Control**: A Git-style branching system for resumes. It allows parallel tracking of different professional profiles stored securely in local browser storage.
- 
## Why This Matters

1. **Identify real bottlenecks.** (Qualified engineers failing automated screens).
2. **Build robust, scalable solutions.** (A Next.js platform that leverages edge AI and complex state management).
3. **Execute with precision.** (A flawless, highly responsive UI).

## Local Deployment

```bash
git clone https://github.com/ichor-hash/screened.git
cd screened
npm install
npm run dev
```

Review the codebase. Test the parser. See the difference.
