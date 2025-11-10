export interface ValidityReport {
  productName: string;
  amount: number;
  validity: string | null;
  status: 'Vencido' | 'Próximo do vencimento' | 'Dentro do prazo' | 'Sem data de validade';
}

export interface StockReport {
  productName: string;
  amount: number;
  entryDate: string;
  validity: string | null;
  remainingDays: number | null;
}

export interface FinancialReport {
  productName: string;
  amount: number;
  unitPrice: number;
  totalValue: number;
}

export interface HistoricalReport {
  productName: string;
  typeMovement: string;
  amount: number;
  movementDate: string;
  observation: string;
}