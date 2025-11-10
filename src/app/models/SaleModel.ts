import { SaleItem } from './SaleItemModel';

export type SaleStatus = 'PENDING' | 'CONFIRMED' | 'CANCELLED';

export interface Sale {
  id?: string;
  dateTime: Date;           
  operatorId: string;       
  items: SaleItem[];        
  total: number;            
  paymentMethod: string;    
  status: SaleStatus;       
}
