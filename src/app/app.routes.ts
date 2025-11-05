import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

// Importa os componentes com os caminhos corretos
import { MainLayoutComponent } from './layout/main-layout.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { FornecedorListComponent } from './fornecedores/fornecedor-list.component';
import { ProdutoListComponent } from './produtos/produto-list.component';
import { RelatoriosComponent } from './relatorios/relatorios.component';
import { LoginComponent } from './auth/login/login.component';
import { CadastroComponent } from './auth/cadastro/cadastro.component';

// import { AuthGuard } from './api/auth.guard'; // Futuramente, usaremos um Guarda de Rota

const routes: Routes = [
  // Rotas de Autenticação (fora do layout principal)
  { path: 'login', component: LoginComponent },
  { path: 'cadastro', component: CadastroComponent },

  // Rotas que USAM o Layout Principal (Sidebar + Topbar)
  {
    path: '', // O caminho raiz
    component: MainLayoutComponent,
    // canActivate: [AuthGuard], // No futuro, para proteger as rotas
    children: [
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' }, // Redireciona a raiz
      { path: 'dashboard', component: DashboardComponent },
      { path: 'fornecedores', component: FornecedorListComponent },
      { path: 'inventario', component: ProdutoListComponent }, // Mudamos para 'inventario'
      { path: 'relatorios', component: RelatoriosComponent }
    ]
  },

  // Rota "Coringa" (Se a URL não existir)
  { path: '**', redirectTo: 'login' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }