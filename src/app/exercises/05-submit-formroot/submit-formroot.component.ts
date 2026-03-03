/*
 * ================================================================
 * 🎯 EXERCISE GOAL: Submit & FormRoot
 * ================================================================
 * You will learn:
 * - submit() with options: action, onInvalid, ignoreValidators
 * - errorSummary() to collect all errors
 * - focusBoundControl() to auto-focus first invalid field
 * - FormRoot directive (declarative submit)
 * - submitting() state for loading UI
 * - reset() after successful submit
 *
 * ✅ DONE WHEN:
 * - Contact form validates all fields
 * - Invalid submit shows error summary at top
 * - First invalid field gets auto-focused
 * - FormRoot directive handles submit declaratively
 * - Loading spinner shows during submission
 * - Form resets after successful submit
 *
 * ⏱️ TIME: 10-12 minutes
 *
 * 💡 HINT: Check the "submit() options" and "FormRoot" sections!
 * ================================================================
 */

import { Component, signal } from '@angular/core';
import { form, FormField, FormRoot, required, email, minLength, submit } from '@angular/forms/signals';

interface ContactFormModel {
  name: string;
  email: string;
  subject: string;
  message: string;
  priority: 'low' | 'medium' | 'high';
}

@Component({
  selector: 'app-submit-formroot',
  standalone: true,
  imports: [FormField, FormRoot],
  templateUrl: './submit-formroot.component.html',
  styleUrl: './submit-formroot.component.scss'
})
export class SubmitFormrootComponent {
  protected readonly formErrors = signal<any[]>([]);
  protected readonly successMessage = signal<string | null>(null);

  protected readonly contactModel = signal<ContactFormModel>({
    name: '',
    email: '',
    subject: '',
    message: '',
    priority: 'medium'
  });

  // TODO 2: Create form with validation schema
  // Look at the template error messages to see which validators each field needs
  protected readonly contactForm = form(this.contactModel, (f) => {
    // Add validation here
  });

  // TODO 3: Implement submit with onInvalid handling
  async onSubmit() {
    this.formErrors.set([]);
    this.successMessage.set(null);

    // TODO 3: Use submit() with options object containing action and onInvalid callbacks
    // action: async callback that simulates API call, shows success message, resets model
    // onInvalid: callback that collects errors from form fields and sets formErrors signal
  }
}
