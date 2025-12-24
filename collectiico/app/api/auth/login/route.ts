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

    // 1. Email para minúsculas
    const emailLower = email.toLowerCase();

    // Busca o usuário
    const user = await prisma.usuario.findUnique({
      where: { email: emailLower },
      include: {
        doador: true,
        voluntario: true,
        empresa: true,
      },
    });

    // 2. Verifica se usuário existe
    if (!user) {
      return NextResponse.json({ message: 'Credenciais inválidas' }, { status: 401 });
    }

    // 3. Verifica a senha
    const isPasswordValid = await compare(password, user.senha);
    if (!isPasswordValid) {
      return NextResponse.json({ message: 'Credenciais inválidas' }, { status: 401 });
    }

    // Define o cookie de sessão
    (await cookies()).set('session_userid', user.id, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 60 * 60 * 24, 
      path: '/',
    });

    const { senha, ...userWithoutPassword } = user;
    return NextResponse.json(userWithoutPassword, { status: 200 });

  } catch (error) {
    return NextResponse.json({ message: 'Erro interno do servidor' }, { status: 500 });
  }
}