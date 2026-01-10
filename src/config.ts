export const siteConfig = {
  name: "Abhishek Raju",
  title: "AI & Automation Engineer",
  description:
    "Portfolio website of Abhishek Raju - AI & Automation Engineer building intelligent systems with LLMs, AWS Bedrock, and scalable test automation",
  accentColor: "#d97706",
  social: {
    email: "abhishek.rc@gmail.com",
    linkedin: "https://www.linkedin.com/in/abhishekrc/",
    twitter: "",
    github: "https://github.com/abhi10",
  },
  aboutMe:
    "AI & Automation Engineer experienced in building intelligent systems and scalable automation frameworks. Currently focused on applying LLMs and generative AI to solve complex engineering challenges, including AI-powered accessibility testing with AWS Bedrock and custom prompt engineering. Strong experience with cloud-native platforms, end-to-end test automation, and building reliable systems across multi-cloud environments. Track record of leading cross-functional initiatives that delivered 70% test coverage improvements and zero-defect releases at scale. Open to Senior SDET, Test Architect, and AI/Automation Engineer roles.",
  skills: [
    "Python",
    "Java",
    "TypeScript",
    "Bash",
    "SQL",
    "AWS Bedrock",
    "Prompt Engineering",
    "RAG Pipelines",
    "FastAPI",
    "REST APIs",
    "GraphQL",
    "PostgreSQL",
    "Redis",
    "SQLAlchemy",
    "AWS",
    "Terraform",
    "Docker",
    "Kubernetes",
    "Playwright",
    "Pytest",
    "Jest",
    "CI/CD",
    "Prometheus",
    "Grafana",
  ],
  projects: [
    {
      name: "Chitram (చిత్రం) - Image Hosting Service",
      description:
        "Image hosting service MVP for learning distributed systems. Built with FastAPI, PostgreSQL, MinIO, and Supabase auth. Features a pluggable authentication system, async thumbnail generation, and comprehensive test architecture.",
      link: "https://github.com/abhi10/chitram",
      skills: ["FastAPI", "Python", "PostgreSQL", "Supabase", "Docker"],
    },
    {
      name: "Argus - AI Accessibility Assistant",
      description:
        "An intelligent accessibility testing tool that leverages AWS Bedrock and custom prompt engineering to identify WCAG compliance issues across web and mobile platforms. The system analyzes page structure semantically, reduces false positives by 40%, and provides actionable remediation guidance for development teams.",
      link: "",
      skills: ["AWS Bedrock", "Python", "LangChain", "Playwright", "Accessibility"],
    },
    {
      name: "E-Commerce Test Automation Framework",
      description:
        "End-to-end testing framework for Ring.com e-commerce workflows that increased test coverage from 5% to 70%. Built with Playwright and integrated into CI/CD pipelines to ensure reliable Black Friday launches and catch payment/content integration failures before production.",
      link: "",
      skills: ["Playwright", "TypeScript", "CI/CD", "AWS", "API Testing"],
    },
    {
      name: "EAA Compliance Scanner",
      description:
        "Automated web scanning system built to ensure European Accessibility Act compliance across 4,800 pages in 8 locales. Coordinated with 8 teams to implement scanning, defect tracking, and remediation workflows for Ring Ecommerce properties.",
      link: "",
      skills: ["Python", "Selenium", "Accessibility", "Automation", "Compliance"],
    },
  ],
  experience: [
    {
      company: "Amazon",
      title: "Senior QA Automation Engineer",
      dateRange: "Mar 2021 - Present",
      bullets: [
        "Co-led Argus, an AI accessibility assistant utilizing custom prompt engineering on AWS Bedrock; integrated multi-platform (Web/Mobile) testing strategies and streamlined defect identification and resolution",
        "Directed an 8-month European Accessibility Act (EAA) compliance program for Ring Ecommerce, coordinating 8 teams to build an automated web scanning system across 4,800 pages in 8 locales",
        "Engineered an automated testing system for e-commerce workflows that increased test coverage from 5% to 70%, supporting reliable Black Friday launches",
        "Managed complete QA lifecycle for Ratings & Reviews launch on 400 Ring.com product pages, achieving zero production defects",
        "Oversaw QA for Alexa Personality in 'Hey, Disney!' launch, building automation framework for hundreds of interactive voice responses on 100M+ Echo devices",
      ],
    },
    {
      company: "Veracode",
      title: "Software Engineer (Automation)",
      dateRange: "Feb 2015 - Feb 2021",
      bullets: [
        "Led comprehensive QA for application security product migration from data center to AWS/Kubernetes for 1,000+ enterprise customers",
        "Automated cloud infrastructure workflows using BASH, reducing manual intervention by 80%",
        "Developed API automation framework achieving 100% test coverage across 4 backend services, reducing regression testing time from 2 days to 2 hours",
        "Enhanced UI test coverage from 10% to 75% for application security product through CI/CD integration",
      ],
    },
    {
      company: "EMC (acquired by Dell)",
      title: "Software Intern",
      dateRange: "Jan 2013 - Jul 2013",
      bullets: [
        "Debugged fault containment path in VNX/VNXe file system recovery components and wrote unit tests for FSCK recovery tool",
        "Performed system-level programming in C, C++ on BSD UNIX (RTOS) platform and optimized code to reduce API call hits to physical disk",
      ],
    },
  ],
  education: [
    {
      school: "Northeastern University, Boston",
      degree: "Master of Science, Computer Science",
      dateRange: "May 2014",
      achievements: [],
    },
  ],
};
