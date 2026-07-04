import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReportService } from '../services/report.service';
import { NgIconComponent } from '@ng-icons/core';

@Component({
    selector: 'app-reports-page',
    imports: [CommonModule, NgIconComponent],
    templateUrl: './reports.page.html',
    styleUrl: './reports.page.scss'
})
export class ReportsPage {
  downloading = false;
  downloadingExcel = false;

  constructor(private readonly reportService: ReportService) {}

   downloadReceivables() {
     this.downloading = true;
     this.reportService.downloadReceivablesReport().subscribe({
       next: (blob) => {
         this.downloading = false;
         const url = URL.createObjectURL(blob);
         const link = document.createElement('a');
         link.href = url;
         link.download = 'reporte-cartera.pdf';
         link.click();
         URL.revokeObjectURL(url);
       },
       error: () => { this.downloading = false; }
     });
   }

   downloadExcel() {
     this.downloadingExcel = true;
     this.reportService.downloadReceivablesExcel().subscribe({
       next: (blob) => {
         this.downloadingExcel = false;
         const url = URL.createObjectURL(blob);
         const link = document.createElement('a');
         link.href = url;
         link.download = 'cartera-por-cobrar.xlsx';
         link.click();
         URL.revokeObjectURL(url);
       },
       error: () => { this.downloadingExcel = false; }
     });
   }
}

