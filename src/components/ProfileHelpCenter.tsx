
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { HelpCircle } from "lucide-react";

const ProfileHelpCenter = () => {
  const faqs = [
    {
      question: "How do I use prompts in the app?",
      answer: "Each category (School & Education, Business & Work, Content Creation, Career & Jobs) includes curated prompts tailored to everyday needs. Just tap on a prompt, copy it, and paste it into your favorite AI tool (e.g., ChatGPT, Gemini, Claude). You can also customize the [placeholders] for best results."
    },
    {
      question: "Where do I paste these prompts?",
      answer: "These prompts are designed to be used in any AI writing tool or chatbot. Simply open ChatGPT, Gemini, Claude, or any preferred platform, paste your chosen prompt, and let the AI do the work."
    },
    {
      question: "What if I don't understand a prompt or need help customizing it?",
      answer: "Tap the info icon or \"Help\" button beneath any prompt for tips on how to fill it out or where to use it. We've added examples for common use cases."
    },
    {
      question: "Are these prompts beginner-friendly?",
      answer: "Absolutely. Every prompt is written in simple, clear language and includes guidance or examples where necessary. No prior AI experience required."
    },
    {
      question: "Will the prompt packs get updated?",
      answer: "Yes. The app will regularly receive updates to reflect new trends, seasonal needs, and user feedback. You'll be notified when new prompts are available in any category."
    },
    {
      question: "Can I save my favorite prompts?",
      answer: "Yes! Just tap the bookmark icon beside any prompt to add it to your 'Favorites' list in your profile for quick reuse."
    },
    {
      question: "Is this app only for professionals?",
      answer: "Nope — AiToUse was built for everyone! Whether you're a student, freelancer, employee, content creator, or job seeker, there's a prompt pack for you."
    },
    {
      question: "How do I report an issue or request a new feature?",
      answer: "Head to the Profile tab and tap 'Support'. You can send feedback, report bugs, or request new prompt categories anytime."
    }
  ];

  return (
    <Card className="w-full animate-fade-in">
      <CardHeader>
        <CardTitle className="text-xl font-bold flex items-center gap-2">
          <HelpCircle className="w-5 h-5" />
          Help Center: AiToUse App FAQ
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Accordion type="single" collapsible className="w-full">
          {faqs.map((faq, index) => (
            <AccordionItem key={index} value={`item-${index}`}>
              <AccordionTrigger className="text-left">
                Q{index + 1}. {faq.question}
              </AccordionTrigger>
              <AccordionContent className="text-slate-600">
                {faq.answer}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </CardContent>
    </Card>
  );
};

export default ProfileHelpCenter;
