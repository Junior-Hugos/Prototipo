import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { cookies } from 'next/headers';

export async function GET() {
  try {
    const cookieStore = await cookies();
    const userId = cookieStore.get('session_userid')?.value;

    if (!userId) {
      return NextResponse.json({ message: 'Não autenticado' }, { status: 401 });
    }

    // Busca o usuário e seus perfis (ID agora é String/UUID)
    const user = await prisma.usuario.findUnique({
      where: { id: userId },
      include: {        
        doador: true,
        voluntario: true,
        empresa: true,
      },
    });

    if (!user) {
      return NextResponse.json({ message: 'Usuário não encontrado' }, { status: 404 });
    }

    // Remove a senha
    const { senha, ...userWithoutPassword } = user;
    return NextResponse.json(userWithoutPassword, { status: 200 });

  } catch (error) {
    return NextResponse.json({ message: 'Erro interno do servidor' }, { status: 500 });
  }
}