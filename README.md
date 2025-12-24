# ♻️ Collectiico

> **Otimização de Rotas e Logística Inteligente para Coleta de Recicláveis.**

O **Collectiico** é uma aplicação web progressiva (PWA) e responsiva (*Mobile-First*) desenvolvida como Projeto de Extensão Universitária. O objetivo é solucionar o problema do descarte inadequado de resíduos em **Campo Grande - MS**, criando uma ponte tecnológica entre Doadores, Voluntários e Cooperativas.

![Status](https://img.shields.io/badge/Status-Em_Desenvolvimento-green)
![CI/CD](https://img.shields.io/badge/CI%2FCD-GitHub_Actions_%26_Vercel-blue)
![Security](https://img.shields.io/badge/Security-OWASP_Top_10-red)

---

## 🌐 Demonstração Online

O sistema está implantado e rodando em produção na Vercel. Você pode acessar e testar agora mesmo:

🔗 **Acesse o Sistema:** [https://prototipo-amber.vercel.app/](https://prototipo-amber.vercel.app/)

### 🔐 Credenciais de Acesso
> **⚠️ Atenção:** O cadastro de novos usuários encontra-se **bloqueado**. Utilize as contas de demonstração abaixo para explorar os diferentes perfis do sistema:

|       Email           |   Senha  |       Perfil        |
|       :---            |  :---    |        :---         |
| `francisco@gmail.com` | `123456` | Usuário Doador      |
| `maria@gmail.com`     | `123456` | Usuário Voluntário  |
| `recicler@gmail.com`  | `123456` | Cooperativa/Empresa |
| `cooper@gmail.com`    | `12345`  | Cooperativa/Empresa |


---

## 🎯 Objetivo e Impacto

O projeto visa mitigar a falta de informação e infraestrutura acessível para a coleta seletiva. A solução conecta os três atores principais do ciclo de reciclagem:

1.  **Doadores:** Solicitam a coleta de materiais em suas residências.
2.  **Voluntários:** Visualizam solicitações e realizam o transporte (logística reversa).
3.  **Empresas/Cooperativas:** Recebem os materiais e validam o processo.

**Impacto Esperado:** Otimização logística, aumento do engajamento comunitário e redução estimada de 0,06 toneladas de CO₂ por semestre através da otimização de viagens.

---

## 📱 Destaques de UX/UI (Mobile First)

Conforme definido na inspeção de artefatos, a solução é uma **Aplicação Web Responsiva**:

* **Navegação Nativa:** Barra de navegação inferior (*Bottom Tab Bar*) em dispositivos móveis e Sidebar em desktops.
* **Design Adaptativo:** Layouts que se ajustam fluidamente entre telas de smartphones e monitores largos.
* **Acessibilidade:** Botões e inputs dimensionados para interação por toque.

---

## 🛠️ Stack Tecnológico

A arquitetura foi definida para garantir escalabilidade, segurança e integridade de dados:

* **Front-end:** [Next.js 14](https://nextjs.org/) (React) com App Router.
* **Estilização:** [Tailwind CSS](https://tailwindcss.com/).
* **Back-end:** Next.js API Routes (Serverless).
* **Banco de Dados:** [PostgreSQL](https://www.postgresql.org/) (Hospedado na Neon/Docker).
* **ORM:** [Prisma](https://www.prisma.io/) (Garantia de *Type-Safety* e Migrations).
* **Autenticação:** JWT (JSON Web Tokens) em Cookies HttpOnly.

---

## 🔒 Segurança e Qualidade (DevSecOps)

O projeto segue um **Plano de Desenvolvimento Seguro** baseado no OWASP Top 10:

* **Proteção de Dados:** Hashing de senhas com `bcrypt` e gestão rigorosa de variáveis de ambiente.
* **Prevenção de Falhas:** Uso exclusivo do ORM para evitar SQL Injection.
* **Controle de Acesso:** Middleware centralizado para proteção de rotas por perfil (Doador/Voluntário/Empresa).

### Estratégia de Testes
* **Unitários:** React Testing.
* **Integração:** Validação de API com banco de dados em teste.

---

## 🚀 CI/CD e Deploy

O ciclo de vida do software é automatizado:

1.  **Integração Contínua (GitHub Actions):** Build, Linting, Testes Unitários e Scan de Vulnerabilidades (`npm audit`) a cada Push/PR.
2.  **Entrega Contínua (Vercel):**
    * *Preview Deployments:* Ambientes de teste gerados automaticamente para cada Pull Request.
    * *Production:* Deploy automático na branch `main` após aprovação nos testes.

---

## 🗄️ Modelagem de Dados

O banco de dados relacional foi modelado para suportar a complexidade logística:

* **Entidade Base:** `Usuario` (Dados comuns: nome, email, senha).
* **Perfis Específicos:** `Doador`, `Voluntario`, `Empresa` (Relacionamento 1:1 com Usuário).
* **Transacional:** `Coleta` (Conecta Doador, Voluntário e Empresa).
* **Associativa:** `Voluntario_Campanha` (Resolve a relação N:N entre voluntários e campanhas educativas).

---

## 🔧 Como Rodar Localmente

Pré-requisitos: Node.js (v18+) e Docker (opcional, para DB local).

1.  **Clone o repositório:**
    ```bash
    git clone [https://github.com/Junior-Hugos/Prototipo.git](https://github.com/Junior-Hugos/Prototipo.git)
    cd Prototipo
    ```

2.  **Instale as dependências:**
    ```bash
    npm install
    ```

3.  **Configure o ambiente:**
    Crie um arquivo `.env` na raiz baseado no exemplo e adicione sua `DATABASE_URL` (PostgreSQL).

4.  **Sincronize o Banco de Dados:**
    ```bash
    npx prisma migrate dev
    ```

5.  **Rode o servidor de desenvolvimento:**
    ```bash
    npm run dev
    ```
    Acesse `http://localhost:3000`.

---

## 👥 Equipe de Desenvolvimento

Projeto desenvolvido pelos acadêmicos do Curso Superior de Tecnologia em TI (UFMS):

* **João Paulo da Silva Moreira**
* **Edmilson Figueiredo Santos Junior**
* **Rodrigo Miyashiro**
* **Lourival José Soares Junior**
* **Raphael Neves Ferreira**

---

## 📄 Licença e Referências

Este projeto acadêmico baseia-se nas diretrizes da **Política Nacional de Resíduos Sólidos (Lei nº 12.305/2010)** e nas melhores práticas de Engenharia de Software (Pressman & Sommerville).

---
<p align="center">
  Desenvolvido com 💚 para um futuro mais sustentável.
</p>
