/**
 * SkillBridge Realistic Seed Data
 * 15 Users (including 5 Mentors + 1 Admin + 9 Regular Students)
 * 8 Categories, 20 Skills, Exchange Requests, Sessions, Messages, Reviews, Notifications
 */

const categories = [
  {
    id: "cat-1",
    name: "Web Development",
    slug: "web-development",
    description: "Modern frontend, backend, and full-stack web technologies.",
    icon: "Code"
  },
  {
    id: "cat-2",
    name: "Mobile Development",
    slug: "mobile-development",
    description: "Cross-platform and native iOS & Android application development.",
    icon: "Smartphone"
  },
  {
    id: "cat-3",
    name: "UI/UX Design",
    slug: "ui-ux-design",
    description: "User research, wireframing, prototyping, and modern design systems.",
    icon: "Layout"
  },
  {
    id: "cat-4",
    name: "Data Science & AI",
    slug: "data-science-ai",
    description: "Machine learning, data analytics, Python, and neural networks.",
    icon: "Cpu"
  },
  {
    id: "cat-5",
    name: "Digital Marketing",
    slug: "digital-marketing",
    description: "SEO, content strategy, social media growth, and performance marketing.",
    icon: "TrendingUp"
  },
  {
    id: "cat-6",
    name: "Languages",
    slug: "languages",
    description: "Language learning and cultural conversational exchange.",
    icon: "Globe"
  },
  {
    id: "cat-7",
    name: "Photography & Video",
    slug: "photography-video",
    description: "Visual storytelling, photo retouching, cinematography, and editing.",
    icon: "Camera"
  },
  {
    id: "cat-8",
    name: "Personal Development",
    slug: "personal-development",
    description: "Public speaking, leadership, executive coaching, and productivity.",
    icon: "Sparkles"
  }
];

const skills = [
  // Web Development
  {
    id: "skill-1",
    name: "React.js",
    slug: "react-js",
    description: "Component lifecycle, React hooks, state management, and modern SPA architecture.",
    icon: "Code",
    difficulty: "INTERMEDIATE",
    categoryId: "cat-1"
  },
  {
    id: "skill-2",
    name: "Node.js & Express",
    slug: "node-js-express",
    description: "Scalable REST APIs, middleware, authentication, and backend server architecture.",
    icon: "Server",
    difficulty: "INTERMEDIATE",
    categoryId: "cat-1"
  },
  {
    id: "skill-3",
    name: "TypeScript",
    slug: "typescript",
    description: "Static typing, generics, interfaces, and building robust large-scale applications.",
    icon: "FileCode",
    difficulty: "ADVANCED",
    categoryId: "cat-1"
  },
  // Mobile Development
  {
    id: "skill-4",
    name: "Flutter & Dart",
    slug: "flutter-dart",
    description: "Build beautiful natively compiled multi-platform mobile applications.",
    icon: "Smartphone",
    difficulty: "INTERMEDIATE",
    categoryId: "cat-2"
  },
  {
    id: "skill-5",
    name: "React Native",
    slug: "react-native",
    description: "Cross-platform mobile development using JavaScript and React primitives.",
    icon: "Smartphone",
    difficulty: "INTERMEDIATE",
    categoryId: "cat-2"
  },
  {
    id: "skill-6",
    name: "Swift & iOS",
    slug: "swift-ios",
    description: "Native iOS app development using Swift, SwiftUI, and Apple design guidelines.",
    icon: "Apple",
    difficulty: "ADVANCED",
    categoryId: "cat-2"
  },
  // UI/UX Design
  {
    id: "skill-7",
    name: "Figma UI/UX Design",
    slug: "figma-ui-ux",
    description: "Interactive prototypes, design systems, auto-layout, and UX usability testing.",
    icon: "Figma",
    difficulty: "INTERMEDIATE",
    categoryId: "cat-3"
  },
  {
    id: "skill-8",
    name: "User Research & Wireframing",
    slug: "user-research-wireframing",
    description: "Conducting user interviews, customer journey maps, and low-fidelity wireframing.",
    icon: "Layout",
    difficulty: "BEGINNER",
    categoryId: "cat-3"
  },
  {
    id: "skill-9",
    name: "Design Systems & Tokens",
    slug: "design-systems-tokens",
    description: "Creating scalable cross-team design systems with atomic design principles.",
    icon: "Layers",
    difficulty: "ADVANCED",
    categoryId: "cat-3"
  },
  // Data Science & AI
  {
    id: "skill-10",
    name: "Python for Data Analysis",
    slug: "python-data-analysis",
    description: "Data manipulation, Pandas, NumPy, and statistical exploratory analysis.",
    icon: "PieChart",
    difficulty: "BEGINNER",
    categoryId: "cat-4"
  },
  {
    id: "skill-11",
    name: "Machine Learning Foundations",
    slug: "machine-learning-foundations",
    description: "Supervised and unsupervised learning, model evaluation with Scikit-Learn.",
    icon: "Cpu",
    difficulty: "ADVANCED",
    categoryId: "cat-4"
  },
  {
    id: "skill-12",
    name: "Deep Learning with PyTorch",
    slug: "deep-learning-pytorch",
    description: "Neural network architectures, computer vision, and transformer models.",
    icon: "Network",
    difficulty: "ADVANCED",
    categoryId: "cat-4"
  },
  // Digital Marketing
  {
    id: "skill-13",
    name: "Search Engine Optimization (SEO)",
    slug: "seo-mastery",
    description: "Technical SEO, keyword research, on-page optimization, and domain authority.",
    icon: "Search",
    difficulty: "INTERMEDIATE",
    categoryId: "cat-5"
  },
  {
    id: "skill-14",
    name: "Content Strategy & Copywriting",
    slug: "content-strategy-copywriting",
    description: "Compelling storytelling, marketing funnels, and high-conversion copywriting.",
    icon: "Edit3",
    difficulty: "BEGINNER",
    categoryId: "cat-5"
  },
  // Languages
  {
    id: "skill-15",
    name: "Spanish Conversational Fluency",
    slug: "spanish-conversational",
    description: "Practical conversational Spanish for travel, business, and daily communication.",
    icon: "MessageCircle",
    difficulty: "BEGINNER",
    categoryId: "cat-6"
  },
  {
    id: "skill-16",
    name: "Japanese for Beginners",
    slug: "japanese-beginners",
    description: "Hiragana, Katakana, essential Kanji, and everyday conversational phrases.",
    icon: "Globe",
    difficulty: "BEGINNER",
    categoryId: "cat-6"
  },
  {
    id: "skill-17",
    name: "Business English & Presentation",
    slug: "business-english",
    description: "Professional pitching, executive communication, and international business idioms.",
    icon: "Award",
    difficulty: "INTERMEDIATE",
    categoryId: "cat-6"
  },
  // Photography & Video
  {
    id: "skill-18",
    name: "Adobe Premiere & Video Editing",
    slug: "adobe-premiere-editing",
    description: "Timeline pacing, color grading, audio synchronization, and YouTube production.",
    icon: "Video",
    difficulty: "INTERMEDIATE",
    categoryId: "cat-7"
  },
  {
    id: "skill-19",
    name: "Portrait Photography & Lighting",
    slug: "portrait-photography-lighting",
    description: "Studio strobe setup, natural light diffusion, and Lightroom retouching.",
    icon: "Camera",
    difficulty: "INTERMEDIATE",
    categoryId: "cat-7"
  },
  // Personal Development
  {
    id: "skill-20",
    name: "Public Speaking & Toastmasters",
    slug: "public-speaking",
    description: "Overcoming stage anxiety, vocal modulation, and structuring memorable keynote speeches.",
    icon: "Mic",
    difficulty: "BEGINNER",
    categoryId: "cat-8"
  }
];

