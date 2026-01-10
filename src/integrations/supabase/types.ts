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
    PostgrestVersion: "14.1"
  }
  public: {
    Tables: {
      ai_output_audit_logs: {
        Row: {
          created_at: string
          id: string
          new_status: string
          notes: string | null
          previous_status: string | null
          report_name: string
          report_type: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          new_status: string
          notes?: string | null
          previous_status?: string | null
          report_name: string
          report_type: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          new_status?: string
          notes?: string | null
          previous_status?: string | null
          report_name?: string
          report_type?: string
          user_id?: string
        }
        Relationships: []
      }
      company_branding: {
        Row: {
          accent_color: string
          company_name: string
          created_at: string
          font_body: string
          font_heading: string
          id: string
          logo_url: string | null
          primary_color: string
          secondary_color: string
          tagline: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          accent_color?: string
          company_name?: string
          created_at?: string
          font_body?: string
          font_heading?: string
          id?: string
          logo_url?: string | null
          primary_color?: string
          secondary_color?: string
          tagline?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          accent_color?: string
          company_name?: string
          created_at?: string
          font_body?: string
          font_heading?: string
          id?: string
          logo_url?: string | null
          primary_color?: string
          secondary_color?: string
          tagline?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      decision_audit_logs: {
        Row: {
          action: string
          created_at: string
          decision_id: string
          id: string
          new_status: string | null
          notes: string | null
          previous_status: string | null
          user_id: string
        }
        Insert: {
          action: string
          created_at?: string
          decision_id: string
          id?: string
          new_status?: string | null
          notes?: string | null
          previous_status?: string | null
          user_id: string
        }
        Update: {
          action?: string
          created_at?: string
          decision_id?: string
          id?: string
          new_status?: string | null
          notes?: string | null
          previous_status?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "decision_audit_logs_decision_id_fkey"
            columns: ["decision_id"]
            isOneToOne: false
            referencedRelation: "decisions"
            referencedColumns: ["id"]
          },
        ]
      }
      decisions: {
        Row: {
          amount: string | null
          created_at: string
          decided_at: string | null
          decided_by: string | null
          decision_type: string
          description: string | null
          due_date: string | null
          id: string
          impact: string | null
          priority: string
          project_name: string | null
          rationale: string | null
          stakeholders: string[] | null
          status: string
          title: string
          updated_at: string
          user_id: string
        }
        Insert: {
          amount?: string | null
          created_at?: string
          decided_at?: string | null
          decided_by?: string | null
          decision_type?: string
          description?: string | null
          due_date?: string | null
          id?: string
          impact?: string | null
          priority?: string
          project_name?: string | null
          rationale?: string | null
          stakeholders?: string[] | null
          status?: string
          title: string
          updated_at?: string
          user_id: string
        }
        Update: {
          amount?: string | null
          created_at?: string
          decided_at?: string | null
          decided_by?: string | null
          decision_type?: string
          description?: string | null
          due_date?: string | null
          id?: string
          impact?: string | null
          priority?: string
          project_name?: string | null
          rationale?: string | null
          stakeholders?: string[] | null
          status?: string
          title?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      document_templates: {
        Row: {
          content: string
          created_at: string
          id: string
          is_default: boolean
          name: string
          type: string
          updated_at: string
          user_id: string
        }
        Insert: {
          content: string
          created_at?: string
          id?: string
          is_default?: boolean
          name: string
          type: string
          updated_at?: string
          user_id: string
        }
        Update: {
          content?: string
          created_at?: string
          id?: string
          is_default?: boolean
          name?: string
          type?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      documents: {
        Row: {
          content: string
          created_at: string
          file_name: string | null
          file_type: string | null
          id: string
          search_vector: unknown
          title: string
          updated_at: string
          user_id: string
        }
        Insert: {
          content: string
          created_at?: string
          file_name?: string | null
          file_type?: string | null
          id?: string
          search_vector?: unknown
          title: string
          updated_at?: string
          user_id: string
        }
        Update: {
          content?: string
          created_at?: string
          file_name?: string | null
          file_type?: string | null
          id?: string
          search_vector?: unknown
          title?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      email_templates: {
        Row: {
          body: string
          created_at: string
          id: string
          is_default: boolean
          name: string
          subject: string
          type: string
          updated_at: string
          user_id: string
        }
        Insert: {
          body: string
          created_at?: string
          id?: string
          is_default?: boolean
          name: string
          subject: string
          type: string
          updated_at?: string
          user_id: string
        }
        Update: {
          body?: string
          created_at?: string
          id?: string
          is_default?: boolean
          name?: string
          subject?: string
          type?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      enterprise_signals: {
        Row: {
          created_at: string
          description: string | null
          id: string
          is_resolved: boolean | null
          metadata: Json | null
          project_name: string | null
          resolved_at: string | null
          resolved_by: string | null
          severity: Database["public"]["Enums"]["signal_severity"]
          signal_category: Database["public"]["Enums"]["signal_category"]
          signal_type: string
          source: string
          stakeholder: string | null
          title: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          id?: string
          is_resolved?: boolean | null
          metadata?: Json | null
          project_name?: string | null
          resolved_at?: string | null
          resolved_by?: string | null
          severity?: Database["public"]["Enums"]["signal_severity"]
          signal_category: Database["public"]["Enums"]["signal_category"]
          signal_type: string
          source?: string
          stakeholder?: string | null
          title: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          description?: string | null
          id?: string
          is_resolved?: boolean | null
          metadata?: Json | null
          project_name?: string | null
          resolved_at?: string | null
          resolved_by?: string | null
          severity?: Database["public"]["Enums"]["signal_severity"]
          signal_category?: Database["public"]["Enums"]["signal_category"]
          signal_type?: string
          source?: string
          stakeholder?: string | null
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      file_imports: {
        Row: {
          created_at: string | null
          error_message: string | null
          file_name: string
          file_type: string
          file_url: string | null
          id: string
          mapping_config: Json | null
          parsed_data: Json | null
          records_imported: number | null
          status: string | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          error_message?: string | null
          file_name: string
          file_type: string
          file_url?: string | null
          id?: string
          mapping_config?: Json | null
          parsed_data?: Json | null
          records_imported?: number | null
          status?: string | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          error_message?: string | null
          file_name?: string
          file_type?: string
          file_url?: string | null
          id?: string
          mapping_config?: Json | null
          parsed_data?: Json | null
          records_imported?: number | null
          status?: string | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      integration_configs: {
        Row: {
          config: Json
          created_at: string | null
          id: string
          integration_type: string
          is_active: boolean | null
          last_sync_at: string | null
          name: string
          sync_frequency: string | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          config?: Json
          created_at?: string | null
          id?: string
          integration_type: string
          is_active?: boolean | null
          last_sync_at?: string | null
          name: string
          sync_frequency?: string | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          config?: Json
          created_at?: string | null
          id?: string
          integration_type?: string
          is_active?: boolean | null
          last_sync_at?: string | null
          name?: string
          sync_frequency?: string | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      integration_sync_logs: {
        Row: {
          completed_at: string | null
          error_message: string | null
          id: string
          integration_id: string | null
          records_synced: number | null
          started_at: string | null
          status: string | null
          sync_details: Json | null
        }
        Insert: {
          completed_at?: string | null
          error_message?: string | null
          id?: string
          integration_id?: string | null
          records_synced?: number | null
          started_at?: string | null
          status?: string | null
          sync_details?: Json | null
        }
        Update: {
          completed_at?: string | null
          error_message?: string | null
          id?: string
          integration_id?: string | null
          records_synced?: number | null
          started_at?: string | null
          status?: string | null
          sync_details?: Json | null
        }
        Relationships: [
          {
            foreignKeyName: "integration_sync_logs_integration_id_fkey"
            columns: ["integration_id"]
            isOneToOne: false
            referencedRelation: "integration_configs"
            referencedColumns: ["id"]
          },
        ]
      }
      kpis_sync: {
        Row: {
          change: number | null
          created_at: string
          icon: string | null
          id: string
          raw_data: Json | null
          source: string
          title: string
          trend: string | null
          updated_at: string
          value: string
        }
        Insert: {
          change?: number | null
          created_at?: string
          icon?: string | null
          id?: string
          raw_data?: Json | null
          source?: string
          title: string
          trend?: string | null
          updated_at?: string
          value: string
        }
        Update: {
          change?: number | null
          created_at?: string
          icon?: string | null
          id?: string
          raw_data?: Json | null
          source?: string
          title?: string
          trend?: string | null
          updated_at?: string
          value?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          avatar_url: string | null
          created_at: string
          display_name: string | null
          id: string
          updated_at: string
          user_id: string
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string
          display_name?: string | null
          id?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          avatar_url?: string | null
          created_at?: string
          display_name?: string | null
          id?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      projects_sync: {
        Row: {
          budget: number | null
          category: string | null
          created_at: string
          description: string | null
          end_date: string | null
          external_id: string
          health: string
          id: string
          milestones_data: Json | null
          name: string
          priority: string | null
          progress: number | null
          raw_data: Json | null
          source: string
          spent: number | null
          start_date: string | null
          team_data: Json | null
          updated_at: string
        }
        Insert: {
          budget?: number | null
          category?: string | null
          created_at?: string
          description?: string | null
          end_date?: string | null
          external_id: string
          health?: string
          id?: string
          milestones_data?: Json | null
          name: string
          priority?: string | null
          progress?: number | null
          raw_data?: Json | null
          source?: string
          spent?: number | null
          start_date?: string | null
          team_data?: Json | null
          updated_at?: string
        }
        Update: {
          budget?: number | null
          category?: string | null
          created_at?: string
          description?: string | null
          end_date?: string | null
          external_id?: string
          health?: string
          id?: string
          milestones_data?: Json | null
          name?: string
          priority?: string | null
          progress?: number | null
          raw_data?: Json | null
          source?: string
          spent?: number | null
          start_date?: string | null
          team_data?: Json | null
          updated_at?: string
        }
        Relationships: []
      }
      role_definitions: {
        Row: {
          created_at: string
          description: string
          display_name: string
          hierarchy_level: number
          id: string
          permissions: Json
          role: Database["public"]["Enums"]["app_role"]
          updated_at: string
        }
        Insert: {
          created_at?: string
          description: string
          display_name: string
          hierarchy_level?: number
          id?: string
          permissions?: Json
          role: Database["public"]["Enums"]["app_role"]
          updated_at?: string
        }
        Update: {
          created_at?: string
          description?: string
          display_name?: string
          hierarchy_level?: number
          id?: string
          permissions?: Json
          role?: Database["public"]["Enums"]["app_role"]
          updated_at?: string
        }
        Relationships: []
      }
      role_requests: {
        Row: {
          admin_notes: string | null
          created_at: string
          id: string
          requested_role: string
          reviewed_at: string | null
          reviewed_by: string | null
          status: string
          updated_at: string
          user_id: string
        }
        Insert: {
          admin_notes?: string | null
          created_at?: string
          id?: string
          requested_role: string
          reviewed_at?: string | null
          reviewed_by?: string | null
          status?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          admin_notes?: string | null
          created_at?: string
          id?: string
          requested_role?: string
          reviewed_at?: string | null
          reviewed_by?: string | null
          status?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      tasks_sync: {
        Row: {
          assignee: string | null
          created_at: string
          description: string | null
          due_date: string | null
          external_id: string
          id: string
          priority: string | null
          project_external_id: string | null
          raw_data: Json | null
          source: string
          status: string | null
          tags: string[] | null
          title: string
          updated_at: string
        }
        Insert: {
          assignee?: string | null
          created_at?: string
          description?: string | null
          due_date?: string | null
          external_id: string
          id?: string
          priority?: string | null
          project_external_id?: string | null
          raw_data?: Json | null
          source?: string
          status?: string | null
          tags?: string[] | null
          title: string
          updated_at?: string
        }
        Update: {
          assignee?: string | null
          created_at?: string
          description?: string | null
          due_date?: string | null
          external_id?: string
          id?: string
          priority?: string | null
          project_external_id?: string | null
          raw_data?: Json | null
          source?: string
          status?: string | null
          tags?: string[] | null
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      tenant_settings: {
        Row: {
          category: string
          created_at: string
          description: string | null
          id: string
          setting_key: string
          setting_value: Json
          updated_at: string
          updated_by: string | null
        }
        Insert: {
          category?: string
          created_at?: string
          description?: string | null
          id?: string
          setting_key: string
          setting_value?: Json
          updated_at?: string
          updated_by?: string | null
        }
        Update: {
          category?: string
          created_at?: string
          description?: string | null
          id?: string
          setting_key?: string
          setting_value?: Json
          updated_at?: string
          updated_by?: string | null
        }
        Relationships: []
      }
      user_activities: {
        Row: {
          action_details: Json | null
          action_type: string
          created_at: string
          id: string
          page_path: string | null
          user_id: string
        }
        Insert: {
          action_details?: Json | null
          action_type: string
          created_at?: string
          id?: string
          page_path?: string | null
          user_id: string
        }
        Update: {
          action_details?: Json | null
          action_type?: string
          created_at?: string
          id?: string
          page_path?: string | null
          user_id?: string
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          created_at: string
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
    }
    Enums: {
      app_role:
        | "admin"
        | "user"
        | "project_manager"
        | "senior_project_manager"
        | "program_manager"
        | "pmo"
        | "executive"
        | "tenant_admin"
      signal_category: "project" | "communication" | "governance"
      signal_severity: "low" | "medium" | "high" | "critical"
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
    Enums: {
      app_role: [
        "admin",
        "user",
        "project_manager",
        "senior_project_manager",
        "program_manager",
        "pmo",
        "executive",
        "tenant_admin",
      ],
      signal_category: ["project", "communication", "governance"],
      signal_severity: ["low", "medium", "high", "critical"],
    },
  },
} as const
