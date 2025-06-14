import { PromptPack } from './aiTools';

// School Prompt Packs
export const schoolPromptPacks: PromptPack[] = [
  {
    id: "essay-writing",
    title: "Essay Writing Prompts",
    description: "Complete prompts for writing different types of essays",
    prompts: 25,
    category: "Writing",
    isPro: false,
    examples: [
      "Write a 5-paragraph essay about [TOPIC] with a clear thesis statement, three supporting arguments with evidence, and a strong conclusion that restates the thesis",
      "Create an argumentative essay outline for [POSITION] including: introduction with hook, background, and thesis; three body paragraphs with claims, evidence, and analysis; counterargument paragraph; conclusion",
      "Generate a conclusion paragraph that summarizes these main points: [MAIN_POINTS] and restates this thesis: [THESIS_STATEMENT] while providing a call to action or future implications"
    ]
  },
  {
    id: "research-citation",
    title: "Research & Citation Prompts",
    description: "Get help with research methodology and proper citations",
    prompts: 20,
    category: "Research", 
    isPro: true,
    examples: [
      "Find 5 credible academic sources about [TOPIC] published within the last 5 years. For each source, provide: full citation in [APA/MLA] format, brief summary, and explanation of credibility",
      "Create proper [APA/MLA/Chicago] citations for these sources: [PASTE_SOURCE_INFO]. Include in-text citations and full bibliography entries",
      "Summarize this research paper in 200 words, focusing on: research question, methodology, key findings, and implications: [PASTE_CONTENT]"
    ]
  },
  {
    id: "study-exam-prep",
    title: "Study & Exam Prep",
    description: "Prompts to help you study more effectively and prepare for exams",
    prompts: 30,
    category: "Study",
    isPro: false,
    examples: [
      "Create 20 flashcards for [SUBJECT] covering these topics: [TOPICS_LIST]. Format: Question on front, detailed answer on back with examples",
      "Generate 15 practice questions for [EXAM_TYPE] on [SUBJECT]. Include: 5 multiple choice, 5 short answer, 5 essay questions with answer keys",
      "Explain [COMPLEX_CONCEPT] using: simple language, real-world analogies, step-by-step breakdown, and provide 3 practice problems"
    ]
  },
  {
    id: "math-science-help",
    title: "Math & Science Problem Solving",
    description: "Get step-by-step help with math and science problems",
    prompts: 18,
    category: "STEM",
    isPro: false,
    examples: [
      "Solve this math problem step-by-step, explaining each step clearly: [MATH_PROBLEM]. Show all work and check the answer",
      "Explain this scientific concept in simple terms with examples: [CONCEPT]. Include how it applies to everyday life",
      "Create a study guide for [SCIENCE_TOPIC] including: key terms, important formulas, common problems, and practice questions"
    ]
  }
];

// Content Creation Prompt Packs
export const contentPromptPacks: PromptPack[] = [
  {
    id: "social-media-captions",
    title: "Social Media Captions",
    description: "Engaging captions for Instagram, TikTok, and other platforms",
    prompts: 40,
    category: "Social Media",
    isPro: false,
    examples: [
      "Create 5 Instagram captions for [PRODUCT/SERVICE] that encourage engagement. Include: attention-grabbing hook, value proposition, call-to-action, and relevant hashtags",
      "Write a viral TikTok caption for [TREND/TOPIC] that includes: trending hook, relatable content, question for engagement, and 5-10 relevant hashtags",
      "Generate 3 LinkedIn post captions for [PROFESSIONAL_TOPIC] that spark discussion. Include: industry insight, personal experience, thoughtful question, and professional tone"
    ]
  },
  {
    id: "content-ideas-generator",
    title: "Content Ideas Generator", 
    description: "Fresh content ideas for videos, posts, and stories",
    prompts: 35,
    category: "Ideas",
    isPro: false,
    examples: [
      "Generate 10 YouTube video ideas for [NICHE] that will get high engagement. Include: catchy titles, brief descriptions, target audience, and why each would perform well",
      "Create a month's worth of Instagram story ideas for [BRAND/TOPIC]. Include: behind-the-scenes, educational, interactive polls, Q&As, and trending formats",
      "Suggest 5 trending content formats for [PLATFORM] in [INDUSTRY]. Explain why each format works and provide specific examples"
    ]
  },
  {
    id: "video-script-templates",
    title: "Video Script Templates",
    description: "Complete video scripts for different content types",
    prompts: 25,
    category: "Video",
    isPro: true,
    examples: [
      "Write a 60-second TikTok script about [TOPIC] with: hook (first 3 seconds), main content with visual cues, engagement elements, and strong call-to-action",
      "Create a YouTube intro script for [CHANNEL_TYPE] that builds anticipation. Include: channel introduction, what viewers will learn, why they should subscribe",
      "Generate a product demo script for [PRODUCT] highlighting key benefits. Include: problem introduction, solution reveal, feature demonstrations, and purchase call-to-action"
    ]
  },
  {
    id: "blog-writing-prompts",
    title: "Blog Writing & SEO",
    description: "Blog post ideas and SEO-optimized content prompts",
    prompts: 30,
    category: "Blogging",
    isPro: false,
    examples: [
      "Write a 1500-word blog post titled '[TITLE]' optimized for SEO. Include: keyword-rich introduction, H2/H3 subheadings, bullet points, and conclusion with CTA",
      "Create 10 blog post titles for [NICHE] that would rank well on Google. Make them compelling, include target keywords, and explain search intent for each",
      "Generate a blog post outline for '[TOPIC]' including: SEO title, meta description, introduction hook, main sections with subheadings, and conclusion"
    ]
  }
];

