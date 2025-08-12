
import { AITool, PromptPack } from './aiTools';
import {
  schoolAITools,
  contentAITools,
  businessAITools,
  careerAITools,
  pdfAITools
} from './aiTools';
import {
  uniqueSchoolAITools,
  uniqueContentAITools,
  uniqueBusinessAITools,
  uniqueCareerAITools
} from './uniqueAIToolsCollection';
import {
  enhancedSchoolPromptPacks,
  contentPromptPacks, 
  businessPromptPacks,
  careerPromptPacks
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
        aiTools: uniqueSchoolAITools,
        promptPacks: enhancedSchoolPromptPacks
      },
      content: {
        aiTools: uniqueContentAITools,
        promptPacks: contentPromptPacks
      },
      business: {
        aiTools: uniqueBusinessAITools,
        promptPacks: businessPromptPacks
      },
      career: {
        aiTools: uniqueCareerAITools,
        promptPacks: careerPromptPacks
      },
      pdf: {
        aiTools: pdfAITools,
        promptPacks: [] // PDF prompts can be added later if needed
      }
    };
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
