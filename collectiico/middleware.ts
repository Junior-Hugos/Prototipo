// middleware.ts 

import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export async function middleware(req: NextRequest) {
  // 1. Procurar pelo cookie 'session_userid'
  const userIdCookie = req.cookies.get("session_userid")?.value;

  // 2. Definir rotas públicas (INCLUINDO A PÁGINA INICIAL '/')
  const publicPaths = ["/", "/login", "/cadastro"]; // <-- '/' e '/cadastro' estão aqui
  const currentPath = req.nextUrl.pathname;

  // Verifica se o caminho atual é EXATAMENTE um dos caminhos públicos
  const isPublicPathExact = publicPaths.includes(currentPath);

  // 3. Lógica de proteção
  if (!userIdCookie) {
    // Se NÃO há cookie E o usuário NÃO está numa rota pública EXATA -> Redireciona para /login
    // Isso protege /solicitar, /rotas, /campanhas, etc.
    if (!isPublicPathExact) {
      return NextResponse.redirect(new URL("/login", req.url));
    }
    // Se não há cookie e está numa rota pública EXATA ('/', '/login', '/cadastro') -> Deixa passar
    return NextResponse.next();
  }

  // 4. Se HÁ o cookie 'session_userid' (usuário logado)

  // Se o usuário logado tentar acessar /login ou /cadastro -> Redireciona para /solicitar
  if (currentPath === "/login" || currentPath === "/cadastro") {
    return NextResponse.redirect(new URL("/solicitar", req.url)); // <-- Redireciona para solicitar após login
  }

  // Se o usuário logado acessar a página inicial ('/') ou qualquer outra rota protegida -> Deixa passar
  return NextResponse.next();

  /* NOTA DE SEGURANÇA: Continua válida a nota anterior sobre a simplicidade
   * desta verificação de cookie. Para produção, considere JWT ou NextAuth.js.
   */
}

// 5. O Matcher (continua o mesmo)
export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};