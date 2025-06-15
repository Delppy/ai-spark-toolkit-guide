
export interface AITool {
  id: string;
  name: string;
  category: string;
  description: string;
  rating: number;
  users: string;
  isPro: boolean;
  url: string;
  features: string[];
  freeOffering: "free" | "free_trial" | "free_credits" | "freemium";
  freeDetails: string;
}

export interface PromptPack {
  id: string;
  title: string;
  description: string;
  prompts: number;
  category: string;
  isPro: boolean;
  examples: string[];
}

// School & Education AI Tools (Free/Trial Focus)
export const schoolAITools: AITool[] = [
  {
    id: "chatgpt",
    name: "ChatGPT",
    category: "Essay Writing",
    description: "Get help writing essays, research papers, and assignments with AI assistance",
    rating: 4.8,
    users: "100M+",
    isPro: false,
    url: "https://chat.openai.com",
    features: ["Essay Writing", "Research Help", "Citation Formatting"],
    freeOffering: "freemium",
    freeDetails: "Free tier with GPT-3.5, limited daily usage"
  },
  {
    id: "perplexity",
    name: "Perplexity AI",
    category: "Research",
    description: "AI-powered search engine for academic research with citations",
    rating: 4.6,
    users: "10M+",
    isPro: false,
    url: "https://perplexity.ai",
    features: ["Research", "Citations", "Real-time Data"],
    freeOffering: "freemium",
    freeDetails: "Free searches daily with Pro features trial"
  },
  {
    id: "quillbot",
    name: "Quillbot",
    category: "Paraphrasing",
    description: "Paraphrase and rewrite text to avoid plagiarism and improve clarity",
    rating: 4.6,
    users: "50M+",
    isPro: true,
    url: "https://quillbot.com",
    features: ["Paraphrasing", "Grammar Check", "Summarizer"],
    freeOffering: "freemium",
    freeDetails: "Free tier with 125 words per paraphrase"
  },
  {
    id: "grammarly",
    name: "Grammarly",
    category: "Grammar Check",
    description: "Check grammar, spelling, and improve your writing style",
    rating: 4.7,
    users: "30M+",
    iPro: false,
    url: "https://grammarly.com",
    features: ["Grammar Check", "Style Suggestions", "Plagiarism Detection"],
    freeOffering: "freemium",
    freeDetails: "Free basic grammar and spell checking"
  },
  {
    id: "consensus",
    name: "Consensus",
    category: "Research",
    description: "Find scientific papers and research evidence using AI",
    rating: 4.3,
    users: "1M+",
    isPro: false,
    url: "https://consensus.app",
    features: ["Research Papers", "Citation Finder", "Evidence Search"],
    freeOffering: "freemium",
    freeDetails: "Free searches with limited premium features"
  },
  {
    id: "scholarai",
    name: "Scholar AI",
    category: "Academic Research",
    description: "AI assistant for finding and analyzing academic papers",
    rating: 4.4,
    users: "500K+",
    isPro: false,
    url: "https://scholar.ai",
    features: ["Paper Search", "Analysis", "Summaries"],
    freeOffering: "free",
    freeDetails: "Completely free academic research tool"
  },
  {
    id: "mathway",
    name: "Mathway",
    category: "Math Solver",
    description: "Solve math problems step-by-step from basic to advanced",
    rating: 4.5,
    users: "25M+",
    isPro: true,
    url: "https://mathway.com",
    features: ["Step-by-step Solutions", "Multiple Math Topics", "Graph Calculator"],
    freeOffering: "freemium",
    freeDetails: "Free answers, premium for step-by-step solutions"
  },
  {
    id: "photomath",
    name: "PhotoMath",
    category: "Math Solver",
    description: "Scan math problems with camera and get instant solutions",
    rating: 4.6,
    users: "220M+",
    isPro: false,
    url: "https://photomath.com",
    features: ["Camera Scanner", "Step-by-step", "Multiple Methods"],
    freeOffering: "freemium",
    freeDetails: "Free basic solutions, premium for detailed explanations"
  },
  {
    id: "humata-ai",
    name: "Humata AI",
    category: "Study Assistant",
    description: "AI answers questions about your PDFs and documents instantly.",
    rating: 4.6,
    users: "1M+",
    isPro: false,
    url: "https://www.humata.ai/",
    features: ["PDF Q&A", "Document Summaries", "Knowledge Extraction"],
    freeOffering: "free_credits",
    freeDetails: "Free pages per month | Added from theresanaiforthat.com"
  },
  {
    id: "wolframalpha",
    name: "WolframAlpha",
    category: "Math Solver",
    description: "Computational knowledge engine for complex queries.",
    rating: 4.9,
    users: "30M+",
    isPro: true,
    url: "https://www.wolframalpha.com/",
    features: ["Complex Math", "Data Analysis", "Scientific Computation"],
    freeOffering: "freemium",
    freeDetails: "Free for basic computations, Pro for step-by-step solutions"
  },
  {
    id: "socratic",
    name: "Socratic",
    category: "Study Assistant",
    description: "AI-powered homework helper from Google.",
    rating: 4.7,
    users: "10M+",
    isPro: false,
    url: "https://socratic.org/",
    features: ["Homework Help", "Visual Explanations", "Multi-subject"],
    freeOffering: "free",
    freeDetails: "Completely free learning app"
  },
  {
    id: "chatpdf",
    name: "ChatPDF",
    category: "Study Assistant",
    description: "Chat with your PDF documents and get instant answers",
    rating: 4.5,
    users: "2M+",
    isPro: false,
    url: "https://www.chatpdf.com/",
    features: ["PDF Chat", "Document Q&A", "Citation Extraction"],
    freeOffering: "freemium",
    freeDetails: "Free for PDFs up to 120 pages"
  },
];

