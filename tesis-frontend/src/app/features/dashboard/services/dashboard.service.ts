import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../environments/environment';
import { ApiResponse } from '../../../shared/models/api.models';

@Injectable({ providedIn: 'root' })
export class DashboardService {
  constructor(private readonly http: HttpClient) {}

  getDashboardAlerts() {
    return this.http.get<ApiResponse<any[]>>(
      `${environment.apiBaseUrl}/dashboard/alerts/overdue`,
    );
  }

  getDashboardStats() {
    return this.http.get<{ data: { semaphore: { green: number; yellow: number; red: number }; cashChart: Array<{ date: string; income: number; expense: number }> } }>(
      `${environment.apiBaseUrl}/dashboard/stats`,
    );
  }
}