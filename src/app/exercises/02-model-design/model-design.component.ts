/*
 * ================================================================
 * 🎯 EXERCISE GOAL: Form Model Design
 * ================================================================
 * You will learn:
 * - linkedSignal to derive form model from API data
 * - httpResource (or rxResource) to load user from API
 * - domainToForm() / formToDomain() transformation functions
 * - disabled() validator while loading
 * - Form ↔ domain model separation concept
 *
 * ✅ DONE WHEN:
 * - User data loads from API into form fields
 * - Domain model transforms to form model (flat fields)
 * - Form model transforms back to domain model on submit
 * - Form is disabled while data loads
 * - Successful save shows confirmation
 *
 * ⏱️ TIME: 12-15 minutes
 *
 * 💡 HINT: Think about WHY domain and form models differ!
 * ================================================================
 */

import { Component, signal, inject, linkedSignal } from '@angular/core';
import {form, FormField, required, email, disabled, FormRoot} from '@angular/forms/signals';
import { rxResource } from '@angular/core/rxjs-interop';
import { ApiService } from '../../shared/services/api.service';
import { User } from '../../shared/models/api.models';
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

// TODO 1: Implement domainToForm() — transform User → UserFormModel
// - Map user.name → displayName
// - Flatten address fields (street, city, postalCode)
// - Handle optional address (default to '')
function domainToForm(user: User): UserFormModel {
  return EMPTY_FORM;
}

// TODO 2: Implement formToDomain() — transform UserFormModel → Partial<User>
// - Map displayName → name
// - Re-nest address fields into address object
function formToDomain(formData: UserFormModel): Partial<User> {
  return {};
}

@Component({
  selector: 'app-model-design',
  standalone: true,
  imports: [FormField, JsonPipe, FormRoot],
  templateUrl: './model-design.component.html',
  styleUrl: './model-design.component.scss'
})
export class ModelDesignComponent {
  private readonly api = inject(ApiService);

  protected readonly successMessage = signal<string | null>(null);
  protected readonly errorMessage = signal<string | null>(null);

  // TODO 3: Load user from API using rxResource
  protected readonly userResource = rxResource({
    stream: () => this.api.getUser('demo')
  });

  // TODO 4: Use linkedSignal to derive form model when userResource.value() changes
  protected readonly formModel = signal<UserFormModel>(EMPTY_FORM);

  // TODO 5: Create form with validation
  protected readonly profileForm = form(this.formModel, (f) => {
    // TODO 5a: displayName and email are required; email must be valid format

    // TODO 5b: Form should be disabled while data is loading from API
  });

  // TODO 6: Submit — transform form data back to domain model and call API
  async onSubmit() {
    this.successMessage.set(null);
    this.errorMessage.set(null);

    // TODO 6: Get form data, convert back to domain model, send to API, handle success/error
  }
}
