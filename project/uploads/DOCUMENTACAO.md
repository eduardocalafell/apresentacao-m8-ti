# Documentação do Backend - PainelUtilidades (M8 Core API)

## Índice

1. [Visão Geral](#1-visão-geral)
2. [Tecnologias e Dependências](#2-tecnologias-e-dependências)
3. [Arquitetura do Projeto](#3-arquitetura-do-projeto)
4. [Configuração e Inicialização (Program.cs)](#4-configuração-e-inicialização)
5. [Autenticação e Autorização](#5-autenticação-e-autorização)
6. [Banco de Dados (PostgreSQL)](#6-banco-de-dados)
7. [Controllers e Endpoints](#7-controllers-e-endpoints)
8. [Services (Camada de Negócio)](#8-services)
9. [Modelos de Dados](#9-modelos-de-dados)
10. [Integrações Externas](#10-integrações-externas)
11. [Background Services](#11-background-services)
12. [Helpers e Utilitários](#12-helpers-e-utilitários)
13. [Fluxos de Negócio Principais](#13-fluxos-de-negócio-principais)
14. [Deploy e CI/CD](#14-deploy-e-cicd)

---

## 1. Visão Geral

O **PainelUtilidades** (nome interno: **ConsultaCnpjReceita** / deploy: **m8-core-api**) é uma API backend construída em **ASP.NET Core 8.0** voltada para a gestão de **FIDCs (Fundos de Investimento em Direitos Creditórios)**. A plataforma integra dados de múltiplos administradores financeiros, processa carteiras de fundos, gerencia regras de elegibilidade, gera relatórios de comitê de crédito e rastreia posições de passivo.

### Principais Funcionalidades

- **Integração multi-administrador**: Singulare, BTG Pactual, Hemera, Finaxis, ANBIMA
- **Gestão de carteiras**: Posições diárias, PDD, operações de renda fixa, saldos
- **Controle de estoque**: Recebíveis com rastreio de cedente/sacado
- **Regras de elegibilidade**: Motor de avaliação configurável por fundo
- **Comitê de crédito**: Posicionamento histórico com métricas agregadas
- **Passivo/Cotistas**: Posição de cotistas por fundo e data
- **Relatórios BI**: Sintético, analítico, concentração, risco, vencidos, PDD, liquidados
- **Processamento em background**: Fila de jobs assíncronos para integrações pesadas
- **Consulta CNPJ**: Integração com ReceitaWS para dados cadastrais
- **SFTP/FTP**: Download automático de arquivos de administradores
- **Envio de e-mails**: Geração de HTML e envio via Power Automate

---

## 2. Tecnologias e Dependências

### Framework
- **.NET 8.0** (ASP.NET Core Web API)

### Banco de Dados
| Pacote | Versão | Finalidade |
|--------|--------|------------|
| Microsoft.EntityFrameworkCore | 8.0.8 | ORM principal |
| Npgsql.EntityFrameworkCore.PostgreSQL | 8.0.8 | Provider PostgreSQL |
| Microsoft.EntityFrameworkCore.Design | 8.0.8 | Ferramentas de migração |

### Cloud e Storage
| Pacote | Versão | Finalidade |
|--------|--------|------------|
| Azure.Storage.Blobs | 12.26.0 | Azure Blob Storage |
| Azure.Storage.Files.Shares | 12.24.0 | Azure File Share |
| Microsoft.Identity.Web | 4.1.1 | Azure AD / OAuth2 |
| Microsoft.Identity.Web.MicrosoftGraph | 4.1.1 | Microsoft Graph |

### Processamento de Dados
| Pacote | Versão | Finalidade |
|--------|--------|------------|
| CsvHelper | 33.1.0 | Parsing de arquivos CSV |
| EPPlus | 8.4.1 | Leitura/escrita de Excel |
| SlapKit.Excel | 2.2.0 | Utilitários Excel |
| Newtonsoft.Json | 13.0.3 | Serialização JSON |
| ZstdNet | 1.5.7 | Descompressão Zstandard |
| ZstdSharp | 0.7.2 | Compressão Zstandard |

### Rede e Integração
| Pacote | Versão | Finalidade |
|--------|--------|------------|
| FluentFTP | 53.0.2 | Operações FTP/SFTP |
| SSH.NET | 2024.2.0 | Conexão SSH/SFTP |

### API e Documentação
| Pacote | Versão | Finalidade |
|--------|--------|------------|
| Swashbuckle.AspNetCore | 6.8.1 | Swagger/OpenAPI |

---

## 3. Arquitetura do Projeto

```
PainelUtilidades/
├── Program.cs                          # Entry point, DI, middleware pipeline
├── appsettings.json                    # Configurações e credenciais
├── ConsultaCnpjReceita.csproj          # Projeto .NET 8.0
├── ConsultaCnpjReceita.sln             # Solution Visual Studio
│
├── src/
│   ├── Controller/                     # 9 controllers REST
│   │   ├── 01-UtilidadesController.cs
│   │   ├── 02-SftpController.cs
│   │   ├── 03-IntegracaoController.cs
│   │   ├── 04-ReportController.cs
│   │   ├── 05-ElegibilidadeController.cs
│   │   ├── 06-EvolucaoCotasCarteiraController.cs
│   │   ├── 06-FundosController.cs
│   │   ├── 07-PassivoController.cs
│   │   └── 08-RelatorioController.cs
│   │
│   ├── Service/                        # Camada de negócio (18 services)
│   │   ├── AzureBlobService.cs
│   │   ├── ComiteCreditoService.cs
│   │   ├── EvolucaoCotasCarteiraService.cs
│   │   ├── FundosService.cs
│   │   ├── PassivoService.cs
│   │   ├── PessoaService.cs
│   │   ├── ProcessamentoBackgroundService.cs
│   │   ├── ProcessamentoRegrasElegibilidadeService.cs
│   │   ├── RelatorioService.cs
│   │   ├── ReportService.cs
│   │   ├── SftpService.cs
│   │   ├── UtilidadesService.cs
│   │   ├── WebhookService.cs
│   │   ├── BackgroundService/
│   │   │   ├── BackgroundJobRequest.cs
│   │   │   ├── SftpBackgroundWorkerService.cs
│   │   │   └── SingulareBackgroundWorkerService.cs
│   │   └── Integracao/
│   │       ├── IntegracaoService.cs
│   │       ├── IntegracaoAnbimaService.cs
│   │       ├── IntegracaoEstoqueService.cs
│   │       └── IntegracaoIndicesService.cs
│   │
│   ├── Model/                          # 26 arquivos de modelos/entidades
│   │   ├── Anbima/FundoAnbima.cs
│   │   ├── Carteira/
│   │   │   ├── Carteira.cs
│   │   │   ├── OperacaoRendaFixaCarteira.cs
│   │   │   ├── OutrosFundosCarteira.cs
│   │   │   ├── PddCarteira.cs
│   │   │   └── SaldosCarteira.cs
│   │   ├── Consultoria/
│   │   │   ├── Fundo.cs
│   │   │   └── GrupoConsultoria.cs
│   │   ├── Enums/
│   │   │   ├── BackgroundJobType.cs
│   │   │   └── TipoMercado.cs
│   │   ├── Passivo/Cotista.cs
│   │   ├── Tokens/
│   │   │   ├── AnbimaAuthToken.cs
│   │   │   ├── BtgPactualApiAuthToken.cs
│   │   │   ├── HemeraApiAuthToken.cs
│   │   │   └── SingulareApiAuthToken.cs
│   │   ├── ComiteCredito.cs
│   │   ├── Estoque.cs
│   │   ├── Feriado.cs
│   │   ├── Indices.cs
│   │   ├── Liquidados.cs
│   │   ├── Passivo.cs
│   │   ├── Pessoa.cs
│   │   ├── RegrasElegibilidade.cs
│   │   ├── RelatorioMercado.cs
│   │   ├── RelatoriosProcessados.cs
│   │   ├── RetornoReceita.cs
│   │   ├── Sftp.cs
│   │   ├── TabelasOrigemCnpj.cs
│   │   ├── WebhookSingulare.cs
│   │   └── XmlAnbima.cs
│   │
│   ├── Data/                           # DbContext e migrações
│   │   ├── AppDbContext.cs
│   │   ├── 20241011184050_initial.cs
│   │   ├── 20241011184050_initial.Designer.cs
│   │   └── AppDbContextModelSnapshot.cs
│   │
│   ├── Factory/
│   │   └── AuthProviderFactory.cs      # Fábrica de autenticação para APIs
│   │
│   ├── Helpers/
│   │   ├── DataHelper.cs               # Cálculo de dias úteis
│   │   ├── EmailHelper.cs              # Envio de e-mails via Power Automate
│   │   └── JsonHelper.cs               # Descompressão e deserialização JSON
│   │
│   ├── Utils/
│   │   ├── Extensions.cs               # Extensões C# (CNPJ, CPF, números)
│   │   ├── envio-cota-sen-mez.html     # Template e-mail cotas sênior/mezanino
│   │   └── envio-cota-sub.html         # Template e-mail cotas subordinadas
│   │
│   ├── XML/                            # 71 arquivos XML de fundos ANBIMA
│   ├── Security/usr_m8                 # Chave privada SFTP Singulare
│   └── Log/exec.log                    # Log de execução SFTP
│
├── Properties/launchSettings.json      # Perfis de execução
├── .github/workflows/
│   └── main_m8-core-api.yml           # CI/CD Azure
└── .claude/                            # Configurações Claude Code
```

---

## 4. Configuração e Inicialização

### Program.cs - Pipeline de Inicialização

#### Registro de Serviços (Dependency Injection)

**Background Services (Singleton):**
```
SftpBackgroundWorker        → Download de XMLs via SFTP Singulare
SingulareBackgroundWorker   → Orquestrador de jobs em background (41 tipos)
```

**Serviços de Negócio (Scoped):**
```
WebhookService                          → Webhooks Singulare
AzureBlobService                        → Upload Azure File Share
SftpService                             → Operações SFTP/FTP
IntegracaoService                       → Integração carteira/liquidados
UtilidadesService                       → Utilidades e dados faltantes
ReportService                           → Relatórios de CPR e evolução
ProcessamentoRegrasElegibilidadeService → Motor de regras de elegibilidade
ComiteCreditoService                    → Comitê de crédito
EvolucaoCotasCarteiraService            → Evolução de cotas e rentabilidade
IntegracaoIndicesService                → Integração CDI/BCB
PessoaService                           → Gestão de pessoas (CNPJ/CPF)
PassivoService                          → Posições de passivo
IntegracaoEstoqueService                → Estoque Hemera
IntegracaoAnbimaService                 → Dados fundos ANBIMA
FundosService                           → Listagem de fundos Hemera
RelatorioService                        → Relatórios BI
```

**Factory:**
```
AuthProviderFactory → Criação de HttpClient autenticado por provedor
```

#### Middleware Pipeline (ordem de execução)

1. **Swagger/SwaggerUI** - Documentação OpenAPI com OAuth2
2. **CORS** - Permite todas as origens (`*`)
3. **HTTPS Redirection**
4. **Authentication** - Microsoft Identity Web (JWT Bearer)
5. **Authorization** - Políticas baseadas em roles
6. **Controller Mapping**

---

## 5. Autenticação e Autorização

### Azure Active Directory (OAuth2 / JWT Bearer)

| Parâmetro | Valor |
|-----------|-------|
| Instance | `https://login.microsoftonline.com/` |
| Tenant ID | `c8d61800-0407-4b7e-8a76-cb46cfd6bf6c` |
| Client ID | `1a4c2641-fb99-47f6-b6b4-169dd7597722` |
| Scopes | `api://1a4c2641-fb99-47f6-b6b4-169dd7597722/M8.All` |

### Validação de Token Customizada

O sistema valida tokens JWT com as seguintes verificações:
- **Claim "roles"** → mapeado para `ClaimTypes.Role`
- **Client App ID** → validação via claims `azp` ou `appid`
- **Token expirado** → retorna `{"error":"token_expired"}` (HTTP 401)
- **Token inválido** → retorna `{"error":"invalid_token"}` (HTTP 401)

### Políticas de Autorização

| Política | Role Requerida |
|----------|---------------|
| `Backoffice` | `m8manage.backoffice` |
| `TI` | `m8manage.ti` |

### Níveis de Acesso nos Endpoints

- `[AllowAnonymous]` → Acesso público (sem autenticação)
- `[Authorize]` → Requer token JWT válido
- `[Authorize(Roles = "m8manage.ti,m8manage.backoffice")]` → Requer role específica

---

## 6. Banco de Dados

### Configuração

| Parâmetro | Valor |
|-----------|-------|
| Provider | PostgreSQL (Npgsql) |
| Servidor | `sql-m8.postgres.database.azure.com` |
| Database | `m8-partners-prod` |
| Command Timeout | 300 segundos |
| SSL Mode | Required |
| Connection Pooling | Enabled |
| Senha | Via variável de ambiente `DB_KEY` |

### AppDbContext - Entidades Mapeadas (43 DbSets)

#### Tabelas de Domínio

| DbSet | Tabela | Descrição |
|-------|--------|-----------|
| `RegistroFundos` | RegistroFundos | Cadastro central de fundos |
| `Carteiras` | Carteiras | Posições de carteira |
| `Estoques` | Estoques | Posições de estoque/recebíveis |
| `Liquidados` | Liquidados | Operações liquidadas |
| `Cprs` | Cprs | CPRs (custos/taxas) |
| `PddsCarteira` | PddsCarteira | Provisão para Devedores Duvidosos |
| `SaldosCarteira` | SaldosCarteira | Saldos de carteira |
| `OperacoesRendaFixaCarteira` | OperacoesRendaFixaCarteira | Operações de renda fixa |
| `OutrosFundosCarteira` | OutrosFundosCarteira | Outros fundos na carteira |
| `PosicoesPassivo` | PosicoesPassivo | Posições de passivo/cotistas |
| `Indices` | Indices | Índices financeiros (CDI) |
| `Pessoas` | Pessoas | Cadastro de pessoas/empresas |
| `FeriadosNacionais` | FeriadosNacionais | Calendário de feriados |
| `FundosAnbima` | FundosAnbima | Catálogo ANBIMA |
| `Cotistas` | Cotistas | Cotistas/investidores |

#### Tabelas de Regras e Comitê

| DbSet | Tabela | Descrição |
|-------|--------|-----------|
| `GruposConsultoria` | GruposConsultoria | Grupos de consultoria |
| `GruposComiteCredito` | GruposComiteCredito | Grupos do comitê de crédito |
| `RegistrosComiteCredito` | RegistrosComiteCredito | Registros do comitê |
| `RegrasElegibilidade` | RegrasElegibilidade | Conjuntos de regras |
| `RegrasElegibilidadeDetalhes` | RegrasElegibilidadeDetalhes | Detalhes das regras |
| `ResultadosRegrasElegibilidade` | ResultadosRegrasElegibilidade | Resultados da avaliação |

#### Tabelas Staging (Dados Brutos)

| DbSet | Tabela | Descrição |
|-------|--------|-----------|
| `tb_stg_estoque_singulare_full` | — | Estoque Singulare |
| `tb_stg_estoque_finaxis_full` | — | Estoque Finaxis |
| `tb_stg_estoque_hemera_full` | — | Estoque Hemera |
| `tb_stg_liquidados_singulare_full` | — | Liquidados Singulare |
| `tb_stg_liquidados_finaxis_full` | — | Liquidados Finaxis |
| `tb_stg_liquidados_bancario_hemera_full` | — | Liquidados Hemera |
| `tb_stg_liquidados_recompra_hemera_full` | — | Recompra Hemera |

#### Tabelas Auxiliares

| DbSet | Tabela | Descrição |
|-------|--------|-----------|
| `tb_aux_Retorno_Receita` | — | Retornos ReceitaWS |
| `tb_aux_Xml_Anbima` | — | XMLs ANBIMA |
| `tb_aux_callback_estoque_singulare` | — | Callbacks webhook |
| `tb_aux_retorno_xml_anbima` | — | XMLs processados |
| `tb_aux_relatorios_processados` | — | Histórico de processamento |
| `tb_ods_titulo_privado_carteira` | — | Títulos privados |

### Índices do Banco

```csharp
// Estoque
Index: {RegistroFundoId, DataReferencia}
Index: FaixaPdd

// Carteira
Index: {RegistroFundoId, DataPosicao}

// Liquidado
Index: {RegistroFundoId, DataAquisicao}

// RegistroFundo
Index: {IsAtivo, TipoFundo}
Index: GrupoConsultoriaId
```

### Modelo de Relacionamento

```
RegistroFundos (cadastro central de fundos)
├── Carteiras (posições de carteira por data)
│   ├── OperacoesRendaFixaCarteira (operações renda fixa)
│   ├── PddCarteira (provisão devedores duvidosos)
│   ├── OutrosFundosCarteira (outros fundos)
│   └── SaldosCarteira (saldos)
├── Estoques (recebíveis/direitos creditórios)
├── Liquidados (operações liquidadas)
├── Cprs (custos e taxas)
└── PosicoesPassivo (posições de passivo)

GruposConsultoria (grupos de consultoria)
├── RegistroFundos[] (fundos do grupo)
├── RegrasElegibilidade (regras)
│   └── RegrasElegibilidadeDetalhes[] (detalhes)
└── ResultadosRegrasElegibilidade[] (resultados)

GruposComiteCredito (grupos do comitê)
├── GruposConsultoria[] (consultorias)
└── RegistrosComiteCredito[] (posições do comitê)

FundosAnbima (catálogo ANBIMA)
Cotistas (cotistas/investidores)
FeriadosNacionais (calendário de feriados)
Indices (CDI e outros índices)
```

---

## 7. Controllers e Endpoints

### 7.1 UtilidadesController (`/Utilidades`)

Gerencia utilitários e relatórios de dados faltantes.

| Método | Rota | Descrição | Auth |
|--------|------|-----------|------|
| GET | `/ListarEstoqueFaltantes` | Lista estoques com datas faltantes | AllowAnonymous |
| GET | `/ListarCarteirasFaltantesIncompletas` | Lista carteiras com datas faltantes | AllowAnonymous |
| GET | `/ListarPassivosFaltantes` | Lista passivos com datas faltantes | AllowAnonymous |
| GET | `/ListarCarteirasIncompletas` | Lista carteiras sem PDD calculado | AllowAnonymous |
| POST | `/ConsultarListaCnpj` | Consulta batch de CNPJs na ReceitaWS | Authorize |

---

### 7.2 SftpController (`/Sftp`)

Operações de download via SFTP.

| Método | Rota | Descrição | Auth |
|--------|------|-----------|------|
| POST | `/RecuperarXmlAmbimaSingulare` | Enfileira download de XMLs ANBIMA via SFTP | Authorize |

---

### 7.3 IntegracaoController (`/Integracao`) — 31 endpoints

Principal controller de integração com administradores financeiros.

#### Integração Singulare

| Método | Rota | Descrição |
|--------|------|-----------|
| GET | `/RecuperarListaFundosSingulare` | Lista fundos cadastrados na Singulare |
| GET | `/RecuperarRelatorioCprSingulare` | Recupera relatórios CPR por range |
| GET | `/RecuperarCarteiraJsonSingulare` | Carteiras em JSON por range |
| GET | `/RecuperarRelatorioEstoqueFaltantesSingulare` | Estoques faltantes |
| GET | `/RecuperarCarteirasFaltantesJsonSingulare` | Carteiras faltantes |
| GET | `/RecuperarCarteirasIncompletasJsonSingulare` | Carteiras incompletas |
| GET | `/RecuperarCarteiraXmlAnbimaSingulare` | Carteiras XML ANBIMA por range |
| GET | `/RecuperarRelatorioEstoqueSingulare` | Relatório de estoque por range |
| GET | `/RecuperarRelatorioLiquidadosSingulare` | Liquidados por range |
| POST | `/RecuperarRelatorioLiquidadosFaltantesSingulare` | Liquidados faltantes |
| POST | `/ReceberEstoqueSingulare` | Webhook: recebe estoque (body: `WebhookSingularePayload`) |
| POST | `/ReceberLiquidadosSingulare` | Webhook: recebe liquidados (body: `WebhookSingularePayload`) |

#### Integração BTG Pactual

| Método | Rota | Descrição |
|--------|------|-----------|
| GET | `/RecuperarListaFundosBtgPactual` | Lista fundos BTG |
| GET | `/RecuperarCarteirasFaltantesBtgPactual` | Carteiras faltantes |
| GET | `/RecuperarCarteirasIncompletasBtgPactual` | Carteiras incompletas |
| GET | `/RecuperarCarteiraXmlAnbimaBtgPactual` | Carteiras XML ANBIMA |
| POST | `/ReceberListaFundosBtgPactual` | Recebe lista (body: `BtgPactualApiTicket`) |
| POST | `/ReceberCarteiraXmlAnbimaBtgPactual` | Recebe XML (body: `BtgPactualApiTicket`) |
| POST | `/ReceberCarteiraExcelBtgPactual` | Recebe Excel (body: `BtgPactualApiTicket`) |
| POST | `/ReceberCarteiraSomenteOperacaoXmlAnbimaBtgPactual` | Recebe apenas operações |

#### Outras Integrações

| Método | Rota | Tag | Descrição |
|--------|------|-----|-----------|
| POST | `/CarregarPosicaoComiteTodos` | Comitê de Crédito | Carrega posições de todos os grupos |
| POST | `/RecuperarIndicesCdiBcb` | Índices | Busca CDI no Banco Central |
| POST | `/IdentificarIntegrarArquivos` | Hemera/Finaxis | Upload e integração de arquivos (form files) |
| POST | `/RecuperarPessoasIntegrarReceita` | Cedente/Sacado | Integra dados da Receita Federal |
| POST | `/ProcessarTodosSftpFinaxis` | Hemera/Finaxis | Processa SFTP Finaxis |
| POST | `/RecuperarEstoqueHemera` | Hemera/Finaxis | Busca estoque Hemera |
| POST | `/RecuperarPosicaoPassivoBtgPactual` | Passivo | Posições passivo BTG |
| POST | `/RecuperarPosicaoPassivoSingulare` | Passivo | Posições passivo Singulare |
| POST | `/RecuperarDadosFundosAnbima` | ANBIMA | Catálogo de fundos |
| POST | `/AdicionarAtualizarCotistasAnbima` | ANBIMA | Sincroniza cotistas |
| POST | `/RecuperarPosicoesPassivoFaltantesBtgPactual` | Passivo | Posições faltantes |

> **Padrão**: A maioria dos endpoints enfileira trabalho no `SingulareBackgroundWorker` e retorna **HTTP 202 (Accepted)**.

---

### 7.4 ReportController (`/Report`) — 9 endpoints

Relatórios e dados para dashboards.

| Método | Rota | Parâmetros | Auth |
|--------|------|------------|------|
| GET | `/RecuperarListaGruposConsultoria` | — | Authorize |
| GET | `/RecuperarListaFundosRelatorio` | — | Authorize |
| GET | `/RecuperarCprPorFundoId` | `FundoId` (Guid), `Periodo?` (string) | Authorize |
| GET | `/RecuperarCprTodosFundos` | — | AllowAnonymous |
| GET | `/RecuperarEvolucaoCotasPorFundoId` | `FundoId` (Guid) | Authorize |
| GET | `/RecuperarEvolucaoCotasFundos` | — | AllowAnonymous |
| GET | `/RecuperarListaFundosValidos` | — | AllowAnonymous |
| GET | `/RecuperarListaGruposConsultoriasValidas` | — | AllowAnonymous |
| GET | `/RecuperarPosicaoComitePorGrupoId` | `GrupoId`, `QuantidadeDatas`, `IntervaloDias` | AllowAnonymous |

---

### 7.5 ElegibilidadeController (`/Elegibilidade`) — 7 endpoints

Motor de regras de elegibilidade.

| Método | Rota | Parâmetros | Auth |
|--------|------|------------|------|
| POST | `/AvaliarRegrasElegibilidadeTodos` | — | Default |
| POST | `/AvaliarRegrasElegibilidadeFundo` | `GrupoConsultoriaId` (Guid) | Authorize |
| POST | `/CriarConjuntoRegras` | Body: `CriarRegraElegibilidadeRequest` | Default |
| POST | `/CriarRegraDetalhe` | Body: `CriarRegraElegibilidadeDetalheRequest` | Default |
| POST | `/CriarListaRegrasDetalhe` | Body: `List<CriarRegraElegibilidadeDetalheRequest>` | Default |
| GET | `/RecuperarResultadoRegrasElegibilidade` | `GrupoConsultoriaId`, `DataPesquisa?` | Default |
| GET | `/RecuperarResultadoRegrasResumo` | — | Default |

---

### 7.6 EvolucaoCotasCarteiraController (`/EvolucaoCotasCarteira`) — 3 endpoints

Cálculos de rentabilidade e envio de e-mails de cotas.

| Método | Rota | Descrição |
|--------|------|-----------|
| POST | `/CalcularRentabilidadeRealCotas` | Calcula rentabilidade real vs esperada |
| POST | `/MontarEmailCotasSeniorMezanino` | Gera e-mail HTML de cotas sênior/mezanino |
| POST | `/MontarEmailCotasSubordinadas` | Gera e-mail HTML de cotas subordinadas |

---

### 7.7 FundosController (`/Fundos`) — 2 endpoints

Listagem de fundos Hemera.

| Método | Rota | Descrição | Auth |
|--------|------|-----------|------|
| GET | `/RecuperarListaCotasSrMezHemera` | Cotas sênior/mezanino com datas de integração | AllowAnonymous |
| GET | `/RecuperarListaCotasSubHemera` | Cotas subordinadas com estrutura aninhada | AllowAnonymous |

---

### 7.8 PassivoController (`/Passivo`) — 5 endpoints

Gestão de passivo e cotistas.

| Método | Rota | Parâmetros | Auth |
|--------|------|------------|------|
| GET | `/ListarFundosPassivo` | — | Authorize |
| GET | `/ListarDatasValidasPassivo` | — | Authorize |
| GET | `/RecuperarInformacoesPassivoTodos` | `DataPesquisa?`, `TextFilter?` | Authorize (Roles: ti, backoffice) |
| GET | `/RecuperarInformacoesPassivoPorFundoId` | `FundoId`, `DataPesquisa?`, `QtdCotistas` (default: 15) | Authorize |
| GET | `/RecuperarInformacoesCotistaPorId` | `CotistaId`, `DataPesquisa?` | Authorize |

---

### 7.9 RelatorioController (`/Relatorio`) — 15 endpoints

Relatórios para telas de BI. Todos os endpoints usam `[Authorize]` e recebem parâmetros de filtro opcionais: `DataPosicao`, `GrupoConsultoriaId?`, `Administrador?`.

| Método | Rota | Descrição |
|--------|------|-----------|
| GET | `/RecuperarListaAdministradores` | Lista de administradores distintos |
| GET | `/RecuperarListaFundos` | Fundos agrupados por consultoria |
| GET | `/RecuperarListaDatasDisponiveis` | Datas de carteira disponíveis |
| GET | `/RecuperarSintetico` | Relatório sintético (patrimônio, recebíveis) |
| GET | `/RecuperarAnalitico` | Relatório analítico detalhado |
| GET | `/RecuperarConcentracao` | Análise de concentração |
| GET | `/RecuperarRiscoTotal` | Risco total da carteira |
| GET | `/RecuperarAVencerVencidos` | Títulos a vencer e vencidos |
| GET | `/RecuperarVencidosPorFaixa` | Vencidos por faixa de atraso |
| GET | `/RecuperarPddPorFaixa` | PDD por faixa |
| GET | `/RecuperarDeltaPdd` | Delta PDD entre datas |
| GET | `/RecuperarLiquidados` | Operações liquidadas |
| GET | `/RecuperarAporteResgate` | Aportes e resgates |
| GET | `/RecuperarCedentes` | Análise por cedente |
| GET | `/RecuperarSacados` | Análise por sacado |

---

## 8. Services

### 8.1 IntegracaoService

**Responsabilidade**: Integração principal de carteiras, estoques e liquidados com Singulare e BTG Pactual.

**Métodos Principais**:
- `RecuperarRelatorioEstoqueSingulare(dataPesquisa)` — Solicita relatórios de estoque via API Singulare com URL de callback para webhook
- `RecuperarRelatorioEstoqueFaltantesSingulare()` — Identifica e solicita estoques faltantes em batch
- `RecuperarRelatorioLiquidadosSingulare(dataInicio, dataFim)` — Solicita liquidados por range de datas
- `RecuperarRelatorioLiquidadosFaltantesSingulare()` — Batch de liquidados faltantes
- `ReceberListaFundosBtgPactual(ticket)` — Processa ticket BTG com lista de fundos
- `ReceberCarteiraXmlAnbimaBtgPactual(ticket)` — Processa carteira XML ANBIMA do BTG
- `ReceberCarteiraExcelBtgPactual(ticket)` — Processa carteira Excel do BTG
- `RecuperarPosicaoPassivoBtgPactual()` — Busca posições de passivo do BTG
- `RecuperarPosicaoPassivoSingulare()` — Busca posições de passivo da Singulare

**Padrão de Integração Singulare**:
```
POST API Singulare → callbackUrl → Webhook recebido → Processamento assíncrono
```

**Controle de Concorrência**: SemaphoreSlim, chunks de 30 fundos por renovação de token, delay de 5-10s entre requisições.

---

### 8.2 WebhookService

**Responsabilidade**: Processamento de callbacks webhook da Singulare.

**Fluxo**:
1. `CallbackEstoqueSingulare(payload)` — Recebe webhook, salva em `tb_aux_callback_estoque_singulare`, enfileira processamento
2. `ProcessarArquivosEstoqueSingulare()` — Processa arquivos não processados de webhooks pendentes
3. `ProcessarUnicoArquivoEstoqueSingulare(webhook)` — Baixa CSV, parseia com delimitador `;`, insere/atualiza em `tb_stg_estoque_singulare_full`
4. `RecuperarRelatorioEstoqueSingulare()` — Solicita relatórios para cada CNPJ ativo

---

### 8.3 SftpService

**Responsabilidade**: Download de arquivos via SFTP/FTP.

**Fontes SFTP/FTP**:

| Fonte | Host | Protocolo | Descrição |
|-------|------|-----------|-----------|
| Singulare | `sftp.singulare.com.br` | SFTP (chave privada) | XMLs ANBIMA |
| Finaxis RETIP | `b2bi.finaxis.com.br` | FTP | Estoque Finaxis |
| Finaxis LOPER | `b2bi.finaxis.com.br` | FTP | Estoque Finaxis |
| Finaxis FFLIP | `b2bi.finaxis.com.br` | FTP | Estoque Finaxis |
| Finaxis RTIME | `b2bi.finaxis.com.br` | FTP | Estoque Finaxis |

**Métodos**:
- `RecuperarXmlAmbimaSingulare()` — SFTP com chave privada (`src/Security/usr_m8`), download de `/IN/XML_Anbima`, upload para Azure
- `ProcessarTodosSftpFinaxis()` — Itera 4 fontes FTP Finaxis
- `ProcessarSftp(source)` — Download de arquivos `ExistenciaPetra*`, parsing CSV, inserção de estoque
- `ProcessarArquivoFinaxis(stream, fundo)` — Parsing CSV com CsvHelper, mapeamento para `Estoque`

---

### 8.4 ComiteCreditoService

**Responsabilidade**: Cálculo e consulta de posições do comitê de crédito.

**Métodos**:
- `RecuperarListaFundosValidos()` — Fundos subordinados ativos com ISIN válido
- `RecuperarListaGruposConsultoriasValidas()` — Grupos com cotas subordinadas
- `RecuperarPosicaoComitePorGrupoId(grupoId, qtdDatas, intervaloDias)` — Posições históricas com amostragem por intervalo
- `CarregarPosicaoComiteTodos()` — Calcula e persiste posições para todos os grupos

**Métricas Calculadas**: PL, PL Subordinado, % PL Sub, ILM, Taxa Gestão, Taxa Média Cessão, PDD (Mensal/Ano/Total), Caixa, Rentabilidade Sub (Mês/Ano), Investimento M8.

---

### 8.5 ProcessamentoRegrasElegibilidadeService

**Responsabilidade**: Motor de regras de elegibilidade para fundos FIDC.

**CRUD de Regras**:
- `CriarConjuntoRegras(request)` — Cria conjunto de regras por consultoria (impede duplicatas ativas)
- `CriarRegraDetalhe(request)` — Adiciona regra individual ao conjunto
- `CriarListaRegrasDetalhe(list)` — Criação batch de detalhes

**Avaliação**:
- `AvaliarRegrasElegibilidadeTodos()` — Avalia todas as consultorias com dados de carteira e estoque
- `AvaliarRegrasElegibilidadeFundo(grupoId)` — Avalia consultoria específica
- `ProcessarRegras(consultoria, regras, context)` — Engine de avaliação com análise complexa de carteira

**Tipos de Regra (enum TipoRegra — 24 valores)**:
- Subordinação (Sênior, Mezanino)
- Direitos Creditórios sobre PL
- Concentração (Maior/Top 3/5/10 Cedentes e Sacados)
- Prazo Médio/Máximo (Duplicata, Nota Comercial, CCB)
- Taxa Mínima Recebível
- Concentrações máximas (RJ, Contratos, LCC, Cheque, Cartão, A Performar)

**Operadores**: `<`, `<=`, `>`, `>=`, `=`
**Unidades**: Percentual, Dias, Meses, Quantidade, Outros

---

### 8.6 EvolucaoCotasCarteiraService

**Responsabilidade**: Cálculo de rentabilidade de cotas e geração de e-mails.

**Métodos**:
- `CalcularRentabilidadeRealCotas()` — Calcula rentabilidade diária/mensal/semestral/anual/total para cotas não-subordinadas

**Fórmula de Rentabilidade Composta**:
```
rentabilidade = (((taxa/100 + 1) * (taxa_anterior/100 + 1)) - 1) * 100
```
Reset mensal quando muda o mês com eventos de emissão/resgate.

- `MontarEmailCotasSeniorMezanino()` — Gera HTML com 3 datas de comparação, eventos de amortização, alertas de rentabilidade
- `MontarEmailCotasSubordinadas()` — Gera HTML com últimas 12 posições, coloração por performance
- `ValidarRentabilidadeCota(cota, carteira)` — Valida rentabilidade esperada vs real usando índice CDI

**Envio**: Via `PowerAutomateEmailHelper` (webhook Power Automate)

---

### 8.7 RelatorioService

**Responsabilidade**: Dados para relatórios de BI.

**Métodos**:
- `RecuperarListaAdministradores()` — Administradores distintos (SOCOPA → SINGULARE mapping)
- `RecuperarListaFundos()` — Fundos agrupados por consultoria
- `RecuperarListaDatasDisponiveis()` — Datas com carteira disponível
- `RecuperarSintetico(data, grupo?, admin?)` — Relatório sintético com patrimônio, recebíveis, posicionamento
- `RecuperarAnalitico(data?, grupo?, admin?)` — Análise detalhada por fundo
- `RecuperarConcentracao(...)` — Concentração por cedente/sacado
- `RecuperarRiscoTotal(...)` — Risco total da carteira
- `RecuperarAVencerVencidos(...)` — Títulos a vencer e vencidos
- `RecuperarVencidosPorFaixa(...)` — Vencidos por faixa de atraso
- `RecuperarPddPorFaixa(...)` — PDD por faixa
- `RecuperarDeltaPdd(...)` — Variação de PDD entre períodos
- `RecuperarLiquidados(...)` — Operações liquidadas
- `RecuperarAporteResgate(...)` — Aportes e resgates
- `RecuperarCedentes(...)` — Posição por cedente
- `RecuperarSacados(...)` — Posição por sacado

---

### 8.8 PassivoService

**Responsabilidade**: Gestão de posições de passivo e cotistas.

**Administradores Suportados**: BTG PACTUAL, SOCOPA (→ QI TECH), GRADUAL (→ QI TECH)

**Métodos**:
- `ListarFundosPassivo()` — Fundos agrupados por CNPJ com mapeamento de consultoria
- `ListarDatasValidasPassivo()` — Datas de posição disponíveis
- `RecuperarInformacoesPassivoTodos(data?, filtro?)` — Agregação por fundo, cotista, distribuidor e tipo de conta
- `RecuperarInformacoesPassivoPorFundoId(fundoId, data?, qtdCotistas)` — Posição detalhada do fundo
- `RecuperarInformacoesCotistaPorId(cotistaId, data?)` — Histórico do cotista

---

### 8.9 ReportService

**Responsabilidade**: Relatórios de CPR e evolução de cotas.

**Métodos**:
- `RecuperarListaGruposConsultoria()` — Consultorias com regras configuradas
- `RecuperarListaFundosRelatorio()` — Fundos ativos para filtros
- `RecuperarCprPorFundoId(fundoId, periodo?)` — CPRs agregadas por data com filtros: "taxa de", "cobrança", "consultoria"
- `RecuperarEvolucaoCotasPorFundoId(fundoId)` — Evolução de cotas por fundo
- `RecuperarEvolucaoCotasFundos()` — Evolução de todos os fundos
- `RecuperarCprTodosFundos()` — CPRs de todos os fundos

---

### 8.10 PessoaService

**Responsabilidade**: Integração de dados cadastrais de pessoas/empresas.

**Método Principal**:
- `RecuperarPessoasIntegrarReceita()` — Extrai cedentes/sacados do estoque, consulta ReceitaWS, insere em `Pessoas`

**Detalhes**:
- Identifica CPF vs CNPJ (< 12 dígitos = CPF)
- API: `https://receitaws.com.br/v1/cnpj/{cnpj}/days/30`
- Concorrência: SemaphoreSlim(10), chunks de 50
- HTTP 404 → registra como pessoa física

---

### 8.11 UtilidadesService

**Responsabilidade**: Funções utilitárias e relatórios de completude de dados.

**Métodos de Dados Faltantes**:
- `ListarCarteirasFaltantes()` — Compara dias úteis esperados vs dados reais
- `ListarPassivosFaltantes()` — Passivos faltantes (apenas BTG PACTUAL)
- `ListarCarteirasIncompletas()` — Carteiras sem PDD
- `ListarEstoqueFaltantes()` — Estoques faltantes para subordinadas
- `ListarLiquidadosFaltantes()` — Liquidados faltantes

**Utilitários**:
- `RecuperarTresUltimasDatasValidas()` — Últimos 3 dias úteis
- `RecuperarRentabilidadeDiariaCotaSrMz(premio, data)` — Rentabilidade diária esperada com prêmio sobre CDI
- `RecuperarContagemDiasUteis(data, tipo)` — Contagem de dias úteis (mês/semestre/ano)
- `ConsultarListaCnpj()` — Batch de consulta CNPJ (até 10.000 lotes)

---

### 8.12 AzureBlobService

**Responsabilidade**: Upload de arquivos para Azure File Share.

**Configuração**: Share Name: `m8-fileserver`, Connection via `AZURE_KEY`

**Método**: `UploadFile(fileName, filePath, parentFolder, targetFolder, content, subFolder?)` — Cria hierarquia de diretórios e faz upload.

---

### 8.13 IntegracaoAnbimaService

**Responsabilidade**: Integração com catálogo de fundos ANBIMA.

**Métodos**:
- `RecuperarDadosFundosAnbima()` — Paginação de 1000 fundos, tipos: FIF, FIP, FII, FIDC, ETF, OFFSHORE, FIAGRO
- `AdicionarAtualizarCotistasAnbima()` — Sincroniza cotistas com dados ANBIMA

**API**: `/feed/fundos/v2/fundos` com OAuth2

---

### 8.14 IntegracaoEstoqueService

**Responsabilidade**: Integração de estoque com Hemera.

**Método**: `RecuperarEstoqueHemera()` — POST para `/v1/hub-informacao/relatorios/{CNPJ}/fundo`, polling até "concluido", download de .zst comprimido.

---

### 8.15 IntegracaoIndicesService

**Responsabilidade**: Integração de índices financeiros com Banco Central.

**Método**: `RecuperarIndicesCdiBcb()` — Busca série CDI no BCB (`api.bcb.gov.br/dados/serie/bcdata.sgs.11`), calcula variação diária `(atual/anterior) - 1`, insere em `Indices`.

---

### 8.16 FundosService

**Responsabilidade**: Listagem de fundos para integração Hemera.

**Métodos**:
- `RecuperarListaCotasSrMezHemera()` — Cotas sênior/mezanino com range de dias úteis
- `RecuperarListaCotasSubHemera()` — Cotas subordinadas com estrutura aninhada de cotas relacionadas

---

## 9. Modelos de Dados

### 9.1 Entidades Principais

#### RegistroFundo (Cadastro Central)
```csharp
Id, RazaoSocial, Cnpj, Codigo, Custodiante, GestorPrincipal,
Administrador, Empresa, TipoFundo, Isin, TipoCota,
OffsetDiasIntegracao, TaxaGestao, IsAtivo, DataInicioClasse,
GrupoConsultoriaId, PremioCotaPre, TipoCondominio
```

#### Carteira (Posição de Carteira)
```csharp
Id, Isin, Cnpj, Nome, DataPosicao, NomeAdm, CnpjAdm,
NomeGestor, CnpjGestor, NomeCustodiante, CnpjCustodiante,
ValorCota, Quantidade, PatrimonioLiquido, ValorAtivos,
ValorReceber, ValorPagar, VlCotasEmitir, VlCotasResgatar,
RentabilidadeDiaria/Mensal/SeisMeses/Anual/Total,
RentabilidadeDiaria/Mensal/SeisMeses/Anual/TotalEsperada (NotMapped),
TipoFundo, NivelRsc, RegistroFundoId
```

#### Estoque (Recebíveis)
```csharp
Id, NomeFundo, DocFundo, DataFundo, NomeGestor, DocGestor,
NomeOriginador, DocOriginador, NomeCedente, DocCedente,
NomeSacado, DocSacado, SeuNumero, NumeroDocumento, TipoRecebivel,
ValorNominal, ValorPresente, ValorAquisicao, ValorPdd, FaixaPdd,
DataReferencia, DataVencimentoOriginal/Ajustada, DataEmissao, DataAquisicao,
Prazo, PrazoAtual, SituacaoRecebivel, TaxaCessao, TaxaRecebivel,
Coobrigacao, RegistroFundoId
```

#### PosicaoPassivo (Posição de Passivo)
```csharp
Id, NomeClasse, ContaClasse, EstruturaFundo, CnpjClasse, CodigoCvm,
GestorFundo, DataPosicao, NomeCotista, ContaCotista, CpfCnpjCotista,
Distribuidor, TipoConta, ValorCotaDia, SaldoCotas, RendimentoPercentual,
RentabilidadeAcumulada, SaldoBruto, Iof, Ir, SaldoLiquido,
InvestimentoLiquido, RegistroFundoId, CotistaId
```

### 9.2 Entidades de Regras

#### RegrasElegibilidade
```csharp
Id, NomeConjunto, RegrasElegibilidadeDetalhes[], DataAtualizacao
```

#### RegrasElegibilidadeDetalhe
```csharp
Id, NomeRegra, TipoRegra (enum), Unidade (enum),
Operador (enum), Valor (double), IsAtivo, RegrasElegibilidadeId
```

#### ResultadoRegrasElegibilidade
```csharp
Id, RegrasElegibilidadeId, RegrasElegibilidadeDetalheId,
GrupoConsultoriaId, DataPosicaoCarteira, DataPosicaoEstoque,
TipoRegra, ResultadoRegra (bool), Detalhes (JSONB)
```

### 9.3 Entidades de Comitê

#### RegistroComiteCredito
```csharp
Id, DataPosicao, Pl, PlSub, PorcentagemPlSub, Ilm,
TaxaGestaoFundo, TaxaMediaCessao, PddMensal, PddAno, PddTotal,
Caixa, RentSubMes, RentSubAno, InvestM8Sub, InvestM8Total,
GrupoConsultoriaId, GrupoComiteCreditoId
```

### 9.4 Modelos de Token (Autenticação API)

| Modelo | Provider | Claim JSON |
|--------|----------|------------|
| `SingulareApiAuthToken` | Singulare | `apiToken` |
| `BtgPactualApiAuthToken` | BTG Pactual | `access_token` |
| `HemeraApiAuthToken` | Hemera | `access_token` |
| `AnbimaAuthToken` | ANBIMA | `access_token` |

### 9.5 Enums

#### BackgroundJobType (41 valores)
Representa todos os tipos de jobs que podem ser enfileirados no `SingulareBackgroundWorker`:
```
RecuperarXmlAmbima, RecuperarFundosSingulare, RecuperarRelatorioCprSingulare,
RecuperarRelatorioCprSingulareRange, RecuperarCarteiraXmlAnbimaSingulare,
RecuperarCarteiraXmlAnbimaSingulareRange, RecuperarCarteiraJsonSingulareRange,
RecuperarCarteirasFaltantesJsonSingulare, RecuperarCarteirasIncompletasJsonSingulare,
RecuperarRelatorioEstoqueFaltantesSingulare, RecuperarListaFundosBtgPactual,
RecuperarCarteiraXmlAnbimaBtgPactual, RecuperarCarteirasFaltantesBtgPactual,
RecuperarCarteirasIncompletasBtgPactual, RecuperarRelatorioEstoqueSingulare,
RecuperarRelatorioEstoqueSingulareRange, RecuperarRelatorioLiquidadosSingulareRange,
AvaliarRegrasElegibilidadeTodos, CarregarPosicaoComiteTodos,
CalcularRentabilidadeRealCotas, MontarEmailCotasSeniorMezanino,
MontarEmailCotasSubordinadas, RecuperarIndicesCdiBcb,
IdentificarIntegrarArquivos, RecuperarPessoasIntegrarReceita,
ProcessarTodosSftpFinaxis, RecuperarPosicaoPassivoBtgPactual,
RecuperarEstoqueHemera, RecuperarDadosFundosAnbima,
AdicionarAtualizarCotistasAnbima, RecuperarPosicoesPassivoFaltantesBtgPactual,
RecuperarRelatorioLiquidadosFaltantesSingulare, RecuperarPosicaoPassivoSingulare,
... (e outros)
```

#### TipoRegra (24 valores)
```
SubordinacaoSenior, SubordinacaoMezanino, DireitosCreditoriosSobrePl,
ConcentracaoMaiorCedente, ConcentracaoTopTresCedentes, ConcentracaoTopCincoCedentes,
ConcentracaoTopDezCedentes, ConcentracaoMaiorSacado, ConcentracaoTopTresSacados,
ConcentracaoTopCincoSacados, ConcentracaoTopDezSacados,
PrazoMedioDireitosCreditorios, PrazoMaximoDuplicataMercantil,
PrazoMaximoNotaComercialCCB, TaxaMinimaRecebivel,
ConcentracaoMaximaCedentesRj, ConcentracaoMaximaContratos,
ConcentracaoMaximaLCC, ConcentracaoMaximaNotaComercialCCB,
ConcentracaoMaximaCheque, ConcentracaoMaximaCartaoCredito,
ConcentracaoAPerformar, MaiorDevedorNotaComercialCCB,
PrazoMedioDuplicataMercantil
```

---

## 10. Integrações Externas

### 10.1 Singulare

| Parâmetro | Valor |
|-----------|-------|
| **Base URL** | `https://api-portal.singulare.com.br/v2` |
| **Autenticação** | Basic Auth → Token (`x-api-key`) |
| **Token Endpoint** | `POST /painel/token/api` |
| **SFTP** | `sftp.singulare.com.br` (chave privada SSH) |

**Serviços Consumidos**:
- Relatórios de CPR
- Carteiras (JSON e XML ANBIMA)
- Estoque de recebíveis (via webhook callback)
- Liquidados
- Lista de fundos
- Posição de passivo

**Fluxo Webhook**:
```
API → POST /queue/scheduler/{cnpj} com callbackUrl
  ↓
Singulare processa e chama callbackUrl
  ↓
POST /Integracao/ReceberEstoqueSingulare (payload com FileLink)
  ↓
Background: download CSV → parsing → upsert no banco
```

### 10.2 BTG Pactual

| Parâmetro | Valor |
|-----------|-------|
| **Base URL** | `https://funds.btgpactual.com` |
| **Autenticação** | OAuth2 Client Credentials |
| **Token Endpoint** | `POST /connect/token` |
| **Token Header** | `X-SecureConnect-Token` |

**Serviços Consumidos**:
- Lista de fundos
- Carteiras (XML ANBIMA e Excel)
- Posição de passivo/cotistas

**Fluxo BTG Ticket**:
```
GET endpoint → enfileira job → BTG gera ticket
  ↓
POST /ReceberListaFundosBtgPactual com { Ticket: "..." }
  ↓
Consulta API BTG com ticket → processa resultado paginado
```

### 10.3 Hemera

| Parâmetro | Valor |
|-----------|-------|
| **Base URL Auth** | `https://api.acesso.hmra.com.br` |
| **Base URL Posição** | Configurado em `Hemera:UrlPosicao` |
| **Autenticação** | OAuth2 (handshake/secret por fundo) |
| **Token Endpoint** | `POST /autorizacao/token` |

**9 Fundos Configurados** com credenciais individuais (handshake + secret).

**Serviços Consumidos**:
- Estoque de recebíveis (relatórios .zst comprimidos)
- Posições por data

**Fluxo**:
```
POST /v1/hub-informacao/relatorios/{CNPJ}/fundo
  ↓
Polling GET /v1/hub-informacao/relatorios/{id} até status="concluido"
  ↓
Download URL → descomprime .zst → deserializa JSON
```

### 10.4 Finaxis (FTP)

| Parâmetro | Valor |
|-----------|-------|
| **Host** | `b2bi.finaxis.com.br` |
| **Protocolo** | FTP (porta 21) |
| **Diretório Remoto** | `/RECEBER` |

**4 Fontes**: RETIP, LOPER, FFLIP, RTIME — cada uma com credenciais próprias.

**Fluxo**: FTP → Download `ExistenciaPetra*` → CSV parsing (`;` delimiter) → Inserção estoque.

### 10.5 ANBIMA

| Parâmetro | Valor |
|-----------|-------|
| **Base URL** | `https://api.anbima.com.br` |
| **Autenticação** | OAuth2 + Client ID header |
| **Token Endpoint** | `/oauth/access-token` |

**Serviços Consumidos**:
- Catálogo de fundos: `/feed/fundos/v2/fundos?tipo-fundo=FIF,FIP,FII,FIDC,ETF,OFFSHORE,FIAGRO`
- Detalhes por fundo: `/feed/fundos/v2/fundos/{codigo}`
- Paginação: 1000 por página, concorrência de 10 requisições

### 10.6 Banco Central do Brasil (BCB)

| Parâmetro | Valor |
|-----------|-------|
| **Endpoint** | `https://api.bcb.gov.br/dados/serie/bcdata.sgs.11/dados` |
| **Formato** | JSON |
| **Parâmetros** | `dataInicial`, `dataFinal` (dd/MM/yyyy) |

**Dados**: Série CDI com valor e variação diária.

### 10.7 ReceitaWS

| Parâmetro | Valor |
|-----------|-------|
| **Endpoint** | `https://receitaws.com.br/v1/cnpj/{cnpj}/days/30` |
| **Autenticação** | Bearer Token |

**Dados**: Razão social, CNAE, endereço, situação cadastral, atividades.

### 10.8 Power Automate (E-mail)

**Endpoint**: Webhook URL do Power Automate
**Payload**: `{ titulo, corpoEmail, destinatariosEmail }`
**Usado por**: `EvolucaoCotasCarteiraService` para envio de relatórios de cotas.

---

## 11. Background Services

### 11.1 SingulareBackgroundWorker

**Tipo**: `BackgroundService` (Singleton)
**Mecanismo**: `Channel<BackgroundJobRequest>` (fila unbounded)

**Processamento**: Loop contínuo que lê da fila e despacha para o service correto via `switch(jobType)`.

**Lógica de Datas**:
- Calcula dias úteis retroativos baseado em feriados nacionais
- Segunda/Terça: lookback de 4 dias (inclui fim de semana)
- Demais dias: lookback de 3 dias
- XML ANBIMA: ajuste extra para segunda/terça

**41 Tipos de Job Suportados** (enum `BackgroundJobType`):
- Recuperação de dados (Singulare, BTG, Hemera, Finaxis, ANBIMA, BCB)
- Processamento de arquivos (Excel, CSV, XML)
- Avaliação de regras de elegibilidade
- Cálculo de rentabilidade de cotas
- Geração e envio de e-mails
- Integração de pessoas (ReceitaWS)
- Carregamento de posições de comitê

### 11.2 SftpBackgroundWorker

**Tipo**: `BackgroundService` (Singleton)
**Mecanismo**: `Channel<bool>` (fila unbounded)

**Função única**: Executa `SftpService.RecuperarXmlAmbimaSingulare()` quando recebe sinal na fila.

### 11.3 BackgroundJobRequest (DTO)

```csharp
class BackgroundJobRequest {
    BackgroundJobType JobType;      // Tipo do job
    List<string>? NomeArquivos;     // Nomes de arquivos (opcional)
    byte[]? Arquivo;                // Arquivo único (opcional)
    List<byte[]?>? Arquivos;        // Múltiplos arquivos (opcional)
}
```

---

## 12. Helpers e Utilitários

### 12.1 DataHelper

**Funções de Dias Úteis**:
- `PrazoDiasUteis(inicio, fim, feriados)` — Calcula dias úteis entre duas datas (exclui feriados e fins de semana)
- `ObterDataUtil(feriados, dataInicial?, formato?, qtdeDiasUteis?)` — Retorna o N-ésimo dia útil anterior (default: 2 dias úteis, formato "yyyy-MM-dd")

### 12.2 JsonHelper

- `BaixarEDeserializarRelatorio<T>(url, httpClient)` — Download de arquivo .zst, descompressão Zstandard, deserialização JSON para tipo genérico T

### 12.3 EmailHelper (PowerAutomateEmailHelper)

- `EnviarEmailAsync(titulo, html, destinatarios, ct)` — Envia e-mail via webhook Power Automate com validação de campos obrigatórios

### 12.4 Extensions (Extensões C#)

**String**:
- `LimparCnpj()` — Remove caracteres não-alfanuméricos, padding para 14 dígitos
- `ToCnpjFormat()` — Formata como `XX.XXX.XXX/XXXX-XX`
- `ToCpfFormat()` — Formata como `XXX.XXX.XXX-XX`
- `ToDocumentoFormat()` — Auto-detecta e formata CNPJ ou CPF
- `ParseNumber(casasDecimais?)` — Parsing de double (suporta PT-BR e EN-US)

**Enum**:
- `GetEnumDisplayName()` — Retorna `DisplayAttribute.Name` do enum

### 12.5 AuthProviderFactory

Fábrica de `HttpClient` autenticados para cada provedor:

| Método | Provider | Autenticação |
|--------|----------|-------------|
| `CriarClienteSingulare()` | Singulare | Basic Auth → Token (`x-api-key`) |
| `CriarClienteBtgPactual()` | BTG Pactual | OAuth2 → Token (`X-SecureConnect-Token`) |
| `CriarClienteHemera(cnpj)` | Hemera | OAuth2 por fundo (handshake/secret) |
| `CriarClienteAnbima()` | ANBIMA | OAuth2 + Client ID header |

---

## 13. Fluxos de Negócio Principais

### 13.1 Integração de Carteiras

```
┌─────────────┐     ┌──────────────┐     ┌─────────────┐
│  Controller  │────>│  Background  │────>│  Service de  │
│  (Trigger)   │     │   Worker     │     │  Integração  │
└─────────────┘     └──────────────┘     └──────┬──────┘
                                                 │
                    ┌────────────────────────────┼────────────────────────────┐
                    │                            │                            │
            ┌───────▼───────┐          ┌─────────▼────────┐         ┌────────▼───────┐
            │   Singulare   │          │   BTG Pactual    │         │    Hemera      │
            │  (JSON/XML)   │          │  (Ticket/Excel)  │         │   (.zst JSON)  │
            └───────┬───────┘          └─────────┬────────┘         └────────┬───────┘
                    │                            │                            │
                    └────────────────────────────┼────────────────────────────┘
                                                 │
                                         ┌───────▼───────┐
                                         │   PostgreSQL   │
                                         │  (Carteiras,   │
                                         │   Estoques,    │
                                         │   Liquidados)  │
                                         └───────────────┘
```

### 13.2 Processamento de Webhook (Singulare)

```
1. API POST /queue/scheduler/{cnpj} → Singulare (com callbackUrl)
2. Singulare processa e chama callbackUrl
3. POST /Integracao/ReceberEstoqueSingulare
   ├── Salva webhook em tb_aux_callback_estoque_singulare
   └── Enfileira processamento assíncrono
4. Background Worker:
   ├── Download CSV do FileLink
   ├── Parsing com CsvHelper (delimitador ";")
   ├── Deduplicação por SeuNumero
   └── Upsert em Estoques
```

### 13.3 Avaliação de Regras de Elegibilidade

```
1. POST /Elegibilidade/AvaliarRegrasElegibilidadeTodos
2. Para cada GrupoConsultoria com regras ativas:
   a. Verifica existência de dados (Carteira + Estoque)
   b. Para cada RegrasElegibilidadeDetalhe:
      - Calcula métrica conforme TipoRegra
      - Aplica Operador (>, <, >=, <=, =) contra Valor
      - Registra resultado (aprovado/reprovado) com detalhes JSONB
3. Persiste em ResultadosRegrasElegibilidade
```

### 13.4 Posicionamento do Comitê de Crédito

```
1. POST /Integracao/CarregarPosicaoComiteTodos
2. Para cada GrupoComiteCredito válido:
   a. Recupera fundos subordinados do grupo
   b. Busca última Carteira e Estoque
   c. Calcula métricas:
      - PL e PL Subordinado
      - ILM (Índice de Liquidez Mínimo)
      - Taxa de Gestão do Fundo
      - Taxa Média de Cessão
      - PDD (Mensal/Ano/Total)
      - Caixa disponível
      - Rentabilidade Subordinada (Mês/Ano)
      - Investimento M8
3. Persiste em RegistrosComiteCredito
```

### 13.5 Cálculo de Rentabilidade de Cotas

```
1. POST /EvolucaoCotasCarteira/CalcularRentabilidadeRealCotas
2. Para cada cota não-subordinada ativa:
   a. Busca carteiras ordenadas por data
   b. Para cada par de datas consecutivas:
      - Calcula rentabilidade diária = (cotaAtual/cotaAnterior - 1) * 100
      - Compõe mensal: reset se mudou o mês
      - Compõe semestral/anual/total: compound growth
   c. Atualiza campos de rentabilidade na Carteira
3. Opcional: compara com rentabilidade esperada (CDI + prêmio)
```

### 13.6 Relatórios BI

```
GET /Relatorio/RecuperarSintetico?DataPosicao=2024-01-15
  │
  ├── Busca fundos por filtros (Administrador, GrupoConsultoria)
  ├── Para cada fundo subordinado:
  │   ├── Carteira da data (PatrimonioLiquido, ValorAtivos, etc.)
  │   ├── Estoque agregado (ValorPresente, ValorPdd, concentrações)
  │   ├── Operações Renda Fixa (títulos privados)
  │   └── Outros Fundos (investimentos em outros veículos)
  └── Retorna objeto agregado com métricas por fundo e totais
```

---

## 14. Deploy e CI/CD

### GitHub Actions (`.github/workflows/main_m8-core-api.yml`)

**Trigger**: Push na branch `main` ou dispatch manual.

**Pipeline**:

```yaml
Build Job (ubuntu-latest):
  1. Checkout código
  2. Setup .NET 8.0
  3. dotnet build --configuration Release
  4. dotnet publish -o ./publish
  5. Upload artifact

Deploy Job:
  1. Download artifact
  2. Deploy para Azure Web App "m8-core-api"
  3. Ambiente: Production
```

### Variáveis de Ambiente (Runtime)

| Variável | Descrição |
|----------|-----------|
| `DB_KEY` | Senha do PostgreSQL |
| `AZURE_KEY` | Connection string Azure Storage |
| `RECEITAWS_KEY` | Token da API ReceitaWS |

### URLs de Produção

| Serviço | URL |
|---------|-----|
| API | `https://m8-core-api.azurewebsites.net` |
| Swagger | `https://m8-core-api.azurewebsites.net/swagger` |
| Banco | `sql-m8.postgres.database.azure.com` |
| Storage | Azure File Share `m8-fileserver` |

---

## Resumo Quantitativo

| Item | Quantidade |
|------|-----------|
| Controllers | 9 |
| Endpoints REST | 89 |
| Services | 18 |
| Background Workers | 2 |
| Tipos de Background Job | 41 |
| Modelos/Entidades | 80+ |
| DbSets (Tabelas) | 43 |
| Integrações Externas | 8 (Singulare, BTG, Hemera, Finaxis, ANBIMA, BCB, ReceitaWS, Power Automate) |
| Arquivos XML de Fundos | 71 |
| Tipos de Regra de Elegibilidade | 24 |
| Fontes SFTP/FTP | 5 |