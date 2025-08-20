export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "13.0.4"
  }
  public: {
    Tables: {
      billing_reminders: {
        Row: {
          created_at: string
          email: string
          id: string
          reminder_type: string
          scheduled_at: string
          sent_at: string | null
          user_id: string | null
        }
        Insert: {
          created_at?: string
          email: string
          id?: string
          reminder_type: string
          scheduled_at: string
          sent_at?: string | null
          user_id?: string | null
        }
        Update: {
          created_at?: string
          email?: string
          id?: string
          reminder_type?: string
          scheduled_at?: string
          sent_at?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      favorites: {
        Row: {
          created_at: string
          id: string
          item_id: string
          user_id: string | null
        }
        Insert: {
          created_at?: string
          id?: string
          item_id: string
          user_id?: string | null
        }
        Update: {
          created_at?: string
          id?: string
          item_id?: string
          user_id?: string | null
        }
        Relationships: []
      }
      profiles: {
        Row: {
          bio: string | null
          country: string | null
          created_at: string
          email: string | null
          favorites: Json | null
          id: string
          name: string | null
          photo_url: string | null
          prompt_usage_history: Json | null
          resources: Json | null
          settings: Json | null
          updated_at: string
        }
        Insert: {
          bio?: string | null
          country?: string | null
          created_at?: string
          email?: string | null
          favorites?: Json | null
          id: string
          name?: string | null
          photo_url?: string | null
          prompt_usage_history?: Json | null
          resources?: Json | null
          settings?: Json | null
          updated_at?: string
        }
        Update: {
          bio?: string | null
          country?: string | null
          created_at?: string
          email?: string | null
          favorites?: Json | null
          id?: string
          name?: string | null
          photo_url?: string | null
          prompt_usage_history?: Json | null
          resources?: Json | null
          settings?: Json | null
          updated_at?: string
        }
        Relationships: []
      }
      prompt_credits: {
        Row: {
          credit_balance: number
          id: string
          updated_at: string
          usage_period: string
          user_id: string | null
        }
        Insert: {
          credit_balance?: number
          id?: string
          updated_at?: string
          usage_period: string
          user_id?: string | null
        }
        Update: {
          credit_balance?: number
          id?: string
          updated_at?: string
          usage_period?: string
          user_id?: string | null
        }
        Relationships: []
      }
      prompt_usage: {
        Row: {
          category: string
          created_at: string
          id: string
          last_used: string | null
          prompt_count: number
          updated_at: string
          usage_period: string
          user_id: string | null
        }
        Insert: {
          category: string
          created_at?: string
          id?: string
          last_used?: string | null
          prompt_count?: number
          updated_at?: string
          usage_period: string
          user_id?: string | null
        }
        Update: {
          category?: string
          created_at?: string
          id?: string
          last_used?: string | null
          prompt_count?: number
          updated_at?: string
          usage_period?: string
          user_id?: string | null
        }
        Relationships: []
      }
      review_votes: {
        Row: {
          created_at: string
          id: string
          is_helpful: boolean
          review_id: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          is_helpful: boolean
          review_id: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          is_helpful?: boolean
          review_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "review_votes_review_id_fkey"
            columns: ["review_id"]
            isOneToOne: false
            referencedRelation: "reviews"
            referencedColumns: ["id"]
          },
        ]
      }
      reviews: {
        Row: {
          content: string | null
          created_at: string
          helpful_count: number | null
          id: string
          rating: number
          title: string | null
          tool_id: string
          updated_at: string
          user_id: string
        }
        Insert: {
          content?: string | null
          created_at?: string
          helpful_count?: number | null
          id?: string
          rating: number
          title?: string | null
          tool_id: string
          updated_at?: string
          user_id: string
        }
        Update: {
          content?: string | null
          created_at?: string
          helpful_count?: number | null
          id?: string
          rating?: number
          title?: string | null
          tool_id?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      subscribers: {
        Row: {
          email: string
          expires_at: string | null
          id: string
          last_payment_ref: string | null
          plan: string | null
          premium_badge: boolean | null
          pro_enabled: boolean
          provider_customer_id: string | null
          started_at: string
          subscription_ends_at: string | null
          subscription_started_at: string | null
          subscription_status: string | null
          subscription_tier: string | null
          trial_expiration: string | null
          trial_start: string | null
          trial_used: boolean
          updated_at: string
          user_id: string | null
        }
        Insert: {
          email: string
          expires_at?: string | null
          id?: string
          last_payment_ref?: string | null
          plan?: string | null
          premium_badge?: boolean | null
          pro_enabled?: boolean
          provider_customer_id?: string | null
          started_at?: string
          subscription_ends_at?: string | null
          subscription_started_at?: string | null
          subscription_status?: string | null
          subscription_tier?: string | null
          trial_expiration?: string | null
          trial_start?: string | null
          trial_used?: boolean
          updated_at?: string
          user_id?: string | null
        }
        Update: {
          email?: string
          expires_at?: string | null
          id?: string
          last_payment_ref?: string | null
          plan?: string | null
          premium_badge?: boolean | null
          pro_enabled?: boolean
          provider_customer_id?: string | null
          started_at?: string
          subscription_ends_at?: string | null
          subscription_started_at?: string | null
          subscription_status?: string | null
          subscription_tier?: string | null
          trial_expiration?: string | null
          trial_start?: string | null
          trial_used?: boolean
          updated_at?: string
          user_id?: string | null
        }
        Relationships: []
      }
      tool_analytics: {
        Row: {
          category: string
          click_count: number
          created_at: string
          id: string
          last_clicked: string | null
          tool_id: string
          updated_at: string
        }
        Insert: {
          category: string
          click_count?: number
          created_at?: string
          id?: string
          last_clicked?: string | null
          tool_id: string
          updated_at?: string
        }
        Update: {
          category?: string
          click_count?: number
          created_at?: string
          id?: string
          last_clicked?: string | null
          tool_id?: string
          updated_at?: string
        }
        Relationships: []
      }
      user_plan: {
        Row: {
          created_at: string
          id: string
          plan_type: string
          trial_end: string | null
          trial_start: string | null
          updated_at: string
          upgraded_at: string | null
          user_id: string | null
        }
        Insert: {
          created_at?: string
          id?: string
          plan_type?: string
          trial_end?: string | null
          trial_start?: string | null
          updated_at?: string
          upgraded_at?: string | null
          user_id?: string | null
        }
        Update: {
          created_at?: string
          id?: string
          plan_type?: string
          trial_end?: string | null
          trial_start?: string | null
          updated_at?: string
          upgraded_at?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      webhook_events: {
        Row: {
          created_at: string
          event_type: string
          id: string
          processed: boolean | null
          processed_at: string | null
          provider: string
          provider_event_id: string
          raw_payload: Json
        }
        Insert: {
          created_at?: string
          event_type: string
          id?: string
          processed?: boolean | null
          processed_at?: string | null
          provider: string
          provider_event_id: string
          raw_payload: Json
        }
        Update: {
          created_at?: string
          event_type?: string
          id?: string
          processed?: boolean | null
          processed_at?: string | null
          provider?: string
          provider_event_id?: string
          raw_payload?: Json
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
