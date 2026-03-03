/*
 * ================================================================
 * 🎯 EXERCISE GOAL: Validation - Built-in and Cross-Field
 * ================================================================
 * You will learn:
 * - How to use built-in validators (required, email, minLength)
 * - How to implement cross-field validation (password confirmation)
 * - How to understand automatic dependency tracking
 *
 * ✅ DONE WHEN:
 * - Username is required (min 3 characters)
 * - Password requires min 8 characters
 * - confirmPassword checks match with password
 * - All errors display properly
 *
 * ⏱️ TIME: 8-10 minutes
 * ================================================================
 */

import { Component, signal } from '@angular/core';
import { form, FormField, required, email, minLength, validate } from '@angular/forms/signals';

@Component({
  selector: 'app-validation',
  standalone: true,
  imports: [FormField],
  template: `
    <div class="exercise-container">
      <header class="exercise-header">
        <h1>03 - Validation Deep Dive</h1>
        <p class="subtitle">Built-in validators & cross-field validation</p>
      </header>

      <section class="exercise-section">
        <h3>📝 Registration Form</h3>

        <form (submit)="onSubmit()">

          <!-- USERNAME -->
          <div class="form-group">
            <label for="username">Username</label>
            <input
              id="username"
              type="text"
              class="form-control"
              [class.error]="regForm.username().touched() && regForm.username().invalid()"
              [formField]="regForm.username"
              placeholder="Choose a username"
            />

            @if (regForm.username().touched() && regForm.username().invalid()) {
              @for (err of regForm.username().errors(); track err.kind) {
                <div class="field-error">
                  @switch (err.kind) {
                    @case ('required') { Username is required }
                    @case ('minLength') { Username must be at least 3 characters }
                  }
                </div>
              }
            }
          </div>

          <!-- EMAIL -->
          <div class="form-group">
            <label for="email">Email</label>
            <input
              id="email"
              type="email"
              class="form-control"
              [class.error]="regForm.email().touched() && regForm.email().invalid()"
              [formField]="regForm.email"
              placeholder="your@email.com"
            />

            @if (regForm.email().touched() && regForm.email().invalid()) {
              @for (err of regForm.email().errors(); track err.kind) {
                <div class="field-error">
                  @switch (err.kind) {
                    @case ('required') { Email is required }
                    @case ('email') { Please enter a valid email }
                  }
                </div>
              }
            }
          </div>

          <!-- PASSWORD -->
          <div class="form-group">
            <label for="password">Password</label>
            <input
              id="password"
              type="password"
              class="form-control"
              [class.error]="regForm.password().touched() && regForm.password().invalid()"
              [formField]="regForm.password"
              placeholder="Create a password"
            />

            @if (regForm.password().touched() && regForm.password().invalid()) {
              @for (err of regForm.password().errors(); track err.kind) {
                <div class="field-error">
                  @switch (err.kind) {
                    @case ('required') { Password is required }
                    @case ('minLength') { Password must be at least 8 characters }
                  }
                </div>
              }
            }
          </div>

          <!-- CONFIRM PASSWORD -->
          <div class="form-group">
            <label for="confirmPassword">Confirm Password</label>
            <input
              id="confirmPassword"
              type="password"
              class="form-control"
              [class.error]="regForm.confirmPassword().touched() && regForm.confirmPassword().invalid()"
              [formField]="regForm.confirmPassword"
              placeholder="Confirm your password"
            />

            @if (regForm.confirmPassword().touched() && regForm.confirmPassword().invalid()) {
              @for (err of regForm.confirmPassword().errors(); track err.kind) {
                <div class="field-error">
                  @switch (err.kind) {
                    @case ('required') { Please confirm your password }
                    @case ('mismatch') { Passwords do not match }
                  }
                </div>
              }
            }
          </div>

          <button type="submit" class="btn btn-primary" [disabled]="regForm().invalid()">
            Register
          </button>
        </form>
      </section>
    </div>
  `
})
export class ValidationComponent {

  protected readonly regModel = signal({
    username: '',
    email: '',
    password: '',
    confirmPassword: ''
  });

  // TODO 1: Add validation for each field
  // Look at the template error @switch blocks to see which error kinds each field expects
  // Cross-field validation: confirmPassword must match password
  // Hint: use validate() with valueOf() to read another field's value
  protected readonly regForm = form(this.regModel, (f) => {
    // Add validation here
  });

  protected formDebugInfo = (): string => {
    return JSON.stringify(this.regForm(), null, 2);
  };

  onSubmit() {
    console.log('Registration submitted:', this.regModel());
    alert('Registration submitted! Check console for data.');
  }
}
