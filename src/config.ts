export const siteConfig = {
  name: "Abhishek Raju",
  title: "AI Engineer",
  description:
    "Portfolio website of Abhishek Raju - AI & Automation Engineer building intelligent systems with LLMs, AWS Bedrock, and scalable test automation",
  accentColor: "#d97706",
  social: {
    email: "arajubuild@gmail.com",
    linkedin: "https://www.linkedin.com/in/abhishekrc/",
    twitter: "",
    github: "https://github.com/abhi10",
  },
  // Navigation links for header
  navigation: [
    { name: "Projects", href: "/projects" },
    { name: "Blog", href: "/blog" },
    { name: "Resources", href: "/resources" },
    { name: "Ideahamster", href: "/ideahamster" },
  ],
  aboutMe:
    "AI Engineer specializing in RAG systems, LLM integration, and production generative AI. Architected pipelines processing 50k+ customer reviews (Pinecone + LangChain + OpenAI), built compliance automation scanning 4,800 pages (Playwright + Bedrock), and deployed vision-based AI assistants serving 40+ users. Currently building Chitram (AI image hosting) and Gremlin (AI QA agent with 70+ risk patterns). Strong in Python, AWS AI/ML stack, prompt engineering, and distributed systems. Seeking AI Engineer roles.",
  skills: [
    "Python",
    "LangChain",
    "RAG",
    "Pinecone",
    "ChromaDB",
    "AWS Bedrock",
    "OpenAI",
    "Claude API",
    "Prompt Engineering",
    "Hugging Face",
    "FastAPI",
    "PostgreSQL",
    "Redis",
    "Docker",
    "Kubernetes",
    "AWS (Lambda, Step Functions, SageMaker, ECS)",
    "CI/CD",
    "CloudWatch",
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
      name: "Gremlin — AI Risk Critic (CLI · Python Library · Dashboard)",
      description:
        "Pre-ship risk critic that identifies breaking scenarios before code reaches production. 107 domain-specific QA patterns across security, concurrency, payments, and auth. 90.7% tie rate with baseline Claude Sonnet in A/B evals across 54 test cases. Published to PyPI with CLI, programmatic Python API, async support, and interactive Risk Dashboard with heatmap visualizations.",
      link: "https://github.com/abhi10/gremlin",
      skills: ["Python", "Claude API", "Prompt Engineering", "CLI", "GitHub Actions", "Chart.js"],
    },
    {
      name: "Argus - AI Accessibility Assistant",
      description:
        "An intelligent accessibility testing tool that leverages AWS Bedrock and custom prompt engineering to identify WCAG compliance issues across web and mobile platforms. The system analyzes page structure semantically, reduces false positives by 40%, and provides actionable remediation guidance for development teams.",
      link: "",
      skills: [
        "AWS Bedrock",
        "Python",
        "LangChain",
        "Playwright",
        "Accessibility",
      ],
    },
    {
      name: "Compliance Automation Pipeline",
      description:
        "Distributed web crawling infrastructure (Playwright + AWS ECS Fargate) processing 4,800 pages across 8 locales with event-driven messaging (SNS). Integrated AI-powered anomaly detection cutting manual review from 3 months to 0.5 days.",
      link: "",
      skills: ["Playwright", "AWS ECS", "SNS/SQS", "Grafana", "CloudWatch"],
    },
  ],
  experience: [
    {
      company: "Amazon",
      title: "Senior Software Engineer",
      dateRange: "Mar 2021 - Present",
      bullets: [
        "Architected production RAG pipeline (Python + FastAPI + Pinecone) processing 50k+ customer reviews with LangChain orchestration. Integrated OpenAI and AWS Bedrock with CI/CD deployment, monitoring via CloudWatch for latency/accuracy tracking. Enabled natural language querying surfacing 100+ UX issues, driving 20% support ticket reduction.",
        "Co-led Argus, an AI accessibility assistant utilizing custom prompt engineering on AWS Bedrock; integrated multi-platform (Web/Mobile) testing strategies and streamlined defect identification and resolution",
        "Designed and deployed generative AI assistant using AWS Bedrock (Claude Sonnet) and Kendra for semantic search across 10k+ WCAG compliance guidelines. Integrated LLM via REST API into partner applications, enabling natural language querying and automated validation workflows. Served 8 engineering teams (40+ users), reducing onboarding from 2 weeks to 1 hour.",
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
