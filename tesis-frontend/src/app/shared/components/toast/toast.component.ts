import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ToastService } from '../../../shared/services/toast.service';
import { NgIconComponent } from '@ng-icons/core';

@Component({
    selector: 'app-toast',
    imports: [CommonModule, NgIconComponent],
    template: `
<div class="toast toast-end toast-bottom z-50">
  <div
    *ngFor="let t of toast.toasts(); trackBy: trackById"
    class="alert shadow-lg text-sm"
    [ngClass]="alertClass(t.type)"
  >
    <ng-icon [name]="icons[t.type]" class="text-lg"></ng-icon>
    <span class="font-semibold">{{ t.message }}</span>
    <button type="button" class="btn btn-ghost btn-xs" (click)="toast.dismiss(t.id)">
      <ng-icon name="heroXMark"></ng-icon>
    </button>
  </div>
</div>
  `,
    styles: []
})
export class ToastComponent {
  readonly icons: Record<string, string> = { 
    success: 'heroCheckCircle', 
    error: 'heroExclamationCircle', 
    warning: 'heroExclamationTriangle', 
    info: 'heroBellAlert' 
  };

  constructor(public readonly toast: ToastService) {}

  alertClass(type: string): string {
    switch (type) {
      case 'success': return 'alert-success';
      case 'error': return 'alert-error';
      case 'warning': return 'alert-warning';
      default: return 'alert-info';
    }
  }

  trackById(_: number, t: { id: number }) { return t.id; }
}
