import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../environments/environment';
import { ApiResponse } from '../../../shared/models/api.models';

@Injectable({ providedIn: 'root' })
export class CreditService {
  constructor(private readonly http: HttpClient) {}

  getCustomerCredits(customerId: string) {
    return this.http.get<ApiResponse<any[]>>(
      `${environment.apiBaseUrl}/credits/customer/${customerId}`,
    );
  }

  createCredit(customerId: string, payload: { amount: number; dueDate: string; email: string }) {
    return this.http.post<ApiResponse<any>>(
      `${environment.apiBaseUrl}/credits/customer/${customerId}`,
      payload,
    );
  }

  getSemaphore(customerId: string) {
    return this.http.get<
      ApiResponse<{ status: 'GREEN' | 'YELLOW' | 'RED'; reason: string; daysToDue?: number }>
    >(`${environment.apiBaseUrl}/credits/customer/${customerId}/semaphore`);
  }

  createWhatsappReminder(creditId: string) {
    return this.http.post<
      ApiResponse<{ waLink: string; message: string; statementUrl: string }>
    >(`${environment.apiBaseUrl}/notifications/whatsapp/${creditId}`, {});
  }

  notifyGeneralDebt(customerId: string) {
    return this.http.post<
      ApiResponse<{ waLink: string; message: string; statementUrl: string }>
    >(`${environment.apiBaseUrl}/notifications/whatsapp/customer/${customerId}`, {});
  }
}