import { Product } from '../models/product.model';
import { Supplier } from '../models/supplier.model';


// Mock para a Lista de Fornecedores
export const MOCK_SUPPLIERS: Supplier[] = [
  {
    cnpj: '00.111.222/0001-00',
    razaoSocial: 'Horta Fresca Ltda',
    nomeFantasia: 'Horta Fresca',
    email: 'contato@hortafresca.com',
    telefone: '(11) 98765-4321',
    status: 'Ativo',
    pendingDeliveries: 3
  },
  {
    cnpj: '11.222.333/0001-00',
    razaoSocial: 'Frutas do Brasil S.A.',
    nomeFantasia: 'Frutas BR',
    email: 'vendas@frutasbr.com',
    telefone: '(21) 99876-5432',
    status: 'Ativo',
    pendingDeliveries: 1
  },
  {
    cnpj: '22.333.444/0001-00',
    razaoSocial: 'Distribuidora Tomate',
    nomeFantasia: 'Tomate Express',
    email: 'contato@tomatexpress.com',
    telefone: '(31) 97654-3210',
    status: 'Bloqueado',
    pendingDeliveries: 0
  }
];

// Mock para a Lista de Produtos (Inventário)
export const MOCK_PRODUCTS: Product[] = [
  {
    id: 'p1',
    name: 'Alface Crespa',
    description: 'Alface fresca hidropônica',
    price: 4.50,
    quantity: 45,
    validity: new Date('2025-11-15'),
    qtdMinima: 12
  },
  {
    id: 'p2',
    name: 'Cenoura',
    description: 'Cenoura tipo Nantes',
    price: 3.90,
    quantity: 0, // Fora de estoque
    validity: new Date('2025-11-01'),
    qtdMinima: 8
  },
  {
    id: 'p3',
    name: 'Banana Prata',
    description: 'Banana prata madura',
    price: 6.00,
    quantity: 30,
    validity: new Date('2025-11-10'),
    qtdMinima: 10
  }
];