// Content Creation AI Tools (Free/Trial Focus)
export const contentAITools: AITool[] = [
  {
    id: "canva-ai",
    name: "Canva AI",
    category: "Design",
    description: "AI-powered design tools for social media graphics and content",
    rating: 4.7,
    users: "100M+",
    isPro: false,
    url: "https://canva.com",
    features: ["Templates", "Auto-resize", "Brand Kit"],
    freeOffering: "freemium",
    freeDetails: "Free tier with AI features and templates"
  },
  {
    id: "leonardo-ai",
    name: "Leonardo AI",
    category: "Image Generation",
    description: "Create stunning AI artwork with free daily credits",
    rating: 4.5,
    users: "5M+",
    isPro: false,
    url: "https://leonardo.ai",
    features: ["AI Art", "Multiple Styles", "High Quality"],
    freeOffering: "free_credits",
    freeDetails: "150 free tokens daily for image generation"
  },
  {
    id: "ideogram",
    name: "Ideogram",
    category: "Image Generation",
    description: "AI image generator with excellent text rendering capabilities",
    rating: 4.4,
    users: "2M+",
    isPro: false,
    url: "https://ideogram.ai",
    features: ["Text in Images", "Various Styles", "High Resolution"],
    freeOffering: "free_credits",
    freeDetails: "25 free images per day"
  },
  {
    id: "clipdrop",
    name: "ClipDrop",
    category: "Image Editing",
    description: "AI-powered image editing tools for content creators",
    rating: 4.3,
    users: "3M+",
    isPro: false,
    url: "https://clipdrop.co",
    features: ["Background Removal", "Upscaling", "Image Generation"],
    freeOffering: "freemium",
    freeDetails: "Free tier with limited usage per tool"
  },
  {
    id: "gamma",
    name: "Gamma",
    category: "Presentation",
    description: "Create presentations, documents, and websites with AI",
    rating: 4.5,
    users: "1M+",
    isPro: false,
    url: "https://gamma.app",
    features: ["AI Presentations", "Templates", "Collaboration"],
    freeOffering: "free_credits",
    freeDetails: "Free account with 400 AI credits"
  },
  {
    id: "luma-ai",
    name: "Luma AI",
    category: "3D Content",
    description: "Create 3D content and interactive experiences with AI",
    rating: 4.4,
    users: "2M+",
    isPro: false,
    url: "https://lumalabs.ai",
    features: ["3D Models", "AR Content", "Interactive Media"],
    freeOffering: "freemium",
    freeDetails: "Free tier for basic 3D generation"
  },
  {
    id: "remove-bg",
    name: "Remove.bg",
    category: "Image Editing",
    description: "Remove backgrounds from images instantly with AI",
    rating: 4.6,
    users: "10M+",
    isPro: false,
    url: "https://remove.bg",
    features: ["Background Removal", "Bulk Processing", "API Access"],
    freeOffering: "freemium",
    freeDetails: "Free with watermark, 1 HD image free monthly"
  },
  {
    id: "stability-ai",
    name: "Stability AI",
    category: "Image Generation",
    description: "Open-source AI models for image generation and editing",
    rating: 4.3,
    users: "5M+",
    isPro: false,
    url: "https://stability.ai",
    features: ["Stable Diffusion", "Open Source", "Various Models"],
    freeOffering: "free",
    freeDetails: "Free access to open-source models"
  },
  {
    id: "browse-ai",
    name: "Browse AI",
    category: "Web Scraping",
    description: "Monitor changes & extract data from any website with no code.",
    rating: 4.3,
    users: "800K+",
    isPro: false,
    url: "https://www.browse.ai/",
    features: ["Website Extraction", "No-code", "Change Monitoring"],
    freeOffering: "free_credits",
    freeDetails: "100 free credits/month | Added from theresanaiforthat.com"
  },
  {
    id: "midjourney",
    name: "Midjourney",
    category: "Image Generation",
    description: "Leading AI image generator known for artistic and high-quality visuals.",
    rating: 4.8,
    users: "15M+",
    isPro: true,
    url: "https://www.midjourney.com/",
    features: ["Artistic Images", "High-Fidelity", "Community Showcase"],
    freeOffering: "free_trial",
    freeDetails: "Free trial credits upon joining Discord server"
  },
  {
    id: "runwayml",
    name: "RunwayML",
    category: "Video Editing",
    description: "AI-powered video creation and editing suite for creators.",
    rating: 4.6,
    users: "3M+",
    isPro: false,
    url: "https://runwayml.com/",
    features: ["Text-to-Video", "Video-to-Video", "AI Magic Tools"],
    freeOffering: "free_credits",
    freeDetails: "Free account with starting credits"
  },
];

