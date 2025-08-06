import { PromptPack } from './aiTools';

// Enhanced School & Education Prompt Packs with 70+ prompts
export const enhancedSchoolPromptPacks: PromptPack[] = [
  {
    id: 'advanced-study-exam-prep',
    title: 'Advanced Study & Exam Preparation',
    description: 'Expert-level prompts for academic success, exam strategies, and retention techniques',
    prompts: 10,
    category: 'School & Education',
    isPro: true,
    examples: [
      "**You're an academic tutor with a PhD in [Subject].** Create a simplified explanation of [Insert Topic] using real-life analogies, storytelling, and visuals the average high school student can understand.",
      "**Act as a top-ranked exam coach.** Based on this syllabus: [Paste Syllabus], generate a detailed 30-day revision plan with daily focus topics, mock questions, and high-retention strategies.",
      "**You are a professional flashcard creator.** Convert this topic into a spaced-repetition flashcard set optimized for memorization and recall. Output in Q&A format. Topic: [Insert Topic]",
      "**Break down [Insert Complex Theory]** into 3 progressive levels: beginner, intermediate, and expert — each with clear explanations, examples, and quiz questions to test understanding.",
      "**Turn this messy lecture note** into a structured study guide with headers, summaries, definitions, and exam tips. [Paste Notes]",
      "**You are an exam setter.** Write a 20-question multiple-choice quiz on [Insert Topic] covering both theory and applied knowledge. Include correct answers with explanations for each.",
      "**Create a visual mind map breakdown** of [Insert Subject] that could be used in a study app — include branches for concepts, subtopics, formulas, and real-world relevance.",
      "**Build a weekly planner** for mastering [Insert Subject] from scratch in 6 weeks. Include key concepts, YouTube video suggestions, textbook pages, and practice questions.",
      "**You're an academic AI coach.** Turn this list of topics into a project-based learning plan with milestones, outputs, and grading rubrics. [Insert Topics]",
      "**You're an academic coach for students with ADHD.** Design a distraction-proof study workflow for [Insert Subject], using 25-minute sprints and active recall."
    ]
  },
  {
    id: 'research-writing-excellence',
    title: 'Research & Writing Excellence',
    description: 'Professional-grade prompts for academic research, essay writing, and scholarly communication',
    prompts: 10,
    category: 'School & Education',
    isPro: true,
    examples: [
      "**Summarize this academic paper** using an abstract, key arguments, limitations, and real-world applications. Keep it under 300 words but retain scholarly depth. [Paste Text]",
      "**Act like an academic ghostwriter.** Rewrite this rough essay draft into a polished university-level essay in APA format with citations. Maintain original intent but improve structure and flow. [Paste Essay]",
      "**You are a research supervisor.** Given this topic: [Insert Topic], generate 5 original research questions, a brief hypothesis, and recommended data sources for each.",
      "**You're a top citation expert.** Format this reference list into both APA and MLA styles, and correct any missing information. [Paste References]",
      "**Write a sample answer** to this past exam question, using ideal structure, quotes, citations, and insights to aim for a top-grade. [Paste Question]",
      "**Reframe this data set** into a research findings summary with visual suggestions (e.g., bar chart, table). Highlight trends, anomalies, and implications. [Paste Data]",
      "**Write a comparative analysis** between [Book A] and [Book B], focusing on themes, characters, cultural context, and author intent.",
      "**Draft an academic discussion post** based on this reading. Pose a question to spark dialogue in a class forum. [Insert Topic]",
      "**You are a university admissions coach.** Improve this personal statement to match Ivy League standards while keeping my voice authentic. [Paste Draft]",
      "**Act like a university teaching assistant.** Review this assignment, suggest improvements, and point out where marks might be lost. [Paste Assignment]"
    ]
  },
  {
    id: 'critical-thinking-analysis',
    title: 'Critical Thinking & Analysis',
    description: 'Advanced prompts for developing analytical skills, debate preparation, and academic reasoning',
    prompts: 10,
    category: 'School & Education',
    isPro: true,
    examples: [
      "**Explain [Insert Historical Event]** using a cause-and-effect timeline, with global context, long-term impact, and comparison to similar events in history.",
      "**Create a Socratic dialogue-style Q&A script** that helps someone understand [Insert Topic] by asking progressively deeper questions that lead to understanding.",
      "**Write a sample debate script** — one side for and one side against — the use of [Insert Controversial Educational Topic]. Include references, facts, and counter-arguments.",
      "**Extract 10 critical thinking prompts** and discussion questions from this reading material to encourage deeper classroom analysis. [Paste Text]",
      "**Simulate a mock oral defense** of a research paper. Ask 5 challenging questions based on this abstract and suggest strong response strategies. [Paste Abstract]",
      "**Analyze this poem or literature piece** from the lens of feminism / post-colonialism / Marxism. Provide a short critique based on the selected theory. [Paste Text]",
      "**You are a debate judge.** Evaluate this speech based on structure, logic, delivery, and rebuttal power. [Paste Speech]",
      "**Create a comparison chart** between two scientific theories, including origin, assumptions, experimental backing, and real-world impact. [Theory A] vs [Theory B]",
      "**Identify 5 scholarship opportunities** relevant to students in [Country] pursuing [Field of Study]. Include brief descriptions and links.",
      "**Create a real-life problem scenario** that tests my ability to apply [Insert Concept] practically, and then walk through the solution."
    ]
  },
  {
    id: 'stem-mastery-tools',
    title: 'STEM Mastery Tools',
    description: 'Specialized prompts for mathematics, science, and technical subject mastery',
    prompts: 10,
    category: 'School & Education',
    isPro: true,
    examples: [
      "**You are a math genius tutor.** Generate a complete breakdown of solving [Insert Math Problem or Topic], including formulas, logic, step-by-step walkthrough, and a second example for practice.",
      "**Generate a cheat sheet of formulas** and when to use them for this math/science topic: [Insert Topic]",
      "**Give me 5 ideas for science experiments** that demonstrate [Insert Principle], using low-cost or household items.",
      "**Simplify this theoretical concept** using metaphors and explain how it can be applied to modern technology, society, or business. [Insert Concept]",
      "**Break down a Nobel Prize-winning idea** in [Insert Field] and explain it in a way a curious high schooler would find fascinating.",
      "**Generate a list of 10 terms** in [Subject] that are often misunderstood. Define each, give examples, and explain common mistakes students make.",
      "**You are a memory coach.** Build a 10-point retention checklist for mastering this topic: [Insert Topic]",
      "**Build a crossword puzzle or word search** using these academic terms. Make it challenging but fun. [Paste List]",
      "**Simulate a timed test environment.** Ask me 5 questions on [Insert Topic] and grade my answers like a strict examiner would.",
      "**Rewrite this explanation** to sound more persuasive and confident, as if you're teaching it to a peer. [Paste Explanation]"
    ]
  },
  {
    id: 'presentation-communication',
    title: 'Academic Presentation & Communication',
    description: 'Professional prompts for academic presentations, public speaking, and scholarly communication',
    prompts: 10,
    category: 'School & Education',
    isPro: true,
    examples: [
      "**Turn this paragraph** into a concise elevator pitch version, then expand it into a detailed summary suitable for a research proposal. [Paste Text]",
      "**You're a university professor.** Create a grading rubric to assess a student essay on [Insert Topic], with detailed scoring criteria for thesis, structure, research, grammar, and citations.",
      "**Simulate a mini classroom** where I'm the student. Walk me through [Insert Topic] in a conversational tone, asking me questions as we go to test my understanding.",
      "**Develop an infographic outline** to teach [Insert Topic] visually, highlighting key stats, concepts, processes, and examples. Use bullet points and layout suggestions.",
      "**Write a case study** on the impact of [Insert Issue] on students in developing countries — include causes, data, and intervention strategies.",
      "**Take this long academic paper** and compress it into a Twitter thread that explains the key points in 10 tweets — use emojis, analogies, and hashtags. [Paste Text]",
      "**You're a curriculum developer.** Turn [Insert Topic] into a 5-day lesson plan with learning objectives, warm-up activities, and end-of-day assessments.",
      "**Recreate this paragraph** into a journalistic article suitable for a student magazine. Keep it engaging but factual. [Paste Text]",
      "**Turn these bullet points** into a narrated script for an educational YouTube video on [Insert Topic]. Add examples, transitions, and a compelling hook. [Paste Points]",
      "**You're a speech coach.** Turn this academic explanation into a TED Talk script with emotion, real-world impact, and audience engagement. [Paste Text]"
    ]
  },
  {
    id: 'homework-assistance',
    title: 'Homework & Assignment Help',
    description: 'Get help with homework across all subjects with structured guidance',
    prompts: 15,
    category: 'School & Education',
    isPro: false,
    examples: [
      "Help me understand this math problem step by step: [PASTE PROBLEM]. Explain each concept used and show alternative solving methods.",
      "Break down this history assignment into manageable tasks: [PASTE ASSIGNMENT]. Create a research timeline and suggest key topics to focus on.",
      "Explain this science concept in simple terms with real-world examples: [PASTE CONCEPT]. Include why it's important and how it applies to daily life.",
      "Help me outline this essay topic: [TOPIC]. Suggest a thesis statement, main arguments, and supporting evidence I should research.",
      "Review my homework answer and suggest improvements: [PASTE ANSWER]. Point out strengths and areas that need more development."
    ]
  },
  {
    id: 'note-taking-organization',
    title: 'Note-Taking & Organization',
    description: 'Master effective note-taking and study organization techniques',
    prompts: 12,
    category: 'School & Education',
    isPro: false,
    examples: [
      "Convert these messy lecture notes into a well-organized study guide: [PASTE NOTES]. Add headers, key points, and summary sections.",
      "Create a Cornell note-taking template for this subject: [SUBJECT]. Include sections for notes, cues, and summary.",
      "Turn this textbook chapter into an outline with main topics and subtopics: [PASTE CHAPTER]. Highlight the most important concepts for exam prep.",
      "Help me create a study schedule for these upcoming exams: [LIST EXAMS]. Balance study time based on difficulty and importance.",
      "Organize these random study materials into a logical learning sequence: [LIST MATERIALS]. Suggest the best order to study them."
    ]
  },
  {
    id: 'language-learning',
    title: 'Language Learning Support',
    description: 'Accelerate language learning with interactive prompts and practice',
    prompts: 18,
    category: 'School & Education',
    isPro: true,
    examples: [
      "Create a conversation practice scenario in [LANGUAGE] for ordering food at a restaurant. Include common phrases and vocabulary.",
      "Help me practice grammar by correcting this paragraph in [LANGUAGE]: [PASTE TEXT]. Explain each correction and the grammar rule.",
      "Generate 10 practice sentences using these new vocabulary words in [LANGUAGE]: [LIST WORDS]. Include translations and context.",
      "Create flashcards for these [LANGUAGE] verb conjugations: [LIST VERBS]. Show all tenses and provide example sentences.",
      "Role-play a job interview conversation in [LANGUAGE]. Ask common questions and help me formulate professional responses."
    ]
  }
];

