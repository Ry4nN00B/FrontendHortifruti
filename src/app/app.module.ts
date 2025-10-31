import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

// Importando os componentes
import { LoginComponent } from './auth/login/login.component';
import { CadastroComponent } from './auth/cadastro/cadastro.component';
import { MainLayoutComponent } from './layout/main-layout/main-layout.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { ProdutoListComponent } from './produtos/produto-list/produto-list.component';
import { FornecedorListComponent } from './fornecedores/fornecedor-list/fornecedor-list.component';
import { RelatoriosComponent } from './relatorios/relatorios.component';
import { AuthGuard } from './services/auth.guard'; // Seu "guarda" de rotas

// Definindo as rotas
const routes: Routes = [
  // Rotas de autenticação (fora do layout principal)
  { path: 'login', component: LoginComponent },
  { path: 'cadastro', component: CadastroComponent },

  // Rota principal com o layout (menu lateral e topo)
  {
    path: '', // Caminho "pai"
    component: MainLayoutComponent,
    canActivate: [AuthGuard], // Protege todas as rotas filhas
    children: [
      { path: 'dashboard', component: DashboardComponent },
      { path: 'inventario', component: ProdutoListComponent },
      { path: 'fornecedores', component: FornecedorListComponent },
      { path: 'relatorios', component: RelatoriosComponent },
      
      // Redireciona '' (ex: localhost:4200/ após login) para /dashboard
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' }
    ]
  },

  // Rota "raiz" - redireciona para /login se não estiver logado
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  
  // Rota curinga para URLs não encontradas
  { path: '**', redirectTo: 'login' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