// Business AI Tools (Free/Trial Focus) - EXPANDED
export const businessAITools: AITool[] = [
  {
    id: "claude",
    name: "Claude",
    category: "Business Assistant",
    description: "AI assistant for business writing, analysis, and strategy",
    rating: 4.7,
    users: "5M+",
    isPro: false,
    url: "https://claude.ai",
    features: ["Business Writing", "Data Analysis", "Strategic Planning"],
    freeOffering: "freemium",
    freeDetails: "Free tier with daily usage limits"
  },
  {
    id: "notion-ai",
    name: "Notion AI",
    category: "Productivity",
    description: "AI-powered workspace for notes, docs, and project management",
    rating: 4.4,
    users: "20M+",
    isPro: true,
    url: "https://notion.so",
    features: ["Smart Notes", "AI Writing", "Project Management"],
    freeOffering: "free_trial",
    freeDetails: "Free Notion account + AI trial"
  },
  {
    id: "zapier",
    name: "Zapier AI",
    category: "Automation",
    description: "Automate workflows between apps with AI assistance",
    rating: 4.5,
    users: "2M+",
    isPro: false,
    url: "https://zapier.com",
    features: ["Workflow Automation", "App Integration", "AI Suggestions"],
    freeOffering: "freemium",
    freeDetails: "Free tier with 100 tasks/month"
  },
  {
    id: "tome",
    name: "Tome",
    category: "Presentation",
    description: "AI-powered storytelling and presentation creation",
    rating: 4.3,
    users: "1M+",
    isPro: false,
    url: "https://tome.app",
    features: ["AI Presentations", "Storytelling", "Interactive Content"],
    freeOffering: "freemium",
    freeDetails: "Free tier with AI generation credits"
  },
  {
    id: "jasper-ai",
    name: "Jasper AI",
    category: "Content Writing",
    description: "AI copywriting assistant for marketing and business content",
    rating: 4.4,
    users: "1M+",
    isPro: true,
    url: "https://jasper.ai",
    features: ["Marketing Copy", "Blog Writing", "Social Media"],
    freeOffering: "free_trial",
    freeDetails: "7-day free trial with full access"
  },
  {
    id: "copy-ai",
    name: "Copy.ai",
    category: "Copywriting",
    description: "AI-powered copywriting for marketing campaigns and content",
    rating: 4.3,
    users: "2M+",
    isPro: false,
    url: "https://copy.ai",
    features: ["Marketing Copy", "Email Templates", "Social Media"],
    freeOffering: "freemium",
    freeDetails: "Free tier with 2,000 words per month"
  },
  {
    id: "loom-ai",
    name: "Loom AI",
    category: "Video Communication",
    description: "AI-powered video messaging and screen recording for teams",
    rating: 4.5,
    users: "14M+",
    isPro: false,
    url: "https://loom.com",
    features: ["Screen Recording", "AI Summaries", "Video Messaging"],
    freeOffering: "freemium",
    freeDetails: "Free plan with 25 videos per person"
  },
  {
    id: "otter-ai",
    name: "Otter.ai",
    category: "Transcription",
    description: "AI meeting transcription and note-taking assistant",
    rating: 4.4,
    users: "3M+",
    isPro: false,
    url: "https://otter.ai",
    features: ["Meeting Transcription", "AI Summaries", "Team Collaboration"],
    freeOffering: "freemium",
    freeDetails: "Free plan with 300 monthly transcription minutes"
  },
  {
    id: "slidesai",
    name: "SlidesAI",
    category: "Presentation",
    description: "Create professional presentations from text using AI",
    rating: 4.2,
    users: "500K+",
    isPro: false,
    url: "https://slidesai.io",
    features: ["Text to Slides", "Professional Templates", "Quick Generation"],
    freeOffering: "freemium",
    freeDetails: "Free plan with 3 presentations per month"
  },
  {
    id: "beautiful-ai",
    name: "Beautiful.AI",
    category: "Presentation",
    description: "AI-powered presentation design with smart templates",
    rating: 4.3,
    users: "1M+",
    isPro: false,
    url: "https://beautiful.ai",
    features: ["Smart Templates", "Auto-design", "Team Collaboration"],
    freeOffering: "free_trial",
    freeDetails: "Free trial with limited presentations"
  },
  {
    id: "descript",
    name: "Descript",
    category: "Video Editing",
    description: "AI-powered video editing with text-based editing",
    rating: 4.4,
    users: "1M+",
    isPro: false,
    url: "https://descript.com",
    features: ["Text-based Editing", "AI Voices", "Transcription"],
    freeOffering: "freemium",
    freeDetails: "Free plan with 3 hours of transcription per month"
  },
  {
    id: "monday-ai",
    name: "monday.com AI",
    category: "Project Management",
    description: "AI-enhanced project management and team collaboration",
    rating: 4.5,
    users: "152K+",
    isPro: false,
    url: "https://monday.com",
    features: ["AI Insights", "Project Templates", "Team Automation"],
    freeOffering: "freemium",
    freeDetails: "Free plan for up to 2 users"
  },
  {
    id: "rask-ai",
    name: "Rask AI",
    category: "Video Localization",
    description: "Localize your videos automatically into 60+ languages using AI.",
    rating: 4.4,
    users: "120K+",
    isPro: false,
    url: "https://www.rask.ai/",
    features: ["Video Translation", "Voice Cloning", "Multi-language Support"],
    freeOffering: "free_trial",
    freeDetails: "Free trials available | Added from theresanaiforthat.com"
  },
  {
    id: "genei",
    name: "Genei",
    category: "Research Summarization",
    description: "Summarize research & webpages using advanced AI.",
    rating: 4.2,
    users: "350K+",
    isPro: true,
    url: "https://www.genei.io/",
    features: ["Summarization", "Research Analysis", "Webpage Import"],
    freeOffering: "freemium",
    freeDetails: "Free basic summaries | Added from theresanaiforthat.com"
  },
  {
    id: "clickup-ai",
    name: "ClickUp AI",
    category: "Project Management",
    description: "Native AI assistant within ClickUp to boost productivity.",
    rating: 4.5,
    users: "8M+",
    isPro: true,
    url: "https://clickup.com/ai",
    features: ["Task Summaries", "AI Content Generation", "Progress Reports"],
    freeOffering: "free_trial",
    freeDetails: "Available as a paid add-on with a free trial"
  },
  {
    id: "fireflies-ai",
    name: "Fireflies.ai",
    category: "Transcription",
    description: "AI notetaker that transcribes, summarizes, and analyzes voice conversations.",
    rating: 4.6,
    users: "10M+",
    isPro: false,
    url: "https://fireflies.ai/",
    features: ["Meeting Transcription", "Action Items", "Conversation Analysis"],
    freeOffering: "freemium",
    freeDetails: "Free tier with limited transcription credits"
  },
];

