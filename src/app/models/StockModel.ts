export interface Stock {
  id: string;
  productId: string;
  amount: number;
  entryDate?: Date;
  validity: Date;
}