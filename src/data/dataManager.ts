
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
import expandedDirectory from './expandedAIDirectory.json';

export type CategoryType = 'school' | 'content' | 'business' | 'career' | 'pdf';

export interface CategoryData {
  aiTools: AITool[];
  promptPacks: PromptPack[];
}

export class DataManager {
  private static instance: DataManager;
  private data: Record<CategoryType, CategoryData>;

  private constructor() {
    // Base data from curated lists
    const baseData: Record<CategoryType, CategoryData> = {
      school: { aiTools: uniqueSchoolAITools, promptPacks: enhancedSchoolPromptPacks },
      content: { aiTools: uniqueContentAITools, promptPacks: contentPromptPacks },
      business: { aiTools: uniqueBusinessAITools, promptPacks: businessPromptPacks },
      career: { aiTools: uniqueCareerAITools, promptPacks: careerPromptPacks },
      pdf: { aiTools: pdfAITools, promptPacks: [] }
    };

    // Merge in expanded directory (if present)
    try {
      const directory: any = (expandedDirectory as any);
      const mapDirToType: Record<string, CategoryType> = {
        'School & Education': 'school',
        'Content Creation': 'content',
        'Business & Work': 'business',
        'Career & Jobs': 'career'
      };

      const toAITool = (t: any, dirLabel: string): AITool => {
        let hostname = '';
        try { hostname = new URL(t.url).hostname.replace(/^www\./, ''); } catch { hostname = t.name?.toLowerCase().replace(/\s+/g, '-'); }
        const features: string[] = Array.isArray(t.notable_features) && t.notable_features.length
          ? t.notable_features
          : (Array.isArray(t.tags) ? t.tags : []);
        const pricing: string = t.pricing || 'Freemium';
        const freeOffering: AITool['freeOffering'] =
          pricing === 'Free' ? 'free' :
          pricing === 'Freemium' ? 'freemium' :
          (t.free_tier ? 'free_trial' : 'free_trial');
        const freeDetails = t.free_tier ? 'Free tier available' : 'Trial available';
        return {
          id: hostname,
          name: t.name,
          category: dirLabel,
          description: t.one_liner || '',
          rating: 4.4,
          users: '—',
          isPro: pricing === 'Paid' || pricing === 'Contact Sales',
          url: t.url,
          features,
          freeOffering,
          freeDetails
        };
      };

      const dedupe = (arr: AITool[]) => {
        const seenHost = new Set<string>();
        const seenName = new Set<string>();
        return arr.filter(item => {
          let host = '';
          try { host = new URL(item.url).hostname.replace(/^www\./, ''); } catch {}
          const nameKey = item.name.trim().toLowerCase();
          if (host && seenHost.has(host)) return false;
          if (seenName.has(nameKey)) return false;
          if (host) seenHost.add(host);
          seenName.add(nameKey);
          return true;
        });
      };

      const extrasByType: Record<CategoryType, AITool[]> = { school: [], content: [], business: [], career: [], pdf: [] };
      if (directory?.categories) {
        for (const c of directory.categories as any[]) {
          const type = mapDirToType[c.category as string];
          if (!type) continue;
          const dirLabel = c.category as string;
          const extra = (c.tools || []).map((tool: any) => toAITool(tool, dirLabel));
          extrasByType[type].push(...extra);
        }
      }

      this.data = {
        school: { aiTools: dedupe([...(baseData.school.aiTools), ...extrasByType.school]), promptPacks: baseData.school.promptPacks },
        content: { aiTools: dedupe([...(baseData.content.aiTools), ...extrasByType.content]), promptPacks: baseData.content.promptPacks },
        business: { aiTools: dedupe([...(baseData.business.aiTools), ...extrasByType.business]), promptPacks: baseData.business.promptPacks },
        career: { aiTools: dedupe([...(baseData.career.aiTools), ...extrasByType.career]), promptPacks: baseData.career.promptPacks },
        pdf: baseData.pdf
      };
    } catch (e) {
      this.data = baseData;
    }
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