const users = [
  // 1. Administrator
  {
    id: "usr-admin-1",
    email: "admin@skillbridge.io",
    username: "admin",
    password: "AdminSecurePassword2026!",
    role: "ADMIN",
    isVerified: true,
    isActive: true,
    profile: {
      fullName: "Platform Administrator",
      avatarUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80",
      bio: "SkillBridge official systems and safety operations administrator.",
      location: "San Francisco, CA, USA",
      education: "M.S. in Computer Science, Stanford University",
      occupation: "Lead Platform Architect",
      experienceLevel: "EXPERT",
      languages: "English, French",
      availability: "Full-time System Support",
      averageRating: 5.0,
      totalReviews: 28,
      completedExchanges: 45,
      isMentor: false
    },
    offeredSkills: [
      { skillId: "skill-2", proficiencyLevel: "EXPERT", yearsOfExperience: 8, description: "Backend infrastructure, security, and distributed systems." }
    ],
    wantedSkills: [
      { skillId: "skill-7", priority: "HIGH", goals: "Refining platform UI/UX design workflows." }
    ]
  },

  // 2. Mentor 1: Alex Morgan (React & Web Expert wanting UI/UX)
  {
    id: "usr-mentor-1",
    email: "alex.morgan@example.com",
    username: "alex_react",
    password: "Password123!",
    role: "MENTOR",
    isVerified: true,
    isActive: true,
    profile: {
      fullName: "Alex Morgan",
      avatarUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80",
      bio: "Senior Frontend Engineer with 7+ years of experience building web apps. Passionate about teaching modern React, clean code, and design-to-code pipelines.",
      location: "Austin, TX, USA",
      education: "B.S. in Software Engineering, UT Austin",
      occupation: "Staff Frontend Engineer at TechCorp",
      experienceLevel: "EXPERT",
      languages: "English, Spanish",
      availability: "Tuesdays & Thursdays: 6 PM - 9 PM, Saturdays: 10 AM - 2 PM (CST)",
      githubUrl: "https://github.com/alexmorgan-dev",
      linkedinUrl: "https://linkedin.com/in/alexmorgan-dev",
      averageRating: 4.9,
      totalReviews: 18,
      completedExchanges: 24,
      isMentor: true,
      mentorBio: "Offering mentorship in React 18, Next.js, and state architecture. Looking to trade sessions for hands-on Figma UI/UX mastery!",
      mentorHourlyRate: 0.0
    },
    offeredSkills: [
      { skillId: "skill-1", proficiencyLevel: "EXPERT", yearsOfExperience: 7, description: "Full React stack, custom hooks, performance profiling, and SSR." },
      { skillId: "skill-3", proficiencyLevel: "ADVANCED", yearsOfExperience: 5, description: "TypeScript strict mode and enterprise design patterns." }
    ],
    wantedSkills: [
      { skillId: "skill-7", priority: "HIGH", goals: "Master modern Figma UI/UX prototyping and design systems." },
      { skillId: "skill-8", priority: "MEDIUM", goals: "Learn qualitative user research methodologies." }
    ]
  },

  // 3. Mentor 2: Elena Rostova (Figma & UI/UX Expert wanting React)
  {
    id: "usr-mentor-2",
    email: "elena.design@example.com",
    username: "elena_uiux",
    password: "Password123!",
    role: "MENTOR",
    isVerified: true,
    isActive: true,
    profile: {
      fullName: "Elena Rostova",
      avatarUrl: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=400&q=80",
      bio: "Product Designer & Design Systems lead. I create delightful, human-centered digital experiences and love mentoring devs in visual aesthetics.",
      location: "Berlin, Germany",
      education: "B.A. in Visual Communication, Bauhaus University",
      occupation: "Principal Product Designer at StudioNorth",
      experienceLevel: "EXPERT",
      languages: "English, German, Russian",
      availability: "Mon, Wed, Fri: 5 PM - 8 PM (CET), Sundays: 1 PM - 5 PM (CET)",
      portfolioUrl: "https://elenarostova.design",
      linkedinUrl: "https://linkedin.com/in/elenarostova",
      averageRating: 4.95,
      totalReviews: 22,
      completedExchanges: 31,
      isMentor: true,
      mentorBio: "Teaching end-to-end UX research, wireframing, high-fidelity Figma components, and atomic design. Eager to learn modern React frontends!",
      mentorHourlyRate: 0.0
    },
    offeredSkills: [
      { skillId: "skill-7", proficiencyLevel: "EXPERT", yearsOfExperience: 6, description: "Figma design systems, auto-layout 5.0, tokens, and usability testing." },
      { skillId: "skill-9", proficiencyLevel: "EXPERT", yearsOfExperience: 5, description: "Scalable enterprise design systems and documentation." }
    ],
    wantedSkills: [
      { skillId: "skill-1", priority: "HIGH", goals: "Understand how React components map to Figma design tokens." },
      { skillId: "skill-2", priority: "MEDIUM", goals: "Basic Node.js API integration for frontend apps." }
    ]
  },

  // 4. Mentor 3: Marcus Vance (Python & ML Expert wanting Spanish)
  {
    id: "usr-mentor-3",
    email: "marcus.vance@example.com",
    username: "marcus_ai",
    password: "Password123!",
    role: "MENTOR",
    isVerified: true,
    isActive: true,
    profile: {
      fullName: "Marcus Vance",
      avatarUrl: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=400&q=80",
      bio: "Machine Learning Researcher. 6 years in predictive modeling, deep learning architectures, and data engineering pipelines.",
      location: "Toronto, Canada",
      education: "Ph.D. in Artificial Intelligence, University of Toronto",
      occupation: "AI Scientist at NeuralDynamics",
      experienceLevel: "EXPERT",
      languages: "English",
      availability: "Weeknights 7 PM - 10 PM, Saturdays all day",
      githubUrl: "https://github.com/marcusvance",
      averageRating: 4.85,
      totalReviews: 15,
      completedExchanges: 19,
      isMentor: true,
      mentorBio: "Ready to guide you through Python, Pandas, Scikit-learn, and PyTorch. In return, I want to learn conversational Spanish for travel!",
      mentorHourlyRate: 0.0
    },
    offeredSkills: [
      { skillId: "skill-10", proficiencyLevel: "EXPERT", yearsOfExperience: 8, description: "Data analysis with NumPy, Pandas, and Matplotlib." },
      { skillId: "skill-11", proficiencyLevel: "ADVANCED", yearsOfExperience: 6, description: "Supervised and unsupervised ML models." },
      { skillId: "skill-12", proficiencyLevel: "ADVANCED", yearsOfExperience: 4, description: "Neural networks with PyTorch." }
    ],
    wantedSkills: [
      { skillId: "skill-15", priority: "HIGH", goals: "Learn conversational Spanish fluency for an upcoming sabbatical in Colombia." }
    ]
  },

  // 5. Mentor 4: Sofia Mendez (Spanish Native & SEO Lead wanting Python Data)
  {
    id: "usr-mentor-4",
    email: "sofia.mendez@example.com",
    username: "sofia_seo",
    password: "Password123!",
    role: "MENTOR",
    isVerified: true,
    isActive: true,
    profile: {
      fullName: "Sofia Mendez",
      avatarUrl: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=400&q=80",
      bio: "Digital Growth Strategist and native Spanish speaker. I've scaled e-commerce brands past $10M ARR through organic search and technical SEO.",
      location: "Madrid, Spain",
      education: "B.A. in Marketing & Communications, Complutense University",
      occupation: "Head of Growth at ApexMedia",
      experienceLevel: "EXPERT",
      languages: "Spanish (Native), English (Fluent)",
      availability: "Monday to Thursday: 6 PM - 9 PM (CET)",
      linkedinUrl: "https://linkedin.com/in/sofiamendez",
      averageRating: 4.9,
      totalReviews: 16,
      completedExchanges: 22,
      isMentor: true,
      mentorBio: "Teach native conversational Spanish and high-yield SEO tactics in exchange for Python data automation and analytics skills.",
      mentorHourlyRate: 0.0
    },
    offeredSkills: [
      { skillId: "skill-15", proficiencyLevel: "EXPERT", yearsOfExperience: 10, description: "Native Spanish fluency, grammar, pronunciation, and idioms." },
      { skillId: "skill-13", proficiencyLevel: "EXPERT", yearsOfExperience: 7, description: "Technical SEO audits, keyword clusters, and organic strategy." }
    ],
    wantedSkills: [
      { skillId: "skill-10", priority: "HIGH", goals: "Automate SEO data crawling and keyword reporting using Python." }
    ]
  },

  // 6. Mentor 5: David Kim (Mobile & Flutter Lead wanting Public Speaking)
  {
    id: "usr-mentor-5",
    email: "david.kim@example.com",
    username: "david_flutter",
    password: "Password123!",
    role: "MENTOR",
    isVerified: true,
    isActive: true,
    profile: {
      fullName: "David Kim",
      avatarUrl: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=400&q=80",
      bio: "Senior Mobile Architect specializing in Flutter and cross-platform apps. 10+ published apps on App Store and Google Play.",
      location: "Seattle, WA, USA",
      education: "B.S. in Computer Science, University of Washington",
      occupation: "Lead Mobile Architect at AppSphere",
      experienceLevel: "EXPERT",
      languages: "English, Korean",
      availability: "Weekends 9 AM - 1 PM (PST), Wednesday evenings",
      githubUrl: "https://github.com/davidkim-mobile",
      averageRating: 4.8,
      totalReviews: 12,
      completedExchanges: 17,
      isMentor: true,
      mentorBio: "Offering step-by-step Flutter, Riverpod, and mobile architecture tutoring. Seeking coaching in public speaking for tech conferences.",
      mentorHourlyRate: 0.0
    },
    offeredSkills: [
      { skillId: "skill-4", proficiencyLevel: "EXPERT", yearsOfExperience: 6, description: "Cross-platform mobile architecture, state management, animations." },
      { skillId: "skill-5", proficiencyLevel: "INTERMEDIATE", yearsOfExperience: 3, description: "React Native bridge and component structuring." }
    ],
    wantedSkills: [
      { skillId: "skill-20", priority: "HIGH", goals: "Prepare a keynote speech for an upcoming international developer conference." }
    ]
  },

  // 7. Student 1: Chloe Bennett (Public Speaking coach wanting Flutter)
  {
    id: "usr-student-1",
    email: "chloe.b@example.com",
    username: "chloe_speaks",
    password: "Password123!",
    role: "USER",
    isVerified: true,
    isActive: true,
    profile: {
      fullName: "Chloe Bennett",
      avatarUrl: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=400&q=80",
      bio: "Toastmasters Distinguished Speaker and executive presentation coach. Helping creators and founders communicate with clarity and presence.",
      location: "Chicago, IL, USA",
      education: "M.A. in Communication Studies, Northwestern University",
      occupation: "Executive Speech Consultant",
      experienceLevel: "ADVANCED",
      languages: "English",
      availability: "Weekdays 4 PM - 7 PM (CST)",
      averageRating: 4.95,
      totalReviews: 14,
      completedExchanges: 16,
      isMentor: false
    },
    offeredSkills: [
      { skillId: "skill-20", proficiencyLevel: "EXPERT", yearsOfExperience: 9, description: "Stage presence, speech pacing, vocal variety, and storytelling frameworks." }
    ],
    wantedSkills: [
      { skillId: "skill-4", priority: "HIGH", goals: "Build an interactive speech-timing mobile app with Flutter." }
    ]
  },

  // 8. Student 2: Tariq Al-Mansoor (Video Editing wanting SEO)
  {
    id: "usr-student-2",
    email: "tariq.media@example.com",
    username: "tariq_cuts",
    password: "Password123!",
    role: "USER",
    isVerified: true,
    isActive: true,
    profile: {
      fullName: "Tariq Al-Mansoor",
      avatarUrl: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=400&q=80",
      bio: "Professional Video Editor & Motion Graphics Designer. Edited YouTube videos that generated over 30 million collective views.",
      location: "Dubai, UAE",
      education: "B.A. in Digital Media Arts",
      occupation: "Freelance Creative Editor",
      experienceLevel: "ADVANCED",
      languages: "Arabic (Native), English (Fluent)",
      availability: "Sundays to Thursdays: 6 PM - 10 PM (GST)",
      averageRating: 4.75,
      totalReviews: 8,
      completedExchanges: 11,
      isMentor: false
    },
    offeredSkills: [
      { skillId: "skill-18", proficiencyLevel: "ADVANCED", yearsOfExperience: 5, description: "Adobe Premiere, pacing, sound design, and color grading." }
    ],
    wantedSkills: [
      { skillId: "skill-13", priority: "HIGH", goals: "Master video SEO and organic discoverability." }
    ]
  },

  // 9. Student 3: Liam O'Connor (Node.js developer wanting Japanese)
  {
    id: "usr-student-3",
    email: "liam.oc@example.com",
    username: "liam_backend",
    password: "Password123!",
    role: "USER",
    isVerified: true,
    isActive: true,
    profile: {
      fullName: "Liam O'Connor",
      avatarUrl: "https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?auto=format&fit=crop&w=400&q=80",
      bio: "Backend developer focused on Node.js, microservices, and database optimization. Planning to relocate to Tokyo next year.",
      location: "Dublin, Ireland",
      education: "B.Sc. in Computer Systems, Trinity College Dublin",
      occupation: "Backend Software Engineer",
      experienceLevel: "INTERMEDIATE",
      languages: "English",
      availability: "Flexible evenings (GMT)",
      averageRating: 4.7,
      totalReviews: 6,
      completedExchanges: 9,
      isMentor: false
    },
    offeredSkills: [
      { skillId: "skill-2", proficiencyLevel: "ADVANCED", yearsOfExperience: 4, description: "Node.js REST APIs, database queries, and async patterns." }
    ],
    wantedSkills: [
      { skillId: "skill-16", priority: "HIGH", goals: "Learn Japanese conversation and basic Kanji before relocation." }
    ]
  },

  // 10. Student 4: Kenji Sato (Native Japanese speaker wanting Node.js)
  {
    id: "usr-student-4",
    email: "kenji.sato@example.com",
    username: "kenji_tokyo",
    password: "Password123!",
    role: "USER",
    isVerified: true,
    isActive: true,
    profile: {
      fullName: "Kenji Sato",
      avatarUrl: "https://images.unsplash.com/photo-1501196354995-cbb51c65aaea?auto=format&fit=crop&w=400&q=80",
      bio: "Junior web developer based in Shibuya, Tokyo. Native Japanese speaker looking to build backend engineering skills.",
      location: "Tokyo, Japan",
      education: "B.Eng. in Information Science, Waseda University",
      occupation: "Junior Web Developer",
      experienceLevel: "BEGINNER",
      languages: "Japanese (Native), English (Conversational)",
      availability: "Evenings and Weekend mornings (JST)",
      averageRating: 4.85,
      totalReviews: 7,
      completedExchanges: 10,
      isMentor: false
    },
    offeredSkills: [
      { skillId: "skill-16", proficiencyLevel: "EXPERT", yearsOfExperience: 10, description: "Native Japanese tutoring, pronunciation, polite Keigo, and cultural context." }
    ],
    wantedSkills: [
      { skillId: "skill-2", priority: "HIGH", goals: "Master Node.js, Express, and PostgreSQL backend services." }
    ]
  },

  // 11. Student 5: Maya Lin (Photographer wanting Figma UI)
  {
    id: "usr-student-5",
    email: "maya.lin@example.com",
    username: "maya_photo",
    password: "Password123!",
    role: "USER",
    isVerified: true,
    isActive: true,
    profile: {
      fullName: "Maya Lin",
      avatarUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80",
      bio: "Editorial and portrait photographer. Transitioning into UX/UI visual design to combine my love for visual balance and digital products.",
      location: "Vancouver, Canada",
      education: "Diploma in Professional Photography",
      occupation: "Commercial Photographer",
      experienceLevel: "INTERMEDIATE",
      languages: "English, Mandarin",
      availability: "Mondays & Thursdays: 1 PM - 5 PM (PST)",
      averageRating: 4.9,
      totalReviews: 9,
      completedExchanges: 12,
      isMentor: false
    },
    offeredSkills: [
      { skillId: "skill-19", proficiencyLevel: "EXPERT", yearsOfExperience: 6, description: "Portrait lighting setups, camera controls, color composition, Lightroom." }
    ],
    wantedSkills: [
      { skillId: "skill-7", priority: "HIGH", goals: "Learn Figma wireframing, component auto-layout, and prototyping." }
    ]
  },

  // 12. Student 6: Carlos Rivera (Content Copywriter wanting TypeScript)
  {
    id: "usr-student-6",
    email: "carlos.r@example.com",
    username: "carlos_copy",
    password: "Password123!",
    role: "USER",
    isVerified: true,
    isActive: true,
    profile: {
      fullName: "Carlos Rivera",
      avatarUrl: "https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?auto=format&fit=crop&w=400&q=80",
      bio: "SaaS Copywriter and conversion specialist. I craft landing page messaging that converts visitors into paying customers.",
      location: "Austin, TX, USA",
      education: "B.A. in English Literature",
      occupation: "Senior Copywriter",
      experienceLevel: "ADVANCED",
      languages: "English, Spanish",
      availability: "Weekday mornings 8 AM - 11 AM",
      averageRating: 4.65,
      totalReviews: 5,
      completedExchanges: 7,
      isMentor: false
    },
    offeredSkills: [
      { skillId: "skill-14", proficiencyLevel: "ADVANCED", yearsOfExperience: 5, description: "Direct response copywriting, headline frameworks, landing page copy." }
    ],
    wantedSkills: [
      { skillId: "skill-3", priority: "MEDIUM", goals: "Understand TypeScript fundamentals to write tech documentation." }
    ]
  },

  // 13. Student 7: Aisha Patel (Business English coach wanting Python)
  {
    id: "usr-student-7",
    email: "aisha.patel@example.com",
    username: "aisha_coach",
    password: "Password123!",
    role: "USER",
    isVerified: true,
    isActive: true,
    profile: {
      fullName: "Aisha Patel",
      avatarUrl: "https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=400&q=80",
      bio: "Corporate communications coach and ESL specialist. Helping international founders ace investor pitches and boardroom discussions.",
      location: "London, UK",
      education: "M.A. in Applied Linguistics, UCL",
      occupation: "Executive Communications Consultant",
      experienceLevel: "ADVANCED",
      languages: "English (Native), Hindi",
      availability: "Tuesdays & Fridays: 2 PM - 6 PM (GMT)",
      averageRating: 4.9,
      totalReviews: 11,
      completedExchanges: 14,
      isMentor: false
    },
    offeredSkills: [
      { skillId: "skill-17", proficiencyLevel: "EXPERT", yearsOfExperience: 8, description: "Executive pitch delivery, business vocabulary, accent softening, and formal presentations." }
    ],
    wantedSkills: [
      { skillId: "skill-10", priority: "HIGH", goals: "Analyze student sentiment and coaching feedback using Python." }
    ]
  },

  // 14. Student 8: Lucas Dubois (iOS Swift dev wanting Video Editing)
  {
    id: "usr-student-8",
    email: "lucas.dubois@example.com",
    username: "lucas_swift",
    password: "Password123!",
    role: "USER",
    isVerified: true,
    isActive: true,
    profile: {
      fullName: "Lucas Dubois",
      avatarUrl: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=400&q=80",
      bio: "Indie iOS Developer building beautiful native apps with SwiftUI. Looking to produce marketing video trailers for my App Store listings.",
      location: "Lyon, France",
      education: "B.S. in Computer Science",
      occupation: "Indie App Creator",
      experienceLevel: "INTERMEDIATE",
      languages: "French (Native), English (Fluent)",
      availability: "Flexible weekdays",
      averageRating: 4.8,
      totalReviews: 7,
      completedExchanges: 10,
      isMentor: false
    },
    offeredSkills: [
      { skillId: "skill-6", proficiencyLevel: "ADVANCED", yearsOfExperience: 4, description: "SwiftUI, Combine, CoreData, and App Store submission guidelines." }
    ],
    wantedSkills: [
      { skillId: "skill-18", priority: "HIGH", goals: "Learn Premiere Pro pacing and video effects to create viral App Store demo reels." }
    ]
  },

  // 15. Student 9: Grace Hopper Jr. (Junior coder wanting User Research)
  {
    id: "usr-student-9",
    email: "grace.coder@example.com",
    username: "grace_code",
    password: "Password123!",
    role: "USER",
    isVerified: true,
    isActive: true,
    profile: {
      fullName: "Grace Chen",
      avatarUrl: "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=400&q=80",
      bio: "Passionate coding bootcamp graduate. Learning to pair clean technical logic with empathetic user research.",
      location: "Seattle, WA, USA",
      education: "Full Stack Web Bootcamp Graduate",
      occupation: "Associate Developer",
      experienceLevel: "BEGINNER",
      languages: "English",
      availability: "Weeknights 6 PM - 9 PM (PST)",
      averageRating: 4.7,
      totalReviews: 4,
      completedExchanges: 6,
      isMentor: false
    },
    offeredSkills: [
      { skillId: "skill-1", proficiencyLevel: "INTERMEDIATE", yearsOfExperience: 2, description: "React component architecture, JSX, and Tailwind CSS." }
    ],
    wantedSkills: [
      { skillId: "skill-8", priority: "HIGH", goals: "Learn user interviews and wireframe testing to design better web interfaces." }
    ]
  }
];

