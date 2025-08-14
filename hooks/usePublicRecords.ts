import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import type { Database } from "@/types/database.types";

type Record = Database["public"]["Tables"]["records"]["Row"];

export function usePublicRecords() {
  const [records, setRecords] = useState<Record[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      const supabase = createClient();

      const { data, error } = await supabase
        .from("records")
        .select(`
          *,
          character:characters!character_id(
            id,
            name,
            level,
            vocation,
            world,
            sex
          )
        `)
        .eq("is_public", true)
        .order("created_at", { ascending: false });

      if (error) {
        console.error("Erro ao buscar registros públicos:", error);
      }

      if (data) {
        setRecords(data);
      }
      setLoading(false);
    }

    fetchData();
  }, []);

  return { records, loading };
}