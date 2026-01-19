/*
 * ================================================================
 * 🎯 EXERCISE GOAL: Validation - Built-in and Custom
 * ================================================================
 * You will learn:
 * - How to use built-in validators (required, email, minLength)
 * - How to create custom validators with validate()
 * - How to implement cross-field validation (password confirmation)
 * - How to understand automatic dependency tracking
 *
 * ✅ DONE WHEN:
 * - Username accepts only letters, numbers, and underscores
 * - Password requires min 8 characters + uppercase + digit
 * - confirmPassword checks match with password
 * - Password strength bar works correctly
 * - All errors display properly
 *
 * ⏱️ TIME: 10-12 minutes
 *
 * 💡 HINT: Check the "Custom Validator" and "Cross-Field Validation" sections!
 * ================================================================
 */

import { Component, signal, computed } from '@angular/core';
import { form, FormField, required, email, minLength, validate } from '@angular/forms/signals';

@Component({
  selector: 'app-validation',
  standalone: true,
  imports: [FormField],
  template: `
    <div class="exercise-container">
      <header class="exercise-header">
        <h1>02 - Validation Deep Dive</h1>
        <p class="subtitle">Custom validators, cross-field validation, reactive dependencies</p>
      </header>

      <div class="alert alert-info">
        <strong>🎯 Learning Goals:</strong>
        <ul>
          <li>Use built-in validators (required, email, minLength, pattern)</li>
          <li>Create custom validators with <code>validate()</code></li>
          <li>Implement cross-field validation (password confirmation)</li>
          <li>Understand automatic dependency tracking</li>
        </ul>
      </div>

      <section class="exercise-section">
        <h3>📝 Registration Form</h3>

        <form (submit)="onSubmit()">
          <div class="form-group">
            <label for="username">Username</label>
            <input
              id="username"
              type="text"
              class="form-control"
              [class.error]="regForm.username().touched() && regForm.username().invalid()"
              [class.success]="regForm.username().touched() && regForm.username().valid()"
              [formField]="regForm.username"
              placeholder="Choose a username"
            />
            @if (regForm.username().touched() && regForm.username().invalid()) {
              @for (err of regForm.username().errors(); track err.kind) {
                <div class="field-error">
                  @switch (err.kind) {
                    @case ('required') { Username is required }
                    @case ('minLength') { Username must be at least 3 characters }
                    @case ('invalidChars') { Only letters, numbers and underscore allowed }
                  }
                </div>
              }
            }
            @if (regForm.username().touched() && regForm.username().valid()) {
              <div class="field-success">Username looks good!</div>
            }
          </div>

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
            @if (regForm.password().value()) {
              <div class="password-strength">
                <div class="strength-bar">
                  <div
                    class="strength-fill"
                    [style.width.%]="passwordStrength().percent"
                    [style.background]="passwordStrength().color">
                  </div>
                </div>
                <span class="strength-label" [style.color]="passwordStrength().color">
                  {{ passwordStrength().label }}
                </span>
              </div>
            }
            @if (regForm.password().touched() && regForm.password().invalid()) {
              @for (err of regForm.password().errors(); track err.kind) {
                <div class="field-error">
                  @switch (err.kind) {
                    @case ('required') { Password is required }
                    @case ('minLength') { Password must be at least 8 characters }
                    @case ('weak') { {{ err.message }} }
                  }
                </div>
              }
            }
          </div>

          <div class="form-group">
            <label for="confirmPassword">Confirm Password</label>
            <input
              id="confirmPassword"
              type="password"
              class="form-control"
              [class.error]="regForm.confirmPassword().touched() && regForm.confirmPassword().invalid()"
              [class.success]="regForm.confirmPassword().touched() && regForm.confirmPassword().valid() && regForm.confirmPassword().value()"
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
            @if (regForm.confirmPassword().touched() && regForm.confirmPassword().valid() && regForm.confirmPassword().value()) {
              <div class="field-success">Passwords match!</div>
            }
          </div>

          <button type="submit" class="btn btn-primary" [disabled]="regForm().invalid()">
            Register
          </button>
        </form>
      </section>

      <section class="exercise-section">
        <h3>🔍 Form State (Debug)</h3>
        <div class="code-block">
          <pre>{{ formDebugInfo() }}</pre>
        </div>
      </section>

      <section class="exercise-section">
        <details class="hint-details">
          <summary class="hint-summary">
            <span class="hint-icon">💡</span>
            <span>Custom Validator Example (click to expand)</span>
          </summary>
          <div class="hint-content">
            <div class="code-block">
<pre>// Custom validator with validate()
validate(f.username, ({{ '{' }} value {{ '}' }}) => {{ '{' }}
  const username = value();
  if (!/^[a-zA-Z0-9_]+$/.test(username)) {{ '{' }}
  return {{ '{' }}
  kind: 'invalidChars',
      message: 'Only letters, numbers, underscore'
  {{ '}' }};
  {{ '}' }}
  return undefined; // valid
  {{ '}' }});</pre>
            </div>
          </div>
        </details>
      </section>

      <section class="exercise-section">
        <details class="hint-details">
          <summary class="hint-summary">
            <span class="hint-icon">💡</span>
            <span>Cross-Field Validation (click to expand)</span>
          </summary>
          <div class="hint-content">
            <div class="code-block">
<pre>// Cross-field: password confirmation
validate(f.confirmPassword, ({{ '{' }} value, valueOf {{ '}' }}) => {{ '{' }}
  const password = valueOf(f.password);  // Read OTHER field
  const confirm = value();               // Read THIS field

  if (password && confirm && password !== confirm) {{ '{' }}
  return {{ '{' }}
  kind: 'mismatch',
      message: 'Passwords do not match'
  {{ '}' }};
  {{ '}' }}
  return undefined;
  {{ '}' }});

// 🔥 MAGIC: This validator automatically re-runs
// when EITHER password OR confirmPassword changes!</pre>
            </div>
          </div>
        </details>
      </section>
    </div>
  `,
  styles: [`
    .password-strength {
      margin-top: 0.5rem;
      display: flex;
      align-items: center;
      gap: 0.75rem;
    }

    .strength-bar {
      flex: 1;
      height: 6px;
      background: #e4e7eb;
      border-radius: 3px;
      overflow: hidden;
    }

    .strength-fill {
      height: 100%;
      transition: width 0.3s ease, background 0.3s ease;
    }

    .strength-label {
      font-size: 0.8rem;
      font-weight: 600;
      min-width: 80px;
    }
  `]
})
export class ValidationComponent {
  // TODO 1: Create a form model with 4 fields (all strings)
  // username, email, password, confirmPassword
  protected readonly regModel = signal<{
    username: string;
    email: string;
    password: string;
    confirmPassword: string;
  }>({
    username: '',
    email: '',
    password: '',
    confirmPassword: ''
  });

