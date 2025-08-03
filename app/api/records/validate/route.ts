import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function POST(request: Request) {
  try {
    const { recordIds } = await request.json();

    if (!recordIds || !Array.isArray(recordIds)) {
      return NextResponse.json({ error: "Invalid recordIds" }, { status: 400 });
    }

    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    // Buscar registros que estão disponíveis para o usuário
    const { data: records, error } = await supabase
      .from("records")
      .select("id, is_public, user_id")
      .in("id", recordIds);

    if (error) {
      throw error;
    }

    const validIds: string[] = [];
    const invalidIds: string[] = [];

    recordIds.forEach((id: string) => {
      const record = records?.find(r => r.id === id);
      
      if (record) {
        // Registro existe e está acessível se for público OU se o usuário for o dono
        const isAccessible = record.is_public || (user && record.user_id === user.id);
        if (isAccessible) {
          validIds.push(id);
        } else {
          invalidIds.push(id);
        }
      } else {
        // Registro não encontrado (pode ter sido deletado ou nunca existiu)
        invalidIds.push(id);
      }
    });

    return NextResponse.json({
      validIds,
      invalidIds,
      hasInvalidRecords: invalidIds.length > 0,
    });
  } catch (error) {
    console.error("Error validating records:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}