const exchangeRequests = [
  // 1. Alex Morgan (React) <-> Elena Rostova (Figma) - Strong Mutual Match (COMPLETED)
  {
    id: "exch-1",
    senderId: "usr-mentor-1",
    receiverId: "usr-mentor-2",
    offeredSkillId: "skill-1", // Alex teaches React
    wantedSkillId: "skill-7",  // Elena teaches Figma
    message: "Hi Elena! I love your design system portfolio. I would love to exchange 4 hours of advanced React/TypeScript tutoring for your Figma Auto-layout and Design Token guidance.",
    status: "COMPLETED",
    proposedSchedule: "Tuesdays 7:00 PM CET / 12:00 PM CST",
    matchScore: 98,
    createdAt: new Date("2026-09-10T14:00:00Z"),
    sessions: [
      {
        id: "sess-1",
        hostId: "usr-mentor-1",
        attendeeId: "usr-mentor-2",
        title: "Session 1: React Component Hierarchy for Designers",
        description: "Breaking down Figma frames into atomic React component props and states.",
        startTime: new Date("2026-09-15T17:00:00Z"),
        endTime: new Date("2026-09-15T18:00:00Z"),
        duration: 60,
        status: "COMPLETED",
        meetingLink: "https://meet.jit.si/skillbridge-alex-elena-1"
      },
      {
        id: "sess-2",
        hostId: "usr-mentor-2",
        attendeeId: "usr-mentor-1",
        title: "Session 2: Deep Dive into Figma Auto-Layout 5.0",
        description: "Creating responsive cards, variable modes, and nesting auto-layout frames.",
        startTime: new Date("2026-09-22T17:00:00Z"),
        endTime: new Date("2026-09-22T18:00:00Z"),
        duration: 60,
        status: "COMPLETED",
        meetingLink: "https://meet.jit.si/skillbridge-alex-elena-2"
      }
    ],
    reviews: [
      {
        id: "rev-1",
        reviewerId: "usr-mentor-1",
        revieweeId: "usr-mentor-2",
        rating: 5,
        comment: "Elena is an extraordinary mentor! Her explanation of Figma design tokens completely revolutionized how I structure CSS and component systems in React. 10/10 recommendation!"
      },
      {
        id: "rev-2",
        reviewerId: "usr-mentor-2",
        revieweeId: "usr-mentor-1",
        rating: 5,
        comment: "Alex is a phenomenal teacher. He made React hooks and state flow crystal clear without overwhelming me with technical jargon. I can now inspect and write actual React code!"
      }
    ]
  },

  // 2. Liam O'Connor (Node.js) <-> Kenji Sato (Japanese) - Active IN_PROGRESS match
  {
    id: "exch-2",
    senderId: "usr-student-3",
    receiverId: "usr-student-4",
    offeredSkillId: "skill-2", // Liam teaches Node.js
    wantedSkillId: "skill-16", // Kenji teaches Japanese
    message: "Konnichiwa Kenji! I'm moving to Tokyo and looking for conversational practice. Happy to guide you through building robust Node.js and PostgreSQL backend services.",
    status: "IN_PROGRESS",
    proposedSchedule: "Saturdays 10:00 AM GMT / 7:00 PM JST",
    matchScore: 96,
    createdAt: new Date("2026-10-05T10:00:00Z"),
    sessions: [
      {
        id: "sess-3",
        hostId: "usr-student-3",
        attendeeId: "usr-student-4",
        title: "Node.js REST API Essentials with Express",
        description: "Building your first Express router, middleware, and request validation.",
        startTime: new Date("2026-10-12T10:00:00Z"),
        endTime: new Date("2026-10-12T11:00:00Z"),
        duration: 60,
        status: "COMPLETED",
        meetingLink: "https://meet.jit.si/skillbridge-liam-kenji-1"
      },
      {
        id: "sess-4",
        hostId: "usr-student-4",
        attendeeId: "usr-student-3",
        title: "Japanese Daily Conversation & Essential Phrases",
        description: "Ordering food, asking for directions, and everyday greetings in Tokyo.",
        startTime: new Date("2026-11-08T10:00:00Z"),
        endTime: new Date("2026-11-08T11:00:00Z"),
        duration: 60,
        status: "SCHEDULED",
        meetingLink: "https://meet.jit.si/skillbridge-liam-kenji-2"
      }
    ]
  },

  // 3. David Kim (Flutter) <-> Chloe Bennett (Public Speaking) - SCHEDULED
  {
    id: "exch-3",
    senderId: "usr-mentor-5",
    receiverId: "usr-student-1",
    offeredSkillId: "skill-4", // David teaches Flutter
    wantedSkillId: "skill-20", // Chloe teaches Public Speaking
    message: "Hi Chloe! I have a keynote coming up and need speech coaching. I would gladly teach you Flutter app development from scratch in return.",
    status: "SCHEDULED",
    proposedSchedule: "Wednesdays 6:00 PM CST",
    matchScore: 94,
    createdAt: new Date("2026-10-20T16:00:00Z"),
    sessions: [
      {
        id: "sess-5",
        hostId: "usr-student-1",
        attendeeId: "usr-mentor-5",
        title: "Keynote Story Arc & Stage Delivery Coaching",
        description: "Drafting the opening hook and mastering vocal pauses.",
        startTime: new Date("2026-11-10T18:00:00Z"),
        endTime: new Date("2026-11-10T19:00:00Z"),
        duration: 60,
        status: "SCHEDULED",
        meetingLink: "https://meet.jit.si/skillbridge-david-chloe-1"
      }
    ]
  },

  // 4. Marcus Vance (Python ML) <-> Sofia Mendez (Spanish) - PENDING
  {
    id: "exch-4",
    senderId: "usr-mentor-3",
    receiverId: "usr-mentor-4",
    offeredSkillId: "skill-10", // Marcus teaches Python Data
    wantedSkillId: "skill-15",  // Sofia teaches Spanish
    message: "Hola Sofia! I saw that you want to automate marketing analytics with Python. I would love to teach you Pandas and automation scripts in exchange for conversational Spanish sessions.",
    status: "PENDING",
    proposedSchedule: "Thursday evenings (Flexible)",
    matchScore: 97,
    createdAt: new Date("2026-10-30T19:30:00Z")
  },

  // 5. Tariq Al-Mansoor (Video) <-> Sofia Mendez (SEO) - ACCEPTED
  {
    id: "exch-5",
    senderId: "usr-student-2",
    receiverId: "usr-mentor-4",
    offeredSkillId: "skill-18", // Tariq teaches Video Editing
    wantedSkillId: "skill-13",  // Sofia teaches SEO
    message: "Hi Sofia! I can help you polish video tutorials and Instagram reels in exchange for learning how to rank my portfolio on Google.",
    status: "ACCEPTED",
    proposedSchedule: "Sundays 4:00 PM CET",
    matchScore: 88,
    createdAt: new Date("2026-10-25T11:00:00Z")
  }
];

