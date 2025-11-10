import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { Sale } from '../../models/SaleModel';
import { SaleItem } from '../../models/SaleItemModel';
import { SaleService } from '../../api/SaleService';

import { Product } from '../../models/ProductModel';
import { ProductService } from '../../api/ProductService';

import { Stock } from '../../models/StockModel';
import { StockService } from '../../api/StockService';

import { PromotionService } from '../../api/PromotionService';
import { Promotion, PromotionType } from '../../models/PromotionModel';

import { AuthService } from '../../api/AuthService';

@Component({
    selector: 'saleForm',
    standalone: true,
    imports: [CommonModule, FormsModule],
    templateUrl: '../HTML/SaleForm.html',
    styleUrls: ['../CSS/SaleForm.css']
})
export class SaleForm implements OnInit {

    //User Information
    operatorId: string = '';
    operatorName: string = '';

    //Payment Information
    paymentMethods: string[] = ['Dinheiro', 'Cartão de Crédito', 'Cartão de Débito'];
    selectedPaymentMethod: string = 'Dinheiro';

    //Product Information
    selectedProductId: string = '';
    selectedQuantity: number = 1;

    products: Product[] = [];
    saleItems: SaleItem[] = [];

    totalSale: number = 0;

    //Stock Information
    stocks: Stock[] = [];

    //Promotion Information
    promotions: Promotion[] = [];

    constructor(
        private saleService: SaleService,
        private productService: ProductService,
        private stockService: StockService,
        private promotionService: PromotionService,
        private authService: AuthService
    ) { }

    ngOnInit(): void {
        this.loadOperatorFromAuth();
        this.loadProducts();
        this.loadStocks();
        this.loadPromotions();
    }

    //Load Information
    loadProducts(): void {
        this.productService.getProducts().subscribe(products => {
            this.products = products;
        });
    }
    loadStocks(): void {
        this.stockService.getStock().subscribe(stocks => {
            this.stocks = stocks;
        });
    }
    loadPromotions(): void {
        this.promotionService.getPromotions().subscribe(data => {
            this.promotions = data;
        });
    }
    private loadOperatorFromAuth(): void {
        const user = this.authService.getCurrentUser();
        if (user) {
            this.operatorId = user.id;
            this.operatorName = user.name;
        }
    }

    //Add Product to Sale
    addProduct(): void {
        if (!this.selectedProductId || this.selectedQuantity <= 0) return;

        const product = this.products.find(p => p.id === this.selectedProductId);
        if (!product) return;

        const stockAvailable = this.getProductStock(product.id);
        if (this.selectedQuantity > stockAvailable) {
            alert(`Quantidade maior que o estoque disponível (${stockAvailable})`);
            return;
        }

        const unitPrice = this.getPromotedPrice(product.id);

        const existingItem = this.saleItems.find(i => i.productId === product.id);
        if (existingItem) {
            existingItem.amount += this.selectedQuantity;
            existingItem.unitPrice = unitPrice;
        } else {
            this.saleItems.push({
                productId: product.id,
                productName: product.name,
                amount: this.selectedQuantity,
                unitPrice: unitPrice,
                total: 0
            });
        }

        this.calculateTotal();
        this.selectedProductId = '';
        this.selectedQuantity = 1;
    }


    //Promotion Methods
    getPromotedPrice(productId: string): number {
        const product = this.products.find(p => p.id === productId);
        if (!product) return 0;

        const now = new Date();
        const promo = this.promotions.find(p =>
            p.productId === productId &&
            new Date(p.startDate) <= now &&
            new Date(p.endDate) >= now
        );

        if (!promo) return product.price;

        switch (promo.type) {
            case PromotionType.FIXED:
                return Math.max(0, product.price - promo.value);
            case PromotionType.PERCENTAGE:
                return product.price * (1 - promo.value / 100);
            default:
                return product.price;
        }
    }

    getPromotionLabel(productId: string): string {
        const promo = this.promotions.find(p =>
            p.productId === productId &&
            new Date(p.startDate) <= new Date() &&
            new Date(p.endDate) >= new Date()
        );

        if (!promo) return '';

        return promo.type === PromotionType.FIXED
            ? `R$${promo.value} OFF`
            : `${promo.value}% OFF`;
    }


    //Remove product from sale
    removeItem(productId: string): void {
        this.saleItems = this.saleItems.filter(i => i.productId !== productId);
        this.calculateTotal();
    }

    //Finalize sale
    finalizeSale(): void {
        if (!this.saleItems.length) {
            alert('Adicione ao menos um produto à venda.');
            return;
        }

        const sale: Sale = {
            operatorId: this.operatorId,
            items: this.saleItems,
            total: this.totalSale,
            paymentMethod: this.selectedPaymentMethod,
            status: 'CONFIRMED',
            dateTime: new Date()
        };

        this.saleService.createSale(sale).subscribe({
            next: () => {
                alert('Venda registrada com sucesso!');
                this.saleItems = [];
                this.totalSale = 0;
                this.selectedPaymentMethod = 'Dinheiro';
            },
            error: err => {
                console.error('Erro ao criar venda:', err);
                alert('Erro ao criar venda. Veja console.');
            }
        });
    }

    //Cancel sale
    cancelSale(): void {
        if (!this.saleItems.length) {
            alert('Adicione ao menos um produto à venda.');
            return;
        }

        const sale: Sale = {
            operatorId: this.operatorId,
            items: this.saleItems,
            total: this.totalSale,
            paymentMethod: this.selectedPaymentMethod,
            status: 'CANCELLED',
            dateTime: new Date()
        };

        this.saleService.createSale(sale).subscribe({
            next: () => {
                alert('Venda cancelada com sucesso!');
                this.saleItems = [];
                this.totalSale = 0;
                this.selectedPaymentMethod = 'Dinheiro';
            },
            error: err => {
                console.error('Erro ao cancelar venda:', err);
                alert('Erro ao cancelar venda. Veja console.');
            }
        });
    }

    //Extra Methods
    getSelectedProduct(): Product | undefined {
        return this.products.find(p => p.id === this.selectedProductId);
    }

    getProductUnit(productId: string): string {
        const product = this.products.find(p => p.id === productId);
        return product?.soldByWeight ? 'Kg' : 'Un';
    }

    getProductStock(productId: string): number {
        return this.stocks
            .filter(stock => stock.productId === productId)
            .reduce((total, stock) => total + stock.amount, 0);
    }

    calculateTotal(): void {
        this.totalSale = this.saleItems.reduce((sum, item) => sum + (item.unitPrice * item.amount), 0);
    }

    validateQuantity(product: Product, value: any): void {
        let amount = Number(value);
        if (!product.soldByWeight) {
            amount = Math.floor(amount);
        }
        this.selectedQuantity = amount > 0 ? amount : 1;
    }
}
