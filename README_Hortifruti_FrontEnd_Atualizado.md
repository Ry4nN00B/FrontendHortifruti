# 🍎 Frontend System of Hortifruti Mikami  
### 🚧 In Processing...  
#### 📚 Project UNIP – PIM IV  

---

## 🥬 Sobre o Projeto
Este repositório contém o **frontend do sistema de gestão Hortifruti Mikami**, desenvolvido como parte do **Projeto Integrado Multidisciplinar (PIM IV)** da **Universidade Paulista – UNIP**.  
A aplicação representa a **interface do usuário (UI)** para interação com os serviços e lógica de negócio do **Back-End Hortifruti (Spring Boot)**.

> 🌐 Desenvolvido em **Angular**, o sistema utiliza **componentes Standalone**, **RxJS**, e segue práticas modernas de reatividade e segurança na manipulação de dados.

---

## 🧩 Tecnologias Utilizadas

- 🅰️ **Angular 20+** – Framework principal para SPA (Single Page Application).  
- 🧑‍💻 **TypeScript** – Linguagem fortemente tipada e moderna.  
- 🎨 **CSS** – Estilização com variáveis globais e estilos componentizados.  
- ⚙️ **RxJS** – Gerenciamento reativo de fluxos de dados e comunicação assíncrona.  
- 🌍 **REST API Integration** – Comunicação direta com o Back-End Spring Boot.  

---

## ⚙️ Execução do Projeto

### 📋 Pré-requisitos

Certifique-se de ter os seguintes componentes instalados:

- **Node.js** v18 ou superior  
- **Angular CLI** v20 ou superior  
- **Back-End (Spring Boot)** em execução no endereço: `http://localhost:8080`

### 🚀 Instalação e Inicialização

```bash
# Clone o repositório
git clone https://github.com/Programa-Don/hortifruti-frontend.git

# Acesse o diretório do projeto
cd hortifruti-frontend

# Instale as dependências
npm install

# Execute o projeto
ng serve --open
```

A aplicação será compilada e executada em: **http://localhost:4200**  

---

## 🧱 Arquitetura da Aplicação

### 🧩 Arquitetura Standalone
A aplicação é construída inteiramente com **Standalone Components**, eliminando a necessidade de NgModules.  
Cada componente importa suas próprias dependências e é configurado com `standalone: true`.

### ⚙️ Configuração Central (`app.config.ts`)
Arquivo responsável pela configuração global da aplicação, incluindo:

- `provideRouter(routes)` → Sistema de rotas.  
- `importProvidersFrom(FormsModule)` → Suporte global para formulários template-driven.  
- `provideAnimations()` → Habilita animações Angular.  
- `provideHttpClient(withInterceptors([...]))` → Configura interceptores HTTP, como o de autenticação.  

### 💼 Camada de Serviços (`/src/app/api/`)
Centraliza toda a comunicação com o **Back-End**. Os principais serviços incluem:

- **AuthService** → Login, registro e armazenamento de tokens JWT.  
- **ProductService**, **SupplierService**, **CategoriaService** → Operações CRUD.  
- **StockService** → Comunicação com o StockController.  
- **ReportService** → Geração de relatórios diversos.  

---

## 🔐 Autenticação e Autorização (JWT)

### 🔑 Fluxo de Autenticação
O **AuthService** envia as credenciais (e-mail e senha) para o endpoint `/auth/login`.  
O **Back-End** retorna um **Token JWT** e a **Role** do usuário, armazenados localmente no navegador.

### 🧱 Interceptor (`auth.interceptor.ts`)
Intercepta automaticamente todas as requisições HTTP e adiciona o cabeçalho de autorização:

```
Authorization: Bearer <token>
```

### 🛡️ Guardas de Rota (`auth.guard.ts` e `role.guard.ts`)
- **authGuard:** Garante que apenas usuários autenticados acessem rotas internas.  
- **roleGuard:** Restringe o acesso de determinadas rotas a usuários com permissão `ADMIN`.

---

## 🔄 Comunicação entre Componentes

A comunicação entre componentes é realizada com `@Input()` e `@Output()`:

- **Pai → Filho (`@Input`)**: Envia dados, como produto selecionado para edição.  
- **Filho → Pai (`@Output`)**: Emite eventos para ações como fechamento de modais.  

---

## 🌐 Integração com o Back-End

### ⚙️ Configuração de Ambiente (`api.constants.ts`)
Define a **URL base da API**. Em caso de deploy, basta alterar este valor.

### 🌍 Política de CORS
Para permitir comunicação entre **Front (localhost:4200)** e **Back (localhost:8080)**, o back-end deve conter:

```java
@CrossOrigin("http://localhost:4200")
@RestController
@RequestMapping("/api/products")
public class ProductController { ... }
```

### 🔗 Mapeamento de Endpoints

| Método | Endpoint | Serviço Angular | Descrição |
|---------|-----------|----------------|------------|
| POST | `/auth/login` | AuthService | Realiza login e retorna Token JWT. |
| POST | `/auth/register` | AuthService | Cria um novo usuário. |
| GET | `/products` | ProductService | Retorna lista de produtos. |
| POST | `/products` | ProductService | Cria novo produto. |
| PUT | `/products/{id}` | ProductService | Atualiza um produto existente. |
| DELETE | `/products/{id}` | ProductService | Exclui um produto. |
| GET | `/stock` | StockService | Retorna lotes de estoque. |
| GET | `/suppliers` | SupplierService | Lista fornecedores. |
| POST | `/suppliers` | SupplierService | Cadastra fornecedor. |
| PUT | `/suppliers/{cnpj}` | SupplierService | Atualiza fornecedor. |
| DELETE | `/suppliers/{cnpj}` | SupplierService | Exclui fornecedor. |
| GET | `/categories` | CategoriaService | Lista categorias. |
| POST | `/categories` | CategoriaService | Cria categoria. |
| PUT | `/categories/{id}` | CategoriaService | Atualiza categoria. |
| DELETE | `/categories/{id}` | CategoriaService | Exclui categoria. |
| GET | `/reports/financial` | ReportService | Relatório financeiro. |
| GET | `/reports/stock` | ReportService | Relatório de estoque. |
| GET | `/reports/validity` | ReportService | Relatório de validade. |
| GET | `/reports/history` | ReportService | Histórico de vendas. |

---

## ✅ Conclusão
O **Frontend System of Hortifruti Mikami** oferece uma interface moderna, reativa e integrada ao back-end.  
Aplicando práticas de engenharia de software, arquitetura modular e autenticação JWT, o projeto entrega uma base sólida para futuras melhorias e integração com sistemas externos.

---

## 👨‍💻 Autores
- Caio Mendes Barradas – R090AD6  
- Gabriel Rodrigues Ramos – R101IG0  
- Lucas Ramos Pereira – G083GI8  
- **Ryan Gomes Xavier – R1019F2**  
- Samuel Carvalho Baia – R1981F8  

---

© 2025 – Universidade Paulista (UNIP) | Projeto PIM IV – Sistema de Gestão Hortifruti Mikami
