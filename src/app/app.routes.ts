import { Routes } from '@angular/router';

// Componentes
import { LoginComponent } from './auth/login/login.component';
import { CadastroComponent } from './auth/cadastro/cadastro.component';
import { MainLayoutComponent } from './layout/main-layout/main-layout.component';
import { DashboardComponent } from './dashboard/dashboard/dashboard.component'; 
import { FornecedorListComponent } from './fornecedores/fornecedor-list/fornecedor-list.component';
import { ProdutoListComponent } from './produtos/produto-list/produto-list.component';
import { RelatoriosComponent } from './relatorios/relatorios/relatorios.component'; 
import { authGuard } from './api/auth.guard'; 

export const routes: Routes = [
    { path: 'login', component: LoginComponent },
    { path: 'cadastro', component: CadastroComponent },
    {
        path: '', 
        component: MainLayoutComponent,
        canActivate: [authGuard],
        children: [
            { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
            { path: 'dashboard', component: DashboardComponent },
            { path: 'fornecedores', component: FornecedorListComponent },
            { path: 'produtos', component: ProdutoListComponent },
            { path: 'relatorios', component: RelatoriosComponent },
        ]
    },
    
    { path: '**', redirectTo: 'login' }
];