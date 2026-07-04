import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgIconComponent } from '@ng-icons/core';
import { AuthService } from '../../auth/services/auth.service';

@Component({
    selector: 'app-users-page',
    imports: [CommonModule, FormsModule, NgIconComponent],
    templateUrl: './users.page.html',
    styleUrl: './users.page.scss'
})
export class UsersPage implements OnInit {
  name = '';
  email = '';
  password = '';
  readonly loading = signal(false);
  readonly message = signal('');
  readonly success = signal(false);

  constructor(private readonly authService: AuthService) {}

  ngOnInit() {}

  createCajero() {
    if (!this.name || !this.email || !this.password) {
      this.message.set('Por favor completa todos los campos.');
      this.success.set(false);
      return;
    }

    this.loading.set(true);
    this.message.set('');

    this.authService.createCajero({ name: this.name, email: this.email, password: this.password }).subscribe({
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
