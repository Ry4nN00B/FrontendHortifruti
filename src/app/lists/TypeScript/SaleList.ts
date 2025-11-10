import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';

import { Sale } from '../../models/SaleModel';
import { SaleItem } from '../../models/SaleItemModel';
import { SaleService } from '../../api/SaleService';

import { UserModel } from '../../models/UserModel';
import { AuthService } from '../../api/AuthService';

import { Product } from '../../models/ProductModel';
import { ProductService } from '../../api/ProductService';

@Component({
    selector: 'saleList',
    standalone: true,
    imports: [CommonModule, FormsModule],
    templateUrl: '../HTML/SaleList.html',
    styleUrls: ['../CSS/SaleList.css']
})
export class SaleList implements OnInit {

    @Output() saleConfirm = new EventEmitter<void>();
    @Output() saleCancel = new EventEmitter<void>();
    @Output() saleDelete = new EventEmitter<void>();

    //Sale Information's
    sales: Sale[] = [];
    selectedSaleItems: SaleItem[] | null = null;

    showModal: boolean = false;

    paymentMethodMap: { [key: string]: string } = {
        CASH: 'Dinheiro',
        CREDIT_CARD: 'Cartão de Crédito',
        DEBIT_CARD: 'Cartão de Débito',
    };

    paymentStatusMap: { [key: string]: string } = {
        CANCELLED: 'Cancelado',
        CONFIRMED: 'Confirmado',
        PENDING: 'Pendente'
    };

    //User Information's
    users: UserModel[] = [];
    usersMap = new Map<string, string>();
    operatorsMap: { [id: string]: string } = {};

    //Product Information's
    products: Product[] = [];
    productMap = new Map<string, string>();

    //Pages Config
    pageSize = 10;
    currentPage = 1;
    totalPages = 1;

    //Filter's
    filteredSales: Sale[] = [];

    showFilters = false;

    filters = {
        operatorId: '',
        saleDate: '',
        value: '',
        paymentMethod: '',
        status: ''
    };

    //Message
    statusMessage: string = '';
    statusType: 'success' | 'error' = 'success';

    constructor(
        private saleService: SaleService,
        private productService: ProductService,
        private authService: AuthService,
        private router: Router) { }

    ngOnInit(): void {
        this.loadSales();
        this.loadUsers();
        this.loadProducts();
    }

    //Loads Information's
    loadSales(): void {
        this.saleService.getSales().subscribe(data => {
            this.sales = data;
            this.filteredSales = [...this.sales];

            this.updatePagination();

            if (this.currentPage > this.totalPages) {
                this.currentPage = this.totalPages;
            }
        });
    }
    loadUsers(): void {
        this.authService.getUserMap().subscribe(map => {
            this.operatorsMap = map;
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
            operatorId: '',
            saleDate: '',
            value: '',
            paymentMethod: '',
            status: ''
        };
        this.applyFilters();
    }

    applyFilters() {
        const f = this.filters;

        this.filteredSales = this.sales.filter(s => {

            const operatorName = this.operatorsMap[s.operatorId]?.toLowerCase() ?? "";

            return (
                (!f.operatorId || operatorName.includes(f.operatorId.toLowerCase())) &&
                (!f.saleDate || (s.dateTime && new Date(s.dateTime).toISOString().slice(0, 10) === f.saleDate)) &&
                (!f.value || s.total?.toString().includes(f.value)) &&
                (!f.paymentMethod || String(s.paymentMethod) === f.paymentMethod) &&
                (!f.status || String(s.status) === f.status)

            );
        });

        this.currentPage = 1;
        this.updatePagination();
    }

    updatePagination() {
        this.totalPages = Math.max(1, Math.ceil(this.filteredSales.length / this.pageSize));
    }

    //Sale's Methods
    getPaymentMethodName(method: string): string {
        return this.paymentMethodMap[method] ?? method;
    }

    getPaymentStatusName(method: string): string {
        return this.paymentStatusMap[method] ?? method;
    }

    goToNewSale(): void {
        this.router.navigate(['/nova-venda']);
    }

    viewSaleItems(sale: Sale): void {
        this.selectedSaleItems = sale.items;
    }

    closeSaleItems(): void {
        this.selectedSaleItems = null;
    }

    //User's Methods
    getOperatorName(id: string): string {
        return this.operatorsMap[id] ?? 'Desconhecido';
    }

    //Methods
    confirmSale(id: string | undefined): void {
        if (!id) return;

        if (!confirm('Deseja confirmar esta venda?')) return;

        this.saleService.confirmPayment(id).subscribe({
            next: () => {

                this.onSaleConfirm();
                this.loadSales();
            },
            error: (err) => {
                console.error('Erro ao confirmar a venda:', err);
                this.statusMessage = 'Erro ao confirmar a venda!';
                this.statusType = 'error';
                this.clearMessageAfterDelay();
            }
        });
    }

    cancelSale(id: string | undefined): void {
        if (!id) return;

        if (!confirm('Deseja cancelar esta venda?')) return;

        this.saleService.cancelSale(id).subscribe({
            next: () => {

                this.onSaleCancel();
                this.loadSales();
            },
            error: (err) => {
                console.error('Erro ao cancelar a venda:', err);
                this.statusMessage = 'Erro ao cancelar a venda!';
                this.statusType = 'error';
                this.clearMessageAfterDelay();
            }
        });
    }

    deleteSale(id: string | undefined): void {
        if (!id) return;
        if (!confirm('Tem certeza que deseja excluir esta venda?')) {
            return;
        }

        this.saleService.deleteSale(id).subscribe({
            next: () => {

                this.onSaleDelete();
                this.loadSales();
            },
            error: (err) => {
                console.error('Erro ao deletar a venda:', err);
            }
        });
    }

    //Messages
    clearMessageAfterDelay() {
        setTimeout(() => {
            this.statusMessage = '';
        }, 5000);
    }

    onSaleConfirm() {
        this.statusMessage = "Compra confirmada com sucesso!";
        this.statusType = "success";
        this.clearMessageAfterDelay();
    }

    onSaleCancel() {
        this.statusMessage = "Compra cancelado com sucesso!";
        this.statusType = "success";
        this.clearMessageAfterDelay();
    }

    onSaleDelete() {
        this.statusMessage = "Venda deletada com sucesso!";
        this.statusType = "error";
        this.clearMessageAfterDelay();
    }

    //Pagination Method's
    get salesPaginated(): Sale[] {
        const start = (this.currentPage - 1) * this.pageSize;
        return this.filteredSales.slice(start, start + this.pageSize);
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
