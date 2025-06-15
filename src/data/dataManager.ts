import { AITool, PromptPack } from './aiTools';
import {
  schoolAITools,
  contentAITools,
  businessAITools,
  careerAITools
} from './aiTools';
import {
  expandedSchoolAITools,
  expandedContentAITools,
  expandedBusinessAITools,
  expandedCareerAITools
} from './expandedAIToolsCollection';
import {
  enhancedSchoolPromptPacks,
  contentPromptPacks, 
  businessPromptPacks,
  careerPromptPacks
} from './expandedPromptPacks';

export type CategoryType = 'school' | 'content' | 'business' | 'career';

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
        promptPacks: contentPromptPacks
      },
      business: {
        aiTools: [...businessAITools, ...expandedBusinessAITools],
        promptPacks: businessPromptPacks
      },
      career: {
        aiTools: [...careerAITools, ...expandedCareerAITools],
        promptPacks: careerPromptPacks
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
