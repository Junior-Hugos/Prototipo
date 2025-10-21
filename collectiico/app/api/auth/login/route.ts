import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { compare } from 'bcryptjs';
import { cookies } from 'next/headers';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { email, password } = body;

    if (!email || !password) {
      return NextResponse.json({ message: 'Email e senha são obrigatórios' }, { status: 400 });
    }

    // Busca o usuário e seus perfis relacionados
    const user = await prisma.usuario.findUnique({
      where: { email },
      include: {
        doador: true,
        voluntario: true,
        empresa: true,
      },
    });

    if (!user) {
      return NextResponse.json({ message: 'Credenciais inválidas' }, { status: 401 });
    }

    // Compara a senha com o campo 'senha'
    const isPasswordValid = await compare(password, user.senha);
    if (!isPasswordValid) {
      return NextResponse.json({ message: 'Credenciais inválidas' }, { status: 401 });
    }

    // Define o cookie de sessão com o ID (UUID)
    (await
      // Define o cookie de sessão com o ID (UUID)
      cookies()).set('session_userid', user.id, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 60 * 60 * 24, // 1 dia
      path: '/',
    });

    // Remove a senha do objeto antes de enviar a resposta
    const { senha, ...userWithoutPassword } = user;
    return NextResponse.json(userWithoutPassword, { status: 200 });

  } catch (error) {
    return NextResponse.json({ message: 'Erro interno do servidor' }, { status: 500 });
  }
}