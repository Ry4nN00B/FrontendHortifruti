import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { ReportService } from '../../api/ReportService';
import { FinancialReport, StockReport, ValidityReport, HistoricalReport } from '../../models/ReportModel';

//Report DTO
interface ReportDTO {
  id: string;
  name: string;
  description: string;
  type: 'financial' | 'stock' | 'validity' | 'history';
}

@Component({
  selector: 'reportList',
  standalone: true,
  imports: [CommonModule],
  templateUrl: '../HTML/ReportList.html',
  styleUrls: ['../CSS/ReportList.css']
})
export class ReportList implements OnInit {

  //Report Information's
  reports: ReportDTO[] = [];
  selectedReportData: FinancialReport[] | StockReport[] | ValidityReport[] | HistoricalReport[] | null = null;

  constructor(private reportService: ReportService) { }

  ngOnInit(): void {
    this.loadReports();
  }

  //Loads Information's
  loadReports(): void {
    this.reports = [
      { id: 'financial', name: 'Relatório Financeiro', description: 'Resumo financeiro detalhado.', type: 'financial' },
      { id: 'stock', name: 'Relatório de Estoque', description: 'Estoque atual de produtos.', type: 'stock' },
      { id: 'validity', name: 'Relatório de Validade', description: 'Produtos próximos da validade.', type: 'validity' },
      { id: 'history', name: 'Histórico de Vendas', description: 'Registro detalhado de vendas passadas.', type: 'history' }
    ];
  }

  //Create and View PDF | View and Download
  generatePDF(report: ReportDTO, view: boolean = false): void {
    const obs$ = this.getReportObservable(report);

    obs$.subscribe(
      (data) => {
        if (!data || !data.length) {
          console.warn('Nenhum dado disponível para gerar PDF.');
          return;
        }

        const doc = new jsPDF();

        doc.setFontSize(16);
        doc.setTextColor(0, 0, 0);
        doc.text(report.name, 14, 20);

        doc.setFontSize(12);
        doc.setTextColor(50);
        const introText = `Este relatório apresenta informações detalhadas sobre ${report.description}`;
        const splitIntro = doc.splitTextToSize(introText, 180);
        doc.text(splitIntro, 14, 28);

        // Inicializa colunas e linhas
        let columns: string[] = [];
        let rows: any[] = [];

        switch (report.type) {
          case 'financial': {
            const financialData = data as FinancialReport[];
            columns = ['Produto', 'Quantidade', 'Preço Unitário', 'Total'];
            rows = financialData.map(item => [
              item.productName,
              item.amount ?? 0,
              item.unitPrice != null ? item.unitPrice.toFixed(2) : '0,00',
              item.totalValue != null ? item.totalValue.toFixed(2) : '0,00'
            ]);
            break;
          }
          case 'stock': {
            const stockData = data as StockReport[];
            columns = ['Produto', 'Quantidade', 'Data de Entrada', 'Validade', 'Dias Restantes'];
            rows = stockData.map(item => [
              item.productName,
              item.amount ?? 0,
              item.entryDate ? new Date(item.entryDate).toLocaleDateString() : '',
              item.validity ? new Date(item.validity).toLocaleDateString() : '',
              item.remainingDays ?? ''
            ]);
            break;
          }
          case 'validity': {
            const validityData = data as ValidityReport[];
            columns = ['Produto', 'Quantidade', 'Validade', 'Status'];
            rows = validityData.map(item => [
              item.productName,
              item.amount ?? 0,
              item.validity ? new Date(item.validity).toLocaleDateString() : '',
              item.status
            ]);
            break;
          }
          case 'history': {
            const historyData = data as HistoricalReport[];
            const statusMap: { [key: string]: string } = {
              CONFIRMED: 'Confirmado',
              CANCELLED: 'Cancelado',
              PENDING: 'Pendente',
            };
            columns = ['Produto', 'Quantidade', 'Data de Venda', 'Observação', 'Status da Venda'];
            rows = historyData.map(item => [
              item.productName,
              item.amount ?? 0,
              item.movementDate ? new Date(item.movementDate).toLocaleString() : '',
              item.observation ?? '',
              item.typeMovement ? statusMap[item.typeMovement] ?? item.typeMovement : ''
            ]);
            break;
          }
          default:
            console.error('Tipo de relatório desconhecido:', report.type);
            return;
        }

        // Gera a tabela
        autoTable(doc, {
          head: [columns],
          body: rows,
          startY: 28 + splitIntro.length * 6,
          theme: 'grid',
          headStyles: { fillColor: [0, 128, 0], textColor: 255 },
          styles: { fontSize: 10 },
          didParseCell: (dataCell) => {
            if (dataCell.row.section === 'body') {
              dataCell.cell.styles.fillColor = dataCell.row.index % 2 === 0 ? [200, 230, 200] : [220, 245, 220];
            }
          }
        });

        // Gera PDF
        const pdfBlob = doc.output('blob');
        const url = URL.createObjectURL(pdfBlob);

        if (view) {
          window.open(url, '_blank');
        } else {
          const a = document.createElement('a');
          a.href = url;
          a.download = `${report.name.replace(/\s+/g, '_').toLowerCase()}.pdf`;
          a.click();
        }
      },
      (error: HttpErrorResponse) => {
        console.error('Erro ao obter dados para o PDF:', error.message);
      }
    );
  }


  private getReportObservable(report: ReportDTO): Observable<FinancialReport[] | StockReport[] | ValidityReport[] | HistoricalReport[]> {
    switch (report.type) {
      case 'financial': return this.reportService.getFinancialReport();
      case 'stock': return this.reportService.getStockReport();
      case 'validity': return this.reportService.getValidityReport();
      case 'history': return this.reportService.getSalesHistoryReport();
      default:
        throw new Error(`Tipo de relatório desconhecido: ${report.type}`);
    }
  }

}
