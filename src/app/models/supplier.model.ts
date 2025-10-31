export interface Supplier {
  cnpj: string;
  razaoSocial: string;
  nomeFantasia: string;
  email: string;
  telefone: string;
  status: 'Ativo' | 'Bloqueado'; // Define os valores exatos
  pendingDeliveries: number;
}

