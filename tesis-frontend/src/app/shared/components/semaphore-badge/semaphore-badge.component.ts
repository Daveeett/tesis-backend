import { Component, Input, ChangeDetectionStrategy } from '@angular/core';
import { NgClass } from '@angular/common';
import { SemaphoreStatus } from '@shared/models/semaphore.model';

@Component({
    selector: 'app-semaphore-badge',
    imports: [NgClass],
    templateUrl: './semaphore-badge.component.html',
    styleUrl: './semaphore-badge.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush,
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
