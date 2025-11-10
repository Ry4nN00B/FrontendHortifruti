import { Routes } from '@angular/router';

import { LoginComponent } from './auth/TypeScript/LoginComponent';
import { RegisterComponent } from './auth/TypeScript/RegisterComponent';

import { DashboardComponent } from './dashboards/TypeScript/Dashboard';
import { CategoryList } from './lists/TypeScript/CategoryList';
import { SupplierList } from './lists/TypeScript/SupplierList';
import { ProductList } from './lists/TypeScript/ProductList';
import { StockList } from './lists/TypeScript/StockList';
import { PromotionList } from './lists/TypeScript/PromotionList';
import { SaleList } from './lists/TypeScript/SaleList';
import { ReportList } from './lists/TypeScript/ReportList';

import { SaleForm } from './forms/TypeScript/SaleForm';

import { MainLayoutComponent } from './layout/main-layout/MainLayout';

import { authGuard } from './api/AuthGuard';

export const routes: Routes = [
  { path: 'login', component: LoginComponent },
  {
    path: 'registrar',
    component: RegisterComponent,
    canActivate: [authGuard],
    data: { roles: ['GERENTE'] }
  },

  {
    path: '',
    component: MainLayoutComponent,
    canActivate: [authGuard],
    data: { roles: ['GERENTE', 'ESTOQUISTA', 'OPERADOR'] },
    children: [
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
      {
        path: 'dashboard',
        component: DashboardComponent,
        canActivate: [authGuard],
        data: { roles: ['GERENTE', 'ESTOQUISTA', 'OPERADOR'] }
      },
      {
        path: 'categorias',
        component: CategoryList,
        canActivate: [authGuard],
        data: { roles: ['GERENTE', 'ESTOQUISTA'] }
      },
      {
        path: 'fornecedores',
        component: SupplierList,
        canActivate: [authGuard],
        data: { roles: ['GERENTE', 'ESTOQUISTA'] }
      },
      {
        path: 'produtos',
        component: ProductList,
        canActivate: [authGuard],
        data: { roles: ['GERENTE', 'ESTOQUISTA'] }
      },
      {
        path: 'nova-venda',
        component: SaleForm,
        canActivate: [authGuard],
        data: { roles: ['GERENTE', 'OPERADOR'] }
      },
      {
        path: 'estoque',
        component: StockList,
        canActivate: [authGuard],
        data: { roles: ['GERENTE', 'ESTOQUISTA'] }
      },
      {
        path: 'promocoes',
        component: PromotionList,
        canActivate: [authGuard],
        data: { roles: ['GERENTE', 'OPERADOR'] }
      },
      {
        path: 'vendas',
        component: SaleList,
        canActivate: [authGuard],
        data: { roles: ['GERENTE', 'OPERADOR'] }
      },
      {
        path: 'relatorios',
        component: ReportList,
        canActivate: [authGuard],
        data: { roles: ['GERENTE'] }
      }
    ]
  },

  { path: '**', redirectTo: 'login' }
];
