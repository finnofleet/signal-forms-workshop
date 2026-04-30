/*
 * ================================================================
 * B – Validations & Submit
 * ================================================================
 * Learning goals:
 *  - Apply built-in validators (required, email, minLength, maxLength)
 *  - Write a custom synchronous validator with validate()
 *  - Write a cross-field validator (password confirmation)
 *  - Add async validation with debounce + validateHttp
 *  - Display field states: touched, invalid, pending, errors
 *  - Guard the submit button and use submit() for controlled submission
 *
 * ✅ PART A – Done when all built-in validators show correct errors  (15 min)
 * ✅ PART B – Done when strength + confirm-password errors appear     (10 min)
 * ✅ PART C – Done when username availability is checked live +
 *             submit shows a spinner and success message              (15 min)
 *
 * 💡 Hints are in the collapsible sections at the bottom of the page.
 * ================================================================
 */

import {Component, inject, signal} from '@angular/core';
import {
  debounce,
  email,
  form,
  FormField,
  maxLength,
  minLength,
  required,
  submit,
  validate,
  validateHttp,
  ValidationError,
} from '@angular/forms/signals';
import {ApiService} from '../../shared/services/api.service';

const API_BASE = 'https://signal-forms-workshop-api.matestefanczyk.workers.dev';

@Component({
  selector: 'app-b-validations-submit',
  standalone: true,
  imports: [FormField],
  templateUrl: './b-validations-submit.component.html',
  styleUrl: './b-validations-submit.component.css'
})
export class BValidationsSubmitComponent {
  private readonly api = inject(ApiService);

  protected readonly successMessage = signal<string | null>(null);

  // The model shape drives every field in the form.
  // Do not change this — all TODOs live in the form() schema below.
  protected readonly regModel = signal({
    username:        '',
    email:           '',
    password:        '',
    confirmPassword: '',
  });

  // TODO D-1: show a form errors summary below the form. See template for corresponding TODO

  protected readonly regForm = form(this.regModel, (f) => {

    // ── Part A: Built-in validators ──────────────────────────────────────────
    //
    // TODO A-1: Validate username
    //   required(f.username);
    //   minLength(f.username, 3);
    //   maxLength(f.username, 20);
    //
    // TODO A-2: Validate email
    //   required(f.email);
    //   email(f.email);
    //
    // TODO A-3: Validate password
    //   required(f.password);
    //   minLength(f.password, 8);
    //
    // TODO A-4: Validate confirmPassword (required only — cross-field comes in Part B)
    //   required(f.confirmPassword);

    // ── Part B: Custom validators ────────────────────────────────────────────
    //
    // TODO B-1: Password strength — add AFTER the built-in password validators.
    //   Use validate() to check that the password contains at least one
    //   uppercase letter, one digit, and one special character (!@#$%^&*).
    //   Return null if valid, or { kind: 'passwordStrength', message: '...' } if not.
    //
    //   validate(f.password, ({ value }) => {
    //     const v = value();
    //     const strong = /[A-Z]/.test(v) && /[0-9]/.test(v) && /[!@#$%^&*]/.test(v);
    //     return strong ? null : { kind: 'passwordStrength', message: 'Need uppercase, number, and special char (!@#$%^&*)' };
    //   });
    //
    // TODO B-2: Cross-field — confirmPassword must equal password.
    //   validate() receives valueOf — use it to read another field's current value.
    //   Angular tracks this as a dependency, so re-validation triggers when password changes.
    //
    //   validate(f.confirmPassword, ({ value, valueOf }) => {
    //     return value() !== valueOf(f.password)
    //       ? { kind: 'mismatch', message: 'Passwords do not match' }
    //       : null;
    //   });

    // ── Part C: Async validation ─────────────────────────────────────────────
    //
    // TODO C-1: Debounce username input so the API is not called on every keystroke.
    //   debounce(f.username, 400);
    //
    // TODO C-2: Check username availability via the API.
    //   validateHttp checks the field asynchronously — the field enters pending() state
    //   while the request is in flight.
    //
    //   validateHttp(f.username, {
    //     request: ({ value }) =>
    //       `${API_BASE}/api/auth/check-username?username=${encodeURIComponent(value())}`,
    //     onSuccess: (res: { available: boolean }) =>
    //       res.available ? null : { kind: 'taken', message: 'Username is already taken' },
    //     onError: () => ({ kind: 'networkError', message: 'Could not verify username — try again' }),
    //   });
  });

  // ── Part C: Submit ───────────────────────────────────────────────────────────
  //
  // TODO C-3: Use submit() to handle form submission.
  //   submit() only runs the action when the form is valid AND not pending.
  //   While running, regForm().submitting() is true — the template shows a spinner.
  //
  //   async performSubmit(): Promise<ValidationError[] | null> {
  //     // Simulate an API call — replace with this.api.register(...) if desired
  //     await new Promise(r => setTimeout(r, 1500));
  //     this.successMessage.set(`Welcome, ${this.regModel().username}!`);
  //     this.regForm().reset({ username: '', email: '', password: '', confirmPassword: '' });
  //     return null; // null = success, return ValidationError[] to map server errors to fields
  //   });

  async onSubmit(): Promise<void> {
    this.successMessage.set(null);
    // TODO C-3: Replace this stub with submit() ↑
    console.log('Form value:', this.regModel());
    alert('Implement submit() in TODO C-3!');
  }
}
