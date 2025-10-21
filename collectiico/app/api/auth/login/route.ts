// app/api/auth/login/route.ts

import { NextResponse } from "next/server";
import prisma from "../../../../lib/prisma";
import { compare } from "bcryptjs"; // Para comparar senhas
import { sign } from "jsonwebtoken"; // Para criar o token
import { serialize } from "cookie"; // Para salvar o cookie

// Chave secreta para assinar o token.
// Em um projeto real, coloque isso no seu .env!
const JWT_SECRET =
  process.env.JWT_SECRET || "sua-chave-secreta-deve-ser-longa-e-segura";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { email, senha } = body;

    // 1. Validação básica
    if (!email || !senha) {
      return NextResponse.json(
        { error: "Email e senha são obrigatórios" },
        { status: 400 }
      );
    }

    // 2. Buscar o usuário no banco
    const usuario = await prisma.usuario.findUnique({
      where: { email: email },
    });

    if (!usuario) {
      return NextResponse.json(
        { error: "Credenciais inválidas" }, // Msg genérica por segurança
        { status: 401 }
      );
    }

    // 3. Comparar a senha enviada com a senha do banco
    const senhaValida = await compare(senha, usuario.senha);

    if (!senhaValida) {
      return NextResponse.json(
        { error: "Credenciais inválidas" },
        { status: 401 }
      );
    }

    // 4. Se a senha é válida, gerar o Token (JWT)
    // O token contém os dados "públicos" do usuário
    const token = sign(
      {
        userId: usuario.id,
        email: usuario.email,
        tipo: usuario.tipo,
      },
      JWT_SECRET,
      { expiresIn: "1h" } // Token expira em 1 hora
    );

    // 5. Serializar o token em um cookie seguro
    const cookie = serialize("auth_token", token, {
      httpOnly: true, // O cookie não pode ser acessado por JS no frontend
      secure: process.env.NODE_ENV === "production", // Só enviar em HTTPS (produção)
      sameSite: "strict", // Proteção contra ataques CSRF
      maxAge: 3600, // 1 hora (em segundos)
      path: "/", // O cookie é válido para todo o site
    });

    // 6. Retornar a resposta de sucesso e definir o cookie
    const headers = new Headers();
    headers.append("Set-Cookie", cookie);

    return NextResponse.json(
      {
        id: usuario.id,
        email: usuario.email,
        tipo: usuario.tipo,
      },
      { status: 200, headers: headers }
    );
  } catch (error) {
    console.error("Erro no login:", error);
    return NextResponse.json(
      { error: "Erro interno no servidor" },
      { status: 500 }
    );
  }
}