// Content Creation Prompt Packs - EXPANDED with 70+ prompts
export const contentPromptPacks: PromptPack[] = [
  {
    id: 'content-strategy-planning',
    title: 'Content Strategy & Planning',
    description: 'Full-stack content strategist prompts for cross-platform success',
    prompts: 10,
    category: 'Content Creation',
    isPro: true,
    examples: [
      "**Act as a full-stack content strategist.** Given my niche ([Insert Niche]), target audience ([Insert Audience]), and content goal ([e.g., build trust, generate leads]), create a 30-day cross-platform content calendar including platform-specific post ideas, suggested posting times, and engagement strategies.",
      "**Take this blog post idea:** [Insert Idea] and turn it into a complete outline with SEO-optimized H2s and H3s, suggested keywords, FAQs, and internal link opportunities.",
      "**Design a social media content repurposing plan.** Given one long-form blog post, break it into 5 tweet threads, 3 carousel posts, 2 Reels scripts, and 1 email newsletter.",
      "**Create 5 content ideas** for a storytelling-based brand campaign using current pop culture trends, memes, and internet slang — targeting Millennials and Gen Z.",
      "**Develop a brand voice guide** for my business based on this mission, target audience, and content samples. Include tone, vocabulary, emojis usage, and no-go phrases. [Paste Info]",
      "**Generate a month's worth of Instagram captions** for a personal brand that teaches [Insert Topic]. Each caption should include a story, value, and soft CTA.",
      "**You're a trend forecaster.** Predict 5 content trends that creators in the [Insert Niche] space should lean into over the next 3 months.",
      "**Generate 10 original content ideas** that combine storytelling and education in the [Insert Niche] space — include a 1-line hook and CTA for each.",
      "**Create a post structure** I can reuse every week to build consistency on Twitter, Instagram, and LinkedIn. Include examples and format guidelines.",
      "**Build a notion board structure** for managing ideas, content pipelines, hooks, captions, and analytics all in one place."
    ]
  },
  {
    id: 'video-script-creation',
    title: 'Video & Script Creation',
    description: 'Professional video scripting and viral content creation prompts',
    prompts: 10,
    category: 'Content Creation',
    isPro: true,
    examples: [
      "**You are a viral video scriptwriter** for TikTok and Instagram Reels. Using the following topic: [Insert Topic], write a 60-second script that starts with a curiosity-driven hook, flows with emotional storytelling, and ends with a strong call to action — optimized for vertical video delivery.",
      "**You're a YouTube strategist.** Create a full script for an 8-minute explainer video about [Insert Topic], including intro hook, main sections with timestamps, examples, and a closing CTA that promotes email signups.",
      "**Write a high-converting YouTube video title,** description, and thumbnail text that will outperform competitors for the keyword: [Insert Keyword]. Include title variations and why each one works.",
      "**Convert this educational blog post** into a podcast script with a conversational tone, rhetorical questions, humor, and audience interaction moments. [Paste Post]",
      "**Simulate a live stream content outline.** The topic is: [Insert Topic]. Break it into intro talking points, audience engagement questions, mid-show retention tactics, and post-stream repurposing ideas.",
      "**You're a video director.** Give me a storyboard outline for a cinematic product trailer for [Insert Product], including shot types, music vibe, transitions, and emotional beats.",
      "**Write a compelling 'story time' Instagram Reel script** based on this past failure or embarrassing moment — build it up with drama, relatability, and a life lesson. [Describe Moment]",
      "**Take this TikTok video concept** and write 3 hook variations, 3 punchlines, and 3 comments I can pin to increase engagement and watch time. [Insert Concept]",
      "**You are a video editor's assistant.** Create a shot list and on-screen text script for a tutorial video teaching [Insert Skill]. Include visual B-roll suggestions.",
      "**Create a list of 7 viral hook templates** I can adapt for Reels or TikTok that are scroll-stopping and curiosity-inducing."
    ]
  },
  {
    id: 'social-media-optimization',
    title: 'Social Media Optimization',
    description: 'Advanced social media optimization and engagement strategies',
    prompts: 10,
    category: 'Content Creation',
    isPro: true,
    examples: [
      "**You are a visual storyteller.** Based on the following brand tone and value proposition: [Insert Tone], generate a 10-slide Instagram carousel content concept with text per slide, engaging hooks, and design prompts for each slide.",
      "**Act as a brand voice coach.** Rewrite this Instagram caption to sound more engaging, more conversational, and emotionally resonant with Gen Z audiences. [Paste Caption]",
      "**Create 10 tweet ideas** for a thought leader in [Insert Niche] that blend storytelling, value delivery, controversial opinions, and one-liner punchlines. Include suggested hashtags.",
      "**You're a caption writer for luxury brands.** Write 5 caption options for this image that evoke exclusivity, elegance, and emotional aspiration. [Describe Image]",
      "**Take this low-performing post** and diagnose what's wrong. Suggest better hooks, visual ideas, hashtags, and ways to boost comments. [Paste Post]",
      "**You are an AI script editor.** Review this short script for clarity, tone, rhythm, and emotional impact. Suggest edits line by line. [Paste Script]",
      "**Generate 10 engagement post ideas** that don't require a new product or announcement — purely focused on conversation starters and interaction.",
      "**You are a visual storyteller.** Suggest color schemes, typography styles, and design prompts for content that communicates calmness and credibility.",
      "**Help me create a community-driven post.** Draft a prompt that invites others to share their stories while subtly connecting it to my mission. [Describe Topic]",
      "**You're a LinkedIn algorithm whisperer.** Build a 7-day posting plan to maximize reach and profile visits for a job seeker with under 500 followers."
    ]
  },
  {
    id: 'copywriting-persuasion',
    title: 'Copywriting & Persuasion',
    description: 'Advanced copywriting techniques for maximum conversion and engagement',
    prompts: 10,
    category: 'Content Creation',
    isPro: true,
    examples: [
      "**You are a storytelling mentor.** Help me turn this random idea into a compelling personal story that could go viral on LinkedIn or Instagram. Include hook, tension, lesson, and payoff. [Paste Idea]",
      "**You are a content ghostwriter for CEOs.** Turn this rough note into a high-authority LinkedIn post that delivers insights and builds executive presence. [Paste Note]",
      "**You are a meme creator.** Generate 5 smart, shareable meme ideas for [Insert Industry] that subtly promote a product without sounding like an ad.",
      "**Act as a copywriting mentor.** Rewrite this caption using the AIDA framework: Attention, Interest, Desire, Action. [Paste Text]",
      "**You're a newsletter expert.** Create a 4-week welcome email sequence that builds trust and drives traffic to my content library.",
      "**Write a persuasive CTA** that encourages readers to save this post for later. Give me 3 versions: serious, playful, and FOMO-based.",
      "**Turn this testimonial** into a punchy social proof caption with a hook, highlighted quote, and subtle CTA. [Paste Testimonial]",
      "**You are an email subject line optimizer.** Rewrite these 5 subject lines to increase open rates. Add preview text for each. [Paste Subjects]",
      "**You're a copywriting expert.** Rewrite this landing page to increase conversions by making it clearer, emotionally resonant, and benefit-driven. [Paste Page]",
      "**Design a storytelling formula** I can use repeatedly to introduce myself to new audiences, highlighting my backstory, mission, and what I offer."
    ]
  },
  {
    id: 'content-optimization-analytics',
    title: 'Content Optimization & Analytics',
    description: 'Data-driven content optimization and performance analysis prompts',
    prompts: 10,
    category: 'Content Creation',
    isPro: true,
    examples: [
      "**You are an SEO consultant.** Turn this rough blog draft into a fully optimized article for Google Search, using Yoast standards: title tags, meta description, keyword density, outbound/internal links, and schema suggestions. [Paste Draft]",
      "**Turn this raw transcript** into a polished blog post with structure, formatting, and a click-worthy title. Keep the natural tone but tighten the flow. [Paste Transcript]",
      "**You're a freelance portfolio coach.** Turn this list of work samples into a punchy portfolio bio with proof, credibility, and personality. [Paste List]",
      "**You are a content optimization expert.** Analyze this underperforming content piece and suggest 5 specific improvements for better engagement. [Paste Content]",
      "**Create a content audit template** for reviewing my existing content library. Include metrics to track and improvement suggestions.",
      "**Design an A/B testing plan** for my social media content. Include variables to test and success metrics.",
      "**Help me create a content performance dashboard** with the most important KPIs for my business goals.",
      "**Write a content distribution strategy** for amplifying my best-performing content across multiple channels.",
      "**Create a content calendar template** that balances different content types and posting frequencies.",
      "**Turn this research report** into a TikTok video script that breaks it down in a fun, easy-to-digest way. [Paste Research Summary]"
    ]
  },
  {
    id: 'youtube-content-creation',
    title: 'YouTube Content Creation',
    description: 'Complete YouTube strategy from thumbnails to monetization',
    prompts: 15,
    category: 'Content Creation',
    isPro: false,
    examples: [
      "Create a viral YouTube video title for this topic: [TOPIC]. Include emotional hooks and curiosity gaps to maximize click-through rate.",
      "Write a 10-minute YouTube video script on [TOPIC] with clear sections, audience engagement moments, and a strong call-to-action.",
      "Design a thumbnail concept for my YouTube video about [TOPIC]. Describe colors, text, facial expressions, and visual elements.",
      "Create a YouTube video description with proper tags, timestamps, and CTAs for this video topic: [TOPIC].",
      "Help me plan a YouTube series with 8 episodes about [TOPIC]. Include episode titles and brief descriptions."
    ]
  },
  {
    id: 'instagram-mastery',
    title: 'Instagram Content Mastery',
    description: 'Advanced Instagram strategies for growth and engagement',
    prompts: 14,
    category: 'Content Creation',
    isPro: false,
    examples: [
      "Write 10 Instagram caption templates I can reuse for [NICHE]. Include hooks, value, and engagement questions.",
      "Create a Reels script for a day-in-the-life video for someone who works as [JOB]. Make it entertaining and relatable.",
      "Design an Instagram carousel post about [TOPIC] with 8 slides. Include text for each slide and design suggestions.",
      "Write Instagram Stories templates for behind-the-scenes content for a [BUSINESS TYPE].",
      "Create a month's worth of Instagram post ideas for a [NICHE] account focusing on education and entertainment."
    ]
  },
  {
    id: 'tiktok-viral-strategies',
    title: 'TikTok Viral Strategies',
    description: 'Master TikTok algorithm and create viral content',
    prompts: 12,
    category: 'Content Creation',
    isPro: false,
    examples: [
      "Write a viral TikTok script using the 'You vs You' trend for [TOPIC]. Include hooks and visual cues.",
      "Create 5 TikTok video ideas that explain [COMPLEX TOPIC] in simple, entertaining ways.",
      "Design a TikTok challenge concept related to [NICHE] that encourages user participation.",
      "Write TikTok captions with trending hashtags for videos about [TOPIC].",
      "Create a TikTok content calendar for a business in [INDUSTRY] with 20 video ideas."
    ]
  }
];

