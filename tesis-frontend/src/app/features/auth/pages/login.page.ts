import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NgIconComponent } from '@ng-icons/core';
import { AuthService } from '../services/auth.service';
import { ToastService } from '../../../shared/services/toast.service';

@Component({
    selector: 'app-login-page',
    imports: [CommonModule, ReactiveFormsModule, NgIconComponent],
    templateUrl: './login.page.html',
    styleUrl: './login.page.scss'
})
export class LoginPage {
  readonly loading = signal(false);
  readonly error = signal('');

  readonly form = this.fb.group({
    email: ['admin@minimarket.local', [Validators.required, Validators.email]],
    password: ['Admin123*', [Validators.required]],
  });

  constructor(
    private readonly fb: FormBuilder,
    private readonly authService: AuthService,
    private readonly router: Router,
    private readonly toast: ToastService,
  ) {}

  submit() {
    if (this.form.invalid) {
      return;
    }

    this.loading.set(true);
    this.error.set('');

     this.authService.login(this.form.getRawValue() as { email: string; password: string }).subscribe({
       next: (res: any) => {
         this.loading.set(false);
         const role = res.data.user.role;
         this.toast.success(`Bienvenido/a${role === 'CAJERO' ? ' Cajero' : ''}!`);
         void this.router.navigateByUrl('/dashboard');
       },
      error: (err: Error) => {
        this.loading.set(false);
        this.error.set(err.message);
      },
    });
  }
}
