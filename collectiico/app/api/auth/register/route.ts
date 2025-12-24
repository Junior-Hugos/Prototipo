import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { hash } from 'bcryptjs';

export async function POST(req: Request) {
  // --- TRAVA DE SEGURANÇA (BETA FECHADO) ---
  // Se a variável ALLOW_REGISTRATION for 'false', bloqueia o cadastro.
  // Sessão testada e funcional, apenas para controle de acesso.
  if (process.env.ALLOW_REGISTRATION === 'false') {
      return NextResponse.json(
        { error: "O cadastro de novos usuários está temporariamente suspenso." },
        { status: 403 } 
      );
  }
  // -----------------------------------------

  try {
    const body = await req.json();
    const { 
      nome, email, password, endereco, tipo, 
      telefone, 
      disponibilidade, 
      cnpj, tipoMaterialAceito 
    } = body;

    // 1. Validação
    if (!email || !password || !tipo || !nome) {
      return NextResponse.json(
        { error: "Nome, email, senha e tipo são obrigatórios" },
        { status: 400 }
      );
    }

    // 2. Checar se usuário existe
    const existingUser = await prisma.usuario.findUnique({ where: { email } });
    if (existingUser) {
      return NextResponse.json(
        { error: "Este email já está em uso" },
        { status: 400 }
      );
    }

    // 3. Criptografar senha
    const hashedPassword = await hash(password, 12);

    // 4. Montar dados do Usuário
    const userData: any = {
      nome,
      email,
      senha: hashedPassword,
      endereco,
      tipo, // "DOADOR", "VOLUNTARIO", "EMPRESA"
    };

    // 5. Adicionar perfil com base no 'tipo'
    switch (tipo) {
      case "DOADOR":
        userData.doador = { create: { telefone: telefone || null } };
        break;
      case "VOLUNTARIO":
        userData.voluntario = { create: { disponibilidade: disponibilidade || null } };
        break;
      case "EMPRESA":
        if (!cnpj) {
          return NextResponse.json(
            { error: "CNPJ é obrigatório para Empresa" },
            { status: 400 }
          );
        }
        userData.empresa = {
          create: {
            cnpj,
            tipoMaterialAceito: tipoMaterialAceito || null,
          },
        };
        break;
      default:
        return NextResponse.json(
          { error: "Tipo de usuário inválido" },
          { status: 400 }
        );
    }

    // 6. Salvar no banco de dados
    const usuario = await prisma.usuario.create({
      data: userData,
    });

    // 7. Retornar sucesso (sem a senha!)
    const { senha, ...userResult } = usuario;
    return NextResponse.json(userResult, { status: 201 });

  } catch (error) {
    return NextResponse.json(
      { error: "Erro interno ao tentar criar usuário" },
      { status: 500 }
    );
  }
}