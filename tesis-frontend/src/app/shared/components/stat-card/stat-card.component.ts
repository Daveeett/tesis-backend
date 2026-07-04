import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgIconComponent } from '@ng-icons/core';

@Component({
    selector: 'app-stat-card',
    imports: [CommonModule, NgIconComponent],
    templateUrl: './stat-card.component.html',
    styleUrl: './stat-card.component.scss'
})
export class StatCardComponent {
  @Input({ required: true }) label = '';
  @Input({ required: true }) value = '';
  @Input({ required: true }) icon = 'heroChartBar';
  @Input() helper = '';
}
