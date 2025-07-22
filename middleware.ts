import { type NextRequest } from "next/server";
import { updateSession } from "@/lib/supabase/middleware";

export async function middleware(request: NextRequest) {
  const { supabaseResponse, user } = await updateSession(request);

  const url = request.nextUrl.clone();
  const pathname = url.pathname;

  // Rotas públicas que NÃO precisam de autenticação
  const publicRoutes = ["/", "/login", "/signup", "/registros-publicos"];

  // Verifica se é uma rota pública específica
  const isPublicRoute =
    publicRoutes.includes(pathname) ||
    pathname.startsWith("/detalhe-publico/") ||
    pathname === "/detalhe-publico";

  // Se é rota pública, permite acesso
  if (isPublicRoute) {
    // Exceção: redireciona usuários logados tentando acessar login
    if (pathname === "/login" && user) {
      url.pathname = "/home";
      return Response.redirect(url);
    }
    return supabaseResponse;
  }

  // Todas as outras rotas precisam de autenticação
  if (!user) {
    url.pathname = "/login";
    return Response.redirect(url);
  }

  return supabaseResponse;
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
