// middleware.ts 

import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export async function middleware(req: NextRequest) {
  // Procurar pelo cookie 'session_userid'
  const userIdCookie = req.cookies.get("session_userid")?.value;

  // Definir rotas públicas 
  const publicPaths = ["/", "/login", "/cadastro"]; 
  const currentPath = req.nextUrl.pathname;

  // Verifica se o caminho atual 
  const isPublicPathExact = publicPaths.includes(currentPath);

  if (!userIdCookie) {

    if (!isPublicPathExact) {
      return NextResponse.redirect(new URL("/login", req.url));
    }
    
    return NextResponse.next();
  }

  if (currentPath === "/login" || currentPath === "/cadastro") {
    return NextResponse.redirect(new URL("/dashboard/solicitar", req.url)); 
  }

  return NextResponse.next();

  
}

// Matcher 
export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};