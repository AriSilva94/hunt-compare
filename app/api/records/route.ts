import { NextResponse } from "next/server";
import { revalidatePath, revalidateTag } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { recordsService } from "@/services/records.service";
import { CreateRecordDTO } from "@/types/record.types";

export async function POST(request: Request) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();
    console.warn("AUTH ERROR", authError);

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body: CreateRecordDTO = await request.json();
    const record = await recordsService.createRecord(body, user.id);

    // Revalidar cache da página home para mostrar o novo registro
    revalidatePath("/home");
    
    // Se o registro é público, invalidar cache de registros públicos
    if (body.is_public) {
      revalidateTag('public-records');
    }

    return NextResponse.json(record);
  } catch (error) {
    console.error("❌ ERRO INTERNO", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
