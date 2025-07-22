import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get("code");
  const origin = requestUrl.origin;

  if (code) {
    const supabase = await createClient();
    const { error } = await supabase.auth.exchangeCodeForSession(code);

    if (!error) {
      // IMPORTANTE: Força redirecionamento para /home
      return NextResponse.redirect(`${origin}/home`);
    }
  }

  // Se houver erro ou não houver código, vai para login
  return NextResponse.redirect(`${origin}/login`);
}
