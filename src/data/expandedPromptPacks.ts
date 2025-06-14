
import { PromptPack } from './aiTools';

// Enhanced School Prompt Packs with 50 detailed prompts
export const enhancedSchoolPromptPacks: PromptPack[] = [
  {
    id: "concept-explanations",
    title: "Concept Explanations for Students",
    description: "Get complex topics explained in simple, relatable terms",
    prompts: 10,
    category: "Learning",
    isPro: false,
    examples: [
      "Can you explain [insert concept] to me like I'm a 12-year-old who's never heard it before? Perfect for when your teacher is moving too fast and Google is giving overly complex answers.",
      "Simplify this dense academic paragraph into easy English a teenager can understand: [paste paragraph]. Great for breaking down technical content into something relatable.",
      "Give me a fun analogy to understand this hard concept: [insert concept]. Makes abstract ideas feel relatable.",
      "Create a fictional dialogue between two people discussing [concept] so I can understand it in a real-world context. Learning through storytelling makes complex theories stick better."
    ]
  },
  {
    id: "study-optimization",
    title: "Study Optimization & Planning",
    description: "Smart study strategies and personalized learning plans",
    prompts: 12,
    category: "Study Planning",
    isPro: false,
    examples: [
      "Take this wall of notes and turn it into 5 bite-sized flashcards I can review before a test. Here's the text: [paste]. Helps you prep smarter, not harder, especially for exams.",
      "Summarize this entire textbook page in 5 key points I can memorize. [paste content]. Use this when you're cramming and want to retain only what matters.",
      "Create a 7-day crash study plan to prepare for my upcoming [subject] test. I have only 2 hours per day. Ideal for last-minute learners who still want to pass with confidence.",
      "Build a revision calendar based on my test schedule. Here's what I'm studying: [list subjects]. Custom study roadmap."
    ]
  },
  {
    id: "interactive-learning",
    title: "Interactive Learning & Practice",
    description: "Turn passive studying into active learning experiences",
    prompts: 8,
    category: "Practice",
    isPro: false,
    examples: [
      "Generate 5 multiple-choice questions (with answers) based on [topic]. Make it feel like an actual quiz. Simulate test scenarios and self-check your understanding.",
      "Act as a private tutor and quiz me with 5 short-answer questions on [subject]. Then tell me how I did. Makes studying interactive and less boring.",
      "Generate 10 quick-fire revision questions I can answer out loud while walking. Great for active learners.",
      "Turn this study material into a Kahoot! quiz I can play with friends. Makes group revision fun."
    ]
  },
  {
    id: "content-transformation",
    title: "Content Transformation & Format",
    description: "Convert study materials into different engaging formats",
    prompts: 10,
    category: "Content Creation",
    isPro: true,
    examples: [
      "Turn this class lecture into a TikTok-style summary I can review on my phone later. For visual/audio learners who want quick, engaging review material.",
      "Convert these notes into a PowerPoint structure with slide headings and bullet points. [paste]. Useful for class presentations or visual study aids.",
      "Turn this entire article or blog post into a 1-minute explainer script I could use for a class video. Designed for content creators and students doing multimedia assignments.",
      "Turn this topic into a script I can use for a class video assignment. Supports multimedia learning."
    ]
  },
  {
    id: "memory-techniques",
    title: "Memory Techniques & Mnemonics",
    description: "Creative memory aids and retention strategies",
    prompts: 5,
    category: "Memory",
    isPro: false,
    examples: [
      "Make a fun mnemonic or rhyme to help me remember this process: [paste concept, e.g., photosynthesis steps]. Memorization made fun (and easier to recall under exam pressure).",
      "What are the 5 most important things to remember about [concept] for exams? Direct, exam-focused revision.",
      "Give me a quick timeline of events around [historical moment]. Visualizes history clearly.",
      "Compare and contrast [concept A] vs [concept B] with examples so I can finally understand the difference. Removes confusion around similar terms or theories."
    ]
  },
  {
    id: "research-assistance",
    title: "Research & Academic Writing",
    description: "Support for research projects and academic writing",
    prompts: 15,
    category: "Research",
    isPro: true,
    examples: [
      "Help me generate a unique research topic in [subject], preferably one that hasn't been overdone. Great when your brain is blank and you want a project that stands out.",
      "Can you find 3 real-world case studies I can reference for my paper on [topic]? Perfect for research-backed essays or dissertations.",
      "List the top 5 academic sources or journal articles about [topic], and explain each one briefly. Saves you time skimming through Google Scholar or JSTOR.",
      "What are some common research questions students ask when studying [topic]? Inspires better research questions, especially for thesis or coursework.",
      "Break down the pros and cons of different research methods for [topic or field]. Helpful when you're unsure whether to go qualitative, quantitative, or mixed.",
      "Give me a sample hypothesis I could use for a research project on [topic]. A shortcut to getting your proposal started.",
      "Summarize the current trends or debates in the field of [insert subject] — I need to stay updated for my paper. Gives your work academic depth and relevance.",
      "Turn this long research article into a 10-sentence summary with the main ideas and key stats. Makes dense reading easier to digest.",
      "What are the ethical considerations I should mention when doing research on [topic]? Especially useful for social science or medical projects.",
      "Help me design a simple survey/questionnaire to collect data on [issue]. Ideal for student-led primary research projects.",
      "What kind of data visualization should I use for my findings about [topic]? Ensures your charts don't confuse your audience (or your professor).",
      "Suggest a title, abstract, and 3 objectives for my research project on [topic]. Instantly frames your entire paper.",
      "List 5 controversial arguments related to [topic] that I can explore in my assignment. For persuasive writing, debates, or critical reviews.",
      "Help me build a basic literature review for my research on [topic]. Organizes your sources and shows gaps in existing work.",
      "What statistical tools or AI platforms can I use to analyze survey data for free? Helps students without SPSS or Excel experience."
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

// Business Prompt Packs - EXPANDED WITH 50 NEW PROMPTS
export const businessPromptPacks: PromptPack[] = [
  {
    id: "business-strategy-planning",
    title: "🧠 Business Strategy & Planning",
    description: "Strategic planning and business development prompts",
    prompts: 10,
    category: "Strategy",
    isPro: false,
    examples: [
      "Act like a business consultant and give me a simple business plan outline for a [type of business]. Ideal for first-time entrepreneurs figuring out where to start.",
      "I want to launch a side hustle. Suggest 3 low-cost business ideas based on trending markets. Great for users exploring online income.",
      "What are the key steps to validating a new product idea without spending too much? Risk-free strategy planning.",
      "Help me write a SWOT analysis for my startup idea: [brief description]. Helps identify strengths, weaknesses, opportunities, and threats.",
      "Give me a 30-day growth strategy to promote my small business online. Actionable plan to go from unknown to visible.",
      "Write a one-page executive summary for my business plan. Here's what I do: [input]. Useful for presentations or investor decks.",
      "What metrics should I track if I run a service-based business? Teaches users to monitor real results.",
      "Generate a competitor analysis for my business. I sell [product/service]. Critical for finding your edge in a saturated market.",
      "List 5 cost-saving tools I can use to manage a small remote team. Especially useful for freelancers and startup founders.",
      "Act as a mentor and tell me the biggest mistakes to avoid when launching a business in [industry]. Learn from others' failures before making your own."
    ]
  },
  {
    id: "marketing-branding",
    title: "📢 Marketing & Branding",
    description: "Marketing strategies and brand development prompts",
    prompts: 10,
    category: "Marketing",
    isPro: false,
    examples: [
      "Write 3 catchy Instagram bios for a business that does [insert service]. Instant social appeal.",
      "Create a content calendar for a business that sells [product] — I want 10 post ideas. Saves time and keeps content flowing.",
      "Act like a brand strategist. What's a good brand voice for a business targeting [audience]? Useful when you're defining your vibe.",
      "Suggest 5 marketing strategies I can use to promote my product with zero budget. Ideal for startups with tight wallets.",
      "Turn my product features into benefit-driven sales copy. Features: [paste list]. Converts features into compelling messaging.",
      "Write an elevator pitch for my business that I can say in under 60 seconds. Perfect for networking and pitching.",
      "Suggest hashtags and keywords to promote [product/service] on Instagram and TikTok. Boosts organic visibility.",
      "Turn this client testimonial into a compelling Instagram caption. [paste testimonial] Shows proof + connection.",
      "Write an email newsletter promoting my latest product launch. Details: [paste info] For email marketing and customer retention.",
      "Create a basic lead magnet idea I can offer to attract customers in [industry]. Grows your mailing list and brand authority."
    ]
  },
  {
    id: "operations-docs-productivity",
    title: "🗾️ Operations, Docs & Productivity",
    description: "Operational efficiency and documentation prompts",
    prompts: 10,
    category: "Operations",
    isPro: false,
    examples: [
      "Draft a professional invoice template for my freelance work as a [job]. Saves time creating recurring docs.",
      "Help me write a partnership proposal email to collaborate with [type of company]. Opens doors to brand deals.",
      "Generate a standard operating procedure (SOP) for onboarding new employees. Essential for scaling teams.",
      "Summarize this 10-page PDF business report into a bullet-point brief. Makes long reads digestible.",
      "Rewrite this job description to sound more exciting and clear: [paste] Attracts better applicants.",
      "Turn this messy meeting note into an organized minutes document. [paste notes] Helps teams stay aligned.",
      "Create a daily task planner for a digital marketer managing 3 clients. Boosts time management.",
      "What's the best way to automate tasks for a solo entrepreneur running an online store? Introduces productivity hacks.",
      "Suggest tools to manage customer service for a growing ecommerce brand. Keeps customers happy as you scale.",
      "Help me write an SOP for handling refund requests in my business. Smoothens operations and reduces conflicts."
    ]
  },
  {
    id: "communication-work-culture",
    title: "🤝 Communication & Work Culture",
    description: "Professional communication and team culture prompts",
    prompts: 10,
    category: "Communication",
    isPro: false,
    examples: [
      "Write a professional email to apologize to a client for a delay. Preserves business relationships.",
      "How do I give constructive feedback to my employee without hurting their morale? Supports positive team culture.",
      "Turn this long email into a short and clear message: [paste email] Polishes your communication.",
      "Draft a Slack message welcoming a new intern to the team. Makes remote work more human.",
      "Help me write a polite but firm follow-up email for an unpaid invoice. Encourages payment while maintaining professionalism.",
      "What should I say in a 1-on-1 check-in with a remote team member? Encourages deeper team connection.",
      "Generate an icebreaker activity for my virtual team meeting. Builds morale in hybrid workspaces.",
      "Create a response template to customer complaints about late delivery. Helps teams respond quickly and consistently.",
      "What are 3 ways to motivate a burned-out remote employee? Fosters mental wellness at work.",
      "Write a short appreciation message I can send to a team member who's been doing great. Small praise, big impact."
    ]
  },
  {
    id: "personal-growth-career",
    title: "📈 Personal Growth & Career Upskilling",
    description: "Professional development and career advancement prompts",
    prompts: 10,
    category: "Career Growth",
    isPro: true,
    examples: [
      "Build a personalized learning path to become a digital marketer in 90 days. Perfect for workers pivoting careers.",
      "What online certifications will make me stand out as a project manager? Resume-boosting advice.",
      "Act like a career coach and tell me how to grow in my current role at a startup. For people feeling stuck or stagnant.",
      "Suggest 3 side income ideas I can do after work with just a laptop. Encourages productivity outside 9–5.",
      "Help me structure a cold DM to a professional I want to network with on LinkedIn. Boosts networking confidence.",
      "What's the best way to document my achievements for a future promotion? Helps with performance reviews.",
      "List daily habits of successful entrepreneurs I can start practicing today. Mindset + structure.",
      "Give me a confidence-boosting affirmation for tough work days. Encourages emotional resilience.",
      "Write a script for asking my manager for mentorship. Career growth conversation starter.",
      "Suggest 3 books that can help me become a better leader at work — and tell me why each matters. Builds emotional intelligence and leadership skills."
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
