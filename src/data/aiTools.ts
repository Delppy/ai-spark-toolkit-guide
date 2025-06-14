
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
    isPro: false,
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
  }
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
  }
];

// Business AI Tools (Free/Trial Focus)  
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
  }
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
  }
];
