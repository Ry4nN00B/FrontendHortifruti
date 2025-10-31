export interface Product {
  id: string;
  name: string;
  price: number;
  quantity: number;
  validity: Date;
  qtoMinima: number;
  category?: string; 
  unit?: string;     
}

