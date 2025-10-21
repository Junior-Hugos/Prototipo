import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { cookies } from 'next/headers';

// Função para pegar o ID do Doador logado
async function getDoadorId() {
  const cookieStore = await cookies();
  const userId = cookieStore.get('session_userid')?.value;
  if (!userId) return null;

  const user = await prisma.usuario.findUnique({
    where: { id: userId },
    include: { doador: true },
  });

  // Somente permite se for Doador e tiver o perfil de doador
  if (user?.tipo === 'DOADOR' && user.doador) {
    return user.doador.id;
  }
  return null;
}

// POST - Criar nova coleta (APENAS DOADORES)
export async function POST(req: Request) {
  const doadorId = await getDoadorId();
  if (!doadorId) {
    return NextResponse.json({ message: 'Não autorizado: Apenas doadores podem criar coletas' }, { status: 401 });
  }

  try {
    const body = await req.json();
    // Campos do novo schema de Coleta
    const { tipoMaterial, quantidade, data } = body; 

    if (!tipoMaterial || !quantidade || !data) {
       return NextResponse.json({ message: 'Campos obrigatórios faltando' }, { status: 400 });
    }

    const coleta = await prisma.coleta.create({
      data: {
        tipoMaterial,
        quantidade: parseFloat(quantidade),
        data: new Date(data),
        status: "SOLICITADA",
        doadorId: doadorId, // Vincula ao Doador logado
      },
    });

    return NextResponse.json(coleta, { status: 201 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: 'Erro ao criar coleta' }, { status: 500 });
  }
}

// GET - Listar todas as coletas
export async function GET() {
  try {
    const coletas = await prisma.coleta.findMany({
      orderBy: { data: 'desc' },
      include: {
        // Inclui o nome do Doador (via Usuário)
        doador: {
          include: {
            usuario: {
              select: { nome: true, endereco: true },
            },
          },
        },
        // Inclui o nome do Voluntário (se houver)
        voluntario: {
          include: {
            usuario: {
              select: { nome: true },
            },
          },
        },
      },
    });
    return NextResponse.json(coletas, { status: 200 });
  } catch (error) {
    return NextResponse.json({ message: 'Erro ao buscar coletas' }, { status: 500 });
  }
}