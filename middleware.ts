import { type NextRequest } from "next/server";
import { updateSession } from "@/lib/supabase/middleware";

export async function middleware(request: NextRequest) {
  const { supabaseResponse, user } = await updateSession(request);

  const url = request.nextUrl.clone();

  // Lista de rotas que requerem autenticação
  const protectedRoutes = [
    "/home",
    "/cadastro",
    "/detalhe", // Nota: /detalhe/[id] requer auth, mas /detalhe-publico/[id] não
  ];

  // Verifica se a rota atual é protegida
  const isProtectedRoute = protectedRoutes.some((route) =>
    url.pathname.startsWith(route)
  );

  // Se é uma rota protegida e o usuário não está autenticado
  if (isProtectedRoute && !user) {
    url.pathname = "/login";
    return Response.redirect(url);
  }

  // Se está na página de login e já está autenticado
  if (url.pathname === "/login" && user) {
    url.pathname = "/home";
    return Response.redirect(url);
  }

  return supabaseResponse;
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
