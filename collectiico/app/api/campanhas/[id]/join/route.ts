import { NextResponse, NextRequest } from 'next/server';
import prisma from '@/lib/prisma';
import { cookies } from 'next/headers';

// Pega ID do Voluntário logado
async function getVoluntarioId() {
  const cookieStore = await cookies();
  const userId = cookieStore.get('session_userid')?.value;
  if (!userId) return null;

  const user = await prisma.usuario.findUnique({
    where: { id: userId },
    include: { voluntario: true },
  });

  return user?.voluntario?.id || null;
}

// POST: PARTICIPAR 
export async function POST(req: NextRequest, props: { params: Promise<{ id: string }> }) {
  const params = await props.params;
  const voluntarioId = await getVoluntarioId();
  
  if (!voluntarioId) {
    return NextResponse.json({ message: 'Apenas voluntários podem participar de campanhas' }, { status: 403 });
  }

  try {
    await prisma.voluntario_Campanha.create({
      data: {
        voluntarioId: voluntarioId,
        campanhaId: params.id,
      },
    });
    return NextResponse.json({ message: 'Inscrito com sucesso' }, { status: 201 });
  } catch (error) {  
    return NextResponse.json({ message: 'Erro ou já inscrito' }, { status: 400 });
  }
}

// DELETE: CANCELAR PARTICIPAÇÃO
export async function DELETE(req: NextRequest, props: { params: Promise<{ id: string }> }) {
  const params = await props.params;
  const voluntarioId = await getVoluntarioId();

  if (!voluntarioId) return NextResponse.json({ message: 'Proibido' }, { status: 403 });

  try {
    await prisma.voluntario_Campanha.deleteMany({
      where: {
        voluntarioId: voluntarioId,
        campanhaId: params.id,
      },
    });
    return NextResponse.json({ message: 'Saiu com sucesso' });
  } catch (error) {
    return NextResponse.json({ message: 'Erro ao sair' }, { status: 500 });
  }
}