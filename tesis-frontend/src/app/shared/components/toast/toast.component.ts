import { Component, ChangeDetectionStrategy } from '@angular/core';
import { NgClass } from '@angular/common';
import { ToastService } from '@shared/services/toast.service';
import { NgIconComponent } from '@ng-icons/core';

@Component({
    selector: 'app-toast',
    imports: [NgClass, NgIconComponent],
    template: `
<div class="toast toast-end toast-bottom z-50">
  @for (t of toast.toasts(); track t.id) {
    <div
      class="alert shadow-lg text-sm"
      [ngClass]="alertClass(t.type)"
      role="alert"
    >
      <ng-icon [name]="icons[t.type]" class="text-lg"></ng-icon>
      <span class="font-semibold">{{ t.message }}</span>
      <button type="button" class="btn btn-ghost btn-xs" (click)="toast.dismiss(t.id)" aria-label="Cerrar notificacion">
        <ng-icon name="heroXMark"></ng-icon>
      </button>
    </div>
  }
</div>
  `,
    styles: [],
    changeDetection: ChangeDetectionStrategy.OnPush,
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
}
