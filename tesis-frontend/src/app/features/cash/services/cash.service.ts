import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../environments/environment';
import { ApiResponse } from '../../../shared/models/api.models';

@Injectable({ providedIn: 'root' })
export class CashService {
  constructor(private readonly http: HttpClient) {}

  getOpenCash() {
    return this.http.get<ApiResponse<unknown>>(`${environment.apiBaseUrl}/cash/status`);
  }

  openCash(openingBalance: number) {
    return this.http.post<ApiResponse<unknown>>(`${environment.apiBaseUrl}/cash/open`, {
      openingBalance,
    });
  }

  addCashMovement(payload: {
    movementType: 'INCOME' | 'EXPENSE';
    amount: number;
    concept: string;
  }) {
    return this.http.post<ApiResponse<unknown>>(
      `${environment.apiBaseUrl}/cash/movements`,
      payload,
    );
  }

  closeCash(closingBalance: number) {
    return this.http.post<ApiResponse<unknown>>(`${environment.apiBaseUrl}/cash/close`, {
      closingBalance,
    });
  }

  getCashHistory() {
    return this.http.get<ApiResponse<Array<{
      id: string; status: string;
      openedAt: string; closedAt: string | null;
      openedBy: string; closedBy: string | null;
      openingBalance: string; closingBalance: string | null;
      expectedBalance: string | null; difference: string | null;
      totalIncomes: string; totalExpenses: string; movementCount: number;
    }>>>(`${environment.apiBaseUrl}/cash/history`);
  }
}