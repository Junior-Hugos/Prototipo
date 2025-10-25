import { NextResponse, NextRequest } from 'next/server';
import prisma from '@/lib/prisma';
import { cookies } from 'next/headers';

// Helper para pegar o ID do Voluntário logado
async function getVoluntarioId() {
  const cookieStore = cookies();
  const userId = (await cookieStore).get('session_userid')?.value;
  if (!userId) return null;

  const user = await prisma.usuario.findUnique({
    where: { id: userId },
    include: { voluntario: true },
  });

  if (user?.tipo === 'VOLUNTARIO' && user.voluntario) {
    return user.voluntario.id;
  }
  return null;
}

export async function POST(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const voluntarioId = await getVoluntarioId();
  if (!voluntarioId) {
    return NextResponse.json({ message: 'Não autorizado: Apenas voluntários podem participar' }, { status: 401 });
  }

  try {
    const campanhaId = params.id;

    // Cria a entrada na tabela de junção
    await prisma.voluntario_Campanha.create({
      data: {
        voluntarioId: voluntarioId,
        campanhaId: campanhaId,
      },
    });

    return NextResponse.json({ message: 'Inscrição realizada!' }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ message: 'Erro ao se inscrever na campanha' }, { status: 500 });
  }
}