// Business & Work Prompt Packs - EXPANDED with 70+ prompts
export const businessPromptPacks: PromptPack[] = [
  {
    id: 'business-operations-strategy',
    title: 'Business Operations & Strategy',
    description: 'Strategic business operations and management excellence',
    prompts: 10,
    category: 'Business & Work',
    isPro: true,
    examples: [
      "**Act as a business operations consultant.** Analyze my current workflow for [Business Process] and suggest 5 specific improvements to increase efficiency by 30%. Include implementation timeline and resource requirements.",
      "**You are a strategic planning expert.** Create a comprehensive 12-month business roadmap for scaling from [Current State] to [Desired Outcome]. Include quarterly milestones, KPIs, and risk mitigation strategies.",
      "**Design a customer onboarding system** that reduces churn by 25% for a [Business Type]. Include touchpoints, automated sequences, and success metrics.",
      "**You're a process optimization specialist.** Document a standard operating procedure (SOP) for [Specific Business Process] that any team member can follow. Include decision trees and quality checkpoints.",
      "**Create a competitive analysis framework** for monitoring 5 key competitors in [Industry]. Include metrics to track, tools to use, and reporting templates.",
      "**Act as a business analyst.** Evaluate this business idea: [Business Concept] using lean startup methodology. Include market validation steps, MVP features, and success criteria.",
      "**Design a crisis management plan** for a business facing [Specific Challenge]. Include immediate actions, communication strategies, and recovery timeline.",
      "**You're a digital transformation consultant.** Create a roadmap for modernizing [Traditional Business Process] using technology. Include tool recommendations and change management strategies.",
      "**Build a performance management system** that aligns individual goals with business objectives. Include review cycles, feedback mechanisms, and improvement plans.",
      "**Create a business model canvas** for pivoting [Current Business] to [New Market/Product]. Include value propositions, revenue streams, and key partnerships."
    ]
  },
  {
    id: "marketing-branding",
    title: "Marketing & Branding",
    description: "Marketing strategies and brand development prompts",
    prompts: 15,
    category: "Business & Work",
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
    title: "Operations & Productivity",
    description: "Operational efficiency and documentation prompts",
    prompts: 12,
    category: "Business & Work",
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
    id: "sales-customer-service",
    title: "Sales & Customer Service",
    description: "Sales strategies and customer relationship management",
    prompts: 14,
    category: "Business & Work",
    isPro: false,
    examples: [
      "Write a sales email sequence for my product [PRODUCT]. Include 5 emails: introduction, value, objection handling, urgency, and final offer.",
      "Create a customer service response template for handling complaints about [ISSUE]. Make it empathetic and solution-focused.",
      "Help me write a follow-up email for leads who showed interest but didn't buy. Include value and soft CTA.",
      "Design a referral program structure for my business. Include incentives, process, and promotional messaging.",
      "Write scripts for handling common customer objections about price, timing, and need for [PRODUCT/SERVICE].",
      "Create a post-purchase email sequence to increase customer satisfaction and encourage reviews.",
      "Generate ideas for upselling customers who just bought [PRODUCT]. Include complementary products and bundles.",
      "Write a professional response to a negative online review. Address concerns while maintaining brand reputation."
    ]
  },
  {
    id: "financial-planning-analysis",
    title: "Financial Planning & Analysis",
    description: "Business financial management and planning tools",
    prompts: 11,
    category: "Business & Work",
    isPro: true,
    examples: [
      "Create a simple monthly budget template for a small business in [INDUSTRY]. Include revenue streams and expense categories.",
      "Help me calculate the ROI of this marketing campaign: [CAMPAIGN DETAILS]. Show formula and interpretation.",
      "Generate a cash flow projection for the next 6 months based on these numbers: [FINANCIAL DATA].",
      "Create a pricing strategy for my new service: [SERVICE DESCRIPTION]. Consider costs, competitors, and value proposition.",
      "Write a financial report summary explaining these business metrics to stakeholders: [METRICS].",
      "Help me create a break-even analysis for my business idea: [BUSINESS DETAILS].",
      "Suggest ways to reduce business expenses without affecting quality or service."
    ]
  },
  {
    id: "team-management-hr",
    title: "Team Management & HR",
    description: "Human resources and team leadership prompts",
    prompts: 13,
    category: "Business & Work",
    isPro: false,
    examples: [
      "Write a job posting for [POSITION] that attracts top talent. Include role, requirements, benefits, and company culture.",
      "Create interview questions for hiring a [ROLE]. Include technical, behavioral, and culture-fit questions.",
      "Draft a performance review template for evaluating employees. Include goals, achievements, and development areas.",
      "Write an employee onboarding checklist for new hires. Include first-day, first-week, and first-month activities.",
      "Help me give constructive feedback to an underperforming employee. Make it supportive and actionable.",
      "Create a remote work policy for my team. Include expectations, communication, and productivity guidelines.",
      "Write a team meeting agenda template that keeps meetings focused and productive."
    ]
  },
  {
    id: "business-growth-scaling",
    title: "Business Growth & Scaling",
    description: "Scale your business with strategic growth prompts",
    prompts: 16,
    category: "Business & Work",
    isPro: true,
    examples: [
      "Create a growth strategy for scaling my business from $X to $Y revenue. Include timelines and key milestones.",
      "Help me identify new revenue streams for my existing business: [BUSINESS DESCRIPTION].",
      "Write a business expansion plan for entering a new market: [TARGET MARKET].",
      "Create a customer acquisition strategy for my business with a budget of $[AMOUNT].",
      "Develop a product launch timeline for bringing [PRODUCT] to market. Include pre-launch, launch, and post-launch phases.",
      "Help me create a competitive analysis of my top 3 competitors in [INDUSTRY].",
      "Write a proposal for securing business funding or investment. Include problem, solution, market size, and financial projections."
    ]
  }
];

