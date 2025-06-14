
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

// Re-export content, business, and career prompt packs from original file
export { contentPromptPacks, businessPromptPacks, careerPromptPacks } from './promptPacks';
