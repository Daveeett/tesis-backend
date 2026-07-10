import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '@env';

@Injectable({ providedIn: 'root' })
export class ReportService {
  constructor(private readonly http: HttpClient) {}

  downloadReceivablesReport() {
    return this.http.get(`${environment.apiBaseUrl}/reports/receivables`, {
      responseType: 'blob',
    });
  }

  downloadReceivablesExcel() {
    return this.http.get(`${environment.apiBaseUrl}/reports/receivables/excel`, {
      responseType: 'blob',
    });
  }
}