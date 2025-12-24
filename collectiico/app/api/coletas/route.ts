import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { cookies } from 'next/headers';
import { geocodeAddress } from '@/lib/geocoding';

// POST (Criar)
export async function POST(req: Request) {
  try {
    const cookieStore = await cookies();
    const userId = cookieStore.get('session_userid')?.value;
    if (!userId) return NextResponse.json({ message: 'Usuário não autenticado' }, { status: 401 });

    const body = await req.json();
    const { tipoMaterial, quantidade, data } = body; 

    const user = await prisma.usuario.findUnique({ where: { id: userId }, include: { doador: true } });
    if (!user) return NextResponse.json({ message: 'Usuário não encontrado' }, { status: 404 });

    let doadorId = user.doador?.id;
    if (!doadorId) {
        const novo = await prisma.doador.create({ data: { usuarioId: user.id, telefone: "" } });
        doadorId = novo.id;
    }

    let lat = null, lng = null;
    if (user.endereco) {
        try {
            const geo = await geocodeAddress(`${user.endereco} - ${user.cidade || ''}`);
            if (geo) { lat = geo.lat; lng = geo.lng; }
        } catch(e) {}
    }

    const coleta = await prisma.coleta.create({
      data: {
        tipoMaterial, quantidade: parseFloat(quantidade), data: new Date(data),
        status: "SOLICITADA", doadorId: doadorId, lat, lng 
      },
    });
    return NextResponse.json(coleta, { status: 201 });
  } catch (error) { return NextResponse.json({ message: 'Erro interno' }, { status: 500 }); }
}

// GET (Listar)
export async function GET() {
  try {
    const coletas = await prisma.coleta.findMany({
      orderBy: { data: 'desc' },
      include: {
        doador: { include: { usuario: { select: { id: true, nome: true, endereco: true, cidade: true } } } },
        voluntario: { include: { usuario: { select: { id: true, nome: true } } } },
        empresa: { include: { usuario: { select: { id: true, nome: true } } } }
      },
    });
    return NextResponse.json(coletas, { status: 200 });
  } catch (error) { return NextResponse.json({ message: 'Erro ao buscar' }, { status: 500 }); }
}

// PUT (Aceitar, Concluir ou Liberar)
export async function PUT(req: Request) {
    try {
        const cookieStore = await cookies();
        const userId = cookieStore.get('session_userid')?.value;
        if (!userId) return NextResponse.json({ message: 'Não autenticado' }, { status: 401 });

        const user = await prisma.usuario.findUnique({
             where: { id: userId },
             include: { voluntario: true, empresa: true }
        });

        const body = await req.json();
        const { id, status, action } = body; 
        const updateData: any = { status };

        // 1. CANCELAR / LIBERAR 
        if (action === 'liberar') {
            updateData.status = 'SOLICITADA';
            updateData.voluntarioId = null; 
            updateData.empresaId = null;    
        }
        // 2. ACEITAR
        else if (status === 'ACEITA' || status === 'EM_ANDAMENTO') {
            
            // Lógica para Voluntário
            if (user?.tipo === 'VOLUNTARIO') {
                let volId = user.voluntario?.id;
                if (!volId) { 
                    const novo = await prisma.voluntario.create({ data: { usuarioId: userId } });
                    volId = novo.id;
                }
                updateData.voluntarioId = volId;
            } 
            
            // Lógica para Empresa
            else if (user?.tipo === 'EMPRESA') {
                let empId = user.empresa?.id;
                if (!empId) { 
                    const novo = await prisma.empresa.create({ data: { usuarioId: userId, cnpj: "" } });
                    empId = novo.id;
                }
                updateData.empresaId = empId;
            }
        }

        const coleta = await prisma.coleta.update({ where: { id }, data: updateData });
        return NextResponse.json(coleta);
    } catch (error) {
        return NextResponse.json({ message: 'Erro ao atualizar' }, { status: 500 });
    }
}

// DELETE (Excluir)
export async function DELETE(req: Request) {
    try {
        const body = await req.json();
        await prisma.coleta.delete({ where: { id: body.id } });
        return NextResponse.json({ success: true });
    } catch (error) {
        return NextResponse.json({ message: 'Erro ao excluir' }, { status: 500 });
    }
}