// Career & Jobs Prompt Packs - EXPANDED with 70+ prompts
export const careerPromptPacks: PromptPack[] = [
  {
    id: 'career-advancement-strategy',
    title: 'Career Advancement & Strategy',
    description: 'Professional career coaching and advancement strategies',
    prompts: 10,
    category: 'Career & Jobs',
    isPro: true,
    examples: [
      "**Act as a career coach for tech professionals.** Based on this resume and job posting, write a tailored cover letter that aligns with the company's mission, mirrors key language from the job description, and highlights quantified achievements. [Paste Resume & Job Post]",
      "**You're a LinkedIn growth strategist.** Write a powerful headline, summary, and featured section for a job seeker trying to pivot from [Insert Old Career] to [Insert New Career]. Include industry keywords and storytelling.",
      "**You are a job offer negotiator.** Based on this offer letter and job scope, write a professional counteroffer email that justifies a higher salary, includes alternative perks, and maintains a respectful tone. [Paste Offer Details]",
      "**You're a personal branding expert.** Build a full LinkedIn content strategy for the next 4 weeks — including post types (personal story, value, soft sell), caption ideas, and a weekly posting cadence to increase visibility.",
      "**Write 5 versions of a cold DM message** for reaching out to hiring managers or recruiters on LinkedIn — each with a slightly different tone (friendly, direct, humble, confident, curious).",
      "**You are an HR career mentor.** Draft a 6-month personal development plan for someone in mid-career feeling stuck in their role — include goals, stretch assignments, learning paths, and accountability tips.",
      "**You're a career switch advisor.** Help me reframe my skills from [Old Industry] to [Target Industry] — include keyword mapping, skill translation, and suggested roles.",
      "**You're a corporate leadership trainer.** Draft a professional development roadmap for someone trying to move from individual contributor to team lead within 12 months.",
      "**Generate 10 elevator pitches** for different career stages (student, recent grad, mid-career pivot, laid off, freelancer) — each under 30 seconds and focused on confidence.",
      "**You're a freelancing coach.** Write a 90-day roadmap for someone transitioning from full-time employment into freelance consulting."
    ]
  },
  {
    id: 'job-search-strategies',
    title: 'Job Search Strategies',
    description: 'Advanced job search techniques and networking strategies',
    prompts: 14,
    category: 'Career & Jobs',
    isPro: false,
    examples: [
      "Create a job search plan for transitioning from [CURRENT ROLE] to [TARGET ROLE]. Include timeline, networking strategy, and skill development.",
      "Write a cold outreach email to hiring managers for [JOB TITLE] positions. Make it personal and value-focused.",
      "Help me optimize my LinkedIn profile for [TARGET JOB]. Include headline, summary, and experience descriptions.",
      "Create a list of companies I should target for [JOB ROLE] applications based on my background in [INDUSTRY].",
      "Write follow-up email templates for after job applications, interviews, and networking conversations.",
      "Design a tracking system for my job applications including company, position, status, and next steps.",
      "Create networking conversation starters for industry events related to [FIELD]."
    ]
  },
  {
    id: 'interview-preparation',
    title: 'Interview Preparation',
    description: 'Master job interviews with practice questions and strategies',
    prompts: 15,
    category: 'Career & Jobs',
    isPro: false,
    examples: [
      "Prepare answers for these common interview questions for [JOB_TITLE]: Tell me about yourself, Why do you want this role?, What are your strengths/weaknesses?, Where do you see yourself in 5 years?",
      "Create 10 behavioral interview questions with STAR method answers for [INDUSTRY]. Focus on leadership, problem-solving, teamwork, and conflict resolution scenarios",
      "Develop thoughtful questions to ask the interviewer for [JOB_TITLE] at [COMPANY_TYPE]. Show genuine interest in role, company culture, growth opportunities, and team dynamics",
      "Practice answering 'Why should we hire you?' for [SPECIFIC ROLE]. Include unique value proposition and concrete examples.",
      "Prepare for technical interviews in [FIELD] with sample questions and detailed answer frameworks."
    ]
  },
  {
    id: 'resume-optimization',
    title: 'Resume Optimization',
    description: 'Create compelling resumes that get past ATS and impress recruiters',
    prompts: 16,
    category: 'Career & Jobs',
    isPro: false,
    examples: [
      "Optimize this resume bullet point for [JOB_TITLE]: [CURRENT_BULLET]. Make it quantifiable, action-oriented, and keyword-rich for ATS systems",
      "Write a professional summary for [CAREER_LEVEL] in [INDUSTRY] with [X] years of experience. Highlight key achievements, skills, and career goals in 3-4 lines",
      "Create 5 resume bullet points for [JOB_ROLE] that showcase achievements using the STAR method (Situation, Task, Action, Result) with specific metrics",
      "Tailor my resume for this specific job posting: [JOB DESCRIPTION]. Highlight relevant experience and include key terms.",
      "Help me choose the best resume format for my career stage and industry: [DETAILS]."
    ]
  },
  {
    id: 'cover-letters',
    title: 'Cover Letter Templates',
    description: 'Personalized cover letters that stand out from the crowd',
    prompts: 12,
    category: 'Career & Jobs',
    isPro: true,
    examples: [
      "Write a compelling cover letter for [JOB_TITLE] at [COMPANY]. Include: attention-grabbing opening, relevant experience alignment, company research insights, and strong closing",
      "Create a career change cover letter explaining transition from [OLD_FIELD] to [NEW_FIELD]. Address transferable skills, motivation for change, and value proposition",
      "Generate a cold outreach cover letter for [DREAM_COMPANY] in [INDUSTRY]. Show knowledge of company, propose value addition, and request informational interview",
      "Write a cover letter for a remote position highlighting my remote work experience and self-management skills.",
      "Create a cover letter template for internship applications that showcases enthusiasm and learning potential."
    ]
  },
  {
    id: 'linkedin-optimization',
    title: 'LinkedIn Profile Optimization',
    description: 'Optimize your LinkedIn profile to attract recruiters and opportunities',
    prompts: 14,
    category: 'Career & Jobs',
    isPro: false,
    examples: [
      "Write a compelling LinkedIn headline for [JOB_TITLE] that goes beyond job title. Include key skills, value proposition, and target audience in 120 characters",
      "Create a LinkedIn summary for [PROFESSION] with [X] years of experience. Tell your professional story, highlight achievements, and include a call-to-action",
      "Generate 10 LinkedIn post ideas for [INDUSTRY] professionals to build thought leadership. Include industry insights, personal experiences, and engagement questions",
      "Optimize my LinkedIn experience descriptions to attract recruiters for [TARGET ROLE].",
      "Create a LinkedIn networking message template for connecting with industry professionals."
    ]
  },
  {
    id: 'salary-negotiation',
    title: 'Salary Negotiation & Career Advancement',
    description: 'Master salary negotiations and career progression strategies',
    prompts: 11,
    category: 'Career & Jobs',
    isPro: true,
    examples: [
      "Help me prepare for a salary negotiation for [POSITION]. Include market research, talking points, and counter-offer strategies.",
      "Write a script for asking for a raise based on my achievements: [LIST ACHIEVEMENTS].",
      "Create a career advancement plan for the next 2 years including skills to develop and positions to target.",
      "Help me negotiate job offer terms beyond salary: benefits, PTO, remote work, professional development.",
      "Write a professional email requesting a promotion conversation with my manager.",
      "Create a performance review self-assessment highlighting my contributions and future goals.",
      "Design a 90-day plan for excelling in a new role and making a strong first impression."
    ]
  },
  {
    id: 'freelance-consulting',
    title: 'Freelancing & Consulting',
    description: 'Start and grow your freelance or consulting business',
    prompts: 13,
    category: 'Career & Jobs',
    isPro: true,
    examples: [
      "Create a freelance business plan for offering [SERVICE] to [TARGET MARKET]. Include pricing, marketing, and operations.",
      "Write client onboarding documents including contracts, questionnaires, and project scopes for [SERVICE TYPE].",
      "Design a pricing strategy for my freelance services in [INDUSTRY]. Include packages and hourly rates.",
      "Create proposal templates for different types of client projects in my field.",
      "Write professional responses to common client concerns about budget, timeline, and scope changes.",
      "Help me build a client acquisition strategy using networking, referrals, and online platforms.",
      "Create systems for managing multiple client projects and maintaining work-life balance."
    ]
  }
];