// Career AI Tools (Free/Trial Focus)
export const careerAITools: AITool[] = [
  {
    id: "resume-genius",
    name: "Resume Genius",
    category: "Resume Builder",
    description: "AI-powered resume builder with industry templates",
    rating: 4.4,
    users: "10M+",
    isPro: true,
    url: "https://resumegenius.com",
    features: ["Resume Templates", "AI Writing", "ATS Optimization"],
    freeOffering: "free_trial",
    freeDetails: "Free resume builder with premium trial"
  },
  {
    id: "kickresume",
    name: "Kickresume",
    category: "Resume Builder", 
    description: "Professional resume and cover letter builder with AI",
    rating: 4.5,
    users: "3M+",
    isPro: false,
    url: "https://kickresume.com",
    features: ["Resume Builder", "Cover Letters", "LinkedIn Optimization"],
    freeOffering: "freemium",
    freeDetails: "Free resume with Kickresume branding"
  },
  {
    id: "interview-warmup",
    name: "Interview Warmup",
    category: "Interview Prep",
    description: "Google's free AI interview practice tool",
    rating: 4.6,
    users: "500K+",
    isPro: false,
    url: "https://grow.google/certificates/interview-warmup",
    features: ["Practice Questions", "AI Feedback", "Various Industries"],
    freeOffering: "free",
    freeDetails: "Completely free by Google"
  },
  {
    id: "jobscan",
    name: "Jobscan",
    category: "Resume Optimization",
    description: "Optimize your resume for ATS systems with AI analysis",
    rating: 4.3,
    users: "2M+",
    isPro: false,
    url: "https://jobscan.co",
    features: ["ATS Optimization", "Keyword Analysis", "Resume Scoring"],
    freeOffering: "freemium",
    freeDetails: "5 free resume scans per month"
  },
  {
    id: "jobful-ai",
    name: "Jobful AI",
    category: "Job Search",
    description: "Find matching jobs powered by AI recommendation engines.",
    rating: 4.2,
    users: "300K+",
    isPro: false,
    url: "https://www.jobful.io/ai/",
    features: ["AI Job Matching", "Resume Scoring", "Application Tracking"],
    freeOffering: "freemium",
    freeDetails: "Free to use, paid premium features | Added from theresanaiforthat.com"
  },
  {
    id: "teal",
    name: "Teal",
    category: "Job Search",
    description: "All-in-one job search tracker and contact manager.",
    rating: 4.8,
    users: "500K+",
    isPro: false,
    url: "https://www.tealhq.com/",
    features: ["Job Tracking", "Resume Builder", "Keyword Optimization"],
    freeOffering: "freemium",
    freeDetails: "Free version with core features"
  },
  {
    id: "vmock",
    name: "VMock",
    category: "Resume Optimization",
    description: "AI platform for instant resume feedback and career analytics.",
    rating: 4.5,
    users: "1M+",
    isPro: true,
    url: "https://www.vmock.com/",
    features: ["Resume Scoring", "Actionable Feedback", "Targeted Suggestions"],
    freeOffering: "free_credits",
    freeDetails: "Often provided through universities, limited free scans"
  },
];

