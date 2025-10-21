import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export async function POST() {
  // Limpa o cookie de sessão
  (await
        // Limpa o cookie de sessão
        cookies()).set('session_userid', '', {
    httpOnly: true,
    maxAge: -1, // Expira imediatamente
    path: '/',
  });
  return NextResponse.json({ message: 'Logout bem-sucedido' }, { status: 200 });
}