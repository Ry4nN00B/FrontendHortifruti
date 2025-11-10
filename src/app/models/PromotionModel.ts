export interface Promotion {
    id: string;
    productId: string;
    type: PromotionType;
    value: number;
    startDate: Date;
    endDate: Date;   
}

export enum PromotionType {
    FIXED = 'FIXED_VALUE',
    PERCENTAGE = 'PERCENT'
}