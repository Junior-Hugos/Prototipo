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

    // Buscando o usuário e suas relações específicas
    const user = await prisma.usuario.findUnique({
      where: { id: userId },
      include: {
        doador: {
          include: {
            coletas: { orderBy: { data: 'desc' } }
          }
        },
        voluntario: {
          include: {
            coletasRealizadas: { orderBy: { data: 'desc' } },
            campanhas: { include: { campanha: true } }
          }
        },
        empresa: {
          include: {
            coletasRecebidas: { orderBy: { data: 'desc' } }
          }
        },
      }
    });

    if (!user) {
      return NextResponse.json({ message: 'Usuário não encontrado' }, { status: 404 });
    }

    const { senha, ...userWithoutPassword } = user;
    return NextResponse.json(userWithoutPassword, { status: 200 });

  } catch (error) {
    console.error("Erro API Profile:", error);
    return NextResponse.json({ message: 'Erro interno do servidor' }, { status: 500 });
  }
}

export async function PUT(req: Request) {
    const cookieStore = await cookies();
    const userId = cookieStore.get('session_userid')?.value;
    if (!userId) return NextResponse.json({ message: "Não autorizado" }, { status: 401 });

    try {
        const body = await req.json();
        const { nome, endereco, telefone, bio, cidade } = body; 
        const dataToUpdate: any = {};
        if (nome) dataToUpdate.nome = nome;
        if (endereco) dataToUpdate.endereco = endereco;
        if (bio !== undefined) dataToUpdate.bio = bio;
        if (cidade !== undefined) dataToUpdate.cidade = cidade;

        const updatedUser = await prisma.usuario.update({
            where: { id: userId },
            data: dataToUpdate,
        });

        if (telefone) {
            const doador = await prisma.doador.findUnique({ where: { usuarioId: userId }});
            if (doador) {
                await prisma.doador.update({
                    where: { usuarioId: userId },
                    data: { telefone }
                });
            }
        }
        const { senha, ...userSafe } = updatedUser;
        return NextResponse.json({ success: true, user: userSafe });
    } catch (error) {
        return NextResponse.json({ message: "Erro ao atualizar perfil" }, { status: 500 });
    }
}