export const STREAMS = [
  'IT / Software',
  'Marketing',
  'Sales',
  'Mechanical Engineering',
  'Electrical Engineering',
  'Civil Engineering',
  'Finance',
  'Accounting',
  'Collections',
  'Operations',
  'Human Resources',
  'Design',
  'Healthcare',
  'Education / Teaching',
  'Legal',
  'Consulting',
  'Other',
]

export const defaultProfile = {
  // ---- Basic info ----
  name: '{Your Name}',
  initials: 'YN',
  title: '{Your Role / Title}',
  stream: 'IT / Software',
  tagline:
    'A short, punchy one-liner about what you do and who you help. Replace this with your own.',
  location: '{City, Country}',
  email: 'you@example.com',
  phone: '',
  resumeUrl: '',

  // ---- About ----
  about: [
    'Write a couple of paragraphs about who you are, what you care about, and what kind of work you do. Keep it conversational.',
    'Mention a notable project, a technology you love, or a recent achievement. End with what you are currently exploring or open to.',
  ],

  // ---- Socials ----
  socials: [
    { label: 'LinkedIn', href: 'https://linkedin.com/in/yourhandle' },
    { label: 'GitHub', href: 'https://github.com/yourhandle' },
    { label: 'Twitter / X', href: 'https://twitter.com/yourhandle' },
  ],

  // ---- Skills (works for any stream — software, sales tools, machinery, accounting software, etc.) ----
  skills: [
    {
      group: 'Core skills',
      items: ['Communication', 'Problem solving', 'Collaboration'],
    },
    {
      group: 'Tools / Software',
      items: ['MS Excel', 'PowerPoint', 'Outlook'],
    },
    {
      group: 'Domain expertise',
      items: ['Add domain-specific skills here'],
    },
  ],

  // ---- Experience (work history timeline) ----
  experience: [
    {
      role: 'Your role / job title',
      company: 'Company name',
      location: 'City, Country',
      startDate: 'Jan 2022',
      endDate: 'Present',
      bullets: [
        'Achievement or responsibility — quantify with numbers when possible.',
        'Another bullet about impact, scope, or recognition.',
      ],
    },
    {
      role: 'Previous role',
      company: 'Previous company',
      location: 'City, Country',
      startDate: 'Aug 2019',
      endDate: 'Dec 2021',
      bullets: [
        'Outcome you delivered — e.g. reduced cost by X%, won Y account, completed Z project.',
      ],
    },
  ],

  // ---- Education ----
  education: [
    {
      degree: 'Degree (e.g. B.Tech, B.Com, MBA)',
      field: 'Field of study',
      institution: 'University / Institute name',
      location: 'City, Country',
      startDate: '2015',
      endDate: '2019',
      detail: 'GPA, honours, thesis, or any extra detail (optional).',
    },
  ],

  // ---- Certifications / Licenses (great for engineering, finance, healthcare, IT) ----
  certifications: [
    {
      name: 'Certification or license name',
      issuer: 'Issuing body',
      date: '2023',
      link: '',
    },
  ],

  // ---- Projects / Campaigns / Engagements (label is customisable) ----
  projects: [
    {
      title: 'Project / Campaign / Engagement title',
      description:
        'Short description focused on the outcome and your role. Replace with your own.',
      tech: ['Tool / Skill 1', 'Tool / Skill 2'],
      link: '',
      repo: '',
    },
    {
      title: 'Another project',
      description: '1–2 sentences on what you delivered and the impact.',
      tech: ['Skill A', 'Skill B'],
      link: '',
      repo: '',
    },
  ],

  // ---- Section labels — customise per stream ----
  // e.g. "Projects" for IT, "Campaigns" for Marketing, "Key Accounts" for Sales,
  // "Engagements" for Finance/Consulting, "Site Projects" for Civil, etc.
  labels: {
    projects: 'Selected work',
  },

  // ---- Section visibility — toggle from Admin ----
  sections: {
    about: true,
    skills: true,
    experience: true,
    education: true,
    certifications: true,
    projects: true,
    contact: true,
  },
}