const conversations = [
  {
    id: "conv-1",
    exchangeId: "exch-1",
    participants: ["usr-mentor-1", "usr-mentor-2"],
    messages: [
      {
        id: "msg-1",
        senderId: "usr-mentor-1",
        content: "Hi Elena! Thanks for accepting the exchange request. Are you excited to kick off our sessions?",
        createdAt: new Date("2026-09-11T10:00:00Z")
      },
      {
        id: "msg-2",
        senderId: "usr-mentor-2",
        content: "Absolutely, Alex! I've prepared a complete Figma playground with auto-layout templates for our second session.",
        createdAt: new Date("2026-09-11T10:15:00Z")
      },
      {
        id: "msg-3",
        senderId: "usr-mentor-1",
        content: "Awesome! And I have our React sandbox preconfigured with Vite and Tailwind. See you on Tuesday!",
        createdAt: new Date("2026-09-11T10:20:00Z")
      }
    ]
  },
  {
    id: "conv-2",
    exchangeId: "exch-2",
    participants: ["usr-student-3", "usr-student-4"],
    messages: [
      {
        id: "msg-4",
        senderId: "usr-student-3",
        content: "Hey Kenji! Let's connect this Saturday for our Japanese and Node.js session.",
        createdAt: new Date("2026-10-06T12:00:00Z")
      },
      {
        id: "msg-5",
        senderId: "usr-student-4",
        content: "Sounds great Liam! I have prepared some helpful phrases for public transport and restaurants.",
        createdAt: new Date("2026-10-06T12:05:00Z")
      }
    ]
  }
];

