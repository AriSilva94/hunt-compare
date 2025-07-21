import { type NextRequest } from "next/server";
import { updateSession } from "@/lib/supabase/middleware";

export async function middleware(request: NextRequest) {
  const { supabaseResponse, user } = await updateSession(request);

  const url = request.nextUrl.clone();
  const isProtectedRoute =
    url.pathname.startsWith("/home") ||
    url.pathname.startsWith("/cadastro") ||
    url.pathname.startsWith("/detalhe");

  if (isProtectedRoute && !user) {
    url.pathname = "/login";
    return Response.redirect(url);
  }

  if (url.pathname === "/login" && user) {
    url.pathname = "/home";
    return Response.redirect(url);
  }

  return supabaseResponse;
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
