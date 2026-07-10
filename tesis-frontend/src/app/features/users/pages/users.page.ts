import { Component, signal, DestroyRef, inject, ChangeDetectionStrategy } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormsModule } from '@angular/forms';
import { NgClass } from '@angular/common';
import { NgIconComponent } from '@ng-icons/core';
import { UserService } from '../services/user.service';

@Component({
    selector: 'app-users-page',
    imports: [FormsModule, NgClass, NgIconComponent],
    templateUrl: './users.page.html',
    styleUrl: './users.page.scss',
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UsersPage {
  name = '';
  email = '';
  password = '';
  readonly loading = signal(false);
  readonly message = signal('');
  readonly success = signal(false);

  private readonly destroyRef = inject(DestroyRef);

  constructor(private readonly userService: UserService) {}

  createCajero(): void {
    if (!this.name || !this.email || !this.password) {
      this.message.set('Por favor completa todos los campos.');
      this.success.set(false);
      return;
    }

    this.loading.set(true);
    this.message.set('');

    this.userService.createCajero({ name: this.name, email: this.email, password: this.password })
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: () => {
          this.loading.set(false);
          this.success.set(true);
          this.message.set(`Cajero "${this.name}" creado exitosamente.`);
          this.name = '';
          this.email = '';
          this.password = '';
        },
        error: (err) => {
          this.loading.set(false);
          this.success.set(false);
          this.message.set(err.error?.message || 'Error al crear el cajero.');
        }
      });
  }
}
