import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '@env';
import { ApiResponse } from '@shared/models/api.models';

@Injectable({ providedIn: 'root' })
export class PublicStatementService {
  constructor(private readonly http: HttpClient) {}

  getPublicStatement(token: string) {
    return this.http.get<
      ApiResponse<{
        customer: { name: string; phone: string };
        totals: { totalDebt: string; totalPaid: string; pending: string };
        credits: Array<{
          id: string;
          createdAt: string;
          dueDate: string;
          amount: string;
          status: string;
          items: Array<{
            qty: number;
            unitPrice: string;
            subtotal: string;
            product: { name: string };
          }>;
        }>;
      }>
    >(`${environment.apiBaseUrl}/public/statements/${token}`);
  }
}