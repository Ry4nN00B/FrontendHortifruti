import { Component, AfterViewInit, OnInit } from '@angular/core';
import { Chart, registerables } from 'chart.js';
import { NgFor, NgIf } from '@angular/common';
import { forkJoin } from 'rxjs';

import { Category } from '../../models/CategoryModel';
import { CategoryService } from '../../api/CategoryService';

import { Product } from '../../models/ProductModel';
import { ProductService } from '../../api/ProductService';

import { Sale } from '../../models/SaleModel';
import { SaleService } from '../../api/SaleService';

import { StockService } from '../../api/StockService';
import { Stock } from '../../models/StockModel';

Chart.register(...registerables);

@Component({
  selector: 'dashboard',
  standalone: true,
  imports: [NgIf, NgFor],
  templateUrl: '../HTML/Dashboard.html',
  styleUrls: ['../CSS/Dashboard.css']
})
export class DashboardComponent implements AfterViewInit {

  //Product Information's
  products: Product[] = [];
  productsMap = new Map<string, string>();

  isLoading = false;

  //Stock Information's
  stocks: Stock[] = [];

  lowStockItems: Stock[] = [];
  nearExpirationItems: Stock[] = [];

  lowStockItemsName = new Map<string, string>();
  nearExpirationItemsName = new Map<string, string>();

  //Sale Information's
  weeklySalesData: number[] = [];
  weeklySalesLabels: string[] = [];

  isLoadingSales = false;

  //Category Information's
  categories: Category[] = [];
  categoriesMap = new Map<string, string>();

  //Products Sales TOP
  topSellingProducts: { name: string; quantity: number }[] = [];

  mainChartData: number[] = [];
  mainChartLabels: string[] = [];

  mainChart: any;

  constructor(
    private stockService: StockService,
    private productService: ProductService,
    private saleService: SaleService,
    private categoryService: CategoryService
  ) { }


  ngAfterViewInit(): void {
    this.loadProducts();
    this.loadCategories();
    this.loadWeeklySales();
    this.loadStockAlerts();
    this.loadTopSellingProductsAndChart();
  }

  //Loads Information's
  loadProducts(): void {
    this.productService.getProducts().subscribe(data => {
      this.products = data;
      this.productsMap = new Map(data.map(p => [p.id, p.name]));
    });
  }
  loadCategories(): void {
    this.categoryService.getCategories().subscribe(data => {
      this.categories = data;
      this.categoriesMap = new Map(data.map(c => [c.id, c.name]));
    });
  }

  updateDashboard() {
    this.isLoading = true;
    setTimeout(() => {
      this.isLoading = false;
      alert('Dashboard atualizada com sucesso!');
      this.loadStockAlerts();
    }, 2000);
  }

  //Dashboard Information's
  loadTopSellingProductsAndChart() {
    forkJoin({
      products: this.productService.getProducts(),
      categories: this.categoryService.getCategories(),
      sales: this.saleService.getSales()
    }).subscribe({
      next: ({ sales, products, categories }) => {

        this.products = products;
        this.productsMap = new Map(products.map(p => [p.id, p.name]));

        this.categories = categories;
        this.categoriesMap = new Map(categories.map(c => [c.id, c.name]));

        const today = new Date();
        const startOfWeek = new Date(today);
        startOfWeek.setDate(today.getDate() - today.getDay() + 1);
        const endOfWeek = new Date(startOfWeek);
        endOfWeek.setDate(startOfWeek.getDate() + 6);

        const categorySalesMap = new Map<string, number>();
        this.categories.forEach(c => categorySalesMap.set(c.name, 0));

        const productSalesMap = new Map<string, number>();

        sales.forEach(sale => {
          const saleDate = new Date(sale.dateTime);
          const saleDay = new Date(saleDate.getFullYear(), saleDate.getMonth(), saleDate.getDate());

          const start = new Date(startOfWeek.getFullYear(), startOfWeek.getMonth(), startOfWeek.getDate());
          const end = new Date(endOfWeek.getFullYear(), endOfWeek.getMonth(), endOfWeek.getDate());

          if (saleDay < start || saleDay > end) return;

          sale.items.forEach(item => {
            const product = products.find(p => p.id === item.productId);
            if (!product) return;

            const categoryName = this.categoriesMap.get(product.categoryId) ?? "Outros";

            categorySalesMap.set(
              categoryName,
              (categorySalesMap.get(categoryName) ?? 0) + Number(item.amount)
            );

            productSalesMap.set(
              product.name,
              (productSalesMap.get(product.name) ?? 0) + Number(item.amount)
            );
          });
        });

        this.mainChartLabels = Array.from(categorySalesMap.keys());
        this.mainChartData = this.mainChartLabels.map(label => categorySalesMap.get(label) ?? 0);

        this.topSellingProducts = Array.from(productSalesMap.entries())
          .map(([name, quantity]) => ({ name, quantity }))
          .sort((a, b) => b.quantity - a.quantity)
          .slice(0, 3);

        this.createMainChart();
      },
      error: err => console.error("Erro ao carregar dados:", err)
    });
  }