  // TODO 2: Create form with validation
  protected readonly regForm = form(this.regModel, (f) => {
    // TODO 2a: Username validation
    // - required(f.username)
    // - minLength(f.username, 3)
    // - validate(f.username, ({ value }) => { ... })
    //   Check regex /^[a-zA-Z0-9_]+$/
    //   Return { kind: 'invalidChars', message: '...' } when invalid

    // TODO 2b: Email validation
    // - required(f.email)
    // - email(f.email)

    // TODO 2c: Password validation
    // - required(f.password)
    // - minLength(f.password, 8)
    // - validate(f.password, ({ value }) => { ... })
    //   Check for uppercase (regex /[A-Z]/)
    //   Check for digit (regex /[0-9]/)
    //   Return { kind: 'weak', message: '...' } when missing
    // Hint: See "Custom Validator Example" section

    // TODO 2d: Cross-field validation - confirmPassword
    // - required(f.confirmPassword)
    // - validate(f.confirmPassword, ({ value, valueOf }) => { ... })
    //   Use valueOf(f.password) to read password field
    //   Compare with value()
    //   Return { kind: 'mismatch', message: '...' } when different
    // Hint: See "Cross-Field Validation" section
  });

  // TODO 3: Create a computed signal calculating password strength
  // Return object: { percent: number, label: string, color: string }
  // Scoring:
  // - length >= 8: +25, >= 12: +15
  // - lowercase: +15, uppercase: +15, digit: +15, special char: +15
  // Labels:
  // - score < 30: { percent: score, label: 'Weak', color: '#f03e3e' }
  // - score < 60: { percent: score, label: 'Fair', color: '#fcc419' }
  // - score < 80: { percent: score, label: 'Good', color: '#51cf66' }
  // - score >= 80: { percent: 100, label: 'Strong', color: '#20c997' }
  protected passwordStrength = computed((): { percent: number; label: string; color: string } => {
    return { percent: 0, label: '', color: '#e4e7eb' };
  });

  // TODO 4: Create a function that returns JSON.stringify of form information
  protected formDebugInfo = (): string => {
    return JSON.stringify({}, null, 2);
  };

  onSubmit() {
    console.log('Registration submitted:', this.regModel());
    alert('Registration submitted! Check console for data.');
  }
}