// Business Prompt Packs - EXPANDED
export const businessPromptPacks: PromptPack[] = [
  {
    id: "email-marketing",
    title: "Email Marketing Templates",
    description: "High-converting email templates for different business needs",
    prompts: 28,
    category: "Marketing",
    isPro: false,
    examples: [
      "Create a welcome email sequence for new subscribers to [BUSINESS_TYPE]. Include: warm welcome, value proposition, what to expect, and first-time offer",
      "Write a product launch email for [PRODUCT] with: compelling subject line, problem-solution narrative, key features, social proof, and urgent call-to-action",
      "Generate a re-engagement email for inactive subscribers. Include: 'We miss you' approach, special offer, easy re-engagement options, and unsubscribe option"
    ]
  },
  {
    id: "business-planning",
    title: "Business Planning & Strategy",
    description: "Strategic planning prompts for business development",
    prompts: 22,
    category: "Strategy",
    isPro: true,
    examples: [
      "Create a lean business plan for [BUSINESS_IDEA] including: executive summary, market analysis, competitive landscape, revenue model, and financial projections",
      "Analyze the market opportunity for [PRODUCT/SERVICE] in [INDUSTRY]. Include: market size, target audience, competitors, pricing strategy, and go-to-market plan",
      "Develop a SWOT analysis for [COMPANY/IDEA]. Identify strengths, weaknesses, opportunities, and threats with specific examples and actionable insights"
    ]
  },
  {
    id: "sales-copy",
    title: "Sales Copy & Conversion",
    description: "Persuasive sales copy that converts visitors to customers",
    prompts: 32,
    category: "Sales",
    isPro: false,
    examples: [
      "Write a landing page sales copy for [PRODUCT/SERVICE] using the AIDA framework: Attention-grabbing headline, Interest-building benefits, Desire-creating testimonials, Action-driving CTA",
      "Create a sales email sequence for [PRODUCT] with 5 emails: introduction, problem awareness, solution presentation, objection handling, and final offer with urgency",
      "Generate product descriptions for [PRODUCT] that sell. Include: emotional hooks, feature-benefit translations, social proof elements, and compelling call-to-action"
    ]
  },
  {
    id: "customer-service",
    title: "Customer Service & Support",
    description: "Professional customer service responses and templates",
    prompts: 24,
    category: "Support",
    isPro: false,
    examples: [
      "Write a professional apology email for [ISSUE] that includes: sincere apology, explanation without excuses, specific solution, and future prevention measures",
      "Create a customer onboarding email sequence for [PRODUCT/SERVICE]. Include: welcome message, setup instructions, helpful resources, and support contact",
      "Generate FAQ responses for common customer questions about [PRODUCT/SERVICE]. Make them clear, helpful, and brand-aligned"
    ]
  },
  {
    id: "social-media-business",
    title: "Business Social Media",
    description: "Professional social media content for business growth",
    prompts: 35,
    category: "Social Media",
    isPro: false,
    examples: [
      "Create a week's worth of LinkedIn posts for [BUSINESS_TYPE] focusing on industry insights, company updates, and thought leadership",
      "Write engaging Twitter threads about [BUSINESS_TOPIC] that provide value and encourage engagement. Include 8-10 tweets with clear progression",
      "Generate Instagram Stories templates for businesses including: behind-the-scenes, team highlights, product features, and customer testimonials"
    ]
  },
  {
    id: "meeting-productivity",
    title: "Meeting & Productivity",
    description: "Templates for efficient meetings and business communication",
    prompts: 20,
    category: "Productivity",
    isPro: false,
    examples: [
      "Create a meeting agenda template for [MEETING_TYPE] including: objectives, discussion points, action items, and time allocation",
      "Write a project kickoff email for [PROJECT_NAME] including: project overview, team roles, timeline, deliverables, and next steps",
      "Generate a weekly team update template covering: accomplishments, challenges, upcoming priorities, and resource needs"
    ]
  },
  {
    id: "financial-planning",
    title: "Financial Planning & Analysis",
    description: "Business financial planning and analysis prompts",
    prompts: 18,
    category: "Finance",
    isPro: true,
    examples: [
      "Create a monthly financial report template for [BUSINESS_TYPE] including: revenue analysis, expense breakdown, cash flow, and key metrics comparison",
      "Generate a budget planning worksheet for [DEPARTMENT/PROJECT] with categories, estimated costs, and tracking mechanisms",
      "Analyze the financial impact of [BUSINESS_DECISION] including: cost-benefit analysis, ROI calculations, and risk assessment"
    ]
  },
  {
    id: "hr-recruitment",
    title: "HR & Recruitment",
    description: "Human resources and recruitment templates",
    prompts: 25,
    category: "HR",
    isPro: false,
    examples: [
      "Write a job description for [POSITION] including: role overview, key responsibilities, required qualifications, and company culture fit",
      "Create interview questions for [ROLE] covering: technical skills, cultural fit, problem-solving, and career goals",
      "Generate an employee onboarding checklist for [DEPARTMENT] including: paperwork, training modules, introductions, and first-week goals"
    ]
  }
];

