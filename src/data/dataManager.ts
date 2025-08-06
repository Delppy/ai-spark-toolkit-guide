
import { AITool, PromptPack } from './aiTools';
import {
  schoolAITools,
  contentAITools,
  businessAITools,
  careerAITools,
  pdfAITools
} from './aiTools';
import {
  expandedSchoolAITools,
  expandedContentAITools,
  expandedBusinessAITools,
  expandedCareerAITools
} from './expandedAIToolsCollection';
import {
  enhancedSchoolPromptPacks,
  contentPromptPacks as expandedContentPromptPacks, 
  businessPromptPacks as expandedBusinessPromptPacks,
  careerPromptPacks as expandedCareerPromptPacks
} from './expandedPromptPacks';

export type CategoryType = 'school' | 'content' | 'business' | 'career' | 'pdf';

export interface CategoryData {
  aiTools: AITool[];
  promptPacks: PromptPack[];
}

export class DataManager {
  private static instance: DataManager;
  private data: Record<CategoryType, CategoryData>;

  private constructor() {
    this.data = {
      school: {
        aiTools: [...schoolAITools, ...expandedSchoolAITools],
        promptPacks: enhancedSchoolPromptPacks
      },
      content: {
        aiTools: [...contentAITools, ...expandedContentAITools],
        promptPacks: expandedContentPromptPacks
      },
      business: {
        aiTools: [...businessAITools, ...expandedBusinessAITools],
        promptPacks: expandedBusinessPromptPacks
      },
      career: {
        aiTools: [...careerAITools, ...expandedCareerAITools],
        promptPacks: expandedCareerPromptPacks
      },
      pdf: {
        aiTools: pdfAITools,
        promptPacks: [] // PDF prompts can be added later if needed
      }
    };
    
    // Debug logging to check data
    console.log('🔧 DataManager initialized with categories:');
    console.log('📚 School prompt packs:', this.data.school.promptPacks.length);
    console.log('🎨 Content prompt packs:', this.data.content.promptPacks.length);
    console.log('💼 Business prompt packs:', this.data.business.promptPacks.length);
    console.log('🚀 Career prompt packs:', this.data.career.promptPacks.length);
    
    // Check if we're getting unique data
    console.log('📚 School pack titles:', this.data.school.promptPacks.map(p => p.title));
    console.log('🎨 Content pack titles:', this.data.content.promptPacks.map(p => p.title));
  }

  public static getInstance(): DataManager {
    if (!DataManager.instance) {
      DataManager.instance = new DataManager();
    }
    return DataManager.instance;
  }

  public getCategoryData(category: CategoryType): CategoryData {
    return this.data[category];
  }

  public getAllAITools(): AITool[] {
    return Object.values(this.data).flatMap(categoryData => categoryData.aiTools);
  }

  public getAllPromptPacks(): PromptPack[] {
    return Object.values(this.data).flatMap(categoryData => categoryData.promptPacks);
  }

  public searchAITools(query: string, category?: CategoryType): AITool[] {
    const tools = category ? this.data[category].aiTools : this.getAllAITools();
    const lowercaseQuery = query.toLowerCase();
    
    return tools.filter(tool =>
      tool.name.toLowerCase().includes(lowercaseQuery) ||
      tool.category.toLowerCase().includes(lowercaseQuery) ||
      tool.description.toLowerCase().includes(lowercaseQuery) ||
      tool.features.some(feature => feature.toLowerCase().includes(lowercaseQuery))
    );
  }

  public getToolsByFreeOffering(offering: AITool['freeOffering'], category?: CategoryType): AITool[] {
    const tools = category ? this.data[category].aiTools : this.getAllAITools();
    return tools.filter(tool => tool.freeOffering === offering);
  }

  public getFreeTools(category?: CategoryType): AITool[] {
    return this.getToolsByFreeOffering('free', category);
  }

  public getTrialTools(category?: CategoryType): AITool[] {
    return this.getToolsByFreeOffering('free_trial', category);
  }

  public getCreditTools(category?: CategoryType): AITool[] {
    return this.getToolsByFreeOffering('free_credits', category);
  }

  public getFreemiumTools(category?: CategoryType): AITool[] {
    return this.getToolsByFreeOffering('freemium', category);
  }
}

export const dataManager = DataManager.getInstance();
