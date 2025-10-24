// middleware.ts (CORRIGIDO)

import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
// Não precisamos mais do 'jose' aqui

export async function middleware(req: NextRequest) {
  // 1. Procurar pelo cookie 'session_userid'
  const userIdCookie = req.cookies.get("session_userid")?.value;

  // 2. Definir rotas públicas (que NÃO precisam de login)
  const publicPaths = ["/login", "/cadastro"];
  const currentPath = req.nextUrl.pathname;
  const isPublicPath = publicPaths.some((path) => currentPath.startsWith(path));

  // 3. Lógica de proteção
  if (!userIdCookie) {
    // Se NÃO há cookie E o usuário NÃO está numa rota pública -> Redireciona para /login
    if (!isPublicPath) {
      return NextResponse.redirect(new URL("/login", req.url));
    }
    // Se não há cookie e está numa rota pública -> Deixa passar
    return NextResponse.next();
  }

  // 4. Se HÁ o cookie 'session_userid'
  // (Neste modelo simples, apenas a existência do cookie já indica "logado")

  // Se o usuário logado (tem o cookie) tentar acessar uma rota pública -> Redireciona para /dashboard
  if (isPublicPath) {
    return NextResponse.redirect(new URL("/dashboard", req.url));
  }

  // Se o usuário logado acessar qualquer outra rota (protegida) -> Deixa passar
  return NextResponse.next();

  /* * NOTA IMPORTANTE DE SEGURANÇA:
   * Este middleware agora é mais simples, mas menos seguro que o JWT.
   * Ele apenas verifica se o cookie 'session_userid' EXISTE.
   * Ele não valida se o ID dentro dele é real ou se a sessão é válida.
   * Para um projeto real, o ideal seria voltar ao JWT ou usar uma biblioteca
   * de sessão mais robusta (como NextAuth.js).
   * Para o projeto integrador, esta verificação de existência pode ser suficiente.
   */
}

// 5. O Matcher (continua o mesmo)
export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
