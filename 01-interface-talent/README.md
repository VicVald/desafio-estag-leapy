# Como Executar o Projeto Interface de Talentos

Este projeto é uma aplicação web para gerenciamento de talentos, utilizando Next.js no frontend e Directus como headless CMS no backend, tudo containerizado com Docker para máxima portabilidade.

## Como Executar

1. Navegue até o diretório do projeto:
   ```bash
   cd 01-interface-talent
   ```

2. (Opcional) Configure variáveis de ambiente:
   ```bash
   cp directus/.env.example directus/.env
   # Edite directus/.env com suas configurações personalizadas
   ```

3. Execute os serviços com Docker Compose:
   ```bash
   sudo docker compose -f directus/docker-compose.yml up -d
   ```

   Este comando inicia todos os serviços em background:
   - **PostgreSQL 15**: Banco de dados relacional
   - **Directus 10**: CMS headless com extensão customizada para API de talentos
   - **Frontend**: Aplicação Next.js 16
   - **Seeder**: Script para popular o banco com dados iniciais e usuários

3. Aguarde alguns minutos para que todos os serviços inicializem. Você pode verificar o status com:
   ```bash
   sudo docker ps
   ```

4. Acesse a aplicação:
   - **Frontend**: http://localhost:3000
   - **Directus Admin**: http://localhost:8055 (credenciais padrão: admin@example.com / admin)

## Decisões de Arquitetura e Frontend

### Por que Next.js 16 com App Router?

- **Client-Side Rendering (CSR) com App Router**: Optamos por CSR na página principal para permitir interatividade complexa com hooks de estado (useState, useEffect), filtros dinâmicos e navegação. O App Router oferece melhor organização de rotas, layouts compartilhados e carregamento assíncrono mais eficiente, mesmo em CSR.
- **TypeScript 5**: Garante type safety, reduzindo bugs em tempo de desenvolvimento e melhorando a manutenibilidade do código.
- **API Routes**: Permite criar endpoints server-side para lógica de negócio, como a exportação de CSV, sem necessidade de um backend separado.

### Causas das Decisões Técnicas

- **Debouncing na busca**: Implementado para evitar requests excessivos à API durante a digitação. Sem debouncing, cada tecla pressionada geraria uma nova requisição, sobrecarregando o servidor e degradando a performance. O debouncing de 300ms garante uma experiência fluida sem sacrificar responsividade.
- **Skeleton Loading**: Substitui spinners tradicionais por placeholders que simulam o layout final. Isso melhora a percepção de velocidade da aplicação, pois o usuário vê o "esqueleto" do conteúdo antes dos dados reais carregarem, reduzindo a sensação de espera.
- **Pagination**: Essencial para datasets grandes. Sem paginação, carregar milhares de registros de uma vez causaria lentidão extrema e consumo excessivo de memória. A paginação server-side garante eficiência e escalabilidade.
- **Exportação de CSV**: Permite análise offline dos dados. Inicialmente implementada client-side, foi movida para server-side para incluir todos os registros filtrados (não apenas a página atual), melhorar performance e evitar limitações do navegador.

### Backend e Directus

- **Extensão Customizada `/talents-api`**: Criada uma extensão em Node.js que expõe um endpoint otimizado para consultas complexas, agregando dados de múltiplas tabelas (talentos, usuários, líderes, cargos alvo) em uma única resposta JSON. Suporta filtros avançados, busca por email, ordenação e paginação server-side.
- **Motivo do Seeder**: Resolvido um conflito crítico onde o banco PostgreSQL carregava corretamente, mas o Directus não conseguia criar relações entre tabelas porque os dados iniciais (esquema e seed) não estavam populados. O seeder garante que o banco tenha dados de exemplo consistentes, criando usuários via API do Directus e executando scripts SQL, permitindo que o Directus estabeleça relacionamentos corretamente desde o início.

### Docker e Portabilidade

- **Unificação em Docker Compose**: Todos os serviços (frontend, backend, banco) são definidos em um único arquivo `docker-compose.yml`, garantindo que o ambiente seja idêntico em desenvolvimento, staging e produção. Isso elimina problemas de "funciona na minha máquina" e facilita o deploy.
- **Dockerfile Simples**: Usa Node.js 20 Alpine para build e execução, mantendo a imagem leve.
- **Volumes Persistentes**: Dados do PostgreSQL são persistidos em volumes Docker, garantindo que os dados sobrevivam a reinicializações dos containers.
- **Variáveis de Ambiente**: Configuração flexível via environment variables com valores padrão. Copie `directus/.env.example` para `directus/.env` e ajuste senhas e URLs conforme necessário.

## Funcionalidades Implementadas

- ✅ **Busca e Filtros Avançados**: Por email, departamento, status, PDI, estado do orchestrator, datas e IDs.
- ✅ **Visualização Flexível**: Modo cards ou tabela, com ordenação personalizada.
- ✅ **Paginação**: Navegação eficiente por grandes listas.
- ✅ **Modal de Detalhes**: Visualização completa de um talento com botão de email.
- ✅ **Exportação CSV**: Download de todos os dados filtrados em formato CSV.
- ✅ **Acessibilidade**: ARIA labels, navegação por teclado, skip links.
- ✅ **Responsividade**: Layout adaptável para desktop e mobile.
- ✅ **Skeleton Loading**: Melhor experiência de carregamento.
- ✅ **Debouncing**: Busca otimizada sem sobrecarga.
- ✅ **Estado da URL**: Filtros e paginação são refletidos na URL para compartilhamento.


### Resetar ambiente
```bash
sudo docker compose -f directus/docker-compose.yml down -v
sudo docker compose -f directus/docker-compose.yml up -d
```

## Estrutura do Projeto

```
01-interface-talent/
├── directus/
│   ├── docker-compose.yml    # Definição de todos os serviços
│   ├── extensions/
│   │   └── talents-api/      # Extensão customizada do Directus (Node.js)
│   └── seed/                 # Dados iniciais para o banco (SQL)
└── interface-talent/         # Aplicação Next.js
    ├── Dockerfile            # Build da imagem frontend
    ├── app/
    │   ├── api/talents/      # Endpoint para dados e CSV
    │   ├── globals.css       # Estilos globais (Tailwind)
    │   ├── layout.tsx        # Layout raiz com acessibilidade
    │   └── page.tsx          # Página principal com filtros e listagem
    ├── package.json          # Dependências (Next.js 16, React 19, etc.)
    └── tsconfig.json         # Configuração TypeScript
```
