import { NextResponse } from "next/server";
import { revalidatePath, revalidateTag } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { recordsService } from "@/services/records.service";

interface RouteParams {
  params: Promise<{ id: string }>;
}

export async function GET(request: Request, { params }: RouteParams) {
  try {
    // Await params antes de usar
    const resolvedParams = await params;

    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const record = await recordsService.getRecord(resolvedParams.id, user.id);

    if (!record) {
      return NextResponse.json({ error: "Record not found" }, { status: 404 });
    }

    return NextResponse.json(record);
  } catch (error) {
    console.error("Error fetching record:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

export async function PUT(request: Request, { params }: RouteParams) {
  try {
    const resolvedParams = await params;
    const body = await request.json();

    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Validar campos permitidos para edição
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const updateData: { is_public?: boolean; data?: any; character_id?: string | null } = {};

    if (body.is_public !== undefined) {
      updateData.is_public = body.is_public;
    }

    if (body.data) {
      updateData.data = body.data;
    }

    if (body.character_id !== undefined) {
      updateData.character_id = body.character_id;
    }

    if (Object.keys(updateData).length === 0) {
      return NextResponse.json({ error: "No valid fields to update" }, { status: 400 });
    }

    const record = await recordsService.updateRecord(resolvedParams.id, user.id, updateData);

    // Revalidar cache das páginas que podem mostrar este registro
    revalidatePath("/home");
    revalidatePath("/comparar");
    revalidatePath("/registros-publicos");
    
    // Invalidar cache de registros públicos se o status mudou
    if (updateData.is_public !== undefined) {
      revalidateTag('public-records');
      revalidateTag(`public-record-${resolvedParams.id}`);
    }

    return NextResponse.json(record);
  } catch (error) {
    console.error("Error updating record:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

export async function DELETE(request: Request, { params }: RouteParams) {
  try {
    // Await params antes de usar
    const resolvedParams = await params;

    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await recordsService.deleteRecord(resolvedParams.id, user.id);

    // Revalidar cache das páginas que podem mostrar este registro
    revalidatePath("/home");
    revalidatePath("/comparar");
    revalidatePath("/registros-publicos");
    
    // Invalidar cache de registros públicos
    revalidateTag('public-records');
    revalidateTag(`public-record-${resolvedParams.id}`);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting record:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
