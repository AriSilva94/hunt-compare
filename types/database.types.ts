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
          character_id: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          data: Json;
          is_public?: boolean;
          character_id?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          data?: Json;
          is_public?: boolean;
          character_id?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
    };
  };
}