// PDF AI Tools (Comprehensive Collection)
export const pdfAITools: AITool[] = [
  // PDF Editing & Conversion
  {
    id: "tinywow",
    name: "TinyWOW",
    category: "PDF Editing",
    description: "Free online PDF tools for merging, splitting, and converting PDFs",
    rating: 4.6,
    users: "5M+",
    isPro: false,
    url: "https://tinywow.com/",
    features: ["PDF Merge", "PDF Split", "PDF Convert", "Compress PDF"],
    freeOffering: "free",
    freeDetails: "Completely free with no file size limits"
  },
  {
    id: "pdf24",
    name: "PDF24",
    category: "PDF Editing",
    description: "Comprehensive PDF editor and converter with privacy focus",
    rating: 4.5,
    users: "10M+",
    isPro: false,
    url: "https://tools.pdf24.org/",
    features: ["PDF Editor", "File Converter", "Password Protection", "OCR"],
    freeOffering: "free",
    freeDetails: "100% free with local processing for privacy"
  },
  {
    id: "ilovepdf",
    name: "iLovePDF",
    category: "PDF Editing",
    description: "Popular online PDF toolkit for all your PDF needs",
    rating: 4.7,
    users: "25M+",
    isPro: false,
    url: "https://www.ilovepdf.com/",
    features: ["PDF Tools Suite", "Batch Processing", "Cloud Storage", "API Access"],
    freeOffering: "freemium",
    freeDetails: "Free with file size limits, premium for larger files"
  },
  {
    id: "smallpdf",
    name: "SmallPDF",
    category: "PDF Editing",
    description: "Business-focused PDF platform with team collaboration features",
    rating: 4.5,
    users: "50M+",
    isPro: false,
    url: "https://smallpdf.com/",
    features: ["PDF Editor", "Team Sharing", "Digital Signatures", "Document Templates"],
    freeOffering: "freemium",
    freeDetails: "Free with daily limits, premium for unlimited use"
  },

  // PDF Analysis & Intelligence
  {
    id: "pdf-summarizer-edu",
    name: "PDF Summarizer",
    category: "PDF Analysis",
    description: "AI-powered PDF summarization for research papers and study materials",
    rating: 4.4,
    users: "800K+",
    isPro: false,
    url: "https://example.com/pdf-summarizer",
    features: ["Research Summaries", "Key Point Extraction", "Citation Ready"],
    freeOffering: "freemium",
    freeDetails: "5 free summaries per month"
  },
  {
    id: "chatpdf-analysis",
    name: "ChatPDF",
    category: "PDF Analysis",
    description: "Chat with your PDF documents and get instant answers",
    rating: 4.5,
    users: "2M+",
    isPro: false,
    url: "https://www.chatpdf.com/",
    features: ["PDF Chat", "Document Q&A", "Citation Extraction"],
    freeOffering: "freemium",
    freeDetails: "Free for PDFs up to 120 pages"
  },
  {
    id: "humata-pdf",
    name: "Humata AI",
    category: "PDF Analysis",
    description: "AI answers questions about your PDFs and documents instantly",
    rating: 4.6,
    users: "1M+",
    isPro: false,
    url: "https://www.humata.ai/",
    features: ["PDF Q&A", "Document Summaries", "Knowledge Extraction"],
    freeOffering: "free_credits",
    freeDetails: "Free pages per month"
  },
  {
    id: "pdf-contract-analyzer",
    name: "PDF Contract Analyzer",
    category: "PDF Analysis",
    description: "AI-powered contract analysis and risk assessment tool",
    rating: 4.4,
    users: "200K+",
    isPro: true,
    url: "https://example.com/contract-analyzer",
    features: ["Contract Analysis", "Risk Assessment", "Clause Extraction", "Legal Compliance"],
    freeOffering: "free_trial",
    freeDetails: "5 free contract analyses"
  },

  // PDF Creation & Generation
  {
    id: "pdf-ai-creator",
    name: "PDF AI Creator",
    category: "PDF Creation",
    description: "AI-powered PDF generation from text, images, and templates",
    rating: 4.3,
    users: "500K+",
    isPro: false,
    url: "https://example.com/pdf-ai-creator",
    features: ["AI PDF Generation", "Template Library", "Smart Formatting"],
    freeOffering: "freemium",
    freeDetails: "3 free PDFs per month"
  },
  {
    id: "resume-pdf-enhancer",
    name: "Resume PDF Enhancer",
    category: "PDF Creation",
    description: "AI-powered PDF resume optimization and ATS compatibility checker",
    rating: 4.4,
    users: "400K+",
    isPro: false,
    url: "https://example.com/resume-enhancer",
    features: ["ATS Optimization", "PDF Formatting", "Keyword Enhancement", "Visual Layout"],
    freeOffering: "freemium",
    freeDetails: "3 free resume optimizations per month"
  },
  {
    id: "portfolio-pdf-creator",
    name: "Portfolio PDF Creator",
    category: "PDF Creation",
    description: "Create professional portfolio PDFs with AI-assisted layout and design",
    rating: 4.3,
    users: "250K+",
    isPro: false,
    url: "https://example.com/portfolio-creator",
    features: ["Portfolio Templates", "AI Layout", "Project Showcase", "Interactive Elements"],
    freeOffering: "free_trial",
    freeDetails: "Free trial with 2 portfolio creations"
  },
  {
    id: "ai-report-generator",
    name: "AI Report Generator",
    category: "PDF Creation",
    description: "Generate professional reports and documents in PDF format using AI",
    rating: 4.2,
    users: "300K+",
    isPro: false,
    url: "https://example.com/report-generator",
    features: ["Report Templates", "Data Visualization", "Auto-formatting", "Chart Integration"],
    freeOffering: "freemium",
    freeDetails: "2 free reports per month"
  },

  // PDF Security & Collaboration
  {
    id: "docusign",
    name: "DocuSign",
    category: "PDF Security",
    description: "Digital signature and document management platform",
    rating: 4.6,
    users: "1B+",
    isPro: false,
    url: "https://www.docusign.com/",
    features: ["E-Signatures", "Document Workflow", "Template Library", "API Integration"],
    freeOffering: "free_trial",
    freeDetails: "30-day free trial with 3 signature requests"
  },
  {
    id: "adobe-sign",
    name: "Adobe Sign",
    category: "PDF Security",
    description: "Enterprise-grade PDF signing and document workflow solution",
    rating: 4.5,
    users: "50M+",
    isPro: true,
    url: "https://www.adobe.com/sign.html",
    features: ["Digital Signatures", "Advanced Security", "Workflow Automation", "Integration"],
    freeOffering: "free_trial",
    freeDetails: "14-day free trial"
  },
  {
    id: "pdf-protector",
    name: "PDF Protector",
    category: "PDF Security",
    description: "AI-powered PDF security and access control management",
    rating: 4.3,
    users: "150K+",
    isPro: false,
    url: "https://example.com/pdf-protector",
    features: ["Password Protection", "Access Control", "Watermarking", "Encryption"],
    freeOffering: "freemium",
    freeDetails: "5 free protected PDFs per month"
  },
  {
    id: "collaborative-pdf",
    name: "Collaborative PDF",
    category: "PDF Security",
    description: "Team collaboration platform for PDF review and annotation",
    rating: 4.4,
    users: "200K+",
    isPro: false,
    url: "https://example.com/collaborative-pdf",
    features: ["Team Annotations", "Version Control", "Comment Tracking", "Review Workflows"],
    freeOffering: "freemium",
    freeDetails: "Free for teams up to 3 members"
  }
];
