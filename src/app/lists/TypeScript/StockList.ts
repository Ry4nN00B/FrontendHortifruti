import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';

import { Stock } from '../../models/StockModel';
import { StockService } from '../../api/StockService';
import { StockForm } from "../../forms/TypeScript/StockForm";

import { Product } from '../../models/ProductModel';
import { ProductService } from '../../api/ProductService';

@Component({
    selector: 'stockList',
    standalone: true,
    imports: [CommonModule, RouterModule, StockForm, FormsModule],
    templateUrl: '../HTML/StockList.html',
    styleUrls: ['../CSS/StockList.css']
})
export class StockList implements OnInit {

    @Output() stockDelete = new EventEmitter<void>();

    //Stock's Information's
    stocks: Stock[] = [];

    showModal = false;

    //Product's Information's
    products: Product[] = [];
    productMap = new Map<string, string>();

    //Pages Config
    pageSize = 10;
    currentPage = 1;
    totalPages = 1;

    //Filter's
    filteredStocks: Stock[] = [];

    showFilters = false;

    filters = {
        productId: '',
        amount: '',
        entryDate: '',
        validity: ''
    };

    //Messages
    statusMessage: string = '';
    statusType: 'success' | 'error' = 'success';

    constructor(
        private stockService: StockService,
        private productService: ProductService
    ) { }

    ngOnInit(): void {
        this.loadStock();
        this.loadProducts();
    }


    //Loads Information's
    loadStock(): void {
        this.stockService.getStock().subscribe(data => {
            this.stocks = data;
            this.filteredStocks = [...this.stocks];

            this.updatePagination();

            if (this.currentPage > this.totalPages) {
                this.currentPage = this.totalPages;
            }
        });
    }
    loadProducts(): void {
        this.productService.getProducts().subscribe(data => {
            this.products = data;
            this.productMap = new Map(data.map(p => [p.id, p.name]));
        });
    }

    //Filter's Methods
    toggleFilters() {
        this.showFilters = !this.showFilters;
        if (!this.showFilters) {
            this.clearFilters();
        }
    }

    clearFilters() {
        this.filters = {
            productId: '',
            amount: '',
            entryDate: '',
            validity: ''
        };
        this.applyFilters();
    }

    applyFilters() {
        const f = this.filters;

        this.filteredStocks = this.stocks.filter(s => {

            const productName = this.productMap.get(s.productId) ?? "";

            return (
                (!f.productId || productName.toLowerCase().includes(f.productId.toLowerCase())) &&
                (!f.amount || s.amount?.toString().includes(f.amount)) &&
                (!f.entryDate || (s.entryDate && new Date(s.entryDate).toISOString().slice(0, 10) === f.entryDate)) &&
                (!f.validity || (s.validity && new Date(s.validity).toISOString().slice(0, 10) === f.validity))
            );
        });

        this.currentPage = 1;
        this.updatePagination();
    }

    updatePagination() {
        this.totalPages = Math.max(1, Math.ceil(this.filteredStocks.length / this.pageSize));
    }

    //Modal Methods
    openStockAddModal(): void {
        this.showModal = true;
    }

    closeStockAddModal(): void {
        this.showModal = false;
        this.loadStock();
    }

    //Methods Stock
    deleteStock(id: string): void {
        if (!confirm('Tem certeza que deseja excluir este estoque?')) {
            return;
        }

        this.stockService.deleteStock(id).subscribe({
            next: () => {
                console.log('Estoque deletado com sucesso.');

                this.onStockDelete();
                this.loadStock();
            },
            error: (err) => {
                console.error('Erro ao deletar estoque:', err);
            }
        });
    }

    cleanEmptyStock(): void {
        this.stockService.cleanEmptyStock().subscribe({
            next: () => {

                this.onStockClean();
            },
            error: (err) => {
                console.error('Erro ao limpar lotes vazios:', err);
                this.statusMessage = 'Erro ao limpar lotes vazios!';
                this.statusType = 'error';
                this.clearMessageAfterDelay();
            }
        });
    }

    //Messages
    clearMessageAfterDelay() {
        setTimeout(() => {
            this.statusMessage = '';
        }, 5000);
    }

    onStockCreate() {
        this.statusMessage = "Estoque criado com sucesso!";
        this.statusType = "success";
        this.clearMessageAfterDelay();
        this.loadStock();
    }

    onStockClean() {
        this.statusMessage = "Estoque limpo com sucesso!";
        this.statusType = "success";
        this.clearMessageAfterDelay();
        this.loadStock();
    }

    onStockDelete() {
        this.statusMessage = "Estoque deletado com sucesso!";
        this.statusType = "error";
        this.clearMessageAfterDelay();
    }

    //Paginations Methods
    get stocksPaginated(): Stock[] {
        const start = (this.currentPage - 1) * this.pageSize;
        return this.filteredStocks.slice(start, start + this.pageSize);
    }

    nextPage() {
        if (this.currentPage < this.totalPages) {
            this.currentPage++;
        }
    }

    previousPage() {
        if (this.currentPage > 1) {
            this.currentPage--;
        }
    }

}