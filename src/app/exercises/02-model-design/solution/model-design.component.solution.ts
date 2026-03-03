import { Component, signal, inject, linkedSignal } from '@angular/core';
import {form, FormField, required, email, disabled, submit, FormRoot} from '@angular/forms/signals';
import { rxResource } from '@angular/core/rxjs-interop';
import { ApiService } from '../../../shared/services/api.service';
import { User } from '../../../shared/models/api.models';
import { firstValueFrom } from 'rxjs';
import { JsonPipe } from '@angular/common';

// ============================================
// Domain ↔ Form Model Types
// ============================================

interface UserFormModel {
  displayName: string;
  email: string;
  phone: string;
  street: string;
  city: string;
  postalCode: string;
}

const EMPTY_FORM: UserFormModel = {
  displayName: '',
  email: '',
  phone: '',
  street: '',
  city: '',
  postalCode: ''
};

function domainToForm(user: User): UserFormModel {
  return {
    displayName: user.name,
    email: user.email,
    phone: user.phone ?? '',
    street: user.address?.street ?? '',
    city: user.address?.city ?? '',
    postalCode: user.address?.postalCode ?? '',
  };
}

function formToDomain(formData: UserFormModel): Partial<User> {
  return {
    name: formData.displayName,
    email: formData.email,
    phone: formData.phone,
    address: {
      street: formData.street,
      city: formData.city,
      postalCode: formData.postalCode,
    }
  };
}

@Component({
  selector: 'app-model-design',
  standalone: true,
  imports: [FormField, JsonPipe, FormRoot],
  templateUrl: './model-design.component.solution.html',
  styleUrl: './model-design.component.solution.scss'
})
export class ModelDesignComponent {
  private readonly api = inject(ApiService);

  protected readonly successMessage = signal<string | null>(null);
  protected readonly errorMessage = signal<string | null>(null);

  // Load user from API with rxResource
  protected readonly userResource = rxResource({
    stream: () => this.api.getUser('demo')
  });

  // Derive form model from API resource using linkedSignal
  protected readonly formModel = linkedSignal(() => {
    const user = this.userResource.value();
    return user ? domainToForm(user) : EMPTY_FORM;
  });

  // Form with validation + disabled while loading
  protected readonly profileForm = form(this.formModel, (f) => {
    required(f.displayName);
    required(f.email);
    email(f.email);

    // Disable entire form while API data is loading
    disabled(f, () => this.userResource.isLoading());
  });

  async onSubmit() {
    this.successMessage.set(null);
    this.errorMessage.set(null);

    await submit(this.profileForm, async (formTree) => {
      try {
        const formData = formTree().value();
        const domainData = formToDomain(formData);

        const response = await firstValueFrom(
          this.api.updateUser('demo', domainData)
        );

        if (response.success) {
          this.successMessage.set('Profile updated successfully!');
        } else if (response.errors) {
          this.errorMessage.set('Failed to update profile.');
          return response.errors.map(err => ({
            kind: err.code.toLowerCase(),
            path: err.field,
            message: err.message
          }));
        }

        return null;
      } catch (error) {
        this.errorMessage.set('Failed to update profile. Please try again.');
        return null;
      }
    });
  }
}
