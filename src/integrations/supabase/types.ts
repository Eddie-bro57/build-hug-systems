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
    PostgrestVersion: "14.5"
  }
  public: {
    Tables: {
      achievements: {
        Row: {
          code: string
          created_at: string
          description: string
          icon: string
          id: string
          kind: string
          threshold: number
          title: string
          xp_reward: number
        }
        Insert: {
          code: string
          created_at?: string
          description: string
          icon?: string
          id?: string
          kind?: string
          threshold?: number
          title: string
          xp_reward?: number
        }
        Update: {
          code?: string
          created_at?: string
          description?: string
          icon?: string
          id?: string
          kind?: string
          threshold?: number
          title?: string
          xp_reward?: number
        }
        Relationships: []
      }
      challenges: {
        Row: {
          active_on: string
          category: string
          created_at: string
          description: string
          guide_id: string | null
          id: string
          title: string
        }
        Insert: {
          active_on?: string
          category: string
          created_at?: string
          description: string
          guide_id?: string | null
          id?: string
          title: string
        }
        Update: {
          active_on?: string
          category?: string
          created_at?: string
          description?: string
          guide_id?: string | null
          id?: string
          title?: string
        }
        Relationships: [
          {
            foreignKeyName: "challenges_guide_id_fkey"
            columns: ["guide_id"]
            isOneToOne: false
            referencedRelation: "guides"
            referencedColumns: ["id"]
          },
        ]
      }
      comment_votes: {
        Row: {
          comment_id: string
          created_at: string
          user_id: string
        }
        Insert: {
          comment_id: string
          created_at?: string
          user_id: string
        }
        Update: {
          comment_id?: string
          created_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "comment_votes_comment_id_fkey"
            columns: ["comment_id"]
            isOneToOne: false
            referencedRelation: "comments"
            referencedColumns: ["id"]
          },
        ]
      }
      comments: {
        Row: {
          body: string
          created_at: string
          guide_id: string
          id: string
          parent_id: string | null
          updated_at: string
          upvotes: number
          user_id: string
        }
        Insert: {
          body: string
          created_at?: string
          guide_id: string
          id?: string
          parent_id?: string | null
          updated_at?: string
          upvotes?: number
          user_id: string
        }
        Update: {
          body?: string
          created_at?: string
          guide_id?: string
          id?: string
          parent_id?: string | null
          updated_at?: string
          upvotes?: number
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "comments_guide_id_fkey"
            columns: ["guide_id"]
            isOneToOne: false
            referencedRelation: "guides"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "comments_parent_id_fkey"
            columns: ["parent_id"]
            isOneToOne: false
            referencedRelation: "comments"
            referencedColumns: ["id"]
          },
        ]
      }
      guide_progress: {
        Row: {
          completed_at: string | null
          completed_steps: Json
          created_at: string
          guide_id: string
          id: string
          is_completed: boolean
          updated_at: string
          user_id: string
        }
        Insert: {
          completed_at?: string | null
          completed_steps?: Json
          created_at?: string
          guide_id: string
          id?: string
          is_completed?: boolean
          updated_at?: string
          user_id: string
        }
        Update: {
          completed_at?: string | null
          completed_steps?: Json
          created_at?: string
          guide_id?: string
          id?: string
          is_completed?: boolean
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "guide_progress_guide_id_fkey"
            columns: ["guide_id"]
            isOneToOne: false
            referencedRelation: "guides"
            referencedColumns: ["id"]
          },
        ]
      }
      guide_votes: {
        Row: {
          created_at: string
          guide_id: string
          user_id: string
        }
        Insert: {
          created_at?: string
          guide_id: string
          user_id: string
        }
        Update: {
          created_at?: string
          guide_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "guide_votes_guide_id_fkey"
            columns: ["guide_id"]
            isOneToOne: false
            referencedRelation: "guides"
            referencedColumns: ["id"]
          },
        ]
      }
      guides: {
        Row: {
          author_id: string | null
          category: string
          created_at: string
          difficulty: string
          hero_image: string | null
          id: string
          is_published: boolean
          materials: Json
          slug: string
          steps: Json
          summary: string
          time_minutes: number
          tips: Json
          title: string
          updated_at: string
          video_query: string | null
          views: number
        }
        Insert: {
          author_id?: string | null
          category: string
          created_at?: string
          difficulty?: string
          hero_image?: string | null
          id?: string
          is_published?: boolean
          materials?: Json
          slug: string
          steps?: Json
          summary: string
          time_minutes?: number
          tips?: Json
          title: string
          updated_at?: string
          video_query?: string | null
          views?: number
        }
        Update: {
          author_id?: string | null
          category?: string
          created_at?: string
          difficulty?: string
          hero_image?: string | null
          id?: string
          is_published?: boolean
          materials?: Json
          slug?: string
          steps?: Json
          summary?: string
          time_minutes?: number
          tips?: Json
          title?: string
          updated_at?: string
          video_query?: string | null
          views?: number
        }
        Relationships: []
      }
      learning_paths: {
        Row: {
          category: string
          created_at: string
          creator_id: string | null
          description: string
          guide_ids: Json
          hero_image: string | null
          id: string
          is_published: boolean
          slug: string
          title: string
          updated_at: string
        }
        Insert: {
          category: string
          created_at?: string
          creator_id?: string | null
          description: string
          guide_ids?: Json
          hero_image?: string | null
          id?: string
          is_published?: boolean
          slug: string
          title: string
          updated_at?: string
        }
        Update: {
          category?: string
          created_at?: string
          creator_id?: string | null
          description?: string
          guide_ids?: Json
          hero_image?: string | null
          id?: string
          is_published?: boolean
          slug?: string
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          avatar_url: string | null
          bio: string | null
          created_at: string
          display_name: string | null
          handle: string | null
          id: string
          last_active_date: string | null
          level: number
          reputation: number
          streak_days: number
          updated_at: string
          xp: number
        }
        Insert: {
          avatar_url?: string | null
          bio?: string | null
          created_at?: string
          display_name?: string | null
          handle?: string | null
          id: string
          last_active_date?: string | null
          level?: number
          reputation?: number
          streak_days?: number
          updated_at?: string
          xp?: number
        }
        Update: {
          avatar_url?: string | null
          bio?: string | null
          created_at?: string
          display_name?: string | null
          handle?: string | null
          id?: string
          last_active_date?: string | null
          level?: number
          reputation?: number
          streak_days?: number
          updated_at?: string
          xp?: number
        }
        Relationships: []
      }
      saved_guides: {
        Row: {
          guide_id: string
          saved_at: string
          user_id: string
        }
        Insert: {
          guide_id: string
          saved_at?: string
          user_id: string
        }
        Update: {
          guide_id?: string
          saved_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "saved_guides_guide_id_fkey"
            columns: ["guide_id"]
            isOneToOne: false
            referencedRelation: "guides"
            referencedColumns: ["id"]
          },
        ]
      }
      skill_levels: {
        Row: {
          category: string
          id: string
          level: number
          updated_at: string
          user_id: string
          xp: number
        }
        Insert: {
          category: string
          id?: string
          level?: number
          updated_at?: string
          user_id: string
          xp?: number
        }
        Update: {
          category?: string
          id?: string
          level?: number
          updated_at?: string
          user_id?: string
          xp?: number
        }
        Relationships: []
      }
      user_achievements: {
        Row: {
          achievement_id: string
          id: string
          unlocked_at: string
          user_id: string
        }
        Insert: {
          achievement_id: string
          id?: string
          unlocked_at?: string
          user_id: string
        }
        Update: {
          achievement_id?: string
          id?: string
          unlocked_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_achievements_achievement_id_fkey"
            columns: ["achievement_id"]
            isOneToOne: false
            referencedRelation: "achievements"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      award_xp: {
        Args: { _amount: number; _category?: string }
        Returns: {
          leveled_up: boolean
          new_level: number
          new_xp: number
        }[]
      }
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
