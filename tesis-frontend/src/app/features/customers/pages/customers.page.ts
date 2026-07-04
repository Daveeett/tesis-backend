import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { CustomerService } from '../services/customer.service';
import { Customer } from '.././models/customer.model';
import { SemaphoreBadgeComponent } from '../../../shared/components/semaphore-badge/semaphore-badge.component';
import { NgIconComponent } from '@ng-icons/core';

@Component({
    selector: 'app-customers-page',
    imports: [CommonModule, ReactiveFormsModule, SemaphoreBadgeComponent, NgIconComponent],
    templateUrl: './customers.page.html',
    styleUrl: './customers.page.scss'
})
export class CustomersPage {
  readonly customers = signal<Customer[]>([]);

  readonly form = this.fb.group({
    fullName: ['', [Validators.required]],
    docType: ['CI', [Validators.required]],
    docNumber: ['', [Validators.required]],
    phone: ['', [Validators.required]],
    email: [''],
  });

  constructor(
    private readonly fb: FormBuilder,
    private readonly customerService: CustomerService,
  ) {
    this.loadCustomers();
  }

  createCustomer() {
    if (this.form.invalid) {
      return;
    }

    const raw = this.form.getRawValue();
    const payload = {
      fullName: raw.fullName ?? '',
      docType: raw.docType ?? 'CI',
      docNumber: raw.docNumber ?? '',
      phone: raw.phone ?? '',
      email: raw.email ?? '',
    };

     this.customerService.createCustomer(payload).subscribe({
      next: () => {
        this.form.reset({
          fullName: '',
          docType: 'CI',
          docNumber: '',
          phone: '',
          email: '',
        });
        this.loadCustomers();
      },
    });
  }

  private loadCustomers() {
     this.customerService.getCustomers().subscribe({
      next: (response) => this.customers.set(response.data),
      error: () => this.customers.set([]),
    });
  }
}
