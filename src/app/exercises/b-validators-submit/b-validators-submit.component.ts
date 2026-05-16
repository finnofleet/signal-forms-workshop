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
 * ✅ PART B – Done when strength + confirm-password errors appear    (10 min)
 * ✅ PART C – Done when username availability is checked live +
 *             submit shows a spinner and success message             (15 min)
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
  FormRoot,
  maxLength,
  minLength,
  required,
  validate,
  validateHttp,
} from '@angular/forms/signals';
import {ApiService} from '../../shared/services/api.service';

const API_BASE = 'https://signal-forms-workshop-api.matestefanczyk.workers.dev';

@Component({
  selector: 'app-b-validators-submit',
  standalone: true,
  imports: [FormField, FormRoot],
  templateUrl: './b-validators-submit.component.html',
  styleUrl: './b-validators-submit.component.css'
})
export class BValidatorsSubmitComponent {
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

  protected readonly regForm = form(this.regModel, (f) => {

    // ── Part A: Built-in validators ──────────────────────────────────────────
    //
    // TODO A-1: Validate username: is required and should have length 3 - 20
    //
    // TODO A-2: Validate email: is required and of proper email format
    //
    // TODO A-3: Validate password: is required and should have length >= 8
    //
    // TODO A-4: Validate confirmPassword: required only — cross-field comes in Part B

    // ── Part B: Custom validators ────────────────────────────────────────────
    //
    // TODO B-1: Password strength — add AFTER the built-in password validators to only trigger if filled.
    //   Use validate() to check that the password contains at least one
    //   uppercase letter, one digit, and one special character (!@#$%^&*).
    //   Return null if valid, or { kind: 'passwordStrength', message: '...' } if not.
    //   Hints:
    //     pattern: /[A-Z]/.test(v) && /[0-9]/.test(v) && /[!@#$%^&*]/.test(v);
    //     error object: { kind: 'passwordStrength', message: 'Need uppercase, number, and special char (!@#$%^&*)' };
    //
    // TODO B-2: Cross-field — confirmPassword must equal password.
    //   validate() receives valueOf — use it to read another field's current value.
    //   Angular tracks this as a dependency, so re-validation triggers when password changes.
    //   Hints:
    //       error object: { kind: 'mismatch', message: 'Passwords do not match' }

    // ── Part C: Async validation ─────────────────────────────────────────────
    //
    // TODO C-1: Debounce username input so the API is not called on every keystroke.
    //
    // TODO C-2: Check username availability via the API.
    //   validateHttp checks the field asynchronously — the field enters pending() state
    //   while the request is in flight.
    //   Hints:
    //       use request, onSuccess, onError
    //       request URL: `${API_BASE}/api/auth/check-username?username=${encodeURIComponent(value())}`
    //       success but not available: { kind: 'taken', message: 'Username is already taken' }
    //       error: { kind: 'networkError', message: 'Could not verify username — try again' }
  }

    // ── Part C: Submit ───────────────────────────────────────────────────────────
    //
    // TODO C-3: Use the submission form option with action to handle form submission.
    //   The submit action is only run when the form is valid AND not pending.
    //   While running, regForm().submitting() is true — the template shows a spinner.
    //   Hints:
    //       simulate an API call with setTimeout(r, 1500)
    //       set successMessage: `Welcome, ${this.regModel().username}!`
    //       reset the form
    //       return null; // null = success, return ValidationError[] to map server errors from API call to fields
  );

  async onSubmit(): Promise<void> {
    this.successMessage.set(null);
    // TODO C-3: Remove this stub once you have the submission action ↑
    //  Also check the template for more related parts
    console.log('Form value:', this.regModel());
    alert('Implement submit() in TODO C-3!');
  }

  // TODO D-1: show a form errors summary below the form. See template for corresponding TODO

}
