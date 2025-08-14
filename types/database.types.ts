export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export interface Database {
  public: {
    Tables: {
      records: {
        Row: {
          id: string;
          user_id: string;
          data: Json;
          is_public: boolean;
          has_bestiary: boolean;
          character_id: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          data: Json;
          is_public?: boolean;
          has_bestiary?: boolean;
          character_id?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          data?: Json;
          is_public?: boolean;
          has_bestiary?: boolean;
          character_id?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      characters: {
        Row: {
          id: string;
          user_id: string;
          name: string;
          level: number;
          vocation: string | null;
          world: string | null;
          sex: string | null;
          avatar_url: string | null;
          is_active: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          name: string;
          level: number;
          vocation?: string | null;
          world?: string | null;
          sex?: string | null;
          avatar_url?: string | null;
          is_active?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          name?: string;
          level?: number;
          vocation?: string | null;
          world?: string | null;
          sex?: string | null;
          avatar_url?: string | null;
          is_active?: boolean;
          created_at?: string;
          updated_at?: string;
        };
      };
    };
  };
}