  loadWeeklySales() {
    this.isLoadingSales = true;

    this.saleService.getSales().subscribe({
      next: (sales: Sale[]) => {
        const today = new Date();
        const startOfWeek = new Date(today);
        startOfWeek.setHours(0, 0, 0, 0);
        startOfWeek.setDate(today.getDate() - today.getDay() + 1);

        const endOfWeek = new Date(startOfWeek);
        endOfWeek.setDate(startOfWeek.getDate() + 6);
        endOfWeek.setHours(23, 59, 59, 999);

        this.weeklySalesLabels = ['Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb', 'Dom'];
        this.weeklySalesData = [0, 0, 0, 0, 0, 0, 0];

        sales.forEach(sale => {
          const saleDate = new Date(sale.dateTime);

          const localSaleDate = new Date(
            saleDate.getUTCFullYear(),
            saleDate.getUTCMonth(),
            saleDate.getUTCDate(),
            saleDate.getUTCHours(),
            saleDate.getUTCMinutes(),
            saleDate.getUTCSeconds()
          );

          if (localSaleDate < startOfWeek || localSaleDate > endOfWeek) return;

          const totalNumber = parseFloat(sale.total as any) || 0;
          const dayIndex = localSaleDate.getDay() === 0 ? 6 : localSaleDate.getDay() - 1;
          this.weeklySalesData[dayIndex] += totalNumber;
        });

        this.createWeeklySalesChart();
        this.isLoadingSales = false;
      },
      error: (err) => {
        console.error('Erro ao carregar vendas semanais:', err);
        this.isLoadingSales = false;
      }
    });
  }

  loadStockAlerts() {
    this.isLoading = true;

    forkJoin({
      lowStock: this.stockService.getLowStock(5),
      nearExpiration: this.stockService.getNearExpiration(7)
    }).subscribe({
      next: ({ lowStock, nearExpiration }) => {

        this.lowStockItems = lowStock;
        this.nearExpirationItems = nearExpiration;

        this.lowStockItemsName.clear();
        this.lowStockItems.forEach(item => {
          const name = this.productsMap.get(item.productId) || 'Produto Desconhecido';
          this.lowStockItemsName.set(item.id, name);
        });

        this.nearExpirationItemsName.clear();
        this.nearExpirationItems.forEach(item => {
          const name = this.productsMap.get(item.productId) || 'Produto Desconhecido';
          this.nearExpirationItemsName.set(item.id, name);
        });

        this.isLoading = false;
      },
      error: (err) => {
        console.error('Erro ao carregar alertas de estoque', err);
        this.isLoading = false;
      }
    });
  }

  //Create Graphic's
  createMainChart() {
    // Se já existir, destrói o gráfico antigo
    if (this.mainChart) {
      this.mainChart.destroy();
    }

    // Labels e dados
    const labels = this.mainChartLabels.length ? this.mainChartLabels : ['Sem dados'];
    const data = this.mainChartData.length ? this.mainChartData : [1];

    this.mainChart = new Chart('mainChart', {
      type: 'pie', // gráfico de pizza
      data: {
        labels: labels,
        datasets: [
          {
            data: data,
            backgroundColor: [
              '#f4a261', // laranja
              '#2a9d8f', // verde
              '#e76f51', // vermelho
              '#e9c46a', // amarelo
              '#264653'  // azul escuro
            ]
          }
        ]
      },
      options: {
        plugins: {
          legend: {
            position: 'bottom', // legenda embaixo
            labels: {
              font: {
                size: 14
              }
            }
          },
          tooltip: {
            callbacks: {
              label: (context) => {
                const label = context.label ?? '';
                const value = context.raw ?? 0;
                return `${label}: ${value}`;
              }
            }
          }
        }
      }
    });
  }

  createWeeklySalesChart() {
    new Chart('weeklySalesChart', {
      type: 'line',
      data: {
        labels: this.weeklySalesLabels,
        datasets: [{
          label: 'Vendas (R$)',
          data: this.weeklySalesData,
          borderColor: '#2a9d8f',
          backgroundColor: 'rgba(42, 157, 143, 0.2)',
          fill: true,
          tension: 0.3
        }]
      },
      options: {
        responsive: true,
        plugins: {
          legend: { display: false },
          tooltip: {
            callbacks: {
              label: (context) => {
                const value = Number(context.raw);
                return `R$ ${value.toFixed(2)}`;
              }
            }
          }
        },
        scales: {
          y: {
            beginAtZero: true,
            ticks: {
              callback: (value) => {
                const num = Number(value);
                return `R$ ${num.toFixed(2)}`;
              }
            }
          },
          x: {
            ticks: {
              color: '#333',
            }
          }
        }
      }
    });
  }

  //Other's
  calculateDaysToExpire(validity: string | Date): number {
    const today = new Date();
    const validDate = typeof validity === 'string' ? new Date(validity) : validity;
    const diffTime = validDate.getTime() - today.getTime();
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  }
}
