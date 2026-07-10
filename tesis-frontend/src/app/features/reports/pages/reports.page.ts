import { Component, signal, DestroyRef, inject, ChangeDetectionStrategy } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ReportService } from '../services/report.service';
import { NgIconComponent } from '@ng-icons/core';

@Component({
    selector: 'app-reports-page',
    imports: [NgIconComponent],
    templateUrl: './reports.page.html',
    styleUrl: './reports.page.scss',
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ReportsPage {
  readonly downloading = signal(false);
  readonly downloadingExcel = signal(false);

  private readonly destroyRef = inject(DestroyRef);

  constructor(private readonly reportService: ReportService) {}

  downloadReceivables(): void {
    this.downloading.set(true);
    this.reportService.downloadReceivablesReport()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (blob) => {
          this.downloading.set(false);
          const url = URL.createObjectURL(blob);
          const link = document.createElement('a');
          link.href = url;
          link.download = 'reporte-cartera.pdf';
          link.click();
          URL.revokeObjectURL(url);
        },
        error: () => { this.downloading.set(false); }
      });
  }

  downloadExcel(): void {
    this.downloadingExcel.set(true);
    this.reportService.downloadReceivablesExcel()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (blob) => {
          this.downloadingExcel.set(false);
          const url = URL.createObjectURL(blob);
          const link = document.createElement('a');
          link.href = url;
          link.download = 'cartera-por-cobrar.xlsx';
          link.click();
          URL.revokeObjectURL(url);
        },
        error: () => { this.downloadingExcel.set(false); }
      });
  }
}
