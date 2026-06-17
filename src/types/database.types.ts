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
      academies: {
        Row: {
          brand_colors: Json
          cover_url: string | null
          created_at: string
          currency: string
          custom_domain: string | null
          deleted_at: string | null
          description: string | null
          favicon_url: string | null
          hide_platform_badge: boolean
          id: string
          locale: string
          logo_url: string | null
          max_students: number | null
          meta_description: string | null
          meta_title: string | null
          name: string
          owner_id: string
          plan_id: string | null
          slug: string
          timezone: string
          updated_at: string
          white_label: boolean
        }
        Insert: {
          brand_colors?: Json
          cover_url?: string | null
          created_at?: string
          currency?: string
          custom_domain?: string | null
          deleted_at?: string | null
          description?: string | null
          favicon_url?: string | null
          hide_platform_badge?: boolean
          id?: string
          locale?: string
          logo_url?: string | null
          max_students?: number | null
          meta_description?: string | null
          meta_title?: string | null
          name: string
          owner_id: string
          plan_id?: string | null
          slug: string
          timezone?: string
          updated_at?: string
          white_label?: boolean
        }
        Update: {
          brand_colors?: Json
          cover_url?: string | null
          created_at?: string
          currency?: string
          custom_domain?: string | null
          deleted_at?: string | null
          description?: string | null
          favicon_url?: string | null
          hide_platform_badge?: boolean
          id?: string
          locale?: string
          logo_url?: string | null
          max_students?: number | null
          meta_description?: string | null
          meta_title?: string | null
          name?: string
          owner_id?: string
          plan_id?: string | null
          slug?: string
          timezone?: string
          updated_at?: string
          white_label?: boolean
        }
        Relationships: [
          {
            foreignKeyName: "academies_owner_id_fkey"
            columns: ["owner_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fk_academies_plan"
            columns: ["plan_id"]
            isOneToOne: false
            referencedRelation: "plans"
            referencedColumns: ["id"]
          },
        ]
      }
      academy_follows: {
        Row: {
          academy_id: string
          followed_at: string
          follower_id: string
        }
        Insert: {
          academy_id: string
          followed_at?: string
          follower_id: string
        }
        Update: {
          academy_id?: string
          followed_at?: string
          follower_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "academy_follows_academy_id_fkey"
            columns: ["academy_id"]
            isOneToOne: false
            referencedRelation: "academies"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "academy_follows_follower_id_fkey"
            columns: ["follower_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      academy_listings: {
        Row: {
          academy_id: string
          categories: string[]
          cover_url: string | null
          id: string
          is_featured: boolean
          language: string
          listed_at: string
          rating_avg: number | null
          rating_count: number
          student_count: number
          tagline: string | null
          updated_at: string
        }
        Insert: {
          academy_id: string
          categories?: string[]
          cover_url?: string | null
          id?: string
          is_featured?: boolean
          language?: string
          listed_at?: string
          rating_avg?: number | null
          rating_count?: number
          student_count?: number
          tagline?: string | null
          updated_at?: string
        }
        Update: {
          academy_id?: string
          categories?: string[]
          cover_url?: string | null
          id?: string
          is_featured?: boolean
          language?: string
          listed_at?: string
          rating_avg?: number | null
          rating_count?: number
          student_count?: number
          tagline?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "academy_listings_academy_id_fkey"
            columns: ["academy_id"]
            isOneToOne: true
            referencedRelation: "academies"
            referencedColumns: ["id"]
          },
        ]
      }
      affiliates: {
        Row: {
          academy_id: string
          commission_rate: number
          created_at: string
          id: string
          is_active: boolean
          referral_code: string
          total_earned: number
          updated_at: string
          user_id: string
        }
        Insert: {
          academy_id: string
          commission_rate?: number
          created_at?: string
          id?: string
          is_active?: boolean
          referral_code: string
          total_earned?: number
          updated_at?: string
          user_id: string
        }
        Update: {
          academy_id?: string
          commission_rate?: number
          created_at?: string
          id?: string
          is_active?: boolean
          referral_code?: string
          total_earned?: number
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "affiliates_academy_id_fkey"
            columns: ["academy_id"]
            isOneToOne: false
            referencedRelation: "academies"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "affiliates_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      ai_conversations: {
        Row: {
          academy_id: string
          context_id: string | null
          context_type: string | null
          created_at: string
          id: string
          mentor_id: string | null
          title: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          academy_id: string
          context_id?: string | null
          context_type?: string | null
          created_at?: string
          id?: string
          mentor_id?: string | null
          title?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          academy_id?: string
          context_id?: string | null
          context_type?: string | null
          created_at?: string
          id?: string
          mentor_id?: string | null
          title?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "ai_conversations_academy_id_fkey"
            columns: ["academy_id"]
            isOneToOne: false
            referencedRelation: "academies"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "ai_conversations_mentor_id_fkey"
            columns: ["mentor_id"]
            isOneToOne: false
            referencedRelation: "ai_mentors"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "ai_conversations_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      ai_daily_tasks: {
        Row: {
          academy_id: string
          completed: boolean
          created_at: string
          id: string
          task_date: string
          tasks: Json
          updated_at: string
          user_id: string
        }
        Insert: {
          academy_id: string
          completed?: boolean
          created_at?: string
          id?: string
          task_date: string
          tasks?: Json
          updated_at?: string
          user_id: string
        }
        Update: {
          academy_id?: string
          completed?: boolean
          created_at?: string
          id?: string
          task_date?: string
          tasks?: Json
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "ai_daily_tasks_academy_id_fkey"
            columns: ["academy_id"]
            isOneToOne: false
            referencedRelation: "academies"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "ai_daily_tasks_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      ai_mentors: {
        Row: {
          academy_id: string
          avatar_url: string | null
          created_at: string
          id: string
          is_active: boolean
          knowledge_base_id: string | null
          model: Database["public"]["Enums"]["ai_model_enum"]
          name: string
          persona: string | null
          updated_at: string
        }
        Insert: {
          academy_id: string
          avatar_url?: string | null
          created_at?: string
          id?: string
          is_active?: boolean
          knowledge_base_id?: string | null
          model?: Database["public"]["Enums"]["ai_model_enum"]
          name: string
          persona?: string | null
          updated_at?: string
        }
        Update: {
          academy_id?: string
          avatar_url?: string | null
          created_at?: string
          id?: string
          is_active?: boolean
          knowledge_base_id?: string | null
          model?: Database["public"]["Enums"]["ai_model_enum"]
          name?: string
          persona?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "ai_mentors_academy_id_fkey"
            columns: ["academy_id"]
            isOneToOne: false
            referencedRelation: "academies"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "ai_mentors_knowledge_base_id_fkey"
            columns: ["knowledge_base_id"]
            isOneToOne: false
            referencedRelation: "knowledge_bases"
            referencedColumns: ["id"]
          },
        ]
      }
      ai_messages: {
        Row: {
          audio_url: string | null
          content: string
          conversation_id: string
          created_at: string
          id: string
          model: Database["public"]["Enums"]["ai_model_enum"] | null
          role: string
          token_count: number | null
        }
        Insert: {
          audio_url?: string | null
          content: string
          conversation_id: string
          created_at?: string
          id?: string
          model?: Database["public"]["Enums"]["ai_model_enum"] | null
          role: string
          token_count?: number | null
        }
        Update: {
          audio_url?: string | null
          content?: string
          conversation_id?: string
          created_at?: string
          id?: string
          model?: Database["public"]["Enums"]["ai_model_enum"] | null
          role?: string
          token_count?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "ai_messages_conversation_id_fkey"
            columns: ["conversation_id"]
            isOneToOne: false
            referencedRelation: "ai_conversations"
            referencedColumns: ["id"]
          },
        ]
      }
      ai_reviews: {
        Row: {
          academy_id: string
          attempt_id: string | null
          created_at: string
          feedback: string
          grade: number | null
          id: string
          improvements: Json | null
          model: Database["public"]["Enums"]["ai_model_enum"]
          strengths: Json | null
          submission_id: string | null
          token_count: number | null
        }
        Insert: {
          academy_id: string
          attempt_id?: string | null
          created_at?: string
          feedback: string
          grade?: number | null
          id?: string
          improvements?: Json | null
          model?: Database["public"]["Enums"]["ai_model_enum"]
          strengths?: Json | null
          submission_id?: string | null
          token_count?: number | null
        }
        Update: {
          academy_id?: string
          attempt_id?: string | null
          created_at?: string
          feedback?: string
          grade?: number | null
          id?: string
          improvements?: Json | null
          model?: Database["public"]["Enums"]["ai_model_enum"]
          strengths?: Json | null
          submission_id?: string | null
          token_count?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "ai_reviews_academy_id_fkey"
            columns: ["academy_id"]
            isOneToOne: false
            referencedRelation: "academies"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "ai_reviews_attempt_id_fkey"
            columns: ["attempt_id"]
            isOneToOne: false
            referencedRelation: "attempts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "ai_reviews_submission_id_fkey"
            columns: ["submission_id"]
            isOneToOne: false
            referencedRelation: "submissions"
            referencedColumns: ["id"]
          },
        ]
      }
      api_keys: {
        Row: {
          academy_id: string
          created_at: string
          created_by: string
          expires_at: string | null
          id: string
          key_hash: string
          last_used: string | null
          name: string
          prefix: string
          revoked_at: string | null
          scopes: string[]
        }
        Insert: {
          academy_id: string
          created_at?: string
          created_by: string
          expires_at?: string | null
          id?: string
          key_hash: string
          last_used?: string | null
          name: string
          prefix: string
          revoked_at?: string | null
          scopes?: string[]
        }
        Update: {
          academy_id?: string
          created_at?: string
          created_by?: string
          expires_at?: string | null
          id?: string
          key_hash?: string
          last_used?: string | null
          name?: string
          prefix?: string
          revoked_at?: string | null
          scopes?: string[]
        }
        Relationships: [
          {
            foreignKeyName: "api_keys_academy_id_fkey"
            columns: ["academy_id"]
            isOneToOne: false
            referencedRelation: "academies"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "api_keys_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      assignments: {
        Row: {
          academy_id: string
          ai_review_enabled: boolean
          allowed_types: Database["public"]["Enums"]["submission_type_enum"][]
          course_id: string
          created_at: string
          description: string | null
          due_days: number | null
          id: string
          instructions: string | null
          lesson_id: string | null
          max_score: number
          title: string
          updated_at: string
        }
        Insert: {
          academy_id: string
          ai_review_enabled?: boolean
          allowed_types?: Database["public"]["Enums"]["submission_type_enum"][]
          course_id: string
          created_at?: string
          description?: string | null
          due_days?: number | null
          id?: string
          instructions?: string | null
          lesson_id?: string | null
          max_score?: number
          title: string
          updated_at?: string
        }
        Update: {
          academy_id?: string
          ai_review_enabled?: boolean
          allowed_types?: Database["public"]["Enums"]["submission_type_enum"][]
          course_id?: string
          created_at?: string
          description?: string | null
          due_days?: number | null
          id?: string
          instructions?: string | null
          lesson_id?: string | null
          max_score?: number
          title?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "assignments_academy_id_fkey"
            columns: ["academy_id"]
            isOneToOne: false
            referencedRelation: "academies"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "assignments_course_id_fkey"
            columns: ["course_id"]
            isOneToOne: false
            referencedRelation: "courses"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "assignments_lesson_id_fkey"
            columns: ["lesson_id"]
            isOneToOne: false
            referencedRelation: "lessons"
            referencedColumns: ["id"]
          },
        ]
      }
      attempt_answers: {
        Row: {
          attempt_id: string
          created_at: string
          id: string
          is_correct: boolean | null
          open_answer: string | null
          points_earned: number
          question_id: string
          selected_option: string | null
        }
        Insert: {
          attempt_id: string
          created_at?: string
          id?: string
          is_correct?: boolean | null
          open_answer?: string | null
          points_earned?: number
          question_id: string
          selected_option?: string | null
        }
        Update: {
          attempt_id?: string
          created_at?: string
          id?: string
          is_correct?: boolean | null
          open_answer?: string | null
          points_earned?: number
          question_id?: string
          selected_option?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "attempt_answers_attempt_id_fkey"
            columns: ["attempt_id"]
            isOneToOne: false
            referencedRelation: "attempts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "attempt_answers_question_id_fkey"
            columns: ["question_id"]
            isOneToOne: false
            referencedRelation: "questions"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "attempt_answers_selected_option_fkey"
            columns: ["selected_option"]
            isOneToOne: false
            referencedRelation: "question_options"
            referencedColumns: ["id"]
          },
        ]
      }
      attempts: {
        Row: {
          academy_id: string
          created_at: string
          id: string
          max_score: number | null
          passed: boolean | null
          quiz_id: string
          score: number | null
          started_at: string
          submitted_at: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          academy_id: string
          created_at?: string
          id?: string
          max_score?: number | null
          passed?: boolean | null
          quiz_id: string
          score?: number | null
          started_at?: string
          submitted_at?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          academy_id?: string
          created_at?: string
          id?: string
          max_score?: number | null
          passed?: boolean | null
          quiz_id?: string
          score?: number | null
          started_at?: string
          submitted_at?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "attempts_academy_id_fkey"
            columns: ["academy_id"]
            isOneToOne: false
            referencedRelation: "academies"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "attempts_quiz_id_fkey"
            columns: ["quiz_id"]
            isOneToOne: false
            referencedRelation: "quizzes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "attempts_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      automation_runs: {
        Row: {
          automation_id: string
          error_message: string | null
          finished_at: string | null
          id: string
          result: Json
          started_at: string
          success: boolean
          trigger_payload: Json
        }
        Insert: {
          automation_id: string
          error_message?: string | null
          finished_at?: string | null
          id?: string
          result?: Json
          started_at?: string
          success?: boolean
          trigger_payload?: Json
        }
        Update: {
          automation_id?: string
          error_message?: string | null
          finished_at?: string | null
          id?: string
          result?: Json
          started_at?: string
          success?: boolean
          trigger_payload?: Json
        }
        Relationships: [
          {
            foreignKeyName: "automation_runs_automation_id_fkey"
            columns: ["automation_id"]
            isOneToOne: false
            referencedRelation: "automations"
            referencedColumns: ["id"]
          },
        ]
      }
      automations: {
        Row: {
          academy_id: string
          actions: Json
          created_at: string
          created_by: string
          description: string | null
          id: string
          last_run_at: string | null
          name: string
          run_count: number
          status: Database["public"]["Enums"]["automation_status_enum"]
          trigger: Json
          updated_at: string
        }
        Insert: {
          academy_id: string
          actions?: Json
          created_at?: string
          created_by: string
          description?: string | null
          id?: string
          last_run_at?: string | null
          name: string
          run_count?: number
          status?: Database["public"]["Enums"]["automation_status_enum"]
          trigger?: Json
          updated_at?: string
        }
        Update: {
          academy_id?: string
          actions?: Json
          created_at?: string
          created_by?: string
          description?: string | null
          id?: string
          last_run_at?: string | null
          name?: string
          run_count?: number
          status?: Database["public"]["Enums"]["automation_status_enum"]
          trigger?: Json
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "automations_academy_id_fkey"
            columns: ["academy_id"]
            isOneToOne: false
            referencedRelation: "academies"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "automations_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      badges: {
        Row: {
          academy_id: string | null
          created_at: string
          criteria: Json
          description: string | null
          icon_url: string
          id: string
          name: string
          rarity: string
          updated_at: string
        }
        Insert: {
          academy_id?: string | null
          created_at?: string
          criteria?: Json
          description?: string | null
          icon_url: string
          id?: string
          name: string
          rarity?: string
          updated_at?: string
        }
        Update: {
          academy_id?: string | null
          created_at?: string
          criteria?: Json
          description?: string | null
          icon_url?: string
          id?: string
          name?: string
          rarity?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "badges_academy_id_fkey"
            columns: ["academy_id"]
            isOneToOne: false
            referencedRelation: "academies"
            referencedColumns: ["id"]
          },
        ]
      }
      bookmarks: {
        Row: {
          academy_id: string
          created_at: string
          id: string
          label: string | null
          lesson_id: string
          position_s: number | null
          user_id: string
        }
        Insert: {
          academy_id: string
          created_at?: string
          id?: string
          label?: string | null
          lesson_id: string
          position_s?: number | null
          user_id: string
        }
        Update: {
          academy_id?: string
          created_at?: string
          id?: string
          label?: string | null
          lesson_id?: string
          position_s?: number | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "bookmarks_academy_id_fkey"
            columns: ["academy_id"]
            isOneToOne: false
            referencedRelation: "academies"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "bookmarks_lesson_id_fkey"
            columns: ["lesson_id"]
            isOneToOne: false
            referencedRelation: "lessons"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "bookmarks_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      calendar_events: {
        Row: {
          academy_id: string
          attendee_filter: Json
          created_at: string
          created_by: string
          description: string | null
          ends_at: string
          id: string
          is_recurring: boolean
          location: string | null
          recurrence_rule: string | null
          starts_at: string
          title: string
          updated_at: string
        }
        Insert: {
          academy_id: string
          attendee_filter?: Json
          created_at?: string
          created_by: string
          description?: string | null
          ends_at: string
          id?: string
          is_recurring?: boolean
          location?: string | null
          recurrence_rule?: string | null
          starts_at: string
          title: string
          updated_at?: string
        }
        Update: {
          academy_id?: string
          attendee_filter?: Json
          created_at?: string
          created_by?: string
          description?: string | null
          ends_at?: string
          id?: string
          is_recurring?: boolean
          location?: string | null
          recurrence_rule?: string | null
          starts_at?: string
          title?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "calendar_events_academy_id_fkey"
            columns: ["academy_id"]
            isOneToOne: false
            referencedRelation: "academies"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "calendar_events_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      categories: {
        Row: {
          academy_id: string
          created_at: string
          description: string | null
          icon_url: string | null
          id: string
          name: string
          parent_id: string | null
          position: number
          slug: string
          updated_at: string
        }
        Insert: {
          academy_id: string
          created_at?: string
          description?: string | null
          icon_url?: string | null
          id?: string
          name: string
          parent_id?: string | null
          position?: number
          slug: string
          updated_at?: string
        }
        Update: {
          academy_id?: string
          created_at?: string
          description?: string | null
          icon_url?: string | null
          id?: string
          name?: string
          parent_id?: string | null
          position?: number
          slug?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "categories_academy_id_fkey"
            columns: ["academy_id"]
            isOneToOne: false
            referencedRelation: "academies"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "categories_parent_id_fkey"
            columns: ["parent_id"]
            isOneToOne: false
            referencedRelation: "categories"
            referencedColumns: ["id"]
          },
        ]
      }
      certificates: {
        Row: {
          academy_id: string
          course_id: string
          created_at: string
          enrollment_id: string | null
          id: string
          issued_at: string
          pdf_url: string | null
          qr_url: string | null
          template_id: string | null
          user_id: string
          verification_code: string
        }
        Insert: {
          academy_id: string
          course_id: string
          created_at?: string
          enrollment_id?: string | null
          id?: string
          issued_at?: string
          pdf_url?: string | null
          qr_url?: string | null
          template_id?: string | null
          user_id: string
          verification_code?: string
        }
        Update: {
          academy_id?: string
          course_id?: string
          created_at?: string
          enrollment_id?: string | null
          id?: string
          issued_at?: string
          pdf_url?: string | null
          qr_url?: string | null
          template_id?: string | null
          user_id?: string
          verification_code?: string
        }
        Relationships: [
          {
            foreignKeyName: "certificates_academy_id_fkey"
            columns: ["academy_id"]
            isOneToOne: false
            referencedRelation: "academies"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "certificates_course_id_fkey"
            columns: ["course_id"]
            isOneToOne: false
            referencedRelation: "courses"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "certificates_enrollment_id_fkey"
            columns: ["enrollment_id"]
            isOneToOne: false
            referencedRelation: "enrollments"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "certificates_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      challenge_progress: {
        Row: {
          academy_id: string
          challenge_id: string
          completed: boolean
          completed_at: string | null
          id: string
          progress: number
          updated_at: string
          user_id: string
        }
        Insert: {
          academy_id: string
          challenge_id: string
          completed?: boolean
          completed_at?: string | null
          id?: string
          progress?: number
          updated_at?: string
          user_id: string
        }
        Update: {
          academy_id?: string
          challenge_id?: string
          completed?: boolean
          completed_at?: string | null
          id?: string
          progress?: number
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "challenge_progress_academy_id_fkey"
            columns: ["academy_id"]
            isOneToOne: false
            referencedRelation: "academies"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "challenge_progress_challenge_id_fkey"
            columns: ["challenge_id"]
            isOneToOne: false
            referencedRelation: "challenges"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "challenge_progress_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      challenges: {
        Row: {
          academy_id: string
          badge_id: string | null
          created_at: string
          criteria: Json
          description: string | null
          ends_at: string | null
          id: string
          starts_at: string | null
          title: string
          updated_at: string
          xp_reward: number
        }
        Insert: {
          academy_id: string
          badge_id?: string | null
          created_at?: string
          criteria?: Json
          description?: string | null
          ends_at?: string | null
          id?: string
          starts_at?: string | null
          title: string
          updated_at?: string
          xp_reward?: number
        }
        Update: {
          academy_id?: string
          badge_id?: string | null
          created_at?: string
          criteria?: Json
          description?: string | null
          ends_at?: string | null
          id?: string
          starts_at?: string | null
          title?: string
          updated_at?: string
          xp_reward?: number
        }
        Relationships: [
          {
            foreignKeyName: "challenges_academy_id_fkey"
            columns: ["academy_id"]
            isOneToOne: false
            referencedRelation: "academies"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "challenges_badge_id_fkey"
            columns: ["badge_id"]
            isOneToOne: false
            referencedRelation: "badges"
            referencedColumns: ["id"]
          },
        ]
      }
      comments: {
        Row: {
          academy_id: string
          body: string
          created_at: string
          deleted_at: string | null
          entity_id: string
          entity_type: Database["public"]["Enums"]["comment_entity_enum"]
          id: string
          is_pinned: boolean
          parent_id: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          academy_id: string
          body: string
          created_at?: string
          deleted_at?: string | null
          entity_id: string
          entity_type: Database["public"]["Enums"]["comment_entity_enum"]
          id?: string
          is_pinned?: boolean
          parent_id?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          academy_id?: string
          body?: string
          created_at?: string
          deleted_at?: string | null
          entity_id?: string
          entity_type?: Database["public"]["Enums"]["comment_entity_enum"]
          id?: string
          is_pinned?: boolean
          parent_id?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "comments_academy_id_fkey"
            columns: ["academy_id"]
            isOneToOne: false
            referencedRelation: "academies"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "comments_parent_id_fkey"
            columns: ["parent_id"]
            isOneToOne: false
            referencedRelation: "comments"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "comments_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      content_reports: {
        Row: {
          academy_id: string
          created_at: string
          entity_id: string
          entity_type: string
          id: string
          reason: string
          reporter_id: string
          status: Database["public"]["Enums"]["report_status_enum"]
          updated_at: string
        }
        Insert: {
          academy_id: string
          created_at?: string
          entity_id: string
          entity_type: string
          id?: string
          reason: string
          reporter_id: string
          status?: Database["public"]["Enums"]["report_status_enum"]
          updated_at?: string
        }
        Update: {
          academy_id?: string
          created_at?: string
          entity_id?: string
          entity_type?: string
          id?: string
          reason?: string
          reporter_id?: string
          status?: Database["public"]["Enums"]["report_status_enum"]
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "content_reports_academy_id_fkey"
            columns: ["academy_id"]
            isOneToOne: false
            referencedRelation: "academies"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "content_reports_reporter_id_fkey"
            columns: ["reporter_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      conversation_members: {
        Row: {
          conversation_id: string
          joined_at: string
          last_read_at: string | null
          user_id: string
        }
        Insert: {
          conversation_id: string
          joined_at?: string
          last_read_at?: string | null
          user_id: string
        }
        Update: {
          conversation_id?: string
          joined_at?: string
          last_read_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "conversation_members_conversation_id_fkey"
            columns: ["conversation_id"]
            isOneToOne: false
            referencedRelation: "conversations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "conversation_members_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      conversations: {
        Row: {
          academy_id: string
          created_at: string
          created_by: string
          id: string
          is_group: boolean
          title: string | null
          updated_at: string
        }
        Insert: {
          academy_id: string
          created_at?: string
          created_by: string
          id?: string
          is_group?: boolean
          title?: string | null
          updated_at?: string
        }
        Update: {
          academy_id?: string
          created_at?: string
          created_by?: string
          id?: string
          is_group?: boolean
          title?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "conversations_academy_id_fkey"
            columns: ["academy_id"]
            isOneToOne: false
            referencedRelation: "academies"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "conversations_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      coupon_redemptions: {
        Row: {
          coupon_id: string
          id: string
          payment_id: string | null
          redeemed_at: string
          user_id: string
        }
        Insert: {
          coupon_id: string
          id?: string
          payment_id?: string | null
          redeemed_at?: string
          user_id: string
        }
        Update: {
          coupon_id?: string
          id?: string
          payment_id?: string | null
          redeemed_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "coupon_redemptions_coupon_id_fkey"
            columns: ["coupon_id"]
            isOneToOne: false
            referencedRelation: "coupons"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "coupon_redemptions_payment_id_fkey"
            columns: ["payment_id"]
            isOneToOne: false
            referencedRelation: "payments"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "coupon_redemptions_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      coupons: {
        Row: {
          academy_id: string
          code: string
          course_id: string | null
          created_at: string
          description: string | null
          discount_type: string
          discount_value: number
          id: string
          max_uses: number | null
          updated_at: string
          uses_count: number
          valid_from: string | null
          valid_until: string | null
        }
        Insert: {
          academy_id: string
          code: string
          course_id?: string | null
          created_at?: string
          description?: string | null
          discount_type?: string
          discount_value: number
          id?: string
          max_uses?: number | null
          updated_at?: string
          uses_count?: number
          valid_from?: string | null
          valid_until?: string | null
        }
        Update: {
          academy_id?: string
          code?: string
          course_id?: string | null
          created_at?: string
          description?: string | null
          discount_type?: string
          discount_value?: number
          id?: string
          max_uses?: number | null
          updated_at?: string
          uses_count?: number
          valid_from?: string | null
          valid_until?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "coupons_academy_id_fkey"
            columns: ["academy_id"]
            isOneToOne: false
            referencedRelation: "academies"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "coupons_course_id_fkey"
            columns: ["course_id"]
            isOneToOne: false
            referencedRelation: "courses"
            referencedColumns: ["id"]
          },
        ]
      }
      course_reviews: {
        Row: {
          academy_id: string
          body: string | null
          course_id: string
          created_at: string
          id: string
          rating: number
          updated_at: string
          user_id: string
        }
        Insert: {
          academy_id: string
          body?: string | null
          course_id: string
          created_at?: string
          id?: string
          rating: number
          updated_at?: string
          user_id: string
        }
        Update: {
          academy_id?: string
          body?: string | null
          course_id?: string
          created_at?: string
          id?: string
          rating?: number
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "course_reviews_academy_id_fkey"
            columns: ["academy_id"]
            isOneToOne: false
            referencedRelation: "academies"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "course_reviews_course_id_fkey"
            columns: ["course_id"]
            isOneToOne: false
            referencedRelation: "courses"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "course_reviews_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      courses: {
        Row: {
          academy_id: string
          ai_generated: boolean
          ai_syllabus: Json | null
          category_id: string | null
          course_type: Database["public"]["Enums"]["course_type_enum"]
          cover_url: string | null
          created_at: string
          currency: string
          deleted_at: string | null
          description: string | null
          drip_config: Json
          drip_type: Database["public"]["Enums"]["drip_type_enum"]
          enrolled_count: number
          id: string
          instructor_id: string | null
          is_featured: boolean
          is_published: boolean
          price: number | null
          rating_avg: number | null
          rating_count: number
          short_desc: string | null
          slug: string
          title: string
          trailer_url: string | null
          updated_at: string
        }
        Insert: {
          academy_id: string
          ai_generated?: boolean
          ai_syllabus?: Json | null
          category_id?: string | null
          course_type?: Database["public"]["Enums"]["course_type_enum"]
          cover_url?: string | null
          created_at?: string
          currency?: string
          deleted_at?: string | null
          description?: string | null
          drip_config?: Json
          drip_type?: Database["public"]["Enums"]["drip_type_enum"]
          enrolled_count?: number
          id?: string
          instructor_id?: string | null
          is_featured?: boolean
          is_published?: boolean
          price?: number | null
          rating_avg?: number | null
          rating_count?: number
          short_desc?: string | null
          slug: string
          title: string
          trailer_url?: string | null
          updated_at?: string
        }
        Update: {
          academy_id?: string
          ai_generated?: boolean
          ai_syllabus?: Json | null
          category_id?: string | null
          course_type?: Database["public"]["Enums"]["course_type_enum"]
          cover_url?: string | null
          created_at?: string
          currency?: string
          deleted_at?: string | null
          description?: string | null
          drip_config?: Json
          drip_type?: Database["public"]["Enums"]["drip_type_enum"]
          enrolled_count?: number
          id?: string
          instructor_id?: string | null
          is_featured?: boolean
          is_published?: boolean
          price?: number | null
          rating_avg?: number | null
          rating_count?: number
          short_desc?: string | null
          slug?: string
          title?: string
          trailer_url?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "courses_academy_id_fkey"
            columns: ["academy_id"]
            isOneToOne: false
            referencedRelation: "academies"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "courses_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "categories"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "courses_instructor_id_fkey"
            columns: ["instructor_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      crm_contacts: {
        Row: {
          academy_id: string
          created_at: string
          custom_fields: Json
          email: string
          first_name: string | null
          id: string
          last_name: string | null
          phone: string | null
          source: string | null
          subscribed: boolean
          tags: string[]
          unsubscribed_at: string | null
          updated_at: string
          user_id: string | null
        }
        Insert: {
          academy_id: string
          created_at?: string
          custom_fields?: Json
          email: string
          first_name?: string | null
          id?: string
          last_name?: string | null
          phone?: string | null
          source?: string | null
          subscribed?: boolean
          tags?: string[]
          unsubscribed_at?: string | null
          updated_at?: string
          user_id?: string | null
        }
        Update: {
          academy_id?: string
          created_at?: string
          custom_fields?: Json
          email?: string
          first_name?: string | null
          id?: string
          last_name?: string | null
          phone?: string | null
          source?: string | null
          subscribed?: boolean
          tags?: string[]
          unsubscribed_at?: string | null
          updated_at?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "crm_contacts_academy_id_fkey"
            columns: ["academy_id"]
            isOneToOne: false
            referencedRelation: "academies"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "crm_contacts_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      email_campaigns: {
        Row: {
          academy_id: string
          audience_filter: Json
          body_html: string
          click_count: number
          created_at: string
          created_by: string
          id: string
          open_count: number
          preview_text: string | null
          recipient_count: number
          scheduled_at: string | null
          sent_at: string | null
          status: Database["public"]["Enums"]["campaign_status_enum"]
          subject: string
          updated_at: string
        }
        Insert: {
          academy_id: string
          audience_filter?: Json
          body_html: string
          click_count?: number
          created_at?: string
          created_by: string
          id?: string
          open_count?: number
          preview_text?: string | null
          recipient_count?: number
          scheduled_at?: string | null
          sent_at?: string | null
          status?: Database["public"]["Enums"]["campaign_status_enum"]
          subject: string
          updated_at?: string
        }
        Update: {
          academy_id?: string
          audience_filter?: Json
          body_html?: string
          click_count?: number
          created_at?: string
          created_by?: string
          id?: string
          open_count?: number
          preview_text?: string | null
          recipient_count?: number
          scheduled_at?: string | null
          sent_at?: string | null
          status?: Database["public"]["Enums"]["campaign_status_enum"]
          subject?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "email_campaigns_academy_id_fkey"
            columns: ["academy_id"]
            isOneToOne: false
            referencedRelation: "academies"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "email_campaigns_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      email_sends: {
        Row: {
          bounced: boolean
          campaign_id: string
          clicked_at: string | null
          contact_id: string
          id: string
          opened_at: string | null
          sent_at: string | null
          unsubscribed: boolean
        }
        Insert: {
          bounced?: boolean
          campaign_id: string
          clicked_at?: string | null
          contact_id: string
          id?: string
          opened_at?: string | null
          sent_at?: string | null
          unsubscribed?: boolean
        }
        Update: {
          bounced?: boolean
          campaign_id?: string
          clicked_at?: string | null
          contact_id?: string
          id?: string
          opened_at?: string | null
          sent_at?: string | null
          unsubscribed?: boolean
        }
        Relationships: [
          {
            foreignKeyName: "email_sends_campaign_id_fkey"
            columns: ["campaign_id"]
            isOneToOne: false
            referencedRelation: "email_campaigns"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "email_sends_contact_id_fkey"
            columns: ["contact_id"]
            isOneToOne: false
            referencedRelation: "crm_contacts"
            referencedColumns: ["id"]
          },
        ]
      }
      enrollments: {
        Row: {
          academy_id: string
          affiliate_id: string | null
          completed_at: string | null
          coupon_id: string | null
          course_id: string
          created_at: string
          enrolled_at: string
          expires_at: string | null
          id: string
          payment_id: string | null
          status: Database["public"]["Enums"]["enrollment_status_enum"]
          updated_at: string
          user_id: string
        }
        Insert: {
          academy_id: string
          affiliate_id?: string | null
          completed_at?: string | null
          coupon_id?: string | null
          course_id: string
          created_at?: string
          enrolled_at?: string
          expires_at?: string | null
          id?: string
          payment_id?: string | null
          status?: Database["public"]["Enums"]["enrollment_status_enum"]
          updated_at?: string
          user_id: string
        }
        Update: {
          academy_id?: string
          affiliate_id?: string | null
          completed_at?: string | null
          coupon_id?: string | null
          course_id?: string
          created_at?: string
          enrolled_at?: string
          expires_at?: string | null
          id?: string
          payment_id?: string | null
          status?: Database["public"]["Enums"]["enrollment_status_enum"]
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "enrollments_academy_id_fkey"
            columns: ["academy_id"]
            isOneToOne: false
            referencedRelation: "academies"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "enrollments_course_id_fkey"
            columns: ["course_id"]
            isOneToOne: false
            referencedRelation: "courses"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "enrollments_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fk_enrollments_affiliate"
            columns: ["affiliate_id"]
            isOneToOne: false
            referencedRelation: "affiliates"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fk_enrollments_coupon"
            columns: ["coupon_id"]
            isOneToOne: false
            referencedRelation: "coupons"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fk_enrollments_payment"
            columns: ["payment_id"]
            isOneToOne: false
            referencedRelation: "payments"
            referencedColumns: ["id"]
          },
        ]
      }
      group_members: {
        Row: {
          group_id: string
          id: string
          joined_at: string
          role: string
          user_id: string
        }
        Insert: {
          group_id: string
          id?: string
          joined_at?: string
          role?: string
          user_id: string
        }
        Update: {
          group_id?: string
          id?: string
          joined_at?: string
          role?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "group_members_group_id_fkey"
            columns: ["group_id"]
            isOneToOne: false
            referencedRelation: "groups"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "group_members_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      groups: {
        Row: {
          academy_id: string
          cover_url: string | null
          created_at: string
          created_by: string
          deleted_at: string | null
          description: string | null
          id: string
          member_count: number
          name: string
          slug: string
          updated_at: string
          visibility: Database["public"]["Enums"]["group_visibility_enum"]
        }
        Insert: {
          academy_id: string
          cover_url?: string | null
          created_at?: string
          created_by: string
          deleted_at?: string | null
          description?: string | null
          id?: string
          member_count?: number
          name: string
          slug: string
          updated_at?: string
          visibility?: Database["public"]["Enums"]["group_visibility_enum"]
        }
        Update: {
          academy_id?: string
          cover_url?: string | null
          created_at?: string
          created_by?: string
          deleted_at?: string | null
          description?: string | null
          id?: string
          member_count?: number
          name?: string
          slug?: string
          updated_at?: string
          visibility?: Database["public"]["Enums"]["group_visibility_enum"]
        }
        Relationships: [
          {
            foreignKeyName: "groups_academy_id_fkey"
            columns: ["academy_id"]
            isOneToOne: false
            referencedRelation: "academies"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "groups_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      hashtags: {
        Row: {
          academy_id: string
          created_at: string
          id: string
          post_count: number
          tag: string
        }
        Insert: {
          academy_id: string
          created_at?: string
          id?: string
          post_count?: number
          tag: string
        }
        Update: {
          academy_id?: string
          created_at?: string
          id?: string
          post_count?: number
          tag?: string
        }
        Relationships: [
          {
            foreignKeyName: "hashtags_academy_id_fkey"
            columns: ["academy_id"]
            isOneToOne: false
            referencedRelation: "academies"
            referencedColumns: ["id"]
          },
        ]
      }
      invitations: {
        Row: {
          academy_id: string
          accepted_at: string | null
          created_at: string
          email: string
          expires_at: string
          id: string
          invited_by: string
          role: Database["public"]["Enums"]["role_enum"]
          status: Database["public"]["Enums"]["invitation_status_enum"]
          token: string
          updated_at: string
        }
        Insert: {
          academy_id: string
          accepted_at?: string | null
          created_at?: string
          email: string
          expires_at?: string
          id?: string
          invited_by: string
          role?: Database["public"]["Enums"]["role_enum"]
          status?: Database["public"]["Enums"]["invitation_status_enum"]
          token?: string
          updated_at?: string
        }
        Update: {
          academy_id?: string
          accepted_at?: string | null
          created_at?: string
          email?: string
          expires_at?: string
          id?: string
          invited_by?: string
          role?: Database["public"]["Enums"]["role_enum"]
          status?: Database["public"]["Enums"]["invitation_status_enum"]
          token?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "invitations_academy_id_fkey"
            columns: ["academy_id"]
            isOneToOne: false
            referencedRelation: "academies"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "invitations_invited_by_fkey"
            columns: ["invited_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      knowledge_bases: {
        Row: {
          academy_id: string
          created_at: string
          created_by: string
          description: string | null
          id: string
          name: string
          updated_at: string
        }
        Insert: {
          academy_id: string
          created_at?: string
          created_by: string
          description?: string | null
          id?: string
          name: string
          updated_at?: string
        }
        Update: {
          academy_id?: string
          created_at?: string
          created_by?: string
          description?: string | null
          id?: string
          name?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "knowledge_bases_academy_id_fkey"
            columns: ["academy_id"]
            isOneToOne: false
            referencedRelation: "academies"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "knowledge_bases_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      knowledge_documents: {
        Row: {
          academy_id: string
          chunk_count: number
          content_text: string | null
          created_at: string
          error_message: string | null
          file_url: string | null
          id: string
          knowledge_base_id: string
          source: Database["public"]["Enums"]["kb_source_enum"]
          status: string
          title: string
          updated_at: string
          web_url: string | null
        }
        Insert: {
          academy_id: string
          chunk_count?: number
          content_text?: string | null
          created_at?: string
          error_message?: string | null
          file_url?: string | null
          id?: string
          knowledge_base_id: string
          source?: Database["public"]["Enums"]["kb_source_enum"]
          status?: string
          title: string
          updated_at?: string
          web_url?: string | null
        }
        Update: {
          academy_id?: string
          chunk_count?: number
          content_text?: string | null
          created_at?: string
          error_message?: string | null
          file_url?: string | null
          id?: string
          knowledge_base_id?: string
          source?: Database["public"]["Enums"]["kb_source_enum"]
          status?: string
          title?: string
          updated_at?: string
          web_url?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "knowledge_documents_academy_id_fkey"
            columns: ["academy_id"]
            isOneToOne: false
            referencedRelation: "academies"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "knowledge_documents_knowledge_base_id_fkey"
            columns: ["knowledge_base_id"]
            isOneToOne: false
            referencedRelation: "knowledge_bases"
            referencedColumns: ["id"]
          },
        ]
      }
      lesson_progress: {
        Row: {
          academy_id: string
          completed_at: string | null
          created_at: string
          enrollment_id: string | null
          id: string
          last_position_s: number
          lesson_id: string
          status: Database["public"]["Enums"]["lesson_status_enum"]
          updated_at: string
          user_id: string
          watch_percent: number
        }
        Insert: {
          academy_id: string
          completed_at?: string | null
          created_at?: string
          enrollment_id?: string | null
          id?: string
          last_position_s?: number
          lesson_id: string
          status?: Database["public"]["Enums"]["lesson_status_enum"]
          updated_at?: string
          user_id: string
          watch_percent?: number
        }
        Update: {
          academy_id?: string
          completed_at?: string | null
          created_at?: string
          enrollment_id?: string | null
          id?: string
          last_position_s?: number
          lesson_id?: string
          status?: Database["public"]["Enums"]["lesson_status_enum"]
          updated_at?: string
          user_id?: string
          watch_percent?: number
        }
        Relationships: [
          {
            foreignKeyName: "lesson_progress_academy_id_fkey"
            columns: ["academy_id"]
            isOneToOne: false
            referencedRelation: "academies"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "lesson_progress_enrollment_id_fkey"
            columns: ["enrollment_id"]
            isOneToOne: false
            referencedRelation: "enrollments"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "lesson_progress_lesson_id_fkey"
            columns: ["lesson_id"]
            isOneToOne: false
            referencedRelation: "lessons"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "lesson_progress_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      lesson_resources: {
        Row: {
          academy_id: string
          created_at: string
          id: string
          lesson_id: string
          mime_type: string | null
          position: number
          size_bytes: number | null
          title: string
          updated_at: string
          url: string
        }
        Insert: {
          academy_id: string
          created_at?: string
          id?: string
          lesson_id: string
          mime_type?: string | null
          position?: number
          size_bytes?: number | null
          title: string
          updated_at?: string
          url: string
        }
        Update: {
          academy_id?: string
          created_at?: string
          id?: string
          lesson_id?: string
          mime_type?: string | null
          position?: number
          size_bytes?: number | null
          title?: string
          updated_at?: string
          url?: string
        }
        Relationships: [
          {
            foreignKeyName: "lesson_resources_academy_id_fkey"
            columns: ["academy_id"]
            isOneToOne: false
            referencedRelation: "academies"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "lesson_resources_lesson_id_fkey"
            columns: ["lesson_id"]
            isOneToOne: false
            referencedRelation: "lessons"
            referencedColumns: ["id"]
          },
        ]
      }
      lessons: {
        Row: {
          academy_id: string
          ai_summary: string | null
          ai_transcript: string | null
          body: string | null
          content_type: Database["public"]["Enums"]["content_type_enum"]
          course_id: string
          created_at: string
          deleted_at: string | null
          id: string
          is_free_preview: boolean
          is_published: boolean
          media_meta: Json
          media_url: string | null
          module_id: string
          position: number
          title: string
          updated_at: string
        }
        Insert: {
          academy_id: string
          ai_summary?: string | null
          ai_transcript?: string | null
          body?: string | null
          content_type?: Database["public"]["Enums"]["content_type_enum"]
          course_id: string
          created_at?: string
          deleted_at?: string | null
          id?: string
          is_free_preview?: boolean
          is_published?: boolean
          media_meta?: Json
          media_url?: string | null
          module_id: string
          position?: number
          title: string
          updated_at?: string
        }
        Update: {
          academy_id?: string
          ai_summary?: string | null
          ai_transcript?: string | null
          body?: string | null
          content_type?: Database["public"]["Enums"]["content_type_enum"]
          course_id?: string
          created_at?: string
          deleted_at?: string | null
          id?: string
          is_free_preview?: boolean
          is_published?: boolean
          media_meta?: Json
          media_url?: string | null
          module_id?: string
          position?: number
          title?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "lessons_academy_id_fkey"
            columns: ["academy_id"]
            isOneToOne: false
            referencedRelation: "academies"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "lessons_course_id_fkey"
            columns: ["course_id"]
            isOneToOne: false
            referencedRelation: "courses"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "lessons_module_id_fkey"
            columns: ["module_id"]
            isOneToOne: false
            referencedRelation: "modules"
            referencedColumns: ["id"]
          },
        ]
      }
      levels: {
        Row: {
          badge_url: string | null
          created_at: string
          level_number: number
          title: string
          xp_required: number
        }
        Insert: {
          badge_url?: string | null
          created_at?: string
          level_number: number
          title: string
          xp_required: number
        }
        Update: {
          badge_url?: string | null
          created_at?: string
          level_number?: number
          title?: string
          xp_required?: number
        }
        Relationships: []
      }
      live_sessions: {
        Row: {
          academy_id: string
          calendar_event_id: string | null
          course_id: string | null
          created_at: string
          created_by: string
          ends_at: string | null
          id: string
          provider: Database["public"]["Enums"]["live_provider_enum"]
          provider_id: string | null
          provider_url: string | null
          recording_url: string | null
          starts_at: string
          title: string
          updated_at: string
        }
        Insert: {
          academy_id: string
          calendar_event_id?: string | null
          course_id?: string | null
          created_at?: string
          created_by: string
          ends_at?: string | null
          id?: string
          provider?: Database["public"]["Enums"]["live_provider_enum"]
          provider_id?: string | null
          provider_url?: string | null
          recording_url?: string | null
          starts_at: string
          title: string
          updated_at?: string
        }
        Update: {
          academy_id?: string
          calendar_event_id?: string | null
          course_id?: string | null
          created_at?: string
          created_by?: string
          ends_at?: string | null
          id?: string
          provider?: Database["public"]["Enums"]["live_provider_enum"]
          provider_id?: string | null
          provider_url?: string | null
          recording_url?: string | null
          starts_at?: string
          title?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "live_sessions_academy_id_fkey"
            columns: ["academy_id"]
            isOneToOne: false
            referencedRelation: "academies"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "live_sessions_calendar_event_id_fkey"
            columns: ["calendar_event_id"]
            isOneToOne: false
            referencedRelation: "calendar_events"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "live_sessions_course_id_fkey"
            columns: ["course_id"]
            isOneToOne: false
            referencedRelation: "courses"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "live_sessions_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      memberships: {
        Row: {
          academy_id: string
          id: string
          joined_at: string
          role: Database["public"]["Enums"]["role_enum"]
          updated_at: string
          user_id: string
        }
        Insert: {
          academy_id: string
          id?: string
          joined_at?: string
          role?: Database["public"]["Enums"]["role_enum"]
          updated_at?: string
          user_id: string
        }
        Update: {
          academy_id?: string
          id?: string
          joined_at?: string
          role?: Database["public"]["Enums"]["role_enum"]
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "memberships_academy_id_fkey"
            columns: ["academy_id"]
            isOneToOne: false
            referencedRelation: "academies"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "memberships_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      mentions: {
        Row: {
          academy_id: string
          created_at: string
          created_by: string
          entity_id: string
          entity_type: Database["public"]["Enums"]["comment_entity_enum"]
          id: string
          mentioned_user: string
        }
        Insert: {
          academy_id: string
          created_at?: string
          created_by: string
          entity_id: string
          entity_type: Database["public"]["Enums"]["comment_entity_enum"]
          id?: string
          mentioned_user: string
        }
        Update: {
          academy_id?: string
          created_at?: string
          created_by?: string
          entity_id?: string
          entity_type?: Database["public"]["Enums"]["comment_entity_enum"]
          id?: string
          mentioned_user?: string
        }
        Relationships: [
          {
            foreignKeyName: "mentions_academy_id_fkey"
            columns: ["academy_id"]
            isOneToOne: false
            referencedRelation: "academies"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "mentions_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "mentions_mentioned_user_fkey"
            columns: ["mentioned_user"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      messages: {
        Row: {
          academy_id: string
          attachment_type:
            | Database["public"]["Enums"]["attachment_type_enum"]
            | null
          attachment_url: string | null
          body: string | null
          call_session_id: string | null
          conversation_id: string
          created_at: string
          deleted_at: string | null
          id: string
          reply_to_id: string | null
          sender_id: string
          updated_at: string
        }
        Insert: {
          academy_id: string
          attachment_type?:
            | Database["public"]["Enums"]["attachment_type_enum"]
            | null
          attachment_url?: string | null
          body?: string | null
          call_session_id?: string | null
          conversation_id: string
          created_at?: string
          deleted_at?: string | null
          id?: string
          reply_to_id?: string | null
          sender_id: string
          updated_at?: string
        }
        Update: {
          academy_id?: string
          attachment_type?:
            | Database["public"]["Enums"]["attachment_type_enum"]
            | null
          attachment_url?: string | null
          body?: string | null
          call_session_id?: string | null
          conversation_id?: string
          created_at?: string
          deleted_at?: string | null
          id?: string
          reply_to_id?: string | null
          sender_id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "messages_academy_id_fkey"
            columns: ["academy_id"]
            isOneToOne: false
            referencedRelation: "academies"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "messages_conversation_id_fkey"
            columns: ["conversation_id"]
            isOneToOne: false
            referencedRelation: "conversations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "messages_reply_to_id_fkey"
            columns: ["reply_to_id"]
            isOneToOne: false
            referencedRelation: "messages"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "messages_sender_id_fkey"
            columns: ["sender_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      modules: {
        Row: {
          academy_id: string
          course_id: string
          created_at: string
          description: string | null
          id: string
          is_free_preview: boolean
          position: number
          title: string
          updated_at: string
        }
        Insert: {
          academy_id: string
          course_id: string
          created_at?: string
          description?: string | null
          id?: string
          is_free_preview?: boolean
          position?: number
          title: string
          updated_at?: string
        }
        Update: {
          academy_id?: string
          course_id?: string
          created_at?: string
          description?: string | null
          id?: string
          is_free_preview?: boolean
          position?: number
          title?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "modules_academy_id_fkey"
            columns: ["academy_id"]
            isOneToOne: false
            referencedRelation: "academies"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "modules_course_id_fkey"
            columns: ["course_id"]
            isOneToOne: false
            referencedRelation: "courses"
            referencedColumns: ["id"]
          },
        ]
      }
      notes: {
        Row: {
          academy_id: string
          body: string
          created_at: string
          id: string
          lesson_id: string
          position_s: number | null
          updated_at: string
          user_id: string
        }
        Insert: {
          academy_id: string
          body: string
          created_at?: string
          id?: string
          lesson_id: string
          position_s?: number | null
          updated_at?: string
          user_id: string
        }
        Update: {
          academy_id?: string
          body?: string
          created_at?: string
          id?: string
          lesson_id?: string
          position_s?: number | null
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "notes_academy_id_fkey"
            columns: ["academy_id"]
            isOneToOne: false
            referencedRelation: "academies"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "notes_lesson_id_fkey"
            columns: ["lesson_id"]
            isOneToOne: false
            referencedRelation: "lessons"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "notes_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      payments: {
        Row: {
          academy_id: string
          amount: number
          created_at: string
          currency: string
          enrollment_id: string | null
          id: string
          metadata: Json
          paid_at: string | null
          provider: Database["public"]["Enums"]["payment_provider_enum"]
          provider_txn_id: string | null
          status: Database["public"]["Enums"]["payment_status_enum"]
          subscription_id: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          academy_id: string
          amount: number
          created_at?: string
          currency?: string
          enrollment_id?: string | null
          id?: string
          metadata?: Json
          paid_at?: string | null
          provider: Database["public"]["Enums"]["payment_provider_enum"]
          provider_txn_id?: string | null
          status?: Database["public"]["Enums"]["payment_status_enum"]
          subscription_id?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          academy_id?: string
          amount?: number
          created_at?: string
          currency?: string
          enrollment_id?: string | null
          id?: string
          metadata?: Json
          paid_at?: string | null
          provider?: Database["public"]["Enums"]["payment_provider_enum"]
          provider_txn_id?: string | null
          status?: Database["public"]["Enums"]["payment_status_enum"]
          subscription_id?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "payments_academy_id_fkey"
            columns: ["academy_id"]
            isOneToOne: false
            referencedRelation: "academies"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "payments_enrollment_id_fkey"
            columns: ["enrollment_id"]
            isOneToOne: false
            referencedRelation: "enrollments"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "payments_subscription_id_fkey"
            columns: ["subscription_id"]
            isOneToOne: false
            referencedRelation: "subscriptions"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "payments_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      payouts: {
        Row: {
          academy_id: string
          affiliate_id: string | null
          amount: number
          created_at: string
          currency: string
          id: string
          paid_at: string | null
          provider: Database["public"]["Enums"]["payment_provider_enum"]
          provider_ref: string | null
          user_id: string
        }
        Insert: {
          academy_id: string
          affiliate_id?: string | null
          amount: number
          created_at?: string
          currency?: string
          id?: string
          paid_at?: string | null
          provider?: Database["public"]["Enums"]["payment_provider_enum"]
          provider_ref?: string | null
          user_id: string
        }
        Update: {
          academy_id?: string
          affiliate_id?: string | null
          amount?: number
          created_at?: string
          currency?: string
          id?: string
          paid_at?: string | null
          provider?: Database["public"]["Enums"]["payment_provider_enum"]
          provider_ref?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "payouts_academy_id_fkey"
            columns: ["academy_id"]
            isOneToOne: false
            referencedRelation: "academies"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "payouts_affiliate_id_fkey"
            columns: ["affiliate_id"]
            isOneToOne: false
            referencedRelation: "affiliates"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "payouts_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      pipeline_artifacts: {
        Row: {
          academy_id: string
          created_at: string
          id: string
          job_id: string
          kind: string
          mime_type: string | null
          size_bytes: number | null
          url: string
        }
        Insert: {
          academy_id: string
          created_at?: string
          id?: string
          job_id: string
          kind: string
          mime_type?: string | null
          size_bytes?: number | null
          url: string
        }
        Update: {
          academy_id?: string
          created_at?: string
          id?: string
          job_id?: string
          kind?: string
          mime_type?: string | null
          size_bytes?: number | null
          url?: string
        }
        Relationships: [
          {
            foreignKeyName: "pipeline_artifacts_academy_id_fkey"
            columns: ["academy_id"]
            isOneToOne: false
            referencedRelation: "academies"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "pipeline_artifacts_job_id_fkey"
            columns: ["job_id"]
            isOneToOne: false
            referencedRelation: "pipeline_jobs"
            referencedColumns: ["id"]
          },
        ]
      }
      pipeline_jobs: {
        Row: {
          academy_id: string
          brief: Json
          course_id: string | null
          created_at: string
          created_by: string | null
          engine_job_id: string | null
          error: string | null
          id: string
          lesson_id: string | null
          outline: Json | null
          output_url: string | null
          status: string
          updated_at: string
        }
        Insert: {
          academy_id: string
          brief?: Json
          course_id?: string | null
          created_at?: string
          created_by?: string | null
          engine_job_id?: string | null
          error?: string | null
          id?: string
          lesson_id?: string | null
          outline?: Json | null
          output_url?: string | null
          status?: string
          updated_at?: string
        }
        Update: {
          academy_id?: string
          brief?: Json
          course_id?: string | null
          created_at?: string
          created_by?: string | null
          engine_job_id?: string | null
          error?: string | null
          id?: string
          lesson_id?: string | null
          outline?: Json | null
          output_url?: string | null
          status?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "pipeline_jobs_academy_id_fkey"
            columns: ["academy_id"]
            isOneToOne: false
            referencedRelation: "academies"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "pipeline_jobs_course_id_fkey"
            columns: ["course_id"]
            isOneToOne: false
            referencedRelation: "courses"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "pipeline_jobs_lesson_id_fkey"
            columns: ["lesson_id"]
            isOneToOne: false
            referencedRelation: "lessons"
            referencedColumns: ["id"]
          },
        ]
      }
      plans: {
        Row: {
          created_at: string
          currency: string
          features: Json
          id: string
          is_public: boolean
          max_academies: number | null
          max_students: number | null
          name: string
          price_annual: number | null
          price_monthly: number | null
          slug: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          currency?: string
          features?: Json
          id?: string
          is_public?: boolean
          max_academies?: number | null
          max_students?: number | null
          name: string
          price_annual?: number | null
          price_monthly?: number | null
          slug: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          currency?: string
          features?: Json
          id?: string
          is_public?: boolean
          max_academies?: number | null
          max_students?: number | null
          name?: string
          price_annual?: number | null
          price_monthly?: number | null
          slug?: string
          updated_at?: string
        }
        Relationships: []
      }
      post_hashtags: {
        Row: {
          hashtag_id: string
          post_id: string
        }
        Insert: {
          hashtag_id: string
          post_id: string
        }
        Update: {
          hashtag_id?: string
          post_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "post_hashtags_hashtag_id_fkey"
            columns: ["hashtag_id"]
            isOneToOne: false
            referencedRelation: "hashtags"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "post_hashtags_post_id_fkey"
            columns: ["post_id"]
            isOneToOne: false
            referencedRelation: "posts"
            referencedColumns: ["id"]
          },
        ]
      }
      post_reactions: {
        Row: {
          created_at: string
          emoji: string
          id: string
          post_id: string
          user_id: string
        }
        Insert: {
          created_at?: string
          emoji?: string
          id?: string
          post_id: string
          user_id: string
        }
        Update: {
          created_at?: string
          emoji?: string
          id?: string
          post_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "post_reactions_post_id_fkey"
            columns: ["post_id"]
            isOneToOne: false
            referencedRelation: "posts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "post_reactions_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      posts: {
        Row: {
          academy_id: string
          body: string
          comment_count: number
          created_at: string
          deleted_at: string | null
          group_id: string | null
          id: string
          is_announcement: boolean
          is_pinned: boolean
          like_count: number
          media_urls: string[]
          title: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          academy_id: string
          body: string
          comment_count?: number
          created_at?: string
          deleted_at?: string | null
          group_id?: string | null
          id?: string
          is_announcement?: boolean
          is_pinned?: boolean
          like_count?: number
          media_urls?: string[]
          title?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          academy_id?: string
          body?: string
          comment_count?: number
          created_at?: string
          deleted_at?: string | null
          group_id?: string | null
          id?: string
          is_announcement?: boolean
          is_pinned?: boolean
          like_count?: number
          media_urls?: string[]
          title?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "posts_academy_id_fkey"
            columns: ["academy_id"]
            isOneToOne: false
            referencedRelation: "academies"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "posts_group_id_fkey"
            columns: ["group_id"]
            isOneToOne: false
            referencedRelation: "groups"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "posts_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          avatar_url: string | null
          bio: string | null
          created_at: string
          display_name: string
          id: string
          is_platform_admin: boolean
          is_public: boolean
          locale: string
          social_links: Json
          timezone: string
          updated_at: string
          website_url: string | null
        }
        Insert: {
          avatar_url?: string | null
          bio?: string | null
          created_at?: string
          display_name?: string
          id: string
          is_platform_admin?: boolean
          is_public?: boolean
          locale?: string
          social_links?: Json
          timezone?: string
          updated_at?: string
          website_url?: string | null
        }
        Update: {
          avatar_url?: string | null
          bio?: string | null
          created_at?: string
          display_name?: string
          id?: string
          is_platform_admin?: boolean
          is_public?: boolean
          locale?: string
          social_links?: Json
          timezone?: string
          updated_at?: string
          website_url?: string | null
        }
        Relationships: []
      }
      push_subscriptions: {
        Row: {
          academy_id: string
          auth_key: string | null
          created_at: string
          device_type: string | null
          endpoint: string
          id: string
          p256dh: string | null
          user_id: string
        }
        Insert: {
          academy_id: string
          auth_key?: string | null
          created_at?: string
          device_type?: string | null
          endpoint: string
          id?: string
          p256dh?: string | null
          user_id: string
        }
        Update: {
          academy_id?: string
          auth_key?: string | null
          created_at?: string
          device_type?: string | null
          endpoint?: string
          id?: string
          p256dh?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "push_subscriptions_academy_id_fkey"
            columns: ["academy_id"]
            isOneToOne: false
            referencedRelation: "academies"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "push_subscriptions_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      question_options: {
        Row: {
          body: string
          created_at: string
          id: string
          is_correct: boolean
          match_key: string | null
          position: number
          question_id: string
        }
        Insert: {
          body: string
          created_at?: string
          id?: string
          is_correct?: boolean
          match_key?: string | null
          position?: number
          question_id: string
        }
        Update: {
          body?: string
          created_at?: string
          id?: string
          is_correct?: boolean
          match_key?: string | null
          position?: number
          question_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "question_options_question_id_fkey"
            columns: ["question_id"]
            isOneToOne: false
            referencedRelation: "questions"
            referencedColumns: ["id"]
          },
        ]
      }
      questions: {
        Row: {
          academy_id: string
          body: string
          created_at: string
          explanation: string | null
          id: string
          media_url: string | null
          points: number
          position: number
          question_type: Database["public"]["Enums"]["question_type_enum"]
          quiz_id: string
          updated_at: string
        }
        Insert: {
          academy_id: string
          body: string
          created_at?: string
          explanation?: string | null
          id?: string
          media_url?: string | null
          points?: number
          position?: number
          question_type?: Database["public"]["Enums"]["question_type_enum"]
          quiz_id: string
          updated_at?: string
        }
        Update: {
          academy_id?: string
          body?: string
          created_at?: string
          explanation?: string | null
          id?: string
          media_url?: string | null
          points?: number
          position?: number
          question_type?: Database["public"]["Enums"]["question_type_enum"]
          quiz_id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "questions_academy_id_fkey"
            columns: ["academy_id"]
            isOneToOne: false
            referencedRelation: "academies"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "questions_quiz_id_fkey"
            columns: ["quiz_id"]
            isOneToOne: false
            referencedRelation: "quizzes"
            referencedColumns: ["id"]
          },
        ]
      }
      quizzes: {
        Row: {
          academy_id: string
          ai_generated: boolean
          course_id: string
          created_at: string
          description: string | null
          id: string
          lesson_id: string | null
          max_attempts: number | null
          pass_score: number
          show_correct_after: boolean
          shuffle_questions: boolean
          time_limit_s: number | null
          title: string
          updated_at: string
        }
        Insert: {
          academy_id: string
          ai_generated?: boolean
          course_id: string
          created_at?: string
          description?: string | null
          id?: string
          lesson_id?: string | null
          max_attempts?: number | null
          pass_score?: number
          show_correct_after?: boolean
          shuffle_questions?: boolean
          time_limit_s?: number | null
          title: string
          updated_at?: string
        }
        Update: {
          academy_id?: string
          ai_generated?: boolean
          course_id?: string
          created_at?: string
          description?: string | null
          id?: string
          lesson_id?: string | null
          max_attempts?: number | null
          pass_score?: number
          show_correct_after?: boolean
          shuffle_questions?: boolean
          time_limit_s?: number | null
          title?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "quizzes_academy_id_fkey"
            columns: ["academy_id"]
            isOneToOne: false
            referencedRelation: "academies"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "quizzes_course_id_fkey"
            columns: ["course_id"]
            isOneToOne: false
            referencedRelation: "courses"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "quizzes_lesson_id_fkey"
            columns: ["lesson_id"]
            isOneToOne: false
            referencedRelation: "lessons"
            referencedColumns: ["id"]
          },
        ]
      }
      referrals: {
        Row: {
          affiliate_id: string
          commission: number | null
          created_at: string
          id: string
          paid_out: boolean
          payment_id: string | null
          referred_user: string
        }
        Insert: {
          affiliate_id: string
          commission?: number | null
          created_at?: string
          id?: string
          paid_out?: boolean
          payment_id?: string | null
          referred_user: string
        }
        Update: {
          affiliate_id?: string
          commission?: number | null
          created_at?: string
          id?: string
          paid_out?: boolean
          payment_id?: string | null
          referred_user?: string
        }
        Relationships: [
          {
            foreignKeyName: "referrals_affiliate_id_fkey"
            columns: ["affiliate_id"]
            isOneToOne: false
            referencedRelation: "affiliates"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "referrals_payment_id_fkey"
            columns: ["payment_id"]
            isOneToOne: false
            referencedRelation: "payments"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "referrals_referred_user_fkey"
            columns: ["referred_user"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      streaks: {
        Row: {
          academy_id: string
          current_streak: number
          last_activity: string | null
          longest_streak: number
          updated_at: string
          user_id: string
        }
        Insert: {
          academy_id: string
          current_streak?: number
          last_activity?: string | null
          longest_streak?: number
          updated_at?: string
          user_id: string
        }
        Update: {
          academy_id?: string
          current_streak?: number
          last_activity?: string | null
          longest_streak?: number
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "streaks_academy_id_fkey"
            columns: ["academy_id"]
            isOneToOne: false
            referencedRelation: "academies"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "streaks_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      submissions: {
        Row: {
          academy_id: string
          ai_review_id: string | null
          assignment_id: string
          body: string | null
          created_at: string
          feedback: string | null
          file_url: string | null
          graded_at: string | null
          graded_by: string | null
          id: string
          max_score: number | null
          score: number | null
          submission_type: Database["public"]["Enums"]["submission_type_enum"]
          submitted_at: string
          updated_at: string
          user_id: string
          video_url: string | null
        }
        Insert: {
          academy_id: string
          ai_review_id?: string | null
          assignment_id: string
          body?: string | null
          created_at?: string
          feedback?: string | null
          file_url?: string | null
          graded_at?: string | null
          graded_by?: string | null
          id?: string
          max_score?: number | null
          score?: number | null
          submission_type?: Database["public"]["Enums"]["submission_type_enum"]
          submitted_at?: string
          updated_at?: string
          user_id: string
          video_url?: string | null
        }
        Update: {
          academy_id?: string
          ai_review_id?: string | null
          assignment_id?: string
          body?: string | null
          created_at?: string
          feedback?: string | null
          file_url?: string | null
          graded_at?: string | null
          graded_by?: string | null
          id?: string
          max_score?: number | null
          score?: number | null
          submission_type?: Database["public"]["Enums"]["submission_type_enum"]
          submitted_at?: string
          updated_at?: string
          user_id?: string
          video_url?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "submissions_academy_id_fkey"
            columns: ["academy_id"]
            isOneToOne: false
            referencedRelation: "academies"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "submissions_assignment_id_fkey"
            columns: ["assignment_id"]
            isOneToOne: false
            referencedRelation: "assignments"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "submissions_graded_by_fkey"
            columns: ["graded_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "submissions_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      subscriptions: {
        Row: {
          academy_id: string
          canceled_at: string | null
          created_at: string
          current_period_end: string | null
          current_period_start: string | null
          id: string
          interval: Database["public"]["Enums"]["billing_interval_enum"]
          plan_id: string
          provider: Database["public"]["Enums"]["payment_provider_enum"]
          provider_sub_id: string | null
          status: Database["public"]["Enums"]["subscription_status_enum"]
          trial_ends_at: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          academy_id: string
          canceled_at?: string | null
          created_at?: string
          current_period_end?: string | null
          current_period_start?: string | null
          id?: string
          interval?: Database["public"]["Enums"]["billing_interval_enum"]
          plan_id: string
          provider?: Database["public"]["Enums"]["payment_provider_enum"]
          provider_sub_id?: string | null
          status?: Database["public"]["Enums"]["subscription_status_enum"]
          trial_ends_at?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          academy_id?: string
          canceled_at?: string | null
          created_at?: string
          current_period_end?: string | null
          current_period_start?: string | null
          id?: string
          interval?: Database["public"]["Enums"]["billing_interval_enum"]
          plan_id?: string
          provider?: Database["public"]["Enums"]["payment_provider_enum"]
          provider_sub_id?: string | null
          status?: Database["public"]["Enums"]["subscription_status_enum"]
          trial_ends_at?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "subscriptions_academy_id_fkey"
            columns: ["academy_id"]
            isOneToOne: false
            referencedRelation: "academies"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "subscriptions_plan_id_fkey"
            columns: ["plan_id"]
            isOneToOne: false
            referencedRelation: "plans"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "subscriptions_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      user_badges: {
        Row: {
          academy_id: string
          badge_id: string
          earned_at: string
          id: string
          user_id: string
        }
        Insert: {
          academy_id: string
          badge_id: string
          earned_at?: string
          id?: string
          user_id: string
        }
        Update: {
          academy_id?: string
          badge_id?: string
          earned_at?: string
          id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_badges_academy_id_fkey"
            columns: ["academy_id"]
            isOneToOne: false
            referencedRelation: "academies"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "user_badges_badge_id_fkey"
            columns: ["badge_id"]
            isOneToOne: false
            referencedRelation: "badges"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "user_badges_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      user_xp: {
        Row: {
          academy_id: string
          current_level: number
          total_xp: number
          updated_at: string
          user_id: string
        }
        Insert: {
          academy_id: string
          current_level?: number
          total_xp?: number
          updated_at?: string
          user_id: string
        }
        Update: {
          academy_id?: string
          current_level?: number
          total_xp?: number
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_xp_academy_id_fkey"
            columns: ["academy_id"]
            isOneToOne: false
            referencedRelation: "academies"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "user_xp_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      webhooks: {
        Row: {
          academy_id: string
          created_at: string
          events: string[]
          id: string
          is_active: boolean
          last_triggered: string | null
          secret: string
          updated_at: string
          url: string
        }
        Insert: {
          academy_id: string
          created_at?: string
          events?: string[]
          id?: string
          is_active?: boolean
          last_triggered?: string | null
          secret?: string
          updated_at?: string
          url: string
        }
        Update: {
          academy_id?: string
          created_at?: string
          events?: string[]
          id?: string
          is_active?: boolean
          last_triggered?: string | null
          secret?: string
          updated_at?: string
          url?: string
        }
        Relationships: [
          {
            foreignKeyName: "webhooks_academy_id_fkey"
            columns: ["academy_id"]
            isOneToOne: false
            referencedRelation: "academies"
            referencedColumns: ["id"]
          },
        ]
      }
      xp_events: {
        Row: {
          academy_id: string
          amount: number
          entity_id: string | null
          id: string
          note: string | null
          occurred_at: string
          source: Database["public"]["Enums"]["xp_source_enum"]
          user_id: string
        }
        Insert: {
          academy_id: string
          amount: number
          entity_id?: string | null
          id?: string
          note?: string | null
          occurred_at?: string
          source: Database["public"]["Enums"]["xp_source_enum"]
          user_id: string
        }
        Update: {
          academy_id?: string
          amount?: number
          entity_id?: string | null
          id?: string
          note?: string | null
          occurred_at?: string
          source?: Database["public"]["Enums"]["xp_source_enum"]
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "xp_events_academy_id_fkey"
            columns: ["academy_id"]
            isOneToOne: false
            referencedRelation: "academies"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "xp_events_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      leaderboard: {
        Row: {
          academy_id: string | null
          avatar_url: string | null
          current_level: number | null
          display_name: string | null
          rank_all_time: number | null
          total_xp: number | null
          user_id: string | null
        }
        Relationships: [
          {
            foreignKeyName: "user_xp_academy_id_fkey"
            columns: ["academy_id"]
            isOneToOne: false
            referencedRelation: "academies"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "user_xp_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Functions: {
      auth_uid: { Args: never; Returns: string }
      has_role: {
        Args: {
          p_academy_id: string
          p_roles: Database["public"]["Enums"]["role_enum"][]
        }
        Returns: boolean
      }
      is_enrolled_in: { Args: { p_course_id: string }; Returns: boolean }
      is_listed_academy: { Args: { p_academy_id: string }; Returns: boolean }
      is_member_of: { Args: { p_academy_id: string }; Returns: boolean }
      is_owner_of: { Args: { p_academy_id: string }; Returns: boolean }
      is_platform_admin:
        | { Args: never; Returns: boolean }
        | { Args: { p_user_id: string }; Returns: boolean }
      show_limit: { Args: never; Returns: number }
      show_trgm: { Args: { "": string }; Returns: string[] }
    }
    Enums: {
      ai_model_enum:
        | "gpt"
        | "claude"
        | "gemini"
        | "grok"
        | "deepseek"
        | "mistral"
        | "llama"
        | "auto"
      attachment_type_enum: "image" | "file" | "audio" | "video" | "link"
      automation_status_enum: "active" | "paused" | "draft"
      billing_interval_enum: "monthly" | "annual" | "lifetime"
      campaign_status_enum:
        | "draft"
        | "scheduled"
        | "sending"
        | "sent"
        | "canceled"
      comment_entity_enum: "lesson" | "post" | "assignment"
      content_type_enum:
        | "video"
        | "audio"
        | "pdf"
        | "ppt"
        | "image"
        | "text"
        | "embed"
        | "link"
      course_type_enum:
        | "free"
        | "one_time"
        | "subscription"
        | "vip"
        | "private"
        | "cohort"
      drip_type_enum: "immediate" | "date" | "progress" | "xp"
      enrollment_status_enum:
        | "active"
        | "paused"
        | "expired"
        | "completed"
        | "refunded"
      group_visibility_enum: "public" | "private" | "vip"
      invitation_status_enum: "pending" | "accepted" | "expired" | "revoked"
      kb_source_enum:
        | "pdf"
        | "word"
        | "ppt"
        | "url"
        | "text"
        | "video_transcript"
      lesson_status_enum: "not_started" | "in_progress" | "completed"
      live_provider_enum: "zoom" | "google_meet" | "teams" | "custom"
      payment_provider_enum:
        | "sumit"
        | "stripe"
        | "paypal"
        | "tranzila"
        | "pelecard"
        | "manual"
      payment_status_enum:
        | "pending"
        | "succeeded"
        | "failed"
        | "refunded"
        | "disputed"
      question_type_enum:
        | "multiple_choice"
        | "open"
        | "true_false"
        | "match"
        | "fill_blank"
      report_status_enum: "open" | "reviewing" | "actioned" | "dismissed"
      role_enum: "owner" | "admin" | "instructor" | "student"
      submission_type_enum: "text" | "file" | "video" | "url"
      subscription_status_enum:
        | "trialing"
        | "active"
        | "past_due"
        | "canceled"
        | "expired"
      xp_source_enum:
        | "lesson_complete"
        | "quiz_pass"
        | "assignment_submit"
        | "streak_bonus"
        | "challenge_complete"
        | "badge_earned"
        | "post_created"
        | "comment_created"
        | "login_daily"
        | "referral"
        | "manual_grant"
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
      ai_model_enum: [
        "gpt",
        "claude",
        "gemini",
        "grok",
        "deepseek",
        "mistral",
        "llama",
        "auto",
      ],
      attachment_type_enum: ["image", "file", "audio", "video", "link"],
      automation_status_enum: ["active", "paused", "draft"],
      billing_interval_enum: ["monthly", "annual", "lifetime"],
      campaign_status_enum: [
        "draft",
        "scheduled",
        "sending",
        "sent",
        "canceled",
      ],
      comment_entity_enum: ["lesson", "post", "assignment"],
      content_type_enum: [
        "video",
        "audio",
        "pdf",
        "ppt",
        "image",
        "text",
        "embed",
        "link",
      ],
      course_type_enum: [
        "free",
        "one_time",
        "subscription",
        "vip",
        "private",
        "cohort",
      ],
      drip_type_enum: ["immediate", "date", "progress", "xp"],
      enrollment_status_enum: [
        "active",
        "paused",
        "expired",
        "completed",
        "refunded",
      ],
      group_visibility_enum: ["public", "private", "vip"],
      invitation_status_enum: ["pending", "accepted", "expired", "revoked"],
      kb_source_enum: ["pdf", "word", "ppt", "url", "text", "video_transcript"],
      lesson_status_enum: ["not_started", "in_progress", "completed"],
      live_provider_enum: ["zoom", "google_meet", "teams", "custom"],
      payment_provider_enum: [
        "sumit",
        "stripe",
        "paypal",
        "tranzila",
        "pelecard",
        "manual",
      ],
      payment_status_enum: [
        "pending",
        "succeeded",
        "failed",
        "refunded",
        "disputed",
      ],
      question_type_enum: [
        "multiple_choice",
        "open",
        "true_false",
        "match",
        "fill_blank",
      ],
      report_status_enum: ["open", "reviewing", "actioned", "dismissed"],
      role_enum: ["owner", "admin", "instructor", "student"],
      submission_type_enum: ["text", "file", "video", "url"],
      subscription_status_enum: [
        "trialing",
        "active",
        "past_due",
        "canceled",
        "expired",
      ],
      xp_source_enum: [
        "lesson_complete",
        "quiz_pass",
        "assignment_submit",
        "streak_bonus",
        "challenge_complete",
        "badge_earned",
        "post_created",
        "comment_created",
        "login_daily",
        "referral",
        "manual_grant",
      ],
    },
  },
} as const
