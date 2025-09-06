import React, { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Copy, Sparkles, Wand2, Infinity, Crown } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { AiToUsePromptResponse } from '@/types/promptRefinery';
import { usePromptRefinery } from '@/hooks/usePromptRefinery';
import { Link } from 'react-router-dom';

interface PromptRefineryForm {
  user_thought: string;
  category: string;
  goal?: string;
  audience?: string;
  tone?: string;
  language: string;
  length_preference?: string;
  must_include?: string;
  must_avoid?: string;
  output_format?: string;
  brand_voice?: string;
  tools_or_context?: string;
}

const categoryDefaults = {
  'School & Education': {
    tone: 'clear & supportive',
    audience: 'teacher/exam',
    output_format: 'step-by-step/bullets'
  },
  'Business & Work': {
    tone: 'professional & concise',
    audience: 'client/manager',
    output_format: 'structured bullets'
  },
  'Content Creation': {
    tone: 'engaging & human',
    audience: 'platform-specific (YouTube/IG/TikTok)',
    output_format: 'script outline or caption structure'
  },
  'Career & Jobs': {
    tone: 'confident & specific',
    audience: 'recruiter/hiring manager',
    output_format: 'ATS-friendly bullets or sections'
  }
};

export default function PromptRefinery() {
  const { toast } = useToast();
  const { 
    isPaidPro, 
    isUnlimited, 
    remaining, 
    limit, 
    allowed,
    loading: creditsLoading,
    useCredit
  } = usePromptRefinery();
  
  const [formData, setFormData] = useState<PromptRefineryForm>({
    user_thought: '',
    category: '',
    language: 'English'
  });
  const [result, setResult] = useState<AiToUsePromptResponse | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);

  const handleInputChange = (field: keyof PromptRefineryForm, value: string) => {
    setFormData(prev => {
      const updated = { ...prev, [field]: value };
      
      // Apply category defaults when category changes
      if (field === 'category' && value && categoryDefaults[value as keyof typeof categoryDefaults]) {
        const defaults = categoryDefaults[value as keyof typeof categoryDefaults];
        return {
          ...updated,
          tone: updated.tone || defaults.tone,
          audience: updated.audience || defaults.audience,
          output_format: updated.output_format || defaults.output_format
        };
      }
      
      return updated;
    });
  };

  const generateRefinedPrompts = async () => {
    if (!formData.user_thought.trim() || !formData.category) {
      toast({
        title: "Missing Information",
        description: "Please provide your thought and select a category.",
        variant: "destructive"
      });
      return;
    }
    
    // Check credits for non-paid users
    if (!isPaidPro) {
      if (!allowed) {
        toast({
          title: "Daily Limit Reached",
          description: `You've used ${limit} prompts today. Upgrade to PRO for unlimited access!`,
          variant: "destructive"
        });
        return;
      }
      
      // Use a credit
      const success = await useCredit();
      if (!success) return;
    }

    setIsGenerating(true);
    
    try {
      // Simulate prompt generation logic
      const assumptions = generateAssumptions(formData);
      const primaryPrompt = generatePrimaryPrompt(formData);
      const alternatePrompts = generateAlternatePrompts(formData);

      setResult({
        assumptions,
        primary_prompt: primaryPrompt,
        alternate_prompts: alternatePrompts
      });
    } catch (error) {
      toast({
        title: "Generation Failed",
        description: "Failed to generate refined prompts. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const generateAssumptions = (data: PromptRefineryForm): string => {
    const assumptions = [];
    const defaults = categoryDefaults[data.category as keyof typeof categoryDefaults];
    
    if (!data.tone && defaults?.tone) {
      assumptions.push(`• Used default tone: ${defaults.tone}`);
    }
    if (!data.audience && defaults?.audience) {
      assumptions.push(`• Targeted default audience: ${defaults.audience}`);
    }
    if (!data.output_format && defaults?.output_format) {
      assumptions.push(`• Applied default format: ${defaults.output_format}`);
    }
    
    return assumptions.join('\n') || '• No assumptions needed - all key details provided.';
  };

  const generatePrimaryPrompt = (data: PromptRefineryForm): AiToUsePromptResponse['primary_prompt'] => {
    const defaults = categoryDefaults[data.category as keyof typeof categoryDefaults];
    const tone = data.tone || defaults?.tone || 'professional';
    const audience = data.audience || defaults?.audience || 'general audience';
    const outputFormat = data.output_format || defaults?.output_format || 'structured response';

    let roleInstruction = '';
    let objective = '';
    let context = '';
    let constraints = '';
    let format = '';

    switch (data.category) {
      case 'School & Education':
        roleInstruction = 'You are an expert educator and learning specialist';
        objective = `help ${audience} understand and apply the concept`;
        context = `Focus on educational clarity and practical learning outcomes`;
        break;
      case 'Business & Work':
        roleInstruction = 'You are a business strategy consultant and professional advisor';
        objective = `provide actionable business insights for ${audience}`;
        context = `Consider professional environments and business objectives`;
        break;
      case 'Content Creation':
        roleInstruction = 'You are a creative content strategist and scriptwriter';
        objective = `create engaging content for ${audience}`;
        context = `Focus on platform-specific best practices and audience engagement`;
        break;
      case 'Career & Jobs':
        roleInstruction = 'You are a career development expert and recruiter';
        objective = `optimize career positioning for ${audience}`;
        context = `Consider ATS systems, industry standards, and professional branding`;
        break;
      default:
        roleInstruction = 'You are an expert assistant';
        objective = 'provide helpful guidance';
        context = 'Consider the user\'s specific needs and context';
    }

    const prompt = `${roleInstruction} specializing in ${data.category.toLowerCase()}. Your objective is to ${objective} regarding: "${data.user_thought}"

CONTEXT:
- Category: ${data.category}
- Target audience: ${audience}
- Language: ${data.language}
${data.tools_or_context ? `- Tools/Context: ${data.tools_or_context}` : ''}
${data.goal ? `- Specific goal: ${data.goal}` : ''}

CONSTRAINTS:
- Tone: ${tone}
${data.length_preference ? `- Length: ${data.length_preference}` : ''}
${data.must_include ? `- Must include: ${data.must_include}` : ''}
${data.must_avoid ? `- Must avoid: ${data.must_avoid}` : ''}
${data.brand_voice ? `- Brand voice: ${data.brand_voice}` : ''}

OUTPUT FORMAT:
${outputFormat}

QUALITY GUARDRAILS:
- Provide factual, non-plagiarized content
- Use clear, accessible language
- Avoid filler words and robotic phrasing
- Ensure content is safe and appropriate
${data.category === 'Content Creation' ? '- Be naturally engaging without using words like "boom" or "vibes"' : ''}
${data.category === 'Career & Jobs' ? '- Include measurable results and role-specific keywords where relevant' : ''}

${context}`;

    return {
      title: `${data.category} Prompt for ${data.user_thought.substring(0, 30)}...`,
      prompt,
      notes: generateNotes(data)
    };
  };

  const generateAlternatePrompts = (data: PromptRefineryForm): AiToUsePromptResponse['alternate_prompts'] => {
    const baseThought = data.user_thought;
    
    return [
      {
        title: "Simplified Approach",
        prompt: `Create a simple, step-by-step guide for: "${baseThought}". Use clear language, practical examples, and actionable steps. Format as numbered list with brief explanations.`
      },
      {
        title: "Advanced Deep-dive",
        prompt: `Provide an expert-level analysis of: "${baseThought}". Include background context, advanced techniques, potential challenges, and strategic recommendations. Format as detailed sections with subheadings.`
      }
    ];
  };

  const generateNotes = (data: PromptRefineryForm): string => {
    const notes = [];
    
    if (data.category === 'Content Creation') {
      notes.push('• Focus on natural, engaging language');
      notes.push('• Avoid overused social media phrases');
    }
    
    if (data.category === 'Career & Jobs') {
      notes.push('• Optimize for ATS scanning');
      notes.push('• Include quantifiable achievements');
    }
    
    if (data.must_include) {
      notes.push(`• Ensure "${data.must_include}" appears naturally`);
    }
    
    return notes.join('\n');
  };

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      toast({
        title: "Copied!",
        description: "Prompt copied to clipboard",
      });
    } catch (error) {
      toast({
        title: "Copy Failed",
        description: "Please copy manually",
        variant: "destructive"
      });
    }
  };

  return (
    <>
      <Helmet>
        <title>Prompt Refinery - Transform Ideas into Perfect Prompts | AiToUse</title>
        <meta name="description" content="Transform your raw ideas into precise, context-rich prompts that generate better AI results. Specialized for education, business, content creation, and career development." />
        <meta name="keywords" content="prompt engineering, AI prompts, prompt optimization, AI tools, content creation, business prompts" />
      </Helmet>

      <div className="min-h-screen bg-gradient-to-br from-background via-background/95 to-primary/5">
        <div className="container mx-auto px-4 py-8">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center gap-4 flex-wrap justify-center mb-4">
              <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full text-sm font-medium">
                <Sparkles className="h-4 w-4" />
                Prompt Refinery
              </div>
              {isPaidPro ? (
                <Badge variant="secondary" className="bg-gradient-to-r from-amber-500 to-amber-600 text-white border-0 px-4 py-2">
                  <Infinity className="w-4 h-4 mr-1" />
                  PRO • Unlimited Access
                </Badge>
              ) : (
                !creditsLoading && (
                  <Badge variant="outline" className="px-4 py-2">
                    {remaining}/{limit} daily prompts
                  </Badge>
                )
              )}
            </div>
            <h1 className="text-4xl font-bold text-foreground mb-4">
              Transform Ideas into Perfect Prompts
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Turn your raw thoughts into precise, context-rich prompts that generate better AI results
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-8 max-w-7xl mx-auto">
            {/* Input Form */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Wand2 className="h-5 w-5" />
                  Prompt Builder
                </CardTitle>
                <CardDescription>
                  Provide your raw idea and context to generate refined prompts
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Core Inputs */}
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="user_thought">Your Raw Idea *</Label>
                    <Textarea
                      id="user_thought"
                      placeholder="e.g., I want a TikTok explaining why students should use Notion"
                      value={formData.user_thought}
                      onChange={(e) => handleInputChange('user_thought', e.target.value)}
                      className="min-h-[100px]"
                    />
                  </div>

                  <div>
                    <Label htmlFor="category">Category *</Label>
                    <Select value={formData.category} onValueChange={(value) => handleInputChange('category', value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="School & Education">School & Education</SelectItem>
                        <SelectItem value="Business & Work">Business & Work</SelectItem>
                        <SelectItem value="Content Creation">Content Creation</SelectItem>
                        <SelectItem value="Career & Jobs">Career & Jobs</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {/* Optional Inputs */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="goal">Goal</Label>
                    <Input
                      id="goal"
                      placeholder="e.g., Increase app adoption"
                      value={formData.goal || ''}
                      onChange={(e) => handleInputChange('goal', e.target.value)}
                    />
                  </div>

                  <div>
                    <Label htmlFor="audience">Audience</Label>
                    <Input
                      id="audience"
                      placeholder={formData.category ? categoryDefaults[formData.category as keyof typeof categoryDefaults]?.audience : "e.g., students on TikTok"}
                      value={formData.audience || ''}
                      onChange={(e) => handleInputChange('audience', e.target.value)}
                    />
                  </div>

                  <div>
                    <Label htmlFor="tone">Tone</Label>
                    <Input
                      id="tone"
                      placeholder={formData.category ? categoryDefaults[formData.category as keyof typeof categoryDefaults]?.tone : "e.g., fun and witty"}
                      value={formData.tone || ''}
                      onChange={(e) => handleInputChange('tone', e.target.value)}
                    />
                  </div>

                  <div>
                    <Label htmlFor="length_preference">Length</Label>
                    <Select value={formData.length_preference || ''} onValueChange={(value) => handleInputChange('length_preference', value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select length" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="short">Short</SelectItem>
                        <SelectItem value="medium">Medium</SelectItem>
                        <SelectItem value="long">Long</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="must_include">Must Include</Label>
                    <Input
                      id="must_include"
                      placeholder="Keywords that must appear"
                      value={formData.must_include || ''}
                      onChange={(e) => handleInputChange('must_include', e.target.value)}
                    />
                  </div>

                  <div>
                    <Label htmlFor="must_avoid">Must Avoid</Label>
                    <Input
                      id="must_avoid"
                      placeholder="Words/phrases to avoid"
                      value={formData.must_avoid || ''}
                      onChange={(e) => handleInputChange('must_avoid', e.target.value)}
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="output_format">Output Format</Label>
                  <Input
                    id="output_format"
                    placeholder={formData.category ? categoryDefaults[formData.category as keyof typeof categoryDefaults]?.output_format : "e.g., script outline"}
                    value={formData.output_format || ''}
                    onChange={(e) => handleInputChange('output_format', e.target.value)}
                  />
                </div>

                {formData.category === 'Content Creation' && (
                  <div>
                    <Label htmlFor="brand_voice">Brand Voice</Label>
                    <Input
                      id="brand_voice"
                      placeholder="e.g., friendly tech brand"
                      value={formData.brand_voice || ''}
                      onChange={(e) => handleInputChange('brand_voice', e.target.value)}
                    />
                  </div>
                )}

                <div>
                  <Label htmlFor="tools_or_context">Tools/Context</Label>
                  <Input
                    id="tools_or_context"
                    placeholder="e.g., Notion, data points, platform"
                    value={formData.tools_or_context || ''}
                    onChange={(e) => handleInputChange('tools_or_context', e.target.value)}
                  />
                </div>

                <Button 
                  onClick={generateRefinedPrompts} 
                  disabled={isGenerating || !formData.user_thought.trim() || !formData.category}
                  className="w-full"
                >
                  {isGenerating ? 'Generating...' : 'Generate Refined Prompts'}
                </Button>
              </CardContent>
            </Card>

            {/* Results */}
            <div className="space-y-6">
              {result && (
                <>
                  {/* Assumptions */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">Assumptions Made</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-muted-foreground whitespace-pre-line">{result.assumptions}</p>
                    </CardContent>
                  </Card>

                  {/* Primary Prompt */}
                  <Card>
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <div>
                          <CardTitle className="text-lg">{result.primary_prompt.title}</CardTitle>
                          <Badge variant="default" className="mt-1">Primary Prompt</Badge>
                        </div>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => copyToClipboard(result.primary_prompt.prompt)}
                        >
                          <Copy className="h-4 w-4" />
                        </Button>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="bg-muted p-4 rounded-lg">
                        <pre className="text-sm whitespace-pre-wrap font-mono">{result.primary_prompt.prompt}</pre>
                      </div>
                      {result.primary_prompt.notes && (
                        <div className="mt-4">
                          <Label className="text-sm font-medium">Execution Notes:</Label>
                          <p className="text-sm text-muted-foreground mt-1 whitespace-pre-line">{result.primary_prompt.notes}</p>
                        </div>
                      )}
                    </CardContent>
                  </Card>

                  {/* Alternate Prompts */}
                  {result.alternate_prompts.map((alt, index) => (
                    <Card key={index}>
                      <CardHeader>
                        <div className="flex items-center justify-between">
                          <div>
                            <CardTitle className="text-lg">{alt.title}</CardTitle>
                            <Badge variant="secondary" className="mt-1">Alternative #{index + 1}</Badge>
                          </div>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => copyToClipboard(alt.prompt)}
                          >
                            <Copy className="h-4 w-4" />
                          </Button>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <div className="bg-muted p-4 rounded-lg">
                          <pre className="text-sm whitespace-pre-wrap font-mono">{alt.prompt}</pre>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </>
              )}

              {!result && (
                <Card>
                  <CardContent className="py-12 text-center">
                    <Sparkles className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <p className="text-muted-foreground">
                      Fill out the form and generate your refined prompts to see results here
                    </p>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
      </div>
    </div>
  </>
  );
}