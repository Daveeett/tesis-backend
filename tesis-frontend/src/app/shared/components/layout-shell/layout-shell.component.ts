import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet, Router } from '@angular/router';
import { NgIconComponent } from '@ng-icons/core';
import { CommonModule } from '@angular/common';
import { ToastComponent } from '../toast/toast.component';
import { AuthService } from '../../../features/auth/services/auth.service';

@Component({
    selector: 'app-layout-shell',
    imports: [RouterOutlet, RouterLink, RouterLinkActive, NgIconComponent, CommonModule, ToastComponent],
    templateUrl: './layout-shell.component.html',
    styleUrl: './layout-shell.component.scss'
})
export class LayoutShellComponent {
  readonly user = this.authService.getCurrentUser();
  readonly isAdmin = () => this.authService.isAdmin();

  constructor(
    private readonly authService: AuthService,
    private readonly router: Router,
  ) {}

  logout() {
    this.authService.logout();
  }
}
