
import { Component, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgIconComponent } from '@ng-icons/core';
import { CashService } from '../services/cash.service';
import { ToastService } from '../../../shared/services/toast.service';

@Component({
    selector: 'app-cash-page',
    imports: [CommonModule, FormsModule, NgIconComponent],
    templateUrl: './cash.page.html',
    styleUrl: './cash.page.scss'
})
export class CashPage implements OnInit {
  readonly status = signal('Cargando estado de caja...');
  readonly currentSession = signal<any>(null);
  readonly sessionHistory = signal<any[]>([]);

  openingBalance = 0;
  movementType: 'INCOME' | 'EXPENSE' = 'INCOME';
  movementAmount = 0;
  movementConcept = '';
  closingBalance = 0;

  constructor(
    private readonly cashService: CashService,
    private readonly toast: ToastService,
  ) {}

  ngOnInit() {
    this.checkSession();
    this.loadHistory();
  }

  loadHistory() {
    this.cashService.getCashHistory().subscribe({
      next: (r) => this.sessionHistory.set(r.data),
      error: () => {},
    });
  }

  checkSession() {
    this.cashService.getOpenCash().subscribe({
      next: (response) => {
        if (response.data) {
          this.currentSession.set(response.data);
          this.status.set('Caja abierta actualmente.');
        } else {
          this.currentSession.set(null);
          this.status.set('No hay caja abierta.');
        }
      },
      error: () => this.status.set('Error al comprobar caja.'),
    });
  }

  get currentCalculatedBalance(): number {
    const session = this.currentSession();
    if (!session) return 0;
    
    let total = Number(session.openingBalance);
    if (session.movements) {
      for (const m of session.movements) {
        if (m.movementType === 'INCOME') total += Number(m.amount);
        else total -= Number(m.amount);
      }
    }
    return total;
  }

  get totalIncomes(): number {
    const session = this.currentSession();
    if (!session || !session.movements) return 0;
    return session.movements.filter((m: any) => m.movementType === 'INCOME').reduce((acc: number, m: any) => acc + Number(m.amount), 0);
  }

  get totalExpenses(): number {
    const session = this.currentSession();
    if (!session || !session.movements) return 0;
    return session.movements.filter((m: any) => m.movementType === 'EXPENSE').reduce((acc: number, m: any) => acc + Number(m.amount), 0);
  }

  calculateHistoryIncome(session: any): number {
    if (!session || !session.movements) return 0;
    return session.movements.filter((m: any) => m.movementType === 'INCOME').reduce((acc: number, m: any) => acc + Number(m.amount), 0);
  }

  calculateHistoryExpense(session: any): number {
    if (!session || !session.movements) return 0;
    return session.movements.filter((m: any) => m.movementType === 'EXPENSE').reduce((acc: number, m: any) => acc + Number(m.amount), 0);
  }

  openCash() {
    this.cashService.openCash(this.openingBalance).subscribe({
      next: () => {
        this.openingBalance = 0;
        this.toast.success('Caja abierta exitosamente.');
        this.checkSession();
        this.loadHistory();
      },
      error: (e: Error) => this.toast.error(e.message),
    });
  }

  addMovement() {
    this.cashService
      .addCashMovement({
        movementType: this.movementType,
        amount: this.movementAmount,
        concept: this.movementConcept,
      })
      .subscribe({
        next: () => {
          const typeLabel = this.movementType === 'INCOME' ? 'Ingreso' : 'Egreso';
          const amountSaved = this.movementAmount;

          this.movementAmount = 0;
          this.movementConcept = '';

          this.toast.success(`${typeLabel} registrado: $${amountSaved}`);

          this.checkSession();
          this.loadHistory();
        },
        error: (e: Error) => this.toast.error(e.message),
      });
  }

  closeCash() {
    this.cashService.closeCash(this.closingBalance).subscribe({
      next: () => {
        this.closingBalance = 0;
        this.toast.success('Caja cerrada correctamente. Que tengas buen día!');
        this.checkSession();
        this.loadHistory();
      },
      error: (e: Error) => this.toast.error(e.message),
    });
  }
}