const notifications = [
  {
    id: "notif-1",
    userId: "usr-mentor-1",
    type: "NEW_REVIEW",
    title: "New 5-Star Review Received!",
    message: "Elena Rostova left you a 5-star review for your React.js exchange session.",
    link: "/dashboard/reviews",
    isRead: false,
    createdAt: new Date("2026-09-23T18:00:00Z")
  },
  {
    id: "notif-2",
    userId: "usr-mentor-4",
    type: "EXCHANGE_REQUEST",
    title: "New Skill Exchange Request",
    message: "Marcus Vance wants to exchange Python for Data Analysis with your Spanish Conversational Fluency.",
    link: "/dashboard/exchanges",
    isRead: false,
    createdAt: new Date("2026-10-30T19:30:00Z")
  },
  {
    id: "notif-3",
    userId: "usr-student-3",
    type: "SESSION_SCHEDULED",
    title: "Upcoming Session Reminder",
    message: "You have a scheduled session with Kenji Sato on Japanese Daily Conversation coming up soon.",
    link: "/dashboard/sessions",
    isRead: true,
    createdAt: new Date("2026-11-01T08:00:00Z")
  }
];

const reports = [
  {
    id: "rep-1",
    reporterId: "usr-student-5",
    reportedUserId: "usr-student-6",
    reason: "Offensive / Spam message",
    details: "Sent repeated promotional links for third-party affiliate tools during chat discussion.",
    status: "PENDING",
    createdAt: new Date("2026-10-28T14:20:00Z")
  }
];

module.exports = {
  categories,
  skills,
  users,
  exchangeRequests,
  conversations,
  notifications,
  reports
};
