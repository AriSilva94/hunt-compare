/* eslint-disable @typescript-eslint/no-explicit-any */
import { createClient } from "@/lib/supabase/server";

interface Record {
  id: string;
  user_id: string;
  data: any;
  is_public: boolean;
  created_at: string;
  updated_at: string;
}

interface CreateRecordDTO {
  data: any;
  is_public: boolean;
}

export class RecordsService {
  async createRecord(data: CreateRecordDTO, userId: string): Promise<Record> {
    const supabase = await createClient();

    const { data: record, error } = await supabase
      .from("records")
      .insert({
        user_id: userId,
        data: data.data,
        is_public: data.is_public,
      })
      .select()
      .single();

    if (error) throw error;
    return record;
  }

  async getUserRecords(userId: string): Promise<Record[]> {
    const supabase = await createClient();

    const { data: records, error } = await supabase
      .from("records")
      .select("*")
      .eq("user_id", userId)
      .order("created_at", { ascending: false });

    if (error) throw error;
    return records || [];
  }

  async getRecord(id: string, userId?: string): Promise<Record | null> {
    const supabase = await createClient();

    let query = supabase.from("records").select("*").eq("id", id);

    if (userId) {
      query = query.eq("user_id", userId);
    }

    const { data: record, error } = await query.single();

    if (error) return null;
    return record;
  }

  async getPublicRecord(id: string): Promise<Record | null> {
    const supabase = await createClient();

    const { data: record, error } = await supabase
      .from("records")
      .select("*")
      .eq("id", id)
      .eq("is_public", true)
      .single();

    if (error) return null;
    return record;
  }

  async getPublicRecords(): Promise<Record[]> {
    const supabase = await createClient();

    const { data: records, error } = await supabase
      .from("records")
      .select("*")
      .eq("is_public", true)
      .order("created_at", { ascending: false });

    if (error) return [];
    return records || [];
  }

  async updateRecord(
    id: string,
    userId: string,
    data: Partial<CreateRecordDTO>
  ): Promise<Record> {
    const supabase = await createClient();

    const { data: record, error } = await supabase
      .from("records")
      .update({
        ...data,
        updated_at: new Date().toISOString(),
      })
      .eq("id", id)
      .eq("user_id", userId)
      .select()
      .single();

    if (error) throw error;
    return record;
  }

  async deleteRecord(id: string, userId: string): Promise<void> {
    const supabase = await createClient();

    const { error } = await supabase
      .from("records")
      .delete()
      .eq("id", id)
      .eq("user_id", userId);

    if (error) throw error;
  }
}

export const recordsService = new RecordsService();
