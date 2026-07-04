import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SemaphoreStatus } from '../../../features/customers/models/customer.model';
@Component({
    selector: 'app-semaphore-badge',
    imports: [CommonModule],
    templateUrl: './semaphore-badge.component.html',
    styleUrl: './semaphore-badge.component.scss'
})
export class SemaphoreBadgeComponent {
  @Input({ required: true }) status: SemaphoreStatus = 'GREEN';

  get badgeClass(): string {
    switch (this.status) {
      case 'GREEN': return 'badge-success';
      case 'YELLOW': return 'badge-warning';
      case 'RED': return 'badge-error';
      default: return 'badge-ghost';
    }
  }
}
