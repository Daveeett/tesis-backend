import { Injectable, computed, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { tap } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { ApiResponse } from '../../../shared/models/api.models';

interface LoginPayload {
  email: string;
  password: string;
}

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  role: 'ADMIN' | 'CAJERO';
}

interface LoginData {
  token: string;
  user: AuthUser;
}

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly tokenKey = 'mmu_token';
  private readonly userKey = 'mmu_user';
  private readonly userSignal = signal<AuthUser | null>(this.loadUser());
  private readonly authSignal = computed(() => !!this.userSignal());

  constructor(private readonly http: HttpClient) {}

  isAuthenticated() {
    return this.authSignal;
  }

  getCurrentUser() {
    return this.userSignal.asReadonly();
  }

  isAdmin() {
    return this.userSignal()?.role === 'ADMIN';
  }

  getRole(): 'ADMIN' | 'CAJERO' | null {
    return this.userSignal()?.role ?? null;
  }

  login(payload: LoginPayload) {
    return this.http
      .post<ApiResponse<LoginData>>(`${environment.apiBaseUrl}/auth/login`, payload)
      .pipe(
        tap((response) => {
          localStorage.setItem(this.tokenKey, response.data.token);
          localStorage.setItem(this.userKey, JSON.stringify(response.data.user));
          this.userSignal.set(response.data.user);
        }),
      );
  }

  logout() {
    const token = this.getToken();
    const clearStorage = () => {
      localStorage.removeItem(this.tokenKey);
      localStorage.removeItem(this.userKey);
      this.userSignal.set(null);
      window.location.href = '/login'; // Full reload to clear app state
    };

    if (token) {
      this.http.post(`${environment.apiBaseUrl}/auth/logout`, {}).subscribe({
        next: () => clearStorage(),
        error: () => clearStorage()
      });
    } else {
      clearStorage();
    }
  }


  getToken(): string | null {
    return localStorage.getItem(this.tokenKey);
  }

  createCajero(payload: { name: string; email: string; password: string }) {
    return this.http.post<ApiResponse<AuthUser>>(
      `${environment.apiBaseUrl}/auth/users`,
      payload,
    );
  }

  private loadUser(): AuthUser | null {
    if (typeof window === 'undefined') return null;
    const raw = localStorage.getItem(this.userKey);
    return raw ? JSON.parse(raw) : null;
  }
}

