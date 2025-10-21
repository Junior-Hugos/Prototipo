import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { cookies } from 'next/headers';

// Helper para checar se é Voluntário ou Empresa
async function canPostCampaign() {
   const cookieStore = await cookies();
   const userId = cookieStore.get('session_userid')?.value;
   if (!userId) return false;
   const user = await prisma.usuario.findUnique({ where: { id: userId }, select: { tipo: true }});
   return user?.tipo === 'VOLUNTARIO' || user?.tipo === 'EMPRESA';
}

// POST - Criar nova campanha
export async function POST(req: Request) {
  if (!(await canPostCampaign())) {
     return NextResponse.json({ message: 'Não autorizado' }, { status: 401 });
  }

  try {
    const body = await req.json();
    const { titulo, descricao } = body; // Campos do novo schema

    const campanha = await prisma.campanha.create({
      data: { titulo, descricao },
    });

    return NextResponse.json(campanha, { status: 201 });
  } catch (error) {
    return NextResponse.json({ message: 'Erro ao criar campanha' }, { status: 500 });
  }
}

// GET - Listar campanhas
export async function GET() {
  try {
    const campanhas = await prisma.campanha.findMany({
      orderBy: { dataPublicacao: 'desc' },
      // Conta quantos voluntários participaram
      include: {
        _count: {
          select: { voluntarios: true }
        }
      }
    });
    return NextResponse.json(campanhas, { status: 200 });
  } catch (error) {
    return NextResponse.json({ message: 'Erro ao buscar campanhas' }, { status: 500 });
  }
}