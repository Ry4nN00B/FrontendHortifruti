import { Product } from '../models/product.model';
import { Supplier } from '../models/supplier.model';

// Mock para Fornecedores 
export const MOCK_SUPPLIERS: Supplier[] = [
  { cnpj: '00.111.222/0001-00', nomeFantasia: 'Horta Fresca', razaoSocial: 'Horta Fresca Ltda', email: 'contato@hortafresca.com', telefone: '(11) 98765-4321', status: 'Ativo', pendingDeliveries: 3 },
  { cnpj: '11.222.333/0001-00', nomeFantasia: 'Frutas do Brasil', razaoSocial: 'Frutas BR S.A.', email: 'vendas@frutasbr.com', telefone: '(21) 99876-5432', status: 'Ativo', pendingDeliveries: 1 },
  { cnpj: '22.333.444/0001-00', nomeFantasia: 'Tomatexpress', razaoSocial: 'Distuidora Tomate', email: 'contato@tomatexpress.com', telefone: '(31) 97654-3210', status: 'Bloqueado', pendingDeliveries: 0 },
];

// Mock para Produtos 
export const MOCK_PRODUCTS: Product[] = [
  {
    id: 'p1',
    name: 'Alface Crespa Hidropônica',
    description: 'Alface fresca hidropônica',
    price: 4.50,
    quantity: 45,
    validity: new Date('2025-11-15'),
    qtoMinima: 12,
    category: 'Vegetais'
  },
  {
    id: 'p2',
    name: 'Cenoura tipo Nantes',
    description: 'Cenoura do tipo Nantes',
    price: 3.90,
    quantity: 0, // Fora de estoque
    validity: new Date('2025-11-01'),
    qtoMinima: 8,
    category: 'Vegetais'
  },
  {
    id: 'p3',
    name: 'Banana Prata',
    description: 'Banana Prata madura',
    price: 6.00,
    quantity: 30,
    validity: new Date('2025-11-18'),
    qtoMinima: 10, // Estoque baixo
    category: 'Frutas'
  }
];