// Career Prompt Packs
export const careerPromptPacks: PromptPack[] = [
  {
    id: "resume-optimization",
    title: "Resume Optimization",
    description: "Create compelling resumes that get past ATS and impress recruiters",
    prompts: 26,
    category: "Resume",
    isPro: false,
    examples: [
      "Optimize this resume bullet point for [JOB_TITLE]: [CURRENT_BULLET]. Make it quantifiable, action-oriented, and keyword-rich for ATS systems",
      "Write a professional summary for [CAREER_LEVEL] in [INDUSTRY] with [X] years of experience. Highlight key achievements, skills, and career goals in 3-4 lines",
      "Create 5 resume bullet points for [JOB_ROLE] that showcase achievements using the STAR method (Situation, Task, Action, Result) with specific metrics"
    ]
  },
  {
    id: "interview-preparation",
    title: "Interview Preparation",
    description: "Master job interviews with practice questions and strategies",
    prompts: 30,
    category: "Interview",
    isPro: false,
    examples: [
      "Prepare answers for these common interview questions for [JOB_TITLE]: Tell me about yourself, Why do you want this role?, What are your strengths/weaknesses?, Where do you see yourself in 5 years?",
      "Create 10 behavioral interview questions with STAR method answers for [INDUSTRY]. Focus on leadership, problem-solving, teamwork, and conflict resolution scenarios",
      "Develop thoughtful questions to ask the interviewer for [JOB_TITLE] at [COMPANY_TYPE]. Show genuine interest in role, company culture, growth opportunities, and team dynamics"
    ]
  },
  {
    id: "cover-letters",
    title: "Cover Letter Templates",
    description: "Personalized cover letters that stand out from the crowd",
    prompts: 20,
    category: "Applications",
    isPro: true,
    examples: [
      "Write a compelling cover letter for [JOB_TITLE] at [COMPANY]. Include: attention-grabbing opening, relevant experience alignment, company research insights, and strong closing",
      "Create a career change cover letter explaining transition from [OLD_FIELD] to [NEW_FIELD]. Address transferable skills, motivation for change, and value proposition",
      "Generate a cold outreach cover letter for [DREAM_COMPANY] in [INDUSTRY]. Show knowledge of company, propose value addition, and request informational interview"
    ]
  },
  {
    id: "linkedin-optimization",
    title: "LinkedIn Profile Optimization",
    description: "Optimize your LinkedIn profile to attract recruiters and opportunities",
    prompts: 24,
    category: "LinkedIn",
    isPro: false,
    examples: [
      "Write a compelling LinkedIn headline for [JOB_TITLE] that goes beyond job title. Include key skills, value proposition, and target audience in 120 characters",
      "Create a LinkedIn summary for [PROFESSION] with [X] years of experience. Tell your professional story, highlight achievements, and include a call-to-action",
      "Generate 10 LinkedIn post ideas for [INDUSTRY] professionals to build thought leadership. Include industry insights, personal experiences, and engagement questions"
    ]
  }
];
