// app/api/auth/register/route.ts

import { NextResponse } from "next/server";
import prisma from "../../../../lib/prisma"; // Nosso cliente Prisma global
import { hash } from "bcryptjs"; // Para criptografar a senha

// Esta é a função que será executada quando houver um POST
export async function POST(req: Request) {
  try {
    // 1. Pegar os dados do corpo da requisição
    const body = await req.json();
    const { nome, email, senha, endereco, tipo, ...profileData } = body;

    // 2. Validação básica
    if (!email || !senha || !tipo) {
      return NextResponse.json(
        { error: "Email, senha e tipo são obrigatórios" },
        { status: 400 }
      );
    }

    // 3. Verificar se o usuário já existe
    const existingUser = await prisma.usuario.findUnique({
      where: { email: email },
    });

    if (existingUser) {
      return NextResponse.json(
        { error: "Este email já está em uso" },
        { status: 400 }
      );
    }

    // 4. Criptografar a senha
    // Lembre-se de rodar: npm install bcryptjs @types/bcryptjs
    const hashedPassword = await hash(senha, 12);

    // 5. Montar o objeto de dados do usuário
    // Esta transação aninhada é baseada no seu Diagrama de Classe
    const userData: any = {
      nome,
      email,
      senha: hashedPassword,
      endereco,
      tipo,
    };

    // 6. Adicionar o perfil aninhado com base no 'tipo'
    switch (tipo) {
      case "DOADOR":
        userData.doador = {
          create: {
            telefone: profileData.telefone || null,
          },
        };
        break;
      case "VOLUNTARIO":
        userData.voluntario = {
          create: {
            disponibilidade: profileData.disponibilidade || null,
          },
        };
        break;
      case "EMPRESA":
        if (!profileData.cnpj) {
          return NextResponse.json(
            { error: "CNPJ é obrigatório para Empresa" },
            { status: 400 }
          );
        }
        userData.empresa = {
          create: {
            cnpj: profileData.cnpj,
            tipoMaterialAceito: profileData.tipoMaterialAceito || null,
          },
        };
        break;
      default:
        return NextResponse.json(
          { error: "Tipo de usuário inválido" },
          { status: 400 }
        );
    }

    // 7. Salvar no banco de dados
    const usuario = await prisma.usuario.create({
      data: userData,
    });

    // 8. Retornar sucesso (sem a senha!)
    return NextResponse.json(
      {
        id: usuario.id,
        nome: usuario.nome,
        email: usuario.email,
        tipo: usuario.tipo,
      },
      { status: 201 } // 201 = "Created"
    );
  } catch (error) {
    console.error("Erro ao criar usuário:", error);
    return NextResponse.json(
      { error: "Erro interno ao tentar criar usuário" },
      { status: 500 }
    );
  }
}
