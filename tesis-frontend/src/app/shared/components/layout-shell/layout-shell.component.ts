import { Component, ChangeDetectionStrategy } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { NgIconComponent } from '@ng-icons/core';
import { ToastComponent } from '../toast/toast.component';
import { AuthService } from '@features/auth/services/auth.service';

@Component({
    selector: 'app-layout-shell',
    imports: [RouterOutlet, RouterLink, RouterLinkActive, NgIconComponent, ToastComponent],
    templateUrl: './layout-shell.component.html',
    styleUrl: './layout-shell.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LayoutShellComponent {
  readonly user = this.authService.getCurrentUser();
  readonly isAdmin = () => this.authService.isAdmin();

  constructor(
    private readonly authService: AuthService,
  ) {}

  logout(): void {
    this.authService.logout();
  }
}
