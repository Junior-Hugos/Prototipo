import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { cookies } from 'next/headers';

// Função para verificar se o usuário tem permissão para criar campanha
async function canPostCampaign() {
   const cookieStore = await cookies();
   const userId = cookieStore.get('session_userid')?.value;
   
   if (!userId) return false;
   
   const user = await prisma.usuario.findUnique({ 
     where: { id: userId }, 
     select: { tipo: true }
   });
   
   return user?.tipo === 'VOLUNTARIO' || user?.tipo === 'EMPRESA';
}

// POST - Criar nova campanha
export async function POST(req: Request) {
  const temPermissao = await canPostCampaign();

  if (!temPermissao) {
     return NextResponse.json({ message: 'Não autorizado' }, { status: 403 });
  }

  // O usuário existe e tem permissão.
  // Pegamos o ID para salvar no banco.
  const cookieStore = await cookies();
  const userId = cookieStore.get('session_userid')?.value;

  try {
    const body = await req.json();
    const { titulo, descricao } = body; 

    // Cria a campanha
    const campanha = await prisma.campanha.create({
      data: { 
        titulo, 
        descricao,
        criadorId: userId! 
      },
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
      include: {
        _count: {
          select: { voluntarios: true }          
        },
        criador: { select: { nome: true, id: true, email: true} }
      }
    });
    return NextResponse.json(campanhas, { status: 200 });
  } catch (error) {
    return NextResponse.json({ message: 'Erro ao buscar campanhas' }, { status: 500 });
  }
}

// DELETE - Excluir campanha
export async function DELETE(req: Request) {
  try {
    const { id } = await req.json();
    await prisma.voluntario_Campanha.deleteMany({ where: { campanhaId: id }});    
    await prisma.campanha.delete({ where: { id } });
    
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: "Erro ao excluir campanha" }, { status: 500 });
  }
}